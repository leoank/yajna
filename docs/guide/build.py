"""Assemble and build the yajna book (the GitHub Pages site).

    python3 docs/guide/build.py <repo root> <out dir>

Copies docs/guide/ to a temporary directory, adds what is generated so it cannot drift from
the code (the CLI reference from `yajna --help`, the page-type reference from schema/, the
design documents from docs/ with one sidebar entry per ADR), checks every relative link,
and runs `mdbook build` into <out dir>. Needs `yajna` and `mdbook` on PATH; `nix build
.#docs` provides both.
"""

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

root, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
work = Path(tempfile.mkdtemp(prefix="yajna-book-"))
shutil.copytree(root / "docs/guide", work, dirs_exist_ok=True, ignore=shutil.ignore_patterns("build.py"))
for p in [work, *work.rglob("*")]:  # sources from the Nix store are read-only
    p.chmod(p.stat().st_mode | 0o200)
src = work / "src"


def yajna(*args):
    return subprocess.run(["yajna", *args, "--help"], check=True, capture_output=True, text=True).stdout


def subcommands(text):
    """Names under `Commands:` in clap's help, without `help`."""
    names, inside = [], False
    for line in text.splitlines():
        if line.startswith("Commands:"):
            inside = True
        elif inside and not line.strip():
            break
        elif inside:
            name = line.split()[0]
            if name != "help":
                names.append(name)
    return names


# --- CLI reference -------------------------------------------------------------------
top = yajna()
cli = [
    "# Command line\n",
    "Generated from `yajna --help` at build time, so it always matches the binary the site was",
    "built with. Every command also takes `--root <path>` to work on a notebook other than the",
    "one around the current directory. Run a command without its arguments to be asked for",
    "them, with completion.\n",
    "```text", top.rstrip(), "```\n",
]
for cmd in subcommands(top):
    text = yajna(cmd)
    cli += [f"## yajna {cmd}\n", "```text", text.rstrip(), "```\n"]
    for sub in subcommands(text):
        cli += [f"### yajna {cmd} {sub}\n", "```text", yajna(cmd, sub).rstrip(), "```\n"]
(src / "reference/cli.md").write_text("\n".join(cli))

# --- page types from schema/ -----------------------------------------------------------
def describe(spec):
    if "const" in spec:
        return f"`{json.dumps(spec['const'])}`"
    if "enum" in spec:
        return " · ".join("`null`" if v is None else f"`{v}`" for v in spec["enum"])
    kind = spec.get("type", "")
    if kind == "array":
        item = spec.get("items", {})
        inner = describe(item) if item else ""
        return f"list of {inner}" if inner else "list"
    if kind == "object":
        props = spec.get("properties", {})
        return "object: " + ", ".join(f"`{k}`" for k in props) if props else "object"
    if "pattern" in spec:
        return f"{kind}, matching `{spec['pattern']}`".replace("|", "\\|")
    return kind if isinstance(kind, str) else " or ".join(kind)


types = [
    "# Page types\n",
    "Generated from the JSON Schemas in `schema/` that `yajna validate` checks every page's",
    "frontmatter against. Required fields are marked; every schema also accepts fields it",
    "does not know, so a page can carry extra metadata.\n",
]
for path in sorted((root / "schema").glob("*.json")):
    s = json.loads(path.read_text())
    required = set(s.get("required", []))
    types.append(f"## {s.get('title', path.stem)}\n")
    if s.get("description"):
        types.append(s["description"] + "\n")
    types += ["| Field | Required | Values |", "|---|---|---|"]
    for name, spec in s.get("properties", {}).items():
        note = describe(spec)
        if spec.get("description"):
            note += f" — {spec['description']}"
        types.append(f"| `{name}` | {'yes' if name in required else ''} | {note} |")
    types.append("")
(src / "reference/page-types.md").write_text("\n".join(types))

# --- design documents ------------------------------------------------------------------
design = src / "design"
(design / "decisions").mkdir(parents=True, exist_ok=True)
for name in ("architecture.md", "files-viewer.md", "review.md", "reproduce.md", "from-anywhere.md", "conventions.md"):
    shutil.copyfile(root / "docs" / name, design / name)
adrs = []
for path in sorted((root / "docs/decisions").glob("*.md")):
    shutil.copyfile(path, design / "decisions" / path.name)
    if path.name.startswith("ADR-"):
        title = path.read_text().splitlines()[0].lstrip("# ").strip()
        adrs.append(f"    - [{title}](design/decisions/{path.name})")
summary = src / "SUMMARY.md"
summary.write_text(summary.read_text().replace("<!-- ADRS -->", "\n".join(adrs)))

# --- every relative link resolves ------------------------------------------------------
LINK = re.compile(r"\]\(([^)\s]+)\)")
broken = []
for page in src.rglob("*.md"):
    body = re.sub(r"```.*?```", "", page.read_text(), flags=re.S)
    for target in LINK.findall(body):
        if re.match(r"[a-z]+:", target) or target.startswith("#"):
            continue
        if not (page.parent / target.split("#")[0]).exists():
            broken.append(f"{page.relative_to(src)}: {target}")
if broken:
    sys.exit("broken links:\n  " + "\n  ".join(broken))

subprocess.run(["mdbook", "build", str(work), "--dest-dir", str(out)], check=True)
shutil.rmtree(work)
