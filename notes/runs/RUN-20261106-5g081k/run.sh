#!/usr/bin/env bash
# RUN-20261106-5g081k (EXP-20261106-3t40bg): zstd per chunk against LZ4 and against zstd of
# whole files, on RUN-20261106-4vftn2's data (its manifest and cache; run that first, or
# this fetches the files the same way). Writes zstd.tsv beside this script.
#
#   nix develop -c notes/runs/RUN-20261106-5g081k/run.sh [cache-dir]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
data_run="$here/../RUN-20261106-4vftn2"
cache="${1:-$HOME/.cache/yajna/xet-dedup}"
mkdir -p "$cache/data"
tail -n +2 "$data_run/manifest.tsv" | while IFS=$'\t' read -r set name url sha; do
  f="$cache/data/$name"
  [ -f "$f" ] || curl -sSfL -o "$f" "$url"
  echo "$sha  $f" | shasum -a 256 -c --quiet
done
export CARGO_TARGET_DIR="$cache/target-zstd"
cargo build -q --release --manifest-path "$here/harness/Cargo.toml"
"$CARGO_TARGET_DIR/release/xet-zstd" "$data_run/manifest.tsv" "$cache/data" > "$here/zstd.tsv"
column -t -s $'\t' "$here/zstd.tsv" >&2
