#!/usr/bin/env bash
# RUN-20261023-d7vw53 (EXP-20261023-cy5j5f): folder mirroring and pandoc citations against
# the real Google Drive. A scratch lab with its own namespace (so its root folder is new)
# syncs a project page, an experiment, a meeting doc and an adopted proposal that cites
# from its own .bib; a second clone syncs again; the meeting moves to another folder after
# a comment is left on it. drive.py then reads Drive back. Needs `yajna sync login` once
# and pandoc on PATH (the dev shell has both yajna and pandoc):
#
#   nix develop -c notes/runs/RUN-20261023-d7vw53/run.sh [scratch-dir]
#
# Doc and folder IDs stay in the scratch dir. `drive.py trash <scratch-dir>` trashes the
# root folder (and so everything the run made) afterwards.
set -euo pipefail
base="${1:-$HOME/.cache/yajna/sync-check}"
here="$(cd "$(dirname "$0")" && pwd)"
a="$base/a"; b="$base/b"
rm -rf "$base"; mkdir -p "$base"
export YAJNA_AUTHOR=agent:claude
g() { git -C "$1" -c user.name=sync-check -c user.email=sync-check@example.invalid "${@:2}"; }
y() { yajna --root "$1" "${@:2}"; }
mark() { python3 -c "
import sys; p=sys.argv[1]; t=open(p).read()
open(p,'w').write(t.replace('\ntags: []\n', '\ntags: []\nsync: {provider: gdoc, mode: publish}\n', 1))" "$1"; }

git init -q "$a"
y "$a" init lab --namespace yajna-sync-check --author ada >/dev/null
y "$a" new project "Sync check" >/dev/null
exp=$(y "$a" new experiment "Folders" --project PRJ-0001)
mark "$a/notes/projects/PRJ-0001-sync-check/README.md"; mark "$a/$exp"
meeting=$(y "$a" new doc "Committee meeting" --kind meeting --dir thesis/meetings 2>/dev/null)
mkdir -p "$a/thesis/proposals"
printf '## Question\nCan a genome predict a cell'"'"'s shape [@shih2015cloning]? Mail ada@example.org.\n\n- [ ] read the reviews\n' > "$a/thesis/proposals/proposal.md"
printf '@article{shih2015cloning,\n title={A versatile microfluidic device for automating synthetic biology},\n author={Shih, Steve C. C. and Goyal, Garima and Kim, Peter W.},\n year={2015},\n journal={ACS Synthetic Biology},\n volume={4},\n pages={1151--1164}\n}\n' > "$a/thesis/proposals/proposal.bib"
proposal=$(y "$a" adopt "$a/thesis/proposals/proposal.md" --kind proposal --title "Shape proposal" 2>/dev/null)
y "$a" validate
g "$a" add -A; g "$a" commit -qm start

echo "== sync 1 (first)"; y "$a" sync | tee "$base/sync1.txt"
g "$a" add -A; g "$a" commit -qm "doc ids"
echo "== sync 2 (second clone)"; git clone -q "$a" "$b"; y "$b" sync | tee "$base/sync2.txt"
python3 -I "$here/drive.py" comment "$a/$meeting"
newdir="$a/thesis/archive"; mkdir -p "$newdir"
g "$a" mv "$meeting" "thesis/archive/$(basename "$meeting")"; g "$a" commit -qm move
echo "== sync 3 (moved)"; y "$a" sync | tee "$base/sync3.txt"
printf '%s\n' "$exp" "thesis/archive/$(basename "$meeting")" "$proposal" > "$base/pages.txt"
python3 -I "$here/drive.py" check "$base"
