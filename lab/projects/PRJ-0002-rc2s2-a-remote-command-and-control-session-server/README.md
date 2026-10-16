---
id: PRJ-0002
type: project
schema_version: 1
title: rc2s2 - A remote command and control session server
status: active            # active | paused | concluded | archived
code: projects/rc2s2-a-remote-command-and-control-session-server               # projects/<name> here, or a repository URL once it moves out
created: 2026-10-16
author: ank
tags: []
---

## Current belief
There are a lot of existing ways to drive agents remotely.
We do not want to reinvent that, what we are looking for is a highly custom and integrated command and control center.
This should involve writing a server that is aware of all the running agentic session. It should be able to intercept and intervene.
The server should maintain records of all the runs and node health metrics.
We also need small wrappers for claude, antigravity cli, pi and other agent harness to implement the server features.
There should be multiple clients like: android, iOS, web and custom integrations into another app.

## Open questions
-
- Remaining after phase 0: see the end of `projects/rc2s2-a-remote-command-and-control-session-server/docs/architecture.md`.

## What not to try again
-

## Experiments
- [[EXP-0001]]
- [[EXP-0002]]
- [[EXP-0003]]
- [[EXP-0004]]
- [[EXP-0005]]
- [[EXP-0006]]
- [[EXP-0007]]
- [[EXP-0008]]
- [[EXP-0009]]
