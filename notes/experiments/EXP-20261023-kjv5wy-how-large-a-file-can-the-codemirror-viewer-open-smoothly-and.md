---
id: EXP-20261023-kjv5wy
type: experiment
schema_version: 1
title: How large a file can the CodeMirror viewer open smoothly, and what does the UI cost the binary?
project: PRJ-0001
status: planned           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-23
author: agent:claude
protocols: []
materials: []
tags: [serve]
review: pending
---

## Question
How large a text file can the CodeMirror viewer open and follow smoothly, how big is the
frontend bundle, and how much do axum, tokio, notify and the bundle add to the `yajna`
binary (ADR-0027, ADR-0029)?

## Hypothesis and predictions
- A read-only CodeMirror opens a 20 MB log in under a second and scrolls without dropped
  frames; at 100 MB opening takes several seconds and the tab uses over a gigabyte.
  Files with very long lines (minified JSON) are slower at the same size.
- Following a log that grows at 1 MB/s stays smooth with appends by `Range`.
- The bundle (dockview-core, CodeMirror with about eight languages, panzoom, our code) is
  about 350 KB gzipped.
- The release binary grows by 2 to 3 MB (stripped, LTO) from axum, tokio and notify, plus
  the bundle.

## Plan
1. Build the step-3 bundle; read per-package sizes from esbuild's metafile.
2. With a headless browser (Playwright, Chromium and Firefox), open generated files of 1,
   5, 20, 50 and 100 MB, in two shapes (log lines, one long line), and record time to
   first paint, scroll frame times and tab memory; then follow a file growing at 1 MB/s
   for a minute.
3. Build release binaries before step 1 and after step 3 for macOS arm64 and Linux x86_64
   and compare sizes.
4. One RUN with the metrics in `results.tsv`.

## Success criteria
- The text viewer's cap set from the data: the largest size that opens in under a second
  and follows smoothly in both browsers.
- The bundle budget and the binary growth recorded in `docs/files-viewer.md` and
  ADR-0027.

## Runs
One line per run after its link, what was tried and what it showed; `yajna validate`
rejects a bare link here. Metric runs also land in results.tsv.

## Conclusion
Written once, by a human, when status becomes `concluded`.
