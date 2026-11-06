---
id: PHS-20261106-2m7mkz
type: phase
schema_version: 1
title: "Phase 1c: yajna serve and the live files viewer"
project: PRJ-0001
status: active
since: null               # the commit it started at: yajna phase start
until: null               # the commit it finished at: yajna phase done
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
Follow the notebook and an agent's files live from a browser, on this machine or a remote one.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] Designed: `yajna serve` and a live files viewer with tabs and split views, `docs/files-viewer.md` (ADR-0027, ADR-0028, ADR-0029)
- [x] Step 1: `tools/` as a Cargo workspace; `yajna-serve` (axum) serves the site; `yajna serve`, `site --serve` its alias
- [x] Step 2: `[files]` roots in `yajna.toml`; the read-only file API with ranges, path and Host checks ([[EXP-20261023-kjtach]])
- [x] Step 3: the UI (dockview, CodeMirror, markdown, images), the Nix-built committed bundle, files links from the site ([[EXP-20261023-kjv5wy]])
- [x] Step 4: live: watch or poll, SSE, follow mode ([[EXP-20261023-kjtrwp]])
- [ ] Step 5: the paged viewer for files above the cap
- [ ] Verified: ank follows an agent's run on a remote machine from the laptop ([[EXP-20261023-kjvkas]])

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.

No `since`: the commit this phase started at is not known (ank, 2026-11-06), so it is left
unset and `yajna review open` cannot span the phase; review its work by commit range instead.
