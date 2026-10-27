# Todos and log lines from anywhere

Status: design v0.1, 2026-10-27; nothing built. Decision: ADR-0032.

## 1. What it is for

A thought about a project arrives wherever ank happens to be: in another repo, in `~`, in
a shell on a server. `yajna log` writes to the notebook found by walking up from the
current directory, or to `--root <path>`; loose todos live in each notebook's
`notes/tasks.md`, and no command adds one. So the thought either waits for a `cd` and an
editor, or is lost.

This adds three things: a per-user registry of the labs and projects on the machine, so a
notebook can be named rather than found; `--in <target>` on `log`, the new `todo` and
`tasks`; and `-e`, which opens an editor to write the entries in.

```sh
yajna log --in manthan/vesicle "re-imaged scene 3, the drift is gone"
yajna todo --in manthan "order agarose" --due fri -p 1
yajna todo --in rc2s2 -e
yajna tasks --all
yajna todo done 3
```

## 2. Decisions at a glance

| Question | Decision |
|---|---|
| Naming a target | `--in <repo>[/<project>]`: a repo by its namespace, a project by ID or slug prefix; without it, the repo you are in, else `default` from the config, else a picker; `--pick` always asks |
| The registry | `~/.config/yajna/config.toml`, by hand or from neusis, never written by yajna; `~/.local/state/yajna/repos.toml`, written by yajna; the config wins |
| A project in a lab | Lab files, tagged: log lines start with `[[PRJ-…]]` in the lab's daily log; todos go under a `## PRJ-… <title>` heading of the lab's `tasks.md` |
| Which checkout | The lab's main checkout, on its default branch, never a project's worktree |
| Git | Into another repo: a local commit of only the touched file, unless it already had uncommitted changes; into the repo you are in: left uncommitted, as today. Never a push |
| `-e` | A scratch buffer; each paragraph becomes one entry; empty aborts |
| Todo syntax | todo.txt tokens in the line: `due:2026-11-02`, `p:1`; `done:2026-10-27` when ticked |
| Ticking | `yajna todo done <n>` ticks item *n* of the last listing, if its line is unchanged; with words or nothing, a picker |

## 3. The registry

```toml
# ~/.config/yajna/config.toml (or $XDG_CONFIG_HOME/yajna/config.toml)
author = "ank"                 # the human handle when a repo does not say
default = "manthan"            # the target outside any repo
editor = "nvim"                # after $VISUAL and $EDITOR

[repos]                        # pinned by hand; wins over what yajna has seen
manthan = "~/workspace/chaos/manthan/main"
rc2s2 = { path = "~/workspace/hub/leoank/rc2s2" }
```

```toml
# ~/.local/state/yajna/repos.toml (or $XDG_STATE_HOME/yajna/repos.toml), written by yajna
[repos.manthan]
path = "/Users/ank/workspace/chaos/manthan/main"
shape = "lab"
seen = 2026-10-27T09:12:00Z
```

- **The config is never written by yajna**, so it can be a read-only file from neusis.
  Everything yajna learns goes in the state file.
- **A repo is recorded** under its `namespace` from `yajna.toml` whenever yajna runs in it
  (once per new or moved path, so it costs nothing), and by `init`, `graduate` (both
  repos) and `worktree`. A worktree records the lab's main checkout, not itself.
- **A recorded path that no longer has a `yajna.toml`** is dropped at lookup, with a note.
  Two paths with one namespace (two clones): the config's wins, else the one seen last,
  and the other is named in a warning.
- `yajna repos` lists the merged registry with the source of each entry; `yajna repos
  forget <name>` removes a state entry.

## 4. Targets

`--in` takes:

| Form | Means |
|---|---|
| `manthan` | the lab or project repo with that namespace |
| `manthan/PRJ-0005` | that project in the lab |
| `manthan/vesicle` | the project whose slug starts with `vesicle`; ambiguous prefixes list the candidates |
| `PRJ-0005`, `vesicle` | a project in the repo you are in, else in `default` |

- **A moved project** follows its page: `manthan/PRJ-0002` has `status: moved` and
  `continued_in: rc2s2/PRJ-0001`, so the entry goes to `rc2s2` if it is registered, and
  is refused with that name if not.
- **In a project repo** the project is the repo: `rc2s2/PRJ-0001` and `rc2s2` are the same
  target, and no tag is added.
- **Without `--in`**: the repo containing the current directory; outside any repo,
  `default`; without one, a picker in a terminal (repos, then the lab itself or one of its
  active projects) and an error in a pipe. `--pick` asks even when one of these applies.
- **The checkout** is the main one: in a lab with worktrees, the worktree on the default
  branch (`origin/HEAD`, else `main`), found with `git worktree list`. A lab whose main
  checkout is not on disk is an error naming it. Notes never land on a branch that might
  not merge.
- **The author** is `$YAJNA_AUTHOR`, else the target's `yajna.toml`, else the config's;
  never a worktree's agent handle, since the line is written in the main checkout.

## 5. Log lines

```
yajna log [--in <target>] [-e] [--date …] [--time …] [text…]
```

The same command as today with a target. For a project in a lab the line is
`- 14:02 [[PRJ-0005]] re-imaged scene 3, …` in the lab's daily log for that author, which
`timeline` and `show` already count as a mention. Without text and without `-e` it prompts
or reads stdin, as now.

## 6. Todos

```
yajna todo [--in <target>] [-e] [--due <when>] [-p <1-3>] [text…]
yajna todo done [<n> | <words>…]
yajna tasks [--in <target> | --all] [--done]
```

- **Where**: the target's `notes/tasks.md` (its vault directory, from `yajna.toml`). A lab
  todo goes at the end of the list before the first heading; a project's under
  `## PRJ-0005 Vesicle protrusions and imaging`, created at the end of the file the first
  time, the new item appended to that section.
- **Tokens**: `due:YYYY-MM-DD` and `p:1` (highest) to `p:3`, at the end of the line,
  written by `--due` and `-p` or typed. `--due` takes a date, `today`, `tomorrow`, a
  weekday (the next one), `+3d` or `+2w`, in the notebook's timezone.
- **Listing**: `yajna tasks` numbers what it shows, sorts overdue first, then by priority,
  due date and file order, and marks overdue items. `--in` limits it to a repo or project
  (a project's items are those under its heading plus the checkboxes in its pages);
  `--all` covers every registered repo.
- **Ticking**: `tasks` saves its listing in the state directory, each item with its repo,
  file, line and text. `todo done 3` ticks item 3 if that line is unchanged, adding
  `done:<date>`, and asks for a fresh listing otherwise. `todo done agarose` ticks the one
  open item matching the words, or offers a picker when several do; `todo done` alone is
  a picker. Items in pages tick the same way.
- **Validation**: a `## PRJ-…` heading in `tasks.md` must name a project of the repo, and
  the tokens must parse.
- **Graduation** moves a project's section of the lab's `tasks.md` into the new repo's,
  and leaves a line in the lab pointing at it.

## 7. `-e`

`-e` opens `$VISUAL`, else `$EDITOR`, else `editor` from the config, else `nvim`, else `vi`,
on a scratch `.md` file in the state directory:

```markdown
<!-- yajna todo → manthan/PRJ-0005 (Vesicle protrusions and imaging), 2026-10-27, ank
     One todo per paragraph; due:YYYY-MM-DD and p:1-3 work in the text.
     Link with [[ID]]. Save and quit to add; leave it empty to cancel. -->

```

On exit the comment is stripped and each non-empty paragraph becomes one entry, its lines
joined with spaces: one log line, or one todo. `--due` and `-p` apply to every todo
written. An empty file, or a non-zero exit from the editor, adds nothing. The scratch file
is removed after a successful write and kept, with its path printed, when the write fails.

## 8. Git

- **Into another repo** (the target's checkout does not contain the current directory):
  after writing, `git commit --only <file>` in that checkout, with the subject
  `docs(notes): log`, `docs(notes): todo` or `docs(notes): todo done`. Only that file is
  committed; whatever else is uncommitted there stays. If the file already had uncommitted
  changes before the write, nothing is committed and the reply says so.
- **Into the repo you are in**: the line is left uncommitted, as `yajna log` does today.
- **Never a push.**

## 9. What it does not do

- Recurring todos, reminders, notifications.
- Sync todos anywhere but git.
- Write into a project's worktree branch.
- Reach a notebook on another machine; that is `ssh host yajna log --in …`.

## 10. Build order

| Step | Build | Verify |
|---|---|---|
| 1 | The config and state files, recording repos, `yajna repos`, target resolution with `--in`, `--pick`, moved projects and the main checkout | Integration tests with a scratch `XDG_CONFIG_HOME` and `XDG_STATE_HOME`, a lab with a worktree, a graduated project |
| 2 | `log --in`, the project tag, the commit of one file | A log line into a scratch lab from outside it, committed alone beside an unrelated dirty file |
| 3 | `todo`, the tokens, `--due` parsing, project sections, validation | Tests for each `--due` form and for section creation |
| 4 | `tasks --in`/`--all`, sorting, the saved listing, `todo done` | Ticking by number, refused after the line changed; by words |
| 5 | `-e` | The editor replaced by a script in tests |
| 6 | `graduate` moves the project's todos; the skill and conventions | The graduate integration test |

## 11. Risks

- **Committing in a tree someone else is working in.** `--only` keeps their work out of the
  commit, but the commit still moves their branch under them; the main checkout is usually
  idle while agents work in worktrees.
- **A registry that lies.** Paths move; dropping missing paths and warning on duplicates
  keeps it honest, and the config can pin what matters.
