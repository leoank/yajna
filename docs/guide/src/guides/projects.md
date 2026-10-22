# Projects

A project is a line of work with a question or a goal. Its page, the `README.md` of its
directory, is the place to start for anyone, person or agent, who picks it up.

```sh
yajna new project "Archaeal division under confinement"
yajna new project "Toy transformer" --code       # with a code directory and design docs
```

## The project page

A research project's page has these sections:

| Section | What goes there |
|---------|-----------------|
| *Introduction* | What the project is and why it exists, for someone who has never heard of it. Written once. |
| *Progress* | A checklist of milestones, ticked as each lands. Add items as plans change; keep the done ones. |
| *Current belief* | What you think is true right now, in a paragraph. Rewritten, not appended to. |
| *Open questions* | What you do not know yet. |
| *What not to try again* | Dead ends and why, so nobody walks into them twice. |
| *Experiments* | One line per experiment: `- [[EXP-…]] what it asks and what came of it`. |

A project created with `--code` gets the code template instead: *Introduction*,
*Progress*, *Open questions*, *Design*, *Lessons* and *Experiments*.

*Progress* items are checkboxes, so `yajna tasks` lists the open ones with every other to-do
in the notebook. `status` in the frontmatter is `active`, `paused`, `concluded`,
`archived`, or `moved` once a project has left for its own repository.

## Projects with code

Dry-lab code lives beside the notebook, not inside `notes/`:

```console
$ yajna new project "Toy transformer" --code
```

creates `code/toy-transformer/` with:

- `flake.nix`, a normal flake with its own dev shell: add whatever inputs it needs;
- `README.md`;
- `docs/architecture.md`: goals, data model, components, stack, phases, open questions;
- `docs/decisions/`: one numbered decision record per file, indexed in its `README.md`.
  A superseded record stays and names its successor.

The project page gets `code: code/toy-transformer`, and validation fails if the directory
disappears. If the notebook's root `flake.nix` contains the line

```nix
# projects: registered by yajna new project --code
```

the project's flake is added as an input below it, so `nix flake check` at the root
builds every project's dev shell. Nix only sees files git tracks, so after scaffolding:

```sh
git add code/toy-transformer
nix flake lock ./code/toy-transformer && nix flake lock .
```

## A project in its own repository

For a project that is a piece of software in its own repository from the start, keep its
notebook there:

```sh
cd my-tool
yajna init project "Plate reader parser"
```

This adds `yajna.toml` (shape `project`), and `notes/` with the project page as
`notes/README.md` (`code: .`), plus `docs/architecture.md` and `docs/decisions/` unless the
repository has them already. Everything else works as in a lab, except that there are no
protocols or materials: link to a lab's with `[[mylab/PRO-0012]]`.

## Graduating a project

A project that started in a lab and has outgrown it moves to its own repository with its
history and its notebook:

```sh
# create the new, empty repository and check it out first, beside the lab
git clone git@github.com:you/rc2s2.git ../rc2s2

yajna graduate PRJ-0002 --to github:you/rc2s2
```

`graduate`:

1. splits `code/<slug>` with its git history into the new checkout (`git subtree split`),
2. copies the project's notebook there: the project page becomes `notes/README.md` as
   `PRJ-0001` with `origin: mylab/PRJ-0002`; its experiments, runs, analyses and artifacts
   keep their IDs; links to anything that stays in the lab are rewritten with the lab's
   namespace (`[[PRO-0012]]` becomes `[[mylab/PRO-0012]]`); reading notes and the
   bibliography entries it cites come along,
3. marks the lab's page `status: moved` with `continued_in: rc2s2/PRJ-0001`,
4. removes the project from the lab's root flake and adds `rc2s2` to `[repos]`.

`--into <path>` names a checkout elsewhere, `--namespace` a different namespace than the
last part of `--to`. Left to you: `nix flake lock`, the commits in both repositories, the
push, and a log line in the lab. The lab's copy of the project directory stays as history.

To do the notebook half by hand, run
`yajna init project --from ../mylab PRJ-0002` at the root of the new repository.

## Starting a project with an agent

With the [Claude Code plugin](claude-code.md), `/yajna:project <brief>` (or the `code-`, `bio-`,
`ml-` and `hardware-` variants) reads the notebook, interviews you until the question,
success criteria, scope, risks and first experiments are pinned down, and only then creates
the pages.
