# ADR-0024: Synced docs mirror the notebook's folders; citations render through pandoc

Status: accepted
Date: 2026-10-23
Phase: 1b

## Context

`yajna sync` put every doc in one Drive folder (or My Drive), named `<ID> <title>`. A
thesis folder with meetings, proposals and admin pages arrived as a flat list, and readers
lost the structure the author keeps in the repo. Pages that cite papers arrived with raw
`@citekey`s, and a proposal's citations come from a `.bib` beside it rather than from the
notebook's bibliography.

## Decision

- **Layout.** A doc lives at its page's directory under one root folder: relative to the
  vault for notebook pages (`notes/projects/PRJ-0001-x/experiments/` becomes
  `projects/PRJ-0001-x/experiments/`), relative to the repo for pages in a `[docs]`
  directory (`thesis/meetings/` stays `thesis/meetings/`).
- **Root.** `[sync] folder` names it when set. Otherwise yajna creates a folder named after
  the notebook's namespace in My Drive on the first sync; it is shared once and everything
  below inherits the sharing.
- **Finding folders.** yajna creates every folder itself and tags it with `appProperties`
  (`yajna_notebook` on the root; `yajna_root` and `yajna_path` below it), then finds it
  again with a Drive query. No folder IDs are stored in the repo, so every clone and
  worktree resolves the same folders, and the `drive.file` scope (yajna sees only what it
  created) is enough.
- **Moves.** Each sync compares a doc's parent with its page's folder and moves it when they
  differ, so a `git mv` carries over and docs created before this change move into place.
  The doc keeps its ID, URL, comments and sharing. A folder left empty stays; yajna never
  deletes anything in Drive.
- **Citations.** A page that cites papers is rendered by `pandoc --citeproc` (pandoc's
  markdown, lists allowed straight after a paragraph) with author-year citations and a
  `References` section at the end; pages without citations keep the built-in renderer.
  Citations resolve in the notebook's bibliography plus the page's own `bibliography`
  field (a path or list of paths relative to the page, as pandoc takes it), which
  `yajna validate` reads too.
- **pandoc is optional.** yajna stays one binary: pandoc is needed only to sync pages that
  cite, and such a page is skipped with the reason when it is missing. The dev shell and
  the test inputs carry it.

## Consequences

- The first sync after upgrading moves existing docs into folders; nothing is re-created.
- A folder that `[sync] folder` points at but yajna did not create may refuse new children
  under `drive.file`; leaving `folder` unset avoids that.
- Citation style is pandoc's default (Chicago author-date). Choosing a CSL style is a later
  option, not built.
- Google Docs drops CSS classes and negative indents on import, so the reference list's
  layout is inline (each entry a paragraph, 10pt, space after) and has no hanging indent.
  Zotero's HTML marks in titles (`<i>`, `<sup>`, `<span class="nocase">`) are rewritten
  as case-protected LaTeX for pandoc, so species names stay italic and lower case.
- A pandoc upgrade can change a citing page's rendering and so re-upload it once.
