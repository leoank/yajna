# The daily log

The log is the notebook's journal: what you did, when, and what you noticed, written as it
happens. Pages are the curated record you return to and revise; the log is never revised.

```console
$ yajna log "Started induction for [[EXP-20261022-cwr123]] with [[MAT-0210]], 0.2 mM. #bench"
notes/log/2026/2026-10-22.md: 14:02 Started induction for [[EXP-20261022-cwr123]] with [[MAT-0210]], 0.2 mM. #bench
```

Each author has one file per day, `notes/log/<year>/<date>.md` for you and
`<date>.<author>.md` for anyone else, such as `2026-10-22.agent-claude.md`. A line is
`- HH:MM text`, appended at the end, never reordered or edited. The file is created with
its frontmatter the first time you log that day.

```markdown
---
type: log
date: 2026-10-22
author: ada
schema_version: 1
---

- 09:10 Streaked plates for [[EXP-20261022-cwr123]]. #bench
- 14:02 Started induction with [[MAT-0210]], 0.2 mM.
- 14:20 Cells look stressed at 0.2 mM. Halving next time. Note for [[PRO-0012]].
```

## Writing it

- **Link what you mention.** `[[ID]]` in a log line is what makes `yajna timeline` able
  to show every moment a material or an experiment came up. In interactive mode
  (`yajna log` with no text), typing `[[` completes IDs and titles.
- **Log when you start, when something surprises you, and when you finish.** A line that
  says why you changed course is worth more than ten that say what you ran.
- **Back-fill honestly.** `--time 14:20` and `--date 2026-10-21` record when something
  happened rather than when you wrote it down.
- **Read from stdin** when the text is long or comes from a script:
  `echo "..." | yajna log`.
- Tags such as `#bench` are free text; use them if you search by them.

Photos and audio notes from the bench go in `notes/log/<year>/<date>/` and are embedded
from the line that mentions them. When an image is a result rather than a note, make it an
artifact page instead.

## Log or page?

Write in the log what happened; write on a page what is now true. A run page says what the
run did and what it showed; the log says that at 14:20 the cells looked stressed and you
decided to halve the dose. When a project's *Current belief* changes, the page is
rewritten and the log keeps the line that records when and why.
