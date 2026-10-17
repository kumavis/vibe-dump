// partial-confirmation lists (partial.mjs), fix engine, 9x8 and 7x6s.
import fs from 'node:fs'
import { ENGINES, GRIDS } from './jobs-main.mjs'
const here = new URL('.', import.meta.url).pathname
const jobs = []
for (const f of fs.readdirSync(here + 'lex/partial').sort()) {
  const [, order, p, N, d] = f.match(/^(\w+)-p([\d.]+)-n(\d+)-d(\d)\.k2\.json$/)
  for (const g of ['9x8', '7x6s']) jobs.push({ lex: `${here}lex/partial/${f}`, lexName: f.replace('.json', ''), cfg: { name: 'fix', ...GRIDS[g], horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, ...ENGINES.fix }, tag: { order: `${order}-p${p}`, size: +N, k: 'k2', engine: 'fix', draw: +d, pass: +p } })
}
export default jobs
