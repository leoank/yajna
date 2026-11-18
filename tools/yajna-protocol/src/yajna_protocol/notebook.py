"""Read just enough of a yajna notebook to name materials and equipment and check IDs."""

from __future__ import annotations

import re
from pathlib import Path

_FIELD = re.compile(r"^(id|title|kind):\s*(.*?)\s*(#.*)?$")


def find_root(start: Path) -> Path | None:
    """The nearest directory at or above `start` holding `yajna.toml`."""
    for d in [start, *start.parents]:
        if (d / "yajna.toml").is_file():
            return d
    return None


def _frontmatter(path: Path) -> dict:
    out = {}
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return out
    for line in lines[1:]:
        if line.strip() == "---":
            break
        m = _FIELD.match(line)
        if m:
            v = m.group(2)
            if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                v = v[1:-1]
            out[m.group(1)] = v
    return out


class Notebook:
    """Materials and equipment pages under `notes/` (or `lab/` in older notebooks)."""

    def __init__(self, root: Path):
        self.root = root
        base = root / "notes" if (root / "notes").is_dir() else root / "lab"
        self._pages: dict[str, dict] = {}
        for sub in ("materials", "equipment"):
            for p in sorted((base / sub).glob("*.md")) if (base / sub).is_dir() else []:
                fm = _frontmatter(p)
                if "id" in fm:
                    self._pages[fm["id"]] = fm

    def material(self, mat: str) -> dict | None:
        return self._lookup(mat, "MAT-")

    def equipment(self, eqp: str) -> dict | None:
        return self._lookup(eqp, "EQP-")

    def _lookup(self, id: str, prefix: str) -> dict | None:
        if "/" in id:
            return {}  # another notebook's ID: not ours to check
        page = self._pages.get(id)
        return page if page is not None and id.startswith(prefix) else None
