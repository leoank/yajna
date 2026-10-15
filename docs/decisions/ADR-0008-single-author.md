# ADR-0008: One human author plus agents

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 12

## Context

The design assumed one human author and any number of agents. Lab members contributing
would change log file naming (already per author), auth, and the review model.

## Decision

Single human author. Agents write under their own `AGS` session records. Collaboration
with the PI and lab members happens through published Google Docs and their comments
(ADR-0011), not through commits by other people.

## Consequences

- No auth model beyond per-client tokens for the server, and none at all in Phase 0.
- The `author` field stays mandatory so that a second author can be added later without a
  migration; log files already carry the author in their path.
