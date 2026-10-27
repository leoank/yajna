# Reviews

A review keeps the comments on a set of changes in the notebook, as a `REV` page, instead
of in a chat that ends with the session (ADR-0030). It can be of a branch, a commit range
or a page; reviews of runs, experiments and project phases come next.

```sh
yajna review open toy-model/speedup            # a branch against main (--base for another)
yajna review open 84ce40f..a1da1b4             # a commit range
yajna review open EXP-20261021-0k3m9x          # a page, since its last approved review
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
