// Viewport sensitivity: every pair eligible ("full", closest to sim.mjs), a 1920x1080 desktop, a 390x844 phone.
import { BASE, STOCK, BEST as DL, GRIDS } from './configs.mjs'
const jobs = []
for (const view of ['full', { w: 1920, h: 1080 }, { w: 390, h: 844 }])
  for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400', 'curve-realistic-500'])
    for (const g of ['9x8', '6x5s'])
      for (const [variant, v] of Object.entries({ stock: STOCK, 'BEST': DL }))
        jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...GRIDS[g], view, ...v } })
export default jobs
// Long-run drift: 2 h instead of 1 h (checkpoints at 10, 30, 60, 120 min).
for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-500'])
  for (const g of ['9x8', '6x5s'])
    for (const [variant, v] of Object.entries({ 'stock (2h)': STOCK, 'BEST (2h)': DL }))
      jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...GRIDS[g], duration: 7200, ...v } })
