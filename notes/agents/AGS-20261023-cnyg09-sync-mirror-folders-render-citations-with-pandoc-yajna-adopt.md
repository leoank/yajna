---
id: AGS-20261023-cnyg09
type: agent_session
schema_version: 1
title: "Sync: mirror folders, render citations with pandoc; yajna adopt"
model: claude-opus-5-5
harness: claude-code
started: 2026-10-23T12:32+01:00
finished: 2026-10-23T12:47+01:00
created_entities: [EXP-20261023-cy5j5f]
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank asked for synced docs to keep the folder structure (everything under notes/ with
notes/ stripped, docs directories at their repo path), citation rendering (ank expected
pandoc), and an adopt command that works for every page type, then the ADRs, architecture,
project page and user guide.

## What happened
- Folder mirroring: a root folder named after the namespace (or `[sync] folder`), folders
  found by appProperties so clones agree, docs moved when pages move. Fake Drive gained
  folders, the query and moves.
- Citations: sync did not use pandoc before; now a citing page goes through
  `pandoc --citeproc`. A page's own `bibliography` field counts for validate and sync.
  pandoc is optional (skipped with a reason without it) and is in the dev shell and the
  test inputs, not in the package, to keep the binary's closure small.
- `yajna adopt`: any type and kind; docs stay put, others move; own frontmatter kept,
  clashing keys refused; same-named .bib becomes the bibliography. Dry run checked on the
  real g2a proposal without changing anything.
- ADR-0024, ADR-0025, architecture 5.8, conventions, skill (plugin 0.7.2), guide.
- Deferred: [[EXP-20261023-cy5j5f]] against the real Drive.
