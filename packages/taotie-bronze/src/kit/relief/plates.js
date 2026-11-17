// Traced plates — décor as SOLID masses, from outlines (KIT.md § Traced plates, § Tracing plates from a flattened face).
//
// STATUS: first pass. Additive: nothing else in the kit imports this file.
//
// The Anyang bronzes are broad raised PLATES crowding the field, with narrow sunk channels of ground between them;
// each plate has a rounded shoulder, a flat or slightly pillowed top, and an incised line running parallel to its edge
// (two on the "multiply-contoured" bands), sometimes a sunk centre, spirals or hooks on a wide top. All of that is a
// function of ONE number per pixel — the distance in from the plate's edge — so a plate is drawn as its outline, not
// as a stroked centre line: tools/trace.py takes the outlines off the flattened photograph, this module turns them
// into relief.
//
//   tracedPlates(panel, plates, opts)  raise the union of the outlines (one panel.raise with a shoulder/pillow
//                                      profile), cut every contour line and sunk centre in ONE panel.sink (a profile
//                                      of the same distance), optional leiwen packed on the wide tops, pillow
//                                      bosses, then (optionally) the leiwen ground on everything that is not plate.
//
// Writes only through the panel's public calls (raise / sink / mask) and leiwenFill / pillowBoss, so the groove
// channel, ground packing ('raised' avoidance) and height conventions (mm above the ground) are the panel's own.

import { leiwenFill } from './leiwen.js'
import { pillowBoss } from './rounded.js'
import { signedDistance } from './edt.js'

const DEFAULTS = {
  height: 1.6, // plate top, mm above the ground
  shoulder: 0.6, // mm: rounded shoulder (the steep wall rounding over into the top)
  pillow: 0, // mm: extra crown toward the middle of a wide plate (0 = flat top)
  pillowWidth: 3, // mm in from the edge over which the pillow rises
  contour: { inset: 0.9, line: 0.45 }, // the incised line parallel to the edge | false
  contour2: null, // a second one ({ inset, line }), the multiply-contoured bands
  depth: 0.35, // mm: incised line depth
  centre: false, // { inset: mm (2.8), depth: mm (0.5), shoulder: mm (0.3) }: sunk centre where the plate is wider than 2·inset
  fill: null, // { kind: 'leiwen', inset: mm (2.2), pitch, line, roundness, cell, … leiwen opts }: spirals / hooks on tops wide enough
  bosses: null, // [{ c: [x, y], r, hole?, ring? }] (default: plates.bosses) — pillow eyes
  boss: { height: 2.6, crown: 0.65, hole: { depth: 1.2 }, ring: false }, // their relief
  ground: false, // leiwen options → pack the ground (everything that is not plate) | false
  groundRegion: null, // { rect?, include?, margin? } for the ground fill (default: the whole panel, margin 0.5)
  map: null, // ([x, y]) → [x, y] panel mm (default identity): face mm → panel
  clip: null, // draw(ctx) | [[x, y]…]: only inside this
  seed: 0,
  union: false, // true: overlapping plates MERGE (nonzero fill; outers wound CCW, holes CW) instead of cancelling (even-odd)
}

/**
 * Raise traced outlines as bronze plates.
 * @param panel ReliefPanel
 * @param plates a plates.json object ({ plates: [{ outer, holes }], bosses }) or an array of { outer, holes } | [[x, y]…]
 * @param opts see DEFAULTS above; heights and insets in mm
 * @returns { plates, area (mm² raised), bosses, ms }
 */
export function tracedPlates(panel, plates, opts = {}) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0
  const o = { ...DEFAULTS, ...opts, boss: { ...DEFAULTS.boss, ...(opts.boss || {}) } }
  const list = (Array.isArray(plates) ? plates : plates?.plates || []).map((p) => (Array.isArray(p) ? { outer: p, holes: [] } : p))
  const map = o.map || ((p) => p)
  const loops = []
  const wind = (L, ccw) => (o.union && (signedArea(L) > 0) !== ccw ? L.slice().reverse() : L)
  for (const p of list) {
    if (!p.outer || p.outer.length < 3) continue
    loops.push(wind(p.outer.map(map), true))
    for (const h of p.holes || []) if (h.length >= 3) loops.push(wind(h.map(map), false))
  }
  const clip = typeof o.clip === 'function' ? o.clip : Array.isArray(o.clip) ? polyDraw(o.clip) : null
  const draw = (ctx) => {
    if (clip) { ctx.save(); clip(ctx); ctx.clip() }
    ctx.beginPath()
    for (const L of loops) {
      ctx.moveTo(L[0][0], L[0][1])
      for (let i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1])
      ctx.closePath()
    }
    ctx.fill(o.union ? 'nonzero' : 'evenodd')
    if (clip) ctx.restore()
  }
  let area = 0
  if (loops.length) {
    // 1. the plateau: shoulder + optional pillow, one raise
    const { height, shoulder, pillow, pillowWidth } = o
    const top = pillow > 0 ? height + pillow : height
    const profile = (s) => {
      if (s <= 0) return 0
      let v = 1
      if (s < shoulder) {
        const t = 1 - s / shoulder
        v = 1 - t * t * Math.sqrt(t)
      }
      let h = height * v
      if (pillow > 0) {
        const u = Math.min(1, s / pillowWidth)
        h += pillow * Math.sin((u * Math.PI) / 2) ** 2
      }
      return h / top
    }
    panel.raise(draw, { height: top, shoulder, profile })
    // 2. contour lines + sunk centre: one sink, a profile of the same edge distance
    const cuts = []
    for (const c of [o.contour, o.contour2]) if (c) cuts.push({ a: c.inset ?? 0.9, w: (c.line ?? 0.45) / 2, d: c.depth ?? o.depth })
    const cen = o.centre ? { a: o.centre.inset ?? 2.8, d: o.centre.depth ?? 0.5, sh: o.centre.shoulder ?? 0.3 } : null
    if (cuts.length || cen) {
      const dmax = Math.max(cen ? cen.d : 0, ...cuts.map((c) => c.d))
      const sinkProfile = (s) => {
        let v = 0
        for (const c of cuts) {
          const t = Math.abs(s - c.a) / c.w
          if (t < 1) v = Math.max(v, (c.d / dmax) * Math.sqrt(1 - t * t))
        }
        if (cen && s > cen.a) {
          const t = Math.min(1, (s - cen.a) / cen.sh)
          v = Math.max(v, (cen.d / dmax) * Math.sqrt(1 - (1 - t) * (1 - t)))
        }
        return v
      }
      panel.sink(draw, { depth: dmax, shoulder: 0.25, profile: sinkProfile })
    }
    // 3. coverage (and the wide-top core for a fill)
    const m = panel.mask(draw)
    for (let i = 0; i < m.data.length; i++) area += m.data[i]
    area /= panel.ppmm * panel.ppmm
    if (o.fill && o.fill.kind === 'leiwen') {
      const sd = signedDistance(m.data, m.cols, m.rows)
      const ins = (o.fill.inset ?? 2.2) * panel.ppmm
      const core = new Float32Array(sd.length)
      let any = false
      for (let i = 0; i < sd.length; i++) if (sd[i] > ins) { core[i] = 1; any = true }
      if (any) {
        const { kind, inset, margin, ...lo } = o.fill
        leiwenFill(panel, { include: { data: core }, avoid: null, margin: margin ?? 0.2 }, { pitch: 0.9, line: 0.45, depth: o.depth, echo: 0, eyes: 0, seed: o.seed, ...lo })
      }
    }
  }
  // 4. bosses (pillow eyes), after the plates so the ground packer avoids them
  const bosses = o.bosses || (Array.isArray(plates) ? [] : plates?.bosses || [])
  const bo = o.boss
  for (const b of bosses) {
    const c = map(b.c)
    const ex = map([b.c[0] + b.r, b.c[1]]), ey = map([b.c[0], b.c[1] + b.r])
    const rx = Math.hypot(ex[0] - c[0], ex[1] - c[1]), ry = Math.hypot(ey[0] - c[0], ey[1] - c[1])
    pillowBoss(panel, { c, w: 2 * rx, h: 2 * ry, round: 1, height: b.height ?? bo.height, crown: b.crown ?? bo.crown, slit: false, ring: b.ring ?? bo.ring })
    const hole = b.hole ?? null
    if (hole && bo.hole) {
      const hr = typeof hole === 'number' ? hole : hole.r
      panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], hr * (rx / b.r), 0, Math.PI * 2); ctx.fill() }, { depth: bo.hole.depth ?? 1.2, shoulder: 0.3, profile: 'u' })
    }
  }
  // 5. the leiwen ground on everything that is not plate
  let ground = null
  if (o.ground) {
    const g = o.groundRegion || {}
    ground = leiwenFill(panel, { rect: g.rect ?? { x: 0, y: 0, w: panel.width, h: panel.height }, include: g.include, avoid: 'raised', margin: g.margin ?? 0.5 }, { seed: o.seed, ...o.ground })
  }
  return { plates: list.length, area, bosses: bosses.length, ground, ms: Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0) }
}

/** plates.json face mm → a panel: (x, y) ↦ (ox + kx·(x − cx), f(y)) — the usual flat-face mapping helper. */
export function faceMap({ cx = 0, ox = 0, kx = 1, y = (v) => v } = {}) {
  return ([px, py]) => [ox + kx * (px - cx), y(py)]
}

function signedArea(L) {
  let a = 0
  for (let i = 0; i < L.length; i++) { const p = L[i], q = L[(i + 1) % L.length]; a += p[0] * q[1] - q[0] * p[1] }
  return a / 2
}

function polyDraw(pts) {
  return (ctx) => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// sunkCartouche — the Western Zhou SUNK-THEN-EMBOSSED field (KIT.md § Traced plates › Sunk cartouches). Additive: a new
// function; tracedPlates above is untouched.
//
// The field is cut DOWN below the wall (its edge stepping down through `rim.ribs` parallel ribs that follow the
// outline), and the figure is raised back UP inside it as flat-topped ribbons with soft shoulders, normally to the
// wall's own level; ring eyes (a raised ring round a domed centre) stand in their own recess, fine ground spirals are
// sunk into the floor that is left. Heights are written RELATIVE to what the panel holds (field += h, h ≤ level), in
// ONE pass over the fields' bbox from two masks and two distance transforms, whatever the number of cartouches.

const CARTOUCHE_DEFAULTS = {
  depth: 1.4, // mm: the floor below the wall
  level: 0, // mm: ribbon tops relative to the wall (0 = flush with it, > 0 a little proud)
  shoulder: 0.7, // mm: the ribbons' rounded shoulder (from the floor up to the top)
  rim: { ribs: 2, pitch: 1.3, riser: 0.3, rib: 0.55, ribHeight: 0.18 }, // stepped edge: ribs × pitch mm wide | false
  eye: { ring: 1.3, ringTop: 0, gap: 0.45, dome: 0.4 }, // ring width, its top / the dome's top (mm rel. the wall), sunk gap
  ground: false, // leiwen options → spirals sunk into the floor between the ribbons | false
  groundMargin: 0.35, // mm kept clear of ribbons, rim and eyes
  groundMinPx: 2.8, // skip the ground when its pitch is under this many px (phones, low quality): the floor stays plain
  contour: null, // { inset: 0.8, line: 0.55, depth: 0.2, maxHalf: 3.4 }: a fine sunk line on each ribbon top, `inset` mm in
  //               from its edge, only on ribbons at least 2·(inset + line) wide and at most 2·maxHalf (not on broad plates) | null
  map: null, // ([x, y]) → [x, y] panel mm (default identity)
  seed: 0,
}

/**
 * Sink cartouches and emboss their ribbons.
 * @param panel ReliefPanel
 * @param cartouches [{ field: [[x, y]…] | { rrect: [x0, y0, x1, y1], r: mm | [TL, TR, BR, BL] } | { poly },
 *                      plates: [{ outer, holes }] | [[x, y]…] (the ribbons' footprints on the floor),
 *                      eyes: [{ c: [x, y], r }] }] — or one such object
 * @param opts see CARTOUCHE_DEFAULTS; mm
 * @returns { cartouches, fieldArea, ribbonArea, coverage (ribbons + eye rings / field), ground, ms }
 */
export function sunkCartouche(panel, cartouches, opts = {}) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0
  const D = CARTOUCHE_DEFAULTS
  const o = { ...D, ...opts, rim: opts.rim === false ? false : { ...D.rim, ...(opts.rim || {}) }, eye: { ...D.eye, ...(opts.eye || {}) } }
  const map = o.map || ((p) => p)
  const list = Array.isArray(cartouches) ? cartouches : [cartouches]
  const fields = [], loops = [], eyes = []
  for (const c of list) {
    const f = c.field
    const F = Array.isArray(f) ? f : f.rrect ? rrectLoop(f.rrect, f.r ?? 0) : f.poly
    fields.push(densifyLoop(F, 2).map(map))
    for (const p of c.plates || []) {
      const P = Array.isArray(p) ? { outer: p, holes: [] } : p
      if (P.outer && P.outer.length >= 3) loops.push(densifyLoop(P.outer, 2).map(map))
      for (const h of P.holes || []) if (h.length >= 3) loops.push(densifyLoop(h, 2).map(map))
    }
    for (const e of c.eyes || []) {
      const cc = map(e.c), ex = map([e.c[0] + e.r, e.c[1]]), ey = map([e.c[0], e.c[1] + e.r])
      eyes.push({ c: cc, r: e.r, rx: Math.hypot(ex[0] - cc[0], ex[1] - cc[1]), ry: Math.hypot(ey[0] - cc[0], ey[1] - cc[1]) })
    }
  }
  const path = (ctx, Ls) => {
    for (const L of Ls) {
      ctx.moveTo(L[0][0], L[0][1])
      for (let i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1])
      ctx.closePath()
    }
  }
  const fieldDraw = (ctx) => { ctx.beginPath(); path(ctx, fields); ctx.fill('evenodd') }
  const ribDraw = (ctx) => {
    ctx.save(); ctx.beginPath(); path(ctx, fields); ctx.clip()
    ctx.beginPath(); path(ctx, loops); ctx.fill('evenodd'); ctx.restore()
  }
  const { cols, rows, ppmm } = panel
  const FM = panel.mask(fieldDraw)
  let x0 = cols, y0 = rows, x1 = -1, y1 = -1
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (FM.data[y * cols + x] > 0) {
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  const out = { cartouches: list.length, fieldArea: 0, ribbonArea: 0, coverage: 0, ground: null, ms: 0 }
  if (x1 < 0) return out
  x0 = Math.max(0, x0 - 3); y0 = Math.max(0, y0 - 3); x1 = Math.min(cols - 1, x1 + 3); y1 = Math.min(rows - 1, y1 + 3)
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1
  const RM = loops.length ? panel.mask(ribDraw) : null
  const crop = (M) => {
    const c = new Float32Array(bw * bh)
    for (let y = 0; y < bh; y++) c.set(M.data.subarray((y0 + y) * cols + x0, (y0 + y) * cols + x0 + bw), y * bw)
    return c
  }
  const sdF = signedDistance(crop(FM), bw, bh)
  const sdR = RM ? signedDistance(crop(RM), bw, bh) : null
  const inv = 1 / ppmm
  const depth = o.depth, top = o.level
  // ribbon-top contour lines: the local ribbon half-width = the largest edge distance within maxHalf + 0.6 mm, read
  // off a 4 px block-max grid (cheap); the line goes only where that half-width is in [inset + line, maxHalf]
  const CT = o.contour && sdR ? { inset: 0.8, line: 0.55, depth: 0.2, maxHalf: 3.4, ...o.contour } : null
  let halfW = null, bwB = 0
  if (CT) {
    bwB = Math.ceil(bw / 4)
    const bhB = Math.ceil(bh / 4), B = new Float32Array(bwB * bhB)
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const v = sdR[y * bw + x], k = (y >> 2) * bwB + (x >> 2)
      if (v > B[k]) B[k] = v
    }
    const R = Math.max(1, Math.ceil(((CT.maxHalf + 0.6) * ppmm) / 4))
    const T = new Float32Array(B.length)
    for (let y = 0; y < bhB; y++) for (let x = 0; x < bwB; x++) {
      let m = 0
      for (let d = Math.max(0, x - R); d <= Math.min(bwB - 1, x + R); d++) if (B[y * bwB + d] > m) m = B[y * bwB + d]
      T[y * bwB + x] = m
    }
    halfW = new Float32Array(B.length)
    for (let y = 0; y < bhB; y++) for (let x = 0; x < bwB; x++) {
      let m = 0
      for (let d = Math.max(0, y - R); d <= Math.min(bhB - 1, y + R); d++) if (T[d * bwB + x] > m) m = T[d * bwB + x]
      halfW[y * bwB + x] = m * inv
    }
  }
  // the stepped rim: ribs k = 0…n−1, each a tread at −depth·(k+1)/(n+1) carrying a rounded rib, then the floor
  const rim = o.rim
  const n = rim ? Math.max(0, Math.round(rim.ribs)) : 0
  const pitch = rim ? rim.pitch : 0
  const rimW = n * pitch
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
  const riser = rim ? rim.riser : 0.3
  const floorAt = (s) => {
    if (!n) return -depth * ease(s / riser)
    const k = Math.floor(s / pitch)
    if (k > n) return -depth
    const f = s - k * pitch
    const prev = k === 0 ? 0 : (-depth * k) / (n + 1)
    const cur = k >= n ? -depth : (-depth * (k + 1)) / (n + 1)
    let h = prev + (cur - prev) * ease(f / riser)
    if (k < n) {
      const t = (f - riser * 0.5) / (rim.rib * pitch)
      if (t > 0 && t < 1) h += rim.ribHeight * Math.sin(Math.PI * t)
    }
    return h
  }
  const sh = Math.max(1e-3, o.shoulder)
  const ribbonAt = (s) => {
    if (s <= 0) return -Infinity
    const t = Math.min(1, s / sh)
    const u = 1 - t
    return -depth + (depth + top) * (1 - u * u * Math.sqrt(u))
  }
  const E = o.eye
  const eyeAt = (rho, r) => {
    const rI = Math.max(0.3, r - E.ring), rd = Math.max(0.2, rI - E.gap)
    if (rho <= rd) return -depth + (depth + E.dome) * Math.sqrt(Math.sqrt(Math.max(0, 1 - (rho / rd) ** 2)))
    if (rho < rI) return -depth
    if (rho <= r) return -depth + (depth + E.ringTop) * Math.sqrt(Math.sin((Math.PI * (rho - rI)) / Math.max(1e-3, r - rI)))
    return -Infinity
  }
  const wantGround = !!o.ground && ppmm * (o.ground.pitch ?? 0.9) >= o.groundMinPx
  const inc = wantGround ? new Float32Array(cols * rows) : null
  const field = panel.field, groove = panel.groove
  let nF = 0, nR = 0
  for (let y = 0; y < bh; y++) {
    const py = (y0 + y + 0.5) * inv
    for (let x = 0; x < bw; x++) {
      const j = y * bw + x
      const s = sdF[j] * inv
      if (s <= 0) continue
      nF++
      let h = floorAt(s)
      const sr = sdR ? sdR[j] * inv : -1
      const hr = ribbonAt(sr)
      if (hr > h) {
        h = hr
        if (sr > sh * 0.5) nR++
        if (CT) {
          const hw = halfW[(y >> 2) * bwB + (x >> 2)]
          const t = Math.abs(sr - CT.inset) / (CT.line * 0.5)
          if (t < 1 && hw >= CT.inset + CT.line && hw <= CT.maxHalf) h -= CT.depth * Math.sqrt(1 - t * t)
        }
      }
      let nearEye = false
      if (eyes.length) {
        const px = (x0 + x + 0.5) * inv
        for (const e of eyes) {
          const dx = (px - e.c[0]) / e.rx, dy = (py - e.c[1]) / e.ry
          const q = Math.sqrt(dx * dx + dy * dy)
          if (q * e.r > e.r + o.groundMargin) continue
          nearEye = true
          const he = eyeAt(q * e.r, e.r)
          if (he > h) { h = he; if (q * e.r > e.r - E.ring) nR++ }
        }
      }
      const i = (y0 + y) * cols + x0 + x
      field[i] += h
      const g = Math.min(1, Math.max(0, -h / depth))
      if (g > groove[i]) groove[i] = g
      if (inc && s > rimW + 0.05 && sr < 0 && !nearEye) inc[i] = 1
    }
  }
  const px2 = inv * inv
  out.fieldArea = nF * px2
  out.ribbonArea = nR * px2
  out.coverage = nF ? nR / nF : 0
  if (inc) {
    const { pitch: gp, ...lo } = o.ground
    out.ground = leiwenFill(panel, { rect: { x: x0 * inv, y: y0 * inv, w: bw * inv, h: bh * inv }, include: { data: inc }, avoid: null, margin: o.groundMargin },
      { echo: 0, eyes: 0, seed: o.seed, pitch: gp ?? 0.9, ...lo })
  }
  out.ms = Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0)
  return out
}

function rrectLoop([x0, y0, x1, y1], r = 0, step = 10) {
  const R = Array.isArray(r) ? r : [r, r, r, r]
  const lim = (v) => Math.max(0, Math.min(v, (x1 - x0) / 2, (y1 - y0) / 2))
  const [rTL, rTR, rBR, rBL] = R.map(lim)
  const pts = []
  const arc = (cx, cy, rr, a0, a1) => {
    for (let i = 0; i <= step; i++) {
      const a = a0 + ((a1 - a0) * i) / step
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
    }
  }
  const h = Math.PI / 2
  arc(x1 - rBR, y0 + rBR, rBR, -h, 0)
  arc(x1 - rTR, y1 - rTR, rTR, 0, h)
  arc(x0 + rTL, y1 - rTL, rTL, h, 2 * h)
  arc(x0 + rBL, y0 + rBL, rBL, 2 * h, 3 * h)
  return pts
}

function densifyLoop(pts, step) {
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
  }
  return out
}
