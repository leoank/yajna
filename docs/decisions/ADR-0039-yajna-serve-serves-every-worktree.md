# ADR-0039: `yajna serve` serves every worktree of a notebook

Status: accepted
Date: 2026-11-18
Amends: ADR-0027, ADR-0036

## Context
A notebook lives in several git worktrees: agents work on a project's branch in a worktree
of its own (ADR-0021), and `ank`'s lab, `manthan`, has seven, one per project branch beside
`main`. `yajna serve` serves one of them, the checkout it was started in or the one the
registry names (ADR-0036): its site, its files and its reviews. Work in the other worktrees
can be seen only by starting another server there, though the review pages already find
reviews in every worktree. The owner asked for every worktree to be served by default
(2026-11-18).

## Decision
- **Every worktree, found by git.** The server lists the notebook's worktrees with `git
  worktree list` from the served checkout, as reviews do: each worktree whose notebook root
  (the same path within it) has a `yajna.toml`. The list is read again when it is more than
  a few seconds old, so a worktree added or removed shows without a restart; a missing or
  prunable worktree is left out.
- **Named by its branch, served under `/w/<branch>/`.** A worktree is its branch's name
  (`@<short sha>` when detached), percent-encoded in the URL, and everything a server of one
  checkout serves at `/`, the site, the files viewer and its API, reviews, changes (ADR-0038),
  is served for it under `/w/<branch>/`. The served checkout stays at `/` as well, so links
  made before keep working. With `--socket`, the same sits under each notebook:
  `/n/<namespace>/w/<branch>/`.
- **Opened when asked for.** A worktree's site, roots, preview and reviews are set up on its
  first request, its site rendered then, its files watched only while the viewer has them
  open, and all of it dropped when the worktree goes.
- **A list for clients.** `GET /api/worktrees` gives each worktree's name, branch, path,
  head commit, whether it is the served checkout, and how many files are changed, staged or
  untracked in it; `/api/notebooks` (socket) carries the same per notebook. The files
  viewer and the changes view pick a worktree from it, and the changes view opens on it:
  which worktrees have uncommitted work.
- **On by default.** `[serve] worktrees = "this"` in `yajna.toml` serves only the checkout
  the server runs in, as before; `"all"` is the default.
- **The crate stays notebook-free.** `yajna-serve` lists worktrees through git and asks the
  CLI, through a callback, for a worktree's configuration (its roots, renderer and reviews),
  as it is given the served checkout's today.

## Alternatives considered
- One root per worktree in a single files viewer (`notes@fbr-sim`): the roots multiply by
  the worktrees, and the site and reviews still serve one checkout.
- Registering each worktree as a notebook of its own: the registry is per notebook, and the
  phone would list seven copies of one lab.
- A server per worktree: a process and a socket each, started by hand.

## Consequences
- A lab's every branch can be read from one address, and from the phone through saarthi.
- Rendering a worktree's site costs what rendering the main one does, the first time it is
  asked for.
- A branch name is part of a URL; a branch renamed moves its worktree's URLs.
