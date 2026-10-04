// Refinement aimed at bounces (the largest part of repeats on small lists), plus the 5x4s board.
// 10 seeds × 3600 s, 1280x800.
import { BASE, STOCK, DL, GRIDS } from './configs.mjs'
const V = {
  'D+look +bounceW0.25': { ...DL, bounceW: 0.25 },
  'D+look0.02': { ...DL, look: 0.02 },
  'D+look0.02 +bounceW0.25': { ...DL, look: 0.02, bounceW: 0.25 },
}
const G5 = { cols: 5, rows: 4, scaleFloor: true }
const jobs = []
for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400'])
  for (const g of ['9x8', '6x5s'])
    for (const [variant, v] of Object.entries(V))
      jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...GRIDS[g], ...v } })
for (const lex of ['attested-WA', 'curve-realistic-175', 'curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400'])
  for (const [variant, v] of Object.entries({ stock: STOCK, 'D+look': DL, 'D+look0.02 +bounceW0.25': V['D+look0.02 +bounceW0.25'] }))
    jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...G5, ...v } })
export default jobs
