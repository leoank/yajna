"""Regenerate a code-native `PRO` page's `## Steps` from its source (design doc, 5.1).

Only `## Steps` and the `stage`/`source` frontmatter lines change; everything else on the
page (purpose, notes, history) is the author's and is kept byte for byte.
"""

from __future__ import annotations

import re


class PageError(ValueError):
    pass


def _split(text: str) -> tuple[list[str], list[str]]:
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        raise PageError("the page has no frontmatter")
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines[: i + 1], lines[i + 1:]
    raise PageError("the page's frontmatter is not closed with ---")


def frontmatter_field(text: str, name: str) -> str | None:
    """A top-level scalar from the page's frontmatter, unquoted, comment dropped."""
    fm, _ = _split(text)
    for line in fm:
        m = re.match(rf"^{name}:\s*(.*?)\s*(#.*)?$", line)
        if m:
            v = m.group(1)
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            return v or None
    return None


def _set_field(fm: list[str], name: str, value: str, after: str) -> list[str]:
    pat = re.compile(rf"^{name}:(\s*)([^#]*?)(\s*#.*)?$")
    for i, line in enumerate(fm):
        m = pat.match(line)
        if m:
            new = f"{name}: {value}"
            if m.group(3):  # keep the comment, at its column when the value fits
                comment = m.group(3).lstrip()
                col = len(line) - len(comment)
                new = (new.ljust(col) if len(new) < col else new + " ") + comment
            fm[i] = new
            return fm
    for i, line in enumerate(fm):
        if line.startswith(f"{after}:"):
            fm.insert(i + 1, f"{name}: {value}")
            return fm
    fm.insert(len(fm) - 1, f"{name}: {value}")
    return fm


def update(text: str, steps: str, *, source: str, protocol: dict) -> str:
    """`text` with `## Steps` replaced by `steps`, `stage: codified` and `source:` set.
    The page's `id` and `version` must match the protocol's metadata."""
    page_id = frontmatter_field(text, "id")
    if protocol.get("id") and protocol["id"] != page_id:
        raise PageError(f"the page is {page_id} but the protocol's metadata says {protocol['id']}")
    page_version = frontmatter_field(text, "version")
    if str(protocol.get("version", 1)) != page_version:
        raise PageError(f"the page is version {page_version} but the protocol's metadata says "
                        f"{protocol.get('version', 1)}; bump both together")
    fm, body = _split(text)
    fm = _set_field(fm, "stage", "codified", "version")
    fm = _set_field(fm, "source", source, "stage")
    start = next((i for i, l in enumerate(body) if l.strip() == "## Steps"), None)
    if start is None:
        raise PageError("the page has no `## Steps` section")
    end = next((i for i in range(start + 1, len(body)) if body[i].startswith("## ")), len(body))
    rest = body[end:]
    new_body = body[: start + 1] + steps.rstrip("\n").split("\n") + ([""] if rest else []) + rest
    return "\n".join(fm + new_body)
