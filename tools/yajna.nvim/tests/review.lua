-- Review tests, run from run.lua: a scratch project repo with two commits, a review of the
-- range opened and commented on through the CLI, then read, shown and written from Neovim.
-- Needs git and `yajna` (YAJNA_BIN, else on PATH); checks.yajna-nvim provides both.

return function(t)
  local check, eq, write, tmp = t.check, t.eq, t.write, t.tmp
  local bin = vim.env.YAJNA_BIN or "yajna"
  if vim.fn.executable(bin) ~= 1 or vim.fn.executable("git") ~= 1 then
    -- YAJNA_BIN set (as in checks.yajna-nvim) means the tests must run
    check(not vim.env.YAJNA_BIN, "YAJNA_BIN is set but " .. bin .. " or git is not executable")
    print("yajna.nvim: review tests skipped: no yajna or git on PATH (set YAJNA_BIN)")
    return
  end
  vim.g.yajna_cmd = { bin }
  local review = require("yajna.review")
  vim.cmd.runtime("plugin/yajna.lua")

  -- a scratch repo, kept out of the user's registry and cache
  vim.env.XDG_STATE_HOME = tmp .. "/state"
  vim.env.XDG_CACHE_HOME = tmp .. "/cache"
  vim.env.XDG_CONFIG_HOME = tmp .. "/config"
  for _, k in ipairs({ "GIT_AUTHOR_NAME", "GIT_COMMITTER_NAME" }) do
    vim.env[k] = "t"
  end
  for _, k in ipairs({ "GIT_AUTHOR_EMAIL", "GIT_COMMITTER_EMAIL" }) do
    vim.env[k] = "t@example.invalid"
  end
  vim.env.YAJNA_AUTHOR = nil
  local repo = tmp .. "/rev"
  vim.fn.mkdir(repo, "p")
  local function sh(args, input)
    local r = vim.system(args, { cwd = repo, text = true, stdin = input }):wait()
    check(r.code == 0, table.concat(args, " ") .. ": " .. (r.stderr or ""))
    return vim.trim(r.stdout or "")
  end
  sh({ "git", "init", "-q", "-b", "main" })
  sh({ bin, "init", "project", "Toy" })
  write(repo .. "/code/x.py", "a\nb\nc\nd\ne\n")
  write(repo .. "/code/gone.py", "old\n")
  write(repo .. "/docs/plan.md", "# Plan\n\n## Steps\none\n")
  sh({ "git", "add", "-A" })
  sh({ "git", "commit", "-qm", "one" })
  local base = sh({ "git", "rev-parse", "HEAD" })
  write(repo .. "/code/x.py", "a\nB\nc\nd\ne\nf\n")
  write(repo .. "/code/y.py", "new\n")
  write(repo .. "/docs/plan.md", "# Plan\n\n## Steps\none\ntwo\n")
  sh({ "git", "rm", "-q", "code/gone.py" })
  sh({ "git", "add", "-A" })
  sh({ "git", "commit", "-qm", "two" })
  local head = sh({ "git", "rev-parse", "HEAD" })
  sh({ bin, "review", "open", base .. "..HEAD", "--title", "Toy change" })
  local id = vim.fn.glob(repo .. "/notes/reviews/REV-*.md"):match("(REV%-%d+%-%w+)")
  check(id, "review opened")
  sh({ bin, "review", "comment", id, "--at", "code/x.py:2-3", "why B?" })
  sh({ bin, "review", "comment", id, "general remark" })
  sh({ bin, "review", "comment", id, "--at", "docs/plan.md#Steps", "a step is missing" })
  sh({ bin, "review", "reply", id, "T1", "it is the capital" })
  sh({ bin, "review", "address", id, "T3", "--author", "agent:claude", "--commit", head, "added two" })
  local page_path = vim.fn.glob(repo .. "/notes/reviews/REV-*.md")

  -- parsing the page as review.rs does
  local f = assert(io.open(page_path))
  local text = f:read("*a")
  f:close()
  local p = review.parse(text)
  eq(p.meta.base, base, "base")
  eq(p.meta.head, head, "head")
  eq(p.meta.target.kind, "range", "target kind under target:")
  eq(p.meta.status, "open", "status without its comment")
  eq(#p.threads, 3, "three threads")
  eq(p.threads[1].anchor, { kind = "lines", path = "code/x.py", from = 2, to = 3, commit = head:sub(1, 7) }, "lines anchor")
  eq(p.threads[1].quote, { "B", "c" }, "quoted lines")
  eq(p.threads[1].replies[2].text, "it is the capital", "reply text")
  eq(p.threads[2].anchor, { kind = "general" }, "general anchor")
  eq(p.threads[3].anchor.kind, "heading", "heading anchor")
  eq(p.threads[3].anchor.heading, "Steps", "heading")
  eq(p.threads[3].state, "addressed", "addressed state")
  eq(p.threads[3].replies[2].action, "addressed", "addressed reply")
  eq(p.threads[3].replies[2].commit, head:sub(1, 7), "addressing commit")
  local more = review.parse("---\nid: REV-1\npaths: [a, b]\n---\n\n## Summary\nok\n\n## Threads\n\n### T1 (resolved) general\n- 2026-10-26 14:05 ank: note the reuse\n  on the run page\n- 2026-10-26 15:10 ank resolved\n")
  eq(more.meta.paths, { "a", "b" }, "inline paths")
  eq(more.summary, { "ok" }, "summary")
  eq(more.threads[1].replies[1].text, "note the reuse\non the run page", "continued reply")
  eq(more.threads[1].replies[2].action, "resolved", "resolved reply")
  eq(review.parse_anchor("a/b.py:7 @ abc1234"), { kind = "lines", path = "a/b.py", from = 7, to = 7, commit = "abc1234" }, "one-line anchor")

  -- the overview
  vim.cmd.edit(repo .. "/notes/README.md")
  local rv, ov = review.open(id)
  check(rv and ov, "overview opened")
  local lines = vim.api.nvim_buf_get_lines(ov, 0, -1, false)
  local all = table.concat(lines, "\n")
  check(all:find("Files %(4%)"), "four changed files: " .. all)
  check(all:find("  M  code/x.py   %(1 thread%)"), "x.py with its thread")
  check(all:find("  A  code/y.py"), "an added file")
  check(all:find("  D  code/gone.py"), "a deleted file")
  check(all:find("Threads %(3, 3 unsettled%)"), "threads counted")
  check(all:find("T3 %(addressed%) docs/plan.md#Steps"), "heading thread listed")
  local qf = vim.fn.getqflist({ title = 1, items = 1 })
  eq(#qf.items, 3, "threads in the quickfix list")
  eq(qf.title, id .. " threads", "quickfix title")
  eq(qf.items[1].lnum, 2, "quickfix at the anchor's line")
  eq(vim.api.nvim_buf_get_name(qf.items[1].bufnr), review.bufname(repo, head, "code/x.py"), "quickfix names the file at head")

  -- a file's diff, with its thread drawn
  local function line_of(pat)
    for i, l in ipairs(vim.api.nvim_buf_get_lines(ov, 0, -1, false)) do
      if l:find(pat) then
        return i
      end
    end
  end
  vim.api.nvim_win_set_cursor(0, { line_of("M  code/x.py"), 0 })
  review.activate(ov)
  local wins = vim.api.nvim_tabpage_list_wins(0)
  eq(#wins, 2, "two windows")
  local left, right = vim.api.nvim_win_get_buf(wins[1]), vim.api.nvim_win_get_buf(wins[2])
  eq(vim.api.nvim_buf_get_name(left), review.bufname(repo, base, "code/x.py"), "base on the left")
  eq(vim.api.nvim_buf_get_name(right), review.bufname(repo, head, "code/x.py"), "head on the right")
  eq(vim.api.nvim_buf_get_lines(left, 0, -1, false), { "a", "b", "c", "d", "e" }, "base content")
  eq(vim.api.nvim_buf_get_lines(right, 0, -1, false), { "a", "B", "c", "d", "e", "f" }, "head content")
  check(vim.wo[wins[1]].diff and vim.wo[wins[2]].diff, "both in diff mode")
  eq(vim.bo[right].filetype, "python", "filetype from the path")
  check(not vim.bo[right].modifiable, "read-only")
  local ns = vim.api.nvim_create_namespace("yajna_review")
  local marks = vim.api.nvim_buf_get_extmarks(right, ns, 0, -1, { details = true })
  local signs, virt = {}, nil
  for _, m in ipairs(marks) do
    if m[4].sign_text then
      signs[#signs + 1] = m[2] + 1
    end
    if m[4].virt_lines then
      virt = m[4].virt_lines
    end
  end
  eq(signs, { 2, 3 }, "signs on the anchored lines")
  check(virt and virt[1][1][1]:find("T1 %(open%)"), "thread drawn under its lines")
  eq(#vim.api.nvim_buf_get_extmarks(left, ns, 0, -1, {}), 0, "nothing on the base side")

  -- a deleted file: the head side is empty
  vim.cmd.tabclose()
  vim.api.nvim_set_current_buf(ov)
  vim.api.nvim_win_set_cursor(0, { line_of("D  code/gone.py"), 0 })
  review.activate(ov)
  wins = vim.api.nvim_tabpage_list_wins(0)
  eq(vim.api.nvim_buf_get_lines(vim.api.nvim_win_get_buf(wins[1]), 0, -1, false), { "old" }, "deleted file at base")
  eq(vim.api.nvim_buf_get_lines(vim.api.nvim_win_get_buf(wins[2]), 0, -1, false), { "" }, "and empty at head")
  vim.cmd.tabclose()

  -- a heading thread opens its diff at the heading
  vim.api.nvim_set_current_buf(ov)
  vim.api.nvim_win_set_cursor(0, { line_of("T3 %(addressed%)"), 0 })
  review.activate(ov)
  local hits = review.threads_in(0)
  eq(#hits, 1, "heading thread found in the file")
  eq(hits[1].from, 3, "at the heading's line")
  vim.cmd.tabclose()

  -- who writes: the person, not an agent's handle in the environment
  local person = require("yajna").config(repo).author
  check(person and not person:match("^agent:"), "the notebook's author is a person")
  vim.env.YAJNA_AUTHOR = "agent:claude"
  eq(review.author(repo), person, "an agent's YAJNA_AUTHOR gives way to the notebook's author")
  vim.env.YAJNA_AUTHOR = "someone"
  eq(review.author(repo), "someone", "a person's YAJNA_AUTHOR is kept")
  vim.env.YAJNA_AUTHOR = "agent:claude"

  -- writing through the CLI: comment on lines at head, reply and resolve by the cursor
  vim.api.nvim_set_current_buf(ov)
  vim.api.nvim_win_set_cursor(0, { line_of("M  code/x.py"), 0 })
  review.activate(ov)
  wins = vim.api.nvim_tabpage_list_wins(0)
  vim.api.nvim_set_current_win(wins[2])
  review.comment("why add f?", 6, 6, true)
  p = review.parse(io.open(page_path):read("*a"))
  eq(#p.threads, 4, "a fourth thread")
  eq(p.threads[4].raw_anchor, "code/x.py:6 @ " .. head:sub(1, 7), "anchored at head")
  eq(p.threads[4].replies[1].author, person, "written as the person")
  local after = vim.api.nvim_buf_get_extmarks(vim.api.nvim_win_get_buf(wins[2]), ns, 0, -1, { details = true })
  local sign6 = false
  for _, m in ipairs(after) do
    if m[2] == 5 and m[4].sign_text then
      sign6 = true
    end
  end
  check(sign6, "the new thread is drawn at once")
  vim.api.nvim_win_set_cursor(0, { 2, 0 })
  review.reply("ok, keep it")
  review.resolve("settled")
  p = review.parse(io.open(page_path):read("*a"))
  eq(p.threads[1].replies[3].text, "ok, keep it", "reply to the thread under the cursor")
  eq(p.threads[1].state, "resolved", "resolved by the thread under the cursor")
  review.reply("T4 because the tests need it")
  p = review.parse(io.open(page_path):read("*a"))
  eq(p.threads[4].replies[2].text, "because the tests need it", "reply to a named thread")

  -- the base side takes no comments
  vim.api.nvim_set_current_win(wins[1])
  review.comment("no", 1, 1, true)
  p = review.parse(io.open(page_path):read("*a"))
  eq(#p.threads, 4, "no thread from the base side")

  -- the overview follows the page
  vim.cmd.tabclose()
  all = table.concat(vim.api.nvim_buf_get_lines(ov, 0, -1, false), "\n")
  check(all:find("Threads %(4, 3 unsettled%)"), "overview re-rendered: " .. all)
  check(all:find("T1 %(resolved%)"), "T1 shown resolved")

  -- the CLI's validation still holds the page
  sh({ bin, "validate" })
end
