// The knowledge portal. Renders entirely from data/research.json + data/palace.json,
// so the essay and the game cannot drift apart: every claim shown here is the same
// record the puzzle mechanics are built on.

import { loadPalace, loadResearch, spriteURL, folioURL } from '../shared/data.js?v=1';

const bodyEl = document.getElementById('body');
const tocEl = document.getElementById('toc');

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const tag = g => `<span class="tag t-${g}">${g}</span>`;

function section(id, title, html) {
  return `<h2 id="${id}">${title}</h2>${html}`;
}

(async function main() {
  const [P, R] = await Promise.all([loadPalace('..'), loadResearch('..')]);
  render(P, R);
})();

function render(P, R) {
  const o = R.object;

  const hero = `
    <div class="hero">
      <img src="${folioURL(P)}" alt="Bihzad, Yusuf fleeing Zulaykha">
      <dl>
        <dt>Artist</dt><dd>${esc(o.artist)}</dd>
        <dt>Manuscript</dt><dd>${esc(o.manuscript)}<br><small>copied by ${esc(o.copied_by)}</small></dd>
        <dt>Patron</dt><dd>${esc(o.patron)}</dd>
        <dt>Date &amp; place</dt><dd>${esc(o.date)}, ${esc(o.place)}</dd>
        <dt>Holding</dt><dd>${esc(o.institution)}<br>${esc(o.shelfmark)}, ${esc(o.folio)}</dd>
        <dt>Position in the book</dt><dd>${esc(o.position_in_book)}</dd>
        <dt>Rights</dt><dd>${tag(o.rights.status)} ${esc(o.rights.basis)}</dd>
      </dl>
    </div>`;

  const intro = `
    <h1>The palace that is not a building</h1>
    <div class="sub">A deep dive on Bihzād's <i>Yūsuf fleeing Zulaykha</i>, and on what happens when you
    take its architecture literally enough to walk through it.</div>
    ${hero}
    <p>This is the last illustrated page of a book of moral poetry, and most of it is a building that the
    poem never mentions. The stairs turn at angles no stair turns at. Balconies are carried on brackets that
    reach down to a wall that has already ended. Doors open at heights where no floor has been drawn. And yet
    every square centimetre — brick, tile, verse, the blank white arch — is finished to the same degree of
    attention. Incoherent space plus uniform attention is not a failure of perspective. It is a refusal of it.</p>
    <div class="callout">
      <strong>What this project does with it.</strong>
      <p>We cut the folio into ${P.pieces.length} interactable elements, assigned each one to a rung of a
      seven-level ascent, and built three playable readings of the same decomposition. The rung assignments are an
      argument, not a caption; the portal marks every claim with how well it is grounded, and the games say so
      out loud where they rest on interpretation.</p>
    </div>`;

  /* --- the story stack --- */
  const s = R.story;
  const storyHTML = `
    <p>Three texts stand behind this picture, and they do not agree about what is in the room.</p>
    <div class="entry"><h3>${tag(s.qurʾanic.grounding)}Qurʾan 12 — the locked doors</h3>
      <p>${esc(s.qurʾanic.summary)}</p><p class="who">${esc(s.qurʾanic.note_for_design)}</p></div>
    <div class="entry"><h3>${tag(s.saadi.grounding)}Saʿdī's <i>Būstān</i> — the book being illustrated</h3>
      <p>${esc(s.saadi.summary)}</p><p class="who">${esc(s.saadi.significance)}</p></div>
    <div class="entry"><h3>${tag(s.jami.grounding)}Jāmī's <i>Yūsuf u Zulaykhā</i> — the seven chambers</h3>
      <p>${esc(s.jami.summary)}</p><p class="who">${esc(s.jami.significance)}</p></div>
    <div class="callout">
      <strong>The hinge of the whole thing.</strong>
      <p>${esc(s.sufi_reading.summary)} Jāmī finished that poem in Herat in 1483. Bihzād painted this folio in
      Herat in 1488. The palace in the picture is not Saʿdī's; it is the one the city had been reading about for
      five years.</p>
    </div>`;

  /* --- readings --- */
  const readingsHTML = R.readings.map(r => `
    <div class="entry ${r.contested ? 'contested' : ''}">
      <h3>${tag(r.grounding)}${esc(r.claim)}</h3>
      <div class="who">— ${esc(r.who)}</div>
      ${r.note ? `<p>${esc(r.note)}</p>` : ''}
      ${r.contested ? `<div class="warn">Contested. ${esc(r.contested_note || '')}</div>` : ''}
    </div>`).join('');

  /* --- corpus evidence --- */
  const corpusHTML = `
    <p>This project holds 43 scholarly sources on Ibn Turka and the Islamicate occult sciences in full text.
    Searching them for this painting returns nothing — see the negative result above. Searching them for the
    <i>cosmology</i> the painting is being read through returns a great deal. Everything below is paraphrased
    with a page reference, and each line names the game mechanic it produced.</p>
    <table>
      <tr><th>Term</th><th>What the corpus says</th><th>Source</th><th>Used for</th></tr>
      ${R.corpus_evidence.map(c => `
        <tr>
          <td><b>${esc(c.term)}</b><br>${tag(c.grounding)}</td>
          <td>${esc(c.paraphrase)}</td>
          <td><small>${esc(c.source)}</small></td>
          <td><small>${esc(c.used_for)}</small></td>
        </tr>`).join('')}
    </table>`;

  /* --- the ladder --- */
  const ladderHTML = `
    <p>Seven rungs. The terms are real and the glosses are grounded; the assignment of painted elements to rungs
    is ours. Prototype C exists specifically so you can disagree with it element by element.</p>
    ${[...P.rungs].reverse().map(r => {
      const members = P.pieces.filter(n => n.rung === r.id);
      return `<div class="rungrow">
        <div class="bar" style="background:${r.colour}"></div>
        <div><b>${esc(r.name)}</b> <small style="color:#9b9490">· ${members.length} elements</small><br>
        <span>${esc(r.gloss)}</span></div></div>`;
    }).join('')}`;

  /* --- the doors --- */
  const doorRows = P.door_chain.map((id, i) => {
    const n = P.byId[id], a = P.byId[n.lock.answer];
    return `<tr>
      <td>${i + 1}</td>
      <td><b>${esc(n.title)}</b></td>
      <td><span style="font-size:1.15rem">${esc(n.lock.term)}</span> <small>${esc(n.lock.concept)}</small></td>
      <td>${esc(n.lock.prompt)}</td>
      <td><small>${esc(a ? a.title : '—')}</small></td>
    </tr>`;
  }).join('');
  const blind = P.byId[P.blind_door];
  const doorsHTML = `
    <p>Eight openings in the picture read as doors. Seven form the chain the puzzle uses, after Jāmī's seven
    chambers. The eighth is a blind, and stays one: not every opening in this palace is a passage, and a game
    about a picture of impossible architecture should not quietly make it possible.</p>
    <table>
      <tr><th>#</th><th>Door</th><th>Inscribed</th><th>Asks</th><th>Answered by</th></tr>
      ${doorRows}
      <tr style="opacity:.65"><td>—</td><td><b>${esc(blind.title)}</b></td><td>—</td>
          <td>${esc(blind.lock.prompt)}</td><td><small>nothing</small></td></tr>
    </table>`;

  /* --- element gallery --- */
  const galleryHTML = `
    <p>The full decomposition. Boxes live in <code>imagelab/data/regions.json</code>; annotations and rungs in
    <code>games/yusuf-ascent/build_palace.py</code>. Both feed <code>data/palace.json</code>, which all three
    prototypes and this page read from.</p>
    <div class="gallery">
      ${P.pieces.map(n => `<figure>
        <img src="${spriteURL(P, n)}" alt="${esc(n.title)}" title="${esc(n.card)}" loading="lazy">
        <figcaption>${esc(n.title)}</figcaption></figure>`).join('')}
    </div>`;

  /* --- people & terms --- */
  const peopleHTML = R.figures.map(f => `
    <div class="entry"><h3>${tag(f.grounding)}${esc(f.name)} <small style="color:#9b9490">${esc(f.dates)}</small></h3>
    <p>${esc(f.card)}</p></div>`).join('');

  const termsHTML = `<table><tr><th>Term</th><th>Gloss</th><th>Grounding</th></tr>
    ${R.concepts.map(c => `<tr><td><b>${esc(c.term)}</b> <span style="font-size:1.05rem">${esc(c.script)}</span></td>
      <td>${esc(c.gloss)}</td><td>${tag(c.grounding)}</td></tr>`).join('')}</table>`;

  /* --- provenance note --- */
  const pc = o.provenance_correction;
  const provHTML = `
    <div class="callout">
      <strong>A correction this dive produced.</strong>
      <p><b>Was:</b> ${esc(pc.was)}<br><b>Now:</b> ${esc(pc.now)}</p>
      <p>${esc(pc.note)}</p>
    </div>
    <p><b>Rights.</b> ${esc(o.rights.basis)}</p>
    <p><b>Still to do.</b> ${esc(o.rights.action_needed)}</p>
    <p><a href="${o.rights.source_url}" target="_blank" rel="noopener">Source file on Wikimedia Commons →</a></p>`;

  /* --- bibliography --- */
  const bibHTML = `<table><tr><th>Work</th><th>Why</th><th>Have it?</th></tr>
    ${R.bibliography.map(b => `<tr>
      <td><b>${esc(b.author)}</b>, <i>${esc(b.title)}</i>${b.year ? `, ${b.year}` : ''}${b.publisher ? ` (${esc(b.publisher)})` : ''}
      ${b.url ? `<br><a href="${b.url}" target="_blank" rel="noopener">link</a>` : ''}</td>
      <td>${esc(b.note)}</td>
      <td><small>${esc(b.status.replace(/_/g, ' ').toLowerCase())}</small></td></tr>`).join('')}</table>`;

  const openHTML = `<ul>${R.open_questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul>`;

  const secs = [
    ['object', 'The object', ''],
    ['story', 'Three texts, one room', storyHTML],
    ['readings', 'How it has been read', readingsHTML],
    ['ladder', 'The seven rungs', ladderHTML],
    ['doors', 'The doors and their locks', doorsHTML],
    ['corpus', 'What our own corpus supports', corpusHTML],
    ['elements', 'Every element', galleryHTML],
    ['people', 'People', peopleHTML],
    ['terms', 'Terms', termsHTML],
    ['provenance', 'Provenance &amp; rights', provHTML],
    ['biblio', 'Bibliography', bibHTML],
    ['open', 'Open questions', openHTML],
  ];

  bodyEl.innerHTML = intro + secs.slice(1).map(([id, t, h]) => section(id, t, h)).join('');
  tocEl.innerHTML = secs.slice(1).map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');

  // Highlight the section in view.
  const links = [...tocEl.querySelectorAll('a')];
  const obs = new IntersectionObserver(es => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }
  }, { rootMargin: '-10% 0px -75% 0px' });
  secs.slice(1).forEach(([id]) => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });

  window.__yusufPortal = { palace: P, research: R };
}
