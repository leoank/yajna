---
id: REV-20261117-fysnjm
type: review
schema_version: 1
title: "Protocol framework Phase 0: core, IR and render"
project: null
target:
  kind: branch              # branch | range | page | run | experiment | phase
  ref: yajna/protocol-framework
base: cad3e8b2dd41a5e9265356057e61e9b01b4d5006
head: 595b9cd8be604a42991b1d13cdbaf4a758ef5b58
rounds: [cad3e8b2dd41a5e9265356057e61e9b01b4d5006, 7d1aa61f7ae1bf278de9db08d1cb2b197b67d9d8]
paths: []
about: [PHS-20261117-fysmxe, PRJ-0001]
status: approved          # open | changes_requested | approved | merged | closed
created: 2026-11-17
author: agent:claude-yajna-protocol-framework
---

## Summary
Phase 0 of the protocol framework ([[PHS-20261117-fysmxe]], `docs/protocol-framework.md`):
a protocol written as a Python program is recorded as a JSON command stream (the IR) and
rendered into the `## Steps` a `PRO` page already uses, so a codified protocol's page is
generated from its code and a stale page fails a check. Simulation, execution and robots
are later phases that will read the same IR. ADR-0037 (accepted by you) records the
choices: Python source, our own versioned IR schema, a small internal unit type instead
of `pint`, `xg` for g-force and `g` for grams.

**Where to look:**
- `tools/yajna-protocol/`, standard library only, about 1,800 lines: `context.py` (the
  commands, groups, stable step keys, observations, `ctx.decide` and `ctx.when`),
  `render.py` (IR to markdown at `expert` verbosity), `units.py`, `resources.py`,
  `params.py`, `page.py` (`yajna-protocol page` and `--check`), `schema/ir.json`, and
  `cli.py` for `yajna-protocol ir|render|page`.
- Its tests (30, with a golden render of the design doc's transformation protocol), run
  by `checks.yajna-protocol` in `flake.nix`, which also gains the package and a
  `yajna-protocol` in the dev shell.
- The worked example, `tools/yajna-protocol/examples/lab/`: a small lab whose PRO-0001,
  a spin-column miniprep, is generated from its `protocol.py`, checked by the tests and
  validated in `checks.notes`.
- Docs: the guide's new *Protocols as code*, `docs/conventions.md` on codified protocols,
  the skill's rule that their steps are never edited by hand.
- e1cd46c (0.33.0): `yajna validate` reads a protocol's `source` as a path rather than a
  link into a notebook called `protocols`, and fails a codified protocol whose source is
  missing; `vault.rs` `is_path_field`, `validate.rs`, and a test in `tests/cli.rs`.

**Worth a second look:** step keys (`prepare.add_cells[T1]`) do not move when the number
of samples changes, which run sheets and timings across runs will rely on; a plain `if`
on an observation renders the arm it assumed and says so; arithmetic on a measured value
is refused for now; the IR schema becomes a commitment like frontmatter once anything
reads it.

**Not done, on the phase page:** three corpus protocols converted (in manthan, where the
corpus lives), `yajna protocol` in the Rust CLI delegating to the package, reading
Autoprotocol before the IR leaves version 1, `guided` and `novice` verbosity, the rest of
the command vocabulary, paired transfers as one step, and `page` filling `materials` and
`equipment` from the code.
- 2026-11-18 12:07 ank approved: Look good for now. we'll iterate on it later.

## Threads
