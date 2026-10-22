// The sim's colliders (ENGINEERING.md §5 "sim.pick"; "hits by oriented-box
// test against the target"): an oriented box per ship (waterline to the
// superstructure, turned by its heading) and a sphere per aircraft. Pure
// functions over the state arrays.

import { DEG } from './units.js'

/**
 * A segment a→b against a ship's box: centre (cx, cz), heading (deg), half
 * beam hx, half length hz, heights yLo..yHi. Returns the entry fraction
 * 0..1 and the local hit point in out { s, lx, ly, lz } (lz < 0 toward the
 * bow), or −1.
 */
export function segmentBox(ax, ay, az, bx, by, bz, cx, cz, heading, hx, hz, yLo, yHi, out) {
  const h = heading * DEG
  const rx = Math.cos(h)
  const rz = Math.sin(h)
  const fx = Math.sin(h)
  const fz = -Math.cos(h)
  // into the box frame: x right, z toward the stern
  const pax = (ax - cx) * rx + (az - cz) * rz
  const paz = -((ax - cx) * fx + (az - cz) * fz)
  const pbx = (bx - cx) * rx + (bz - cz) * rz
  const pbz = -((bx - cx) * fx + (bz - cz) * fz)
  let t0 = 0
  let t1 = 1
  const slab = (p0, p1, lo, hi) => {
    const d = p1 - p0
    if (Math.abs(d) < 1e-12) return p0 >= lo && p0 <= hi
    let ta = (lo - p0) / d
    let tb = (hi - p0) / d
    if (ta > tb) [ta, tb] = [tb, ta]
    if (ta > t0) t0 = ta
    if (tb < t1) t1 = tb
    return t0 <= t1
  }
  if (!slab(pax, pbx, -hx, hx)) return -1
  if (!slab(paz, pbz, -hz, hz)) return -1
  if (!slab(ay, by, yLo, yHi)) return -1
  if (out) {
    out.s = t0
    out.lx = pax + (pbx - pax) * t0
    out.ly = ay + (by - ay) * t0
    out.lz = paz + (pbz - paz) * t0
  }
  return t0
}

/** A ray (origin, direction) against a ship's box: the distance along it, or −1. */
export function rayBox(ox, oy, oz, dx, dy, dz, cx, cz, heading, hx, hz, yLo, yHi, far = 1e6) {
  const s = segmentBox(ox, oy, oz, ox + dx * far, oy + dy * far, oz + dz * far, cx, cz, heading, hx, hz, yLo, yHi, null)
  return s < 0 ? -1 : s * far
}

/** The closest approach of a segment to a point: the squared distance and the fraction. */
export function segmentPoint(ax, ay, az, bx, by, bz, px, py, pz, out) {
  const dx = bx - ax
  const dy = by - ay
  const dz = bz - az
  const L = dx * dx + dy * dy + dz * dz
  let s = L > 0 ? ((px - ax) * dx + (py - ay) * dy + (pz - az) * dz) / L : 0
  s = Math.max(0, Math.min(1, s))
  const qx = ax + dx * s - px
  const qy = ay + dy * s - py
  const qz = az + dz * s - pz
  if (out) out.s = s
  return qx * qx + qy * qy + qz * qz
}

/** The horizontal distance from a point to a ship's box (0 inside), for near misses and straddles. */
export function boxDistance(x, z, cx, cz, heading, hx, hz) {
  const h = heading * DEG
  const lx = (x - cx) * Math.cos(h) + (z - cz) * Math.sin(h)
  const lz = -((x - cx) * Math.sin(h) + (z - cz) * -Math.cos(h))
  const ex = Math.max(0, Math.abs(lx) - hx)
  const ez = Math.max(0, Math.abs(lz) - hz)
  return { d: Math.hypot(ex, ez), lx, lz }
}
