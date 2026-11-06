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
        DataAction::Add { paths, project, run, title, author, to } => {
            add(vault, paths, project.as_deref(), run.as_deref(), title.as_deref(), author.as_deref(), to.as_deref())
        }
        DataAction::Push { targets, to } => push(vault, targets, to.as_deref()),
        DataAction::Pull { targets, from } => pull(vault, targets, from.as_deref()),
        DataAction::Get { targets, from } => get(vault, targets, from.as_deref()),
        DataAction::Status { targets } => status(vault, targets),
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

#[allow(clippy::too_many_arguments)]
fn add(vault: &Vault, paths: &[PathBuf], project: Option<&str>, run: Option<&str>, title: Option<&str>, author: Option<&str>, to: Option<&str>) -> Res<i32> {
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
    let mut sources = Vec::new();
    for p in paths {
        let meta = fs::metadata(p).map_err(|e| format!("{}: {e}", p.display()))?;
        if meta.is_dir() {
            return Err(format!("{} is a folder: folders are added as bundles, step 6 of docs/data.md", p.display()));
        }
        sources.push(fs::canonicalize(p).map_err(|e| format!("{}: {e}", p.display()))?);
    }
    let local = &all[0];
    local.ensure()?;
    let staging = Staging::new(local)?;
    let root = local.dir().unwrap().to_path_buf();

    // pack, deduplicating against what `local` holds
    let mut new_xorbs: Vec<XorbInfo> = Vec::new();
    let mut added = Vec::new();
    let files = {
        let mut packer = Packer::new(compression, |x: Xorb| {
            let rel = fanned("xorbs", &x.footer.hash);
            if !root.join(&rel).is_file() {
                write_atomic(&root.join(&rel), &x.bytes).map_err(xet_err)?;
            }
            new_xorbs.push(XorbInfo::from_footer(&x.footer, x.bytes.len() as u32));
            Ok(())
        });
        let lookup = |h: &Hash| -> Res<Vec<XorbInfo>> {
            let Ok(hex) = fs::read_to_string(root.join(fanned("chunks", h))) else { return Ok(Vec::new()) };
            let path = root.join("shards").join(hex.trim());
            let bytes = fs::read(&path).map_err(|e| format!("{}: {e}", path.display()))?;
            Ok(Shard::parse(&bytes).map_err(|e| format!("{}: {e}", path.display()))?.xorbs.into_values().collect())
        };
        for src in &sources {
            let f = fs::File::open(src).map_err(|e| format!("{}: {e}", src.display()))?;
            let a = packer
                .add_with(BufReader::new(f), &mut |h| lookup(h).map_err(xet_err))
                .map_err(|e| format!("{}: {e}", src.display()))?;
            added.push(a);
        }
        packer.finish().map_err(err)?
    };
    local.apply(shard_ops(&shard_of(&files, new_xorbs)), &staging.0)?;

    for ((src, info), a) in sources.iter().zip(&files).zip(&added) {
        let name = src.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
        let page = crate::commands::create(vault, "artifact", Some(title.unwrap_or(&name)), project.as_deref(), None, None, false, author, None, None)?;
        let id = page.file_name().unwrap().to_string_lossy()[..19].to_string();
        let vroot = fs::canonicalize(&vault.root).map_err(err)?;
        let path = match src.strip_prefix(&vroot) {
            Ok(inside) => inside.to_string_lossy().replace('\\', "/"),
            Err(_) => format!("data/{id}/{name}"),
        };
        ignore(vault, &path)?;
        let text = crate::vault::read_text(&page).map_err(err)?;
        let text = edit_frontmatter(&text, |fm| {
            if let Some(r) = run_page.as_ref().and_then(|p| p.id()) {
                set_field(fm, "run", r);
            }
            set_field(fm, "store", "xet");
            set_field(fm, "path", &path);
            set_field(fm, "hash", &format!("sha256:{}", info.sha256.unwrap().hex()));
            insert_after(fm, "hash", &format!("xet: {}", info.hash.hex()));
            insert_after(fm, "xet", &format!("size: {}", a.bytes));
        });
        fs::write(&page, text).map_err(err)?;
        eprintln!("{id}: {name} stored in {} ({}, {} of it already there)", local.name, human(a.bytes), human(a.deduped));
        println!("{}", rel(&page, &vault.root));
    }
    if let Some(t) = to {
        let store = named(&all, t)?;
        store.ensure()?;
        let (n, bytes) = copy(local, store, &files, &staging.0)?;
        eprintln!("pushed {} file(s) to {}: {n} xorb(s), {}", files.len(), store.name, human(bytes));
    }
    Ok(0)
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

/// A stored artifact: its page, Xet hash, sha256, size and path.
struct Stored {
    id: String,
    xet: Hash,
    sha256: String,
    size: Option<u64>,
    path: String,
}

fn stored(page: &Page) -> Res<Stored> {
    let id = page.id().unwrap_or("").to_string();
    if page.field("store") != Some("xet") {
        return Err(format!("{id} is not kept in a data store (store: {})", page.field("store").unwrap_or("none")));
    }
    let xet = page.field("xet").and_then(Hash::from_hex).ok_or_else(|| format!("{id} has no xet hash"))?;
    Ok(Stored {
        id,
        xet,
        sha256: page.field("hash").unwrap_or("").trim_start_matches("sha256:").to_string(),
        size: page.meta.as_ref().and_then(|m| m.get("size")).and_then(|v| v.as_u64()),
        path: page.field("path").unwrap_or("").to_string(),
    })
}

/// The pages named (IDs or paths), or every stored artifact.
fn targets(vault: &Vault, targets: &[String]) -> Res<Vec<Stored>> {
    let pages = vault.pages()?;
    let all: Vec<&Page> = pages.iter().filter(|p| p.field("type") == Some("artifact") && p.field("store") == Some("xet")).collect();
    if targets.is_empty() {
        return all.into_iter().map(stored).collect();
    }
    targets
        .iter()
        .map(|t| {
            let by_path = t.trim_start_matches("./");
            match all.iter().find(|p| p.field("path") == Some(by_path)) {
                Some(p) => stored(p),
                None => stored(&vault.find(t)?),
            }
        })
        .collect()
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
    let pages = targets(vault, targets_)?;
    let hashes: Vec<Hash> = pages.iter().map(|p| p.xet).collect();
    let here = local.holdings(&hashes, &staging.0)?;
    let mut failed = 0;
    for name in names {
        let store = named(&all, &name)?;
        if store.name == "local" {
            return Err("push copies from local to another store".into());
        }
        store.ensure()?;
        let there = store.holdings(&hashes, &staging.0)?;
        let mut send = Vec::new();
        for p in &pages {
            match (&here[&p.xet], &there[&p.xet]) {
                (_, Holding::Whole(_)) => {}
                (Holding::Whole(f), _) => send.push(f.clone()),
                _ => {
                    eprintln!("{}: local does not hold {} whole; pull or add it first", p.id, p.path);
                    failed += 1;
                }
            }
        }
        if send.is_empty() {
            eprintln!("{}: holds them all already", store.name);
            continue;
        }
        let (n, bytes) = copy(local, store, &send, &staging.0)?;
        eprintln!("pushed {} file(s) to {}: {n} xorb(s), {}", send.len(), store.name, human(bytes));
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

/// Copy into `local` what it lacks of `pages`, from `from` or the first store holding each
/// whole; returns the pages nothing could supply.
fn pull_into_local(all: &[Store], pages: &[&Stored], from: Option<&str>, staging: &Path) -> Res<Vec<String>> {
    let local = &all[0];
    let hashes: Vec<Hash> = pages.iter().map(|p| p.xet).collect();
    let here = local.holdings(&hashes, staging)?;
    let mut wanted: Vec<&Stored> = pages.iter().copied().filter(|p| !matches!(here[&p.xet], Holding::Whole(_))).collect();
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
        let h: Vec<Hash> = wanted.iter().map(|p| p.xet).collect();
        let there = s.holdings(&h, staging)?;
        let (take, rest): (Vec<&Stored>, Vec<&Stored>) = wanted.into_iter().partition(|p| matches!(there[&p.xet], Holding::Whole(_)));
        if !take.is_empty() {
            let recipes: Vec<FileInfo> = take.iter().map(|p| match &there[&p.xet] {
                Holding::Whole(f) => f.clone(),
                _ => unreachable!(),
            }).collect();
            let (n, bytes) = copy(s, local, &recipes, staging)?;
            eprintln!("pulled {} file(s) from {}: {n} xorb(s), {}", take.len(), s.name, human(bytes));
        }
        wanted = rest;
    }
    Ok(wanted.iter().map(|p| p.id.clone()).collect())
}

fn pull(vault: &Vault, targets_: &[String], from: Option<&str>) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let pages = targets(vault, targets_)?;
    let missing = pull_into_local(&all, &pages.iter().collect::<Vec<_>>(), from, &staging.0)?;
    for id in &missing {
        eprintln!("{id}: no store reached holds it whole");
    }
    Ok(if missing.is_empty() { 0 } else { 1 })
}

fn get(vault: &Vault, targets_: &[String], from: Option<&str>) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let pages = targets(vault, targets_)?;
    let todo: Vec<&Stored> = pages
        .iter()
        .filter(|t| {
            let dest = vault.root.join(&t.path);
            let here = dest.is_file() && sha256_of(&dest).as_deref() == Some(t.sha256.as_str());
            if here {
                eprintln!("{}: {} is here already", t.id, t.path);
            }
            !here
        })
        .collect();
    // read from a directory store where the file is whole; anything else comes into local
    // first, so a remote store's xorbs cross the network once
    let direct: Option<&Store> = match from {
        Some(n) => Some(named(&all, n)?).filter(|s| s.dir().is_some()),
        None => None,
    };
    let missing = match direct {
        Some(_) => Vec::new(),
        None => pull_into_local(&all, &todo, from, &staging.0)?,
    };
    let reader = direct.unwrap_or(&all[0]);
    let hashes: Vec<Hash> = todo.iter().map(|t| t.xet).collect();
    let held = reader.holdings(&hashes, &staging.0)?;
    let root = reader.dir().unwrap();
    let mut failed = 0;
    for t in todo {
        let Holding::Whole(file) = &held[&t.xet] else {
            if !missing.contains(&t.id) {
                eprintln!("{}: {} does not hold {} whole", t.id, reader.name, t.path);
            } else {
                eprintln!("{}: no store reached holds {} whole", t.id, t.path);
            }
            failed += 1;
            continue;
        };
        let dest = vault.root.join(&t.path);
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
            return Err(format!("{}: {e}", t.id));
        }
        if sha256_of(&tmp).as_deref() != Some(t.sha256.as_str()) {
            let _ = fs::remove_file(&tmp);
            return Err(format!("{}: the file rebuilt from store {} does not match the page's sha256", t.id, reader.name));
        }
        fs::rename(&tmp, &dest).map_err(err)?;
        eprintln!("{}: {} from {}", t.id, t.path, reader.name);
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

fn status(vault: &Vault, targets_: &[String]) -> Res<i32> {
    let all = stores()?;
    all[0].ensure()?;
    let staging = Staging::new(&all[0])?;
    let pages = targets(vault, targets_)?;
    let hashes: Vec<Hash> = pages.iter().map(|p| p.xet).collect();
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
        let dest = vault.root.join(&t.path);
        let here = match fs::metadata(&dest) {
            Err(_) => "missing",
            Ok(m) if t.size.is_some_and(|s| s != m.len()) => "differs",
            Ok(_) => "here",
        };
        let held: Vec<String> = per_store
            .iter()
            .map(|(name, h)| {
                let state = match h {
                    Err(_) => "unreachable".to_string(),
                    Ok(h) => match &h[&t.xet] {
                        Holding::Whole(_) => "whole".to_string(),
                        Holding::Partial(n) => format!("missing {n} xorb(s)"),
                        Holding::Absent => "-".to_string(),
                    },
                };
                format!("{name}: {state}")
            })
            .collect();
        println!("{}  {}  {}  {}  {}", t.id, t.path, t.size.map(human).unwrap_or_default(), here, held.join(", "));
    }
    Ok(0)
}
