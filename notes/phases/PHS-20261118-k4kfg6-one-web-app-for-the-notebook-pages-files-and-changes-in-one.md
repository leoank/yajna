---
id: PHS-20261118-k4kfg6
type: phase
schema_version: 1
title: "One web app for the notebook: pages, files and changes in one design (ADR-0041)"
project: PRJ-0001
status: active
since: d2a56895274a2accdeea4c765f2ec0844bb2605d
until: null               # the commit it finished at: yajna phase done
created: 2026-11-18
author: agent:claude
tags: []
---

## Goal
ADR-0041: one app for the notebook in `yajna serve`, the same design for its pages, its
files and its changes, modern and clean, good on a phone through saarthi's relay and on a
desktop, coping with slow networks; the worktree picker on every screen. Done when the
classic viewer is gone (its review diffs moved over) and ank uses the app from the phone
and the laptop without falling back to the old screens.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] ADR-0041: one React app over a JSON API of pages; `yajna site` kept for publishing (ank's choices, 2026-11-18)
- [x] The JSON API of pages: `/api/notebook`, `/api/pages`, `/api/pages/<ID>`, `/api/log`, `/api/tasks`, the CLI's `ServedPages` over the index (0.38.0)
- [x] The app: base from its own address, its own router, TanStack Query with retries and kept data, skeletons, a loading bar and *Reconnecting…*; the shell with the worktree picker, sections, projects and page types; a drawer on a phone
- [x] Screens: overview, any page (a project's phases, experiments and tree, an experiment's runs), a type's list with a filter, log, tasks, reviews, changes with its actions, files (directories, markdown, images, a code view loaded on demand)
- [x] Served at `/` and its routes, the static pages at `/<ID>.html`, the classic viewer at `/classic/`; `nix run .#web` and the bundle check
- [x] The review diffs in the app: overview, threads, changed files, since the last round, each fix, work not in the review yet; a one-column diff with threads at their lines; reply, resolve, reopen, comment on lines (`@ work` on uncommitted ones), approve, request changes (0.40.0)
- [x] Live following of an open file in the app (`/api/events`, appending `Range` reads, logs at their end, text over 4 MB as its last 1 MB), then the classic viewer and ADR-0029's bundle removed (0.41.0)
- [x] `yajna site` takes the app's colours and type, so a published notebook looks like the app; its relative images copied under `media/` on export, from the files API when served (0.42.0)
- [ ] A dark and light setting in the app beside the system's, and a denser layout for desktops
- [ ] Search across the notebook from the sidebar
- [ ] Search within a file, image zoom and splits, if they are missed from the workbench
- [ ] Vite's dev server for working on the app (the bundle stays esbuild's)
- [ ] Verified: ank uses the app from the phone through saarthi and from the laptop for a week of work

## Notes
- Tried in a browser against manthan at 390 and 1360 px: the overview, a project with five
  phases, a long page body, the sidebar and its worktree picker; and in a scratch notebook
  with `--review`, a hunk staged from a diff and committed from the phone layout.
- The overview, a page and the worktree list answer in 0.03 to 0.15 s against manthan
  with a debug build; the first page after start waits on the index.
- The review screen against REV-20261106-3rsd58 (86 files): a 1,835-line new file drawn
  in 0.2 s; the line counts of the app's diff match `git diff --numstat` on the files
  checked. In a scratch notebook, from the phone layout: an `@ work` thread drawn under
  its lines in the uncommitted diff, and a reply written to the page.
- Live following tried on a phone: ten lines appended to a log every half second arrived
  and the view stayed at the end; a 7 MB log opened at its last megabyte and followed.
  Its line numbers counted from the tail, so the tail view has none.
- Not carried over from the workbench: splits and tabs, the hex view, image zoom,
  markdown's source toggle, search within a file. Kept as later items if missed.
- The site restyled, tried against manthan's vesicle project at 1280 px light and 390 px
  dark: no sideways scroll on a phone, the tree's outcome colours from the theme. Images
  in markdown were broken in the app too (relative to the app's URL); fixed in 0.41.3.
- `dir_router` (saarthi's node) gets the app's files and changes routes and nothing at
  `/`, as its test asks; the app hides the notebook's sections when there is no notebook.
