//! Validate every page in the vault: frontmatter against schema, IDs, links, protocol steps.

use std::collections::{BTreeMap, BTreeSet};
use std::path::{Path, PathBuf};
use std::sync::LazyLock;

use jsonschema::Validator;
use regex::Regex;
use serde_json::{Map, Value};

use crate::refs;
use crate::vault::without_code;
use crate::vault::{
    load_yaml, prefix_to_type, rel, Page, Res, Schemas, Vault, ID_FULL_RE, LINK_RE, NS_ID_RE,
    PATH_FIELDS,
};

static STEP_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^(\d+)\.\s+(.*?)\s*$").unwrap());
/// `- [[ID]] description` list items: what a project page lists its experiments with and an
/// experiment page its runs; the description is required.
static LISTED_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^\s*[-*]\s+\[\[([^\]|]+)(?:\|[^\]]*)?\]\]\s*(.*?)\s*$").unwrap());

struct Problems {
    root: PathBuf,
    items: Vec<String>,
}

impl Problems {
    fn add(&mut self, path: &Path, msg: impl AsRef<str>) {
        self.items
            .push(format!("{}: {}", rel(path, &self.root), msg.as_ref()));
    }
}

fn validators() -> Res<BTreeMap<String, Validator>> {
    let mut out = BTreeMap::new();
    for name in Schemas::iter() {
        if !name.ends_with(".json") {
            continue;
        }
        let Some(file) = Schemas::get(&name) else {
            continue;
        };
        let schema: Value =
            serde_json::from_slice(&file.data).map_err(|e| format!("schema {name}: {e}"))?;
        let validator =
            jsonschema::validator_for(&schema).map_err(|e| format!("schema {name}: {e}"))?;
        out.insert(name.trim_end_matches(".json").to_string(), validator);
    }
    Ok(out)
}

/// Schema errors as `path: message`, sorted by path, with the JSON-pointer slash stripped.
fn schema_errors(validator: &Validator, instance: &Value, fallback: &str) -> Vec<String> {
    let mut errs: Vec<(String, String)> = validator
        .iter_errors(instance)
        .map(|e| {
            let p = e.instance_path().to_string();
            let p = p.trim_start_matches('/').to_string();
            (p, e.to_string())
        })
        .collect();
    errs.sort();
    errs.into_iter()
        .map(|(p, m)| format!("{}: {m}", if p.is_empty() { fallback } else { &p }))
        .collect()
}

/// IDs inside a frontmatter value, recursively: (local IDs, (namespace, ID) pairs).
pub fn ids_in(value: &Value, local: &mut BTreeSet<String>, namespaced: &mut Vec<(String, String)>) {
    match value {
        Value::String(s) => {
            for c in NS_ID_RE.captures_iter(s) {
                match c.get(1) {
                    Some(ns) => namespaced.push((ns.as_str().to_string(), c[2].to_string())),
                    None => {
                        local.insert(c[2].to_string());
                    }
                }
            }
        }
        Value::Array(items) => items.iter().for_each(|v| ids_in(v, local, namespaced)),
        Value::Object(m) => m.values().for_each(|v| ids_in(v, local, namespaced)),
        _ => {}
    }
}

#[allow(dead_code)]
pub struct Step {
    pub number: usize,
    pub text: String,
    pub attrs: Option<Map<String, Value>>,
}

/// Steps and errors for the `## Steps` section of a protocol body.
pub fn parse_steps(body: &str) -> (Vec<Step>, Vec<String>) {
    let mut steps = Vec::new();
    let mut errors = Vec::new();
    let mut in_steps = false;
    for line in body.lines() {
        if line.starts_with("## ") {
            in_steps = line.trim() == "## Steps";
            continue;
        }
        if !in_steps {
            continue;
        }
        let Some(m) = STEP_RE.captures(line) else {
            continue;
        };
        let n: usize = m[1].parse().unwrap_or(0);
        let mut text = m[2].to_string();
        let mut attrs = None;
        if text.ends_with('}') {
            let start = match text.rfind(" {") {
                Some(i) => Some(i),
                None if text.starts_with('{') => Some(0),
                None => None,
            };
            if let Some(start) = start {
                let raw = text[start..].trim().to_string();
                text = text[..start].trim_end().to_string();
                match load_yaml(&raw) {
                    Ok(Value::Object(m)) => attrs = Some(m),
                    Ok(_) => errors.push(format!(
                        "step {n}: attribute block is not a mapping: {raw:?}"
                    )),
                    Err(e) => {
                        errors.push(format!("step {n}: cannot parse attributes {raw:?}: {e}"))
                    }
                }
            }
        }
        steps.push(Step {
            number: n,
            text,
            attrs,
        });
    }
    for (i, step) in steps.iter().enumerate() {
        if step.number != i + 1 {
            errors.push(format!(
                "step numbering: expected {}, found {}",
                i + 1,
                step.number
            ));
            break;
        }
    }
    (steps, errors)
}

/// (problems, number of entity pages checked).
pub fn validate(vault: &Vault) -> Res<(Vec<String>, usize)> {
    let mut problems = Problems {
        root: vault.root.clone(),
        items: Vec::new(),
    };
    let validators = validators()?;
    let pages: Vec<Page> = vault.pages()?;
    let mut ids: BTreeMap<String, PathBuf> = BTreeMap::new();
    let mut counted = 0;

    for page in &pages {
        let Some(meta) = &page.meta else { continue };
        counted += 1;
        let ptype = meta.get("type").and_then(|v| v.as_str()).unwrap_or("");
        let Some(validator) = validators.get(ptype) else {
            problems.add(
                &page.path,
                format!(
                    "unknown type {:?}",
                    meta.get("type")
                        .map(|v| v.to_string())
                        .unwrap_or_else(|| "None".into())
                ),
            );
            continue;
        };
        for msg in schema_errors(validator, &Value::Object(meta.clone()), "frontmatter") {
            problems.add(&page.path, msg);
        }
        if crate::sync::has_markers(&page.body) {
            problems.add(
                &page.path,
                "conflict markers (<<<<<<< ... >>>>>>>) are still in the page; resolve them",
            );
        }

        if ptype == "log" {
            let date = meta.get("date").map(value_str).unwrap_or_default();
            if !file_name(&page.path).starts_with(&date) {
                problems.add(
                    &page.path,
                    format!("filename does not start with date {date}"),
                );
            }
            continue;
        }
        if ptype == "reference" {
            let key = meta.get("citekey").map(value_str).unwrap_or_default();
            if page
                .path
                .file_stem()
                .map(|s| s.to_string_lossy() != key)
                .unwrap_or(true)
            {
                problems.add(&page.path, format!("filename does not match citekey {key}"));
            }
            continue;
        }

        let Some(pid) = meta.get("id").and_then(|v| v.as_str()) else {
            continue;
        };
        if let Some(other) = ids.get(pid) {
            problems.add(
                &page.path,
                format!("duplicate id {pid}, also in {}", rel(other, &vault.root)),
            );
        }
        ids.insert(pid.to_string(), page.path.clone());
        let prefix = pid.split('-').next().unwrap_or("");
        if prefix_to_type(prefix) != Some(ptype) {
            problems.add(
                &page.path,
                format!("id prefix {prefix} does not match type {ptype}"),
            );
        }
        let name = file_name(&page.path);
        // A project page is README.md in a directory named by its ID; in a project repo it
        // is the vault's own README.md.
        let named_by_id = name.starts_with(pid)
            || (name == "README.md"
                && (page.path == vault.notes.join("README.md") && vault.is_project()
                    || page
                        .path
                        .parent()
                        .map(|p| file_name(p).starts_with(pid))
                        .unwrap_or(false)));
        if !named_by_id {
            problems.add(&page.path, format!("filename does not start with id {pid}"));
        }
        if let Some(script) = meta.get("script").and_then(|v| v.as_str()) {
            if !vault.root.join(script).is_file() {
                problems.add(&page.path, format!("script {script} does not exist"));
            }
        }
        if let Some(code) = meta.get("code").and_then(|v| v.as_str()) {
            // a path under the repo, or a location (`github:owner/repo`, a URL) after a move
            if !code.contains(':') && !vault.root.join(code).is_dir() {
                problems.add(&page.path, format!("code directory {code} does not exist"));
            }
        }
    }

    // Other repos named in [repos] with a checkout on disk: their IDs are checked too.
    let mut remote_ids: BTreeMap<String, Option<BTreeMap<String, PathBuf>>> = BTreeMap::new();
    let mut lookup = |ns: &str| -> Option<BTreeMap<String, PathBuf>> {
        remote_ids
            .entry(ns.to_string())
            .or_insert_with(|| {
                let root = vault.repo_root(ns)?;
                Vault::open(root).ok()?.index().ok()
            })
            .clone()
    };

    // Links and references need the full ID set, and old IDs their successors.
    let previous: BTreeMap<String, String> = pages
        .iter()
        .filter_map(|p| Some((p.field("previous_id")?.to_string(), p.id()?.to_string())))
        .collect();
    let keys = refs::bib_keys(vault);
    let bib = refs::bib_path(vault);
    for page in &pages {
        let Some(meta) = &page.meta else { continue };
        let prose = without_code(&page.body);
        // a page's own `bibliography` adds to the notebook's
        let own = refs::own_bibliographies(page);
        let mut own_keys = BTreeSet::new();
        for b in &own {
            if b.is_file() {
                own_keys.extend(refs::keys_in(b));
            } else {
                problems.add(
                    &page.path,
                    format!("bibliography {} does not exist", rel(b, &vault.root)),
                );
            }
        }
        for key in refs::citations(&prose) {
            if !keys.contains(&key) && !own_keys.contains(&key) {
                let mut bibs = vec![rel(&bib, &vault.root).to_string()];
                bibs.extend(own.iter().map(|b| rel(b, &vault.root).to_string()));
                problems.add(
                    &page.path,
                    format!("citation @{key} not in {}", bibs.join(" or ")),
                );
            }
        }
        let mut targets = BTreeSet::new();
        let mut namespaced = Vec::new();
        for (k, v) in meta {
            if k != "id" && !PATH_FIELDS.contains(&k.as_str()) {
                ids_in(v, &mut targets, &mut namespaced);
            }
        }
        for m in LINK_RE.captures_iter(&prose) {
            let target = m[1].trim().split('@').next().unwrap_or("").to_string();
            match target.split_once('/') {
                Some((ns, id)) if ID_FULL_RE.is_match(id) => {
                    namespaced.push((ns.to_string(), id.to_string()))
                }
                _ => {
                    if ID_FULL_RE.is_match(&target) {
                        targets.insert(target);
                    }
                }
            }
        }
        for target in &targets {
            if !ids.contains_key(target) {
                let msg = match previous.get(target) {
                    Some(now) => format!("link to {target}, which is now {now}"),
                    None => format!("link to unknown id {target}"),
                };
                problems.add(&page.path, msg);
            }
        }
        let mut seen_ns = BTreeSet::new();
        let mut seen_remote = BTreeSet::new();
        for (ns, id) in &namespaced {
            if seen_ns.insert(ns.clone()) && !vault.cfg.repos.contains_key(ns) {
                problems.add(
                    &page.path,
                    format!("namespace {ns} not in [repos] of yajna.toml"),
                );
            }
            if !seen_remote.insert((ns.clone(), id.clone())) {
                continue;
            }
            if let Some(index) = lookup(ns) {
                if !index.contains_key(id) {
                    problems.add(&page.path, format!("link to unknown id {ns}/{id}"));
                }
            }
        }

        // Listed children carry a short description: experiments on a project page, runs on
        // an experiment page.
        let child_prefix = match meta.get("type").and_then(|v| v.as_str()) {
            Some("project") => Some("EXP-"),
            Some("experiment") => Some("RUN-"),
            _ => None,
        };
        if let Some(prefix) = child_prefix {
            for line in prose.lines() {
                let Some(m) = LISTED_RE.captures(line) else {
                    continue;
                };
                let target = m[1].trim();
                if target.starts_with(prefix) && m[2].is_empty() {
                    problems.add(
                        &page.path,
                        format!("{target} is listed without a short description after the link"),
                    );
                }
            }
        }

        if meta.get("type").and_then(|v| v.as_str()) == Some("protocol") {
            let (steps, errors) = parse_steps(&page.body);
            for e in errors {
                problems.add(&page.path, e);
            }
            if steps.is_empty() {
                problems.add(&page.path, "no steps under `## Steps`");
            }
            for step in &steps {
                let Some(attrs) = &step.attrs else { continue };
                let instance = Value::Object(attrs.clone());
                if let Some(step_validator) = validators.get("step") {
                    for msg in schema_errors(step_validator, &instance, "attributes") {
                        problems.add(&page.path, format!("step {} {msg}", step.number));
                    }
                }
                let mut local = BTreeSet::new();
                let mut ns = Vec::new();
                ids_in(&instance, &mut local, &mut ns);
                for r in &local {
                    if !ids.contains_key(r) {
                        problems.add(&page.path, format!("step {}: unknown id {r}", step.number));
                    }
                }
            }
        }
    }

    let counters = vault.read_counters()?;
    for pid in ids.keys() {
        let (prefix, rest) = pid.split_once('-').unwrap_or((pid, ""));
        if let Some((_, n)) = counters.iter().find(|(k, _)| k == prefix) {
            if let Ok(num) = rest.parse::<i64>() {
                if num > *n {
                    problems.add(
                        &vault.counters_file,
                        format!("{prefix} counter {n} is below existing {pid}"),
                    );
                }
            }
        }
    }

    Ok((problems.items, counted))
}

fn value_str(v: &Value) -> String {
    match v {
        Value::String(s) => s.clone(),
        other => other.to_string(),
    }
}

fn file_name(p: &Path) -> String {
    p.file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn steps() {
        let body = "## Steps\n1. Thaw [[MAT-0001]] on ice. {duration: 15m, materials: [MAT-0001]}\n2. Spin. {duration: 10m, wait: true}\n3. Plain.\n\n## Notes\n4. not a step\n";
        let (steps, errors) = parse_steps(body);
        assert!(errors.is_empty(), "{errors:?}");
        assert_eq!(steps.len(), 3);
        assert_eq!(steps[0].text, "Thaw [[MAT-0001]] on ice.");
        assert_eq!(steps[0].attrs.as_ref().unwrap()["duration"], "15m");
        assert!(steps[2].attrs.is_none());
        let (_, errors) = parse_steps("## Steps\n1. Ok.\n3. Skipped.\n");
        assert_eq!(errors, vec!["step numbering: expected 2, found 3"]);
    }

    #[test]
    fn namespaced_ids() {
        let mut local = BTreeSet::new();
        let mut ns = Vec::new();
        ids_in(
            &serde_json::json!({"protocols": ["PRO-0012", "yajna/PRO-0013"], "x": "see EXP-0001"}),
            &mut local,
            &mut ns,
        );
        assert_eq!(
            local.into_iter().collect::<Vec<_>>(),
            vec!["EXP-0001", "PRO-0012"]
        );
        assert_eq!(ns, vec![("yajna".to_string(), "PRO-0013".to_string())]);
    }
}
