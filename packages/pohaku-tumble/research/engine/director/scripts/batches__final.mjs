// FINAL (= BEST + release 2 s) over every curve lexicon and grid, plus Jukugo. 10 seeds × 3600 s, 1280x800.
import { BASE, FINAL, GRIDS, G5, SIZES, ORDERS, lexName } from './configs.mjs'
const lexes = new Set()
for (const o of ORDERS) for (const n of SIZES) lexes.add(lexName(o, n))
const jobs = []
for (const lex of lexes)
  for (const [g, gv] of Object.entries({ ...GRIDS, '5x4s': G5 })) jobs.push({ lex, variant: 'FINAL', cfg: { name: 'FINAL', ...BASE, ...gv, ...FINAL } })
jobs.push({ lex: 'jukugo', variant: 'FINAL', cfg: { name: 'FINAL', ...BASE, dealMin: 5, horizontalOnly: false, slab: 1, ...FINAL } })
// viewport check for FINAL on the two grids that matter
for (const view of [{ w: 1920, h: 1080 }, { w: 390, h: 844 }])
  for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400', 'curve-realistic-500'])
    for (const g of ['9x8', '6x5s'])
      jobs.push({ lex, variant: 'FINAL', cfg: { name: 'FINAL', ...BASE, ...GRIDS[g], view, ...FINAL } })
export default jobs
