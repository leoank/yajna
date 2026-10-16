# rc2s2 architecture questions

Answers here feed `docs/architecture.md`. Each question has a recommended
default; write your answer under **Answer:**.

Starting constraints already agreed:

- Server in Rust.
- First client is an Android app.
- Only Claude Code as the agent for now.

## 1. How the hub sees and controls a Claude Code session

The biggest decision. Options:

- a. **Hooks.** Claude Code hooks for session start, prompt submit, tool use
  before and after, notifications, and stop. They post events to a local
  daemon. PreToolUse hooks can block or allow, so this gives interception on
  any session, including ones started by hand in a terminal.
- b. **Spawn through the Agent SDK.** A node daemon launches headless sessions
  and owns stdin, stdout, and the permission callback. Full control, but only
  for sessions rc2s2 starts.
- c. **PTY or tmux wrapper.** Observe the raw terminal and inject keystrokes.
  Works for anything, but brittle to parse.
- d. **Passive transcript tailing** of the JSONL files under
  `~/.claude/projects` as a backfill when hooks are missed.

Recommendation: a plus d in phase 1, b added later for remote spawn.

Sub-question: do you mostly run sessions interactively in a terminal and want
to watch and step in from the phone, or do you want to launch sessions from
the phone?

**Answer:**

## 2. What "intervene" must mean in phase 1

Candidates:

- approve or deny a tool call
- answer a question Claude asks
- send a follow-up prompt
- interrupt the current turn
- kill the session
- start a new session on a node in a chosen repo
- edit a pending tool input before it runs

Recommendation: approve/deny, answer question, and interrupt in phase 1.
Prompt and spawn in phase 2.

**Answer:**

## 3. Topology

Proposed: one small Rust node daemon per machine that collects hook events
and health metrics and keeps an outbound connection to a central hub. Clients
talk only to the hub.

Is that right? Where does the hub live: a home server, a VPS, or a machine on
your tailnet?

**Answer:**

## 4. Network and auth

Strictly single-user on a Tailscale network, or reachable over the public
internet?

Recommendation: tailnet only, pre-shared token per node and per client, TLS
terminated by the hub. This decides how much auth work goes into phase 1.

**Answer:**

## 5. Protocol

- JSON over WebSocket with a schema, or
- gRPC with protobuf and generated Kotlin, Swift, and TypeScript types.

Recommendation: protobuf for the wire types with gRPC streams, since four
kinds of clients are planned.

Sub-question: should node-to-hub and client-to-hub share the same protocol?

**Answer:**

## 6. Storage and records

Which of these per run: full event stream, tool inputs and outputs, diffs
produced, token and cost usage, git state at start and end?

Recommendation: SQLite in WAL mode embedded in the hub, full event stream, no
retention limit for now.

Sub-question: Postgres instead?

**Answer:**

## 7. Node health

What counts as health: CPU, memory, disk, running claude processes, usage and
rate limit state, repo dirty status?

Last known state only, or a time series you can chart?

Recommendation: snapshot every 30 seconds, kept as a time series in the same
SQLite file.

**Answer:**

## 8. Push notifications

The phone must wake when a session is blocked on you. Options:

- FCM, which needs a Firebase project.
- Self-hosted ntfy or UnifiedPush.
- Persistent foreground service, which costs battery.

Recommendation: self-hosted ntfy on the hub machine.

**Answer:**

## 9. Android stack

- Kotlin with Jetpack Compose, pure native.
- Shared Rust client core exposed through UniFFI, with Compose on top, so iOS
  and custom integrations reuse the same core later.

Recommendation: UniFFI core plus Compose. More setup in phase 1.

**Answer:**

## 10. Agent abstraction

Claude only for now. Thin adapter boundary for other agents from day one, or
hard-code Claude Code and refactor later?

Recommendation: thin adapter trait, single implementation.

**Answer:**

## 11. Policy

Human in the loop only, or also rules such as auto-approve read-only tools on
a given node?

Recommendation: human only in phase 1, rules later.

**Answer:**

## 12. The custom integrations

Which app do you want to integrate into first? Is one of them this yajna lab,
for example linking sessions to a PRJ id? This shapes the public API.

**Answer:**

## 13. Deployment and repo layout

Proposed: hub as a NixOS module and node daemon as a home-manager service
through neusis. Cargo workspace inside the project folder with crates for hub,
node, proto, and client core, plus an android directory.

Does that match what you expect?

**Answer:**

## 14. What existing remote-driving tools fall short on

Claude Code's own Remote Control already attaches a phone to a local session.
Name the gap in one or two lines so the architecture doc is honest about what
rc2s2 adds.

**Answer:**
