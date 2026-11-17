"""`yajna-protocol page`: regenerate `## Steps`, keep the rest, and catch a stale render."""

import contextlib
import io
import shutil
import tempfile
import unittest
from pathlib import Path

from yajna_protocol.cli import main

EXAMPLE = Path(__file__).parent.parent / "examples" / "transformation.py"

PAGE = """---
id: PRO-0012
type: protocol
schema_version: 1
title: Heat-shock transformation
version: 4
stage: text               # text | codified
kind: bench               # bench | assembly | compute
status: draft             # draft | active | deprecated
created: 2026-11-17
author: ank
materials: []
equipment: []
tags: []
---

## Purpose
Put a plasmid into E. coli.

## Steps
1. Hand-written step. {duration: 5m}

## Notes
Kept as written.
"""


def run(*argv):
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = main(list(argv))
    return code, out.getvalue(), err.getvalue()


class Page(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.root)
        (self.root / "yajna.toml").write_text('shape = "lab"\n')
        (self.root / "notes/protocols/PRO-0012").mkdir(parents=True)
        shutil.copy(EXAMPLE, self.root / "notes/protocols/PRO-0012/protocol.py")
        self.page = self.root / "notes/protocols/PRO-0012-heat-shock-transformation.md"
        self.page.write_text(PAGE)
        (self.root / "notes/materials").mkdir()
        for mat, title in (("MAT-0210", "Competent DH5alpha"), ("MAT-0042", "SOC medium")):
            (self.root / f"notes/materials/{mat}-x.md").write_text(f"---\nid: {mat}\ntitle: {title}\nkind: strain\n---\n")

    def test_steps_are_regenerated_and_everything_else_kept(self):
        code, _, err = run("page", str(self.page), "--source", str(self.root / "notes/protocols/PRO-0012/protocol.py"))
        self.assertEqual(code, 0, err)
        text = self.page.read_text()
        self.assertIn("stage: codified           # text | codified\nsource: notes/protocols/PRO-0012/protocol.py\n", text)
        self.assertIn("## Purpose\nPut a plasmid into E. coli.\n", text)
        self.assertIn("## Steps\n### Prepare\n1. Set water bath to 42 C.", text)
        self.assertTrue(text.endswith("\n\n## Notes\nKept as written.\n"), text[-200:])
        self.assertNotIn("Hand-written step", text)
        # the second run finds nothing to do, and --check agrees
        self.assertEqual(run("page", str(self.page))[0], 0)
        self.assertEqual(self.page.read_text(), text)
        self.assertEqual(run("page", str(self.page), "--check")[0], 0)

    def test_check_fails_on_a_stale_page_and_changes_nothing(self):
        run("page", str(self.page), "--source", str(self.root / "notes/protocols/PRO-0012/protocol.py"))
        stale = self.page.read_text().replace("for 30 min", "for 20 min")
        self.page.write_text(stale)
        code, _, err = run("page", str(self.page), "--check")
        self.assertEqual(code, 1)
        self.assertIn("stale", err)
        self.assertEqual(self.page.read_text(), stale)

    def test_version_and_id_must_match_the_code(self):
        self.page.write_text(PAGE.replace("version: 4", "version: 3"))
        code, _, err = run("page", str(self.page), "--source", str(self.root / "notes/protocols/PRO-0012/protocol.py"))
        self.assertEqual(code, 1)
        self.assertIn("bump both together", err)
        self.page.write_text(PAGE.replace("id: PRO-0012", "id: PRO-0013"))
        code, _, err = run("page", str(self.page), "--source", str(self.root / "notes/protocols/PRO-0012/protocol.py"))
        self.assertIn("metadata says PRO-0012", err)

    def test_materials_are_checked_against_the_notebook(self):
        (self.root / "notes/materials/MAT-0042-x.md").unlink()
        code, _, err = run("page", str(self.page), "--source", str(self.root / "notes/protocols/PRO-0012/protocol.py"))
        self.assertEqual(code, 1)
        self.assertIn("MAT-0042 is not a material in the notebook", err)


class ExampleLab(unittest.TestCase):
    """examples/lab is the guide's worked example: its codified page must match its code."""

    def test_the_example_page_is_current(self):
        lab = Path(__file__).parent.parent / "examples" / "lab"
        page = next((lab / "notes/protocols").glob("PRO-0001-*.md"))
        code, _, err = run("page", str(page), "--check")
        self.assertEqual(code, 0, err)


if __name__ == "__main__":
    unittest.main()
