"""Paths, configuration, IDs and frontmatter for the notebook under `lab/`."""

from __future__ import annotations

import datetime as dt
import re
import secrets
import tomllib
import zoneinfo
from dataclasses import dataclass
from pathlib import Path

import yaml

CONFIG_NAME = "yajna.toml"

# Entity type -> (ID prefix, template name, where it lives). `project-scoped` entities live
# under the project directory; the others under a shared directory in the vault.
ENTITIES = {
    "project": ("PRJ", "project", "projects"),
    "experiment": ("EXP", "experiment", "experiments"),
    "run": ("RUN", "run", "runs"),
    "analysis": ("ANA", "analysis", "analyses"),
    "artifact": ("ART", "artifact", "artifacts"),
    "protocol": ("PRO", "protocol", "protocols"),
    "material": ("MAT", "material", "materials"),
    "equipment": ("EQP", "equipment", "equipment"),
    "build": ("BLD", "build", "builds"),
    "agent_session": ("AGS", "agent_session", "agents"),
}
PROJECT_SCOPED = {"experiment", "run", "analysis", "artifact"}
VOLUME_PREFIXES = {"RUN", "ART", "AGS"}
PREFIX_TO_TYPE = {v[0]: k for k, v in ENTITIES.items()}
ALIASES = {"agent": "agent_session", "exp": "experiment", "pro": "protocol", "mat": "material",
           "eqp": "equipment", "bld": "build", "prj": "project", "ana": "analysis",
           "art": "artifact", "ags": "agent_session", "run": "run"}

ID_RE = re.compile(r"\b(PRJ|EXP|PRO|MAT|ANA|EQP|BLD)-\d{4,}\b|\b(RUN|ART|AGS)-\d{8}-[a-z2-7]{4}\b")
LINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]")
BASE32 = "abcdefghijklmnopqrstuvwxyz234567"


class _Loader(yaml.SafeLoader):
    """SafeLoader that leaves dates and timestamps as strings so schemas see what is written."""


_Loader.yaml_implicit_resolvers = {
    k: [(tag, regexp) for tag, regexp in v if tag != "tag:yaml.org,2002:timestamp"]
    for k, v in _Loader.yaml_implicit_resolvers.items()
}


def load_yaml(text: str):
    return yaml.load(text, Loader=_Loader)


def split_frontmatter(text: str) -> tuple[dict | None, str]:
    """Return (frontmatter dict or None, body). Frontmatter must start on line 1."""
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---\n", 4)
    if end < 0:
        return None, text
    meta = load_yaml(text[4:end])
    if not isinstance(meta, dict):
        return None, text
    return meta, text[end + 5:]


def slugify(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s[:60].rstrip("-") or "untitled"


def find_root(start: Path | None = None) -> Path:
    here = (start or Path.cwd()).resolve()
    for p in [here, *here.parents]:
        if (p / CONFIG_NAME).is_file():
            return p
    raise SystemExit(f"not inside a yajna repo: no {CONFIG_NAME} found above {here}")


@dataclass
class Page:
    path: Path
    meta: dict | None
    body: str

    @property
    def id(self) -> str | None:
        return self.meta.get("id") if self.meta else None


class Vault:
    def __init__(self, root: Path):
        self.root = root
        cfg = tomllib.loads((root / CONFIG_NAME).read_text())
        self.cfg = cfg
        self.author: str = cfg.get("author", "unknown")
        self.lab: Path = root / cfg.get("vault", "lab")
        self.tz = zoneinfo.ZoneInfo(cfg.get("timezone", "UTC"))
        self.templates = root / "templates"
        self.schemas = root / "schema"
        self.counters_file = self.lab / "counters.yaml"

    # --- time -----------------------------------------------------------------------
    def now(self) -> dt.datetime:
        return dt.datetime.now(self.tz)

    def today(self) -> str:
        return self.now().date().isoformat()

    # --- pages ----------------------------------------------------------------------
    def read(self, path: Path) -> Page:
        meta, body = split_frontmatter(path.read_text())
        return Page(path, meta, body)

    def pages(self):
        for path in sorted(self.lab.rglob("*.md")):
            yield self.read(path)

    def index(self) -> dict[str, Path]:
        """ID -> path for every page that has an id."""
        out: dict[str, Path] = {}
        for page in self.pages():
            if page.id:
                out.setdefault(page.id, page.path)
        return out

    def find(self, ident: str) -> Page:
        path = self.index().get(ident)
        if path is None:
            raise SystemExit(f"{ident}: not found in {self.lab}")
        return self.read(path)

    def project_dir(self, prj: str) -> Path:
        matches = [p for p in (self.lab / "projects").glob(f"{prj}-*") if p.is_dir()]
        if not matches:
            matches = [p for p in (self.lab / "projects").glob(prj) if p.is_dir()]
        if not matches:
            raise SystemExit(f"{prj}: no project directory under {self.lab / 'projects'}")
        return matches[0]

    def write_page(self, path: Path, meta: dict, body: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        fm = yaml.safe_dump(meta, sort_keys=False, allow_unicode=True).rstrip("\n")
        path.write_text(f"---\n{fm}\n---\n{body}")

    # --- ids ------------------------------------------------------------------------
    def read_counters(self) -> dict[str, int]:
        if not self.counters_file.is_file():
            return {}
        return load_yaml(self.counters_file.read_text()) or {}

    def allocate(self, prefix: str) -> str:
        if prefix in VOLUME_PREFIXES:
            stamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d")
            suffix = "".join(secrets.choice(BASE32) for _ in range(4))
            return f"{prefix}-{stamp}-{suffix}"
        counters = self.read_counters()
        n = int(counters.get(prefix, 0)) + 1
        counters[prefix] = n
        header = "# Last allocated number per curated ID prefix. Managed by `yajna new`.\n"
        self.counters_file.write_text(header + yaml.safe_dump(counters, sort_keys=False))
        return f"{prefix}-{n:04d}"

    # --- templates ------------------------------------------------------------------
    def render(self, template: str, **fields) -> str:
        from string import Template

        text = (self.templates / f"{template}.md").read_text()
        return Template(text).safe_substitute(fields)

    # --- log ------------------------------------------------------------------------
    def log_path(self, date: str, author: str | None = None) -> Path:
        author = author or self.author
        name = date if author == self.author else f"{date}.{author.replace(':', '-')}"
        return self.lab / "log" / date[:4] / f"{name}.md"
