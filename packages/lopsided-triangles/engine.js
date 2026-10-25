// The live instance of chapter 9: one tile with L = 6, m = 2, multiplying a
// 243×16 matrix X by a 16×243 matrix Y. Runs in a worker when it can, and on
// the page otherwise.

import { makeTile, tileInputs, encode, PHI, PSI, pruned, entryToString, leafOrder, pow10 } from './algo.js'

export const L = 6
export const M = 2

export function createEngine() {
  const tile = makeTile({ L, m: M, K0: 3 })
  const { N, D } = tile
  const LEAVES = pow10[L]

  // which output string each entry of XY is, and every leaf's order
  const strOf = new Int32Array(N * N)
  for (let I = 0; I < N; I++) for (let J = 0; J < N; J++) strOf[I * N + J] = entryToString(tile, I, J)
  const orderOf = new Int8Array(LEAVES)
  for (let t = 0; t < LEAVES; t++) orderOf[t] = leafOrder(t, L, M)

  let X = null
  let Y = null
  let encA = null
  let encB = null
  const visited = new Uint8Array(LEAVES)

  return {
    tile,
    load(Xin, Yin) {
      const t0 = performance.now()
      X = Float64Array.from(Xin)
      Y = Float64Array.from(Yin)
      const { a, b } = tileInputs(tile, X, Y)
      encA = encode(a, L, PHI)
      encB = encode(b, L, PSI)
      return { ms: performance.now() - t0 }
    },

    // entries: positions I·N + J of the wanted entries
    run(entries) {
      const n = entries.length
      const order = Array.from(entries.keys()).sort((p, q) => strOf[entries[p]] - strOf[entries[q]])
      const U = new Int32Array(n)
      order.forEach((k, i) => (U[i] = strOf[entries[k]]))
      visited.fill(0)
      const byOrder = [0, 0, 0]
      let leaves = 0
      const stats = { work: 0 }
      const t0 = performance.now()
      const res = pruned(U, L, encA, encB, (t) => {
        visited[t] = 1
        byOrder[orderOf[t]]++
        leaves++
      }, stats)
      const ms = performance.now() - t0

      // check every answer against a direct count of common neighbours
      let mismatches = 0
      const values = new Float64Array(n)
      order.forEach((k, i) => {
        const pos = entries[k]
        const I = Math.floor(pos / N)
        const J = pos % N
        let direct = 0
        for (let c = 0; c < D; c++) direct += X[I * D + c] * Y[c * N + J]
        values[k] = res[i]
        if (res[i] !== direct) mismatches++
      })

      // which calls were made, level by level, binned to at most 1,000 columns
      const bins = []
      let called = visited
      const levels = [called]
      for (let d = L - 1; d >= 1; d--) {
        const up = new Uint8Array(pow10[d])
        for (let v = 0; v < up.length; v++) {
          let any = 0
          for (let c = 0; c < 10; c++) any |= called[v * 10 + c]
          up[v] = any
        }
        levels.unshift(up)
        called = up
      }
      levels.forEach((arr) => {
        const width = Math.min(arr.length, 1000)
        const group = arr.length / width
        const out = new Float32Array(width)
        for (let i = 0; i < width; i++) {
          let s = 0
          for (let g = 0; g < group; g++) s += arr[i * group + g]
          out[i] = s / group
        }
        bins.push(out)
      })

      return { n, leaves, byOrder, work: stats.work, ms, mismatches, values, bins }
    },
  }
}
