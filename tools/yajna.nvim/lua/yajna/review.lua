-- Reviews (docs/review.md, section 7.3): read a REV page, show its diff base against head
-- with the threads as extmarks at their anchors and in the quickfix list, and comment,
-- reply and resolve through the `yajna` CLI. Reading needs git, not the binary; writing
-- calls `yajna review …`, which keeps the page's format in one place.
--
-- Files at a commit are buffers named yajna://<commit><root>//<path>, read with `git show`.

local yajna = require("yajna")

local R = {}
local ns = vim.api.nvim_create_namespace("yajna_review")

-- open reviews by "<root>|<id>": { root, id, path, page }
R.open_reviews = {}
-- overview buffer -> { key, items = { [lnum] = { kind = "file" | "thread", ... } } }
local overviews = {}

local function notify(msg, level)
  vim.notify("yajna: " .. msg, level or vim.log.levels.INFO)
end

local function read(path)
  local f = io.open(path, "r")
  if not f then
    return nil
  end
  local text = f:read("*a")
  f:close()
  return text
end

local function git(root, args)
  local cmd = { "git", "-C", root }
  vim.list_extend(cmd, args)
  local r = vim.system(cmd, { text = true }):wait()
  if r.code ~= 0 then
    return nil, vim.trim(r.stderr or "")
  end
  return r.stdout
end

-- --- the page --------------------------------------------------------------------------

local function scalar(v)
  v = vim.trim(v)
  local q = v:match('^"(.*)"$') or v:match("^'(.*)'$")
  if q then
    return q
  end
  v = vim.trim((v:gsub("%s+#.*$", "")))
  return v ~= "null" and v ~= "" and v or nil
end

local function inline_list(v)
  local inner = vim.trim(v:gsub("%s+#.*$", "")):match("^%[(.*)%]$")
  local out = {}
  for item in (inner or ""):gmatch("[^,]+") do
    out[#out + 1] = scalar(item)
  end
  return out
end

--- An anchor: `path:from[-to] @ commit`, `path#Heading @ commit` or `general`.
function R.parse_anchor(s)
  if s == "general" then
    return { kind = "general" }
  end
  local path, from, to, commit = s:match("^(.-):(%d+)%-(%d+) @ (%x+)$")
  if not path then
    path, from, commit = s:match("^(.-):(%d+) @ (%x+)$")
    to = from
  end
  if path then
    return { kind = "lines", path = path, from = tonumber(from), to = tonumber(to), commit = commit }
  end
  local hpath, heading, hcommit = s:match("^(.-)#(.-) @ (%x+)$")
  if hpath then
    return { kind = "heading", path = hpath, heading = heading, commit = hcommit }
  end
  return nil
end

--- A REV page's text -> { meta, summary, threads }, as `review.rs` reads it.
function R.parse(text)
  local lines = vim.split(text, "\n", { plain = true })
  local meta = { target = {}, paths = {}, rounds = {} }
  local i = 1
  if lines[1] == "---" then
    i = 2
    local list_key = nil
    while i <= #lines and lines[i] ~= "---" do
      local line = lines[i]
      local k, v = line:match("^([%w_]+):%s*(.-)%s*$")
      if k then
        list_key = nil
        if v:match("^%[") then
          meta[k] = inline_list(v)
        elseif v == "" then
          list_key = k
          meta[k] = meta[k] or {}
        else
          meta[k] = scalar(v)
        end
      elseif list_key then
        local sk, sv = line:match("^%s+([%w_]+):%s*(.-)%s*$")
        local item = line:match("^%s+%-%s+(.-)%s*$")
        if sk and type(meta[list_key]) == "table" then
          meta[list_key][sk] = scalar(sv)
        elseif item and type(meta[list_key]) == "table" then
          table.insert(meta[list_key], scalar(item))
        end
      end
      i = i + 1
    end
    i = i + 1
  end
  local summary, threads = {}, {}
  local section, fence = nil, nil
  for lnum = i, #lines do
    local line = lines[lnum]
    local h2 = line:match("^## (.-)%s*$")
    if fence then
      if vim.startswith(vim.trim(line), fence) then
        fence = nil
      else
        table.insert(threads[#threads].quote, line)
      end
    elseif h2 then
      section = h2
    elseif section == "Summary" then
      summary[#summary + 1] = line
    elseif section == "Threads" then
      local n, state, anchor = line:match("^### T(%d+) %((%a+)%) (.+)$")
      local t = threads[#threads]
      if n then
        threads[#threads + 1] = {
          n = tonumber(n),
          state = state,
          raw_anchor = anchor,
          anchor = R.parse_anchor(anchor),
          quote = {},
          replies = {},
          line = lnum,
        }
      elseif t and #t.replies == 0 and (vim.startswith(vim.trim(line), "```") or vim.startswith(vim.trim(line), "~~~")) then
        fence = vim.trim(line):sub(1, 3)
      elseif t then
        local date, time, rest = line:match("^%- (%d%d%d%d%-%d%d%-%d%d) (%d%d:%d%d) (.*)$")
        if date then
          local author, tail = rest:match("^(%S-)(:.*)$")
          local reply = { when = date .. " " .. time }
          local action_author, commit, atext = rest:match("^(%S+) addressed in (%x+):?%s*(.*)$")
          if action_author then
            reply.author, reply.action, reply.commit, reply.text = action_author, "addressed", commit, atext
          elseif rest:match("^%S+ resolved") then
            reply.author, reply.action = rest:match("^(%S+) resolved"), "resolved"
            reply.text = rest:match("^%S+ resolved:%s*(.*)$") or ""
          elseif rest:match("^%S+ reopened") then
            reply.author, reply.action = rest:match("^(%S+) reopened"), "reopened"
            reply.text = rest:match("^%S+ reopened:%s*(.*)$") or ""
          else
            reply.author, reply.text = author, tail and vim.trim(tail:sub(2)) or ""
          end
          table.insert(t.replies, reply)
        elseif vim.startswith(line, "  ") and #t.replies > 0 then
          local last = t.replies[#t.replies]
          last.text = last.text .. "\n" .. vim.trim(line)
        end
      end
    end
  end
  while #summary > 0 and vim.trim(summary[1]) == "" do
    table.remove(summary, 1)
  end
  while #summary > 0 and vim.trim(summary[#summary]) == "" do
    table.remove(summary)
  end
  return { meta = meta, summary = summary, threads = threads }
end

--- The REV page for an ID: in this checkout, else in another worktree of the repo (a
--- branch review is written in its branch's worktree).
function R.find(root, id)
  local here = yajna.resolve(root, id)
  if here then
    return here, root
  end
  local out = git(root, { "worktree", "list", "--porcelain" }) or ""
  for wt in out:gmatch("worktree ([^\n]+)") do
    if wt ~= root and vim.uv.fs_stat(wt .. "/yajna.toml") then
      local p = yajna.resolve(wt, id)
      if p then
        return p, wt
      end
    end
  end
  return nil
end

local function load(review)
  local text = read(review.path)
  if not text then
    return nil, review.path .. " cannot be read"
  end
  review.page = R.parse(text)
  return review
end

--- Changed files between the review's base and head, in its paths: { status, path, old }.
function R.changed(review)
  local m = review.page.meta
  local args = { "diff", "--name-status", "-M", m.base, m.head, "--" }
  vim.list_extend(args, m.paths or {})
  local out, err = git(review.root, args)
  if not out then
    return nil, err
  end
  local files = {}
  for line in out:gmatch("[^\n]+") do
    local parts = vim.split(line, "\t", { plain = true })
    local st = parts[1]:sub(1, 1)
    if st == "R" or st == "C" then
      files[#files + 1] = { status = st, old = parts[2], path = parts[3] }
    else
      files[#files + 1] = { status = st, old = parts[2], path = parts[2] }
    end
  end
  return files
end

-- --- buffers of a file at a commit ---------------------------------------------------

function R.bufname(root, commit, path)
  return ("yajna://%s%s//%s"):format(commit, root, path)
end

function R.parse_bufname(name)
  local commit, root, path = name:match("^yajna://(%x+)(/.-)//(.+)$")
  return commit and { commit = commit, root = root, path = path } or nil
end

local full_commits = {}
--- A commit as a full SHA (short SHAs in anchors), cached per root.
local function full(root, commit)
  local key = root .. "|" .. commit
  if not full_commits[key] then
    local out = git(root, { "rev-parse", "--verify", "--quiet", commit .. "^{commit}" })
    full_commits[key] = out and vim.trim(out) or commit
  end
  return full_commits[key]
end

local function same_commit(a, b)
  return a and b and (vim.startswith(a, b) or vim.startswith(b, a))
end

-- the reviews open for a root
local function reviews_of(root)
  local out = {}
  for _, rv in pairs(R.open_reviews) do
    if rv.root == root then
      out[#out + 1] = rv
    end
  end
  return out
end

--- Threads of open reviews anchored in this buffer: { review, thread, from, to }.
function R.threads_in(buf)
  local info = R.parse_bufname(vim.api.nvim_buf_get_name(buf))
  if not info then
    return {}
  end
  local out = {}
  local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)
  for _, rv in ipairs(reviews_of(info.root)) do
    for _, t in ipairs(rv.page.threads) do
      local a = t.anchor
      if a and a.kind ~= "general" and a.path == info.path and same_commit(a.commit, info.commit) then
        local from, to = a.from, a.to
        if a.kind == "heading" then
          for lnum, l in ipairs(lines) do
            if l:match("^#+%s+(.-)%s*$") == a.heading then
              from, to = lnum, lnum
              break
            end
          end
        end
        if from and from <= #lines then
          out[#out + 1] = { review = rv, thread = t, from = from, to = math.min(to, #lines) }
        end
      end
    end
  end
  table.sort(out, function(x, y)
    return x.from < y.from
  end)
  return out
end

local state_hl = { open = "DiagnosticWarn", addressed = "DiagnosticInfo", resolved = "DiagnosticOk", outdated = "Comment" }

local function reply_text(r)
  if r.action == "addressed" then
    return ("%s addressed in %s%s"):format(r.author, r.commit, r.text ~= "" and (": " .. r.text) or "")
  elseif r.action then
    return r.author .. " " .. r.action .. (r.text ~= "" and (": " .. r.text) or "")
  end
  return r.author .. ": " .. r.text
end

--- Draw the threads of open reviews in a yajna:// buffer: a sign on the anchored lines and
--- the thread under them as virtual lines.
function R.decorate(buf)
  if not vim.api.nvim_buf_is_loaded(buf) then
    return
  end
  vim.api.nvim_buf_clear_namespace(buf, ns, 0, -1)
  for _, hit in ipairs(R.threads_in(buf)) do
    local t = hit.thread
    local hl = state_hl[t.state] or "DiagnosticWarn"
    for lnum = hit.from, hit.to do
      vim.api.nvim_buf_set_extmark(buf, ns, lnum - 1, 0, { sign_text = lnum == hit.from and ("T" .. t.n):sub(1, 2) or "│", sign_hl_group = hl })
    end
    local virt = { { { ("┌ T%d (%s)"):format(t.n, t.state), hl } } }
    for _, r in ipairs(t.replies) do
      for j, part in ipairs(vim.split(reply_text(r), "\n", { plain = true })) do
        local lead = j == 1 and ("│ " .. r.when .. " ") or "│   "
        virt[#virt + 1] = { { lead, hl }, { part, "Comment" } }
      end
    end
    vim.api.nvim_buf_set_extmark(buf, ns, hit.to - 1, 0, { virt_lines = virt })
  end
end

local function redraw(root)
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    local info = R.parse_bufname(vim.api.nvim_buf_get_name(buf))
    if info and info.root == root then
      R.decorate(buf)
    end
  end
end

--- BufReadCmd for yajna:// names: the file at that commit, read-only.
function R.read_buffer(buf)
  local name = vim.api.nvim_buf_get_name(buf)
  local info = R.parse_bufname(name)
  if not info then
    return
  end
  local out = git(info.root, { "show", info.commit .. ":" .. info.path })
  local lines = out and vim.split(out, "\n", { plain = true }) or {}
  if out and lines[#lines] == "" then
    table.remove(lines)
  end
  vim.bo[buf].modifiable = true
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
  vim.bo[buf].modified = false
  vim.bo[buf].modifiable = false
  vim.bo[buf].readonly = true
  vim.bo[buf].buftype = "nowrite"
  vim.bo[buf].swapfile = false
  vim.b[buf].yajna_absent = out == nil
  local ft = vim.filetype.match({ filename = info.path, buf = buf })
  if ft then
    vim.bo[buf].filetype = ft
  end
  R.attach(buf)
  R.decorate(buf)
end

-- --- writing through the CLI -----------------------------------------------------------

--- Who writes from the editor: a person, so the checkout's author unless that is an
--- agent's (an agent's worktree or shell), then the notebook's own (as the files viewer).
function R.author(root)
  local a = vim.env.YAJNA_AUTHOR
  if not a or a == "" then
    local f = read(root .. "/.yajna/author")
    a = f and vim.trim(f) or nil
  end
  if not a or a == "" or vim.startswith(a, "agent:") then
    a = yajna.config(root).author
  end
  return a
end

local function cli(review, args)
  local cmd = vim.deepcopy(vim.g.yajna_cmd or { "yajna" })
  if type(cmd) == "string" then
    cmd = { cmd }
  end
  vim.list_extend(cmd, { "review" })
  vim.list_extend(cmd, args)
  local author = R.author(review.root)
  if author then
    vim.list_extend(cmd, { "--author", author })
  end
  local ok, proc = pcall(vim.system, cmd, { cwd = review.root, text = true })
  if not ok then
    return nil, tostring(proc)
  end
  local r = proc:wait()
  if r.code ~= 0 then
    return nil, vim.trim((r.stderr ~= "" and r.stderr or r.stdout) or "")
  end
  load(review)
  redraw(review.root)
  for buf, ov in pairs(overviews) do
    if ov.key == review.key and vim.api.nvim_buf_is_valid(buf) then
      R.render(buf)
    end
  end
  R.quickfix(review)
  return vim.trim(r.stdout or "")
end

-- the review a command acts on: the overview's, the current yajna:// buffer's, the current
-- REV page's, or the only one open
local function current_review()
  local buf = vim.api.nvim_get_current_buf()
  if overviews[buf] then
    return R.open_reviews[overviews[buf].key]
  end
  local info = R.parse_bufname(vim.api.nvim_buf_get_name(buf))
  local root = info and info.root or yajna.root(buf)
  if not root then
    return nil, "not inside a yajna repo"
  end
  local id = yajna.current_id()
  if id and id:match("^REV%-") then
    return R.open_reviews[root .. "|" .. id] or R.load(root, id)
  end
  local open = reviews_of(root)
  if #open == 1 then
    return open[1]
  end
  return nil, #open == 0 and "no review is open: :YajnaReview REV-…" or "more than one review is open: run this from its overview"
end

-- the thread under the cursor: the overview's line, or the thread whose lines hold it
local function current_thread()
  local buf = vim.api.nvim_get_current_buf()
  local lnum = vim.api.nvim_win_get_cursor(0)[1]
  if overviews[buf] then
    local item = overviews[buf].items[lnum]
    return item and item.thread
  end
  for _, hit in ipairs(R.threads_in(buf)) do
    if lnum >= hit.from and lnum <= hit.to then
      return hit.thread.n
    end
  end
  return nil
end

local function ask(prompt, given, cb)
  if given and given ~= "" then
    return cb(given)
  end
  vim.ui.input({ prompt = prompt }, function(text)
    if text and vim.trim(text) ~= "" then
      cb(text)
    end
  end)
end

--- :YajnaComment [text], on lines (a range or the cursor line) of a file at the review's
--- head or at a fix; from the overview or another buffer, a general thread.
function R.comment(text, line1, line2, ranged)
  local review, err = current_review()
  if not review then
    return notify(err, vim.log.levels.WARN)
  end
  local args = { review.page.meta.id or review.id }
  local buf = vim.api.nvim_get_current_buf()
  local info = R.parse_bufname(vim.api.nvim_buf_get_name(buf))
  local id_here = not info and yajna.root(buf) and yajna.current_id()
  if not info and not overviews[buf] and not (id_here and id_here:match("^REV%-")) then
    return notify("open the file from the review (:YajnaReview) to comment on its lines; in the overview, c starts a general thread", vim.log.levels.WARN)
  end
  local where = "general"
  if info then
    local m = review.page.meta
    if same_commit(info.commit, m.base) and not same_commit(info.commit, m.head) then
      return notify("this is the base side: comment on the head side, where the lines are now", vim.log.levels.WARN)
    end
    if vim.b.yajna_absent then
      return notify(info.path .. " is not in this commit", vim.log.levels.WARN)
    end
    if not ranged then
      line1 = vim.api.nvim_win_get_cursor(0)[1]
      line2 = line1
    end
    where = ("%s:%d-%d"):format(info.path, line1, line2)
    vim.list_extend(args, { "--at", where })
    if not same_commit(info.commit, m.head) then
      vim.list_extend(args, { "--commit", info.commit })
    end
  end
  ask(("comment on %s: "):format(where), text, function(t)
    local out, e = cli(review, vim.list_extend({ "comment", unpack(args) }, { t }))
    notify(out or e, out and vim.log.levels.INFO or vim.log.levels.ERROR)
  end)
end

local function on_thread(action, prompt, arg_text, optional)
  local review, err = current_review()
  if not review then
    return notify(err, vim.log.levels.WARN)
  end
  local first = arg_text and arg_text:match("^(%S+)")
  local n = first and tonumber(first:match("^[Tt](%d+)$"))
  local text = arg_text
  if n then
    text = vim.trim(arg_text:sub(#first + 1))
  else
    n = current_thread()
  end
  if not n then
    return notify("no thread here: put the cursor on one or name it (T3)", vim.log.levels.WARN)
  end
  local run = function(t)
    local args = { action, review.page.meta.id or review.id, "T" .. n }
    if t and t ~= "" then
      args[#args + 1] = t
    end
    local out, e = cli(review, args)
    notify(out or e, out and vim.log.levels.INFO or vim.log.levels.ERROR)
  end
  if optional then
    if text and text ~= "" then
      return run(text)
    end
    return vim.ui.input({ prompt = ("%s T%d (optional text): "):format(action, n) }, function(t)
      if t ~= nil then
        run(t)
      end
    end)
  end
  ask(("%s T%d: "):format(prompt, n), text, run)
end

function R.reply(text)
  on_thread("reply", "reply to", text, false)
end

function R.resolve(text)
  on_thread("resolve", "resolve", text, true)
end

-- --- the overview, the diff, the quickfix list -------------------------------------------

--- The threads with an anchor as quickfix entries, at their commit; general ones at the page.
function R.quickfix(review)
  local items = {}
  for _, t in ipairs(review.page.threads) do
    local a = t.anchor
    local first = t.replies[1] and t.replies[1].text:gsub("\n.*", "") or ""
    local text = ("T%d (%s) %s"):format(t.n, t.state, first)
    if a and a.kind ~= "general" then
      local lnum = a.from or 1
      items[#items + 1] = { filename = R.bufname(review.root, full(review.root, a.commit), a.path), lnum = lnum, text = text }
    else
      items[#items + 1] = { filename = review.path, lnum = t.line, text = text }
    end
  end
  vim.fn.setqflist({}, " ", { title = (review.page.meta.id or review.id) .. " threads", items = items })
end

--- Load a review by ID into the open reviews.
function R.load(root, id)
  local path, wt = R.find(root, id)
  if not path then
    return nil, "no review " .. id
  end
  local key = root .. "|" .. id
  local review = R.open_reviews[key] or { root = root, id = id, key = key }
  review.path, review.checkout = path, wt
  local ok, err = load(review)
  if not ok then
    return nil, err
  end
  R.open_reviews[key] = review
  return review
end

local function short(sha)
  return sha and sha:sub(1, 7) or "?"
end

--- Fill an overview buffer from its review.
function R.render(buf)
  local ov = overviews[buf]
  local review = R.open_reviews[ov.key]
  local p = review.page
  local m = p.meta
  local lines, items, hls = {}, {}, {}
  local function add(text, item, hl)
    lines[#lines + 1] = text
    items[#lines] = item
    if hl then
      hls[#hls + 1] = { #lines, hl }
    end
  end
  add(("%s  %s"):format(m.id or review.id, m.title or ""), nil, "Title")
  add(("status: %s   %s %s   %s..%s"):format(m.status or "?", m.target.kind or "?", m.target.ref or "", short(m.base), short(m.head)))
  if #(m.about or {}) > 0 then
    add("about: " .. table.concat(m.about, ", "))
  end
  add("")
  if #p.summary > 0 then
    add("Summary", nil, "Statement")
    for _, l in ipairs(p.summary) do
      add("  " .. l)
    end
    add("")
  end
  local files, err = R.changed(review)
  ov.files = files or {}
  add(("Files (%d)"):format(#ov.files), nil, "Statement")
  if not files then
    add("  " .. (err or "git diff failed"), nil, "ErrorMsg")
  end
  for idx, f in ipairs(ov.files) do
    local count = 0
    for _, t in ipairs(p.threads) do
      if t.anchor and t.anchor.path == f.path then
        count = count + 1
      end
    end
    local name = f.old ~= f.path and (f.old .. " -> " .. f.path) or f.path
    add(("  %s  %s%s"):format(f.status, name, count > 0 and ("   (%d thread%s)"):format(count, count > 1 and "s" or "") or ""), { file = idx })
  end
  add("")
  local open = 0
  for _, t in ipairs(p.threads) do
    if t.state == "open" or t.state == "addressed" then
      open = open + 1
    end
  end
  add(("Threads (%d, %d unsettled)"):format(#p.threads, open), nil, "Statement")
  for _, t in ipairs(p.threads) do
    add(("  T%d (%s) %s"):format(t.n, t.state, t.raw_anchor), { thread = t.n }, state_hl[t.state])
    for _, r in ipairs(t.replies) do
      for j, part in ipairs(vim.split(reply_text(r), "\n", { plain = true })) do
        add((j == 1 and ("    %s "):format(r.when) or "                       ") .. part, { thread = t.n })
      end
    end
  end
  add("")
  add("<CR> open   c comment   r reply   R resolve   u update view   q close", nil, "Comment")
  ov.items = items
  vim.bo[buf].modifiable = true
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
  vim.bo[buf].modifiable = false
  vim.bo[buf].modified = false
  vim.api.nvim_buf_clear_namespace(buf, ns, 0, -1)
  for _, h in ipairs(hls) do
    vim.api.nvim_buf_set_extmark(buf, ns, h[1] - 1, 0, { end_row = h[1] - 1, end_col = #lines[h[1]], hl_group = h[2] })
  end
end

--- Open one changed file as a diff in a new tab: base on the left, head on the right, at
--- lnum on the right.
function R.open_diff(review, file, lnum)
  local m = review.page.meta
  vim.cmd.tabnew()
  vim.cmd.edit(vim.fn.fnameescape(R.bufname(review.root, m.base, file.old or file.path)))
  vim.cmd.diffthis()
  vim.cmd("rightbelow vsplit " .. vim.fn.fnameescape(R.bufname(review.root, m.head, file.path)))
  vim.cmd.diffthis()
  if lnum then
    pcall(vim.api.nvim_win_set_cursor, 0, { lnum, 0 })
    vim.cmd("normal! zz")
  end
end

--- Open what the overview line names: a file's diff, or a thread at its anchor.
function R.activate(buf)
  local ov = overviews[buf]
  local review = R.open_reviews[ov.key]
  local item = ov.items[vim.api.nvim_win_get_cursor(0)[1]]
  if not item then
    return
  end
  if item.file then
    return R.open_diff(review, ov.files[item.file])
  end
  for _, t in ipairs(review.page.threads) do
    if t.n == item.thread then
      local a = t.anchor
      if not a or a.kind == "general" then
        vim.cmd.edit(vim.fn.fnameescape(review.path))
        return vim.api.nvim_win_set_cursor(0, { t.line, 0 })
      end
      local lnum = a.from
      if same_commit(a.commit, review.page.meta.head) then
        for _, f in ipairs(ov.files) do
          if f.path == a.path then
            return R.open_diff(review, f, lnum)
          end
        end
      end
      -- outdated, on a fix, or in a file outside the diff: the file at the thread's commit
      vim.cmd.tabnew()
      vim.cmd.edit(vim.fn.fnameescape(R.bufname(review.root, full(review.root, a.commit), a.path)))
      if lnum then
        pcall(vim.api.nvim_win_set_cursor, 0, { lnum, 0 })
      end
      return
    end
  end
end

--- :YajnaReview [REV-…]: the review's overview in a new tab, its threads in the quickfix
--- list. Without an ID: the REV page in this buffer, else pick one.
function R.open(id)
  local root = yajna.root(0)
  if not root then
    local info = R.parse_bufname(vim.api.nvim_buf_get_name(0))
    root = info and info.root
  end
  if not root then
    return notify("not inside a yajna repo", vim.log.levels.WARN)
  end
  if not id or id == "" then
    local here = yajna.current_id()
    if here and here:match("^REV%-") then
      id = here
    else
      local revs = vim.tbl_filter(function(e)
        return e.id:match("^REV%-")
      end, yajna.entities(root))
      if #revs == 0 then
        return notify("no reviews in this notebook", vim.log.levels.WARN)
      end
      return vim.ui.select(revs, {
        prompt = "review",
        format_item = function(e)
          return e.id .. "  " .. e.title
        end,
      }, function(choice)
        if choice then
          R.open(choice.id)
        end
      end)
    end
  end
  local review, err = R.load(root, id)
  if not review then
    return notify(err, vim.log.levels.WARN)
  end
  vim.cmd.tabnew()
  local buf = vim.api.nvim_get_current_buf()
  vim.bo[buf].buftype = "nofile"
  vim.bo[buf].bufhidden = "wipe"
  vim.bo[buf].swapfile = false
  vim.bo[buf].filetype = "yajnareview"
  pcall(vim.api.nvim_buf_set_name, buf, "yajna-review://" .. id)
  overviews[buf] = { key = review.key, items = {} }
  vim.api.nvim_create_autocmd("BufWipeout", {
    buffer = buf,
    callback = function()
      overviews[buf] = nil
    end,
  })
  R.render(buf)
  R.quickfix(review)
  local map = function(lhs, rhs, desc)
    vim.keymap.set("n", lhs, rhs, { buffer = buf, desc = "yajna review: " .. desc, silent = true, nowait = true })
  end
  map("<CR>", function()
    R.activate(buf)
  end, "open the file or thread")
  map("c", function()
    R.comment()
  end, "general comment")
  map("r", function()
    R.reply()
  end, "reply to the thread")
  map("R", function()
    R.resolve()
  end, "resolve the thread")
  map("u", function()
    load(review)
    R.render(buf)
    R.quickfix(review)
    redraw(review.root)
  end, "read the page again")
  map("q", function()
    vim.cmd.tabclose()
  end, "close")
  return review, buf
end

--- Jump to the next (dir 1) or previous (dir -1) thread in a yajna:// buffer.
function R.jump(dir)
  local lnum = vim.api.nvim_win_get_cursor(0)[1]
  local hits = R.threads_in(0)
  if dir < 0 then
    hits = vim.fn.reverse(hits)
  end
  for _, hit in ipairs(hits) do
    if (dir > 0 and hit.from > lnum) or (dir < 0 and hit.from < lnum) then
      return vim.api.nvim_win_set_cursor(0, { hit.from, 0 })
    end
  end
end

--- Buffer-local keymaps in a file at a commit.
function R.attach(buf)
  if vim.g.yajna_no_keymaps or vim.b[buf].yajna_review_maps then
    return
  end
  vim.b[buf].yajna_review_maps = true
  local opts = function(desc)
    return { buffer = buf, desc = "yajna review: " .. desc, silent = true }
  end
  vim.keymap.set("n", "<localleader>yc", function()
    R.comment()
  end, opts("comment on this line"))
  vim.keymap.set("x", "<localleader>yc", ":YajnaComment<CR>", opts("comment on these lines"))
  vim.keymap.set("n", "<localleader>yr", function()
    R.reply()
  end, opts("reply to the thread here"))
  vim.keymap.set("n", "<localleader>yR", function()
    R.resolve()
  end, opts("resolve the thread here"))
  vim.keymap.set("n", "]t", function()
    R.jump(1)
  end, opts("next thread"))
  vim.keymap.set("n", "[t", function()
    R.jump(-1)
  end, opts("previous thread"))
end

return R
