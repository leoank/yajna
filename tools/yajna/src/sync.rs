//! `yajna sync` (architecture 5.8, ADR-0011): pages marked
//! `sync: {provider: gdoc, mode: publish}` become Google Docs that are updated in place, and
//! the comments people leave there come back into the page under `## Review`. Ticking a
//! review item resolves its comment in the doc. `import` waits until publishing is routine.
//!
//! `mirror` pages publish the same way and their edits come back (architecture 5.8): a
//! mirror page is published only when it is committed, and the doc records that commit,
//! its revision after the upload and a hash of that revision's export in `appProperties`.
//! `yajna sync pull` carries what people changed in the doc onto the page as published
//! (`mirror.rs`) and three-way merges it with the page as it is now, leaving conflicts as
//! markers and nothing committed. `yajna sync` refuses to overwrite a doc with edits not
//! yet pulled.
//!
//! Docs mirror the notebook's folders under one root folder in Drive (ADR-0024): a page's
//! directory relative to the vault, or to the repo for a `[docs]` directory. Pages that
//! cite papers are rendered by pandoc's citeproc against the notebook's bibliography and
//! the page's own `bibliography`; pandoc is needed only for those.
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
use std::process::{Command, Stdio};
use std::sync::LazyLock;

use pulldown_cmark::{html, Options, Parser};
use regex::Regex;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};

use crate::init::edit_frontmatter;
use crate::mirror;
use crate::parallel::git;
use crate::refs;
use crate::site::esc;
use crate::vault::{
    map_outside_code, rel, split_frontmatter, without_code, Page, Res, Vault, LINK_RE, NS_ID_RE,
};

const SCOPE: &str = "https://www.googleapis.com/auth/drive.file";
const DOC_MIME: &str = "application/vnd.google-apps.document";
const FOLDER_MIME: &str = "application/vnd.google-apps.folder";
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

    fn patch_json(&self, path: &str, body: &Value) -> Res<Value> {
        let url = format!("{}{path}", self.base);
        reply(
            self.agent
                .patch(&url)
                .header("Authorization", &self.auth())
                .header("Content-Type", "application/json")
                .send(body.to_string()),
            &format!("PATCH {path}"),
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

    /// A text response: a path under the API, or a full URL (Drive's export links).
    fn get_text(&self, url: &str) -> Res<String> {
        let full = if url.starts_with("http") {
            url.to_string()
        } else {
            format!("{}{url}", self.base)
        };
        let what = format!("GET {}", url.split('?').next().unwrap_or(url));
        let mut resp = self
            .agent
            .get(&full)
            .header("Authorization", &self.auth())
            .call()
            .map_err(|e| format!("{what}: {e}"))?;
        let status = resp.status().as_u16();
        let text = resp
            .body_mut()
            .read_to_string()
            .map_err(|e| format!("{what}: {e}"))?;
        if status >= 400 {
            return Err(format!("{what}: HTTP {status}: {}", text.trim()));
        }
        Ok(text)
    }

    /// The doc as Markdown, as Drive exports it.
    fn export(&self, doc_id: &str) -> Res<String> {
        self.get_text(&format!(
            "/drive/v3/files/{doc_id}/export?mimeType=text%2Fmarkdown"
        ))
    }

    /// One revision of the doc as Markdown, through the revision's export link.
    fn revision_export(&self, doc_id: &str, rev: &str) -> Res<String> {
        let v = self.get(&format!(
            "/drive/v3/files/{doc_id}/revisions/{rev}?fields=exportLinks"
        ))?;
        let url = v["exportLinks"]["text/markdown"]
            .as_str()
            .ok_or_else(|| format!("revision {rev} of {doc_id} has no Markdown export"))?;
        self.get_text(url)
    }

    /// The doc's revisions, oldest first, with who made each.
    fn revisions(&self, doc_id: &str) -> Res<Vec<Value>> {
        let mut out = Vec::new();
        let mut page = String::new();
        loop {
            let mut path = format!(
                "/drive/v3/files/{doc_id}/revisions?pageSize=1000&fields={}",
                urlencode("revisions(id,lastModifyingUser(displayName)),nextPageToken")
            );
            if !page.is_empty() {
                path.push_str(&format!("&pageToken={}", urlencode(&page)));
            }
            let v = self.get(&path)?;
            out.extend(v["revisions"].as_array().cloned().unwrap_or_default());
            match v["nextPageToken"].as_str() {
                Some(t) if !t.is_empty() => page = t.to_string(),
                _ => return Ok(out),
            }
        }
    }

    fn last_revision(&self, doc_id: &str) -> Res<String> {
        self.revisions(doc_id)?
            .last()
            .and_then(|r| r["id"].as_str().map(str::to_string))
            .ok_or_else(|| format!("{doc_id} has no revisions"))
    }
}

// --- folders ------------------------------------------------------------------------------

/// Where a page's doc goes in Drive, as a path under the root folder: the page's directory
/// relative to the vault (so `notes/` is not part of it), or relative to the repo for a
/// page in a `[docs]` directory. Empty for the vault's top level.
pub fn drive_path(vault: &Vault, page: &Page) -> String {
    let dir = page.path.parent().unwrap_or(&vault.root);
    let rel_dir = dir
        .strip_prefix(&vault.notes)
        .or_else(|_| dir.strip_prefix(&vault.root))
        .unwrap_or(Path::new(""));
    rel_dir
        .components()
        .map(|c| c.as_os_str().to_string_lossy().to_string())
        .collect::<Vec<_>>()
        .join("/")
}

fn folder_url(id: &str) -> String {
    format!("https://drive.google.com/drive/folders/{id}")
}

fn shown(path: &str) -> &str {
    if path.is_empty() {
        "the root folder"
    } else {
        path
    }
}

/// The Drive folders that mirror the notebook's directories. They are found by the
/// `appProperties` yajna gives them, so every clone and worktree finds the same ones, and
/// created when missing; with the `drive.file` scope yajna sees only folders it made.
struct Folders<'a> {
    api: &'a Api,
    root: String,
    known: BTreeMap<String, String>,
}

impl<'a> Folders<'a> {
    /// The root is `[sync] folder` when set, else a folder named after the notebook's
    /// namespace that yajna creates once in My Drive and finds again by `yajna_notebook`.
    fn open(api: &'a Api, vault: &Vault) -> Res<Folders<'a>> {
        let mut f = Folders {
            api,
            root: String::new(),
            known: BTreeMap::new(),
        };
        f.root = match &vault.cfg.sync.folder {
            Some(id) => id.clone(),
            None => {
                let ns = vault
                    .cfg
                    .namespace
                    .clone()
                    .unwrap_or_else(|| "yajna".into());
                match f.find(&[("yajna_notebook", &ns)])? {
                    Some(id) => id,
                    None => {
                        let id = f.create(&ns, None, &[("yajna_notebook", &ns)])?;
                        println!(
                            "created the folder {ns} in My Drive for this notebook's docs; share it once with your readers: {}",
                            folder_url(&id)
                        );
                        id
                    }
                }
            }
        };
        Ok(f)
    }

    fn find(&self, props: &[(&str, &str)]) -> Res<Option<String>> {
        let mut q = format!("mimeType='{FOLDER_MIME}' and trashed=false");
        for (k, v) in props {
            let v = v.replace('\\', "\\\\").replace('\'', "\\'");
            q.push_str(&format!(
                " and appProperties has {{ key='{k}' and value='{v}' }}"
            ));
        }
        let v = self.api.get(&format!(
            "/drive/v3/files?q={}&fields=files(id)&spaces=drive",
            urlencode(&q)
        ))?;
        Ok(v["files"]
            .as_array()
            .and_then(|a| a.first())
            .and_then(|f| f["id"].as_str())
            .map(str::to_string))
    }

    fn create(&self, name: &str, parent: Option<&str>, props: &[(&str, &str)]) -> Res<String> {
        let app: serde_json::Map<String, Value> = props
            .iter()
            .map(|(k, v)| (k.to_string(), Value::String(v.to_string())))
            .collect();
        let mut meta = json!({"name": name, "mimeType": FOLDER_MIME, "appProperties": app});
        if let Some(p) = parent {
            meta["parents"] = json!([p]);
        }
        let v = self.api.post_json("/drive/v3/files?fields=id", &meta)?;
        v["id"]
            .as_str()
            .map(str::to_string)
            .ok_or_else(|| format!("create folder {name}: no id in the reply"))
    }

    /// The folder for `path` (`thesis/meetings`), made with its parents as needed.
    fn get(&mut self, path: &str) -> Res<String> {
        if path.is_empty() {
            return Ok(self.root.clone());
        }
        if let Some(id) = self.known.get(path) {
            return Ok(id.clone());
        }
        let (parent_path, name) = path.rsplit_once('/').unwrap_or(("", path));
        let parent = self.get(parent_path)?;
        let root = self.root.clone();
        let props = [("yajna_root", root.as_str()), ("yajna_path", path)];
        let id = match self.find(&props)? {
            Some(id) => id,
            None => self.create(name, Some(&parent), &props)?,
        };
        self.known.insert(path.to_string(), id.clone());
        Ok(id)
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

/// Whether a page cites papers, which sends it through pandoc.
fn cites(page: &Page) -> bool {
    !refs::citations(&without_code(&without_review(&page.body))).is_empty()
}

/// Markdown with citations to HTML through pandoc's citeproc, the reference list as the
/// last section. Pandoc's own markdown, with lists allowed straight after a paragraph as in
/// CommonMark; in-page citation links are left out because they do not survive the import.
fn pandoc_html(body: &str, bibs: &[PathBuf]) -> Res<String> {
    let mut cmd = Command::new(pandoc_on_path().ok_or_else(|| NO_PANDOC.to_string())?);
    cmd.args([
        "-f",
        "markdown+lists_without_preceding_blankline",
        "-t",
        "html5",
        "--wrap=none",
        "--citeproc",
    ]);
    // a .bib with Zotero's HTML marks goes to pandoc as a copy with LaTeX ones
    let mut copies = Vec::new();
    for (n, b) in bibs.iter().filter(|b| b.is_file()).enumerate() {
        let text = fs::read_to_string(b).map_err(|e| format!("{}: {e}", b.display()))?;
        let latex = latex_marks(&text);
        if latex == text {
            cmd.arg(format!("--bibliography={}", b.display()));
        } else {
            let copy = std::env::temp_dir().join(format!("yajna-{}-{n}.bib", std::process::id()));
            fs::write(&copy, latex).map_err(|e| e.to_string())?;
            cmd.arg(format!("--bibliography={}", copy.display()));
            copies.push(copy);
        }
    }
    let out = run_pandoc(cmd, body);
    for c in copies {
        let _ = fs::remove_file(c);
    }
    let html = out?
        .replace("<input type=\"checkbox\" checked=\"\" />", "☑ ")
        .replace("<input type=\"checkbox\" />", "☐ ");
    // Docs drops CSS classes on import, so the reference list's layout goes inline: each
    // entry a paragraph of its own with space after it. Docs also drops a negative
    // text-indent, so a hanging indent cannot be had; pandoc's wrapper div goes, because
    // Docs turns it into an empty paragraph.
    let html = CSL_ENTRY_RE.replace_all(
        &html,
        format!("<p style=\"{REFERENCE_STYLE}\">$entry</p>").as_str(),
    );
    Ok(REFS_DIV_RE.replace_all(&html, "$entries").into_owned())
}

const REFERENCE_STYLE: &str = "margin-top:0;margin-bottom:8pt;line-height:1.3;font-size:10pt";
static CSL_ENTRY_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#"(?s)<div id="ref-[^"]*" class="csl-entry"[^>]*>\s*(?P<entry>.*?)\s*</div>"#)
        .unwrap()
});
static REFS_DIV_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r#"(?s)<div id="refs"[^>]*>\s*(?P<entries>.*?)\s*</div>"#).unwrap()
});

/// Zotero writes rich text in titles as HTML: `<i>`, `<b>`, `<sup>`, `<sub>`, and
/// `<span class="nocase">` for words title case must leave alone. pandoc reads BibTeX
/// fields as LaTeX, where those tags would print literally, so they become LaTeX commands.
/// Every word inside is braced and the group ends in `{}`, which is what keeps citeproc's
/// title case off species and gene names.
fn latex_marks(bib: &str) -> String {
    static MARKS: LazyLock<Vec<(Regex, &str)>> = LazyLock::new(|| {
        [
            ("i", "\\emph"),
            ("b", "\\textbf"),
            ("sup", "\\textsuperscript"),
            ("sub", "\\textsubscript"),
        ]
        .into_iter()
        .map(|(tag, cmd)| {
            (
                Regex::new(&format!("(?s)<{tag}>(.*?)</{tag}>")).unwrap(),
                cmd,
            )
        })
        .chain([(
            Regex::new(r#"(?s)<span class="nocase">(.*?)</span>"#).unwrap(),
            "",
        )])
        .collect()
    });
    let protect = |s: &str| {
        let words: Vec<String> = s.split(' ').map(|w| format!("{{{w}}}")).collect();
        format!("{}{{}}", words.join(" "))
    };
    let mut out = bib.to_string();
    for (re, cmd) in MARKS.iter() {
        out = re
            .replace_all(&out, |c: &regex::Captures| {
                format!("{cmd}{{{}}}", protect(&c[1]))
            })
            .into_owned();
    }
    out
}

const NO_PANDOC: &str = "it cites papers, and rendering citations needs pandoc on PATH";

/// pandoc on PATH, looked up before spawning: under qemu-user a failed exec is not reported
/// to the parent, and the child exits 127 instead of the spawn failing as not found.
fn pandoc_on_path() -> Option<PathBuf> {
    std::env::split_paths(&std::env::var_os("PATH")?)
        .map(|dir| dir.join("pandoc"))
        .find(|p| p.is_file())
}

fn run_pandoc(mut cmd: Command, body: &str) -> Res<String> {
    let mut child = cmd
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| match e.kind() {
            std::io::ErrorKind::NotFound => NO_PANDOC.to_string(),
            _ => format!("pandoc: {e}"),
        })?;
    let input = format!(
        "{}\n\n## References\n\n::: {{#refs}}\n:::\n",
        body.trim_end()
    );
    child
        .stdin
        .take()
        .unwrap()
        .write_all(input.as_bytes())
        .map_err(|e| format!("pandoc: {e}"))?;
    let out = child
        .wait_with_output()
        .map_err(|e| format!("pandoc: {e}"))?;
    if !out.status.success() {
        let stderr = String::from_utf8_lossy(&out.stderr);
        let why = match stderr.trim() {
            "" => out.status.to_string(),
            s => s.to_string(),
        };
        return Err(format!("pandoc: {why}"));
    }
    Ok(String::from_utf8_lossy(&out.stdout).into_owned())
}

/// The HTML a doc is made from: a header with ID, title and status, then the body with
/// `[[links]]` to synced pages pointing at their docs, to the site when `[sync] site_url`
/// is set, and plain text otherwise. Citations are rendered when the page has any.
fn render(vault: &Vault, page: &Page, docs: &BTreeMap<String, String>) -> Res<String> {
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
    // Docs drops <input> on import, so a task's state becomes a character
    let html_body = if cites(page) {
        pandoc_html(&body, &refs::page_bibliographies(vault, page))?
    } else {
        let mut opts = Options::empty();
        opts.insert(Options::ENABLE_TABLES);
        opts.insert(Options::ENABLE_TASKLISTS);
        let mut html_body = String::new();
        html::push_html(&mut html_body, Parser::new_ext(&body, opts));
        html_body
            .replace(
                "<input disabled=\"\" type=\"checkbox\" checked=\"\"/>\n",
                "☑ ",
            )
            .replace("<input disabled=\"\" type=\"checkbox\"/>\n", "☐ ")
    };
    let id = page.id().unwrap_or("");
    let status = page.field("status").unwrap_or("");
    Ok(format!(
        "<html><head><meta charset=\"utf-8\"></head><body>\n<p><b>{}</b>{}{}</p>\n<h1>{}</h1>\n{html_body}</body></html>\n",
        esc(id),
        if status.is_empty() { String::new() } else { format!(" · {}", esc(status)) },
        if sync_field(page).map(|s| s.mode == "mirror").unwrap_or(false) {
            " · mirrored from the notebook; edits and comments here come back to it"
        } else {
            " · published from the notebook; comments here come back to it"
        },
        esc(page.field("title").unwrap_or(id))
    ))
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

/// Whether a page still has the conflict markers a pull left.
pub fn has_markers(body: &str) -> bool {
    without_code(body)
        .lines()
        .any(|l| l.starts_with("<<<<<<< ") || l.starts_with(">>>>>>> "))
}

/// The commit a mirror page is published at: HEAD, when what the doc shows of the page
/// (title, status, body without the review section) is committed there.
fn committed(vault: &Vault, page: &Page) -> Res<String> {
    let r = rel(&page.path, &vault.root).to_string();
    let head = git(&vault.root, &["rev-parse", "HEAD"]).map_err(|_| {
        "mirror pages publish only committed text, and this is not a git repository with commits"
            .to_string()
    })?;
    let text = git(&vault.root, &["show", &format!("HEAD:./{r}")])
        .map_err(|_| "it is not committed; mirror pages publish only committed text".to_string())?;
    let (meta, body) = split_frontmatter(&text);
    let field = |k: &str| {
        meta.as_ref()
            .and_then(|m| m.get(k))
            .and_then(|v| v.as_str())
            .map(str::to_string)
    };
    if without_review(&body).trim_end() != without_review(&page.body).trim_end()
        || field("title").as_deref() != page.field("title")
        || field("status").as_deref() != page.field("status")
    {
        return Err(
            "it has changes that are not committed; mirror pages publish only committed text"
                .into(),
        );
    }
    Ok(head)
}

pub fn cmd_sync(
    vault: &Vault,
    ids: &[String],
    dry_run: bool,
    no_comments: bool,
    overwrite: bool,
) -> Res<i32> {
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
        } else if s.mode != "publish" && s.mode != "mirror" {
            println!(
                "skip {r}: mode {} is not built yet (publish and mirror are)",
                s.mode
            );
        } else if has_markers(&p.body) {
            println!(
                "skip {r}: it has conflict markers from `yajna sync pull`; resolve them and commit"
            );
        } else if let Err(e) = if s.mode == "mirror" {
            committed(vault, &p)
        } else {
            Ok(String::new())
        } {
            println!("skip {r}: {e}");
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
            let pandoc = if cites(p) {
                ", citations through pandoc"
            } else {
                ""
            };
            let what = if s.mode == "mirror" {
                format!("{what} (mirror)")
            } else {
                what
            };
            println!(
                "{}: {what} in {}{pandoc}",
                rel(&p.path, &vault.root),
                shown(&drive_path(vault, p))
            );
        }
        return Ok(0);
    }
    let api = Api::new()?;
    let mut folders = Folders::open(&api, vault)?;

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
        let folder = folders.get(&drive_path(vault, page))?;
        let meta = json!({"name": title, "mimeType": DOC_MIME, "parents": [folder]});
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
    let (mut published, mut pulled, mut resolved, mut moved) = (0, 0, 0, 0);
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
        let mirror = s.mode == "mirror";
        if has_markers(&page.body) {
            println!(
                "skip {r}: it has conflict markers from `yajna sync pull`; resolve them and commit"
            );
            continue;
        }
        let commit = if mirror {
            match committed(vault, &page) {
                Ok(c) => Some(c),
                Err(e) => {
                    println!("skip {r}: {e}");
                    continue;
                }
            }
        } else {
            None
        };
        let html = match render(vault, &page, &docs) {
            Ok(h) => h,
            Err(e) => {
                println!("skip {r}: {e}");
                continue;
            }
        };
        let digest = hash(&html);
        let current = api.get(&format!(
            "/drive/v3/files/{doc}?fields=id,trashed,appProperties,parents"
        ))?;
        if current["trashed"].as_bool().unwrap_or(false) {
            println!(
                "{r}: the doc is in the trash; restore it or remove doc_id to publish a new one"
            );
            continue;
        }
        // a page that moved (or a doc from before folders) goes where the page is now
        let path = drive_path(vault, &page);
        let want = folders.get(&path)?;
        let parents: Vec<String> = current["parents"]
            .as_array()
            .map(|a| {
                a.iter()
                    .filter_map(|p| p.as_str().map(str::to_string))
                    .collect()
            })
            .unwrap_or_default();
        if !parents.contains(&want) {
            api.patch_json(
                &format!(
                    "/drive/v3/files/{doc}?addParents={want}&removeParents={}&fields=id",
                    urlencode(&parents.join(","))
                ),
                &json!({}),
            )?;
            moved += 1;
            println!("moved {r} -> {}", shown(&path));
        }
        let props = &current["appProperties"];
        let same = props["yajna_hash"].as_str() == Some(digest.as_str());
        if mirror {
            // edits in the doc since the publish must be in the page before they are
            // overwritten: taken by a pull, or their lines changed in the page since
            let links = mirror::Links {
                docs: docs.iter().map(|(p, d)| (d.clone(), p.clone())).collect(),
                site: vault.cfg.sync.site_url.clone(),
            };
            let id = page.id().unwrap_or("");
            let edits = doc_edits(&api, vault, &page, &doc, props, &links)?;
            let missing = match &edits {
                Edits::Unpublished | Edits::None => None,
                Edits::Unknown(why) => Some(why.clone()),
                Edits::Found(f) if f.theirs.changes == 0 => None,
                Edits::Found(f) => {
                    let m = mirror::merge3(
                        &without_review(&page.body),
                        &f.base,
                        &f.theirs.body,
                        ["", ""],
                    );
                    // lines changed on both sides count as resolved only once a pull
                    // has shown the doc's version of them
                    let seen = props["yajna_pulled"].as_str() == Some(f.now.as_str());
                    (m.theirs_only > 0 || (m.conflicts > 0 && !seen)).then(|| format!(
                        "the doc has edits that are not in the page; `yajna sync pull {id}` brings them in first (--overwrite discards them)"
                    ))
                }
            };
            if let (Some(why), false) = (missing, overwrite) {
                println!("skip {r}: {why}");
                continue;
            }
            if same && matches!(edits, Edits::None) {
                continue;
            }
        } else if same {
            continue;
        }
        let mut app = json!({"yajna_id": page.id().unwrap_or(""), "yajna_hash": digest});
        if let Some(c) = &commit {
            app["yajna_commit"] = c.clone().into();
        }
        let meta = json!({
            "name": format!("{} {}", page.id().unwrap_or(""), page.field("title").unwrap_or("")).trim(),
            "appProperties": app,
        });
        api.upload(Some(&doc), &meta, &html)?;
        if mirror {
            // what was published, for the next pull to tell edits from the export's own ways
            let rev = api.last_revision(&doc)?;
            let export = api.export(&doc)?;
            api.patch_json(
                &format!("/drive/v3/files/{doc}?fields=id"),
                &json!({"appProperties": {
                    "yajna_rev": rev,
                    "yajna_export": hash(&export),
                    "yajna_pulled": null,
                }}),
            )?;
        }
        published += 1;
        println!("published {r} -> {}", doc_url(&doc));
    }
    println!(
        "{} page(s) synced: {published} published, {pulled} new comment(s), {resolved} resolved in the doc, {moved} moved",
        work.len()
    );
    if published + pulled + resolved > 0 {
        println!("next: yajna validate, review the Review sections, and commit the pages");
    }
    Ok(0)
}

/// A file at a commit, exactly as it is there (`git` trims its output).
fn show(vault: &Vault, commit: &str, path: &str) -> Res<String> {
    let out = Command::new("git")
        .arg("-C")
        .arg(&vault.root)
        .args(["show", &format!("{commit}:./{path}")])
        .output()
        .map_err(|e| format!("git: {e}"))?;
    if !out.status.success() {
        return Err(String::from_utf8_lossy(&out.stderr).trim().to_string());
    }
    Ok(String::from_utf8_lossy(&out.stdout).into_owned())
}

/// A mirror page's text at the commit it was published at: at its path now, or, if it has
/// moved since, the file in that commit whose name starts with its ID.
fn text_at(vault: &Vault, commit: &str, page: &Page) -> Res<String> {
    let short = &commit[..commit.len().min(7)];
    if git(
        &vault.root,
        &["cat-file", "-e", &format!("{commit}^{{commit}}")],
    )
    .is_err()
    {
        return Err(format!(
            "it was published at commit {short}, which is not in this clone; fetch it first"
        ));
    }
    let r = rel(&page.path, &vault.root).to_string();
    if let Ok(t) = show(vault, commit, &r) {
        return Ok(t);
    }
    let id = page.id().unwrap_or("");
    let tree = git(&vault.root, &["ls-tree", "-r", "--name-only", commit])?;
    for path in tree.lines() {
        let named = path.split('/').any(|c| c.starts_with(id));
        if named && path.ends_with(".md") {
            let t = show(vault, commit, path)?;
            if split_frontmatter(&t)
                .0
                .and_then(|m| m.get("id").and_then(|v| v.as_str()).map(|s| s == id))
                .unwrap_or(false)
            {
                return Ok(t);
            }
        }
    }
    Err(format!("{id} is not in commit {short}"))
}

/// What a mirror doc holds beyond what yajna published.
enum Edits {
    /// never published as a mirror page
    Unpublished,
    /// no revision since the publish
    None,
    /// edited, but the edits cannot be told apart
    Unknown(String),
    Found(Found),
}

struct Found {
    /// the page body as published
    base: String,
    /// the page body as the doc has it
    theirs: mirror::Theirs,
    /// who edited the doc since the publish
    editors: Vec<String>,
    /// a hash of the doc's export now, which a pull records as `yajna_pulled`
    now: String,
}

/// The edits made in a mirror page's doc since yajna published it: the published
/// revision's export against the doc's now, carried onto the published source.
fn doc_edits(
    api: &Api,
    vault: &Vault,
    page: &Page,
    doc: &str,
    props: &Value,
    links: &mirror::Links,
) -> Res<Edits> {
    let (Some(rev), Some(commit), Some(export_hash)) = (
        props["yajna_rev"].as_str(),
        props["yajna_commit"].as_str(),
        props["yajna_export"].as_str(),
    ) else {
        return Ok(Edits::Unpublished);
    };
    let revs = api.revisions(doc)?;
    if revs.last().and_then(|v| v["id"].as_str()).unwrap_or(rev) == rev {
        return Ok(Edits::None);
    }
    let published = api.revision_export(doc, rev)?;
    if hash(&published) != export_hash {
        return Ok(Edits::Unknown(format!("Drive no longer has the revision as it was published (it merged later edits into it), so the edits cannot be told apart; compare the doc by hand, then `yajna sync {} --overwrite`", page.id().unwrap_or(""))));
    }
    let now = api.export(doc)?;
    let base_text = match text_at(vault, commit, page) {
        Ok(t) => t,
        Err(e) => return Ok(Edits::Unknown(e)),
    };
    let base = without_review(&split_frontmatter(&base_text).1);
    let cites = !refs::citations(&without_code(&base)).is_empty();
    let theirs = mirror::theirs(&base, &published, &now, cites, links);
    let rev_n: u64 = rev.parse().unwrap_or(0);
    let editors: BTreeSet<String> = revs
        .iter()
        .filter(|v| {
            v["id"]
                .as_str()
                .and_then(|i| i.parse::<u64>().ok())
                .map(|i| i > rev_n)
                .unwrap_or(true)
        })
        .filter_map(|v| {
            v["lastModifyingUser"]["displayName"]
                .as_str()
                .map(str::to_string)
        })
        .collect();
    Ok(Edits::Found(Found {
        base,
        theirs,
        editors: editors.into_iter().collect(),
        now: hash(&now),
    }))
}

/// `yajna sync pull`: edits made in the docs of mirror pages come into the pages as
/// uncommitted changes, merged with what changed in the repo since the publish.
pub fn cmd_pull(vault: &Vault, ids: &[String]) -> Res<i32> {
    let all = vault.pages()?;
    let pages: Vec<&Page> = all
        .iter()
        .filter(|p| {
            sync_field(p)
                .map(|s| s.mode == "mirror" && s.doc_id.is_some())
                .unwrap_or(false)
        })
        .filter(|p| ids.is_empty() || p.id().map(|i| ids.iter().any(|x| x == i)).unwrap_or(false))
        .collect();
    if pages.is_empty() {
        println!("no page has `sync: {{provider: gdoc, mode: mirror}}` and a doc yet; `yajna sync` publishes them first");
        return Ok(0);
    }
    let api = Api::new()?;
    let links = mirror::Links {
        docs: all
            .iter()
            .filter_map(|p| Some((sync_field(p)?.doc_id?, p.id()?.to_string())))
            .collect(),
        site: vault.cfg.sync.site_url.clone(),
    };
    let (mut pulled, mut conflicts) = (0, 0);
    for page in pages {
        let r = rel(&page.path, &vault.root).to_string();
        let id = page.id().unwrap_or("");
        let doc = sync_field(page).unwrap().doc_id.unwrap();
        if has_markers(&page.body) {
            println!("skip {r}: resolve the conflict markers from the last pull first");
            continue;
        }
        let current = api.get(&format!("/drive/v3/files/{doc}?fields=appProperties"))?;
        let found = match doc_edits(&api, vault, page, &doc, &current["appProperties"], &links)? {
            Edits::Unpublished => {
                println!(
                    "skip {r}: not published as a mirror page yet; `yajna sync {id}` does that"
                );
                continue;
            }
            Edits::None => {
                println!("{r}: no edits in the doc to pull");
                continue;
            }
            Edits::Unknown(why) => {
                println!("skip {r}: {why}");
                continue;
            }
            Edits::Found(f) => f,
        };
        let theirs = &found.theirs;
        if let Some(t) = &theirs.title {
            println!("{r}: the title was changed in the doc to \"{t}\"; titles live in the frontmatter, so change it there if it should stay");
        }
        let by = if found.editors.is_empty() {
            String::new()
        } else {
            format!(" by {}", found.editors.join(", "))
        };
        if theirs.changes == 0 {
            println!("{r}: the doc changed{by} only in ways the page does not keep (formatting)");
            continue;
        }
        let ours = without_review(&page.body);
        let m = mirror::merge3(&ours, &found.base, &theirs.body, ["this page", "the doc"]);
        if m.conflicts == 0 && m.theirs_only == 0 {
            println!("{r}: the doc's edits{by} are already in the page");
            continue;
        }
        // the page around the merged body: its frontmatter and its review section, untouched
        let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
        let fm = &text[..text.len() - page.body.len()];
        let review = find_section(&page.body)
            .map(|(s, e)| &page.body[s..e])
            .unwrap_or("");
        let mut body = m.text;
        if !review.is_empty() {
            if !body.ends_with("\n\n") {
                body.push('\n');
            }
            body.push_str(review);
        }
        let new_text = format!("{fm}{body}");
        if new_text != text {
            fs::write(&page.path, &new_text).map_err(|e| e.to_string())?;
        }
        // the doc as pulled: its version of lines changed on both sides has been seen
        api.patch_json(
            &format!("/drive/v3/files/{doc}?fields=id"),
            &json!({"appProperties": {"yajna_pulled": found.now}}),
        )?;
        let n = m.conflicts;
        pulled += 1;
        conflicts += n;
        println!(
            "pulled {r}: {} edited line(s) from the doc{by}{}{}",
            theirs.changes,
            if n > 0 {
                format!(", {n} conflict(s) left as markers")
            } else {
                String::new()
            },
            if theirs.approximate > 0 {
                format!(
                    "; {} touched citations or code the doc does not keep, taken as the doc has them",
                    theirs.approximate
                )
            } else {
                String::new()
            }
        );
    }
    if pulled > 0 {
        println!(
            "next: review with git diff{}, commit, then yajna sync publishes the result",
            if conflicts > 0 {
                ", resolve the conflict markers"
            } else {
                ""
            }
        );
    }
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zotero_html_marks_become_case_protected_latex() {
        assert_eq!(
            latex_marks("title={Stalks in <i>Caulobacter crescentus</i> and Ca<sup>2+</sup>},"),
            "title={Stalks in \\emph{{Caulobacter} {crescentus}{}} and Ca\\textsuperscript{{2+}{}}},"
        );
        assert_eq!(
            latex_marks(r#"title={A <span class="nocase">pH</span> sensor},"#),
            "title={A {{pH}{}} sensor},"
        );
        assert_eq!(latex_marks("title={Plain},"), "title={Plain},");
    }

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
