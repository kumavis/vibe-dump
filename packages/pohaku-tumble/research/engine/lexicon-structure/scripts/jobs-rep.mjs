// bridgeRep order (bridgerep.mjs), 2-core, stock/fix, LINK_MAX 11.5 and 8, on 9x8 / 7x6s / 6x4s. BUILD=.build2.
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
for (const size of [175, 200, 225, 250, 275, 300, 350, 400, 450, 500]) for (const linkMax of [11.5, 8]) for (const g of ['9x8', '7x6s', '6x4s']) for (const e of ['stock', 'fix']) {
  const f = `bridgeRep-${size}.k2`
  jobs.push({ lex: `${here}lex/ladder/${f}.json`, lexName: f, cfg: { name: e, ...GRIDS[g], horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, linkMax, ...ENGINES[e] }, tag: { order: 'bridgeRep', size, k: 'k2', engine: linkMax === 11.5 ? e : `${e}+L${linkMax}`, linkMax } })
}
export default jobs
