---
description: Bootstrap a wet-lab project in the notebook, interviewing the author on the biological question, system, readouts, protocols, materials, controls and safety, then create the PRJ page, materials and protocols it needs and the first bench experiments
argument-hint: [title or a one-paragraph brief]
---

Bootstrap a wet-lab (biology) project. Brief: $ARGUMENTS

Run `/yajna:project` for the general interview and deliverables; this command adds what a
bench project needs. Load the `yajna` skill first. Before the interview also read the
existing `PRO`, `MAT` and `EQP` pages (`yajna show`, the site, or the files under
`notes/protocols/`, `notes/materials/`, `notes/equipment/`): reuse is the default.

## Extra interview topics

1. **The biological system.** Organism, strain or cell line, construct; what is in the
   freezer already (`MAT` pages, with `location`, `quantity`, `status`) and what must be
   made or ordered, with supplier and lead time.
2. **Readouts.** What is measured, with which instrument (`EQP`), at what resolution and
   throughput; what a positive and a negative result look like in the raw data.
3. **Protocols.** Which existing `PRO` pages apply and at which version; which new
   protocols are needed, from which published source (`@citekey`), and which steps are
   uncertain and need a calibration run first.
4. **Controls, replicates and analysis.** Positive and negative controls, biological and
   technical replicates, blinding, the statistical test or model, and the minimum effect
   worth detecting.
5. **Materials flow.** Consumables per run, what is limiting (a strain, an antibody, a
   reagent on back order), and the lineage of derived materials (`parent`).
6. **Safety and compliance.** Biosafety level, hazards per step (`hazard` attributes),
   waste, ethics or permits, who must sign off.
7. **Timing.** Growth times, incubations, booking of shared instruments, the longest
   single run; what the first bench week looks like.

## Deliverables beyond the general ones

- `yajna new material "<name>" --kind <strain|plasmid|reagent|...>` for every material
  that does not exist yet, with inventory fields filled as far as known.
- `yajna new protocol "<title>"` for each new protocol, with numbered steps and attribute
  blocks (`duration`, `materials`, `equipment`, `hazard`, `check`), citing the source.
- `yajna new equipment "<name>"` for instruments not yet registered.
- Experiments whose `protocols` and `materials` fields list the pages above; the first one
  is usually a calibration or a control-only run.
- A first bench session planned as `yajna new run --experiment EXP-xxxx --kind bench`
  with the checklist filled from the protocol steps.
