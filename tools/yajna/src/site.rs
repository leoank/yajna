//! The static site (architecture 6.5), rendered from the index only: a page per entity,
//! a project page with the experiment tree, the log, and reading notes.

use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

use pulldown_cmark::{html, CowStr, Event, Options, Parser, Tag};
use serde_json::Value;

use crate::index::{Entity, Index, LogEntry};
use crate::query;
use crate::vault::{Res, Vault, LINK_RE, NS_ID_RE};

/// The app's look (ADR-0041): its colour tokens, light and dark from the system, its type,
/// cards, chips and tables, so a published notebook reads like the one served.
pub(crate) const CSS: &str = r#"
:root{--bg:#f7f7f8;--surface:#fff;--surface-2:#f1f1f3;--hover:#ececef;--line:#e4e4e8;--line-strong:#d3d3da;--text:#1d1d22;--text-2:#55555f;--text-3:#8a8a95;--accent:#5b5bd6;--accent-text:#fff;--ok:#1f8a4c;--ok-tint:rgba(31,138,76,.1);--run:#2b6fd6;--run-tint:rgba(43,111,214,.1);--warn:#b26a00;--warn-tint:rgba(178,106,0,.11);--bad:#c9322b;--bad-tint:rgba(201,50,43,.1);--shadow:0 1px 2px rgba(20,20,30,.04),0 4px 16px rgba(20,20,30,.05);--radius:10px;--radius-s:6px;--font:'Inter var',Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--mono:ui-monospace,'SF Mono',SFMono-Regular,Menlo,'JetBrains Mono',monospace;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#111114;--surface:#18181c;--surface-2:#1f1f24;--hover:#26262c;--line:#2a2a31;--line-strong:#393941;--text:#e8e8ec;--text-2:#a8a8b3;--text-3:#75757f;--accent:#8b8cf6;--accent-text:#111114;--ok:#4fc483;--ok-tint:rgba(79,196,131,.13);--run:#6aa3f5;--run-tint:rgba(106,163,245,.13);--warn:#e2a33c;--warn-tint:rgba(226,163,60,.13);--bad:#f0716a;--bad-tint:rgba(240,113,106,.13);--shadow:0 1px 2px rgba(0,0,0,.3),0 4px 16px rgba(0,0,0,.25);color-scheme:dark}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--text)}
body{font:14px/1.55 var(--font);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline;text-underline-offset:2px}
code,pre{font-family:var(--mono);font-size:.92em}
::selection{background:var(--hover)}
header.top{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:16px;min-height:52px;padding:0 20px;background:var(--surface);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:10px;color:var(--text);font-weight:650;letter-spacing:-.01em;min-width:0}
.brand:hover{text-decoration:none}
.mark{width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--accent-text);display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}
nav{display:flex;gap:2px;margin-left:auto;overflow-x:auto}
nav a{color:var(--text-2);padding:6px 10px;border-radius:var(--radius-s);white-space:nowrap}
nav a:hover{background:var(--hover);color:var(--text);text-decoration:none}
main{max-width:1040px;margin:0 auto;padding:28px 32px 64px}
h1{margin:8px 0 20px;font-size:26px;line-height:1.25;letter-spacing:-.02em;font-weight:680}
h2{margin:30px 0 10px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)}
.head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.id{font-family:var(--mono);font-size:12px;color:var(--text-3);white-space:nowrap}
.chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:550;background:var(--surface-2);color:var(--text-2);white-space:nowrap;vertical-align:middle}
.chip.ok{background:var(--ok-tint);color:var(--ok)}.chip.run{background:var(--run-tint);color:var(--run)}.chip.warn{background:var(--warn-tint);color:var(--warn)}.chip.bad{background:var(--bad-tint);color:var(--bad)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin:0 0 16px;overflow-x:auto}
.card.pad{padding:16px 18px}
table{border-collapse:collapse;font-size:13.5px}
.card>table{width:100%}
th{text-align:left;font-weight:550;color:var(--text-3);font-size:12px;padding:8px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:8px 14px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
td:first-child a{white-space:nowrap}
.meta td:first-child{color:var(--text-3);white-space:nowrap;width:1%}
.tl td:first-child{white-space:nowrap;color:var(--text-3);font-family:var(--mono);font-size:12px;width:1%}
.tl td:nth-child(2){white-space:nowrap;color:var(--text-3);width:1%}
.list{list-style:none;margin:0 0 16px;padding:0}
.list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line)}
.list li:last-child{border-bottom:0}
.prose{font-size:15px;line-height:1.68;overflow-wrap:anywhere}
.prose h1,.prose h2,.prose h3{color:var(--text);text-transform:none;letter-spacing:-.01em;line-height:1.3;margin:1.6em 0 .5em;font-weight:650}
.prose h1{font-size:21px}.prose h2{font-size:18px}.prose h3{font-size:15.5px}
.prose>:first-child{margin-top:0}
.prose p{margin:.6em 0}
.prose ul,.prose ol{padding-left:1.4em}
.prose li{margin:.2em 0}
.prose li:has(>input[type=checkbox]){list-style:none;margin-left:-1.3em}
.prose input[type=checkbox]{accent-color:var(--accent);margin-right:6px}
.prose code{background:var(--surface-2);padding:1px 5px;border-radius:4px}
.prose pre{background:var(--surface-2);padding:12px 14px;border-radius:var(--radius-s);overflow:auto}
.prose pre code{background:none;padding:0}
.prose table{display:block;overflow:auto}
.prose th,.prose td{padding:6px 10px}
.prose blockquote{margin:.8em 0;padding:2px 14px;border-left:3px solid var(--line-strong);color:var(--text-2)}
.prose img{max-width:100%;height:auto;border-radius:var(--radius-s)}
.tree{overflow-x:auto;padding:8px}.tree svg{display:block}
svg text{font:11px var(--font);fill:var(--text-2);paint-order:stroke;stroke:var(--surface);stroke-width:3px;stroke-linejoin:round}
svg .edge{stroke:var(--line-strong);stroke-width:2}
svg .influence{stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3}
svg circle{fill:var(--surface);stroke:var(--text-2);stroke-width:1.5}
svg circle.positive{fill:var(--ok)}svg circle.negative{fill:var(--bad)}svg circle.inconclusive{fill:var(--warn)}svg circle.infra{fill:var(--text-3)}
@media (max-width:640px){header.top{padding:0 12px;gap:8px}main{padding:18px 16px 48px}h1{font-size:22px}.brand span:last-child{display:none}}
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
    markdown_with(ix, md, &|_| None)
}

/// Markdown with each image's source given by `img` when it has one for it.
fn markdown_with(ix: &Index, md: &str, img: &dyn Fn(&str) -> Option<String>) -> String {
    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_TASKLISTS);
    opts.insert(Options::ENABLE_STRIKETHROUGH);
    let text = linkify(ix, md);
    let parser = Parser::new_ext(&text, opts).map(|ev| match ev {
        Event::Start(Tag::Image { link_type, dest_url, title, id }) => {
            let dest_url = img(&dest_url).map(CowStr::from).unwrap_or(dest_url);
            Event::Start(Tag::Image { link_type, dest_url, title, id })
        }
        ev => ev,
    });
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

fn page(site: &Site, title: &str, nav: &str, body: &str) -> String {
    let mark: String = site.name.chars().next().map(|c| c.to_uppercase().collect()).unwrap_or_default();
    format!(
        "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>{} · {}</title><style>{CSS}</style></head>\n<body><header class=\"top\"><a class=\"brand\" href=\"index.html\"><span class=\"mark\">{}</span><span>{}</span></a><nav><a href=\"index.html\">home</a><a href=\"log.html\">log</a><a href=\"tasks.html\">tasks</a>{nav}</nav></header>\n<main>{body}</main>\n</body></html>\n",
        esc(title),
        esc(&site.name),
        esc(&mark),
        esc(&site.name)
    )
}

/// What every page of one render shares: the notebook's name, where its links into files
/// go, and where its images come from.
pub(crate) struct Site<'a> {
    name: String,
    files: &'a FileLinks,
    repo: &'a Path,
    out: &'a Path,
}

impl Site<'_> {
    /// The source of an image a page at `dir` (relative to the repo) gives as `src`: when
    /// served, the files API for a path under a root; when exported, a copy under
    /// `media/`, so the site carries its pictures. None leaves `src` as written: a URL,
    /// an absolute path, or a file that is not there.
    fn image(&self, dir: &Path, src: &str) -> Option<String> {
        let rel = repo_relative(dir, src)?;
        let ext = rel.rsplit_once('.')?.1.to_ascii_lowercase();
        if !["png", "jpg", "jpeg", "gif", "svg", "webp", "avif"].contains(&ext.as_str()) {
            return None;
        }
        let from = self.repo.join(&rel);
        let meta = fs::metadata(&from).ok().filter(|m| m.is_file())?;
        if !self.files.roots.is_empty() {
            let at = self.files.href(&rel)?;
            return Some(format!("api/files/raw?path={}", url_escape(at.trim_start_matches("files/#"), false)));
        }
        let to = self.out.join("media").join(&rel);
        let stale = match fs::metadata(&to) {
            Ok(t) => t.len() != meta.len() || t.modified().ok() < meta.modified().ok(),
            Err(_) => true,
        };
        if stale {
            fs::create_dir_all(to.parent()?).ok()?;
            fs::copy(&from, &to).ok()?;
        }
        Some(format!("media/{}", url_escape(&rel, true)))
    }
}

/// `src` (relative, as markdown wrote it, percent-escapes and all) from `dir`, as a path
/// relative to the repo with `/` between its parts; None for a URL, an absolute path, an
/// anchor, or one that climbs out of the repo.
fn repo_relative(dir: &Path, src: &str) -> Option<String> {
    let first = src.split(['/', '?', '#']).next().unwrap_or("");
    if src.is_empty() || src.starts_with(['/', '#', '?', '\\']) || first.contains(':') {
        return None;
    }
    let mut parts: Vec<String> = dir.iter().map(|c| c.to_string_lossy().into_owned()).collect();
    for seg in src.split(['?', '#']).next()?.split('/') {
        match url_unescape(seg)?.as_str() {
            "" | "." => {}
            ".." => {
                parts.pop()?;
            }
            s if s.contains(['\\', '\0']) => return None,
            s => parts.push(s.to_string()),
        }
    }
    (!parts.is_empty()).then(|| parts.join("/"))
}

fn url_unescape(s: &str) -> Option<String> {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' {
            let hex = std::str::from_utf8(b.get(i + 1..i + 3)?).ok()?;
            out.push(u8::from_str_radix(hex, 16).ok()?);
            i += 3;
        } else {
            out.push(b[i]);
            i += 1;
        }
    }
    String::from_utf8(out).ok()
}

/// Percent-escapes for a URL: everything but letters, digits, `-._~`, and `/` when
/// `slash`.
fn url_escape(s: &str, slash: bool) -> String {
    s.bytes()
        .map(|c| match c {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' => (c as char).to_string(),
            b'/' if slash => "/".to_string(),
            _ => format!("%{c:02X}"),
        })
        .collect()
}

/// How a status reads, as the app colours it: done, running, waiting, failed.
fn tone(s: &str) -> &'static str {
    match s.to_ascii_lowercase().as_str() {
        "done" | "complete" | "completed" | "supported" | "approved" | "merged" | "success" | "positive" => "ok",
        "active" | "running" | "in_progress" | "open" => "run",
        "planned" | "pending" | "changes_requested" | "inconclusive" | "paused" => "warn",
        "failed" | "aborted" | "refuted" | "abandoned" | "closed" | "negative" => "bad",
        _ => "",
    }
}

fn status_span(e: &Entity) -> String {
    let mut s = e.status.clone().unwrap_or_default();
    let outcome = e.outcome.clone().unwrap_or_default();
    // the outcome, when there is one, says more than the status
    let class = tone(if outcome.is_empty() { &s } else { &outcome });
    if !outcome.is_empty() {
        s = format!("{s} / {outcome}");
    }
    if s.is_empty() {
        return String::new();
    }
    format!("<span class=\"chip {class}\">{}</span>", esc(&s))
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
    if rows.is_empty() {
        return String::new();
    }
    format!("<div class=\"card\"><table class=\"meta\">{rows}</table></div>")
}

fn log_rows(ix: &Index, entries: &[LogEntry]) -> String {
    let mut out = String::from("<div class=\"card\"><table class=\"tl\">");
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
    out.push_str("</table></div>");
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
            "<text x=\"8\" y=\"{}\">{}</text>\n",
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
                    "<line class=\"edge\" x1=\"{}\" y1=\"{y}\" x2=\"{}\" y2=\"{y}\"/>\n",
                    x - dx + r,
                    x - r
                ));
            }
            // the outcome as the class its colour comes from
            let fill = match e.outcome.as_deref() {
                Some(o @ ("positive" | "negative" | "inconclusive" | "infra")) => o,
                _ => "",
            };
            nodes.push_str(&format!(
                "<a href=\"{}\"><circle class=\"{fill}\" cx=\"{x}\" cy=\"{y}\" r=\"{r}\"><title>{}: {} ({})</title></circle><text x=\"{x}\" y=\"{}\" text-anchor=\"middle\">{}</text></a>\n",
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
                        "<line class=\"influence\" x1=\"{x1}\" y1=\"{y1}\" x2=\"{x2}\" y2=\"{y2}\"/>\n"
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
        "<h2>Experiments</h2><div class=\"card\"><table><tr><th>id</th><th>status</th><th>title</th><th>in short</th></tr>\n",
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
    out.push_str("</table></div>");
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
        "<h2>Runs</h2><div class=\"card\"><table><tr><th>run</th><th>status</th><th>finished</th><th>in short</th>",
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
            status_span(run),
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
    out.push_str("</table></div>");
    out
}

fn entity_page(ix: &Index, e: &Entity, site: &Site) -> String {
    let mut body = format!(
        "<div class=\"head\"><span class=\"id\">{}</span><span class=\"chip\">{}</span>{}</div><h1>{}</h1>\n{}\n",
        esc(&e.id),
        esc(&e.etype),
        status_span(e),
        esc(&e.title),
        meta_table(ix, e, site.files)
    );
    if e.etype == "project" {
        let svg = tree_svg(ix, &e.id);
        if !svg.is_empty() {
            body.push_str(&format!(
                "<h2>Experiment tree</h2>\n<div class=\"card tree\">{svg}</div>\n"
            ));
        }
        body.push_str(&experiments_table(ix, &e.id));
    }
    // the page's own text, its images from beside its file
    let dir = Path::new(&e.path).parent().unwrap_or(Path::new(""));
    let text = markdown_with(ix, &e.body, &|src| site.image(dir, src));
    if !text.trim().is_empty() {
        body.push_str(&format!("<div class=\"card pad prose\">{text}</div>"));
    }
    if e.etype == "experiment" {
        body.push_str(&runs_table(ix, &e.id));
    }
    let back = ix.backlinks(&e.id);
    if !back.is_empty() {
        body.push_str("<h2>Linked from</h2><ul class=\"card list\">");
        let mut seen = Vec::new();
        for (src, ctx) in back {
            if seen.contains(&src) {
                continue;
            }
            seen.push(src.clone());
            let title = ix.entity(&src).map(|s| s.title).unwrap_or_default();
            body.push_str(&format!(
                "<li>{} {} <span class=\"chip\">{}</span></li>",
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
    page(site, &format!("{} {}", e.id, e.title), &nav, &body)
}

fn index_page(ix: &Index, site: &Site) -> String {
    let mut body = format!("<h1>{}</h1>\n<h2>Projects</h2><div class=\"card\"><table>", esc(&site.name));
    body.push_str("<tr><th>id</th><th>title</th><th>status</th><th>experiments</th></tr>");
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
    body.push_str("</table></div>");
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
        body.push_str(&format!("<h2>{heading}</h2><ul class=\"card list\">"));
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
    page(site, "Overview", "", &body)
}

fn log_page(ix: &Index, site: &Site) -> String {
    let mut entries = ix.log();
    entries.reverse();
    page(
        site,
        "Log",
        "",
        &format!("<h1>Log</h1>\n{}", log_rows(ix, &entries)),
    )
}

fn tasks_page(ix: &Index, site: &Site) -> String {
    let mut body = String::from("<h1>Tasks</h1><div class=\"card\"><table>");
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
    body.push_str("</table></div>");
    page(site, "Tasks", "", &body)
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
    let site = Site {
        name: vault.namespace().unwrap_or("notebook").to_string(),
        files,
        repo: &vault.root,
        out,
    };
    put("index.html".into(), index_page(&ix, &site))?;
    put("log.html".into(), log_page(&ix, &site))?;
    put("tasks.html".into(), tasks_page(&ix, &site))?;
    for e in ix.entities("", &[]) {
        put(href(&e.id), entity_page(&ix, &e, &site))?;
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

/// Search (ADR-0041): pages with every word of `q` in their ID, title, tags or text,
/// ranked by where the words are (an ID over a title over a tag over the text, the whole
/// query as the ID or in the title above all), newest first among equals; and the log
/// lines with every word, newest first. Case is ignored. A scan of the index, which a
/// notebook of a few thousand pages answers in milliseconds.
fn search(ix: &Index, q: &str, limit: usize) -> Value {
    let terms: Vec<String> = q.split_whitespace().map(str::to_lowercase).collect();
    if terms.is_empty() {
        return serde_json::json!({ "pages": [], "pages_total": 0, "log": [], "log_total": 0 });
    }
    let words = terms.iter().map(|t| regex::escape(t)).collect::<Vec<_>>().join("|");
    let any = regex::RegexBuilder::new(&words).case_insensitive(true).build().expect("escaped words");
    let whole = terms.join(" ");
    let mut hits: Vec<(f64, Entity)> = Vec::new();
    for e in ix.entities("", &[]) {
        let (id, title) = (e.id.to_lowercase(), e.title.to_lowercase());
        let tags = e.tags.join(" ").to_lowercase();
        let body = e.body.to_lowercase();
        let mut score = 0.0;
        for t in &terms {
            let mut s = 0.0;
            if id.contains(t.as_str()) {
                s += 8.0;
            }
            if title.contains(t.as_str()) {
                s += 6.0;
            }
            if tags.split(' ').any(|g| g == t) {
                s += 4.0;
            }
            let n = body.matches(t.as_str()).take(5).count();
            if n > 0 {
                s += 1.0 + 0.25 * n as f64;
            }
            if s == 0.0 {
                score = 0.0;
                break;
            }
            score += s;
        }
        if score == 0.0 {
            continue;
        }
        if id == whole {
            score += 100.0;
        } else if title == whole {
            score += 30.0;
        } else if terms.len() > 1 && title.contains(&whole) {
            score += 10.0;
        }
        hits.push((score, e));
    }
    hits.sort_by(|(a, x), (b, y)| b.total_cmp(a).then_with(|| y.created.cmp(&x.created)));
    let pages_total = hits.len();
    let pages: Vec<Value> = hits
        .iter()
        .take(limit)
        .map(|(_, e)| {
            let mut v = summary(e);
            let parent = e.experiment.as_ref().or(e.project.as_ref());
            if let Some(note) = parent.and_then(|p| ix.note(p, &e.id)) {
                v["note"] = note.into();
            }
            v["snippet"] = passage(&e.body, &any).into();
            v
        })
        .collect();
    let mut log: Vec<LogEntry> = ix
        .log()
        .into_iter()
        .filter(|m| {
            let text = format!("{} {}", m.text, m.author).to_lowercase();
            terms.iter().all(|t| text.contains(t.as_str()))
        })
        .collect();
    log.reverse();
    let log_total = log.len();
    log.truncate(20);
    serde_json::json!({ "pages": pages, "pages_total": pages_total, "log": log_json(ix, &log), "log_total": log_total })
}

/// The passage of `text` around the first match of `re`, on one line, about 200
/// characters, cut at spaces, as plain text: `[[ID|label]]` as its label, headings,
/// emphasis and code marks dropped; None when nothing in it matches.
fn passage(text: &str, re: &regex::Regex) -> Option<String> {
    static MARKS: std::sync::LazyLock<[regex::Regex; 2]> = std::sync::LazyLock::new(|| {
        [
            regex::Regex::new(r"\[\[(?:[^\]|]*\|)?([^\]]*)\]\]").unwrap(),
            regex::Regex::new(r"(?m)^#{1,6}\s+|\*\*|__|`").unwrap(),
        ]
    });
    let plain = MARKS[0].replace_all(text, "$1");
    let plain = MARKS[1].replace_all(&plain, "");
    let flat = plain.split_whitespace().collect::<Vec<_>>().join(" ");
    let m = re.find(&flat)?;
    let mut from = m.start().saturating_sub(60);
    while !flat.is_char_boundary(from) {
        from -= 1;
    }
    if from > 0 {
        from = flat[from..m.start()].find(' ').map(|i| from + i + 1).unwrap_or(m.start());
    }
    let mut to = (m.end() + 160).min(flat.len());
    while !flat.is_char_boundary(to) {
        to -= 1;
    }
    if to < flat.len() {
        to = flat[m.end()..to].rfind(' ').map(|i| m.end() + i).unwrap_or(to);
    }
    Some(format!(
        "{}{}{}",
        if from > 0 { "…" } else { "" },
        &flat[from..to],
        if to < flat.len() { "…" } else { "" }
    ))
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
        // where the files view has the page's directory, which its relative images and
        // links are relative to
        if let Some(dir) = Path::new(&e.path).parent().and_then(|d| self.links.href(&d.to_string_lossy())) {
            v["dir"] = dir.trim_start_matches("files/#").into();
        }
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

    fn search(&self, q: &str, limit: usize) -> Result<Value, String> {
        let (_, ix) = self.index()?;
        Ok(search(&ix, q, limit))
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
