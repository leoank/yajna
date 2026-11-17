"""The intermediate representation: JSON every backend reads (ADR-0037).

A value in a command's `args` is one of: a JSON scalar; a quantity `{"value", "unit"}`; a
resource reference `{"ref": "c1"}`; an observation `{"observation": <key>}`; a condition
`{"observation", "op", "value"}`; a decided value `{"decision", "then", "otherwise"}`; or
a list or mapping of these. `schema/ir.json` in this package is the schema.
"""

from __future__ import annotations

IR_VERSION = 1


def to_ir(v):
    """A protocol-side value (quantity, resource, observation, ...) as IR."""
    if v is None or isinstance(v, (bool, int, float, str)):
        return v
    if hasattr(v, "to_ir") and not hasattr(v, "ref"):
        return v.to_ir()
    if hasattr(v, "ref"):
        return v.ref()
    if isinstance(v, (list, tuple)):
        return [to_ir(x) for x in v]
    if isinstance(v, dict):
        return {k: to_ir(x) for k, x in v.items() if x is not None}
    raise TypeError(f"{v!r} cannot go into a protocol command; use a quantity, resource, number or text")
