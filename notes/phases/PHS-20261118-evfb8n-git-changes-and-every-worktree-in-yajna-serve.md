---
id: PHS-20261118-evfb8n
type: phase
schema_version: 1
title: Git changes and every worktree in yajna serve
project: PRJ-0001
status: active
since: 72215c51da42b735cfc0df3fdf3f2d6f5f36b46a
until: null               # the commit it finished at: yajna phase done
created: 2026-11-18
author: agent:claude
tags: []
---

## Goal
ADR-0038 and ADR-0039, accepted by ank on 2026-11-18: `yajna serve` shows what is
uncommitted, staged and recently committed in a worktree, through a read-only git API in
`yajna-serve` and a phone-first changes view, and serves every worktree of a notebook
under `/w/<branch>/`, listed by `/api/worktrees`. saarthi's node embeds the same crate to
show a session's changes on the phone (its PHS-20261117-f22kxe, item 10), so the crate
stays notebook-free. Done when ank reads an agent's uncommitted work in another worktree
of manthan from the phone, through saarthi, file by file.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] The git API in `yajna-serve` (ADR-0038): `/api/git/status`, `log`, `diff` and `file`, read-only through the `git` CLI, paths through the files API's rules, a worktree found from the path (0.34.0)
- [x] Every worktree (ADR-0039): `git worktree list` re-read when a few seconds old, each served under `/w/<branch>/` (and `/n/<namespace>/w/<branch>/`), opened on its first request through a callback to the CLI, `/` unchanged (0.35.0; manthan's six worktrees served from its main)
- [x] `/api/worktrees`, and the same per notebook in `/api/notebooks`: name, branch, path, head, whether served here, counts of changed, staged and untracked files
- [x] `[serve] worktrees = "this" | "all"` in `yajna.toml`, `"all"` the default, checked by `yajna validate`; the guide's configuration reference
- [x] The changes view (ADR-0038): `/files/changes?path=`, worktrees with their uncommitted counts, then a worktree's unstaged, staged and untracked files and its commits, each opening a one-column unified diff and the file in the existing viewers; phone-first (0.36.0; tried at phone and desktop size against manthan)
- [x] The changes view as a panel in the workbench, and a worktree picker in the files viewer (the `changes:` tab from *Changes* in the sidebar, with the uncommitted count)
- [x] The crate mountable on a bare directory with no notebook, as saarthi's node will: a test that builds the git routes alone (`yajna_serve::git::router(roots)`, the crate's git tests)
- [ ] Verified: ank reads an agent's uncommitted work in a manthan worktree from the phone through saarthi

## Notes
- Read-only for now: staging, committing and comments that become prompts to a session
  come later, behind ADR-0028's write rules and on review threads (ADR-0038).
- Each change in a status or log carries `rel` (below the worktree) and `path` (the files
  API's path under the root that shows it most closely, `null` when none does), so the
  view can open what a root shows and still list the rest, such as `site/` in a lab.
- A path to a deleted file is resolved through its directory, and never past what a root
  excludes (`.git`, `/notes` from a project's repo root): a test found the first version
  of that fallback reaching `repo/.git`.
- A worktree's site renders on its first request: 12.6 s for g2a's in a debug build against
  manthan, where `/api/worktrees` with counts for six worktrees took 0.18 s. Rendering
  every worktree in the background from the start, as `--socket` does for notebooks, is an
  option if that wait matters on the phone.
- The layout a viewer saves is keyed by the notebook, so a worktree's viewer
  (`w/<branch>/files/`) restores the tabs last open in any of them, showing its own
  versions of those files.
- `tests::the_socket_is_the_owners_and_not_taken_twice` (from 0.31.0) failed once in the
  Nix sandbox, its server thread stopping before it was ready, and passed on the rerun and
  in 50 local runs; it now reports why the server stopped, for the next time.
- Order: the git API first (the view and saarthi both need it), then worktrees, then the
  view, so each step is usable on its own.
