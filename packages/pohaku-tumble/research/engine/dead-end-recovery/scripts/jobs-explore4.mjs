// Exploratory 4: tune R / seek / recentW for the non-bending recovery (unblock+back) and the
// clean double tumble (unblock+dtprev+back), at 225 and 300, grids 9x8 and 6x5s.
import { writeFileSync } from 'node:fs'
import { GRIDS, T, H } from './grids.mjs'
const jobs = []
for (const n of [225, 300]) for (const g of ['9x8', '6x5s']) for (const rec of [['unblock', 'back'], ['unblock', 'dtprev', 'back']])
  for (const R of [5, 20, 40]) for (const seek of [0.3, 1]) for (const rw of [0.05, 0.2]) {
    const tag = `${rec.join('+')} R${R} seek${seek} rw${rw}`
    jobs.push({ driver: 'sim2', lex: `${T}/curve-realistic-${n}.json`, cfg: { ...H, ...GRIDS[g], name: tag, gridName: g, dealMin: 'auto', matchMin: 2, retry: 6, recentW: rw, recover: rec, seek, R }, tag })
  }
writeFileSync(process.argv[2] ?? 'jobs-explore4.json', JSON.stringify(jobs))
