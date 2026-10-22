# IDs and links

Every page except log days and reading notes has an `id`, and its file name starts with it:
`EXP-20261022-cwr123-does-a-42c-pulse-slow-growth.md`. The rest of the name is decoration;
renaming the file never breaks a link. IDs are allocated by the CLI and are never reused or
edited by hand.

## Two kinds of ID

**Date IDs** for the pages there are many of: experiments, analyses, runs, artifacts, docs
and agent sessions.

```text
EXP-20261022-cwr123
    ^^^^^^^^ ^^^^^^
    UTC date  4 characters of time of day + 2 random
```

The six characters after the date sort by the time of creation, so a plain `ls` lists a
day's runs in order. Two people, two branches or two agents can create them at the same
moment without colliding, and nothing needs a central counter.

**Counter IDs** for the pages there are few of, which people refer to by name:
projects, protocols, materials, equipment and builds.

```text
PRJ-0002   PRO-0012   MAT-0210   EQP-0007   BLD-0003
```

The next number for each prefix is in `notes/counters.yaml`. Because a counter can be
advanced on two branches at once, create these on `main`; [Working in
parallel](../guides/parallel.md) has the rules and the fix when it goes wrong.

IDs are global within a notebook, not per project: `EXP-20261022-cwr123` is that one
experiment wherever it is mentioned.

## Links

Link to any page by ID in double brackets, anywhere in a body:

| Write | Means |
|-------|-------|
| `[[EXP-20261022-cwr123]]` | that experiment |
| `[[EXP-20261022-cwr123\|the heat shock run]]` | the same, shown with other text |
| `[[PRO-0012@3]]` | version 3 of a protocol |
| `[[mylab/PRO-0012]]` | a page in another notebook (below) |
| `@shih2015cloning` or `[@shih2015cloning]` | a paper, by citation key |

Frontmatter fields that name other pages (`project`, `experiment`, `influenced_by`,
`materials`, `protocols` and so on) take the bare ID. Links inside code spans and code
blocks are left alone.

`yajna validate` fails on a link to an ID no page has. That is the point: a notebook whose
links all resolve can be trusted to mean what it says a year later.

## Listing children

A project page lists its experiments, and an experiment page its runs, one per line with a
sentence after the link:

```markdown
## Experiments
- [[EXP-20261019-a3f9k2]] is the ring constricting at a constant rate? Yes, 0.8 nm/s.
- [[EXP-20261022-cwr123]] does a 42C pulse slow growth in YPD?
```

The sentence is required there; a bare `- [[EXP-...]]` fails validation. It is what the
site shows in the project's experiment table and what a reader gets without opening the
page, so rewrite it when the outcome is known. Links in ordinary prose need no sentence.

## Other repositories

A notebook can link into another one by its *namespace*, the name it gives itself in its
`yajna.toml`. List the ones you link to under `[repos]`:

```toml
namespace = "mylab"

[repos]
rc2s2 = "github:leoank/rc2s2"                                   # where it lives
yajna = { url = "github:leoank/yajna", path = "../yajna/main" }  # and where it is checked out
```

Then `[[rc2s2/EXP-20261003-k7f3x1]]` links into `rc2s2`. A namespace missing from `[repos]`
fails validation; the target ID itself is checked only when the other repository has a
`path` that exists on disk. A project repository links to its lab's protocols and
materials this way.

## When IDs change

Two commands change IDs, and both rewrite every reference across the notebook:

- **`yajna renumber <ID>`** gives a page with a counter ID the next free number. It exists
  to fix two branches that allocated the same number; see [Working in
  parallel](../guides/parallel.md).
- **`yajna migrate-ids`** moves a notebook from older ID forms (counter experiments and
  analyses like `EXP-0007`, and date IDs with a four-character suffix like
  `RUN-20261016-k7f3`) to the current ones. It is deterministic, so every clone and
  worktree that runs it gets the same new IDs. `--dry-run` lists them first.

A migrated page keeps its old ID as `previous_id`. Commands still accept the old ID, and
validation names the new one when it finds a stale link.
