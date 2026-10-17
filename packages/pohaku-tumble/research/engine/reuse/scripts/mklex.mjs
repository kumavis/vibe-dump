// Intermediate curve sizes. The curve files are nested prefixes of
// curve-<order>-905.json (checked), so curve-<order>-N = its first N words.
// Writes lex/curve-<order>-<N>.json here; the originals are not touched.
import { readFileSync, writeFileSync } from 'node:fs'
const TIERS = 'roots/.cache/tiers'
for (const order of ['realistic', 'random', 'best']) {
  const all = JSON.parse(readFileSync(`${TIERS}/curve-${order}-905.json`, 'utf8'))
  for (const n of [150, 200, 250, 275, 350]) writeFileSync(new URL(`./lex/curve-${order}-${n}.json`, import.meta.url), JSON.stringify(all.slice(0, n)))
}
