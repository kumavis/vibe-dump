// The curve files are nested prefixes of curve-<order>-905.json (checked here);
// write the in-between sizes as prefix slices into lex/curve-<order>-<n>.json.
import { readFileSync, writeFileSync } from 'node:fs'
const T = 'roots/.cache/tiers'
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
const EXTRA = [150, 200, 250, 275, 350, 450]
for (const o of ['realistic', 'random', 'best']) {
  const full = JSON.parse(readFileSync(`${T}/curve-${o}-905.json`, 'utf8'))
  for (const n of SIZES) {
    const x = JSON.parse(readFileSync(`${T}/curve-${o}-${n}.json`, 'utf8'))
    const ok = x.length === n && x.every((r, i) => r.word === full[i].word && r.parts.join() === full[i].parts.join())
    if (!ok) throw new Error(`curve-${o}-${n} is not a prefix of curve-${o}-905`)
  }
  for (const n of EXTRA) writeFileSync(`lex/curve-${o}-${n}.json`, JSON.stringify(full.slice(0, n)))
}
console.log('nested prefixes confirmed; wrote', EXTRA.length * 3, 'slices')
