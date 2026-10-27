# ADR-0032: Todos and log lines from anywhere: a per-user registry, `--in`, `yajna todo`, `-e`

Status: accepted
Date: 2026-10-27
Phase: 1
Source: `docs/from-anywhere.md`

## Context

`yajna log` finds its notebook by walking up from the current directory or through
`--root`; loose todos live in `notes/tasks.md` and no command adds one. A note about a
project that comes to mind outside its repo has to wait for a `cd` and an editor. There is
no per-user configuration, so nothing on a machine knows which notebooks it holds.

## Decision

- **A registry in two files**: `~/.config/yajna/config.toml` for what ank pins (author,
  default target, editor, repos), never written by yajna so neusis can manage it; and
  `~/.local/state/yajna/repos.toml`, where yajna records every repo it runs in by its
  namespace. The config wins.
- **`--in <repo>[/<project>]`** on `log`, `todo` and `tasks`; projects by ID or slug
  prefix; moved projects followed to where they continue. Without it, the current repo,
  else `default`, else a picker; `--pick` always asks.
- **A project inside a lab uses the lab's files**: log lines tagged `[[PRJ-…]]` in the
  daily log, todos under a `## PRJ-…` heading of `tasks.md`. Graduation moves the section.
- **The main checkout only**, never a project's worktree.
- **`yajna todo`** adds items with todo.txt tokens (`due:`, `p:`, `done:`); `yajna tasks`
  sorts by them and saves its numbered listing; `yajna todo done <n>` ticks an item of that
  listing only if its line is unchanged.
- **`-e`** opens an editor on a scratch file; each paragraph is one entry.
- **Git**: writing into another repo commits only the touched file, locally, unless it
  already had uncommitted changes; the current repo is left uncommitted; nothing is
  pushed.

## Consequences

- Any shell on the machine can add to any notebook on it, by name.
- Lab notebooks gain small commits on their main branch from outside; agents' worktrees
  are untouched.
- `tasks.md` gains structure (project headings, tokens) that validation checks.
