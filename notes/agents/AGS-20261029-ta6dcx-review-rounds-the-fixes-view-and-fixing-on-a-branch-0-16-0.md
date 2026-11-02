---
id: AGS-20261029-ta6dcx
type: agent_session
schema_version: 1
title: Review rounds, the fixes view and fixing on a branch (0.16.0)
model: "claude-opus-5-5"
harness: "claude-code"
started: 2026-10-29T23:57+00:00
finished: 2026-11-02T13:41+00:00
created_entities: []
edited_entities: []
outcome: done             # done | failed | aborted | pending
created: 2026-10-29
author: agent:claude
---

## Task
ank asked how to review an agent's fixes to a review when a large unrelated feature landed
between the review's head and the fixes. Build the three answers proposed: review rounds,
a view of each fixing commit on its own, and skill guidance to fix a past range on a
branch from its head (yajna 0.16.0, plugin 0.15.0).

## What happened
- Committed and pushed the 0.15.0 fix first (`da44ac3`, `b8eae05`, `99a8f54`).
- `review update` keeps the head it moved from in `rounds:`; `review show --round` diffs
  the last round to the head, and `show` prints the round.
- `review show --fixes` diffs each commit named in an `addressed in` reply against its
  parent in the review's paths, oldest first, leaving out the review page.
- `review comment --at … --commit <sha>` opens a thread on a fix, anchored at it.
- The served review gains `rounds`, `since` and `fixes`; `file` reads between two commits
  only when the review names both. The viewer lists *Since round N* and one *Fix* group per
  commit, draws a fix's threads in its diff and comments there at that commit.
- The skill: one commit per fix where possible; a past range with work after its head is
  fixed on a branch from that head, then `review update --to <branch>`.
- Docs: `review.md` v0.8 section 5.1, conventions, the guide's "Reading only the fixes".
- Decided without asking: a fix's diff is limited to the review's paths like the rest of
  the review; fixes are ordered by commit time; the rounds list holds full SHAs.
- Then, asked by ank: the image viewer's zoom threw the image off screen. panzoom zoomed a
  fixed 15% per wheel event (a trackpad sends dozens per gesture) with no bounds; replaced
  with our own pan and zoom, proportional to the delta, about the pointer, the image kept
  in view; dropped `@panzoom/panzoom` (yajna 0.17.0, ADR-0029 amended).
- Then: a Windows binary in the release (x86_64-pc-windows-msvc, zipped), a Windows build
  job in CI, the files server's symlink-loop check made portable (device and inode on
  Unix, the canonical path on Windows), install docs; yajna 0.18.0 tagged and released.
- 2026-10-31, from ank's report: the Windows binary wrote CRLF pages its validator rejected.
  Git for Windows checks out with CRLF, so the embedded templates had it. `.gitattributes`
  keeps the checkout LF, templates and the skill are normalised when read, and pages are
  read with `read_text` so a CRLF checkout of a notebook validates and edits. CI now builds
  a notebook with each Windows binary and validates it. Added the Windows ARM64 build and a
  README Quickstart; yajna 0.19.0 released.
- Bug report from ank (Windows): commands noted the notebook was registered twice, once with
  backslashes and once with forward slashes. `init` registers the root as Windows writes it;
  `git worktree list` prints `C:/…`. Paths from git are made native and registered paths
  compare normalised. Also: the registry and config fell back to `$HOME`, which Windows does
  not set, so they would land in the current directory; they now use the platform's home.
  CI reproduces the init-then-git sequence on both Windows runners.
- Bug report from ank (Windows): `yajna serve --open --review` panicked opening
  `/dev/urandom` for the review token. The token now comes from `getrandom` (the OS's secure
  source everywhere), failing with an error rather than a panic. `--open` and sync's sign-in
  ran `xdg-open` on Windows; one `open_url` uses rundll32 there. CI starts
  `serve --review` on both Windows runners.
- 2026-11-02, from ank's tasks (0.20.0): the files viewer wrote as the checkout's author, so
  a `serve --review` started in an agent's worktree or shell signed ank's comments as the
  agent and refused an approval. It now writes as the checkout's author unless that is an
  agent's, then as `yajna.toml`'s. `serve --review --open` opens the writable URL with its
  token rather than the read-only root.
- 2026-11-02, review viewer (0.20.0): picking lines took the line below once a thread sat
  above it. The thread boxes had vertical margins, which CodeMirror leaves out when it
  measures a block widget, so every box shifted the text 12px below where the editor
  placed its lines; the spacing is now padding on a wrapper. Reproduced and checked in a
  headless browser against a scratch notebook. New: a bar between the two sides resizes
  them, and *Unified* shows one pane with `unifiedMergeView`. The Focus blur did not
  reproduce in Brave, headless or windowed.
- 2026-11-02, the Focus "blur" (from ank's screen recording): the review flickered between
  two layouts every frame. At a browser zoom other than 100% dockview rounds its width up
  past the window's by a fraction of a pixel; the page then took a scrollbar, narrowed,
  dockview shrank to fit, the scrollbar went and the page widened again. Reproduced in a
  windowed Brave at 110% zoom with classic scrollbars (html alternating 1363.6 and 1350px
  wide); the page no longer scrolls (`overflow: hidden` on html and body), and all four
  combinations of Focus and Unified then hold one layout. A first guess (dockview's views
  not scrolling, a stable scrollbar gutter on the diff) did not fix it and was taken out.
- 2026-11-02, issue #1 (sync drops figures and flattens fenced blocks): Drive's HTML import
  cannot reach a local file, so a picture of the repo now travels inside the upload as a
  `data:` URI, and one on its own line becomes a centred figure with its alt text as the
  caption, in both the pulldown-cmark and the pandoc renderings. An SVG or a path outside
  the repo stops that page with the reason; a doc over Drive's 5 MB multipart limit says
  so. A fenced block becomes a monospaced paragraph with its lines and spaces. Mermaid is
  left as source (rendering it needs a headless browser). Tested against the fake Drive
  only: whether Docs keeps `data:` images on import is not yet checked against Google.
