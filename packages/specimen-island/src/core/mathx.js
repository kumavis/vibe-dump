// Small scalar helpers shared by every system.

export const TAU = Math.PI * 2

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const invLerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1)
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// Frame-rate independent exponential approach.
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt))

export function wrapAngle(a) {
  a = (a + Math.PI) % TAU
  if (a < 0) a += TAU
  return a - Math.PI
}

export function dampAngle(current, target, lambda, dt) {
  return current + wrapAngle(target - current) * (1 - Math.exp(-lambda * dt))
}

// Rotate `current` toward `target` by at most `maxStep` radians.
export function stepAngle(current, target, maxStep) {
  const d = wrapAngle(target - current)
  if (Math.abs(d) <= maxStep) return target
  return current + Math.sign(d) * maxStep
}

export const dist2 = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz)

// Yaw convention for the whole game: yaw 0 faces -Z (north), positive yaw turns
// left (counter-clockwise seen from above) — the same as a three.js camera.
export const yawTo = (fromX, fromZ, toX, toZ) => Math.atan2(-(toX - fromX), -(toZ - fromZ))
export const yawDirX = (yaw) => -Math.sin(yaw)
export const yawDirZ = (yaw) => -Math.cos(yaw)

// Distance from point P to segment AB in the XZ plane, with the projection t.
export function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz
  let t = l2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / l2 : 0
  t = clamp(t, 0, 1)
  const cx = ax + dx * t
  const cz = az + dz * t
  return { d: Math.hypot(px - cx, pz - cz), t }
}

export function formatTime(hours) {
  const h = Math.floor(hours) % 24
  const m = Math.floor((hours - Math.floor(hours)) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
