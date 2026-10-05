// Ladder, trimmed (the machine is shared with other agents): skips rows already in
// results-ladder.jsonl; k2g only with fix; bridgeCore2 (56 of its first 60 picks are bridgeS6's)
// only fix+k2 on 9x8, 7x6, 6x4s. Same seeds/ticks as jobs-ladder.mjs, so rows are interchangeable.
import fs from 'node:fs'
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const done = new Set()
try { for (const l of fs.readFileSync(here + 'results-ladder.jsonl', 'utf8').trim().split('\n')) { const r = JSON.parse(l); done.add([r.lexName, r.grid, r.engine].join('|')) } } catch {}
const jobs = []
for (const f of fs.readdirSync(here + 'lex/ladder').sort()) {
  const [, order, size, k] = f.match(/^(\w+)-(\d+)\.(k\w+)\.json$/)
  const lexName = f.replace('.json', '')
  for (const [g, gc] of Object.entries(GRIDS)) for (const e of ['stock', 'fix']) {
    if (k === 'k2g' && e !== 'fix') continue
    if (order === 'bridgeCore2' && !(e === 'fix' && k === 'k2' && ['9x8', '7x6', '6x4s'].includes(g))) continue
    if (done.has([lexName, g, e].join('|'))) continue
    jobs.push({ lex: `${here}lex/ladder/${f}`, lexName, cfg: { name: e, ...gc, horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, ...ENGINES[e] }, tag: { order, size: +size, k, engine: e } })
  }
}
// most informative first
const rank = { realistic: 0, bridgeS6: 1, random: 2, bridgeCore2: 3, best: 4 }
jobs.sort((a, b) => rank[a.tag.order] - rank[b.tag.order])
export default jobs
