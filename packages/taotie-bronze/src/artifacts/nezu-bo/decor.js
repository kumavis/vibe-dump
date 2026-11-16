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
 * A dragon head in its cell — authored for a 38 × 33 mm cell, frame on top, opening at the bottom, facing +s.
 * (photo-19 band 1, detail-band.jpg: the solid head with its ringed eye, a crest stalk to the frame with a knob
 * beside it, a snout curling up and back, a neck stalk to the open side ending in a hook, a C-curl on the cheek)
 */
function headUnit() {
  const E = emptyEls()
  E.masses.push(chaikin([[11.5, 10.2], [17, 9.2], [23.5, 9.6], [27, 12.6], [27.2, 18.4], [22, 21.2], [15.5, 21.6], [11.4, 19.6], [9.8, 15]], 2))
  E.solids.push({ pts: [[16.6, 19.5], [16.6, 27.5]], w: 3.6 }) // crest stalk up to the frame
  E.knobs.push({ c: [13, 24.8], r: 1.9 }) // the knob beside it
  E.solids.push({ pts: roundCorners([[25.5, 16.5], [30.4, 17.6], [31.6, 21.4], [29.4, 23.6], [26.8, 22.4]], 1.6), w: 3.2 }) // snout
  E.solids.push({ pts: roundCorners([[18.4, 10.5], [18.4, 4.2], [24.6, 4.2], [24.6, 6.6]], 1.6), w: 3.2 }) // neck hook
  E.solids.push({ pts: roundCorners([[11.6, 13.6], [7.8, 13.8], [7.6, 18], [10.2, 18.6]], 1.2), w: 2.6 }) // cheek C
  E.eyes.push({ c: [16.2, 15.4], r: 2.5 })
  E.lines.push({ pts: roundCorners([[21, 12.2], [24.2, 12.6], [24.2, 16.4], [21.6, 16.6]], 1.2), w: 0.6 })
  E.lines.push({ pts: [[29.2, 20.2], [28, 20.6]], w: 0.55 })
  return E
}
const HEAD = headUnit()

/**
 * A run of meander cells along s ∈ [0, n·L], across t ∈ [0, T]: the frame ribbon is ONE polyline turning at the
 * cell borders (∩ ∪ ∩ …), a head in every cell (∪ cells turned 180°).
 * @returns elements in the local (s, t) frame
 */
function meanderRun(n, L, T, { w = 6.6, first = 'top', layer = 0, heads = true, r = 3.2, extend = [0, 0] } = {}) {
  const E = emptyEls()
  const lo = w / 2, hi = T - w / 2
  const pts = []
  let top = first === 'top'
  for (let k = 0; k <= n; k++) {
    const s = k * L
    const a = top ? lo : hi, b = top ? hi : lo
    if (k === 0 && extend[0] > 0) pts.push([s - extend[0], a]) // enter along the open side's level
    pts.push([s, a], [s, b])
    if (k === n && extend[1] > 0) pts.push([s + extend[1], b])
    top = !top
  }
  // the horizontal between verticals k and k+1 runs at the level the vertical k ended on
  E.ribbons.push({ pts: roundCorners(pts, r), w, layer })
  if (heads) {
    for (let k = 0; k < n; k++) {
      const cellTop = (first === 'top') === (k % 2 === 0) // frame horizontal on top of this cell
      const sx = L / 38, sy = T / 33
      const f = cellTop
        ? ([x, y]) => [k * L + x * sx, y * sy]
        : ([x, y]) => [k * L + L - x * sx, T - y * sy] // turned 180°
      merge(E, mapEls(HEAD, f))
    }
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
 * The upper zone: ledges, the central panel (one column of meander cells per half), the two interlace bands, the
 * boss rows (plain), the edge strip, the top band. Panel y = body y − y0.
 */
export function upperPanel(kit, { ppmm, seed, y0 }) {
  const Hh = H - y0
  const panel = new kit.ReliefPanel({ width: PANEL_W, height: Hh, ppmm, seed })
  const Y = (y) => y - y0
  const P = LAYOUT.panel, F = LAYOUT.frame
  const xEnd0 = LAYOUT.end[0], xEnd1 = PANEL_W - 1.6

  // --- ledges and frames (L3-ish: 2.2 mm proud, rounded)
  const led = LAYOUT.ledges.map(([a, b], i) => (i === LAYOUT.ledges.length - 1 ? [1.6, Y(a), xEnd1, Y(b)] : [P.half - 0.5, Y(a), xEnd0 + 0.6, Y(b)]))
  const frames = [
    [P.half - F, Y(P.y[0]), P.half, Y(P.y[1])], // the central panel's side frame
    [xEnd0 - 0.2, Y(LAYOUT.border[1]) - 1, xEnd0 + F - 0.2, Y(LAYOUT.ledges[4][1])], // the inner frame of the edge strip
  ]
  strips(panel, [...led, ...frames], 2.2, 1.1)
  // the broad border over the lower field: a heavier rounded band
  strips(panel, [[1.6, Y(LAYOUT.border[0]), xEnd1, Y(LAYOUT.border[1])]], 2.8, 2.4)

  // --- the interlace bands (篆): per half, from the panel outward: cell, cell, the O ring, cell, cell
  const els = emptyEls()
  for (const [b0, b1] of LAYOUT.bands) {
    const yb = Y(b0) + 0.6, T = b1 - b0 - 1.2
    const xa = P.half + 0.6 + 3.3, xb = xEnd0 - 0.6 - 3.3
    const ring = 25
    const L = (xb - xa - ring) / 4
    const run1 = meanderRun(2, L, T, { first: 'top', extend: [0, 0] })
    const run2 = meanderRun(2, L, T, { first: 'bottom', extend: [0, 0] })
    merge(els, mapEls(run1, ([s, t]) => [xa + s, yb + t]))
    merge(els, mapEls(run2, ([s, t]) => [xa + 2 * L + ring + s, yb + t]))
    // the O ring: two bodies looping through each other, over the meander ends
    const cx = xa + 2 * L + ring / 2, cy = yb + T / 2
    els.ribbons.push({ pts: ellipsePts([cx, cy], ring / 2 + 0.6, T / 2 - 3.3, 72), w: 6.6, layer: 1, closed: true })
  }
  // --- the central panel: one column of meander cells running DOWN (s along −y), the head turned with it
  {
    const xa = 1.2, xb = P.half - F - 0.4
    const ya = Y(LAYOUT.border[1]) + 0.8 + 3.1, yb = Y(LAYOUT.ledges[4][0]) - 0.4 - 3.1
    const n = 7, L = (yb - ya) / n, T = xb - xa
    const run = meanderRun(n, L, T, { first: 'top', w: 6.2 })
    merge(els, mapEls(run, ([s, t]) => [xa + t, yb - s]))
  }
  // --- the edge strip and the top band: twisted pairs
  const xs0 = xEnd0 + F + 0.4, xs1 = xEnd1 - 0.4
  merge(els, guilloche(Y(LAYOUT.border[1]) + 1, Y(LAYOUT.ledges[4][0]), (xs0 + xs1) / 2, (xs1 - xs0) / 2 - 2.1, 21, 4.0, { vertical: true }))
  const tb = LAYOUT.topBand
  merge(els, guilloche(0.8, xEnd1, Y((tb[0] + tb[1]) / 2) - 0.2, 4.4, 26, 5.2, { phase: 3 }))
  const clip = (ctx) => {
    // bands and panel interiors only: keep the décor off the ledges, the frames and the panel edges
    for (const [b0, b1] of LAYOUT.bands) ctx.rect(P.half + 0.2, Y(b0) + 0.2, xEnd0 - P.half - 0.4, b1 - b0 - 0.4)
    ctx.rect(1.6, Y(LAYOUT.border[1]) + 0.2, P.half - F - 1.8, Y(LAYOUT.ledges[4][0]) - Y(LAYOUT.border[1]) - 0.4)
    ctx.rect(xs0 - 0.6, Y(LAYOUT.border[1]) + 0.2, xs1 - xs0 + 1.2, Y(LAYOUT.ledges[4][0]) - Y(LAYOUT.border[1]) - 0.4)
    ctx.rect(1.6, Y(tb[0]) + 0.2, xEnd1 - 1.6, tb[1] - tb[0] - 1.8)
  }
  renderEls(panel, els, { height: 1.1, depth: 0.45, groove: 0.6, clip })
  return panel
}

/**
 * The lower field (鼓部): a lattice of interlocking G-hooks of three-ribbed ribbons with a head in every bay,
 * rows offset by half a tile (photo-19 detail-field.jpg). Tile ≈ 36 × 34 mm.
 */
function fieldTile() {
  const E = emptyEls()
  const w = 5.6, r = 2.6
  // two squared hooks pin-wheeled about the tile centre (18, 17), each rolling in one lap
  const hookA = [[2.8, 36], [2.8, 2.8], [17.2, 2.8], [17.2, 15.2], [9.2, 15.2], [9.2, 9.2]]
  const hookB = hookA.map(([x, y]) => [36 - x, 34 - y])
  E.ribbons.push({ pts: roundCorners(hookA, r), w })
  E.ribbons.push({ pts: roundCorners(hookB, r), w })
  // heads in the two bays (top-left and bottom-right), facing out of the bay
  const bay = (f) => {
    const h = emptyEls()
    h.masses.push(chaikin([[6.2, 20.4], [13.8, 20.2], [15.6, 23.4], [14.6, 28.2], [9.8, 29.6], [6, 28.4], [5.2, 24]], 2))
    h.solids.push({ pts: roundCorners([[14.4, 25.6], [17.6, 26.2], [17.8, 29.4], [15.6, 30.2]], 1.2), w: 2.8 })
    h.solids.push({ pts: [[9.6, 29], [9.6, 31.2]], w: 2.8 })
    h.eyes.push({ c: [9.6, 24.8], r: 2.2 })
    h.lines.push({ pts: roundCorners([[12.6, 22], [13.6, 23.8], [12.2, 25.6]], 0.8), w: 0.55 })
    return mapEls(h, f)
  }
  merge(E, bay(([x, y]) => [x, y]))
  merge(E, bay(([x, y]) => [36 - x, 34 - y]))
  return E
}
const TILE = fieldTile()

export function lowerPanel(kit, { ppmm, seed, height }) {
  const panel = new kit.ReliefPanel({ width: PANEL_W, height, ppmm, seed })
  const [f0, f1] = LAYOUT.field
  const els = emptyEls()
  const TW = 36, TH = 34
  const rowsN = Math.ceil((f1 - f0) / TH)
  for (let j = 0; j < rowsN; j++) {
    const yb = f1 - (j + 1) * TH
    const shift = (j % 2) * TW * 0.5
    for (let i = -1; i * TW < PANEL_W + TW; i++) {
      const xb = 0.4 + i * TW + shift
      const mirror = (i + j) % 2 !== 0
      merge(els, mapEls(TILE, ([x, y]) => [xb + (mirror ? TW - x : x), yb + y]))
    }
  }
  renderEls(panel, els, { height: 1.0, depth: 0.42, groove: 0.55, clip: (ctx) => ctx.rect(1.6, f0, PANEL_W - 3.2, f1 - f0) })
  return panel
}
