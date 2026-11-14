---
id: AGS-20261114-rapbdr
type: agent_session
schema_version: 1
title: Record the per-user yajna service on a unix socket that saarthi relays (ADR-0036)
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-14T22:08+00:00
finished: 2026-11-14T22:12+00:00
created_entities: []
edited_entities: [PRJ-0001, PHS-20261106-2m7r6j, PHS-20261106-2m7rq5]
outcome: done
created: 2026-11-14
author: agent:claude
---

## Task
Record yajna's side of the design ank chose on 2026-11-14 from a session in saarthi
([[saarthi/AGS-20261114-rapbh2]]): the phone app is saarthi's, and each machine runs one
per-user `yajna serve` that saarthi relays to.

## What happened
- ADR-0036, amending ADR-0027, ADR-0030 and section 8 of `docs/architecture.md`
  (and its roadmap rows for phases 3 and 4); a line under *Design* on the project page.
- Five items on [[PHS-20261106-2m7r6j]] (the socket service, the counter lock, the write
  API, the session id on `AGS` pages, the user service) and a note on
  [[PHS-20261106-2m7rq5]].
- Found that ID allocation takes no lock today; ADR-0036 adds one for the CLI and the
  service.
- Left alone: the uncommitted changes already in this tree (a review page, `notes/tasks.md`,
  `notes/scratch.md`).
