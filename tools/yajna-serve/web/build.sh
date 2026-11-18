#!/bin/sh
# Type-check and bundle the web app into dist/ (ADR-0041). Run by `nix run .#web` through
# the flake, with esbuild and tsc from nixpkgs and node_modules from package-lock.json;
# dist/ is committed and embedded by the yajna-serve crate.
set -eu
cd "$(dirname "$0")"
tsc -p .
rm -rf dist
mkdir dist
# the code view is split off and loaded when a file is opened
esbuild src/main.tsx --bundle --splitting --minify --format=esm --target=es2022 --jsx=automatic --legal-comments=eof --outdir=dist/assets --entry-names=app --chunk-names=[name]-[hash] --log-level=warning --define:process.env.NODE_ENV='"production"'
esbuild src/styles.css --minify --outfile=dist/assets/app.css --log-level=warning
cp src/index.html dist/index.html
