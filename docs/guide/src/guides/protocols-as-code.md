# Protocols as code

A protocol can be written as a short Python program instead of a list of steps. The
program is the protocol; its page's `## Steps` are generated from it. One source then
serves every kind of run: the page a person reads at the bench, the parameters a run
chooses (four samples or twelve, which plasmid), and later a robot or a chip. The design
is in [Protocols as code](../design/protocol-framework.md) and
[ADR-0037](../design/decisions/ADR-0037-protocols-as-python-with-a-json-ir.md); this page
shows how to use what exists so far, Phase 0: writing a protocol and generating its page.

The tool is `yajna-protocol`, a separate command from `yajna`:

```sh
nix run github:leoank/yajna#yajna-protocol -- --help   # or packages.yajna-protocol in a flake
```

Inside this repository's `nix develop` it runs from the checked-out source.

## The worked example

`tools/yajna-protocol/examples/lab/` is a small lab notebook with one codified protocol, a
plasmid miniprep on a spin column, and the materials and equipment it names:

```text
examples/lab/
  yajna.toml
  notes/
    materials/MAT-0001-e-coli-dh5alpha-carrying-puc19.md  ... MAT-0006
    equipment/EQP-0001-microcentrifuge.md, EQP-0002-microvolume-spectrophotometer.md
    protocols/
      PRO-0001-plasmid-miniprep-on-a-spin-column.md        # the page; its steps are generated
      PRO-0001/protocol.py                                 # the code they come from
```

Its tests check that the page's steps match the code, and the flake's checks validate the
notebook, so the example stays current. Copy it to try things.

## Writing a protocol

A protocol file declares what it needs, its identity, its parameters and its steps:

```python
from yajna_protocol import Protocol, minutes, ml, seconds, ul, xg

requirements = {"yajna_protocol": "1"}
metadata = {"id": "PRO-0001", "name": "Plasmid miniprep on a spin column", "version": 1}


def add_parameters(p):
    p.add_material("culture", "Overnight culture", kind="strain", default="MAT-0001")
    p.add_int("n", "Number of cultures", default=4, minimum=1, maximum=24)
    p.add_float("elute_ul", "Elution volume", default=50.0, minimum=30.0, maximum=100.0, unit="uL")


def run(ctx: Protocol):
    culture = ctx.material(ctx.params.culture, name="overnight culture")
    lysis = ctx.material("MAT-0003")
    spin = ctx.equipment("EQP-0001")
    tubes = ctx.tubes(ctx.params.n, kind="tube_2ml")

    with ctx.group("Harvest"):
        ctx.label(tubes)
        ctx.add(culture, 2 * ml, to=tubes, key="culture")
        ctx.centrifuge(tubes, force=6800 * xg, duration=3 * minutes, equipment=spin)
        ctx.discard_supernatant(tubes)

    with ctx.group("Lyse"):
        ctx.add(lysis, 250 * ul, to=tubes, key="lysis")
        ctx.invert(tubes, times=6, hazard="lysis buffer is caustic")
        ...
```

- **`metadata`** names the page's `id` and `version`. They must match the page, so a new
  version is a change to both.
- **Parameters** are typed and bounded: `add_int`, `add_float`, `add_bool`, `add_str`,
  `add_choice` and `add_material` (a `MAT` ID, checked against the notebook). A run sets
  them; the page is rendered for the defaults.
- **Resources.** `ctx.material("MAT-…")` and `ctx.equipment("EQP-…")` are looked up in the
  notebook, so a typo or a missing page is an error and the page shows the title. Equipment
  can also be named by kind (`ctx.equipment(kind="water_bath")`) and bound to a real
  instrument per run. Containers come from a small labware table: `ctx.tubes(n)`,
  `ctx.container("plate_96")` with wells as `plate["A1"]`.
- **Quantities carry units**: `50 * ul`, `2 * ml`, `42 * C`, `3 * minutes`, `200 * rpm`,
  `6800 * xg`. `xg` is relative centrifugal force; `g` is grams. Adding a mass where a
  volume belongs is an error before anything runs.
- **Commands** are the verbs of the bench: `add`, `transfer`, `mix`, `resuspend`,
  `discard_supernatant`, `serial_dilute`, `plate_cells`, `label`, `move`, `invert`,
  `vortex`, `set`, `incubate`, `centrifuge`, `heat_shock`, `thaw`, `freeze`,
  `thermocycle`, `image`, `wait`, `pause` and `safe_stop`. Each takes the attributes a step
  can carry (`check=`, `hazard=`, `checkpoint=`). Anything without a verb is
  `ctx.step("text")`, which renders as written.
- **Groups** (`with ctx.group("Lyse"):`) become `###` headings.

### Decisions at the bench

The program runs before anyone is at the bench, so it cannot know what a measurement will
read. Observations return a stand-in, and a decision on one records both outcomes:

```python
flakes = ctx.check("white flakes in the supernatant", default=False, key="flakes")
ctx.when(flakes, lambda: ctx.centrifuge(tubes, force=17900 * xg, duration=5 * minutes))

od = ctx.measure("od600", of=tube, default=0.3, key="od")
volume = ctx.decide(od < 0.5, 100 * ul, 20 * ul, key="volume")
```

`ctx.when` runs a block of steps only if the condition holds; `ctx.decide` picks between
two values. The page shows the decision as a step and marks the steps of each branch. A
plain Python `if` on an observation also works, but the page then says which branch it
assumed. Arithmetic on an observation (`od * 2`) is an error for now.

### Step keys

Every generated step has a `key`, such as `lyse.lysis[T1]`: the group, then the name given
with `key=` or the step's number within the group, then the container. Keys stay the same
when the number of samples changes, so a run sheet, a timing record or a watcher at the
bench can refer to a step across runs. Give `key=` to any step you expect to refer to.

## From code to page

Create the page as usual, write the code beside it, then generate the steps once with
`--source`:

```console
$ yajna new protocol "Plasmid miniprep on a spin column"
$ $EDITOR notes/protocols/PRO-0001/protocol.py
$ yajna-protocol page notes/protocols/PRO-0001-plasmid-miniprep-on-a-spin-column.md \
    --source notes/protocols/PRO-0001/protocol.py
```

This sets `stage: codified` and `source:` in the frontmatter and replaces `## Steps`;
every other section of the page is kept as you wrote it. From then on, change the code, not
the steps, and regenerate:

```console
$ yajna-protocol page notes/protocols/PRO-0001-*.md            # rewrite the steps
$ yajna-protocol page --check notes/protocols/PRO-0001-*.md    # exit 1 if they are stale
```

The generated steps follow the page convention, each with an attribute block:

```markdown
### Lyse
6. Add 250 uL of Lysis buffer [[MAT-0003]] to T1, T2, T3, T4. {materials: [MAT-0003], volume: 250uL, keys: ["lyse.lysis[T1]", ...]}
11. Check: white flakes in the supernatant. {check: "white flakes in the supernatant", key: lyse.flakes}
13. If white flakes in the supernatant (step 12): Centrifuge T1, T2, T3, T4 at 17900 x g for 5 min in Microcentrifuge [[EQP-0001]]. {duration: 5m, ...}
```

`yajna validate` treats `source` on a protocol page as a path and fails a codified protocol
whose file is missing. Run `--check` in your notebook's flake checks to catch a page that
is behind its code.

## Rendering for a run

The page shows the defaults. For a particular run, render with its parameters:

```console
$ yajna-protocol render notes/protocols/PRO-0001/protocol.py -p n=12 -p elute_ul=30
$ yajna-protocol render tools/yajna-protocol/examples/transformation.py \
    -p plasmid=MAT-0198 -e water_bath=EQP-0004 --no-notebook      # bind an equipment kind
$ yajna-protocol ir notes/protocols/PRO-0001/protocol.py -o protocol.json
```

`ir` writes the command stream the render is made from: JSON, one command per step, with
its resources, quantities and keys (its schema is
`tools/yajna-protocol/schema/ir.json`). Everything after the protocol reads this file,
not the Python, so a saved `protocol.json` renders the same way later
(`yajna-protocol render protocol.json`).

## What is not there yet

Phase 0 renders for an expert reader. Still to come: the guided and novice levels of
detail, a run sheet, a simulator that checks volumes and timings, `yajna protocol` as a
subcommand of `yajna`, and the backends for robots and chips. The
[design](../design/protocol-framework.md) has the plan.
