// Jukugo's engine exactly (deal pool degree >= 5, matchMin 3, no retry) on 2-core-pruned lists, 20 seeds.
import { GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
for (const [order, sizes] of [['realistic', [500, 550, 600, 650, 905]], ['bridgeRep', [225, 250, 275, 300]], ['bridgeS6', [250, 275, 300]]]) for (const size of sizes) for (const g of ['9x8', '7x6']) {
  const f = `${order}-${size}.k2`
  jobs.push({ lex: `${here}lex/ladder/${f}.json`, lexName: f, cfg: { name: 'jukugo5', ...GRIDS[g], horizontalOnly: true, slab: 1.5, seeds: 20, ticks: 1500 }, tag: { order, size, k: 'k2', engine: 'jukugo5', seeds20: true } })
}
export default jobs
