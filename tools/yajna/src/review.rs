//! Code review in the notebook (ADR-0030, `docs/review.md`): `REV` pages over a branch, a
//! commit range, a page, a run, an experiment or a project phase; threads anchored to
//! lines, replies appended, agents address and a human resolves.

use std::fs;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use regex::Regex;

use crate::cli::{PhaseAction, ReviewAction};
use crate::parallel::git;
use crate::vault::{date_of, rel, slugify, Page, Res, Vault, ID_FULL_RE};
use crate::yamlfmt::title_scalar;

static THREAD_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^### T(\d+) \((open|addressed|resolved|outdated)\) (.+?)\s*$").unwrap()
});
static LINES_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(.+?):(\d+)(?:-(\d+))? @ ([0-9a-f]{7,40})$").unwrap());
static HEADING_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(.+?)#(.+?) @ ([0-9a-f]{7,40})$").unwrap());
static REPLY_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(
        r"^- (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) (\S+?)(?: (addressed in ([0-9a-f]{7,40})|resolved|reopened))?(?:: (.*))?$",
    )
    .unwrap()
});
static ITEM_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^\s*- \[([ xX])\] (.*)$").unwrap());
static SINCE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\s*\(since ([0-9a-f]{7,40})\)").unwrap());
static AUTHOR_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(agent:)?[a-z][a-z0-9_-]*$").unwrap());

pub fn run(vault: &Vault, action: &ReviewAction) -> Res<i32> {
    match action {
        ReviewAction::Open {
            target,
            base,
            phase,
            paths,
            title,
            project,
            author,
        } => open(
            vault,
            target,
            phase.as_deref(),
            base,
            paths,
            title.as_deref(),
            project.as_deref(),
            author.as_deref(),
        ),
        ReviewAction::List { open, target } => list(vault, *open, target.as_deref()),
        ReviewAction::Update { review } => update(vault, review),
        ReviewAction::Show { review, diff } => show(vault, review, *diff),
        ReviewAction::Comment {
            review,
            at,
            text,
            author,
        } => comment(vault, review, at.as_deref(), text, author.as_deref()),
        ReviewAction::Reply {
            review,
            thread,
            text,
            author,
        } => act(vault, review, thread, Act::Reply, text, author.as_deref()),
        ReviewAction::Address {
            review,
            thread,
            commit,
            text,
            author,
        } => act(
            vault,
            review,
            thread,
            Act::Address(commit.clone()),
            text,
            author.as_deref(),
        ),
        ReviewAction::Resolve {
            review,
            thread,
            text,
            author,
        } => act(vault, review, thread, Act::Resolve, text, author.as_deref()),
        ReviewAction::Reopen {
            review,
            thread,
            text,
            author,
        } => act(vault, review, thread, Act::Reopen, text, author.as_deref()),
    }
}

// --- the page --------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq)]
enum Anchor {
    General,
    Lines {
        path: String,
        from: usize,
        to: usize,
        commit: String,
    },
    Heading {
        path: String,
        heading: String,
        commit: String,
    },
}

impl Anchor {
    fn parse(s: &str) -> Option<Anchor> {
        if s == "general" {
            return Some(Anchor::General);
        }
        if let Some(m) = LINES_RE.captures(s) {
            let from: usize = m[2].parse().ok()?;
            let to = m.get(3).map_or(Some(from), |t| t.as_str().parse().ok())?;
            return Some(Anchor::Lines {
                path: m[1].to_string(),
                from,
                to,
                commit: m[4].to_string(),
            });
        }
        HEADING_RE.captures(s).map(|m| Anchor::Heading {
            path: m[1].to_string(),
            heading: m[2].to_string(),
            commit: m[3].to_string(),
        })
    }

    fn render(&self) -> String {
        match self {
            Anchor::General => "general".to_string(),
            Anchor::Lines {
                path,
                from,
                to,
                commit,
            } if from == to => format!("{path}:{from} @ {commit}"),
            Anchor::Lines {
                path,
                from,
                to,
                commit,
            } => format!("{path}:{from}-{to} @ {commit}"),
            Anchor::Heading {
                path,
                heading,
                commit,
            } => format!("{path}#{heading} @ {commit}"),
        }
    }

    fn commit(&self) -> Option<&str> {
        match self {
            Anchor::General => None,
            Anchor::Lines { commit, .. } | Anchor::Heading { commit, .. } => Some(commit),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
enum Action {
    Addressed(String),
    Resolved,
    Reopened,
}

#[derive(Debug, Clone)]
struct Reply {
    author: String,
    action: Option<Action>,
    line: usize,
}

#[derive(Debug, Clone)]
struct Thread {
    n: usize,
    state: String,
    anchor: Option<Anchor>,
    raw_anchor: String,
    /// index of the heading line, and one past the thread's last line
    start: usize,
    end: usize,
    replies: Vec<Reply>,
}

impl Thread {
    /// The state the replies lead to.
    fn derived(&self) -> &'static str {
        let mut state = "open";
        for r in &self.replies {
            match r.action {
                Some(Action::Addressed(_)) => state = "addressed",
                Some(Action::Resolved) => state = "resolved",
                Some(Action::Reopened) => state = "open",
                None => {}
            }
        }
        state
    }
}

/// The threads of a review page's text, with what is wrong with them.
fn parse(text: &str) -> (Vec<Thread>, Vec<String>) {
    let lines: Vec<&str> = text.lines().collect();
    let mut problems = Vec::new();
    let mut threads: Vec<Thread> = Vec::new();
    let Some(start) = lines.iter().position(|l| l.trim_end() == "## Threads") else {
        return (threads, vec!["no ## Threads section".to_string()]);
    };
    let end = section_end(&lines, start);
    let mut i = start + 1;
    let mut fence: Option<&str> = None;
    while i < end {
        let line = lines[i];
        let lineno = i + 1;
        if let Some(f) = fence {
            if line.trim_start().starts_with(f) {
                fence = None;
            }
            i += 1;
            continue;
        }
        if let Some(m) = THREAD_RE.captures(line) {
            if let Some(t) = threads.last_mut() {
                t.end = i;
            }
            let anchor = Anchor::parse(&m[3]);
            if anchor.is_none() {
                problems.push(format!(
                    "line {lineno}: T{} anchor {:?} is not `path:from-to @ commit`, `path#heading @ commit` or `general`",
                    &m[1], &m[3]
                ));
            }
            threads.push(Thread {
                n: m[1].parse().unwrap_or(0),
                state: m[2].to_string(),
                anchor,
                raw_anchor: m[3].to_string(),
                start: i,
                end,
                replies: Vec::new(),
            });
        } else if line.starts_with("### ") {
            problems.push(format!(
                "line {lineno}: a thread heading is `### T<n> (<state>) <anchor>`"
            ));
        } else if line.trim().is_empty() {
            // blank lines separate threads
        } else if threads.is_empty() {
            problems.push(format!("line {lineno}: text before the first thread"));
        } else if let Some(f) = ["```", "~~~"]
            .into_iter()
            .find(|f| line.trim_start().starts_with(f))
        {
            fence = Some(f);
        } else if let Some(m) = REPLY_RE.captures(line) {
            let author = m[3].to_string();
            if !AUTHOR_RE.is_match(&author) {
                problems.push(format!("line {lineno}: {author:?} is not an author handle"));
            }
            let action = match m.get(4).map(|a| a.as_str()) {
                Some("resolved") => Some(Action::Resolved),
                Some("reopened") => Some(Action::Reopened),
                Some(_) => Some(Action::Addressed(m[5].to_string())),
                None => None,
            };
            if action.is_none() && m.get(6).is_none_or(|t| t.as_str().trim().is_empty()) {
                problems.push(format!("line {lineno}: a reply needs text after `:`"));
            }
            threads.last_mut().unwrap().replies.push(Reply {
                author,
                action,
                line: i,
            });
        } else if line.starts_with("  ") && threads.last().is_some_and(|t| !t.replies.is_empty()) {
            // a reply continued on the next line
        } else {
            problems.push(format!(
                "line {lineno}: expected a reply `- YYYY-MM-DD HH:MM <author>: <text>`"
            ));
        }
        i += 1;
    }
    if let Some(t) = threads.last_mut() {
        t.end = end;
    }
    if fence.is_some() {
        problems.push("a quote's code fence is not closed".to_string());
    }
    for (k, t) in threads.iter().enumerate() {
        if t.n != k + 1 {
            problems.push(format!(
                "T{} should be T{}: threads are numbered in order",
                t.n,
                k + 1
            ));
        }
        let derived = t.derived();
        let ok = t.state == derived || (t.state == "outdated" && derived != "resolved");
        if !ok {
            problems.push(format!(
                "T{} is marked ({}) but its replies leave it {derived}",
                t.n, t.state
            ));
        }
        for r in &t.replies {
            if r.action == Some(Action::Resolved) && r.author.starts_with("agent:") {
                problems.push(format!(
                    "line {}: T{} resolved by {}; only a human resolves a thread",
                    r.line + 1,
                    t.n,
                    r.author
                ));
            }
        }
    }
    (threads, problems)
}

/// One past the last line of the section whose heading is at `start`: the next `#` or `##`
/// heading outside a code fence (a quoted markdown heading is not one).
fn section_end(lines: &[impl AsRef<str>], start: usize) -> usize {
    let mut fence: Option<&str> = None;
    for (i, line) in lines.iter().enumerate().skip(start + 1) {
        let l = line.as_ref();
        let t = l.trim_start();
        match fence {
            Some(f) if t.starts_with(f) => fence = None,
            Some(_) => {}
            None if t.starts_with("```") => fence = Some("```"),
            None if t.starts_with("~~~") => fence = Some("~~~"),
            None if l.starts_with("## ") || l.starts_with("# ") => return i,
            None => {}
        }
    }
    lines.len()
}

/// Problems with a review page beyond its schema: threads, and commits that do not exist.
pub fn problems(vault: &Vault, page: &Page) -> Vec<String> {
    let (threads, mut out) = parse(&page.body);
    // line numbers in messages count from the top of the file
    let offset = fs::read_to_string(&page.path)
        .map(|t| t.lines().count() - page.body.lines().count())
        .unwrap_or(0);
    let shift = |m: String| match m.strip_prefix("line ").and_then(|r| r.split_once(':')) {
        Some((n, rest)) => match n.parse::<usize>() {
            Ok(n) => format!("line {}:{rest}", n + offset),
            Err(_) => m,
        },
        None => m,
    };
    out = out.into_iter().map(shift).collect();
    if !history_available(&vault.root) {
        return out;
    }
    let mut commits: Vec<(String, String)> = ["base", "head"]
        .iter()
        .filter_map(|k| Some((k.to_string(), page.field(k)?.to_string())))
        .collect();
    for t in &threads {
        if let Some(c) = t.anchor.as_ref().and_then(Anchor::commit) {
            commits.push((format!("T{} anchor", t.n), c.to_string()));
        }
        for r in &t.replies {
            if let Some(Action::Addressed(c)) = &r.action {
                commits.push((format!("T{} addressed", t.n), c.clone()));
            }
        }
    }
    for (what, sha) in commits {
        if git(
            &vault.root,
            &["cat-file", "-e", &format!("{sha}^{{commit}}")],
        )
        .is_err()
        {
            out.push(format!("{what}: commit {sha} is not in this repository"));
        }
    }
    out
}

/// Whether commits can be checked: a git checkout with its history (not CI's shallow clone).
fn history_available(root: &Path) -> bool {
    git(root, &["rev-parse", "--is-shallow-repository"]).is_ok_and(|s| s == "false")
}

// --- finding reviews -------------------------------------------------------------------

/// The roots of this notebook in every worktree of its repository, this one first.
fn worktree_roots(vault: &Vault) -> Vec<PathBuf> {
    let mut out = vec![vault.root.clone()];
    let (Ok(prefix), Ok(list)) = (
        git(&vault.root, &["rev-parse", "--show-prefix"]),
        git(&vault.root, &["worktree", "list", "--porcelain"]),
    ) else {
        return out;
    };
    let here = vault.root.canonicalize().unwrap_or(vault.root.clone());
    for wt in list.lines().filter_map(|l| l.strip_prefix("worktree ")) {
        let root = Path::new(wt).join(prefix.trim_end_matches('/'));
        let root = root.canonicalize().unwrap_or(root);
        if root != here && root.join(crate::vault::CONFIG_NAME).is_file() {
            out.push(root);
        }
    }
    out
}

/// The review with this ID, in this checkout or another worktree (a branch review lives on
/// its branch).
fn find(vault: &Vault, id: &str) -> Res<(Vault, Page)> {
    for root in worktree_roots(vault) {
        let Ok(v) = Vault::open(root) else { continue };
        if let Ok(page) = v.find(id) {
            if page.field("type") == Some("review") {
                return Ok((v, page));
            }
            return Err(format!("{id} is not a review"));
        }
    }
    Err(format!("{id}: no such review here or in another worktree"))
}

fn all_reviews(vault: &Vault) -> Vec<(PathBuf, Page)> {
    let mut out = Vec::new();
    let mut seen = std::collections::BTreeSet::new();
    for root in worktree_roots(vault) {
        let Ok(v) = Vault::open(root.clone()) else {
            continue;
        };
        for page in v.pages().unwrap_or_default() {
            if page.field("type") != Some("review") {
                continue;
            }
            if let Some(id) = page.id() {
                if seen.insert(id.to_string()) {
                    out.push((root.clone(), page));
                }
            }
        }
    }
    out
}

// --- open ------------------------------------------------------------------------------

struct Resolved {
    kind: &'static str,
    reference: String,
    base: String,
    head: String,
    paths: Vec<String>,
    project: Option<String>,
    title: String,
    /// where the page is written: the branch's worktree for a branch review
    home: PathBuf,
    /// the Progress item of a phase review
    phase: Option<String>,
    /// how the base was found, when it is a guess
    note: Option<String>,
}

fn rev(root: &Path, r: &str) -> Res<String> {
    git(
        root,
        &["rev-parse", "--verify", "-q", &format!("{r}^{{commit}}")],
    )
    .map_err(|_| {
        // a short SHA that names several commits
        let candidates = git(root, &["rev-parse", &format!("--disambiguate={r}")])
            .unwrap_or_default()
            .lines()
            .map(short)
            .collect::<Vec<_>>()
            .join(", ");
        if candidates.contains(", ") {
            format!("{r}: names several commits ({candidates}); give more of it")
        } else {
            format!("{r}: not a commit here")
        }
    })
}

fn short(sha: &str) -> &str {
    &sha[..sha.len().min(7)]
}

/// The worktree that has `branch` checked out, at the notebook's root inside it.
fn branch_worktree(vault: &Vault, branch: &str) -> Option<PathBuf> {
    let prefix = git(&vault.root, &["rev-parse", "--show-prefix"]).ok()?;
    let list = git(&vault.root, &["worktree", "list", "--porcelain"]).ok()?;
    list.split("\n\n").find_map(|block| {
        let on = block
            .lines()
            .find_map(|l| l.strip_prefix("branch refs/heads/"));
        if on != Some(branch) {
            return None;
        }
        let wt = block.lines().find_map(|l| l.strip_prefix("worktree "))?;
        Some(Path::new(wt).join(prefix.trim_end_matches('/')))
    })
}

/// A project whose directory slug is `slug`, for a branch `<slug>/<topic>`.
fn project_by_slug(vault: &Vault, slug: &str) -> Option<String> {
    if vault.is_project() {
        return vault.single_project().ok();
    }
    vault.pages().ok()?.into_iter().find_map(|p| {
        let id = p.id()?;
        let dir = p.path.parent()?.file_name()?.to_string_lossy().to_string();
        (p.field("type") == Some("project") && dir == format!("{id}-{slug}"))
            .then(|| id.to_string())
    })
}

fn resolve(vault: &Vault, target: &str, phase: Option<&str>, base_branch: &str) -> Res<Resolved> {
    let root = &vault.root;
    if let Some(item) = phase {
        return resolve_phase(vault, target, item);
    }
    if let Some((a, b)) = target.split_once("..") {
        let (base, head) = (rev(root, a)?, rev(root, b)?);
        return Ok(Resolved {
            kind: "range",
            reference: target.to_string(),
            title: format!("{}..{}", short(&base), short(&head)),
            base,
            head,
            paths: Vec::new(),
            project: None,
            home: vault.root.clone(),
            phase: None,
            note: None,
        });
    }
    if ID_FULL_RE.is_match(target) {
        let page = vault.find(target)?;
        match page.field("type") {
            Some("run") => return resolve_run(vault, &page),
            Some("experiment") => return resolve_experiment(vault, &page),
            _ => {}
        }
        let id = page.id().unwrap_or(target).to_string();
        let file = rel(&page.path, root).to_string();
        let mut paths = vec![file.clone()];
        // the page's own directory: a project's, or the sidecar named by its ID
        let sidecar = if page.path.file_name().is_some_and(|n| n == "README.md") {
            page.path.parent().map(Path::to_path_buf)
        } else {
            page.path.parent().map(|d| d.join(&id))
        };
        if let Some(d) = sidecar.filter(|d| d.is_dir()) {
            paths = vec![rel(&d, root).to_string()];
        }
        // the last approved review of the page, else the commit that created it
        let approved = all_reviews(vault)
            .into_iter()
            .filter(|(_, p)| {
                p.field("status") == Some("approved")
                    && p.meta
                        .as_ref()
                        .and_then(|m| m.get("target"))
                        .and_then(|t| t.get("ref"))
                        .and_then(|r| r.as_str())
                        == Some(id.as_str())
            })
            // date IDs sort by time: the newest approved review
            .filter_map(|(_, p)| Some((p.id()?.to_string(), p.field("head")?.to_string())))
            .max()
            .map(|(_, head)| head);
        let base = match approved {
            Some(h) => h,
            None => before_creation(root, &file)?,
        };
        let project = page
            .field("project")
            .map(str::to_string)
            .or_else(|| (page.field("type") == Some("project")).then(|| id.clone()));
        return Ok(Resolved {
            kind: "page",
            reference: id.clone(),
            title: format!("{id} {}", page.field("title").unwrap_or(""))
                .trim()
                .to_string(),
            base,
            head: rev(root, "HEAD")?,
            paths,
            project,
            home: vault.root.clone(),
            phase: None,
            note: None,
        });
    }
    if git(
        root,
        &[
            "rev-parse",
            "--verify",
            "-q",
            &format!("refs/heads/{target}"),
        ],
    )
    .is_ok()
    {
        let head = rev(root, target)?;
        let base_tip = rev(root, base_branch)?;
        let base = git(root, &["merge-base", &base_tip, &head])?;
        if base == head {
            return Err(format!(
                "{target} has no commits that {base_branch} does not have"
            ));
        }
        let home = branch_worktree(vault, target).ok_or_else(|| {
            format!(
                "{target} is not checked out anywhere; a branch review is written on its branch, so check it out (git worktree add) first"
            )
        })?;
        let slug = target.split('/').next().unwrap_or(target);
        return Ok(Resolved {
            kind: "branch",
            reference: target.to_string(),
            title: format!("branch {target}"),
            base,
            head,
            paths: Vec::new(),
            project: project_by_slug(vault, slug),
            home,
            phase: None,
            note: None,
        });
    }
    Err(format!("{target}: not a branch, a range A..B or an ID"))
}

/// The commit before the one that added `file`, so that a diff from it shows the addition.
fn before_creation(root: &Path, file: &str) -> Res<String> {
    let created = git(root, &["log", "--diff-filter=A", "--format=%H", "--", file])?;
    let created = created
        .lines()
        .last()
        .ok_or_else(|| format!("{file}: not committed yet; commit it before reviewing it"))?;
    Ok(git(root, &["rev-parse", &format!("{created}^")]).unwrap_or_else(|_| created.to_string()))
}

/// A page and its sidecar directory (named by its ID, beside it), as paths for a diff.
fn page_paths(vault: &Vault, page: &Page) -> Vec<String> {
    let mut out = vec![rel(&page.path, &vault.root).to_string()];
    if let (Some(dir), Some(id)) = (page.path.parent(), page.id()) {
        if dir.join(id).is_dir() {
            out.push(rel(&dir.join(id), &vault.root).to_string());
        }
    }
    out
}

/// The project's code in this repo, from its page's `code` field: a path, or nothing when
/// the code lives elsewhere (`github:…`) or there is none. `.` (a project repo) is everything,
/// which `paths` says by being empty.
fn code_paths(vault: &Vault, project: Option<&str>) -> Vec<String> {
    let code = project
        .and_then(|p| vault.find(p).ok())
        .and_then(|p| p.field("code").map(str::to_string));
    match code.as_deref() {
        Some(c) if !c.contains(':') && vault.root.join(c).exists() => vec![c.to_string()],
        _ => Vec::new(),
    }
}

fn joined(mut paths: Vec<String>, more: Vec<String>) -> Vec<String> {
    paths.extend(more);
    if paths.iter().any(|p| p == ".") {
        return Vec::new();
    }
    paths.dedup();
    paths
}

/// An experiment's runs in the order they ran: by `started`, then `created`, then ID.
fn runs_of(vault: &Vault, experiment: &str) -> Vec<Page> {
    let mut runs: Vec<Page> = vault
        .pages()
        .unwrap_or_default()
        .into_iter()
        .filter(|p| p.field("type") == Some("run") && p.field("experiment") == Some(experiment))
        .collect();
    let key = |p: &Page| {
        (
            p.field("started").unwrap_or("").to_string(),
            p.field("created").unwrap_or("").to_string(),
            p.id().unwrap_or("").to_string(),
        )
    };
    runs.sort_by_key(key);
    runs
}

/// The run before `run` in its experiment that records a commit.
fn previous_run(vault: &Vault, run: &Page) -> Option<Page> {
    let runs = runs_of(vault, run.field("experiment")?);
    let at = runs.iter().position(|p| p.id() == run.id())?;
    runs[..at]
        .iter()
        .rev()
        .find(|p| p.field("commit").is_some())
        .cloned()
}

fn resolve_run(vault: &Vault, run: &Page) -> Res<Resolved> {
    let root = &vault.root;
    let id = run.id().unwrap_or("").to_string();
    let commit = run
        .field("commit")
        .ok_or_else(|| format!("{id} records no commit; a run is reviewed at the commit it ran"))?;
    let head = rev(root, commit)?;
    let experiment = run.field("experiment").unwrap_or("").to_string();
    let (base, note) = match previous_run(vault, run) {
        Some(prev) => (
            rev(root, prev.field("commit").unwrap_or(""))?,
            format!(
                "Base: the commit of the previous run, [[{}]].",
                prev.id().unwrap_or("")
            ),
        ),
        None => {
            let exp = vault.find(&experiment)?;
            (
                before_creation(root, rel(&exp.path, root).as_ref())?,
                format!("Base: before [[{experiment}]] was created; it has no earlier run with a commit."),
            )
        }
    };
    let project = run.field("project").map(str::to_string);
    Ok(Resolved {
        kind: "run",
        reference: id.clone(),
        title: format!("{id} of {experiment}"),
        base,
        head,
        paths: joined(
            code_paths(vault, project.as_deref()),
            page_paths(vault, run),
        ),
        project,
        home: root.clone(),
        phase: None,
        note: Some(note),
    })
}

fn resolve_experiment(vault: &Vault, exp: &Page) -> Res<Resolved> {
    let root = &vault.root;
    let id = exp.id().unwrap_or("").to_string();
    let base = before_creation(root, rel(&exp.path, root).as_ref())?;
    let open = matches!(exp.field("status"), Some("planned" | "active") | None);
    let last = runs_of(vault, &id)
        .into_iter()
        .rev()
        .find_map(|r| Some((r.id()?.to_string(), r.field("commit")?.to_string())));
    let (head, note) = match last {
        Some((run, commit)) if !open => (
            rev(root, &commit)?,
            format!("Head: the commit of its last run, [[{run}]]."),
        ),
        _ if open => (
            rev(root, "HEAD")?,
            "Head: the current commit; the experiment is still open.".to_string(),
        ),
        _ => (
            rev(root, "HEAD")?,
            "Head: the current commit; no run records one.".to_string(),
        ),
    };
    let project = exp.field("project").map(str::to_string);
    Ok(Resolved {
        kind: "experiment",
        reference: id.clone(),
        title: format!("{id} {}", exp.field("title").unwrap_or(""))
            .trim()
            .to_string(),
        base,
        head,
        paths: joined(
            code_paths(vault, project.as_deref()),
            page_paths(vault, exp),
        ),
        project,
        home: root.clone(),
        phase: None,
        note: Some(note),
    })
}

/// A Progress item of a project page: its line index, whether it is ticked, and its text
/// without the checkbox.
#[derive(Debug)]
struct Item {
    line: usize,
    done: bool,
    text: String,
}

/// The items of the project page's `## Progress` section.
fn progress(text: &str) -> Vec<Item> {
    let lines: Vec<&str> = text.lines().collect();
    let Some(start) = lines.iter().position(|l| l.trim_end() == "## Progress") else {
        return Vec::new();
    };
    let end = section_end(&lines, start);
    (start + 1..end)
        .filter_map(|i| {
            let m = ITEM_RE.captures(lines[i])?;
            Some(Item {
                line: i,
                done: &m[1] != " ",
                text: m[2].to_string(),
            })
        })
        .collect()
}

/// The one Progress item whose text contains `words`, ignoring case, code spans and
/// emphasis.
fn find_item<'a>(items: &'a [Item], words: &str) -> Res<(usize, &'a Item)> {
    let plain = |t: &str| t.replace(['`', '*'], "").to_lowercase();
    let want = plain(words);
    let hits: Vec<(usize, &Item)> = items
        .iter()
        .enumerate()
        .filter(|(_, it)| plain(&it.text).contains(&want))
        .collect();
    match hits.as_slice() {
        [one] => Ok(*one),
        [] => Err(format!("no Progress item contains {words:?}")),
        many => Err(format!(
            "{words:?} is in {} Progress items; say more:\n{}",
            many.len(),
            many.iter()
                .map(|(_, it)| format!("  {}", it.text))
                .collect::<Vec<_>>()
                .join("\n")
        )),
    }
}

/// The item's text as a phase name: without `(since …)`.
fn phase_name(item: &Item) -> String {
    SINCE_RE.replace(&item.text, "").trim().to_string()
}

/// The commit that ticked an item: the first that added its line as it is now.
fn tick_commit(root: &Path, file: &str, line: &str) -> Res<String> {
    let found = git(
        root,
        &[
            "log",
            "--reverse",
            "--format=%H",
            "-S",
            line.trim(),
            "--",
            file,
        ],
    )?;
    found.lines().next().map(str::to_string).ok_or_else(|| {
        format!(
            "{file}: no commit added {:?}; commit the page first",
            line.trim()
        )
    })
}

fn resolve_phase(vault: &Vault, target: &str, words: &str) -> Res<Resolved> {
    let root = &vault.root;
    let page = vault.find(target)?;
    if page.field("type") != Some("project") {
        return Err(format!("--phase takes a project ID, not {target}"));
    }
    let id = page.id().unwrap_or(target).to_string();
    let file = rel(&page.path, root).to_string();
    let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
    let lines: Vec<&str> = text.lines().collect();
    let items = progress(&text);
    let (k, item) = find_item(&items, words)?;
    let (base, note) = match SINCE_RE.captures(&item.text) {
        Some(m) => (rev(root, &m[1])?, None),
        None => match k.checked_sub(1).map(|j| &items[j]).filter(|p| p.done) {
            Some(prev) => (
                tick_commit(root, &file, lines[prev.line])?,
                Some(format!(
                    "Base inferred: the commit that ticked the item before it, \"{}\"; with overlapping phases it is approximate. `yajna phase start` records the start.",
                    phase_name(prev)
                )),
            ),
            None => (
                before_creation(root, &file)?,
                Some("Base inferred: before the project page was created; no ticked item comes before it. `yajna phase start` records the start.".to_string()),
            ),
        },
    };
    let head = if item.done {
        tick_commit(root, &file, lines[item.line])?
    } else {
        rev(root, "HEAD")?
    };
    let notes = page.path.parent().map(|d| rel(d, root).to_string());
    let name = phase_name(item);
    Ok(Resolved {
        kind: "phase",
        reference: id.clone(),
        title: format!("{id} {name}"),
        base,
        head,
        paths: joined(code_paths(vault, Some(&id)), notes.into_iter().collect()),
        project: Some(id),
        home: root.clone(),
        phase: Some(name),
        note,
    })
}

/// `yajna phase start PRJ-… "<item>"`: append `(since <HEAD>)` to the item's line.
pub fn phase(vault: &Vault, action: &PhaseAction) -> Res<i32> {
    let PhaseAction::Start { project, item } = action;
    let words = one_line(item);
    let page = vault.find(project)?;
    if page.field("type") != Some("project") {
        return Err(format!("{project} is not a project"));
    }
    let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
    let items = progress(&text);
    let (_, it) = find_item(&items, &words)?;
    if it.done {
        return Err(format!("{:?} is done already", it.text));
    }
    if let Some(m) = SINCE_RE.captures(&it.text) {
        return Err(format!(
            "{:?} started already, at {}",
            phase_name(it),
            &m[1]
        ));
    }
    let head = rev(&vault.root, "HEAD")?;
    let mut lines: Vec<String> = text.lines().map(str::to_string).collect();
    lines[it.line] = format!("{} (since {})", lines[it.line].trim_end(), short(&head));
    fs::write(&page.path, lines.join("\n") + "\n").map_err(|e| e.to_string())?;
    println!("{}", lines[it.line].trim());
    Ok(0)
}

#[allow(clippy::too_many_arguments)]
fn open(
    vault: &Vault,
    target: &str,
    phase: Option<&str>,
    base_branch: &str,
    paths: &[String],
    title: Option<&str>,
    project: Option<&str>,
    author: Option<&str>,
) -> Res<i32> {
    let mut r = resolve(vault, target, phase, base_branch)?;
    if !paths.is_empty() {
        r.paths = paths.to_vec();
    }
    if let Some(p) = project {
        r.project = Some(vault.canonical_id(p));
    }
    let home = Vault::open(r.home.clone())?;
    let author = author
        .map(str::to_string)
        .unwrap_or_else(|| vault.default_author());
    let id = home.allocate("REV")?;
    let title = title.map(str::to_string).unwrap_or(r.title.clone());
    let paths_field = format!(
        "[{}]",
        r.paths
            .iter()
            .map(|p| serde_json::to_string(p).unwrap_or_default())
            .collect::<Vec<_>>()
            .join(", ")
    );
    let mut text = home.render(
        "review",
        &[
            ("id", &id),
            ("title", &title_scalar(&title)),
            ("project", r.project.as_deref().unwrap_or("null")),
            ("kind", r.kind),
            ("ref", &title_scalar(&r.reference)),
            ("base", &r.base),
            ("head", &r.head),
            ("paths", &paths_field),
            ("created", &date_of(&vault.now())),
            ("author", &author),
        ],
    )?;
    let at_ref = format!("\n  ref: {}\n", title_scalar(&r.reference));
    if let Some(name) = &r.phase {
        let with = format!("{}  phase: {}\n", at_ref, title_scalar(name));
        text = text.replacen(&at_ref, &with, 1);
    }
    if let Some(note) = &r.note {
        text = text.replacen("## Summary\n", &format!("## Summary\n{note}\n"), 1);
    }
    let dir = match &r.project {
        Some(p) => home.project_dir(p)?.join("reviews"),
        None => home.notes.join("reviews"),
    };
    let slug = slugify(&title);
    let path = dir.join(format!("{id}-{slug}.md"));
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
    println!("{}", shown(vault, &home, &path));
    let mut stat = vec!["diff", "--stat", "--format=", &r.base, &r.head, "--"];
    stat.extend(r.paths.iter().map(String::as_str));
    let files = git(&vault.root, &stat)
        .map(|s| s.lines().last().unwrap_or("").trim().to_string())
        .unwrap_or_default();
    println!(
        "{} {}: {}..{}{}",
        r.kind,
        r.reference,
        short(&r.base),
        short(&r.head),
        if files.is_empty() {
            ", no changes in its paths".to_string()
        } else {
            format!(", {files}")
        }
    );
    Ok(0)
}

/// A path relative to this checkout's root, or absolute when it is in another worktree.
fn shown(here: &Vault, home: &Vault, path: &Path) -> String {
    let same = here.root.canonicalize().ok() == home.root.canonicalize().ok();
    if same {
        rel(path, &home.root).to_string()
    } else {
        path.display().to_string()
    }
}

// --- reading ---------------------------------------------------------------------------

fn target_of(page: &Page) -> (String, String) {
    let t = page.meta.as_ref().and_then(|m| m.get("target"));
    let get = |k: &str| {
        t.and_then(|t| t.get(k))
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string()
    };
    (get("kind"), get("ref"))
}

fn list(vault: &Vault, only_open: bool, target: Option<&str>) -> Res<i32> {
    let mut n = 0;
    for (root, page) in all_reviews(vault) {
        let status = page.field("status").unwrap_or("");
        if only_open && !["open", "changes_requested"].contains(&status) {
            continue;
        }
        let (kind, reference) = target_of(&page);
        if target.is_some_and(|t| t != reference) {
            continue;
        }
        let (threads, _) = parse(&page.body);
        let open = threads
            .iter()
            .filter(|t| t.state == "open" || t.state == "addressed")
            .count();
        let elsewhere = if root.canonicalize().ok() == vault.root.canonicalize().ok() {
            String::new()
        } else {
            format!("  (in {})", root.display())
        };
        println!(
            "{:<22} {:<18} {} {}  {open}/{} open  {}{elsewhere}",
            page.id().unwrap_or(""),
            status,
            kind,
            reference,
            threads.len(),
            page.field("title").unwrap_or("")
        );
        n += 1;
    }
    if n == 0 {
        println!(
            "{}",
            if only_open {
                "no open reviews"
            } else {
                "no reviews"
            }
        );
    }
    Ok(0)
}

fn show(vault: &Vault, id: &str, diff: bool) -> Res<i32> {
    let (home, page) = find(vault, id)?;
    let (kind, reference) = target_of(&page);
    let base = page.field("base").unwrap_or("");
    let head = page.field("head").unwrap_or("");
    if diff {
        let mut args = vec!["diff", base, head, "--"];
        let paths: Vec<String> = page
            .meta
            .as_ref()
            .and_then(|m| m.get("paths"))
            .and_then(|p| p.as_array())
            .map(|a| {
                a.iter()
                    .filter_map(|v| v.as_str().map(str::to_string))
                    .collect()
            })
            .unwrap_or_default();
        args.extend(paths.iter().map(String::as_str));
        let status = std::process::Command::new("git")
            .arg("-C")
            .arg(&home.root)
            .args(&args)
            .status()
            .map_err(|e| format!("git: {e}"))?;
        if !status.success() {
            return Ok(1);
        }
        // a run's script is usually committed after the code it ran, so the two runs'
        // directories are compared as they are now
        if kind == "run" {
            let run = home.find(&reference)?;
            if let Some(prev) = previous_run(&home, &run) {
                let dir = |p: &Page| p.path.parent().map(|d| d.join(p.id().unwrap_or("")));
                if let (Some(a), Some(b)) = (dir(&prev), dir(&run)) {
                    if a.is_dir() && b.is_dir() {
                        println!(
                            "\n# {} and {} as they are now",
                            prev.id().unwrap_or(""),
                            reference
                        );
                        std::process::Command::new("git")
                            .arg("-C")
                            .arg(&home.root)
                            .args(["diff", "--no-index", "--"])
                            .arg(rel(&a, &home.root).as_ref() as &str)
                            .arg(rel(&b, &home.root).as_ref() as &str)
                            .status()
                            .map_err(|e| format!("git: {e}"))?;
                    }
                }
            }
        }
        return Ok(0);
    }
    println!(
        "{id}  {}\n{kind} {reference}: {}..{}  status {}\n{}",
        page.field("title").unwrap_or(""),
        short(base),
        short(head),
        page.field("status").unwrap_or(""),
        shown(vault, &home, &page.path)
    );
    let lines: Vec<&str> = page.body.lines().collect();
    let (threads, problems) = parse(&page.body);
    for t in &threads {
        println!();
        for line in &lines[t.start..t.end] {
            if !line.trim().is_empty() {
                println!("{line}");
            }
        }
    }
    for p in problems {
        eprintln!("note: {p}");
    }
    Ok(0)
}

// --- update ----------------------------------------------------------------------------

/// Where `path` went between two commits: itself, its new name, or nowhere.
fn followed(root: &Path, from: &str, to: &str, path: &str) -> Option<String> {
    let changes = git(
        root,
        &["diff", "-M", "--relative", "--name-status", from, to],
    )
    .ok()?;
    for line in changes.lines() {
        let f: Vec<&str> = line.split('\t').collect();
        match f.as_slice() {
            [s, old, new] if s.starts_with('R') && *old == path => return Some(new.to_string()),
            [s, old, _] if s.starts_with('R') && *old == path => return None,
            ["D", old] if *old == path => return None,
            _ => {}
        }
    }
    Some(path.to_string())
}

/// Where `quoted` sits in `file`: exactly, else ignoring whitespace; the start nearest to
/// `near` (1-based) wins.
fn relocate(file: &[&str], quoted: &[&str], near: usize) -> Option<usize> {
    if quoted.is_empty() || quoted.len() > file.len() {
        return None;
    }
    let squash = |l: &str| l.split_whitespace().collect::<String>();
    let starts = |same: &dyn Fn(&str, &str) -> bool| -> Vec<usize> {
        (0..=file.len() - quoted.len())
            .filter(|&i| quoted.iter().enumerate().all(|(k, q)| same(file[i + k], q)))
            .map(|i| i + 1)
            .collect()
    };
    let mut found = starts(&|a, b| a == b);
    if found.is_empty() {
        found = starts(&|a, b| squash(a) == squash(b));
    }
    found.into_iter().min_by_key(|&s| s.abs_diff(near))
}

/// The anchor of a thread at `head`, or `None` when what it pointed at is gone.
fn reanchor(root: &Path, anchor: &Anchor, head: &str) -> Option<Anchor> {
    let commit = anchor.commit()?;
    let show = |c: &str, p: &str| git(root, &["show", &format!("{c}:./{p}")]).ok();
    match anchor {
        Anchor::General => None,
        Anchor::Lines { path, from, to, .. } => {
            let old = show(commit, path)?;
            let old: Vec<&str> = old.lines().collect();
            let quoted = old.get(from - 1..*to)?;
            let path = followed(root, commit, head, path)?;
            let new = show(head, &path)?;
            let new: Vec<&str> = new.lines().collect();
            let at = relocate(&new, quoted, *from)?;
            Some(Anchor::Lines {
                path,
                from: at,
                to: at + quoted.len() - 1,
                commit: short(head).to_string(),
            })
        }
        Anchor::Heading { path, heading, .. } => {
            let path = followed(root, commit, head, path)?;
            let new = show(head, &path)?;
            new.lines()
                .any(|l| l.starts_with('#') && l.trim_start_matches('#').trim() == heading)
                .then(|| Anchor::Heading {
                    path,
                    heading: heading.clone(),
                    commit: short(head).to_string(),
                })
        }
    }
}

fn update(vault: &Vault, id: &str) -> Res<i32> {
    let (home, page) = find(vault, id)?;
    let (kind, reference) = target_of(&page);
    let old = page.field("head").unwrap_or("").to_string();
    let head = match kind.as_str() {
        "branch" => rev(&home.root, &reference)?,
        "range" => {
            let (_, b) = reference.split_once("..").unwrap_or(("", &reference));
            rev(&home.root, b)?
        }
        _ => {
            let phase = page
                .meta
                .as_ref()
                .and_then(|m| m.get("target"))
                .and_then(|t| t.get("phase"))
                .and_then(|p| p.as_str());
            resolve(&home, &reference, phase, "main")?.head
        }
    };
    if head == old {
        println!("{id}: head is {} already", short(&head));
        return Ok(0);
    }
    let (threads, _) = parse(&page.body);
    let mut headings = Vec::new();
    for t in &threads {
        let Some(anchor) = &t.anchor else { continue };
        if !matches!(t.state.as_str(), "open" | "addressed") || *anchor == Anchor::General {
            continue;
        }
        let (state, now) = match reanchor(&home.root, anchor, &head) {
            Some(a) => (t.state.clone(), a.render()),
            None => ("outdated".to_string(), t.raw_anchor.clone()),
        };
        println!(
            "T{} {}",
            t.n,
            if state == "outdated" {
                format!("outdated: {} is gone", t.raw_anchor)
            } else {
                now.clone()
            }
        );
        headings.push((t.start, format!("### T{} ({state}) {now}", t.n)));
    }
    let offset = body_offset(&page)?;
    rewrite(&page, |lines| {
        let at = lines[..offset]
            .iter()
            .position(|l| l.starts_with("head:"))
            .ok_or("no head: in the frontmatter")?;
        lines[at] = format!("head: {head}");
        for (start, heading) in headings {
            lines[offset + start] = heading;
        }
        Ok(())
    })?;
    println!("{id}: head {} -> {}", short(&old), short(&head));
    Ok(0)
}

// --- writing ---------------------------------------------------------------------------

fn author_of(vault: &Vault, author: Option<&str>) -> Res<String> {
    let a = author
        .map(str::to_string)
        .unwrap_or_else(|| vault.default_author());
    if !AUTHOR_RE.is_match(&a) {
        return Err(format!("{a}: not an author handle"));
    }
    Ok(a)
}

fn stamp(vault: &Vault) -> String {
    vault.now().strftime("%Y-%m-%d %H:%M").to_string()
}

fn one_line(words: &[String]) -> String {
    words
        .join(" ")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ")
}

/// Rewrite the body of a review page with `edit` and write it back, keeping the
/// frontmatter as it is.
fn rewrite(page: &Page, edit: impl FnOnce(&mut Vec<String>) -> Res<()>) -> Res<()> {
    let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
    let mut lines: Vec<String> = text.lines().map(str::to_string).collect();
    edit(&mut lines)?;
    fs::write(&page.path, lines.join("\n") + "\n").map_err(|e| e.to_string())
}

/// The fenced quote of `lines` with a fence they do not contain.
fn quote(lines: &[&str], path: &str) -> Res<Vec<String>> {
    let fence = ["```", "~~~"]
        .into_iter()
        .find(|f| !lines.iter().any(|l| l.trim_start().starts_with(f)))
        .ok_or("these lines contain both ``` and ~~~ fences; comment on a narrower range")?;
    let lang = Path::new(path)
        .extension()
        .map(|e| e.to_string_lossy().to_string())
        .unwrap_or_default();
    let mut out = vec![format!("{fence}{lang}")];
    out.extend(lines.iter().map(|l| l.to_string()));
    out.push(fence.to_string());
    Ok(out)
}

fn comment(
    vault: &Vault,
    id: &str,
    at: Option<&str>,
    words: &[String],
    author: Option<&str>,
) -> Res<i32> {
    let text = one_line(words);
    if text.is_empty() {
        return Err("nothing to say".to_string());
    }
    let author = author_of(vault, author)?;
    let (home, page) = find(vault, id)?;
    let head = page.field("head").unwrap_or("").to_string();
    let at_head = short(&head).to_string();
    let (anchor, quoted) = match at {
        None => (Anchor::General, Vec::new()),
        Some(at) => {
            let (path, which) = match at.split_once('#') {
                Some((p, h)) => (p, Err(h)),
                None => match at.rsplit_once(':') {
                    Some((p, l)) => (p, Ok(l)),
                    None => {
                        return Err(format!(
                            "--at {at}: <path>:<from>[-<to>] or <path>#<heading>"
                        ))
                    }
                },
            };
            let content = git(&home.root, &["show", &format!("{head}:./{path}")])
                .map_err(|_| format!("{path} is not in the review's head {at_head}"))?;
            let file: Vec<&str> = content.lines().collect();
            match which {
                Ok(range) => {
                    let (from, to) = match range.split_once('-') {
                        Some((a, b)) => (a.parse::<usize>(), b.parse::<usize>()),
                        None => (range.parse::<usize>(), range.parse::<usize>()),
                    };
                    let (Ok(from), Ok(to)) = (from, to) else {
                        return Err(format!("--at {at}: lines are <from> or <from>-<to>"));
                    };
                    if from == 0 || to < from || to > file.len() {
                        return Err(format!(
                            "--at {at}: {path} has {} lines at {at_head}",
                            file.len()
                        ));
                    }
                    (
                        Anchor::Lines {
                            path: path.to_string(),
                            from,
                            to,
                            commit: at_head.clone(),
                        },
                        quote(&file[from - 1..to], path)?,
                    )
                }
                Err(heading) => {
                    let line = file
                        .iter()
                        .find(|l| l.starts_with('#') && l.trim_start_matches('#').trim() == heading)
                        .ok_or_else(|| format!("{path} has no heading {heading:?} at {at_head}"))?;
                    (
                        Anchor::Heading {
                            path: path.to_string(),
                            heading: heading.to_string(),
                            commit: at_head.clone(),
                        },
                        quote(&[line], path)?,
                    )
                }
            }
        }
    };
    let (threads, _) = parse(&page.body);
    let n = threads.len() + 1;
    let offset = body_offset(&page)?;
    rewrite(&page, |lines| {
        let start = (offset..lines.len())
            .find(|&i| lines[i].trim_end() == "## Threads")
            .ok_or("no ## Threads section")?;
        let end = section_end(lines, start);
        let at = (start..end)
            .rev()
            .find(|&i| !lines[i].trim().is_empty())
            .map_or(start + 1, |i| i + 1);
        let mut new = vec![
            String::new(),
            format!("### T{n} (open) {}", anchor.render()),
        ];
        new.extend(quoted);
        new.push(format!("- {} {author}: {text}", stamp(vault)));
        if at < lines.len() {
            new.push(String::new());
        }
        lines.splice(at..at, new);
        Ok(())
    })?;
    println!(
        "{id} T{n} ({}) {}",
        anchor.render(),
        shown(vault, &home, &page.path)
    );
    Ok(0)
}

/// Lines in the file before the page body (frontmatter).
fn body_offset(page: &Page) -> Res<usize> {
    let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
    Ok(text.lines().count() - page.body.lines().count())
}

enum Act {
    Reply,
    Address(Option<String>),
    Resolve,
    Reopen,
}

fn act(
    vault: &Vault,
    id: &str,
    thread: &str,
    what: Act,
    words: &[String],
    author: Option<&str>,
) -> Res<i32> {
    let author = author_of(vault, author)?;
    let (home, page) = find(vault, id)?;
    let n: usize = thread
        .trim_start_matches(['T', 't'])
        .parse()
        .map_err(|_| format!("{thread}: a thread is T<n>"))?;
    let (threads, _) = parse(&page.body);
    let t = threads
        .iter()
        .find(|t| t.n == n)
        .ok_or_else(|| format!("{id} has no thread T{n}"))?
        .clone();
    let text = one_line(words);
    let (state, line) = match &what {
        Act::Reply => {
            if text.is_empty() {
                return Err("nothing to say".to_string());
            }
            (t.state.clone(), format!("{author}: {text}"))
        }
        Act::Address(commit) => {
            if t.state == "resolved" {
                return Err(format!("T{n} is resolved; reopen it first"));
            }
            if text.is_empty() {
                return Err("say what changed".to_string());
            }
            let sha = rev(&vault.root, commit.as_deref().unwrap_or("HEAD"))?;
            let (kind, reference) = target_of(&page);
            if kind == "branch"
                && git(
                    &home.root,
                    &["merge-base", "--is-ancestor", &sha, &reference],
                )
                .is_err()
            {
                return Err(format!(
                    "{} is not on {reference}; address a thread with a commit on the branch under review",
                    short(&sha)
                ));
            }
            (
                "addressed".to_string(),
                format!("{author} addressed in {}: {text}", short(&sha)),
            )
        }
        Act::Resolve => {
            if author.starts_with("agent:") {
                return Err(format!(
                    "{author}: only a human resolves a thread; reply, or mark it addressed"
                ));
            }
            if t.state == "resolved" {
                return Err(format!("T{n} is resolved already"));
            }
            let tail = if text.is_empty() {
                String::new()
            } else {
                format!(": {text}")
            };
            ("resolved".to_string(), format!("{author} resolved{tail}"))
        }
        Act::Reopen => {
            if t.state != "resolved" && t.state != "addressed" {
                return Err(format!("T{n} is {} already", t.state));
            }
            let tail = if text.is_empty() {
                String::new()
            } else {
                format!(": {text}")
            };
            ("open".to_string(), format!("{author} reopened{tail}"))
        }
    };
    let offset = body_offset(&page)?;
    rewrite(&page, |lines| {
        let heading = offset + t.start;
        lines[heading] = format!("### T{n} ({state}) {}", t.raw_anchor);
        let at = (offset + t.start..offset + t.end)
            .rev()
            .find(|&i| !lines[i].trim().is_empty())
            .map_or(offset + t.end, |i| i + 1);
        lines.insert(at, format!("- {} {line}", stamp(vault)));
        Ok(())
    })?;
    println!("{id} T{n} ({state}) {}", shown(vault, &home, &page.path));
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    const PAGE: &str = "\n## Summary\n\n## Threads\n\n### T1 (addressed) code/x.py:3-4 @ a1da1b4\n```py\nx = 1\ny = 2\n```\n- 2026-10-26 14:02 ank: why a fixed 32?\n- 2026-10-26 14:31 agent:claude-vpi addressed in 5e6f7a8: reads the job's cores\n\n### T2 (resolved) general\n- 2026-10-26 14:05 ank: note the reuse\n  on the run page\n- 2026-10-26 15:10 ank resolved\n\n### T3 (open) notes/a.md#Plan @ a1da1b4\n~~~md\n## Plan\n~~~\n- 2026-10-26 15:12 agent:claude: the plan skips step 2\n";

    #[test]
    fn threads_parse() {
        let (threads, problems) = parse(PAGE);
        assert!(problems.is_empty(), "{problems:?}");
        assert_eq!(threads.len(), 3);
        assert_eq!(
            threads[0].anchor,
            Some(Anchor::Lines {
                path: "code/x.py".into(),
                from: 3,
                to: 4,
                commit: "a1da1b4".into()
            })
        );
        assert_eq!(threads[0].derived(), "addressed");
        assert_eq!(threads[1].anchor, Some(Anchor::General));
        assert_eq!(threads[1].derived(), "resolved");
        assert_eq!(
            threads[2].anchor.as_ref().map(Anchor::render).as_deref(),
            Some("notes/a.md#Plan @ a1da1b4")
        );
        assert_eq!(threads[2].replies[0].author, "agent:claude");
    }

    #[test]
    fn bad_threads_are_reported() {
        let bad = PAGE
            .replace("### T2 (resolved)", "### T2 (open)")
            .replace("15:10 ank resolved", "15:10 agent:claude resolved")
            .replace("### T3", "### T4");
        let (_, problems) = parse(&bad);
        let all = problems.join("\n");
        assert!(
            all.contains("T2 is marked (open) but its replies leave it resolved"),
            "{all}"
        );
        assert!(
            all.contains("resolved by agent:claude; only a human"),
            "{all}"
        );
        assert!(all.contains("T4 should be T3"), "{all}");
        let (_, problems) = parse(&PAGE.replace("- 2026-10-26 14:05 ank: note", "note"));
        assert!(
            problems.iter().any(|p| p.contains("expected a reply")),
            "{problems:?}"
        );
    }

    #[test]
    fn quoted_lines_are_found_again() {
        let file = ["a", "b", "x", "  c  ", "b", "x"];
        // the nearest of two exact matches
        assert_eq!(relocate(&file, &["b", "x"], 1), Some(2));
        assert_eq!(relocate(&file, &["b", "x"], 6), Some(5));
        // whitespace only when nothing matches exactly
        assert_eq!(relocate(&file, &["x", "c"], 1), Some(3));
        assert_eq!(relocate(&file, &["gone"], 1), None);
    }

    #[test]
    fn progress_items_are_matched_by_words() {
        let page = "## Progress\n- [x] `Setup` it\n- [ ] Speed it up (since abc1234)\n- [ ] Write it up\n\n## Lessons\n- [ ] not an item\n";
        let items = progress(page);
        assert_eq!(items.len(), 3);
        assert!(items[0].done && !items[1].done);
        assert_eq!(phase_name(&items[1]), "Speed it up");
        assert_eq!(find_item(&items, "SPEED").unwrap().0, 1);
        assert_eq!(find_item(&items, "setup it").unwrap().0, 0);
        assert!(find_item(&items, "it up")
            .unwrap_err()
            .contains("2 Progress items"));
        assert!(find_item(&items, "nope").is_err());
    }
}
