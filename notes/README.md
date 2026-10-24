---
id: PRJ-0001
type: project
schema_version: 1
title: yajna
status: active            # active | paused | concluded | moved | archived
code: .               # code/<name> here, or a repository URL once it moves out
created: 2026-10-14
author: ank
tags: []
---

## Introduction
yajna is a markdown-first lab notebook and the tooling that keeps it honest: plain pages
with typed frontmatter for projects, experiments, runs, protocols, materials and a daily
log, a CLI that creates and checks them, an index and static site built from them, a
Neovim plugin that follows their links, and a Claude Code plugin that teaches agents the
conventions. It exists because PhD work at the MRC LMB mixes wet-lab, dry-lab and
hardware experiments that no off-the-shelf notebook records together in a form both a
human and an agent can read, diff and query. The original brief is `docs/context.md`.
The notebook itself lives in a separate lab repo (`leoank/manthan`); this repo is the
tooling and, from 2026-10-19, its own project notebook under `notes/`.

## Progress
What is planned and how far it has got, as a checklist: one item per milestone, ticked
when it lands. Add items as plans change; keep the done ones. `yajna tasks` lists the
open items with the rest.
- [x] Phase 0: conventions, schemas, templates and the CLI (`new`, `log`, `result`, `tasks`, `ref`, `validate`)
- [ ] Phase 0 verified: two weeks of real bench and ML days captured without the tooling in the way
- [x] Phase 0b: the Rust CLI at parity, `init lab|project`, namespaced links, `graduate` (ADR-0017, ADR-0018)
- [x] Phase 0b: `packages.yajna` installed through neusis
- [x] Phase 0b: a tagged release, v0.2.0, with binaries for Linux and macOS
- [ ] Phase 0b: a machine without Nix running `init project`, `new` and `validate` from the release binary
- [ ] Phase 0b: rc2s2 graduates by the documented procedure and both repos validate
- [x] Phase 0c: the Neovim plugin
- [x] Phase 1: the index, `show`, `timeline`, `tree` and `runs`, the static site with `--serve`, CI (ADR-0019)
- [x] Agent tooling: the Claude Code plugin (skill and `/yajna:project` commands), agents as authors, reproducible runs
- [x] Parallel work: `worktree`, `validate --against`, `renumber` (ADR-0021)
- [ ] `yajna renumber` also rewrites IDs outside markdown: when manthan renumbered g2a (PRJ-0003 to PRJ-0004) and vesicle-protrusions-and-imaging (PRJ-0004 to PRJ-0005) on 2026-10-23, the IDs in their code (`flake.nix` descriptions, `pyproject.toml`, a Python docstring) were left behind and fixed by hand; it should rewrite them, or at least list the files that still name the old ID
- [x] Phase 1: the one-way ELN exporter, `yajna export` (ADR-0010)
- [ ] Verify `import benchling` against real exports from the lab's tenant ([[EXP-20261019-j4xp01]])
- [ ] Phase 1: upload to the institutional ELN, and its import format, once the ELN is named
- [x] Phase 1b: `yajna sync` publishes marked pages to Google Docs and pulls comments back (ADR-0011)
- [x] Phase 1b verified: the PI reads and comments on a published page and the comments arrive in the repo ([[EXP-20261021-as4202]])
- [x] Phase 1b: synced docs mirror the notebook's folders in Drive and follow moved pages; citations render through pandoc with a page's own bibliography (ADR-0024)
- [x] `yajna adopt`: an existing markdown file becomes a page of any type, its body kept (ADR-0025)
- [ ] Phase 1b verified: folders and citations against the real Drive ([[EXP-20261023-cy5j5f]])
- [x] Phase 1b: `mirror` mode: `yajna sync pull` brings edits made in a doc back as an uncommitted change to its page, three-way merged against the published commit recorded on the doc, conflicts left as markers to resolve by hand; the next sync publishes the result (ADR-0026)
- [x] Phase 1b: the `mirror` cycle against the real Drive, scripted: exports deterministic, guard, pull and republish ([[RUN-20261023-ftnr64]])
- [ ] Phase 1b verified: a doc edited by a person is pulled, merged with work done in the repo meanwhile, and published back without losing either ([[EXP-20261023-ftnatx]])
- [ ] Phase 1b later: `import` mode, the doc as the truth
- [x] User guide on GitHub Pages: an mdBook with the CLI reference, page types and design docs generated at build time
- [x] Phase 1c designed: `yajna serve` and a live files viewer with tabs and split views, `docs/files-viewer.md` (ADR-0027, ADR-0028, ADR-0029)
- [x] Phase 1c step 1: `tools/` as a Cargo workspace; `yajna-serve` (axum) serves the site; `yajna serve`, `site --serve` its alias
- [x] Phase 1c step 2: `[files]` roots in `yajna.toml`; the read-only file API with ranges, path and Host checks ([[EXP-20261023-kjtach]])
- [x] Phase 1c step 3: the UI (dockview, CodeMirror, markdown, images), the Nix-built committed bundle, files links from the site ([[EXP-20261023-kjv5wy]])
- [x] Phase 1c step 4: live: watch or poll, SSE, follow mode ([[EXP-20261023-kjtrwp]])
- [ ] Phase 1c step 5: the paged viewer for files above the cap
- [ ] Phase 1c verified: ank follows an agent's run on a remote machine from the laptop ([[EXP-20261023-kjvkas]])
- [ ] Phase 2: data and runs (git-annex, `ART` pages, `experiment` and `autoresearch` commands)
- [ ] Phase 2b: bench planning (run sheets, inventory, schedules)
- [ ] Phase 3: the server and agents over HTTP and MCP
- [ ] Phase 4: apps and monitoring

## Open questions
- New `build` and `artifact` pages fail their own schema: the templates write `null`
  where `schema/build.json` (`project`, `produces`) and `schema/artifact.json` (`hash`,
  `run`) require strings.
- The experiment tree takes its theme from an experiment's first tag. Is that enough, or
  does the theme need a field of its own?
- `yajna init project` writes the skill into `.claude/skills/` even where the plugin is
  installed, so two copies load. Should it skip the copy when the plugin is present?
- Experiments keep counter IDs (ADR-0021). Do branch collisions stay rare enough that they
  never need volume IDs?

- Does Docs keep yajna's upload as a revision of its own when the owner edits right after
  a publish, or merge them? A merged revision makes `yajna sync pull` refuse
  ([[EXP-20261023-ftnatx]]).
- `mirror` publishes only committed pages, so the published version is in git for the
  merge. Is committing before every sync of a mirror page a burden in practice?
- Does Drive's Markdown export include suggestions made in suggesting mode? If so, a pull
  would bring unaccepted suggestions in as edits.

- Which shared storage do runs on the cluster write to, and does it deliver filesystem
  events at all ([[EXP-20261023-kjtrwp]])?
- `yajna serve` has no authentication and relies on binding to loopback. Is there a
  machine where that is not private enough (a shared login node), so the token has to
  come before the verification run?
- The files viewer was checked by hand in a browser (Playwright); a browser test in
  `nix flake check` needs browsers that nixpkgs ships for Linux only. Worth it, or is the
  Rust test of the routes and the bundle check enough?
- Which viewers come after text, markdown and images: CSV/TSV tables, PDF, notebooks,
  TIFF stacks? The verification run's notes decide the order.

- Which ELN does the lab use, and does it take an upload through an API, an import
  format, or only files? That decides the last renderer of `yajna export`.

## Design
The architecture is `docs/architecture.md` and its decision records are
`docs/decisions/`; here, only the few choices a reader must know before touching the
code.

- Markdown under `notes/` (or `lab/` in older repos) is the write model; everything else
  is derived and rebuildable (ADR-0001, ADR-0019).
- `schema/` and `templates/` are the contract for every page; the CLI embeds both
  (ADR-0003, ADR-0017).
- `docs/conventions.md` is the writer's cheat sheet and the skill restates it for agents;
  they change together.
- `yajna serve` and the files viewer are designed in `docs/files-viewer.md`: a
  `yajna-serve` crate (axum) in a `tools/` workspace, linked into the one binary; the
  rendered pages stay JavaScript-free, `files/` is the one application (ADR-0027).
- Future work is designed in `docs/protocol-framework.md`, `docs/protocol-corpus.md` and
  `docs/microfluidic-compiler.md`.

## Lessons
What was tried and dropped, and why, so nobody tries it again.
- A CLI that runs in other repos and on machines without Nix has to be one static
  binary: the Python CLI was replaced by Rust once that need appeared (ADR-0017).
- Parity between two implementations is judged by a scripted session and a byte diff of
  the vaults, not by reading code; it took reimplementing PyYAML's quoting rules.
- A private repository cannot be another flake's input for anyone else, so the lab moved
  out to its own private repo and the tooling became public.
- One directory name meaning two things (`projects/` for code and for pages) confuses
  people and agents alike (ADR-0020).
- A shared counter does not survive parallel branches without a check before merging
  (ADR-0021).
- Links quoted inside code spans are text; validation that ignored code spans failed on
  documentation that only described the syntax.
- Google Docs' Markdown export cannot give a page's source back (code, list and heading
  markup are lost), so `mirror` was redesigned around comparing two exports, published
  and current, which are deterministic; check what an external format really returns
  before designing a round trip on it ([[RUN-20261023-ftnr64]], ADR-0026).
- A mark that an action happened (`yajna_pulled` holding the revision a pull reached) is
  not proof its result is still there: ank threw a pull's changes away, the next pull
  found nothing and the next publish would have overwritten the doc. Safety checks look
  at content (ADR-0026).
- A listing that stats every entry is four times slower than one that takes the type
  `readdir` already returns, and a sort comparator that allocates is slower still; a
  million-entry directory took 15 s before both were fixed ([[RUN-20261023-pjazct]]).
- A watcher that waits for filesystem events misses a log a process keeps open: macOS's
  FSEvents reported 2 000 lines written through one handle only when the file was opened
  and closed. Open files are looked at every second as well ([[RUN-20261024-p44p6z]]).

## Experiments
One line per experiment after its link, what it asks and what came of it; `yajna validate`
rejects a bare link here. Newest last.
- [[EXP-20261019-j4xp01]] does `import benchling` read real Benchling exports; planned, deferred until exports from the lab's tenant are at hand
- [[EXP-20261021-as4202]] does `yajna sync` work against the real Google Docs API; positive: publish, updates in place and the comment round trip hold, after a checkbox fix
- [[EXP-20261023-cy5j5f]] do folder mirroring and pandoc citations work against the real Drive; every check passed in one run, conclusion pending
- [[EXP-20261023-ftnatx]] does `mirror` sync bring a person's edits in a real doc back into the page; the scripted cycle passed, the hand edit is ank's to do
- [[EXP-20261023-kjtach]] can `yajna serve` list a million-entry directory and read ranges of a 10 GB file fast enough; on the laptop, after a fix it found, 0.3 s at 100 000 entries and 4 s at a million (the disk's own floor), ranges 0.2 ms; rogue and the cluster to run
- [[EXP-20261023-kjtrwp]] does filesystem watching see what runs write, per filesystem and host; on the laptop events take 0.27 s and polling 0.5 s once open files are looked at every second, since macOS holds back writes to an open file; the cluster's storage still to run
- [[EXP-20261023-kjv5wy]] how large a file the CodeMirror viewer handles, the bundle size and the binary growth; planned; first numbers from step 3: 230 KB gzipped on first load, the binary 11.5 to 13.6 MB, large files still to test
- [[EXP-20261023-kjvkas]] can ank follow an agent's run on a remote machine from the laptop without a shell; planned, the Phase 1c verification
