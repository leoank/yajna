# ADR-0018: Two repo shapes, namespaced links, and how a project graduates

Status: accepted
Date: 2026-10-17
Phase: 0b
Amends: ADR-0004, ADR-0005, ADR-0009
Source: `docs/architecture.md` sections 4 and 10

## Context

ADR-0009 says dry-lab code starts under `projects/` and moves to its own repository when
it matures, but it did not say what happens to the notebook side: where that project's
future experiments and runs are recorded, how the lab page refers to them, and how the new
repo refers back to protocols, materials and earlier experiments that stay in the lab.
ADR-0004 states that IDs are global, which is true inside one repo and false across two.

## Decision

### Shapes

`yajna init` creates one of two repo shapes, recorded as `shape` in `yajna.toml`:

- `lab`: the notebook repo's shape (`leoank/manthan`). `lab/` holds `projects/PRJ-*/`, the shared `protocols/`,
  `materials/`, `equipment/`, `builds/`, `agents/`, `log/`, `references/`, `tasks.md` and
  `counters.yaml`.
- `project`: one project in its own repo. The repo root is the code tree itself, what
  was `projects/<slug>/` in the lab, with its own `flake.nix`, sources and README. The
  notebook is `lab/` inside that tree, not a sibling of it: `lab/README.md` is the
  project page; beside it sit `experiments/`, `runs/`, `analyses/`, `artifacts/`,
  `agents/`, `log/`, `references/`, `tasks.md` and `counters.yaml`. There are no `projects/`, `protocols/`,
  `materials/`, `equipment/` or `builds/` directories: shared entities live in a lab and
  are linked by namespace. `yajna new` never asks for `--project` in this shape.

Both shapes use the same schemas, templates, ID scheme and commands. Only the layout
and the set of entity types that may be created differ.

### Namespaces

- Every repo has a `namespace` in `yajna.toml`, a short lowercase name (`yajna` for this
  lab, the project slug for a project repo).
- `[repos]` in `yajna.toml` maps the namespaces this repo links to onto their location:
  `rc2s2 = "github:leoank/rc2s2"`, optionally `{ url = "...", path = "../rc2s2" }` when a
  checkout is usually present.
- A cross-repo link is `[[rc2s2/EXP-0003]]`, with the usual `|label` and `@version`
  suffixes. Bare `[[EXP-0003]]` always means this repo.
- Frontmatter fields that hold IDs (`project`, `protocols`, `materials`, `influenced_by`,
  `origin`, `continued_in`) accept namespaced IDs.
- `yajna validate` fails on a namespace that is not in `[repos]`. It resolves the ID in
  the other repo only when that repo's `path` exists on disk; otherwise the link is
  accepted on the strength of its form.
- IDs are therefore unique within a repo and qualified by namespace across repos.
  ADR-0004's "global" means "within the repo"; nothing about the ID format changes.

### Graduation

When a project leaves the lab:

1. Nothing is concluded first: the project's notebook goes with it. Active experiments
   continue in the new repo under the same IDs.
2. The code moves with its history: `git subtree split` of `projects/<slug>/` becomes
   the new repo, so the former project directory is its root. The lab's flake input for
   it is removed, and the project page gets `status: moved`,
   `code: <repository url>`, `continued_in: <namespace>/PRJ-0001`, and a `Continued in`
   line at the top of the body. The namespace is added to `[repos]`.
3. At the new repo's root, `yajna init project --from <lab repo path> PRJ-0002` adds
   `yajna.toml` (`shape = "project"`, the namespace, `[repos] yajna =
   "github:leoank/yajna"`) and `lab/` next to the code, and copies the project's
   notebook into it:
   - everything under the lab's `lab/projects/PRJ-0002-<slug>/`: the project page as
     `lab/README.md` with `origin: yajna/PRJ-0002` added, and `experiments/`, `runs/`,
     `analyses/`, `artifacts/` with their sidecar directories;
   - the reading notes under `lab/references/` cited by those pages, and the entries for
     the cited keys from the lab's `library.bib` into the project's bibliography;
   - `counters.yaml` seeded with the highest copied number per prefix, so IDs continue
     rather than restart.
   IDs are preserved. Links and ID-holding frontmatter fields that point at pages not
   among the copied set (`[[PRO-0012]]`, `[[MAT-0210]]`, another project's experiment)
   are rewritten to the lab's namespace, `[[yajna/PRO-0012]]`; links among the copied
   pages stay bare.
4. The lab keeps its copy of the project directory as history. After the move it is
   frozen: nothing under it is edited again, and the page marked `moved` is where a
   reader is sent on.

`yajna graduate PRJ-0002 --to github:leoank/rc2s2 [--into <path>]` performs steps 2 and
3 when the new repo is checked out next to the lab (or at `--into`), leaving the commits,
`nix flake lock` and the push to the author. The project page is renumbered `PRJ-0001` in
the new repo, as every project repo's page is; experiment, run, analysis and artifact IDs
are kept.

## Consequences

- A thesis chapter can cite work across the lab and every graduated repo by namespaced
  links; the static site, when it exists, follows `[repos]` to render them.
- A project repo never needs the lab checked out to validate itself.
- Protocols and materials stay in exactly one place, the lab, so a wet-lab project never
  graduates: only code-bearing projects do.
- `counters.yaml` in a project repo starts from zero for a fresh project and from the
  copied maximum for a graduated one; the namespace keeps either harmless.
- A graduated project's history exists twice, in the lab (frozen) and in its repo
  (live). The `moved` status and `origin` say which is which; the duplication is the
  price of a project repo that validates and reads on its own.
- A project repo's bibliography is `lab/references/library.bib` by default, inside the
  vault, so a code repo gains no top-level directory beyond `lab/`.
- `moved` is a project status of its own, distinct from `concluded`: a moved project's
  question is still open, just answered elsewhere.
