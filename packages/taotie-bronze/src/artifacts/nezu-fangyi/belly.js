// nezu-fangyi — round 5: the belly mask TRACED off reference/nezu-fangyi/faces/face-belly.jpg
// (200 × 90 mm, 6 px/mm; face mm: x 0 → 200 left → right seen from outside, centre flange at x 100;
// y 0 = vessel y 42.45). Left half only (x 10 → 100), read on 3–3.5× crops with a 5 mm grid
// (.work/r5-nezu-fangyi/grid5.py). The right half of the flattened photo sits ≈ 7 mm higher and ≈ 5 mm further
// out than the left — the bottom-right corner of the fit is a guess (faces.json trust) — so POSITIONS come from the
// left half, and the right half (nearer the camera, sharper) was used only to read shapes.
//
// What the photograph shows, and what this draws (left half, outer corner → centre flange):
// · the HORN: one heavy round coil (outer Ø ≈ 21 mm, centre ≈ (56, 59)) whose eye is a deep dark pocket — it sits
//   right on the brow bar (y ≈ 47), i.e. the horns press down on the eye zone; a small G curl hangs on its right;
// · a long bar at y ≈ 47 from under the horn to the centre, rolling up at the flange into a big G (centre ≈ (89, 55));
// · the EYE: a convex rounded rectangle 13.3 × 11 mm at (73.3, 30.7) with a horizontal slit low and right of its
//   centre, under an arched brow band and a thin lid band, bracketed on the right; a < chevron by the flange;
// · down the outer side: an ear coil with a pocket (centre ≈ (16, 62.5)), a ?-hook, a C-spiral, a squared spiral;
// · the middle: stacked small squared hooks in the top strip, a J swoop, two e-spirals, a squared spiral, a
//   nested C bracket left of the eye; along the bottom a row of curls on a thin base band.
// Bands are 2–3.4 mm wide (the horn 5.6), channels ≈ 1–1.5 mm: ≈ 80 % of the field raised, as photographed.

import { renderTrace, raisedFraction, coilSpine } from './trace.js'
import { bellyX } from './form.js'

const L = (pts) => pts

/** the traced left half, face mm */
export const BELLY_TRACE = {
  bands: [
    // ---- horn: one heavy coil, ≈ 1.1 turns counter-clockwise from its lower right, tongue into the pocket
    { coil: { c: [56, 58.3], R: 7.7, start: -90, sweep: 600, dir: 1, hold: 330, rEnd: 1.0 }, w: (t) => (t < 0.62 ? 5.6 : 5.6 - (t - 0.62) / 0.38 * 3.0), end: 'round', start: 'blunt', line: 1, fixed: true },
    // small G curl hanging on the horn's right
    { coil: { c: [67.6, 55.4], R: 3.1, start: 150, sweep: 400, dir: -1, hold: 190, rEnd: 0.9 }, w: (t) => 2.8 - 0.9 * t, start: 'round', end: 'round' },
    // vertical column right of the horn
    { ctrl: L([[76, 52.8], [76, 71.6]]), w: 5.2, start: 'blunt', end: 'blunt' },
    // the long bar under horn and eye zone, rolling up at the flange into a big G
    { lead: L([[61.2, 47.3]]), coil: { c: [89.3, 54.7], R: 7.4, start: -90, sweep: 405, dir: 1, hold: 200, rEnd: 2.2 }, w: (t) => (t < 0.45 ? 3.1 : 3.8 - 1.0 * (t - 0.45) / 0.55), start: 'round', end: 'round', fixed: true },
    // U cup above the G
    { ctrl: L([[81.8, 70.6], [81.8, 66.2], [94.2, 66.2], [94.2, 70.4]]), w: 2.9, round: 0.6, inner: 0.25 },
    // ---- top strip
    { ctrl: L([[66.4, 76.4], [54.2, 76.4]]), w: 2.6, start: 'round', end: 'spiral', spiral: { dir: -1, turns: 1.0, R: 2.6 } },
    { ctrl: L([[49.0, 81.0], [66.6, 81.0]]), w: 2.0, line: false },
    { ctrl: L([[69.8, 82.0], [74.2, 82.0], [74.2, 77.6], [71.2, 77.6]]), w: 2.0, line: false },
    { ctrl: L([[69.8, 74.0], [74.6, 74.0]]), w: 2.0, line: false },
    { ctrl: L([[79.6, 82.2], [77.0, 82.2], [77.0, 74.0], [79.6, 74.0]]), w: 2.0, line: false },
    { ctrl: L([[82.5, 72.8], [82.5, 82.0], [88.4, 82.0]]), w: 2.9 },
    { ctrl: L([[96.6, 82.0], [91.6, 82.0], [91.6, 74.6], [96.0, 74.6], [96.0, 78.2]]), w: 2.4 },
    // stacked small squared hooks, x 29–36
    ...[0, 1, 2].map((k) => ({ ctrl: L([[29.8, 64.3 + 7.2 * k], [35.8, 64.3 + 7.2 * k], [35.8, 59.7 + 7.2 * k], [31.8, 59.7 + 7.2 * k]]), w: 2.0, line: false })),
    { ctrl: L([[45.0, 80.6], [39.0, 80.6], [39.0, 74.2], [44.0, 74.2]]), w: 2.2 },
    { ctrl: L([[44.8, 70.8], [39.0, 70.8], [39.0, 61.6], [43.6, 61.6], [43.6, 65.6]]), w: 2.2 },
    { ctrl: L([[21.5, 80.5], [27.4, 80.5], [27.4, 72.6], [23.6, 72.6]]), w: 2.4 },
    // ---- outer column
    { lead: L([[23.6, 54.6], [23.6, 64.2]]), coil: { c: [16.4, 62.4], R: 4.3, start: 55, sweep: 400, dir: 1, hold: 230, rEnd: 1.5 }, w: (t) => 4.0 - 1.6 * t, start: 'blunt', end: 'round' },
    { ctrl: L([[24.2, 48.2], [17.6, 48.2], [17.6, 42.6]]), w: 3.0, end: 'spiral', spiral: { dir: 1, turns: 0.9, R: 2.5 } },
    { lead: L([[25.0, 35.6]]), coil: { c: [18.2, 31.2], R: 4.5, start: 40, sweep: 420, dir: 1, hold: 220, rEnd: 1.2 }, w: (t) => 3.2 - t, start: 'round', end: 'round' },
    { ctrl: L([[24.2, 15.4], [14.4, 15.4], [14.4, 22.6], [23.4, 22.6], [23.4, 18.6], [18.8, 18.6]]), w: 2.4, round: 0.6, inner: 0.25 },
    { ctrl: L([[13.6, 11.8], [46.0, 11.8]]), w: 2.2, line: false },
    // ---- middle
    { lead: L([[37.8, 27.0]]), coil: { c: [31.4, 31.0], R: 4.0, start: 270, sweep: 400, dir: -1, hold: 200, rEnd: 1.0 }, w: (t) => 3.0 - t, start: 'round', end: 'round' },
    { lead: L([[44.6, 29.2]]), coil: { c: [41.4, 31.6], R: 2.4, start: 270, sweep: 360, dir: -1, hold: 160, rEnd: 0.7 }, w: (t) => 2.4 - 0.6 * t, start: 'round', end: 'round' },
    { ctrl: L([[28.2, 15.4], [37.8, 15.4], [37.8, 22.6], [29.4, 22.6], [29.4, 18.6], [33.8, 18.6]]), w: 2.4, round: 0.6, inner: 0.25 },
    { ctrl: L([[27.6, 50.6], [27.6, 39.0], [45.2, 39.0]]), w: 2.8, round: 0.9, inner: 0.4 },
    { ctrl: L([[35.4, 49.0], [31.4, 49.0], [31.4, 42.4], [35.8, 42.4]]), w: 2.3 },
    { ctrl: L([[43.8, 57.2], [38.0, 57.2], [38.0, 50.2], [42.6, 50.2], [42.6, 53.4]]), w: 2.2 },
    // nested C bracket left of the eye, a vertical, a narrow C
    { ctrl: L([[54.6, 43.6], [49.0, 43.6], [49.0, 26.3], [54.8, 26.3]]), w: 2.8, round: 0.6, inner: 0.2 },
    { ctrl: L([[55.0, 40.0], [52.6, 40.0], [52.6, 29.6], [55.0, 29.6]]), w: 2.1, line: false },
    { ctrl: L([[58.2, 43.4], [58.2, 27.0]]), w: 3.0 },
    { ctrl: L([[63.6, 37.5], [61.4, 37.5], [61.4, 27.6], [63.6, 27.6]]), w: 1.9, line: false },
    // ---- eye zone: arched brow, lid band, right bracket
    { ctrl: L([[65.2, 38.9], [65.2, 43.3], [82.6, 43.3], [82.6, 38.9]]), w: 3.2, round: 0.7, inner: 0.3 },
    { ctrl: L([[67.8, 37.8], [79.6, 37.8]]), w: 1.9, line: false },
    { ctrl: L([[81.9, 34.4], [83.6, 34.4], [83.6, 22.4], [81.0, 22.4]]), w: 2.6 },
    // < chevron by the flange, curl under it
    { ctrl: L([[96.6, 43.4], [90.0, 38.2], [96.4, 31.6]]), w: 2.6, round: 0.5 },
    { coil: { c: [90.8, 26.4], R: 2.8, start: 200, sweep: 380, dir: -1, hold: 180, rEnd: 0.8 }, w: (t) => 2.4 - 0.6 * t },
    // ---- bottom row
    { coil: { c: [87.2, 15.8], R: 4.2, start: 150, sweep: 400, dir: -1, hold: 200, rEnd: 1.6 }, w: (t) => 2.8 - 0.8 * t },
    { ctrl: L([[49.6, 12.0], [64.6, 12.0]]), w: 2.8, start: 'round', end: 'spiral', spiral: { dir: 1, turns: 1.1, R: 4.6 } },
    { ctrl: L([[70.8, 23.0], [79.4, 23.0]]), w: 2.2, line: false },
    { lead: L([[79.4, 19.4]]), coil: { c: [75.4, 16.6], R: 2.6, start: 90, sweep: 360, dir: 1, hold: 150, rEnd: 0.8 }, w: (t) => 2.2 - 0.6 * t },
    { ctrl: L([[71.0, 11.2], [80.4, 11.2]]), w: 1.8, line: false },
    { ctrl: L([[47.6, 24.8], [44.6, 24.8], [44.6, 15.4], [47.8, 15.4]]), w: 2.0, line: false },
    { ctrl: L([[51.4, 23.4], [51.4, 17.2]]), w: 2.0, line: false },
    // ---- fillers: smaller units in the holes the photograph shows crowded (iteration 2)
    { ctrl: L([[12.4, 52.4], [20.2, 52.4], [20.2, 55.8]]), w: 2.4 },
    { ctrl: L([[30.4, 56.4], [36.0, 56.4], [36.0, 52.0], [32.2, 52.0]]), w: 2.2, line: false },
    { ctrl: L([[70.4, 71.0], [70.4, 62.4]]), w: 2.2, line: false },
    { ctrl: L([[60.8, 73.0], [68.0, 73.0]]), w: 2.0, line: false },
    { ctrl: L([[86.6, 36.4], [86.6, 28.8]]), w: 2.2, line: false },
    { ctrl: L([[54.8, 24.4], [54.8, 16.4]]), w: 2.0, line: false },
    { ctrl: L([[38.4, 46.6], [46.0, 46.6], [46.0, 42.6]]), w: 2.2, line: false },
  ],
  plates: [{ c: [56, 58.3], w: 11, h: 11 }],
  // the gap between the coil's turns, cut as a wide groove spiralling into the pocket (the horn reads as a coiled mass)
  lines: [{ pts: coilSpine({ c: [56, 58.3], R: 4.9, start: -90, sweep: 430, dir: 1, hold: 250, rEnd: 2.6 }), w: 1.25 }],
  pockets: [
    { c: [55.4, 60.4], r: 3.4, ry: 2.9, depth: 5.2 }, // the horn's eye: a deep pocket upper-left of the coil centre, below the ground
    { c: [16.4, 62.5], r: 1.4, depth: 1.0 }, // the ear coil's eye
    { c: [87.2, 15.9], r: 1.3, depth: 0.9 },
  ],
  eyes: [
    { c: [73.3, 30.7], w: 13.3, h: 11.0, round: 0.5, height: 4.4, crown: 0.55, slit: { len: 7.0, width: 1.3, depth: 1.1, offset: [1.2, -2.0] } },
  ],
  field: { x0: 10.6, x1: 99.6, y0: 9.6, y1: 82.8 },
}

/**
 * Draw the belly mask on a panel.  cell = the fang layout cell (w, h panel mm); corner = flange clearance (mm).
 * The face → panel map: panel x = xc + (x − 100) · hw / bellyX(t) (the 'stretch' cell spans the wall's local width),
 * panel y = (y + 42.45 − 46.2) · cell.h / 82.5 (arc length up the bulging wall).
 */
export function drawBelly(kit, p, { cell, corner, L1 = 3.0, ground, seed = 1, stats }) {
  const hw = cell.w / 2
  const kv = cell.h / 82.5
  const yv = (y) => (y + 42.45 - 46.2)
  const tOf = (y) => Math.min(1, Math.max(0, yv(y) / 82.5))
  const map = ([x, y]) => [hw + ((x - 100) * hw) / bellyX(tOf(y)), yv(y) * kv]
  const F = BELLY_TRACE.field
  const a = map([F.x0, F.y0]), b = map([F.x0, F.y1])
  const x0 = Math.max(corner, Math.min(a[0], b[0]))
  const rect = { x: x0, y: a[1], w: hw - 1.0 - x0, h: b[1] - a[1] }
  renderTrace(kit, p, BELLY_TRACE, {
    map, L1, shoulder: 0.5, wScale: 1.45, groove: { w: 0.6, d: 0.45 }, ground, seed, fields: [rect], scale: hw / bellyX(0.35),
  })
  if (stats) stats.raised = raisedFraction(p, rect)
  return p
}
