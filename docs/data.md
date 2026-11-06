# Data: a chunked, deduplicated store for large files

Status: design v0.1, 2026-11-06; step 1 built: `tools/yajna-xet`, identical to xet-core
1.8.0 on every case EXP-20261106-3t3nn2 tried. Companion to `architecture.md` (section 5.3
and Phase 2 in section 11) and `reproduce.md`, whose run `outputs` it stores. Decision:
ADR-0035, superseding ADR-0013's leaning towards git-annex.

## 1. What it is for

Data too large for git (imaging sessions, model checkpoints, dataset versions, a
run's outputs) has to stay reachable from the page that describes it. Today an `ART` page
records a path and a sha256, and the bytes stay wherever the instrument or the script put
them. Paths rot, nothing copies the bytes anywhere safe, and successive versions of a
checkpoint or a dataset are stored whole each time.

Hugging Face's Xet storage solves the storage half of this for models and datasets: files
are cut into content-defined chunks, identical chunks are stored once across every file and
version, chunks travel in large compressed containers (xorbs), and a small recipe says how
to rebuild each file. yajna adopts that design, byte for byte, as its own data layer:
`yajna data add` puts a file or a folder into a store and writes the `ART` page that names
it, `yajna data get` brings it back where the page says it belongs, and stores on other
machines are copies reached over ssh.

Sources: Frank Denis's introduction (00f.net, 2026-01-19, parts 1 and 2), his draft
specification (`draft-denis-xet`), Hugging Face's Xet protocol specification v1.1.0
(huggingface.co/docs/xet) and the reference implementation `xet-core` 1.8.0, surveyed
2026-11-06.

## 2. Decisions at a glance

Decided with ank on 2026-11-06, in three rounds.

| Question | Decision |
|---|---|
| Role | Xet-style storage is yajna's data layer and replaces git-annex; the `ART` page is the pointer, no annex, LFS or `.dvc` files |
| Format | Byte-exact Xet: gearhash chunking, keyed BLAKE3 hashes, xorbs and shards as the spec defines them, so Hugging Face or a Shardline server can later be a remote |
| Implementation | Our own crate, `tools/yajna-xet`, written from the spec and checked against xet-core's outputs and Hugging Face's reference files; xet-core is not a dependency |
| A checkout | Data is materialized on demand by `yajna data get` into gitignored paths; `git clone` and `checkout` never fetch data |
| Recipes | Only in stores, as in Xet: the repo records a file's Xet hash; any store holding that file's shard can rebuild it |
| Stores | Directories of xorbs and shards: on this machine, on a mounted path, or on another machine over plain ssh, which needs only a disk there |
| Sharing | Stores are named per machine and shared by every notebook on it, so the same bytes in manthan, rc2s2 and a project repo are stored once |
| What goes in | Files and folders added by hand, run outputs above a size threshold, large files caught before they are committed, whole instrument folders as one `ART` |
| Removal | Stores are append-only; `yajna data drop` frees a file from one store only while enough other stores still hold it whole |
| Interop | Kept possible, not built: no Hugging Face or Shardline client in Phase 2 |
| Evidence first | Spikes check byte-exactness against xet-core and measure deduplication and speed on checkpoints, imaging stacks, tables and synthetic data before the commands are built |

## 3. The format, from the spec

Implemented exactly; the numbers below are the spec's (`XET-BLAKE3-GEARHASH-LZ4`).

- **Chunks.** A 64-bit gear hash, `h = (h << 1) + TABLE[byte]` with wrapping arithmetic,
  over every byte; a boundary where `h & 0xFFFF000000000000 == 0`, never before 8 KiB,
  always at 128 KiB, about 64 KiB on average; `h` resets after each cut. The 256-entry
  table is the spec's.
- **Hashes.** A chunk's hash is BLAKE3 keyed with the spec's data key over its bytes. A
  xorb's hash is the root of a content-defined Merkle tree over `(chunk hash, size)`
  leaves (a group ends where a hash is 0 mod 4, at 2 to 9 children, nodes hashed with the
  internal-node key over `"<hex> : <size>\n"` lines). A file's hash is the same tree over
  its chunks, keyed once more with a zero key. Hashes are written in the spec's string
  form: four little-endian u64 words in hex.
- **Xorbs.** Up to 64 MiB and 8192 chunks, each chunk an 8-byte header and its bytes,
  uncompressed, LZ4 frame, or byte-grouped (BG4) then LZ4, chosen per chunk; a footer with
  every chunk's hash and offsets.
- **Shards.** File-info entries (a file's recipe: terms of xorb hash and chunk range, with
  verification hashes and the file's sha256 in the metadata extension) and CAS-info entries
  (each xorb's chunk hashes and offsets, the dedup index).
- **Deduplication.** Within an add, against the stores named for it (section 5), with the
  spec's rule against fragmentation: a match is used only in runs of at least 8 chunks or
  1 MiB.

The sha256 of every file is computed alongside and kept on the `ART` page, so
`run reproduce`, `validate` and anything outside yajna can check a file without Xet.

## 4. Stores

A store is a directory:

```
<store>/
  store.toml              # format = "yajna-xet/1", created, the id it was made with
  xorbs/<ab>/<xorb hash>  # serialized xorbs, as the spec writes them
  shards/<shard hash>     # shards with their footer
  files/<ab>/<file hash>  # the shard(s) holding this file's recipe, one per line
  chunks/<ab>/<chunk hash># for chunks eligible for global dedup: the shard listing them
  locks/                  # held by drop (section 7)
```

Every object is written to a temporary name and renamed, and every name is a content hash,
so two writers adding the same bytes at once produce the same files and need no lock. The
`files/` and `chunks/` entries are what the HTTP API's reconstruction and dedup queries
answer; a store is the Xet CAS laid out on disk, reachable by anything that can list and
read files.

**Where stores are named.** Per machine, in `~/.config/yajna/config.toml` (hand-written or
from neusis, never written by yajna, as for `[repos]`):

```toml
[stores]
local = "~/.local/share/yajna/store"           # the default, made on first use
lab   = "/mnt/lmb-storage/ank/yajna-store"     # a mounted path
oppy  = { ssh = "oppy", path = "/data/yajna-store" }
```

`local` exists on every machine without configuration. A notebook says which stores it uses
in `yajna.toml`:

```toml
[data]
push = ["lab"]          # where `yajna data push` sends by default
copies = 2              # stores that must hold a file whole before one may drop it
git_max = "5 MB"        # larger staged files are refused (section 8)
outputs_min = "1 MB"    # run outputs at least this size are stored (section 9)
```

A store missing from a machine's config is skipped with a note, so a notebook can name
the lab's store and still work on a laptop that only has `local`.

**Over ssh** a store is read and written with plain commands (`test`, `cat`, `mkdir`,
`mv`, `ls`) through one multiplexed ssh connection per command, batched; the other machine
needs ssh and a disk, not yajna, as `--on` needs only git and Nix there (ADR-0033). How
slow this is for dedup lookups and many small objects is measured first (EXP C).

## 5. Commands

| Command | What it does |
|---|---|
| `yajna data add <path>… [--project PRJ] [--run RUN] [--title …] [--to <store>]` | Chunks each file (a directory becomes one bundle, section 6), deduplicates against `local` and the `--to` store, writes new xorbs and a shard to `local` (and pushes to `--to`), and creates an `ART` page with `store: xet`, the Xet hash, sha256, size and the path to materialize at |
| `yajna data get <ART…\|RUN…\|path…> [--from <store>] [--only <glob>]` | Rebuilds each file from the first store that has its recipe (`--from` to choose), verifies the Xet hash and sha256, and writes it at the page's path; existing identical files are left alone |
| `yajna data push [--to <store>] [ART…]` | Copies to a store the xorbs, shards and index entries it lacks for the given pages (default: every `ART` and stored output of the notebook) |
| `yajna data pull [--from <store>] [ART…]` | The same into `local`, without materializing |
| `yajna data status [ART…] [--verify]` | For each page: which stores hold it whole, whether it has its `copies`, whether it is materialized here; `--verify` rehashes xorbs |
| `yajna data drop <ART…> --from <store>` | Frees the pages' data from one store (section 7) |
| `yajna data free <ART…\|path…>` | Deletes materialized copies in the working tree when a store holds them whole |
| `yajna data check --staged` | Lists staged files over `git_max`, for a pre-commit hook (section 8) |

Pages and `RUN` IDs complete and pick as other IDs do. Every command works on the
notebook's stores across worktrees: data added in one worktree is in `local` for all.

## 6. `ART` pages and bundles

An `ART` page gains `store: xet` and two fields:

```yaml
store: xet
xet: 3a7f…          # the Xet file hash: the recipe's name in every store
hash: sha256:9c1e…  # as before
size: 2147483648
path: data/ART-20261106-ab12cd/stack.ome.tif   # where `data get` writes it, gitignored
kind: file          # file | bundle
```

`path` defaults to `data/<ART id>/<name>` under the notebook root, and `data/` is added to
`.gitignore` on first use. A file added from inside the repo keeps its own path, and the
path is added to `.gitignore`.

**A bundle** is a folder added as one `ART`: an imaging session, an acquisition run, a
dataset directory. Its manifest, a TSV of relative path, size, sha256 and Xet hash per
file, is itself stored as a Xet file, and the page records the manifest's Xet hash, the file
count and the total size. `data get ART-… --only '*.tif'` materializes part of a bundle;
files repeated across sessions (calibration frames, unchanged tiles) are stored once.

Pages for data added before this (`store: path`) are converted with `yajna data add
--art ART-…`, which stores the bytes at the recorded path and rewrites the page.

## 7. Copies and dropping

Nothing is removed from a store except by `yajna data drop <ART…> --from <store>`, which:

1. checks, now, that at least `copies` other stores hold each page's file whole (its
   recipe and every xorb it names), and refuses otherwise, naming the stores it found;
2. takes the store's drop lock (`mkdir locks/drop`, atomic on local and remote disks),
   which `add`, `push` and other drops wait for;
3. removes the pages' `files/` entries, then every xorb and shard no remaining recipe in
   that store refers to, then the `chunks/` entries pointing at removed shards.

`local` is a store like the others: freeing space on the laptop is `data drop --from
local` once the lab store and one more hold the data. Removing what no page refers to at
all (data of an aborted run) is not part of Phase 2.

## 8. Large files before they are committed

`yajna data check --staged` lists staged files larger than `git_max` and exits non-zero,
with the command that stores each instead (`yajna data add <path>`). It is meant for a
pre-commit hook; the notebook's `AGENTS.md` and the skill tell agents to run it, and a
hook can be installed by hand or from neusis. `yajna validate` reports tracked files over
`git_max` as warnings, so a notebook that already has some sees them.

## 9. Run outputs

`yajna result --outputs` and `run record --outputs` store every output at least
`outputs_min` large in `local` and record its Xet hash beside the sha256:

```yaml
outputs:
  - {path: …/RUN-20261106-x1y2z3/model.safetensors, sha256: 5e0a…, xet: 77b1…}
```

`yajna data get RUN-…` materializes a run's stored outputs; `run reproduce` compares by
sha256 as before (reproduce.md section 6) and can fetch the recorded outputs to diff them.
Outputs are not `ART` pages: results that matter are still promoted to one by hand, which
then names the same Xet hash and stores nothing twice.

## 10. What it does not do

- **Talk HTTP.** No Hugging Face Hub, Shardline or other Xet server remote, no S3, in
  Phase 2. The format is exact so that an HTTP remote is a client of `files/`, `chunks/`
  and xorb range reads later.
- **Filter checkouts.** No git clean/smudge filter or LFS transfer agent.
- **Encrypt.** A store is as private as the filesystem it is on.
- **Collect garbage across stores.** Only `drop` removes data.
- **Telemetry.** None, unlike xet-core's default.

## 11. Build order

| Step | Build | Verify |
|---|---|---|
| 1 | `tools/yajna-xet`: the gear table and chunker, the hashes, xorb and shard serialization and parsing, reconstruction from terms | EXP A: byte-identical chunks, hashes, xorbs and shards against xet-core and Hugging Face's reference files |
| 2 | Measurement, no commands | EXP B: dedup ratio and throughput on checkpoints, imaging stacks, tables and synthetic edits, ours against xet-core |
| 3 | Directory stores, `local`, `[stores]` and `[data]`; `data add` and `get` for files; `ART` fields; `data status` | Integration tests on a scratch vault and two scratch stores |
| 4 | ssh stores; `data push` and `pull` | EXP C against oppy; integration tests through an ssh that runs locally, as for `--on` |
| 5 | `copies`, `data drop` and its lock, `data free` | Tests that a drop below `copies` is refused and that shared xorbs survive a drop |
| 6 | Bundles, `--only` | An imaging session from manthan's PRJ-0005 added as one `ART` |
| 7 | Run outputs, `data get RUN-…`, `--art` conversion | A run with a checkpoint output reproduced from a fresh clone and a store |
| 8 | `data check --staged`, the `validate` warning | Tests; the skill and conventions updated |

## 12. Risks

- **Byte-exactness drifts.** The spec is versioned and xet-core changes often; the
  vectors from EXP A become tests, and the spec version is recorded in `store.toml`.
- **Raw images may not dedup.** Content-defined chunking finds repeated bytes; two
  imaging sessions of different samples share little. The gain there is a safe copy and
  partial fetches, not space; EXP B says how much.
- **ssh latency.** One round trip per object is slow; lookups are batched and the
  connection multiplexed, and EXP C decides whether a remote store's `chunks/` index is
  queried during `add` or only `local`'s.
- **Drop racing a push.** The lock covers yajna's own writers; a store written by hand
  is not protected.
- **Disk on the laptop.** Materialized files are a second, uncompressed copy beside
  `local`; `data free` and `data drop --from local` are the answer, and `status` shows both.

## 13. Verification

The Phase 2 check from the architecture, made concrete: from a fresh clone of manthan on the
laptop, with only the lab store configured, `yajna data get` materializes an imaging session
added on oppy and a training run's checkpoints, both matching the sha256 their pages
record; ten successive checkpoints of one training run take measurably less space in the
store than ten copies, as EXP B predicted.
