// Final matrix: every engine x every curve lexicon x grids 9x8, 7x6, 6x5, 5x4, 4x4 (linkScale "half"
// on the smaller grids), 10 seeds x 1500 ticks, plus the Jukugo reference rows.
import { writeFileSync } from 'node:fs'
import { ENGINES, job } from './engines.mjs'
const LEX = ['attested-WA']
for (const o of ['realistic', 'random', 'best']) for (const n of [175, 225, 300, 400, 500, 650, 905]) LEX.push(`curve-${o}-${n}`)
const GRIDS = [[9, 8], [7, 6], [6, 5], [5, 4], [4, 4]]
const jobs = []
for (const name of ['stock', 'LA']) {
  const j = job(`jukugo-ref ${name}`, ENGINES[name], 'jukugo', 9, 8)
  j.cfg.horizontalOnly = false
  j.cfg.slab = 1
  delete j.cfg.dealComp
  jobs.push(j)
}
for (const lex of LEX) for (const [c, r] of GRIDS) for (const [name, e] of Object.entries(ENGINES)) jobs.push(job(name, e, lex, c, r))
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
console.log(jobs.length, 'jobs')
