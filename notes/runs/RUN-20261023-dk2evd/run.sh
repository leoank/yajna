#!/usr/bin/env bash
# RUN-20261023-dk2evd (EXP-20261023-cy5j5f): does the reference list keep its layout in a
# real Google Doc? A scratch lab (namespace yajna-ref-style) adopts a copy of a proposal
# and its .bib, syncs it, and exports the doc as PDF and HTML to look at. Not in the repo:
# the proposal is private, so its path is an argument.
#
#   nix develop -c notes/runs/RUN-20261023-dk2evd/run.sh <proposal.md> <proposal.bib> [scratch-dir]
#
# `drive.py trash` (beside this script) trashes the scratch root folder afterwards.
set -euo pipefail
md="$1"; bib="$2"; base="${3:-$HOME/.cache/yajna/ref-style}"
here="$(cd "$(dirname "$0")" && pwd)"
a="$base/a"
rm -rf "$base"; mkdir -p "$a/thesis/proposals"
export YAJNA_AUTHOR=agent:claude
git init -q "$a"
yajna --root "$a" init lab --namespace yajna-ref-style --author ada >/dev/null
# the body only: an adopted page carries frontmatter yajna writes itself
python3 -c "
import sys; t=open(sys.argv[1]).read()
if t.startswith('---\n'): t=t.split('\n---\n',1)[1]
open(sys.argv[2],'w').write(t)" "$md" "$a/thesis/proposals/proposal.md"
cp "$bib" "$a/thesis/proposals/proposal.bib"
page=$(yajna --root "$a" adopt "$a/thesis/proposals/proposal.md" --kind proposal --title "Reference style check" 2>/dev/null)
yajna --root "$a" sync | tail -1
NS=yajna-ref-style python3 -I "$here/drive.py" export "$a/$page" "$base"
