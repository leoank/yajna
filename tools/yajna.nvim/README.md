# yajna.nvim

Follow links in a yajna vault from Neovim. Pure Lua, no `yajna` binary needed; pages are
found by their filenames, which the conventions fix (`EXP-0001-slug.md`,
`projects/PRJ-0001-slug/README.md`, `lab/README.md` in a project-shaped repo).

In any markdown buffer under a directory with `yajna.toml`:

| Key | Does |
|-----|------|
| `gf`, `<C-]>` | follow `[[EXP-0007]]`, `[[PRO-0012@3\|label]]`, `[[rc2s2/EXP-0003]]` (through `[repos]` `path`), or `@citekey` (reading note, else the entry in the bibliography); native `gf` otherwise |
| `<localleader>yf` | pick an entity by ID or title (`vim.ui.select`) |
| `<localleader>yb` | backlinks to the current page in the quickfix list |

Commands: `:YajnaFollow`, `:YajnaFind`, `:YajnaBacklinks`. Go back with `<C-o>` as usual.
`vim.g.yajna_no_keymaps = true` keeps the commands only.

Install from this repo's flake, `packages.yajna-nvim` (a `vimUtils.buildVimPlugin`), or
point lazy.nvim at `tools/yajna.nvim`:

```lua
{ dir = "~/workspace/chaos/yajna/main/tools/yajna.nvim" }
```

Tests: `nvim --headless -u NONE --cmd "set rtp+=tools/yajna.nvim" -l tools/yajna.nvim/tests/run.lua`,
also run by `checks.yajna-nvim`.
