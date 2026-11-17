// nezu-fangyi — round 5: the broad lid slope TRACED off reference/nezu-fangyi/faces/face-lid-broad.jpg
// (196 × 116 mm chord plane, 6 px/mm; centre flange at x 98; the eave line at face y 2.56, the ridge at 113.4).
// Left half, read on 2.4× crops with a 5 mm grid.
//
// The photograph sets the ZONES up the slope (round 4 had a 3 % lip and a 66.5 % main panel):
//   plain eave band ON the slope   y  2.6 – 14.6   (≈ 0.107 of the slope; the dossier's 0.086 lip was right —
//                                                    the vertical fascia is BELOW it, see three-quarter.jpg)
//   strip of small dashes / hooks  y 14.6 – 21
//   main mask                      y 21   – 72.7  (≈ 0.47)
//   plain separator band           y 72.7 – 78.8
//   upper frieze (crested kui)     y 79   – 100.5
//   top band (in the knob's shadow) y 100.5 – 111
// Main mask: an oval pillow eye HIGH by the flange (73.8, 53.6) with a big dark pupil in its upper half, a cup band
// under it and a long bar under that; an oval horn coil right above the eye; a big Γ (vertical x 32.6 from the eave
// strip up to y 49, arm out to x 47); a big coil low at the hip (22, 30); a rounded nose/mouth frame (46–66, 21–38)
// holding two curls; stacked squared hooks and G-spirals filling the rows y 50–70; a pellet boss by the flange.

import { renderTrace, raisedFraction } from './trace.js'

export const LID_Y = { eave: 2.56, ridge: 113.4, strip: 14.6, main: 21, sep0: 72.7, sep1: 78.8, frieze0: 79.3, frieze1: 100.5, top1: 111 }

export const LID_TRACE = {
  bands: [
    // ---- eye zone
    { ctrl: [[63.8, 48.6], [63.8, 45.6], [81.6, 45.6], [81.6, 49.4]], w: 2.6, round: 0.7, inner: 0.3 },
    { ctrl: [[61.8, 42.4], [88.4, 42.4], [88.4, 39.6]], w: 2.4, round: 0.6 },
    { lead: [[56.4, 62.6], [56.4, 65.3]], coil: { c: [71.5, 65.3], R: 3.6, ax: 1.6, start: 180, sweep: 420, dir: -1, hold: 230, rEnd: 1.0 }, w: (t) => (t < 0.5 ? 2.8 : 2.8 - (t - 0.5) * 1.6), start: 'blunt', end: 'round' },
    { ctrl: [[85.0, 47.8], [85.0, 71.6]], w: 2.4 },
    { ctrl: [[64.6, 52.4], [64.6, 59.6]], w: 1.6, line: false },
    // ---- rows y 50–70
    { ctrl: [[31.4, 67.6], [25.0, 67.6], [25.0, 62.0], [31.4, 62.0], [31.4, 64.6]], w: 2.4 },
    { ctrl: [[34.4, 61.6], [34.4, 68.6], [46.0, 68.6], [46.0, 61.6], [39.6, 61.6], [39.6, 64.6]], w: 2.4 },
    { ctrl: [[25.0, 71.2], [52.0, 71.2]], w: 1.8, line: false },
    { coil: { c: [51.4, 65.4], R: 2.4, start: 0, sweep: 340, dir: 1, hold: 150, rEnd: 0.7 }, w: (t) => 2.2 - 0.5 * t },
    { lead: [[31.8, 51.8]], coil: { c: [27.2, 55.2], R: 3.2, start: 0, sweep: 400, dir: 1, hold: 200, rEnd: 0.9 }, w: (t) => 2.6 - 0.8 * t },
    { ctrl: [[31.0, 59.3], [47.6, 59.3]], w: 2.2, line: false },
    { coil: { c: [35.4, 54.6], R: 2.8, start: 90, sweep: 380, dir: 1, hold: 180, rEnd: 0.8 }, w: (t) => 2.4 - 0.6 * t },
    { coil: { c: [43.0, 54.6], R: 2.8, start: 90, sweep: 380, dir: -1, hold: 180, rEnd: 0.8 }, w: (t) => 2.4 - 0.6 * t },
    { ctrl: [[51.4, 47.8], [51.4, 60.2]], w: 2.4 },
    { ctrl: [[61.0, 59.6], [54.8, 59.6], [54.8, 53.6], [61.0, 53.6]], w: 2.2 },
    { ctrl: [[61.0, 51.2], [54.8, 51.2], [54.8, 45.6], [61.0, 45.6]], w: 2.2 },
    // ---- the big Γ
    { ctrl: [[32.6, 15.4], [32.6, 49.0], [47.4, 49.0], [47.4, 45.4]], w: [4.4, 4.4, 3.0, 3.0], round: 0.5, start: 'blunt' },
    // ---- lower left: coil at the hip, spiral above
    { lead: [[30.0, 22.0], [22.0, 22.0]], coil: { c: [22.0, 29.0], R: 5.0, start: 270, sweep: 420, dir: -1, hold: 230, rEnd: 1.2 }, w: (t) => 2.8 - 0.8 * Math.max(0, t - 0.4) / 0.6, start: 'round' },
    { coil: { c: [23.2, 43.8], R: 3.0, start: 0, sweep: 380, dir: 1, hold: 180, rEnd: 0.8 }, w: (t) => 2.4 - 0.6 * t },
    { ctrl: [[21.6, 48.6], [28.8, 48.6]], w: 2.0, line: false },
    // ---- nose / mouth frame with two curls
    { ctrl: [[52.0, 37.6], [45.8, 37.6], [45.8, 21.6], [65.6, 21.6], [65.6, 37.6], [59.4, 37.6]], w: 2.6, round: 0.8, inner: 0.35 },
    { coil: { c: [51.6, 30.6], R: 2.6, start: 90, sweep: 380, dir: 1, hold: 180, rEnd: 0.9 }, w: (t) => 2.2 - 0.5 * t },
    { coil: { c: [60.0, 30.6], R: 2.6, start: 90, sweep: 380, dir: -1, hold: 180, rEnd: 0.9 }, w: (t) => 2.2 - 0.5 * t },
    // ---- stacked hooks between Γ and frame, right of the frame, by the flange
    { ctrl: [[42.6, 46.0], [37.0, 46.0], [37.0, 40.6], [41.4, 40.6]], w: 2.2 },
    { ctrl: [[37.2, 37.6], [42.8, 37.6], [42.8, 31.6], [39.0, 31.6]], w: 2.2 },
    { ctrl: [[37.2, 28.4], [37.2, 22.6], [42.8, 22.6]], w: 2.2, line: false },
    { ctrl: [[69.8, 21.6], [69.8, 38.4]], w: 2.2 },
    { ctrl: [[72.6, 39.4], [79.4, 39.4], [79.4, 33.6], [75.4, 33.6]], w: 2.2 },
    { ctrl: [[72.6, 22.0], [72.6, 29.6], [78.6, 29.6]], w: 2.2 },
    { coil: { c: [83.4, 36.0], R: 3.0, start: 0, sweep: 380, dir: 1, hold: 180, rEnd: 0.8 }, w: (t) => 2.2 - 0.5 * t },
    { ctrl: [[81.4, 30.0], [93.2, 30.0]], w: 2.0, line: false },
    { ctrl: [[81.6, 26.4], [81.6, 21.8], [93.0, 21.8], [93.0, 25.2], [85.4, 25.2]], w: 2.0 },
    { ctrl: [[90.4, 34.0], [93.2, 34.0], [93.2, 39.4]], w: 2.0, line: false },
    { ctrl: [[89.0, 46.4], [93.2, 46.4]], w: 2.0, line: false },
    { ctrl: [[89.6, 50.4], [93.2, 50.4], [93.2, 63.6], [89.6, 63.6], [89.6, 54.6], [92.0, 54.6]], w: 2.0 },
    // ---- the strip of dashes along the eave
    ...[[16.2, 29.4], [36.4, 50.0], [52.4, 66.0], [68.4, 80.0], [82.4, 93.0]].map(([a, b]) => ({ ctrl: [[a, 18.0], [b, 18.0]], w: 1.8, line: false })),
    // ---- upper frieze: crested kui, hooks
    { ctrl: [[40.4, 89.4], [31.4, 89.4], [31.4, 81.8], [40.0, 81.8], [40.0, 85.6], [35.8, 85.6]], w: 2.2 },
    { ctrl: [[56.8, 82.0], [45.8, 82.0]], w: 2.2, end: 'spiral', spiral: { dir: -1, turns: 1.0, R: 2.0 } },
    { coil: { c: [63.4, 83.8], R: 2.2, start: 180, sweep: 340, dir: -1, hold: 150, rEnd: 0.7 }, w: (t) => 2.0 - 0.4 * t },
    { ctrl: [[71.4, 89.8], [73.8, 89.8], [73.8, 81.8], [76.2, 81.8]], w: 2.4 },
    { ctrl: [[78.6, 89.6], [83.6, 89.6], [83.6, 81.8], [78.6, 81.8]], w: 1.8 },
    { ctrl: [[78.6, 85.7], [81.2, 85.7]], w: 1.8, line: false },
    { ctrl: [[92.6, 89.4], [86.6, 89.4], [86.6, 85.6], [92.4, 85.6], [92.4, 81.8], [86.6, 81.8]], w: 1.8, round: 0.6 },
    { ctrl: [[32.4, 96.4], [40.0, 96.4], [49.0, 89.0], [67.6, 89.0]], w: 2.2, round: 0.5 },
    { ctrl: [[43.6, 98.0], [50.6, 92.6], [61.8, 92.6]], w: 2.0, end: 'spiral', spiral: { dir: 1, turns: 1.0, R: 2.2 } },
    { ctrl: [[64.6, 97.2], [79.6, 97.2]], w: 2.0, line: false },
    { ctrl: [[66.4, 93.6], [78.6, 93.6]], w: 1.8, line: false },
    { ctrl: [[82.4, 97.0], [82.4, 92.6], [92.4, 92.6]], w: 2.0 },
    // ---- top band, in the knob's shadow (by eye)
    { ctrl: [[56.0, 108.6], [36.6, 108.6], [36.6, 102.6], [56.0, 102.6]], w: 2.4 },
    { ctrl: [[60.4, 104.6], [92.0, 104.6]], w: 2.0, line: false },
  ],
  blocks: [{ pts: [[-2, 72.9], [100, 72.9], [100, 78.6], [-2, 78.6]], h: 2.2 }], // the plain separator band (half; mirrored)
  pockets: [
    { c: [70.6, 65.8], r: 1.5, depth: 0.9 },
    { c: [22.0, 29.2], r: 1.6, depth: 0.9 },
    { c: [52.2, 31.2], r: 1.3, depth: 0.9 },
    { c: [60.8, 31.2], r: 1.3, depth: 0.9 },
  ],
  eyes: [
    { c: [73.8, 53.6], w: 12.5, h: 10.4, round: 0.9, height: 4.3, crown: 0.6, slit: { len: 6.6, width: 2.6, depth: 1.5, offset: [1.4, 1.6] } },
    { c: [89.6, 69.2], w: 6.0, h: 6.0, round: 1, height: 3.6, crown: 0.9, hole: { r: 1.1, depth: 1.0 } },
  ],
}

/**
 * Draw the broad lid slope.  f = hippedLidLayout face ({ w, h }); slot = mm kept clear by the slope-centre flange.
 * Face → panel: x 1:1 about the centre line; y along the slope from the eave line, scaled chord → slant.
 * Returns the zones (panel v) the slope-centre flange is cut to.
 */
export function drawLidBroad(kit, p, { f, slot = 4.6, L1 = 2.5, ground, seed = 1, stats, wScale = 1.2 }) {
  const xc = f.w / 2
  const k = f.h / (LID_Y.ridge - LID_Y.eave)
  const v = (y) => (y - LID_Y.eave) * k
  const map = ([x, y]) => [xc + (x - 98), v(y)]
  const W = xc - slot
  const fields = [
    { x: 0, y: v(LID_Y.strip), w: W, h: v(LID_Y.sep0) - v(LID_Y.strip) },
    { x: 0, y: v(LID_Y.frieze0), w: W, h: v(LID_Y.top1) - v(LID_Y.frieze0) },
  ]
  renderTrace(kit, p, LID_TRACE, { map, L1, shoulder: 0.5, wScale, groove: { w: 0.6, d: 0.42 }, ground, seed, fields, scale: 1 })
  if (stats) stats.raised = raisedFraction(p, { x: xc - 70, y: v(LID_Y.main), w: 70 - slot, h: v(LID_Y.sep0) - v(LID_Y.main) })
  const vm0 = v(LID_Y.strip), vs0 = v(LID_Y.sep0), vs1 = v(LID_Y.sep1), vf0 = v(LID_Y.frieze0)
  return { vm0, Hm: vs0 - vm0, vs0, vs1, vf0, Hu: v(LID_Y.frieze1) - vf0 }
}
