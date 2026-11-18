// nezu-fangyi — round 5: décor TRACED off the flattened photographs
// (reference/nezu-fangyi/faces/*.jpg, KIT.md § Flat faces), drawn with the
// kit's traced vocabulary (roundStroke outlines, pillowBoss eyes).
//
// A trace is authored in FACE mm — x 0 → face width left to right seen from
// outside, y 0 → face height bottom to top, exactly the flattened photo's
// frame (px / 6 mm) — for the LEFT half of the face only (the half the photo
// shows best, and the half the mould carver drew before mirroring). A `map`
// function carries face mm into the panel's mm; the renderer raises every band
// as one V-b plateau (steep foot, quarter-round arris), cuts ONE incised line
// down the middle of each band, sinks the coil pockets below the ground,
// raises the pillow eyes, packs leiwen into the channels that are left, and
// mirrors the half.
//
// Band spec: { ctrl: [[x, y]…] | coil: { c, R, start, sweep, dir, hold, rEnd } + lead?: [[x, y]…],
//              w: mm | [per ctrl] | t → mm, round, inner, start, end, spiral, line: true | false | n (lines) }

import { shoulderProfile } from './relief.js'

/**
 * A heavy round coil: radius R held for `hold` degrees, then diving smoothly to rEnd at the end of `sweep`.
 * Angles in degrees, 0 = +x, dir +1 counter-clockwise.
 */
export function coilSpine({ c, R, start = 90, sweep = 360, dir = 1, hold = 180, rEnd = 0.3 * R, step = 0.35, ax = 1 }) {
  const out = []
  const n = Math.max(8, Math.ceil(((sweep * Math.PI) / 180) * R / step))
  for (let i = 0; i <= n; i++) {
    const a = (sweep * i) / n
    const t = a <= hold ? 0 : (a - hold) / Math.max(1e-6, sweep - hold)
    const r = R + (rEnd - R) * t * t * (3 - 2 * t)
    const th = ((start + dir * a) * Math.PI) / 180
    out.push([c[0] + Math.cos(th) * r * ax, c[1] + Math.sin(th) * r])
  }
  return out
}

/** the band's centre line in face mm (lead + coil, or the control polygon) */
function spineOf(b) {
  if (!b.coil) return b.ctrl
  const coil = coilSpine(b.coil)
  return b.lead ? [...b.lead, ...coil] : coil
}

/** Build the kit elements of a trace (panel mm). */
export function traceElements(kit, trace, map, wScale = 1) {
  const els = []
  for (const b of trace.bands) {
    const pts = spineOf(b).map(map)
    const dense = !!b.coil
    const k = b.fixed ? 1 : wScale
    const width = typeof b.w === 'function' ? (t) => b.w(t) * k : Array.isArray(b.w) ? b.w.map((v) => v * k) : b.w * k
    const el = kit.roundStroke(pts, {
      width,
      round: dense ? 0 : b.round ?? 0.55,
      inner: dense ? 0 : b.inner ?? 0.2,
      start: b.start ?? 'round',
      end: b.end ?? 'round',
      spiral: b.spiral,
      capRound: b.capRound ?? 0.4,
    })
    el.trace = b
    els.push(el)
  }
  // solid plates under coils (a horn reads as one mass with its pocket, not a ring round bare ground)
  for (const pl of trace.plates || []) {
    const c = map(pl.c)
    const el = kit.roundPlate({ c, w: pl.w * (pl.sx ?? 1), h: pl.h, r: pl.r ?? Math.min(pl.w, pl.h) / 2 })
    el.trace = { line: false }
    els.push(el)
  }
  return els
}

/**
 * Render a trace onto a panel (left half) and mirror it.
 * o: { map (face mm → panel mm), L1, shoulder, groove: { w, d }, pocket: { depth }, ground (leiwen opts),
 *      fields: [rect panel mm], seed, mirror: true | rect | false, scale (mm of panel per face mm, for eye sizes) }
 */
export function renderTrace(kit, panel, trace, o) {
  const { map, L1 = 3, shoulder = 0.65, groove = { w: 0.6, d: 0.45 }, ground = {}, fields = [], seed = 1, mirror = true } = o
  const sx = o.scale ?? 1
  const els = traceElements(kit, trace, map, o.wScale ?? 1)
  // 1. every band, one raise
  if (els.length) panel.raise(kit.paintElements(els), { height: L1, shoulder, profile: shoulderProfile })
  // 1b. low blocks (plain raised fields, e.g. a lid separator) at their own height
  for (const blk of trace.blocks || []) {
    const P = blk.pts.map(map)
    panel.raise((ctx) => { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (const p of P) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fill() }, { height: blk.h ?? L1, shoulder, profile: shoulderProfile })
  }
  // 2. one incised line down the middle of every band (trimmed short of round / blunt ends), coil pockets
  const { strokeLine, trim, polyLength } = kit.shapes
  panel.sink((ctx) => {
    for (const el of els) {
      const b = el.trace
      if (b.line === false || !el.spine) continue
      // narrow bands carry no line: at vessel distance a 0.6 mm groove down a < 3.3 mm band reads as two thin
      // strokes, the 'typographic' look; the photographs show those as plain fat bands
      if (b.line !== true && typeof b.line !== 'number' && Math.max(...el.widths) < (o.lineMin ?? 3.3)) continue
      const sp = el.spine
      const L = polyLength(sp)
      const w0 = el.widths[0], w1 = el.widths[el.widths.length - 1]
      const ca = b.start === 'flat' ? 0 : Math.min(w0 * 0.7, L * 0.3)
      const cb = b.end === 'flat' ? 0 : b.end === 'spiral' || b.coil ? Math.min(w1 * 0.9, L * 0.2) : Math.min(w1 * 0.7, L * 0.3)
      const pts = trim(sp, ca, cb)
      if (pts.length < 2) continue
      const n = typeof b.line === 'number' ? b.line : 1
      if (n === 1) strokeLine(ctx, pts, b.lineW ?? groove.w)
      else {
        // n parallel lines across the band (a coil cut with lines following it)
        const { normals } = kit.shapes
        const N = normals(pts)
        const wm = Math.min(w0, w1)
        for (let k = 0; k < n; k++) {
          const off = (k - (n - 1) / 2) * (wm / (n + 0.6))
          strokeLine(ctx, pts.map((p, i) => [p[0] + N[i][0] * off, p[1] + N[i][1] * off]), b.lineW ?? groove.w * 0.85)
        }
      }
    }
    for (const l of trace.lines || []) strokeLine(ctx, l.pts.map(map), l.w ?? groove.w)
  }, { depth: groove.d, profile: 'u' })
  if (trace.pockets?.length) {
    // the coil's eye: a round pocket sunk BELOW the ground (dark in the photograph)
    for (const pk of trace.pockets) {
      const c = map(pk.c)
      panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(c[0], c[1], pk.r * sx, (pk.ry ?? pk.r), 0, 0, Math.PI * 2); ctx.fill() }, { depth: pk.depth ?? 1.2, shoulder: Math.min(pk.r, pk.ry ?? pk.r) * 0.8, profile: 'u' })
    }
  }
  // 3. eyes: convex pillows with a slit (or a round hole)
  for (const e of trace.eyes || []) {
    const c = map(e.c)
    kit.pillowBoss(panel, {
      c, w: e.w * sx, h: e.h, round: e.round ?? 0.5, height: e.height ?? L1 + 1.6, crown: e.crown ?? 0.55, base: 0,
      slit: e.slit ? { len: e.slit.len * sx, width: e.slit.width, depth: e.slit.depth ?? 1.0, offset: [(e.slit.offset?.[0] ?? 0) * sx, e.slit.offset?.[1] ?? 0] } : false,
    })
    if (e.hole) {
      const hc = map([e.c[0] + (e.hole.offset?.[0] ?? 0), e.c[1] + (e.hole.offset?.[1] ?? 0)])
      panel.sink((ctx) => { ctx.beginPath(); ctx.arc(hc[0], hc[1], e.hole.r, 0, Math.PI * 2); ctx.fill() }, { depth: e.hole.depth ?? 1.4, shoulder: e.hole.r * 0.6, profile: 'u' })
    }
  }
  // 4. leiwen in the channels left (decor fields only: plain borders stay plain)
  fields.forEach((r, i) => {
    if (r.w > 1 && r.h > 1) panel.fillGround({ ...ground, seed: seed + i * 31 }, { rect: r, avoid: 'raised', margin: ground.margin ?? 0.45 })
  })
  if (mirror === true) panel.mirrorX()
  else if (mirror) for (const r of [].concat(mirror)) panel.mirrorX(r)
  return els
}

/** Fraction of a rect (panel mm) that stands above `level` mm — the raised-to-ground ratio. */
export function raisedFraction(panel, r, level = 0.6) {
  const { cols, rows, ppmm, field } = panel
  let n = 0, k = 0
  for (let y = Math.max(0, Math.floor(r.y * ppmm)); y < Math.min(rows, Math.ceil((r.y + r.h) * ppmm)); y += 2) {
    for (let x = Math.max(0, Math.floor(r.x * ppmm)); x < Math.min(cols, Math.ceil((r.x + r.w) * ppmm)); x += 2) {
      n++
      if (field[y * cols + x] > level) k++
    }
  }
  return n ? k / n : 0
}
