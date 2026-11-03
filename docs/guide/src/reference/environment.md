# Environment variables

| Variable | Used for |
|----------|----------|
| `YAJNA_AUTHOR` | The author handle for everything created, ahead of `.yajna/author` and `author` in `yajna.toml`; `--author` overrides it. Agents set `agent:<name>`. |
| `YAJNA_CACHE` | Where the index, the site and ELN bundles go. Default `$XDG_CACHE_HOME/yajna`, else `~/.cache/yajna`. |
| `YAJNA_GDOC_CREDENTIALS` | The Google credentials file written by `yajna sync login` and read by `yajna sync`. Default `$XDG_CONFIG_HOME/yajna/gdoc.json`, else `~/.config/yajna/gdoc.json`. |
| `YAJNA_RUN`, `YAJNA_RUN_DIR`, `YAJNA_RUN_COMMIT` | Set by `yajna run shell` and `run reproduce` for what runs inside: the run's ID, the directory its outputs go in, and the commit. A run script writes to `$YAJNA_RUN_DIR` when it is set. |
| `VISUAL`, `EDITOR` | The editor for `-e` on `yajna log` and `yajna todo` (then `editor` in the user config, then `nvim`, then `vi`); `EDITOR` is also offered for opening a page right after `yajna new`, in interactive mode. |
| `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`, `XDG_STATE_HOME` | The base directories above and below, when set. |

For testing yajna itself:

| Variable | Used for |
|----------|----------|
| `YAJNA_FIXED_TIME` | A fixed clock, so IDs and timestamps are reproducible. |
| `YAJNA_ANSWERS` | Newline-separated answers that interactive prompts consume instead of asking. |
| `YAJNA_GDOC_TOKEN` | A Google access token to use as is, skipping the refresh. |
| `YAJNA_GDOC_API` | Another base URL for the Google APIs, such as a local fake. |
