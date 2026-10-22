# Runs and results

A run is one execution worth a record: a bench session, a simulation, a benchmark, a
training job, an analysis script run over a dataset. It belongs to an experiment.

Not every command you type is a run. Record one run per result the experiment's conclusion
will rest on.

## Kinds

| Kind | For |
|------|-----|
| `bench` | Work at the bench, recorded by hand |
| `compute` | Anything executed: scripts, simulations, training |
| `assembly` | Putting hardware together |
| `calibration` | Calibrating an instrument or a build |

A run's `status` is `planned`, `in_progress`, `done` or `aborted`.

## A run recorded by hand

```console
$ yajna new run --experiment EXP-20261022-cwr123 --kind bench
notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261022-d0k2m7.md
```

Write what was done and what came out under *Notes*, link the protocol version you
followed (`protocols: [PRO-0012@3]`), tick the checklist, and set `status`. Files that
belong to the run (plate layouts, raw exports, figures) go in a directory named by its ID
beside the page: `runs/RUN-20261022-d0k2m7/`.

## Reproducible compute runs

A compute run is only useful if it can be run again. Every compute run records:

- `commit`: the commit of the repository it ran at,
- `script`: an executable, relative to the repository root, that re-creates it.

```console
$ yajna new run --experiment EXP-20261022-cwr123 --kind compute \
    --script notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261022-d1a9p0/run.sh
```

When the file does not exist, yajna writes a stub there to fill in. Because the run's ID is
allocated by this command, the usual order is: create the run, read its ID from the printed
path, then put the script in its directory and point `script` at it.

A good run script:

1. runs from the repository root, inside the project's dev shell
   (`nix develop ./code/<slug> -c <script>`),
2. pins or derives every input: data paths, seeds, model and tool versions, environment
   variables,
3. writes its outputs beside itself,
4. for metric runs, prints one `===RESULT===` line (below).

What the script cannot control (hardware, network, time of day) goes under *Reproduce* on
the page. `yajna validate` fails when `script` points at a file that is not there. A run you
did interactively may say `script: null` and explain why under *Notes*.

## Metric runs and `yajna result`

When an experiment produces comparable numbers across many runs (a sweep, a benchmark, a
growth curve per condition), have the script print exactly one line:

```text
===RESULT=== {"loss": 0.42, "steps": 3000, "tag": "baseline"}
```

and hand its output to `yajna result`:

```sh
python train.py 2>&1 | tee run.log
yajna result --experiment EXP-20261022-cwr123 run.log --script code/toy/train.sh
```

`yajna result` writes the run page with status `done`, the time, the commit and a table of
the values, and appends a row to `experiments/EXP-20261022-cwr123/results.tsv`, adding
columns as new keys appear. The TSV is tracked in git. `--note "..."` adds text to the run
page; with no file, it reads standard input.

Then compare:

```console
$ yajna runs EXP-20261022-cwr123 --by loss
run                finished         loss	steps	tag
RUN-20261022-d3h1x8 2026-10-22T16:40 0.39	3000	warmup
RUN-20261022-d1a9p0 2026-10-22T15:02 0.42	3000	baseline
```

`--desc` sorts the other way.

## Runs by agents

An agent records the runs it executes as itself (`agent:claude`), and every compute run it
records has a script. See [Authors, agents and review](../concepts/authors.md).
