// Ablation: remove one piece of LA at a time, on four representative (lexicon, grid) points.
import { writeFileSync } from 'node:fs'
import { ABLATION, job } from './engines.mjs'
const POINTS = [['attested-WA', 5, 4], ['curve-realistic-175', 5, 4], ['curve-realistic-225', 7, 6], ['curve-realistic-300', 9, 8], ['curve-realistic-400', 9, 8]]
const jobs = []
for (const [lex, c, r] of POINTS) for (const [name, e] of Object.entries(ABLATION)) jobs.push(job(name, e, lex, c, r))
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
console.log(jobs.length, 'jobs')
