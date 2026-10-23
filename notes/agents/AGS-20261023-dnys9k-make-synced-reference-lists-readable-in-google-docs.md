---
id: AGS-20261023-dnys9k
type: agent_session
schema_version: 1
title: Make synced reference lists readable in Google Docs
model: claude-opus-5-5
harness: claude-code
started: 2026-10-23T13:27+01:00
finished: 2026-10-23T13:27+01:00
created_entities: [RUN-20261023-dk2evd]
edited_entities: [EXP-20261023-cy5j5f]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank synced the g2a proposal and asked for a nicer, easier to read reference list.

## What happened
- Read the g2a doc back: entries ran together, an empty paragraph, raw `<i>` in a title.
- `sync.rs`: Zotero's HTML marks become case-protected LaTeX in a temporary copy of the
  `.bib`; entries get inline spacing, line height and 10pt type; the refs wrapper goes.
- [[RUN-20261023-dk2evd]] confirmed it in a real doc; a hanging indent is not possible
  through Docs' HTML import.
