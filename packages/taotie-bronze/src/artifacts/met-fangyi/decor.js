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

import { Sheet, rect, offsetPoly, filletOpen } from './relief.js'

const fl = (pts, r) => filletOpen(pts, r)

const BASE = 51 // half-width (mm) of the short face the compositions were measured on
const HORN_BOX = [13.7, 53.0, 45.6, 82.1]
const JAW_BOX = [12.8, 3.0, 31.6, 15.8]

/** Re-fit a one-island generator from its canonical box into a box; flipV for the inverted lid masks. */
function fitIsland(gen, box, u0, v0, u1, v1, flipV) {
  const S = new Sheet()
  gen(S)
  const [a0, b0, a1, b1] = box
  const sx = (u1 - u0) / (a1 - a0), sy = (v1 - v0) / (b1 - b0)
  const is = S.map(([u, v]) => [u0 + (u - a0) * sx, flipV ? v1 - (v - b0) * sy : v0 + (v - b0) * sy]).islands[0]
  const k = Math.min(1, Math.min(sx, sy))
  is.r = is.r.map((r) => r * k)
  return is
}

/** The canonical horn (mainSheet) re-fitted into a box; tickStep mm: ticks all round the band rim. */
function hornIsland(u0, v0, u1, v1, { flipV = false, tickStep = 0 } = {}) {
  const is = fitIsland(hornInto, HORN_BOX, u0, v0, u1, v1, flipV)
  if (tickStep > 0) {
    // transverse ticks ~1.3 mm long on the band rim, every tickStep mm (detail-lid-long / -end)
    is.lines = is.lines.slice(0, 2)
    const vt = flipV ? v0 : v1, dv = flipV ? -1 : 1
    for (let u = u0 + 4; u <= u1 - 4; u += tickStep) is.lines.push([[u, vt - dv * 0.35], [u, vt - dv * 1.6]])
    for (let v = v0 + 4; v <= v1 - 4; v += tickStep) {
      is.lines.push([[u1 - 0.35, v], [u1 - 1.6, v]])
      is.lines.push([[u0 + 0.35, v], [u0 + 1.6, v]])
    }
  }
  return is
}
/** The canonical jaw S-hook re-fitted into a box (flipV: curling toward the ridge on the lid). */
const jawIsland = (u0, v0, u1, v1, { flipV = false } = {}) => fitIsland(jawInto, JAW_BOX, u0, v0, u1, v1, flipV)

function hornInto(S) {
  // Coordinates re-read from detail-face-short.jpg (u = (x − 605)/11.3, v = (1062 − y)/10.8, right half).
  // horn: a rounded-square C band ~3.8 mm wide. It rises from a root beside the axis strip (its lower
  // inner leg runs down to v 53 and turns out), crosses the top, comes down the outer side and hooks
  // back inward along the bottom into a squared spiral in the outer-lower quarter. Two grooves cut the
  // band: A = its inner edge all the way round, B = the outer edge of the hook where it leaves the
  // outline. Everything the band encloses is plateau packed with round spirals (2 big, 4–6 small).
  S.island({
    pts: [[13.7, 53.0], [26.1, 53.0], [26.1, 60.4], [45.6, 60.4], [45.6, 82.1], [13.7, 82.1]],
    r: [2.4, 2.0, 1.0, 4.5, 6, 6], rim: 0,
    lines: [
      fl([[26.6, 56.8], [17.6, 56.8], [17.6, 78.3], [41.8, 78.3], [41.8, 64.2], [31.6, 64.2], [31.6, 68.6]], [2.2, 3.4, 3.4, 2.2, 1.4]),
      fl([[27.9, 60.0], [27.9, 72.0], [38.4, 72.0], [38.4, 67.2], [35.0, 67.2]], [2.4, 2.0, 1.2]),
      // short ticks across the band (detail-face-short: three on the top, two on the inner leg)
      ...[24.5, 31, 37.5].map((u) => [[u, 81.7], [u, 80.2]]),
      ...[63, 70].map((v) => [[14.1, v], [15.6, v]]),
    ],
    spirals: { rMin: 1.3, rMax: 4.5 },
  })
}
function jawInto(S) {
  // jaw: a bracket from beside the axis whose outer block winds into a squared spiral (the mouth
  // corner); a notch from below opens the S, small spirals ride along its top band
  S.island({
    pts: [[12.8, 3.0], [18.4, 3.0], [18.4, 7.0], [21.6, 7.0], [21.6, 3.0], [31.6, 3.0], [31.6, 15.8], [12.8, 15.8]],
    r: [2.2, 1.2, 0.6, 0.6, 1.2, 3.2, 3.4, 1.8], rim: 0,
    lines: [fl([[20.0, 7.2], [20.0, 11.8], [28.4, 11.8], [28.4, 6.2], [24.4, 6.2], [24.4, 9.2]], [1.6, 1.6, 1.4, 1.0])],
    spirals: { rMin: 1.3, rMax: 3 },
  })
}

/** A C island: rounded box opening toward the axis (u0 side) between v = n0 and n1, `d` mm deep. */
function cIsland(u0, v0, u1, v1, n0, n1, d) {
  return [[u0, v0], [u1, v0], [u1, v1], [u0, v1], [u0, n1], [u0 + d, n1], [u0 + d, n0], [u0, n0]]
}

/** Main register: head-only dissolved taotie with squared ram horns (dossier §c.1). */
export function mainSheet(halfW, H = 93.3) {
  const S = new Sheet()
  hornInto(S)
  // brow: a bar out from beside the axis strip whose outer end turns down into a pointed hook (Γ)
  S.island({
    pts: [[16.4, 45.8], [25.6, 45.8], [26.8, 42.2], [29.8, 43.9], [29.8, 49.4], [16.4, 49.4]], r: [1.2, 0.8, 0.3, 1.8, 2.2, 1.6], rim: 0,
    lines: [fl([[17.6, 47.6], [27.9, 47.6], [27.9, 45.2]], [1])], carve: false,
  })
  // eye: rounded-square domed boss with a horizontal slit pupil, sitting low
  S.boss({ c: [23.6, 33.6], w: 13.2, h: 10.6, r: 3.6, height: 2.8, slit: [4.2, 1.2] })
  // axial strip beside the flange: C-spiral chain, T cap (scored) at the top, Γ arm, foot turned out
  S.island({
    pts: [[3.2, 1.6], [12.2, 1.6], [12.2, 10.2], [9.6, 10.2], [9.6, 53.4], [10.6, 53.4], [10.6, 49.6], [13.6, 49.6], [13.6, 58.4], [9.6, 58.4], [9.6, 88.6], [3.2, 88.6]],
    r: [1, 1.4, 1, 0.8, 0.6, 0.8, 1.2, 1.2, 0.8, 0.8, 1.2, 1],
    lines: [81.6, 83.1, 84.6, 86.1, 87.4].map((v) => [[3.9, v], [8.9, v]]),
  })
  // outer edge: two C islands opening toward the axis, a spiral curled in each lobe
  S.island({ pts: cIsland(33.2, 30.7, 42.6, 46.0, 35.6, 39.8, 3.8), r: [3, 3.2, 3.6, 3.2, 1.2, 0.8, 0.8, 1.2], rim: 0, spirals: { rMin: 1.5, rMax: 3.4 } })
  S.island({ pts: cIsland(34.1, 3.4, 43.4, 21.9, 9.8, 14.0, 3.9), r: [3, 3.2, 3.6, 3.4, 1.2, 0.8, 0.8, 1.2], rim: 0, spirals: { rMin: 1.5, rMax: 3.6 } })
  jawInto(S)
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

/**
 * Top frieze: one kui per half facing the centre flange (dossier §c.2), re-drawn from
 * detail-frieze-short.jpg: the upper jaw hooks down against the flange ("7"), the head with its
 * square-ring eye boss sits ~20 mm out under a small crest, ONE continuous body band runs outward
 * at 0.55–0.85 of the field into a big squared C-tail that fills the outer end and opens downward,
 * and under it a leg band of linked spiral hooks. Every band top is cut with spirals.
 * Authored on the end face (field edge u 47.7); the long face stretches the body outward of u 25.
 */
export function friezeSheet(halfW, H = 28.6) {
  const u1 = halfW - 3.3
  const S = new Sheet()
  const t = H - 2.4, b = 2.6
  const E = 47.7 - 0.8 // outer end of the composition on the end face
  // small hooked crest over the head
  S.island({ pts: [[11, t - 3.2], [17.4, t - 3.2], [17.4, t - 1.4], [19.6, t - 1.4], [19.6, t], [11, t]], r: [1.2, 0.8, 0.6, 0.8, 1.2, 1.6], carve: false,
    lines: [fl([[12.2, t - 1.6], [16.4, t - 1.6]], 0.5)] })
  // upper jaw: runs to the flange and hooks down ("7")
  S.island({ pts: [[4.2, 12.6], [8.6, 12.6], [8.6, 17.4], [13.4, 17.4], [13.4, t - 4.4], [4.2, t - 4.4]], r: [1.6, 1.4, 0.8, 1.2, 1.6, 1.6],
    lines: [fl([[6.4, 13.2], [6.4, 19.6], [11.4, 19.6]], 1)], spirals: { rMin: 1.2, rMax: 2.2 } })
  // head block with the square-ring eye boss
  S.island({ pts: rect(14.6, 12.8, 25.0, t - 4.4), r: 2.4, carve: false })
  S.boss({ c: [19.8, 17.6], w: 6.8, h: 5.0, r: 1.7, height: 2.6, ring: 0.3, slit: [2.6, 0.9] })
  // body + tail, one island: the body band leaves the head at v 15.4–22.6 and runs out into a squared
  // C-tail (u 33 → the end) that opens downward, its outer leg curling back in at the bottom
  S.island({
    pts: [[25.6, 15.4], [32.6, 15.4], [32.6, 8.0], [36.8, 8.0], [36.8, 13.4], [41.6, 13.4], [41.6, 10.2], [E, 8.0], [E, t], [25.6, t - 3.6]],
    r: [1.4, 0.8, 1.8, 1.6, 0.8, 0.8, 2.6, 4.2, 5, 1.6],
    lines: [fl([[25.8, 19.0], [37.6, 19.0], [37.6, 16.8], [E - 4.2, 16.8], [E - 4.2, 11.4]], [1.4, 1.2, 1.6])],
    spirals: { rMin: 1.3, rMax: 3.4 },
  })
  // lower jaw / mouth beside the flange, curling up
  S.island({ pts: rect(4.2, b, 9.8, 11.4), r: 2, spirals: { rMin: 1.2, rMax: 2.6 } })
  // leg band: a chain of linked spiral hooks under the head and body (one band, coils cut along it)
  S.island({ pts: rect(11.2, b, 31.0, 11.4), r: [2, 2.4, 2.4, 2], spirals: { rMin: 1.4, rMax: 3.4 } })
  S.island({ pts: rect(38.6, b, E, 7.0), r: 2, lines: [fl([[40.0, 4.8], [E - 1.6, 4.8], [E - 1.6, 6.2]], 0.8)], carve: false })
  // the long face: the body stretches, the head stays by the flange
  const k = (u1 - 25) / (47.7 - 25)
  const out = S.map(([u, v]) => [u <= 25 ? u : 25 + (u - 25) * k, v])
  out.field(rect(3.2, 0, u1, H))
  return out
}

/**
 * Foot frieze: a kui per half (dossier §c.3), re-read from detail-foot-long.jpg (u = (x − 680)/9.3):
 * squared jaw hooks beside the flange and over the notch corner, ONE eye (an oval ring boss with an
 * oval hollow pupil, no slit) ~26 mm out, a flat beaked bird-like head with a tiny ring eye riding
 * above-out of it, a body band running out to a big squared tail that curls down and in at the outer
 * corner, and a leg band of linked hooks along the bottom. Authored on the long face (outer field edge
 * u 62); the end face squeezes it outward of the flange. nh = half the notch plus its frame; nv = notch
 * top in field v.
 */
export function footSheet(halfW, nh, nv, H = 27.3) {
  const u1 = halfW - 3.3
  const L = 62 // field edge the composition was read at
  const S = new Sheet()
  const top = H - 1.9
  // upper jaw: a bar along the top from the flange
  S.island({ pts: rect(3.6, Math.max(nv + 1.6, 16.6), 9.4, top), r: 1.4, lines: [fl([[5.4, top - 1], [5.4, nv + 3.2]], 1)], carve: false })
  // jaw hook: a C opening toward the flange, a spiral in each lobe
  S.island({ pts: cIsland(10.6, Math.max(nv + 1.4, 13.0), 22.6, top, 17.4, 20.6, 4.4), r: [2.2, 2.6, 3, 2.4, 1, 0.6, 0.6, 1], spirals: { rMin: 1.2, rMax: 2.8 } })
  // lower jaw beside the notch jamb: a squared hook (ᒣ) pointing at the notch
  S.island({
    pts: [[nh + 0.9, 2.4], [nh + 5.2, 2.4], [nh + 5.2, 6.8], [24.6, 6.8], [24.6, 11.4], [nh + 0.9, 11.4]], r: [1, 1, 0.6, 1.6, 1.8, 1.2],
    lines: [fl([[nh + 3.0, 3.0], [nh + 3.0, 9.0], [23.0, 9.0]], 1)], carve: false,
  })
  // the eye: oval ring boss with an oval hollow pupil
  S.boss({ c: [27.2, 14.6], w: 5.4, h: 6.2, r: 2.4, height: 2.3, ring: 0.3, pupil: [1.5, 2.5], n: 2.2 })
  // the flat beaked bird head with a tiny ring eye
  S.island({
    pts: [[30.8, 18.6], [33.4, 16.0], [39.4, 15.4], [41.0, 18.6], [39.4, 23.2], [33.4, 21.6]], r: [0.4, 1, 1.2, 1.2, 1.2, 1],
    lines: [ring([36.6, 18.8], 1.0)], carve: false,
  })
  // body band running out to the tail
  S.island({ pts: rect(30.6, 8.2, 48.4, 12.8), r: 2, spirals: { rMin: 1.2, rMax: 2.0 } })
  // leg band along the bottom running out under the tail, coils cut along it
  S.island({ pts: rect(27.0, 2.4, L - 0.9, 7.8), r: [1.6, 2.4, 2.4, 1.6], spirals: { rMin: 1.3, rMax: 2.6 } })
  // the big squared tail, ~15 × 15: over the top, down the outer side, curling back in at the bottom
  S.island({
    pts: rect(46.8, 9.2, L - 0.9, top), r: [2.4, 3, 5, 3.6],
    lines: [fl([[50.6, 9.4], [50.6, top - 3.8], [L - 4.8, top - 3.8], [L - 4.8, 13.2], [54.4, 13.2], [54.4, 17.2]], [1.6, 2.2, 2.0, 1.2])],
    spirals: { rMin: 1.3, rMax: 2.8 },
  })
  // re-fit outward of the flange to this face (the end face is ~16 mm narrower)
  const k = (u1 - 3.2) / (L - 3.2)
  const out = S.map(([u, v]) => [u <= nh + 5.4 && v < nv + 0.5 ? u : 3.2 + (u - 3.2) * k, v])
  // the photographs show ~1.5–2 mm of leiwen between the bands: narrow every island a little
  for (const is of out.islands) is.pts = offsetPoly(is.pts, 0.4)
  out.field([[3.2, nv], [nh, nv], [nh, 0], [u1, 0], [u1, H], [3.2, H]])
  return out
}

/** A closed circle polyline (ring groove). */
function ring(c, r) {
  const pts = []
  for (let i = 0; i <= 24; i++) pts.push([c[0] + r * Math.cos((i / 24) * Math.PI * 2), c[1] + r * Math.sin((i / 24) * Math.PI * 2)])
  return pts
}

/**
 * Lid long slope: the body mask inverted (horns at the eave, jaws toward the ridge), re-fitted
 * to the trapezoid (dossier §c.4, detail-lid-long). s = slant mm from the eave; halfAt(s) = the
 * slope's half width at s; sTop = slant length. Same generators as the body: the horn is the C band
 * with its hook and packed spirals, now ticked all round its rim; the jaw is the S-hook.
 */
export function lidLongSheet(halfAt, sTop) {
  const S = new Sheet()
  const edge = (s) => halfAt(s) - 4.4
  S.islands.push(hornIsland(17.6, 4.4, Math.min(58, edge(27) - 0.5), 27.4, { flipV: true, tickStep: 3 }))
  // brow under the eye, outer end turned up into a hook
  S.island({ pts: [[20.6, 29.4], [35.2, 29.4], [37.8, 31.4], [37.8, 36.4], [34.8, 36.6], [34.4, 33.0], [20.6, 33.0]], r: [1.4, 1.6, 1.4, 1, 0.3, 1, 1.4], carve: false,
    lines: [fl([[21.8, 31.2], [36.0, 31.2], [36.0, 34.2]], 1)] })
  S.boss({ c: [28.6, 39.4], w: 10.6, h: 8.2, r: 2.9, height: 2.6, slit: [3.6, 1.1] })
  // edge C islands (outer), opening toward the axis
  S.island({ pts: cIsland(40.2, 30.4, Math.min(51, edge(44) - 0.4), 45.0, 35.4, 39.0, 3.4), r: [2.8, 3, 3.2, 2.8, 1, 0.6, 0.6, 1], spirals: { rMin: 1.2, rMax: 3 } })
  S.island({ pts: cIsland(35.0, 48.2, Math.min(46.6, edge(62) - 0.4), 62.4, 53.4, 56.8, 3.4), r: [2.8, 3, 3.2, 2.8, 1, 0.6, 0.6, 1], spirals: { rMin: 1.2, rMax: 3 } })
  // jaw S-hook toward the ridge, curling back on itself
  S.islands.push(jawIsland(13.4, 46.4, 32.0, Math.min(63.4, sTop - 5.2), { flipV: true }))
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
  // horn: the C band with its hook, ticked round the rim; outer side kept inside the hip
  S.islands.push(hornIsland(10.8, 173.2, Math.max(24, edge(188) - 0.6), 190.6, { flipV: true, tickStep: 3 }))
  S.island({ pts: [[7.4, 191.9], [17.6, 191.9], [19.8, 193.4], [19.8, 196.4], [17.4, 196.4], [17.2, 195.3], [7.4, 195.3]], r: [1.2, 1.2, 1, 0.8, 0.3, 0.6, 1.2], carve: false })
  S.boss({ c: [14.4, 199.6], w: 8.2, h: 5.8, r: 2.2, height: 2.4, slit: [3, 1] })
  S.island({ pts: cIsland(20.2, 194.4, Math.max(25.5, edge(203) - 0.4), 203.6, 197.6, 200.4, 2.4), r: [2, 2.2, 2.2, 2, 0.8, 0.5, 0.5, 0.8], spirals: { rMin: 1.1, rMax: 2.4 } })
  // jaw S-hook toward the apex
  S.islands.push(jawIsland(7.2, 204.4, Math.max(16.5, Math.min(21.4, edge(211.6) - 0.4)), 212.2, { flipV: true }))
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

/**
 * Knob roof faces (detail-knob.jpg): FLUSH line work, not raised tiles — one continuous mask of
 * flowing scrolls with two ring eyes at the centre, cut ≤ 0.4 mm into a plain face, a plain eave fillet.
 * Returns groove polylines in panel mm (whole face, symmetric), drawn by knobGrooves().
 */
export function knobLines(w, h, { eyes = true } = {}) {
  const L = []
  const cx = w / 2
  const m = 1.3 // plain margin at the hips and the top
  const eave = 2.4 // the thick plain eave fillet
  // frame groove up the sides and across the top (no line along the eave)
  L.push(fl([[m, eave], [m, h - m], [w - m, h - m], [w - m, eave]], 1))
  const ey = eave + (h - eave) * 0.52, ex = Math.min(3.4, w * 0.13)
  const keep = []
  if (eyes) {
    for (const sx of [-1, 1]) {
      L.push(ring([cx + sx * ex, ey], 1.5))
      L.push(ring([cx + sx * ex, ey], 0.45))
      keep.push([cx + sx * ex, ey, 2.4])
    }
    // the nose lozenge between the eyes
    L.push([[cx, ey + 1.6], [cx + 1.1, ey], [cx, ey - 1.8], [cx - 1.1, ey], [cx, ey + 1.6]])
    keep.push([cx, ey, 1.9])
  }
  // flowing scrolls packed edge to edge over the rest of the face, mirrored about the centre line
  const step = 3.7, r = 1.6
  for (let y = eave + 1.9; y <= h - m - 1.6; y += step * 0.86) {
    const row = Math.round((y - eave) / step)
    for (let x = cx + (row % 2 ? step / 2 : 0.0001); x <= w - m - 1.5; x += step) {
      for (const sx of [1, -1]) {
        const px = cx + sx * (x - cx)
        if (sx < 0 && Math.abs(px - cx) < 0.5) continue
        if (keep.some(([kx, ky, kr]) => Math.hypot(px - kx, y - ky) < kr + r)) continue
        L.push(scroll([px, y], r, sx * (row % 2 ? 1 : -1)))
      }
    }
  }
  return L
}

/** A small round scroll groove of ~1.75 turns (radius r), hand ±1. */
function scroll(c, r, hand) {
  const pts = []
  const turns = 1.75, n = 60
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * turns * Math.PI * 2
    const rr = 0.3 + ((r - 0.3) * i) / n
    pts.push([c[0] + rr * Math.cos(hand * t), c[1] + rr * Math.sin(hand * t)])
  }
  return pts
}
