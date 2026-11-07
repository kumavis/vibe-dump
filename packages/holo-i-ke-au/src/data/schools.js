// The schools (DATA.md "Schools, dated"): schools.json read into what the
// app draws and what the settlements keep off, island by island, every year
// at once. Pure: no THREE, so the tools can ask it too (tools/check-data.mjs
// and the smoke's settlement checks).
//
// Each school is a dated landmark of `kind: "school"`, placed at its point
// and, where the file has them, on its grounds (a Polygon). What stands
// there follows the years (schoolEras): the frame schoolhouse of the kingdom
// and the plantations, the mission's hall where the school was one of the
// mission's or the kingdom's large ones, the territory's two-storey block
// with its yard from about 1910, and the campus of low wings from about
// 1955; each school crosses over in a year of its own within a few of those,
// so a town's schools do not all change in one year. A school opened after
// a change starts in the kit of its year; a college or a university is a
// block before the war and a campus after. The kits' sizes go by the
// school's: its pupils where the file has a count, else its grounds' area,
// else its kind.
//
// What the settlements keep off (WorksExclusion's polys, joined to the
// works' by features/works.js exclusion): the building drawn, as its box,
// in the years it stands (widened by KEEP_SLACK) (part `block`, which the trees keep off too), and
// from the campus on, the whole of the grounds where the file has them
// (part `school`).

import { FEATURE_S } from '../config.js'

export const SCHOOL_TYPES = ['public', 'charter', 'private', 'mission', 'government', 'college', 'university']
export const KIT_NAMES = ['schoolhouse', 'block', 'campus']

/** The kits' extents as built (buildings.js schoolKits), model metres: [x0, x1, z0, z1] by kind and variant. */
export const KIT_BOX = {
  schoolhouse: [
    [-5.3, 5.3, -4, 5.8],
    [-8.8, 8.8, -4.5, 15.6],
    [-12.5, 12.5, -15.4, 17.3],
  ],
  block: [
    [-13.7, 13.7, -5.2, 19.4],
    [-24.1, 13.7, -5.2, 19.4],
  ],
  campus: [
    [-14, 14, -16.4, 34],
    [-24.5, 14, -22.4, 44],
    [-24.5, 34.3, -34.4, 66],
  ],
}

/** World units per model metre: the town's scale (settlements.js TOWN_S). */
export const SCHOOL_S = FEATURE_S * 1.25
// how far a school's kit may grow to fill its grounds, and shrink to keep within them
const GROW = 1.25
const SHRINK = 0.45
// the eras' changes: the year range each school crosses over in (DESIGN.md §5.4: the territory's from about 1910, the campus from about 1955)
const TERRITORY = [1903, 1917]
const CAMPUS = [1950, 1964]
const NEVER = 1e5
// The settlements ask each lot every few years (settlements.js STEP) and at
// the works' own dates; the schools' dates are not among those (a few hundred
// more sampled years on every tile), so a school keeps the lots off from this
// many years before it opens to as many after it closes: the lot is refused
// at the last sample before the school and comes back at the first after.
export const KEEP_SLACK = 4

/** A stable hash of a string to [0, 1). */
export function hash01(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

/** The size class of a school, 0 small, 1 middling, 2 large: by its pupils, else its grounds (m²), else its kind and name. */
export function sizeClass(p, area = 0) {
  const n = Number(p?.pupils?.n)
  if (n > 0) return n < 200 ? 0 : n < 900 ? 1 : 2
  if (p?.type === 'university' || p?.type === 'college') return 2
  if (/\bHigh\b/.test(p?.name || '')) return 2
  if (area > 0) return area < 15000 ? 0 : area < 60000 ? 1 : 2
  return p?.type === 'government' ? 0 : 1
}

/**
 * What stands at a school, year by year: [{ kit, variant, from, to }], `to`
 * null on the last while the school stands. Its own `look` (a list of
 * { kit, variant, from } the file may give) wins over the eras.
 */
export function schoolEras(p, area = 0) {
  const from = Number(p.from)
  const to = Number.isFinite(p.to) ? p.to : null
  const s = sizeClass(p, area)
  const h = hash01(String(p.id))
  const tAt = Math.round(TERRITORY[0] + h * (TERRITORY[1] - TERRITORY[0]))
  const cAt = Math.round(CAMPUS[0] + h * (CAMPUS[1] - CAMPUS[0]))
  const big = p.type === 'mission' || (p.type === 'private' && s >= 1) || s === 2
  const house = { kit: 'schoolhouse', variant: big ? 2 : s === 0 ? 0 : 1 }
  const block = { kit: 'block', variant: s === 2 ? 1 : 0 }
  const camp = { kit: 'campus', variant: s }
  let list
  if (Array.isArray(p.look) && p.look.length) list = p.look.map((l) => ({ kit: l.kit, variant: l.variant ?? 0, at: l.from }))
  else if (p.type === 'university' || p.type === 'college') list = [{ ...block, at: from }, { ...camp, at: Math.max(from, 1946) }]
  else list = [{ ...house, at: from }, { ...block, at: Math.max(from, tAt) }, { ...camp, at: Math.max(from, cAt) }]
  // (of eras that would begin in one year, the later in the list: a school opened in the territory starts as a block)
  list = list.filter((l, i) => !list.slice(i + 1).some((m) => Math.max(from, m.at) <= Math.max(from, l.at)))
  // (one era per kit, in order, each to the year before the next, clipped to the school's years)
  const out = []
  for (let i = 0; i < list.length; i++) {
    const a = Math.max(from, list[i].at)
    const next = list.slice(i + 1).find((l) => Math.max(from, l.at) > a)
    let b = next ? Math.max(from, next.at) - 1 : to
    if (to !== null && b !== null && b > to) b = to
    if (to !== null && a > to) break
    if (b !== null && b < a) continue
    if (out.length && out[out.length - 1].kit === list[i].kit && out[out.length - 1].variant === list[i].variant) {
      out[out.length - 1].to = b
      continue
    }
    out.push({ kit: list[i].kit, variant: list[i].variant, from: a, to: b })
    if (b === to) break
  }
  return out
}

/** A ring's centre, the direction of its long axis (radians: local +x to (cos, sin) in x, z) and half extents along and across it, from its principal axes. */
export function ringAxes(ring) {
  let cx = 0
  let cz = 0
  for (const [x, z] of ring) {
    cx += x / ring.length
    cz += z / ring.length
  }
  let sxx = 0
  let szz = 0
  let sxz = 0
  for (const [x, z] of ring) {
    sxx += (x - cx) ** 2
    szz += (z - cz) ** 2
    sxz += (x - cx) * (z - cz)
  }
  const th = 0.5 * Math.atan2(2 * sxz, sxx - szz)
  const c = Math.cos(th)
  const s = Math.sin(th)
  let u0 = Infinity
  let u1 = -Infinity
  let v0 = Infinity
  let v1 = -Infinity
  for (const [x, z] of ring) {
    const u = (x - cx) * c + (z - cz) * s
    const v = -(x - cx) * s + (z - cz) * c
    u0 = Math.min(u0, u)
    u1 = Math.max(u1, u)
    v0 = Math.min(v0, v)
    v1 = Math.max(v1, v)
  }
  // (the box's own middle, which a long thin campus's centroid need not be)
  const um = (u0 + u1) / 2
  const vm = (v0 + v1) / 2
  return { x: cx + um * c - vm * s, z: cz + um * s + vm * c, th, hu: (u1 - u0) / 2, hv: (v1 - v0) / 2 }
}

function ringArea(r) {
  let a = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1])
  return Math.abs(a / 2)
}

function boxOf(rings) {
  const b = [Infinity, Infinity, -Infinity, -Infinity]
  for (const r of rings) {
    for (let i = 0; i < r.length; i += 2) {
      b[0] = Math.min(b[0], r[i])
      b[1] = Math.min(b[1], r[i + 1])
      b[2] = Math.max(b[2], r[i])
      b[3] = Math.max(b[3], r[i + 1])
    }
  }
  return b
}

/** An oriented box as WorksExclusion's poly: centre, turn (dir: local +x to (cos, sin)), half extents. */
function boxPoly(x, z, dir, hx, hz, start, end, part) {
  const c = Math.cos(dir)
  const s = Math.sin(dir)
  const ring = Float32Array.from([[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([u, v]) => [x + u * hx * c - v * hz * s, z + u * hx * s + v * hz * c]))
  return { rings: [ring], box: boxOf([ring]), start, end, part }
}

/** A school's years as the shaders fade them (kit.js aSpan): in over the year before `from`, out over the year after `to`. */
export function eraSpan(e) {
  return [e.from - 1, e.from, e.to === null ? NEVER : e.to, e.to === null ? NEVER + 1 : e.to + 1]
}

/** How much of an era shows in a (fractional) year. */
export function eraWeight(span, y) {
  const sm = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  return sm(span[0], span[1], y) * (1 - sm(span[2], span[3], y))
}

/**
 * schools.json (a FeatureCollection) into, by island id, { schools, excl }:
 * each school with its place in world units and its eras, each era with
 * its kit, variant, centre, turn and scale; and the polys the settlements
 * and the trees keep off. `proj.toWorld([lon, lat])` gives world [x, z].
 */
export function decodeSchools(fc, proj) {
  const byIsland = new Map()
  for (const f of fc?.features || []) {
    const p = f.properties || {}
    if (p.kind !== 'school' || !Number.isFinite(p.from) || !p.island) continue
    const g = f.geometry || {}
    let ring = null
    if (g.type === 'Polygon') ring = g.coordinates[0].map((c) => proj.toWorld(c))
    else if (g.type === 'MultiPolygon') ring = g.coordinates.map((q) => q[0]).sort((a, b) => b.length - a.length)[0].map((c) => proj.toWorld(c))
    const at = Array.isArray(p.at) ? proj.toWorld(p.at) : g.type === 'Point' ? proj.toWorld(g.coordinates) : null
    let ax = null
    if (ring && ring.length >= 3) {
      if (ring.length > 3) {
        const a = ring[0]
        const b = ring[ring.length - 1]
        if (Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9) ring.pop()
      }
      ax = ringAxes(ring)
    } else ring = null
    if (!ax && !at) continue
    const area = ring ? ringArea(ring) * 1e4 : 0
    const cx = ax ? ax.x : at[0]
    const cz = ax ? ax.z : at[1]
    const isl = byIsland.get(p.island) || { schools: [], excl: { polys: [], lines: [] } }
    byIsland.set(p.island, isl)
    const school = { id: p.id, name: p.name, label: p.label || p.name, type: p.type, from: p.from, to: Number.isFinite(p.to) ? p.to : null, x: cx, z: cz, area, ring, eras: [] }
    for (const e of schoolEras(p, area)) {
      const [x0, x1, z0, z1] = KIT_BOX[e.kit][e.variant]
      const kl = (x1 - x0) / 2
      const kw = (z1 - z0) / 2
      // turned to the grounds' long axis where it has grounds (the kit's own long axis is x), else east–west
      const dir = ax ? ax.th : 0
      let f = 1
      if (ax) {
        f = Math.min(e.kit === 'campus' ? GROW : 1, (0.92 * ax.hu) / (kl * SCHOOL_S), (0.92 * ax.hv) / (kw * SCHOOL_S))
        f = Math.max(SHRINK, f)
      }
      const sc = SCHOOL_S * f
      // (the kit's box centred on the grounds' box or the point: its origin moved back by the box's middle)
      const mx = ((x0 + x1) / 2) * sc
      const mz = ((z0 + z1) / 2) * sc
      const c = Math.cos(dir)
      const s = Math.sin(dir)
      const ox = cx - (mx * c - mz * s)
      const oz = cz - (mx * s + mz * c)
      const span = eraSpan(e)
      const era = { ...e, x: ox, z: oz, dir, scale: sc, hx: kl * sc, hz: kw * sc, span }
      school.eras.push(era)
      const start = e.from - KEEP_SLACK
      const end = e.to === null ? Infinity : e.to + 1 + KEEP_SLACK
      isl.excl.polys.push(boxPoly(cx, cz, dir, kl * sc * 1.04, kw * sc * 1.04, start, end, 'block'))
      if (ring && e.kit === 'campus') {
        const flat = Float32Array.from(ring.flat())
        isl.excl.polys.push({ rings: [flat], box: boxOf([flat]), start, end, part: 'school' })
      }
    }
    isl.schools.push(school)
  }
  return byIsland
}
