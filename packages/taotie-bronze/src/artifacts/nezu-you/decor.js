// Nezu you 饕餮文卣 (90086) — the décor, TRACED.
//
// How it was drawn: photo-31 (head-on at the pivot face) was developed onto each register's own panel
// coordinates — x = developed mm from the face's centre line (θ · r(s), round plan, the lathe's 'true' map),
// y = arc mm above the register's lower edge — through the camera fitted to the photograph's outline
// (reference/nezu-you/faces.json points), BOTH halves, each mirrored into the right-half frame and averaged after a
// centring correction (the fitted camera puts the left half ≈ 9 mm further out than the right). The images are
// reference/nezu-you/faces/dev-*.jpg (5 mm grid); the traced data are reference/nezu-you/trace/*.json, read off them
// element by element: masses as OUTLINES (`polys`: the horn G with its deep pocket, the outer C-block), bands as centre
// lines with their width at each control point, the eye bosses, sunk lines and coils.
//
// The idiom (photo-31/32): HIGH, FAT relief. The belly mask's masses stand ≈ 3 mm proud with steep, rounded shoulders
// and one sunk contour line; the horn is a rounded-square G — a broad inner block, a top bar and an outer column
// rolling in to a coiled island — with a deep dark slot under the bar; the eyes are big round domed bosses (≈ 36 mm)
// with a plain pit; every gap is fine leiwen (≈ 1.2 mm pitch: the scale of the whole model rests on it, dossier §b.2).
// The friezes are the same hand at a third of the height: fat C- and G-curls with rolled spiral ends. Data are the
// RIGHT half (x ≥ 0, seen from outside); the left half is its mirror image.

import BELLY_T from '../../../reference/nezu-you/trace/belly.json'
import NECK_T from '../../../reference/nezu-you/trace/neck.json'
import SKIRT_T from '../../../reference/nezu-you/trace/skirt.json'
import FOOT_T from '../../../reference/nezu-you/trace/foot.json'
import LID_T from '../../../reference/nezu-you/trace/lid.json'
import { drawBelly } from './belly.js'
import { drawFrieze, NECK_FRIEZE, SKIRT_FRIEZE, FOOT_FRIEZE } from './friezes.js'

const FILLS = {
  spirals: (min = 3.2) => ({ kind: 'spirals', line: 0.5, pitch: 0.9, gap: 0.35, square: 0.25, tail: false, min }),
  lines: () => ({ kind: 'lines', pitch: 1.3, line: 0.45 }),
  coil: () => ({ kind: 'coil', pitch: 1.0, line: 0.42 }),
}
const fillOf = (f) => (f == null ? undefined : typeof f === 'string' ? FILLS[f]() : f)

/** an Archimedean spiral polyline: centre, outer radius, turns, hand (+1 ccw inward) */
function spiralPts(c, r, turns, dir = 1, n = 28) {
  const out = [], N = Math.ceil(turns * n)
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = dir * t * turns * Math.PI * 2, rr = r * (1 - 0.86 * t)
    out.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)])
  }
  return out
}
/** a curved band: Catmull-Rom through the control points (n per span), widths interpolated along */
function smoothBand(c, w, n = 6) {
  const W = Array.isArray(w) ? w : c.map(() => w)
  const P = (i) => c[Math.max(0, Math.min(c.length - 1, i))]
  const pts = [], ws = []
  for (let i = 0; i < c.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2)
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t
      const f = (a, b, cc, d) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3)
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
      ws.push(W[i] + (W[i + 1] - W[i]) * t)
    }
  }
  pts.push(c[c.length - 1]); ws.push(W[W.length - 1])
  return { c: pts, w: ws }
}
function circle(c, r, n = 56) {
  const out = []
  for (let i = 0; i < n; i++) out.push([c[0] + r * Math.cos((2 * Math.PI * i) / n), c[1] + r * Math.sin((2 * Math.PI * i) / n)])
  return out
}

/**
 * Render traced data into a panel, mirrored about W/2 (data.single: unmirrored, panel x).
 * data = { bands: [{ c: [[x, y]…], w, round?, inner?, start?, end?, spiral?, startSpiral?, fill?, contour? }],
 *          polys: [{ c: [[x, y]…] closed outline, round: mm | [per vertex], fill?, contour? }]   (solid masses),
 *          plates: [{ c, w, h, r, fill? }], eyes: [{ c, w, h, height?, pupil?, ring? }],
 *          lines: [{ c: [[x, y]…] | circle: [x, y, r], w, closed? }] (sunk), cuts: [{ c, w }] (deep channels), spirals: [{ c, r, turns, w, dir }] (sunk),
 *          borders: [[y0, y1]…] (raised full-width lines), centre: mm kept plain at the centre line }
 */
export function renderTrace(kit, panel, data, o = {}) {
  const W = panel.width
  const height = o.height ?? 2.6
  const depth = o.depth ?? 0.42
  const els = []
  const sides = data.single ? [1] : [1, -1]
  const ox = data.single ? 0 : W / 2 // single: data in panel x, unmirrored
  for (const side of sides) {
    const X = ([x, y]) => [ox + side * x, y]
    const sp = (s) => s && { ...s, dir: (s.dir ?? 1) * side }
    for (const b0 of data.bands || []) {
      const b = b0.smooth ? { ...b0, ...smoothBand(b0.c, b0.w) } : b0
      const f = fillOf(b.fill)
      els.push(kit.roundStroke(b.c.map(X), {
        width: o.widen ? (Array.isArray(b.w) ? b.w.map((v) => v * o.widen) : b.w * o.widen) : b.w, round: b.round ?? o.round ?? 0.55, inner: b.inner ?? o.inner ?? 0.18, start: b.start ?? 'blunt', end: b.end ?? 'blunt',
        capRound: b.capRound ?? 0.4, spiral: sp(b.spiral), startSpiral: sp(b.startSpiral),
        ...(f !== undefined ? { fill: f } : {}), ...(b.contour !== undefined ? { contour: b.contour } : {}),
      }))
    }
    for (const p of data.polys || []) {
      const f = fillOf(p.fill)
      els.push(kit.roundPoly(p.c.map(X), { round: p.round ?? 3, ...(f !== undefined ? { fill: f } : {}), ...(p.contour !== undefined ? { contour: p.contour } : {}) }))
    }
    for (const p of data.plates || []) {
      const f = fillOf(p.fill)
      els.push(kit.roundPlate({ c: X(p.c), w: p.w, h: p.h, r: p.r ?? 3, ...(f ? { fill: f } : {}), ...(p.contour !== undefined ? { contour: p.contour } : {}) }))
    }
  }
  // 0) raised border lines (register edges, bowstrings)
  for (const [y0, y1] of data.borders || []) {
    panel.raise((ctx) => ctx.fillRect(0, y0, W, y1 - y0), { height: o.borderHeight ?? height * 0.45, shoulder: (y1 - y0) * 0.45, profile: 'plateau' })
  }
  // 1) the masses and bands: fat, proud, steep rounded shoulders, a contour line inside the edge
  if (els.length) {
    kit.carve(panel, els, {
      height, shoulder: o.shoulder ?? height * 0.55, depth, seed: o.seed ?? 0, irregularity: 1.2,
      contour: o.contour ?? { inset: Math.max(0.8, height * 0.42), line: o.line ?? 0.55 },
    })
  }
  // 2) the eyes (after carve: the ground packer must avoid them)
  for (const e of data.eyes || []) {
    for (const side of sides) {
      const c = [ox + side * e.c[0], e.c[1]]
      kit.pillowBoss(panel, { c, w: e.w, h: e.h, round: e.round ?? 1, height: e.height ?? height * 2, crown: e.crown ?? 0.72, slit: false, ring: e.ring ?? false, base: e.base })
      if (e.pupil) {
        const pc = [c[0] + side * (e.pupil.dx ?? 0), c[1] + (e.pupil.dy ?? 0)]
        // a plain pit: steep walls, no lip
        panel.sink((ctx) => { ctx.beginPath(); ctx.arc(pc[0], pc[1], e.pupil.r, 0, Math.PI * 2); ctx.fill() }, { depth: e.pupil.depth ?? 2.4, shoulder: e.pupil.r * (e.pupil.soft ?? 0.35), profile: 'u' })
      }
    }
  }
  // 3) extra sunk lines (eye sockets, hooks incised on a mass, coils)
  const lines = [...(data.lines || []).map((l) => (l.circle ? { c: circle(l.circle.slice(0, 2), l.circle[2]), w: l.w, closed: true } : l)),
    ...(data.spirals || []).map((s) => ({ c: spiralPts(s.c, s.r, s.turns, s.dir ?? 1), w: s.w }))]
  if (lines.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const side of sides) for (const l of lines) {
        ctx.lineWidth = l.w ?? 0.6
        ctx.beginPath()
        l.c.forEach(([x, y], i) => (i ? ctx.lineTo(ox + side * x, y) : ctx.moveTo(ox + side * x, y)))
        if (l.closed) ctx.closePath()
        ctx.stroke()
      }
    }, { depth: (o.lineDepth ?? depth) * 0.9, shoulder: 0.25, profile: 'u' })
  }
  // 3b) deep channels cut down to the ground through a mass (the hook dividing the horn's block, the island's coil)
  const cuts = data.cuts || []
  if (cuts.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const side of sides) for (const l of cuts) {
        ctx.lineWidth = l.w ?? 2.4
        ctx.beginPath()
        l.c.forEach(([x, y], i) => (i ? ctx.lineTo(ox + side * x, y) : ctx.moveTo(ox + side * x, y)))
        ctx.stroke()
      }
    }, { depth: height * 0.92, shoulder: 0.7, profile: 'u' })
  }
  // 4) the leiwen ground everywhere left (one half, then the other: hands mirror)
  if (o.ground !== false) {
    const g = o.ground || {}
    const cg = data.centre ?? 0
    const parts = data.single ? [{ x: cg, w: W - cg, hand: 'right' }] : [{ x: W / 2 + cg, w: W / 2 - cg, hand: 'right' }, { x: 0, w: W / 2 - cg, hand: 'left' }]
    for (const part of parts) {
      kit.leiwenFill(panel, { rect: { x: part.x, y: g.y0 ?? 0, w: part.w, h: (g.y1 ?? panel.height) - (g.y0 ?? 0) }, avoid: 'raised', margin: g.margin ?? 0.55 }, {
        pitch: g.pitch ?? 1.2, line: 0.5, depth: g.depth ?? depth, cell: g.cell ?? [5.2, 9.5], pairs: g.pairs ?? 0.25, maxAspect: g.maxAspect ?? 1.6,
        roundness: g.roundness ?? 0.12, jitter: 0.06, hand: part.hand, seed: (o.seed ?? 0) + 11, turns: g.turns,
      })
    }
  }
}

/** traced registers (reference/nezu-you/trace/*.json) */
export const BELLY = BELLY_T
export const NECK = NECK_T
export const SKIRT = SKIRT_T
export const FOOT = FOOT_T
export const LID = LID_T

// ------------------------------------------------------------------ the bail strap (one half: lower end → crown)

/** photo-31 (detail-strap.jpg), from the pivot up: a long S-dragon whose FAT body (≈ 8 mm) swings once across the
 *  strap and ends below in a rolled tail curl ≈ 15 mm across, its top C-spirals; a leaf-shaped head under a round boss
 *  (≈ 110 mm along the strap from its lower end at y 200, i.e. y ≈ 310); a small mask of two hooked brows over the boss
 *  (≈ 116–140); a second S-dragon up the arch with its curl low (≈ 150 → the crown). Raised rims along both edges, fine spirals in the ground. Panel 27 mm wide; single (no mirror). */
export function strapData(L) {
  const W = 27, m = W / 2
  const S = (y0, y1, amp, n = 14) => {
    const out = []
    for (let i = 0; i <= n; i++) { const t = i / n; out.push([m + amp * Math.sin(Math.PI * 2 * t) * (0.4 + 0.6 * Math.sin(Math.PI * t)), y0 + (y1 - y0) * t]) }
    return out
  }
  const fat = (n, w0, w1) => Array.from({ length: n + 1 }, (_, i) => w0 + (w1 - w0) * Math.sin((Math.PI * i) / n) ** 0.6)
  return {
    single: true,
    centre: 0,
    bands: [
      { c: [[2, 1], [2, L]], w: 2.6, start: 'flat', end: 'flat', contour: false },
      { c: [[W - 2, 1], [W - 2, L]], w: 2.6, start: 'flat', end: 'flat', contour: false },
      // lower dragon (face-strap): a rolled tail ≈ 13 mm across low on the left, the fat S body swinging right then
      // back left, up into the head under the boss
      { c: [[10, 15], [17.5, 32], [17, 50], [11.5, 62], [9.5, 75], [13.5, 88]], w: [4.6, 7.6, 8.8, 8.8, 7.6, 6.2], start: 'spiral',
        startSpiral: { turns: 1.2, dir: 1, R: 5, taper: 0.75 }, end: 'round', contour: { inset: [1.1, 1.1], line: 0.45 }, fill: { kind: 'none' } },
      // the small mask over the boss: two hooked brows
      { c: [[m - 1.5, 116], [6, 120], [6, 132], [10.5, 138]], w: 4.2, end: 'spiral', spiral: { turns: 0.85, dir: -1, R: 2.2 } },
      { c: [[m + 1.5, 116], [W - 6, 120], [W - 6, 132], [W - 10.5, 138]], w: 4.2, end: 'spiral', spiral: { turns: 0.85, dir: 1, R: 2.2 } },
      { c: [[m, 122], [m, 140]], w: 3, start: 'round', end: 'point' },
      // upper dragon along the arch
      { c: S(152, L - 8, -4.4, 18), w: fat(18, 5, 8), start: 'spiral', startSpiral: { turns: 1.2, dir: -1, R: 4.6, taper: 0.75 }, end: 'round', contour: { inset: [1.1, 1.1], line: 0.45 }, fill: { kind: 'none' } },
    ],
    polys: [
      // the leaf / heart-shaped head of the lower dragon, under the boss
      { c: [[m, 89.5], [m + 7, 96], [m + 6.2, 101.6], [m, 100], [m - 6.2, 101.6], [m - 7, 96]], round: [2.5, 2.5, 2.4, 1, 2.4, 2.5] },
    ],
    eyes: [{ c: [m, 109.5], w: 9, h: 9, round: 1, height: 2.6, crown: 0.7 }],
  }
}

// ------------------------------------------------------------------ panels

const panelOf = (kit, size, ppmm, seed) => new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })

export function bellyPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawBelly(kit, p, size, { seed })
  return p.bake()
}
export function neckPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, NECK_FRIEZE, { seed })
  return p.bake()
}
export function skirtPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, SKIRT_FRIEZE, { seed })
  return p.bake()
}
export function footPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, FOOT_FRIEZE, { seed })
  return p.bake()
}
export function lidPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, LID, { round: 0.8, inner: 0.3, height: 2.4, shoulder: 0.9, seed, contour: { inset: 1.1, line: 0.5 }, ground: { pitch: 1.1, cell: [5, 9], roundness: 0.5, pairs: 0.25, y1: Math.min(size.height, 76) } })
  return p.bake()
}
export function strapPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  renderTrace(kit, p, strapData(size.height), { height: 2.2, shoulder: 1.0, seed, line: 0.4, contour: { inset: 0.75, line: 0.4 }, ground: { pitch: 0.95, cell: [4, 7], pairs: 0.3, roundness: 0.85 } })
  return p.bake()
}
