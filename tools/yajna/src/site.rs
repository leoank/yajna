//! The static site (architecture 6.5), rendered from the index only: a page per entity,
//! a project page with the experiment tree, the log, and reading notes.

use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

use pulldown_cmark::{html, Options, Parser};
use serde_json::Value;

use crate::index::{Entity, Index, LogEntry};
use crate::query;
use crate::vault::{Res, Vault, LINK_RE, NS_ID_RE};

const CSS: &str = r#"
body{font:15px/1.5 system-ui,sans-serif;max-width:60rem;margin:2rem auto;padding:0 1rem;color:#222}
a{color:#1a5fb4;text-decoration:none}a:hover{text-decoration:underline}
nav{font-size:.9em;color:#666;margin-bottom:1.5rem}nav a{margin-right:1rem}
h1{font-size:1.5rem;margin:.2rem 0}h1 small{font-weight:normal;color:#666;font-size:.7em;margin-left:.5rem}
table{border-collapse:collapse;margin:.5rem 0 1rem}td,th{border:1px solid #ddd;padding:.2rem .6rem;text-align:left;vertical-align:top}
th{background:#f4f4f4}code,pre{font-family:ui-monospace,monospace;font-size:.9em}pre{background:#f6f6f6;padding:.6rem;overflow:auto}
.meta{font-size:.9em}.meta td:first-child{color:#666;white-space:nowrap}
.status{display:inline-block;padding:0 .4em;border-radius:3px;background:#eee;font-size:.85em}
.positive{background:#cfe8cf}.negative{background:#f3c9c9}.inconclusive{background:#f7e3b0}.infra{background:#ddd}
.tl td:first-child{white-space:nowrap;color:#666}
svg text{font:12px system-ui,sans-serif}
"#;

fn esc(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

/// `ID.html`, `@key` -> `ref-key.html`.
fn href(id: &str) -> String {
    match id.strip_prefix('@') {
        Some(key) => format!("ref-{key}.html"),
        None => format!("{id}.html"),
    }
}

/// `[[ID]]`, `[[ID@3|label]]`, `[[ns/ID]]` and `@citekey` in markdown become links.
fn linkify(ix: &Index, md: &str) -> String {
    let out = LINK_RE.replace_all(md, |c: &regex::Captures| {
        let inner = c[0].trim_start_matches("[[").trim_end_matches("]]");
        let (target, label) = match inner.split_once('|') {
            Some((t, l)) => (t.trim(), Some(l.trim())),
            None => (inner.trim(), None),
        };
        let (id_part, version) = match target.split_once('@') {
            Some((t, v)) => (t, Some(v)),
            None => (target, None),
        };
        let Some(m) = NS_ID_RE.captures(id_part) else {
            return c[0].to_string();
        };
        let text = label.map(str::to_string).unwrap_or_else(|| {
            format!(
                "{target}{}",
                version.map(|v| format!("@{v}")).unwrap_or_default()
            )
        });
        if m.get(1).is_some() {
            // another repo: no page here, keep it readable
            return format!("`{text}`");
        }
        let id = &m[2];
        if ix.entity(id).is_some() {
            format!("[{text}]({})", href(id))
        } else {
            format!("`{text}`")
        }
    });
    let cite = regex::Regex::new(r"(^|[^\w/.`])-?@([A-Za-z][A-Za-z0-9:_-]*[A-Za-z0-9])").unwrap();
    cite.replace_all(&out, |c: &regex::Captures| {
        let key = &c[2];
        if ix.entity(&format!("@{key}")).is_some() {
            format!("{}[@{key}](ref-{key}.html)", &c[1])
        } else {
            c[0].to_string()
        }
    })
    .into_owned()
}

fn markdown(ix: &Index, md: &str) -> String {
    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_TASKLISTS);
    opts.insert(Options::ENABLE_STRIKETHROUGH);
    let text = linkify(ix, md);
    let parser = Parser::new_ext(&text, opts);
    let mut out = String::new();
    html::push_html(&mut out, parser);
    out
}

fn page(title: &str, nav: &str, body: &str) -> String {
    format!(
        "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>{}</title><style>{CSS}</style></head>\n<body><nav><a href=\"index.html\">home</a><a href=\"log.html\">log</a><a href=\"tasks.html\">tasks</a>{nav}</nav>\n{body}\n</body></html>\n",
        esc(title)
    )
}

fn status_span(e: &Entity) -> String {
    let mut s = e.status.clone().unwrap_or_default();
    let class = e.outcome.clone().unwrap_or_default();
    if !class.is_empty() {
        s = format!("{s} / {class}");
    }
    if s.is_empty() {
        return String::new();
    }
    format!("<span class=\"status {class}\">{}</span>", esc(&s))
}

fn link_to(ix: &Index, id: &str) -> String {
    match ix.entity(id) {
        Some(e) => format!(
            "<a href=\"{}\" title=\"{}\">{}</a>",
            href(id),
            esc(&e.title),
            esc(id)
        ),
        None => format!("<code>{}</code>", esc(id)),
    }
}

/// Frontmatter as a table; IDs inside values become links.
fn meta_table(ix: &Index, e: &Entity) -> String {
    let mut rows = String::new();
    if let Some(obj) = e.meta.as_object() {
        for (k, v) in obj {
            if ["id", "type", "title", "schema_version"].contains(&k.as_str()) {
                continue;
            }
            let shown = match v {
                Value::Null => continue,
                Value::Array(a) if a.is_empty() => continue,
                Value::String(s) => s.clone(),
                Value::Array(a) => a
                    .iter()
                    .map(|x| match x {
                        Value::String(s) => s.clone(),
                        o => o.to_string(),
                    })
                    .collect::<Vec<_>>()
                    .join(", "),
                other => other.to_string(),
            };
            let shown = NS_ID_RE
                .replace_all(&esc(&shown), |c: &regex::Captures| {
                    if c.get(1).is_some() {
                        c[0].to_string()
                    } else {
                        link_to(ix, &c[2])
                    }
                })
                .into_owned();
            rows.push_str(&format!("<tr><td>{}</td><td>{shown}</td></tr>\n", esc(k)));
        }
    }
    format!("<table class=\"meta\">{rows}</table>")
}

fn log_rows(ix: &Index, entries: &[LogEntry]) -> String {
    let mut out = String::from("<table class=\"tl\">");
    for m in entries {
        out.push_str(&format!(
            "<tr><td title=\"{}:{}\">{} {}</td><td>{}</td><td>{}</td></tr>\n",
            esc(&m.path),
            m.line,
            esc(&m.date),
            esc(&m.time),
            esc(&m.author),
            markdown(ix, &m.text)
                .trim()
                .trim_start_matches("<p>")
                .trim_end_matches("</p>")
        ));
    }
    out.push_str("</table>");
    out
}

/// The AutoGo-style experiment tree: themes as rows, experiments in creation order,
/// outcome as colour, a solid line along each theme and dotted lines for `influenced_by`.
fn tree_svg(ix: &Index, project: &str) -> String {
    let themes = query::tree(ix, project);
    if themes.is_empty() {
        return String::new();
    }
    let (x0, dx, dy, r) = (140.0, 110.0, 56.0, 9.0);
    let mut pos: BTreeMap<String, (f64, f64)> = BTreeMap::new();
    let mut nodes = String::new();
    let mut lines = String::new();
    let mut widest = 0usize;
    for (row, (theme, exps)) in themes.iter().enumerate() {
        let y = 30.0 + row as f64 * dy;
        nodes.push_str(&format!(
            "<text x=\"8\" y=\"{}\" fill=\"#555\">{}</text>\n",
            y + 4.0,
            esc(if theme.is_empty() {
                "(no theme)"
            } else {
                theme
            })
        ));
        for (col, e) in exps.iter().enumerate() {
            let x = x0 + col as f64 * dx;
            pos.insert(e.id.clone(), (x, y));
            if col > 0 {
                lines.push_str(&format!(
                    "<line x1=\"{}\" y1=\"{y}\" x2=\"{}\" y2=\"{y}\" stroke=\"#999\" stroke-width=\"2\"/>\n",
                    x - dx + r,
                    x - r
                ));
            }
            let fill = match e.outcome.as_deref() {
                Some("positive") => "#4caf50",
                Some("negative") => "#e05252",
                Some("inconclusive") => "#f0b429",
                Some("infra") => "#9e9e9e",
                _ => "#fff",
            };
            nodes.push_str(&format!(
                "<a href=\"{}\"><circle cx=\"{x}\" cy=\"{y}\" r=\"{r}\" fill=\"{fill}\" stroke=\"#333\" stroke-width=\"1.5\"><title>{}: {} ({})</title></circle><text x=\"{x}\" y=\"{}\" text-anchor=\"middle\">{}</text></a>\n",
                href(&e.id),
                esc(&e.id),
                esc(&e.title),
                esc(&e.status.clone().unwrap_or_default()),
                y + r + 14.0,
                esc(&e.id)
            ));
        }
        widest = widest.max(exps.len());
    }
    for exps in themes.values() {
        for e in exps {
            for (dst, _, ctx) in ix.links(&e.id) {
                if ctx != "influenced_by" {
                    continue;
                }
                if let (Some((x1, y1)), Some((x2, y2))) = (pos.get(&dst), pos.get(&e.id)) {
                    lines.push_str(&format!(
                        "<line x1=\"{x1}\" y1=\"{y1}\" x2=\"{x2}\" y2=\"{y2}\" stroke=\"#1a5fb4\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n"
                    ));
                }
            }
        }
    }
    let width = x0 + widest as f64 * dx;
    let height = 30.0 + themes.len() as f64 * dy;
    format!(
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" viewBox=\"0 0 {width} {height}\">\n{lines}{nodes}</svg>"
    )
}

fn runs_table(ix: &Index, experiment: &str) -> String {
    let rows = ix.results(experiment);
    let runs = ix.entities(
        "WHERE type = 'run' AND experiment = ?1",
        &[&experiment.to_string()],
    );
    if rows.is_empty() && runs.is_empty() {
        return String::new();
    }
    let mut columns: Vec<String> = Vec::new();
    for r in &rows {
        for (k, _, _) in &r.metrics {
            if !columns.contains(k) {
                columns.push(k.clone());
            }
        }
    }
    let mut out =
        String::from("<h2>Runs</h2><table><tr><th>run</th><th>status</th><th>finished</th>");
    for c in &columns {
        out.push_str(&format!("<th>{}</th>", esc(c)));
    }
    out.push_str("</tr>\n");
    let mut seen = Vec::new();
    for run in &runs {
        seen.push(run.id.clone());
        let row = rows.iter().find(|r| r.run == run.id);
        out.push_str(&format!(
            "<tr><td>{}</td><td>{}</td><td>{}</td>",
            link_to(ix, &run.id),
            esc(&run.status.clone().unwrap_or_default()),
            esc(run
                .meta
                .get("finished")
                .and_then(|v| v.as_str())
                .unwrap_or(""))
        ));
        for c in &columns {
            let v = row
                .and_then(|r| r.metrics.iter().find(|(k, _, _)| k == c))
                .map(|(_, v, _)| v.clone())
                .unwrap_or_default();
            out.push_str(&format!("<td>{}</td>", esc(&v)));
        }
        out.push_str("</tr>\n");
    }
    for r in rows.iter().filter(|r| !seen.contains(&r.run)) {
        out.push_str(&format!(
            "<tr><td>{}</td><td></td><td>{}</td>",
            esc(&r.run),
            esc(&r.finished)
        ));
        for c in &columns {
            let v = r
                .metrics
                .iter()
                .find(|(k, _, _)| k == c)
                .map(|(_, v, _)| v.clone())
                .unwrap_or_default();
            out.push_str(&format!("<td>{}</td>", esc(&v)));
        }
        out.push_str("</tr>\n");
    }
    out.push_str("</table>");
    out
}

fn entity_page(ix: &Index, e: &Entity) -> String {
    let mut body = format!(
        "<h1>{} <small>{} {}</small></h1>\n{}\n",
        esc(&e.title),
        esc(&e.etype),
        status_span(e),
        meta_table(ix, e)
    );
    if e.etype == "project" {
        let svg = tree_svg(ix, &e.id);
        if !svg.is_empty() {
            body.push_str(&format!("<h2>Experiment tree</h2>\n{svg}\n"));
        }
    }
    body.push_str(&markdown(ix, &e.body));
    if e.etype == "experiment" {
        body.push_str(&runs_table(ix, &e.id));
    }
    let back = ix.backlinks(&e.id);
    if !back.is_empty() {
        body.push_str("<h2>Linked from</h2><ul>");
        let mut seen = Vec::new();
        for (src, ctx) in back {
            if seen.contains(&src) {
                continue;
            }
            seen.push(src.clone());
            let title = ix.entity(&src).map(|s| s.title).unwrap_or_default();
            body.push_str(&format!(
                "<li>{} {} <span class=\"status\">{}</span></li>",
                link_to(ix, &src),
                esc(&title),
                esc(&ctx)
            ));
        }
        body.push_str("</ul>");
    }
    let mentions = ix.mentions(&e.id);
    if !mentions.is_empty() {
        body.push_str("<h2>Log</h2>");
        body.push_str(&log_rows(ix, &mentions));
    }
    let nav = match &e.project {
        Some(p) if p != &e.id => format!("<a href=\"{}\">{}</a>", href(p), esc(p)),
        _ => String::new(),
    };
    page(&format!("{} {}", e.id, e.title), &nav, &body)
}

fn index_page(ix: &Index) -> String {
    let mut body = String::from("<h1>Notebook</h1>\n<h2>Projects</h2><table><tr><th>id</th><th>title</th><th>status</th><th>experiments</th></tr>");
    for p in ix.entities("WHERE type = 'project'", &[]) {
        let n = ix
            .entities("WHERE type = 'experiment' AND project = ?1", &[&p.id])
            .len();
        body.push_str(&format!(
            "<tr><td>{}</td><td>{}</td><td>{}</td><td>{n}</td></tr>\n",
            link_to(ix, &p.id),
            esc(&p.title),
            status_span(&p)
        ));
    }
    body.push_str("</table>");
    for (etype, heading) in [
        ("protocol", "Protocols"),
        ("material", "Materials"),
        ("equipment", "Equipment"),
        ("build", "Builds"),
        ("analysis", "Analyses"),
        ("artifact", "Artifacts"),
        ("agent_session", "Agent sessions"),
        ("reference", "Reading notes"),
    ] {
        let items = ix.entities("WHERE type = ?1", &[&etype.to_string()]);
        if items.is_empty() {
            continue;
        }
        body.push_str(&format!("<h2>{heading}</h2><ul>"));
        for e in items {
            body.push_str(&format!(
                "<li>{} {} {}</li>",
                link_to(ix, &e.id),
                esc(&e.title),
                status_span(&e)
            ));
        }
        body.push_str("</ul>");
    }
    page("Notebook", "", &body)
}

fn log_page(ix: &Index) -> String {
    let mut entries = ix.log();
    entries.reverse();
    page(
        "Log",
        "",
        &format!("<h1>Log</h1>\n{}", log_rows(ix, &entries)),
    )
}

fn tasks_page(ix: &Index) -> String {
    let mut body = String::from("<h1>Tasks</h1><table>");
    for t in ix.tasks(true) {
        let where_ = match &t.id {
            Some(id) => link_to(ix, id),
            None => esc(&t.path),
        };
        body.push_str(&format!(
            "<tr><td>{}</td><td title=\"{}:{}\">{where_}</td><td>{}</td><td>{}</td></tr>\n",
            if t.done { "&#x2611;" } else { "&#x2610;" },
            esc(&t.path),
            t.line,
            esc(t.section.as_deref().unwrap_or("")),
            markdown(ix, &t.text)
                .trim()
                .trim_start_matches("<p>")
                .trim_end_matches("</p>")
        ));
    }
    body.push_str("</table>");
    page("Tasks", "", &body)
}

pub fn site_dir(vault: &Vault) -> PathBuf {
    crate::index::index_path(vault).with_extension("site")
}

/// Write every page; returns the output directory and the page count.
pub fn render(vault: &Vault, out: &Path) -> Res<usize> {
    let ix = Index::open(vault, false)?;
    fs::create_dir_all(out).map_err(|e| format!("{}: {e}", out.display()))?;
    let mut n = 0;
    let mut put = |name: String, text: String| -> Res<()> {
        fs::write(out.join(&name), text).map_err(|e| format!("{name}: {e}"))?;
        n += 1;
        Ok(())
    };
    put("index.html".into(), index_page(&ix))?;
    put("log.html".into(), log_page(&ix))?;
    put("tasks.html".into(), tasks_page(&ix))?;
    for e in ix.entities("", &[]) {
        put(href(&e.id), entity_page(&ix, &e))?;
    }
    Ok(n)
}

pub fn cmd_site(vault: &Vault, out: Option<&Path>) -> Res<i32> {
    let out = out
        .map(Path::to_path_buf)
        .unwrap_or_else(|| site_dir(vault));
    let n = render(vault, &out)?;
    println!("{}: {n} page(s)", out.display());
    Ok(0)
}
