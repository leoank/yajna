//! Shell completion of IDs (`source <(COMPLETE=zsh yajna)`): an argument that takes a run,
//! an experiment, a project, a review or any page completes from the notebook the shell is
//! in, each ID with its title, or for a run the line its experiment lists it with.

use std::collections::HashMap;
use std::sync::LazyLock;

use clap::builder::StyledStr;
use clap_complete::CompletionCandidate;
use regex::Regex;

use crate::vault::{find_root, Page, Vault};

static LISTED_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?m)^- \[\[([A-Z]+-[0-9a-z-]+)(?:\|[^\]]*)?\]\] (.+)$").unwrap());

/// Candidates of the given page types (all when empty), newest last as the shell sorts them.
fn ids(types: &[&str]) -> Vec<CompletionCandidate> {
    let Some(pages) = find_root()
        .ok()
        .and_then(|root| Vault::open(root).ok())
        .and_then(|vault| vault.pages().ok())
    else {
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
        .filter_map(|p| {
            let id = p.id()?;
            Some(CompletionCandidate::new(id).help(Some(StyledStr::from(help(p, id, &listed)))))
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

pub fn runs() -> Vec<CompletionCandidate> {
    ids(&["run"])
}

pub fn experiments() -> Vec<CompletionCandidate> {
    ids(&["experiment"])
}

pub fn projects() -> Vec<CompletionCandidate> {
    ids(&["project"])
}

pub fn reviews() -> Vec<CompletionCandidate> {
    ids(&["review"])
}

pub fn any() -> Vec<CompletionCandidate> {
    ids(&[])
}
