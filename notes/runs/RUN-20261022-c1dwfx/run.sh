#!/usr/bin/env bash
# RUN-20261022-c1dwfx (EXP-20261021-as4202, plan steps 2-4): publish a project page and an
# experiment from a scratch lab to real Google Docs, sync again unchanged, edit and sync,
# then read the docs back through the Drive API to check structure, links, doc IDs and
# yajna_hash. Needs `yajna sync login` done once; the token never enters the repo.
#
#   nix develop -c notes/runs/RUN-20261022-c1dwfx/run.sh [scratch-dir]
#
# The scratch lab (default ~/.cache/yajna/sync-exp) keeps its doc_ids, so plan step 5
# (comments) can reuse it. Doc IDs are printed only there, never into the repo.
set -euo pipefail
lab="${1:-$HOME/.cache/yajna/sync-exp}"
here="$(cd "$(dirname "$0")" && pwd)"
rm -rf "$lab"
mkdir -p "$lab"
y() { yajna --root "$lab" "$@"; }

git -C "$lab" init -q
y init lab >/dev/null
export YAJNA_AUTHOR=agent:claude
prj=$(y new project "Sync scratch" | grep -o 'PRJ-[0-9]*' | head -1)
exp=$(y new experiment "Does the doc survive" --project "$prj" | grep -oE 'EXP-[0-9]{8}-[0-9a-z]{6}' | head -1)
ppath=$(grep -rl --include="*.md" "^id: $prj" "$lab")
epath=$(grep -rl --include="*.md" "^id: $exp" "$lab")

mark() { # add the sync field after the id line
  python3 - "$1" <<'PY'
import sys; p=sys.argv[1]; t=open(p).read()
t=t.replace("\ntype:", "\nsync: {provider: gdoc, mode: publish}\ntype:", 1)
open(p,"w").write(t)
PY
}
mark "$ppath"; mark "$epath"
cat >> "$epath" <<MD

## Probe
A list:
- first item with **bold** and \`code\`
- second item linking to [[$prj]]

| sample | value |
|---|---|
| a | 1 |
| b | 2 |

- [ ] an open task
- [x] a done task
MD

echo "== sync 1 (create)"; y sync | tee "$lab/sync1.txt"
echo "== sync 2 (unchanged)"; y sync | tee "$lab/sync2.txt"
echo "- a line added after the first publish" >> "$epath"
echo "== sync 3 (edited)"; y sync | tee "$lab/sync3.txt"

docid() { python3 -c "import re,sys; m=re.search(r'doc_id: *\"?([A-Za-z0-9_-]+)', open(sys.argv[1]).read()); print(m.group(1) if m else '')" "$1"; }
pdoc=$(docid "$ppath"); edoc=$(docid "$epath")
[ -n "$pdoc" ] && [ -n "$edoc" ] || { echo "no doc_id written"; exit 1; }
printf '%s %s\n%s %s\n' "$prj" "$pdoc" "$exp" "$edoc" > "$lab/docs.txt"

python3 -I "$here/check.py" "$lab" "$pdoc" "$edoc" \
  "$(grep -c '^created ' "$lab/sync1.txt")" \
  "$(grep -c '^published ' "$lab/sync1.txt")" \
  "$(grep -c '^published ' "$lab/sync2.txt")" \
  "$(grep -c '^published ' "$lab/sync3.txt")" \
  "$(grep -c 'created ' "$lab/sync3.txt")"
