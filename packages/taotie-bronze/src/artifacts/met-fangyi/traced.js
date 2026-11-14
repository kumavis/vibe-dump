// met-fangyi — the TRACED surface (round 5).
//
// Every element below was read in mm off the flattened photographs
// (reference/met-fangyi/faces/*.jpg, 8 px/mm; KIT.md § Flat faces) with a 5 mm
// grid laid over them, then drawn with the kit's rounded vocabulary
// (roundStroke / roundPoly / carve / pillowBoss) instead of the squared island
// sheets of rounds 1–4 (decor.js, kept for the foot and the knob).
//
// Coordinates are FACE mm of the named face, LEFT half (x from the face's left
// edge, y from its bottom edge) — the numbers you read off the photograph.
// A face transform maps them onto the panel; the right half is the mirror.
//
// An element: { kind: 'poly' | 'stroke' | 'plate', …geometry, contour, ticks, fill (carve's own,
//   e.g. a jointed spiral chain), spirals: [[x, y, Ø, hand?]…] (hand-placed round spirals),
//   coils: [{ box: [x0, y0, x1, y1], c: [x, y], pitch, hand, a0 }] (squared-round coils rolled
//   in to an off-centre eye — the horn and jaw curls), lines: [[[x, y]…]…] (extra grooves, filleted),
//   clip (default true: hand grooves stay inside the element's contour) }
// A pillow: { kind: 'pillow', c, w, h, round, height, crown, slit }

import { carveSpirals } from './relief.js'

export const L1 = 1.4 // plateau height above the ground, mm (dossier 1.2 ± 0.3)

// ------------------------------------------------------------------ the long face (face-long-main / face-long-frieze)

const LINE = 0.6 // every hand groove on a plateau top, mm (research/04: 0.4–0.6)

/**
 * Main mask, long face, left half — face-long-main.jpg mm (vessel y = fy + 31, x = fx − 76).
 * Read from .work/r5-met-fangyi/grid/{mainL,hornL,lowL,midL}.png.
 */
export const MAIN_LONG = [
  // H1 horn: ONE plateau, a fat G — the column by the axis (x 40–55, two Ø 10 spirals), the top band
  // (three Ø 5.5–6 spirals), the outer column, the return along the bottom that rolls into the curl
  // (a squared coil whose eye sits up and out at 25.4, 72.4); a slot rises from the bottom between
  // curl and column (x 34.8–40, to y 67). Outer margin 2.3 mm, ticked; contour line inside it.
  {
    kind: 'poly', name: 'horn',
    pts: [[12.9, 61.2], [34.8, 61.2], [34.8, 67.0], [40.0, 67.0], [40.0, 56.7], [55.0, 56.7], [55.0, 88.6], [12.9, 88.6]],
    round: [5.2, 2.6, 1.2, 1.2, 3.4, 5.4, 7.0, 6.0],
    contour: { inset: 2.3, line: LINE }, ticks: { pitch: 3.7, line: 0.42 },
    spirals: [[20.4, 81.6, 6.2, 1], [27.6, 81.4, 6.0, -1], [34.2, 80.9, 5.4, 1], [47.4, 77.4, 10.2, -1], [47.4, 66.0, 10.2, 1], [19.0, 75.6, 3.6, 1]],
    lines: [[[16.4, 77.8], [39.4, 77.8]], [[40.8, 72.6], [40.8, 84.4], [52.6, 84.4]]],
    coils: [{ box: [16.0, 63.4, 39.8, 77.2], c: [25.2, 72.2], pitch: 1.35, hand: 1, a0: 200 }],
    pockets: [{ pts: [[20.4, 64.4], [39.8, 64.4], [39.8, 77.4], [20.4, 77.4]], round: [2.0, 1.0, 3.0, 4.0], depth: 0.32 }],
  },
  // J1 jaw: the same G, smaller and lower (x 30–57, y 5–26), slot at x 46.7–49.5 up to y 18.4
  {
    kind: 'poly', name: 'jaw',
    pts: [[29.9, 5.2], [46.7, 5.2], [46.7, 18.2], [49.5, 18.2], [49.5, 5.4], [56.9, 5.4], [56.9, 26.2], [29.9, 26.2]],
    round: [4.0, 2.2, 0.9, 0.9, 2.6, 3.4, 5.2, 5.0],
    contour: { inset: 1.5, line: LINE }, ticks: { pitch: 3.6, line: 0.4 },
    spirals: [[34.6, 22.3, 5.0, 1], [40.0, 22.3, 5.0, -1], [45.4, 22.3, 4.8, 1], [53.2, 17.6, 5.8, -1], [53.2, 10.6, 5.8, 1]],
    lines: [[[32.3, 19.3], [47.8, 19.3]]],
    coils: [{ box: [31.2, 6.7, 46.4, 18.6], c: [41.0, 11.2], pitch: 1.3, hand: -1, a0: 160 }],
    pockets: [{ pts: [[34.6, 6.7], [46.7, 6.7], [46.7, 18.7], [34.6, 18.7]], round: [1.6, 0.6, 1.0, 3.0], depth: 0.3 }],
  },
  // R1 ear: a C opening toward the axis, its upper lobe a Ø 7 spiral, the lower lobe rolled in lines
  {
    kind: 'poly', name: 'ear',
    pts: [[15.0, 36.6], [28.0, 36.6], [28.0, 44.4], [23.2, 44.4], [23.2, 48.8], [27.4, 48.8], [27.4, 57.0], [15.0, 57.0]],
    round: [4.4, 3.4, 1.8, 0.6, 0.6, 2.2, 4.2, 4.6],
    contour: { inset: 0.9, line: LINE },
    spirals: [[21.0, 52.6, 7.0, 1], [18.2, 46.6, 3.0, -1]],
    coils: [{ box: [16.2, 37.8, 26.8, 43.4], c: [22.6, 40.8], pitch: 1.05, hand: -1, a0: 90 }],
  },
  // T1 lower outer C (a tail): upper lobe spiral Ø 7, bottom lobe spiral, two small coils in the column
  {
    kind: 'poly', name: 'tail',
    pts: [[15.0, 6.4], [29.5, 6.4], [29.5, 12.8], [21.2, 12.8], [21.2, 20.8], [28.2, 20.8], [28.2, 31.3], [15.0, 31.3]],
    round: [4.2, 3.0, 2.6, 0.6, 0.6, 3.6, 4.8, 4.8],
    contour: { inset: 0.9, line: LINE },
    spirals: [[22.4, 26.4, 7.2, -1], [25.0, 9.6, 4.6, 1], [18.0, 20.6, 3.4, 1], [18.0, 15.2, 3.4, -1], [18.2, 9.8, 3.2, 1]],
  },
  // B1 brow: a fat bar over the eye, its outer end hooked down
  {
    kind: 'stroke', name: 'brow', pack: false,
    ctrl: [[38.4, 47.4], [38.4, 52.2], [52.8, 52.2]], width: [4.4, 5.4, 5.4],
    round: 0.6, inner: 0.15, start: 'round', end: 'blunt', capRound: 0.45,
    contour: { inset: 0.8, line: 0.45 },
  },
  // N1 the Γ under the upper column: a bar from the flange, its outer end hanging down and curling in
  {
    kind: 'poly', name: 'gamma',
    pts: [[56.0, 44.4], [63.2, 44.4], [63.2, 50.6], [72.6, 50.6], [72.6, 57.0], [56.0, 57.0]],
    round: [3.6, 2.4, 0.5, 0.5, 1.2, 3.4],
    contour: { inset: 0.8, line: LINE },
    spirals: [[60.2, 48.4, 5.2, 1], [67.6, 53.8, 4.2, -1]],
  },
  // N1 the column by the flange, above the Γ: three Ø 6.5 spirals under a scored cap
  {
    kind: 'poly', name: 'column-up',
    pts: [[63.7, 58.0], [72.6, 58.0], [72.6, 90.8], [63.7, 90.8]], round: [1.4, 1.0, 1.0, 1.6],
    contour: { inset: 0.8, line: LINE },
    spirals: [[68.2, 81.6, 6.6, 1], [68.2, 72.4, 6.6, -1], [68.2, 63.2, 6.6, 1]],
    lines: [[[64.4, 87.0], [71.9, 87.0]]],
  },
  // N1 the column below the Γ: four Ø 6.5 spirals; its foot turns out into a lobe with a Ø 8 spiral
  {
    kind: 'poly', name: 'column-down',
    pts: [[61.4, 5.4], [72.6, 5.4], [72.6, 49.8], [63.7, 49.8], [63.7, 15.6], [61.4, 15.6]],
    round: [3.2, 1.0, 1.0, 1.0, 0.6, 2.2],
    contour: { inset: 0.8, line: LINE },
    spirals: [[68.2, 44.2, 6.4, -1], [68.2, 36.6, 6.4, 1], [68.2, 29.0, 6.4, -1], [68.2, 21.4, 6.4, 1], [66.6, 10.4, 7.6, -1]],
  },
  // E1 the eye: a pillow boss, slit pupil low and toward the axis's far side
  { kind: 'pillow', name: 'eye', c: [45.4, 36.8], w: 15.2, h: 13.6, round: 0.55, height: 3.0, crown: 1.0, slit: { len: 4.4, width: 1.0, depth: 0.75, offset: [-0.9, -0.8] } },
]

/**
 * Top frieze, long face, left half — face-long-frieze.jpg mm (vessel y = fy + 126): a kui facing the
 * flange. Tail G at the outer end, a jointed body band, a leg G hanging under it, the head lobe, the
 * pillow eye under a crest bar, the upper jaw hooking down at the flange, the lower jaw / neck block.
 * Read from .work/r5-met-fangyi/grid/fr{L,R}.png.
 */
export const FRIEZE_LONG = [
  // the tail G and the long lower band (tail + body) are one plateau: the G's hook ends at y 20.3 over a
  // ground gap; its curl is a stepped pocket; the band carries the jointed spiral chain
  {
    kind: 'poly', name: 'tail-body',
    pts: [[13.6, 11.4], [47.6, 11.4], [47.6, 17.4], [25.4, 17.4], [25.4, 20.3], [30.0, 20.3], [30.0, 28.6], [13.6, 28.6]],
    round: [4.0, 1.2, 1.2, 0.5, 0.5, 2.2, 4.6, 4.8],
    contour: { inset: 0.7, line: 0.45 },
    spirals: [[17.4, 14.4, 4.6, 1], [22.4, 14.4, 4.6, -1], [37.6, 14.4, 4.2, 1], [41.8, 14.4, 4.2, -1], [45.6, 14.4, 3.6, 1]],
    lines: [[[19.2, 17.6], [19.2, 25.0], [25.0, 25.0], [25.0, 20.8]], [[16.2, 26.9], [28.3, 26.9], [28.3, 21.4]], [[26.6, 12.2], [26.6, 17.0]], [[35.2, 12.2], [35.2, 16.8]]],
    coils: [{ box: [19.6, 17.9, 24.8, 24.7], c: [22.9, 21.4], pitch: 0.95, hand: 1, a0: 270 }],
    pockets: [{ pts: [[19.3, 17.7], [25.0, 17.7], [25.0, 24.9], [19.3, 24.9]], round: [0.6, 0.6, 1.6, 1.8], depth: 0.3 }],
  },
  {
    kind: 'poly', name: 'leg',
    pts: [[25.0, 4.6], [38.2, 4.6], [38.2, 9.4], [30.4, 9.4], [30.4, 12.0], [25.0, 12.0]],
    round: [3.0, 2.4, 1.4, 0.5, 0, 0],
    contour: { inset: 0.6, line: 0.42 },
    coils: [{ box: [26.0, 5.5, 37.4, 11.6], c: [31.6, 7.8], pitch: 0.95, hand: -1, a0: 180 }],
  },
  {
    kind: 'poly', name: 'head',
    pts: [[37.0, 19.0], [49.0, 19.0], [49.0, 27.6], [37.0, 27.6]], round: [3.4, 2.0, 3.0, 4.0],
    contour: { inset: 0.6, line: 0.42 },
    spirals: [[46.2, 23.2, 4.0, -1]],
    coils: [{ box: [38.2, 20.2, 44.4, 26.4], c: [41.4, 23.2], pitch: 0.95, hand: 1, a0: 0 }],
  },
  { kind: 'pillow', name: 'eye', c: [53.3, 22.4], w: 6.0, h: 5.4, round: 0.55, height: 2.6, crown: 0.9, slit: { len: 2.2, width: 0.75, depth: 0.55 } },
  {
    kind: 'stroke', name: 'crest', pack: false,
    ctrl: [[51.6, 28.6], [64.6, 28.6]], width: 3.6, round: 0.5, start: 'round', end: 'round',
    contour: false, spirals: [[53.3, 28.6, 3.0, 1], [58.1, 28.6, 3.0, -1], [62.9, 28.6, 3.0, 1]],
  },
  {
    kind: 'stroke', name: 'upper-jaw',
    ctrl: [[56.2, 24.9], [67.0, 24.9], [67.0, 16.2]], width: [3.6, 3.8, 3.4], round: 0.6, inner: 0.15, start: 'blunt', end: 'round', capRound: 0.45,
    contour: { inset: 0.6, line: 0.4 }, spirals: [[60.2, 24.9, 2.6, 1]],
  },
  {
    kind: 'poly', name: 'neck',
    pts: [[48.5, 4.9], [67.3, 4.9], [67.3, 10.5], [55.5, 10.5], [55.5, 18.0], [48.5, 18.0]],
    round: [3.0, 3.0, 1.6, 0.5, 2.0, 1.2],
    contour: { inset: 0.6, line: 0.42 },
    spirals: [[52.0, 15.0, 4.2, 1], [52.0, 8.4, 4.2, -1], [57.6, 7.7, 3.6, 1], [63.4, 7.7, 4.4, -1]],
  },
  { kind: 'stroke', name: 'claw', pack: false, ctrl: [[62.6, 10.0], [62.6, 12.8]], width: 2.0, start: 'flat', end: 'round', contour: false },
]

/**
 * Foot frieze, long face, left half — face-long-foot.jpg mm (vessel y = fy − 2): a kui facing the
 * flange, as the top frieze but with a bird-like head and a round eye over the notch corner: tail G
 * (stepped curl) and the lower band with its spiral chain, a leg G under it, the head with its ring
 * spiral, the eye, the upper jaw bar running to the flange (its outer end hooked down), a small crest,
 * the lower jaw block and a short band under the eye. Read from .work/r5-met-fangyi/grid/ft{L,R}.png.
 */
export const FOOT_LONG = [
  {
    kind: 'poly', name: 'tail-body',
    pts: [[18.0, 11.6], [45.5, 11.6], [45.5, 17.6], [29.0, 17.6], [29.0, 20.2], [32.0, 20.2], [32.0, 28.6], [18.0, 28.6]],
    round: [3.6, 1.4, 1.4, 0.5, 0.5, 1.4, 3.4, 4.4],
    contour: { inset: 0.7, line: 0.45 },
    spirals: [[21.0, 14.6, 4.4, 1], [25.6, 14.6, 4.2, -1], [37.4, 14.6, 4.0, 1], [41.8, 14.6, 4.0, -1]],
    lines: [[[22.0, 17.8], [22.0, 25.2], [28.6, 25.2], [28.6, 20.6]], [[20.0, 27.1], [30.6, 27.1], [30.6, 21.2]]],
    coils: [{ box: [22.2, 17.9, 28.4, 25.0], c: [25.5, 21.4], pitch: 0.95, hand: 1, a0: 270 }],
    pockets: [{ pts: [[22.1, 17.8], [28.6, 17.8], [28.6, 25.1], [22.1, 25.1]], round: [0.6, 0.6, 1.6, 1.8], depth: 0.3 }],
  },
  {
    kind: 'poly', name: 'leg',
    pts: [[28.5, 6.7], [41.5, 6.7], [41.5, 10.2], [32.2, 10.2], [32.2, 12.2], [28.5, 12.2]],
    round: [3.0, 1.7, 1.4, 0.5, 0, 0],
    contour: { inset: 0.6, line: 0.42 },
    coils: [{ box: [29.4, 7.5, 40.8, 11.8], c: [35.0, 8.8], pitch: 0.95, hand: -1, a0: 180 }],
  },
  {
    kind: 'poly', name: 'head',
    pts: [[39.5, 17.2], [46.6, 17.2], [47.2, 26.6], [39.5, 26.6]], round: [0.8, 0.8, 3.0, 3.2],
    contour: { inset: 0.6, line: 0.42 }, spirals: [[43.6, 23.2, 4.4, 1]],
  },
  { kind: 'pillow', name: 'eye', c: [51.1, 18.5], w: 5.6, h: 5.4, round: 0.6, height: 2.4, crown: 1.0, slit: { len: 1.5, width: 0.9, depth: 0.5 } },
  {
    kind: 'stroke', name: 'upper-jaw',
    ctrl: [[50.2, 21.6], [50.2, 25.2], [68.0, 25.2]], width: [3.0, 4.0, 4.0], round: 0.6, inner: 0.15, start: 'round', end: 'blunt', capRound: 0.3,
    contour: { inset: 0.6, line: 0.42 }, spirals: [[55.0, 25.2, 3.0, 1], [59.5, 25.2, 3.0, -1], [64.0, 25.2, 3.0, 1]],
  },
  { kind: 'stroke', name: 'crest', pack: false, ctrl: [[55.6, 29.0], [62.2, 29.0]], width: 2.6, start: 'round', end: 'round', contour: false, spirals: [[60.6, 29.0, 2.4, 1]] },
  {
    kind: 'poly', name: 'lower-jaw',
    pts: [[55.2, 15.4], [66.5, 15.4], [66.5, 21.0], [55.2, 21.0]], round: [1.5, 2.4, 2.4, 1.5],
    contour: { inset: 0.6, line: 0.42 }, spirals: [[59.0, 18.2, 3.6, 1], [63.2, 18.2, 3.4, -1]],
  },
  {
    kind: 'stroke', name: 'lower-band',
    ctrl: [[47.4, 12.6], [59.6, 12.6]], width: 4.4, start: 'round', end: 'round',
    contour: { inset: 0.6, line: 0.42 }, spirals: [[50.2, 12.6, 3.6, 1], [54.8, 12.6, 3.4, -1]],
  },
]

// ------------------------------------------------------------------ the end face (face-end.jpg)

/**
 * The end face carries the same elements, re-proportioned (face-end.jpg, .work/r5-met-fangyi/grid/endM.png):
 * each element's long-face box (of its traced points) → its box read off the end face (face-end mm,
 * vessel y = fy − 2). The eye is re-read whole. The horn has no slot on the end face (its column simply
 * runs on below the curl) and the Γ rides higher, at the foot of the horn column.
 */
export const END_FIT = {
  horn: [[12.9, 56.7, 55.0, 88.6], [12.5, 90.5, 44.4, 120.5]],
  jaw: [[29.9, 5.2, 56.9, 26.2], [26.5, 39.0, 46.0, 57.4]],
  ear: [[15.0, 36.6, 28.0, 57.0], [14.0, 70.6, 26.0, 86.2]],
  tail: [[15.0, 6.4, 29.5, 31.3], [14.5, 39.0, 26.5, 60.6]],
  brow: [[38.4, 47.4, 52.8, 52.2], [30.0, 82.6, 39.6, 85.8]],
  gamma: [[56.0, 44.4, 72.6, 57.0], [45.4, 89.0, 56.6, 96.4]],
  'column-up': [[63.7, 58.0, 72.6, 90.8], [50.0, 98.0, 56.6, 127.0]],
  'column-down': [[61.4, 5.4, 72.6, 49.8], [46.0, 39.0, 56.6, 88.4]],
}
export const END_EYE = { c: [35.8, 70.3], w: 14.5, h: 12.2 }

/** The end-face horn, traced on its own (no slot: the column runs on below the curl). face-end mm. */
export const END_HORN = {
  kind: 'poly', name: 'horn',
  pts: [[12.5, 100.0], [30.6, 100.0], [30.6, 92.8], [44.4, 92.8], [44.4, 120.5], [12.5, 120.5]],
  round: [4.4, 0.8, 3.0, 4.6, 6.2, 5.6],
  contour: { inset: 2.0, line: 0.5 }, ticks: { pitch: 3.6, line: 0.42 },
  spirals: [[18.8, 116.4, 5.2, 1], [24.4, 116.4, 5.2, -1], [29.8, 116.2, 5.0, 1], [37.2, 109.2, 9.0, -1], [37.2, 99.8, 9.0, 1], [16.4, 110.4, 3.2, 1]],
  lines: [[[14.6, 112.4], [31.0, 112.4]], [[31.4, 95.0], [31.4, 117.4], [42.0, 117.4]]],
  coils: [{ box: [14.5, 102.2, 31.0, 112.0], c: [21.4, 106.8], pitch: 1.3, hand: 1, a0: 200 }],
  pockets: [{ pts: [[17.6, 102.6], [30.8, 102.6], [30.8, 112.2], [17.6, 112.2]], round: [1.6, 0.8, 2.4, 3.4], depth: 0.3 }],
}

/** Re-fit traced specs element by element: fits[name] = [fromBox, toBox]; others go through `rest` (pt → pt). */
export function refit(specs, fits, { rest = (p) => p, pillow = null } = {}) {
  return specs.map((s) => {
    if (s.kind === 'pillow') return pillow ? { ...s, ...pillow } : { ...s, c: rest(s.c) }
    const f = fits[s.name]
    let M = rest, k = 1
    if (f) {
      const [[a0, b0, a1, b1], [c0, d0, c1, d1]] = f
      const sx = (c1 - c0) / (a1 - a0), sy = (d1 - d0) / (b1 - b0)
      M = ([x, y]) => [c0 + (x - a0) * sx, d0 + (y - b0) * sy]
      k = Math.sqrt(Math.abs(sx * sy))
    } else {
      // the local x scale of `rest` at the element (a piecewise re-fit squeezes parts differently)
      const p0 = (s.pts || s.ctrl || [s.c])[0]
      const a = rest([p0[0] - 0.5, p0[1]]), b = rest([p0[0] + 0.5, p0[1]])
      k = Math.abs(b[0] - a[0])
    }
    const mp = (pts) => pts.map(M)
    const o = { ...s }
    if (s.pts) o.pts = mp(s.pts)
    if (s.ctrl) o.ctrl = mp(s.ctrl)
    if (s.round) o.round = Array.isArray(s.round) ? s.round.map((r) => (s.kind === 'stroke' ? r : r * Math.min(1, k))) : s.kind === 'stroke' ? s.round : s.round * Math.min(1, k)
    if (s.width) o.width = Array.isArray(s.width) ? s.width.map((w) => w * Math.min(1, k)) : s.width * Math.min(1, k)
    if (s.spirals) o.spirals = s.spirals.map(([x, y, d, ...r]) => [...M([x, y]), d * Math.min(1, k), ...r])
    if (s.coils) o.coils = s.coils.map((c) => ({ ...c, box: [...M([c.box[0], c.box[1]]), ...M([c.box[2], c.box[3]])], c: M(c.c), pitch: c.pitch * Math.max(0.85, Math.min(1, k)) }))
    if (s.lines) o.lines = s.lines.map(mp)
    if (s.pockets) o.pockets = s.pockets.map((q) => ({ ...q, pts: mp(q.pts), round: Array.isArray(q.round) ? q.round.map((r) => r * Math.min(1, k)) : q.round }))
    return o
  })
}

// ------------------------------------------------------------------ the lid (face-lid-long.jpg, face-lid-end.jpg)

/**
 * The lid slopes repeat the body mask UPSIDE DOWN (horns at the eave, jaws toward the ridge): each
 * element's long-face box → its box on the flattened lid face (a reversed y range flips it). Read from
 * .work/r5-met-fangyi/grid/lidL.png (the near, right half mirrored) and lidE.png. Face mm of the lid
 * faces (x from the left edge, y up the chord plane from its bottom edge).
 */
export const LID_LONG_FIT = {
  horn: [[12.9, 56.7, 55.0, 88.6], [15.0, 34.5, 57.2, 9.6]],
  jaw: [[29.9, 5.2, 56.9, 26.2], [39.4, 68.0, 55.8, 55.6]],
  tail: [[15.0, 6.4, 29.5, 31.3], [25.0, 70.5, 36.5, 55.0]],
  ear: [[15.0, 36.6, 28.0, 57.0], [24.0, 54.0, 33.7, 38.7]],
  brow: [[38.4, 47.4, 52.8, 52.2], [41.2, 43.2, 54.8, 39.6]],
  gamma: [[56.0, 44.4, 72.6, 57.0], [60.6, 43.6, 69.6, 35.0]],
  'column-up': [[63.7, 58.0, 72.6, 90.8], [62.5, 34.0, 69.6, 8.5]],
  'column-down': [[61.4, 5.4, 72.6, 49.8], [60.5, 74.0, 69.6, 44.4]],
}
export const LID_LONG_EYE = { c: [47.1, 47.6], w: 13.0, h: 11.2 }
export const LID_END_FIT = {
  horn: [[12.9, 56.7, 55.0, 88.6], [17.5, 27.0, 47.0, 8.5]],
  jaw: [[29.9, 5.2, 56.9, 26.2], [38.3, 48.6, 48.0, 41.6]],
  ear: [[15.0, 36.6, 28.0, 57.0], [29.7, 39.4, 36.7, 29.3]],
  brow: [[38.4, 47.4, 52.8, 52.2], [40.0, 33.0, 47.4, 30.6]],
  'column-up': [[63.7, 58.0, 72.6, 90.8], [49.6, 26.8, 53.4, 8.5]],
  'column-down': [[61.4, 5.4, 72.6, 49.8], [49.0, 52.0, 53.4, 29.6]],
}
export const LID_END_EYE = { c: [43.75, 36.3], w: 7.6, h: 6.0, height: 2.6, slit: { len: 2.6, width: 0.8, depth: 0.5 } }
export const LID_END_DROP = ['tail', 'gamma']

// ------------------------------------------------------------------ geometry helpers (face mm)

const D2R = Math.PI / 180

/** A round(ish) spiral groove, outer Ø d, winding in to a small eye; hand ±1; a0 deg = where it starts. */
export function spiralPts([cx, cy], d, hand = 1, a0 = 90, { pitch = 1.0, ex = 3.0, rIn = 0.32 } = {}) {
  const R = d / 2 - LINE * 0.5
  if (R <= rIn + 0.2) return []
  const turns = Math.max(0.8, (R - rIn) / pitch)
  const phiMax = turns * 2 * Math.PI
  const out = []
  for (let phi = 0; phi <= phiMax + 1e-6;) {
    const r = R - ((R - rIn) * phi) / phiMax
    const a = a0 * D2R + hand * phi
    const ca = Math.cos(a), sa = Math.sin(a)
    const k = 1 / Math.pow(Math.pow(Math.abs(ca), ex) + Math.pow(Math.abs(sa), ex), 1 / ex)
    out.push([cx + ca * r * k, cy + sa * r * k])
    phi += Math.min(0.28, 0.2 / Math.max(0.3, r))
  }
  return out
}

/**
 * A squared-round coil rolled in to an off-centre eye: ring boxes interpolate from `box` (outer) to a
 * small box round `c`, so the rings crowd on the side the eye is near — the horn and jaw curls.
 */
export function coilPts({ box, c, pitch = 1.3, hand = 1, a0 = 180, ex = 4.2 }) {
  const [x0, y0, x1, y1] = box
  const dMean = (Math.abs(c[0] - x0) + Math.abs(x1 - c[0]) + Math.abs(c[1] - y0) + Math.abs(y1 - c[1])) / 4
  const N = Math.max(1.2, (dMean - 0.4) / pitch)
  const phiMax = N * 2 * Math.PI
  const out = []
  for (let phi = 0; phi <= phiMax + 1e-6;) {
    const f = phi / phiMax
    const bx0 = x0 + (c[0] - 0.4 - x0) * f, bx1 = x1 + (c[0] + 0.4 - x1) * f
    const by0 = y0 + (c[1] - 0.4 - y0) * f, by1 = y1 + (c[1] + 0.4 - y1) * f
    const mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2, a = (bx1 - bx0) / 2, b = (by1 - by0) / 2
    const t = a0 * D2R + hand * phi
    const ca = Math.cos(t), sa = Math.sin(t)
    const e = 2 / ex
    out.push([mx + a * Math.sign(ca) * Math.pow(Math.abs(ca), e), my + b * Math.sign(sa) * Math.pow(Math.abs(sa), e)])
    phi += 0.035
  }
  return out
}

// ------------------------------------------------------------------ face transforms

/**
 * Long or end body face → body panel (fang 'stretch' cell: panel x is the fraction of the wall's
 * width at that height). faceW = the face rectangle width (its centre is the axis), dy = vessel y −
 * face y, halfAt(Y) = the wall's half width at vessel height Y, hw = the panel half width, y0 = the
 * panel's bottom in vessel y. `squeeze(u)` (optional) re-fits u = mm from the axis (end face).
 */
export function bodyFace({ faceW, dy, halfAt, hw, y0, squeeze = null }) {
  const xc = faceW / 2
  const P = ([fx, fy]) => {
    const Y = fy + dy
    let u = xc - fx
    if (squeeze) u = squeeze(u)
    return [hw - (u * hw) / halfAt(Y), Y - y0]
  }
  return { P, sx: (fx) => (squeeze ? Math.abs(squeeze(xc - fx - 0.5) - squeeze(xc - fx + 0.5)) : 1) }
}

// ------------------------------------------------------------------ rendering

function pathPoly(ctx, pts, closed = true) {
  if (!pts || pts.length < 2) return
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}

/** Build the kit element of a traced spec, mapped through P (face mm → panel mm); widths × ws. */
function element(kit, s, P, ws = 1) {
  const deco = { contour: s.contour, ticks: s.ticks ?? null, fill: s.fill ?? null }
  if (s.kind === 'stroke') {
    const w = Array.isArray(s.width) ? s.width.map((v) => v * ws) : s.width * ws
    return kit.roundStroke(s.ctrl.map(P), { width: w, round: s.round, inner: s.inner, start: s.start, end: s.end, capRound: s.capRound, spiral: s.spiral, ...deco })
  }
  if (s.kind === 'plate') return kit.roundPlate({ c: P(s.c), w: s.w * ws, h: s.h, r: s.r, ...deco })
  return kit.roundPoly(s.pts.map(P), { round: s.round, ...deco })
}

/**
 * Render traced layers onto a panel: plain frame (outside `fields`) at L1 → every element raised at
 * L1 with its contour / ticks / carve fill (one carve) → hand grooves (spirals, coils, lines; one sink,
 * each clipped to its element's contour) → pillow eyes → leiwen ground on the left half → mirror →
 * shift everything down by L1 (plain bands at the wall surface, so panel edges stay seamless).
 *
 * layers: [{ specs, P, ws? (width scale), ds? (spiral Ø scale) }]   fields: [[x, y, w, h] | [[x, y]…] panel mm]
 */
export function renderTraced(kit, panel, layers, { fields, halfRect, ground = {}, seed = 1, mirror = true, frameRound = 0.8 } = {}) {
  const W = panel.width, H = panel.height
  // 1. the plain frame
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.rect(-1, -1, W + 2, H + 2)
    for (const f of fields) {
      const q = Array.isArray(f[0]) ? f : [[f[0], f[1]], [f[0] + f[2], f[1]], [f[0] + f[2], f[1] + f[3]], [f[0], f[1] + f[3]]]
      pathPoly(ctx, kit.shapes.fillet(q, frameRound, { closed: true, step: 0.3 }))
    }
    ctx.fill('evenodd')
  }, { height: L1, shoulder: 0.3 })

  // 2. the plateaus and their contour / tick / fill decoration
  const els = []
  const hand = [] // { clip, pts[] }
  const pillows = []
  for (const { specs, P, ws = 1, ds = 1 } of layers) {
    for (const s of specs) {
      if (s.kind === 'pillow') {
        const c = P(s.c), e = P([s.c[0] + s.w / 2, s.c[1]])
        pillows.push({ ...s, c, w: 2 * Math.abs(e[0] - c[0]) })
        continue
      }
      const el = element(kit, s, P, ws)
      els.push(el)
      const g = []
      for (const [x, y, d, hd = 1, a0] of s.spirals || []) g.push(spiralPts(P([x, y]), d * ds, hd, a0 ?? (hd > 0 ? 90 : 270)))
      for (const c of s.coils || []) {
        const a = P([c.box[0], c.box[1]]), b = P([c.box[2], c.box[3]])
        g.push(coilPts({ ...c, box: [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])], c: P(c.c), hand: c.hand ?? 1 }))
      }
      for (const l of s.lines || []) g.push(kit.shapes.fillet(l.map(P), 0.8, { step: 0.2 }))
      if (g.length) {
        const ins = s.contour ? (s.contour.inset ?? 1) + (s.contour.line ?? LINE) / 2 + 0.25 : 0.35
        hand.push({ clip: s.clip === false ? null : kit.elementContour(el, ins), g })
      }
    }
  }
  if (els.length) kit.carve(panel, els, { height: L1, shoulder: 0.55, depth: 0.42, seed, irregularity: 0.8, contour: { inset: 0.8, line: 0.5 } })
  // stepped pockets: the rolled curl of a G sits a step below its band (the shadowed edge on the photographs)
  const pockets = []
  for (const { specs, P } of layers) for (const s of specs) for (const k of s.pockets || []) pockets.push({ pts: k.pts.map(P), round: k.round, depth: k.depth ?? 0.3 })
  if (pockets.length) {
    for (const k of pockets) {
      panel.sink((ctx) => { ctx.beginPath(); pathPoly(ctx, kit.shapes.fillet(k.pts, k.round, { closed: true, step: 0.2 }), true); ctx.fill() }, { depth: k.depth, shoulder: 0.28, profile: 'u' })
    }
  }
  if (hand.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = LINE
      for (const { clip, g } of hand) {
        if (clip) { ctx.save(); ctx.beginPath(); pathPoly(ctx, clip, true); ctx.clip() }
        for (const pts of g) {
          if (pts.length < 2) continue
          ctx.beginPath()
          pathPoly(ctx, pts, false)
          ctx.stroke()
        }
        if (clip) ctx.restore()
      }
    }, { depth: 0.42, shoulder: LINE * 0.45, profile: 'u' })
  }
  // 2b. whatever plateau top is still bare gets round spirals packed largest-first (the bronze leaves
  //     no blank top: detail-face-long) — the packer reads the field, so it avoids every groove cut above
  const packs = []
  for (let i = 0, k = 0; i < layers.length; i++) {
    for (const s of layers[i].specs) {
      if (s.kind === 'pillow') continue
      const el = els[k++]
      if (s.pack !== false) packs.push({ is: { pts: el.outline, r: 0, spirals: s.pack }, P: (q) => q })
    }
  }
  if (packs.length) carveSpirals(kit, panel, packs, { pitch: 1.0, line: 0.55, depth: 0.4, rMax: 3.0, rMin: 1.55, gap: 0.12, margin: 0.25, shape: 3.0, seed: seed + 3, halfRect: halfRect ?? { x: 0, y: 0, w: W / 2, h: H } })
  // 3. pillow eyes (after carve, so the leiwen packer avoids them)
  for (const p of pillows) {
    kit.pillowBoss(panel, { c: p.c, w: p.w, h: p.h, round: p.round, height: p.height, crown: p.crown, slit: p.slit ? { ...p.slit, offset: p.slit.offset ?? [0, 0] } : false })
  }
  // 4. the ground: big near-square squared spirals (research/04 G1), left half only
  const hr = halfRect ?? { x: 0, y: 0, w: W / 2, h: H }
  kit.leiwenFill(panel, { rect: hr, avoid: 'raised', margin: 0.5 }, {
    pitch: 0.72, line: 0.5, depth: 0.34, roundness: 0.08, jitter: 0.04, cell: [6, 11], pairs: 0, maxAspect: 1.35, seed, ...ground,
  })
  if (mirror) panel.mirrorX()
  const f = panel.field
  for (let i = 0; i < f.length; i++) f[i] -= L1
  return panel
}
