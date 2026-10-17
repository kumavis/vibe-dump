// BEST over every curve lexicon and grid (incl. 5x4s), stock on 5x4s, and a LINK_MAX check. 10 seeds × 3600 s.
import { BASE, STOCK, BEST, GRIDS, G5, SIZES, ORDERS, lexName } from './configs.mjs'
const lexes = new Set()
for (const o of ORDERS) for (const n of SIZES) lexes.add(lexName(o, n))
const jobs = []
for (const lex of lexes) {
  for (const [g, gv] of Object.entries({ ...GRIDS, '5x4s': G5 })) jobs.push({ lex, variant: 'BEST', cfg: { name: 'BEST', ...BASE, ...gv, ...BEST } })
  jobs.push({ lex, variant: 'stock', cfg: { name: 'stock', ...BASE, ...G5, ...STOCK } })
}
jobs.push({ lex: 'jukugo', variant: 'BEST', cfg: { name: 'BEST', ...BASE, dealMin: 5, horizontalOnly: false, slab: 1, ...BEST } })
// over-linking on the most connective lists: LINK_MAX 9.5 instead of 11.5
for (const lex of ['curve-best-175', 'curve-best-225', 'curve-best-300', 'curve-best-400', 'curve-best-500', 'curve-realistic-300'])
  for (const g of ['9x8', '6x5s'])
    jobs.push({ lex, variant: 'BEST linkMax9.5', cfg: { name: 'BEST linkMax9.5', ...BASE, ...GRIDS[g], ...BEST, linkMax: 9.5 } })
export default jobs
