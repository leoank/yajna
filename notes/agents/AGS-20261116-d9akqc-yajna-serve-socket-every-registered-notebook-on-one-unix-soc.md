---
id: AGS-20261116-d9akqc
type: agent_session
schema_version: 1
title: "yajna serve --socket: every registered notebook on one unix socket, for saarthi's relay (ADR-0036)"
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-16T12:05+00:00
finished: 2026-11-16T12:06+00:00
created_entities: []
edited_entities: [PHS-20261106-2m7r6j]
outcome: done
created: 2026-11-16
author: agent:claude
---

## Task
Build the first phase 3 item of ADR-0036, asked by ank on 2026-11-16 from a saarthi
session ([[saarthi/AGS-20261114-rapbh2]]): `yajna serve --socket` serving every notebook in
the registry on one unix socket, so saarthi's node can relay the phone to it.

## What happened
- `yajna-serve`: one router per notebook as before; `run_socket` binds the socket (its
  directory made 0700, the socket 0600, a stale one replaced, one a server answers on
  refused) and serves `/api/notebooks` and each notebook under `/n/<namespace>/`,
  dispatched to that notebook's own router, `/n/<namespace>` redirected to the slash form
  for relative links. On the socket there is no Host check and review writes need no token;
  `/api/info` says `local`.
- The files viewer takes its API's base from its own URL (empty at `/files/`,
  `/n/<namespace>` under it); the bundle rebuilt with `nix run .#ui`.
- The CLI: `yajna serve --socket <path>` runs from any directory over
  `anywhere::registered()` (config, then recorded notebooks still there); one that cannot
  be opened is left out with a note; every site is rendered in the background from the
  start.
- Checked behind a local saarthi 0.8.0 hub and node with a scratch registry: the node
  started yajna on the first request (2 s), both notebooks listed, the site, viewer, roots
  and an event stream served under `/n/saarthi/`, an unknown notebook 404. The first page
  of the saarthi notebook took 21 s with an empty cache before the background render, 0.05
  s after it.
- Decided without asking: rendering in the background at start rather than on demand only;
  `local` in `/api/info` so the viewer offers writing without a token.
- Noticed, not fixed: the state registry holds hundreds of `/tmp/nix-shell.*` paths,
  apparently written by yajna's own tests, which a socket server would offer as notebooks
  while they exist; and every change re-renders a whole site (21 s for saarthi's).
