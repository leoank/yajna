-- Commands and buffer-local keymaps for markdown buffers inside a yajna repo.
-- Set vim.g.yajna_no_keymaps = true to keep the commands only.

if vim.g.loaded_yajna then
  return
end
vim.g.loaded_yajna = true

vim.api.nvim_create_user_command("YajnaFollow", function()
  if not require("yajna").follow() then
    vim.notify("yajna: nothing to follow under the cursor", vim.log.levels.INFO)
  end
end, { desc = "follow the [[link]] or @citation under the cursor" })
vim.api.nvim_create_user_command("YajnaFind", function()
  require("yajna").find()
end, { desc = "jump to an entity by ID or title" })
vim.api.nvim_create_user_command("YajnaBacklinks", function()
  require("yajna").backlinks()
end, { desc = "pages linking to the current one, in the quickfix list" })

if not vim.g.yajna_no_keymaps then
  vim.api.nvim_create_autocmd("FileType", {
    pattern = "markdown",
    group = vim.api.nvim_create_augroup("yajna", { clear = true }),
    callback = function(ev)
      local yajna = require("yajna")
      if yajna.root(ev.buf) then
        yajna.attach(ev.buf)
      end
    end,
  })
end
