// Sight (ENGINEERING.md §5 "Sight", R7 §4.9): who can see whom. Optics with
// a range by light level (the sun's altitude at the box from the battle
// clock's instant), lit by star shells, searchlights, fires and gun flashes;
// radar where the kit carries it at the battle's date; squalls and smoke
// screens that block a line of sight; the ground that blocks it. The AI aims
// only at what it can see. R7's ranges are the starting values (verify).

import { P } from './params.js'
import { DEG } from './units.js'

const V = P.sight

/** The sun's altitude (degrees) at a UTC instant and a place (NOAA's low-precision formulas). */
export function sunAltitude(utcMs, lat, lon) {
  const d = utcMs / 86400000 + 2440587.5 - 2451545.0
  const g = (357.529 + 0.98560028 * d) * DEG
  const q = 280.459 + 0.98564736 * d
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG
  const e = (23.439 - 0.00000036 * d) * DEG
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L))
  const dec = Math.asin(Math.sin(e) * Math.sin(L))
  const gmst = ((18.697374558 + 24.06570982441908 * d) % 24) * 15 * DEG
  const ha = gmst + lon * DEG - ra
  const alt = Math.asin(Math.sin(lat * DEG) * Math.sin(dec) + Math.cos(lat * DEG) * Math.cos(dec) * Math.cos(ha))
  return alt / DEG
}

/** The light: 'day' above −0.8°, 'twilight' to −12°, else 'night'. */
export const lightOf = (alt) => (alt > -0.8 ? 'day' : alt > -12 ? 'twilight' : 'night')

/** A point inside a polygon [[x, z], ...] (even-odd). */
export function inPolygon(x, z, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside
  }
  return inside
}

/** Whether segment p→q crosses segment a→b (2D). */
function crosses(px, pz, qx, qz, ax, az, bx, bz) {
  const d = (qx - px) * (bz - az) - (qz - pz) * (bx - ax)
  if (Math.abs(d) < 1e-9) return false
  const u = ((ax - px) * (bz - az) - (az - pz) * (bx - ax)) / d
  const v = ((ax - px) * (qz - pz) - (az - pz) * (qx - px)) / d
  return u >= 0 && u <= 1 && v >= 0 && v <= 1
}

/** The distance from a point to a segment (2D). */
function segDist(x, z, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const L = dx * dx + dz * dz
  const s = L > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0
  return Math.hypot(ax + dx * s - x, az + dz * s - z)
}

/**
 * The sight model of one box. env: { lat, lon, clock, weather, squalls,
 * world }. Each frame the sim calls update(t) and the lights it knows.
 */
export class Sight {
  constructor(env) {
    this.env = env
    this.vis = Math.min(V.dayM, env.weather?.visibilityM ?? V.dayM)
    this.light = 'day'
    this.alt = 90
    this.smokes = [] // { ax, az, bx, bz, t0, t1, vx, vz, r }
    this.lights = [] // { x, y, z, r, until, kind }
    this.t = 0
  }

  update(t) {
    this.t = t
    this.alt = sunAltitude(this.env.clock.utc(t), this.env.lat, this.env.lon)
    this.light = lightOf(this.alt)
    this.lights = this.lights.filter((l) => l.until > t)
  }

  /** A light that reveals what is near it (a star shell, a searchlight's pool, a fire, a gun flash). */
  addLight(x, y, z, r, untilT, kind) {
    this.lights.push({ x, y, z, r, until: untilT, kind })
  }

  addSmoke(ax, az, bx, bz, t0, t1, vx, vz) {
    this.smokes.push({ ax, az, bx, bz, t0, t1, vx, vz, r: V.smokeRadiusM })
  }

  /** Whether a point is lit (by day always). */
  lit(x, y, z, extra = false) {
    if (this.light === 'day') return true
    if (extra) return true
    for (const l of this.lights) if (Math.hypot(l.x - x, l.z - z) < l.r) return true
    return false
  }

  /** The visual range on a target of a size class ('big' | 'small') at its point. */
  visualRange(x, y, z, big, litExtra = false) {
    if (this.light === 'day') return this.vis
    const lit = this.lit(x, y, z, litExtra)
    if (lit) return Math.min(this.vis, V.nightLitM)
    const r = big ? V.nightUnlitBigM : V.nightUnlitSmallM
    return this.light === 'twilight' ? Math.min(this.vis, r * 1.8) : r
  }

  /** Whether the line between two points is blocked by smoke or a squall (and the squall's own range). */
  weatherLimit(ax, ay, az, bx, by, bz) {
    let lim = Infinity
    const t = this.t
    for (const s of this.env.squalls || []) {
      if (t < s.t0 || t > s.t1 || !s.poly.length) continue
      const dt = Number.isFinite(s.t0) ? t - s.t0 : 0
      const ox = s.vx * dt
      const oz = s.vz * dt
      const inA = inPolygon(ax - ox, az - oz, s.poly)
      const inB = inPolygon(bx - ox, bz - oz, s.poly)
      let through = inA || inB
      for (let i = 0; !through && i + 1 < s.poly.length; i++) {
        const [px, pz] = s.poly[i]
        const [qx, qz] = s.poly[i + 1]
        if (crosses(ax - ox, az - oz, bx - ox, bz - oz, px, pz, qx, qz)) through = true
      }
      if (through) lim = Math.min(lim, V.squallVisM)
    }
    if (ay < 300 || by < 300) {
      for (const s of this.smokes) {
        if (t < s.t0 || t > s.t1) continue
        const dt = t - s.t0
        const ox = s.vx * dt
        const oz = s.vz * dt
        // a smoke screen: a band of radius r about its line, drifting with the wind
        const sax = s.ax + ox
        const saz = s.az + oz
        const sbx = s.bx + ox
        const sbz = s.bz + oz
        if (crosses(ax, az, bx, bz, sax, saz, sbx, sbz) || segDist(ax, az, sax, saz, sbx, sbz) < s.r || segDist(bx, bz, sax, saz, sbx, sbz) < s.r) lim = Math.min(lim, s.r)
      }
    }
    return lim
  }

  /**
   * Can an observer see a target? obs: { x, y, z, sensors (['sg', ...]) },
   * tgt: { x, y, z, big, aircraft, lit }. Returns null or { range, how:
   * 'visual' | 'radar' }.
   */
  sees(obs, tgt) {
    const d = Math.hypot(tgt.x - obs.x, tgt.z - obs.z)
    // radar first: SG and fire-control radars see ships, SC aircraft, at night and through squalls (not through land)
    let radar = 0
    for (const s of obs.sensors || []) {
      const r = V.radar[s] ?? 0
      if (tgt.aircraft ? s === 'sc' || s === 'sg' : s !== 'sc') radar = Math.max(radar, r)
    }
    const ground = this.env.world
    const clear = !ground || ground.lineOfSight({ x: obs.x, y: Math.max(obs.y, 20), z: obs.z }, { x: tgt.x, y: Math.max(tgt.y, 10), z: tgt.z })
    if (!clear) return null
    const vr = Math.min(this.visualRange(tgt.x, tgt.y, tgt.z, tgt.big, tgt.lit), this.weatherLimit(obs.x, obs.y, obs.z, tgt.x, tgt.y, tgt.z))
    if (d <= vr) return { range: d, how: 'visual' }
    if (d <= radar) return { range: d, how: 'radar' }
    return null
  }
}
