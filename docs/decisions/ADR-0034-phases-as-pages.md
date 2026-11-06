# ADR-0034: A project's phases are `PHS` pages; *Progress* lists them one line each

Status: accepted
Date: 2026-11-03
Phase: 1d
Source: `docs/review.md` sections 3 and 7. Amends ADR-0030.

## Context

A project page's *Progress* was one checklist of everything planned and done. It does not
scale: this repo's had 61 items (7 KB) after three weeks, grouped only by a `Phase 1e:`
prefix on each line, and rc2s2 and manthan's vesicle project had nested sub-items several
levels deep under one line per phase. A phase had no place for its goal or notes, and a
review of one found its bounds from a `(since <sha>)` tag on one item, or by guessing from
when the item before it was ticked.

Options considered, with ank on 2026-11-03:

1. Keep one checklist and move done items to an archive section or page: the page shrinks,
   but a phase still has no page and its review still guesses.
2. Phases as headings inside *Progress*: groups the items, nothing else.
3. Phases as pages, *Progress* as their index: chosen, with (1)'s quick view kept as one
   line per phase.

## Decision

- **A phase is a `PHS` page** under the project's `phases/`, with a date ID like an
  experiment's (ADR-0022), since phases are planned on branches too. It has `status`
  (`planned | active | done | abandoned`), `since` and `until` (full SHAs: the commits it
  started and finished at), and a body of *Goal*, *Progress* (its own checklist, the
  items that used to sit on the project page) and *Notes*. The page is the source of truth.
- **The project's *Progress* is a view**: `- [ ] [[PHS-…]] <what the phase is>`, one line
  per phase, ticked when it is done; `yajna new phase "<title>" --project PRJ-…` adds the
  line, and validation requires the description after the link as for experiments.
- **`yajna phase start PHS-…`** sets `status: active` and `since`; **`phase done PHS-…`**
  sets `status: done`, `until`, and ticks the project's line. `--at <commit>` gives either
  for a phase that began or ended earlier.
- **A phase is reviewed as a page**: `yajna review open PHS-…`, from `since` to `until`
  (HEAD while it runs), over the project's code and notes; a phase without `since` is
  refused with how to give it one. `PRJ-… --phase "<words>"` stays for projects not yet
  migrated, and on a migrated one resolves to the phase page its matching line links.
- **`yajna phase migrate PRJ-…`** (`--dry-run` first) turns the old checklist into pages:
  items whose label before `:` is the same, once `designed`, `verified`, `later` and
  `step N` are dropped, become one phase named by the label; an item alone is a phase
  titled by its text; an item's nested items become its phase's checklist and its text the
  goal. `since` is the earliest `(since …)` among the items, `until` of a done phase the
  last commit that ticked one. The result is a draft, filled in with the author afterwards.

## Consequences

- The project page stays short however long the project runs, and a phase has a place for
  what it was for and what was learned.
- Reviews of phases have exact bounds once `phase start` and `phase done` are used; the
  inference from ticked items is only for unmigrated projects.
- `yajna tasks` lists a phase's open items from its page, as it lists any checkbox.
- Migration is a heuristic over free text: a label that is a phrase rather than a name
  (`` `yajna renumber` also rewrites…``) makes a phase of its own, and numbered labels
  (`kalam-zero 1`, `kalam-zero 2`) stay separate. The dry run shows the grouping first.
