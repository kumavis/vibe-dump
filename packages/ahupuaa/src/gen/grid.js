// Square scalar grids laid over the world square, and the handful of classic
// raster algorithms the generator leans on: resampling, a binary heap for
// priority-flood, and Felzenszwalb's exact Euclidean distance transform.

import { WORLD, HALF } from '../config.js'

// Cell (i, j) of an N-grid is centred at x = -HALF + (i + 0.5) * WORLD / N.
export const cellSize = (N) => WORLD / N
export const toCell = (N, w) => (w + HALF) / (WORLD / N) - 0.5
export const toWorld = (N, c) => -HALF + (c + 0.5) * (WORLD / N)

/** Bilinear sample of an N×N grid at world (x, z), clamped at the edges. */
export function sample(arr, N, x, z) {
  let fx = toCell(N, x)
  let fz = toCell(N, z)
  if (fx < 0) fx = 0
  else if (fx > N - 1.001) fx = N - 1.001
  if (fz < 0) fz = 0
  else if (fz > N - 1.001) fz = N - 1.001
  const i = fx | 0
  const j = fz | 0
  const tx = fx - i
  const tz = fz - j
  const k = j * N + i
  const a = arr[k] + (arr[k + 1] - arr[k]) * tx
  const b = arr[k + N] + (arr[k + N + 1] - arr[k + N]) * tx
  return a + (b - a) * tz
}

/** Nearest-cell lookup at world (x, z); -1 index when outside the grid. */
export function cellIndex(N, x, z) {
  const i = Math.floor((x + HALF) / (WORLD / N))
  const j = Math.floor((z + HALF) / (WORLD / N))
  if (i < 0 || j < 0 || i >= N || j >= N) return -1
  return j * N + i
}

const cubic = (p0, p1, p2, p3, t) =>
  p1 + 0.5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)))

/** Catmull-Rom upsample from Ns to Nd (both covering the same world square). */
export function upsample(src, Ns, Nd) {
  const dst = new Float32Array(Nd * Nd)
  const r = Ns / Nd
  const at = (i, j) => src[(j < 0 ? 0 : j >= Ns ? Ns - 1 : j) * Ns + (i < 0 ? 0 : i >= Ns ? Ns - 1 : i)]
  const rowTmp = new Float32Array(4)
  for (let y = 0; y < Nd; y++) {
    const fy = (y + 0.5) * r - 0.5
    const j = Math.floor(fy)
    const ty = fy - j
    for (let x = 0; x < Nd; x++) {
      const fx = (x + 0.5) * r - 0.5
      const i = Math.floor(fx)
      const tx = fx - i
      for (let m = -1; m <= 2; m++) {
        rowTmp[m + 1] = cubic(at(i - 1, j + m), at(i, j + m), at(i + 1, j + m), at(i + 2, j + m), tx)
      }
      dst[y * Nd + x] = cubic(rowTmp[0], rowTmp[1], rowTmp[2], rowTmp[3], ty)
    }
  }
  return dst
}

/** Box-filter downsample by an integer factor. */
export function downsample(src, Ns, factor) {
  const Nd = Ns / factor
  const dst = new Float32Array(Nd * Nd)
  const inv = 1 / (factor * factor)
  for (let y = 0; y < Nd; y++) {
    for (let x = 0; x < Nd; x++) {
      let s = 0
      for (let b = 0; b < factor; b++) {
        const row = (y * factor + b) * Ns + x * factor
        for (let a = 0; a < factor; a++) s += src[row + a]
      }
      dst[y * Nd + x] = s * inv
    }
  }
  return dst
}

/** Separable box blur with radius r (in cells), repeated `passes` times. */
export function blur(src, N, r, passes = 1) {
  let a = Float32Array.from(src)
  let b = new Float32Array(N * N)
  const w = 1 / (2 * r + 1)
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < N; y++) {
      const row = y * N
      let s = 0
      for (let k = -r; k <= r; k++) s += a[row + Math.min(N - 1, Math.max(0, k))]
      for (let x = 0; x < N; x++) {
        b[row + x] = s * w
        s += a[row + Math.min(N - 1, x + r + 1)] - a[row + Math.max(0, x - r)]
      }
    }
    for (let x = 0; x < N; x++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += b[Math.min(N - 1, Math.max(0, k)) * N + x]
      for (let y = 0; y < N; y++) {
        a[y * N + x] = s * w
        s += b[Math.min(N - 1, y + r + 1) * N + x] - b[Math.max(0, y - r) * N + x]
      }
    }
  }
  return a
}

/**
 * Min-heap of grid cells keyed by a float, for priority-flood. Stores keys
 * alongside indices so a cell can be pushed with a raised elevation.
 */
export class CellHeap {
  constructor(capacity) {
    this.keys = new Float64Array(capacity)
    this.ids = new Int32Array(capacity)
    this.size = 0
  }
  push(id, key) {
    let n = this.size++
    if (n >= this.ids.length) {
      const k = new Float64Array(this.ids.length * 2)
      k.set(this.keys)
      this.keys = k
      const d = new Int32Array(this.ids.length * 2)
      d.set(this.ids)
      this.ids = d
    }
    const keys = this.keys
    const ids = this.ids
    while (n > 0) {
      const p = (n - 1) >> 1
      if (keys[p] <= key) break
      keys[n] = keys[p]
      ids[n] = ids[p]
      n = p
    }
    keys[n] = key
    ids[n] = id
  }
  pop() {
    const keys = this.keys
    const ids = this.ids
    const top = ids[0]
    this.topKey = keys[0]
    const n = --this.size
    if (n > 0) {
      const key = keys[n]
      const id = ids[n]
      let i = 0
      for (;;) {
        let c = 2 * i + 1
        if (c >= n) break
        if (c + 1 < n && keys[c + 1] < keys[c]) c++
        if (keys[c] >= key) break
        keys[i] = keys[c]
        ids[i] = ids[c]
        i = c
      }
      keys[i] = key
      ids[i] = id
    }
    return top
  }
}

// 1-D squared distance transform (Felzenszwalb & Huttenlocher 2012).
function edt1d(f, n, d, v, z) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    const dq = q - v[k]
    d[q] = dq * dq + f[v[k]]
  }
}

/**
 * Exact Euclidean distance (in cells) from every cell to the nearest cell where
 * `seed(i)` is true.
 */
export function distanceTransform(N, seed) {
  const INF = 1e20
  const g = new Float64Array(N * N)
  for (let i = 0; i < N * N; i++) g[i] = seed(i) ? 0 : INF
  const f = new Float64Array(N)
  const d = new Float64Array(N)
  const v = new Int32Array(N)
  const z = new Float64Array(N + 1)
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) f[y] = g[y * N + x]
    edt1d(f, N, d, v, z)
    for (let y = 0; y < N; y++) g[y * N + x] = d[y]
  }
  const out = new Float32Array(N * N)
  for (let y = 0; y < N; y++) {
    const row = y * N
    for (let x = 0; x < N; x++) f[x] = g[row + x]
    edt1d(f, N, d, v, z)
    for (let x = 0; x < N; x++) out[row + x] = Math.sqrt(d[x])
  }
  return out
}

// D8 neighbour offsets, with their lengths, in a fixed order the hydrology code
// can index into.
export const D8X = [1, 1, 0, -1, -1, -1, 0, 1]
export const D8Y = [0, 1, 1, 1, 0, -1, -1, -1]
export const D8L = [1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2]
