//! The review routes of the files viewer (ADR-0030, `docs/review.md` 7.2): reading REV
//! pages and their diffs always, writing to them only when `yajna serve --review` gave the
//! server a token.
//!
//! The crate does not know what a review is: the CLI hands it a [`Reviews`] that reads and
//! writes the pages, and this module does HTTP and the checks on who may write. A write
//! must carry the token in `X-Yajna-Token` and an `Origin` naming the host it was sent to,
//! so neither another page in the browser nor a request without the printed URL can
//! write; the rest of the server stays read-only (ADR-0028).

use axum::extract::{Path, Query, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::Value;

use crate::App;

/// What a write can fail with.
pub enum WriteError {
    /// the page changed since the version the viewer last read
    Conflict(String),
    /// the write itself is refused (an agent resolving, a thread that does not exist)
    Refused(String),
}

/// The notebook side of reviews, implemented by the CLI. Every method runs on a blocking
/// thread.
pub trait Reviews: Send + Sync {
    /// the reviews of every worktree: a JSON array
    fn list(&self) -> Result<Value, String>;
    /// one review with its threads, changed files and `version`
    fn get(&self, id: &str) -> Result<Value, String>;
    /// a changed file at the review's base (`old`, when renamed) and head, or `between` two
    /// commits the review names (a round, a fix); with `work`, a file not in the review
    /// yet, at the head and as it is in the working tree
    fn file(
        &self,
        id: &str,
        path: &str,
        old: Option<&str>,
        work: bool,
        between: Option<(&str, &str)>,
    ) -> Result<Value, String>;
    /// `action` (comment, reply, address, resolve, reopen, approve, request-changes) with
    /// its fields in `body`, refused unless `body.version` is the page's current version;
    /// the review as it is afterwards
    fn write(&self, id: &str, action: &str, body: &Value) -> Result<Value, WriteError>;
}

/// Who may write: the token the server printed, and the server itself as the origin.
pub(crate) fn may_write(
    token: Option<&str>,
    headers: &HeaderMap,
) -> Result<(), (StatusCode, String)> {
    let forbidden = |m: &str| Err((StatusCode::FORBIDDEN, m.to_string()));
    let Some(token) = token else {
        return forbidden(
            "this server is read-only; start it with yajna serve --review to comment",
        );
    };
    let given = headers
        .get("x-yajna-token")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    // compared in full whatever the first difference, so the time taken says nothing
    let same = given.len() == token.len()
        && given
            .bytes()
            .zip(token.bytes())
            .fold(0u8, |acc, (a, b)| acc | (a ^ b))
            == 0;
    if !same {
        return forbidden("no valid token: open the URL yajna serve --review printed");
    }
    let host = headers.get(header::HOST).and_then(|h| h.to_str().ok());
    let origin = headers.get(header::ORIGIN).and_then(|h| h.to_str().ok());
    match (host, origin) {
        (Some(h), Some(o)) if o == format!("http://{h}") || o == format!("https://{h}") => Ok(()),
        _ => forbidden("a write must come from the viewer this server serves"),
    }
}

fn error(status: StatusCode, msg: impl Into<String>) -> Response {
    (status, Json(serde_json::json!({ "error": msg.into() }))).into_response()
}

fn no_reviews() -> Response {
    error(StatusCode::NOT_FOUND, "reviews are not served here")
}

/// Run `f` on a blocking thread and answer with its JSON.
async fn blocking(f: impl FnOnce() -> Result<Value, String> + Send + 'static) -> Response {
    match tokio::task::spawn_blocking(f).await {
        Ok(Ok(v)) => Json(v).into_response(),
        Ok(Err(e)) => error(StatusCode::NOT_FOUND, e),
        Err(e) => error(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

pub(crate) async fn list_handler(State(app): State<App>) -> Response {
    let Some(r) = app.reviews.clone() else {
        return no_reviews();
    };
    blocking(move || r.list()).await
}

pub(crate) async fn get_handler(State(app): State<App>, Path(id): Path<String>) -> Response {
    let Some(r) = app.reviews.clone() else {
        return no_reviews();
    };
    blocking(move || r.get(&id)).await
}

#[derive(serde::Deserialize)]
pub(crate) struct FileQuery {
    path: String,
    old: Option<String>,
    #[serde(default)]
    work: bool,
    from: Option<String>,
    to: Option<String>,
}

pub(crate) async fn file_handler(
    State(app): State<App>,
    Path(id): Path<String>,
    Query(q): Query<FileQuery>,
) -> Response {
    let Some(r) = app.reviews.clone() else {
        return no_reviews();
    };
    blocking(move || {
        let between = q.from.as_deref().zip(q.to.as_deref());
        r.file(&id, &q.path, q.old.as_deref(), q.work, between)
    })
    .await
}

pub(crate) async fn write_handler(
    State(app): State<App>,
    Path((id, action)): Path<(String, String)>,
    headers: HeaderMap,
    Json(body): Json<Value>,
) -> Response {
    if let Err((status, msg)) = may_write(app.token.as_deref(), &headers) {
        return error(status, msg);
    }
    let Some(r) = app.reviews.clone() else {
        return no_reviews();
    };
    match tokio::task::spawn_blocking(move || r.write(&id, &action, &body)).await {
        Ok(Ok(v)) => Json(v).into_response(),
        Ok(Err(WriteError::Conflict(m))) => error(StatusCode::CONFLICT, m),
        Ok(Err(WriteError::Refused(m))) => error(StatusCode::UNPROCESSABLE_ENTITY, m),
        Err(e) => error(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::HeaderValue;
    use std::sync::Arc;

    /// A review store whose page is at version `v1`.
    struct Fake;

    impl Reviews for Fake {
        fn list(&self) -> Result<Value, String> {
            Ok(serde_json::json!([]))
        }
        fn get(&self, id: &str) -> Result<Value, String> {
            Ok(serde_json::json!({ "id": id, "version": "v1" }))
        }
        fn file(
            &self,
            _: &str,
            _: &str,
            _: Option<&str>,
            _: bool,
            _: Option<(&str, &str)>,
        ) -> Result<Value, String> {
            Ok(Value::Null)
        }
        fn write(&self, id: &str, _: &str, body: &Value) -> Result<Value, WriteError> {
            if body["version"] != "v1" {
                return Err(WriteError::Conflict(format!("{id} changed meanwhile")));
            }
            Ok(serde_json::json!({ "id": id, "version": "v2" }))
        }
    }

    fn app(token: Option<&str>) -> App {
        App {
            site: Arc::default(),
            refresh: Arc::new(|| Ok(())),
            hosts: Arc::default(),
            roots: Arc::default(),
            cache: Arc::default(),
            render: Arc::new(|_| Err(String::new())),
            notebook: Arc::default(),
            version: Arc::default(),
            reviews: Some(Arc::new(Fake)),
            token: Arc::new(token.map(str::to_string)),
        }
    }

    fn headers(token: Option<&str>, origin: Option<&str>) -> HeaderMap {
        let mut h = HeaderMap::new();
        h.insert(header::HOST, HeaderValue::from_static("localhost:8765"));
        if let Some(t) = token {
            h.insert("x-yajna-token", HeaderValue::from_str(t).unwrap());
        }
        if let Some(o) = origin {
            h.insert(header::ORIGIN, HeaderValue::from_str(o).unwrap());
        }
        h
    }

    async fn post(app: App, h: HeaderMap, version: &str) -> StatusCode {
        write_handler(
            State(app),
            Path(("REV-1".to_string(), "reply".to_string())),
            h,
            Json(serde_json::json!({ "version": version, "thread": "T1", "text": "x" })),
        )
        .await
        .status()
    }

    #[tokio::test]
    async fn writes_need_the_token_the_origin_and_the_current_version() {
        let ok = Some("http://localhost:8765");
        // without --review nothing is written
        assert_eq!(
            post(app(None), headers(Some("t0k"), ok), "v1").await,
            StatusCode::FORBIDDEN
        );
        // a wrong or missing token, or another origin
        assert_eq!(
            post(app(Some("t0k")), headers(Some("t0x"), ok), "v1").await,
            StatusCode::FORBIDDEN
        );
        assert_eq!(
            post(app(Some("t0k")), headers(None, ok), "v1").await,
            StatusCode::FORBIDDEN
        );
        assert_eq!(
            post(
                app(Some("t0k")),
                headers(Some("t0k"), Some("http://evil.example")),
                "v1"
            )
            .await,
            StatusCode::FORBIDDEN
        );
        assert_eq!(
            post(app(Some("t0k")), headers(Some("t0k"), None), "v1").await,
            StatusCode::FORBIDDEN
        );
        // a page that changed since it was read is not written over
        assert_eq!(
            post(app(Some("t0k")), headers(Some("t0k"), ok), "v0").await,
            StatusCode::CONFLICT
        );
        assert_eq!(
            post(app(Some("t0k")), headers(Some("t0k"), ok), "v1").await,
            StatusCode::OK
        );
        // a tunnel's https origin for the same host
        assert_eq!(
            post(
                app(Some("t0k")),
                headers(Some("t0k"), Some("https://localhost:8765")),
                "v1"
            )
            .await,
            StatusCode::OK
        );
        // reading needs nothing
        let res = get_handler(State(app(None)), Path("REV-1".to_string())).await;
        assert_eq!(res.status(), StatusCode::OK);
    }
}
