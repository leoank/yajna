---
id: PHS-20261106-2m7hcr
type: phase
schema_version: 1
title: "Phase 0b: the Rust CLI, releases and graduation"
project: PRJ-0001
status: done
since: null               # the commit it started at: yajna phase start
until: 26ca9f5799c1d4422a17aea174df49acb387c886
created: 2026-11-06
author: agent:claude
tags: []
---

## Goal
One binary that installs anywhere, through Nix or a release, with lab and project notebooks, links between them, and a project that can graduate into its own repo.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] The Rust CLI at parity, `init lab|project`, namespaced links, `graduate` (ADR-0017, ADR-0018)
- [x] `packages.yajna` installed through neusis
- [x] A tagged release, v0.2.0, with binaries for Linux and macOS
- [x] A machine without Nix running `init project`, `new` and `validate` from the release binary
- [x] Rc2s2 graduates by the documented procedure and both repos validate (2026-10-25: manthan PRJ-0002 is now github:leoank/rc2s2 as rc2s2/PRJ-0001; the lab paths graduate left in run pages and scripts were fixed in yajna 0.8.2 and in the rc2s2 repo)

## Notes
Migrated from PRJ-0001's Progress by `yajna phase migrate`.
