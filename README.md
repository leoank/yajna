# yajna

Tooling for a markdown-first lab notebook: a vault of plain markdown pages with typed
frontmatter (projects, experiments, runs, protocols, materials, equipment, builds, agent
sessions, a daily log, reading notes), the schemas and templates that define them, a CLI
that creates and checks pages, and a Neovim plugin that follows the links. The notebook
itself is a separate, private repo of the `lab` shape (ADR-0018); mine is
[leoank/manthan](https://github.com/leoank/manthan). The earlier contents of this repo
(a uv workspace with the `sspoc` package) are preserved on the `v1` branch.

## Layout

| Path | What |
|------|------|
| `schema/` | JSON Schema for every page type's frontmatter and for protocol steps |
| `templates/` | Page templates filled by `yajna new`, plus the scaffolds for `init` and `new project --code` |
| `tools/yajna/` | The `yajna` CLI and interactive TUI: one static binary (Rust) with the schemas and templates embedded (ADR-0017) |
| `tools/yajna.nvim/` | Neovim plugin: follow `[[ID]]` links and `@citekey` citations, find entities, backlinks |
| `tools/zotero/` | Export a lab's `references/library.bib` from Zotero and reorganise the library from a plan |
| `tools/corpus/` | Fetch published protocols into a lab's `corpus/` as fixtures for the protocol work |
| `docs/` | Architecture, conventions, decision records, build progress |

## Using it

A lab repo (`yajna init lab`) holds `lab/` with projects, shared protocols, materials,
equipment, builds, agent sessions, the log and reading notes, plus `projects/` for
dry-lab code, `references/library.bib` and `yajna.toml`. A project repo
(`yajna init project "<title>"` at the root of a code repo) holds one project's notebook
under `lab/` inside the source tree and links to a lab's shared pages by namespace.

```
yajna                  # interactive menu: new, log, ref, tasks, validate
yajna new experiment "ESCRT timing" --project PRJ-0001
yajna log "Started the first growth curve."
yajna result --experiment EXP-0007 train.log     # ===RESULT=== line → RUN page + results.tsv
yajna ref shih2015cloning --note
yajna validate         # schema, IDs, links, citations
yajna graduate PRJ-0002 --to github:leoank/rc2s2  # a project moves to its own repo
```

Get the binary from this flake: `packages.yajna` (and `packages.yajna-nvim` for the
plugin) as an input of a lab repo's flake or of a machine config, or
`nix run github:leoank/yajna -- validate`. Machines without Nix take a binary from the
GitHub releases (`x86_64-linux` musl, `aarch64-linux`, `aarch64-darwin`,
`x86_64-darwin`). `docs/conventions.md` is the cheat sheet for writing an entry.

## Developing

```
nix develop            # cargo, clippy, rustfmt; `yajna` runs from tools/yajna via cargo run
cargo test --manifest-path tools/yajna/Cargo.toml
nix flake check        # the CLI's tests in the sandbox, the plugin's headless tests
```

## Documents

- `docs/architecture.md`: the system design and why markdown is the write model.
- `docs/decisions/`: ADRs 0001–0018, indexed in `docs/decisions/README.md`.
- `docs/protocol-framework.md`, `docs/protocol-corpus.md`, `docs/microfluidic-compiler.md`:
  protocols as code, the published-protocol corpus, and a chip backend for them.
- `docs/progress.md`: dated build log.
- `context.md`: the original brief.

## Status

Phase 0 built the conventions, schemas, templates and CLI; phase 0b made the CLI a
portable Rust binary with `init`, namespaced links and `graduate`; phase 0c added the
Neovim plugin. The lab moved to its own repo on 2026-10-17. Next phases are laid out in
`docs/architecture.md`.
