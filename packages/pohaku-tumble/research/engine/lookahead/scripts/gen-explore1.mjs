// Exploration round 1: many chooseTurn variants on a few representative (tier, grid) points.
import { writeFileSync } from 'node:fs'
const L = { live: { alpha: 1, cap: 8, dead: 0.05 } }
export const VARIANTS = {
  stock: null,
  live: { ...L },
  'live-dead0': { live: { alpha: 1, cap: 8, dead: 0 } },
  'live-a0.5': { live: { alpha: 0.5, cap: 8, dead: 0.05 } },
  'live-a2': { live: { alpha: 2, cap: 6, dead: 0.02 } },
  'live+fb': { ...L, fallback: true },
  'live+soft6': { ...L, softK: 6, softPen: 0.1 },
  'live+soft6+fb': { ...L, softK: 6, softPen: 0.1, fallback: true },
  'live+fresh': { ...L, fresh: { gamma: 1, cap: 6, dead: 0.2 } },
  'live+soft6+fresh': { ...L, softK: 6, softPen: 0.1, fresh: { gamma: 1, cap: 6, dead: 0.2 } },
  look2: { look2: { beta: 1, cap: 8, dead: 0.05 } },
  'live+look2': { ...L, look2: { beta: 0.5, cap: 8, dead: 0.2 } },
  'live+court': { ...L, court: 0.6 },
  'hard2+live': { ...L, hardK: 2 },
  'hard6+live': { ...L, hardK: 6 },
  'cool20+live': { ...L, cool: 20, softPen: 0.25, coolCredit: 0.5 },
  'cool20+live+soft6': { ...L, cool: 20, softK: 6, softPen: 0.1, coolCredit: 0.5 },
}
const POINTS = [
  ['curve-realistic-225', 9, 8], ['curve-realistic-300', 9, 8], ['curve-realistic-500', 9, 8],
  ['curve-realistic-175', 7, 6], ['attested-WA', 6, 5],
]
const jobs = []
for (const [lex, cols, rows] of POINTS) for (const [engine, la] of Object.entries(VARIANTS)) {
  const cfg = { cols, rows, dealMin: 1, ...(cols * rows < 72 ? { linkScale: 'auto' } : {}) }
  if (la) cfg.la = la
  jobs.push({ engine, lex, cfg })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
