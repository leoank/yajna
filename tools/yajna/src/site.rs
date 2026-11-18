//! The static site (architecture 6.5), rendered from the index only: a page per entity,
//! a project page with the experiment tree, the log, and reading notes.

use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

use pulldown_cmark::{html, Event, Options, Parser};
use serde_json::Value;

use crate::index::{Entity, Index, LogEntry};
use crate::query;
use crate::vault::{Res, Vault, LINK_RE, NS_ID_RE};

pub(crate) const CSS: &str = r#"
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
svg text{font:11px system-ui,sans-serif;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
td:first-child a{white-space:nowrap}
.tree{overflow-x:auto;max-width:100%}.tree svg{display:block}
"#;

pub(crate) fn esc(s: &str) -> String {
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
    crate::vault::map_outside_code(md, |prose| linkify_prose(ix, prose))
}

fn linkify_prose(ix: &Index, md: &str) -> String {
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

/// Markdown for the files viewer (ADR-0029): the site's links and citations when the index
/// is at hand, and raw HTML shown as text, because a file a run wrote must not run as
/// part of the viewer. Links to pages stay relative (`ID.html`); the viewer points them
/// at the site.
pub(crate) fn markdown_for_viewer(ix: Option<&Index>, md: &str) -> String {
    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_TASKLISTS);
    opts.insert(Options::ENABLE_STRIKETHROUGH);
    let text = match ix {
        Some(ix) => linkify(ix, md),
        None => md.to_string(),
    };
    let parser = Parser::new_ext(&text, opts).map(|ev| match ev {
        Event::Html(h) | Event::InlineHtml(h) => Event::Text(h),
        ev => ev,
    });
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
/// Where the files viewer shows a path, when the site is served by `yajna serve`
/// (ADR-0028): the roots by name and directory. Empty for a static export.
#[derive(Default)]
pub(crate) struct FileLinks {
    pub repo: PathBuf,
    pub roots: Vec<(String, PathBuf)>,
}

impl FileLinks {
    /// `files/#<root>/<rest>` for a path in a page's frontmatter (relative to the repo, or
    /// absolute) that lies under a root.
    pub(crate) fn href(&self, value: &str) -> Option<String> {
        let path = Path::new(value.trim_end_matches('/'));
        let abs = if path.is_absolute() {
            path.to_path_buf()
        } else {
            self.repo.join(path)
        };
        let abs: PathBuf = abs.components().collect();
        self.roots.iter().find_map(|(name, root)| {
            let rest = abs.strip_prefix(root).ok()?;
            let rest = rest.to_string_lossy();
            Some(if rest.is_empty() {
                format!("files/#{name}")
            } else {
                format!("files/#{name}/{rest}")
            })
        })
    }
}

fn meta_table(ix: &Index, e: &Entity, files: &FileLinks) -> String {
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
            if let (true, Value::String(s)) = (["script", "code", "path"].contains(&k.as_str()), v)
            {
                if let Some(link) = files.href(s) {
                    rows.push_str(&format!(
                        "<tr><td>{}</td><td><a href=\"{}\">{}</a></td></tr>\n",
                        esc(k),
                        esc(&link),
                        esc(s)
                    ));
                    continue;
                }
            }
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

/// A node's label: a date ID on two lines (`EXP-20261016` over `rq1407`), so neighbouring
/// labels fit between nodes; a counter ID on one.
fn node_label(id: &str, x: f64) -> String {
    match id.rsplit_once('-') {
        Some((head, tail)) if head.contains('-') => format!(
            "<tspan x=\"{x}\">{}</tspan><tspan x=\"{x}\" dy=\"12\">{}</tspan>",
            esc(head),
            esc(tail)
        ),
        _ => esc(id),
    }
}

/// The AutoGo-style experiment tree: themes as rows, experiments in creation order,
/// outcome as colour, a solid line along each theme and dotted lines for `influenced_by`.
fn tree_svg(ix: &Index, project: &str) -> String {
    let themes = query::tree(ix, project);
    if themes.is_empty() {
        return String::new();
    }
    let (x0, dx, dy, r) = (140.0, 120.0, 60.0, 9.0);
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
                node_label(&e.id, x)
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

/// A project's experiments with the one-line description the project page gives each.
fn experiments_table(ix: &Index, project: &str) -> String {
    let exps = ix.entities(
        "WHERE type = 'experiment' AND project = ?1",
        &[&project.to_string()],
    );
    if exps.is_empty() {
        return String::new();
    }
    let mut out = String::from(
        "<h2>Experiments</h2><table><tr><th>id</th><th>status</th><th>title</th><th>in short</th></tr>\n",
    );
    for e in exps {
        out.push_str(&format!(
            "<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>\n",
            link_to(ix, &e.id),
            status_span(&e),
            esc(&e.title),
            esc(&ix.note(project, &e.id).unwrap_or_default())
        ));
    }
    out.push_str("</table>");
    out
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
    let mut out = String::from(
        "<h2>Runs</h2><table><tr><th>run</th><th>status</th><th>finished</th><th>in short</th>",
    );
    for c in &columns {
        out.push_str(&format!("<th>{}</th>", esc(c)));
    }
    out.push_str("</tr>\n");
    let mut seen = Vec::new();
    for run in &runs {
        seen.push(run.id.clone());
        let row = rows.iter().find(|r| r.run == run.id);
        out.push_str(&format!(
            "<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td>",
            link_to(ix, &run.id),
            esc(&run.status.clone().unwrap_or_default()),
            esc(run
                .meta
                .get("finished")
                .and_then(|v| v.as_str())
                .unwrap_or("")),
            esc(&ix.note(experiment, &run.id).unwrap_or_default())
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
            "<tr><td>{}</td><td></td><td>{}</td><td></td>",
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

fn entity_page(ix: &Index, e: &Entity, files: &FileLinks) -> String {
    let mut body = format!(
        "<h1>{} <small>{} {}</small></h1>\n{}\n",
        esc(&e.title),
        esc(&e.etype),
        status_span(e),
        meta_table(ix, e, files)
    );
    if e.etype == "project" {
        let svg = tree_svg(ix, &e.id);
        if !svg.is_empty() {
            body.push_str(&format!(
                "<h2>Experiment tree</h2>\n<div class=\"tree\">{svg}</div>\n"
            ));
        }
        body.push_str(&experiments_table(ix, &e.id));
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
        ("doc", "Docs"),
        ("review", "Reviews"),
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
/// Write every page; returns the page count. With roots in `files`, the site is being
/// served: the nav links the files viewer and paths in frontmatter link into it.
pub fn render(vault: &Vault, out: &Path, files: &FileLinks) -> Res<usize> {
    let ix = Index::open(vault, false)?;
    fs::create_dir_all(out).map_err(|e| format!("{}: {e}", out.display()))?;
    let mut n = 0;
    let served = !files.roots.is_empty();
    let mut put = |name: String, text: String| -> Res<()> {
        let text = if served {
            text.replacen(
                "<a href=\"tasks.html\">tasks</a>",
                "<a href=\"tasks.html\">tasks</a><a href=\"files/\">files</a>",
                1,
            )
        } else {
            text
        };
        fs::write(out.join(&name), text).map_err(|e| format!("{name}: {e}"))?;
        n += 1;
        Ok(())
    };
    put("index.html".into(), index_page(&ix))?;
    put("log.html".into(), log_page(&ix))?;
    put("tasks.html".into(), tasks_page(&ix))?;
    for e in ix.entities("", &[]) {
        put(href(&e.id), entity_page(&ix, &e, files))?;
    }
    Ok(n)
}

pub fn cmd_site(vault: &Vault, out: Option<&Path>) -> Res<i32> {
    let out = out
        .map(Path::to_path_buf)
        .unwrap_or_else(|| site_dir(vault));
    let n = render(vault, &out, &FileLinks::default())?;
    println!("{}: {n} page(s)", out.display());
    Ok(0)
}

/// The newest change under the vault, the bibliography and the config: what a render is
/// current with.
pub(crate) fn vault_mtime(vault: &Vault) -> SystemTime {
    let mut t = SystemTime::UNIX_EPOCH;
    crate::index::newest(&vault.notes, &mut t);
    for p in [
        crate::refs::bib_path(vault),
        vault.root.join(crate::vault::CONFIG_NAME),
    ] {
        if let Ok(m) = p.metadata().and_then(|m| m.modified()) {
            t = t.max(m);
        }
    }
    t
}

// --- the JSON API of pages for the web app (ADR-0041) ---------------------------------

/// What the web app is told about a page wherever it is listed.
fn summary(e: &Entity) -> Value {
    serde_json::json!({
        "id": e.id,
        "type": e.etype,
        "title": e.title,
        "status": e.status,
        "outcome": e.outcome,
        "kind": e.kind,
        "project": e.project,
        "experiment": e.experiment,
        "created": e.created,
        "author": e.author,
        "tags": e.tags,
    })
}

/// A line of markdown rendered for the app, the outer paragraph dropped.
fn inline(ix: &Index, text: &str) -> String {
    markdown_for_viewer(Some(ix), text).trim().trim_start_matches("<p>").trim_end_matches("</p>").to_string()
}

fn log_json(ix: &Index, entries: &[LogEntry]) -> Value {
    entries
        .iter()
        .map(|m| serde_json::json!({ "date": m.date, "time": m.time, "author": m.author, "html": inline(ix, &m.text), "path": m.path, "line": m.line }))
        .collect()
}

/// Ticked and all checkboxes of a page's body: a phase's progress.
fn checkboxes(body: &str) -> (usize, usize) {
    let mut done = 0;
    let mut all = 0;
    for l in body.lines() {
        let t = l.trim_start();
        if t.starts_with("- [x]") || t.starts_with("- [X]") {
            done += 1;
            all += 1;
        } else if t.starts_with("- [ ]") {
            all += 1;
        }
    }
    (done, all)
}

/// The notebook's pages as `yajna serve` gives them to the web app.
pub(crate) struct ServedPages {
    root: PathBuf,
    links: std::sync::Arc<FileLinks>,
}

impl ServedPages {
    pub(crate) fn new(root: PathBuf, links: std::sync::Arc<FileLinks>) -> Self {
        ServedPages { root, links }
    }

    fn index(&self) -> Result<(Vault, Index), String> {
        let vault = Vault::open(self.root.clone())?;
        let ix = Index::open(&vault, false)?;
        Ok((vault, ix))
    }
}

/// The page types the overview counts, in the order the app lists them.
const COLLECTIONS: [(&str, &str); 12] = [
    ("project", "Projects"),
    ("experiment", "Experiments"),
    ("run", "Runs"),
    ("protocol", "Protocols"),
    ("material", "Materials"),
    ("equipment", "Equipment"),
    ("build", "Builds"),
    ("analysis", "Analyses"),
    ("artifact", "Artifacts"),
    ("doc", "Docs"),
    ("review", "Reviews"),
    ("agent_session", "Agent sessions"),
];

impl yajna_serve::pages::Pages for ServedPages {
    fn overview(&self) -> Result<Value, String> {
        let (vault, ix) = self.index()?;
        let projects: Vec<Value> = ix
            .entities("WHERE type = 'project'", &[])
            .iter()
            .map(|p| {
                let count = |t: &str| ix.entities("WHERE type = ?1 AND project = ?2", &[&t.to_string(), &p.id]).len();
                let phases = ix.entities("WHERE type = 'phase' AND project = ?1", &[&p.id]);
                let done = phases.iter().filter(|ph| ph.status.as_deref() == Some("done")).count();
                let active = phases.iter().find(|ph| ph.status.as_deref() == Some("active")).map(summary);
                let mut v = summary(p);
                v["experiments"] = count("experiment").into();
                v["runs"] = count("run").into();
                v["phases"] = serde_json::json!({ "done": done, "total": phases.len(), "active": active });
                v
            })
            .collect();
        let collections: Vec<Value> = COLLECTIONS
            .iter()
            .map(|(t, label)| serde_json::json!({ "type": t, "label": label, "count": ix.entities("WHERE type = ?1", &[&t.to_string()]).len() }))
            .filter(|c| c["count"].as_u64().unwrap_or(0) > 0)
            .collect();
        let mut log = ix.log();
        log.reverse();
        log.truncate(12);
        Ok(serde_json::json!({
            "namespace": vault.namespace().ok(),
            "shape": vault.shape(),
            "projects": projects,
            "collections": collections,
            "recent": log_json(&ix, &log),
            "tasks_open": ix.tasks(false).len(),
        }))
    }

    fn list(&self, kind: Option<&str>, project: Option<&str>) -> Result<Value, String> {
        let (_, ix) = self.index()?;
        let mut sql = String::from("WHERE 1=1");
        let mut args: Vec<String> = Vec::new();
        if let Some(k) = kind {
            args.push(k.to_string());
            sql.push_str(&format!(" AND type = ?{}", args.len()));
        }
        if let Some(p) = project {
            args.push(p.to_string());
            sql.push_str(&format!(" AND project = ?{}", args.len()));
        }
        let params: Vec<&dyn rusqlite::ToSql> = args.iter().map(|a| a as &dyn rusqlite::ToSql).collect();
        // newest first; `entities` orders by creation itself
        let mut found = ix.entities(&sql, &params);
        found.reverse();
        Ok(found
            .iter()
            .map(|e| {
                let mut v = summary(e);
                // the one line the parent gives it: a project for an experiment, an
                // experiment for a run
                let parent = e.experiment.as_ref().or(e.project.as_ref());
                if let Some(note) = parent.and_then(|p| ix.note(p, &e.id)) {
                    v["note"] = note.into();
                }
                v
            })
            .collect())
    }

    fn page(&self, id: &str) -> Result<Option<Value>, String> {
        let (_, ix) = self.index()?;
        let Some(e) = ix.entity(id) else { return Ok(None) };
        let mut v = summary(&e);
        v["path"] = e.path.clone().into();
        v["html"] = markdown_for_viewer(Some(&ix), &e.body).into();
        // the frontmatter beyond the summary, each value with the IDs in it that are pages
        // and, for a path, where the files view shows it
        let mut fields = Vec::new();
        if let Some(obj) = e.meta.as_object() {
            for (k, val) in obj {
                if ["id", "type", "title", "schema_version"].contains(&k.as_str()) {
                    continue;
                }
                let shown = match val {
                    Value::Null => continue,
                    Value::Array(a) if a.is_empty() => continue,
                    Value::String(s) => s.clone(),
                    Value::Array(a) => a.iter().map(|x| x.as_str().map(str::to_string).unwrap_or_else(|| x.to_string())).collect::<Vec<_>>().join(", "),
                    other => other.to_string(),
                };
                let ids: Vec<String> = NS_ID_RE
                    .captures_iter(&shown)
                    .filter(|c| c.get(1).is_none() && ix.entity(&c[2]).is_some())
                    .map(|c| c[2].to_string())
                    .collect();
                let file = match val {
                    Value::String(s) if ["script", "code", "path", "source"].contains(&k.as_str()) => {
                        self.links.href(s).map(|h| h.trim_start_matches("files/#").to_string())
                    }
                    _ => None,
                };
                fields.push(serde_json::json!({ "key": k, "value": shown, "ids": ids, "file": file }));
            }
        }
        v["fields"] = fields.into();
        let note = |parent: &str, e: &Entity| {
            let mut s = summary(e);
            if let Some(n) = ix.note(parent, &e.id) {
                s["note"] = n.into();
            }
            s
        };
        match e.etype.as_str() {
            "project" => {
                let phases: Vec<Value> = ix
                    .entities("WHERE type = 'phase' AND project = ?1", &[&e.id])
                    .iter()
                    .map(|ph| {
                        let (done, all) = checkboxes(&ph.body);
                        let mut s = summary(ph);
                        s["items"] = serde_json::json!({ "done": done, "total": all });
                        s
                    })
                    .collect();
                let exps: Vec<Value> = ix
                    .entities("WHERE type = 'experiment' AND project = ?1", &[&e.id])
                    .iter()
                    .map(|x| note(&e.id, x))
                    .collect();
                v["phases"] = phases.into();
                v["experiments"] = exps.into();
                let svg = tree_svg(&ix, &e.id);
                if !svg.is_empty() {
                    v["tree"] = svg.into();
                }
            }
            "phase" => {
                let (done, all) = checkboxes(&e.body);
                v["items"] = serde_json::json!({ "done": done, "total": all });
            }
            "experiment" => {
                let results = ix.results(&e.id);
                let mut columns: Vec<String> = Vec::new();
                for r in &results {
                    for (k, _, _) in &r.metrics {
                        if !columns.contains(k) {
                            columns.push(k.clone());
                        }
                    }
                }
                let runs: Vec<Value> = ix
                    .entities("WHERE type = 'run' AND experiment = ?1", &[&e.id])
                    .iter()
                    .map(|r| {
                        let mut s = note(&e.id, r);
                        s["finished"] = r.meta.get("finished").cloned().unwrap_or(Value::Null);
                        let metrics: serde_json::Map<String, Value> = results
                            .iter()
                            .find(|x| x.run == r.id)
                            .map(|x| x.metrics.iter().map(|(k, v, _)| (k.clone(), Value::String(v.clone()))).collect())
                            .unwrap_or_default();
                        s["metrics"] = metrics.into();
                        s
                    })
                    .collect();
                v["runs"] = serde_json::json!({ "columns": columns, "rows": runs });
            }
            _ => {}
        }
        let mut seen = Vec::new();
        let back: Vec<Value> = ix
            .backlinks(&e.id)
            .into_iter()
            .filter(|(src, _)| {
                let fresh = !seen.contains(src);
                seen.push(src.clone());
                fresh
            })
            .filter_map(|(src, ctx)| ix.entity(&src).map(|s| {
                let mut v = summary(&s);
                v["context"] = ctx.into();
                v
            }))
            .collect();
        v["backlinks"] = back.into();
        v["log"] = log_json(&ix, &ix.mentions(&e.id));
        Ok(Some(v))
    }

    fn log(&self, skip: usize, limit: usize) -> Result<Value, String> {
        let (_, ix) = self.index()?;
        let mut all = ix.log();
        all.reverse();
        let total = all.len();
        let page: Vec<LogEntry> = all.into_iter().skip(skip).take(limit).collect();
        Ok(serde_json::json!({ "total": total, "entries": log_json(&ix, &page) }))
    }

    fn tasks(&self, done: bool) -> Result<Value, String> {
        let (_, ix) = self.index()?;
        Ok(ix
            .tasks(done)
            .iter()
            .map(|t| {
                let page = t.id.as_ref().and_then(|id| ix.entity(id)).map(|e| summary(&e));
                serde_json::json!({ "done": t.done, "page": page, "path": t.path, "line": t.line, "section": t.section, "html": inline(&ix, &t.text) })
            })
            .collect())
    }
}
