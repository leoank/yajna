# ADR-0010: A plain exporter satisfies the ELN requirement

Status: accepted
Date: 2026-10-15
Phase: 1
Source: `docs/architecture.md` sections 5.5 and 12

## Context

An institutional ELN may be required for record keeping. Making it the source of truth
violates ADR-0001. The requirement is for records to exist there, not for them to be
authored there.

## Decision

Build a one-way exporter, `yajna export`, and nothing more. It renders a chosen set of
pages (by default every page changed since the last export) to a dated, read-only bundle
stamped with the git commit it came from, and pushes or uploads that bundle to the ELN. The
output format (PDF, HTML, or the ELN's own import format) is chosen when the target ELN is
named; the exporter is structured so that choice is one renderer.

Explicitly not built: incremental sync, pulling edits or comments back, mapping entities to
ELN objects, or any state in the ELN that the repo depends on.

## Consequences

- The ELN is an archive of snapshots. Nobody edits there.
- The exporter lands at the start of Phase 1, not later, so that the first real records are
  covered.
- Built on 2026-10-19 as `yajna export` with an HTML bundle (pages, sources, manifest,
  SHA-256 sums, `.tar.gz`) and `notes/exports.tsv` as the record of exports. The target
  ELN is still unnamed, so upload is by hand and the ELN-specific renderer is not written.
