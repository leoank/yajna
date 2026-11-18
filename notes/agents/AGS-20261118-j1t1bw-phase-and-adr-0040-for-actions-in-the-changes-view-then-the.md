---
id: AGS-20261118-j1t1bw
type: agent_session
schema_version: 1
title: Phase and ADR-0040 for actions in the changes view, then the git write API
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-18T16:26+00:00
finished: null
created_entities: [PHS-20261118-j1skx5, PHS-20261118-k4kfg6]
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
- Committed it (cdc2dd7, d2a5689). Its first flake check failed on the socket test
  again, which now said why: "a server already answers there" on a socket the test had
  just closed. A `git` child forked by a parallel test held the listener until its exec;
  the test now waits until nothing answers.
- ank asked for the buttons and, with them, one modern app for the project pages and the
  files (worktree picker on the pages too, slow networks, ovis as inspiration). Asked:
  ank chose React rather than Next.js, `yajna site` kept for publishing, the buttons in the
  new app. Wrote ADR-0041 and [[PHS-20261118-k4kfg6]]. Decided without asking, and said in
  the ADR: esbuild bundles the app (Vite's rollup needs per-platform packages the Nix
  build would fetch), and a small router of the app's own instead of TanStack Router.
- Built the JSON API of pages (`tools/yajna-serve/src/pages.rs`, `ServedPages` in
  `site.rs`), the app in `tools/yajna-serve/web/` (shell, overview, pages, lists, log,
  tasks, reviews, changes with stage, unstage and commit, files with a lazy code view),
  `nix run .#web` and its bundle check; the app at `/`, the static pages at `/<ID>.html`,
  the classic viewer at `/classic/`; `--review` prints the app's root with the token.
  `dir_router` keeps nothing at `/` (ank's test), and the app hides the notebook's
  sections there. Tests: the pages API and the app's routes in `tests/cli.rs`, the serve
  tests updated. Tried in a browser against manthan and a scratch notebook, which found
  the closed drawer's shadow showing on a phone and the hunk buttons looking disabled.
  0.38.0.
- Committed and pushed it (2be9387, e8a35c5). Then comments on a diff: asked how to
  anchor lines not committed yet and what to do with no review; ank chose an `@ work`
  anchor and a branch review opened when there is none (on main, ask). Built it in
  `review.rs` (parse, `comment --commit work`, `review update`, validate), the Neovim
  plugin, `Reviews::open_branch` and `POST /api/reviews`, and the app's line picking and
  comment box. Found while trying it: a fresh branch could not be reviewed (now it can, the
  base cannot) and validate took `work` for a missing commit. 0.39.0.
- Committed and pushed it (a480949, ff99eaa). Then the reviews in the app
  (`web/src/review.tsx`, `linediff.ts`): overview, threads, files with rounds, fixes and
  work not in the review yet, a one-column diff with threads at their lines, and the
  writes. Tried against REV-20261106-3rsd58 and the scratch review; the classic viewer
  stays until live following of a file is in the app. 0.40.0.
