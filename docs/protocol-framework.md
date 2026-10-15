# Protocol framework: protocols as code for humans, robots, and everything in between

Status: draft v0.1, 2026-10-15. Companion to `architecture.md`. That document decides where
protocols live and how run sheets, planning agents, and bench monitoring consume them. This
one designs the thing that produces them.

## 1. What this is for

The Opentrons Python Protocol API is the model. A protocol is a Python file with a metadata
block, a `requirements` block pinning the API version, an optional `add_parameters()` that
declares typed runtime parameters, and a `run(protocol)` function that loads labware and
instruments onto a context object and issues commands. The same file can be simulated on a
laptop, which produces a run log of every command in human-readable text, or executed on the
robot. Complex commands such as `transfer()` expand into building blocks such as
`aspirate()` and `dispense()`. Step groups give long protocols readable sections. Liquid
classes make the behaviour of a transfer depend on the liquid, not on the author remembering
to slow down for glycerol.

We want that, with three differences:

1. **The executor is usually a person.** Most steps in this lab are done by hand at the
   bench, with ordinary equipment: pipettes, centrifuges, incubators, water baths, a
   microscope. The framework must produce a protocol a person can follow, and must not
   assume a deck, a gantry, or a tip rack.
2. **Robots are one executor among several.** When an Opentrons, a plate reader, a
   thermocycler, or a tool from `hardware/` is available, the same protocol should route
   steps to it. The protocol author should not write two versions.
3. **The output feeds the notebook.** A protocol renders to a `PRO` page, a run sheet with
   a material list and schedule, a phone checklist, and a step-level ground truth that the
   bench watcher checks against. All of that is defined in `architecture.md` sections 4, 7.1,
   7.2, and 7.3.

Goals, in priority order:

| ID | Goal |
|----|------|
| P1 | Completely machine-readable: every step, resource, quantity, and condition is data an agent or a checker can inspect. |
| P2 | Generates human-readable protocols that a tired person can follow at the bench, with real numbers, not variables. |
| P3 | Executor-agnostic: human, Opentrons, instrument, or custom hardware, decided at run time. |
| P4 | Composable: protocols call protocols; a library of common procedures grows. |
| P5 | Simulatable: catch volume overflows, missing materials, impossible timings, and unassigned steps before anyone touches a pipette. |
| P6 | Versioned and reproducible: a run records exactly which protocol version and parameter values it used. |
| P7 | Progressive: a free-text step is a valid step. Formalise when it pays. |

Non-goals: being a general robot control stack, certifying protocols for regulated work,
and replacing the Opentrons API for Opentrons-only protocols (we generate for it, not
instead of it).

## 2. The core idea: code emits a command stream, backends consume it

Opentrons already separates "the protocol program" from "the list of commands it produces".
Simulation runs the program against a virtual robot and collects the run log; the real run
runs it against hardware. We make that split explicit and put the command stream at the
centre.

```
protocol.py  --run against a context-->  command stream (IR)  --consumed by-->  backends
                                                                             renderer (markdown, PDF, voice)
                                                                             simulator (checks, durations, material totals)
                                                                             human executor (phone checklist, events)
                                                                             robot executor (Opentrons API or JSON protocol)
                                                                             instrument drivers (reader, cycler, custom)
                                                                             watcher (step ground truth for video checks)
```

The command stream is the **intermediate representation (IR)**: an ordered list of typed
commands with resolved quantities, resource references, actor assignments, and stable step
IDs. It is JSON. It is what a run sheet pins. It is what `architecture.md` calls the protocol
step convention, generated instead of hand-written.

Why Python source rather than a declarative format (YAML, Autoprotocol-style JSON, LabOP):

| | Python program | Declarative file |
|--|--|--|
| Loops, arithmetic, sample counts, serial dilutions | Natural | Awkward or impossible |
| Composition and libraries | Functions and imports | Needs its own include mechanism |
| Static analysis | Only via the IR after running | Direct |
| Agents authoring | LLMs write Python well | Also fine, less expressive |
| Reading as a human | Not the point; the rendering is | Readable but verbose |
| Branching on observations | Ordinary `if` | Needs a workflow language |

The answer is both: Python is the **source**, the IR is the **artifact**. All static analysis
happens on the IR. This is exactly the Opentrons arrangement, and it is why their simulate
output is useful.

### 2.1 Three modes of running the same program

| Mode | What the context does when a command is issued | Used for |
|------|--|--|
| `render` | Records the command with parameters resolved. Observations return their declared default or a placeholder. Both branches of an observation-dependent `if` are recorded as alternatives. | `PRO` page, run sheet, checklist, schedule |
| `simulate` | As `render`, plus tracks container contents, material consumption, equipment state, and time. Fails on violations. | Validation, duration estimate, material list with overage |
| `execute` | Dispatches each command to its actor and blocks until done. Human steps block on the phone checklist or voice. `measure()` returns what the person typed or the instrument read. Events stream to `RUN-*/events.jsonl`. | A live bench session or robot run |

The one real complication is branching. A protocol that says "if OD600 is above 0.6, induce
now, otherwise wait 30 minutes and measure again" cannot be fully rendered ahead of time.
Opentrons avoids this by not supporting it. We support it: `render` shows the branch as a
decision step with both outcomes listed, and `execute` resolves it live. The run sheet is
therefore a plan, and the events log is what actually happened.

### 2.2 Two stages: jot first, codify later

A protocol does not start as code. It starts as free text on a PRO page, typed at the
bench or lifted from a paper, because that takes a minute and the step convention is
enough for a run sheet. The codified protocol is a second stage, attached to the same page
later by a person or an agent, and from then on the page's steps are regenerated from it.
Frontmatter records which stage a page is at (`stage: text | codified`) and the two must
agree: CI renders the code and fails if the hand-edited steps drifted.

Codifying pays for itself three ways. The renderer gives back human text at any verbosity.
The simulator checks volumes, inventory and timing. And the command stream becomes the
input to compilers that need a machine-readable protocol: the Opentrons target already
described, and a microfluidic chip compiler that maps each command to a chip primitive,
cuts the protocol into chip-sized sections with human or robot bridges between them, and
emits a printable, simulated device. That compiler is designed in
`docs/microfluidic-compiler.md`; the command vocabulary here is also its front end, so
new commands should be added with a note on whether a chip can perform them.

## 3. The model

### 3.1 Resources

Everything a command touches is a resource with an ID, loaded onto the context at the top of
`run()`, the way Opentrons loads labware and instruments.

| Resource | Examples | Backed by |
|----------|----------|-----------|
| **Container** | 1.5 mL tube, 50 mL Falcon, 96-well plate and its wells, reservoir, flask, petri dish, cuvette | A labware definition: geometry, well count, max volume, compatible racks. Opentrons labware JSON is reused directly for plates, tubes, and tip racks; a small extra schema covers things robots never touch, such as flasks and dishes. |
| **Material** | Strain, plasmid, buffer, antibiotic stock, ncAA, competent cells, agar plates | `MAT` pages in the notebook. The protocol references the ID; inventory supplies lot, location, and quantity. |
| **Liquid** | "Buffer A", "50% glycerol", "cell suspension" | A material plus a liquid class: aqueous, viscous, volatile, hazardous, cell-containing. The class drives robot pipetting parameters and human hints such as "pipette slowly" or "work in the hood". |
| **Equipment** | Centrifuge, incubator, water bath, thermocycler, plate reader, microscope, Opentrons Flex, the bench camera rig | `EQP` pages. Each declares capabilities: temperature range, max g, shaking, plate formats, which commands it can execute. |
| **Instrument** | A specific pipette (P200, 8-channel), a robot pipette with tip racks | A capability of an actor. Humans get hand pipettes by default. |
| **Location** | Robot deck slot, tube rack position, ice bucket, bench, incubator shelf, freezer box | Where a container is. Robots need exact slots; humans need "on ice" and "rack position 3". |
| **Actor** | `human`, `robot:EQP-0021`, `instrument:EQP-0007` | Who executes a command. Assigned per step, default `human`. |

Containers carry state in `simulate` and `execute`: contents as a list of (material, volume),
whether open or sealed, temperature, and location. That is what makes overflow and
"you never added the antibiotic" detectable.

### 3.2 Commands

A small core vocabulary, each with a typed schema, a human text template, a duration model,
and a list of actors that can perform it. Grouped:

- **Liquid handling.** `transfer`, `aspirate`, `dispense`, `mix`, `serial_dilute`,
  `distribute`, `consolidate`, `add` (human shorthand for "put X of material into
  container"), `resuspend`, `discard_supernatant`, `pour`, `decant`.
- **Container handling.** `label`, `open`, `close`, `seal`, `move` (to a location),
  `place_on_ice`, `invert`, `tap`.
- **Physical treatment.** `incubate` (temperature, duration, shaking), `centrifuge` (g or
  rpm, duration, temperature), `vortex`, `heat_shock`, `thermocycle` (program), `sonicate`,
  `filter`, `freeze`, `thaw`.
- **Biology shorthand.** `transform`, `plate_cells`, `pick_colony`, `inoculate`, `passage`,
  `fix`, `stain`, `mount`, `wash`. Each is a thin wrapper over the primitives above, so it
  renders as one friendly step but simulates as its parts.
- **Observation.** `measure` (OD, concentration, weight, pH, temperature, count), `image`
  (with instrument and settings), `check` (a yes/no visual condition with text, the `check`
  attribute from the architecture doc), `record` (free value).
- **Control.** `wait`, `timer` (named, can run while other steps proceed), `pause` (human
  must confirm), `checkpoint` (safe stopping point, e.g. "can leave overnight at 4 C"),
  `group` (named section, as in Opentrons step groups), `note`, `hazard`.
- **Escape hatch.** `step("free text")`, optionally with attributes. Renders verbatim.
  Simulates as an opaque step of declared duration. This is P7.

Every command has: a stable `key` (author-supplied or derived from group and position), an
`actor`, `duration` (declared or modelled), optional `parallel=True` for steps that can
overlap a wait, `hazard`, `check`, and the resource references.

### 3.3 Parameters

Copied from Opentrons almost verbatim because it is right: an `add_parameters(p)` function
declares `p.add_int`, `p.add_float`, `p.add_bool`, `p.add_choice`, `p.add_material` (a
`MAT` reference constrained by kind), `p.add_csv` (sample sheet), each with display name,
description, default, and either a range or choices. Values are bound when a run sheet is
created, and the run sheet records them. Derived values, such as master mix volume from
sample count plus overage, are ordinary Python in `run()`.

### 3.4 Actors and routing

A command declares which actors could perform it. The context assigns one at render or
execute time from the equipment the run has access to, which is itself a parameter of the
run. Rules, in order:

1. An explicit `actor=` on the command wins.
2. If a robot actor is available and every container the command touches is on its deck,
   the robot takes it. Deck loading is a command too, so "move plate to the robot" is an
   explicit human step before robot steps begin.
3. If an instrument actor can do it (a centrifuge spins, a reader measures), the instrument
   is the actor and the human gets a "load, start, unload" wrapper rendered around it.
4. Otherwise `human`.

A human-only lab and a robot-equipped lab run the same protocol file. The render differs.
For an Opentrons actor, the robot's contiguous steps are compiled into an Opentrons protocol
file (Python using their API, or their JSON protocol format), which is itself an artifact
of the run, and the human sheet gets one step: "run `RUN-...-opentrons.py` on the Flex".

### 3.5 Humans as a device

The human executor is implemented as a backend with the same interface as a robot driver:
it receives a command, presents it (phone checklist, printed sheet, voice), and returns when
the person confirms, along with any observation value. This is the generalisation of
Opentrons' `pause("message")`, which is their only way to involve a person. Making it the
default rather than the exception is the central design choice here.

## 4. What it looks like

A transformation protocol with a conditional, mixed actors, and a sub-protocol. The code is
illustrative; names will change.

```python
from yajna.protocol import Protocol, ul, ml, minutes, C, g

requirements = {"yajna_protocol": "1"}
metadata = {
    "id": "PRO-0012",
    "name": "Heat-shock transformation of chemically competent E. coli",
    "version": 4,
    "author": "ankit",
}

def add_parameters(p):
    p.add_material("cells", "Competent cells", kind="cell_stock", default="MAT-0210")
    p.add_material("plasmid", "Plasmid", kind="plasmid")
    p.add_int("n", "Number of transformations", default=2, minimum=1, maximum=12)
    p.add_float("dna_ul", "DNA per transformation", default=1.0, minimum=0.5, maximum=5.0, unit="uL")
    p.add_choice("antibiotic", "Selection", choices=["kan", "amp", "cm"], default="kan")

def run(ctx: Protocol):
    cells = ctx.material(ctx.params.cells)
    plasmid = ctx.material(ctx.params.plasmid)
    soc = ctx.material("MAT-0042")                       # SOC medium
    plates = ctx.material(f"MAT-agar-{ctx.params.antibiotic}")
    bath = ctx.equipment(kind="water_bath")
    incubator = ctx.equipment(kind="shaking_incubator")
    tubes = [ctx.container("tube_1.5ml", label=f"T{i+1}") for i in range(ctx.params.n)]

    with ctx.group("Prepare"):
        ctx.set(bath, temperature=42*C)
        ctx.thaw(cells, on="ice", duration=10*minutes, check="cells fully thawed, no clumps")
        for t in tubes:
            ctx.add(cells, 50*ul, to=t, on="ice", liquid_class="cells")
            ctx.add(plasmid, ctx.params.dna_ul*ul, to=t, mix="flick", hazard=None)
        ctx.incubate(tubes, on="ice", duration=30*minutes)

    with ctx.group("Heat shock"):
        ctx.heat_shock(tubes, equipment=bath, temperature=42*C, duration=45, unit="s",
                       check="all tubes fully submerged")
        ctx.incubate(tubes, on="ice", duration=2*minutes)
        for t in tubes:
            ctx.add(soc, 950*ul, to=t)
        ctx.incubate(tubes, equipment=incubator, temperature=37*C, shaking=True,
                     duration=60*minutes, checkpoint="can extend to 90 min")

    with ctx.group("Plate"):
        for t in tubes:
            od = ctx.measure("od600", of=t, default=0.3)
            vol = 100*ul if od < 0.5 else 20*ul
            ctx.plate_cells(t, volume=vol, onto=plates, spread=True)
        ctx.incubate(plates, equipment=incubator, temperature=37*C,
                     duration="overnight", checkpoint="read next morning")
```

Rendered by `yajna protocol render PRO-0012 --params n=2,plasmid=MAT-0198`, into the step
convention that `architecture.md` already defines:

```markdown
## Steps

### Prepare
1. Set water bath [[EQP-0004]] to 42 C. {duration: 15m, parallel: true, equipment: [EQP-0004]}
2. Thaw competent cells [[MAT-0210]] on ice. {duration: 10m, materials: [MAT-0210], check: "cells fully thawed, no clumps"}
3. Add 50 uL of competent cells to tube T1, on ice. Cells: pipette gently, no vortexing. {materials: [MAT-0210], volume: 50uL}
4. Add 1.0 uL of plasmid [[MAT-0198]] to T1. Mix by flicking. {materials: [MAT-0198], volume: 1uL}
5. Add 50 uL of competent cells to tube T2, on ice. ...
6. Add 1.0 uL of plasmid [[MAT-0198]] to T2. Mix by flicking.
7. Incubate T1, T2 on ice for 30 min. {duration: 30m, wait: true}

### Heat shock
8. Heat shock T1, T2 in water bath [[EQP-0004]] at 42 C for 45 s. {duration: 45s, equipment: [EQP-0004], check: "all tubes fully submerged"}
9. Incubate T1, T2 on ice for 2 min. {duration: 2m, wait: true}
10. Add 950 uL of SOC [[MAT-0042]] to T1. {materials: [MAT-0042], volume: 950uL}
11. Add 950 uL of SOC [[MAT-0042]] to T2.
12. Incubate T1, T2 at 37 C, shaking, for 60 min in [[EQP-0002]]. {duration: 60m, wait: true, equipment: [EQP-0002], checkpoint: "can extend to 90 min"}

### Plate
13. Measure OD600 of T1. {measure: od600, record: true}
14. Decision: if OD600 < 0.5, plate 100 uL; otherwise plate 20 uL.
15. Plate T1 onto kan agar plate [[MAT-agar-kan]], spread. {materials: [MAT-agar-kan]}
16. Measure OD600 of T2. ...
17. Decision: ...
18. Plate T2 onto kan agar plate, spread.
19. Incubate plates at 37 C overnight in [[EQP-0002]]. {duration: overnight, wait: true, checkpoint: "read next morning"}
```

The renderer also emits, from the same IR:

- **Materials**: competent cells 100 uL (2 x 50 uL, plus 10% overage: 110 uL), plasmid
  2 uL, SOC 1.9 mL, 2 kan plates. Resolved against inventory into the run sheet table.
- **Equipment**: water bath, shaking incubator, with the times they are needed.
- **Schedule**: step 1 runs in parallel with 2 to 7; total hands-on time about 25 minutes,
  elapsed time about 2 hours plus overnight; two wait blocks where other work fits.
- **Hazards and checks**: the two `check` attributes become watcher ground truth.
- **IR**: `RUN-*/protocol.json`, the fully resolved command list, pinned to the `PRO`
  version and the git commit of the source.

With an Opentrons actor declared for the run and the tubes on an aluminium block on its
deck, steps 3 to 6, 10, and 11 compile into one generated Opentrons protocol and the human
sheet shows "run the generated protocol" in their place.

## 5. Design considerations

### 5.1 Source of truth, again

`architecture.md` says markdown is the truth and the protocol page has a hand-written
`## Steps` section with attribute blocks. This framework changes that for protocols written
in it: the Python file under `lab/protocols/PRO-0012/protocol.py` is the source, and the
`PRO-0012.md` page is **generated** from it, with the prose sections (purpose, notes,
history) kept in a separate hand-written file that the renderer merges in. Both are text in
git, so the spirit of the principle holds. The rule becomes:

- A protocol is either *markdown-native* (hand-written steps, the existing convention) or
  *code-native* (Python source, rendered steps). Frontmatter says which.
- Both produce the same step format, so run sheets, planning agents, and the watcher do not
  care.
- CI regenerates code-native pages and fails if the committed render is stale.

Markdown-native stays the right choice for one-off or prose-heavy procedures. Code-native
pays off when a protocol has parameters, loops over samples, gets run often, or needs a
robot.

### 5.2 Step identity

The watcher, the events log, and the run sheet all reference steps. Opentrons identifies
commands by position in the run log, which breaks the moment a step is inserted. Rules:

- A command's `key` is author-supplied when stability matters (`key="heat_shock"`), else
  derived from the group name and the command's ordinal within the group.
- The rendered step number is display only. References use `PRO-0012@4.heat_shock` or
  `PRO-0012@4.prepare.3`.
- Loop-generated steps get the loop variable appended: `prepare.add_cells[T1]`.
- Bumping `version` is required for any change to the command stream; CI compares the IR of
  the committed version against the previous one and refuses an unbumped change.

### 5.3 Units and quantities

Every quantity is a typed value with a unit. Volumes in microlitres internally, rendered in
the unit a person would say (950 uL, 1.9 mL, 10 mL). Temperatures in C. Durations in
seconds internally, rendered as "45 s", "30 min", "overnight" (a named duration with a
default of 16 h and a flexible range). Use a units library rather than floats with naming
conventions. Opentrons uses bare floats and a convention of microlitres; we can afford
better.

### 5.4 Human text generation

This is the P2 feature and the easiest to get wrong. Decisions:

- **Templates per command, not a language model.** Rendering must be deterministic so the
  same IR always produces the same text, the watcher's expectations match the sheet, and
  CI can diff it. Agents may *write* the protocol; the renderer is dumb.
- **Resolved numbers only.** A rendered step never contains a variable name. If the author
  wants the formula shown, that is a `note`.
- **Verbosity levels.** `expert` (one line per step, as above), `guided` (adds the liquid
  class hints, tip choices, and why-notes), `novice` (adds the wrapped instrument steps:
  "open the lid, place tubes opposite each other, close, set 4000 g 10 min, start").
  Same IR, three renders, chosen per run.
- **Loop collapsing.** Repeated steps over N tubes render as one line with a list ("Add 50
  uL to T1, T2") in `expert` mode and as N lines in `guided` and `novice`. The IR always
  has N commands; collapsing is a renderer choice.
- **Outputs.** Markdown first. PDF via pandoc for printing. A phone checklist is the same
  markdown with checkboxes. Voice is the `guided` render read one step at a time.

### 5.5 Simulation checks

What the simulator must catch, in rough order of how often they bite at the bench:

- A container receives more than its capacity, or less than a pipette's minimum.
- A material is used that is not in inventory, or in less quantity than the run needs
  including overage.
- A step requires equipment the run does not have, or a setting outside its capability
  (centrifuge max g, incubator temperature range, plate format).
- A `measure` has no default, so `render` cannot proceed.
- Steps with no possible actor.
- Robot steps touching containers not on the deck, or tip exhaustion.
- A `wait` with nothing parallel declared that is longer than a threshold, flagged as "you
  will be standing around", which is a hint, not an error.
- Total elapsed time crossing a boundary the run sheet declares (end of day), surfacing
  the nearest `checkpoint`.

Durations come from per-command models with defaults, overridden by learned medians from
`events.jsonl` across past runs of the same protocol and step key. That feedback loop is
what makes schedules trustworthy over time, and the step-key stability rule is what makes
it possible.

### 5.6 Composition

Sub-protocols are Python functions that take the context and resources and issue commands
in a group. `transform()` above is one. A library under `lab/protocols/lib/` grows
procedures such as `miniprep`, `pcr_setup`, `serial_dilution`, `passage_cells`. A
code-native protocol that just calls one library function with parameters is the common
case, and that is where agents start: composing known pieces, not inventing steps.

### 5.7 Robot and instrument backends

- **Opentrons.** Compile contiguous robot-assigned liquid-handling commands to their
  Python API: our containers map to their labware load names (we reuse their definitions),
  our liquid classes to theirs, `transfer` to `transfer` with `new_tip`, `mix_before`,
  `mix_after`, `air_gap`, `blow_out` options derived from the liquid class. Generate a file,
  run `opentrons_simulate` on it as part of our simulate, and attach it to the run. We do
  not drive the robot directly at first; the Opentrons App does.
- **Instruments.** Thermocycler programs, plate reader measurements, incubator setpoints:
  a driver per `EQP` kind with `set`, `start`, `read`. Many will be "human presses the
  buttons" wrappers for years. That is fine; the IR is the same.
- **Custom hardware from `hardware/`.** A build that exposes a command interface registers
  as an actor with declared capabilities. The bench camera rig is an `image` actor.

### 5.8 Prior art to borrow from or interoperate with

- **Opentrons Python API and JSON protocol format.** The structural template, and a
  compile target.
- **Autoprotocol** (Strateos): a JSON instruction set for lab automation with a container
  and instruction model close to our IR. Worth reading before fixing the IR schema; adopting
  its vocabulary where it fits would give free interoperability.
- **LabOP / PAML** (SBOL community): a formal protocol ontology with human and robot
  execution in mind. Heavier than we want as a source format, plausible as an export.
- **protocols.io**: the human-readable end of the spectrum; an export target for sharing.
- **SiLA 2**: instrument communication standard; relevant if instrument drivers go beyond
  button-pressing wrappers.

### 5.9 Risks and the honest tradeoffs

- **Over-formalising bench work.** Writing `ctx.add(soc, 950*ul, to=t)` is more effort than
  typing "add 950 uL SOC". The mitigation is P7: `step("add 950 uL SOC")` is legal, and the
  payoff of formalising shows up only through parameters, simulation, robots, and
  monitoring. Formalise the protocols you run weekly; leave the rest as prose.
- **Two representations drift.** The rendered page and the source. Mitigated by generating
  in CI and refusing stale renders.
- **Human variability.** Timings and outcomes vary by person and day. The framework records
  rather than prescribes; durations are medians with spread, not promises.
- **Branching makes plans approximate.** Accepted; the run sheet is a plan and the events
  log is the record.
- **Dependency weight.** The Opentrons package pins Python 3.12 and is large. Keep it an
  optional extra used only by the Opentrons backend; the core framework depends on a units
  library and nothing else.
- **DSL maintenance.** A command vocabulary is a commitment. Keep the core small, let
  biology shorthand live in the library as plain functions, and version the IR schema the
  same way frontmatter is versioned.

## 6. How agents use it

- **Authoring.** An agent writes or edits a code-native protocol, runs `simulate`, reads the
  errors, iterates, then renders for human review. This is a tighter loop than editing prose
  because the simulator pushes back.
- **Planning.** The planning agent of `architecture.md` 7.1 binds parameters, picks the
  equipment set, and renders the run sheet. The material list and schedule are outputs of
  this framework, not something the agent estimates.
- **Monitoring.** The watcher of 7.2 gets the IR: for the current step, the containers,
  the expected action, the `check` text, the duration. Far better ground truth than prose.
- **Learning.** Actual durations and observation values flow back per step key, so the
  next render is better calibrated.

## 7. Packaging

- Python package `yajna-protocol` under `tools/`, with `core` (resources, commands, IR
  schema, units), `render`, `simulate`, `execute` (human backend first), and optional
  `backends/opentrons`. Exposed via `yajna protocol render|simulate|compile|run`.
- Nix: `packages.yajna-protocol`, a devShell with Python 3.12 so the Opentrons extra can be
  installed, and `checks.protocols` that renders and simulates every code-native protocol
  in `lab/protocols/` with default parameters.
- Labware definitions: vendored Opentrons definitions plus `lab/labware/*.json` for
  everything else, in their schema where possible.

## 8. Roadmap

| Phase | Build | Verify |
|-------|-------|--------|
| 0. Core and render | IR schema, units, resources, the core command set, `step()` escape hatch, `render` to the step convention, `PRO` page generation in CI. | Three real protocols converted to code-native, rendered pages indistinguishable in usefulness from the hand-written ones, CI catches a stale render. |
| 1. Simulate | Container state, inventory and equipment resolution, the checks in 5.5, material totals with overage, duration model, schedule. | Simulate catches a deliberately introduced overflow and a missing material. Run sheets in `architecture.md` 7.1 are produced by `render` plus `simulate`, not by hand. |
| 2. Execute, human backend | Live execution against the phone checklist, `measure` blocking on human input, branching resolved live, events written per step key, learned durations. | A bench session runs end to end from the phone with one conditional step, and the next render's schedule uses the measured durations. |
| 3. Robot and instruments | Opentrons compile target with `opentrons_simulate` in the loop, first instrument driver, actor routing rules. | The transformation protocol renders human-only on one run and with the pipetting compiled to an Opentrons file on another, from the same source. |
| 4. Library and agents | `lab/protocols/lib/`, agent authoring command, IR handed to the watcher. | An agent writes a new protocol from library pieces, simulate passes, a human approves the render with few edits. |
| 5. Chip compile | Lowering of the IR to a fluidic operation graph, mappability and partition, netlist export, per `docs/microfluidic-compiler.md` Phase C. | The corpus transformation protocol compiles to one chip plus a plating bridge and the run sheet shows both. |

Phase 0 is small and should land alongside Phase 0 of the main architecture, because the
step convention is shared and it is cheaper to generate it than to hand-write it twice.

The "three real protocols" in Phase 0, and the protocols used to verify later phases,
come from the published-protocol corpus described in `docs/protocol-corpus.md`
(`corpus/protocols/`, fetched by `tools/corpus/corpus.py`). Each protocol there carries a
`framework_status` that records whether it could be expressed and what was missing.

## 9. Open decisions

- **IR schema: own, or adopt Autoprotocol's.** Read Autoprotocol first. Adopting buys
  interoperability; owning buys fit for human steps and observations. A likely outcome is
  our own schema with a lossy export to Autoprotocol.
- **Units library.** `pint` is the obvious candidate; it is heavy. A small internal unit
  type covering volume, mass, temperature, time, concentration, and g-force may be enough.
- **How far labware definitions go for human-world containers.** Minimum is name, max
  volume, and rack compatibility. Geometry only matters for robots.
- **Naming.** Module and command names above are placeholders.
- **Whether to allow a YAML front-end** for simple parameterised protocols that do not
  need loops. Probably not; `step()` and library functions cover the easy cases.
