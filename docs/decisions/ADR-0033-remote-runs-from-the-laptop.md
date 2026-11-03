# ADR-0033: `--on <host>` is driven from the laptop; the other machine needs git and Nix, not yajna

Status: accepted
Date: 2026-11-03
Phase: 1e
Source: `docs/reproduce.md` section 9. Amends ADR-0031.

## Context

ADR-0031 ran `--on <host>` as `yajna run …` on the other machine over ssh: that machine
needed yajna on its PATH, at a version that understands the run pages, and `run reproduce`
wrote its new run page there, to be committed and pushed from there. The machines a run
needs (a GPU box, the one with the data) are runners, not places to keep tools current;
oppy had yajna 0.19.0 from its system configuration when the laptop had 0.22.0.

## Decision

- **The laptop drives.** `--on <host>` makes and reuses the worktree on that machine with
  git over ssh (in `~/.cache/yajna/runs/<hash>/` there, from the checkout named in
  `.yajna/hosts.toml`, after a `git fetch`), streams the run's page and directory over as
  a tar archive read from this repository's git, and runs `nix develop <flake> -c …` there.
  What yajna decides from history (the commit, the flake at that commit, the script and
  directories that did not exist then) it decides here.
- **`run reproduce --on` writes the new run here**: its page, its logs (captured from the
  ssh session) and the outputs in the repository, copied back as a tar stream. Outputs
  under an `env` root stay there and are hashed there; `--out-root` names a path on that
  machine.
- **`run clean --on <host>`** removes the worktrees there.
- The other machine needs ssh, git, tar, sh, `sha256sum` or `shasum` for outputs outside
  the repository, and Nix for a project with a flake; not yajna.

## Consequences

- No version of yajna to keep in step on runners; the laptop's yajna reads the pages it
  wrote.
- A reproduction on a runner is committed with the rest of the laptop's work.
- The commit must be pushed where the runner's checkout fetches from; yajna says so when it
  is not there.
- Shell quoting of every remote command is yajna's job, tested with an ssh that runs the
  command locally against a second clone.
