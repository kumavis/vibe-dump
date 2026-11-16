// Nezu jue — the décor panels, rendered from the traced data in trace.js with the kit's traced vocabulary
// (roundStroke / roundPlate → carve with squared spiral chains on the band tops, pillowBoss, sinks).
//
// ONE panel wraps the whole cup: x = developed mm at r 34.4 from θ 90 (the handle: the seam hides under it),
// y = height − PANEL.y0; it covers the band (y 101 … 140) and the side parts of the upper wall up to the rim.
// Layout round the cup (θ → panel x): handle 90 → 0 · tail mask nose 180 → 54.0 · opposite the handle 270 → 108.1 ·
// spout mask nose 0/360 → 162.1. The traced half (handle side of the tail mask) is mirrored about each nose; the
// spout mask repeats the tail mask (not visible in the photograph: INFERRED from the type); the filler strips by
// the handle and opposite it are inferred from the dark, foreshortened area behind the handle.
import { REG } from './form.js'
import { BAND, FILLER, TRIANGLE } from './trace.js'

export const PANEL = { r: 34.4, y0: 98, y1: 164 }
PANEL.w = 2 * Math.PI * PANEL.r
PANEL.h = PANEL.y1 - PANEL.y0
const R = PANEL.r
const DEGMM = (R * Math.PI) / 180
export const xOfAz = (az) => ((((az - 90) % 360) + 360) % 360) * DEGMM
const NOSE = { tail: xOfAz(180), spout: xOfAz(360) - 0 }
NOSE.spout = 270 * DEGMM
// face-band (u, v) → developed panel (x on the traced, handle-side half of the tail mask; y)
const FX = (u) => R * Math.asin(Math.max(-0.999, Math.min(0.999, u / R))) + 38 * DEGMM
const FY = (v) => 120.75 + v / 0.978 - PANEL.y0
const KX = (u) => 1 / Math.sqrt(1 - Math.min(0.9, (u / R) ** 2)) // developed mm per face mm across the wall

// the photograph's bands fill the field: the plain ground between them is only 1.5–2.5 mm wide; traced centre-line
// widths came out ≈ 35 % thin against the flattened face, so they are widened here (checked on face-band-compare)
const WIDEN = 1.15
const CONTOUR = { inset: 0.4, line: 0.3 }
// fix pass r8: the band tops carry chains of SQUARED spirals (雷纹, ≈ 2.5–3 mm cells, ≈ 2 turns) — drawn here as true
// right-angled spirals (kit.shapes.sqSpiral) along each band's centre line, not carve's round '@' spirals
const SQ = { pitch: 0.58, line: 0.29, gap: 0.3, depth: 0.32, min: 1.4, max: 3.4, along: 0.8 }

/** the traced half → kit elements for both halves of a mask centred at cx; `chains` collects spiral carriers */
export function maskElements(kit, cx, chains) {
  const els = []
  for (const side of [1, -1]) {
    // traced side: x = cx − (NOSE.tail − FX(u)) (handle side of the tail mask); side −1 mirrors it
    const X = ([u, v]) => [cx - side * (NOSE.tail - FX(u)), FY(v)]
    for (const b of BAND.bands) {
      const um = b.c.reduce((s, q) => s + q[0], 0) / b.c.length
      const k = Math.sqrt(KX(um)) * WIDEN
      const el = kit.roundStroke(b.c.map(X), {
        width: Array.isArray(b.w) ? b.w.map((w) => w * k) : b.w * k,
        round: b.round ?? 0.6, inner: b.inner ?? 0.25, start: b.start ?? 'blunt', end: b.end ?? 'blunt', capRound: 0.45,
        spiral: b.spiral && { ...b.spiral, dir: b.spiral.dir * side },
      })
      els.push(el)
      if (b.spirals !== false) chains.push({ el, ends: [b.start ?? 'blunt', b.end ?? 'blunt'] })
    }
    for (const q of BAND.plates) {
      const pl = kit.roundPlate({ c: X(q.c), w: q.w * KX(q.c[0]) + 0.6, h: q.h / 0.978 + 0.6, r: q.r })
      els.push(pl)
      chains.push({ plate: { c: X(q.c), w: q.w * KX(q.c[0]) + 0.6, h: q.h / 0.978 + 0.6 } })
    }
  }
  return els
}

function fillerElements(kit, cx, sides, chains) {
  const els = []
  for (const side of sides) {
    const X = ([x, y]) => [cx + side * x, FY(y)]
    for (const b of FILLER.bands) {
      const el = kit.roundStroke(b.c.map(X), {
        width: Array.isArray(b.w) ? b.w.map((w) => w * WIDEN) : b.w * WIDEN, round: 0.75, inner: 0.25, start: b.start ?? 'blunt', end: b.end ?? 'blunt', capRound: 0.45,
      })
      els.push(el)
      chains.push({ el, ends: [b.start ?? 'blunt', b.end ?? 'blunt'] })
    }
  }
  return els
}

/** squared spirals along every carrier's centre line (one cell per band width), and in a grid on plates */
export function squaredChains(kit, chains) {
  const strokes = [], placed = []
  const free = (c, r) => placed.every((p) => Math.hypot(p.c[0] - c[0], p.c[1] - c[1]) > (p.r + r) * 0.9)
  const cell = (c, size, heading, dir, along = 1) => {
    const n = Math.max(3, 2 * Math.round(size / SQ.pitch) - 1)
    let pts = kit.shapes.sqSpiral([0, 0], { pitch: SQ.pitch, turns: n / 4, dir, rCorner: 0.12, startHeading: 0, step: 0.2 })
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, a = heading, ca = Math.cos(a), sa = Math.sin(a)
    strokes.push(pts.map(([x, y]) => { const X = (x - mx) * along, Y = y - my; return [c[0] + X * ca - Y * sa, c[1] + X * sa + Y * ca] }))
    placed.push({ c, r: (size * (1 + along)) / 4 })
  }
  let hand = 1
  for (const ch of chains) {
    if (ch.plate) {
      const { c, w, h } = ch.plate
      const inner = [w - 2 * (CONTOUR.inset + CONTOUR.line) - 0.5, h - 2 * (CONTOUR.inset + CONTOUR.line) - 0.5]
      const nx = Math.max(1, Math.round(inner[0] / SQ.max)), ny = Math.max(1, Math.round(inner[1] / SQ.max))
      const sz = Math.min(SQ.max, inner[0] / nx - SQ.gap, inner[1] / ny - SQ.gap)
      if (sz < SQ.min) continue
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const cc = [c[0] - inner[0] / 2 + (i + 0.5) * (inner[0] / nx), c[1] - inner[1] / 2 + (j + 0.5) * (inner[1] / ny)]
        if (free(cc, sz / 2)) { cell(cc, sz, 0, hand); hand = -hand }
      }
      continue
    }
    const { spine, widths } = ch.el
    const cum = [0]
    for (let i = 1; i < spine.length; i++) cum.push(cum[i - 1] + Math.hypot(spine[i][0] - spine[i - 1][0], spine[i][1] - spine[i - 1][1]))
    const L = cum[cum.length - 1]
    const at = (s) => {
      let i = 1
      while (i < cum.length - 1 && cum[i] < s) i++
      const f = (s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1])
      const p = [spine[i - 1][0] + (spine[i][0] - spine[i - 1][0]) * f, spine[i - 1][1] + (spine[i][1] - spine[i - 1][1]) * f]
      return { p, w: widths[i - 1] + (widths[i] - widths[i - 1]) * f, h: Math.atan2(spine[i][1] - spine[i - 1][1], spine[i][0] - spine[i - 1][0]) }
    }
    let s = 0
    // skip the first half cell (plus a land) at each end; round / point ends a little more
    const endPad = (e, w) => (e === 'flat' ? 0.2 : e === 'round' || e === 'point' ? 0.3 * w : 0.3) + CONTOUR.inset + CONTOUR.line
    const w0 = at(0).w
    s = endPad(ch.ends[0], w0)
    while (s < L) {
      const q = at(Math.min(L, s + 1.2))
      const size = Math.min(SQ.max, q.w - 2 * (CONTOUR.inset + CONTOUR.line) - 0.25)
      if (size < SQ.min) { s += 0.6; continue }
      const len = size * SQ.along // cells are a little shorter along the band than across it (photo-02 columns)
      const c = at(s + len / 2)
      if (s + len + endPad(ch.ends[1], c.w) > L) break
      // square the spiral to the frame on near-axis runs (the bronze's are upright squares)
      const hd = Math.round(c.h / (Math.PI / 2)) * (Math.PI / 2)
      if (free(c.p, len / 2)) { cell(c.p, size, Math.abs(hd - c.h) < 0.25 ? hd : c.h, hand, SQ.along); hand = -hand }
      s += len + SQ.gap
    }
  }
  return strokes
}

export function bandPanel(kit, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: PANEL.w, height: PANEL.h, ppmm, seed })
  const W = PANEL.w
  // plain fillets just outside the field (the photograph's narrow plain rings above and below the band)
  const yb0 = REG.band[0] - PANEL.y0, yb1 = REG.band[1] - PANEL.y0
  p.raise((ctx) => { ctx.fillRect(-2, yb0 - 1.9, W + 4, 1.3); ctx.fillRect(-2, yb1 + 0.6, W + 4, 1.3) }, { height: 0.55, shoulder: 0.35 })

  // the masks and the fillers: ONE carve (one raise + one sink for every contour groove); fat, round-shouldered bands
  const chains = []
  const els = [...maskElements(kit, NOSE.tail, chains), ...maskElements(kit, NOSE.spout, chains)]
  els.push(...fillerElements(kit, 0, [1], chains), ...fillerElements(kit, W, [-1], chains), ...fillerElements(kit, xOfAz(270), [1, -1], chains))
  kit.carve(p, els, { height: BAND.height, shoulder: 0.85, depth: 0.32, irregularity: 0.6, seed, contour: CONTOUR, fill: { kind: 'none' } })
  // squared spirals on the band tops: ONE sink
  const sq = squaredChains(kit, chains)
  p.sink((ctx) => {
    ctx.lineWidth = SQ.line; ctx.lineCap = 'square'; ctx.lineJoin = 'miter'
    for (const pts of sq) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke() }
  }, { depth: SQ.depth, shoulder: 0.12, profile: 'u' })

  // deep pockets inside the curls and the eye socket (well below the ground: they read dark in the photograph)
  p.sink((ctx) => {
    for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) for (const k of BAND.pockets) {
      const x = cx - side * (NOSE.tail - FX(k.c[0]))
      ctx.beginPath(); ctx.ellipse(x, FY(k.c[1]), k.rx * KX(k.c[0]), k.ry, 0, 0, Math.PI * 2); ctx.fill()
    }
    for (const [cx, sides] of [[0, [1]], [W, [-1]], [xOfAz(270), [1, -1]]]) for (const side of sides) for (const k of FILLER.pockets) {
      ctx.beginPath(); ctx.ellipse(cx + side * k.c[0], FY(k.c[1]), k.rx, k.ry, 0, 0, Math.PI * 2); ctx.fill()
    }
  }, { depth: 1.5, shoulder: 0.55, profile: 'u' })
  // eyes
  for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) for (const e of BAND.eyes) {
    kit.pillowBoss(p, {
      c: [cx - side * (NOSE.tail - FX(e.c[0])), FY(e.c[1])], w: e.w * KX(e.c[0]), h: e.h, round: e.round, height: e.height, crown: e.crown,
      slit: { len: e.slit.len, width: e.slit.width, depth: e.slit.depth },
    })
  }

  // upper wall: four decorated triangles at θ 51, 129, 231, 309 (the photograph shows the one at 129; the others
  // follow the cup's two mirror planes — inferred)
  const tri = []
  const ty0 = yb1 + 1.9
  const T = TRIANGLE
  for (const az of [51, 129, 231, 309]) {
    const cx = xOfAz(az)
    for (const [k, inset] of T.outlines.entries()) {
      const hw = T.base / 2 - inset * 1.6, top = T.h - inset * 2.2, y0 = ty0 + inset * 0.9
      tri.push(kit.roundStroke([[cx - hw, y0], [cx, ty0 + top], [cx + hw, y0], [cx - hw, y0]], { width: T.outlineW[k], round: 0.3, inner: 0.3, start: 'flat', end: 'flat' }))
    }
    for (const b of T.bands) tri.push(kit.roundStroke(b.c.map(([x, y]) => [cx + x, ty0 + y]), { width: b.w, round: 0.5, inner: 0.2, start: b.start ?? 'blunt', end: b.end ?? 'blunt' }))
  }
  kit.carve(p, tri, { height: 1.1, shoulder: 0.45, depth: 0.25, contour: { inset: 0.4, line: 0.26 }, fill: { kind: 'none' }, seed: seed + 5 })
  // the dark hole in the upper wall over the handle (photo-02, θ ≈ 98–110, y ≈ 146–154: a loss or casting flaw).
  // Fix pass r8: modelled as a deep sunk pocket (not a through-cut); the preset's soilGroove keeps the pale earth out of
  // it, so it reads dark as in the photograph
  p.sink((ctx) => { ctx.beginPath(); ctx.ellipse(xOfAz(101), 150 - PANEL.y0, 7.6, 4.0, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 2.2, shoulder: 0.9, profile: 'u' })
  return p.bake()
}

/** the whorl on the FAR cap's top (photo-02: a whorl of thick raised comma ridges round the knob; the near cap is plain):
 *  square panel over the cap seen from above (polar-mapped in sculpture.js). Fix pass r8: four fat commas, each a round
 *  head at r ≈ 6 sweeping out into a tapering tail, raised ≈ 1 mm with round shoulders, instead of incised slits. */
export const WHORL = { S: 25.6 }
export function whorlPanel(kit, { ppmm, seed }) {
  const S = WHORL.S, c = S / 2
  const p = new kit.ReliefPanel({ width: S, height: S, ppmm, seed })
  const els = []
  for (let k = 0; k < 4; k++) {
    const a0 = (k * 90 + 20) * Math.PI / 180
    const ctrl = []
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, a = a0 - t * 1.9, r = 5.6 + t * 5.0
      ctrl.push([c + r * Math.cos(a), c + r * Math.sin(a)])
    }
    els.push(kit.roundStroke(ctrl, { width: [2.9, 2.6, 2.3, 2.0, 1.6, 1.2, 0.7], round: 0.5, inner: 0.3, start: 'round', end: 'point' }))
  }
  kit.carve(p, els, { height: 1.7, shoulder: 0.9, contour: false, fill: { kind: 'none' }, seed })
  return p.bake()
}
