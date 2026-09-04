---
title: The Glyphs
description: The four elements, three principles, seven planets and twelve signs, each drawn as a canvas path in a shared module so that no sign in v2 or GoldenDawnBlocks ever renders as a font's empty box.
---

# The Glyphs · الرموز

The first artwork this project has made itself. Twenty-six correspondence signs
drawn as **paths** in [`../shared/glyphs.js`](../shared/glyphs.js), and a sheet
([`index.html`](index.html)) that shows them in both hands at every size the games
draw at.

## Why paths and not characters

Every symbol in v2 used to be a Unicode character. The four elements are in the
Alchemical Symbols block, which almost no installed font covers, so the renderer
had substituted solid-against-hollow triangles and left a note apologising. A path
needs no font, never renders as a box, scales, and takes the hand it is drawn in
— the same sign is gold on the night table and ink on the engraved page.

`iso.js` now draws its element faces through this module, so there is one drawing
of each sign, in one place. GoldenDawnBlocks will draw its planetary and zodiacal
blocks from the same sheet.

## What these are, honestly

The standard forms — barred triangles, the tria prima, the seven planetary signs
as early modern printers cut them, the twelve zodiacal sigils — drawn in a
single-weight line the way an engraver would. They are **my drawings of those
forms**, not reproductions of any manuscript or plate. The forms are centuries old
and belong to nobody; the page says so where the viewer is looking at them.

## Checked without a browser

`node v2/tests/glyphs.test.mjs` runs each sign against a recording context and
asks: are there 26 in four families with unique ids; does every one actually put
marks down and stroke them; does every mark stay inside the circle it was given
(with an engraver's margin, measured on curve *endpoints* — control points
overshoot by nature); does doubling the radius double every distance; does the
line weight scale. The bounds test caught Aries' horns flying out on the first
run; the sheet caught Cancer drawn as two detached commas. Both were redrawn.

## Known gaps

- **No grounds yet.** These are the signs; the public-domain manuscript and
  woodcut images they are meant to sit on (creatures, zodiac animals, the elements
  in motion) would come through `imagelab/scripts/fetch_commons.py`'s rights gate.
- **Two weights only** (the caller's `weight`, scaled by radius). No thick-and-thin
  modelling of the stroke, which a real engraver's line has.
- **No Hebrew letter forms** — GoldenDawnBlocks' 22 letters are still characters.
