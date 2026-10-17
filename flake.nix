{
  description = "yajna: a markdown-first lab notebook and its tooling";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  # Dry-lab projects (ADR-0009): one input per projects/<name>/, each a flake with its own
  # lock and inputs; nixpkgs follows the root so everything shares one pin. The line is
  # added by `yajna new project --code`; run `nix flake lock` afterwards.
  # projects: registered by yajna new project --code
  inputs.rc2s2-a-remote-command-and-control-session-server = { url = "path:./projects/rc2s2-a-remote-command-and-control-session-server"; inputs.nixpkgs.follows = "nixpkgs"; };

  outputs = { self, nixpkgs, ... }@inputs:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux" ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
      projects = removeAttrs inputs [ "self" "nixpkgs" ];
      projectChecks = pkgs: nixpkgs.lib.mapAttrs' (name: flake: {
        name = "project-${name}";
        value = flake.devShells.${pkgs.system}.default;
      }) projects;
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

      checks = forAll (pkgs: projectChecks pkgs // {
        # buildRustPackage runs `cargo test`: the CLI's unit and integration tests.
        yajna = self.packages.${pkgs.system}.yajna;
        validate = pkgs.runCommand "yajna-validate" {
          nativeBuildInputs = [ self.packages.${pkgs.system}.yajna ];
        } ''
          cd ${self}
          yajna --root . validate
          touch $out
        '';
      });
    };
}
