# ADR-0002: Daily journal plus curated entity pages

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 5.1

## Context

A journal alone captures everything but curates nothing. Per-experiment pages alone are too
much friction on a busy bench day and lose the mid-day observations.

## Decision

Both. One log file per day per author under `lab/log/<year>/` captures in time order with no
required fields beyond a timestamp. Entity pages (`EXP`, `RUN`, `PRO` and the rest) hold the
curated state. Log entries link to entities with wikilinks; a derived timeline view inlines
every log entry that mentions an entity.

## Consequences

- Capture is never blocked by structure. Structure is added later by linking.
- Two places to look until the timeline view exists. Phase 0 tolerates that; `qmd` covers
  the search case in the meantime.
