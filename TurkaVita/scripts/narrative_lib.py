# narrative_lib.py — the state rules shared by the linter, the simulator and (mirrored in
# game/engine.js) the game. If you change one, change the other, then run tests/run.py:
# tests/test_engine_parity.py plays 200 seeded runs through each and diffs them.
#
# Effects:  "score.X" / "profile.X"   -> add a number      (the four axes, and the player's style)
#           "court.X"                 -> add a number      (favour at a court: shahrukh, iskandar, ...)
#           "press.X"                 -> add a number      (pressure: exposure, livelihood, ...)
#           anything else             -> set a value       ("life.trial1": "yazd")
# Requires: {key: value}              -> state[key] == value
#           {key: [v1, v2]}           -> state[key] in list
# Threshold gates: requires_min {key: n} -> state[key] >= n ; requires_max {key: n} -> state[key] <= n
#           (a key never touched reads as 0: the board shows only what has moved, but a gate needs a number)
#
# Order inside a scene:  rulings -> commitment -> composer -> sorter -> the choice.
import glob, io, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AXES = ["doctrine", "biography", "textual", "calibration"]
ADDITIVE = ("score.", "profile.", "court.", "press.")


def load_scenes():
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "narrative", "scenes", "*.json"))):
        with io.open(f, encoding="utf-8") as fh:
            s = json.load(fh)
        out[s["id"]] = s
    return out


def load_artifacts():
    out = {}
    for f in glob.glob(os.path.join(ROOT, "research", "artifacts", "**", "*.json"), recursive=True):
        with io.open(f, encoding="utf-8") as fh:
            a = json.load(fh)
        out[a["id"]] = a
    return out


def _num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def available(choice, state):
    for k, v in (choice.get("requires") or {}).items():
        have = state.get(k)
        if isinstance(v, list):
            if have not in v:
                return False
        elif have != v:
            return False
    for k, v in (choice.get("requires_min") or {}).items():
        if (state.get(k) or 0) < v:
            return False
    for k, v in (choice.get("requires_max") or {}).items():
        if (state.get(k) or 0) > v:
            return False
    return True


def apply(effects, state):
    s = dict(state)
    for k, v in effects.items():
        if k.startswith(ADDITIVE):
            s[k] = s.get(k, 0) + v
        else:
            s[k] = v
    return s


def merge(effect_list):
    """Merge several effect dicts the way the engine applies them one after another."""
    out = {}
    for e in effect_list:
        for k, v in e.items():
            out[k] = out.get(k, 0) + v if (k.startswith(ADDITIVE) and _num(v)) else v
    return out


# ---------------------------------------------------------------------------------- rulings
def ruling_effects(scene, answers):
    """answers: {ruling_id: 'stand'|'refute'} -> merged effects of every ruling."""
    eff = []
    for r in scene.get("rulings") or []:
        eff.append(r["effects_correct"] if answers.get(r["id"]) == r["answer"] else (r.get("effects_wrong") or {}))
    return merge(eff)


def ruling_outcomes(scene):
    """Representative answer sets for simulation: all wrong, half right, all right."""
    rs = scene.get("rulings") or []
    if not rs:
        return [{}]
    flip = lambda a: "refute" if a == "stand" else "stand"
    out = []
    for k in sorted({0, len(rs) // 2, len(rs)}):
        out.append({r["id"]: (r["answer"] if i < k else flip(r["answer"])) for i, r in enumerate(rs)})
    return out


# ---------------------------------------------------------------------------------- the composer
def slot_required(slot, picks):
    """Is this composer slot currently live? A slot with `requires_pick: {slot, options}` only
    applies while the named earlier slot's pick is one of `options` — e.g. 'what does the
    prediction rest on' stops mattering once 'does it predict at all' is answered no. Unknown
    (the dependency hasn't been picked yet) defaults to required, so the player is still asked."""
    req = slot.get("requires_pick")
    if not req:
        return True
    dep = picks.get(req["slot"])
    if dep is None:
        return True
    return dep in req["options"]


def composer_effects(scene, picks):
    """picks: {slot_id: option_id} -> merged effects of the chosen options, in slot order.
    A slot whose requires_pick condition is not met contributes nothing, whether or not `picks`
    happens to carry a stray value for it."""
    comp = scene.get("composer")
    if not comp:
        return {}
    eff = []
    for slot in comp["slots"]:
        if not slot_required(slot, picks):
            continue
        opt = next((o for o in slot["options"] if o["id"] == picks.get(slot["id"])), None)
        if opt:
            eff.append(opt["effects"])
    return merge(eff)


def composer_outcomes(scene):
    """Representative picks for simulation: every slot's first option, every slot's last, and alternating."""
    comp = scene.get("composer")
    if not comp:
        return [{}]
    slots = comp["slots"]
    firsts = {s["id"]: s["options"][0]["id"] for s in slots}
    lasts = {s["id"]: s["options"][-1]["id"] for s in slots}
    alt = {s["id"]: s["options"][(i % 2) * (len(s["options"]) - 1)]["id"] for i, s in enumerate(slots)}
    out = []
    for p in (firsts, lasts, alt):
        if p not in out:
            out.append(p)
    return out


# ---------------------------------------------------------------------------------- the sorter
def kendall(order, truth):
    """Discordant pairs between an ordering and the truth (both lists of ids)."""
    pos = {x: i for i, x in enumerate(truth)}
    seq = [pos[x] for x in order]
    d = 0
    for i in range(len(seq)):
        for j in range(i + 1, len(seq)):
            if seq[i] > seq[j]:
                d += 1
    return d


def sort_effects(scene, order):
    """The collection puzzle. Effect = trunc(max * (pairs - 2*discordant) / pairs): +max for the
    real order, -max for its reverse. Also records the order, for the end screen."""
    srt = scene.get("sorter")
    if not srt:
        return {}
    truth = srt["truth"]
    pairs = len(truth) * (len(truth) - 1) // 2
    d = kendall(order, truth)
    sc = srt.get("scoring") or {}
    eff = {"sort." + scene["id"] + ".distance": d, "sort." + scene["id"] + ".pairs": pairs}
    axis, mx = sc.get("axis", "score.textual"), sc.get("max", 6)
    eff[axis] = int(mx * (pairs - 2 * d) / pairs) if pairs else 0
    for k, v in (sc.get("exact_effects") or {}).items():
        if d == 0:
            eff[k] = v
    return eff


def sort_outcomes(scene):
    srt = scene.get("sorter")
    if not srt:
        return [None]
    t = list(srt["truth"])
    return [t, t[::-1]]


# ---------------------------------------------------------------------------------- flow helpers
def first_scene(scenes):
    if not scenes:
        return None
    targets = {c.get("next") or s.get("next") for s in scenes.values() for c in s["choices"]}
    roots = [sid for sid in sorted(scenes) if sid not in targets]
    return roots[0] if roots else sorted(scenes)[0]


# --------------------------------------------------------------------------- the record's own course

def historical_walk(scenes, hyps):
    sid, state, trail, seen = first_scene(scenes), {}, [], set()
    while sid != "END":
        if sid in seen:
            return trail, state, f"cycle at {sid}"
        seen.add(sid)
        s = scenes[sid]
        if s.get("rulings"):
            wrong = {r["id"]: ("refute" if r["answer"] == "stand" else "stand") for r in s["rulings"]}
            state = apply(ruling_effects(s, wrong), state)
        if s.get("commitment"):
            state = apply(commit_effects(hyps, state, s, s["commitment"]["underdetermined_option"]), state)
        if s.get("composer"):
            state = apply(composer_effects(s, {x["id"]: x["options"][0]["id"] for x in s["composer"]["slots"]}), state)
        if s.get("sorter"):
            state = apply(sort_effects(s, list(reversed(s["sorter"]["truth"]))), state)
        hist = [c for c in s["choices"] if c.get("historical")]
        if s.get("unrecorded"):
            pick = next((c for c in s["choices"] if not (c.get("requires") or c.get("requires_min") or c.get("requires_max"))), None)
        else:
            pick = hist[0] if hist else None
        if pick is None:
            return trail, state, f"{sid}: no historical choice and not marked unrecorded"
        if not available(pick, state):
            return trail, state, f"{sid}: the historical choice {pick['id']} is closed to a player who followed the record so far (state {({k: v for k, v in state.items() if k.startswith(('court.', 'press.'))})})"
        trail.append((sid, pick["id"]))
        state = apply(pick["effects"], state)
        sid = pick.get("next") or s["next"]
    return trail, state, None


# --------------------------------------------------------------------------- the provenance dossier
#
# A hypothesis (HYP-*) says, datum by datum, how it reads the evidence. The player collects data
# during play ("dossier.EV-0104": True) and may adopt a scholar's lens ("lens": "Leonard Lewisohn"),
# which narrows the readings on show to the ones that scholar actually asserts. Standing is a count
# of readings, never a truth value, and the game never scores which hypothesis is correct: it scores
# whether the player's commitment matches the dossier they themselves assembled, and whether they
# claimed to know what he HELD on evidence that cannot carry that (the duress rule).
# Mirrored in game/engine.js — change both.

# What can show what he held: things he wrote freely, before or beside the accusations. An apology
# or a creed tract was written to his judges; a chronicle or a hagiography is someone else's account.
HELD_KINDS = {"letter", "colophon", "autograph", "early_work", "work"}
UNDETERMINED_MARGIN = 2                       # a lead of less than this is not a lead


def dossier(state):
    return {k[len("dossier."):] for k, v in state.items() if k.startswith("dossier.") and v}


def lens_of(state):
    return state.get("lens") or "all"


def _visible(bearing, lens):
    return lens == "all" or bearing["attributed_to"] == lens


def standings(hypotheses, state):
    """[{id, letter, name, supports, strains, net, kinds}] over the dossier, best net first."""
    have, lens, out = dossier(state), lens_of(state), []
    for h in sorted(hypotheses.values(), key=lambda x: x["letter"]):
        sup = [b for b in h["bearings"]
               if b["evidence"] in have and _visible(b, lens) and b["direction"] == "supports"]
        strain = [b for b in h["bearings"]
                  if b["evidence"] in have and _visible(b, lens) and b["direction"] == "strains"]
        out.append({"id": h["id"], "letter": h["letter"], "name": h["name"],
                    "supports": len(sup), "strains": len(strain), "net": len(sup) - len(strain),
                    "kinds": sorted({b["kind"] for b in sup})})
    out.sort(key=lambda r: (-r["net"], r["letter"]))
    return out


def verdict(hypotheses, state):
    """Where the dossier points, and whether it points anywhere. Never 'which is true'."""
    st = standings(hypotheses, state)
    if not dossier(state) or not st:
        return {"leader": None, "net": 0, "margin": 0, "underdetermined": True, "empty": True,
                "standings": st}
    margin = st[0]["net"] - st[1]["net"] if len(st) > 1 else st[0]["net"]
    return {"leader": st[0]["id"], "net": st[0]["net"], "margin": margin,
            "underdetermined": margin < UNDETERMINED_MARGIN, "empty": False, "standings": st}


def commit_tags(hypotheses, state, scene, hyp_id):
    """The outcome labels for committing to hyp_id, given the dossier the player built."""
    block = scene.get("commitment") or {}
    unknown_option = block.get("underdetermined_option")
    v = verdict(hypotheses, state)
    h = hypotheses[hyp_id]
    if v["empty"]:
        return ["empty_dossier"]
    tags = []
    if v["underdetermined"]:
        if hyp_id == unknown_option:
            tags.append("calibrated_unknown")
        elif h["commitments"]["conviction"]:
            tags.append("false_certainty")
        else:
            tags.append("non_conviction")
    else:
        if hyp_id == v["leader"]:
            tags.append("coherent")
        elif hyp_id == unknown_option:
            tags.append("over_caution")
        else:
            tags.append("incoherent")
    if h["commitments"]["conviction"]:
        row = next((r for r in v["standings"] if r["id"] == hyp_id), None)
        if not (row and HELD_KINDS & set(row["kinds"])):
            tags.append("coerced_testimony")
    return tags


def commit_effects(hypotheses, state, scene, hyp_id):
    """Merged effects of those tags, plus the record of what was committed."""
    block = scene.get("commitment") or {}
    scoring = block.get("scoring") or {}
    tags = commit_tags(hypotheses, state, scene, hyp_id)
    eff = merge([(scoring.get(t) or {}) for t in tags])
    eff["who.commit"] = hyp_id
    eff["who.verdict"] = ",".join(tags)
    return eff


def commit_outcomes(hypotheses, scene, state):
    """Representative commitments for simulation: the dossier's leader, the UNKNOWN option, and
    one position that claims to know his conviction."""
    block = scene.get("commitment")
    if not block:
        return [None]
    opts = [o["hypothesis"] for o in block["options"]]
    v = verdict(hypotheses, state)
    claiming = next((h for h in opts if hypotheses[h]["commitments"]["conviction"]), None)
    picks = [v["leader"], block["underdetermined_option"], claiming]
    return [p for p in dict.fromkeys(picks) if p in opts] or opts[:1]


def load_hypotheses():
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "research", "artifacts", "hypotheses", "*.json"))):
        with io.open(f, encoding="utf-8") as fh:
            h = json.load(fh)
        out[h["id"]] = h
    return out
