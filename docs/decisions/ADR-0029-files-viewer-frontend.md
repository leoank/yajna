# ADR-0029: The files viewer's frontend: dockview, CodeMirror, a committed bundle

Status: accepted
Date: 2026-10-23
Phase: 1c
Source: `docs/files-viewer.md` section 6

## Context

The viewer should feel like VS Code's editor (a tree, tabs, groups split side by side) and
stay clean. It is read-only, opens text and code, markdown and images first, and gains
viewers as they are needed. It is embedded in a binary that must build with plain `cargo`
and run offline. The options were weighed on 2026-10-23: layout libraries (dockview-core,
Lumino, golden-layout, FlexLayout, hand-rolled splits), code views (CodeMirror 6, Monaco,
highlighting in Rust, highlight.js) and existing projects (github1s and the VS Code web
workbench, stagit, miniserve, dufs), none of which is a static, embeddable read-only
viewer.

## Decision

- **Layout: dockview-core.** MIT, no framework, released actively; editor groups with
  drag-to-split and a JSON layout to save, about 90 KB gzipped. Lumino looks like
  JupyterLab; golden-layout has not released since 2022; FlexLayout and allotment need
  React; hand-rolled splits would mean writing tab dragging and layout saving.
- **Text: CodeMirror 6, read-only.** It draws only the visible lines, so multi-megabyte
  files stay smooth, and gives highlighting, search and folding for about 250 KB gzipped
  with a handful of languages. Monaco is about 1 MB gzipped with worker setup; highlighting
  in Rust or with highlight.js builds the whole file into the DOM. Above a size cap a
  paged view reads byte ranges instead.
- **Markdown** is rendered on the server by yajna's own renderer, so links and citations
  match the site; the tab toggles to the source.
- **Images**: `<img>` with @panzoom/panzoom (3 KB gzipped).
- **Viewers are modules** in a registry that picks one by the file's stat, so adding a
  format is adding a module and, if the browser cannot read it, a route.
- **Build.** TypeScript under `tools/yajna-serve/ui/src`, npm dependencies pinned by
  `package-lock.json`, bundled by esbuild through Nix (`nix run .#ui`) into a committed
  `dist/` that rust-embed includes. A flake check rebuilds the bundle and fails when the
  committed one is stale, and type-checks the source. `cargo build` and the release
  workflow need no Node.

## Consequences

- The repo carries a generated bundle; its diffs are noise in review and are committed
  with the source change that produced them, as `flake.lock` is.
- A new language in the text viewer is a CodeMirror package and a bundle rebuild.
- The size cap for the text viewer and the bundle budget are set by
  `EXP-20261023-kjv5wy`.

## Amendment, 2026-10-30 (yajna 0.17.0)

The image viewer no longer uses @panzoom/panzoom. Its wheel zoom moved a fixed step per
event, and a trackpad gesture sends dozens, so a flick reached the maximum scale at once,
and with no bounds the image left the view. About eighty lines of our own zoom in
proportion to the wheel delta, about the pointer, and keep the image in view.
