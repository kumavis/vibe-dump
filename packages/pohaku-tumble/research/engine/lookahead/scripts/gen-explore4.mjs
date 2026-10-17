// Exploration round 4: deeper fresh lookahead ("reach") against E, on the hard points, linkScale 1.
import { writeFileSync } from 'node:fs'
const L = { live: { alpha: 1, cap: 8, dead: 0.05 } }
const F = { fresh: { gamma: 1, cap: 6, dead: 0.2 } }
const base = { ...L, softK: 6, softPen: 0.03, fallback: true, ...F }
const V = {
  stock: [null, {}],
  E: [base, { dealComp: 12 }],
  'E+reach2': [{ ...base, reach: { depth: 2, gamma: 1, cap: 30, dead: 0.1 } }, { dealComp: 12 }],
  'E+reach3': [{ ...base, reach: { depth: 3, gamma: 1, cap: 40, dead: 0.1 } }, { dealComp: 12 }],
  'E+reach3g.5': [{ ...base, reach: { depth: 3, gamma: 0.5, cap: 40, dead: 0.1 } }, { dealComp: 12 }],
  'E+reach4': [{ ...base, reach: { depth: 4, gamma: 1, cap: 60, dead: 0.1 } }, { dealComp: 12 }],
  'E+reach3g2': [{ ...base, reach: { depth: 3, gamma: 2, cap: 40, dead: 0.05 } }, { dealComp: 12 }],
  'Lr3': [{ ...L, softK: 6, softPen: 0.03, fallback: true, reach: { depth: 3, gamma: 1, cap: 40, dead: 0.1 } }, { dealComp: 12 }],
  'r3only': [{ softK: 6, softPen: 0.03, fallback: true, reach: { depth: 3, gamma: 1, cap: 40, dead: 0.1 } }, { dealComp: 12 }],
}
const POINTS = [
  ['attested-WA', 5, 4], ['attested-WA', 6, 5], ['curve-realistic-175', 6, 5], ['curve-realistic-175', 7, 6],
  ['curve-realistic-225', 7, 6], ['curve-realistic-225', 9, 8], ['curve-realistic-300', 9, 8],
]
const jobs = []
for (const [lex, cols, rows] of POINTS) for (const [engine, [la, deal]] of Object.entries(V)) {
  const cfg = { cols, rows, dealMin: 1, linkScale: 1, ...deal }
  if (la) cfg.la = la
  jobs.push({ engine, lex, cfg })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
