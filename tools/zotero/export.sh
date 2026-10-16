#!/usr/bin/env bash
# Snapshot the whole Zotero library into references/library.bib through Better BibTeX's
# JSON-RPC (Zotero must be running with the local API enabled).
set -euo pipefail
cd "$(dirname "$0")/../.."
keys=$(curl -s -X POST http://localhost:23119/better-bibtex/json-rpc -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"item.search","params":[""],"id":1}' \
  | python3 -c 'import json,sys; print(json.dumps([i["citation-key"] for i in json.load(sys.stdin)["result"] if i.get("citation-key")]))')
curl -s -X POST http://localhost:23119/better-bibtex/json-rpc -H 'Content-Type: application/json' \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"item.export\",\"params\":[$keys,\"Better BibTeX\"],\"id\":2}" \
  | python3 -c '
import json, sys, datetime
r = json.load(sys.stdin)["result"]
text = r[0] if isinstance(r, list) else r
open("references/library.bib", "w").write(
    "% Snapshot exported from Zotero through Better BibTeX JSON-RPC on "
    + datetime.date.today().isoformat() + ".\n\n" + text.strip() + "\n")
print("references/library.bib:", text.count("\n@") + 1, "entries")
'
