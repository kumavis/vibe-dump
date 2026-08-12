// Local circumstances for the 2026 Aug 12 total solar eclipse, computed from
// NASA's published Besselian elements (eclipse.gsfc.nasa.gov, reference epoch
// t0 = 18:00:00 TDT, ΔT = 71.4 s). All angles internally in radians; times in
// decimal hours TDT relative to t0.

const DEG = Math.PI / 180

const T0_TDT_HOURS = 18 // 18:00:00 TDT on 2026-08-12
const DELTA_T = 71.4 // seconds, TDT - UT1

const X = [0.475593, 0.5189288, -0.0000773, -0.0000088]
const Y = [0.771161, -0.2301664, -0.0001245, 0.0000037]
const D = [14.79667, -0.012065, -0.000003, 0]
const L1 = [0.537954, 0.0000940, -0.0000121, 0]
const L2 = [-0.008142, 0.0000935, -0.0000121, 0]
const MU = [88.74776, 15.003093, 0, 0]
const TAN_F1 = 0.0046141
const TAN_F2 = 0.0045911

// Earth rotates 1.002738 sidereal units per UT unit; elements are tabulated in
// TDT, so the observer hour angle needs a ΔT spin correction (degrees).
const MU_DT_CORR = 1.002738 * 15 * (DELTA_T / 3600)

const FLAT = 0.99664719 // 1 - f (IAU ellipsoid, as used in eclipse work)
const EARTH_RADIUS_KM = 6378.137

function poly(c, t) {
  return c[0] + t * (c[1] + t * (c[2] + t * c[3]))
}
function dpoly(c, t) {
  return c[1] + t * (2 * c[2] + t * 3 * c[3])
}

// Precompute observer's geocentric position terms.
export function makeObserver(latDeg, lonDeg, heightM = 0) {
  const lat = latDeg * DEG
  const u = Math.atan(FLAT * Math.tan(lat))
  const hFrac = heightM / (EARTH_RADIUS_KM * 1000)
  return {
    latDeg,
    lonDeg,
    rhoSin: FLAT * Math.sin(u) + hFrac * Math.sin(lat),
    rhoCos: Math.cos(u) + hFrac * Math.cos(lat),
  }
}

// Core geometry at TDT hour offset t for a prepared observer.
function circumstancesAt(obs, t) {
  const x = poly(X, t)
  const y = poly(Y, t)
  const d = poly(D, t) * DEG
  const mu = poly(MU, t)
  const l1 = poly(L1, t)
  const l2 = poly(L2, t)

  const dx = dpoly(X, t)
  const dy = dpoly(Y, t)
  const dd = dpoly(D, t) * DEG
  const dmu = dpoly(MU, t) * DEG // rad/hour

  const H = (mu + obs.lonDeg - MU_DT_CORR) * DEG
  const sinD = Math.sin(d)
  const cosD = Math.cos(d)
  const sinH = Math.sin(H)
  const cosH = Math.cos(H)

  const xi = obs.rhoCos * sinH
  const eta = obs.rhoSin * cosD - obs.rhoCos * sinD * cosH
  const zeta = obs.rhoSin * sinD + obs.rhoCos * cosD * cosH

  const dxi = dmu * obs.rhoCos * cosH
  const deta = dmu * xi * sinD - zeta * dd

  const u = x - xi
  const v = y - eta
  const du = dx - dxi
  const dv = dy - deta

  const l1p = l1 - zeta * TAN_F1
  const l2p = l2 - zeta * TAN_F2

  // Sun altitude (shadow-axis direction is the Sun direction to high accuracy)
  const sinAlt =
    obs.rhoSin * sinD + obs.rhoCos * cosD * cosH // == zeta, geocentric approx
  return { t, u, v, du, dv, l1p, l2p, zeta, sinAlt, H, d }
}

// Find the time of maximum eclipse (Newton on the closest-approach condition).
function findMaximum(obs) {
  let t = -0.2 // near greatest eclipse (17:47 TDT)
  for (let i = 0; i < 12; i++) {
    const c = circumstancesAt(obs, t)
    const n2 = c.du * c.du + c.dv * c.dv
    const tau = -(c.u * c.du + c.v * c.dv) / n2
    t += tau
    if (Math.abs(tau) < 1e-8) break
  }
  return t
}

// Solve m(t) = |radius(t)| contacts around the maximum. sign=-1 first contact,
// +1 last contact. Returns TDT hour offset or null.
function findContact(obs, tMax, useUmbra, sign) {
  let t = tMax
  for (let i = 0; i < 30; i++) {
    const c = circumstancesAt(obs, t)
    const L = Math.abs(useUmbra ? c.l2p : c.l1p)
    const n2 = c.du * c.du + c.dv * c.dv
    const w = (c.u * c.dv - c.v * c.du) // n * m * sin(angle)
    const disc = L * L * n2 - w * w
    if (disc < 0) return null
    const tau = (-(c.u * c.du + c.v * c.dv) + sign * Math.sqrt(disc)) / n2
    t += tau
    if (Math.abs(tau) < 1e-8) return t
  }
  return t
}

function tdtToUtcMs(t) {
  // 2026-08-12 00:00 UTC epoch
  const dayStart = Date.UTC(2026, 7, 12)
  return dayStart + (T0_TDT_HOURS + t) * 3600e3 - DELTA_T * 1e3
}

/**
 * Full local circumstances for a location.
 * Returns null if no eclipse is visible (sun below horizon or no overlap).
 */
export function localCircumstances(latDeg, lonDeg, heightM = 0) {
  const obs = makeObserver(latDeg, lonDeg, heightM)
  const tMax = findMaximum(obs)
  const c = circumstancesAt(obs, tMax)
  const m = Math.hypot(c.u, c.v)
  const magnitude = (c.l1p - m) / (c.l1p + c.l2p)
  if (magnitude <= 0) return null

  const altDeg = Math.asin(Math.max(-1, Math.min(1, c.sinAlt))) / DEG
  // Compass azimuth of the Sun at maximum (0°=N, 90°=E …): the low eclipse sun
  // means the horizon in exactly this direction decides whether you see it.
  const lat = latDeg * DEG
  const A = Math.atan2(
    Math.sin(c.H),
    Math.cos(c.H) * Math.sin(lat) - Math.tan(c.d) * Math.cos(lat),
  )
  const sunAzDeg = ((A / DEG + 180) % 360 + 360) % 360
  const total = m < Math.abs(c.l2p)

  const res = {
    lat: latDeg,
    lon: lonDeg,
    maxUtcMs: tdtToUtcMs(tMax),
    magnitude,
    sunAltDeg: altDeg,
    sunAzDeg,
    total,
    totalityS: 0,
    c1UtcMs: null,
    c2UtcMs: null,
    c3UtcMs: null,
    c4UtcMs: null,
  }

  const c1 = findContact(obs, tMax, false, -1)
  const c4 = findContact(obs, tMax, false, +1)
  if (c1 != null) res.c1UtcMs = tdtToUtcMs(c1)
  if (c4 != null) res.c4UtcMs = tdtToUtcMs(c4)

  if (total) {
    const c2 = findContact(obs, tMax, true, -1)
    const c3 = findContact(obs, tMax, true, +1)
    if (c2 != null && c3 != null) {
      res.c2UtcMs = tdtToUtcMs(c2)
      res.c3UtcMs = tdtToUtcMs(c3)
      res.totalityS = (c3 - c2) * 3600
    }
  }
  return res
}

/** Fast totality duration in seconds (0 if partial only). */
export function totalityDurationS(latDeg, lonDeg) {
  const r = localCircumstances(latDeg, lonDeg)
  return r && r.total ? r.totalityS : 0
}
