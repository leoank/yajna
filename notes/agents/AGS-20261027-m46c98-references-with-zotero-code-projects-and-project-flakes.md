---
id: AGS-20261027-m46c98
type: agent_session
schema_version: 1
title: References with Zotero, code projects and project flakes
model: "unknown"
harness: "claude-code"
started: 2026-10-16T10:17+01:00
finished: 2026-10-16T17:25+01:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-10-27
author: agent:claude
---

## Task
References through Zotero, and software projects in the notebook.

## What happened
Written afterwards, on 2026-10-27, from the day's log, which itself was partly reconstructed: no session page was opened at the time. `started` and `finished` are the first and last log lines. The model was not recorded.

- ADR-0016: Zotero with Better BibTeX keys, `references/library.bib` committed, reading
  notes; the `reference` schema and `yajna ref`. Synced and reorganised the library.
- The `code` field on project pages and `yajna new project --code` with a flake and
  README; project flakes as explicit path inputs of the root flake.
