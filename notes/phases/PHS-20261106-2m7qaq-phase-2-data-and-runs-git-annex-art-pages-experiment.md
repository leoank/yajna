---
id: PHS-20261106-2m7qaq
type: phase
schema_version: 1
title: "Phase 2: data and runs (Xet-format stores, ART pages, experiment and autoresearch commands)"
project: PRJ-0001
status: active
since: 0bf15b5e2e8c0f9accc1e8d32ecbb0761c977e1c
until: null               # the commit it finished at: yajna phase done
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Large data and run outputs stay out of git but reachable from the pages that describe them:
stored once however many versions, runs and notebooks share their bytes, in Xet-format
stores on this machine and others, with enough copies to be safe (`docs/data.md`,
ADR-0035). Experiments and autoresearch loops are driven from the CLI and leave every run in
the notebook.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] Designed: Xet-format data stores, `docs/data.md` (ADR-0035, supersedes ADR-0013's git-annex)
- [x] Step 1: `tools/yajna-xet`, the format byte-exact with xet-core ([[EXP-20261106-3t3nn2]], [[RUN-20261106-4a78zt]]: 88 of 88 fields identical) (b9d6117)
- [ ] Step 2: dedup and speed on checkpoints, imaging, tables and synthetic data ([[EXP-20261106-3t40bg]])
- [ ] Step 3: directory stores, `local`, `[stores]` and `[data]`; `data add`, `get`, `status`; `ART` fields
- [ ] Step 4: ssh stores, `data push` and `pull` ([[EXP-20261106-3t4cyw]])
- [ ] Step 5: `copies`, `data drop`, `data free`
- [ ] Step 6: bundles: an instrument folder as one `ART`, `--only`
- [ ] Step 7: run outputs in the store, `data get RUN-…`, `--art` conversion of `store: path` pages
- [ ] Step 8: `data check --staged` and the `validate` warning for large tracked files
- [ ] `experiment` and `autoresearch` commands that write `EXP`/`RUN` pages and `results.tsv`
- [ ] Verified: from a fresh clone, an imaging session and a training run's checkpoints materialize from the lab store with matching sha256, and the checkpoints take measurably less space than whole copies

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
