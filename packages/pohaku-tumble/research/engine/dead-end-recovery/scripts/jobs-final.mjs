// The final harness-mode matrix (sim2). Writes jobs-final.json.
import { writeFileSync } from 'node:fs'
import { GRIDS, T, H } from './grids.mjs'
import { CONF } from './configs.mjs'
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
const jobs = []
const add = (lexName, g, tag) => jobs.push({ driver: 'sim2', lex: `${T}/${lexName}.json`, cfg: { ...H, ...GRIDS[g], ...CONF[tag], name: tag, gridName: g }, tag })
for (const n of SIZES) {
  for (const g of ['9x8', '7x6s', '6x5s']) for (const tag of Object.keys(CONF)) add(`curve-realistic-${n}`, g, tag)
  for (const tag of ['stock', 'base', 'BEST', 'BEST-redeal']) add(`curve-realistic-${n}`, '7x6', tag)
  for (const tag of ['stock', 'base', 'BEST']) add(`curve-realistic-${n}`, '5x4s', tag)
  for (const order of ['random', 'best']) for (const g of ['9x8', '6x5s']) for (const tag of ['stock', 'base', 'BEST', 'BEST-dt', 'BEST-redeal']) add(`curve-${order}-${n}`, g, tag)
}
for (const g of ['9x8', '7x6s', '6x5s', '5x4s']) for (const tag of ['stock', 'base', 'BEST']) add('attested-WA', g, tag)
writeFileSync(process.argv[2] ?? 'jobs-final.json', JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
