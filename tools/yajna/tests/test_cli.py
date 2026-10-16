"""End-to-end checks of the CLI against a throwaway copy of the repo's templates and schemas."""

import io
import os
import shutil
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

from yajna.cli import main

REPO = Path(__file__).resolve().parents[3]


class CliTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        shutil.copytree(REPO / "templates", self.tmp / "templates")
        shutil.copytree(REPO / "schema", self.tmp / "schema")
        for d in ("projects", "protocols", "materials", "equipment", "builds", "agents", "log", "references"):
            (self.tmp / "lab" / d).mkdir(parents=True)
        (self.tmp / "lab/counters.yaml").write_text("PRJ: 0\nEXP: 0\nPRO: 0\nMAT: 0\nANA: 0\nEQP: 0\nBLD: 0\n")
        (self.tmp / "lab/tasks.md").write_text("# Tasks\n\n- [ ] \n")
        (self.tmp / "yajna.toml").write_text('author = "tester"\nvault = "lab"\ntimezone = "UTC"\n')
        for p in self.tmp.rglob("*"):  # copies from the Nix store arrive read-only
            p.chmod(0o755 if p.is_dir() else 0o644)
        self.editor = os.environ.pop("EDITOR", None)  # the interactive flow offers to open one

    def tearDown(self):
        shutil.rmtree(self.tmp)
        if self.editor is not None:
            os.environ["EDITOR"] = self.editor

    def run_cli(self, *argv, stdin=None) -> tuple[int, str]:
        out = io.StringIO()
        import sys
        old = sys.stdin
        if stdin is not None:
            sys.stdin = io.StringIO(stdin)
        try:
            with redirect_stdout(out):
                code = main(["--root", str(self.tmp), *argv])
        except SystemExit as e:
            code = e.code if isinstance(e.code, int) else 1
        finally:
            sys.stdin = old
        return code, out.getvalue()

    def test_new_log_result_tasks_validate(self):
        code, out = self.run_cli("new", "project", "Archaeal division")
        self.assertEqual(code, 0)
        self.assertIn("PRJ-0001-archaeal-division/README.md", out)

        code, out = self.run_cli("new", "experiment", "ESCRT timing", "--project", "PRJ-0001")
        self.assertEqual(code, 0)
        self.assertIn("experiments/EXP-0001-escrt-timing.md", out)

        code, out = self.run_cli("new", "material", "Strain xyz", "--kind", "strain")
        self.assertEqual(code, 0)
        code, out = self.run_cli("new", "protocol", "Transformation")
        self.assertEqual(code, 0)
        pro = self.tmp / out.strip()
        pro.write_text(pro.read_text().replace(
            "1. First step. {duration: 5m}\n2. \n",
            "1. Thaw [[MAT-0001]] on ice. {duration: 15m, materials: [MAT-0001], check: \"tube on ice\"}\n"
            "2. Spin at 4000 g. {duration: 10m, wait: true}\n"
            "3. Plain step with no attributes.\n",
        ))

        code, out = self.run_cli("new", "run", "--experiment", "EXP-0001")
        self.assertEqual(code, 0)
        self.assertRegex(out, r"runs/RUN-\d{8}-[a-z2-7]{4}\.md")

        code, out = self.run_cli("log", "Started", "induction", "for", "[[EXP-0001]]", "--time", "09:10")
        self.assertEqual(code, 0)
        day = next((self.tmp / "lab" / "log").rglob("*.md"))
        self.assertIn("- 09:10 Started induction for [[EXP-0001]]\n", day.read_text())

        output = "training...\n===RESULT=== {\"loss\": 0.42, \"steps\": 3000, \"tag\": \"baseline\"}\n"
        code, out = self.run_cli("result", "--experiment", "EXP-0001", stdin=output)
        self.assertEqual(code, 0, out)
        tsv = self.tmp / "lab/projects/PRJ-0001-archaeal-division/experiments/EXP-0001/results.tsv"
        self.assertTrue(tsv.is_file())
        output2 = "===RESULT=== {\"loss\": 0.40, \"steps\": 3000, \"lr\": 0.001}\n"
        code, out = self.run_cli("result", "--experiment", "EXP-0001", stdin=output2)
        self.assertEqual(code, 0, out)
        lines = tsv.read_text().splitlines()
        self.assertEqual(lines[0].split("\t"), ["run", "finished", "loss", "steps", "tag", "lr"])
        self.assertEqual(len(lines), 3)

        code, out = self.run_cli("tasks")
        self.assertEqual(code, 0)
        self.assertNotIn("counters", out)

        code, out = self.run_cli("validate")
        self.assertEqual(code, 0, out)
        self.assertIn("valid", out)

    def test_title_with_colon_and_unfinished_agent_page_validate(self):
        self.run_cli("new", "project", "P")
        code, out = self.run_cli("new", "experiment", "Hook: hold and answer", "--project", "PRJ-0001")
        self.assertEqual(code, 0, out)
        self.assertIn('title: "Hook: hold and answer"\n', (self.tmp / out.strip()).read_text())
        code, out = self.run_cli("new", "agent", "Spike session")
        self.assertEqual(code, 0, out)
        self.assertIn("finished: null\n", (self.tmp / out.strip()).read_text())
        code, out = self.run_cli("validate")
        self.assertEqual(code, 0, out)

    def test_validate_catches_problems(self):
        self.run_cli("new", "project", "P")
        code, out = self.run_cli("new", "experiment", "E", "--project", "PRJ-0001")
        exp = self.tmp / out.strip()
        exp.write_text(exp.read_text().replace("status: planned", "status: bogus")
                       .replace("materials: []", "materials: [MAT-0099]"))
        code, out = self.run_cli("new", "protocol", "Bad steps")
        pro = self.tmp / out.strip()
        pro.write_text(pro.read_text().replace("1. First step. {duration: 5m}\n2. \n",
                                               "1. Ok. {duration: 5m}\n3. Skipped number. {duration: nonsense}\n"))
        code, out = self.run_cli("validate")
        self.assertEqual(code, 1)
        self.assertIn("status: 'bogus' is not one of", out)
        self.assertIn("link to unknown id MAT-0099", out)
        self.assertIn("step numbering: expected 2, found 3", out)
        self.assertIn("duration", out)

    def test_interactive_new(self):
        from yajna import tui
        self.run_cli("new", "project", "P")
        answers = iter(["experiment", "Interactive one", "PRJ-0001"])
        tui.ask = lambda message, completer=None, validator=None, default="": next(answers)
        code, out = self.run_cli("new")
        self.assertEqual(code, 0, out)
        self.assertIn("experiments/EXP-0001-interactive-one.md", out)
        answers = iter(["run", "EXP-0001", "compute"])
        code, out = self.run_cli("new")
        self.assertEqual(code, 0, out)
        self.assertIn("runs/RUN-", out)
        run = self.tmp / out.strip()
        self.assertIn("kind: compute", run.read_text())
        self.assertIn("experiment: EXP-0001", run.read_text())

    def test_interactive_project_with_code(self):
        from yajna import tui
        answers = iter(["project", "Toy model", "y"])
        tui.ask = lambda message, completer=None, validator=None, default="": next(answers)
        code, out = self.run_cli("new")
        self.assertEqual(code, 0, out)
        self.assertIn("PRJ-0001-toy-model/README.md", out)
        self.assertIn("code: projects/toy-model", (self.tmp / out.strip()).read_text())
        self.assertTrue((self.tmp / "projects/toy-model/flake.nix").is_file())

    def test_id_completer(self):
        from prompt_toolkit.document import Document
        from yajna import tui
        self.run_cli("new", "project", "Archaeal division")
        vault = __import__("yajna.vault", fromlist=["Vault"]).Vault(self.tmp)
        comps = list(tui.IdCompleter(vault, wrap=True).get_completions(Document("see [[arch"), None))
        self.assertEqual([c.text for c in comps], ["[[PRJ-0001]]"])
        comps = list(tui.IdCompleter(vault, ("EXP",)).get_completions(Document("PRJ"), None))
        self.assertEqual(comps, [])

    def test_ref_and_citation_check(self):
        (self.tmp / "references").mkdir()
        (self.tmp / "references/library.bib").write_text(
            "@article{shih2015cloning,\n  title = {Cloning on a {Chip}},\n  author = {Shih, Steve and Goyal, Garima},\n"
            "  year = {2015},\n  doi = {10.1021/acs.analchem.5b01905},\n  journal = {Analytical Chemistry}\n}\n")
        (self.tmp / "yajna.toml").write_text(
            'author = "tester"\nvault = "lab"\ntimezone = "UTC"\nbibliography = "references/library.bib"\n')
        code, out = self.run_cli("ref", "shih2015cloning", "--note")
        self.assertEqual(code, 0, out)
        self.assertIn("Cloning on a Chip", out)
        note = self.tmp / "lab/references/shih2015cloning.md"
        self.assertTrue(note.is_file())
        self.assertIn("doi: 10.1021/acs.analchem.5b01905", note.read_text())
        self.assertIn("year: 2015", note.read_text())
        note.write_text(note.read_text().replace("[[PRJ-0001]]", "") + "\nBuilds on [@shih2015cloning] and @nobody2020.\n")
        code, out = self.run_cli("validate")
        self.assertEqual(code, 1)
        self.assertIn("citation @nobody2020 not in references/library.bib", out)
        self.assertNotIn("shih2015cloning not in", out)
        code, out = self.run_cli("ref", "nobody2020")
        self.assertEqual(code, 1)

    def test_project_code_scaffold(self):
        code, out = self.run_cli("new", "project", "Toy model", "--code")
        self.assertEqual(code, 0, out)
        page = self.tmp / out.strip()
        self.assertIn("code: projects/toy-model", page.read_text())
        self.assertTrue((self.tmp / "projects/toy-model/flake.nix").is_file())
        readme = (self.tmp / "projects/toy-model/README.md").read_text()
        self.assertIn("[[PRJ-0001]]", readme)
        self.assertIn("lab/projects/PRJ-0001-toy-model/README.md", readme)
        code, out = self.run_cli("validate")
        self.assertEqual(code, 0, out)
        shutil.rmtree(self.tmp / "projects/toy-model")
        code, out = self.run_cli("validate")
        self.assertEqual(code, 1)
        self.assertIn("code directory projects/toy-model does not exist", out)
        code, out = self.run_cli("new", "protocol", "P", "--code")
        self.assertEqual(code, 1)

    def test_missing_project_is_an_error(self):
        code, out = self.run_cli("new", "experiment", "E", "--project", "PRJ-0042")
        self.assertEqual(code, 1)


if __name__ == "__main__":
    unittest.main()
