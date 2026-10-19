---
description: Bootstrap a software project in the notebook, interviewing the author on the architecture, then scaffold code/<slug>/ with a flake, a design doc with decisions, and the first spikes as experiments
argument-hint: [title or a one-paragraph brief]
---

Bootstrap a software (dry-lab) project. Brief: $ARGUMENTS

Run `/yajna:project` for the general interview and deliverables; this command adds the
questions and files a code project needs. Load the `yajna` skill first.

## Extra interview topics (after the general ones)

1. **Users and interfaces.** Who or what calls it: a person at a terminal, a phone, an
   agent, another program. CLI, HTTP, MCP, library, file formats. What must stay
   stable (the contract) and what may change.
2. **Data model.** The handful of nouns, their identities and lifetimes, what is the source
   of truth and what is derived and rebuildable.
3. **Components and boundaries.** What runs where (laptop, server, phone, HPC), what talks
   to what, what can be a separate process or repo later. Draw it as a mermaid diagram
   in the design doc.
4. **Language and stack.** With the reason, and what a single-binary or static build
   would cost. Everything builds under Nix: the project flake is the toolchain.
5. **Existing tools and prior art.** What could be reused instead of written; what was
   looked at and rejected, and why.
6. **Verification.** How each phase proves it worked: tests, a scripted session, a demo
   with the author. What goes in `nix flake check`.
7. **Phases.** Three to five phases, each with a deliverable and a verification; the first
   one should take days, not weeks.
8. **Decisions to record.** Each architectural choice with alternatives considered becomes
   a numbered decision record.

## Deliverables beyond the general ones

- `yajna new project "<title>" --code`, then `git add code/<slug>` and
  `nix flake lock ./code/<slug> && nix flake lock .` as the skill and AGENTS.md say.
- `code/<slug>/docs/architecture.md`: goals and constraints, the data model, the
  component diagram, the stack with reasons, phases with verification, open questions.
- `code/<slug>/docs/decisions/ADR-0001-....md` and onward, one per decision, with a
  `README.md` index: context, decision, consequences.
- The first phase's spikes as experiments (`yajna new experiment ... --project`), each
  a question the architecture rests on, run as `compute` runs with a reproducible script.
- The project page uses the code template (`--code`): *Introduction*, *Progress*, *Open
  questions* (what the spikes must answer), *Design* (linking the design doc and
  decisions), *Lessons*, *Experiments*. The phases go into *Progress* as
  its checklist.
