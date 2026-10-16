# yajna

A markdown-first lab notebook for my PhD work at the MRC Laboratory of Molecular Biology:
wet-lab and dry-lab experiments, protocols, references, and the tooling that keeps them
honest. Plain markdown under `lab/` is the source of truth; everything else (search index,
exports, bibliographies) is derived from it.

Dry-lab code starts here and moves to its own repo once it matures. The earlier contents
of this repo (a uv workspace with the `sspoc` package) are preserved on the `v1` branch.

## Layout

| Path | What |
|------|------|
| `lab/` | The vault: projects, experiments, runs, protocols, materials, equipment, builds, agent sessions, daily log, reading notes |
| `schema/` | JSON Schema for every page type's frontmatter and for protocol steps |
| `templates/` | Page templates filled by `yajna new` |
| `projects/` | Dry-lab code, one directory and flake per project, scaffolded by `yajna new project --code` |
| `references/` | `library.bib`, a Better BibTeX snapshot of the Zotero library |
| `tools/yajna/` | The `yajna` CLI and interactive TUI (Python) |
| `tools/zotero/` | Export the `.bib` and reorganise the Zotero library from a plan |
| `tools/corpus/` | Fetch published protocols into `corpus/` as test fixtures |
| `docs/` | Architecture, conventions, decision records, build progress |
| `yajna.toml` | Author, vault path, timezone, bibliography path |

## Getting started

```
nix develop            # puts yajna on PATH
yajna                  # interactive menu: new, log, ref, tasks, validate
yajna new project "Crenactin characterization"
yajna log "Started the first growth curve."
yajna validate         # schema, IDs, links, citations
nix flake check        # validate the vault and run the unit tests
```

`docs/conventions.md` is the cheat sheet for writing an entry. Search is `qmd` pointed at
`lab/` (ADR-0007).

## Documents

- `docs/architecture.md`: the system design and why markdown is the write model.
- `docs/decisions/`: ADRs 0001–0016, indexed in `docs/decisions/README.md`.
- `docs/protocol-framework.md`, `docs/protocol-corpus.md`, `docs/microfluidic-compiler.md`:
  protocols as code, the published-protocol corpus, and a chip backend for them.
- `docs/progress.md`: dated build log.
- `context.md`: the original brief for this repo.

## Status

Phase 0 is built: schemas, templates, the CLI, the Nix flake, and the reference pipeline
(Zotero → Better BibTeX → `references/library.bib` → pandoc citations checked by
`yajna validate`). Next phases are laid out in `docs/architecture.md`.
