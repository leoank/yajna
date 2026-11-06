---
id: EXP-20261106-3t40bg
type: experiment
schema_version: 1
title: How much does Xet chunk-level dedup save, and how fast is it, on model checkpoints, imaging stacks, tables and synthetic edits?
project: PRJ-0001
status: planned           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-11-06
author: agent:claude
protocols: []
materials: []
tags: [data, xet]
review: pending
---

## Question
ADR-0035 makes chunk-level dedup the core of the data strategy. On the lab's real data,
how much space does it save over storing each version whole, and how fast are chunking,
hashing and compression on the laptop and on oppy? Where it saves little, is the store still
worth it for copies and partial fetches?

## Hypothesis and predictions
H1: dedup saves most where versions share bytes, not where they share meaning.
Predictions, stored bytes against the sum of the inputs:
- synthetic edits: original plus at most two chunks (256 KiB) per edit;
- tables: CSV versions with appended or edited rows, under 1.1x of one version; Parquet
  rewrites, little saving, since compression changes every page;
- checkpoints: successive full fine-tuning checkpoints share almost nothing (every weight
  moves); frozen layers, adapters and optimizer-free exports share most; byte grouping
  (BG4) saves 10 to 25% on bf16/fp32 over LZ4 alone;
- imaging: two sessions of different samples share almost nothing; repeated calibration
  or dark frames and unchanged metadata dedup fully.
Throughput: at least 300 MB/s per core for chunk plus hash on the laptop, and ours within
20% of xet-core. If false (dedup well below this on checkpoints or tables), the gain is
safe copies and partial fetches, and the design keeps them but drops dedup-driven features
(remote `chunks/` lookups) from early steps.

## Plan
1. Data, recorded with paths, sizes and sha256 in each run: ten successive checkpoints of
   one training run (rc2s2 or a PRJ-0005 run on oppy); two or three imaging sessions from
   PRJ-0005; a CSV and a Parquet dataset with appended and edited versions; the synthetic
   files from [[EXP-20261106-3t3nn2]].
2. For each set, with our crate and with xet-core: total input, unique chunk bytes, stored
   bytes after compression (LZ4 only and with BG4), xorb count, wall time and MB/s single
   threaded and parallel; on the laptop and on oppy.
3. Baselines: whole-file storage (what git-annex would keep) and `zstd -3` of each file.
4. One row per data set and implementation in `results.tsv`, via `===RESULT===`.

## Success criteria
Numbers for all four kinds, ours against xet-core, and a decision recorded in
`docs/data.md`: whether BG4 is on by default, whether `data add` queries remote `chunks/`
indexes, and what *Risks* says about imaging.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
