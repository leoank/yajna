---
id: $id
type: doc
schema_version: 1
title: $title
kind: meeting
status: draft             # draft | final | archived
date: $date          # the latest meeting
project: $project
attendees: []
created: $created
author: $author
tags: []
sync: {provider: gdoc, mode: publish}
---

One section per meeting, newest first, headed by its date. For the next meeting, add a
section with the same headings at the top and set `date` above to its day.

## $date

### Agenda
1. 

### Notes

### Decisions

### Actions
Each action as a checkbox with who and by when; `yajna tasks` lists the open ones.
- [ ] 

### Transcript
The recording's transcript or its generated summary, pasted as it came.
