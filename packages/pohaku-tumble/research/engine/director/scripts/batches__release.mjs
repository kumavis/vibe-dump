// Off-screen release: free words held by pairs the camera can't see. BEST + release, 10 seeds × 3600 s.
import { BASE, BEST, GRIDS, G5 } from './configs.mjs'
const V = {
  'BEST+release2': { ...BEST, release: 2 },
  'BEST+release2fresh': { ...BEST, release: 2, releaseFresh: true },
}
const jobs = []
for (const lex of ['curve-realistic-175', 'curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400'])
  for (const [g, gv] of Object.entries({ '9x8': GRIDS['9x8'], '7x6': GRIDS['7x6'], '6x5s': GRIDS['6x5s'] }))
    for (const [variant, v] of Object.entries(V))
      jobs.push({ lex, variant, cfg: { name: variant, ...BASE, ...gv, ...v } })
export default jobs
