#!/usr/bin/env bash
# RUN-20261106-4vftn2 (EXP-20261106-3t40bg): how much Xet chunk-level dedup saves and how
# fast chunking runs, on public stand-ins for the lab's data (manifest.tsv): Pythia-14m
# training checkpoints early and late, BERT-tiny and two fine-tunes, a 4D OME-TIFF
# time-lapse and a second sample (MitoCheck), daily versions of the JHU COVID-19 CSV, a CSV
# with rows appended, edited and deleted, and 100 MB of random bytes with three edits.
# Writes measurements.tsv beside this script; the summary goes to stderr as ===RESULT===.
#
#   nix develop -c notes/runs/RUN-20261106-4vftn2/run.sh [cache-dir]
#
# Downloads 564 MB once (Hugging Face, downloads.openmicroscopy.org, GitHub), each file
# checked against the sha256 in manifest.tsv; crates.io for the harness.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cache="${1:-$HOME/.cache/yajna/xet-dedup}"
mkdir -p "$cache/data"
tail -n +2 "$here/manifest.tsv" | while IFS=$'\t' read -r set name url sha; do
  f="$cache/data/$name"
  [ -f "$f" ] || curl -sSfL -o "$f" "$url"
  echo "$sha  $f" | shasum -a 256 -c --quiet
done
export CARGO_TARGET_DIR="$cache/target"
cargo build -q --release --manifest-path "$here/harness/Cargo.toml"
"$CARGO_TARGET_DIR/release/xet-dedup" "$here/manifest.tsv" "$cache/data" > "$here/measurements.tsv"
column -t -s $'\t' "$here/measurements.tsv" >&2
