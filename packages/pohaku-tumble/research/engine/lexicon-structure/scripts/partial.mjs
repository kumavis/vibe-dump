// partial.mjs — lists for "only some lookups confirm": the 128 attested + each of the first N
// candidates of a checking order, kept independently with probability p (3 draws), then 2-core.
// -> lex/partial/<order>-p<p>-n<N>-d<draw>.k2.json   (N counts lookups, not confirmed words)
import fs from 'node:fs'
import { TIERS, loadList, kcore } from './lexgraph.mjs'
const here = new URL('.', import.meta.url).pathname
const base = loadList(`${TIERS}/curve-realistic-128.json`)
const orders = {
  realistic: loadList(`${TIERS}/curve-realistic-905.json`).slice(128),
  bridgeRep: JSON.parse(fs.readFileSync(here + 'lex/bridge-rep-order.json', 'utf8')).slice(128),
}
function rng32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
let n = 0
for (const [o, cand] of Object.entries(orders)) for (const p of [0.5, 0.75]) for (let d = 0; d < 3; d++) {
  const rnd = rng32(5000 + d * 101 + Math.round(p * 100))
  const keep = cand.map(() => rnd() < p) // one draw per word, shared across N so lists are nested
  for (const N of [150, 200, 250, 300, 400, 500, 600, 777]) {
    const list = [...base, ...cand.slice(0, N).filter((_, i) => keep[i])]
    fs.writeFileSync(`${here}lex/partial/${o}-p${p}-n${N}-d${d}.k2.json`, JSON.stringify(kcore(list, 2)))
    n++
  }
}
console.log('wrote', n)
