"""What commands touch: containers, materials and equipment (design doc, section 3.1).

Each resource has a short ID local to the run (`c1`, `m2`, `e1`) that the IR refers to.
Notebook IDs (`MAT-0210`, `EQP-0004`) are carried alongside when known.
"""

from __future__ import annotations

import re

MAT_RE = re.compile(r"^([a-z][a-z0-9_-]*/)?MAT-\d{4,}$")
EQP_RE = re.compile(r"^([a-z][a-z0-9_-]*/)?EQP-\d{4,}$")

# kind -> (what a person calls it, capacity in uL); robots' geometry comes later
LABWARE: dict[str, tuple[str, float | None]] = {
    "tube_0.2ml": ("0.2 mL PCR tube", 200),
    "tube_1.5ml": ("1.5 mL tube", 1500),
    "tube_2ml": ("2 mL tube", 2000),
    "tube_5ml": ("5 mL tube", 5000),
    "falcon_15ml": ("15 mL conical tube", 15000),
    "falcon_50ml": ("50 mL conical tube", 50000),
    "plate_96": ("96-well plate", None),
    "plate_96_deep": ("96-well deep-well plate", None),
    "well_96": ("well", 300),
    "well_96_deep": ("well", 2000),
    "flask_250ml": ("250 mL flask", 250000),
    "flask_500ml": ("500 mL flask", 500000),
    "flask_1l": ("1 L flask", 1000000),
    "flask_2l": ("2 L flask", 2000000),
    "bottle_500ml": ("500 mL bottle", 500000),
    "bottle_1l": ("1 L bottle", 1000000),
    "petri_dish": ("Petri dish", 30000),
    "cuvette": ("cuvette", 1500),
    "spin_column": ("spin column", 800),
}
WELL_KIND = {"plate_96": "well_96", "plate_96_deep": "well_96_deep"}
ROWS, COLS = "ABCDEFGH", range(1, 13)

# liquid class -> the hint a person needs; robots' pipetting parameters come with Phase 3
LIQUID_CLASSES: dict[str, str | None] = {
    "aqueous": None,
    "viscous": "Pipette slowly and let the tip drain.",
    "volatile": "Work quickly and keep the tube closed.",
    "cells": "Pipette gently, do not vortex.",
    "hazardous": "Gloves on; dispose of it as its material page says.",
}


class Resource:
    id: str

    def ref(self) -> dict:
        return {"ref": self.id}


class Container(Resource):
    def __init__(self, id: str, kind: str, label: str, max_volume: float | None = None,
                 parent: "Container | None" = None, well: str | None = None,
                 location: str | None = None):
        if kind not in LABWARE and max_volume is None:
            known = ", ".join(sorted(LABWARE))
            raise ValueError(f"unknown container kind {kind!r}: give max_volume=, or use one of {known}")
        self.id, self.kind, self.label = id, kind, label
        self.max_volume = max_volume if max_volume is not None else LABWARE.get(kind, (None, None))[1]
        self.parent, self.well, self.location = parent, well, location
        self._wells: dict[str, Container] = {}
        self._new_id = None  # set by the context so wells get run-local IDs

    def __getitem__(self, well: str) -> "Container":
        """A well of a plate: `plate["A1"]`."""
        if self.kind not in WELL_KIND:
            raise TypeError(f"{self.label} ({self.kind}) has no wells")
        well = well.upper()
        if not (len(well) >= 2 and well[0] in ROWS and well[1:].isdigit() and int(well[1:]) in COLS):
            raise KeyError(f"{well!r} is not a well of a 96-well plate")
        if well not in self._wells:
            self._wells[well] = self._new_id(WELL_KIND[self.kind], f"{self.label} {well}", parent=self, well=well)
        return self._wells[well]

    def wells(self, *names: str) -> list["Container"]:
        """Wells by name, or every well in row order (A1, A2, ... H12) when none are named."""
        names = names or tuple(f"{r}{c}" for r in ROWS for c in COLS)
        return [self[n] for n in names]

    def to_ir(self) -> dict:
        d = {"id": self.id, "kind": self.kind, "label": self.label}
        if self.max_volume is not None:
            d["max_volume"] = {"value": float(self.max_volume), "unit": "uL"}
        if self.parent:
            d["parent"], d["well"] = self.parent.id, self.well
        if self.location:
            d["location"] = self.location
        return d

    def __repr__(self):
        return f"<container {self.label}>"


class Material(Resource):
    def __init__(self, id: str, name: str, mat: str | None = None,
                 liquid_class: str = "aqueous", parameter: str | None = None):
        if liquid_class not in LIQUID_CLASSES:
            raise ValueError(f"unknown liquid class {liquid_class!r}: one of {', '.join(LIQUID_CLASSES)}")
        self.id, self.name, self.mat = id, name, mat
        self.liquid_class, self.parameter = liquid_class, parameter

    def to_ir(self) -> dict:
        d = {"id": self.id, "name": self.name, "liquid_class": self.liquid_class}
        if self.mat:
            d["mat"] = self.mat
        if self.parameter:
            d["parameter"] = self.parameter
        return d

    def __repr__(self):
        return f"<material {self.name}>"


class Equipment(Resource):
    def __init__(self, id: str, name: str, kind: str | None = None, eqp: str | None = None):
        self.id, self.name, self.kind, self.eqp = id, name, kind, eqp

    def to_ir(self) -> dict:
        d = {"id": self.id, "name": self.name}
        if self.kind:
            d["kind"] = self.kind
        if self.eqp:
            d["eqp"] = self.eqp
        return d

    def __repr__(self):
        return f"<equipment {self.name}>"
