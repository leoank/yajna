---
id: EXP-20261124-gq45yv
type: experiment
schema_version: 1
title: Is opening every project worktree's index on each request fast enough for a merged overview and log in yajna serve?
project: PRJ-0001
status: concluded         # planned | active | paused | concluded | abandoned
outcome: positive         # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-11-24
author: agent:claude
protocols: []
materials: []
tags: [serve]
review: pending
---

## Question
ADR-0043 has the *All projects* overview and log of `yajna serve` read each project's own
worktree, where its current state is, rather than `main`'s copy. That opens the index of
every project worktree on each such request. Is that fast enough to do per request, with no
cache of our own, on manthan's six project worktrees?

## Hypothesis and predictions
H1: once each worktree's index is built, opening it (the mtime walk over the vault that
decides whether to rebuild, then the SQLite open) costs a few tens of milliseconds, so
six of them stay well under the 300 ms a screen may take.

- If true: a warm `yajna tasks` (which opens the index and reads one table) takes under
  60 ms per worktree, process start included, and all six under 300 ms.
- If false: one or more takes over 100 ms warm, and the merge needs a cache keyed by the
  worktree's HEAD and vault mtime, or a background refresh.

## Plan
1. For each manthan worktree with a project branch, and `main`, run `yajna tasks` once to
   build its index, then five times timed; the release `yajna` on PATH.
2. Report the median per worktree and the sum of medians.

## Success criteria
Sum of warm medians under 300 ms: merge per request. Over it: add a cache before building
the merged views.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.
- [[RUN-20261124-gq7sd5]] warm index opens over manthan's six worktrees: 25 to 56 ms each, 268 ms in all with process starts
- [[RUN-20261124-gq7sd5]] compute run, not yet described

## Conclusion
Written when status becomes `concluded`; an agent's draft waits for a human to approve it.

Draft (agent:claude): H1 holds. A warm index open is 25 to 56 ms a worktree with a process
start included, 268 ms for all six, under the 300 ms criterion. The merged *All projects*
overview and log open each project's worktree per request, in parallel, with no cache of
their own; a cache keyed by HEAD and vault mtime is the fallback if a lab with many more
project worktrees makes it slow.
