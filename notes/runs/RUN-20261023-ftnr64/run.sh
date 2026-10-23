#!/usr/bin/env bash
# RUN-20261023-ftnr64 (EXP-20261023-ftnatx): the mirror cycle against the real Drive. A
# scratch lab (namespace yajna-mirror-check) holds one mirror page with every construct
# the renderer handles; it is committed and published, its exports checked for
# determinism, edited from outside (drive.py edit), pulled, committed and published again.
#
#   nix develop -c notes/runs/RUN-20261023-ftnr64/run.sh [scratch-dir]
#
# `drive.py trash` (beside this script) trashes the scratch root folder afterwards.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
base="${1:-$HOME/.cache/yajna/mirror-check}"
a="$base/a"
rm -rf "$base"; mkdir -p "$base"
export YAJNA_AUTHOR=agent:claude NS=yajna-mirror-check
g() { git -C "$a" -c user.name=check -c user.email=check@example.org "$@"; }
git init -q "$a"
yajna --root "$a" init lab --namespace "$NS" --author ada >/dev/null 2>&1
cat > "$a/references/library.bib" <<'BIB'
@article{smith2020growth, author = {Smith, Jane and Doe, John}, title = {Growth under heat},
  journal = {J Bact}, year = {2020}}
BIB
linked=$(yajna --root "$a" new doc "Linked page" --kind note --dir notes/docs 2>/dev/null)
page=$(yajna --root "$a" new doc "Mirror check" --kind note --dir notes/docs 2>/dev/null)
lid=$(basename "$linked" | cut -c1-19)
python3 - "$a/$page" "$lid" <<'PY'
import sys
p, lid = sys.argv[1:]
t = open(p).read().replace("mode: publish", "mode: mirror")
fm = t[:t.index("\n---\n") + 5]
open(p, "w").write(fm + f"""
## Purpose
A paragraph wrapped at ninety columns, with *emphasis*, **bold**, `inline code`, a link
to [[{lid}|the linked page]] and a citation [@smith2020growth] in the middle of it.

## Body
- first item
- second item with *emphasis*
  - nested item

- [ ] an open task
- [x] a done task

| Strain | OD600 |
|--------|-------|
| BY4741 | 0.42 |

```sh
yajna sync pull
```
""")
PY
g add -A; g commit -qm check
yajna --root "$a" sync | tail -1
g commit -qam "doc ids"
python3 -I "$here/drive.py" check "$a/$page"
yajna --root "$a" sync pull
python3 -I "$here/drive.py" edit "$a/$page" "ninety columns=>eighty columns" "second item=>second edited item"
yajna --root "$a" sync | grep -E "^skip" || true
yajna --root "$a" sync pull
g diff --stat
g diff -U0 | grep -E '^[-+][^-+]' || true
g commit -qam pulled
yajna --root "$a" sync | tail -1
yajna --root "$a" sync pull
