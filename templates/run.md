---
id: $id
type: run
schema_version: 1
kind: $kind               # bench | compute | assembly | calibration
project: $project
experiment: $experiment
protocols: []
status: planned           # planned | in_progress | done | aborted
created: $created
author: $author
script: $script           # executable that re-creates this run, relative to the repo root
---

## Notes

## Reproduce
Run `script` from the repo root in the project's dev shell at `commit`; it must produce the
same outputs. Note here what it cannot control.

## Checklist
- [ ] 
