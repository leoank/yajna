# ADR-0017: The CLI becomes a single Rust binary

Status: accepted
Date: 2026-10-17
Phase: 0b
Supersedes: ADR-0015
Source: `docs/architecture.md` sections 6 and 9

## Context

`yajna` is about to be used outside this repo: in graduated project repositories
(ADR-0018) and on machines that are not managed by `neusis`, including HPC nodes and lab
PCs without Nix. The Python CLI (ADR-0015) runs only inside this repo's dev shell, carries
its schemas and templates as sibling directories, and depends on an interpreter plus three
libraries being present. ADR-0015 already said the language is swappable because the
contract is files.

## Decision

- `yajna` is rewritten in Rust as one statically linked binary with the schemas and
  templates embedded. A vault may override templates under `.yajna/templates/`; schemas
  are not overridable, they are the contract.
- This repo is the home of every yajna tool: CLI, indexer, server and apps, under
  `tools/`. The Rust port is written at `tools/yajna-rs/` beside the Python package and
  takes over the `tools/yajna/` name in the commit that deletes the Python CLI, once it
  passes parity. The lab is kept in this repo for quick iteration and moves to its own
  `lab`-shaped repo later, taking `lab/`, `projects/`, `references/` and `yajna.toml`
  with it.
- Parity is defined by tests, not by reading: the Python test suite is ported as
  integration tests that drive the binary against a scratch vault, and a scripted session
  (`new`, `log`, `result`, `ref`, `validate`) run through both CLIs must produce the same
  vault byte for byte, timestamps aside (`tools/yajna-rs/parity.sh`).
- Distribution: `packages.yajna` from this repo's flake, installed on every
  `neusis`-managed machine by adding `github:leoank/yajna` as an input there; GitHub
  releases with binaries for `x86_64-linux` (musl), `aarch64-linux`, `aarch64-darwin`
  and `x86_64-darwin` for machines without Nix. One version string, `yajna --version`,
  covers the binary and the schema set it embeds.
- Stack: `clap` for the command line, `inquire` for prompts with completion,
  `jsonschema` (draft 2020-12), `serde` with a YAML parser for frontmatter, `toml` for
  `yajna.toml`, `jiff` for time zones, `rust-embed` or `include_dir` for the embedded
  files. Git is shelled out to, never linked, so the binary stays static.
- Page writes keep going through templates and text substitution, as the Python CLI does,
  so key order and comments in frontmatter survive. Serialising a parsed YAML tree back
  out is reserved for pages the tool created itself.

## Consequences

- The indexer, when it exists (ADR-0007), is written in the same language and ships in
  the same binary.
- The server language stays undecided until the server exists.
- Pages written by either CLI are indistinguishable; nothing in the vault records which
  one wrote it.
- `packages.yajna` in this repo's flake becomes the Rust build; the dev shell keeps
  running the checked-out source so edits take effect immediately.
- Parity was reached the same day (2026-10-17): the Python package, its tests and
  `parity.sh` were deleted and the port took the `tools/yajna/` name. The integration
  tests in `tools/yajna/tests/cli.rs` are the port's definition from then on.
