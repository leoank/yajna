{
  description = "yajna: tooling for a markdown-first lab notebook";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux" ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in {
      packages = forAll (pkgs: rec {
        # The yajna CLI (ADR-0017): one static binary with schema/ and templates/ embedded.
        yajna = pkgs.rustPlatform.buildRustPackage {
          pname = "yajna";
          version = "0.2.0";
          src = self;
          sourceRoot = "source/tools/yajna";
          cargoLock.lockFile = ./tools/yajna/Cargo.lock;
          nativeCheckInputs = [ pkgs.git ]; # the graduate test drives `git subtree`
        };
        default = yajna;
        # Neovim plugin (phase 0c): follow [[ID]] links and @citekeys, find entities, backlinks.
        yajna-nvim = pkgs.vimUtils.buildVimPlugin {
          pname = "yajna.nvim";
          version = "0.1.0";
          src = ./tools/yajna.nvim;
        };
      });

      devShells = forAll (pkgs:
        let
          # Runs the checked-out source, so edits under tools/yajna take effect immediately.
          yajnaDev = pkgs.writeShellScriptBin "yajna" ''
            exec cargo run --quiet --manifest-path "''${YAJNA_SRC:?run inside nix develop}/Cargo.toml" -- "$@"
          '';
        in {
          default = pkgs.mkShell {
            packages = [ yajnaDev pkgs.git pkgs.cargo pkgs.rustc pkgs.clippy pkgs.rustfmt pkgs.rust-analyzer pkgs.python3 ];
            shellHook = ''
              export YAJNA_SRC="$PWD/tools/yajna"
            '';
          };
        });

      checks = forAll (pkgs: {
        # buildRustPackage runs `cargo test`: the CLI's unit and integration tests.
        yajna = self.packages.${pkgs.system}.yajna;
        # this repo is a project-shaped yajna repo: its own notebook must validate
        notes = pkgs.runCommand "yajna-notes" {
          nativeBuildInputs = [ self.packages.${pkgs.system}.yajna ];
        } ''
          cd ${self}
          yajna --root . validate
          touch $out
        '';
        yajna-nvim = pkgs.runCommand "yajna-nvim-tests" {
          nativeBuildInputs = [ pkgs.neovim ];
        } ''
          export HOME=$TMPDIR
          nvim --headless -u NONE --cmd "set rtp^=${self}/tools/yajna.nvim" -l ${self}/tools/yajna.nvim/tests/run.lua
          touch $out
        '';
      });
    };
}
