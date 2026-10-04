// Director-faithful check of the final configuration, sizes x grids. 10 seeds x 1 hour.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
export const jobs = [job('jukugo-ref', 'jukugo', '9x8', { horizontalOnly: false, slab: 1, seconds: 3600 })]
for (const grid of ['9x8', '7x6s', '6x5s'])
  for (const n of [200, 225, 250, 275, 300, 350, 400, 500])
    for (const name of ['stock', 'T-P3-box-R6-d3', 'T-P3-dd31-R6-d3']) jobs.push(job(name, `curve-realistic-${n}`, grid, { ...RULES[name], seconds: 3600 }))
