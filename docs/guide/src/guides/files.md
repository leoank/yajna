# Files

`yajna serve` shows more than the notebook's pages: *Files* in the app's sidebar shows the
directories on the disk of the machine it runs on, live. It is meant for watching work
happen where it runs: the code, the notes, and what runs and agents write, without opening
a shell on that machine, from a laptop or a phone.

```sh
yajna serve --open        # then Files in the sidebar, or open /files
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

- **Roots** are listed first; a directory lists its entries, 500 at a time with *More*,
  directories first, and the breadcrumb above goes back up.
- **A file** opens by what it is: markdown rendered as the site renders pages,
  `[[links]]` and citations included; images fitted to the width; videos (`.mp4`, `.m4v`,
  `.webm`, `.mov`, `.ogv`) in a player that seeks; text and code highlighted with line
  numbers; anything else as its size and type with a download link.
- **In markdown**, an image whose file is a video (`clip.mp4` in image syntax, the
  caption as its alt text) is a video player, and an animated GIF plays as an image. A ` ```mermaid ` block is drawn as a diagram, following light and dark; one
  that does not parse keeps its source, with the error under it. The diagram library is
  loaded only when a page has one.
  *Raw* downloads any file. Raw HTML in a markdown file, and HTML or SVG files, are shown,
  never run.
- **Addresses** name the file, `/files/code/g2a/train.py`, so a link can be pasted into a
  log line or a message. Links made for the previous viewer (`files/#…`) still open.
- Pages link the paths in their fields (a run's `script`, a project's `code`, an
  artifact's `path`) here.

## Live

What is open stays current while runs write, with *live* beside the file's size. A log
(`.log`, `.out`, `.err`, `.jsonl`) opens at its end and follows as lines arrive, fetching
only the new bytes, as long as you stay at the end; any file follows while you are at its
end. A text file over 4 MB opens at its last megabyte, followed the same way; *Raw* has the
whole file. A plot that is rewritten is drawn again; rendered markdown is rendered again;
a directory shows new and deleted entries as they come and go.

Changes arrive in about a quarter of a second where the filesystem reports them, and
within a second or two where it does not: network storage (NFS, Lustre, SMB, GPFS and the
like) is polled, and so is any root with `watch = "poll"`; a root with `watch = "off"` is
read when opened.

## The web app

`yajna serve` serves one app for the whole notebook (ADR-0041): the overview of projects
with their phases, every page with its fields, body, children and what links to it, the
log, the tasks, the reviews, what is changed in each worktree, and the files. It is the
same on a phone, where the sidebar becomes a menu, and keeps what it last showed while it
asks the server again, so a slow connection shows a page at once and a quiet
*Reconnecting…* when the server cannot be reached. The worktree picker at the top of the
sidebar shows the same screen in another worktree. The static pages `yajna site` writes
are still served at `/<ID>.html`.

**Search** is the box under the worktree picker; `/` or ⌘K (Ctrl-K) goes to it. It
answers as you type with the best few pages, and Enter, or *Everything with …*, opens the
search screen (`/search?q=…`, the search icon on a phone): every page with all the words
in its ID, title, tags or text, an ID or a title that matches best first, each with the
passage where the words are, then the log lines that have them, newest first. Case does
not matter.

## Git changes

`yajna serve` also says what is uncommitted, staged and recently committed in the git
worktree a root is in, read-only (ADR-0038): `GET /api/git/status?path=notes` lists the
changed, staged, untracked and conflicted files, `/api/git/log` the commits with their
files, `/api/git/diff?path=<file>&from=HEAD&to=WORK` one file's unified diff (`INDEX`
between them for what is staged, a commit with `^` for its parent), and `/api/git/file`
a file as it was. Each change carries the path a root shows it at, so it opens in the
viewer.

The same is a view in the app, *Changes* in the sidebar: the worktrees with what is
uncommitted in each, then one worktree's staged, changed and untracked files and its
recent commits, then a file's diff in one column, from which *Open* shows the whole file.
It keeps itself current every few seconds, so an agent's work shows up as it lands. On
the socket, or with `yajna serve --review` and the link it prints, it also stages and
unstages a file or a single hunk and commits what is staged (ADR-0040): only what you were
shown, so a hunk the agent changed meanwhile is refused rather than staged unseen, and a
pre-commit hook that refuses says why. Tap a line of a diff, then another, to comment on them: the
comment becomes a thread on the worktree's review (one is opened for an agent's branch when
there is none), anchored `@ work` when the lines are not committed yet, so the agent finds
it and `review update` moves it to the commit that takes them.

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
