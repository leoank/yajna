# Xet reference files

From Hugging Face's `xet-team/xet-spec-reference-files` dataset (Apache-2.0) at revision
`c4aa3a3f15b1395fff5ce934784bf6c8f2d62de8`, the small ones only: the chunk list, file hash,
xorb hash and range hash of `Electric_Vehicle_Population_Data_20250917.csv` (63.5 MB, all
chunks in xorb `eea25d6e…`), its first three chunks, and its shards (plain, with
verification, with verification and no footer, and as a global dedup answer with chunk
hashes keyed by `1234…5678`). The CSV and the 14.7 MB xorb are checked by
EXP-20261106-3t3nn2's run, not here. `tests/reference.rs` reads them.
