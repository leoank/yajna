# ADR-0009: Dry-lab code starts in this repo and graduates

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` sections 4, 9 and 12

## Context

AutoGo keeps code and experiments in one repo, which makes a `RUN` page and the code it ran
trivially linkable. Mature ML projects want their own history, CI and collaborators.

## Decision

Every dry-lab project starts under `projects/<name>/` in this repo with its own flake or
`devShells.<name>` output. When a project matures (its own collaborators, releases, or a
history worth separating) it moves to its own repository. `MAT` and `RUN` pages then
reference it by repository URL and commit, and the moved history is preserved with
`git subtree split` or `git filter-repo`.

## Consequences

- A `RUN` page always records a flake revision; while the code lives here that is this
  repo's commit, afterwards it is the external repo's.
- Small analyses never leave. The threshold for moving is a judgement call, recorded in the
  progress log when it happens.
