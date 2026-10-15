# ADR-0013: Large data storage

Status: deferred
Date: 2026-10-15
Phase: 2
Source: `docs/architecture.md` sections 5.3 and 12

## Context

Imaging data will be terabytes and must live outside git history, content-addressed, with
several remotes (LMB storage, NFS on a cluster, laptop, possibly S3). The LMB storage
situation is not yet known.

## Decision

Deferred until Phase 2. The leaning is git-annex or something with the same shape:
content-addressed keys recorded in `ART` frontmatter, multiple remotes, partial checkouts,
unlocked files on macOS.

Until then: `ART` pages are written anyway and record a content hash and a path; files
under a few megabytes go in git; larger files stay where the instrument put them, with the
path in the `ART` page.

## Consequences

- Nothing in Phase 0 or 1 depends on the choice. The `ART` schema reserves a `store` field
  so the decision does not need a migration.
- Revisit when the first imaging session needs to be reconstructible from the repo.
