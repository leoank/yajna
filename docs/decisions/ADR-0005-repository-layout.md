# ADR-0005: Repository layout

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 4

## Context

One repo holds the notebook, its schemas and tooling, dry-lab code, hardware design sources,
thesis and talks. Each needs a predictable home so that humans, `qmd` and agents can find
things without an index.

## Decision

- `lab/` is the notebook proper, the vault an editor such as Obsidian opens. Inside it:
  `projects/PRJ-*/` with `README.md`, `experiments/`, `runs/`, `analyses/`; shared
  `protocols/`, `materials/`, `equipment/`, `builds/`, `agents/`; `log/<year>/<date>.md`;
  `tasks.md`.
- Experiment-local and run-local small files live in a sidecar directory named after the
  page (`EXP-0007/`, `RUN-20261014-7h2q/`).
- `docs/` holds design documents and `docs/decisions/`; `schema/` the JSON Schemas;
  `templates/` one template per entity; `.claude/` repo-specific agent commands.
- `projects/` holds dry-lab code (see ADR-0009), `hardware/<name>/` design sources,
  `thesis/` and `talks/` their sources, `tools/` the CLI and indexer, `data/` large files
  (see ADR-0013).

## Consequences

- Only `lab/` is the notebook. Everything else is code or documents that pages link to.
- Filenames start with the ID so links never break on a title change.
