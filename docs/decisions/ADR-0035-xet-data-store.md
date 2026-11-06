# ADR-0035: Large data lives in Xet-format stores of chunked, deduplicated objects, not git-annex

Status: proposed
Date: 2026-11-06
Phase: 2
Source: `docs/data.md`. Supersedes ADR-0013.

## Context

ADR-0013 deferred large data storage to Phase 2, leaning towards git-annex: content-addressed
keys on `ART` pages, several remotes, partial checkouts. Since then the data has become more
concrete: successive model checkpoints and dataset versions (rc2s2, oppy runs), run outputs
that `run reproduce` compares by hash (ADR-0031), and imaging sessions in manthan. git-annex
stores each version of a file whole and adds a second tool with its own model of the repo.

Hugging Face's Xet storage, specified openly (v1.1.0) with a Rust reference implementation
(xet-core, Apache-2.0), cuts files into content-defined chunks, stores each chunk once across
all files and versions, packs chunks into compressed xorbs, and rebuilds a file from a
small recipe. ank asked for it to be the core of the data strategy.

Options considered, with ank on 2026-11-06:

1. git-annex, as ADR-0013 leaned: whole-file versions, a second tool.
2. git-annex for tracking with a Xet special remote: dedup, but both tools.
3. Git LFS pointers with a Xet transfer agent, Hugging Face's own shape: transparent
   checkouts, LFS's single remote, a filter on every checkout.
4. Xet as yajna's own data layer, the `ART` page as the pointer: chosen.

For the implementation: depend on xet-core (least code; heavy dependencies, about 25 API
changes in 2026, "not meant to be used directly"), or write our own crate to the spec,
checked against xet-core: chosen.

## Decision

- **Format:** byte-exact Xet (gearhash chunking, keyed BLAKE3 chunk, xorb and file hashes,
  xorbs and shards as specified), in our own crate `tools/yajna-xet`, verified against
  xet-core and Hugging Face's reference files.
- **The `ART` page is the pointer:** `store: xet`, the Xet file hash, sha256, size, and the
  gitignored path `yajna data get` materializes it at. Folders (an imaging session) are one
  `ART` whose manifest is itself a stored file. Nothing is fetched by `git checkout`.
- **Recipes live only in stores**, as in Xet; the repo records hashes.
- **Stores are directories** (`xorbs/`, `shards/`, `files/`, `chunks/`), named per machine
  in the user's config and shared by every notebook there, on a local or mounted disk or on
  another machine over plain ssh with nothing installed there. A notebook names where it
  pushes and how many `copies` a file needs.
- **Stores are append-only;** `yajna data drop` frees a file from one store only when
  `copies` others hold it whole.
- **In scope:** files and folders added by hand, run outputs above a threshold, large files
  refused before they are committed. **Not in Phase 2:** HTTP remotes (Hugging Face,
  Shardline, S3), git filters, encryption.
- **Spikes first:** byte-exactness (EXP A), dedup and speed on checkpoints, imaging,
  tables and synthetic data (EXP B), ssh stores against oppy (EXP C).

## Consequences

- One tool and one model: pages name data, stores hold it, and the same bytes across
  versions, runs and notebooks on a machine are stored once.
- Hugging Face, a Shardline server or any Xet CAS can become a remote without converting
  data, because the objects are already in its format.
- A file can be rebuilt only through a store that holds its shard; losing every store that
  holds a recipe loses the file even if its xorbs survive elsewhere. `copies` and
  `data status` are the guard.
- We own a format implementation and must keep it exact as the spec moves; EXP A's vectors
  become tests.
- ADR-0013 is superseded; `ART` pages written with `store: path` convert with
  `yajna data add --art`.
