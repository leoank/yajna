//! Command-line definition (clap). The menu re-parses typed lines through the same tree.

use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(
    name = "yajna",
    version,
    about = "yajna: create, check and query a markdown lab notebook. Run it without a command for an interactive menu.",
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
        /// project, experiment, run, protocol, material, artifact, analysis, equipment, build, agent, doc; omit for an interactive prompt
        #[arg(value_name = "TYPE")]
        etype: Option<String>,
        /// the page's title; a run needs none, an agent session defaults to "Agent session"
        title: Option<String>,
        /// PRJ-xxxx the page belongs to: required for experiments, runs, analyses and
        /// artifacts (implied in a project repo), optional for builds and docs
        #[arg(long)]
        project: Option<String>,
        /// EXP-xxxx the run belongs to; implies --project
        #[arg(long)]
        experiment: Option<String>,
        /// run: bench (default), compute, assembly, calibration. material: reagent (default),
        /// strain, plasmid, cell_line, stock, library, antibody, dataset, model, checkpoint,
        /// part, other. protocol: bench (default), assembly, compute. doc: note (default),
        /// meeting, proposal, report, admin, logistics. Projects have no kind; see --code
        #[arg(long)]
        kind: Option<String>,
        /// project: a code project, with code/<slug>/ scaffolded (flake, README, design docs)
        /// and the code template for the page
        #[arg(long)]
        code: bool,
        /// doc: the directory to create it in, relative to the repo root (default notes/docs;
        /// asked for when interactive). A directory outside the vault is registered under
        /// [docs] in yajna.toml
        #[arg(long)]
        dir: Option<String>,
        /// author handle (default: $YAJNA_AUTHOR, else .yajna/author, else yajna.toml); agents pass agent:<name>
        #[arg(long)]
        author: Option<String>,
        /// run: the executable that re-creates it, relative to the repo root; a stub is
        /// written there when the file does not exist
        #[arg(long)]
        script: Option<String>,
    },
    /// make an existing markdown file a page: the type's frontmatter on top, its body kept,
    /// the file renamed to start with its new ID (a doc stays in its directory, other types
    /// move to where they live)
    Adopt {
        /// the markdown file, inside this repo
        file: PathBuf,
        /// page type: doc, experiment, analysis, artifact, run, protocol, material,
        /// equipment, build or project
        #[arg(long = "type", value_name = "TYPE", default_value = "doc")]
        etype: String,
        /// the title (default: the file's own title, else its first heading, else its name)
        #[arg(long)]
        title: Option<String>,
        /// the kind, as for `yajna new`
        #[arg(long)]
        kind: Option<String>,
        /// PRJ-xxxx the page belongs to, as for `yajna new`
        #[arg(long)]
        project: Option<String>,
        /// EXP-xxxx, for a run
        #[arg(long)]
        experiment: Option<String>,
        /// author handle (default: $YAJNA_AUTHOR, else .yajna/author, else yajna.toml)
        #[arg(long)]
        author: Option<String>,
        /// say what would happen and stop
        #[arg(long)]
        dry_run: bool,
    },
    /// append a timestamped line to today's log, here or in any notebook on the machine
    Log {
        /// the entry; read from stdin when empty
        text: Vec<String>,
        /// the notebook: a repo by namespace, a project as <repo>/<PRJ-xxxx or slug>, or a
        /// project of this repo (default: this repo, else `default` in the user config)
        #[arg(long = "in", value_name = "TARGET")]
        target: Option<String>,
        /// choose the notebook from a list
        #[arg(long, conflicts_with = "target")]
        pick: bool,
        /// write the entries in $VISUAL/$EDITOR, one per paragraph
        #[arg(short = 'e', long)]
        edit: bool,
        /// YYYY-MM-DD (default today)
        #[arg(long)]
        date: Option<String>,
        /// HH:MM (default now)
        #[arg(long)]
        time: Option<String>,
        /// author handle (default: $YAJNA_AUTHOR, else .yajna/author, else yajna.toml)
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
        /// run kind: compute, bench, assembly or calibration
        #[arg(long, default_value = "compute")]
        kind: String,
        /// author handle (default: $YAJNA_AUTHOR, else .yajna/author, else yajna.toml)
        #[arg(long)]
        author: Option<String>,
        /// free text for the run page
        #[arg(long)]
        note: Option<String>,
        /// the executable that re-created this run, relative to the repo root
        #[arg(long)]
        script: Option<String>,
    },
    /// list open checkboxes across the vault, numbered for `yajna todo done`; overdue first,
    /// then by priority (p:1-3) and due date (due:YYYY-MM-DD)
    Tasks {
        /// include completed tasks
        #[arg(long)]
        done: bool,
        /// one notebook or project, as for `yajna log --in`
        #[arg(long = "in", value_name = "TARGET")]
        target: Option<String>,
        /// every notebook in the user registry (`yajna repos`)
        #[arg(long, conflicts_with = "target")]
        all: bool,
    },
    /// add a loose todo to a notebook's tasks.md, here or anywhere on the machine
    #[command(args_conflicts_with_subcommands = true)]
    Todo {
        #[command(subcommand)]
        action: Option<TodoAction>,
        /// the todo
        text: Vec<String>,
        /// the notebook, as for `yajna log --in`
        #[arg(long = "in", value_name = "TARGET")]
        target: Option<String>,
        /// choose the notebook from a list
        #[arg(long, conflicts_with = "target")]
        pick: bool,
        /// write the todos in $VISUAL/$EDITOR, one per paragraph
        #[arg(short = 'e', long)]
        edit: bool,
        /// due date: YYYY-MM-DD, today, tomorrow, a weekday, +3d, +2w
        #[arg(long)]
        due: Option<String>,
        /// priority, 1 (highest) to 3
        #[arg(short = 'p', long, value_parser = clap::value_parser!(u8).range(1..=3))]
        priority: Option<u8>,
    },
    /// the labs and projects this machine knows: ~/.config/yajna/config.toml, and every
    /// repo yajna has run in
    Repos {
        #[command(subcommand)]
        action: Option<ReposAction>,
    },
    /// show a reference by citation key; --note creates its reading note
    Ref {
        /// the citation key, as cited with @key
        key: String,
        /// create the reading note, notes/references/<key>.md
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
    /// one-off import of files exported from another tool, written as ordinary pages
    Import {
        #[command(subcommand)]
        source: ImportSource,
    },
    /// publish pages marked `sync: {provider: gdoc, mode: publish|mirror}` to Google Docs and
    /// pull their comments back under `## Review` (ADR-0011); `sync pull` brings edits made
    /// in mirror docs back
    #[command(args_conflicts_with_subcommands = true)]
    Sync {
        #[command(subcommand)]
        action: Option<SyncAction>,
        /// only these IDs
        ids: Vec<String>,
        /// say what would happen, offline
        #[arg(long)]
        dry_run: bool,
        /// publish without pulling comments
        #[arg(long)]
        no_comments: bool,
        /// publish mirror pages even when their doc has edits not pulled yet, discarding them
        #[arg(long)]
        overwrite: bool,
    },
    /// give counter-ID experiments and analyses date IDs, and older date IDs the time-sortable
    /// suffix; every reference follows and each page keeps its old ID (ADR-0022)
    #[command(name = "migrate-ids")]
    MigrateIds {
        /// list the new IDs and stop
        #[arg(long)]
        dry_run: bool,
    },
    /// give a page with a counter ID (PRJ, PRO, MAT, EQP, BLD) a new number and rewrite every
    /// reference (resolves a branch collision)
    Renumber {
        /// the ID to replace, e.g. PRJ-0004
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
        /// where to put the worktree (default: <container>/<branch> in a bare-repo layout,
        /// else <repo>-<slug>-<topic> beside the repo)
        #[arg(long)]
        path: Option<PathBuf>,
    },
    /// review a branch, a commit range, a page, a run, an experiment or a project phase in
    /// the notebook: REV pages with threads anchored to lines (ADR-0030)
    Review {
        #[command(subcommand)]
        action: ReviewAction,
    },
    /// a project's phases: the items of its Progress checklist
    Phase {
        #[command(subcommand)]
        action: PhaseAction,
    },
    /// rebuild the SQLite index (a cache outside the repo; queries rebuild it when stale)
    Index,
    /// one entity: frontmatter, links out, links in, log mentions
    Show {
        /// any page's ID
        id: String,
    },
    /// everything that happened to an entity, in date order: log mentions, pages that link it, runs
    Timeline {
        /// any page's ID, such as a material's
        id: String,
    },
    /// a project's experiments by theme with status, outcome, runs and influence
    Tree {
        /// PRJ-xxxx; omitted in a project repo
        project: Option<String>,
    },
    /// an experiment's runs with their metrics from results.tsv
    Runs {
        /// EXP-xxxx
        experiment: String,
        /// metric to sort by (ascending; --desc for descending)
        #[arg(long)]
        by: Option<String>,
        /// sort descending
        #[arg(long)]
        desc: bool,
    },
    /// write the agent skill (how to use yajna and its conventions) into .claude/skills/yajna/
    Skill {
        /// print it instead of writing it
        #[arg(long)]
        print: bool,
    },
    /// render the static site from the index; --serve is `yajna serve`
    Site {
        /// output directory (default: <cache>/<hash of the repo path>.site, beside the index)
        #[arg(long)]
        out: Option<PathBuf>,
        /// serve the site over HTTP, re-rendering when a page changes (as `yajna serve`)
        #[arg(long)]
        serve: bool,
        /// port for --serve (0 picks a free one)
        #[arg(long, default_value_t = 8765)]
        port: u16,
        /// with --serve: open the browser
        #[arg(long)]
        open: bool,
    },
    /// serve the site on 127.0.0.1, re-rendered whenever a page changes (ADR-0027)
    Serve {
        /// where the rendered site goes (default: <cache>/<hash of the repo path>.site)
        #[arg(long)]
        out: Option<PathBuf>,
        /// port (0 picks a free one)
        #[arg(long, default_value_t = 8765)]
        port: u16,
        /// open the browser
        #[arg(long)]
        open: bool,
        /// also answer requests addressed to this host name, e.g. the name `tailscale serve`
        /// forwards for; repeatable
        #[arg(long = "host", value_name = "NAME")]
        hosts: Vec<String>,
        /// let the files viewer write to reviews: prints a URL carrying a one-time token
        #[arg(long)]
        review: bool,
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
pub enum SyncAction {
    /// sign in once with the Google account that owns the docs; stores a refresh token
    /// outside the repo
    Login {
        /// the OAuth client JSON (type Desktop app) from the Google Cloud console
        #[arg(long)]
        client: PathBuf,
    },
    /// bring edits made in the docs of `mode: mirror` pages into the pages as uncommitted
    /// changes, three-way merged with the repo; conflicts are left as markers to resolve
    Pull {
        /// only these IDs
        ids: Vec<String>,
    },
}

#[derive(Subcommand, Debug, Clone)]
pub enum ImportSource {
    /// GenBank files (.gb/.gbk/.genbank) become materials; entry JSON from the Benchling API
    /// (GET /entries/{id}, one entry, a list, or {"entries": [...]}) becomes experiments
    Benchling {
        /// files or directories exported from Benchling
        #[arg(required = true)]
        paths: Vec<PathBuf>,
        /// PRJ-xxxx the imported notebook entries belong to
        #[arg(long)]
        project: Option<String>,
        /// material kind for GenBank records
        #[arg(long, default_value = "plasmid")]
        kind: String,
        /// status of imported experiments
        #[arg(long, default_value = "concluded")]
        status: String,
        /// list what would be imported and stop
        #[arg(long)]
        dry_run: bool,
    },
}

#[derive(Subcommand, Debug, Clone)]
pub enum PhaseAction {
    /// mark a Progress item as started at HEAD: appends `(since <sha>)` to its line, the
    /// base of a review of the phase
    Start {
        /// PRJ-xxxx
        project: String,
        /// words from the item's text
        item: Vec<String>,
    },
}

#[derive(Subcommand, Debug, Clone)]
pub enum ReviewAction {
    /// open a review: of a branch against its base (written on the branch, in its
    /// worktree), of a commit range A..B, of a page, run or experiment by ID, or of a
    /// project's phase (PRJ-xxxx --phase "<item>")
    Open {
        /// a branch, A..B, or an ID
        target: String,
        /// the branch a branch review is against
        #[arg(long, default_value = "main")]
        base: String,
        /// with a project ID: the Progress item whose phase is reviewed (words from its text)
        #[arg(long)]
        phase: Option<String>,
        /// limit the diff to these paths, relative to the repo root
        #[arg(long, num_args = 1..)]
        paths: Vec<String>,
        /// the review's title (default: from the target)
        #[arg(long)]
        title: Option<String>,
        /// PRJ-xxxx the review belongs to (default: the page's, or the branch's <slug>/)
        #[arg(long)]
        project: Option<String>,
        /// author handle (default: $YAJNA_AUTHOR, else .yajna/author, else yajna.toml)
        #[arg(long)]
        author: Option<String>,
    },
    /// the reviews in this checkout and the repo's other worktrees
    List {
        /// only open and changes-requested reviews
        #[arg(long)]
        open: bool,
        /// only reviews of this branch, range or ID
        #[arg(long)]
        target: Option<String>,
    },
    /// move a review's head to where its target is now and re-anchor its threads
    Update { review: String },
    /// a review's threads, or with --diff the changes under review
    Show {
        review: String,
        #[arg(long)]
        diff: bool,
    },
    /// start a thread: on lines (--at path:from-to), a heading (--at path#Heading), or the
    /// whole review
    Comment {
        review: String,
        /// <path>:<from>[-<to>] or <path>#<heading>, at the review's head; omit for a general thread
        #[arg(long)]
        at: Option<String>,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// answer in a thread
    Reply {
        review: String,
        /// T<n>
        thread: String,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// mark a thread addressed by a commit (on the branch, for a branch review)
    Address {
        review: String,
        thread: String,
        /// the commit that addresses it (default HEAD)
        #[arg(long)]
        commit: Option<String>,
        /// what changed
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// resolve a thread; humans only
    Resolve {
        review: String,
        thread: String,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// reopen an addressed or resolved thread
    Reopen {
        review: String,
        thread: String,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// approve a review once no thread is open or addressed (a human only); for a page
    /// target, also clears `review: pending` on the page
    Approve {
        review: String,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// ask for changes before the review can be approved
    RequestChanges {
        review: String,
        text: Vec<String>,
        #[arg(long)]
        author: Option<String>,
    },
    /// merge an approved branch review into the branch checked out here, with --no-ff,
    /// after validating the branch against it (a human only)
    Merge {
        review: String,
        /// merge although threads are open or the review is not approved; the page says so
        #[arg(long)]
        force: bool,
        #[arg(long)]
        author: Option<String>,
    },
    /// the open threads you owe: on reviews of the branch you are on, and on this
    /// checkout's other reviews, oldest first
    Todo,
}

#[derive(Subcommand, Debug, Clone)]
pub enum TodoAction {
    /// tick a todo: item <n> of the last `yajna tasks`, or the one matching the words
    Done {
        /// a number from the last `yajna tasks`, or words of the todo; nothing for a list
        what: Vec<String>,
        /// the notebook to look in, as for `yajna log --in`
        #[arg(long = "in", value_name = "TARGET")]
        target: Option<String>,
    },
}

#[derive(Subcommand, Debug, Clone)]
pub enum ReposAction {
    /// drop a repo yajna recorded (repos in the user config stay)
    Forget { name: String },
}

#[derive(Subcommand, Debug, Clone)]
pub enum InitShape {
    /// a lab: notes/ with projects, protocols, materials, equipment, builds, agents, log
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
    /// one project at the root of a code repo: yajna.toml and notes/ next to the code
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
