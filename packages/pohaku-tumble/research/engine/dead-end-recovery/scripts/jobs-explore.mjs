// Exploratory: every recovery kind on its own and in combination, realistic 225/300/500, 9x8.
import { writeFileSync } from 'node:fs'
const T = 'roots/.cache/tiers'
const base = { horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, dealMin: 2, matchMin: 2, retry: 6 }
const recs = { none: [], back: ['back'], unblock: ['unblock'], 'unblock+back': ['unblock', 'back'], 'back+unblock': ['back', 'unblock'], dup: ['dup'], dupfar12: ['dup'], dt: ['dt'], dtprev: ['dtprev'], redeal: ['redeal'], 'unblock+back+dt': ['unblock', 'back', 'dt'], 'unblock+back+dupfar12': ['unblock', 'back', 'dup'] }
const jobs = []
for (const n of [225, 300, 500]) for (const [tag, recover] of Object.entries(recs)) {
  const cfg = { ...base, name: tag, recover, R: 0 }
  if (tag.includes('dupfar12')) cfg.rDupFar = 12
  jobs.push({ driver: 'sim2', lex: `${T}/curve-realistic-${n}.json`, cfg, tag })
}
writeFileSync(process.argv[2] ?? 'jobs-explore.json', JSON.stringify(jobs))
