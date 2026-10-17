#!/usr/bin/env bash
# Parity check (ADR-0017): run the same scripted session through the Python CLI and the Rust
# binary on two fresh vaults and diff the results. Volume IDs and timestamps are normalised.
# Usage: tools/yajna-rs/parity.sh [path to rust binary]   (run inside `nix develop`)
set -euo pipefail
repo=$(cd "$(dirname "$0")/../.." && pwd)
rust=${1:-$repo/tools/yajna-rs/target/debug/yajna}
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

make_vault() {
  local v=$1
  mkdir -p "$v"/lab/{projects,protocols,materials,equipment,builds,agents,log,references} "$v/references"
  printf 'PRJ: 0\nEXP: 0\nPRO: 0\nMAT: 0\nANA: 0\nEQP: 0\nBLD: 0\n' > "$v/lab/counters.yaml"
  printf '# Tasks\n\n- [ ] \n' > "$v/lab/tasks.md"
  printf 'author = "tester"\nvault = "lab"\ntimezone = "Europe/London"\nbibliography = "references/library.bib"\n' > "$v/yajna.toml"
  printf '@article{shih2015cloning,\n  title = {Cloning on a {Chip}},\n  author = {Shih, Steve and Goyal, Garima},\n  year = {2015},\n  doi = {10.1021/acs.analchem.5b01905},\n  journal = {Analytical Chemistry}\n}\n' > "$v/references/library.bib"
  printf '{\n# projects: registered by yajna new project --code\n}\n' > "$v/flake.nix"
  cp -R "$repo/templates" "$v/templates"   # the Python CLI reads templates and schemas from the repo
  cp -R "$repo/schema" "$v/schema"
}

session() {
  local y=$1 v=$2
  $y --root "$v" new project "Archaeal division" >/dev/null
  $y --root "$v" new project "Toy model: a colon" --code >/dev/null 2>&1
  $y --root "$v" new experiment "ESCRT timing" --project PRJ-0001 >/dev/null
  $y --root "$v" new material "Strain xyz" --kind strain >/dev/null
  $y --root "$v" new protocol "Transformation" >/dev/null
  $y --root "$v" new equipment "Spinning disk" >/dev/null
  $y --root "$v" new build "Bench rig" >/dev/null
  $y --root "$v" new analysis "Timing" --project PRJ-0001 >/dev/null
  $y --root "$v" new artifact "Movie" --project PRJ-0001 >/dev/null
  $y --root "$v" new agent "Plate layout" >/dev/null
  $y --root "$v" new run --experiment EXP-0001 --kind compute >/dev/null
  $y --root "$v" log "Started induction for [[EXP-0001]] with [[MAT-0001]]" --time 09:10 >/dev/null
  $y --root "$v" log --author agent:planner --time 09:12 "Drafted a plan" >/dev/null
  printf 'training...\n===RESULT=== {"loss": 0.42, "steps": 3000, "tag": "baseline", "ok": true, "layers": [1, 2]}\n' | $y --root "$v" result --experiment EXP-0001 --note "first" >/dev/null
  printf '===RESULT=== {"loss": 0.4, "steps": 3000, "lr": 0.001}\n' | $y --root "$v" result --experiment EXP-0001 >/dev/null
  $y --root "$v" ref shih2015cloning --note >/dev/null
  $y --root "$v" tasks > "$v/tasks.out" 2>&1 || true
  $y --root "$v" validate > "$v/validate.out" 2>&1 || true
}

normalise() {
  # volume IDs and times differ between the two runs; names and contents are compared after
  # replacing them with placeholders
  python3 - "$1" <<'PY'
import re, shutil, sys
from pathlib import Path
v = Path(sys.argv[1])
vol = re.compile(r"(RUN|ART|AGS)-[0-9]{8}-[a-z2-7]{4}")
# number volume IDs in creation order (file mtime) so two runs keep their identity
pages = sorted((f for f in v.rglob("*.md") if vol.search(f.name)), key=lambda f: f.stat().st_mtime_ns)
names = {}
for f in pages:
    m = vol.search(f.name)
    names.setdefault(m.group(0), f"{m.group(1)}-DATE-{len(names) + 1:04d}")
def rename_ids(text):
    return vol.sub(lambda m: names.get(m.group(0), m.group(1) + "-DATE-xxxx"), text)
subs = [(vol, None),
        (re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2})?(\+[0-9]{2}:[0-9]{2}|Z)?"), "TIMESTAMP"),
        (re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}"), "DATE"),
        (re.compile(r"^commit: [0-9a-f]+$", re.M), "commit: HASH")]
for f in v.rglob("*"):
    if f.is_file() and f.suffix in (".md", ".tsv", ".out"):
        t = f.read_text()
        for rx, rep in subs:
            t = rename_ids(t) if rep is None else rx.sub(rep, t)
        f.write_text(t)
for f in sorted(v.rglob("*"), key=lambda p: -len(p.parts)):
    if vol.search(f.name):
        f.rename(f.with_name(rename_ids(f.name)))
shutil.rmtree(v / "templates", ignore_errors=True); shutil.rmtree(v / "schema", ignore_errors=True)
PY
}

make_vault "$work/py"; make_vault "$work/rs"
PYTHONPATH="$repo/tools/yajna" session "python3 -m yajna" "$work/py"
session "$rust" "$work/rs"
# the log file for today is named by date; both runs happen on the same day so the names match
normalise "$work/py"; normalise "$work/rs"
# validate wording differs between the two JSON Schema libraries; compare which locations
# are flagged, not the sentences
for v in py rs; do
  sed -E 's/^([^:]+: [^:]+):.*$/\1/' "$work/$v/validate.out" | sort > "$work/$v.validate"
  mv "$work/$v/validate.out" "$work/$v.validate.raw"
done
status=0
diff -r "$work/py" "$work/rs" || status=1
diff "$work/py.validate" "$work/rs.validate" || { status=1; echo "--- python validate"; cat "$work/py.validate.raw"; echo "--- rust validate"; cat "$work/rs.validate.raw"; }
if [ $status -eq 0 ]; then echo "parity: identical vaults"; else echo "parity: DIFFERENCES above"; exit 1; fi
