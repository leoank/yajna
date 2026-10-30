---
id: AGS-20261029-ta6dcx
type: agent_session
schema_version: 1
title: Review rounds, the fixes view and fixing on a branch (0.16.0)
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-29T23:57+00:00
finished: 2026-10-30T00:05+00:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-10-29
author: agent:claude
---

## Task
ank asked how to review an agent's fixes to a review when a large unrelated feature landed
between the review's head and the fixes. Build the three answers proposed: review rounds,
a view of each fixing commit on its own, and skill guidance to fix a past range on a
branch from its head (yajna 0.16.0, plugin 0.15.0).

## What happened
- Committed and pushed the 0.15.0 fix first (`da44ac3`, `b8eae05`, `99a8f54`).
- `review update` keeps the head it moved from in `rounds:`; `review show --round` diffs
  the last round to the head, and `show` prints the round.
- `review show --fixes` diffs each commit named in an `addressed in` reply against its
  parent in the review's paths, oldest first, leaving out the review page.
- `review comment --at … --commit <sha>` opens a thread on a fix, anchored at it.
- The served review gains `rounds`, `since` and `fixes`; `file` reads between two commits
  only when the review names both. The viewer lists *Since round N* and one *Fix* group per
  commit, draws a fix's threads in its diff and comments there at that commit.
- The skill: one commit per fix where possible; a past range with work after its head is
  fixed on a branch from that head, then `review update --to <branch>`.
- Docs: `review.md` v0.8 section 5.1, conventions, the guide's "Reading only the fixes".
- Decided without asking: a fix's diff is limited to the review's paths like the rest of
  the review; fixes are ordered by commit time; the rounds list holds full SHAs.
