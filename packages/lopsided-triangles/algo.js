// The matrix algorithm of Section 2, at a size a browser can run.
//
// Every number here is an exact integer: the inputs are small, and the largest
// value anything reaches (a sum of at most 10^L products of two encoded
// numbers) stays far below 2^53, so plain doubles never round.

// ───────────────────────────────────────────── Schönhage's identity (§2.2)
//
// Left variables  s:  x1 x2 x3  p11 p12 p21 p22          indices 0..6
// Right variables t:  y1 y2 y3  q11 q12 q21 q22          indices 0..6
// Output vars     z:  z11 z12 z13 z21 z22 z23 z31 z32 z33  z0   indices 0..9
// Terms           λ:  P11 … P33  P0                      indices 0..9
//
// Term P_ij multiplies (x_i + p̂_ij)(y_j + q̂_ij) and feeds z_ij and z0;
// P0 multiplies −(x1 + x2 + x3)(y1 + y2 + y3) and feeds z0 alone.

export const LEFT = ['x1', 'x2', 'x3', 'p11', 'p12', 'p21', 'p22']
export const RIGHT = ['y1', 'y2', 'y3', 'q11', 'q12', 'q21', 'q22']
export const OUT = ['z11', 'z12', 'z13', 'z21', 'z22', 'z23', 'z31', 'z32', 'z33', 'z0']
export const TERMS = ['P11', 'P12', 'P13', 'P21', 'P22', 'P23', 'P31', 'P32', 'P33', 'P0']
export const P0 = 9
export const Z0 = 9

// PHI[λ] lists the [left variable, coefficient] pairs of the linear form φ_λ.
export const PHI = [
  [[0, 1], [3, 1]], //            P11: x1 + p11
  [[0, 1], [4, 1]], //            P12: x1 + p12
  [[0, 1]], //                    P13: x1
  [[1, 1], [5, 1]], //            P21: x2 + p21
  [[1, 1], [6, 1]], //            P22: x2 + p22
  [[1, 1]], //                    P23: x2
  [[2, 1], [3, -1], [5, -1]], //  P31: x3 − p11 − p21
  [[2, 1], [4, -1], [6, -1]], //  P32: x3 − p12 − p22
  [[2, 1]], //                    P33: x3
  [[0, -1], [1, -1], [2, -1]], // P0:  −(x1 + x2 + x3)
]

// PSI[λ] does the same for ψ_λ over the right variables.
export const PSI = [
  [[0, 1], [3, 1]], //            P11: y1 + q11
  [[1, 1], [4, 1]], //            P12: y2 + q12
  [[2, 1], [3, -1], [4, -1]], //  P13: y3 − q11 − q12
  [[0, 1], [5, 1]], //            P21: y1 + q21
  [[1, 1], [6, 1]], //            P22: y2 + q22
  [[2, 1], [5, -1], [6, -1]], //  P23: y3 − q21 − q22
  [[0, 1]], //                    P31: y1
  [[1, 1]], //                    P32: y2
  [[2, 1]], //                    P33: y3
  [[0, 1], [1, 1], [2, 1]], //    P0:  y1 + y2 + y3
]

// One application of the identity to actual numbers. x, y have three entries;
// p, q are 2×2. Returns the ten linear-form values, the ten products, and the
// ten outputs the decoding assembles from them.
export function applyIdentity({ x, y, p, q }) {
  const left = [x[0], x[1], x[2], p[0][0], p[0][1], p[1][0], p[1][1]]
  const right = [y[0], y[1], y[2], q[0][0], q[0][1], q[1][0], q[1][1]]
  const phi = PHI.map((f) => f.reduce((s, [i, c]) => s + c * left[i], 0))
  const psi = PSI.map((f) => f.reduce((s, [i, c]) => s + c * right[i], 0))
  const prod = phi.map((v, k) => v * psi[k])
  const z = prod.slice(0, 9)
  const z0 = prod.reduce((s, v) => s + v, 0)
  return { phi, psi, prod, z, z0 }
}

// p̂ and q̂: the 2×2 blocks padded to 3×3 so every column of p̂ and every row
// of q̂ sums to zero.
export function hats(p, q) {
  const ph = [
    [p[0][0], p[0][1], 0],
    [p[1][0], p[1][1], 0],
    [-p[0][0] - p[1][0], -p[0][1] - p[1][1], 0],
  ]
  const qh = [
    [q[0][0], q[0][1], -q[0][0] - q[0][1]],
    [q[1][0], q[1][1], -q[1][0] - q[1][1]],
    [0, 0, 0],
  ]
  return { ph, qh }
}

// ───────────────────────────────────────────── strings and their counts

export const pow7 = Array.from({ length: 12 }, (_, i) => 7 ** i)
export const pow10 = Array.from({ length: 12 }, (_, i) => 10 ** i)

export function choose(n, k) {
  if (k < 0 || k > n) return 0
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return Math.round(r)
}

// All m-element subsets of the levels 0..L−1, in lexicographic order.
export function subsets(L, m) {
  const out = []
  const cur = []
  const go = (start) => {
    if (cur.length === m) {
      out.push(cur.slice())
      return
    }
    for (let l = start; l < L; l++) {
      cur.push(l)
      go(l + 1)
      cur.pop()
    }
  }
  go(0)
  return out
}

// Digits of a string code, first level first.
export function digits(code, L, base) {
  const d = new Array(L)
  for (let l = L - 1; l >= 0; l--) {
    d[l] = code % base
    code = Math.floor(code / base)
  }
  return d
}

export function undigits(d, base) {
  let code = 0
  for (const x of d) code = code * base + x
  return code
}

// ───────────────────────────────────────────── a tile (§2.3.3 – §2.3.4)
//
// One run of the recursion multiplies an N0×D block by a D×N0 block for every
// m-element set Q of levels at once (Lemma 9). A tile lays K0×K0 of those
// block products side by side: block (r, c) of XY is row block r of X times
// column block c of Y, and it is computed under its own set Q = grid[r][c].

export function makeTile({ L, m, K0 }) {
  const N0 = 3 ** (L - m)
  const D = 4 ** m
  const qs = subsets(L, m)
  const K = qs.length
  if (K0 * K0 > K) throw new Error('tile needs K0² ≤ C(L, m)')
  const N = K0 * N0
  // Block products take the first K0² subsets, row by row.
  const grid = Array.from({ length: K0 }, (_, r) => Array.from({ length: K0 }, (_, c) => r * K0 + c))
  const qIndex = new Map(qs.map((Q, i) => [Q.join(','), i]))
  const blockOf = new Array(K).fill(null)
  for (let r = 0; r < K0; r++) for (let c = 0; c < K0; c++) blockOf[grid[r][c]] = [r, c]
  return { L, m, K0, N0, D, N, K, qs, grid, qIndex, blockOf }
}

// Spread `row` (base 3) over the outer levels and `col` (base inner) over the
// levels of Q, giving the per-level digits of a string with inner set Q.
function place(tile, Q, outerDigits, innerDigits, innerOffset) {
  const { L } = tile
  const d = new Array(L)
  let o = 0
  let n = 0
  for (let l = 0; l < L; l++) {
    if (Q.includes(l)) d[l] = innerOffset + innerDigits[n++]
    else d[l] = outerDigits[o++]
  }
  return d
}

// The input arrays a (on left strings) and b (on right strings): X_Q and Y_Q
// laid side by side, zero on every string whose inner set is not one of the
// tile's sets. X is N×D and Y is D×N, both row-major.
export function tileInputs(tile, X, Y) {
  const { L, m, N0, D, N, K0, qs, grid } = tile
  const a = new Float64Array(pow7[L])
  const b = new Float64Array(pow7[L])
  for (let r = 0; r < K0; r++) {
    for (let c = 0; c < K0; c++) {
      const Q = qs[grid[r][c]]
      for (let row = 0; row < N0; row++) {
        const od = digits(row, L - m, 3)
        for (let pi = 0; pi < D; pi++) {
          const id = digits(pi, m, 4)
          const u = undigits(place(tile, Q, od, id, 3), 7)
          a[u] = X[(r * N0 + row) * D + pi]
        }
      }
      for (let pi = 0; pi < D; pi++) {
        const id = digits(pi, m, 4)
        for (let col = 0; col < N0; col++) {
          const od = digits(col, L - m, 3)
          const v = undigits(place(tile, Q, od, id, 3), 7)
          b[v] = Y[pi * N + c * N0 + col]
        }
      }
    }
  }
  return { a, b }
}

// The output string of product entry (row, col) under set Q: z0 on Q, and
// z_ij on every other level, with i read off the row and j off the column.
export function outputString(tile, Q, row, col) {
  const { L, m } = tile
  const ri = digits(row, L - m, 3)
  const cj = digits(col, L - m, 3)
  const d = new Array(L)
  let o = 0
  for (let l = 0; l < L; l++) {
    if (Q.includes(l)) d[l] = Z0
    else {
      d[l] = 3 * ri[o] + cj[o]
      o++
    }
  }
  return undigits(d, 10)
}

// The entry (I, J) of the tile's N×N product as an output string.
export function entryToString(tile, I, J) {
  const { N0, qs, grid } = tile
  const r = Math.floor(I / N0)
  const c = Math.floor(J / N0)
  return outputString(tile, qs[grid[r][c]], I % N0, J % N0)
}

// The inverse: which set Q, and where in X_Q Y_Q, an output string points.
export function parseOutput(tile, w) {
  const { L } = tile
  const d = digits(w, L, 10)
  const Q = []
  let row = 0
  let col = 0
  for (let l = 0; l < L; l++) {
    if (d[l] === Z0) Q.push(l)
    else {
      row = row * 3 + Math.floor(d[l] / 3)
      col = col * 3 + (d[l] % 3)
    }
  }
  return { Q, row, col, digits: d }
}

// ───────────────────────────────────────────── the recursion (§2.3.1, §2.4)

// The encoding of an input array (§2.4.1): the number Φ_τ(a) every leaf τ
// multiplies, for all 10^L leaves, computed by running the way down of the
// recursion alone (Yates' algorithm). `forms` is PHI or PSI.
export function encode(arr, L, forms) {
  const out = new Float64Array(pow10[L])
  const bufs = []
  for (let k = 0; k < L; k++) bufs.push(new Float64Array(pow7[L - k - 1]))
  const go = (src, srcOff, depth, outOff) => {
    const rem = L - depth
    if (rem === 0) {
      out[outOff] = src[srcOff]
      return
    }
    const n7 = pow7[rem - 1]
    const n10 = pow10[rem - 1]
    const buf = bufs[depth]
    for (let lam = 0; lam < 10; lam++) {
      buf.fill(0)
      for (const [s, c] of forms[lam]) {
        const base = srcOff + s * n7
        if (c === 1) for (let i = 0; i < n7; i++) buf[i] += src[base + i]
        else for (let i = 0; i < n7; i++) buf[i] -= src[base + i]
      }
      go(buf, 0, depth + 1, outOff + lam * n10)
    }
  }
  go(arr, 0, 0, 0)
  return out
}

// FULL's way up for every output at once: at each level the output z_ij takes
// its term P_ij unchanged and z0 takes the sum of all ten terms.
export function decodeAll(prod, L) {
  const c = Float64Array.from(prod)
  for (let ax = 0; ax < L; ax++) {
    const stride = pow10[L - 1 - ax]
    const block = stride * 10
    for (let base = 0; base < c.length; base += block) {
      for (let off = 0; off < stride; off++) {
        let s = 0
        for (let dd = 0; dd < 10; dd++) s += c[base + dd * stride + off]
        c[base + 9 * stride + off] = s
      }
    }
  }
  return c
}

// PRUNED (§2.4.2). U is a sorted list of output strings. Each call receives
// the suffixes it is asked for, recurses only into terms that feed one of
// them, and adds up only what was asked. It reaches exactly the leaves that
// contribute to some string of U (Lemma 10). `onLeaf(τ)` sees every leaf it
// reaches; `stats.work` counts the strings handled at internal vertices.
//
// The recursion is depth-first, so each depth owns one set of scratch arrays
// that its call reuses for every child: a child's answer is read back before
// the next sibling overwrites it. The last level is unrolled, since below it
// every call would be a single leaf.
export function pruned(U, L, encA, encB, onLeaf, stats) {
  const cap = (d) => Math.max(1, Math.min(U.length * 2, pow10[L - d]))
  const pool = []
  for (let d = 0; d <= L; d++) {
    const n = cap(d)
    pool.push({
      start: new Int32Array(11),
      out: new Float64Array(n),
      z0sum: new Float64Array(n),
      merged: new Int32Array(n),
      posA: new Int32Array(n),
      posB: new Int32Array(n),
    })
  }
  const inS = new Uint8Array(10)

  const go = (S, nS, depth, tau) => {
    const rem = L - depth
    const P = pool[depth]
    const out = P.out
    if (stats) stats.work += nS

    if (rem === 1) {
      // S holds single digits. z_ij needs only the leaf P_ij; z0 needs all ten.
      const hasZ0 = nS > 0 && S[nS - 1] === Z0
      inS.fill(0)
      let z0 = 0
      for (let i = 0; i < nS; i++) {
        const z = S[i]
        if (z === Z0) continue
        inS[z] = 1
        const leaf = tau * 10 + z
        const v = encA[leaf] * encB[leaf]
        if (onLeaf) onLeaf(leaf)
        out[i] = v
        z0 += v
      }
      if (hasZ0) {
        for (let lam = 0; lam < 10; lam++) {
          if (lam < 9 && inS[lam]) continue
          const leaf = tau * 10 + lam
          if (onLeaf) onLeaf(leaf)
          z0 += encA[leaf] * encB[leaf]
        }
        out[nS - 1] = z0
      }
      return out
    }

    const n10 = pow10[rem - 1]
    const start = P.start
    let i = 0
    for (let z = 0; z < 10; z++) {
      start[z] = i
      const hi = (z + 1) * n10
      while (i < nS && S[i] < hi) i++
    }
    start[10] = nS
    const z0lo = start[9]
    const nz0 = nS - z0lo
    const z0off = 9 * n10
    const z0sum = P.z0sum
    z0sum.fill(0, 0, nz0)
    const merged = P.merged
    const posA = P.posA
    const posB = P.posB

    // P0 contributes to z0 only: it is asked for exactly the z0 slice.
    if (nz0 > 0) {
      for (let t = 0; t < nz0; t++) merged[t] = S[z0lo + t] - z0off
      const C = go(merged, nz0, depth + 1, tau * 10 + P0)
      for (let t = 0; t < nz0; t++) z0sum[t] += C[t]
    }

    // P_ij contributes to z_ij and z0: it is asked for the union of both slices.
    for (let lam = 0; lam < 9; lam++) {
      const lo = start[lam]
      const na = start[lam + 1] - lo
      if (na === 0 && nz0 === 0) continue
      const offA = lam * n10
      let ia = 0
      let ib = 0
      let k = 0
      while (ia < na || ib < nz0) {
        const va = ia < na ? S[lo + ia] - offA : Infinity
        const vb = ib < nz0 ? S[z0lo + ib] - z0off : Infinity
        if (va < vb) {
          merged[k] = va
          posA[ia++] = k++
        } else if (vb < va) {
          merged[k] = vb
          posB[ib++] = k++
        } else {
          merged[k] = va
          posA[ia++] = k
          posB[ib++] = k
          k++
        }
      }
      const C = go(merged, k, depth + 1, tau * 10 + lam)
      for (let t = 0; t < na; t++) out[lo + t] = C[posA[t]]
      for (let t = 0; t < nz0; t++) z0sum[t] += C[posB[t]]
    }
    for (let t = 0; t < nz0; t++) out[z0lo + t] = z0sum[t]
    return out
  }
  if (U.length === 0) return new Float64Array(0)
  return Float64Array.from(go(U, U.length, 0, 0).subarray(0, U.length))
}

// ───────────────────────────────────────────── leaves, orders, sharing (§2.4.3)

// The order of a leaf: m minus the number of levels at which it chooses P0.
export function leafOrder(tau, L, m) {
  let zeros = 0
  for (let l = 0; l < L; l++) {
    if (tau % 10 === P0) zeros++
    tau = Math.floor(tau / 10)
  }
  return m - zeros
}

// The 10^m leaves contributing to output string w: any term on the levels
// where w has z0, and P_ij wherever w has z_ij.
export function leavesOf(w, L) {
  const d = digits(w, L, 10)
  const free = []
  for (let l = 0; l < L; l++) if (d[l] === Z0) free.push(l)
  const out = []
  const n = 10 ** free.length
  for (let t = 0; t < n; t++) {
    const choice = digits(t, free.length, 10)
    const leaf = d.slice()
    free.forEach((l, k) => (leaf[l] = choice[k]))
    out.push(undigits(leaf, 10))
  }
  return out
}

// The output strings with exactly m inner levels that leaf τ contributes to:
// z0 wherever τ has P0, plus z0 on any further levels needed to make m of
// them, and z_ij matching τ everywhere else.
export function outputsOf(tau, L, m) {
  const d = digits(tau, L, 10)
  const zeros = []
  const others = []
  for (let l = 0; l < L; l++) (d[l] === P0 ? zeros : others).push(l)
  const need = m - zeros.length
  if (need < 0) return []
  const out = []
  for (const extra of subsets(others.length, need)) {
    const w = d.slice()
    for (const k of extra) w[others[k]] = Z0
    out.push(undigits(w, 10))
  }
  return out
}

// ───────────────────────────────────────────── counts at full size (Lemma 11)
//
// Everything below works with natural logarithms of the counts, so it can
// follow m into the thousands.

const lfCache = [0]
export function logFactorial(n) {
  for (let i = lfCache.length; i <= n; i++) lfCache[i] = lfCache[i - 1] + Math.log(i)
  return lfCache[n]
}
export function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k)
}

// α_d = C(m,d) 9^d leaves of order d under one output string;
// β_d = C(L, m−d) 9^(L−m+d) leaves of order d in the whole tile.
export function orderCounts(L, m) {
  const ln9 = Math.log(9)
  const alpha = []
  const beta = []
  for (let d = 0; d <= m; d++) {
    alpha.push(logChoose(m, d) + d * ln9)
    beta.push(logChoose(L, m - d) + (L - m + d) * ln9)
  }
  return { alpha, beta, M: beta[0] }
}

// log of a sum of numbers given by their logs, without overflow.
export function logSumExp(xs) {
  const mx = Math.max(...xs)
  if (mx === -Infinity) return -Infinity
  let s = 0
  for (const x of xs) s += Math.exp(x - mx)
  return mx + Math.log(s)
}

// The bound of Lemma 11 on |Leaves(U)| for a wanted set of |U| = M / D^κ
// output strings, and the pieces it is made of, all as logs.
export function leafBound(L, m, kappa) {
  const { alpha, beta, M } = orderCounts(L, m)
  const lnD = m * Math.log(4)
  const lnU = M - kappa * lnD
  const charged = alpha.map((a) => lnU + a)
  const mins = charged.map((c, d) => Math.min(c, beta[d]))
  return { alpha, beta, M, lnD, lnU, charged, mins, total: logSumExp(mins) }
}
