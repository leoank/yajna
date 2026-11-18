"""Rendering: the worked example against its golden page, and each construct on its own."""

import json
import re
import unittest
from pathlib import Path

from yajna_protocol import C, ProtocolError, minutes, seconds, ul, xg
from yajna_protocol.context import Protocol
from yajna_protocol.loader import record
from yajna_protocol.params import Parameters
from yajna_protocol.render import attr_block, render_steps

HERE = Path(__file__).parent
EXAMPLE = HERE.parent / "examples" / "transformation.py"
SCHEMA_DURATION = re.compile(r"^(\d+h)?(\d+m)?(\d+s)?$")


def ctx(params=None, **kw):
    p = Parameters()
    for name, (kind, default) in (params or {}).items():
        getattr(p, f"add_{kind}")(name, name, default=default)
    return Protocol({"name": "t", "version": 1}, p.decl, p.bind({}), **kw)


def steps(c):
    return render_steps(json.loads(json.dumps(c.ir()))).splitlines()


class Example(unittest.TestCase):
    def test_transformation_matches_its_golden_render(self):
        ir = record(EXAMPLE, {"plasmid": "MAT-0198"},
                    equipment={"water_bath": "EQP-0004", "shaking_incubator": "EQP-0002"})
        got = render_steps(ir)
        want = (HERE / "golden" / "transformation.md").read_text()
        self.assertEqual(got, want, "regenerate tests/golden/transformation.md if the change is intended")

    def test_keys_do_not_move_with_the_number_of_samples(self):
        def keys(n):
            ir = record(EXAMPLE, {"n": str(n)})
            return {c["key"] for c in ir["commands"] if "[" not in c["key"]}
        self.assertEqual(keys(2), keys(5))

    def test_rendering_the_recorded_ir_gives_the_same_page(self):
        ir = record(EXAMPLE, {"plasmid": "MAT-0198"})
        self.assertEqual(render_steps(json.loads(json.dumps(ir))), render_steps(ir))

    def test_ir_follows_its_schema(self):
        try:
            import jsonschema
        except ImportError:
            self.skipTest("jsonschema is not installed (it is in nix flake check)")
        schema = json.loads((HERE.parent / "schema" / "ir.json").read_text())
        ir = record(EXAMPLE, {"plasmid": "MAT-0198"})
        jsonschema.validate(json.loads(json.dumps(ir)), schema)

    def test_every_attribute_block_is_valid_for_the_step_schema(self):
        for line in render_steps(record(EXAMPLE, {})).splitlines():
            m = re.search(r"duration: (\S+?)[,}]", line)
            if m:
                self.assertRegex(m.group(1), SCHEMA_DURATION, line)


class Constructs(unittest.TestCase):
    def test_free_text_step_renders_verbatim(self):
        c = ctx()
        c.step("Add 950 uL SOC to each tube.", duration=2 * minutes)
        self.assertEqual(steps(c), ["1. Add 950 uL SOC to each tube. {duration: 2m, key: \"1\"}"])

    def test_loops_collapse_only_when_the_steps_are_the_same(self):
        c = ctx()
        soc = c.material(name="SOC")
        t1, t2 = c.tubes(2)
        c.add(soc, 950 * ul, to=[t1, t2])
        c.add(soc, 500 * ul, to=t1)
        c.add(soc, 400 * ul, to=t2)
        self.assertEqual(steps(c), [
            "1. Add 950 uL of SOC to T1, T2. {volume: 950uL, keys: [\"1[T1]\", \"1[T2]\"]}",
            "2. Add 500 uL of SOC to T1. {volume: 500uL, key: \"2\"}",
            "3. Add 400 uL of SOC to T2. {volume: 400uL, key: \"3\"}",
        ])

    def test_when_records_both_arms(self):
        c = ctx()
        t = c.container("tube_1.5ml", "T1")
        with c.group("Check"):
            clear = c.check("the lysate is clear", of=t, default=True)
            c.when(clear,
                   lambda: c.transfer(500 * ul, source=t, to=c.container("tube_1.5ml", "T2")),
                   lambda: c.centrifuge(t, force=16000 * xg, duration=10 * minutes, temperature=4 * C))
        self.assertEqual(steps(c), [
            "### Check",
            "1. Check T1: the lysate is clear. {check: the lysate is clear, key: check.1}"
            .replace("check: the lysate is clear", 'check: "the lysate is clear"'),
            "2. Decision: if the lysate is clear, do step 3; otherwise do step 4. {key: check.2}",
            "3. If the lysate is clear (step 2): Transfer 500 uL from T1 to T2. {volume: 500uL, key: check.3}",
            "4. Otherwise (step 2): Centrifuge T1 at 16000 x g for 10 min at 4 C. "
            "{duration: 10m, wait: true, temp: 4C, key: check.4}",
        ])

    def test_plain_if_on_an_observation_says_what_it_assumed(self):
        c = ctx()
        t = c.container("tube_1.5ml", "T1")
        od = c.measure("od600", of=t, default=0.8)
        if od > 0.6:
            c.step("Induce with IPTG.")
        lines = steps(c)
        self.assertIn("Decision: OD600 of T1 is above 0.6? The steps below assume yes (expected: 0.8)", lines[1])
        self.assertTrue(lines[2].startswith("3. Induce with IPTG."))

    def test_a_measure_without_default_cannot_be_rendered_when_used(self):
        c = ctx()
        od = c.measure("od600")
        with self.assertRaisesRegex(ProtocolError, "has no default"):
            c.decide(od < 0.5, 100 * ul, 20 * ul) and bool(od < 0.5)

    def test_observations_cannot_be_computed_with(self):
        c = ctx()
        od = c.measure("od600", default=0.3)
        with self.assertRaisesRegex(ProtocolError, "only known at the bench"):
            od * 2

    def test_types_are_checked_where_a_person_would_err(self):
        c = ctx()
        t = c.container("tube_1.5ml", "T1")
        with self.assertRaisesRegex(ProtocolError, "must be a force"):
            c.centrifuge(t, force=4000 * ul, duration=1 * minutes)
        with self.assertRaisesRegex(ProtocolError, "volume or a mass"):
            c.add(c.material(name="water"), 5 * minutes, to=t)
        with self.assertRaisesRegex(ProtocolError, "labelled 'T1'"):
            c.container("tube_1.5ml", "T1")
        with self.assertRaisesRegex(ProtocolError, "used twice"):
            c.step("a", key="x")
            c.step("b", key="x")

    def test_thermocycle_program(self):
        c = ctx()
        t = c.container("tube_0.2ml", "P1")
        c.thermocycle(t, name="colony PCR", program=[
            (95 * C, 3 * minutes),
            c.cycles(30, [(95 * C, 30 * seconds), (55 * C, 30 * seconds), (72 * C, 1 * minutes)]),
            (72 * C, 5 * minutes), (4 * C, None)])
        self.assertEqual(steps(c)[0].split(" {")[0],
                         "1. Run the colony PCR program on P1: 95 C 3 min; 30 cycles of (95 C 30 s, 55 C 30 s, "
                         "72 C 1 min); 72 C 5 min; hold at 4 C.")

    def test_wells_and_groups_nest(self):
        c = ctx()
        plate = c.container("plate_96", "P")
        water = c.material(name="water")
        with c.group("Setup"):
            with c.group("Blanks"):
                c.add(water, 200 * ul, to=plate.wells("A1", "A2"))
        self.assertEqual(steps(c), [
            "### Setup", "#### Blanks",
            "1. Add 200 uL of water to P A1, P A2. {volume: 200uL, keys: [\"setup.blanks.1[P A1]\", \"setup.blanks.1[P A2]\"]}",
        ])

    def test_material_parameters_without_a_value_render_by_their_name(self):
        p = Parameters()
        p.add_material("plasmid", "Plasmid")
        c = Protocol({"name": "t"}, p.decl, p.bind({}))
        m = c.material(c.params.plasmid)
        c.add(m, 1 * ul, to=c.container("tube_1.5ml", "T1"))
        self.assertEqual(steps(c)[0], "1. Add 1 uL of plasmid to T1. {volume: 1uL, key: \"1\"}")

    def test_attribute_values_are_quoted_when_yaml_needs_it(self):
        self.assertEqual(attr_block({"key": "plate.od[T1]", "check": "no clumps, thawed", "volume": "50uL",
                                     "hazard": "yes"}),
                         '{volume: 50uL, check: "no clumps, thawed", hazard: "yes", key: "plate.od[T1]"}')


if __name__ == "__main__":
    unittest.main()
