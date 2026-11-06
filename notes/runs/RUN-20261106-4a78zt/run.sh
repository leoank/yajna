#!/usr/bin/env bash
# RUN-20261106-4a78zt (EXP-20261106-3t3nn2): does tools/yajna-xet write what xet-core 1.8.0
# writes? The same cases (lib.rs in the harness: edge sizes, 300 MB of seeded random bytes
# and an edited copy, floats, text, Hugging Face's reference CSV) go through both, and each
# field of each case's record is compared: chunk boundaries and hashes, file hash, every
# xorb's hash, size and serialized bytes (footer nonce zeroed), the shard with lookup tables
# and the shard as uploaded. Then the reference xorb is read with our code and must rebuild
# the CSV through the reference shard.
#
#   nix develop -c notes/runs/RUN-20261106-4a78zt/run.sh [cache-dir]
#
# Needs the network once: crates.io for the harness, Hugging Face for the reference files
# (dataset xet-team/xet-spec-reference-files at a pinned revision, checked by sha256).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cache="${1:-$HOME/.cache/yajna/xet-compare}"
mkdir -p "$cache/ref"
rev=c4aa3a3f15b1395fff5ce934784bf6c8f2d62de8
base="https://huggingface.co/datasets/xet-team/xet-spec-reference-files/resolve/$rev"
csv=Electric_Vehicle_Population_Data_20250917.csv
xorb=eea25d6ee393ccae385820daed127b96ef0ea034dfb7cf6da3a950ce334b7632.xorb
fetch() { # name sha256
  local f="$cache/ref/$1"
  [ -f "$f" ] || curl -sSfL -o "$f.part" "$base/$1" && { [ ! -f "$f.part" ] || mv "$f.part" "$f"; }
  [ -z "${2:-}" ] || echo "$2  $f" | shasum -a 256 -c --quiet
}
fetch "$csv" f41255b252f776125f2b657136654e4d4d5d2ccf8ef4db0ec186bd1981b69734
fetch "$xorb" e72f4e05b9c4b96f1c6b2213d93de00ab943585a2f7c049fd127ba72ec1ff413
fetch "$csv.shard.verification"

export CARGO_TARGET_DIR="$cache/target"
cargo build -q --release --manifest-path "$here/harness/Cargo.toml" --bins
"$CARGO_TARGET_DIR/release/xetcore" "$cache/ref/$csv" > "$here/xetcore.txt"
"$CARGO_TARGET_DIR/release/ours" "$cache/ref/$csv" "$cache/ref/$xorb" "$cache/ref/$csv.shard.verification" > "$here/ours.txt"

python3 -I - "$here/xetcore.txt" "$here/ours.txt" <<'PY'
import json, sys
def load(p):
    return {f["case"]: f for f in (dict(kv.split("=", 1) for kv in l.split()) for l in open(p))}
theirs, ours = load(sys.argv[1]), load(sys.argv[2])
cases = fields = same = 0
diffs = []
for case, t in theirs.items():
    o = ours.get(case, {})
    cases += 1
    for k, v in t.items():
        if k == "case":
            continue
        fields += 1
        if o.get(k) == v:
            same += 1
        else:
            diffs.append(f"{case}.{k}: xet-core {v} ours {o.get(k)}")
ref = ours.get("reference-xorb", {})
for d in diffs:
    print("DIFFERS", d)
print("===RESULT=== " + json.dumps({
    "cases": cases, "fields": fields, "identical": same,
    "reference_xorb_rebuilds_csv": ref.get("rebuilds_csv") == "true",
    "reference_xorb_had_footer": ref.get("had_footer") == "true",
}))
PY
