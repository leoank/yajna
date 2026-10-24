---
id: AGS-20261024-p446eh
type: agent_session
schema_version: 1
title: "Phase 1c step 4: live updates in the files viewer; EXP-20261023-kjtrwp on the laptop"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-24T21:08+01:00
finished: 2026-10-24T21:16+01:00
created_entities: [RUN-20261024-p44p6z, RUN-20261024-p68f0e]
edited_entities: [PRJ-0001, EXP-20261023-kjtrwp]
outcome: done             # done | failed | aborted | pending
created: 2026-10-24
author: agent:claude
---

## Task
Build step 4 of `docs/files-viewer.md`: the files viewer stays current as runs write.

## What happened
- Server (`yajna-serve/src/live.rs`): `GET /api/events` streams `change` events for the
  paths a page watches. Change is decided by comparing existence, size and mtime with
  what was last sent; notify events (debounced 250 ms), a poll timer for network
  filesystems and `watch = "poll"`, and a 30 s safety check only say when to look. On
  connecting, every path's state is sent. `auto` decides by `statfs` (Linux types, macOS
  `MNT_LOCAL`); `/api/files/roots` reports it as `live`.
- Client: `live.ts` reopens the stream 300 ms after the watched set changes; the text
  viewer appends byte ranges and follows while at the end (logs start there), images
  and markdown redraw in place, other viewers reload; background tabs get a dot, deleted
  files are struck through; the tree merges a changed listing keeping what is expanded;
  the status line says live, polled or not live.
- Tests: an SSE integration test with a notify root and a polled root (initial state,
  growth, a new entry, removal, a missing path); unit tests for the filesystem check and
  snapshots. Checked by hand in a browser with a script acting as a run.
- [[EXP-20261023-kjtrwp]] on the laptop ([[RUN-20261024-p44p6z]]): appends arrive in 264
  ms, but writes through an open handle produced events only at open and close, because
  FSEvents holds them back; open files are now looked at every second
  ([[RUN-20261024-p68f0e]]). A lesson on the project page.
- Found and fixed in the browser: "following" flickered off as CodeMirror measured lines;
  only scrolling by the reader now stops following.
- Decided without asking: one `change` event shape for files and directories, the 300
  ms reconnect delay, a deleted file's tab kept and struck through rather than closed.
