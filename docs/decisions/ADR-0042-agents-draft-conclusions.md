# ADR-0042: Agents draft an experiment's conclusion; a human approves it

Status: accepted
Date: 2026-11-23
Amends: the agent write rules in `docs/architecture.md` (section 7), and the conventions'
"write `Conclusion` once, by hand"

## Context
The *Conclusion* of an experiment, with its `status: concluded` and `outcome`, was written
by a human only. An agent that finished an experiment proposed a conclusion in the log or
its `AGS` page and left the experiment `active` until the human came to write it. Agents
now run experiments faster than ank can conclude them, so finished work sits as `active`,
the experiment tree shows it as open, and the next agent reading the tree does not know
what was found. ank asked on 2026-11-23 for agents to write draft conclusions and set the
status and outcome themselves, shown as drafts in the tree, for a human to read, edit if
needed and approve afterwards.

The approval machinery already exists: an agent's edit to an `EXP`, `PRO` or `MAT` page
carries `review: pending`, and only a human turns it into `review: approved` with an
approval record (`yajna approve`, or a review that covers the page; ADR-0030).

## Decision
- **An agent may conclude an experiment.** It writes *Conclusion*, sets `status:
  concluded`, `outcome` and keeps `review: pending` on the page, as for any edit to a
  curated page. The page's *Runs* lines, the log and the `AGS` page carry the evidence.
- **The draft is the record until a human approves it.** A concluded experiment with
  `review: pending` is a draft conclusion. The human reads it, edits it if needed, and
  runs `yajna approve EXP-…` (or approves it in a review). Once approved, an agent does not
  rewrite the conclusion; a later finding goes into a new experiment that names this one in
  `influenced_by`, or, if the conclusion is wrong, into the log for the human to act on.
- **Drafts are visible.** Wherever an experiment shows its outcome, a draft says so: the
  experiment tree (site and app) draws it in its outcome's colour, faded, with a dashed
  ring and "draft conclusion, awaiting approval" in its tooltip; `yajna tree` marks the
  line; the status chips add a *draft* chip. An approved conclusion looks as before.
- Nothing in `yajna validate` changes: an agent's edit without `review: pending` and an
  approval by an agent were already errors.

## Alternatives considered
- **Keep conclusions human-only, and only show the agent's proposal.** The tree would still
  show finished work as open, which is what makes the human the bottleneck.
- **A separate `draft_conclusion` section or field.** Two places for one finding, and the
  human has to move the text across when approving; `review: pending` already means "an
  agent wrote this and a human has not signed it".
- **A new status (`concluded-draft`).** Every reader of `status` would need to learn it, and
  it duplicates what `review` says.

## Consequences
- Experiments reach `concluded` when the work ends, not when the human next has time; the
  tree is current for the next agent, with drafts marked.
- The human's job moves from writing conclusions to approving them, in any order and in
  batches (`yajna approve` takes several IDs).
- A wrong draft can be read as settled by someone who ignores the marking; the marking is
  on every view for that reason, and `review: pending` stays until a human acts.
