// Rasters the renderer reads: which ahupuaʻa / moku / zone each spot belongs
// to, and distance fields for drawing the boundaries crisply at any zoom.

import { HALF, WORLD } from '../config.js'
import { cellSize, distanceTransform, sample } from './grid.js'

export const ZONE = { akua: 0, nahele: 1, kanaka: 2, kula: 3, kahakai: 4, kohola: 5, uli: 6 }

export function zoneOf(h, rain, dSeaM, offshoreM, reefW) {
  if (h <= 0) return offshoreM < reefW + 40 && h > -14 ? ZONE.kohola : ZONE.uli
  if (dSeaM < 170 && h < 20) return ZONE.kahakai
  const dry = Math.max(0, Math.min(1, (1800 - rain) / 1100))
  if (h > 950 + 150 * dry) return ZONE.akua
  if (h > 380 + 220 * dry) return ZONE.nahele
  return rain < 1350 ? ZONE.kula : ZONE.kanaka
}

/** RGBA8: r ahupuaʻa id, g moku id, b zone, a field-system mask. */
export function regionMap(T, D, fieldMask) {
  const N = Math.sqrt(T.h.length)
  const cs = cellSize(N) * 100
  const toSea = distanceTransform(N, (c) => T.h[c] <= 0)
  const toLand = distanceTransform(N, (c) => T.h[c] > 0)
  const zone = new Uint8Array(N * N)
  const out = new Uint8Array(N * N * 4)
  for (let c = 0; c < N * N; c++) {
    const l = D.label[c]
    out[c * 4] = l
    out[c * 4 + 1] = l ? D.mokuOf[l] : 0
    const z = zoneOf(T.h[c], T.rain[c], toSea[c] * cs, toLand[c] * cs, T.coast.reefWidth[c])
    zone[c] = z
    out[c * 4 + 2] = z
    out[c * 4 + 3] = fieldMask ? fieldMask[c] : 0
  }
  return { rgba: out, zone, toSea, toLand }
}

/**
 * Distance fields (RGBA8 at `N`): r — ahupuaʻa boundaries, g — moku boundaries,
 * b — the ala loa trail, a — the outer (seaward) limit. Stored as
 * min(255, distance in texels × 16): sixteen steps per texel, out to 16 texels.
 */
export function lineMap(lines, trail, N) {
  const out = new Uint8Array(N * N * 4).fill(255)
  const tex = WORLD / N
  const maxD = 16
  const stamp = (pts, ch, closed = false) => {
    const n = pts.length
    for (let k = 0; k < n - (closed ? 0 : 1); k++) {
      const a = pts[k]
      const b = pts[(k + 1) % n]
      const ax = (a[0] + HALF) / tex - 0.5
      const az = (a[1] + HALF) / tex - 0.5
      const bx = (b[0] + HALF) / tex - 0.5
      const bz = (b[1] + HALF) / tex - 0.5
      const x0 = Math.max(0, Math.floor(Math.min(ax, bx) - maxD))
      const x1 = Math.min(N - 1, Math.ceil(Math.max(ax, bx) + maxD))
      const z0 = Math.max(0, Math.floor(Math.min(az, bz) - maxD))
      const z1 = Math.min(N - 1, Math.ceil(Math.max(az, bz) + maxD))
      const dx = bx - ax
      const dz = bz - az
      const ll = dx * dx + dz * dz || 1e-9
      for (let z = z0; z <= z1; z++) {
        for (let x = x0; x <= x1; x++) {
          let t = ((x - ax) * dx + (z - az) * dz) / ll
          t = t < 0 ? 0 : t > 1 ? 1 : t
          const ex = ax + dx * t - x
          const ez = az + dz * t - z
          const d = Math.sqrt(ex * ex + ez * ez)
          if (d >= maxD) continue
          const v = Math.round(d * 16)
          const i = (z * N + x) * 4 + ch
          if (v < out[i]) out[i] = v
        }
      }
    }
  }
  for (const ln of lines) {
    if (ln.kind === 'outer') stamp(ln.pts, 3)
    else {
      stamp(ln.pts, 0)
      if (ln.kind === 'moku') stamp(ln.pts, 1)
    }
  }
  if (trail.length) stamp(trail, 2, true)
  return out
}

/**
 * A mountain-to-sea cross-section for each ahupuaʻa, for the hover card: from
 * the reef edge in to the stream mouth, up the trunk stream, then straight up
 * to the highest point inside the boundary.
 */
export function profiles(sites, T, D, zone, height, N2) {
  const N = Math.sqrt(T.h.length)
  const out = {}
  for (const a of sites.ahupuaa) {
    const pts = []
    const [mx, mz] = a.mouth
    // seaward: march out from the mouth while still inside this ahupuaʻa
    const trunk = a.trunk
    let dirX = 0
    let dirZ = 0
    if (trunk.length > 2) {
      dirX = trunk[0][0] - trunk[2][0]
      dirZ = trunk[0][1] - trunk[2][1]
      const l = Math.hypot(dirX, dirZ) || 1
      dirX /= l
      dirZ /= l
    }
    const sea = []
    for (let d = 0.5; d < 40; d += 0.5) {
      const x = mx + dirX * d
      const z = mz + dirZ * d
      const ci = Math.floor((x + HALF) / (WORLD / N))
      const cj = Math.floor((z + HALF) / (WORLD / N))
      if (ci < 0 || cj < 0 || ci >= N || cj >= N) break
      if (D.label[cj * N + ci] !== a.id) break
      sea.push([x, z])
    }
    sea.reverse().forEach((p) => pts.push(p))
    pts.push([mx, mz])
    for (const p of trunk) pts.push([p[0], p[1]])
    const last = pts[pts.length - 1]
    const tl = Math.hypot(a.topX - last[0], a.topZ - last[1])
    for (let d = 0.6; d < tl; d += 0.6) pts.push([last[0] + ((a.topX - last[0]) * d) / tl, last[1] + ((a.topZ - last[1]) * d) / tl])
    pts.push([a.topX, a.topZ])
    // to distance/height/zone samples
    let dist = 0
    const prof = []
    for (let k = 0; k < pts.length; k++) {
      if (k > 0) dist += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
      const h = sample(height, N2, pts[k][0], pts[k][1])
      const ci = Math.floor((pts[k][0] + HALF) / (WORLD / N))
      const cj = Math.floor((pts[k][1] + HALF) / (WORLD / N))
      const z = ci >= 0 && cj >= 0 && ci < N && cj < N ? zone[cj * N + ci] : 6
      prof.push([+dist.toFixed(2), Math.round(h), z])
    }
    out[a.id] = prof
  }
  return out
}
