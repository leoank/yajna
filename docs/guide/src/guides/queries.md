# Tasks and queries

## Tasks

Any checkbox on any page is a task:

```markdown
- [ ] order more YPD
- [x] book the spinning disk for Thursday
```

Put a task next to what it is about: on the experiment it belongs to, in a meeting's
*Actions*, in a project's *Progress*. Loose ones go in `notes/tasks.md`.

```console
$ yajna tasks
notes/tasks.md:7                                             Tasks: order more YPD
```

lists every open task with its file, line and section. `--done` includes the ticked ones.
There is no separate tracker; ticking the box is closing the task.

## Questions about the notebook

These commands read an index of the notebook, a SQLite file in `~/.cache/yajna/` built from
the pages. Every query rebuilds it first when any page is newer than it, so it is never
stale and never needs committing. The notebook has to validate: an invalid notebook has no
index, and the command says what to fix.

### `yajna show <ID>`

One page: its frontmatter, what it links to, what links to it, and how many log lines
mention it.

```console
$ yajna show EXP-20261022-cwr123
EXP-20261022-cwr123 planned                 Does a 42C pulse slow growth?
path       notes/projects/PRJ-0001-yeast-heat-shock/experiments/EXP-20261022-cwr123-does-a-42c-pulse-slow-growth.md
project    PRJ-0001
status     planned
created    2026-10-22
author     ada
tags       ["growth"]
links out
  PRJ-0001  (project)
links in
  PRJ-0001  (body)  Yeast heat shock
  RUN-20261022-cwx0rf  (experiment)  RUN-20261022-cwx0rf
```

### `yajna timeline <ID>`

Everything recorded about something, oldest first: when it was created, every page that
links to it (runs with their metrics), and every log line that mentions it. Most useful for
materials and equipment: *what has happened to this strain since we got it?*

```console
$ yajna timeline EXP-20261022-cwr123
2026-10-22       created experiment EXP-20261022-cwr123 by ada
2026-10-22       project PRJ-0001 (body)  Yeast heat shock
2026-10-22 12:44 run RUN-20261022-cwx0rf compute done  doubling_h=2.4 temp_c=42
```

### `yajna tree <PRJ>`

A project's experiments grouped by theme (the first tag), each with status, outcome and
number of runs, and `<- EXP-…` for the experiments that influenced it. In a project
repository the project argument can be left out.

```console
$ yajna tree PRJ-0001
PRJ-0001  Yeast heat shock

growth
  EXP-20261022-cwr123 planned                 Does a 42C pulse slow growth?  (1 run)
```

### `yajna runs <EXP>`

An experiment's runs with the metrics from its `results.tsv`, sorted with `--by <metric>`
(ascending, or `--desc`). See [Runs and results](runs.md).

### `yajna index`

Rebuilds the index by hand and prints what is in it. You rarely need it.

## Full-text search

yajna does not search text; [qmd](https://github.com/tobi/qmd) does it well. Index the
vault as a collection once, then:

```sh
qmd search "induction stressed"                                # keywords
qmd query "when did the chamber take long to equilibrate"     # hybrid, reranked
```
