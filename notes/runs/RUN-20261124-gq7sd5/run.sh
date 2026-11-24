#!/usr/bin/env bash
# EXP-20261124-gq45yv: warm cost of opening each project worktree's index.
# Usage: run.sh [lab container]  (default ~/workspace/chaos/manthan)
set -euo pipefail
lab="${1:-$HOME/workspace/chaos/manthan}"
total=0
for wt in $(git -C "$lab/main" worktree list --porcelain | awk '/^worktree /{print $2}'); do
  [ -f "$wt/yajna.toml" ] || continue
  yajna --root "$wt" tasks >/dev/null 2>&1 || true   # build the index
  ms=()
  for _ in 1 2 3 4 5; do
    a=$(perl -MTime::HiRes=time -e 'printf "%d", time*1000')
    yajna --root "$wt" tasks >/dev/null 2>&1 || true
    b=$(perl -MTime::HiRes=time -e 'printf "%d", time*1000')
    ms+=($((b - a)))
  done
  med=$(printf '%s\n' "${ms[@]}" | sort -n | sed -n 3p)
  total=$((total + med))
  echo "$(basename "$(dirname "$wt")")/$(basename "$wt") median ${med} ms (${ms[*]})"
done
echo "===RESULT=== {\"sum_median_ms\": $total}"
