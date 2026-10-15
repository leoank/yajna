# ADR-0001: Markdown is the write model

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 2

## Context

The notebook must outlive any tool, be readable by humans and agents without a server, and
survive a decade of schema churn. Database-first ELNs own the data and fail all three.

## Decision

Every fact the system knows is recoverable from markdown files in this repo plus the data
files they reference. Every writer (editor, CLI, server, agent) ends up producing a markdown
change committed to git. Indexes, search databases, embeddings and the static site are
derived caches that are never committed and never hand-edited.

Non-markdown formats are allowed for exactly four things: binary instrument and model
outputs (content-addressed, outside git history), high-frequency telemetry as JSONL or
Parquet, naturally tabular data as CSV or TSV, and disposable derived indexes.

The one exception is a page marked `sync: import`, where a Google Doc is the truth and the
markdown copy is derived. The exception is per page and visible in frontmatter.

## Consequences

- There is one write path, so offline edits, history and agent review come free with git.
- No feature may require a database to be correct. If a derived store is lost it is rebuilt.
- Anything that cannot be expressed in markdown plus the four formats above needs a new
  decision record before it is used.
