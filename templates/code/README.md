# $title

Code for [[$id]]; the notebook page is `lab/projects/$id-$slug/README.md`.

`nix develop` here enters the project's own environment. The root flake registers this
directory as the input `$slug`, so the root `nix flake check` builds this shell too.
