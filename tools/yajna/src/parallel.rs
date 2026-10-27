//! Several agents in several git worktrees of one notebook (ADR-0021): the branch check
//! behind `validate --against`, `renumber` to resolve a curated-ID collision, and
//! `worktree` to start a branch with its own author handle.

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::LazyLock;

use regex::Regex;

use crate::vault::{rel, slugify, Res, Vault, NS_ID_RE};

/// Counter IDs come from `counters.yaml` and are the ones two branches can both allocate.
static CURATED_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^((PRJ|PRO|MAT|EQP|BLD)-(\d+))$").unwrap());
static CURATED_FILE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^((?:PRJ|PRO|MAT|EQP|BLD)-\d+)(?:-.*)?\.md$").unwrap());
static CURATED_DIR_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(PRJ-\d+)(?:-.*)?$").unwrap());
const SHARED: &[&str] = &["PRO", "MAT", "EQP", "BLD"];

pub(crate) fn git(dir: &Path, args: &[&str]) -> Res<String> {
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

/// Problems (which fail validation) and notes (advice) for this branch against
/// `reference`: a curated ID created on both sides since they diverged is a collision, a
/// shared entity created or edited on the branch belongs on `reference`, and a branch works
/// on one project.
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
            problems.push(format!(
                "{path}: {id} is a shared entity created on this branch; create it on {reference} and merge it in"
            ));
        }
    }
    // what this branch changed since it left `reference`, committed or not
    let vault_rel = rel(&vault.notes, &vault.root).to_string();
    let mut changed: Vec<String> = git(
        &vault.root,
        &["diff", "--name-only", &base, "--", &vault_rel],
    )?
    .lines()
    .map(str::to_string)
    .collect();
    changed.extend(
        git(
            &vault.root,
            &[
                "ls-files",
                "--others",
                "--exclude-standard",
                "--",
                &vault_rel,
            ],
        )?
        .lines()
        .map(str::to_string),
    );
    for (id, path) in &at_base {
        let prefix = id.split('-').next().unwrap_or("");
        if SHARED.contains(&prefix) && changed.contains(path) {
            problems.push(format!(
                "{path}: {id} is a shared entity edited on this branch; edit it on {reference}"
            ));
        }
    }
    if !vault.is_project() {
        let under = format!("{vault_rel}/projects/");
        let projects: BTreeSet<&str> = changed
            .iter()
            .filter_map(|p| p.strip_prefix(&under)?.split('/').next())
            .filter_map(|d| {
                CURATED_DIR_RE
                    .captures(d)
                    .and_then(|c| c.get(1))
                    .map(|m| m.as_str())
            })
            .collect();
        if projects.len() > 1 {
            problems.push(format!(
                "this branch changes {} projects ({}); a branch works on one project",
                projects.len(),
                projects.into_iter().collect::<Vec<_>>().join(", ")
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
            "{old}: only counter IDs (PRJ, PRO, MAT, EQP, BLD) are renumbered; date IDs never collide, and older experiment IDs move with `yajna migrate-ids`"
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

    let rewritten = move_id(vault, &page, old, &new)?;
    println!("{old} -> {new}: {rewritten} file(s) rewritten; next: yajna validate");
    Ok(0)
}

/// Rewrite every reference to `old` as `new` in the repo's markdown and the vault's
/// scripts and results tables: `[[links]]`, frontmatter fields, and paths that contain the
/// ID. Returns the number of files rewritten.
/// `paths_only` rewrites only IDs inside paths (`experiments/EXP-0003/run.log`): the repair
/// pass, which must leave prose that names an old ID on purpose alone.
fn rewrite_refs(vault: &Vault, old: &str, new: &str, paths_only: bool) -> Res<usize> {
    let new = new.to_string();
    let mut files = Vec::new();
    collect(&vault.root, &vault.notes, &mut files);
    let mut rewritten = 0;
    for f in files {
        let Ok(text) = fs::read_to_string(&f) else {
            continue;
        };
        // `ns/ID` is a link into another repo only when `ns` is in [repos]; otherwise the
        // prefix is a directory in a path (`runs/RUN-.../run.sh`) and the ID is rewritten.
        // A page's own `previous_id` line is the record of the old ID and stays.
        let out: String = text
            .split_inclusive('\n')
            .map(|line| {
                if line.starts_with("previous_id:") {
                    return line.to_string();
                }
                NS_ID_RE
                    .replace_all(line, |c: &regex::Captures| {
                        if &c[2] != old {
                            return c[0].to_string();
                        }
                        match c.get(1) {
                            None if paths_only => c[0].to_string(),
                            None => new.clone(),
                            Some(ns) if !vault.cfg.repos.contains_key(ns.as_str()) => {
                                format!("{}/{new}", ns.as_str())
                            }
                            Some(_) => c[0].to_string(),
                        }
                    })
                    .into_owned()
            })
            .collect();
        if out != text {
            fs::write(&f, &out).map_err(|e| format!("{}: {e}", f.display()))?;
            rewritten += 1;
        }
    }
    Ok(rewritten)
}

/// Give `page` the ID `new` in place of `old`: rename its file (or project directory) and
/// sidecar directory, and rewrite every reference in the repo's markdown and the vault's
/// scripts. Namespaced IDs point into other repos and are left alone. Returns the number of
/// files rewritten.
pub fn move_id(vault: &Vault, page: &crate::vault::Page, old: &str, new: &str) -> Res<usize> {
    let new = new.to_string();
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

    rewrite_refs(vault, old, &new, false)
}

// --- migrate-ids -------------------------------------------------------------------------

/// When git first recorded a page, as a UTC time; None for a page never committed.
fn first_recorded(vault: &Vault, path: &str) -> Option<jiff::Zoned> {
    let out = git(
        &vault.root,
        &[
            "log",
            "--follow",
            "--diff-filter=A",
            "--format=%at",
            "--",
            path,
        ],
    )
    .ok()?;
    let secs: i64 = out.lines().last()?.trim().parse().ok()?;
    Some(
        jiff::Timestamp::from_second(secs)
            .ok()?
            .to_zoned(jiff::tz::TimeZone::UTC),
    )
}

/// A time a page records for itself, if it falls on `date` (UTC, `YYYYMMDD`).
fn recorded_time(
    page: &crate::vault::Page,
    date: &str,
    git_time: Option<&jiff::Zoned>,
) -> Option<jiff::Zoned> {
    let utc = jiff::tz::TimeZone::UTC;
    let mut candidates: Vec<jiff::Zoned> = ["started", "finished"]
        .iter()
        .filter_map(|k| page.field(k))
        .filter_map(|t| {
            t.parse::<jiff::Timestamp>()
                .ok()
                .or_else(|| t.parse::<jiff::Zoned>().ok().map(|z| z.timestamp()))
        })
        .map(|t| t.to_zoned(utc.clone()))
        .collect();
    candidates.extend(git_time.cloned());
    candidates
        .into_iter()
        .find(|z| z.strftime("%Y%m%d").to_string() == date)
}

/// `yajna migrate-ids` (ADR-0022): give every counter-ID experiment and analysis a date ID,
/// and every date ID with the older 4-character random suffix the time-sortable one; each
/// page keeps its old ID as `previous_id`. New IDs come only from what the history and the
/// pages record (when git first saw the page, its `started` or `finished`, the old number or
/// suffix), so every worktree of the repo migrates to the same IDs and branches still merge.
pub fn migrate_ids(vault: &Vault, dry_run: bool) -> Res<i32> {
    static COUNTER_ID: LazyLock<Regex> =
        LazyLock::new(|| Regex::new(r"^(EXP|ANA)-(\d+)$").unwrap());
    static SHORT_DATE_ID: LazyLock<Regex> =
        LazyLock::new(|| Regex::new(r"^(RUN|ART|AGS|EXP|ANA)-(\d{8})-([0-9a-z]{4})$").unwrap());
    let utc = jiff::tz::TimeZone::UTC;
    let mut used: std::collections::BTreeSet<String> = vault.index()?.into_keys().collect();
    let mut plan = Vec::new();
    for page in vault.pages()? {
        let Some(id) = page.id().map(str::to_string) else {
            continue;
        };
        let path = rel(&page.path, &vault.root).to_string();
        let (prefix, when, mut tail) = if let Some(c) = COUNTER_ID.captures(&id) {
            let n: u32 = c[2].parse().unwrap_or(0);
            let when = first_recorded(vault, &path).unwrap_or_else(|| {
                page.field("created")
                    .and_then(|d| d.parse::<jiff::civil::Date>().ok())
                    .and_then(|d| d.at(12, 0, 0, 0).to_zoned(utc.clone()).ok())
                    .unwrap_or_else(|| jiff::Zoned::now().with_time_zone(utc.clone()))
            });
            (c[1].to_string(), when, n % 1024)
        } else if let Some(c) = SHORT_DATE_ID.captures(&id) {
            // keep the day; the time of day from the page or git when it is that day
            let date = c[2].to_string();
            let git_time = first_recorded(vault, &path);
            let day: jiff::civil::Date = format!("{}-{}-{}", &date[..4], &date[4..6], &date[6..])
                .parse()
                .map_err(|e| format!("{id}: {e}"))?;
            let when = recorded_time(&page, &date, git_time.as_ref())
                .unwrap_or_else(|| day.at(12, 0, 0, 0).to_zoned(utc.clone()).unwrap());
            let tail = c[3]
                .bytes()
                .fold(0u32, |a, b| a.wrapping_mul(31).wrapping_add(b as u32))
                % 1024;
            (c[1].to_string(), when, tail)
        } else {
            continue;
        };
        let mut new = crate::vault::date_id(&prefix, &when, tail);
        while used.contains(&new) {
            tail = (tail + 1) % 1024;
            new = crate::vault::date_id(&prefix, &when, tail);
        }
        used.insert(new.clone());
        plan.push((page.path.clone(), id, new));
    }
    if plan.is_empty() {
        println!("nothing to migrate: every experiment, analysis, run, artifact and session has a current ID");
    }
    for (path, old, new) in &plan {
        println!("{old} -> {new}  {}", rel(path, &vault.root));
        if dry_run {
            continue;
        }
        let page = vault.read(path)?;
        move_id(vault, &page, old, new)?;
        // the page has moved; keep the old ID on it so old references still find it
        let moved = vault.find(new)?;
        let text = fs::read_to_string(&moved.path).map_err(|e| e.to_string())?;
        let text = crate::init::edit_frontmatter(&text, |lines| {
            crate::init::insert_after(lines, "id", &format!("previous_id: {old}"));
        });
        fs::write(&moved.path, text).map_err(|e| e.to_string())?;
    }
    if dry_run {
        println!("{} page(s) would be migrated", plan.len());
        return Ok(0);
    }
    // references a migration missed (paths such as `experiments/EXP-0003/run.log`) are
    // repaired through each page's previous_id; running this again changes nothing
    let mut repaired = 0;
    for page in vault.pages()? {
        if let (Some(old), Some(id)) = (page.field("previous_id"), page.id()) {
            repaired += rewrite_refs(vault, old, id, true)?;
        }
    }
    if repaired > 0 {
        println!("{repaired} file(s) still named an old ID in a path; rewritten");
    }
    // experiments and analyses no longer count
    let counters: Vec<(String, i64)> = vault
        .read_counters()?
        .into_iter()
        .filter(|(k, _)| !crate::vault::DATED_PREFIXES.contains(&k.as_str()))
        .collect();
    fs::write(&vault.counters_file, crate::vault::counters_text(&counters))
        .map_err(|e| e.to_string())?;
    println!(
        "{} page(s) migrated; next: yajna validate, then commit",
        plan.len()
    );
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
            // scripts and results tables in the vault name runs and experiments too
            Some("sh" | "py" | "tsv") if p.starts_with(vault) => out.push(p),
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
        // experiments take date IDs and never collide, so they are not counter IDs here
        assert_eq!(
            curated_id("notes/projects/PRJ-0002-x/experiments/EXP-0011-does-it.md"),
            None
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
