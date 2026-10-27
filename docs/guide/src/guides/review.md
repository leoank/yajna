# Reviews

A review keeps the comments on a set of changes in the notebook, as a `REV` page, instead
of in a chat that ends with the session (ADR-0030). It can be of a branch, a commit range,
a page, a run, an experiment or a phase of a project.

```sh
yajna review open toy-model/speedup            # a branch against main (--base for another)
yajna review open 84ce40f..a1da1b4             # a commit range
yajna review open PRO-0012                     # a page, since its last approved review
yajna review open RUN-20261023-nvfv0n          # a run, against the run before it
yajna review open EXP-20261021-0k3m9x          # an experiment, from its start to its last run
yajna review open PRJ-0005 --phase "E1c"       # a phase: an item of the project's Progress
```

| Target | From | To |
|---|---|---|
| run | the previous run's `commit` | the run's `commit` |
| experiment | before its page was created | its last run's `commit`; now, while it is planned or active |
| phase | the item's `(since <sha>)`, else when the item before it was ticked | when it was ticked; now, while it is open |

A run, experiment or phase review covers the project's code (its `code` field) and the
page with its directory; when the base or head is a guess the page's `## Summary` says
how it was found. For a run, `show --diff` adds the two runs' directories as they are now,
since a run's script is usually committed after the code it ran.

```sh
yajna phase start PRJ-0005 "E1c"               # appends (since <HEAD>) to the item
```

`open` resolves the target to a base and a head commit, writes the page and prints its
path. A branch review is written on the branch, in the worktree that has it checked out, so
it merges with the work; a review of anything in a project goes under the project's
`reviews/`. `--paths` limits the diff, `--title` names it.

## Threads

```sh
yajna review comment REV-20261027-k3m8vd --at code/x.py:120-126 "why a fixed 32?"
yajna review comment REV-20261027-k3m8vd --at notes/projects/PRJ-0005-…/README.md#Plan "…"
yajna review comment REV-20261027-k3m8vd "add a test for the empty case"
```

A comment opens a thread on lines, on a heading, or on the whole review, and quotes what
it points at in the review's head commit. The page then reads:

````markdown
### T1 (open) code/x.py:120-126 @ a1da1b4
```py
os.environ["OMP_NUM_THREADS"] = "32"
```
- 2026-10-27 14:02 ank: why a fixed 32?
- 2026-10-27 14:31 agent:claude-vpi addressed in 5e6f7a8: reads the job's cores
- 2026-10-27 15:10 ank resolved
````

| Command | Who | Does |
|---|---|---|
| `yajna review reply REV-… T1 "…"` | anyone | answers in the thread |
| `yajna review address REV-… T1 --commit <sha> "…"` | whoever fixed it | marks it addressed; for a branch review the commit must be on the branch (default `HEAD`) |
| `yajna review resolve REV-… T1` | a human | closes it; refused for `agent:` authors |
| `yajna review reopen REV-… T1` | anyone | opens it again |

Lines are appended, never edited, like the log. The page can also be edited by hand in the
same format; `yajna validate` checks the threads, that each heading's state follows from its
replies, that no agent resolved one, and that the commits named exist (outside shallow
clones).

## Reading

`yajna review list [--open]` lists the reviews in this checkout and every other worktree
of the repository, with how many threads are open. `yajna review show REV-…` prints the
threads, `--diff` the changes under review (`git diff base head -- paths`).

## Approving and merging

```sh
yajna review request-changes REV-20261027-k3m8vd "explain the 32 first"
yajna review approve REV-20261027-k3m8vd "good"
yajna review merge REV-20261027-k3m8vd            # from main
```

Only a human approves, and only once every thread is resolved. Approving signs the pages
the review covers that wait for review (its target when that is a page, run or experiment,
and every page in `about`): `review: pending` becomes

```yaml
review: approved
approval: {by: ank, on: 2026-10-27, in: REV-20261027-k3m8vd}
```

A page is signed off without a review with `yajna approve EXP-20261021-0k3m9x`, which
leaves no `in`.
`request-changes` can come from anyone with a reason. Each verdict is a dated line under
`## Summary`.

`merge` is for a branch review, run from the checkout of the branch it goes into. It
refuses while the review is not approved or a thread is unsettled (`--force` merges anyway
and writes why into the page), while the branch's worktree has uncommitted changes or the
review page is not committed there, and when the branch does not validate against the
branch it goes into. Then it merges with `--no-ff`, and the merge commit carries the page
with `status: merged`, `merge: <the tip merged>` and a line in the summary.

## In the browser

```sh
yajna serve --review
# reviews, writable: http://127.0.0.1:8765/files/?token=…
```

The files viewer lists the reviews above the tree. A review opens as a tab: an overview
with the summary, the verdict buttons and every thread, then each changed file as a
side-by-side diff with its threads under their lines. To comment, select lines on the
right (or click a line number, shift-click for a range) and press *Comment on lines…*
over them, or type in the comment box at the top of the diff, which stays while you
scroll. Reply, address, resolve and reopen from the thread; Ctrl-Enter sends. The header's
toggles hide the file list or the comment box, wrap long lines, and *Focus* hides the rest
of the viewer (Esc brings it back). The tab reads the review again every two seconds, so
an agent's reply appears while you read.

*Not in the review yet*, under the files, shows what has changed since the review's head:
later commits, uncommitted edits and new files, each as a read-only diff against the file
on disk. Commit them and run `yajna review update` to comment on them.

Writing needs the printed URL: it carries a token the page keeps in memory, so a reload,
or `yajna serve` without `--review`, is read-only. A write made after someone else changed
the page is refused and the tab reloads with your text kept. Nothing is committed for you.

## What an agent owes

```sh
yajna review todo
```

lists the `open` and `outdated` threads on reviews of the branch you are on, and on the
other unfinished reviews of the checkout, oldest first, each with its last reply.
`yajna validate --against main` notes reviews of the branch that are not approved yet.

## What a review is about

A review has one target, and so one diff. The pages the work in it served go in `about`:

```sh
yajna review open HEAD..HEAD --title "Faster loader" --about EXP-20261021-0k3m9x
yajna review about REV-20261027-k3m8vd RUN-20261022-p4q8z1 PRJ-0002
yajna review list --target RUN-20261022-p4q8z1    # reviews of it, and about it
```

## Reviewing the past

Targets resolve from history, so work that was never reviewed can be:

```sh
yajna review open 1a2b3c4..9f8e7d6 --title "The loader rewrite" --about EXP-20261003-a7k2m1
yajna review open PRJ-0002 --phase "loader"       # a ticked Progress item
```

When the fixes it asks for are committed, move the range on rather than opening another
review: `yajna review update REV-… --to HEAD`. It refuses a commit that does not come after
the review's head.

## Keeping up

```sh
yajna review update REV-20261027-k3m8vd
```

After new commits, `update` moves the review's head to where its target is now (the
branch tip, or the target resolved again) and moves each open or addressed thread with
it: the file is followed through renames and the lines it pointed at are looked for in the
new version, exactly and then ignoring whitespace, nearest first. A thread whose lines are
gone becomes `(outdated)` and keeps its old anchor; it can still be answered and resolved.
