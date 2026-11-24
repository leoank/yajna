//! Every worktree of a notebook (ADR-0039): the worktrees `git worktree list` gives for the
//! served checkout, each whose notebook root (the same path within it) has a `yajna.toml`,
//! served under `/w/<branch>/` exactly as the served checkout is at `/`, and listed with
//! how much is uncommitted in each by `/api/worktrees`.
//!
//! The crate does not know how to open a notebook: the CLI hands it a callback that makes
//! the `Config` of a worktree's notebook, called on the first request for it. The list is
//! read again when it is a few seconds old, and a worktree that went is dropped with
//! everything opened for it.

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Redirect, Response};
use axum::{Json, Router};
use serde::Serialize;

use crate::{App, Config};

/// Makes the configuration of the notebook at a worktree's notebook root, scoped to a
/// project when one is given (ADR-0043); run on a blocking thread.
pub type Open = Arc<dyn Fn(&Path, Option<&str>) -> Result<Config, String> + Send + Sync>;

/// How long a listing of the worktrees is used before git is asked again.
const FRESH: Duration = Duration::from_secs(3);

/// What a server needs to serve every worktree of the checkout it serves.
pub struct WorktreesConfig {
    /// the served checkout's notebook root (where its `yajna.toml` is)
    pub root: PathBuf,
    pub open: Open,
}

/// One worktree, as `/api/worktrees` lists it.
#[derive(Clone, Serialize, Debug, PartialEq)]
pub struct Worktree {
    /// its branch, or `@<short sha>` when detached
    pub name: String,
    pub branch: Option<String>,
    /// its notebook root
    pub path: PathBuf,
    pub head: Option<String>,
    /// the checkout this server was started in
    pub current: bool,
    /// where it is served, relative to the notebook's own address
    pub url: String,
}

pub(crate) struct Worktrees {
    pub(crate) root: PathBuf,
    pub(crate) open: Open,
    /// for the routers of other worktrees: the served checkout's write rules
    pub(crate) token: Option<String>,
    pub(crate) local: bool,
    listed: Mutex<Option<(Instant, Arc<Vec<Worktree>>)>>,
    routers: Mutex<HashMap<PathBuf, Router>>,
    /// a project's scope in a worktree (ADR-0043), by the worktree's path and the project
    pub(crate) scoped: Mutex<HashMap<(PathBuf, String), Router>>,
    pub(crate) projects: Mutex<Option<(Instant, Arc<Vec<crate::projects::Project>>)>>,
}

pub(crate) fn real(p: &Path) -> PathBuf {
    std::fs::canonicalize(p).unwrap_or_else(|_| p.to_path_buf())
}

/// A branch name in a URL segment: `/` and everything but unreserved characters escaped.
pub fn encode(name: &str) -> String {
    let mut out = String::new();
    for b in name.bytes() {
        if b.is_ascii_alphanumeric() || b"-._~@".contains(&b) {
            out.push(b as char);
        } else {
            out.push_str(&format!("%{b:02X}"));
        }
    }
    out
}

pub(crate) fn decode(seg: &str) -> Option<String> {
    let b = seg.as_bytes();
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

/// `git worktree list --porcelain` into worktrees whose notebook root, `prefix` within
/// them, has a `yajna.toml`; bare, prunable and missing ones are left out.
pub(crate) fn parse_list(raw: &str, prefix: &str, served: &Path) -> Vec<Worktree> {
    let served = real(served);
    let mut out = Vec::new();
    for block in raw.split("\n\n") {
        let mut path = None;
        let mut head = None;
        let mut branch = None;
        let mut skip = false;
        for line in block.lines() {
            let (key, value) = line.split_once(' ').unwrap_or((line, ""));
            match key {
                "worktree" => path = Some(PathBuf::from(value)),
                "HEAD" => head = Some(value.to_string()),
                "branch" => branch = Some(value.strip_prefix("refs/heads/").unwrap_or(value).to_string()),
                "bare" | "prunable" => skip = true,
                _ => {}
            }
        }
        let Some(path) = path.filter(|_| !skip) else { continue };
        let root = path.join(prefix.trim_end_matches('/'));
        if !root.join("yajna.toml").is_file() {
            continue;
        }
        let name = match (&branch, &head) {
            (Some(b), _) => b.clone(),
            (None, Some(h)) => format!("@{}", &h[..h.len().min(7)]),
            (None, None) => continue,
        };
        out.push(Worktree {
            url: format!("w/{}/", encode(&name)),
            current: real(&root) == served,
            name,
            branch,
            path: root,
            head,
        });
    }
    out
}

impl Worktrees {
    pub(crate) fn new(cfg: WorktreesConfig, token: Option<String>, local: bool) -> Self {
        Worktrees {
            root: cfg.root,
            open: cfg.open,
            token,
            local,
            listed: Mutex::new(None),
            routers: Mutex::new(HashMap::new()),
            scoped: Mutex::new(HashMap::new()),
            projects: Mutex::new(None),
        }
    }

    /// The worktrees, from git when the last listing is stale; blocking.
    pub(crate) fn list(&self) -> Result<Arc<Vec<Worktree>>, String> {
        if let Some((at, l)) = &*self.listed.lock().unwrap_or_else(|e| e.into_inner()) {
            if at.elapsed() < FRESH {
                return Ok(l.clone());
            }
        }
        let git = |args: &[&str]| -> Result<String, String> {
            let out = Command::new("git")
                .arg("-C")
                .arg(&self.root)
                .args(args)
                .env("GIT_OPTIONAL_LOCKS", "0")
                .output()
                .map_err(|e| format!("git: {e}"))?;
            if !out.status.success() {
                return Err(format!("git {}: {}", args.join(" "), String::from_utf8_lossy(&out.stderr).trim()));
            }
            Ok(String::from_utf8_lossy(&out.stdout).into_owned())
        };
        let list = match git(&["rev-parse", "--show-prefix"]) {
            Ok(prefix) => parse_list(&git(&["worktree", "list", "--porcelain"])?, prefix.trim(), &self.root),
            // not in git: the one checkout
            Err(_) => Vec::new(),
        };
        let list = Arc::new(list);
        // what was opened for a worktree that went goes with it
        let keep: Vec<PathBuf> = list.iter().map(|w| real(&w.path)).collect();
        self.routers.lock().unwrap_or_else(|e| e.into_inner()).retain(|p, _| keep.contains(p));
        self.scoped.lock().unwrap_or_else(|e| e.into_inner()).retain(|(p, _), _| keep.contains(p));
        *self.listed.lock().unwrap_or_else(|e| e.into_inner()) = Some((Instant::now(), list.clone()));
        Ok(list)
    }

    /// The worktrees with how many files are changed, staged and untracked in each; blocking.
    pub(crate) fn with_counts(&self) -> Result<Vec<serde_json::Value>, String> {
        Ok(self
            .list()?
            .iter()
            .map(|w| {
                let mut v = serde_json::to_value(w).unwrap_or_default();
                add_counts(&mut v, &w.path);
                v
            })
            .collect())
    }

    /// The router of the worktree named `name`, opened on first use; blocking.
    fn router(&self, name: &str) -> Result<Option<Router>, String> {
        let Some(w) = self.list()?.iter().find(|w| w.name == name).cloned() else {
            return Ok(None);
        };
        let key = real(&w.path);
        if let Some(r) = self.routers.lock().unwrap_or_else(|e| e.into_inner()).get(&key) {
            return Ok(Some(r.clone()));
        }
        let mut cfg = (self.open)(&w.path, None)?;
        cfg.token = self.token.clone();
        // a worktree's own server does not list worktrees again
        cfg.worktrees = None;
        let r = crate::router(App::new(cfg, self.local));
        self.routers.lock().unwrap_or_else(|e| e.into_inner()).insert(key, r.clone());
        Ok(Some(r))
    }
}

pub(crate) async fn list_handler(State(app): State<App>) -> Response {
    let Some(wt) = app.worktrees.clone() else {
        return (StatusCode::NOT_FOUND, Json(serde_json::json!({ "error": "this server serves its own checkout only ([serve] worktrees = \"this\")" })))
            .into_response();
    };
    match tokio::task::spawn_blocking(move || wt.with_counts()).await {
        Ok(Ok(list)) => Json(serde_json::json!({ "worktrees": list })).into_response(),
        Ok(Err(e)) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e }))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

/// `/w/<branch>/<rest>` to that worktree's router as `/<rest>`; `/w/<branch>` is
/// redirected to the slash form, which relative links in its pages need.
pub(crate) async fn dispatch(State(app): State<App>, req: Request) -> Response {
    let Some(wt) = app.worktrees.clone() else {
        return (StatusCode::NOT_FOUND, "this server serves its own checkout only\n").into_response();
    };
    // the raw path: a branch's `/` arrives as %2F and must not split it
    let path = req.uri().path().to_string();
    let Some(rest) = path.strip_prefix("/w/") else {
        return (StatusCode::NOT_FOUND, "no such page\n").into_response();
    };
    let (seg, inner) = match rest.find('/') {
        Some(i) => (&rest[..i], rest[i..].to_string()),
        None => {
            // relative to where it was asked for, so a /n/<namespace>/ prefix survives
            return Redirect::permanent(&format!("{seg}/", seg = rest)).into_response();
        }
    };
    let Some(name) = decode(seg) else {
        return (StatusCode::BAD_REQUEST, "a bad worktree name\n").into_response();
    };
    let found = {
        let name = name.clone();
        tokio::task::spawn_blocking(move || wt.router(&name)).await
    };
    let router = match found {
        Ok(Ok(Some(r))) => r,
        Ok(Ok(None)) => return (StatusCode::NOT_FOUND, format!("no worktree named {name}\n")).into_response(),
        Ok(Err(e)) => return (StatusCode::INTERNAL_SERVER_ERROR, format!("{name}: {e}\n")).into_response(),
        Err(e) => return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    };
    forward(router, req, inner).await
}

/// How many files are changed, staged, untracked and conflicted in the worktree at `path`,
/// added to its JSON; nothing when git cannot say.
pub(crate) fn add_counts(v: &mut serde_json::Value, path: &Path) {
    let counts = Command::new("git")
        .arg("-C")
        .arg(path)
        .args(["status", "--porcelain=v2", "-z", "--untracked-files=all"])
        .env("GIT_OPTIONAL_LOCKS", "0")
        .output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| crate::git::parse_status(&o.stdout));
    if let Some(s) = counts {
        v["changed"] = s.unstaged.len().into();
        v["staged"] = s.staged.len().into();
        v["untracked"] = s.untracked.len().into();
        v["conflicted"] = s.conflicted.len().into();
    }
}

/// `req` to `router` as a request for `inner`, its query kept.
pub(crate) async fn forward(router: Router, req: Request, inner: String) -> Response {
    use tower::ServiceExt;
    let inner = match req.uri().query() {
        Some(q) => format!("{inner}?{q}"),
        None => inner,
    };
    let uri: axum::http::Uri = match inner.parse() {
        Ok(uri) => uri,
        Err(_) => return (StatusCode::BAD_REQUEST, "a bad path\n").into_response(),
    };
    // a new request, not this one: its extensions hold the `/w/{*rest}` match, which the
    // worktree's own routes would take as one path parameter too many
    let (parts, body) = req.into_parts();
    let mut fresh = Request::new(body);
    *fresh.method_mut() = parts.method;
    *fresh.uri_mut() = uri;
    *fresh.version_mut() = parts.version;
    *fresh.headers_mut() = parts.headers;
    match router.oneshot(fresh).await {
        Ok(r) => r,
        Err(never) => match never {},
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn names_survive_a_url() {
        for n in ["main", "yajna/protocol-framework", "g2a/main", "@a1b2c3d", "a b+c%"] {
            assert_eq!(decode(&encode(n)).as_deref(), Some(n));
            assert!(!encode(n).contains('/'));
        }
        assert_eq!(encode("yajna/protocol-framework"), "yajna%2Fprotocol-framework");
        assert_eq!(decode("%zz"), None);
    }

    #[test]
    fn worktree_list_parsed() {
        let dir = std::env::temp_dir().join(format!("yajna-serve-wt-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        for w in ["main", "topic", "detached", "plain"] {
            std::fs::create_dir_all(dir.join(w).join("nb")).unwrap();
            if w != "plain" {
                std::fs::write(dir.join(w).join("nb/yajna.toml"), "").unwrap();
            }
        }
        let raw = format!(
            "worktree {d}/.bare\nbare\n\nworktree {d}/main\nHEAD aaaaaaaaaaaa\nbranch refs/heads/main\n\n\
worktree {d}/topic\nHEAD bbbbbbbbbbbb\nbranch refs/heads/lab/topic\n\n\
worktree {d}/detached\nHEAD ccccccccccccc\ndetached\n\n\
worktree {d}/plain\nHEAD dddd\nbranch refs/heads/plain\n\n\
worktree {d}/gone\nHEAD eeee\nbranch refs/heads/gone\nprunable gitdir file points to non-existent location\n",
            d = dir.display()
        );
        let l = parse_list(&raw, "nb/", &dir.join("topic/nb"));
        let got: Vec<(&str, bool, &str)> = l.iter().map(|w| (w.name.as_str(), w.current, w.url.as_str())).collect();
        assert_eq!(got, [("main", false, "w/main/"), ("lab/topic", true, "w/lab%2Ftopic/"), ("@ccccccc", false, "w/@ccccccc/")]);
        assert_eq!(l[1].path, dir.join("topic/nb"));
    }
}
