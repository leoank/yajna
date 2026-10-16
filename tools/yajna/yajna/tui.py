"""Interactive prompts with completion. Used when a command is run without its arguments."""

from __future__ import annotations

import json
import os
import shlex
import subprocess
from pathlib import Path

from prompt_toolkit import prompt as _prompt
from prompt_toolkit.completion import Completer, Completion, WordCompleter
from prompt_toolkit.validation import ValidationError, Validator

from .vault import ALIASES, ENTITIES, PROJECT_SCOPED, Vault


def ask(message: str, completer: Completer | None = None, validator: Validator | None = None,
        default: str = "") -> str:
    """One prompt. Tests replace this function to script answers."""
    return _prompt(f"{message}: ", completer=completer, validator=validator, default=default,
                   complete_while_typing=True).strip()


# --- completers ------------------------------------------------------------------------

class IdCompleter(Completer):
    """Complete entity IDs by ID or title; the title shows as completion meta."""

    def __init__(self, vault: Vault, prefixes: tuple[str, ...] = (), project: str | None = None,
                 wrap: bool = False):
        self.entries: list[tuple[str, str]] = []
        for page in vault.pages():
            if not page.id or (prefixes and not page.id.startswith(prefixes)):
                continue
            if project and page.meta.get("project") not in (None, project):
                continue
            self.entries.append((page.id, str(page.meta.get("title") or "")))
        self.wrap = wrap

    def get_completions(self, document, complete_event):
        word = document.get_word_before_cursor(WORD=True)
        stripped = word.lstrip("[")
        if self.wrap and not word.startswith("[["):
            return
        needle = stripped.lower()
        for ident, title in self.entries:
            if needle in ident.lower() or needle in title.lower():
                text = f"[[{ident}]]" if self.wrap else ident
                yield Completion(text, start_position=-len(word), display=ident, display_meta=title)


class ExistsValidator(Validator):
    def __init__(self, ids: set[str], required: bool):
        self.ids, self.required = ids, required

    def validate(self, document):
        text = document.text.strip()
        if not text:
            if self.required:
                raise ValidationError(message="required")
            return
        if text not in self.ids:
            raise ValidationError(message=f"{text} does not exist", cursor_position=len(document.text))


class NonEmpty(Validator):
    def validate(self, document):
        if not document.text.strip():
            raise ValidationError(message="required")


def _enum(vault: Vault, schema: str, field: str) -> list[str]:
    data = json.loads((vault.schemas / f"{schema}.json").read_text())
    return [v for v in data["properties"][field]["enum"] if isinstance(v, str)]


# --- flows -----------------------------------------------------------------------------

def new(vault: Vault) -> Path:
    from .cli import create

    types = list(ENTITIES) + ["agent"]
    etype = ask("type", WordCompleter(types, ignore_case=True),
                Validator.from_callable(lambda t: t.lower() in ALIASES or t.lower() in ENTITIES,
                                        error_message="unknown type"))
    etype = ALIASES.get(etype.lower(), etype.lower())

    title = None
    if etype != "run":
        title = ask("title", validator=NonEmpty())

    ids = {p.id for p in vault.pages() if p.id}
    project = experiment = None
    if etype == "run":
        experiment = ask("experiment (optional)", IdCompleter(vault, ("EXP",)),
                         ExistsValidator(ids, required=False)) or None
    if etype in PROJECT_SCOPED and not experiment:
        project = ask("project", IdCompleter(vault, ("PRJ",)), ExistsValidator(ids, required=True))
    elif etype == "build":
        project = ask("project (optional)", IdCompleter(vault, ("PRJ",)),
                      ExistsValidator(ids, required=False)) or None

    kind = None
    if etype in ("run", "material"):
        kinds = _enum(vault, etype, "kind")
        kind = ask("kind", WordCompleter(kinds), Validator.from_callable(
            lambda k: k in kinds, error_message=f"one of {', '.join(kinds)}"),
            default=kinds[0] if etype == "run" else "reagent")

    code = False
    if etype == "project":
        code = ask("scaffold projects/<slug>/ with a flake? (y/N)").lower().startswith("y")

    path = create(vault, etype, title, project, experiment, kind, code)
    _offer_editor(path)
    return path


def log_entry(vault: Vault) -> str:
    """Prompt for one log line; `[[` completes entity IDs."""
    return ask("log", IdCompleter(vault, wrap=True), NonEmpty())


def menu(vault: Vault, parser) -> int:
    """Loop: pick a command, run it with prompts, until quit."""
    choices = ["new", "log", "ref", "tasks", "validate", "quit"]
    print("yajna: new, log, ref, tasks, validate, quit (tab completes)")
    while True:
        try:
            choice = ask("yajna", WordCompleter(choices), Validator.from_callable(
                lambda c: c.split(" ")[0] in choices, error_message="unknown command"))
        except (EOFError, KeyboardInterrupt):
            return 0
        if choice == "quit":
            return 0
        try:
            args = parser.parse_args(shlex.split(choice))
            if args.cmd == "log" and not args.text:
                args.text = [log_entry(vault)]
            args.fn(vault, args)
        except SystemExit as e:  # argparse errors and command failures stay in the loop
            if e.code not in (0, None):
                print(e.code if isinstance(e.code, str) else "")
        except (EOFError, KeyboardInterrupt):
            print()


def _offer_editor(path: Path) -> None:
    editor = os.environ.get("EDITOR")
    if not editor:
        return
    if ask(f"open in {editor}? [y/N]").lower().startswith("y"):
        subprocess.call([*shlex.split(editor), str(path)])
