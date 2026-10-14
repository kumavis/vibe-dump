// Exploratory 3: grids x sizes for the main candidates.
import { writeFileSync } from 'node:fs'
import { GRIDS, T, H } from './grids.mjs'
const CONF = {
  stock: { dealMin: 1 },
  base: { dealMin: 2, matchMin: 2, retry: 6 },
  'base+rw': { dealMin: 2, matchMin: 2, retry: 6, recentW: 0.2 },
  NB: { dealMin: 'auto', matchMin: 2, retry: 6, recentW: 0.2, recover: ['unblock', 'back'], seek: 0.3, R: 20 },
  'NB-dt': { dealMin: 'auto', matchMin: 2, retry: 6, recentW: 0.2, recover: ['unblock', 'dt', 'back'], seek: 0.3, R: 20 },
  'NB-dtprev': { dealMin: 'auto', matchMin: 2, retry: 6, recentW: 0.2, recover: ['unblock', 'dtprev', 'back'], seek: 0.3, R: 20 },
  'redeal+rw': { dealMin: 'auto', matchMin: 2, retry: 6, recentW: 0.2, recover: ['redeal'], seek: 0.3, R: 20 },
}
const jobs = []
for (const n of [128, 175, 225, 300, 400, 500]) for (const g of ['9x8', '7x6', '7x6s', '6x5s']) for (const [tag, c] of Object.entries(CONF))
  jobs.push({ driver: 'sim2', lex: `${T}/curve-realistic-${n}.json`, cfg: { ...H, ...GRIDS[g], ...c, name: tag, gridName: g }, tag })
writeFileSync(process.argv[2] ?? 'jobs-explore3.json', JSON.stringify(jobs))
