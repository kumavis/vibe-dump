// Director-faithful check (dirsim.mjs) of the stage-3 front runners. 10 seeds x 1 hour.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
export const jobs = [job('jukugo-ref', 'jukugo', '9x8', { horizontalOnly: false, slab: 1, seconds: 3600 })]
const names = ['stock', 'stock+R6', 'T-P12-R6-d3-dd31', 'T-P12-D31-R6-d3', 'T-P12-D26-R6-d3', 'T-P12-D20-R6-d3', 'T-P12-D14-R6-d3', 'T-P25-D26-R6-d3']
for (const grid of ['9x8', '7x6']) for (const n of [128, 175, 225, 300, 400, 500]) for (const name of names) jobs.push(job(name, `curve-realistic-${n}`, grid, { ...RULES[name], seconds: 3600 }))
