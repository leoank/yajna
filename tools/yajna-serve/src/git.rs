//! The read-only git API under `/api/git/` (ADR-0038): what is uncommitted, staged and
//! recently committed in the git worktree a path is in, a unified diff of one file between
//! two points, and a file as it was at one.
//!
//! Paths are the files API's, `<root>/<segment>/...`, resolved by the same rules
//! (`files::resolve`); the worktree is the one the resolved directory is in. Everything
//! goes through the `git` CLI, as the rest of yajna does, with optional locks off so a
//! status never contends with an agent committing. The routes need only the roots, so a
//! program with no notebook can mount them on a directory of its own (`router`).

use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::sync::Arc;

use axum::body::Body;
use axum::extract::{FromRef, Query, State};
use axum::http::{header, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
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

/// The git routes alone, over `roots`: for a program that serves only these.
pub fn router(roots: Vec<Root>) -> Router {
    routes().with_state(Roots(Arc::new(roots)))
}

/// The git routes, for any state the roots can be taken from.
pub fn routes<S>() -> Router<S>
where
    S: Clone + Send + Sync + 'static,
    Roots: FromRef<S>,
{
    Router::new()
        .route("/api/git/status", get(status_handler))
        .route("/api/git/log", get(log_handler))
        .route("/api/git/diff", get(diff_handler))
        .route("/api/git/file", get(file_handler))
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
}

/// `git status --porcelain=v2 --branch -z` into a `Status`; paths below the top.
fn parse_status(raw: &[u8]) -> Status {
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
    Ok(Diff { from: from.to_string(), to: to.to_string(), diff: text, binary, truncated })
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
