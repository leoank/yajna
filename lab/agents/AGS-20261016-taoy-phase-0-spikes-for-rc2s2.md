---
id: AGS-20261016-taoy
type: agent_session
schema_version: 1
title: Phase 0 spikes for rc2s2
model: claude-fable-5-1
harness: claude-code 2.1.289
started: 2026-10-16T22:32+01:00
finished: 2026-10-16T23:05+01:00
created_entities: [EXP-0001, EXP-0002, EXP-0003, EXP-0004, EXP-0005, EXP-0006, EXP-0007, EXP-0008, EXP-0009, RUN-20261016-2g2t, RUN-20261016-3fsr, RUN-20261016-45yh, RUN-20261016-4bcy, RUN-20261016-5haw, RUN-20261016-6q4u, RUN-20261016-bomu, RUN-20261016-bs6e, RUN-20261016-ekdf, RUN-20261016-eodq, RUN-20261016-f4kf, RUN-20261016-gdca, RUN-20261016-indz, RUN-20261016-ixeg, RUN-20261016-k3cb, RUN-20261016-kpgt, RUN-20261016-lkbz, RUN-20261016-n3dw, RUN-20261016-ohgq, RUN-20261016-qnhz, RUN-20261016-zmpp, RUN-20261016-zu4c]
edited_entities: [PRJ-0002]
outcome: done
created: 2026-10-16
author: ank
---

## Task
Run the phase 0 spikes of `projects/rc2s2-a-remote-command-and-control-session-server/docs/architecture.md`
and the experiments for its open questions, one experiment page per question with run pages,
then fold the findings back into the architecture doc.

## What happened
Nine experiments, [[EXP-0001]] to [[EXP-0009]], all on this machine with Claude Code 2.1.289.
Four were delegated to subagents ([[EXP-0002]], [[EXP-0006]], [[EXP-0007]], [[EXP-0009]]); the
rest ran in this session. Every experiment has a `## Findings` section and `review: pending`;
conclusions, status and outcome are left for a human. Throwaway code is under the project's
`spikes/` directory and staged in git, not committed.

Changes to the plan that came out of it: the permission hold is released on any terminal
keystroke instead of an idle timer; AskUserQuestion is answered through the PermissionRequest
hook; the PermissionRequest hook is the headless permission callback, so no MCP permission
tool; credentials are leased as a file into a per-session `CLAUDE_CONFIG_DIR`; the hook
endpoint inside a sandbox should be a unix socket; libtailscale links through a hand-written
sys crate. Open questions that remain are listed at the end of the architecture doc.

Two tool issues seen: `yajna new` with a colon in the title writes invalid YAML, and the
agent-session template's `finished: null` fails the schema until it is set. Two stray
headless turns were spent when a wrong id was passed to `claude logs` and `claude stop`,
which start a new session instead of failing.
