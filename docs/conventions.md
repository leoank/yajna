# Conventions: how to write an entry

The cheat sheet for Phase 0. The reasoning is in `docs/architecture.md` and the decisions in
`docs/decisions/`; this page only says what to do.

## The vault

Everything under `notes/` is the notebook. Pages are markdown with YAML frontmatter.
`yajna validate` checks every page against `schema/`; run it before committing, CI runs it
too (`nix flake check`).

Enter the tooling with `nix develop` at the repo root; `yajna` is then on the path.

## Repo shapes

`yajna.toml` at the repo root says which of two shapes the repo has (ADR-0018):

```toml
shape = "lab"             # or "project"
namespace = "manthan"     # this repo's name in links from other repos
author = "ank"
vault = "lab"
timezone = "Europe/London"
bibliography = "references/library.bib"

[repos]                   # namespaces this repo links to
rc2s2 = "github:leoank/rc2s2"
```

`yajna init lab [dir]` creates a lab's layout (`--namespace` and `--author` default to
the directory name and `$USER`). `yajna init project "<title>"`, run at the
root of a code repo, adds `yajna.toml` and `notes/` inside it: `notes/README.md` is the
project page (`PRJ-0001`, `code: .`, on the code template), plus `docs/architecture.md`
and `docs/decisions/` unless the repo already has them and `experiments/`, `runs/`, `analyses/`,
`artifacts/`, `agents/`, `log/`, `references/`, `tasks.md` sit beside it. The notebook
lives inside the project's source tree, never in a folder next to it. With `--from <lab
path> PRJ-xxxx` instead of a title, the project's notebook is copied out of that lab (see
"Graduating a project").
A project repo has no protocols, materials, equipment or builds of its own; it links to
the lab's. The commands, IDs, templates and schemas are the same in both shapes, and in a
project repo `yajna new` never asks for a project.

## Interactive mode

Run `yajna` with no arguments for a menu, or leave a command's arguments off:

```
yajna              # menu: new, log, tasks, validate, quit
yajna new          # asks type, title, project or experiment, kind
yajna log          # asks for one line
```

Tab completes everywhere: entity types, kinds, and existing pages by ID or by title, so
typing `arch` at a project prompt offers `PRJ-0001` with its title alongside. In a log
line, type `[[` and the first letters of an ID or title to insert the link. When `$EDITOR`
is set, a new page offers to open in it.

## IDs and links

- Every entity page has an `id` and the filename starts with it:
  `EXP-20261021-0k3m9x-escrt-timing.md`. The slug is decoration; renaming the file never
  breaks a link. IDs are global within the repo, not per project (ADR-0004).
- Experiments, analyses, runs, artifacts and agent sessions get date IDs (ADR-0022): the UTC
  date and six characters that sort by time of day, `EXP-20261021-0k3m9x`. Older IDs with a
  four-character suffix stay valid.
- Projects, protocols, materials, equipment and builds get counter IDs from
  `notes/counters.yaml`: `PRJ-0002`, `PRO-0012`, `MAT-0210`.
- Older IDs move over with `yajna migrate-ids`: counter experiments and analyses, and date
  IDs with the 4-character suffix. Every worktree gets the same IDs. A migrated page keeps
  its old ID as `previous_id`, the CLI still accepts the old ID, and validation names the
  new one on a stale link.
- Link with `[[EXP-20261021-0k3m9x]]` or `[[EXP-20261021-0k3m9x|the timing experiment]]`. Pin a protocol version
  with `[[PRO-0012@3]]`. A link to an ID that does not exist fails validation.
- Link into another repo with its namespace: `[[rc2s2/EXP-20261003-a7k2m1]]`, `[[yajna/PRO-0012@3]]`.
  The namespace must be in `[repos]`; the target is checked only when that repo's `path`
  is on disk. Frontmatter ID fields accept namespaced IDs too.
- Never reuse or hand-edit an ID. The one sanctioned change is `yajna renumber`, which
  resolves a collision between branches (see "Working in parallel").
- A project page lists its experiments and an experiment page its runs as
  `- [[ID]] one line on what it asks and what came of it`. The line after the link is
  required there (`yajna validate` rejects a bare `- [[EXP-20261021-0k3m9x]]`), is what `yajna site`
  shows in the project's experiments table and the experiment's runs table, and is the
  summary a reader gets without opening the page. Links in prose need no such line.

## Creating pages

```
yajna new project "Archaeal division under confinement"
yajna new experiment "ESCRT timing" --project PRJ-0001
yajna new run --experiment EXP-20261021-0k3m9x --kind bench
yajna new protocol "Sulfolobus transformation"
yajna new material "Strain xyz" --kind strain
yajna new equipment "Spinning disk"
yajna new build "Bench camera rig" --project PRJ-0004
yajna new analysis "Ring constriction timing" --project PRJ-0001
yajna new artifact "Time-lapse 2026-10-15" --project PRJ-0001
yajna new agent "Plate layout draft"
```

Each command fills the template from `templates/`, prints the path, and leaves the rest to
you. Where things go:

| Entity | Path |
|--------|------|
| `PRJ` | `notes/projects/PRJ-0001-<slug>/README.md` |
| `EXP`, `RUN`, `ANA`, `ART` | `notes/projects/PRJ-0001-*/{experiments,runs,analyses,artifacts}/` |
| `PRO`, `MAT`, `EQP`, `BLD`, `AGS` | `notes/{protocols,materials,equipment,builds,agents}/` |
| log | `notes/log/<year>/<date>.md`, one per day per author |

Experiment-local and run-local files (scripts, `results.tsv`, figures, `events.jsonl`) go in
a sidecar directory named by the bare ID next to the page: `experiments/EXP-20261021-0k3m9x/`.

## The daily log

```
yajna log "Started induction for [[EXP-20261021-0k3m9x]] with [[MAT-0210]], 0.2 mM. #bench"
yajna log --time 14:20 "Cells look stressed at 0.2 mM. Halving next time. Note for [[PRO-0012]]."
```

Lines are `- HH:MM text`, appended, never reordered. Link anything you mention. The day file
is created with its frontmatter on first use. An agent logs with `--author agent:<name>`,
which goes to a separate file for the same day so that merges stay trivial.

Photos and audio that document the process go in `notes/log/<year>/<date>/` and are embedded
from the entry. If they are a result of a run they become an `ART` page instead (ADR-0012).

## Experiments

Fill `Question`, `Hypothesis and predictions`, `Plan` and `Success criteria` before the
first run. Set `status` as it moves: `planned`, `active`, `paused`, `concluded`,
`abandoned`. When it concludes, set `outcome` (`positive`, `negative`, `inconclusive`,
`infra`) and write `Conclusion` once, by hand. Record which earlier experiment motivated
this one in `influenced_by`; the dead ends are the useful part.

## Dry-lab runs

A `RUN` of kind `compute` is one execution worth a record: a spike, a benchmark, a prototype
tried against a question, a simulation, a training job. Most software work records runs by
hand:

```
yajna new run --experiment EXP-20261021-0k3m9x --kind compute
```

Write what was done and what came out under `Notes`, tick the checklist, set `status`, and
put `commit` in the frontmatter so the run points at the code it ran. Run-local files go in
`runs/RUN-.../` or the experiment's sidecar directory. Not every command you ran is a run;
one page per result that the experiment's conclusion will rest on.

**Every compute run is re-creatable from the repo alone.** The page's `script` field names
an executable, relative to the repo root, that reproduces it: `yajna new run ... --script
notes/projects/PRJ-xxxx-<slug>/runs/RUN-<id>/run.sh` records the path and writes a stub there
when the file is missing. The script runs from the repo root inside the project's dev shell
(`nix develop ./code/<slug> -c <script>`) at the page's `commit`, pins its inputs
(data paths, seeds, versions), writes its outputs beside itself and, for metric runs,
prints the `===RESULT===` line. What the script cannot control (hardware, network, time)
goes under `Reproduce` on the page. `yajna validate` fails when `script` points at a
missing file. A run recorded by an agent always has a script; a human's interactive
session may leave `script: null` and say why under `Notes`.

**The author of a run is whoever executed it.** An agent records its runs, log lines and
session pages as `agent:<name>`: `export YAJNA_AUTHOR=agent:claude` for the session, or
`--author agent:claude` on each command. The human handle in `yajna.toml` is only the
default for the human.

Experiments that produce comparable numbers across many runs (training sweeps, benchmarks)
have a shortcut. Have the script print one line:

```
===RESULT=== {"loss": 0.42, "steps": 3000, "tag": "baseline"}
```

then:

```
python train.py 2>&1 | tee run.log
yajna result --experiment EXP-20261021-0k3m9x run.log
```

That writes the `RUN` page (status `done`, the repo commit recorded, `--script <path>` for
the script that produced the line) and appends a row to
`experiments/EXP-20261021-0k3m9x/results.tsv`, adding columns as new keys appear. The TSV is tracked
in git. Use it only where a flat table of numbers is the natural summary of the experiment.

## Software projects

Dry-lab code lives beside the vault, not in it (ADR-0009):

```
yajna new project "Toy model" --code     # also creates code/toy-model/ with a flake
cd code/toy-model && nix develop     # the project's own environment
```

The scaffold is `code/<slug>/` with `flake.nix`, `README.md`, `docs/architecture.md`
(goals, data model, components, stack, phases, open questions) and `docs/decisions/`, one
numbered decision record per file with an index in its `README.md`; a superseded record
stays and names its successor. The project page uses the code template (*Introduction*,
*Progress*, *Open questions*,
*Design*, *Lessons*, *Experiments*) instead of the research one (*Introduction*,
*Progress*, *Current belief*, *Open questions*, *What not to try again*, *Experiments*);
both open with an *Introduction* written once for a reader who has never heard of the
project, followed by *Progress*, a checklist of what is planned, ticked as it lands, so
the page shows at a glance how far the project has got. The page
gets `code: code/toy-model`; `yajna validate` fails if that directory
disappears. The project flake is built on flake-parts and is a normal flake: add whatever
inputs it needs and commit its own `flake.lock`. The scaffold also registers the directory
as an input of the root flake (`inputs.toy-model`, with `nixpkgs` following the root), so
the root `nix flake check` builds every project's dev shell. After scaffolding:

```
git add code/toy-model      # Nix only sees tracked files
nix flake lock ./code/toy-model && nix flake lock .
```

Both lock files travel with the commit.

### Graduating a project

When a code-bearing project is ready for its own repository (ADR-0018):

1. Nothing to conclude first: the project's pages travel with it and active experiments
   continue under the same IDs.
2. Move the code with history: `git subtree split -P code/<slug>` becomes the new
   repo, so the project directory is its root. Remove the project's input from the lab's
   `flake.nix` and relock.
3. On the lab page set `status: moved`, `code: <repository url>`,
   `continued_in: <namespace>/PRJ-0001`, and put `Continued in [[<namespace>/PRJ-0001]]`
   as the first line of the body. Add the namespace to `[repos]`.
4. At the new repo's root run `yajna init project --from ../yajna/main PRJ-0002`: it adds
   `yajna.toml` with the namespace and `[repos] yajna = { url = "github:leoank/yajna",
   path = "../yajna/main" }`, and `notes/` beside the code, then copies the project's
   notebook in: the project page as `notes/README.md` with `id: PRJ-0001`, `code: .` and
   `origin: yajna/PRJ-0002`, its `experiments/`, `runs/`, `analyses/` and `artifacts/`
   with sidecars, the reading notes and `.bib` entries they cite, and `counters.yaml`
   seeded from the highest copied IDs. Experiment and run IDs stay the same; only the
   project page is renumbered, and `project:` fields follow it. Links and ID fields that
   point at anything staying in the lab are rewritten with the namespace (`[[PRO-0012]]`
   becomes `[[yajna/PRO-0012]]`); links among the copied pages stay bare.
5. Record the move with a `yajna log` line in the lab. The lab's copy of the project directory stays
   as history and is never edited again.

`yajna graduate PRJ-0002 --to github:leoank/rc2s2` does steps 2 to 4: check out the new,
empty repo first (default `../rc2s2` next to the lab, or `--into <path>`; the namespace
defaults to the last segment of `--to`). It splits the code directory with its history
into that checkout, imports the notebook there, edits the lab page, removes the flake
input and registers the namespace in `[repos]`. Left to you: `nix flake lock` here, the
commits in both repos, the remote and push of the new one, and the log line.

## Protocols

A `PRO` page is free markdown except `## Steps`, an ordered list where each step may end
with an attribute block in YAML flow syntax:

```markdown
## Steps
1. Thaw [[MAT-0210]] on ice. {duration: 15m, materials: [MAT-0210], check: "tube on ice"}
2. Add 200 uL of buffer to each tube. {duration: 5m, materials: [MAT-0042], volume: 200uL}
3. Spin at 4000 g. {duration: 10m, equipment: [EQP-0007], hazard: "balance the rotor"}
4. Incubate at 37C. {duration: 2h, wait: true, equipment: [EQP-0002]}
```

Known attributes: `duration` (`15m`, `2h`, `1h30m`, `90s`), `wait`, `materials`,
`equipment`, `volume`, `temp`, `hazard`, `check`, `actor`. Unknown keys are allowed.
Steps are numbered 1..n without gaps; a step's stable address is `PRO-0012@3.s4`
(protocol, version, step). Bump `version` whenever a step changes and say why under
`## Notes`.

`stage: text` is the default. Once a codified version exists (`docs/protocol-framework.md`),
set `stage: codified` and `source:`; from then on the steps are generated, not edited.

## Materials

Keep `status` (`in_stock`, `low`, `out`, `ordered`), `location` (freezer, rack, box,
position), `quantity` and `unit` current; a planning agent resolves material lists against
them. Hardware parts are materials with `kind: part`, `supplier`, `part_number`, `url`,
`lead_time`.

## References

Papers live in Zotero; the library exports to `references/library.bib` and the citation
key is the identity (ADR-0016). Cite from any page with pandoc syntax:

```
Builds on the cloning chip of [@shih2015cloning] and the valve design in @gong2016valves.
```

A page may add its own bibliography, as pandoc takes it: `bibliography: proposal.bib` (or
a list), relative to the page. Its keys count for that page on top of the notebook's.

`yajna validate` fails on a key in neither. `yajna ref shih2015cloning`
shows the entry and every page that cites it; `--note` creates the reading note
`notes/references/shih2015cloning.md`, where the digested meaning of the paper for this work
goes. File the paper in Zotero under `Projects/PRJ-0001 <slug>` for each project it serves
and under a topic; tag it `to-read`, `skimmed` or `read` and by role.

## Tasks

Any `- [ ]` on any page is a task. Put it next to the thing it is about. Loose ones go in
`notes/tasks.md`. `yajna tasks` lists every open one with its page and section; `--done`
includes ticked ones.

## Search

`qmd` indexes `notes/` as the collection `yajna`:

```
qmd search "induction stressed"          # keyword
qmd query "when did the chamber take long to equilibrate"   # hybrid, with reranking
```

## Queries and the site

Structured questions are answered from the SQLite index, a cache outside the repo that
every query rebuilds when a page is newer than it (ADR-0019). The vault must validate
first; an invalid vault has no index.

```
yajna show EXP-20261021-0k3m9x # frontmatter, links out and in, how many log lines mention it
yajna timeline MAT-0210      # everything recorded about it, oldest first: creation, pages that
                             #   link it (runs with their metrics), every log line mentioning it
yajna tree PRJ-0001          # experiments by theme (the first tag), with status/outcome, run
                             #   counts and `<- EXP-xxxx` for influenced_by
yajna runs EXP-20261021-0k3m9x --by loss [--desc]   # runs with their results.tsv metrics, sorted
yajna site [--out dir]       # one HTML page per entity, the log, tasks, and on each project
                             #   page the experiment tree: themes as rows, outcome as colour,
                             #   creation order as the solid line, influenced_by dotted
yajna site --serve [--open]  # the same at http://127.0.0.1:8765/, re-rendered whenever a
                             #   page changes (--port picks another port)
yajna index                  # force a rebuild and print the table sizes
```

Tags carry the tree: put the theme first (`tags: [timing, confinement]`). `outcome`
colours the node (positive green, negative red, inconclusive amber, infra grey, open
white). `influenced_by` draws the dotted edges.

## Exporting to an ELN

The notebook is the record; an institutional ELN, when one is required, gets read-only
snapshots of it (ADR-0010). Nobody edits there and nothing comes back.

```
yajna export --dry-run          # what would go: pages changed since the last export
yajna export                    # cut the bundle; the first export takes every page
yajna export EXP-20261021-0k3m9x RUN-...   # just these pages
yajna export --since <commit>   # changed since a given commit instead
```

The notebook must validate and have no uncommitted changes, so a bundle always matches
the commit stamped on it (`--allow-dirty` overrides and marks the manifest). A bundle is
a directory and a `.tar.gz` of it under `~/.cache/yajna/exports/` (`--out` elsewhere):
one HTML page per notebook page with links only to pages inside the bundle, the markdown
sources, `manifest.json` (commit, time, who, selection, and a SHA-256 per page),
`SHA256SUMS` over every file, all read-only. Each export appends a row to
`notes/exports.tsv`; commit it, and the next export takes only what changed since. Upload
the bundle to the ELN by hand until its API is wired in.

## Sharing pages through Google Docs

People who never open the repo read and comment on Google Docs (architecture 5.8,
ADR-0011). Mark a page for it in its frontmatter:

```yaml
sync: {provider: gdoc, mode: publish}
```

```
yajna sync login --client client_secret.json   # once: the Google account that owns the docs
yajna sync --dry-run                            # what would be created or updated, offline
yajna sync [ID ...]                             # publish, and pull comments back
```

- The first `yajna sync` creates a doc for each marked page and writes its ID back as
  `doc_id`; the doc keeps that ID, URL and sharing for good. Later runs re-upload only
  when the rendered page changed.
- The doc shows the page's ID, status and title, then the body. `[[links]]` to other
  synced pages point at their docs, to the site when `[sync] site_url` is set in
  `yajna.toml`, and are plain text otherwise.
- Docs mirror the notebook's folders under one root folder (ADR-0024): a page in
  `notes/projects/PRJ-0001-x/experiments/` lands in `projects/PRJ-0001-x/experiments/`, a
  page in a `[docs]` directory such as `thesis/meetings/` keeps that path. The root is a
  folder yajna creates in My Drive named after the namespace, or `[sync] folder` when
  set; share it once. Move a page and the next sync moves its doc, keeping its URL.
- A page that cites papers is rendered by pandoc with author-year citations and a
  *References* section, from the notebook's bibliography and the page's own. pandoc must
  be on PATH for those pages; without it they are skipped with the reason. Italics and
  case protection that Zotero writes into titles as HTML are kept.
- Comments and replies come back into the page under `## Review` as checkboxes, before
  any re-upload. Tick one to resolve the comment in the doc at the next sync. Items stay
  even if the comment is deleted in the doc; the section itself is never published.
- `mode: mirror` (ADR-0026) also brings edits made in the doc back: a mirror page is
  published only when committed; `yajna sync pull` merges the doc's edits into the page
  as an uncommitted change (conflicts as `<<<<<<< this page` / `>>>>>>> the doc`
  markers), and after review and a commit `yajna sync` publishes the result. `yajna sync`
  will not overwrite a doc with edits not yet pulled unless given `--overwrite`.
  `import` (the doc is the truth) is not built.
- Credentials are a refresh token in `~/.config/yajna/gdoc.json` (or wherever
  `YAJNA_GDOC_CREDENTIALS` points, such as a secret from neusis), never in a repo. The
  token's scope is `drive.file`: yajna sees only the docs it created.

## Docs: meetings, proposals and admin

Documents written for people rather than as research records, such as meeting notes, a
proposal, a report, or admin and logistics, are `doc` pages (ADR-0023). They are set to
sync to Google Docs from the start.

```
yajna new doc "Committee meeting" --kind meeting      # asks where it goes
yajna new doc "Thesis proposal" --kind proposal --dir thesis
```

- Kinds: `meeting`, `proposal`, `report`, `admin`, `logistics`, `note` (the default).
  A meeting doc holds a series of meetings, one `## <date>` section each, newest first,
  with agenda, notes, decisions, actions and transcript; `date` is the latest meeting.
  Actions are checkboxes, so `yajna tasks` lists the open ones.
- `yajna new doc` asks for the directory, completing `notes/docs`, the registered docs
  directories and the repo's top-level directories; `--dir` answers it. The first doc in
  a directory outside `notes/` registers its top-level directory under `[docs] dirs` in
  `yajna.toml`, so validate, sync, tasks, the site and export see it. Only files with a
  yajna `id` and `type` there are pages; a thesis chapter beside them is left alone.
- Link experiments and runs with `[[ID]]`; in the published doc they become links.

A document that already exists becomes a page with `yajna adopt` (ADR-0025), which keeps
its body and history:

```
yajna adopt thesis/proposals/g2a-proposal.md --kind proposal --dry-run
yajna adopt thesis/proposals/g2a-proposal.md --kind proposal
yajna adopt old/pcr.md --type protocol --kind bench        # any type, as for `yajna new`
```

The type's frontmatter goes on top and the file is renamed to start with its ID. A doc
stays in its directory; other types move to where they live. The file's own frontmatter
keys stay (`title` becomes the page's, `author` is kept as `authors`), except keys yajna
writes itself, which are refused. A `.bib` with the same name beside it becomes its
`bibliography`.

## Importing from Benchling

A one-off import of files exported from Benchling by hand, written as ordinary pages that
are edited here from then on. Nothing is synced back.

```
yajna import benchling exports/ --project PRJ-0004 --dry-run
yajna import benchling exports/ --project PRJ-0004 [--kind plasmid] [--status concluded]
```

- GenBank files (`.gb`, `.gbk`, `.genbank`; the UI exports them on every tenant) become
  `MAT` pages, one per record, of kind `plasmid` unless `--kind` says otherwise. The
  record is kept as `notes/materials/MAT-xxxx/<locus>.gb`; the page gets its definition,
  length, topology and a feature table. Stock fields (location, quantity, status) are not
  in the export and are left for you.
- Notebook entries saved as the API returns them (`GET /entries/{id}`: one entry, a list,
  or `{"entries": [...]}`) become `EXP` pages in `--project`, `created` on the entry's
  date, one section per entry day with text, lists, checkboxes and tables. Parts that are
  bound to Benchling (registration, results, plate and inventory tables) are named, not
  imported. The UI's PDF export of an entry cannot be imported.
- `@` and `[[` from Benchling text are kept literal so they never read as citations or
  links. Every page carries `benchling: <key>`, so importing the same files again skips
  them.

## Working in parallel

Several agents can work on one notebook at once, each in its own git worktree on its own
branch (ADR-0021). The rules exist because one thing in the vault does not merge: the
counter behind curated IDs.

```
yajna worktree PRJ-0003 aero-map            # branch fbr-sim/aero-map in its own worktree,
                                            #   author agent:claude-fbr-sim-aero-map
yajna validate --against main               # before merging back: IDs allocated on both sides?
yajna renumber PRJ-0004                     # the fix, on the branch: next free ID, every reference
```

1. **One agent per worktree, one project per branch.** Name the branch
   `<project-slug>/<topic>`; `yajna worktree` does, and puts it beside the others. Two
   agents never work on the same project at once; when a project needs parallel work,
   split it by experiment and let only one branch edit the project page.
2. **Each worktree has its own author.** `yajna worktree` writes `.yajna/author`
   (`agent:<agent>-<slug>-<topic>`, never committed), which every command uses unless
   `YAJNA_AUTHOR` or `--author` says otherwise. Log files then never collide.
3. **Allocate counter IDs on `main`.** Experiments and analyses have date IDs and are
   created on the branch freely. A new project is created on `main`, committed, and
   merged into the branch before work starts.
4. **Shared entities live on `main`.** Protocols, materials, equipment and builds are
   created and edited there; branches link to them.
5. **Check before merging.** A branch that allocated a curated ID runs
   `yajna validate --against main`; a collision fails with the command that fixes it.
   Renumber on the branch, commit, then merge. `yajna renumber` refuses an ID that is on
   two pages, because after a merge nobody can tell which links meant which page.
6. **Merge `main` into the branch at least daily.** Long branches are where collisions
   grow. In a conflict on `counters.yaml` take the larger number per prefix; regenerate
   `flake.lock` and the root flake's input block with `nix flake lock`, never by hand.
7. Loose todos go on the pages they belong to, not in `notes/tasks.md`, while on a
   branch. No bare `git stash`: worktrees share the stash stack.

## Agents

Agents write through the same commands as `agent:<name>` (`YAJNA_AUTHOR` in the
environment or `--author`) and record an `AGS` page per session listing what they created
and edited. Curated pages (`EXP`, `PRO`, `MAT`) edited by an agent carry `review: pending`
in frontmatter until a human removes it. Every compute run an agent records carries a
`script` that re-creates it (see "Dry-lab runs").

The agent skill that teaches all of this ships as the Claude Code plugin `yajna`, with
the tooling repo as its marketplace (`/plugin marketplace add leoank/yajna`, then
`/plugin install yajna@yajna`).
The plugin adds `/yajna:project <brief>` and its `code-`, `bio-`, `ml-` and `hardware-`
variants: each reads the notebook, interviews the author until the question, success
criteria, scope, constraints, risks and first experiments are pinned down, and only then
creates the project page, the experiments and, for code, the scaffold and design docs.
The skill alone is also embedded in the binary: `yajna skill` writes it to
`.claude/skills/yajna/SKILL.md` in the current repo (`yajna init` does so too) for
machines without the plugin. `yajna skill --print` shows it.
