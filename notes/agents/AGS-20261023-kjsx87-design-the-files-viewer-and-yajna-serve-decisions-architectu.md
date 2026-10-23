---
id: AGS-20261023-kjsx87
type: agent_session
schema_version: 1
title: "Design the files viewer and yajna serve: decisions, architecture doc, experiments"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-23T18:49+01:00
finished: 2026-10-23T18:53+01:00
created_entities: [EXP-20261023-kjtach, EXP-20261023-kjtrwp, EXP-20261023-kjv5wy, EXP-20261023-kjvkas]
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
Design a section of the yajna site for viewing files, configurable in `yajna.toml`, by
default the notes and code directories, that feels like an IDE (tabs, split views) but
clean; text and images first. Interview ank on the technical decisions, write a separate
architecture document linked from the main one, decision records, the project page, and
plan experiments.

## What happened
- Read the site generator and its server (`tools/yajna/src/site.rs`), ADR-0019 and the
  manthan tree: 151 tracked code files, but 18 GB and 92 000 files on disk under `code/`.
- A background survey of layout libraries, code views and existing viewers: dockview-core,
  CodeMirror 6 and panzoom fit; Monaco and Shiki are too heavy; no existing project is a
  static, embeddable read-only viewer.
- Grilled ank in four rounds. The deciding answer: the viewer is for watching runs and
  agents on a server, live, not a static export; the export stays as it is. From there:
  axum in a `yajna-serve` workspace crate, `yajna serve`, loopback plus a tunnel,
  watching pushed over SSE, CodeMirror with a paged view for huge files, dockview, a
  Nix-built committed bundle, named roots that may sit outside the repo, everything on
  disk but `.git` and excludes, symlinks followed, markdown rendered with a source toggle.
- Wrote `docs/files-viewer.md`, ADR-0027 to ADR-0029, the links from
  `docs/architecture.md` (components 5 and 6, a Phase 1c roadmap row, companion
  documents) and the guide's design section; Phase 1c on the project page with four
  experiments, all planned.
- Decided without asking, flagged to ank: the section is named *files* (not *assets*,
  which ADR-0020 already uses); the default roots in a `project` repo; TypeScript for the
  UI; the API shape; the 500-entry pages and the 20 MB starting cap.
