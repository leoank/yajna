//! Shell completion of IDs (`source <(COMPLETE=zsh yajna)`) and the picker that opens when a
//! command's ID is left out on a terminal. An argument completes from the notebook the shell
//! is in, each ID with its title, or for a run the line its experiment lists it with, and
//! only the IDs the command can act on: `run shell` runs with a commit, `run reproduce` the
//! ones with something to compare, `run clean` the ones with a worktree, a thread command the
//! open reviews, `phase done` the phases not done, the second run of `run diff` those of the first one's experiment. The picker
//! searches every ID of the type, so a filter never hides what you are looking for.

use std::collections::{BTreeSet, HashMap};
use std::path::Path;
use std::sync::LazyLock;

use clap::builder::StyledStr;
use clap_complete::CompletionCandidate;
use regex::Regex;
use serde_json::Value;

use crate::tui::Prompter;
use crate::vault::{find_root, Page, Res, Vault};

static LISTED_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?m)^- \[\[([A-Z]+-[0-9a-z-]+)(?:\|[^\]]*)?\]\] (.+)$").unwrap());

/// `(ID, what it is)` for the pages of `types` (all when empty) that `keep` accepts.
pub(crate) fn entries(
    vault: &Vault,
    types: &[&str],
    keep: &dyn Fn(&Vault, &Page) -> bool,
) -> Vec<(String, String)> {
    let Ok(pages) = vault.pages() else {
        return Vec::new();
    };
    // what a parent page says about each child: `- [[RUN-…]] seed 1, loss 0.5`
    let mut listed: HashMap<String, String> = HashMap::new();
    for page in &pages {
        for caps in LISTED_RE.captures_iter(&page.body) {
            listed
                .entry(caps[1].to_string())
                .or_insert_with(|| caps[2].to_string());
        }
    }
    pages
        .iter()
        .filter(|p| types.is_empty() || p.field("type").is_some_and(|t| types.contains(&t)))
        .filter(|p| keep(vault, p))
        .filter_map(|p| {
            let id = p.id()?;
            Some((id.to_string(), help(p, id, &listed)))
        })
        .collect()
}

fn help(page: &Page, id: &str, listed: &HashMap<String, String>) -> String {
    let what = page
        .field("title")
        .filter(|t| !t.is_empty())
        .map(str::to_string)
        .or_else(|| listed.get(id).cloned())
        .unwrap_or_else(|| page.field("type").unwrap_or("").to_string());
    let text = match page.field("status") {
        Some(s) => format!("{s}: {what}"),
        None => what,
    };
    if text.chars().count() > 70 {
        format!("{}…", text.chars().take(69).collect::<String>())
    } else {
        text
    }
}

/// Completion candidates from the notebook the shell is in (`--root` is not parsed while
/// completing).
fn candidates(types: &[&str], keep: &dyn Fn(&Vault, &Page) -> bool) -> Vec<CompletionCandidate> {
    let Some(vault) = find_root().ok().and_then(|root| Vault::open(root).ok()) else {
        return Vec::new();
    };
    entries(&vault, types, keep)
        .into_iter()
        .map(|(id, help)| CompletionCandidate::new(id).help(Some(StyledStr::from(help))))
        .collect()
}

fn all(_: &Vault, _: &Page) -> bool {
    true
}

pub fn runs() -> Vec<CompletionCandidate> {
    candidates(&["run"], &all)
}

pub fn experiments() -> Vec<CompletionCandidate> {
    candidates(&["experiment"], &all)
}

pub fn projects() -> Vec<CompletionCandidate> {
    candidates(&["project"], &all)
}

pub fn reviews() -> Vec<CompletionCandidate> {
    candidates(&["review"], &all)
}

pub fn any() -> Vec<CompletionCandidate> {
    candidates(&[], &all)
}

/// `run shell`: runs whose commit can be opened.
pub fn runs_with_commit() -> Vec<CompletionCandidate> {
    candidates(&["run"], &|_, p| has_commit(p))
}

fn has_commit(p: &Page) -> bool {
    p.field("commit").is_some_and(|c| c != "unknown")
}

/// `run record`: runs not done yet.
pub fn runs_to_record() -> Vec<CompletionCandidate> {
    candidates(&["run"], &|_, p| p.field("status") != Some("done"))
}

/// `run reproduce`: compute runs with a commit and something to compare, outputs or a row
/// in their experiment's results.tsv.
pub fn runs_to_reproduce() -> Vec<CompletionCandidate> {
    let Some(vault) = find_root().ok().and_then(|root| Vault::open(root).ok()) else {
        return Vec::new();
    };
    let rows = result_rows(&vault.notes);
    entries(&vault, &["run"], &|_, p| {
        let outputs = p
            .meta
            .as_ref()
            .and_then(|m| m.get("outputs"))
            .is_some_and(|o| matches!(o, Value::Array(a) if !a.is_empty()));
        p.field("kind") == Some("compute")
            && has_commit(p)
            && (outputs || p.id().is_some_and(|id| rows.contains(id)))
    })
    .into_iter()
    .map(|(id, help)| CompletionCandidate::new(id).help(Some(StyledStr::from(help))))
    .collect()
}

/// The run IDs in every results.tsv under `dir`.
fn result_rows(dir: &Path) -> BTreeSet<String> {
    let mut out = BTreeSet::new();
    let Ok(rd) = std::fs::read_dir(dir) else {
        return out;
    };
    for e in rd.flatten() {
        let p = e.path();
        if p.is_dir() {
            out.extend(result_rows(&p));
        } else if p.file_name().is_some_and(|n| n == "results.tsv") {
            if let Ok(text) = std::fs::read_to_string(&p) {
                out.extend(
                    text.lines()
                        .skip(1)
                        .filter_map(|l| l.split('\t').next())
                        .map(str::to_string),
                );
            }
        }
    }
    out
}

/// `run clean`: runs with a worktree here.
pub fn runs_with_worktree() -> Vec<CompletionCandidate> {
    candidates(&["run"], &|v, p| {
        p.id()
            .is_some_and(|id| crate::rerun::trees_dir(v).join(id).join(".git").exists())
    })
}

/// The second run of `run diff`: those of the first one's experiment, read from the line
/// being completed.
pub fn runs_beside_first() -> Vec<CompletionCandidate> {
    let words: Vec<String> = std::env::args().collect();
    let first = words
        .iter()
        .position(|w| w == "diff")
        .and_then(|i| words.get(i + 1))
        .filter(|w| w.starts_with("RUN-"))
        .cloned();
    candidates(&["run"], &|v, p| match &first {
        Some(a) => {
            let exp = v
                .find(a)
                .ok()
                .and_then(|a| a.field("experiment").map(str::to_string));
            exp.is_none() || p.field("experiment") == exp.as_deref()
        }
        None => true,
    })
}

/// `phase start`: phases not started, and projects (an item of one not yet migrated).
pub fn phases_to_start() -> Vec<CompletionCandidate> {
    candidates(&["phase", "project"], &|_, p| {
        p.field("type") == Some("project") || p.field("since").is_none()
    })
}

/// `phase done`: phases not done.
pub fn phases_to_finish() -> Vec<CompletionCandidate> {
    candidates(&["phase"], &|_, p| {
        !matches!(p.field("status"), Some("done" | "abandoned"))
    })
}

/// `data get` and `status`: artifacts kept in a data store.
pub fn stored_data() -> Vec<CompletionCandidate> {
    candidates(&["artifact", "run"], &|_, p| {
        p.field("store") == Some("xet") || crate::data::stored_outputs(p).next().is_some()
    })
}

/// `data add --art`: artifacts not in a data store yet.
pub fn artifacts() -> Vec<CompletionCandidate> {
    candidates(&["artifact"], &|_, p| p.field("store") != Some("xet"))
}

/// Thread commands: reviews still open.
pub fn open_reviews() -> Vec<CompletionCandidate> {
    candidates(&["review"], &|_, p| {
        matches!(p.field("status"), Some("open" | "changes_requested"))
    })
}

/// The ID a command was given, or one picked from every page of `types` on a terminal.
pub(crate) fn given_or_picked(
    vault: &Vault,
    given: Option<&str>,
    types: &[&str],
    what: &str,
    p: &mut dyn Prompter,
) -> Res<String> {
    if let Some(id) = given {
        return Ok(id.to_string());
    }
    if !crate::anywhere::interactive() {
        return Err(format!(
            "which {what}? give its ID, or run this on a terminal to pick one"
        ));
    }
    let found = entries(vault, types, &all);
    if found.is_empty() {
        return Err(format!("no {what} in this notebook"));
    }
    let items: Vec<String> = found.iter().map(|(id, h)| format!("{id}  {h}")).collect();
    let i = p.pick(what, &items)?;
    Ok(found[i].0.clone())
}
