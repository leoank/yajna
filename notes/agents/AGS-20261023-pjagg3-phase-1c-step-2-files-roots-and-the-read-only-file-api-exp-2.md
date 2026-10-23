---
id: AGS-20261023-pjagg3
type: agent_session
schema_version: 1
title: "Phase 1c step 2: [files] roots and the read-only file API; EXP-20261023-kjtach on the laptop"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-23T21:32+01:00
finished: 2026-10-23T21:40+01:00
created_entities: [RUN-20261023-pjazct, RUN-20261023-pn80r2]
edited_entities: [PRJ-0001, EXP-20261023-kjtach]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
Fix the "a experiment" message, bump neusis and the manthan worktrees to yajna 0.5.2,
then build step 2 of `docs/files-viewer.md`: `[files]` roots in `yajna.toml` and the
read-only file API, with the scale experiment it depends on.

## What happened
- The article fix (2dc3e8b, 0.5.2), pushed; neusis bumped and pushed (fe0cba0, titled
  `chore(yajna)` where its earlier bumps say `chore(flake): bump yajna to`); the four
  manthan worktrees committed, lock and skill separately, not pushed.
- `[files]` in `Config` with `deny_unknown_fields`; `serve::roots` builds the roots
  (defaults per shape, `~` and `$VAR` expansion, an unset variable leaving the root
  missing), and `yajna validate` reports bad names, `watch` values and patterns, which
  also stop `serve` from starting.
- `yajna-serve/src/files.rs`: resolution segment by segment (no `.`, `..` or empty
  segments; excluded names not found; symlinks followed; a directory met twice is a
  loop), sorted listings cached by directory mtime with sizes re-read per page, `stat`
  with text sniffing, `raw` streamed with single ranges, ETag and 304, `nosniff` and
  `CSP: sandbox`. Decided without asking: a leading `/` anchors an exclude pattern, the
  default repo root in a `project` repo excludes `/notes`, mtimes in milliseconds.
- [[EXP-20261023-kjtach]] on the laptop: listings missed the predictions four to five
  times ([[RUN-20261023-pjazct]]); fixed by taking entry types from `readdir` and a cached
  sort key, then 0.3 s at 100 000 and 4 s at a million, where the disk alone takes 3.5 s
  ([[RUN-20261023-pn80r2]]). The experiment stays active for rogue and the cluster; its
  conclusion is ank's. A lesson added to the project page.
- Wrote estimated start and finish times on the run pages, then removed them: they were
  guesses.
