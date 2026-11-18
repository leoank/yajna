"""`yajna-protocol ir|render|page`: protocols as code, from the command line."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from . import page as page_mod
from .context import ProtocolError
from .loader import record
from .notebook import Notebook, find_root
from .render import RenderError, render_steps


def _pairs(items: list[str], what: str) -> dict[str, str]:
    out = {}
    for item in items:
        k, sep, v = item.partition("=")
        if not sep or not k:
            raise ProtocolError(f"{what} {item!r}: write it as name=value")
        out[k.strip()] = v.strip()
    return out


def _notebook(args, near: Path) -> Notebook | None:
    if args.no_notebook:
        return None
    root = Path(args.root) if args.root else find_root(near.resolve())
    return Notebook(root) if root else None


def _ir(args, path: Path) -> dict:
    if path.suffix == ".json":
        if args.param or args.equipment:
            raise ProtocolError("--param and --equipment apply to a protocol's source, not a recorded IR")
        return json.loads(path.read_text(encoding="utf-8"))
    return record(path, _pairs(args.param, "--param"), equipment=_pairs(args.equipment, "--equipment"),
                  notebook=_notebook(args, Path.cwd()))


def cmd_ir(args) -> int:
    ir = _ir(args, Path(args.protocol))
    out = json.dumps(ir, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        Path(args.output).write_text(out, encoding="utf-8")
    else:
        sys.stdout.write(out)
    return 0


def cmd_render(args) -> int:
    sys.stdout.write(render_steps(_ir(args, Path(args.protocol))))
    return 0


def cmd_page(args) -> int:
    page = Path(args.page)
    text = page.read_text(encoding="utf-8")
    root = Path(args.root) if args.root else find_root(page.resolve().parent)
    if root is None:
        raise ProtocolError(f"{page} is not inside a yajna notebook (no yajna.toml above it); pass --root")
    source = args.source or page_mod.frontmatter_field(text, "source")
    if not source:
        raise ProtocolError(f"{page} has no `source:`; pass --source <protocol.py> the first time")
    src = Path(source)
    if args.source:  # given on the command line: relative to here; stored relative to the root
        src = src.resolve()
        try:
            source = os.path.relpath(src, root.resolve())
        except ValueError:
            source = str(src)
    else:
        src = root / src
    if not src.is_file():
        raise ProtocolError(f"{page}: source {source} does not exist")
    ir = record(src, notebook=None if args.no_notebook else Notebook(root))
    new = page_mod.update(text, render_steps(ir), source=source, protocol=ir["protocol"])
    if args.check:
        if new != text:
            print(f"{page}: ## Steps is stale; regenerate it with `yajna-protocol page {page}`", file=sys.stderr)
            return 1
        return 0
    if new != text:
        page.write_text(new, encoding="utf-8")
        print(f"{page}: steps regenerated from {source}")
    return 0


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="yajna-protocol", description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)

    def common(p, params=True):
        if params:
            p.add_argument("-p", "--param", action="append", default=[], metavar="NAME=VALUE",
                           help="a parameter value (repeatable); undeclared names are an error")
            p.add_argument("-e", "--equipment", action="append", default=[], metavar="KIND=EQP-…",
                           help="which equipment a kind means on this run (repeatable)")
        p.add_argument("--root", help="the notebook whose materials and equipment name things (default: the one around)")
        p.add_argument("--no-notebook", action="store_true", help="do not look IDs up in a notebook")

    p = sub.add_parser("ir", help="record a protocol and print its command stream as JSON")
    p.add_argument("protocol")
    p.add_argument("-o", "--output", help="write to a file instead of stdout")
    common(p)
    p.set_defaults(fn=cmd_ir)

    p = sub.add_parser("render", help="print a protocol's ## Steps (from source or a recorded IR)")
    p.add_argument("protocol")
    common(p)
    p.set_defaults(fn=cmd_render)

    p = sub.add_parser("page", help="regenerate a PRO page's ## Steps from its source:")
    p.add_argument("page")
    p.add_argument("--source", help="the protocol file, the first time (stored as source:)")
    p.add_argument("--check", action="store_true", help="change nothing; exit 1 if the steps are stale")
    common(p, params=False)
    p.set_defaults(fn=cmd_page)

    args = ap.parse_args(argv)
    try:
        return args.fn(args)
    except (ProtocolError, RenderError, page_mod.PageError) as e:
        print(f"yajna-protocol: {e}", file=sys.stderr)
        return 1
