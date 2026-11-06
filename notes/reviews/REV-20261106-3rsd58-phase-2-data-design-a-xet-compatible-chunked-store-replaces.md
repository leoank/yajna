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
head: 7ecad1587ad26aa21cddab339d238e67cda0454e
rounds: [0bf15b5e2e8c0f9accc1e8d32ecbb0761c977e1c, 5098d2d62d9b3a41f45c8cba665ad901044098d0, ab4d5e3f4d10362d2be39335f03e0a16bd6ea9eb, 01fbc42e9c37785d6316588332b0496f2f971bb5]
paths: []
about: [PRJ-0001, PHS-20261106-2m7qaq, EXP-20261106-3t3nn2, EXP-20261106-3t40bg, EXP-20261106-3t4cyw, RUN-20261106-4a78zt, RUN-20261106-4vftn2, RUN-20261106-5g081k, RUN-20261106-5z2189]
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

**Step 4 and the zstd option, added after you asked for them:**
- zstd: [[RUN-20261106-5g081k]] (aeaf95b) measured it per chunk first; built as scheme 0x80
  in `tools/yajna-xet/src/compress.rs`, chosen by `[data] compression = "zstd"`, recorded
  in ADR-0035's decision.
- Step 4 (1e6f864, 0.27.0): `Store`, `Backend`, `Op` and `copy` in
  `tools/yajna/src/data.rs` (the ssh side is the `apply`, `exists` and `fetch_into` arms),
  `push`, `pull`, `get` pulling into local; the test
  `data_push_and_pull_reach_a_store_over_ssh_and_zstd_is_an_option`.
- [[RUN-20261106-5z2189]] against oppy, and what it decided in `docs/data.md` (01fbc42).

**Step 5, added after you asked for it:** `data drop`, `data free` and `[data] copies`
(0.28.0). Look at `drop_files`, `lock_write` and `lock_drop` in `tools/yajna/src/data.rs`,
the test `data_drop_keeps_copies_and_shared_xorbs_and_free_keeps_what_no_store_holds`, and
`docs/data.md` section 7. Settled by me: `copies` defaults to 1 (2 would forbid a laptop with
one lab store from ever dropping); writers hold `locks/write-*` so a drop cannot delete a
xorb an add has just deduplicated against, which closes the race section 12 listed; a write
lock older than six hours counts as dead; `free` requires the file unchanged.

## Threads
