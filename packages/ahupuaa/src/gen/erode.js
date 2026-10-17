// Rain carving the shields: stream-power incision plus collapsing valley walls.
//
// Each pass routes water downhill (steepest descent, D8), totals the rain that
// drains through every cell, and lowers each cell toward the one it drains into
// by an amount that grows with that discharge — the implicit scheme of Braun &
// Willett (2013), which is stable at any step size because it updates cells in
// downstream-to-upstream order. Big rain-fed channels cut down to a graded floor
// almost at once; small high ones barely move. The boundary between the two is
// a knickpoint, and on a shield it reads exactly like a Hawaiian valley head: a
// flat floor running far inland, then a sheer amphitheatre wall.
//
// Erodibility scales with rainfall, which is why the windward side ends up
// gouged into deep parallel valleys with knife-edge ridges between them while
// the leeward side keeps its broad, gently gullied slopes.
//
// A slope limiter then lets over-steep walls slump, widening slots into the
// steep U-shaped troughs the valleys actually are.

import { D8X, D8Y, D8L, cellSize, downsample as downsampleBy, upsample as upsampleTo } from './grid.js'

export function erode(h, N, rain, age, opts = {}) {
  const {
    jitter = null, // optional static noise (m) that nudges which neighbour water picks
    iterations = 40,
    k = 0.0045, // incision coefficient
    m = 0.5, // area exponent
    graded = 0.32, // floor slope = graded * A^-theta
    theta = 0.36,
    critical = 1.05, // tan of the steepest wall that stands (true scale)
    onProgress,
  } = opts
  const NN = N * N
  const dxM = cellSize(N) * 100
  const rcv = new Int32Array(NN)
  const rlen = new Float32Array(NN)
  const ndon = new Int32Array(NN)
  const donStart = new Int32Array(NN + 1)
  const donors = new Int32Array(NN)
  const fill = new Int32Array(NN)
  const order = new Int32Array(NN)
  const stack = new Int32Array(NN)
  const area = new Float32Array(NN)
  const weight = new Float32Array(NN)
  const delta = new Float32Array(NN)
  for (let c = 0; c < NN; c++) weight[c] = rain[c] / 2000

  const wallDrop = critical * dxM

  for (let it = 0; it < iterations; it++) {
    // 1. receivers
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const c = j * N + i
        rcv[c] = c
        rlen[c] = 1
        if (h[c] <= 0 || i === 0 || j === 0 || i === N - 1 || j === N - 1) continue
        let best = 0
        const hc = jitter ? h[c] + jitter[c] : h[c]
        for (let d = 0; d < 8; d++) {
          const n = c + D8Y[d] * N + D8X[d]
          const s = (hc - (jitter ? h[n] + jitter[n] : h[n])) / D8L[d]
          if (s > best) {
            best = s
            rcv[c] = n
            rlen[c] = D8L[d]
          }
        }
      }
    }
    // 2. donor lists (CSR) and a base-level-first stack order
    ndon.fill(0)
    for (let c = 0; c < NN; c++) if (rcv[c] !== c) ndon[rcv[c]]++
    donStart[0] = 0
    for (let c = 0; c < NN; c++) donStart[c + 1] = donStart[c] + ndon[c]
    fill.set(donStart.subarray(0, NN))
    for (let c = 0; c < NN; c++) {
      const r = rcv[c]
      if (r !== c) donors[fill[r]++] = c
    }
    let nOrder = 0
    for (let c = 0; c < NN; c++) {
      if (rcv[c] !== c) continue
      let sp = 0
      stack[sp++] = c
      while (sp > 0) {
        const n = stack[--sp]
        order[nOrder++] = n
        for (let q = donStart[n]; q < donStart[n + 1]; q++) stack[sp++] = donors[q]
      }
    }
    // 3. rain-weighted drainage area, accumulated from the tips down
    area.set(weight)
    for (let q = nOrder - 1; q >= 0; q--) {
      const c = order[q]
      const r = rcv[c]
      if (r !== c) area[r] += area[c]
    }
    // 4. implicit incision, from the sea upward
    for (let q = 0; q < nOrder; q++) {
      const c = order[q]
      const r = rcv[c]
      if (r === c) continue
      const hr = Math.max(0, h[r])
      const A = area[c]
      const F = (k * age[c] * Math.pow(A, m)) / rlen[c]
      let hn = (h[c] + F * hr) / (1 + F)
      const floor = hr + graded * Math.pow(A, -theta) * rlen[c] * dxM
      if (hn < floor) hn = floor
      if (hn < h[c]) h[c] = hn
    }
    // 5. walls steeper than `critical` slump into the cell below them
    delta.fill(0)
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        const c = j * N + i
        const hc = h[c]
        if (hc <= 0) continue
        for (let d = 0; d < 8; d += 2) {
          const n = c + D8Y[d] * N + D8X[d]
          const excess = hc - h[n] - wallDrop
          if (excess > 0) {
            const t = excess * 0.22
            delta[c] -= t
            delta[n] += t
          }
        }
      }
    }
    for (let c = 0; c < NN; c++) h[c] += delta[c]
    if (onProgress) onProgress((it + 1) / iterations)
  }
  return { area, rcv }
}

/**
 * Coarse-to-fine landscape evolution. The big valleys are decided on a coarse
 * grid, where a few iterations move a lot of rock; each finer level inherits
 * them, gets back some of the original small-scale relief, and cuts its own
 * tributaries. Running everything at full resolution from the start would carve
 * the same picture far slower and with more grid-aligned streaks.
 *
 * `jitter(n)` returns a static elevation noise for an n-grid, used only to
 * break ties in the direction water picks.
 */
export function evolve(height, age, rainW, N, levels, jitter, opts = {}) {
  const { k = 0.01, critical = 1.05, detailKeep = 0.6, onProgress } = opts
  let n = levels[0][0]
  const down = (a, nn) => (nn === N ? a : downsampleBy(a, N, N / nn))
  let h = down(height, n)
  const total = levels.reduce((s, l) => s + l[1] * l[0] * l[0], 0)
  let done = 0
  const report = (lvl, p) => onProgress && onProgress((done + p * lvl[1] * lvl[0] * lvl[0]) / total)
  erode(h, n, down(rainW, n), down(age, n), {
    iterations: levels[0][1],
    k: k * levels[0][2],
    jitter: jitter(n),
    critical,
    onProgress: (p) => report(levels[0], p),
  })
  done += levels[0][1] * n * n
  for (const lvl of levels.slice(1)) {
    const [nn, it, kf] = lvl
    const baseF = down(height, nn)
    const baseC = downsampleBy(baseF, nn, nn / n)
    const upH = upsampleTo(h, n, nn)
    const upB = upsampleTo(baseC, n, nn)
    h = new Float32Array(nn * nn)
    for (let c = 0; c < nn * nn; c++) h[c] = upH[c] + (baseF[c] - upB[c]) * detailKeep
    n = nn
    erode(h, n, down(rainW, n), down(age, n), {
      iterations: it,
      k: k * kf,
      jitter: jitter(n),
      critical,
      onProgress: (p) => report(lvl, p),
    })
    done += it * n * n
  }
  return h
}
