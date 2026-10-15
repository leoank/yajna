# ADR-0006: Tasks are markdown checkboxes

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 5.7

## Context

A git-native tracker (`beads`) was tried and did not work well enough. External trackers
are a second source of truth.

## Decision

A task is a markdown checkbox on any page: a run sheet step, an experiment plan, a material
that needs reordering. Loose todos go in `lab/tasks.md`. The indexer collects open
checkboxes; `yajna tasks` lists them. Dependencies are expressed by ordering within a page.

## Consequences

- Tasks live next to the thing they are about, so context is never lost.
- Addressing is page plus section plus position. Good enough because checklists are
  short-lived; not suitable for a long-lived backlog, which is fine.
