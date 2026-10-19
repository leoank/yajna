//! Command-line definition (clap). The menu re-parses typed lines through the same tree.

use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(
    name = "yajna",
    version,
    about = "The yajna command: init, new, log, result, tasks, ref, validate, index, show, timeline, tree, runs, site, graduate.",
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
    /// create a repo of either shape: a lab, or one project inside a code repo
    Init {
        #[command(subcommand)]
        shape: InitShape,
    },
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
        /// project: also scaffold code/<slug>/ with a flake
        #[arg(long)]
        code: bool,
        /// author handle (default: $YAJNA_AUTHOR, else yajna.toml); agents pass agent:<name>
        #[arg(long)]
        author: Option<String>,
        /// run: the executable that re-creates it, relative to the repo root; a stub is
        /// written there when the file does not exist
        #[arg(long)]
        script: Option<String>,
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
        /// the executable that re-created this run, relative to the repo root
        #[arg(long)]
        script: Option<String>,
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
    Validate {
        /// also check this branch against another (e.g. main): a curated ID created on both
        /// sides since they diverged is a collision
        #[arg(long, value_name = "REF")]
        against: Option<String>,
    },
    /// a dated, read-only bundle of pages for an institutional ELN (ADR-0010); by default
    /// every page changed since the last export recorded in notes/exports.tsv
    Export {
        /// export these IDs only
        ids: Vec<String>,
        /// export every page
        #[arg(long)]
        all: bool,
        /// export pages changed since this commit instead of since the last export
        #[arg(long, value_name = "REV")]
        since: Option<String>,
        /// directory to write the bundle into (default: <cache>/exports)
        #[arg(long)]
        out: Option<PathBuf>,
        /// list what would be exported and stop
        #[arg(long)]
        dry_run: bool,
        /// export even with uncommitted changes in the notebook (marked dirty in the manifest)
        #[arg(long)]
        allow_dirty: bool,
    },
    /// give a curated page a new ID and rewrite every reference (resolves a branch collision)
    Renumber {
        /// the ID to replace, e.g. EXP-0012
        old: String,
        /// the new ID (default: the next free one from the counter)
        new: Option<String>,
    },
    /// start a branch <project-slug>/<topic> in its own git worktree with its own agent author
    Worktree {
        /// PRJ-xxxx the work belongs to
        project: String,
        /// what the branch is for, a few words
        topic: String,
        /// the agent that will work there; the author becomes agent:<agent>-<slug>-<topic>
        #[arg(long, default_value = "claude")]
        agent: String,
        /// the branch to start from
        #[arg(long, default_value = "main")]
        from: String,
        /// where to put the worktree (default: beside the others in a bare-repo layout)
        #[arg(long)]
        path: Option<PathBuf>,
    },
    /// rebuild the SQLite index (a cache outside the repo; queries rebuild it when stale)
    Index,
    /// one entity: frontmatter, links out, links in, log mentions
    Show { id: String },
    /// everything that happened to an entity, in date order: log mentions, pages that link it, runs
    Timeline { id: String },
    /// a project's experiments by theme with status, outcome, runs and influence
    Tree {
        /// PRJ-xxxx; omitted in a project repo
        project: Option<String>,
    },
    /// an experiment's runs with their metrics from results.tsv
    Runs {
        experiment: String,
        /// metric to sort by (ascending; --desc for descending)
        #[arg(long)]
        by: Option<String>,
        #[arg(long)]
        desc: bool,
    },
    /// write the agent skill (how to use yajna and its conventions) into .claude/skills/yajna/
    Skill {
        /// print it instead of writing it
        #[arg(long)]
        print: bool,
    },
    /// render the static site from the index; --serve keeps it fresh in a browser
    Site {
        /// output directory (default: <cache>/<repo>/site)
        #[arg(long)]
        out: Option<PathBuf>,
        /// serve the site over HTTP, re-rendering when a page changes
        #[arg(long)]
        serve: bool,
        /// port for --serve (0 picks a free one)
        #[arg(long, default_value_t = 8765)]
        port: u16,
        /// with --serve: open the browser
        #[arg(long)]
        open: bool,
    },
    /// move a code-bearing project into its own repo, notebook included (ADR-0018)
    Graduate {
        /// PRJ-xxxx of the project
        project: String,
        /// where the new repo will live, e.g. github:leoank/rc2s2
        #[arg(long)]
        to: String,
        /// the new repo's checkout (default: ../<namespace> next to this repo)
        #[arg(long)]
        into: Option<PathBuf>,
        /// the new repo's namespace (default: the last path segment of --to)
        #[arg(long)]
        namespace: Option<String>,
    },
}

#[derive(Subcommand, Debug, Clone)]
pub enum InitShape {
    /// a lab: lab/ with projects, protocols, materials, equipment, builds, agents, log
    Lab {
        /// directory to create the lab in (default: --root or the current directory)
        path: Option<PathBuf>,
        /// this repo's name in links from other repos (default: the directory name)
        #[arg(long)]
        namespace: Option<String>,
        /// author handle written into every page (default: $USER)
        #[arg(long)]
        author: Option<String>,
    },
    /// one project at the root of a code repo: yajna.toml and lab/ next to the code
    Project {
        /// the project's title, or its PRJ-xxxx in the lab given by --from
        name: String,
        /// a lab repo to copy the project's notebook from (graduation, ADR-0018)
        #[arg(long)]
        from: Option<PathBuf>,
        /// this repo's name in links from other repos (default: the directory name)
        #[arg(long)]
        namespace: Option<String>,
        /// author handle (default: the lab's with --from, else $USER)
        #[arg(long)]
        author: Option<String>,
    },
}
