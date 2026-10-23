---
id: AGS-20261023-p4r0pz
type: agent_session
schema_version: 1
title: Improve the yajna skill from experience
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-23T21:09+01:00
finished: 2026-10-23T21:09+01:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-10-23
author: agent:claude
---

## Task
ank asked whether the yajna skill could be improved from experience of working in yajna
projects, and if so to change it, commit and push.

## What happened
- Compared the skill with what this session's work actually needed: designing the files
  viewer (interview, ADRs, a design doc, experiments, Progress items) and building step 1.
- Gaps found and filled in `plugins/yajna/skills/yajna/SKILL.md`:
  - `AGS` pages: one per task, every field filled, `finished` from the closing log line
    (this session first wrote a guessed finish time and had to correct it).
  - Running the CLI without a terminal: checked in a scratch repo that a missing argument
    exits with an error and does not prompt, and that `yajna new` prints the path last;
    in a `project` repo `--project` is not needed; templates' placeholder lines must be
    replaced.
  - A *Designing and planning* section: ask the author in rounds, decision records with
    alternatives, an experiment per unchecked assumption run before the step that needs
    it, the plan as *Progress* items, dropped approaches in *Lessons*.
  - `git add -N` before Nix sees new pages; committing only the task's files with
    `git commit --only`; a mirror pull can be thrown away and repeated.
- `docs/conventions.md` follows (Agents, Experiments). Plugin 0.8.0, yajna 0.5.1 because
  the skill is embedded in the binary. `claude plugin validate --strict` passes.
- Noticed, not fixed: `yajna new experiment` without a title says "a title is required
  for a experiment".
