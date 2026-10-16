{
  description = "yajna: a markdown-first lab notebook and its tooling";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" "aarch64-linux" ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
      # Dry-lab code under projects/<name>/ carries its own flake (ADR-0009). Each one is
      # evaluated here with the root's inputs, so a broken project flake fails the root
      # check; a project that adds inputs of its own must take them from the root too.
      projectNames = nixpkgs.lib.attrNames (nixpkgs.lib.filterAttrs
        (name: kind: kind == "directory" && builtins.pathExists (./projects + "/${name}/flake.nix"))
        (if builtins.pathExists ./projects then builtins.readDir ./projects else { }));
      projectChecks = pkgs: nixpkgs.lib.listToAttrs (map (name: {
        name = "project-${name}";
        value = ((import (./projects + "/${name}/flake.nix")).outputs {
          self = { outPath = ./projects + "/${name}"; };
          inherit nixpkgs;
        }).devShells.${pkgs.system}.default;
      }) projectNames);
    in {
      packages = forAll (pkgs: rec {
        yajna = pkgs.python3Packages.buildPythonApplication {
          pname = "yajna";
          version = "0.1.0";
          pyproject = true;
          src = ./tools/yajna;
          build-system = [ pkgs.python3Packages.setuptools ];
          dependencies = with pkgs.python3Packages; [ pyyaml jsonschema prompt-toolkit ];
          # Tests need the repo's templates and schemas, which sit outside the package
          # src; they run in checks.tests instead.
          doCheck = false;
        };
        default = yajna;
      });

      devShells = forAll (pkgs:
        let
          python = pkgs.python3.withPackages (ps: with ps; [ pyyaml jsonschema prompt-toolkit ]);
          # Runs the checked-out source, so edits under tools/yajna take effect immediately.
          yajnaDev = pkgs.writeShellScriptBin "yajna" ''
            export PYTHONPATH="''${YAJNA_SRC:?run inside nix develop}''${PYTHONPATH:+:$PYTHONPATH}"
            exec ${python}/bin/python3 -m yajna "$@"
          '';
        in {
          default = pkgs.mkShell {
            packages = [ python yajnaDev pkgs.git ];
            shellHook = ''
              export YAJNA_SRC="$PWD/tools/yajna"
            '';
          };
        });

      checks = forAll (pkgs: projectChecks pkgs // {
        validate = pkgs.runCommand "yajna-validate" {
          nativeBuildInputs = [ self.packages.${pkgs.system}.yajna ];
        } ''
          cd ${self}
          yajna --root . validate
          touch $out
        '';
        tests = pkgs.runCommand "yajna-tests" {
          nativeBuildInputs = [ (pkgs.python3.withPackages (ps: with ps; [ pyyaml jsonschema prompt-toolkit ])) ];
        } ''
          cd ${self}
          PYTHONPATH=tools/yajna python3 -m unittest discover -s tools/yajna/tests -v
          touch $out
        '';
      });
    };
}
