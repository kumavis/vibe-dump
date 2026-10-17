// Exploration round 5: strict history tiers (fresh first) with the lookahead factors.
import { writeFileSync } from 'node:fs'
const L = { live: { alpha: 1, cap: 8, dead: 0.05 } }
const F = { fresh: { gamma: 1, cap: 6, dead: 0.2 } }
const R3 = { reach: { depth: 3, gamma: 1, cap: 40, dead: 0.1 } }
const SYM = { hi: 0.55, hiJoin: 0, hiBreak: 3 }
const base = { ...L, softK: 6, softPen: 0.03, fallback: true, ...F }
const V = {
  E: [base, { dealComp: 12 }],
  'S': [{ ...L, softK: 6, softPen: 0.03, strict: true, fallback: true }, { dealComp: 12 }],
  'S+fresh': [{ ...base, strict: true }, { dealComp: 12 }],
  'S+reach3': [{ ...L, softK: 6, softPen: 0.03, strict: true, fallback: true, ...R3 }, { dealComp: 12 }],
  'S+fresh+reach3': [{ ...base, strict: true, ...R3 }, { dealComp: 12 }],
  'S+fresh+reach3+sym': [{ ...base, strict: true, ...R3, steer: SYM }, { dealComp: 12 }],
  'S+fresh+reach2+sym': [{ ...base, strict: true, reach: { depth: 2, gamma: 1, cap: 30, dead: 0.1 }, steer: SYM }, { dealComp: 12 }],
  'S+fresh+reach4+sym': [{ ...base, strict: true, reach: { depth: 4, gamma: 1, cap: 60, dead: 0.1 }, steer: SYM }, { dealComp: 12 }],
  'S+fresh+reach3g2+sym': [{ ...base, strict: true, reach: { depth: 3, gamma: 2, cap: 40, dead: 0.05 }, steer: SYM }, { dealComp: 12 }],
  'S+fresh+reach3+sym-nodeal': [{ ...base, strict: true, ...R3, steer: SYM }, {}],
  'S+fresh+reach3+sym+cool5': [{ ...L, ...F, softK: 6, softPen: 0.03, strict: true, ...R3, steer: SYM, cool: 5, coolCredit: 0.5 }, { dealComp: 12 }],
}
const POINTS = [
  ['attested-WA', 5, 4], ['attested-WA', 6, 5], ['curve-realistic-175', 6, 5], ['curve-realistic-175', 7, 6],
  ['curve-realistic-225', 7, 6], ['curve-realistic-225', 9, 8], ['curve-realistic-300', 9, 8], ['curve-realistic-400', 9, 8],
]
const jobs = []
for (const [lex, cols, rows] of POINTS) for (const [engine, [la, deal]] of Object.entries(V)) {
  const cfg = { cols, rows, dealMin: 1, linkScale: 1, ...deal }
  if (la) cfg.la = la
  jobs.push({ engine, lex, cfg })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
