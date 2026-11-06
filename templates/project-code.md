---
id: $id
type: project
schema_version: 1
title: $title
status: active            # active | paused | concluded | moved | archived
code: $code               # code/<name> here, or a repository URL once it moves out
created: $created
author: $author
tags: []
---

## Introduction
What this software is, who or what uses it, and why it is being written here rather
than taken off the shelf. Written once, edited rarely.

## Progress
The project's phases, one line each, ticked when the phase is done; each phase's page holds
its goal and its own checklist. `yajna new phase` adds one; `yajna tasks` lists the open
items with the rest.

## Open questions
- 

## Design
The architecture is `$docs/architecture.md` and its decision records are
`$docs/decisions/`; here, only the few choices
a reader must know before touching the code.

## Lessons
What was tried and dropped, and why, so nobody tries it again.

## Experiments
One line per experiment after its link, what it asks and what came of it; `yajna validate`
rejects a bare link here. Newest last.
