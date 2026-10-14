// Stock's one GOOD cell on the realistic and random curves (905 words, 9x8), rerun with 30 seeds and 4x longer.
import { writeFileSync } from 'node:fs'
import { ENGINES } from './engines.mjs'
const jobs = []
for (const lex of ['curve-realistic-905', 'curve-random-905', 'curve-best-400']) {
  jobs.push({ engine: 'stock [30 seeds]', lex, cfg: { ...ENGINES.stock(9, 8), seeds: 30 } })
  jobs.push({ engine: 'stock [long]', lex, cfg: { ...ENGINES.stock(9, 8), seeds: 10, ticks: 6000 } })
}
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
