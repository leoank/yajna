---
id: REV-20261118-gdmj5b
type: review
schema_version: 1
title: PHS-20261118-evfb8n Git changes and every worktree in yajna serve
project: PRJ-0001
target:
  kind: phase               # branch | range | page | run | experiment | phase
  ref: PHS-20261118-evfb8n
base: 72215c51da42b735cfc0df3fdf3f2d6f5f36b46a
head: b327d376ad1884930f1e5ff2d76acebcd3682e3f
paths: []
about: [PRJ-0001]             # the pages it is about: experiments, runs, a project
status: open              # open | changes_requested | approved | merged | closed
created: 2026-11-18
author: agent:claude
---

## Summary
ADR-0038 and ADR-0039, which you accepted, built in three steps under
[[PHS-20261118-evfb8n]]: `yajna serve` says what is uncommitted, staged and committed in a
worktree, serves every worktree of a notebook, and shows both in a view made for a phone.
Seven of the phase's eight items are ticked; the eighth is you reading an agent's work in a
manthan worktree from the phone through saarthi.

**Where to look:**
- 71e6bb7 (0.34.0), the git API: `tools/yajna-serve/src/git.rs`, `/api/git/status`,
  `log`, `diff` and `file`, read-only through the `git` CLI with optional locks off;
  `git::router(roots)` serves them with no notebook, for saarthi's node. Tests in the
  module on a scratch repository with every kind of change, and
  `serve_git_api_says_what_is_changed_staged_and_committed` in `tools/yajna/tests/cli.rs`.
- f2e6c26 (0.35.0), every worktree: `tools/yajna-serve/src/worktrees.rs` (the listing,
  `/w/<branch>/` dispatch, `/api/worktrees`), the `Open` callback in
  `tools/yajna/src/serve.rs`, `[serve] worktrees` in `vault.rs`; the per-notebook list in
  `/api/notebooks` in `lib.rs`. Tests: `worktrees::tests`,
  `worktrees_listed_per_notebook_and_served_under_the_namespace`, and
  `serve_serves_every_worktree_under_its_branch` with a worktree added and removed.
- 06c6d85 (0.36.0), the changes view: `tools/yajna-serve/ui/src/changes.ts`, the
  `/files/changes` route, the *Changes* entry and worktree picker in `main.ts`, the
  `changes:` tab in `workbench.ts`, `yc-` styles. No automated tests, as for the rest of
  the UI; tried in a browser at 390 and 1280 px against manthan.
- Docs: `docs/files-viewer.md` 5.2 (the routes), 6.4 (the view) and 7, the guide's
  *Files* (*Git changes*, *Every worktree*) and `[serve]` in the configuration reference.

**Worth a second look:** each change carries `rel` (below the worktree) and `path` (where
a root shows it, or `null`), and only the second opens; diff points are only `HEAD`,
`INDEX`, `WORK` or a hex commit with an optional `^`, so nothing reaches git as an option;
a deleted file's path is resolved through its directory but never past an exclusion (a
test caught the first version reaching `repo/.git`); a worktree's server writes to reviews
by the served one's rules; the first request for a worktree's site renders it (12.6 s for
g2a in a debug build), where rendering them all at start is the alternative; the layout a
viewer saves is shared by all worktrees of the notebook.

**Also in it:** your socket test from 0.31.0 failed once in the Nix sandbox and passed on
the rerun; it now says why its server stopped (in f2e6c26).

## Threads
