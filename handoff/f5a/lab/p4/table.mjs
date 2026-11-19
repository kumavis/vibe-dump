// factors → the set-price JSON (TS_SP).  node p4/table.mjs factors.json out.json
// factors: { <mission>: { <set>: { W: f, I: f } } }. Price = 5·round(f × base / 5), at least 5.
// Base = the units' re-fitted Skirmish cost (phase 2's pd); at Field and Grand the Hive's Boilback 20 and Hoppers 70
// (phase 3's per-unit Field finding). The Aerie's factor scales its fliers only (the Longbills keep their base);
// the Hive's scales every unit.
import { readFileSync, writeFileSync } from 'node:fs'
const [fin, fout] = process.argv.slice(2)
const F = JSON.parse(readFileSync(fin, 'utf8'))
const BASE = {
  insect: { hivemother: 60, deepguard: 75, spinethrower: 70, delver: 95, hopper: 75, boilback: 50 },
  bird: { skyseer: 70, stormtalon: 85, longbill: 65, finch: 45, kestrel: 50, roc: 115 },
}
const LARGE = { insect: { boilback: 20, hopper: 70 } }
const FLIERS = ['skyseer', 'stormtalon', 'finch', 'kestrel', 'roc']
const r5 = (x) => Math.max(5, 5 * Math.round(x / 5))
const out = {}
for (const [m, sets] of Object.entries(F)) {
  out[m] = {}
  for (const [s, f] of Object.entries(sets)) {
    const base = (race) => ({ ...BASE[race], ...(m !== 'classic' ? LARGE[race] ?? {} : {}) })
    const ins = Object.fromEntries(Object.entries(base('insect')).map(([k, c]) => [k, r5(c * f.I)]))
    const brd = Object.fromEntries(Object.entries(base('bird')).map(([k, c]) => [k, FLIERS.includes(k) ? r5(c * f.W) : c]))
    out[m][s] = { insect: ins, bird: brd }
  }
}
writeFileSync(fout, JSON.stringify(out, null, 1))
console.log(JSON.stringify(out))
