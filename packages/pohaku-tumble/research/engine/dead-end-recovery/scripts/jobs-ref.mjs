// Reference: Jukugo's own lexicon and layout (vertical words allowed, cube blocks), stock vs BEST, both drivers.
import { writeFileSync } from 'node:fs'
import { CONF } from './configs.mjs'
const J = { horizontalOnly: false, slab: 1, seeds: 10, ticks: 1500, cols: 9, rows: 8 }
const jobs = []
for (const tag of ['stock', 'base', 'BEST']) {
  const c = { ...CONF[tag] }
  if (tag === 'stock') c.dealMin = 5 // Jukugo's own deal bound
  jobs.push({ driver: 'sim2', lex: 'jukugo', cfg: { ...J, ...c, name: `jukugo ${tag}`, gridName: '9x8' }, tag: `jukugo ${tag}` })
  const d = { ...c }
  if (d.retry) { d.bgRetry = d.retry; d.noteSkipFrozen = true }
  delete d.retry
  jobs.push({ driver: 'dir', lex: 'jukugo', cfg: { ...J, ...d, minutes: 25, name: `jukugo ${tag}`, gridName: '9x8' }, tag: `jukugo ${tag}` })
}
writeFileSync(process.argv[2] ?? 'jobs-ref.json', JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
