// Exterior ballistics (ENGINEERING.md §5 "Shells"; R7 §4.4), ported from R7's
// research/r7-scripts/ballistics_lib.py: a point-mass shell with one
// Mach-dependent drag curve (G7-like, R7's choice), the ISA atmosphere and a
// form factor per shell fitted to its published maximum range. The same
// integrator flies the shells in the sim at 60 Hz and precomputes each gun's
// firing table at load, so the table the aiming aids read is the trajectory
// the shell will fly. Pure JS, no three.js.

export const G = 9.80665
export const STEP = 1 / 60

/** ISA troposphere and lower stratosphere: [density kg/m³, speed of sound m/s] at height h (m). */
export function atmos(h) {
  let T
  let p
  if (h < 11000) {
    T = 288.15 - 0.0065 * h
    p = 101325 * Math.pow(T / 288.15, 5.2559)
  } else {
    T = 216.65
    p = 22632 * Math.exp(-(h - 11000) / 6341.6)
  }
  return [p / (287.05 * T), Math.sqrt(1.4 * 287.05 * T)]
}

// R7's drag curve: Cd against Mach
const CD = [
  [0.0, 0.12],
  [0.7, 0.12],
  [0.85, 0.128],
  [0.95, 0.17],
  [1.0, 0.25],
  [1.05, 0.3],
  [1.1, 0.315],
  [1.2, 0.31],
  [1.5, 0.285],
  [2.0, 0.25],
  [2.5, 0.225],
  [3.0, 0.205],
  [4.0, 0.185],
]
export function cd(M) {
  for (let i = 0; i + 1 < CD.length; i++) {
    const [m0, c0] = CD[i]
    const [m1, c1] = CD[i + 1]
    if (M <= m1) return c0 + ((c1 - c0) * (M - m0)) / (m1 - m0)
  }
  return CD[CD.length - 1][1]
}

/** The drag deceleration factor k so that a = −k·v·v⃗ (per metre): ½ρ·Cd(M)·A·i/m. */
export function dragK(v, y, shell) {
  const [rho, a] = atmos(Math.max(0, y))
  return (0.5 * rho * cd(v / a) * shell.area * shell.i) / shell.mass
}

/** A shell description from a weapon: { mass, area, i, mv }. */
export function shellOf(w, formFactor = w.formFactor ?? 1.3) {
  const d = w.calibreMm / 1000
  return { mass: w.shellKg, area: Math.PI * (d / 2) * (d / 2), i: formFactor, mv: w.mvMs }
}

/**
 * One step of the shell's flight (the sim's and the tables' integrator): the
 * midpoint method on the 2D or 3D state, in place. s = { x, y, z, vx, vy, vz }.
 */
export function stepShell(s, shell, dt = STEP) {
  const v0 = Math.hypot(s.vx, s.vy, s.vz) || 1e-9
  const k0 = dragK(v0, s.y, shell)
  const ax0 = -k0 * v0 * s.vx
  const ay0 = -G - k0 * v0 * s.vy
  const az0 = -k0 * v0 * s.vz
  const hx = s.vx + ax0 * dt * 0.5
  const hy = s.vy + ay0 * dt * 0.5
  const hz = s.vz + az0 * dt * 0.5
  const yh = s.y + s.vy * dt * 0.5
  const vh = Math.hypot(hx, hy, hz) || 1e-9
  const kh = dragK(vh, yh, shell)
  s.x += hx * dt
  s.y += hy * dt
  s.z += hz * dt
  s.vx += -kh * vh * hx * dt
  s.vy += (-G - kh * vh * hy) * dt
  s.vz += -kh * vh * hz * dt
}

/**
 * Fly a shell fired at elevDeg from height h0 to the sea (y = 0).
 * Returns { range, tof, strike, fall } (m, s, m/s, degrees).
 */
export function fly(shell, elevDeg, { h0 = 0, dt = STEP, maxT = 200 } = {}) {
  const e = (elevDeg * Math.PI) / 180
  const s = { x: 0, y: h0, z: 0, vx: shell.mv * Math.cos(e), vy: shell.mv * Math.sin(e), vz: 0 }
  let t = 0
  for (;;) {
    const px = s.x
    const py = s.y
    stepShell(s, shell, dt)
    t += dt
    if (s.y < 0 && s.vy < 0) {
      const f = py / (py - s.y)
      return { range: px + (s.x - px) * f, tof: t - dt + f * dt, strike: Math.hypot(s.vx, s.vy), fall: (Math.atan2(-s.vy, s.vx) * 180) / Math.PI }
    }
    if (t > maxT) return { range: s.x, tof: t, strike: Math.hypot(s.vx, s.vy), fall: 0 }
  }
}

/** The form factor that carries a shell to its published maximum range at its elevation (bisection, R7's fit_i). */
export function fitFormFactor(w, { dt = 0.02 } = {}) {
  let lo = 0.2
  let hi = 3.0
  for (let k = 0; k < 40; k++) {
    const m = (lo + hi) / 2
    const r = fly(shellOf(w, m), w.maxRangeElevDeg ?? 45, { dt }).range
    if (r > w.maxRangeM) lo = m
    else hi = m
  }
  return (lo + hi) / 2
}

/**
 * A gun's firing table, precomputed at load: elevation in steps from 0 to the
 * elevation of the greatest range (or the mount's limit), with the range,
 * time of flight, striking speed and angle of fall at each. h0: the gun's
 * height above the sea.
 */
export function firingTable(w, { maxElevDeg = 45, h0 = 10, stepDeg = 0.25, formFactor, dt = STEP } = {}) {
  const shell = shellOf(w, formFactor)
  const rows = []
  let best = -1
  for (let e = 0; e <= maxElevDeg + 1e-9; e += stepDeg) {
    const r = fly(shell, e, { h0, dt })
    if (r.range <= best) break // (past the greatest range: the table holds the low branch only)
    best = r.range
    rows.push({ elev: e, range: r.range, tof: r.tof, strike: r.strike, fall: r.fall })
  }
  return { weapon: w.id, h0, rows, maxRange: best, shell }
}

/** Interpolate a firing table at a range: { elev, tof, fall, strike, dRdE (m per degree) } or null beyond it. */
export function atRange(table, range) {
  const R = table.rows
  if (!R.length || range > table.maxRange) return null
  if (range <= R[0].range) {
    const r = R[0]
    const r1 = R[1] || r
    const dRdE = (r1.range - r.range) / Math.max(1e-6, r1.elev - r.elev)
    return { elev: r.elev + (range - r.range) / Math.max(1e-6, dRdE), tof: (r.tof * range) / Math.max(1, r.range), fall: r.fall, strike: r.strike, dRdE }
  }
  let lo = 0
  let hi = R.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (R[m].range < range) lo = m
    else hi = m
  }
  const a = R[lo]
  const b = R[hi]
  const t = (range - a.range) / Math.max(1e-9, b.range - a.range)
  return {
    elev: a.elev + (b.elev - a.elev) * t,
    tof: a.tof + (b.tof - a.tof) * t,
    fall: a.fall + (b.fall - a.fall) * t,
    strike: a.strike + (b.strike - a.strike) * t,
    dRdE: (b.range - a.range) / Math.max(1e-6, b.elev - a.elev),
  }
}
