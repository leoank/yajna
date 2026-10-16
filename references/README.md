# References

`library.bib` is the whole Zotero library in Better BibTeX format. Until the auto-export
exists it is a snapshot; refresh it with `tools/zotero/export.sh`. To make Zotero keep it
current: right-click My Library, Export Library, format Better BibTeX, tick Keep updated,
choose this file. (BBT's JSON-RPC can only register auto-exports for collections, not the
whole library, which is why this step is manual.) Do not edit the file by hand; edit in
Zotero and commit the result.

`tools/zotero/plan.json` is the collection and tag layout from ADR-0016 applied to the
current items; `tools/zotero/organize.py` applies it through the Web API with
`ZOTERO_API_KEY` and `ZOTERO_USER_ID` set.

Cite from any page with `[@citekey]`. `yajna ref <citekey>` shows the entry; `--note`
creates the reading note under `lab/references/`. `yajna validate` fails on unknown keys.

Citation keys follow Better BibTeX's default formula, `auth.lower + shorttitle(3, 3) +
year`: `moalGuideProteinProtein2020`. Pin a key (Zotero: right-click, Better BibTeX, Pin
citation key) once it is cited anywhere, so a metadata edit can never change it.
See `docs/decisions/ADR-0016-references.md`.
