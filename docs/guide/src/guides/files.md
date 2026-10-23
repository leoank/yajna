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
