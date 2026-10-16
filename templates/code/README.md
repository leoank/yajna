# $title

Code for [[$id]]; the notebook page is `lab/projects/$id-$slug/README.md`.

`nix develop` here enters the project's own environment. The root `nix flake check`
evaluates this flake too, passing it the root's `nixpkgs`.
