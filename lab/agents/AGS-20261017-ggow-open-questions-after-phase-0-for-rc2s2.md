---
id: AGS-20261017-ggow
type: agent_session
schema_version: 1
title: Open questions after phase 0 for rc2s2
model: claude-fable-5-1
harness: claude-code 2.1.302
started: 2026-10-17T13:20+01:00
finished: 2026-10-17T14:20+01:00
created_entities: [RUN-20261017-5jwo, RUN-20261017-tnz7, RUN-20261017-syvm, RUN-20261017-nm55, RUN-20261017-nn7f, RUN-20261017-dqyz, RUN-20261017-trj6, RUN-20261017-ho7k, RUN-20261017-ejq2]
edited_entities: [EXP-0002, EXP-0004, EXP-0005, EXP-0007, EXP-0008]
outcome: done             # done | failed | aborted | pending
created: 2026-10-17
author: ank
---

## Task
Resolve the open questions left at the end of the rc2s2 architecture doc after phase 0, with
the owner's permission to use their main Claude account for the credential refresh test, and
fold the answers into the experiment pages and the architecture doc. Work in the new
`rc2s2/core` worktree.

## What happened
Nine runs across five experiments, Claude Code 2.1.302. Four were delegated to subagents
([[EXP-0002]] usage cache, [[EXP-0004]] answer formats, [[EXP-0005]] messaging socket,
[[EXP-0007]] unix-socket hook); the credential runs ran in this session.

The credential test had a real cost: forcing a refresh in a leased copy of the owner's
keychain credential ([[RUN-20261017-5jwo]]) rotated the pair and revoked the old one at once,
which logged the owner out of Claude Code and killed all four subagents mid-run; the owner
ran `/login` and the agents were resumed. The control run ([[RUN-20261017-tnz7]]) showed
that separate logins are separate grants and that `claude auth logout` revokes one. The
design change: an account in the hub is a set of slots, one login each, leased one at a time.

Other answers: prompts can be delivered over the per-session messaging socket as one JSON
line, interrupts still need the PTY ([[RUN-20261017-ejq2]]); AskUserQuestion multi-select
answers are arrays of labels and free text is any string ([[RUN-20261017-nm55]],
[[RUN-20261017-nn7f]], [[RUN-20261017-dqyz]]); a unix-socket command hook crosses the
seatbelt boundary with loopback TCP denied ([[RUN-20261017-syvm]]); only `/usage` writes
`cachedUsageUtilization`, and the usage endpoint answers a bearer request directly
([[RUN-20261017-trj6]], [[RUN-20261017-ho7k]]). The owner's Android tsnet decision was
recorded. No open questions remain from phase 0. Nothing was committed.
