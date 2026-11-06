---
id: EXP-20261106-3t3nn2
type: experiment
schema_version: 1
title: "Does tools/yajna-xet reproduce xet-core byte for byte: chunk boundaries, chunk, xorb and file hashes, serialized xorbs and shards?"
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
`docs/data.md` (ADR-0035) implements the Xet format in our own crate, `tools/yajna-xet`,
written from the specification rather than depending on xet-core. Data written by it is only
portable to Hugging Face, Shardline or xet-core if every chunk boundary, hash, xorb and shard
is identical. Is it?

## Hypothesis and predictions
H1: an implementation written from the spec (huggingface.co/docs/xet v1.1.0, cross-read
with `draft-denis-xet`) produces exactly what xet-core 1.8.0 produces. If H1 is true, every
case below matches byte for byte. If false, the first difference names a place where the
spec is ambiguous or wrong (the draft already notes one: `MIN_CHILDREN` against the cut
rule in the Merkle grouping), and we follow xet-core there and record it.

## Plan
1. Build `tools/yajna-xet` step 1: gear table, chunker, chunk/xorb/file/verification
   hashes, the hash string form, xorb and shard serialization and parsing.
2. A throwaway harness in the run's directory (its own Cargo project and flake, not a yajna
   dependency) uses xet-core 1.8.0 to write, for each case, chunk boundaries and hashes,
   the xorb hash and bytes, and the file hash.
3. Cases: an empty file; 1 byte; 8191 and 8192 bytes; 128 KiB of zeros; 300 MB of
   seeded random bytes; that file with 1 byte inserted, 1 MB deleted and 64 KiB
   overwritten at known offsets; Hugging Face's `xet-team/xet-spec-reference-files`
   (a CSV, its xorb and shards with and without footer).
4. Compare; serialized xorbs are compared with the footer's nonce bytes zeroed, as the hash
   excludes them. Write each case's expected values out as test vectors.

## Success criteria
Every case identical, or each difference explained and resolved in our crate. The vectors
are committed as `tools/yajna-xet` tests, so step 3 of `docs/data.md` starts on a
verified format.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
