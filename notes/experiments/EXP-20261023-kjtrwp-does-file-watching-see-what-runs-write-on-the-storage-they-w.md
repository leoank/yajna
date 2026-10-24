---
id: EXP-20261023-kjtrwp
type: experiment
schema_version: 1
title: Does file watching see what runs write, on the storage they write to?
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
Do filesystem events reach `yajna serve` for the files runs write, on the filesystems they
write to, and does `watch = "auto"` choose polling exactly where they do not
(`docs/files-viewer.md` 5.5, ADR-0028)?

## Hypothesis and predictions
- On local filesystems (APFS, ext4, tmpfs) notify delivers a change within 100 ms, and the
  250 ms debounce turns a log written a line per millisecond into at most four events a
  second.
- On NFS, Lustre or GPFS, writes made on the same host are seen and writes from a compute
  node are not; `statfs` names those filesystems reliably, so `auto` polls there.
- A realistic session (a dozen open files, a few dozen expanded directories) holds under
  100 inotify watches.

If writes from other hosts do arrive on some network filesystem, `auto` can watch there; if
writes from the same host are missed too, polling is the only option on it.

## Plan
1. A probe built on notify (in the run's directory) watches a directory and prints each
   event with its delay; a writer script appends lines at set rates, creates, renames,
   truncates and deletes files.
2. Writers on the same host and, where the storage is shared, on another node.
3. Filesystems: the laptop's APFS, rogue's local disk, a tmpfs, and the cluster's shared
   storage (ank to name which).
4. Record per filesystem: delivery delay, missed events, `statfs` magic, watch count; one
   RUN per machine.

## Success criteria
- A table of what each filesystem delivers, from which host.
- The `auto` rule in `docs/files-viewer.md` 5.5 confirmed or changed, before step 4 is
  built on it.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

- [[RUN-20261024-p44p6z]] the laptop, APFS: appends arrive in 264 ms through events and
  1.5 s polled, none missed; but a log written through one open handle produced events
  only when opened and closed, so a running job's log would have waited 30 s.
- [[RUN-20261024-p68f0e]] after looking at open files every second: the same log updates
  about once a second, polled appends arrive in 0.5 s. The cluster's storage, from the
  login node and from a compute node, is still to run.

## Conclusion
Written once, by a human, when status becomes `concluded`.
