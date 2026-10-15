# ADR-0014: Protocols are jotted first and codified later

Status: accepted
Date: 2026-10-15
Phase: 0 (step convention), framework Phase 0 (render)
Source: `docs/protocol-framework.md` sections 2.2 and 8

## Context

Protocols must be quick to write on the day and, eventually, executable by humans, robots
and the chip compiler from one source. Demanding code up front kills capture.

## Decision

A `PRO` page starts as free text with `stage: text`, using the shared step convention
(numbered steps with attribute blocks). A codified version in Python, modelled on the
Opentrons API, can be attached later and sets `stage: codified`. From then on the page's
steps are generated from the code by `render`, and CI fails if hand-edited steps drift from
the render. The command vocabulary of the codified form is the front end of the
microfluidic compiler described in `docs/microfluidic-compiler.md`.

## Consequences

- Phase 0 only needs the step convention in schema v1 and the `stage` field. The renderer
  lands with framework Phase 0, which runs alongside.
- Three corpus protocols (`corpus/protocols/`) are the fixtures that prove the render.
