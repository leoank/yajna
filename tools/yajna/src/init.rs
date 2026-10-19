//! `yajna init lab|project` and `yajna graduate` (ADR-0018): create a repo of either shape,
//! copy a project's notebook out of a lab into its own repo, and mark the lab's page moved.

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Component, Path, PathBuf};
use std::process::Command;

use jiff::tz::TimeZone;

use crate::cli::InitShape;
use crate::refs;
use crate::vault::{counters_text, rel, slugify, Res, Vault, CONFIG_NAME, LINK_RE, NS_ID_RE};
use crate::yamlfmt::{dump_scalar, title_scalar};

const LAB_DIRS: &[&str] = &[
    "projects",
    "protocols",
    "materials",
    "equipment",
    "builds",
    "agents",
    "log",
    "references",
];
const PROJECT_DIRS: &[&str] = &[
    "experiments",
    "runs",
    "analyses",
    "artifacts",
    "agents",
    "log",
    "references",
];
/// The project page's ID in a project-shaped repo.
const SOLE_PROJECT: &str = "PRJ-0001";

pub fn run(here: &Path, shape: &InitShape) -> Res<i32> {
    match shape {
        InitShape::Lab {
            path,
            namespace,
            author,
        } => {
            let root = path.clone().unwrap_or_else(|| here.to_path_buf());
            fs::create_dir_all(&root).map_err(|e| format!("{}: {e}", root.display()))?;
            let root = canonical(&root)?;
            let ns = namespace.clone().unwrap_or_else(|| dir_name(&root));
            let author = author.clone().unwrap_or_else(default_author);
            init_lab(&root, &ns, &author)?;
        }
        InitShape::Project {
            name,
            from,
            namespace,
            author,
        } => {
            let root = canonical(here)?;
            let ns = namespace.clone().unwrap_or_else(|| dir_name(&root));
            match from {
                Some(lab) => {
                    let lab = Vault::open(canonical(lab)?)?;
                    let author = author.clone().unwrap_or_else(|| lab.author.clone());
                    import_project(&root, &lab, name, &ns, &author, None)?;
                }
                None => {
                    let author = author.clone().unwrap_or_else(default_author);
                    init_project(&root, name, &ns, &author)?;
                }
            }
        }
    }
    Ok(0)
}

// --- init ------------------------------------------------------------------------------

fn init_lab(root: &Path, ns: &str, author: &str) -> Res<()> {
    check_namespace(ns)?;
    ensure_fresh(root)?;
    for d in LAB_DIRS {
        fs::create_dir_all(root.join("notes").join(d)).map_err(|e| e.to_string())?;
    }
    put(root, CONFIG_NAME, &config_text("lab", ns, author, &[]))?;
    let vault = Vault::open(root.to_path_buf())?;
    put(root, "notes/README.md", &vault.template("init/README.md")?)?;
    put(root, "notes/tasks.md", &vault.template("init/tasks.md")?)?;
    let zero: Vec<(String, i64)> = ["PRJ", "EXP", "PRO", "MAT", "ANA", "EQP", "BLD"]
        .iter()
        .map(|p| (p.to_string(), 0))
        .collect();
    put(root, "notes/counters.yaml", &counters_text(&zero))?;
    put_if_absent(root, "references/library.bib", "")?;
    crate::commands::write_skill(root)?;
    println!("created .claude/skills/yajna/SKILL.md");
    println!("lab {ns} ready; next: yajna new project \"<title>\"");
    Ok(())
}

fn init_project(root: &Path, title: &str, ns: &str, author: &str) -> Res<()> {
    check_namespace(ns)?;
    ensure_fresh(root)?;
    scaffold_project_vault(root, ns, author, &[])?;
    put(
        root,
        "notes/counters.yaml",
        &counters_text(&[("PRJ".into(), 1), ("EXP".into(), 0), ("ANA".into(), 0)]),
    )?;
    let vault = Vault::open(root.to_path_buf())?;
    let created = vault.today();
    let page = vault.render(
        "project",
        &[
            ("id", SOLE_PROJECT),
            ("title", &title_scalar(title)),
            ("created", &created),
            ("author", author),
            ("code", "."),
        ],
    )?;
    put(root, "notes/README.md", &page)?;
    println!("project {ns} ready; next: yajna new experiment \"<title>\"");
    Ok(())
}

/// `yajna.toml` and the `lab/` directories of a project repo; `repos` are `(namespace,
/// toml value)` pairs for `[repos]`.
fn scaffold_project_vault(
    root: &Path,
    ns: &str,
    author: &str,
    repos: &[(String, String)],
) -> Res<()> {
    for d in PROJECT_DIRS {
        fs::create_dir_all(root.join("notes").join(d)).map_err(|e| e.to_string())?;
    }
    put(
        root,
        CONFIG_NAME,
        &config_text("project", ns, author, repos),
    )?;
    let vault = Vault::open(root.to_path_buf())?;
    put(root, "notes/tasks.md", &vault.template("init/tasks.md")?)?;
    put_if_absent(root, "notes/references/library.bib", "")?;
    crate::commands::write_skill(root)?;
    println!("created .claude/skills/yajna/SKILL.md");
    Ok(())
}

fn config_text(shape: &str, ns: &str, author: &str, repos: &[(String, String)]) -> String {
    let tz = TimeZone::system();
    let tz = tz.iana_name().unwrap_or("UTC");
    let bib = if shape == "project" {
        "notes/references/library.bib"
    } else {
        "references/library.bib"
    };
    let mut s = format!(
        "# Repo-level configuration for the yajna CLI.\n\
         shape = {shape:?}       # lab | project (ADR-0018)\n\
         namespace = {ns:?}  # this repo's name in links from other repos\n\
         author = {author:?}      # the human author handle written into every page\n\
         vault = \"notes\"       # the notebook directory, relative to this file\n\
         timezone = {tz:?}\n\
         bibliography = {bib:?}\n\
         \n\
         [repos]             # namespaces this repo links to, e.g. rc2s2 = \"github:leoank/rc2s2\"\n"
    );
    for (k, v) in repos {
        s.push_str(&format!("{k} = {v}\n"));
    }
    s
}

// --- import (init project --from) ----------------------------------------------------

/// Copy project `prj` out of `lab` into `root/lab/` (ADR-0018 step 3): the project page as
/// `notes/README.md` with `origin`, its experiments, runs, analyses and artifacts with their
/// sidecars, the reading notes and `.bib` entries they cite, and counters seeded from the
/// highest copied IDs. Links to pages that stay in the lab get the lab's namespace.
pub fn import_project(
    root: &Path,
    lab: &Vault,
    prj: &str,
    ns: &str,
    author: &str,
    lab_url: Option<String>,
) -> Res<()> {
    check_namespace(ns)?;
    if lab.is_project() {
        return Err(format!("{}: --from must be a lab repo", lab.root.display()));
    }
    let lab_ns = lab.namespace()?.to_string();
    if lab_ns == ns {
        return Err(format!(
            "namespace {ns} is the lab's own; pick another with --namespace"
        ));
    }
    ensure_fresh(root)?;
    let page = lab.find(prj)?;
    if page.field("type") != Some("project") {
        return Err(format!("{prj} is not a project"));
    }
    let src = lab.project_dir(prj)?;

    // Every page under the project directory keeps its ID; the project page becomes PRJ-0001.
    let mut files = Vec::new();
    walk(&src, &mut files)?;
    let mut keep: BTreeSet<String> = BTreeSet::new();
    for f in &files {
        if f.extension().map(|e| e == "md").unwrap_or(false) {
            if let Some(id) = lab.read(f)?.id() {
                keep.insert(id.to_string());
            }
        }
    }
    let mut rename = BTreeMap::new();
    rename.insert(prj.to_string(), SOLE_PROJECT.to_string());
    let rewrite = |text: &str| rewrite_ids(text, &keep, &rename, &lab_ns);

    let lab_url = lab_url.or_else(|| remote_url(&lab.root));
    let lab_entry = repo_entry(lab_url.as_deref(), &relative(root, &lab.root));
    scaffold_project_vault(root, ns, author, &[(lab_ns.clone(), lab_entry)])?;
    let dst = root.join("notes");

    let mut pages = 0;
    let mut cited: BTreeSet<String> = BTreeSet::new();
    let mut highest: BTreeMap<String, i64> = BTreeMap::new();
    for f in &files {
        let r = f.strip_prefix(&src).unwrap();
        let target = dst.join(r);
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        if f.extension().map(|e| e == "md").unwrap_or(false) {
            let text = fs::read_to_string(f).map_err(|e| format!("{}: {e}", f.display()))?;
            let mut text = rewrite(&text);
            if r == Path::new("README.md") {
                text = edit_frontmatter(&text, |lines| {
                    set_field(lines, "code", ".");
                    insert_after(lines, "id", &format!("origin: {lab_ns}/{prj}"));
                });
            }
            cited.extend(refs::citations(&text));
            if let (Some(id), Some((prefix, n))) = (
                lab.read(f)?.id(),
                lab.read(f)?.id().and_then(curated_number),
            ) {
                if !rename.contains_key(id) {
                    let e = highest.entry(prefix).or_insert(0);
                    *e = (*e).max(n);
                }
            }
            fs::write(&target, text).map_err(|e| format!("{}: {e}", target.display()))?;
            pages += 1;
        } else {
            fs::copy(f, &target).map_err(|e| format!("{}: {e}", target.display()))?;
        }
        println!("copied {}", rel(&target, root));
    }

    // Reading notes and bibliography entries for the keys the copied pages cite.
    let lab_bib = fs::read_to_string(refs::bib_path(lab)).unwrap_or_default();
    let mut bib = String::new();
    let mut notes = 0;
    for key in &cited {
        let note = refs::note_path(lab, key);
        if note.is_file() {
            let text = fs::read_to_string(&note).map_err(|e| e.to_string())?;
            let target = dst.join("references").join(format!("{key}.md"));
            fs::write(&target, rewrite(&text)).map_err(|e| e.to_string())?;
            println!("copied {}", rel(&target, root));
            notes += 1;
        }
        if let Some(entry) = refs::raw_entry(&lab_bib, key) {
            bib.push_str(entry);
            bib.push_str("\n\n");
        }
    }
    if !bib.is_empty() {
        put(root, "notes/references/library.bib", &bib)?;
    }

    let mut counters: Vec<(String, i64)> = vec![(String::from("PRJ"), 1)];
    for p in ["EXP", "ANA"] {
        counters.push((p.to_string(), *highest.get(p).unwrap_or(&0)));
    }
    put(root, "notes/counters.yaml", &counters_text(&counters))?;
    println!(
        "imported {prj} from {} as {ns}/{SOLE_PROJECT}: {pages} page(s), {notes} reading note(s), {} citation(s)",
        lab.root.display(),
        cited.len()
    );
    Ok(())
}

/// `(prefix, number)` of a curated ID such as `EXP-0007`; volume IDs give None.
fn curated_number(id: &str) -> Option<(String, i64)> {
    let (prefix, rest) = id.split_once('-')?;
    let n: i64 = rest.parse().ok()?;
    Some((prefix.to_string(), n))
}

/// Rewrite the IDs in frontmatter fields and `[[links]]`: renamed ones get their new ID,
/// copied ones stay bare, anything else gets `lab_ns/`. Namespaced IDs are left alone.
fn rewrite_ids(
    text: &str,
    keep: &BTreeSet<String>,
    rename: &BTreeMap<String, String>,
    lab_ns: &str,
) -> String {
    let map = |s: &str| -> String {
        NS_ID_RE
            .replace_all(s, |c: &regex::Captures| {
                if c.get(1).is_some() {
                    return c[0].to_string();
                }
                let id = &c[2];
                match rename.get(id) {
                    Some(new) => new.clone(),
                    None if keep.contains(id) => id.to_string(),
                    None => format!("{lab_ns}/{id}"),
                }
            })
            .into_owned()
    };
    let (fm, body) = split_raw(text);
    let body = LINK_RE
        .replace_all(body, |c: &regex::Captures| {
            format!("[[{}]]", map(&c[0][2..c[0].len() - 2]))
        })
        .into_owned();
    match fm {
        Some(fm) => format!("---\n{}\n---\n{body}", map(fm)),
        None => body,
    }
}

/// (raw frontmatter text without the fences, rest), or (None, whole text).
fn split_raw(text: &str) -> (Option<&str>, &str) {
    if let Some(rest) = text.strip_prefix("---\n") {
        if let Some(end) = rest.find("\n---\n") {
            return (Some(&rest[..end]), &rest[end + 5..]);
        }
    }
    (None, text)
}

/// Apply line edits to the frontmatter of a page's text.
fn edit_frontmatter(text: &str, edit: impl FnOnce(&mut Vec<String>)) -> String {
    let (fm, body) = split_raw(text);
    let Some(fm) = fm else {
        return text.to_string();
    };
    let mut lines: Vec<String> = fm.lines().map(str::to_string).collect();
    edit(&mut lines);
    format!("---\n{}\n---\n{body}", lines.join("\n"))
}

fn set_field(lines: &mut Vec<String>, key: &str, value: &str) {
    let line = format!("{key}: {}", dump_scalar(value));
    match lines.iter().position(|l| l.starts_with(&format!("{key}:"))) {
        Some(i) => lines[i] = line,
        None => lines.push(line),
    }
}

fn insert_after(lines: &mut Vec<String>, key: &str, line: &str) {
    let i = lines
        .iter()
        .position(|l| l.starts_with(&format!("{key}:")))
        .map(|i| i + 1)
        .unwrap_or(lines.len());
    lines.insert(i, line.to_string());
}

// --- graduate --------------------------------------------------------------------------

/// ADR-0018 steps 2 and 3: split the code directory into the repo checked out at `into`,
/// import the notebook there, and mark the lab's page moved.
pub fn graduate(
    vault: &Vault,
    prj: &str,
    to: &str,
    into: Option<&Path>,
    ns: Option<&str>,
) -> Res<i32> {
    if vault.is_project() {
        return Err("graduate runs in a lab repo".to_string());
    }
    let lab_ns = vault.namespace()?.to_string();
    let page = vault.find(prj)?;
    if page.field("type") != Some("project") {
        return Err(format!("{prj} is not a project"));
    }
    if page.field("status") == Some("moved") {
        return Err(format!("{prj} has already moved"));
    }
    let code = page
        .field("code")
        .filter(|c| !c.contains(':'))
        .ok_or_else(|| format!("{prj} has no code directory under code/"))?
        .trim_end_matches('/')
        .to_string();
    if !vault.root.join(&code).is_dir() {
        return Err(format!("code directory {code} does not exist"));
    }
    let ns = ns.map(str::to_string).unwrap_or_else(|| namespace_of(to));
    check_namespace(&ns)?;
    let into = into
        .map(Path::to_path_buf)
        .unwrap_or_else(|| vault.root.join("..").join(&ns));
    let into = canonical(&into).map_err(|_| {
        format!(
            "{}: not found; check out the new, empty repo there first (or pass --into)",
            into.display()
        )
    })?;
    if !into.join(".git").exists() {
        return Err(format!("{}: not a git repo", into.display()));
    }
    if into.join(CONFIG_NAME).exists() {
        return Err(format!("{}: already has {CONFIG_NAME}", into.display()));
    }
    let dirty = git(&vault.root, &["status", "--porcelain", "--", &code])?;
    if !dirty.trim().is_empty() {
        return Err(format!(
            "uncommitted changes under {code}; commit them first"
        ));
    }

    // 1. The code with its history becomes the new repo's root.
    let slug = Path::new(&code)
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    let branch = format!("graduate/{slug}");
    git(
        &vault.root,
        &["subtree", "split", "-P", &code, "-b", &branch],
    )?;
    let lab_root = vault.root.to_string_lossy().to_string();
    let fetched = git(&into, &["fetch", &lab_root, &branch]);
    let _ = git(&vault.root, &["branch", "-D", &branch]);
    fetched?;
    let has_head = Command::new("git")
        .args([
            "-C",
            &into.to_string_lossy(),
            "rev-parse",
            "--verify",
            "-q",
            "HEAD",
        ])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    if has_head {
        git(
            &into,
            &[
                "merge",
                "--allow-unrelated-histories",
                "-m",
                &format!("feat: import {code} from the {lab_ns} lab with its history"),
                "FETCH_HEAD",
            ],
        )?;
    } else {
        git(&into, &["reset", "--hard", "FETCH_HEAD"])?;
    }
    println!("code: {code} is now the root of {}", into.display());

    // 2. The notebook follows.
    import_project(
        &into,
        vault,
        prj,
        &ns,
        &vault.author,
        remote_url(&vault.root),
    )?;

    // 3. The lab page points onward and is frozen.
    let continued = format!("{ns}/{SOLE_PROJECT}");
    let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |lines| {
        set_field(lines, "status", "moved");
        set_field(lines, "code", to);
        insert_after(lines, "code", &format!("continued_in: {continued}"));
    });
    let (fm, body) = split_raw(&text);
    let text = format!(
        "---\n{}\n---\n\nContinued in [[{continued}]].\n{body}",
        fm.unwrap_or("")
    );
    fs::write(&page.path, text).map_err(|e| e.to_string())?;
    println!("marked {} moved", rel(&page.path, &vault.root));

    // 4. The lab's flake no longer builds it, and [repos] knows the namespace.
    let flake = vault.root.join("flake.nix");
    if let Ok(text) = fs::read_to_string(&flake) {
        let marker = format!("  inputs.{slug} = ");
        let kept: Vec<&str> = text
            .split_inclusive('\n')
            .filter(|l| !l.starts_with(&marker))
            .collect();
        if kept.len() < text.lines().count() {
            fs::write(&flake, kept.concat()).map_err(|e| e.to_string())?;
            println!("removed input {slug} from flake.nix; next: nix flake lock");
        }
    }
    let entry = repo_entry(Some(to), &relative(&vault.root, &into));
    add_repo(&vault.root.join(CONFIG_NAME), &ns, &entry)?;
    println!(
        "next: commit here and in {}; add the remote {to} there and push; record the move in the progress log",
        into.display()
    );
    Ok(0)
}

/// Append `ns = entry` to `[repos]` in yajna.toml, adding the section when missing.
fn add_repo(config: &Path, ns: &str, entry: &str) -> Res<()> {
    let text = fs::read_to_string(config).map_err(|e| format!("{}: {e}", config.display()))?;
    let line = format!("{ns} = {entry}\n");
    let out = match text
        .lines()
        .position(|l| l.trim_start().starts_with("[repos]"))
    {
        Some(i) => {
            let mut lines: Vec<String> = text.split_inclusive('\n').map(str::to_string).collect();
            lines.insert(i + 1, line);
            lines.concat()
        }
        None => format!("{}\n[repos]\n{line}", text.trim_end_matches('\n')),
    };
    fs::write(config, out).map_err(|e| e.to_string())
}

// --- helpers ---------------------------------------------------------------------------

fn canonical(p: &Path) -> Res<PathBuf> {
    p.canonicalize()
        .map_err(|e| format!("{}: {e}", p.display()))
}

fn dir_name(root: &Path) -> String {
    slugify(
        &root
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_default(),
    )
}

fn default_author() -> String {
    std::env::var("USER")
        .or_else(|_| std::env::var("USERNAME"))
        .map(|u| slugify(&u))
        .unwrap_or_else(|_| "unknown".to_string())
}

fn check_namespace(ns: &str) -> Res<()> {
    let ok = ns.starts_with(|c: char| c.is_ascii_lowercase())
        && ns
            .chars()
            .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-' || c == '_');
    if ok {
        Ok(())
    } else {
        Err(format!(
            "namespace {ns:?}: lowercase letters, digits, - and _, starting with a letter"
        ))
    }
}

fn ensure_fresh(root: &Path) -> Res<()> {
    if root.join(CONFIG_NAME).exists() {
        return Err(format!("{}: already has {CONFIG_NAME}", root.display()));
    }
    Ok(())
}

fn put(root: &Path, path: &str, text: &str) -> Res<()> {
    let full = root.join(path);
    if let Some(parent) = full.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&full, text).map_err(|e| format!("{}: {e}", full.display()))?;
    println!("created {path}");
    Ok(())
}

fn put_if_absent(root: &Path, path: &str, text: &str) -> Res<()> {
    if root.join(path).exists() {
        return Ok(());
    }
    put(root, path, text)
}

fn walk(dir: &Path, out: &mut Vec<PathBuf>) -> Res<()> {
    let rd = fs::read_dir(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    let mut entries: Vec<PathBuf> = rd.flatten().map(|e| e.path()).collect();
    entries.sort();
    for p in entries {
        if p.is_dir() {
            walk(&p, out)?;
        } else {
            out.push(p);
        }
    }
    Ok(())
}

fn git(dir: &Path, args: &[&str]) -> Res<String> {
    let out = Command::new("git")
        .arg("-C")
        .arg(dir)
        .args(args)
        .output()
        .map_err(|e| format!("git: {e}"))?;
    if !out.status.success() {
        return Err(format!(
            "git {} failed in {}: {}",
            args.join(" "),
            dir.display(),
            String::from_utf8_lossy(&out.stderr).trim()
        ));
    }
    Ok(String::from_utf8_lossy(&out.stdout).into_owned())
}

/// `origin` of a checkout as a flake-style location: `github:owner/repo` for GitHub, the
/// URL as given otherwise, None without a remote.
pub fn remote_url(root: &Path) -> Option<String> {
    let url = git(root, &["remote", "get-url", "origin"]).ok()?;
    let url = url.trim();
    if url.is_empty() {
        return None;
    }
    let path = url
        .strip_prefix("git@github.com:")
        .or_else(|| url.strip_prefix("https://github.com/"))
        .or_else(|| url.strip_prefix("ssh://git@github.com/"));
    Some(match path {
        Some(p) => format!(
            "github:{}",
            p.trim_end_matches('/').trim_end_matches(".git")
        ),
        None => url.to_string(),
    })
}

/// `namespace` for a location: the last path segment, without `.git`.
fn namespace_of(to: &str) -> String {
    let tail = to
        .trim_end_matches('/')
        .trim_end_matches(".git")
        .rsplit(['/', ':'])
        .next()
        .unwrap_or("");
    slugify(tail)
}

fn repo_entry(url: Option<&str>, path: &str) -> String {
    match url {
        Some(u) => format!("{{ url = {u:?}, path = {path:?} }}"),
        None => format!("{{ path = {path:?} }}"),
    }
}

/// `to` relative to the directory `from`, both absolute.
pub fn relative(from: &Path, to: &Path) -> String {
    let a: Vec<Component> = from.components().collect();
    let b: Vec<Component> = to.components().collect();
    let common = a.iter().zip(&b).take_while(|(x, y)| x == y).count();
    let mut parts: Vec<String> = vec!["..".to_string(); a.len() - common];
    parts.extend(
        b[common..]
            .iter()
            .map(|c| c.as_os_str().to_string_lossy().to_string()),
    );
    if parts.is_empty() {
        ".".to_string()
    } else {
        parts.join("/")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rewrite() {
        let keep: BTreeSet<String> = ["EXP-0001".to_string(), "RUN-20261016-abcd".to_string()]
            .into_iter()
            .collect();
        let mut rename = BTreeMap::new();
        rename.insert("PRJ-0002".to_string(), "PRJ-0001".to_string());
        let text = "---\nid: EXP-0001\nproject: PRJ-0002\nprotocols: [PRO-0012, yajna/PRO-0013]\nmaterials: []\n---\nSee [[PRO-0012@3|the protocol]], [[RUN-20261016-abcd]], [[PRJ-0002]] and [[yajna/MAT-0001]]; bare MAT-0002 stays.\n";
        let out = rewrite_ids(text, &keep, &rename, "yajna");
        assert_eq!(
            out,
            "---\nid: EXP-0001\nproject: PRJ-0001\nprotocols: [yajna/PRO-0012, yajna/PRO-0013]\nmaterials: []\n---\nSee [[yajna/PRO-0012@3|the protocol]], [[RUN-20261016-abcd]], [[PRJ-0001]] and [[yajna/MAT-0001]]; bare MAT-0002 stays.\n"
        );
    }

    #[test]
    fn frontmatter_edits() {
        let text = "---\nid: PRJ-0002\nstatus: active            # active | paused\ncode: code/x   # here\n---\n\n## Body\n";
        let out = edit_frontmatter(text, |l| {
            set_field(l, "status", "moved");
            set_field(l, "code", "github:leoank/x");
            insert_after(l, "code", "continued_in: x/PRJ-0001");
        });
        assert_eq!(
            out,
            "---\nid: PRJ-0002\nstatus: moved\ncode: github:leoank/x\ncontinued_in: x/PRJ-0001\n---\n\n## Body\n"
        );
    }

    #[test]
    fn locations() {
        assert_eq!(namespace_of("github:leoank/rc2s2"), "rc2s2");
        assert_eq!(namespace_of("git@github.com:leoank/rc2s2.git"), "rc2s2");
        assert_eq!(
            relative(Path::new("/w/yajna/main"), Path::new("/w/rc2s2")),
            "../../rc2s2"
        );
        assert_eq!(relative(Path::new("/w/a"), Path::new("/w/a")), ".");
        assert_eq!(
            repo_entry(Some("github:leoank/yajna"), "../yajna/main"),
            "{ url = \"github:leoank/yajna\", path = \"../yajna/main\" }"
        );
    }
}
