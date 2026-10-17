// Stage 6: the final configuration vs the stock baseline, every order x size x grid,
// 30 seeds x 1500 ticks; plus a 12000-tick steady-state check (10 seeds).
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
const names = ['stock', 'T-P3-box-R6-d3', 'T-P12-box-R6-d3']
const sizes = [128, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 650, 905]
export const jobs = []
for (const grid of ['9x8', '7x6', '7x6s', '6x5s']) {
  for (const name of names) jobs.push(job(name, 'attested-WA', grid, { ...RULES[name], seeds: 30 }))
  for (const order of ['realistic', 'random', 'best'])
    for (const n of sizes) for (const name of names) jobs.push(job(name, `curve-${order}-${n}`, grid, { ...RULES[name], seeds: 30 }))
}
for (const grid of ['9x8', '7x6s', '6x5s'])
  for (const n of [200, 250, 300, 400])
    for (const name of ['stock', 'T-P3-box-R6-d3']) jobs.push(job(`${name}@12000`, `curve-realistic-${n}`, grid, { ...RULES[name], seeds: 10, ticks: 12000 }))
