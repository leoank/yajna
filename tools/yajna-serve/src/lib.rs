//! The server behind `yajna serve` (ADR-0027): the rendered site, brought up to date
//! before a page is served, and the read-only file API of the files viewer (ADR-0028), on
//! a loopback address only, with change events for what the viewer has open
//! (`docs/files-viewer.md`).
//!
//! With `--socket` (ADR-0036) one server answers on a unix socket for several notebooks:
//! `/api/notebooks` lists them and each is served under `/n/<namespace>/` exactly as a
//! server of one notebook serves it at `/`; the socket's permissions are the only check.
//!
//! `/api/git/` (ADR-0038, `git`) says what is changed, staged and committed in the git
//! worktree a path is in, read-only; it needs only the roots, so it can be served alone.
//!
//! The crate knows HTTP and files, not the notebook: the CLI hands it the site directory,
//! a callback that re-renders the site when a page changed, one that renders markdown the
//! way the site does, the roots, and what reads and writes reviews (`reviews`) and pages
//! (`pages`). The web app (`web/`, ADR-0041) is built into `web/dist` by `nix run .#web`
//! and embedded here.

pub mod files;
pub mod git;
pub mod live;
pub mod pages;
pub mod reviews;
pub mod worktrees;

use std::net::{Ipv4Addr, SocketAddr};
use std::path::PathBuf;
use std::sync::Arc;

use axum::body::Body;
use axum::extract::{Path, Request, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::middleware::{self, Next};
use axum::response::{IntoResponse, Response};
use axum::routing::{any, get, post};
use axum::Router;

/// Re-renders the site if a page changed since the last render; called before every page
/// request, from a blocking thread.
pub type Refresh = Arc<dyn Fn() -> Result<(), String> + Send + Sync>;

/// Renders a markdown file for the viewer's preview, from a blocking thread.
pub type Render = Arc<dyn Fn(&std::path::Path) -> Result<Rendered, String> + Send + Sync>;

/// A rendered markdown file: its HTML, and its ID and title when it is a page.
#[derive(serde::Serialize)]
pub struct Rendered {
    pub html: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}

/// The web app (ADR-0041), built into `web/dist` by `nix run .#web`.
#[derive(rust_embed::RustEmbed)]
#[folder = "web/dist"]
struct Web;

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
    pub render: Render,
    /// the notebook's namespace, which keys the viewer's saved layout
    pub notebook: String,
    /// the version of yajna serving it, shown in the viewer
    pub version: String,
    /// the notebook's reviews (ADR-0030)
    pub reviews: Option<Arc<dyn reviews::Reviews>>,
    /// the notebook's pages, for the web app (ADR-0041)
    pub pages: Option<Arc<dyn pages::Pages>>,
    /// what a write to a review must carry; `None` keeps the server read-only
    pub token: Option<String>,
    /// serve every worktree of the checkout under `/w/<branch>/` (ADR-0039); `None` serves
    /// this checkout only
    pub worktrees: Option<worktrees::WorktreesConfig>,
}

/// One notebook of a server on a unix socket (ADR-0036).
pub struct Notebook {
    /// the namespace it is served under, `/n/<namespace>/`
    pub namespace: String,
    /// where its checkout is, and its shape, for `/api/notebooks`
    pub path: PathBuf,
    pub shape: String,
    /// as for a server of one notebook; `port`, `hosts` and `token` are not used
    pub config: Config,
}

#[derive(Clone)]
pub(crate) struct App {
    site: Arc<PathBuf>,
    refresh: Refresh,
    hosts: Arc<Vec<String>>,
    roots: Arc<Vec<files::Root>>,
    cache: Arc<files::Cache>,
    render: Render,
    notebook: Arc<String>,
    version: Arc<String>,
    reviews: Option<Arc<dyn reviews::Reviews>>,
    pages: Option<Arc<dyn pages::Pages>>,
    token: Arc<Option<String>>,
    /// served on the owner's unix socket: writes need no token (ADR-0036)
    local: bool,
    /// the other worktrees of the notebook (ADR-0039)
    worktrees: Option<Arc<worktrees::Worktrees>>,
}

impl axum::extract::FromRef<App> for git::Roots {
    fn from_ref(app: &App) -> git::Roots {
        git::Roots(app.roots.clone())
    }
}

/// The git writes follow the reviews' rule: the owner's socket, or `--review`'s token
/// (ADR-0040); a server with neither, `dir_router`'s among them, refuses them.
impl axum::extract::FromRef<App> for git::Writes {
    fn from_ref(app: &App) -> git::Writes {
        git::Writes { token: app.token.clone(), local: app.local, on: true }
    }
}

impl App {
    fn new(cfg: Config, local: bool) -> Self {
        let worktrees = cfg
            .worktrees
            .map(|w| Arc::new(worktrees::Worktrees::new(w, cfg.token.clone(), local)));
        App {
            worktrees,
            site: Arc::new(cfg.site),
            refresh: cfg.refresh,
            hosts: Arc::new(cfg.hosts),
            roots: Arc::new(cfg.roots),
            cache: Arc::default(),
            render: cfg.render,
            notebook: Arc::new(cfg.notebook),
            version: Arc::new(cfg.version),
            reviews: cfg.reviews,
            pages: cfg.pages,
            token: Arc::new(cfg.token),
            local,
        }
    }
}

/// Serve until the process is killed. `ready` gets the bound address once the server
/// accepts connections.
pub fn run(cfg: Config, ready: impl FnOnce(SocketAddr)) -> Result<(), String> {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_io()
        .enable_time()
        .build()
        .map_err(|e| format!("runtime: {e}"))?;
    rt.block_on(async {
        let listener = tokio::net::TcpListener::bind((Ipv4Addr::LOCALHOST, cfg.port))
            .await
            .map_err(|e| format!("bind: {e}"))?;
        ready(listener.local_addr().map_err(|e| e.to_string())?);
        let app = App::new(cfg, false);
        let router = router(app.clone()).layer(middleware::from_fn_with_state(app, check_host));
        axum::serve(listener, router)
            .await
            .map_err(|e| format!("serve: {e}"))
    })
}

/// Serve several notebooks on a unix socket until the process is killed (ADR-0036). The
/// socket's directory is made for this user only, a stale socket is replaced, and one a
/// server still answers on is an error. `ready` is called once it accepts connections.
/// Unix only: Windows has no unix sockets in std or tokio.
#[cfg(unix)]
pub fn run_socket(
    socket: &std::path::Path,
    notebooks: Vec<Notebook>,
    ready: impl FnOnce(),
) -> Result<(), String> {
    use std::os::unix::fs::PermissionsExt;
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_io()
        .enable_time()
        .build()
        .map_err(|e| format!("runtime: {e}"))?;
    rt.block_on(async {
        if let Some(dir) = socket.parent().filter(|d| !d.as_os_str().is_empty()) {
            if !dir.exists() {
                std::fs::create_dir_all(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
                std::fs::set_permissions(dir, std::fs::Permissions::from_mode(0o700))
                    .map_err(|e| format!("{}: {e}", dir.display()))?;
            }
        }
        if socket.exists() {
            if tokio::net::UnixStream::connect(socket).await.is_ok() {
                return Err(format!("{}: a server already answers there", socket.display()));
            }
            std::fs::remove_file(socket).map_err(|e| format!("{}: {e}", socket.display()))?;
        }
        let listener = tokio::net::UnixListener::bind(socket)
            .map_err(|e| format!("bind {}: {e}", socket.display()))?;
        std::fs::set_permissions(socket, std::fs::Permissions::from_mode(0o600))
            .map_err(|e| format!("{}: {e}", socket.display()))?;
        ready();
        axum::serve(listener, many(notebooks))
            .await
            .map_err(|e| format!("serve: {e}"))
    })
}

/// The files viewer, its changes view and the git API over `roots` alone (ADR-0038): no
/// site, reviews or worktree list, read-only. For a program with no notebook that serves a
/// directory of its own, such as saarthi's node serving a session's directory; it mounts
/// the router wherever it likes, under any prefix, and checks who reaches it itself, since
/// no `Host` check is applied. `render` renders a markdown file for the viewer's preview.
pub fn dir_router(roots: Vec<files::Root>, render: Render, version: &str) -> Router {
    let notebook = roots.first().map(|r| r.name.clone()).unwrap_or_default();
    router(App::new(
        Config {
            site: PathBuf::new(),
            refresh: Arc::new(|| Ok(())),
            port: 0,
            hosts: Vec::new(),
            roots,
            render,
            notebook,
            version: version.to_string(),
            reviews: None,
            pages: None,
            token: None,
            worktrees: None,
        },
        false,
    ))
}

/// The router of a server of several notebooks: the list, and each one under its prefix.
#[cfg_attr(not(unix), allow(dead_code))]
fn many(notebooks: Vec<Notebook>) -> Router {
    let mut list = Vec::new();
    let mut by_name = std::collections::HashMap::new();
    for n in notebooks {
        let app = App::new(n.config, true);
        list.push((
            serde_json::json!({
                "namespace": n.namespace,
                "path": n.path,
                "shape": n.shape,
                "url": format!("/n/{}/", n.namespace),
            }),
            app.worktrees.clone(),
        ));
        by_name.insert(n.namespace, router(app));
    }
    let by_name = Arc::new(by_name);
    let list = Arc::new(list);
    Router::new()
        .route(
            "/api/notebooks",
            get(move || {
                let list = list.clone();
                async move {
                    // each notebook's worktrees, with what is uncommitted in each (ADR-0039)
                    let all = tokio::task::spawn_blocking(move || {
                        list.iter()
                            .map(|(n, wt)| {
                                let mut n = n.clone();
                                if let Some(Ok(w)) = wt.as_ref().map(|w| w.with_counts()) {
                                    n["worktrees"] = w.into();
                                }
                                n
                            })
                            .collect::<Vec<_>>()
                    })
                    .await
                    .unwrap_or_default();
                    axum::Json(serde_json::json!({ "notebooks": all })).into_response()
                }
            }),
        )
        .fallback(move |req: Request| {
            let by_name = by_name.clone();
            async move { dispatch(&by_name, req).await }
        })
}

/// `/n/<namespace>/<rest>` to that notebook's router as `/<rest>`; `/n/<namespace>` is
/// redirected to the slash form, which relative links in its pages need.
#[cfg_attr(not(unix), allow(dead_code))]
async fn dispatch(by_name: &std::collections::HashMap<String, Router>, mut req: Request) -> Response {
    use tower::ServiceExt;
    let path = req.uri().path().to_string();
    let Some(rest) = path.strip_prefix("/n/") else {
        return not_found(path.trim_start_matches('/'));
    };
    let (name, inner) = match rest.find('/') {
        Some(i) => (&rest[..i], &rest[i..]),
        None => {
            return axum::response::Redirect::permanent(&format!("{path}/")).into_response();
        }
    };
    let Some(router) = by_name.get(name) else {
        return (StatusCode::NOT_FOUND, format!("no notebook named {name}\n")).into_response();
    };
    let inner = match req.uri().query() {
        Some(q) => format!("{inner}?{q}"),
        None => inner.to_string(),
    };
    match inner.parse() {
        Ok(uri) => *req.uri_mut() = uri,
        Err(_) => return (StatusCode::BAD_REQUEST, "a bad path\n").into_response(),
    }
    match router.clone().oneshot(req).await {
        Ok(r) => r,
        Err(never) => match never {},
    }
}

fn router(app: App) -> Router {
    Router::new()
        // the web app at its root and its own routes; it works out its base itself
        .route("/", get(web_root))
        .route("/p/{*rest}", get(web_index))
        .route("/c/{*rest}", get(web_index))
        .route("/log", get(web_index))
        .route("/tasks", get(web_index))
        .route("/search", get(web_index))
        .route("/reviews", get(web_index))
        .route("/reviews/{*rest}", get(web_index))
        .route("/changes", get(web_index))
        .route("/files", get(web_index))
        .route("/files/", get(web_index))
        .route("/files/{*rest}", get(web_index))
        .route("/assets/{*asset}", get(web_asset))
        // the static site's pages, for links made before the app (`yajna site` writes them)
        .route("/{name}", get(page))
        .route("/api/files/roots", get(files::roots_handler))
        .route("/api/files/list", get(files::list_handler))
        .route("/api/files/stat", get(files::stat_handler))
        .route("/api/files/raw", get(files::raw_handler))
        .route("/api/files/render", get(files::render_handler))
        .route("/api/events", get(live::events_handler))
        .route("/api/info", get(info))
        .route("/api/worktrees", get(worktrees::list_handler))
        .route("/api/notebook", get(pages::overview_handler))
        .route("/api/pages", get(pages::list_handler))
        .route("/api/pages/{id}", get(pages::page_handler))
        .route("/api/log", get(pages::log_handler))
        .route("/api/tasks", get(pages::tasks_handler))
        .route("/api/search", get(pages::search_handler))
        .route("/w/{*rest}", any(worktrees::dispatch))
        .route("/api/reviews", get(reviews::list_handler).post(reviews::open_handler))
        .route("/api/reviews/{id}", get(reviews::get_handler))
        .route("/api/reviews/{id}/file", get(reviews::file_handler))
        .route("/api/reviews/{id}/{action}", post(reviews::write_handler))
        .merge(git::routes())
        .with_state(app)
}

async fn info(State(app): State<App>) -> Response {
    axum::Json(serde_json::json!({
        "notebook": *app.notebook,
        "version": *app.version,
        "review": app.token.is_some() || app.local,
        "local": app.local,
    }))
    .into_response()
}

/// The app's overview: only where there is a notebook. A directory served alone
/// (`dir_router`) has its files and changes routes and nothing at its root.
async fn web_root(State(app): State<App>) -> Response {
    if app.pages.is_none() {
        return not_found("");
    }
    web_index().await
}

/// The web app's page, for every route of it: the app reads the route from the address.
async fn web_index() -> Response {
    embedded(Web::get("index.html"), "index.html")
}

async fn web_asset(Path(name): Path<String>) -> Response {
    embedded(Web::get(&format!("assets/{name}")), &name)
}

fn embedded(f: Option<rust_embed::EmbeddedFile>, name: &str) -> Response {
    match f {
        Some(f) => {
            let mut res = Response::new(Body::from(f.data.into_owned()));
            res.headers_mut().insert(header::CONTENT_TYPE, HeaderValue::from_static(content_type(name)));
            res.headers_mut().insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
            res
        }
        None => not_found(name),
    }
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
        Some("js") => "text/javascript; charset=utf-8",
        Some("png") => "image/png",
        _ => "application/octet-stream",
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tower::ServiceExt;

    fn config(name: &str) -> Config {
        Config {
            site: std::env::temp_dir().join(format!("yajna-serve-many-{}-{name}", std::process::id())),
            refresh: Arc::new(|| Ok(())),
            port: 0,
            hosts: Vec::new(),
            roots: Vec::new(),
            render: Arc::new(|_| Err(String::new())),
            notebook: name.to_string(),
            version: "test".to_string(),
            reviews: None,
            pages: None,
            token: None,
            worktrees: None,
        }
    }

    fn notebooks() -> Vec<Notebook> {
        ["lab", "proj"]
            .into_iter()
            .map(|n| Notebook {
                namespace: n.to_string(),
                path: PathBuf::from(format!("/nb/{n}")),
                shape: "lab".to_string(),
                config: config(n),
            })
            .collect()
    }

    async fn get_path(router: Router, path: &str) -> (StatusCode, HeaderMap, String) {
        let req = Request::builder().uri(path).body(Body::empty()).unwrap();
        let res = router.oneshot(req).await.unwrap();
        let (parts, body) = res.into_parts();
        let bytes = axum::body::to_bytes(body, 1 << 20).await.unwrap();
        (parts.status, parts.headers, String::from_utf8_lossy(&bytes).into_owned())
    }

    #[tokio::test]
    async fn several_notebooks_each_under_its_namespace() {
        let r = many(notebooks());
        let (s, _, body) = get_path(r.clone(), "/api/notebooks").await;
        assert_eq!(s, StatusCode::OK);
        let v: serde_json::Value = serde_json::from_str(&body).unwrap();
        let names: Vec<_> = v["notebooks"].as_array().unwrap().iter().map(|n| n["namespace"].clone()).collect();
        assert_eq!(names, ["lab", "proj"]);
        assert_eq!(v["notebooks"][1]["url"], "/n/proj/");

        // each notebook's own routes, as a server of one serves them at /; no Host needed
        let (s, _, body) = get_path(r.clone(), "/n/proj/api/info").await;
        assert_eq!(s, StatusCode::OK);
        let info: serde_json::Value = serde_json::from_str(&body).unwrap();
        assert_eq!((info["notebook"].as_str(), info["local"].as_bool(), info["review"].as_bool()), (Some("proj"), Some(true), Some(true)));
        let (s, _, body) = get_path(r.clone(), "/n/lab/api/files/roots?x=1").await;
        assert_eq!((s, body.as_str()), (StatusCode::OK, "[]"));
        let (s, _, body) = get_path(r.clone(), "/n/lab/files/").await;
        assert_eq!(s, StatusCode::OK);
        assert!(body.contains("<html") || body.contains("<!doctype") || body.contains("<!DOCTYPE"), "{body}");

        // the bare prefix goes to its slash form, for the pages' relative links
        let (s, h, _) = get_path(r.clone(), "/n/lab").await;
        assert_eq!(s, StatusCode::PERMANENT_REDIRECT);
        assert_eq!(h.get(header::LOCATION).unwrap(), "/n/lab/");

        for missing in ["/n/nope/api/info", "/api/info", "/files/"] {
            assert_eq!(get_path(r.clone(), missing).await.0, StatusCode::NOT_FOUND, "{missing}");
        }
    }

    #[tokio::test]
    async fn worktrees_listed_per_notebook_and_served_under_the_namespace() {
        let dir = std::env::temp_dir().join(format!("yajna-serve-many-wt-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        let git = |at: &std::path::Path, args: &[&str]| {
            let out = std::process::Command::new("git")
                .arg("-C")
                .arg(at)
                .args(["-c", "commit.gpgsign=false"])
                .args(args)
                .env("GIT_CONFIG_GLOBAL", "/dev/null")
                .env("GIT_AUTHOR_NAME", "a")
                .env("GIT_AUTHOR_EMAIL", "a@x")
                .env("GIT_COMMITTER_NAME", "a")
                .env("GIT_COMMITTER_EMAIL", "a@x")
                .output()
                .unwrap();
            assert!(out.status.success(), "{}", String::from_utf8_lossy(&out.stderr));
        };
        let main = dir.join("main");
        std::fs::create_dir_all(&main).unwrap();
        git(&main, &["init", "-q", "-b", "main"]);
        std::fs::write(main.join("yajna.toml"), "").unwrap();
        git(&main, &["add", "."]);
        git(&main, &["commit", "-q", "-m", "x"]);
        git(&main, &["worktree", "add", "-q", "-b", "g2a/main", dir.join("g2a").to_str().unwrap()]);
        std::fs::write(dir.join("g2a/new.md"), "x").unwrap();

        let mut nbs = notebooks();
        // the opened worktree is named after its directory, to tell it apart
        nbs[0].config.worktrees = Some(worktrees::WorktreesConfig {
            root: main.clone(),
            open: Arc::new(|root: &std::path::Path| {
                Ok(config(&root.file_name().unwrap().to_string_lossy()))
            }),
        });
        let r = many(nbs);
        let (_, _, body) = get_path(r.clone(), "/api/notebooks").await;
        let v: serde_json::Value = serde_json::from_str(&body).unwrap();
        let wts = v["notebooks"][0]["worktrees"].as_array().unwrap();
        let names: Vec<_> = wts.iter().map(|w| (w["name"].as_str().unwrap(), w["untracked"].as_u64().unwrap())).collect();
        assert_eq!(names, [("main", 0), ("g2a/main", 1)]);
        assert!(v["notebooks"][1].get("worktrees").is_none(), "proj serves its checkout only");

        let (s, _, body) = get_path(r.clone(), "/n/lab/w/g2a%2Fmain/api/info").await;
        assert_eq!(s, StatusCode::OK, "{body}");
        let info: serde_json::Value = serde_json::from_str(&body).unwrap();
        assert_eq!((info["notebook"].as_str(), info["local"].as_bool()), (Some("g2a"), Some(true)));
        let (s, h, _) = get_path(r.clone(), "/n/lab/w/main").await;
        assert_eq!((s, h.get(header::LOCATION).unwrap().to_str().unwrap()), (StatusCode::PERMANENT_REDIRECT, "main/"));
        assert_eq!(get_path(r.clone(), "/n/proj/w/main/api/info").await.0, StatusCode::NOT_FOUND);
    }

    /// A socket server on its own thread: `Ok` once it accepts connections, or why it stopped.
    #[cfg(unix)]
    fn serve_in_thread(socket: PathBuf) -> std::sync::mpsc::Receiver<Result<(), String>> {
        let (tx, rx) = std::sync::mpsc::channel();
        let ready = tx.clone();
        std::thread::spawn(move || {
            if let Err(e) = run_socket(&socket, notebooks(), move || ready.send(Ok(())).unwrap()) {
                let _ = tx.send(Err(format!("{}: {e}", socket.display())));
            }
        });
        rx
    }

    #[test]
    #[cfg(unix)]
    fn the_socket_is_the_owners_and_not_taken_twice() {
        use std::os::unix::fs::PermissionsExt;
        let dir = std::env::temp_dir().join(format!("yajna-serve-sock-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        let socket = dir.join("run/serve.sock");
        let rx = serve_in_thread(socket.clone());
        rx.recv_timeout(std::time::Duration::from_secs(10)).unwrap().unwrap();
        let mode = |p: &std::path::Path| std::fs::metadata(p).unwrap().permissions().mode() & 0o777;
        assert_eq!(mode(&socket), 0o600);
        assert_eq!(mode(socket.parent().unwrap()), 0o700);
        let again = run_socket(&socket, notebooks(), || {});
        assert!(again.unwrap_err().contains("already answers"));

        // a socket file nothing answers on is replaced
        let stale = dir.join("stale.sock");
        drop(std::os::unix::net::UnixListener::bind(&stale).unwrap());
        // a process another test forks just then holds the listener until it execs, and a
        // connect still succeeds; wait until nothing answers, as after a server's death
        let t0 = std::time::Instant::now();
        while std::os::unix::net::UnixStream::connect(&stale).is_ok() && t0.elapsed() < std::time::Duration::from_secs(5) {
            std::thread::sleep(std::time::Duration::from_millis(20));
        }
        let rx = serve_in_thread(stale.clone());
        rx.recv_timeout(std::time::Duration::from_secs(10)).unwrap().unwrap();
    }

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

    #[tokio::test]
    async fn a_directory_served_alone_with_its_changes() {
        let dir = std::env::temp_dir().join(format!("yajna-serve-dir-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        let git = |args: &[&str]| {
            let out = std::process::Command::new("git")
                .arg("-C")
                .arg(&dir)
                .args(["-c", "commit.gpgsign=false"])
                .args(args)
                .env("GIT_CONFIG_GLOBAL", "/dev/null")
                .env("GIT_AUTHOR_NAME", "a")
                .env("GIT_AUTHOR_EMAIL", "a@x")
                .env("GIT_COMMITTER_NAME", "a")
                .env("GIT_COMMITTER_EMAIL", "a@x")
                .output()
                .unwrap();
            assert!(out.status.success(), "{}", String::from_utf8_lossy(&out.stderr));
        };
        git(&["init", "-q", "-b", "main"]);
        std::fs::write(dir.join("a.md"), "one\n").unwrap();
        git(&["add", "."]);
        git(&["commit", "-q", "-m", "first"]);
        std::fs::write(dir.join("a.md"), "two\n").unwrap();

        let root = files::Root::new("work", dir.clone(), &[], files::Watch::Off).unwrap();
        let render: Render = Arc::new(|p: &std::path::Path| {
            Ok(Rendered { html: format!("<p>{}</p>", p.file_name().unwrap().to_string_lossy()), id: None, title: None })
        });
        let r = dir_router(vec![root], render, "9.9.9");

        // the changes page and the viewer, with the root and its git state
        let (s, _, body) = get_path(r.clone(), "/files/changes").await;
        assert_eq!(s, StatusCode::OK);
        assert!(body.to_lowercase().contains("<!doctype"), "{body}");
        let (s, _, body) = get_path(r.clone(), "/api/files/roots").await;
        assert_eq!(s, StatusCode::OK);
        assert!(body.contains("\"work\""), "{body}");
        let (s, _, body) = get_path(r.clone(), "/api/git/status?path=work").await;
        assert_eq!(s, StatusCode::OK);
        assert!(body.contains("a.md"), "{body}");
        let (s, _, body) = get_path(r.clone(), "/api/git/diff?path=work/a.md&from=HEAD&to=WORK").await;
        assert_eq!(s, StatusCode::OK);
        assert!(body.contains("+two"), "{body}");
        let (s, _, body) = get_path(r.clone(), "/api/files/render?path=work/a.md").await;
        assert_eq!((s, body.contains("<p>a.md</p>")), (StatusCode::OK, true), "{body}");

        // read-only, and nothing of a notebook: no reviews, no worktree list, no site
        let (_, _, body) = get_path(r.clone(), "/api/info").await;
        let info: serde_json::Value = serde_json::from_str(&body).unwrap();
        assert_eq!((info["notebook"].as_str(), info["version"].as_str(), info["review"].as_bool()), (Some("work"), Some("9.9.9"), Some(false)));
        for missing in ["/api/worktrees", "/", "/index.html", "/api/reviews/x/approve"] {
            assert!(get_path(r.clone(), missing).await.0.is_client_error(), "{missing}");
        }
        let _ = std::fs::remove_dir_all(&dir);
    }
}
