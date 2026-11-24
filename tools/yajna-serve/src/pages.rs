//! The JSON API of the notebook's pages that the web app reads (ADR-0041): the overview,
//! pages by type or project, one page with its fields, rendered body, children and
//! backlinks, the log, the tasks, and search across them.
//!
//! The crate does not know what a page is: the CLI hands it a [`Pages`] that answers from
//! the notebook's index, and this module does HTTP. Everything here is read-only.

use axum::extract::{Path, Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Deserialize;
use serde_json::Value;

use crate::App;

/// A project's own worktree, read by the views of *All projects* so they show its current
/// state rather than the served checkout's copy (ADR-0043).
#[derive(Clone, Debug)]
pub struct Elsewhere {
    /// the worktree's notebook root
    pub root: std::path::PathBuf,
    /// the project's ID and slug
    pub project: String,
    pub slug: String,
    /// the worktree's name, its branch
    pub worktree: String,
}

/// The notebook side of the pages, implemented by the CLI. Every method runs on a blocking
/// thread and answers JSON in the shapes `docs/files-viewer.md` 5.2 gives.
pub trait Pages: Send + Sync {
    /// the notebook: its name and shape, its projects with their progress, how many pages
    /// of each type it has, the latest log lines; each project in `elsewhere` counted, and
    /// its lines read, from its own worktree
    fn overview(&self, elsewhere: &[Elsewhere]) -> Result<Value, String>;
    /// pages of a type, or of a project, or both; newest first
    fn list(&self, kind: Option<&str>, project: Option<&str>) -> Result<Value, String>;
    /// one page, `None` when no page has that ID
    fn page(&self, id: &str) -> Result<Option<Value>, String>;
    /// log lines newest first, `limit` of them after skipping `skip`, with the lines of
    /// each project in `elsewhere` from its own worktree merged in
    fn log(&self, skip: usize, limit: usize, elsewhere: &[Elsewhere]) -> Result<Value, String>;
    /// the checkboxes of the notebook, open ones, or all with `done`
    fn tasks(&self, done: bool) -> Result<Value, String>;
    /// the pages and log lines with every word of `q` in them, the best `limit` pages
    /// first, each with the passage of its text where the words are
    fn search(&self, q: &str, limit: usize) -> Result<Value, String>;
    /// a lab's projects: `[{id, slug, title, status, folders: [{label, path}]}]`, the
    /// folders as paths in the files view; empty in a `project` notebook (ADR-0043)
    fn projects(&self) -> Result<Value, String>;
}

fn error(status: StatusCode, msg: impl Into<String>) -> Response {
    (status, Json(serde_json::json!({ "error": msg.into() }))).into_response()
}

async fn answer(app: App, f: impl FnOnce(&dyn Pages) -> Result<Option<Value>, String> + Send + 'static) -> Response {
    let Some(p) = app.pages.clone() else {
        return error(StatusCode::NOT_FOUND, "this server has no notebook pages");
    };
    match tokio::task::spawn_blocking(move || f(p.as_ref())).await {
        Ok(Ok(Some(v))) => Json(v).into_response(),
        Ok(Ok(None)) => error(StatusCode::NOT_FOUND, "no such page"),
        Ok(Err(e)) => error(StatusCode::INTERNAL_SERVER_ERROR, e),
        Err(e) => error(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

pub(crate) async fn overview_handler(State(app): State<App>) -> Response {
    let wt = app.worktrees.clone();
    answer(app, move |p| {
        let elsewhere = wt.map(|w| w.elsewhere(p)).unwrap_or_default();
        p.overview(&elsewhere).map(Some)
    })
    .await
}

#[derive(Deserialize)]
pub(crate) struct ListQuery {
    #[serde(rename = "type")]
    kind: Option<String>,
    project: Option<String>,
}

pub(crate) async fn list_handler(State(app): State<App>, Query(q): Query<ListQuery>) -> Response {
    answer(app, move |p| p.list(q.kind.as_deref(), q.project.as_deref()).map(Some)).await
}

pub(crate) async fn page_handler(State(app): State<App>, Path(id): Path<String>) -> Response {
    answer(app, move |p| p.page(&id)).await
}

#[derive(Deserialize)]
pub(crate) struct LogQuery {
    skip: Option<usize>,
    limit: Option<usize>,
}

pub(crate) async fn log_handler(State(app): State<App>, Query(q): Query<LogQuery>) -> Response {
    let (skip, limit) = (q.skip.unwrap_or(0), q.limit.unwrap_or(100).clamp(1, 500));
    let wt = app.worktrees.clone();
    answer(app, move |p| {
        let elsewhere = wt.map(|w| w.elsewhere(p)).unwrap_or_default();
        p.log(skip, limit, &elsewhere).map(Some)
    })
    .await
}

#[derive(Deserialize)]
pub(crate) struct TasksQuery {
    done: Option<bool>,
}

#[derive(Deserialize)]
pub(crate) struct SearchQuery {
    q: Option<String>,
    limit: Option<usize>,
}

pub(crate) async fn search_handler(State(app): State<App>, Query(q): Query<SearchQuery>) -> Response {
    let (text, limit) = (q.q.unwrap_or_default(), q.limit.unwrap_or(50).clamp(1, 200));
    answer(app, move |p| p.search(&text, limit).map(Some)).await
}

pub(crate) async fn tasks_handler(State(app): State<App>, Query(q): Query<TasksQuery>) -> Response {
    answer(app, move |p| p.tasks(q.done.unwrap_or(false)).map(Some)).await
}
