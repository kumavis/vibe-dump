// Stage 3: named rule sets x lexicons x grids.
import { job } from './common.mjs'
import { RULES } from './rules.mjs'
const lexes = ['attested-WA', ...[128, 175, 225, 300, 400, 500, 650, 905].map((n) => `curve-realistic-${n}`)]
export const jobs = []
for (const grid of ['9x8', '7x6', '7x6s', '6x5s']) for (const lex of lexes) for (const [name, r] of Object.entries(RULES)) jobs.push(job(name, lex, grid, r))
const others = [128, 175, 225, 300, 400, 500, 650].flatMap((n) => [`curve-random-${n}`, `curve-best-${n}`])
for (const grid of ['9x8', '7x6']) for (const lex of others) for (const name of ['stock', 'T-P12-R6-d3-dd31', 'T-P12-D31-R6-d3', 'T-P12-D26-R6-d3', 'T-P12-D20-R6-d3']) jobs.push(job(name, lex, grid, RULES[name]))
