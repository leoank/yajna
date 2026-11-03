---
id: REV-20261103-j9yfse
type: review
schema_version: 1
title: Remote runs driven from the laptop, and shell completion of IDs
project: null
target:
  kind: range               # branch | range | page | run | experiment | phase
  ref: HEAD..HEAD
base: 2c88d86bf47d9ffe05b5243b75d6bedf7a95a56d
head: 742f1fc70d40624a69eeb6f1945f7105e7011da3
rounds: [2c88d86bf47d9ffe05b5243b75d6bedf7a95a56d]
paths: []
about: [PRJ-0001]
status: open              # open | changes_requested | approved | merged | closed
created: 2026-11-03
author: agent:claude
---

## Summary
Two features of yajna 0.23.0, one commit each, for [[PRJ-0001]]'s Phase 1e and its tooling.
Opened by agent:claude in [[AGS-20261103-j9yg23]].

**2c665ad, shell completion.** `source <(COMPLETE=zsh yajna)` loads clap_complete's dynamic
hook, which asks the binary for candidates as you type. Arguments that take a run, an
experiment, a project, a review or any page complete from the notebook the shell is in,
each with its title, or for a run the line its experiment lists it with.
- `tools/yajna/src/complete.rs`: the candidates (about 80 lines).
- `tools/yajna/src/cli.rs`: one `#[arg(add = ArgValueCandidates::new(...))]` per ID
  argument (39 of them); `main.rs`: the hook, before anything is printed.
- `docs/guide/src/install.md` *Shell completion*; test `ids_complete_from_the_notebook_with_their_titles`.

**742f1fc, `--on <host>` driven from the laptop** (ADR-0033, amending ADR-0031). The other
machine needs a checkout of the notebook, git, tar and Nix, not yajna; a reproduction's page,
logs and in-repo outputs are written here.
- Read first: `docs/decisions/ADR-0033-remote-runs-from-the-laptop.md`, then
  `docs/reproduce.md` section 9.
- `tools/yajna/src/rerun.rs`: `Remote`, `Tree` and `Tree::command` (here, or `ssh -t|-T`
  with every word quoted); `open_tree` decides the commit, overlay, flake and banner from
  this repository, then makes the worktree here or runs the remote script (fetch, worktree
  add or reuse, untar the overlay, write `<worktree>.overlay`); `reproduce` gathers the
  outputs into the new run's directory and streams them back; `clean --on`.
- Test `on_a_host_the_laptop_drives_a_checkout_there_over_ssh`: an `ssh` stand-in runs
  each command locally against a second clone in another `$HOME`, so fetch, worktree, tar
  both ways and clean run for real.

**Decided without asking; worth a look:**
- Completion finds the notebook from the shell's directory; `--root` is not parsed while
  completing. Help text is cut at 70 characters.
- The hook is sourced at shell start, as clap advises, not shipped as a file in the package.
- `run clean` gained `--on`. With `--on`, `--out-root` must be an absolute path on that
  machine.
- On the remote, the worktree lives in `~/.cache/yajna/runs/<hash of host and root>/`. Its
  changes check ignores the copied-in files and the new run's directory, as here.
- The CLI tests clear `YAJNA_AUTHOR` (21 failed when an agent's shell exported it).

**Not verified:**
- `--on` against oppy. Its checkout is only fetched in and gains worktrees; its working
  tree, index and HEAD are not touched.
- `run record` sets `host` to this machine when the page has none, so recording a run that
  ran on oppy from the laptop names the laptop. There is no `--host` yet.
- An `env` value is checked for existence on the remote only when it is an absolute or
  `~/` path. A relative default inside a script (`code/<slug>/data`) resolves inside the
  worktree, where gitignored data is absent.

**To review:** `yajna serve --review --open` in this repo, or `yajna review show
REV-20261103-j9yfse --diff`.

## Threads
