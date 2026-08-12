// The eclipsed Sun stands only ~25° above the horizon here, so a fjord wall or
// mountain along the Sun's azimuth can hide totality outright. This module
// samples a terrain profile toward the Sun (Open-Meteo elevation API, ~90 m
// Copernicus DEM) and reports the highest apparent ridge angle.

const EARTH_R_KM = 6371
const DEG = Math.PI / 180

// Sample distances (km) — dense close in, where a wall steals the most sky.
export const DISTS_KM = [0.3, 0.6, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 22, 26, 30]

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
    const res = await fetch(url)
    if (!res.ok) throw new Error('elevation fetch failed')
    const data = await res.json()
    out.push(...data.elevation)
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
