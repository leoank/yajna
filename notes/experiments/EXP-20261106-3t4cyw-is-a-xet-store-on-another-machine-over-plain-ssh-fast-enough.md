---
id: EXP-20261106-3t4cyw
type: experiment
schema_version: 1
title: Is a Xet store on another machine over plain ssh fast enough for add, push, get and dedup lookups?
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
`docs/data.md` reaches stores on other machines with plain ssh commands, nothing
installed there. Is that fast enough to push and get tens of gigabytes and to answer dedup
lookups during `data add`, or does it need a helper on the far side?

## Hypothesis and predictions
H1: with one multiplexed ssh connection and batched commands, bulk transfer is bounded by
the network, not by the protocol, and lookups are cheap enough to run during `add`.
Predictions: push and get of 10 GB reach at least 80% of `scp`'s throughput for the same
bytes; existence checks for 16k objects (one eligible chunk every 64 MB of 1 TB) take under
30 s batched, against minutes one by one. If false, `add` consults only `local`'s index and
remote lookups move to `push`, or a `yajna data serve --stdio` helper is reconsidered.

## Plan
1. A store on oppy at a scratch path; the laptop reaches it over the usual ssh config.
2. Push and get 10 GB (checkpoints from [[EXP-20261106-3t40bg]]) through the step 4
   prototype; the same bytes with `scp` and `rsync` as baselines.
3. Existence checks for 1k, 16k and 100k objects one per round trip, batched in one
   remote command, and with `ls` of the fan-out directories.
4. Repeat from the lab network and from home, recording latency.

## Success criteria
Throughputs and lookup times for each case in `results.tsv`, and the choice for
`data add`'s remote lookups written into `docs/data.md` section 4.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
