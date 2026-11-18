---
id: AGS-20261117-fysmdn
type: agent_session
schema_version: 1
title: "Start building the protocol framework: phase page and Phase 0 (core, IR, render)"
model: "claude-opus-5-5"
harness: claude-code
started: 2026-11-17T14:31+00:00
finished: 2026-11-17T15:48+00:00
created_entities: [PHS-20261117-fysmxe, REV-20261117-fysnjm]
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-11-17
author: agent:claude-yajna-protocol-framework
---

## Task
ank asked for a phase page for the protocol framework (`docs/protocol-framework.md`,
`docs/protocol-corpus.md`) and for building to start.

## What happened
- Created [[PHS-20261117-fysmxe]] for the framework's Phase 0 (core and render), listed it
  on the project page, started it, and opened [[REV-20261117-fysnjm]] for the work.
- Decided without asking, following the design doc's own leanings, and wrote them up as
  ADR-0037 with status *proposed* for ank to accept or overturn: Python source with a
  JSON IR every backend reads; our own IR schema (in the package, not `schema/`, which is
  for pages); a small internal unit type instead of `pint`; `xg` for g-force and `g` for
  grams (the design doc's example used `g` for g-force).
- Built `tools/yajna-protocol/` (standard library only): units, resources, parameters,
  the context with about thirty commands, observations, `ctx.decide` and `ctx.when`,
  stable step keys, the IR and its schema, the `expert` renderer, `PRO` page generation
  with `--check`, and the `yajna-protocol ir|render|page` command; the design doc's
  transformation protocol is the worked example with a golden render. 29 tests, run by
  `checks.yajna-protocol` with `jsonschema` for the IR schema test.
- `yajna validate` read the `source:` path `notes/protocols/PRO-0001/protocol.py` as a
  link into a notebook called `protocols`. Made `source` a path field on protocol pages
  only (a material's `source` stays a link), and validate now fails a codified protocol
  whose source is missing; integration test added; CLI 0.33.0.
- Things settled while building: keys from one call over several containers share an
  ordinal and carry the container (`heat_shock.2[T1]`), and keyed calls do not consume
  ordinals, so keys do not move with the number of samples; a plain `if` on an
  observation is allowed but the page says which arm it assumed; arithmetic on a
  measured value is an error for now (`ctx.decide` chooses between known values).
- The session started on Sonnet 5.5; ank switched it to Opus 5.5 partway through.
