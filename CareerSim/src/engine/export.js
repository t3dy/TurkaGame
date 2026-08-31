// export.js — builds the publishable chronicle payload: the full scholarly log.
// Snapshots ALL text as the game said it at publish time, so the published record
// stays an immutable witness even as game content is later revised — which is the
// property a scholarly correction workflow needs. Framework-agnostic.

import { attestedRows } from './career.js?v=5';

export const PAYLOAD_V = 1;

// Called at choose()-time by main.js: capture the encounter in full — situation,
// every option offered (with provenance and lock reasons), what was chosen, how it
// resolved. This is what lets a reviewing scholar correct the CONTENT, not just
// the story prose.
export function logEntry(state, enc, evaluated, chosenIdx, result) {
  return {
    i: (state.runLog || []).length,
    phase: state.phase,
    encounterId: enc.id,
    rubric: enc.rubric,
    grounding: enc.grounding,
    source: enc.source,
    situation: enc.situation,
    plate: enc.plate ? { src: enc.plate.src, caption: enc.plate.caption } : null,
    options: evaluated.map((ev, idx) => ({
      label: ev.opt.label,
      detail: ev.opt.detail,
      chosen: idx === chosenIdx,
      locked: !ev.available,
      unlockedBy: ev.unlockedBy,
      lockedBy: ev.lockedBy,
      favoredBy: ev.favoredBy,
    })),
    band: result.band,
    outcomeText: result.text,
    chronicle: result.chronicleLine ? { orig: result.chronicleLine, current: result.chronicleLine } : null,
  };
}

export function buildChroniclePayload(state, verdict, phases) {
  return {
    v: PAYLOAD_V,
    game: 'ibn-turka-occult-court',
    createdAt: new Date().toISOString(),
    title: 'The Chronicle of ʿAlī ibn Turka',
    preface: { orig: '', current: '' }, // editable scholar-facing preface, empty until someone writes one
    meta: {
      verdict: {
        manTitle: verdict.man.title, manText: verdict.man.text,
        systemTitle: verdict.system.title, systemText: verdict.system.text,
      },
      meters: { ...state.meters },
      rep: { ...state.rep },
      quintet: { ...state.quintet },
      companions: state.people.length,
      phases: (phases || []).map((p) => ({ id: p.id, name: p.name, dateline: p.dateline })),
    },
    legacyNotes: verdict.notes || [],
    attested: attestedRows(state),
    log: state.runLog || [],
    annotations: [],
    revisions: [],
  };
}
