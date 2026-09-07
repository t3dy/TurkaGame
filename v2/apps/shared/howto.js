// howto.js — the How-to-play panel every v2 prototype carries.
//
// House rule (CLAUDE.md, 2026-09-07, in Ted's words): "the controls are really
// opaque and the goals of the game are really confusing. You have a bad habit of
// writing really short and cryptic hints or clues when I want full instructions."
// So every app mounts this panel with FULL SENTENCES for: the goal and how you
// know you have won or lost; every control (mouse, keyboard, button); what the
// cursor is and where the next action lands; how to preview a move before
// committing; how to rotate, zoom and reset the camera. The corner legend is in
// addition to this, never instead of it. Write the long version; Ted will cut.
//
// The panel opens on first visit to each app (remembered per app in
// localStorage) and any time the "How to play" button or the ? key is pressed.

const KEY = id => `turka.v2.howto.seen.${id}`;

/** The camera section is the same in every app, because the camera is. */
export const CAMERA_SECTION = {
  h: 'The camera: turning, zooming, panning, resetting',
  items: [
    'The world is drawn in isometric view. You are looking down at it from one of four corners. The little compass arrow on the floor points the way words run (westward, which is to the left as Arabic is written); when you turn the world, the arrow turns with it, so you always know which way a word will lay out.',
    'Turn the world a quarter: press Q (left) or E (right), or click the ⟲ and ⟳ buttons above the board. Everything, including the compass, turns together. The label beside the buttons tells you which corner you are looking from.',
    'Zoom: press + (or =) to zoom in and − to zoom out, click the + and − buttons, or roll the mouse wheel over the board.',
    'Pan: hold the RIGHT mouse button (or Shift and the left button) and drag the board; or press the arrow keys to nudge it.',
    'Reset: press R or click ⌂ to put the camera back where it started. The board also re-centres itself automatically whenever the level changes.',
  ],
};

/** Every app that lets you click on a cell explains the cursor the same way. */
export const CURSOR_SECTION = {
  h: 'The cursor: knowing where your action will land',
  items: [
    'Move the mouse over the board and the cell under it is outlined in turquoise with the word "cursor". That outline is where your next click acts. If nothing is outlined, the mouse is not over a cell you can act on.',
    'The board has height. The cursor snaps to the nearest cell in the column under the mouse, at ground level or on top of something standing, so to reach a higher cell move the mouse up until the outline jumps to it.',
    'A cell you cannot act on right now (because something is already there, or because nothing would touch the piece you are placing) shows a red × instead of the turquoise outline, and the message line under the board says why.',
  ],
};

/**
 * Mount the panel. `spec` is { id, title, goal: [..sentences], sections: [{h, items:[..]}] }.
 * The camera and cursor sections are appended automatically unless `spec.noCamera`
 * / `spec.noCursor` is set. `button` is the topbar button that opens it.
 */
export function mountHowTo(button, spec) {
  let el = document.getElementById('howto');
  if (!el) {
    el = document.createElement('div');
    el.id = 'howto';
    document.body.appendChild(el);
    const st = document.createElement('style');
    st.textContent = `
      #howto{position:fixed;inset:0;display:none;align-items:flex-start;justify-content:center;z-index:50;
        background:rgba(16,15,22,.78);overflow-y:auto;padding:4vh 1rem;font-family:"Inter","Segoe UI",system-ui,sans-serif}
      #howto.show{display:flex}
      #howto .card{max-width:720px;width:100%;background:var(--bg2,#211f2b);color:var(--paper,#f1dac1);
        border:1px solid var(--gold,#c99a2e);border-radius:4px;padding:1.2rem 1.5rem 1.4rem;font-size:.86rem;line-height:1.6}
      #howto h2{margin:0 0 .3rem;font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;font-weight:500;font-size:1.35rem;color:var(--gold-hi,#e8c86a)}
      #howto h3{margin:1rem 0 .3rem;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--gold-hi,#e8c86a)}
      #howto ul{margin:.2rem 0 .4rem;padding-left:1.2rem}
      #howto li{margin:.3rem 0}
      #howto p{margin:.35rem 0}
      #howto .goal{border-left:3px solid var(--turq,#2e8f8f);padding-left:.8rem;margin:.5rem 0 .8rem}
      #howto .close{float:right;font-size:.74rem;padding:.3rem .6rem;border:1px solid var(--gold,#c99a2e);border-radius:2px;
        background:transparent;color:var(--paper,#f1dac1);cursor:pointer}
      #howto kbd{font-family:"Cascadia Mono",Consolas,monospace;font-size:.78em;border:1px solid var(--rule,rgba(241,218,193,.3));
        border-radius:2px;padding:0 .3em;background:rgba(0,0,0,.2)}
      html[data-hand="ink"] #howto{background:rgba(60,45,30,.55)}
      html[data-hand="ink"] #howto .card{background:#f3e9d6;color:#2b2116;border-color:#8c6a2b}
      html[data-hand="ink"] #howto h2, html[data-hand="ink"] #howto h3{color:#6b4a15}
      html[data-hand="ink"] #howto .close{color:#2b2116;border-color:#8c6a2b}
      html[data-hand="ink"] #howto kbd{background:rgba(255,250,240,.7);border-color:#b8a17c}
    `;
    document.head.appendChild(st);
  }
  const sections = spec.sections.slice();
  if (!spec.noCursor) sections.push(CURSOR_SECTION);
  if (!spec.noCamera) sections.push(CAMERA_SECTION);
  const kbd = t => t.replace(/\[\[([^\]]+)\]\]/g, '<kbd>$1</kbd>');
  el.innerHTML = `<div class="card">
    <button class="close" id="howto-close">Close (Esc)</button>
    <h2>${spec.title}</h2>
    <div class="goal">${spec.goal.map(p => `<p>${kbd(p)}</p>`).join('')}</div>
    ${sections.map(s => `<h3>${s.h}</h3><ul>${s.items.map(i => `<li>${kbd(i)}</li>`).join('')}</ul>`).join('')}
    <p style="margin-top:1rem;color:var(--dim,#b9b0a6);font-size:.76rem">Press <kbd>?</kbd> at any time to open this again. Close it with Esc, the button, or a click outside the card.</p>
  </div>`;
  const open = () => { el.classList.add('show'); };
  const close = () => { el.classList.remove('show'); try { localStorage.setItem(KEY(spec.id), '1'); } catch { /* fine */ } };
  el.querySelector('#howto-close').onclick = close;
  el.onclick = ev => { if (ev.target === el) close(); };
  if (button) button.onclick = open;
  addEventListener('keydown', ev => {
    if (ev.key === 'Escape') close();
    if (ev.key === '?' && !(ev.target && /INPUT|SELECT|TEXTAREA/.test(ev.target.tagName))) open();
  });
  let seen = false;
  try { seen = !!localStorage.getItem(KEY(spec.id)); } catch { /* fine */ }
  if (!seen) open();
  return { open, close };
}
