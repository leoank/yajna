#!/bin/sh
# Type-check and bundle the files viewer into dist/ (ADR-0029). Run by `nix run .#ui`
# through the flake, with esbuild and tsc from nixpkgs and node_modules from
# package-lock.json; dist/ is committed and embedded by the yajna-serve crate.
set -eu
cd "$(dirname "$0")"
tsc -p .
rm -rf dist
mkdir dist
# languages are split into chunks loaded when a file needs them
esbuild src/main.ts --bundle --splitting --minify --format=esm --target=es2022 --legal-comments=eof --outdir=dist --entry-names=app --chunk-names=chunks/[name]-[hash] --log-level=warning
esbuild src/style.css --minify --outfile=dist/app.css --log-level=warning
cp src/index.html dist/index.html
