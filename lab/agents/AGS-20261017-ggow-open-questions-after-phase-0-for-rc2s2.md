---
id: AGS-20261017-ggow
type: agent_session
schema_version: 1
title: Open questions after phase 0 for rc2s2
model: claude-fable-5-1
harness: claude-code 2.1.302
started: 2026-10-17T13:20+01:00
finished: 2026-10-17T19:22+01:00
created_entities: [RUN-20261017-5jwo, RUN-20261017-tnz7, RUN-20261017-syvm, RUN-20261017-nm55, RUN-20261017-nn7f, RUN-20261017-dqyz, RUN-20261017-trj6, RUN-20261017-ho7k, RUN-20261017-ejq2, RUN-20261017-mm42]
edited_entities: [EXP-0001, EXP-0002, EXP-0003, EXP-0004, EXP-0005, EXP-0006, EXP-0007, EXP-0008, EXP-0009]
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
recorded. No open questions remain from phase 0.

Continued later the same day after the owner's review. The owner asked whether one account
can run many sessions, as their terminals do; the answer from the code read is yes, as long
as they share one credential store, so the leasing section of the architecture doc was
rewritten: a slot is leased to a node, not a session, any number of sessions share it, and a
node holds one slot per account. The owner had set `review: done` on eight experiment pages,
which the schema rejects; changed to `approved` at their request. Committed as `7f5d8f4`.
The two-session refresh test was planned as [[RUN-20261017-mm42]] with scripts and deferred,
since it needs a fresh browser login (`2f1f257`). Last, a handoff document for the next
agent, `docs/HANDOFF.md` in the code directory, since the project is about to graduate to
its own repository.
