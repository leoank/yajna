# yajna.nvim

Follow links in a yajna vault from Neovim, and read and comment on reviews. Pure Lua; links
need no `yajna` binary, since pages are
found by their filenames, which the conventions fix (`EXP-20261019-j4xp01-slug.md`,
`projects/PRJ-0001-slug/README.md`, `notes/README.md` in a project-shaped repo).

In any markdown buffer under a directory with `yajna.toml`:

| Key | Does |
|-----|------|
| `gf`, `<C-]>` | follow `[[EXP-0007]]`, `[[PRO-0012@3\|label]]`, `[[rc2s2/EXP-0003]]` (through `[repos]` `path`), or `@citekey` (reading note, else the entry in the bibliography); native `gf` otherwise |
| `<localleader>yf` | pick an entity by ID or title (`vim.ui.select`) |
| `<localleader>yb` | backlinks to the current page in the quickfix list |

Commands: `:YajnaFollow`, `:YajnaFind`, `:YajnaBacklinks`. Go back with `<C-o>` as usual.
`vim.g.yajna_no_keymaps = true` keeps the commands only.

Reviews: `:YajnaReview [REV-…]` opens an overview tab (files, threads; `<CR>` opens a
file's diff, base against head, with the threads as signs and virtual lines; `c`, `r`, `R`
comment, reply, resolve). In a diff, `<localleader>yc` (normal or visual), `yr`, `yR` and
`]t`/`[t`; also `:YajnaComment`, `:YajnaReply`, `:YajnaResolve`. Reading needs git; writing
calls `yajna review …` (`vim.g.yajna_cmd` when it is not on `PATH`). See the guide's
*Neovim* page.

Install from this repo's flake, `packages.yajna-nvim` (a `vimUtils.buildVimPlugin`), or
point lazy.nvim at `tools/yajna.nvim`:

```lua
{ dir = "~/workspace/chaos/yajna/main/tools/yajna.nvim" }
```

Tests: `nvim --headless -u NONE --cmd "set rtp^=tools/yajna.nvim" -l tools/yajna.nvim/tests/run.lua`,
also run by `checks.yajna-nvim`. The review tests need `git` and `yajna` (`YAJNA_BIN`, else
on `PATH`) and are skipped without them unless `YAJNA_BIN` is set.
