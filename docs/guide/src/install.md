# Install

yajna is one static binary with its schemas and templates built in. Pick whichever way of
getting it suits the machine.

## With Nix

The repository is a flake. Try it without installing:

```sh
nix run github:leoank/yajna -- --version
```

Install it into your profile:

```sh
nix profile install github:leoank/yajna
```

Or add it as an input to a flake you already have, such as a notebook repository's own
flake or a NixOS, nix-darwin or home-manager configuration:

```nix
{
  inputs.yajna.url = "github:leoank/yajna";

  outputs = { self, nixpkgs, yajna, ... }: {
    # in a dev shell
    devShells.aarch64-darwin.default = nixpkgs.legacyPackages.aarch64-darwin.mkShell {
      packages = [ yajna.packages.aarch64-darwin.yajna ];
    };
    # or in home-manager: home.packages = [ yajna.packages.${pkgs.system}.yajna ];
  };
}
```

The flake builds for `x86_64-linux`, `aarch64-linux`, `x86_64-darwin` and
`aarch64-darwin`. It also provides `packages.yajna-nvim`, the [Neovim plugin](guides/neovim.md).

A notebook repository usually pins yajna in its own `flake.nix`, so `nix develop` in the
notebook gives everyone the same version. Update it with `nix flake update yajna`.

## Without Nix

Every [release](https://github.com/leoank/yajna/releases/latest) carries binaries for Linux
(static, x86-64 and ARM64), macOS (Apple silicon and Intel) and Windows (x86-64), each with a SHA-256
checksum in `yajna-<tag>-<target>.sha256`. Download the archive for your machine, check
it, unpack it and put `yajna` on your `PATH`:

| Machine | Archive |
|---------|---------|
| Linux, x86-64 | `yajna-<tag>-x86_64-unknown-linux-musl.tar.gz` |
| Linux, ARM64 | `yajna-<tag>-aarch64-unknown-linux-musl.tar.gz` |
| macOS, Apple silicon | `yajna-<tag>-aarch64-apple-darwin.tar.gz` |
| macOS, Intel | `yajna-<tag>-x86_64-apple-darwin.tar.gz` |
| Windows, x86-64 | `yajna-<tag>-x86_64-pc-windows-msvc.zip` |

```sh
tag=v0.2.0
target=aarch64-apple-darwin
base=https://github.com/leoank/yajna/releases/download/$tag
curl -LO $base/yajna-$tag-$target.tar.gz
curl -LO $base/yajna-$tag-$target.sha256
shasum -a 256 -c yajna-$tag-$target.sha256
tar xzf yajna-$tag-$target.tar.gz
install yajna ~/.local/bin/
yajna --version
```

On Windows, in PowerShell:

```powershell
$tag = "v0.18.1"
$base = "https://github.com/leoank/yajna/releases/download/$tag"
Invoke-WebRequest "$base/yajna-$tag-x86_64-pc-windows-msvc.zip" -OutFile yajna.zip
(Get-FileHash yajna.zip -Algorithm SHA256).Hash   # compare with the .sha256 file
Expand-Archive yajna.zip -DestinationPath "$env:LOCALAPPDATA\yajna"
& "$env:LOCALAPPDATA\yajna\yajna.exe" --version
```

Add that folder to your `PATH` to run `yajna` anywhere. yajna calls `git`, so Git for
Windows must be installed. The Windows build is new, and its test suite runs only on
Linux and macOS.

On macOS, a binary downloaded with a browser is quarantined; `curl` downloads are not. If
macOS refuses to run it, clear the flag with `xattr -d com.apple.quarantine yajna`.

The Nix flake builds the same code; a release is only a tagged commit.

## From source

```sh
git clone https://github.com/leoank/yajna
cd yajna
nix develop            # or any Rust toolchain
cargo build --release --manifest-path tools/Cargo.toml   # the binary is tools/target/release/yajna
```

## Check it works

```sh
yajna --version
yajna --help
```

Run `yajna` inside a notebook with no arguments for an interactive menu. Outside one it
says it cannot find `yajna.toml`; the [Quickstart](quickstart.md) makes one.

## Optional companions

- **git** is how the notebook keeps its history; yajna assumes the notebook is a git
  repository.
- **[Claude Code plugin](guides/claude-code.md)** for agents that work in the notebook.
- **[Neovim plugin](guides/neovim.md)** to follow `[[links]]` from the editor.
- **Zotero** with Better BibTeX if you cite papers ([References](guides/references.md)).
- **[pandoc](https://pandoc.org)** to [sync](guides/docs-and-sync.md) pages that cite
  papers: it renders their citations and reference list. Nothing else needs it.
- **[qmd](https://github.com/tobi/qmd)** for full-text and semantic search over the
  notebook.
