// index.js — aggregates all phases into the structures the engine consumes.

import { PEOPLE, ARTIFACTS } from './people.js?v=2';
import * as P1 from './phase1.js?v=3';
import * as P2 from './phase2.js?v=2';
import * as P3 from './phase3.js?v=2';
import * as P4 from './phase4.js?v=2';
import * as P5 from './phase5.js?v=2';

const MODULES = [P1, P2, P3, P4, P5];

export { PEOPLE, ARTIFACTS };

export const PHASES = MODULES.map((m) => ({ ...m.PHASE, nodes: m.NODES }));

export const ENCOUNTERS = MODULES.reduce((acc, m) => Object.assign(acc, m.ENCOUNTERS), {});

export function phaseById(id) {
  return PHASES.find((p) => p.id === id);
}

export const LAST_PHASE = PHASES[PHASES.length - 1].id;
