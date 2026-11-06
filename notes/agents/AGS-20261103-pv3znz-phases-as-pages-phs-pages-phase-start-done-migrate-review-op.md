---
id: AGS-20261103-pv3znz
type: agent_session
schema_version: 1
title: "Phases as pages: PHS- pages, phase start/done/migrate, review open PHS"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-03T20:47+00:00
finished: 2026-11-06T02:17+00:00
created_entities: [REV-20261103-pzc5y6]
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-11-03
author: agent:claude
---

## Task
Phases as pages (ADR-0034), with ank's choices of 2026-11-03: a phase is reviewed with
`review open PHS-…` (`PRJ --phase` kept for unmigrated projects), `phase migrate` groups
Progress items by the label before `:`, and a phase page holds Goal, Progress and Notes.

## What happened
- `PHS` pages: schema, template, dated IDs, under the project's `phases/`; `yajna new phase`
  adds the page and its `- [ ] [[PHS-…]]` line on the project's Progress; validation
  requires the description after the link there.
- `phase start PHS-…` and `phase done PHS-…` (`--at` for an earlier commit) set status,
  `since`, `until` and tick the line; `phase start PRJ-… "<words>"` still works unmigrated.
- `review open PHS-…` spans `since`..`until`; `PRJ --phase` on a migrated project resolves
  to the page its line links.
- `phase migrate` (with `--dry-run`): tried read-only on this repo (61 items to 22 phases),
  rc2s2 (6, nested steps becoming each phase's checklist), manthan PRJ-0005 (6) and
  neusis (16). Nothing migrated yet; that is done with ank.
- ADR-0034, review.md, conventions, guides, architecture and the skill updated; 0.25.0.
  Approved by ank in REV-20261103-pzc5y6 on 2026-11-06 and committed as 872895a.
