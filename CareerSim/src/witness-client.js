// witness-client.js — publishes a finished run to the witness service.
//
// The game itself stays a static site (GitHub Pages). Only *publishing* needs a
// server, so the witness service is a separate, tiny Vercel deployment that the
// game calls cross-origin. One game build, one service — no second copy of the
// game to drift out of sync.
//
// Architecture: docs/PLAYTHROUGH_WITNESS_ARCHITECTURE.md (written for MORIGNY in
// the DungeonAB repo; this is the same contract, second game).

export const WITNESS_SERVICE =
  // Same-origin when the game is served from the witness deployment itself;
  // otherwise the hosted service.
  (typeof location !== 'undefined' && /vercel\.app$/.test(location.hostname))
    ? ''
    : 'https://turka-witness.vercel.app';

/**
 * POST a finished chronicle. Returns { id, publicUrl, playerEditUrl, scholarEditUrl }.
 * Throws with a human-readable message the ending screen can show as-is.
 */
export async function publishWitness(payload) {
  const body = {
    game: 'ibn-turka-occult-court',
    origin: 'played',
    title: payload?.title || 'The Chronicle of ʿAlī ibn Turka',
    ...payload,
  };

  let res;
  try {
    res = await fetch(`${WITNESS_SERVICE}/api/publish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error('Could not reach the witness service. Are you offline?');
  }

  let out;
  try {
    out = await res.json();
  } catch (err) {
    throw new Error(`The service answered in a way we could not read (${res.status}).`);
  }
  if (!res.ok) throw new Error(out.error || `The service refused the chronicle (${res.status}).`);
  return out;
}
