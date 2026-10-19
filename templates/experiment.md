---
id: $id
type: experiment
schema_version: 1
title: $title
project: $project
status: planned           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: $created
author: $author
protocols: []
materials: []
tags: []
---

## Question

## Hypothesis and predictions
If H1 is true we expect ... ; if false we expect ...

## Plan
1. 

## Success criteria

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
