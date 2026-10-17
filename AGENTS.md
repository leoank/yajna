# Working in this repo

This repo is the tooling for a markdown-first lab notebook: the `yajna` CLI, its schemas
and templates, the Neovim plugin, and the design documents. The notebook itself lives in
a separate lab-shaped repo (`ank`'s is `leoank/manthan`); nothing here is a lab page.
Read `README.md` for the layout and `docs/architecture.md` and `docs/decisions/` for the
reasoning; check the ADRs before changing anything they cover.

## Tooling

Everything runs through the flake. Enter with `nix develop` at the root; `yajna` on PATH
then runs the checked-out source through `cargo run`, so edits take effect immediately.

- `tools/yajna/` is the CLI, a Rust crate that embeds `schema/` and `templates/`
  (ADR-0017). `cargo test` and `cargo clippy --all-targets` in the dev shell must pass,
  and `nix build .#yajna` runs the same tests in the sandbox. The integration tests in
  `tools/yajna/tests/cli.rs` drive the binary against scratch vaults; add one for every
  behaviour change.
- `schema/` and `templates/` are the contract for every page. A schema change needs the
  template, `docs/conventions.md` and a test updated in the same change. Pages written
  by the CLI go through templates and text substitution so key order and comments
  survive; do not switch that to serialising a parsed tree.
- `tools/yajna.nvim/` is the Neovim plugin (plain Lua, no binary). Its headless tests run
  with `nvim --headless -u NONE --cmd "set rtp+=tools/yajna.nvim" -l tools/yajna.nvim/tests/run.lua`
  and as `checks.yajna-nvim`.
- The index (`tools/yajna/src/index.rs`) is a cache outside the repo (ADR-0019); every
  query command and the site read it and rebuild it when stale. A new table or column
  bumps `SCHEMA` there.
- `tools/zotero/` and `tools/corpus/` are run from a lab root, never from here.
- Releases for machines without Nix: tag `vX.Y.Z` matching `tools/yajna/Cargo.toml` and
  `.github/workflows/release.yml` attaches the four binaries to the GitHub release.
- Never install tools ad hoc; add them to `flake.nix`.

## Trying changes against a real notebook

Run the dev-shell `yajna` with `--root <path to a lab checkout>` or from inside one, and
finish with `yajna validate` there. Do not commit in the lab repo from here.

## Documents

- Decisions that change the architecture get an ADR in `docs/decisions/` and a row in its
  README. Dated progress goes in `docs/progress.md`, newest first, with real timestamps.
- `docs/conventions.md` is the writer's cheat sheet and must stay in step with the
  schemas and templates.

## Git

- Commit only when asked, with conventional-commit subjects (`feat(yajna): ...`,
  `docs(architecture): ...`); stage by path, never `git add -A`. One concern per commit.
- `flake.lock` changes only through `nix flake update` or `nix flake lock`.
- Do not push, force-push or touch branches on GitHub unasked. The `v1` branch holds the
  repo's earlier contents and stays as it is.
