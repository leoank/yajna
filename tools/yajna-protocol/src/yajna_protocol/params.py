"""Runtime parameters, declared in `add_parameters(p)` as in the Opentrons API (section 3.3)."""

from __future__ import annotations

from .resources import MAT_RE


class ParameterError(ValueError):
    pass


class MaterialRef:
    """The value of a material parameter: a `MAT` ID, or none yet (a generic page)."""

    def __init__(self, parameter: str, display: str, mat: str | None, kind: str | None):
        self.parameter, self.display, self.mat, self.kind = parameter, display, mat, kind

    def __repr__(self):
        return f"MaterialRef({self.parameter}={self.mat})"


class Parameters:
    """What `add_parameters(p)` receives."""

    def __init__(self):
        self.decl: dict[str, dict] = {}

    def _add(self, name: str, ptype: str, display: str, default, description: str, **extra):
        if not name.isidentifier():
            raise ParameterError(f"parameter name {name!r} is not a Python identifier")
        if name in self.decl:
            raise ParameterError(f"parameter {name!r} declared twice")
        d = {"type": ptype, "display": display, "default": default, **{k: v for k, v in extra.items() if v is not None}}
        if description:
            d["description"] = description
        self.decl[name] = d
        if default is not None:
            _check(name, d, default)

    def add_int(self, name, display, *, default: int, minimum=None, maximum=None, unit=None, description=""):
        self._add(name, "int", display, default, description, minimum=minimum, maximum=maximum, unit=unit)

    def add_float(self, name, display, *, default: float, minimum=None, maximum=None, unit=None, description=""):
        self._add(name, "float", display, float(default), description, minimum=minimum, maximum=maximum, unit=unit)

    def add_bool(self, name, display, *, default: bool, description=""):
        self._add(name, "bool", display, bool(default), description)

    def add_str(self, name, display, *, default: str, description=""):
        self._add(name, "str", display, default, description)

    def add_choice(self, name, display, *, choices: list, default, description=""):
        self._add(name, "choice", display, default, description, choices=list(choices))

    def add_material(self, name, display, *, kind: str | None = None, default: str | None = None, description=""):
        """A `MAT` reference. With no default, a generic render names it by `display`."""
        self._add(name, "material", display, default, description, kind=kind)

    def bind(self, given: dict[str, str]) -> dict:
        """Values for every declared parameter, from defaults and `given` (strings from the
        command line, or values already typed)."""
        unknown = sorted(set(given) - set(self.decl))
        if unknown:
            raise ParameterError(f"unknown parameter(s): {', '.join(unknown)}; declared: {', '.join(self.decl) or 'none'}")
        out = {}
        for name, d in self.decl.items():
            v = _parse(name, d, given[name]) if name in given else d["default"]
            if v is not None:
                _check(name, d, v)
            out[name] = v
        return out


def _parse(name: str, d: dict, raw):
    if not isinstance(raw, str):
        return raw
    t = d["type"]
    try:
        if t == "int":
            return int(raw)
        if t == "float":
            return float(raw)
    except ValueError:
        raise ParameterError(f"{name}: {raw!r} is not a{'n int' if t == 'int' else ' number'}") from None
    if t == "bool":
        low = raw.lower()
        if low in ("true", "yes", "1"):
            return True
        if low in ("false", "no", "0"):
            return False
        raise ParameterError(f"{name}: {raw!r} is not true or false")
    if t == "choice":
        for c in d["choices"]:
            if str(c) == raw:
                return c
    return raw


def _check(name: str, d: dict, v):
    t = d["type"]
    if t == "int" and (not isinstance(v, int) or isinstance(v, bool)):
        raise ParameterError(f"{name}: {v!r} is not an int")
    if t == "float" and not isinstance(v, (int, float)):
        raise ParameterError(f"{name}: {v!r} is not a number")
    if t in ("int", "float"):
        if "minimum" in d and v < d["minimum"]:
            raise ParameterError(f"{name}: {v} is below the minimum {d['minimum']}")
        if "maximum" in d and v > d["maximum"]:
            raise ParameterError(f"{name}: {v} is above the maximum {d['maximum']}")
    if t == "choice" and v not in d["choices"]:
        raise ParameterError(f"{name}: {v!r} is not one of {', '.join(map(str, d['choices']))}")
    if t == "material" and not (isinstance(v, str) and MAT_RE.match(v)):
        raise ParameterError(f"{name}: {v!r} is not a material ID such as MAT-0042")


class Params:
    """`ctx.params`: bound values by attribute; material parameters as `MaterialRef`."""

    def __init__(self, decl: dict[str, dict], values: dict):
        self._values = {}
        for name, d in decl.items():
            v = values[name]
            if d["type"] == "material":
                v = MaterialRef(name, d["display"], v, d.get("kind"))
            self._values[name] = v

    def __getattr__(self, name):
        try:
            return self._values[name]
        except KeyError:
            raise AttributeError(f"no parameter {name!r}; declare it in add_parameters()") from None
