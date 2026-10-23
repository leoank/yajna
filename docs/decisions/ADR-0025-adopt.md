# ADR-0025: `yajna adopt` makes an existing markdown file a page

Status: accepted
Date: 2026-10-23
Phase: 1b

## Context

Documents often exist before the notebook knows about them: a proposal drafted in the
thesis folder with its own `.bib`, a protocol written up elsewhere, notes from a spike. To
sync, validate or link them they must be pages, and retyping them through `yajna new`
loses their history and invites mistakes.

## Decision

- `yajna adopt <file> [--type T] [--kind K]` (type `doc` by default) allocates an ID through
  the same path as `yajna new`, puts the type's template frontmatter on top of the file's
  body, and renames the file to start with the ID. The body is kept as it is; the
  template's body sections are not added. `--project`, `--experiment`, `--author` and the
  kind checks work as for `new`.
- **Where it goes.** A doc stays in its directory, registering it under `[docs]` when it is
  outside the vault. Every other type moves to where that type lives (`notes/protocols/`,
  the project's `experiments/`, ...).
- **The file's own frontmatter.** Keys yajna does not write (pandoc's `lang`,
  `bibliography`, `geometry`, ...) are kept. `title` becomes the page title and `author`, a
  person's name rather than a handle, is kept as `authors`. Keys yajna writes for that
  type (`status`, `kind`, `date`, ...) are refused before anything is created, naming
  them, so nothing is overwritten silently.
- **Title.** `--title`, else the file's `title`, else its first heading (removed from the
  body when it only repeats the title), else its name.
- **Bibliography.** A `.bib` with the same name beside the file becomes its `bibliography`,
  so a proposal's citations keep resolving after adoption (ADR-0024).
- A file that already has an `id` is refused. `--dry-run` says what would happen.

## Consequences

- The old file is removed once the page is written; git sees a rename because the body is
  unchanged, so `git log --follow` keeps its history. Links to the old file name (from a
  thesis build, say) are reported for the author to update.
- Adoption is one-way and one-off; a file is adopted once and edited as a page from then on.
