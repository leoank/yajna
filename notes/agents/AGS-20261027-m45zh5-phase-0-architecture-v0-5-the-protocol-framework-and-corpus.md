---
id: AGS-20261027-m45zh5
type: agent_session
schema_version: 1
title: "Phase 0: architecture v0.5, the protocol framework and corpus, ADRs, the first CLI"
model: "unknown"
harness: "claude-code"
started: 2026-10-15T08:03+01:00
finished: 2026-10-15T23:23+01:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-10-27
author: agent:claude
---

## Task
Phase 0: settle the conventions and build the first CLI.

## What happened
Written afterwards, on 2026-10-27, from the day's log, which itself was partly reconstructed: no session page was opened at the time. `started` and `finished` are the first and last log lines. The model was not recorded.

- `docs/architecture.md` v0.5 (hardware builds, the split ID scheme) and
  `docs/protocol-framework.md` v0.1, later amended with jotted and codified protocols;
  `docs/microfluidic-compiler.md` v0.1.
- A protocol corpus from Europe PMC, PMC, OpenWetWare, BioProt and LAB-Bench
  (`tools/corpus/corpus.py`).
- ADR-0001 to ADR-0015; `schema/` v1, `templates/`, the lab skeleton and the `yajna` CLI;
  the interactive menu.
