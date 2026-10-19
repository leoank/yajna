//! Citation keys: read `references/library.bib`, find citations in pages, create reading notes.

use std::collections::BTreeMap;
use std::collections::BTreeSet;
use std::fs;
use std::path::PathBuf;
use std::sync::LazyLock;

use regex::Regex;

use crate::vault::{Res, Vault};

static ENTRY_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?m)^@(\w+)\s*\{\s*([^,\s]+)\s*,").unwrap());
// `[@key]`, `[@key, p. 3]`, `[-@key]`, bare `@key`; not `PRO-0012@3`, not emails. The regex
// crate has no lookbehind, so the character before `@` is matched and discarded.
static CITE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?:^|[^\w/.])-?@([A-Za-z][A-Za-z0-9:_-]*[A-Za-z0-9])").unwrap());
static FIELD_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(\w+)\s*=\s*").unwrap());
static WS_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\s+").unwrap());

pub fn bib_path(vault: &Vault) -> PathBuf {
    match vault.cfg.bibliography.as_deref() {
        Some(p) => vault.root.join(p),
        None if vault.is_project() => vault.notes.join("references").join("library.bib"),
        None => vault.root.join("references").join("library.bib"),
    }
}

/// The raw text of one entry, `@type{key,` through its closing brace.
pub fn raw_entry<'a>(bib: &'a str, key: &str) -> Option<&'a str> {
    ENTRY_RE.captures_iter(bib).find(|m| &m[2] == key).map(|m| {
        let start = m.get(0).unwrap().start();
        let open = start + m[0].find('{').unwrap();
        &bib[start..balanced_end(bib, open)]
    })
}

pub fn bib_keys(vault: &Vault) -> BTreeSet<String> {
    let path = bib_path(vault);
    let Ok(text) = fs::read_to_string(&path) else {
        return BTreeSet::new();
    };
    ENTRY_RE
        .captures_iter(&text)
        .map(|c| c[2].to_string())
        .collect()
}

pub fn citations(text: &str) -> BTreeSet<String> {
    CITE_RE
        .captures_iter(text)
        .map(|c| c[1].to_string())
        .collect()
}

/// Skip past a brace-balanced block starting at `open` (the index of `{`); returns the index
/// just after the matching `}` (or the end of the text).
fn balanced_end(text: &str, open: usize) -> usize {
    let bytes = text.as_bytes();
    let mut depth = 0i32;
    let mut i = open;
    while i < bytes.len() {
        match bytes[i] {
            b'{' => depth += 1,
            b'}' => depth -= 1,
            _ => {}
        }
        i += 1;
        if depth == 0 {
            break;
        }
    }
    i
}

/// Fields of one entry, braces balanced, or None. Good enough for title/author/year/doi.
pub fn entry(vault: &Vault, key: &str) -> Option<BTreeMap<String, String>> {
    let text = fs::read_to_string(bib_path(vault)).unwrap_or_default();
    for m in ENTRY_RE.captures_iter(&text) {
        if &m[2] != key {
            continue;
        }
        let open = m.get(0).unwrap().start() + m[0].find('{').unwrap();
        let end = balanced_end(&text, open);
        let body =
            &text[m.get(0).unwrap().end()..end.saturating_sub(1).max(m.get(0).unwrap().end())];
        let mut fields = BTreeMap::new();
        fields.insert("type".to_string(), m[1].to_lowercase());
        fields.insert("key".to_string(), key.to_string());
        for fm in FIELD_RE.captures_iter(body) {
            let start = fm.get(0).unwrap().end();
            if start >= body.len() {
                break;
            }
            let value = match body.as_bytes()[start] {
                b'{' => {
                    let j = balanced_end(body, start);
                    &body[start + 1..j.saturating_sub(1).max(start + 1)]
                }
                b'"' => {
                    let j = body[start + 1..]
                        .find('"')
                        .map(|i| i + start + 1)
                        .unwrap_or(body.len());
                    &body[start + 1..j]
                }
                _ => {
                    let j = body[start..]
                        .find([',', '\n'])
                        .map(|i| i + start)
                        .unwrap_or(body.len());
                    &body[start..j]
                }
            };
            let cleaned = WS_RE
                .replace_all(&value.replace(['{', '}'], ""), " ")
                .trim()
                .to_string();
            fields.insert(fm[1].to_lowercase(), cleaned);
        }
        return Some(fields);
    }
    None
}

pub fn note_path(vault: &Vault, key: &str) -> PathBuf {
    vault.notes.join("references").join(format!("{key}.md"))
}

pub fn create_note(vault: &Vault, key: &str, fields: &BTreeMap<String, String>) -> Res<PathBuf> {
    let path = note_path(vault, key);
    if path.exists() {
        return Err(format!(
            "{} already exists",
            crate::vault::rel(&path, &vault.root)
        ));
    }
    static YEAR_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\d{4}").unwrap());
    let year_src = fields
        .get("year")
        .filter(|s| !s.is_empty())
        .or_else(|| fields.get("date"))
        .cloned()
        .unwrap_or_default();
    let year = YEAR_RE
        .find(&year_src)
        .map(|m| m.as_str().to_string())
        .unwrap_or_else(|| "null".to_string());
    let doi = fields
        .get("doi")
        .filter(|s| !s.is_empty())
        .cloned()
        .unwrap_or_else(|| "null".to_string());
    let title = fields
        .get("title")
        .cloned()
        .unwrap_or_else(|| key.to_string());
    let authors = fields.get("author").cloned().unwrap_or_default();
    let created = vault.today();
    let text = vault.render(
        "reference",
        &[
            ("citekey", key),
            ("title", &title),
            ("authors", &authors),
            ("year", &year),
            ("doi", &doi),
            ("created", &created),
            ("author", &vault.default_author()),
        ],
    )?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, text).map_err(|e| format!("{}: {e}", path.display()))?;
    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cite_regex() {
        let found = citations(
            "Builds on [@shih2015cloning] and @nobody2020, not PRO-0012@3 nor a@b.com; [-@x1]",
        );
        assert_eq!(
            found.into_iter().collect::<Vec<_>>(),
            vec!["nobody2020", "shih2015cloning", "x1"]
        );
    }
}
