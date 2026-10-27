//! The conventions of `docs/conventions.md` that can be checked mechanically, beyond the form
//! of each page that `validate` checks: session pages for agents' days, reproducible compute
//! runs, filled experiments, children listed on their parents, signed curated pages, settled
//! reviews, pinned protocol versions, where pages live, and the shape of log lines.
//!
//! `yajna validate` runs both. These stay apart from `validate::validate` because the index,
//! export and merge need a notebook whose pages are well formed, not one whose history keeps
//! every convention; and `--since` lets a notebook that predates a check pass while it is
//! backfilled.

use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;
use std::sync::LazyLock;

use regex::Regex;
use serde_json::Value;

use crate::parallel::git;
use crate::vault::{date_of, rel, without_code, Page, Res, Vault, LINK_RE};

static LOG_LINE_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^- \d{2}:\d{2} \S").unwrap());
static PIN_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(PRO-\d+)@(\d+)(?:\.s(\d+))?$").unwrap());
static DATE_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^\d{4}-\d{2}-\d{2}$").unwrap());

/// Lines the experiment template starts with, to be replaced before the first run.
const PLACEHOLDERS: &[&str] = &["If H1 is true we expect ... ; if false we expect ...", "1."];
/// The instruction under *Conclusion* in the template.
const CONCLUSION_HINT: &str = "Written once, by a human, when status becomes `concluded`.";

/// Problems, as `path: message`. With `since`, pages created and logs dated before that day
/// are not held to the conventions; a broken frontmatter, a protocol pin and a committed
/// `.yajna/author` are reported whatever the date.
pub fn check(vault: &Vault, since: Option<&str>) -> Res<Vec<String>> {
    if let Some(s) = since {
        if !DATE_RE.is_match(s) {
            return Err(format!("--since {s}: expected YYYY-MM-DD"));
        }
    }
    let pages = vault.pages()?;
    let mut c = Checks {
        vault,
        since,
        today: date_of(&vault.now()),
        out: Vec::new(),
    };
    let by_id: BTreeMap<&str, &Page> = pages.iter().filter_map(|p| Some((p.id()?, p))).collect();
    for page in &pages {
        c.frontmatter(page);
        let Some(kind) = page.field("type") else {
            continue;
        };
        c.pins(page, &by_id);
        if !c.in_scope(page) {
            continue;
        }
        match kind {
            "log" => c.log(page),
            "agent_session" => c.session(page, &by_id),
            "run" => c.run(page, &by_id),
            "experiment" => c.experiment(page, &pages, &by_id),
            "review" => c.review(page),
            _ => {}
        }
        c.approval(page, &by_id);
        c.placement(page, kind);
    }
    c.sessions_for_logs(&pages);
    c.tracked();
    Ok(c.out)
}

struct Checks<'a> {
    vault: &'a Vault,
    since: Option<&'a str>,
    today: String,
    out: Vec<String>,
}

fn day(v: &str) -> &str {
    v.get(..10).unwrap_or(v)
}

fn str_of(page: &Page, key: &str) -> Option<String> {
    match page.meta.as_ref()?.get(key)? {
        Value::String(s) => Some(s.clone()),
        Value::Null => None,
        other => Some(other.to_string()),
    }
}

fn list_of(page: &Page, key: &str) -> Vec<String> {
    page.meta
        .as_ref()
        .and_then(|m| m.get(key))
        .and_then(|v| v.as_array())
        .map(|a| {
            a.iter()
                .filter_map(|v| v.as_str().map(str::to_string))
                .collect()
        })
        .unwrap_or_default()
}

/// The text under a `## <name>` heading, without blank lines.
fn section(body: &str, name: &str) -> Vec<String> {
    let mut inside = false;
    let mut out = Vec::new();
    for line in body.lines() {
        if let Some(h) = line.strip_prefix("## ") {
            inside = h.trim() == name;
            continue;
        }
        if inside && !line.trim().is_empty() {
            out.push(line.trim().to_string());
        }
    }
    out
}

fn links(body: &str) -> BTreeSet<String> {
    LINK_RE
        .captures_iter(&without_code(body))
        .map(|m| m[1].trim().to_string())
        .collect()
}

impl Checks<'_> {
    fn add(&mut self, path: &Path, msg: impl AsRef<str>) {
        self.out
            .push(format!("{}: {}", rel(path, &self.vault.root), msg.as_ref()));
    }

    fn after_since(&self, date: &str) -> bool {
        self.since.is_none_or(|s| day(date) >= s)
    }

    /// A page created (a log: dated) on or after `--since`.
    fn in_scope(&self, page: &Page) -> bool {
        let date = str_of(page, "created").or_else(|| str_of(page, "date"));
        date.is_none_or(|d| self.after_since(&d))
    }

    /// A page that starts with `---` but whose frontmatter does not parse is skipped by
    /// every other check, so it is reported on its own.
    fn frontmatter(&mut self, page: &Page) {
        if page.meta.is_none() && page.body.starts_with("---") {
            self.add(
                &page.path,
                "the frontmatter does not parse (or has no closing ---), so nothing else in the page is checked",
            );
        }
    }

    /// `[[PRO-0012@3]]` names a version the protocol has reached, and `@3.s4` a step it has.
    fn pins(&mut self, page: &Page, by_id: &BTreeMap<&str, &Page>) {
        for target in links(&page.body) {
            let Some(m) = PIN_RE.captures(&target) else {
                continue;
            };
            let Some(pro) = by_id.get(&m[1]) else {
                continue;
            };
            let pinned: u64 = m[2].parse().unwrap_or(0);
            let now: u64 = str_of(pro, "version")
                .and_then(|v| v.parse().ok())
                .unwrap_or(1);
            if pinned == 0 || pinned > now {
                self.add(
                    &page.path,
                    format!("{target}: {} is at version {now}", &m[1]),
                );
                continue;
            }
            if let (Some(step), true) = (m.get(3), pinned == now) {
                let steps = crate::validate::parse_steps(&pro.body).0.len();
                let n: usize = step.as_str().parse().unwrap_or(0);
                if n == 0 || n > steps {
                    self.add(
                        &page.path,
                        format!("{target}: {} has {steps} step(s)", &m[1]),
                    );
                }
            }
        }
    }

    /// `- HH:MM text` lines; other lines are indented and continue the entry above them.
    /// The time is when the thing happened, so a line written up later may be earlier
    /// than the one before it.
    fn log(&mut self, page: &Page) {
        for line in page.body.lines() {
            if line.trim().is_empty() || line.starts_with(char::is_whitespace) {
                continue;
            }
            if !LOG_LINE_RE.is_match(line) {
                let shown: String = line.chars().take(40).collect();
                self.add(
                    &page.path,
                    format!("not a log line (`- HH:MM text`): {shown}"),
                );
            }
        }
    }

    fn session(&mut self, page: &Page, by_id: &BTreeMap<&str, &Page>) {
        let author = page.field("author").unwrap_or("");
        if !author.starts_with("agent:") {
            self.add(
                &page.path,
                format!("a session page is an agent's; its author is {author}"),
            );
        }
        if str_of(page, "harness").is_none_or(|h| h.is_empty()) {
            self.add(
                &page.path,
                "harness is empty; say which harness ran the session",
            );
        }
        let outcome = page.field("outcome").unwrap_or("pending");
        if outcome != "pending" && str_of(page, "finished").is_none() {
            self.add(
                &page.path,
                format!("outcome is {outcome} but finished is not set"),
            );
        }
        // curated pages an agent made or changed wait for a human
        for id in list_of(page, "created_entities")
            .into_iter()
            .chain(list_of(page, "edited_entities"))
        {
            let curated = ["EXP-", "PRO-", "MAT-"].iter().any(|p| id.starts_with(p));
            let Some(target) = by_id.get(id.as_str()) else {
                continue;
            };
            if curated && target.field("review").is_none() {
                self.add(
                    &target.path,
                    format!(
                        "{id} was written by an agent in {} but has no `review: pending`",
                        page.id().unwrap_or("")
                    ),
                );
            }
        }
    }

    /// Every day an agent logged has a session page of that agent running that day.
    fn sessions_for_logs(&mut self, pages: &[Page]) {
        let mut spans: BTreeMap<String, Vec<(String, String)>> = BTreeMap::new();
        for p in pages
            .iter()
            .filter(|p| p.field("type") == Some("agent_session"))
        {
            let Some(started) = str_of(p, "started") else {
                continue;
            };
            let end = match str_of(p, "finished") {
                Some(f) => day(&f).to_string(),
                None if p.field("outcome").unwrap_or("pending") == "pending" => self.today.clone(),
                None => day(&started).to_string(),
            };
            spans
                .entry(p.field("author").unwrap_or("").to_string())
                .or_default()
                .push((day(&started).to_string(), end));
        }
        for p in pages.iter().filter(|p| p.field("type") == Some("log")) {
            let author = p.field("author").unwrap_or("");
            let Some(date) = str_of(p, "date") else {
                continue;
            };
            if !author.starts_with("agent:") || !self.after_since(&date) {
                continue;
            }
            let covered = spans
                .get(author)
                .is_some_and(|s| s.iter().any(|(a, b)| *a <= date && date <= *b));
            if !covered {
                self.add(
                    &p.path,
                    format!(
                        "{author} logged on {date} but has no session page for it; open one with yajna new agent"
                    ),
                );
            }
        }
    }

    fn run(&mut self, page: &Page, by_id: &BTreeMap<&str, &Page>) {
        let id = page.id().unwrap_or("");
        if page.field("kind") == Some("compute") {
            let in_git = self.vault.root.join(".git").exists()
                || git(&self.vault.root, &["rev-parse", "--git-dir"]).is_ok();
            if in_git && page.field("status") == Some("done") && str_of(page, "commit").is_none() {
                self.add(
                    &page.path,
                    "a done compute run records the commit it ran at",
                );
            }
            let agent = page.field("author").unwrap_or("").starts_with("agent:");
            match str_of(page, "script") {
                None if agent => self.add(
                    &page.path,
                    "an agent's compute run has a script that re-creates it",
                ),
                Some(s) => {
                    let path = self.vault.root.join(&s);
                    if path.is_file() && !executable(&path) {
                        self.add(&page.path, format!("script {s} is not executable"));
                    }
                }
                None => {}
            }
        }
        // listed on its experiment's page
        if let Some(exp) = page.field("experiment").and_then(|e| by_id.get(e)) {
            if !links(&exp.body).iter().any(|l| l == id) {
                self.add(
                    &exp.path,
                    format!(
                        "{id} is not listed on its experiment's page (- [[{id}]] what it showed)"
                    ),
                );
            }
        }
    }

    fn experiment(&mut self, page: &Page, pages: &[Page], by_id: &BTreeMap<&str, &Page>) {
        let id = page.id().unwrap_or("");
        if page.field("status") == Some("concluded") {
            if str_of(page, "outcome").is_none() {
                self.add(&page.path, "concluded without an outcome");
            }
            let said = section(&page.body, "Conclusion");
            if said.iter().all(|l| l == CONCLUSION_HINT) {
                self.add(&page.path, "concluded with no Conclusion written");
            }
        }
        // filled in before its first run
        let has_run = pages
            .iter()
            .any(|p| p.field("type") == Some("run") && p.field("experiment") == Some(id));
        if has_run {
            for name in [
                "Question",
                "Hypothesis and predictions",
                "Plan",
                "Success criteria",
            ] {
                let lines = section(&page.body, name);
                if lines.iter().all(|l| PLACEHOLDERS.contains(&l.as_str())) {
                    self.add(
                        &page.path,
                        format!("{name} is still the template's, and the experiment has runs"),
                    );
                }
            }
        }
        if let Some(prj) = page.field("project").and_then(|p| by_id.get(p)) {
            if !links(&prj.body).iter().any(|l| l == id) {
                self.add(
                    &prj.path,
                    format!("{id} is not listed on its project's page (- [[{id}]] what it asks)"),
                );
            }
        }
    }

    fn review(&mut self, page: &Page) {
        let status = page.field("status").unwrap_or("");
        let summary = section(&page.body, "Summary");
        let forced = summary.iter().any(|l| l.contains("with --force"));
        if matches!(status, "approved" | "merged") && !forced {
            let unsettled = crate::review::unsettled(page);
            if !unsettled.is_empty() {
                self.add(
                    &page.path,
                    format!("{status} with threads unsettled: {}", unsettled.join(", ")),
                );
            }
        }
        for line in &summary {
            let mut words = line.split_whitespace().skip(3);
            if let (Some(who), Some(what)) = (words.next(), words.next()) {
                if who.starts_with("agent:") && what.starts_with("approved") {
                    self.add(
                        &page.path,
                        format!("approved by {who}; only a human approves"),
                    );
                }
            }
        }
        let agent = page.field("author").unwrap_or("").starts_with("agent:");
        let about = list_of(page, "about");
        if agent && about.is_empty() && !summary.iter().any(|l| LINK_RE.is_match(l)) {
            self.add(
                &page.path,
                "an agent's review says what it is about: yajna review about <REV> <ID>…",
            );
        }
    }

    /// `review: approved` carries who approved it, a human, and the review that did it
    /// covers the page.
    fn approval(&mut self, page: &Page, by_id: &BTreeMap<&str, &Page>) {
        if page.field("review") != Some("approved") {
            return;
        }
        let id = page.id().unwrap_or("");
        let record = page.meta.as_ref().and_then(|m| m.get("approval"));
        let Some(record) = record else {
            self.add(
                &page.path,
                "review: approved without an approval record; approve with yajna approve or yajna review approve",
            );
            return;
        };
        let by = record.get("by").and_then(|v| v.as_str()).unwrap_or("");
        if by.starts_with("agent:") {
            self.add(
                &page.path,
                format!("approved by {by}; only a human approves"),
            );
        }
        let Some(rev) = record.get("in").and_then(|v| v.as_str()) else {
            return;
        };
        let Some(review) = by_id.get(rev) else {
            return; // an unknown ID is reported as a link
        };
        let (_, reference) = crate::review::target_of(review);
        let covers = reference == id || list_of(review, "about").iter().any(|a| a == id);
        if !covers {
            self.add(
                &page.path,
                format!("approved in {rev}, which neither reviews nor is about {id}"),
            );
        }
        if !matches!(review.field("status"), Some("approved" | "merged")) {
            self.add(
                &page.path,
                format!(
                    "approved in {rev}, which is {}",
                    review.field("status").unwrap_or("")
                ),
            );
        }
    }

    /// Experiments, runs, analyses and artifacts sit under their project; a project repo
    /// keeps no protocols, materials, equipment or builds of its own.
    fn placement(&mut self, page: &Page, kind: &str) {
        let project = self.vault.is_project();
        if project && matches!(kind, "protocol" | "material" | "equipment" | "build") {
            self.add(
                &page.path,
                format!("a project repo has no {kind} pages of its own; they live in the lab"),
            );
        }
        if project || !matches!(kind, "experiment" | "run" | "analysis" | "artifact") {
            return;
        }
        let Some(prj) = page.field("project") else {
            return;
        };
        let under = page.path.ancestors().any(|a| {
            a.file_name()
                .is_some_and(|n| n.to_string_lossy().starts_with(prj))
        });
        if !under {
            self.add(
                &page.path,
                format!("belongs to {prj} but is not under its directory"),
            );
        }
    }

    /// `results.tsv` files are not ignored by git, so they get committed; `.yajna/author`
    /// never is committed.
    fn tracked(&mut self) {
        let root = &self.vault.root;
        let Ok(files) = git(root, &["ls-files", "--", ".yajna/author"]) else {
            return; // not a git checkout
        };
        if !files.is_empty() {
            self.out.push(
                ".yajna/author: is committed; it names one worktree's agent, so git rm --cached it"
                    .to_string(),
            );
        }
        let mut results = Vec::new();
        let mut stack = vec![self.vault.notes.clone()];
        while let Some(dir) = stack.pop() {
            let Ok(entries) = std::fs::read_dir(&dir) else {
                continue;
            };
            for e in entries.flatten() {
                let path = e.path();
                if path.is_dir() {
                    stack.push(path);
                } else if path.file_name().is_some_and(|n| n == "results.tsv") {
                    results.push(rel(&path, root).to_string());
                }
            }
        }
        if results.is_empty() {
            return;
        }
        let mut args = vec!["check-ignore", "--"];
        args.extend(results.iter().map(String::as_str));
        // exits 1 when nothing is ignored
        let ignored = git(root, &args).unwrap_or_default();
        for path in ignored.lines() {
            self.out.push(format!(
                "{path}: is ignored by git; results.tsv is part of the record, so commit it"
            ));
        }
    }
}

#[cfg(unix)]
fn executable(path: &Path) -> bool {
    use std::os::unix::fs::PermissionsExt;
    std::fs::metadata(path).is_ok_and(|m| m.permissions().mode() & 0o111 != 0)
}

#[cfg(not(unix))]
fn executable(_: &Path) -> bool {
    true
}
