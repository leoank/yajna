---
id: EXP-20261023-cy5j5f
type: experiment
schema_version: 1
title: Do folder mirroring and pandoc citations work against the real Google Drive?
project: PRJ-0001
status: active            # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: [EXP-20261021-as4202]
created: 2026-10-23
author: agent:claude
protocols: []
materials: []
tags: [sync]
review: pending
---

## Question
Do the Drive calls behind folder mirroring (ADR-0024) behave on the real API as on the
fake, and does a citing page come out of pandoc readable in Google Docs?

## Hypothesis and predictions
`yajna sync` was tested against a fake Drive. It assumes:

1. Under `drive.file`, a folder created with `appProperties` is found again by
   `files.list` with `appProperties has {key=... and value=...}`, from another clone.
2. A doc created with `parents` lands in that folder, and `files.update` with
   `addParents`/`removeParents` moves an existing doc while keeping its ID, URL and
   comments.
3. pandoc's HTML (author-year citations, the reference list in `div.csl-entry`) imports
   into a readable Google Doc.

If 1 fails, every sync creates new folders (duplicates); if 2 fails, moves leave docs in
two folders or none; if 3 fails, the reference list arrives unformatted.

## Plan
1. In a scratch lab with a namespace of its own, mark a project page, an experiment and a
   doc in a `[docs]` directory, the doc citing a key from its own `.bib`; `yajna sync`.
2. Check the root folder and the tree in Drive, and the citations and *References* in the
   doc.
3. Sync again from a second clone: no new folders. `git mv` the doc to another docs
   directory; sync: it moves, keeps its URL and its comments.
4. Adopt a file and sync it; check it lands beside the other docs of its directory.
5. Record each step as a run with its script; trash the scratch folder afterwards.

## Success criteria
- One root and one folder per directory across syncs and clones; docs where their pages
  are, moved without new URLs.
- The citing doc reads like the PDF a pandoc build would give: author-year citations, a
  formatted reference list.
- Any mismatch becomes a fix in `sync.rs` and a case in the fake Drive.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

- [[RUN-20261023-d7vw53]] four pages from a scratch lab, a second clone, a move after a
  comment: one root and seven folders found again, the doc moved with its URL and comment,
  citations and reference list readable; every check passed on the first run.
- [[RUN-20261023-dk2evd]] the g2a proposal's reference list in a real doc: Docs drops
  CSS classes and negative indents, so entries now carry spacing and size inline and
  Zotero's italics become case-protected LaTeX; reads cleanly, no hanging indent.

## Conclusion
Written once, by a human, when status becomes `concluded`.
