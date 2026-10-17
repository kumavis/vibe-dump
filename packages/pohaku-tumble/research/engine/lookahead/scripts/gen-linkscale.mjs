// linkScale on small grids: 1 (fixed floor), "half" = (72/cells)^0.25, "auto" = sqrt(72/cells).
import { writeFileSync } from 'node:fs'
import { LA } from './engines.mjs'
const jobs = []
for (const lex of ['attested-WA', 'curve-realistic-175', 'curve-realistic-225']) for (const [c, r] of [[5, 4], [6, 5], [7, 6]]) for (const ls of [1, 'half', 'auto']) {
  jobs.push({ engine: 'LA ls=' + ls, lex, cfg: { cols: c, rows: r, dealMin: 1, dealComp: 12, linkScale: ls, la: LA } })
  jobs.push({ engine: 'stock ls=' + ls, lex, cfg: { cols: c, rows: r, dealMin: 1, linkScale: ls } })
}
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
