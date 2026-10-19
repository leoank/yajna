//! Several agents in several git worktrees of one notebook (ADR-0021): the branch check
//! behind `validate --against`, `renumber` to resolve a curated-ID collision, and
//! `worktree` to start a branch with its own author handle.

use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::LazyLock;

use regex::Regex;

use crate::vault::{rel, slugify, Res, Vault, NS_ID_RE};

/// Curated IDs come from `counters.yaml` and are the ones two branches can both allocate.
static CURATED_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^((PRJ|EXP|PRO|MAT|ANA|EQP|BLD)-(\d+))$").unwrap());
static CURATED_FILE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^((?:PRJ|EXP|PRO|MAT|ANA|EQP|BLD)-\d+)(?:-.*)?\.md$").unwrap());
static CURATED_DIR_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(PRJ-\d+)(?:-.*)?$").unwrap());
const SHARED: &[&str] = &["PRO", "MAT", "EQP", "BLD"];

fn git(dir: &Path, args: &[&str]) -> Res<String> {
    let out = Command::new("git")
        .arg("-C")
        .arg(dir)
        .args(args)
        .output()
        .map_err(|e| format!("git: {e}"))?;
    if !out.status.success() {
        return Err(format!(
            "git {} failed: {}",
            args.join(" "),
            String::from_utf8_lossy(&out.stderr).trim()
        ));
    }
    Ok(String::from_utf8_lossy(&out.stdout).trim_end().to_string())
}

/// The curated ID a page path stands for: `EXP-0007-slug.md`, or `PRJ-0002-slug/README.md`.
fn curated_id(path: &str) -> Option<String> {
    let mut parts = path.rsplit('/');
    let name = parts.next()?;
    if name == "README.md" {
        let dir = parts.next()?;
        return CURATED_DIR_RE.captures(dir).map(|c| c[1].to_string());
    }
    CURATED_FILE_RE.captures(name).map(|c| c[1].to_string())
}

/// Curated ID -> page path for the vault as committed at `commit`.
fn ids_at(vault: &Vault, commit: &str) -> Res<BTreeMap<String, String>> {
    let vault_rel = rel(&vault.notes, &vault.root).to_string();
    let listing = git(
        &vault.root,
        &["ls-tree", "-r", "--name-only", commit, "--", &vault_rel],
    )?;
    Ok(listing
        .lines()
        .filter_map(|p| curated_id(p).map(|id| (id, p.to_string())))
        .collect())
}

/// Curated ID -> page path in the working tree.
fn ids_here(vault: &Vault) -> Res<BTreeMap<String, String>> {
    let mut out = BTreeMap::new();
    for page in vault.pages()? {
        let p = rel(&page.path, &vault.root).to_string();
        if let Some(id) = curated_id(&p) {
            out.insert(id, p);
        }
    }
    Ok(out)
}

/// Problems (collisions, which fail validation) and notes (advice) for this branch against
/// `reference`: a curated ID created on both sides since they diverged is a collision.
pub fn against(vault: &Vault, reference: &str) -> Res<(Vec<String>, Vec<String>)> {
    git(
        &vault.root,
        &["rev-parse", "--verify", "--quiet", reference],
    )
    .map_err(|_| format!("{reference}: not a commit or branch here"))?;
    let base = git(&vault.root, &["merge-base", "HEAD", reference])?;
    let at_base = ids_at(vault, &base)?;
    let at_ref = ids_at(vault, reference)?;
    let here = ids_here(vault)?;
    let mut problems = Vec::new();
    let mut notes = Vec::new();
    for (id, path) in &here {
        if at_base.contains_key(id) {
            continue;
        }
        match at_ref.get(id) {
            Some(theirs) if theirs != path => problems.push(format!(
                "{path}: {id} was also created on {reference} since this branch left it ({theirs}); \
                 renumber this one before merging: yajna renumber {id}"
            )),
            _ => {}
        }
        let prefix = id.split('-').next().unwrap_or("");
        if SHARED.contains(&prefix) && !at_ref.contains_key(id) {
            notes.push(format!(
                "{path}: {id} is a shared entity created on this branch; shared pages belong on {reference}"
            ));
        }
    }
    let theirs_new = at_ref
        .keys()
        .filter(|id| !at_base.contains_key(*id))
        .count();
    if theirs_new > 0 && problems.is_empty() {
        notes.push(format!(
            "{reference} has {theirs_new} curated page(s) this branch has not merged; merge {reference} before allocating more IDs"
        ));
    }
    Ok((problems, notes))
}

// --- renumber --------------------------------------------------------------------------

/// Give a curated page a new ID: rename its file (or project directory) and sidecar
/// directory, rewrite every reference in the repo's markdown and the vault's scripts, and
/// keep the counter at or above the new number.
pub fn renumber(vault: &Vault, old: &str, new: Option<&str>) -> Res<i32> {
    let Some(c) = CURATED_RE.captures(old) else {
        return Err(format!(
            "{old}: only curated IDs (PRJ, EXP, PRO, MAT, ANA, EQP, BLD) are renumbered; volume IDs never collide"
        ));
    };
    let prefix = c[2].to_string();
    let pages: Vec<_> = vault
        .pages()?
        .into_iter()
        .filter(|p| p.id() == Some(old))
        .collect();
    let page = match pages.as_slice() {
        [] => return Err(format!("{old}: no page has this id")),
        [one] => one.clone(),
        many => {
            return Err(format!(
                "{old} is on {} pages ({}); references cannot be told apart after a merge. \
                 Renumber on the branch before merging; `yajna validate --against main` finds these",
                many.len(),
                many.iter()
                    .map(|p| rel(&p.path, &vault.root).to_string())
                    .collect::<Vec<_>>()
                    .join(", ")
            ))
        }
    };
    let index = vault.index()?;
    let new = match new {
        Some(n) => {
            let Some(nc) = CURATED_RE.captures(n) else {
                return Err(format!("{n}: not a curated ID"));
            };
            if nc[2] != prefix {
                return Err(format!("{n}: must keep the prefix {prefix}"));
            }
            if index.contains_key(n) {
                return Err(format!("{n} already exists"));
            }
            bump_counter(vault, &prefix, nc[3].parse().unwrap_or(0))?;
            n.to_string()
        }
        None => vault.allocate(&prefix)?,
    };

    // 1. renames: the page (or the project's directory) and the sidecar directory
    let mut renames: Vec<(PathBuf, PathBuf)> = Vec::new();
    let name = page
        .path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    if name == "README.md" && page.path.parent() != Some(vault.notes.as_path()) {
        let dir = page.path.parent().unwrap().to_path_buf();
        let dname = dir.file_name().unwrap().to_string_lossy().to_string();
        renames.push((
            dir.clone(),
            dir.with_file_name(dname.replacen(old, &new, 1)),
        ));
    } else if name.starts_with(old) {
        renames.push((
            page.path.clone(),
            page.path.with_file_name(name.replacen(old, &new, 1)),
        ));
        let sidecar = page.path.with_file_name(old);
        if sidecar.is_dir() {
            renames.push((sidecar, page.path.with_file_name(&new)));
        }
    }
    for (from, to) in &renames {
        if to.exists() {
            return Err(format!("{} already exists", rel(to, &vault.root)));
        }
        fs::rename(from, to).map_err(|e| format!("{}: {e}", from.display()))?;
        println!(
            "renamed {} -> {}",
            rel(from, &vault.root),
            rel(to, &vault.root)
        );
    }

    // 2. references: [[OLD]], frontmatter fields and paths that contain the ID. Namespaced
    //    IDs point into other repos and are left alone.
    let mut files = Vec::new();
    collect(&vault.root, &vault.notes, &mut files);
    let mut rewritten = 0;
    for f in files {
        let Ok(text) = fs::read_to_string(&f) else {
            continue;
        };
        let out = NS_ID_RE.replace_all(&text, |c: &regex::Captures| {
            if c.get(1).is_none() && &c[2] == old {
                new.clone()
            } else {
                c[0].to_string()
            }
        });
        if out != text {
            fs::write(&f, out.as_ref()).map_err(|e| format!("{}: {e}", f.display()))?;
            rewritten += 1;
        }
    }
    println!("{old} -> {new}: {rewritten} file(s) rewritten; next: yajna validate");
    Ok(0)
}

fn bump_counter(vault: &Vault, prefix: &str, n: i64) -> Res<()> {
    let mut counters = vault.read_counters()?;
    match counters.iter_mut().find(|(k, _)| k == prefix) {
        Some((_, v)) if *v >= n => return Ok(()),
        Some((_, v)) => *v = n,
        None => counters.push((prefix.to_string(), n)),
    }
    fs::write(&vault.counters_file, crate::vault::counters_text(&counters))
        .map_err(|e| e.to_string())
}

/// Markdown anywhere in the repo (skipping hidden and build directories), plus scripts in
/// the vault: the files an ID or a page path can appear in.
fn collect(dir: &Path, vault: &Path, out: &mut Vec<PathBuf>) {
    let Ok(rd) = fs::read_dir(dir) else { return };
    for e in rd.flatten() {
        let p = e.path();
        let name = e.file_name().to_string_lossy().to_string();
        if p.is_dir() {
            if name.starts_with('.')
                || ["target", "node_modules", "result"].contains(&name.as_str())
            {
                continue;
            }
            collect(&p, vault, out);
            continue;
        }
        let ext = p.extension().map(|x| x.to_string_lossy().to_string());
        match ext.as_deref() {
            Some("md") => out.push(p),
            Some("sh" | "py") if p.starts_with(vault) => out.push(p),
            _ => {}
        }
    }
}

// --- worktree --------------------------------------------------------------------------

/// A branch `<project-slug>/<topic>` in its own worktree, with `.yajna/author` naming the
/// agent that works there so its log file and pages never collide with another worktree's.
pub fn worktree(
    vault: &Vault,
    project: &str,
    topic: &str,
    agent: &str,
    from: &str,
    path: Option<&Path>,
) -> Res<i32> {
    let page = vault.find(project)?;
    if page.field("type") != Some("project") {
        return Err(format!("{project} is not a project"));
    }
    let slug = if vault.is_project() {
        vault.namespace()?.to_string()
    } else {
        let dir = vault.project_dir(project)?;
        let name = dir.file_name().unwrap().to_string_lossy().to_string();
        name.strip_prefix(&format!("{project}-"))
            .unwrap_or(&name)
            .to_string()
    };
    let topic = slugify(topic);
    let branch = format!("{slug}/{topic}");
    let author = format!("agent:{}-{slug}-{topic}", slugify(agent));

    let common = PathBuf::from(git(
        &vault.root,
        &["rev-parse", "--path-format=absolute", "--git-common-dir"],
    )?);
    let toplevel = PathBuf::from(git(&vault.root, &["rev-parse", "--show-toplevel"])?);
    let prefix = git(&vault.root, &["rev-parse", "--show-prefix"])?;
    let target = match path {
        Some(p) => p.to_path_buf(),
        // the gclb layout: <container>/.bare plus one directory per branch
        None if common.file_name().map(|n| n == ".bare").unwrap_or(false) => {
            common.parent().unwrap().join(&branch)
        }
        None => {
            let repo = toplevel
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_default();
            toplevel.with_file_name(format!("{repo}-{slug}-{topic}"))
        }
    };
    if target.exists() {
        return Err(format!("{}: already exists", target.display()));
    }
    let target_s = target.to_string_lossy().to_string();
    git(
        &vault.root,
        &["worktree", "add", "-b", &branch, &target_s, from],
    )?;
    let new_root = target.join(prefix.trim_end_matches('/'));
    let author_file = new_root.join(".yajna").join("author");
    fs::create_dir_all(author_file.parent().unwrap()).map_err(|e| e.to_string())?;
    fs::write(&author_file, format!("{author}\n")).map_err(|e| e.to_string())?;
    // never committed: the handle belongs to the worktree, not the branch
    let exclude = common.join("info").join("exclude");
    let existing = fs::read_to_string(&exclude).unwrap_or_default();
    if !existing.lines().any(|l| l.trim() == "**/.yajna/author") {
        fs::create_dir_all(exclude.parent().unwrap()).map_err(|e| e.to_string())?;
        fs::write(&exclude, format!("{existing}**/.yajna/author\n")).map_err(|e| e.to_string())?;
    }
    println!("worktree {}", target.display());
    println!("branch   {branch} (from {from})");
    println!("author   {author} (in .yajna/author; pages and log lines made there carry it)");
    println!(
        "next: create curated pages (experiments, protocols, materials) on {from} and merge it in, \
         or run `yajna validate --against {from}` before merging back"
    );
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ids_from_paths() {
        assert_eq!(
            curated_id("notes/projects/PRJ-0002-rc2s2/README.md").as_deref(),
            Some("PRJ-0002")
        );
        assert_eq!(
            curated_id("notes/projects/PRJ-0002-x/experiments/EXP-0011-does-it.md").as_deref(),
            Some("EXP-0011")
        );
        assert_eq!(
            curated_id("notes/protocols/PRO-0012.md").as_deref(),
            Some("PRO-0012")
        );
        assert_eq!(
            curated_id("notes/projects/P/experiments/EXP-0001/README.md"),
            None
        );
        assert_eq!(
            curated_id("notes/projects/P/runs/RUN-20261016-k7f3.md"),
            None
        );
        assert_eq!(curated_id("notes/README.md"), None);
    }
}
