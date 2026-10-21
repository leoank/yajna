# ADR-0021: Several agents in parallel git worktrees of one notebook

Status: accepted
Date: 2026-10-19
Phase: 1
Amends: ADR-0004
Source: `docs/conventions.md`, "Working in parallel"

## Context

A lab repo holds many projects, and several agents work at once, each in its own git
worktree on its own branch. Most of the vault already merges cleanly: pages are one
file per entity, the log is one file per day per author, and volume IDs (`RUN`, `ART`,
`AGS`) are a date plus a random suffix. What does not merge is the counter: two branches
that each run `yajna new experiment` both get `EXP-0012`, and the merge leaves two pages
with one ID and a conflict in `counters.yaml`. Shared log files collide too when two
agents use the same author handle, and so do pages two branches both edit.

## Decision

- One agent per worktree, one project per branch, branch named `<project-slug>/<topic>`.
  `yajna worktree PRJ-xxxx <topic>` creates the branch and the worktree (beside the others
  in a bare-repo layout) and writes `.yajna/author` there, `agent:<agent>-<slug>-<topic>`,
  excluded from git, which every command uses as the default author after
  `$YAJNA_AUTHOR`. Log files and pages from different worktrees therefore never share a
  file or an author.
- Curated IDs are allocated on `main` where possible: create the experiments (and any
  protocol, material, equipment or build) there, merge `main` into the branch, then work.
  Shared entities are created and edited on `main` only.
- A branch that did allocate runs `yajna validate --against main` before it is merged:
  a curated ID created on both sides since they diverged is a failure, with the fix
  named. Shared entities created on the branch and unmerged pages on `main` are notes.
- `yajna renumber OLD [NEW]` is the fix, on the branch, before the merge: it renames the
  page (the directory for a project) and its sidecar, rewrites every `[[OLD]]`, frontmatter
  reference and path in the repo's markdown and the vault's scripts, leaves namespaced IDs
  alone, and keeps the counter at or above the new number. It refuses an ID that is on two
  pages, because after a merge the references can no longer be told apart. This is the one
  sanctioned way an ID changes; hand edits stay forbidden.
- `counters.yaml` conflicts resolve to the larger number per prefix; `flake.lock` and the
  root flake's input block are regenerated with `nix flake lock`, never merged by hand.
- Experiments keep counter IDs. Volume-style IDs for experiments
  (`EXP-20261019-k7f3`) would remove the counter entirely but make the IDs people cite
  unreadable; it is the fallback if collisions keep happening despite the above.

## Consequences

- The index and the site are already per worktree (cached by root path, ADR-0019).
- An agent's work is attributable to its worktree from the author alone.
- Renumbering rewrites text across the repo; it is a commit of its own on the branch.
- Since ADR-0022 experiments and analyses take date IDs and no longer collide; the
  allocate-on-main rule now covers only projects and shared entities.
