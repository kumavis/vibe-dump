// Stage 1: one-factor sweeps from the stock baseline on the full 9x8 board.
import { job, REAL } from './common.mjs'
const lexes = ['attested-WA', ...REAL]
const rules = [
  ['stock', { dealMin: 1 }],
  ['jukugo-deal5', {}],
  ['stock+retry6', { dealMin: 1, retry: 6 }],
  ...[11.5, 14, 17, 20, 26, 31.1].map((D) => [`dup${D}`, { dealMin: 1, dupFar: D }]),
  ...[0, 3, 6, 12, 25].map((N) => [`prev${N}`, { dealMin: 1, prevAfter: N }]),
  ...[2, 3, 5].map((k) => [`dup17-deal${k}`, { dealMin: k, dupFar: 17 }]),
]
export const jobs = [job('jukugo-ref', 'jukugo', '9x8', { horizontalOnly: false, slab: 1 })]
for (const lex of lexes) for (const [name, r] of rules) jobs.push(job(name, lex, '9x8', r))
