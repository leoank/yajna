---
id: PHS-20261106-2m7qbd
type: phase
schema_version: 1
title: "From anywhere: todos and log lines into any notebook"
project: PRJ-0001
status: done
since: null               # the commit it started at: yajna phase start
until: 49110661b93aa8fbb35c3f743a8f459a6862fea1
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Add a todo or a log line to any notebook on the machine from wherever the shell is (ADR-0032).

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] Designed: todos and log lines into any notebook on the machine, `docs/from-anywhere.md` (ADR-0032)
- [x] The per-user config and state registry, `yajna repos`, `--in` and `--pick`
- [x] `log --in` and the one-file commit into another repo
- [x] `yajna todo` with `due:` and `p:`, `tasks --in`/`--all`, `todo done`
- [x] `-e`, and graduation moving a project's todos

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
