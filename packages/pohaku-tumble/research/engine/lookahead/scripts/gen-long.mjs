// Robustness: the boundary points of the recommended engine (and stock) at 20 seeds x 3000 ticks.
import { writeFileSync } from 'node:fs'
import { ENGINES, LA_MIN_COOL, DEAL, job } from './engines.mjs'
const POINTS = [['curve-realistic-300', 9, 8], ['curve-realistic-225', 9, 8], ['curve-realistic-225', 7, 6], ['curve-realistic-225', 6, 5],
  ['curve-realistic-175', 5, 4], ['curve-realistic-175', 6, 5], ['curve-random-300', 9, 8], ['curve-random-400', 9, 8]]
const jobs = []
for (const [lex, c, r] of POINTS) for (const [name, e] of [['stock', ENGINES.stock], ['LA-min-cool5', [LA_MIN_COOL, DEAL]]]) {
  const j = job(name + ' long', e, lex, c, r)
  j.cfg.seeds = 20
  j.cfg.ticks = 3000
  jobs.push(j)
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
