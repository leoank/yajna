# $title

Code for [[$id]]; the notebook page is `notes/projects/$id-$slug/README.md`.

The design is in `docs/architecture.md`, its decisions in `docs/decisions/`.

`nix develop` here enters the project's own environment. The root flake registers this
directory as the input `$slug`, so the root `nix flake check` builds this shell too.
