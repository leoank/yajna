//! Reproducing runs (`docs/reproduce.md`, ADR-0031). What a compute run records about how it
//! ran, beyond its `script`: the full `commit`, the `host`, the variables it depended on
//! (`env`) and the files its result rests on with their sha256 (`outputs`). `yajna result`
//! writes them for a run it creates; `yajna run record` fills them on one made by `yajna new
//! run`.

use std::fs;
use std::path::{Path, PathBuf};


use sha2::{Digest, Sha256};

use crate::cli::RunAction;
use crate::init::{edit_frontmatter, set_field};
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

