// The last pass over the land: young volcanic cones that erosion hasn't touched,
// fine relief at full resolution, and the derived lighting textures (normals,
// ambient occlusion) the renderer samples.

import { HEIGHT_RES, Y_PER_M } from '../config.js'
import { upsample, toWorld, cellSize, sample, downsample } from './grid.js'
import { makeSimplex, fbm, ridged, smoothstep, mulberry32 } from './noise.js'
import { SHIELDS } from './island.js'

/**
 * Pick cone sites: one tuff cone on the main shield's southeast coast (the
 * Lēʻahi silhouette — built in a single explosive burst where magma met
 * seawater, long after the shield went quiet) and a scatter of cinder cones
 * (puʻu) along the rift zones and leeward flanks.
 */
export function placeCones(h, N, seed) {
  const rand = mulberry32(seed + 501)
  const main = SHIELDS[0]
  // March from the main summit toward the south-southeast until we hit the sea.
  const bearing = (148 * Math.PI) / 180
  const dirX = Math.sin(bearing)
  const dirZ = -Math.cos(bearing)
  let coast = null
  for (let t = 10; t < 160; t += 0.5) {
    const x = main.x + dirX * t
    const z = main.z + dirZ * t
    if (sample(h, N, x, z) <= 0) {
      coast = [x - dirX * 4, z - dirZ * 4]
      break
    }
  }
  const tuff = coast ? { x: coast[0], z: coast[1], rim: 225, R: 13, Rc: 5.2, floor: 38, sw: 225 } : null
  const cinders = []
  let tries = 0
  while (cinders.length < 14 && tries++ < 4000) {
    const s = SHIELDS[rand() < 0.65 ? 0 : 1]
    // bias along the rift axis
    const ca = Math.cos((s.angle * Math.PI) / 180)
    const sa = Math.sin((s.angle * Math.PI) / 180)
    const u = (rand() * 2 - 1) * s.a * 0.95
    const v = (rand() * 2 - 1) * s.b * (rand() < 0.6 ? 0.25 : 0.8)
    const x = s.x + u * ca - v * sa
    const z = s.z + u * sa + v * ca
    const e = sample(h, N, x, z)
    if (e < 30 || e > 1100) continue
    if (tuff && Math.hypot(x - tuff.x, z - tuff.z) < 25) continue
    if (cinders.some((c) => Math.hypot(c.x - x, c.z - z) < 16)) continue
    cinders.push({ x, z, H: 45 + rand() * 90, R: 2.6 + rand() * 2.4, crater: 0.5 + rand() * 0.5 })
  }
  return { tuff, cinders }
}

function coneAdd(x, z, cones) {
  let add = 0
  for (const c of cones.cinders) {
    const r = Math.hypot(x - c.x, z - c.z)
    if (r >= c.R) continue
    const t = r / c.R
    let v = c.H * Math.pow(1 - t, 1.35)
    if (t < 0.28) v -= c.H * 0.45 * c.crater * Math.pow(1 - t / 0.28, 2)
    add += v
  }
  return add
}

/** Tuff cone override: returns a height to max with, or null outside it. */
function tuffHeight(x, z, t) {
  const dx = x - t.x
  const dz = z - t.z
  const r = Math.hypot(dx, dz)
  if (r > t.R) return null
  const theta = Math.atan2(dx, -dz) // compass-ish
  const sw = (t.sw * Math.PI) / 180
  const rim = t.rim * (0.62 + 0.38 * (0.5 + 0.5 * Math.cos(theta - sw)))
  if (r < t.Rc) {
    const k = smoothstep(0.45, 1.0, r / t.Rc)
    return { h: t.floor + (rim - t.floor) * k * k, inside: true }
  }
  const s = (r - t.Rc) / (t.R - t.Rc)
  const gully = 1 - 0.07 * Math.max(0, Math.cos(theta * 23)) * Math.sin(Math.PI * s)
  return { h: rim * Math.pow(1 - s, 1.7) * gully - 6 * s, inside: false }
}

/**
 * Full-resolution heights: Catmull-Rom up from the hydrology grid, the cones,
 * and fine relief scaled by steepness — rough on the pali, almost none on the
 * valley floors and beaches, which have to stay level for loʻi and canoes.
 */
export function finalHeight(h1024, N1, cones, seed) {
  const N = HEIGHT_RES
  const h = upsample(h1024, N1, N)
  const n1 = makeSimplex(seed + 601)
  const n2 = makeSimplex(seed + 602)
  const dxM = cellSize(N) * 100
  const out = new Float32Array(N * N)
  for (let j = 0; j < N; j++) {
    const z = toWorld(N, j)
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      const x = toWorld(N, i)
      const e = h[c]
      const hx = (h[j * N + Math.min(N - 1, i + 1)] - h[j * N + Math.max(0, i - 1)]) / (2 * dxM)
      const hz = (h[Math.min(N - 1, j + 1) * N + i] - h[Math.max(0, j - 1) * N + i]) / (2 * dxM)
      const slope = Math.hypot(hx, hz)
      let v = e
      if (e > 0) {
        const rough = smoothstep(0.05, 0.9, slope)
        v += (rough * 14 + 1.2) * fbm(n1, x / 2.2, z / 2.2, 4)
        v += rough * 9 * (ridged(n2, x / 0.9, z / 0.9, 2) - 0.45)
        v = Math.max(v, Math.min(e, 0.4))
      }
      v += coneAdd(x, z, cones)
      if (cones.tuff) {
        const t = tuffHeight(x, z, cones.tuff)
        if (t) v = t.inside ? t.h + 2 * fbm(n1, x, z, 2) : Math.max(v, t.h)
      }
      out[c] = v
    }
  }
  return out
}

/**
 * Normals (world-space, vertical exaggeration applied) packed as RGBA8:
 * xyz in RGB, ambient occlusion in A.
 */
export function packNormals(h, N, ao) {
  const out = new Uint8Array(N * N * 4)
  const dx = cellSize(N)
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      const ex = h[j * N + Math.min(N - 1, i + 1)] - h[j * N + Math.max(0, i - 1)]
      const ez = h[Math.min(N - 1, j + 1) * N + i] - h[Math.max(0, j - 1) * N + i]
      const nx = (-ex * Y_PER_M) / (2 * dx)
      const nz = (-ez * Y_PER_M) / (2 * dx)
      const l = Math.hypot(nx, 1, nz)
      out[c * 4] = Math.round(((nx / l) * 0.5 + 0.5) * 255)
      out[c * 4 + 1] = Math.round(((1 / l) * 0.5 + 0.5) * 255)
      out[c * 4 + 2] = Math.round(((nz / l) * 0.5 + 0.5) * 255)
      out[c * 4 + 3] = ao ? Math.round(sample(ao.data, ao.N, toWorld(N, i), toWorld(N, j)) * 255) : 255
    }
  }
  return out
}

/**
 * Horizon-based ambient occlusion on a coarse grid: in eight directions, how
 * much of the sky do the surrounding ridges hide? Deep windward valleys get dim
 * and moody; ridge crests stay open.
 */
export function ambientOcclusion(hFine, NF, Nc = 512) {
  const h = downsample(hFine, NF, NF / Nc)
  const out = new Float32Array(Nc * Nc)
  const dxW = cellSize(Nc) // world units
  const steps = [1, 2, 3, 5, 7, 10, 14, 19, 26, 34]
  const dirs = []
  for (let k = 0; k < 8; k++) dirs.push([Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4)])
  for (let j = 0; j < Nc; j++) {
    for (let i = 0; i < Nc; i++) {
      const c = j * Nc + i
      const e = Math.max(0, h[c]) * Y_PER_M
      let occ = 0
      for (const [dx, dz] of dirs) {
        let maxTan = 0
        for (const s of steps) {
          const x = i + dx * s
          const z = j + dz * s
          if (x < 0 || z < 0 || x >= Nc - 1 || z >= Nc - 1) break
          const hh = Math.max(0, h[(z | 0) * Nc + (x | 0)]) * Y_PER_M
          const tan = (hh - e) / (s * dxW)
          if (tan > maxTan) maxTan = tan
        }
        occ += maxTan / Math.sqrt(1 + maxTan * maxTan) // sin of horizon angle
      }
      out[c] = 1 - (occ / 8) * 0.95
    }
  }
  return { data: out, N: Nc }
}
