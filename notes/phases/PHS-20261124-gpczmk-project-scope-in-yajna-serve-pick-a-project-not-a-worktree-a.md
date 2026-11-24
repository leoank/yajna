---
id: PHS-20261124-gpczmk
type: phase
schema_version: 1
title: "Project scope in yajna serve: pick a project, not a worktree (ADR-0043)"
project: PRJ-0001
status: active
since: 8e59d75c6c45df46a6861d61691bd3f2a58f56ef
until: null               # the commit it finished at: yajna phase done
created: 2026-11-24
author: agent:claude
tags: []
---

## Goal
ADR-0043: in a lab, the app is scoped by project rather than by worktree. Picking a project
shows it from its own worktree, and everything (pages, log, tasks, search, changes,
reviews, files) answers for it; *All projects* reads each project's worktree so it is
current. Done when ank looks at a project's files, log and drafts in manthan without
picking a worktree.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] ADR-0043 from ank's choices (2026-11-24): project first, `/project/<slug>/`, conservative log filtering
- [x] EXP-20261124-gq45yv: opening each project worktree's index per request is fast enough (268 ms for manthan's six)
- [x] Membership: which pages and log lines belong to a project, conservatively (`project`, links, mentions), in the CLI's served pages
- [x] `/project/<slug>/` and `/project/<slug>/w/<branch>/`: a project's home worktree, a router per (worktree, project), `/api/projects` with slugs, folders, worktrees, home and how far ahead
- [x] Scoped APIs: overview, lists (lab-wide types apart), log, tasks, search (with how many more outside)
- [x] The scope switcher in the sidebar: *All projects*, each project with its worktrees, other worktrees; the drawer and the top bar on a phone
- [x] A project's home: the project, its active phase, *Needs you* (drafts, pending review), recent log, open tasks, changes, folders
- [x] Files: a scope opens on the project's folders; *All projects* on each project's folders, each in its own scope
- [x] Changes and reviews in a scope: the project's worktrees and branches only
- [x] *All projects* current: cards, *Recently* and the log merged from each project's home worktree; a page under `main` whose project is ahead says so
- [x] Docs: the guide's files and site pages, `docs/files-viewer.md`; tried in a browser against manthan's worktrees at phone and desktop widths (0.46.0)
- [ ] Verified: ank finds a project's files, log and drafts in manthan without picking a worktree

## Notes
- Tried against manthan (six project worktrees, 39 to 68 commits ahead of `main`) with a
  debug build, read-only, its cache in a scratch directory: the merged overview in about
  110 ms and the merged log in about 140 ms warm; a scope's home in 40 ms. At 390 px the
  scope's home and drawer fit with no sideways scroll once *Needs you* rows put the ID over
  the title.
- In manthan about one log line in six names no page; those stay under *All projects*.
