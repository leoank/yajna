---
id: REV-20261106-3rsd58
type: review
schema_version: 1
title: "Phase 2 data design: a Xet-compatible chunked store replaces git-annex"
project: null
target:
  kind: range               # branch | range | page | run | experiment | phase
  ref: HEAD..HEAD
base: 0bf15b5e2e8c0f9accc1e8d32ecbb0761c977e1c
head: ab4d5e3f4d10362d2be39335f03e0a16bd6ea9eb
rounds: [0bf15b5e2e8c0f9accc1e8d32ecbb0761c977e1c, 5098d2d62d9b3a41f45c8cba665ad901044098d0]
paths: []
about: [PRJ-0001, PHS-20261106-2m7qaq, EXP-20261106-3t3nn2, EXP-20261106-3t40bg, EXP-20261106-3t4cyw, RUN-20261106-4a78zt, RUN-20261106-4vftn2]
status: open              # open | changes_requested | approved | merged | closed
created: 2026-11-06
author: agent:claude
---

## Summary
The design for Phase 2's data layer, nothing built: large data lives in Xet-format stores
(content-defined chunks stored once, compressed xorbs, shards), written by our own crate
byte-exact with xet-core; the `ART` page is the pointer; stores are directories on this
machine, a mounted disk or another machine over plain ssh, shared by the notebooks on a
machine, append-only with a `copies` check before a drop. It replaces the git-annex plan.

**Where to look:** `docs/data.md` (section 2 has your decisions, sections 4 to 9 the details
I settled myself), `docs/decisions/ADR-0035-xet-data-store.md`, the Phase 2 page
[[PHS-20261106-2m7qaq]] (goal and the eight steps), and the three experiments the steps rest
on, [[EXP-20261106-3t3nn2]], [[EXP-20261106-3t40bg]] and [[EXP-20261106-3t4cyw]], each
`review: pending`. `architecture.md` 5.3, the roadmap and section 12 point to it.

**Worth a second look:** recipes only in stores means a file is lost if every store
holding its shard is (ADR-0035 *Consequences*); run outputs are recorded with their Xet
hash, not as `ART` pages; the default materialization path `data/<ART id>/<name>`.

**Step 1, added after you asked for it:** `tools/yajna-xet` (b9d6117): the format in about
1,200 lines, our only new dependencies `blake3` and `lz4_flex`. Look at `src/shard.rs`
(the three layouts), `src/file.rs` (`Packer` and `reconstruct`) and `tests/reference.rs`.
[[RUN-20261106-4a78zt]] (5098d2d) is the comparison with xet-core: its harness is a
throwaway Cargo project in the run's directory, and its *Notes* list what the reference
files taught us. `docs/data.md` and AGENTS.md name the crate.

**Steps 2 and 3, added after you asked for them:**
- Step 2, [[RUN-20261106-4vftn2]] (ace0dd0): no lab data, so eight public stand-ins (see its
  *Notes* for the table). Worth your decision: on sparse microscopy images Xet's LZ4 keeps
  32% of the bytes where zstd of the whole file keeps 6%, and the format allows nothing
  else; `docs/data.md` *Risks* lists the options.
- Step 3 (ab4d5e3, 0.26.0): `tools/yajna/src/data.rs` (the store layout, `add`, `get`,
  `status`), `Packer::add_with` and `learn` in `tools/yajna-xet/src/file.rs`, the test
  `data_add_stores_deduplicated_get_rebuilds_and_status_reports_where`, conventions
  *Large files*. Settled by me: `--to` and `[data]` wait for push (step 4); the spec's
  fragmentation rule is not built yet (`docs/data.md` section 3).
- A separate fix (5bee138): `yajna new artifact` pages failed `validate` (`run: null`,
  `hash: null`); the schema allows null now.

## Threads
