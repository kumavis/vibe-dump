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
  for (const p of list) {
    if (!p.outer || p.outer.length < 3) continue
    loops.push(p.outer.map(map))
    for (const h of p.holes || []) if (h.length >= 3) loops.push(h.map(map))
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
    ctx.fill('evenodd')
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

function polyDraw(pts) {
  return (ctx) => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.closePath()
  }
}
