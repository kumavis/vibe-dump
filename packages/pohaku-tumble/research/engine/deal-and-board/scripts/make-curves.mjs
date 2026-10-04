// Finer curve steps. Every curve-<order>-<n>.json in the tiers directory is the
// first n entries of curve-<order>-905.json (checked), so a prefix of the 905
// file is the same nested curve at any size. Writes lexicons/curve-<order>-<n>.json.
import fs from 'node:fs'
const T = 'roots/.cache/tiers'
const here = new URL('./lexicons/', import.meta.url)
for (const o of ['realistic', 'random', 'best']) {
  const full = JSON.parse(fs.readFileSync(`${T}/curve-${o}-905.json`, 'utf8'))
  for (const n of [128, 175, 225, 300, 400, 500, 650]) {
    const ref = JSON.parse(fs.readFileSync(`${T}/curve-${o}-${n}.json`, 'utf8'))
    if (JSON.stringify(ref) !== JSON.stringify(full.slice(0, n))) throw new Error(`curve-${o}-${n} is not a prefix`)
  }
  for (let n = 250; n <= 900; n += 25) {
    if ([300, 400, 500, 650].includes(n)) continue
    fs.writeFileSync(new URL(`curve-${o}-${n}.json`, here), JSON.stringify(full.slice(0, n)))
  }
}
