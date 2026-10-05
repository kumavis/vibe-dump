// Director model: steer on the in-view linked share (steerView) vs the whole floor.
import { writeFileSync } from 'node:fs'
import { DENGINES } from './engines.mjs'
const jobs = []
for (const e of ['REC+ret', 'REC+ret +steerView', 'REC+ret -steer', 'REC+ret -steer +steerView']) {
  jobs.push({ engine: `jukugo ${e}`, lex: 'jukugo', cfg: { ...DENGINES[e](9, 8), horizontalOnly: false, slab: 1 } })
  for (const lex of ['curve-realistic-175', 'curve-realistic-225', 'curve-realistic-300', 'curve-realistic-500', 'curve-realistic-905', 'lex/curve-best-200.json', 'lex/curve-best-250.json', 'curve-best-300', 'curve-random-300'])
    for (const [c, r] of [[9, 8], [null, null]]) jobs.push({ engine: e, lex, cfg: DENGINES[e](c, r) })
}
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
