---
id: AGS-20261103-j9yg23
type: agent_session
schema_version: 1
title: Remote runs driven from the laptop, and shell completion of IDs
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-11-03T16:35+00:00
finished: 2026-11-03T16:56+00:00
created_entities: []
edited_entities: [PRJ-0001]
outcome: done             # done | failed | aborted | pending
created: 2026-11-03
author: agent:claude
---

## Task
Drive `--on <host>` from the laptop so the other machine is only a runner, and add shell
completion of IDs; both under [[REV-20261103-j9yfse]].

## What happened
- Completion: `clap_complete` with `unstable-dynamic`; `src/complete.rs` answers each ID
  argument from the notebook found from the shell's directory (`--root` is not parsed during
  completion). Installed by `source <(COMPLETE=zsh yajna)`, per clap's advice to regenerate
  the hook at shell start rather than ship a file.
- `--on`: `rerun.rs` restructured around one `Tree`, here or on a remote; what is decided
  from history is decided here. ADR-0033 amends ADR-0031. Tested with an `ssh` stand-in that
  runs the command locally against a second clone, so fetch, worktree, tar both ways and
  clean are real; not yet against oppy.
- Decided without asking: `run clean` got `--on`; `--out-root` with `--on` must be an
  absolute path on the remote; the remote's changes check reads the same overlay list as
  here, plus the new run's directory there; the test harness clears `YAJNA_AUTHOR`.
- A duplicate review, REV-20261103-j9zv6z, made by re-running `review open` to read its
  output, was removed before anything was committed.
- Nothing committed.
