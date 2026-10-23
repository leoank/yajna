#!/usr/bin/env bash
# RUN-20261023-pjazct (EXP-20261023-kjtach): how fast `yajna serve` lists and reads a
# run-sized tree. Builds a synthetic tree (directories of 1 000, 100 000 and 1 000 000
# empty files, a 100-deep chain of directories, a 10 GiB file of random bytes, a link out
# of the root and a loop), a scratch notebook whose one root is that tree, a release
# binary of this checkout, and then times the file API with bench.py beside this script.
#
#   nix develop -c notes/runs/RUN-20261023-pjazct/run.sh [scratch-dir]
#
# The tree is reused when it exists (building it takes minutes); delete the scratch
# directory afterwards, it holds 10 GiB. Prints a table and one ===RESULT=== line.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../../.." && pwd)"
base="${1:-$HOME/.cache/yajna/scale-check}"
tree="$base/tree"
mkdir -p "$base"

if [ ! -e "$tree/.done" ]; then
  rm -rf "$tree"; mkdir -p "$tree"
  python3 - "$tree" <<'PY'
import os, sys
tree = sys.argv[1]
for name, n in [("d1k", 1_000), ("d100k", 100_000), ("d1m", 1_000_000)]:
    d = os.path.join(tree, name)
    os.mkdir(d)
    for i in range(n):
        os.close(os.open(os.path.join(d, f"f{i:07d}.txt"), os.O_CREAT | os.O_WRONLY, 0o644))
deep = os.path.join(tree, "deep")
os.makedirs(os.path.join(deep, *["d"] * 100))
open(os.path.join(deep, *["d"] * 100, "leaf.txt"), "w").write("leaf\n")
os.symlink("/usr/share", os.path.join(tree, "link-out"))
os.symlink(tree, os.path.join(tree, "loop"))
PY
  dd if=/dev/urandom of="$tree/big.bin" bs=1048576 count=10240 status=none
  touch "$tree/.done"
fi

cargo build --release --quiet --manifest-path "$repo/tools/Cargo.toml"
bin="$repo/tools/target/release/yajna"

nb="$base/nb"
rm -rf "$nb"; mkdir -p "$nb"; git -C "$nb" init -q
"$bin" --root "$nb" init project "Scale check" --namespace scale-check --author agent:claude >/dev/null 2>&1
cat >> "$nb/yajna.toml" <<TOML

[[files.roots]]
name = "tree"
path = "$tree"
TOML

echo "machine: $(uname -sm), $(sysctl -n machdep.cpu.brand_string 2>/dev/null || grep -m1 'model name' /proc/cpuinfo)"
echo "filesystem: $(df -T "$tree" 2>/dev/null | tail -1 | awk '{print $2}' || true)$(mount | grep " on $(df "$tree" | tail -1 | awk '{print $NF}') " | sed 's/.*(\([a-z0-9]*\).*/\1/')"
echo "yajna: $("$bin" --version) at $(git -C "$repo" rev-parse --short HEAD)$(git -C "$repo" diff --quiet || echo '+dirty')"
python3 "$here/bench.py" "$bin" "$nb"
