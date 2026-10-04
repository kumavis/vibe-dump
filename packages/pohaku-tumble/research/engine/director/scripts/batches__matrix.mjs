// Main matrix: every curve lexicon × grid × {stock, D, D+look}, 1280x800 view, 10 seeds × 3600 s.
import { BASE, STOCK, D, DL, GRIDS, SIZES, ORDERS, lexName } from './configs.mjs'
const lexes = new Set()
for (const o of ORDERS) for (const n of SIZES) lexes.add(lexName(o, n))
const jobs = []
for (const lex of lexes)
  for (const [g, gv] of Object.entries(GRIDS))
    for (const [variant, v] of Object.entries({ stock: STOCK, D, 'D+look': DL }))
      jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...gv, ...v } })
for (const [variant, v] of Object.entries({ stock: STOCK, D, 'D+look': DL }))
  jobs.push({ lex: 'jukugo', variant, cfg: { name: variant, ...BASE, dealMin: 5, horizontalOnly: false, slab: 1, ...v } })
export default jobs
