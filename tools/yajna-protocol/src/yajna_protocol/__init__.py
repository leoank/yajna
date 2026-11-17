"""Protocols as code for humans, robots and everything in between.

A protocol is a Python file with `metadata`, `requirements = {"yajna_protocol": "1"}`, an
optional `add_parameters(p)` and `run(ctx)`; running it records a command stream (the IR)
that renders into a `PRO` page's `## Steps`. Design: `docs/protocol-framework.md`;
decision: ADR-0037.
"""

from .context import Protocol, ProtocolError
from .units import (
    C, L, M, X, Quantity, UnitError, days, g, hours, mM, mg, mg_per_ml, minutes, ml, nM, ng_per_ul,
    overnight, percent, rpm, seconds, uM, ug, ug_per_ml, ul, xg,
)

__all__ = [
    "Protocol", "ProtocolError", "Quantity", "UnitError",
    "ul", "ml", "L", "ug", "mg", "g", "seconds", "minutes", "hours", "days", "overnight",
    "C", "xg", "rpm", "nM", "uM", "mM", "M", "ug_per_ml", "ng_per_ul", "mg_per_ml", "percent", "X",
]
