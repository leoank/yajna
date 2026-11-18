# ADR-0038: Git changes in `yajna serve`: a read-only API and a phone-first view, shared with saarthi

Status: accepted
Date: 2026-11-18
Amends: ADR-0027 (`docs/files-viewer.md` section 7, "Show git state")

## Context
`yajna serve` shows a notebook's files and a review's diff (ADR-0029, ADR-0030), but not
what is uncommitted, staged or recently committed in a worktree: the files viewer's design
left git state out (`docs/files-viewer.md` 7). saarthi, which shows `yajna serve` in its
phone app (its ADR-0053), needs the same view for any session's repository: what an agent
changed, file by file, read on a phone (its phase PHS-20261117-f22kxe, item 10). The owner
chose to build the view once, in `yajna-serve`, for both (2026-11-18), with saarthi's node
embedding the crate, and to start read-only.

## Decision
- **A git API in `yajna-serve`**, read-only, for a git worktree under a root, through the
  `git` CLI as the rest of yajna does:
  - `GET /api/git/status?path=<root>/<dir>`: the branch, its upstream and how far ahead
    and behind, and the changed files, unstaged, staged and untracked, each with its status
    (`M`, `A`, `D`, `R` with the old path, `?`);
  - `GET /api/git/log?path=&before=&limit=`: commits newest first, with subject, author,
    time and their changed files;
  - `GET /api/git/diff?path=<file>&from=&to=`: a unified diff of one file between two
    points, `HEAD`, `INDEX`, `WORK` or a commit (`<sha>^` for its parent);
  - a file at a point through `GET /api/git/file?path=&at=`, for opening it whole.
  Paths go through the files API's rules (`docs/files-viewer.md` 5.3); the worktree is
  found from the path, and a path outside any root is refused. Each worktree of a notebook
  has these under its own prefix, `/w/<branch>/api/git/…` (ADR-0039).
- **A changes view in the front end**, phone-first and good on a desktop. It opens on the
  notebook's worktrees and how much is uncommitted in each (`/api/worktrees`, ADR-0039);
  in one, the working tree's unstaged, staged and untracked files, then the commits, each
  opening one file's unified diff in a single column, and from there the file in the
  existing viewers. It is a page of its own (`/files/changes?path=`) and a panel in the
  workbench.
- **The crate knows git, not the notebook.** The git API and the changes view need no
  callback from the CLI, so another program can mount them on a directory of its own:
  saarthi's node serves them for a session's directory, one worktree, without ADR-0039's
  worktree list.
- **Read-only.** Staging, committing and comments that become prompts to a session come
  later, behind the write rules of ADR-0028 and on review threads (ADR-0030).

## Alternatives considered
- A native screen in saarthi's app and a separate view here: two views of the same thing.
- A crate of its own for git changes: a third thing to version, for what fits in
  `yajna-serve` next to the files and diff code it reuses.
- libgit2 or gitoxide: a new dependency where the CLI already shells out to `git`.

## Consequences
- `yajna-serve` grows a public surface saarthi depends on; its routes change only with
  saarthi in step.
- A notebook gets a view of its own uncommitted work, before it becomes a review.
