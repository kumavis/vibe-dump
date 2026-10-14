// Print a compact table from a results JSONL. usage: node show.mjs file.jsonl [filter-substring]
import { readFileSync } from 'node:fs'
const [file, filt] = process.argv.slice(2)
const rows = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse).filter((r) => !filt || JSON.stringify(r).includes(filt))
const f = (x) => (x == null ? '-' : typeof x === 'number' ? String(+x.toFixed(3)) : String(x))
for (const r of rows) {
  if (r.driver === 'dir') {
    console.log([r.tag, r.lexFile, r.grid, r.pairs, r.dealt, 'lost', f(r.beatsLost), 'bg', f(r.bgLost), 'note', f(r.noteLost), 'stuck', f(r.stuck), 'vis', f(r.stuckVis), 'rep', f(r.repeatRate), 'lnk', f(r.linked), 'tpm', f(r.tumblesPerMin), 'spell', f(r.spellMeanS), 'p90', f(r.spellP90S), 'fires/min', JSON.stringify(r.firesPerMin), 'tdup/min', f(r.transientDupsPerMin)].join('\t'))
  } else {
    console.log([r.tag, r.lexFile, r.grid, r.pairs, r.dealt, 'lost', f(r.stallRate), 'stuck', f(r.stuck), 'rep', f(r.repeatRate), 'lnk', f(r.linked), 'spell', f(r.spellMean), 'p90', f(r.spellP90), 'long', f(r.longShare), 'tpb', f(r.tumblesPerBeat), 'fires/1k', JSON.stringify(r.firesPer1k ?? {}), 'cov', JSON.stringify(r.cover ?? {})].join('\t'))
  }
}
