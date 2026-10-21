# ADR-0023: Docs, a page type for documents people read

Status: accepted
Date: 2026-10-21
Phase: 1b

## Context

Meeting notes, proposals, reports and admin or logistics pages are written for people who
read them in Google Docs, not as experiments. They belong next to the thesis rather than
inside `notes/`, and they should sync without extra setup.

## Decision

- A `doc` page (`DOC-20261021-0k3m9x`, a date ID) has `kind` (meeting, proposal, report,
  admin, logistics, note), `status` (draft, final, archived), an optional `date`,
  `project` and `attendees`, and `sync: {provider: gdoc, mode: publish}` from the start.
  A meeting has its own template with agenda, notes, decisions and actions as checkboxes.
- `yajna new doc "<title>"` asks where the page goes, with completion; `--dir` answers it
  and `notes/docs` is the default when nobody can be asked.
- A directory outside the vault is registered under `[docs] dirs` in `yajna.toml` the
  first time a doc goes there. From then on `validate`, `sync`, `tasks`, the index, the
  site and `export` see the yajna pages in it; files without a yajna `id` and `type`
  (a thesis chapter, a pandoc document) are ignored.

## Consequences

- A meeting's open actions show in `yajna tasks` with everything else.
- Docs link to experiments and runs with `[[ID]]` like any page, and those links become
  links in the published Google Doc.
