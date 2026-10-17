// Jukugo's own lexicon (30% vertical words, cubes) under each engine: does the new engine harm the big-lexicon case?
//   node gen-ref.mjs out.json <sim|dir> [seeds] [len]
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const [out, mode, seeds, len] = process.argv.slice(2)
const E = mode === 'dir' ? DENGINES : ENGINES
const jobs = []
for (const e of ['stock', 'REC', 'REC+ret', 'REC+ret -prune', 'POHAKU', 'POHAKU -ret']) {
  const cfg = { ...E[e](9, 8), horizontalOnly: false, slab: 1 }
  if (e === 'stock') cfg.dealMin = 5 // Jukugo exactly
  if (seeds) cfg.seeds = +seeds
  if (len) cfg[mode === 'dir' ? 'duration' : 'ticks'] = +len
  jobs.push({ engine: `jukugo ${e}`, lex: 'jukugo', cfg })
}
writeFileSync(out, JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
