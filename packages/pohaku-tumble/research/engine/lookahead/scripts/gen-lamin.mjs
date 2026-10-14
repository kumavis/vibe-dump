// LA-min (no live, no fresh) and its cooldown variant over the full matrix, incl. the sense-tagged 128.
import { writeFileSync } from 'node:fs'
import { LA_MIN, LA_MIN_COOL, DEAL, job } from './engines.mjs'
const LEX = ['curve-realistic-128']
for (const o of ['realistic', 'random', 'best']) for (const n of [175, 225, 300, 400, 500, 650, 905]) LEX.push(`curve-${o}-${n}`)
const GRIDS = [[9, 8], [7, 6], [6, 5], [5, 4], [4, 4]]
const jobs = []
for (const lex of LEX) for (const [c, r] of GRIDS) {
  jobs.push(job('LA-min', [LA_MIN, DEAL], lex, c, r))
  jobs.push(job('LA-min-cool5', [LA_MIN_COOL, DEAL], lex, c, r))
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
console.log(jobs.length, 'jobs')
