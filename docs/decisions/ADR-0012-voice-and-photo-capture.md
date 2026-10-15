# ADR-0012: Server-side transcription; photos and audio are log attachments or artifacts

Status: accepted
Date: 2026-10-15
Phase: 4 (rule applies from Phase 0 for photos added by hand)
Source: `docs/architecture.md` sections 6, 8 and 12

## Context

Phone capture is voice and photos. The questions were whether transcription runs on the
device or the server, and whether a photo is an `ART` entity or an inline part of the log.

## Decision

Transcription runs on the server. The phone uploads audio; the server transcribes and writes
the transcript as a log entry.

Photos, and the audio behind a transcript, are one of two things, chosen by the person or
agent capturing them:

- An inline log attachment when they record the process: the bench as it was, a whiteboard,
  a tube label. They live in the day's sidecar directory `lab/log/<year>/<date>/` and are
  embedded in the log entry.
- An `ART` artifact when they are a result of a run: a gel, a plate, a print. They get an
  `ART` page, are linked from the `RUN` page, and are stored like any other artifact.

The default is inline. Promotion to `ART` is a move plus a page, done later if it turns
out to matter.

## Consequences

- The phone client stays thin and the transcription model can change without an app update.
- Small inline attachments sit in git; large ones follow ADR-0013 once it is decided.
