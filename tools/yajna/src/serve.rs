//! `yajna serve` (ADR-0027): the static site, re-rendered when a page changed, served by
//! the `yajna-serve` crate on 127.0.0.1.

use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

use yajna_serve::files::{Root, Watch};

use crate::site::{render, site_dir, vault_mtime, FileLinks};
use crate::vault::{Res, Vault, CONFIG_NAME};

/// `~` at the start and `$VAR` or `${VAR}` anywhere, from the environment. An unset
/// variable stays as written, so the root shows as missing rather than pointing elsewhere.
pub(crate) fn expand(path: &str) -> String {
    let path = match (path.strip_prefix('~'), std::env::var("HOME")) {
        (Some(rest), Ok(home)) if rest.is_empty() || rest.starts_with('/') => {
            format!("{home}{rest}")
        }
        _ => path.to_string(),
    };
    let re = regex::Regex::new(r"\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))")
        .expect("valid");
    re.replace_all(&path, |c: &regex::Captures| {
        let name = c.get(1).or_else(|| c.get(2)).map_or("", |m| m.as_str());
        std::env::var(name).unwrap_or_else(|_| c[0].to_string())
    })
    .into_owned()
}

/// The roots the files viewer shows: `[[files.roots]]`, or by default the vault and `code/`
/// (in a `project` repo, the repository itself with the vault left out).
pub(crate) fn roots(vault: &Vault) -> Res<Vec<Root>> {
    let files = &vault.cfg.files;
    let mut problems = Vec::new();
    let mut out: Vec<Root> = Vec::new();
    let mut add = |name: &str, path: PathBuf, extra: &[String], watch: Option<&str>| {
        let watch = match watch.map(str::parse::<Watch>).transpose() {
            Ok(w) => w.unwrap_or(Watch::Auto),
            Err(e) => return problems.push(format!("[files] root {name}: {e}")),
        };
        if out.iter().any(|r| r.name == name) {
            return problems.push(format!("[files] two roots named {name}"));
        }
        let exclude: Vec<String> = files.exclude.iter().chain(extra).cloned().collect();
        match Root::new(name, path, &exclude, watch) {
            Ok(r) => out.push(r),
            Err(e) => problems.push(format!("[files] {e}")),
        }
    };
    if files.roots.is_empty() {
        let vault_dir = vault.cfg.vault.as_deref().unwrap_or("notes");
        add("notes", vault.notes.clone(), &[], None);
        if vault.is_project() {
            let name = vault.namespace().unwrap_or("repo");
            add(name, vault.root.clone(), &[format!("/{vault_dir}")], None);
        } else {
            add("code", vault.root.join("code"), &[], None);
        }
    }
    for r in &files.roots {
        add(
            &r.name,
            vault.root.join(expand(&r.path)),
            &r.exclude,
            r.watch.as_deref(),
        );
    }
    if problems.is_empty() {
        Ok(out)
    } else {
        Err(problems.join("\n"))
    }
}

/// What `yajna validate` reports about `[files]`; paths are not checked, they differ per
/// machine.
pub fn files_problems(vault: &Vault) -> Vec<String> {
    match roots(vault) {
        Ok(_) => Vec::new(),
        Err(e) => e.lines().map(|l| format!("{CONFIG_NAME}: {l}")).collect(),
    }
}

/// A token for writing to reviews: 128 bits from the system's random source, in hex.
fn token() -> String {
    use std::io::Read;
    let mut bytes = [0u8; 16];
    std::fs::File::open("/dev/urandom")
        .and_then(|mut f| f.read_exact(&mut bytes))
        .expect("/dev/urandom");
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

pub fn cmd_serve(
    vault: &Vault,
    out: Option<&Path>,
    port: u16,
    open: bool,
    hosts: &[String],
    review: bool,
) -> Res<i32> {
    let out = out
        .map(Path::to_path_buf)
        .unwrap_or_else(|| site_dir(vault));
    let roots = roots(vault)?;
    let links = Arc::new(FileLinks {
        repo: vault.root.clone(),
        roots: roots
            .iter()
            .map(|r| (r.name.clone(), r.path.clone()))
            .collect(),
    });
    let n = render(vault, &out, &links)?;
    println!("{}: {n} page(s)", out.display());
    for r in &roots {
        let missing = if r.path.is_dir() { "" } else { " (missing)" };
        println!("files: {} -> {}{missing}", r.name, r.path.display());
    }
    // the callback outlives this borrow of the vault, so it opens its own
    let owned = Vault::open(vault.root.clone())?;
    let rendered = Mutex::new(vault_mtime(&owned));
    let site = out.clone();
    let refresh = move || -> Result<(), String> {
        let mut at = rendered.lock().map_err(|e| e.to_string())?;
        if vault_mtime(&owned) > *at {
            render(&owned, &site, &links)?;
            *at = vault_mtime(&owned);
        }
        Ok(())
    };
    // the preview renders markdown as the site does: links and citations resolved from the
    // index when it can be built, plain otherwise
    let for_render = Vault::open(vault.root.clone())?;
    let render = move |path: &Path| -> Result<yajna_serve::Rendered, String> {
        let page = for_render.read(path)?;
        let ix = crate::index::Index::open(&for_render, false).ok();
        Ok(yajna_serve::Rendered {
            html: crate::site::markdown_for_viewer(ix.as_ref(), &page.body),
            id: page.id().map(str::to_string),
            title: page.field("title").map(str::to_string),
        })
    };
    let cfg = yajna_serve::Config {
        site: out,
        refresh: Arc::new(refresh),
        port,
        hosts: hosts.to_vec(),
        roots,
        render: Arc::new(render),
        notebook: vault.namespace().unwrap_or("notebook").to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        reviews: Some(Arc::new(crate::review::Served::new(vault.root.clone()))),
        token: review.then(token),
    };
    let written = cfg.token.clone();
    yajna_serve::run(cfg, |addr| {
        let url = format!("http://{addr}/");
        println!("serving {url} (Ctrl-C stops)");
        if let Some(t) = &written {
            // anyone with this URL can comment as the notebook's author until the server stops
            println!("reviews, writable: {url}files/?token={t}");
        }
        if open {
            let opener = if cfg!(target_os = "macos") {
                "open"
            } else {
                "xdg-open"
            };
            let _ = std::process::Command::new(opener).arg(&url).spawn();
        }
    })?;
    Ok(0)
}
