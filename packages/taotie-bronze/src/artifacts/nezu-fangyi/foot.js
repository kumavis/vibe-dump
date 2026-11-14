// nezu-fangyi — round 5: the foot frieze TRACED off reference/nezu-fangyi/faces/face-foot-frieze.jpg
// (180 × 27 mm, 6 px/mm; face y 0 = vessel y 20.85, centre tab at x 90).
// Traced from the RIGHT half, mirrored (x' = 180 − x): on the left half the belly's curled-under lower border hides
// the top ≈ 10 mm of the band, and the left half's visible units read ≈ 8 mm lower than the right half's — the
// photograph's left half is occluded, so the unoccluded right half sets positions.
//
// One long-bodied kui per half facing the centre: its HEAD is a round eye-coil with a pocket near the outer end
// (centre ≈ (27.4, 14.7)), an upper band arching from the head over the body and dropping into a squared U crest;
// the BODY is two long parallel bands along the bottom (y ≈ 7.9 and 5.0), the upper one rolling up at the centre into
// the big tail coil (≈ (79.4, 12.6)); hooked fins stand between U and tail. Bands 2–3 mm, channels ≈ 1 mm.

import { renderTrace, raisedFraction } from './trace.js'

export const FOOT_TRACE = {
  bands: [
    // upper band from the U down over the head into the eye coil
    { lead: [[44.8, 12.8], [44.8, 18.6]], coil: { c: [27.4, 14.7], R: 3.9, start: 90, sweep: 330, dir: 1, hold: 200, rEnd: 1.5 }, w: (t) => 2.8 - 0.8 * Math.max(0, t - 0.5) * 2, start: 'round', end: 'round' },
    // squared U crest
    { ctrl: [[57.5, 23.6], [57.5, 13.6], [48.6, 13.6], [48.6, 23.8]], w: 2.6, round: 0.6, inner: 0.25 },
    // body: upper band rolling up into the tail coil by the centre tab, lower band under it
    { lead: [[21.0, 7.9]], coil: { c: [79.4, 12.6], R: 4.7, start: 270, sweep: 400, dir: 1, hold: 200, rEnd: 1.2 }, w: (t) => (t < 0.6 ? 2.3 : 2.6 - 0.6 * (t - 0.6) / 0.4) },
    { ctrl: [[21.0, 5.0], [84.0, 5.0]], w: 2.0, line: false },
    // small curl between head and U
    { coil: { c: [38.6, 13.4], R: 2.3, start: 0, sweep: 340, dir: 1, hold: 150, rEnd: 0.7 }, w: (t) => 2.1 - 0.5 * t },
    { ctrl: [[33.4, 17.0], [33.4, 21.6], [42.2, 21.6]], w: 2.0, line: false },
    // fins between U and tail
    { ctrl: [[60.6, 24.0], [60.6, 11.4]], w: 2.3 },
    { ctrl: [[63.6, 23.6], [69.8, 23.6], [69.8, 17.4], [65.8, 17.4], [65.8, 20.2]], w: 2.1 },
    { ctrl: [[63.8, 12.0], [72.4, 12.0], [72.4, 15.0]], w: 2.0, line: false },
    { ctrl: [[75.4, 23.8], [85.8, 23.8], [85.8, 20.6]], w: 2.0, line: false },
    // the outer end behind the head
    { ctrl: [[10.4, 23.8], [21.6, 23.8], [21.6, 20.4]], w: 2.0, line: false },
    { ctrl: [[10.4, 19.6], [17.2, 19.6], [17.2, 15.2], [12.8, 15.2]], w: 2.1 },
    { ctrl: [[10.4, 10.8], [18.4, 10.8]], w: 2.0, line: false },
  ],
  pockets: [{ c: [27.2, 14.4], r: 1.4, depth: 1.0 }, { c: [79.4, 12.8], r: 1.1, depth: 0.8 }],
  eyes: [],
  field: { x0: 9.6, x1: 89.0, y0: 3.4, y1: 25.2 },
}

/** Draw the foot frieze on its panel. hwFace = the face half width the trace was read at (82.5 broad). */
export function drawFoot(kit, p, { cell, slot, L1 = 1.6, ground, seed = 1, stats, wScale = 1.25 }) {
  const hw = cell.w / 2
  const sx = hw / 82.5
  const map = ([x, y]) => [hw + (x - 90) * sx, y - 1.65]
  const F = FOOT_TRACE.field
  const rect = { x: 1.4, y: F.y0 - 1.65, w: hw - slot - 1.4 + 0.6, h: F.y1 - F.y0 }
  renderTrace(kit, p, FOOT_TRACE, { map, L1, shoulder: 0.45, wScale, groove: { w: 0.5, d: 0.38 }, ground, seed, fields: [rect], scale: sx })
  if (stats) stats.raised = raisedFraction(p, rect)
  return p
}
