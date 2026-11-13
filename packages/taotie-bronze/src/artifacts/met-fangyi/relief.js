// met-fangyi — the relief engine for this one vessel's décor.
//
// The Met fangyi's décor is a "dissolved" Style V mask: every component is a
// separate flat-topped island on a sea of very fine squared leiwen, each island
// carrying its own outline groove, a squared spiral where its band curls in,
// and round spirals packed on what is left of its top. The kit's taotie and kui
// generators draw continuous bands; this file places the islands by hand, the
// way the close-up photographs show them, using only kit primitives
// (ReliefPanel.raise/sink, leiwenFill, leiwenFillMask, shapes.fillet/Turtle).
//
// Authoring space (a "sheet"): u = mm OUTWARD from the face's centre line
// (the centre flange), v = mm UP inside the register. A sheet is drawn on the
// LEFT half of a panel (x = xc − u) and the panel is mirrored, exactly as the
// mould carver worked to a centre line.
//
// Relief levels. The plain bands (rim border, separators, foot border, the
// frame round every field) are flush with the plateau tops (dossier §c): so
// everything is drawn with the ground at 0 and plateaus at L1, then the whole
// field is shifted down by L1. Plain bands and panel edges end up at 0 (the
// wall surface): panels can be cut anywhere on a plain band and stay seamless.

export const L1 = 1.4 // plateau (motif) height above the leiwen ground, mm (dossier: 1.2 ± 0.3)

export const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]

function signedArea(p) {
  let a = 0
  for (let i = 0; i < p.length; i++) {
    const q = p[i], r = p[(i + 1) % p.length]
    a += q[0] * r[1] - r[0] * q[1]
  }
  return a / 2
}

/** Inward miter offset of a closed polygon (either winding) by d mm. */
export function offsetPoly(pts, d) {
  const s = Math.sign(signedArea(pts)) || 1
  const n = pts.length
  const en = []
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[(k + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    en.push(s > 0 ? [-dy / l, dx / l] : [dy / l, -dx / l])
  }
  return pts.map((p, k) => {
    const a = en[(k - 1 + n) % n], b = en[k]
    let mx = a[0] + b[0], my = a[1] + b[1]
    const ml = Math.hypot(mx, my)
    if (ml < 1e-6) { mx = b[0]; my = b[1] } else { mx /= ml; my /= ml }
    const c = Math.max(0.3, mx * b[0] + my * b[1])
    return [p[0] + (mx * d) / c, p[1] + (my * d) / c]
  })
}

function bbox(pts) {
  let u0 = Infinity, v0 = Infinity, u1 = -Infinity, v1 = -Infinity
  for (const [u, v] of pts) {
    u0 = Math.min(u0, u); v0 = Math.min(v0, v); u1 = Math.max(u1, u); v1 = Math.max(v1, v)
  }
  return { u0, v0, u1, v1 }
}

const pathPoly = (ctx, pts, closed = true) => {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}

/**
 * A sheet: islands (plateaus with grooves), bosses, fields (where leiwen goes).
 * Island: { pts, r (number | per-vertex array), rim (mm inset of the outline groove, 0 = none),
 *           spiral: { at: [u, v], heading (deg, 0 = +u), lead, dir (+1 left), size: [a, b], pitch, turns, r },
 *           ticks: { sides: 'tbo', step, from }   transverse cuts across the rim band
 *           lines: [[u, v]…]…  extra grooves,  carve (default true): round spirals packed on the top }
 * Boss: { c: [u, v], w, h, r, height, slit: [len, width] | null, ring: bool (groove round its foot) }
 */
export class Sheet {
  constructor() {
    this.islands = []
    this.bosses = []
    this.fields = [] // polygons (u, v) where the ground is leiwen
  }
  island(o) {
    this.islands.push({ r: 2, rim: 0, carve: true, ...o })
    return this
  }
  boss(o) {
    this.bosses.push({ r: 2, height: 3, slit: null, ring: false, ...o })
    return this
  }
  field(pts) {
    this.fields.push(pts)
    return this
  }
  /** apply f([u, v]) → [u, v] to every coordinate (affine re-fits, inversion for the lid) */
  map(f, { keepBossSize = true } = {}) {
    const mp = (pts) => pts.map((p) => f(p))
    const S = new Sheet()
    for (const is of this.islands) {
      const o = { ...is, pts: mp(is.pts) }
      if (is.lines) o.lines = is.lines.map(mp)
      if (is.spiral) {
        const a = f(is.spiral.at), b = f([is.spiral.at[0] + Math.cos((is.spiral.heading * Math.PI) / 180), is.spiral.at[1] + Math.sin((is.spiral.heading * Math.PI) / 180)])
        const flip = mirrorSense(f, is.spiral.at)
        const k = Math.sqrt(Math.abs(jacobian(f, is.spiral.at)))
        const kl = Math.hypot(b[0] - a[0], b[1] - a[1])
        o.spiral = {
          ...is.spiral, at: a, heading: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI, dir: is.spiral.dir * flip,
          lead: (is.spiral.lead ?? 0) * kl, size: is.spiral.size.map((x) => x * k), pitch: is.spiral.pitch * Math.min(1.15, Math.max(0.85, k)),
        }
      }
      S.islands.push(o)
    }
    for (const b of this.bosses) {
      const c = f(b.c)
      if (keepBossSize) S.bosses.push({ ...b, c })
      else {
        const e = f([b.c[0] + b.w / 2, b.c[1] + b.h / 2])
        S.bosses.push({ ...b, c, w: 2 * Math.abs(e[0] - c[0]), h: 2 * Math.abs(e[1] - c[1]) })
      }
    }
    S.fields = this.fields.map(mp)
    return S
  }
}

function jacobian(f, p) {
  const o = f(p), a = f([p[0] + 1, p[1]]), b = f([p[0], p[1] + 1])
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
}
function mirrorSense(f, p) {
  return jacobian(f, p) < 0 ? -1 : 1
}

/** Filleted outline of an island in (u, v). */
function outlineUV(kit, is) {
  return kit.shapes.fillet(is.pts, is.r, { closed: true, step: 0.3 })
}

/** Groove polylines of an island in (u, v): rim loop, squared spiral, ticks, extra lines. */
function groovesUV(kit, is) {
  const out = []
  if (is.rim > 0) {
    const inset = offsetPoly(is.pts, is.rim)
    const rr = Array.isArray(is.r) ? is.r.map((x) => Math.max(0.5, x - is.rim)) : Math.max(0.5, is.r - is.rim)
    const loop = kit.shapes.fillet(inset, rr, { closed: true, step: 0.3 })
    out.push({ pts: [...loop, loop[0]], closed: false })
    if (is.ticks) {
      const b = bbox(is.pts)
      const step = is.ticks.step ?? 5
      const sides = is.ticks.sides ?? 't'
      const e = 0.35, f = is.rim - 0.1
      const span = (a, c) => {
        const n = Math.max(1, Math.floor((c - a) / step))
        const pad = (c - a - (n - 1) * step) / 2
        return Array.from({ length: n }, (_, i) => a + pad + i * step)
      }
      if (sides.includes('t')) for (const u of span(b.u0 + is.rim + 2, b.u1 - is.rim - 2)) out.push({ pts: [[u, b.v1 - e], [u, b.v1 - f]] })
      if (sides.includes('b')) for (const u of span(b.u0 + is.rim + 2, b.u1 - is.rim - 2)) out.push({ pts: [[u, b.v0 + e], [u, b.v0 + f]] })
      if (sides.includes('o')) for (const v of span(b.v0 + is.rim + 2, b.v1 - is.rim - 2)) out.push({ pts: [[b.u1 - e, v], [b.u1 - f, v]] })
    }
  }
  if (is.spiral) {
    const s = is.spiral
    const T = new kit.shapes.Turtle(s.at, s.heading)
    if (s.lead) T.fwd(s.lead)
    T.curl({ dir: s.dir, size: s.size, pitch: s.pitch, turns: s.turns, r: s.r ?? 1 })
    out.push({ pts: T.spine(0.3) })
  }
  for (const l of is.lines || []) out.push({ pts: l })
  return out
}

/**
 * Render sheets onto a panel. `halves` = [{ sheet, P }] where P([u, v]) → panel [x, y] (mm).
 * Steps: frame (everything outside the fields) at L1 → islands at L1 → bosses (domes) →
 * grooves and slits → leiwen ground in the fields → spirals on the island tops → mirror → shift by −L1.
 */
export function renderSheets(kit, panel, halves, o = {}) {
  const {
    // ground: nested squared spirals, 4-5 rings per cell, few S-pairs (detail-face-* photographs)
    ground = { pitch: 0.82, line: 0.5, depth: 0.38, roundness: 0.08, jitter: 0.05, cell: [6, 8.8], pairs: 0.2 },
    // plateau cutting: round spirals of ~2 turns, packed square (no elongated pairs)
    carve = { pitch: 0.95, line: 0.42, depth: 0.32, rMax: 2.6, rMin: 0.85, gap: 0.3, margin: 0.4 },
    groove = { width: 0.85, depth: 0.65 },
    halfRect, // the left half (panel mm) — leiwen is packed only there; mirror copies it
    mirror = true,
    seed = 1,
  } = o
  const W = panel.width, H = panel.height
  const mapPts = (P, pts) => pts.map(P)

  // 1. frame: the whole panel minus the fields, at L1
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.rect(-1, -1, W + 2, H + 2)
    for (const { sheet, P } of halves) for (const f of sheet.fields) pathPoly(ctx, mapPts(P, kit.shapes.fillet(f, 0.8, { closed: true, step: 0.3 })))
    ctx.fill('evenodd')
  }, { height: L1, shoulder: 0.35 })

  // 2. islands
  panel.raise((ctx) => {
    for (const { sheet, P } of halves) {
      for (const is of sheet.islands) {
        ctx.beginPath()
        pathPoly(ctx, mapPts(P, outlineUV(kit, is)))
        ctx.fill()
      }
    }
  }, { height: L1, shoulder: 0.42 })

  // 3. bosses: a flattened dome each (one call each so the dome width is its own)
  for (const { sheet, P } of halves) {
    for (const b of sheet.bosses) {
      const pts = mapPts(P, kit.shapes.fillet(rect(b.c[0] - b.w / 2, b.c[1] - b.h / 2, b.c[0] + b.w / 2, b.c[1] + b.h / 2), b.r, { closed: true, step: 0.25 }))
      panel.raise((ctx) => {
        ctx.beginPath()
        pathPoly(ctx, pts)
        ctx.fill()
      }, { height: b.height, profile: 'dome', shoulder: b.shoulder ?? Math.min(b.w, b.h) * 0.5 })
    }
  }

  // 4. grooves (one sink for every groove line of the panel) + ring grooves round bosses
  panel.sink((ctx) => {
    ctx.lineWidth = groove.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const { sheet, P } of halves) {
      for (const is of sheet.islands) {
        for (const g of groovesUV(kit, is)) {
          ctx.beginPath()
          pathPoly(ctx, mapPts(P, g.pts), false)
          ctx.stroke()
        }
      }
      for (const b of sheet.bosses) {
        if (!b.ring) continue
        const e = b.ring === true ? 0.15 : b.ring
        const pts = mapPts(P, kit.shapes.fillet(rect(b.c[0] - b.w / 2 - e, b.c[1] - b.h / 2 - e, b.c[0] + b.w / 2 + e, b.c[1] + b.h / 2 + e), b.r + e, { closed: true, step: 0.25 }))
        ctx.beginPath()
        pathPoly(ctx, pts)
        ctx.stroke()
      }
    }
  }, { depth: groove.depth, profile: 'u' })

  // slit pupils
  const slits = []
  for (const { sheet, P } of halves) for (const b of sheet.bosses) if (b.slit) slits.push({ b, P })
  if (slits.length) {
    panel.sink((ctx) => {
      ctx.lineCap = 'round'
      for (const { b, P } of slits) {
        ctx.lineWidth = b.slit[1]
        ctx.beginPath()
        pathPoly(ctx, [P([b.c[0] - b.slit[0] / 2, b.c[1] + (b.slitY ?? 0)]), P([b.c[0] + b.slit[0] / 2, b.c[1] + (b.slitY ?? 0)])], false)
        ctx.stroke()
      }
    }, { depth: 1.0, profile: 'u', shoulder: 0.3 })
  }

  // 5. leiwen ground: one packing over the left half (it avoids the raised frame and islands)
  const hr = halfRect ?? { x: 0, y: 0, w: W / 2, h: H }
  panel.fillGround({ ...ground, seed }, { rect: hr, avoid: 'raised', margin: 0.42 })

  // 6. spirals on the island tops (V-a "spirals on the plateau"): round spirals packed by hand,
  //    largest first, wherever a disc of plateau top is free (detail-face-*: 4–5 mm round coils)
  const carveIslands = []
  for (const { sheet, P } of halves) for (const is of sheet.islands) if (is.carve) carveIslands.push({ is, P })
  if (carveIslands.length) carveSpirals(kit, panel, carveIslands, { ...carve, seed: seed + 7, halfRect: hr })

  // 7. mirror, then put plain bands at the wall surface
  if (mirror) panel.mirrorX()
  const f = panel.field
  for (let i = 0; i < f.length; i++) f[i] -= L1
  return panel
}

/** Left-half transform: (u, v) → panel (xc − u, y0 + v). */
export const leftHalf = (xc, y0 = 0) => ([u, v]) => [xc - u, y0 + v]

function pointInPoly(pts, x, y) {
  let c = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

/**
 * Pack round spirals on the flat plateau tops of the given islands (panel field must hold L1 there,
 * grooves already sunk). Greedy, largest disc first; one sink for all coils.
 * opts: { pitch, line (× pitch), depth, rMax, rMin, gap, margin, seed, halfRect }
 */
export function carveSpirals(kit, panel, items, o = {}) {
  const pitch = o.pitch ?? 1.25
  const lw = (o.line ?? 0.42) * pitch
  const rMax = o.rMax ?? 2.5, rMin = o.rMin ?? 1.15
  const gap = o.gap ?? 0.45, margin = o.margin ?? 0.42
  const hr = o.halfRect ?? { x: 0, y: 0, w: panel.width, h: panel.height }
  const rng = new kit.Rng(o.seed ?? 1)
  const top = (x, y) => Math.abs(panel.heightAt(x, y) - L1) < 0.04
  const RING = 18
  const fits = (x, y, r) => {
    if (!top(x, y)) return false
    for (const rr of [r + margin, (r + margin) * 0.6]) {
      for (let k = 0; k < RING; k++) {
        const a = (k / RING) * Math.PI * 2
        if (!top(x + rr * Math.cos(a), y + rr * Math.sin(a))) return false
      }
    }
    return true
  }
  const cands = []
  const step = 0.5
  for (const { is, P } of items) {
    const poly = kit.shapes.fillet(is.pts, is.r, { closed: true, step: 0.4 }).map(P)
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of poly) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    x0 = Math.max(x0, hr.x); x1 = Math.min(x1, hr.x + hr.w)
    for (let y = y0 + rMin; y <= y1 - rMin; y += step) {
      for (let x = x0 + rMin; x <= x1 - rMin; x += step) {
        if (!pointInPoly(poly, x, y) || !fits(x, y, rMin)) continue
        let lo = rMin, hi = rMax
        if (fits(x, y, hi)) lo = hi
        else for (let i = 0; i < 6; i++) { const m = (lo + hi) / 2; if (fits(x, y, m)) lo = m; else hi = m }
        cands.push([x, y, lo])
      }
    }
  }
  // lazy greedy, biggest disc first: a candidate's free radius only shrinks as coils are placed,
  // so pop the top, re-measure it against the placed coils, and accept it only if it is still the biggest
  const heap = cands.map((c) => [c[2], c[0], c[1], c[2]]) // [key, x, y, rStatic]
  const less = (a, b) => a[0] > b[0] || (a[0] === b[0] && (a[2] < b[2] || (a[2] === b[2] && a[1] < b[1])))
  const up = (i) => { while (i > 0) { const p = (i - 1) >> 1; if (!less(heap[i], heap[p])) break; [heap[i], heap[p]] = [heap[p], heap[i]]; i = p } }
  const down = (i) => {
    for (;;) {
      const l = 2 * i + 1, r = l + 1
      let m = i
      if (l < heap.length && less(heap[l], heap[m])) m = l
      if (r < heap.length && less(heap[r], heap[m])) m = r
      if (m === i) return
      ;[heap[i], heap[m]] = [heap[m], heap[i]]
      i = m
    }
  }
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) down(i)
  const pop = () => { const t = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; down(0) } return t }
  const placed = []
  const free = (x, y, r0) => {
    let r = r0
    for (const q of placed) {
      const d = Math.hypot(q[0] - x, q[1] - y) - q[2] - gap - lw
      if (d < r) r = d
      if (r < rMin) return r
    }
    return r
  }
  while (heap.length) {
    const c = pop()
    const r = free(c[1], c[2], c[3])
    if (r < rMin) continue
    if (heap.length && r < heap[0][0] - 1e-6) { c[0] = r; heap.push(c); up(heap.length - 1); continue }
    placed.push([c[1], c[2], r])
  }
  if (!placed.length) return placed
  panel.sink((ctx) => {
    ctx.lineWidth = lw
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const [cx, cy, r] of placed) {
      const rOut = r - lw / 2
      const turns = Math.max(1.1, (rOut - 0.25) / pitch)
      const pp = (rOut - 0.25) / turns
      const dir = rng.next() < 0.5 ? 1 : -1
      const a0 = rng.next() * Math.PI * 2
      const n = Math.ceil(turns * 40)
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * turns * Math.PI * 2
        const rr = 0.25 + (pp * t) / (Math.PI * 2)
        const a = a0 + dir * t
        const px = cx + rr * Math.cos(a), py = cy + rr * Math.sin(a)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }
  }, { depth: o.depth ?? 0.3, profile: 'u' })
  return placed
}
