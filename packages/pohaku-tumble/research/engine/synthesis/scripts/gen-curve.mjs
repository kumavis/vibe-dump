// The full curve: orders × sizes × grids × engines, for sim.mjs or the Director model.
//   node gen-curve.mjs out.json <sim|dir> <engine,engine,...> <grid,grid,...> [seeds] [ticks|duration]
// grids: 9x8, 6x5, 5x4, auto, ...; sizes: the 8 curve files plus the prefix slices in lex/.
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const [out, mode, engines, grids, seeds, len] = process.argv.slice(2)
const E = mode === 'dir' ? DENGINES : ENGINES
const CURVE = [128, 175, 225, 300, 400, 500, 650, 905]
const SLICES = [150, 200, 250, 275, 350, 450]
const jobs = []
for (const e of engines.split(',')) for (const g of grids.split(',')) for (const o of ['realistic', 'random', 'best'])
  for (const n of [...CURVE, ...SLICES].sort((a, b) => a - b)) {
    const [c, r] = g === 'auto' ? [null, null] : g.split('x').map(Number)
    const cfg = E[e](c, r)
    if (seeds) cfg.seeds = +seeds
    if (len) cfg[mode === 'dir' ? 'duration' : 'ticks'] = +len
    jobs.push({ engine: e, lex: CURVE.includes(n) ? `curve-${o}-${n}` : `lex/curve-${o}-${n}.json`, cfg })
  }
writeFileSync(out, JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
