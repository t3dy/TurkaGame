// export.js — builds the publishable chronicle payload: the full scholarly log.
// Snapshots ALL text as the game said it at publish time, so the published record
// stays an immutable witness even as game content is later revised — which is the
// property a scholarly correction workflow needs. Framework-agnostic.

import { attestedRows } from './career.js?v=8';
import { resolveSource } from '../../content/citations.js?v=1';

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
    // The real citation travels with the record: a witness read years from now, off
    // this site, still says whose scholarship each seal stood on (AUDIT.md §4.3).
    sourceCite: resolveSource(enc.source).cite,
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
    illustrations: [],
  };
}

// ─────────────────────────── reader-contributed illustrations ───────────────────────────
// Any page of a published log can be illustrated by whoever is reading it. The point is
// not decoration: a scholar who recognises the manuscript a scene is describing can
// attach it, and that attachment is worth more than one from an anonymous player.
//
// Hence roles. A contribution from Matthew Melvin-Koushki — whose research the whole
// project is built on — surfaces at the top of the review queue and is flagged for
// attention rather than sitting in a list. That is the entire reason this has priorities
// instead of being a flat array.

export const CONTRIBUTOR_ROLES = {
  scholar: { weight: 100, notify: true, label: 'Scholar' },   // Matt and any other named academic
  owner: { weight: 50, notify: false, label: 'Project' },     // Ted
  player: { weight: 10, notify: false, label: 'Player' },
};

export const ILLUSTRATION_STATUS = ['pending', 'accepted', 'declined'];

/**
 * Attach an image to one entry of a published log.
 *
 * `image.src` may be a remote URL or a data: URL — the payload is a self-contained
 * witness, so an inlined image keeps it self-contained. `image.source` carries the same
 * provenance fields the asset registry uses, because a reader-supplied image needs
 * clearance exactly as much as one we chose ourselves; it is allowed to be incomplete
 * here (this is a brainstorming surface, not the shipping registry) but the shape is the
 * same so entries can be promoted into the registry later without rekeying.
 */
export function addIllustration(payload, entryIndex, image, contributor) {
  const role = CONTRIBUTOR_ROLES[contributor?.role] ? contributor.role : 'player';
  const meta = CONTRIBUTOR_ROLES[role];
  const entry = (payload.log || [])[entryIndex];

  const rec = {
    id: `ill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    entryIndex,
    encounterId: entry ? entry.encounterId : null,
    rubric: entry ? entry.rubric : null,
    addedAt: new Date().toISOString(),
    by: { name: contributor?.name || 'anonymous', role },
    priority: meta.weight,
    notify: meta.notify,
    status: 'pending',
    src: image.src,
    caption: image.caption || '',
    source: {
      repository: image?.source?.repository || null,
      work: image?.source?.work || null,
      shelfmark: image?.source?.shelfmark || null,
      folio: image?.source?.folio || null,
      url: image?.source?.url || null,
      rights: image?.source?.rights || null,
    },
  };

  payload.illustrations = payload.illustrations || [];
  payload.illustrations.push(rec);
  return rec;
}

/** Illustrations for one log entry, best-sourced first. */
export function illustrationsFor(payload, entryIndex) {
  return (payload.illustrations || [])
    .filter((i) => i.entryIndex === entryIndex && i.status !== 'declined')
    .sort((a, b) => b.priority - a.priority);
}

/**
 * What needs looking at, most important first. Scholar contributions sort above
 * everything else and carry notify:true so the UI can raise them rather than list them.
 */
export function reviewQueue(payload) {
  return (payload.illustrations || [])
    .filter((i) => i.status === 'pending')
    .sort((a, b) => (b.priority - a.priority) || (a.addedAt < b.addedAt ? -1 : 1));
}

/** How many pending contributions should actively interrupt the owner. */
export function notifyCount(payload) {
  return reviewQueue(payload).filter((i) => i.notify).length;
}

export function setIllustrationStatus(payload, id, status) {
  if (!ILLUSTRATION_STATUS.includes(status)) throw new Error(`bad status: ${status}`);
  const rec = (payload.illustrations || []).find((i) => i.id === id);
  if (rec) rec.status = status;
  return rec || null;
}
