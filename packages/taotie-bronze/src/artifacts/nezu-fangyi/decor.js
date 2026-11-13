// nezu-fangyi — the décor map (dossier §c), register by register, as sheets
// in half space (u mm outward from the centre line, v mm up the panel).
// Coordinates are written as the dossier gives them — x 0 at the centre
// flange → 1 at the corner, y 0 → 1 up the décor field — and mapped to mm.

import { Sheet } from './relief.js'
import { fillHooks } from './fill.js'

const path = (kit, pts, r = 0) => kit.shapes.resample(kit.shapes.fillet(pts, r), 0.3)

/** normalised → mm mapper for a rectangular field */
function field(hw, v0, Hf) {
  const X = (x) => x * hw, Y = (y) => v0 + y * Hf
  const P = (pts) => pts.map(([x, y]) => [X(x), Y(y)])
  return { X, Y, P }
}

// ------------------------------------------------------------------ belly (§c.1, §c.2)

/**
 * The coiled-horn mask, one half, read off the owner's photograph of the front belly (dossier §c.1; positions
 * re-measured on a 2× crop of three-quarter.jpg, u = 0 at the centre flange → 1 at the corner flange):
 * a big ROUND coiled horn (centre ≈ (0.43, 0.70), R ≈ 12.5 mm, 1.5 turns, a boss in its eye) whose root runs
 * down the outer side as the stem of an E with hooked prongs; a low rounded-square eye frame (0.25, 0.32) with a
 * slit boss; the inner canthus as a band at v 0.5 to the flange; a second, smaller scroll (the ear) between horn
 * and flange; a T-quill and a C-scroll at the outer top corner, an S-hook and three C-scrolls down the outer
 * side; a row of curls along the jaw — and then (fill.js) a crowd of smaller squared and round hooks in every
 * gap that is left, before the leiwen.
 * kind 'narrow' (left/right) uses the same layout compressed into the narrower face (dossier §c.2).
 * hw = half panel width (mm), v0 = top of the plain lower border, Hf = décor field height.
 */
export function bellySheet(kit, { hw, v0, Hf, kind = 'broad', L1 = 3, seed = 1 }) {
  const S = new Sheet()
  const { X, Y, P } = field(hw, v0, Hf)
  const narrow = kind === 'narrow'
  const k = Hf / 75
  const wH = 5.0 * k, wB = 4.4 * k, wS = 3.8 * k
  const T = (at, h) => new kit.shapes.Turtle(at, h)
  const rq = (w) => w * 0.6

  // the horn: root up the outer side of the coil (the E stem), over the top toward the axis, coiled round 1.5 turns
  const hc = [X(narrow ? 0.40 : 0.43), Y(0.70)], R = 12.5 * k, pH = wH + 1.7 * k
  const coil = kit.shapes.cScroll(hc, R, { start: 0, sweep: 500, dir: 1, shrink: 0.2 })
  S.band([[hc[0] + R, Y(0.16)], [hc[0] + R, hc[1] - 0.5], ...coil], kit.shapes.taper(wH, wH * 0.74, 0.4), { capA: 'flat', capB: 'round' })
  S.boss({ c: [hc[0] - 0.4 * k, hc[1] - 0.2 * k], rx: 2.4 * k, h: L1 + 1.3 })
  // E prongs off the stem, toward the axis, each ending in a down-hook
  for (const v of [0.46, 0.31]) S.band(path(kit, [[hc[0] + R, Y(v)], [hc[0] + R - 8.5 * k, Y(v)], [hc[0] + R - 8.5 * k, Y(v) - 4.2 * k]], rq(wS)), wS, { capA: 'flat', capB: 'round' })
  S.band(path(kit, [[hc[0] + R, Y(0.16)], [hc[0] + R - 7 * k, Y(0.16)]]), wS, { capA: 'flat', capB: 'round', line: false })

  // eye: a raised rounded-square frame (臣-derived) round a big flattened slit boss
  const ec = [X(0.25), Y(0.315)]
  const ew = Math.min(21 * k, 0.24 * hw), eh = 16 * k
  S.blob(kit.shapes.rrect(ec, ew, eh, eh * 0.32))
  S.ring(kit.shapes.rrect(ec, ew - 4.4 * k, eh - 4.4 * k, eh * 0.24), 1.3 * k)
  S.boss({ c: ec, rx: ew / 2 - 3.4 * k, ry: eh / 2 - 3.6 * k, h: L1 + 2, slit: [ew * 0.5, 0.8], flat: 0.85 })
  // inner canthus: up from the frame and along v 0.5 to the flange, hooking down at the axis
  S.band(path(kit, [[ec[0] + ew * 0.25, ec[1] + eh / 2], [ec[0] + ew * 0.25, Y(0.51)], [X(0.035), Y(0.51)], [X(0.035), Y(0.42)]], [0, rq(wB), rq(wB), 0]), wB, { capA: 'flat', capB: 'round' })
  // mouth-corner hook under the canthus, by the flange
  S.band(hookPts(kit, [X(0.09), Y(0.30)], 7 * k, wS, 180, -1), wS * 0.95)
  // the ear: a smaller round scroll between the horn and the flange, rising off the canthus band
  const ear = [X(narrow ? 0.17 : 0.19), Y(0.72)], Re = 7.2 * k
  S.band(T([ear[0] - Re, Y(0.51)], 90).fwd(ear[1] + Re - Y(0.51)).curl({ dir: -1, size: [2 * Re, 2 * Re - wS - 1.4 * k], pitch: wS + 1.4 * k, turns: 1.25, r: Re }).spine(0.3), kit.shapes.taper(wB, wS * 0.85, 0.5), { capA: 'flat', capB: 'round' })
  // the axis column above the canthus: a squared hook down from the top, turning out
  S.band(T([X(0.035), Y(0.97)], 270).fwd(Y(0.97) - Y(0.66)).curl({ dir: 1, size: [5.2 * k, 4 * k], pitch: wS + 1.2 * k, turns: 0.75, r: 1.6 * k }).spine(0.3), wS, { capA: 'flat', capB: 'round' })
  // outer top: a T-quill and a C-scroll in the corner
  S.band(path(kit, P([[0.60, 0.965], [0.80, 0.965]])), wS, { capA: 'round', capB: 'round', line: false })
  S.band(T([X(0.70), Y(0.965)], 270).fwd(Y(0.965) - Y(0.70)).curl({ dir: -1, size: [5 * k, 4 * k], pitch: wS + 1.2 * k, turns: 0.75, r: 1.6 * k }).spine(0.3), wS, { capA: 'flat', capB: 'round' })
  const cs = [X(narrow ? 0.88 : 0.90), Y(0.72)], Rc = 7.4 * k
  S.band(T([X(0.79), cs[1] - Rc], 0).fwd(cs[0] + Rc - X(0.79)).curl({ dir: 1, size: [2 * Rc, 2 * Rc - wS - 1.4 * k], pitch: wS + 1.4 * k, turns: 1.25, r: Rc }).spine(0.3), kit.shapes.taper(wB, wS * 0.85, 0.4), { capA: 'round', capB: 'round' })
  // outer side: an S-hook at v 0.47, C-scrolls below it
  S.band(T([hc[0] + R + 3.5 * k, Y(0.47)], 0).fwd(X(0.86) - hc[0] - R - 3.5 * k).curl({ dir: -1, size: [6 * k, 5 * k], pitch: wS + 1.2 * k, turns: 1, r: 1.8 * k }).spine(0.3), wS, { capA: 'round', capB: 'round' })
  for (const [u, v, r, ang, dir] of [[0.74, 0.27, 6.0, 0, 1], [0.93, 0.29, 5.2, 90, -1], [0.90, 0.09, 4.6, 180, 1]]) {
    S.band(kit.shapes.cScroll([X(u), Y(v)], r * k, { start: ang, sweep: 420, dir, shrink: 0.22 }), wS * 0.9, { capA: 'round', capB: 'round' })
  }
  // jaw: a row of curls along the bottom, opening upward
  const curls = narrow ? [0.12, 0.36, 0.58] : [0.11, 0.28, 0.45, 0.61]
  curls.forEach((u, i) => {
    S.band(kit.shapes.cScroll([X(u), Y(0.10)], 4.3 * k, { start: 200, sweep: 400, dir: i % 2 ? 1 : -1, shrink: 0.22 }), wS * 0.9, { capA: 'round', capB: 'round' })
  })
  // the crowd: smaller hooks in every gap that is left
  fillHooks(kit, S, { u0: 1.2, u1: hw - 2.0, v0: v0 + 0.4, v1: v0 + Hf - 0.4 }, { rMin: 3.3 * k, rMax: 6.2 * k, gap: 1.05 * k, wMin: 2.6 * k, wMax: 3.6 * k, seed, round: 0.2, max: 34 })
  return S
}

/** a small squared hook: from `at` heading `h` a lead of `len`, then a 270° squared curl (sense dir) */
function hookPts(kit, at, len, w, h, dir) {
  return new kit.shapes.Turtle(at, h).fwd(len).curl({ dir, size: [w * 1.6, w * 1.2], pitch: w + 1.1, turns: 0.75, r: w * 0.5 }).spine(0.3)
}

// ------------------------------------------------------------------ neck frieze (§c.3)

/** two crested kui per half face, facing the centre block; a = u of the head end (mm), Wu unit width, v0/Hn field */
export function neckSheet(kit, { hw, v0, Hn, slot, seed = 1 }) {
  const S = new Sheet()
  const w = 0.15 * Hn
  const r = w * 1.0 // the photo's neck kui are curvy (S-crests, U-bodies), not squared
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
  // the crowd of short squared hooks in what is left (the photo's neck is packed edge to edge)
  fillHooks(kit, S, { u0: slot + 0.6, u1: hw - 2.2, v0: v0 - 0.2, v1: v0 + Hn + 0.2 }, { rMin: 2.1, rMax: 3.8, gap: 0.75, wMin: 1.8, wMax: 2.7, seed, round: 0.25, max: 24, wScale: 0.42 })
  return S
}

// ------------------------------------------------------------------ foot frieze (§c.4)

/** one long-bodied kui per half face: C-spiral head with pellet eye at the outer end, finned body, C-tail at the tab */
export function footSheet(kit, { hw, v0, Hn, slot, seed = 1 }) {
  const S = new Sheet()
  const w = 0.14 * Hn
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
  fillHooks(kit, S, { u0: slot + 0.6, u1: hw - 2.2, v0: v0 - 0.2, v1: v0 + Hn + 0.2 }, { rMin: 2.0, rMax: 3.6, gap: 0.75, wMin: 1.8, wMax: 2.6, seed, round: 0.25, max: 20, wScale: 0.42 })
  return S
}

// ------------------------------------------------------------------ lid (§c.5, §c.6)

/**
 * Broad lid slope (trapezoid). halfAt(v) = face half width at panel height v (mm); margin = hip-flange clearance.
 * Partition up the slope: eaves lip 0.086, main panel 0.64, separator bar 0.035, upper frieze 0.185, margin.
 */
export function lidBroadSheet(kit, { slant, halfAt, margin = 5, slot = 4.5, seed = 1 }) {
  const S = new Sheet()
  const z = { lip: 0.03, main: 0.68, sep: 0.035, frieze: 0.19 }
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

  // ---- main panel, re-read off a 1.5× crop of the photograph's front slope (left half; u 0 = centre flange):
  // a big slit eye boss HIGH by the flange under a hooked brow, a squared spiral in its own frame below it,
  // the F body (a stem down to an L along the eaves, prongs to the hip), scrolls at the hip edge, hooks along
  // the top — then the crowd of small hooks.
  const ec = Mm([[0.17, 0.68]])[0]
  S.blob(kit.shapes.rrect(ec, 0.24 * Hm, 0.17 * Hm, 0.06 * Hm))
  S.ring(kit.shapes.rrect(ec, 0.24 * Hm - 4.2, 0.17 * Hm - 4.2, 0.04 * Hm), 1.3)
  S.boss({ c: ec, rx: 0.08 * Hm, ry: 0.056 * Hm, h: 2.5 + 2, slit: [0.1 * Hm, 0.8], flat: 0.9 })
  S.band(path(kit, Mm([[0.03, 0.80], [0.03, 0.885], [0.33, 0.885], [0.33, 0.80]]), rs), ws, { capA: 'round', capB: 'round' })
  S.boss({ c: Mm([[0.10, 0.958]])[0], rx: 0.03 * Hm, h: 2.5 + 1.3 })
  // hooks along the top toward the hip
  S.band(path(kit, Mm([[0.42, 0.79], [0.42, 0.90], [0.62, 0.90], [0.62, 0.81], [0.53, 0.81]]), [0, rs, rs, rs, 0]), ws, { capA: 'round', capB: 'round' })
  S.band(path(kit, Mm([[0.70, 0.80], [0.70, 0.955], [0.965, 0.955], [0.965, 0.83], [0.85, 0.83]]), [0, rs, rs, rs, 0]), ws, { capA: 'round', capB: 'round' })
  // canthus: the eye down into the spiral's frame
  S.band(path(kit, Mm([[0.24, 0.60], [0.24, 0.47]])), ws, { capA: 'flat', capB: 'flat', line: false })
  // the squared spiral below the eye, centre ≈ (0.32, 0.29)
  S.band(path(kit, Mm([[0.06, 0.47], [0.49, 0.47], [0.49, 0.11], [0.15, 0.11], [0.15, 0.39], [0.41, 0.39], [0.41, 0.19], [0.24, 0.19], [0.24, 0.30], [0.33, 0.30]]), [0, r, r, r, r, 2.2, 1.9, 1.5, 1.0, 0]), kit.shapes.taper(wm * 0.86, wm * 0.66, 0.5), { capA: 'round', capB: 'round' })
  // the F body: stem from under the top hooks down to the eaves, an L along the eaves to the hip, prongs out
  S.band(path(kit, Mm([[0.60, 0.70], [0.60, 0.04], [0.965, 0.04], [0.965, 0.13]]), [0, r, r, 0]), kit.shapes.taper(wm * 0.86, ws, 0.6), { capA: 'round', capB: 'round' })
  for (const v of [0.56, 0.33]) S.band(path(kit, Mm([[0.60, v], [0.74, v], [0.74, v - 0.07]]), rs), ws, { capA: 'flat', capB: 'round' })
  // scrolls at the hip edge
  for (const [u, v, dir] of [[0.87, 0.66, 1], [0.87, 0.28, -1]]) {
    const c = Mm([[u, v]])[0]
    S.band(kit.shapes.cScroll(c, 0.075 * Hm, { start: dir > 0 ? 270 : 90, sweep: 430, dir, shrink: 0.22 }), ws * 0.9, { capA: 'round', capB: 'round' })
  }

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

  // the crowd of hooks in the gaps of the main panel and the frieze
  const inHalf = (u, v) => u >= slot + 0.4 && u <= halfAt(v) - margin
  fillHooks(kit, S, { u0: slot, u1: halfAt(vm0) - margin, v0: vm0, v1: vs0 }, { rMin: 3.0, rMax: 5.6, gap: 0.95, wMin: 2.3, wMax: 3.3, seed: seed + 1, round: 0.2, max: 30, inside: inHalf })
  fillHooks(kit, S, { u0: slot, u1: halfAt(vf0) - margin, v0: vf0, v1: vf0 + Hu }, { rMin: 2.4, rMax: 4.2, gap: 0.8, wMin: 2.0, wMax: 2.8, seed: seed + 2, round: 0.2, max: 14, inside: inHalf, wScale: 0.42 })
  return {
    sheet: S,
    zones: { vm0, Hm, vs0, vs1, vf0, Hu },
  }
}

/** Narrow lid slope (a steep triangle, 156 × ~92 mm): boss eye ≈ 0.6 up, spiral below, hooks to the hip (mm). */
export function lidNarrowSheet(kit, { slant, halfAt, margin = 4.5, slot = 4, seed = 1 }) {
  const S = new Sheet()
  const v0 = 0.03 * slant
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
  fillHooks(kit, S, { u0: slot, u1: halfAt(v0) - margin, v0, v1: slant - 2 }, { rMin: 2.6, rMax: 5, gap: 0.9, wMin: 2.1, wMax: 3.1, seed, round: 0.2, max: 24, inside: (u, v) => u >= slot + 0.4 && u <= halfAt(v) - margin })
  return { sheet: S, v0 }
}

// ------------------------------------------------------------------ knob (§c.7)

/** knob front: a mini-taotie of squared spirals and pellets inside a ~3 mm plain border (mm, u from the axis) */
export function knobSheet(kit, { kind, halfAt, slant, border = 3, seed = 1 }) {
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
  fillHooks(kit, S, { u0: 1.6, u1: halfAt(border) - border, v0: border, v1: slant - border }, { rMin: 1.9, rMax: 3.2, gap: 0.6, wMin: 1.5, wMax: 2.1, seed, round: 0.25, max: 10, wScale: 0.45, line: false, inside: (u, v) => u <= hb(v) - 0.3 })
  return S
}
