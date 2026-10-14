// Round 2: random and best orders, more grids, LINK_MAX auto vs 11.5, tiny grids for the 128.
import { writeFileSync } from 'node:fs'
import { ENGINES } from './engines.mjs'
const jobs = []
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
for (const o of ['random', 'best']) for (const n of SIZES) for (const [c, r] of [[9, 8], [6, 5], [5, 4]])
  for (const e of ['REC', 'REC+ret', 'REC+ret L11.5']) jobs.push({ engine: e, lex: `curve-${o}-${n}`, cfg: ENGINES[e](c, r) })
for (const n of SIZES) for (const [c, r] of [[4, 4], [4, 3]]) for (const e of ['REC', 'REC+ret'])
  jobs.push({ engine: e, lex: `curve-realistic-${n}`, cfg: ENGINES[e](c, r) })
for (const n of SIZES) for (const [c, r] of [[9, 8], [6, 5], [5, 4]]) jobs.push({ engine: 'prune only', lex: `curve-realistic-${n}`, cfg: ENGINES['prune only'](c, r) })
for (const [c, r] of [[3, 3], [4, 3], [4, 4], [5, 4]]) for (const lex of ['curve-realistic-128', 'attested-WA'])
  for (const e of ['REC', 'REC+ret', 'REC+ret -prune', 'stock']) jobs.push({ engine: e, lex, cfg: ENGINES[e](c, r) })
// these rounds ran before the LINK_MAX rule was calibrated: pin its first setting (c0 0.015, floor 6.5)
for (const j of jobs) if (j.cfg.linkMax === 'auto') Object.assign(j.cfg, { linkC0: 0.015, linkFloor: 6.5 })
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
