// Oriented boxes on the table: a chunk's `shape` is a box turned by `yaw`
// about +y. Line of sight is a 3D segment against these boxes, and a blast
// measures how far its centre is from each one.
import { hypot3 } from '../dmath.js'

// Segment a→a+d against an oriented box (yaw about +y).
export function segmentHitsBox(a, dx, dy, dz, s) {
  const c = Math.cos(s.yaw), sn = Math.sin(s.yaw)
  const ox = a.x - s.x, oy = a.y - s.y, oz = a.z - s.z
  const p = [ox * c - oz * sn, oy, ox * sn + oz * c]
  const d = [dx * c - dz * sn, dy, dx * sn + dz * c]
  const h = [s.hx, s.hy, s.hz]
  let t0 = 0, t1 = 1
  for (let k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-9) {
      if (Math.abs(p[k]) > h[k]) return false
    } else {
      let ta = (-h[k] - p[k]) / d[k], tb = (h[k] - p[k]) / d[k]
      if (ta > tb) [ta, tb] = [tb, ta]
      if (ta > t0) t0 = ta
      if (tb < t1) t1 = tb
      if (t0 > t1) return false
    }
  }
  return true
}

// Distance from a point to an oriented box (0 inside it).
export function distToBox(x, y, z, s) {
  const c = Math.cos(s.yaw), sn = Math.sin(s.yaw)
  const ox = x - s.x, oy = y - s.y, oz = z - s.z
  const lx = ox * c - oz * sn, lz = ox * sn + oz * c
  const qx = Math.max(0, Math.abs(lx) - s.hx), qy = Math.max(0, Math.abs(oy) - s.hy), qz = Math.max(0, Math.abs(lz) - s.hz)
  return hypot3(qx, qy, qz)
}
