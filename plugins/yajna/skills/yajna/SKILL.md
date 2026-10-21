---
name: yajna
description: Work in a yajna lab notebook (a repo with yajna.toml): record experiments, runs, log lines and agent sessions through the yajna CLI, following its conventions. Use whenever a task touches a notes/ vault, a PRJ/EXP/RUN page, or asks to record, reproduce or query lab work.
---

# yajna: the lab notebook

The repo you are in holds a notebook of plain markdown pages under `notes/` with typed
frontmatter. `yajna.toml` at the root says whether it is a `lab` (many projects plus shared
protocols, materials, equipment) or a `project` (one project's notebook inside its code
tree). The `yajna` binary creates and checks pages; never write a page by hand.

## Before anything else

1. `yajna --version` works from the repo's dev shell (`nix develop`). Run every command
   from the repo root, or pass `--root <path>`.
2. Say who you are: export `YAJNA_AUTHOR=agent:<name>` for the session (or pass
   `--author agent:<name>` to each command). Every page and log line you create must carry
   your handle, never the human's. `<name>` is your harness, lowercase: `agent:claude`.
3. Read, in this order: the project page (`notes/projects/PRJ-xxxx-*/README.md`, or
   `notes/README.md` in a project repo) for *Current belief*, *Open questions* and *What not
   to try again*; then `yajna tree PRJ-xxxx` for the experiments with outcomes; then the
   experiment you are working on and `yajna runs EXP-xxxx` for its runs.
4. Open a session page: `yajna new agent "<task>"` gives an `AGS` page. Keep its
   `created_entities` list current and summarise what you did when you finish.

## Commands

```
yajna new experiment "<question>" --project PRJ-xxxx      # curated; fill Question, Hypothesis, Plan, Success criteria
yajna new run --experiment EXP-xxxx --kind compute --script notes/projects/PRJ-xxxx-*/runs/RUN-<id>/run.sh
yajna result --experiment EXP-xxxx run.log --script <path>   # metric runs: ===RESULT=== line -> RUN page + results.tsv
yajna log "<what you did and learned, with [[IDs]]>"       # your own file for the day
yajna new agent "<task>"                                   # the AGS page for this session
yajna show <ID> | timeline <ID> | tree PRJ-xxxx | runs EXP-xxxx --by <metric>
yajna tasks                                                # open checkboxes across the vault
yajna validate                                             # run before you report anything as done
```

`yajna new run` does not know the path of the page it will create until it allocates the
ID, so create the run first, then write the script at the path printed on the page
(`script:` in its frontmatter) and fill the page.

## Conventions you must follow

- **IDs are allocated by the CLI**: date IDs for experiments, analyses, runs, artifacts and
  sessions (`EXP-20261021-0k3m9x`), counters for projects, protocols, materials, equipment
  and builds (`PRO-0012`). An ID from before `yajna migrate-ids` still works in commands;
  write the current one in pages. Never reuse,
  renumber or hand-edit an ID or `notes/counters.yaml`.
- **Link with `[[ID]]`**, `[[ID|label]]`, `[[PRO-0012@3]]` for a protocol version,
  `[[ns/ID]]` into another repo listed in `[repos]`. A link to an unknown ID fails
  validation. Cite papers as `@citekey` from `references/library.bib`.
- **Keep *Progress* current.** The project page's *Progress* checklist is the quick view
  of what is planned and done: tick an item when its work lands, add one when the plan
  grows, never delete a done item.
- **A code project's design lives with its code.** `yajna new project --code` creates
  `code/<slug>/docs/architecture.md` and `code/<slug>/docs/decisions/`. Keep the
  architecture current when the design changes, and record each decision, with the
  alternatives considered, as a new `ADR-xxxx-*.md` there plus a row in its README; never
  rewrite an accepted one, supersede it.
- **List children with one line each.** On a project page `- [[EXP-0007]] what it asks
  and what came of it`; on an experiment page `- [[RUN-20261016-k7f3]] what was tried and
  what it showed`. A bare `- [[ID]]` fails validation; the line is what the site shows
  next to the ID. Add the line when you create the page and rewrite it when the outcome
  is known.
- **Log, do not narrate in pages.** `yajna log` appends `- HH:MM text` to
  `notes/log/<year>/<date>.<author>.md`. Lines are appended, never reordered or edited.
  Log when you start, when something surprises you, and when you finish.
- **One run per result the experiment will rest on**, not one per command. A `RUN`
  page has kind `compute` for anything executed, `bench` for bench sessions.
- **Curated pages are human-signed.** When you edit an `EXP`, `PRO` or `MAT` page, set
  `review: pending` in its frontmatter; only a human removes it. Rewrite *Current belief*;
  append everywhere else. The *Conclusion* of an experiment is written
  once, by a human: propose it in the log or the `AGS` page instead.
- **Large files never go into git history.** Results that matter become `ART` pages;
  ask before adding anything over a few MB.
- **Never delete.** Mark `status: abandoned` or `aborted`; git history is the record.

## Working in a worktree

Other agents may be working in other worktrees of the same notebook at the same time.

- If the repo root has `.yajna/author`, it names you for this worktree; do not set
  `YAJNA_AUTHOR` over it. Start parallel work with `yajna worktree PRJ-xxxx <topic>`.
- Stay inside your branch's project. Do not create or edit protocols, materials,
  equipment or builds on a branch; ask for them on `main`.
- Create experiments and analyses on your branch freely: their date IDs never collide.
  Projects and shared entities are made on `main`. If you did allocate a counter ID on the
  branch, run `yajna validate --against main` before reporting the branch as ready and fix a
  collision with `yajna renumber <ID>`. Never edit an ID by hand.
- Merge `main` into your branch before allocating anything, and never use a bare
  `git stash`.

## Reproducible runs

Every `compute` run you record must be re-creatable by someone who has only the repo:

1. Record `commit` (the repo commit the run executed at; `yajna result` fills it) and
   `script` in the run's frontmatter. `yajna new run --script <path>` writes a stub at
   that path if it does not exist, under `runs/RUN-<id>/run.sh` beside the page.
2. The script runs from the repo root inside the project's dev shell
   (`nix develop ./code/<slug> -c <script>`), pins or derives every input it needs
   (data paths, seeds, model versions, environment variables), and produces the same
   outputs: files under the run's directory and, for metric runs, one
   `===RESULT=== {...}` line on stdout.
3. Record in `Notes` what the script does not control (hardware, network, time) and what
   differed between the run and the plan. `yajna validate` fails when `script` points at
   a file that does not exist.

Hand-recorded runs that were not scripted (an interactive session, a one-off probe) say so
under `Notes` and still leave a script that gets as close as possible.

## Starting a project

A new project starts with an interview, not a guess: `/yajna:project <brief>` (and
`/yajna:code-project`, `/yajna:bio-project`, `/yajna:ml-project`,
`/yajna:hardware-project` for their domains) reads the notebook, asks the author the
questions that pin the project down, and only then creates the pages.

## Finishing

Run `yajna validate` (and `nix flake check` if the repo's AGENTS.md asks for it), update
the `AGS` page, log a closing line, and follow the repo's AGENTS.md for commits: by
default, commit only when asked and stage files by path.
