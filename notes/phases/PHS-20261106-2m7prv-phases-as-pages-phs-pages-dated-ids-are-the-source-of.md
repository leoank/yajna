---
id: PHS-20261106-2m7prv
type: phase
schema_version: 1
title: Phases as pages
project: PRJ-0001
status: active
since: e0fa2caad480d4f8c1f3d50424a11e604f3f798d
until: null               # the commit it finished at: yajna phase done
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Keep a project page short however long the project runs: each phase a `PHS` page with its goal, checklist, notes and the commits it spans, the project's *Progress* one line per phase (ADR-0034).

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] `PHS` pages, `yajna new phase`, `phase start`, `done` and `migrate`, `review open PHS-…` (ADR-0034, 0.25.0) (since e0fa2ca)
- [ ] This repo's *Progress* migrated, and its phases' titles, groups and goals settled with ank
- [ ] rc2s2, manthan's PRJ-0005 and neusis migrated with their authors

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
