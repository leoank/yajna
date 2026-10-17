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
];
pub const PROJECT_SCOPED: &[&str] = &["experiment", "run", "analysis", "artifact"];
pub const VOLUME_PREFIXES: &[&str] = &["RUN", "ART", "AGS"];
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

const ID_PATTERN: &str =
    r"\b(?:PRJ|EXP|PRO|MAT|ANA|EQP|BLD)-\d{4,}\b|\b(?:RUN|ART|AGS)-\d{8}-[a-z2-7]{4}\b";
pub static ID_FULL_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(&format!("^(?:{ID_PATTERN})$")).unwrap());
/// An ID with an optional `namespace/` in front, as it appears in frontmatter and links.
pub static NS_ID_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(&format!(r"(?:\b([a-z][a-z0-9_-]*)/)?({ID_PATTERN})")).unwrap());
pub static LINK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]").unwrap());
const BASE32: &[u8] = b"abcdefghijklmnopqrstuvwxyz234567";

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
    pub lab: PathBuf,
    pub tz: TimeZone,
    pub counters_file: PathBuf,
}

impl Vault {
    pub fn open(root: PathBuf) -> Res<Self> {
        let text = fs::read_to_string(root.join(CONFIG_NAME))
            .map_err(|e| format!("{}: {e}", root.join(CONFIG_NAME).display()))?;
        let cfg: Config = toml::from_str(&text).map_err(|e| format!("{CONFIG_NAME}: {e}"))?;
        let author = cfg.author.clone().unwrap_or_else(|| "unknown".to_string());
        let lab = root.join(cfg.vault.as_deref().unwrap_or("lab"));
        let tzname = cfg.timezone.clone().unwrap_or_else(|| "UTC".to_string());
        let tz =
            TimeZone::get(&tzname).map_err(|e| format!("{CONFIG_NAME}: timezone {tzname}: {e}"))?;
        let counters_file = lab.join("counters.yaml");
        Ok(Vault {
            root,
            cfg,
            author,
            lab,
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

    /// The one project of a project-shaped repo: the ID on `lab/README.md`.
    pub fn single_project(&self) -> Res<String> {
        let page = self.read(&self.lab.join("README.md"))?;
        page.id().map(str::to_string).ok_or_else(|| {
            format!(
                "{}: no id in frontmatter",
                rel(&self.lab.join("README.md"), &self.root)
            )
        })
    }

    /// Root of another namespace's checkout, when `[repos]` gives a `path` that exists.
    pub fn repo_root(&self, ns: &str) -> Option<PathBuf> {
        let p = self.root.join(self.cfg.repos.get(ns)?.path()?);
        p.join(CONFIG_NAME).is_file().then_some(p)
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
        collect_md(&self.lab, &mut paths)?;
        paths.sort_by_key(|p| {
            p.components()
                .map(|c| c.as_os_str().to_os_string())
                .collect::<Vec<OsString>>()
        });
        paths.iter().map(|p| self.read(p)).collect()
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

    pub fn find(&self, ident: &str) -> Res<Page> {
        match self.index()?.get(ident) {
            Some(path) => self.read(path),
            None => Err(format!("{ident}: not found in {}", self.lab.display())),
        }
    }

    /// Where a project's experiments, runs, analyses and artifacts live: `lab/projects/PRJ-*/`
    /// in a lab, the vault itself in a project repo.
    pub fn project_dir(&self, prj: &str) -> Res<PathBuf> {
        if self.is_project() {
            return Ok(self.lab.clone());
        }
        let projects = self.lab.join("projects");
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
        if VOLUME_PREFIXES.contains(&prefix) {
            let stamp = Zoned::now()
                .with_time_zone(TimeZone::UTC)
                .strftime("%Y%m%d")
                .to_string();
            let suffix: String = (0..4)
                .map(|_| BASE32[fastrand::usize(..BASE32.len())] as char)
                .collect();
            return Ok(format!("{prefix}-{stamp}-{suffix}"));
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
        self.lab
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
