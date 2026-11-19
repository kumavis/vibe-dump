// Solve one factor per race per set per size from scores: logit(first-race score) moves by s·k·ln(f/f0), s = +1 when
// the scaled race is the second race (its price up, the first race's score up), −1 when it is the first.
//   node p4/solve.mjs <obs.json> [kW kI]   obs: [{ mission, set, pair: 'B-W', y (first race, 0-1), n, fW, fI }]
// k per size: a prior (kW, kI), or fitted from two or more factor points per cell when present (pooled slope).
import { readFileSync } from 'node:fs'
const obs = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const prior = { W: Number(process.argv[3] ?? 6), I: Number(process.argv[4] ?? 8) }
const lg = (y) => { const p = Math.min(0.98, Math.max(0.02, y)); return Math.log(p / (1 - p)) }
const sgn = (pair, race) => { const [a, b] = pair.split('-'); return b === race ? 1 : a === race ? -1 : 0 }
const CAP = Math.log(1.3)
const res = {}
for (const m of [...new Set(obs.map((o) => o.mission))]) {
  const om = obs.filter((o) => o.mission === m)
  // fitted slopes: within a cell, between factor points (weighted least squares through the cell's own intercept)
  let k = { ...prior }
  const cells = new Map()
  for (const o of om) { const key = `${o.set}|${o.pair}`; if (!cells.has(key)) cells.set(key, []); cells.get(key).push(o) }
  const multi = [...cells.values()].filter((c) => new Set(c.map((o) => `${o.fW},${o.fI}`)).size > 1)
  if (multi.length) {
    // model: logit y = a_cell + kW·sW·ln fW + kI·sI·ln fI; least squares on the within-cell deviations
    let A = [[0, 0], [0, 0]], b = [0, 0]
    for (const c of multi) {
      const w = c.map((o) => o.n), W = w.reduce((x, y) => x + y, 0)
      const xs = c.map((o) => [sgn(o.pair, 'W') * Math.log(o.fW), sgn(o.pair, 'I') * Math.log(o.fI)]), ys = c.map((o) => lg(o.y))
      const mx = [0, 1].map((j) => xs.reduce((s, x, i) => s + w[i] * x[j], 0) / W), my = ys.reduce((s, y, i) => s + w[i] * y, 0) / W
      for (let i = 0; i < c.length; i++) { const d = [xs[i][0] - mx[0], xs[i][1] - mx[1]], e = ys[i] - my; for (const j of [0, 1]) { b[j] += w[i] * d[j] * e; for (const l of [0, 1]) A[j][l] += w[i] * d[j] * d[l] } }
    }
    // a slope only where its factor varied; shrink toward the prior otherwise
    for (const j of [0, 1]) if (A[j][j] < 1e-6) { A[j][j] = 1; A[j][1 - j] = 0; A[1 - j][j] = 0; b[j] = j ? prior.I : prior.W }
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    const kw = (b[0] * A[1][1] - b[1] * A[0][1]) / det, ki = (A[0][0] * b[1] - A[1][0] * b[0]) / det
    k = { W: Math.min(15, Math.max(2, kw)), I: Math.min(15, Math.max(2, ki)), fitted: [kw, ki] }
  }
  res[m] = { k, sets: {} }
  const sets = [...new Set(om.map((o) => o.set))]
  const sol = {}
  for (const s of sets) {
    // each cell's intercept at ln f = 0, from its observations (mean over its factor points)
    const os = om.filter((o) => o.set === s)
    const pairs = [...new Set(os.map((o) => o.pair))]
    const rows = pairs.map((p) => { const c = os.filter((o) => o.pair === p), W = c.reduce((x, o) => x + o.n, 0); return { p, w: W, a: c.reduce((x, o) => x + o.n * (lg(o.y) - k.W * sgn(p, 'W') * Math.log(o.fW) - k.I * sgn(p, 'I') * Math.log(o.fI)), 0) / W } })
    // minimise Σ w (a + kW sW u + kI sI v)²
    let A = [[0, 0], [0, 0]], b = [0, 0]
    for (const r of rows) { const x = [k.W * sgn(r.p, 'W'), k.I * sgn(r.p, 'I')]; for (const j of [0, 1]) { b[j] -= r.w * x[j] * r.a; for (const l of [0, 1]) A[j][l] += r.w * x[j] * x[l] } }
    for (const j of [0, 1]) if (A[j][j] < 1e-9) { A[j][j] = 1; b[j] = 0 }
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]
    const u = (b[0] * A[1][1] - b[1] * A[0][1]) / det, v = (A[0][0] * b[1] - A[1][0] * b[0]) / det
    sol[s] = { W: Math.exp(u), I: Math.exp(v), resid: rows.map((r) => [r.p, +(100 / (1 + Math.exp(-(r.a + k.W * sgn(r.p, 'W') * u + k.I * sgn(r.p, 'I') * v)))).toFixed(1)]) }
  }
  // the cap: two sets of one size at most 30% apart (the geometric middle kept)
  if (sets.length === 2) for (const race of ['W', 'I']) {
    const [x, y] = sets.map((s) => Math.log(sol[s][race]))
    if (Math.abs(x - y) > CAP) { const mid = (x + y) / 2, h = (Math.sign(x - y) * CAP) / 2; sol[sets[0]][race] = Math.exp(mid + h); sol[sets[1]][race] = Math.exp(mid - h); sol.capped = [...(sol.capped ?? []), race] }
  }
  res[m].sets = sol
}
console.log(JSON.stringify(res, null, 1))
