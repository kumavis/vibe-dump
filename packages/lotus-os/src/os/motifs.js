// motifs.js — the ornament, and only the ornament.
//
// Thai temple decoration is a grammar, not an iconography: the flame scroll,
// the roof finial, the serpent's crest and the four-petal diaper are all one
// curve under different pressure. That vocabulary is the whole of this file.
// Nothing sacred is depicted and nothing royal is borrowed — a building's
// edges are fair game, what stands inside one is not. Everything draws in
// currentColor so the gold and accent systems drive it without a repaint.

import { round } from './util.js'

/** Repeat one path around a centre. Rotational symmetry is most of the grammar. */
const ring = (d, angles, cx, cy) =>
  angles.map((a) => (a ? `<path d="${d}" transform="rotate(${a} ${cx} ${cy})"/>` : `<path d="${d}"/>`)).join('')

/** Mirror markup across the vertical midline of a `w`-wide viewBox. */
const mirrorX = (w, body) => `<g transform="translate(${w} 0) scale(-1 1)">${body}</g>`

const line = (viewBox, body, w = 1.35) =>
  `<svg viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

const solid = (viewBox, body) => `<svg viewBox="${viewBox}" fill="currentColor" stroke="none" aria-hidden="true">${body}</svg>`

const QUARTERS = [0, 90, 180, 270]
const DIAGONALS = [45, 135, 225, 315]

// --- small marks ----------------------------------------------------------
//
// All on the same 24-unit grid as icons.js, except the three that are shaped
// by the slot they sit in: the menu rule, the sheet crown and the gate. The
// six chrome names (folder, doc, terminal, gear, info, image) are deliberately
// *not* the icons.js glyphs — a title bar mark is ornament in gold, a toolbar
// icon is signage, and the two registers should not be confused.

const PETAL_FRONT = 'M12 12.8C9.2 9.9 8.7 5.8 12 2.3C15.3 5.8 14.8 9.9 12 12.8Z'
const PETAL_BACK = 'M12 12.2C9.9 10.1 9.4 7.2 12 4.6C14.6 7.2 14.1 10.1 12 12.2Z'
const PETAL_TINY = 'M12 12.4C9 11 8.6 6.6 12 3.4C15.4 6.6 15 11 12 12.4Z'

// The flame body and its inward spiral, kept apart: at 15px only the body
// survives, and it still reads as a kranok.
const KRANOK_BODY =
  'M5 20.4C12.4 20.2 18 17.2 19.2 12C20.4 6.8 17.2 3.2 13 3.6C9.2 4 7.4 7 8.4 9.8C6.8 13.2 6 17 5 20.4Z'
const KRANOK_CURL = 'M13.6 6.4C15.8 6.8 16.4 9.2 15 10.6C13.8 11.8 12 11.2 11.8 9.6'

// One wing of the sheet crown; the other is this one mirrored.
const CROWN_WING =
  '<path d="M50 23C40.6 23.6 31.4 22.4 23 19C16.6 16.4 12 12.8 9.4 8.2C8.6 6.8 6.8 7.2 6.6 8.8C6.4 10.4 7.4 11.6 9 11.8"/>' +
  '<path d="M34 21.6c1-.6 1.4-1.8 1-3.2" opacity=".8"/>' +
  '<path d="M24.6 18.4c1.1-.5 1.6-1.6 1.3-3" opacity=".8"/>'

const MARKS = {
  lotusMark: line(
    '0 0 24 24',
    `<g fill="currentColor" fill-opacity=".45" stroke="none">${ring(PETAL_BACK, DIAGONALS, 12, 12)}</g>` +
      ring(PETAL_FRONT, QUARTERS, 12, 12) +
      '<circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"/>',
    1.25,
  ),

  lotusSmall: solid(
    '0 0 24 24',
    ring(PETAL_TINY, [0, 60, 120, 180, 240, 300], 12, 12) + '<circle cx="12" cy="12" r="2.4"/>',
  ),

  kranok: line(
    '0 0 24 24',
    `<path d="${KRANOK_BODY}" fill="currentColor" fill-opacity=".14"/><path d="${KRANOK_CURL}"/>`,
    1.4,
  ),

  rule: line(
    '0 0 200 7',
    '<path d="M3 3.5H85.4" opacity=".55"/><path d="M114.6 3.5H197" opacity=".55"/>' +
      '<path d="M85.4 3.5c3.2 0 5-.9 5.8-2.7"/><path d="M114.6 3.5c-3.2 0-5-.9-5.8-2.7"/>' +
      '<circle cx="94.4" cy="3.5" r=".8" fill="currentColor" stroke="none"/>' +
      '<circle cx="105.6" cy="3.5" r=".8" fill="currentColor" stroke="none"/>' +
      '<path d="M100 .7c.7 1.5 1.6 2.3 3 2.8c-1.4.5-2.3 1.3-3 2.8c-.7-1.5-1.6-2.3-3-2.8c1.4-.5 2.3-1.3 3-2.8Z" fill="currentColor" stroke="none"/>',
    0.9,
  ),

  crown: line(
    '0 0 116 26',
    '<path d="M10 24.4H106" opacity=".3"/>' +
      CROWN_WING +
      mirrorX(116, CROWN_WING) +
      '<path d="M52.4 24C52 19.4 54.2 16.6 58 15.2C61.8 16.6 64 19.4 63.6 24Z" fill="currentColor" fill-opacity=".16"/>' +
      '<path d="M55.4 14.2h5.2"/><path d="M56.4 11.8h3.2"/>' +
      '<path d="M58 2.6C58.8 5.6 59.1 8.6 59 11.6H57C56.9 8.6 57.2 5.6 58 2.6Z" fill="currentColor" stroke="none"/>' +
      '<path d="M50 24h16" opacity=".7"/>',
    1.2,
  ),

  // The one glyph on the desktop that is an invitation. It has to read as a
  // doorway with something on the far side of it, at 42px, in one glance.
  gate: line(
    '0 0 44 44',
    '<path d="M2.4 41.8H41.6" opacity=".5"/>' +
      '<path d="M4.6 41C6.2 37.4 7.4 33.2 7.4 27.2C7.4 21.6 13.2 15 22 6.2C30.8 15 36.6 21.6 36.6 27.2C36.6 33.2 37.8 37.4 39.4 41" fill="currentColor" fill-opacity=".1"/>' +
      '<path d="M15 41V30.6C15 26.8 17.7 22.9 22 18.6C26.3 22.9 29 26.8 29 30.6V41"/>' +
      '<path d="M5.2 27.2h4.4"/><path d="M34.4 27.2h4.4"/><path d="M20.2 8.8h3.6" opacity=".8"/>' +
      '<path d="M22 6.4C20.9 4.7 21.1 2.9 22 1.5C22.9 2.9 23.1 4.7 22 6.4Z" fill="currentColor" stroke="none"/>',
    1.5,
  ),

  folder: line(
    '0 0 24 24',
    '<path d="M3.6 8c0-.9.7-1.6 1.6-1.6h3.5l1.8 2.1h8.1c.9 0 1.6.7 1.6 1.6v7.7c0 .9-.7 1.6-1.6 1.6H5.2c-.9 0-1.6-.7-1.6-1.6z"/>' +
      '<path d="M12 12.2c-1 1.1-1 2.7 0 3.8c1-1.1 1-2.7 0-3.8Z" fill="currentColor" stroke="none"/>',
  ),

  // A bai lan — the palm-leaf manuscript. Two cord holes and a long leaf is
  // what a document looked like here before it looked like a sheet of A4.
  doc: line(
    '0 0 24 24',
    '<rect x="2.6" y="8.2" width="18.8" height="7.6" rx="2.4"/>' +
      '<circle cx="8.4" cy="12" r=".95" fill="currentColor" stroke="none"/>' +
      '<circle cx="15.6" cy="12" r=".95" fill="currentColor" stroke="none"/>' +
      '<path d="M5 10.4h1.8M17.2 10.4h1.8M5 13.6h1.8M17.2 13.6h1.8" opacity=".55"/>',
  ),

  terminal: line(
    '0 0 24 24',
    '<rect x="3.4" y="5.2" width="17.2" height="13.6" rx="1.6"/>' +
      '<path d="M3.4 8.8h17.2" opacity=".5"/>' +
      '<path d="M7.4 11.6l2.8 2.4-2.8 2.4"/><path d="M13 16.4h4.4" opacity=".8"/>',
  ),

  gear: line(
    '0 0 24 24',
    '<circle cx="12" cy="12" r="6.4"/><circle cx="12" cy="12" r="2.3"/>' +
      ring('M12 3.4v2.2', [0, 60, 120, 180, 240, 300], 12, 12),
  ),

  info: line(
    '0 0 24 24',
    '<circle cx="12" cy="12" r="8.4"/><path d="M12 11.4v5"/>' +
      '<circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>',
  ),

  image: line(
    '0 0 24 24',
    '<rect x="3.6" y="5" width="16.8" height="14" rx="1.6"/>' +
      '<path d="M9.6 16.2c-.4-2.8 1-4.8 2.4-5.6c1.4.8 2.8 2.8 2.4 5.6Z" fill="currentColor" fill-opacity=".2"/>' +
      '<path d="M8.6 16.2h6.8" opacity=".8"/><path d="M12 10.4V7.4"/><path d="M10.9 8.8h2.2" opacity=".7"/>',
  ),
}

// --- the six shapes, drawn large ------------------------------------------
//
// A 64-unit grid, outlined and washed rather than filled solid: at 300px the
// interior detail has to survive, and a currentColor line over a currentColor
// fill is an invisible line. The wash carries the shape down to 30px, where
// the detail has given up anyway.

const LOTUS_OUTER = 'M32 29C23.4 24 21.6 14.4 32 6C42.4 14.4 40.6 24 32 29Z'
const LOTUS_INNER = 'M32 30C26.4 26.4 25.2 20 32 15C38.8 20 37.6 26.4 32 30Z'

// One outline and two overlap lines. Drawing all three petals as closed shapes
// gives you four near-vertical strokes down the middle and the bud turns into
// a bunch of leaves; the outer petals are better implied than outlined.
const BUD_BODY =
  'M32 56C20.4 50 14.6 39.6 15.8 28.4C16.8 18.6 22.8 9.6 32 3C41.2 9.6 47.2 18.6 48.2 28.4C49.4 39.6 43.6 50 32 56Z'
const BUD_FOLD = 'M32 55.4C26.6 48.6 24 39.4 24.6 30C25 22.6 26.6 16.6 29.6 11.6'

const ART = {
  lotus: {
    label: 'Lotus',
    caption:
      'Eight petals in two layers of four, seen from directly above, the inner four offset by half a step so the bloom never resolves into a cross. The disc in the middle is the seed pod and is the only part that is not a petal.',
    draw: ({ fine, wash }) =>
      `<g fill="currentColor" fill-opacity="${round(wash * 0.8, 3)}">${ring(LOTUS_OUTER, QUARTERS, 32, 32)}</g>` +
      `<g fill="currentColor" fill-opacity="${round(wash * 1.7, 3)}">${ring(LOTUS_INNER, DIAGONALS, 32, 32)}</g>` +
      `<circle cx="32" cy="32" r="6.4" fill="currentColor" fill-opacity="${round(wash * 2.2, 3)}"/>` +
      '<circle cx="32" cy="32" r="2.2" fill="currentColor" stroke="none"/>' +
      `<g stroke-width="${fine}" opacity=".55">${ring('M32 26.4V11', QUARTERS, 32, 32)}</g>`,
  },

  bud: {
    label: 'Bud',
    caption:
      'Three petals in profile: one long centre and two flanks wrapping it, all meeting at a single point. Put it on a stepped plinth and it is a Sukhothai prang — the same drawing at building scale.',
    draw: ({ fine, wash }) =>
      `<path d="${BUD_BODY}" fill="currentColor" fill-opacity="${round(wash * 1.4, 3)}"/>` +
      `<g stroke-width="${fine}" opacity=".8">` +
      `<path d="${BUD_FOLD}"/>${mirrorX(64, `<path d="${BUD_FOLD}"/>`)}</g>` +
      `<g stroke-width="${fine}" opacity=".7"><path d="M22.6 58.4H41.4"/><path d="M26 62H38"/></g>`,
  },

  kranok: {
    label: 'Kranok',
    caption:
      'A teardrop that eats its own tail: the tip spirals inward and the outer edge carries three yhuk, the small returning hooks that keep the line from going slack. Every larger kranok is made of smaller ones on this curve.',
    draw: ({ fine, wash }) =>
      '<path d="M8 56C30 55 46 46 50 32C54 18 47 8 36 8.6C26 9.2 21 17 24 24.6C19 33 14 44 8 56Z" ' +
      `fill="currentColor" fill-opacity="${round(wash, 3)}"/>` +
      '<path d="M37.6 15.4C45.4 17 47.4 26.2 42 30.8C37.6 34.6 31.2 31.8 31.4 26.2"/>' +
      `<g stroke-width="${fine}" opacity=".75">` +
      '<path d="M26 53c2-3.4 1.8-6.6-.8-9.4"/>' +
      '<path d="M39.8 46.2c2.4-3 2.6-6.2.4-9.2"/>' +
      '<path d="M47.4 38c1.8-2.8 2-5.8.4-8.6"/></g>',
  },

  chofa: {
    label: 'Chofa',
    caption:
      'One hooked stroke rising off a roof ridge, thick at the base and cusped at the tip where both edges meet. It only works because the ridge underneath it is dead straight.',
    draw: ({ fine, wash }) =>
      '<path d="M23 58C36 52 46 30 45 5C41 22 26 42 9 57Z" ' +
      `fill="currentColor" fill-opacity="${round(wash, 3)}"/>` +
      `<g stroke-width="${fine}" opacity=".7">` +
      '<path d="M21 53.6C31 47.6 39.4 35.8 41.6 21.6"/>' +
      '<path d="M1 61.2C3.6 60.8 6.2 59.6 8.4 57.8"/>' +
      '<path d="M4.6 60.4c1.2-1.4 1.6-3.2 1-4.8"/></g>',
  },

  chedi: {
    label: 'Chedi',
    caption:
      'A bell on two stepped plinths under five diminishing rings. The spire takes almost half the total height, which is the only thing stopping the silhouette from reading as a table lamp.',
    draw: ({ fine, wash }) =>
      `<g fill="currentColor" fill-opacity="${round(wash, 3)}">` +
      '<path d="M17.4 58V51.6H46.6V58Z"/><path d="M20.6 51.6V46.4H43.4V51.6Z"/>' +
      '<path d="M24 46.4C24 36.4 26.6 30.6 29 27H35C37.4 30.6 40 36.4 40 46.4Z"/></g>' +
      '<path d="M14 58H50" opacity=".55"/>' +
      `<g stroke-width="${fine}">` +
      '<path d="M28.8 24.6H35.2"/><path d="M29.4 22H34.6"/><path d="M30 19.6H34"/>' +
      '<path d="M30.6 17.4H33.4"/><path d="M31 15.4H33"/></g>' +
      '<path d="M32 15.4V5"/><circle cx="32" cy="4" r="1.5" fill="currentColor" stroke="none"/>',
  },

  naga: {
    label: 'Naga',
    caption:
      'A body of repeated scrolls with a crest made of the same scroll, fanned out at the head. The tail curls back on itself because a balustrade has to end somewhere and a serpent will not simply stop.',
    draw: ({ fine, wash }) =>
      `<g fill="currentColor" fill-opacity="${round(wash, 3)}">` +
      '<path d="M4 52.4C15.4 50.6 26 45.6 33.6 37.6C38.8 32.2 42.6 25.8 44.6 18.6L52.4 20.6C50 29.4 45.2 37.4 38.4 44C29.8 52.4 17.2 57.4 4.6 59Z"/>' +
      '<path d="M45 20.4C44 13.6 46 7.4 51 2.4C50.4 8.8 50.4 14.8 51.4 20.4Z"/>' +
      '<path d="M48.6 21.6C50.6 15.6 55 11.2 61.2 9.2C57 12.8 54 17.2 52.4 22.4Z"/>' +
      '<path d="M42.6 20.8C40.4 15.6 40.4 10.2 42.6 5C44 10.2 45.2 15.2 45.8 20.4Z"/></g>' +
      '<path d="M4.4 55.4C1.8 56.8 1.4 60 3.6 61.4C5.6 62.6 8 61.6 8.2 59.4"/>' +
      `<g stroke-width="${fine}" opacity=".75">` +
      '<path d="M15.6 49.4c-.6-3.6 1.2-6.4 4.4-7.4"/>' +
      '<path d="M26.2 44.2c-1-3.4.4-6.2 3.4-7.6"/>' +
      '<path d="M38.4 32c-1.8-3-1.4-6 1-8.6"/></g>',
  },

  prajamYam: {
    label: 'Prajam Yam',
    caption:
      'Four petals inside a diamond inside a square, symmetric on both axes and on the 45-degree lattice between them. The quarter-motifs at the corners are what let it tile forever; it is the only shape here that wants to.',
    draw: ({ fine, wash }) =>
      `<g stroke-width="${fine}" opacity=".4"><path d="M4 4H60V60H4Z"/><path d="M32 5L59 32L32 59L5 32Z"/>` +
      `${ring('M4 15C10.1 15 15 10.1 15 4', QUARTERS, 32, 32)}</g>` +
      `<g fill="currentColor" fill-opacity="${round(wash * 1.6, 3)}">` +
      `${ring('M32 26C26.8 22.4 25.8 15.2 32 8C38.2 15.2 37.2 22.4 32 26Z', QUARTERS, 32, 32)}</g>` +
      '<circle cx="32" cy="32" r="6"/><circle cx="32" cy="32" r="2" fill="currentColor" stroke="none"/>' +
      `<g fill="currentColor" stroke="none" opacity=".7"><circle cx="4" cy="4" r="1.8"/><circle cx="60" cy="4" r="1.8"/>` +
      '<circle cx="4" cy="60" r="1.8"/><circle cx="60" cy="60" r="1.8"/></g>',
  },
}

/**
 * Render one of the six shapes at whatever weight the surface wants. `stroke`
 * is the outline in viewBox units; interior detail follows it down so the
 * drawing keeps its hierarchy at any size.
 */
export function motifSVG(key, { stroke = 1.7, wash = 0.18, className = '' } = {}) {
  const art = ART[key]
  if (!art) return ''
  const body = art.draw({ fine: round(stroke * 0.62, 2), wash })
  const cls = className ? ` class="${className}"` : ''
  return `<svg${cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}

/** The motif table, in the order the specimen sheet should show them. */
export const MOTIFS = Object.fromEntries(
  Object.entries(ART).map(([key, { label, caption }]) => [key, { label, caption, svg: motifSVG(key) }]),
)

/** Never throws, never guesses: an unknown name is simply no ornament. */
export function markFor(name) {
  if (Object.prototype.hasOwnProperty.call(MARKS, name)) return MARKS[name]
  if (Object.prototype.hasOwnProperty.call(MOTIFS, name)) return MOTIFS[name].svg
  return ''
}

// --- wallpaper ------------------------------------------------------------
//
// One 1440x900 field that has to stay quiet under a stack of windows, so
// almost nothing here goes above 0.16 opacity. Colours come from the theme
// custom properties rather than currentColor: inline SVG resolves var(), so
// switching theme or accent re-skins the wallpaper with no work at all.

const n1 = (v) => round(v, 1)

/** Bell, plinth, needle. Reads at 60px tall, which is all it has to do. */
const chediSilhouette = (x, base, h, w) => {
  const plinth = n1(base - h * 0.15)
  const bell = n1(base - h * 0.5)
  const bw = w * 0.6
  const cap = w * 0.15
  return (
    `M${n1(x - w)} ${base}H${n1(x + w)}V${plinth}H${n1(x - w)}Z` +
    `M${n1(x - bw)} ${plinth}C${n1(x - bw)} ${n1(base - h * 0.32)} ${n1(x - bw * 0.6)} ${n1(bell + h * 0.05)} ${n1(x - cap)} ${bell}` +
    `H${n1(x + cap)}C${n1(x + bw * 0.6)} ${n1(bell + h * 0.05)} ${n1(x + bw)} ${n1(base - h * 0.32)} ${n1(x + bw)} ${plinth}Z` +
    `M${n1(x - cap)} ${bell}C${n1(x - cap * 0.7)} ${n1(bell - h * 0.18)} ${n1(x - cap * 0.28)} ${n1(base - h * 0.86)} ${x} ${n1(base - h)}` +
    `C${n1(x + cap * 0.28)} ${n1(base - h * 0.86)} ${n1(x + cap * 0.7)} ${n1(bell - h * 0.18)} ${n1(x + cap)} ${bell}Z`
  )
}

/** The Khmer corncob: one tapering tower, redented, no bell anywhere in it. */
const prangSilhouette = (x, base, h, w) => {
  const nw = w * 0.4
  const neck = n1(base - h * 0.72)
  const top = n1(base - h)
  return (
    `M${n1(x - w)} ${base}` +
    `C${n1(x - w * 0.92)} ${n1(base - h * 0.3)} ${n1(x - nw * 1.24)} ${n1(base - h * 0.54)} ${n1(x - nw)} ${neck}` +
    `C${n1(x - nw * 0.9)} ${n1(base - h * 0.86)} ${n1(x - nw * 0.44)} ${n1(base - h * 0.94)} ${x} ${top}` +
    `C${n1(x + nw * 0.44)} ${n1(base - h * 0.94)} ${n1(x + nw * 0.9)} ${n1(base - h * 0.86)} ${n1(x + nw)} ${neck}` +
    `C${n1(x + nw * 1.24)} ${n1(base - h * 0.54)} ${n1(x + w * 0.92)} ${n1(base - h * 0.3)} ${n1(x + w)} ${base}Z`
  )
}

// Off-centre on purpose: a symmetrical skyline would fight the window stack.
const HORIZON =
  prangSilhouette(1148, 726, 212, 54) +
  chediSilhouette(1264, 726, 152, 40) +
  chediSilhouette(1056, 726, 104, 30) +
  chediSilhouette(196, 726, 88, 26)

// Mount Meru at the centre of the field, twelve petals to a ring.
const MANDALA =
  ring('M720 244C650 206 640 132 720 78C800 132 790 206 720 244Z', [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330], 720, 430) +
  ring('M720 338C684 314 678 268 720 244C762 268 756 314 720 338Z', [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345], 720, 430) +
  '<circle cx="720" cy="430" r="98"/><circle cx="720" cy="430" r="60"/><circle cx="720" cy="430" r="26"/>' +
  '<circle cx="720" cy="430" r="378" opacity=".6"/>'

const LATTICE =
  '<pattern id="lo-lattice" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">' +
  '<path d="M48 8L88 48L48 88L8 48Z" fill="none" stroke="var(--gold-dim)" stroke-width="1.2"/>' +
  `<g fill="var(--gold-dim)">${ring('M48 42C43.4 39.2 42.6 33 48 26C53.4 33 52.6 39.2 48 42Z', QUARTERS, 48, 48)}</g>` +
  '<g fill="var(--gold-dim)"><circle cx="48" cy="48" r="3.4"/><circle cx="0" cy="0" r="2.2"/>' +
  '<circle cx="96" cy="0" r="2.2"/><circle cx="0" cy="96" r="2.2"/><circle cx="96" cy="96" r="2.2"/></g></pattern>'

// Bai raka: a rhythm of decreasing hooks. Good as a border, hopeless anywhere else.
const BORDER =
  '<pattern id="lo-border" width="72" height="44" patternUnits="userSpaceOnUse" patternTransform="translate(0 856)">' +
  '<path d="M0 42H72" fill="none" stroke="var(--gold-dim)" stroke-width="1.4" opacity=".7"/>' +
  '<g fill="var(--gold-dim)"><path d="M8 42C8 26 16 14 30 10C22 20 20 30 22 42Z"/>' +
  '<path d="M42 42C42 32 46 25 54 22C48 29 47 35 48 42Z"/></g></pattern>'

const WATER =
  '<g fill="none" stroke="var(--gold-dim)" stroke-width="1.4">' +
  '<path d="M0 798H1440" opacity=".16"/><path d="M0 840H1440" opacity=".06"/>' +
  '<ellipse cx="1150" cy="816" rx="128" ry="15" opacity=".1"/>' +
  '<ellipse cx="1150" cy="816" rx="216" ry="26" opacity=".075"/>' +
  '<ellipse cx="1150" cy="816" rx="312" ry="38" opacity=".05"/>' +
  '<ellipse cx="392" cy="848" rx="86" ry="11" opacity=".08"/>' +
  '<ellipse cx="392" cy="848" rx="150" ry="19" opacity=".055"/></g>'

/**
 * The desktop field. With `ornament` off it is a gradient and nothing else —
 * the ornament switch has to actually mean something, not just thin the lines.
 */
export function wallpaperSVG({ theme = 'dark', ornament = true } = {}) {
  const night = theme !== 'light'
  const open = '<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
  const gradients =
    '<linearGradient id="lo-sky" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" style="stop-color:var(--wall-1);stop-opacity:.9"/>' +
    '<stop offset=".54" style="stop-color:var(--wall-2);stop-opacity:.32"/>' +
    '<stop offset="1" style="stop-color:var(--wall-3);stop-opacity:0"/></linearGradient>' +
    '<radialGradient id="lo-halo" cx=".5" cy=".88" r=".72">' +
    `<stop offset="0" style="stop-color:var(--accent-dim);stop-opacity:${night ? '.32' : '.18'}"/>` +
    '<stop offset="1" style="stop-color:var(--accent-dim);stop-opacity:0"/></radialGradient>'
  const wash =
    '<rect width="1440" height="900" fill="url(#lo-sky)"/><rect width="1440" height="900" fill="url(#lo-halo)"/>'

  if (!ornament) return `${open}<defs>${gradients}</defs>${wash}</svg>`

  // Silhouettes are the one thing allowed to be opaque; in the dark they are a
  // hole in the sky, at noon they are the far side of the haze.
  const stone = night ? 'var(--bg-deep)' : 'var(--wall-3)'
  const horizon = `<g fill="${stone}" opacity="${night ? '.62' : '.5'}">${HORIZON}</g>`

  return (
    open +
    `<defs>${gradients}${LATTICE}${BORDER}</defs>` +
    wash +
    `<rect width="1440" height="900" fill="url(#lo-lattice)" opacity="${night ? '.055' : '.075'}"/>` +
    horizon +
    `<g fill="none" stroke="var(--gold-dim)" stroke-width="2.4" opacity="${night ? '.075' : '.06'}">${MANDALA}</g>` +
    `<g transform="matrix(1 0 0 -1 0 1596)" opacity="${night ? '.1' : '.08'}">${horizon}</g>` +
    WATER +
    `<rect y="856" width="1440" height="44" fill="url(#lo-border)" opacity="${night ? '.13' : '.16'}"/>` +
    '</svg>'
  )
}
