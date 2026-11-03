//! Running a recorded run again (`docs/reproduce.md` sections 3, 5 to 7 and 9): `yajna run
//! shell` opens the project's dev shell in a worktree at the run's commit with the run's
//! directory copied in from now, `run clean` removes those worktrees, `run diff` says what
//! differs between two runs, `run reproduce` runs the script there into a new run and
//! compares, and `--on <host>` does it on another machine over ssh.

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

/// The worktree of one run, ready to run something in.
struct Tree {
    /// the notebook's root inside the worktree: the cwd of everything run there
    root: PathBuf,
    /// the run's directory inside the worktree
    run_dir: PathBuf,
    commit: String,
    flake: Option<PathBuf>,
    env: Vec<(String, String)>,
    banner: Vec<String>,
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

/// Section 3: a worktree at the run's commit, with the run's page and directory copied in
/// from HEAD (or the working tree) at their current paths, and section 5's flake and env.
fn open_tree(vault: &Vault, page: &Page, working_tree: bool) -> Res<Tree> {
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
    let overlay = vec![page_rel.clone(), dir_rel.clone()];
    let mut banner = Vec::new();

    // the worktree, made or reused
    let wt = trees_dir(vault).join(&id);
    if wt.join(".git").exists() {
        let at = git(&wt, &["rev-parse", "HEAD"]).unwrap_or_default();
        let changed = changes(&wt, &overlay);
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

    // what lines up and what does not
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
    let script = page.field("script").map(str::to_string);
    if let Some(s) = &script {
        if !exists_at(&top, &commit, &format!("{prefix}{s}")) {
            banner.push(format!("the script {s} did not exist at {}", &commit[..7]));
        }
    }

    // the overlay
    if working_tree {
        let mut files = vec![page.path.clone()];
        files_under(&top.join(&dir_rel), &mut files);
        for f in files {
            let r = f.strip_prefix(&top).unwrap_or(&f);
            let bytes = fs::read(&f).map_err(|e| e.to_string())?;
            write_file(&wt.join(r), &bytes, is_executable(&f))?;
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
        let mut copied = 0;
        for line in listing.lines() {
            let Some((meta, path)) = line.split_once('\t') else {
                continue;
            };
            let bytes = blob(&top, &format!("HEAD:{path}"))?;
            write_file(&wt.join(path), &bytes, meta.starts_with("100755"))?;
            copied += 1;
        }
        if copied == 0 {
            banner.push(format!(
                "{id} is not committed, so nothing was copied in; --working-tree copies it from the working tree"
            ));
        }
    }
    fs::write(
        trees_dir(vault).join(format!("{id}.overlay")),
        overlay.join("\n"),
    )
    .map_err(|e| e.to_string())?;

    let root = if prefix.is_empty() {
        wt.clone()
    } else {
        wt.join(prefix.trim_end_matches('/'))
    };
    let run_dir = wt.join(dir_rel.trim_end_matches('/'));
    fs::create_dir_all(&run_dir).map_err(|e| e.to_string())?;
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

    // the flake: the project's code directory, else the notebook's root, else the repo's
    let mut candidates = Vec::new();
    if !vault.is_project() {
        if let Some(code) = page
            .field("project")
            .and_then(|p| vault.find(p).ok())
            .and_then(|p| p.field("code").map(str::to_string))
            .filter(|c| !c.contains(':'))
        {
            let code = code.trim_end_matches('/').to_string();
            candidates.push(root.join(&code));
            // the name before ADR-0020 renamed projects/ to code/
            if let Some(rest) = code.strip_prefix("code/") {
                candidates.push(root.join("projects").join(rest));
            }
        }
    }
    candidates.push(root.clone());
    candidates.push(wt.clone());
    let flake = candidates
        .into_iter()
        .find(|d| d.join("flake.nix").is_file());
    match &flake {
        Some(f) => banner.push(format!("dev shell: nix develop {}", f.display())),
        None => banner.push(format!(
            "no flake.nix at {}: a plain shell, not the project's environment",
            &commit[..7]
        )),
    }

    let env = env_of_page(page);
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
    Ok(Tree {
        root,
        run_dir,
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

/// `argv` run in the tree: inside `nix develop` on its flake when it has one.
fn in_tree(tree: &Tree, argv: &[String]) -> Command {
    let mut cmd = match &tree.flake {
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
    cmd.current_dir(&tree.root)
        .env("YAJNA_RUN_COMMIT", &tree.commit)
        .envs(tree.env.iter().map(|(k, v)| (k.as_str(), v.as_str())));
    cmd
}

fn shell(vault: &Vault, id: &str, command: Option<&str>, working_tree: bool) -> Res<i32> {
    let page = run_page(vault, id)?;
    let tree = open_tree(vault, &page, working_tree)?;
    for line in &tree.banner {
        eprintln!("yajna: {line}");
    }
    let sh = std::env::var("SHELL").unwrap_or_else(|_| "sh".to_string());
    let argv: Vec<String> = match command {
        Some(c) => vec!["sh".into(), "-c".into(), c.into()],
        None => vec![sh],
    };
    let status = in_tree(&tree, &argv)
        .env("YAJNA_RUN", page.id().unwrap_or(id))
        .env("YAJNA_RUN_DIR", &tree.run_dir)
        .status()
        .map_err(|e| format!("{}: {e}", argv[0]))?;
    Ok(status.code().unwrap_or(1))
}

pub(crate) fn clean(vault: &Vault, id: Option<&str>, force: bool) -> Res<i32> {
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

fn reproduce(vault: &Vault, id: &str, tolerance: Option<f64>, out_roots: &[String]) -> Res<i32> {
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
    let mut roots: BTreeMap<String, PathBuf> = BTreeMap::new();
    for r in out_roots {
        let (var, dir) = r
            .split_once('=')
            .ok_or_else(|| format!("--out-root {r}: expected VAR=DIR"))?;
        fs::create_dir_all(dir).map_err(|e| format!("--out-root {r}: {e}"))?;
        roots.insert(
            var.to_string(),
            Path::new(dir).canonicalize().map_err(|e| e.to_string())?,
        );
    }
    let outputs = outputs_of_page(&page);
    // a verdict needs something to compare, and the recorded outputs are the only way to
    // know where the script writes
    if outputs.is_empty() && metrics(vault, &page).is_empty() {
        return Err(format!(
            "{id} records no outputs and has no row in results.tsv: a reproduction would have              nothing to compare, and nothing says where its script writes, so it could write              over the original's results outside the repo. Record what the result rests on              first: yajna run record {id} --outputs <file>… [--env <VAR>…]"
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

    let tree = open_tree(vault, &page, false)?;
    for line in &tree.banner {
        eprintln!("yajna: {line}");
    }
    let script_in_tree = tree.root.join(&script);
    if !script_in_tree.is_file() {
        return Err(format!(
            "{script}: not in the worktree, so there is nothing to run"
        ));
    }
    // the original's results copied in with its directory are not this run's
    let orig_dir = rel(&page.path, &vault.root)
        .trim_end_matches(".md")
        .replace('\\', "/");
    for (p, _) in &outputs {
        if let Some(rest) = p.strip_prefix(&format!("{orig_dir}/")) {
            let _ = fs::remove_file(tree.run_dir.join(rest));
        }
    }

    // the new run
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
    let mut env = tree.env.clone();
    for (k, v) in env.iter_mut() {
        if let Some(r) = roots.get(k) {
            *v = r.to_string_lossy().to_string();
        }
    }
    for (k, r) in &roots {
        if !env.iter().any(|(e, _)| e == k) {
            env.push((k.clone(), r.to_string_lossy().to_string()));
        }
    }
    let started = iso_minutes(&vault.now());
    let this_host = host();
    let text = crate::vault::read_text(&path).map_err(|e| e.to_string())?;
    let text = edit_frontmatter(&text, |fm| {
        set_field(fm, "status", "in_progress");
        set_field(fm, "started", &started);
        set_field(fm, "commit", &tree.commit);
        set_field(fm, "script", &script);
        set_field(fm, "reproduces", &id);
        put_fields(fm, this_host.as_deref(), &env, &[]);
    });
    fs::write(&path, text).map_err(|e| e.to_string())?;
    eprintln!("yajna: {new_id} reproduces {id}; running {script}");

    let mut cmd = in_tree(&tree, &[script_in_tree.to_string_lossy().to_string()]);
    cmd.envs(env.iter().map(|(k, v)| (k.as_str(), v.as_str())))
        .env("YAJNA_RUN", &new_id)
        .env("YAJNA_RUN_DIR", &new_dir);
    let (stdout, ok) = capture(
        cmd,
        &new_dir.join("stdout.log"),
        &new_dir.join("stderr.log"),
    )?;
    let finished = iso_minutes(&vault.now());

    // compare
    let tol = tolerance.unwrap_or(0.0);
    let mut table: Vec<(String, String, String, bool)> = Vec::new();
    let mut own: Vec<(String, String)> = Vec::new();
    let mut matched: BTreeSet<PathBuf> = BTreeSet::new();
    let new_rel = rel(&new_dir, &vault.root).replace('\\', "/");
    for (p, sha) in &outputs {
        let (found, recorded_as) = if let Some(rest) = p.strip_prefix('$') {
            let (var, rest) = rest.split_once('/').unwrap_or((rest, ""));
            (Some(roots[var].join(rest)), p.clone())
        } else if let Some(rest) = p.strip_prefix(&format!("{orig_dir}/")) {
            let here = new_dir.join(rest);
            let beside = tree.run_dir.join(rest);
            let f = if here.is_file() { here } else { beside };
            if f.is_file() && !f.starts_with(&new_dir) {
                let to = new_dir.join(rest);
                let _ = fs::create_dir_all(to.parent().unwrap());
                let _ = fs::copy(&f, &to);
            }
            (Some(new_dir.join(rest)), format!("{new_rel}/{rest}"))
        } else {
            let f = tree.root.join(p);
            let name = Path::new(p).file_name().unwrap_or_default().to_owned();
            if f.is_file() {
                let _ = fs::copy(&f, new_dir.join(&name));
            }
            (
                Some(new_dir.join(&name)),
                format!("{new_rel}/{}", name.to_string_lossy()),
            )
        };
        let now = found.as_ref().and_then(|f| sha_of(f));
        if let Some(f) = &found {
            matched.insert(f.clone());
        }
        if let Some(s) = &now {
            own.push((recorded_as, s.clone()));
        }
        table.push((
            format!("`{p}`"),
            sha[..12].to_string(),
            now.as_deref()
                .map(|s| s[..12].to_string())
                .unwrap_or("missing".into()),
            now.as_deref() == Some(sha.as_str()),
        ));
    }
    let result: Option<serde_json::Map<String, Value>> = stdout
        .lines()
        .rfind(|l| l.starts_with(RESULT_MARK))
        .and_then(|l| serde_json::from_str(l[RESULT_MARK.len()..].trim()).ok());
    let original = metrics(vault, &page);
    for (k, v) in &original {
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
        this_host.as_deref().unwrap_or("this machine"),
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

// --- --on <host> -------------------------------------------------------------------------

/// Run `yajna run <args>` on `host` over `ssh -t`, in its checkout named in
/// `.yajna/hosts.toml`, after a `git fetch` so the commit is there.
fn on_host(vault: &Vault, id: &str, host: &str, args: &[String]) -> Res<i32> {
    let host = if host.is_empty() {
        run_page(vault, id)?
            .field("host")
            .map(str::to_string)
            .ok_or_else(|| format!("{id} records no host; name one: --on <host>"))?
    } else {
        host.to_string()
    };
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
        })?;
    // ~ is the remote's home, so it stays outside the quotes
    let root = match root.strip_prefix("~/") {
        Some(rest) => format!("~/{}", shlex::try_quote(rest).map_err(|e| e.to_string())?),
        None => shlex::try_quote(root)
            .map_err(|e| e.to_string())?
            .into_owned(),
    };
    let words: Vec<String> = args
        .iter()
        .map(|a| {
            shlex::try_quote(a)
                .map(|q| q.into_owned())
                .map_err(|e| e.to_string())
        })
        .collect::<Res<_>>()?;
    let remote = format!(
        "cd {root} && {{ git fetch -q || echo 'yajna: git fetch failed' >&2; yajna run {}; }}",
        words.join(" ")
    );
    eprintln!("yajna: on {host}: {remote}");
    let status = Command::new("ssh")
        .args(["-t", &host, &remote])
        .status()
        .map_err(|e| format!("ssh: {e}"))?;
    Ok(status.code().unwrap_or(1))
}

pub(crate) fn shell_cmd(
    vault: &Vault,
    id: &str,
    command: Option<&str>,
    working_tree: bool,
    on: Option<&str>,
) -> Res<i32> {
    match on {
        Some(h) => {
            let mut args = vec!["shell".to_string(), id.to_string()];
            if let Some(c) = command {
                args.extend(["-c".to_string(), c.to_string()]);
            }
            if working_tree {
                args.push("--working-tree".into());
            }
            on_host(vault, id, h, &args)
        }
        None => shell(vault, id, command, working_tree),
    }
}

pub(crate) fn reproduce_cmd(
    vault: &Vault,
    id: &str,
    tolerance: Option<f64>,
    out_roots: &[String],
    on: Option<&str>,
) -> Res<i32> {
    match on {
        Some(h) => {
            let mut args = vec!["reproduce".to_string(), id.to_string()];
            if let Some(t) = tolerance {
                args.extend(["--tolerance".to_string(), t.to_string()]);
            }
            for r in out_roots {
                args.extend(["--out-root".to_string(), r.clone()]);
            }
            on_host(vault, id, h, &args)
        }
        None => reproduce(vault, id, tolerance, out_roots),
    }
}
