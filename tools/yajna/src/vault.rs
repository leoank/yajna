//! Paths, configuration, IDs and frontmatter for the notebook under `lab/`.

use std::collections::BTreeMap;
use std::ffi::OsString;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use jiff::tz::TimeZone;
use jiff::Zoned;
use regex::Regex;
use rust_embed::Embed;
use serde::Deserialize;
use serde_json::{Map, Value};

use crate::yamlfmt;

pub const CONFIG_NAME: &str = "yajna.toml";

pub type Res<T> = Result<T, String>;

#[derive(Embed)]
#[folder = "../../templates"]
pub struct Templates;

#[derive(Embed)]
#[folder = "../../schema"]
pub struct Schemas;

#[derive(Embed)]
#[folder = "../../plugins/yajna/skills"]
pub struct Skills;

pub struct Entity {
    pub name: &'static str,
    pub prefix: &'static str,
    pub template: &'static str,
    pub subdir: &'static str,
}

macro_rules! entity {
    ($n:literal, $p:literal, $t:literal, $s:literal) => {
        Entity {
            name: $n,
            prefix: $p,
            template: $t,
            subdir: $s,
        }
    };
}

/// Entity type -> ID prefix, template, where it lives. Project-scoped entities live under the
/// project directory; the others under a shared directory in the vault.
pub const ENTITIES: &[Entity] = &[
    entity!("project", "PRJ", "project", "projects"),
    entity!("experiment", "EXP", "experiment", "experiments"),
    entity!("run", "RUN", "run", "runs"),
    entity!("analysis", "ANA", "analysis", "analyses"),
    entity!("artifact", "ART", "artifact", "artifacts"),
    entity!("protocol", "PRO", "protocol", "protocols"),
    entity!("material", "MAT", "material", "materials"),
    entity!("equipment", "EQP", "equipment", "equipment"),
    entity!("build", "BLD", "build", "builds"),
    entity!("agent_session", "AGS", "agent_session", "agents"),
    entity!("doc", "DOC", "doc", "docs"),
];
pub const PROJECT_SCOPED: &[&str] = &["experiment", "run", "analysis", "artifact"];
pub const VOLUME_PREFIXES: &[&str] = &["RUN", "ART", "AGS"];
/// Curated entities that take date IDs instead of counter IDs (ADR-0022): the ones created
/// on branches, where a shared counter collides.
pub const DATED_PREFIXES: &[&str] = &["EXP", "ANA", "DOC"];
/// Frontmatter fields whose IDs are not links: paths (an ID there is a directory name) and
/// `previous_id`, the counter ID a page had before `yajna migrate-ids`.
pub const PATH_FIELDS: &[&str] = &["code", "script", "path", "previous_id"];
const ALIASES: &[(&str, &str)] = &[
    ("agent", "agent_session"),
    ("exp", "experiment"),
    ("pro", "protocol"),
    ("mat", "material"),
    ("eqp", "equipment"),
    ("bld", "build"),
    ("prj", "project"),
    ("ana", "analysis"),
    ("art", "artifact"),
    ("ags", "agent_session"),
    ("run", "run"),
];

pub fn entity(name: &str) -> Option<&'static Entity> {
    ENTITIES.iter().find(|e| e.name == name)
}

pub fn entity_names() -> Vec<&'static str> {
    ENTITIES.iter().map(|e| e.name).collect()
}

pub fn prefix_to_type(prefix: &str) -> Option<&'static str> {
    ENTITIES.iter().find(|e| e.prefix == prefix).map(|e| e.name)
}

/// Canonical entity type for a user-typed name: lowercased, aliases resolved.
pub fn canonical_type(name: &str) -> String {
    let lower = name.to_lowercase();
    ALIASES
        .iter()
        .find(|(a, _)| *a == lower)
        .map(|(_, t)| t.to_string())
        .unwrap_or(lower)
}

pub fn is_type(name: &str) -> bool {
    entity(&canonical_type(name)).is_some()
}

// Date IDs first, so `EXP-20261021-0k3m9x` is never read as the counter ID `EXP-20261021`.
// A date ID's suffix is 4 characters (older IDs) or 6 (time-sortable, ADR-0022).
const ID_PATTERN: &str = r"\b(?:RUN|ART|AGS|EXP|ANA|DOC)-\d{8}-[0-9a-z]{4}(?:[0-9a-z]{2})?\b|\b(?:PRJ|EXP|PRO|MAT|ANA|EQP|BLD)-\d{4,}\b";
pub static ID_FULL_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(&format!("^(?:{ID_PATTERN})$")).unwrap());
/// An ID with an optional `namespace/` in front, as it appears in frontmatter and links.
pub static NS_ID_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(&format!(r"(?:\b([a-z][a-z0-9_-]*)/)?({ID_PATTERN})")).unwrap());
pub static LINK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]").unwrap());
/// Base 32 in ASCII order (Crockford's letters, lowercase), so suffixes sort as they read.
const SORTABLE32: &[u8] = b"0123456789abcdefghjkmnpqrstvwxyz";

/// A date ID: the UTC date, then the time of day in tenths of a second as 4 sortable base-32
/// characters, then 2 characters that tell apart IDs made in the same tenth. `tail` is
/// those 2 characters' value (random for new IDs, the old number when migrating).
pub fn date_id(prefix: &str, utc: &Zoned, tail: u32) -> String {
    let secs = (utc.hour() as u32) * 3600 + (utc.minute() as u32) * 60 + utc.second() as u32;
    let tenths = secs * 10 + (utc.subsec_nanosecond() as u32 / 100_000_000).min(9);
    let mut suffix = String::new();
    for shift in [15, 10, 5, 0] {
        suffix.push(SORTABLE32[(tenths >> shift & 31) as usize] as char);
    }
    for shift in [5, 0] {
        suffix.push(SORTABLE32[(tail >> shift & 31) as usize] as char);
    }
    format!("{prefix}-{}-{suffix}", utc.strftime("%Y%m%d"))
}

/// `text` cut into (is_code, piece): fenced blocks and inline code spans are code. A link or
/// citation inside code is literal text, not a reference.
fn code_segments(text: &str) -> Vec<(bool, &str)> {
    static INLINE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"``[^`]*``|`[^`\n]*`").unwrap());
    let mut out = Vec::new();
    let mut fence = false;
    for line in text.split_inclusive('\n') {
        let t = line.trim_start();
        if t.starts_with("```") || t.starts_with("~~~") {
            fence = !fence;
            out.push((true, line));
            continue;
        }
        if fence {
            out.push((true, line));
            continue;
        }
        let mut last = 0;
        for m in INLINE.find_iter(line) {
            out.push((false, &line[last..m.start()]));
            out.push((true, m.as_str()));
            last = m.end();
        }
        out.push((false, &line[last..]));
    }
    out
}

/// The text with code blanked to spaces (newlines kept, so line numbers hold).
pub fn without_code(text: &str) -> String {
    code_segments(text)
        .into_iter()
        .map(|(code, s)| {
            if code {
                s.chars()
                    .map(|c| if c == '\n' { '\n' } else { ' ' })
                    .collect()
            } else {
                s.to_string()
            }
        })
        .collect()
}

/// Apply `f` to the prose of `text`, leaving code as written.
pub fn map_outside_code(text: &str, f: impl Fn(&str) -> String) -> String {
    code_segments(text)
        .into_iter()
        .map(|(code, s)| if code { s.to_string() } else { f(s) })
        .collect()
}

pub fn load_yaml(text: &str) -> Res<Value> {
    serde_norway::from_str::<Value>(text).map_err(|e| e.to_string())
}

/// (frontmatter mapping or None, body). Frontmatter must start on line 1.
pub fn split_frontmatter(text: &str) -> (Option<Map<String, Value>>, String) {
    if !text.starts_with("---\n") {
        return (None, text.to_string());
    }
    let Some(end) = text[4..].find("\n---\n").map(|i| i + 4) else {
        return (None, text.to_string());
    };
    match load_yaml(&text[4..end]) {
        Ok(Value::Object(m)) => (Some(m), text[end + 5..].to_string()),
        _ => (None, text.to_string()),
    }
}

pub fn slugify(title: &str) -> String {
    static NON_ALNUM: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[^a-z0-9]+").unwrap());
    let s = NON_ALNUM
        .replace_all(&title.to_lowercase(), "-")
        .trim_matches('-')
        .to_string();
    let s: String = s.chars().take(60).collect();
    let s = s.trim_end_matches('-');
    if s.is_empty() {
        "untitled".to_string()
    } else {
        s.to_string()
    }
}

pub fn find_root() -> Res<PathBuf> {
    let here = std::env::current_dir().map_err(|e| e.to_string())?;
    let mut p: &Path = &here;
    loop {
        if p.join(CONFIG_NAME).is_file() {
            return Ok(p.to_path_buf());
        }
        match p.parent() {
            Some(parent) => p = parent,
            None => {
                return Err(format!(
                    "not inside a yajna repo: no {CONFIG_NAME} found above {}",
                    here.display()
                ))
            }
        }
    }
}

#[derive(Debug, Clone)]
pub struct Page {
    pub path: PathBuf,
    pub meta: Option<Map<String, Value>>,
    pub body: String,
}

impl Page {
    pub fn id(&self) -> Option<&str> {
        self.meta.as_ref()?.get("id")?.as_str()
    }

    pub fn field(&self, key: &str) -> Option<&str> {
        self.meta.as_ref()?.get(key)?.as_str()
    }
}

#[derive(Debug, Deserialize, Default)]
pub struct Config {
    pub author: Option<String>,
    pub vault: Option<String>,
    pub timezone: Option<String>,
    pub bibliography: Option<String>,
    pub shape: Option<String>,
    pub namespace: Option<String>,
    #[serde(default)]
    pub repos: BTreeMap<String, Repo>,
    #[serde(default)]
    pub sync: SyncConfig,
    #[serde(default)]
    pub docs: DocsConfig,
}

/// `[docs]` in yajna.toml: directories outside the vault (a thesis folder, say) whose doc
/// pages belong to the notebook. Only files with a yajna `id` and `type` there count.
#[derive(Debug, Default, Deserialize)]
pub struct DocsConfig {
    #[serde(default)]
    pub dirs: Vec<String>,
}

/// `[sync]` in yajna.toml: where new Google Docs go, and where links to unsynced pages point.
#[derive(Debug, Default, Deserialize)]
pub struct SyncConfig {
    /// Drive folder ID that new docs are created in (shared with the readers)
    pub folder: Option<String>,
    /// base URL of the published static site
    pub site_url: Option<String>,
}

/// One `[repos]` entry: `ns = "github:owner/repo"` or `ns = { url = "...", path = "../repo" }`.
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
#[allow(dead_code)] // `url` is read by the site and the server, not by the CLI yet
pub enum Repo {
    Location(String),
    Table {
        url: Option<String>,
        path: Option<String>,
    },
}

impl Repo {
    /// Where a checkout usually is, relative to the repo root.
    pub fn path(&self) -> Option<&str> {
        match self {
            Repo::Table { path, .. } => path.as_deref(),
            Repo::Location(_) => None,
        }
    }
}

pub struct Vault {
    pub root: PathBuf,
    pub cfg: Config,
    pub author: String,
    pub notes: PathBuf,
    pub tz: TimeZone,
    pub counters_file: PathBuf,
}

impl Vault {
    pub fn open(root: PathBuf) -> Res<Self> {
        let text = fs::read_to_string(root.join(CONFIG_NAME))
            .map_err(|e| format!("{}: {e}", root.join(CONFIG_NAME).display()))?;
        let cfg: Config = toml::from_str(&text).map_err(|e| format!("{CONFIG_NAME}: {e}"))?;
        let author = cfg.author.clone().unwrap_or_else(|| "unknown".to_string());
        let notes = root.join(cfg.vault.as_deref().unwrap_or("notes"));
        let tzname = cfg.timezone.clone().unwrap_or_else(|| "UTC".to_string());
        let tz =
            TimeZone::get(&tzname).map_err(|e| format!("{CONFIG_NAME}: timezone {tzname}: {e}"))?;
        let counters_file = notes.join("counters.yaml");
        Ok(Vault {
            root,
            cfg,
            author,
            notes,
            tz,
            counters_file,
        })
    }

    // --- shape -----------------------------------------------------------------------
    /// `lab` (the default) or `project` (ADR-0018).
    pub fn shape(&self) -> &str {
        self.cfg.shape.as_deref().unwrap_or("lab")
    }

    pub fn is_project(&self) -> bool {
        self.shape() == "project"
    }

    pub fn namespace(&self) -> Res<&str> {
        self.cfg
            .namespace
            .as_deref()
            .ok_or_else(|| format!("{CONFIG_NAME}: no namespace"))
    }

    /// The one project of a project-shaped repo: the ID on `notes/README.md`.
    pub fn single_project(&self) -> Res<String> {
        let page = self.read(&self.notes.join("README.md"))?;
        page.id().map(str::to_string).ok_or_else(|| {
            format!(
                "{}: no id in frontmatter",
                rel(&self.notes.join("README.md"), &self.root)
            )
        })
    }

    /// Root of another namespace's checkout, when `[repos]` gives a `path` that exists.
    pub fn repo_root(&self, ns: &str) -> Option<PathBuf> {
        let p = self.root.join(self.cfg.repos.get(ns)?.path()?);
        p.join(CONFIG_NAME).is_file().then_some(p)
    }

    /// The author new pages and log lines get: `$YAJNA_AUTHOR` (how an agent names
    /// itself for a session), else `.yajna/author` (written by `yajna worktree` for the
    /// agent of that worktree, never committed), else the human handle in yajna.toml.
    pub fn default_author(&self) -> String {
        std::env::var("YAJNA_AUTHOR")
            .ok()
            .filter(|s| !s.trim().is_empty())
            .or_else(|| {
                fs::read_to_string(self.root.join(".yajna").join("author"))
                    .ok()
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
            })
            .unwrap_or_else(|| self.author.clone())
    }

    // --- time ------------------------------------------------------------------------
    pub fn now(&self) -> Zoned {
        Zoned::now().with_time_zone(self.tz.clone())
    }

    pub fn today(&self) -> String {
        date_of(&self.now())
    }

    // --- pages -----------------------------------------------------------------------
    pub fn read(&self, path: &Path) -> Res<Page> {
        let text = fs::read_to_string(path).map_err(|e| format!("{}: {e}", path.display()))?;
        let (meta, body) = split_frontmatter(&text);
        Ok(Page {
            path: path.to_path_buf(),
            meta,
            body,
        })
    }

    /// Every markdown page under the vault, in the order Python's `sorted(Path.rglob())` gives.
    pub fn pages(&self) -> Res<Vec<Page>> {
        let mut paths: Vec<PathBuf> = Vec::new();
        collect_md(&self.notes, &mut paths)?;
        let key = |p: &PathBuf| {
            p.components()
                .map(|c| c.as_os_str().to_os_string())
                .collect::<Vec<OsString>>()
        };
        paths.sort_by_key(key);
        let mut pages: Vec<Page> = paths.iter().map(|p| self.read(p)).collect::<Res<_>>()?;
        // doc pages in the registered directories outside the vault: only yajna pages, so a
        // thesis chapter or a pandoc file beside them is left alone
        let mut extra: Vec<PathBuf> = Vec::new();
        for d in &self.cfg.docs.dirs {
            let dir = self.root.join(d);
            if !dir.starts_with(&self.notes) {
                collect_md(&dir, &mut extra)?;
            }
        }
        extra.sort_by_key(key);
        for p in extra {
            let page = self.read(&p)?;
            let ours = page
                .meta
                .as_ref()
                .map(|m| m.contains_key("id") && m.contains_key("type"))
                .unwrap_or(false);
            if ours {
                pages.push(page);
            }
        }
        Ok(pages)
    }

    /// ID -> path for every page that has an id (first page wins on duplicates).
    pub fn index(&self) -> Res<BTreeMap<String, PathBuf>> {
        let mut out = BTreeMap::new();
        for page in self.pages()? {
            if let Some(id) = page.id() {
                out.entry(id.to_string()).or_insert(page.path.clone());
            }
        }
        Ok(out)
    }

    /// The page with this ID, or the page that had it before `yajna migrate-ids`.
    pub fn find(&self, ident: &str) -> Res<Page> {
        if let Some(path) = self.index()?.get(ident) {
            return self.read(path);
        }
        if let Some(page) = self
            .pages()?
            .into_iter()
            .find(|p| p.field("previous_id") == Some(ident))
        {
            return Ok(page);
        }
        Err(format!("{ident}: not found in {}", self.notes.display()))
    }

    /// The current ID for `ident`: itself, or the date ID of the page it was migrated to.
    pub fn canonical_id(&self, ident: &str) -> String {
        if self.index().map(|i| i.contains_key(ident)).unwrap_or(false) {
            return ident.to_string();
        }
        self.find(ident)
            .ok()
            .and_then(|p| p.id().map(str::to_string))
            .unwrap_or_else(|| ident.to_string())
    }

    /// Where a project's experiments, runs, analyses and artifacts live: `notes/projects/PRJ-*/`
    /// in a lab, the vault itself in a project repo.
    pub fn project_dir(&self, prj: &str) -> Res<PathBuf> {
        if self.is_project() {
            return Ok(self.notes.clone());
        }
        let projects = self.notes.join("projects");
        let mut dirs: Vec<PathBuf> = fs::read_dir(&projects)
            .map(|rd| {
                rd.flatten()
                    .map(|e| e.path())
                    .filter(|p| p.is_dir())
                    .collect()
            })
            .unwrap_or_default();
        dirs.sort();
        let name_of = |p: &PathBuf| {
            p.file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_default()
        };
        if let Some(d) = dirs
            .iter()
            .find(|p| name_of(p).starts_with(&format!("{prj}-")))
        {
            return Ok(d.clone());
        }
        if let Some(d) = dirs.iter().find(|p| name_of(p) == prj) {
            return Ok(d.clone());
        }
        Err(format!(
            "{prj}: no project directory under {}",
            projects.display()
        ))
    }

    /// Write a page from a mapping of scalar fields, as PyYAML's `safe_dump` would.
    pub fn write_page(&self, path: &Path, meta: &[(&str, Value)], body: &str) -> Res<()> {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let mut fm = String::new();
        for (k, v) in meta {
            fm.push_str(k);
            fm.push_str(": ");
            fm.push_str(&dump_value(v));
            fm.push('\n');
        }
        let fm = fm.trim_end_matches('\n');
        fs::write(path, format!("---\n{fm}\n---\n{body}"))
            .map_err(|e| format!("{}: {e}", path.display()))
    }

    // --- ids -------------------------------------------------------------------------
    pub fn read_counters(&self) -> Res<Vec<(String, i64)>> {
        if !self.counters_file.is_file() {
            return Ok(Vec::new());
        }
        let text = fs::read_to_string(&self.counters_file).map_err(|e| e.to_string())?;
        match load_yaml(&text)? {
            Value::Object(m) => Ok(m
                .into_iter()
                .map(|(k, v)| {
                    (
                        k,
                        v.as_i64()
                            .or_else(|| v.as_str().and_then(|s| s.parse().ok()))
                            .unwrap_or(0),
                    )
                })
                .collect()),
            Value::Null => Ok(Vec::new()),
            _ => Err(format!("{}: not a mapping", self.counters_file.display())),
        }
    }

    pub fn allocate(&self, prefix: &str) -> Res<String> {
        if VOLUME_PREFIXES.contains(&prefix) || DATED_PREFIXES.contains(&prefix) {
            // `YAJNA_FIXED_TIME` makes IDs reproducible (tests, examples): that time, and a
            // sequence per prefix in place of the random characters
            if let Some(fixed) = std::env::var("YAJNA_FIXED_TIME")
                .ok()
                .filter(|t| !t.is_empty())
                .and_then(|t| t.parse::<jiff::Timestamp>().ok())
            {
                let start = format!("{prefix}-");
                let n = self
                    .index()?
                    .keys()
                    .filter(|k| k.starts_with(&start))
                    .count() as u32
                    + 1;
                return Ok(date_id(prefix, &fixed.to_zoned(TimeZone::UTC), n));
            }
            let now = Zoned::now().with_time_zone(TimeZone::UTC);
            return Ok(date_id(prefix, &now, fastrand::u32(..1024)));
        }
        let mut counters = self.read_counters()?;
        let n = match counters.iter_mut().find(|(k, _)| k == prefix) {
            Some((_, v)) => {
                *v += 1;
                *v
            }
            None => {
                counters.push((prefix.to_string(), 1));
                1
            }
        };
        fs::write(&self.counters_file, counters_text(&counters))
            .map_err(|e| format!("{}: {e}", self.counters_file.display()))?;
        Ok(format!("{prefix}-{n:04}"))
    }

    // --- templates -------------------------------------------------------------------
    /// Template text: `.yajna/templates/<name>` in the repo overrides the embedded copy.
    pub fn template(&self, name: &str) -> Res<String> {
        let file = if name.contains('.') {
            name.to_string()
        } else {
            format!("{name}.md")
        };
        let local = self.root.join(".yajna").join("templates").join(&file);
        if local.is_file() {
            return fs::read_to_string(&local).map_err(|e| format!("{}: {e}", local.display()));
        }
        match Templates::get(&file) {
            Some(f) => Ok(String::from_utf8_lossy(&f.data).into_owned()),
            None => Err(format!("no template {file}")),
        }
    }

    /// Fill a template like Python's `string.Template.safe_substitute`: `$name`, `${name}`,
    /// `$$` for a dollar; unknown placeholders are left as written.
    pub fn render(&self, name: &str, fields: &[(&str, &str)]) -> Res<String> {
        Ok(substitute(&self.template(name)?, fields))
    }

    // --- log -------------------------------------------------------------------------
    pub fn log_path(&self, date: &str, author: Option<&str>) -> PathBuf {
        let author = author.unwrap_or(&self.author);
        let name = if author == self.author {
            date.to_string()
        } else {
            format!("{date}.{}", author.replace(':', "-"))
        };
        self.notes
            .join("log")
            .join(&date[..4.min(date.len())])
            .join(format!("{name}.md"))
    }
}

/// The text of `counters.yaml` for these prefixes.
pub fn counters_text(counters: &[(String, i64)]) -> String {
    let mut text =
        String::from("# Last allocated number per curated ID prefix. Managed by `yajna new`.\n");
    for (k, v) in counters {
        text.push_str(&format!("{k}: {v}\n"));
    }
    text
}

pub fn substitute(text: &str, fields: &[(&str, &str)]) -> String {
    static TEMPLATE_RE: LazyLock<Regex> = LazyLock::new(|| {
        Regex::new(r"\$(?:(?P<escaped>\$)|(?P<named>[_a-zA-Z][_a-zA-Z0-9]*)|\{(?P<braced>[_a-zA-Z][_a-zA-Z0-9]*)\}|(?P<invalid>))").unwrap()
    });
    TEMPLATE_RE
        .replace_all(text, |caps: &regex::Captures| {
            if caps.name("escaped").is_some() {
                return "$".to_string();
            }
            let name = caps
                .name("named")
                .or_else(|| caps.name("braced"))
                .map(|m| m.as_str());
            match name.and_then(|n| fields.iter().find(|(k, _)| *k == n)) {
                Some((_, v)) => v.to_string(),
                None => caps[0].to_string(),
            }
        })
        .into_owned()
}

pub fn date_of(z: &Zoned) -> String {
    z.strftime("%Y-%m-%d").to_string()
}

pub fn iso_minutes(z: &Zoned) -> String {
    z.strftime("%Y-%m-%dT%H:%M%:z").to_string()
}

pub fn dump_value(v: &Value) -> String {
    match v {
        Value::Null => "null".to_string(),
        Value::Bool(b) => b.to_string(),
        Value::Number(n) => n.to_string(),
        Value::String(s) => yamlfmt::dump_scalar(s),
        other => other.to_string(),
    }
}

fn collect_md(dir: &Path, out: &mut Vec<PathBuf>) -> Res<()> {
    let Ok(rd) = fs::read_dir(dir) else {
        return Ok(());
    };
    for entry in rd.flatten() {
        let p = entry.path();
        if p.is_dir() {
            collect_md(&p, out)?;
        } else if p.extension().map(|e| e == "md").unwrap_or(false) {
            out.push(p);
        }
    }
    Ok(())
}

pub fn rel<'a>(path: &'a Path, root: &Path) -> std::borrow::Cow<'a, str> {
    path.strip_prefix(root).unwrap_or(path).to_string_lossy()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn date_ids_sort_by_time() {
        let at = |h: i8, m: i8, s: i8, ns: i32| {
            jiff::civil::date(2026, 10, 21)
                .at(h, m, s, ns)
                .to_zoned(TimeZone::UTC)
                .unwrap()
        };
        assert_eq!(date_id("EXP", &at(0, 0, 0, 0), 0), "EXP-20261021-000000");
        let ids = [
            date_id("EXP", &at(0, 0, 0, 0), 1023),
            date_id("EXP", &at(0, 0, 0, 100_000_000), 0),
            date_id("EXP", &at(9, 59, 59, 0), 5),
            date_id("EXP", &at(10, 0, 0, 0), 4),
            date_id("EXP", &at(23, 59, 59, 900_000_000), 1023),
        ];
        let mut sorted = ids.to_vec();
        sorted.sort();
        assert_eq!(sorted, ids, "lexical order is time order");
        assert!(ids.iter().all(|i| ID_FULL_RE.is_match(i)), "{ids:?}");
        // 23:59:59.9 is 863999 tenths: base-32 digits 26 11 23 31
        assert_eq!(&ids[4][13..], "tbqzzz");
        // the counter form is still an ID, and a date ID is never read as one
        assert!(ID_FULL_RE.is_match("EXP-0007") && ID_FULL_RE.is_match("RUN-20261016-k7f3"));
        let c = NS_ID_RE.captures("see EXP-20261021-0k3m9x.").unwrap();
        assert_eq!(&c[2], "EXP-20261021-0k3m9x");
    }

    #[test]
    fn code_is_not_prose() {
        let t =
            "See [[EXP-0001]] and `[[EXP-0002]]`.\n```\n[[EXP-0003]]\n```\n``a`[[EXP-0004]]``\n";
        let w = without_code(t);
        assert!(
            w.contains("[[EXP-0001]]")
                && !w.contains("EXP-0002")
                && !w.contains("EXP-0003")
                && !w.contains("EXP-0004")
        );
        assert_eq!(w.lines().count(), t.lines().count());
        assert_eq!(map_outside_code("x `y` z", |s| s.to_uppercase()), "X `y` Z");
    }

    #[test]
    fn slug() {
        assert_eq!(slugify("Archaeal division"), "archaeal-division");
        assert_eq!(slugify("  ???  "), "untitled");
        assert_eq!(
            slugify("rc2s2 - A remote command and control session server"),
            "rc2s2-a-remote-command-and-control-session-server"
        );
    }

    #[test]
    fn template_substitution() {
        assert_eq!(
            substitute(
                "id: $id ${id}x $$ ${system} $unknown",
                &[("id", "PRJ-0001")]
            ),
            "id: PRJ-0001 PRJ-0001x $ ${system} $unknown"
        );
    }

    #[test]
    fn frontmatter() {
        let (m, body) =
            split_frontmatter("---\nid: EXP-0001\ncreated: 2026-10-16\nouter: null\n---\nbody\n");
        let m = m.unwrap();
        assert_eq!(m["id"], "EXP-0001");
        assert_eq!(m["created"], "2026-10-16");
        assert!(m["outer"].is_null());
        assert_eq!(body, "body\n");
        assert!(split_frontmatter("no frontmatter").0.is_none());
    }
}
