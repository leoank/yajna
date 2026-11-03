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

- `commit`: the full SHA of the repository commit it ran at,
- `script`: an executable, relative to the repository root, that re-creates it.

and, where it applies, what it ran with:

- `host`: the machine it ran on,
- `env`: the variables it depended on that git does not hold, such as a data root or an
  offline flag, with their values (never a credential: a name with `KEY`, `TOKEN`,
  `SECRET`, `PASSWORD`, `CREDENTIAL` or `AUTH` in it is refused),
- `outputs`: the files its result rests on, with their sha256, each relative to the
  repository root or `$VAR/…` under a root named in `env`.

`yajna run record` fills these in on a run you created with `yajna new run`, once it has
run:

```console
$ export VPI_DATA=/data/vpi
$ yajna run record RUN-20261022-d1a9p0 --env VPI_DATA \
    --outputs notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261022-d1a9p0/manifest.tsv \
              $VPI_DATA/results/E1/maps.png
RUN-20261022-d1a9p0: commit 4f1c…, host oppy, env 1, outputs 2
```

For a run that ran on another machine, say which, and give the values it ran with there:

```console
$ yajna run record RUN-20261023-nvfv0n --host oppy --env VPI_DATA=/data/ank/vpi HF_HUB_OFFLINE=1
```

`--env NAME` takes the value from your environment, `--env NAME=VALUE` records the one
given. Without `--host`, `host` is the machine you record from when the page names none.

The commit is HEAD unless the page already has one or you pass `--commit <sha>`. When the
commit a past run executed at cannot be found, `--commit unknown` records that, and the
reason goes under *Notes*. `yajna validate` fails when a compute run's commit is not in the
repository (not checked in a shallow clone, which lacks the history), or when a done one
has none.

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
3. writes its outputs to `$YAJNA_RUN_DIR` when yajna runs it, and beside itself otherwise
   (the stub's `out="${YAJNA_RUN_DIR:-$(dirname "$0")}"` line), and nothing outside the
   repository except under a root named in `env`,
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

`yajna result` writes the run page with status `done`, the time, the commit, the host and a
table of the values (`--env` and `--outputs` as for `run record`), and appends a row to `experiments/EXP-20261022-cwr123/results.tsv`, adding
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

## Running a run again

A run page says how to re-create the run; yajna can do it for you.

```console
$ yajna run shell RUN-20261022-d1a9p0
yajna: RUN-20261022-d1a9p0 at 4f1c2e9 2026-10-22 feat(toy): the second training loop
yajna: ~/.cache/yajna/runs/…/RUN-20261022-d1a9p0 with notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261022-d1a9p0 copied in from HEAD
yajna: the script notes/projects/…/runs/RUN-20261022-d1a9p0/run.sh did not exist at 4f1c2e9
yajna: dev shell: nix develop ~/.cache/yajna/runs/…/RUN-20261022-d1a9p0/code/toy
```

`run shell` makes a git worktree at the run's `commit` (kept in the cache and reused), copies
the run's page and directory into it from HEAD, at their current paths, because the script
is usually committed after the code it ran, and opens the project's dev shell there with
`YAJNA_RUN`, `YAJNA_RUN_DIR`, `YAJNA_RUN_COMMIT` and the run's `env` set. It says what does
not line up: the script that did not exist at the commit, a project directory named
otherwise then, another host, an `env` path missing on this machine. `-c "<command>"` runs one
command instead of a shell; `--working-tree` copies the run's directory from your working
tree, to try an uncommitted fix to its script.

```console
$ yajna run reproduce RUN-20261022-d1a9p0
notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261103-f0a2k1.md
RUN-20261103-f0a2k1: reproduced
```

`run reproduce` runs a compute run's script in that worktree into a new run, which
`reproduces` the original, with its output and logs beside its page. It compares each
recorded output's sha256 and the original's metrics in `results.tsv` (exactly, or within
`--tolerance 0.01` relative for numbers), and records a `verdict`: `reproduced`, `differs`
with a table of what did not agree, or `failed` when the script exits non-zero. Files written
that the original did not list are reported. A run that recorded neither outputs nor a
`results.tsv` row is refused: there would be nothing to compare, and nothing would say where
its script writes, so record them first with `yajna run record --outputs`. A recorded output under an `env` root, such as
`$VPI_DATA/results/…`, would be written over, so reproduce refuses unless `--out-root
VPI_DATA=/scratch/me` sends what is written there to a scratch directory.

`yajna run diff RUN-a RUN-b` shows what differs between two runs: commit, host, `env`,
outputs, metrics, the code between their commits, their scripts and their pages. `yajna run
clean` removes the worktrees; one with changes outside the run's directory is kept unless
`--force`.

When the data is on another machine, `--on oppy` does `run shell`, `run reproduce` or `run
clean` there, driven from your machine over ssh. That machine is only a runner: it needs a
checkout of the notebook, git, tar and Nix, not yajna. Name its checkout in
`.yajna/hosts.toml`, a file of your own that is not committed:

```toml
[oppy]
root = "~/workspace/mylab"
```

`--on` alone means the run's `host`. When there is nothing at `root` yet, yajna clones your
repository's `origin` there first; an existing checkout is used as it is, on whatever branch,
and only gains worktrees. yajna fetches in that checkout first, so push the commit the run
names; it makes the worktree there with git, sends the run's directory over
from your checkout, and runs the project's dev shell there. A reproduction's page, logs and
outputs in the repository come back to your checkout, to commit with the rest; outputs under
an `env` root stay on that machine and are hashed there.

## Runs by agents

An agent records the runs it executes as itself (`agent:claude`), and every compute run it
records has a script. See [Authors, agents and review](../concepts/authors.md).
