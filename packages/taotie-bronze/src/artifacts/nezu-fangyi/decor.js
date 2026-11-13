// nezu-fangyi — the décor map (dossier §c), register by register, as sheets
// in half space (u mm outward from the centre line, v mm up the panel).
// Coordinates are written as the dossier gives them — x 0 at the centre
// flange → 1 at the corner, y 0 → 1 up the décor field — and mapped to mm.

import { Sheet } from './relief.js'

const path = (kit, pts, r = 0) => kit.shapes.resample(kit.shapes.fillet(pts, r), 0.3)

/** normalised → mm mapper for a rectangular field */
function field(hw, v0, Hf) {
  const X = (x) => x * hw, Y = (y) => v0 + y * Hf
  const P = (pts) => pts.map(([x, y]) => [X(x), Y(y)])
  return { X, Y, P }
}

// ------------------------------------------------------------------ belly (§c.1, §c.2)

/**
 * The coiled-horn mask, one half, as the owner's photograph shows the front belly (dossier §c.1, refined
 * against the photo): a long horn/body band along the top that drops at x ≈ 0.75 and runs out to a spiral
 * tail at the lower corner; a big round-squared coil (centre ≈ (0.45, 0.68)) whose outer band comes down to
 * the eye as the inner canthus (the inverted L); a LOW rounded-square eye frame (0.26, 0.29) holding a big
 * slit boss; an E-shaped cheek beside it; an ear spiral at the upper corner; a row of C-curls along the jaw.
 * kind 'narrow' (left/right) uses the same layout compressed into the narrower face (dossier §c.2).
 * hw = half panel width (mm), v0 = top of the plain lower border, Hf = décor field height.
 */
export function bellySheet(kit, { hw, v0, Hf, kind = 'broad', L1 = 3 }) {
  const S = new Sheet()
  const { X, Y, P } = field(hw, v0, Hf)
  const narrow = kind === 'narrow'
  const k = narrow ? 0.92 : 1
  const wH = 0.074 * Hf * k // horn / coil: the widest bands
  const wB = 0.068 * Hf * k // body bands
  const wS = 0.058 * Hf * k // hooks, prongs, curls
  const rr = (w) => w * 0.95 // squared-ROUND outer corners (the coil reads as a C-scroll)
  const rq = (w) => w * 0.6

  // horn back along the top → drops at x 0.75 → body band out to the corner → spiral tail at the lower corner
  const horn = [[0.20, 0.92], [0.75, 0.92], [0.75, 0.445], [0.965, 0.445], [0.965, 0.235], [0.85, 0.235], [0.85, 0.35], [0.905, 0.35]]
  S.band(path(kit, P(horn), [0, rr(wH), rr(wH), rq(wB), rq(wB), 1.8, 1.4, 0]), kit.shapes.taper(wH, wS, 0.55), { capA: 'round', capB: 'round' })
  // the coil: from the eye's inner canthus up, out along y 0.545, round the scroll and in to its eye
  const coil = [[0.19, 0.40], [0.19, 0.545], [0.60, 0.545], [0.60, 0.825], [0.31, 0.825], [0.31, 0.615], [0.515, 0.615], [0.515, 0.745], [0.405, 0.745], [0.405, 0.69]]
  S.band(path(kit, P(coil), [0, rq(wB), rr(wH), rr(wH), rr(wH), 3.2, 2.6, 2.0, 0]), kit.shapes.taper(wB, wH * 0.72, 0.18), { capA: 'flat', capB: 'round' })
  // nose hook between the coil and the centre flange
  S.band(path(kit, P([[0.23, 0.80], [0.06, 0.80], [0.06, 0.645], [0.135, 0.645], [0.135, 0.70]]), [0, rq(wS), rq(wS), 1.2, 0]), wS, { capA: 'round', capB: 'round' })
  // eye: a raised rounded-square frame (臣-derived) with a ring groove and a big flattened slit boss
  const ec = [X(0.26), Y(0.29)]
  const ew = 0.19 * hw * (narrow ? 1.05 : 1), eh = 0.23 * Hf
  S.blob(kit.shapes.rrect(ec, ew, eh, Math.min(ew, eh) * 0.26))
  S.ring(kit.shapes.rrect(ec, ew - 4.6, eh - 4.6, Math.min(ew, eh) * 0.2), 1.5)
  S.boss({ c: ec, rx: Math.min(0.125 * hw, ew / 2 - 3.2), ry: Math.min(0.07 * Hf, eh / 2 - 3.2), h: L1 + 2, slit: [0.13 * hw, 0.85], flat: 0.85 })
  // E-shaped cheek beside the eye: stem at x 0.53, three prongs toward the axis
  S.band(path(kit, P([[0.53, 0.20], [0.53, 0.46]])), wB, { capA: 'round', capB: 'flat', line: false })
  for (const y of [0.46, 0.34, 0.215]) S.band(path(kit, P([[0.53, y], [0.42, y], [0.42, y - 0.045]]), rq(wS)), wS, { capA: 'flat', capB: 'round', line: y !== 0.34 })
  // ear spiral at the upper corner
  S.band(path(kit, P([[0.835, 0.55], [0.835, 0.85], [0.975, 0.85], [0.975, 0.615], [0.895, 0.615], [0.895, 0.735]]), [0, rr(wB), rr(wB), 1.8, 1.2, 0]), kit.shapes.taper(wB, wS, 0.6), { capA: 'round', capB: 'round' })
  // small C-hooks between the cheek and the body (the photo's "cc")
  if (!narrow) {
    S.band(path(kit, P([[0.705, 0.355], [0.625, 0.355], [0.625, 0.255], [0.69, 0.255], [0.69, 0.295]]), [0, rq(wS), rq(wS), 1.0, 0]), wS * 0.9, { capA: 'round', capB: 'round' })
  }
  // jaw: a band along the bottom with a row of C-curls opening upward
  S.band(path(kit, P([[0.05, 0.06], [0.975, 0.06]])), wS, { capA: 'round', capB: 'flat' })
  const curls = narrow ? [0.07, 0.29, 0.62, 0.84] : [0.07, 0.27, 0.47, 0.66, 0.84]
  for (const x of curls) S.band(path(kit, P([[x, 0.06], [x, 0.16], [x + 0.085, 0.16], [x + 0.085, 0.11]]), [0, rq(wS), rq(wS), 0]), wS * 0.95, { capA: 'flat', capB: 'round' })
  return S
}

// ------------------------------------------------------------------ neck frieze (§c.3)

/** two crested kui per half face, facing the centre block; a = u of the head end (mm), Wu unit width, v0/Hn field */
export function neckSheet(kit, { hw, v0, Hn, slot }) {
  const S = new Sheet()
  const w = 0.18 * Hn
  const r = w * 0.65
  const gap = 2.0
  const span = hw - slot - 2.6
  const Wu = (span - gap) / 2
  for (let i = 0; i < 2; i++) {
    const a = slot + i * (Wu + gap)
    const M = (pts) => pts.map(([x, y]) => [a + (1 - x) * Wu, v0 + y * Hn])
    // one S-shaped band: the C-tail at the outer end → the U of the body → up the neck → the long crest curling
    // back over the head (the photo's crested, bird-headed kui)
    S.band(path(kit, M([[0.13, 0.40], [0.055, 0.40], [0.055, 0.86], [0.22, 0.86], [0.22, 0.22], [0.82, 0.22], [0.82, 0.93], [0.40, 0.93], [0.40, 0.665], [0.56, 0.665]]), [0, 1.2, r, r, r, r, r, r, 1.2, 0]), w, { capA: 'round', capB: 'round' })
    // round pellet eye on the head, the beak hooking down toward the axis
    S.boss({ c: M([[0.935, 0.75]])[0], rx: 0.11 * Hn, h: 1.5 + 1.0 })
    S.band(path(kit, M([[0.82, 0.48], [1.0, 0.48], [1.0, 0.33]]), r), w * 0.9, { capA: 'flat', capB: 'round' })
    // a wing hook inside the U; two short hooked feet below it
    S.band(path(kit, M([[0.62, 0.22], [0.62, 0.50], [0.49, 0.50], [0.49, 0.42]]), [0, r * 0.8, r * 0.8, 0]), w * 0.85, { capA: 'flat', capB: 'round' })
    for (const x of [0.36, 0.66]) S.band(path(kit, M([[x, 0.22], [x, 0.05], [x + 0.08, 0.05]]), r * 0.7), w * 0.8, { capA: 'flat', capB: 'round', line: false })
  }
  return S
}

// ------------------------------------------------------------------ foot frieze (§c.4)

/** one long-bodied kui per half face: C-spiral head with pellet eye at the outer end, finned body, C-tail at the tab */
export function footSheet(kit, { hw, v0, Hn, slot }) {
  const S = new Sheet()
  const w = 0.15 * Hn
  const r = w * 0.55
  const a = slot, Wu = hw - slot - 2.8
  const M = (pts) => pts.map(([x, y]) => [a + (1 - x) * Wu, v0 + y * Hn])
  // head: a C-spiral at the outer end
  S.band(path(kit, M([[0.17, 0.46], [0.02, 0.46], [0.02, 0.92], [0.135, 0.92], [0.135, 0.66], [0.075, 0.66]]), [0, r, r, 1, 0.8, 0]), w, { capA: 'flat', capB: 'round' })
  S.boss({ c: M([[0.215, 0.72]])[0], rx: 0.09 * Hn, h: 1.2 + 0.9 })
  // body band, upright hooked fins (the E/F shapes) and two hooks below
  S.band(path(kit, M([[0.12, 0.46], [0.90, 0.46], [0.975, 0.46], [0.975, 0.88], [0.89, 0.88], [0.89, 0.68]]), [0, 0, r, r, 0.8, 0]), w, { capA: 'flat', capB: 'round' })
  for (const x of [0.33, 0.51, 0.69]) S.band(path(kit, M([[x, 0.46], [x, 0.90], [x - 0.065, 0.90], [x - 0.065, 0.74]]), r), w * 0.95, { capA: 'flat', capB: 'round' })
  for (const x of [0.42, 0.62, 0.80]) S.band(path(kit, M([[x, 0.46], [x, 0.10], [x + 0.055, 0.10]]), r * 0.8), w * 0.9, { capA: 'flat', capB: 'round', line: false })
  return S
}

// ------------------------------------------------------------------ lid (§c.5, §c.6)

/**
 * Broad lid slope (trapezoid). halfAt(v) = face half width at panel height v (mm); margin = hip-flange clearance.
 * Partition up the slope: eaves lip 0.086, main panel 0.64, separator bar 0.035, upper frieze 0.185, margin.
 */
export function lidBroadSheet(kit, { slant, halfAt, margin = 5, slot = 4.5 }) {
  const S = new Sheet()
  const z = { lip: 0.086, main: 0.64, sep: 0.035, frieze: 0.185 }
  const vm0 = z.lip * slant, Hm = z.main * slant
  const vs0 = vm0 + Hm, vs1 = vs0 + z.sep * slant
  const vf0 = vs1 + 0.004 * slant, Hu = z.frieze * slant
  // x is normalised to the free half width at that height (centre slot → hip), y to the zone height
  const M = (v0, Hz) => (pts) => pts.map(([x, y]) => {
    const v = v0 + y * Hz
    const hw = halfAt(v) - margin
    return [slot + x * (hw - slot), v]
  })
  const Mm = M(vm0, Hm), Mu = M(vf0, Hu)
  const wm = 0.085 * Hm, ws = 0.07 * Hm
  const r = wm * 0.7, rs = ws * 0.6

  // ---- main panel (placed against the photograph's left half of the front slope)
  // eye: a big domed oval slit boss (0.26, 0.67) in a raised rounded socket; a canthus band down to the spiral
  const ec = Mm([[0.26, 0.67]])[0]
  S.blob(kit.shapes.rrect(ec, 0.22 * Hm, 0.18 * Hm, 0.05 * Hm))
  S.ring(kit.shapes.rrect(ec, 0.22 * Hm - 4.4, 0.18 * Hm - 4.4, 0.035 * Hm), 1.4)
  S.boss({ c: ec, rx: 0.072 * Hm, ry: 0.052 * Hm, h: 2.5 + 2, slit: [0.1 * Hm, 0.8], flat: 0.9 })
  S.band(path(kit, Mm([[0.30, 0.60], [0.30, 0.50]])), ws, { capA: 'flat', capB: 'flat', line: false })
  // brow: a band over the eye hooking down at both ends; a small boss by the flange just under the separator
  S.band(path(kit, Mm([[0.22, 0.855], [0.22, 0.935], [0.50, 0.935], [0.50, 0.85]]), rs), ws, { capA: 'round', capB: 'round' })
  S.boss({ c: Mm([[0.09, 0.925]])[0], rx: 0.038 * Hm, h: 2.5 + 1.5 })
  // the outer hooked band along the top toward the hip
  S.band(path(kit, Mm([[0.58, 0.85], [0.58, 0.935], [0.96, 0.935], [0.96, 0.86]]), rs), ws, { capA: 'round', capB: 'round' })
  // nose hook between the eye and the centre flange
  S.band(path(kit, Mm([[0.05, 0.82], [0.05, 0.60], [0.13, 0.60]]), rs), ws * 0.95, { capA: 'round', capB: 'round' })
  // a large squared-round spiral below the eye, centred ≈ (0.39, 0.29)
  S.band(path(kit, Mm([[0.14, 0.50], [0.60, 0.50], [0.60, 0.08], [0.18, 0.08], [0.18, 0.41], [0.50, 0.41], [0.50, 0.18], [0.29, 0.18], [0.29, 0.31], [0.40, 0.31]]), [0, r, r, r, r, 2.6, 2.2, 1.8, 1.2, 0]), kit.shapes.taper(wm, wm * 0.72, 0.55), { capA: 'round', capB: 'round' })
  // the outer F body: stem with two prongs toward the axis, an ear spiral above, a spiral tail at the lower corner
  S.band(path(kit, Mm([[0.70, 0.85], [0.70, 0.10], [0.965, 0.10], [0.965, 0.40], [0.83, 0.40], [0.83, 0.20], [0.905, 0.20]]), [0, r, r, r, 2.0, 1.4, 0]), kit.shapes.taper(wm, ws, 0.6), { capA: 'round', capB: 'round' })
  S.band(path(kit, Mm([[0.70, 0.77], [0.56, 0.77], [0.56, 0.70]]), rs), ws, { capA: 'flat', capB: 'round' })
  S.band(path(kit, Mm([[0.70, 0.615], [0.61, 0.615]])), ws, { capA: 'flat', capB: 'round', line: false })
  S.band(path(kit, Mm([[0.80, 0.50], [0.80, 0.80], [0.965, 0.80], [0.965, 0.585], [0.885, 0.585], [0.885, 0.68]]), [0, rs, rs, 1.6, 1.2, 0]), kit.shapes.taper(ws, ws * 0.85, 0.6), { capA: 'round', capB: 'round' })
  // claws along the eaves
  for (const x of [0.30, 0.47]) S.band(path(kit, Mm([[x, 0.08], [x, 0.0], [x - 0.06, 0.0]]), rs * 0.8), ws * 0.85, { capA: 'flat', capB: 'round', line: false })

  // ---- separator bar: a plain raised band across the slope
  const sep = []
  for (let i = 0; i <= 8; i++) {
    const v = vs0 + ((vs1 - vs0) * i) / 8
    sep.push([halfAt(v) + 2, v])
  }
  S.blob(kit.shapes.poly([[-3, vs0], ...sep, [-3, vs1]]))

  // ---- upper frieze: one kui per half facing the centre peg
  const wu = 0.17 * Hu, ru = wu * 0.6
  S.boss({ c: Mu([[0.25, 0.56]])[0], rx: 0.12 * Hu, h: 2.0 + 1.6 })
  S.band(path(kit, Mu([[0.06, 0.50], [0.06, 0.64], [0.16, 0.64], [0.16, 0.84], [0.37, 0.84], [0.37, 0.30]]), [0, ru, 0, ru, ru, 0]), wu, { capA: 'round', capB: 'flat' })
  S.band(path(kit, Mu([[0.06, 0.40], [0.06, 0.28], [0.37, 0.28], [0.965, 0.28], [0.965, 0.86], [0.88, 0.86], [0.88, 0.66]]), [0, ru, 0, ru, ru, 1, 0]), wu, { capA: 'round', capB: 'round' })
  S.band(path(kit, Mu([[0.37, 0.84], [0.56, 0.84], [0.56, 0.62], [0.49, 0.62]]), ru), wu * 0.9, { capA: 'flat', capB: 'round' })
  for (const x of [0.54, 0.74]) S.band(path(kit, Mu([[x, 0.28], [x, 0.06], [x + 0.06, 0.06]]), ru * 0.8), wu * 0.9, { capA: 'flat', capB: 'round', line: false })
  S.band(path(kit, Mu([[0.70, 0.86], [0.78, 0.86], [0.78, 0.55]]), ru), wu * 0.85, { capA: 'round', capB: 'round', line: false })

  return {
    sheet: S,
    zones: { vm0, Hm, vs0, vs1, vf0, Hu },
  }
}

/** Narrow lid slope (a steep triangle, 156 × ~92 mm): boss eye ≈ 0.6 up, spiral below, hooks to the hip (mm). */
export function lidNarrowSheet(kit, { slant, halfAt, margin = 4.5, slot = 4 }) {
  const S = new Sheet()
  const v0 = 0.086 * slant
  const Hh = slant * 0.85
  const M = (pts) => pts.map(([x, y]) => {
    const v = v0 + y * Hh
    return [slot + x * Math.max(1, halfAt(v) - margin - slot), v]
  })
  const w = 4.6, r = 2.4
  const ec = M([[0.30, 0.58]])[0]
  S.blob(kit.shapes.rrect(ec, 13, 10.5, 4))
  S.ring(kit.shapes.rrect(ec, 8.6, 6.4, 2.6), 0.8)
  S.boss({ c: ec, rx: 3.3, ry: 2.7, h: 2.5 + 2, slit: [4.4, 0.7] })
  // spiral below the eye
  S.band(path(kit, M([[0.05, 0.42], [0.62, 0.42], [0.62, 0.08], [0.10, 0.08], [0.10, 0.33], [0.46, 0.33], [0.46, 0.17], [0.25, 0.17], [0.25, 0.25]]), [0, r, r, r, r, 1.8, 1.6, 0]), w, { capA: 'round', capB: 'round' })
  // hooks toward the hip
  S.band(path(kit, M([[0.62, 0.58], [0.88, 0.58], [0.88, 0.48]]), r), w * 0.9, { capA: 'round', capB: 'round' })
  S.band(path(kit, M([[0.80, 0.08], [0.95, 0.08], [0.95, 0.30], [0.84, 0.30]]), r), w * 0.9, { capA: 'round', capB: 'round' })
  // brow / crest toward the apex
  S.band(path(kit, M([[0.05, 0.74], [0.55, 0.74], [0.55, 0.86]]), r), w * 0.85, { capA: 'round', capB: 'round' })
  S.boss({ c: M([[0.25, 0.88]])[0], rx: 1.8, h: 2.5 + 1.2 })
  return { sheet: S, v0 }
}

// ------------------------------------------------------------------ knob (§c.7)

/** knob front: a mini-taotie of squared spirals and pellets inside a ~3 mm plain border (mm, u from the axis) */
export function knobSheet(kit, { kind, halfAt, slant, border = 3 }) {
  const S = new Sheet()
  const w = 2.4, r = 1.1
  const hb = (v) => halfAt(v) - border
  if (kind === 'long') {
    // two squared spirals in the lower half (±0.22 W, 0.32 H), r ≈ 0.12 W
    const cx = 15, cy = 0.32 * slant
    const sp = [[cx - 9, cy - 8], [cx + 8.5, cy - 8], [cx + 8.5, cy + 7.5], [cx - 7.5, cy + 7.5], [cx - 7.5, cy - 3.8], [cx + 4.4, cy - 3.8], [cx + 4.4, cy + 3.4], [cx - 3, cy + 3.4], [cx - 3, cy], [cx + 0.6, cy]]
    S.band(path(kit, sp, [0, r, r, r, r, 0.9, 0.8, 0.6, 0]), w, { capA: 'round', capB: 'round' })
    // a short vertical nose bar between them
    S.band(path(kit, [[0, cy - 8], [0, cy + 6]]), 3.2, { capA: 'round', capB: 'round', line: false })
    // dissolved brow / crest zone: a central pellet, small pellets and hooks round it
    const top = slant - border
    S.boss({ c: [0, 0.75 * slant], rx: 2.3, h: 1.2 + 1.1 })
    S.boss({ c: [9, 0.80 * slant], rx: 1.5, h: 1.2 + 0.9 })
    S.boss({ c: [Math.min(hb(0.66 * slant) - 3, 16), 0.66 * slant], rx: 1.5, h: 1.2 + 0.9 })
    S.band(path(kit, [[3.5, 0.60 * slant], [11, 0.60 * slant], [11, 0.70 * slant]], r), w, { capA: 'round', capB: 'round' })
    S.band(path(kit, [[4, Math.min(top - 2, 0.90 * slant)], [hb(0.9 * slant) - 2, Math.min(top - 2, 0.90 * slant)], [hb(0.9 * slant) - 2, 0.82 * slant]], r), w * 0.9, { capA: 'round', capB: 'round' })
  } else {
    // the narrow faces: plainer — one squared spiral each side and a pellet
    const cx = 8.5, cy = 0.36 * slant
    S.band(path(kit, [[cx - 6, cy - 6], [cx + 6, cy - 6], [cx + 6, cy + 6], [cx - 5, cy + 6], [cx - 5, cy - 2], [cx + 2.5, cy - 2], [cx + 2.5, cy + 2], [cx - 1, cy + 2]], [0, r, r, r, 0.8, 0.7, 0.5, 0]), w * 0.9, { capA: 'round', capB: 'round' })
    S.boss({ c: [0, 0.72 * slant], rx: 2, h: 1.2 + 1 })
  }
  return S
}
