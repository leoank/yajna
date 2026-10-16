# ADR-0016: References live in Zotero, cite by key, notes in the vault

Status: accepted
Date: 2026-10-16
Phase: 0

## Context

Papers are cited from notebook pages, from Google Docs written by hand, and from the thesis.
One paper serves several projects. Capture has to be one click or it stops happening, and
the repo must not depend on a desktop application's database.

## Decision

**Zotero is the capture tool and the only place a paper's metadata is edited.** One
library (My Library); group libraries are sources to copy from, never places to file into.

**Better BibTeX supplies the identity.** Citation keys are pinned and never change. The
whole library auto-exports to `references/library.bib` on every change, and that file is
committed. It is the only thing in the repo that depends on Zotero, and any tool that writes
BibTeX could replace it.

**Collections say why the paper is here, tags say what state it is in.** An item sits in
as many collections as apply. Three top-level collections only:

- `Projects/` with one subcollection per project named `PRJ-0001 <slug>`, the ID verbatim so
  it joins to the vault by name.
- `Topics/` for reading areas that outlive projects.
- `Thesis/` with one subcollection per chapter.

Zotero's built-in Unfiled Items view is the inbox. Tags are a closed vocabulary: status
`to-read`, `skimmed`, `read` as the coloured tags; role `method`, `background`,
`key-result`, `tool`. Automatic publisher tags are switched off. Paper-to-paper links use
Zotero's related-items field.

**Citations in markdown use pandoc syntax**, `[@key]` or `@key`. Publishing to Google Docs
renders them through pandoc citeproc with a CSL style; typst and LaTeX read the same `.bib`.
Documents written directly in Google Docs use the Zotero Docs plugin against the same
library.

**Reading notes are vault pages**: `lab/references/<citekey>.md`, `type: reference`, with
the key and DOI in frontmatter and the digested meaning of the paper for this work in the
body. Highlights and PDF annotations stay in Zotero, attached to the file. Project
membership is not repeated in the note; it links to the pages it informs.

**PDFs stay in Zotero storage**, outside git. When large data storage is decided
(ADR-0013) the storage folder may become an annex remote.

**Tooling.** `yajna ref <key>` resolves a key from the `.bib` and creates the note with
`--note`. `yajna validate` fails on a citation whose key is not in the `.bib`. Reads of the
live library go through Zotero's local API and Better BibTeX's JSON-RPC on the loopback
interface; writes (tagging, filing into project collections) go through the Web API with an
API key kept in `neusis` secrets.

## Consequences

- Which projects a paper belongs to is answered by Zotero; where it was actually used is
  answered by the vault, because the index can list every page citing a key.
- The local API has no authentication and is never forwarded off the machine.
- The key formula is Better BibTeX's default, `auth.lower + shorttitle(3, 3) + year`,
  giving `weidnerSimulatingIdlingBehavior2017`. Pinning writes `Citation Key: <key>` into
  the item's Extra field, which the Web API can set, so keys can be pinned by a script.
