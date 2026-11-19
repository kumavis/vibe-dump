// shared loader for the analysis scripts: every battle record under data/, grouped
import { readFileSync, readdirSync } from 'node:fs'
export const LAB = new URL('.', import.meta.url).pathname
export const SHORT = { squirrel: 'B', serpent: 'S', insect: 'I', bird: 'W' }
export const RACE_OF = {
  Nutkin: 'squirrel', Grenadiers: 'squirrel', 'Oak Guard': 'squirrel', Gliders: 'squirrel', Trebuchet: 'squirrel', Elder: 'squirrel', 'War-Cart': 'squirrel',
  Scaleguard: 'serpent', Spitters: 'serpent', Sidewinders: 'serpent', Brute: 'serpent', 'Venom Engine': 'serpent', Hierophant: 'serpent', Howdah: 'serpent',
  Spinethrowers: 'insect', Delvers: 'insect', Deepguard: 'insect', Hoppers: 'insect', Boilback: 'insect', Hivemother: 'insect',
  Longbills: 'bird', Finches: 'bird', Kestrels: 'bird', Stormtalons: 'bird', Roc: 'bird', Skyseer: 'bird',
}
export const MODE = { Gliders: 'fly', Finches: 'fly', Kestrels: 'fly', Stormtalons: 'fly', Roc: 'fly', Skyseer: 'fly', Delvers: 'burrow', Deepguard: 'burrow', Brute: 'wreck', 'War-Cart': 'wreck', Howdah: 'wreck' }
export const modeOf = (t) => MODE[t] ?? 'walk'
export function load(dir = 'data', filter = () => true) {
  const out = []
  for (const f of readdirSync(LAB + dir).filter((f) => f.endsWith('.jsonl'))) {
    for (const line of readFileSync(LAB + dir + '/' + f, 'utf8').split('\n')) {
      if (!line) continue
      const r = JSON.parse(line)
      if (filter(r)) out.push(r)
    }
  }
  return out
}
// side helpers: the seat of race `race` in record r
export const seatOf = (r, race) => (race === r.pair[0] ? r.mine : 1 - r.mine)
export const keyOf = (r) => `${r.mission}|${r.set}|${r.pair.map((p) => SHORT[p]).join('-')}`
export const focusOf = (pair) => (pair.includes('bird') ? 'bird' : pair.includes('insect') ? 'insect' : 'serpent')
export const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN)
export const se = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / Math.max(1, a.length - 1) / Math.max(1, a.length)) }
export const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : '-')
export const f2 = (x) => (Number.isFinite(x) ? x.toFixed(2) : '-')
export const pc = (x) => (Number.isFinite(x) ? (100 * x).toFixed(1) : '-')
// a quasi-binomial logistic regression (IRLS); X rows with an intercept column first
export function logit(X, y) {
  const p = X[0].length
  let b = new Array(p).fill(0)
  for (let it = 0; it < 40; it++) {
    const H = Array.from({ length: p }, () => new Array(p).fill(0)), g = new Array(p).fill(0)
    for (let i = 0; i < X.length; i++) {
      const eta = X[i].reduce((s, x, k) => s + x * b[k], 0), mu = 1 / (1 + Math.exp(-eta)), w = Math.max(mu * (1 - mu), 1e-9)
      for (let j = 0; j < p; j++) { g[j] += X[i][j] * (y[i] - mu); for (let k = 0; k < p; k++) H[j][k] += w * X[i][j] * X[i][k] }
    }
    const inv = invert(H), step = inv.map((row) => row.reduce((s, x, k) => s + x * g[k], 0))
    b = b.map((x, k) => x + step[k])
    if (Math.max(...step.map(Math.abs)) < 1e-9) {
      let chi = 0
      for (let i = 0; i < X.length; i++) { const mu = 1 / (1 + Math.exp(-X[i].reduce((s, x, k) => s + x * b[k], 0))); chi += (y[i] - mu) ** 2 / Math.max(mu * (1 - mu), 1e-9) }
      const phi = chi / Math.max(1, X.length - p)
      return { b, se: inv.map((row, k) => Math.sqrt(row[k] * phi)), phi }
    }
  }
  return { b, se: b.map(() => NaN), phi: NaN }
}
export function invert(M) {
  const n = M.length, A = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))])
  for (let c = 0; c < n; c++) {
    let p = c
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    ;[A[c], A[p]] = [A[p], A[c]]
    const d = A[c][c]
    for (let k = 0; k < 2 * n; k++) A[c][k] /= d
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; for (let k = 0; k < 2 * n; k++) A[r][k] -= f * A[c][k] }
  }
  return A.map((r) => r.slice(n))
}
