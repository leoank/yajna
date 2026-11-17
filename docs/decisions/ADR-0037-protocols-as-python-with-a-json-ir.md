# ADR-0037: Protocols as Python programs, a JSON command stream as the artifact

Status: proposed
Date: 2026-11-17
Phase: protocol framework, Phase 0 ([[PHS-20261117-fysmxe]])
Source: `docs/protocol-framework.md` sections 2, 5.3 and 9

## Context

`docs/protocol-framework.md` designs protocols written as code, modelled on the Opentrons
Python Protocol API, with humans as the default executor. Building Phase 0 (core and
render) needs three of its open questions settled: what the source language is, whether
the intermediate representation (IR) is our own schema or Autoprotocol's, and which units
library to use. The design doc leans on all three; this record makes the lean a decision
so the code has something to stand on.

## Decision

- **Python is the source, the IR is the artifact.** A protocol is a Python file with
  `metadata`, `requirements`, optional `add_parameters(p)` and `run(ctx)`. Running it
  against a context records a JSON command stream; every backend reads that JSON, not
  the Python objects. The renderer takes IR in and gives markdown out, so `render` works
  on a pinned `protocol.json` as well as on source.
- **The package is Python, standard library only**, in `tools/yajna-protocol/` (import
  name `yajna_protocol`, command `yajna-protocol`). It is not part of the Rust CLI:
  protocols are Python programs, so the thing that runs them is Python. The Rust CLI
  delegates to it later, as it delegates nothing else today.
- **Our own IR schema**, versioned by `ir_version`, its JSON Schema shipped with the
  package (`tools/yajna-protocol/schema/ir.json`), not in `schema/`, which describes
  pages. Human steps, observations, decisions and checks have no home in Autoprotocol;
  a lossy export to it can come with the robot backends.
- **A small internal unit type** rather than `pint`: a quantity is a value in a base unit
  of one dimension (volume uL, mass mg, time s, temperature C, g-force xg, speed rpm,
  molar nM, mass concentration ng/uL, percent, fold). Arithmetic within a dimension,
  scaling by numbers, and a mismatch is an error. That covers bench protocols; a
  dimensional algebra (moles from mass and molecular weight) is not needed yet.
- **`xg` is g-force and `g` is grams.** The design doc's example imported `g` for a
  centrifuge; with typed quantities, passing grams to `centrifuge(force=...)` is an error,
  so the short name goes to the more common unit in recipes.

## Alternatives considered

- **A declarative source (YAML, Autoprotocol JSON, LabOP).** Loops over samples, serial
  dilutions and derived volumes are awkward or impossible; static analysis is direct but
  the IR gives us that anyway (design doc, section 2).
- **Rust, inside the CLI.** One binary is the rule for the CLI (ADR-0017), but a protocol
  author would then write in a DSL the CLI interprets, losing Python's loops and
  libraries, which is the point of the design.
- **Adopting Autoprotocol's schema.** Free interoperability with a dormant ecosystem, at
  the cost of bending human steps into instructions it does not have. Reading it before
  freezing the IR remains on the phase's list.
- **`pint`.** Correct and complete, but heavy, slow to import, and its formatting is not
  what a person at the bench says. The internal type is a few hundred lines.

## Consequences

- The flake gains a Python package and a check that runs its tests.
- The IR schema is a commitment like frontmatter: a breaking change bumps `ir_version`.
- Observations in arithmetic (a volume computed from a measured OD) have no rendering yet;
  `ctx.decide` and `ctx.when` cover choices between known values and between blocks of
  steps. The corpus will say whether more is needed.
