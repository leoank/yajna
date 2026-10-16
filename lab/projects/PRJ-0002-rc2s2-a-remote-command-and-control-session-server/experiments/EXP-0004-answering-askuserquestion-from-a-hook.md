---
id: EXP-0004
type: experiment
schema_version: 1
title: Answering AskUserQuestion from a hook
project: PRJ-0002
status: active           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-16
author: ank
protocols: []
materials: []
tags: []
review: pending
---

## Question
Can a hook answer `AskUserQuestion` so the phone can reply without a terminal? Phase 0
spike 4.

## Hypothesis and predictions
`AskUserQuestion` is a tool, so `PreToolUse` fires with the questions in `tool_input`.
If `updatedInput` can carry an `answers` field the tool returns at once with those
answers; otherwise the terminal prompt still appears and the fallback is the PTY from
[[EXP-0003]].

## Plan
1. Hook server from [[EXP-0001]] with a `PreToolUse` matcher on `AskUserQuestion`
   returning `permissionDecision: allow` and `updatedInput` with the original questions
   plus an `answers` map.
2. Run `claude -p` with a prompt that forces a question and then reports the answer.
3. If that fails, try the same through `PermissionRequest` and record what the terminal
   shows.

## Success criteria
- The assistant reports the hook-supplied answer with no terminal interaction, or the
  negative result is recorded with the exact behaviour seen.

## Findings
- **A hook can answer AskUserQuestion.** The tool input is
  `{questions: [{question, header, options: [{label, description}], multiSelect}]}` and the
  answer is an added `answers` map from question text to the chosen option label, passed back
  as `updatedInput` from either `PreToolUse` (allow) or `PermissionRequest` (allow). The tool
  returns at once with those answers and the terminal shows "User answered Claude's questions".
- **Use the PermissionRequest path.** It fires after PreToolUse, can be held while the phone
  decides, and follows the same release rule as permissions ([[EXP-0001]], [[EXP-0003]]).
  PreToolUse is the fallback.
- Multi-select questions and free-text "Other" answers were not tested; the `answers` value
  for those is probably a comma-joined label list or the free text, to check in phase 1.
- `AskUserQuestion` does not exist in `-p` mode, so spawned sessions never block on it.

## Runs
- [[RUN-20261016-n3dw]] headless: tool unavailable
- [[RUN-20261016-bomu]] interactive: PreToolUse answers, no dialog
- [[RUN-20261016-4bcy]] interactive: PermissionRequest answers

## Conclusion
Written once, by a human, when status becomes `concluded`.
