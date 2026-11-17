"""IR in, the `## Steps` convention out (design doc, section 5.4; architecture, section 4).

Deterministic templates, one per command; numbers resolved; no language model. The
renderer reads only the IR, so it renders a pinned `protocol.json` as well as source.
Verbosity is `expert` only for now: one line per step, repeated steps over several
containers collapsed into one line.
"""

from __future__ import annotations

import json
import re

from .resources import LABWARE, LIQUID_CLASSES
from .units import compact, fmt_number, human

# commands done once per container, which `expert` collapses when consecutive
PER_TARGET = {"add", "transfer", "mix", "resuspend", "discard_supernatant", "plate_cells"}
ATTR_ORDER = ("duration", "wait", "parallel", "materials", "equipment", "volume", "temp", "measure",
              "record", "check", "hazard", "checkpoint", "actor", "key", "keys")
_PLAIN = re.compile(r"^[A-Za-z0-9_.@/+-]+$")
_YAML_WORDS = {"true", "false", "yes", "no", "on", "off", "null", "~", "y", "n"}
_MIX = {"flick": "flicking", "flicking": "flicking", "pipette": "pipetting up and down",
        "pipetting": "pipetting up and down", "invert": "inverting", "inverting": "inverting",
        "vortex": "vortexing", "vortexing": "vortexing", "swirl": "swirling", "swirling": "swirling"}
_OPS = {"<": "is below", "<=": "is at most", ">": "is above", ">=": "is at least", "==": "is", "!=": "is not"}


class RenderError(ValueError):
    pass


def yaml_scalar(s: str) -> str:
    """A string as a YAML flow scalar: plain when that is safe, else double-quoted."""
    if _PLAIN.match(s) and s.lower() not in _YAML_WORDS and not re.fullmatch(r"[-+]?[0-9._]+", s):
        return s
    return json.dumps(s, ensure_ascii=False)


def attr_block(attrs: dict) -> str:
    parts = []
    for k in ATTR_ORDER:
        if k not in attrs:
            continue
        v = attrs[k]
        if v is True:
            parts.append(f"{k}: true")
        elif isinstance(v, list):
            parts.append(f"{k}: [{', '.join(yaml_scalar(x) for x in v)}]")
        else:
            parts.append(f"{k}: {yaml_scalar(str(v))}")
    return "{" + ", ".join(parts) + "}"


def _steps_ref(numbers: list[int]) -> str:
    if not numbers:
        return ""
    if len(numbers) == 1:
        return f"step {numbers[0]}"
    if numbers == list(range(numbers[0], numbers[-1] + 1)):
        return f"steps {numbers[0]} to {numbers[-1]}"
    return "steps " + ", ".join(map(str, numbers))


class Renderer:
    def __init__(self, ir: dict):
        if ir.get("ir_version") != 1:
            raise RenderError(f"IR version {ir.get('ir_version')!r} is not one this renderer reads (1)")
        self.ir = ir
        res = ir["resources"]
        self.res = {r["id"]: ("container", r) for r in res["containers"]}
        self.res.update({r["id"]: ("material", r) for r in res["materials"]})
        self.res.update({r["id"]: ("equipment", r) for r in res["equipment"]})
        self.commands = ir["commands"]
        self.by_key = {c["key"]: c for c in self.commands}
        self.number: dict[str, int] = {}

    # values -----------------------------------------------------------------------------
    def name(self, ref: dict) -> str:
        kind, r = self.res[ref["ref"]]
        if kind == "container":
            return r["label"]
        link = r.get("mat") or r.get("eqp")
        if link and r["name"] != link:
            return f"{r['name']} [[{link}]]"
        return f"[[{link}]]" if link else r["name"]

    def names(self, refs: list[dict]) -> str:
        return ", ".join(self.name(r) for r in refs)

    def val(self, v) -> str:
        if isinstance(v, dict):
            if "ref" in v:
                return self.name(v)
            if "unit" in v:
                return human(v)
            if "decision" in v:
                return f"{self.val(v['then'])} or {self.val(v['otherwise'])} (step {self.number[v['decision']]})"
        if isinstance(v, list):
            return self.names(v) if all(isinstance(x, dict) and "ref" in x for x in v) else ", ".join(map(self.val, v))
        if isinstance(v, float):
            return fmt_number(v)
        return str(v)

    def observation(self, key: str) -> str:
        c = self.by_key[key]
        a = c["args"]
        if c["op"] == "measure":
            return f"{a['display']} of {self.names(c['targets'])}" if c.get("targets") else a["display"]
        if c["op"] == "check":
            return a["text"]
        return a["what"]

    def condition(self, cond: dict) -> str:
        what = self.observation(cond["observation"])
        if cond["op"] == "is":
            return what
        return f"{what} {_OPS[cond['op']]} {self.val(cond['value'])}"

    def expected(self, key: str) -> str:
        a = self.by_key[key]["args"]
        if "default" not in a:
            return ""
        d = self.val(a["default"]) if not isinstance(a["default"], bool) else ("yes" if a["default"] else "no")
        return f" (expected: {d}{' ' + a['unit'] if a.get('unit') else ''})"

    # templates --------------------------------------------------------------------------
    def text(self, c: dict, targets: list[dict]) -> str:
        a, op = c["args"], c["op"]
        t = self.names(targets) if targets else ""
        eq = f" in {self.val(a['equipment'])}" if a.get("equipment") else ""
        on = f" on {a['on']}" if a.get("on") else ""
        temp = f" at {self.val(a['temperature'])}" if a.get("temperature") else ""
        dur = self.for_duration(c)
        if op == "step":
            return a["text"]
        if op == "add":
            s = f"Add {self.val(a['amount'])} of {self.val(a['material'])} to {t}{',' + on if on else ''}."
            return s + (f" Mix by {_MIX.get(a['mix'], a['mix'])}." if a.get("mix") else "")
        if op == "transfer":
            s = f"Transfer {self.val(a['volume'])} from {self.val(a['source'])} to {t}."
            return s + (f" Mix by {_MIX.get(a['mix_after'], a['mix_after'])}." if a.get("mix_after") else "")
        if op == "mix":
            times = f" {a['times']} times" if a.get("times") else ""
            vol = f" with {self.val(a['volume'])}" if a.get("volume") else ""
            return f"Mix {t} by {_MIX.get(a['how'], a['how'])}{times}{vol}."
        if op == "resuspend":
            into = f" in {self.val(a['volume'])}" if a.get("volume") else ""
            into += (" of " if a.get("volume") else " in ") + self.val(a["material"]) if a.get("material") else ""
            return f"Resuspend the pellet in {t}{into} by {_MIX.get(a['how'], a['how'])}."
        if op == "discard_supernatant":
            return f"Discard the supernatant from {t}, keeping the pellet."
        if op == "serial_dilute":
            return (f"Make a {self.val(a['factor'])}-fold serial dilution of {self.val(a['source'])} into {t}: "
                    f"put {self.val(a['diluent_volume'])} of {self.val(a['diluent'])} in each, then carry "
                    f"{self.val(a['carry'])} from tube to tube, mixing by {_MIX.get(a['mix'], a['mix'])} each time.")
        if op == "plate_cells":
            return f"Plate {self.val(a['volume'])} of {t} onto {self.val(a['onto'])}{', spread' if a.get('spread') else ''}."
        if op == "label":
            return f"Label {self.containers_phrase(targets)}."
        if op == "move":
            return f"Move {t} to {a['to']}."
        if op == "invert":
            return f"Invert {t} {a['times']} times."
        if op == "vortex":
            return f"Vortex {t}{' ' + dur if dur else ''}."
        if op == "set":
            what = " and ".join(self.val(a[k]) for k in ("temperature", "speed") if a.get(k))
            return f"Set {self.val(a['equipment'])} to {what}."
        if op == "incubate":
            where = (on + temp).strip()
            shaking = a.get("shaking")
            if shaking:
                shake = "shaking" if shaking is True else f"shaking at {self.val(shaking)}"
                return f"Incubate {t} {where}, {shake}, {dur}{eq}."
            return f"Incubate {t} {where} {dur}{eq}."
        if op == "centrifuge":
            spin = self.val(a.get("force") or a.get("speed"))
            return f"Centrifuge {t} at {spin} {dur}{temp}{eq}."
        if op == "heat_shock":
            return f"Heat shock {t}{eq}{temp} {dur}."
        if op == "thaw":
            return f"Thaw {t}{on}{' ' + dur if dur else ''}."
        if op == "freeze":
            how = f" {a['how']}" if a.get("how") else ""
            return f"Freeze {t}{temp}{how}."
        if op == "thermocycle":
            name = f"the {a['name']} program" if a.get("name") else "this program"
            return f"Run {name} on {t}{eq}: {self.program(a['program'])}."
        if op == "image":
            settings = f" ({a['settings']})" if a.get("settings") else ""
            return f"Image {t}{' on ' + self.val(a['equipment']) if a.get('equipment') else ''}{settings}."
        if op == "measure":
            unit = f" in {a['unit']}" if a.get("unit") else ""
            of = f" of {t}" if t else ""
            return f"Measure {a['display']}{of}{' on ' + self.val(a['equipment']) if a.get('equipment') else ''}{unit} and record it."
        if op == "check":
            return f"Check {t}: {a['text']}." if t else f"Check: {a['text']}."
        if op == "record":
            return f"Record {a['what']}{' in ' + a['unit'] if a.get('unit') else ''}."
        if op == "wait":
            return f"Wait {dur}{': ' + a['reason'] if a.get('reason') else ''}."
        if op == "pause":
            return f"Pause: {a['text']}. Continue when ready."
        if op == "checkpoint":
            return f"Safe stopping point: {a['text']}."
        if op == "decide":
            return self.decision(c)
        raise RenderError(f"no template for command {op!r} (step {c['key']})")

    def for_duration(self, c: dict) -> str:
        d = c.get("duration")
        if not d:
            return ""
        return d["label"] if d.get("label") else f"for {human(d)}"

    def containers_phrase(self, targets: list[dict]) -> str:
        kinds = {self.res[t["ref"]][1].get("kind") for t in targets if self.res[t["ref"]][0] == "container"}
        if len(kinds) == 1 and len(targets) > 1 and next(iter(kinds)) in LABWARE:
            return f"{LABWARE[next(iter(kinds))][0]}s {self.names(targets)}"
        return self.names(targets)

    def program(self, items: list, sep: str = "; ") -> str:
        out = []
        for p in items:
            if "cycles" in p:
                out.append(f"{p['cycles']} cycles of ({self.program(p['steps'], ', ')})")
            elif "duration" in p:
                out.append(f"{human(p['temperature'])} {human(p['duration'])}")
            else:
                out.append(f"hold at {human(p['temperature'])}")
        return sep.join(out)

    def decision(self, c: dict) -> str:
        a = c["args"]
        cond = self.condition(a["condition"])
        if "assumed" in a:
            # a plain `if` on an observation: render followed one arm only
            expected = self.expected(a["condition"]["observation"])
            return (f"Decision: {cond}? The steps below assume {'yes' if a['assumed'] else 'no'}{expected}; "
                    "if the answer differs, stop and adapt them.")
        if a.get("branches"):
            arms = {"then": [], "otherwise": []}
            for k, n in self.number.items():
                b = self.by_key[k].get("branch")
                if b and b["decision"] == c["key"]:
                    arms[b["arm"]].append(n)
            then = _steps_ref(sorted(set(arms["then"]))) or "nothing"
            other = f"do {_steps_ref(sorted(set(arms['otherwise'])))}" if arms["otherwise"] else "skip them"
            return f"Decision: if {cond}, do {then}; otherwise {other}."
        return f"Decision: if {cond}, use {self.val(a['then'])}; otherwise {self.val(a['otherwise'])}."

    def extras(self, c: dict) -> str:
        """Sentences after the template: the liquid class hint and the author's note."""
        out = []
        a = c["args"]
        for k in ("material", "source"):
            v = a.get(k)
            if isinstance(v, dict) and "ref" in v and self.res[v["ref"]][0] == "material":
                hint = LIQUID_CLASSES.get(self.res[v["ref"]][1].get("liquid_class"))
                if hint:
                    out.append(hint)
        if c.get("note"):
            note = c["note"].strip()
            out.append(note if note.endswith((".", "!", "?")) else note + ".")
        return "".join(" " + s for s in out)

    def prefix(self, c: dict) -> str:
        b = c.get("branch")
        if not b:
            return ""
        d = self.by_key[b["decision"]]
        n = self.number[b["decision"]]
        if b["arm"] == "then":
            return f"If {self.condition(d['args']['condition'])} (step {n}): "
        return f"Otherwise (step {n}): "

    # attributes -------------------------------------------------------------------------
    def ids(self, value, kind: str, out: list):
        if isinstance(value, dict):
            if "ref" in value:
                k, r = self.res[value["ref"]]
                link = r.get("mat") if k == "material" else r.get("eqp") if k == "equipment" else None
                if k == kind and link and link not in out and "/" not in link:
                    out.append(link)
            else:
                for v in value.values():
                    self.ids(v, kind, out)
        elif isinstance(value, list):
            for v in value:
                self.ids(v, kind, out)

    def attrs(self, unit: list[dict]) -> dict:
        c = unit[0]
        a = c["args"]
        out: dict = {}
        if c.get("duration"):
            out["duration"] = compact(c["duration"])
        for k in ("wait", "parallel"):
            if c.get(k):
                out[k] = True
        for kind, name in (("material", "materials"), ("equipment", "equipment")):
            ids: list = []
            for cmd in unit:
                self.ids([cmd["args"], cmd.get("targets", [])], kind, ids)
            if ids:
                out[name] = ids
        vol = a.get("amount") if c["op"] == "add" else a.get("volume")
        if isinstance(vol, dict) and (vol.get("unit") == "uL" or "decision" in vol):
            out["volume"] = (compact(vol) if "unit" in vol
                             else f"{compact(vol['then'])} or {compact(vol['otherwise'])}")
        if isinstance(a.get("temperature"), dict):
            out["temp"] = compact(a["temperature"])
        if c["op"] == "measure":
            out["measure"] = a["what"]
        if c["op"] in ("measure", "record"):
            out["record"] = True
        for k in ("check", "hazard", "checkpoint"):
            if c.get(k):
                out[k] = c[k]
        if c["op"] == "check":
            out["check"] = a["text"]
        if c["actor"] != "human":
            out["actor"] = c["actor"].split(":")[0]
        if len(unit) == 1:
            out["key"] = c["key"]
        else:
            out["keys"] = [u["key"] for u in unit]
        return out

    # the page ---------------------------------------------------------------------------
    def units(self) -> list[list[dict]]:
        """Commands grouped into rendered steps: consecutive per-container commands that
        differ only in their container become one step."""
        def sig(c):
            return json.dumps({k: v for k, v in c.items() if k not in ("key", "targets")}, sort_keys=True)

        out: list[list[dict]] = []
        for c in self.commands:
            prev = out[-1] if out else None
            if (prev and c["op"] in PER_TARGET and prev[0]["op"] == c["op"] and sig(prev[0]) == sig(c)):
                prev.append(c)
            else:
                out.append([c])
        return out

    def steps(self) -> str:
        units = self.units()
        n = 0
        for u in units:
            if u[0]["op"] != "note":
                n += 1
                for c in u:
                    self.number[c["key"]] = n
        lines: list[str] = []
        groups: list[str] = []
        for u in units:
            c = u[0]
            g = c["group"]
            if g != groups:
                common = 0
                while common < min(len(g), len(groups)) and g[common] == groups[common]:
                    common += 1
                for depth in range(common, len(g)):
                    if lines and not lines[-1].startswith("#"):
                        lines.append("")
                    lines.append("#" * (3 + min(depth, 3)) + " " + g[depth])
                groups = list(g)
            if c["op"] == "note":
                lines.append(f"> Note: {c['args']['text']}")
                continue
            targets = [t for cmd in u for t in cmd.get("targets", [])]
            text = self.prefix(c) + self.text(c, targets) + self.extras(c)
            lines.append(f"{self.number[c['key']]}. {text} {attr_block(self.attrs(u))}")
        return "\n".join(lines) + "\n"


def render_steps(ir: dict) -> str:
    """The body of `## Steps` for a protocol's IR."""
    return Renderer(ir).steps()
