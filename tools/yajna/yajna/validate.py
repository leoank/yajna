"""Validate every page in the vault: frontmatter against schema, IDs, links, protocol steps."""

from __future__ import annotations

import json
import re
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

from . import refs
from .vault import ID_RE, LINK_RE, PREFIX_TO_TYPE, Page, Vault, load_yaml

STEP_RE = re.compile(r"^(\d+)\.\s+(.*?)\s*$")


class Problems(list):
    def add(self, path: Path, msg: str, root: Path | None = None):
        rel = path.relative_to(root) if root else path
        self.append(f"{rel}: {msg}")


def _validators(vault: Vault) -> dict[str, Draft202012Validator]:
    out = {}
    for f in vault.schemas.glob("*.json"):
        out[f.stem] = Draft202012Validator(json.loads(f.read_text()))
    return out


def _ids_in(value) -> set[str]:
    """Every ID-shaped string inside a frontmatter value, recursively."""
    if isinstance(value, str):
        return {m.group(0) for m in ID_RE.finditer(value)}
    if isinstance(value, list):
        return set().union(*(_ids_in(v) for v in value)) if value else set()
    if isinstance(value, dict):
        return set().union(*(_ids_in(v) for v in value.values())) if value else set()
    return set()


def parse_steps(body: str) -> tuple[list[tuple[int, str, dict | None]], list[str]]:
    """Return ([(number, text, attrs)], errors) for the `## Steps` section of a protocol."""
    steps, errors = [], []
    in_steps = False
    for line in body.splitlines():
        if line.startswith("## "):
            in_steps = line.strip() == "## Steps"
            continue
        if not in_steps:
            continue
        m = STEP_RE.match(line)
        if not m:
            continue
        n, text = int(m.group(1)), m.group(2)
        attrs = None
        if text.endswith("}"):
            start = text.rfind(" {")
            if start < 0 and text.startswith("{"):
                start = 0
            if start >= 0:
                raw, text = text[start:].strip(), text[:start].rstrip()
                try:
                    attrs = load_yaml(raw)
                except yaml.YAMLError as e:
                    errors.append(f"step {n}: cannot parse attributes {raw!r}: {e}")
                else:
                    if not isinstance(attrs, dict):
                        errors.append(f"step {n}: attribute block is not a mapping: {raw!r}")
                        attrs = None
        steps.append((n, text, attrs))
    for i, (n, _, _) in enumerate(steps, start=1):
        if n != i:
            errors.append(f"step numbering: expected {i}, found {n}")
            break
    return steps, errors


def validate(vault: Vault) -> tuple[list[str], int]:
    """Return (problems, number of entity pages checked)."""
    problems = Problems()
    validators = _validators(vault)
    pages: list[Page] = list(vault.pages())
    ids: dict[str, Path] = {}
    counted = 0

    for page in pages:
        if page.meta is None:
            continue
        counted += 1
        ptype = page.meta.get("type")
        if ptype not in validators:
            problems.add(page.path, f"unknown type {ptype!r}", vault.root)
            continue
        for err in sorted(validators[ptype].iter_errors(page.meta), key=lambda e: list(e.path)):
            where = "/".join(str(p) for p in err.path) or "frontmatter"
            problems.add(page.path, f"{where}: {err.message}", vault.root)

        if ptype == "log":
            date = str(page.meta.get("date", ""))
            if not page.path.name.startswith(date):
                problems.add(page.path, f"filename does not start with date {date}", vault.root)
            continue

        if ptype == "reference":
            key = str(page.meta.get("citekey", ""))
            if page.path.stem != key:
                problems.add(page.path, f"filename does not match citekey {key}", vault.root)
            continue

        pid = page.meta.get("id")
        if not isinstance(pid, str):
            continue
        if pid in ids:
            problems.add(page.path, f"duplicate id {pid}, also in {ids[pid].relative_to(vault.root)}", vault.root)
        ids[pid] = page.path
        prefix = pid.split("-")[0]
        if PREFIX_TO_TYPE.get(prefix) != ptype:
            problems.add(page.path, f"id prefix {prefix} does not match type {ptype}", vault.root)
        named_by_id = page.path.name.startswith(pid) or (
            page.path.name == "README.md" and page.path.parent.name.startswith(pid)
        )
        if not named_by_id:
            problems.add(page.path, f"filename does not start with id {pid}", vault.root)

    # Links and references need the full ID set.
    keys = refs.bib_keys(vault)
    for page in pages:
        if page.meta is None:
            continue
        for key in sorted(refs.citations(page.body)):
            if key not in keys:
                problems.add(page.path, f"citation @{key} not in {refs.bib_path(vault).relative_to(vault.root)}", vault.root)
        targets = set()
        for key, value in page.meta.items():
            if key != "id":
                targets |= _ids_in(value)
        for m in LINK_RE.finditer(page.body):
            target = m.group(1).strip().split("@")[0]
            if ID_RE.fullmatch(target):
                targets.add(target)
        for ref in sorted(targets):
            if ref not in ids:
                problems.add(page.path, f"link to unknown id {ref}", vault.root)

        if page.meta.get("type") == "protocol":
            steps, errors = parse_steps(page.body)
            for e in errors:
                problems.add(page.path, e, vault.root)
            if not steps:
                problems.add(page.path, "no steps under `## Steps`", vault.root)
            for n, _, attrs in steps:
                if attrs is None:
                    continue
                for err in validators["step"].iter_errors(attrs):
                    where = "/".join(str(p) for p in err.path) or "attributes"
                    problems.add(page.path, f"step {n} {where}: {err.message}", vault.root)
                for ref in sorted(_ids_in(attrs)):
                    if ref not in ids:
                        problems.add(page.path, f"step {n}: unknown id {ref}", vault.root)

    counters = vault.read_counters()
    for pid in ids:
        prefix, _, rest = pid.partition("-")
        if prefix in counters and rest.isdigit() and int(rest) > int(counters[prefix]):
            problems.add(vault.counters_file, f"{prefix} counter {counters[prefix]} is below existing {pid}", vault.root)

    return list(problems), counted
