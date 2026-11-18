---
id: PHS-20261117-fysmxe
type: phase
schema_version: 1
title: "Protocol framework: protocols as code (Phase 0, core and render)"
project: PRJ-0001
status: active
since: cad3e8b2dd41a5e9265356057e61e9b01b4d5006
until: null               # the commit it finished at: yajna phase done
created: 2026-11-17
author: agent:claude-yajna-protocol-framework
tags: []
---

## Goal
Phase 0 of `docs/protocol-framework.md`: a protocol written as a Python program renders
into the `## Steps` convention a `PRO` page already uses, through a JSON command stream
(the IR) that later phases (simulate, execute, the Opentrons and chip compilers) consume.
Done when three protocols from the corpus (`docs/protocol-corpus.md`) are code-native,
their rendered pages are as useful at the bench as hand-written ones, and a stale render
fails a check. Simulation, execution and robots are later phases of the same design.

## Progress
One item per piece of work, ticked when it lands; add items as the plan grows and keep the
done ones. The project page's *Progress* lists this phase on one line.
- [x] ADR: Python source, JSON IR as the artifact; own IR schema; small internal units
- [x] Package skeleton `tools/yajna-protocol/`, standard library only, its tests in `nix flake check`
- [x] Units: typed quantities (volume, mass, time, temperature, concentration, g-force, speed), rendered as a person says them
- [x] Resources and parameters: containers, materials with liquid classes, equipment, `add_parameters()` with typed, range-checked values
- [x] Commands: the core vocabulary, `step()` escape hatch, groups, stable step keys, observations with defaults and decisions
- [x] IR: the resolved command stream as JSON, versioned, with a JSON schema (`tools/yajna-protocol/schema/ir.json`)
- [x] Render: the step convention at `expert` verbosity, loops collapsed, attribute blocks the validator accepts
- [x] `yajna-protocol render|ir` command, and `PRO` page generation: `## Steps` regenerated from `source:`, `--check` fails a stale render
- [x] The design doc's transformation protocol as the first worked example, rendered in a test
- [ ] Three corpus protocols converted (in the lab repo, where the corpus lives), scorecard rows written
- [ ] `yajna protocol` in the Rust CLI delegating to the package, and `checks.protocols` for code-native protocols
- [x] `yajna validate` treats a protocol's `source` as a path and fails a codified protocol whose source is missing (0.33.0)
- [x] ank accepts or changes ADR-0037 (Python, own IR, internal units, `xg`/`g`)
- [ ] Read Autoprotocol before the IR schema leaves version 1
- [ ] `guided` and `novice` verbosity (design doc 5.4): liquid-class hints, instrument wrappers, loops expanded
- [ ] The rest of the command vocabulary of section 3.2 (open, close, seal, filter, sonicate, wash, inoculate, pick_colony, ...), added as the corpus asks for them
- [x] A worked example lab (`tools/yajna-protocol/examples/lab/`): a miniprep as a codified `PRO-0001` with its materials and equipment, `page --check` in the tests and the lab validated in `checks.notes`
- [x] The guide's *Protocols as code* page, and the design doc in the book
- [ ] Paired transfers (`T1` to `C1`, `T2` to `C2`) render one step per pair; collapse them into one step
- [ ] `yajna-protocol page` fills the page's `materials` and `equipment` from the code (the example lists them by hand)

## Notes
- The corpus and `tools/corpus/corpus.py` run from a lab root (`leoank/manthan`), so the
  three-protocol verification happens there; this repo carries the package, its tests and
  the worked example.
- `schema/step.json` constrains `duration` to `1h30m`-style values, so named durations
  such as "overnight" render as text with a numeric attribute (`16h`).
- A measured value cannot be computed with yet (a volume from an OD): `ctx.decide` picks
  between known values and `ctx.when` between blocks of steps. The corpus decides whether
  a symbolic calculation step is needed.
- `yajna renumber PRO-…` rewrites IDs in frontmatter strings; whether it should also move
  `notes/protocols/PRO-…/` and rewrite `source:` is open.
