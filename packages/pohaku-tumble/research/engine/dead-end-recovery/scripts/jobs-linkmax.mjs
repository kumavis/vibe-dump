// Extra: on the "best" order the floor is over-linked (hub roots). Shorter LINK_MAX (x0.7, x0.55)
// with the BEST engine, to show that constraint is a link-reach knob, not a recovery question.
import { writeFileSync } from 'node:fs'
import { GRIDS, T, H } from './grids.mjs'
import { CONF } from './configs.mjs'
const jobs = []
for (const n of [175, 225, 300, 400, 500]) for (const g of ['9x8', '6x5s']) for (const s of [0.7, 0.55]) {
  const G = GRIDS[g]
  const lm = +((G.linkMax ?? 11.5) * s).toFixed(2), dn = +((G.dealNear ?? 9) * s).toFixed(2)
  const tag = `BEST lm x${s}`
  jobs.push({ driver: 'sim2', lex: `${T}/curve-best-${n}.json`, cfg: { ...H, ...G, ...CONF.BEST, linkMax: lm, dealNear: dn, name: tag, gridName: g }, tag })
}
writeFileSync(process.argv[2] ?? 'jobs-linkmax.json', JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
