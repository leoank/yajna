//! The server behind `yajna serve` (ADR-0027): the rendered site, brought up to date
//! before a page is served, and the read-only file API of the files viewer (ADR-0028), on
//! a loopback address only (`docs/files-viewer.md`).
//!
//! The crate knows HTTP and files, not the notebook: the CLI hands it the site directory,
//! a callback that re-renders the site when a page changed, and the roots.

pub mod files;

use std::net::{Ipv4Addr, SocketAddr};
use std::path::PathBuf;
use std::sync::Arc;

use axum::body::Body;
use axum::extract::{Path, Request, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::middleware::{self, Next};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::Router;

/// Re-renders the site if a page changed since the last render; called before every page
/// request, from a blocking thread.
pub type Refresh = Arc<dyn Fn() -> Result<(), String> + Send + Sync>;

pub struct Config {
    /// the rendered static site
    pub site: PathBuf,
    pub refresh: Refresh,
    /// 0 picks a free port
    pub port: u16,
    /// `Host` names accepted besides the loopback ones, for a tunnel such as
    /// `tailscale serve`
    pub hosts: Vec<String>,
    /// what the files viewer shows
    pub roots: Vec<files::Root>,
}

#[derive(Clone)]
pub(crate) struct App {
    site: Arc<PathBuf>,
    refresh: Refresh,
    hosts: Arc<Vec<String>>,
    roots: Arc<Vec<files::Root>>,
    cache: Arc<files::Cache>,
}

/// Serve until the process is killed. `ready` gets the bound address once the server
/// accepts connections.
pub fn run(cfg: Config, ready: impl FnOnce(SocketAddr)) -> Result<(), String> {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_io()
        .build()
        .map_err(|e| format!("runtime: {e}"))?;
    rt.block_on(async {
        let listener = tokio::net::TcpListener::bind((Ipv4Addr::LOCALHOST, cfg.port))
            .await
            .map_err(|e| format!("bind: {e}"))?;
        ready(listener.local_addr().map_err(|e| e.to_string())?);
        let app = App {
            site: Arc::new(cfg.site),
            refresh: cfg.refresh,
            hosts: Arc::new(cfg.hosts),
            roots: Arc::new(cfg.roots),
            cache: Arc::default(),
        };
        axum::serve(listener, router(app))
            .await
            .map_err(|e| format!("serve: {e}"))
    })
}

fn router(app: App) -> Router {
    Router::new()
        .route(
            "/",
            get(|state: State<App>| page(state, Path("index.html".to_string()))),
        )
        .route("/{name}", get(page))
        .route("/api/files/roots", get(files::roots_handler))
        .route("/api/files/list", get(files::list_handler))
        .route("/api/files/stat", get(files::stat_handler))
        .route("/api/files/raw", get(files::raw_handler))
        .layer(middleware::from_fn_with_state(app.clone(), check_host))
        .with_state(app)
}

/// Answer only requests addressed to a loopback name or a configured tunnel name, so a web
/// page in the same browser cannot reach the server through DNS rebinding.
async fn check_host(State(app): State<App>, req: Request, next: Next) -> Response {
    if host_allowed(req.headers(), &app.hosts) {
        next.run(req).await
    } else {
        (
            StatusCode::FORBIDDEN,
            "yajna serve answers to localhost only; pass --host <name> for a tunnel\n",
        )
            .into_response()
    }
}

fn host_allowed(headers: &HeaderMap, extra: &[String]) -> bool {
    let Some(host) = headers.get(header::HOST).and_then(|h| h.to_str().ok()) else {
        return false;
    };
    // strip the port: `[::1]:8765`, `localhost:8765`
    let name = match host.strip_prefix('[') {
        Some(rest) => rest.split(']').next().unwrap_or(""),
        None => host.split(':').next().unwrap_or(""),
    };
    ["localhost", "127.0.0.1", "::1"]
        .iter()
        .any(|n| name.eq_ignore_ascii_case(n))
        || extra.iter().any(|n| name.eq_ignore_ascii_case(n))
}

async fn page(State(app): State<App>, Path(name): Path<String>) -> Response {
    // only files directly under the site directory
    if name.contains(['/', '\\']) || name.contains("..") {
        return not_found(&name);
    }
    let refresh = app.refresh.clone();
    match tokio::task::spawn_blocking(move || refresh()).await {
        Ok(Err(e)) => eprintln!("render: {e}"),
        Err(e) => eprintln!("render: {e}"),
        Ok(Ok(())) => {}
    }
    match tokio::fs::read(app.site.join(&name)).await {
        Ok(bytes) => {
            let mut res = Response::new(Body::from(bytes));
            let h = res.headers_mut();
            h.insert(
                header::CONTENT_TYPE,
                HeaderValue::from_static(content_type(&name)),
            );
            h.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
            res
        }
        Err(_) => not_found(&name),
    }
}

fn not_found(name: &str) -> Response {
    (StatusCode::NOT_FOUND, format!("no such page: /{name}\n")).into_response()
}

fn content_type(name: &str) -> &'static str {
    match name.rsplit('.').next() {
        Some("html") => "text/html; charset=utf-8",
        Some("svg") => "image/svg+xml",
        Some("css") => "text/css; charset=utf-8",
        Some("png") => "image/png",
        _ => "application/octet-stream",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn with_host(h: &str) -> HeaderMap {
        let mut m = HeaderMap::new();
        m.insert(header::HOST, HeaderValue::from_str(h).unwrap());
        m
    }

    #[test]
    fn host_check() {
        let extra = vec!["box.tail1234.ts.net".to_string()];
        for ok in [
            "localhost",
            "localhost:8765",
            "127.0.0.1:8765",
            "[::1]:8765",
            "LOCALHOST",
            "box.tail1234.ts.net",
        ] {
            assert!(host_allowed(&with_host(ok), &extra), "{ok}");
        }
        for bad in [
            "evil.example",
            "evil.example:8765",
            "localhost.evil.example",
            "127.0.0.2",
        ] {
            assert!(!host_allowed(&with_host(bad), &extra), "{bad}");
        }
        assert!(!host_allowed(&HeaderMap::new(), &extra), "no Host");
    }
}
