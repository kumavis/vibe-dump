// Cutting the island into ahupuaʻa, the way the land itself suggests.
//
// An ahupuaʻa ran from the mountain to the sea, and its sides usually followed
// ridgelines — so a family living in it had a stream, upland forest, farmland,
// shore and reef inside one boundary. That is exactly a watershed, so that is how
// they are found here: every land cell drains to some point on the coast; the
// big drainages become the cores of ahupuaʻa; the little coastal catchments
// between them join whichever neighbour is closest along the shore; and runs of
// neighbouring catchments are merged until the island has a realistic number.
// The boundaries that come out are drainage divides — real ridgelines on this
// island's own terrain. Each one then carries on out across the reef flat,
// because the near-shore fishery belonged to the ahupuaʻa too.
//
// Ahupuaʻa are grouped into moku (districts). The names are the ones that
// recur across the islands for the windward (Koʻolau) and leeward (Kona) sides,
// with Puna and Waialua between them: this is a composite island, not a map.

import { CellHeap, D8X, D8Y, toWorld, cellSize, distanceTransform } from './grid.js'
import { HALF } from '../config.js'

// `from`/`to` are the compass directions a district's shoreline faces.
export const MOKU = [
  { name: 'Koʻolau', gloss: 'windward', from: 345, to: 105 },
  { name: 'Puna', gloss: 'the sunrise side', from: 105, to: 165 },
  { name: 'Kona', gloss: 'leeward', from: 165, to: 255 },
  { name: 'Waialua', gloss: 'the northwest side', from: 255, to: 345 },
]

// The zones from mountain to sea. Names and limits varied from island to
// island and source to source; these are the ones most often taught.
export const ZONES = [
  { key: 'akua', name: 'Wao akua', gloss: 'realm of the gods' },
  { key: 'nahele', name: 'Wao nahele', gloss: 'the forest' },
  { key: 'kanaka', name: 'Wao kanaka', gloss: 'realm of people' },
  { key: 'kula', name: 'Kula', gloss: 'open dry plains' },
  { key: 'kahakai', name: 'Kahakai', gloss: 'the shore' },
  { key: 'kohola', name: 'Kai kohola', gloss: 'reef shallows' },
  { key: 'uli', name: 'Kai uli', gloss: 'deep blue sea' },
]

const inBearing = (b, from, to) => (from <= to ? b >= from && b < to : b >= from || b < to)

/** Moore-neighbour trace of the outer boundary of the land component holding `seed`. */
function traceCoast(land, N, comp, id) {
  let start = -1
  for (let c = 0; c < N * N && start < 0; c++) if (comp[c] === id) start = c
  // clockwise neighbours starting west (screen coordinates, y down)
  const OX = [-1, -1, 0, 1, 1, 1, 0, -1]
  const OY = [0, -1, -1, -1, 0, 1, 1, 1]
  const loop = [start]
  let c = start
  let back = 0 // index (into OX/OY) of the background neighbour we came from
  for (let step = 0; step < N * 16; step++) {
    const ci = c % N
    const cj = (c / N) | 0
    let found = -1
    for (let k = 1; k <= 8; k++) {
      const d = (back + k) % 8
      const ni = ci + OX[d]
      const nj = cj + OY[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      const n = nj * N + ni
      if (comp[n] === id) {
        found = d
        break
      }
    }
    if (found < 0) break
    const n = (cj + OY[found]) * N + (ci + OX[found])
    // the new backtrack: the neighbour checked just before `found`, as seen from n
    const prev = (found + 7) % 8
    const pi = ci + OX[prev]
    const pj = cj + OY[prev]
    c = n
    const ni = c % N
    const nj = (c / N) | 0
    // direction from n to the previous background cell
    let bd = 0
    for (let d = 0; d < 8; d++) if (ni + OX[d] === pi && nj + OY[d] === pj) bd = d
    back = bd
    if (c === start && loop.length > 2) break
    loop.push(c)
  }
  return loop
}

function components(land, N) {
  const comp = new Int32Array(N * N).fill(-1)
  const sizes = []
  const stack = []
  for (let s = 0; s < N * N; s++) {
    if (!land[s] || comp[s] >= 0) continue
    const id = sizes.length
    let size = 0
    stack.push(s)
    comp[s] = id
    while (stack.length) {
      const c = stack.pop()
      size++
      const i = c % N
      const j = (c / N) | 0
      for (let d = 0; d < 8; d++) {
        const ni = i + D8X[d]
        const nj = j + D8Y[d]
        if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
        const n = nj * N + ni
        if (land[n] && comp[n] < 0) {
          comp[n] = id
          stack.push(n)
        }
      }
    }
    sizes.push(size)
  }
  return { comp, sizes }
}

export function divideLand(h, N, route, opts = {}) {
  const { target = 26, reefWidth } = opts
  const NN = N * N
  const cs = cellSize(N)
  const land = new Uint8Array(NN)
  for (let c = 0; c < NN; c++) land[c] = h[c] > 0 ? 1 : 0
  const { comp, sizes } = components(land, N)
  let mainId = 0
  for (let k = 1; k < sizes.length; k++) if (sizes[k] > sizes[mainId]) mainId = k
  const loop = traceCoast(land, N, comp, mainId)
  const loopPos = new Int32Array(NN).fill(-1)
  loop.forEach((c, k) => {
    if (loopPos[c] < 0) loopPos[c] = k
  })
  const L = loop.length

  // island centre, for bearings
  let cx = 0
  let cz = 0
  let cnt = 0
  for (let c = 0; c < NN; c++) {
    if (comp[c] !== mainId) continue
    cx += toWorld(N, c % N)
    cz += toWorld(N, (c / N) | 0)
    cnt++
  }
  cx /= cnt
  cz /= cnt

  // 1. every land cell → its coastal outlet
  const { rcv, order, count } = route
  const outlet = new Int32Array(NN).fill(-1)
  for (let q = 0; q < count; q++) {
    const c = order[q]
    const r = rcv[c]
    outlet[c] = r === c || h[r] <= 0 ? c : outlet[r]
  }

  // 2. outlets on the main coast, positioned along the loop
  const tOf = new Map()
  const findLoop = (c) => {
    if (loopPos[c] >= 0) return loopPos[c]
    const ci = c % N
    const cj = (c / N) | 0
    for (let r = 1; r < 12; r++) {
      let best = -1
      let bd = Infinity
      for (let dj = -r; dj <= r; dj++) {
        for (let di = -r; di <= r; di++) {
          const ni = ci + di
          const nj = cj + dj
          if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
          const p = loopPos[nj * N + ni]
          if (p >= 0 && di * di + dj * dj < bd) {
            bd = di * di + dj * dj
            best = p
          }
        }
      }
      if (best >= 0) return best
    }
    return -1
  }
  const areaOf = new Map()
  for (let c = 0; c < NN; c++) {
    if (comp[c] !== mainId) continue
    const o = outlet[c]
    areaOf.set(o, (areaOf.get(o) || 0) + 1)
  }
  for (const o of areaOf.keys()) tOf.set(o, findLoop(o))

  // 3. major catchments, in order around the coast
  const cellKm2 = (cs * 0.1) ** 2
  const majorCells = 0.45 / cellKm2
  let majors = [...areaOf.entries()].filter(([o, a]) => a >= majorCells && tOf.get(o) >= 0).map(([o, a]) => ({ o, a, t: tOf.get(o) }))
  majors.sort((a, b) => a.t - b.t)
  if (majors.length < target) {
    // a smaller island: take the biggest catchments, whatever their size
    majors = [...areaOf.entries()].filter(([o]) => tOf.get(o) >= 0).sort((a, b) => b[1] - a[1]).slice(0, target * 2).map(([o, a]) => ({ o, a, t: tOf.get(o) }))
    majors.sort((a, b) => a.t - b.t)
  }
  const M = majors.length
  // each outlet joins the nearest major one along the coast
  const circ = (a, b) => {
    const d = Math.abs(a - b)
    return Math.min(d, L - d)
  }
  const majorIdx = new Map()
  majors.forEach((m, k) => majorIdx.set(m.o, k))
  const joinOf = new Map()
  for (const [o] of areaOf) {
    if (majorIdx.has(o)) {
      joinOf.set(o, majorIdx.get(o))
      continue
    }
    const t = tOf.get(o)
    if (t < 0) continue
    // binary search the sorted majors by t
    let lo = 0
    let hi = M - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (majors[mid].t < t) lo = mid + 1
      else hi = mid
    }
    const a = lo % M
    const b = (lo - 1 + M) % M
    joinOf.set(o, circ(majors[a].t, t) <= circ(majors[b].t, t) ? a : b)
  }
  const majorArea = new Float64Array(M)
  for (const [o, a] of areaOf) {
    const k = joinOf.get(o)
    if (k !== undefined) majorArea[k] += a
  }

  // 4. merge neighbouring catchments until the island has `target` ahupuaʻa
  let groups = majors.map((m, k) => ({ members: [k], area: majorArea[k] }))
  while (groups.length > target) {
    let s = 0
    for (let k = 1; k < groups.length; k++) if (groups[k].area < groups[s].area) s = k
    const prev = (s - 1 + groups.length) % groups.length
    const next = (s + 1) % groups.length
    const into = groups[prev].area < groups[next].area ? prev : next
    const g = groups[into]
    if (into === prev) g.members.push(...groups[s].members)
    else g.members.unshift(...groups[s].members)
    g.area += groups[s].area
    groups.splice(s, 1)
  }
  // rotate so ahupuaʻa 1 starts at the northernmost-ish point (stable numbering)
  const groupOfMajor = new Int32Array(M)
  groups.forEach((g, k) => g.members.forEach((m) => (groupOfMajor[m] = k)))

  // 5. labels on land (1-based)
  const label = new Uint8Array(NN)
  for (let c = 0; c < NN; c++) {
    if (comp[c] !== mainId) continue
    const k = joinOf.get(outlet[c])
    if (k !== undefined) label[c] = groupOfMajor[k] + 1
  }
  // islets and stragglers: nearest labelled land
  extendLabels(label, N, (c) => h[c] > 0 && label[c] === 0, (c) => label[c] > 0, Infinity)

  // 6. ...and out over the reef: coastal ownership extends to the reef edge
  //    plus a little open water — "as far as the fish".
  const seaReach = new Float32Array(NN)
  for (let c = 0; c < NN; c++) seaReach[c] = reefWidth ? (reefWidth[c] + 650) / 100 : 15 // world units
  extendLabels(label, N, (c) => h[c] <= 0, (c) => label[c] > 0 && h[c] > 0, seaReach)

  // 7. per-ahupuaʻa facts and moku
  const K = groups.length
  const info = groups.map((g, k) => ({ id: k + 1, area: 0, sx: 0, sz: 0, n: 0, coastX: 0, coastZ: 0, coastN: 0, top: -1e9, topX: 0, topZ: 0 }))
  for (let c = 0; c < NN; c++) {
    const l = label[c]
    if (!l) continue
    const a = info[l - 1]
    const x = toWorld(N, c % N)
    const z = toWorld(N, (c / N) | 0)
    if (h[c] > 0) {
      a.area += cellKm2
      a.sx += x
      a.sz += z
      a.n++
      if (h[c] > a.top) {
        a.top = h[c]
        a.topX = x
        a.topZ = z
      }
      if (loopPos[c] >= 0) {
        a.coastX += x
        a.coastZ += z
        a.coastN++
      }
    }
  }
  for (const a of info) {
    a.cx = a.sx / Math.max(1, a.n)
    a.cz = a.sz / Math.max(1, a.n)
    a.coastX = a.coastN ? a.coastX / a.coastN : a.cx
    a.coastZ = a.coastN ? a.coastZ / a.coastN : a.cz
    // the way its shore faces: from the heart of the wedge out to its coast
    a.bearing = (((Math.atan2(a.coastX - a.cx, -(a.coastZ - a.cz)) * 180) / Math.PI) + 360) % 360
  }
  // Moku are runs of neighbouring ahupuaʻa, in order around the coast. Try
  // every rotation and every three cut points and keep the split whose
  // districts best match the way their shores face (K is small: ~60k tries).
  const centre = MOKU.map((m) => (m.from + (((m.to - m.from + 360) % 360) / 2)) % 360)
  const score = info.map((a) => centre.map((c) => Math.cos(((a.bearing - c) * Math.PI) / 180) * Math.sqrt(a.area)))
  let best = -Infinity
  let mk = null
  for (let rot = 0; rot < K; rot++) {
    const at = (k) => score[(k + rot) % K]
    const pre = MOKU.map((_, m) => {
      const p = new Float64Array(K + 1)
      for (let k = 0; k < K; k++) p[k + 1] = p[k] + at(k)[m]
      return p
    })
    for (let a = 1; a < K - 2; a++) {
      for (let b = a + 1; b < K - 1; b++) {
        for (let c = b + 1; c < K; c++) {
          const v = pre[0][a] + (pre[1][b] - pre[1][a]) + (pre[2][c] - pre[2][b]) + (pre[3][K] - pre[3][c])
          if (v > best) {
            best = v
            mk = new Array(K)
            for (let k = 0; k < K; k++) mk[(k + rot) % K] = k < a ? 0 : k < b ? 1 : k < c ? 2 : 3
          }
        }
      }
    }
  }
  info.forEach((a, k) => (a.moku = mk[k]))
  const mokuOf = new Uint8Array(K + 1)
  info.forEach((a) => (mokuOf[a.id] = a.moku + 1))

  return { label, info, mokuOf, loop, center: [cx, cz], K, cellKm2 }
}

/**
 * Grow labels from `isSource` cells into `isTarget` cells by nearest Euclidean
 * source (vector propagation through a heap), up to `reach` world units —
 * a number or a per-cell array.
 */
function extendLabels(label, N, isTarget, isSource, reach) {
  const NN = N * N
  const cs = cellSize(N)
  const dist = new Float64Array(NN).fill(Infinity)
  const src = new Int32Array(NN).fill(-1)
  const heap = new CellHeap(1 << 16)
  for (let c = 0; c < NN; c++) {
    if (!isSource(c)) continue
    // only seed sources that touch a target
    const i = c % N
    const j = (c / N) | 0
    let edge = false
    for (let d = 0; d < 8 && !edge; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      if (isTarget(nj * N + ni)) edge = true
    }
    if (!edge) continue
    dist[c] = 0
    src[c] = c
    heap.push(c, 0)
  }
  while (heap.size > 0) {
    const c = heap.pop()
    if (heap.topKey > dist[c]) continue
    const s = src[c]
    const si = s % N
    const sj = (s / N) | 0
    const i = c % N
    const j = (c / N) | 0
    for (let d = 0; d < 8; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      const n = nj * N + ni
      if (!isTarget(n) || label[n]) continue
      const nd = Math.hypot(ni - si, nj - sj) * cs
      const lim = typeof reach === 'number' ? reach : reach[n]
      if (nd > lim || nd >= dist[n]) continue
      dist[n] = nd
      src[n] = s
      heap.push(n, nd)
    }
  }
  for (let c = 0; c < NN; c++) if (src[c] >= 0 && !label[c]) label[c] = label[src[c]]
}

/**
 * Boundary polylines between differently-labelled cells, on the cell-corner
 * grid, chained between junctions and smoothed. Each line knows the labels on
 * its two sides.
 */
export function boundaryLines(label, N, mokuOf) {
  const cs = cellSize(N)
  const key = (i, j) => j * (N + 1) + i
  const adj = new Map() // corner → [segment ids]
  const segs = []
  const addSeg = (i0, j0, i1, j1, a, b) => {
    const id = segs.length
    const k0 = key(i0, j0)
    const k1 = key(i1, j1)
    segs.push({ k0, k1, a: Math.min(a, b), b: Math.max(a, b) })
    if (!adj.has(k0)) adj.set(k0, [])
    if (!adj.has(k1)) adj.set(k1, [])
    adj.get(k0).push(id)
    adj.get(k1).push(id)
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      const l = label[c]
      if (i + 1 < N && label[c + 1] !== l) addSeg(i + 1, j, i + 1, j + 1, l, label[c + 1])
      if (j + 1 < N && label[c + N] !== l) addSeg(i, j + 1, i + 1, j + 1, l, label[c + N])
    }
  }
  const used = new Uint8Array(segs.length)
  const lines = []
  const cornerXZ = (k) => [-HALF + (k % (N + 1)) * cs, -HALF + Math.floor(k / (N + 1)) * cs]
  const walk = (startK, sid) => {
    const pts = [startK]
    let k = startK
    let s = sid
    const { a, b } = segs[sid]
    for (;;) {
      used[s] = 1
      const seg = segs[s]
      k = seg.k0 === k ? seg.k1 : seg.k0
      pts.push(k)
      const list = adj.get(k)
      if (list.length !== 2) break
      const nxt = list[0] === s ? list[1] : list[0]
      if (used[nxt] || segs[nxt].a !== a || segs[nxt].b !== b) break
      s = nxt
    }
    return { pts, a, b }
  }
  for (const [k, list] of adj) {
    if (list.length === 2 && segs[list[0]].a === segs[list[1]].a && segs[list[0]].b === segs[list[1]].b) continue
    for (const s of list) if (!used[s]) lines.push(walk(k, s))
  }
  for (let s = 0; s < segs.length; s++) if (!used[s]) lines.push(walk(segs[s].k0, s)) // closed loops
  return lines
    .map((ln) => {
      let pts = ln.pts.map(cornerXZ)
      pts = chaikin(pts, 3)
      pts = simplify(pts, cs * 0.25)
      const kind = ln.a === 0 ? 'outer' : mokuOf[ln.a] !== mokuOf[ln.b] ? 'moku' : 'ahupuaa'
      return { pts, a: ln.a, b: ln.b, kind }
    })
    .filter((ln) => ln.pts.length >= 2)
}

export function chaikin(pts, iterations, closed = false) {
  for (let it = 0; it < iterations; it++) {
    if (pts.length < 3) return pts
    const out = closed ? [] : [pts[0]]
    const n = pts.length
    const last = closed ? n : n - 1
    for (let k = 0; k < last; k++) {
      const p = pts[k]
      const q = pts[(k + 1) % n]
      out.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25])
      out.push([p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75])
    }
    if (!closed) out.push(pts[n - 1])
    pts = out
  }
  return pts
}

/** Drop points that sit within `tol` of the line through their neighbours. */
export function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const out = [pts[0]]
  for (let k = 1; k < pts.length - 1; k++) {
    const a = out[out.length - 1]
    const p = pts[k]
    const b = pts[k + 1]
    const dx = b[0] - a[0]
    const dz = b[1] - a[1]
    const l = Math.hypot(dx, dz) || 1
    const d = Math.abs((p[0] - a[0]) * dz - (p[1] - a[1]) * dx) / l
    if (d > tol || Math.hypot(p[0] - a[0], p[1] - a[1]) > tol * 24) out.push(p)
  }
  out.push(pts[pts.length - 1])
  return out
}

/**
 * The ala loa — the trail that ran around the island near the shore, linking
 * every ahupuaʻa. Drawn as the contour a couple of hundred metres inland.
 */
export function shoreTrail(h, N, inland = 2.4) {
  const cs = cellSize(N)
  const d = distanceTransform(N, (c) => h[c] <= 0)
  const iso = inland / cs
  // marching squares on d, collecting crossing segments
  const segs = []
  const P = (i, j) => [-HALF + (i + 0.5) * cs, -HALF + (j + 0.5) * cs]
  const lerpP = (a, b, va, vb) => {
    const t = (iso - va) / (vb - va)
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  }
  for (let j = 0; j < N - 1; j++) {
    for (let i = 0; i < N - 1; i++) {
      const v0 = d[j * N + i]
      const v1 = d[j * N + i + 1]
      const v2 = d[(j + 1) * N + i + 1]
      const v3 = d[(j + 1) * N + i]
      const idx = (v0 > iso ? 1 : 0) | (v1 > iso ? 2 : 0) | (v2 > iso ? 4 : 0) | (v3 > iso ? 8 : 0)
      if (idx === 0 || idx === 15) continue
      const p0 = P(i, j)
      const p1 = P(i + 1, j)
      const p2 = P(i + 1, j + 1)
      const p3 = P(i, j + 1)
      const e = [lerpP(p0, p1, v0, v1), lerpP(p1, p2, v1, v2), lerpP(p2, p3, v2, v3), lerpP(p3, p0, v3, v0)]
      const table = { 1: [[3, 0]], 2: [[0, 1]], 3: [[3, 1]], 4: [[1, 2]], 5: [[3, 2], [0, 1]], 6: [[0, 2]], 7: [[3, 2]], 8: [[2, 3]], 9: [[2, 0]], 10: [[0, 3], [1, 2]], 11: [[2, 1]], 12: [[1, 3]], 13: [[1, 0]], 14: [[0, 3]] }
      for (const [a, b] of table[idx]) segs.push([e[a], e[b]])
    }
  }
  // chain segments by shared endpoints
  const k = (p) => `${Math.round(p[0] * 1000)},${Math.round(p[1] * 1000)}`
  const ends = new Map()
  segs.forEach((s, id) => {
    for (const p of s) {
      const kk = k(p)
      if (!ends.has(kk)) ends.set(kk, [])
      ends.get(kk).push(id)
    }
  })
  const used = new Uint8Array(segs.length)
  let best = []
  for (let s = 0; s < segs.length; s++) {
    if (used[s]) continue
    used[s] = 1
    const pts = [segs[s][0], segs[s][1]]
    for (;;) {
      const last = pts[pts.length - 1]
      const nxt = (ends.get(k(last)) || []).find((id) => !used[id])
      if (nxt === undefined) break
      used[nxt] = 1
      const sg = segs[nxt]
      pts.push(k(sg[0]) === k(last) ? sg[1] : sg[0])
    }
    if (pts.length > best.length) best = pts
  }
  return simplify(chaikin(best, 2, true), cs * 0.3)
}

/** First crossing of each internal boundary with the trail: where the ahu stood. */
export function ahuSites(lines, trail) {
  const sites = []
  const T = trail.length
  for (const ln of lines) {
    if (ln.kind === 'outer') continue
    let hit = null
    for (let a = 0; a < ln.pts.length - 1 && !hit; a++) {
      const p = ln.pts[a]
      const q = ln.pts[a + 1]
      for (let b = 0; b < T; b++) {
        const r = trail[b]
        const s = trail[(b + 1) % T]
        const x = segIntersect(p, q, r, s)
        if (x) {
          hit = x
          break
        }
      }
    }
    if (hit) sites.push({ x: hit[0], z: hit[1], a: ln.a, b: ln.b, moku: ln.kind === 'moku' })
  }
  return sites
}

function segIntersect(p, q, r, s) {
  const d = (q[0] - p[0]) * (s[1] - r[1]) - (q[1] - p[1]) * (s[0] - r[0])
  if (Math.abs(d) < 1e-9) return null
  const t = ((r[0] - p[0]) * (s[1] - r[1]) - (r[1] - p[1]) * (s[0] - r[0])) / d
  const u = ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / d
  if (t < 0 || t > 1 || u < 0 || u > 1) return null
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
}
