---
id: AGS-20261118-j1t1bw
type: agent_session
schema_version: 1
title: Phase and ADR-0040 for actions in the changes view, then the git write API
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-18T16:26+00:00
finished: null
created_entities: [PHS-20261118-j1skx5]
edited_entities: []
outcome: pending          # done | failed | aborted | pending
created: 2026-11-18
author: agent:claude
---

## Task
ank: note the `dir_router` added from another session (9712852), then start the next
phase, actions. No phase or ADR named actions existed; asked, ank meant the changes view's
actions that ADR-0038 deferred, and chose: stage, unstage and commit with no discard,
writes on the socket and with `--review`, comments as review threads.

## What happened
- Noted 9712852 in the session's memory (the surface saarthi depends on).
- Wrote ank's choices as ADR-0040 (accepted, amending ADR-0030, 0036 and 0038 on
  committing) and its row; created and started [[PHS-20261118-j1skx5]] with seven items.
- Built the git write API: `/api/git/stage`, `/unstage` and `/commit` in
  `tools/yajna-serve/src/git.rs`, with `hunks` on diffs and `tree` on status as the
  guards; the reviews' write check through a `Writes` state, read-only for `git::router`
  and `dir_router`. Three crate tests (a hunk staged and a changed one refused, whole files
  and a rename unstaged, a commit with a stale tree, an empty message, a refusing hook,
  and the token and Origin rules) and two in `tests/cli.rs` (`serve --review` stages and
  commits; plain `serve` refuses). `docs/files-viewer.md` 5.2. 0.37.0.
