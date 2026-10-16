---
id: EXP-0008
type: experiment
schema_version: 1
title: Leasing a Claude Code credential into a fresh config dir
project: PRJ-0002
status: active           # planned | active | paused | concluded | abandoned
outcome: null             # null | positive | negative | inconclusive | infra
influenced_by: []
created: 2026-10-16
author: ank
protocols: []
materials: []
tags: []
review: pending
---

## Question
Can a Claude Code credential be copied into a fresh `CLAUDE_CONFIG_DIR` and used for a
headless session without breaking the original login, and does a refresh rotate the
token? Fourth open question.

## Hypothesis and predictions
On macOS the OAuth credential lives in the login keychain under "Claude Code-credentials"
and `.credentials.json` is a fallback. A copied `.credentials.json` in a fresh config
dir is probably ignored while the keychain entry exists, so leasing may require the
keychain to be absent, a file-only mode, or an API key. A refresh may rotate the refresh
token and invalidate the copy or the original.

## Plan
1. Record where the credential is read from: keychain entry attributes and the file's
   key set, without printing secrets.
2. Create a temporary config dir with the copied file, run `claude -p "reply ok"` with
   `CLAUDE_CONFIG_DIR` set, and see whether it authenticates and from where.
3. Compare the original credential before and after; check the main session still
   works.
4. Check whether `apiKeyHelper` in settings gives a cleaner lease path.

## Success criteria
- A definite answer on whether an OAuth credential can be leased per session and how.
- The original login still works at the end.

## Findings
- **An OAuth credential can be leased per session.** Write the credential JSON into
  `<state dir>/.credentials.json` and start claude with `CLAUDE_CONFIG_DIR=<state dir>`. With
  that variable set, claude looks for a keychain item under a hashed service name
  (`Claude Code-credentials-<sha256(dir)[:8]>`, found in [[EXP-0007]]), so the host keychain is
  ignored and the file is used; nothing is written back to the keychain.
- **The state dir is the session's whole world**: transcript under `projects/`, settings,
  plugins, session registry. The daemon creates it per session, mounts it into the sandbox,
  and removes it afterwards, which also wipes the lease.
- **Getting the credential into the hub**: on macOS the live one is in the login keychain
  (`security find-generic-password -s "Claude Code-credentials" -w`); on Linux it is
  `~/.claude/.credentials.json`. The file on this Mac was stale, so enrollment must read the
  keychain, not the file.
- **Untested: refresh rotation.** If the leased copy refreshes, the new tokens land in the
  leased file and the hub's copy is stale; whether the old refresh token is revoked is
  unknown. The hub should therefore read back the leased file at session end and keep the
  newest `expiresAt`, and the daemon should not run two leases of the same account with an
  access token near expiry. Needs a controlled test with a dedicated account, not the main one.
- An API key through `ANTHROPIC_API_KEY` or `apiKeyHelper` remains the simpler lease for
  accounts that have one; it was not tested here.

## Runs
- [[RUN-20261016-k3cb]] lease of the keychain credential into a temp config dir

## Conclusion
Written once, by a human, when status becomes `concluded`.
