---
id: AGS-20261022-cts947
type: agent_session
schema_version: 1
title: User docs for yajna, published on GitHub Pages
model: claude-opus-5-5
harness: claude-code
started: 2026-10-22T12:41+01:00
finished: 2026-10-22T13:04+01:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-22
author: agent:claude
---

## Task
Start the user documentation for yajna, to be published as GitHub Pages. ank chose
mdBook, the design docs as a section, and a CLI reference generated from `--help`.

## What happened
- `docs/guide/`: an mdBook with introduction, install, quickstart, four concept pages,
  twelve guides and four reference pages. `build.py` generates the CLI reference from
  `yajna --help`, the page-type reference from `schema/`, copies the architecture,
  conventions and ADRs in as a Design section, and fails on a broken relative link.
- `packages.docs` and `checks.docs` in the flake; mdbook in the dev shell;
  `.github/workflows/pages.yml` deploys `nix build .#docs` to Pages on every push to main.
- The quickstart was run end to end in a scratch notebook; its outputs are real.
- Stale help text fixed along the way, since the reference now publishes it: `lab/` in
  `init`, `doc` missing from `new`, the site's default output directory, the author
  precedence, and the top-level summary. The plugin install command in README and
  conventions was wrong (`--marketplace` does not exist); now `marketplace add` and
  `install yajna@yajna`.
- Published: Pages enabled (source GitHub Actions), the guide live at
  https://leoank.github.io/yajna/. Released v0.2.0; the release workflow had never created
  the release its upload step attaches to, so the release was made by hand and the jobs
  rerun, and the workflow now creates it first. The install page's download and checksum
  steps were run against the real assets.
