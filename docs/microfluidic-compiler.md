# Protocol-to-chip compiler: a microfluidic backend for codified protocols

Status: draft v0.1, 2026-10-15. Companion to `docs/protocol-framework.md`, which defines
the codified protocol and its command stream. This document designs the stage that turns
that stream into microfluidic chip designs we can print on an MSLA printer, simulate, and
run, for cell culture, cloning and imaging experiments.

## 1. The idea

Protocols in this repo exist in two stages. The first is free text, written in a minute
at the bench or from a paper. The second is the codified protocol: the same procedure
written against the framework, attached to the page later, able to regenerate the human
text. The codified protocol is a command stream over containers, liquids, equipment and
actors.

That command stream is also the front end of a chip compiler. Each command is either a
primitive a chip can perform (meter, merge, mix, hold at temperature, perfuse, observe) or
something a chip cannot do (spin, spread on agar, weigh). If every command in a protocol
maps to a chip primitive, the compiler can size a fluidic network, lay it out, simulate it
and emit a printable part. If only sections map, the compiler cuts the protocol into
chip-sized pieces and emits bridge steps for the gaps, executed by a person or a robot,
and the run sheet shows both.

The constraint that shapes everything is fabrication: we want to print chips on a
desktop masked-stereolithography (MSLA) printer in an afternoon, not order them from a
foundry. That caps feature sizes at a few hundred micrometres and makes the chip
primitives millimetre-scale chambers and channels rather than single-cell traps. Section
5 is explicit about what that rules in and out.

## 2. What already exists

### 2.1 Munich Microfluidics Toolkit (TUM Chair for Design Automation)

The most complete open stack, and the one closest to what we need. Pieces, with what we
would use each for:

| Tool | What it does | Licence | Use here |
|---|---|---|---|
| MMFT Simulator (`mmft.simulator` on PyPI, C++ core) | Simulates closed-channel networks at three abstraction levels: abstract (Hagen-Poiseuille as Ohm's law, nodal analysis, near-instant), hybrid (abstract network with lattice-Boltzmann CFD via OpenLB in selected modules), full CFD. Platforms: continuous flow, concentration with instantaneous or diffusive mixing, droplets, membranes and tanks for organ-on-chip. Network is nodes, rectangular channels, pressure or flow-rate pumps, modules; JSON schema published in `mmft-JSON-formats`. | GPL-3.0 | The simulation backend. Our netlist exports to its JSON. |
| Organs-on-Chip Designer | Takes biological constraints (module sizes, required shear stress, pump pressure) and generates an initial network geometry, then extrudes a 3D channel geometry. Jupyter driven. | MIT | The pattern for our sizing step: biology numbers in, geometry out. |
| ISO Designer | Places and routes modules and channels under ISO 22916 geometric constraints using the Z3 solver; validates existing designs. TypeScript, browser. | open | Candidate layout engine for simple chips; ISO 22916 gives us standard port positions and chip footprints for free. |
| Routing Block Channel Router, Gradient Generator, Meander Designer, Spheroid Trap Designer | Parametric generators for specific components. | open | Component generators to borrow. |
| STL Generator | Network JSON to STL. | open | Geometry export when we do not need custom CAD. |
| NoRA | Network-aware design optimisation for multiplexed organ-on-chip. | open | Later, for sizing multi-chamber culture chips. |
| OpenSLAice | A slicer built for mSLA printing of microfluidic parts: detects the channel network in the STL, auto-orients it so channels lie parallel to the build plane, uses 10 to 20 micrometre layers at features and thick layers in bulk, predicts exposure per resin from a Beer-Lambert model with a one-print calibration, exports Anycubic (and beta Elegoo) files. Calibrated on an Anycubic Photon Mono 4 Ultra (17 micrometre pixels). Includes a KiCad irradiance sensor design to port the exposure model to other printers. In the paper it produced the lowest z error against Lychee, ChituBox and PreForm, and 39 layers for a spheroid chip where ChituBox needed 149. | MIT | Our slicer. Buy a printer it supports. |

Flui3d (TUM-EDA, open source) is the GUI sibling: a parametric component library
(chambers, serpentines, Tesla valves, droplet generators), multilayer 2D design, STL, SVG
and JSON out, demonstrated on Anycubic Photon D2 and Elegoo Mars 4 with consumer resins.
Its JSON design file is a possible exchange format with a human-editable GUI.

### 2.2 OpenMFDA (University of Utah)

The most compiler-like system, and the one whose architecture we should copy in spirit.
Input is a Verilog netlist of components and connections. Flow: OpenROAD (the open-source
ASIC placer and router) does placement and routing with technology and library files
describing component footprints; Xyce (SPICE) simulates pressures, flows and
concentrations using Verilog-AMS fluidic analogues of each component; a Python script
turns the routed design into OpenSCAD and STL; a custom 365 nm DLP printer with a PEGDA
resin prints it at 7.6 micrometre pixels, 10 micrometre layers, minimum channel width 106
micrometres. The component library is a process design kit: for each component a LEF
footprint, a Verilog-AMS model and an OpenSCAD geometry. The demo compiled a calcium
colorimetric assay with a 2:25:225 metering ratio; simulation predicted under 2.24 percent
error, printed chips achieved 5 percent average, under 9.2 percent worst case. A 2026
follow-up generates the Verilog netlists from natural language with an LLM plus retrieval
at 88 percent syntactic accuracy. Stated limitations: everything is text files, custom
components need three hand-written files, routing adds parasitic resistance the designer
must compensate by hand, and generic ASIC algorithms are not fluidics-aware. Code at
`github.com/utah-MFDA` (`openmfda_flow`, `h.r.3.3_pdk`), with a `phrozen8k_pdk` for an
MSLA printer in progress.

Lessons: the PDK triple (footprint, behavioural model, geometry) is the right unit for a
component library; SPICE-style nodal simulation is enough to size metering networks;
reusing ASIC place-and-route works but leaves parasitics to the user.

### 2.3 CIDAR lab tools (Boston University)

MINT, a netlist notation for parametric microfluidics; LFR, a higher-level description of
liquid flow relations; Fluigi, place and route from MINT to SVG for milling or
lithography; Neptune, specify-design-build from LFR; 3DuF, an interactive designer with a
JSON representation; Parchmint, the interchange format. Their 2022 "hardware, software,
wetware codesign" paper is the clearest statement of the vision we are following:
specification tools, characterised composable components, scheduling and control, and
three open questions that remain open: what the specification syntax and semantics should
be, how many components are truly composable and how much context matters, and how to
execute reliably across institutions. Their stack targets mVLSI valve chips made by soft
lithography rather than printed parts.

### 2.4 Protocol languages and runtimes for programmable chips

These compile protocols to existing programmable hardware rather than synthesising a chip,
but their front ends are directly relevant to our command stream:

- BioCoder (Ananthanarayanan and Thies, 2010): a C++ protocol language, later retargeted
  to digital microfluidic biochips. The vocabulary (measure, mix, incubate, centrifuge) is
  close to ours.
- BioScript (Ott et al., 2018): a type-safe DSL where the type system prevents unsafe
  chemical combinations.
- Puddle (Willsey et al., 2019): a dynamic runtime that manages droplets as resources,
  interleaves ordinary computation, and corrects errors with a camera. The closest
  precedent for our execute mode plus watcher.
- Columba, Columba 2.0, Columba S (TUM EDA): synthesise manufacture-ready valve-based
  chips (mLSI) from an assay graph, co-optimising flow and control layers, hundreds of
  functional units in minutes.
- High-level synthesis of biochips: scheduling and binding of assay operations to
  on-chip resources, usually by integer linear programming; SlimPort (2025) adds port count
  minimisation for continuous-flow chips. Our partitioning step is a small instance of
  this problem.

### 2.5 Octara

A commercial "scientific computation platform" with a microfluidics workstation. Public
information: a free browser Studio with a component palette (straight, curved and
resistor channels; T, Y and cross junctions; serpentine and herringbone mixers; circular
and rectangular chambers; inlets and outlets), a lumped-hydraulic steady-state solver
giving per-channel flow, velocity, Reynolds number and pressure drop, and a paid tier
with 2D and 3D field solvers, droplet and acoustic physics, and SVG, DXF, STEP and STL
export. The language model is described as an orchestration layer over real solvers, not
the solver. No API, no source, no notion of a protocol driving the design. The relevance
is as a signal of direction, not as a dependency: the free Studio does roughly what MMFT's
abstract simulator and Flui3d do, behind a nicer front end.

### 2.6 Biology on chips that matter for our targets

- Shih et al. (LLNL, ACS Synthetic Biology 2015) implemented Golden Gate, Gibson and
  yeast assembly on one valve chip with region-specific temperature control and on-chip
  electroporation into E. coli and yeast, at ten times lower volume than prior chips,
  assembling two 16-plasmid combinatorial libraries. It proves cloning maps to chip
  primitives: meter, merge, hold at temperature, electroporate. Plating was off-chip.
- Servo-actuated 3D printed disposable microvalves for organoid culture (2025): a 24-well
  plate with 50 servo valves driven by a Raspberry Pi over MQTT, automating media exchange
  and drug delivery on a user schedule, printed in Formlabs BioMed Clear. Cell culture
  automation at millimetre scale works with printed valves and cheap actuators.
- Multi-resin MSLA (2022): print-pause-swap-resin to embed flexible membranes in rigid
  chips, giving pneumatic valves, a finger pump and a droplet generator, and LAMP at 65
  degrees in printed chambers.

### 2.7 MSLA fabrication limits, from measurements not datasheets

| Source | Printer, resin | Result |
|---|---|---|
| ACS Omega 2026, operational limits study | Anycubic Photon Mono M7 Pro, five Anycubic resins, 50 micrometre layers | Embedded channels reliable at about 500 micrometres; under 250 micrometres failed in every resin and orientation. Positive features accurate, negative features undersized by resin accumulation. After 10 min isopropanol wash and 8 min UV cure, Standard V2 and High Clear gave about 80 percent fibroblast viability and best THP-1 growth. Standard V2 swells least in water and PBS. All resins transmit about 40 percent in the visible, cut off below 405 nm, so no DAPI, fine for Alexa and rhodamine. Surface roughness 3 to 4 micrometres. Three chips cost 0.75 euro. |
| Multi-resin MSLA 2022 | Prusa SL1, Elegoo Mars 2 and 3, commercial and custom PEGDA resins | Embedded channels about 300 micrometres with commercial resin, 200 with custom; PDMS cast from printed moulds down to 75 micrometres; channels cleared with compressed air then UV cured. |
| OpenSLAice 2025 | Anycubic Photon Mono 4 Ultra, 17 micrometre pixels | Features at least four pixels (68 micrometres); bridges need 40 micrometre layer minimum; sub-pixel features vanish. |
| Nordin lab (BYU), 2016 onwards | Custom DLP printer at 7.6 micrometre pixels, custom PEGDA resin | 18 by 20 micrometre channels, valves and pumps in 2 cubic millimetres, a million actuations. The ceiling, reached with a custom printer and resin, not a desktop MSLA. |

Reading: with a desktop MSLA and commercial resin, plan on 300 to 500 micrometre
enclosed channels, 100 to 200 micrometre open channels sealed with a lid, and chambers
of 1 to 10 microlitres. Single-cell traps and mother-machine channels (about 1
micrometre) are out of reach; those stay PDMS from silicon masters, or a PDMS insert in a
printed carrier.

## 3. Design

### 3.1 Two-stage protocols and where the compiler sits

```
free-text protocol (PRO page, markdown-native)
        | codify (human or agent, later)
codified protocol (protocol.py)  ---render--->  human text, run sheet
        | command stream IR
        v
   chip compiler
        | lower
fluidic operation graph
        | map, partition
chip plan: [chip A] -bridge- [chip B] -bridge- [bench steps]
        | size, netlist
netlist (ours; exported as MMFT JSON and OpenMFDA Verilog)
        | simulate (MMFT abstract, then hybrid where mixing matters)
        | layout (ISO Designer or OpenMFDA or parametric CAD)
geometry (CadQuery or OpenSCAD) -> STL -> OpenSLAice -> printer file
        | print, post-process, characterise
chip (BLD page, EQP when deployed) ---> execute mode drives it as an Instrument
```

The compiler is a backend in the sense of the framework document: it consumes the same
IR as the renderer and simulator and never sees Python. Its outputs are notebook pages
and files under `hardware/microfluidics/`.

### 3.2 Lowering: from commands to a fluidic operation graph

The IR is a sequence of commands on named containers. The first pass turns it into a
graph whose nodes are fluid volumes with a state (composition, temperature, time) and
whose edges are operations. This is the same abstraction the simulate mode uses for
container state, extended with the physical requirements each operation imposes:

| Command (framework) | Operation | Requirement on hardware |
|---|---|---|
| `add`, `transfer` of volume V | meter(V) then merge | a metering structure accurate to the step's tolerance; a merge junction |
| `mix` | mix(target homogeneity, time) | mixer length or chamber with recirculation |
| `incubate(temp, time)` | hold(T, t) | chamber over a temperature zone; evaporation and gas exchange budget |
| `wait` | hold(ambient, t) | none |
| `heat_shock` | hold(42 C, 45 s) then hold(ice) | a chamber that can be ramped, or two zones and a transfer |
| `wash`, media exchange | perfuse(flow, volume) | valved inlet and outlet, waste |
| `measure(od600)` | observe(optical path, wavelength) | chamber with defined path length and transmissive window |
| `image` | observe(objective, field) | window of coverslip thickness, chamber height within working distance, low autofluorescence |
| `electroporate` | pulse(field, duration) | electrodes in chamber, external pulser |
| `centrifuge`, `spread`, `pick colony`, `weigh`, `streak` | none | not mappable: bridge |
| `step()` free text | unknown | not mappable unless annotated |

Operations carry the step key from the IR, so everything downstream can be traced back
to a line in the protocol and to events recorded at run time.

### 3.3 The primitive catalogue

A chip primitive is a component that implements one or more operations within stated
tolerances on a stated printer and resin. Following OpenMFDA's process design kit, each
primitive has four parts:

1. **Interface**: ports, parameters (volume, path length, target flow), the operations it
   implements, and the tolerance it achieves (metering error, mixing index, temperature
   uniformity), measured not claimed.
2. **Behavioural model**: hydraulic resistance as a function of parameters, for the
   nodal simulator; a mixing model where relevant. Exported to MMFT JSON and, if we use
   OpenMFDA, Verilog-AMS.
3. **Geometry generator**: a parametric function producing solid geometry. Python
   (CadQuery or build123d) rather than OpenSCAD, so generators are testable, Nix
   packaged, and callable from the compiler without a subprocess.
4. **Design rules**: the printer-and-resin pairs it has been validated on, minimum
   dimensions, orientation constraints for OpenSLAice, post-processing, surface treatment.

Initial catalogue, chosen from our three targets:

- **Port**: standard inlet and outlet at ISO 22916 positions, luer or 1/16 inch tubing.
- **Channel**: straight, serpentine, with resistance set by length and cross-section.
- **Metering channel**: a fixed volume defined between two valves or two junctions
  (dead-end filling or ratio metering by resistance as in OpenMFDA's demo).
- **Membrane valve**: printed-in flexible membrane via multi-resin pause, or a
  separate TPU or silicone membrane clamped between printed layers, actuated by a
  servo (cheap, no pressure lines) or pneumatics.
- **Junction and mixer**: T and Y merges; serpentine and herringbone mixers; a chamber
  with a recirculation loop for larger volumes.
- **Temperature chamber**: a thin-floored chamber over a Peltier or a printed pocket for
  a thermistor, zoned so one chip can hold 4, 37, 42, 50 and 65 degrees in different
  places (Shih's region-specific control).
- **Perfusion culture chamber**: 1 to 50 microlitres, height 100 to 500 micrometres,
  inlet and outlet, bubble trap, gas-permeable lid or open-top with glass, surface
  treated for adhesion.
- **Imaging window**: an opening in the chamber floor sealed with a number 1.5 coverslip
  (170 micrometres) by pressure-sensitive adhesive or UV-cured resin, because printed
  resin is about 40 percent transmissive and autofluorescent.
- **Optical path chamber**: fixed path length for absorbance.
- **Electroporation chamber**: chamber with two inserted electrodes.
- **Bubble trap and waste reservoir**.

Each primitive is validated by a test coupon printed on our printer before it is allowed
in a compiled chip. The coupon results live in the notebook as a BLD page with
measurements.

### 3.4 Mappability analysis and partition into chips

1. Label every operation in the graph as mappable (a catalogue primitive exists on our
   printer and resin that meets the step's tolerance), bridgeable (not on chip but a
   person or robot can do it between chips: transfer, spin, plate), or blocking (nothing
   can do it; the protocol stays on the bench).
2. Maximal runs of mappable operations are chip candidates. Cutting between two runs
   costs a bridge: a transfer out of and into a chip, with volume loss, contamination
   risk and time. Merging runs across a bridgeable operation is not possible, so the
   partition is determined by where the unmappable operations sit; the only choices are
   whether to put each mappable run on its own chip or to refuse it because it is too
   short to be worth a chip.
3. Size each chip: total volume, number of ports, temperature zones, imaging windows.
   Reject if it exceeds the printer's build area or the port count we can plumb.
4. Emit the plan: an ordered list of chips and bridge steps. The bridge steps are
   rendered into the same run sheet format as any bench step, with the chip as the
   container, so the planning agent and the watcher treat them like any other step.

Output for a transformation protocol, as an example:

```
Chip A (cloning): meter 10 uL Gibson mix + 2 uL insert, mix, hold 50 C 60 min,
                  meter 5 uL into 50 uL competent cells on 4 C zone, hold 30 min,
                  42 C zone 45 s, 4 C 2 min, add 450 uL SOC, hold 37 C 60 min
Bridge (human):   withdraw 100 uL from Chip A port 4, spread on LB-Amp plate, incubate 37 C overnight
Bench:            pick colonies, miniprep, sequence
```

If a protocol is entirely mappable, the plan is one chip and the run sheet has no bridge
steps beyond loading reagents and connecting pumps.

### 3.5 Netlist, simulation and layout

Our own netlist format is small: components by catalogue name with parameters, ports,
nets, and the operation each component implements with the step key. Exporters produce
MMFT network JSON for simulation and OpenMFDA Verilog if we want OpenROAD layout. Keeping
our own format means we are not locked to either tool's schema and can carry the
protocol traceability neither of them has.

Simulation runs on the MMFT abstract level for every compile (it is near-instant) and
checks: metering ratios within tolerance under the planned pump pressures, no
back-flow into reagent inlets, residence times in mixers and temperature zones at least
what the protocol asks for, total pressure within what the printed part survives. Hybrid
simulation is reserved for mixers and chambers where instantaneous mixing is a bad
assumption.

Layout has three options and we should start with the simplest:

1. **Parametric fixed layouts**: a chip template per protocol family (cloning chip,
   perfusion imaging chip) where the compiler only sets parameters. No place and route.
   Covers the first year.
2. **MMFT ISO Designer**: constraint-based placement and routing on ISO 22916 footprints.
3. **OpenMFDA**: full OpenROAD place and route with our catalogue as a PDK. Most capable,
   heaviest to run (OpenROAD, Xyce built with ADMS), parasitics need compensation.

### 3.6 Fabrication and characterisation stack

- **Printer**: an Anycubic Photon Mono 4 Ultra or M7 Pro, because OpenSLAice supports the
  Anycubic file format and was calibrated on the Mono 4 Ultra, and the operational-limits
  study used the M7 Pro. Pixel size 17 micrometres or finer.
- **Resins**: Anycubic Standard Clear or High Clear for anything touching cells (best
  viability, low swelling); ABS-like or Tough only for moulds and fixtures. A custom
  PEGDA formulation is a later experiment, not a dependency.
- **Post-processing SOP**, itself a protocol in the notebook: isopropanol wash with
  agitation, compressed-air flush of channels, UV cure 8 minutes or more, leach in PBS
  or medium 24 hours, oxygen plasma only for hydrophobic resins.
- **Sealing**: enclosed printed channels where 500 micrometres is acceptable; open
  channels sealed with pressure-sensitive adhesive film or a coverslip where finer
  features or imaging are needed.
- **Actuation and control**: servo valves on a Raspberry Pi or ESP32, a syringe pump or
  pressure controller, Peltier zones with thermistors, all driven as an Instrument actor
  by the framework's execute mode. Firmware and PCBs live in `hardware/` like any other
  build.
- **Characterisation**: every printer-and-resin pair gets a design rules file produced by
  printing coupons: channel width and height series, bridge spans, membrane thicknesses,
  cytotoxicity with our cell lines, autofluorescence at our imaging wavelengths. The
  compiler reads these files; nothing is hard-coded.

### 3.7 What each of our three targets needs

- **Cell culture**: perfusion chambers at millimetre scale, scheduled media exchange,
  37 degrees in an incubator or on a heated stage, gas exchange through a thin lid or
  open-top design. This is squarely within MSLA limits and is the first chip to build.
- **Cloning**: Gibson or Golden Gate at 10 to 20 microlitres, heat shock, recovery,
  then plating. Shih's chip shows the on-chip part works; metering accuracy of 5 to 10
  percent is acceptable for assembly reactions. Plating is the permanent bridge unless
  we add an on-chip growth chamber with selection, which is a later experiment.
- **Imaging**: the resin is the problem, not the geometry. A coverslip window solves
  transmission and autofluorescence for mammalian cells and yeast. Bacterial single-cell
  imaging needs PDMS features; the printed chip becomes the carrier and perfusion
  manifold for a PDMS insert, which the catalogue can represent as a primitive with an
  external fabrication route.

### 3.8 Notebook integration

- A chip is a hardware build: a BLD page with kind `chip`, produced files, print
  parameters, coupon results, and an EQP page once it is validated for use.
- Files: `hardware/microfluidics/<name>/` with `plan.md` (the partition and bridges),
  `netlist.json`, `mmft.json`, `chip.step` and `chip.stl` (annex for binaries),
  `slice.json` (OpenSLAice settings), `characterisation.md`.
- The PRO page of a codified protocol gains `compiled_to: [BLD-0031]` and the compiled
  plan is rendered into its run sheets. Runs on a chip record events per step key as on
  the bench, with the chip as a container.
- Design rules: `hardware/microfluidics/dfm/<printer>-<resin>.yaml`.

### 3.9 Agents

An agent can codify a jotted protocol (stage one to stage two), ask the compiler for the
mappability report, propose substitutions that raise mappability (replace a spin with a
settle-and-perfuse, replace a plate count with an on-chip OD read), and draft the coupon
experiments a new primitive needs. The compiler's reports are plain markdown so they feed
the planning agent like any other context. The LLM-to-netlist papers show models can
write netlists directly, but with our pipeline the model writes the protocol and the
compiler writes the netlist, which keeps the physics deterministic and testable.

## 4. Risks and honest limits

- **Resolution versus biology.** MSLA chips are millimetre-scale fluidics. Anything that
  needs cell-scale geometry is PDMS, and the compiler must know that.
- **Resin biology.** Viability around 80 percent after washing and curing is not 100.
  Each cell line gets its own cytotoxicity coupon before a chip is trusted.
- **Metering and dead volume.** Printed channels at 300 to 500 micrometres have
  microlitre dead volumes; protocols with 1 microlitre additions need redesign to work
  with ratios rather than absolute metering.
- **Bubbles and evaporation** over long incubations. Bubble traps and sealed reservoirs
  are mandatory primitives, and the simulator does not model either.
- **Tool fragility.** OpenMFDA needs OpenROAD and Xyce with ADMS; MMFT's C++ core needs
  GCC 13 and recent CMake. Nix packaging is the mitigation and a Phase A deliverable.
- **Licensing.** MMFT Simulator is GPL-3.0, fine for internal use and for publishing
  our code under GPL, a constraint if we ever ship a closed product. OpenSLAice and
  OpenMFDA are MIT.
- **Generic EDA is not fluidics.** Place and route from the ASIC world ignores parasitic
  resistance and fluid inertia; the simulate step after layout, not before, is what
  catches it.
- **Over-formalising.** Most protocols will stay partly on the bench. The partition
  output must make a 60 percent mappable protocol useful, not reject it.

## 5. Roadmap

| Phase | Build | Verify |
|---|---|---|
| A. Print and characterise | Printer, OpenSLAice in Nix, post-processing SOP as a protocol, coupon designs, design rules file for one printer and resin, cytotoxicity with one cell line. | A perfusion chamber with a coverslip window printed, sealed, held cells for 72 hours, imaged. |
| B. Catalogue and simulate | Primitive catalogue in Python with geometry generators and hydraulic models for ports, channels, chambers, a servo valve, a temperature chamber; exporter to MMFT JSON; simulate in CI. | A hand-written netlist for the cloning chip simulates within tolerance and prints. |
| C. Compile from protocols | Lowering, mappability, partition and plan rendering from the framework IR; the plan appears in run sheets with bridge steps. | The corpus transformation protocol compiles to Chip A plus a plating bridge; the run sheet is usable at the bench. |
| D. Layout automation | Parametric templates first; ISO Designer or OpenMFDA for free-form chips; parasitic compensation loop with the simulator. | A compiled chip changes topology (one more reagent) without hand layout. |
| E. Execute | Valve and pump driver as an Instrument actor, Peltier control, watcher camera on the chip. | A cloning run executes from the phone with the chip and the human bridge, events per step key. |

Phase A does not depend on the protocol framework at all and can start when the printer
arrives. Phase C depends on framework Phase 0 (IR exists).

## 6. Open decisions

1. **Geometry kernel**: CadQuery or build123d (Python, Nix friendly, testable) versus
   OpenSCAD (what OpenMFDA and Flui3d use). Recommendation: Python kernel, with an
   OpenSCAD export only if we adopt OpenMFDA.
2. **Layout engine**: parametric templates now; ISO Designer versus OpenMFDA later.
   Decide when a protocol needs a topology the templates cannot express.
3. **Valve technology**: servo-actuated membrane (no gas lines, cheap, large) versus
   pneumatic (smaller, needs a manifold). Recommendation: servo first, for the culture
   chip.
4. **Printer**: Mono 4 Ultra (OpenSLAice calibrated) versus M7 Pro (larger, 14K).
5. **First chip**: the perfusion imaging chamber, because it is fully within MSLA
   limits, exercises sealing, biocompatibility and imaging, and is useful on its own.
   Second: the Gibson plus heat-shock cloning chip, because the corpus transformation
   protocols give it a test suite.
6. **Whether to adopt OpenMFDA's netlist as our native format** rather than exporting to
   it. Against: it has no protocol traceability and ties us to OpenROAD conventions.

## 7. Sources

- MMFT overview: https://www.cda.cit.tum.de/research/microfluidics/mmft/ and the
  `cda-tum` GitHub organisation (`mmft-simulator`, `mmft-JSON-formats`,
  `mmft-ooc-designer`, `mmft-iso-designer`, `mmft-openSLAice`, `mmft-STL-generator`,
  `mmft-nora`).
- OpenSLAice paper: Scientific Reports 2025, PMC12738676.
- Flui3d: Communications Engineering 2024, PMC11102439; code at TUM-EDA/Flui3d.
- OpenMFDA: Scientific Reports 2025, PMC12475089; code at github.com/utah-MFDA.
- LLM netlist generation for OpenMFDA: arXiv 2602.19297.
- CIDAR codesign: Biodesign Research 2022, PMC10521664; tools at cidarlab.org.
- BioCoder (2010), BioScript (2018), Puddle (ASPLOS 2019), Columba and Columba S (TUM
  EDA), SlimPort (2025, PMC12114398).
- Octara: https://www.octara.org/ and /microfluidics/studio.
- Shih et al., A Versatile Microfluidic Device for Automating Synthetic Biology, ACS
  Synthetic Biology 2015.
- Servo-actuated 3D printed microvalves for organoid culture: PMC13308170.
- Multi-resin MSLA microfluidics: PMC9405740.
- Operational limits of low-cost MSLA for microfluidics: ACS Omega 2026, PMC13520512.
- Gong, Woolley, Nordin, High density 3D printed microfluidic valves, pumps and
  multiplexers, Lab on a Chip 2016.
