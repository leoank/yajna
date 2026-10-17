# ADR-0019: The index and the site are caches outside the repo

Status: accepted
Date: 2026-10-17
Phase: 1
Amends: ADR-0007
Source: `docs/architecture.md` sections 5.4, 6 and 11

## Context

ADR-0007 deferred the SQLite indexer until a structured question showed up that `qmd`
could not answer. Two did, both from the phase 1 verification: "everything I did with a
material" (an entity's timeline across pages and log lines) and "all runs of an
experiment ordered by a metric". Both need frontmatter, links and `results.tsv` joined,
which is a database, not a search. The static site and the experiment tree render from
the same tables.

## Decision

- `yajna index` builds one SQLite file with the tables `entity`, `link`, `log_entry`,
  `mention`, `run_result`, `task` and `citation` from a vault that passes `validate`;
  an invalid vault has no index.
- The file lives outside the repo, under `$XDG_CACHE_HOME/yajna/` (or `~/.cache/yajna/`,
  `$YAJNA_CACHE` to override), named by a hash of the repo root. The site goes next to it
  by default (`yajna site --out` elsewhere). Nothing derived needs a `.gitignore` entry
  and nothing derived can be committed by accident.
- Query commands (`show`, `timeline`, `tree`, `runs`, `site`) open the index and rebuild
  it when it is missing, older than any file in the vault, or from another schema
  version. `yajna index` only forces that; no one has to remember to run it.
- The site is plain HTML with inline CSS, one page per entity, the project page carrying
  the AutoGo-style tree as inline SVG (themes are the first tag, outcome is the colour,
  the solid line follows creation order within a theme, dotted lines are
  `influenced_by`). No JavaScript, no build step beyond the binary.
- `yajna tasks` keeps reading the files directly so it works on a vault that does not
  validate yet; the site's tasks page reads the index.

## Consequences

- The schema of the index is versioned by a constant in the binary; changing it costs a
  rebuild, nothing else (architecture section 10, derived layers are rebuilt, never
  migrated).
- A log line's place in a timeline is its `date` and `HH:MM`; pages are placed by
  `finished` (runs) or `created`. A page created after the events it describes sorts
  after them, which is the truth of when it was written.
- The server (phase 3) will serve `timeline`, `tree` and `related` from these tables.
