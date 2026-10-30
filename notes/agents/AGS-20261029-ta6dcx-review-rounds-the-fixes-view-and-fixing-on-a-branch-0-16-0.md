---
id: AGS-20261029-ta6dcx
type: agent_session
schema_version: 1
title: Review rounds, the fixes view and fixing on a branch (0.16.0)
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-29T23:57+00:00
finished: 2026-10-30T17:19+00:00
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
- Then, asked by ank: the image viewer's zoom threw the image off screen. panzoom zoomed a
  fixed 15% per wheel event (a trackpad sends dozens per gesture) with no bounds; replaced
  with our own pan and zoom, proportional to the delta, about the pointer, the image kept
  in view; dropped `@panzoom/panzoom` (yajna 0.17.0, ADR-0029 amended).
- Then: a Windows binary in the release (x86_64-pc-windows-msvc, zipped), a Windows build
  job in CI, the files server's symlink-loop check made portable (device and inode on
  Unix, the canonical path on Windows), install docs; yajna 0.18.0 tagged and released.
