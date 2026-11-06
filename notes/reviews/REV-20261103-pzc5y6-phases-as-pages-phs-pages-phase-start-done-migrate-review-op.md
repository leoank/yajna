---
id: REV-20261103-pzc5y6
type: review
schema_version: 1
title: "Phases as pages: PHS pages, phase start/done/migrate, review open PHS"
project: null
target:
  kind: range               # branch | range | page | run | experiment | phase
  ref: HEAD..HEAD
base: 9fa74fef99ff2c936e53838aec70537bc04384e6
head: 9fa74fef99ff2c936e53838aec70537bc04384e6
paths: []
about: [PRJ-0001]             # the pages it is about: experiments, runs, a project
status: approved          # open | changes_requested | approved | merged | closed
created: 2026-11-03
author: agent:claude
---

## Summary
Phases become `PHS` pages (ADR-0034): the project's *Progress* lists each on one line,
the phase's page holds its goal, its own checklist and notes, and `since`/`until`, which
`phase start` and `phase done` set and `review open PHS-…` spans. `phase migrate`
(`--dry-run` first) turns a flat checklist into phase pages by the label before `:`.

**Where to look:** `tools/yajna/src/phase.rs` (start, done, migrate), `resolve_phase_page`
in `review.rs`, the test `phases_are_pages_migrated_from_progress_started_finished_and_reviewed`,
`docs/decisions/ADR-0034-phases-as-pages.md`, and `docs/guide/src/guides/projects.md`
(*Phases*). Try `yajna phase migrate --dry-run` here or in rc2s2 to see the grouping.

**Not done:** no notebook is migrated yet; that is the next step, together.
- 2026-11-06 02:15 ank approved: Looks good. Approved.

## Threads
