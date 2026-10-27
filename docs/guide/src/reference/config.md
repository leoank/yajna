# yajna.toml

The file at the root of a notebook. Its presence is what makes a directory a notebook; every
command looks for the nearest one upwards from where it is run. `yajna init` writes it.

```toml
shape = "lab"                           # lab | project
namespace = "mylab"                     # this notebook's name in links from others
author = "ada"                          # your handle, the default author
vault = "notes"                         # the directory that holds the pages
timezone = "Europe/London"              # for log times and dates
bibliography = "references/library.bib" # the BibTeX file citations are checked against

[repos]                                 # other notebooks this one links to
rc2s2 = "github:leoank/rc2s2"
yajna = { url = "github:leoank/yajna", path = "../yajna/main" }

[docs]                                  # directories outside the vault that hold doc pages
dirs = ["thesis"]

[sync]                                  # Google Docs
folder = "1AbCdEfGhIjKlMnOpQrStUvWxYz"  # the root folder in Drive (default: one yajna makes)
site_url = "https://you.github.io/notebook"

[files]                                 # what `yajna serve` shows of the disk
exclude = ["node_modules"]              # in every root, on top of .git

[[files.roots]]
name = "scratch"
path = "/scratch/$USER/runs"            # in or out of the repo; ~ and $VARS expanded
```

## Top level

`yajna init` writes every key. *If missing* is what the CLI assumes when a key is left out.

| Key | `init` writes | If missing | Meaning |
|-----|---------------|------------|---------|
| `shape` | `lab` or `project` | `lab` | `lab` for a whole notebook with many projects; `project` for one project's notebook inside its code repository. See [The notebook](../concepts/notebook.md). |
| `namespace` | the directory name, or `--namespace` | none | How other notebooks refer to this one: `[[mylab/PRO-0012]]`. Needed by `graduate` and `worktree` in a project repository. |
| `author` | `$USER`, or `--author` | `unknown` | Your handle: lowercase letters, digits, `-`, `_`. The author of everything you create, unless `YAJNA_AUTHOR`, `.yajna/author` or `--author` says otherwise. Your log file for a day is `<date>.md`; other authors get `<date>.<author>.md`. |
| `vault` | `notes` | `notes` | The directory, relative to this file, that holds the pages. |
| `timezone` | the system's | `UTC` | An IANA time zone. Log lines, `created` dates and run times are written in it; IDs use UTC. |
| `bibliography` | `references/library.bib` (lab), `notes/references/library.bib` (project) | the same | The BibTeX file `@citekey` citations must resolve in. |

## `[repos]`

One entry per notebook this one links to, by namespace. The value is where it lives, or a
table with where it lives and where it is checked out:

```toml
[repos]
rc2s2 = "github:leoank/rc2s2"
yajna = { url = "github:leoank/yajna", path = "../yajna/main" }
```

A link `[[ns/ID]]` fails validation when `ns` is not listed. The target ID is checked, and
the Neovim plugin can follow it, only when `path` is given and exists on disk.

## `[docs]`

| Key | Meaning |
|-----|---------|
| `dirs` | Top-level directories outside the vault whose doc pages belong to the notebook. `yajna new doc --dir` adds to it. Only files with a yajna `id` and `type` there are pages. |

## `[sync]`

| Key | Meaning |
|-----|---------|
| `folder` | The ID of the Google Drive folder that is the root of the synced docs, which mirror the notebook's folders below it. Without it, yajna creates a folder named after the `namespace` in My Drive on the first sync and finds it again from then on. |
| `site_url` | The base URL of a published [static site](../guides/site.md). Links in a Google Doc to pages that are not synced point there; without it they are plain text. |

See [Docs and Google Docs](../guides/docs-and-sync.md).

## `[files]`

The directories the files viewer of `yajna serve` shows, live, from the disk of the machine
it runs on (ADR-0028). Without the table it shows the vault, as `notes`, and `code/`, as
`code`; in a `project` repo the second is the repository itself, named after the
namespace, with the vault left out.

| Key | Meaning |
|-----|---------|
| `exclude` | Names or globs hidden in every root, on top of `.git`, which always is. A pattern without `/` matches a file or directory name anywhere (`*.ckpt`); one with `/` matches the path below the root (`data/raw`), and a leading `/` anchors it (`/notes`). Nothing reads `.gitignore`. |
| `[[files.roots]]` | One table per root, replacing the default ones. |
| `name` | The first part of every path in the viewer (`scratch/run-17/train.log`): letters, digits, `.`, `_` and `-`. |
| `path` | Relative to the repository or absolute; `~` and `$VARS` are expanded, and a root whose variable is unset or whose directory is missing shows as missing rather than as an error, so one `yajna.toml` serves machines with different mounts. |
| `exclude` | More patterns for this root only. |
| `watch` | `auto` (the default), `poll` or `off`: how changes reach the viewer. |

Symlinks are followed, out of a root too; a link back to a directory above it is shown as
a loop and not entered. `yajna validate` checks names, patterns and `watch`; paths are not
checked, because they differ per machine.

## Other files yajna reads and writes

| Path | What |
|------|------|
| `notes/counters.yaml` | The next number for each counter prefix (`PRJ`, `PRO`, `MAT`, `EQP`, `BLD`). Written by the CLI; never edit it by hand. |
| `notes/exports.tsv` | One row per ELN export; the next export starts from the last. Commit it. |
| `.yajna/author` | The author for this worktree, written by `yajna worktree`. Not committed. |
| `.claude/skills/yajna/SKILL.md` | The agent skill, written by `yajna init` and `yajna skill`. |
| `~/.cache/yajna/` | The index, the site and ELN bundles. Safe to delete. |
| `~/.config/yajna/gdoc.json` | The Google refresh token from `yajna sync login`. A secret. |
| `~/.config/yajna/config.toml` | The user config, below. Never written by yajna. |
| `~/.local/state/yajna/repos.toml` | Every notebook yajna has run in, by namespace and main checkout. `yajna repos forget <name>` drops one. |
| `~/.local/state/yajna/tasks.json` | The last `yajna tasks` listing, for `yajna todo done <n>`. |

## The user config

`~/.config/yajna/config.toml` (`$XDG_CONFIG_HOME/yajna/config.toml`) is per user, not per
repo, and lets `yajna log`, `todo` and `tasks` reach any notebook with `--in` (ADR-0032).
yajna only reads it, so it can come from a home-manager module.

```toml
author = "ank"          # the human handle when a notebook names none
default = "manthan"     # where entries go outside any notebook
editor = "nvim"         # for -e, after $VISUAL and $EDITOR

[repos]                 # pinned notebooks; they win over the ones yajna recorded
manthan = "~/workspace/chaos/manthan/main"
rc2s2 = { path = "~/workspace/hub/leoank/rc2s2" }
```

Every notebook yajna runs in is also recorded by namespace in the state file above; when
two checkouts share a namespace, the first recorded is used and the other named in a note
until one is pinned here.
