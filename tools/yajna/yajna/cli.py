"""The `yajna` command: new, log, result, tasks, validate."""

from __future__ import annotations

import argparse
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

from . import refs
from . import validate as _validate
from .vault import ALIASES, ENTITIES, PROJECT_SCOPED, Vault, find_root, slugify

TASK_RE = re.compile(r"^\s*- \[( |x|X)\] (.+?)\s*$")


# --- new ------------------------------------------------------------------------------

def create(vault: Vault, etype: str, title: str | None, project: str | None = None,
           experiment: str | None = None, kind: str | None = None, code: bool = False) -> Path:
    """Allocate an ID, fill the template, write the page. Returns the new path.

    `code` scaffolds `projects/<slug>/` with its own flake for a project.
    """
    etype = ALIASES.get(etype.lower(), etype.lower())
    if etype not in ENTITIES:
        raise SystemExit(f"unknown entity type {etype!r}; one of {', '.join(ENTITIES)}")
    prefix, template, subdir = ENTITIES[etype]
    if title is None:
        if etype == "run":
            title = ""
        elif etype == "agent_session":
            title = "Agent session"
        else:
            raise SystemExit(f"a title is required for a {etype}")

    if experiment and not project:
        exp = vault.find(experiment)
        project = exp.meta.get("project")
    if etype in PROJECT_SCOPED and not project:
        raise SystemExit(f"a {etype} needs --project PRJ-xxxx (or --experiment EXP-xxxx)")
    if project:
        vault.find(project)  # must exist
    if code and etype != "project":
        raise SystemExit("--code only applies to projects")

    kind = kind or {"run": "bench", "material": "reagent"}.get(etype, "")
    ident = vault.allocate(prefix)
    slug = slugify(title) if title else ""
    now = vault.now()
    text = vault.render(
        template,
        id=ident, title=title, created=now.date().isoformat(), author=vault.author,
        project=project or "null", experiment=experiment or "null", kind=kind, slug=slug,
        now=now.isoformat(timespec="minutes"), date=now.date().isoformat(),
        code=f"projects/{slug}" if code else "null",
    )

    if etype == "project":
        path = vault.lab / subdir / f"{ident}-{slug}" / "README.md"
    elif etype in PROJECT_SCOPED:
        name = f"{ident}-{slug}.md" if slug else f"{ident}.md"
        path = vault.project_dir(project) / subdir / name
    else:
        name = f"{ident}-{slug}.md" if slug else f"{ident}.md"
        path = vault.lab / subdir / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    if code:
        scaffold_code(vault, slug, id=ident, title=title)
    return path


def scaffold_code(vault: Vault, slug: str, **fields) -> Path:
    """Create projects/<slug>/ with a flake and README."""
    code_dir = vault.root / "projects" / slug
    if code_dir.exists():
        raise SystemExit(f"{code_dir.relative_to(vault.root)} already exists")
    code_dir.mkdir(parents=True)
    for name in ("flake.nix", "README.md"):
        (code_dir / name).write_text(vault.render(f"code/{name}", slug=slug, **fields))
    return code_dir


def cmd_new(vault: Vault, args) -> int:
    if args.type is None:
        from . import tui
        path = tui.new(vault)
    else:
        path = create(vault, args.type, args.title, args.project, args.experiment, args.kind, args.code)
    print(path.relative_to(vault.root))
    return 0


# --- log ------------------------------------------------------------------------------

def cmd_log(vault: Vault, args) -> int:
    now = vault.now()
    date = args.date or now.date().isoformat()
    time = args.time or now.strftime("%H:%M")
    author = args.author or vault.author
    path = vault.log_path(date, author)
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(vault.render("log", date=date, author=author))
    text = " ".join(args.text).strip()
    if not text and sys.stdin.isatty():
        from . import tui
        text = tui.log_entry(vault)
    elif not text:
        text = sys.stdin.read().strip()
    if not text:
        raise SystemExit("nothing to log")
    with path.open("a") as f:
        f.write(f"- {time} {text}\n")
    print(f"{path.relative_to(vault.root)}: {time} {text}")
    return 0


# --- result ---------------------------------------------------------------------------

RESULT_MARK = "===RESULT==="


def _git_commit(root: Path) -> str | None:
    try:
        out = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=root,
                             capture_output=True, text=True, check=True)
        return out.stdout.strip() or None
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None


def cmd_result(vault: Vault, args) -> int:
    source = Path(args.file).read_text() if args.file else sys.stdin.read()
    lines = [l for l in source.splitlines() if l.startswith(RESULT_MARK)]
    if not lines:
        raise SystemExit(f"no line starting with {RESULT_MARK} in input")
    try:
        result = json.loads(lines[-1][len(RESULT_MARK):].strip())
    except json.JSONDecodeError as e:
        raise SystemExit(f"bad JSON after {RESULT_MARK}: {e}")
    if not isinstance(result, dict):
        raise SystemExit("the result line must be a JSON object")

    exp = vault.find(args.experiment)
    project = exp.meta.get("project")
    ident = vault.allocate("RUN")
    now = vault.now()
    meta = {
        "id": ident, "type": "run", "schema_version": 1, "kind": args.kind,
        "project": project, "experiment": args.experiment, "status": "done",
        "created": now.date().isoformat(), "finished": now.isoformat(timespec="minutes"),
        "author": args.author or vault.author,
    }
    commit = _git_commit(vault.root)
    if commit:
        meta["commit"] = commit
    rows = "\n".join(f"| {k} | {json.dumps(v) if not isinstance(v, str) else v} |" for k, v in result.items())
    body = f"\n## Result\n\n| Key | Value |\n|-----|-------|\n{rows}\n"
    if args.note:
        body += f"\n## Notes\n\n{args.note}\n"
    path = vault.project_dir(project) / "runs" / f"{ident}.md"
    vault.write_page(path, meta, body)

    tsv = exp.path.parent / args.experiment / "results.tsv"
    _append_tsv(tsv, {"run": ident, "finished": meta["finished"], **result})
    print(f"{path.relative_to(vault.root)}\n{tsv.relative_to(vault.root)}")
    return 0


def _append_tsv(tsv: Path, row: dict) -> None:
    tsv.parent.mkdir(parents=True, exist_ok=True)
    existing: list[dict] = []
    columns: list[str] = []
    if tsv.is_file():
        with tsv.open(newline="") as f:
            reader = csv.DictReader(f, delimiter="\t")
            columns = list(reader.fieldnames or [])
            existing = list(reader)
    for k in row:
        if k not in columns:
            columns.append(k)
    with tsv.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=columns, delimiter="\t", restval="")
        w.writeheader()
        for r in existing:
            w.writerow(r)
        w.writerow({k: (json.dumps(v) if isinstance(v, (list, dict)) else v) for k, v in row.items()})


# --- tasks ----------------------------------------------------------------------------

def cmd_tasks(vault: Vault, args) -> int:
    n = 0
    for page in vault.pages():
        section = ""
        for lineno, line in enumerate(page.path.read_text().splitlines(), start=1):
            if line.startswith("#"):
                section = line.lstrip("#").strip()
                continue
            m = TASK_RE.match(line)
            if not m:
                continue
            done = m.group(1).lower() == "x"
            if done and not args.done:
                continue
            n += 1
            rel = page.path.relative_to(vault.root)
            where = f"{rel}:{lineno}"
            label = f"[{page.id}] " if page.id else ""
            print(f"{where:<60} {label}{section + ': ' if section else ''}{m.group(2)}")
    if n == 0:
        print("no open tasks" if not args.done else "no tasks")
    return 0


# --- ref ------------------------------------------------------------------------------

def cmd_ref(vault: Vault, args) -> int:
    fields = refs.entry(vault, args.key)
    if fields is None:
        raise SystemExit(f"{args.key}: not in {refs.bib_path(vault).relative_to(vault.root)}")
    for k in ("key", "type", "title", "author", "year", "journal", "doi", "url"):
        if fields.get(k):
            print(f"{k:<8} {fields[k]}")
    note = refs.note_path(vault, args.key)
    if args.note:
        note = refs.create_note(vault, args.key, fields)
        print(f"note     {note.relative_to(vault.root)} (created)")
    else:
        print(f"note     {note.relative_to(vault.root)}" + ("" if note.exists() else " (none; --note creates it)"))
    cited = [p.path.relative_to(vault.root) for p in vault.pages() if args.key in refs.citations(p.body)]
    for c in cited:
        print(f"cited    {c}")
    return 0


# --- validate -------------------------------------------------------------------------

def cmd_validate(vault: Vault, args) -> int:
    problems, counted = _validate.validate(vault)
    for p in problems:
        print(p)
    if problems:
        print(f"{len(problems)} problem(s) in {counted} page(s)", file=sys.stderr)
        return 1
    print(f"ok: {counted} page(s) valid")
    return 0


# --- main -----------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="yajna", description=__doc__)
    p.add_argument("--root", type=Path, help="repo root (default: nearest yajna.toml upwards)")
    sub = p.add_subparsers(dest="cmd")

    s = sub.add_parser("new", help="create a page from its template and allocate an ID")
    s.add_argument("type", nargs="?", help="project, experiment, run, protocol, material, artifact, "
                   "analysis, equipment, build, agent; omit for an interactive prompt")
    s.add_argument("title", nargs="?")
    s.add_argument("--project", help="PRJ-xxxx for project-scoped entities")
    s.add_argument("--experiment", help="EXP-xxxx (runs); implies --project")
    s.add_argument("--kind", help="run kind (bench, compute, assembly, calibration) or material kind")
    s.add_argument("--code", action="store_true", help="project: also scaffold projects/<slug>/ with a flake")
    s.set_defaults(fn=cmd_new)

    s = sub.add_parser("log", help="append a timestamped line to today's log")
    s.add_argument("text", nargs="*", help="the entry; read from stdin when empty")
    s.add_argument("--date", help="YYYY-MM-DD (default today)")
    s.add_argument("--time", help="HH:MM (default now)")
    s.add_argument("--author", help="author handle (default from yajna.toml)")
    s.set_defaults(fn=cmd_log)

    s = sub.add_parser("result", help="turn a ===RESULT=== JSON line into a RUN page and a results.tsv row")
    s.add_argument("--experiment", required=True, help="EXP-xxxx the run belongs to")
    s.add_argument("file", nargs="?", help="output file to scan (default stdin)")
    s.add_argument("--kind", default="compute")
    s.add_argument("--author")
    s.add_argument("--note", help="free text for the run page")
    s.set_defaults(fn=cmd_result)

    s = sub.add_parser("tasks", help="list open checkboxes across the vault")
    s.add_argument("--done", action="store_true", help="include completed tasks")
    s.set_defaults(fn=cmd_tasks)

    s = sub.add_parser("ref", help="show a reference by citation key; --note creates its reading note")
    s.add_argument("key")
    s.add_argument("--note", action="store_true")
    s.set_defaults(fn=cmd_ref)

    s = sub.add_parser("validate", help="check every page against the schemas, IDs and links")
    s.set_defaults(fn=cmd_validate)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    vault = Vault(args.root.resolve() if args.root else find_root())
    if args.cmd is None:
        from . import tui
        return tui.menu(vault, build_parser())
    return args.fn(vault, args)


if __name__ == "__main__":
    sys.exit(main())
