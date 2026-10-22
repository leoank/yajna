# Authors, agents and review

A notebook belongs to one person, but more than one hand writes in it: the person, and the
agents working for them. Every page and every log line says who wrote it, in `author`.

## Who is writing

The author of anything yajna creates is, in order of precedence:

1. `--author <handle>` on the command,
2. the `YAJNA_AUTHOR` environment variable,
3. `.yajna/author` at the repository root, which `yajna worktree` writes for the agent of
   that worktree (never committed),
4. `author` in `yajna.toml`: you.

A handle is lowercase letters, digits, `-` and `_`. Agents use `agent:<name>`, such as
`agent:claude`, and set it once for the session:

```sh
export YAJNA_AUTHOR=agent:claude
```

An agent's log lines go to its own file for the day (`2026-10-22.agent-claude.md`), so the
human's and the agent's logs never conflict in a merge.

**The author of a run is whoever executed it.** If an agent ran the script, the run page
says `agent:claude`, even though you asked for it.

## Agent sessions

An agent opens a session page when it starts a piece of work:

```sh
yajna new agent "Fit growth curves for the heat shock runs"
```

The `AGS` page records the task, the model and harness, when it started and finished, the
pages it created and edited, and what happened. It is how you find out later what an agent
did and why, without reading its transcript.

## Review

Some pages are claims about the world that you sign: experiments, protocols, materials.
When an agent creates or edits one, it sets

```yaml
review: pending
```

in the frontmatter. You read the page, change what needs changing, and set
`review: approved` (or remove the field). The conclusion of an experiment is written once,
by a person; an agent proposes one in its session page or the log instead.

The [Claude Code plugin](../guides/claude-code.md) teaches agents all of this.
