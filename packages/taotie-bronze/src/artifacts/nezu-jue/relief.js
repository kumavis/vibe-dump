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
const WIDEN = 1.35
const SPIRALS = { kind: 'spirals', square: 0.9, pitch: 0.48, line: 0.25, gap: 0.22, min: 0.9, size: 3.0, tail: false }
const CONTOUR = { inset: 0.36, line: 0.28 }

/** the traced half → kit elements for both halves of a mask centred at cx */
function maskElements(kit, cx) {
  const els = []
  for (const side of [1, -1]) {
    // traced side: x = cx − (NOSE.tail − FX(u)) (handle side of the tail mask); side −1 mirrors it
    const X = ([u, v]) => [cx - side * (NOSE.tail - FX(u)), FY(v)]
    for (const b of BAND.bands) {
      const um = b.c.reduce((s, q) => s + q[0], 0) / b.c.length
      const k = Math.sqrt(KX(um)) * WIDEN
      els.push(kit.roundStroke(b.c.map(X), {
        width: Array.isArray(b.w) ? b.w.map((w) => w * k) : b.w * k,
        round: b.round ?? 0.4, inner: b.inner ?? 0.12, start: b.start ?? 'blunt', end: b.end ?? 'blunt', capRound: 0.3,
        spiral: b.spiral && { ...b.spiral, dir: b.spiral.dir * side },
        ticks: b.ticks ? { side: 'both', pitch: 2.4, line: 0.32 } : undefined,
        ...(b.fill === 'none' ? { fill: { kind: 'none' } } : {}),
      }))
    }
    for (const q of BAND.plates) els.push(kit.roundPlate({ c: X(q.c), w: q.w * KX(q.c[0]) + 0.6, h: q.h / 0.978 + 0.6, r: q.r }))
  }
  return els
}

function fillerElements(kit, cx, sides = [1, -1]) {
  const els = []
  for (const side of sides) {
    const X = ([x, y]) => [cx + side * x, FY(y)]
    for (const b of FILLER.bands) {
      els.push(kit.roundStroke(b.c.map(X), {
        width: b.w * WIDEN, round: 0.4, inner: 0.12, start: b.start ?? 'blunt', end: b.end ?? 'blunt', capRound: 0.3,
        spiral: b.spiral && { ...b.spiral, dir: b.spiral.dir * side },
      }))
    }
  }
  return els
}

export function bandPanel(kit, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: PANEL.w, height: PANEL.h, ppmm, seed })
  const W = PANEL.w
  // plain fillets just outside the field (the photograph's narrow plain rings above and below the band)
  const yb0 = REG.band[0] - PANEL.y0, yb1 = REG.band[1] - PANEL.y0
  p.raise((ctx) => { ctx.fillRect(-2, yb0 - 1.9, W + 4, 1.3); ctx.fillRect(-2, yb1 + 0.6, W + 4, 1.3) }, { height: 0.55, shoulder: 0.35 })

  // the masks and the fillers: ONE carve (one raise + one sink for every contour and spiral groove)
  const els = [...maskElements(kit, NOSE.tail), ...maskElements(kit, NOSE.spout)]
  els.push(...fillerElements(kit, 0, [1]), ...fillerElements(kit, W, [-1]), ...fillerElements(kit, xOfAz(270)))
  kit.carve(p, els, { height: BAND.height, shoulder: 0.45, depth: 0.3, irregularity: 0.6, seed, contour: CONTOUR, fill: SPIRALS })

  // deep pockets inside the curls and the eye socket
  p.sink((ctx) => {
    for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) for (const k of BAND.pockets) {
      const x = cx - side * (NOSE.tail - FX(k.c[0]))
      ctx.beginPath(); ctx.ellipse(x, FY(k.c[1]), k.rx * KX(k.c[0]), k.ry, 0, 0, Math.PI * 2); ctx.fill()
    }
  }, { depth: 0.7, shoulder: 0.6, profile: 'u' })
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
    for (const b of T.bands) tri.push(kit.roundStroke(b.c.map(([x, y]) => [cx + x, ty0 + y]), { width: b.w, round: 0.4, inner: 0.15, start: b.start ?? 'blunt', end: b.end ?? 'blunt' }))
  }
  kit.carve(p, tri, { height: 0.75, shoulder: 0.25, depth: 0.22, contour: { inset: 0.35, line: 0.24 }, fill: { kind: 'none' }, seed: seed + 5 })
  for (const az of [51, 129, 231, 309]) for (const e of T.eyes) {
    kit.pillowBoss(p, { c: [xOfAz(az) + e.c[0], ty0 + e.c[1]], w: e.w, h: e.h, round: 0.3, height: 0.7, crown: 0.6, slit: false })
  }
  // the dark hole in the upper wall over the handle (photo-02, θ ≈ 100–110, y ≈ 148–155: a loss or casting flaw)
  // is NOT modelled: a sunk pocket fills with the pale ground deposit and reads wrong, and a through-cut is not worth it
  return p.bake()
}

/** the whorl on a cap top: square panel over the cap seen from above (polar-mapped in sculpture.js) */
export function whorlPanel(kit, { ppmm, seed }) {
  const S = 23.8
  const p = new kit.ReliefPanel({ width: S, height: S, ppmm, seed })
  kit.drawMotif(p, 'whorl', { x: 2.6, y: 2.6, w: S - 5.2, h: S - 5.2 }, { relief: { motif: 0.5, boss: 0.9, groove: 0.3 } }, { preset: 'post-cap', ground: false })
  return p.bake()
}
