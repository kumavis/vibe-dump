// Stage 4: is 1500 ticks steady state? Same configs at 1500 / 6000 / 12000 ticks.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
export const jobs = [job('jukugo-ref', 'jukugo', '9x8', { horizontalOnly: false, slab: 1, ticks: 12000 })]
for (const ticks of [1500, 6000, 12000])
  for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-500'])
    for (const name of ['stock', 'stock+R6', 'T-P12-R6-d3-dd31', 'T-P12-D26-R6-d3']) jobs.push(job(`${name}@${ticks}`, lex, '9x8', { ...RULES[name], ticks }))
