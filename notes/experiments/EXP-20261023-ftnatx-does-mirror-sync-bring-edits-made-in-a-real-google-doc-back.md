---
id: EXP-20261023-ftnatx
type: experiment
schema_version: 1
title: Does mirror sync bring edits made in a real Google Doc back into the page?
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
Does `yajna sync pull` (ADR-0026) bring the edits a person makes in a mirror page's
Google Doc back into the page, word for word, merged with what changed in the repo?

## Hypothesis and predictions
The pull rests on three properties of Drive, tested so far only against a fake and one
scripted re-upload:

1. Drive's Markdown export of a doc is deterministic, and a past revision exports through
   its export link exactly as it did when current. If not, every pull reports edits nobody
   made.
2. An edit typed in the Docs editor changes the export only where it was made; lists,
   headings and links elsewhere keep their exported form. If not, untouched lines show up
   in the diff.
3. The revision yajna records after its upload stays separate from edits made right after
   it, even by the same account (Docs groups an author's edits into one revision over a
   few minutes). If not, the pull refuses, because the revision's export no longer matches
   its hash.

## Plan
1. Scripted: a scratch mirror page published, its exports compared, an outside edit by
   re-upload, pull, publish again ([[RUN-20261023-ftnr64]]).
2. By hand, ank: publish a mirror page from a scratch lab, then in the Docs editor change
   a word in a paragraph next to a code span and a citation, tick a box, add a line to a
   list, delete a line, and edit one sentence that was also changed in the repo; once
   right after the publish as the owner, once from the second account.
3. `yajna sync pull`, read the `git diff`, resolve the conflict, commit, `yajna sync`.

## Success criteria
- Every edit typed in the doc comes back on its line and nothing else changes; markup
  around an edit survives.
- The same-line edit is the only conflict.
- The owner's edit right after a publish is either pulled or refused with the reason,
  never lost.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

- [[RUN-20261023-ftnr64]] scripted cycle on the real Drive: exports byte-identical, the
  published revision's export too; guard, pull and republish worked; the two words edited
  came back with their markup, plus one nested-list artefact of the re-upload stand-in.

## Conclusion
Written once, by a human, when status becomes `concluded`.
