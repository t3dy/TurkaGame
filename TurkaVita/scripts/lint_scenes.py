#!/usr/bin/env python3
# lint_scenes.py — the Narrative Linter: static analysis for historical narrative. Deterministic
# checks only; "is this historically meaningful?" is not asked here.
#
#   python scripts/lint_scenes.py        # exit 1 if any ERROR
import argparse, itertools, re, sys
from narrative_lib import HELD_KINDS, ADDITIVE, load_scenes, load_artifacts, first_scene

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SAFE_INVARIANT = {"attested", "directly_inferred"}
RECON_TYPES = {"reconstruction"}
# every outcome the engine can produce must be priced, or a commitment silently costs nothing
COMMIT_TAGS = {"coherent", "incoherent", "calibrated_unknown", "over_caution", "false_certainty",
               "non_conviction", "coerced_testimony", "empty_dossier"}
LABELS = {"documented", "reconstructed", "contested", "unknown", "counterfactual"}


def grounded(aid, arts, seen=None):
    """Does this artifact bottom out in at least one evidence artifact?"""
    seen = seen or set()
    if aid in seen or aid not in arts:
        return False
    seen.add(aid)
    a = arts[aid]
    if a["type"] == "evidence":
        return True
    refs = (a.get("supported_by", []) + a.get("cites", []) + a.get("observed_facts", []) + a.get("claims", [])
            + (a.get("situation", {}) or {}).get("based_on", [])
            + [b["evidence"] for b in a.get("bearings", [])])
    return any(grounded(r, arts, seen) for r in refs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--grep', help='show only messages whose scene id or text matches this regex (e.g. "SCN-01")')
    args = ap.parse_args()
    scenes, arts = load_scenes(), load_artifacts()
    msgs = []
    err = lambda sid, m: msgs.append(("ERROR", sid, m))
    warn = lambda sid, m: msgs.append(("WARNING", sid, m))

    def effect_sets(s):
        sets = [c["effects"] for c in s["choices"]]
        for r in s.get("rulings") or []:
            sets += [r["effects_correct"], r.get("effects_wrong") or {}]
        for slot in (s.get("composer") or {}).get("slots", []):
            sets += [o["effects"] for o in slot["options"]]
        return sets

    set_keys, positive = {}, set()   # key -> values some effect can produce ; keys some effect can raise
    for s in scenes.values():
        for eff in effect_sets(s):
            for k, v in eff.items():
                set_keys.setdefault(k, set()).add(v if not isinstance(v, (int, float)) or isinstance(v, bool) else "num")
                if isinstance(v, (int, float)) and not isinstance(v, bool) and v > 0:
                    positive.add(k)
        srt = s.get("sorter")
        if srt:
            sc = srt.get("scoring") or {}
            positive.add(sc.get("axis", "score.textual"))
            for k, v in (sc.get("exact_effects") or {}).items():
                set_keys.setdefault(k, set()).add(v)

    collectable, lenses = set(), {"all"}
    for s in scenes.values():
        for eff in effect_sets(s):
            for k, v in eff.items():
                if k.startswith("dossier.") and v:
                    collectable.add(k[len("dossier."):])
                elif k == "lens":
                    lenses.add(v)

    for sid, s in scenes.items():
        for ref in s["situation"]["based_on"]:
            if ref not in arts:
                err(sid, f"situation based_on {ref} does not exist")
            elif not grounded(ref, arts):
                err(sid, f"situation {ref} has no chain down to evidence")
        for inv in s["invariants"]:
            a = arts.get(inv["claim"])
            if not a:
                err(sid, f"invariant cites missing claim {inv['claim']}")
                continue
            if a["type"] != "claim" or a.get("epistemic_type") not in SAFE_INVARIANT:
                err(sid, f"invariant '{inv['text'][:50]}' rests on {a['id']} ({a.get('epistemic_type') or a['type']}) — invariants must be attested")
            if a.get("status") == "rejected":
                err(sid, f"invariant rests on rejected {a['id']}")
            if not grounded(a["id"], arts):
                err(sid, f"invariant claim {a['id']} has no evidence")

        for r in s.get("rulings") or []:
            tag = f"ruling {r['id']}"
            if not r["effects_correct"]:
                warn(sid, f"{tag}: getting it right changes nothing")
            for ref in r["based_on"]:
                a = arts.get(ref)
                if not a:
                    err(sid, f"{tag}: based_on {ref} does not exist")
                elif a["type"] != "claim" or a.get("epistemic_type") not in SAFE_INVARIANT:
                    err(sid, f"{tag}: a scored ruling must rest on an attested/directly inferred claim, not {ref} ({a.get('epistemic_type') or a['type']})")
                elif not grounded(ref, arts):
                    err(sid, f"{tag}: {ref} has no evidence")
        ids = [r["id"] for r in s.get("rulings") or []]
        if len(ids) != len(set(ids)):
            err(sid, "duplicate ruling ids")

        # --- the composer: a work assembled from the moves its source reports
        comp = s.get("composer")
        if comp:
            w = arts.get(comp["work"])
            if not w or w["type"] != "work":
                err(sid, f"composer: {comp['work']} is not a work artifact")
            slot_ids = [x["id"] for x in comp["slots"]]
            if len(slot_ids) != len(set(slot_ids)):
                err(sid, "composer: duplicate slot ids")
            for slot in comp["slots"]:
                oids = [o["id"] for o in slot["options"]]
                if len(oids) != len(set(oids)):
                    err(sid, f"composer slot {slot['id']}: duplicate option ids")
                for a, b in itertools.combinations(slot["options"], 2):
                    if a["effects"] == b["effects"]:
                        err(sid, f"composer slot {slot['id']}: options {a['id']} and {b['id']} have identical effects")
                for o in slot["options"]:
                    tag = f"composer {slot['id']}/{o['id']}"
                    if o["epistemic_label"] not in LABELS:
                        err(sid, f"{tag}: bad label")
                    if not o["based_on"]:
                        err(sid, f"{tag}: no based_on — an option must rest on something the source reports (or on a labelled absence)")
                    for r in o["based_on"]:
                        a = arts.get(r)
                        if not a:
                            err(sid, f"{tag}: based_on {r} does not exist")
                        elif a["type"] in RECON_TYPES and o["epistemic_label"] == "documented":
                            err(sid, f"{tag}: presents reconstruction {r} as documented")
                        elif not grounded(r, arts):
                            err(sid, f"{tag}: {r} has no chain down to evidence")
                    if not o["effects"]:
                        warn(sid, f"{tag}: no state mutation — an option with no consequence")

        # --- the collection puzzle
        srt = s.get("sorter")
        if srt:
            item_ids = [i["id"] for i in srt["items"]]
            if sorted(item_ids) != sorted(srt["truth"]):
                err(sid, "sorter: truth is not a permutation of the items")
            if len(item_ids) < 3:
                err(sid, "sorter: fewer than three items is not a puzzle")
            for r in srt["based_on"]:
                a = arts.get(r)
                if not a:
                    err(sid, f"sorter: based_on {r} does not exist")
                elif not grounded(r, arts):
                    err(sid, f"sorter: {r} has no chain down to evidence — the answer key must be sourced")

        # --- the commitment: UNKNOWN is an option, positions are reachable, and a position that
        # claims to know what he held has some free-writing evidence in the game that can carry it
        block = s.get("commitment")
        if block:
            opts = [o["hypothesis"] for o in block["options"]]
            if len(opts) != len(set(opts)):
                err(sid, "commitment offers the same hypothesis twice")
            if block["underdetermined_option"] not in opts:
                err(sid, "commitment: underdetermined_option is not one of the options — UNKNOWN must be offerable")
            for tag in sorted(COMMIT_TAGS - set(block["scoring"])):
                warn(sid, f"commitment: outcome '{tag}' is unpriced — reaching it changes nothing")
            for tag in sorted(set(block["scoring"]) - COMMIT_TAGS):
                err(sid, f"commitment: scoring has '{tag}', which the engine never produces")
            for hid in opts:
                h = arts.get(hid)
                if not h:
                    err(sid, f"commitment: hypothesis {hid} does not exist")
                    continue
                if h["type"] != "hypothesis":
                    err(sid, f"commitment: {hid} is a {h['type']}, not a hypothesis")
                    continue
                if not grounded(hid, arts):
                    err(sid, f"commitment: {hid} has no chain down to evidence")
                reach = [b for b in h["bearings"] if b["evidence"] in collectable]
                if not reach:
                    err(sid, f"commitment: {hid} can never gain or lose standing — no choice collects any of its evidence")
                sup = [b for b in reach if b["direction"] == "supports"]
                if not sup:
                    warn(sid, f"commitment: {hid} can only ever be strained — nothing in the game supports it")
                if h["commitments"]["conviction"] and not any(b["kind"] in HELD_KINDS for b in sup):
                    warn(sid, f"commitment: {hid} claims to know what he held but no collectable evidence that supports it "
                              f"is a free writing (letter/colophon/autograph/early_work/work) — committing to it is always 'coerced_testimony'")
                if not h.get("proponents") and not h.get("no_proponent_note"):
                    warn(sid, f"commitment: {hid} has no proponent and no note saying why it is on the board")

        for c in s["choices"]:
            tag = f"choice {c['id']}"
            if not c["effects"]:
                warn(sid, f"{tag}: no state mutation — a choice with no consequence")
            refs = c.get("based_on", [])
            if not refs:
                err(sid, f"{tag}: no based_on — unsupported choice")
            for r in refs:
                a = arts.get(r)
                if not a:
                    err(sid, f"{tag}: based_on {r} does not exist")
                    continue
                if a["type"] in RECON_TYPES and c.get("epistemic_label") == "documented":
                    err(sid, f"{tag}: presents reconstruction {r} as documented")
                if a["type"] == "claim" and c.get("epistemic_label") == "documented":
                    risky = [m for m in a.get("mediation", []) if m.get("shaping_risk") == "high" and m.get("layer") == "subject_self_report"]
                    if risky and not c.get("feedback"):
                        warn(sid, f"{tag}: documented via his own words to a judge ({r}) with no feedback flagging the duress")
                if a.get("status") == "rejected":
                    err(sid, f"{tag}: rests on rejected {r}")
            if not c.get("epistemic_label"):
                warn(sid, f"{tag}: no epistemic label")
            for k, v in (c.get("requires") or {}).items():
                vals = v if isinstance(v, list) else [v]
                missing = [x for x in vals if x not in set_keys.get(k, set())]
                if missing:
                    err(sid, f"{tag}: requires {k}={missing} which no choice ever sets (unreachable)")
            for k in (c.get("requires_min") or {}):
                if k not in positive:
                    err(sid, f"{tag}: requires_min {k} but nothing in the game ever raises it (unreachable)")
            nxt = c.get("next") or s.get("next")
            if not nxt:
                err(sid, f"{tag}: dead end — no next and no END")
            elif nxt != "END" and nxt not in scenes:
                err(sid, f"{tag}: next {nxt} does not exist")

        unconditional = [c for c in s["choices"] if not (c.get("requires") or c.get("requires_min") or c.get("requires_max"))]
        if not unconditional:
            err(sid, "every choice is conditional — the scene can be reached with nothing to pick")
        for a, b in itertools.combinations(s["choices"], 2):
            if a["effects"] == b["effects"] and (a.get("next") or s.get("next")) == (b.get("next") or s.get("next")):
                err(sid, f"choices {a['id']} and {b['id']} are structurally identical")
        if s["epistemic_contract"]["historical_status"] == "documented" and any(c.get("epistemic_label") not in ("documented", None) for c in s["choices"]):
            warn(sid, "scene is labelled documented but offers non-documented choices")

    # every bearing must point at a real piece of evidence, every lens must show something
    hyps = {a["id"]: a for a in arts.values() if a["type"] == "hypothesis"}
    for hid, h in sorted(hyps.items()):
        for b in h["bearings"]:
            ev = arts.get(b["evidence"])
            if not ev:
                err(hid, f"bearing on {b['evidence']} does not exist")
                continue
            if ev["type"] != "evidence":
                err(hid, f"bearing on {b['evidence']} is a {ev['type']}, not evidence")
            elif ev.get("evidence_kind") and ev["evidence_kind"] != b["kind"]:
                err(hid, f"bearing on {b['evidence']} says kind '{b['kind']}' but the evidence is a '{ev['evidence_kind']}'")
        seen = [b["evidence"] for b in h["bearings"]]
        if len(seen) != len(set(seen)):
            err(hid, "reads the same evidence twice")
    for lens in sorted(lenses - {"all"}):
        visible = [(hid, b) for hid, h in hyps.items() for b in h["bearings"]
                   if b["attributed_to"] == lens and b["evidence"] in collectable]
        if not visible:
            err("lenses", f"lens '{lens}' can be adopted but no collectable bearing is attributed to it")
    for hid, h in sorted(hyps.items()):
        unattributed = [b for b in h["bearings"] if b["attributed_to"] == "design inference"]
        if len(unattributed) > len(h["bearings"]) / 2:
            warn(hid, f"{len(unattributed)} of {len(h['bearings'])} readings are the game's own, not a scholar's")

    # graph: reachability from the first scene
    start = first_scene(scenes)
    reach, stack = set(), [start]
    while stack:
        n = stack.pop()
        if n in reach or n == "END" or n not in scenes:
            continue
        reach.add(n)
        stack += [c.get("next") or scenes[n].get("next") for c in scenes[n]["choices"]]
    for sid in scenes:
        if sid not in reach:
            err(sid, "unreachable from the first scene")

    if args.grep:
        msgs = [m for m in msgs if re.search(args.grep, m[1]) ]
    for level, sid, m in msgs:
        print(f"[{level}] {sid}: {m}")
    e = sum(1 for m in msgs if m[0] == "ERROR")
    print(f"{len(scenes)} scenes, start {start}: {e} error(s), {len(msgs) - e} warning(s)")
    return 1 if e else 0


if __name__ == "__main__":
    sys.exit(main())
