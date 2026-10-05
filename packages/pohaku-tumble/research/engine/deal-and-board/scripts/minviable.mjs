// Smallest curve size meeting GOOD / JUKUGO-LIKE, per engine config, curve order and grid.
// Usage: node minviable.mjs results/e5-fine.jsonl [more.jsonl]   (name must be "<config>|<order>")
//   first  = smallest size that meets it
//   stable = smallest size from which every larger size in the sweep also meets it
//            (guards against a lucky row; this is the number reported)
// Also prints which threshold fails at the size just below "stable".
import fs from 'node:fs'
import { verdict } from './totsv.mjs'

const rows = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse))
const key = (r) => `${r.name}\t${r.grid}`
const groups = new Map()
for (const r of rows) (groups.get(key(r)) ?? groups.set(key(r), []).get(key(r))).push(r)

function fails(r, kind) {
  const [d, n] = r.dealt.split('/').map(Number)
  if (d !== n) return [`dealt ${r.dealt}`]
  const T = kind === 'good' ? { stall: 0.05, stuck: 0.1, rep: 0.2, lo: 0.35, hi: 0.7 } : { stall: 0.02, stuck: 0.03, rep: 0.13, lo: 0.4, hi: 0.65 }
  const out = []
  if (r.stallRate > T.stall) out.push(`stall ${r.stallRate}`)
  if (r.stuck > T.stuck) out.push(`stuck ${r.stuck}`)
  if (r.repeatRate > T.rep) out.push(`repeat ${r.repeatRate}`)
  if (r.linked < T.lo || r.linked > T.hi) out.push(`linked ${r.linked}`)
  return out
}

const out = []
console.log(['config', 'order', 'grid', 'pairs', 'good_first', 'good_stable', 'good_fails_below', 'jl_first', 'jl_stable', 'jl_fails_below'].join('\t'))
for (const [k, rs] of groups) {
  const [name, grid] = k.split('\t')
  const [config, order] = name.split('|')
  rs.sort((a, b) => a.full - b.full)
  const res = { config, order, grid, pairs: Math.max(...rs.map((r) => r.pairs)) }
  for (const kind of ['good', 'jl']) {
    const ok = rs.map((r) => verdict(r)[kind])
    const first = rs.find((r, i) => ok[i])
    let stable = null
    for (let i = rs.length - 1; i >= 0 && ok[i]; i--) stable = rs[i]
    const idx = stable ? rs.indexOf(stable) : rs.length
    const below = idx > 0 ? rs[idx - 1] : null
    res[`${kind}_first`] = first ? first.full : null
    res[`${kind}_stable`] = stable ? stable.full : null
    res[`${kind}_fails_below`] = below ? `${below.full}: ${fails(below, kind).join(', ')}` : ''
  }
  out.push(res)
  console.log([config, order, grid, res.pairs, res.good_first, res.good_stable, res.good_fails_below, res.jl_first, res.jl_stable, res.jl_fails_below].join('\t'))
}
fs.writeFileSync(new URL('./results/minviable.json', import.meta.url), JSON.stringify(out, null, 1))
