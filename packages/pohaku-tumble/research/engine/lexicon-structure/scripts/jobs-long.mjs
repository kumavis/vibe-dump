// Long runs (15,000 ticks = 10x the standard, ~230 turns per pair on 9x8): do frozen pairs pile up?
// Under Jukugo's rules a pair that turns into a word whose only turn is back where it came from never
// turns again, so on an unpruned list stuckPerm should grow with run length; on a 2-core it cannot.
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = [{ lex: 'jukugo', lexName: 'jukugo', cfg: { name: 'jukugo-ref', cols: 9, rows: 8, horizontalOnly: false, slab: 1, seeds: 10, ticks: 15000 }, tag: { order: 'jukugo', size: 1649, k: 'k0', engine: 'jukugo-ref', long: true } }]
for (const [size, k, e] of [[905, 'k0', 'stock'], [905, 'k2', 'stock'], [550, 'k0', 'fix'], [550, 'k2', 'fix']]) {
  const f = `realistic-${size}.${k}`
  jobs.push({ lex: `${here}lex/ladder/${f}.json`, lexName: f, cfg: { name: e, ...GRIDS['9x8'], horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 15000, ...ENGINES[e] }, tag: { order: 'realistic', size, k, engine: e, long: true } })
}
export default jobs
