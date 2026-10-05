// Stage 7 (sim with the 1920x1080 duplicate metric): A) the final rules with
// duplicates only as a deal fallback (no turn ever creates one), every order x
// size x grid, 30 seeds; B) how visible turn-time duplicates are, per rule.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
const sizes = [128, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 650, 905]
export const jobs = []
for (const grid of ['9x8', '7x6', '7x6s', '6x5s']) {
  jobs.push(job('T-P3-dd31-R6-d3', 'attested-WA', grid, { ...RULES['T-P3-dd31-R6-d3'], seeds: 30 }))
  for (const order of ['realistic', 'random', 'best']) for (const n of sizes) jobs.push(job('T-P3-dd31-R6-d3', `curve-${order}-${n}`, grid, { ...RULES['T-P3-dd31-R6-d3'], seeds: 30 }))
}
for (const grid of ['9x8', '7x6', '7x6s'])
  for (const n of [200, 250, 300, 400])
    for (const name of ['T-P3-box-R6-d3', 'T-P3-boxHD-R6-d3', 'T-P12-D26-R6-d3', 'T-P12-D20-R6-d3', 'T-P12-D14-R6-d3'])
      jobs.push(job(`vis:${name}`, `curve-realistic-${n}`, grid, { ...RULES[name], seeds: 30 }))
