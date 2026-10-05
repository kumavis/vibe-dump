// 20-seed reruns of the rows that decide min_viable (boundaries), BUILD=.build2 (linkMax knob).
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
const add = (order, size, k, e, g, linkMax) => {
  const f = `${order}-${size}.${k}`
  jobs.push({ lex: `${here}lex/ladder/${f}.json`, lexName: f, cfg: { name: e, ...GRIDS[g], horizontalOnly: true, slab: 1.5, seeds: 20, ticks: 1500, ...(linkMax ? { linkMax } : {}), ...ENGINES[e] }, tag: { order, size, k, engine: linkMax ? `${e}+L${linkMax}` : e, seeds20: true } })
}
for (const s of [500, 550, 600, 650]) for (const g of ['9x8', '7x6', '6x4s']) { add('realistic', s, 'k2', 'fix', g); add('realistic', s, 'k2', 'stock', g) }
for (const s of [700, 750, 800, 850, 905]) for (const g of ['9x8', '7x6']) add('realistic', s, 'k0', 'stock', g)
for (const s of [800, 850, 905]) add('realistic', s, 'k2', 'fix', '9x8')
for (const s of [225, 250, 275, 300]) for (const g of ['9x8', '7x6s']) add('bridgeRep', s, 'k2', 'fix', g)
for (const s of [175, 200, 225]) add('best', s, 'k2', 'fix', '9x8', 6.5)
export default jobs
