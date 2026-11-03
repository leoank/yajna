//! Reproducing runs (`docs/reproduce.md`, ADR-0031). What a compute run records about how it
//! ran, beyond its `script`: the full `commit`, the `host`, the variables it depended on
//! (`env`) and the files its result rests on with their sha256 (`outputs`). `yajna result`
//! writes them for a run it creates; `yajna run record` fills them on one made by `yajna new
//! run`.

use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use regex::Regex;

use sha2::{Digest, Sha256};

use crate::cli::RunAction;
use crate::init::{edit_frontmatter, insert_after, set_field};
use crate::parallel::git;
use crate::review::rev;
use crate::vault::{Res, Vault};
use crate::yamlfmt::dump_scalar;

/// Words in a variable name that mark it as a credential, which never goes in a page.
const CREDENTIAL_WORDS: &[&str] = &["KEY", "TOKEN", "SECRET", "PASSWORD", "CREDENTIAL", "AUTH"];

pub fn run(vault: &Vault, action: &RunAction) -> Res<i32> {
    match action {
        RunAction::Record {
            run,
            commit,
            env,
            outputs,
        } => record(vault, run, commit.as_deref(), env, outputs),
        RunAction::Shell {
            run,
            command,
            working_tree,
            on,
        } => crate::rerun::shell_cmd(vault, run, command.as_deref(), *working_tree, on.as_deref()),
        RunAction::Clean { run, force } => crate::rerun::clean(vault, run.as_deref(), *force),
        RunAction::Diff { a, b } => crate::rerun::diff(vault, a, b),
        RunAction::Reproduce {
            run,
            tolerance,
            out_root,
            on,
        } => crate::rerun::reproduce_cmd(vault, run, *tolerance, out_root, on.as_deref()),
    }
}

pub(crate) fn credential_like(name: &str) -> bool {
    let name = name.to_ascii_uppercase();
    CREDENTIAL_WORDS.iter().any(|w| name.contains(w))
}

/// This machine's name, without its domain.
pub(crate) fn host() -> Option<String> {
    #[cfg(unix)]
    let name = {
        let mut buf = [0u8; 256];
        // SAFETY: the buffer is valid for its length; the name is NUL-terminated when it fits
        if unsafe { libc::gethostname(buf.as_mut_ptr().cast(), buf.len()) } != 0 {
            return None;
        }
        let end = buf.iter().position(|&b| b == 0).unwrap_or(buf.len());
        String::from_utf8_lossy(&buf[..end]).into_owned()
    };
    #[cfg(not(unix))]
    let name = std::env::var("COMPUTERNAME").ok()?;
    let name = name.split('.').next().unwrap_or("").to_string();
    (!name.is_empty()).then_some(name)
}

/// The full SHA of HEAD.
pub(crate) fn head(root: &Path) -> Option<String> {
    git(root, &["rev-parse", "HEAD"]).ok()
}

/// The named variables with their values here, refusing credentials and unset names.
pub(crate) fn env_of(names: &[String]) -> Res<Vec<(String, String)>> {
    names
        .iter()
        .map(|name| {
            if credential_like(name) {
                return Err(format!(
                    "--env {name}: looks like a credential, which never goes in a page"
                ));
            }
            let value = std::env::var(name).map_err(|_| format!("--env {name}: not set"))?;
            Ok((name.clone(), value))
        })
        .collect()
}

/// Each file as the page names it, relative to the repo root or as `$VAR/…` under the value
/// of a recorded variable, with its sha256.
pub(crate) fn outputs_of(
    vault: &Vault,
    paths: &[PathBuf],
    env: &[(String, String)],
) -> Res<Vec<(String, String)>> {
    let root = vault.root.canonicalize().map_err(|e| e.to_string())?;
    let roots: Vec<(&str, PathBuf)> = env
        .iter()
        .filter_map(|(k, v)| Some((k.as_str(), Path::new(v).canonicalize().ok()?)))
        .collect();
    paths
        .iter()
        .map(|p| {
            let shown = p.display();
            let abs = p
                .canonicalize()
                .map_err(|e| format!("--outputs {shown}: {e}"))?;
            if !abs.is_file() {
                return Err(format!("--outputs {shown}: not a file"));
            }
            let name = if let Ok(r) = abs.strip_prefix(&root) {
                slashed(r)
            } else if let Some((var, r)) = roots
                .iter()
                .find_map(|(var, base)| Some((var, abs.strip_prefix(base).ok()?)))
            {
                format!("${var}/{}", slashed(r))
            } else {
                return Err(format!(
                    "--outputs {shown}: outside the repo and under no variable given to --env"
                ));
            };
            let bytes = fs::read(&abs).map_err(|e| format!("--outputs {shown}: {e}"))?;
            Ok((name, format!("{:x}", Sha256::digest(&bytes))))
        })
        .collect()
}

fn slashed(p: &Path) -> String {
    p.components()
        .map(|c| c.as_os_str().to_string_lossy())
        .collect::<Vec<_>>()
        .join("/")
}

/// Replace `key` and the indented lines under it, in place, or add it at the end.
fn put_block(lines: &mut Vec<String>, key: &str, block: Vec<String>) {
    let head = format!("{key}:");
    match lines.iter().position(|l| l.starts_with(&head)) {
        Some(i) => {
            let end = (i + 1..lines.len())
                .find(|&j| !(lines[j].starts_with(' ') || lines[j].starts_with("- ")))
                .unwrap_or(lines.len());
            lines.splice(i..end, block);
        }
        None => lines.extend(block),
    }
}

/// Write `host`, `env` and `outputs` into a page's frontmatter; empty ones are left alone.
pub(crate) fn put_fields(
    lines: &mut Vec<String>,
    host: Option<&str>,
    env: &[(String, String)],
    outputs: &[(String, String)],
) {
    if let Some(h) = host {
        set_field(lines, "host", h);
    }
    if !env.is_empty() {
        let mut block = vec!["env:".to_string()];
        block.extend(
            env.iter()
                .map(|(k, v)| format!("  {k}: {}", dump_scalar(v))),
        );
        put_block(lines, "env", block);
    }
    if !outputs.is_empty() {
        let mut block = vec!["outputs:".to_string()];
        for (path, sha) in outputs {
            block.push(format!("  - path: {}", dump_scalar(path)));
            block.push(format!("    sha256: {sha}"));
        }
        put_block(lines, "outputs", block);
    }
}

fn record(
    vault: &Vault,
    id: &str,
    commit: Option<&str>,
    env: &[String],
    outputs: &[PathBuf],
) -> Res<i32> {
    let page = vault.find(&vault.canonical_id(id))?;
    let id = page.id().unwrap_or(id).to_string();
    if page.field("type") != Some("run") {
        return Err(format!("{id} is not a run"));
    }
    let commit = match commit {
        Some("unknown") => Some("unknown".to_string()),
        Some(r) => Some(rev(&vault.root, r)?),
        None if page.field("commit").is_none() => Some(
            head(&vault.root).ok_or("no commit to record: not a git checkout; pass --commit")?,
        ),
        None => None,
    };
    let host = if page.field("host").is_none() {
        host()
    } else {
        None
    };
    let env = env_of(env)?;
    let outputs = outputs_of(vault, outputs, &env)?;

    let text = crate::vault::read_text(&page.path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |fm| {
        if let Some(c) = &commit {
            set_field(fm, "commit", c);
        }
        put_fields(fm, host.as_deref(), &env, &outputs);
    });
    fs::write(&page.path, text).map_err(|e| e.to_string())?;

    let mut done = Vec::new();
    if let Some(c) = &commit {
        done.push(format!("commit {c}"));
    }
    if let Some(h) = &host {
        done.push(format!("host {h}"));
    }
    if !env.is_empty() {
        done.push(format!("env {}", env.len()));
    }
    if !outputs.is_empty() {
        done.push(format!("outputs {}", outputs.len()));
    }
    if done.is_empty() {
        println!("{id}: nothing to record");
    } else {
        println!("{id}: {}", done.join(", "));
    }
    if commit.as_deref() == Some("unknown") {
        println!("say why under Notes: validate asks for the reason");
    }
    Ok(0)
}

// --- commits across graduation ----------------------------------------------------------

static SINCE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\(since ([0-9a-f]{7,40})\)").unwrap());
/// A review's `base` and `head`, and the commit of a thread's anchor.
static REVIEW_SHA_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?m)(?:^(?:base|head): |^### T\d+ .* @ )([0-9a-f]{7,40})\b").unwrap()
});

/// Where a lab commit named in a moved page is in the project's repository.
#[derive(Clone)]
enum Mapped {
    /// it is a commit of the project's repository already
    Here,
    /// the split commit with the same code tree, and the lab commit in full
    To(String, String),
    /// a lab commit no split commit has the tree of
    Unmatched(String),
    /// a commit of neither repository
    Nowhere,
}

struct Mapper<'a> {
    lab: &'a Path,
    into: &'a Path,
    /// the code directory in the lab, then its name before ADR-0020 renamed projects/ to code/
    dirs: Vec<String>,
    /// root tree -> the latest commit of the project's repository with it
    trees: HashMap<String, String>,
    seen: HashMap<String, Mapped>,
}

impl Mapper<'_> {
    fn map(&mut self, sha: &str) -> Mapped {
        if let Some(m) = self.seen.get(sha) {
            return m.clone();
        }
        let m = if rev(self.into, sha).is_ok() {
            Mapped::Here
        } else if let Ok(full) = rev(self.lab, sha) {
            self.dirs
                .iter()
                .find_map(|d| {
                    git(
                        self.lab,
                        &["rev-parse", "-q", "--verify", &format!("{full}:{d}")],
                    )
                    .ok()
                })
                .and_then(|tree| self.trees.get(&tree).cloned())
                .map(|to| Mapped::To(to, full.clone()))
                .unwrap_or(Mapped::Unmatched(full))
        } else {
            Mapped::Nowhere
        };
        self.seen.insert(sha.to_string(), m.clone());
        m
    }
}

/// `git subtree split` writes new commits, so the lab commits that the moved pages name are
/// not in the project's repository. Each is replaced by the latest split commit whose root
/// tree is the code directory's tree at that commit (docs/reproduce.md section 8): a run's
/// `commit`, keeping the lab's as `origin_commit: <lab>@<sha>`, a review's `base`, `head` and
/// anchors, and `(since …)` in Progress items. What does not map is reported and kept.
pub(crate) fn remap_commits(lab: &Vault, code: &str, into: &Path) -> Res<()> {
    let lab_ns = lab.namespace()?.to_string();
    let target = Vault::open(into.to_path_buf())?;
    let mut trees = HashMap::new();
    for line in git(into, &["log", "--all", "--format=%T %H"])
        .unwrap_or_default()
        .lines()
    {
        if let Some((tree, commit)) = line.split_once(' ') {
            trees
                .entry(tree.to_string())
                .or_insert_with(|| commit.to_string());
        }
    }
    let mut dirs = vec![code.to_string()];
    if let Some(rest) = code.strip_prefix("code/") {
        dirs.push(format!("projects/{rest}"));
    }
    let mut m = Mapper {
        lab: &lab.root,
        into,
        dirs,
        trees,
        seen: HashMap::new(),
    };
    let (mut mapped, mut unmatched, mut nowhere) = (0, Vec::new(), Vec::new());
    for page in target.pages()? {
        let id = page.id().unwrap_or("").to_string();
        let text = crate::vault::read_text(&page.path).map_err(|e| e.to_string())?;
        let mut out = text.clone();
        if page.field("type") == Some("run") {
            if let Some(c) = page.field("commit").filter(|c| *c != "unknown") {
                let (commit, origin) = match m.map(c) {
                    Mapped::Here => (None, None),
                    Mapped::To(to, full) => {
                        mapped += 1;
                        println!("{id}: commit {c} -> {}", &to[..12]);
                        (Some(to), Some(full))
                    }
                    Mapped::Unmatched(full) => {
                        unmatched.push(format!("{id} ({c})"));
                        (None, Some(full))
                    }
                    Mapped::Nowhere => {
                        nowhere.push(format!("{id} ({c})"));
                        (None, None)
                    }
                };
                out = edit_frontmatter(&out, |fm| {
                    if let Some(to) = &commit {
                        set_field(fm, "commit", to);
                    }
                    if let Some(full) = &origin {
                        fm.retain(|l| !l.starts_with("origin_commit:"));
                        insert_after(fm, "commit", &format!("origin_commit: {lab_ns}@{full}"));
                    }
                });
            }
        }
        let mut replace = |re: &Regex, text: &str| -> String {
            re.replace_all(text, |caps: &regex::Captures| {
                let sha = &caps[1];
                match m.map(sha) {
                    Mapped::To(to, _) => {
                        mapped += 1;
                        println!("{id}: {sha} -> {}", &to[..12]);
                        caps[0].replacen(sha, &to, 1)
                    }
                    Mapped::Unmatched(_) => {
                        unmatched.push(format!("{id} ({sha})"));
                        caps[0].to_string()
                    }
                    Mapped::Nowhere => {
                        nowhere.push(format!("{id} ({sha})"));
                        caps[0].to_string()
                    }
                    Mapped::Here => caps[0].to_string(),
                }
            })
            .into_owned()
        };
        if page.field("type") == Some("review") {
            out = replace(&REVIEW_SHA_RE, &out);
        }
        out = replace(&SINCE_RE, &out);
        if out != text {
            fs::write(&page.path, out).map_err(|e| e.to_string())?;
        }
    }
    println!("commits: {mapped} mapped to {}", into.display());
    if !unmatched.is_empty() {
        println!(
            "no split commit has the code of: {}; a run keeps the lab's as origin_commit, \
             and needs `commit: unknown` with the reason under Notes",
            unmatched.join(", ")
        );
    }
    if !nowhere.is_empty() {
        println!(
            "in neither repository: {}; set `commit: unknown` with the reason under Notes",
            nowhere.join(", ")
        );
    }
    Ok(())
}
