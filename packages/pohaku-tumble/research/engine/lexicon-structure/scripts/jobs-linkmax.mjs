// LINK_MAX scaled down for the dense orders (best, bridgeS6) vs realistic, 2-core lists, BUILD=.build2.
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
for (const order of ['best', 'bridgeS6', 'realistic']) for (const size of [175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 550, 600, 650]) for (const linkMax of [9.5, 8, 6.5])
  for (const g of ['9x8', '7x6s', '6x4s']) for (const e of ['stock', 'fix']) {
    const f = `${order}-${size}.k2`
    jobs.push({ lex: `${here}lex/ladder/${f}.json`, lexName: f, cfg: { name: e, ...GRIDS[g], horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, linkMax, ...ENGINES[e] }, tag: { order, size, k: 'k2', engine: `${e}+L${linkMax}`, linkMax } })
  }
export default jobs
