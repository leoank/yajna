# Protocols, materials and equipment

These are the things experiments use, shared across projects in a lab. They have counter
IDs (`PRO-0012`, `MAT-0210`, `EQP-0007`, `BLD-0003`) because people refer to them by name.
Create and edit them on `main`, not on a branch.

## Protocols

```sh
yajna new protocol "Sulfolobus transformation"
```

A protocol page is free markdown except for `## Steps`, an ordered list in which each step
may end with an attribute block in YAML flow syntax:

```markdown
## Steps
1. Thaw [[MAT-0210]] on ice. {duration: 15m, materials: [MAT-0210], check: "tube on ice"}
2. Add 200 uL of buffer to each tube. {duration: 5m, materials: [MAT-0042], volume: 200uL}
3. Spin at 4000 g. {duration: 10m, equipment: [EQP-0007], hazard: "balance the rotor"}
4. Incubate at 37C. {duration: 2h, wait: true, equipment: [EQP-0002]}
```

| Attribute | Example | Meaning |
|-----------|---------|---------|
| `duration` | `15m`, `2h`, `1h30m`, `90s` | How long the step takes |
| `wait` | `true` | Hands-off time: you can do something else |
| `materials` | `[MAT-0210]` | Materials the step uses |
| `equipment` | `[EQP-0007]` | Instruments it needs |
| `volume`, `temp` | `200uL`, `37C` | Quantities, as written |
| `hazard` | `"balance the rotor"` | A safety note |
| `check` | `"tube on ice"` | What to verify before going on |
| `actor` | `agent:robot` | Who or what performs the step |

Other keys are allowed. Steps are numbered 1 to n without gaps, and validation checks that
the IDs they name exist.

**Versions.** `version` starts at 1. Bump it whenever a step changes, and say why under
*Notes*. Link the version you followed: `[[PRO-0012@3]]`. A step has a stable address,
`PRO-0012@3.s4`: protocol, version, step.

**Status** is `draft`, `active` or `deprecated`; **kind** is `bench`, `assembly` or
`compute`. `stage: text` is the default; a protocol rewritten as code
(`stage: codified`, with `source:`) has its steps generated from that code from then on.

## Materials

```sh
yajna new material "BY4741" --kind strain
```

Kinds: `strain`, `plasmid`, `cell_line`, `reagent`, `stock`, `library`, `antibody`,
`dataset`, `model`, `checkpoint`, `part`, `other`.

Keep the stock fields current, because they are what a planning agent checks a protocol's
material list against:

```yaml
status: in_stock          # in_stock | low | out | ordered
location: "-80 freezer B, rack 3, box 2, A4"
quantity: 12
unit: vials
```

*Provenance* says where it came from: who made it, from what, and which run produced it.
Hardware parts are materials of kind `part`, with `supplier`, `part_number`, `url` and
`lead_time`.

Plasmid maps exported from Benchling can be imported as materials; see [Exporting and
importing](export-import.md#importing-from-benchling).

## Equipment

```sh
yajna new equipment "Spinning disk"
```

`status` is `available`, `booked`, `broken` or `retired`. The page has room for a
description, booking notes and a calibration history; record calibrations as runs of kind
`calibration`.

## Builds

A build is a piece of hardware you are making: a bench rig, a microscope stage, a
microfluidic chip.

```sh
yajna new build "Bench camera rig" --project PRJ-0004
```

It belongs to a project, carries a `revision`, and moves through `designing`, `ordering`,
`assembling`, `testing`, `deployed` and `retired`. The page has a bill of materials table,
a list of revisions and the tests and calibrations it has passed. `sources` points at the
design files under `code/`, `parts` lists the `MAT` pages of its parts, and `produces`
names the equipment it becomes once deployed. Assembly sessions are runs of kind
`assembly`.
