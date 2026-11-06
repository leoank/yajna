//! A project's phases as pages (ADR-0034). A `PHS` page holds the phase's goal, its own
//! *Progress* checklist and notes, `status`, and the commits it ran between (`since`,
//! `until`), which bound a review of it; the project page's *Progress* lists each phase on
//! one line, ticked when it is done. `phase migrate` turns the checklist a project kept
//! before into phase pages.

use std::collections::HashMap;
use std::fs;
use std::sync::LazyLock;

use regex::Regex;

use crate::cli::PhaseAction;
use crate::init::{edit_frontmatter, set_field};
use crate::review::{rev, section_end, short, tick_commit, ITEM_RE, SINCE_RE};
use crate::tui::Prompter;
use crate::vault::{rel, Page, Res, Vault};

/// `Phase 1e designed: …` -> `Phase 1e designed`: a short label before the first colon.
static LABEL_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^([^:`\[\]()]{1,40}?):\s").unwrap());
/// What a label says about the phase rather than naming it: `Phase 1c step 2` is `Phase 1c`.
static QUALIFIER_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?i)\s+(designed|verified|later|step \d+)$").unwrap());

pub fn run(vault: &Vault, action: &PhaseAction, p: &mut dyn Prompter) -> Res<i32> {
    match action {
        PhaseAction::Start { target, item, at } => {
            let page = vault.find(&vault.canonical_id(target))?;
            match page.field("type") {
                Some("phase") if item.is_empty() => start(vault, &page, at.as_deref()),
                Some("phase") => Err("a phase page takes no item words".to_string()),
                Some("project") if at.is_some() => {
                    Err("--at applies to a phase page; migrate the project first".to_string())
                }
                Some("project") => crate::review::start_item(vault, target, item),
                _ => Err(format!("{target} is not a phase or a project")),
            }
        }
        PhaseAction::Done { phase, at } => {
            let id =
                crate::complete::given_or_picked(vault, phase.as_deref(), &["phase"], "phase", p)?;
            done(vault, &id, at.as_deref())
        }
        PhaseAction::Migrate { project, dry_run } => {
            let project = match project {
                Some(p) => vault.canonical_id(p),
                None if vault.is_project() => vault.single_project()?,
                None => return Err("which project? yajna phase migrate PRJ-xxxx".to_string()),
            };
            migrate(vault, &project, *dry_run)
        }
    }
}

fn phase_page(page: &Page) -> Res<String> {
    let id = page.id().unwrap_or("").to_string();
    if page.field("type") != Some("phase") {
        return Err(format!("{id} is not a phase"));
    }
    Ok(id)
}

fn write_fields(page: &Page, fields: &[(&str, &str)]) -> Res<()> {
    let text = crate::vault::read_text(&page.path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |fm| {
        for (k, v) in fields {
            set_field(fm, k, v);
        }
    });
    fs::write(&page.path, text).map_err(|e| e.to_string())
}

fn start(vault: &Vault, page: &Page, at: Option<&str>) -> Res<i32> {
    let id = phase_page(page)?;
    match page.field("status") {
        Some("done") | Some("abandoned") => {
            return Err(format!("{id} is {} already", page.field("status").unwrap()))
        }
        _ => {}
    }
    if let Some(s) = page.field("since") {
        return Err(format!("{id} started already, at {}", short(s)));
    }
    let since = rev(&vault.root, at.unwrap_or("HEAD"))?;
    write_fields(page, &[("status", "active"), ("since", &since)])?;
    println!("{id} active since {}", short(&since));
    Ok(0)
}

fn done(vault: &Vault, id: &str, at: Option<&str>) -> Res<i32> {
    let page = vault.find(&vault.canonical_id(id))?;
    let id = phase_page(&page)?;
    if page.field("status") == Some("done") {
        return Err(format!("{id} is done already"));
    }
    let until = rev(&vault.root, at.unwrap_or("HEAD"))?;
    write_fields(&page, &[("status", "done"), ("until", &until)])?;
    println!("{id} done at {}", short(&until));
    let open = crate::review::progress(&page.body)
        .iter()
        .filter(|i| !i.done)
        .count();
    if open > 0 {
        println!("note: {open} item(s) on its Progress are still open");
    }
    // tick its line on the project's Progress
    if let Some(project) = page.field("project") {
        let prj = vault.find(project)?;
        let text = crate::vault::read_text(&prj.path).map_err(|e| e.to_string())?;
        let link = format!("[[{id}");
        let mut ticked = false;
        let out: Vec<String> = text
            .lines()
            .map(|l| {
                if !ticked && l.contains(&link) {
                    if let Some(rest) = l.trim_start().strip_prefix("- [ ] ") {
                        ticked = true;
                        let indent = &l[..l.len() - l.trim_start().len()];
                        return format!("{indent}- [x] {rest}");
                    }
                }
                l.to_string()
            })
            .collect();
        if ticked {
            fs::write(&prj.path, out.join("\n") + "\n").map_err(|e| e.to_string())?;
            println!("ticked on {}", rel(&prj.path, &vault.root));
        } else if !text.contains(&link) {
            println!(
                "note: {project}'s Progress does not list {id}; add `- [x] [[{id}]] <what it was>`"
            );
        }
    }
    Ok(0)
}

/// A top-level Progress item: its line, the wrapped lines that continue its text, and the
/// items nested under it with what continues them.
struct Entry {
    first: usize,
    last: usize,
    done: bool,
    /// the item's text, its continuation lines joined
    text: String,
    /// the nested lines, dedented to the first nested item
    nested: Vec<String>,
}

impl Entry {
    fn started(&self) -> bool {
        self.done
            || SINCE_RE.is_match(&self.text)
            || self
                .nested
                .iter()
                .any(|l| ITEM_RE.captures(l).is_some_and(|m| &m[1] != " "))
    }
}

/// The phase an item belongs to: its label without qualifiers, or None for an item without
/// one, which is a phase of its own.
fn label(text: &str) -> Option<String> {
    let mut l = LABEL_RE.captures(text)?[1].trim().to_string();
    while let Some(m) = QUALIFIER_RE.find(&l) {
        l = l[..m.start()].to_string();
    }
    Some(l)
}

/// A phase's title from an item's text: without `(since …)`, links and code marks, cut at a
/// word near 60 characters.
fn title_of(text: &str) -> String {
    let t = SINCE_RE.replace_all(text, "");
    let t = Regex::new(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]")
        .unwrap()
        .replace_all(&t, "$1")
        .replace('`', "");
    let t = t.trim();
    if t.chars().count() <= 60 {
        return t.to_string();
    }
    let cut: String = t.chars().take(60).collect();
    let cut = cut.rsplit_once(' ').map_or(cut.as_str(), |(a, _)| a);
    format!("{}…", cut.trim_end_matches([',', ';', ':']))
}

fn entries_of(lines: &[&str], start: usize, end: usize) -> Vec<Entry> {
    let mut entries: Vec<Entry> = Vec::new();
    let mut indent: Option<usize> = None;
    for (i, line) in lines.iter().enumerate().take(end).skip(start + 1) {
        let top = !line.starts_with(char::is_whitespace);
        if top {
            indent = None;
            if let Some(m) = ITEM_RE.captures(line) {
                entries.push(Entry {
                    first: i,
                    last: i,
                    done: &m[1] != " ",
                    text: m[2].trim().to_string(),
                    nested: Vec::new(),
                });
            }
            continue;
        }
        let Some(e) = entries.last_mut().filter(|e| e.last + 1 == i) else {
            continue;
        };
        if line.trim().is_empty() {
            continue;
        }
        e.last = i;
        let lead = line.len() - line.trim_start().len();
        if indent.is_none() && ITEM_RE.is_match(line) {
            indent = Some(lead);
        }
        match indent {
            Some(n) => e.nested.push(line[n.min(lead)..].to_string()),
            None => {
                e.text.push(' ');
                e.text.push_str(line.trim());
            }
        }
    }
    entries
}

struct Group {
    title: String,
    entries: Vec<usize>,
}

fn migrate(vault: &Vault, project: &str, dry_run: bool) -> Res<i32> {
    let prj = vault.find(project)?;
    if prj.field("type") != Some("project") {
        return Err(format!("{project} is not a project"));
    }
    let text = crate::vault::read_text(&prj.path).map_err(|e| e.to_string())?;
    let lines: Vec<&str> = text.lines().collect();
    let Some(start) = lines.iter().position(|l| l.trim_end() == "## Progress") else {
        return Err(format!("{project} has no ## Progress section"));
    };
    let end = section_end(&lines, start);
    let entries = entries_of(&lines, start, end);
    // items already pointing at a phase page stay as they are
    let phs = Regex::new(r"\[\[(?:[a-z][a-z0-9_-]*/)?PHS-").unwrap();
    let todo: Vec<usize> = (0..entries.len())
        .filter(|&k| !phs.is_match(&entries[k].text))
        .collect();
    if todo.is_empty() {
        println!("{project}: nothing to migrate");
        return Ok(0);
    }

    // items with the same label make one phase, named by the label; an item alone keeps
    // its text as the phase's title
    let mut groups: Vec<Group> = Vec::new();
    let mut by_label: HashMap<String, usize> = HashMap::new();
    for &k in &todo {
        let key = label(&entries[k].text).map(|l| l.to_lowercase());
        match key.as_ref().and_then(|l| by_label.get(l)) {
            Some(&g) => {
                groups[g].entries.push(k);
                groups[g].title = label(&entries[k].text).unwrap();
            }
            None => {
                if let Some(l) = key {
                    by_label.insert(l, groups.len());
                }
                groups.push(Group {
                    title: title_of(&entries[k].text),
                    entries: vec![k],
                });
            }
        }
    }

    let root = &vault.root;
    let file = rel(&prj.path, root).to_string();
    let mut made: Vec<(usize, String, bool, String)> = Vec::new(); // (first line, id, done, title)
    for g in &groups {
        let items: Vec<&Entry> = g.entries.iter().map(|&k| &entries[k]).collect();
        let all_done = items.iter().all(|e| e.done);
        let status = if all_done {
            "done"
        } else if items.iter().any(|e| e.started()) {
            "active"
        } else {
            "planned"
        };
        // `since`: the earliest `(since …)` among its items
        let mut since: Option<String> = None;
        for e in &items {
            if let Some(m) = SINCE_RE.captures(&e.text) {
                if let Ok(c) = rev(root, &m[1]) {
                    since = Some(match since {
                        Some(s) if is_ancestor(root, &s, &c) => s,
                        _ => c,
                    });
                }
            }
        }
        // its checklist: an item's nested items, else the item itself; the text of an item
        // with nested ones says what the phase is for
        let mut goal: Vec<String> = Vec::new();
        let mut checklist: Vec<String> = Vec::new();
        for e in &items {
            if e.nested.is_empty() {
                checklist.push(format!("- [{}] {}", if e.done { "x" } else { " " }, e.text));
            } else {
                goal.push(e.text.clone());
                checklist.extend(e.nested.iter().cloned());
            }
        }
        if dry_run {
            let since = since
                .as_deref()
                .map(|s| format!(", since {}", short(s)))
                .unwrap_or_default();
            println!("{} [{status}{since}]", g.title);
            for l in &goal {
                println!("  goal: {l}");
            }
            for l in &checklist {
                println!("  {l}");
            }
            continue;
        }
        // `until` of a done phase: the latest commit that ticked one of its items
        let mut until: Option<String> = None;
        if all_done {
            for e in &items {
                if let Ok(c) = tick_commit(root, &file, lines[e.first]) {
                    until = Some(match until {
                        Some(u) if is_ancestor(root, &c, &u) => u,
                        _ => c,
                    });
                }
            }
        }
        let path = crate::commands::create(
            vault,
            "phase",
            Some(&g.title),
            Some(project),
            None,
            None,
            false,
            None,
            None,
            None,
        )?;
        let page = vault.read(&path)?;
        let id = page.id().unwrap_or("").to_string();
        let mut fields: Vec<(&str, &str)> = vec![("status", status)];
        if let Some(s) = &since {
            fields.push(("since", s));
        }
        if let Some(u) = &until {
            fields.push(("until", u));
        }
        write_fields(&page, &fields)?;
        let body = crate::vault::read_text(&path).map_err(|e| e.to_string())?;
        let mut body = body.replacen(
            "\n## Notes\n",
            &format!(
                "{}\n\n## Notes\nMigrated from {project}'s Progress by `yajna phase migrate`.\n",
                checklist.join("\n")
            ),
            1,
        );
        if !goal.is_empty() {
            body = body.replacen("## Goal\n", &format!("## Goal\n{}\n", goal.join("\n\n")), 1);
        }
        fs::write(&path, body).map_err(|e| e.to_string())?;
        made.push((items[0].first, id, all_done, g.title.clone()));
        println!("{} {} [{status}]", rel(&path, root), g.title);
    }
    if dry_run {
        println!(
            "{} phase(s) from {} item(s); run again without --dry-run to write them",
            groups.len(),
            todo.len()
        );
        return Ok(0);
    }

    // Progress as it was, each phase's line where its first item was and the items gone
    // (this also drops the lines `create` appended for them)
    let migrated: Vec<(usize, usize)> = todo
        .iter()
        .map(|&k| (entries[k].first, entries[k].last))
        .collect();
    let mut out: Vec<String> = lines[..=start].iter().map(|l| l.to_string()).collect();
    for (i, line) in lines.iter().enumerate().take(end).skip(start + 1) {
        if let Some((_, id, done, title)) = made.iter().find(|m| m.0 == i) {
            out.push(format!(
                "- [{}] [[{id}]] {title}",
                if *done { "x" } else { " " }
            ));
        } else if !migrated.iter().any(|&(a, b)| a <= i && i <= b) {
            out.push(line.to_string());
        }
    }
    out.extend(lines[end..].iter().map(|l| l.to_string()));
    fs::write(&prj.path, out.join("\n") + "\n").map_err(|e| e.to_string())?;
    println!(
        "{}: Progress lists {} phase(s)",
        rel(&prj.path, root),
        made.len()
    );
    Ok(0)
}

fn is_ancestor(root: &std::path::Path, a: &str, b: &str) -> bool {
    crate::parallel::git(root, &["merge-base", "--is-ancestor", a, b]).is_ok()
}
