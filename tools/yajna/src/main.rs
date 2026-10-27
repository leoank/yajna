mod adopt;
mod anywhere;
mod cli;
mod commands;
mod export;
mod import;
mod index;
mod init;
mod mirror;
mod parallel;
mod query;
mod refs;
mod review;
mod serve;
mod site;
mod sync;
mod tui;
mod validate;
mod vault;
mod yamlfmt;

use clap::Parser;

use crate::cli::{Cli, Cmd};
use crate::vault::{find_root, Vault};

fn run() -> Result<i32, String> {
    let args = Cli::parse();
    if let Some(Cmd::Init { shape }) = &args.cmd {
        // No vault yet: the root is --root or the current directory.
        let here = match &args.root {
            Some(r) => r.clone(),
            None => std::env::current_dir().map_err(|e| e.to_string())?,
        };
        let code = init::run(&here, shape)?;
        let made = match shape {
            cli::InitShape::Lab {
                path: Some(path), ..
            } => here.join(path),
            _ => here,
        };
        if let Ok(vault) = Vault::open(made) {
            anywhere::remember(&vault);
        }
        return Ok(code);
    }
    let root = match &args.root {
        Some(r) => Some(
            r.canonicalize()
                .map_err(|e| format!("{}: {e}", r.display()))?,
        ),
        None => find_root().ok(),
    };
    let mut prompter = tui::prompter();
    // log, todo, tasks and repos also run outside any notebook (ADR-0032)
    if let Some(cmd) = args.cmd.as_ref().filter(|c| anywhere::handles(c)) {
        if let Some(vault) = root.clone().and_then(|r| Vault::open(r).ok()) {
            anywhere::remember(&vault);
        }
        return anywhere::run(root.as_deref(), cmd, prompter.as_mut());
    }
    let root = match root {
        Some(r) => r,
        None => find_root()?,
    };
    let vault = Vault::open(root)?;
    anywhere::remember(&vault);
    match args.cmd {
        None => tui::menu(&vault, prompter.as_mut()),
        Some(cmd) => commands::run(&vault, &cmd, prompter.as_mut()),
    }
}

fn main() {
    // `yajna tree | head` must not panic when the reader goes away: die quietly on EPIPE.
    #[cfg(unix)]
    unsafe {
        libc::signal(libc::SIGPIPE, libc::SIG_DFL);
    }
    match run() {
        Ok(code) => std::process::exit(code),
        Err(msg) => {
            eprintln!("{msg}");
            std::process::exit(1);
        }
    }
}
