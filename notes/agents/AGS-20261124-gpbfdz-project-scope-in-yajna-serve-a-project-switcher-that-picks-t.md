---
id: AGS-20261124-gpbfdz
type: agent_session
schema_version: 1
title: "Project scope in yajna serve: a project switcher that picks the worktree and filters the app"
model: claude-opus-5-5
harness: claude-code
started: 2026-11-24T15:11+00:00
finished: 2026-11-24T15:45+00:00
created_entities: [PHS-20261124-gpczmk, EXP-20261124-gq45yv, RUN-20261124-gq7sd5]
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-11-24
author: agent:claude
---

## Task
ank, 2026-11-24: in manthan, seeing another project's files means picking its worktree
first; make that better, and add a project selector that filters experiments, runs, log
and the rest to one project. Think about the journeys and improve the design. ank's
choices after the proposal: `/project/<slug>/` addresses; log lines filtered by project
best-effort but conservatively, an ambiguous line shown only under *All projects*; build
everything proposed as a new phase ([[PHS-20261124-gpczmk]], ADR-0043).

## What happened
- Found why it hurt: manthan's projects live on `<slug>/main` branches 39 to 68 commits
  ahead of `main`, so `main`'s view of a project is old, and the worktree is the detail
  that says where the project is. Proposed a project-first design; ank chose the address
  and the conservative log rule.
- Checked the assumption the merged views rest on first: [[EXP-20261124-gq45yv]] /
  [[RUN-20261124-gq7sd5]], warm index opens of the six worktrees in 268 ms with process
  starts, so no cache (draft conclusion, `review: pending`).
- ADR-0043 and [[PHS-20261124-gpczmk]]. Built in 0.46.0: membership in the CLI
  (`scope.rs`); `/api/projects` and `/project/<slug>/` in yajna-serve (`projects.rs`), a
  router per worktree and project; scoped overview, lists, log, tasks and search; *All
  projects* merging each project's card and lines from its own worktree; the app's scope
  switcher, a project's home with *Needs you*, folders in Files, banners on old copies,
  scoped changes, reviews and search.
- Test `serve_scopes_the_app_to_a_project_from_its_own_worktree`; tried in a browser
  against manthan, read-only, at 1360 and 390 px.
