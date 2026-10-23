---
id: AGS-20261023-gdwq7y
type: agent_session
schema_version: 1
title: "Fix mirror sync: a pull thrown away blocked the next pull and unguarded the publish"
model: claude-opus-5-5
harness: claude-code
started: 2026-10-23T15:57+01:00
finished: 2026-10-23T15:57+01:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank pulled edits from the g2a meeting doc, reverted them with git, and a second
`yajna sync pull` said there was nothing to pull although the doc still had them.

## What happened
- Cause: a pull recorded the revision it reached as `yajna_pulled`; the next pull and
  the publish guard trusted it. The guard would also have let the next `yajna sync`
  overwrite the doc's edits.
- Fix: pull always compares the doc with the published revision and says when its edits
  are already in the page. The guard works the doc's edits out and refuses when a line
  the doc changed is still as published in the page, or when a line changed on both
  sides was never shown by a pull; `yajna_pulled` now holds the hash of the export a pull
  read. `merge3` reports changes that came from the doc alone.
- The integration test covers the revert, the re-pull and an unpulled overlap. Docs:
  ADR-0026, architecture 5.8, guide, conventions; yajna 0.4.1; a lesson on the project
  page.
