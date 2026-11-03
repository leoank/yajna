//! Running a recorded run again (`docs/reproduce.md` sections 3, 5 to 7 and 9): `yajna run
//! shell` opens the project's dev shell in a worktree at the run's commit with the run's
//! directory copied in from now, `run clean` removes those worktrees, `run diff` says what
//! differs between two runs, `run reproduce` runs the script there into a new run and
//! compares, and `--on <host>` does it on another machine: the worktree is made there over
//! ssh and the run's page is written here, so that machine needs git, tar and Nix, not yajna
//! (ADR-0033).

use std::collections::hash_map::DefaultHasher;
use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::hash::{Hash, Hasher};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

use serde_json::Value;
use sha2::{Digest, Sha256};

use crate::commands::RESULT_MARK;
use crate::init::{edit_frontmatter, set_field};
use crate::parallel::git;
use crate::reproduce::{host, put_fields};
use crate::review::rev;
use crate::vault::{iso_minutes, rel, Page, Res, Vault};

/// Another machine to run on (section 9, as amended by ADR-0033): reached over ssh, with a
/// checkout of this repository at `root`. It needs git, tar and Nix; yajna stays here.
struct Remote {
    host: String,
    /// the notebook's root there, as written in `.yajna/hosts.toml`
    root: String,
    /// `$HOME/.cache/yajna/runs/<hash>`, where its run worktrees live there
    trees: String,
}

/// The worktree of one run, here or on a remote, ready to run something in.
struct Tree {
    remote: Option<Remote>,
    /// the worktree's top level (a path on the remote when there is one)
    wt: PathBuf,
    /// the notebook's path inside the repository: `""` or `sub/dir/`
    prefix: String,
    /// the run's directory, relative to the top level, ending in `/`
    dir_rel: String,
    commit: String,
    /// the flake's directory, relative to the top level (`.` for the top level)
    flake: Option<String>,
    env: Vec<(String, String)>,
    banner: Vec<String>,
}

impl Tree {
    /// The notebook's root in the worktree: where everything runs.
    fn root(&self) -> PathBuf {
        if self.prefix.is_empty() {
            self.wt.clone()
        } else {
            self.wt.join(self.prefix.trim_end_matches('/'))
        }
    }

    fn run_dir(&self) -> PathBuf {
        self.wt.join(self.dir_rel.trim_end_matches('/'))
    }

    /// `argv` at the notebook's root in the worktree, in the flake's dev shell when there is
    /// one, with `env` exported: here, or over ssh (`tty` for an interactive shell).
    fn command(&self, argv: &[String], env: &[(String, String)], tty: bool) -> Res<Command> {
        let flake = self.flake.as_ref().map(|f| self.wt.join(f));
        let Some(remote) = &self.remote else {
            let mut cmd = match &flake {
                Some(f) => {
                    let mut c = Command::new("nix");
                    c.arg("develop").arg(f).arg("-c").args(argv);
                    c
                }
                None => {
                    let mut c = Command::new(&argv[0]);
                    c.args(&argv[1..]);
                    c
                }
            };
            cmd.current_dir(self.root())
                .envs(env.iter().map(|(k, v)| (k.as_str(), v.as_str())));
            return Ok(cmd);
        };
        let mut words = vec![
            "cd".to_string(),
            q(&self.root().to_string_lossy())?,
            "&&".into(),
            "exec".into(),
            "env".into(),
        ];
        for (k, v) in env {
            words.push(q(&format!("{k}={v}"))?);
        }
        if let Some(f) = &flake {
            words.extend([
                "nix".into(),
                "develop".into(),
                q(&f.to_string_lossy())?,
                "-c".into(),
            ]);
        }
        for a in argv {
            words.push(q(a)?);
        }
        let mut cmd = Command::new("ssh");
        cmd.arg(if tty { "-t" } else { "-T" })
            .arg(&remote.host)
            .arg(words.join(" "));
        Ok(cmd)
    }

    /// Run a script through `sh` on the remote and return its stdout; its stderr is shown.
    fn sh(&self, script: &str, stdin: Option<Stdio>) -> Res<String> {
        let remote = self.remote.as_ref().expect("a remote tree");
        remote_sh(&remote.host, script, stdin)
    }
}

/// sh: `changes <worktree>` lists what changed in a remote worktree outside the files
/// copied in (named in `<worktree>.overlay`), as `changes()` does here.
const CHANGES_SH: &str = r#"changes() {
  git -C "$1" status --porcelain --untracked-files=all | cut -c4- | { if [ -s "$1.overlay" ]; then grep -v -F -f "$1.overlay"; else cat; fi; } || true
}
"#;

/// `s` quoted for sh.
fn q(s: &str) -> Res<String> {
    shlex::try_quote(s)
        .map(|c| c.into_owned())
        .map_err(|e| format!("{s:?}: {e}"))
}

/// A path from `.yajna/hosts.toml` quoted for sh, `~/` left for the remote to expand.
fn q_home(path: &str) -> Res<String> {
    match path.strip_prefix("~/") {
        Some(rest) => Ok(format!("~/{}", q(rest)?)),
        None => q(path),
    }
}

fn remote_sh(host: &str, script: &str, stdin: Option<Stdio>) -> Res<String> {
    let out = Command::new("ssh")
        .args(["-T", host, script])
        .stdin(stdin.unwrap_or(Stdio::null()))
        .stderr(Stdio::inherit())
        .output()
        .map_err(|e| format!("ssh {host}: {e}"))?;
    if !out.status.success() {
        return Err(format!(
            "on {host}: the command failed (exit {}); see above",
            out.status.code().unwrap_or(-1)
        ));
    }
    Ok(String::from_utf8_lossy(&out.stdout).into_owned())
}

/// sh: when the host has no checkout at its root, clone this repository's `origin` there,
/// to the root less the notebook's path inside the repository.
fn clone_sh(top: &Path, prefix: &str, r: &Remote) -> Res<String> {
    let Ok(url) = git(top, &["remote", "get-url", "origin"]) else {
        // nothing to clone from: the cd that follows says the checkout is missing
        return Ok(String::new());
    };
    let inner = prefix.trim_end_matches('/');
    let repo = if inner.is_empty() {
        r.root.trim_end_matches('/').to_string()
    } else {
        match r
            .root
            .trim_end_matches('/')
            .strip_suffix(&format!("/{inner}"))
        {
            Some(repo) => repo.to_string(),
            None => return Ok(String::new()),
        }
    };
    Ok(format!(
        "if [ ! -e {root} ]; then\n  echo {say} >&2\n  mkdir -p \"$(dirname {repo})\"\n  git clone -q {url} {repo}\nfi\n",
        root = q_home(&r.root)?,
        repo = q_home(&repo)?,
        url = q(&url)?,
        say = q(&format!(
            "yajna: no checkout at {} on {}; cloning {url} there",
            r.root, r.host
        ))?,
    ))
}

/// The machine `--on` names; alone, the run's `host`.
fn host_of(page: &Page, on: &str) -> Res<String> {
    if !on.is_empty() {
        return Ok(on.to_string());
    }
    page.field("host").map(str::to_string).ok_or_else(|| {
        format!(
            "{} records no host; name one: --on <host>",
            page.id().unwrap_or("")
        )
    })
}

/// A machine and its checkout of this notebook, from `.yajna/hosts.toml`.
fn remote_of(vault: &Vault, host: &str) -> Res<Remote> {
    let host = host.to_string();
    let file = vault.root.join(".yajna").join("hosts.toml");
    let hosts: toml::Table = fs::read_to_string(&file)
        .ok()
        .and_then(|t| t.parse().ok())
        .unwrap_or_default();
    let root = hosts
        .get(&host)
        .and_then(|h| h.get("root"))
        .and_then(|r| r.as_str())
        .ok_or_else(|| {
            format!(
                "{host} has no checkout in {}: add [{host}] root = \"<path to this notebook there>\"",
                rel(&file, &vault.root)
            )
        })?
        .to_string();
    let mut h = DefaultHasher::new();
    (&host, &root).hash(&mut h);
    let trees = format!("\"$HOME\"/.cache/yajna/runs/{:016x}", h.finish());
    Ok(Remote { host, root, trees })
}

/// Section 3: a worktree at the run's commit, with the run's page and directory copied in
/// from HEAD (or the working tree) at their current paths, and section 5's flake and env;
/// here, or on `remote`.
fn open_tree(vault: &Vault, page: &Page, working_tree: bool, remote: Option<Remote>) -> Res<Tree> {
    let id = page.id().unwrap_or("").to_string();
    let commit = commit_of(vault, page)?;
    let (top, prefix) = repo_of(vault)?;
    let top = top.canonicalize().map_err(|e| e.to_string())?;
    let page_rel = page
        .path
        .canonicalize()
        .map_err(|e| e.to_string())?
        .strip_prefix(&top)
        .map_err(|_| format!("{id}: the page is outside the repository"))?
        .to_string_lossy()
        .replace('\\', "/");
    let dir_rel = format!("{}/", page_rel.trim_end_matches(".md"));
    let mut banner = Vec::new();

    // what lines up and what does not, from this repository's history
    let project_rel = Path::new(&page_rel)
        .parent()
        .and_then(Path::parent)
        .map(|p| p.to_string_lossy().replace('\\', "/"))
        .unwrap_or_default();
    if !project_rel.is_empty() && !exists_at(&top, &commit, &project_rel) {
        banner.push(format!(
            "{project_rel}/ is not at {} (renamed or added since); the run's directory is copied in at its current path",
            &commit[..7]
        ));
    }
    if let Some(s) = page.field("script") {
        if !exists_at(&top, &commit, &format!("{prefix}{s}")) {
            banner.push(format!("the script {s} did not exist at {}", &commit[..7]));
        }
    }

    // the files copied in: path from the top level, bytes, executable
    let mut overlay: Vec<(String, Vec<u8>, bool)> = Vec::new();
    if working_tree {
        let mut files = vec![page.path.clone()];
        files_under(&top.join(&dir_rel), &mut files);
        for f in files {
            let r = f
                .strip_prefix(&top)
                .unwrap_or(&f)
                .to_string_lossy()
                .replace('\\', "/");
            let bytes = fs::read(&f).map_err(|e| e.to_string())?;
            overlay.push((r, bytes, is_executable(&f)));
        }
    } else {
        let listing = git(
            &top,
            &[
                "ls-tree",
                "-r",
                "HEAD",
                "--",
                &page_rel,
                dir_rel.trim_end_matches('/'),
            ],
        )?;
        for line in listing.lines() {
            let Some((meta, path)) = line.split_once('\t') else {
                continue;
            };
            let bytes = blob(&top, &format!("HEAD:{path}"))?;
            overlay.push((path.to_string(), bytes, meta.starts_with("100755")));
        }
        if overlay.is_empty() {
            banner.push(format!(
                "{id} is not committed, so nothing was copied in; --working-tree copies it from the working tree"
            ));
        }
    }

    // the flake at the commit: the project's code directory, else the notebook's root, else
    // the repository's
    let mut candidates = Vec::new();
    if !vault.is_project() {
        if let Some(code) = page
            .field("project")
            .and_then(|p| vault.find(p).ok())
            .and_then(|p| p.field("code").map(str::to_string))
            .filter(|c| !c.contains(':'))
        {
            let code = code.trim_end_matches('/').to_string();
            candidates.push(format!("{prefix}{code}"));
            // the name before ADR-0020 renamed projects/ to code/
            if let Some(rest) = code.strip_prefix("code/") {
                candidates.push(format!("{prefix}projects/{rest}"));
            }
        }
    }
    candidates.push(prefix.trim_end_matches('/').to_string());
    candidates.push(String::new());
    let flake = candidates
        .into_iter()
        .find(|d| {
            let f = if d.is_empty() {
                "flake.nix".to_string()
            } else {
                format!("{d}/flake.nix")
            };
            exists_at(&top, &commit, &f)
        })
        .map(|d| if d.is_empty() { ".".to_string() } else { d });

    let env = env_of_page(page);
    let overlay_paths = [page_rel.clone(), dir_rel.clone()];
    let wt = match &remote {
        None => {
            let wt = trees_dir(vault).join(&id);
            if wt.join(".git").exists() {
                let at = git(&wt, &["rev-parse", "HEAD"]).unwrap_or_default();
                let changed = changes(&wt, &overlay_paths);
                if at != commit {
                    if !changed.is_empty() {
                        return Err(format!(
                            "{}: the worktree is at {} with changes ({}), and {id} now names {}; \
                             commit or drop them, or yajna run clean {id} --force",
                            wt.display(),
                            &at[..at.len().min(7)],
                            changed.join(", "),
                            &commit[..7]
                        ));
                    }
                    git(
                        &top,
                        &["worktree", "remove", "--force", &wt.to_string_lossy()],
                    )?;
                } else if !changed.is_empty() {
                    banner.push(format!("the worktree has changes: {}", changed.join(", ")));
                }
            }
            if !wt.join(".git").exists() {
                fs::create_dir_all(wt.parent().unwrap()).map_err(|e| e.to_string())?;
                let _ = git(&top, &["worktree", "prune"]);
                git(
                    &top,
                    &[
                        "worktree",
                        "add",
                        "-q",
                        "--detach",
                        &wt.to_string_lossy(),
                        &commit,
                    ],
                )?;
            }
            for (path, bytes, exec) in &overlay {
                write_file(&wt.join(path), bytes, *exec)?;
            }
            fs::write(
                trees_dir(vault).join(format!("{id}.overlay")),
                overlay_paths.join("\n"),
            )
            .map_err(|e| e.to_string())?;
            for (k, v) in &env {
                if (v.starts_with('/') || v.starts_with("~/")) && !Path::new(v).exists() {
                    banner.push(format!("env {k}={v}: no such path here"));
                }
            }
            if let (Some(then), Some(now)) = (page.field("host"), host()) {
                if then != now {
                    banner.push(format!("{id} ran on {then}; this is {now}"));
                }
            }
            wt
        }
        Some(r) => {
            // the overlay goes over as a tar stream, staged here
            let stage = trees_dir(vault).join(format!(".stage-{id}"));
            let _ = fs::remove_dir_all(&stage);
            fs::create_dir_all(&stage).map_err(|e| e.to_string())?;
            for (path, bytes, exec) in &overlay {
                write_file(&stage.join(path), bytes, *exec)?;
            }
            let mut checks = String::new();
            for (k, v) in &env {
                if v.starts_with('/') || v.starts_with("~/") {
                    checks.push_str(&format!(
                        "[ -e {p} ] || echo {msg} >&2\n",
                        p = q_home(v)?,
                        msg = q(&format!("yajna: env {k}={v}: no such path on {}", r.host))?
                    ));
                }
            }
            let script = format!(
                r#"set -e
{clone}cd {root}
git fetch -q || echo 'yajna: git fetch failed; using what is there' >&2
if ! git cat-file -e {commit}^{{commit}} 2>/dev/null; then
  echo {not_there} >&2; exit 3
fi
wt={trees}/{id}
{changes}if [ -e "$wt/.git" ] && [ "$(git -C "$wt" rev-parse HEAD)" != {commit} ]; then
  if [ -n "$(changes "$wt")" ]; then
    echo "yajna: $wt has changes at another commit; yajna run clean {id} --on {host} --force" >&2; exit 3
  fi
  git worktree remove --force "$wt"
fi
if [ ! -e "$wt/.git" ]; then
  mkdir -p "$(dirname "$wt")"; git worktree prune; git worktree add -q --detach "$wt" {commit}
fi
tar -xf - -C "$wt"
printf '%s\n' {page_q} {dir_q} > "$wt.overlay"
mkdir -p "$wt"/{dir_q}
{checks}cd "$wt" && pwd
"#,
                clone = clone_sh(&top, &prefix, r)?,
                root = q_home(&r.root)?,
                trees = r.trees,
                host = q(&r.host)?,
                changes = CHANGES_SH,
                not_there = q(&format!(
                    "yajna: {} is not in the checkout on {}; push it first",
                    &commit[..7],
                    r.host
                ))?,
                page_q = q(&page_rel)?,
                dir_q = q(&dir_rel)?,
            );
            let tar = Command::new("tar")
                .args(["-cf", "-", "-C"])
                .arg(&stage)
                .arg(".")
                .stdout(Stdio::piped())
                .spawn()
                .map_err(|e| format!("tar: {e}"))?;
            let out = remote_sh(&r.host, &script, Some(Stdio::from(tar.stdout.unwrap())));
            let _ = fs::remove_dir_all(&stage);
            let wt = out?
                .lines()
                .last()
                .map(str::trim)
                .filter(|l| l.starts_with('/'))
                .map(PathBuf::from)
                .ok_or_else(|| format!("on {}: no worktree path came back", r.host))?;
            banner.push(format!("on {}, in the checkout at {}", r.host, r.root));
            wt
        }
    };
    if remote.is_none() {
        fs::create_dir_all(wt.join(dir_rel.trim_end_matches('/'))).map_err(|e| e.to_string())?;
    }

    let subject = git(&top, &["log", "-1", "--format=%h %cs %s", &commit]).unwrap_or_default();
    banner.insert(0, format!("{id} at {subject}"));
    banner.insert(
        1,
        format!(
            "{} with {} copied in from {}",
            wt.display(),
            dir_rel.trim_end_matches('/'),
            if working_tree {
                "the working tree"
            } else {
                "HEAD"
            }
        ),
    );
    match &flake {
        Some(f) => banner.push(format!("dev shell: nix develop {}", wt.join(f).display())),
        None => banner.push(format!(
            "no flake.nix at {}: a plain shell, not the project's environment",
            &commit[..7]
        )),
    }
    Ok(Tree {
        remote,
        wt,
        prefix,
        dir_rel,
        commit,
        flake,
        env,
        banner,
    })
}

fn is_executable(path: &Path) -> bool {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::metadata(path).is_ok_and(|m| m.permissions().mode() & 0o111 != 0)
    }
    #[cfg(not(unix))]
    {
        let _ = path;
        false
    }
}

pub(crate) fn shell(
    vault: &Vault,
    id: &str,
    command: Option<&str>,
    working_tree: bool,
    on: Option<&str>,
) -> Res<i32> {
    let page = run_page(vault, id)?;
    let remote = on
        .map(|h| remote_of(vault, &host_of(&page, h)?))
        .transpose()?;
    let tree = open_tree(vault, &page, working_tree, remote)?;
    for line in &tree.banner {
        eprintln!("yajna: {line}");
    }
    let argv: Vec<String> = match command {
        Some(c) => vec!["sh".into(), "-c".into(), c.into()],
        // the user's shell here; the login shell there
        None if tree.remote.is_some() => {
            vec!["sh".into(), "-c".into(), "exec \"${SHELL:-sh}\"".into()]
        }
        None => vec![std::env::var("SHELL").unwrap_or_else(|_| "sh".to_string())],
    };
    let mut env = tree.env.clone();
    env.extend([
        ("YAJNA_RUN".to_string(), page.id().unwrap_or(id).to_string()),
        (
            "YAJNA_RUN_DIR".to_string(),
            tree.run_dir().to_string_lossy().into_owned(),
        ),
        ("YAJNA_RUN_COMMIT".to_string(), tree.commit.clone()),
    ]);
    let status = tree
        .command(&argv, &env, command.is_none())?
        .status()
        .map_err(|e| format!("{}: {e}", argv[0]))?;
    Ok(status.code().unwrap_or(1))
}

pub(crate) fn clean(vault: &Vault, id: Option<&str>, force: bool, on: Option<&str>) -> Res<i32> {
    if let Some(on) = on {
        if on.is_empty() {
            return Err("run clean --on needs the host's name".to_string());
        }
        let r = remote_of(vault, on)?;
        let pattern = match id {
            Some(i) => q(&vault.canonical_id(i))?,
            None => "RUN-*".to_string(),
        };
        let script = format!(
            r#"[ -e {root} ] || {{ echo {none}; exit 0; }}
cd {root} || exit 3
{changes}kept=0
for wt in {trees}/{pattern}; do
  [ -e "$wt/.git" ] || continue
  if [ -z {force} ] && [ -n "$(changes "$wt")" ]; then
    echo "yajna: kept $wt, with changes; --force removes it" >&2; kept=1; continue
  fi
  git worktree remove --force "$wt" && rm -f "$wt.overlay" && echo "removed $wt on {host}"
done
exit $kept
"#,
            root = q_home(&r.root)?,
            none = q(&format!(
                "no checkout at {} on {}, so no worktrees",
                r.root, r.host
            ))?,
            trees = r.trees,
            force = if force { "yes" } else { "''" },
            changes = CHANGES_SH,
            host = r.host,
        );
        print!("{}", remote_sh(&r.host, &script, None)?);
        return Ok(0);
    }
    let dir = trees_dir(vault);
    let ids: Vec<String> = match id {
        Some(i) => vec![vault.canonical_id(i)],
        None => fs::read_dir(&dir)
            .map(|rd| {
                rd.flatten()
                    .filter(|e| e.path().join(".git").exists())
                    .map(|e| e.file_name().to_string_lossy().to_string())
                    .collect()
            })
            .unwrap_or_default(),
    };
    let (top, _) = repo_of(vault)?;
    let mut kept = Vec::new();
    for id in &ids {
        let wt = dir.join(id);
        if !wt.join(".git").exists() {
            return Err(format!("{id} has no worktree"));
        }
        let sidecar = dir.join(format!("{id}.overlay"));
        let overlay: Vec<String> = fs::read_to_string(&sidecar)
            .unwrap_or_default()
            .lines()
            .map(str::to_string)
            .collect();
        let changed = changes(&wt, &overlay);
        if !changed.is_empty() && !force {
            kept.push(format!("{id} ({})", changed.join(", ")));
            continue;
        }
        git(
            &top,
            &["worktree", "remove", "--force", &wt.to_string_lossy()],
        )?;
        let _ = fs::remove_file(sidecar);
        println!("removed {}", wt.display());
    }
    if kept.is_empty() {
        Ok(0)
    } else {
        Err(format!(
            "kept, with changes outside the run's directory: {}; --force removes them",
            kept.join("; ")
        ))
    }
}

/// The repository's top level and the notebook's path inside it (`""` or `sub/dir/`).
fn repo_of(vault: &Vault) -> Res<(PathBuf, String)> {
    let top = git(&vault.root, &["rev-parse", "--show-toplevel"])
        .map_err(|_| "not a git checkout: a run is opened at a commit".to_string())?;
    let prefix = git(&vault.root, &["rev-parse", "--show-prefix"])?;
    Ok((PathBuf::from(top), prefix))
}

/// `<cache>/runs/<repo hash>/`, where this notebook's run worktrees live.
fn trees_dir(vault: &Vault) -> PathBuf {
    let mut h = DefaultHasher::new();
    vault.root.hash(&mut h);
    crate::index::cache_dir()
        .join("runs")
        .join(format!("{:016x}", h.finish()))
}

fn run_page(vault: &Vault, id: &str) -> Res<Page> {
    let page = vault.find(&vault.canonical_id(id))?;
    if page.field("type") != Some("run") {
        return Err(format!("{} is not a run", page.id().unwrap_or(id)));
    }
    Ok(page)
}

/// The run's commit in full; `unknown` or none cannot be opened.
fn commit_of(vault: &Vault, page: &Page) -> Res<String> {
    let id = page.id().unwrap_or("");
    match page.field("commit") {
        None => Err(format!(
            "{id} records no commit, so there is nothing to open"
        )),
        Some("unknown") => Err(format!(
            "{id} has commit: unknown, so there is nothing to open (see its Notes)"
        )),
        Some(c) => rev(&vault.root, c).map_err(|e| format!("{id}: commit {e}")),
    }
}

pub(crate) fn env_of_page(page: &Page) -> Vec<(String, String)> {
    let Some(Value::Object(env)) = page.meta.as_ref().and_then(|m| m.get("env")) else {
        return Vec::new();
    };
    env.iter()
        .map(|(k, v)| {
            let v = match v {
                Value::String(s) => s.clone(),
                other => other.to_string(),
            };
            (k.clone(), v)
        })
        .collect()
}

pub(crate) fn outputs_of_page(page: &Page) -> Vec<(String, String)> {
    let Some(Value::Array(list)) = page.meta.as_ref().and_then(|m| m.get("outputs")) else {
        return Vec::new();
    };
    list.iter()
        .filter_map(|o| {
            Some((
                o.get("path")?.as_str()?.to_string(),
                o.get("sha256")?.as_str()?.to_string(),
            ))
        })
        .collect()
}

/// Paths with changes in a worktree, outside the files `overlay` names (relative to its
/// top level, a directory ending in `/`).
fn changes(tree: &Path, overlay: &[String]) -> Vec<String> {
    git(tree, &["status", "--porcelain", "--untracked-files=all"])
        .unwrap_or_default()
        .lines()
        .filter_map(|l| l.get(3..))
        .filter(|p| !overlay.iter().any(|o| p == o || p.starts_with(o.as_str())))
        .map(str::to_string)
        .collect()
}

/// Bytes of a file at a revision.
fn blob(top: &Path, rev_path: &str) -> Res<Vec<u8>> {
    let out = Command::new("git")
        .arg("-C")
        .arg(top)
        .args(["cat-file", "blob", rev_path])
        .output()
        .map_err(|e| e.to_string())?;
    if !out.status.success() {
        return Err(format!("git cat-file {rev_path} failed"));
    }
    Ok(out.stdout)
}

fn exists_at(top: &Path, commit: &str, path: &str) -> bool {
    git(
        top,
        &[
            "cat-file",
            "-e",
            &format!("{commit}:{}", path.trim_end_matches('/')),
        ],
    )
    .is_ok()
}

fn write_file(path: &Path, bytes: &[u8], executable: bool) -> Res<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(path, bytes).map_err(|e| format!("{}: {e}", path.display()))?;
    #[cfg(unix)]
    if executable {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(path, fs::Permissions::from_mode(0o755));
    }
    #[cfg(not(unix))]
    let _ = executable;
    Ok(())
}

fn files_under(dir: &Path, out: &mut Vec<PathBuf>) {
    let Ok(rd) = fs::read_dir(dir) else { return };
    for e in rd.flatten() {
        let p = e.path();
        if p.is_dir() {
            files_under(&p, out);
        } else {
            out.push(p);
        }
    }
}

// --- run diff ----------------------------------------------------------------------------

/// The row of `results.tsv` for a run, without `run` and `finished`.
fn metrics(vault: &Vault, page: &Page) -> Vec<(String, String)> {
    let id = page.id().unwrap_or("");
    let Some(tsv) = results_tsv(vault, page) else {
        return Vec::new();
    };
    let Ok(mut reader) = csv::ReaderBuilder::new()
        .delimiter(b'\t')
        .flexible(true)
        .from_path(&tsv)
    else {
        return Vec::new();
    };
    let Ok(headers) = reader.headers().cloned() else {
        return Vec::new();
    };
    for rec in reader.records().flatten() {
        if rec.get(0) == Some(id) {
            return headers
                .iter()
                .zip(rec.iter())
                .filter(|(h, v)| !["run", "finished"].contains(h) && !v.is_empty())
                .map(|(h, v)| (h.to_string(), v.to_string()))
                .collect();
        }
    }
    Vec::new()
}

fn results_tsv(vault: &Vault, page: &Page) -> Option<PathBuf> {
    let exp = vault.find(page.field("experiment")?).ok()?;
    Some(exp.path.parent()?.join(exp.id()?).join("results.tsv"))
}

/// The project's code, as pathspecs relative to the repository's top level.
fn code_paths(vault: &Vault, page: &Page, prefix: &str) -> Vec<String> {
    if vault.is_project() {
        let notes = rel(&vault.notes, &vault.root).replace('\\', "/");
        return vec![
            if prefix.is_empty() {
                ".".into()
            } else {
                prefix.to_string()
            },
            format!(":(exclude){prefix}{notes}"),
        ];
    }
    match page
        .field("project")
        .and_then(|p| vault.find(p).ok())
        .and_then(|p| p.field("code").map(str::to_string))
        .filter(|c| !c.contains(':'))
    {
        Some(code) => vec![format!("{prefix}{}", code.trim_end_matches('/'))],
        None => vec![if prefix.is_empty() {
            ".".into()
        } else {
            prefix.to_string()
        }],
    }
}

pub(crate) fn diff(vault: &Vault, a: &str, b: &str) -> Res<i32> {
    let (pa, pb) = (run_page(vault, a)?, run_page(vault, b)?);
    let (ia, ib) = (pa.id().unwrap_or(a), pb.id().unwrap_or(b));
    let (top, prefix) = repo_of(vault)?;
    let mut rows: Vec<(String, String, String)> = Vec::new();
    let full = |p: &Page| p.field("commit").and_then(|c| rev(&vault.root, c).ok());
    let (ca, cb) = (full(&pa), full(&pb));
    let shown = |p: &Page, c: &Option<String>| match c {
        Some(c) => git(&top, &["log", "-1", "--format=%h %cs", c]).unwrap_or_default(),
        None => p.field("commit").unwrap_or("-").to_string(),
    };
    rows.push(("commit".into(), shown(&pa, &ca), shown(&pb, &cb)));
    for key in ["host", "script", "status", "verdict"] {
        let (x, y) = (pa.field(key), pb.field(key));
        // a long path the two share says nothing
        if key == "script" && x == y {
            continue;
        }
        if x.is_some() || y.is_some() {
            rows.push((key.into(), x.unwrap_or("-").into(), y.unwrap_or("-").into()));
        }
    }
    let side =
        |list: Vec<(String, String)>| -> BTreeMap<String, String> { list.into_iter().collect() };
    let (ea, eb) = (side(env_of_page(&pa)), side(env_of_page(&pb)));
    for k in ea.keys().chain(eb.keys()).collect::<BTreeSet<_>>() {
        rows.push((
            format!("env {k}"),
            ea.get(k).cloned().unwrap_or("-".into()),
            eb.get(k).cloned().unwrap_or("-".into()),
        ));
    }
    // an output in a run's own directory is compared with the same file in the other's
    let norm = |id: &str, list: Vec<(String, String)>| -> BTreeMap<String, String> {
        list.into_iter()
            .map(|(p, s)| (p.replace(id, "RUN-…"), s))
            .collect()
    };
    let (oa, ob) = (
        norm(ia, outputs_of_page(&pa)),
        norm(ib, outputs_of_page(&pb)),
    );
    for k in oa.keys().chain(ob.keys()).collect::<BTreeSet<_>>() {
        let short = |s: Option<&String>| {
            s.map(|s| s[..12.min(s.len())].to_string())
                .unwrap_or("-".into())
        };
        rows.push((format!("output {k}"), short(oa.get(k)), short(ob.get(k))));
    }
    let (ma, mb) = (side(metrics(vault, &pa)), side(metrics(vault, &pb)));
    for k in ma.keys().chain(mb.keys()).collect::<BTreeSet<_>>() {
        rows.push((
            format!("metric {k}"),
            ma.get(k).cloned().unwrap_or("-".into()),
            mb.get(k).cloned().unwrap_or("-".into()),
        ));
    }
    let w0 = rows.iter().map(|r| r.0.len()).max().unwrap_or(0).max(6);
    let w1 = rows
        .iter()
        .map(|r| r.1.len())
        .max()
        .unwrap_or(0)
        .max(ia.len());
    println!("{:w0$}  {ia:w1$}  {ib}", "");
    for (k, x, y) in &rows {
        let mark = if x == y { " " } else { "*" };
        println!("{}", format!("{k:w0$}  {x:w1$}  {y} {mark}").trim_end());
    }

    if let (Some(ca), Some(cb)) = (&ca, &cb) {
        if ca != cb {
            let paths = code_paths(vault, &pa, &prefix);
            let mut args = vec!["diff", "--stat", ca.as_str(), cb.as_str(), "--"];
            args.extend(paths.iter().map(String::as_str));
            let stat = git(&top, &args).unwrap_or_default();
            println!(
                "\ncode, {}..{} ({}):\n{}",
                &ca[..7],
                &cb[..7],
                paths.join(" "),
                if stat.is_empty() {
                    "  no change".to_string()
                } else {
                    stat
                }
            );
        }
    }
    let file = |p: &Page| p.field("script").map(|s| vault.root.join(s));
    if let (Some(sa), Some(sb)) = (file(&pa), file(&pb)) {
        if sa != sb {
            print_no_index(&vault.root, "scripts", &sa, &sb);
        }
    }
    print_no_index(&vault.root, "pages", &pa.path, &pb.path);
    Ok(0)
}

fn print_no_index(root: &Path, what: &str, a: &Path, b: &Path) {
    let out = Command::new("git")
        .current_dir(root)
        .args(["diff", "--no-index", "--no-color", "--"])
        .arg(a.strip_prefix(root).unwrap_or(a))
        .arg(b.strip_prefix(root).unwrap_or(b))
        .output();
    if let Ok(out) = out {
        let text = String::from_utf8_lossy(&out.stdout);
        if !text.trim().is_empty() {
            println!("\n{what}:\n{}", text.trim_end());
        }
    }
}

// --- run reproduce -----------------------------------------------------------------------

fn sha_of(path: &Path) -> Option<String> {
    fs::read(path)
        .ok()
        .map(|b| format!("{:x}", Sha256::digest(&b)))
}

/// Run `cmd`, writing its stdout and stderr to files and echoing both to stderr; the
/// stdout as text, and whether it exited zero.
fn capture(mut cmd: Command, out: &Path, err: &Path) -> Res<(String, bool)> {
    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;
    let tee = |mut from: Box<dyn Read + Send>, to: PathBuf| {
        std::thread::spawn(move || {
            let mut all = Vec::new();
            let mut buf = [0u8; 8192];
            let mut file = fs::File::create(&to).ok();
            while let Ok(n) = from.read(&mut buf) {
                if n == 0 {
                    break;
                }
                all.extend_from_slice(&buf[..n]);
                if let Some(f) = file.as_mut() {
                    let _ = f.write_all(&buf[..n]);
                }
                let _ = std::io::stderr().write_all(&buf[..n]);
            }
            all
        })
    };
    let so = tee(Box::new(child.stdout.take().unwrap()), out.to_path_buf());
    let se = tee(Box::new(child.stderr.take().unwrap()), err.to_path_buf());
    let status = child.wait().map_err(|e| e.to_string())?;
    let stdout = so.join().unwrap_or_default();
    let _ = se.join();
    Ok((
        String::from_utf8_lossy(&stdout).into_owned(),
        status.success(),
    ))
}

fn agrees(original: &str, now: &str, tolerance: f64) -> bool {
    match (original.parse::<f64>(), now.parse::<f64>()) {
        (Ok(a), Ok(b)) => a == b || (a - b).abs() <= tolerance * a.abs().max(b.abs()),
        _ => original == now,
    }
}

fn cell(v: &Value) -> String {
    match v {
        Value::String(s) => s.clone(),
        Value::Bool(true) => "True".into(),
        Value::Bool(false) => "False".into(),
        Value::Null => String::new(),
        other => crate::commands::py_json(other),
    }
}

pub(crate) fn reproduce(
    vault: &Vault,
    id: &str,
    tolerance: Option<f64>,
    out_roots: &[String],
    on: Option<&str>,
) -> Res<i32> {
    let page = run_page(vault, id)?;
    let id = page.id().unwrap_or(id).to_string();
    if page.field("kind") != Some("compute") {
        return Err(format!(
            "{id} is not a compute run; a bench run's script is its protocol"
        ));
    }
    let script = page
        .field("script")
        .ok_or_else(|| format!("{id} has no script to run"))?
        .to_string();
    let experiment = page
        .field("experiment")
        .ok_or_else(|| format!("{id} belongs to no experiment"))?
        .to_string();
    let remote = on
        .map(|h| remote_of(vault, &host_of(&page, h)?))
        .transpose()?;
    // the scratch roots, on the machine that runs: made and resolved here, made there
    let mut roots: BTreeMap<String, String> = BTreeMap::new();
    for r in out_roots {
        let (var, dir) = r
            .split_once('=')
            .ok_or_else(|| format!("--out-root {r}: expected VAR=DIR"))?;
        let dir = if remote.is_some() {
            if !dir.starts_with('/') {
                return Err(format!("--out-root {r}: an absolute path on the remote"));
            }
            dir.to_string()
        } else {
            fs::create_dir_all(dir).map_err(|e| format!("--out-root {r}: {e}"))?;
            Path::new(dir)
                .canonicalize()
                .map_err(|e| e.to_string())?
                .to_string_lossy()
                .into_owned()
        };
        roots.insert(var.to_string(), dir);
    }
    let outputs = outputs_of_page(&page);
    // a verdict needs something to compare, and the recorded outputs are the only way to
    // know where the script writes
    if outputs.is_empty() && metrics(vault, &page).is_empty() {
        return Err(format!(
            "{id} records no outputs and has no row in results.tsv: a reproduction would have \
             nothing to compare, and nothing says where its script writes, so it could write \
             over the original's results outside the repo. Record what the result rests on \
             first: yajna run record {id} --outputs <file>… [--env <VAR>…]"
        ));
    }
    // never over what the original wrote outside the repo
    let outside: Vec<&str> = outputs
        .iter()
        .filter_map(|(p, _)| {
            let var = p.strip_prefix('$')?.split('/').next()?;
            (!roots.contains_key(var)).then_some(var)
        })
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect();
    if !outside.is_empty() {
        return Err(format!(
            "{id} recorded outputs under {}, outside the repo, which a reproduction would \
             write over; redirect each with --out-root VAR=<scratch dir>",
            outside
                .iter()
                .map(|v| format!("${v}"))
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }

    let tree = open_tree(vault, &page, false, remote)?;
    for line in &tree.banner {
        eprintln!("yajna: {line}");
    }
    let script_in_tree = tree.root().join(&script);
    if tree.remote.is_none() && !script_in_tree.is_file() {
        return Err(format!(
            "{script}: not in the worktree, so there is nothing to run"
        ));
    }
    let orig_dir = rel(&page.path, &vault.root)
        .trim_end_matches(".md")
        .replace('\\', "/");
    // the original's results copied in with its directory are not this run's
    let stale: Vec<PathBuf> = outputs
        .iter()
        .filter_map(|(p, _)| p.strip_prefix(&format!("{orig_dir}/")))
        .map(|rest| tree.run_dir().join(rest))
        .collect();

    // the new run, written here
    let path = crate::commands::create(
        vault,
        "run",
        None,
        None,
        Some(&experiment),
        Some("compute"),
        false,
        None,
        None,
        None,
    )?;
    let new_id = path
        .file_stem()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    let new_dir = path.with_extension("");
    fs::create_dir_all(&new_dir).map_err(|e| e.to_string())?;
    let new_rel = rel(&new_dir, &vault.root).replace('\\', "/");
    // where the script writes: beside the new page here, at the same path in a remote tree
    let out_dir = match &tree.remote {
        None => new_dir.clone(),
        Some(_) => tree.root().join(&new_rel),
    };
    let mut env = tree.env.clone();
    for (k, v) in env.iter_mut() {
        if let Some(r) = roots.get(k) {
            *v = r.clone();
        }
    }
    for (k, r) in &roots {
        if !env.iter().any(|(e, _)| e == k) {
            env.push((k.clone(), r.clone()));
        }
    }
    let started = iso_minutes(&vault.now());
    let runs_on = match &tree.remote {
        Some(r) => Some(r.host.clone()),
        None => host(),
    };
    let text = crate::vault::read_text(&path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |fm| {
        set_field(fm, "status", "in_progress");
        set_field(fm, "started", &started);
        set_field(fm, "commit", &tree.commit);
        set_field(fm, "script", &script);
        set_field(fm, "reproduces", &id);
        put_fields(fm, runs_on.as_deref(), &env, &[]);
    });
    fs::write(&path, text).map_err(|e| e.to_string())?;
    match &tree.remote {
        None => {
            for f in &stale {
                let _ = fs::remove_file(f);
            }
        }
        Some(_) => {
            // the new run's directory there is reproduce's, so clean leaves it out of changes
            let mut prep = format!(
                "printf '%s\\n' {} >> {}\nmkdir -p {}",
                q(&format!("{}{new_rel}/", tree.prefix))?,
                q(&format!("{}.overlay", tree.wt.to_string_lossy()))?,
                q(&out_dir.to_string_lossy())?
            );
            for r in roots.values() {
                prep.push_str(&format!(" {}", q(r)?));
            }
            for f in &stale {
                prep.push_str(&format!("\nrm -f {}", q(&f.to_string_lossy())?));
            }
            tree.sh(&prep, None)?;
        }
    }
    eprintln!("yajna: {new_id} reproduces {id}; running {script}");

    let mut run_env = env.clone();
    run_env.extend([
        ("YAJNA_RUN".to_string(), new_id.clone()),
        (
            "YAJNA_RUN_DIR".to_string(),
            out_dir.to_string_lossy().into_owned(),
        ),
        ("YAJNA_RUN_COMMIT".to_string(), tree.commit.clone()),
    ]);
    let cmd = tree.command(
        &[script_in_tree.to_string_lossy().into_owned()],
        &run_env,
        false,
    )?;
    let (stdout, ok) = capture(
        cmd,
        &new_dir.join("stdout.log"),
        &new_dir.join("stderr.log"),
    )?;
    let finished = iso_minutes(&vault.now());

    // the outputs in the repo, gathered beside the new page: what the script wrote in the
    // new run's directory, else beside itself (older scripts), else at the recorded path
    let mut gathered: Vec<(String, String, String)> = Vec::new(); // (recorded, source, into)
    let mut elsewhere: Vec<(String, String)> = Vec::new(); // ($VAR path, where it is now)
    for (p, _) in &outputs {
        if let Some(rest) = p.strip_prefix('$') {
            let (var, rest) = rest.split_once('/').unwrap_or((rest, ""));
            elsewhere.push((p.clone(), format!("{}/{rest}", roots[var])));
        } else if let Some(rest) = p.strip_prefix(&format!("{orig_dir}/")) {
            gathered.push((
                p.clone(),
                tree.run_dir().join(rest).to_string_lossy().into_owned(),
                rest.to_string(),
            ));
        } else {
            let name = Path::new(p)
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned();
            gathered.push((
                p.clone(),
                tree.root().join(p).to_string_lossy().into_owned(),
                name,
            ));
        }
    }
    let mut far: BTreeMap<String, String> = BTreeMap::new(); // path there -> sha256
    match &tree.remote {
        None => {
            for (_, src, into) in &gathered {
                let (src, to) = (Path::new(src), new_dir.join(into));
                if !to.is_file() && src.is_file() {
                    let _ = fs::create_dir_all(to.parent().unwrap());
                    let _ = fs::copy(src, &to);
                }
            }
            for (_, at) in &elsewhere {
                if let Some(s) = sha_of(Path::new(at)) {
                    far.insert(at.clone(), s);
                }
            }
        }
        Some(_) => {
            // copied into the new run's directory there, then streamed back here
            let mut s = format!("cd {} || exit 3\n", q(&out_dir.to_string_lossy())?);
            for (_, src, into) in &gathered {
                let (src, into) = (q(src)?, q(into)?);
                s.push_str(&format!(
                    "[ -f {into} ] || {{ [ -f {src} ] && mkdir -p \"$(dirname {into})\" && cp {src} {into}; }}\n"
                ));
            }
            s.push_str("tar -cf - .\n");
            let remote = tree.remote.as_ref().unwrap();
            let mut ssh = Command::new("ssh")
                .args(["-T", &remote.host, &s])
                .stdout(Stdio::piped())
                .spawn()
                .map_err(|e| format!("ssh: {e}"))?;
            let untar = Command::new("tar")
                .args(["-xf", "-", "-C"])
                .arg(&new_dir)
                .stdin(Stdio::from(ssh.stdout.take().unwrap()))
                .status()
                .map_err(|e| format!("tar: {e}"))?;
            let _ = ssh.wait();
            if !untar.success() {
                return Err(format!(
                    "the outputs did not come back from {}",
                    remote.host
                ));
            }
            if !elsewhere.is_empty() {
                let mut s = String::new();
                for (_, at) in &elsewhere {
                    let at = q(at)?;
                    s.push_str(&format!(
                        "[ -f {at} ] && {{ sha256sum {at} 2>/dev/null || shasum -a 256 {at}; }}\n"
                    ));
                }
                s.push_str("true\n");
                for line in tree.sh(&s, None)?.lines() {
                    if let Some((sha, at)) = line.split_once("  ") {
                        far.insert(at.to_string(), sha.to_string());
                    }
                }
            }
        }
    }

    // compare
    let tol = tolerance.unwrap_or(0.0);
    let mut table: Vec<(String, String, String, bool)> = Vec::new();
    let mut own: Vec<(String, String)> = Vec::new();
    let mut matched: BTreeSet<PathBuf> = BTreeSet::new();
    let recorded: BTreeMap<&str, &str> = outputs
        .iter()
        .map(|(p, s)| (p.as_str(), s.as_str()))
        .collect();
    for (p, _, into) in &gathered {
        let f = new_dir.join(into);
        let now = sha_of(&f);
        matched.insert(f);
        if let Some(s) = &now {
            own.push((format!("{new_rel}/{into}"), s.clone()));
        }
        table.push(row(p, recorded[p.as_str()], now.as_deref()));
    }
    for (p, at) in &elsewhere {
        let now = far.get(at).cloned();
        if let Some(s) = &now {
            own.push((p.clone(), s.clone()));
        }
        table.push(row(p, recorded[p.as_str()], now.as_deref()));
    }
    let result: Option<serde_json::Map<String, Value>> = stdout
        .lines()
        .rfind(|l| l.starts_with(RESULT_MARK))
        .and_then(|l| serde_json::from_str(l[RESULT_MARK.len()..].trim()).ok());
    for (k, v) in &metrics(vault, &page) {
        let now = result.as_ref().and_then(|r| r.get(k)).map(cell);
        let ok = now.as_deref().is_some_and(|n| agrees(v, n, tol));
        table.push((k.clone(), v.clone(), now.unwrap_or("missing".into()), ok));
    }
    let mut unlisted = Vec::new();
    let mut written = Vec::new();
    files_under(&new_dir, &mut written);
    for f in written {
        let name = f.file_name().unwrap_or_default();
        if !matched.contains(&f) && name != "stdout.log" && name != "stderr.log" {
            unlisted.push(rel(&f, &new_dir).replace('\\', "/"));
        }
    }
    let verdict = if !ok {
        "failed"
    } else if table.iter().all(|r| r.3) {
        "reproduced"
    } else {
        "differs"
    };

    // the page, the experiment's list and results.tsv
    let mut body = format!(
        "\n## Reproduction\nReproduces [[{id}]] at {} on {}: **{verdict}**{}.\n\n",
        &tree.commit[..7],
        runs_on.as_deref().unwrap_or("this machine"),
        if tolerance.is_some() {
            format!(", metrics within {tol} relative")
        } else {
            String::new()
        }
    );
    body.push_str(
        "| What | Recorded | This run | Agrees |\n|------|----------|----------|--------|\n",
    );
    for (what, a, b, same) in &table {
        body.push_str(&format!(
            "| {what} | {a} | {b} | {} |\n",
            if *same { "yes" } else { "no" }
        ));
    }
    if !unlisted.is_empty() {
        body.push_str(&format!(
            "\nWritten but not listed in {id}'s outputs: {}.\n",
            unlisted.join(", ")
        ));
    }
    if !ok {
        body.push_str("\nThe script exited non-zero; see `stderr.log` beside this page.\n");
    }
    let text = crate::vault::read_text(&path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |fm| {
        set_field(fm, "status", "done");
        set_field(fm, "finished", &finished);
        set_field(fm, "verdict", verdict);
        put_fields(fm, None, &[], &own);
    });
    let (head, rest) = text.split_at(text.find("\n---\n").map(|i| i + 5).unwrap_or(text.len()));
    fs::write(&path, format!("{head}{body}{rest}")).map_err(|e| e.to_string())?;
    let exp = vault.find(&experiment)?;
    let listing = crate::vault::read_text(&exp.path).map_err(|e| e.to_string())?;
    fs::write(
        &exp.path,
        listing.replace(
            &format!("- [[{new_id}]] compute run, not yet described"),
            &format!("- [[{new_id}]] reproduces [[{id}]]: {verdict}"),
        ),
    )
    .map_err(|e| e.to_string())?;
    if let (Some(r), Some(tsv)) = (&result, results_tsv(vault, &page)) {
        let mut row: Vec<(String, Value)> = vec![
            ("run".into(), Value::String(new_id.clone())),
            ("finished".into(), Value::String(finished)),
        ];
        row.extend(r.iter().map(|(k, v)| (k.clone(), v.clone())));
        crate::commands::append_tsv(&tsv, &row)?;
    }
    println!("{}", rel(&path, &vault.root));
    println!("{new_id}: {verdict}");
    for (what, a, b, same) in &table {
        if !same {
            println!("  {what}: recorded {a}, now {b}");
        }
    }
    if !unlisted.is_empty() {
        println!("  unlisted: {}", unlisted.join(", "));
    }
    Ok(if verdict == "reproduced" { 0 } else { 1 })
}

/// A row of the comparison for an output: its path, the recorded and the new hash.
fn row(path: &str, recorded: &str, now: Option<&str>) -> (String, String, String, bool) {
    (
        format!("`{path}`"),
        recorded[..12.min(recorded.len())].to_string(),
        now.map(|s| s[..12].to_string()).unwrap_or("missing".into()),
        now == Some(recorded),
    )
}
