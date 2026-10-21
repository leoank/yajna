---
id: AGS-20261021-b5b1fs
type: agent_session
schema_version: 1
title: Date IDs for experiments and analyses, time-sortable suffixes, and migrating the notebooks
model: claude-opus-5-5
harness: claude-code
started: 2026-10-21T11:09+01:00
finished: 2026-10-21T11:11+01:00
created_entities: []
edited_entities: [EXP-20261019-j4xp01, EXP-20261021-as4202]
outcome: done             # done | failed | aborted | pending
created: 2026-10-21
author: agent:claude
---

## Task
Amend ADR-0004 with why IDs are global; move experiments and analyses to date IDs whose
suffix sorts by time; migrate this notebook and every manthan worktree.

## What happened
- Opened late, after the code was written but before any notebook was migrated.
- ADR-0004 amended; ADR-0022 records the scheme: `EXP`/`ANA` date IDs behind
  `experiment_ids = "date"`, a six-character suffix (four for tenths of a second of the UTC
  day, two random) in an ASCII-ordered base 32 for every new date ID, and `yajna
  migrate-ids`, which builds each new ID from the page's first commit plus its old number
  so every worktree migrates identically and keeps `previous_id`.
- This notebook: EXP-0001 and EXP-0002 became [[EXP-20261019-j4xp01]] and
  [[EXP-20261021-as4202]].
- manthan `main` (21 experiments) and `fbr-sim/main` (13) migrated with identical IDs for
  the shared ones; both validate. Comments in rc2s2 source files still name old IDs.
