// The whole generator, end to end, producing exactly what the renderer needs.

import { HEIGHT_RES, HYDRO_RES, WORLD, HALF } from '../config.js'
import { buildTerrain } from './terrain.js'
import { placeCones, finalHeight, packNormals, ambientOcclusion } from './finalize.js'
import { divideLand, boundaryLines, shoreTrail, ahuSites, MOKU } from './division.js'
import { placeSites } from './sites.js'
import { regionMap, lineMap, profiles } from './maps.js'
import { cloudNoise } from './cloudnoise.js'

/** Press the loʻi into the land: level each paddy's footprint just under its water. */
function carveTerraces(height, N, loi) {
  const tex = WORLD / N
  for (const complex of loi) {
    for (const p of complex.paddies) {
      const xs = p.quad.map((q) => q[0])
      const zs = p.quad.map((q) => q[1])
      const i0 = Math.max(0, Math.floor((Math.min(...xs) + HALF) / tex) - 1)
      const i1 = Math.min(N - 1, Math.ceil((Math.max(...xs) + HALF) / tex) + 1)
      const j0 = Math.max(0, Math.floor((Math.min(...zs) + HALF) / tex) - 1)
      const j1 = Math.min(N - 1, Math.ceil((Math.max(...zs) + HALF) / tex) + 1)
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const x = -HALF + (i + 0.5) * tex
          const z = -HALF + (j + 0.5) * tex
          const d = quadDistance(p.quad, x, z)
          if (d > tex * 1.5) continue
          const c = j * N + i
          const target = p.level - 0.35 + Math.max(0, d) * 6
          if (height[c] > target) height[c] = target
        }
      }
    }
  }
}

// signed-ish distance from a point to a convex quad (negative inside)
function quadDistance(q, x, z) {
  let inside = true
  let best = Infinity
  for (let k = 0; k < 4; k++) {
    const a = q[k]
    const b = q[(k + 1) % 4]
    const ex = b[0] - a[0]
    const ez = b[1] - a[1]
    const cross = ex * (z - a[1]) - ez * (x - a[0])
    if (cross < 0) inside = false
    const l2 = ex * ex + ez * ez || 1e-9
    let t = ((x - a[0]) * ex + (z - a[1]) * ez) / l2
    t = Math.max(0, Math.min(1, t))
    best = Math.min(best, Math.hypot(a[0] + ex * t - x, a[1] + ez * t - z))
  }
  // quads are wound either way; treat "inside" by consistent sign
  let inside2 = true
  for (let k = 0; k < 4; k++) {
    const a = q[k]
    const b = q[(k + 1) % 4]
    if ((b[0] - a[0]) * (z - a[1]) - (b[1] - a[1]) * (x - a[0]) > 0) inside2 = false
  }
  return inside || inside2 ? -best : best
}

export function generateIsland(seed, progress = () => {}) {
  const T = buildTerrain(seed, progress)
  progress('divide', 0)
  const D = divideLand(T.h, HYDRO_RES, T.route, { target: 26, reefWidth: T.coast.reefWidth })
  const lines = boundaryLines(D.label, HYDRO_RES, D.mokuOf)
  const trail = shoreTrail(T.h, HYDRO_RES)
  const ahu = ahuSites(lines, trail)

  progress('detail', 0)
  const cones = placeCones(T.h, HYDRO_RES, seed)
  const height = finalHeight(T.h, HYDRO_RES, cones, seed)

  progress('people', 0)
  const sites = placeSites(T, D, height, HEIGHT_RES, ahu, trail, seed)
  carveTerraces(height, HEIGHT_RES, sites.loi)
  const region = regionMap(T, D, sites.fieldMask)
  const lineTex = lineMap(lines, trail, HEIGHT_RES)
  const prof = profiles(sites, T, D, region.zone, height, HEIGHT_RES)

  progress('light', 0)
  const ao = ambientOcclusion(height, HEIGHT_RES)
  const normals = packNormals(height, HEIGHT_RES, ao)
  progress('sky', 0)
  const cn = cloudNoise(seed)

  const data = {
    height,
    height1024: T.h,
    normals,
    rain: T.rain,
    sand: T.coast.sand,
    reefWidth: T.coast.reefWidth,
    lagoon: T.coast.lagoon,
    exposure: T.coast.exposure,
    area: T.route.area,
    region: region.rgba,
    lines: lineTex,
    cloudShape: cn.shape,
    cloudDetail: cn.detail,
  }
  const { fieldMask, ...siteMeta } = sites
  const meta = {
    seed,
    cones,
    moku: MOKU,
    ahupuaa: D.info.map((a, k) => ({ ...a, ...siteMeta.ahupuaa[k], profile: prof[a.id] })),
    lines: lines.map((l) => ({ kind: l.kind, a: l.a, b: l.b, pts: l.pts })),
    trail,
    ahu,
    center: D.center,
    cloudSizes: [cn.shapeSize, cn.detailSize],
    sites: { ...siteMeta, ahupuaa: undefined },
    streams: T.streams.map((s) => ({ area: s.area, mouth: s.mouth, pts: s.pts.map((p) => [p[0], p[1]]) })),
  }
  void fieldMask
  const transfer = Object.values(data).map((a) => a.buffer)
  progress('done', 1)
  return { data, meta, transfer }
}
