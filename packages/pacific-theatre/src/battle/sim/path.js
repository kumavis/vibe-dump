// Closed-form motion (ENGINEERING.md §5 "scripted motion is closed-form in
// t"): a ship's track as a cubic Hermite through its fixes, a station on a
// guide, and an aircraft's flight plan as legs (keyframes through a
// time-parameterised Catmull-Rom spline, an orbit about a moving unit, a
// formation slot on another aircraft). Pure functions of t, so setTime(t) is
// cheap and a replay is exact.

export const DEG = Math.PI / 180
const TAU = Math.PI * 2

/** The unit vector of a compass course: x east, z south. */
export const courseVec = (deg) => [Math.sin(deg * DEG), -Math.cos(deg * DEG)]
/** The compass heading of a velocity (x east, z south), 0..360. */
export const headingOf = (vx, vz) => (Math.atan2(vx, -vz) / DEG + 360) % 360
export const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180

/**
 * A track: fixes [{ t, x, z, course, speed }] sorted by t. Between fixes a
 * cubic Hermite whose tangents lie along each fix's course with the chord's
 * length, so the ship passes every fix on its course and the speed between
 * is the record's distance over the record's time; before the first fix and
 * after the last it runs on at that fix's course and speed for an hour, and
 * then holds where that leaves it.
 */
export const EXTRAPOLATE_S = 3600
export function trackAt(track, t, out) {
  const n = track.length
  const a0 = track[0]
  const last = track[n - 1]
  if (t <= a0.t || t >= last.t || n === 1) {
    // beyond the record's fixes the ship runs on at the nearest fix's course and speed for an hour, then holds there
    const f = t <= a0.t ? a0 : last
    const raw = t - f.t
    const dt = Math.max(-EXTRAPOLATE_S, Math.min(EXTRAPOLATE_S, raw))
    const moving = Math.abs(raw) < EXTRAPOLATE_S
    out.x = f.x + f.ux * f.speed * dt
    out.z = f.z + f.uz * f.speed * dt
    out.vx = moving ? f.ux * f.speed : 0
    out.vz = moving ? f.uz * f.speed : 0
    out.course = f.course
    return out
  }
  let lo = 0
  let hi = n - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (track[m].t <= t) lo = m
    else hi = m
  }
  const a = track[lo]
  const b = track[hi]
  const T = b.t - a.t
  const s = (t - a.t) / T
  const D = a.chord
  const s2 = s * s
  const s3 = s2 * s
  const h00 = 2 * s3 - 3 * s2 + 1
  const h10 = s3 - 2 * s2 + s
  const h01 = -2 * s3 + 3 * s2
  const h11 = s3 - s2
  out.x = h00 * a.x + h10 * a.ux * D + h01 * b.x + h11 * b.ux * D
  out.z = h00 * a.z + h10 * a.uz * D + h01 * b.z + h11 * b.uz * D
  const d00 = 6 * s2 - 6 * s
  const d10 = 3 * s2 - 4 * s + 1
  const d01 = -6 * s2 + 6 * s
  const d11 = 3 * s2 - 2 * s
  out.vx = (d00 * a.x + d10 * a.ux * D + d01 * b.x + d11 * b.ux * D) / T
  out.vz = (d00 * a.z + d10 * a.uz * D + d01 * b.z + d11 * b.uz * D) / T
  // the heading eases between the fixes' courses when the ship barely moves
  const c = wrap180(b.course - a.course)
  out.course = (a.course + c * s + 360) % 360
  return out
}

/** Prepare a track's fixes: unit vectors and chords. */
export function prepareTrack(fixes) {
  fixes.sort((p, q) => p.t - q.t)
  for (const f of fixes) {
    const [ux, uz] = courseVec(f.course)
    f.ux = ux
    f.uz = uz
  }
  for (let i = 0; i < fixes.length; i++) {
    const b = fixes[i + 1]
    fixes[i].chord = b ? Math.hypot(b.x - fixes[i].x, b.z - fixes[i].z) : 0
  }
  return fixes
}

// --- aircraft legs ------------------------------------------------------------

/**
 * Catmull-Rom through time-stamped keys [{ t, x, y, z }] (at least two). The height is kept monotone
 * between keys (Fritsch–Carlson): a key between a climb and a descent, or beside a level stretch, has
 * no vertical tangent, and no tangent is steeper than three times the slope either side of it, so the
 * path never dips below the lower of two keys. A plain Catmull-Rom tangent after a steep descent onto a
 * long low run (a torpedo plane coming down to 60 m for its run, a fighter down to its field) carried the
 * aircraft some 25 m under the sea before it rose to the next key.
 */
export function keysAt(keys, t, out) {
  const n = keys.length
  if (t <= keys[0].t) {
    const k = keys[0]
    out.x = k.x
    out.y = k.y
    out.z = k.z
    return out
  }
  if (t >= keys[n - 1].t) {
    const k = keys[n - 1]
    out.x = k.x
    out.y = k.y
    out.z = k.z
    return out
  }
  let lo = 0
  let hi = n - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (keys[m].t <= t) lo = m
    else hi = m
  }
  const a = keys[lo]
  const b = keys[hi]
  const p = keys[lo - 1] || null
  const q = keys[hi + 1] || null
  const T = b.t - a.t
  const s = (t - a.t) / T
  const s2 = s * s
  const s3 = s2 * s
  const h00 = 2 * s3 - 3 * s2 + 1
  const h10 = s3 - 2 * s2 + s
  const h01 = -2 * s3 + 3 * s2
  const h11 = s3 - s2
  for (let ci = 0; ci < 3; ci++) {
    const c = ci === 0 ? 'x' : ci === 1 ? 'y' : 'z'
    // tangents (per second) from the neighbours, scaled to the interval;
    // a key marked `corner` keeps the straight line into and out of it
    let m0 = p && !a.corner ? (b[c] - p[c]) / (b.t - p.t) : (b[c] - a[c]) / T
    let m1 = q && !b.corner ? (q[c] - a[c]) / (q.t - a.t) : (b[c] - a[c]) / T
    if (ci === 1) {
      const d = (b.y - a.y) / T
      if (p && !a.corner) m0 = monotone(m0, (a.y - p.y) / (a.t - p.t), d)
      if (q && !b.corner) m1 = monotone(m1, d, (q.y - b.y) / (q.t - b.t))
    }
    out[c] = h00 * a[c] + h10 * m0 * T + h01 * b[c] + h11 * m1 * T
  }
  return out
}

/** A key's vertical tangent m, limited by the slopes before (d0) and after (d1) it (Fritsch–Carlson). */
function monotone(m, d0, d1) {
  if (d0 * d1 <= 0) return 0
  const lim = 3 * Math.min(Math.abs(d0), Math.abs(d1))
  return Math.sign(d1) * Math.min(Math.abs(m), lim)
}

/**
 * Evaluate a flight plan (legs sorted by t0) at t. resolve(ref, t, out) gives
 * the pose { x, y, z, heading } of an orbit's centre (a unit) or a
 * formation leader. Returns out { x, y, z } or null outside the plan.
 */
export function planAt(plan, t, out, resolve) {
  const legs = plan.legs
  if (!legs.length || t < legs[0].t0 || t > legs[legs.length - 1].t1) return null
  let leg = legs[0]
  for (let i = 0; i < legs.length; i++) {
    if (t >= legs[i].t0) leg = legs[i]
    else break
  }
  return legAt(leg, Math.min(t, leg.t1), out, resolve)
}

const TMP = { x: 0, y: 0, z: 0, vx: 0, vz: 0, heading: 0 }
export function legAt(leg, t, out, resolve) {
  if (leg.type === 'keys') return keysAt(leg.keys, t, out)
  if (leg.type === 'orbit') {
    resolve(leg.centre, t, TMP)
    const a = leg.phase + (t - leg.t0) * leg.w
    out.x = TMP.x + Math.cos(a) * leg.r
    out.z = TMP.z + Math.sin(a) * leg.r
    out.y = leg.alt + Math.sin(a * 0.5 + leg.phase) * 40
    return out
  }
  if (leg.type === 'follow') {
    resolve(leg.leader, t, TMP)
    const h = TMP.heading * DEG
    const fx = Math.sin(h)
    const fz = -Math.cos(h)
    const o = leg.off
    const weave = leg.weave ? Math.sin((t - leg.t0) * leg.weave + leg.phase) * 250 : 0
    out.x = TMP.x - fz * (o.right + weave) - fx * o.back
    out.z = TMP.z + fx * (o.right + weave) - fz * o.back
    out.y = Math.max(60, TMP.y + o.up)
    return out
  }
  throw new Error(`leg type ${leg.type}`)
}

/** A formation slot in a group: vees of three in echelon (metres right, back, up). */
export function slotOffset(k) {
  const sec = Math.floor(k / 3)
  const p = k % 3
  const right = (p === 0 ? 0 : p === 1 ? -45 : 45) + (sec % 2 ? 60 : 0)
  const back = (p === 0 ? 0 : 35) + sec * 140
  const up = sec * 25 * (sec % 2 ? -1 : 1)
  return { right, back, up }
}

/** Move (x, z) by a slot offset in the frame of a heading (deg). */
export function offsetBy(x, z, headingDeg, o) {
  const h = headingDeg * DEG
  const fx = Math.sin(h)
  const fz = -Math.cos(h)
  return [x - fz * o.right - fx * o.back, z + fx * o.right - fz * o.back]
}

/**
 * A falling aircraft's path from its state at the loss (closed form): the
 * horizontal speed decays over 8 s, the sink approaches 45 m/s. Returns
 * { at(τ, out), tImpact } with τ seconds since the loss.
 */
export function fallPath(x0, y0, z0, vx, vy, vz, groundAt = () => 0) {
  const TH = 8
  const TV = 6
  const VT = 45
  const at = (tau, out) => {
    const eh = 1 - Math.exp(-tau / TH)
    const ev = 1 - Math.exp(-tau / TV)
    out.x = x0 + vx * TH * eh
    out.z = z0 + vz * TH * eh
    out.y = y0 + TV * (vy + VT) * ev - VT * tau
    out.vx = vx * Math.exp(-tau / TH)
    out.vz = vz * Math.exp(-tau / TH)
    out.vy = (vy + VT) * Math.exp(-tau / TV) - VT
    return out
  }
  const o = {}
  let tau = 0
  for (; tau < 300; tau += 0.25) {
    at(tau, o)
    if (o.y <= groundAt(o.x, o.z)) break
  }
  return { at, tImpact: tau }
}

export { TAU }
