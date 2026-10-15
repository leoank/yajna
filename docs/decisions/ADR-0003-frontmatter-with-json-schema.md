# ADR-0003: YAML frontmatter validated by JSON Schema

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` sections 5.2 and 10

## Context

Entity pages need typed fields (dates, lists, enums, links). Inline tags are too weak,
sidecar files split the truth, Dataview fields tie the repo to one editor.

## Decision

Entity files carry mandatory YAML frontmatter and a free markdown body. Frontmatter is the
only structured part. One JSON Schema per entity type lives in `schema/`, versioned with
the repo. Every file records `schema_version`; the validator accepts every version it has a
migration for, and migrations are committed scripts that rewrite frontmatter text. Adding a
field is a schema change with a default. Validation failures are build failures.

## Consequences

- Every editor and tool reads the files. `qmd` indexes the frontmatter as is.
- Old files are never silently reinterpreted.
- Schema v1 must land in Phase 0 and includes the protocol step convention and the
  material inventory fields.
