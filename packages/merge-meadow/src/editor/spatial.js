// Pure placement math the editor needs without importing three: rays and
// poses arrive as plain {x,y,z} / [x,y,z] / yaw-in-radians. Yaw follows three's
// camera convention: yaw 0 looks down -Z, positive yaw turns left.
const r3 = (x) => Math.round(x * 1000) / 1000 + 0 // + 0: no -0 in stored positions
export const forwardOf = (yaw) => [-Math.sin(yaw), -Math.cos(yaw)]
const v3 = (v) => (Array.isArray(v) ? v : v ? [v.x, v.y, v.z] : [0, 0, 0])

// a point on the ground `dist` metres ahead of a pose { p, yaw }
export function aheadOf (pose, dist = 6, ground = () => 0) {
  const p = v3(pose?.p)
  const [fx, fz] = forwardOf(Number(pose?.yaw) || 0)
  const x = p[0] + fx * dist; const z = p[2] + fz * dist
  return [r3(x), r3(ground(x, z) || 0), r3(z)]
}

// where a ray (origin, direction) meets the plane y = h; null if it never does
// (looking at the sky) or does so absurdly far away
export function groundHit (origin, dir, { h = 0, maxDist = 500 } = {}) {
  const o = v3(origin); const d = v3(dir)
  if (!(Math.abs(d[1]) > 1e-6)) return null
  const t = (h - o[1]) / d[1]
  if (!(t > 0) || t > maxDist) return null
  return [r3(o[0] + d[0] * t), h, r3(o[2] + d[2] * t)]
}

// a camera pose that frames point `target`: `dist` back along the current
// heading, raised by `height`, with the yaw and pitch that look straight at it
export function focusPose (target, { yaw = 0, dist = 8, height = 3 } = {}) {
  const t = v3(target)
  const [fx, fz] = forwardOf(yaw)
  const p = [t[0] - fx * dist, t[1] + height, t[2] - fz * dist]
  const dx = t[0] - p[0]; const dy = t[1] + 0.8 - p[1]; const dz = t[2] - p[2]
  return { p: p.map(r3), yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) }
}

// pitch (radians, + up) from a head quaternion [x,y,z,w] (the camera looks down -Z)
export function pitchOfQuat (q) {
  if (!Array.isArray(q) || q.length < 4) return 0
  const [x, y, z, w] = q
  const fx = -(2 * (x * z + w * y)); const fy = -(2 * (y * z - w * x)); const fz = -(1 - 2 * (x * x + y * y))
  return Math.atan2(fy, Math.hypot(fx, fz))
}

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))
// the look() deltas that turn (yaw, pitch) into (yaw2, pitch2)
export const lookDelta = (from, to) => ({ dYaw: wrap(to.yaw - from.yaw), dPitch: to.pitch - from.pitch })

// the nearest entity with a mount within `maxDist` of p; entities: iterable of
// world rows ({ id, c, live }); skips the dead and whoever is already riding it
export function nearestMount (entities, p, { maxDist = 3.5, exclude = () => false } = {}) {
  const q = v3(p)
  let best = null; let bestD = maxDist
  for (const e of entities) {
    if (!e?.c?.mount || exclude(e)) continue
    if (e.c.tags?.dead) continue
    const lp = e.live?.p ?? e.c.transform?.p
    if (!lp) continue
    const d = Math.hypot(lp[0] - q[0], lp[2] - q[2])
    if (d <= bestD) { best = e.id; bestD = d }
  }
  return best
}
