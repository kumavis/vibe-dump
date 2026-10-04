// Director model, round 1: stock / REC / REC+ret on the realistic curve, 4 grids; the 128 on tiny grids; Jukugo.
import { writeFileSync } from 'node:fs'
import { DENGINES } from './engines.mjs'
const jobs = []
for (const n of [128, 175, 225, 300, 400, 500, 650, 905]) for (const [c, r] of [[9, 8], [7, 6], [6, 5], [5, 4]])
  for (const e of ['stock', 'REC', 'REC+ret']) jobs.push({ engine: e, lex: `curve-realistic-${n}`, cfg: DENGINES[e](c, r) })
for (const [c, r] of [[3, 3], [4, 3], [4, 4]]) for (const e of ['REC', 'REC+ret', 'REC+ret -prune']) for (const lex of ['curve-realistic-128', 'curve-realistic-175'])
  jobs.push({ engine: e, lex, cfg: DENGINES[e](c, r) })
for (const e of ['stock', 'REC', 'REC+ret']) jobs.push({ engine: `jukugo ${e}`, lex: 'jukugo', cfg: { ...DENGINES[e](9, 8), horizontalOnly: false, slab: 1, dealComp: 0 } })
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
