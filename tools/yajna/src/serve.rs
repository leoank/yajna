//! `yajna serve` (ADR-0027): the static site, re-rendered when a page changed, served by
//! the `yajna-serve` crate on 127.0.0.1.

use std::path::Path;
use std::sync::{Arc, Mutex};

use crate::site::{render, site_dir, vault_mtime};
use crate::vault::{Res, Vault};

pub fn cmd_serve(
    vault: &Vault,
    out: Option<&Path>,
    port: u16,
    open: bool,
    hosts: &[String],
) -> Res<i32> {
    let out = out
        .map(Path::to_path_buf)
        .unwrap_or_else(|| site_dir(vault));
    let n = render(vault, &out)?;
    println!("{}: {n} page(s)", out.display());
    // the callback outlives this borrow of the vault, so it opens its own
    let owned = Vault::open(vault.root.clone())?;
    let rendered = Mutex::new(vault_mtime(&owned));
    let site = out.clone();
    let refresh = move || -> Result<(), String> {
        let mut at = rendered.lock().map_err(|e| e.to_string())?;
        if vault_mtime(&owned) > *at {
            render(&owned, &site)?;
            *at = vault_mtime(&owned);
        }
        Ok(())
    };
    let cfg = yajna_serve::Config {
        site: out,
        refresh: Arc::new(refresh),
        port,
        hosts: hosts.to_vec(),
    };
    yajna_serve::run(cfg, |addr| {
        let url = format!("http://{addr}/");
        println!("serving {url} (Ctrl-C stops)");
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
