# rc2s2 - A remote command and control session server

Code for [[PRJ-0002]]; the notebook page is `lab/projects/PRJ-0002-rc2s2-a-remote-command-and-control-session-server/README.md`.

`nix develop` here enters the project's own environment. The root flake registers this
directory as the input `rc2s2-a-remote-command-and-control-session-server`, so the root `nix flake check` builds this shell too.

Agents picking this up: start with `docs/HANDOFF.md`, then `docs/architecture.md`.
