---
id: AGS-20261023-fvykgk
type: agent_session
schema_version: 1
title: "Build mirror sync: yajna sync pull, the publish guard and the real-Drive check"
model: claude-opus-5-5
harness: claude-code
started: 2026-10-23T15:26+01:00
finished: 2026-10-23T15:26+01:00
created_entities: [EXP-20261023-ftnatx, RUN-20261023-ftnr64]
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank asked to commit the mirror design and start building it.

## What happened
- A probe on the real Drive changed the design before any code: Drive's Markdown export
  drops code, list and heading markup, so a doc never converts back to its source; but
  exports are byte-identical and a past revision exports the same, so the pull compares
  the published revision's export with the current one (ADR-0026, architecture 5.8).
- `mirror.rs`: export cleaning, source blocks, in-order alignment by word similarity,
  word-level patching that keeps words on their lines, conversion back of links,
  checkboxes, escapes and Google's redirect links, and a line merge where neighbouring
  edits both apply (`git merge-file` conflicted on them).
- `sync.rs`: mirror pages publish only committed text and record `yajna_commit`,
  `yajna_rev`, `yajna_export`; the guard and `--overwrite`; `yajna sync pull`; validate
  and sync refuse conflict markers. Tests: 4 unit, one integration test of the whole
  cycle on the fake Drive, which now has revisions and exports.
- [[RUN-20261023-ftnr64]] ran the cycle on the real Drive; it found nothing new after a
  fix for a trimmed `git show` found by the probe.
- [[EXP-20261023-ftnatx]] holds the hand edit for ank, and the question whether Docs merges
  the published revision with the owner's next edits.
- Docs: ADR-0026, architecture 5.8, the user guide's mirror section, conventions, the
  skill (plugin 0.7.4); yajna 0.4.0.
