# Exporting and importing

## Exporting to an institutional ELN

Some institutions require an electronic lab notebook of record. yajna keeps the notebook in
git and gives the ELN read-only snapshots of it: nobody edits there, and nothing comes back.

```sh
yajna export --dry-run           # what would go: pages changed since the last export
yajna export                     # cut the bundle; the first export takes every page
yajna export EXP-20261022-cwr123 RUN-20261022-cwx0rf    # just these pages
yajna export --since <commit>    # pages changed since a given commit
yajna export --all               # every page
```

The notebook must validate and have no uncommitted changes, so that a bundle always matches
the commit stamped on it. `--allow-dirty` overrides that and marks the bundle as dirty.

A bundle is a directory, and a `.tar.gz` of it, under `~/.cache/yajna/exports/` (or
`--out <dir>`), with every file read-only:

- one HTML page per notebook page, linking only to pages inside the bundle,
- the markdown sources,
- `manifest.json`: the commit, the time, who exported it, what was selected, and a SHA-256
  for each page,
- `SHA256SUMS` over every file.

Each export appends a row to `notes/exports.tsv`. Commit it: the next `yajna export` takes
only what changed since. Upload the bundle to the ELN by hand.

## Importing from Benchling

A one-off import of files exported from Benchling, written as ordinary pages that you edit
in yajna from then on. Nothing goes back to Benchling.

```sh
yajna import benchling exports/ --project PRJ-0004 --dry-run
yajna import benchling exports/ --project PRJ-0004
```

**Sequences.** GenBank files (`.gb`, `.gbk`, `.genbank`, which every Benchling tenant can
export) become material pages, one per record, of kind `plasmid` unless `--kind` says
otherwise. The record is kept beside the page as `notes/materials/MAT-xxxx/<locus>.gb`, and
the page gets its definition, length, topology and a feature table. Stock fields (location,
quantity, status) are not in the export; fill them in.

**Notebook entries.** Entries saved as the Benchling API returns them
(`GET /entries/{id}`: one entry, a list, or `{"entries": [...]}`) become experiment pages in
`--project`, dated on the entry's date, with one section per entry day holding its text,
lists, checkboxes and tables. They are imported as `concluded` unless `--status` says
otherwise. Parts that only make sense inside Benchling (registrations, results, plate and
inventory tables) are named, not imported. The PDF export from the Benchling UI cannot be
imported.

`@` and `[[` in Benchling text are kept literal, so they never read as citations or links.
Every imported page carries `benchling: <key>`, so importing the same files again skips
what is already there.
