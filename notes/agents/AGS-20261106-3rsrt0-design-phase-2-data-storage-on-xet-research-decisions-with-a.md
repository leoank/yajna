---
id: AGS-20261106-3rsrt0
type: agent_session
schema_version: 1
title: "Design Phase 2 data storage on Xet: research, decisions with ank, design doc, ADR, phase plan and spikes"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-06T03:26+00:00
finished: null
created_entities: [REV-20261106-3rsd58, EXP-20261106-3t3nn2, EXP-20261106-3t40bg, EXP-20261106-3t4cyw]
edited_entities: [PRJ-0001, PHS-20261106-2m7qaq]
outcome: pending          # done | failed | aborted | pending
created: 2026-11-06
author: agent:claude
---

## Task
Design Phase 2's data storage on Xet, at ank's request of 2026-11-06: read the 00f.net series
and what it links to, survey xet-core, settle the design with ank, and write it down as a
design document, an ADR, the phase's plan and the spikes it rests on. Nothing is built.
Under [[REV-20261106-3rsd58]].

## What happened
- Read: 00f.net parts 1 and 2, `draft-denis-xet`, Hugging Face's Xet spec (index, API,
  upload, auth, deduplication), Shardline's crate pages. A subagent surveyed xet-core 1.8.0
  from a shallow clone in the scratchpad, read only: five published crates, a filesystem
  CAS (`local://`) and a test HTTP server with no auth, chunking only reachable through
  `xet-data` and its HTTP stack, about 25 API changes in 2026, telemetry on by default.
- ank decided in three rounds of questions (`docs/data.md` section 2): replace git-annex,
  explicit `data get`, directory stores over plain ssh, our own spec-exact crate, recipes
  only in stores, run outputs, large files and instrument folders in scope, stores shared
  per machine, HF interop later, `drop` with a copies check, spikes on all four data kinds.
- Wrote `docs/data.md` and ADR-0035 (proposed; ADR-0013 marked superseded), updated
  `architecture.md` (5.3, the roadmap, section 12, companions) and the guide's design list.
- Phase 2 ([[PHS-20261106-2m7qaq]]) retitled, its goal and an eight-step checklist
  written, started at 0bf15b5; three experiments planned: [[EXP-20261106-3t3nn2]]
  (byte-exactness), [[EXP-20261106-3t40bg]] (dedup and speed), [[EXP-20261106-3t4cyw]]
  (ssh stores), each `review: pending`.
- Details I settled myself, for ank to check: the store layout (`files/` and `chunks/`
  index directories), config in `[stores]` and `[data]`, `data/<ART id>/` as the default
  path, the drop lock, outputs recorded with `xet` beside `sha256` rather than as `ART`
  pages, `data free` for working-tree copies.
