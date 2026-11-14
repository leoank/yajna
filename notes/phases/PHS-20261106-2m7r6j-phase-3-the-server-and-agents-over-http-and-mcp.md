---
id: PHS-20261106-2m7r6j
type: phase
schema_version: 1
title: "Phase 3: the server and agents over HTTP and MCP"
project: PRJ-0001
status: planned
since: null               # the commit it started at: yajna phase start
until: null               # the commit it finished at: yajna phase done
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Agents and people reach the notebook over HTTP and MCP, not only through a checkout.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [ ] The server and agents over HTTP and MCP
- [ ] `yajna serve --socket`: one per-user service for every registered notebook, `/api/notebooks` and `/n/<namespace>/` (ADR-0036)
- [ ] A lock on counter IDs, taken by the CLI and the service, with a test of both allocating at once (ADR-0036)
- [ ] The write API over the socket: log lines, todos, new pages, review threads, run-sheet events; appends and new pages only, idempotent by a client's id (ADR-0036)
- [ ] The session id of the agent that made a branch on its `AGS` page, so a review can be sent back to that session from saarthi's app
- [ ] An always-on user service from neusis once run sheets exist (phase 2b; ADR-0036)

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
