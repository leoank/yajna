# Quickstart

Ten minutes from an empty directory to a project with an experiment, a recorded run, a
log and a browsable site. Every output below is what yajna prints; your IDs will differ.

## 1. Make a notebook

A notebook is a git repository with a `yajna.toml` at its root.

```console
$ git init mylab && cd mylab
$ yajna init lab --author ada
created yajna.toml
created notes/README.md
created notes/tasks.md
created notes/counters.yaml
created references/library.bib
created .claude/skills/yajna/SKILL.md
lab mylab ready; next: yajna new project "<title>"
```

`--author` is your handle on every page you write; it defaults to your login name.
`timezone` is your system's; log times and dates are written in it.

```toml
shape = "lab"
namespace = "mylab"
author = "ada"
vault = "notes"
timezone = "Europe/London"
bibliography = "references/library.bib"
```

A *lab* holds many projects plus the protocols, materials and equipment they share. If you
want a notebook for one piece of software inside its own repository instead, run
`yajna init project "<title>"` there; see [The notebook](concepts/notebook.md).

## 2. Start a project

```console
$ yajna new project "Yeast heat shock"
notes/projects/PRJ-0001-yeast-heat-shock/README.md
```

Open the page. It has sections to fill: *Introduction* (what this is, for someone who has
never heard of it), *Progress* (a checklist of milestones), *Current belief*, *Open
questions*, *What not to try again* and *Experiments*.

## 3. Ask a question

An experiment is one question with a plan for answering it.

```console
$ yajna new experiment "Does a 42C pulse slow growth?" --project PRJ-0001
notes/projects/PRJ-0001-yeast-heat-shock/experiments/EXP-20261022-cwr123-does-a-42c-pulse-slow-growth.md
```

Fill in *Question*, *Hypothesis and predictions*, *Plan* and *Success criteria*. Put a
theme first in `tags` (`tags: [growth]`); the experiment tree groups by it.

List the experiment on the project page, under *Experiments*, with one line saying what it
asks. The line is required: it is what a reader sees without opening the page.

```markdown
## Experiments
- [[EXP-20261022-cwr123]] does a 42C pulse slow growth in YPD?
```

## 4. Keep a log

```console
$ yajna log "Streaked plates for the heat shock work. #bench"
notes/log/2026/2026-10-22.md: 12:44 Streaked plates for the heat shock work. #bench
```

The log is append-only and timestamped. Write in it as you go; link what you mention with
`[[ID]]`.

## 5. Record a run

A run is one execution worth keeping: a bench session, a simulation, an analysis script.
For a script that prints its numbers, have it print one line starting `===RESULT===`:

```sh
#!/usr/bin/env bash
# grow.sh
echo "fitting growth curve..."
echo '===RESULT=== {"doubling_h": 2.4, "temp_c": 42}'
```

```console
$ ./grow.sh | yajna result --experiment EXP-20261022-cwr123 --script grow.sh
notes/projects/PRJ-0001-yeast-heat-shock/runs/RUN-20261022-cwx0rf.md
notes/projects/PRJ-0001-yeast-heat-shock/experiments/EXP-20261022-cwr123/results.tsv
```

That wrote a run page with the numbers, the script that produced them and, once the
repository has a commit, the commit it ran at. It also added a row to the experiment's
`results.tsv`. For a bench session, use
`yajna new run --experiment EXP-20261022-cwr123 --kind bench` and write the page by hand.
Either way, list the run on the experiment page under *Runs* with a line on what it showed.

## 6. Check it

```console
$ yajna validate
ok: 4 page(s) valid
```

Validation checks every page's frontmatter against its schema, every `[[link]]` and
`@citation`, and that every run's script exists. Run it before you commit.

## 7. Ask the notebook

```console
$ yajna tree PRJ-0001
PRJ-0001  Yeast heat shock

growth
  EXP-20261022-cwr123 planned                 Does a 42C pulse slow growth?  (1 run)

$ yajna runs EXP-20261022-cwr123 --by doubling_h
run                finished         doubling_h	temp_c
RUN-20261022-cwx0rf 2026-10-22T12:44 2.4	42

$ yajna timeline EXP-20261022-cwr123
2026-10-22       created experiment EXP-20261022-cwr123 by ada
2026-10-22       project PRJ-0001 (body)  Yeast heat shock
2026-10-22 12:44 run RUN-20261022-cwx0rf compute done  doubling_h=2.4 temp_c=42
```

## 8. Look at it in a browser

```console
$ yajna site --serve --open
```

serves the whole notebook at `http://127.0.0.1:8765/` and re-renders as you edit: one page
per entity, the log, open tasks, and on each project page a drawing of its experiment tree.

## 9. Commit

```console
$ git add yajna.toml notes references .claude
$ git commit -m "notebook: first project"
```

The files are the record. Everything yajna derives from them (the index, the site) lives
outside the repository and is rebuilt when needed.

## Next

- Use `yajna` with no arguments for a menu, or any command without its arguments to be
  asked for them, with tab completion of IDs and titles.
- Read [The notebook](concepts/notebook.md) and [IDs and links](concepts/ids-and-links.md).
- If an agent will work in the notebook, see [Claude Code](guides/claude-code.md).
