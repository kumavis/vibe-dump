// Ladder matrix: 5 orders x 20 sizes x {k0, k2, k2g} x {stock, fix} x 5 grids, 10 seeds x 1500 ticks.
import fs from 'node:fs'
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
for (const f of fs.readdirSync(here + 'lex/ladder').sort()) {
  const m = f.match(/^(\w+)-(\d+)\.(k\w+)\.json$/)
  const [, order, size, k] = m
  for (const [g, gc] of Object.entries(GRIDS)) for (const e of ['stock', 'fix']) {
    jobs.push({ lex: `${here}lex/ladder/${f}`, lexName: f.replace('.json', ''), cfg: { name: e, ...gc, horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, ...ENGINES[e] }, tag: { order, size: +size, k, engine: e } })
  }
}
export default jobs
