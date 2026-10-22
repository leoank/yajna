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
folder = "1AbCdEfGhIjKlMnOpQrStUvWxYz"  # Drive folder new docs are created in
site_url = "https://you.github.io/notebook"
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
| `folder` | The ID of the Google Drive folder that new docs are created in. Without it they go to the root of My Drive. |
| `site_url` | The base URL of a published [static site](../guides/site.md). Links in a Google Doc to pages that are not synced point there; without it they are plain text. |

See [Docs and Google Docs](../guides/docs-and-sync.md).

## Other files yajna reads and writes

| Path | What |
|------|------|
| `notes/counters.yaml` | The next number for each counter prefix (`PRJ`, `PRO`, `MAT`, `EQP`, `BLD`). Written by the CLI; never edit it by hand. |
| `notes/exports.tsv` | One row per ELN export; the next export starts from the last. Commit it. |
| `.yajna/author` | The author for this worktree, written by `yajna worktree`. Not committed. |
| `.claude/skills/yajna/SKILL.md` | The agent skill, written by `yajna init` and `yajna skill`. |
| `~/.cache/yajna/` | The index, the site and ELN bundles. Safe to delete. |
| `~/.config/yajna/gdoc.json` | The Google refresh token from `yajna sync login`. A secret. |
