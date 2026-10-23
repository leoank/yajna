---
id: AGS-20261023-f2x6d4
type: agent_session
schema_version: 1
title: "Design mirror sync: doc edits pulled back as a git diff, merged by hand, published again"
model: claude-opus-5-5
harness: claude-code
started: 2026-10-23T14:44+01:00
finished: 2026-10-23T15:02+01:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank wants a sync mode that pulls edits made in a Google Doc back as a git diff, to resolve
by hand and sync back; the project page and the architecture to describe it. Design only,
nothing built.

## What happened
- Architecture §5.8: `mirror` is redefined from last writer wins with automatic commits to
  pull, resolve, publish. A base stored in Drive per doc (source as published, the export
  right after, the revision), `yajna sync pull` diffing export against export so rendering
  noise cancels, edits carried onto the source block by block, `git merge-file` against
  the repo's page, conflicts left as markers, nothing committed; publish refuses a doc with
  unpulled edits unless `--overwrite`. §8 runs pulls onto a branch on the server.
- [[PRJ-0001]] Progress: mirror and its verification as their own items, `import` apart;
  two open questions on block mapping and export stability. The user guide's note on
  planned modes follows.
- ank asked why a base file in Drive. Redesigned without it: the doc is converted back
  deterministically (header, title and references stripped, links, checkboxes and
  citations undone, pandoc normalising both sides), and the ancestor for the three-way
  merge is the commit the page was published at, recorded in the doc's `appProperties`
  with its revision; mirror pages publish only when committed. The round trip of an
  unedited doc is the first thing to check.
