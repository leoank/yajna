"""The protocol context: what `run(ctx)` issues commands on (design doc, sections 2 and 3).

In `render` mode every command is recorded with its values resolved; observations return
their declared default; `ctx.decide` and `ctx.when` record both outcomes. The result is the
IR (`ctx.ir()`), which every backend reads.
"""

from __future__ import annotations

import contextlib
import re

from .ir import IR_VERSION, to_ir
from .params import MaterialRef, Params
from .resources import EQP_RE, LABWARE, LIQUID_CLASSES, MAT_RE, Container, Equipment, Material
from .units import Quantity, UnitError

ACTORS = ("human", "robot", "instrument", "agent")


class ProtocolError(Exception):
    """The protocol cannot be recorded as written; the message says what to change."""


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_") or "group"


class Observation:
    """A value only known at the bench: what `measure`, `check` and `record` return."""

    def __init__(self, ctx: "Protocol", key: str, text: str, default):
        self._ctx, self.key, self.text, self.default = ctx, key, text, default

    def _cond(self, op, value):
        return Condition(self, op, value)

    def __lt__(self, v):
        return self._cond("<", v)

    def __le__(self, v):
        return self._cond("<=", v)

    def __gt__(self, v):
        return self._cond(">", v)

    def __ge__(self, v):
        return self._cond(">=", v)

    def __eq__(self, v):
        return self._cond("==", v)

    def __ne__(self, v):
        return self._cond("!=", v)

    __hash__ = object.__hash__

    def __bool__(self):
        return bool(Condition(self, "is", True))

    def _no_math(self, *_):
        raise ProtocolError(
            f"{self.text} is only known at the bench, so it cannot be computed with when the "
            "protocol is rendered; choose between known values with ctx.decide(...) instead")

    __add__ = __radd__ = __sub__ = __rsub__ = __mul__ = __rmul__ = __truediv__ = __rtruediv__ = _no_math
    __float__ = __int__ = _no_math

    def to_ir(self):
        return {"observation": self.key}


class Condition:
    """`observation <op> value`: decided at the bench, assumed from the default in render."""

    def __init__(self, obs: Observation, op: str, value):
        self.obs, self.op, self.value = obs, op, value

    def expected(self) -> bool:
        d = self.obs.default
        if d is None:
            raise ProtocolError(
                f"{self.obs.text} has no default, so the protocol cannot be rendered: "
                "give the measure, check or record a default=")
        if self.op == "is":
            return bool(d)
        try:
            return {"<": d < self.value, "<=": d <= self.value, ">": d > self.value,
                    ">=": d >= self.value, "==": d == self.value, "!=": d != self.value}[self.op]
        except UnitError as e:
            raise ProtocolError(f"{self.obs.text}: {e}") from None

    def __bool__(self):
        # A plain `if` on an observation: legal, but render can only follow one arm, so
        # the sheet says which one it assumed.
        ctx = self.obs._ctx
        result = self.expected()
        ctx._emit("decide", {"condition": self, "assumed": result}, key=None)
        return result

    def to_ir(self):
        d = {"observation": self.obs.key, "op": self.op}
        if self.op != "is":
            d["value"] = to_ir(self.value)
        return d


class Alternatives:
    """A value chosen at the bench between two known ones (`ctx.decide`)."""

    def __init__(self, decision: str, then, otherwise):
        self.decision, self.then, self.otherwise = decision, then, otherwise

    def _map(self, f):
        return Alternatives(self.decision, f(self.then), f(self.otherwise))

    def __mul__(self, k):
        return self._map(lambda v: v * k)

    __rmul__ = __mul__

    def __truediv__(self, k):
        return self._map(lambda v: v / k)

    def __add__(self, k):
        return self._map(lambda v: v + k)

    __radd__ = __add__

    def __sub__(self, k):
        return self._map(lambda v: v - k)

    def to_ir(self):
        return {"decision": self.decision, "then": to_ir(self.then), "otherwise": to_ir(self.otherwise)}


def _as_list(x) -> list:
    if x is None:
        return []
    return list(x) if isinstance(x, (list, tuple)) else [x]


def _dim(q, dim: str, what: str):
    """`q` must be a quantity of `dim` (or alternatives of one); None passes."""
    if q is None:
        return None
    vals = [q.then, q.otherwise] if isinstance(q, Alternatives) else [q]
    for v in vals:
        if not isinstance(v, Quantity) or v.dim != dim:
            raise ProtocolError(f"{what} must be a {dim.replace('_', ' ')} such as {_EXAMPLE[dim]}, not {v!r}")
    return q


_EXAMPLE = {"volume": "50*ul", "time": "10*minutes", "temperature": "37*C", "force": "4000*xg",
            "speed": "200*rpm", "mass": "2*g"}


class Protocol:
    """The context `run(ctx)` receives."""

    def __init__(self, metadata: dict, decl: dict, values: dict, *, equipment: dict | None = None,
                 notebook=None, mode: str = "render"):
        if mode != "render":
            raise ProtocolError(f"mode {mode!r} is not built yet; only render is (Phase 0)")
        self.metadata, self.mode = metadata, mode
        self.params = Params(decl, values)
        self._decl, self._values = decl, values
        self._bindings = equipment or {}
        self._notebook = notebook
        self.containers_: list[Container] = []
        self.materials_: list[Material] = []
        self.equipment_: list[Equipment] = []
        self.commands: list[dict] = []
        self._groups: list[str] = []
        self._ordinal: dict[tuple, int] = {}
        self._branch: dict | None = None
        self._labels: set[str] = set()
        self._keys: set[str] = set()

    # resources ------------------------------------------------------------------------
    def container(self, kind: str, label: str | None = None, *, max_volume=None, location: str | None = None) -> Container:
        """A container from the labware table (`tube_1.5ml`, `plate_96`, `flask_250ml`, ...),
        or any kind with an explicit `max_volume`."""
        if max_volume is not None:
            max_volume = _dim(max_volume, "volume", "max_volume").value
        label = label or f"{LABWARE.get(kind, (kind,))[0]} {len(self.containers_) + 1}"
        return self._new_container(kind, label, max_volume=max_volume, location=location)

    def tubes(self, n: int, kind: str = "tube_1.5ml", prefix: str = "T") -> list[Container]:
        """`n` containers labelled `T1` ... `Tn`."""
        return [self.container(kind, f"{prefix}{i + 1}") for i in range(n)]

    def _new_container(self, kind, label, **kw) -> Container:
        if label in self._labels:
            raise ProtocolError(f"two containers are labelled {label!r}; labels are how the bench tells them apart")
        self._labels.add(label)
        try:
            c = Container(f"c{len(self.containers_) + 1}", kind, label, **kw)
        except ValueError as e:
            raise ProtocolError(str(e)) from None
        c._new_id = self._new_container
        self.containers_.append(c)
        return c

    def material(self, mat: "str | MaterialRef | None" = None, *, name: str | None = None,
                 liquid_class: str = "aqueous") -> Material:
        """A material: a notebook `MAT` ID, a material parameter, or a plain name (`"SOC"`)."""
        parameter, fallback, kind = None, None, None
        if isinstance(mat, MaterialRef):
            # named by the notebook's title when there is one, else by the parameter's name
            parameter, fallback = mat.parameter, _lower_first(mat.display)
            mat, kind = mat.mat, mat.kind
        if mat is not None and not MAT_RE.match(mat):
            name, mat = name or mat, None  # a plain name
        if mat and self._notebook is not None:
            entry = self._notebook.material(mat)
            if entry is None:
                raise ProtocolError(f"{mat} is not a material in the notebook")
            if kind and entry.get("kind") and entry["kind"] != kind:
                raise ProtocolError(f"{mat} is a {entry['kind']}, but parameter {parameter} wants a {kind}")
            name = name or entry.get("title")
        name = name or fallback
        if not name and not mat:
            raise ProtocolError("ctx.material() needs a MAT ID, a material parameter or a name")
        if liquid_class not in LIQUID_CLASSES:
            raise ProtocolError(f"unknown liquid class {liquid_class!r}: one of {', '.join(LIQUID_CLASSES)}")
        m = Material(f"m{len(self.materials_) + 1}", name or mat, mat, liquid_class, parameter)
        self.materials_.append(m)
        return m

    def equipment(self, eqp: str | None = None, *, kind: str | None = None, name: str | None = None) -> Equipment:
        """Equipment by `EQP` ID, or by kind (`water_bath`); a kind is bound to an ID per run
        (`--equipment water_bath=EQP-0004`), else the page names it without a link."""
        if eqp is None and kind is not None:
            eqp = self._bindings.get(kind)
        if eqp is not None and not EQP_RE.match(eqp):
            raise ProtocolError(f"{eqp!r} is not an equipment ID such as EQP-0004")
        if eqp and self._notebook is not None:
            entry = self._notebook.equipment(eqp)
            if entry is None:
                raise ProtocolError(f"{eqp} is not equipment in the notebook")
            name = name or entry.get("title")
        if not (name or kind or eqp):
            raise ProtocolError("ctx.equipment() needs an EQP ID, a kind or a name")
        e = Equipment(f"e{len(self.equipment_) + 1}", name or (kind.replace("_", " ") if kind else eqp), kind, eqp)
        self.equipment_.append(e)
        return e

    # structure ------------------------------------------------------------------------
    @contextlib.contextmanager
    def group(self, name: str):
        """A named section of the protocol, rendered as a heading."""
        self._groups.append(name)
        try:
            yield
        finally:
            self._groups.pop()

    def _emit(self, op: str, args: dict, *, targets=None, key=None, actor="human", duration=None,
              wait=None, parallel=None, hazard=None, check=None, checkpoint=None, note=None,
              _shared: int | None = None, _suffix: str | None = None) -> dict:
        if actor.split(":")[0] not in ACTORS:
            raise ProtocolError(f"actor {actor!r}: one of {', '.join(ACTORS)}, optionally with :<EQP ID>")
        # Keys (design doc, 5.2): an author key on a command for one container carries the
        # container, so a loop gives `prepare.add_cells[T1]`, `prepare.add_cells[T2]`. A
        # derived key is the group and the ordinal of the unkeyed call within it; one call over
        # several containers shares its ordinal, so later keys do not move with their number.
        prefix = ".".join(slug(g) for g in self._groups)
        label = targets[0].label if targets and len(targets) == 1 and isinstance(targets[0], Container) else None
        if key is not None:
            if not re.fullmatch(r"[a-z0-9_]+", key):
                raise ProtocolError(f"step key {key!r}: lowercase letters, digits and _ only")
            full = f"{prefix}.{key}" if prefix else key
            if label:
                full += f"[{label}]"
            elif _suffix:
                full += _suffix
        else:  # only unkeyed calls count, so keyed steps in a loop do not shift the rest
            n = self._next_ordinal() if _shared is None else _shared
            full = f"{prefix}.{n}" if prefix else str(n)
            if _shared is not None and label:
                full += f"[{label}]"
        if full in self._keys:
            raise ProtocolError(f"step key {full!r} is used twice; keys must name one step")
        self._keys.add(full)
        cmd = {"key": full, "op": op, "group": list(self._groups), "actor": actor}
        if targets:
            cmd["targets"] = [to_ir(t) for t in targets]
        cmd["args"] = {k: to_ir(v) for k, v in args.items() if v is not None}
        if duration is not None:
            cmd["duration"] = to_ir(_dim(duration, "time", "duration"))
        for name, v in (("wait", wait), ("parallel", parallel)):
            if v:
                cmd[name] = True
        for name, v in (("hazard", hazard), ("check", check), ("checkpoint", checkpoint), ("note", note)):
            if v:
                cmd[name] = v
        if self._branch:
            cmd["branch"] = dict(self._branch)
        self.commands.append(cmd)
        return cmd

    def _next_ordinal(self) -> int:
        g = tuple(self._groups)
        self._ordinal[g] = self._ordinal.get(g, 0) + 1
        return self._ordinal[g]

    def _emit_each(self, op: str, args: dict, targets, **opts) -> None:
        """One command per container, as one call: a person does each separately."""
        targets = _as_list(targets)
        if len(targets) <= 1 or opts.get("key"):
            for t in targets or [None]:
                self._emit(op, args, targets=[t] if t else None, **opts)
            return
        n = self._next_ordinal()
        for t in targets:
            self._emit(op, args, targets=[t], _shared=n, **opts)

    # observations and decisions -------------------------------------------------------
    def _observe(self, op, args, text, default, targets=None, **opts) -> Observation:
        cmd = self._emit(op, {**args, "default": default}, targets=targets, **opts)
        return Observation(self, cmd["key"], text, default)

    def measure(self, what: str, *, of=None, default=None, unit: str | None = None,
                equipment: Equipment | None = None, display: str | None = None, **opts) -> Observation:
        """Measure a value (OD600, concentration, pH ...). `default` is what a render assumes."""
        display = display or (what.upper() if re.fullmatch(r"od\d+", what) else what)
        text = f"{display} of {of.label}" if isinstance(of, Container) else display
        return self._observe("measure", {"what": what, "display": display, "unit": unit, "equipment": equipment},
                             text, default, targets=_as_list(of), **opts)

    def check(self, text: str, *, of=None, default: bool = True, **opts) -> Observation:
        """A yes/no condition to look at; usable in `ctx.when`."""
        return self._observe("check", {"text": text}, f"“{text}”", default, targets=_as_list(of), **opts)

    def record(self, what: str, *, default=None, unit: str | None = None, **opts) -> Observation:
        """A free value to write down (a colony count, a lot number)."""
        return self._observe("record", {"what": what, "unit": unit}, what, default, **opts)

    def decide(self, condition, then, otherwise, *, key: str | None = None):
        """`then` if `condition` holds at the bench, else `otherwise`; the sheet lists both."""
        cond = _condition(condition)
        cmd = self._emit("decide", {"condition": cond, "then": then, "otherwise": otherwise}, key=key,
                         _suffix=_container_suffix(cond))
        return Alternatives(cmd["key"], then, otherwise)

    def when(self, condition, then, otherwise=None, *, key: str | None = None):
        """Run the steps in `then()` if `condition` holds at the bench, else `otherwise()`.
        A render records both, each step marked with its arm."""
        cond = _condition(condition)
        if self._branch:
            raise ProtocolError("ctx.when inside another ctx.when is not supported yet")
        cmd = self._emit("decide", {"condition": cond, "branches": True}, key=key, _suffix=_container_suffix(cond))
        for arm, fn in (("then", then), ("otherwise", otherwise)):
            if fn is None:
                continue
            self._branch = {"decision": cmd["key"], "arm": arm}
            try:
                fn()
            finally:
                self._branch = None

    # commands: free text and control --------------------------------------------------
    def step(self, text: str, *, materials=(), equipment=(), volume=None, temperature=None, **opts) -> None:
        """A step in plain words (P7). It renders verbatim; resources make it checkable."""
        self._emit("step", {"text": text, "materials": list(materials) or None,
                            "equipment": list(equipment) or None,
                            "volume": _dim(volume, "volume", "volume"),
                            "temperature": _dim(temperature, "temperature", "temperature")}, **opts)

    def note(self, text: str) -> None:
        """A remark between steps; not a step."""
        self._emit("note", {"text": text})

    def wait(self, duration, *, reason: str | None = None, **opts) -> None:
        self._emit("wait", {"reason": reason}, duration=duration, wait=True, **opts)

    def pause(self, text: str, **opts) -> None:
        """Stop until the person confirms."""
        self._emit("pause", {"text": text}, **opts)

    def safe_stop(self, text: str, **opts) -> None:
        """A safe stopping point, such as "can leave overnight at 4 C"."""
        self._emit("checkpoint", {"text": text}, checkpoint=text, **opts)

    # commands: liquid handling --------------------------------------------------------
    def add(self, material: Material, amount, *, to, mix: str | None = None, on: str | None = None, **opts) -> None:
        """Put `amount` (a volume, or a mass to weigh) of `material` into each of `to`."""
        if not isinstance(material, Material):
            raise ProtocolError(f"add: {material!r} is not a material; load it with ctx.material()")
        if isinstance(amount, Alternatives):
            _dim(amount, "volume", "add amount")
        elif not (isinstance(amount, Quantity) and amount.dim in ("volume", "mass")):
            raise ProtocolError(f"add: the amount must be a volume or a mass, such as 50*ul or 2*g, not {amount!r}")
        self._emit_each("add", {"material": material, "amount": amount, "mix": mix, "on": on}, to, **opts)

    def transfer(self, volume, *, source, to, mix_after: str | None = None, **opts) -> None:
        """Move `volume` from `source` into each of `to`."""
        _dim(volume, "volume", "transfer volume")
        self._emit_each("transfer", {"volume": volume, "source": source, "mix_after": mix_after}, to, **opts)

    def mix(self, target, *, how: str = "pipetting", times: int | None = None, volume=None, **opts) -> None:
        """Mix by `pipetting`, `flicking`, `inverting`, `vortexing` or `swirling`."""
        hows = ("pipetting", "flicking", "inverting", "vortexing", "swirling")
        if how not in hows:
            raise ProtocolError(f"mix how={how!r}: one of {', '.join(hows)}")
        self._emit_each("mix", {"how": how, "times": times, "volume": _dim(volume, "volume", "mix volume")},
                        target, **opts)

    def resuspend(self, target, *, volume=None, material: Material | None = None, how: str = "pipetting", **opts) -> None:
        """Resuspend the pellet in each of `target`, in `volume` of `material` if given."""
        self._emit_each("resuspend", {"volume": _dim(volume, "volume", "resuspend volume"), "material": material,
                                      "how": how}, target, **opts)

    def discard_supernatant(self, target, **opts) -> None:
        self._emit_each("discard_supernatant", {}, target, **opts)

    def serial_dilute(self, source, targets, *, factor: float, volume, diluent: Material, mix: str = "pipetting", **opts) -> None:
        """A `factor`-fold dilution series from `source` through `targets`; `volume` is what
        each tube ends with, so each takes volume/factor and volume - volume/factor of diluent."""
        _dim(volume, "volume", "serial dilution volume")
        if factor <= 1:
            raise ProtocolError(f"serial_dilute: factor must be above 1, not {factor}")
        carry = volume / factor
        self._emit("serial_dilute", {"source": source, "factor": factor, "carry": carry,
                                     "diluent_volume": volume - carry, "diluent": diluent, "mix": mix},
                   targets=_as_list(targets), **opts)

    def plate_cells(self, source, *, volume, onto, spread: bool = True, **opts) -> None:
        """Plate `volume` of `source` onto `onto` (agar plates, a material or containers)."""
        _dim(volume, "volume", "plating volume")
        self._emit_each("plate_cells", {"volume": volume, "onto": onto, "spread": spread}, source, **opts)

    # commands: containers -------------------------------------------------------------
    def label(self, targets, **opts) -> None:
        self._emit("label", {}, targets=_as_list(targets), **opts)

    def move(self, targets, *, to: str, **opts) -> None:
        """Move containers to a place: "the rack", "the 4 C fridge", "the robot deck slot 2"."""
        self._emit("move", {"to": to}, targets=_as_list(targets), **opts)

    def invert(self, targets, *, times: int = 5, **opts) -> None:
        self._emit("invert", {"times": times}, targets=_as_list(targets), **opts)

    def vortex(self, targets, *, duration=None, **opts) -> None:
        self._emit("vortex", {}, targets=_as_list(targets), duration=duration, **opts)

    # commands: physical treatment -----------------------------------------------------
    def set(self, equipment: Equipment, *, temperature=None, speed=None, parallel: bool = True, **opts) -> None:
        """Set an instrument going (a bath to 42 C); by default other steps proceed meanwhile."""
        if temperature is None and speed is None:
            raise ProtocolError("set: give a temperature or a speed")
        self._emit("set", {"equipment": equipment, "temperature": _dim(temperature, "temperature", "temperature"),
                           "speed": _dim(speed, "speed", "speed")}, parallel=parallel, **opts)

    def incubate(self, targets, *, duration, temperature=None, on: str | None = None,
                 equipment: Equipment | None = None, shaking=None, **opts) -> None:
        """Leave `targets` at a temperature (or `on="ice"`) for `duration`. `shaking` is True or
        a speed."""
        if temperature is None and on is None:
            raise ProtocolError("incubate: give a temperature or where (on='ice')")
        if shaking is not None and shaking is not True and shaking is not False:
            _dim(shaking, "speed", "shaking")
        opts.setdefault("wait", True)
        self._emit("incubate", {"temperature": _dim(temperature, "temperature", "temperature"), "on": on,
                                "equipment": equipment, "shaking": shaking or None},
                   targets=_as_list(targets), duration=duration, **opts)

    def centrifuge(self, targets, *, duration, force=None, speed=None, temperature=None,
                   equipment: Equipment | None = None, **opts) -> None:
        if (force is None) == (speed is None):
            raise ProtocolError("centrifuge: give either force (4000*xg) or speed (rpm)")
        opts.setdefault("wait", True)
        self._emit("centrifuge", {"force": _dim(force, "force", "force"), "speed": _dim(speed, "speed", "speed"),
                                  "temperature": _dim(temperature, "temperature", "temperature"),
                                  "equipment": equipment}, targets=_as_list(targets), duration=duration, **opts)

    def heat_shock(self, targets, *, temperature, duration, equipment: Equipment | None = None, **opts) -> None:
        self._emit("heat_shock", {"temperature": _dim(temperature, "temperature", "temperature"),
                                  "equipment": equipment}, targets=_as_list(targets), duration=duration, **opts)

    def thaw(self, targets, *, on: str | None = None, duration=None, **opts) -> None:
        self._emit("thaw", {"on": on}, targets=_as_list(targets), duration=duration, **opts)

    def freeze(self, targets, *, temperature=None, how: str | None = None, **opts) -> None:
        """Freeze, optionally at a temperature or how ("in liquid nitrogen")."""
        self._emit("freeze", {"temperature": _dim(temperature, "temperature", "temperature"), "how": how},
                   targets=_as_list(targets), **opts)

    def thermocycle(self, targets, *, program: list, equipment: Equipment | None = None,
                    name: str | None = None, **opts) -> None:
        """Run a thermocycler program: a list of `(temperature, duration)` holds and
        `ctx.cycles(n, [...])`; a duration of None is an indefinite hold."""
        opts.setdefault("wait", True)
        self._emit("thermocycle", {"program": [_program_item(p) for p in program], "name": name,
                                   "equipment": equipment}, targets=_as_list(targets), **opts)

    @staticmethod
    def cycles(n: int, steps: list) -> dict:
        return {"cycles": n, "steps": [_program_item(s) for s in steps]}

    def image(self, targets, *, equipment: Equipment | None = None, settings: str | None = None, **opts) -> None:
        self._emit("image", {"equipment": equipment, "settings": settings}, targets=_as_list(targets), **opts)

    # output ---------------------------------------------------------------------------
    def ir(self) -> dict:
        """The recorded command stream (design doc, section 2): resolved, JSON-ready."""
        return {
            "ir_version": IR_VERSION,
            "protocol": {k: self.metadata[k] for k in ("id", "name", "version", "author") if k in self.metadata},
            "parameters": {k: (v if not isinstance(v, MaterialRef) else v.mat) for k, v in self._values.items()},
            "resources": {
                "containers": [c.to_ir() for c in self.containers_],
                "materials": [m.to_ir() for m in self.materials_],
                "equipment": [e.to_ir() for e in self.equipment_],
            },
            "commands": self.commands,
        }


def _lower_first(s: str) -> str:
    """"Plasmid" -> "plasmid", but "DNA ladder" stays."""
    return s[0].lower() + s[1:] if s[:2].istitle() or (len(s) > 1 and s[1].islower()) else s


def _container_suffix(cond: Condition) -> str | None:
    """`[T1]` when the observation a decision rests on was keyed by a container."""
    m = re.search(r"\[[^\]]*\]$", cond.obs.key)
    return m.group(0) if m else None


def _condition(c) -> Condition:
    if isinstance(c, Observation):
        return Condition(c, "is", True)
    if isinstance(c, Condition):
        return c
    raise ProtocolError(f"a decision needs an observation or a comparison with one, not {c!r}")


def _program_item(p):
    if isinstance(p, dict) and "cycles" in p:
        return p
    if isinstance(p, tuple) and len(p) == 2:
        temp, dur = p
        _dim(temp, "temperature", "program temperature")
        _dim(dur, "time", "program duration")
        return {"temperature": temp.to_ir(), **({"duration": dur.to_ir()} if dur is not None else {})}
    raise ProtocolError(f"thermocycle program item {p!r}: use (temperature, duration) or ctx.cycles(n, [...])")

