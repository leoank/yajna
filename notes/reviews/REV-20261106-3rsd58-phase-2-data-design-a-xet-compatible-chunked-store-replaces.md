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
head: 0bf15b5e2e8c0f9accc1e8d32ecbb0761c977e1c
paths: []
about: [PRJ-0001, PHS-20261106-2m7qaq, EXP-20261106-3t3nn2, EXP-20261106-3t40bg, EXP-20261106-3t4cyw]
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

## Threads
