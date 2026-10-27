# ADR-0030: Code review in the notebook: REV pages over branches, ranges, pages, runs, experiments and phases

Status: accepted
Date: 2026-10-26
Phase: 1d
Source: `docs/review.md`

## Context

Agents work on branches in worktrees (ADR-0021) and ank reads their changes before they
reach main. The comments, answers and fixes of that reading live in chat sessions and are
lost with them. Questions about what changed between two runs, over an experiment or over
a phase of a project are answered with `git log` by hand. GitHub pull requests would keep
comments, but outside the notebook, unlinked to its pages, and not for targets git does not
know.

## Decision

- **A review is a page**, `REV-<date>-<suffix>` of type `review`, written in markdown like
  every other page (ADR-0001): frontmatter with the target and the base, head and paths it
  resolved to, a *Summary*, and threads as headings with a state and an anchor, the quoted
  lines, and replies as appended, dated list items.
- **Six targets**: a branch against its base, a commit range, a page, a run (from the
  previous run of its experiment), an experiment (from its creation to its last run), a
  project phase (from `(since <sha>)` in its Progress item, written by `yajna phase start`,
  else inferred from when the item before it was ticked).
- **It lives with what it reviews**: a project's reviews in its `reviews/` directory, and a
  branch review on that branch, so it merges and graduates with the work.
- **Anchors** are commit, path, lines and the quoted lines; when the head moves, threads
  follow renames and their quoted lines, and become `outdated` when those are gone.
- **Agents address, a human resolves.** A thread is `addressed` with the commit that fixes
  it; only an author without the `agent:` prefix resolves a thread or approves a review.
  `yajna review merge` merges a branch target with `--no-ff` only when the review is
  approved and no thread is open.
- **Four ways to write, one format**: the CLI, a diff view in `yajna serve --review`, Neovim,
  and the page by hand.
- **The server writes only with `--review`**, behind a one-time token and an Origin check,
  to the working tree, committing nothing (amends ADR-0028's read-only API for this one
  section).
- **What exists stays**: `review: pending` is still the flag on curated pages, cleared when
  a review of the page is approved; `yajna sync`'s `## Review` keeps the comments of
  Google Docs.
- **Commits in pages are full SHAs** from now on.

## Consequences

- Review history is searchable, linkable and validated with the rest of the notebook, and
  survives the sessions that produced it.
- REV pages add to the notebook's size; a short review is still a page.
- `yajna-serve` gains its first writing routes, whose handlers come from the CLI crate so
  that it still knows nothing of the notebook (ADR-0027).
- Graduation must remap the commits reviews name (ADR-0031).

## Amendment, 2026-10-27 (`docs/review.md` v0.7)

- **One target, plus `about`.** A review covering several experiments, runs or a phase
  keeps a single diff and lists those pages in `about`; disjoint work stays in separate
  reviews, so one approval settles one diff.
- **Signing leaves a record.** Approving no longer deletes `review: pending`: the page gets
  `review: approved` and `approval: {by, on, in}`, and `yajna approve` signs a page without
  a review. Validation checks the record.
- **A past range moves forward** with `review update --to <commit>`, so the fixes to a
  retroactive review land in the same review.
