// Exploration round 3: tune the best chooseTurn (comp12 deal + live + soft + fallback + fresh)
// on the hard points — steering, linkScale, softPen, fresh strength, look2, and pickFresh.
import { writeFileSync } from 'node:fs'
const L = { live: { alpha: 1, cap: 8, dead: 0.05 } }
const F = { fresh: { gamma: 1, cap: 6, dead: 0.2 } }
const base = { ...L, softK: 6, softPen: 0.03, fallback: true, ...F }
const SYM = { hi: 0.55, hiJoin: 0, hiBreak: 3 }
const V = {
  stock: [null, {}],
  E: [base, { dealComp: 12 }],
  'E+sym': [{ ...base, steer: SYM }, { dealComp: 12 }],
  'E+sym|ls1': [{ ...base, steer: SYM }, { dealComp: 12, linkScale: 1 }],
  'E|ls1': [base, { dealComp: 12, linkScale: 1 }],
  'E+sym+pen.01': [{ ...base, softPen: 0.01, steer: SYM }, { dealComp: 12 }],
  'E+sym+fresh2': [{ ...base, fresh: { gamma: 2, cap: 6, dead: 0.05 }, steer: SYM }, { dealComp: 12 }],
  'E+sym+look2': [{ ...base, look2: { beta: 0.5, cap: 8, dead: 0.2 }, steer: SYM }, { dealComp: 12 }],
  'E+sym+live2': [{ ...base, live: { alpha: 2, cap: 6, dead: 0.02 }, steer: SYM }, { dealComp: 12 }],
  'E+sym+court': [{ ...base, court: 0.5, steer: SYM }, { dealComp: 12 }],
  'E+sym+pickFresh6': [{ ...base, steer: SYM }, { dealComp: 12, pickFresh: 6 }],
}
const POINTS = [
  ['attested-WA', 5, 4], ['attested-WA', 6, 5], ['curve-realistic-175', 6, 5], ['curve-realistic-175', 7, 6],
  ['curve-realistic-225', 7, 6], ['curve-realistic-225', 9, 8], ['curve-realistic-300', 9, 8],
]
const jobs = []
for (const [lex, cols, rows] of POINTS) for (const [engine, [la, deal]] of Object.entries(V)) {
  const cfg = { cols, rows, dealMin: 1, ...(cols * rows < 72 ? { linkScale: 'auto' } : {}), ...deal }
  if (la) cfg.la = la
  jobs.push({ engine, lex, cfg })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
