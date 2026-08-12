// The forecast grid, shared between the app and the standalone snapshot
// builder so both always agree on geometry and per-point eclipse times.
import { localCircumstances } from './eclipse.js'

// One extra row/column of margin to the south and west so slant-path samples
// (up to ~19 km toward the WSW sun) stay inside real data, not edge-clamped.
export const GRID = { lat0: 63.2, lat1: 66.6, dLat: 0.2, lon0: -25.8, lon1: -18.2, dLon: 0.4 }

export const gridPoints = []
{
  const nLat = Math.round((GRID.lat1 - GRID.lat0) / GRID.dLat) + 1
  const nLon = Math.round((GRID.lon1 - GRID.lon0) / GRID.dLon) + 1
  GRID.nLat = nLat
  GRID.nLon = nLon
  for (let i = 0; i < nLat; i++) {
    for (let j = 0; j < nLon; j++) {
      const lat = GRID.lat0 + i * GRID.dLat
      const lon = GRID.lon0 + j * GRID.dLon
      const circ = localCircumstances(lat, lon)
      gridPoints.push({
        lat,
        lon,
        i,
        j,
        tMs: circ ? circ.maxUtcMs : Date.UTC(2026, 7, 12, 17, 46),
        alt: circ ? circ.sunAltDeg : 25,
        az: circ ? circ.sunAzDeg : 251,
      })
    }
  }
}
