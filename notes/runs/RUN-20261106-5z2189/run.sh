#!/usr/bin/env bash
# RUN-20261106-5z2189 (EXP-20261106-3t4cyw): a data store on another machine over plain ssh,
# driven from here. RUN-20261106-4vftn2's 564 MB (60 files, its manifest and cache) are
# added to a scratch notebook's local store, pushed to a scratch store on the host, pushed
# again (nothing to send), and pulled and written out into an empty local store; scp of the
# same files is the baseline. Existence checks over ssh are timed batched (1k, 16k, 100k
# names in one call) against one ssh per name (100 names). Writes measurements.tsv beside
# this script and a ===RESULT=== line; removes its scratch directories on the host.
#
#   nix develop -c notes/runs/RUN-20261106-5z2189/run.sh [host]
#
# The host needs ssh, sh, tar and a few GB free under ~/.cache; nothing is installed there.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/../../.." && pwd)"
host="${1:-oppy}"
remote=".cache/yajna/exp-c-$$"
data_run="$here/../RUN-20261106-4vftn2"
cache="$HOME/.cache/yajna/xet-dedup"
tail -n +2 "$data_run/manifest.tsv" | while IFS=$'\t' read -r set name url sha; do
  f="$cache/data/$name"
  [ -f "$f" ] || curl -sSfL -o "$f" "$url"
  echo "$sha  $f" | shasum -a 256 -c --quiet
done
cargo build -q --release -p yajna --manifest-path "$repo/tools/Cargo.toml"
y="$repo/tools/target/release/yajna"
work="$(mktemp -d)"
trap 'rm -rf "$work"; ssh -T "$host" "rm -rf ~/$remote ~/$remote-scp"' EXIT
export XDG_CONFIG_HOME="$work/config" XDG_STATE_HOME="$work/state" XDG_DATA_HOME="$work/laptop" YAJNA_AUTHOR=agent:claude
mkdir -p "$XDG_CONFIG_HOME/yajna"
printf '[stores]\nfar = { ssh = "%s", path = "~/%s" }\n' "$host" "$remote" > "$XDG_CONFIG_HOME/yajna/config.toml"
lab="$work/lab"; mkdir -p "$lab"; git -C "$lab" init -q
(cd "$lab" && "$y" init lab --namespace exp-c --author ada >/dev/null 2>&1 && "$y" new project "Transfer check" >/dev/null)

now() { echo "$EPOCHREALTIME"; }
since() { python3 -I -c "import sys; print(f'{float(sys.argv[2]) - float(sys.argv[1]):.2f}')" "$1" "$(now)"; }
out="$here/measurements.tsv"
printf 'what\tseconds\tMB\tMB_per_s\n' > "$out"
row() { python3 -I -c "import sys; s,m=float(sys.argv[2]),float(sys.argv[3]); print(f'{sys.argv[1]}\t{s:.2f}\t{m:.1f}\t{(m/s if s else 0):.1f}')" "$1" "$2" "$3" >> "$out"; }
input_mb=$(du -sk "$cache/data" | awk '{print $1/1024*1.048576}')

# round trip
t=$(now); for i in 1 2 3 4 5; do ssh -T "$host" true; done; rtt=$(since "$t")
row "ssh round trip x5" "$rtt" 0

# scp baseline
ssh -T "$host" "mkdir -p ~/$remote-scp"
t=$(now); scp -q -r "$cache/data/." "$host:$remote-scp/"; row "scp of the files" "$(since "$t")" "$input_mb"

# add, push, push again, get into an empty local store
t=$(now); (cd "$lab" && "$y" data add "$cache"/data/* --project PRJ-0001 >/dev/null 2>"$work/add.log"); row "data add (local)" "$(since "$t")" "$input_mb"
store_mb=$(du -sk "$XDG_DATA_HOME/yajna/store" | awk '{print $1/1024*1.048576}')
t=$(now); (cd "$lab" && "$y" data push --to far 2>"$work/push.log"); row "data push (store)" "$(since "$t")" "$store_mb"
t=$(now); (cd "$lab" && "$y" data push --to far 2>"$work/push2.log"); row "data push again" "$(since "$t")" 0
export XDG_DATA_HOME="$work/other"
t=$(now); (cd "$lab" && "$y" data get 2>"$work/get.log"); row "data get from far (pull and write)" "$(since "$t")" "$input_mb"
(cd "$lab" && "$y" data status) | grep -c "here  local: whole, far: whole" > "$work/whole"

# existence checks
for n in 1000 16000 100000; do
  python3 -I -c "import sys,os; print('\n'.join('xorbs/%s/%s' % (h[:2], h) for h in (os.urandom(32).hex() for _ in range(int(sys.argv[1])))))" "$n" > "$work/names"
  t=$(now); ssh -T "$host" "cd ~/$remote && while IFS= read -r f; do [ -f \"\$f\" ] && printf '%s\n' \"\$f\"; done; true" < "$work/names" > /dev/null
  row "exists, $n names, one ssh" "$(since "$t")" 0
done
t=$(now); head -100 "$work/names" | while IFS= read -r f; do ssh -T -n "$host" "test -f ~/$remote/$f" || true; done; row "exists, 100 names, one ssh each" "$(since "$t")" 0

column -t -s $'\t' "$out" >&2
cat "$work/push.log" "$work/get.log" | grep -E "pushed|pulled" >&2
python3 -I - "$out" "$(cat "$work/whole")" "$input_mb" "$store_mb" <<'PY'
import json, sys
rows = {l.split("\t")[0]: l.split("\t") for l in open(sys.argv[1]).read().splitlines()[1:]}
mbps = lambda k: float(rows[k][3])
print("===RESULT=== " + json.dumps({
    "files_whole_after_get": int(sys.argv[2]),
    "input_MB": round(float(sys.argv[3]), 1), "store_MB": round(float(sys.argv[4]), 1),
    "scp_MBps": mbps("scp of the files"), "push_MBps": mbps("data push (store)"),
    "get_MBps": mbps("data get from far (pull and write)"),
    "exists_16k_s": float(rows["exists, 16000 names, one ssh"][1]),
    "exists_one_each_ms": round(float(rows["exists, 100 names, one ssh each"][1]) * 10, 1),
}))
PY
