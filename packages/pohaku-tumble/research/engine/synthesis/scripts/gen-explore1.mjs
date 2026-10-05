// Round 1: which combination? realistic order, all sizes, 4 grids, the main candidates.
import { writeFileSync } from 'node:fs'
import { ENGINES } from './engines.mjs'
const jobs = []
for (const n of [128, 175, 225, 300, 400, 500, 650, 905])
  for (const [c, r] of [[9, 8], [7, 6], [6, 5], [5, 4]])
    for (const e of ['stock', 'prune only', 'REC', 'REC+ret', 'REC -prune', 'REC+ret -prune'])
      jobs.push({ engine: e, lex: `curve-realistic-${n}`, cfg: ENGINES[e](c, r) })
// these rounds ran before the LINK_MAX rule was calibrated: pin its first setting (c0 0.015, floor 6.5)
for (const j of jobs) if (j.cfg.linkMax === 'auto') Object.assign(j.cfg, { linkC0: 0.015, linkFloor: 6.5 })
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
