// Best-order lists over-link (hub roots). Does a shorter LINK_MAX bring linked into range?
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
export const jobs = []
for (const n of [175, 225, 300]) for (const linkMax of [11.5, 9, 7.5]) for (const name of ['stock', 'T-P12-D26-R6-d3'])
  jobs.push(job(`${name}-L${linkMax}`, `curve-best-${n}`, '9x8', { ...RULES[name], linkMax, nearMax: (9 * linkMax) / 11.5 }))
