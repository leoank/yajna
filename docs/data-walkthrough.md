# Data stores: a walkthrough to test by hand

This walks through everything Phase 2 built (`docs/data.md`, steps 3 to 8) in a scratch
notebook with two "machines" and a shared lab store. `docs/data-walkthrough.sh` sets the
scenario up and this page is what to run and what to look for. It takes about 20 minutes
and about 550 MB of disk.

Nothing touches your real setup. Each machine is a shell whose `XDG_*` directories point
inside the scenario directory, so your `~/.config/yajna`, `~/.local/share/yajna/store`,
index cache and notebook registry are left alone. Each machine has its own
`$WALK_MODELS`, where the toy run keeps its model outside the repo.

## 0. Set up

From this repo's root:

```sh
docs/data-walkthrough.sh                 # or: docs/data-walkthrough.sh ~/scratch/walk
```

It builds this checkout's `yajna` (through `nix develop` when you are not already in the
dev shell) and creates, under `~/.cache/yajna-data-walkthrough`:

| Path | What |
|---|---|
| `nb/` | A project notebook in git, one commit, with `[data] push = ["lab"]` in `yajna.toml` |
| `env-a.sh`, `env-b.sh` | Source one to make a shell act as machine A or B |
| `config/yajna/config.toml` | Both machines' user config: `[stores] lab = …/stores/lab` |
| `machine-a/`, `machine-b/` | Each machine's `local` store, cache and `$WALK_MODELS` |
| `samples/` | Two versions of a 24 MiB scan; two imaging sessions of 18 files that share 9; three 3 MiB maps; an 8 MiB video |
| In `nb/` | An experiment and a compute run whose script writes a 3 MiB checkpoint and a 2 MiB model; two old `store: path` ART pages (`$ART_CAL`, `$ART_E1C`) and the 3 MiB file one of them names |

Run it again to start over; it only ever deletes a directory it made. To also test a store
on another machine over ssh, give it one (section 12):

```sh
WALK_SSH=oppy WALK_SSH_PATH=/tmp/yajna-walk-store docs/data-walkthrough.sh
```

The env files set `$WALK` (the scenario), `$S` (the samples), `$WALK_MODELS`, the IDs
`$EXP`, `$RUN`, `$ART_CAL`, `$ART_E1C`, and a helper `art <part of a title>` that prints
an ART page's ID. Every command below runs in bash or zsh.

## Machine A

```sh
. ~/.cache/yajna-data-walkthrough/env-a.sh
cd "$WALK/nb"
```

### 1. Store a file, write it back

```sh
yajna data add "$S/scan-v1.tif" --title "Plate 3 scan"
SCAN=$(art plate-3-scan.md)
yajna data status $SCAN
yajna data get $SCAN
yajna data status $SCAN
cmp "$S/scan-v1.tif" data/$SCAN/scan-v1.tif && echo same
sed -n '1,17p' notes/artifacts/$SCAN-*.md
git status --short
```

Look for:

- `stored in local (25.2 MB, 0 B of it already there)`.
- The page has `store: xet`, `path: data/<ID>/scan-v1.tif`, `hash: sha256:…`, a 64-hex
  `xet:`, `size: 25165824` and `kind: file`. A file from outside the repo gets a path under
  `data/<ID>/`. The file itself stays where it was.
- `status` says `missing` until `get`, then `here`, with `local: whole, lab: -  (1 copy)`.
- `/data/` is in `.gitignore` and `git status` shows only the page and `.gitignore`.

### 2. Deduplication

```sh
du -sh "$XDG_DATA_HOME/yajna/store"
yajna data add "$S/scan-v2.tif" --title "Plate 3 scan, refocused"
du -sh "$XDG_DATA_HOME/yajna/store"
```

v2 is v1 with 1 MiB rewritten in the middle. Look for about `23.8 MB of it already there`
(the exact figure varies with the random bytes), and
for the store growing by about 1 MB (24M to 25M), not 24 MB.

### 3. A folder is one bundle

```sh
yajna data add "$S/session-01" --title "Plate 3, session 1"
yajna data add "$S/session-02" --title "Plate 3, session 2"
S1=$(art session-1.md); S2=$(art session-2.md)
sed -n '1,17p' notes/artifacts/$S1-*.md
yajna data status
```

Look for:

- `stored in local as a bundle of 18 file(s) (26.0 MB, …)`; the second session reports
  `16.8 MB of it already there` (eight raw fields and the summary are identical).
- One page per folder with `kind: bundle` and `files: 18`. `hash` and `xet` are the
  manifest's, and `size` is the files' total.

### 4. Part of a bundle

```sh
yajna data get $S1 --only 'QC/**'
find data/$S1 -type f
yajna data status $S1
yajna data get $S1
diff -r "$S/session-01" data/$S1/session-01 && echo same
yajna data get $S1 --only 'nothing*'
```

Look for 5 files under `QC/`, then `5 of 18 here` in status. A full `get` should say
`5 of 18 file(s) … here already` and write the other 13. `diff` should find nothing, and
a glob that matches nothing says `no file matches --only`.

### 5. Free the written-out copy

```sh
yajna data free $S1
ls data/
yajna data get $S1 && yajna data free $S1
```

Look for `18 file(s) under data/<ID>/session-01 freed`, with the folder removed and not
just emptied. To see the safety check, change a file before freeing it:
`echo x >> data/$SCAN/scan-v1.tif; yajna data free $SCAN` keeps it (`differs from what the
page names; kept`, exit 1). Afterwards `rm data/$SCAN/scan-v1.tif; yajna data get $SCAN`.

### 6. Run outputs

```sh
cat $RUN_SCRIPT
bash $RUN_SCRIPT
yajna run record $RUN --env WALK_MODELS \
  --outputs notes/runs/$RUN/checkpoint.bin notes/runs/$RUN/train.log "$WALK_MODELS/model-final.bin"
sed -n '/^outputs:/,/^---/p' notes/runs/$RUN.md
cat .gitignore
yajna data status $RUN
```

Look for:

- `stored 2 output(s) in local (5.2 MB, …)`: the checkpoint and the model, both at least
  `outputs_min` (1 MB by default). `train.log` is recorded but not stored.
- In `outputs`, the checkpoint and `$WALK_MODELS/model-final.bin` have `xet:` lines and
  `train.log` has none.
- `.gitignore` gains the checkpoint's path, and only that output: the model is outside the
  repo and `train.log` is small enough for git.
- `RUN-…  2 output(s)  here  local: whole, lab: -  (1 copy)`.

`yajna result --experiment $EXP --outputs … < log` stores outputs the same way.

### 7. Convert old `store: path` pages

```sh
sed -n '/^store:/,/^hash:/p' notes/artifacts/$ART_CAL-*.md
yajna data add --art $ART_CAL
sed -n '/^store:/,/^kind:/p' notes/artifacts/$ART_CAL-*.md

sed -n '/^store:/,/^hash:/p' notes/artifacts/$ART_E1C-*.md
yajna data add --art $ART_E1C
yajna data add --art $ART_E1C "$S/E1c-maps"
sed -n '/^store:/,/^files:/p' notes/artifacts/$ART_E1C-*.md
yajna data add --art $ART_E1C
```

Look for:

- **The calibration file.** It is in the repo at the page's path, and its sha256 matches
  the page's, so it is stored in place: `store: xet`, the same `hash`, plus `xet`, `size`
  and `kind: file`.
- **The E1c page.** Its path, `VPI_DATA/results/E1c (on oppy)`, is not on this machine.
  The first try stops and prints the command to use: `yajna data add --art ART-… <path>`.
- **E1c with a path given.** It becomes a bundle of 3 files. The command prints that
  `path` is now `data/<ID>/E1c-maps` and names the old path. The page's old `hash: null`
  is replaced by the manifest's hash.
- **Running it again** says the page is `in a data store already`.
- **A wrong hash.** To see this refusal, edit the calibration page's `hash` before
  converting it, on a fresh setup. The data is then refused with `does not match the
  page's hash`.

### 8. Keep large files out of git

```sh
mkdir -p notes/figures && cp "$S/movie.mp4" notes/figures/
git add notes/figures/movie.mp4
yajna data check --staged; echo "exit $?"
git rm -q --cached notes/figures/movie.mp4
yajna data add notes/figures/movie.mp4 --title "Plate 3 time-lapse"
yajna data check --staged; echo "exit $?"
```

Look for:

- The first check prints
  `notes/figures/movie.mp4  8.4 MB  git rm --cached notes/figures/movie.mp4 && yajna data add notes/figures/movie.mp4`
  then `1 file(s) staged over [data] git_max (5.0 MB)` and exits 1.
- After the fix it prints nothing and exits 0. The page keeps the path
  `notes/figures/movie.mp4`, since the file is inside the repo, and that path goes into
  `.gitignore`.

A file that is already committed:

```sh
cp "$S/scan-v1.tif" notes/figures/old-scan.tif
git add notes/figures/old-scan.tif && git commit -qm "a mistake"
yajna validate; echo "exit $?"
yajna data check; echo "exit $?"
git rm -q --cached notes/figures/old-scan.tif && rm notes/figures/old-scan.tif
git commit -qm "take the scan out of git"
```

Look for `warning: notes/figures/old-scan.tif is 25.2 MB in git, over [data] git_max`
from `validate`, which still exits 0. `data check` without `--staged` lists the file and
exits 1. Once it's removed, both are quiet. The history still holds the scan; yajna
doesn't rewrite history.

### 9. Push, then drop from `local`

```sh
yajna data drop $SCAN --from local; echo "exit $?"
yajna validate
yajna data push
yajna data status
git add -A && git commit -qm "data stored"
```

Look for:

- **Drop before push** is refused: `nothing dropped from local: … 0 other store(s) hold
  it whole, 1 needed`, exit 1.
- **Push** sends to `lab` because of `[data] push`: `pushed 39 file(s) to lab: 11 xorb(s),
  88.0 MB` or close to it. Pages are not files, so the count is of data files.
- **Status** shows every row as `local: whole, lab: whole  (2 copies)`, including the
  run's.
- **The commit** brings in the pages, the `.gitignore` and `train.log`, and no data.

```sh
du -sh "$XDG_DATA_HOME/yajna/store"
yajna data drop $(art time-lapse) --from local
du -sh "$XDG_DATA_HOME/yajna/store"
yajna data drop $S1 --from local
yajna data status $S1 $S2
```

Look for:

- **The video** sits in xorbs of its own, so dropping it frees all of it:
  `1 file(s), 1 xorb(s) no other file there uses, 8.4 MB`. The store shrinks by about 8 MB.
- **Session 1** drops 10 files (its own 9 and its manifest) but frees only kilobytes. Its
  files share xorbs with the 9 that session 2 still names, and a xorb goes only when
  nothing uses it (see "Things to look at").
- **Status of session 1** reads `local: 9 of 18 file(s), lab: whole`. `status` first pulls
  back the manifest it needs to read the bundle (`pulled 1 file(s) from lab`).

## Machine B: a fresh clone with only the lab store

In a new terminal:

```sh
. ~/.cache/yajna-data-walkthrough/env-b.sh
git clone -q "$WALK/nb" "$WALK/nb-b" && cd "$WALK/nb-b"
S1=$(art session-1.md); S2=$(art session-2.md); SCAN=$(art plate-3-scan.md)
```

### 10. Status, part of a bundle, pull, then everything

```sh
yajna data status
yajna data get $S2 --only 'raw/field_001.tif'
find data -type f
yajna data pull $SCAN
yajna data status $SCAN
yajna data get
diff -r "$S/session-02" data/$S2/session-02 && echo same
cmp "$S/scan-v2.tif" data/$(art refocused)/scan-v2.tif && echo same
git status --short
```

Look for:

- **First status.** It pulls the three bundles' manifests (`pulled 3 file(s) from lab: …
  6.0 kB`) and nothing else. Every row is `local: -` or `local: 0 of N file(s)`, then
  `lab: whole  (1 copy)`.
- **`--only`** writes one file. It has to pull the whole xorb that holds it (26 MB):
  the unit fetched is a xorb, not a file.
- **`pull`** fills `local` without writing anything out, so status says `missing` with
  `local: whole`.
- **The full `get`** says what is here already, pulls the rest in one go and writes
  everything. The `diff` and `cmp` are clean, and `git status` is clean too: all the
  data is gitignored.

### 11. The run's outputs, and reproducing it

```sh
ls -la notes/runs/$RUN/ "$WALK_MODELS"
shasum -a 256 notes/runs/$RUN/checkpoint.bin "$WALK_MODELS/model-final.bin"
grep -A1 "model-final.bin$" notes/runs/$RUN.md
grep -A1 'checkpoint.bin$' notes/runs/$RUN.md
mkdir -p "$WALK/machine-b/repro"
yajna run reproduce $RUN --out-root WALK_MODELS="$WALK/machine-b/repro"
echo changed > notes/runs/$RUN/checkpoint.bin
yajna data get $RUN; echo "exit $?"
```

Look for:

- **The checkpoint and the model** came back in section 10 with the sha256s on the page.
- **Reproduce** runs the script at the run's commit and prints `RUN-…: reproduced`.
  `--out-root` is required because the run wrote under `$WALK_MODELS`; without it the
  command refuses and says so.
- **The changed checkpoint** is never overwritten: `checkpoint.bin differs from the
  recorded output; kept`, exit 1.
- **`model-final.bin` is in machine B's `$WALK_MODELS`**, not machine A's: an output
  under `$VAR/…` goes under this machine's value of the variable, and under the run's
  recorded one only when it is not set here.

## Things to look at

These are the behaviours I'd most like your eye on.

1. **`drop` frees a xorb only when nothing uses it.** A bundle whose files were packed
   with files another page still names gives back almost no space (section 9). This is
   the spec's fragmentation rule that's still open: repack, or drop at chunk level.
2. **`status` says `here` when the file exists, without hashing it.** `free` and `get`
   do hash. That's fine for big data, but a changed file shows as `here`.
3. **`get --only` pulls whole xorbs**, so one 2 MB field costs 26 MB the first time.

## 12. Optional: a store over ssh

With `WALK_SSH` set at setup, `config.toml` also names
`remote = { ssh = "<host>", path = "<path>" }`. Run this on machine A:

```sh
yajna data push --to remote
yajna data status
yajna data drop $(art refocused) --from lab
yajna data status $(art refocused)
```

`status` should show a `remote:` column, with `(3 copies)`. The `drop` from lab goes
through because `local` and `remote` still hold the file whole; `status` then shows
`lab: -`. Clean the remote with `ssh <host> rm -rf <path>`.

## 13. Optional: zstd

Add `compression = "zstd"` under `[data]` in `nb/yajna.toml` and `data add` a
compressible file, such as a large CSV. Its xorbs are smaller than LZ4's and only yajna
can read them. The random samples here don't compress, so they show no difference.

## Clean up

```sh
rm -rf ~/.cache/yajna-data-walkthrough
```
