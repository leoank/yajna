# ADR-0041: One web app for the notebook: React, over a JSON API of pages

Status: accepted
Date: 2026-11-18
Supersedes: ADR-0029 (the files viewer's frontend), for what `yajna serve` serves
Amends: ADR-0027 (the served site), ADR-0038 (the changes view)

## Context
`yajna serve` serves two front ends that look nothing alike: the notebook's pages are the
static HTML `yajna site` renders in Rust (the index, log, tasks and a page per entity,
with a project's tree as SVG and tables of experiments and runs), and the files viewer,
its changes view and the review diffs are a TypeScript bundle without a framework
(ADR-0029). The pages cannot do what the viewer does, such as pick a worktree (ADR-0039),
and neither shows anything while a slow request is out, which is the usual case from a
phone through saarthi's relay, where `yajna serve` is now embedded in saarthi's app. ank
asked on 2026-11-18 for one app, modern and clean, consistent between the project pages
and the files, that copes with slow networks (ovis, a React client for herdr, as one
source of ideas), and chose: React on Vite rather than Next.js; `yajna site` kept for
publishing; the changes view's actions (ADR-0040) built in the new app, not the old one.

## Decision
- **One single-page app**, React with TypeScript, bundled by esbuild into static files the
  `yajna-serve` crate embeds, as the viewer's bundle is today. ank chose a Vite and React
  app; its production build goes through rollup's native packages per platform, which the
  hermetic Nix build would have to fetch for every system, so the bundle is esbuild's (what
  the Nix build already runs for the viewer) and Vite can be added for its dev server.
  Routes are a small router of the app's own over the History API, since the app has eight
  and must work under any prefix. Client-side routes (the
  overview, a page by ID, a type's list, the log, tasks, reviews, changes, files) under
  whatever prefix it is served at (`/`, `/w/<branch>/`, `/n/<namespace>/`, saarthi's relay):
  the page works out its base from its own address before anything loads.
- **Next.js is not used**: its strengths are server rendering and its own server, which
  would need Node beside the Rust binary on every machine; a static export cannot route the
  notebook's IDs, which exist only at run time.
- **Data from a JSON API of pages**, which the CLI implements and the crate serves as it
  does reviews (the crate still knows nothing of the notebook, ADR-0027): the notebook's
  overview, a list of pages by type or project, one page with its fields, its body rendered
  by yajna's own markdown renderer, its children (a project's phases, experiments and tree,
  an experiment's runs and their metrics) and what links to it, the log and the tasks.
- **Made for slow networks**: every request through a cache (TanStack Query) that shows
  what it last had while it asks again, skeletons where nothing is known yet, retries with
  backoff and one quiet *Reconnecting…* line while they fail, data fetched when a link is
  hovered or comes into view, and heavy parts (the code view) loaded only when opened.
- **One design** for every screen: a sidebar with the notebook, its worktrees and its
  sections; tonal surfaces and hairlines, one accent for focus and the person's own
  actions, status colours that mean something; light and dark from the system; a phone
  layout with the sidebar as a drawer and large targets.
- **`yajna site` stays** the static HTML for publishing, readable without JavaScript, and
  takes the new design's colours and type so the two look alike. `yajna serve` serves the
  app at `/` and keeps the static pages at `/<ID>.html` for links made before.
- **The old viewer stays** at `/classic/` until its review diffs are in the app; then it
  and ADR-0029's bundle go.

## Alternatives considered
- **Next.js with static export**: client-side data and a catch-all page with the ID in the
  query or hash; its server features unused, its routing worked around.
- **Next.js with its server**: real server rendering and streaming, at the cost of Node at
  run time on every machine and in Nix, beside a Rust server that already holds the data.
- **Keep the framework-free viewer and restyle the static site**: two codebases kept in
  step by hand, no worktree picker on the pages, no shared loading behaviour.
- **The app for publishing too**, from a JSON snapshot: one look everywhere, but a published
  notebook would need JavaScript to be read.

## Consequences
- The crate grows a JSON API of pages, which becomes a contract like the files API.
- The app's npm dependencies are locked in `package-lock.json` and built through Nix as
  the viewer's are; `nix flake check` keeps the committed bundle equal to its source.
- Two front ends live side by side until the reviews move over.
