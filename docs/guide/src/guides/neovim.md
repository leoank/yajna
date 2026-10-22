# Neovim

`yajna.nvim` follows links in a notebook from Neovim. It is pure Lua and needs neither the
`yajna` binary nor an index: pages are found by their file names, which the conventions fix.

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

Creating pages is still the CLI's job: `:!yajna new experiment "..." --project PRJ-0001`,
or a terminal beside the editor.
