// minviable.mjs <results.jsonl>... — for every (engine, pruning k, order, grid): the smallest ladder
// size that meets GOOD / JUKUGO-LIKE.
//   first  = smallest size that passes
//   stable = smallest size from which EVERY larger ladder size also passes (what min_viable reports;
//            guards against a lucky row in a noisy region)
// Writes minviable.tsv.
import fs from 'node:fs'
import { good, jlike } from './verdict.mjs'
const here = new URL('.', import.meta.url).pathname
const files = process.argv.slice(2)
const rows = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse))
const groups = new Map()
for (const r of rows) {
  if (!r.order || r.order === 'jukugo' || r.order === 'attested') continue
  const key = [r.engine, r.k, r.order, r.grid].join('|')
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(r)
}
function mins(list, pred) {
  list.sort((a, b) => a.size - b.size)
  const first = list.find(pred)?.size ?? null
  let stable = null
  for (let i = list.length - 1; i >= 0; i--) { if (pred(list[i])) stable = list[i].size; else break }
  return { first, stable }
}
const out = [['engine', 'k', 'order', 'grid', 'good_first', 'good_stable', 'jl_first', 'jl_stable', 'sizes'].join('\t')]
for (const [key, list] of [...groups.entries()].sort()) {
  const g = mins(list, good), j = mins(list, jlike)
  out.push([...key.split('|'), g.first ?? '', g.stable ?? '', j.first ?? '', j.stable ?? '', list.length].join('\t'))
}
fs.writeFileSync(here + 'minviable.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
