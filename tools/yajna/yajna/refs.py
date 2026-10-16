"""Citation keys: read `references/library.bib`, find citations in pages, create reading notes."""

from __future__ import annotations

import re
from pathlib import Path

from .vault import Vault

ENTRY_RE = re.compile(r"^@(\w+)\s*\{\s*([^,\s]+)\s*,", re.M)
# `[@key]`, `[@key, p. 3]`, `[-@key]`, bare `@key`; not `PRO-0012@3`, not emails.
CITE_RE = re.compile(r"(?<![\w/.])-?@([A-Za-z][A-Za-z0-9:_-]*[A-Za-z0-9])")


def bib_path(vault: Vault) -> Path:
    return vault.root / vault.cfg.get("bibliography", "references/library.bib")


def bib_keys(vault: Vault) -> set[str]:
    path = bib_path(vault)
    if not path.is_file():
        return set()
    return {m.group(2) for m in ENTRY_RE.finditer(path.read_text())}


def citations(text: str) -> set[str]:
    return {m.group(1) for m in CITE_RE.finditer(text)}


def entry(vault: Vault, key: str) -> dict | None:
    """Fields of one entry, braces balanced, or None. Good enough for title/author/year/doi."""
    text = bib_path(vault).read_text() if bib_path(vault).is_file() else ""
    for m in ENTRY_RE.finditer(text):
        if m.group(2) != key:
            continue
        depth, i = 1, m.end()
        while i < len(text) and depth:
            depth += {"{": 1, "}": -1}.get(text[i], 0)
            i += 1
        body = text[m.end():i - 1]
        fields = {"type": m.group(1).lower(), "key": key}
        for fm in re.finditer(r"(\w+)\s*=\s*", body):
            start = fm.end()
            if start >= len(body):
                break
            if body[start] == "{":
                depth, j = 1, start + 1
                while j < len(body) and depth:
                    depth += {"{": 1, "}": -1}.get(body[j], 0)
                    j += 1
                value = body[start + 1:j - 1]
            elif body[start] == '"':
                j = body.find('"', start + 1)
                value = body[start + 1:j]
            else:
                j = re.compile(r"[,\n]").search(body, start)
                value = body[start:j.start() if j else None]
            fields[fm.group(1).lower()] = re.sub(r"\s+", " ", value.replace("{", "").replace("}", "")).strip()
        return fields
    return None


def note_path(vault: Vault, key: str) -> Path:
    return vault.lab / "references" / f"{key}.md"


def create_note(vault: Vault, key: str, fields: dict) -> Path:
    path = note_path(vault, key)
    if path.exists():
        raise SystemExit(f"{path.relative_to(vault.root)} already exists")
    year = re.search(r"\d{4}", fields.get("year", "") or fields.get("date", "") or "")
    doi = fields.get("doi") or "null"
    text = vault.render(
        "reference", citekey=key, title=fields.get("title", key), authors=fields.get("author", ""),
        year=year.group(0) if year else "null", doi=doi, created=vault.today(), author=vault.author,
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path
