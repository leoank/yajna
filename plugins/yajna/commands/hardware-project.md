---
description: Bootstrap a hardware build in the notebook, interviewing the author on purpose, interfaces, parts, design sources, revisions, assembly and characterization, then create the BLD page, its parts as materials, the design tree under Nix and the first assembly and characterization experiments
argument-hint: [title or a one-paragraph brief]
---

Bootstrap a hardware build (a bench rig, a controller, a microfluidic chip holder, an
imaging adapter). Brief: $ARGUMENTS

Run `/yajna:project` for the general interview and deliverables; this command adds what a
build needs. Load the `yajna` skill first. A build is a `BLD` page that becomes an `EQP`
page once it works; it belongs to a project when it serves one, and stands alone when it
is shared equipment.

## Extra interview topics

1. **Purpose and the bench run it serves.** Which protocol step or experiment needs it,
   what it must do, what it must not do (heat, vibrate, leak light), and the measurable
   spec (resolution, range, timing, load).
2. **Interfaces.** Mechanical (mounts, footprints, tubing), electrical (voltages,
   connectors), software (firmware, serial or USB, the host side), and what else on the
   bench it must fit.
3. **Parts.** The bill of materials as `MAT` pages of kind `part`: supplier, part number,
   price, lead time, quantity; what is already in stock; what can be substituted.
4. **Design sources.** CAD (code-based where possible), PCB (KiCad), firmware; all text
   where it can be, built under Nix in `hardware/<name>/` or the project's code tree;
   binary exports go to artifacts, not git history.
5. **Revisions.** What rev 0 proves, what rev 1 adds, how revisions are recorded on the
   page and in the design tree.
6. **Assembly and test.** The assembly sequence as a run sheet (`RUN` of kind
   `assembly`), the characterization and calibration experiments with pass criteria,
   safety (mains, lasers, moving parts, chemicals).
7. **Operation.** Who will use it, the operating procedure as a `PRO`, maintenance and
   calibration intervals once it is equipment.

## Deliverables beyond the general ones

- `yajna new build "<title>" [--project PRJ-xxxx]` with purpose, BOM (links to the `MAT`
  pages), revisions and tests sections filled.
- `yajna new material "<part>" --kind part` for each part with supplier fields.
- The design directory under Nix with a flake that builds the exports (`nix build` for
  STEP, Gerbers, firmware), registered like a code project where it lives in `projects/`.
- The first assembly run sheet and the first characterization experiment with pass
  criteria from the spec; `yajna new equipment` once the tests pass, linking the build.
