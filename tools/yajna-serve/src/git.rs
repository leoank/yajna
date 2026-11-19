//! The read-only git API under `/api/git/` (ADR-0038): what is uncommitted, staged and
//! recently committed in the git worktree a path is in, a unified diff of one file between
//! two points, and a file as it was at one.
//!
//! Paths are the files API's, `<root>/<segment>/...`, resolved by the same rules
//! (`files::resolve`); the worktree is the one the resolved directory is in. Everything
//! goes through the `git` CLI, as the rest of yajna does, with optional locks off so a
//! status never contends with an agent committing. The routes need only the roots, so a
//! program with no notebook can mount them on a directory of its own (`router`).
//!
//! Three writes (ADR-0040): stage and unstage a file or one hunk, and commit what is
//! staged, each only what the view was shown: a hunk by the ID its diff gave it, a commit
//! by the staged tree its status gave. They pass the reviews' write check (the owner's
//! socket, or `--review` with its token and Origin); a server of the routes alone is
//! read-only.

use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::sync::Arc;

use axum::body::Body;
use axum::extract::{FromRef, Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};

use crate::files::{self, ApiError, Root};

/// A diff or a file bigger than this is cut off and said to be.
const CAP: usize = 4 << 20;
/// Commits per page of a log, unless asked for fewer.
const LOG_PAGE: usize = 30;

/// The roots the git API resolves paths under.
#[derive(Clone)]
pub struct Roots(pub Arc<Vec<Root>>);

/// Whether and by whom the writes may be used (ADR-0040).
#[derive(Clone)]
pub struct Writes {
    /// what a write over TCP must carry, `yajna serve --review`'s token
    pub(crate) token: Arc<Option<String>>,
    /// served on the owner's unix socket: no token needed (ADR-0036)
    pub(crate) local: bool,
    /// false: every write is refused
    pub(crate) on: bool,
}

/// The state of a server of the git routes alone: read-only.
#[derive(Clone)]
struct Alone(Roots);

impl FromRef<Alone> for Roots {
    fn from_ref(a: &Alone) -> Roots {
        a.0.clone()
    }
}

impl FromRef<Alone> for Writes {
    fn from_ref(_: &Alone) -> Writes {
        Writes { token: Arc::new(None), local: false, on: false }
    }
}

/// The git routes alone, over `roots`, read-only: for a program that serves only these.
pub fn router(roots: Vec<Root>) -> Router {
    routes().with_state(Alone(Roots(Arc::new(roots))))
}

/// The git routes, for any state the roots and the write rules can be taken from.
pub fn routes<S>() -> Router<S>
where
    S: Clone + Send + Sync + 'static,
    Roots: FromRef<S>,
    Writes: FromRef<S>,
{
    Router::new()
        .route("/api/git/status", get(status_handler))
        .route("/api/git/log", get(log_handler))
        .route("/api/git/diff", get(diff_handler))
        .route("/api/git/file", get(file_handler))
        .route("/api/git/stage", post(stage_handler))
        .route("/api/git/unstage", post(unstage_handler))
        .route("/api/git/commit", post(commit_handler))
}

fn err(code: StatusCode, msg: impl Into<String>) -> ApiError {
    ApiError(code, msg.into())
}

/// A request path in a worktree: the worktree's top directory, and the path below it.
struct InTree {
    top: PathBuf,
    /// below `top`, `/`-separated; empty for the top itself
    rel: String,
}

fn git(dir: &Path) -> Command {
    let mut c = Command::new("git");
    c.arg("-C")
        .arg(dir)
        .args(["-c", "core.quotePath=false", "-c", "color.ui=false"])
        .env("GIT_OPTIONAL_LOCKS", "0")
        .env("GIT_TERMINAL_PROMPT", "0");
    c
}

fn run(cmd: &mut Command) -> Result<Output, ApiError> {
    cmd.output()
        .map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git: {e}")))
}

fn ok(out: Output, what: &str) -> Result<Vec<u8>, ApiError> {
    if out.status.success() {
        Ok(out.stdout)
    } else {
        Err(err(
            StatusCode::BAD_REQUEST,
            format!("{what}: {}", String::from_utf8_lossy(&out.stderr).trim()),
        ))
    }
}

/// Where `path` is in its worktree. The path may name a file that is not there any more (a
/// deleted file's diff): then its directory is resolved and the name added.
fn locate(roots: &[Root], path: &str) -> Result<InTree, ApiError> {
    let path = path.trim_end_matches('/');
    let (abs, dir) = match files::resolve(roots, path) {
        Ok(t) if t.meta.is_dir() => (t.abs.clone(), t.abs),
        Ok(t) => {
            let dir = t.abs.parent().map(Path::to_path_buf).unwrap_or_default();
            (t.abs, dir)
        }
        Err(e) => {
            let Some((parent, name)) = path.rsplit_once('/') else {
                return Err(e);
            };
            if name.is_empty() || name == "." || name == ".." || name.contains(['\\', '\0']) {
                return Err(e);
            }
            let t = files::resolve(roots, parent)?;
            let rel = if t.rel.is_empty() { name.to_string() } else { format!("{}/{name}", t.rel) };
            // gone from disk, not hidden: what the viewer excludes stays out of reach
            if !t.meta.is_dir() || t.root.excluded(&rel, name) {
                return Err(e);
            }
            (t.abs.join(name), t.abs)
        }
    };
    let top = ok(
        run(git(&dir).args(["rev-parse", "--show-toplevel"]))?,
        "not in a git worktree",
    )
    .map_err(|_| err(StatusCode::NOT_FOUND, format!("{path}: not in a git worktree")))?;
    let top = PathBuf::from(String::from_utf8_lossy(&top).trim());
    // git answers with the real path; the root may reach it through a symlink
    let real = |p: &Path| std::fs::canonicalize(p).unwrap_or_else(|_| p.to_path_buf());
    let abs_real = match std::fs::canonicalize(&abs) {
        Ok(p) => p,
        Err(_) => real(abs.parent().unwrap_or(&abs)).join(abs.file_name().unwrap_or_default()),
    };
    let rel = abs_real
        .strip_prefix(real(&top))
        .map_err(|_| err(StatusCode::NOT_FOUND, format!("{path}: outside its worktree")))?
        .to_string_lossy()
        .replace('\\', "/");
    Ok(InTree { top, rel })
}

/// The API path of a file in a worktree, under the root holding it most closely, or `None`
/// when no root shows it (outside every root, or excluded).
fn api_path(roots: &[Root], top: &Path, rel: &str) -> Option<String> {
    let real = |p: &Path| std::fs::canonicalize(p).unwrap_or_else(|_| p.to_path_buf());
    let abs = real(top).join(rel);
    let mut best: Option<(usize, String)> = None;
    for r in roots {
        let base = real(&r.path);
        let Ok(below) = abs.strip_prefix(&base) else { continue };
        let below = below.to_string_lossy().replace('\\', "/");
        let excluded = below.split('/').scan(String::new(), |acc, seg| {
            if !acc.is_empty() {
                acc.push('/');
            }
            acc.push_str(seg);
            Some(r.excluded(acc, seg))
        });
        if below.is_empty() || excluded.into_iter().any(|x| x) {
            continue;
        }
        let depth = base.components().count();
        if best.as_ref().is_none_or(|(d, _)| depth > *d) {
            best = Some((depth, format!("{}/{below}", r.name)));
        }
    }
    best.map(|(_, p)| p)
}

// --- status ----------------------------------------------------------------------------

#[derive(Deserialize)]
struct PathQuery {
    path: String,
}

#[derive(Serialize, Debug, PartialEq)]
pub struct Changed {
    /// below the worktree's top
    pub rel: String,
    /// the files API's path for it, when a root shows it
    pub path: Option<String>,
    /// M modified, T type changed, A added, D deleted, R renamed, C copied, U unmerged, ?
    /// untracked
    pub status: char,
    /// what a rename or copy was made from, below the top
    #[serde(skip_serializing_if = "Option::is_none")]
    pub old: Option<String>,
}

#[derive(Serialize, Debug, Default)]
pub struct Status {
    pub worktree: PathBuf,
    /// `None` when detached
    pub branch: Option<String>,
    /// `None` before the first commit
    pub head: Option<String>,
    pub upstream: Option<String>,
    pub ahead: u32,
    pub behind: u32,
    pub unstaged: Vec<Changed>,
    pub staged: Vec<Changed>,
    pub untracked: Vec<Changed>,
    pub conflicted: Vec<Changed>,
    /// the tree of what is staged, which a commit carries back (ADR-0040); `None` while a
    /// conflict is unresolved
    pub tree: Option<String>,
}

/// `git status --porcelain=v2 --branch -z` into a `Status`; paths below the top.
pub(crate) fn parse_status(raw: &[u8]) -> Status {
    let text = String::from_utf8_lossy(raw);
    let mut fields = text.split('\0');
    let mut s = Status::default();
    let entry = |rel: &str, status: char, old: Option<String>| Changed {
        rel: rel.to_string(),
        path: None,
        status,
        old,
    };
    while let Some(line) = fields.next() {
        if let Some(h) = line.strip_prefix("# ") {
            let (key, value) = h.split_once(' ').unwrap_or((h, ""));
            match key {
                "branch.oid" if value != "(initial)" => s.head = Some(value.to_string()),
                "branch.head" if value != "(detached)" => s.branch = Some(value.to_string()),
                "branch.upstream" => s.upstream = Some(value.to_string()),
                "branch.ab" => {
                    for n in value.split(' ') {
                        if let Some(a) = n.strip_prefix('+') {
                            s.ahead = a.parse().unwrap_or(0);
                        } else if let Some(b) = n.strip_prefix('-') {
                            s.behind = b.parse().unwrap_or(0);
                        }
                    }
                }
                _ => {}
            }
            continue;
        }
        let kind = line.chars().next();
        match kind {
            Some('1') | Some('2') => {
                // 1 XY sub mH mI mW hH hI path; 2 adds Xscore before the path, and the old
                // path follows as the next field
                let n = if kind == Some('1') { 8 } else { 9 };
                let parts: Vec<&str> = line.splitn(n + 1, ' ').collect();
                let (Some(xy), Some(rel)) = (parts.get(1), parts.get(n)) else { continue };
                let old = (kind == Some('2')).then(|| fields.next().unwrap_or("").to_string());
                let mut xy = xy.chars();
                let (x, y) = (xy.next().unwrap_or('.'), xy.next().unwrap_or('.'));
                if x != '.' {
                    s.staged.push(entry(rel, x, old.clone()));
                }
                if y != '.' {
                    // the working tree's change is to the file as staged, renamed or not
                    s.unstaged.push(entry(rel, y, None));
                }
            }
            Some('u') => {
                if let Some(rel) = line.splitn(11, ' ').nth(10) {
                    s.conflicted.push(entry(rel, 'U', None));
                }
            }
            Some('?') => s.untracked.push(entry(&line[2..], '?', None)),
            _ => {}
        }
    }
    s
}

fn status(roots: &[Root], path: &str) -> Result<Status, ApiError> {
    let t = locate(roots, path)?;
    let raw = ok(
        run(git(&t.top).args([
            "status",
            "--porcelain=v2",
            "--branch",
            "-z",
            "--untracked-files=all",
        ]))?,
        "git status",
    )?;
    let mut s = parse_status(&raw);
    s.worktree = t.top.clone();
    s.tree = staged_tree(&t.top);
    for c in s
        .unstaged
        .iter_mut()
        .chain(&mut s.staged)
        .chain(&mut s.untracked)
        .chain(&mut s.conflicted)
    {
        c.path = api_path(roots, &t.top, &c.rel);
    }
    Ok(s)
}

async fn status_handler(State(Roots(roots)): State<Roots>, Query(q): Query<PathQuery>) -> Response {
    blocking(move || status(&roots, &q.path).map(|s| Json(s).into_response())).await
}

// --- log -------------------------------------------------------------------------------

#[derive(Deserialize)]
struct LogQuery {
    path: String,
    /// a commit: the page starts after it
    before: Option<String>,
    limit: Option<usize>,
}

#[derive(Serialize, Debug)]
pub struct Commit {
    pub sha: String,
    pub short: String,
    pub author: String,
    /// seconds since the epoch
    pub time: i64,
    pub parents: Vec<String>,
    pub subject: String,
    pub files: Vec<Changed>,
}

#[derive(Serialize, Debug)]
pub struct Log {
    pub worktree: PathBuf,
    pub commits: Vec<Commit>,
    /// pass as `before` for the next page
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next: Option<String>,
}

const RS: char = '\u{1e}';
const US: char = '\u{1f}';

/// `git log -z --name-status` with the format `RS sha US short US author US time US parents
/// US subject`: each record is the header, NUL, then status and path fields, NUL-separated
/// (a rename or copy has two paths).
fn parse_log(raw: &[u8]) -> Vec<Commit> {
    let text = String::from_utf8_lossy(raw);
    let mut out = Vec::new();
    for rec in text.split(RS).filter(|r| !r.is_empty()) {
        let (head, rest) = rec.split_once('\0').unwrap_or((rec, ""));
        let h: Vec<&str> = head.splitn(6, US).collect();
        if h.len() < 6 {
            continue;
        }
        let mut files = Vec::new();
        let mut f = rest.trim_start_matches(['\n', '\0']).split('\0').filter(|x| !x.is_empty());
        while let Some(st) = f.next() {
            let status = st.chars().next().unwrap_or('M');
            let Some(first) = f.next() else { break };
            if matches!(status, 'R' | 'C') {
                let Some(to) = f.next() else { break };
                files.push(Changed { rel: to.to_string(), path: None, status, old: Some(first.to_string()) });
            } else {
                files.push(Changed { rel: first.to_string(), path: None, status, old: None });
            }
        }
        out.push(Commit {
            sha: h[0].to_string(),
            short: h[1].to_string(),
            author: h[2].to_string(),
            time: h[3].parse().unwrap_or(0),
            parents: h[4].split(' ').filter(|p| !p.is_empty()).map(str::to_string).collect(),
            subject: h[5].trim_end_matches('\n').to_string(),
            files,
        });
    }
    out
}

/// A commit, a commit's parent, or one of the points of the working tree, as the API takes
/// them; refused otherwise, so nothing reaches git as an option.
fn point(p: &str) -> Result<&str, ApiError> {
    let commit = |s: &str| (4..=64).contains(&s.len()) && s.bytes().all(|b| b.is_ascii_hexdigit());
    let base = p.strip_suffix('^').unwrap_or(p);
    if matches!(p, "WORK" | "INDEX") || base == "HEAD" || commit(base) {
        Ok(p)
    } else {
        Err(err(StatusCode::BAD_REQUEST, format!("{p:?}: HEAD, INDEX, WORK or a commit (with ^ for its parent)")))
    }
}

fn log(roots: &[Root], path: &str, before: Option<&str>, limit: Option<usize>) -> Result<Log, ApiError> {
    let t = locate(roots, path)?;
    let limit = limit.unwrap_or(LOG_PAGE).clamp(1, 200);
    let mut cmd = git(&t.top);
    cmd.args(["log", "-z", "--name-status", "-M"])
        .arg(format!("--format={RS}%H{US}%h{US}%an{US}%at{US}%P{US}%s"))
        .arg(format!("-n{}", limit + 1 + before.is_some() as usize));
    if let Some(b) = before {
        if b.ends_with('^') || matches!(b, "WORK" | "INDEX") {
            return Err(err(StatusCode::BAD_REQUEST, "before: a commit"));
        }
        cmd.arg(point(b)?);
    }
    cmd.arg("--");
    if !t.rel.is_empty() {
        cmd.arg(&t.rel);
    }
    let out = run(&mut cmd)?;
    // a repository with no commits yet has no log
    let raw = if !out.status.success() && String::from_utf8_lossy(&out.stderr).contains("does not have any commits") {
        Vec::new()
    } else {
        ok(out, "git log")?
    };
    let mut commits = parse_log(&raw);
    if before.is_some() && !commits.is_empty() {
        commits.remove(0);
    }
    let next = (commits.len() > limit).then(|| {
        commits.truncate(limit);
        commits.last().map(|c| c.sha.clone()).unwrap_or_default()
    });
    for c in &mut commits {
        for f in &mut c.files {
            f.path = api_path(roots, &t.top, &f.rel);
        }
    }
    Ok(Log { worktree: t.top, commits, next })
}

async fn log_handler(State(Roots(roots)): State<Roots>, Query(q): Query<LogQuery>) -> Response {
    blocking(move || log(&roots, &q.path, q.before.as_deref(), q.limit).map(|l| Json(l).into_response())).await
}

// --- diff ------------------------------------------------------------------------------

#[derive(Deserialize)]
struct DiffQuery {
    path: String,
    /// the file's path before a rename, an API path too
    old: Option<String>,
    from: Option<String>,
    to: Option<String>,
}

#[derive(Serialize, Debug)]
pub struct Diff {
    pub from: String,
    pub to: String,
    /// a unified diff, empty when nothing differs
    pub diff: String,
    pub binary: bool,
    pub truncated: bool,
    /// its hunks in order, each with the ID a stage or unstage of it names (ADR-0040)
    pub hunks: Vec<Hunk>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
pub struct Hunk {
    /// its `@@ … @@` line
    pub header: String,
    /// a hash of its lines: the same hunk read again has the same ID, a changed one not
    pub id: String,
}

/// A diff's file header (everything before the first hunk) and its hunks, each with the
/// `@@` line and the lines under it, newline-terminated.
fn split_hunks(diff: &str) -> (String, Vec<String>) {
    let mut head = String::new();
    let mut hunks: Vec<String> = Vec::new();
    for line in diff.split_inclusive('\n') {
        if line.starts_with("@@") {
            hunks.push(String::new());
        }
        match hunks.last_mut() {
            Some(h) => h.push_str(line),
            None => head.push_str(line),
        }
    }
    (head, hunks)
}

/// FNV-1a over a hunk's text, in hex: stable across processes and builds.
fn hunk_id(text: &str) -> String {
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    for b in text.bytes() {
        h ^= b as u64;
        h = h.wrapping_mul(0x0100_0000_01b3);
    }
    format!("{h:016x}")
}

fn hunks_of(diff: &str) -> Vec<Hunk> {
    split_hunks(diff)
        .1
        .iter()
        .map(|h| Hunk { header: h.lines().next().unwrap_or("").to_string(), id: hunk_id(h) })
        .collect()
}

fn untracked(top: &Path, rel: &str) -> Result<bool, ApiError> {
    let out = ok(
        run(git(top).args(["status", "--porcelain", "-z", "--untracked-files=all", "--", rel]))?,
        "git status",
    )?;
    Ok(out.starts_with(b"?? "))
}

fn diff(roots: &[Root], path: &str, old: Option<&str>, from: &str, to: &str) -> Result<Diff, ApiError> {
    let (from, to) = (point(from)?, point(to)?);
    if from == "WORK" || (from == "INDEX" && to != "WORK") {
        return Err(err(StatusCode::BAD_REQUEST, "from must come before to: a commit, HEAD or INDEX, then INDEX or WORK or a commit"));
    }
    let t = locate(roots, path)?;
    let old = match old {
        Some(o) => {
            let o = locate(roots, o)?;
            if o.top != t.top {
                return Err(err(StatusCode::BAD_REQUEST, "old is in another worktree"));
            }
            Some(o.rel)
        }
        None => None,
    };
    let mut cmd = git(&t.top);
    cmd.args(["diff", "--no-ext-diff", "--no-textconv", "-M"]);
    if to == "WORK" && from != "INDEX" && untracked(&t.top, &t.rel)? {
        // a new file: everything in it is added
        cmd.args(["--no-index", "--", "/dev/null", &t.rel]);
    } else {
        match (from, to) {
            ("INDEX", "WORK") => {}
            (f, "WORK") => {
                cmd.arg(f);
            }
            (f, "INDEX") => {
                cmd.args(["--cached", f]);
            }
            (f, t) => {
                cmd.args([f, t]);
            }
        }
        cmd.arg("--");
        cmd.args(old.iter());
        cmd.arg(&t.rel);
    }
    let out = run(&mut cmd)?;
    // --no-index says 1 when the files differ
    if !out.status.success() && out.status.code() != Some(1) {
        ok(out, "git diff")?;
        unreachable!();
    }
    let truncated = out.stdout.len() > CAP;
    let text = String::from_utf8_lossy(&out.stdout[..out.stdout.len().min(CAP)]).into_owned();
    let binary = text.lines().any(|l| l.starts_with("Binary files ") && l.ends_with(" differ"));
    let hunks = if truncated { Vec::new() } else { hunks_of(&text) };
    Ok(Diff { from: from.to_string(), to: to.to_string(), diff: text, binary, truncated, hunks })
}

async fn diff_handler(State(Roots(roots)): State<Roots>, Query(q): Query<DiffQuery>) -> Response {
    blocking(move || {
        let from = q.from.as_deref().unwrap_or("HEAD");
        let to = q.to.as_deref().unwrap_or("WORK");
        diff(&roots, &q.path, q.old.as_deref(), from, to).map(|d| Json(d).into_response())
    })
    .await
}

// --- a file at a point -----------------------------------------------------------------

#[derive(Deserialize)]
struct FileQuery {
    path: String,
    at: Option<String>,
}

fn file_at(roots: &[Root], path: &str, at: &str) -> Result<Vec<u8>, ApiError> {
    let at = point(at)?;
    let t = locate(roots, path)?;
    if at == "WORK" {
        return std::fs::read(t.top.join(&t.rel)).map_err(|e| err(StatusCode::NOT_FOUND, format!("{path}: {e}")));
    }
    let spec = match at {
        "INDEX" => format!(":{}", t.rel),
        c => format!("{c}:{}", t.rel),
    };
    ok(run(git(&t.top).args(["show", "--no-textconv", &spec]))?, &format!("{path} at {at}"))
        .map_err(|e| ApiError(StatusCode::NOT_FOUND, e.1))
}

async fn file_handler(State(Roots(roots)): State<Roots>, Query(q): Query<FileQuery>) -> Response {
    blocking(move || {
        let bytes = file_at(&roots, &q.path, q.at.as_deref().unwrap_or("HEAD"))?;
        let text = files::is_text(&bytes[..bytes.len().min(8192)]);
        let mut res = Response::new(Body::from(bytes));
        let h = res.headers_mut();
        h.insert(
            header::CONTENT_TYPE,
            HeaderValue::from_static(if text { "text/plain; charset=utf-8" } else { "application/octet-stream" }),
        );
        h.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
        Ok(res)
    })
    .await
}

// --- writes (ADR-0040) -----------------------------------------------------------------

/// `git write-tree`: the tree of what is staged; `None` while a conflict is unresolved.
fn staged_tree(top: &Path) -> Option<String> {
    let out = git(top).arg("write-tree").output().ok()?;
    out.status.success().then(|| String::from_utf8_lossy(&out.stdout).trim().to_string())
}

fn has_head(top: &Path) -> bool {
    git(top).args(["rev-parse", "-q", "--verify", "HEAD"]).output().is_ok_and(|o| o.status.success())
}

fn check_write(w: &Writes, headers: &HeaderMap) -> Result<(), ApiError> {
    if !w.on {
        return Err(err(StatusCode::FORBIDDEN, "this server is read-only"));
    }
    if w.local {
        return Ok(());
    }
    crate::reviews::may_write(w.token.as_deref(), headers).map_err(|(s, m)| err(s, m))
}

#[derive(Deserialize)]
struct StageBody {
    path: String,
    /// a staged rename's other side, an API path
    old: Option<String>,
    /// one hunk, by the ID the diff gave it; none: the whole file
    hunk: Option<String>,
}

#[derive(Deserialize)]
struct CommitBody {
    /// any path in the worktree
    path: String,
    message: String,
    /// the staged tree the view's status gave
    tree: String,
}

/// Stage (or with `undo`, unstage) a file or one of its hunks; the worktree's status after.
fn stage(roots: &[Root], b: &StageBody, undo: bool) -> Result<Status, ApiError> {
    let t = locate(roots, &b.path)?;
    let old = match &b.old {
        Some(o) => Some(locate(roots, o)?.rel),
        None => None,
    };
    let refused = |m: &str| err(StatusCode::UNPROCESSABLE_ENTITY, m);
    match &b.hunk {
        None => {
            let mut cmd = git(&t.top);
            match (undo, has_head(&t.top)) {
                (false, _) => cmd.args(["add", "-A", "--"]),
                // from HEAD, both sides of a rename too (restore --staged refuses the old one)
                (true, true) => cmd.args(["reset", "-q", "--"]),
                // nothing committed yet: unstaging is taking it out of the index
                (true, false) => cmd.args(["rm", "--cached", "-q", "-r", "--"]),
            };
            cmd.args(old.iter()).arg(&t.rel);
            ok(run(&mut cmd)?, if undo { "git reset" } else { "git add" })
                .map_err(|e| refused(&e.1))?;
        }
        Some(id) => {
            if !undo && untracked(&t.top, &t.rel)? {
                return Err(refused("an untracked file is staged whole"));
            }
            // read the diff again, as the view read it, and take the hunk it showed
            let (from, to) = if undo { ("HEAD", "INDEX") } else { ("INDEX", "WORK") };
            let d = diff(roots, &b.path, b.old.as_deref(), from, to)?;
            if d.truncated || d.binary {
                return Err(refused("a hunk of a binary or cut-off diff cannot be staged on its own"));
            }
            let (head, hunks) = split_hunks(&d.diff);
            let Some(hunk) = hunks.iter().find(|h| hunk_id(h) == *id) else {
                return Err(err(StatusCode::CONFLICT, "that hunk has changed or gone since it was shown; read the diff again"));
            };
            let mut cmd = git(&t.top);
            cmd.args(["apply", "--cached", "--whitespace=nowarn"]);
            if undo {
                cmd.arg("--reverse");
            }
            cmd.arg("-").stdin(std::process::Stdio::piped()).stdout(std::process::Stdio::piped()).stderr(std::process::Stdio::piped());
            let mut child = cmd.spawn().map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git: {e}")))?;
            {
                use std::io::Write;
                let mut stdin = child.stdin.take().unwrap();
                stdin
                    .write_all(format!("{head}{hunk}").as_bytes())
                    .map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git apply: {e}")))?;
            }
            let out = child.wait_with_output().map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git: {e}")))?;
            ok(out, "git apply").map_err(|e| refused(&e.1))?;
        }
    }
    status(roots, &b.path)
}

#[derive(Serialize)]
struct Committed {
    commit: String,
    status: Status,
}

/// Commit what is staged, when it is what the view showed.
fn commit(roots: &[Root], b: &CommitBody) -> Result<Committed, ApiError> {
    let message = b.message.trim();
    if message.is_empty() {
        return Err(err(StatusCode::BAD_REQUEST, "a commit needs a message"));
    }
    let t = locate(roots, &b.path)?;
    if staged_tree(&t.top).as_deref() != Some(b.tree.as_str()) {
        return Err(err(StatusCode::CONFLICT, "what is staged is not what was shown; read the status again"));
    }
    let nothing = git(&t.top).args(["diff", "--cached", "--quiet"]).status().is_ok_and(|s| s.success()) && has_head(&t.top);
    if nothing {
        return Err(err(StatusCode::UNPROCESSABLE_ENTITY, "nothing is staged"));
    }
    let mut cmd = git(&t.top);
    cmd.args(["commit", "-q", "-F", "-"])
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped());
    let mut child = cmd.spawn().map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git: {e}")))?;
    {
        use std::io::Write;
        let mut stdin = child.stdin.take().unwrap();
        let _ = stdin.write_all(format!("{message}\n").as_bytes());
    }
    let out = child.wait_with_output().map_err(|e| err(StatusCode::INTERNAL_SERVER_ERROR, format!("git: {e}")))?;
    if !out.status.success() {
        // a hook that refused says why on either stream
        let said = format!("{}{}", String::from_utf8_lossy(&out.stdout), String::from_utf8_lossy(&out.stderr));
        return Err(err(StatusCode::UNPROCESSABLE_ENTITY, format!("git commit: {}", said.trim())));
    }
    let sha = ok(run(git(&t.top).args(["rev-parse", "HEAD"]))?, "git rev-parse")?;
    Ok(Committed { commit: String::from_utf8_lossy(&sha).trim().to_string(), status: status(roots, &b.path)? })
}

async fn stage_handler(State(Roots(roots)): State<Roots>, State(w): State<Writes>, headers: HeaderMap, Json(b): Json<StageBody>) -> Response {
    if let Err(e) = check_write(&w, &headers) {
        return e.into_response();
    }
    blocking(move || stage(&roots, &b, false).map(|s| Json(s).into_response())).await
}

async fn unstage_handler(State(Roots(roots)): State<Roots>, State(w): State<Writes>, headers: HeaderMap, Json(b): Json<StageBody>) -> Response {
    if let Err(e) = check_write(&w, &headers) {
        return e.into_response();
    }
    blocking(move || stage(&roots, &b, true).map(|s| Json(s).into_response())).await
}

async fn commit_handler(State(Roots(roots)): State<Roots>, State(w): State<Writes>, headers: HeaderMap, Json(b): Json<CommitBody>) -> Response {
    if let Err(e) = check_write(&w, &headers) {
        return e.into_response();
    }
    blocking(move || commit(&roots, &b).map(|c| Json(c).into_response())).await
}

async fn blocking(f: impl FnOnce() -> Result<Response, ApiError> + Send + 'static) -> Response {
    match tokio::task::spawn_blocking(f).await {
        Ok(Ok(r)) => r,
        Ok(Err(e)) => e.into_response(),
        Err(e) => err(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::files::Watch;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    /// git in the scratch repo, with no user configuration
    fn sh(dir: &Path, args: &[&str]) {
        let out = Command::new("git")
            .arg("-C")
            .arg(dir)
            .args(["-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null"])
            .args(args)
            .env("GIT_CONFIG_GLOBAL", "/dev/null")
            .env("GIT_CONFIG_NOSYSTEM", "1")
            .env("GIT_AUTHOR_NAME", "Ada")
            .env("GIT_AUTHOR_EMAIL", "ada@example.org")
            .env("GIT_COMMITTER_NAME", "Ada")
            .env("GIT_COMMITTER_EMAIL", "ada@example.org")
            .output()
            .unwrap();
        assert!(out.status.success(), "git {args:?}: {}", String::from_utf8_lossy(&out.stderr));
    }

    fn write(dir: &Path, rel: &str, text: &str) {
        let p = dir.join(rel);
        std::fs::create_dir_all(p.parent().unwrap()).unwrap();
        std::fs::write(p, text).unwrap();
    }

    /// A repository with two commits and, on top, one change of every kind: `notes/a.md`
    /// edited and staged then edited again, `notes/old.md` renamed to `notes/new.md` and
    /// staged, `notes/gone.md` deleted, `notes/fresh.md` untracked, `code/x.py` edited.
    /// Roots: `notes` (the vault), `repo` (the whole repository, `notes` excluded).
    fn scratch(name: &str) -> (PathBuf, Vec<Root>) {
        let dir = std::env::temp_dir().join(format!("yajna-serve-git-{}-{name}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        sh(&dir, &["init", "-q", "-b", "main"]);
        // an identity in the repository itself, which the server's own git (a commit from
        // the view) reads too; a sandbox has no global one to fall back on
        sh(&dir, &["config", "user.name", "Ada"]);
        sh(&dir, &["config", "user.email", "ada@example.org"]);
        write(&dir, "notes/a.md", "one\ntwo\n");
        write(&dir, "notes/old.md", "kept through a rename\nline\nline\nline\n");
        write(&dir, "notes/gone.md", "soon gone\n");
        write(&dir, "code/x.py", "print(1)\n");
        sh(&dir, &["add", "."]);
        sh(&dir, &["commit", "-q", "-m", "first"]);
        write(&dir, "notes/a.md", "one\ntwo\nthree\n");
        sh(&dir, &["commit", "-q", "-am", "second: a third line"]);
        write(&dir, "notes/a.md", "one\n2\nthree\n");
        sh(&dir, &["add", "notes/a.md"]);
        write(&dir, "notes/a.md", "one\n2\nthree\nfour\n");
        sh(&dir, &["mv", "notes/old.md", "notes/new.md"]);
        std::fs::remove_file(dir.join("notes/gone.md")).unwrap();
        write(&dir, "notes/fresh.md", "new\n");
        write(&dir, "code/x.py", "print(2)\n");
        let roots = vec![
            Root::new("notes", dir.join("notes"), &[], Watch::Off).unwrap(),
            Root::new("repo", dir.clone(), &["/notes".to_string()], Watch::Off).unwrap(),
        ];
        (dir, roots)
    }

    async fn get_json(r: &Router, uri: &str) -> (StatusCode, serde_json::Value) {
        let res = r.clone().oneshot(Request::builder().uri(uri).body(Body::empty()).unwrap()).await.unwrap();
        let status = res.status();
        let bytes = axum::body::to_bytes(res.into_body(), 1 << 24).await.unwrap();
        (status, serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::String(String::from_utf8_lossy(&bytes).into())))
    }

    fn names(v: &serde_json::Value, list: &str) -> Vec<String> {
        v[list]
            .as_array()
            .unwrap()
            .iter()
            .map(|c| format!("{} {} {}", c["status"].as_str().unwrap(), c["rel"].as_str().unwrap(), c["path"].as_str().unwrap_or("-")))
            .collect()
    }

    #[tokio::test]
    async fn status_lists_every_kind_of_change_with_the_path_a_root_shows_it_at() {
        let (dir, roots) = scratch("status");
        let r = router(roots);
        // from any directory of the worktree, under any root
        for at in ["notes", "repo/code", "repo"] {
            let (s, v) = get_json(&r, &format!("/api/git/status?path={at}")).await;
            assert_eq!(s, StatusCode::OK, "{v}");
            assert_eq!(v["branch"], "main");
            assert!(v["upstream"].is_null() && v["ahead"] == 0);
            assert_eq!(names(&v, "staged"), ["M notes/a.md notes/a.md", "R notes/new.md notes/new.md"], "{v}");
            assert_eq!(v["staged"][1]["old"], "notes/old.md");
            assert_eq!(
                names(&v, "unstaged"),
                ["M code/x.py repo/code/x.py", "M notes/a.md notes/a.md", "D notes/gone.md notes/gone.md"]
            );
            assert_eq!(names(&v, "untracked"), ["? notes/fresh.md notes/fresh.md"]);
            assert_eq!(std::fs::canonicalize(v["worktree"].as_str().unwrap()).unwrap(), std::fs::canonicalize(&dir).unwrap());
        }
    }

    #[tokio::test]
    async fn a_path_outside_a_worktree_or_the_roots_is_refused() {
        let outside = std::env::temp_dir().join(format!("yajna-serve-git-{}-plain", std::process::id()));
        let _ = std::fs::remove_dir_all(&outside);
        std::fs::create_dir_all(&outside).unwrap();
        let r = router(vec![Root::new("plain", outside.clone(), &[], Watch::Off).unwrap()]);
        let (s, v) = get_json(&r, "/api/git/status?path=plain").await;
        // a temporary directory may sit inside some repository; only then is it found
        if s != StatusCode::OK {
            assert_eq!(s, StatusCode::NOT_FOUND, "{v}");
            assert!(v["error"].as_str().unwrap().contains("not in a git worktree"), "{v}");
        }
        let (_, roots) = scratch("refused");
        let r = router(roots);
        for bad in ["nope", "notes/../code", "repo/notes/a.md", "repo/.git"] {
            let (s, v) = get_json(&r, &format!("/api/git/status?path={bad}")).await;
            assert!(s == StatusCode::NOT_FOUND || s == StatusCode::BAD_REQUEST, "{bad}: {s} {v}");
        }
    }

    #[tokio::test]
    async fn log_pages_commits_with_their_files() {
        let (_, roots) = scratch("log");
        let r = router(roots);
        let (s, v) = get_json(&r, "/api/git/log?path=repo").await;
        assert_eq!(s, StatusCode::OK, "{v}");
        let commits = v["commits"].as_array().unwrap();
        assert_eq!(commits.len(), 2);
        assert_eq!(commits[0]["subject"], "second: a third line");
        assert_eq!(commits[0]["author"], "Ada");
        assert_eq!(names(&commits[0], "files"), ["M notes/a.md notes/a.md"]);
        assert_eq!(commits[0]["parents"][0], commits[1]["sha"]);
        assert_eq!(commits[1]["files"].as_array().unwrap().len(), 4);
        assert!(v.get("next").is_none());

        // one at a time, then the next page from where it stopped
        let (_, v) = get_json(&r, "/api/git/log?path=repo&limit=1").await;
        assert_eq!(v["commits"].as_array().unwrap().len(), 1);
        let next = v["next"].as_str().unwrap().to_string();
        let (_, v) = get_json(&r, &format!("/api/git/log?path=repo&limit=1&before={next}")).await;
        assert_eq!(v["commits"][0]["subject"], "first");
        assert!(v.get("next").is_none(), "{v}");

        // a directory's log has only the commits that touched it
        let (_, v) = get_json(&r, "/api/git/log?path=repo/code").await;
        assert_eq!(v["commits"].as_array().unwrap().len(), 1);
        let (s, _) = get_json(&r, "/api/git/log?path=repo&before=--all").await;
        assert_eq!(s, StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn diff_between_any_two_points_of_one_file() {
        let (_, roots) = scratch("diff");
        let r = router(roots);
        let diff = |q: &str| {
            let r = r.clone();
            let q = q.to_string();
            async move {
                let (s, v) = get_json(&r, &format!("/api/git/diff?{q}")).await;
                assert_eq!(s, StatusCode::OK, "{q}: {v}");
                v["diff"].as_str().unwrap().to_string()
            }
        };
        // HEAD to the working tree, by default: both edits
        let d = diff("path=notes/a.md").await;
        assert!(d.contains("-two\n+2\n") && d.contains("+four\n"), "{d}");
        // staged only, and unstaged only
        let d = diff("path=notes/a.md&from=HEAD&to=INDEX").await;
        assert!(d.contains("+2\n") && !d.contains("four"), "{d}");
        let d = diff("path=notes/a.md&from=INDEX&to=WORK").await;
        assert!(d.contains("+four\n") && !d.contains("-two"), "{d}");
        // a commit against its parent
        let (_, v) = get_json(&r, "/api/git/log?path=notes&limit=1").await;
        let sha = v["commits"][0]["sha"].as_str().unwrap().to_string();
        let d = diff(&format!("path=notes/a.md&from={sha}^&to={sha}")).await;
        assert!(d.contains("+three\n") && !d.contains("four"), "{d}");
        // an untracked file is all added, a deleted one all removed
        let d = diff("path=notes/fresh.md").await;
        assert!(d.contains("+new\n"), "{d}");
        let d = diff("path=notes/gone.md").await;
        assert!(d.contains("-soon gone\n") && d.contains("deleted file"), "{d}");
        // a staged rename, with where it came from
        let d = diff("path=notes/new.md&old=notes/old.md&from=HEAD&to=INDEX").await;
        assert!(d.contains("rename from notes/old.md") && d.contains("rename to notes/new.md"), "{d}");
        // nothing that git would take as an option, and from comes first
        for bad in ["from=--output=/tmp/x", "to=-p", "from=WORK&to=HEAD", "from=main"] {
            let (s, v) = get_json(&r, &format!("/api/git/diff?path=notes/a.md&{bad}")).await;
            assert_eq!(s, StatusCode::BAD_REQUEST, "{bad}: {v}");
        }
    }

    #[tokio::test]
    async fn a_file_as_it_was_at_a_point() {
        let (_, roots) = scratch("file");
        let r = router(roots);
        let text = |q: &str| {
            let r = r.clone();
            let q = q.to_string();
            async move {
                let res = r.oneshot(Request::builder().uri(format!("/api/git/file?{q}")).body(Body::empty()).unwrap()).await.unwrap();
                let s = res.status();
                let b = axum::body::to_bytes(res.into_body(), 1 << 20).await.unwrap();
                (s, String::from_utf8_lossy(&b).into_owned())
            }
        };
        assert_eq!(text("path=notes/a.md").await, (StatusCode::OK, "one\ntwo\nthree\n".to_string()));
        assert_eq!(text("path=notes/a.md&at=INDEX").await.1, "one\n2\nthree\n");
        assert_eq!(text("path=notes/a.md&at=WORK").await.1, "one\n2\nthree\nfour\n");
        assert_eq!(text("path=notes/a.md&at=HEAD^").await.1, "one\ntwo\n");
        assert_eq!(text("path=notes/gone.md&at=HEAD").await.1, "soon gone\n");
        assert_eq!(text("path=notes/fresh.md&at=HEAD").await.0, StatusCode::NOT_FOUND);
    }

    /// The routes with writes on, as the owner's socket has them, or behind `token`.
    #[derive(Clone)]
    struct Open(Roots, Writes);

    impl FromRef<Open> for Roots {
        fn from_ref(o: &Open) -> Roots {
            o.0.clone()
        }
    }

    impl FromRef<Open> for Writes {
        fn from_ref(o: &Open) -> Writes {
            o.1.clone()
        }
    }

    fn writable(roots: Vec<Root>, token: Option<&str>) -> Router {
        let w = Writes { token: Arc::new(token.map(str::to_string)), local: token.is_none(), on: true };
        routes().with_state(Open(Roots(Arc::new(roots)), w))
    }

    async fn post(r: &Router, uri: &str, body: serde_json::Value, headers: &[(&str, &str)]) -> (StatusCode, serde_json::Value) {
        let mut req = Request::builder().method("POST").uri(uri).header("content-type", "application/json");
        for (k, v) in headers {
            req = req.header(*k, *v);
        }
        let res = r.clone().oneshot(req.body(Body::from(body.to_string())).unwrap()).await.unwrap();
        let status = res.status();
        let bytes = axum::body::to_bytes(res.into_body(), 1 << 24).await.unwrap();
        (status, serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::String(String::from_utf8_lossy(&bytes).into())))
    }

    #[tokio::test]
    async fn stage_and_unstage_a_file_or_one_hunk_only_as_shown() {
        let (dir, roots) = scratch("stage");
        // a file with two changes far apart: two hunks
        let long: String = (1..=40).map(|i| format!("line {i}\n")).collect();
        write(&dir, "code/long.txt", &long);
        sh(&dir, &["add", "code/long.txt"]);
        sh(&dir, &["commit", "-q", "-m", "long"]);
        write(&dir, "code/long.txt", &long.replace("line 3\n", "line three\n").replace("line 38\n", "line thirty-eight\n"));
        let r = writable(roots, None);

        // read-only without the write rules
        let (s, _) = post(&router(scratch("stage-ro").1), "/api/git/stage", serde_json::json!({ "path": "repo/code/x.py" }), &[]).await;
        assert_eq!(s, StatusCode::FORBIDDEN);

        // one hunk of two, by the ID the diff gave it
        let (_, d) = get_json(&r, "/api/git/diff?path=repo/code/long.txt&from=INDEX&to=WORK").await;
        let hunks = d["hunks"].as_array().unwrap();
        assert_eq!(hunks.len(), 2, "{d}");
        let first = hunks[0]["id"].as_str().unwrap().to_string();
        let (s, st) = post(&r, "/api/git/stage", serde_json::json!({ "path": "repo/code/long.txt", "hunk": first }), &[]).await;
        assert_eq!(s, StatusCode::OK, "{st}");
        assert!(names(&st, "staged").contains(&"M code/long.txt repo/code/long.txt".to_string()), "{st}");
        assert!(names(&st, "unstaged").contains(&"M code/long.txt repo/code/long.txt".to_string()), "half is left");
        let (_, staged) = get_json(&r, "/api/git/diff?path=repo/code/long.txt&from=HEAD&to=INDEX").await;
        let staged = staged["diff"].as_str().unwrap();
        assert!(staged.contains("+line three") && !staged.contains("thirty-eight"), "{staged}");

        // the agent edits the other hunk: its old ID is refused, nothing is staged unseen
        let second = hunks[1]["id"].as_str().unwrap().to_string();
        write(&dir, "code/long.txt", &long.replace("line 3\n", "line three\n").replace("line 38\n", "line 38, again\n"));
        let (s, v) = post(&r, "/api/git/stage", serde_json::json!({ "path": "repo/code/long.txt", "hunk": second }), &[]).await;
        assert_eq!(s, StatusCode::CONFLICT, "{v}");

        // the staged hunk back out, by the ID the staged diff gives it
        let (_, d) = get_json(&r, "/api/git/diff?path=repo/code/long.txt&from=HEAD&to=INDEX").await;
        let id = d["hunks"][0]["id"].as_str().unwrap().to_string();
        let (s, st) = post(&r, "/api/git/unstage", serde_json::json!({ "path": "repo/code/long.txt", "hunk": id }), &[]).await;
        assert_eq!(s, StatusCode::OK, "{st}");
        assert!(!names(&st, "staged").iter().any(|n| n.contains("long.txt")), "{st}");

        // whole files: an untracked one, and a deleted one; a hunk of an untracked file is refused
        let (s, _) = post(&r, "/api/git/stage", serde_json::json!({ "path": "notes/fresh.md", "hunk": "0" }), &[]).await;
        assert_eq!(s, StatusCode::UNPROCESSABLE_ENTITY);
        for p in ["notes/fresh.md", "notes/gone.md"] {
            let (s, st) = post(&r, "/api/git/stage", serde_json::json!({ "path": p }), &[]).await;
            assert_eq!(s, StatusCode::OK, "{p}: {st}");
        }
        let (_, st) = get_json(&r, "/api/git/status?path=notes").await;
        assert!(names(&st, "staged").contains(&"A notes/fresh.md notes/fresh.md".to_string()), "{st}");
        assert!(names(&st, "staged").contains(&"D notes/gone.md notes/gone.md".to_string()), "{st}");
        // and a whole file out again, the staged rename with both its sides
        let (s, st) = post(&r, "/api/git/unstage", serde_json::json!({ "path": "notes/new.md", "old": "notes/old.md" }), &[]).await;
        assert_eq!(s, StatusCode::OK, "{st}");
        assert!(!names(&st, "staged").iter().any(|n| n.contains("new.md") || n.contains("old.md")), "{st}");
    }

    #[tokio::test]
    async fn commit_only_what_was_shown_and_say_why_a_hook_refused() {
        let (dir, roots) = scratch("commit");
        let r = writable(roots, None);
        let (_, st) = get_json(&r, "/api/git/status?path=repo").await;
        let tree = st["tree"].as_str().unwrap().to_string();

        for (body, code) in [
            (serde_json::json!({ "path": "repo", "message": " ", "tree": tree }), StatusCode::BAD_REQUEST),
            (serde_json::json!({ "path": "repo", "message": "x", "tree": "0000" }), StatusCode::CONFLICT),
        ] {
            assert_eq!(post(&r, "/api/git/commit", body, &[]).await.0, code);
        }
        // a pre-commit hook that refuses: its words come back, nothing is committed
        std::fs::create_dir_all(dir.join(".git/hooks")).unwrap();
        let hook = dir.join(".git/hooks/pre-commit");
        std::fs::write(&hook, "#!/bin/sh\necho 'a file over git_max is staged' >&2\nexit 1\n").unwrap();
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&hook, std::fs::Permissions::from_mode(0o755)).unwrap();
        let (s, v) = post(&r, "/api/git/commit", serde_json::json!({ "path": "repo", "message": "staged work", "tree": tree }), &[]).await;
        assert_eq!(s, StatusCode::UNPROCESSABLE_ENTITY, "{v}");
        assert!(v["error"].as_str().unwrap().contains("over git_max"), "{v}");
        std::fs::remove_file(&hook).unwrap();

        let (s, v) = post(&r, "/api/git/commit", serde_json::json!({ "path": "repo", "message": "staged work\n\nfrom the view", "tree": tree }), &[]).await;
        assert_eq!(s, StatusCode::OK, "{v}");
        assert!(v["status"]["staged"].as_array().unwrap().is_empty(), "{v}");
        assert_eq!(v["status"]["head"], v["commit"]);
        let (_, l) = get_json(&r, "/api/git/log?path=repo&limit=1").await;
        assert_eq!(l["commits"][0]["subject"], "staged work");
        // nothing staged now
        let tree = v["status"]["tree"].as_str().unwrap().to_string();
        let (s, _) = post(&r, "/api/git/commit", serde_json::json!({ "path": "repo", "message": "again", "tree": tree }), &[]).await;
        assert_eq!(s, StatusCode::UNPROCESSABLE_ENTITY);
    }

    #[tokio::test]
    async fn over_tcp_writes_need_the_token_and_the_viewers_origin() {
        let (_, roots) = scratch("token");
        let r = writable(roots, Some("s3cret"));
        let body = || serde_json::json!({ "path": "repo/code/x.py" });
        assert_eq!(post(&r, "/api/git/stage", body(), &[]).await.0, StatusCode::FORBIDDEN);
        let wrong = [("x-yajna-token", "nope"), ("host", "localhost:8765"), ("origin", "http://localhost:8765")];
        assert_eq!(post(&r, "/api/git/stage", body(), &wrong).await.0, StatusCode::FORBIDDEN);
        let elsewhere = [("x-yajna-token", "s3cret"), ("host", "localhost:8765"), ("origin", "http://evil.example")];
        assert_eq!(post(&r, "/api/git/stage", body(), &elsewhere).await.0, StatusCode::FORBIDDEN);
        let right = [("x-yajna-token", "s3cret"), ("host", "localhost:8765"), ("origin", "http://localhost:8765")];
        let (s, v) = post(&r, "/api/git/stage", body(), &right).await;
        assert_eq!(s, StatusCode::OK, "{v}");
    }

    #[test]
    fn porcelain_v2_parsed() {
        let raw = b"# branch.oid abc\0# branch.head topic\0# branch.upstream origin/topic\0# branch.ab +2 -1\0\
1 .M N... 100644 100644 100644 h1 h2 a b.md\0\
2 R. N... 100644 100644 100644 h1 h2 R100 to.md\0from.md\0\
u UU N... 100644 100644 100644 100644 h1 h2 h3 both.md\0? new dir/f\0";
        let s = parse_status(raw);
        assert_eq!((s.branch.as_deref(), s.head.as_deref(), s.upstream.as_deref(), s.ahead, s.behind), (Some("topic"), Some("abc"), Some("origin/topic"), 2, 1));
        assert_eq!(s.unstaged, [Changed { rel: "a b.md".into(), path: None, status: 'M', old: None }]);
        assert_eq!(s.staged, [Changed { rel: "to.md".into(), path: None, status: 'R', old: Some("from.md".into()) }]);
        assert_eq!(s.conflicted[0].rel, "both.md");
        assert_eq!(s.untracked[0].rel, "new dir/f");
        let detached = parse_status(b"# branch.oid (initial)\0# branch.head (detached)\0");
        assert_eq!((detached.branch, detached.head), (None, None));
    }
}
