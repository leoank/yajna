# ADR-0040: Actions in the changes view: stage, unstage, commit, and comments as review threads

Status: accepted
Date: 2026-11-18
Amends: ADR-0030 (the server commits nothing), ADR-0036 (never commits in a working tree), ADR-0038 (read-only)

## Context
The changes view (ADR-0038) shows what an agent changed in a worktree, file by file, on a
phone as well as a desktop, and can do nothing about it. Reading an agent's work and then
walking to a terminal to stage, commit or tell the agent what to change is the gap it
leaves. ADR-0038 deferred staging, committing and comments that become prompts to a
session to a later step behind the write rules of ADR-0028 and on review threads
(ADR-0030). ank chose on 2026-11-18: stage, unstage and commit, no discard; writes on the
owner's socket and with `--review`, as review writes are; a comment on a diff is a review
thread.

## Decision
- **Three git writes** in `yajna-serve`, in the worktree a path is in:
  - **stage** a file, or one hunk of its unstaged change; an untracked file is added whole;
  - **unstage** a file, or one hunk of its staged change;
  - **commit** what is staged, with a message, as git is configured on the machine (its
    `user.name` and `user.email`), running the repository's hooks; a hook that refuses
    is reported with its output and nothing is committed.
  Discard is not offered: it destroys work an agent may still need, and the CLI has it.
- **Only what was seen.** A hunk is named by its header and a hash of its lines as the
  view received them; the server reads the diff again and refuses with 409 when that hunk
  is no longer there, so a change the agent made meanwhile is never staged unseen. A
  commit carries the staged tree the view showed (`git write-tree`), and is refused when the
  index has moved since.
- **Who may write**: the same rule as review writes. On the owner's unix socket (ADR-0036),
  which is how the phone reaches it through saarthi, with no token; on a TCP server only
  with `yajna serve --review`, its token and a matching `Origin`. Without either, the
  server stays read-only. `dir_router` stays read-only unless the program embedding it
  says otherwise.
- **Commits from the server are allowed**, by the person at the view, through these routes
  only. Everything else the server writes still only appends or creates (ADR-0036), and a
  review is still merged with the CLI (`yajna review merge`).
- **A comment on a diff is a review thread.** In a notebook, a comment on lines of a
  changed file opens a thread on the worktree's open review, opening one for its branch
  (or for the uncommitted work on `main`, as a range) when there is none, so it is kept,
  anchored to its lines and addressed and resolved as reviews are (ADR-0030). The server
  records each new thread in an event that clients can follow, and saarthi's node turns it
  into a prompt to the session that made the change; yajna knows nothing of sessions.
  Outside a notebook (`dir_router`) comments are left to the embedding program.

## Alternatives considered
- **Discard too**, behind a confirmation: irreversible for untracked files, and the one
  action a misplaced tap on a phone should not reach.
- **Stage and unstage only**, committing left to the person or the agent: keeps ADR-0036's
  "never commits", but leaves the view one step short of finishing a piece of work.
- **Writes on the socket only**: the laptop's browser would need saarthi to commit.
- **Comments handed to the embedder only**: nothing would be kept in the notebook, and the
  thread an agent addresses would live in saarthi alone.

## Consequences
- `yajna-serve` gains routes that change a working tree's index and history; they are the
  only ones that do, and are covered by the same write check as reviews.
- An agent working in the worktree and a person committing from the view can race; git's
  index lock and the hunk and tree checks above make the loser fail and say so, never
  commit something unseen.
- saarthi depends on the comment event's shape; it changes only with saarthi in step.
