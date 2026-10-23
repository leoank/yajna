# ADR-0027: `yajna serve`, a live server beside the static site

Status: accepted
Date: 2026-10-23
Phase: 1c
Amends: ADR-0019
Source: `docs/files-viewer.md` sections 2, 3 and 5

## Context

Runs execute on a server and write logs, metrics and images for hours; agents work there
too. ank wants to watch both from the laptop: the pages agents write, which the static
site already shows, and the files around them, live, in a viewer with tabs and split views
(`docs/files-viewer.md`). A static export cannot show files that change after it was
rendered, and today's `yajna site --serve` is a single-threaded loop that serves the
export's files and nothing else. More of yajna will move away from static exports over
time (the Phase 3 server with its HTTP API and MCP).

## Decision

- **Two things, one port.** `yajna site` stays the static export. `yajna serve` serves that
  export, re-rendered when a page changed as `site --serve` does now, plus the live
  `files/` section and its JSON and SSE API. `yajna site --serve` becomes an alias of
  `yajna serve`.
- **axum on tokio.** Range requests, streaming, server-sent events and concurrent
  connections come with the stack instead of being written by hand, and it is the stack
  the Phase 3 server will grow on. tokio runs only inside `serve`; every other command
  stays synchronous.
- **A library crate in a workspace.** `tools/` becomes a Cargo workspace with one lock
  file. The new crate `tools/yajna-serve` holds the router, the file API, the watcher and
  the embedded UI. It does not depend on `yajna`: the CLI hands it the roots, the site
  directory and callbacks for rendering the site and markdown. The result is still one
  `yajna` binary.
- **Loopback only.** The server binds `127.0.0.1` and is reached from elsewhere through
  `ssh -L` or `tailscale serve`; yajna has no authentication. `--bind` to a non-loopback
  address is refused until a token option exists. Requests whose `Host` is not a loopback
  name or a configured tunnel name are rejected, against DNS rebinding.
- **JavaScript in `files/` only.** ADR-0019's "no JavaScript" holds for every rendered
  page; the files section is an application and is the one exception.

## Consequences

- The binary grows by axum, tokio, notify and the UI bundle; `EXP-20261023-kjv5wy`
  measures by how much.
- On a machine where other users can open loopback ports (a shared login node), anyone
  there can read the configured roots while the server runs. The token is the remedy and
  is not built; until then, run it where that is acceptable.
- The hand-rolled server and its tests are replaced in the first step of the build.
