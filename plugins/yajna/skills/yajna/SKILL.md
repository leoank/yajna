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

- **IDs are allocated by the CLI** (`EXP-0007`, `RUN-20261016-k7f3`). Never reuse,
  renumber or hand-edit an ID or `notes/counters.yaml`.
- **Link with `[[ID]]`**, `[[ID|label]]`, `[[PRO-0012@3]]` for a protocol version,
  `[[ns/ID]]` into another repo listed in `[repos]`. A link to an unknown ID fails
  validation. Cite papers as `@citekey` from `references/library.bib`.
- **Log, do not narrate in pages.** `yajna log` appends `- HH:MM text` to
  `notes/log/<year>/<date>.<author>.md`. Lines are appended, never reordered or edited.
  Log when you start, when something surprises you, and when you finish.
- **One run per result the experiment will rest on**, not one per command. A `RUN`
  page has kind `compute` for anything executed, `bench` for bench sessions.
- **Curated pages are human-signed.** When you edit an `EXP`, `PRO` or `MAT` page, set
  `review: pending` in its frontmatter; only a human removes it. Rewrite *Current belief*
  (*Status* on a code project's page); append everywhere else. The *Conclusion* of an experiment is written
  once, by a human: propose it in the log or the `AGS` page instead.
- **Large files never go into git history.** Results that matter become `ART` pages;
  ask before adding anything over a few MB.
- **Never delete.** Mark `status: abandoned` or `aborted`; git history is the record.

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
