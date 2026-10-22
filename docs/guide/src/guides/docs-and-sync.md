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
| `meeting` | *Agenda*, *Notes*, *Decisions*, *Actions*; `date` and `attendees` in the frontmatter |
| `proposal`, `report`, `admin`, `logistics`, `note` | *Purpose*, *Body*, *Next steps* (`note` is the default kind) |

A meeting's *Actions* are checkboxes, so `yajna tasks` lists the open ones. `status` is
`draft`, `final` or `archived`.

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

Share the docs, or a folder of them, with your readers from Google Drive as you would any
doc; sharing survives every update. To have new docs created inside a folder, put its ID
(the last part of the folder's URL) in `yajna.toml`:

```toml
[sync]
folder = "1AbCdEfGhIjKlMnOpQrStUvWxYz"
site_url = "https://you.github.io/notebook"   # optional: where unsynced links point
```

Because of the `drive.file` scope, yajna may not be allowed to add docs to a folder it did
not create. If `yajna sync` fails on a folder made by hand, leave `folder` unset and move
the docs once from Drive; they stay where you put them.
