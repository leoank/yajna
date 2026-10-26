# ADR-0031: Reproducing runs: `yajna run shell`, `reproduce` and `diff`, and run commits that survive graduation

Status: accepted
Date: 2026-10-26
Phase: 1e
Source: `docs/reproduce.md`

## Context

Run pages record `commit` and `script`, and say to run the script in the project's dev
shell at that commit. In practice the script is committed after the code it ran, often
moves when a project is renumbered, depends on variables and data outside git, and, after
graduation, names a commit the project's repository does not have (`git subtree split`
rewrites every commit). 20 of manthan's 48 runs have no `commit` at all.

## Decision

- **`yajna run shell RUN-…`** opens the project's dev shell in a git worktree at the run's
  `commit`, with the run's directory overlaid from the current revision at its current path,
  the run's `env` exported, and a banner saying what came from where and what does not line
  up. Worktrees live in the cache and are reused until `yajna run clean`.
- **`yajna run reproduce`** runs the script there into a fresh directory, compares the
  recorded `outputs` hashes and `===RESULT===` metrics, and writes a new run with
  `reproduces` and a `verdict`. It never writes over outputs outside the run directory;
  their root has to be redirected to scratch.
- **`yajna run diff`** compares two runs; it shares its resolution with run reviews
  (ADR-0030). **`--on <host>`** runs any of them over SSH in a checkout named in the
  machine-local `.yajna/hosts.toml`.
- **Run pages gain** `host`, `env` (variable names that look like credentials refused),
  `outputs` (paths with sha256), `origin_commit`, `reproduces` and `verdict`, all optional.
  `yajna result` and `yajna run record` write them.
- **A `done` compute run must have a `commit` that resolves**, or `commit: unknown` with the
  reason in *Notes*; checked except in shallow clones. Commits are full SHAs.
- **Graduation remaps commits** by the code directory's tree to the split commit with the
  same tree, keeping the original as `origin_commit: <lab>@<sha>`; `--commits-only` does it
  for a repository that has already graduated.

## Consequences

- Reproducing a run is one command when its inputs are reachable; when they are not, the
  banner says which.
- Existing runs need a cleanup before the commit rule is turned on, in manthan and rc2s2.
- Run scripts are asked to write through `YAJNA_RUN_DIR`; old ones still work in the
  worktree.
- Data versions remain outside what a commit pins until git-annex (Phase 2).
