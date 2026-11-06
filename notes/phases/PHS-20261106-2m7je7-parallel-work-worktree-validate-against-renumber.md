---
id: PHS-20261106-2m7je7
type: phase
schema_version: 1
title: "Parallel work: worktrees, validate --against, renumber"
project: PRJ-0001
status: done
since: null               # the commit it started at: yajna phase start
until: 9fa74fef99ff2c936e53838aec70537bc04384e6
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Several agents and people work on one notebook at once, each in a worktree, without colliding on IDs or leaving old ones behind.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] `worktree`, `validate --against`, `renumber` (ADR-0021)
- [x] `yajna renumber` also rewrites IDs outside markdown: when manthan renumbered g2a (PRJ-0003 to PRJ-0004) and vesicle-protrusions-and-imaging (PRJ-0004 to PRJ-0005) on 2026-10-23, the IDs in their code (`flake.nix` descriptions, `pyproject.toml`, a Python docstring) were left behind and fixed by hand; it should rewrite them, or at least list the files that still name the old ID
- [x] `yajna worktree` in a project repo names the directory by the topic alone (neusis/<topic>, not neusis/neusis/<topic>) (0.24.1)

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
