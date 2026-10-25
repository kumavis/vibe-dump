// Finishing the land: flat-floored valleys, sea cliffs, beaches, and the reef.

import { CellHeap, D8X, D8Y, D8L, cellSize, toWorld, distanceTransform, blur } from './grid.js'
import { makeSimplex, fbm, smoothstep, clamp } from './noise.js'

/**
 * Windward valleys on an old Hawaiian island are troughs with flat floors: the
 * sea was ~120 m lower in the ice ages, the streams cut down to it, and when the
 * sea came back the drowned valleys filled with alluvium. Those level, wet,
 * stream-fed floors are where the big loʻi kalo complexes were.
 *
 * Each stream gets a floor whose half-width grows with its discharge. The floor
 * is grown outward from the channel by distance, but only while the original
 * ground keeps rising — so it climbs the valley walls and stops at the ridge
 * instead of spilling into the next valley over. Walls left behind are steep,
 * which is right.
 */
export function widenValleys(h, N, route, opts = {}) {
  const { minArea = 4, widthK = 42, widthExp = 0.45, maxWidth = 520 } = opts
  const { filled, area, order, count } = route
  const NN = N * N
  const dxM = cellSize(N) * 100
  const orig = Float32Array.from(h)
  const dist = new Float64Array(NN).fill(Infinity)
  const src = new Int32Array(NN).fill(-1)
  const heap = new CellHeap(1 << 16)
  const floorOf = new Float32Array(NN)
  const widthOf = new Float32Array(NN)
  for (let q = 0; q < count; q++) {
    const c = order[q]
    if (area[c] < minArea) continue
    const w = Math.min(maxWidth, widthK * Math.pow(area[c], widthExp))
    if (w < dxM * 0.8) continue
    widthOf[c] = w
    floorOf[c] = Math.max(0.8, filled[c])
    dist[c] = 0
    src[c] = c
    heap.push(c, 0)
  }
  while (heap.size > 0) {
    const c = heap.pop()
    const dc = heap.topKey
    if (dc > dist[c]) continue
    const s = src[c]
    const i = c % N
    const j = (c / N) | 0
    const si = s % N
    const sj = (s / N) | 0
    for (let d = 0; d < 8; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      const n = nj * N + ni
      if (orig[n] <= 0) continue
      // only uphill (with a little slack for bumps) — never over a ridge
      if (orig[n] < orig[c] - 4) continue
      const nd = Math.hypot(ni - si, nj - sj) * dxM
      if (nd >= widthOf[s] || nd >= dist[n]) continue
      dist[n] = nd
      src[n] = s
      heap.push(n, nd)
    }
  }
  for (let c = 0; c < NN; c++) {
    const s = src[c]
    if (s < 0 || h[c] <= 0) continue
    const w = widthOf[s]
    const t = dist[c] / w
    // level floor, a slight rise toward the walls, then blend into the old slope
    const floor = floorOf[s] + dist[c] * 0.015
    const k = smoothstep(0.72, 1.0, t)
    const target = floor * (1 - k) + orig[c] * k
    if (target < h[c]) h[c] = target
  }
  // Let the freshly cut walls settle to something a cliff can actually hold.
  slump(h, N, 1.6, 6)
}

/** A few passes of a talus-angle limiter: slopes steeper than `tanMax` shed. */
export function slump(h, N, tanMax, passes) {
  const NN = N * N
  const drop = tanMax * cellSize(N) * 100
  const delta = new Float32Array(NN)
  for (let p = 0; p < passes; p++) {
    delta.fill(0)
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        const c = j * N + i
        if (h[c] <= 0) continue
        for (let d = 0; d < 8; d++) {
          const n = c + D8Y[d] * N + D8X[d]
          const excess = h[c] - h[n] - drop * D8L[d]
          if (excess > 0) {
            const t = excess * 0.1
            delta[c] -= t
            delta[n] += t
          }
        }
      }
    }
    for (let c = 0; c < NN; c++) h[c] += delta[c]
  }
}

// Places on the coast that get special treatment, in world units.
export const BAYS = {
  // A Kāneʻohe-style lagoon behind a barrier reef on the windward side.
  lagoon: { x: 70, z: -50, r: 34 },
  // A wide, shallow reef flat in the sheltered southern bay — fishpond country.
  flat: { x: -8, z: 60, r: 34 },
}

/**
 * Reef, lagoon, beaches and sea cliffs. `streams` are the traced stream lines;
 * where a big one meets the sea the reef parts (fresh water and silt keep the
 * coral away), which is also where the canoe passages are.
 */
export function shapeCoast(h, N, streams, seed) {
  const NN = N * N
  const dxM = cellSize(N) * 100
  const noiseA = makeSimplex(seed + 41)
  const noiseB = makeSimplex(seed + 42)
  const noiseC = makeSimplex(seed + 43)

  // Inland distance to the sea, before any edits.
  const sea0 = distanceTransform(N, (c) => h[c] <= 0)

  // 1. Sea cliffs where the open north swell hits: the coast is eaten back
  //    a few hundred metres, leaving a wall where the slope was cut.
  //    Exposure comes from the direction to the sea (gradient of distance).
  const exposure = new Float32Array(NN)
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const c = j * N + i
      const gx = sea0[c + 1] - sea0[c - 1]
      const gz = sea0[c + N] - sea0[c - N]
      const gl = Math.hypot(gx, gz) || 1
      // seaward direction is -gradient; north is -z
      const sx = -gx / gl
      const sz = -gz / gl
      const north = Math.max(0, -sz * 0.9 - sx * 0.25)
      exposure[c] = north
    }
  }
  const expS = blur(exposure, N, 6, 2)
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      if (h[c] <= 0) continue
      const x = toWorld(N, i)
      const z = toWorld(N, j)
      const ex = smoothstep(0.35, 0.8, expS[c]) * smoothstep(-0.2, 0.4, fbm(noiseC, x / 30, z / 30, 3))
      const retreat = ex * 650 // metres
      const din = sea0[c] * dxM
      if (din < retreat) {
        h[c] = -4 - (retreat - din) * 0.08
      }
    }
  }

  // 2. Reef geometry from the (new) coastline.
  const seaD = distanceTransform(N, (c) => h[c] <= 0) // inland distance (cells)
  const landD = distanceTransform(N, (c) => h[c] > 0) // offshore distance (cells)
  const mouthSet = []
  for (const s of streams) if (s.mouth && s.area > 6) mouthSet.push([s.pts[s.pts.length - 1][0], s.pts[s.pts.length - 1][1], s.area])
  const reefW = new Float32Array(NN)
  const lagoon = new Float32Array(NN)
  for (let j = 0; j < N; j++) {
    const z = toWorld(N, j)
    for (let i = 0; i < N; i++) {
      const x = toWorld(N, i)
      const c = j * N + i
      const n1 = fbm(noiseA, x / 22, z / 22, 3)
      let w = 260 + 420 * smoothstep(-0.4, 0.6, n1) // a fringing reef nearly everywhere
      const lg = Math.exp(-(((x - BAYS.lagoon.x) ** 2 + (z - BAYS.lagoon.z) ** 2) / BAYS.lagoon.r ** 2))
      const fl = Math.exp(-(((x - BAYS.flat.x) ** 2 + (z - BAYS.flat.z) ** 2) / BAYS.flat.r ** 2))
      w += lg * 2300 + fl * 1300
      w *= 1 - 0.85 * smoothstep(0.3, 0.75, expS[c] || 0)
      // reef passes off the big stream mouths
      for (const [mx, mz, a] of mouthSet) {
        const d2 = (x - mx) ** 2 + (z - mz) ** 2
        const r = 2.2 + Math.sqrt(a) * 0.25
        if (d2 < r * r * 4) w *= 0.25 + 0.75 * smoothstep(r * 0.6, r * 2, Math.sqrt(d2))
      }
      reefW[c] = w
      lagoon[c] = lg
    }
  }
  const reefWs = blur(reefW, N, 3, 2)
  const lagoonS = lagoon

  // 3. Seafloor: reef flat or lagoon inside the crest, a steep fore-reef, a
  //    shelf, then the drop-off — never shallower than the reef allows and
  //    never deeper than the island's own submarine flank.
  for (let j = 0; j < N; j++) {
    const z = toWorld(N, j)
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      if (h[c] > 0) continue
      const x = toWorld(N, i)
      const d = landD[c] * dxM // metres offshore
      const W = reefWs[c]
      let depth
      if (d < W) {
        const t = d / W
        const patch = fbm(noiseB, x / 3.2, z / 3.2, 3)
        if (lagoonS[c] > 0.25 && W > 900) {
          // lagoon: deepening to ~10 m mid-way, patch reefs breaking the surface
          const deep = 2 + 9 * Math.sin(Math.PI * clamp((t - 0.05) / 0.9, 0, 1)) * smoothstep(0.25, 0.6, lagoonS[c])
          depth = patch > 0.42 ? 0.6 + (deep - 0.6) * smoothstep(0.42, 0.62, patch) * 0.4 : deep
        } else {
          // reef flat: shin-deep, gently deepening to the crest
          depth = 0.4 + 1.4 * t + 0.6 * patch
        }
        depth = Math.max(0.25, depth)
      } else {
        const e = d - W
        // the crest itself is the shallowest point; then a steep fore-reef
        depth = 0.35 + e * 0.11 + Math.max(0, e - 250) * 0.06
        depth = Math.min(depth, 55 + Math.max(0, e - 900) * 0.25)
      }
      // The reef builds right up to the profile; past the shelf, the island's own
      // submarine flank takes over wherever it is deeper.
      const k = smoothstep(W + 400, W + 1600, d)
      h[c] = -depth * (1 - k) + Math.min(-depth, h[c]) * k
    }
  }

  // 4. Beaches: where the coast is low, grade a sandy apron up from the water.
  const sand = new Float32Array(NN)
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      const c = j * N + i
      if (h[c] <= 0) continue
      const din = seaD[c] * dxM
      if (din > 220) continue
      const x = toWorld(N, i)
      const z = toWorld(N, j)
      const beach = 0.4 + din * 0.028 // ~1.6° beach face
      const low = h[c] < 18
      const wants = smoothstep(-0.3, 0.3, fbm(noiseA, x / 9 + 50, z / 9, 2)) * (1 - smoothstep(0.4, 0.8, expS[c]))
      if (low && wants > 0.2) {
        const k = smoothstep(220, 80, din)
        h[c] = Math.min(h[c], beach * k + h[c] * (1 - k))
        sand[c] = Math.max(sand[c], wants * smoothstep(200, 60, din))
      }
    }
  }
  return { reefWidth: reefWs, lagoon: lagoonS, sand, exposure: expS }
}
