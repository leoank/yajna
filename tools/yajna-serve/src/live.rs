//! Live updates for the files viewer (ADR-0028, `docs/files-viewer.md` 5.5).
//!
//! `GET /api/events?watch=<path>&watch=...` is a stream of server-sent events, one stream
//! per page, naming the open files and expanded directories. What changed is always
//! decided the same way: by comparing a file's existence, size and mtime, or a directory's
//! existence and mtime, with what was last sent. Filesystem events (notify) only say when
//! to look, debounced; on network filesystems, where events from other machines do not
//! arrive, and with `watch = "poll"`, a timer says so every two seconds instead. Open
//! files are also looked at every second, because macOS does not report each write to a
//! file that stays open. A missed or spurious event therefore costs a little latency,
//! never a wrong update.

use std::collections::BTreeSet;
use std::convert::Infallible;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::{Duration, UNIX_EPOCH};

use axum::extract::{RawQuery, State};
use axum::http::StatusCode;
use axum::response::sse::{Event, KeepAlive, Sse};
use axum::response::{IntoResponse, Response};
use notify::{RecursiveMode, Watcher};
use serde::Serialize;
use tokio::sync::mpsc;
use tokio_stream::wrappers::UnboundedReceiverStream;
use tokio_stream::StreamExt;

use crate::files::{resolve, Root, Watch};

/// The most paths one stream may watch.
const MAX_WATCH: usize = 1024;
/// How long events settle before the paths are looked at.
const DEBOUNCE: Duration = Duration::from_millis(250);
/// How often polled paths are looked at.
const POLL: Duration = Duration::from_secs(2);
/// How often open files are looked at whatever else happens: macOS reports writes to a
/// file a process keeps open (a run's log) only when it is closed (RUN-20261024-p44p6z).
const OPEN_FILES: Duration = Duration::from_secs(1);
/// How often watched paths are looked at anyway, in case an event was lost.
const SAFETY: Duration = Duration::from_secs(30);

/// How a path is kept current.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Live {
    Notify,
    Poll,
    Off,
}

impl Live {
    pub fn as_str(self) -> &'static str {
        match self {
            Live::Notify => "notify",
            Live::Poll => "poll",
            Live::Off => "off",
        }
    }

    /// The root's `watch` setting, with `auto` decided by the filesystem `path` is on.
    pub fn of(watch: Watch, path: &Path) -> Live {
        match watch {
            Watch::Off => Live::Off,
            Watch::Poll => Live::Poll,
            Watch::Auto if is_network(path) => Live::Poll,
            Watch::Auto => Live::Notify,
        }
    }
}

/// A filesystem whose changes made on other machines produce no events here: NFS, SMB,
/// Lustre, GPFS, BeeGFS, Ceph, AFS, 9p and FUSE (sshfs) on Linux; anything not local on
/// macOS.
#[cfg(target_os = "linux")]
pub fn is_network(path: &Path) -> bool {
    use std::os::unix::ffi::OsStrExt;
    let Ok(c) = std::ffi::CString::new(path.as_os_str().as_bytes()) else {
        return false;
    };
    let mut s: libc::statfs = unsafe { std::mem::zeroed() };
    if unsafe { libc::statfs(c.as_ptr(), &mut s) } != 0 {
        return false;
    }
    matches!(
        s.f_type as u64,
        0x6969 // NFS
            | 0x517B // SMB
            | 0xFF53_4D42 // CIFS
            | 0xFE53_4D42 // SMB2
            | 0x0BD0_0BD0 // Lustre
            | 0x4750_4653 // GPFS
            | 0x1983_0326 // BeeGFS
            | 0x00C3_6400 // Ceph
            | 0x5346_414F // AFS
            | 0x6B41_4653 // kAFS
            | 0x0102_1997 // 9p
            | 0x6573_5546 // FUSE
    )
}

#[cfg(target_os = "macos")]
pub fn is_network(path: &Path) -> bool {
    use std::os::unix::ffi::OsStrExt;
    let Ok(c) = std::ffi::CString::new(path.as_os_str().as_bytes()) else {
        return false;
    };
    let mut s: libc::statfs = unsafe { std::mem::zeroed() };
    if unsafe { libc::statfs(c.as_ptr(), &mut s) } != 0 {
        return false;
    }
    s.f_flags & libc::MNT_LOCAL as u32 == 0
}

#[cfg(not(any(target_os = "linux", target_os = "macos")))]
pub fn is_network(_: &Path) -> bool {
    false
}

/// What a path looks like now, for comparison with what was last sent.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Snap {
    exists: bool,
    size: u64,
    mtime: u128,
}

fn snap(abs: &Path, dir: bool) -> Snap {
    match std::fs::metadata(abs) {
        Ok(m) => Snap {
            exists: true,
            size: if dir { 0 } else { m.len() },
            mtime: m
                .modified()
                .ok()
                .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                .map_or(0, |d| d.as_nanos()),
        },
        Err(_) => Snap {
            exists: false,
            size: 0,
            mtime: 0,
        },
    }
}

/// One `change` event: a watched file or directory as it is now.
#[derive(Serialize)]
struct Change<'a> {
    path: &'a str,
    kind: &'static str,
    exists: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    size: Option<u64>,
    /// milliseconds, as in listings
    #[serde(skip_serializing_if = "Option::is_none")]
    mtime: Option<u64>,
}

struct Item {
    path: String,
    abs: PathBuf,
    dir: bool,
    live: Live,
    last: Option<Snap>,
}

impl Item {
    fn event(&self, s: Snap) -> Event {
        let change = Change {
            path: &self.path,
            kind: if self.dir { "dir" } else { "file" },
            exists: s.exists,
            size: (s.exists && !self.dir).then_some(s.size),
            mtime: s.exists.then_some((s.mtime / 1_000_000) as u64),
        };
        Event::default()
            .event("change")
            .data(serde_json::to_string(&change).expect("serialisable"))
    }
}

pub(crate) async fn events_handler(
    State(app): State<crate::App>,
    RawQuery(query): RawQuery,
) -> Response {
    let paths: BTreeSet<String> = form_urlencoded::parse(query.unwrap_or_default().as_bytes())
        .filter(|(k, _)| k == "watch")
        .map(|(_, v)| v.into_owned())
        .collect();
    if paths.len() > MAX_WATCH {
        return (
            StatusCode::BAD_REQUEST,
            format!("watch at most {MAX_WATCH} paths\n"),
        )
            .into_response();
    }
    let (tx, rx) = mpsc::unbounded_channel::<Event>();
    tokio::spawn(watch(app.roots.clone(), paths, tx));
    let stream = UnboundedReceiverStream::new(rx).map(Ok::<_, Infallible>);
    Sse::new(stream)
        .keep_alive(KeepAlive::new().interval(Duration::from_secs(15)))
        .into_response()
}

/// Look at every item that can change and send what did. False when the stream is gone.
async fn check(items: &mut [Item], tx: &mpsc::UnboundedSender<Event>) -> bool {
    let probes: Vec<(PathBuf, bool)> = items.iter().map(|i| (i.abs.clone(), i.dir)).collect();
    let Ok(snaps) = tokio::task::spawn_blocking(move || {
        probes
            .iter()
            .map(|(abs, dir)| snap(abs, *dir))
            .collect::<Vec<_>>()
    })
    .await
    else {
        return true;
    };
    for (item, s) in items.iter_mut().zip(snaps) {
        if item.live == Live::Off && item.last.is_some() {
            continue;
        }
        if item.last != Some(s) {
            item.last = Some(s);
            if tx.send(item.event(s)).is_err() {
                return false;
            }
        }
    }
    true
}

async fn watch(roots: Arc<Vec<Root>>, paths: BTreeSet<String>, tx: mpsc::UnboundedSender<Event>) {
    let resolved = tokio::task::spawn_blocking(move || {
        paths
            .into_iter()
            .map(|path| match resolve(&roots, &path) {
                Ok(t) => {
                    let dir = t.meta.is_dir();
                    let live = Live::of(t.root.watch, &t.abs);
                    Item {
                        path,
                        abs: t.abs,
                        dir,
                        live,
                        last: None,
                    }
                }
                // gone already, or never there: reported once as not existing
                Err(_) => Item {
                    path,
                    abs: PathBuf::new(),
                    dir: false,
                    live: Live::Off,
                    last: None,
                },
            })
            .collect::<Vec<_>>()
    })
    .await;
    let Ok(mut items) = resolved else { return };

    // what each path is now, so a change between the page loading and subscribing is seen
    if !check(&mut items, &tx).await {
        return;
    }

    // filesystem events only say when to look
    let (ntx, mut nrx) = mpsc::unbounded_channel::<()>();
    let mut watcher = notify::recommended_watcher(move |_: notify::Result<notify::Event>| {
        let _ = ntx.send(());
    })
    .ok();
    let mut watched = BTreeSet::new();
    for item in items.iter_mut().filter(|i| i.live == Live::Notify) {
        let target = if item.dir {
            item.abs.clone()
        } else {
            item.abs.parent().map(Path::to_path_buf).unwrap_or_default()
        };
        if watched.contains(&target) {
            continue;
        }
        let ok = watcher
            .as_mut()
            .is_some_and(|w| w.watch(&target, RecursiveMode::NonRecursive).is_ok());
        if ok {
            watched.insert(target);
        } else {
            // out of watches, or the platform refused: poll this one
            item.live = Live::Poll;
        }
    }
    let polling = items.iter().any(|i| i.live == Live::Poll);
    let files = items.iter().any(|i| !i.dir && i.live != Live::Off);
    let period = if files {
        OPEN_FILES
    } else if polling {
        POLL
    } else {
        SAFETY
    };
    let mut tick = tokio::time::interval(period);
    tick.tick().await;
    loop {
        tokio::select! {
            got = nrx.recv() => {
                if got.is_none() {
                    // the watcher is gone; keep going on the timer
                    nrx = mpsc::unbounded_channel().1;
                    continue;
                }
                tokio::time::sleep(DEBOUNCE).await;
                while nrx.try_recv().is_ok() {}
            }
            _ = tick.tick() => {}
            _ = tx.closed() => break,
        }
        if !check(&mut items, &tx).await {
            break;
        }
    }
    drop(watcher);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn local_disk_is_not_network() {
        assert!(!is_network(&std::env::temp_dir()));
        assert_eq!(Live::of(Watch::Auto, &std::env::temp_dir()), Live::Notify);
        assert_eq!(Live::of(Watch::Poll, &std::env::temp_dir()), Live::Poll);
        assert_eq!(Live::of(Watch::Off, &std::env::temp_dir()), Live::Off);
    }

    #[test]
    fn snapshots_see_growth_and_removal() {
        let dir = std::env::temp_dir().join(format!("yajna-live-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        let f = dir.join("a.log");
        std::fs::write(&f, "one\n").unwrap();
        let a = snap(&f, false);
        assert!(a.exists && a.size == 4);
        std::fs::write(&f, "one\ntwo\n").unwrap();
        assert_ne!(snap(&f, false), a);
        std::fs::remove_file(&f).unwrap();
        assert!(!snap(&f, false).exists);
        let _ = std::fs::remove_dir_all(&dir);
    }
}
