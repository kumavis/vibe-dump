// Exploration round 2: component-aware deal (dealComp / dealDensity) x chooseTurn variants,
// on small lexicons and grids.
import { writeFileSync } from 'node:fs'
const L = { live: { alpha: 1, cap: 8, dead: 0.05 } }
const S = { softK: 6, softPen: 0.1 }
const V = {
  stock: [null, {}],
  'stock|comp12': [null, { dealComp: 12 }],
  'live|comp12': [{ ...L }, { dealComp: 12 }],
  'live+soft6|comp12': [{ ...L, ...S }, { dealComp: 12 }],
  'live+soft6+fb|comp12': [{ ...L, ...S, fallback: true }, { dealComp: 12 }],
  'live+soft6+cool5|comp12': [{ ...L, ...S, cool: 5, coolCredit: 0.5 }, { dealComp: 12 }],
  'live+soft6+fb|comp12+d.35': [{ ...L, ...S, fallback: true }, { dealComp: 12, dealDensity: 0.35 }],
  'live+soft6+fb|comp12+d.25': [{ ...L, ...S, fallback: true }, { dealComp: 12, dealDensity: 0.25 }],
  'live+soft6+fresh+fb|comp12': [{ ...L, ...S, fresh: { gamma: 1, cap: 6, dead: 0.2 }, fallback: true }, { dealComp: 12 }],
  'live+soft.03+fb|comp12': [{ ...L, softK: 6, softPen: 0.03, fallback: true }, { dealComp: 12 }],
}
const POINTS = [
  ['attested-WA', 6, 5], ['attested-WA', 5, 4], ['curve-realistic-175', 7, 6], ['curve-realistic-175', 6, 5],
  ['curve-realistic-225', 9, 8], ['curve-realistic-225', 7, 6], ['curve-realistic-300', 9, 8], ['curve-realistic-400', 9, 8],
]
const jobs = []
for (const [lex, cols, rows] of POINTS) for (const [engine, [la, deal]] of Object.entries(V)) {
  const cfg = { cols, rows, dealMin: 1, ...deal, ...(cols * rows < 72 ? { linkScale: 'auto' } : {}) }
  if (la) cfg.la = la
  jobs.push({ engine, lex, cfg })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
