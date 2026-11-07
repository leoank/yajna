#!/usr/bin/env bash
# Sets up the scenario docs/data-walkthrough.md walks through: a scratch notebook, two
# machines' worth of local stores, a shared "lab" store and sample data, all under one
# directory, so nothing touches your real ~/.config/yajna, ~/.local/share/yajna/store or
# any notebook you have.
#
#   docs/data-walkthrough.sh [DIR]          DIR defaults to ~/.cache/yajna-data-walkthrough
#   WALK_SSH=oppy WALK_SSH_PATH=/tmp/walk-store docs/data-walkthrough.sh
#                                           also names a store on another machine over ssh
#   YAJNA=/path/to/yajna docs/data-walkthrough.sh
#                                           use this binary instead of building the checkout
#
# Run it again to start over: it deletes DIR first, but only a DIR it made itself.
set -euo pipefail

repo=$(cd "$(dirname "$0")/.." && pwd)
D=${1:-$HOME/.cache/yajna-data-walkthrough}
D=${D%/}

if [ -e "$D" ]; then
  [ -f "$D/.yajna-data-walkthrough" ] || { echo "$D exists and was not made by this script; pick another DIR" >&2; exit 1; }
  chmod -R u+w "$D" 2>/dev/null || true
  rm -rf "$D"
fi
mkdir -p "$D"/{bin,machine-a,machine-b,config/yajna,stores,samples}
touch "$D/.yajna-data-walkthrough"
D=$(cd "$D" && pwd)

# --- the binary: this checkout's yajna, unless YAJNA names one ---------------------------
if [ -n "${YAJNA:-}" ]; then
  ln -s "$YAJNA" "$D/bin/yajna"
else
  echo "building yajna from $repo ..." >&2
  if command -v cargo >/dev/null && [ -n "${YAJNA_SRC:-}" ]; then
    cargo build -q --manifest-path "$repo/tools/Cargo.toml" -p yajna
  else
    nix develop "$repo" -c cargo build -q --manifest-path "$repo/tools/Cargo.toml" -p yajna
  fi
  ln -s "$repo/tools/target/debug/yajna" "$D/bin/yajna"
fi
Y="$D/bin/yajna"
v=$("$Y" --version | awk '{print $2}')
case "$v" in 0.[0-9].*|0.[12][0-9].*) echo "yajna $v is too old: the data commands need 0.30.0 or later" >&2; exit 1 ;; esac

# --- two machines sharing one user config --------------------------------------------------
# Each env file gives a shell its own XDG directories: machine A and machine B have their
# own `local` store, index cache and registry, and both name the same lab store.
for m in a b; do
  M=$(printf %s "$m" | tr a-z A-Z)
  cat >"$D/env-$m.sh" <<EOF
# source this: a shell that acts as machine $M of the walkthrough
export WALK=$D
export PATH=$D/bin:\$PATH
export XDG_CONFIG_HOME=$D/config
export XDG_DATA_HOME=$D/machine-$m/data
export XDG_CACHE_HOME=$D/machine-$m/cache
export XDG_STATE_HOME=$D/machine-$m/state
export WALK_MODELS=$D/machine-$m/models
export GIT_AUTHOR_NAME=walkthrough GIT_AUTHOR_EMAIL=walkthrough@example.invalid
export GIT_COMMITTER_NAME=walkthrough GIT_COMMITTER_EMAIL=walkthrough@example.invalid
export S=$D/samples
mkdir -p "\$WALK_MODELS"
# art <part of a title>: the ID of the ART page whose file name contains it
art() { ls notes/artifacts | grep -- "\$1" | head -1 | cut -c1-19; }
PS1="(walk $M) \${PS1:-\\\$ }"
EOF
done
{
  echo "[stores]"
  echo "lab = \"$D/stores/lab\""
  if [ -n "${WALK_SSH:-}" ]; then
    echo "remote = { ssh = \"$WALK_SSH\", path = \"${WALK_SSH_PATH:-/tmp/yajna-walk-store}\" }"
  fi
} >"$D/config/yajna/config.toml"

# --- sample data ------------------------------------------------------------------------------
# Random bytes stand in for images and checkpoints: they do not compress, so what dedup
# saves is visible in the store's size.
rnd() { head -c "$2" /dev/urandom >"$1"; }
MB=1048576
S="$D/samples"

# two versions of one large scan: v2 rewrites 1 MB in the middle of v1
rnd "$S/scan-v1.tif" $((24 * MB))
cp "$S/scan-v1.tif" "$S/scan-v2.tif"
dd if=/dev/urandom of="$S/scan-v2.tif" bs=$MB seek=10 count=1 conv=notrunc 2>/dev/null

# an imaging session: raw fields, QC images and a summary, metadata
mkdir -p "$S/session-01/raw" "$S/session-01/QC"
for i in $(seq -w 1 12); do rnd "$S/session-01/raw/field_0$i.tif" $((2 * MB)); done
for i in 1 2 3 4; do rnd "$S/session-01/QC/qc_00$i.png" 200000; done
printf 'field,focus,ok\n' >"$S/session-01/QC/summary.csv"
for i in $(seq -w 1 12); do printf 'field_0%s,0.9%s,yes\n' "$i" "${i: -1}" >>"$S/session-01/QC/summary.csv"; done
printf '{"microscope": "scope-1", "objective": "60x", "date": "2026-11-01"}\n' >"$S/session-01/metadata.json"

# the next session re-imaged the same plate: eight fields unchanged, four new, QC redone
cp -R "$S/session-01" "$S/session-02"
for i in 09 10 11 12; do rnd "$S/session-02/raw/field_0$i.tif" $((2 * MB)); done
for i in 1 2 3 4; do rnd "$S/session-02/QC/qc_00$i.png" 200000; done
sed -i.bak 's/2026-11-01/2026-11-02/' "$S/session-02/metadata.json" && rm "$S/session-02/metadata.json.bak"

# results kept on "another machine" that an old store: path page points at
mkdir -p "$S/E1c-maps"
for i in 1 2 3; do rnd "$S/E1c-maps/map_$i.npy" $((3 * MB)); done

# a video someone will try to commit
rnd "$S/movie.mp4" $((8 * MB))

# --- the notebook -------------------------------------------------------------------------------
# shellcheck disable=SC1091
. "$D/env-a.sh"
NB="$D/nb"
mkdir "$NB" && cd "$NB"
git init -q -b main
"$Y" init project "Data walkthrough" >/dev/null
cat >>yajna.toml <<'EOF'

[data]
push = ["lab"]
EOF
export YAJNA_AUTHOR=ank

exp=$("$Y" new experiment "Does the toy model train?" 2>&1 | grep -o 'EXP-[0-9]*-[0-9a-z]*' | head -1)
run_out=$("$Y" new run --experiment "$exp" --kind compute 2>&1)
run=$(printf '%s\n' "$run_out" | grep -o 'RUN-[0-9]*-[0-9a-z]*' | head -1)
run_page=notes/runs/$run.md
script=notes/runs/$run/run.sh
sed -i.bak "s|^script: null|script: $script|" "$run_page" && rm "$run_page.bak"
# the experiment's sections, which validate wants filled once it has runs
perl -0pi -e 's/## Question\n\n/## Question\nDoes a toy model train to a loss under 0.2?\n\n/;
  s/If H1 is true we expect \.\.\. ; if false we expect \.\.\./If it trains, the loss falls below 0.2./;
  s/## Plan\n1\. \n/## Plan\n1. Run the script once.\n/;
  s/## Success criteria\n\n/## Success criteria\nLoss under 0.2.\n\n/' notes/experiments/$exp-*.md
mkdir -p "$(dirname "$script")"
cat >"$script" <<'EOF'
#!/usr/bin/env bash
# The toy training run: a 3 MB checkpoint and a log beside this script, and the final
# model under $WALK_MODELS, outside the repo. Run from the repo root. Seeded, so running
# it again gives the same bytes and `yajna run reproduce` can say so.
set -euo pipefail
here=$(dirname "$0")
: "${WALK_MODELS:?source env-a.sh or env-b.sh first}"
noise() { perl -e 'srand($ARGV[0]); print pack("C*", map { int rand 256 } 1 .. $ARGV[1])' "$@"; }
noise 1 3145728 >"$here/checkpoint.bin"
noise 2 2097152 >"$WALK_MODELS/model-final.bin"
printf 'epoch 1 loss 0.42\nepoch 2 loss 0.17\n' >"$here/train.log"
echo '===RESULT=== {"loss": 0.17}'
EOF
chmod +x "$script"

# two pages from before stores existed: store: path, one file in the repo, one folder elsewhere
legacy() { # title path hash -> ART id
  local out page
  out=$("$Y" new artifact "$1" 2>&1)
  page=$(printf '%s\n' "$out" | grep -o 'notes/[^ ]*ART-[^ ]*\.md' | head -1)
  sed -i.bak -e "s|^path: \"\"|path: \"$2\"|" -e "s|^hash: null.*|hash: $3|" "$page" && rm "$page.bak"
  basename "$page" | cut -c1-19
}
mkdir -p raw
head -c $((3 * MB)) /dev/urandom >raw/calibration.bin
sha=$( (sha256sum raw/calibration.bin 2>/dev/null || shasum -a 256 raw/calibration.bin) | cut -d' ' -f1)
echo "/raw/" >>.gitignore
art_cal=$(legacy "Calibration frames" "raw/calibration.bin" "sha256:$sha")
art_e1c=$(legacy "E1c maps" "VPI_DATA/results/E1c (on oppy)" "null")

"$Y" validate >/dev/null
git add -A && git commit -qm "notebook for the data walkthrough"

cat >"$D/ids.sh" <<EOF
# IDs the setup created; env-a.sh and env-b.sh source it
export EXP=$exp RUN=$run RUN_SCRIPT=$script ART_CAL=$art_cal ART_E1C=$art_e1c
EOF
for m in a b; do echo ". $D/ids.sh" >>"$D/env-$m.sh"; done

cat <<EOF

Scenario ready in $D
  notebook         $NB (git, one commit)
  machine A / B    source $D/env-a.sh (or env-b.sh)
  stores           local per machine; lab = $D/stores/lab${WALK_SSH:+; remote = $WALK_SSH:${WALK_SSH_PATH:-/tmp/yajna-walk-store}}
  samples          $S
  IDs              EXP=$exp RUN=$run ART_CAL=$art_cal ART_E1C=$art_e1c
  yajna            $("$Y" --version)

Next: open docs/data-walkthrough.md and start at "1. Store a file".
EOF
