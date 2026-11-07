# Neovim

`yajna.nvim` follows links in a notebook from Neovim, and shows and comments on reviews.
It is pure Lua. Following links needs neither the `yajna` binary nor an index: pages are
found by their file names, which the conventions fix. Reviews read git, and write through
the CLI.

## Install

From the flake, as `packages.yajna-nvim` (a `vimUtils.buildVimPlugin`), for example in
home-manager:

```nix
programs.neovim.plugins = [ inputs.yajna.packages.${pkgs.system}.yajna-nvim ];
```

Or point a plugin manager at the plugin's directory in a checkout of the repository. With
lazy.nvim:

```lua
{ dir = "~/src/yajna/tools/yajna.nvim" }
```

## Use

In any markdown buffer under a directory with a `yajna.toml`:

| Key | Does |
|-----|------|
| `gf`, `<C-]>` | Follow the link under the cursor: `[[EXP-…]]`, `[[PRO-0012@3\|label]]`, `[[rc2s2/EXP-…]]` (through the `path` of that namespace in `[repos]`), or `@citekey` (its reading note, else its entry in the bibliography). Anywhere else, the usual `gf`. |
| `<localleader>yf` | Pick a page by ID or title (`vim.ui.select`) |
| `<localleader>yb` | Pages that link to this one, in the quickfix list |

The same as commands: `:YajnaFollow`, `:YajnaFind`, `:YajnaBacklinks`. Go back with
`<C-o>` as usual. Set `vim.g.yajna_no_keymaps = true` to keep the commands without the
mappings.

## Reviews

`:YajnaReview REV-…` opens a review (`docs/review.md`) in a new tab. Without an ID it takes
the REV page in the current buffer, else offers the notebook's reviews to pick from. The tab
holds an overview: the title, status, target, base and head, the summary, the changed files
and every thread with its replies. The threads also go into the quickfix list.

In the overview, `<CR>` on a file opens its diff in a new tab, base on the left and head on
the right, both read-only and read from git (`yajna://<commit>…` buffers). `<CR>` on a
thread opens the diff at its lines, or the file at the thread's own commit when it is
outdated or on a fix. `c` starts a general thread, `r` replies to the thread under the
cursor, `R` resolves it, `u` reads the page again and `q` closes the tab.

In a diff, each thread shows as a sign on its lines (`T1`, then `│`) with its replies below
them:

| Key | Does |
|-----|------|
| `<localleader>yc` | Start a thread on the cursor line, or on the selected lines in visual mode |
| `<localleader>yr` | Reply to the thread under the cursor |
| `<localleader>yR` | Resolve the thread under the cursor |
| `]t`, `[t` | Next or previous thread |

Or the commands `:YajnaComment [text]` (with a range), `:YajnaReply [T<n>] [text]` and
`:YajnaResolve [T<n>] [text]`, which ask for the text when it is not given. Comments go on
the head side: on the base side the plugin refuses, since the lines are anchored where they
are now. A file opened at a fix's commit takes comments anchored at that commit.

Reading a review needs only git. Writing calls `yajna review comment|reply|resolve`, so the
CLI keeps the page's format and its rules; set `vim.g.yajna_cmd = { "path/to/yajna" }` when
`yajna` is not on `PATH`. Writes go in as the person at the editor: the checkout's author,
unless that is an agent's (`YAJNA_AUTHOR` or `.yajna/author` in an agent's worktree), then
the notebook's `author`, as in the files viewer. Each write re-reads the page and redraws
the threads, and nothing is committed.

Creating pages is still the CLI's job: `:!yajna new experiment "..." --project PRJ-0001`,
or a terminal beside the editor.
