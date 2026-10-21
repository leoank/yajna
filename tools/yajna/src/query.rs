//! Structured questions answered from the index: show, timeline, tree, runs.

use std::collections::BTreeMap;

use crate::index::{Entity, Index};
use crate::vault::{Res, Vault};

pub fn cmd_index(vault: &Vault) -> Res<i32> {
    let ix = Index::build(vault, &crate::index::index_path(vault))?;
    println!(
        "{}: {} entities, {} links, {} log entries, {} mentions, {} run results, {} tasks, {} citations",
        ix.path.display(),
        ix.count("entity"),
        ix.count("link"),
        ix.count("log_entry"),
        ix.count("mention"),
        ix.count("run_result"),
        ix.count("task"),
        ix.count("citation"),
    );
    Ok(0)
}

fn find(ix: &Index, id: &str) -> Res<Entity> {
    ix.entity(id)
        .ok_or_else(|| format!("{id}: not in the index (not a page, or not valid)"))
}

/// One line per entity: id, status/outcome, title.
pub fn line(e: &Entity) -> String {
    let mut state = e.status.clone().unwrap_or_default();
    if let Some(o) = &e.outcome {
        state = format!("{state}/{o}");
    }
    if let Some(k) = &e.kind {
        state = if state.is_empty() {
            k.clone()
        } else {
            format!("{state} {k}")
        };
    }
    let title = if e.title == e.id {
        String::new()
    } else {
        format!("  {}", e.title)
    };
    format!("{:<18} {:<22}{title}", e.id, state)
}

pub fn cmd_show(vault: &Vault, id: &str) -> Res<i32> {
    let id = &vault.canonical_id(id);
    let ix = Index::open(vault, false)?;
    let e = find(&ix, id)?;
    println!("{}", line(&e));
    println!("{:<10} {}", "path", e.path);
    if let Some(obj) = e.meta.as_object() {
        for (k, v) in obj {
            if ["id", "type", "title", "schema_version"].contains(&k.as_str()) {
                continue;
            }
            let shown = match v {
                serde_json::Value::String(s) => s.clone(),
                serde_json::Value::Null => continue,
                serde_json::Value::Array(a) if a.is_empty() => continue,
                other => other.to_string(),
            };
            println!("{k:<10} {shown}");
        }
    }
    let links = ix.links(&e.id);
    if !links.is_empty() {
        println!("links out");
        for (dst, version, context) in links {
            let v = version.map(|v| format!("@{v}")).unwrap_or_default();
            println!("  {dst}{v}  ({context})");
        }
    }
    let back = ix.backlinks(&e.id);
    if !back.is_empty() {
        println!("links in");
        for (src, context) in back {
            let title = ix.entity(&src).map(|s| s.title).unwrap_or_default();
            println!("  {src}  ({context})  {title}");
        }
    }
    let mentions = ix.mentions(&e.id);
    if !mentions.is_empty() {
        println!("log mentions: {}", mentions.len());
    }
    Ok(0)
}

pub struct Event {
    pub date: String,
    pub time: String,
    pub text: String,
}

/// Everything recorded about `id`, oldest first: its creation, pages that link to it (on
/// their creation date), its runs, and every log line that mentions it.
pub fn timeline(ix: &Index, id: &str) -> Res<Vec<Event>> {
    let e = find(ix, id)?;
    let mut events = Vec::new();
    events.push(Event {
        date: e.created.clone().unwrap_or_default(),
        time: String::new(),
        text: format!(
            "created {} {}{}",
            e.etype,
            e.id,
            e.author
                .as_ref()
                .map(|a| format!(" by {a}"))
                .unwrap_or_default()
        ),
    });
    for (src, context) in ix.backlinks(&e.id) {
        let Some(s) = ix.entity(&src) else { continue };
        let when = s
            .meta
            .get("finished")
            .and_then(|v| v.as_str())
            .map(str::to_string)
            .or_else(|| s.created.clone())
            .unwrap_or_default();
        let (date, time) = split_when(&when);
        let what = if s.etype == "run" {
            format!(
                "run {} {} {}{}",
                s.id,
                s.kind.clone().unwrap_or_default(),
                s.status.clone().unwrap_or_default(),
                metrics_summary(ix, &s)
            )
        } else {
            format!("{} {} ({})  {}", s.etype, s.id, context, s.title)
        };
        events.push(Event {
            date,
            time,
            text: what,
        });
    }
    for m in ix.mentions(&e.id) {
        events.push(Event {
            date: m.date,
            time: m.time,
            text: format!("[{}] {}", m.author, m.text),
        });
    }
    events.sort_by(|a, b| (&a.date, &a.time).cmp(&(&b.date, &b.time)));
    Ok(events)
}

fn split_when(when: &str) -> (String, String) {
    match when.split_once('T') {
        Some((d, t)) => (d.to_string(), t.chars().take(5).collect()),
        None => (when.to_string(), String::new()),
    }
}

fn metrics_summary(ix: &Index, run: &Entity) -> String {
    let Some(exp) = &run.experiment else {
        return String::new();
    };
    let Some(row) = ix.results(exp).into_iter().find(|r| r.run == run.id) else {
        return String::new();
    };
    let parts: Vec<String> = row
        .metrics
        .iter()
        .map(|(k, v, _)| format!("{k}={v}"))
        .collect();
    format!("  {}", parts.join(" "))
}

pub fn cmd_timeline(vault: &Vault, id: &str) -> Res<i32> {
    let id = &vault.canonical_id(id);
    let ix = Index::open(vault, false)?;
    for ev in timeline(&ix, id)? {
        println!("{:<10} {:<5} {}", ev.date, ev.time, ev.text);
    }
    Ok(0)
}

/// A project's experiments grouped by theme (first tag), in creation order.
pub fn tree(ix: &Index, project: &str) -> BTreeMap<String, Vec<Entity>> {
    let mut themes: BTreeMap<String, Vec<Entity>> = BTreeMap::new();
    for e in ix.entities(
        "WHERE type = 'experiment' AND project = ?1",
        &[&project.to_string()],
    ) {
        themes.entry(e.theme()).or_default().push(e);
    }
    themes
}

pub fn cmd_tree(vault: &Vault, project: Option<&str>) -> Res<i32> {
    let ix = Index::open(vault, false)?;
    let project = match project {
        Some(p) => vault.canonical_id(p),
        None if vault.is_project() => vault.single_project()?,
        None => return Err("a project is required: yajna tree PRJ-xxxx".to_string()),
    };
    let p = find(&ix, &project)?;
    println!("{}  {}", p.id, p.title);
    let themes = tree(&ix, &project);
    if themes.is_empty() {
        println!("  no experiments");
    }
    for (theme, exps) in themes {
        println!(
            "\n{}",
            if theme.is_empty() {
                "(no theme)".to_string()
            } else {
                theme
            }
        );
        for e in exps {
            let runs = ix
                .entities("WHERE type = 'run' AND experiment = ?1", &[&e.id])
                .len();
            let influenced: Vec<String> = ix
                .links(&e.id)
                .into_iter()
                .filter(|(_, _, c)| c == "influenced_by")
                .map(|(d, _, _)| d)
                .collect();
            let arrow = if influenced.is_empty() {
                String::new()
            } else {
                format!("  <- {}", influenced.join(", "))
            };
            let runs = if runs == 0 {
                String::new()
            } else {
                format!("  ({runs} run{})", if runs == 1 { "" } else { "s" })
            };
            println!("  {}{runs}{arrow}", line(&e));
        }
    }
    Ok(0)
}

pub fn cmd_runs(vault: &Vault, experiment: &str, by: Option<&str>, desc: bool) -> Res<i32> {
    let experiment = &vault.canonical_id(experiment);
    let ix = Index::open(vault, false)?;
    let e = find(&ix, experiment)?;
    if e.etype != "experiment" {
        return Err(format!("{experiment} is a {}, not an experiment", e.etype));
    }
    let mut rows = ix.results(experiment);
    let pages = ix.entities(
        "WHERE type = 'run' AND experiment = ?1",
        &[&experiment.to_string()],
    );
    // runs without a results.tsv row still appear, with their status
    for r in &pages {
        if !rows.iter().any(|row| row.run == r.id) {
            rows.push(crate::index::RunRow {
                run: r.id.clone(),
                finished: r
                    .meta
                    .get("finished")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string(),
                metrics: vec![(
                    "status".to_string(),
                    r.status.clone().unwrap_or_default(),
                    None,
                )],
            });
        }
    }
    if let Some(key) = by {
        if !rows
            .iter()
            .any(|r| r.metrics.iter().any(|(k, _, _)| k == key))
        {
            return Err(format!("no run of {experiment} has a metric {key:?}"));
        }
        rows.sort_by(|a, b| {
            let va = a
                .metrics
                .iter()
                .find(|(k, _, _)| k == key)
                .and_then(|m| m.2);
            let vb = b
                .metrics
                .iter()
                .find(|(k, _, _)| k == key)
                .and_then(|m| m.2);
            // runs without the metric sort last either way
            match (va, vb) {
                (Some(x), Some(y)) => {
                    let o = x.partial_cmp(&y).unwrap_or(std::cmp::Ordering::Equal);
                    if desc {
                        o.reverse()
                    } else {
                        o
                    }
                }
                (Some(_), None) => std::cmp::Ordering::Less,
                (None, Some(_)) => std::cmp::Ordering::Greater,
                (None, None) => std::cmp::Ordering::Equal,
            }
        });
    } else {
        rows.sort_by(|a, b| (&a.finished, &a.run).cmp(&(&b.finished, &b.run)));
    }
    let mut columns: Vec<String> = Vec::new();
    for r in &rows {
        for (k, _, _) in &r.metrics {
            if !columns.contains(k) {
                columns.push(k.clone());
            }
        }
    }
    println!("{:<18} {:<16} {}", "run", "finished", columns.join("\t"));
    for r in &rows {
        let cells: Vec<String> = columns
            .iter()
            .map(|c| {
                r.metrics
                    .iter()
                    .find(|(k, _, _)| k == c)
                    .map(|(_, v, _)| v.clone())
                    .unwrap_or_default()
            })
            .collect();
        println!(
            "{:<18} {:<16} {}",
            r.run,
            r.finished.chars().take(16).collect::<String>(),
            cells.join("\t")
        );
    }
    if rows.is_empty() {
        println!("no runs");
    }
    Ok(0)
}
