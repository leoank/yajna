# ADR-0036: A per-user `yajna serve` on a unix socket, reached through saarthi

Status: accepted
Date: 2026-11-14
Phase: 3
Amends: ADR-0027, ADR-0030; section 8 of `docs/architecture.md`
Source: saarthi's `docs/notebooks.md` and its ADR-0052 and ADR-0053

## Context

ank wants the notebooks on the phone, beside the agent sessions saarthi already shows
there: a machine's notebooks and their files, reviews, new projects, run sheets at the
bench ([[AGS-20261114-rapbdr]]). Section 8 planned a central server as the canonical git
remote, which the phone and agents reach over Tailscale with tokens of its own, and a
native capture app in phase 4. saarthi has since built a daemon on every machine with an
authenticated link to a hub on its own tailnet and an Android app with a tailnet identity,
and can relay HTTP over that link. `yajna serve` today serves one repo on a loopback TCP
port (ADR-0027) and writes only behind a one-time token (ADR-0030).

ank chose on 2026-11-14: one app, saarthi's; yajna keeps its logic and its API and knows
nothing of phones or hubs; saarthi relays to a yajna service on each machine; that service
is started on demand by saarthi for now and becomes always on when the bench work needs it.

## Decision

- **One service per user per machine.** `yajna serve --socket <path>` answers on a unix
  socket, mode 0600, for every notebook in the registry (ADR-0032, config and state):
  `GET /api/notebooks` lists them by namespace, and each one's site, files, reviews and
  API are under `/n/<namespace>/`. `--root` with a port keeps today's single-repo server.
  No authentication beyond the socket's permissions; the Host check of ADR-0027 applies
  to TCP only.
- **Optional.** The CLI, agents and git keep working with the service stopped; it holds
  caches (the index, live watchers) and work in progress, never the only copy of anything.
  The CLI does not become its client: both link the same code.
- **Started on demand, then always on.** At first saarthi's node starts it on the first
  request and stops it when idle (saarthi's ADR-0052). Once run sheets exist (phase 2b) it
  runs as a user service declared in neusis (a launchd agent, a systemd user unit), so
  timers, ticks and watchers do not depend on a request; the binary and socket stay the
  same.
- **How it writes.** Writes over the socket need no `--review` token: the socket is the
  owner's. It appends (log lines, `events.jsonl`, review threads) or creates new pages; it
  never rewrites a page someone may be editing and never commits in a working tree. Every
  counter ID is allocated under a lock file beside `notes/counters.yaml`, which the CLI
  starts taking too. A write carries an id the client chose, and one already applied is
  not applied again (a phone retries).
- **Reached from elsewhere through saarthi.** The service never listens on the network;
  saarthi's hub relays its owner's clients to it. Whether a central git remote is still
  wanted is left to phase 3.

## Alternatives considered

- yajna's own central server reached over Tailscale (section 8): one machine holding
  every notebook, its own tokens and listener, and the phone talking to it directly; the
  files and runs of a machine are on that machine, so it would still need a reach into
  each.
- A daemon only when there is background work: on-demand starts cover reading and
  writing, but run sheets' timers and watchers cannot wait for a request.
- yajna linked into saarthi's node: one process, but yajna would need saarthi.
- One server per notebook: a socket and a process per repo, and the phone would have to
  find each.

## Consequences

- Phase 3's HTTP API grows here: it is what the phone uses, versioned by yajna.
- A second writer in working trees; the write rules above and the counter lock are what
  keep it safe, and a test runs the CLI and the service allocating IDs at once.
- The native phone app of phase 4 is saarthi's app; capture there goes through this API.
