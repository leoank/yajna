# Reproducing runs

Status: design v0.1, 2026-10-26; nothing built. Companion to `architecture.md` (section 11,
Phase 1e) and `review.md`, whose commit resolution it shares. Decision: ADR-0031.

## 1. What it is for

A compute run page already says how to re-create it: `commit`, `script`, and the
instruction to run the script from the repo root in the project's dev shell. Doing that by
hand means finding the commit, checking it out somewhere without disturbing the work in
progress, finding the script (which is usually not at that commit, section 3), entering the
right flake's dev shell, and setting the variables the run depended on. Nobody does it
until it is needed, and then it takes an afternoon.

`yajna run shell RUN-…` does it in one command and leaves you in a shell where running the
script is the next step. `run reproduce` goes further and runs it and compares the outputs
with what the run recorded; `run diff` says what differs between two runs; `--on <host>`
does it on the machine that has the data.

## 2. Decisions at a glance

| Question | Decision |
|---|---|
| The tree | A git worktree at the run's `commit`, with the run's directory (page, `run.sh`, small outputs) copied in from the current revision at its current path |
| Where and how long | In the cache, `<cache>/runs/<repo hash>/RUN-…`, reused when the same run is opened again, removed by `yajna run clean` |
| The shell | `nix develop` on the project's flake inside the worktree, cwd at its root, with `YAJNA_RUN`, `YAJNA_RUN_DIR`, `YAJNA_RUN_COMMIT` and the run's recorded `env` set |
| New run fields | `host`, `env` (no secrets), `outputs` (paths with sha256), `origin_commit` (after graduation), `reproduces` and `verdict` (on a reproduction) |
| Commits | Full SHAs from now on; a `done` compute run must have a `commit` that resolves, or `commit: unknown` with the reason in *Notes* |
| Comparing | `run reproduce` compares the recorded `outputs` hashes and the `===RESULT===` metrics (exact, or `--tolerance`); unlisted files are reported, not judged |
| Outputs outside the repo | Never overwritten: `run reproduce` stops when a recorded output lies outside the run directory unless its root is redirected to scratch |
| Graduation | `graduate` maps each lab commit to its split counterpart by the code directory's tree and keeps the original as `origin_commit` |
| Scope | `run shell`, `run reproduce`, `run diff`, `--on <host>`, `run clean`, `run record` |

## 3. Why the tree is assembled

In manthan on 2026-10-26, `RUN-20261023-nvfv0n` records `commit: 96d84c8`. Its `run.sh` is
not in that commit: it was committed afterwards, and has since moved when the project was
renumbered from PRJ-0004 to PRJ-0005. That is the common case, not an accident: the code is
committed, the run executes, and the page, script and outputs are committed after. A plain
checkout of `commit` reproduces nothing.

So `run shell` builds the tree from two revisions:

- **The code at `commit`**: `git worktree add --detach <dir> <commit>`. This is exactly what
  ran (or, for a run from an uncommitted tree, the closest commit, which the page's *Notes*
  say).
- **The run's directory from now**: the page and everything tracked beside it at the
  current HEAD, copied into the worktree at its current path. `--working-tree` copies the
  working tree's version instead, to try an uncommitted fix to `run.sh`.

The shell prints a banner saying what came from where: the commit's date and subject, the
directory overlaid, and what does not line up: the script did not exist at `commit`, the
project's directory had another name then, the host differs from `host`, a path in `env`
does not exist here.

The overlay files are untracked in the worktree. Nix evaluates a flake from the files git
tracks, so they do not change the dev shell; they are only on disk for the script.

## 4. Run pages

New optional fields, added to `schema/run.json` without a version bump (architecture
section 10):

```yaml
commit: 96d84c814d3c6c09e2314a6297f7fa09a01035a5   # full SHA, or `unknown`
host: oppy
env:
  VPI_DATA: /data/ank/vpi
  HF_HUB_OFFLINE: "1"
outputs:
  - {path: notes/projects/PRJ-0005-…/runs/RUN-20261023-g78vwy/manifest.tsv, sha256: 6015176…}
  - {path: $VPI_DATA/results/E1c/RUN-20261023-nvfv0n/sheet-vit7b16-4x.png, sha256: …}
origin_commit: manthan@f17238c…                     # set by graduate
reproduces: RUN-20261023-g78vwy                    # on a reproduction run
verdict: reproduced                                 # reproduced | differs | failed
```

- **`env`** holds what the run needed that git does not: data roots, offline flags,
  thread caps. Names that look like credentials (`KEY`, `TOKEN`, `SECRET`, `PASSWORD`,
  `CREDENTIAL`, `AUTH`) are refused by validation and by the commands that write it.
- **`outputs`** are the files the run's result rests on, not everything it wrote. A path
  is relative to the repo root or starts with `$VAR/` for a root named in `env`.
- **Recording.** `yajna result` writes the full `commit` and `host` itself, and takes
  `--env NAME…` (values read from the environment) and `--outputs <glob>…` (hashed).
  `yajna run record RUN-… [--commit …] [--env …] [--outputs …]` fills the same fields on
  a run created by `yajna new run`.
- **Validation.** A `done` compute run needs a `commit` that resolves in this repository,
  or `unknown` with a sentence in *Notes*. Resolution is skipped in a shallow clone (CI's
  checkout), where history is not there to check. Short SHAs still resolve; an ambiguous one
  fails with the candidates.

On 2026-10-26 manthan has 20 runs of 48 without a `commit`, and 9 of rc2s2's 14 point at
commits it does not have (section 8). Turning the rule on comes with that cleanup: a commit
where one can be found from the page's date and notes, `unknown` otherwise.

## 5. `yajna run shell`

```
yajna run shell RUN-… [-c <command>] [--working-tree] [--on [<host>]]
```

1. Resolve `commit` (section 4) and the project, from the page.
2. Create or reuse the worktree at `<cache>/runs/<repo hash>/RUN-…`. A reused one at the
   same commit is used as it is; if it has changes, the banner says so.
3. Overlay the run's directory (section 3).
4. Find the flake: the project's code directory at `commit` in a lab (`code/<slug>`,
   followed through renames), the repository root in a project repo; the root flake if
   the project has none; a plain shell with a warning if there is no flake at all.
5. Run `nix develop <worktree>/<flake dir> -c $SHELL` (or `-c <command>`) with cwd at the
   worktree root and `YAJNA_RUN`, `YAJNA_RUN_DIR` (the overlaid directory),
   `YAJNA_RUN_COMMIT` and the run's `env` exported. A recorded `env` value that is a path
   missing here is still exported, and named in the banner.

`yajna run clean [RUN-…]` removes the worktrees (all, or one) with `git worktree remove`,
refusing ones with changes unless `--force`. A worktree is a real checkout, so a fix made
in it can be committed on a branch and brought back.

## 6. `yajna run reproduce`

```
yajna run reproduce RUN-… [--tolerance <rel>] [--out-root VAR=<dir>…] [--on [<host>]]
```

1. Create a new compute run in the same experiment with `reproduces: RUN-…`, the same
   `commit` and `script`, `env` copied and `host` set to this machine.
2. In a `run shell` worktree, run the script with `YAJNA_RUN_DIR` pointing at a fresh
   directory, capturing stdout and stderr into it.
3. Compare: each recorded `outputs` path, rewritten to where this run wrote it, by sha256;
   the `===RESULT===` metrics against the original's row in `results.tsv`, exactly or
   within `--tolerance`. Files written that the original did not list are reported as
   unlisted.
4. Write the verdict: `reproduced` when every listed hash and metric agrees, `differs`
   with a table of what did not, `failed` when the script exited non-zero. The new run's
   page, logs and its own `outputs` go beside it in the real repo, and a `results.tsv` row
   as usual.

**Outputs outside the repo are never overwritten.** Scripts write where they write: the
E1c script puts its maps under `$VPI_DATA/results/E1c/<run id>/`, and its run ID is the
original's, so a naive reproduction would overwrite the original's results on shared
storage. `run reproduce` stops when any recorded output lies outside the run directory,
unless `--out-root VPI_DATA=<scratch>` redirects that root (inputs it reads from there must
then be reachable from the scratch root, which the banner says). The run template's stub
is changed to write beside itself through `YAJNA_RUN_DIR`, so new scripts do not have the
problem.

Only `compute` runs are reproduced. A `bench` run's script is its protocol.

## 7. `yajna run diff`

```
yajna run diff RUN-a RUN-b
```

What differs between two runs: the code between their commits (limited to the project's
code), their scripts and pages as they are now, `env`, `host`, the `outputs` manifests, and
the metrics side by side. It is a run review (`review.md` section 4) without the threads,
and `yajna review open RUN-b` starts from the same diff.

## 8. Commits across graduation

`git subtree split` writes new commits holding only the code directory, re-rooted, so every
commit ID changes; run pages that came along with their lab commit IDs point at commits
the new repository does not have. In rc2s2 on 2026-10-26, 9 of 14 distinct run commits do
not resolve.

`graduate` maps them: for each lab commit a page names, the tree of the code directory at
that commit is looked up among the split commits' root trees, and the latest split commit
with the same tree replaces it. The original is kept as `origin_commit: <lab ns>@<sha>`.
The same mapping applies to every commit in the moved pages: REV `base`, `head` and
anchors, and `(since …)` in Progress items. A commit with no match keeps its value, gets
`origin_commit`, and is reported.

For a repository that has already graduated, `yajna graduate PRJ-… --into <checkout>
--commits-only` runs the mapping alone. In rc2s2 it can recover the commits made while the
project was in manthan; 6 of the 9 predate manthan (the lab lived in the yajna repo then,
under another layout) and become `unknown` with a note.

## 9. `--on <host>`

The data a run needs is often only on the machine it ran on. `--on oppy` (or `--on` alone,
for the run's `host`) runs the same command there over `ssh -t`, in the checkout named for
that host in `.yajna/hosts.toml` (machine-local, not committed: `[oppy] root =
"~/workspace/manthan"`), after a `git fetch` so the commit is there. yajna must be on the
remote's PATH. Nothing is copied back by `run shell`; `run reproduce` writes its new run page
on the remote, to be committed and pushed from there like any run.

## 10. What it does not do

- **Fetch data.** Inputs outside git are named in `env`, not moved. git-annex in Phase 2
  makes them part of what a commit pins.
- **Pin what Nix does not.** The GPU, drivers outside the closure, the network and the
  time are the *Notes*' to state.
- **Reproduce bench runs.**
- **Capture the whole environment.** Only the variables named.

## 11. Build order

| Step | Build | Verify |
|---|---|---|
| 1 | The new fields; full SHAs and `host` in `result`; `--env`, `--outputs`; `run record`; the commit rule in `validate` with `unknown` and the shallow skip | Integration tests; manthan's and rc2s2's runs cleaned up and validating |
| 2 | `run shell` and `run clean` | A scratch vault where the script is committed after the code and the project renamed; the shell finds both |
| 3 | `run diff` | Two runs of one experiment in a scratch vault |
| 4 | `run reproduce`, `--tolerance`, `--out-root`, the template change | A deterministic toy run reproduced; one with a changed seed `differs`; one writing under an env root refused |
| 5 | `--on <host>` | By hand against oppy |
| 6 | Commit mapping in `graduate` and `--commits-only` | The graduate integration test with runs at several commits; rc2s2 remapped |

## 12. Risks

- **Old flake inputs.** A dev shell at an old commit needs that commit's `flake.lock`
  inputs; most are fetchable for years, but a removed branch or private input is not.
  The banner names the input that failed.
- **Disk.** Each worktree is a full checkout; `run clean` and the cache's location keep it
  out of the way.
- **Scripts that ignore `YAJNA_RUN_DIR`.** Older scripts write beside themselves, which in
  the worktree is harmless, and outside the repo, which `run reproduce` refuses.

## 13. Verification

`RUN-20261023-g78vwy` recorded the sha256 of the manifest it built. From a fresh clone of
manthan on the laptop, with `VPI_DATA` pointing at the data, `yajna run reproduce
RUN-20261023-g78vwy` gives the same hash; `run shell --on` opens one of PRJ-0005's oppy
runs on oppy; and a run graduated into rc2s2 opens in `run shell` at its mapped commit.
