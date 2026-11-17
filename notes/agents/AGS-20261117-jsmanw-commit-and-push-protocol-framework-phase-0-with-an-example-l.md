---
id: AGS-20261117-jsmanw
type: agent_session
schema_version: 1
title: Commit and push protocol framework Phase 0 with an example lab and a guide page
model: claude-opus-5-5
harness: claude-code
started: 2026-11-17T17:06+00:00
finished: 2026-11-17T17:13+00:00
created_entities: []
edited_entities: [PHS-20261117-fysmxe, REV-20261117-fysnjm]
outcome: done             # done | failed | aborted | pending
created: 2026-11-17
author: agent:claude-yajna-protocol-framework
---

## Task
ank, after [[AGS-20261117-fysmdn]]: go with the recommendations (ADR-0037 as proposed,
commits split by concern), commit and push, follow yajna's convention on merging with
`main`, and add an example of the protocol framework and a section of the guide about it.

## What happened
- Merging with `main`: the conventions (`docs/conventions.md`, *Working in parallel*;
  `docs/review.md` section 6) ask a branch to merge `main` in at least daily and before
  allocating IDs, to run `yajna validate --against main` before it goes back, and leave
  the merge into `main` to a human through `yajna review merge` of an approved branch
  review. `main` had not moved since the branch started (both at cad3e8b), so there was
  nothing to merge in; the branch is pushed, not merged.
- [[REV-20261117-fysnjm]] was opened as the range `HEAD..HEAD` because `yajna review open
  <branch>` refuses a branch with no commits of its own. Once the branch had commits its
  target was changed to the branch, so `yajna review merge` can take it into `main`.
- The example is a small lab notebook, `tools/yajna-protocol/examples/lab/`, made with the
  CLI (`yajna init lab`, `yajna new material|equipment|protocol`): a spin-column plasmid
  miniprep as codified PRO-0001 with six materials and two instruments. Decided without
  asking: a new protocol rather than reusing the transformation (which stays the design
  doc's example and the golden test), so the example also shows centrifugation in `xg`, a
  `ctx.when` decision and measurements; the notebook's `yajna.toml` names `ank` as its
  human author; the copy of the skill `yajna init` writes was left out, since it would go
  stale with every version. `spin_column` was added to the labware table for it.
- The guide has a new page, *Protocols as code*, after *Protocols, materials and
  equipment*, which now points to it; `docs/protocol-framework.md` is in the book's design
  section.
- Two gaps the example showed went on [[PHS-20261117-fysmxe]]: paired transfers render one
  step per pair, and `page` does not fill `materials`/`equipment` in the frontmatter.
- Commits: e1cd46c (the validator, 0.33.0), 7d1aa61 (the framework, its example and the
  guide), then the notebook pages. `nix flake check` passed on the tree before committing;
  the branch is pushed to `origin`, and merging it into `main` is left to ank through
  [[REV-20261117-fysnjm]].
