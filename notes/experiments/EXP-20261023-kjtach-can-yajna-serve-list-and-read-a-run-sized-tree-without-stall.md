---
id: EXP-20261023-kjtach
type: experiment
schema_version: 1
title: Can yajna serve list and read a run-sized tree without stalling?
project: PRJ-0001
status: active            # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-23
author: agent:claude
protocols: []
materials: []
tags: [serve]
review: pending
---

## Question
Can `yajna serve` list a directory of 100 000 to 1 000 000 entries, and read a range from
a file of many gigabytes, fast enough for the files viewer (`docs/files-viewer.md` 5.4),
on the disks where runs write?

## Hypothesis and predictions
Reading, stat-ing and sorting a whole directory before handing out its first page is
cheap enough:

- 100 000 entries: first page in under 300 ms on local NVMe, under 2 s on network storage.
- 1 000 000 entries: first page in under 3 s, server memory under 300 MB with ten such
  listings cached.
- A `Range` read anywhere in a 10 GB file: first byte in under 50 ms locally, whatever the
  file size.

If the first two fail, directories above a threshold are streamed unsorted and without a
stat per entry (kinds resolved on demand), and the design changes before step 2 lands.

## Plan
1. A generator script beside the run page builds a synthetic tree: directories of 1 000,
   100 000 and 1 000 000 empty files, a tree of 50 000 nested directories, a 10 GB file of
   random bytes, symlinks out of the tree and a loop.
2. A bench against the step-2 server (`list` first page, full walk of the pages, `stat`,
   `raw` with ranges at the start, middle and end), with server RSS sampled.
3. Run it on the laptop (APFS), on rogue (local disk), and on the storage runs on the
   cluster write to; one RUN per machine, metrics in `results.tsv`.

## Success criteria
- The numbers above, or the threshold where they stop holding, per filesystem.
- The listing design in `docs/files-viewer.md` 5.4 confirmed or changed on the evidence,
  before step 2 is merged.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

- [[RUN-20261023-pjazct]] the laptop, APFS, baseline: 1.3 s at 100 000 entries and 14.7 s
  at a million, four to five times over; a stat per entry and an allocating sort were to
  blame. Ranges 0.2 ms anywhere in 10 GiB, 1.8 GiB/s streamed.
- [[RUN-20261023-pn80r2]] the laptop after the fix: 329 ms at 100 000, 4.0 s at a million,
  where the disk's own directory read takes 3.5 s; cached pages about 1 ms, memory 192 MB.
  Rogue and the cluster's storage are still to run.

## Conclusion
Written once, by a human, when status becomes `concluded`.
