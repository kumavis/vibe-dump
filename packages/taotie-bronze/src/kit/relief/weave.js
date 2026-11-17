// STATUS: first pass — the woven interlace 蟠螭文 of Spring and Autumn bells, as a unit cell + tiling rule.
//
// Read off the Nezu bo 90120 at full resolution (reference/nezu-bo/photo-18 / 19, the developed faces/dev-*.jpg;
// drawings in KIT.md § Woven interlace): every body is a flat raised RIBBON cut lengthwise into n equal RIBS (three on
// the bo: rib ≈ 1.7 mm, groove ≈ 0.55 mm, ribbon ≈ 6.2 mm, ≈ 1.1 mm proud), the ribs dark metal and the grooves and
// the ground packed with pale earth. Ribbons run in G-frames, S-links and interlocked rings; where two cross, the upper
// one runs on unbroken and the lower one is CUT, with a narrow shadow gap each side (a real over-under, alternating
// along a ring). The creatures' heads are SOLID masses (no ribs) with a ringed eye, a crest stalk, a curled snout, a
// neck stalk with a knob and an ear hook. The ground is plain.
//
//   renderWeave(panel, els, opts)               raise / cut / rib a list of elements (any frame already in panel mm)
//   weaveCell(unit, L, T, params) → els         one unit cell, local mm, origin bottom-left, y up
//   weaveTile(rect, opts) → { els, cells }      lay cells over a rect: repeat / mirror / flip / rotate per axis,
//                                               half-drop, whole repeats round a closed band (`wrap`), ports linked
//   weaveFill(panel, rect, opts) → { cells, ms }    weaveTile + clip to the rect + renderWeave
//   mapEls(els, f)  mergeEls(a, b)  emptyEls()  ribbonWidth(ribs, rib, groove)  WEAVE_UNITS  WEAVE_PRESETS
//
// Elements: { ribbons: [{ pts, w, z, ribs?, group? }], solids: [{ pts, w, z, group? }], masses: [{ pts, z }],
//             knobs: [{ c, r, z }], eyes: [{ c, r, line }], lines: [{ pts, w }] }
// z: the layer (0 lowest). Ribbons and solids of a higher layer cut every lower stroke they cross (only around the
// crossing: a window as long as the lower ribbon is wide). Elements of one `group` never cut each other (the two
// halves of one ring). Cost: per layer one raise, one clamp (if it crosses anything) and one sink + one raise per
// pair of grooves (n = 3: one), plus one sink for all eyes and lines.

import { PROFILES } from './panel.js'

export const WEAVE_DEFAULTS = { ribs: 3, rib: 1.7, groove: 0.55, height: 1.1, depth: 0.45, gap: 0.55, shoulder: 0.4 }

/** a ribbon's full width from its rib count, rib width and groove width (mm) */
export const ribbonWidth = (ribs = 3, rib = 1.7, groove = 0.55) => ribs * rib + (ribs - 1) * groove

// ------------------------------------------------------------------ element lists

export const emptyEls = () => ({ ribbons: [], solids: [], masses: [], knobs: [], eyes: [], lines: [] })
export function mergeEls(a, b) { for (const k of Object.keys(a)) if (b[k]) a[k].push(...b[k]); return a }
/** map every point of an element list (f: [x, y] → [x, y]); widths and radii stay in mm */
export function mapEls(els, f) {
  const m = (pts) => pts.map(f)
  return {
    ribbons: els.ribbons.map((r) => ({ ...r, pts: m(r.pts) })),
    solids: els.solids.map((r) => ({ ...r, pts: m(r.pts) })),
    masses: els.masses.map((r) => ({ ...r, pts: m(r.pts) })),
    knobs: els.knobs.map((e) => ({ ...e, c: f(e.c) })),
    eyes: els.eyes.map((e) => ({ ...e, c: f(e.c) })),
    lines: els.lines.map((r) => ({ ...r, pts: m(r.pts) })),
  }
}
let GROUP = 0
const newGroup = () => ++GROUP

// ------------------------------------------------------------------ path helpers

/** rounded-corner polyline: each interior corner replaced by a quadratic arc of radius r (number | per vertex) */
export function roundCorners(pts, r) {
  if (pts.length < 3 || !r) return pts
  const out = [pts[0]]
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1]
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1])
    const rr = Math.min(Array.isArray(r) ? r[i] ?? 0 : r, l1 * 0.5, l2 * 0.5)
    if (!(rr > 0.05)) { out.push(b); continue }
    const p = [b[0] + ((a[0] - b[0]) / l1) * rr, b[1] + ((a[1] - b[1]) / l1) * rr]
    const q = [b[0] + ((c[0] - b[0]) / l2) * rr, b[1] + ((c[1] - b[1]) / l2) * rr]
    for (let k = 0; k <= 8; k++) {
      const t = k / 8, s = 1 - t
      out.push([s * s * p[0] + 2 * s * t * b[0] + t * t * q[0], s * s * p[1] + 2 * s * t * b[1] + t * t * q[1]])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}
/** arc / curl centre line: radius r0 → r1 from angle a0 (deg) over `turns` (+ anticlockwise) */
export function curlPts(c, r0, r1, a0, turns, n = 48) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, a = ((a0 + t * turns * 360) * Math.PI) / 180, r = r0 + (r1 - r0) * t
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]
  })
}
/** cubic Bézier, sampled */
export function bezier(p0, p1, p2, p3, n = 24) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, s = 1 - t
    return [0, 1].map((k) => s * s * s * p0[k] + 3 * s * s * t * p1[k] + 3 * s * t * t * p2[k] + t * t * t * p3[k])
  })
}
function pathPts(ctx, pts, closed) {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}
const bboxOf = (pts, pad) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad]
}

/** crossings of two polylines: [{ p, i (segment of a), t, dir: unit tangent of a, sin (angle) }] */
function crossings(a, b) {
  const out = []
  for (let i = 0; i < a.length - 1; i++) {
    const p = a[i], q = a[i + 1]
    const rx = q[0] - p[0], ry = q[1] - p[1]
    for (let j = 0; j < b.length - 1; j++) {
      const u = b[j], v = b[j + 1]
      const sx = v[0] - u[0], sy = v[1] - u[1]
      const den = rx * sy - ry * sx
      if (Math.abs(den) < 1e-12) continue
      const t = ((u[0] - p[0]) * sy - (u[1] - p[1]) * sx) / den
      const s = ((u[0] - p[0]) * ry - (u[1] - p[1]) * rx) / den
      if (t < 0 || t > 1 || s < 0 || s > 1) continue
      const la = Math.hypot(rx, ry) || 1, lb = Math.hypot(sx, sy) || 1
      out.push({ p: [p[0] + rx * t, p[1] + ry * t], i, t, dir: [rx / la, ry / la], sin: Math.abs(den) / (la * lb) })
    }
  }
  return out
}
/** the stretch of polyline `pts` within arc length ±half of the point at segment i, parameter t */
function windowAround(pts, i, t, half) {
  const cum = [0]
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  const s0 = cum[i] + t * (cum[i + 1] - cum[i])
  const at = (s) => {
    s = Math.max(0, Math.min(cum[cum.length - 1], s))
    let k = 0
    while (k < cum.length - 2 && cum[k + 1] < s) k++
    const f = (s - cum[k]) / (cum[k + 1] - cum[k] || 1)
    return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]
  }
  const out = [at(s0 - half)]
  for (let k = 0; k < pts.length; k++) if (cum[k] > s0 - half && cum[k] < s0 + half) out.push(pts[k])
  out.push(at(s0 + half))
  return out
}

// ------------------------------------------------------------------ the renderer

/**
 * @param {import('./panel.js').ReliefPanel} panel
 * @param els element list in panel mm
 * @param o { height 1.1, depth 0.45 (groove depth), groove 0.55 (mm), ribs 3, gap 0.55 (shadow gap at a crossing, mm),
 *   shoulder 0.4, clip: (ctx) => path (limits all drawing), eyeDepth (× depth, 1.1) }
 */
export function renderWeave(panel, els, o = {}) {
  const t0 = performance.now()
  const P = { ...WEAVE_DEFAULTS, ...o }
  const h = P.height, d = P.depth, g = P.groove, gap = P.gap
  const clip = P.clip
  const withClip = (fn) => (ctx) => { ctx.save(); if (clip) { ctx.beginPath(); clip(ctx); ctx.clip() } ctx.lineCap = 'round'; ctx.lineJoin = 'round'; fn(ctx); ctx.restore() }
  const strokes = [...els.ribbons.map((r) => ({ ...r, kind: 'ribbon' })), ...els.solids.map((r) => ({ ...r, kind: 'solid' }))]
  for (const s of strokes) { s.z = s.z ?? (s.kind === 'ribbon' ? 0 : 1); s.bb = bboxOf(s.pts, s.w / 2) }
  const zs = [...new Set([...strokes.map((s) => s.z), ...els.masses.map((m) => m.z ?? 1), ...els.knobs.map((k) => k.z ?? 1)])].sort((a, b) => a - b)
  let cuts = 0
  for (const z of zs) {
    const layer = strokes.filter((s) => s.z === z)
    // 1. the over-under: where a stroke of this layer crosses a lower one, clear a window of it to the ground (its own
    //    width + a shadow gap each side, as long as the lower ribbon is wide at that angle)
    const wins = []
    for (const up of layer) {
      for (const lo of strokes) {
        if (lo.z >= z || (up.group && up.group === lo.group)) continue
        if (up.bb[0] > lo.bb[2] || lo.bb[0] > up.bb[2] || up.bb[1] > lo.bb[3] || lo.bb[1] > up.bb[3]) continue
        for (const x of crossings(up.pts, lo.pts)) {
          // two ribbons that only MEET end to end (a link joining a frame) do not cross
          const near = (pts) => Math.min(Math.hypot(pts[0][0] - x.p[0], pts[0][1] - x.p[1]), Math.hypot(pts[pts.length - 1][0] - x.p[0], pts[pts.length - 1][1] - x.p[1])) < 0.8
          if (near(up.pts) && near(lo.pts)) continue
          const half = (lo.w / 2 + gap + 0.2) / Math.max(0.35, x.sin)
          wins.push({ pts: windowAround(up.pts, x.i, x.t, half), w: up.w + 2 * gap })
        }
      }
    }
    if (wins.length) {
      cuts += wins.length
      panel._apply(withClip((ctx) => {
        ctx.lineCap = 'butt'
        for (const wv of wins) { ctx.lineWidth = wv.w; ctx.beginPath(); pathPts(ctx, wv.pts); ctx.stroke() }
      }), 'plateau', gap * 0.6, 0.3, (i, p) => {
        const lim = (1 - p) * h
        if (panel.field[i] > lim) panel.field[i] = lim
      }, PROFILES.plateau)
    }
    // 2. raise everything of this layer
    const masses = els.masses.filter((m) => (m.z ?? 1) === z), knobs = els.knobs.filter((k) => (k.z ?? 1) === z)
    panel.raise(withClip((ctx) => {
      for (const s of layer) { ctx.lineWidth = s.w; ctx.beginPath(); pathPts(ctx, s.pts, s.closed); ctx.stroke() }
      ctx.beginPath()
      for (const m of masses) pathPts(ctx, m.pts, true)
      for (const k of knobs) { ctx.moveTo(k.c[0] + k.r, k.c[1]); ctx.arc(k.c[0], k.c[1], k.r, 0, Math.PI * 2) }
      ctx.fill()
    }), { height: h, shoulder: P.shoulder })
    // 3. the ribs: n ribs = n − 1 grooves, cut as nested strokes from the outside in (sink a band, raise its middle back)
    const rbs = layer.filter((s) => s.kind === 'ribbon')
    if (rbs.length) {
      for (let k = 1; ; k++) {
        const S = (r) => { const n = r.ribs ?? P.ribs, rib = (r.w - (n - 1) * g) / n; return r.w - 2 * k * rib - 2 * (k - 1) * g }
        const live = rbs.filter((r) => S(r) > 0.05 && (r.ribs ?? P.ribs) > 1)
        if (!live.length) break
        panel.sink(withClip((ctx) => { for (const r of live) { ctx.lineWidth = S(r); ctx.beginPath(); pathPts(ctx, r.pts, r.closed); ctx.stroke() } }), { depth: d, shoulder: Math.min(0.22, g * 0.4), profile: 'u' })
        const back = live.filter((r) => S(r) - 2 * g > 0.05)
        if (!back.length) break
        panel.raise(withClip((ctx) => { for (const r of back) { ctx.lineWidth = S(r) - 2 * g; ctx.beginPath(); pathPts(ctx, r.pts, r.closed); ctx.stroke() } }), { height: h, shoulder: 0.18 })
      }
    }
  }
  // 4. ringed eyes and incised lines on the heads
  if (els.eyes.length || els.lines.length) {
    panel.sink(withClip((ctx) => {
      for (const e of els.eyes) { ctx.lineWidth = e.line ?? 0.75; ctx.beginPath(); ctx.arc(e.c[0], e.c[1], e.r, 0, Math.PI * 2); ctx.stroke() }
      for (const l of els.lines) { ctx.lineWidth = l.w ?? 0.6; ctx.beginPath(); pathPts(ctx, l.pts, l.closed); ctx.stroke() }
    }), { depth: d * (P.eyeDepth ?? 1.1), shoulder: 0.22, profile: 'u' })
  }
  return { cuts, ms: performance.now() - t0 }
}

// ------------------------------------------------------------------ the units (local mm, origin bottom-left, y up)

/**
 * The head of the panchi dragon, a PROFILE head authored in a 30 × 20 box, snout to the LEFT (traced on the bo's
 * developed band, faces/dev-band.jpg: a solid mass with a ringed eye, the snout rolled up and back into a fat C, an ear
 * curl at the back, a crest stalk rising (or a hook turning back over the head), a neck stalk with a knob dropping).
 * crest: 'stalk' (runs on `crestLen` mm above the box) | 'hook'
 */
export function dragonHead({ crest = 'stalk', crestLen = 12, neckLen = 9, z = 1 } = {}) {
  const E = emptyEls()
  E.masses.push({ z, pts: roundCorners([[7, 4.2], [15, 3], [24, 3.4], [29, 7], [29.4, 13.6], [25.4, 18.6], [16, 19.6], [9.6, 18.4], [6.4, 15], [5, 9.6], [7, 4.2]], 2.4) })
  E.solids.push({ z, pts: roundCorners([[9.6, 17.2], [2.2, 17.4], [1.4, 9.4], [6.4, 6.2], [9.4, 8.6], [7.8, 11.6]], [0, 3.6, 3.4, 2.4, 1.6, 0]), w: 3.8 })
  E.solids.push({ z, pts: roundCorners([[24.6, 9], [29.4, 9.4], [30.4, 14.4], [27, 15.8], [25.6, 13.2]], [0, 2, 2, 1.4, 0]), w: 2.8 })
  if (crest === 'hook') E.solids.push({ z, pts: roundCorners([[16.6, 18], [16.6, 24.6], [25.4, 24.6], [25.4, 21.4]], 1.8), w: 3.6 })
  else { E.solids.push({ z, pts: [[16.6, 18], [16.6, 20 + crestLen]], w: 3.8 }); E.knobs.push({ z, c: [11.8, 23.2], r: 2.2 }) }
  E.solids.push({ z, pts: [[10.6, 6], [10.6, -neckLen]], w: 3.6 })
  E.knobs.push({ z, c: [10.6, 1.0], r: 2.5 })
  E.eyes.push({ c: [16.8, 11.6], r: 2.6, line: 0.85 })
  E.lines.push({ pts: curlPts([21.6, 7.2], 2.8, 0.6, 180, -1.1, 24), w: 0.7 })
  E.lines.push({ pts: roundCorners([[3.6, 15.4], [3.6, 10.6], [6.4, 9.4]], 1.6), w: 0.6 })
  return E
}

/**
 * dragon — a head in a G-frame: the body ribbon runs round the cell (down the far side, along the bottom, up the near
 * side and back along the top toward the crest), `nest` narrower ribbons nested inside it along the bottom and one side
 * ending in hooks, the head in the upper middle. The crest stalk rises through the frame's top: through its opening
 * (`closed: false`) or OVER it (`closed: true`: the frame runs on and is cut); the neck stalk drops over the nested
 * ribbons. Ports (column links): a = top-right corner, b = bottom-left (link mode: where the nested ribbon leaves).
 * p: { w (ribbon mm), nest 0–2, head (scale 0.4–1.3), crest 'stalk'|'hook', closed, headX, headY (fractions) }
 */
function dragon(L, T, p) {
  const w = p.w, E = emptyEls()
  const h = w / 2 + 0.3, r = Math.min(4.8, w * 0.75), top = T - h
  const g0 = p.closed ? 0.3 : 0.4, g1 = p.closed ? 0.3 : 0.6
  const hook = Math.min(4.2, T * 0.13)
  // link mode (a column of cells): the frame comes in at the top-right corner from the cell above and the innermost
  // nested ribbon leaves through the bottom-left, passing OVER the frame's bottom, into the S-link to the cell below
  const frame = p.link
    ? [[L - h, T + 1], [L - h, h], [h, h], [h, top], [g0 * L, top], [g0 * L, top - hook]]
    : [[g0 * L, top - hook], [g0 * L, top], [h, top], [h, h], [L - h, h], [L - h, top], [g1 * L, top], [g1 * L, top - hook]]
  const fr = frame.map((_, i) => (i === 0 || i === frame.length - 1 ? 0 : i >= frame.length - 2 ? 1.6 : r))
  E.ribbons.push({ pts: roundCorners(frame, fr), w, z: 0 })
  let inner = h + w / 2, out = null
  const nest = Math.max(p.link ? 1 : 0, p.nest ?? 1)
  for (let k = 0; k < nest; k++) {
    const wk = p.link ? w : w * (k ? 0.75 : 0.85), dk = inner + 0.8 + wk / 2
    inner = dk + wk / 2
    const yTop = Math.min(T - dk - 1, (0.58 - 0.08 * k) * T)
    if (yTop < dk + 2) break
    if (p.link && k === nest - 1) {
      E.ribbons.push({ pts: roundCorners([[L - dk - 5.4, yTop - 1.8], [L - dk - 4, yTop + 1.2], [L - dk, yTop], [L - dk, dk], [dk, dk], [dk, -1.5]], [0, 1.6, 2.2, r * 0.8, r * 0.8, 0]), w: wk, z: 1 })
      out = [dk, -1.5]
    } else {
      E.ribbons.push({ pts: roundCorners([[dk, 0.48 * T - 2 * k], [dk, dk], [L - dk, dk], [L - dk, yTop], [L - dk - 4, yTop + 1.2], [L - dk - 5.4, yTop - 1.8]], [0, r * 0.8, r * 0.8, 2.2, 1.6, 0]), w: wk, z: 0 })
    }
  }
  // the head: scaled into the cell's upper middle, the crest up to (or past) the frame's top
  const hs = p.head ?? 1
  const sx = (0.58 * L * hs) / 30, sy = (0.56 * T * hs) / 20
  const ox = (p.headX ?? 0.2) * L + 0.58 * L * (1 - hs) * 0.5, oy = (p.headY ?? 0.22) * T + 0.56 * T * (1 - hs) * 0.6
  const crestLen = (T + 1.2 - (oy + 20 * sy)) / sy
  const neckLen = Math.max(2, (oy - h + w / 2 - 1) / sy)
  mergeEls(E, mapEls(dragonHead({ crest: p.crest ?? 'stalk', crestLen, neckLen, z: p.link ? 2 : 1 }), ([x, y]) => [ox + x * sx, oy + y * sy]))
  E.ports = { a: [L - h, T + 1], b: out ?? [h, -1] }
  return E
}

/**
 * scroll — a big round curl: the ribbon comes in down the near side and rolls ≈ 1.15 turns inward; a second ribbon
 * (two: true) comes up the far side and winds into the same eye (a two-start spiral), a solid knob in the eye.
 */
function scroll(L, T, p) {
  const w = p.w, E = emptyEls()
  const R = Math.min(L, T) / 2 - w / 2 - 0.4
  const c = [L / 2, T / 2]
  const a = [[w / 2 + 0.3, T + 1], [w / 2 + 0.3, T / 2 + R * 0.2], ...curlPts(c, R, R * 0.3, 180, -1.05, 64)]
  E.ribbons.push({ pts: roundCorners(a.slice(0, 3), 3).concat(a.slice(3)), w, z: 0 })
  if (p.two) {
    const b = a.map(([x, y]) => [L - x, T - y])
    E.ribbons.push({ pts: roundCorners(b.slice(0, 3), 3).concat(b.slice(3)), w, z: 0 })
  }
  E.knobs.push({ c: [c[0] + R * 0.12, c[1] - R * 0.06], r: Math.max(1.6, R * 0.22), z: 1 })
  E.ports = { a: [w / 2 + 0.3, T + 1], b: [L - w / 2 - 0.3, -1] }
  return E
}

/**
 * ring — the O of the bo's bands: two bodies crossing, a pointed oval of two arcs each running on past the crossings;
 * at the top crossing one is over, at the bottom the other (a true over-under).
 */
function ring(L, T, p) {
  const w = p.w, E = emptyEls()
  const mid = T / 2, a = T / 2 - w / 2 - 0.4, half = Math.min(L / 2 - w / 2 - 0.3, p.half ?? L * 0.42)
  const c = (a * a - half * half) / (2 * half), R = half + c
  for (const sgn of [-1, 1]) {
    const cc = [L / 2 - sgn * c, mid], th = Math.atan2(a, c) * 1.22
    const pts = []
    for (let i = 0; i <= 48; i++) {
      const t = -th + (2 * th * i) / 48
      const ang = sgn < 0 ? Math.PI - t : t
      pts.push([cc[0] + R * Math.cos(ang), cc[1] + R * Math.sin(ang)])
    }
    const g = newGroup(), m = 24
    // the halves: the left arc over at the top, the right arc over at the bottom
    const up = sgn < 0 ? pts.slice(m) : pts.slice(0, m + 1)
    const dn = sgn < 0 ? pts.slice(0, m + 1) : pts.slice(m)
    E.ribbons.push({ pts: up, w, z: sgn < 0 ? 1 : 0, group: g }, { pts: dn, w, z: sgn < 0 ? 0 : 1, group: g })
  }
  return E
}

/**
 * chain — one site of the bo's top band: two C-rings interlocked (crossing twice, over at one crossing, under at the
 * other), the left ring fed along the TOP edge from the left, the right ring leaving along the BOTTOM edge to the
 * right; a squared hook rises in each empty corner. Tile with flip-alternate (x: 'flip'): the ribbons then run
 * top / bottom by turns and every ribbon is an S-link from one site to the next.
 */
function chain(L, T, p) {
  const w = p.w, E = emptyEls()
  const R = Math.max(w * 0.6, (T - w) / 2 - 0.35), e = (p.overlap ?? 0.58) * R
  const ym = T / 2, c1 = [L / 2 - e, ym], c2 = [L / 2 + e, ym]
  const sweep = p.sweep ?? 290
  const ringPts = (c, from) => [[from, ym + R], [c[0], ym + R], ...curlPts(c, R, R * 0.82, 90, -sweep / 360, 56).slice(1)]
  const g1 = newGroup(), g2 = newGroup()
  const A = ringPts(c1, -1.5)
  // split where the ring passes angle 0 (between its two crossings)
  const k0 = 2 + Math.round((90 / sweep) * 56)
  E.ribbons.push({ pts: A.slice(0, k0 + 1), w, z: 1, group: g1 }, { pts: A.slice(k0), w, z: 0, group: g1 })
  const B = A.map(([x, y]) => [L - x, T - y]) // the point reflection of A about the site centre
  E.ribbons.push({ pts: B.slice(0, k0 + 1), w, z: 1, group: g2 }, { pts: B.slice(k0), w, z: 0, group: g2 })
  // squared hooks in the two empty corners (bottom-left beside the left ring, top-right beside the right ring)
  const hx = Math.max(w / 2 + 0.3, c1[0] - R - w - 0.6)
  if (hx > w * 0.8) {
    const H = [[-1.5, w / 2 + 0.3], [hx, w / 2 + 0.3], [hx, ym + 0.6], [hx - Math.min(3.2, hx - 1), ym + 0.6]]
    E.ribbons.push({ pts: roundCorners(H, [0, 2.2, 1.4, 0]), w: w * (p.hookW ?? 0.85), z: 0 })
    E.ribbons.push({ pts: roundCorners(H.map(([x, y]) => [L - x, T - y]), [0, 2.2, 1.4, 0]), w: w * (p.hookW ?? 0.85), z: 0 })
  }
  return E
}

/** link — an S-link ribbon between two ports (the column tiler calls it; exported for hand layouts) */
export function sLink(a, b, w, z = 0) {
  const dy = Math.abs(a[1] - b[1]) * 0.65
  const down = a[1] > b[1] ? -1 : 1
  return { pts: bezier(a, [a[0], a[1] + down * dy], [b[0], b[1] - down * dy], b, 28), w, z }
}

export const WEAVE_UNITS = { dragon, scroll, ring, chain }

/** one unit cell, local mm (origin bottom-left, y up). params.w = ribbon width (mm) */
export function weaveCell(unit, L, T, params = {}) {
  const f = typeof unit === 'function' ? unit : WEAVE_UNITS[unit]
  if (!f) throw new Error(`weaveCell: unknown unit "${unit}" (have ${Object.keys(WEAVE_UNITS).join(', ')})`)
  const E = f(L, T, params)
  if (params.face < 0) return withPorts(E, ([x, y]) => [L - x, y]) // snout to the right
  return E
}
function withPorts(E, f) {
  const out = mapEls(E, f)
  if (E.ports) out.ports = { a: f(E.ports.a), b: f(E.ports.b) }
  return out
}

// ------------------------------------------------------------------ tiling

/**
 * Lay unit cells over a rect (panel mm). Cells run left → right (x) and TOP → bottom (y).
 * opts: { unit | sequence: [{ unit, h (weight), params }] (a column of different cells, top → bottom),
 *   cell: [w, h] (mm), count: [nx, ny] (default: as many as fit, rounded), wrap: mm (the closed band's length:
 *   nx = round(wrap / w), the pitch adjusted so it closes; the rect is then a window onto it starting at `phase`),
 *   tiling: { x: 'repeat'|'mirror'|'flip'|'rotate', y: … } (the transform applied to every second cell), shift: half-drop
 *   (fraction of w per row), phase (mm), gapY (mm between rows; links), links: true (S-links between the ports of
 *   cells one above the other), row0 (parity offset of the first row), params (unit params; w = ribbon width),
 *   map: ([x, y]) → panel (after tiling) }
 * → { els, cells: [{ x, y, w, h, i, j, flip }] }
 */
export function weaveTile(rect, o = {}) {
  const tx = o.tiling?.x ?? 'repeat', ty = o.tiling?.y ?? 'repeat'
  const params = { w: ribbonWidth(o.ribs ?? WEAVE_DEFAULTS.ribs, o.rib ?? WEAVE_DEFAULTS.rib, o.groove ?? WEAVE_DEFAULTS.groove), ...(o.params || {}) }
  const out = emptyEls(), cells = []
  const seq = o.sequence
  let cw = o.cell?.[0] ?? 40
  let nx
  // round a closed band: a whole number of cells (an even one when every second cell is turned, or the turn breaks)
  if (o.wrap) { nx = tx === 'repeat' ? Math.max(1, Math.round(o.wrap / cw)) : 2 * Math.max(1, Math.round(o.wrap / cw / 2)); cw = o.wrap / nx }
  else nx = o.count?.[0] ?? Math.max(1, Math.round(rect.w / cw))
  if (!o.wrap && !o.cell) cw = rect.w / nx
  const gapY = o.gapY ?? 0
  // rows: a sequence of weighted heights, or equal rows of cell[1]
  let rows
  if (seq) {
    const tot = seq.reduce((s, r) => s + (r.h ?? 1), 0), avail = rect.h - gapY * (seq.length - 1)
    rows = seq.map((r) => ({ ...r, hh: (avail * (r.h ?? 1)) / tot }))
  } else {
    const ny = o.count?.[1] ?? Math.max(1, Math.round((rect.h + gapY) / ((o.cell?.[1] ?? rect.h) + gapY)))
    const hh = (rect.h - gapY * (ny - 1)) / ny
    rows = Array.from({ length: ny }, () => ({ hh }))
  }
  const first = o.wrap ? Math.floor((o.phase ?? 0) / cw) - 1 : 0
  const last = o.wrap ? Math.ceil(((o.phase ?? 0) + rect.w) / cw) + 1 : nx
  let yTop = rect.y + rect.h
  const portsByCol = new Map()
  rows.forEach((row, j) => {
    const yb = yTop - row.hh
    for (let i = first; i < last; i++) {
      const iw = ((i % nx) + nx) % nx // the impression index (repeats round a closed band)
      const jj = j + (o.row0 ?? 0) // row parity (a band drawn in pieces keeps its alternation)
      const x0 = rect.x + i * cw - (o.wrap ? o.phase ?? 0 : 0) + (jj % 2 ? (o.shift ?? 0) * cw : 0)
      const unit = row.unit ?? o.unit
      let E = weaveCell(unit, cw, row.hh, { ...params, ...(row.params || {}) })
      const alt = (kind, odd) => {
        if (!odd || kind === 'repeat') return
        const f = kind === 'mirror' ? ([x, y]) => [cw - x, y] : kind === 'flip' ? ([x, y]) => [x, row.hh - y] : ([x, y]) => [cw - x, row.hh - y]
        E = withPorts(E, f)
      }
      alt(tx, iw % 2 === 1)
      alt(ty, jj % 2 === 1)
      const place = ([x, y]) => [x0 + x, yb + y]
      E = withPorts(E, place)
      if (o.links && E.ports) {
        const prev = portsByCol.get(i)
        const [hi, lo] = E.ports.a[1] > E.ports.b[1] ? [E.ports.a, E.ports.b] : [E.ports.b, E.ports.a]
        if (prev) out.ribbons.push(sLink(prev, hi, params.w))
        portsByCol.set(i, lo)
      }
      mergeEls(out, E)
      cells.push({ x: x0, y: yb, w: cw, h: row.hh, i: iw, j })
    }
    yTop = yb - gapY
  })
  const els = o.map ? mapEls(out, o.map) : out
  return { els, cells, pitch: cw, count: nx }
}

/** weaveTile + render, clipped to the rect (or opts.clip). → { cells, pitch, count, ms } */
export function weaveFill(panel, rect, o = {}) {
  const t0 = performance.now()
  const T = weaveTile(rect, o)
  const clip = o.clip ?? ((ctx) => ctx.rect(rect.x, rect.y, rect.w, rect.h))
  const R = {}
  for (const k of ['ribs', 'groove', 'height', 'depth', 'gap', 'shoulder']) if (o[k] != null) R[k] = o[k]
  renderWeave(panel, T.els, { ...R, ...o.render, clip })
  return { cells: T.cells, pitch: T.pitch, count: T.count, ms: performance.now() - t0 }
}

// ------------------------------------------------------------------ presets: the zones of the Nezu bo 90120

/**
 * Each preset = { unit | sequence, cell, tiling, … } for weaveTile, its ribbon and render params, and the panel it
 * was matched at (plaque, mm). All read off reference/nezu-bo (unit-cell drawings: .work/bo-fix/weave-unit-*.png,
 * reproduced in KIT.md § Woven interlace).
 */
export const WEAVE_PRESETS = {
  // the band round the top: interlocked C-rings, a site every ≈ 39–42 mm (two rings ≈ 20 mm; round the bo: 12 sites of
  // 38.5 mm per face — an even number, as the flip needs), flipped by turns so the
  // links run top and bottom alternately; 3 ribs, ribbon ≈ 5.2 mm (the top band's ribbons are a little narrower)
  'bo-top-band': { unit: 'chain', cell: [40, 17], tiling: { x: 'flip' }, ribs: 3, rib: 1.4, groove: 0.5, plaque: { w: 168, h: 21 } },
  // the panel down the centre: one column of cells ≈ 27 mm wide — a big scroll on top, four dragons, a scroll, two
  // dragons — every second cell turned 180°, S-links between; the two columns are the same column REPEATED (not mirrored)
  'bo-centre-panel': {
    sequence: [{ unit: 'scroll', h: 0.62 }, { unit: 'dragon' }, { unit: 'dragon' }, { unit: 'dragon' }, { unit: 'dragon' }, { unit: 'scroll', h: 0.62, params: { two: true } }, { unit: 'dragon' }, { unit: 'dragon' }],
    cell: [27], tiling: { y: 'rotate' }, gapY: 6.5, links: true, params: { link: true, nest: 1, head: 1.15, headX: 0.1 }, ribs: 3, rib: 1.7, groove: 0.55, plaque: { w: 56, h: 262 },
  },
  // the strips between the boss rows: dragons in G-frames ≈ 35 × 34 mm facing the centre, the crest over the frame
  'bo-band': { unit: 'dragon', cell: [40, 34], tiling: { x: 'mirror' }, params: { nest: 1, head: 1.2, closed: false }, ribs: 3, rib: 1.75, groove: 0.6, plaque: { w: 160, h: 35 } },
  // the field: dragons in G-frames, cells 62 × 31.6 mm, the crest hooked back over the head (no stalk: the rows' stalks
  // would line up into spines the bronze does not have), rows flipped by turns, a straight repeat round the bell
  'bo-field': { unit: 'dragon', cell: [62, 31.6], tiling: { y: 'flip' }, params: { nest: 1, head: 0.92, headX: 0.16, closed: true, crest: 'hook' }, ribs: 3, rib: 1.6, groove: 0.55, plaque: { w: 186, h: 63 } },
  // the band round the base = the field's lowest row, worn almost flat on the bronze: lower and softer
  'bo-base-band': { unit: 'dragon', cell: [62, 31.6], tiling: { y: 'flip' }, params: { nest: 1, head: 0.92, headX: 0.16, closed: true, crest: 'hook' }, ribs: 3, rib: 1.6, groove: 0.55, height: 0.55, depth: 0.28, shoulder: 0.5, plaque: { w: 186, h: 32 } },
}
