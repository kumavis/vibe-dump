// Ablation / interaction check: every variant of REC+ret, in the brief's sim (sim.mjs) or the
// Director model (dsim.mjs): node gen-ablation.mjs out.json [dir]
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const dir = process.argv[3] === 'dir'
const E = dir ? DENGINES : ENGINES
const LEX = [175, 225, 300, 400, 500].map((n) => `curve-realistic-${n}`).concat([225, 300, 400].map((n) => `curve-random-${n}`))
const GRIDS = [[9, 8], [6, 5], [5, 4], [null, null]]
const jobs = []
for (const e of Object.keys(E)) if (e !== 'stock' && e !== 'prune only') for (const lex of LEX) for (const [c, r] of GRIDS) jobs.push({ engine: e, lex, cfg: E[e](c, r) })
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
