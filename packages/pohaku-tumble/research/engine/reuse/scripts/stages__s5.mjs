// Stage 5: robustness at the boundary — 30 seeds, intermediate curve sizes.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
const names = ['stock', 'T-P12-R6-d3-dd31', 'T-P12-box-R6-d3', 'T-P12-D26-R6-d3', 'T-P12-D20-R6-d3', 'T-P6-box-R6-d3', 'T-P3-box-R6-d3']
export const jobs = []
for (const grid of ['9x8', '7x6', '7x6s', '6x5s'])
  for (const n of [150, 175, 200, 225, 250, 275, 300, 350, 400])
    for (const name of names) jobs.push(job(name, `curve-realistic-${n}`, grid, { ...RULES[name], seeds: 30 }))
for (const grid of ['9x8', '7x6s']) for (const n of [250, 275, 300, 350, 400]) for (const name of names) jobs.push(job(name, `curve-random-${n}`, grid, { ...RULES[name], seeds: 30 }))
