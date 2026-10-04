// prune.mjs — write k-core-pruned copies of the lists to lex/<list>.k<k>.json (k = 2, 3, 4).
// k-core: repeatedly drop every word that can turn fewer than k ways among the words still in.
// k = 2 removes exactly the words a pair can never leave once it arrives (degree <= 1 after
// pruning: its only turn is back where it came from, which chooseTurn forbids), plus words that
// can't be reached at all (degree 0).
import fs from 'node:fs'
import { TIERS, loadList, kcore } from './lexgraph.mjs'
const here = new URL('.', import.meta.url).pathname
const names = ['attested-WA']
for (const o of ['realistic', 'random', 'best']) for (const n of [128, 175, 225, 300, 400, 500, 650, 905]) names.push(`curve-${o}-${n}`)
for (const name of names) {
  const list = loadList(`${TIERS}/${name}.json`)
  fs.writeFileSync(`${here}lex/${name}.k0.json`, JSON.stringify(list))
  for (const k of [2, 3, 4]) fs.writeFileSync(`${here}lex/${name}.k${k}.json`, JSON.stringify(kcore(list, k)))
}
console.log('wrote', names.length * 4, 'lists')
