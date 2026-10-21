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
- [ ] Phase 0b: a tagged release, and a machine without Nix running `init project`, `new` and `validate` from its binary
- [ ] Phase 0b: rc2s2 graduates by the documented procedure and both repos validate
- [x] Phase 0c: the Neovim plugin
- [x] Phase 1: the index, `show`, `timeline`, `tree` and `runs`, the static site with `--serve`, CI (ADR-0019)
- [x] Agent tooling: the Claude Code plugin (skill and `/yajna:project` commands), agents as authors, reproducible runs
- [x] Parallel work: `worktree`, `validate --against`, `renumber` (ADR-0021)
- [x] Phase 1: the one-way ELN exporter, `yajna export` (ADR-0010)
- [ ] Verify `import benchling` against real exports from the lab's tenant ([[EXP-20261019-j4xp01]])
- [ ] Phase 1: upload to the institutional ELN, and its import format, once the ELN is named
- [x] Phase 1b: `yajna sync` publishes marked pages to Google Docs and pulls comments back (ADR-0011)
- [ ] Phase 1b verified: the PI reads and comments on a published page and the comments arrive in the repo ([[EXP-20261021-as4202]])
- [ ] Phase 1b later: `mirror` and `import` modes, once publishing is routine
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

## Experiments
One line per experiment after its link, what it asks and what came of it; `yajna validate`
rejects a bare link here. Newest last.
- [[EXP-20261019-j4xp01]] does `import benchling` read real Benchling exports; planned, deferred until exports from the lab's tenant are at hand
- [[EXP-20261021-as4202]] does `yajna sync` work against the real Google Docs API; planned, deferred until an OAuth client exists for the personal account
