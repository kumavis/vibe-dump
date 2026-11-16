// Nezu bo 蟠螭文鎛 (90120) — the décor of one HALF-FACE (centre line → edge), in panel mm.
//
// Read off the owner's photographs (photo-18 head-on, photo-19 at ≈ 40° from the left; detail-*.jpg; the flattened
// faces in reference/nezu-bo/faces/): every decorated surface is drawn in ONE idiom, the Spring and Autumn panchi
// interlace as the Houma foundry cast it —
//  * BODIES are broad flat raised RIBBONS (≈ 6.5 mm on the bands, ≈ 5.6 mm in the lower field, ≈ 1.1 mm proud) cut
//    along their length by TWO fine grooves into three equal ribs; on the bronze the ribs are dark polished metal
//    and the grooves and the ground between ribbons are packed with pale grey earth, so the décor reads as triple
//    dark lines. Ribbons turn at rounded corners and run in meanders and squared hooks (G-hooks); where two cross,
//    one runs over with its grooves unbroken.
//  * HEADS are solid raised masses (no grooves) — a rounded body with a ringed eye (sunk ring, the pupil left
//    standing), a crest stalk with a knob, a curled snout, a neck stalk ending in a hook, a C-curl on the cheek.
//  * the GROUND is plain (rough, pale): no spirals.
// The faces are mirror-symmetric about the centre line, so one half-face panel serves all four half-faces (the
// left halves are built with u running leftward: the mesh mirrors, the tangent frame follows).
//
// Panel frame: x = 0 on the face centre line → x = PANEL_W at the edge (angle-proportional across the face, see
// form.js); y = body height − y0 of the panel.

import { LAYOUT, PANEL_W, H } from './form.js'

// ------------------------------------------------------------------ geometry helpers

/** Chaikin smoothing of a closed polygon (rounded corners on traced outlines) */
function chaikin(pts, it = 2, closed = true) {
  let P = pts
  for (let k = 0; k < it; k++) {
    const Q = []
    const n = P.length
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = P[i], b = P[(i + 1) % n]
      Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    if (!closed) { Q.unshift(P[0]); Q.push(P[n - 1]) }
    P = Q
  }
  return P
}

/** rounded-corner polyline: each interior corner replaced by an arc of radius r (clamped to half the legs) */
export function roundCorners(pts, r) {
  if (pts.length < 3 || !r) return pts
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1]
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const rr = Math.min(Array.isArray(r) ? r[i] : r, l1 * 0.5, l2 * 0.5)
    if (rr < 0.05) { out.push(b); continue }
    const u = [(a[0] - b[0]) / l1, (a[1] - b[1]) / l1], v = [(c[0] - b[0]) / l2, (c[1] - b[1]) / l2]
    const p = [b[0] + u[0] * rr, b[1] + u[1] * rr], q = [b[0] + v[0] * rr, b[1] + v[1] * rr]
    // quadratic Bézier through the corner (close to a circular fillet for right angles)
    for (let k = 0; k <= 8; k++) {
      const t = k / 8, s = 1 - t
      out.push([s * s * p[0] + 2 * s * t * b[0] + t * t * q[0], s * s * p[1] + 2 * s * t * b[1] + t * t * q[1]])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

const circlePts = (c, r, n = 40) => Array.from({ length: n }, (_, i) => [c[0] + r * Math.cos((i / n) * Math.PI * 2), c[1] + r * Math.sin((i / n) * Math.PI * 2)])
const ellipsePts = (c, rx, ry, n = 64) => Array.from({ length: n + 1 }, (_, i) => [c[0] + rx * Math.cos((i / n) * Math.PI * 2), c[1] + ry * Math.sin((i / n) * Math.PI * 2)])

function pathPts(ctx, pts, closed) {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}

// ------------------------------------------------------------------ the renderer

/**
 * An element list: { ribbons: [{ pts, w, layer }], solids: [{ pts, w }] (raised strokes, no grooves),
 * masses: [poly] (raised fills), eyes: [{ c, r }], lines: [{ pts, w }] (sunk), knobs: [{ c, r }] }
 */
export const emptyEls = () => ({ ribbons: [], solids: [], masses: [], eyes: [], lines: [], knobs: [] })
function merge(a, b) { for (const k of Object.keys(a)) a[k].push(...b[k]); return a }
function mapEls(els, f) {
  const m = (pts) => pts.map(f)
  return {
    ribbons: els.ribbons.map((r) => ({ ...r, pts: m(r.pts) })),
    solids: els.solids.map((r) => ({ ...r, pts: m(r.pts) })),
    masses: els.masses.map(m),
    eyes: els.eyes.map((e) => ({ ...e, c: f(e.c) })),
    lines: els.lines.map((r) => ({ ...r, pts: m(r.pts) })),
    knobs: els.knobs.map((e) => ({ ...e, c: f(e.c) })),
  }
}

/**
 * Raise the ribbons as three-ribbed bands (one raise, one sink, one restoring raise per layer), the heads as solid
 * masses, then cut the eye rings and curl lines. `clip(ctx)` limits all drawing (a band's field).
 */
export function renderEls(panel, els, o = {}) {
  const h = o.height ?? 1.1, d = o.depth ?? 0.45, g = o.groove ?? 0.6
  const clip = o.clip
  const withClip = (fn) => (ctx) => { ctx.save(); if (clip) { ctx.beginPath(); clip(ctx); ctx.clip() } ctx.lineCap = 'round'; ctx.lineJoin = 'round'; fn(ctx); ctx.restore() }
  const strokeAll = (ctx, list, dw) => {
    for (const r of list) {
      const w = r.w + dw
      if (w <= 0.05) continue
      ctx.lineWidth = w
      ctx.beginPath(); pathPts(ctx, r.pts, r.closed); ctx.stroke()
    }
  }
  // solids + masses + knobs: one raise
  panel.raise(withClip((ctx) => {
    strokeAll(ctx, els.solids, 0)
    ctx.beginPath()
    for (const m of els.masses) pathPts(ctx, m, true)
    for (const k of els.knobs) { ctx.moveTo(k.c[0] + k.r, k.c[1]); ctx.arc(k.c[0], k.c[1], k.r, 0, Math.PI * 2) }
    ctx.fill()
  }), { height: h, shoulder: o.shoulder ?? 0.45 })
  const layers = [...new Set(els.ribbons.map((r) => r.layer || 0))].sort()
  for (const L of layers) {
    const rs = els.ribbons.filter((r) => (r.layer || 0) === L)
    const rib = (w) => (w - 2 * g) / 3
    panel.raise(withClip((ctx) => strokeAll(ctx, rs, 0)), { height: h, shoulder: o.shoulder ?? 0.45 })
    panel.sink(withClip((ctx) => {
      for (const r of rs) { ctx.lineWidth = r.w - 2 * rib(r.w); ctx.beginPath(); pathPts(ctx, r.pts, r.closed); ctx.stroke() }
    }), { depth: d, shoulder: 0.22, profile: 'u' })
    panel.raise(withClip((ctx) => {
      for (const r of rs) { ctx.lineWidth = Math.max(0.1, r.w - 2 * rib(r.w) - 2 * g); ctx.beginPath(); pathPts(ctx, r.pts, r.closed); ctx.stroke() }
    }), { height: h, shoulder: 0.18 })
  }
  // eye rings and curl lines
  if (els.eyes.length || els.lines.length) {
    panel.sink(withClip((ctx) => {
      for (const e of els.eyes) { ctx.lineWidth = e.line ?? 0.75; ctx.beginPath(); ctx.arc(e.c[0], e.c[1], e.r, 0, Math.PI * 2); ctx.stroke() }
      for (const l of els.lines) { ctx.lineWidth = l.w ?? 0.6; ctx.beginPath(); pathPts(ctx, l.pts, l.closed); ctx.stroke() }
    }), { depth: d * 1.1, shoulder: 0.22, profile: 'u' })
  }
}

// ------------------------------------------------------------------ the units (authored in a local cell frame)

/**
 * A PROFILE dragon head, authored in a 30 × 20 mm box (origin bottom-left), snout to the LEFT (−x), traced on
 * faces/dev-band.jpg (photo-19 developed, 8 px/mm; band 1, units 1 and 4): a solid dark mass ≈ 25 × 17 mm with a
 * ringed eye in its middle; at its left the snout rolls up and back into a fat C-curl; a sunk curl on the jowl; a
 * raised ear curl at the back; the crest a solid stalk running up to the ledge with a knob beside it (or, on units 2
 * and 5, a hook turning back over the head); a neck stalk with a knob dropping to the frame below.
 */
function headUnit({ hook = false } = {}) {
  const E = emptyEls()
  E.masses.push(chaikin([[7, 4.2], [15, 3], [24, 3.4], [29, 7], [29.4, 13.6], [25.4, 18.6], [16, 19.6], [9.6, 18.4], [6.4, 15], [5, 9.6]], 2))
  // the snout: a fat C rolled up and back, opening to the right
  E.solids.push({ pts: roundCorners([[9.6, 17.2], [2.2, 17.4], [1.4, 9.4], [6.4, 6.2], [9.4, 8.6], [7.8, 11.6]], [0, 3.6, 3.4, 2.4, 1.6, 0]), w: 3.8 })
  // the ear: a raised curl at the back of the head
  E.solids.push({ pts: roundCorners([[24.6, 9], [29.4, 9.4], [30.4, 14.4], [27, 15.8], [25.6, 13.2]], [0, 2, 2, 1.4, 0]), w: 2.8 })
  if (hook) {
    // crest hook: up to the ledge, then back over the head and down
    E.solids.push({ pts: roundCorners([[16.6, 18], [16.6, 25.6], [26.4, 25.6], [26.4, 22]], 1.6), w: 3.8, crest: true })
  } else {
    E.solids.push({ pts: [[16.6, 18], [16.6, 32]], w: 4.2, crest: true }) // crest stalk, run on past the box (clipped by the band)
    E.knobs.push({ c: [11.8, 23.2], r: 2.3 })
  }
  // the neck: a stalk dropping from the jaw to the frame below, a knob where it leaves the head
  E.solids.push({ pts: [[10.6, 6], [10.6, -9]], w: 3.8 })
  E.knobs.push({ c: [10.6, 1.4], r: 2.6 })
  E.eyes.push({ c: [16.8, 11.6], r: 2.7, line: 0.85 })
  E.lines.push({ pts: curlPts([21.6, 7.2], 2.8, 0.6, 180, -1.1, 24), w: 0.7 })
  E.lines.push({ pts: roundCorners([[3.6, 15.4], [3.6, 10.6], [6.4, 9.4]], 1.6), w: 0.6 })
  return E
}
const HEAD = headUnit()
const HEAD_HOOK = headUnit({ hook: true })

/**
 * One band unit as the bronze draws it (faces/dev-band.jpg): a fat three-ribbed G-frame OPEN AT THE TOP — down the
 * outer sides, along the bottom, its two top arms turning in (the left arm stops short of the crest, the right one hooks
 * down into the cell) — with a second, narrower ribbon nested inside it along the bottom and the right side that rolls
 * into a hook under the ear, and a solid profile head filling the upper middle. Cell [0, L] × [0, T] (local mm).
 * open: 'top' | 'bottom' (the gap, and the crest, on that side); face: +1 the snout toward +s, −1 toward −s.
 */
function gUnit(L, T, { w = 6.4, open = 'top', face = 1, hook = false, nested = true, head = 1, nest2 = false } = {}) {
  const E = emptyEls()
  const h = w / 2
  const r = Math.min(4.6, w * 0.7)
  // author with the snout to the LEFT; face > 0 mirrors at the end
  E.ribbons.push({ pts: roundCorners([[0.36 * L, T - h], [h, T - h], [h, h], [L - h, h], [L - h, T - h], [0.66 * L, T - h], [0.66 * L, T - h - Math.min(4.2, T * 0.13)]], [0, r, r, r, r, 1.6, 0]), w })
  if (nested) {
    const w2 = w * 0.82, d = w + 0.9 + w2 / 2
    const yTop = Math.min(T - d, 0.58 * T)
    E.ribbons.push({ pts: roundCorners([[d, 0.44 * T], [d, d], [L - d, d], [L - d, yTop], [L - d - 4.2, yTop + 1.4], [L - d - 5.6, yTop - 1.8]], [0, r * 0.8, r * 0.8, 2.2, 1.6, 0]), w: w2 })
  }
  if (nest2) {
    // a third ribbon nested inside the second (the lower field: the frames run in threes)
    const w3 = w * 0.75, d = w + 0.9 + w * 0.82 + 0.9 + w3 / 2
    E.ribbons.push({ pts: roundCorners([[d, 0.4 * T], [d, d], [L - d, d], [L - d, 0.48 * T]], [0, r * 0.6, r * 0.6, 0]), w: w3 })
  }
  // head = scale of the head in the cell (1 on the bands; smaller in the field, where the frames dominate)
  const sx = (0.58 * L * head) / 30, sy = (0.56 * T * head) / 20
  const ox = (0.2 + 0.58 * (1 - head) * 0.5) * L, oy = (0.22 + (nest2 ? 0.08 : 0)) * T + 0.56 * T * (1 - head) * 0.6
  merge(E, mapEls(hook ? HEAD_HOOK : HEAD, ([x, y]) => [ox + x * sx, oy + y * sy]))
  const fs = face < 0 ? (p) => p : ([x, y]) => [L - x, y]
  const ft = open === 'top' ? (p) => p : ([x, y]) => [x, T - y]
  return mapEls(E, (p) => ft(fs(p)))
}

/**
 * The ring between units 2 and 4 (faces/dev-band.jpg, X 113–129): not a plain ellipse but two bodies crossing — a
 * pointed oval of two arcs, each running on past the crossings at top and bottom, one over, one under.
 */
function crossedRing(cx, yb, T, { w = 6, half = 12.4 } = {}) {
  const E = emptyEls()
  const mid = yb + T / 2, a = T / 2 - w / 2 - 0.4
  // an arc through (cx ∓ half, mid) and (cx, mid ± a): centre on the axis line y = mid at cx ± c
  const c = (a * a - half * half) / (2 * half)
  const R = half + c
  for (const sgn of [-1, 1]) {
    // sgn −1: the left arc (bulging left, centre right of the axis); +1 the right arc
    const cc = [cx - sgn * c, mid]
    const th = Math.atan2(a, c) * 1.2
    const pts = []
    for (let i = 0; i <= 48; i++) {
      const t = -th + (2 * th * i) / 48
      const ang = sgn < 0 ? Math.PI - t : t
      pts.push([cc[0] + R * Math.cos(ang), cc[1] + R * Math.sin(ang)])
    }
    E.ribbons.push({ pts, w, layer: sgn < 0 ? 0 : 1 })
  }
  return E
}

// ------------------------------------------------------------------ panel drawing

/** raised plain strip / rect (ledges, frames): plateau with a rounded shoulder */
function strips(panel, rects, h, shoulder) {
  panel.raise((ctx) => {
    ctx.beginPath()
    for (const [x0, y0, x1, y1] of rects) ctx.rect(x0, y0, x1 - x0, y1 - y0)
    ctx.fill()
  }, { height: h, shoulder })
}

/** two strands twisting round each other (the top band, the edge strip): a guilloche of three-ribbed ribbons */
function guilloche(x0, x1, yc, amp, period, w, { vertical = false, phase = 0 } = {}) {
  const E = emptyEls()
  const half = period / 2
  const n = Math.ceil((x1 - x0) / half) + 2
  for (let strand = 0; strand < 2; strand++) {
    for (let k = -1; k < n; k++) {
      const s0 = x0 + phase + k * half, s1 = s0 + half
      const pts = []
      for (let i = 0; i <= 16; i++) {
        const s = s0 - 0.6 + ((s1 - s0 + 1.2) * i) / 16
        const t = yc + (strand ? -1 : 1) * amp * Math.sin(((s - x0 - phase) / period) * Math.PI * 2)
        pts.push(vertical ? [t, s] : [s, t])
      }
      E.ribbons.push({ pts, w, layer: (k + strand + 4) % 2 })
    }
  }
  return E
}

/**
 * The top band (photo-18, the band under the top's edge): a chain of interlocked C-hooks — per unit (pitch P) one
 * ribbon runs along the top edge and rolls down round the right of its C into the band, the other (the same turned
 * 180°) runs along the bottom edge and rolls up round the left; the two Cs hook into each other. Three-ribbed ribbons
 * filling the band's height (≈ 12 mm), so they read as the bronze's fat interlinked S-links.
 */
function hookChain(x0, x1, yb, Hb, P, w) {
  const E = emptyEls()
  const mid = yb + Hb / 2, top = yb + Hb - w / 2 - 0.2, bot = yb + w / 2 + 0.2
  const R0 = Hb / 2 - w / 2 - 0.2
  for (let k = -1; x0 + k * P < x1 + P; k++) {
    const ox = x0 + k * P
    const cA = [ox + 0.6 * P, mid], cB = [ox + 0.4 * P, mid]
    const arcA = curlPts(cA, R0, R0 * 0.55, 90, -0.8, 40)
    const A = [[ox - 0.1 * P, top], [cA[0] - 0.4, top], ...arcA]
    const B = A.map(([x, y]) => [2 * (ox + 0.5 * P) - x, 2 * mid - y])
    E.ribbons.push({ pts: roundCorners(A.slice(0, 3), 1).concat(A.slice(3)), w, layer: 0 })
    E.ribbons.push({ pts: roundCorners(B.slice(0, 3), 1).concat(B.slice(3)), w, layer: 1 })
  }
  return E
}

/** a curl centre line: radius r0 → r1 over `turns` from angle a0 (deg), anticlockwise for turns > 0 */
function curlPts(c, r0, r1, a0, turns, n = 48) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, a = ((a0 + t * turns * 360) * Math.PI) / 180, r = r0 + (r1 - r0) * t
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
  })
}

/**
 * A scroll cell of the central panel (photo-18 developed, faces/dev-upper-18.jpg: the top cell and the fifth): the
 * column's ribbon sweeps in from the outer side and rolls into a big round curl, a small solid hook in its eye.
 */
function scrollUnit(L, T, { w = 6.2, face = 1, flip = false } = {}) {
  const E = emptyEls()
  const R = Math.min(L, T) / 2 - w / 2 - 0.6
  const c = [L / 2, T / 2]
  const pts = [[L - w / 2, 0.4], [L - w / 2, T / 2 - R * 0.2], ...curlPts(c, R, R * 0.28, 0, 1.15, 72)]
  E.ribbons.push({ pts: roundCorners(pts.slice(0, 3), 3).concat(pts.slice(3)), w })
  E.knobs.push({ c: [c[0] + R * 0.18, c[1] - R * 0.1], r: 2.2 })
  const fs = face > 0 ? (p) => p : ([x, y]) => [L - x, y]
  const ft = flip ? ([x, y]) => [x, T - y] : (p) => p
  return mapEls(E, (p) => ft(fs(p)))
}

/**
 * The upper zone: ledges, the central panel (one column of units per half), the two interlace bands, the boss rows
 * (plain), the edge strip, the top band. Panel y = body y − y0.
 */
export function upperPanel(kit, { ppmm, seed, y0 }) {
  const Hh = H - y0
  const panel = new kit.ReliefPanel({ width: PANEL_W, height: Hh, ppmm, seed })
  const Y = (y) => y - y0
  const P = LAYOUT.panel, F = LAYOUT.frame
  const xEnd0 = LAYOUT.end[0], xEnd1 = PANEL_W - 1.6
  const pHalf = (y) => P.bottom + ((P.top - P.bottom) * (y - P.y[0])) / (P.y[1] - P.y[0]) // the panel's frame edge at body y

  // --- ledges and frames: raised strips (2.2 mm proud, rounded), each ledge ≈ 5 mm with its shadowed foot below
  const led = LAYOUT.ledges.map(([a, b], i) => {
    const top = b, bot = Math.max(a, b - 5.2)
    return i === LAYOUT.ledges.length - 1 ? [1.6, Y(bot), xEnd1, Y(top)] : [pHalf((a + b) / 2) - 0.5, Y(bot), xEnd0 + 0.6, Y(top)]
  })
  strips(panel, [...led, [xEnd0 - 0.2, Y(LAYOUT.border[1]) - 1, xEnd0 + F - 0.2, Y(LAYOUT.ledges[4][1] - 1)]], 2.2, 1.1)
  // the panel's side frame follows the trapezoid
  panel.raise((ctx) => {
    ctx.beginPath()
    const [ya, yb] = P.y
    ctx.moveTo(pHalf(ya) - F, Y(ya) - 1); ctx.lineTo(pHalf(ya), Y(ya) - 1); ctx.lineTo(pHalf(yb), Y(yb)); ctx.lineTo(pHalf(yb) - F, Y(yb)); ctx.closePath()
    ctx.fill()
  }, { height: 2.2, shoulder: 1.1 })
  // the broad border over the lower field: a heavier rounded band
  strips(panel, [[1.6, Y(LAYOUT.border[0]), xEnd1, Y(LAYOUT.border[1])]], 2.8, 2.6)

  const els = emptyEls()
  // --- the interlace bands (篆), traced on photo-19 developed (faces/dev-band.jpg): per half, from the panel outward
  //     five units and the O ring; every unit's frame is open at the top where its crest runs up to the ledge
  //     (round-8 fix: every snout looks toward the centre; units 2 and 5 carry the crest hook; open G-frames, the
  //     neighbours' sides bridged over the top; the ring is two crossing bodies)
  const UNITS = [[33, 79, -1, false], [79.5, 113, -1, true], null, [129, 170.5, -1, false], [171, 217, -1, true], [217.5, 242.4, -1, false]]
  for (const [b0, b1] of LAYOUT.bands) {
    const yb = Y(b0) + 0.4, T = b1 - b0 - 0.8
    for (const u of UNITS) {
      if (!u) {
        merge(els, crossedRing(122.4, yb, T, { w: 6.2, half: 10.6 }))
        continue
      }
      const [xa, xb, face, hook] = u
      merge(els, mapEls(gUnit(xb - xa, T, { open: 'top', face, w: 6.6, hook, head: 1.12 }), ([s, t]) => [xa + s, yb + t]))
    }
  }
  for (const [b0, b1] of LAYOUT.bands) {
    // the neighbours' outer sides joined over the top (an inverted U): the frames hook into each other
    const yt = Y(b1) - 0.4 - 3.3
    for (const [x1, x2] of [[79, 79.5], [170.5, 171], [217, 217.5]]) {
      els.ribbons.push({ pts: roundCorners([[x1 - 3.3, yt - 6], [x1 - 3.3, yt], [x2 + 3.3, yt], [x2 + 3.3, yt - 6]], 3.2), w: 6.6 })
    }
  }
  // --- the central panel: a column of upright units, the frames' gaps alternating; the top cell and the fifth are
  //     scroll cells (photo-18 developed)
  {
    const ya = LAYOUT.border[1] + 0.8, yb = LAYOUT.ledges[4][0] - 0.5
    const n = 7, Lc = (yb - ya) / n
    for (let k = 0; k < n; k++) {
      const yTop = yb - k * Lc, yBot = yTop - Lc
      const xb = Math.min(pHalf(yTop), pHalf(yBot)) - F - 0.3, xa = 1.4
      const u = k === 0 || k === 4
        ? scrollUnit(xb - xa, Lc, { face: k === 0 ? -1 : 1, flip: k === 4 })
        : gUnit(xb - xa, Lc, { w: 6.2, open: k % 2 ? 'bottom' : 'top', face: k % 2 ? 1 : -1 })
      merge(els, mapEls(u, ([s, t]) => [xa + s, Y(yBot) + t]))
    }
  }
  // --- the edge strip and the top band: twisted pairs
  const xs0 = xEnd0 + F + 0.4, xs1 = xEnd1 - 0.4
  merge(els, guilloche(Y(LAYOUT.border[1]) + 1, Y(LAYOUT.ledges[4][0]), (xs0 + xs1) / 2, (xs1 - xs0) / 2 - 2.1, 21, 4.0, { vertical: true }))
  const tb = LAYOUT.topBand
  merge(els, hookChain(0.8, xEnd1, Y(tb[0]) + 0.3, tb[1] - tb[0] - 2.0, 27, 4.2))
  const clip = (ctx) => {
    // bands and panel interiors only: keep the décor off the ledges, the frames and the panel edges
    for (const [b0, b1] of LAYOUT.bands) ctx.rect(pHalf(b1) + 0.2, Y(b0) + 0.2, xEnd0 - pHalf(b1) - 0.4, b1 - b0 - 0.4)
    const [ya, yb] = P.y
    ctx.moveTo(1.6, Y(LAYOUT.border[1]) + 0.2); ctx.lineTo(pHalf(ya) - F - 0.2, Y(LAYOUT.border[1]) + 0.2)
    ctx.lineTo(pHalf(yb) - F - 0.2, Y(LAYOUT.ledges[4][0]) - 0.2); ctx.lineTo(1.6, Y(LAYOUT.ledges[4][0]) - 0.2); ctx.closePath()
    ctx.rect(xs0 - 0.6, Y(LAYOUT.border[1]) + 0.2, xs1 - xs0 + 1.2, Y(LAYOUT.ledges[4][0]) - Y(LAYOUT.border[1]) - 0.4)
    ctx.rect(1.6, Y(tb[0]) + 0.2, xEnd1 - 1.6, tb[1] - tb[0] - 1.8)
  }
  renderEls(panel, els, { height: 1.1, depth: 0.45, groove: 0.6, clip })
  return panel
}


export function lowerPanel(kit, { ppmm, seed, height }) {
  const panel = new kit.ReliefPanel({ width: PANEL_W, height, ppmm, seed })
  const [f0, f1] = LAYOUT.field
  // units ≈ 46 × 41 mm (photo-19 developed, faces/dev-lower-19.jpg: units ≈ 45–55 mm wide in three rows and a worn fourth)
  const TW = 46, TH = (f1 - f0) / 3.1
  const fresh = emptyEls(), worn = emptyEls()
  const rowsN = Math.ceil((f1 - f0) / TH)
  for (let j = 0; j < rowsN; j++) {
    const yb = f1 - (j + 1) * TH
    const shift = (j % 2) * TW * 0.5
    for (let i = -1; i * TW < PANEL_W + TW; i++) {
      const xb = 0.4 + i * TW + shift
      // round-8 fix: the field is drawn in the bands' own vocabulary at a larger module (photo-19 detail-field: open
      // G-frames hooking into each other, a solid profile head with a ringed eye in every frame), the frames opening
      // up and down by turns and the heads looking left and right by turns, rows offset by half a unit
      const t = mapEls(gUnit(TW - 0.6, TH - 0.6, { w: 5.2, open: (i + j) % 2 ? 'bottom' : 'top', face: (i + j) % 2 ? 1 : -1, hook: (i + 2 * j) % 3 === 1, head: 0.62, nest2: true }), ([x, y]) => [xb + x, yb + y])
      merge(yb + TH * 0.5 < 52 ? worn : fresh, t)
    }
  }
  // the lowest row is worn almost flat on the bronze (photo-18 / 19): drawn lower and shallower
  renderEls(panel, fresh, { height: 1.0, depth: 0.42, groove: 0.55, clip: (ctx) => ctx.rect(1.6, f0, PANEL_W - 3.2, f1 - f0) })
  renderEls(panel, worn, { height: 0.55, depth: 0.28, groove: 0.55, shoulder: 0.5, clip: (ctx) => ctx.rect(1.6, f0, PANEL_W - 3.2, f1 - f0) })
  return panel
}
