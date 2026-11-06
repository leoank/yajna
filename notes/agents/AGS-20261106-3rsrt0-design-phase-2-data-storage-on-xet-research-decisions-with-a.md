---
id: AGS-20261106-3rsrt0
type: agent_session
schema_version: 1
title: "Design Phase 2 data storage on Xet: research, decisions with ank, design doc, ADR, phase plan and spikes"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-06T03:26+00:00
finished: null
created_entities: [REV-20261106-3rsd58, EXP-20261106-3t3nn2, EXP-20261106-3t40bg, EXP-20261106-3t4cyw, RUN-20261106-4a78zt, RUN-20261106-4vftn2]
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
- Step 1, at ank's request after committing the design: `tools/yajna-xet` (b9d6117), written
  from the spec and xet-core's source (chunker, hashes, compression and its automatic
  choice, xorbs with and without footer, shards in three layouts, packing files into xorbs,
  rebuilding them), with Hugging Face's small reference files as test fixtures.
  [[RUN-20261106-4a78zt]] put 11 cases through xet-core 1.8.0 and through it: 88 of 88
  fields identical, and our xorb for the reference CSV is byte-identical to theirs. Fixed on
  the way: the shard layout without lookup tables, the sha256's word order (both from the
  reference files). Proposed conclusion for [[EXP-20261106-3t3nn2]]: H1 holds; the format
  is safe to build the stores on.
- Steps 2 and 3, at ank's request with no lab data at hand. Step 2: [[RUN-20261106-4vftn2]]
  measured eight public data sets (564 MB downloaded, pinned by sha256: Pythia-14m
  checkpoints, BERT-tiny fine-tunes, an OME-TIFF time-lapse and MitoCheck, JHU daily CSVs,
  a CSV with rows appended, edited and deleted, synthetic edits). Dedup pays where versions
  share bytes, not for full-training checkpoints or a second sample; LZ4 keeps 32% of
  sparse images where zstd keeps 6%, an open question for ank in `docs/data.md` *Risks*.
- Step 3 (ab4d5e3, 0.26.0): `Packer` deduplicates against stored xorbs through lookups of
  a file's first chunk and the eligible ones; `yajna data add`, `get`, `status`; `local`
  and `[stores]` in the user config. A smoke test on the downloaded data put 194 MB in a
  124 MB store and got everything back with matching sha256. Found and fixed on the way
  (5bee138): every `yajna new artifact` page failed validation, `run: null` and
  `hash: null` against a schema that wanted strings.
