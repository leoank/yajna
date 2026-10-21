//! `yajna import benchling` (architecture 5.5): a one-off import of files exported from
//! Benchling by hand, never a sync. GenBank records (`.gb`, `.gbk`, `.genbank`, from the UI
//! or the API) become `MAT` pages with the record kept beside them; notebook entries saved
//! as the API's JSON (`GET /entries/{id}`) become `EXP` pages with one section per day.
//! Each page carries `benchling: <key>` so a second import of the same file skips it.

use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

use serde_json::Value;

use crate::commands::create;
use crate::init::{edit_frontmatter, set_field};
use crate::vault::{rel, slugify, Res, Vault};

pub struct Options<'a> {
    pub project: Option<&'a str>,
    pub kind: &'a str,
    pub status: &'a str,
    pub dry_run: bool,
}

/// Text from Benchling must not turn into notebook syntax: `@name` would read as a citation
/// and `[[x]]` as a link.
pub(crate) fn literal(s: &str) -> String {
    s.replace('@', "&#64;").replace("[[", "&#91;&#91;")
}

fn existing_keys(vault: &Vault) -> Res<BTreeSet<String>> {
    Ok(vault
        .pages()?
        .iter()
        .filter_map(|p| p.field("benchling").map(str::to_string))
        .collect())
}

fn files_under(path: &Path, out: &mut Vec<PathBuf>) -> Res<()> {
    if path.is_dir() {
        let mut entries: Vec<PathBuf> = fs::read_dir(path)
            .map_err(|e| format!("{}: {e}", path.display()))?
            .flatten()
            .map(|e| e.path())
            .collect();
        entries.sort();
        for p in entries {
            files_under(&p, out)?;
        }
    } else if path.is_file() {
        out.push(path.to_path_buf());
    } else {
        return Err(format!("{}: no such file or directory", path.display()));
    }
    Ok(())
}

pub fn cmd_import_benchling(vault: &Vault, paths: &[PathBuf], opts: &Options) -> Res<i32> {
    let mut files = Vec::new();
    for p in paths {
        files_under(p, &mut files)?;
    }
    let mut seen = existing_keys(vault)?;
    let (mut made, mut skipped, mut ignored) = (0, 0, 0);
    for f in &files {
        let ext = f
            .extension()
            .map(|e| e.to_string_lossy().to_lowercase())
            .unwrap_or_default();
        let text = || fs::read_to_string(f).map_err(|e| format!("{}: {e}", f.display()));
        let results = match ext.as_str() {
            "gb" | "gbk" | "genbank" => import_genbank(vault, f, &text()?, opts, &mut seen)?,
            "json" => {
                let v: Value = serde_json::from_str(&text()?)
                    .map_err(|e| format!("{}: not JSON: {e}", f.display()))?;
                let entries: Vec<Value> = match v {
                    Value::Array(a) => a,
                    Value::Object(ref o) if o.contains_key("entries") => {
                        o["entries"].as_array().cloned().unwrap_or_default()
                    }
                    other => vec![other],
                };
                let mut r = Vec::new();
                for e in &entries {
                    r.push(import_entry(vault, f, e, opts, &mut seen)?);
                }
                r
            }
            _ => {
                ignored += 1;
                eprintln!("ignored {} (not .gb/.gbk/.genbank or .json)", f.display());
                continue;
            }
        };
        for r in results {
            match r {
                Some(line) => {
                    made += 1;
                    println!("{line}");
                }
                None => skipped += 1,
            }
        }
    }
    let verb = if opts.dry_run {
        "would import"
    } else {
        "imported"
    };
    println!("{verb} {made}, skipped {skipped} already imported, ignored {ignored} file(s)");
    if made > 0 && !opts.dry_run {
        println!("next: yajna validate, then review the pages (stock and outcome are not in Benchling's export)");
    }
    Ok(0)
}

// --- GenBank -----------------------------------------------------------------------------

struct Record {
    locus: String,
    length: String,
    molecule: String,
    topology: String,
    date: String,
    definition: String,
    features: Vec<(String, String, String)>,
    text: String,
}

/// The records of a GenBank file, each ending at its `//` line.
fn parse_genbank(text: &str) -> Vec<Record> {
    let mut out = Vec::new();
    let mut chunk = String::new();
    for line in text.lines() {
        chunk.push_str(line);
        chunk.push('\n');
        if line.trim() == "//" {
            if let Some(r) = parse_record(&chunk) {
                out.push(r);
            }
            chunk.clear();
        }
    }
    if chunk.trim_start().starts_with("LOCUS") {
        if let Some(r) = parse_record(&chunk) {
            out.push(r);
        }
    }
    out
}

fn parse_record(text: &str) -> Option<Record> {
    let locus_line = text.lines().find(|l| l.starts_with("LOCUS"))?;
    let words: Vec<&str> = locus_line.split_whitespace().collect();
    let locus = words.get(1)?.to_string();
    let length = words
        .iter()
        .position(|w| *w == "bp" || *w == "aa")
        .and_then(|i| i.checked_sub(1))
        .and_then(|i| words.get(i))
        .map(|s| s.to_string())
        .unwrap_or_default();
    let molecule = words
        .iter()
        .find(|w| w.contains("DNA") || w.contains("RNA"))
        .map(|s| s.to_string())
        .unwrap_or_default();
    let topology = words
        .iter()
        .find(|w| **w == "circular" || **w == "linear")
        .map(|s| s.to_string())
        .unwrap_or_default();
    let date = words.last().map(|s| s.to_string()).unwrap_or_default();

    let mut definition = String::new();
    let mut in_def = false;
    let mut features = Vec::new();
    let mut in_features = false;
    for line in text.lines() {
        if let Some(rest) = line.strip_prefix("DEFINITION") {
            in_def = true;
            definition = rest.trim().to_string();
            continue;
        }
        if in_def {
            if line.starts_with(' ') {
                definition.push(' ');
                definition.push_str(line.trim());
                continue;
            }
            in_def = false;
        }
        if line.starts_with("FEATURES") {
            in_features = true;
            continue;
        }
        if in_features {
            if !line.starts_with(' ') {
                in_features = false;
                continue;
            }
            let body = line.get(5..).unwrap_or("");
            if !body.starts_with(' ') && !body.trim().is_empty() {
                let mut parts = body.split_whitespace();
                let kind = parts.next().unwrap_or("").to_string();
                let location = parts.collect::<Vec<_>>().join(" ");
                features.push((kind, location, String::new()));
            } else if let Some(q) = line.trim().strip_prefix('/') {
                if let Some((key, val)) = q.split_once('=') {
                    let val = val.trim_matches('"').to_string();
                    if let Some(last) = features.last_mut() {
                        if last.2.is_empty() && ["label", "gene", "product", "note"].contains(&key)
                        {
                            last.2 = val;
                        }
                    }
                }
            }
        }
    }
    let definition = definition.trim_end_matches('.').to_string();
    Some(Record {
        locus,
        length,
        molecule,
        topology,
        date,
        definition,
        features,
        text: text.to_string(),
    })
}

fn import_genbank(
    vault: &Vault,
    file: &Path,
    text: &str,
    opts: &Options,
    seen: &mut BTreeSet<String>,
) -> Res<Vec<Option<String>>> {
    let records = parse_genbank(text);
    if records.is_empty() {
        return Err(format!(
            "{}: no GenBank record (no LOCUS line)",
            file.display()
        ));
    }
    let fname = file
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    let mut out = Vec::new();
    for r in records {
        let key = format!("genbank:{}", r.locus);
        if !seen.insert(key.clone()) {
            out.push(None);
            continue;
        }
        if opts.dry_run {
            out.push(Some(format!(
                "material ({}) {}  from {fname}",
                opts.kind, r.locus
            )));
            continue;
        }
        let path = create(
            vault,
            "material",
            Some(&r.locus),
            None,
            None,
            Some(opts.kind),
            false,
            None,
            None,
            None,
        )?;
        let page = vault.read(&path)?;
        let id = page.id().unwrap_or_default().to_string();
        // the record itself, next to the page
        let sidecar = path
            .with_file_name(&id)
            .join(format!("{}.gb", slugify(&r.locus)));
        fs::create_dir_all(sidecar.parent().unwrap()).map_err(|e| e.to_string())?;
        fs::write(&sidecar, &r.text).map_err(|e| e.to_string())?;

        let mut desc = literal(&r.definition);
        let shape: Vec<&str> = [
            r.length.as_str(),
            "bp",
            r.topology.as_str(),
            r.molecule.as_str(),
        ]
        .into_iter()
        .filter(|s| !s.is_empty())
        .collect();
        if !r.length.is_empty() {
            if !desc.is_empty() {
                desc.push_str(". ");
            }
            desc.push_str(&shape.join(" "));
            desc.push('.');
        }
        let mut features = String::new();
        if !r.features.is_empty() {
            features.push_str("\n| feature | label | location |\n|---------|-------|----------|\n");
            for (kind, loc, label) in &r.features {
                features.push_str(&format!(
                    "| {} | {} | {} |\n",
                    literal(kind),
                    literal(label).replace('|', "\\|"),
                    literal(loc)
                ));
            }
        }
        let body = format!(
            "\n## Description\n{desc}\n\n## Sequence\nThe GenBank record is `{}`.\n{features}\n## Provenance\nImported from a Benchling GenBank export (`{}`, LOCUS {}, dated {}) on {} by `yajna import benchling`. Location, quantity and stock status are not part of the export; set them here.\n\n## Usage\n",
            rel(&sidecar, &vault.root),
            literal(&fname),
            literal(&r.locus),
            literal(&r.date),
            vault.today()
        );
        rewrite(
            &path,
            &[("source", "Benchling"), ("benchling", &key)],
            &body,
        )?;
        out.push(Some(format!(
            "{}  {} ({})",
            rel(&path, &vault.root),
            r.locus,
            opts.kind
        )));
    }
    Ok(out)
}

// --- notebook entries ---------------------------------------------------------------------

fn s<'a>(v: &'a Value, k: &str) -> &'a str {
    v.get(k).and_then(|x| x.as_str()).unwrap_or("")
}

/// One note part of an entry day as markdown.
fn note_md(n: &Value) -> String {
    let kind = s(n, "type");
    let text = literal(s(n, "text"));
    match kind {
        "text" => format!("{text}\n"),
        "code" => format!("```\n{}\n```\n", s(n, "text")),
        "list_bullet" => format!("- {text}\n"),
        "list_number" => format!("1. {text}\n"),
        "list_checkbox" => format!(
            "- [{}] {text}\n",
            if n.get("checked").and_then(|c| c.as_bool()).unwrap_or(false) {
                "x"
            } else {
                " "
            }
        ),
        "table" => {
            let t = n.get("table").unwrap_or(&Value::Null);
            let cols: Vec<String> = t
                .get("columnLabels")
                .and_then(|c| c.as_array())
                .map(|a| {
                    a.iter()
                        .map(|x| literal(x.as_str().unwrap_or("")))
                        .collect()
                })
                .unwrap_or_default();
            let rows: Vec<Vec<String>> = t
                .get("rows")
                .and_then(|r| r.as_array())
                .map(|rows| {
                    rows.iter()
                        .map(|row| {
                            row.get("cells")
                                .and_then(|c| c.as_array())
                                .map(|cells| {
                                    cells
                                        .iter()
                                        .map(|c| literal(s(c, "text")).replace('|', "\\|"))
                                        .collect()
                                })
                                .unwrap_or_default()
                        })
                        .collect()
                })
                .unwrap_or_default();
            let width = cols.len().max(rows.iter().map(Vec::len).max().unwrap_or(0));
            if width == 0 {
                return String::new();
            }
            let pad = |mut v: Vec<String>| {
                v.resize(width, String::new());
                format!("| {} |\n", v.join(" | "))
            };
            let header = if cols.is_empty() {
                vec![String::new(); width]
            } else {
                cols
            };
            let mut out = String::new();
            let name = literal(s(t, "name"));
            if !name.is_empty() {
                out.push_str(&format!("**{name}**\n\n"));
            }
            out.push_str(&pad(header));
            out.push_str(&format!("|{}\n", "---|".repeat(width)));
            for r in rows {
                out.push_str(&pad(r));
            }
            out
        }
        "" => String::new(),
        other => format!("*A Benchling `{other}` part is not imported.*\n"),
    }
}

fn import_entry(
    vault: &Vault,
    file: &Path,
    e: &Value,
    opts: &Options,
    seen: &mut BTreeSet<String>,
) -> Res<Option<String>> {
    let id = s(e, "id");
    let name = s(e, "name");
    if id.is_empty() || name.is_empty() {
        return Err(format!(
            "{}: not a Benchling entry (needs \"id\" and \"name\", as GET /entries/{{id}} returns)",
            file.display()
        ));
    }
    let key = format!("entry:{id}");
    if !seen.insert(key.clone()) {
        return Ok(None);
    }
    let Some(project) = opts.project else {
        return Err("notebook entries become experiments: pass --project PRJ-xxxx".to_string());
    };
    if opts.dry_run {
        return Ok(Some(format!(
            "experiment in {project}: {name}  ({})",
            s(e, "displayId")
        )));
    }
    let path = create(
        vault,
        "experiment",
        Some(name),
        Some(project),
        None,
        None,
        false,
        None,
        None,
        None,
    )?;
    let created = s(e, "createdAt").get(..10).unwrap_or("").to_string();
    let creator = e
        .get("creator")
        .map(|c| {
            let n = s(c, "name");
            if n.is_empty() {
                s(c, "handle").to_string()
            } else {
                n.to_string()
            }
        })
        .unwrap_or_default();
    let mut body = format!(
        "\n## Imported from Benchling\nEntry {} \"{}\", created {} by {}, last modified {}{}. Imported on {} by `yajna import benchling`; edit freely here, Benchling is not synced.\n",
        literal(s(e, "displayId")),
        literal(name),
        literal(s(e, "createdAt")),
        literal(&creator),
        literal(s(e, "modifiedAt")),
        match s(e, "webURL") {
            "" => String::new(),
            url => format!(", {url}"),
        },
        vault.today()
    );
    for day in e
        .get("days")
        .and_then(|d| d.as_array())
        .into_iter()
        .flatten()
    {
        body.push_str(&format!("\n## {}\n", literal(s(day, "date"))));
        let mut prev_list = false;
        for n in day
            .get("notes")
            .and_then(|n| n.as_array())
            .into_iter()
            .flatten()
        {
            let md = note_md(n);
            if md.is_empty() {
                continue;
            }
            let is_list = s(n, "type").starts_with("list_");
            if !(is_list && prev_list) {
                body.push('\n');
            }
            body.push_str(&md);
            prev_list = is_list;
        }
    }
    body.push_str("\n## Conclusion\nWritten once, by a human, when status becomes `concluded`.\n");
    let mut fields: Vec<(&str, &str)> = vec![("status", opts.status), ("benchling", &key)];
    if !created.is_empty() {
        fields.push(("created", &created));
    }
    rewrite(&path, &fields, &body)?;
    Ok(Some(format!("{}  {name}", rel(&path, &vault.root))))
}

/// Set frontmatter fields on a freshly created page and replace its body.
fn rewrite(path: &Path, fields: &[(&str, &str)], body: &str) -> Res<()> {
    let text = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |lines| {
        for (k, v) in fields {
            if *k == "created" {
                // a date stays a plain scalar, as the templates write it
                if let Some(l) = lines.iter_mut().find(|l| l.starts_with("created:")) {
                    *l = format!("created: {v}");
                }
            } else {
                set_field(lines, k, v);
            }
        }
    });
    let end = text[4..]
        .find("\n---\n")
        .map(|i| i + 4 + 5)
        .unwrap_or(text.len());
    fs::write(path, format!("{}{body}", &text[..end])).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn genbank_records() {
        let gb = "LOCUS       pUC19_mut        2686 bp    DNA     circular SYN 19-OCT-2026\nDEFINITION  pUC19 with a point\n            mutation.\nFEATURES             Location/Qualifiers\n     rep_origin      1..589\n                     /label=\"ori\"\n     CDS             complement(700..1560)\n                     /gene=\"bla\"\n                     /note=\"ampicillin\"\nORIGIN\n        1 tcgcgcgttt\n//\nLOCUS       second   10 bp DNA linear SYN 01-JAN-2026\n//\n";
        let r = parse_genbank(gb);
        assert_eq!(r.len(), 2);
        assert_eq!(r[0].locus, "pUC19_mut");
        assert_eq!(r[0].length, "2686");
        assert_eq!(r[0].topology, "circular");
        assert_eq!(r[0].definition, "pUC19 with a point mutation");
        assert_eq!(
            r[0].features[1],
            ("CDS".into(), "complement(700..1560)".into(), "bla".into())
        );
        assert!(r[0].text.ends_with("//\n") && !r[0].text.contains("second"));
        assert_eq!(r[1].topology, "linear");
    }

    #[test]
    fn notes_to_markdown() {
        let t: Value = serde_json::json!({"type": "table", "table": {"name": "Plate", "columnLabels": ["well", "OD"], "rows": [{"cells": [{"text": "A1"}, {"text": "0.4"}]}]}});
        assert_eq!(
            note_md(&t),
            "**Plate**\n\n| well | OD |\n|---|---|\n| A1 | 0.4 |\n"
        );
        let c: Value =
            serde_json::json!({"type": "list_checkbox", "checked": true, "text": "spun @4C [[x]]"});
        assert_eq!(note_md(&c), "- [x] spun &#64;4C &#91;&#91;x]]\n");
        let r: Value = serde_json::json!({"type": "results_table"});
        assert!(note_md(&r).contains("not imported"));
    }
}
