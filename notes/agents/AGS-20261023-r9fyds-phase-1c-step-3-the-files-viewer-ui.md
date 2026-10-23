---
id: AGS-20261023-r9fyds
type: agent_session
schema_version: 1
title: "Phase 1c step 3: the files viewer UI"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-23T23:06+01:00
finished: 2026-10-23T23:07+01:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
Delete the scale test tree, commit ank's loose tasks, bump neusis and manthan to 0.6.0,
then build step 3 of `docs/files-viewer.md`: the viewer's UI.

## What happened
- The 10 GiB test tree deleted; ank's `notes/tasks.md` committed as theirs (85a6e3e);
  neusis bumped and pushed (7027601), the manthan worktrees committed, not pushed.
- Build: TypeScript in `tools/yajna-serve/ui`, npm for libraries only (pinned, no
  scripts), `tsc` and `esbuild` from nixpkgs, `nix run .#ui` through `importNpmLock`, the
  `ui-bundle` flake check comparing the committed `dist/`.
- dockview's ESM build has no stylesheet, and the CSS ships only in the React package,
  so the UMD build is imported through a typed shim. The first bundle was 453 KB
  gzipped, over the 350 KB budget; loading CodeMirror's languages on demand brought the
  first load to 230 KB.
- Server: `/files/` from the embedded bundle, `/api/info`, `/api/files/render` through a
  CLI callback that renders as the site does, with raw HTML shown as text. The served
  site gets a *files* nav link and links `script`, `code` and `path` into the viewer.
- Checked in a browser with Playwright on this repo and a scratch notebook: deep link
  with a line range, tree reveal, preview tabs replaced, markdown with page links and an
  escaped `<script>`, image zoom, binary and hex, split, layout restored after a reload.
  Found and fixed: panzoom set up before the image was in the page, a slower load
  drawing into a tab after a faster one, the URL not following a preview tab, the
  server crate's version shown instead of yajna's, an unresolvable image link left in
  place. A browser test in CI is not built.
- Decided without asking: preview tabs pin when clicked into (not on scroll), a
  relative link that climbs out of its root is dropped, the split button opens the file
  again to the right as VS Code does.
