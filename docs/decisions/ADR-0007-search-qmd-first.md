# ADR-0007: Search with qmd first, structured index only when needed

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` sections 5.4 and 12

## Context

`qmd` (full-text, embeddings, scheduled reindex, MCP server) is already deployed by the
`neusis` agent harness. A SQLite index over frontmatter and links was planned for Phase 1,
but it is unclear how many structured questions `qmd` cannot already answer.

## Decision

Point `qmd` at `lab/` in Phase 0 and use nothing else for search. Build the SQLite indexer
only when the first structured query that `qmd` cannot answer shows up, and record that
query in the progress log when it does.

## Consequences

- Zero search code in Phase 0.
- Schema validation, which the indexer was going to own, needs a home of its own in the
  meantime: `yajna validate` runs the JSON Schema checks directly over the files.
- The static site and experiment tree, which render from the index, wait for the indexer.
