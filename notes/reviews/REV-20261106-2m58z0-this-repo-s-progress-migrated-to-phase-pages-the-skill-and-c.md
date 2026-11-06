---
id: REV-20261106-2m58z0
type: review
schema_version: 1
title: This repo's Progress migrated to phase pages; the skill and commands describe phases
project: null
target:
  kind: range               # branch | range | page | run | experiment | phase
  ref: HEAD..HEAD
base: 7315c58bdc3f10c4245a90594c3d9260fd31c14f
head: c75bf30b4781f5bf403aaac9752dc64168fe49b2
rounds: [7315c58bdc3f10c4245a90594c3d9260fd31c14f]
paths: []
about: [PRJ-0001, PHS-20261106-2m7prv]
status: approved          # open | changes_requested | approved | merged | closed
created: 2026-11-06
author: agent:claude
---

## Summary
This repo's *Progress* is now 19 phase pages in `notes/phases/`, and the skill, the
`/yajna:project` commands, the project templates and AGENTS.md describe planning in
phases (0.25.1).

**Where to look:** `notes/README.md` *Progress* (the one-line view), then the phase pages:
the titles and *Goal*s are my drafts, written from the items, ADRs and design docs.
Three single-item phases from the migration were folded: `renumber` rewriting IDs
outside markdown and `worktree` in a project repo into *Parallel work*
([[PHS-20261106-2m7je7]]), verifying `import benchling` into *Phase 1*
([[PHS-20261106-2m7hc6]]). Then `plugins/yajna/skills/yajna/SKILL.md` (*The plan goes in
phases*), `plugins/yajna/commands/{project,code-project}.md`, `templates/project*.md`
and `AGENTS.md`.

**Settled with ank on 2026-11-06:** Phase 0, 1, 1b, 1c and 1d stay `active` with no
`since`, since nobody knows where they began; each page says so under *Notes*. Phase 0
stays open: the conventions have not been tried properly on wet-lab projects. The new
project templates no longer start *Progress* with an empty `- [ ] ` (the test of phases
checks it).
- 2026-11-06 03:00 ank approved: Looks good. approved.

## Threads
