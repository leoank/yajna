//! The way back for `mirror` pages (architecture 5.8): edits made in a Google Doc become an
//! edit of the page's source, which `yajna sync pull` then three-way merges with the page.
//!
//! Drive's Markdown export is lossy (code spans and blocks come back as plain text, lists
//! as `> *` lines, headings bold) but deterministic, so the export of the revision yajna
//! published and the export of the doc now differ only where people edited. Those
//! differences are carried onto the source the page was published from: each exported line
//! is aligned with a block of the source (a paragraph, list item, heading, table row), an
//! edited line is applied to its block word by word, so words nobody touched keep their
//! markup (code, citations, `[[links]]`), and new lines are converted back as well as they
//! can be. Nothing here talks to Drive or git.

use std::collections::BTreeMap;
use std::sync::LazyLock;

use regex::Regex;

/// What a published doc's links point at, to turn them back into `[[ID]]`.
pub struct Links {
    /// doc ID -> page ID, for every synced page
    pub docs: BTreeMap<String, String>,
    /// `[sync] site_url`
    pub site: Option<String>,
}

/// The page body as the doc now has it, with what could not be carried over exactly.
pub struct Theirs {
    pub body: String,
    /// exported lines edited, added or removed in the doc
    pub changes: usize,
    /// edits that reached text the export does not keep (citations, code), taken as the doc
    /// has it
    pub approximate: usize,
    /// the doc's title when it was edited there; titles live in the frontmatter
    pub title: Option<String>,
}

static REFS_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^#{1,6} (\*\*)?References(\*\*)?\s*$").unwrap());
static HEADING_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^#{1,6}\s").unwrap());
static ITEM_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^\s*(?:[-*+]|\d+[.)])(?:\s|$)").unwrap());
static PREFIX_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"^(?:\s*(?:[-*+]|\d+[.)])(?:\s+\[[ xX]\])?(?:\s+|$)|#{1,6}\s+|>\s?)").unwrap()
});
static BOLD_HEADING_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(#{1,6}) \*\*(.*)\*\*$").unwrap());
static LINK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\[([^\]]*)\]\(([^)\s]+)\)").unwrap());
static DOC_URL_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^https://docs\.google\.com/document/d/([\w-]+)").unwrap());
static QUOTED_TASK_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^(?:>\s*)+\[([ xX])\]\s*(.*)$").unwrap());
// Google escapes punctuation that markdown would not misread in the source
static ESCAPE_RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\\([().:!#+=|~>-])").unwrap());

/// The body lines of an export: everything after the title (the header line and the `#`
/// title yajna writes), without the reference list pandoc adds to a page that cites, blank
/// lines dropped. Returns the title too.
fn export_lines(md: &str, cites: bool) -> (String, Vec<String>) {
    let lines: Vec<&str> = md.lines().collect();
    let start = lines
        .iter()
        .position(|l| l.starts_with("# "))
        .map(|i| i + 1)
        .unwrap_or(0);
    let title = if start > 0 {
        let t = lines[start - 1].trim_start_matches("# ").trim();
        t.strip_prefix("**")
            .and_then(|t| t.strip_suffix("**"))
            .unwrap_or(t)
            .to_string()
    } else {
        String::new()
    };
    let mut end = lines.len();
    if cites {
        if let Some(i) = lines.iter().rposition(|l| REFS_RE.is_match(l)) {
            end = end.min(i.max(start));
        }
    }
    let body = lines[start..end]
        .iter()
        .map(|l| l.trim_end().to_string())
        .filter(|l| !l.is_empty())
        .collect();
    (title, body)
}

/// An exported line in source form, as far as that can be had: headings lose Google's bold,
/// lists their `>` and `*`, checkboxes and links to synced pages and the site come back,
/// and escapes markdown does not need go.
fn convert(line: &str, links: &Links) -> String {
    let mut l = line.trim_end().to_string();
    if let Some(m) = BOLD_HEADING_RE.captures(&l) {
        l = format!("{} {}", &m[1], &m[2]);
    }
    if let Some(rest) = l.strip_prefix("> ") {
        if ITEM_RE.is_match(rest) {
            l = rest.to_string();
        }
    }
    let indent = l.len() - l.trim_start().len();
    if l[indent..].starts_with("* ") {
        l = format!("{}- {}", &l[..indent], &l[indent + 2..]);
    }
    l = l
        .replace("☐ ", "[ ] ")
        .replace("☑ ", "[x] ")
        .replace("\\[ \\]", "[ ]")
        .replace("\\[x\\]", "[x]");
    // a task Google wrote as a quoted line rather than a list item
    if let Some(m) = QUOTED_TASK_RE.captures(&l) {
        l = format!("- [{}] {}", &m[1], &m[2]);
    }
    if l.ends_with('☐') || l.ends_with('☑') {
        let done = l.ends_with('☑');
        l.pop();
        l.push_str(if done { "[x]" } else { "[ ]" });
    }
    l = LINK_RE
        .replace_all(&l, |c: &regex::Captures| {
            let label = &c[1];
            let url = unwrap_redirect(&c[2]);
            let url = url.as_str();
            let id = DOC_URL_RE
                .captures(url)
                .and_then(|m| links.docs.get(&m[1]).cloned())
                .or_else(|| {
                    let site = links.site.as_deref()?.trim_end_matches('/');
                    let rest = url.strip_prefix(site)?.strip_prefix('/')?;
                    rest.strip_suffix(".html").map(str::to_string)
                });
            match id {
                Some(id) if id == label => format!("[[{id}]]"),
                Some(id) => format!("[[{id}|{label}]]"),
                None => format!("[{label}]({url})"),
            }
        })
        .into_owned();
    ESCAPE_RE.replace_all(&l, "$1").into_owned()
}

/// A link as Google sometimes writes it, through `https://www.google.com/url?q=<url>&...`,
/// back to the URL itself.
fn unwrap_redirect(url: &str) -> String {
    let Some(q) = url
        .strip_prefix("https://www.google.com/url?q=")
        .map(|r| r.split('&').next().unwrap_or(r))
    else {
        return url.to_string();
    };
    let b = q.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;
    while i < b.len() {
        match (
            b[i],
            q.get(i + 1..i + 3)
                .and_then(|h| u8::from_str_radix(h, 16).ok()),
        ) {
            (b'%', Some(x)) => {
                out.push(x);
                i += 3;
            }
            (c, _) => {
                out.push(c);
                i += 1;
            }
        }
    }
    String::from_utf8_lossy(&out).into_owned()
}

/// A line's block marker (list marker with its checkbox, heading hashes, quote) and the
/// rest.
fn split_prefix(line: &str) -> (&str, &str) {
    let n = PREFIX_RE.find(line).map(|m| m.end()).unwrap_or(0);
    (&line[..n], &line[n..])
}

#[derive(Clone, Copy, PartialEq, Debug)]
enum Kind {
    Para,
    Item,
    Heading,
    Row,
    Code,
    Quote,
}

fn kind_of(line: &str) -> Kind {
    if HEADING_RE.is_match(line) {
        Kind::Heading
    } else if line.trim_start().starts_with('|') {
        Kind::Row
    } else if ITEM_RE.is_match(line) {
        Kind::Item
    } else if line.starts_with('>') {
        Kind::Quote
    } else {
        Kind::Para
    }
}

/// A block of the source: lines `start..end`, what kind it is, its marker, and its words
/// with the line each is on.
struct Unit {
    start: usize,
    end: usize,
    kind: Kind,
    prefix: String,
    content: String,
    words: Vec<(String, usize)>,
}

fn is_fence(line: &str) -> Option<&'static str> {
    let t = line.trim_start();
    if t.starts_with("```") {
        Some("```")
    } else if t.starts_with("~~~") {
        Some("~~~")
    } else {
        None
    }
}

fn hard_break(line: &str) -> bool {
    line.ends_with("  ") || line.ends_with('\\')
}

fn units(lines: &[&str]) -> Vec<Unit> {
    let mut out = Vec::new();
    let mut fence: Option<&str> = None;
    let mut i = 0;
    let blank = |l: &str| l.trim().is_empty();
    while i < lines.len() {
        let l = lines[i];
        if let Some(f) = fence {
            if l.trim_start().starts_with(f) {
                fence = None;
            } else if !blank(l) {
                out.push(Unit {
                    start: i,
                    end: i + 1,
                    kind: Kind::Code,
                    prefix: String::new(),
                    content: l.trim().to_string(),
                    words: l.split_whitespace().map(|w| (w.to_string(), i)).collect(),
                });
            }
            i += 1;
            continue;
        }
        if let Some(f) = is_fence(l) {
            fence = Some(f);
            i += 1;
            continue;
        }
        if blank(l) {
            i += 1;
            continue;
        }
        let kind = kind_of(l);
        let mut j = i + 1;
        match kind {
            Kind::Heading | Kind::Row => {}
            Kind::Item => {
                while j < lines.len()
                    && !blank(lines[j])
                    && lines[j].starts_with([' ', '\t'])
                    && !ITEM_RE.is_match(lines[j])
                {
                    j += 1;
                }
            }
            Kind::Quote => {
                while j < lines.len() && lines[j].starts_with('>') {
                    j += 1;
                }
            }
            Kind::Para | Kind::Code => {
                while j < lines.len()
                    && !hard_break(lines[j - 1])
                    && !blank(lines[j])
                    && kind_of(lines[j]) == Kind::Para
                    && is_fence(lines[j]).is_none()
                {
                    j += 1;
                }
            }
        }
        let (prefix, first) = split_prefix(l);
        let mut words: Vec<(String, usize)> = Vec::new();
        for (n, line) in std::iter::once(first)
            .chain(lines[i + 1..j].iter().copied())
            .enumerate()
        {
            let line = if kind == Kind::Quote && n > 0 {
                line.trim_start_matches('>')
            } else {
                line
            };
            words.extend(line.split_whitespace().map(|w| (w.to_string(), i + n)));
        }
        out.push(Unit {
            start: i,
            end: j,
            kind,
            prefix: prefix.to_string(),
            content: words
                .iter()
                .map(|w| w.0.as_str())
                .collect::<Vec<_>>()
                .join(" "),
            words,
        });
        i = j;
    }
    out
}

/// A word's identity for matching across the source and the export: letters and digits,
/// lower case, so markup and Google's escapes do not count.
fn key(word: &str) -> String {
    word.chars()
        .filter(|c| c.is_alphanumeric())
        .flat_map(char::to_lowercase)
        .collect()
}

fn bag(text: &str) -> BTreeMap<String, usize> {
    let mut b = BTreeMap::new();
    for w in text.split_whitespace() {
        let k = key(w);
        if !k.is_empty() {
            *b.entry(k).or_insert(0) += 1;
        }
    }
    b
}

fn similarity(a: &BTreeMap<String, usize>, b: &BTreeMap<String, usize>) -> f64 {
    let (na, nb): (usize, usize) = (a.values().sum(), b.values().sum());
    if na + nb == 0 {
        return 0.6;
    }
    let common: usize = a
        .iter()
        .map(|(k, n)| (*n).min(*b.get(k).unwrap_or(&0)))
        .sum();
    2.0 * common as f64 / (na + nb) as f64
}

enum Op {
    Equal(usize, usize),
    Del(usize),
    Ins(usize),
}

/// A longest-common-subsequence diff of two sequences under `same`.
fn diff<A, B>(a: &[A], b: &[B], same: impl Fn(&A, &B) -> bool) -> Vec<Op> {
    let (n, m) = (a.len(), b.len());
    let mut t = vec![0u32; (n + 1) * (m + 1)];
    let at = |i: usize, j: usize| i * (m + 1) + j;
    for i in (0..n).rev() {
        for j in (0..m).rev() {
            t[at(i, j)] = if same(&a[i], &b[j]) {
                t[at(i + 1, j + 1)] + 1
            } else {
                t[at(i + 1, j)].max(t[at(i, j + 1)])
            };
        }
    }
    let (mut i, mut j, mut ops) = (0, 0, Vec::new());
    while i < n || j < m {
        if i < n && j < m && same(&a[i], &b[j]) {
            ops.push(Op::Equal(i, j));
            i += 1;
            j += 1;
        } else if j < m && (i == n || t[at(i, j + 1)] >= t[at(i + 1, j)]) {
            ops.push(Op::Ins(j));
            j += 1;
        } else {
            ops.push(Op::Del(i));
            i += 1;
        }
    }
    ops
}

/// The in-order pairing of `a` and `b` that pairs the most similar text, a pair counting
/// only when at least half the words agree.
fn matching(a: &[BTreeMap<String, usize>], b: &[BTreeMap<String, usize>]) -> Vec<(usize, usize)> {
    let (n, m) = (a.len(), b.len());
    let mut t = vec![0f64; (n + 1) * (m + 1)];
    let at = |i: usize, j: usize| i * (m + 1) + j;
    let score = |i: usize, j: usize| {
        let s = similarity(&a[i], &b[j]);
        if s >= 0.5 {
            s
        } else {
            -1.0
        }
    };
    for i in (0..n).rev() {
        for j in (0..m).rev() {
            let s = score(i, j);
            let pair = if s > 0.0 {
                t[at(i + 1, j + 1)] + s
            } else {
                f64::MIN
            };
            t[at(i, j)] = pair.max(t[at(i + 1, j)]).max(t[at(i, j + 1)]);
        }
    }
    let mut out = Vec::new();
    let (mut i, mut j) = (0, 0);
    while i < n && j < m {
        let s = score(i, j);
        if s > 0.0 && t[at(i, j)] == t[at(i + 1, j + 1)] + s {
            out.push((i, j));
            i += 1;
            j += 1;
        } else if t[at(i, j)] == t[at(i + 1, j)] {
            i += 1;
        } else {
            j += 1;
        }
    }
    out
}

fn line_bag(line: &str, links: &Links) -> BTreeMap<String, usize> {
    bag(split_prefix(&convert(line, links)).1)
}

/// Which source unit each exported line came from.
fn align(units: &[Unit], lines: &[String], links: &Links) -> Vec<Option<usize>> {
    let ub: Vec<_> = units.iter().map(|u| bag(&u.content)).collect();
    let lb: Vec<_> = lines.iter().map(|l| line_bag(l, links)).collect();
    let mut map = vec![None; lines.len()];
    for (u, l) in matching(&ub, &lb) {
        map[l] = Some(u);
    }
    map
}

/// Which removed line became which added line, within one changed stretch of the export.
fn pair_up(removed: &[String], added: &[String], links: &Links) -> Vec<(usize, usize)> {
    let a: Vec<_> = removed.iter().map(|l| line_bag(l, links)).collect();
    let b: Vec<_> = added.iter().map(|l| line_bag(l, links)).collect();
    matching(&a, &b)
}

/// Apply the change from exported line `e0` to `e1` onto unit `u`'s text word by word.
/// Returns the unit's marker, its words with the source line each belongs on, and whether
/// the edit reached words the export does not keep as they are in the source.
fn patch(u: &Unit, e0: &str, e1: &str) -> (String, Vec<(String, usize)>, bool) {
    let (p0, c0) = split_prefix(e0);
    let (p1, c1) = split_prefix(e1);
    // the marker: the source's, with a checkbox ticked or unticked in the doc
    let prefix = if p0 == p1 {
        u.prefix.clone()
    } else {
        let tick = |p: &str| {
            if p.contains("[x]") || p.contains("[X]") {
                Some(true)
            } else if p.contains("[ ]") {
                Some(false)
            } else {
                None
            }
        };
        match (tick(p0), tick(p1)) {
            (Some(_), Some(t)) if p0.replace("[x]", "[ ]") == p1.replace("[x]", "[ ]") => {
                u.prefix.replacen(
                    if t { "[ ]" } else { "[x]" },
                    if t { "[x]" } else { "[ ]" },
                    1,
                )
            }
            // a list or heading marker the doc changed; anything else is the export's
            // way of writing it, and the source's marker stays
            _ if ITEM_RE.is_match(p1) || HEADING_RE.is_match(p1) => {
                let indent = &u.prefix[..u.prefix.len() - u.prefix.trim_start().len()];
                format!("{indent}{}", p1.trim_start())
            }
            _ => u.prefix.clone(),
        }
    };
    let s: Vec<&str> = u.words.iter().map(|w| w.0.as_str()).collect();
    let a: Vec<&str> = c0.split_whitespace().collect();
    let b: Vec<&str> = c1.split_whitespace().collect();
    if a == b {
        return (prefix, u.words.clone(), false);
    }
    // source word for each word of the published export
    let mut sa: Vec<Option<usize>> = vec![None; a.len()];
    let mut matched = vec![false; s.len()];
    for op in diff(&s, &a, |x, y| {
        let (kx, ky) = (key(x), key(y));
        if kx.is_empty() || ky.is_empty() {
            x == y
        } else {
            kx == ky
        }
    }) {
        if let Op::Equal(i, j) = op {
            sa[j] = Some(i);
            matched[i] = true;
        }
    }
    // the edits, as ranges of the export (a) and the doc now (b)
    let mut hunks: Vec<(usize, usize, usize, usize)> = Vec::new();
    let (mut ai, mut bi) = (0, 0);
    let ops = diff(&a, &b, |x, y| x == y);
    let mut k = 0;
    while k < ops.len() {
        match ops[k] {
            Op::Equal(i, j) => {
                ai = i + 1;
                bi = j + 1;
                k += 1;
            }
            _ => {
                let (a0, b0) = (ai, bi);
                while k < ops.len() && !matches!(ops[k], Op::Equal(..)) {
                    match ops[k] {
                        Op::Del(i) => ai = i + 1,
                        Op::Ins(j) => bi = j + 1,
                        Op::Equal(..) => unreachable!(),
                    }
                    k += 1;
                }
                hunks.push((a0, ai, b0, bi));
            }
        }
    }
    // each edit widened to words the source has, so it lands between them
    let mut spans: Vec<(usize, usize, usize, usize)> = Vec::new(); // source range, b range
    let mut approximate = false;
    for (a0, a1, b0, b1) in hunks {
        let (mut x0, mut y0) = (a0, b0);
        while x0 > 0 && sa[x0 - 1].is_none() {
            x0 -= 1;
            y0 -= 1;
        }
        let (mut x1, mut y1) = (a1, b1);
        while x1 < a.len() && sa[x1].is_none() {
            x1 += 1;
            y1 += 1;
        }
        let s0 = if x0 == 0 { 0 } else { sa[x0 - 1].unwrap() + 1 };
        let s1 = if x1 == a.len() {
            s.len()
        } else {
            sa[x1].unwrap()
        };
        if (s0..s1).any(|i| !matched[i]) {
            approximate = true;
        }
        match spans.last_mut() {
            Some(last) if s0 < last.1 || y0 < last.3 => {
                last.1 = last.1.max(s1);
                last.3 = last.3.max(y1);
            }
            _ => spans.push((s0, s1, y0, y1)),
        }
    }
    // new words go on the line of the first word they replace, else of the word before
    let mut words: Vec<(String, usize)> = Vec::new();
    let mut at = 0;
    for (s0, s1, y0, y1) in spans {
        words.extend(u.words[at..s0.max(at)].iter().cloned());
        let line = if s0 < s1 {
            u.words[s0].1
        } else {
            words
                .last()
                .or(u.words.get(s0))
                .map(|w| w.1)
                .unwrap_or(u.start)
        };
        words.extend(b[y0..y1].iter().map(|w| (w.to_string(), line)));
        at = at.max(s1);
    }
    words.extend(u.words[at.min(s.len())..].iter().cloned());
    (prefix, words, approximate)
}

/// A unit's new words laid out like the old: each word stays on its source line, so only
/// the lines an edit touched change, and a line that grew past the block's widest line is
/// split, continuation lines indented under a list item's text or quoted.
fn layout(u: &Unit, src: &[&str], prefix: &str, words: &[(String, usize)]) -> Vec<String> {
    let old = &src[u.start..u.end];
    let width = old
        .iter()
        .map(|l| l.chars().count())
        .max()
        .unwrap_or(90)
        .max(40);
    let cont = match u.kind {
        Kind::Quote => "> ".to_string(),
        Kind::Item => " ".repeat(prefix.chars().count()),
        _ => String::new(),
    };
    let mut out: Vec<String> = Vec::new();
    for (n, l) in old.iter().enumerate() {
        let line_words: Vec<&str> = words
            .iter()
            .filter(|w| w.1 == u.start + n)
            .map(|w| w.0.as_str())
            .collect();
        if line_words.is_empty() && n > 0 {
            continue;
        }
        let lead = if n == 0 {
            prefix.to_string()
        } else {
            let t = l.trim_start_matches(['>', ' ', '\t']);
            l[..l.len() - t.len()].to_string()
        };
        let tail = if l.ends_with("  ") { "  " } else { "" };
        let mut line = lead.clone();
        let mut empty = true;
        for w in line_words {
            if !empty && old.len() > 1 && line.chars().count() + 1 + w.chars().count() > width {
                out.push(line);
                line = cont.clone();
                empty = true;
            }
            if !empty {
                line.push(' ');
            }
            line.push_str(w);
            empty = false;
        }
        out.push(line + tail);
    }
    out
}

/// The page body as the doc has it now: `src` (the body as published) with the edits
/// between the export of the published revision (`published`) and the doc's export now
/// (`now`) carried over.
pub fn theirs(src: &str, published: &str, now: &str, cites: bool, links: &Links) -> Theirs {
    let (t0, e0) = export_lines(published, cites);
    let (t1, e1) = export_lines(now, cites);
    let lines: Vec<&str> = src.lines().collect();
    let us = units(&lines);
    let map = align(&us, &e0, links);

    enum Edit {
        Replace(Vec<String>),
        Delete,
    }
    let mut edits: BTreeMap<usize, Edit> = BTreeMap::new();
    let mut inserts: BTreeMap<Option<usize>, Vec<String>> = BTreeMap::new();
    let (mut changes, mut approximate) = (0, 0);
    let mut anchor: Option<usize> = None;
    let ops = diff(&e0, &e1, |x, y| x == y);
    let mut k = 0;
    while k < ops.len() {
        if let Op::Equal(i, _) = ops[k] {
            anchor = map[i].or(anchor);
            k += 1;
            continue;
        }
        let (mut dels, mut ins) = (Vec::new(), Vec::new());
        while k < ops.len() && !matches!(ops[k], Op::Equal(..)) {
            match ops[k] {
                Op::Del(i) => dels.push(i),
                Op::Ins(j) => ins.push(j),
                Op::Equal(..) => unreachable!(),
            }
            k += 1;
        }
        changes += dels.len().max(ins.len());
        // the removed and added lines that are the same line edited, by similarity
        let d0: Vec<String> = dels.iter().map(|&i| e0[i].clone()).collect();
        let d1: Vec<String> = ins.iter().map(|&j| e1[j].clone()).collect();
        let mut pairs = pair_up(&d0, &d1, links);
        pairs.push((dels.len(), ins.len()));
        let (mut p, mut q) = (0, 0);
        for (pp, pq) in pairs {
            for &i in &dels[p..pp] {
                if let Some(u) = map[i].filter(|u| !edits.contains_key(u)) {
                    edits.insert(u, Edit::Delete);
                    anchor = Some(u);
                }
            }
            for &j in &ins[q..pq] {
                inserts
                    .entry(anchor)
                    .or_default()
                    .push(convert(&e1[j], links));
            }
            if pp < dels.len() {
                let (i, j) = (dels[pp], ins[pq]);
                match map[i].filter(|u| !edits.contains_key(u)) {
                    Some(u) => {
                        let (prefix, words, approx) =
                            patch(&us[u], &convert(&e0[i], links), &convert(&e1[j], links));
                        approximate += approx as usize;
                        edits.insert(u, Edit::Replace(layout(&us[u], &lines, &prefix, &words)));
                        anchor = Some(u);
                    }
                    None => inserts
                        .entry(anchor)
                        .or_default()
                        .push(convert(&e1[j], links)),
                }
            }
            (p, q) = (pp + 1, pq + 1);
        }
    }

    // rebuild the source with the edits and the new lines
    let mut out: Vec<String> = Vec::new();
    let place = |out: &mut Vec<String>, new: &[String], after: Option<Kind>, next: Option<&str>| {
        let mut prev = after;
        for l in new {
            let kind = kind_of(l);
            let joined = matches!(
                (prev, kind),
                (Some(Kind::Item), Kind::Item) | (Some(Kind::Row), Kind::Row)
            );
            if !joined
                && prev.is_some()
                && out.last().map(|l| !l.trim().is_empty()).unwrap_or(false)
            {
                out.push(String::new());
            }
            out.push(l.clone());
            prev = Some(kind);
        }
        if let (Some(n), Some(p)) = (next, prev) {
            let joined = matches!(
                (p, kind_of(n)),
                (Kind::Item, Kind::Item) | (Kind::Row, Kind::Row)
            );
            if !n.trim().is_empty() && !joined {
                out.push(String::new());
            }
        }
    };
    let first = us.first().map(|u| u.start).unwrap_or(lines.len());
    let mut i = 0;
    let by_start: BTreeMap<usize, usize> =
        us.iter().enumerate().map(|(n, u)| (u.start, n)).collect();
    while i < lines.len() {
        if i == first {
            if let Some(new) = inserts.get(&None) {
                place(&mut out, new, None, Some(lines[i]));
            }
        }
        let Some(&n) = by_start.get(&i) else {
            out.push(lines[i].to_string());
            i += 1;
            continue;
        };
        let u = &us[n];
        match edits.get(&n) {
            Some(Edit::Replace(new)) => out.extend(new.iter().cloned()),
            Some(Edit::Delete) => {
                // the blank line after a removed block goes with it
                if out.last().map(|l| l.trim().is_empty()).unwrap_or(true)
                    && lines
                        .get(u.end)
                        .map(|l| l.trim().is_empty())
                        .unwrap_or(false)
                {
                    i = u.end + 1;
                    if let Some(new) = inserts.get(&Some(n)) {
                        place(&mut out, new, None, lines.get(i).copied());
                    }
                    continue;
                }
            }
            None => out.extend(lines[u.start..u.end].iter().map(|l| l.to_string())),
        }
        if let Some(new) = inserts.get(&Some(n)) {
            place(&mut out, new, Some(u.kind), lines.get(u.end).copied());
        }
        i = u.end;
    }
    if us.is_empty() {
        if let Some(new) = inserts.get(&None) {
            place(&mut out, new, None, None);
        }
    }
    let mut body = out.join("\n");
    if src.ends_with('\n') {
        body.push('\n');
    }
    Theirs {
        body,
        changes,
        approximate,
        title: (t1 != t0).then_some(t1),
    }
}

/// The changes from `base` to `other` as (start, end, lines): base lines `start..end`
/// become `lines`. Lines replaced one for one are a change each, so an edit next to
/// another one does not swallow it.
fn hunks<'a>(base: &[&str], other: &[&'a str]) -> Vec<(usize, usize, Vec<&'a str>)> {
    let mut out = Vec::new();
    let ops = diff(base, other, |x, y| x == y);
    let (mut i, mut k) = (0, 0);
    while k < ops.len() {
        if let Op::Equal(bi, _) = ops[k] {
            i = bi + 1;
            k += 1;
            continue;
        }
        let start = i;
        let mut lines = Vec::new();
        while k < ops.len() && !matches!(ops[k], Op::Equal(..)) {
            match ops[k] {
                Op::Del(bi) => i = bi + 1,
                Op::Ins(j) => lines.push(other[j]),
                Op::Equal(..) => unreachable!(),
            }
            k += 1;
        }
        if lines.len() == i - start {
            out.extend(
                lines
                    .into_iter()
                    .enumerate()
                    .map(|(n, l)| (start + n, start + n + 1, vec![l])),
            );
        } else {
            out.push((start, i, lines));
        }
    }
    out
}

/// The result of [`merge3`]: the text, how many conflicts are left as markers, and how many
/// changes came from `theirs` alone, on lines `ours` left as they were in `base`.
pub struct Merged {
    pub text: String,
    pub conflicts: usize,
    pub theirs_only: usize,
}

/// A three-way merge by lines, as `git merge-file` does it except that edits on
/// neighbouring lines both apply: only changes to the same lines of `base` (or two
/// insertions at one place) that differ conflict, and are left as markers.
pub fn merge3(ours: &str, base: &str, theirs: &str, labels: [&str; 2]) -> Merged {
    let (o, b, t): (Vec<&str>, Vec<&str>, Vec<&str>) = (
        ours.lines().collect(),
        base.lines().collect(),
        theirs.lines().collect(),
    );
    let mut all: Vec<(usize, usize, Vec<&str>, bool)> = hunks(&b, &o)
        .into_iter()
        .map(|(s, e, l)| (s, e, l, true))
        .chain(hunks(&b, &t).into_iter().map(|(s, e, l)| (s, e, l, false)))
        .collect();
    all.sort_by_key(|h| (h.0, h.1));
    let overlaps = |s: usize, e: usize, h: &(usize, usize, Vec<&str>, bool)| {
        (h.0 < e && s < h.1) || (h.0 == s && (h.0 == h.1 || s == e))
    };
    let (mut out, mut conflicts, mut theirs_only, mut at, mut n) = (Vec::new(), 0, 0, 0, 0);
    while n < all.len() {
        let (mut s, mut e) = (all[n].0, all[n].1);
        let mut group = vec![n];
        n += 1;
        while n < all.len() && overlaps(s, e, &all[n]) {
            s = s.min(all[n].0);
            e = e.max(all[n].1);
            group.push(n);
            n += 1;
        }
        out.extend(b[at..s].iter().map(|l| l.to_string()));
        // one side's version of base s..e, its hunks applied
        let side = |mine: bool| -> Vec<String> {
            let mut v = Vec::new();
            let mut i = s;
            for &g in group.iter().filter(|&&g| all[g].3 == mine) {
                v.extend(b[i..all[g].0].iter().map(|l| l.to_string()));
                v.extend(all[g].2.iter().map(|l| l.to_string()));
                i = all[g].1;
            }
            v.extend(b[i..e].iter().map(|l| l.to_string()));
            v
        };
        let both = group.iter().any(|&g| all[g].3) && group.iter().any(|&g| !all[g].3);
        let (mine, other) = (side(true), side(false));
        if !both {
            if group.iter().any(|&g| all[g].3) {
                out.extend(mine);
            } else {
                theirs_only += 1;
                out.extend(other);
            }
        } else if mine == other {
            out.extend(mine);
        } else {
            conflicts += 1;
            out.push(format!("<<<<<<< {}", labels[0]));
            out.extend(mine);
            out.push("=======".to_string());
            out.extend(other);
            out.push(format!(">>>>>>> {}", labels[1]));
        }
        at = e;
    }
    out.extend(b[at..].iter().map(|l| l.to_string()));
    let mut text = out.join("\n");
    if !text.is_empty() && (ours.ends_with('\n') || theirs.ends_with('\n')) {
        text.push('\n');
    }
    Merged {
        text,
        conflicts,
        theirs_only,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn links() -> Links {
        Links {
            docs: [("D1".to_string(), "DOC-20261023-aaaaaa".to_string())].into(),
            site: Some("https://example.org/nb".into()),
        }
    }

    const SRC: &str = "\n## Purpose\nA paragraph wrapped at forty columns, with\n`code`, a [[DOC-20261023-aaaaaa|link]] and a citation\n[@smith2020] in it.\n\n## Body\n- first item\n- [ ] an open task\n\n| a | b |\n|---|---|\n| 1 | 2 |\n";

    fn export(edits: &[(&str, &str)]) -> String {
        let mut e = "**DOC-20261023-bbbbbb** · draft · published\n\n# **Probe**\n\n## **Purpose**\n\nA paragraph wrapped at forty columns, with code, a [link](https://docs.google.com/document/d/D1/edit) and a citation (Smith 2020\\) in it.\n\n## **Body**\n\n> * first item  \n> * ☐ an open task\n\n| a | b |\n| :---- | :---- |\n| 1 | 2 |\n\n## **References**\n\nSmith. 2020\\. A paper.\n".to_string();
        for (from, to) in edits {
            assert!(e.contains(from), "{from}");
            e = e.replace(from, to);
        }
        e
    }

    #[test]
    fn google_redirects_unwrap_to_the_link() {
        assert_eq!(
            convert("see [it](https://www.google.com/url?q=https://docs.google.com/document/d/D1/edit&sa=D&ust=1) and [x](https://www.google.com/url?q=https://ex.org/a%3Fb%3D1&sa=D)", &links()),
            "see [[DOC-20261023-aaaaaa|it]] and [x](https://ex.org/a?b=1)"
        );
    }

    #[test]
    fn merge3_applies_neighbouring_edits_and_marks_overlapping_ones() {
        let base = "a\nb\nc\nd\n";
        let m = |ours: &str, theirs: &str| {
            let r = merge3(ours, base, theirs, ["mine", "doc"]);
            (r.text, r.conflicts, r.theirs_only)
        };
        assert_eq!(
            m("a\nB\nc\nd\n", "a\nb\nC\nd\n"),
            ("a\nB\nC\nd\n".into(), 0, 1)
        );
        assert_eq!(
            m("a\nB\nc\nd\n", "a\nB\nc\nd\ne\n"),
            ("a\nB\nc\nd\ne\n".into(), 0, 1)
        );
        assert_eq!(
            m("a\nB\nC\nd\n", "a\nb\nC\nD\n"),
            ("a\nB\nC\nD\n".into(), 0, 1)
        );
        // the doc's edits already in the page: nothing to bring
        assert_eq!(
            m("a\nB\nc\nd\n", "a\nB\nc\nd\n"),
            ("a\nB\nc\nd\n".into(), 0, 0)
        );
        assert_eq!(
            m("a\nX\nc\nd\n", "a\nY\nc\nd\n"),
            (
                "a\n<<<<<<< mine\nX\n=======\nY\n>>>>>>> doc\nc\nd\n".into(),
                1,
                0
            )
        );
    }

    #[test]
    fn an_unedited_doc_gives_the_source_back() {
        let t = theirs(SRC, &export(&[]), &export(&[]), true, &links());
        assert_eq!(t.body, SRC);
        assert_eq!((t.changes, t.approximate), (0, 0));
    }

    #[test]
    fn an_edit_keeps_the_markup_of_words_nobody_touched() {
        let now = export(&[("forty columns", "forty-two columns")]);
        let t = theirs(SRC, &export(&[]), &now, true, &links());
        assert!(
            t.body.contains("A paragraph wrapped at forty-two columns, with\n`code`, a [[DOC-20261023-aaaaaa|link]] and a citation\n[@smith2020] in it.\n"),
            "{}",
            t.body
        );
        assert_eq!((t.changes, t.approximate), (1, 0));
    }

    #[test]
    fn ticks_new_lines_removals_and_reported_approximations() {
        let now = export(&[
            ("☐ an open task", "☑ an open task\n> * a new item"),
            ("> * first item  \n", ""),
            ("(Smith 2020\\) in it.", "(Smith 2021\\) in it.\n\nA new paragraph with [a link](https://example.org/nb/PRO-0001.html)."),
        ]);
        let t = theirs(SRC, &export(&[]), &now, true, &links());
        assert!(
            t.body
                .contains("\n## Body\n- [x] an open task\n- a new item\n\n| a | b |"),
            "{}",
            t.body
        );
        assert!(t.body.contains("and a citation\n(Smith 2021) in it.\n\nA new paragraph with [[PRO-0001|a link]].\n\n## Body"), "{}", t.body);
        assert_eq!(
            t.approximate, 1,
            "the edited citation is taken as the doc has it"
        );
        assert_eq!(t.title, None);
        let t = theirs(
            SRC,
            &export(&[]),
            &export(&[("# **Probe**", "# **Renamed**")]),
            true,
            &links(),
        );
        assert_eq!(t.title.as_deref(), Some("Renamed"));
        assert_eq!(t.body, SRC);
    }
}
