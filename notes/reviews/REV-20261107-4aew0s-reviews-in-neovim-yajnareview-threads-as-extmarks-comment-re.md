---
id: REV-20261107-4aew0s
type: review
schema_version: 1
title: "Reviews in Neovim: :YajnaReview, threads as extmarks, comment, reply and resolve"
project: PRJ-0001
target:
  kind: branch               # branch | range | page | run | experiment | phase
  ref: nvim-review
base: c35a54aa3b27868e389522be1e672664c7ff1db5
head: 1e130d3f5e92425e6da9feda4c6984142e3d5265
paths: []
about: [PHS-20261106-2m7m9t]             # the pages it is about: experiments, runs, a project
status: approved          # open | changes_requested | approved | merged | closed
created: 2026-11-07
author: agent:claude
---

## Summary
Step 5 of `docs/review.md`, the unticked *Reviews in Neovim* item of
[[PHS-20261106-2m7m9t]]: `tools/yajna.nvim/lua/yajna/review.lua` (new), the commands and the
`yajna://` reader in `plugin/yajna.lua`, `tests/review.lua`, the check now given `git` and
`yajna`, and the guide's *Neovim* page. `notes/review_workflow.md` was empty, so this
follows section 7.3; say if you meant something else by it.

**Try it:** in this repo, `:YajnaReview REV-20261106-3rsd58` (86 files) or this review;
`<CR>` on a file, `<localleader>yc` on a selection on the right, `r`/`R` in the overview.

Settled by me: an overview tab first rather than every file at once (86 files would be 86
diff pairs); one tab per file's diff; comments on the base side refused; writes pass
`--author` chosen as the files viewer does, so an agent's `YAJNA_AUTHOR` in your shell does
not sign your comments (your todo); the quickfix list is replaced on every write. Left to
the CLI: address, reopen, approve, request-changes, and the rounds and fix groups.
- 2026-11-11 13:57 ank approved: Looks good. Approved

## Threads
