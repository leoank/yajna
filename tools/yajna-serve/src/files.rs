//! The read-only file API under `/api/files/` (ADR-0028, `docs/files-viewer.md` 5): named
//! roots, directories listed lazily in pages, file metadata, and bytes with ranges.
//!
//! Every path in a request is `<root>/<segment>/...`. It is resolved by walking down from
//! the root one segment at a time: `.`, `..` and empty segments are refused, excluded names
//! are not found, symlinks are followed (out of the root too), and a directory met twice on
//! the way is a loop.

use std::collections::HashMap;
use std::fs;
use std::io::Read;
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::extract::{Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use globset::{GlobBuilder, GlobSet, GlobSetBuilder};
use serde::{Deserialize, Serialize};
use tokio::io::{AsyncReadExt, AsyncSeekExt};

/// Entries per page of a listing.
pub const PAGE: usize = 500;
/// How much of a file is read to decide whether it is text.
const SNIFF: usize = 8192;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Watch {
    Auto,
    Poll,
    Off,
}

impl FromStr for Watch {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "auto" => Ok(Watch::Auto),
            "poll" => Ok(Watch::Poll),
            "off" => Ok(Watch::Off),
            _ => Err(format!("watch {s:?}: one of auto, poll, off")),
        }
    }
}

impl Watch {
    fn as_str(self) -> &'static str {
        match self {
            Watch::Auto => "auto",
            Watch::Poll => "poll",
            Watch::Off => "off",
        }
    }
}

/// One configured root: a name the viewer's paths start with, and where it is on disk.
pub struct Root {
    pub name: String,
    pub path: PathBuf,
    pub watch: Watch,
    exclude: Exclude,
}

impl Root {
    /// `exclude` patterns without a `/` match a file or directory name anywhere below the
    /// root; with one, its path below the root (a leading `/` is dropped). `.git` is always
    /// excluded.
    pub fn new(
        name: &str,
        path: PathBuf,
        exclude: &[String],
        watch: Watch,
    ) -> Result<Root, String> {
        let valid = !name.is_empty()
            && name != "."
            && name != ".."
            && name
                .chars()
                .all(|c| c.is_ascii_alphanumeric() || "._-".contains(c));
        if !valid {
            return Err(format!(
                "root name {name:?}: letters, digits, '.', '_' and '-' only"
            ));
        }
        Ok(Root {
            name: name.to_string(),
            path,
            watch,
            exclude: Exclude::new(exclude).map_err(|e| format!("root {name}: {e}"))?,
        })
    }
}

struct Exclude {
    names: GlobSet,
    paths: GlobSet,
}

impl Exclude {
    fn new(patterns: &[String]) -> Result<Exclude, String> {
        let mut names = GlobSetBuilder::new();
        let mut paths = GlobSetBuilder::new();
        for p in std::iter::once(".git").chain(patterns.iter().map(String::as_str)) {
            let glob = |pat: &str| {
                GlobBuilder::new(pat)
                    .literal_separator(true)
                    .build()
                    .map_err(|e| format!("exclude {p:?}: {e}"))
            };
            if p.contains('/') {
                paths.add(glob(p.trim_start_matches('/'))?);
            } else {
                names.add(glob(p)?);
            }
        }
        Ok(Exclude {
            names: names.build().map_err(|e| e.to_string())?,
            paths: paths.build().map_err(|e| e.to_string())?,
        })
    }

    /// `rel` is the path below the root, `/`-separated, ending in `name`.
    fn excludes(&self, rel: &str, name: &str) -> bool {
        self.names.is_match(name) || self.paths.is_match(rel)
    }
}

#[derive(Debug)]
pub(crate) struct ApiError(StatusCode, String);

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (self.0, Json(serde_json::json!({ "error": self.1 }))).into_response()
    }
}

fn not_found(msg: impl Into<String>) -> ApiError {
    ApiError(StatusCode::NOT_FOUND, msg.into())
}

fn bad_request(msg: impl Into<String>) -> ApiError {
    ApiError(StatusCode::BAD_REQUEST, msg.into())
}

/// A request path resolved on disk.
pub(crate) struct Target<'a> {
    pub(crate) root: &'a Root,
    pub(crate) abs: PathBuf,
    /// below the root, `/`-separated; empty for the root itself
    rel: String,
    /// (device, inode) of every directory from the root down, this one included when it is
    /// a directory
    ancestry: Vec<(u64, u64)>,
    pub(crate) meta: fs::Metadata,
}

fn id(m: &fs::Metadata) -> (u64, u64) {
    (m.dev(), m.ino())
}

pub(crate) fn resolve<'a>(roots: &'a [Root], path: &str) -> Result<Target<'a>, ApiError> {
    let path = path.strip_suffix('/').unwrap_or(path);
    let mut segments = path.split('/');
    let name = segments.next().unwrap_or("");
    let root = roots
        .iter()
        .find(|r| r.name == name)
        .ok_or_else(|| not_found(format!("no root named {name:?}")))?;
    let mut meta = fs::metadata(&root.path).map_err(|_| {
        not_found(format!(
            "root {name} is not on this machine: {}",
            root.path.display()
        ))
    })?;
    let mut ancestry = vec![id(&meta)];
    let mut abs = root.path.clone();
    let mut rel = String::new();
    let segments: Vec<&str> = segments.collect();
    for seg in &segments {
        if seg.is_empty() || *seg == "." || *seg == ".." || seg.contains(['\\', '\0']) {
            return Err(bad_request(format!("bad path segment {seg:?}")));
        }
        if !meta.is_dir() {
            return Err(not_found(format!("{path}: not a directory on the way")));
        }
        if !rel.is_empty() {
            rel.push('/');
        }
        rel.push_str(seg);
        if root.exclude.excludes(&rel, seg) {
            return Err(not_found(format!("{path}: excluded")));
        }
        abs.push(seg);
        meta = fs::metadata(&abs).map_err(|_| not_found(format!("{path}: not found")))?;
        if meta.is_dir() {
            if ancestry.contains(&id(&meta)) {
                return Err(not_found(format!("{path}: a symlink loop")));
            }
            ancestry.push(id(&meta));
        }
    }
    Ok(Target {
        root,
        abs,
        rel,
        ancestry,
        meta,
    })
}

fn millis(t: std::io::Result<SystemTime>) -> Option<u64> {
    t.ok()?
        .duration_since(UNIX_EPOCH)
        .ok()
        .map(|d| d.as_millis() as u64)
}

/// What a listing remembers of an entry between requests; sizes and times are read again
/// for every page, because a file being written changes them without touching its
/// directory.
#[derive(Clone)]
struct Listed {
    name: String,
    kind: &'static str,
    link: Option<String>,
}

#[derive(Serialize)]
struct Entry {
    name: String,
    /// dir, file, broken (a symlink to nothing), loop (a symlink to a directory above it),
    /// other (sockets, fifos, devices)
    kind: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    size: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    mtime: Option<u64>,
    /// a symlink's target, as written
    #[serde(skip_serializing_if = "Option::is_none")]
    link: Option<String>,
}

#[derive(Serialize)]
struct Listing {
    path: String,
    /// the directory's own mtime: a change event for it is news only when this differs
    #[serde(skip_serializing_if = "Option::is_none")]
    mtime: Option<u64>,
    total: usize,
    entries: Vec<Entry>,
    #[serde(skip_serializing_if = "Option::is_none")]
    next: Option<usize>,
}

/// Sorted listings by request path and directory mtime; cleared when it grows past
/// `CACHED` directories.
#[derive(Default)]
pub(crate) struct Cache(Mutex<HashMap<String, Cached>>);
/// a directory's mtime when it was read, and its sorted entries
type Cached = (SystemTime, Arc<Vec<Listed>>);
const CACHED: usize = 64;

fn read_listing(t: &Target) -> Result<Vec<Listed>, ApiError> {
    let rd = fs::read_dir(&t.abs).map_err(|e| not_found(format!("{}: {e}", t.abs.display())))?;
    let mut out = Vec::new();
    for entry in rd.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        let rel = if t.rel.is_empty() {
            name.clone()
        } else {
            format!("{}/{name}", t.rel)
        };
        if t.root.exclude.excludes(&rel, &name) {
            continue;
        }
        // the type comes with the directory entry on Linux and macOS; only a symlink needs
        // a stat, to tell what it points to (EXP-20261023-kjtach: a stat per entry made a
        // million-entry directory take 15 s)
        let Ok(ft) = entry.file_type() else {
            continue;
        };
        let (kind, link) = if ft.is_symlink() {
            let path = entry.path();
            let link = fs::read_link(&path)
                .map(|p| p.to_string_lossy().into_owned())
                .unwrap_or_default();
            let kind = match fs::metadata(&path) {
                Err(_) => "broken",
                Ok(m) if m.is_dir() && t.ancestry.contains(&id(&m)) => "loop",
                Ok(m) if m.is_dir() => "dir",
                Ok(m) if m.is_file() => "file",
                Ok(_) => "other",
            };
            (kind, Some(link))
        } else if ft.is_dir() {
            ("dir", None)
        } else if ft.is_file() {
            ("file", None)
        } else {
            ("other", None)
        };
        out.push(Listed { name, kind, link });
    }
    // lower-casing once per entry, not twice per comparison
    out.sort_by_cached_key(|l| (l.kind != "dir", l.name.to_lowercase(), l.name.clone()));
    Ok(out)
}

fn list(roots: &[Root], cache: &Cache, path: &str, cursor: usize) -> Result<Listing, ApiError> {
    let t = resolve(roots, path)?;
    if !t.meta.is_dir() {
        return Err(bad_request(format!("{path}: not a directory")));
    }
    let key = format!("{}/{}", t.root.name, t.rel);
    let mtime = t.meta.modified().unwrap_or(UNIX_EPOCH);
    let cached = {
        let map = cache.0.lock().unwrap_or_else(|e| e.into_inner());
        map.get(&key)
            .filter(|(m, _)| *m == mtime)
            .map(|(_, l)| l.clone())
    };
    let all = match cached {
        Some(l) => l,
        None => {
            let l = Arc::new(read_listing(&t)?);
            let mut map = cache.0.lock().unwrap_or_else(|e| e.into_inner());
            if map.len() >= CACHED {
                map.clear();
            }
            map.insert(key, (mtime, l.clone()));
            l
        }
    };
    let entries = all
        .iter()
        .skip(cursor)
        .take(PAGE)
        .map(|l| {
            let m = matches!(l.kind, "dir" | "file" | "other")
                .then(|| fs::metadata(t.abs.join(&l.name)).ok())
                .flatten();
            Entry {
                name: l.name.clone(),
                kind: l.kind,
                size: m.as_ref().filter(|m| m.is_file()).map(|m| m.len()),
                mtime: m.and_then(|m| millis(m.modified())),
                link: l.link.clone(),
            }
        })
        .collect();
    let next = (cursor + PAGE < all.len()).then_some(cursor + PAGE);
    Ok(Listing {
        path: path.trim_end_matches('/').to_string(),
        mtime: millis(t.meta.modified()),
        total: all.len(),
        entries,
        next,
    })
}

/// Text: the start of the file holds no NUL and is UTF-8, allowing a character cut off at
/// the end of what was read.
pub(crate) fn is_text(head: &[u8]) -> bool {
    if head.contains(&0) {
        return false;
    }
    match std::str::from_utf8(head) {
        Ok(_) => true,
        Err(e) => e.error_len().is_none(),
    }
}

fn sniff(path: &Path) -> bool {
    let mut buf = Vec::with_capacity(SNIFF);
    match fs::File::open(path) {
        Ok(f) => f.take(SNIFF as u64).read_to_end(&mut buf).is_ok() && is_text(&buf),
        Err(_) => false,
    }
}

fn mime(name: &str) -> Option<&'static str> {
    let ext = name.rsplit_once('.')?.1.to_ascii_lowercase();
    Some(match ext.as_str() {
        "html" | "htm" => "text/html; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "js" | "mjs" => "text/javascript; charset=utf-8",
        "json" => "application/json",
        "md" => "text/markdown; charset=utf-8",
        "csv" => "text/csv; charset=utf-8",
        "tsv" => "text/tab-separated-values; charset=utf-8",
        "txt" | "log" => "text/plain; charset=utf-8",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "webp" => "image/webp",
        "avif" => "image/avif",
        "bmp" => "image/bmp",
        "ico" => "image/x-icon",
        "tif" | "tiff" => "image/tiff",
        "pdf" => "application/pdf",
        "mp4" => "video/mp4",
        "webm" => "video/webm",
        _ => return None,
    })
}

#[derive(Serialize)]
struct Stat {
    path: String,
    kind: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    size: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    mtime: Option<u64>,
    mime: &'static str,
    text: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    link: Option<String>,
}

fn stat(roots: &[Root], path: &str) -> Result<Stat, ApiError> {
    let t = resolve(roots, path)?;
    let kind = if t.meta.is_dir() {
        "dir"
    } else if t.meta.is_file() {
        "file"
    } else {
        "other"
    };
    let text = kind == "file" && sniff(&t.abs);
    let name = t.rel.rsplit('/').next().unwrap_or("");
    let link = fs::symlink_metadata(&t.abs)
        .ok()
        .filter(|m| m.file_type().is_symlink())
        .and_then(|_| fs::read_link(&t.abs).ok())
        .map(|p| p.to_string_lossy().into_owned());
    Ok(Stat {
        path: path.trim_end_matches('/').to_string(),
        kind,
        size: t.meta.is_file().then_some(t.meta.len()),
        mtime: millis(t.meta.modified()),
        mime: match (kind, mime(name)) {
            ("dir", _) => "inode/directory",
            (_, Some(m)) => m,
            _ if text => "text/plain; charset=utf-8",
            _ => "application/octet-stream",
        },
        text,
        link,
    })
}

/// One byte range from a `Range` header for a file of `size` bytes, as `start..=end`.
/// `None` means serve the whole file (no header, another unit, several ranges, or nonsense,
/// which RFC 9110 lets a server ignore); `Some(Err)` means the range cannot be satisfied.
pub(crate) fn parse_range(header: Option<&str>, size: u64) -> Option<Result<(u64, u64), ()>> {
    let spec = header?.trim().strip_prefix("bytes=")?;
    if spec.contains(',') {
        return None;
    }
    let (a, b) = spec.split_once('-')?;
    let (a, b) = (a.trim(), b.trim());
    let range = if a.is_empty() {
        let n: u64 = b.parse().ok()?;
        if n == 0 || size == 0 {
            return Some(Err(()));
        }
        (size.saturating_sub(n), size - 1)
    } else {
        let start: u64 = a.parse().ok()?;
        let end: u64 = if b.is_empty() {
            size.saturating_sub(1)
        } else {
            b.parse().ok()?
        };
        if start > end && !b.is_empty() {
            return None;
        }
        if start >= size {
            return Some(Err(()));
        }
        (start, end.min(size - 1))
    };
    Some(Ok(range))
}

async fn raw(
    roots: Arc<Vec<Root>>,
    path: String,
    headers: HeaderMap,
) -> Result<Response, ApiError> {
    let p = path.clone();
    let (abs, meta, name) = tokio::task::spawn_blocking(move || {
        let t = resolve(&roots, &p)?;
        let name = t.rel.rsplit('/').next().unwrap_or("").to_string();
        Ok::<_, ApiError>((t.abs, t.meta, name))
    })
    .await
    .map_err(|e| ApiError(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))??;
    if !meta.is_file() {
        return Err(bad_request(format!("{path}: not a file")));
    }
    let size = meta.len();
    let mtime = meta
        .modified()
        .ok()
        .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let etag = format!("\"{size:x}-{mtime:x}\"");
    let ctype = match mime(&name) {
        Some(m) => m,
        None => {
            let abs = abs.clone();
            let text = tokio::task::spawn_blocking(move || sniff(&abs))
                .await
                .unwrap_or(false);
            if text {
                "text/plain; charset=utf-8"
            } else {
                "application/octet-stream"
            }
        }
    };
    let mut res = Response::new(Body::empty());
    let h = res.headers_mut();
    h.insert(header::ETAG, HeaderValue::from_str(&etag).expect("ascii"));
    h.insert(header::ACCEPT_RANGES, HeaderValue::from_static("bytes"));
    h.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    h.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    // a run's HTML or SVG opened on its own must not run as part of the viewer
    h.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static("sandbox"),
    );
    h.insert(header::CONTENT_TYPE, HeaderValue::from_static(ctype));
    if headers
        .get(header::IF_NONE_MATCH)
        .and_then(|v| v.to_str().ok())
        .is_some_and(|v| v.split(',').any(|t| t.trim() == etag))
    {
        *res.status_mut() = StatusCode::NOT_MODIFIED;
        return Ok(res);
    }
    let range = parse_range(
        headers.get(header::RANGE).and_then(|v| v.to_str().ok()),
        size,
    );
    let (start, len) = match range {
        None => (0, size),
        Some(Err(())) => {
            *res.status_mut() = StatusCode::RANGE_NOT_SATISFIABLE;
            res.headers_mut().insert(
                header::CONTENT_RANGE,
                HeaderValue::from_str(&format!("bytes */{size}")).expect("ascii"),
            );
            return Ok(res);
        }
        Some(Ok((a, b))) => {
            *res.status_mut() = StatusCode::PARTIAL_CONTENT;
            res.headers_mut().insert(
                header::CONTENT_RANGE,
                HeaderValue::from_str(&format!("bytes {a}-{b}/{size}")).expect("ascii"),
            );
            (a, b - a + 1)
        }
    };
    let mut file = tokio::fs::File::open(&abs)
        .await
        .map_err(|e| not_found(format!("{path}: {e}")))?;
    file.seek(std::io::SeekFrom::Start(start))
        .await
        .map_err(|e| not_found(format!("{path}: {e}")))?;
    let stream = tokio_util::io::ReaderStream::with_capacity(file.take(len), 64 * 1024);
    res.headers_mut().insert(
        header::CONTENT_LENGTH,
        HeaderValue::from_str(&len.to_string()).expect("ascii"),
    );
    *res.body_mut() = Body::from_stream(stream);
    Ok(res)
}

/// The largest markdown file the preview renders.
const RENDER_MAX: u64 = 4 << 20;

// --- handlers ------------------------------------------------------------------------

#[derive(Deserialize)]
pub(crate) struct PathQuery {
    path: String,
    #[serde(default)]
    cursor: usize,
}

#[derive(Serialize)]
struct RootInfo {
    name: String,
    path: String,
    exists: bool,
    watch: &'static str,
    /// how changes reach the viewer here: notify, poll or off
    live: &'static str,
}

pub(crate) async fn roots_handler(State(app): State<crate::App>) -> Response {
    let roots: Vec<RootInfo> = app
        .roots
        .iter()
        .map(|r| RootInfo {
            name: r.name.clone(),
            path: r.path.display().to_string(),
            exists: r.path.is_dir(),
            watch: r.watch.as_str(),
            live: crate::live::Live::of(r.watch, &r.path).as_str(),
        })
        .collect();
    Json(roots).into_response()
}

async fn blocking<T: Send + 'static>(
    f: impl FnOnce() -> Result<T, ApiError> + Send + 'static,
) -> Result<T, ApiError> {
    tokio::task::spawn_blocking(f)
        .await
        .map_err(|e| ApiError(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
}

pub(crate) async fn list_handler(
    State(app): State<crate::App>,
    Query(q): Query<PathQuery>,
) -> Result<Response, ApiError> {
    blocking(move || list(&app.roots, &app.cache, &q.path, q.cursor))
        .await
        .map(|l| Json(l).into_response())
}

pub(crate) async fn stat_handler(
    State(app): State<crate::App>,
    Query(q): Query<PathQuery>,
) -> Result<Response, ApiError> {
    blocking(move || stat(&app.roots, &q.path))
        .await
        .map(|s| Json(s).into_response())
}

pub(crate) async fn render_handler(
    State(app): State<crate::App>,
    Query(q): Query<PathQuery>,
) -> Result<Response, ApiError> {
    blocking(move || {
        let t = resolve(&app.roots, &q.path)?;
        if !t.meta.is_file() {
            return Err(bad_request(format!("{}: not a file", q.path)));
        }
        if t.meta.len() > RENDER_MAX {
            return Err(bad_request(format!(
                "{}: over {} MB, too large to preview",
                q.path,
                RENDER_MAX >> 20
            )));
        }
        (app.render)(&t.abs).map_err(|e| ApiError(StatusCode::UNPROCESSABLE_ENTITY, e))
    })
    .await
    .map(|r| Json(r).into_response())
}

pub(crate) async fn raw_handler(
    State(app): State<crate::App>,
    Query(q): Query<PathQuery>,
    headers: HeaderMap,
) -> Result<Response, ApiError> {
    raw(app.roots.clone(), q.path, headers).await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ranges() {
        let r = |h: &str, n| parse_range(Some(h), n);
        assert_eq!(r("bytes=0-9", 100), Some(Ok((0, 9))));
        assert_eq!(r("bytes=90-", 100), Some(Ok((90, 99))));
        assert_eq!(r("bytes=-10", 100), Some(Ok((90, 99))));
        assert_eq!(r("bytes=-500", 100), Some(Ok((0, 99))));
        assert_eq!(r("bytes=50-500", 100), Some(Ok((50, 99))));
        assert_eq!(r("bytes=100-", 100), Some(Err(())));
        assert_eq!(r("bytes=0-", 0), Some(Err(())));
        assert_eq!(r("bytes=0-1,5-6", 100), None, "several ranges: whole file");
        assert_eq!(r("items=0-1", 100), None);
        assert_eq!(r("bytes=9-3", 100), None);
        assert_eq!(parse_range(None, 100), None);
    }

    #[test]
    fn text_sniffing() {
        assert!(is_text(b"plain\n"));
        assert!(is_text(b""));
        assert!(is_text("café".as_bytes()));
        assert!(is_text(&"é".as_bytes()[..1]), "a character cut at the end");
        assert!(!is_text(b"a\0b"));
        assert!(!is_text(&[0xff, 0xfe, 0x41]));
    }

    #[test]
    fn excludes() {
        let e = Exclude::new(&["*.ckpt".into(), "/notes".into(), "data/raw".into()]).unwrap();
        assert!(e.excludes(".git", ".git"));
        assert!(e.excludes("a/b/.git", ".git"));
        assert!(e.excludes("runs/x.ckpt", "x.ckpt"));
        assert!(e.excludes("notes", "notes"));
        assert!(!e.excludes("code/notes", "notes"), "anchored at the root");
        assert!(e.excludes("data/raw", "raw"));
        assert!(!e.excludes("other/data/raw", "raw"));
        assert!(Exclude::new(&["[".into()]).is_err());
    }

    #[test]
    fn root_names() {
        let mk = |n: &str| Root::new(n, PathBuf::from("/"), &[], Watch::Auto);
        assert!(mk("scratch").is_ok());
        assert!(mk("g2a_runs-1.0").is_ok());
        for bad in ["", ".", "..", "a/b", "a b"] {
            assert!(mk(bad).is_err(), "{bad:?}");
        }
    }

    #[test]
    fn resolving() {
        let dir = std::env::temp_dir().join(format!("yajna-serve-resolve-{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(dir.join("a/b")).unwrap();
        fs::write(dir.join("a/b/f.txt"), "x").unwrap();
        fs::create_dir_all(dir.join(".git")).unwrap();
        std::os::unix::fs::symlink(&dir, dir.join("a/up")).unwrap();
        let roots = vec![Root::new("r", dir.clone(), &[], Watch::Auto).unwrap()];
        assert!(resolve(&roots, "r").is_ok());
        assert!(resolve(&roots, "r/").is_ok());
        assert_eq!(resolve(&roots, "r/a/b/f.txt").unwrap().rel, "a/b/f.txt");
        for (bad, code) in [
            ("r/../x", 400),
            ("r/a/./b", 400),
            ("r//a", 400),
            ("r/.git", 404),
            ("r/a/b/f.txt/x", 404),
            ("r/a/up", 404),
            ("r/a/up/a", 404),
            ("nope/a", 404),
        ] {
            match resolve(&roots, bad) {
                Ok(_) => panic!("{bad} resolved"),
                Err(e) => assert_eq!(e.0.as_u16(), code, "{bad}: {}", e.1),
            }
        }
        let listing = list(&roots, &Cache::default(), "r/a", 0).unwrap();
        let kinds: Vec<(&str, &str)> = listing
            .entries
            .iter()
            .map(|e| (e.name.as_str(), e.kind))
            .collect();
        assert_eq!(kinds, [("b", "dir"), ("up", "loop")]);
        let _ = fs::remove_dir_all(&dir);
    }
}
