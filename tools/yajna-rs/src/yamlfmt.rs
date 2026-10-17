//! How a string may appear after `key: ` in frontmatter, following PyYAML's (YAML 1.1)
//! resolution rules so pages written by this CLI and the Python one are byte-identical and
//! read back the same under either.

use regex::Regex;
use std::sync::LazyLock;

static INT_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?(?:0|[1-9][0-9_]*)|[-+]?0x[0-9a-fA-F_]+|[-+]?[1-9][0-9_]*(?::[0-5]?[0-9])+)$").unwrap()
});
static FLOAT_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^(?:[-+]?(?:[0-9][0-9_]*)\.[0-9_]*(?:[eE][-+][0-9]+)?|\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*|[-+]?\.(?:inf|Inf|INF)|\.(?:nan|NaN|NAN))$").unwrap()
});
static TIMESTAMP_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}(?:[Tt]|[ \t]+)[0-9]{1,2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]*)?(?:[ \t]*(?:Z|[-+][0-9]{1,2}(?::[0-9]{2})?))?)$").unwrap()
});

const BOOLS: &[&str] = &[
    "yes", "Yes", "YES", "no", "No", "NO", "true", "True", "TRUE", "false", "False", "FALSE", "on",
    "On", "ON", "off", "Off", "OFF",
];
const NULLS: &[&str] = &["", "~", "null", "Null", "NULL"];

/// True when YAML 1.1 would read the plain scalar as something other than a string.
pub fn resolves_non_string(s: &str) -> bool {
    NULLS.contains(&s)
        || BOOLS.contains(&s)
        || INT_RE.is_match(s)
        || FLOAT_RE.is_match(s)
        || TIMESTAMP_RE.is_match(s)
        || s == "<<"
        || s == "="
}

/// True when the string can be written plain (unquoted) as a block mapping value.
pub fn plain_ok(s: &str) -> bool {
    if s.is_empty() || s != s.trim() {
        return false;
    }
    let first = s.chars().next().unwrap();
    if "-?:,[]{}#&*!|>'\"%@`".contains(first) {
        return false;
    }
    if s.contains(": ") || s.contains(" #") || s.ends_with(':') {
        return false;
    }
    if s.chars().any(|c| c.is_control()) {
        return false;
    }
    if s == "---" || s == "..." {
        return false;
    }
    true
}

/// A title as `yajna new` writes it: plain when YAML reads it back unchanged, JSON
/// double-quoted otherwise (a colon in a title is the usual case).
pub fn title_scalar(s: &str) -> String {
    if plain_ok(s) && !resolves_non_string(s) {
        s.to_string()
    } else {
        json_string(s)
    }
}

/// A string as PyYAML's `safe_dump` writes it: plain, else single-quoted, else double-quoted.
pub fn dump_scalar(s: &str) -> String {
    if plain_ok(s) && !resolves_non_string(s) {
        return s.to_string();
    }
    if !s.chars().any(|c| c.is_control()) {
        return format!("'{}'", s.replace('\'', "''"));
    }
    json_string(s)
}

/// JSON string literal without ASCII escaping, like `json.dumps(s, ensure_ascii=False)`.
pub fn json_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out.push('"');
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn titles() {
        assert_eq!(title_scalar("ESCRT timing"), "ESCRT timing");
        assert_eq!(title_scalar("Ratio: a vs b"), "\"Ratio: a vs b\"");
        assert_eq!(title_scalar("yes"), "\"yes\"");
        assert_eq!(title_scalar("2026-10-16"), "\"2026-10-16\"");
        assert_eq!(title_scalar("3000"), "\"3000\"");
        assert_eq!(title_scalar("[x]"), "\"[x]\"");
    }

    #[test]
    fn dumps() {
        assert_eq!(
            dump_scalar("2026-10-16T15:07+01:00"),
            "2026-10-16T15:07+01:00"
        ); // no seconds: not a YAML 1.1 timestamp
        assert_eq!(
            dump_scalar("2026-10-16T15:07:00+01:00"),
            "'2026-10-16T15:07:00+01:00'"
        );
        assert_eq!(dump_scalar("2026-10-16"), "'2026-10-16'");
        assert_eq!(dump_scalar("yes"), "'yes'");
        assert_eq!(dump_scalar("3000"), "'3000'");
        assert_eq!(dump_scalar("done"), "done");
        assert_eq!(dump_scalar("it's"), "it's");
        assert_eq!(dump_scalar("a: b"), "'a: b'");
    }
}
