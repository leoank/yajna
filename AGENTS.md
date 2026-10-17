# Working in this repo

This is `ank`'s lab notebook and the code around it. Markdown under `lab/` is the record;
everything else is tooling or derived from it. Read `README.md` for the layout and
`docs/conventions.md` for how to write an entry. The reasoning is in `docs/architecture.md`
and `docs/decisions/`; check the ADRs before changing anything they cover.

## Tooling

Everything runs through the flake. Enter with `nix develop` at the root, then:

```
yajna new <type> "<title>" [--project PRJ-xxxx] [--experiment EXP-xxxx] [--kind k] [--code]
yajna log "<text>" [--author agent:<name>]
yajna result --experiment EXP-xxxx <run.log>     # metric runs only: ===RESULT=== line → RUN page + results.tsv
yajna ref <citekey> [--note]
yajna tasks
yajna validate
yajna graduate PRJ-xxxx --to <location> [--into <path>]   # move a project to its own repo (ADR-0018)
nix flake check                                   # validate + the CLI's tests + every project flake
```

`yajna` is one static binary (`tools/yajna/`, Rust); `nix develop` runs it from the
checked-out source. Outside this repo, `yajna init lab` or `yajna init project "<title>"`
sets up a new repo of either shape.

Never install tools ad hoc; add them to `flake.nix` (root tooling) or to the project's own
flake under `projects/<name>/`. Run `yajna validate` after touching anything in `lab/` and
`nix flake check` before you report a change as done.

## Writing in the notebook

- Create pages with `yajna new`, never by hand: it allocates the ID from `lab/counters.yaml`
  and fills the template. Never reuse, renumber or hand-edit an ID or the counters file.
- Link with `[[ID]]`; a link to an unknown ID fails validation. Cite papers as `@citekey`
  from `references/library.bib`; an unknown key fails validation.
- Log with `yajna log --author agent:<name>`. That writes to your own file for the day,
  so human and agent entries never collide. Lines are appended, never reordered.
- Record every session as an `AGS` page (`yajna new agent "<task>"`) listing the entities
  you created and edited. Curated pages you edit (`EXP`, `PRO`, `MAT`) get
  `review: pending` in frontmatter; only a human removes it.
- Rewrite the "Current belief" section of a project page; append elsewhere. Conclusions
  on experiments are written once, by a human.
- Photos, audio and data files that result from a run become `ART` pages. Large files do
  not go into git history (ADR-0013 defers the storage question; ask before adding one).

## Existing projects

A project is a `PRJ` page under `lab/projects/PRJ-xxxx-<slug>/README.md` plus, for
dry-lab work, a code directory named in its `code` field (a path under `projects/`, or a
URL once the code has moved to its own repo).

1. Read the project page: current belief, open questions, what not to try again.
2. Read its experiments and the latest runs. Where an experiment keeps a `results.tsv` in
   its sidecar directory, that is the quick view.
3. Work inside `projects/<name>/` with `nix develop` there. The project flake (flake-parts)
   pins its own environment and may add inputs; its `nixpkgs` follows the root. Run
   `nix flake lock` there after changing inputs and commit the lock.
4. Record each result the experiment will rest on as a `RUN` page (`yajna new run
   --experiment EXP-xxxx --kind compute`): notes, checklist, and the commit it ran at, which
   is the dry-lab protocol version. Only for experiments that compare numbers across many
   runs, print one `===RESULT=== {...}` line and pipe the output through `yajna result`.
5. Log what you did and what you learned, link the pages, update the `AGS` page.

## New projects

```
yajna new project "<title>" --code
```

creates the `PRJ` page and `projects/<slug>/` with a flake-parts flake and README, and
registers the directory as an input of the root flake. Then `git add` the directory (Nix
only sees tracked files) and run `nix flake lock ./projects/<slug> && nix flake lock .`;
both lock files are committed. Then
`yajna new experiment "<question>" --project PRJ-xxxx` for the first
experiment; fill `Question`, `Hypothesis and predictions`, `Plan` and `Success criteria`
before the first run. Small analyses stay in this repo for good; a project graduates to its
own repository only by the author's decision (ADR-0009), recorded in `docs/progress.md`.
`yajna graduate` does it, following the list in `docs/conventions.md`: the code directory
becomes the new repo with its history, the project's pages move in under `lab/`, the lab
page is marked `moved` and points at the new repo, and links between them are namespaced
(`[[rc2s2/EXP-0003]]`, ADR-0018).

Wet-lab work is the same shape without `--code`: protocols are `PRO` pages with numbered
steps and attribute blocks, materials are `MAT`, bench sessions are `RUN` pages of kind
`bench`.

## References

Zotero is the capture tool; `references/library.bib` is a Better BibTeX snapshot refreshed
with `tools/zotero/export.sh` while Zotero is running. Reading notes live in
`lab/references/<citekey>.md` (`yajna ref <key> --note`). Reorganising the library goes
through `tools/zotero/plan.json` and `organize.py`, which needs `ZOTERO_API_KEY` and
`ZOTERO_USER_ID` in the environment. The local Zotero API on port 23119 is unauthenticated
and must never be exposed or forwarded off the machine. Keys never go in the repo.

## Changing the tooling

- `tools/yajna/` is the CLI, a Rust crate that embeds `schema/` and `templates/`
  (ADR-0017); `cargo test` and `cargo clippy` in the dev shell must pass, and
  `nix build .#yajna` runs the same tests in the sandbox. `schema/` and `templates/` are the
  contract for every page. A schema change needs the template, `docs/conventions.md` and a
  test in `tools/yajna/tests/cli.rs` updated in the same change.
- `tools/yajna.nvim/` is the Neovim plugin (plain Lua, no binary); its headless tests run
  with `nvim --headless -u NONE --cmd "set rtp+=tools/yajna.nvim" -l tools/yajna.nvim/tests/run.lua`
  and as `checks.yajna-nvim`.
- Releases for machines without Nix: tag `vX.Y.Z` matching `tools/yajna/Cargo.toml` and
  `.github/workflows/release.yml` attaches the four binaries to the GitHub release.
- Decisions that change the architecture get an ADR in `docs/decisions/` and a row in its
  README. Dated progress goes in `docs/progress.md`, newest first, with real timestamps.
- `flake.lock` changes only through `nix flake update` or `nix flake lock`.
- Commit only when asked. Do not push, force-push or touch branches on GitHub unasked.
  The `v1` branch holds the repo's earlier contents and stays as it is.
