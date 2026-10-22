# Claude Code

Coding agents are first-class users of a yajna notebook: they read it as context, record the
runs they execute, and log what they did. The `yajna` plugin for Claude Code teaches them
how.

## Installing the plugin

The yajna repository is a plugin marketplace. In Claude Code:

```text
/plugin marketplace add leoank/yajna
/plugin install yajna@yajna
```

or from a shell, `claude plugin marketplace add leoank/yajna` and
`claude plugin install yajna@yajna`. Update later with `/plugin marketplace update yajna`.

On a machine configured with Nix, declare it in Claude Code's settings instead, so every
machine gets the same plugin:

```json
{
  "extraKnownMarketplaces": {
    "yajna": { "source": { "source": "github", "repo": "leoank/yajna" } }
  },
  "enabledPlugins": { "yajna@yajna": true }
}
```

## What it gives the agent

**The `yajna` skill**, loaded whenever a task touches a notebook. It tells the agent to:

- identify itself (`YAJNA_AUTHOR=agent:claude`) and never write as you,
- read the project page, `yajna tree` and the experiment's runs before starting,
- open a session page (`yajna new agent "<task>"`) and keep it current,
- create pages only through the CLI, and never invent or edit an ID,
- log when it starts, when something surprises it, and when it finishes,
- give every compute run it records a script that re-creates it,
- mark experiments, protocols and materials it edits `review: pending`, and leave the
  *Conclusion* to you,
- in a worktree, stay inside its branch's project and allocate nothing that collides,
- run `yajna validate` before reporting anything as done.

**Project commands** that start a project with an interview rather than a guess:

| Command | For |
|---------|-----|
| `/yajna:project <brief>` | Any project |
| `/yajna:code-project <brief>` | Software: the architecture, then `code/<slug>/` with a flake, a design document with decision records, and the first spikes as experiments |
| `/yajna:bio-project <brief>` | Wet lab: the biological question, system, readouts, protocols, materials, controls and safety |
| `/yajna:ml-project <brief>` | Machine learning: data, baseline, metric, compute and the sweep plan, with `===RESULT===` instrumentation and reproducible runs |
| `/yajna:hardware-project <brief>` | Builds: purpose, interfaces, parts, design sources, revisions, assembly and characterization |

Each reads the notebook first (is this a new project, or an experiment in an existing
one?), asks you one topic at a time until the question, success criteria, scope,
constraints, risks and first experiments are pinned down, and only then creates the project
page, the first experiments and, for code, the scaffold.

## Without the plugin

The skill is also built into the binary:

```sh
yajna skill            # writes .claude/skills/yajna/SKILL.md in this repository
yajna skill --print    # shows it
```

`yajna init` writes it too, so a fresh notebook already carries it. Other agents can be
pointed at the same file; the conventions are not specific to Claude.

## Working with an agent

- Let the agent work in its own worktree when you are working too: `yajna worktree PRJ-0003
  <topic>` (see [Working in parallel](parallel.md)).
- Ask research questions of the notebook, not of the agent's memory: *which runs of this
  experiment did best?* is `yajna runs`, and the agent should answer from it.
- Review its session pages and the pages it marked `review: pending`; approve by setting
  `review: approved`.
