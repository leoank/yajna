---
id: AGS-20261103-ffq8ak
type: agent_session
schema_version: 1
title: "Phase 1e steps 1 and 6: what runs record, run record, the commit rule, graduate remapping commits"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-03T13:45+00:00
finished: 2026-11-03T14:45+00:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-11-03
author: agent:claude
---

## Task
Start implementing the reproduce workflow (`docs/reproduce.md`, ADR-0031): step 1 of its
build order.

## What happened
- Run pages gain `host`, `env`, `outputs`, `origin_commit`, `reproduces` and `verdict` in
  `schema/run.json`; a `commit` may be `unknown`.
- `yajna result` writes the full commit and `host` and takes `--env` and `--outputs`;
  `yajna run record RUN-…` fills the same fields on a run from `yajna new run`.
- `yajna validate` fails a compute run whose commit does not resolve (not checked in a
  shallow clone), `commit: unknown` without a reason under Notes, and a credential-like
  name in `env`. An integration test covers each.
- Docs, guide and skill updated; yajna 0.21.0, plugin 0.16.0. Nothing committed.
- Then step 6, as the author agreed: `graduate` maps the lab commits moved pages name to
  the split commit with the same code tree, keeping `origin_commit`, and `--commits-only`
  does it for a project that has graduated. rc2s2 remapped (11 runs mapped); the 33 runs
  there and 12 in manthan that cannot map are `commit: unknown` with `origin_commit` and a
  note. Both validate; the edits there are uncommitted.
- Committed at the author's request: `.nvim.session` ignored, and their ticks in
  `notes/README.md`.
