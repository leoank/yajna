# Working in parallel

Several agents, or you and an agent, can work on one notebook at the same time, each in its
own git worktree on its own branch. Almost everything in a notebook merges cleanly: pages
are separate files, date IDs never collide, and each author's log is its own file. One
thing does not: the counter behind projects, protocols, materials, equipment and builds.
These rules keep it that way.

```sh
yajna worktree PRJ-0003 aero-map       # a branch and a worktree for one line of work
yajna validate --against main          # before merging back: any ID allocated on both sides?
yajna renumber PRJ-0004                # the fix, on the branch
```

## Starting a worktree

```console
$ yajna worktree PRJ-0003 aero-map
```

creates the branch `<project-slug>/aero-map` from `main` (`--from` another branch) and
checks it out in a new worktree: `<container>/<branch>` when the repository uses a bare-repo
layout (a `.bare` directory with one directory per branch), otherwise
`<repo>-<project-slug>-aero-map` beside the repository; `--path` puts it elsewhere. It
writes `.yajna/author` there:
`agent:claude-<project-slug>-aero-map`. Every yajna command in that worktree writes as that
author unless `YAJNA_AUTHOR` or `--author` says otherwise. `--agent codex` names a different
agent. `.yajna/` is never committed.

## The rules

1. **One agent per worktree, one project per branch.** Two agents never work on the same
   project at once. When a project needs parallel work, split it by experiment and let only
   one branch edit the project page.
2. **Each worktree has its own author**, so log files never collide.
3. **Allocate counter IDs on `main`.** Experiments, analyses and runs have date IDs and can
   be created on a branch freely. A new project is created on `main`, committed, and merged
   into the branch before work starts.
4. **Shared things live on `main`.** Protocols, materials, equipment and builds are created
   and edited there; branches link to them.
5. **Check before merging.** A branch that allocated a counter ID runs
   `yajna validate --against main`. A collision fails with the command that fixes it.
6. **Merge `main` into the branch at least daily.** In a conflict on `counters.yaml`, take
   the larger number for each prefix. Regenerate a `flake.lock` with `nix flake lock`, never
   by hand.
7. **Loose to-dos go on the pages they belong to**, not in `notes/tasks.md`, while on a
   branch. Do not use a bare `git stash`: worktrees share one stash stack.

## Fixing a collision

```console
$ yajna validate --against main
notes/projects/PRJ-0004-aero-sweep/README.md: PRJ-0004 was also created on main since this branch left it (notes/projects/PRJ-0004-wind-tunnel/README.md); renumber this one before merging: yajna renumber PRJ-0004
$ yajna renumber PRJ-0004
```

It also warns about protocols, materials, equipment or builds created on the branch, which
belong on `main`, and about counter pages on `main` the branch has not merged yet.

`renumber` moves the page on this branch to the next free number (or the one you give:
`yajna renumber PRJ-0004 PRJ-0006`) and rewrites every reference to it, in links, fields and
file paths. Commit, then merge. It refuses an ID that is already on two pages, because after
a merge nobody can tell which links meant which page: renumber before merging, not after.
