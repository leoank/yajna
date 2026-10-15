# ADR-0015: Python for the CLI and indexer

Status: accepted
Date: 2026-10-15
Phase: 0
Source: `docs/architecture.md` section 6

## Context

The file formats and the eventual SQLite schema are the contract, so implementation
language is swappable. The dry-lab code, agent tooling and the protocol framework are Python.

## Decision

`yajna` (the CLI) and the indexer are written in Python, packaged with the repo flake as
`packages.yajna`, standard library plus a YAML and JSON Schema library. The language for the
server is decided when the server exists.

## Consequences

- One toolchain for notebook tooling, protocols and analyses.
- Nothing downstream may import the CLI's internals; the contract is files.
