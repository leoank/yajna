//! `yajna sync` (architecture 5.8, ADR-0011): pages marked
//! `sync: {provider: gdoc, mode: publish}` become Google Docs that are updated in place, and
//! the comments people leave there come back into the page under `## Review`. Ticking a
//! review item resolves its comment in the doc. Only `publish` is built; `mirror` and
//! `import` wait until publishing is routine.
//!
//! Credentials: `yajna sync login --client <client_secret.json>` runs the desktop OAuth
//! flow once and stores a refresh token at `$YAJNA_GDOC_CREDENTIALS` or
//! `~/.config/yajna/gdoc.json` (never in the repo). `YAJNA_GDOC_TOKEN` supplies an access
//! token directly and `YAJNA_GDOC_API` another endpoint; tests use both.

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use pulldown_cmark::{html, Options, Parser};
use regex::Regex;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};

use crate::init::edit_frontmatter;
use crate::site::esc;
use crate::vault::{map_outside_code, rel, Page, Res, Vault, LINK_RE, NS_ID_RE};

const SCOPE: &str = "https://www.googleapis.com/auth/drive.file";
const DOC_MIME: &str = "application/vnd.google-apps.document";
const REVIEW: &str = "## Review";
static REVIEW_ITEM_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^- \[( |x|X)\] .*<!-- gdoc:(\S+) -->\s*$").unwrap());

// --- the API ------------------------------------------------------------------------------

struct Api {
    base: String,
    token: String,
    agent: ureq::Agent,
}

fn agent() -> ureq::Agent {
    ureq::Agent::config_builder()
        .http_status_as_error(false)
        .build()
        .into()
}

fn reply(resp: Result<ureq::http::Response<ureq::Body>, ureq::Error>, what: &str) -> Res<Value> {
    let mut resp = resp.map_err(|e| format!("{what}: {e}"))?;
    let status = resp.status().as_u16();
    let text = resp
        .body_mut()
        .read_to_string()
        .map_err(|e| format!("{what}: {e}"))?;
    if status >= 400 {
        return Err(format!("{what}: HTTP {status}: {}", text.trim()));
    }
    if text.trim().is_empty() {
        return Ok(Value::Null);
    }
    serde_json::from_str(&text).map_err(|e| format!("{what}: bad JSON: {e}"))
}

impl Api {
    fn new() -> Res<Api> {
        let base = std::env::var("YAJNA_GDOC_API")
            .unwrap_or_else(|_| "https://www.googleapis.com".into())
            .trim_end_matches('/')
            .to_string();
        let agent = agent();
        let token = match std::env::var("YAJNA_GDOC_TOKEN") {
            Ok(t) if !t.is_empty() => t,
            _ => refresh(&agent)?,
        };
        Ok(Api { base, token, agent })
    }

    fn auth(&self) -> String {
        format!("Bearer {}", self.token)
    }

    fn get(&self, path: &str) -> Res<Value> {
        let url = format!("{}{path}", self.base);
        reply(
            self.agent
                .get(&url)
                .header("Authorization", &self.auth())
                .call(),
            &format!("GET {path}"),
        )
    }

    fn post_json(&self, path: &str, body: &Value) -> Res<Value> {
        let url = format!("{}{path}", self.base);
        reply(
            self.agent
                .post(&url)
                .header("Authorization", &self.auth())
                .header("Content-Type", "application/json")
                .send(body.to_string()),
            &format!("POST {path}"),
        )
    }

    /// files.create or files.update with a metadata part and an HTML part; Drive converts the
    /// HTML into the Google Doc.
    fn upload(&self, doc_id: Option<&str>, meta: &Value, html: &str) -> Res<Value> {
        let boundary = format!("yajna{:016x}", fastrand::u64(..));
        let body = format!(
            "--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{meta}\r\n--{boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n{html}\r\n--{boundary}--\r\n"
        );
        let ctype = format!("multipart/related; boundary={boundary}");
        match doc_id {
            None => {
                let path = "/upload/drive/v3/files?uploadType=multipart&fields=id";
                reply(
                    self.agent
                        .post(&format!("{}{path}", self.base))
                        .header("Authorization", &self.auth())
                        .header("Content-Type", &ctype)
                        .send(body),
                    "create doc",
                )
            }
            Some(id) => {
                let path = format!("/upload/drive/v3/files/{id}?uploadType=multipart&fields=id");
                reply(
                    self.agent
                        .patch(&format!("{}{path}", self.base))
                        .header("Authorization", &self.auth())
                        .header("Content-Type", &ctype)
                        .send(body),
                    &format!("update doc {id}"),
                )
            }
        }
    }

    fn comments(&self, doc_id: &str) -> Res<Vec<Value>> {
        let fields = "comments(id,author(displayName,emailAddress),content,quotedFileContent(value),createdTime,resolved,deleted,replies(author(displayName),content,createdTime,deleted,action)),nextPageToken";
        let mut out = Vec::new();
        let mut page = String::new();
        loop {
            let mut path = format!(
                "/drive/v3/files/{doc_id}/comments?pageSize=100&includeDeleted=false&fields={}",
                urlencode(fields)
            );
            if !page.is_empty() {
                path.push_str(&format!("&pageToken={}", urlencode(&page)));
            }
            let v = self.get(&path)?;
            out.extend(v["comments"].as_array().cloned().unwrap_or_default());
            match v["nextPageToken"].as_str() {
                Some(t) if !t.is_empty() => page = t.to_string(),
                _ => return Ok(out),
            }
        }
    }
}

fn urlencode(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                (b as char).to_string()
            }
            _ => format!("%{b:02X}"),
        })
        .collect()
}

fn form(pairs: &[(&str, &str)]) -> String {
    pairs
        .iter()
        .map(|(k, v)| format!("{}={}", urlencode(k), urlencode(v)))
        .collect::<Vec<_>>()
        .join("&")
}

// --- credentials --------------------------------------------------------------------------

fn credentials_path() -> PathBuf {
    if let Ok(p) = std::env::var("YAJNA_GDOC_CREDENTIALS") {
        return PathBuf::from(p);
    }
    let base = std::env::var("XDG_CONFIG_HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|_| {
            PathBuf::from(std::env::var("HOME").unwrap_or_default()).join(".config")
        });
    base.join("yajna").join("gdoc.json")
}

/// A fresh access token from the stored refresh token.
fn refresh(agent: &ureq::Agent) -> Res<String> {
    let path = credentials_path();
    let text = fs::read_to_string(&path).map_err(|_| {
        format!(
            "no Google credentials at {}; run `yajna sync login --client <client_secret.json>` once",
            path.display()
        )
    })?;
    let c: Value = serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?;
    let token_uri = c["token_uri"]
        .as_str()
        .unwrap_or("https://oauth2.googleapis.com/token");
    let body = form(&[
        ("client_id", c["client_id"].as_str().unwrap_or("")),
        ("client_secret", c["client_secret"].as_str().unwrap_or("")),
        ("refresh_token", c["refresh_token"].as_str().unwrap_or("")),
        ("grant_type", "refresh_token"),
    ]);
    let v = reply(
        agent
            .post(token_uri)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .send(body),
        "refresh the Google token",
    )?;
    v["access_token"]
        .as_str()
        .map(str::to_string)
        .ok_or_else(|| "refresh the Google token: no access_token in the reply".into())
}

fn b64url(bytes: &[u8]) -> String {
    const A: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let mut out = String::new();
    for chunk in bytes.chunks(3) {
        let n = chunk
            .iter()
            .enumerate()
            .fold(0u32, |n, (i, b)| n | (*b as u32) << (16 - 8 * i));
        for i in 0..=chunk.len() {
            out.push(A[(n >> (18 - 6 * i) & 63) as usize] as char);
        }
    }
    out
}

/// `yajna sync login`: the desktop OAuth flow with a loopback redirect and PKCE, for the
/// account that owns the docs (ADR-0011). Stores the refresh token outside the repo.
pub fn login(client: &Path) -> Res<i32> {
    let text = fs::read_to_string(client).map_err(|e| format!("{}: {e}", client.display()))?;
    let v: Value = serde_json::from_str(&text).map_err(|e| format!("{}: {e}", client.display()))?;
    let c = v.get("installed").or_else(|| v.get("web")).unwrap_or(&v);
    let (id, secret) = (
        c["client_id"].as_str().unwrap_or(""),
        c["client_secret"].as_str().unwrap_or(""),
    );
    if id.is_empty() {
        return Err(format!(
            "{}: no client_id; download the OAuth client (type Desktop app) from the Google Cloud console",
            client.display()
        ));
    }
    let auth_uri = c["auth_uri"]
        .as_str()
        .unwrap_or("https://accounts.google.com/o/oauth2/auth");
    let token_uri = c["token_uri"]
        .as_str()
        .unwrap_or("https://oauth2.googleapis.com/token");
    let listener = TcpListener::bind("127.0.0.1:0").map_err(|e| e.to_string())?;
    let redirect = format!(
        "http://{}",
        listener.local_addr().map_err(|e| e.to_string())?
    );
    let verifier: String = (0..64).map(|_| fastrand::alphanumeric()).collect();
    let challenge = b64url(&Sha256::digest(verifier.as_bytes()));
    let state: String = (0..16).map(|_| fastrand::alphanumeric()).collect();
    let url = format!(
        "{auth_uri}?{}",
        form(&[
            ("client_id", id),
            ("redirect_uri", &redirect),
            ("response_type", "code"),
            ("scope", SCOPE),
            ("access_type", "offline"),
            ("prompt", "consent"),
            ("code_challenge", &challenge),
            ("code_challenge_method", "S256"),
            ("state", &state),
        ])
    );
    println!("Open this URL and allow access (a browser should open):\n{url}");
    let opener = if cfg!(target_os = "macos") {
        "open"
    } else {
        "xdg-open"
    };
    let _ = std::process::Command::new(opener).arg(&url).spawn();
    let (mut stream, _) = listener.accept().map_err(|e| e.to_string())?;
    let mut line = String::new();
    BufReader::new(stream.try_clone().map_err(|e| e.to_string())?)
        .read_line(&mut line)
        .map_err(|e| e.to_string())?;
    let query = line
        .split_whitespace()
        .nth(1)
        .unwrap_or("")
        .split_once('?')
        .map(|(_, q)| q)
        .unwrap_or("");
    let params: BTreeMap<&str, String> = query
        .split('&')
        .filter_map(|kv| kv.split_once('='))
        .map(|(k, v)| (k, urldecode(v)))
        .collect();
    let _ = write!(stream, "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nyajna: signed in; you can close this tab.\n");
    if params.get("state").map(String::as_str) != Some(state.as_str()) {
        return Err("login: the reply did not carry our state; try again".into());
    }
    let code = params.get("code").ok_or_else(|| {
        format!(
            "login: no code ({})",
            params.get("error").cloned().unwrap_or_default()
        )
    })?;
    let v = reply(
        agent()
            .post(token_uri)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .send(form(&[
                ("client_id", id),
                ("client_secret", secret),
                ("code", code),
                ("code_verifier", &verifier),
                ("redirect_uri", &redirect),
                ("grant_type", "authorization_code"),
            ])),
        "exchange the code",
    )?;
    let refresh = v["refresh_token"]
        .as_str()
        .ok_or("login: Google sent no refresh token")?;
    let path = credentials_path();
    fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;
    let creds = json!({"client_id": id, "client_secret": secret, "refresh_token": refresh, "token_uri": token_uri});
    fs::write(&path, serde_json::to_string_pretty(&creds).unwrap()).map_err(|e| e.to_string())?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&path, fs::Permissions::from_mode(0o600));
    }
    println!(
        "signed in; credentials in {} (keep them out of any repo)",
        path.display()
    );
    Ok(0)
}

fn urldecode(s: &str) -> String {
    let b = s.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;
    while i < b.len() {
        match b[i] {
            b'+' => out.push(b' '),
            b'%' if i + 2 < b.len() => match u8::from_str_radix(&s[i + 1..i + 3], 16) {
                Ok(x) => {
                    out.push(x);
                    i += 2;
                }
                Err(_) => out.push(b'%'),
            },
            c => out.push(c),
        }
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

// --- pages --------------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq)]
pub struct SyncField {
    pub provider: String,
    pub mode: String,
    pub doc_id: Option<String>,
}

pub fn sync_field(page: &Page) -> Option<SyncField> {
    let v = page.meta.as_ref()?.get("sync")?;
    Some(SyncField {
        provider: v.get("provider")?.as_str()?.to_string(),
        mode: v
            .get("mode")
            .and_then(|m| m.as_str())
            .unwrap_or("publish")
            .to_string(),
        doc_id: v.get("doc_id").and_then(|d| d.as_str()).map(str::to_string),
    })
}

pub fn doc_url(doc_id: &str) -> String {
    format!("https://docs.google.com/document/d/{doc_id}/edit")
}

/// The body without its `## Review` section, which lives in the doc as comments already.
fn without_review(body: &str) -> String {
    match find_section(body) {
        Some((start, end)) => format!("{}{}", &body[..start], &body[end..]),
        None => body.to_string(),
    }
}

/// Byte range of the `## Review` section, heading included.
fn find_section(body: &str) -> Option<(usize, usize)> {
    let start = if body.starts_with(REVIEW) {
        0
    } else {
        body.find(&format!("\n{REVIEW}\n")).map(|i| i + 1)?
    };
    let after = start + REVIEW.len();
    let end = body[after..]
        .find("\n## ")
        .map(|i| after + i + 1)
        .unwrap_or(body.len());
    Some((start, end))
}

/// The HTML a doc is made from: a header with ID, title and status, then the body with
/// `[[links]]` to synced pages pointing at their docs, to the site when `[sync] site_url`
/// is set, and plain text otherwise.
fn render(vault: &Vault, page: &Page, docs: &BTreeMap<String, String>) -> String {
    let site = vault.cfg.sync.site_url.clone();
    let body = map_outside_code(&without_review(&page.body), |prose| {
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
                    Some(m) if m.get(1).is_none() => {
                        if let Some(doc) = docs.get(&m[2]) {
                            format!("[{text}]({})", doc_url(doc))
                        } else if let Some(s) = &site {
                            format!("[{text}]({}/{}.html)", s.trim_end_matches('/'), &m[2])
                        } else {
                            text
                        }
                    }
                    _ => text,
                }
            })
            .into_owned()
    });
    let mut opts = Options::empty();
    opts.insert(Options::ENABLE_TABLES);
    opts.insert(Options::ENABLE_TASKLISTS);
    let mut html_body = String::new();
    html::push_html(&mut html_body, Parser::new_ext(&body, opts));
    // Docs drops <input> on import, so a task's state becomes a character
    let html_body = html_body
        .replace("<input disabled=\"\" type=\"checkbox\" checked=\"\"/>\n", "☑ ")
        .replace("<input disabled=\"\" type=\"checkbox\"/>\n", "☐ ");
    let id = page.id().unwrap_or("");
    let status = page.field("status").unwrap_or("");
    format!(
        "<html><head><meta charset=\"utf-8\"></head><body>\n<p><b>{}</b>{}{}</p>\n<h1>{}</h1>\n{html_body}</body></html>\n",
        esc(id),
        if status.is_empty() { String::new() } else { format!(" · {}", esc(status)) },
        " · published from the notebook; comments here come back to it",
        esc(page.field("title").unwrap_or(id))
    )
}

fn hash(html: &str) -> String {
    format!("{:x}", Sha256::digest(html.as_bytes()))[..16].to_string()
}

/// Write `sync: {provider: gdoc, mode: <mode>, doc_id: <id>}` as one flow-mapping line.
fn set_doc_id(text: &str, mode: &str, doc_id: &str) -> String {
    edit_frontmatter(text, |lines| {
        let line = format!("sync: {{provider: gdoc, mode: {mode}, doc_id: {doc_id}}}");
        match lines.iter().position(|l| l.starts_with("sync:")) {
            Some(i) => {
                let mut j = i + 1;
                while j < lines.len() && lines[j].starts_with([' ', '\t']) {
                    j += 1;
                }
                lines.splice(i..j, [line]);
            }
            None => lines.push(line),
        }
    })
}

fn one_line(s: &str) -> String {
    crate::import::literal(&s.split_whitespace().collect::<Vec<_>>().join(" "))
}

/// Merge the doc's comments into the page's `## Review` section. Returns the new text, the
/// comment IDs ticked in the repo but still open in the doc, and how many items are new.
fn merge_review(text: &str, comments: &[Value]) -> (String, Vec<String>, usize) {
    let (fm, body) = match text
        .strip_prefix("---\n")
        .and_then(|r| r.find("\n---\n").map(|i| i + 4 + 5))
    {
        Some(end) => (&text[..end], &text[end..]),
        None => ("", text),
    };
    // what the repo already has: ticks, and items whose comment is gone from the doc
    let mut ticked = BTreeSet::new();
    let mut known = BTreeSet::new();
    let mut kept: Vec<(String, Vec<String>)> = Vec::new();
    let mut section_rest = String::from(
        "Comments from the Google Doc, pulled by `yajna sync`. Tick a box to resolve the comment there.\n",
    );
    if let Some((s, e)) = find_section(body) {
        let section = &body[s..e];
        let mut current: Option<(String, Vec<String>)> = None;
        let mut intro = String::new();
        for line in section.lines().skip(1) {
            if let Some(m) = REVIEW_ITEM_RE.captures(line) {
                if let Some(c) = current.take() {
                    kept.push(c);
                }
                if m[1].eq_ignore_ascii_case("x") {
                    ticked.insert(m[2].to_string());
                }
                known.insert(m[2].to_string());
                current = Some((line.to_string(), Vec::new()));
            } else if let Some(c) = current.as_mut() {
                if !line.trim().is_empty() {
                    c.1.push(line.to_string());
                }
            } else if !line.trim().is_empty() {
                intro.push_str(line);
                intro.push('\n');
            }
        }
        if let Some(c) = current {
            kept.push(c);
        }
        if !intro.is_empty() {
            section_rest = intro;
        }
    }
    let in_doc: BTreeMap<String, &Value> = comments
        .iter()
        .filter(|c| !c["deleted"].as_bool().unwrap_or(false))
        .filter_map(|c| c["id"].as_str().map(|id| (id.to_string(), c)))
        .collect();
    let mut to_resolve = Vec::new();
    let mut fresh = 0;
    let mut items: Vec<String> = Vec::new();
    // comments still in the doc, rendered from the doc, ticks kept
    let mut ordered: Vec<&Value> = in_doc.values().copied().collect();
    ordered.sort_by(|a, b| a["createdTime"].as_str().cmp(&b["createdTime"].as_str()));
    for c in ordered {
        let id = c["id"].as_str().unwrap_or("");
        let resolved = c["resolved"].as_bool().unwrap_or(false);
        let tick = ticked.contains(id);
        if tick && !resolved {
            to_resolve.push(id.to_string());
        }
        if !known.contains(id) {
            fresh += 1;
        }
        let who = one_line(c["author"]["displayName"].as_str().unwrap_or("someone"));
        let when = c["createdTime"]
            .as_str()
            .unwrap_or("")
            .get(..10)
            .unwrap_or("");
        let quoted = c["quotedFileContent"]["value"].as_str().unwrap_or("");
        let on = if quoted.is_empty() {
            String::new()
        } else {
            format!(" on \"{}\"", one_line(quoted))
        };
        let mut item = format!(
            "- [{}] {who}, {when}{on}: {} <!-- gdoc:{id} -->\n",
            if resolved || tick { "x" } else { " " },
            one_line(c["content"].as_str().unwrap_or(""))
        );
        for r in c["replies"].as_array().into_iter().flatten() {
            if r["deleted"].as_bool().unwrap_or(false)
                || r["content"].as_str().unwrap_or("").is_empty()
            {
                continue;
            }
            item.push_str(&format!(
                "  - {}, {}: {}\n",
                one_line(r["author"]["displayName"].as_str().unwrap_or("someone")),
                r["createdTime"]
                    .as_str()
                    .unwrap_or("")
                    .get(..10)
                    .unwrap_or(""),
                one_line(r["content"].as_str().unwrap_or(""))
            ));
        }
        items.push(item);
    }
    // items whose comment was deleted in the doc stay as they were: the notebook never forgets
    for (line, rest) in kept {
        let id = REVIEW_ITEM_RE
            .captures(&line)
            .map(|m| m[2].to_string())
            .unwrap_or_default();
        if !in_doc.contains_key(&id) {
            let mut item = format!("{line}\n");
            for r in rest {
                item.push_str(&format!("{r}\n"));
            }
            items.push(item);
        }
    }
    if items.is_empty() && find_section(body).is_none() {
        return (text.to_string(), to_resolve, 0);
    }
    let section = format!("{REVIEW}\n{section_rest}\n{}", items.concat());
    let new_body = match find_section(body) {
        Some((s, e)) => {
            let tail = &body[e..];
            let sep = if tail.is_empty() { "" } else { "\n" };
            format!("{}{section}{sep}{tail}", &body[..s])
        }
        None => format!(
            "{}\n{section}",
            body.trim_end_matches('\n').to_string() + "\n"
        ),
    };
    (format!("{fm}{new_body}"), to_resolve, fresh)
}

// --- the command --------------------------------------------------------------------------

pub fn cmd_sync(vault: &Vault, ids: &[String], dry_run: bool, no_comments: bool) -> Res<i32> {
    let pages: Vec<Page> = vault
        .pages()?
        .into_iter()
        .filter(|p| sync_field(p).is_some())
        .filter(|p| ids.is_empty() || p.id().map(|i| ids.iter().any(|x| x == i)).unwrap_or(false))
        .collect();
    if pages.is_empty() {
        println!(
            "no page has `sync: {{provider: gdoc, mode: publish}}`{}",
            if ids.is_empty() {
                ""
            } else {
                " among those named"
            }
        );
        return Ok(0);
    }
    let mut work = Vec::new();
    for p in pages {
        let s = sync_field(&p).unwrap();
        let r = rel(&p.path, &vault.root).to_string();
        if s.provider != "gdoc" {
            println!("skip {r}: provider {} is not supported", s.provider);
        } else if s.mode != "publish" {
            println!("skip {r}: mode {} is not built yet (only publish)", s.mode);
        } else {
            work.push((p, s));
        }
    }
    if dry_run {
        for (p, s) in &work {
            let what = match &s.doc_id {
                Some(d) => format!(
                    "update {}{}",
                    doc_url(d),
                    if no_comments {
                        ""
                    } else {
                        " and pull comments"
                    }
                ),
                None => "create a new doc".to_string(),
            };
            println!("{}: {what}", rel(&p.path, &vault.root));
        }
        return Ok(0);
    }
    let api = Api::new()?;
    let folder = vault.cfg.sync.folder.clone();

    // 1. every page gets a doc first, so links between synced pages can point at docs
    let mut docs: BTreeMap<String, String> = vault
        .pages()?
        .iter()
        .filter_map(|p| Some((p.id()?.to_string(), sync_field(p)?.doc_id?)))
        .collect();
    for (page, s) in work.iter_mut() {
        if s.doc_id.is_some() {
            continue;
        }
        let title = format!(
            "{} {}",
            page.id().unwrap_or(""),
            page.field("title").unwrap_or("")
        )
        .trim()
        .to_string();
        let mut meta = json!({"name": title, "mimeType": DOC_MIME});
        if let Some(f) = &folder {
            meta["parents"] = json!([f]);
        }
        let v = api.upload(None, &meta, "<html><body><p>Publishing…</p></body></html>")?;
        let id = v["id"]
            .as_str()
            .ok_or("create doc: no id in the reply")?
            .to_string();
        let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
        fs::write(&page.path, set_doc_id(&text, &s.mode, &id)).map_err(|e| e.to_string())?;
        println!(
            "created {} for {}",
            doc_url(&id),
            rel(&page.path, &vault.root)
        );
        if let Some(pid) = page.id() {
            docs.insert(pid.to_string(), id.clone());
        }
        s.doc_id = Some(id);
        *page = vault.read(&page.path)?;
    }

    // 2. per page: comments back first (an overwrite orphans their anchors), then publish
    let (mut published, mut pulled, mut resolved) = (0, 0, 0);
    for (page, s) in &work {
        let doc = s.doc_id.clone().unwrap();
        let r = rel(&page.path, &vault.root).to_string();
        if !no_comments {
            let comments = api.comments(&doc)?;
            let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
            let (new_text, to_resolve, fresh) = merge_review(&text, &comments);
            for cid in &to_resolve {
                api.post_json(
                    &format!("/drive/v3/files/{doc}/comments/{cid}/replies?fields=id"),
                    &json!({"action": "resolve", "content": "Resolved in the notebook."}),
                )?;
                resolved += 1;
            }
            if new_text != text {
                fs::write(&page.path, &new_text).map_err(|e| e.to_string())?;
            }
            if fresh > 0 {
                println!("{r}: {fresh} new comment(s) under {REVIEW}");
            }
            pulled += fresh;
        }
        let page = vault.read(&page.path)?;
        let html = render(vault, &page, &docs);
        let digest = hash(&html);
        let current = api.get(&format!(
            "/drive/v3/files/{doc}?fields=id,trashed,appProperties"
        ))?;
        if current["trashed"].as_bool().unwrap_or(false) {
            println!(
                "{r}: the doc is in the trash; restore it or remove doc_id to publish a new one"
            );
            continue;
        }
        if current["appProperties"]["yajna_hash"].as_str() == Some(digest.as_str()) {
            continue;
        }
        let meta = json!({
            "name": format!("{} {}", page.id().unwrap_or(""), page.field("title").unwrap_or("")).trim(),
            "appProperties": {"yajna_id": page.id().unwrap_or(""), "yajna_hash": digest},
        });
        api.upload(Some(&doc), &meta, &html)?;
        published += 1;
        println!("published {r} -> {}", doc_url(&doc));
    }
    println!(
        "{} page(s) synced: {published} published, {pulled} new comment(s), {resolved} resolved in the doc",
        work.len()
    );
    if published + pulled + resolved > 0 {
        println!("next: yajna validate, review the Review sections, and commit the pages");
    }
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn base64url() {
        assert_eq!(b64url(b"hello"), "aGVsbG8");
        assert_eq!(b64url(b""), "");
        assert_eq!(b64url(&[0xfb, 0xff]), "-_8");
    }

    #[test]
    fn doc_id_is_one_flow_line() {
        let t =
            "---\nid: PRJ-0001\nsync:\n  provider: gdoc\n  mode: publish\ntitle: x\n---\nbody\n";
        assert_eq!(
            set_doc_id(t, "publish", "abc"),
            "---\nid: PRJ-0001\nsync: {provider: gdoc, mode: publish, doc_id: abc}\ntitle: x\n---\nbody\n"
        );
    }

    #[test]
    fn review_merge_keeps_ticks_and_deleted_items() {
        let page = "---\nid: X\n---\n\n## Notes\nhi\n\n## Review\nmine\n\n- [x] Sam, 2026-10-01: old <!-- gdoc:c1 -->\n- [ ] Ann, 2026-10-02: gone <!-- gdoc:c9 -->\n  - Bob, 2026-10-03: reply\n";
        let comments = vec![
            serde_json::json!({"id": "c1", "author": {"displayName": "Sam"}, "content": "old", "createdTime": "2026-10-01T00:00:00Z", "resolved": false}),
            serde_json::json!({"id": "c2", "author": {"displayName": "PI"}, "content": "why\nthis @x?", "quotedFileContent": {"value": "the [[result]]"}, "createdTime": "2026-10-04T00:00:00Z", "resolved": false,
                               "replies": [{"author": {"displayName": "Ank"}, "content": "because", "createdTime": "2026-10-05T00:00:00Z"}]}),
        ];
        let (out, resolve, fresh) = merge_review(page, &comments);
        assert_eq!(resolve, vec!["c1"]);
        assert_eq!(fresh, 1);
        assert!(out.contains("## Notes\nhi\n\n## Review\nmine\n\n- [x] Sam, 2026-10-01: old <!-- gdoc:c1 -->\n- [ ] PI, 2026-10-04 on \"the &#91;&#91;result]]\": why this &#64;x? <!-- gdoc:c2 -->\n  - Ank, 2026-10-05: because\n- [ ] Ann, 2026-10-02: gone <!-- gdoc:c9 -->\n  - Bob, 2026-10-03: reply\n"), "{out}");
        // nothing to merge, nothing changes
        let plain = "---\nid: X\n---\nbody\n";
        assert_eq!(merge_review(plain, &[]).0, plain);
    }
}
