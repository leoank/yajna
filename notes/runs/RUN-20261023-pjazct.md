---
id: RUN-20261023-pjazct
type: run
schema_version: 1
kind: compute               # bench | compute | assembly | calibration
project: PRJ-0001
experiment: EXP-20261023-kjtach
protocols: []
status: done              # planned | in_progress | done | aborted
created: 2026-10-23
author: agent:claude
commit: b246d36
script: notes/runs/RUN-20261023-pjazct/run.sh # executable that re-creates this run, relative to the repo root
---

## Notes
The laptop (Apple M3 Max, 36 GB, APFS on the internal SSD), against the step 2 server as
it stood before the listing fix: `read_listing` called `symlink_metadata` and `metadata`
for every entry and sorted with a comparator that lower-cased both names on every
comparison. Output in `output.txt` beside this page.

| Measure | Baseline (this run) | After the fix ([[RUN-20261023-pn80r2]]) |
|---|---|---|
| 1 000 entries, first page, empty cache | 24 ms | 12 ms |
| 100 000 entries, first page, empty cache | 1 300 ms | 329 ms |
| 1 000 000 entries, first page, empty cache | 14 668 ms | 4 018 ms |
| first page again (cached), any size | 0.8 to 1.0 ms | 0.8 to 0.9 ms |
| a later page, median | 0.7 to 5.5 ms | 2.9 to 5.5 ms |
| server memory after the listings | 99 MB | 192 MB |
| stat 100 directories down | 0.4 ms | 0.4 ms |
| 64 KiB range at the start, middle, end of 10 GiB | 0.2 ms each | 0.2 ms each |
| 1 GiB range streamed | 1 781 MiB/s | 1 863 MiB/s |
| list a loop / a link out of the root | 404 / 200 | 404 / 200 |

The listing missed the predictions (300 ms at 100 000, 3 s at 1 000 000) by four to five
times; ranges and deep paths were far inside them. Two costs were ours, not the disk's:
a stat per entry, though `readdir` already returns each entry's type, and about 40
million string allocations in the sort. Fixed in 3ef17de and measured again in
[[RUN-20261023-pn80r2]].


## Reproduce
Run `script` from the repo root in the project's dev shell at `commit`; it must produce the
same outputs. Note here what it cannot control.

`run.sh` builds the tree once under `~/.cache/yajna/scale-check` (minutes; 10 GiB) and
reuses it; delete it afterwards. Times depend on the disk, on what the OS has cached
(the tree was just written, so its directory blocks were warm; macOS cannot drop caches
without root), and on load. This run measured the code before the fix: reproduce it at
3ef17de with `read_listing` reverted to a `symlink_metadata` and `metadata` per entry and
the comparator sort.

## Checklist
- [x] tree built, release binary built, bench run
