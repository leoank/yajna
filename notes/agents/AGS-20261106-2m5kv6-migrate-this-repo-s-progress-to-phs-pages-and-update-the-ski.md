---
id: AGS-20261106-2m5kv6
type: agent_session
schema_version: 1
title: Migrate this repo's Progress to PHS pages and update the skill
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-06T02:23+00:00
finished: null
created_entities: [REV-20261106-2m58z0, PHS-20261106-2m7gv6, PHS-20261106-2m7hcr, PHS-20261106-2m7hvb, PHS-20261106-2m7hc6, PHS-20261106-2m7jd5, PHS-20261106-2m7je7, PHS-20261106-2m7kb7, PHS-20261106-2m7kgv, PHS-20261106-2m7ka9, PHS-20261106-2m7mkz, PHS-20261106-2m7m9t, PHS-20261106-2m7nh7, PHS-20261106-2m7nrk, PHS-20261106-2m7prv, PHS-20261106-2m7qbd, PHS-20261106-2m7qaq, PHS-20261106-2m7q13, PHS-20261106-2m7r6j, PHS-20261106-2m7rq5]
edited_entities: [PRJ-0001]
outcome: pending          # done | failed | aborted | pending
created: 2026-11-06
author: agent:claude
---

## Task
Migrate this repo's *Progress* to phase pages (ADR-0034) and bring the skill, the
`/yajna:project` commands, the project templates and AGENTS.md in line with phases, at
ank's request of 2026-11-06. Under [[REV-20261106-2m58z0]].

## What happened
- `yajna phase migrate` (0.25.0) turned 61 items into 22 phases. By hand afterwards:
  three single-item phases folded into the phase they belong to (`renumber` rewriting IDs
  outside markdown and `worktree` in a project repo into *Parallel work*, verifying
  `import benchling` into *Phase 1*), leaving 19; every phase titled for what it is,
  the repeated `Phase 1b:` labels dropped from its items (`Phase 1b verified:` became
  `Verified:`), and each *Goal* drafted from the items, ADRs and design docs. The goals
  and the folds are drafts for ank.
- `since` came only from the `(since …)` tags, so Phase 0, 1, 1b, 1c and 1d are `active`
  without one. ank does not know where they began either, so they stay unset, with a
  note on each page; Phase 0 stays open, the conventions not yet tried properly on
  wet-lab projects.
- The new project templates no longer start *Progress* with an empty `- [ ] `, so the
  first phase's line is the first item.
- The skill (*The plan goes in phases*), `/yajna:project` and `/yajna:code-project`, the
  project templates' *Progress* guidance and AGENTS.md describe phases; 0.25.1.
