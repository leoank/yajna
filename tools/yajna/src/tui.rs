//! Interactive prompts with completion. Used when a command is run without its arguments.
//!
//! Prompts go through the `Prompter` trait so tests can script answers: when `YAJNA_ANSWERS`
//! is set in the environment, its newline-separated lines are consumed instead of asking.

use std::collections::BTreeSet;
use std::path::{Path, PathBuf};
use std::process::Command;

use clap::Parser;
use inquire::autocompletion::{Autocomplete, Replacement};
use inquire::validator::Validation;
use inquire::{CustomUserError, InquireError, Text};
use serde_json::Value;

use crate::cli::{Cli, Cmd};
use crate::commands;
use crate::vault::{canonical_type, entity_names, is_type, Res, Schemas, Vault};

pub type Check = std::rc::Rc<dyn Fn(&str) -> Result<(), String>>;

pub trait Prompter {
    /// One prompt. `Err` means the user cancelled (EOF, Ctrl-C) or no scripted answer is left.
    fn ask(
        &mut self,
        message: &str,
        completer: Option<Completer>,
        check: Option<Check>,
        default: &str,
    ) -> Result<String, String>;
}

/// What tab completes: a fixed word list, or entity IDs by ID or title.
#[derive(Clone)]
pub enum Completer {
    Words(Vec<String>),
    /// (id, title) pairs; `wrap` inserts `[[ID]]` and only triggers after `[[`.
    Ids {
        entries: Vec<(String, String)>,
        wrap: bool,
    },
}

impl Completer {
    pub fn ids(vault: &Vault, prefixes: &[&str], project: Option<&str>, wrap: bool) -> Res<Self> {
        let mut entries = Vec::new();
        for page in vault.pages()? {
            let Some(id) = page.id() else { continue };
            if !prefixes.is_empty() && !prefixes.iter().any(|p| id.starts_with(p)) {
                continue;
            }
            if let Some(prj) = project {
                if page.field("project").map(|p| p != prj).unwrap_or(false) {
                    continue;
                }
            }
            entries.push((
                id.to_string(),
                page.field("title").unwrap_or("").to_string(),
            ));
        }
        Ok(Completer::Ids { entries, wrap })
    }

    fn word(input: &str) -> &str {
        input.rsplit(char::is_whitespace).next().unwrap_or("")
    }

    /// (display, text to insert) for the word before the cursor.
    pub fn matches(&self, input: &str) -> Vec<(String, String)> {
        let word = Self::word(input);
        match self {
            Completer::Words(words) => words
                .iter()
                .filter(|w| w.to_lowercase().starts_with(&word.to_lowercase()))
                .map(|w| (w.clone(), w.clone()))
                .collect(),
            Completer::Ids { entries, wrap } => {
                if *wrap && !word.starts_with("[[") {
                    return Vec::new();
                }
                let needle = word.trim_start_matches('[').to_lowercase();
                entries
                    .iter()
                    .filter(|(id, title)| {
                        id.to_lowercase().contains(&needle)
                            || title.to_lowercase().contains(&needle)
                    })
                    .map(|(id, title)| {
                        let text = if *wrap {
                            format!("[[{id}]]")
                        } else {
                            id.clone()
                        };
                        (
                            if title.is_empty() {
                                id.clone()
                            } else {
                                format!("{id}  {title}")
                            },
                            text,
                        )
                    })
                    .collect()
            }
        }
    }
}

impl Autocomplete for Completer {
    fn get_suggestions(&mut self, input: &str) -> Result<Vec<String>, CustomUserError> {
        Ok(self
            .matches(input)
            .into_iter()
            .map(|(display, _)| display)
            .collect())
    }

    fn get_completion(
        &mut self,
        input: &str,
        highlighted: Option<String>,
    ) -> Result<Replacement, CustomUserError> {
        let matches = self.matches(input);
        let chosen = match highlighted {
            Some(h) => matches.into_iter().find(|(d, _)| *d == h),
            None if matches.len() == 1 => matches.into_iter().next(),
            None => None,
        };
        Ok(chosen.map(|(_, text)| {
            let word = Self::word(input);
            format!("{}{}", &input[..input.len() - word.len()], text)
        }))
    }
}

pub struct Interactive;

impl Prompter for Interactive {
    fn ask(
        &mut self,
        message: &str,
        completer: Option<Completer>,
        check: Option<Check>,
        default: &str,
    ) -> Result<String, String> {
        let label = format!("{message}:");
        let mut prompt = Text::new(&label);
        if let Some(c) = completer {
            prompt = prompt.with_autocomplete(c);
        }
        if let Some(check) = check {
            prompt = prompt.with_validator(move |s: &str| match check(s.trim()) {
                Ok(()) => Ok(Validation::Valid),
                Err(m) => Ok(Validation::Invalid(m.into())),
            });
        }
        if !default.is_empty() {
            prompt = prompt.with_default(default);
        }
        match prompt.prompt() {
            Ok(s) => Ok(s.trim().to_string()),
            Err(InquireError::OperationCanceled | InquireError::OperationInterrupted) => {
                Err("cancelled".to_string())
            }
            Err(e) => Err(e.to_string()),
        }
    }
}

pub struct Scripted {
    answers: std::vec::IntoIter<String>,
}

impl Scripted {
    pub fn from_env() -> Option<Self> {
        let raw = std::env::var("YAJNA_ANSWERS").ok()?;
        Some(Scripted {
            answers: raw
                .split('\n')
                .map(str::to_string)
                .collect::<Vec<_>>()
                .into_iter(),
        })
    }
}

impl Prompter for Scripted {
    fn ask(
        &mut self,
        message: &str,
        _completer: Option<Completer>,
        check: Option<Check>,
        default: &str,
    ) -> Result<String, String> {
        let answer = self
            .answers
            .next()
            .ok_or_else(|| format!("no scripted answer for {message:?}"))?;
        let answer = if answer.is_empty() {
            default.to_string()
        } else {
            answer
        };
        if let Some(check) = check {
            check(&answer).map_err(|m| format!("{message}: {m}"))?;
        }
        Ok(answer)
    }
}

pub fn prompter() -> Box<dyn Prompter> {
    match Scripted::from_env() {
        Some(s) => Box::new(s),
        None => Box::new(Interactive),
    }
}

// --- helpers ---------------------------------------------------------------------------

fn non_empty() -> Check {
    std::rc::Rc::new(|s| {
        if s.trim().is_empty() {
            Err("required".into())
        } else {
            Ok(())
        }
    })
}

fn exists(ids: BTreeSet<String>, required: bool) -> Check {
    std::rc::Rc::new(move |s| {
        let s = s.trim();
        if s.is_empty() {
            return if required {
                Err("required".into())
            } else {
                Ok(())
            };
        }
        if ids.contains(s) {
            Ok(())
        } else {
            Err(format!("{s} does not exist"))
        }
    })
}

fn enum_values(schema: &str, field: &str) -> Vec<String> {
    let Some(file) = Schemas::get(&format!("{schema}.json")) else {
        return Vec::new();
    };
    let Ok(data) = serde_json::from_slice::<Value>(&file.data) else {
        return Vec::new();
    };
    data["properties"][field]["enum"]
        .as_array()
        .map(|a| {
            a.iter()
                .filter_map(|v| v.as_str().map(str::to_string))
                .collect()
        })
        .unwrap_or_default()
}

// --- flows -----------------------------------------------------------------------------

pub fn new(vault: &Vault, p: &mut dyn Prompter) -> Res<PathBuf> {
    let mut types: Vec<String> = entity_names()
        .iter()
        .filter(|t| {
            !vault.is_project()
                || crate::vault::PROJECT_SCOPED.contains(t)
                || **t == "agent_session"
        })
        .map(|s| s.to_string())
        .collect();
    types.push("agent".to_string());
    let etype = p.ask(
        "type",
        Some(Completer::Words(types)),
        Some(std::rc::Rc::new(|t| {
            if is_type(t) {
                Ok(())
            } else {
                Err("unknown type".into())
            }
        })),
        "",
    )?;
    let etype = canonical_type(&etype);

    let title = if etype != "run" {
        Some(p.ask("title", None, Some(non_empty()), "")?)
    } else {
        None
    };

    let ids: BTreeSet<String> = vault.index()?.keys().cloned().collect();
    let mut project = None;
    let mut experiment = None;
    if etype == "run" {
        let e = p.ask(
            "experiment (optional)",
            Some(Completer::ids(vault, &["EXP"], None, false)?),
            Some(exists(ids.clone(), false)),
            "",
        )?;
        experiment = Some(e).filter(|s| !s.is_empty());
    }
    if crate::vault::PROJECT_SCOPED.contains(&etype.as_str())
        && experiment.is_none()
        && !vault.is_project()
    {
        project = Some(p.ask(
            "project",
            Some(Completer::ids(vault, &["PRJ"], None, false)?),
            Some(exists(ids.clone(), true)),
            "",
        )?);
    } else if etype == "build" {
        let pr = p.ask(
            "project (optional)",
            Some(Completer::ids(vault, &["PRJ"], None, false)?),
            Some(exists(ids, false)),
            "",
        )?;
        project = Some(pr).filter(|s| !s.is_empty());
    }

    let mut kind = None;
    if etype == "run" || etype == "material" {
        let kinds = enum_values(&etype, "kind");
        let allowed = kinds.clone();
        let default = if etype == "run" {
            kinds.first().cloned().unwrap_or_default()
        } else {
            "reagent".to_string()
        };
        let msg = format!("one of {}", kinds.join(", "));
        kind = Some(p.ask(
            "kind",
            Some(Completer::Words(kinds)),
            Some(std::rc::Rc::new(move |k| {
                if allowed.iter().any(|a| a == k) {
                    Ok(())
                } else {
                    Err(msg.clone())
                }
            })),
            &default,
        )?);
    }

    let mut code = false;
    if etype == "project" {
        code = p
            .ask(
                "scaffold projects/<slug>/ with a flake? (y/N)",
                None,
                None,
                "",
            )?
            .to_lowercase()
            .starts_with('y');
    }

    let path = commands::create(
        vault,
        &etype,
        title.as_deref(),
        project.as_deref(),
        experiment.as_deref(),
        kind.as_deref(),
        code,
    )?;
    offer_editor(&path, p)?;
    Ok(path)
}

/// Prompt for one log line; `[[` completes entity IDs.
pub fn log_entry(vault: &Vault, p: &mut dyn Prompter) -> Res<String> {
    p.ask(
        "log",
        Some(Completer::ids(vault, &[], None, true)?),
        Some(non_empty()),
        "",
    )
}

/// Loop: pick a command, run it with prompts, until quit.
pub fn menu(vault: &Vault, p: &mut dyn Prompter) -> Res<i32> {
    let choices: Vec<String> = ["new", "log", "ref", "tasks", "validate", "quit"]
        .iter()
        .map(|s| s.to_string())
        .collect();
    println!("yajna: new, log, ref, tasks, validate, quit (tab completes)");
    loop {
        let allowed = choices.clone();
        let Ok(choice) = p.ask(
            "yajna",
            Some(Completer::Words(choices.clone())),
            Some(std::rc::Rc::new(move |c| {
                if allowed
                    .iter()
                    .any(|a| a == c.split(' ').next().unwrap_or(""))
                {
                    Ok(())
                } else {
                    Err("unknown command".into())
                }
            })),
            "",
        ) else {
            return Ok(0);
        };
        if choice == "quit" {
            return Ok(0);
        }
        let Some(words) = shlex::split(&choice) else {
            println!("unbalanced quotes");
            continue;
        };
        let cli = match Cli::try_parse_from(std::iter::once("yajna".to_string()).chain(words)) {
            Ok(cli) => cli,
            Err(e) => {
                println!("{e}");
                continue;
            }
        };
        let Some(mut cmd) = cli.cmd else { continue };
        if let Cmd::Log { text, .. } = &mut cmd {
            if text.is_empty() {
                match log_entry(vault, p) {
                    Ok(line) => text.push(line),
                    Err(_) => {
                        println!();
                        continue;
                    }
                }
            }
        }
        if let Err(e) = commands::run(vault, &cmd, p) {
            println!("{e}");
        }
    }
}

fn offer_editor(path: &Path, p: &mut dyn Prompter) -> Res<()> {
    let Ok(editor) = std::env::var("EDITOR") else {
        return Ok(());
    };
    if editor.is_empty() {
        return Ok(());
    }
    let answer = p.ask(&format!("open in {editor}? [y/N]"), None, None, "")?;
    if answer.to_lowercase().starts_with('y') {
        let parts = shlex::split(&editor).unwrap_or_else(|| vec![editor.clone()]);
        let (prog, args) = parts.split_first().ok_or("empty EDITOR")?;
        let _ = Command::new(prog).args(args).arg(path).status();
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn id_completer() {
        let c = Completer::Ids {
            entries: vec![("PRJ-0001".into(), "Archaeal division".into())],
            wrap: true,
        };
        assert_eq!(
            c.matches("see [[arch")
                .into_iter()
                .map(|(_, t)| t)
                .collect::<Vec<_>>(),
            vec!["[[PRJ-0001]]"]
        );
        assert!(c.matches("see arch").is_empty());
        let mut c = Completer::Ids {
            entries: vec![("PRJ-0001".into(), "Archaeal division".into())],
            wrap: true,
        };
        assert_eq!(
            c.get_completion("see [[arch", None).unwrap(),
            Some("see [[PRJ-0001]]".to_string())
        );
        let c = Completer::Ids {
            entries: vec![("EXP-0001".into(), "x".into())],
            wrap: false,
        };
        assert!(c.matches("PRJ").is_empty());
        let c = Completer::Words(vec!["experiment".into(), "equipment".into()]);
        assert_eq!(c.matches("Ex").len(), 1);
    }
}
