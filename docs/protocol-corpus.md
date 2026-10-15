# Protocol corpus: published protocols as test fixtures for the framework

Status: v0.1, 2026-10-15. Companion to `docs/protocol-framework.md`.

## 1. Purpose

The protocol framework claims it can express ordinary bench protocols as code and render
them back into the step convention. That claim needs real protocols to test against, not
the one transformation example we wrote ourselves. This corpus is a set of published
protocols, fetched into plain markdown with provenance in frontmatter, so that we can:

- try to write each one in the framework and see what breaks,
- compare the framework's rendered steps with the published steps,
- record per protocol which commands were missing, which steps needed the free-text
  escape hatch, and which constructs were awkward,
- later, feed the troubleshooting questions from LAB-Bench to the simulator and see
  whether it catches the planted errors.

It is a test set, not training data. Keep it small and deliberately varied.

## 2. Sources

| Source | What it is | Access route | Structure | Licence | Volume | Status |
|---|---|---|---|---|---|---|
| Bio-protocol | Peer-reviewed protocol journal, 2011 to date | Europe PMC full-text XML for the open-access subset; PMC article HTML for the rest | Materials and reagents, Equipment, Procedure (lettered parts, numbered steps, notes), Recipes, Data analysis, Troubleshooting | CC BY-NC 4.0 for open-access articles (mostly 2023 on); older articles are free to read with no CC licence stated | 3,841 with full text in PMC; 1,187 in the open-access subset | fetch works, both routes |
| STAR Protocols | Cell Press protocol journal | Europe PMC XML | Key resources table, recipe tables, Step-by-step with Timing, Note and CRITICAL callouts, nested lists, Troubleshooting as problem and solution pairs | CC BY-NC 4.0 (some CC BY) | 4,701 open access | fetch works |
| JoVE | Video journal; the text protocol and table of materials are in PMC, the video is not | Europe PMC XML or PMC HTML | Protocol section with numbered substeps | CC BY-NC-ND 3.0 | 2,156 open access | fetch works |
| MethodsX | Elsevier methods journal | Europe PMC XML | Method details, less formal | CC BY mostly | 4,045 open access | fetch works |
| protocols.io | Largest open protocol platform, step-level JSON with components (durations, amounts, reagents) | REST API v4 with a free client access token from protocols.io/developers; 100 requests per minute | Steps with titles and markdown bodies, structured components | CC BY 4.0 typical, per protocol | well over 10,000 public | implemented, untested (needs token) |
| BioProt (BioPlanner, O'Donoghue et al. 2023) | 100 protocols.io protocols with LLM-generated pseudocode, used to evaluate protocol planning | GitHub raw JSON, `bioplanner/bioplanner` | Description, flat steps text, Python-like pseudocode | repo has no licence file; underlying protocols are protocols.io content | 100 | fetch works |
| LAB-Bench ProtocolQA (FutureHouse 2024) | 108 protocols each paired with a troubleshooting question and the correct fix | Hugging Face datasets-server JSON rows | Flat step text, question, ideal answer, distractors | CC BY-SA 4.0; carries a canary string, must not enter training data | 108 | fetch works |
| OpenWetWare | Community wiki, mostly 2005 to 2015 | MediaWiki API, wikitext | Headings and wiki lists, quality varies | CC BY-SA 3.0 | 699 pages in Category:Protocol | fetch works |

Sources considered and not used:

- **Bio-protocol's own website.** Behind a SafeLine web application firewall with a
  JavaScript challenge. curl gets the challenge page and a headless browser gets a
  "Debugging detected" block. The sitemap lists 5,056 protocol pages, but every one of
  them is also in PMC, so there is nothing to gain by fighting the firewall.
- **Nature Protocols, Current Protocols, Cold Spring Harbor Protocols, Methods in
  Molecular Biology.** Paywalled. Individual papers can be added by hand if a specific
  one matters.
- **Springer Nature Protocol Exchange.** Now redirects to protocols.io.
- **PLOS ONE Lab Protocols.** The article is a wrapper; the protocol itself lives on
  protocols.io.
- **Addgene and NEB protocol pages.** Useful references, but website terms do not allow
  scraping and the content is not licensed for reuse.
- **Already machine-readable protocols**: Autoprotocol examples, LabOP examples, the
  Opentrons protocol library on GitHub. These are positive controls for the intermediate
  representation rather than tests of expressiveness, and are worth adding when the IR
  schema is being decided (framework doc, section 9).

## 3. The tool

`tools/corpus/corpus.py`, standard library only, so it runs under the repo's Python
without a lockfile.

```
python3 tools/corpus/corpus.py search bioprotocol '"heat shock" AND transformation' --limit 10
python3 tools/corpus/corpus.py search oww "Gibson assembly"
python3 tools/corpus/corpus.py fetch PMC8342084 PMC13449778 "oww:Muratore:Protocols/Transformation" bioprot:1007
python3 tools/corpus/corpus.py fetch labbench        # all 108 ProtocolQA rows
PROTOCOLS_IO_TOKEN=... python3 tools/corpus/corpus.py fetch pio:12345
python3 tools/corpus/corpus.py index                 # rewrite corpus/index.md
```

Search sources are `bioprotocol`, `star`, `jove`, `methodsx` (Europe PMC, Lucene query
syntax) and `oww`. Search output marks open-access-subset hits with `OA`; the others are
fetched as PMC HTML.

What fetch does:

1. Downloads the original into `corpus/raw/` (XML, HTML, JSON or wikitext). This is a
   cache, ignored by git, so the converter can be rerun without refetching.
2. Converts to markdown: headings for sections, nested numbered lists with the original
   labels (`A.`, `1.`, `a.`), tables as markdown tables, Note, CRITICAL and Timing
   callouts as blockquotes, figures as a caption line. References, acknowledgements,
   declarations and supplementary sections are dropped.
3. Writes `corpus/protocols/<source>/<id>.md` with frontmatter: title, source, origin,
   journal, year, doi, url, licence, authors, keywords, fetched date and
   `framework_status` (see section 5).
4. Regenerates `corpus/index.md`.

Politeness: one request per second per host, two seconds for PMC article pages. PMC's
policy allows crawling `/articles/` but forbids systematic bulk retrieval, so the HTML
route is for tens of protocols, not thousands. For bulk, Europe PMC's REST API and
open-access bulk downloads are the sanctioned route and cover everything with a CC
licence.

Known rough edges:

- Newer Bio-protocol XML encodes procedure steps as flat paragraphs beginning with
  "1.", "2.", so they come out as paragraphs that happen to render as a list. The PMC
  HTML route for the same article gives real nested lists. If the structure matters for
  a particular protocol, fetch it via HTML by deleting the cached XML.
- BioProt step text contains artefacts from the original export, such as "2amount"
  tokens where protocols.io components were flattened. They are in the dataset itself.
- OpenWetWare conversion is a small regex pass; templates and tables are dropped.
- The protocols.io path has not been run. It needs a token and the v4 step payload
  shape may differ from what the code expects.

## 4. Corpus v0

Chosen for variety along the axes the framework has to cover: liquid handling density,
equipment beyond pipettes, timing and incubations, branching and checks, tables of
reagents and cycling conditions, organisms, and the notation style of the source.

| File | Why it is in |
|---|---|
| `oww/muratore-protocols-transformation` | Ten-line heat-shock transformation. The smallest possible target; should be fully expressible with the core commands. |
| `oww/round-the-horn-site-directed-mutagenesis` | Prose-heavy wiki protocol with a long rationale; tests how much ends up in `step()` text. |
| `bioprotocol/PMC8342084` | Quantitative transformation efficiency assay in B. subtilis. Nested lettered parts, OD checks, serial dilutions, plating, recipes. Via PMC HTML. |
| `bioprotocol/PMC13103967` | Multiplex engineering of E. coli with antibiotic markers. Long, cloning-heavy. |
| `bioprotocol/PMC13103966` | Site-specific incorporation of 3-nitro-tyrosine in E. coli. Genetic code expansion, close to the lab's own work. |
| `bioprotocol/PMC11349492` | Tetrazine amino acid encoding for bioconjugation. Expression, purification, click chemistry. |
| `bioprotocol/PMC9501757` | Non-standard amino acids in a Gram-positive organism. Via PMC HTML. |
| `bioprotocol/PMC13156698` | Parallelised nanobody cloning, mammalian expression and purification. The longest, many parallel samples; tests batching. |
| `bioprotocol/PMC8899560` | mRNA 3' end assay in an E. coli cell-free system. Via PMC HTML. |
| `bioprotocol/PMC9724014` | Genome-wide libraries for protein-ligand screens using Gibson assembly, 2022. Via PMC HTML. |
| `bioprotocol/PMC10266446` | Chemiluminescent western blot quantification. Gels, transfer, imaging, analysis. |
| `bioprotocol/PMC13598653` | SPAAC palmitoylation detection. Cell culture, lysis, click, blot; the newer flat-paragraph XML style. |
| `bioprotocol/PMC12689440` | Yeast life cycle imaging on a microfluidic platform. Device handling and long time-lapse. |
| `star/PMC13449778` | CRISPR editing in S. cerevisiae with PCR-based guide insertion. Reagent tables, cycling tables, Timing and CRITICAL callouts, troubleshooting pairs. |
| `star/PMC13312114` | Golden Gate assembly plus yeast recombination for multigene pathways. Combinatorial cloning. |
| `star/PMC13543884` | Live imaging of phage infection in B. subtilis at single-cell resolution. Microscopy and agarose pads. |
| `jove/PMC2762917` | Homemade site-directed mutagenesis of whole plasmids, 2009. Older JoVE text style. |
| `methodsx/PMC13602318` | Multigene knockout in THP-1 cells with CRISPR-Cas9. Mammalian cells, electroporation. |
| `bioprot/1007`, `1388`, `14800` | protocols.io protocols with pseudocode; compare their pseudocode with our command vocabulary. |
| `labbench/*` (108) | Protocols with planted errors and the fix; for the simulator later. Not for expressiveness work. |

## 5. How the corpus is used as tests

For each protocol outside `labbench/`:

1. Write it in the framework as `corpus/framework/<source>-<id>/protocol.py`, staying
   faithful to the published steps rather than improving them.
2. Render it and put the rendered steps next to the original. The comparison is by eye
   at first; a step-level diff can come later once the IR is stable.
3. Set `framework_status` in the protocol's frontmatter to one of:
   - `expressed`: every step is a typed command, no free text beyond notes;
   - `partial`: renders completely but some steps needed `step()` free text, listed in
     the scorecard;
   - `blocked`: a construct the framework cannot represent yet;
   - `untested`.
4. Add a row to `corpus/scorecard.md`: protocol, status, share of steps that are typed
   commands, missing commands, awkward constructs, time taken.

Order of attack: the two OpenWetWare protocols, then the B. subtilis transformation
assay, then the STAR CRISPR protocol because it exercises tables, callouts and timing,
then one long Bio-protocol and the JoVE one. Stop and change the framework when the same
gap appears in two protocols.

For `labbench/`: once simulate exists, write the protocol as code, run the checks, and
record whether the simulator flags anything near the step named in the ideal answer.
Many of the planted errors are biological rather than mechanical, so the expected hit
rate is low; the interesting cases are the ones about volumes, temperatures, timings and
missing steps.

## 6. Licence and conduct notes

- CC BY-NC and CC BY-NC-ND content is fine to hold and transform for internal research
  and testing. Do not publish the converted corpus or ship it in a public release
  without checking each licence; CC BY-NC-ND does not permit distributing derivatives.
- Older Bio-protocol articles have no CC licence. They are free to read; treat the
  converted files as private working copies.
- LAB-Bench ProtocolQA carries a canary string in every file's frontmatter. Keep it,
  and keep the files out of any training or fine-tuning data.
- The fetcher identifies itself with a descriptive user agent and respects robots.txt
  and crawl delays. Do not point it at the Bio-protocol website.
- PMC occasionally answers an article request with a reCAPTCHA page instead of the
  article, even at two seconds between requests. The fetcher detects this, writes
  nothing, and asks you to retry later; a retry a few seconds later has worked so far.

## 7. Next steps

- Get a protocols.io client token and run the `pio:` path once, then fix the step
  payload parsing against real output.
- Add the three positive controls (an Autoprotocol example, a LabOP example, an Opentrons
  library protocol) when the IR schema decision is made.
- Start the scorecard with the OpenWetWare transformation protocol as soon as Phase 0
  of the framework can render anything.
