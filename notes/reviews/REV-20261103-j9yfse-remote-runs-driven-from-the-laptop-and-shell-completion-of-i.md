---
id: REV-20261103-j9yfse
type: review
schema_version: 1
title: Remote runs driven from the laptop, and shell completion of IDs
project: null
target:
  kind: range               # branch | range | page | run | experiment | phase
  ref: HEAD..HEAD
base: 2c88d86bf47d9ffe05b5243b75d6bedf7a95a56d
head: 98aff489a9754f9df3d5f69f1046fabfc32455c6
rounds: [2c88d86bf47d9ffe05b5243b75d6bedf7a95a56d, 742f1fc70d40624a69eeb6f1945f7105e7011da3, 81e3e31c46cdc262a7ef28ea9f2115b11dd051df, 056f4b069185b4aeeccf0719b6695740796682b7, ba7a8dd5bd419cca770637aeaf88e5e74706eaf3]
paths: []
about: [PRJ-0001]
status: approved          # open | changes_requested | approved | merged | closed
created: 2026-11-03
author: agent:claude
---

## Summary
Two features of yajna 0.23.0, one commit each, for [[PRJ-0001]]'s Phase 1e and its tooling.
Opened by agent:claude in [[AGS-20261103-j9yg23]].

**2c665ad, shell completion.** `source <(COMPLETE=zsh yajna)` loads clap_complete's dynamic
hook, which asks the binary for candidates as you type. Arguments that take a run, an
experiment, a project, a review or any page complete from the notebook the shell is in,
each with its title, or for a run the line its experiment lists it with.
- `tools/yajna/src/complete.rs`: the candidates (about 80 lines).
- `tools/yajna/src/cli.rs`: one `#[arg(add = ArgValueCandidates::new(...))]` per ID
  argument (39 of them); `main.rs`: the hook, before anything is printed.
- `docs/guide/src/install.md` *Shell completion*; test `ids_complete_from_the_notebook_with_their_titles`.

**742f1fc, `--on <host>` driven from the laptop** (ADR-0033, amending ADR-0031). The other
machine needs a checkout of the notebook, git, tar and Nix, not yajna; a reproduction's page,
logs and in-repo outputs are written here.
- Read first: `docs/decisions/ADR-0033-remote-runs-from-the-laptop.md`, then
  `docs/reproduce.md` section 9.
- `tools/yajna/src/rerun.rs`: `Remote`, `Tree` and `Tree::command` (here, or `ssh -t|-T`
  with every word quoted); `open_tree` decides the commit, overlay, flake and banner from
  this repository, then makes the worktree here or runs the remote script (fetch, worktree
  add or reuse, untar the overlay, write `<worktree>.overlay`); `reproduce` gathers the
  outputs into the new run's directory and streams them back; `clean --on`.
- Test `on_a_host_the_laptop_drives_a_checkout_there_over_ssh`: an `ssh` stand-in runs
  each command locally against a second clone in another `$HOME`, so fetch, worktree, tar
  both ways and clean run for real.

**Decided without asking; worth a look:**
- Completion finds the notebook from the shell's directory; `--root` is not parsed while
  completing. Help text is cut at 70 characters.
- The hook is sourced at shell start, as clap advises, not shipped as a file in the package.
- `run clean` gained `--on`. With `--on`, `--out-root` must be an absolute path on that
  machine.
- On the remote, the worktree lives in `~/.cache/yajna/runs/<hash of host and root>/`. Its
  changes check ignores the copied-in files and the new run's directory, as here.
- The CLI tests clear `YAJNA_AUTHOR` (21 failed when an agent's shell exported it).

**Not verified:**
- `--on` against oppy. Its checkout is only fetched in and gains worktrees; its working
  tree, index and HEAD are not touched.
- `run record` sets `host` to this machine when the page has none, so recording a run that
  ran on oppy from the laptop names the laptop. There is no `--host` yet.
- An `env` value is checked for existence on the remote only when it is an absolute or
  `~/` path. A relative default inside a script (`code/<slug>/data`) resolves inside the
  worktree, where gitignored data is absent.

**Added after the first look (8661c4e, 81e3e31), 0.24.0:**
- `run record --host <machine>` and `--env NAME=VALUE` (also on `result`): a run that ran
  elsewhere is recorded from here with that machine and the values it used there. This
  closes the `host` gap listed under *Not verified*. In `reproduce.rs`: `env_of`, `record`.
- `--on` clones this repository's `origin` to the host's root when nothing is there, to the
  root less the notebook's path inside its repository (`clone_sh` in `rerun.rs`); `run
  clean --on` says there is nothing to clean. Tests
  `a_run_on_another_machine_is_recorded_with_its_host_and_values` and
  `on_a_host_without_the_checkout_it_is_cloned_from_origin`.

**To review:** `yajna serve --review --open` in this repo, or `yajna review show
REV-20261103-j9yfse --diff`.
- 2026-11-03 20:28 ank approved: Good enough for now. We'll revisit it later.

## Threads

### T1 (resolved) plugins/yajna/.claude-plugin/plugin.json:4 @ 81e3e31
```json
  "version": "0.18.1",
```
- 2026-11-03 18:28 ank: does it make sense to keep the plugin version in sync with the cli version?
- 2026-11-03 18:47 agent:claude: Yes, I think so. The skill is one file shipped two ways: the binary embeds plugins/yajna/skills/yajna/SKILL.md and `yajna skill` writes it into each notebook (that copy always matches the CLI the notebook's flake pins), while the marketplace plugin updates on its own. Its version, 0.18.1 against CLI 0.24.0, says nothing about which CLI the skill describes, and the two drift in practice: the installed plugin was 0.5.0 while manthan ran 0.22, so its skill told agents about commands from weeks earlier. Proposal: the plugin takes the CLI's version from now on (0.24.1 with the next round), both bumped together every round; a unit test fails when plugin.json and tools/yajna/Cargo.toml disagree, so a round cannot bump one alone; AGENTS.md's rule 'bump version in plugin.json on a change' becomes 'plugin.json carries the CLI's version'. A round that changes only the CLI then bumps the plugin with no content change, which costs a plugin update and nothing else. Say yes here and I will make it one commit and address this thread with it.
- 2026-11-03 18:49 ank: yes
- 2026-11-03 18:53 agent:claude addressed in 056f4b0: plugin.json now carries the CLI's version (0.24.0 at this commit; 0.24.1 with the held worktree fix), a CLI test fails when they differ, and AGENTS.md says so in place of 'bump on a change'
- 2026-11-03 19:05 ank resolved

### T2 (resolved) tools/yajna/src/complete.rs:1-3 @ ba7a8dd
```rs
//! Shell completion of IDs (`source <(COMPLETE=zsh yajna)`): an argument that takes a run,
//! an experiment, a project, a review or any page completes from the notebook the shell is
//! in, each ID with its title, or for a run the line its experiment lists it with.
```
- 2026-11-03 19:01 ank: Right now the completion gives you 200 options inside manthan. What would be a better for filtering by project or maybe adding an option for a picker?
- 2026-11-03 19:09 agent:claude: Four ways, which combine. (1) Only what the command can act on: run reproduce offers compute runs that recorded outputs or metrics, run shell runs with a commit, run record runs not yet done, review commands open reviews. In manthan that alone takes run reproduce from about 200 candidates to a handful. (2) A picker: leave the ID out on a terminal (or give -) and a fuzzy picker opens over the same candidates with their titles, matching words as you type. Shell completion can only match the start of the ID, so a picker is the way to search by what a run was; inquire, already a dependency, does it, and --pick exists for --in. (3) Narrow by what is already on the line: with --experiment EXP-… or --project PRJ-… typed, runs of that one only (the completer sees the whole command line). (4) Scope to where you are: in a project's directory, or a worktree of one project's branch, that project's IDs only. My suggestion: 1 and 2 now, 3 alongside since it is small, and 4 only if the first three are not enough, because a filter that depends on the current directory surprises you when you cd. Which would you like?
- 2026-11-03 19:19 ank: Do 1,2 and 3. But when using the picker, search among all candidates and not the filtered list from 1.
- 2026-11-03 19:25 agent:claude addressed in 98aff48: 1: each command completes only what it can act on: run shell runs with a commit (35 of manthan's runs), run reproduce runs with outputs or a results.tsv row (none in manthan yet, since none records them), run record runs not done, run clean runs with a worktree, thread commands open reviews. 2: leave the ID out of run shell, reproduce, record, diff, show or timeline on a terminal and inquire's fuzzy select opens over every ID of the kind, as you asked, not the narrowed list. 3: none of the run commands takes --experiment or --project, so 'what is already on the line' applies to run diff: its second run completes from the first one's experiment. Tests cover each; completion stays about 30 ms in manthan.
- 2026-11-03 20:27 ank resolved

### T3 (resolved) tools/yajna/src/reproduce.rs:35-39 @ ba7a8dd
```rs
        RunAction::Shell {
            run,
            command,
            working_tree,
            on,
```
- 2026-11-03 19:05 ank: Add an option to pass ssh param. And also right now the I am not dropped into the run dir, but in the root dir. And the prompt is broken. Is looks something like this: \[\][\[\]ank@oppy:~/.cache/yajna/runs/f9b08eace4a4b615/RUN-20261023-nvfv0n]$\[\]
- 2026-11-03 19:10 agent:claude addressed in ba7a8dd: --ssh "<options>" on run shell, reproduce and clean, added to ssh = "…" for the host in .yajna/hosts.toml, reach every ssh. A shell now starts in the run's directory (a -c command still runs from the notebook's root, where scripts expect to be). The prompt: inside nix develop -c, $SHELL on oppy is the build's bash-5.3 without readline, which printed \[ \] as they are; a shell over ssh now starts as plain nix develop <flake>, nix's interactive bash. Checked by tests with stand-ins for ssh and nix, and the cause on oppy; not yet by you in a real session there.
- 2026-11-03 19:21 ank resolved
