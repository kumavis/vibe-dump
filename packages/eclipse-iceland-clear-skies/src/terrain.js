// The eclipsed Sun stands only ~25° above the horizon here, so a fjord wall or
// mountain along the Sun's azimuth can hide totality outright. This module
// samples a terrain profile toward the Sun (Open-Meteo elevation API, ~90 m
// Copernicus DEM) and reports the highest apparent ridge angle.

const EARTH_R_KM = 6371
const DEG = Math.PI / 180

// Sample distances (km) — dense inside 6 km, where a wall steals the most sky
// (to reach even a "tight" verdict beyond 6 km would take a >2000 m ridge,
// taller than anything in Iceland). ~250-400 m spacing so a steep fjord crest
// can't slip between samples of the 90 m DEM.
export const DISTS_KM = [
  0.15, 0.3, 0.45, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.25, 2.5, 2.75,
  3.0, 3.3, 3.6, 4.0, 4.4, 4.8, 5.2, 5.6, 6.0, 7.0, 8.5, 10, 12, 15,
]

/** Points along the Sun's azimuth from (lat, lon): [[lat, lon], …]. */
export function rayPoints(lat, lon, azDeg) {
  const az = azDeg * DEG
  return DISTS_KM.map((d) => [
    lat + ((d * Math.cos(az)) / 111.32),
    lon + ((d * Math.sin(az)) / (111.32 * Math.cos(lat * DEG))),
  ])
}

/** Batched elevation lookup; input [[lat, lon], …] → metres (null on failure). */
export async function fetchElevations(coords) {
  const out = []
  for (let i = 0; i < coords.length; i += 100) {
    const chunk = coords.slice(i, i + 100)
    const url =
      'https://api.open-meteo.com/v1/elevation?latitude=' +
      chunk.map((c) => c[0].toFixed(4)).join(',') +
      '&longitude=' +
      chunk.map((c) => c[1].toFixed(4)).join(',')
    // Backoffs sized for the API's per-minute quota window.
    const delays = [2000, 61000 + Math.random() * 10000]
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) }).catch(() => null)
      if (res?.ok) {
        out.push(...(await res.json()).elevation)
        break
      }
      if (attempt >= delays.length) throw new Error('elevation fetch failed')
      await new Promise((r) => setTimeout(r, delays[attempt]))
    }
  }
  return out
}

/**
 * Highest apparent elevation angle (deg) of the terrain toward the Sun, seen
 * from an observer ~2 m above local ground, with Earth-curvature dip applied.
 */
export function profileAngle(obsElevM, elevsM) {
  let max = -90
  for (let i = 0; i < elevsM.length; i++) {
    if (elevsM[i] == null) continue
    const dKm = DISTS_KM[i]
    const rise = (elevsM[i] - obsElevM - 2) / 1000
    const dip = dKm / (2 * EARTH_R_KM) // radians of curvature drop
    const ang = Math.atan2(rise, dKm) - dip
    if (ang > max) max = ang
  }
  return max / DEG
}

/** clear | tight | blocked, comparing ridge angle to sun altitude. */
export function horizonVerdict(ridgeDeg, sunAltDeg) {
  if (ridgeDeg >= sunAltDeg - 1) return 'blocked'
  if (ridgeDeg >= sunAltDeg - 4) return 'tight'
  return 'clear'
}
