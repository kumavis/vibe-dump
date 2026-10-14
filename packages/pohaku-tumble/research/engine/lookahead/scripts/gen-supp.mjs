// Supplement: (a) the sense-tagged 128 (curve-*-128; attested-WA.json has spelling-only roots),
// every engine x grid; (b) linkScale sensitivity on the small grids for stock and LA (1 and "auto").
import { writeFileSync } from 'node:fs'
import { ENGINES, job } from './engines.mjs'
const GRIDS = [[9, 8], [7, 6], [6, 5], [5, 4], [4, 4]]
const jobs = []
for (const [c, r] of GRIDS) for (const [name, e] of Object.entries(ENGINES)) jobs.push(job(name, e, 'curve-realistic-128', c, r))
const LEX = ['curve-realistic-128']
for (const n of [175, 225, 300, 400]) LEX.push(`curve-realistic-${n}`)
for (const lex of LEX) for (const [c, r] of GRIDS.slice(1)) for (const ls of [1, 'auto']) for (const name of ['stock', 'LA'])
  jobs.push(job(`${name} ls=${ls}`, ENGINES[name], lex, c, r, ls))
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
console.log(jobs.length, 'jobs')
