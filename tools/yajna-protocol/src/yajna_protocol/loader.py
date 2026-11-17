"""Load a protocol file and run it against a context."""

from __future__ import annotations

import importlib.util
import itertools
import sys
from pathlib import Path

from .context import Protocol, ProtocolError
from .params import ParameterError, Parameters

SUPPORTED = {"1"}
_counter = itertools.count()


def load(path: Path):
    """The protocol module at `path`, checked for `metadata`, `requirements` and `run`."""
    name = f"_yajna_protocol_{next(_counter)}"
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ProtocolError(f"{path}: not a Python file")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    try:
        spec.loader.exec_module(module)
    finally:
        sys.modules.pop(name, None)
    req = getattr(module, "requirements", None)
    level = req.get("yajna_protocol") if isinstance(req, dict) else None
    if level not in SUPPORTED:
        raise ProtocolError(
            f"{path}: requirements = {{\"yajna_protocol\": \"1\"}} is required (found {req!r}); "
            f"this version supports {', '.join(sorted(SUPPORTED))}")
    meta = getattr(module, "metadata", None)
    if not isinstance(meta, dict) or "name" not in meta:
        raise ProtocolError(f"{path}: metadata = {{\"name\": ..., \"version\": ...}} is required")
    if not isinstance(meta.get("version", 1), int):
        raise ProtocolError(f"{path}: metadata version must be an integer")
    if not callable(getattr(module, "run", None)):
        raise ProtocolError(f"{path}: no run(ctx) function")
    return module


def record(path: Path, params: dict | None = None, *, equipment: dict | None = None, notebook=None) -> dict:
    """Run the protocol at `path` in render mode and return its IR."""
    module = load(path)
    p = Parameters()
    try:
        if hasattr(module, "add_parameters"):
            module.add_parameters(p)
        values = p.bind(params or {})
    except ParameterError as e:
        raise ProtocolError(f"{path}: {e}") from None
    ctx = Protocol(module.metadata, p.decl, values, equipment=equipment, notebook=notebook)
    module.run(ctx)
    ir = ctx.ir()
    ir["parameter_declarations"] = p.decl
    return ir
