import unittest

from yajna_protocol.units import (
    C, Quantity, UnitError, compact, days, fmt_number, g, hours, human, mg, mg_per_ml, minutes, ml, mM,
    overnight, seconds, ug, ug_per_ml, ul, uM, xg,
)


def h(q):
    return human(q.to_ir())


class Units(unittest.TestCase):
    def test_arithmetic_within_a_dimension(self):
        self.assertEqual(2 * ml + 500 * ul, 2500 * ul)
        self.assertEqual((1.5 * ml).to(ul), 1500)
        self.assertEqual(sum([50 * ul, 50 * ul]), 100 * ul)
        self.assertEqual((100 * ul) / (10 * ul), 10)
        self.assertEqual(950 * ul * 2, 1.9 * ml)
        self.assertLess(20 * ul, 0.1 * ml)

    def test_mixing_dimensions_is_an_error(self):
        with self.assertRaises(UnitError):
            50 * ul + 10 * minutes
        with self.assertRaises(UnitError):
            50 * ul + 5  # a bare number has no unit
        with self.assertRaises(TypeError):
            (50 * ul) * (2 * ul)
        with self.assertRaises(UnitError):
            (1 * g).to(ul)

    def test_human_rendering(self):
        self.assertEqual(h(950 * ul), "950 uL")
        self.assertEqual(h(1900 * ul), "1.9 mL")
        self.assertEqual(h(1000 * ul), "1 mL")
        self.assertEqual(h(0.5 * ul), "0.5 uL")
        self.assertEqual(h(2500 * ml), "2.5 L")
        self.assertEqual(h(45 * seconds), "45 s")
        self.assertEqual(h(90 * seconds), "1 min 30 s")
        self.assertEqual(h(30 * minutes), "30 min")
        self.assertEqual(h(90 * minutes), "1 h 30 min")
        self.assertEqual(h(3 * days), "3 d")
        self.assertEqual(h(overnight), "overnight")
        self.assertEqual(h(42 * C), "42 C")
        self.assertEqual(h(4000 * xg), "4000 x g")
        self.assertEqual(h(500 * ug), "500 ug")
        self.assertEqual(h(2 * g), "2 g")
        self.assertEqual(h(250 * mg), "250 mg")
        self.assertEqual(h(50 * ug_per_ml), "50 ug/mL")
        self.assertEqual(h(2 * mg_per_ml), "2 mg/mL")
        self.assertEqual(h(500 * uM), "500 uM")
        self.assertEqual(h(10 * mM), "10 mM")

    def test_attribute_forms_match_the_step_schema(self):
        self.assertEqual(compact((45 * seconds).to_ir()), "45s")
        self.assertEqual(compact((90 * minutes).to_ir()), "1h30m")
        self.assertEqual(compact((2 * hours).to_ir()), "2h")
        self.assertEqual(compact(overnight.to_ir()), "16h")
        self.assertEqual(compact((50 * ul).to_ir()), "50uL")
        self.assertEqual(compact((37 * C).to_ir()), "37C")

    def test_numbers(self):
        self.assertEqual(fmt_number(1.0), "1")
        self.assertEqual(fmt_number(0.33333), "0.3333")
        self.assertEqual(fmt_number(12345), "12345")
        self.assertEqual(fmt_number(1.25), "1.25")

    def test_ir_round_trip(self):
        for q in (50 * ul, overnight, 37 * C):
            self.assertEqual(Quantity.from_ir(q.to_ir()), q)


if __name__ == "__main__":
    unittest.main()
