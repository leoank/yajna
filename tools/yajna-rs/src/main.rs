mod cli;
mod commands;
mod refs;
mod tui;
mod validate;
mod vault;
mod yamlfmt;

use clap::Parser;

use crate::cli::Cli;
use crate::vault::{find_root, Vault};

fn run() -> Result<i32, String> {
    let args = Cli::parse();
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
    match run() {
        Ok(code) => std::process::exit(code),
        Err(msg) => {
            eprintln!("{msg}");
            std::process::exit(1);
        }
    }
}
