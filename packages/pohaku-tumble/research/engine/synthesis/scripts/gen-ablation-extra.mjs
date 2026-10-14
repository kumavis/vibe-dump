// The two deal-bound ablations added after the first ablation pass (they replace a broken dealMin1 row).
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const dir = process.argv[3] === 'dir'
const E = dir ? DENGINES : ENGINES
const LEX = [175, 225, 300, 400, 500].map((n) => `curve-realistic-${n}`).concat([225, 300, 400].map((n) => `curve-random-${n}`))
const jobs = []
for (const e of ['REC+ret dealMin2', 'REC+ret matchMin2']) for (const lex of LEX) for (const [c, r] of [[9, 8], [6, 5], [5, 4], [null, null]]) jobs.push({ engine: e, lex, cfg: E[e](c, r) })
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
