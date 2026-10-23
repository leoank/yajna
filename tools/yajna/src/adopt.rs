//! `yajna adopt` (ADR-0025): an existing markdown file becomes a page. The frontmatter of
//! the type's template goes on top, the file's own body stays as it is, and the file is
//! renamed to start with its new ID. A doc stays in its directory (registered under
//! `[docs]` like `yajna new doc --dir`); every other type moves to where that type lives.
//! Keys of the file's own frontmatter that yajna does not write (pandoc's `lang`,
//! `bibliography`, ...) are kept; `title` becomes the page title and `author`, a person's
//! name rather than a handle, is kept as `authors`.

use std::collections::BTreeSet;
use std::fs;
use std::path::{Component, Path};

use crate::commands::create;
use crate::init::split_raw;
use crate::vault::{canonical_type, entity, rel, Res, Vault};

pub struct Options<'a> {
    pub etype: &'a str,
    pub title: Option<&'a str>,
    pub kind: Option<&'a str>,
    pub project: Option<&'a str>,
    pub experiment: Option<&'a str>,
    pub author: Option<&'a str>,
    pub dry_run: bool,
}

/// Top-level keys of a frontmatter, each with its lines (a key and its indented values).
fn blocks(fm: &str) -> Vec<(String, Vec<String>)> {
    let mut out: Vec<(String, Vec<String>)> = Vec::new();
    for line in fm.lines() {
        let starts_key = !line.starts_with([' ', '\t', '-', '#']) && line.contains(':');
        match (starts_key, out.last_mut()) {
            (true, _) => {
                let key = line.split(':').next().unwrap().trim().to_string();
                out.push((key, vec![line.to_string()]));
            }
            (false, Some(last)) => last.1.push(line.to_string()),
            (false, None) => {}
        }
    }
    out
}

fn scalar(block: &[String]) -> Option<String> {
    let v = block.first()?.split_once(':')?.1.trim();
    let v = v.split(" #").next().unwrap_or(v).trim();
    let v = v.trim_matches(|c| c == '"' || c == '\'');
    (!v.is_empty()).then(|| v.to_string())
}

/// `target` as a path relative to the directory `base`, both absolute.
fn relative(target: &Path, base: &Path) -> String {
    let t: Vec<Component> = target.components().collect();
    let b: Vec<Component> = base.components().collect();
    let common = t.iter().zip(&b).take_while(|(x, y)| x == y).count();
    let mut parts: Vec<String> = vec!["..".to_string(); b.len() - common];
    parts.extend(
        t[common..]
            .iter()
            .map(|c| c.as_os_str().to_string_lossy().to_string()),
    );
    parts.join("/")
}

pub fn cmd_adopt(vault: &Vault, file: &Path, o: &Options) -> Res<i32> {
    let src = fs::canonicalize(file).map_err(|e| format!("{}: {e}", file.display()))?;
    let root = fs::canonicalize(&vault.root).map_err(|e| e.to_string())?;
    let rel_src = src
        .strip_prefix(&root)
        .map_err(|_| format!("{}: not inside this repo", file.display()))?
        .to_path_buf();
    let shown_src = rel_src.to_string_lossy().to_string();
    if src.extension().and_then(|e| e.to_str()) != Some("md") {
        return Err(format!("{shown_src}: only markdown files can be adopted"));
    }
    let etype = canonical_type(o.etype);
    let ent = entity(&etype).ok_or_else(|| format!("unknown page type {etype:?}"))?;
    let text = fs::read_to_string(&src).map_err(|e| format!("{shown_src}: {e}"))?;
    let (fm, body) = split_raw(&text);
    let own = fm.map(blocks).unwrap_or_default();
    if let Some((_, b)) = own.iter().find(|(k, _)| k == "id") {
        return Err(format!(
            "{shown_src} is already a page ({})",
            scalar(b).unwrap_or_default()
        ));
    }

    // keys the type's template writes; the file may not set them, except title and author
    let template = if etype == "doc" && o.kind == Some("meeting") {
        "doc-meeting".to_string()
    } else {
        ent.template.to_string()
    };
    let ttext = vault.template(&template)?;
    let template_keys: BTreeSet<String> = split_raw(&ttext)
        .0
        .map(|f| blocks(f).into_iter().map(|(k, _)| k).collect())
        .unwrap_or_default();
    let clashes: Vec<&str> = own
        .iter()
        .map(|(k, _)| k.as_str())
        .filter(|k| template_keys.contains(*k) && !["title", "author"].contains(k))
        .collect();
    if !clashes.is_empty() {
        return Err(format!(
            "{shown_src}: its frontmatter sets {}, which yajna writes for a {etype}; remove {} and adopt again",
            clashes.join(", "),
            if clashes.len() == 1 { "it" } else { "them" }
        ));
    }

    // the title: --title, else the file's, else its first heading, else its name
    let lines: Vec<&str> = body.lines().collect();
    let first = lines.iter().position(|l| !l.trim().is_empty());
    let heading = first
        .and_then(|i| lines[i].strip_prefix("# "))
        .map(|h| h.trim().to_string());
    let title = o
        .title
        .map(str::to_string)
        .or_else(|| {
            own.iter()
                .find(|(k, _)| k == "title")
                .and_then(|(_, b)| scalar(b))
        })
        .or_else(|| heading.clone())
        .unwrap_or_else(|| {
            src.file_stem()
                .unwrap()
                .to_string_lossy()
                .replace(['-', '_'], " ")
        });
    // a heading that only repeats the title goes; the page and the doc show the title
    let body: String = match (first, &heading) {
        (Some(i), Some(h)) if *h == title => lines[i + 1..].join("\n"),
        _ => body.to_string(),
    };

    // a `.bib` beside the file with the same name is its bibliography
    let sidecar = src.with_extension("bib");
    let has_bib = own.iter().any(|(k, _)| k == "bibliography");
    let dir = src.parent().unwrap();
    let doc_dir = (etype == "doc").then(|| {
        dir.strip_prefix(&root)
            .unwrap()
            .to_string_lossy()
            .to_string()
    });

    if o.dry_run {
        let place = match &doc_dir {
            Some(d) => format!("stays in {d}/"),
            None => format!("moves to where a {etype} lives"),
        };
        println!(
            "{shown_src}: would become a {etype}{} titled {title:?}; it {place}, renamed to start with its ID{}",
            o.kind.map(|k| format!(" ({k})")).unwrap_or_default(),
            if !has_bib && sidecar.is_file() {
                format!(", with bibliography {}", sidecar.file_name().unwrap().to_string_lossy())
            } else {
                String::new()
            }
        );
        return Ok(0);
    }

    let path = create(
        vault,
        &etype,
        Some(&title),
        o.project,
        o.experiment,
        o.kind,
        false,
        o.author,
        None,
        doc_dir.as_deref(),
    )?;
    let made = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut fm_lines: Vec<String> = split_raw(&made)
        .0
        .unwrap_or_default()
        .lines()
        .map(str::to_string)
        .collect();
    for (key, mut block) in own {
        match key.as_str() {
            "title" => {}
            "author" => {
                block[0] = block[0].replacen("author", "authors", 1);
                fm_lines.extend(block);
            }
            _ => fm_lines.extend(block),
        }
    }
    if !has_bib && sidecar.is_file() {
        let page_dir = fs::canonicalize(path.parent().unwrap()).map_err(|e| e.to_string())?;
        fm_lines.push(format!("bibliography: {}", relative(&sidecar, &page_dir)));
    }
    let text = format!(
        "---\n{}\n---\n\n{}\n",
        fm_lines.join("\n"),
        body.trim_matches('\n')
    );
    fs::write(&path, text).map_err(|e| e.to_string())?;
    let new = fs::canonicalize(&path).map_err(|e| e.to_string())?;
    if new != src {
        fs::remove_file(&src).map_err(|e| format!("{shown_src}: {e}"))?;
        eprintln!(
            "adopted {shown_src}; it is now {} (links to the old name need updating by hand)",
            rel(&path, &vault.root)
        );
    }
    println!("{}", rel(&path, &vault.root));
    Ok(0)
}
