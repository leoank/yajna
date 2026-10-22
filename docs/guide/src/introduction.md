# yajna

yajna is a lab notebook kept as plain markdown files in a git repository, with one command
line tool, `yajna`, that creates pages, checks them and answers questions about them.

It is built for a researcher who works at the bench and at the keyboard on the same day:
growth curves and training runs, plasmids and Python packages, a protocol and the script
that analyses its output. Everything goes in the same notebook, in the same format, and it
stays readable with nothing more than a text editor and `git log`.

```text
notes/
  projects/PRJ-0001-yeast-heat-shock/
    README.md                                   the project page
    experiments/EXP-20261022-cwr123-does-a-42c-pulse-slow-growth.md
    runs/RUN-20261022-cwx0rf.md
  protocols/PRO-0003-yeast-transformation.md
  materials/MAT-0012-strain-by4741.md
  log/2026/2026-10-22.md                        what happened today, line by line
```

## What it gives you

- **Typed pages.** Projects, experiments, runs, protocols, materials, equipment, builds,
  analyses, artifacts, documents and agent sessions, each a markdown file with YAML
  frontmatter and a template. `yajna new` fills the template and allocates an ID.
- **Links that are checked.** Pages link to each other as `[[EXP-20261022-cwr123]]` and
  cite papers as `@shih2015cloning`. `yajna validate` fails on a link to nothing, a field
  with the wrong value, or a script that is not there.
- **A daily log.** `yajna log "..."` appends a timestamped line to today's file. The log is
  the journal; the pages are the curated record.
- **Questions answered from the notebook.** `yajna timeline`, `tree`, `runs` and `show`
  read a local index built from the pages: everything that happened to a material,
  a project's experiments by theme and outcome, an experiment's runs sorted by a metric.
- **Reproducible runs.** A computational run records the commit and the script that
  re-creates it; `yajna result` turns a `===RESULT===` line into a run page and a row in
  a results table.
- **Agents as authors.** Coding agents write through the same commands under their own
  name (`agent:claude`), record a session page, and leave curated pages marked for review.
  A Claude Code plugin teaches them the conventions.
- **Sharing without giving up the files.** A static site of the whole notebook, Google Docs
  that the people who never open the repo can read and comment on, and read-only bundles
  for an institutional ELN.

## What it is not

yajna is not a database with a web front end, a LIMS, or a real-time collaborative editor.
The markdown files are the record; the index, the site and the Google Docs are all derived
from them and can be thrown away and rebuilt. One person owns a notebook, together with
the agents working for them.

## Where to go next

- [Install](install.md) the CLI, then follow the [Quickstart](quickstart.md) to make a
  notebook and record a first experiment in ten minutes.
- [The notebook](concepts/notebook.md) and [IDs and links](concepts/ids-and-links.md)
  explain the few ideas everything else rests on.
- The [Guides](guides/projects.md) cover each kind of work; the
  [Reference](reference/cli.md) lists every command, setting and field.
- [Design](design/architecture.md) has the architecture and the decision records behind
  it, for those who want to know why.
