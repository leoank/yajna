---
id: AGS-20261023-nxj9aa
type: agent_session
schema_version: 1
title: "Phase 1c step 1: the workspace, yajna-serve with axum, yajna serve"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-23T20:57+01:00
finished: 2026-10-23T20:57+01:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
Build step 1 of `docs/files-viewer.md`: `tools/` as a Cargo workspace, the `yajna-serve`
crate serving the rendered site with axum, `yajna serve` with `site --serve` as its alias,
the hand-rolled server removed.

## What happened
- `tools/Cargo.toml` makes the workspace (members `yajna`, `yajna-serve`), with the one
  `Cargo.lock` moved up by `git mv` and the release profile at the root. The flake builds
  `source/tools`; the release workflow tests the workspace.
- `tools/yajna-serve` (axum 0.8 without default features, tokio): `run(Config, ready)`
  serves the site directory, calling the CLI's refresh callback on a blocking thread
  before each page, so the re-render-when-stale behaviour of the old server is kept. It
  rejects requests whose `Host` is not loopback or a `--host` name (DNS rebinding); added
  ahead of step 2 because the server exists now.
- `yajna serve [--out] [--port] [--open] [--host NAME]...`; `site --serve` dispatches to
  it; the old `TcpListener` loop in `site.rs` is gone.
- Tests: the serve integration test now covers both commands, an encoded traversal, a
  foreign Host (403) and a tunnel Host; a unit test for the Host parsing. Workspace
  tests, clippy and `nix flake check` pass.
- Binary size, aarch64-darwin release: 10 848 288 bytes (0.4.1) to 11 524 768 (0.5.0),
  +676 KB for axum and tokio: a first data point for [[EXP-20261023-kjv5wy]].
- The ADR-0027 line about `--bind` was rewritten: there is no `--bind` until there is a
  token, and `--host` names a tunnel.
