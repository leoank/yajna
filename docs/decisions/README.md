# Decision records

Short, dated records of choices that are implemented. Each has a status (`accepted`,
`deferred`, `superseded`) and points at the design document section it came from. New
records take the next number; a changed decision gets a new record that supersedes the old
one rather than an edit.

| ADR | Decision | Status |
|-----|----------|--------|
| [0001](ADR-0001-markdown-is-the-write-model.md) | Markdown is the write model; everything else is derived | accepted |
| [0002](ADR-0002-journal-plus-curated-pages.md) | Daily journal plus curated entity pages | accepted |
| [0003](ADR-0003-frontmatter-with-json-schema.md) | YAML frontmatter validated by versioned JSON Schema | accepted |
| [0004](ADR-0004-entities-and-id-scheme.md) | Entity set; counter IDs for curated, date plus suffix for volume entities | accepted |
| [0005](ADR-0005-repository-layout.md) | Repository layout, `lab/` as the vault | accepted |
| [0006](ADR-0006-tasks-as-checkboxes.md) | Tasks are markdown checkboxes | accepted |
| [0007](ADR-0007-search-qmd-first.md) | `qmd` for search; SQLite indexer only when a query needs it | accepted, indexer built under 0019 |
| [0008](ADR-0008-single-author.md) | One human author plus agents | accepted |
| [0009](ADR-0009-dry-lab-code-starts-here.md) | Dry-lab code starts in `projects/`, graduates to its own repo | accepted |
| [0010](ADR-0010-eln-exporter.md) | A plain one-way exporter satisfies the ELN requirement | accepted |
| [0011](ADR-0011-google-docs-ownership.md) | Personal Google account owns synced docs | accepted |
| [0012](ADR-0012-voice-and-photo-capture.md) | Server-side transcription; photos are log attachments or artifacts | accepted |
| [0013](ADR-0013-large-data-storage.md) | Large data storage, leaning git-annex | deferred |
| [0014](ADR-0014-two-stage-protocols.md) | Protocols jotted as text first, codified later | accepted |
| [0015](ADR-0015-python-for-cli-and-indexer.md) | Python for the CLI and indexer | superseded by 0017 |
| [0016](ADR-0016-references.md) | References: Zotero for capture, citation keys as identity, notes in the vault | accepted |
| [0017](ADR-0017-rust-single-binary-cli.md) | The CLI becomes a single Rust binary with embedded schemas and templates | accepted |
| [0018](ADR-0018-repo-shapes-and-namespaces.md) | Two repo shapes (`lab`, `project`), namespaced cross-repo links, graduation procedure | accepted |
| [0019](ADR-0019-index-and-site-as-caches.md) | The SQLite index and the static site are caches outside the repo, rebuilt when stale | accepted |
| [0020](ADR-0020-directory-names.md) | `notes/`, `code/` and `assets/` as the top-level directories; two project page templates | accepted |
