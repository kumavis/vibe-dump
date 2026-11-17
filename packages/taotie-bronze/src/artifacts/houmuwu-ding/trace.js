// Houmuwu ding — the wall décor TRACED from the flattened faces (round 5).
//
// Sources (reference/houmuwu-ding/faces/, KIT.md § Flat faces): face-rubbing-long.jpg (the ink rubbing of a
// long wall registered to the wall, the only Houmuwu face that resolves line work), face-long.jpg (the
// front photograph flattened: soft, but it fixes the vertical positions the rubbing's paper stretch
// moves — the rubbing's bottom frieze sits ≈ 10 mm high) and face-short.jpg (the crisp short wall).
//
// Every number below was read off a 10 mm grid laid over those images (.work/r5-houmuwu-ding/crops):
//   u    mm from the mid-wall flange axis, OUTWARD (the rubbing's right half, u = face x − 550)
//   y    mm above the bottom of the frieze (top frieze: face y − 404.5; bottom frieze: face y − 14)
//   d    (side column) mm from the corner arris inward; yc mm above the column's bottom (face y − 138.5)
// Drawn with the kit's traced vocabulary (KIT.md § Rounded bands): fat round-cornered plateaus
// (roundStroke / roundPlate), one sunk contour line inside the edge, a chain of squared-round spirals
// with joints along the dragon bodies, round domed eye bosses with a dot pupil.
//
// The kui (top frieze, one per half, head at the flange):
//   crest     a solid rounded block u 10–107, y 66–120, its top incised with a contour that rolls into two
//             spirals at its lower edge (detail-frieze-top-centre.jpg shows it crisply)
//   eye       round boss Ø 15 at u 40, y 52.5, dot pupil
//   body      a broad band (24 mm) u 56 → 205 at y 54 carrying a jointed chain of ≈ 7 squared spirals,
//             rising at u 205 into a 13 mm bar along the top of the frieze (y 108) that ends in the TAIL:
//             a fat squared spiral (≈ 80 × 100 mm, two turns) against the side column
//   quill     off the riser top, back toward the head, down at u 147, rolled at its end
//   jaw (top) a ∩ arch u 16–82 below the eye, its outer foot rolled outward
//   claw      a recumbent S under the body, u 118 → 186, small roll at its head, big roll at its tail
// The bottom frieze is the same creature (rubbing / photograph): a lower eye, the ∩ becomes a clawed leg.

/** Map traced u/y points into the panel's LEFT half (axis at ax, frieze bottom at y0). */
function mapper(ax, y0) {
  return (pts) => pts.map(([u, y]) => [ax - u, y0 + y])
}

/** Points of a squared spiral (centre lines), outside → in: starts at [x0, y1] heading +x (u-space). */
function squareSpiral(x0, x1, y0, y1, step, turns) {
  const pts = [[x0, y1]]
  let a = x0, b = y0, c = x1, d = y1
  for (let i = 0; i < turns; i++) {
    pts.push([c, d], [c, b], [a, b])
    d -= step
    if (d - b < step * 0.9) break
    pts.push([a, d])
    a += step; c -= step; b += step
    if (c - a < step * 0.9 || d - b < step * 0.9) break
  }
  return pts
}

/** Incised crest grooves (u-space): contour inset e, open at the bottom between two inward-rolling curls. */
function crestGrooves(kit, a, b, y0, y1, { e = 5.5, split = 0.42, RL = 8, RR = 11 } = {}) {
  // small curl (with the dot) near the axis, the big one on the outer half (rubbing: u ≈ 27 and ≈ 67)
  const uL = a + (b - a) * 0.2, uR = a + (b - a) * 0.63
  const yb = y0 + e, yt = y1 - e
  const cL = kit.shapes.cScroll([uL, yb + RL], RL, { start: -90, sweep: 400, dir: 1, shrink: 0.12, step: 0.5 })
  const cR = kit.shapes.cScroll([uR, yb + RR], RR, { start: -90, sweep: 430, dir: -1, shrink: 0.12, step: 0.5 })
  const path = [...cL.slice().reverse(), [a + e, yb], [a + e, yt], [b - e, yt], [b - e, yb], ...cR]
  return kit.shapes.resample(kit.shapes.fillet(path, 5), 0.6)
}

const STYLE = {
  height: 3, // L1 plateau (dossier §c.7)
  shoulder: 0.9, // steep walls
  depth: 0.75, // incised line work
  contour: { inset: 2.2, line: 0.8 },
}
/** A rolled end traced on the right half / right column and laid mirrored: "left of travel" flips. */
const roll = (dir, o = {}) => ({ turns: 0.9, taper: 0.5, ...o, dir: -dir })

const CHAIN = { kind: 'spirals', line: 0.8, pitch: 1.9, gap: 0.55, square: 0.55, joints: true, tail: 'merge', min: 7 }

/** Traced stations per frieze (u, y as in the header; long wall). */
const LONG = {
  top: {
    crest: [10, 97, 72, 121], eye: [39, 50], chain: [52, 51.5, 22], riser: 221, row: 97.5,
    tail: { L: 324, R: 374, B: 37 }, box: { c: [273.5, 54], w: 33, h: 46 },
    quill: [[221, 106], [149, 106], [149, 80]],
    jaw: [[15, 2], [19, 21], [30, 31], [50, 34], [70, 31], [80, 20], [84, 7], [95, 5]], // a horseshoe arch, feet splayed
    claw: [[134, 18], [170, 22]],
  },
  bottom: {
    crest: [32, 102, 82, 120], eye: [55, 61], chain: [66, 63, 24], riser: 222, row: 99.5,
    tail: { L: 337, R: 381, B: 40 }, box: { c: [301, 59], w: 50, h: 52 },
    quill: [[155, 70], [155, 113], [178, 113]],
    leg: [[33, 21], [33, 40], [95, 40], [95, 23], [107, 23]],
    claw: [[146, 30], [178, 33]],
  },
}

/** Short (handle) wall, face-short.jpg: the stations that differ from the long wall. */
const SHORT = { top: { eye: [42, 50.5], cy: 53, c0: 54, w: 18 }, bottom: { eye: [50, 53.5], cy: 71, c0: 62, w: 16 } }

/**
 * One half of a top / bottom frieze. r = the frieze rect (panel mm, left half: axis at r.x + r.w).
 * Drawn into the panel (plateaus + their line work + the eye); the ground is packed afterwards.
 */
export function tracedFrieze(kit, panel, r, { top = true, short = false, seed = 1 } = {}) {
  const ax = r.x + r.w
  const half = r.w
  const M = mapper(ax, r.y)
  const els = []
  const S = (ctrl, o) => els.push(kit.roundStroke(M(ctrl), o))
  // mirror: the drawing is traced on the right half and laid on the left, so "left of travel" flips
  const T = LONG[top ? 'top' : 'bottom']
  const k = short ? 0.9 : 1 // the short wall's head is ≈ 10 % narrower (face-short.jpg: crest u 11–89)

  // ---- body: jointed chain → riser → upper bar → tail (a fat squared G spiral against the column)
  const [c0, cy, cw] = T.chain
  const tl = T.tail
  const dx = 0 // long wall: traced u is used as is (its column edge, u ≈ 390, matches the model's half)
  const L = tl.L + dx, R = tl.R + dx, B = tl.B
  const tB = 11
  if (!short) {
    S([[c0, cy], [T.riser, cy], [T.riser, T.row], [L, T.row], [L, B], [R, B], [R, T.row - 9], [L + 22, T.row - 9], [L + 22, B + 22], [L + 34, B + 22]], {
      width: [cw, cw, 14, 15, tB, tB, tB, tB - 1, tB - 1, tB - 2], round: 0.6, inner: 0.15, start: 'blunt', end: 'blunt', capRound: 0.35,
      contour: { inset: 2.2, line: 0.8 },
    })
    // the chain of spirals on the broad body (a decorated element laid over the same plateau)
    S([[c0, cy], [T.riser - 4, cy]], { width: cw, round: 0.5, inner: 0.15, start: 'blunt', end: 'flat', fill: CHAIN, contour: false })
    // the nested box between the riser and the tail
    els.push(kit.roundPlate({ c: [ax - (T.box.c[0] + dx), r.y + T.box.c[1]], w: T.box.w, h: T.box.h, r: 6, contour: false,
      fill: { kind: 'coil', pitch: 5.6, line: 1.6 } }))
    // quill
    S(T.quill, { width: [11, 11, 10], round: 0.6, inner: 0.15, start: 'flat', end: 'spiral', spiral: roll(top ? 1 : -1), contour: false })
    // recumbent S claw under the body: small roll at its head, big roll at its tail
    S(T.claw, { width: [8, 11], round: 0.5, start: 'spiral', end: 'spiral', startSpiral: roll(1, { turns: 0.8 }), spiral: roll(1, { turns: 1.25, taper: 0.6 }), contour: false })
  } else {
    // short wall: a single jointed bar beside the eye, the tail spiral on its own (face-short.jpg)
    // face-short.jpg: the jointed bar runs from the eye to the tail
    const Q = SHORT[top ? 'top' : 'bottom']
    S([[Q.c0, Q.cy], [half - 96, Q.cy]], { width: Q.w, round: 0.5, inner: 0.15, start: 'blunt', end: 'blunt', fill: CHAIN })
    const t0 = half - 92, t1 = half - 8
    S(squareSpiral(t0, t1, 6, top ? 112 : 108, 21, 2), { width: tB + 1, round: 0.6, inner: 0.15, start: 'blunt', end: 'blunt', capRound: 0.35,
      fill: { kind: 'lines', pitch: 3.4, line: 0.8 } })
  }

  // ---- crest block over the eye
  const [cA, cB, cY0, cY1] = [T.crest[0] * k, T.crest[1] * k, T.crest[2], T.crest[3]]
  els.push(kit.roundPoly(M([[cA, cY0], [cB, cY0], [cB, cY1], [cA, cY1]]), { round: [9, 9, 12, 12], contour: false }))
  const crest = M(crestGrooves(kit, cA, cB, cY0, cY1, { RL: 8.5, RR: 14 }))

  // ---- jaw (top: ∩ arch, outer foot rolled outward) / leg (bottom: ∩ with a rolled claw)
  const arch = (top ? T.jaw : T.leg).map(([u, y]) => [u * k, y])
  S(arch, { width: top ? [12, 13, 13, 13, 13, 13, 12, 9] : [12, 12, 12, 11, 9], round: top ? 0.7 : 0.6, inner: top ? 0.5 : 0.2, start: 'blunt', end: 'round', contour: false })

  kit.carve(panel, els, { ...STYLE, seed })
  // crest top: the C-scroll incision (sunk like the contour lines)
  panel.sink((ctx) => {
    ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); crest.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke()
  }, { depth: STYLE.depth, shoulder: 0.4, profile: 'u' })
  eye(kit, panel, M([short ? SHORT[top ? 'top' : 'bottom'].eye : T.eye])[0], 15)
  return { els }
}

/** Round domed eye boss with a sunk dot pupil (dossier: Ø 16–20, 7–8 above the ground, at most a faint dot). */
export function eye(kit, panel, c, D, { base = 0, height = 5.5 } = {}) {
  kit.pillowBoss(panel, { c, w: D, h: D, round: 1, height, crown: 0.75, base, slit: false })
  panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], D * 0.11, 0, Math.PI * 2); ctx.fill() }, { depth: 1.2, shoulder: 0.5, profile: 'u' })
}

/**
 * Side column: ONE vertical kui, head up, facing the corner (rubbing, right column, read with d from the arris).
 * r = column rect, arris at r.x (local d = x − r.x), yc from r.y.
 */
export function tracedColumn(kit, panel, r, { seed = 1 } = {}) {
  const sy = r.h / 266 // the long wall's column is 266 tall; the short wall's the same
  const M = (pts) => pts.map(([d, y]) => [r.x + d, r.y + y * sy])
  const els = []
  const S = (ctrl, o) => els.push(kit.roundStroke(M(ctrl), o))
  // head block with the eye on it (d 20–75, yc 161–207)
  els.push(kit.roundPlate({ c: M([[47, 184]])[0], w: 54, h: 44 * sy, r: 12, contour: { inset: 2.2, line: 0.8 } }))
  // crest above the head: a Z band (d 100 → 62 at yc 234, up to 255, → 22, down to 214, rolled)
  S([[106, 230], [62, 230], [62, 255], [22, 255], [22, 222]], { width: [22, 20, 12, 12, 12], fill: { kind: 'lines', pitch: 4, line: 0.8 }, round: 0.6, inner: 0.15, start: 'blunt', end: 'spiral', spiral: roll(-1) })
  // C hook behind the head (d 70–108, yc 162–210), open toward the arris, both ends rolled
  S([[80, 203], [103, 203], [103, 168], [82, 168]], { width: 10, round: 0.65, inner: 0.15, start: 'spiral', end: 'spiral', startSpiral: roll(1, { turns: 0.8 }), spiral: roll(-1, { turns: 0.8 }), contour: false })
  // body: down from the head, across toward the arris, down to the tail, carrying the spiral chain
  S([[67, 166], [67, 121], [36, 121], [36, 52]], { width: [15, 15, 14, 13], round: 0.55, inner: 0.15, start: 'flat', end: 'blunt', fill: { ...CHAIN, min: 6 } })
  // tail: a big C open toward the arris (d 55–100, yc 31–86), pointed upper tip, lower arm rolled up under the body
  S([[60, 82], [95, 82], [95, 34], [36, 34]], { width: [7, 15, 16, 15], round: 0.6, inner: 0.15, start: 'point', end: 'spiral', spiral: roll(1), fill: { kind: 'lines', pitch: 3.4, line: 0.8 } })
  kit.carve(panel, els, { ...STYLE, seed })
  eye(kit, panel, M([[40, 186.5]])[0], 14, { base: 'field', height: 3 })
  return { els }
}

/** Transverse ribs across a band (the ox horn's comb-like incisions): cross lines every `pitch` mm. */
function ribs(el, pitch, line, inset) {
  const sp = el.spine
  const out = []
  let acc = pitch * 0.6
  for (let i = 1; i < sp.length; i++) {
    const [a, b] = [sp[i - 1], sp[i]]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (!l) continue
    const t = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-t[1], t[0]]
    for (let s = acc; s < l; s += pitch) {
      const w = (el.widths[i - 1] + (el.widths[i] - el.widths[i - 1]) * (s / l)) / 2 - inset
      if (w < 2) continue
      const p = [a[0] + t[0] * s, a[1] + t[1] * s]
      out.push([[p[0] + n[0] * w, p[1] + n[1] * w], [p[0] - n[0] * w, p[1] - n[1] * w]])
      acc = s
    }
    acc = acc - l + pitch
    while (acc < 0) acc += pitch
  }
  return out
}

/**
 * Upper corner square: ox-head 牛首 half-mask on the arris (rubbing, right upper corner, read with
 * d from the arris, y from the bottom of the square): a ribbed crescent horn from an upturned tip on
 * the field side to a roll beside the arris; a big ringed eye right at the arris (d ≈ 20 — the dossier's
 * 40–45 is not what the rubbing shows); a C ear between them; a hooked jaw below.
 */
export function tracedOxHead(kit, panel, r, { seed = 1 } = {}) {
  const M = (pts) => pts.map(([d, y]) => [r.x + d, r.y + y])
  const els = []
  const S = (ctrl, o) => { const e = kit.roundStroke(M(ctrl), o); els.push(e); return e }
  const horn = S([[106, 116], [88, 104], [62, 98], [36, 99]], { width: [5, 14, 16, 14], round: 0.6, start: 'point', end: 'spiral', spiral: roll(-1, { turns: 0.8 }), contour: false })
  S([[86, 66], [86, 81], [50, 81]], { width: 10, round: 0.6, inner: 0.15, start: 'flat', end: 'spiral', spiral: roll(-1, { turns: 0.7 }), contour: false })
  S([[86, 66], [86, 51], [52, 51]], { width: 10, round: 0.6, inner: 0.15, start: 'flat', end: 'spiral', spiral: roll(1, { turns: 0.7 }), contour: false })
  S([[62, 44], [62, 18], [16, 18]], { width: [12, 12, 11], round: 0.6, inner: 0.15, start: 'blunt', end: 'spiral', spiral: roll(1, { turns: 0.8 }), contour: false })
  kit.carve(panel, els, { ...STYLE, seed })
  const lines = ribs(horn, 6.5, 0.9, 2)
  panel.sink((ctx) => {
    ctx.lineWidth = 1.6; ctx.lineCap = 'round'
    for (const [a, b] of lines) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke() }
  }, { depth: 1.0, shoulder: 0.6, profile: 'u' })
  ringEye(kit, panel, M([[21, 62]])[0], 22, 20)
}

/** A big oval eye boss with a sunk pupil hole (the corner masks: rubbing shows a ring with a white centre). */
function ringEye(kit, panel, c, w, h) {
  kit.pillowBoss(panel, { c, w, h, round: 0.75, height: 5.5, crown: 0.6, slit: { len: w * 0.36, width: h * 0.28, depth: 1.6 } })
}

/**
 * Lower corner square: taotie half-mask on the arris (rubbing, right lower corner): a big C horn
 * opening down toward the arris with a roll inside, an oval eye under it, a ⊓ jaw below.
 */
export function tracedCornerTaotie(kit, panel, r, { seed = 1 } = {}) {
  // d read from the TOP arris line; the wall is ≈ 20 mm narrower here, so the overlay put everything 20 mm toward the arris
  const M = (pts) => pts.map(([d, y]) => [r.x + d - 20, r.y + y])
  const els = []
  const S = (ctrl, o) => els.push(kit.roundStroke(M(ctrl), o))
  S([[98, 72], [98, 113], [46, 113], [46, 94]], { width: [12, 13, 13, 12], round: 0.6, inner: 0.15, start: 'blunt', end: 'spiral', spiral: roll(-1, { turns: 0.8 }) })
  S([[92, 72], [72, 72], [72, 60]], { width: 9, round: 0.6, inner: 0.15, start: 'blunt', end: 'spiral', spiral: roll(1, { turns: 0.7 }), contour: false })
  S([[78, 12], [78, 42], [38, 42], [38, 10]], { width: 11, round: 0.6, inner: 0.15, start: 'blunt', end: 'blunt', contour: false })
  kit.carve(panel, els, { ...STYLE, seed })
  ringEye(kit, panel, M([[48, 60]])[0], 20, 17)
}
