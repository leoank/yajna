-- yajna.nvim: follow [[ID]] links and @citekey citations in a yajna vault, jump to an
-- entity by ID or title, list backlinks. Pure Lua; needs no yajna binary. Resolution is
-- by filename, which the conventions fix: EXP-0001-slug.md, RUN-20261016-k7f3.md,
-- projects/PRJ-0001-slug/README.md, and notes/README.md in a project-shaped repo.

local M = {}

--- The entity ID at the start of s: `PRJ-0001` (curated) or `RUN-20261016-k7f3` (volume).
local function id_prefix(s)
  -- a date ID (`EXP-20261021-0k3m9x`, or the older 4-character suffix) before a counter ID,
  -- so the date is never read as a number
  for _, n in ipairs({ 6, 4 }) do
    local m = s:match("^(%u%u%u%-%d%d%d%d%d%d%d%d%-" .. ("[%da-z]"):rep(n) .. ")")
    if m and not s:sub(#m + 1, #m + 1):match("[%da-z]") then
      return m
    end
  end
  return s:match("^(%u%u%u%-%d%d%d%d%d*)")
end
M.id_prefix = id_prefix

local function read_lines(path, n)
  local f = io.open(path, "r")
  if not f then
    return nil
  end
  local lines = {}
  for line in f:lines() do
    lines[#lines + 1] = line
    if n and #lines >= n then
      break
    end
  end
  f:close()
  return lines
end

--- Repo root for a buffer: the nearest directory upwards holding yajna.toml.
function M.root(buf)
  local name = vim.api.nvim_buf_get_name(buf or 0)
  local dir = name ~= "" and vim.fs.dirname(name) or vim.fn.getcwd()
  local found = vim.fs.find("yajna.toml", { upward = true, path = dir, type = "file" })[1]
  return found and vim.fs.dirname(found) or nil
end

--- The parts of yajna.toml the plugin needs: vault, shape, bibliography, [repos] paths.
function M.config(root)
  local cfg = { vault = "notes", shape = "lab", bibliography = nil, repos = {} }
  local lines = read_lines(root .. "/yajna.toml") or {}
  local section = nil
  for _, raw in ipairs(lines) do
    local line = raw:gsub("#.*$", ""):gsub("^%s+", ""):gsub("%s+$", "")
    local sec = line:match("^%[([%w_%-]+)%]$")
    if sec then
      section = sec
    elseif section == nil then
      local k, v = line:match('^([%w_]+)%s*=%s*"(.-)"$')
      if k == "vault" or k == "shape" or k == "bibliography" then
        cfg[k] = v
      end
    elseif section == "repos" then
      local ns, rest = line:match("^([%w_%-]+)%s*=%s*(.+)$")
      if ns then
        cfg.repos[ns] = { path = rest:match('path%s*=%s*"(.-)"') }
      end
    end
  end
  cfg.vault = root .. "/" .. cfg.vault
  if not cfg.bibliography then
    cfg.bibliography = cfg.shape == "project" and "notes/references/library.bib" or "references/library.bib"
  end
  cfg.bibliography = root .. "/" .. cfg.bibliography
  return cfg
end

--- Path of the page for an ID in the repo at root, or nil.
function M.resolve(root, id)
  local cfg = M.config(root)
  if cfg.shape == "project" and id:match("^PRJ%-") then
    local readme = cfg.vault .. "/README.md"
    return vim.uv.fs_stat(readme) and readme or nil
  end
  local hits = vim.fn.globpath(cfg.vault, "**/" .. id .. "*", false, true)
  table.sort(hits)
  for _, hit in ipairs(hits) do
    local base = vim.fs.basename(hit)
    if base == id .. ".md" or base:match("^" .. vim.pesc(id) .. "%-.*%.md$") then
      return hit
    end
  end
  for _, hit in ipairs(hits) do
    local base = vim.fs.basename(hit)
    if base:match("^" .. vim.pesc(id) .. "%-") and vim.uv.fs_stat(hit .. "/README.md") then
      return hit .. "/README.md"
    end
  end
  return nil
end

--- Resolve `ns/ID` through [repos] when that repo's path is on disk.
function M.resolve_ns(root, ns, id)
  local repo = M.config(root).repos[ns]
  if not repo or not repo.path then
    return nil, ("namespace %s has no path in [repos]"):format(ns)
  end
  local other = vim.fs.normalize(root .. "/" .. repo.path)
  if not vim.uv.fs_stat(other .. "/yajna.toml") then
    return nil, ("%s is not checked out at %s"):format(ns, other)
  end
  return M.resolve(other, id), nil
end

--- Parse a link target: "ns/ID@3|label" -> { ns = "ns", id = "ID", version = "3" }.
function M.parse_target(target)
  target = target:gsub("|.*$", ""):gsub("^%s+", ""):gsub("%s+$", "")
  local ns, rest = target:match("^([%l][%w_%-]*)/(.+)$")
  rest = rest or target
  local id = id_prefix(rest)
  if not id then
    return nil
  end
  local tail = rest:sub(#id + 1)
  local version = tail:match("^@(%d+)$")
  if tail ~= "" and not version then
    return nil
  end
  return { ns = ns, id = id, version = version }
end

--- The [[link]] or @citation under the cursor on `line` at byte column `col` (0-based).
function M.at_cursor(line, col)
  local pos = 1
  while true do
    local s, e, inner = line:find("%[%[([^%]]-)%]%]", pos)
    if not s then
      break
    end
    if col + 1 >= s and col + 1 <= e then
      return { kind = "link", target = inner }
    end
    pos = e + 1
  end
  pos = 1
  while true do
    local s, e, key = line:find("@([%a][%w:_%-]*)", pos)
    if not s then
      break
    end
    -- trim trailing punctuation that is not part of a key
    while key:match("[:_%-]$") do
      key = key:sub(1, -2)
      e = e - 1
    end
    local before = s > 1 and line:sub(s - 1, s - 1) or ""
    if col + 1 >= s - 1 and col + 1 <= e and not before:match("[%w/.]") then
      return { kind = "cite", key = key }
    end
    pos = e + 1
  end
  return nil
end

local function open(path, lnum)
  vim.cmd.edit(vim.fn.fnameescape(path))
  if lnum then
    vim.api.nvim_win_set_cursor(0, { lnum, 0 })
  end
end

--- Open the reading note for a citekey, or the entry in the bibliography.
function M.open_citation(root, key)
  local cfg = M.config(root)
  local note = cfg.vault .. "/references/" .. key .. ".md"
  if vim.uv.fs_stat(note) then
    return open(note)
  end
  local lines = read_lines(cfg.bibliography)
  if lines then
    for i, line in ipairs(lines) do
      if line:match("^@%w+%s*{%s*" .. vim.pesc(key) .. "%s*,") then
        return open(cfg.bibliography, i)
      end
    end
  end
  vim.notify(("yajna: @%s has no note and is not in the bibliography"):format(key), vim.log.levels.WARN)
end

--- Follow whatever is under the cursor. Returns true when something was followed.
function M.follow()
  local root = M.root(0)
  if not root then
    return false
  end
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]
  local hit = M.at_cursor(line, col)
  if not hit then
    return false
  end
  if hit.kind == "cite" then
    M.open_citation(root, hit.key)
    return true
  end
  local t = M.parse_target(hit.target)
  if not t then
    vim.notify("yajna: not an entity link: [[" .. hit.target .. "]]", vim.log.levels.WARN)
    return true
  end
  local path, err
  if t.ns then
    path, err = M.resolve_ns(root, t.ns, t.id)
  else
    path = M.resolve(root, t.id)
  end
  if not path then
    vim.notify("yajna: " .. (err or ("no page for " .. t.id)), vim.log.levels.WARN)
    return true
  end
  open(path)
  return true
end

--- Every entity page in the vault as { id, title, path }, sorted by ID.
function M.entities(root)
  local cfg = M.config(root)
  local out = {}
  for _, path in ipairs(vim.fn.globpath(cfg.vault, "**/*.md", false, true)) do
    local base = vim.fs.basename(path)
    local id = id_prefix(base)
    if base == "README.md" then
      id = id_prefix(vim.fs.basename(vim.fs.dirname(path)))
      if not id and cfg.shape == "project" and path == cfg.vault .. "/README.md" then
        id = "PRJ-0001"
      end
    end
    if id then
      local title = ""
      for _, line in ipairs(read_lines(path, 20) or {}) do
        local t = line:match("^title:%s*(.-)%s*$")
        if t then
          title = t:gsub('^"(.*)"$', "%1"):gsub("^'(.*)'$", "%1")
          break
        end
      end
      out[#out + 1] = { id = id, title = title, path = path }
    end
  end
  table.sort(out, function(a, b)
    return a.id < b.id
  end)
  return out
end

--- Pick an entity by ID or title and open it.
function M.find()
  local root = M.root(0)
  if not root then
    return vim.notify("yajna: not inside a yajna repo", vim.log.levels.WARN)
  end
  local items = M.entities(root)
  vim.ui.select(items, {
    prompt = "yajna entity",
    format_item = function(e)
      return e.title ~= "" and (e.id .. "  " .. e.title) or e.id
    end,
  }, function(choice)
    if choice then
      open(choice.path)
    end
  end)
end

--- The ID of the page in the current buffer, from its filename.
function M.current_id()
  local root = M.root(0)
  if not root then
    return nil
  end
  local path = vim.api.nvim_buf_get_name(0)
  local base = vim.fs.basename(path)
  if base == "README.md" then
    local cfg = M.config(root)
    if cfg.shape == "project" and path == cfg.vault .. "/README.md" then
      return "PRJ-0001"
    end
    return id_prefix(vim.fs.basename(vim.fs.dirname(path)))
  end
  return id_prefix(base)
end

--- Every line in the vault that links to the current page, in the quickfix list.
function M.backlinks()
  local root = M.root(0)
  local id = M.current_id()
  if not root or not id then
    return vim.notify("yajna: the current buffer is not an entity page", vim.log.levels.WARN)
  end
  local cfg = M.config(root)
  local pattern = "\\[\\[\\%(\\w\\+\\/\\)\\=" .. id .. "\\%(@\\d\\+\\)\\=\\%(|[^\\]]*\\)\\=\\]\\]"
  local ok, err = pcall(vim.cmd, ("silent vimgrep /%s/gj %s/**/*.md"):format(pattern, vim.fn.fnameescape(cfg.vault)))
  if not ok then
    local msg = tostring(err):match("E480") and "no backlinks to " .. id or tostring(err)
    return vim.notify("yajna: " .. msg, vim.log.levels.INFO)
  end
  vim.cmd.copen()
end

--- Buffer-local keymaps for a markdown buffer inside a yajna repo.
function M.attach(buf)
  local map = function(lhs, rhs, desc)
    vim.keymap.set("n", lhs, rhs, { buffer = buf, desc = desc, silent = true })
  end
  map("gf", function()
    if not M.follow() then
      pcall(vim.cmd, "normal! gf")
    end
  end, "yajna: follow link or citation (gf)")
  map("<C-]>", function()
    if not M.follow() then
      pcall(vim.cmd, "normal! <C-]>")
    end
  end, "yajna: follow link or citation")
  map("<localleader>yf", M.find, "yajna: find entity")
  map("<localleader>yb", M.backlinks, "yajna: backlinks")
end

return M
