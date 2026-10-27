# Code review in the notebook

Status: design v0.7, 2026-10-27; steps 1 to 4 built (yajna 0.10.0 to 0.13.0), `about` and approval records in 0.14.0. Companion to `architecture.md` (section 11,
Phase 1d) and `reproduce.md`, which shares its commit resolution. Decision: ADR-0030.

## 1. What it is for

Agents work on branches in their own worktrees (ADR-0021) and ank reads what they did
before it reaches main. Today that reading happens in a terminal with `git diff`, and what
ank thinks of it goes into a chat that ends with the session: the comment, the answer and
the fix are nowhere in the repo afterwards. The same is true of runs: asking "what changed
in the code between these two results" is a `git log` by hand, and the remark that comes
of it is lost.

A review is a page in the notebook, `REV-…`, that holds the comments on a set of changes as
threads anchored to lines, the replies, and the commits that addressed them. It lives in
the repo it reviews, is written by the CLI, the files viewer, Neovim or by hand, validates
like every other page, and travels with the branch it is about. Its targets are what yajna
knows about, not only what git knows: a branch, a commit range, a page, a run, an
experiment, a phase of a project.

## 2. Decisions at a glance

| Question | Decision |
|---|---|
| What is reviewed | Six targets: a branch against its base, a commit range, a page, a run, an experiment, a project phase. Each resolves to a base and head commit plus the paths that matter |
| Where reviews live | `REV-<date>-<suffix>` pages, type `review`, beside what they review: under the project's `reviews/` when the target belongs to a project, else `notes/reviews/` |
| Comments | Threads in the page body: a heading with the thread's number, state and anchor, the quoted lines, and replies as dated list items |
| Anchors | Commit, path and line range, plus the quoted lines; re-anchored on the quoted lines when the head moves, `outdated` when they are gone |
| Who resolves | Anyone opens, comments and replies; an agent marks a thread `addressed` with the commit that fixes it; only a human marks it `resolved` |
| Merging | `yajna review merge` does the `--no-ff` merge of a branch target and refuses while threads are open or the review is not approved; `validate --against` warns about open reviews |
| Run, experiment, phase | A run: from the previous run of its experiment to its `commit`. An experiment: from the commit that created its page to its last run. A phase: from `(since <sha>)` in the Progress item, else from the commit that ticked the item before it, to the commit that ticked it |
| Interfaces | The CLI (`yajna review …`), a diff view in `yajna serve --review`, Neovim, and the page edited by hand. All write the same format |
| Serve writing | Only with `--review`: a one-time token in the printed URL, an Origin check, and writes to the working tree that nobody commits for you |
| Existing review machinery | `review: pending` stays the flag on curated pages; approving a review signs the pages of its target and `about` that wait, leaving `review: approved` and an `approval` record (v0.7). `## Review` from `yajna sync` stays as it is |
| Several things in one review | One target, one diff; `about` lists the experiments, runs and projects the review covers besides it (v0.7) |

## 3. The review page

```markdown
---
id: REV-20261026-q3k8vd
type: review
schema_version: 1
title: E1c baselines and explore
created: 2026-10-26
author: ank
project: PRJ-0005
target:
  kind: branch               # branch | range | page | run | experiment | phase
  ref: vesicle-protrusions-and-imaging/main
base: 84ce40f3b0c2e5d1a9f7c6b4e2d0a8f6c4b2e0d9    # full SHAs, resolved when opened
head: a1da1b4c7e9f2b8d6a4c2e0f8d6b4a2c0e8f6d4b
paths: [code/vesicle-protrusions-and-imaging, notes/projects/PRJ-0005-vesicle-protrusions-and-imaging]
status: open                 # open | changes_requested | approved | merged | closed
---

## Summary
What the changes do and the verdict, written by the reviewer.

## Threads

### T1 (open) code/vesicle-protrusions-and-imaging/vpi/explore.py:120-126 @ a1da1b4
```py
os.environ["OMP_NUM_THREADS"] = "32"
```
- 2026-10-26 14:02 ank: why a fixed 32 and not the cores the job was given?
- 2026-10-26 14:31 agent:claude-vpi addressed in 5e6f7a8: reads `SLURM_CPUS_PER_TASK`, 32 without it

### T2 (resolved) general
- 2026-10-26 14:05 ank: the run page should say the baselines were reused from the first attempt
- 2026-10-26 14:40 agent:claude-vpi addressed in 9b0c1d2: added to [[RUN-20261023-nvfv0n]]
- 2026-10-26 15:10 ank resolved
```

- **IDs** are date IDs (ADR-0022), so two branches never collide on one. The file is
  `REV-<date>-<suffix>-<slug of the title>.md`; `yajna new review` refuses and points at
  `yajna review open`.
- **Where.** A review of something in a project sits in that project's `reviews/`, so it
  graduates with it. A branch review is written into the branch's worktree (found through
  `git worktree list`) and merges with the branch. Reviews of anything else are written on
  the current branch.
- **`target`** is what was asked for. `base`, `head` and `paths` are what it resolved to,
  stored so that the review means the same thing later. `yajna review update` moves `head`.
- **A thread** is a level-3 heading `T<n> (<state>) <anchor>`. Its states are `open`,
  `addressed`, `resolved` and `outdated`. The anchor is `<path>:<from>-<to> @ <commit>`
  (or `<path>:<line> @ <commit>`), `<path>#<heading> @ <commit>` for a heading of a page,
  or `general`. The quoted lines under it are what the anchor pointed at when the thread
  was opened, in a fenced block (```` ``` ```` or `~~~`, whichever the lines do not
  contain), so links and headings in them are text.
- **Replies** are list items `- <date> <time> <author>: <text>`, appended and never edited,
  like the log. `<author> addressed in <sha>:` and `<author> resolved` / `reopened` are the
  state changes; the heading's state follows the last one. Links and `@citekeys` work in
  replies.
- **`## Summary`** is free text; a review with nothing to say leaves it empty.

`yajna validate` checks the frontmatter against `schema/review.json`, that threads parse,
that each state matches its last state change, that only an author without the `agent:`
prefix resolved a thread, and that `base`, `head` and the anchor commits exist, when the
repository's history is not shallow.

## 4. Targets

Every target resolves to a base commit, a head commit and a list of paths. The diff that
is reviewed is `git diff base head -- paths`. Resolution is shared with `yajna run diff`
(`reproduce.md`).

| Target | Given as | Base | Head | Paths |
|---|---|---|---|---|
| branch | a branch name, `--base` defaulting to `main` | merge base of the two | the branch tip | everything |
| range | `A..B` | A | B | everything, or `--paths` |
| page | any page ID | the commit of the last approved review of that page, else the one before the commit that created it | the current commit | the page and its directory |
| run | `RUN-…` | the `commit` of the previous run of the same experiment that records one, by `started` then `created`, else the one before the commit that created the experiment's page | the run's `commit` | the project's code, the run's page and its directory |
| experiment | `EXP-…` | the one before the commit that created the page | the last run's `commit`; the current commit while it is `planned` or `active`, or when no run records one | the project's code, the experiment's page and its directory |
| phase | `PRJ-… --phase "<words>"` | `(since <sha>)` in the item; else the commit that ticked the item before it in *Progress*; else the one before the project page was created | the commit that ticked it; the current commit while it is open | the project's code and notes |

- **The run directory postdates the run** for most runs: `run.sh` is committed after the
  code it ran (`reproduce.md` section 3). A run review therefore shows two diffs: the code
  between the two commits, and the two runs' scripts and pages as they are now.
- **A phase starts** with `yajna phase start PRJ-… "<item>"`, which appends
  `(since <short sha of HEAD>)` to the item's line. It is plain text in the page, so it
  survives merges and graduation (where it is remapped like any other commit). Without it,
  the base is inferred from when the previous item was ticked, found with `git log -S` on
  the item's line; overlapping phases make that approximate, which the review says.
- **"The one before the commit that created it"**: the parent of that commit, so the diff
  shows the page being added. (v0.2 said the creating commit itself, which hid it.)
- **The project's code** is the `code` field of its page when it is a path in this repo;
  `code: .` (a project repo) is the whole repo, and a `github:…` URL adds nothing.
- **A phase is named** by words from its item, matched without case against the items of
  *Progress*; more than one match lists them. The item's text, without `(since …)`, is
  stored as `target.phase` beside `ref: PRJ-…`. A run, an experiment or a phase whose base
  or head is a guess says how it was found in the page's `## Summary`.
- **Commits in the notebook are full SHAs** from now on. Short ones in older pages still
  resolve; an ambiguous one is an error that lists the candidates.

### 4.1 What a review is about (v0.7)

A review keeps one target, so one base, one head and one diff to settle. Work done on
main accumulates in one range (`HEAD..HEAD`, its head moved by `review update`), and that
range covers the runs, the experiment and the phase it was for; what is missing is the
record of them, not a second diff. `about: [EXP-…, RUN-…, PRJ-…]` is that record:

- given at `review open … --about <ID>…` or added with `yajna review about REV-… <ID>…`;
  each must be a page that exists;
- `review list --target <ID>` finds the reviews about a page as well as those of it, and
  the served view lists them in the overview;
- approving signs those of them that have `review: pending` (section 6).

Disjoint work (two branches, a run of last year beside today's feature) stays in separate
reviews: one approval should settle one diff.

**Reviewing the past.** Every target resolves from history, so a repo without reviews can
review what it already did: `review open <sha>..<sha> [--paths …] --about …` for a
feature, `PRJ-… --phase "<words>"` for a ticked phase (inferred bounds, said in the
Summary), an experiment or a run by ID. When the agent fixes what such a review raised,
`review update REV-… --to <commit>` moves the range's head forward to include the fixes,
refusing a commit that does not come after the current head, and writes the new end into
`target.ref` so a later `review update` stays there. A new review is for new work.

## 5. Anchors

A thread records the commit it was opened at, its path and lines, and the quoted lines.
When the head moves (`yajna review update`, or the diff view opened on a newer head), each
`open` and `addressed` thread is looked for in the new head:

1. the path, followed through renames (`git diff -M` from the thread's commit);
2. the lines it pointed at, read from the thread's commit (the quote in the page is a copy
   of them), exactly, then ignoring whitespace; the nearest match to the old line numbers
   wins. A heading anchor looks for the heading;
3. found: the anchor moves to the new commit and lines. Not found: the thread becomes
   `outdated` and keeps showing against its own commit.

Threads are never deleted. An `outdated` thread that still matters is answered or resolved
like any other. `update` moves a branch review's head to the branch tip, a range's to what
`B` names now, and re-resolves the other targets; the base stays.

## 6. Who does what

- **Opening** a review, commenting and replying: anyone, person or agent. An agent may
  review another agent's branch; ank's review is the one that merges it.
- **Addressing:** whoever made the fix appends `addressed in <sha>` with a line on what
  changed. The commit must be on the target's branch (or after the head, for other
  targets).
- **Resolving and approving:** a human. The rule mirrors curated pages, which only a human
  signs (`review: pending`). `yajna review approve` refuses while a thread is `open` or
  `addressed`, sets `status: approved`, and signs each page of its target (a page, run or
  experiment) and of `about` that has `review: pending`: the flag becomes `review:
  approved` with `approval: {by: <human>, on: <date>, in: REV-…}`. `yajna approve <ID>…`
  signs pages without a review, with no `in`. (v0.6 deleted the flag, which left no trace
  of who signed or how.) `yajna validate` holds `review: approved` to a record by a human,
  whose `in`, when given, is an approved or merged review of or about the page. `request-changes` (anyone, with a reason) sets
  `changes_requested`. Both append a dated line to `## Summary`
  (`- <date> <time> ank approved: <text>`), so the verdicts read in order.
- **Merging:** `yajna review merge REV-…`, run in the checkout of the branch it goes into
  (usually main), by a human. It refuses while a thread is `open` or `addressed` or the
  review is not `approved` (`--force` overrides and says so in the page); while the
  branch's worktree has uncommitted changes or the review page is not committed there,
  since only what is committed is merged; and when the branch does not validate, or does
  not validate against the branch it goes into (`--force` does not override these). It
  then merges with `--no-ff`, sets `status: merged` and `merge: <the branch tip merged>`
  in the page and adds a line to `## Summary`, all in the merge commit (`Merge branch
  '<branch>' (REV-…)`). A conflict aborts the merge. (v0.3 said `merge:` is the merge
  commit; a commit cannot name itself, and the merge is the commit whose second parent is
  the recorded tip.)
- **`validate --against`** notes the reviews of the current branch that are `open` or
  `changes_requested`, with how many threads are unsettled.
- **Agents** find what they owe with `yajna review todo`: `open` and `outdated` threads on
  reviews of the branch they are on, and on the other unfinished reviews in their checkout,
  oldest first, each with its last reply. The skill tells them to run it when they start
  and before they report a branch as done.
- **Agents put their changes under a review** (v0.6, from ank's first pass in the
  browser): one REV page per piece of work, opened before the first change
  (`review open HEAD..HEAD`, whose base stays where it was opened and whose head
  `review update` moves to each new commit, or the branch in a worktree), continued
  rather than duplicated, naming in its Summary the experiment, run or *Progress* item it
  serves. ank decides when a review is finished; the agent asks before it starts the next
  major piece of work under a new one.

## 7. Interfaces

All four write the same page; the CLI's code does the writing for the CLI and the server
alike.

### 7.1 CLI

```
yajna review open <branch | A..B | ID> [--base main] [--phase "<item>"] [--paths …]
yajna review list [--open] [--target <ref>]
yajna review show REV-… [--diff]                 # threads with their context, or the diff
yajna review comment REV-… [--at <path>:<from>[-<to>] | --at <path>#<heading>] "<text>"   # no --at: general
yajna review reply|address|resolve|reopen REV-… T<n> ["<text>"] [--commit <sha>]
yajna review approve|request-changes REV-… ["<text>"]
yajna review update REV-…                        # move head, re-anchor
yajna review merge REV-… [--force]
yajna review todo
yajna phase start PRJ-… "<item>"
```

### 7.2 The diff view in `yajna serve --review`

- `files/` gains a *reviews* list above the tree and a tab per review (`review:<ID>`): an
  overview (summary, verdict, every thread grouped by file, a general comment), then
  the changed files, each a side-by-side diff (`@codemirror/merge`, unchanged stretches
  collapsed) with its threads drawn under their lines. Reply, address, resolve, reopen,
  approve and request-changes are buttons that call the same code as the CLI commands.
- A new thread is started two ways: select lines on the right (or click a line number,
  shift-click for a range) and press the button that floats over them, which opens a box
  under those lines; or type in the comment box that stays at the top of the diff while it
  scrolls and applies to the lines picked. Toggles in the review's header hide the file
  list, the comment box and (Focus, Esc leaves) the viewer's top bar, sidebar and status
  line, and wrap long lines; they are remembered per browser.
- *Not in the review yet* lists, under the files, what differs between the review's head
  and the working tree of its checkout in the review's paths: later commits, uncommitted
  changes and untracked files, but not the page itself. Each opens as a read-only diff,
  head against the file on disk, re-read while it is open. Threads anchor to commits, so
  these lines cannot be commented on until they are committed and `review update` brings
  them in.
- Reading reviews is always on; writing only with `--review`. The server then prints
  `…/files/?token=<128 random bits>`; the page takes the token out of the address bar,
  keeps it in memory (a reload needs the printed URL again) and sends it as
  `X-Yajna-Token` with every `POST`, which must also carry an `Origin` naming the host it
  was sent to. The rest of the server stays read-only (ADR-0028). The viewer writes as
  the notebook's author (`$YAJNA_AUTHOR`, else `yajna.toml`).
- A write edits the REV page in the working tree of the right worktree and commits
  nothing. Each write carries the version of the page the viewer read; a page that changed
  since is refused with 409, the view reloads and keeps the unsent text. Writes from the
  viewer are serialised.
- An open review tab reads its review again every two seconds and redraws when the page
  changed, keeping what is being typed, so an agent's reply appears while ank reads.
  (v0.4 said over the SSE stream; a branch review lives in another worktree, outside the
  roots that stream watches.)
- `address` without a commit takes the branch's tip for a branch review, from the CLI and
  the viewer alike, and `HEAD` otherwise.
- `yajna-serve` knows HTTP and files, not the notebook (ADR-0027): the review routes take
  their handlers from the CLI crate through a trait, as the site renderer already does.
- The static site renders REV pages as pages, with the quoted lines but no diff.

### 7.3 Neovim

`:YajnaReview REV-…` opens the review's files in diff mode, base against head, with threads
as extmarks at their anchors and in the quickfix list. `:YajnaComment` on a visual
selection, `:YajnaReply`, `:YajnaResolve` call the CLI. Reading needs no binary, as for
links (Phase 0c); writing does.

### 7.4 By hand

The format in section 3 is the contract. A thread added by hand without a number or with
a malformed anchor fails validation with the line to fix.

## 8. What it does not do

- **Talk to GitHub.** No pull requests are created and none are read. An export to a PR
  could come later; the notebook stays the record.
- **Apply suggestions.** A comment can carry a suggested change as a fenced diff; applying
  it is the addressing author's work.
- **Notify.** Agents ask with `review todo`; ank sees open reviews in `review list --open`
  and the served view. Notifications wait for Phase 3.
- **Permissions.** One human and agents (ADR-0008): the only distinction is the `agent:`
  prefix.

## 9. Build order

| Step | Build | Verify |
|---|---|---|
| 1 | `schema/review.json`, the template, thread parsing and validation; `review open`, `comment`, `reply`, `address`, `resolve`, `reopen`, `show`, `list` for branch, range and page targets | Integration tests on a scratch vault with two branches: open, comment, address on the branch, resolve; validation rejects an agent resolving |
| 2 | Run, experiment and phase targets; `phase start`; `review update` and re-anchoring | Tests for each target on a scratch history, including a renamed file and a deleted hunk becoming `outdated` |
| 3 | `review approve`, `request-changes`, `merge`; the warning in `validate --against`; `review todo`; the skill and conventions | A scratch branch merged through `review merge`, refused first while a thread is open |
| 4 | `serve --review`: token, routes, the diff tab, threads, live updates | By hand on a manthan branch; route tests for the token, Origin and the refused concurrent write |
| 5 | Neovim: `:YajnaReview`, the comment commands | Headless tests in `checks.yajna-nvim` |

## 10. Risks

- **Two writers on one page.** An agent replying from its worktree while ank comments from
  the browser; the re-read before writing refuses one of them rather than losing it.
- **Reviews as noise.** Every agent branch gaining a REV page grows the notebook. If it
  does, small reviews can stay `general`-only and short; the page is still the record.
- **Inference for phases** is approximate when items overlap; `phase start` is the fix,
  and the review states which base it used.
- **Bundle size.** `@codemirror/merge` adds to the files bundle; measured against
  `EXP-20261023-kjv5wy`'s numbers.

## 11. Verification

ank reviews a real agent branch in manthan end to end: comments from the browser and from
Neovim, the agent addresses them from the CLI on its branch, ank resolves and approves, and
`review merge` brings it into main. A run of PRJ-0005 is reviewed against the run before
it, and a phase of this project from its `(since …)`.
