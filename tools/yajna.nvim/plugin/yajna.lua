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

-- reviews (docs/review.md section 7.3)
local function review_ids()
  local yajna = require("yajna")
  local root = yajna.root(0)
  if not root then
    return {}
  end
  local ids = {}
  for _, e in ipairs(yajna.entities(root)) do
    if e.id:match("^REV%-") then
      ids[#ids + 1] = e.id
    end
  end
  return ids
end
vim.api.nvim_create_user_command("YajnaReview", function(o)
  require("yajna.review").open(o.args)
end, { nargs = "?", complete = review_ids, desc = "a review's overview, its files as diffs and its threads" })
vim.api.nvim_create_user_command("YajnaComment", function(o)
  require("yajna.review").comment(o.args, o.line1, o.line2, o.range > 0)
end, { nargs = "*", range = true, desc = "start a review thread on these lines (or a general one from the overview)" })
vim.api.nvim_create_user_command("YajnaReply", function(o)
  require("yajna.review").reply(o.args)
end, { nargs = "*", desc = "reply to the review thread here, or [T<n>] text" })
vim.api.nvim_create_user_command("YajnaResolve", function(o)
  require("yajna.review").resolve(o.args)
end, { nargs = "*", desc = "resolve the review thread here, or [T<n>] [text]" })
vim.api.nvim_create_autocmd("BufReadCmd", {
  pattern = "yajna://*",
  group = vim.api.nvim_create_augroup("yajna_review", { clear = true }),
  callback = function(ev)
    require("yajna.review").read_buffer(ev.buf)
  end,
})

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
