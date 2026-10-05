// Exploratory 2: seek (proactively give beats to frozen pairs), R (rest before recovery), recentW, at 300 and 500, 9x8.
import { writeFileSync } from 'node:fs'
const T = 'roots/.cache/tiers'
const base = { horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, dealMin: 2, matchMin: 2, retry: 6 }
const jobs = []
const add = (n, tag, extra) => jobs.push({ driver: 'sim2', lex: `${T}/curve-realistic-${n}.json`, cfg: { ...base, name: tag, ...extra }, tag })
for (const n of [300, 500]) {
  add(n, 'base', {})
  add(n, 'base recentW.2', { recentW: 0.2 })
  for (const rec of [['back'], ['dtprev'], ['dt'], ['unblock', 'back'], ['unblock', 'dtprev'], ['unblock', 'dt'], ['redeal']]) {
    for (const [seek, R] of [[0, 0], [0.3, 0], [0.3, 20], [1, 0], [1, 20], [1, 60]]) {
      add(n, `${rec.join('+')} seek${seek} R${R}`, { recover: rec, seek, R })
    }
    add(n, `${rec.join('+')} seek0.3 R20 recentW.2`, { recover: rec, seek: 0.3, R: 20, recentW: 0.2 })
  }
}
writeFileSync(process.argv[2] ?? 'jobs-explore2.json', JSON.stringify(jobs))
