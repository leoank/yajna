mod cli;
mod commands;
mod export;
mod import;
mod index;
mod init;
mod parallel;
mod query;
mod refs;
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
        return init::run(&here, shape);
    }
    let root = match args.root {
        Some(r) => r
            .canonicalize()
            .map_err(|e| format!("{}: {e}", r.display()))?,
        None => find_root()?,
    };
    let vault = Vault::open(root)?;
    let mut prompter = tui::prompter();
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
