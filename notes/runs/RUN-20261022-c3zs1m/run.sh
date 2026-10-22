#!/usr/bin/env bash
# RUN-20261022-c3zs1m (EXP-20261021-as4202, plan step 5 as far as one account goes): post a
# comment and a reply on the experiment doc through the real Drive comments API, pull them
# with `yajna sync`, tick the item, sync, and check the comment is resolved in the doc.
# Runs on the scratch lab RUN-20261022-c1dwfx leaves behind:
#
#   nix develop -c notes/runs/RUN-20261022-c3zs1m/run.sh [scratch-dir]
#
# The comment comes from the same account that owns the doc; a comment from another
# account, anchored in the Docs UI, is left to a human.
set -euo pipefail
lab="${1:-$HOME/.cache/yajna/sync-exp}"
here="$(cd "$(dirname "$0")" && pwd)"
[ -f "$lab/docs.txt" ] || { echo "run RUN-20261022-c1dwfx first"; exit 1; }
y() { yajna --root "$lab" "$@"; }
exp=$(awk 'NR==2{print $1}' "$lab/docs.txt")
epath=$(grep -rl --include="*.md" "^id: $exp" "$lab")

python3 -I "$here/drive.py" post "$lab"
echo "== sync 4 (pull)"; y sync | tee "$lab/sync4.txt"
pulled=$(grep -c 'gdoc:' "$epath" || true)
reply_pulled=$(grep -c '^  - .*a reply from the API' "$epath" || true)
sed -i.bak 's/^- \[ \] \(.*<!-- gdoc:\)/- [x] \1/' "$epath" && rm "$epath.bak"
echo "== sync 5 (tick)"; y sync | tee "$lab/sync5.txt"
echo "== sync 6 (settled)"; y sync | tee "$lab/sync6.txt"
python3 -I "$here/drive.py" check "$lab" "$pulled" "$reply_pulled" \
  "$(grep -c 'resolved in the doc' "$lab/sync5.txt" | head -1)" \
  "$(grep -o '[0-9]* resolved' "$lab/sync5.txt" | grep -o '[0-9]*')" \
  "$(grep -o '[0-9]* published' "$lab/sync6.txt" | grep -o '[0-9]*')" \
  "$(grep -o '[0-9]* new comment' "$lab/sync6.txt" | grep -o '[0-9]*')"
