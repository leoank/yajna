//! `yajna data`: large files in Xet-format stores (docs/data.md, ADR-0035). A store is a
//! directory of xorbs and shards with two indexes, `files/` (a file's recipe) and
//! `chunks/` (where a chunk eligible for dedup lookups lives), here or on another machine
//! over plain ssh (`sh`, `tar` and a disk there, nothing else); an ART page names a file by
//! its Xet hash. `add` writes to this machine's `local` store, `push` and `pull` copy
//! between stores, `get` writes files out, `status` says who holds what.

use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};
use std::fs;
use std::io::{BufReader, Read, Seek, SeekFrom, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

use sha2::{Digest, Sha256};
use yajna_xet::compress::Scheme;
use yajna_xet::file::{reconstruct, Packer};
use yajna_xet::shard::{FileInfo, Layout, Shard, XorbInfo, GLOBAL_DEDUP};
use yajna_xet::xorb::{Compression, Footer, Xorb};
use yajna_xet::Hash;

use crate::anywhere::{user_config, xdg, UserStore};
use crate::cli::DataAction;
use crate::init::{edit_frontmatter, insert_after, set_field};
use crate::vault::{rel, Page, Res, Vault};

const FORMAT: &str = "yajna-xet/1";

pub fn run(vault: &Vault, action: &DataAction) -> Res<i32> {
    match action {
        DataAction::Add { paths, art, project, run, title, author, to } => {
            add(vault, paths, art.as_deref(), project.as_deref(), run.as_deref(), title.as_deref(), author.as_deref(), to.as_deref())
        }
        DataAction::Push { targets, to } => push(vault, targets, to.as_deref()),
        DataAction::Pull { targets, from } => pull(vault, targets, from.as_deref()),
        DataAction::Get { targets, from, only } => get(vault, targets, from.as_deref(), only.as_deref()),
        DataAction::Status { targets } => status(vault, targets),
        DataAction::Drop { targets, from } => drop_cmd(vault, targets, from),
        DataAction::Free { targets } => free(vault, targets),
        DataAction::Check { staged } => check(vault, *staged),
    }
}

fn err(e: impl std::fmt::Display) -> String {
    e.to_string()
}

fn xet_err(e: impl std::fmt::Display) -> yajna_xet::Error {
    yajna_xet::Error::Io(std::io::Error::other(e.to_string()))
}

// --- where a store is ------------------------------------------------------------------

enum Backend {
    Dir(PathBuf),
    /// `host` as ssh takes it, `path` as written in the config (`~/` expanded there)
    Ssh { host: String, path: String },
}

/// Something to write into a store: an object, created only when absent (it is named by
/// its content), or a line added to an index file unless it is there.
enum Op {
    Put { rel: String, src: Src },
    AddLine { rel: String, line: String },
}

enum Src {
    Bytes(Vec<u8>),
    File(PathBuf),
}

pub struct Store {
    pub name: String,
    backend: Backend,
}

impl Store {
    fn describe(&self) -> String {
        match &self.backend {
            Backend::Dir(p) => p.display().to_string(),
            Backend::Ssh { host, path } => format!("{host}:{path}"),
        }
    }

    fn is_ssh(&self) -> bool {
        matches!(self.backend, Backend::Ssh { .. })
    }

    /// `ssh -T host 'cd <path> && <script>'`, with `stdin` fed to it.
    fn ssh(&self, script: &str, stdin: Option<Stdio>) -> Res<std::process::Child> {
        let Backend::Ssh { host, path } = &self.backend else { unreachable!() };
        let cd = crate::rerun::q_home(path)?;
        Command::new("ssh")
            .args(["-T", host])
            .arg(format!("cd {cd} && {script}"))
            .stdin(stdin.unwrap_or(Stdio::null()))
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("ssh {host}: {e}"))
    }

    fn ssh_lines(&self, script: &str, input: &str) -> Res<String> {
        let mut child = self.ssh(script, Some(Stdio::piped()))?;
        child.stdin.take().unwrap().write_all(input.as_bytes()).map_err(err)?;
        let out = child.wait_with_output().map_err(err)?;
        if !out.status.success() {
            return Err(format!("store {} ({}): {}", self.name, self.describe(), String::from_utf8_lossy(&out.stderr).trim()));
        }
        Ok(String::from_utf8_lossy(&out.stdout).into_owned())
    }

    /// Whether it is a store of this format; `Err` when it cannot be reached.
    fn is_store(&self) -> Res<bool> {
        let text = match &self.backend {
            Backend::Dir(root) => fs::read_to_string(root.join("store.toml")).unwrap_or_default(),
            Backend::Ssh { .. } => self.ssh_lines("cat store.toml 2>/dev/null; true", "")?,
        };
        Ok(text.contains(&format!("format = \"{FORMAT}\"")))
    }

    /// Make the store if it is not there yet.
    fn ensure(&self) -> Res<()> {
        let marker = format!("# a yajna data store (docs/data.md)\nformat = \"{FORMAT}\"\n");
        match &self.backend {
            Backend::Dir(root) => {
                if !self.is_store()? {
                    if root.join("store.toml").is_file() {
                        return Err(format!("{}: not a {FORMAT} store", root.display()));
                    }
                    for d in ["xorbs", "shards", "files", "chunks"] {
                        fs::create_dir_all(root.join(d)).map_err(|e| format!("{}: {e}", root.display()))?;
                    }
                    write_atomic(&root.join("store.toml"), marker.as_bytes())?;
                }
            }
            Backend::Ssh { host, path } => {
                // `cd` needs the directory: made first, outside it
                let q = crate::rerun::q_home(path)?;
                let out = Command::new("ssh")
                    .args(["-T", host])
                    .arg(format!(
                        "mkdir -p {q}/xorbs {q}/shards {q}/files {q}/chunks && cd {q} && \
                         {{ [ -f store.toml ] || printf '%s' {} > store.toml; }} && cat store.toml",
                        crate::rerun::q_home(&marker).unwrap_or_default()
                    ))
                    .output()
                    .map_err(|e| format!("ssh {host}: {e}"))?;
                if !out.status.success() {
                    return Err(format!("store {} ({}): {}", self.name, self.describe(), String::from_utf8_lossy(&out.stderr).trim()));
                }
                if !String::from_utf8_lossy(&out.stdout).contains(&format!("format = \"{FORMAT}\"")) {
                    return Err(format!("{}: not a {FORMAT} store", self.describe()));
                }
            }
        }
        Ok(())
    }

    /// Which of `rels` exist.
    fn exists(&self, rels: &[String]) -> Res<HashSet<String>> {
        if rels.is_empty() {
            return Ok(HashSet::new());
        }
        match &self.backend {
            Backend::Dir(root) => Ok(rels.iter().filter(|r| root.join(r).is_file()).cloned().collect()),
            Backend::Ssh { .. } => {
                let out = self.ssh_lines("while IFS= read -r f; do [ -f \"$f\" ] && printf '%s\\n' \"$f\"; done; true", &(rels.join("\n") + "\n"))?;
                Ok(out.lines().map(str::to_string).collect())
            }
        }
    }

    /// Copy `rels` (which exist) into `dir`, at the same relative paths.
    fn fetch_into(&self, rels: &[String], dir: &Path) -> Res<()> {
        if rels.is_empty() {
            return Ok(());
        }
        match &self.backend {
            Backend::Dir(root) => {
                for r in rels {
                    let to = dir.join(r);
                    fs::create_dir_all(to.parent().unwrap()).map_err(err)?;
                    if fs::hard_link(root.join(r), &to).is_err() {
                        fs::copy(root.join(r), &to).map_err(|e| format!("{r}: {e}"))?;
                    }
                }
                Ok(())
            }
            Backend::Ssh { .. } => {
                fs::create_dir_all(dir).map_err(err)?;
                let mut child = self.ssh("tar -cf - -T -", Some(Stdio::piped()))?;
                let mut stdin = child.stdin.take().unwrap();
                let list = rels.join("\n") + "\n";
                let writer = std::thread::spawn(move || stdin.write_all(list.as_bytes()));
                let status = Command::new("tar")
                    .arg("-xf")
                    .arg("-")
                    .arg("-C")
                    .arg(dir)
                    .stdin(child.stdout.take().unwrap())
                    .status()
                    .map_err(|e| format!("tar: {e}"))?;
                let _ = writer.join();
                let out = child.wait_with_output().map_err(err)?;
                if !status.success() || !out.status.success() {
                    return Err(format!("store {} ({}): fetching {} file(s): {}", self.name, self.describe(), rels.len(), String::from_utf8_lossy(&out.stderr).trim()));
                }
                Ok(())
            }
        }
    }

    /// The contents of those of `rels` that exist.
    fn read(&self, rels: &[String], staging: &Path) -> Res<HashMap<String, Vec<u8>>> {
        match &self.backend {
            Backend::Dir(root) => Ok(rels.iter().filter_map(|r| fs::read(root.join(r)).ok().map(|b| (r.clone(), b))).collect()),
            Backend::Ssh { .. } => {
                let have: Vec<String> = self.exists(rels)?.into_iter().collect();
                let dir = staging.join("read");
                self.fetch_into(&have, &dir)?;
                let out = have.iter().map(|r| fs::read(dir.join(r)).map(|b| (r.clone(), b)).map_err(err)).collect();
                let _ = fs::remove_dir_all(&dir);
                out
            }
        }
    }

    /// Write `ops` in order: objects before the shard that names them, the shard before
    /// the index entries that point at it.
    fn apply(&self, ops: Vec<Op>, staging: &Path) -> Res<()> {
        match &self.backend {
            Backend::Dir(root) => {
                for op in ops {
                    match op {
                        Op::Put { rel, src } => {
                            let to = root.join(&rel);
                            if to.is_file() {
                                continue;
                            }
                            match src {
                                Src::Bytes(b) => write_atomic(&to, &b)?,
                                Src::File(f) => copy_atomic(&f, &to)?,
                            }
                        }
                        Op::AddLine { rel, line } => {
                            let to = root.join(&rel);
                            let have = fs::read_to_string(&to).unwrap_or_default();
                            if !have.lines().any(|l| l == line) {
                                write_atomic(&to, format!("{have}{line}\n").as_bytes())?;
                            }
                        }
                    }
                }
                Ok(())
            }
            Backend::Ssh { .. } => {
                // stage the objects and a script that moves each into place unless present,
                // send them as one tar stream, run the script there
                let dir = staging.join("out");
                fs::create_dir_all(&dir).map_err(err)?;
                let mut script = String::from("set -e\nt=\"$1\"\n");
                for (i, op) in ops.into_iter().enumerate() {
                    match op {
                        Op::Put { rel, src } => {
                            let name = format!("o{i}");
                            match src {
                                Src::Bytes(b) => fs::write(dir.join(&name), b).map_err(err)?,
                                Src::File(f) => {
                                    if fs::hard_link(&f, dir.join(&name)).is_err() {
                                        fs::copy(&f, dir.join(&name)).map_err(|e| format!("{}: {e}", f.display()))?;
                                    }
                                }
                            }
                            let parent = rel.rsplit_once('/').map(|p| p.0).unwrap_or(".");
                            script.push_str(&format!("[ -f {rel} ] || {{ mkdir -p {parent} && mv \"$t/{name}\" {rel}; }}\n"));
                        }
                        Op::AddLine { rel, line } => {
                            let parent = rel.rsplit_once('/').map(|p| p.0).unwrap_or(".");
                            script.push_str(&format!("mkdir -p {parent}; grep -qxF {line} {rel} 2>/dev/null || printf '%s\\n' {line} >> {rel}\n"));
                        }
                    }
                }
                fs::write(dir.join("apply.sh"), script).map_err(err)?;
                let incoming = format!(".incoming/{}-{}", std::process::id(), unique());
                let mut child = self.ssh(
                    &format!("mkdir -p {incoming} && tar -xf - -C {incoming} && sh {incoming}/apply.sh {incoming} && rm -rf {incoming}"),
                    Some(Stdio::piped()),
                )?;
                let stdin = child.stdin.take().unwrap();
                let status = Command::new("tar")
                    .arg("-cf")
                    .arg("-")
                    .arg("-C")
                    .arg(&dir)
                    .arg(".")
                    .stdout(stdin)
                    .status()
                    .map_err(|e| format!("tar: {e}"))?;
                let out = child.wait_with_output().map_err(err)?;
                let _ = fs::remove_dir_all(&dir);
                if !status.success() || !out.status.success() {
                    return Err(format!("store {} ({}): {}", self.name, self.describe(), String::from_utf8_lossy(&out.stderr).trim()));
                }
                Ok(())
            }
        }
    }

    /// The recipes this store has of `hashes`, from the first shard each is listed in.
    fn recipes(&self, hashes: &[Hash], staging: &Path) -> Res<HashMap<Hash, FileInfo>> {
        let rels: Vec<String> = hashes.iter().map(|h| fanned("files", h)).collect();
        let lists = self.read(&rels, staging)?;
        let mut want: BTreeMap<String, Vec<Hash>> = BTreeMap::new();
        for h in hashes {
            if let Some(list) = lists.get(&fanned("files", h)) {
                if let Some(first) = String::from_utf8_lossy(list).lines().find(|l| !l.is_empty()) {
                    want.entry(format!("shards/{first}")).or_default().push(*h);
                }
            }
        }
        let shards = self.read(&want.keys().cloned().collect::<Vec<_>>(), staging)?;
        let mut out = HashMap::new();
        for (rel, files) in want {
            let Some(bytes) = shards.get(&rel) else { continue };
            let mut shard = Shard::parse(bytes).map_err(|e| format!("{rel} in store {}: {e}", self.name))?;
            for h in files {
                if let Some(f) = shard.files.remove(&h) {
                    out.insert(h, f);
                }
            }
        }
        Ok(out)
    }

    /// For each of `hashes`: whether this store can rebuild it.
    fn holdings(&self, hashes: &[Hash], staging: &Path) -> Res<Holdings> {
        let recipes = self.recipes(hashes, staging)?;
        let xorbs: BTreeSet<String> = recipes.values().flat_map(|f| f.terms.iter().map(|t| fanned("xorbs", &t.xorb))).collect();
        let have = self.exists(&xorbs.into_iter().collect::<Vec<_>>())?;
        let mut out = HashMap::new();
        for h in hashes {
            let state = match recipes.get(h) {
                None => Holding::Absent,
                Some(f) => {
                    let missing = f.terms.iter().map(|t| t.xorb).collect::<HashSet<_>>().into_iter().filter(|x| !have.contains(&fanned("xorbs", x))).count();
                    if missing == 0 {
                        Holding::Whole(f.clone())
                    } else {
                        Holding::Partial(missing)
                    }
                }
            };
            out.insert(*h, state);
        }
        Ok(out)
    }

    /// Every object under `dir` (`xorbs`, `shards`, `files`, `chunks`), as relative paths.
    fn list(&self, dir: &str) -> Res<Vec<String>> {
        match &self.backend {
            Backend::Dir(root) => {
                fn walk(base: &Path, p: &Path, out: &mut Vec<String>) {
                    for e in fs::read_dir(p).into_iter().flatten().flatten() {
                        let path = e.path();
                        let name = e.file_name().to_string_lossy().to_string();
                        if path.is_dir() {
                            walk(base, &path, out);
                        } else if !name.starts_with('.') {
                            out.push(path.strip_prefix(base).unwrap().to_string_lossy().replace('\\', "/"));
                        }
                    }
                }
                let mut out = Vec::new();
                walk(root, &root.join(dir), &mut out);
                Ok(out)
            }
            Backend::Ssh { .. } => {
                let out = self.ssh_lines(&format!("[ ! -d {dir} ] || find {dir} -type f ! -name '.*'"), "")?;
                Ok(out.lines().map(str::to_string).collect())
            }
        }
    }

    /// Delete `rels`, in order.
    fn remove(&self, rels: &[String]) -> Res<()> {
        if rels.is_empty() {
            return Ok(());
        }
        match &self.backend {
            Backend::Dir(root) => {
                for r in rels {
                    match fs::remove_file(root.join(r)) {
                        Err(e) if e.kind() != std::io::ErrorKind::NotFound => return Err(format!("{r}: {e}")),
                        _ => {}
                    }
                }
                Ok(())
            }
            Backend::Ssh { .. } => {
                self.ssh_lines("while IFS= read -r f; do rm -f \"$f\"; done", &(rels.join("\n") + "\n"))?;
                Ok(())
            }
        }
    }

    /// Hold off drops while this lives: a `locks/write-*` directory, made only when no
    /// drop runs (waiting up to `YAJNA_LOCK_WAIT` seconds, 600 by default, for one to end).
    fn lock_write(&self) -> Res<Lock<'_>> {
        let name = format!("locks/write-{}-{:x}", std::process::id(), fastrand::u64(..));
        let wait = lock_wait();
        match &self.backend {
            Backend::Dir(root) => {
                fs::create_dir_all(root.join("locks")).map_err(err)?;
                let start = std::time::Instant::now();
                loop {
                    fs::create_dir(root.join(&name)).map_err(|e| format!("{name}: {e}"))?;
                    if !root.join("locks/drop").exists() {
                        break;
                    }
                    let _ = fs::remove_dir(root.join(&name));
                    if start.elapsed().as_secs() >= wait {
                        return Err(format!("store {} is being dropped from (locks/drop); try again when that ends", self.name));
                    }
                    std::thread::sleep(std::time::Duration::from_secs(1));
                }
            }
            Backend::Ssh { .. } => {
                self.ssh_lines(
                    &format!(
                        "mkdir -p locks; i=0; while :; do mkdir {name}; [ -d locks/drop ] || exit 0; rmdir {name}; \
                         i=$((i+1)); if [ $i -gt {wait} ]; then echo 'store {} is being dropped from (locks/drop); try again when that ends' >&2; exit 3; fi; sleep 1; done",
                        self.name
                    ),
                    "",
                )?;
            }
        }
        Ok(Lock { store: self, rel: name })
    }

    /// The drop lock, `locks/drop`, taken once no write lock younger than six hours is held
    /// (an older one is a writer that died).
    fn lock_drop(&self) -> Res<Lock<'_>> {
        let wait = lock_wait();
        let busy = || format!("store {} is in use by another yajna (locks/write-*); try again when it ends", self.name);
        match &self.backend {
            Backend::Dir(root) => {
                fs::create_dir_all(root.join("locks")).map_err(err)?;
                fs::create_dir(root.join("locks/drop")).map_err(|_| format!("another drop from store {} runs (locks/drop)", self.name))?;
                let start = std::time::Instant::now();
                loop {
                    let fresh = fs::read_dir(root.join("locks")).map_err(err)?.flatten().any(|e| {
                        e.file_name().to_string_lossy().starts_with("write-")
                            && e.metadata().and_then(|m| m.modified()).ok().and_then(|t| t.elapsed().ok()).is_some_and(|age| age.as_secs() < 6 * 3600)
                    });
                    if !fresh {
                        break;
                    }
                    if start.elapsed().as_secs() >= wait {
                        let _ = fs::remove_dir(root.join("locks/drop"));
                        return Err(busy());
                    }
                    std::thread::sleep(std::time::Duration::from_secs(1));
                }
            }
            Backend::Ssh { .. } => {
                self.ssh_lines(
                    &format!(
                        "mkdir -p locks; mkdir locks/drop 2>/dev/null || {{ echo 'another drop from store {} runs (locks/drop)' >&2; exit 3; }}; i=0; \
                         while [ -n \"$(find locks -name 'write-*' -mmin -360 | head -1)\" ]; do i=$((i+1)); \
                         if [ $i -gt {wait} ]; then rmdir locks/drop; echo {} >&2; exit 3; fi; sleep 1; done",
                        self.name,
                        crate::rerun::q_home(&busy()).unwrap_or_default()
                    ),
                    "",
                )?;
            }
        }
        Ok(Lock { store: self, rel: "locks/drop".into() })
    }

    /// The local directory of a directory store.
    fn dir(&self) -> Option<&Path> {
        match &self.backend {
            Backend::Dir(p) => Some(p),
            Backend::Ssh { .. } => None,
        }
    }
}

/// What a store holds of each file asked about.
type Holdings = HashMap<Hash, Holding>;

/// A lock directory in a store, removed when dropped.
struct Lock<'a> {
    store: &'a Store,
    rel: String,
}

impl Drop for Lock<'_> {
    fn drop(&mut self) {
        match &self.store.backend {
            Backend::Dir(root) => {
                let _ = fs::remove_dir(root.join(&self.rel));
            }
            Backend::Ssh { .. } => {
                let _ = self.store.ssh_lines(&format!("rmdir {}", self.rel), "");
            }
        }
    }
}

fn lock_wait() -> u64 {
    std::env::var("YAJNA_LOCK_WAIT").ok().and_then(|s| s.parse().ok()).unwrap_or(600)
}

#[derive(Clone)]
enum Holding {
    Whole(FileInfo),
    /// the recipe, missing this many xorbs
    Partial(usize),
    Absent,
}

fn fanned(dir: &str, h: &Hash) -> String {
    let hex = h.hex();
    format!("{dir}/{}/{hex}", &hex[..2])
}

fn unique() -> u64 {
    use std::sync::atomic::{AtomicU64, Ordering};
    static N: AtomicU64 = AtomicU64::new(0);
    N.fetch_add(1, Ordering::Relaxed)
}

fn write_atomic(path: &Path, bytes: &[u8]) -> Res<()> {
    let dir = path.parent().unwrap();
    fs::create_dir_all(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    let tmp = dir.join(format!(".{}.{}-{}.tmp", path.file_name().unwrap().to_string_lossy(), std::process::id(), unique()));
    fs::write(&tmp, bytes).map_err(|e| format!("{}: {e}", tmp.display()))?;
    fs::rename(&tmp, path).map_err(|e| format!("{}: {e}", path.display()))
}

fn copy_atomic(from: &Path, to: &Path) -> Res<()> {
    let dir = to.parent().unwrap();
    fs::create_dir_all(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    let tmp = dir.join(format!(".{}.{}-{}.tmp", to.file_name().unwrap().to_string_lossy(), std::process::id(), unique()));
    fs::copy(from, &tmp).map_err(|e| format!("{}: {e}", from.display()))?;
    fs::rename(&tmp, to).map_err(|e| format!("{}: {e}", to.display()))
}

/// The stores on this machine: `local` first, then the configured ones by name.
pub fn stores() -> Res<Vec<Store>> {
    let config = user_config()?;
    let local_default = xdg("XDG_DATA_HOME", ".local/share").join("yajna").join("store");
    let mut named: BTreeMap<String, Store> = BTreeMap::new();
    for (name, s) in &config.stores {
        let backend = match s {
            UserStore::Path(p) | UserStore::Table { path: p, ssh: None } => Backend::Dir(PathBuf::from(crate::serve::expand(p))),
            UserStore::Table { path, ssh: Some(host) } => Backend::Ssh { host: host.clone(), path: path.clone() },
        };
        named.insert(name.clone(), Store { name: name.clone(), backend });
    }
    let local = named.remove("local").unwrap_or(Store { name: "local".into(), backend: Backend::Dir(local_default) });
    if local.is_ssh() {
        return Err("the store named local must be on this machine".into());
    }
    let mut out = vec![local];
    out.extend(named.into_values());
    Ok(out)
}

fn named<'a>(all: &'a [Store], name: &str) -> Res<&'a Store> {
    all.iter()
        .find(|s| s.name == name)
        .ok_or_else(|| format!("no store {name}: name it under [stores] in {}", crate::anywhere::config_path().display()))
}

/// A scratch directory inside `local` (so files hard-link into it), removed when dropped.
struct Staging(PathBuf);

impl Staging {
    fn new(local: &Store) -> Res<Staging> {
        let root = local.dir().unwrap().join(".staging").join(format!("{}-{}", std::process::id(), unique()));
        fs::create_dir_all(&root).map_err(err)?;
        Ok(Staging(root))
    }
}

impl Drop for Staging {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

/// The writes that store a shard and index it: its files' recipes, and the chunks a dedup
/// lookup may ask for (those eligible by hash and the flagged ones, a file's first).
fn shard_ops(shard: &Shard) -> Vec<Op> {
    let bytes = shard.to_bytes(Layout::Stored);
    let hex = yajna_xet::hash::chunk_hash(&bytes).hex();
    let mut ops = vec![Op::Put { rel: format!("shards/{hex}"), src: Src::Bytes(bytes) }];
    for f in shard.files.keys() {
        ops.push(Op::AddLine { rel: fanned("files", f), line: hex.clone() });
    }
    for x in shard.xorbs.values() {
        for c in &x.chunks {
            if c.flags & GLOBAL_DEDUP != 0 || c.hash.global_dedup_eligible() {
                ops.push(Op::Put { rel: fanned("chunks", &c.hash), src: Src::Bytes(format!("{hex}\n").into_bytes()) });
            }
        }
    }
    ops
}

/// A shard of `files` and the new `xorbs`, a file's first chunk flagged where it lies in one.
fn shard_of(files: &[FileInfo], xorbs: Vec<XorbInfo>) -> Shard {
    let mut firsts: HashMap<Hash, Vec<u32>> = HashMap::new();
    for t in files.iter().filter_map(|f| f.terms.first()) {
        firsts.entry(t.xorb).or_default().push(t.start);
    }
    let mut shard = Shard::default();
    for mut x in xorbs {
        for &i in firsts.get(&x.hash).into_iter().flatten() {
            x.chunks[i as usize].flags |= GLOBAL_DEDUP;
        }
        shard.xorbs.insert(x.hash, x);
    }
    for f in files {
        shard.files.insert(f.hash, f.clone());
    }
    shard
}

/// The footer at the end of a serialized xorb on disk, without reading its chunks.
fn footer_of(path: &Path) -> Res<(Footer, u32)> {
    let mut f = fs::File::open(path).map_err(|e| format!("{}: {e}", path.display()))?;
    let len = f.metadata().map_err(err)?.len();
    let mut n = [0u8; 4];
    f.seek(SeekFrom::End(-4)).map_err(err)?;
    f.read_exact(&mut n).map_err(err)?;
    let info = u32::from_le_bytes(n) as u64 + 4;
    if info > len {
        return Err(format!("{}: not a xorb with a footer", path.display()));
    }
    let mut tail = vec![0u8; info as usize];
    f.seek(SeekFrom::End(-(info as i64))).map_err(err)?;
    f.read_exact(&mut tail).map_err(err)?;
    Ok((Footer::parse(&tail).map_err(|e| format!("{}: {e}", path.display()))?, len as u32))
}

/// Copy the files `recipes` describes from `from` to `to`: the xorbs `to` lacks, then a
/// shard of their recipes and the new xorbs, then its index entries. Returns the xorbs and
/// bytes sent.
fn copy(from: &Store, to: &Store, recipes: &[FileInfo], staging: &Path) -> Res<(usize, u64)> {
    let _lock = to.lock_write()?;
    let need: BTreeSet<String> = recipes.iter().flat_map(|f| f.terms.iter().map(|t| fanned("xorbs", &t.xorb))).collect();
    let have = to.exists(&need.iter().cloned().collect::<Vec<_>>())?;
    let missing: Vec<String> = need.into_iter().filter(|r| !have.contains(r)).collect();
    let src_dir = match from.dir() {
        Some(d) => d.to_path_buf(),
        None => {
            let d = staging.join("in");
            from.fetch_into(&missing, &d)?;
            d
        }
    };
    let mut ops = Vec::new();
    let mut infos = Vec::new();
    let mut bytes = 0u64;
    for r in &missing {
        let path = src_dir.join(r);
        let (footer, len) = footer_of(&path)?;
        if fanned("xorbs", &footer.hash) != *r {
            return Err(format!("{r} in store {} holds xorb {}", from.name, footer.hash));
        }
        bytes += len as u64;
        infos.push(XorbInfo::from_footer(&footer, len));
        ops.push(Op::Put { rel: r.clone(), src: Src::File(path) });
    }
    ops.extend(shard_ops(&shard_of(recipes, infos)));
    to.apply(ops, staging)?;
    Ok((missing.len(), bytes))
}

// --- add -------------------------------------------------------------------------------

fn compression(vault: &Vault) -> Res<Compression> {
    match vault.cfg.data.compression.as_deref() {
        None | Some("lz4") => Ok(Compression::Auto),
        Some("zstd") => Ok(Compression::Fixed(Scheme::Zstd)),
        Some(other) => Err(format!("[data] compression = {other:?} in yajna.toml: lz4 or zstd")),
    }
}

/// What `add` was given: a file, or a folder and the files under it (relative paths, sorted).
struct Source {
    path: PathBuf,
    members: Option<Vec<String>>,
}

impl Source {
    fn of(p: &Path) -> Res<Source> {
        let meta = fs::metadata(p).map_err(|e| format!("{}: {e}", p.display()))?;
        let path = fs::canonicalize(p).map_err(|e| format!("{}: {e}", p.display()))?;
        let members = if meta.is_dir() { Some(walk_bundle(&path)?) } else { None };
        Ok(Source { path, members })
    }
}

/// The files under `dir`, as sorted relative paths with `/`; symlinks and names a manifest
/// line cannot hold are refused.
fn walk_bundle(dir: &Path) -> Res<Vec<String>> {
    fn walk(base: &Path, p: &Path, out: &mut Vec<String>) -> Res<()> {
        for e in fs::read_dir(p).map_err(|e| format!("{}: {e}", p.display()))? {
            let e = e.map_err(err)?;
            let path = e.path();
            let t = e.file_type().map_err(err)?;
            if t.is_symlink() {
                return Err(format!("{} is a symlink: a bundle holds files and folders only", path.display()));
            }
            if t.is_dir() {
                walk(base, &path, out)?;
                continue;
            }
            let rel = path.strip_prefix(base).unwrap().to_string_lossy().replace('\\', "/");
            if rel.contains(['\t', '\n', '\r']) {
                return Err(format!("{}: a name with a tab or newline cannot go in a bundle's manifest", path.display()));
            }
            out.push(rel);
        }
        Ok(())
    }
    let mut out = Vec::new();
    walk(dir, dir, &mut out)?;
    if out.is_empty() {
        return Err(format!("{} has no files", dir.display()));
    }
    out.sort();
    Ok(out)
}

/// A reader that also takes the sha256 of what passes through.
struct ShaReader<R> {
    inner: R,
    sha: Sha256,
}

impl<R: Read> Read for ShaReader<R> {
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        let n = self.inner.read(buf)?;
        self.sha.update(&buf[..n]);
        Ok(n)
    }
}

/// One source's worth of what was packed: the file, or the bundle's manifest.
struct Packed {
    xet: Hash,
    sha256: String,
    /// the file's size, or the sum of a bundle's files
    size: u64,
    deduped: u64,
    /// a bundle's file count
    files: Option<usize>,
}

/// Store `sources` in `local`, deduplicated against what it holds, under its write lock:
/// what each became, and the recipes of every file stored (for a push after).
fn pack_local(local: &Store, compression: Compression, sources: &[Source]) -> Res<(Vec<Packed>, Vec<FileInfo>)> {
    local.ensure()?;
    let staging = Staging::new(local)?;
    let root = local.dir().unwrap().to_path_buf();
    // a drop must not delete a xorb this add has just deduplicated against
    let _lock = local.lock_write()?;
    // bundles' manifests go in xorbs of their own, so reading one fetches kilobytes, not
    // the last 64 MB of a session
    let new_xorbs: std::cell::RefCell<Vec<XorbInfo>> = Default::default();
    let mut packed = Vec::new();
    let files = {
        let sink = |x: Xorb| {
            let rel = fanned("xorbs", &x.footer.hash);
            if !root.join(&rel).is_file() {
                write_atomic(&root.join(&rel), &x.bytes).map_err(xet_err)?;
            }
            new_xorbs.borrow_mut().push(XorbInfo::from_footer(&x.footer, x.bytes.len() as u32));
            Ok(())
        };
        let mut packer = Packer::new(compression, sink);
        let mut manifests = Packer::new(compression, sink);
        let lookup = |h: &Hash| -> Res<Vec<XorbInfo>> {
            let Ok(hex) = fs::read_to_string(root.join(fanned("chunks", h))) else { return Ok(Vec::new()) };
            let path = root.join("shards").join(hex.trim());
            let bytes = fs::read(&path).map_err(|e| format!("{}: {e}", path.display()))?;
            Ok(Shard::parse(&bytes).map_err(|e| format!("{}: {e}", path.display()))?.xorbs.into_values().collect())
        };
        let pack = |packer: &mut Packer, path: &Path, reader: &mut dyn Read| -> Res<(yajna_xet::file::Added, String)> {
            let mut r = ShaReader { inner: BufReader::new(reader), sha: Sha256::new() };
            let a = packer.add_with(&mut r, &mut |h| lookup(h).map_err(xet_err)).map_err(|e| format!("{}: {e}", path.display()))?;
            Ok((a, format!("{:x}", r.sha.finalize())))
        };
        for src in sources {
            let open = |p: &Path| fs::File::open(p).map_err(|e| format!("{}: {e}", p.display()));
            match &src.members {
                None => {
                    let (a, sha256) = pack(&mut packer, &src.path, &mut open(&src.path)?)?;
                    packed.push(Packed { xet: a.hash, sha256, size: a.bytes, deduped: a.deduped, files: None });
                }
                Some(members) => {
                    // every file, then the manifest naming them
                    let mut manifest = String::from(MANIFEST_HEADER);
                    let (mut size, mut deduped) = (0, 0);
                    for rel in members {
                        let path = src.path.join(rel);
                        let (a, sha256) = pack(&mut packer, &path, &mut open(&path)?)?;
                        manifest.push_str(&format!("{rel}\t{}\t{sha256}\t{}\n", a.bytes, a.hash.hex()));
                        size += a.bytes;
                        deduped += a.deduped;
                    }
                    let (a, sha256) = pack(&mut manifests, &src.path, &mut manifest.as_bytes())?;
                    packed.push(Packed { xet: a.hash, sha256, size, deduped, files: Some(members.len()) });
                }
            }
        }
        let mut files = packer.finish().map_err(err)?;
        files.extend(manifests.finish().map_err(err)?);
        files
    };
    local.apply(shard_ops(&shard_of(&files, new_xorbs.into_inner())), &staging.0)?;
    Ok((packed, files))
}

/// Where a stored file is written out: its own path when inside the notebook (then kept out
/// of git), else `data/<ART id>/<name>`.
fn home_of(vault: &Vault, src: &Path, id: &str) -> Res<String> {
    let name = src.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
    let vroot = fs::canonicalize(&vault.root).map_err(err)?;
    let path = match src.strip_prefix(&vroot) {
        Ok(inside) => inside.to_string_lossy().replace('\\', "/"),
        Err(_) => format!("data/{id}/{name}"),
    };
    ignore(vault, &path)?;
    Ok(path)
}

/// The fields of a stored page, set where the page has them and added after `hash`
/// otherwise.
fn put_stored(fm: &mut Vec<String>, path: &str, p: &Packed) {
    set_field(fm, "store", "xet");
    set_field(fm, "path", path);
    set_field(fm, "hash", &format!("sha256:{}", p.sha256));
    let mut fields = vec![("xet", p.xet.hex()), ("size", p.size.to_string())];
    match p.files {
        None => fields.push(("kind", "file".into())),
        Some(n) => fields.extend([("kind", "bundle".into()), ("files", n.to_string())]),
    }
    let mut after = "hash";
    for (k, v) in fields {
        if fm.iter().any(|l| l.starts_with(&format!("{k}:"))) {
            set_field(fm, k, &v);
        } else {
            insert_after(fm, after, &format!("{k}: {v}"));
        }
        after = k;
    }
}

fn stored_msg(id: &str, name: &str, store: &str, p: &Packed) -> String {
    match p.files {
        None => format!("{id}: {name} stored in {store} ({}, {} of it already there)", human(p.size), human(p.deduped)),
        Some(n) => format!("{id}: {name}/ stored in {store} as a bundle of {n} file(s) ({}, {} of it already there)", human(p.size), human(p.deduped)),
    }
}

#[allow(clippy::too_many_arguments)]
fn add(vault: &Vault, paths: &[PathBuf], art: Option<&str>, project: Option<&str>, run: Option<&str>, title: Option<&str>, author: Option<&str>, to: Option<&str>) -> Res<i32> {
    if let Some(art) = art {
        return convert(vault, art, paths, to);
    }
    if title.is_some() && paths.len() > 1 {
        return Err("--title names one file's page; leave it out for several".into());
    }
    let run_page = run.map(|r| vault.find(r)).transpose()?;
    if let Some(p) = &run_page {
        if p.field("type") != Some("run") {
            return Err(format!("{} is not a run", p.id().unwrap_or("")));
        }
    }
    let project = project.map(str::to_string).or_else(|| run_page.as_ref().and_then(|p| p.field("project").map(str::to_string)));
    // what the page needs is checked before anything is stored
    if project.is_none() && !vault.is_project() {
        return Err("an artifact needs --project PRJ-xxxx (or --run RUN-…)".into());
    }
    if let Some(p) = &project {
        vault.find(p)?;
    }
    let compression = compression(vault)?;
    let all = stores()?;
    if let Some(t) = to {
        named(&all, t)?;
    }
    let sources = paths.iter().map(|p| Source::of(p)).collect::<Res<Vec<_>>>()?;
    let local = &all[0];
    let (packed, files) = pack_local(local, compression, &sources)?;

    for (src, p) in sources.iter().zip(&packed) {
        let name = src.path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
        let page = crate::commands::create(vault, "artifact", Some(title.unwrap_or(&name)), project.as_deref(), None, None, false, author, None, None)?;
        let id = page.file_name().unwrap().to_string_lossy()[..19].to_string();
        let path = home_of(vault, &src.path, &id)?;
        let text = crate::vault::read_text(&page).map_err(err)?;
        let text = edit_frontmatter(&text, |fm| {
            if let Some(r) = run_page.as_ref().and_then(|p| p.id()) {
                set_field(fm, "run", r);
            }
            put_stored(fm, &path, p);
        });
        fs::write(&page, text).map_err(err)?;
        eprintln!("{}", stored_msg(&id, &name, &local.name, p));
        println!("{}", rel(&page, &vault.root));
    }
    push_after(&all, to, &files)
}

/// `add --to`: push what was just stored.
fn push_after(all: &[Store], to: Option<&str>, files: &[FileInfo]) -> Res<i32> {
    if let Some(t) = to {
        let store = named(all, t)?;
        store.ensure()?;
        let staging = Staging::new(&all[0])?;
        let (n, bytes) = copy(&all[0], store, files, &staging.0)?;
        eprintln!("pushed {} file(s) to {}: {n} xorb(s), {}", files.len(), store.name, human(bytes));
    }
    Ok(0)
}

/// `add --art`: store the data of a `store: path` page and rewrite the page to name it.
fn convert(vault: &Vault, art: &str, paths: &[PathBuf], to: Option<&str>) -> Res<i32> {
    let page = vault.find(art)?;
    let id = page.id().unwrap_or(art).to_string();
    if page.field("type") != Some("artifact") {
        return Err(format!("{id} is not an artifact"));
    }
    if page.field("store") == Some("xet") {
        return Err(format!("{id} is in a data store already"));
    }
    let recorded = page.field("path").unwrap_or("").to_string();
    let from = match paths {
        [] if recorded.trim().is_empty() => return Err(format!("{id} records no path: give where its data is: yajna data add --art {id} <path>")),
        [] => vault.root.join(&recorded),
        [one] => one.clone(),
        _ => return Err("--art converts one page: give at most one path, where its data is".into()),
    };
    if !from.exists() {
        return Err(format!(
            "{id}: its data is not at {} here; give where it is: yajna data add --art {id} <path>",
            if paths.is_empty() { recorded.clone() } else { from.display().to_string() }
        ));
    }
    let src = Source::of(&from)?;
    let old = page.field("hash").map(str::to_string);
    let all = stores()?;
    if let Some(t) = to {
        named(&all, t)?;
    }
    if src.members.is_none() {
        // a file's recorded sha256 is checked before anything is stored
        if let Some(h) = old.as_deref().and_then(|h| h.strip_prefix("sha256:")) {
            if sha256_of(&src.path).as_deref() != Some(h) {
                return Err(format!("{id}: {} does not match the page's hash; nothing stored", src.path.display()));
            }
        }
    }
    let (packed, files) = pack_local(&all[0], compression(vault)?, std::slice::from_ref(&src))?;
    let p = &packed[0];
    let path = home_of(vault, &src.path, &id)?;
    let text = crate::vault::read_text(&page.path).map_err(err)?;
    fs::write(&page.path, edit_frontmatter(&text, |fm| put_stored(fm, &path, p))).map_err(err)?;
    let name = src.path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
    eprintln!("{}", stored_msg(&id, &name, &all[0].name, p));
    if src.members.is_some() && old.as_ref().is_some_and(|h| *h != format!("sha256:{}", p.sha256)) {
        eprintln!("{id}: hash is now the manifest's sha256 (it was {}); the old one means what the page says it does", old.unwrap());
    }
    if path != recorded {
        eprintln!("{id}: path is now {path} (it was {recorded:?}); `yajna data get {id}` writes it there");
    }
    println!("{}", rel(&page.path, &vault.root));
    push_after(&all, to, &files)
}

/// The run outputs among `files` (as recorded, and where they are) at least `[data]
/// outputs_min` large, stored in `local`: their Xet hashes by recorded path. Those inside
/// the notebook are kept out of git.
pub(crate) fn store_outputs(vault: &Vault, files: &[(String, PathBuf)]) -> Res<HashMap<String, String>> {
    let min = size_setting(vault.cfg.data.outputs_min.as_deref(), "outputs_min", 1_000_000)?;
    let big: Vec<&(String, PathBuf)> = files.iter().filter(|(_, p)| fs::metadata(p).is_ok_and(|m| m.len() >= min)).collect();
    if big.is_empty() {
        return Ok(HashMap::new());
    }
    let sources = big.iter().map(|(_, p)| Source::of(p)).collect::<Res<Vec<_>>>()?;
    let all = stores()?;
    let (packed, _) = pack_local(&all[0], compression(vault)?, &sources)?;
    let mut out = HashMap::new();
    let (mut size, mut deduped) = (0, 0);
    for ((name, _), p) in big.iter().zip(&packed) {
        if !name.starts_with('$') {
            ignore(vault, name)?;
        }
        size += p.size;
        deduped += p.deduped;
        out.insert(name.clone(), p.xet.hex());
    }
    eprintln!("stored {} output(s) in {} ({}, {} of it already there)", out.len(), all[0].name, human(size), human(deduped));
    Ok(out)
}

/// A size from `[data]` (`"5 MB"`, `"500 kB"`, `"1 GiB"`, `"1000"`) in bytes.
fn size_setting(given: Option<&str>, key: &str, default: u64) -> Res<u64> {
    let Some(s) = given else { return Ok(default) };
    let bad = || format!("[data] {key} = {s:?} in yajna.toml: a size such as \"5 MB\"");
    let t = s.trim();
    let split = t.find(|c: char| !(c.is_ascii_digit() || c == '.')).unwrap_or(t.len());
    let n: f64 = t[..split].parse().map_err(|_| bad())?;
    let unit = match t[split..].trim() {
        "" | "B" => 1.0,
        "kB" | "KB" | "k" => 1e3,
        "MB" | "M" => 1e6,
        "GB" | "G" => 1e9,
        "KiB" => 1024.0,
        "MiB" => 1024.0 * 1024.0,
        "GiB" => 1024.0 * 1024.0 * 1024.0,
        _ => return Err(bad()),
    };
    Ok((n * unit) as u64)
}

/// Keep a materialized file out of git: `data/` as a whole, or the file's own path.
fn ignore(vault: &Vault, path: &str) -> Res<()> {
    let line = if path.starts_with("data/") { "/data/".to_string() } else { format!("/{path}") };
    let gi = vault.root.join(".gitignore");
    let have = fs::read_to_string(&gi).unwrap_or_default();
    if have.lines().any(|l| l.trim() == line) {
        return Ok(());
    }
    let sep = if have.is_empty() || have.ends_with('\n') { "" } else { "\n" };
    fs::write(&gi, format!("{have}{sep}{line}\n")).map_err(err)
}

fn human(n: u64) -> String {
    match n {
        n if n >= 1 << 30 => format!("{:.1} GB", n as f64 / 1e9),
        n if n >= 1 << 20 => format!("{:.1} MB", n as f64 / 1e6),
        n if n >= 1 << 10 => format!("{:.1} kB", n as f64 / 1e3),
        n => format!("{n} B"),
    }
}

// --- the pages -------------------------------------------------------------------------

/// The first line of a bundle's manifest; each line after it is one file:
/// relative path, size, sha256 and Xet hash, tab-separated, sorted by path.
const MANIFEST_HEADER: &str = "path\tsize\tsha256\txet\n";

/// A file a page names: an artifact's own file, one of a bundle's, or a run's output.
#[derive(Clone)]
struct Member {
    /// where it is written out, relative to the notebook root (or absolute, for a run's
    /// output under a recorded variable)
    path: String,
    /// what `--only` matches: the path inside a bundle, a file's name, an output as recorded
    name: String,
    xet: Hash,
    sha256: String,
    size: Option<u64>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Kind {
    File,
    Bundle,
    /// a run's stored outputs
    Run,
}

/// A page whose data is in stores: an artifact (a file or a bundle) or a run's outputs. A
/// bundle names its manifest; its files are known once `expand` has read it.
struct Stored {
    id: String,
    kind: Kind,
    /// an artifact's `path`; for a run, its stored outputs counted
    path: String,
    /// a bundle's manifest: its Xet hash and sha256
    manifest: Option<(Hash, String)>,
    size: Option<u64>,
    files: Vec<Member>,
}

impl Stored {
    /// Every Xet file the page needs in a store: a bundle's manifest, then its files.
    fn hashes(&self) -> Vec<Hash> {
        self.manifest.iter().map(|m| m.0).chain(self.files.iter().map(|m| m.xet)).collect()
    }

    fn whole_in(&self, held: &Holdings) -> bool {
        self.hashes().iter().all(|h| matches!(held.get(h), Some(Holding::Whole(_))))
    }

    /// A bundle whose manifest could not be read.
    fn unread(&self) -> bool {
        self.kind == Kind::Bundle && self.files.is_empty()
    }

    /// "3 file(s) under data/…/s1", "2 output(s)"
    fn count(&self, n: usize) -> String {
        match self.kind {
            Kind::Run => format!("{n} output(s)"),
            _ => format!("{n} file(s) under {}", self.path),
        }
    }
}

/// A run's outputs recorded with a Xet hash: (path as recorded, sha256, Xet hash).
pub(crate) fn stored_outputs(page: &Page) -> impl Iterator<Item = (String, String, Hash)> + '_ {
    page.meta
        .as_ref()
        .and_then(|m| m.get("outputs"))
        .and_then(|o| o.as_array())
        .into_iter()
        .flatten()
        .filter_map(|o| Some((o.get("path")?.as_str()?.to_string(), o.get("sha256")?.as_str()?.to_string(), Hash::from_hex(o.get("xet")?.as_str()?)?)))
}

fn stored(page: &Page) -> Res<Stored> {
    let id = page.id().unwrap_or("").to_string();
    if page.field("type") == Some("run") {
        let env = crate::rerun::env_of_page(page);
        let files = stored_outputs(page)
            .map(|(name, sha256, xet)| {
                let path = match name.strip_prefix('$').and_then(|r| r.split_once('/')) {
                    None => name.clone(),
                    // this machine's value first: the recorded one is where the run's
                    // machine kept it, which may not exist here
                    Some((var, rest)) => {
                        let here = std::env::var(var).ok().filter(|v| !v.is_empty());
                        let base = here.or_else(|| env.iter().find(|(k, _)| k == var).map(|(_, v)| v.clone()));
                        format!("{}/{rest}", base.ok_or_else(|| format!("{id}: output {name}: ${var} is neither set here nor in its env"))?)
                    }
                };
                Ok(Member { path, name, xet, sha256, size: None })
            })
            .collect::<Res<Vec<_>>>()?;
        if files.is_empty() {
            return Err(format!("{id} has no outputs in a data store (outputs at least [data] outputs_min large are stored when recorded)"));
        }
        let path = format!("{} output(s)", files.len());
        return Ok(Stored { id, kind: Kind::Run, path, manifest: None, size: None, files });
    }
    if page.field("store") != Some("xet") {
        return Err(format!("{id} is not kept in a data store (store: {})", page.field("store").unwrap_or("none")));
    }
    let xet = page.field("xet").and_then(Hash::from_hex).ok_or_else(|| format!("{id} has no xet hash"))?;
    let sha256 = page.field("hash").unwrap_or("").trim_start_matches("sha256:").to_string();
    let size = page.meta.as_ref().and_then(|m| m.get("size")).and_then(|v| v.as_u64());
    let path = page.field("path").unwrap_or("").to_string();
    Ok(if page.field("kind") == Some("bundle") {
        Stored { id, kind: Kind::Bundle, path, manifest: Some((xet, sha256)), size, files: Vec::new() }
    } else {
        let name = path.rsplit('/').next().unwrap_or(&path).to_string();
        let file = Member { path: path.clone(), name, xet, sha256, size };
        Stored { id, kind: Kind::File, path, manifest: None, size, files: vec![file] }
    })
}

/// The pages named (IDs or paths), or every page with data in stores.
fn targets(vault: &Vault, targets: &[String]) -> Res<Vec<Stored>> {
    let pages = vault.pages()?;
    let all: Vec<&Page> = pages
        .iter()
        .filter(|p| match p.field("type") {
            Some("artifact") => p.field("store") == Some("xet"),
            Some("run") => stored_outputs(p).next().is_some(),
            _ => false,
        })
        .collect();
    if targets.is_empty() {
        return all.into_iter().map(stored).collect();
    }
    targets
        .iter()
        .map(|t| {
            let by_path = t.trim_start_matches("./").trim_end_matches('/');
            let found = all.iter().find(|p| p.field("path") == Some(by_path) || stored_outputs(p).any(|o| o.0 == by_path));
            match found {
                Some(p) => stored(p),
                None => stored(&vault.find(t)?),
            }
        })
        .collect()
}

/// Read the manifests of the bundles among `pages` from `local`, pulling those it lacks
/// from the first store holding them (a manifest is small; its files are not pulled).
/// Returns the bundles whose manifest no store reached holds.
fn expand(all: &[Store], pages: &mut [Stored], staging: &Path) -> Res<Vec<String>> {
    let want: Vec<Hash> = pages.iter().filter(|p| p.files.is_empty()).filter_map(|p| p.manifest.as_ref().map(|m| m.0)).collect();
    if want.is_empty() {
        return Ok(Vec::new());
    }
    pull_hashes(all, &want, None, staging)?;
    let local = &all[0];
    let held = local.holdings(&want, staging)?;
    let root = local.dir().unwrap();
    let mut lost = Vec::new();
    for p in pages.iter_mut().filter(|p| p.files.is_empty()) {
        let Some((xet, sha256)) = &p.manifest else { continue };
        let Some(Holding::Whole(f)) = held.get(xet) else {
            lost.push(p.id.clone());
            continue;
        };
        let mut bytes = Vec::new();
        reconstruct(f, |h| fs::read(root.join(fanned("xorbs", h))).map_err(xet_err), &mut bytes).map_err(|e| format!("{}: manifest: {e}", p.id))?;
        if format!("{:x}", Sha256::digest(&bytes)) != *sha256 {
            return Err(format!("{}: the manifest in store local does not match the page's sha256", p.id));
        }
        p.files = parse_manifest(&String::from_utf8_lossy(&bytes), &p.path).map_err(|e| format!("{}: manifest: {e}", p.id))?;
    }
    Ok(lost)
}

fn parse_manifest(text: &str, under: &str) -> Res<Vec<Member>> {
    let mut lines = text.lines();
    if lines.next() != Some(MANIFEST_HEADER.trim_end()) {
        return Err("not a bundle manifest".into());
    }
    lines
        .map(|l| {
            let f: Vec<&str> = l.split('\t').collect();
            let [rel, size, sha256, xet] = f[..] else { return Err(format!("bad line {l:?}")) };
            if rel.is_empty() || rel.starts_with('/') || rel.split('/').any(|c| c == ".." || c.is_empty()) {
                return Err(format!("path {rel:?} is not inside the bundle"));
            }
            Ok(Member {
                path: format!("{under}/{rel}"),
                name: rel.to_string(),
                xet: Hash::from_hex(xet).ok_or_else(|| format!("bad hash in {l:?}"))?,
                sha256: sha256.to_string(),
                size: Some(size.parse().map_err(|_| format!("bad size in {l:?}"))?),
            })
        })
        .collect()
}

/// `expand`, failing on a bundle whose manifest no store reached holds.
fn expand_all(all: &[Store], pages: &mut [Stored], staging: &Path) -> Res<()> {
    let lost = expand(all, pages, staging)?;
    if !lost.is_empty() {
        return Err(lost.iter().map(|id| format!("{id}: its manifest is in no store reached")).collect::<Vec<_>>().join("\n"));
    }
    Ok(())
}

fn unique_hashes(pages: &[Stored]) -> Vec<Hash> {
    let set: BTreeSet<Hash> = pages.iter().flat_map(|p| p.hashes()).collect();
    set.into_iter().collect()
}

fn sha256_of(path: &Path) -> Option<String> {
    let mut f = fs::File::open(path).ok()?;
    let mut h = Sha256::new();
    std::io::copy(&mut f, &mut h).ok()?;
    Some(format!("{:x}", h.finalize()))
}

// --- push, pull, get, status -----------------------------------------------------------

fn push(vault: &Vault, targets_: &[String], to: Option<&str>) -> Res<i32> {
    let all = stores()?;
    let names: Vec<String> = match to {
        Some(t) => vec![t.to_string()],
        None if vault.cfg.data.push.is_empty() => {
            return Err("which store? give --to <store>, or list stores under [data] push in yajna.toml".into())
        }
        None => vault.cfg.data.push.clone(),
    };
    let local = &all[0];
    local.ensure()?;
    let staging = Staging::new(local)?;
    let mut pages = targets(vault, targets_)?;
    let mut failed = 0;
    for id in expand(&all, &mut pages, &staging.0)? {
        eprintln!("{id}: its manifest is in no store reached");
        failed += 1;
    }
    let hashes = unique_hashes(&pages);
    let here = local.holdings(&hashes, &staging.0)?;
    for p in pages.iter().filter(|p| !p.whole_in(&here) && !p.unread()) {
        eprintln!("{}: local does not hold {} whole; pull or add it first", p.id, p.path);
        failed += 1;
    }
    for name in names {
        let store = named(&all, &name)?;
        if store.name == "local" {
            return Err("push copies from local to another store".into());
        }
        store.ensure()?;
        let there = store.holdings(&hashes, &staging.0)?;
        let send: Vec<FileInfo> = hashes
            .iter()
            .filter(|h| !matches!(there[h], Holding::Whole(_)))
            .filter_map(|h| match &here[h] {
                Holding::Whole(f) => Some(f.clone()),
                _ => None,
            })
            .collect();
        if send.is_empty() {
            eprintln!("{}: holds them all already", store.name);
            continue;
        }
        let (n, bytes) = copy(local, store, &send, &staging.0)?;
        eprintln!("pushed {} file(s) to {}: {n} xorb(s), {}", send.len(), store.name, human(bytes));
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

/// Copy into `local` what it lacks of the files `hashes`, from `from` or the first store
/// holding each whole; returns those nothing could supply.
fn pull_hashes(all: &[Store], hashes: &[Hash], from: Option<&str>, staging: &Path) -> Res<Vec<Hash>> {
    let local = &all[0];
    let here = local.holdings(hashes, staging)?;
    let mut wanted: Vec<Hash> = hashes.iter().copied().filter(|h| !matches!(here[h], Holding::Whole(_))).collect();
    let sources: Vec<&Store> = match from {
        Some(n) => vec![named(all, n)?],
        None => all[1..].iter().collect(),
    };
    for s in sources {
        if wanted.is_empty() {
            break;
        }
        match s.is_store() {
            Ok(true) => {}
            Ok(false) => continue,
            Err(e) if from.is_none() => {
                eprintln!("{} skipped: {e}", s.name);
                continue;
            }
            Err(e) => return Err(e),
        }
        let there = s.holdings(&wanted, staging)?;
        let (take, rest): (Vec<Hash>, Vec<Hash>) = wanted.into_iter().partition(|h| matches!(there[h], Holding::Whole(_)));
        if !take.is_empty() {
            let recipes: Vec<FileInfo> = take
                .iter()
                .map(|h| match &there[h] {
                    Holding::Whole(f) => f.clone(),
                    _ => unreachable!(),
                })
                .collect();
            let (n, bytes) = copy(s, local, &recipes, staging)?;
            eprintln!("pulled {} file(s) from {}: {n} xorb(s), {}", take.len(), s.name, human(bytes));
        }
        wanted = rest;
    }
    Ok(wanted)
}

fn pull(vault: &Vault, targets_: &[String], from: Option<&str>) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let mut pages = targets(vault, targets_)?;
    let mut failed = 0;
    for id in expand(&all, &mut pages, &staging.0)? {
        eprintln!("{id}: its manifest is in no store reached");
        failed += 1;
    }
    let missing: HashSet<Hash> = pull_hashes(&all, &unique_hashes(&pages), from, &staging.0)?.into_iter().collect();
    for p in pages.iter().filter(|p| !p.unread()) {
        if p.hashes().iter().any(|h| missing.contains(h)) {
            eprintln!("{}: no store reached holds it whole", p.id);
            failed += 1;
        }
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

fn get(vault: &Vault, targets_: &[String], from: Option<&str>, only: Option<&str>) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let only = only.map(|g| globset::Glob::new(g).map(|g| g.compile_matcher()).map_err(|e| format!("--only {g}: {e}"))).transpose()?;
    let mut pages = targets(vault, targets_)?;
    expand_all(&all, &mut pages, &staging.0)?;
    let mut failed = 0;
    // (page, file) for every file to write out
    let mut todo: Vec<(&Stored, &Member)> = Vec::new();
    for p in &pages {
        let picked: Vec<&Member> = p.files.iter().filter(|m| only.as_ref().is_none_or(|g| g.is_match(&m.name))).collect();
        if picked.is_empty() {
            if only.is_some() && !targets_.is_empty() {
                eprintln!("{}: no file matches --only", p.id);
            }
            continue;
        }
        let total = picked.len();
        let mut here = 0;
        for m in picked {
            let dest = vault.root.join(&m.path);
            if dest.is_file() && sha256_of(&dest).as_deref() == Some(m.sha256.as_str()) {
                here += 1;
                if p.kind == Kind::File {
                    eprintln!("{}: {} is here already", p.id, p.path);
                }
            } else if dest.exists() && p.kind == Kind::Run {
                // a run's output may be a later run's result: never written over
                eprintln!("{}: {} differs from the recorded output; kept", p.id, m.name);
                failed += 1;
            } else {
                todo.push((p, m));
            }
        }
        if p.kind != Kind::File && here > 0 {
            eprintln!("{}: {here} of {} here already", p.id, p.count(total));
        }
    }
    // read from a directory store where the file is whole; anything else comes into local
    // first, so a remote store's xorbs cross the network once
    let direct: Option<&Store> = match from {
        Some(n) => Some(named(&all, n)?).filter(|s| s.dir().is_some()),
        None => None,
    };
    let hashes: Vec<Hash> = todo.iter().map(|(_, m)| m.xet).collect::<BTreeSet<_>>().into_iter().collect();
    if direct.is_none() {
        pull_hashes(&all, &hashes, from, &staging.0)?;
    }
    let reader = direct.unwrap_or(&all[0]);
    let held = reader.holdings(&hashes, &staging.0)?;
    let root = reader.dir().unwrap();
    let mut written: BTreeMap<&str, usize> = BTreeMap::new();
    for (p, m) in &todo {
        let Holding::Whole(file) = &held[&m.xet] else {
            eprintln!("{}: no store reached holds {} whole", p.id, m.name);
            failed += 1;
            continue;
        };
        let dest = vault.root.join(&m.path);
        if let Some(parent) = dest.parent() {
            fs::create_dir_all(parent).map_err(err)?;
        }
        let tmp = dest.with_file_name(format!(".{}.yajna-get", dest.file_name().unwrap().to_string_lossy()));
        let mut out = std::io::BufWriter::new(fs::File::create(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?);
        let result = reconstruct(file, |h| fs::read(root.join(fanned("xorbs", h))).map_err(xet_err), &mut out);
        out.flush().map_err(err)?;
        drop(out);
        if let Err(e) = result {
            let _ = fs::remove_file(&tmp);
            return Err(format!("{}: {}: {e}", p.id, m.path));
        }
        if sha256_of(&tmp).as_deref() != Some(m.sha256.as_str()) {
            let _ = fs::remove_file(&tmp);
            return Err(format!("{}: {} rebuilt from store {} does not match its sha256", p.id, m.path, reader.name));
        }
        fs::rename(&tmp, &dest).map_err(err)?;
        if p.kind == Kind::File {
            eprintln!("{}: {} from {}", p.id, p.path, reader.name);
        } else {
            *written.entry(p.id.as_str()).or_default() += 1;
        }
    }
    for p in pages.iter().filter(|p| written.contains_key(p.id.as_str())) {
        eprintln!("{}: {} from {}", p.id, p.count(written[p.id.as_str()]), reader.name);
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

/// How much of a page a store holds, as `status` says it.
fn held_state(p: &Stored, held: &Holdings) -> String {
    if p.kind == Kind::File {
        return match &held[&p.files[0].xet] {
            Holding::Whole(_) => "whole".to_string(),
            Holding::Partial(n) => format!("missing {n} xorb(s)"),
            Holding::Absent => "-".to_string(),
        };
    }
    let manifest = p.manifest.as_ref().is_none_or(|m| matches!(held[&m.0], Holding::Whole(_)));
    let whole = p.files.iter().filter(|m| matches!(held[&m.xet], Holding::Whole(_))).count();
    match (manifest, whole) {
        (true, n) if n == p.files.len() => "whole".to_string(),
        (false, 0) => "-".to_string(),
        (true, 0) if p.kind == Kind::Run => "-".to_string(),
        (m, n) => format!("{n} of {} file(s){}", p.files.len(), if m { "" } else { ", no manifest" }),
    }
}

fn status(vault: &Vault, targets_: &[String]) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let mut pages = targets(vault, targets_)?;
    let lost = expand(&all, &mut pages, &staging.0)?;
    let hashes = unique_hashes(&pages);
    let mut per_store: Vec<(String, Res<Holdings>)> = Vec::new();
    for s in &all {
        let held = match s.is_store() {
            Ok(true) => s.holdings(&hashes, &staging.0),
            Ok(false) => Ok(hashes.iter().map(|h| (*h, Holding::Absent)).collect()),
            Err(e) => Err(e),
        };
        if let Err(e) = &held {
            eprintln!("{}: {e}", s.name);
        }
        per_store.push((s.name.clone(), held));
    }
    for t in &pages {
        if lost.contains(&t.id) {
            println!("{}  {}  {}  manifest in no store reached", t.id, t.path, t.size.map(human).unwrap_or_default());
            continue;
        }
        let (mut present, mut differs) = (0, false);
        for m in &t.files {
            if let Ok(meta) = fs::metadata(vault.root.join(&m.path)) {
                present += 1;
                differs |= m.size.is_some_and(|s| s != meta.len());
            }
        }
        let here = match present {
            _ if differs => "differs".to_string(),
            0 => "missing".to_string(),
            n if n == t.files.len() => "here".to_string(),
            n => format!("{n} of {} here", t.files.len()),
        };
        let held: Vec<String> = per_store
            .iter()
            .map(|(name, h)| format!("{name}: {}", h.as_ref().map(|h| held_state(t, h)).unwrap_or_else(|_| "unreachable".to_string())))
            .collect();
        let whole = per_store.iter().filter(|(_, h)| h.as_ref().is_ok_and(|h| t.whole_in(h))).count();
        let size = t.size.map(|s| format!("{}  ", human(s))).unwrap_or_default();
        println!("{}  {}  {size}{here}  {}  ({whole} cop{})", t.id, t.path, held.join(", "), if whole == 1 { "y" } else { "ies" });
    }
    Ok(0)
}

// --- drop and free ---------------------------------------------------------------------

fn copies_needed(vault: &Vault) -> usize {
    vault.cfg.data.copies.unwrap_or(1)
}

/// The other stores that hold each of `hashes` whole, among those that can be reached.
fn holders(all: &[Store], except: &str, hashes: &[Hash], staging: &Path) -> Res<HashMap<Hash, Vec<String>>> {
    let mut out: HashMap<Hash, Vec<String>> = hashes.iter().map(|h| (*h, Vec::new())).collect();
    for s in all.iter().filter(|s| s.name != except) {
        match s.is_store() {
            Ok(true) => {}
            Ok(false) => continue,
            Err(e) => {
                eprintln!("{} not counted: {e}", s.name);
                continue;
            }
        }
        for (h, held) in s.holdings(hashes, staging)? {
            if matches!(held, Holding::Whole(_)) {
                out.get_mut(&h).unwrap().push(s.name.clone());
            }
        }
    }
    Ok(out)
}

/// The stores in `holders` that hold every file of `p`.
fn holding_page(p: &Stored, holders: &HashMap<Hash, Vec<String>>) -> Vec<String> {
    let hashes = p.hashes();
    let first = &holders[&hashes[0]];
    first.iter().filter(|s| hashes.iter().all(|h| holders[h].contains(s))).cloned().collect()
}

fn drop_cmd(vault: &Vault, targets_: &[String], from: &str) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let store = named(&all, from)?;
    if !store.is_store()? {
        return Err(format!("store {from} ({}) is not there", store.describe()));
    }
    let mut pages = targets(vault, targets_)?;
    expand_all(&all, &mut pages, &staging.0)?;
    let hashes = unique_hashes(&pages);
    let need = copies_needed(vault);
    let elsewhere = holders(&all, from, &hashes, &staging.0)?;
    let short: Vec<String> = pages
        .iter()
        .filter_map(|p| {
            let held = holding_page(p, &elsewhere);
            (held.len() < need).then(|| {
                format!(
                    "{}: {} other store(s) hold it whole{}, {need} needed",
                    p.id,
                    held.len(),
                    if held.is_empty() { String::new() } else { format!(" ({})", held.join(", ")) }
                )
            })
        })
        .collect();
    if !short.is_empty() {
        return Err(format!("nothing dropped from {from}:\n{}", short.join("\n")));
    }
    // a file another page of the notebook also names stays (a calibration frame in two
    // sessions, a run's output promoted to an ART, the same file added twice); a bundle
    // whose manifest cannot be read might name any of them, so it stops the drop
    let dropping_ids: HashSet<&str> = pages.iter().map(|p| p.id.as_str()).collect();
    let mut others: Vec<Stored> = targets(vault, &[])?.into_iter().filter(|p| !dropping_ids.contains(p.id.as_str())).collect();
    let lost = expand(&all, &mut others, &staging.0)?;
    if !lost.is_empty() {
        return Err(format!(
            "nothing dropped from {from}: cannot tell which files {} name, their manifests are in no store reached",
            lost.join(", ")
        ));
    }
    let kept: HashSet<Hash> = others.iter().flat_map(|p| p.hashes()).collect();
    let dropping: HashSet<Hash> = hashes.into_iter().filter(|h| !kept.contains(h)).collect();
    let (xorbs, bytes) = drop_files(store, &dropping, &staging.0)?;
    eprintln!(
        "dropped {} page(s) from {from}: {} file(s), {xorbs} xorb(s) no other file there uses, {}",
        pages.len(),
        dropping.len(),
        human(bytes)
    );
    Ok(0)
}

/// Remove `dropping` from a store: their index entries, then the xorbs no file still
/// indexed there uses, the shards that neither list such a file nor describe a kept xorb,
/// and the dedup entries pointing at those shards. Under the store's drop lock.
fn drop_files(store: &Store, dropping: &HashSet<Hash>, staging: &Path) -> Res<(usize, u64)> {
    let _lock = store.lock_drop()?;
    let file_rels = store.list("files")?;
    let lists = store.read(&file_rels, staging)?;
    let shard_rels = store.list("shards")?;
    let shards: HashMap<String, Shard> = store
        .read(&shard_rels, staging)?
        .into_iter()
        .map(|(rel, b)| Shard::parse(&b).map(|s| (rel.trim_start_matches("shards/").to_string(), s)).map_err(|e| format!("{rel}: {e}")))
        .collect::<Res<_>>()?;
    // the files that stay, and the shards their index entries name
    let mut keep_xorbs: HashSet<Hash> = HashSet::new();
    let mut named_shards: HashSet<String> = HashSet::new();
    let mut gone_entries = Vec::new();
    for rel in &file_rels {
        let Some(h) = rel.rsplit('/').next().and_then(Hash::from_hex) else { continue };
        if dropping.contains(&h) {
            gone_entries.push(rel.clone());
            continue;
        }
        let listed = String::from_utf8_lossy(lists.get(rel).map(|b| &b[..]).unwrap_or(&[])).into_owned();
        for hex in listed.lines().filter(|l| !l.is_empty()) {
            named_shards.insert(hex.to_string());
            if let Some(f) = shards.get(hex).and_then(|s| s.files.get(&h)) {
                keep_xorbs.extend(f.terms.iter().map(|t| t.xorb));
            }
        }
    }
    let xorb_rels = store.list("xorbs")?;
    let gone_xorbs: Vec<String> = xorb_rels
        .into_iter()
        .filter(|r| r.rsplit('/').next().and_then(Hash::from_hex).is_some_and(|h| !keep_xorbs.contains(&h)))
        .collect();
    let gone_shards: HashSet<String> = shards
        .iter()
        .filter(|(hex, s)| !named_shards.contains(*hex) && !s.xorbs.keys().any(|x| keep_xorbs.contains(x)))
        .map(|(hex, _)| hex.clone())
        .collect();
    let chunk_rels = store.list("chunks")?;
    let chunk_entries = store.read(&chunk_rels, staging)?;
    let gone_chunks: Vec<String> = chunk_rels
        .into_iter()
        .filter(|r| chunk_entries.get(r).is_some_and(|b| gone_shards.contains(String::from_utf8_lossy(b).trim())))
        .collect();
    let bytes: u64 = gone_xorbs
        .iter()
        .filter_map(|r| r.rsplit('/').next().and_then(Hash::from_hex))
        .filter_map(|h| shards.values().find_map(|s| s.xorbs.get(&h)).map(|x| x.serialized_bytes as u64))
        .sum();
    // what readers look at first goes first: a dropped file is absent before its xorbs are
    store.remove(&gone_entries)?;
    store.remove(&gone_xorbs)?;
    store.remove(&gone_shards.iter().map(|h| format!("shards/{h}")).collect::<Vec<_>>())?;
    store.remove(&gone_chunks)?;
    Ok((gone_xorbs.len(), bytes))
}

fn free(vault: &Vault, targets_: &[String]) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let mut pages = targets(vault, targets_)?;
    expand_all(&all, &mut pages, &staging.0)?;
    let held = holders(&all, "", &unique_hashes(&pages), &staging.0)?;
    let mut refused = 0;
    for p in &pages {
        let mut freed = 0;
        for m in &p.files {
            let dest = vault.root.join(&m.path);
            if !dest.is_file() {
                if p.kind == Kind::File {
                    eprintln!("{}: {} is not here", p.id, m.path);
                }
                continue;
            }
            if sha256_of(&dest).as_deref() != Some(m.sha256.as_str()) {
                eprintln!("{}: {} differs from what the page names; kept", p.id, m.path);
                refused += 1;
                continue;
            }
            if held[&m.xet].is_empty() {
                eprintln!("{}: no store holds {} whole; kept", p.id, m.path);
                refused += 1;
                continue;
            }
            fs::remove_file(&dest).map_err(|e| format!("{}: {e}", dest.display()))?;
            freed += 1;
            if p.kind == Kind::File {
                eprintln!("{}: {} freed ({} holds it)", p.id, m.path, held[&m.xet].join(", "));
            }
        }
        if p.kind != Kind::Run {
            // the folders left empty: a bundle's own, and the per-artifact one `data add` made
            let top = vault.root.join(&p.path);
            let mut dirs: Vec<PathBuf> = p.files.iter().filter_map(|m| vault.root.join(&m.path).parent().map(Path::to_path_buf)).collect();
            dirs.sort_by_key(|d| std::cmp::Reverse(d.components().count()));
            dirs.dedup();
            for d in dirs {
                let mut d = d.as_path();
                while d.starts_with(&top) {
                    if fs::remove_dir(d).is_err() {
                        break;
                    }
                    d = d.parent().unwrap();
                }
            }
            if let Some(parent) = top.parent().filter(|d| d.ends_with(&p.id)) {
                let _ = fs::remove_dir(parent);
            }
        }
        if p.kind != Kind::File && freed > 0 {
            eprintln!("{}: {} freed", p.id, p.count(freed));
        }
    }
    Ok(if refused > 0 { 1 } else { 0 })
}

// --- large files in git ----------------------------------------------------------------

/// Files git holds (in the index; with `staged`, only those staged against HEAD) larger
/// than `max`: path and size.
fn large_in_git(root: &Path, staged: bool, max: u64) -> Res<Vec<(String, u64)>> {
    let git = |args: &[&str]| -> Res<Vec<u8>> {
        let out = Command::new("git").arg("-C").arg(root).args(args).output().map_err(|e| format!("git: {e}"))?;
        if !out.status.success() {
            return Err(format!("git {}: {}", args.join(" "), String::from_utf8_lossy(&out.stderr).trim()));
        }
        Ok(out.stdout)
    };
    let only: Option<HashSet<String>> = if staged {
        let out = git(&["diff", "--cached", "--name-only", "-z", "--diff-filter=ACMR", "--no-renames"])?;
        Some(out.split(|b| *b == 0).filter(|s| !s.is_empty()).map(|s| String::from_utf8_lossy(s).into_owned()).collect())
    } else {
        None
    };
    // `<mode> <object> <stage>\t<path>`, gitlinks left out
    let index = git(&["ls-files", "-s", "-z"])?;
    let entries: Vec<(String, String)> = index
        .split(|b| *b == 0)
        .filter_map(|e| {
            let e = String::from_utf8_lossy(e);
            let (meta, path) = e.split_once('\t')?;
            let mut f = meta.split(' ');
            let (mode, object) = (f.next()?, f.next()?);
            (mode != "160000" && only.as_ref().is_none_or(|o| o.contains(path))).then(|| (path.to_string(), object.to_string()))
        })
        .collect();
    if entries.is_empty() {
        return Ok(Vec::new());
    }
    let mut child = Command::new("git")
        .arg("-C")
        .arg(root)
        .args(["cat-file", "--batch-check=%(objectsize)"])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("git: {e}"))?;
    let list: String = entries.iter().map(|(_, o)| format!("{o}\n")).collect();
    let mut stdin = child.stdin.take().unwrap();
    let writer = std::thread::spawn(move || stdin.write_all(list.as_bytes()));
    let out = child.wait_with_output().map_err(err)?;
    let _ = writer.join();
    let sizes: Vec<u64> = String::from_utf8_lossy(&out.stdout).lines().map(|l| l.trim().parse().unwrap_or(0)).collect();
    Ok(entries.into_iter().zip(sizes).filter(|(_, s)| *s > max).map(|((p, _), s)| (p, s)).collect())
}

fn git_max(vault: &Vault) -> Res<u64> {
    size_setting(vault.cfg.data.git_max.as_deref(), "git_max", 5_000_000)
}

/// `yajna data check [--staged]`: the files git would take that are over `git_max`.
fn check(vault: &Vault, staged: bool) -> Res<i32> {
    let max = git_max(vault)?;
    let big = large_in_git(&vault.root, staged, max)?;
    for (path, size) in &big {
        println!("{path}  {}  git rm --cached {} && yajna data add {}", human(*size), q(path), q(path));
    }
    if big.is_empty() {
        return Ok(0);
    }
    eprintln!(
        "{} file(s) {} over [data] git_max ({}): store each in a data store instead (docs/data.md section 8)",
        big.len(),
        if staged { "staged" } else { "in git" },
        human(max)
    );
    Ok(1)
}

fn q(s: &str) -> String {
    shlex::try_quote(s).map(|c| c.into_owned()).unwrap_or_else(|_| s.to_string())
}

/// `yajna validate`'s warnings: tracked files over `git_max`. Nothing when this is not a git
/// checkout or the setting cannot be read (validate reports the config itself).
pub(crate) fn large_tracked(vault: &Vault) -> Vec<String> {
    let Ok(max) = git_max(vault) else { return Vec::new() };
    large_in_git(&vault.root, false, max)
        .unwrap_or_default()
        .into_iter()
        .map(|(p, s)| format!("{p} is {} in git, over [data] git_max ({}): `yajna data check` says how to store it instead", human(s), human(max)))
        .collect()
}
