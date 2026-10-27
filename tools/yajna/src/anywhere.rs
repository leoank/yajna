//! Todos and log lines from anywhere (ADR-0032): the per-user registry of the notebooks on
//! this machine, `--in` targets, `yajna log`, `yajna todo` and `yajna tasks` against any of
//! them, `-e`, and the one-file commit into a repo other than the one you are in.

use std::collections::BTreeMap;
use std::fs;
use std::io::{IsTerminal, Read};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::rc::Rc;
use std::sync::LazyLock;

use jiff::civil::{Date, Weekday};
use regex::Regex;
use serde::{Deserialize, Serialize};

use crate::cli::{Cmd, ReposAction, TodoAction};
use crate::parallel::git;
use crate::tui::{self, Check, Prompter};
use crate::vault::{date_of, rel, Res, Vault, CONFIG_NAME};

static TASK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^\s*- \[( |x|X)\] (.+?)\s*$").unwrap());
static DUE_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(?:^|\s)due:(\S+)").unwrap());
static PRIO_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(?:^|\s)p:(\S+)").unwrap());
static PRJ_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^PRJ-\d{4,}$").unwrap());
static HEADING_PRJ_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^## (PRJ-\d{4,})(?:\s|$)").unwrap());
static COMMENT_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(?s)<!--.*?-->").unwrap());

/// The commands this module runs, with or without a notebook around the current directory.
pub fn handles(cmd: &Cmd) -> bool {
    matches!(
        cmd,
        Cmd::Log { .. } | Cmd::Todo { .. } | Cmd::Tasks { .. } | Cmd::Repos { .. }
    )
}

/// Run one of them. `here` is the notebook the command was started in (or `--root`), if any.
pub fn run(here: Option<&Path>, cmd: &Cmd, p: &mut dyn Prompter) -> Res<i32> {
    match cmd {
        Cmd::Log {
            text,
            date,
            time,
            author,
            target,
            pick,
            edit,
        } => {
            let t = resolve(here, target.as_deref(), *pick, p)?;
            let author = author.clone().unwrap_or_else(|| t.author.clone());
            log(
                &t,
                text,
                date.as_deref(),
                time.as_deref(),
                &author,
                *edit,
                p,
            )
        }
        Cmd::Todo {
            action: Some(TodoAction::Done { what, target }),
            ..
        } => done(here, what, target.as_deref(), p),
        Cmd::Todo {
            action: None,
            text,
            target,
            pick,
            edit,
            due,
            priority,
        } => {
            let t = resolve(here, target.as_deref(), *pick, p)?;
            todo(&t, text, *edit, due.as_deref(), *priority, p)
        }
        Cmd::Tasks { done, target, all } => tasks(here, *done, target.as_deref(), *all, p),
        Cmd::Repos { action } => repos(action.as_ref()),
        _ => unreachable!("not one of ours: {cmd:?}"),
    }
}

// --- the registry ----------------------------------------------------------------------

/// `~/.config/yajna/config.toml`: written by hand or by neusis, never by yajna.
#[derive(Debug, Default, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UserConfig {
    /// the human handle when a notebook does not name one
    pub author: Option<String>,
    /// the target outside any notebook
    pub default: Option<String>,
    /// after $VISUAL and $EDITOR
    pub editor: Option<String>,
    /// pinned notebooks, `name = "path"` or `name = { path = "..." }`; they win over the state
    #[serde(default)]
    pub repos: BTreeMap<String, UserRepo>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
pub enum UserRepo {
    Path(String),
    Table { path: String },
}

impl UserRepo {
    fn path(&self) -> PathBuf {
        let p = match self {
            UserRepo::Path(p) | UserRepo::Table { path: p } => p,
        };
        PathBuf::from(crate::serve::expand(p))
    }
}

/// `~/.local/state/yajna/repos.toml`: every notebook yajna has run in, by namespace.
#[derive(Debug, Default, Serialize, Deserialize)]
struct State {
    #[serde(default)]
    repos: BTreeMap<String, Seen>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Seen {
    path: String,
    #[serde(default)]
    shape: String,
    #[serde(default)]
    seen: String,
    /// other checkouts with the same namespace; the first one recorded is used
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    others: Vec<String>,
}

fn xdg(var: &str, fallback: &str) -> PathBuf {
    std::env::var(var)
        .ok()
        .filter(|s| !s.is_empty())
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(std::env::var("HOME").unwrap_or_default()).join(fallback))
}

pub fn config_path() -> PathBuf {
    xdg("XDG_CONFIG_HOME", ".config")
        .join("yajna")
        .join("config.toml")
}

fn state_dir() -> PathBuf {
    xdg("XDG_STATE_HOME", ".local/state").join("yajna")
}

fn user_config() -> Res<UserConfig> {
    let path = config_path();
    match fs::read_to_string(&path) {
        Ok(text) => toml::from_str(&text).map_err(|e| format!("{}: {e}", path.display())),
        Err(_) => Ok(UserConfig::default()),
    }
}

fn load_state() -> State {
    fs::read_to_string(state_dir().join("repos.toml"))
        .ok()
        .and_then(|t| toml::from_str(&t).ok())
        .unwrap_or_default()
}

fn save_state(state: &State) -> Res<()> {
    let dir = state_dir();
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let text = toml::to_string(state).map_err(|e| e.to_string())?;
    fs::write(
        dir.join("repos.toml"),
        format!("# written by yajna: the notebooks it has run in (ADR-0032)\n{text}"),
    )
    .map_err(|e| e.to_string())
}

fn is_notebook(p: &Path) -> bool {
    p.join(CONFIG_NAME).is_file()
}

/// Record the notebook yajna runs in under its namespace, by its main checkout. Nothing is
/// written when it is known already; failures (a read-only home, a sandbox) are ignored.
pub fn remember(vault: &Vault) {
    let Some(ns) = vault.cfg.namespace.clone() else {
        return;
    };
    let mut state = load_state();
    let here = vault.root.to_string_lossy().to_string();
    if let Some(s) = state.repos.get(&ns) {
        if s.path == here || s.others.contains(&here) {
            return;
        }
    }
    let main = main_checkout(&vault.root).unwrap_or_else(|_| vault.root.clone());
    let main = main.to_string_lossy().to_string();
    match state.repos.get_mut(&ns) {
        Some(s) if s.path == main || s.others.contains(&main) => return,
        Some(s) if is_notebook(Path::new(&s.path)) => {
            eprintln!(
                "note: {ns} is also at {main}; yajna uses {} (pin one under [repos] in {})",
                s.path,
                config_path().display()
            );
            s.others.push(main);
        }
        _ => {
            state.repos.insert(
                ns,
                Seen {
                    path: main,
                    shape: vault.shape().to_string(),
                    seen: jiff::Timestamp::now().to_string(),
                    others: Vec::new(),
                },
            );
        }
    }
    let _ = save_state(&state);
}

/// The checkout of the repo's default branch that holds this notebook: entries from
/// elsewhere land there, never on a branch that might not merge. Outside git, the root.
pub fn main_checkout(root: &Path) -> Res<PathBuf> {
    let Ok(prefix) = git(root, &["rev-parse", "--show-prefix"]) else {
        return Ok(root.to_path_buf());
    };
    let branch = default_branch(root);
    let list = git(root, &["worktree", "list", "--porcelain"])?;
    let checkout = list.split("\n\n").find_map(|block| {
        let on = block
            .lines()
            .find_map(|l| l.strip_prefix("branch refs/heads/"));
        (on == Some(branch.as_str()))
            .then(|| block.lines().find_map(|l| l.strip_prefix("worktree ")))
            .flatten()
    });
    let checkout = PathBuf::from(checkout.ok_or_else(|| {
        format!(
            "{}: no checkout of {branch} on disk; add one with git worktree add",
            root.display()
        )
    })?);
    let prefix = prefix.trim_end_matches('/');
    Ok(if prefix.is_empty() {
        checkout
    } else {
        checkout.join(prefix)
    })
}

fn default_branch(root: &Path) -> String {
    if let Ok(r) = git(
        root,
        &["symbolic-ref", "-q", "--short", "refs/remotes/origin/HEAD"],
    ) {
        if let Some(b) = r.strip_prefix("origin/") {
            return b.to_string();
        }
    }
    for b in ["main", "master"] {
        if git(
            root,
            &["rev-parse", "--verify", "-q", &format!("refs/heads/{b}")],
        )
        .is_ok()
        {
            return b.to_string();
        }
    }
    git(root, &["branch", "--show-current"]).unwrap_or_else(|_| "main".to_string())
}

struct Known {
    name: String,
    path: PathBuf,
    source: &'static str,
}

/// Config entries first, then recorded ones the config does not name.
fn known(cfg: &UserConfig) -> Vec<Known> {
    let mut out: Vec<Known> = cfg
        .repos
        .iter()
        .map(|(name, r)| Known {
            name: name.clone(),
            path: r.path(),
            source: "config",
        })
        .collect();
    for (name, s) in load_state().repos {
        if !cfg.repos.contains_key(&name) {
            out.push(Known {
                name,
                path: PathBuf::from(s.path),
                source: "seen",
            });
        }
    }
    out
}

/// Where the notebook called `name` is: the config's entry, else the recorded one. A
/// recorded path without a notebook is forgotten.
fn lookup(name: &str, cfg: &UserConfig) -> Option<PathBuf> {
    if let Some(r) = cfg.repos.get(name) {
        return Some(r.path()).filter(|p| is_notebook(p));
    }
    let mut state = load_state();
    let s = state.repos.get_mut(name)?;
    if !is_notebook(Path::new(&s.path)) {
        eprintln!(
            "note: forgot {name}: no {CONFIG_NAME} at {} any more",
            s.path
        );
        state.repos.remove(name);
        let _ = save_state(&state);
        return None;
    }
    let before = s.others.len();
    s.others.retain(|o| is_notebook(Path::new(o)));
    for o in &s.others {
        eprintln!(
            "note: {name} is also at {o}; using {} (pin one under [repos] in {})",
            s.path,
            config_path().display()
        );
    }
    let path = PathBuf::from(&s.path);
    if s.others.len() != before {
        let _ = save_state(&state);
    }
    Some(path)
}

fn repos(action: Option<&ReposAction>) -> Res<i32> {
    match action {
        Some(ReposAction::Forget { name }) => {
            let mut state = load_state();
            if state.repos.remove(name).is_some() {
                save_state(&state)?;
                println!("forgot {name}");
                return Ok(0);
            }
            if user_config()?.repos.contains_key(name) {
                return Err(format!(
                    "{name} is pinned in {}; remove it there",
                    config_path().display()
                ));
            }
            Err(format!("{name}: not recorded"))
        }
        None => {
            let cfg = user_config()?;
            let all = known(&cfg);
            if all.is_empty() {
                println!(
                    "no notebooks known yet: run yajna in one, or list them under [repos] in {}",
                    config_path().display()
                );
            }
            for k in all {
                let shape = Vault::open(k.path.clone())
                    .map(|v| v.shape().to_string())
                    .unwrap_or_else(|_| "missing".to_string());
                let default = if cfg.default.as_deref() == Some(k.name.as_str()) {
                    ", default"
                } else {
                    ""
                };
                println!(
                    "{:<16} {:<8} {}  ({}{default})",
                    k.name,
                    shape,
                    k.path.display(),
                    k.source
                );
            }
            Ok(0)
        }
    }
}

// --- targets ---------------------------------------------------------------------------

/// A notebook to write into, and the project in it when it is a lab.
struct Target {
    vault: Vault,
    /// (ID, title) of a project inside a lab
    project: Option<(String, String)>,
    label: String,
    /// written from outside its checkout: the touched file is committed there
    away: bool,
    author: String,
}

fn interactive() -> bool {
    std::io::stdin().is_terminal() || std::env::var_os("YAJNA_ANSWERS").is_some()
}

fn resolve(
    here: Option<&Path>,
    spec: Option<&str>,
    pick: bool,
    p: &mut dyn Prompter,
) -> Res<Target> {
    let cfg = user_config()?;
    if pick {
        return pick_target(&cfg, p);
    }
    if let Some(spec) = spec {
        return from_spec(here, spec, &cfg);
    }
    if let Some(root) = here {
        let vault = Vault::open(root.to_path_buf())?;
        let label = vault
            .cfg
            .namespace
            .clone()
            .unwrap_or_else(|| root.display().to_string());
        return Ok(Target {
            author: vault.default_author(),
            vault,
            project: None,
            label,
            away: false,
        });
    }
    if let Some(d) = cfg.default.as_deref() {
        return from_spec(None, d, &cfg);
    }
    if interactive() {
        return pick_target(&cfg, p);
    }
    Err(format!(
        "not inside a yajna notebook: pass --in, or set `default` in {}",
        config_path().display()
    ))
}

/// `repo`, `repo/project`, or a project of the notebook you are in (else of `default`).
fn from_spec(here: Option<&Path>, spec: &str, cfg: &UserConfig) -> Res<Target> {
    let (repo, project) = match spec.split_once('/') {
        Some((r, p)) => (Some(r), Some(p)),
        None => (None, None),
    };
    if let Some(repo) = repo {
        let path = lookup(repo, cfg)
            .ok_or_else(|| format!("{repo}: no such notebook here (see yajna repos)"))?;
        return in_project(away(&path, cfg)?, project.unwrap_or(""), cfg);
    }
    if let Some(path) = lookup(spec, cfg) {
        return away(&path, cfg);
    }
    let base = match (here, cfg.default.as_deref()) {
        (Some(h), _) => h.to_path_buf(),
        (None, Some(d)) => lookup(d, cfg).ok_or_else(|| format!("{d}: no such notebook here"))?,
        (None, None) => return Err(format!("{spec}: no such notebook here (see yajna repos)")),
    };
    in_project(away(&base, cfg)?, spec, cfg)
}

/// The notebook at `path`, opened in its main checkout.
fn away(path: &Path, cfg: &UserConfig) -> Res<Target> {
    let root = main_checkout(path)?;
    let root = root.canonicalize().unwrap_or(root);
    let vault = Vault::open(root)?;
    let cwd = std::env::current_dir()
        .and_then(|d| d.canonicalize())
        .unwrap_or_default();
    let author = std::env::var("YAJNA_AUTHOR")
        .ok()
        .filter(|s| !s.trim().is_empty())
        .or_else(|| vault.cfg.author.clone())
        .or_else(|| cfg.author.clone())
        .unwrap_or_else(|| "unknown".to_string());
    Ok(Target {
        label: vault
            .cfg
            .namespace
            .clone()
            .unwrap_or_else(|| vault.root.display().to_string()),
        away: !cwd.starts_with(&vault.root),
        author,
        vault,
        project: None,
    })
}

/// Narrow a notebook target to one of its projects: an ID or a slug prefix. A moved project
/// is followed to the notebook it continues in.
fn in_project(mut t: Target, ident: &str, cfg: &UserConfig) -> Res<Target> {
    if ident.is_empty() {
        return Ok(t);
    }
    if t.vault.is_project() {
        let ns = t.vault.namespace()?.to_string();
        if ident == t.vault.single_project()? || ident == ns {
            return Ok(t);
        }
        return Err(format!(
            "{ident}: {ns} is a project repo, its one project is the repo"
        ));
    }
    let projects: Vec<(String, String, String, crate::vault::Page)> = t
        .vault
        .pages()?
        .into_iter()
        .filter(|pg| pg.field("type") == Some("project"))
        .filter_map(|pg| {
            let id = pg.id()?.to_string();
            let dir = pg.path.parent()?.file_name()?.to_string_lossy().to_string();
            let slug = dir
                .strip_prefix(&format!("{id}-"))
                .unwrap_or(&dir)
                .to_string();
            Some((id, slug, pg.field("title").unwrap_or("").to_string(), pg))
        })
        .collect();
    let found: Vec<_> = if PRJ_RE.is_match(ident) {
        projects.iter().filter(|p| p.0 == ident).collect()
    } else {
        let exact: Vec<_> = projects.iter().filter(|p| p.1 == ident).collect();
        if exact.len() == 1 {
            exact
        } else {
            projects.iter().filter(|p| p.1.starts_with(ident)).collect()
        }
    };
    let (id, _, title, page) = match found.as_slice() {
        [one] => *one,
        [] => return Err(format!("{ident}: no such project in {}", t.label)),
        many => {
            return Err(format!(
                "{ident} is ambiguous in {}: {}",
                t.label,
                many.iter()
                    .map(|p| format!("{} ({})", p.0, p.1))
                    .collect::<Vec<_>>()
                    .join(", ")
            ))
        }
    };
    if page.field("status") == Some("moved") {
        let next = page.field("continued_in").unwrap_or("");
        let ns = next.split('/').next().unwrap_or("");
        let path = lookup(ns, cfg).ok_or_else(|| {
            format!("{id} moved to {next}, and {ns} is not a notebook here (see yajna repos)")
        })?;
        eprintln!("note: {id} moved; writing to {next}");
        return away(&path, cfg);
    }
    t.label = format!("{}/{id}", t.label);
    t.project = Some((id.clone(), title.clone()));
    Ok(t)
}

/// Print a numbered list and ask for a number.
fn choose(p: &mut dyn Prompter, what: &str, items: &[String]) -> Res<usize> {
    for (i, it) in items.iter().enumerate() {
        println!("{:>3}  {it}", i + 1);
    }
    let n = items.len();
    let check: Check = Rc::new(move |s: &str| match s.parse::<usize>() {
        Ok(k) if (1..=n).contains(&k) => Ok(()),
        _ => Err(format!("a number from 1 to {n}")),
    });
    let answer = p.ask(what, None, Some(check), "")?;
    Ok(answer.parse::<usize>().map_err(|e| e.to_string())? - 1)
}

/// A notebook from the registry, then for a lab the lab itself or one of its active projects.
fn pick_target(cfg: &UserConfig, p: &mut dyn Prompter) -> Res<Target> {
    if !interactive() {
        return Err("--pick needs a terminal".to_string());
    }
    let all: Vec<Known> = known(cfg)
        .into_iter()
        .filter(|k| is_notebook(&k.path))
        .collect();
    if all.is_empty() {
        return Err(format!(
            "no notebooks known yet: run yajna in one, or list them under [repos] in {}",
            config_path().display()
        ));
    }
    let names: Vec<String> = all
        .iter()
        .map(|k| format!("{:<16} {}", k.name, k.path.display()))
        .collect();
    let k = &all[choose(p, "notebook", &names)?];
    let t = away(&k.path, cfg)?;
    if t.vault.is_project() {
        return Ok(t);
    }
    let projects: Vec<(String, String)> = t
        .vault
        .pages()?
        .into_iter()
        .filter(|pg| pg.field("type") == Some("project") && pg.field("status") == Some("active"))
        .filter_map(|pg| Some((pg.id()?.to_string(), pg.field("title")?.to_string())))
        .collect();
    if projects.is_empty() {
        return Ok(t);
    }
    let mut items = vec![format!("{} (the lab itself)", t.label)];
    items.extend(projects.iter().map(|(id, title)| format!("{id} {title}")));
    match choose(p, "project", &items)? {
        0 => Ok(t),
        i => in_project(t, &projects[i - 1].0, cfg),
    }
}

// --- writing ---------------------------------------------------------------------------

/// The entries to write: the words given, else `-e`, else a prompt or stdin.
fn entries(
    words: &[String],
    edit: bool,
    kind: &str,
    t: &Target,
    author: &str,
    p: &mut dyn Prompter,
) -> Res<(Vec<String>, Option<PathBuf>)> {
    if edit {
        return edit_entries(kind, t, author);
    }
    let mut text = words.join(" ").trim().to_string();
    if text.is_empty() {
        if std::io::stdin().is_terminal() {
            text = if kind == "log" {
                tui::log_entry(&t.vault, p)?
            } else {
                p.ask(kind, None, None, "")?
            };
        } else {
            let mut buf = String::new();
            std::io::stdin()
                .read_to_string(&mut buf)
                .map_err(|e| e.to_string())?;
            text = buf.trim().to_string();
        }
    }
    Ok((
        Some(text).filter(|s| !s.is_empty()).into_iter().collect(),
        None,
    ))
}

fn log(
    t: &Target,
    words: &[String],
    date: Option<&str>,
    time: Option<&str>,
    author: &str,
    edit: bool,
    p: &mut dyn Prompter,
) -> Res<i32> {
    let vault = &t.vault;
    let now = vault.now();
    let date = date.map(str::to_string).unwrap_or_else(|| date_of(&now));
    let time = time
        .map(str::to_string)
        .unwrap_or_else(|| now.strftime("%H:%M").to_string());
    let (lines, scratch) = entries(words, edit, "log", t, author, p)?;
    if lines.is_empty() {
        if edit {
            println!("nothing added");
            return Ok(0);
        }
        return Err("nothing to log".to_string());
    }
    let path = vault.log_path(&date, Some(author));
    let before = dirty(&vault.root, &path);
    if !path.exists() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        fs::write(
            &path,
            vault.render("log", &[("date", &date), ("author", author)])?,
        )
        .map_err(|e| e.to_string())?;
    }
    let tag = t
        .project
        .as_ref()
        .map(|(id, _)| format!("[[{id}]] "))
        .unwrap_or_default();
    let mut content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    for line in &lines {
        content.push_str(&format!("- {time} {tag}{line}\n"));
    }
    fs::write(&path, content).map_err(|e| e.to_string())?;
    let at = if t.away {
        format!("{}: ", t.label)
    } else {
        String::new()
    };
    for line in &lines {
        println!("{at}{}: {time} {tag}{line}", rel(&path, &vault.root));
    }
    if let Some(s) = scratch {
        let _ = fs::remove_file(s);
    }
    if t.away {
        commit(&vault.root, &path, "docs(notes): log", before);
    }
    Ok(0)
}

fn todo(
    t: &Target,
    words: &[String],
    edit: bool,
    due: Option<&str>,
    priority: Option<u8>,
    p: &mut dyn Prompter,
) -> Res<i32> {
    let vault = &t.vault;
    let today = vault.now().date();
    let due = due.map(|d| parse_due(d, today)).transpose()?;
    let (items, scratch) = entries(words, edit, "todo", t, &t.author, p)?;
    if items.is_empty() {
        if edit {
            println!("nothing added");
            return Ok(0);
        }
        return Err("nothing to add".to_string());
    }
    let items: Vec<String> = items
        .iter()
        .map(|i| with_tokens(i, due, priority).map(|i| format!("- [ ] {i}")))
        .collect::<Res<_>>()?;
    let path = vault.notes.join("tasks.md");
    let before = dirty(&vault.root, &path);
    let mut text = match fs::read_to_string(&path) {
        Ok(t) => t,
        Err(_) => vault.template("init/tasks.md")?,
    };
    let section = t
        .project
        .as_ref()
        .map(|(id, title)| (id.as_str(), title.as_str()));
    for item in &items {
        text = insert_item(&text, section, item);
    }
    fs::write(&path, text).map_err(|e| e.to_string())?;
    let at = if t.away {
        format!("{}: ", t.label)
    } else {
        String::new()
    };
    for item in &items {
        println!("{at}{}: {item}", rel(&path, &vault.root));
    }
    if let Some(s) = scratch {
        let _ = fs::remove_file(s);
    }
    if t.away {
        commit(&vault.root, &path, "docs(notes): todo", before);
    }
    Ok(0)
}

/// Whether `file` has uncommitted changes; None outside git.
fn dirty(root: &Path, file: &Path) -> Option<bool> {
    let f = rel(file, root).to_string();
    git(root, &["status", "--porcelain", "--", &f])
        .ok()
        .map(|s| !s.trim().is_empty())
}

/// Commit only `file`, and only when it was clean before the write.
fn commit(root: &Path, file: &Path, msg: &str, before: Option<bool>) {
    let f = rel(file, root).to_string();
    match before {
        None => eprintln!(
            "note: {} is not a git checkout; nothing committed",
            root.display()
        ),
        Some(true) => eprintln!("note: {f} already had uncommitted changes; left uncommitted"),
        Some(false) => {
            let done = git(root, &["add", "--", &f])
                .and_then(|_| git(root, &["commit", "-q", "-m", msg, "--", &f]))
                .and_then(|_| git(root, &["rev-parse", "--short", "HEAD"]));
            match done {
                Ok(sha) => println!("committed {f} in {} ({sha})", root.display()),
                Err(e) => eprintln!("note: written but not committed: {e}"),
            }
        }
    }
}

/// Add `item` to tasks.md: at the end of the list before the first `##` heading, or at the
/// end of the project's `## PRJ-… <title>` section, created when missing. An empty `- [ ]`
/// placeholder is replaced.
fn insert_item(text: &str, section: Option<(&str, &str)>, item: &str) -> String {
    let mut lines: Vec<String> = text.lines().map(str::to_string).collect();
    let (start, end) = match section {
        None => (
            0,
            lines
                .iter()
                .position(|l| l.starts_with("## "))
                .unwrap_or(lines.len()),
        ),
        Some((id, title)) => match section_start(&lines, id) {
            Some(h) => (h + 1, section_end(&lines, h)),
            None => {
                while lines.last().is_some_and(|l| l.trim().is_empty()) {
                    lines.pop();
                }
                let heading = format!("## {id} {title}");
                lines.extend([String::new(), heading.trim_end().to_string(), String::new()]);
                lines.push(item.to_string());
                return lines.join("\n") + "\n";
            }
        },
    };
    if let Some(i) = (start..end).find(|&i| lines[i].trim() == "- [ ]") {
        lines[i] = item.to_string();
    } else {
        let last = (start..end).rev().find(|&i| !lines[i].trim().is_empty());
        let at = last.map_or(start, |i| i + 1);
        let mut new = Vec::new();
        if !last.is_some_and(|i| lines[i].trim_start().starts_with("- ")) {
            new.push(String::new());
        }
        new.push(item.to_string());
        if at < lines.len() && !lines[at].trim().is_empty() {
            new.push(String::new());
        }
        lines.splice(at..at, new);
    }
    lines.join("\n") + "\n"
}

fn section_start(lines: &[impl AsRef<str>], id: &str) -> Option<usize> {
    lines.iter().position(|l| {
        HEADING_PRJ_RE
            .captures(l.as_ref())
            .is_some_and(|m| &m[1] == id)
    })
}

fn section_end(lines: &[impl AsRef<str>], heading: usize) -> usize {
    (heading + 1..lines.len())
        .find(|&i| {
            let l = lines[i].as_ref();
            l.starts_with("# ") || l.starts_with("## ")
        })
        .unwrap_or(lines.len())
}

// --- tokens ----------------------------------------------------------------------------

/// `due:` and `p:` in a todo's text.
fn tokens(text: &str) -> Res<(Option<Date>, Option<u8>)> {
    let due = DUE_RE
        .captures(text)
        .map(|m| {
            m[1].parse::<Date>()
                .map_err(|_| format!("due:{}: not a YYYY-MM-DD date", &m[1]))
        })
        .transpose()?;
    let prio = PRIO_RE
        .captures(text)
        .map(|m| match m[1].parse::<u8>() {
            Ok(n @ 1..=3) => Ok(n),
            _ => Err(format!("p:{}: priority is 1, 2 or 3", &m[1])),
        })
        .transpose()?;
    Ok((due, prio))
}

/// The todo with `--due` and `-p` as tokens at its end, replacing any typed in the text.
fn with_tokens(text: &str, due: Option<Date>, prio: Option<u8>) -> Res<String> {
    let mut t = text.trim().to_string();
    if due.is_some() {
        t = DUE_RE.replace_all(&t, "").trim().to_string();
    }
    if prio.is_some() {
        t = PRIO_RE.replace_all(&t, "").trim().to_string();
    }
    tokens(&t)?;
    if let Some(d) = due {
        t.push_str(&format!(" due:{d}"));
    }
    if let Some(p) = prio {
        t.push_str(&format!(" p:{p}"));
    }
    Ok(t)
}

/// A date, `today`, `tomorrow`, a weekday (the next one after today), `+3d` or `+2w`.
fn parse_due(s: &str, today: Date) -> Res<Date> {
    let s = s.trim().to_lowercase();
    let bad = |e: jiff::Error| e.to_string();
    let weekday = match s.as_str() {
        "today" => return Ok(today),
        "tomorrow" => return today.tomorrow().map_err(bad),
        "mon" | "monday" => Some(Weekday::Monday),
        "tue" | "tuesday" => Some(Weekday::Tuesday),
        "wed" | "wednesday" => Some(Weekday::Wednesday),
        "thu" | "thursday" => Some(Weekday::Thursday),
        "fri" | "friday" => Some(Weekday::Friday),
        "sat" | "saturday" => Some(Weekday::Saturday),
        "sun" | "sunday" => Some(Weekday::Sunday),
        _ => None,
    };
    if let Some(w) = weekday {
        return today.nth_weekday(1, w).map_err(bad);
    }
    if let Some(n) = s.strip_prefix('+') {
        let (num, unit) = n.split_at(n.len().saturating_sub(1));
        if let Ok(k) = num.parse::<i64>() {
            let days = match unit {
                "d" => Some(k),
                "w" => Some(k * 7),
                _ => None,
            };
            if let Some(d) = days {
                return today.checked_add(jiff::Span::new().days(d)).map_err(bad);
            }
        }
    }
    s.parse::<Date>().map_err(|_| {
        format!("--due {s}: a date (YYYY-MM-DD), today, tomorrow, a weekday, +3d or +2w")
    })
}

// --- the editor ------------------------------------------------------------------------

fn on_path(name: &str) -> bool {
    std::env::var_os("PATH")
        .map(|p| std::env::split_paths(&p).any(|d| d.join(name).is_file()))
        .unwrap_or(false)
}

/// Open the editor on a scratch file; each paragraph written becomes one entry. The scratch
/// file is returned for the caller to remove once the entries are written.
fn edit_entries(kind: &str, t: &Target, author: &str) -> Res<(Vec<String>, Option<PathBuf>)> {
    let cfg = user_config()?;
    let editor = ["VISUAL", "EDITOR"]
        .iter()
        .find_map(|v| std::env::var(v).ok().filter(|s| !s.trim().is_empty()))
        .or(cfg.editor)
        .unwrap_or_else(|| if on_path("nvim") { "nvim" } else { "vi" }.to_string());
    let dir = state_dir().join("scratch");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{kind}-{}.md", std::process::id()));
    let what = match &t.project {
        Some((_, title)) => format!("{} ({title})", t.label),
        None => t.label.clone(),
    };
    let hint = if kind == "todo" {
        "One todo per paragraph; due:YYYY-MM-DD and p:1-3 work in the text."
    } else {
        "One log line per paragraph."
    };
    fs::write(
        &path,
        format!(
            "<!-- yajna {kind} → {what}, {}, {author}\n     {hint}\n     Link with [[ID]]. Save and quit to add; leave it empty to cancel. -->\n\n",
            t.vault.today()
        ),
    )
    .map_err(|e| e.to_string())?;
    let parts = shlex::split(&editor).unwrap_or_else(|| vec![editor.clone()]);
    let (prog, args) = parts.split_first().ok_or("empty editor")?;
    let status = Command::new(prog)
        .args(args)
        .arg(&path)
        .status()
        .map_err(|e| format!("{editor}: {e}"))?;
    let text = fs::read_to_string(&path).unwrap_or_default();
    if !status.success() {
        let _ = fs::remove_file(&path);
        return Ok((Vec::new(), None));
    }
    let entries = paragraphs(&text);
    if entries.is_empty() {
        let _ = fs::remove_file(&path);
        return Ok((entries, None));
    }
    Ok((entries, Some(path)))
}

/// Paragraphs of `text` without its HTML comments, each joined into one line.
fn paragraphs(text: &str) -> Vec<String> {
    let text = COMMENT_RE.replace_all(text, "");
    let mut out = Vec::new();
    let mut cur: Vec<&str> = Vec::new();
    for line in text.lines().chain(std::iter::once("")) {
        if line.trim().is_empty() {
            if !cur.is_empty() {
                out.push(cur.join(" "));
                cur.clear();
            }
        } else {
            cur.push(line.trim());
        }
    }
    out
}

// --- tasks -----------------------------------------------------------------------------

/// One checkbox as listed.
struct Item {
    ns: String,
    root: PathBuf,
    file: PathBuf,
    line: usize,
    raw: String,
    done: bool,
    text: String,
    label: String,
    section: String,
    project: Option<String>,
    due: Option<Date>,
    prio: Option<u8>,
}

/// What `yajna tasks` showed, for `yajna todo done <n>`.
#[derive(Serialize, Deserialize)]
struct Listed {
    root: PathBuf,
    file: PathBuf,
    line: usize,
    raw: String,
}

/// Every checkbox in a notebook's pages, its log and tasks.md, with the project it belongs
/// to: a page's `project` (or its own ID), or the `## PRJ-…` heading it sits under.
fn collect(vault: &Vault, ns: &str, out: &mut Vec<Item>) -> Res<()> {
    for page in vault.pages()? {
        let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
        let page_project = page
            .field("project")
            .map(|p| p.rsplit('/').next().unwrap_or(p).to_string())
            .or_else(|| {
                (page.field("type") == Some("project"))
                    .then(|| page.id().map(str::to_string))
                    .flatten()
            });
        let mut section = String::new();
        let mut heading_project: Option<String> = None;
        for (i, line) in text.lines().enumerate() {
            if line.starts_with('#') {
                section = line.trim_start_matches('#').trim().to_string();
                if line.starts_with("## ") || line.starts_with("# ") {
                    heading_project = HEADING_PRJ_RE.captures(line).map(|m| m[1].to_string());
                }
                continue;
            }
            let Some(m) = TASK_RE.captures(line) else {
                continue;
            };
            let (due, prio) = tokens(&m[2]).unwrap_or((None, None));
            out.push(Item {
                ns: ns.to_string(),
                root: vault.root.clone(),
                file: page.path.clone(),
                line: i + 1,
                raw: line.to_string(),
                done: m[1].eq_ignore_ascii_case("x"),
                text: m[2].to_string(),
                label: page.id().map(|id| format!("[{id}] ")).unwrap_or_default(),
                section: section.clone(),
                project: page_project.clone().or_else(|| heading_project.clone()),
                due,
                prio,
            });
        }
    }
    Ok(())
}

/// The checkboxes of a target: all of a notebook's, or a project's in a lab.
fn target_items(t: &Target, out: &mut Vec<Item>) -> Res<()> {
    let mut items = Vec::new();
    collect(&t.vault, &t.label, &mut items)?;
    if let Some((id, _)) = &t.project {
        items.retain(|i| i.project.as_deref() == Some(id.as_str()));
    }
    out.extend(items);
    Ok(())
}

fn tasks(
    here: Option<&Path>,
    done: bool,
    spec: Option<&str>,
    all: bool,
    p: &mut dyn Prompter,
) -> Res<i32> {
    let mut items = Vec::new();
    let many = all;
    if all {
        let cfg = user_config()?;
        for k in known(&cfg) {
            if !is_notebook(&k.path) {
                continue;
            }
            match away(&k.path, &cfg) {
                Ok(mut t) => {
                    t.label = k.name.clone();
                    target_items(&t, &mut items)?;
                }
                Err(e) => eprintln!("note: {}: {e}", k.name),
            }
        }
    } else {
        let t = resolve(here, spec, false, p)?;
        target_items(&t, &mut items)?;
    }
    items.retain(|i| done || !i.done);
    let today = jiff::Zoned::now().date();
    let overdue = |i: &Item| !i.done && i.due.is_some_and(|d| d < today);
    // stable: items without tokens keep their file order
    items.sort_by_key(|i| (!overdue(i), i.prio.unwrap_or(9), i.due.unwrap_or(Date::MAX)));
    let colour = std::io::stdout().is_terminal();
    let mut listed = Vec::new();
    for (n, i) in items.iter().enumerate() {
        let file = rel(&i.file, &i.root);
        let where_ = if many {
            format!("{}:{file}:{}", i.ns, i.line)
        } else {
            format!("{file}:{}", i.line)
        };
        let sect = if i.section.is_empty() {
            String::new()
        } else {
            format!("{}: ", i.section)
        };
        let mark = if overdue(i) { '!' } else { ' ' };
        let line = format!(
            "{:>3}{mark} {where_:<56} {}{sect}{}",
            n + 1,
            i.label,
            i.text
        );
        if colour && overdue(i) {
            println!("\x1b[31m{line}\x1b[0m");
        } else {
            println!("{line}");
        }
        listed.push(Listed {
            root: i.root.clone(),
            file: i.file.clone(),
            line: i.line,
            raw: i.raw.clone(),
        });
    }
    if items.is_empty() {
        println!("{}", if done { "no tasks" } else { "no open tasks" });
    }
    if let Ok(json) = serde_json::to_string(&listed) {
        let _ = fs::create_dir_all(state_dir())
            .and_then(|_| fs::write(state_dir().join("tasks.json"), json));
    }
    Ok(0)
}

fn done(
    here: Option<&Path>,
    what: &[String],
    spec: Option<&str>,
    p: &mut dyn Prompter,
) -> Res<i32> {
    if let ([n], None) = (what, spec) {
        if let Ok(n) = n.parse::<usize>() {
            let text = fs::read_to_string(state_dir().join("tasks.json"))
                .map_err(|_| "no listing to pick from: run yajna tasks first".to_string())?;
            let listed: Vec<Listed> = serde_json::from_str(&text).map_err(|e| e.to_string())?;
            let item = n
                .checked_sub(1)
                .and_then(|i| listed.get(i))
                .ok_or_else(|| format!("{n}: the last yajna tasks listed {}", listed.len()))?;
            let cwd = std::env::current_dir()
                .and_then(|d| d.canonicalize())
                .unwrap_or_default();
            let away = !cwd.starts_with(item.root.canonicalize().unwrap_or(item.root.clone()));
            return tick(&item.root, &item.file, item.line, &item.raw, away);
        }
    }
    let t = resolve(here, spec, false, p)?;
    let mut items = Vec::new();
    target_items(&t, &mut items)?;
    items.retain(|i| !i.done);
    let words: Vec<String> = what.iter().map(|w| w.to_lowercase()).collect();
    items.retain(|i| {
        let text = i.text.to_lowercase();
        words.iter().all(|w| text.contains(w.as_str()))
    });
    let item = match items.len() {
        0 if words.is_empty() => return Err(format!("no open todos in {}", t.label)),
        0 => {
            return Err(format!(
                "no open todo in {} matches {:?}",
                t.label,
                what.join(" ")
            ))
        }
        1 if !words.is_empty() => &items[0],
        _ => {
            if !interactive() {
                return Err(format!(
                    "{} open todos match; name it more closely or pass its number from yajna tasks",
                    items.len()
                ));
            }
            let names: Vec<String> = items
                .iter()
                .map(|i| format!("{}:{}  {}", rel(&i.file, &i.root), i.line, i.text))
                .collect();
            &items[choose(p, "tick", &names)?]
        }
    };
    tick(&item.root, &item.file, item.line, &item.raw, t.away)
}

/// Tick the checkbox at `file:line` if the line is still `raw`, adding `done:<date>`.
fn tick(root: &Path, file: &Path, line: usize, raw: &str, away: bool) -> Res<i32> {
    let vault = Vault::open(root.to_path_buf())?;
    let f = rel(file, root).to_string();
    let text = fs::read_to_string(file).map_err(|e| format!("{f}: {e}"))?;
    let mut lines: Vec<&str> = text.split_inclusive('\n').collect();
    let current = line
        .checked_sub(1)
        .and_then(|i| lines.get(i))
        .map(|l| l.trim_end_matches(['\n', '\r']));
    if current != Some(raw) {
        return Err(format!(
            "{f}:{line} changed since it was listed; run yajna tasks again"
        ));
    }
    let before = dirty(root, file);
    let ticked = format!("{} done:{}\n", raw.replacen("[ ]", "[x]", 1), vault.today());
    lines[line - 1] = &ticked;
    fs::write(file, lines.concat()).map_err(|e| e.to_string())?;
    println!("ticked {f}:{line}: {}", ticked.trim_end());
    if away {
        commit(root, file, "docs(notes): todo done", before);
    }
    Ok(0)
}

// --- validation and graduation ---------------------------------------------------------

/// tasks.md: a `## PRJ-…` heading names a project of this notebook, and tokens parse.
pub fn tasks_problems(vault: &Vault) -> Vec<String> {
    let path = vault.notes.join("tasks.md");
    let Ok(text) = fs::read_to_string(&path) else {
        return Vec::new();
    };
    let projects: Vec<String> = vault
        .pages()
        .unwrap_or_default()
        .iter()
        .filter(|p| p.field("type") == Some("project"))
        .filter_map(|p| p.id().map(str::to_string))
        .collect();
    let f = rel(&path, &vault.root);
    let mut out = Vec::new();
    for (i, line) in text.lines().enumerate() {
        if let Some(m) = HEADING_PRJ_RE.captures(line) {
            if !projects.iter().any(|p| p == &m[1]) {
                out.push(format!("{f}:{}: {} is not a project here", i + 1, &m[1]));
            }
        }
        if let Some(m) = TASK_RE.captures(line) {
            if let Err(e) = tokens(&m[2]) {
                out.push(format!("{f}:{}: {e}", i + 1));
            }
        }
    }
    out
}

/// Graduation: the project's section of the lab's tasks.md moves to the new repo's, and
/// the lab keeps a line saying where it went.
pub fn move_todos(lab: &Vault, prj: &str, into: &Path, continued: &str) -> Res<()> {
    let lab_file = lab.notes.join("tasks.md");
    let Ok(text) = fs::read_to_string(&lab_file) else {
        return Ok(());
    };
    let lines: Vec<&str> = text.lines().collect();
    let Some(h) = section_start(&lines, prj) else {
        return Ok(());
    };
    let end = section_end(&lines, h);
    let items: Vec<&str> = lines[h + 1..end]
        .iter()
        .filter(|l| TASK_RE.is_match(l))
        .map(|l| l.trim())
        .collect();
    if items.is_empty() {
        return Ok(());
    }
    let new = Vault::open(into.to_path_buf())?;
    let new_file = new.notes.join("tasks.md");
    let mut new_text = match fs::read_to_string(&new_file) {
        Ok(t) => t,
        Err(_) => new.template("init/tasks.md")?,
    };
    for item in &items {
        new_text = insert_item(&new_text, None, item);
    }
    fs::write(&new_file, new_text).map_err(|e| e.to_string())?;
    let mut out: Vec<String> = lines[..=h].iter().map(|l| l.to_string()).collect();
    out.push(String::new());
    out.push(format!(
        "Moved to `notes/tasks.md` in [[{continued}]] with the project."
    ));
    if end < lines.len() {
        out.push(String::new());
    }
    out.extend(lines[end..].iter().map(|l| l.to_string()));
    fs::write(&lab_file, out.join("\n") + "\n").map_err(|e| e.to_string())?;
    println!(
        "todos: {} moved from {} to {}",
        items.len(),
        rel(&lab_file, &lab.root),
        rel(&new_file, into)
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn items_go_where_they_belong() {
        let base = "# Tasks\n\nLoose todos.\n\n- [ ] \n";
        let t = insert_item(base, None, "- [ ] one");
        assert_eq!(t, "# Tasks\n\nLoose todos.\n\n- [ ] one\n");
        let t = insert_item(&t, None, "- [ ] two");
        assert_eq!(t, "# Tasks\n\nLoose todos.\n\n- [ ] one\n- [ ] two\n");
        let t = insert_item(&t, Some(("PRJ-0005", "Vesicles")), "- [ ] image");
        assert_eq!(
            t,
            "# Tasks\n\nLoose todos.\n\n- [ ] one\n- [ ] two\n\n## PRJ-0005 Vesicles\n\n- [ ] image\n"
        );
        let t = insert_item(&t, None, "- [ ] three");
        assert!(t.contains("- [ ] two\n- [ ] three\n\n## PRJ-0005"), "{t}");
        let t = insert_item(&t, Some(("PRJ-0005", "Vesicles")), "- [ ] again");
        assert!(t.ends_with("- [ ] image\n- [ ] again\n"), "{t}");
        // a list that has only prose before it gets a blank line
        let t = insert_item("# Tasks\n\nLoose todos.\n", None, "- [ ] x");
        assert_eq!(t, "# Tasks\n\nLoose todos.\n\n- [ ] x\n");
    }

    #[test]
    fn due_dates_and_tokens() {
        let today: Date = "2026-10-27".parse().unwrap(); // a Tuesday
        let d = |s: &str| parse_due(s, today).unwrap().to_string();
        assert_eq!(d("today"), "2026-10-27");
        assert_eq!(d("tomorrow"), "2026-10-28");
        assert_eq!(d("fri"), "2026-10-30");
        assert_eq!(d("tue"), "2026-11-03");
        assert_eq!(d("+3d"), "2026-10-30");
        assert_eq!(d("+2w"), "2026-11-10");
        assert_eq!(d("2026-12-01"), "2026-12-01");
        assert!(parse_due("someday", today).is_err());
        assert_eq!(
            with_tokens("order agarose due:2026-11-01 p:3", Some(today), Some(1)).unwrap(),
            "order agarose due:2026-10-27 p:1"
        );
        assert_eq!(
            with_tokens("order agarose p:2", None, None).unwrap(),
            "order agarose p:2"
        );
        assert!(with_tokens("x p:7", None, None).is_err());
        assert!(with_tokens("x due:soon", None, None).is_err());
    }

    #[test]
    fn paragraphs_are_entries() {
        let text = "<!-- yajna todo → x\n  hint -->\n\nfirst line\ncontinued\n\n\nsecond\n";
        assert_eq!(paragraphs(text), vec!["first line continued", "second"]);
        assert!(paragraphs("<!-- only -->\n\n").is_empty());
    }
}
