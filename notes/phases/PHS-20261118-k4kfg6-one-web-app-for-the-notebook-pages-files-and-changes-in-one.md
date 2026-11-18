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
- [ ] The review diffs in the app (threads at lines, the overview, writes), then the classic viewer and ADR-0029's bundle removed
- [ ] `yajna site` takes the app's colours and type, so a published notebook looks like the app
- [ ] A dark and light setting in the app beside the system's, and a denser layout for desktops
- [ ] Search across the notebook from the sidebar
- [ ] Vite's dev server for working on the app (the bundle stays esbuild's)
- [ ] Verified: ank uses the app from the phone through saarthi and from the laptop for a week of work

## Notes
- Tried in a browser against manthan at 390 and 1360 px: the overview, a project with five
  phases, a long page body, the sidebar and its worktree picker; and in a scratch notebook
  with `--review`, a hunk staged from a diff and committed from the phone layout.
- The overview, a page and the worktree list answer in 0.03 to 0.15 s against manthan
  with a debug build; the first page after start waits on the index.
- `dir_router` (saarthi's node) gets the app's files and changes routes and nothing at
  `/`, as its test asks; the app hides the notebook's sections when there is no notebook.
