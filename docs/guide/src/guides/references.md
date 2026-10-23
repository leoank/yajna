# References

Papers are cited by citation key, the way pandoc and LaTeX do it. The bibliography is a
BibTeX file, `references/library.bib` in a lab (`notes/references/library.bib` in a
project repository); `bibliography` in `yajna.toml` says where.

## Citing

Anywhere in a page or a log line:

```markdown
Builds on the cloning chip of [@shih2015cloning] and the valve design in @gong2016valves.
```

A page can bring its own bibliography as well, the way pandoc takes it, with a path (or a
list of paths) relative to the page:

```yaml
bibliography: g2a-proposal.bib
```

Its keys count for that page on top of the notebook's. `yajna validate` fails on a key
that is in neither, and on a `bibliography` file that does not exist.

When a page that cites papers is [synced to Google Docs](docs-and-sync.md), pandoc renders
the citations as author-year text and adds a *References* section.

## Looking a paper up

```console
$ yajna ref shih2015cloning
key      shih2015cloning
type     article
title    A versatile microfluidic device
author   Shih, Steve and others
year     2015
journal  ACS Synth Biol
note     notes/references/shih2015cloning.md (none; --note creates it)
```

It also lists every page that cites the paper.

## Reading notes

```sh
yajna ref shih2015cloning --note
```

creates `notes/references/shih2015cloning.md`, the place for what the paper means for your
work, as opposed to what it says:

- *What it says*, briefly,
- *What it means for this work*, with links to the projects and experiments it informs,
- *Doubts and follow-ups*.

Its frontmatter tracks `status` (`to-read`, `skimmed`, `read`) and `role` (`method`,
`background`, `key-result`, `tool`).

## Zotero

yajna does not manage the library; Zotero does. With the Better BibTeX plugin, keep the
citation keys stable and export the library to the bibliography file. The yajna repository
has a helper for that, `tools/zotero/export.sh`: run from a lab's root while Zotero is open,
it snapshots the whole library into `references/library.bib` through Better BibTeX's local
JSON-RPC endpoint. Commit the file with the pages that cite from it.

A useful habit: file each paper in a Zotero collection per project
(`Projects/PRJ-0001 <slug>`) and one per topic, and tag it by reading status.
