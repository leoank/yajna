---
id: PHS-20261118-j1skx5
type: phase
schema_version: 1
title: "Actions in the changes view: stage, commit, and comments that reach the session"
project: PRJ-0001
status: active
since: 9712852e8e490208f9bac0a4448adfc89344fd53
until: null               # the commit it finished at: yajna phase done
created: 2026-11-18
author: agent:claude
tags: []
---

## Goal
ADR-0040: the changes view (ADR-0038) acts on what it shows. From the phone through saarthi
or from the browser with `--review`, ank stages or unstages a file or a hunk, commits what
is staged, and comments on a diff's lines, which becomes a thread on the worktree's review
that saarthi's node turns into a prompt to the session that made the change. Done when ank
reviews an agent's uncommitted work in a manthan worktree from the phone, sends it a
comment, sees the agent's fix arrive, and commits it, without a terminal.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] ADR-0040: stage, unstage and commit, no discard; writes on the socket and with `--review`; comments as review threads (ank's choices, 2026-11-18)
- [x] The git write API in `yajna-serve`: stage and unstage a file or a hunk (named by its header and a hash of its lines, refused with 409 when it changed), commit what is staged with the staged tree as the guard, the reviews' write check (0.37.0)
- [x] Stage, unstage and commit in the changes view: per file and per hunk, a commit form when something is staged, errors from hooks and races shown (in the new app, [[PHS-20261118-k4kfg6]]; 0.38.0)
- [ ] Comments on a diff's lines in the changes view, written as a thread on the worktree's open review, one opened for its branch when there is none
- [ ] An event for each new thread that clients follow (`/api/events` or a feed), its shape agreed with saarthi
- [ ] The guide, `docs/files-viewer.md` and `docs/review.md` on the actions
- [ ] Verified: ank reviews an agent's work in a manthan worktree from the phone, comments, sees the fix, commits it

## Notes
- Follows [[PHS-20261118-evfb8n]] (the read-only git API, every worktree, the changes view)
  and ank's `dir_router` (9712852), which stays read-only here.
- Diffs carry `hunks: [{header, id}]`, the id an FNV-1a hash of the hunk's text; a stage
  or unstage of one reads the same diff again (`INDEX` to `WORK`, or `HEAD` to `INDEX`)
  and applies that hunk with `git apply --cached [--reverse]`. A status carries `tree`,
  `git write-tree`, which a commit must send back.
- Unstaging a whole file is `git reset -q -- <old> <path>`: `git restore --staged` refuses
  a staged rename's old side, which is in neither the index nor the working tree.
- A commit is `git commit -F -` as the machine's git identity, with the hooks; a hook that
  refuses comes back as 422 with what it said, which is where `yajna data check` would
  speak.
