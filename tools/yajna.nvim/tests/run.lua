-- Headless tests: nvim --headless -u NONE --cmd "set rtp+=tools/yajna.nvim" -l tools/yajna.nvim/tests/run.lua
-- Builds a scratch lab and a project repo next to it and checks resolution and parsing.

local yajna = require("yajna")
local failures = 0

local function check(cond, msg)
  if not cond then
    failures = failures + 1
    io.stderr:write("FAIL: " .. msg .. "\n")
  end
end

local function eq(a, b, msg)
  check(vim.deep_equal(a, b), ("%s: %s ~= %s"):format(msg, vim.inspect(a), vim.inspect(b)))
end

local function write(path, text)
  vim.fn.mkdir(vim.fs.dirname(path), "p")
  local f = assert(io.open(path, "w"))
  f:write(text)
  f:close()
end

local tmp = vim.fn.tempname()
vim.fn.mkdir(tmp, "p")
tmp = vim.uv.fs_realpath(tmp)
local lab = tmp .. "/lab-repo"
local prj = tmp .. "/toy"
write(lab .. "/yajna.toml", 'shape = "lab"\nnamespace = "yajna"\nvault = "lab"\n\n[repos]\ntoy = { url = "github:x/toy", path = "../toy" }\n')
write(lab .. "/lab/projects/PRJ-0001-archaeal/README.md", "---\nid: PRJ-0001\ntitle: Archaeal division\n---\n")
write(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md", "---\nid: EXP-0001\ntitle: \"Timing: a colon\"\n---\nSee [[PRO-0012@3|the protocol]] and [[toy/EXP-0001]] with [@shih2015cloning] and @nobody2020.\n")
write(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001/notes.md", "sidecar, not a page\n")
write(lab .. "/lab/projects/PRJ-0001-archaeal/runs/RUN-20261016-k7f3.md", "---\nid: RUN-20261016-k7f3\n---\n")
write(lab .. "/lab/protocols/PRO-0012-transformation.md", "---\nid: PRO-0012\ntitle: Transformation\n---\n")
write(lab .. "/lab/references/shih2015cloning.md", "---\ncitekey: shih2015cloning\n---\n")
write(lab .. "/references/library.bib", "@book{other,\n  title = {x}\n}\n@article{nobody2020,\n  title = {y}\n}\n")
write(prj .. "/yajna.toml", 'shape = "project"\nnamespace = "toy"\n')
write(prj .. "/lab/README.md", "---\nid: PRJ-0001\ntitle: Toy\n---\n")
write(prj .. "/lab/experiments/EXP-0001-e.md", "---\nid: EXP-0001\ntitle: E\n---\n")

-- root and config
vim.cmd.edit(lab .. "/lab/protocols/PRO-0012-transformation.md")
eq(yajna.root(0), lab, "root from a page")
local cfg = yajna.config(lab)
eq(cfg.vault, lab .. "/lab", "vault")
eq(cfg.repos.toy.path, "../toy", "repos path")
eq(cfg.bibliography, lab .. "/references/library.bib", "default bibliography")
eq(yajna.config(prj).bibliography, prj .. "/lab/references/library.bib", "project bibliography")

-- resolution by filename
eq(yajna.resolve(lab, "PRO-0012"), lab .. "/lab/protocols/PRO-0012-transformation.md", "protocol")
eq(yajna.resolve(lab, "EXP-0001"), lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md", "experiment, not its sidecar dir")
eq(yajna.resolve(lab, "PRJ-0001"), lab .. "/lab/projects/PRJ-0001-archaeal/README.md", "project README")
eq(yajna.resolve(lab, "RUN-20261016-k7f3"), lab .. "/lab/projects/PRJ-0001-archaeal/runs/RUN-20261016-k7f3.md", "run")
eq(yajna.resolve(lab, "PRO-0099"), nil, "missing")
eq(yajna.resolve(prj, "PRJ-0001"), prj .. "/lab/README.md", "project-shaped repo")
eq(yajna.resolve(prj, "EXP-0001"), prj .. "/lab/experiments/EXP-0001-e.md", "project-shaped experiment")
eq(yajna.resolve_ns(lab, "toy", "EXP-0001"), prj .. "/lab/experiments/EXP-0001-e.md", "namespaced")
local _, err = yajna.resolve_ns(lab, "nope", "EXP-0001")
check(err and err:match("no path"), "unknown namespace reports")

-- parsing
eq(yajna.id_prefix("EXP-0001-timing.md"), "EXP-0001", "curated id stops before the slug")
eq(yajna.id_prefix("RUN-20261016-k7f3.md"), "RUN-20261016-k7f3", "volume id keeps its suffix")
eq(yajna.id_prefix("notes.md"), nil, "no id")
eq(yajna.parse_target("PRO-0012@3|the protocol"), { id = "PRO-0012", version = "3" }, "target with version and label")
eq(yajna.parse_target("toy/EXP-0001"), { ns = "toy", id = "EXP-0001" }, "namespaced target")
eq(yajna.parse_target("not a link"), nil, "prose in brackets")
local line = "See [[PRO-0012@3|the protocol]] and [[toy/EXP-0001]] with [@shih2015cloning] and @nobody2020, not PRO-0012@3 nor a@b.com."
eq(yajna.at_cursor(line, 4), { kind = "link", target = "PRO-0012@3|the protocol" }, "cursor on [[")
eq(yajna.at_cursor(line, 20), { kind = "link", target = "PRO-0012@3|the protocol" }, "cursor on label")
eq(yajna.at_cursor(line, 40), { kind = "link", target = "toy/EXP-0001" }, "second link")
eq(yajna.at_cursor(line, 60), { kind = "cite", key = "shih2015cloning" }, "bracketed citation")
eq(yajna.at_cursor(line, 80), { kind = "cite", key = "nobody2020" }, "bare citation")
eq(yajna.at_cursor(line, 33), nil, "between links")
eq(yajna.at_cursor(line, #line - 3), nil, "email is not a citation")

-- follow from a real buffer
vim.cmd.edit(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md")
vim.api.nvim_win_set_cursor(0, { 5, 6 })
check(yajna.follow(), "follow returns true on a link")
eq(vim.api.nvim_buf_get_name(0), lab .. "/lab/protocols/PRO-0012-transformation.md", "followed to the protocol")
vim.cmd.edit(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md")
vim.api.nvim_win_set_cursor(0, { 5, 40 })
yajna.follow()
eq(vim.api.nvim_buf_get_name(0), prj .. "/lab/experiments/EXP-0001-e.md", "followed across repos")
vim.cmd.edit(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md")
vim.api.nvim_win_set_cursor(0, { 5, 60 })
yajna.follow()
eq(vim.api.nvim_buf_get_name(0), lab .. "/lab/references/shih2015cloning.md", "citation with a note")
vim.cmd.edit(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md")
vim.api.nvim_win_set_cursor(0, { 5, 80 })
yajna.follow()
eq(vim.api.nvim_buf_get_name(0), lab .. "/references/library.bib", "citation without a note opens the bib")
eq(vim.api.nvim_win_get_cursor(0)[1], 4, "at its entry")
vim.cmd.edit(lab .. "/lab/projects/PRJ-0001-archaeal/experiments/EXP-0001-timing.md")
vim.api.nvim_win_set_cursor(0, { 1, 0 })
check(not yajna.follow(), "nothing under the cursor")

-- entities and backlinks
local ids = vim.tbl_map(function(e) return e.id end, yajna.entities(lab))
eq(ids, { "EXP-0001", "PRJ-0001", "PRO-0012", "RUN-20261016-k7f3" }, "entities by filename, sidecars skipped")
eq(yajna.entities(lab)[1].title, "Timing: a colon", "quoted title unquoted")
eq(yajna.entities(prj)[2].id, "PRJ-0001", "project-shaped README is the project")
vim.cmd.edit(lab .. "/lab/protocols/PRO-0012-transformation.md")
eq(yajna.current_id(), "PRO-0012", "current id")
yajna.backlinks()
local qf = vim.fn.getqflist()
eq(#qf, 1, "one backlink")
check(qf[1] and vim.fs.basename(vim.fn.bufname(qf[1].bufnr)) == "EXP-0001-timing.md", "backlink from the experiment")

if failures > 0 then
  io.stderr:write(failures .. " failure(s)\n")
  os.exit(1)
end
print("yajna.nvim: all checks passed")
