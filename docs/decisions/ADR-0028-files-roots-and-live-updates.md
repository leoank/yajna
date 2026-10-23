# ADR-0028: The files viewer shows named roots on disk, live

Status: accepted
Date: 2026-10-23
Phase: 1c
Source: `docs/files-viewer.md` sections 4 and 5

## Context

The viewer exists to look at what runs produce (ADR-0027). That output is often not in git
(ignored, or too large), sometimes not in the repo at all (scratch storage), and changes
while it is being looked at. Directories can hold hundreds of thousands of entries and
files can be gigabytes.

## Decision

- **Named roots.** `[[files.roots]]` in `yajna.toml` lists the directories shown, each with
  a `name` and a `path`, which may be relative to the repo or absolute, with `~` and
  `$VARS` expanded. Paths in the viewer start with the root's name. Without a `[files]`
  table the roots are the vault and `code/` (in a `project` repo, the repository root with
  the vault excluded).
- **Everything on disk, minus excludes.** `.git` is always excluded; `exclude` patterns,
  global and per root, add to it. `.gitignore` is not read, because ignored files are
  usually what a run produced.
- **Symlinks are followed**, out of a root too, so data linked from a project directory is
  browsable. A path in a request can only walk down from a root (`..` is rejected), and
  loops are detected by device and inode.
- **Lazy listing.** One directory per request, sorted with directories first, in pages of
  500 entries.
- **Live.** The server watches, non-recursively, only the directories and files that
  clients have open, with `notify`, and pushes debounced changes over SSE. On network
  filesystems, where events from other machines do not arrive, and with `watch = "poll"`,
  it polls size and mtime every 2 s instead; `watch = "off"` leaves a refresh button.
- **Read-only.** The API has no route that writes.

## Consequences

- A root whose path does not exist on a machine is shown as missing, not an error, so one
  `yajna.toml` serves a laptop and a server with different mounts.
- A symlink can expose a directory the roots do not name; that is the point, and the
  loopback-only server (ADR-0027) is what keeps it private.
- Whether watching and listing hold at the scale of real runs is tested by
  `EXP-20261023-kjtrwp` and `EXP-20261023-kjtach` before step 4 is built on them.
