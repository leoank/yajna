//! Command-line definition (clap). The menu re-parses typed lines through the same tree.

use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(
    name = "yajna",
    about = "The yajna command: new, log, result, tasks, ref, validate.",
    disable_help_subcommand = true
)]
pub struct Cli {
    /// repo root (default: nearest yajna.toml upwards)
    #[arg(long, global = true)]
    pub root: Option<PathBuf>,
    #[command(subcommand)]
    pub cmd: Option<Cmd>,
}

#[derive(Subcommand, Debug, Clone)]
#[allow(clippy::enum_variant_names)] // `ResultCmd`: `Result` would shadow the std type
pub enum Cmd {
    /// create a page from its template and allocate an ID
    New {
        /// project, experiment, run, protocol, material, artifact, analysis, equipment, build, agent; omit for an interactive prompt
        #[arg(value_name = "TYPE")]
        etype: Option<String>,
        title: Option<String>,
        /// PRJ-xxxx for project-scoped entities
        #[arg(long)]
        project: Option<String>,
        /// EXP-xxxx (runs); implies --project
        #[arg(long)]
        experiment: Option<String>,
        /// run kind (bench, compute, assembly, calibration) or material kind
        #[arg(long)]
        kind: Option<String>,
        /// project: also scaffold projects/<slug>/ with a flake
        #[arg(long)]
        code: bool,
    },
    /// append a timestamped line to today's log
    Log {
        /// the entry; read from stdin when empty
        text: Vec<String>,
        /// YYYY-MM-DD (default today)
        #[arg(long)]
        date: Option<String>,
        /// HH:MM (default now)
        #[arg(long)]
        time: Option<String>,
        /// author handle (default from yajna.toml)
        #[arg(long)]
        author: Option<String>,
    },
    /// turn a ===RESULT=== JSON line into a RUN page and a results.tsv row
    #[command(name = "result")]
    ResultCmd {
        /// EXP-xxxx the run belongs to
        #[arg(long)]
        experiment: String,
        /// output file to scan (default stdin)
        file: Option<PathBuf>,
        #[arg(long, default_value = "compute")]
        kind: String,
        #[arg(long)]
        author: Option<String>,
        /// free text for the run page
        #[arg(long)]
        note: Option<String>,
    },
    /// list open checkboxes across the vault
    Tasks {
        /// include completed tasks
        #[arg(long)]
        done: bool,
    },
    /// show a reference by citation key; --note creates its reading note
    Ref {
        key: String,
        #[arg(long)]
        note: bool,
    },
    /// check every page against the schemas, IDs and links
    Validate,
}
