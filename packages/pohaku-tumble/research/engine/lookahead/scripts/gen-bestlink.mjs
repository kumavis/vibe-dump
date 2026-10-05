// "best" order: linked > 0.70 at 175–300 on 9x8 for every engine. How short must LINK_MAX be?
import { writeFileSync } from 'node:fs'
import { ENGINES, job } from './engines.mjs'
const jobs = []
for (const n of [175, 225, 300]) for (const ls of [1, 0.85, 0.7]) for (const name of ['stock', 'LA']) {
  const j = job(`${name} LINK_MAX x${ls}`, ENGINES[name], `curve-best-${n}`, 9, 8)
  j.cfg.linkScale = ls
  jobs.push(j)
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
