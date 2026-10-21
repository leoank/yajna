# ADR-0022: Experiments and analyses take date IDs with a time-sortable suffix

Status: accepted
Date: 2026-10-21
Phase: 1
Amends: ADR-0004, ADR-0021

## Context

Experiments and analyses are the curated pages agents create on branches, and their
shared counter collides there (ADR-0021). Volume IDs already avoid a counter, but their
random suffix does not sort by time within a day.

## Decision

- `EXP` and `ANA` take date IDs like `RUN`, `ART` and `AGS`: `EXP-20261021-0k3m9x`, the
  UTC date and six characters. The first four are the time of day in tenths of a second,
  the last two are random, all in a base-32 alphabet in ASCII order
  (`0123456789abcdefghjkmnpqrstvwxyz`), so IDs sort by when they were made. Every new
  volume ID uses the same suffix; older four-character IDs stay valid.
- `PRJ`, `PRO`, `MAT`, `EQP` and `BLD` keep counters: they are made rarely, on `main`, and
  people cite them by number.
- A repo opts in with `experiment_ids = "date"` in `yajna.toml`; `yajna init` writes it.
  `yajna migrate-ids` moves an existing repo: each counter ID becomes a date ID built from
  when git first recorded the page, with the old number as the last two characters, so
  every worktree migrates to the same IDs and branches still merge. Each migrated page
  keeps `previous_id`; the CLI resolves an old ID to the current one and validation names
  the successor of a stale link.

## Consequences

- Branches create experiments and analyses freely; `validate --against` and `renumber`
  remain for the counter prefixes.
- IDs are longer and carry no order within a project; the project page's list and
  `yajna tree` give that.
