// p4/data cells of a label → solve.mjs observations, with the label's factors.  node p4/obs.mjs <label> <factors.json>
import { readFileSync, readdirSync } from 'node:fs'
import { SHORT } from '../load.mjs'
const [label, ff] = process.argv.slice(2)
const F = JSON.parse(readFileSync(ff, 'utf8'))
const D = new URL('./data/', import.meta.url).pathname
const acc = new Map()
for (const f of readdirSync(D).filter((f) => f.startsWith(label + '-') && f.endsWith('.jsonl'))) {
  for (const l of readFileSync(D + f, 'utf8').split('\n')) {
    if (!l) continue
    const r = JSON.parse(l), k = `${r.mission}|${r.set}|${r.pair.map((x) => SHORT[x]).join('-')}`
    const a = acc.get(k) ?? { y: 0, n: 0 }; a.y += r.y; a.n++; acc.set(k, a)
  }
}
console.log(JSON.stringify([...acc].map(([k, a]) => { const [mission, set, pair] = k.split('|'); return { mission, set, pair, y: a.y / a.n, n: a.n, fW: F[mission][set].W, fI: F[mission][set].I } })))
