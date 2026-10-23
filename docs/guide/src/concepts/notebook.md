# The notebook

A yajna notebook is a git repository. `yajna.toml` at its root marks it and says what shape
it has; the pages live in one directory, `notes/` by default, called the *vault*. Every
yajna command finds the notebook by walking up from the current directory to the nearest
`yajna.toml`, or takes `--root <path>`.

## Two shapes

**A lab** is your whole notebook: many projects, plus the protocols, materials, equipment
and builds they share, a daily log, agent sessions and reading notes. Code for a project
can live beside it under `code/`.

```text
mylab/
  yajna.toml
  notes/
    README.md                 the lab's front page
    projects/
      PRJ-0001-yeast-heat-shock/
        README.md             the project page
        experiments/  runs/  analyses/  artifacts/
    protocols/  materials/  equipment/  builds/
    agents/                   one page per agent session
    docs/                     meeting notes, proposals, admin
    log/2026/2026-10-22.md    the daily log
    references/               reading notes, one per paper
    counters.yaml             the next number for each counter ID
    tasks.md                  loose to-dos
  references/library.bib      the bibliography, exported from Zotero
  code/<slug>/                a project's code, with its own flake
  assets/                     files too large or too binary for pages
```

**A project** is the notebook of one piece of work that lives in its own code repository.
`yajna init project "<title>"` at the root of that repository adds `yajna.toml` and a
`notes/` beside the code. The project page is `notes/README.md`; experiments, runs,
analyses and artifacts sit next to it; `docs/architecture.md` and `docs/decisions/` hold
the design. A project repository has no protocols or materials of its own: it links to a
lab's by namespace (see [IDs and links](ids-and-links.md#other-repositories)).

The commands, templates and IDs are the same in both shapes. In a project repository
`yajna new` never asks which project a page belongs to.

A project that starts in a lab can move into its own repository later, notebook and
history included: see [Graduating a project](../guides/projects.md#graduating-a-project).

## Pages

Every page is a markdown file with YAML frontmatter:

```markdown
---
id: EXP-20261022-cwr123
type: experiment
schema_version: 1
title: Does a 42C pulse slow growth?
project: PRJ-0001
status: active            # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-22
author: ada
tags: [growth]
---

## Question
Does a 30-minute pulse at 42C lengthen the doubling time of BY4741 in YPD?
...
```

The frontmatter is what yajna reads: type, status, who wrote it, what it belongs to. The
body is for people, in sections the template sets out. The comments after a field list
its allowed values.

| Type | Prefix | What it is |
|------|--------|------------|
| project | `PRJ` | A line of work with a question or a goal |
| experiment | `EXP` | One question, a hypothesis, a plan, and in the end a conclusion |
| run | `RUN` | One execution: a bench session, a script, a training job |
| analysis | `ANA` | Work on data from one or more runs |
| artifact | `ART` | A result worth naming: a dataset, a figure, a model |
| protocol | `PRO` | A procedure with numbered steps, versioned |
| material | `MAT` | A strain, plasmid, reagent, sample or part, with where it is |
| equipment | `EQP` | An instrument |
| build | `BLD` | A piece of hardware being built |
| doc | `DOC` | A document for people: meeting notes, a proposal, a report |
| agent session | `AGS` | What an agent did in one session |
| log | | One author's lines for one day |
| reference | | A reading note on one paper, named by its citation key |

[Page types](../reference/page-types.md) lists every field of every type.

## Creating pages

Pages are created by `yajna new <type> "<title>"`, never by copying a file. The CLI picks
the next ID, fills the template, puts the file where it belongs and prints its path:

```sh
yajna new project "Archaeal division under confinement"
yajna new experiment "ESCRT timing" --project PRJ-0001
yajna new run --experiment EXP-20261022-cwr123 --kind bench
yajna new protocol "Sulfolobus transformation"
yajna new material "BY4741" --kind strain
yajna new doc "Committee meeting" --kind meeting
```

Leave out the arguments and it asks, with tab completion of types, kinds and existing
pages by ID or title. With `$EDITOR` set, it offers to open the new page.

`yajna` alone opens a menu: new page, log line, tasks, validate.

A markdown file that already exists becomes a page with `yajna adopt <file> --type <type>`:
the type's frontmatter goes on top, the body stays, and the file is renamed to start with
its new ID. See [Existing documents](../guides/docs-and-sync.md#existing-documents).

## Checking

`yajna validate` reads every page and fails when:

- frontmatter does not match its type's schema (a missing field, a status that is not
  allowed, an ID in the wrong form),
- an ID is used by two pages, or a file name does not start with its page's ID,
- a `[[link]]` or an ID in a field points at nothing,
- a `@citekey` is not in the bibliography,
- a project or experiment lists a child with a bare link and no line about it,
- a run's `script` or a project's `code` directory does not exist,
- a protocol's steps are not numbered 1 to n, or their attributes do not parse,
- `counters.yaml` is behind an ID already in use.

Run it before every commit. A notebook repository's flake can run it in `nix flake check`
so CI does too.

## What is derived

The markdown files are the only record. Everything else is built from them and lives
outside the repository:

- **the index**, a SQLite file in `~/.cache/yajna/` that the query commands rebuild
  whenever a page is newer than it;
- **the site**, HTML rendered by `yajna site`;
- **Google Docs** published by `yajna sync`;
- **ELN bundles** cut by `yajna export`.

Delete any of them and they come back. Nothing in them is ever edited and read back,
apart from the comments `yajna sync` brings home.
