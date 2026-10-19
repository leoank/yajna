---
id: EXP-0001
type: experiment
schema_version: 1
title: Does yajna import benchling read real Benchling exports?
project: PRJ-0001
status: planned           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-19
author: agent:claude
protocols: []
materials: []
tags: [import]
---

## Question
Does `yajna import benchling` turn real files exported from the lab's Benchling tenant into
valid pages that say the same thing as Benchling, or did its formats come out wrong?

## Hypothesis and predictions
The importer was written from Benchling's documented formats and tested only on
hand-made fixtures. Two assumptions carry it:

1. GenBank exports from the Benchling UI (and API) follow the standard layout: a `LOCUS`
   line with name, length, molecule, topology and date, `DEFINITION`, `FEATURES` with
   `/label` (or `/gene`, `/product`, `/note`) qualifiers, and records ending in `//`.
2. A notebook entry from the API (`GET /entries/{id}`, API v2) has `id`, `name`,
   `displayId`, `createdAt`, `modifiedAt`, `creator`, `webURL` and `days[].notes[]`, where
   note parts are typed `text`, `code`, `list_bullet`, `list_number`, `list_checkbox`
   (with `checked`) and `table` (with `table.columnLabels` and `table.rows[].cells[].text`).

If both hold, every exported plasmid becomes one `MAT` page whose feature table matches
Benchling's map and whose kept `.gb` file re-opens in a sequence viewer, and every entry
becomes one `EXP` page with all its days and their text, lists and tables, the vault
validates, and a second import skips everything. If an assumption fails, expect missing
features or labels, a wrong length or topology, empty day sections, tables without
headers, or a "not a Benchling entry" error.

## Plan
1. Check whether the tenant has API access (the Developer Platform capability); if it
   does not, run only the GenBank half and record that.
2. From the Benchling UI export three plasmids as GenBank: one simple, one with many
   features, one multi-record export if the UI offers it.
3. With API access, save two real entries with
   `curl -u "$BENCHLING_API_KEY:" https://<tenant>.benchling.com/api/v2/entries/<id>`:
   one plain text entry and one with checklists and tables. Keep the key out of the repo.
4. In a scratch lab (`yajna init lab`), `yajna import benchling <files> --project PRJ-0001`,
   then `yajna validate` and a second import.
5. Compare each page against Benchling side by side; note every field that differs or is
   missing, and every note-part type the importer did not know.
6. Record the run with its script under this experiment's runs; the exported files are
   lab data, so keep them out of this public repository.

## Success criteria
- Every plasmid's length, topology, definition and feature labels match Benchling.
- Every entry day, paragraph, checklist item and table cell appears on the page.
- `yajna validate` passes on the scratch lab and the second import skips everything.
- Any mismatch becomes a fix in `tools/yajna/src/import.rs` with a test from a redacted
  copy of the real export.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Deferred: nothing has been run yet.

## Conclusion
Written once, by a human, when status becomes `concluded`.
