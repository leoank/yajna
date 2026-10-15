# Build progress

Running log of what has been built in this repo, newest first within each day. Times are
local (Europe/London). Entries before 2026-10-15 09:00 are reconstructed from file
modification stamps and document changelogs, so they carry a date and a rough time.
Append an entry whenever a document, tool or dataset lands; keep each to a few lines and
link the file.

## 2026-10-15

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
