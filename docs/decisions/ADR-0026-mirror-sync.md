# ADR-0026: `mirror` sync brings doc edits back as a merge to resolve by hand

Status: accepted
Date: 2026-10-23
Phase: 1b

## Context

`publish` makes the page the truth and the doc a copy, so a supervisor who fixes a
sentence in the doc loses the fix at the next sync. Some pages are edited by people who
will not open the repo. Their edits should come back, but as something the author
reviews, not as commits made on their behalf or as a page silently overwritten, and
without the round-trip losses of turning a Google Doc into the page's markdown.

## Decision

- `sync: {provider: gdoc, mode: mirror}` publishes like `publish`, but only committed
  text: what the doc shows of the page (title, status, body without *Review*) must be in
  `HEAD`. After the upload the doc's `appProperties` record `yajna_commit`, `yajna_rev`
  (the doc's revision) and `yajna_export` (a hash of that revision's Markdown export).
- `yajna sync pull [ID...]` finds the edits by comparing two Drive exports, the published
  revision's and the doc's now, not by converting the doc back to source. Drive's
  Markdown export loses code, list and heading markup, so a doc never converts back to
  its source exactly; but it is deterministic and old revisions export unchanged, so the
  export's own ways cancel and the difference is the edits. The hash catches a published
  revision that Drive has since merged with later edits; the pull then refuses.
- Edited lines are carried onto the published source block by block (in-order alignment
  by word similarity) and word by word within a block, so untouched words keep their
  markup and their line. New lines are converted back as far as that is exact (links to
  synced pages and the site, checkboxes, escapes); edits reaching rendered citations or
  code are taken as the doc has them and reported.
- The result is three-way merged with the page now, the published source as ancestor,
  by lines, with edits on neighbouring lines both applied; overlapping edits become
  conflict markers labelled `this page` and `the doc`. The page is written, nothing is
  committed, and the doc records `yajna_pulled`.
- `yajna validate` fails on conflict markers, `yajna sync` refuses a page with them, and
  `yajna sync` refuses to overwrite a mirror doc with edits not yet pulled unless
  `--overwrite` is given.

## Consequences

- No state is kept outside the repo and the doc: every clone can pull, provided it has
  the published commit.
- A mirror page has to be committed before each sync. `publish` pages are unaffected.
- The edit check costs one revision listing per mirror page and sync; a pull costs two
  exports per edited doc.
- Formatting changes in the doc that the export does not show (fonts, colours) never come
  back; structure the export flattens (a changed list type, a table edited cell by cell)
  comes back as the doc's text where the source cannot be matched, for the author to tidy.
- If Google coalesces the published revision with an edit made right after it by the same
  account, the pull cannot separate them and says so; `--overwrite` or a manual merge is
  the way out.
