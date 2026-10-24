#!/usr/bin/env bash
# RUN-20261024-p44p6z (EXP-20261023-kjtrwp): does `yajna serve` see what a run writes, and
# how soon? A scratch notebook with one root watched through filesystem events (auto) and
# one polled, both in the given directory (default: a temporary one on the local disk);
# measure.py beside this script times an append to its change event, counts the events a
# burst of writes produces, and reports how each root is kept current.
#
#   nix develop -c notes/runs/RUN-20261024-p44p6z/run.sh [directory on the filesystem to test]
#
# Run it on every filesystem runs write to; on shared storage, also append from another
# machine (see measure.py --remote).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../../.." && pwd)"
base="${1:-$(mktemp -d)}"
mkdir -p "$base/watched" "$base/polled" "$base/nb"
cargo build --release --quiet --manifest-path "$repo/tools/Cargo.toml"
bin="$repo/tools/target/release/yajna"
git -C "$base/nb" init -q
"$bin" --root "$base/nb" init project "Watch check" --namespace watch-check --author agent:claude >/dev/null 2>&1
cat >> "$base/nb/yajna.toml" <<TOML

[[files.roots]]
name = "watched"
path = "$base/watched"

[[files.roots]]
name = "polled"
path = "$base/polled"
watch = "poll"
TOML
echo "machine: $(uname -sm), $(sysctl -n machdep.cpu.brand_string 2>/dev/null || grep -m1 'model name' /proc/cpuinfo)"
echo "filesystem: $(df -T "$base" 2>/dev/null | tail -1 | awk '{print $2}')$(mount | grep " on $(df "$base" | tail -1 | awk '{print $NF}') " | sed 's/.*(\([a-z0-9]*\).*/\1/')"
echo "yajna: $("$bin" --version) at $(git -C "$repo" rev-parse --short HEAD)$(git -C "$repo" diff --quiet || echo '+dirty')"
python3 "$here/measure.py" "$bin" "$base"
