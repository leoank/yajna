import unittest

from yajna_protocol.params import ParameterError, Parameters


def declared():
    p = Parameters()
    p.add_int("n", "Samples", default=2, minimum=1, maximum=12)
    p.add_float("dna", "DNA", default=1.0, minimum=0.5)
    p.add_bool("controls", "Controls", default=True)
    p.add_choice("ab", "Antibiotic", choices=["kan", "amp"], default="kan")
    p.add_material("plasmid", "Plasmid", kind="plasmid")
    return p


class Params(unittest.TestCase):
    def test_defaults_and_strings_from_the_command_line(self):
        p = declared()
        self.assertEqual(p.bind({}), {"n": 2, "dna": 1.0, "controls": True, "ab": "kan", "plasmid": None})
        v = p.bind({"n": "4", "dna": "2.5", "controls": "no", "ab": "amp", "plasmid": "MAT-0198"})
        self.assertEqual(v, {"n": 4, "dna": 2.5, "controls": False, "ab": "amp", "plasmid": "MAT-0198"})

    def test_bad_values_say_what_is_wrong(self):
        p = declared()
        for given, msg in [({"n": "13"}, "above the maximum 12"), ({"n": "x"}, "not an int"),
                           ({"dna": "0.1"}, "below the minimum"), ({"ab": "cm"}, "not one of kan, amp"),
                           ({"plasmid": "pUC19"}, "not a material ID"), ({"m": "1"}, "unknown parameter"),
                           ({"controls": "maybe"}, "not true or false")]:
            with self.subTest(given=given):
                with self.assertRaisesRegex(ParameterError, msg):
                    p.bind(given)

    def test_a_bad_default_fails_at_declaration(self):
        p = Parameters()
        with self.assertRaisesRegex(ParameterError, "above the maximum"):
            p.add_int("n", "N", default=20, maximum=12)
        with self.assertRaisesRegex(ParameterError, "declared twice"):
            p.add_int("m", "M", default=1)
            p.add_int("m", "M", default=1)


if __name__ == "__main__":
    unittest.main()
