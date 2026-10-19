//! The commands behind the CLI: new, log, result, tasks, ref, validate.

use std::fs;
use std::io::{IsTerminal, Read};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::LazyLock;

use regex::Regex;
use serde_json::Value;

use crate::cli::Cmd;
use crate::refs;
use crate::tui::{self, Prompter};
use crate::validate;
use crate::vault::{
    canonical_type, date_of, entity, iso_minutes, rel, slugify, Res, Vault, PROJECT_SCOPED,
};
use crate::yamlfmt::title_scalar;

static TASK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^\s*- \[( |x|X)\] (.+?)\s*$").unwrap());

pub const RESULT_MARK: &str = "===RESULT===";
pub const PROJECTS_MARK: &str = "# projects: registered by yajna new project --code\n";

/// Run one parsed command. Returns the exit code.
pub fn run(vault: &Vault, cmd: &Cmd, prompter: &mut dyn Prompter) -> Res<i32> {
    match cmd {
        Cmd::New {
            etype,
            title,
            project,
            experiment,
            kind,
            code,
            author,
            script,
        } => {
            let path = match etype {
                None => tui::new(vault, prompter, author.as_deref())?,
                Some(t) => create(
                    vault,
                    t,
                    title.as_deref(),
                    project.as_deref(),
                    experiment.as_deref(),
                    kind.as_deref(),
                    *code,
                    author.as_deref(),
                    script.as_deref(),
                )?,
            };
            println!("{}", rel(&path, &vault.root));
            Ok(0)
        }
        Cmd::Log {
            text,
            date,
            time,
            author,
        } => cmd_log(
            vault,
            text,
            date.as_deref(),
            time.as_deref(),
            author.as_deref(),
            prompter,
        ),
        Cmd::ResultCmd {
            experiment,
            file,
            kind,
            author,
            note,
            script,
        } => cmd_result(
            vault,
            experiment,
            file.as_deref(),
            kind,
            author.as_deref(),
            note.as_deref(),
            script.as_deref(),
        ),
        Cmd::Tasks { done } => cmd_tasks(vault, *done),
        Cmd::Ref { key, note } => cmd_ref(vault, key, *note),
        Cmd::Validate => cmd_validate(vault),
        Cmd::Index => crate::query::cmd_index(vault),
        Cmd::Show { id } => crate::query::cmd_show(vault, id),
        Cmd::Timeline { id } => crate::query::cmd_timeline(vault, id),
        Cmd::Tree { project } => crate::query::cmd_tree(vault, project.as_deref()),
        Cmd::Runs {
            experiment,
            by,
            desc,
        } => crate::query::cmd_runs(vault, experiment, by.as_deref(), *desc),
        Cmd::Site { out } => crate::site::cmd_site(vault, out.as_deref()),
        Cmd::Skill { print } => cmd_skill(vault, *print),
        Cmd::Graduate {
            project,
            to,
            into,
            namespace,
        } => crate::init::graduate(vault, project, to, into.as_deref(), namespace.as_deref()),
        Cmd::Init { .. } => unreachable!("init runs before a vault is opened"),
    }
}

// --- new -----------------------------------------------------------------------------

/// Allocate an ID, fill the template, write the page. `code` scaffolds `code/<slug>/`;
/// `script` (runs) is recorded and stubbed when the file is missing.
#[allow(clippy::too_many_arguments)]
pub fn create(
    vault: &Vault,
    etype: &str,
    title: Option<&str>,
    project: Option<&str>,
    experiment: Option<&str>,
    kind: Option<&str>,
    code: bool,
    author: Option<&str>,
    script: Option<&str>,
) -> Res<PathBuf> {
    let etype = canonical_type(etype);
    let Some(ent) = entity(&etype) else {
        return Err(format!(
            "unknown entity type {etype:?}; one of {}",
            crate::vault::entity_names().join(", ")
        ));
    };
    let title: String = match title {
        Some(t) => t.to_string(),
        None if etype == "run" => String::new(),
        None if etype == "agent_session" => "Agent session".to_string(),
        None => return Err(format!("a title is required for a {etype}")),
    };

    if vault.is_project() {
        // One project per repo; shared entities live in a lab and are linked by namespace.
        if etype == "project" {
            return Err("a project repo holds one project, notes/README.md".to_string());
        }
        if ["protocol", "material", "equipment", "build"].contains(&etype.as_str()) {
            return Err(format!(
                "{etype}s live in the lab; link them as [[<namespace>/{}-xxxx]]",
                ent.prefix
            ));
        }
    }
    let mut project = project.map(str::to_string);
    if let (Some(exp), None) = (experiment, &project) {
        project = vault.find(exp)?.field("project").map(str::to_string);
    }
    if vault.is_project() && PROJECT_SCOPED.contains(&etype.as_str()) && project.is_none() {
        project = Some(vault.single_project()?);
    }
    if PROJECT_SCOPED.contains(&etype.as_str()) && project.is_none() {
        return Err(format!(
            "a {etype} needs --project PRJ-xxxx (or --experiment EXP-xxxx)"
        ));
    }
    if let Some(p) = &project {
        vault.find(p)?; // must exist
    }
    if code && etype != "project" {
        return Err("--code only applies to projects".to_string());
    }
    if script.is_some() && etype != "run" {
        return Err("--script only applies to runs".to_string());
    }
    let author = author
        .map(str::to_string)
        .unwrap_or_else(|| vault.default_author());

    let kind = kind
        .map(str::to_string)
        .unwrap_or_else(|| match etype.as_str() {
            "run" => "bench".to_string(),
            "material" => "reagent".to_string(),
            _ => String::new(),
        });
    let ident = vault.allocate(ent.prefix)?;
    let slug = if title.is_empty() {
        String::new()
    } else {
        slugify(&title)
    };
    let now = vault.now();
    let date = date_of(&now);
    let now_iso = iso_minutes(&now);
    let code_field = if code {
        format!("code/{slug}")
    } else {
        "null".to_string()
    };
    let title_field = title_scalar(&title);
    let template = if etype == "project" && code {
        "project-code"
    } else {
        ent.template
    };
    let text = vault.render(
        template,
        &[
            ("id", &ident),
            ("title", &title_field),
            ("created", &date),
            ("author", &author),
            ("project", project.as_deref().unwrap_or("null")),
            ("experiment", experiment.unwrap_or("null")),
            ("kind", &kind),
            ("slug", &slug),
            ("now", &now_iso),
            ("date", &date),
            ("code", &code_field),
            ("script", script.unwrap_or("null")),
        ],
    )?;

    let path = if etype == "project" {
        vault
            .notes
            .join(ent.subdir)
            .join(format!("{ident}-{slug}"))
            .join("README.md")
    } else {
        let name = if slug.is_empty() {
            format!("{ident}.md")
        } else {
            format!("{ident}-{slug}.md")
        };
        if PROJECT_SCOPED.contains(&etype.as_str()) {
            vault
                .project_dir(project.as_deref().unwrap())?
                .join(ent.subdir)
                .join(name)
        } else {
            vault.notes.join(ent.subdir).join(name)
        }
    };
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
    if code {
        scaffold_code(vault, &slug, &ident, &title)?;
    }
    if let Some(script) = script {
        stub_script(vault, script, &ident, experiment.unwrap_or(""))?;
    }
    Ok(path)
}

/// Write the run-script stub at `script` (relative to the root) unless it exists.
fn stub_script(vault: &Vault, script: &str, id: &str, experiment: &str) -> Res<()> {
    let path = vault.root.join(script);
    if path.exists() {
        return Ok(());
    }
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let text = vault.render(
        "run.sh",
        &[("id", id), ("experiment", experiment), ("script", script)],
    )?;
    fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&path, fs::Permissions::from_mode(0o755));
    }
    eprintln!("wrote {script}; fill it in so the run can be re-created");
    Ok(())
}

/// Write the embedded agent skill into the repo (`.claude/skills/yajna/SKILL.md`).
fn cmd_skill(vault: &Vault, print: bool) -> Res<i32> {
    let text = skill_text()?;
    if print {
        print!("{text}");
        return Ok(0);
    }
    let path = write_skill(&vault.root)?;
    println!("{}", rel(&path, &vault.root));
    Ok(0)
}

pub fn skill_text() -> Res<String> {
    crate::vault::Skills::get("yajna/SKILL.md")
        .map(|f| String::from_utf8_lossy(&f.data).into_owned())
        .ok_or_else(|| "the skill is not embedded in this binary".to_string())
}

pub fn write_skill(root: &Path) -> Res<PathBuf> {
    let path = root
        .join(".claude")
        .join("skills")
        .join("yajna")
        .join("SKILL.md");
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, skill_text()?).map_err(|e| format!("{}: {e}", path.display()))?;
    Ok(path)
}

/// Create code/<slug>/ with a flake and README and register it in the root flake.
pub fn scaffold_code(vault: &Vault, slug: &str, id: &str, title: &str) -> Res<PathBuf> {
    let code_dir = vault.root.join("code").join(slug);
    if code_dir.exists() {
        return Err(format!("{} already exists", rel(&code_dir, &vault.root)));
    }
    fs::create_dir_all(&code_dir).map_err(|e| e.to_string())?;
    for name in ["flake.nix", "README.md"] {
        let text = vault.render(
            &format!("code/{name}"),
            &[("slug", slug), ("id", id), ("title", title)],
        )?;
        fs::write(code_dir.join(name), text).map_err(|e| e.to_string())?;
    }
    let root_flake = vault.root.join("flake.nix");
    if let Ok(flake) = fs::read_to_string(&root_flake) {
        if flake.contains(PROJECTS_MARK) {
            let line = format!("  inputs.{slug} = {{ url = \"path:./code/{slug}\"; inputs.nixpkgs.follows = \"nixpkgs\"; }};\n");
            fs::write(
                &root_flake,
                flake.replacen(PROJECTS_MARK, &format!("{PROJECTS_MARK}{line}"), 1),
            )
            .map_err(|e| e.to_string())?;
            eprintln!(
                "registered input {slug} in flake.nix; next: git add code/{slug} && nix flake lock"
            );
        }
    }
    Ok(code_dir)
}

// --- log -----------------------------------------------------------------------------

fn cmd_log(
    vault: &Vault,
    words: &[String],
    date: Option<&str>,
    time: Option<&str>,
    author: Option<&str>,
    prompter: &mut dyn Prompter,
) -> Res<i32> {
    let now = vault.now();
    let date = date.map(str::to_string).unwrap_or_else(|| date_of(&now));
    let time = time
        .map(str::to_string)
        .unwrap_or_else(|| now.strftime("%H:%M").to_string());
    let author = author
        .map(str::to_string)
        .unwrap_or_else(|| vault.default_author());
    let path = vault.log_path(&date, Some(&author));
    if !path.exists() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        fs::write(
            &path,
            vault.render("log", &[("date", &date), ("author", &author)])?,
        )
        .map_err(|e| e.to_string())?;
    }
    let mut text = words.join(" ").trim().to_string();
    if text.is_empty() {
        if std::io::stdin().is_terminal() {
            text = tui::log_entry(vault, prompter)?;
        } else {
            let mut buf = String::new();
            std::io::stdin()
                .read_to_string(&mut buf)
                .map_err(|e| e.to_string())?;
            text = buf.trim().to_string();
        }
    }
    if text.is_empty() {
        return Err("nothing to log".to_string());
    }
    let mut content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    content.push_str(&format!("- {time} {text}\n"));
    fs::write(&path, content).map_err(|e| e.to_string())?;
    println!("{}: {time} {text}", rel(&path, &vault.root));
    Ok(0)
}

// --- result --------------------------------------------------------------------------

fn git_commit(root: &Path) -> Option<String> {
    let out = Command::new("git")
        .args(["rev-parse", "--short", "HEAD"])
        .current_dir(root)
        .output()
        .ok()?;
    if !out.status.success() {
        return None;
    }
    let s = String::from_utf8_lossy(&out.stdout).trim().to_string();
    if s.is_empty() {
        None
    } else {
        Some(s)
    }
}

fn cmd_result(
    vault: &Vault,
    experiment: &str,
    file: Option<&Path>,
    kind: &str,
    author: Option<&str>,
    note: Option<&str>,
    script: Option<&str>,
) -> Res<i32> {
    let source = match file {
        Some(f) => fs::read_to_string(f).map_err(|e| format!("{}: {e}", f.display()))?,
        None => {
            let mut buf = String::new();
            std::io::stdin()
                .read_to_string(&mut buf)
                .map_err(|e| e.to_string())?;
            buf
        }
    };
    let Some(line) = source.lines().rfind(|l| l.starts_with(RESULT_MARK)) else {
        return Err(format!("no line starting with {RESULT_MARK} in input"));
    };
    let result: Value = serde_json::from_str(line[RESULT_MARK.len()..].trim())
        .map_err(|e| format!("bad JSON after {RESULT_MARK}: {e}"))?;
    let Value::Object(result) = result else {
        return Err("the result line must be a JSON object".to_string());
    };

    let exp = vault.find(experiment)?;
    let project = exp.field("project").map(str::to_string);
    let ident = vault.allocate("RUN")?;
    let now = vault.now();
    let finished = iso_minutes(&now);
    let mut meta: Vec<(&str, Value)> = vec![
        ("id", Value::String(ident.clone())),
        ("type", "run".into()),
        ("schema_version", 1.into()),
        ("kind", kind.into()),
        (
            "project",
            project.clone().map(Value::String).unwrap_or(Value::Null),
        ),
        ("experiment", experiment.into()),
        ("status", "done".into()),
        ("created", Value::String(date_of(&now))),
        ("finished", Value::String(finished.clone())),
        (
            "author",
            author
                .map(str::to_string)
                .unwrap_or_else(|| vault.default_author())
                .into(),
        ),
    ];
    if let Some(commit) = git_commit(&vault.root) {
        meta.push(("commit", Value::String(commit)));
    }
    if let Some(script) = script {
        if !vault.root.join(script).is_file() {
            return Err(format!("script {script} does not exist"));
        }
        meta.push(("script", Value::String(script.to_string())));
    }
    let rows: Vec<String> = result
        .iter()
        .map(|(k, v)| {
            format!(
                "| {k} | {} |",
                match v {
                    Value::String(s) => s.clone(),
                    other => py_json(other),
                }
            )
        })
        .collect();
    let mut body = format!(
        "\n## Result\n\n| Key | Value |\n|-----|-------|\n{}\n",
        rows.join("\n")
    );
    if let Some(note) = note {
        body.push_str(&format!("\n## Notes\n\n{note}\n"));
    }
    let Some(project) = project else {
        return Err(format!("{experiment}: no project in frontmatter"));
    };
    let path = vault
        .project_dir(&project)?
        .join("runs")
        .join(format!("{ident}.md"));
    vault.write_page(&path, &meta, &body)?;

    let tsv = exp
        .path
        .parent()
        .unwrap()
        .join(experiment)
        .join("results.tsv");
    let mut row: Vec<(String, Value)> = vec![
        ("run".into(), Value::String(ident)),
        ("finished".into(), Value::String(finished)),
    ];
    for (k, v) in &result {
        match row.iter_mut().find(|(rk, _)| rk == k) {
            Some((_, rv)) => *rv = v.clone(),
            None => row.push((k.clone(), v.clone())),
        }
    }
    append_tsv(&tsv, &row)?;
    println!("{}\n{}", rel(&path, &vault.root), rel(&tsv, &vault.root));
    Ok(0)
}

/// Append a row, adding columns as new keys appear, the way Python's csv module writes it.
fn append_tsv(tsv: &Path, row: &[(String, Value)]) -> Res<()> {
    if let Some(parent) = tsv.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let mut columns: Vec<String> = Vec::new();
    let mut existing: Vec<Vec<String>> = Vec::new();
    if tsv.is_file() {
        let mut reader = csv::ReaderBuilder::new()
            .delimiter(b'\t')
            .flexible(true)
            .from_path(tsv)
            .map_err(|e| e.to_string())?;
        columns = reader
            .headers()
            .map_err(|e| e.to_string())?
            .iter()
            .map(str::to_string)
            .collect();
        for rec in reader.records() {
            existing.push(
                rec.map_err(|e| e.to_string())?
                    .iter()
                    .map(str::to_string)
                    .collect(),
            );
        }
    }
    for (k, _) in row {
        if !columns.contains(k) {
            columns.push(k.clone());
        }
    }
    let mut w = csv::WriterBuilder::new()
        .delimiter(b'\t')
        .terminator(csv::Terminator::CRLF)
        .from_path(tsv)
        .map_err(|e| e.to_string())?;
    w.write_record(&columns).map_err(|e| e.to_string())?;
    for r in &existing {
        let mut padded = r.clone();
        padded.resize(columns.len(), String::new());
        w.write_record(&padded).map_err(|e| e.to_string())?;
    }
    let cells: Vec<String> = columns
        .iter()
        .map(|c| match row.iter().find(|(k, _)| k == c) {
            Some((_, v)) => tsv_cell(v),
            None => String::new(),
        })
        .collect();
    w.write_record(&cells).map_err(|e| e.to_string())?;
    w.flush().map_err(|e| e.to_string())
}

/// A value as Python's csv module writes `str(value)`, with lists and dicts as JSON.
fn tsv_cell(v: &Value) -> String {
    match v {
        Value::Null => String::new(),
        Value::Bool(true) => "True".into(),
        Value::Bool(false) => "False".into(),
        Value::Number(n) => n.to_string(),
        Value::String(s) => s.clone(),
        other => py_json(other),
    }
}

/// `json.dumps(value)` with Python's default separators and ASCII escaping.
pub fn py_json(v: &Value) -> String {
    match v {
        Value::Null => "null".into(),
        Value::Bool(b) => b.to_string(),
        Value::Number(n) => n.to_string(),
        Value::String(s) => {
            let mut out = String::from("\"");
            for c in s.chars() {
                match c {
                    '"' => out.push_str("\\\""),
                    '\\' => out.push_str("\\\\"),
                    '\n' => out.push_str("\\n"),
                    '\r' => out.push_str("\\r"),
                    '\t' => out.push_str("\\t"),
                    c if (c as u32) < 0x20 || (c as u32) > 0x7e => {
                        let mut buf = [0u16; 2];
                        for unit in c.encode_utf16(&mut buf) {
                            out.push_str(&format!("\\u{unit:04x}"));
                        }
                    }
                    c => out.push(c),
                }
            }
            out.push('"');
            out
        }
        Value::Array(items) => format!(
            "[{}]",
            items.iter().map(py_json).collect::<Vec<_>>().join(", ")
        ),
        Value::Object(m) => format!(
            "{{{}}}",
            m.iter()
                .map(|(k, v)| format!("{}: {}", py_json(&Value::String(k.clone())), py_json(v)))
                .collect::<Vec<_>>()
                .join(", ")
        ),
    }
}

// --- tasks ---------------------------------------------------------------------------

fn cmd_tasks(vault: &Vault, done: bool) -> Res<i32> {
    let mut n = 0;
    for page in vault.pages()? {
        let text = fs::read_to_string(&page.path).map_err(|e| e.to_string())?;
        let mut section = String::new();
        for (i, line) in text.lines().enumerate() {
            if line.starts_with('#') {
                section = line.trim_start_matches('#').trim().to_string();
                continue;
            }
            let Some(m) = TASK_RE.captures(line) else {
                continue;
            };
            let is_done = m[1].eq_ignore_ascii_case("x");
            if is_done && !done {
                continue;
            }
            n += 1;
            let where_ = format!("{}:{}", rel(&page.path, &vault.root), i + 1);
            let label = page.id().map(|id| format!("[{id}] ")).unwrap_or_default();
            let sect = if section.is_empty() {
                String::new()
            } else {
                format!("{section}: ")
            };
            println!("{where_:<60} {label}{sect}{}", &m[2]);
        }
    }
    if n == 0 {
        println!("{}", if done { "no tasks" } else { "no open tasks" });
    }
    Ok(0)
}

// --- ref -----------------------------------------------------------------------------

fn cmd_ref(vault: &Vault, key: &str, note: bool) -> Res<i32> {
    let Some(fields) = refs::entry(vault, key) else {
        return Err(format!(
            "{key}: not in {}",
            rel(&refs::bib_path(vault), &vault.root)
        ));
    };
    for k in [
        "key", "type", "title", "author", "year", "journal", "doi", "url",
    ] {
        if let Some(v) = fields.get(k).filter(|v| !v.is_empty()) {
            println!("{k:<8} {v}");
        }
    }
    let path = refs::note_path(vault, key);
    if note {
        let created = refs::create_note(vault, key, &fields)?;
        println!("note     {} (created)", rel(&created, &vault.root));
    } else {
        let hint = if path.exists() {
            ""
        } else {
            " (none; --note creates it)"
        };
        println!("note     {}{hint}", rel(&path, &vault.root));
    }
    for page in vault.pages()? {
        if refs::citations(&page.body).contains(key) {
            println!("cited    {}", rel(&page.path, &vault.root));
        }
    }
    Ok(0)
}

// --- validate ------------------------------------------------------------------------

fn cmd_validate(vault: &Vault) -> Res<i32> {
    let (problems, counted) = validate::validate(vault)?;
    for p in &problems {
        println!("{p}");
    }
    if !problems.is_empty() {
        eprintln!("{} problem(s) in {counted} page(s)", problems.len());
        return Ok(1);
    }
    println!("ok: {counted} page(s) valid");
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn python_json() {
        assert_eq!(
            py_json(&serde_json::json!({"a": [1, 2.5, true, null], "b": "é"})),
            "{\"a\": [1, 2.5, true, null], \"b\": \"\\u00e9\"}"
        );
    }
}
