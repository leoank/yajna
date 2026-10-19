//! `yajna export` (ADR-0010): a one-way, read-only snapshot of chosen pages for an
//! institutional ELN. A bundle is a directory (and a .tar.gz of it) holding one HTML page
//! per notebook page, the markdown sources, a manifest and SHA-256 sums, stamped with the
//! git commit it was cut from. `notes/exports.tsv` records each export so the next one
//! takes only what changed. Uploading is left to the ELN that receives it.

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use pulldown_cmark::{html, Options, Parser};
use serde_json::{json, Value};
use sha2::{Digest, Sha256};

use crate::site::{esc, CSS};
use crate::validate;
use crate::vault::{
    iso_minutes, map_outside_code, rel, Page, Res, Vault, ID_FULL_RE, LINK_RE, NS_ID_RE,
};

fn git(root: &Path, args: &[&str]) -> Res<String> {
    let out = Command::new("git")
        .arg("-C")
        .arg(root)
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

fn exports_file(vault: &Vault) -> PathBuf {
    vault.notes.join("exports.tsv")
}

/// The commit of the most recent export recorded in `notes/exports.tsv`.
fn last_export(vault: &Vault) -> Option<String> {
    let text = fs::read_to_string(exports_file(vault)).ok()?;
    text.lines()
        .skip(1)
        .filter(|l| !l.trim().is_empty())
        .last()
        .and_then(|l| l.split('\t').nth(1))
        .map(str::to_string)
}

/// The page a changed file belongs to: the page itself, or the page whose ID names one of
/// the directories it sits in (an experiment's or a run's sidecar).
fn owner(
    path: &str,
    by_path: &BTreeMap<String, Page>,
    by_id: &BTreeMap<String, String>,
) -> Option<String> {
    if by_path.contains_key(path) {
        return Some(path.to_string());
    }
    path.split('/')
        .rev()
        .skip(1)
        .find(|c| ID_FULL_RE.is_match(c))
        .and_then(|id| by_id.get(id).cloned())
}

/// File name of a page inside the bundle.
fn html_name(page: &Page) -> String {
    if let Some(id) = page.id() {
        return format!("{id}.html");
    }
    let stem = page
        .path
        .file_stem()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    match page.field("type") {
        Some("reference") => format!("ref-{stem}.html"),
        Some("log") => format!("log-{stem}.html"),
        _ => format!("page-{stem}.html"),
    }
}

fn title_of(page: &Page) -> String {
    page.field("title")
        .map(str::to_string)
        .or_else(|| page.field("citekey").map(|k| format!("@{k}")))
        .or_else(|| match page.meta.as_ref()?.get("date")? {
            Value::String(d) => Some(format!("Log {d}")),
            _ => None,
        })
        .unwrap_or_else(|| html_name(page))
}

/// `[[ID]]` links to pages in the bundle become links; everything else becomes plain text,
/// so a bundle never points outside itself.
fn linkify(md: &str, bundle: &BTreeMap<String, String>) -> String {
    map_outside_code(md, |prose| {
        LINK_RE
            .replace_all(prose, |c: &regex::Captures| {
                let inner = c[0].trim_start_matches("[[").trim_end_matches("]]");
                let (target, label) = match inner.split_once('|') {
                    Some((t, l)) => (t.trim(), Some(l.trim())),
                    None => (inner.trim(), None),
                };
                let text = label.unwrap_or(target).to_string();
                let id = target.split('@').next().unwrap_or("");
                match NS_ID_RE.captures(id) {
                    Some(m) if m.get(1).is_none() => match bundle.get(&m[2]) {
                        Some(file) => format!("[{text}]({file})"),
                        None => text,
                    },
                    _ => text,
                }
            })
            .into_owned()
    })
}

fn markdown(md: &str) -> String {
    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_TASKLISTS);
    let mut out = String::new();
    html::push_html(&mut out, Parser::new_ext(md, opts));
    out
}

fn sha256(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn html_page(title: &str, stamp: &str, body: &str) -> String {
    format!(
        "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><title>{}</title><style>{CSS}</style></head>\n<body><nav><a href=\"index.html\">export index</a></nav>\n<p class=\"meta\">{stamp}</p>\n{body}\n</body></html>\n",
        esc(title)
    )
}

#[allow(clippy::too_many_arguments)]
pub fn cmd_export(
    vault: &Vault,
    ids: &[String],
    all: bool,
    since: Option<&str>,
    out: Option<&Path>,
    dry_run: bool,
    allow_dirty: bool,
) -> Res<i32> {
    let (problems, _) = validate::validate(vault)?;
    if !problems.is_empty() {
        return Err(format!(
            "{} problem(s); only a valid notebook is exported (run yajna validate)",
            problems.len()
        ));
    }
    let commit = git(&vault.root, &["rev-parse", "HEAD"])
        .map_err(|_| "export needs a git repo with at least one commit".to_string())?;
    let vault_rel = rel(&vault.notes, &vault.root).to_string();
    let dirty = git(&vault.root, &["status", "--porcelain", "--", &vault_rel])?;
    if !dirty.is_empty() && !allow_dirty {
        return Err(format!(
            "uncommitted changes under {vault_rel}/; commit them so the export matches its commit \
             (or pass --allow-dirty):\n{dirty}"
        ));
    }

    // records are pages with frontmatter; loose files such as tasks.md are not exported
    let pages: Vec<Page> = vault
        .pages()?
        .into_iter()
        .filter(|p| p.meta.is_some())
        .collect();
    let by_path: BTreeMap<String, Page> = pages
        .iter()
        .map(|p| (rel(&p.path, &vault.root).to_string(), p.clone()))
        .collect();
    let by_id: BTreeMap<String, String> = by_path
        .iter()
        .filter_map(|(path, p)| p.id().map(|id| (id.to_string(), path.clone())))
        .collect();

    // what goes in: named pages, everything, or what changed since the last export
    let mut chosen: BTreeSet<String> = BTreeSet::new();
    let mut basis = String::from("all pages");
    if !ids.is_empty() {
        for id in ids {
            match by_id.get(id) {
                Some(p) => chosen.insert(p.clone()),
                None => return Err(format!("{id}: no page has this id")),
            };
        }
        basis = format!("named: {}", ids.join(" "));
    } else if all {
        chosen.extend(by_path.keys().cloned());
    } else {
        match since.map(str::to_string).or_else(|| last_export(vault)) {
            None => chosen.extend(by_path.keys().cloned()),
            Some(base) => {
                let changed = git(
                    &vault.root,
                    &[
                        "diff",
                        "--name-only",
                        "--relative",
                        &base,
                        "HEAD",
                        "--",
                        &vault_rel,
                    ],
                )?;
                for f in changed.lines() {
                    if let Some(p) = owner(f, &by_path, &by_id) {
                        chosen.insert(p);
                    }
                }
                basis = format!("changed since {}", &base[..base.len().min(12)]);
            }
        }
    }
    if chosen.is_empty() {
        println!("nothing to export ({basis})");
        return Ok(0);
    }
    if dry_run {
        for p in &chosen {
            println!("{p}");
        }
        println!("{} page(s) would be exported ({basis})", chosen.len());
        return Ok(0);
    }

    // the bundle
    let now = vault.now();
    let ns = vault
        .cfg
        .namespace
        .clone()
        .unwrap_or_else(|| "notebook".into());
    let short = &commit[..commit.len().min(12)];
    let name = format!("eln-{ns}-{}-{short}", now.strftime("%Y%m%d-%H%M"));
    let out = out
        .map(Path::to_path_buf)
        .unwrap_or_else(|| crate::index::cache_dir().join("exports"));
    let dir = out.join(&name);
    if dir.exists() {
        return Err(format!("{} already exists", dir.display()));
    }
    fs::create_dir_all(dir.join("source")).map_err(|e| e.to_string())?;
    let bundle: BTreeMap<String, String> = chosen
        .iter()
        .filter_map(|p| {
            by_path[p]
                .id()
                .map(|id| (id.to_string(), html_name(&by_path[p])))
        })
        .collect();
    let author = vault.default_author();
    let exported_at = iso_minutes(&now);
    let stamp = format!(
        "Exported from <code>{}</code> at commit <code>{commit}</code> on {exported_at} by {}. \
         A read-only snapshot: the notebook repository is the source of truth.",
        esc(&ns),
        esc(&author)
    );

    let mut entries = Vec::new();
    let mut rows = String::new();
    for path in &chosen {
        let page = &by_path[path];
        let src = fs::read(&page.path).map_err(|e| format!("{path}: {e}"))?;
        let source_rel = format!("source/{path}");
        let target = dir.join(&source_rel);
        fs::create_dir_all(target.parent().unwrap()).map_err(|e| e.to_string())?;
        fs::write(&target, &src).map_err(|e| e.to_string())?;
        let file = html_name(page);
        let title = title_of(page);
        let mut meta = String::from("<table class=\"meta\">");
        if let Some(obj) = &page.meta {
            for (k, v) in obj {
                let shown = match v {
                    Value::Null => continue,
                    Value::String(s) => s.clone(),
                    other => other.to_string(),
                };
                meta.push_str(&format!(
                    "<tr><td>{}</td><td>{}</td></tr>",
                    esc(k),
                    esc(&shown)
                ));
            }
        }
        meta.push_str("</table>");
        let digest = sha256(&src);
        let body = format!(
            "<h1>{}</h1>\n<p class=\"meta\">source <a href=\"{source_rel}\">{}</a>, sha256 <code>{digest}</code></p>\n{meta}\n{}",
            esc(&title),
            esc(path),
            markdown(&linkify(&page.body, &bundle))
        );
        fs::write(dir.join(&file), html_page(&title, &stamp, &body)).map_err(|e| e.to_string())?;
        rows.push_str(&format!(
            "<tr><td><a href=\"{file}\">{}</a></td><td>{}</td><td>{}</td><td>{}</td></tr>\n",
            esc(page.id().unwrap_or("")),
            esc(page.field("type").unwrap_or("")),
            esc(&title),
            esc(path)
        ));
        entries.push(json!({
            "id": page.id(),
            "type": page.field("type"),
            "title": title,
            "path": path,
            "html": file,
            "source": source_rel,
            "sha256": digest,
        }));
    }
    let index = format!(
        "<h1>ELN export {}</h1>\n<p>{} page(s), {basis}.</p>\n<table><tr><th>id</th><th>type</th><th>title</th><th>path</th></tr>\n{rows}</table>",
        esc(&exported_at),
        chosen.len()
    );
    fs::write(dir.join("index.html"), html_page(&name, &stamp, &index))
        .map_err(|e| e.to_string())?;
    let manifest = json!({
        "bundle": name,
        "namespace": ns,
        "commit": commit,
        "exported_at": exported_at,
        "exported_by": author,
        "selection": basis,
        "dirty": !dirty.is_empty(),
        "pages": entries,
    });
    fs::write(
        dir.join("manifest.json"),
        serde_json::to_string_pretty(&manifest).unwrap() + "\n",
    )
    .map_err(|e| e.to_string())?;

    // SHA256SUMS over every file, then everything read-only
    let mut files = Vec::new();
    walk(&dir, &mut files);
    files.sort();
    let mut sums = String::new();
    for f in &files {
        let bytes = fs::read(f).map_err(|e| e.to_string())?;
        sums.push_str(&format!("{}  {}\n", sha256(&bytes), rel(f, &dir)));
    }
    fs::write(dir.join("SHA256SUMS"), sums).map_err(|e| e.to_string())?;
    files.push(dir.join("SHA256SUMS"));
    #[cfg(unix)]
    for f in &files {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(f, fs::Permissions::from_mode(0o444));
    }
    let archive = out.join(format!("{name}.tar.gz"));
    let tarred = Command::new("tar")
        .arg("-czf")
        .arg(&archive)
        .arg("-C")
        .arg(&out)
        .arg(&name)
        .status()
        .map(|s| s.success())
        .unwrap_or(false);

    // the record, in the repo
    let record = exports_file(vault);
    let mut text = fs::read_to_string(&record).unwrap_or_default();
    if text.is_empty() {
        text.push_str("exported_at\tcommit\tbundle\tpages\tselection\n");
    }
    text.push_str(&format!(
        "{exported_at}\t{commit}\t{name}\t{}\t{basis}\n",
        chosen.len()
    ));
    fs::write(&record, text).map_err(|e| e.to_string())?;

    println!("{}: {} page(s), {basis}", dir.display(), chosen.len());
    if tarred {
        println!("{}", archive.display());
    }
    println!(
        "next: upload the bundle to the ELN, then commit {} so the next export starts from here",
        rel(&record, &vault.root)
    );
    Ok(0)
}

fn walk(dir: &Path, out: &mut Vec<PathBuf>) {
    let Ok(rd) = fs::read_dir(dir) else { return };
    for e in rd.flatten() {
        let p = e.path();
        if p.is_dir() {
            walk(&p, out);
        } else {
            out.push(p);
        }
    }
}
