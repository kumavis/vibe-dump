// Water on the finished land: which way every cell drains, how much rain passes
// through it, and the stream lines that come out of that.
//
// Priority-flood (Barnes et al. 2014) seeds from the coast and grows inland in
// order of elevation, nudging every cell at least a hair above the one it was
// reached from, so the surface it leaves behind drains to the sea from
// everywhere — no pits, no flats. The order cells come off the heap in is also a
// valid upstream-last order, which is all flow accumulation needs.

import { CellHeap, D8X, D8Y, D8L, toWorld, cellSize } from './grid.js'

const EPS = 1e-3

/**
 * @returns {{ filled, rcv, order, count, area }}
 *   rcv[c] — the cell c drains into (itself for ocean cells)
 *   order  — land cells, downstream first
 *   area   — rain-weighted drainage area in km² of 1 m/yr rain-equivalent
 */
export function routeWater(h, N, rain) {
  const NN = N * N
  const filled = new Float32Array(h)
  const closed = new Uint8Array(NN)
  const heap = new CellHeap(1 << 16)
  // Ocean is closed from the start; coast cells (land touching it) seed the flood.
  for (let c = 0; c < NN; c++) if (h[c] <= 0) closed[c] = 1
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const c = j * N + i
      if (closed[c]) continue
      let coast = i === 0 || j === 0 || i === N - 1 || j === N - 1
      for (let d = 0; d < 8 && !coast; d++) {
        const n = c + D8Y[d] * N + D8X[d]
        if (h[n] <= 0) coast = true // the sea itself, not cells seeded earlier in this scan
      }
      if (coast) {
        closed[c] = 1
        heap.push(c, h[c])
      }
    }
  }
  const order = new Int32Array(NN)
  let count = 0
  while (heap.size > 0) {
    const c = heap.pop()
    order[count++] = c
    const i = c % N
    const j = (c / N) | 0
    for (let d = 0; d < 8; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      const n = nj * N + ni
      if (closed[n]) continue
      closed[n] = 1
      const f = Math.max(h[n], filled[c] + EPS)
      filled[n] = f
      heap.push(n, f)
    }
  }
  // Steepest descent on the filled surface.
  const rcv = new Int32Array(NN)
  for (let c = 0; c < NN; c++) rcv[c] = c
  for (let q = 0; q < count; q++) {
    const c = order[q]
    const i = c % N
    const j = (c / N) | 0
    let best = 0
    for (let d = 0; d < 8; d++) {
      const ni = i + D8X[d]
      const nj = j + D8Y[d]
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue
      const n = nj * N + ni
      const s = (filled[c] - filled[n]) / D8L[d]
      if (s > best) {
        best = s
        rcv[c] = n
      }
    }
  }
  const cellKm2 = (cellSize(N) * 0.1) ** 2
  const area = new Float32Array(NN)
  for (let q = 0; q < count; q++) {
    const c = order[q]
    area[c] = cellKm2 * (rain ? rain[c] / 1000 : 1)
  }
  for (let q = count - 1; q >= 0; q--) {
    const c = order[q]
    if (rcv[c] !== c) area[rcv[c]] += area[c]
  }
  return { filled, rcv, order, count, area }
}

/**
 * Trace stream polylines through every cell whose drainage exceeds `minArea`,
 * from channel heads down to the sea or to the stream they join. Each line is a
 * list of [x, z, cell] in world units; `mouth` marks lines that reach the sea.
 */
export function traceStreams(route, N, minArea, h) {
  const { rcv, order, count, area } = route
  const NN = N * N
  const isCh = new Uint8Array(NN)
  for (let q = 0; q < count; q++) {
    const c = order[q]
    if (area[c] >= minArea) isCh[c] = 1
  }
  // heads: channel cells no channel drains into
  const fed = new Uint8Array(NN)
  for (let c = 0; c < NN; c++) if (isCh[c] && rcv[c] !== c) fed[rcv[c]] = 1
  const visited = new Uint8Array(NN)
  const lines = []
  // Start from the biggest heads first so trunk streams are traced whole.
  const heads = []
  for (let c = 0; c < NN; c++) if (isCh[c] && !fed[c]) heads.push(c)
  for (const head of heads) {
    const pts = []
    let c = head
    let mouth = false
    for (;;) {
      pts.push([toWorld(N, c % N), toWorld(N, (c / N) | 0), c])
      if (visited[c]) break
      visited[c] = 1
      const r = rcv[c]
      if (r === c || h[r] <= 0) {
        if (r !== c) pts.push([toWorld(N, r % N), toWorld(N, (r / N) | 0), r])
        mouth = true
        break
      }
      c = r
    }
    if (pts.length >= 3) lines.push({ pts, mouth, area: area[pts[pts.length - 1][2]] })
  }
  return lines
}
