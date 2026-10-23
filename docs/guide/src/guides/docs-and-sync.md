# Docs and Google Docs

Not everyone who needs to read your notebook will open a git repository. A supervisor, a
committee or a collaborator reads and comments in Google Docs. yajna publishes chosen pages
there and brings the comments back, while the markdown stays the record.

## Doc pages

Meeting notes, proposals, reports, admin and logistics are not research records, but they
belong with the work. They are `doc` pages:

```sh
yajna new doc "Committee meeting" --kind meeting
yajna new doc "Thesis proposal" --kind proposal --dir thesis
```

| Kind | Template |
|------|----------|
| `meeting` | One section per meeting, headed by its date, with *Agenda*, *Notes*, *Decisions*, *Actions* and *Transcript*; `date` (the latest meeting) and `attendees` in the frontmatter |
| `proposal`, `report`, `admin`, `logistics`, `note` | *Purpose*, *Body*, *Next steps* (`note` is the default kind) |

A meeting doc holds a series: the meetings with one supervisor, or of one committee. Each
meeting is a `## 2026-10-22` section, newest first; for the next one, add a section with
the same headings at the top and move `date` to its day. *Transcript* takes the
recording's transcript or the summary a meeting tool generates, pasted as it came. The
*Actions* of every meeting are checkboxes, so `yajna tasks` lists the open ones. `status`
is `draft`, `final` or `archived`.

**Where they go.** `yajna new doc` asks for a directory, completing `notes/docs` (the
default), directories already registered for docs, and the repository's top-level
directories; `--dir` answers without asking. A doc can live outside `notes/`, next to the
thing it is about, such as a `thesis/` folder: the first doc there registers the directory
in `yajna.toml`,

```toml
[docs]
dirs = ["thesis"]
```

so that validate, tasks, the site, sync and export see it. Only files there with a yajna
`id` and `type` are pages; the thesis chapters beside them are left alone.

Doc pages are set to sync from the start.

## Existing documents

A document you already have, such as a proposal drafted in the thesis folder, becomes a
page with `yajna adopt` instead of being retyped:

```console
$ yajna adopt thesis/proposals/g2a-proposal.md --kind proposal --dry-run
thesis/proposals/g2a-proposal.md: would become a doc (proposal) titled "g2a proposal"; it stays in thesis/proposals/, renamed to start with its ID, with bibliography g2a-proposal.bib
$ yajna adopt thesis/proposals/g2a-proposal.md --kind proposal --title "G2A proposal"
thesis/proposals/DOC-20261023-d2k9qa-g2a-proposal.md
```

- The doc's frontmatter goes on top and the body stays exactly as it was. The file is
  renamed to start with its new ID; git sees a rename, so its history follows. Anything
  that pointed at the old file name (a thesis build script, say) needs updating by hand.
- A `.bib` with the same name beside the file becomes the page's `bibliography`, so its
  citations keep working.
- If the file has frontmatter of its own (a pandoc document), its keys stay: `title`
  becomes the page title, `author` is kept as `authors`, and the rest (`lang`,
  `bibliography`, `geometry`, ...) are untouched. Keys yajna writes itself (`status`,
  `kind`, `date`) are refused, naming them, before anything is changed.
- The title comes from `--title`, else the file's own, else its first heading, else its
  name.

`adopt` works for every page type, not only docs: `--type protocol`, `--type experiment
--project PRJ-0001`, `--type material --kind plasmid` and so on, with the same flags as
`yajna new`. A doc stays where it is; other types move to where that type lives
(`notes/protocols/`, the project's `experiments/`, ...).

## Publishing a page to Google Docs

Any page can be published by marking it in its frontmatter:

```yaml
sync: {provider: gdoc, mode: publish}
```

Then:

```sh
yajna sync --dry-run      # what would be created or updated; offline
yajna sync                # publish every marked page, pull comments back
yajna sync DOC-20261022-d4m1q8   # just this one
```

- The first sync creates a Google Doc for each marked page and writes its ID back into the
  frontmatter as `doc_id`. From then on the same doc is updated in place: its URL and
  sharing never change.
- A page is re-uploaded only when its rendered content changed.
- Docs are organised in Drive the way the pages are in the repository, under one root
  folder (see [Sharing](#sharing)). A page under `notes/` keeps its path without `notes/`;
  a page in a docs directory keeps its path from the repository root:

  | Page | Doc in Drive |
  |------|--------------|
  | `notes/projects/PRJ-0001-yeast/README.md` | `projects/PRJ-0001-yeast/` |
  | `notes/projects/PRJ-0001-yeast/experiments/EXP-….md` | `projects/PRJ-0001-yeast/experiments/` |
  | `notes/docs/DOC-….md` | `docs/` |
  | `thesis/meetings/DOC-….md` | `thesis/meetings/` |

  Move a page (`git mv`) and the next sync moves its doc; the URL, comments and sharing
  stay. `--dry-run` shows the folder each page goes to.
- A page that cites papers (`@key`, `[@key, p. 3]`) is rendered by
  [pandoc](https://pandoc.org) with author-year citations and a *References* section at
  the end. Keys resolve in the notebook's bibliography and the page's own
  `bibliography`. pandoc has to be on your `PATH` for those pages; without it they are
  skipped with the reason and everything else syncs.

  Each reference is its own paragraph in slightly smaller type, with space between
  entries and DOIs as links. Italics and protected capitals that Zotero writes into
  titles (a species name, a gene) come through as they are in the library. Google Docs
  cannot keep a hanging indent from an upload, so the entries are not indented.
- The doc starts with the page's ID, status and title, then the body. Checkboxes appear
  as ☐ and ☑. `[[links]]` to other synced pages point at their docs; to other pages they
  point at the site when `[sync] site_url` is set, and are plain text otherwise.
- Edits made in the Google Doc are overwritten at the next publish. Comment, do not edit.

## Comments come back

Before it re-uploads a page, `yajna sync` pulls the doc's comments and replies into a
`## Review` section at the end of the page:

```markdown
## Review
Comments from the Google Doc, pulled by `yajna sync`. Tick a box to resolve the comment there.

- [ ] Sam Lee, 2026-10-22 on "a 30-minute pulse": why 30 and not 15? <!-- gdoc:AAAB… -->
  - Ada, 2026-10-22: 15 showed nothing in the pilot.
```

Answer the comment by changing the page, then tick the box. The next `yajna sync` resolves
the comment in the doc. Items stay in the page even if the comment is deleted in the doc.
The *Review* section itself is never published. `--no-comments` publishes without pulling.

Only `publish` exists so far: the page is the truth and the doc is a copy. A `mirror` mode
(edits in the doc come back as commits) and an `import` mode (the doc is the truth) are
planned, not built.

## Setting up Google access

yajna talks to Google Drive as you, through an OAuth client you create once in your own
Google Cloud project. It asks only for the `drive.file` scope, which lets it see the docs
it created and nothing else in your Drive.

1. **Create a project** at [console.cloud.google.com](https://console.cloud.google.com),
   for example "yajna".
2. **Enable the Google Drive API**: *APIs & Services → Library → Google Drive API →
   Enable*. The Docs API is not needed.
3. **Configure the consent screen** (*APIs & Services → OAuth consent screen*, or *Google
   Auth Platform* in newer consoles):
   - User type **External** for a personal Google account; **Internal** if the account
     belongs to a Workspace organisation that owns the project.
   - Any app name; your own address as support and developer contact.
   - Add the scope `https://www.googleapis.com/auth/drive.file`.
   - For External, add your own account as a test user.
4. **Create the client**: *Credentials → Create credentials → OAuth client ID*, application
   type **Desktop app**. Download the JSON and keep it outside every repository, for
   example `~/.config/yajna/client_secret.json`.
5. **Sign in once**:

   ```sh
   yajna sync login --client ~/.config/yajna/client_secret.json
   ```

   A browser opens; sign in with the account that should own the docs and approve. Google
   warns that the app is unverified, because it is your own: *Advanced → Go to yajna*.
   yajna stores a refresh token in `~/.config/yajna/gdoc.json`, or wherever
   `YAJNA_GDOC_CREDENTIALS` points.

**Testing mode tokens expire after seven days.** An External app left in *Testing* has to
sign in again every week. To avoid that, choose *Publish app* on the audience page; with
only the `drive.file` scope Google does not require verification.

The credentials file is a secret. Never commit it; on a managed machine, deliver it as a
secret and point `YAJNA_GDOC_CREDENTIALS` at it.

## Sharing

On the first sync yajna creates a folder in My Drive named after the notebook (its
`namespace`, such as `manthan`), and builds the folders below it as pages need them. Share
that one folder with your readers; everything in it inherits the sharing, and stays
shared through every update and move.

To use a folder of your own as the root instead, put its ID (the last part of the folder's
URL) in `yajna.toml`:

```toml
[sync]
folder = "1AbCdEfGhIjKlMnOpQrStUvWxYz"
site_url = "https://you.github.io/notebook"   # optional: where unsynced links point
```

Because of the `drive.file` scope, yajna may not be allowed to add to a folder it did not
create; if `yajna sync` fails on one, leave `folder` unset and let yajna make the root.

yajna finds its folders again by tags it puts on them, not by name or by IDs stored in the
repository, so every clone and worktree of the notebook syncs into the same folders.
Rename them in Drive if you like; do not move docs between them by hand, because the next
sync puts each doc back where its page is. yajna never deletes anything in Drive: a folder
left empty by a move stays until you remove it.
