//! `yajna data`: large files in Xet-format stores (docs/data.md, ADR-0035). A store is a
//! directory of xorbs and shards with two indexes, `files/` (a file's recipe) and
//! `chunks/` (where a chunk eligible for dedup lookups lives); an ART page names a file by
//! its Xet hash. `add` writes to this machine's `local` store; `get` and `status` read any
//! directory store named in the user config.

use std::collections::{BTreeMap, HashMap, HashSet};
use std::fs;
use std::io::{BufReader, Write};
use std::path::{Path, PathBuf};

use sha2::{Digest, Sha256};
use yajna_xet::file::{reconstruct, Packer};
use yajna_xet::shard::{FileInfo, Layout, Shard, XorbInfo, GLOBAL_DEDUP};
use yajna_xet::xorb::{Compression, Xorb};
use yajna_xet::Hash;

use crate::anywhere::{user_config, xdg, UserStore};
use crate::cli::DataAction;
use crate::init::{edit_frontmatter, insert_after, set_field};
use crate::vault::{rel, Page, Res, Vault};

const FORMAT: &str = "yajna-xet/1";

pub fn run(vault: &Vault, action: &DataAction) -> Res<i32> {
    match action {
        DataAction::Add { paths, project, run, title, author } => {
            add(vault, paths, project.as_deref(), run.as_deref(), title.as_deref(), author.as_deref())
        }
        DataAction::Get { targets, from } => get(vault, targets, from.as_deref()),
        DataAction::Status { targets } => status(vault, targets),
    }
}

// --- stores ----------------------------------------------------------------------------

pub struct Store {
    pub name: String,
    pub root: PathBuf,
    /// another machine's: reached over ssh from step 4 of docs/data.md
    pub ssh: Option<String>,
}

fn err(e: impl std::fmt::Display) -> String {
    e.to_string()
}

impl Store {
    fn exists(&self) -> bool {
        self.ssh.is_none() && self.root.join("store.toml").is_file()
    }

    fn ensure(&self) -> Res<()> {
        if self.ssh.is_some() {
            return Err(format!("store {} is on {}: ssh stores come with step 4 of docs/data.md", self.name, self.ssh.as_deref().unwrap()));
        }
        let marker = self.root.join("store.toml");
        if marker.is_file() {
            let text = fs::read_to_string(&marker).map_err(err)?;
            if !text.contains(&format!("format = \"{FORMAT}\"")) {
                return Err(format!("{}: not a {FORMAT} store", marker.display()));
            }
            return Ok(());
        }
        for d in ["xorbs", "shards", "files", "chunks"] {
            fs::create_dir_all(self.root.join(d)).map_err(|e| format!("{}: {e}", self.root.display()))?;
        }
        write_atomic(&marker, format!("# a yajna data store (docs/data.md)\nformat = \"{FORMAT}\"\n").as_bytes())
    }

    fn fanned(&self, dir: &str, h: &Hash) -> PathBuf {
        let hex = h.hex();
        self.root.join(dir).join(&hex[..2]).join(hex)
    }

    fn has_xorb(&self, h: &Hash) -> bool {
        self.fanned("xorbs", h).is_file()
    }

    fn xorb(&self, h: &Hash) -> Res<Vec<u8>> {
        fs::read(self.fanned("xorbs", h)).map_err(|e| format!("xorb {h} in store {}: {e}", self.name))
    }

    fn put_xorb(&self, x: &Xorb) -> Res<()> {
        let path = self.fanned("xorbs", &x.footer.hash);
        if path.is_file() {
            return Ok(());
        }
        write_atomic(&path, &x.bytes)
    }

    fn shard(&self, hex: &str) -> Res<Shard> {
        let path = self.root.join("shards").join(hex);
        let bytes = fs::read(&path).map_err(|e| format!("{}: {e}", path.display()))?;
        Shard::parse(&bytes).map_err(|e| format!("{}: {e}", path.display()))
    }

    /// Store a shard and index its files and the chunks a dedup lookup may ask for: those
    /// eligible by hash and the ones flagged (a file's first).
    fn put_shard(&self, shard: &Shard) -> Res<Hash> {
        let bytes = shard.to_bytes(Layout::Stored);
        let hash = yajna_xet::hash::chunk_hash(&bytes);
        let hex = hash.hex();
        write_atomic(&self.root.join("shards").join(&hex), &bytes)?;
        for f in shard.files.keys() {
            let path = self.fanned("files", f);
            let have = fs::read_to_string(&path).unwrap_or_default();
            if !have.lines().any(|l| l == hex) {
                write_atomic(&path, format!("{have}{hex}\n").as_bytes())?;
            }
        }
        for x in shard.xorbs.values() {
            for c in &x.chunks {
                if c.flags & GLOBAL_DEDUP != 0 || c.hash.global_dedup_eligible() {
                    let path = self.fanned("chunks", &c.hash);
                    if !path.is_file() {
                        write_atomic(&path, format!("{hex}\n").as_bytes())?;
                    }
                }
            }
        }
        Ok(hash)
    }

    /// A file's recipe, from the first shard listed for it.
    fn file(&self, h: &Hash) -> Res<Option<FileInfo>> {
        let Ok(list) = fs::read_to_string(self.fanned("files", h)) else {
            return Ok(None);
        };
        for hex in list.lines().filter(|l| !l.is_empty()) {
            if let Some(f) = self.shard(hex)?.files.remove(h) {
                return Ok(Some(f));
            }
        }
        Ok(None)
    }

    /// The xorbs of the shard that indexes chunk `h`.
    fn chunk_xorbs(&self, h: &Hash) -> Res<Vec<XorbInfo>> {
        let Ok(hex) = fs::read_to_string(self.fanned("chunks", h)) else {
            return Ok(Vec::new());
        };
        Ok(self.shard(hex.trim())?.xorbs.into_values().collect())
    }

    /// Whether this store can rebuild file `h`: its recipe and every xorb it names.
    fn holds(&self, h: &Hash) -> Res<Holding> {
        if !self.exists() {
            return Ok(Holding::Absent);
        }
        let Some(f) = self.file(h)? else {
            return Ok(Holding::Absent);
        };
        let missing = f.terms.iter().map(|t| t.xorb).collect::<HashSet<_>>().into_iter().filter(|x| !self.has_xorb(x)).count();
        Ok(if missing == 0 { Holding::Whole(f) } else { Holding::Partial(missing) })
    }
}

enum Holding {
    Whole(FileInfo),
    /// the recipe, missing this many xorbs
    Partial(usize),
    Absent,
}

fn write_atomic(path: &Path, bytes: &[u8]) -> Res<()> {
    let dir = path.parent().unwrap();
    fs::create_dir_all(dir).map_err(|e| format!("{}: {e}", dir.display()))?;
    let tmp = dir.join(format!(".{}.{}.tmp", path.file_name().unwrap().to_string_lossy(), std::process::id()));
    fs::write(&tmp, bytes).map_err(|e| format!("{}: {e}", tmp.display()))?;
    fs::rename(&tmp, path).map_err(|e| format!("{}: {e}", path.display()))
}

/// The stores on this machine: `local` first, then the configured ones by name.
pub fn stores() -> Res<Vec<Store>> {
    let config = user_config()?;
    let mut out = Vec::new();
    let local_default = xdg("XDG_DATA_HOME", ".local/share").join("yajna").join("store");
    let mut named: BTreeMap<String, Store> = BTreeMap::new();
    for (name, s) in &config.stores {
        let (path, ssh) = match s {
            UserStore::Path(p) => (p.clone(), None),
            UserStore::Table { path, ssh } => (path.clone(), ssh.clone()),
        };
        let root = if ssh.is_some() { PathBuf::from(path) } else { PathBuf::from(crate::serve::expand(&path)) };
        named.insert(name.clone(), Store { name: name.clone(), root, ssh });
    }
    out.push(named.remove("local").unwrap_or(Store { name: "local".into(), root: local_default, ssh: None }));
    out.extend(named.into_values());
    Ok(out)
}

fn local() -> Res<Store> {
    let s = stores()?.remove(0);
    s.ensure()?;
    Ok(s)
}

fn xet_err(e: impl std::fmt::Display) -> yajna_xet::Error {
    yajna_xet::Error::Io(std::io::Error::other(e.to_string()))
}

// --- add -------------------------------------------------------------------------------

fn add(vault: &Vault, paths: &[PathBuf], project: Option<&str>, run: Option<&str>, title: Option<&str>, author: Option<&str>) -> Res<i32> {
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
    let mut sources = Vec::new();
    for p in paths {
        let meta = fs::metadata(p).map_err(|e| format!("{}: {e}", p.display()))?;
        if meta.is_dir() {
            return Err(format!("{} is a folder: folders are added as bundles, step 6 of docs/data.md", p.display()));
        }
        sources.push(fs::canonicalize(p).map_err(|e| format!("{}: {e}", p.display()))?);
    }
    let local = local()?;

    // pack, deduplicating against what `local` holds
    let mut new_xorbs: Vec<XorbInfo> = Vec::new();
    let mut added = Vec::new();
    let files = {
        let mut packer = Packer::new(Compression::Auto, |x: Xorb| {
            local.put_xorb(&x).map_err(xet_err)?;
            new_xorbs.push(XorbInfo::from_footer(&x.footer, x.bytes.len() as u32));
            Ok(())
        });
        for src in &sources {
            let f = fs::File::open(src).map_err(|e| format!("{}: {e}", src.display()))?;
            let a = packer
                .add_with(BufReader::new(f), &mut |h| local.chunk_xorbs(h).map_err(xet_err))
                .map_err(|e| format!("{}: {e}", src.display()))?;
            added.push(a);
        }
        packer.finish().map_err(err)?
    };
    // a file's first chunk is what the next add of a version of it looks up first
    let firsts: HashMap<Hash, Vec<u32>> = files.iter().filter_map(|f| f.terms.first()).fold(HashMap::new(), |mut m, t| {
        m.entry(t.xorb).or_default().push(t.start);
        m
    });
    let mut shard = Shard::default();
    for mut x in new_xorbs {
        for &i in firsts.get(&x.hash).into_iter().flatten() {
            x.chunks[i as usize].flags |= GLOBAL_DEDUP;
        }
        shard.xorbs.insert(x.hash, x);
    }
    for f in &files {
        shard.files.insert(f.hash, f.clone());
    }
    local.put_shard(&shard)?;

    for ((src, info), a) in sources.iter().zip(&files).zip(&added) {
        let name = src.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();
        let page = crate::commands::create(vault, "artifact", Some(title.unwrap_or(&name)), project.as_deref(), None, None, false, author, None, None)?;
        let id = page.file_name().unwrap().to_string_lossy()[..19].to_string();
        let root = fs::canonicalize(&vault.root).map_err(err)?;
        let path = match src.strip_prefix(&root) {
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
        eprintln!(
            "{id}: {} stored in {} ({}, {} of it already there)",
            name,
            local.name,
            human(a.bytes),
            human(a.deduped)
        );
        println!("{}", rel(&page, &vault.root));
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

// --- get and status --------------------------------------------------------------------

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

fn get(vault: &Vault, targets_: &[String], from: Option<&str>) -> Res<i32> {
    let all = stores()?;
    let order: Vec<&Store> = match from {
        Some(name) => {
            let s = all.iter().find(|s| s.name == name).ok_or_else(|| format!("no store {name}; configure it under [stores] in {}", crate::anywhere::config_path().display()))?;
            if s.ssh.is_some() {
                return Err(format!("store {name} is on {}: ssh stores come with step 4 of docs/data.md", s.ssh.as_deref().unwrap()));
            }
            vec![s]
        }
        None => all.iter().filter(|s| s.exists()).collect(),
    };
    let mut failed = 0;
    for t in targets(vault, targets_)? {
        let dest = vault.root.join(&t.path);
        if dest.is_file() && sha256_of(&dest).as_deref() == Some(t.sha256.as_str()) {
            eprintln!("{}: {} is here already", t.id, t.path);
            continue;
        }
        let mut done = false;
        for s in &order {
            let Holding::Whole(file) = s.holds(&t.xet)? else { continue };
            if let Some(parent) = dest.parent() {
                fs::create_dir_all(parent).map_err(err)?;
            }
            let tmp = dest.with_file_name(format!(".{}.yajna-get", dest.file_name().unwrap().to_string_lossy()));
            let mut out = std::io::BufWriter::new(fs::File::create(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?);
            let result = reconstruct(&file, |h| s.xorb(h).map_err(xet_err), &mut out);
            out.flush().map_err(err)?;
            drop(out);
            if let Err(e) = result {
                let _ = fs::remove_file(&tmp);
                return Err(format!("{}: {e}", t.id));
            }
            if sha256_of(&tmp).as_deref() != Some(t.sha256.as_str()) {
                let _ = fs::remove_file(&tmp);
                return Err(format!("{}: the file rebuilt from store {} does not match the page's sha256", t.id, s.name));
            }
            fs::rename(&tmp, &dest).map_err(err)?;
            eprintln!("{}: {} from {}", t.id, t.path, s.name);
            done = true;
            break;
        }
        if !done {
            eprintln!("{}: no store here holds {} whole", t.id, t.path);
            failed += 1;
        }
    }
    Ok(if failed > 0 { 1 } else { 0 })
}

fn status(vault: &Vault, targets_: &[String]) -> Res<i32> {
    let all = stores()?;
    for t in targets(vault, targets_)? {
        let dest = vault.root.join(&t.path);
        let here = match fs::metadata(&dest) {
            Err(_) => "missing",
            Ok(m) if t.size.is_some_and(|s| s != m.len()) => "differs",
            Ok(_) => "here",
        };
        let mut held = Vec::new();
        for s in &all {
            let state = if s.ssh.is_some() {
                "ssh, not read yet".to_string()
            } else {
                match s.holds(&t.xet)? {
                    Holding::Whole(_) => "whole".to_string(),
                    Holding::Partial(n) => format!("missing {n} xorb(s)"),
                    Holding::Absent => "-".to_string(),
                }
            };
            held.push(format!("{}: {state}", s.name));
        }
        println!("{}  {}  {}  {}  {}", t.id, t.path, t.size.map(human).unwrap_or_default(), here, held.join(", "));
    }
    Ok(0)
}
