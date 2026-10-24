// Missile guidance and seeker maths, kept free of three.js and of G so the
// unit tests can fly a missile at a plain moving point. Vectors are plain
// { x, y, z } objects; game/missiles.js feeds in the island's heat sources
// and turns the results into smoke, sound and blasts.
//
// A heat source is { ref, x, y, z, heat }: `ref` is whatever it stands for
// (an animal, a flare, an engine) and is what a lock holds on to.

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const always = () => true
const _a = { x: 0, y: 0, z: 0 }

// What a seeker at `origin` looking along unit `axis` reads off `src` through
// a cone of half-angle `cone`: 0 outside the cone or beyond range, else its
// heat over distance, a little weaker towards the edge of the cone.
export function seekerSignal(src, origin, axis, cone, S) {
  const dx = src.x - origin.x
  const dy = src.y - origin.y
  const dz = src.z - origin.z
  const d = Math.hypot(dx, dy, dz)
  if (d < 1e-3 || d > S.range) return 0
  const off = Math.acos(clamp((dx * axis.x + dy * axis.y + dz * axis.z) / d, -1, 1))
  if (off > cone) return 0
  const k = d / S.falloff
  return (src.heat / (1 + k * k)) * (1 - S.offAxis * (off / cone) ** 2)
}

// One sweep of a seeker holding (or hunting for) a lock. `lock` is
// { ref, signal, lostT, acquire }: the source it holds, what it last read off
// it, how long it has been out of sight, and whether an empty lock may take
// up the strongest source in view (a launcher hunting for a target may; a
// missile flies only at what it was launched at). `visible(src)` is the
// line-of-sight test, run only on sources that pass the cheap ones.
//
// A held lock is kept until something within `S.gate` of it (the seeker's
// tracking window round the target) reads `S.decoy` times hotter than the
// target did — a flare burning beside it — or until the target has been out
// of the cone or behind cover for `S.grace` seconds. Returns what happened:
// 'none' | 'acquire' | 'hold' | 'blind' | 'switch' | 'lost'; the source in
// view, when there is one, is left in `lock.src`.
export function track(lock, sources, origin, axis, cone, S, dt, visible = always) {
  let best = null
  let bestSignal = 0
  let held = null
  let heldSignal = 0
  // the window round the target, from where it was last seen
  const at = lock.ref != null ? lock.src : null
  let gx = 0
  let gy = 0
  let gz = 0
  if (at) {
    const d = Math.hypot(at.x - origin.x, at.y - origin.y, at.z - origin.z) || 1
    gx = (at.x - origin.x) / d
    gy = (at.y - origin.y) / d
    gz = (at.z - origin.z) / d
  }
  const cosGate = Math.cos(S.gate)
  for (const s of sources) {
    const sig = seekerSignal(s, origin, axis, cone, S)
    if (sig < S.minSignal) continue
    const mine = lock.ref != null && s.ref === lock.ref
    if (at && !mine) {
      // while it holds a target, only what is beside it can take its place
      const dx = s.x - origin.x
      const dy = s.y - origin.y
      const dz = s.z - origin.z
      if ((dx * gx + dy * gy + dz * gz) / (Math.hypot(dx, dy, dz) || 1) < cosGate) continue
    }
    if (!visible(s)) continue
    if (mine) {
      held = s
      heldSignal = sig
    } else if (sig > bestSignal) {
      best = s
      bestSignal = sig
    }
  }
  if (lock.ref == null) {
    if (!best || !lock.acquire) return 'none'
    take(lock, best, bestSignal)
    return 'acquire'
  }
  if (best && bestSignal > Math.max(heldSignal, lock.signal) * S.decoy) {
    take(lock, best, bestSignal)
    return 'switch'
  }
  if (held) {
    take(lock, held, heldSignal)
    return 'hold'
  }
  lock.lostT += dt
  if (lock.lostT > S.grace) {
    lock.ref = null
    lock.src = null
    lock.signal = 0
    return 'lost'
  }
  return 'blind'
}

function take(lock, src, signal) {
  lock.ref = src.ref
  lock.src = src
  lock.signal = signal
  lock.lostT = 0
}

// A missile in flight: { pos, vel, dir, speed, age, lit }. It falls off the
// rail for M.drop seconds, then the motor lights and drives it along `dir`
// (its nose) up to M.maxSpeed for M.motor.burn seconds; after that it coasts
// down with drag and gravity bends its path. With `aim` ({ pos, vel } of the
// target) it steers by proportional navigation plus a share of pure pursuit;
// either way its nose turns no faster than M.turn.
export function flyMissile(m, M, dt, aim = null) {
  m.age += dt
  if (m.age < M.drop) {
    m.vel.y -= M.gravity * dt
    m.pos.x += m.vel.x * dt
    m.pos.y += m.vel.y * dt
    m.pos.z += m.vel.z * dt
    return
  }
  if (!m.lit) {
    m.lit = true
    m.speed = Math.max(0, m.vel.x * m.dir.x + m.vel.y * m.dir.y + m.vel.z * m.dir.z)
  }
  const burning = m.age < M.drop + M.motor.burn
  if (burning) m.speed = Math.min(M.maxSpeed, m.speed + M.motor.accel * dt)
  else m.speed = Math.max(M.stall, m.speed * (1 - M.drag * dt))
  const a = _a
  a.x = a.y = a.z = 0
  if (aim) {
    proNav(m.pos, m.dir, m.speed, aim.pos, aim.vel, M.nav, a)
    // pursuit: the bearing error across the nose, as an acceleration
    const rx = aim.pos.x - m.pos.x
    const ry = aim.pos.y - m.pos.y
    const rz = aim.pos.z - m.pos.z
    const r = Math.hypot(rx, ry, rz) || 1
    const k = M.pursuit * m.speed
    a.x += (rx / r) * k
    a.y += (ry / r) * k
    a.z += (rz / r) * k
  }
  // coasting, gravity pulls the nose down; under thrust the motor holds it up
  if (!burning) a.y -= M.gravity
  turnToward(m.dir, a, Math.min(M.turn, Math.hypot(a.x, a.y, a.z) / Math.max(m.speed, 1)) * dt)
  m.vel.x = m.dir.x * m.speed
  m.vel.y = m.dir.y * m.speed
  m.vel.z = m.dir.z * m.speed
  m.pos.x += m.vel.x * dt
  m.pos.y += m.vel.y * dt
  m.pos.z += m.vel.z * dt
}

// Proportional navigation: an acceleration across the line of sight, N times
// the closing speed times the rate that line is turning. Adds into `out` and
// returns the closing speed (negative: the target is pulling away, and PN
// has nothing to say).
export function proNav(pos, dir, speed, tPos, tVel, N, out) {
  const rx = tPos.x - pos.x
  const ry = tPos.y - pos.y
  const rz = tPos.z - pos.z
  const r = Math.hypot(rx, ry, rz)
  if (r < 1e-3) return 0
  const ux = rx / r
  const uy = ry / r
  const uz = rz / r
  const vx = tVel.x - dir.x * speed
  const vy = tVel.y - dir.y * speed
  const vz = tVel.z - dir.z * speed
  const along = vx * ux + vy * uy + vz * uz
  const closing = -along
  if (closing <= 0) return closing
  // the relative velocity across the line of sight, over range, is the
  // line's turn rate (times r̂ × it)
  const k = (N * closing) / r
  out.x += (vx - ux * along) * k
  out.y += (vy - uy * along) * k
  out.z += (vz - uz * along) * k
  return closing
}

// Swing unit vector `dir` towards the part of `a` across it, by at most
// `angle` radians.
function turnToward(dir, a, angle) {
  const along = a.x * dir.x + a.y * dir.y + a.z * dir.z
  const lx = a.x - dir.x * along
  const ly = a.y - dir.y * along
  const lz = a.z - dir.z * along
  const l = Math.hypot(lx, ly, lz)
  if (l < 1e-6 || angle <= 0) return
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  dir.x = dir.x * c + (lx / l) * s
  dir.y = dir.y * c + (ly / l) * s
  dir.z = dir.z * c + (lz / l) * s
  const n = Math.hypot(dir.x, dir.y, dir.z)
  dir.x /= n
  dir.y /= n
  dir.z /= n
}

// The proximity fuse: how close the missile came to the target during the
// last step, from their separation before (r0) and after (r1) it — the
// relative path is a straight segment, so this is exact for straight flight.
// Returns { d, t }: the miss distance and where along the step (0..1) it was.
export function closestApproach(r0, r1) {
  const ex = r1.x - r0.x
  const ey = r1.y - r0.y
  const ez = r1.z - r0.z
  const e2 = ex * ex + ey * ey + ez * ez
  const t = e2 > 1e-9 ? clamp(-(r0.x * ex + r0.y * ey + r0.z * ez) / e2, 0, 1) : 0
  return { d: Math.hypot(r0.x + ex * t, r0.y + ey * t, r0.z + ez * t), t }
}

// Heat an animal gives off: its body mass scaled to a surface, k · (m/ref)^exp.
export function bodyHeat(mass, H) {
  return H.k * Math.pow(mass / H.ref, H.exp)
}
