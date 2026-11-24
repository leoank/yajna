# ADR-0043: In a lab, the app is scoped by project; the worktree follows from it

Status: accepted
Date: 2026-11-24
Amends: ADR-0039 (every worktree under `/w/<branch>/`), ADR-0041 (the app's shell)

## Context
In a lab notebook each project is worked on in a worktree of its own, on a branch named
`<project-slug>/<topic>` (`yajna worktree`, ADR-0021); manthan's are `g2a/main`,
`fbr-sim/main` and so on. The current state of a project is on its branch: `g2a/main` was
39 commits ahead of `main` on 2026-11-24. The app (ADR-0041) shows the checkout it was
started in, `main`, and a worktree picker (ADR-0039) to show another. To look at a
project's files ank picked the worktree first, then went to Files and down to the
project's code; the overview and project pages under `main` were weeks old; and every
list (experiments, runs, log, tasks) mixed all projects. ank asked on 2026-11-24 for a
better design and a project selector that filters everything to one project.

## Decision
- **The project is the choice; the worktree follows.** In a lab the sidebar's picker is a
  scope switcher: *All projects*, or one project. A project is shown from its home
  worktree: the worktree on `<slug>/main`, else the most recently committed one on
  `<slug>/*`, else the served checkout. A project with several worktrees shows them under
  the switcher to pick from. Worktrees that belong to no project stay reachable from the
  same menu. A `project` notebook has one project and no switcher.
- **Addresses.** `/project/<slug>/…` is a project's scope, served from its home worktree;
  `/project/<slug>/w/<branch>/…` the same from another of its worktrees. Every app route
  works under either (`/project/g2a/files/code/g2a/train.py`). `/w/<branch>/` stays as it
  was. On the socket the same lives under `/n/<namespace>/`.
- **The server filters, the app does not.** A scope's router is the worktree's router with
  the project set, so every API answers for the project:
  - *pages*: a page belongs to a project when its `project` is the project (or it is the
    project); a page without `project` (an agent session, a review, a doc) when the pages
    it links to that do belong to a project all belong to this one. Protocols, materials
    and equipment are lab-wide: listed in a scope, apart, as *Lab-wide*.
  - *log*: a line belongs to every project whose pages it names (`[[ID]]`, a project's
    page, an experiment, a run, a phase or a page that belongs as above). A line that names
    none is not guessed at: it is shown under *All projects* only. A line naming two
    projects is shown in both.
  - *tasks*: those on pages that belong; *search*: pages and lines that belong, with how
    many more there are in the whole notebook.
  - *changes*: the project's worktrees; *reviews*: those of the project's branches.
  - Files keep the same paths in every scope; a scope's Files opens on the project's
    folders (its code, its notes, roots inside them) above the roots.
- **A scope opens on the project's home**: the project, its active phase, *Needs you*
  (draft conclusions waiting for `yajna approve`, ADR-0042, and other pages under
  `review: pending`), recent log lines, open tasks, uncommitted changes and its folders.
- ***All projects* is current.** Its project cards, its *Recently* and its log read each
  project's lines and counts from the project's home worktree, merged with the served
  checkout's (each project worktree's index opened per request: 268 ms for manthan's six
  with process starts, EXP-20261124-gq45yv). A card says where the project is worked on,
  how far ahead of the served checkout and how much is uncommitted. A page opened under
  `main` whose project's branch is ahead says so, with a link to the current one.
- `/api/projects` lists the projects with their slug, folders, worktrees, home and how far
  each is ahead; it is the switcher's and the cards' source.

## Alternatives considered
- **Two independent pickers, project and worktree.** What ank first asked for. Most
  combinations are wrong (g2a's pages from `fbr-sim/main`), and the worktree is a detail of
  where the project lives, which the branch name already says.
- **Filter in the app.** Every screen would learn the rule, and the log and search, which
  page on the server, could not be filtered correctly a page at a time.
- **Guess a log line's project from its neighbours or its author's branch.** About one line
  in six names no page; a guess would put lines in the wrong project. ank chose
  conservative: unattributed lines stay under *All projects*.
- **`/project/PRJ-0004/`.** Stable, but unreadable in a link; the slug is the branch's
  prefix and the project's directory name already.
- **Scoped files roots (`code` meaning `code/<slug>`).** Shorter paths, but a link would
  mean different files in different scopes.

## Consequences
- Seeing a project's files, log or experiments is one choice, and the address says which
  project. Links survive a worktree being renamed or a second one added.
- *All projects* costs one index open per project worktree per overview and log request.
- A log line that names no page is invisible in a scope; agents already link the IDs they
  write about, and the conventions ask for it.
