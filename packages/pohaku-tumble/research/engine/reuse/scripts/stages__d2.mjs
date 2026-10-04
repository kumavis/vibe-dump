// Director-faithful sweep: rest length x duplicates x grid. 10 seeds x 1 hour.
import { job } from './common.mjs'
export const jobs = []
for (const grid of ['9x8', '7x6s', '6x5s'])
  for (const n of [225, 300, 400, 500])
    for (const P of [3, 6, 12])
      for (const [dn, d] of [['dd31', { dealDupFar: 31.1 }], ['D26', { dupFar: 26 }], ['box', { dupFar: 1, dupBox: [27, 18] }]])
        jobs.push(job(`T-P${P}-${dn}-R6-d3`, `curve-realistic-${n}`, grid, { dealMin: 3, retry: 6, tiers: true, prevAfter: P, ...d, seconds: 3600 }))
