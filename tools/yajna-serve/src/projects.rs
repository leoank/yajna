//! A lab's projects as scopes (ADR-0043): `/api/projects` lists them with the worktrees
//! each is worked on in, and `/project/<slug>/…` serves the app for one project from its
//! home worktree (`/project/<slug>/w/<branch>/…` from another of its worktrees), every API
//! answering for that project.
//!
//! A project's worktrees are those on a branch `<slug>/…`, the name `yajna worktree`
//! gives them. Its home is the one on `<slug>/main`, else the one committed to last, else
//! the served checkout.

use std::path::Path;
use std::process::Command;
use std::sync::Arc;
use std::time::{Duration, Instant};

use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Redirect, Response};
use axum::{Json, Router};
use serde::Deserialize;

use crate::pages::{Elsewhere, Pages};
use crate::worktrees::{add_counts, decode, encode, forward, real, Worktree, Worktrees};
use crate::App;

/// How long the list of projects is used before the notebook is asked again.
const FRESH: Duration = Duration::from_secs(3);

#[derive(Clone, Debug, Deserialize)]
pub(crate) struct Project {
    pub id: String,
    pub slug: String,
    #[serde(default)]
    pub title: String,
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub folders: serde_json::Value,
}

fn git(root: &Path, args: &[&str]) -> Option<String> {
    let out = Command::new("git")
        .arg("-C")
        .arg(root)
        .args(args)
        .env("GIT_OPTIONAL_LOCKS", "0")
        .output()
        .ok()
        .filter(|o| o.status.success())?;
    Some(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

/// Whether worktree `w` is one of the project `slug`'s.
fn of(slug: &str, w: &Worktree) -> bool {
    w.branch.as_deref().is_some_and(|b| b.strip_prefix(slug).is_some_and(|r| r.starts_with('/')))
}

impl Worktrees {
    /// The lab's projects, from the served checkout's pages when the last answer is stale.
    pub(crate) fn projects(&self, pages: &dyn Pages) -> Result<Arc<Vec<Project>>, String> {
        if let Some((at, l)) = &*self.projects.lock().unwrap_or_else(|e| e.into_inner()) {
            if at.elapsed() < FRESH {
                return Ok(l.clone());
            }
        }
        let list: Vec<Project> = serde_json::from_value(pages.projects()?).map_err(|e| format!("projects: {e}"))?;
        let list = Arc::new(list);
        *self.projects.lock().unwrap_or_else(|e| e.into_inner()) = Some((Instant::now(), list.clone()));
        Ok(list)
    }

    /// The worktree a project is shown from by default: `<slug>/main`, else the one of its
    /// worktrees committed to last; `None` when it has none.
    fn home<'a>(&self, slug: &str, list: &'a [Worktree]) -> Option<&'a Worktree> {
        let mine: Vec<&Worktree> = list.iter().filter(|w| of(slug, w)).collect();
        if let Some(w) = mine.iter().find(|w| w.branch.as_deref() == Some(&format!("{slug}/main"))) {
            return Some(w);
        }
        mine.into_iter().max_by_key(|w| {
            w.head
                .as_deref()
                .and_then(|h| git(&self.root, &["log", "-1", "--format=%ct", h]))
                .and_then(|t| t.parse::<i64>().ok())
                .unwrap_or(0)
        })
    }

    /// Each project whose home is not the served checkout, for the views of *All
    /// projects*; blocking. Nothing when the notebook cannot say.
    pub(crate) fn elsewhere(&self, pages: &dyn Pages) -> Vec<Elsewhere> {
        let (Ok(projects), Ok(list)) = (self.projects(pages), self.list()) else {
            return Vec::new();
        };
        projects
            .iter()
            .filter_map(|p| {
                let w = self.home(&p.slug, &list).filter(|w| !w.current)?;
                Some(Elsewhere { root: w.path.clone(), project: p.id.clone(), slug: p.slug.clone(), worktree: w.name.clone() })
            })
            .collect()
    }

    /// `/api/projects`: each project with its folders, its worktrees (with what is
    /// uncommitted in each and how many commits each is ahead of the served checkout), its
    /// home, and the worktrees that belong to no project; blocking.
    fn listing(&self, pages: &dyn Pages) -> Result<serde_json::Value, String> {
        let projects = self.projects(pages)?;
        let list = self.list()?;
        let here = list.iter().find(|w| w.current).and_then(|w| w.head.clone());
        let worktree = |w: &Worktree, url: String| {
            let mut v = serde_json::to_value(w).unwrap_or_default();
            v["url"] = url.into();
            add_counts(&mut v, &w.path);
            if let (Some(a), Some(b)) = (&here, &w.head) {
                if a != b {
                    let n = git(&self.root, &["rev-list", "--count", &format!("{a}..{b}")]).and_then(|n| n.parse::<u64>().ok());
                    v["ahead"] = n.into();
                }
            }
            v
        };
        let mut claimed = Vec::new();
        let out: Vec<serde_json::Value> = projects
            .iter()
            .map(|p| {
                let home = self.home(&p.slug, &list);
                let base = format!("project/{}/", encode(&p.slug));
                let wts: Vec<serde_json::Value> = list
                    .iter()
                    .filter(|w| of(&p.slug, w))
                    .map(|w| {
                        claimed.push(w.name.clone());
                        let url = if Some(w) == home { base.clone() } else { format!("{base}w/{}/", encode(&w.name)) };
                        let mut v = worktree(w, url);
                        v["home"] = (Some(w) == home).into();
                        v
                    })
                    .collect();
                serde_json::json!({
                    "id": p.id,
                    "slug": p.slug,
                    "title": p.title,
                    "status": p.status,
                    "folders": p.folders,
                    "url": base,
                    "home": home.map(|w| w.name.clone()),
                    "worktrees": wts,
                })
            })
            .collect();
        let others: Vec<serde_json::Value> = list
            .iter()
            .filter(|w| !w.current && !claimed.contains(&w.name))
            .map(|w| worktree(w, w.url.clone()))
            .collect();
        Ok(serde_json::json!({ "projects": out, "others": others }))
    }

    /// The router of project `slug` in its home worktree, or in the worktree named
    /// `branch` when that is one of the project's (or the served checkout); opened on first
    /// use; blocking.
    fn scoped_router(&self, pages: &dyn Pages, slug: &str, branch: Option<&str>) -> Result<Option<Router>, String> {
        let Some(p) = self.projects(pages)?.iter().find(|p| p.slug == slug).cloned() else {
            return Ok(None);
        };
        let list = self.list()?;
        let w = match branch {
            Some(b) => list.iter().find(|w| w.name == b && (of(slug, w) || w.current)),
            None => self.home(slug, &list).or_else(|| list.iter().find(|w| w.current)),
        };
        let Some(w) = w.cloned() else { return Ok(None) };
        let key = (real(&w.path), p.id.clone());
        if let Some(r) = self.scoped.lock().unwrap_or_else(|e| e.into_inner()).get(&key) {
            return Ok(Some(r.clone()));
        }
        let mut cfg = (self.open)(&w.path, Some(&p.id))?;
        cfg.token = self.token.clone();
        cfg.worktrees = None;
        let r = crate::router(App::new(cfg, self.local));
        self.scoped.lock().unwrap_or_else(|e| e.into_inner()).insert(key, r.clone());
        Ok(Some(r))
    }
}

fn not_served() -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(serde_json::json!({ "error": "project scopes need every worktree served ([serve] worktrees = \"all\") and a lab notebook" })),
    )
        .into_response()
}

pub(crate) async fn list_handler(State(app): State<App>) -> Response {
    let (Some(wt), Some(pages)) = (app.worktrees.clone(), app.pages.clone()) else {
        return not_served();
    };
    match tokio::task::spawn_blocking(move || wt.listing(pages.as_ref())).await {
        Ok(Ok(v)) => Json(v).into_response(),
        Ok(Err(e)) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e }))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

/// `/project/<slug>/<rest>` and `/project/<slug>/w/<branch>/<rest>` to the project's
/// scoped router as `/<rest>`; the forms without the last slash are redirected to it.
pub(crate) async fn dispatch(State(app): State<App>, req: Request) -> Response {
    let (Some(wt), Some(pages)) = (app.worktrees.clone(), app.pages.clone()) else {
        return not_served();
    };
    let path = req.uri().path().to_string();
    let Some(rest) = path.strip_prefix("/project/") else {
        return (StatusCode::NOT_FOUND, "no such page\n").into_response();
    };
    let Some(i) = rest.find('/') else {
        return Redirect::permanent(&format!("{rest}/")).into_response();
    };
    let (seg, mut inner) = (&rest[..i], rest[i..].to_string());
    let Some(slug) = decode(seg) else {
        return (StatusCode::BAD_REQUEST, "a bad project name\n").into_response();
    };
    let mut branch = None;
    if let Some(w) = inner.strip_prefix("/w/") {
        let Some(j) = w.find('/') else {
            return Redirect::permanent(&format!("{w}/")).into_response();
        };
        let Some(b) = decode(&w[..j]) else {
            return (StatusCode::BAD_REQUEST, "a bad worktree name\n").into_response();
        };
        branch = Some(b);
        inner = w[j..].to_string();
    }
    let found = {
        let (slug, branch) = (slug.clone(), branch.clone());
        tokio::task::spawn_blocking(move || wt.scoped_router(pages.as_ref(), &slug, branch.as_deref())).await
    };
    match found {
        Ok(Ok(Some(r))) => forward(r, req, inner).await,
        Ok(Ok(None)) => (StatusCode::NOT_FOUND, format!("no project {slug}{}\n", branch.map(|b| format!(" in {b}")).unwrap_or_default())).into_response(),
        Ok(Err(e)) => (StatusCode::INTERNAL_SERVER_ERROR, format!("{slug}: {e}\n")).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
