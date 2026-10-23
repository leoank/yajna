# The static site

`yajna site` renders the whole notebook as HTML: easier to browse than a directory of
markdown, and something you can show a colleague.

```sh
yajna serve --open
```

serves it at `http://127.0.0.1:8765/`, opens the browser, and re-renders whenever a page
changes. `--port` picks another port (`0` for any free one). `yajna site --serve` is the
same command.

`yajna site` alone writes the files and stops:

```console
$ yajna site --out site/
site/: 6 page(s)
```

The default output directory is beside the index in the cache,
`~/.cache/yajna/<hash>.site`. Like the index, the site is derived from the pages and is
not committed.

## From another machine

`yajna serve` listens on `127.0.0.1` only and has no login, so nothing on the network can
read the notebook. To look at a notebook on a server from your laptop, tunnel to it:

```sh
ssh -L 8765:localhost:8765 server    # then, on the server: yajna serve
```

and open `http://localhost:8765/` on the laptop. `tailscale serve 8765` on the server works
too; it forwards requests addressed to the server's tailnet name, so tell yajna that name:

```sh
yajna serve --host server.tail1234.ts.net
```

Requests addressed to any other name are refused, so that a web page you visit cannot
read the notebook through your browser.

## What is on it

- **The front page**: a table of projects with their experiment counts, then lists of
  protocols, materials, equipment, builds, analyses, artifacts, docs, agent sessions and
  reading notes.
- **One page per entity**, with its frontmatter as a table, the body rendered, `[[links]]`
  and `@citations` as links, the pages that link to it, and the log lines that mention it.
- **Project pages** add a table of experiments (with the one-line descriptions from the
  project page) and a drawing of the **experiment tree**: themes as rows, outcome as
  colour (positive green, negative red, inconclusive amber, infra grey, still open white),
  creation order as the solid line, `influenced_by` as dotted edges.
- **Experiment pages** add a table of their runs with their metrics.
- **The log**: every author's lines, newest first.
- **Tasks**: every open checkbox, with a link to its page.

## Publishing it

The output is plain static HTML with relative links, so any static host works. Keep in mind
that a notebook is usually private; publish only what you mean to share. If you do publish
it, set `[sync] site_url` in `yajna.toml` so that [Google Docs](docs-and-sync.md) link to
its pages.
