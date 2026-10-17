# Build progress

Running log of what has been built in this repo, newest first within each day. Times are
local (Europe/London). Entries before 2026-10-15 09:00 are reconstructed from file
modification stamps and document changelogs, so they carry a date and a rough time.
Append an entry whenever a document, tool or dataset lands; keep each to a few lines and
link the file.

## 2026-10-17

- **2026-10-17 13:17** Dry-lab run convention generalised: a `compute` run is a hand-written
  `RUN` page per result (spike, benchmark, prototype trial) with the commit recorded; the
  `===RESULT===` line and `results.tsv` become the shortcut for experiments that compare
  numbers across many runs, not the rule. Conventions, AGENTS.md, the experiment template
  and architecture section 4 updated. Repo migrated to a gclb bare-repo layout; all work
  happens in the `main/` worktree.

## 2026-10-16

- **2026-10-16 17:25** Project flakes switched to explicit relative-path inputs of the root
  flake (`inputs.<slug> = { url = "path:./projects/<slug>"; ... }`, added by the scaffold)
  instead of directory scanning, so projects can declare their own inputs and locks. The
  scaffold template now uses flake-parts; `projects/rc2s2-*/flake.nix` re-rendered from it
  and locked. ADR-0009 records the change.
- **2026-10-16 15:21** Software projects: `code` field on project pages (path under
  `projects/` or a URL), `yajna new project --code` scaffolds `projects/<slug>/` with a
  flake and README from `templates/code/`, validate checks the directory exists, and the
  root flake exposes `checks.project-<name>` for every `projects/*/flake.nix`, evaluated
  with the root's `nixpkgs`. Pushed the repo to github:leoank/yajna; the previous contents
  are on branch `v1`.
- **2026-10-16 15:07** Library reorganised by running `organize.py` twice (plan v1: roots,
  topic renames, tags, pinned keys; plan v2: `hackernews` renamed to `Reading` as the flat
  feed for web material, Better Notes item moved there, the Sonarr article kept once with
  its Hacker News discussion as a linked-URL attachment, duplicate trashed, `Topics/tools`
  deleted). `organize.py` gained `remove_collections`, `remove_tags`, `link_attachments`
  and `delete_collections`. Re-read the library and refreshed `references/library.bib`
  (9 entries; the Sonarr post is `therealloSomeoneTorrentSites`, unpinned).
- **2026-10-16 10:34** Zotero library synced and Better BibTeX installed. Read the nine
  items and four flat collections through the local API, exported a `.bib` snapshot into
  `references/library.bib` (`tools/zotero/export.sh`), and wrote the reorganisation as
  `tools/zotero/plan.json` with `tools/zotero/organize.py` to apply it through the Web API.
  The local API refuses writes and BBT's JSON-RPC only registers collection-level
  auto-exports, so applying the plan and the library-level auto-export wait on an API key
  and one click in Zotero.
- **2026-10-16 10:17** References: ADR-0016 (Zotero for capture, Better BibTeX keys,
  `references/library.bib` committed, pandoc citations, reading notes under
  `lab/references/`), the `reference` schema and template, `yajna ref <key> [--note]`,
  and a validate check that every citation key exists in the `.bib`.

## 2026-10-15

- **2026-10-15 23:23** Interactive mode for the CLI: `yajna` alone opens a command menu,
  `yajna new` without a type walks through type, title, project, experiment and kind
  with tab completion over existing pages by ID or title, and `yajna log` without text
  prompts for a line where `[[` completes IDs. Built on prompt_toolkit in
  `tools/yajna/yajna/tui.py`; verified through a pty-driven run and unit tests.
- **2026-10-15 16:09** Phase 0 built. `schema/` v1 (eleven entity schemas plus the
  protocol step attributes), `templates/` per entity, `lab/` skeleton with
  `counters.yaml`, `yajna.toml`, the `yajna` CLI under `tools/yajna/` (`new`, `log`,
  `result`, `tasks`, `validate`) with end-to-end tests, `flake.nix` with a dev shell,
  the package and two checks (`validate`, `tests`), and `docs/conventions.md`. `qmd`
  now indexes `lab/` as the collection `yajna`. `nix flake check` passes.
- **2026-10-15 15:15** Phase 0 decision records written: `docs/decisions/` ADR-0001 to
  ADR-0015 with an index. Covers the Phase 0 conventions (markdown as truth, journal
  plus pages, frontmatter and schema, entities and IDs, layout, tasks, `qmd` first,
  Python, two-stage protocols) and resolves the architecture's open questions: single
  author, dry-lab code starts here, plain ELN exporter, personal Google account owns
  synced docs, server-side transcription with photos as log attachments or `ART`.
  Large data storage deferred (ADR-0013). `docs/architecture.md` section 12 now points
  at the records.
- **2026-10-15 11:12** Microfluidic compiler design written: `docs/microfluidic-compiler.md` v0.1.
  Surveys MMFT (simulator, designers, OpenSLAice), OpenMFDA, CIDAR tools, Octara,
  protocol compilers (BioCoder, BioScript, Puddle, Columba) and MSLA fabrication limits,
  then designs the protocol-to-chip stage: operation graph lowering, primitive catalogue,
  mappability and chip partition with human or robot bridges, netlist export to MMFT and
  OpenMFDA formats, fabrication stack and roadmap.
- **2026-10-15 11:12** Protocol framework amended with the two-stage model: a jotted free-text
  protocol first, a codified protocol attached later that regenerates the human text and
  feeds the chip compiler. `docs/protocol-framework.md` section 2.2 and roadmap phase 5.
- **2026-10-15 11:12** This progress log started: `docs/progress.md`.
- **09:43** Protocol corpus delivered. `tools/corpus/corpus.py` (standard library only)
  fetches protocols from Europe PMC XML, PMC HTML, OpenWetWare, BioProt and LAB-Bench into
  `corpus/protocols/` as markdown with provenance frontmatter; 129 protocols fetched
  (21 chosen for variety plus 108 LAB-Bench ProtocolQA); `corpus/index.md` generated;
  `docs/protocol-corpus.md` v0.1 documents sources, licences and the test procedure.
  Finding: bio-protocol.org is behind a SafeLine WAF, so Bio-protocol is taken from PMC
  instead (3,841 articles with full text, 1,187 open-access XML).
- **09:41** `.gitignore` added (`corpus/raw/`, `.DS_Store`).
- **08:30 to 09:40** Investigation of protocol sources: bio-protocol sitemap and WAF,
  Europe PMC coverage per journal, protocols.io API (token needed), OpenWetWare API,
  BioProt and LAB-Bench formats, PMC HTML structure. Two converter bugs found and fixed
  (HTML drop-counter, PMC challenge page detection).
- **~08:03** `docs/protocol-framework.md` v0.1: protocols as code modelled on the
  Opentrons Python API with humans as the default executor. Python source emits a command
  stream IR; backends render, simulate, execute, compile to Opentrons, drive instruments,
  feed the bench watcher. Example transformation protocol rendered into the step
  convention. Cross-referenced from `docs/architecture.md`.
- **~08:03** `docs/architecture.md` v0.5: hardware build projects (BLD entity, EQP link,
  design sources in git, binaries in annex) and the split ID scheme (4-digit counters for
  curated entities, date plus random suffix for runs, sessions and artefacts).

## 2026-10-14

- **evening, to ~23:20** `docs/architecture.md` v0.3 and v0.4: beads dropped in favour
  of markdown checkboxes; wet-lab planning agents producing material list, run sheet with
  checklist and schedule; live bench monitoring design; Google Docs sync for PI and lab
  members (publish, mirror, import modes); Benchling reduced to an occasional-import note
  after checking the Entries API (entry bodies are read-only). Decisions-to-make summary
  given in chat.
- **daytime** `docs/architecture.md` v0.1 then v0.2: first architecture from
  `context.md`, then revised after fetching every linked repo and site (neusis fleet,
  AutoGo, lab pages). Core principle fixed: markdown is the write model, everything else
  is a derived read model.
- **08:49** `context.md` written: purpose, labs, dry-lab references, Nix and neusis.
