---
description: Bootstrap a new yajna project from a brief through an interview with the author, then create the PRJ page, first experiments and the session record
argument-hint: [title or a one-paragraph brief]
---

Bootstrap a new project in this yajna notebook. The brief, if any: $ARGUMENTS

Load the `yajna` skill first and follow it throughout (author handle, IDs from the CLI,
log lines, the `AGS` session page, `yajna validate` before you report).

## 1. Context before questions

Spend a few minutes reading before you ask anything, so the interview starts from what the
notebook already knows:

- `yajna tree` for every existing project (`yajna show PRJ-xxxx` for their pages): is this
  brief a new project or an experiment inside an existing one? Say so if it is the latter.
- `yajna tasks` and the last weeks of `notes/log/` for related intentions.
- `references/library.bib` and `notes/references/` for reading notes that bear on the brief.
- The brief itself. Extract what it already answers so you do not ask it again.

## 2. The interview

The point is to nail the project down with the author, not to guess. Ask with the
AskUserQuestion tool, one topic at a time, each question grounded in what you read; offer
concrete options where you can and always leave room for a free answer. Keep going until
every item below has an answer or the author says it is open on purpose. When an answer
changes an earlier one, say so and re-confirm. Stop when the author says stop.

Topics, in order:

1. **The question.** What would we know at the end that we do not know now? One sentence
   the author agrees with verbatim; it becomes the first line of *Current belief*.
2. **Why it matters and for whom.** Thesis chapter, a paper, a tool for the lab, curiosity.
3. **Success and failure.** What result would settle it either way; what "done" looks like
   in three months; what is explicitly out of scope.
4. **What is already known.** Prior work, the author's own earlier experiments
   (`yajna tree`), reading to cite (`@citekey`), and what not to try again.
5. **Constraints.** Time, money, hardware, data, compute, safety or ethics, collaborators,
   deadlines.
6. **Risks and unknowns.** The three ways this most likely fails; which assumption to test
   first because everything else rests on it.
7. **First experiments.** Two or three experiments that would be worth running first, each
   with a question and a success criterion, ordered by what they unblock.
8. **Decisions still open.** Anything the author wants recorded as undecided rather than
   guessed.

Then read back a one-screen summary (question, success criteria, scope, constraints, first
experiments, open questions) and get an explicit yes before writing anything.

## 3. Write it down

1. `yajna new project "<title>"` (add `--code` when the project will have code; the
   domain-specific commands say when). Fill the page: *Introduction* for a reader who has
   never heard of it, *Current belief* as a paragraph in the author's words, *Open
   questions* and *What not to try again* as lists (a code project's page has *Status*,
   *Design*, *Roadmap* and *Lessons* instead), and the decisions under a heading of their
   own with the reason for each.
2. `yajna new experiment "<question>" --project PRJ-xxxx` for each first experiment;
   fill *Question*, *Hypothesis and predictions*, *Plan* and *Success criteria* from the
   interview. Leave *Conclusion* empty.
3. Note cited reading with `@citekey`; `yajna ref <key> --note` creates a reading note
   where one is missing.
4. Log one line linking the new pages; update your `AGS` page's `created_entities`.
5. `yajna validate`. Report the new IDs and the open questions you left for the author.

Nothing here is committed by you unless the repo's AGENTS.md says otherwise.
