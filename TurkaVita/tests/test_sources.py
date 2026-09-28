#!/usr/bin/env python3
"""Source discipline: the rules in CLAUDE.md that can be checked mechanically.

The build already checks that every citation exists, that its printed page matches the running head
and that every quotation is on its page. These tests check what a citation is USED for.
"""
import os, sys, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "scripts"))
import narrative_lib as nl                                                      # noqa: E402

DURESS = {"apology", "creed_tract"}
# claims ABOUT the apologies (what MK counts as one, that they were written under duress) are not
# reported THROUGH them, so they carry no subject_self_report layer
ABOUT_THE_APOLOGIES = {"CL-0111", "CL-0167"}


class SourceDiscipline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.arts = nl.load_artifacts()
        cls.by = lambda self, t: [a for a in cls.arts.values() if a["type"] == t]

    def test_a_claim_resting_on_an_apology_carries_the_duress_layer(self):
        bad = []
        for c in self.by("claim"):
            if c["epistemic_type"] not in ("attested", "directly_inferred") or c["id"] in ABOUT_THE_APOLOGIES:
                continue   # a reconstruction or undeterminable claim is MK reasoning, not his report
            kinds = {self.arts[e].get("evidence_kind") for e in c["supported_by"] if e in self.arts}
            if kinds & DURESS:
                layers = [m for m in c.get("mediation", []) if m["layer"] == "subject_self_report"]
                if not layers:
                    bad.append(c["id"])
                elif not any(m.get("shaping_risk") == "high" for m in layers):
                    bad.append(c["id"] + " (not high)")
        self.assertEqual(bad, [], f"{len(bad)} claim(s) rest on an apology or creed tract without subject_self_report/high: {bad[:12]}")

    def test_every_claim_and_work_bottoms_out_in_evidence(self):
        for a in self.by("claim") + self.by("work"):
            self.assertTrue(a["supported_by"], a["id"])
            for e in a["supported_by"]:
                self.assertEqual(self.arts[e]["type"], "evidence", f"{a['id']} -> {e}")

    def test_every_evidence_kind_is_a_known_kind(self):
        kinds = {"apology", "creed_tract", "letter", "colophon", "autograph", "early_work", "work", "hagiography",
                 "chronicle", "reception", "scholarly_argument", "context"}
        for e in self.by("evidence"):
            self.assertIn(e["evidence_kind"], kinds, e["id"])

    def test_an_attested_claim_is_not_MKs_own_conjecture(self):
        """MK's own guesses ('presumably', '(?)') belong in reconstructions, not `attested`."""
        hedges = ("presumably", "(?)", "conceivably", "probably")
        bad = [c["id"] for c in self.by("claim") if c["epistemic_type"] == "attested" and c["confidence"] == "high"
               and any(h in c["proposition"].lower() for h in hedges)]
        self.assertEqual(bad, [], f"high-confidence attested claims that hedge: {bad[:12]}")

    def test_no_apology_evidence_is_offered_as_what_he_held(self):
        """The duress rule as data: an apology or creed tract may not appear as a `work`/`letter`/... bearing."""
        for h in self.by("hypothesis"):
            for b in h["bearings"]:
                ev = self.arts.get(b["evidence"])
                self.assertEqual(b["kind"], ev["evidence_kind"], f"{h['id']} {b['evidence']}")

    def test_fixed_points_rest_on_context_or_attested_events(self):
        for e in self.by("event"):
            if e.get("fixed_point"):
                self.assertIn(e["date"].get("date_kind"), {"context", "attested", "colophon"}, e["id"])

    def test_works_that_may_be_transcription_never_claim_composition(self):
        """A WRK dated only by a Majlis 10196 copy date must not say date_kind composition."""
        for w in self.by("work"):
            basis = (w.get("date") or {}).get("basis", "").lower()
            if w["date_kind"] == "composition":
                self.assertNotIn("copied only", basis, w["id"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
