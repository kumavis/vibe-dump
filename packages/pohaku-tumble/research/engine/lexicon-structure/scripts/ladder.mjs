// ladder.mjs — prefixes of each full order at a fine ladder of sizes, unpruned (k0), 2-core (k2),
// and 2-core's giant component only (k2g) -> lex/ladder/<order>-<size>.<k>.json
// Orders: realistic / random / best (prefixes of curve-<order>-905.json, which build_curves.py wrote
// in order) and the two greedy bridge orders from bridges.mjs (bridgeS6, bridgeCore2).
import fs from 'node:fs'
import { TIERS, loadList, kcore, index, kcoreMask } from './lexgraph.mjs'
const here = new URL('.', import.meta.url).pathname
fs.mkdirSync(here + 'lex/ladder', { recursive: true })
export const SIZES = [128, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 905]
const orders = {
  realistic: loadList(`${TIERS}/curve-realistic-905.json`),
  random: loadList(`${TIERS}/curve-random-905.json`),
  best: loadList(`${TIERS}/curve-best-905.json`),
  bridgeS6: JSON.parse(fs.readFileSync(here + 'lex/bridge-S6-order.json', 'utf8')),
  bridgeCore2: JSON.parse(fs.readFileSync(here + 'lex/bridge-core2-order.json', 'utf8')),
  bridgeRep: JSON.parse(fs.readFileSync(here + 'lex/bridge-rep-order.json', 'utf8')),
}
// ONLY=<order> regenerates just that order's files
if (process.env.ONLY) for (const o of Object.keys(orders)) if (o !== process.env.ONLY) delete orders[o]
function giantOf(list) {
  const ix = index(list)
  const parent = [...Array(list.length).keys()]
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  for (const m of [ix.first, ix.second]) for (const l of m.values()) for (let k = 1; k < l.length; k++) { const a = find(l[0]), b = find(l[k]); if (a !== b) parent[a] = b }
  const cnt = new Map()
  list.forEach((_, i) => cnt.set(find(i), (cnt.get(find(i)) ?? 0) + 1))
  const g = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  return list.filter((_, i) => find(i) === g)
}
let n = 0
for (const [o, full] of Object.entries(orders)) for (const s of SIZES) {
  const list = full.slice(0, s)
  if (list.length < s && s !== 905) continue
  fs.writeFileSync(`${here}lex/ladder/${o}-${s}.k0.json`, JSON.stringify(list))
  const c2 = kcore(list, 2)
  fs.writeFileSync(`${here}lex/ladder/${o}-${s}.k2.json`, JSON.stringify(c2))
  fs.writeFileSync(`${here}lex/ladder/${o}-${s}.k2g.json`, JSON.stringify(giantOf(c2)))
  n += 3
}
console.log('wrote', n)
