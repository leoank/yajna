---
description: Bootstrap a machine-learning project in the notebook, interviewing the author on data, baseline, metric, compute and the sweep plan, then scaffold the code with ===RESULT=== instrumentation, results.tsv and reproducible runs
argument-hint: [title or a one-paragraph brief]
---

Bootstrap a machine-learning (dry-lab, metric-driven) project. Brief: $ARGUMENTS

Run `/yajna:code-project` for the software interview and deliverables; this command adds
what a metric-driven project needs. Load the `yajna` skill first.

## Extra interview topics

1. **The metric.** One primary number, its direction, the target value and the baseline it
   must beat; secondary metrics that must not regress. This becomes the key in
   `===RESULT===` lines and the column of `results.tsv` that `yajna runs --by` sorts on.
2. **Data.** Source, licence, size, splits, leakage risks, where it lives (never in git
   history; a path or a fetch script in the run script), versioning and provenance.
3. **Baseline and prior art.** The simplest thing that gives a number, the published
   result to reproduce first (`@citekey`), and what counts as a fair comparison.
4. **Compute.** Hardware available (laptop, lab GPU, HPC), budget per run and per sweep,
   the longest acceptable run, checkpoints and where they go.
5. **Reproducibility.** Seeds, determinism flags, pinned versions through the project
   flake, what each run script must set; the `commit` and `script` every `RUN` page
   carries.
6. **The sweep plan.** The first axis to vary, the stopping rule, and when the keep-or-revert
   loop (one script, one metric) is worth running unattended.
7. **Telemetry.** Scalars only, or per-layer and per-step series; what gets logged to the
   run directory versus printed as the result line.

## Deliverables beyond the code project's

- The training or evaluation entry point prints exactly one `===RESULT=== {...}` line with
  the primary metric first; the run script pipes it through
  `yajna result --experiment EXP-xxxx --script <path>`.
- The first experiment is the baseline reproduction with its success criterion the
  published number within a stated tolerance; the second is the first sweep axis.
- `experiments/EXP-xxxx/results.tsv` is tracked; large outputs are not.
- The project page states the metric, the target and the baseline under *Current belief*.
