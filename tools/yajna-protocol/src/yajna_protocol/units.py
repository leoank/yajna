"""Typed quantities: a value in the base unit of one dimension.

`50 * ul` is a volume of 50 uL; `2 * ml + 500 * ul` is 2500 uL; adding a volume to a time
is an error. Quantities render the way a person says them (`950 uL`, `1.9 mL`, `1 h 30 min`)
and serialise to the IR as `{"value": <base units>, "unit": <base unit>}` (ADR-0037).
"""

from __future__ import annotations

import math

# dimension -> base unit, the unit every value is stored in
BASE = {
    "volume": "uL",
    "mass": "mg",
    "time": "s",
    "temperature": "C",
    "force": "xg",
    "speed": "rpm",
    "molar": "nM",
    "mass_concentration": "ug/mL",
    "percent": "%",
    "fold": "x",
}
DIMENSION = {unit: dim for dim, unit in BASE.items()}


class UnitError(TypeError):
    """Quantities of different dimensions were combined, or a number where a unit belongs."""


def fmt_number(v: float) -> str:
    """A number with four significant digits at most and no exponent: 950, 1.9, 0.3333."""
    if v == 0:
        return "0"
    digits = max(0, 3 - math.floor(math.log10(abs(v))))
    s = f"{round(v, digits):.{digits}f}"
    if "." in s:
        s = s.rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class Quantity:
    """A value in the base unit of `dim`. `label` names a duration such as "overnight"."""

    __slots__ = ("value", "dim", "label")

    def __init__(self, value: float, dim: str, label: str | None = None):
        if dim not in BASE:
            raise UnitError(f"unknown dimension {dim!r}")
        self.value = float(value)
        self.dim = dim
        self.label = label

    # arithmetic -----------------------------------------------------------------------
    def _same(self, other, op: str) -> "Quantity":
        if not isinstance(other, Quantity):
            raise UnitError(f"cannot {op} {self} and {other!r}: give the number a unit")
        if other.dim != self.dim:
            raise UnitError(f"cannot {op} {self} ({self.dim}) and {other} ({other.dim})")
        return other

    def __add__(self, other):
        if other == 0 and not isinstance(other, Quantity):
            return self  # sum() starts from 0
        o = self._same(other, "add")
        return Quantity(self.value + o.value, self.dim)

    __radd__ = __add__

    def __sub__(self, other):
        o = self._same(other, "subtract")
        return Quantity(self.value - o.value, self.dim)

    def __mul__(self, k):
        if isinstance(k, Quantity) or not isinstance(k, (int, float)):
            return NotImplemented
        return Quantity(self.value * k, self.dim)

    __rmul__ = __mul__

    def __truediv__(self, k):
        if isinstance(k, Quantity):
            o = self._same(k, "divide")
            return self.value / o.value
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Quantity(self.value / k, self.dim)

    def __neg__(self):
        return Quantity(-self.value, self.dim)

    # comparison -----------------------------------------------------------------------
    def _cmp(self, other):
        return self._same(other, "compare").value

    def __lt__(self, other):
        return self.value < self._cmp(other)

    def __le__(self, other):
        return self.value <= self._cmp(other)

    def __gt__(self, other):
        return self.value > self._cmp(other)

    def __ge__(self, other):
        return self.value >= self._cmp(other)

    def __eq__(self, other):
        return isinstance(other, Quantity) and other.dim == self.dim and other.value == self.value

    def __hash__(self):
        return hash((self.value, self.dim))

    # conversion and display -----------------------------------------------------------
    def to(self, unit: "Unit") -> float:
        """The value as a number of `unit`: `(1.5 * ml).to(ul) == 1500`."""
        if unit.dim != self.dim:
            raise UnitError(f"cannot express {self} in {unit.symbol}")
        return self.value / unit.factor

    def __str__(self):
        return human(self.to_ir())

    def __repr__(self):
        return f"Quantity({self.value!r}, {self.dim!r}{', ' + repr(self.label) if self.label else ''})"

    def to_ir(self) -> dict:
        d = {"value": self.value, "unit": BASE[self.dim]}
        if self.label:
            d["label"] = self.label
        return d

    @classmethod
    def from_ir(cls, d: dict) -> "Quantity":
        return cls(d["value"], DIMENSION[d["unit"]], d.get("label"))


class Unit:
    """A unit to multiply numbers by: `50 * ul`."""

    __slots__ = ("symbol", "dim", "factor")

    def __init__(self, symbol: str, dim: str, factor: float = 1.0):
        self.symbol, self.dim, self.factor = symbol, dim, factor

    def __rmul__(self, k):
        if isinstance(k, (int, float)) and not isinstance(k, bool):
            return Quantity(k * self.factor, self.dim)
        return NotImplemented

    __mul__ = __rmul__

    def __repr__(self):
        return f"Unit({self.symbol!r})"


ul = Unit("uL", "volume")
ml = Unit("mL", "volume", 1e3)
L = Unit("L", "volume", 1e6)
ug = Unit("ug", "mass", 1e-3)
mg = Unit("mg", "mass")
g = Unit("g", "mass", 1e3)
seconds = Unit("s", "time")
minutes = Unit("min", "time", 60)
hours = Unit("h", "time", 3600)
days = Unit("d", "time", 86400)
C = Unit("C", "temperature")
xg = Unit("x g", "force")
rpm = Unit("rpm", "speed")
nM = Unit("nM", "molar")
uM = Unit("uM", "molar", 1e3)
mM = Unit("mM", "molar", 1e6)
M = Unit("M", "molar", 1e9)
ug_per_ml = Unit("ug/mL", "mass_concentration")
ng_per_ul = ug_per_ml  # the same quantity: 1 ng/uL is 1 ug/mL
mg_per_ml = Unit("mg/mL", "mass_concentration", 1e3)
percent = Unit("%", "percent")
X = Unit("x", "fold")  # stock strength: 1 * X is "1x"

#: A named duration: 16 h for schedules and attributes, "overnight" on the page.
overnight = Quantity(16 * 3600, "time", label="overnight")


# rendering from the IR form; the renderer sees only `{"value", "unit"}` dicts ---------

def _scaled(v: float, steps: list[tuple[float, str]]) -> str:
    """`v` in the largest unit of `steps` (factor, symbol; ascending) it is at least 1 of."""
    factor, symbol = steps[0]
    for f, s in steps:
        if abs(v) >= f:
            factor, symbol = f, s
    return f"{fmt_number(v / factor)} {symbol}"


def _duration_human(s: float) -> str:
    if s < 60:
        return f"{fmt_number(s)} s"
    s = round(s)
    if s < 3600:
        m, r = divmod(s, 60)
        return f"{m} min" + (f" {r} s" if r else "")
    if s >= 2 * 86400 and s % 86400 == 0:
        return f"{s // 86400} d"
    h, r = divmod(s, 3600)
    m = r // 60
    return f"{h} h" + (f" {m} min" if m else "")


def human(q: dict) -> str:
    """A quantity from the IR as a person says it."""
    if q.get("label"):
        return q["label"]
    v, unit = q["value"], q["unit"]
    dim = DIMENSION[unit]
    if dim == "volume":
        return _scaled(v, [(1, "uL"), (1e3, "mL"), (1e6, "L")]) if v >= 1 or v == 0 else f"{fmt_number(v)} uL"
    if dim == "mass":
        return _scaled(v, [(1e-3, "ug"), (1, "mg"), (1e3, "g")])
    if dim == "time":
        return _duration_human(v)
    if dim == "temperature":
        return f"{fmt_number(v)} C"
    if dim == "force":
        return f"{fmt_number(v)} x g"
    if dim == "molar":
        return _scaled(v, [(1, "nM"), (1e3, "uM"), (1e6, "mM"), (1e9, "M")])
    if dim == "mass_concentration":
        return _scaled(v, [(1, "ug/mL"), (1e3, "mg/mL")]) if v >= 1 else f"{fmt_number(v)} ug/mL"
    if dim == "percent":
        return f"{fmt_number(v)}%"
    if dim == "fold":
        return f"{fmt_number(v)}x"
    return f"{fmt_number(v)} {unit}"


def duration_attr(q: dict) -> str:
    """A duration in the attribute form `schema/step.json` accepts: `45s`, `30m`, `1h30m`."""
    s = round(q["value"])
    h, r = divmod(s, 3600)
    m, sec = divmod(r, 60)
    out = (f"{h}h" if h else "") + (f"{m}m" if m else "") + (f"{sec}s" if sec else "")
    return out or "0s"


def compact(q: dict) -> str:
    """A quantity for an attribute block: `50uL`, `42C`; durations as `duration_attr`."""
    if DIMENSION[q["unit"]] == "time":
        return duration_attr(q)
    return human({k: v for k, v in q.items() if k != "label"}).replace(" ", "")
