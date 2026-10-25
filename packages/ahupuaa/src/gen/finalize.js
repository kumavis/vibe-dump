// The last pass over the land: young volcanic cones that erosion hasn't touched,
// fine relief at full resolution, and the derived lighting textures (normals,
// ambient occlusion) the renderer samples.

import { HEIGHT_RES, Y_PER_M, HALF } from '../config.js'
import { upsample, toWorld, cellSize, sample, downsample, CellHeap, D8X, D8Y } from './grid.js'
import { makeSimplex, fbm, ridged, smoothstep, mulberry32 } from './noise.js'
import { SHIELDS } from './island.js'

/**
 * Pick cone sites: one tuff cone on the main shield's southeast coast (the
 * Lēʻahi silhouette — built in a single explosive burst where magma met
 * seawater, long after the shield went quiet) and a scatter of cinder cones
 * (puʻu) along the rift zones and leeward flanks.
 *
 * `lines` are the drawn streams (channels.js). The streams were traced before
 * the cones exist, so a cinder cone is only put where no stream runs — one
 * dropped across a stream would leave it climbing a hundred metres over the
 * cone. The tuff cone is too big to find such a place on that coast; the
 * streams it buries are led round its foot instead (routeAroundCones).
 */
export function placeCones(h, N, seed, lines = []) {
  const rand = mulberry32(seed + 501)
  // the drawn streams' points in a coarse hash, for "is a stream within r"
  const HC = 2
  const hash = new Map()
  for (const l of lines) {
    for (const p of l.pts) {
      const k = Math.floor(p[0] / HC) * 4096 + Math.floor(p[1] / HC)
      let a = hash.get(k)
      if (!a) hash.set(k, (a = []))
      a.push(p[0], p[1])
    }
  }
  const streamWithin = (x, z, r) => {
    for (let gi = Math.floor((x - r) / HC); gi <= Math.floor((x + r) / HC); gi++) {
      for (let gj = Math.floor((z - r) / HC); gj <= Math.floor((z + r) / HC); gj++) {
        const a = hash.get(gi * 4096 + gj)
        if (!a) continue
        for (let q = 0; q < a.length; q += 2) if (Math.hypot(a[q] - x, a[q + 1] - z) < r) return true
      }
    }
    return false
  }
  const main = SHIELDS[0]
  // March from the main summit toward the south-southeast until we hit the
  // sea; of the spots along that stretch of coast, take the one where the
  // cone dams the least: the streams it buries must find a way round it, and
  // one sat across a valley mouth would leave them a gorge to cut.
  let tuff = null
  let best = Infinity
  for (let k = 0; k <= 12; k++) {
    const deg = 148 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 4
    // (spots further round can't win once one dams less than they stray)
    if (best <= Math.abs(deg - 148) * 0.5) break
    const bearing = (deg * Math.PI) / 180
    const dirX = Math.sin(bearing)
    const dirZ = -Math.cos(bearing)
    for (let t = 10; t < 160; t += 0.5) {
      const x = main.x + dirX * t
      const z = main.z + dirZ * t
      if (sample(h, N, x, z) <= 0) {
        const cand = { x: x - dirX * 4, z: z - dirZ * 4, rim: 225, R: 13, Rc: 5.2, floor: 38, sw: 225 }
        const cost = damDepth(cand, h, N, lines) + Math.abs(deg - 148) * 0.5
        if (cost < best) {
          best = cost
          tuff = cand
        }
        break
      }
    }
  }
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
    const H = 45 + rand() * 90
    const R = 2.6 + rand() * 2.4
    const crater = 0.5 + rand() * 0.5
    // (the outer tenth of a cone's skirt is only a few metres high: a
    // stream there just cuts its bed a little deeper)
    if (streamWithin(x, z, R * 0.9)) continue
    cinders.push({ x, z, H, R, crater })
  }
  return { tuff, cinders }
}

/**
 * How deep a gorge the drawn streams (channels.js lines) would have to cut
 * to get round a tuff cone put here: the worst climb on the way water takes
 * round it, measured from the lowest ground it has already reached.
 */
function damDepth(tuff, h, N, lines) {
  const ground = (c) => {
    const t = tuffHeight(toWorld(N, c % N), toWorld(N, (c / N) | 0), tuff, true)
    return t ? Math.max(h[c], t.h) : h[c]
  }
  const cs = cellSize(N)
  const cellAt = (x, z) => Math.floor((z + HALF) / cs) * N + Math.floor((x + HALF) / cs)
  let F = null
  let worst = 0
  for (const l of lines) {
    if (!l.pts.some((p) => Math.abs(p[0] - tuff.x) < tuff.R && Math.abs(p[1] - tuff.z) < tuff.R)) continue
    const ie = l.pts.findIndex((p) => Math.hypot(p[0] - tuff.x, p[1] - tuff.z) < tuff.R && ground(cellAt(p[0], p[1])) - h[cellAt(p[0], p[1])] > 2)
    if (ie < 1) continue
    F = F || floodAround(tuff, ground, N)
    let l0 = F.toLocal(cellAt(l.pts[ie - 1][0], l.pts[ie - 1][1]))
    if (l0 < 0) continue
    let low = F.g[l0]
    for (let k = 0; k < F.n && F.rcv[l0] >= 0; k++) {
      l0 = F.rcv[l0]
      low = Math.min(low, F.g[l0])
      worst = Math.max(worst, F.g[l0] - low)
    }
  }
  return worst
}

/**
 * A cone's surroundings on the N grid of `ground(c)` (the land as water meets
 * it), priority-flooded from the sea and from the window's edge, beyond which
 * the old drainage still holds. `rcv` is where each cell drains (-1 at the sea
 * and the edge), along the way the flood reached it.
 */
function floodAround(cone, ground, N) {
  const cs = cellSize(N)
  const r = Math.ceil((cone.R + 4) / cs)
  const ci = Math.round((cone.x + HALF) / cs - 0.5)
  const cj = Math.round((cone.z + HALF) / cs - 0.5)
  const i0 = Math.max(1, ci - r)
  const i1 = Math.min(N - 2, ci + r)
  const j0 = Math.max(1, cj - r)
  const j1 = Math.min(N - 2, cj + r)
  const w = i1 - i0 + 1
  const hgt = j1 - j0 + 1
  const n = w * hgt
  const g = new Float32Array(n)
  const filled = new Float32Array(n)
  const done = new Uint8Array(n)
  const rcv = new Int32Array(n).fill(-1)
  const heap = new CellHeap(1024)
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const l = (j - j0) * w + (i - i0)
      g[l] = ground(j * N + i)
      if (g[l] <= 0 || i === i0 || i === i1 || j === j0 || j === j1) {
        done[l] = 1
        filled[l] = g[l]
        heap.push(l, g[l])
      }
    }
  }
  while (heap.size) {
    const l = heap.pop()
    const li = l % w
    const lj = (l / w) | 0
    for (let d = 0; d < 8; d++) {
      const ni = li + D8X[d]
      const nj = lj + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= w || nj >= hgt) continue
      const m = nj * w + ni
      if (done[m]) continue
      done[m] = 1
      filled[m] = Math.max(g[m], filled[l] + 1e-3)
      rcv[m] = l // drains toward where the flood reached it from
      heap.push(m, filled[m])
    }
  }
  const toLocal = (c) => {
    const i = c % N
    const j = (c / N) | 0
    return i < i0 || i > i1 || j < j0 || j > j1 ? -1 : (j - j0) * w + (i - i0)
  }
  const toGlobal = (l) => (j0 + ((l / w) | 0)) * N + i0 + (l % w)
  return { rcv, g, n, toLocal, toGlobal }
}

/**
 * Lead the traced streams round the cones instead of over them (`streams` as
 * traceStreams returns them, edited in place, on the N grid of `h`). Where a
 * stream first meets ground a cone raises, it takes the way water would on
 * the coned land — steepest descent over a priority-flood of the cone's
 * surroundings, out to the sea or back onto the old drainage beyond them —
 * which hugs the cone's foot round to wherever the land falls away. A stream
 * that rises on a cone is dropped.
 */
export function routeAroundCones(streams, cones, h, N, route) {
  // the land as the water meets it: cones solid, craters and all
  const ground = (c) => {
    const x = toWorld(N, c % N)
    const z = toWorld(N, (c / N) | 0)
    let v = h[c] + coneAdd(x, z, cones, true)
    if (cones.tuff) {
      const t = tuffHeight(x, z, cones.tuff, true)
      if (t) v = Math.max(v, t.h)
    }
    return v
  }
  for (const cone of [...(cones.tuff ? [cones.tuff] : []), ...cones.cinders]) {
    const raised = (c) => ground(c) - h[c] > 2
    const hit = streams.filter((s) => s.pts.some((p) => Math.hypot(p[0] - cone.x, p[1] - cone.z) < cone.R && raised(p[2])))
    if (!hit.length) continue
    const { rcv, g, n, toLocal, toGlobal } = floodAround(cone, ground, N)
    const pt = (c) => [toWorld(N, c % N), toWorld(N, (c / N) | 0), c]
    for (const s of hit) {
      const ie = s.pts.findIndex((p) => Math.hypot(p[0] - cone.x, p[1] - cone.z) < cone.R && raised(p[2]))
      if (ie < 2) {
        s.pts = []
        continue
      }
      const out = s.pts.slice(0, ie)
      let c = out[out.length - 1][2]
      let l = toLocal(c)
      if (l < 0) {
        s.pts = out
        continue
      }
      // down the flooded surroundings...
      for (let k = 0; k < 4 * n && rcv[l] >= 0; k++) {
        l = rcv[l]
        c = toGlobal(l)
        out.push(pt(c))
      }
      // ...then the old drainage to the sea, if it left by the window's edge
      for (let k = 0; k < 4096 && g[l] > 0 && route; k++) {
        const nc = route.rcv[c]
        if (nc === c) break
        c = nc
        out.push(pt(c))
        if (h[c] <= 0) break
      }
      s.pts = out
      s.mouth = true
    }
  }
  for (let k = streams.length - 1; k >= 0; k--) if (streams[k].pts.length < 3) streams.splice(k, 1)
}

// (`solid` fills the craters in: how the cones stand in the way of water)
function coneAdd(x, z, cones, solid = false) {
  let add = 0
  for (const c of cones.cinders) {
    const r = Math.hypot(x - c.x, z - c.z)
    if (r >= c.R) continue
    const t = r / c.R
    let v = c.H * Math.pow(1 - t, 1.35)
    if (t < 0.28 && !solid) v -= c.H * 0.45 * c.crater * Math.pow(1 - t / 0.28, 2)
    add += v
  }
  return add
}

/** Tuff cone override: returns a height to max with, or null outside it. */
function tuffHeight(x, z, t, solid = false) {
  const dx = x - t.x
  const dz = z - t.z
  const r = Math.hypot(dx, dz)
  if (r > t.R) return null
  const theta = Math.atan2(dx, -dz) // compass-ish
  const sw = (t.sw * Math.PI) / 180
  const rim = t.rim * (0.62 + 0.38 * (0.5 + 0.5 * Math.cos(theta - sw)))
  if (r < t.Rc && solid) return { h: rim, inside: true }
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
