// met-fangyi — the décor map (dossier §c), register by register, as island sheets.
//
// Coordinates were read off the close-ups (detail-face-short, detail-frieze-short,
// detail-foot-short, detail-lid-end, detail-lid-long) at 0.09 mm/px and checked
// against the dossier's tables. Where they disagree the photograph wins:
//   * the outer edge of the main mask carries TWO C islands below the horn, not
//     three (the horn itself occupies the top of the edge column);
//   * the lid horns are plain rounded rectangles (no inner lobe hanging toward the eye);
//   * the brow over the body eye is an inverted-L bar whose outer end turns down,
//     and the axial strip has its own Γ arm above it.
// u = mm outward from the centre flange, v = mm up from the bottom of the field.

import { Sheet, rect } from './relief.js'

const BASE = 51 // half-width (mm) of the short face the compositions were measured on

/** Main register: head-only dissolved taotie with squared ram horns (dossier §c.1). */
export function mainSheet(halfW, H = 93.3) {
  const S = new Sheet()
  // horn: a rounded square C — wide top block over an inner lobe that drops beside the axis;
  // the band entering from the lower edge curls inward into a squared spiral (outer part)
  S.island({
    pts: [[15.5, 53.5], [28.5, 53.5], [28.5, 63], [47.2, 63], [47.2, 84.6], [15.5, 84.6]],
    r: [3.6, 2.6, 1.4, 4, 4.6, 4.2], rim: 1.9, ticks: { sides: 'to', step: 5.2 },
    spiral: { at: [30.9, 63.1], heading: 90, lead: 15.2, dir: -1, size: [12.6, 12.4], pitch: 2.75, turns: 1.75, r: 1.3 },
  })
  // brow: a bar out from beside the axis strip, its outer end turned down (between horn and eye)
  S.island({ pts: [[16.5, 46.2], [28, 46.2], [28, 43.2], [31.6, 43.2], [31.6, 51.6], [16.5, 51.6]], r: [1.6, 1.2, 1.2, 1.4, 1.8, 1.6], rim: 1.15 })
  // eye: rounded-square domed boss with a horizontal slit pupil, sitting low
  S.boss({ c: [23.6, 33.6], w: 13.2, h: 10.6, r: 3.6, height: 3.0, slit: [4.2, 1.2], shoulder: 5 })
  // axial strip beside the flange: C-spiral chain, T cap (scored) at the top, Γ arm, foot turned out
  S.island({
    pts: [[3.2, 1.6], [12.2, 1.6], [12.2, 10.2], [9.6, 10.2], [9.6, 53.4], [10.6, 53.4], [10.6, 49.6], [13.6, 49.6], [13.6, 58.4], [9.6, 58.4], [9.6, 88.6], [3.2, 88.6]],
    r: [1, 1.4, 1, 0.8, 0.6, 0.8, 1.2, 1.2, 0.8, 0.8, 1.2, 1],
    lines: [81.6, 83.1, 84.6, 86.1, 87.4].map((v) => [[3.9, v], [8.9, v]]),
  })
  // outer edge: two C islands opening toward the axis
  S.island({ pts: rect(35.2, 33.4, 45.6, 48.6), r: 3, rim: 1.25, spiral: { at: [35.2, 38], heading: 0, lead: 2.6, dir: 1, size: [8.2, 5.4], pitch: 2.3, turns: 1.5, r: 0.9 } })
  S.island({ pts: rect(34.6, 4.6, 44.8, 26.2), r: 3, rim: 1.25, spiral: { at: [34.6, 20], heading: 0, lead: 2.6, dir: -1, size: [12.4, 5.6], pitch: 2.3, turns: 1.5, r: 0.9 } })
  // jaw: upper-lip bracket from beside the axis, the mouth corner curling in
  S.island({
    pts: [[14, 7.2], [25, 7.2], [25, 3.6], [32.8, 3.6], [32.8, 21.4], [14, 21.4]],
    r: [2.4, 1.4, 1.6, 3, 3.4, 2.8], rim: 1.5,
    spiral: { at: [19.6, 7.3], heading: 90, lead: 5.2, dir: -1, size: [9.6, 6.6], pitch: 2.4, turns: 1.75, r: 1 },
  })
  // re-fit to this face: the axial strip keeps its width, the rest stretches to the field
  const u1 = halfW - 3.3
  const k = (u1 - 13.6) / (BASE - 3.3 - 13.6)
  // on the long face the parts move out with the field but grow less than it does (detail-face-long:
  // the edge C islands and the jaw keep roughly their end-face size; only the horn widens much)
  const f = (u) => (u <= 13.6 ? u : 13.6 + (u - 13.6) * k)
  const out = new Sheet()
  S.islands.forEach((is, i) => {
    const b = is.pts.reduce((a, [u]) => [Math.min(a[0], u), Math.max(a[1], u)], [Infinity, -Infinity])
    if (b[1] <= 13.7) { // the axial strip: unchanged
      out.islands.push({ ...is, pts: is.pts.map(([u, v]) => [u, (v * H) / 93.3]) })
      return
    }
    const ks = 1 + (k - 1) * (i === 0 ? 0.8 : 0.35)
    const uc = (b[0] + b[1]) / 2, uc2 = f(uc)
    const one = new Sheet()
    one.islands.push(is)
    out.islands.push(one.map(([u, v]) => [uc2 + (u - uc) * ks, (v * H) / 93.3]).islands[0])
  })
  // the long-face eye sits a little higher (dossier: v 0.42 vs 0.35 on the end face)
  for (const bo of S.bosses) out.bosses.push({ ...bo, c: [f(bo.c[0]), ((bo.c[1] + Math.max(0, k - 1) * 7) * H) / 93.3] })
  out.field(rect(3.2, 0, u1, H))
  return out
}

/** Top frieze: one kui per half facing the centre flange (dossier §c.2, detail-frieze-*). */
export function friezeSheet(halfW, H = 28.6) {
  const u1 = halfW - 3.3
  const d = halfW - BASE // the long face's extra length goes into the body
  const hs = Math.max(0, d) * 0.16 // the head moves out a little on the long face
  const S = new Sheet()
  // crest band over the head, its outer end rounded
  S.island({ pts: rect(9.8 + hs, 22.6, 24.6 + hs, 26.9), r: [1.2, 2.2, 2.2, 1.2], rim: 0.9 })
  // head block, square-ring eye boss on it
  S.island({ pts: rect(14.6 + hs, 12.8, 26.6 + hs, 21.9), r: 2.2, rim: 0.9 })
  S.boss({ c: [20.6 + hs, 17.4], w: 6.8, h: 4.6, r: 1.7, height: 2.75, ring: 0.3, slit: [2.6, 0.9], shoulder: 1.6 })
  // upper jaw: runs to the flange and hooks down ("7")
  S.island({ pts: [[5.4, 9.2], [9.2, 9.2], [9.2, 16.8], [13.8 + hs, 16.8], [13.8 + hs, 21.6], [5.4, 21.6]], r: [1.2, 1.2, 0.8, 1.2, 1.6, 1.6], rim: 0.9 })
  // lower jaw: an L dropping to the bottom border, its end curled
  S.island({ pts: rect(18 + hs, 2.4, 26.6 + hs, 11.9), r: 2, rim: 0.9, spiral: { at: [18 + hs, 6.4], heading: 0, lead: 2.2, dir: 1, size: [5.4, 4.2], pitch: 2.1, turns: 1.5, r: 0.8 } })
  // claw: a round spiral island under the jaw
  S.island({ pts: rect(8.6 + hs * 0.5, 2.4, 16.8 + hs * 0.6, 8.8), r: 3, rim: 0.9, spiral: { at: [8.6 + hs * 0.5, 5.2], heading: 0, lead: 2, dir: 1, size: [5, 3.6], pitch: 1.9, turns: 1.5, r: 0.8 } })
  // body band running outward
  S.island({ pts: rect(27.6 + hs, 14.4, 37 + d, 22.6), r: 2, rim: 0.9 })
  // big down-curled squared tail at the outer end
  S.island({ pts: rect(38 + d, 11.4, u1 - 0.9, 25.2), r: 3.2, rim: 1.2, spiral: { at: [38 + d, 15.2], heading: 0, lead: 2.6, dir: 1, size: [7.6, 7.4], pitch: 2.4, turns: 1.75, r: 1.1 } })
  // leg band below the body, with a C at its outer end
  S.island({ pts: rect(27.6 + hs, 2.4, 39.6 + d, 13.3), r: 2, rim: 0.9 })
  S.island({ pts: rect(40.6 + d, 2.4, u1 - 0.9, 10.4), r: 2.4, rim: 0.9, spiral: { at: [40.6 + d, 6.6], heading: 0, lead: 1.8, dir: -1, size: [4.6, 3.4], pitch: 1.9, turns: 1.25, r: 0.8 } })
  S.field(rect(3.2, 0, u1, H))
  return S
}

/**
 * Foot frieze: a kui per half (dossier §c.3), re-read from detail-foot-long.jpg, where it is clearest:
 * upper jaw hooking down beside the flange, the head with its square eye boss just above the notch
 * corner, a small beaked crest riding on the body, the body and leg bands running outward full of
 * C-spirals, and the largest island of all, a big squared down-curled tail at the outer end.
 * The leg band turns down beside the notch jamb. Authored on the long face (outer field edge u 62);
 * the end face squeezes it outward of the flange. nh = half the notch plus its frame; nv = notch
 * top in field v.
 */
export function footSheet(halfW, nh, nv, H = 27.3) {
  const u1 = halfW - 3.3
  const L = 62 // field edge the composition was read at
  const S = new Sheet()
  const top = H - 1.9
  // upper jaw: a bar along the top from the flange, its inner end hooking down and curling
  S.island({
    pts: [[3.6, 16.2], [8.6, 16.2], [8.6, 20.4], [18.2, 20.4], [18.2, top], [3.6, top]], r: [1.2, 1.2, 0.8, 1.4, 1.8, 1.4], rim: 0.9,
    spiral: { at: [6.1, 16.3], heading: 90, lead: 3.6, dir: -1, size: [6.4, 4.6], pitch: 1.9, turns: 1.5, r: 0.7 },
  })
  // lower jaw: below it, above the notch, a bracket curling back toward the flange
  S.island({
    pts: rect(3.6, nv + 1.4, 17.8, 14.8), r: 1.6, rim: 0.9,
    spiral: { at: [17.8, nv + 4.6], heading: 180, lead: 2.2, dir: 1, size: [7.4, 3.4], pitch: 1.8, turns: 1.25, r: 0.7 },
  })
  // head plateau with the square eye boss
  S.island({ pts: rect(19.6, 8.4, 30.4, 19), r: 2.4, rim: 0.9 })
  S.boss({ c: [25, 13.6], w: 6, h: 5.4, r: 2, height: 2.6, ring: 0.3, slit: [2.2, 0.8], shoulder: 2.6 })
  // body band over the head
  S.island({ pts: rect(19.6, 20.4, 30.4, top), r: 1.6, rim: 0.9 })
  // small beaked crest (a bird-like head with a ring eye) riding on the body
  S.island({ pts: [[31.8, 15.6], [38.6, 15.6], [40.2, 18.2], [40.2, top], [31.8, top]], r: [1.4, 1.2, 1, 1.6, 1.6], rim: 0.85 })
  S.boss({ c: [35.4, 20.4], w: 3.2, h: 3.2, r: 1.5, height: 2.1, ring: 0.3, shoulder: 1.3 })
  // body runs on outward into the tail
  S.island({ pts: rect(41.6, 16.8, 46.4, top), r: 1.4, rim: 0.8 })
  // claw band right of the head
  S.island({ pts: rect(31.8, 8.4, 46.4, 14.2), r: 1.8, rim: 0.9 })
  // leg band along the bottom, its inner end turning up beside the notch jamb
  S.island({ pts: [[nh + 0.9, 2.4], [46.4, 2.4], [46.4, 7], [nh + 4.8, 7], [nh + 4.8, nv + 0.2], [nh + 0.9, nv + 0.2]], r: [1, 1.6, 1.6, 0.8, 1, 1], rim: 0.9 })
  // the big squared tail, curling down and in
  S.island({
    pts: rect(47.8, 2.4, L - 0.9, top), r: 3.6, rim: 1.2,
    spiral: { at: [47.8, 15.4], heading: 0, lead: 3.4, dir: -1, size: [9.6, 11], pitch: 2.5, turns: 1.75, r: 1.1 },
  })
  // re-fit outward of the flange to this face (the end face is ~16 mm narrower)
  const k = (u1 - 3.2) / (L - 3.2)
  const out = S.map(([u, v]) => [u <= nh + 5 && v < nv + 0.5 ? u : 3.2 + (u - 3.2) * k, v])
  out.field([[3.2, nv], [nh, nv], [nh, 0], [u1, 0], [u1, H], [3.2, H]])
  return out
}

/**
 * Lid long slope: the body mask inverted (horns at the eave, jaws toward the ridge), re-fitted
 * to the trapezoid (dossier §c.4, detail-lid-long). s = slant mm from the eave; halfAt(s) = the
 * slope's half width at s; sTop = slant length.
 */
export function lidLongSheet(halfAt, sTop) {
  const S = new Sheet()
  const edge = (s) => halfAt(s) - 4.4
  // horn: rounded rectangle at the eave, curl in its outer part opening toward the ridge
  S.island({
    pts: rect(17.6, 4.4, Math.min(58, edge(26) - 0.5), 26.4), r: 4.4, rim: 1.9, ticks: { sides: 'tbo', step: 5 },
    spiral: { at: [31.6, 26.3], heading: -90, lead: 14.2, dir: 1, size: [Math.min(13, edge(26) - 33.5 - 3.8), 11.6], pitch: 2.7, turns: 1.75, r: 1.3 },
  })
  // brow under the eye, outer end turned up
  S.island({ pts: [[20.6, 28.6], [37.6, 28.6], [37.6, 36.2], [34.4, 36.2], [34.4, 32.4], [20.6, 32.4]], r: [1.4, 1.6, 1.4, 1, 1, 1.4], rim: 1.05 })
  S.boss({ c: [28.6, 38.4], w: 10.6, h: 8.2, r: 2.9, height: 2.7, slit: [3.6, 1.1], shoulder: 3.8 })
  // edge C islands (outer), the lower one beside the eye, the upper one near the ridge
  S.island({ pts: rect(40.2, 30.4, Math.min(51, edge(44) - 0.4), 44.6), r: 2.8, rim: 1.15, spiral: { at: [40.2, 40], heading: 0, lead: 2.4, dir: -1, size: [7, 5.4], pitch: 2.2, turns: 1.5, r: 0.9 } })
  S.island({ pts: rect(34.6, 48.2, Math.min(45.6, edge(62) - 0.4), 62.2), r: 2.8, rim: 1.15, spiral: { at: [34.6, 52.6], heading: 0, lead: 2.4, dir: 1, size: [6.4, 5.2], pitch: 2.2, turns: 1.5, r: 0.9 } })
  // jaw bracket toward the ridge, curling in
  S.island({
    pts: [[13.4, 61.4], [24.4, 61.4], [24.4, Math.min(65.6, sTop - 4.8)], [31.6, Math.min(65.6, sTop - 4.8)], [31.6, 46.4], [13.4, 46.4]],
    r: [2.2, 1.2, 1.6, 2.8, 3, 2.4], rim: 1.4,
    spiral: { at: [18.8, 61.3], heading: -90, lead: 4.2, dir: 1, size: [8.6, 5.8], pitch: 2.3, turns: 1.75, r: 1 },
  })
  // axial strip beside the midline flange: Γ arm hooking up, scored cap at the eave
  const st = Math.min(68, sTop - 4.2)
  S.island({
    pts: [[3.2, 4.2], [8.8, 4.2], [8.8, 30.6], [13, 30.6], [13, 39.4], [10.2, 39.4], [10.2, 35.2], [8.8, 35.2], [8.8, st - 7.4], [11.4, st - 7.4], [11.4, st], [3.2, st]],
    r: [0.8, 1, 0.8, 1.2, 1.2, 0.8, 0.6, 0.8, 0.8, 1.2, 1.2, 1],
    lines: [5.6, 7, 8.4, 9.8].map((s) => [[3.9, s], [8.1, s]]),
  })
  const field = []
  for (let i = 0; i <= 12; i++) {
    const s = 3 + ((sTop - 5.4) * i) / 12
    field.push([edge(s) + 1, s])
  }
  S.field([[3.2, 3], ...field, [3.2, sTop - 2.4]])
  return S
}

/**
 * Lid end slope (triangle): the same inverted mask fitted into a curved triangle
 * (dossier §c.4 end-slope numbers from side.jpg; detail-lid-end). Authored in (u, y_world);
 * sOfY(y) converts to slant, halfAtY(y) is the half width at that height.
 */
export function lidEndSheet(halfAtY, sOfY, yTop) {
  const S = new Sheet()
  const edge = (y) => halfAtY(y) - 4.2
  // horn: its outer side follows the hip
  S.island({
    pts: [[10.8, 173.2], [edge(173.2) - 0.6, 173.2], [edge(190.4) - 0.6, 190.4], [10.8, 190.4]], r: [3, 2.4, 3, 3.4], rim: 1.6, ticks: { sides: 'b', step: 4.6 },
    spiral: { at: [22.4, 190.3], heading: -90, lead: 6.4, dir: 1, size: [Math.max(6, edge(186) - 26.4), 9.4], pitch: 2.3, turns: 1.5, r: 1.1 },
  })
  S.island({ pts: rect(7.4, 191.9, 19.6, 195.3), r: 1.2, rim: 0.9 })
  S.boss({ c: [14.4, 199.4], w: 8.2, h: 5.6, r: 2.2, height: 2.5, slit: [3, 1], shoulder: 1.9 })
  S.island({ pts: rect(20.2, 194.6, Math.max(23.5, edge(203) - 0.4), 203.2), r: 2.2, rim: 0.9, spiral: { at: [20.2, 199.4], heading: 0, lead: 1.6, dir: -1, size: [3.4, 3], pitch: 1.8, turns: 1, r: 0.7 } })
  // jaw hooks toward the apex
  S.island({ pts: rect(7.4, 204.6, Math.min(19.4, edge(211.6) - 0.4), 211.6), r: 2, rim: 0.9, spiral: { at: [12, 211.5], heading: -90, lead: 2.2, dir: 1, size: [4.4, 3], pitch: 1.8, turns: 1.25, r: 0.7 } })
  // axial strip beside the end-slope flange, scored cap at the eave
  S.island({ pts: rect(3, 170.6, 6.6, 214.4), r: 0.9, lines: [171.8, 173, 174.2].map((y) => [[3.6, y], [6, y]]) })
  const field = []
  for (let i = 0; i <= 14; i++) {
    const y = 169.8 + ((yTop - 3 - 169.8) * i) / 14
    field.push([Math.max(3.4, edge(y) + 1), y])
  }
  S.field([[3, 169.8], ...field, [3, yTop - 3]])
  return S.map(([u, y]) => [u, sOfY(y)])
}

/** Knob long face (stretched over the trapezoid): flat C-spirals 2 × 3 on leiwen. */
export function knobLongSheet(w, h) {
  const S = new Sheet()
  const hw = w / 2
  const cw = (hw - 2.2) / 1.5, rh = (h - 3.4) / 2
  // centre column straddles the axis: author the half
  for (let row = 0; row < 2; row++) {
    const v0 = 1.8 + row * rh
    S.island({ pts: rect(0.4, v0 + 0.3, cw * 0.5 - 0.3, v0 + rh - 0.3), r: 1, rim: 0 })
    S.island({ pts: rect(cw * 0.5 + 0.3, v0 + 0.3, cw * 1.5 - 0.3, v0 + rh - 0.3), r: 1.6, rim: 0.6, spiral: { at: [cw * 0.5 + 0.3, v0 + rh * (row ? 0.35 : 0.65)], heading: 0, lead: 1, dir: row ? -1 : 1, size: [cw * 0.55, rh * 0.4], pitch: 1.2, turns: 1.25, r: 0.4 } })
  }
  S.boss({ c: [cw * 0.25, 1.8 + rh * 1.5], w: 2.2, h: 2.2, r: 1, height: 1.9, ring: 0.25, shoulder: 0.9 })
  S.field(rect(0.2, 1.4, hw - 1.4, h - 1.2))
  return S
}

/** Knob end (triangle, stretched): two ring eyes over a hook. */
export function knobEndSheet(w, h) {
  const S = new Sheet()
  S.boss({ c: [2.6, h * 0.42], w: 2.6, h: 2.6, r: 1.25, height: 1.9, ring: 0.3, shoulder: 1 })
  S.island({ pts: [[0.4, 1.8], [5.6, 1.8], [5.6, h * 0.3], [3.2, h * 0.3], [3.2, 4], [0.4, 4]], r: [0.6, 1, 0.8, 0.6, 0.6, 0.6], rim: 0 })
  S.island({ pts: rect(0.4, h * 0.6, 2.4, h * 0.82), r: 0.8, rim: 0 })
  S.field(rect(0.2, 1.4, w / 2 - 1.6, h - 1.2))
  return S
}
