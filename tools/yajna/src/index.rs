//! The derived SQLite index (architecture 5.4, phase 1): markdown in, tables out. It is a
//! cache, never the truth: it lives outside the repo and is rebuilt whenever a page is
//! newer than it. Validation failures are build failures.

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::hash::{DefaultHasher, Hash, Hasher};
use std::path::{Path, PathBuf};
use std::sync::LazyLock;
use std::time::SystemTime;

use regex::Regex;
use rusqlite::{params, Connection};
use serde_json::Value;

use crate::refs;
use crate::validate::{self, ids_in, parse_steps};
use crate::vault::{rel, Res, Vault, LINK_RE, NS_ID_RE, PATH_FIELDS};

/// Bumped whenever the tables change; an index built by another version is rebuilt.
const SCHEMA: i64 = 2;

static LOG_LINE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^- (\d\d:\d\d) (.*)$").unwrap());
/// `- [[ID]] one line about it`: a link with its description, as project pages list
/// experiments and experiment pages list runs.
static LISTED_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?m)^\s*[-*]\s+\[\[([^\]|]+)(?:\|[^\]]*)?\]\]\s*(.*?)\s*$").unwrap()
});
static TASK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^\s*- \[( |x|X)\] (.+?)\s*$").unwrap());

const DDL: &str = "
CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE entity(
  id TEXT PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL, status TEXT, kind TEXT,
  outcome TEXT, project TEXT, experiment TEXT, created TEXT, author TEXT, tags TEXT,
  path TEXT NOT NULL, meta TEXT NOT NULL, body TEXT NOT NULL);
CREATE TABLE link(src TEXT NOT NULL, dst TEXT NOT NULL, ns TEXT, version TEXT, context TEXT NOT NULL, note TEXT);
CREATE INDEX link_dst ON link(dst);
CREATE TABLE log_entry(path TEXT NOT NULL, line INTEGER NOT NULL, date TEXT NOT NULL,
  author TEXT NOT NULL, time TEXT NOT NULL, text TEXT NOT NULL);
CREATE TABLE mention(path TEXT NOT NULL, line INTEGER NOT NULL, id TEXT NOT NULL);
CREATE INDEX mention_id ON mention(id);
CREATE TABLE run_result(run TEXT NOT NULL, experiment TEXT NOT NULL, finished TEXT,
  key TEXT NOT NULL, value TEXT NOT NULL, num REAL);
CREATE TABLE task(path TEXT NOT NULL, line INTEGER NOT NULL, id TEXT, section TEXT,
  done INTEGER NOT NULL, text TEXT NOT NULL);
CREATE TABLE citation(src TEXT NOT NULL, key TEXT NOT NULL);
";

pub struct Index {
    pub conn: Connection,
    pub path: PathBuf,
}

/// Where the index for this repo lives: `$YAJNA_CACHE`, else `$XDG_CACHE_HOME/yajna`, else
/// `~/.cache/yajna`, else the temp dir; the file is named by a hash of the root path.
pub fn cache_dir() -> PathBuf {
    let mut candidates: Vec<PathBuf> = Vec::new();
    if let Ok(p) = std::env::var("YAJNA_CACHE") {
        candidates.push(PathBuf::from(p));
    }
    if let Ok(p) = std::env::var("XDG_CACHE_HOME") {
        candidates.push(PathBuf::from(p).join("yajna"));
    }
    if let Ok(p) = std::env::var("HOME") {
        candidates.push(PathBuf::from(p).join(".cache").join("yajna"));
    }
    candidates.push(std::env::temp_dir().join("yajna"));
    for c in candidates {
        if fs::create_dir_all(&c).is_ok() {
            return c;
        }
    }
    std::env::temp_dir()
}

pub fn index_path(vault: &Vault) -> PathBuf {
    let mut h = DefaultHasher::new();
    vault.root.hash(&mut h);
    cache_dir().join(format!("{:016x}.sqlite", h.finish()))
}

pub fn newest(dir: &Path, newest_so_far: &mut SystemTime) {
    let Ok(rd) = fs::read_dir(dir) else { return };
    for e in rd.flatten() {
        let p = e.path();
        if p.is_dir() {
            newest(&p, newest_so_far);
        } else if let Ok(m) = p.metadata().and_then(|m| m.modified()) {
            if m > *newest_so_far {
                *newest_so_far = m;
            }
        }
    }
}

impl Index {
    /// The index for `vault`, rebuilt when missing, older than any page, or from another
    /// schema; `force` rebuilds regardless.
    pub fn open(vault: &Vault, force: bool) -> Res<Index> {
        let path = index_path(vault);
        if !force && path.is_file() {
            let built = path.metadata().and_then(|m| m.modified()).ok();
            let mut latest = SystemTime::UNIX_EPOCH;
            newest(&vault.notes, &mut latest);
            if let Ok(m) = refs::bib_path(vault).metadata().and_then(|m| m.modified()) {
                latest = latest.max(m);
            }
            if let Ok(m) = vault
                .root
                .join(crate::vault::CONFIG_NAME)
                .metadata()
                .and_then(|m| m.modified())
            {
                latest = latest.max(m);
            }
            if built.map(|b| b >= latest).unwrap_or(false) {
                if let Ok(conn) = Connection::open(&path) {
                    let schema: Option<i64> = conn
                        .query_row("SELECT value FROM meta WHERE key = 'schema'", [], |r| {
                            r.get::<_, String>(0)
                        })
                        .ok()
                        .and_then(|s| s.parse().ok());
                    if schema == Some(SCHEMA) {
                        return Ok(Index { conn, path });
                    }
                }
            }
        }
        Self::build(vault, &path)
    }

    /// Validate, then write every table from scratch.
    pub fn build(vault: &Vault, path: &Path) -> Res<Index> {
        let (problems, _) = validate::validate(vault)?;
        if !problems.is_empty() {
            return Err(format!(
                "{} problem(s); the index is built from a valid vault only:\n{}",
                problems.len(),
                problems.join("\n")
            ));
        }
        let tmp = path.with_extension("sqlite.tmp");
        let _ = fs::remove_file(&tmp);
        let mut conn = Connection::open(&tmp).map_err(|e| format!("{}: {e}", tmp.display()))?;
        conn.execute_batch(DDL).map_err(|e| e.to_string())?;
        let tx = conn.transaction().map_err(|e| e.to_string())?;
        tx.execute(
            "INSERT INTO meta VALUES ('schema', ?1), ('root', ?2), ('namespace', ?3)",
            params![
                SCHEMA.to_string(),
                vault.root.to_string_lossy(),
                vault.cfg.namespace.clone().unwrap_or_default()
            ],
        )
        .map_err(|e| e.to_string())?;

        for page in vault.pages()? {
            let Some(meta) = &page.meta else { continue };
            let ptype = meta.get("type").and_then(|v| v.as_str()).unwrap_or("");
            let relpath = rel(&page.path, &vault.root).to_string();
            if ptype == "log" {
                // line numbers count from the top of the file, frontmatter included
                let total = fs::read_to_string(&page.path)
                    .map(|t| t.lines().count())
                    .unwrap_or(0);
                let offset = total.saturating_sub(page.body.lines().count());
                index_log(&tx, &relpath, meta, &page.body, offset)?;
                continue;
            }
            // Reference notes have no ID; `@citekey` is their key in every table.
            let id = match meta.get("id").and_then(|v| v.as_str()) {
                Some(id) => id.to_string(),
                None if ptype == "reference" => format!(
                    "@{}",
                    meta.get("citekey").and_then(|v| v.as_str()).unwrap_or("")
                ),
                None => continue,
            };
            let s = |k: &str| meta.get(k).and_then(|v| v.as_str()).map(str::to_string);
            let title = s("title").unwrap_or_else(|| id.clone());
            let tags: Vec<String> = meta
                .get("tags")
                .and_then(|v| v.as_array())
                .map(|a| {
                    a.iter()
                        .filter_map(|t| t.as_str().map(str::to_string))
                        .collect()
                })
                .unwrap_or_default();
            tx.execute(
                "INSERT INTO entity VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)",
                params![
                    id,
                    ptype,
                    title,
                    s("status"),
                    s("kind"),
                    s("outcome"),
                    s("project"),
                    s("experiment"),
                    s("created"),
                    s("author"),
                    tags.join(" "),
                    relpath,
                    Value::Object(meta.clone()).to_string(),
                    page.body,
                ],
            )
            .map_err(|e| e.to_string())?;

            // Links: frontmatter fields, body [[links]], protocol step attributes.
            for (k, v) in meta {
                if k == "id" || PATH_FIELDS.contains(&k.as_str()) {
                    continue;
                }
                let mut local = BTreeSet::new();
                let mut ns = Vec::new();
                ids_in(v, &mut local, &mut ns);
                for dst in local {
                    insert_link(&tx, &id, &dst, None, None, k)?;
                }
                for (n, dst) in ns {
                    insert_link(&tx, &id, &dst, Some(&n), None, k)?;
                }
            }
            let prose = crate::vault::without_code(&page.body);
            // the one-line descriptions of listed links, by target
            let mut notes: BTreeMap<String, String> = BTreeMap::new();
            for m in LISTED_RE.captures_iter(&prose) {
                let target = m[1].trim().split('@').next().unwrap_or("").to_string();
                if !m[2].is_empty() {
                    notes.insert(target, m[2].to_string());
                }
            }
            for m in LINK_RE.captures_iter(&prose) {
                let target = m[1].trim();
                let (target, version) = match target.split_once('@') {
                    Some((t, v)) => (t, Some(v)),
                    None => (target, None),
                };
                let Some(c) = NS_ID_RE.captures(target) else {
                    continue;
                };
                if c.get(0).map(|m| m.as_str()) != Some(target) {
                    continue;
                }
                let ns = c.get(1).map(|m| m.as_str());
                let note = notes.get(target).map(String::as_str);
                insert_link_note(&tx, &id, &c[2], ns, version, "body", note)?;
            }
            if ptype == "protocol" {
                let (steps, _) = parse_steps(&page.body);
                for step in steps {
                    let Some(attrs) = step.attrs else { continue };
                    let mut local = BTreeSet::new();
                    let mut ns = Vec::new();
                    ids_in(&Value::Object(attrs), &mut local, &mut ns);
                    for dst in local {
                        insert_link(&tx, &id, &dst, None, None, &format!("step {}", step.number))?;
                    }
                }
            }
            for key in refs::citations(&prose) {
                tx.execute("INSERT INTO citation VALUES (?1, ?2)", params![id, key])
                    .map_err(|e| e.to_string())?;
            }
            index_tasks(&tx, &relpath, Some(&id), &page.body)?;
        }
        let tasks_file = vault.notes.join("tasks.md");
        index_tasks(
            &tx,
            &rel(&tasks_file, &vault.root),
            None,
            &fs::read_to_string(&tasks_file).unwrap_or_default(),
        )?;

        // results.tsv sidecars: one row per run per metric.
        let mut tsvs = Vec::new();
        find_named(&vault.notes, "results.tsv", &mut tsvs);
        for tsv in tsvs {
            let experiment = tsv
                .parent()
                .and_then(|p| p.file_name())
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_default();
            let mut reader = csv::ReaderBuilder::new()
                .delimiter(b'\t')
                .flexible(true)
                .from_path(&tsv)
                .map_err(|e| format!("{}: {e}", tsv.display()))?;
            let headers: Vec<String> = reader
                .headers()
                .map_err(|e| e.to_string())?
                .iter()
                .map(str::to_string)
                .collect();
            for rec in reader.records() {
                let rec = rec.map_err(|e| e.to_string())?;
                let cell = |name: &str| {
                    headers
                        .iter()
                        .position(|h| h == name)
                        .and_then(|i| rec.get(i))
                        .unwrap_or("")
                        .to_string()
                };
                let run = cell("run");
                let finished = cell("finished");
                for (i, h) in headers.iter().enumerate() {
                    if h == "run" || h == "finished" {
                        continue;
                    }
                    let value = rec.get(i).unwrap_or("");
                    if value.is_empty() {
                        continue;
                    }
                    tx.execute(
                        "INSERT INTO run_result VALUES (?1,?2,?3,?4,?5,?6)",
                        params![
                            run,
                            experiment,
                            finished,
                            h,
                            value,
                            value.parse::<f64>().ok()
                        ],
                    )
                    .map_err(|e| e.to_string())?;
                }
            }
        }
        tx.commit().map_err(|e| e.to_string())?;
        drop(conn);
        fs::rename(&tmp, path).map_err(|e| format!("{}: {e}", path.display()))?;
        let conn = Connection::open(path).map_err(|e| e.to_string())?;
        Ok(Index {
            conn,
            path: path.to_path_buf(),
        })
    }

    pub fn count(&self, table: &str) -> i64 {
        self.conn
            .query_row(&format!("SELECT count(*) FROM {table}"), [], |r| r.get(0))
            .unwrap_or(0)
    }

    pub fn entity(&self, id: &str) -> Option<Entity> {
        self.conn
            .query_row(
                "SELECT id,type,title,status,kind,outcome,project,experiment,created,author,tags,path,meta,body FROM entity WHERE id = ?1",
                [id],
                Entity::from_row,
            )
            .ok()
    }

    pub fn entities(&self, where_sql: &str, args: &[&dyn rusqlite::ToSql]) -> Vec<Entity> {
        let sql = format!(
            "SELECT id,type,title,status,kind,outcome,project,experiment,created,author,tags,path,meta,body FROM entity {where_sql} ORDER BY created, id"
        );
        let Ok(mut st) = self.conn.prepare(&sql) else {
            return Vec::new();
        };
        st.query_map(args, Entity::from_row)
            .map(|rows| rows.flatten().collect())
            .unwrap_or_default()
    }

    /// Links into `id`: (src, context).
    pub fn backlinks(&self, id: &str) -> Vec<(String, String)> {
        let Ok(mut st) = self
            .conn
            .prepare("SELECT DISTINCT src, context FROM link WHERE dst = ?1 AND ns IS NULL ORDER BY src, context")
        else {
            return Vec::new();
        };
        st.query_map([id], |r| Ok((r.get(0)?, r.get(1)?)))
            .map(|rows| rows.flatten().collect())
            .unwrap_or_default()
    }

    /// Links out of `id`: (dst with namespace, version, context).
    pub fn links(&self, id: &str) -> Vec<(String, Option<String>, String)> {
        let Ok(mut st) = self.conn.prepare(
            "SELECT CASE WHEN ns IS NULL THEN dst ELSE ns || '/' || dst END, version, context FROM link WHERE src = ?1 ORDER BY context, dst",
        ) else {
            return Vec::new();
        };
        st.query_map([id], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))
            .map(|rows| rows.flatten().collect())
            .unwrap_or_default()
    }

    /// Log entries mentioning `id`, oldest first.
    pub fn mentions(&self, id: &str) -> Vec<LogEntry> {
        let Ok(mut st) = self.conn.prepare(
            "SELECT l.path, l.line, l.date, l.author, l.time, l.text FROM log_entry l JOIN mention m ON m.path = l.path AND m.line = l.line WHERE m.id = ?1 ORDER BY l.date, l.time, l.path",
        ) else {
            return Vec::new();
        };
        st.query_map([id], LogEntry::from_row)
            .map(|rows| rows.flatten().collect())
            .unwrap_or_default()
    }

    pub fn log(&self) -> Vec<LogEntry> {
        let Ok(mut st) = self
            .conn
            .prepare("SELECT path, line, date, author, time, text FROM log_entry ORDER BY date, time, path, line")
        else {
            return Vec::new();
        };
        st.query_map([], LogEntry::from_row)
            .map(|rows| rows.flatten().collect())
            .unwrap_or_default()
    }

    /// Metrics of an experiment's runs: run -> (finished, [(key, value, num)]).
    pub fn results(&self, experiment: &str) -> Vec<RunRow> {
        let Ok(mut st) = self.conn.prepare(
            "SELECT run, finished, key, value, num FROM run_result WHERE experiment = ?1 ORDER BY finished, run",
        ) else {
            return Vec::new();
        };
        let mut rows: Vec<RunRow> = Vec::new();
        let it = st
            .query_map([experiment], |r| {
                Ok((
                    r.get::<_, String>(0)?,
                    r.get::<_, Option<String>>(1)?,
                    r.get::<_, String>(2)?,
                    r.get::<_, String>(3)?,
                    r.get::<_, Option<f64>>(4)?,
                ))
            })
            .map(|x| x.flatten().collect::<Vec<_>>())
            .unwrap_or_default();
        for (run, finished, key, value, num) in it {
            match rows.iter_mut().find(|r| r.run == run) {
                Some(row) => row.metrics.push((key, value, num)),
                None => rows.push(RunRow {
                    run,
                    finished: finished.unwrap_or_default(),
                    metrics: vec![(key, value, num)],
                }),
            }
        }
        rows
    }

    /// The one-line description `src` gives for `dst` in a `- [[dst]] ...` list item.
    pub fn note(&self, src: &str, dst: &str) -> Option<String> {
        self.conn
            .query_row(
                "SELECT note FROM link WHERE src = ?1 AND dst = ?2 AND note IS NOT NULL LIMIT 1",
                [src, dst],
                |r| r.get(0),
            )
            .ok()
    }

    pub fn tasks(&self, done: bool) -> Vec<Task> {
        let Ok(mut st) = self.conn.prepare(
            "SELECT path, line, id, section, done, text FROM task WHERE done = 0 OR ?1 ORDER BY path, line",
        ) else {
            return Vec::new();
        };
        st.query_map([done], |r| {
            Ok(Task {
                path: r.get(0)?,
                line: r.get(1)?,
                id: r.get(2)?,
                section: r.get(3)?,
                done: r.get::<_, i64>(4)? != 0,
                text: r.get(5)?,
            })
        })
        .map(|rows| rows.flatten().collect())
        .unwrap_or_default()
    }
}

#[derive(Debug, Clone)]
pub struct Entity {
    pub id: String,
    pub etype: String,
    pub title: String,
    pub status: Option<String>,
    pub kind: Option<String>,
    pub outcome: Option<String>,
    pub project: Option<String>,
    pub experiment: Option<String>,
    pub created: Option<String>,
    pub author: Option<String>,
    pub tags: Vec<String>,
    pub path: String,
    pub meta: Value,
    pub body: String,
}

impl Entity {
    fn from_row(r: &rusqlite::Row) -> rusqlite::Result<Entity> {
        let tags: String = r.get(10)?;
        let meta: String = r.get(12)?;
        Ok(Entity {
            id: r.get(0)?,
            etype: r.get(1)?,
            title: r.get(2)?,
            status: r.get(3)?,
            kind: r.get(4)?,
            outcome: r.get(5)?,
            project: r.get(6)?,
            experiment: r.get(7)?,
            created: r.get(8)?,
            author: r.get(9)?,
            tags: tags.split_whitespace().map(str::to_string).collect(),
            path: r.get(11)?,
            meta: serde_json::from_str(&meta).unwrap_or(Value::Null),
            body: r.get(13)?,
        })
    }

    /// The first tag is the experiment's theme in the tree.
    pub fn theme(&self) -> String {
        self.tags.first().cloned().unwrap_or_default()
    }
}

#[derive(Debug, Clone)]
pub struct LogEntry {
    pub path: String,
    pub line: i64,
    pub date: String,
    pub author: String,
    pub time: String,
    pub text: String,
}

impl LogEntry {
    fn from_row(r: &rusqlite::Row) -> rusqlite::Result<LogEntry> {
        Ok(LogEntry {
            path: r.get(0)?,
            line: r.get(1)?,
            date: r.get(2)?,
            author: r.get(3)?,
            time: r.get(4)?,
            text: r.get(5)?,
        })
    }
}

#[derive(Debug, Clone)]
pub struct RunRow {
    pub run: String,
    pub finished: String,
    pub metrics: Vec<(String, String, Option<f64>)>,
}

#[derive(Debug, Clone)]
pub struct Task {
    pub path: String,
    pub line: i64,
    pub id: Option<String>,
    pub section: Option<String>,
    pub done: bool,
    pub text: String,
}

fn insert_link(
    tx: &Connection,
    src: &str,
    dst: &str,
    ns: Option<&str>,
    version: Option<&str>,
    context: &str,
) -> Res<()> {
    insert_link_note(tx, src, dst, ns, version, context, None)
}

fn insert_link_note(
    tx: &Connection,
    src: &str,
    dst: &str,
    ns: Option<&str>,
    version: Option<&str>,
    context: &str,
    note: Option<&str>,
) -> Res<()> {
    tx.execute(
        "INSERT INTO link VALUES (?1,?2,?3,?4,?5,?6)",
        params![src, dst, ns, version, context, note],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

fn index_log(
    tx: &Connection,
    path: &str,
    meta: &serde_json::Map<String, Value>,
    body: &str,
    offset: usize,
) -> Res<()> {
    let date = meta
        .get("date")
        .map(|v| match v {
            Value::String(s) => s.clone(),
            other => other.to_string(),
        })
        .unwrap_or_default();
    let author = meta
        .get("author")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    for (i, line) in body.lines().enumerate() {
        let Some(m) = LOG_LINE_RE.captures(line) else {
            continue;
        };
        let lineno = (offset + i + 1) as i64;
        tx.execute(
            "INSERT INTO log_entry VALUES (?1,?2,?3,?4,?5,?6)",
            params![path, lineno, date, author, &m[1], &m[2]],
        )
        .map_err(|e| e.to_string())?;
        let mut seen = BTreeSet::new();
        for c in NS_ID_RE.captures_iter(&m[2]) {
            if c.get(1).is_some() {
                continue;
            }
            if seen.insert(c[2].to_string()) {
                tx.execute(
                    "INSERT INTO mention VALUES (?1,?2,?3)",
                    params![path, lineno, &c[2]],
                )
                .map_err(|e| e.to_string())?;
            }
        }
    }
    Ok(())
}

fn index_tasks(tx: &Connection, path: &str, id: Option<&str>, text: &str) -> Res<()> {
    let mut section: Option<String> = None;
    for (i, line) in text.lines().enumerate() {
        if line.starts_with('#') {
            section = Some(line.trim_start_matches('#').trim().to_string());
            continue;
        }
        let Some(m) = TASK_RE.captures(line) else {
            continue;
        };
        tx.execute(
            "INSERT INTO task VALUES (?1,?2,?3,?4,?5,?6)",
            params![
                path,
                (i + 1) as i64,
                id,
                section,
                m[1].eq_ignore_ascii_case("x") as i64,
                &m[2]
            ],
        )
        .map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn find_named(dir: &Path, name: &str, out: &mut Vec<PathBuf>) {
    let Ok(rd) = fs::read_dir(dir) else { return };
    let mut entries: Vec<PathBuf> = rd.flatten().map(|e| e.path()).collect();
    entries.sort();
    for p in entries {
        if p.is_dir() {
            find_named(&p, name, out);
        } else if p.file_name().map(|n| n == name).unwrap_or(false) {
            out.push(p);
        }
    }
}
