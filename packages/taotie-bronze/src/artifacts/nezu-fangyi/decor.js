// nezu-fangyi — the décor map (dossier §c), register by register, as sheets
// in half space (u mm outward from the centre line, v mm up the panel).
// Coordinates are written as the dossier gives them — x 0 at the centre
// flange → 1 at the corner, y 0 → 1 up the décor field — and mapped to mm.

import { Sheet } from './relief.js'
import { fillHooks } from './fill.js'

const path = (kit, pts, r = 0) => kit.shapes.resample(kit.shapes.fillet(pts, r), 0.3)

/**
 * A heavy coil: the spine keeps radius R for the first `hold` degrees (so the outer loop is round and full, as
 * the photo's horn coils are), then dives smoothly to rEnd at the end of `sweep` (the tongue in the coil's eye).
 */
function coil(c, R, { start = 90, sweep = 380, dir = -1, hold = 180, rEnd = 0.25 * R, step = 0.3 } = {}) {
  const out = []
  const n = Math.max(8, Math.ceil(((sweep * Math.PI) / 180) * R / step))
  for (let i = 0; i <= n; i++) {
    const a = (sweep * i) / n
    const t = a <= hold ? 0 : (a - hold) / (sweep - hold)
    const r = R + (rEnd - R) * t * t * (3 - 2 * t)
    const th = ((start + dir * a) * Math.PI) / 180
    out.push([c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r])
  }
  return out
}

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
  const { X, Y } = field(hw, v0, Hf)
  const narrow = kind === 'narrow'
  const k = Hf / 75
  // V-b plateaus: broad bands, 0.08–0.09 of the register (photo: 25–30 px of a 280 px register)
  // round 3: ×1.2 again — the photo's bands are 6.5–7.5 mm with 1.5–2 mm channels between them
  // round 4: wider again, toward the photo's 7–9 mm flat bands with 1–2 mm channels (review: 45 % bare ground → ~20 %)
  const wH = 9.6 * k, wB = 8.4 * k, wS = 7.0 * k
  const rq = (w) => w * 0.75
  const rc = wB * 0.8 // squared-round corner radius of the body bands

  // the horn (photo, right half re-measured on a 3× crop): ONE heavy band leaves the forehead by the flange at the
  // top, runs outward along the top edge and curls clockwise — down the outer side, back under, up into its own
  // centre — about 1.1 turns round a centre at (0.44, 0.765); nothing of it falls below v ≈ 0.55
  const R = 12.2 * k
  const hc = [X(narrow ? 0.40 : 0.44), Y(0.755)]
  const top = hc[1] + R
  const lead = [[X(0.065), top - 1.0 * k], [X(0.065), top], [hc[0], top]]
  const hcoil = coil(hc, R, { start: 90, sweep: 385, dir: -1, hold: 170, rEnd: 2.2 * k })
  const horn = kit.shapes.resample(kit.shapes.fillet([...lead, ...hcoil.slice(1)], [0, 1.5 * k, 0]), 0.3)
  S.band(horn, kit.shapes.taper(wH, 6.6 * k, 0.72), { capA: 'flat', capB: 'round' })

  // eye: a raised rounded-square frame (臣-derived) round a flattened slit boss, low in the field
  const ec = [X(0.25), Y(0.345)]
  const ew = Math.min(19 * k, 0.22 * hw), eh = 17 * k
  S.blob(kit.shapes.rrect(ec, ew, eh, eh * 0.36))
  S.ring(kit.shapes.rrect(ec, ew - 4.6 * k, eh - 4.6 * k, eh * 0.26), 1.2 * k)
  S.boss({ c: ec, rx: ew / 2 - 3.6 * k, ry: eh / 2 - 4.2 * k, h: L1 + 2, slit: [ew * 0.45, 0.9], flat: 0.9 })

  // the brow / body band: down the axis from the horn root, along over the eye (the inverted-L canthus), down the
  // outer side of the eye (the photo's 'd' stem), then out along v 0.25 to the corner, where it turns up and back
  const yb = Y(0.25), yBrow = ec[1] + eh / 2 + 2.4 * k + wB / 2
  const uStem = ec[0] + ew / 2 + 2.6 * k + wB / 2
  S.band(path(kit, [[X(0.065), top - 2 * k], [X(0.065), yBrow], [uStem, yBrow], [uStem, yb], [X(0.95), yb], [X(0.95), Y(0.36)]], [0, rc, rc, rc, rc, 0]), wB, { capA: 'flat', capB: 'round' })
  // inner canthus: from the frame's upper inner corner up into the brow band
  S.band(path(kit, [[ec[0] - ew * 0.18, ec[1] + eh / 2 - 1.5 * k], [ec[0] - ew * 0.18, yBrow]]), wS * 0.9, { capA: 'flat', capB: 'flat', line: false })
  // two claw hooks hanging off the body band toward the corner (round 4: down to the jaw row, so the bottom row of
  // curls and hooks runs the full width as in the photo)
  for (const u of narrow ? [0.74] : [0.66, 0.84]) S.band(path(kit, [[X(u), yb], [X(u), Y(0.075)], [X(u) + 6.5 * k, Y(0.075)], [X(u) + 6.5 * k, Y(0.15)]], [0, rq(wS), rq(wS), 0]), wS * 1.08, { capA: 'flat', capB: 'round' })

  // the F body: a vertical band at u ≈ 0.72 from the top down into the body band, two hooked prongs outward
  // round 4: re-spaced so stem, prongs, ear and the body's upturn stay separate bands with ≈ 1.5 mm channels
  // (at round-3 widths they fused into one blob in the outer third)
  const uF = X(narrow ? 0.64 : 0.665)
  S.band(path(kit, [[uF, Y(0.93)], [uF, yb]]), wB * 1.12, { capA: 'round', capB: 'flat' })
  S.band(path(kit, [[uF, Y(0.58)], [X(0.90), Y(0.58)], [X(0.90), Y(0.58) - 2.6 * k]], [0, rq(wS), 0]), wS, { capA: 'flat', capB: 'round' })
  if (!narrow) S.band(path(kit, [[uF, Y(0.43)], [X(0.835), Y(0.43)]]), wS, { capA: 'flat', capB: 'round' })
  // the ear / tail: a squared-round spiral in the outer top corner, off the top of the F stem
  const ecx = X(narrow ? 0.85 : 0.86), ecy = Y(0.795), Re = 6.8 * k
  const ear = kit.shapes.cScroll([ecx, ecy], Re, { start: 90, sweep: 380, dir: -1, shrink: 0.31 })
  S.band([[uF, ecy + Re], ...ear], kit.shapes.taper(wS, 3.6 * k, 0.45), { capA: 'flat', capB: 'round' })

  // jaw / lip: a band along v 0.06 with three C-curls rising off it, opening upward
  const yj = Y(0.06)
  S.band(path(kit, [[X(0.065), Y(0.20)], [X(0.065), yj], [X(0.56), yj]], [0, rq(wS), 0]), wS, { capA: 'round', capB: 'round' })
  // review: full-height curls (v 0.05–0.15) standing shoulder to shoulder
  for (const [u, dir] of narrow ? [[0.17, -1], [0.40, 1]] : [[0.15, -1], [0.315, 1], [0.48, -1]]) {
    const c = [X(u), yj + 4.6 * k + wS * 0.1]
    S.band(kit.shapes.cScroll(c, 4.6 * k, { start: 270, sweep: 330, dir, shrink: 0.3 }), kit.shapes.taper(wS, 4.2 * k, 0.4), { capA: 'flat', capB: 'round' })
  }
  // the crowd: smaller hooked plateaus in every gap that is left; leiwen only in the channels between
  fillHooks(kit, S, { u0: 1.2, u1: hw - 1.6, v0: v0 + 0.4, v1: v0 + Hf - 0.3 }, { rMin: 1.8 * k, rMax: 9 * k, gap: 0.62 * k, wMin: 5.2 * k, wMax: 7.0 * k, wFloor: 3.4 * k, seed, round: 0.3, max: 110, wScale: 0.64, stubs: true, curls: true })
  return S
}

/** a small squared hook: from `at` heading `h` a lead of `len`, then a 270° squared curl (sense dir) */
function hookPts(kit, at, len, w, h, dir) {
  return new kit.shapes.Turtle(at, h).fwd(len).curl({ dir, size: [w * 1.6, w * 1.2], pitch: w + 1.1, turns: 0.75, r: w * 0.5 }).spine(0.3)
}

// ------------------------------------------------------------------ neck frieze (§c.3)

/**
 * Two crested kui per half face, facing the centre block (dossier §c.3; photo: curvilinear, not squared): a boss
 * eye at the axis-side top, an S-crest rising over the head and curling back, a U-shaped body band sweeping back
 * to a curled tip, and a lower band ending in a C-spiral tail with two short hooked feet. x 0 = head (axis side).
 */
export function neckSheet(kit, { hw, v0, Hn, slot, seed = 1 }) {
  const S = new Sheet()
  const w = 0.165 * Hn
  const gap = 1.6
  const span = hw - slot - 2.6
  const Wu = (span - gap) / 2
  const sp = (pts) => kit.shapes.spline(pts, 0.3)
  const join = (lead, curl) => kit.shapes.resample([...lead, ...curl.slice(1)], 0.3)
  for (let i = 0; i < 2; i++) {
    const a = slot + i * (Wu + gap)
    const M1 = ([x, y]) => [a + x * Wu, v0 + y * Hn]
    const M = (pts) => pts.map(M1)
    // round 4 (review: 'U-scrolls, not creatures'): ONE crested kui per unit, built round a HEAD — a socket ring
    // round the boss eye, a beak/jaw hooking down toward the axis, the crest springing from the head — with the
    // U body, the lower band and the tail all joined to it, so each unit reads as one animal
    const ec = M1([0.17, 0.60]), Rr = 0.2 * Hn
    S.boss({ c: ec, rx: 0.085 * Hn, h: 1.3 + 0.9 })
    S.band(kit.shapes.cScroll(ec, Rr, { start: 200, sweep: 300, dir: -1, shrink: 0 }), w * 0.85, { capA: 'round', capB: 'round', line: false })
    // beak: from the socket's axis side out to the slot and hooking down
    S.band(sp(M([[0.12, 0.42], [0.04, 0.40], [0.015, 0.30], [0.03, 0.20]])), w * 0.9, { capA: 'flat', capB: 'round' })
    // S-crest: from the head top up and back, curling down at its outer end
    const Rc = 0.13 * Hn, cc = M1([0.40, 0.80])
    S.band(join(sp([...M([[0.19, 0.84], [0.22, 0.96], [0.32, 0.97]]), [cc[0], cc[1] + Rc]]), kit.shapes.cScroll(cc, Rc, { start: 90, sweep: 300, dir: -1, shrink: 0.32 })), kit.shapes.taper(w, w * 0.7, 0.6), { capA: 'round', capB: 'round' })
    // the U body: from the back of the head down, along, and up into a curled wing tip
    const Ru = 0.12 * Hn, cu = M1([0.86, 0.78])
    S.band(join(sp([...M([[0.33, 0.56], [0.40, 0.40], [0.52, 0.36], [0.66, 0.40], [0.72, 0.58]]), [cu[0] - Ru, cu[1]]]), kit.shapes.cScroll(cu, Ru, { start: 180, sweep: 290, dir: -1, shrink: 0.3 })), kit.shapes.taper(w * 1.05, w * 0.7, 0.6), { capA: 'round', capB: 'round' })
    // lower band: from under the head back along the bottom into a C-spiral tail curling up
    const Rt = 0.13 * Hn, ct = M1([0.88, 0.33])
    S.band(join(sp([...M([[0.20, 0.38], [0.18, 0.20], [0.30, 0.15], [0.62, 0.15]]), [ct[0], ct[1] - Rt]]), kit.shapes.cScroll(ct, Rt, { start: 270, sweep: 300, dir: 1, shrink: 0.32 })), kit.shapes.taper(w, w * 0.7, 0.7), { capA: 'round', capB: 'round' })
    // two short hooked feet
    for (const x of [0.38, 0.62]) S.band(sp(M([[x, 0.15], [x - 0.01, 0.04], [x - 0.07, 0.03]])), w * 0.8, { capA: 'flat', capB: 'round', line: false })
  }
  // the crowd of short hooks in what is left
  fillHooks(kit, S, { u0: slot + 0.6, u1: hw - 2.2, v0: v0 - 0.2, v1: v0 + Hn + 0.2 }, { rMin: 2.0, rMax: 3.6, gap: 0.7, wMin: 2.2, wMax: 3.0, seed, round: 0.6, max: 24, wScale: 0.5, curls: true })
  return S
}

// ------------------------------------------------------------------ foot frieze (§c.4)

/**
 * ONE long-bodied kui per half face in a single row (photo): a C-spiral head with a pellet eye at the outer end,
 * a horizontal body band carrying upright hooked fins (the E/F shapes), a C-tail curling up by the centre tab.
 */
export function footSheet(kit, { hw, v0, Hn, slot, seed = 1 }) {
  const S = new Sheet()
  const w = 0.16 * Hn
  const r = w * 0.6
  const a = slot, Wu = hw - slot - 2.8
  const M1 = ([x, y]) => [a + (1 - x) * Wu, v0 + y * Hn]
  const M = (pts) => pts.map(M1)
  // head: a big C-spiral at the outer end, curling from the body band up and back
  const Rh = 0.36 * Hn, ch = M1([0.13, 0.22 + 0.36])
  const head = kit.shapes.cScroll(ch, Rh, { start: 270, sweep: 270, dir: 1, shrink: 0.25 })
  // body band from the tail end to under the head, continuing into the head spiral
  S.band(kit.shapes.resample([...path(kit, M([[0.97, 0.62], [0.97, 0.22], [0.22, 0.22]]), r), [ch[0], ch[1] - Rh], ...head.slice(1)], 0.3), kit.shapes.taper(w, w * 0.7, 0.8), { capA: 'round', capB: 'round' })
  S.boss({ c: ch, rx: 0.075 * Hn, h: 1.2 + 0.9 }) // the pellet eye in the head's C
  // upright hooked fins along the body
  for (const x of [0.36, 0.53, 0.70]) S.band(path(kit, M([[x, 0.22], [x, 0.86], [x - 0.07, 0.86], [x - 0.07, 0.66]]), r), w * 0.92, { capA: 'flat', capB: 'round' })
  // the tail by the tab: a C curling up and in
  S.band(path(kit, M([[0.97, 0.62], [0.97, 0.86], [0.86, 0.86], [0.86, 0.58]]), r), w * 0.9, { capA: 'flat', capB: 'round' })
  fillHooks(kit, S, { u0: slot + 0.6, u1: hw - 2.2, v0: v0 - 0.2, v1: v0 + Hn + 0.2 }, { rMin: 2.4, rMax: 3.4, gap: 0.8, wMin: 1.9, wMax: 2.5, seed, round: 0.3, max: 10, wScale: 0.42 })
  return S
}

// ------------------------------------------------------------------ lid (§c.5, §c.6)

/**
 * Broad lid slope (trapezoid). halfAt(v) = face half width at panel height v (mm); margin = hip-flange clearance.
 * Partition up the slope: eaves lip 0.086, main panel 0.64, separator bar 0.035, upper frieze 0.185, margin.
 */
export function lidBroadSheet(kit, { slant, halfAt, margin = 5, slot = 4.5, seed = 1 }) {
  const S = new Sheet()
  // round 4: the photo's separator is a plain band ≈ 0.05 of the slope (dossier 0.035 read thin: photo wins)
  const z = { lip: 0.03, main: 0.665, sep: 0.05, frieze: 0.19 }
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
  // round 3: broad flat bands as on the belly (photo: 0.08–0.11 of the main panel, channels 1–2 mm)
  // round 4: the photo's lid bands are narrower than the belly's (≈ 0.06–0.08 of the main panel) and far more
  // numerous — a dense field of squared hooks with 1–2 mm channels, not a few fat letters
  const wm = 0.092 * Hm, ws = 0.078 * Hm
  const r = wm * 0.7, rs = ws * 0.6

  // ---- main panel, re-read off a 3× crop of the photograph's front slope (left half; u 0 = centre flange):
  // a slit eye boss HIGH by the flange in a cup band under a squared hook, a compact coil below it hung off a
  // vertical band with a T foot, an E between them, the heavy T/F body with its cross-arm, a tail spiral at the
  // outer bottom, squared hooks along the top — then the crowd of smaller hooks.
  const M1 = (p) => Mm([p])[0]
  const Wx = (u) => M1([u, 0.5])[0] // mm u at mid panel (for sizes)
  const ec = M1([0.25, 0.68])
  S.boss({ c: ec, rx: 0.092 * Hm, ry: 0.072 * Hm, h: 2.5 + 2.2, slit: [0.10 * Hm, 0.9], flat: 0.85 })
  S.band(kit.shapes.spline(Mm([[0.10, 0.73], [0.11, 0.595], [0.25, 0.545], [0.39, 0.595], [0.40, 0.73]]), 0.3), ws, { capA: 'round', capB: 'round' })
  S.band(path(kit, Mm([[0.165, 0.815], [0.165, 0.905], [0.40, 0.905], [0.40, 0.815], [0.32, 0.815]]), [0, rs, rs, rs, 0]), ws, { capA: 'round', capB: 'round' })
  S.boss({ c: M1([0.075, 0.935]), rx: 0.03 * Hm, h: 2.5 + 1.3 })
  // the coil: off a vertical band at u 0.22 (T foot on the eaves), a lead outward along its top, ~1.2 turns clockwise
  const Rs = 0.135 * Hm, sc = M1([0.43, 0.30])
  const sTop = sc[1] + Rs
  const vx = M1([0.22, 0.3])[0]
  S.band(path(kit, [[vx, M1([0.22, 0.50])[1]], [vx, M1([0.22, 0.05])[1]]]), wm * 1.12, { capA: 'round', capB: 'flat' })
  S.band(path(kit, Mm([[0.13, 0.05], [0.31, 0.05]])), ws, { capA: 'round', capB: 'round', line: false })
  // photo: the coil is a heavy MASS (a broad band wound into a disc, the spiral read from its groove), not an outline
  S.band(kit.shapes.resample([[vx, sTop], [sc[0], sTop], ...coil(sc, Rs, { start: 90, sweep: 450, dir: -1, hold: 170, rEnd: 0.12 * Rs }).slice(1)], 0.3), kit.shapes.taper(wm * 1.2, wm * 0.75, 0.7), { capA: 'flat', capB: 'round' })
  // the E between eye and body: a spine at u 0.53 with two prongs toward the axis, each hooking down
  S.band(path(kit, Mm([[0.53, 0.86], [0.53, 0.58]])), ws, { capA: 'round', capB: 'flat' })
  for (const v of [0.84, 0.72]) S.band(path(kit, Mm([[0.53, v], [0.45, v], [0.45, v - 0.06]]), rs), ws * 0.95, { capA: 'flat', capB: 'round' })
  // the T/F body: a heavy vertical at u 0.72 (T foot on the eaves), the cross-arm at v 0.58, turning down at the hip
  // into the tail spiral
  S.band(path(kit, Mm([[0.72, 0.58], [0.72, 0.05]])), wm * 1.15, { capA: 'flat', capB: 'flat' })
  S.band(path(kit, Mm([[0.62, 0.05], [0.83, 0.05]])), ws, { capA: 'round', capB: 'round', line: false })
  // photo: a squared hook branches off the T stem toward the hip, between the cross-arm and the tail
  S.band(path(kit, Mm([[0.72, 0.47], [0.845, 0.47], [0.845, 0.37]]), [0, rs, 0]), ws * 0.95, { capA: 'flat', capB: 'round' })
  const Rt = 0.075 * Hm
  const tR = M1([0.955, 0.26]), tc = [tR[0] - Rt, tR[1]]
  S.band(kit.shapes.resample([...path(kit, [M1([0.50, 0.58]), M1([0.955, 0.58]), tR], [0, rs, 0]), ...kit.shapes.cScroll(tc, Rt, { start: 0, sweep: 380, dir: -1, shrink: 0.3 }).slice(1)], 0.3), kit.shapes.taper(wm, ws * 0.7, 0.6), { capA: 'round', capB: 'round' })
  // hooks along the top toward the hip
  S.band(path(kit, Mm([[0.60, 0.66], [0.60, 0.92], [0.82, 0.92], [0.82, 0.78], [0.70, 0.78]]), [0, rs, rs, rs, 0]), ws, { capA: 'round', capB: 'round' })
  S.band(path(kit, Mm([[0.97, 0.66], [0.97, 0.92], [0.86, 0.92], [0.86, 0.76]]), [0, rs, rs, 0]), ws, { capA: 'round', capB: 'round' })
  void Wx

  // ---- separator bar: a plain raised band across the slope
  const sep = []
  for (let i = 0; i <= 8; i++) {
    const v = vs0 + ((vs1 - vs0) * i) / 8
    sep.push([halfAt(v) + 2, v])
  }
  S.blob(kit.shapes.poly([[-3, vs0], ...sep, [-3, vs1]]))

  // ---- upper frieze: one kui per half facing the centre peg (photo + dossier §c.5): jaws open at the peg, a boss
  // eye at u ≈ 0.25, a long crest sweeping diagonally up and back from the head to an up-curl by the hip, a body
  // band running outward with two down-hooks, the tail curling up at u ≈ 0.95
  const wu = 0.25 * Hu, ru = wu * 0.6
  const U1 = (p) => Mu([p])[0]
  S.boss({ c: U1([0.25, 0.55]), rx: 0.13 * Hu, h: 2.0 + 1.6 })
  S.band(path(kit, Mu([[0.16, 0.80], [0.04, 0.80], [0.04, 0.62]]), ru), wu * 0.9, { capA: 'round', capB: 'round' }) // upper jaw
  S.band(path(kit, Mu([[0.16, 0.24], [0.04, 0.24], [0.04, 0.40]]), ru), wu * 0.9, { capA: 'flat', capB: 'round' }) // lower jaw
  const Rk = 0.16 * Hu, kc = U1([0.86, 0.76])
  S.band(kit.shapes.resample([...kit.shapes.spline(Mu([[0.34, 0.36], [0.42, 0.62], [0.60, 0.80], [0.76, 0.88]]), 0.3), [kc[0], kc[1] + Rk], ...kit.shapes.cScroll(kc, Rk, { start: 90, sweep: 300, dir: -1, shrink: 0.3 }).slice(1)], 0.3), kit.shapes.taper(wu, wu * 0.7, 0.6), { capA: 'round', capB: 'round' })
  S.band(path(kit, Mu([[0.16, 0.24], [0.965, 0.24], [0.965, 0.58]]), [0, ru, 0]), wu, { capA: 'round', capB: 'round' })
  for (const x of [0.56, 0.76]) S.band(path(kit, Mu([[x, 0.24], [x, 0.06], [x + 0.05, 0.06]]), ru * 0.8), wu * 0.85, { capA: 'flat', capB: 'round', line: false })

  // the crowd of hooks in the gaps of the main panel and the frieze
  const inHalf = (u, v) => u >= slot + 0.4 && u <= halfAt(v) - margin
  fillHooks(kit, S, { u0: slot, u1: halfAt(vm0) - margin, v0: vm0, v1: vs0 }, { rMin: 1.45, rMax: 8.0, gap: 0.55, wMin: 4.2, wMax: 5.6, wFloor: 2.6, seed: seed + 1, round: 0.35, max: 110, inside: inHalf, wScale: 0.66, stubs: true, curls: true })
  fillHooks(kit, S, { u0: slot, u1: halfAt(vf0) - margin, v0: vf0, v1: vf0 + Hu }, { rMin: 1.45, rMax: 4.2, gap: 0.55, wMin: 3.2, wMax: 4.4, wFloor: 2.4, seed: seed + 2, round: 0.4, max: 40, inside: inHalf, wScale: 0.62, stubs: true, curls: true })
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
  const w = 5.6, r = 2.6
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
  fillHooks(kit, S, { u0: slot, u1: halfAt(v0) - margin, v0, v1: slant - 2 }, { rMin: 1.6, rMax: 6, gap: 0.6, wMin: 3.4, wMax: 4.8, wFloor: 2.5, seed, round: 0.3, max: 60, stubs: true, curls: true, inside: (u, v) => u >= slot + 0.4 && u <= halfAt(v) - margin })
  return { sheet: S, v0 }
}

// ------------------------------------------------------------------ knob (§c.7)

/** the knob front's decorated field: half width (mm) and v range (fraction of the slant) */
export const KNOB_FIELD = { u: 23, v0: 0.1, v1: 0.9 }

/** knob front: a mini-taotie of squared spirals and pellets inside a ~3 mm plain border (mm, u from the axis) */
export function knobSheet(kit, { kind, halfAt, slant, border = 3, seed = 1 }) {
  const S = new Sheet()
  const w = 2.4, r = 1.1
  const hb = (v) => halfAt(v) - border
  if (kind === 'long') {
    // round 4 (review): the mask fills ≈ 70 % of the face inside a ≈ 3 mm border — two squared spirals at
    // (±0.22 W, 0.32 H), r ≈ 0.12 W, a nose bar between, pellets and hooks in the upper half
    const fu = KNOB_FIELD.u, f1 = KNOB_FIELD.v1 * slant
    const W = 2 * halfAt(0.32 * slant)
    const cx = 0.22 * W, cy = 0.32 * slant, q = (0.12 * W) / 5
    const sp = [[-5.3, -4.6], [4.9, -4.6], [4.9, 4.3], [-4.3, 4.3], [-4.3, -2.0], [2.5, -2.0], [2.5, 1.9], [-1.5, 1.9], [-1.5, 0]].map(([x, y]) => [cx + x * q, cy + y * q])
    S.band(path(kit, sp, [0, 0.8, 0.8, 0.8, 0.7, 0.6, 0.5, 0].map((r) => r * q)), 1.8 * q, { capA: 'round', capB: 'round', line: false })
    // a short vertical nose bar between them
    S.band(path(kit, [[0, cy - 5 * q], [0, cy + 4 * q]]), 3.0, { capA: 'round', capB: 'round', line: false })
    // dissolved brow / crest zone: a central pellet with small pellets and hooks round it
    S.boss({ c: [0, 0.70 * slant], rx: 2.3, h: 1.2 + 1.0 })
    S.boss({ c: [8.5, 0.80 * slant], rx: 1.5, h: 1.2 + 0.8 })
    S.boss({ c: [Math.min(hb(0.63 * slant) - 3, 17), 0.62 * slant], rx: 1.5, h: 1.2 + 0.8 })
    S.band(path(kit, [[3.6, 0.555 * slant], [11, 0.555 * slant], [11, 0.65 * slant]], 0.9), 2.2, { capA: 'round', capB: 'round', line: false })
    const xr = Math.min(fu - 1.6, hb(f1) - 2)
    S.band(path(kit, [[3.6, f1 - 2.2], [xr, f1 - 2.2], [xr, f1 - 7.5]], 0.9), 2.2, { capA: 'round', capB: 'round', line: false })
    fillHooks(kit, S, { u0: 1.6, u1: halfAt(border) - border, v0: border, v1: slant - border }, { rMin: 1.5, rMax: 3.2, gap: 0.5, wMin: 1.6, wMax: 2.1, wFloor: 1.3, seed, round: 0.3, max: 22, wScale: 0.45, line: false, stubs: true, curls: true, inside: (u, v) => u <= hb(v) - 0.3 })
    return S
  } else {
    // the narrow faces: plainer — one squared spiral each side and a pellet
    const cx = 8.5, cy = 0.36 * slant
    S.band(path(kit, [[cx - 6, cy - 6], [cx + 6, cy - 6], [cx + 6, cy + 6], [cx - 5, cy + 6], [cx - 5, cy - 2], [cx + 2.5, cy - 2], [cx + 2.5, cy + 2], [cx - 1, cy + 2]], [0, r, r, r, 0.8, 0.7, 0.5, 0]), w * 0.9, { capA: 'round', capB: 'round' })
    S.boss({ c: [0, 0.72 * slant], rx: 2, h: 1.2 + 1 })
  }
  fillHooks(kit, S, { u0: 1.6, u1: halfAt(border) - border, v0: border, v1: slant - border }, { rMin: 1.9, rMax: 3.2, gap: 0.6, wMin: 1.5, wMax: 2.1, seed, round: 0.25, max: 10, wScale: 0.45, line: false, inside: (u, v) => u <= hb(v) - 0.3 })
  return S
}
