---
id: AGS-20261103-m9qrg6
type: agent_session
schema_version: 1
title: Worktree directories in a project repo; how Progress could scale
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-03T18:20+00:00
finished: 2026-11-03T18:28+00:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-11-03
author: agent:claude
---

## Task
Fix `yajna worktree` nesting its directory under the namespace in a project repo, and
propose alternatives to the Progress checklist for long-running projects.

## What happened
- `parallel.rs`: in a project repo the worktree directory is named by the topic alone
  (`<container>/<topic>`, `<repo>-<topic>`); a test in the bare layout, which fails on the
  old code with `toy/aero-map`. Help and the parallel-work guide updated. 0.24.1.
- Progress: measured (this project 59 items, 44 done, 7 KB; manthan's projects 0 to 6) and
  wrote the alternatives up for ank to choose from; nothing built.
- Nothing committed. REV-20261103-j9yfse is still open, so this fix is not under a review
  yet: the skill asks for the open one to be finished before the next is opened.
- After ank approved REV-20261103-j9yfse, committed as e0fa2ca and pushed.
