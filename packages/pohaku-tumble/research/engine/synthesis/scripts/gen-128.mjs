// Can the 128 attested words alone work on any board? Tiny grids, 30 seeds, both sims.
//   node gen-128.mjs out.json <sim|dir>
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const [out, mode] = process.argv.slice(2)
const E = mode === 'dir' ? DENGINES : ENGINES
const jobs = []
for (const [c, r] of [[3, 2], [3, 3], [4, 3], [4, 4], [5, 4], [6, 5], [9, 8]])
  for (const e of ['stock', 'POHAKU -ret', 'POHAKU', 'REC+ret -prune'])
    for (const lex of ['curve-realistic-128', 'attested-WA']) jobs.push({ engine: e, lex, cfg: { ...E[e](c, r), seeds: 30 } })
writeFileSync(out, JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
