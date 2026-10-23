---
id: EXP-20261023-kjvkas
type: experiment
schema_version: 1
title: Can ank follow an agent's run on a remote machine from the laptop through the files viewer?
project: PRJ-0001
status: planned           # planned | active | paused | concluded | abandoned
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
Can ank follow an agent's run on a remote machine from the laptop through the files
viewer, without opening a shell on that machine to look at anything?

## Hypothesis and predictions
With `yajna serve` on the machine and an SSH tunnel, the run's log, the metrics and plots it
writes and the code it ran are all reachable and stay current, and the gaps found are
missing viewers or polish, not the architecture (`docs/files-viewer.md`). If the session
needs a shell to look at things more than occasionally, the design misses something that
this experiment should name.

## Plan
1. After step 4 is built: `yajna serve` on rogue (or the GPU node in use) from the manthan
   checkout, with a `scratch` root where the run writes; `ssh -L 8765:localhost:8765` from
   the laptop.
2. An agent runs a real training run or an autoresearch loop for an evening.
3. ank watches it from the laptop: the log following, new checkpoints and plots in the
   tree, the code beside them in a split, and the AGS page and log lines on the site.
4. Every time a shell on the machine was opened to look at something, note when and why
   on the RUN page.

## Success criteria
- One full session in which no shell was opened only to look at files.
- The noted reasons, if any, become the next viewers or features on the project page.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
