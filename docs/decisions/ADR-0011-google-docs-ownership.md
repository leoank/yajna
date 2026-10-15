# ADR-0011: Synced Google Docs are owned by the personal Google account

Status: accepted
Date: 2026-10-15
Phase: 1b
Source: `docs/architecture.md` sections 5.8 and 12

## Context

Published pages become Google Docs whose IDs persist, so the owning account must be chosen
before the first publish. The institutional account ties the docs to the institution; a lab
shared drive needs admin approval.

## Decision

The author's personal Google account owns the synced docs. Docs are shared with the PI and
lab members individually, or through a folder shared from that account. Credentials for
`yajna sync` are an OAuth token for that account, kept in `neusis` secrets.

## Consequences

- The docs survive a change of institution.
- If the lab later needs the docs in a shared drive, ownership transfer or re-publishing
  under new IDs is the migration; the repo's `doc_id` fields are the only thing to update.
