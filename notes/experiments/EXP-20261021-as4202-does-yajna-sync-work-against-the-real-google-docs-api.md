---
id: EXP-20261021-as4202
previous_id: EXP-0002
type: experiment
schema_version: 1
title: Does yajna sync work against the real Google Docs API?
project: PRJ-0001
status: concluded            # planned | active | paused | concluded | abandoned
outcome: positive             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-19
author: agent:claude
protocols: []
materials: []
tags: [sync]
review: approved
approval: {by: ank, on: 2026-10-22}
---

## Question
Does `yajna sync` publish a page to a real Google Doc, keep it current, and bring the
comments people leave there back into the page, or do the Drive API calls it makes
behave differently from the fake it was tested against?

## Hypothesis and predictions
`yajna sync` was tested only against a fake of the Drive endpoints. It assumes:

1. A multipart `files.create` with `mimeType: application/vnd.google-apps.document` and a
   `text/html` part makes a Google Doc from the HTML, headings, lists, tables and links
   intact.
2. A multipart `files.update` (`PATCH /upload/drive/v3/files/{id}`) with new HTML replaces
   the doc's content in place, keeping its ID, URL and sharing, and stores
   `appProperties` (`yajna_hash`) that a later `files.get` returns.
3. `comments.list` returns comments with author, content, `quotedFileContent`,
   `resolved` and replies on a doc created with the `drive.file` scope, and a reply with
   `action: resolve` resolves a comment.
4. The desktop OAuth flow with a loopback redirect and PKCE returns a refresh token.

If all hold, the PI reads a published project page in Google Docs, comments on it, and
the comment appears under `## Review` after the next `yajna sync`; ticking it resolves it
in the doc. If the update replaces content badly, expect a new doc, lost formatting or a
`yajna_hash` that never matches (re-uploads every run). Re-uploading a doc detaches the
anchors of earlier comments; that is expected and is why comments are pulled first.

## Plan
1. Create an OAuth client (Desktop app) in a Google Cloud project for the personal
   account (ADR-0011), and run `yajna sync login --client <file>`.
2. In a scratch lab, mark a project page and one experiment with
   `sync: {provider: gdoc, mode: publish}` and run `yajna sync`.
3. Open both docs: check header, headings, lists, a table, a checklist and the link
   between them.
4. Run `yajna sync` again: nothing should upload. Edit the page and run it: the same doc
   updates.
5. Comment and reply in the doc from another account; `yajna sync`; check `## Review`;
   tick the item; `yajna sync`; check the comment is resolved.
6. Record each step as a run with its script; keep the client secret and token out of
   every repo.

## Success criteria
- Docs keep their ID across updates; an unchanged page is not re-uploaded.
- The rendered doc is readable without the repo: structure and links survive.
- Every comment and reply arrives under `## Review`, and a tick resolves it in the doc.
- Any mismatch becomes a fix in `tools/yajna/src/sync.rs` and a case in the fake Drive.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here.

- [[RUN-20261022-c1dwfx]] steps 2-4: two pages published, unchanged re-sync uploads
  nothing, an edit updates the same doc; structure, table and cross-doc link survive.
  Checkboxes were dropped by Docs; fixed by rendering ☐/☑.
- [[RUN-20261022-c3zs1m]] step 5 with one account: an API comment and reply arrive under
  Review, a tick resolves the comment in the doc, a settled page syncs to nothing.
  ank then commented from a second account on a selection in the Docs UI: it arrived
  under Review with that account's name and quote, and a tick resolved it.

## Conclusion
`yajna sync` works! It can publish docs to google doc and then also sync back comments
