# ADR-0020: `notes/`, `code/` and `assets/` as the top-level directories

Status: accepted
Date: 2026-10-19
Phase: 1
Amends: ADR-0004, ADR-0009, ADR-0018
Source: `docs/architecture.md` section 4

## Context

The vault was `lab/`, dry-lab code `projects/` and hardware design sources `hardware/`.
Three things were wrong with that. `lab/` says where the work happens, not what the
directory holds. `projects/` existed twice, at the top level for code and inside the
vault as `projects/PRJ-*/` for the pages, and the two were confused in prose and in
paths. `hardware/` separated design sources from code when most of them (KiCad,
code-based CAD, firmware) are code and build under Nix like any other project.

## Decision

- The vault directory is `notes/` (`vault = "notes"` is the default in `yajna.toml`;
  an explicit `vault = "lab"` keeps working for a repo that does not rename). Inside it
  nothing changes: `projects/PRJ-*/`, `protocols/`, `materials/`, `log/` and the rest.
- Code lives under `code/<slug>/`, one directory and flake per project, scaffolded by
  `yajna new project --code`; the project page's `code` field is `code/<slug>`. Hardware
  design sources are code and live there too.
- `assets/<name>/` holds only what GUI programs produce and nothing can regenerate: an
  exported STEP, a Gerber drawn by hand, a render. Large binaries are still artifacts
  (ADR-0013), not git history.
- The repo shapes keep their names, `lab` and `project`, and so does `yajna init lab`:
  they name what the repo is, not a directory.
- The project page comes in two templates. The research one (`templates/project.md`)
  has *Introduction*, *Current belief*, *Open questions*, *What not to try again*,
  *Experiments*. The code one (`templates/project-code.md`, used by `--code`) has
  *Introduction*, *Status*, *Design*, *Roadmap*, *Lessons*, *Experiments*, because a
  piece of software has a state and a plan rather than a belief and a question.

## Consequences

- Earlier ADRs and the progress log keep the old names; this record is the translation.
- The lab repo (`manthan`) renamed its directories in one commit with `git mv`, so file
  history follows the moves; links are by ID and did not change.
- The Neovim plugin, the skill, the commands and the site know only the vault path from
  `yajna.toml` and the `code` field, so they follow the rename without special cases.
