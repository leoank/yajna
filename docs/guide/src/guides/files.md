# The files viewer

`yajna serve` shows more than the notebook's pages: under *files* it shows the directories
on the disk of the machine it runs on, live, in a viewer laid out like a code editor. It
is meant for watching work happen where it runs: the code, the notes, and what runs and
agents write, without opening a shell on that machine.

```sh
yajna serve --open        # then follow "files" in the site's navigation, or open /files/
```

From another machine, tunnel to it as for [the site](site.md#from-another-machine).

## What it shows

By default the vault, as `notes`, and `code/`, as `code`; in a `project` repository, the
vault and the repository itself. Directories elsewhere, such as the scratch storage a
cluster job writes to, are added as roots in `yajna.toml`:

```toml
[files]
exclude = ["node_modules"]

[[files.roots]]
name = "scratch"
path = "/scratch/$USER/runs"
```

Everything on disk is shown except `.git` and what `exclude` names; `.gitignore` is not
read, because ignored files are usually what a run produced. Symlinks are followed. See
[yajna.toml](../reference/config.md#files) for every key.

## Using it

- **The tree** lists each root; directories open as you expand them, 500 entries at a
  time. The box above it filters what is loaded by name.
- **A click** opens a file in a *preview* tab, shown in italics, which the next click
  replaces. **A double click**, or clicking into the file, keeps the tab.
- **Split** by dragging a tab to an edge of the editor area, with the button at the right
  of a group's tabs, or with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>\</kbd>.
- **Links to lines**: clicking a line number selects the line, shift-clicking another
  selects the range, and the address bar then holds a link such as
  `/files/#code/g2a/train.py:L12-30` to paste into a log line or a message.
- The tabs and splits are remembered per notebook in the browser.

## Live

What is open stays current while runs write. A log opened in the viewer starts at its end
and follows as lines arrive, as long as you have not scrolled up; a plot that is
rewritten is redrawn at the same zoom; rendered markdown is rendered again in place. A
new file appears in an expanded directory and a deleted one disappears, without closing
what is expanded below it. A tab not in view that changed gets a dot, and a file deleted
on disk is struck through in its tab.

Changes arrive in about a quarter of a second where the filesystem reports them, and
within a second or two where it does not: network storage (NFS, Lustre, SMB, GPFS and the
like) is polled, and so is any root with `watch = "poll"`. The status line says which:
*live*, *live, polled every 2 s*, or *not live* for a root with `watch = "off"`.

## Viewers

| Files | Shown as |
|---|---|
| Text and code | Highlighted, with line numbers, search (<kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>F</kbd>) and folding. Files over 20 MB show their first 256 KB for now |
| Markdown | Rendered as the site renders pages, `[[links]]` and citations included; **Source** shows the text. A page with an ID links to its page on the site |
| Images (PNG, JPEG, GIF, WebP, AVIF, BMP, SVG) | Fitted to the tab; the wheel zooms, dragging pans, **1:1** shows actual pixels |
| Anything else | Size, date and type, a download link, and a look inside as text or hex |

Raw HTML in a markdown file, and HTML or SVG files opened on their own, are shown, never
run.

Pages on the site link the paths in their frontmatter (a run's `script`, a project's
`code`, an artifact's `path`) into the viewer when the site is served.

## Git changes

`yajna serve` also says what is uncommitted, staged and recently committed in the git
worktree a root is in, read-only (ADR-0038): `GET /api/git/status?path=notes` lists the
changed, staged, untracked and conflicted files, `/api/git/log` the commits with their
files, `/api/git/diff?path=<file>&from=HEAD&to=WORK` one file's unified diff (`INDEX`
between them for what is staged, a commit with `^` for its parent), and `/api/git/file`
a file as it was. Each change carries the path a root shows it at, so it opens in the
viewer.

The same is a view in the browser. *Changes* at the top of the sidebar opens it in a tab,
and `/files/changes` is a page of its own made for a phone: the worktrees with what is
uncommitted in each, then one worktree's staged, changed and untracked files and its
recent commits, then a file's diff in one column, from which *Open* shows the whole file.
It keeps itself current every few seconds, so an agent's work shows up as it lands. When
the notebook has several worktrees, a picker in the top bar opens another one's viewer.

## Every worktree

A notebook in several git worktrees, as a lab is when agents work on branches of their
own, is served whole: `yajna serve` started in one checkout serves every worktree of it
under `/w/<branch>/`, its site, files, reviews and git changes, the branch's `/` written
`%2F` (`http://localhost:8765/w/lab%2Ftopic/files/`). The checkout it was started in stays
at `/` too. `GET /api/worktrees` lists them with how many files are changed, staged and
untracked in each; a worktree added or removed shows within a few seconds, and is opened
only when asked for. `[serve] worktrees = "this"` in `yajna.toml` serves the one checkout
only.

## Every notebook on one socket

`yajna serve --socket <path>` serves every notebook in your registry (the ones pinned in
`~/.config/yajna/config.toml` and the ones yajna has run in, as `yajna repos` lists them)
from one server on a unix socket that only you can open, for another program to reach
them: saarthi's node relays your phone to it (ADR-0036). `GET /api/notebooks` lists them,
and each is served under `/n/<namespace>/` as `yajna serve` serves one at `/`: its site,
`files/` and the API. It runs from any directory, needs no `--review` token for writing to
reviews, since the socket is yours alone, and renders every site in the background from the
start. A notebook that cannot be opened is left out with a note. Each notebook's entry in
`/api/notebooks` lists its worktrees too, served under `/n/<namespace>/w/<branch>/`.

```console
$ yajna serve --socket ~/.local/state/yajna/serve.sock
```
