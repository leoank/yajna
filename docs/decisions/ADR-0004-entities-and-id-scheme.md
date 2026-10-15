# ADR-0004: Entity set and ID scheme

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` sections 3 and 13 (v0.5)

## Context

The same notebook records wet-lab and dry-lab work. IDs must be stable across repo splits
and must not collide when several machines or agents create records at once.

## Decision

Entities: `PRJ` project, `EXP` experiment, `RUN` run (kinds `bench`, `compute`, `assembly`,
`calibration`), `PRO` protocol, `MAT` material (one schema with a `kind` field covering
strains, plasmids, datasets, checkpoints and hardware parts), `ART` artifact, `ANA`
analysis, `EQP` equipment, `BLD` build, `AGS` agent session, plus dated log entries and
markdown-checkbox tasks with no ID.

Run is separate from Experiment. Experiments carry `outcome` and `influenced_by` as fields,
not prose.

IDs are global and never reused. Curated entities (`PRJ`, `EXP`, `PRO`, `MAT`, `ANA`, `EQP`,
`BLD`) get counter-allocated four-digit IDs such as `EXP-0007`. Volume entities (`RUN`,
`AGS`, `ART`) get a date plus random suffix such as `RUN-20261014-7h2q`, so concurrent
creation needs no shared counter.

## Consequences

- A project directory can move to its own repo and stay linkable.
- Adding an entity type means a schema, a template, a prefix and an indexer mapping.
  Nothing else changes.
- The four-digit counter is a convenience, not a limit; width can grow without a migration
  because IDs are compared as strings.
