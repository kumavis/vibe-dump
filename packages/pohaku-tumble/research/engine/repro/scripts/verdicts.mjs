// Read results/*.jsonl, write results.tsv (every run, with GOOD / JUKUGO-LIKE verdicts under three
// definitions of "stuck") and print the claimed-vs-measured comparison and minimum viable sizes.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const rows = []
for (const f of readdirSync(join(here, 'results')).filter((f) => f.endsWith('.jsonl')).sort()) {
  for (const l of readFileSync(join(here, 'results', f), 'utf8').trim().split('\n').filter(Boolean)) rows.push({ file: f, ...JSON.parse(l) })
}
// normalise harness and Director-model rows to one shape
const norm = (r) => {
  const dealtAll = (() => { const [a, b] = r.dealt.split('/'); return a === b })()
  if (r.model === 'director')
    return { ...r, stall: r.beatsLost, sFree: r.stuckFreeBoard, sLegal: r.stuckBoard, sStrict: r.stuckAllBoard, rep: r.repeat, lnk: r.linked, seen: r.seen, dealtAll }
  return { ...r, stall: r.stallRate, sFree: r.stuckFree, sLegal: r.stuckLegal, sStrict: r.stuckAll, rep: r.repeatRate, lnk: r.linkedAll, seen: r.seenFrac, dealtAll }
}
const GOOD = (r, s) => r.dealtAll && r.stall <= 0.05 && s <= 0.1 && r.rep <= 0.2 && r.lnk >= 0.35 && r.lnk <= 0.7
const JL = (r, s) => r.dealtAll && r.stall <= 0.02 && s <= 0.03 && r.rep <= 0.13 && r.lnk >= 0.4 && r.lnk <= 0.65
const V = (r, s) => (JL(r, s) ? 'JL' : GOOD(r, s) ? 'GOOD' : 'fail')
const N = rows.map(norm)
const cols = ['file', 'label', 'model', 'engine', 'order', 'size', 'gridName', 'grid', 'playable', 'LINK_MAX', 'pairs', 'holes', 'dealt', 'ticks', 'seconds',
  'stall', 'sFree', 'sLegal', 'sStrict', 'rep', 'returnRate', 'lnk', 'seen', 'noteFail', 'vFree', 'vLegal', 'vStrict']
const out = [cols.join('\t')]
for (const r of N) {
  r.vFree = V(r, r.sFree)
  r.vLegal = V(r, r.sLegal)
  r.vStrict = V(r, r.sStrict)
  out.push(cols.map((c) => r[c] ?? '').join('\t'))
}
writeFileSync(join(here, 'results.tsv'), out.join('\n') + '\n')

// minimum viable: smallest size whose 10-seed/1500-tick row (or 3000 s Director row) passes AND every larger
// tested size passes; "robust" additionally requires the 30-seed and long-horizon rows that exist for that size to pass.
function minViable(prefix, grid, test, key) {
  const base = N.filter((r) => r.label.startsWith(prefix) && r.gridName === grid && r.label === `${prefix} ${r.size} ${grid}`).sort((a, b) => a.size - b.size)
  const extra = N.filter((r) => r.label.startsWith(prefix) && r.gridName === grid && r.label !== `${prefix} ${r.size} ${grid}` && /(30s|6000t|12000sec)$/.test(r.label))
  let plain = null
  let robust = null
  for (let i = base.length - 1; i >= 0; i--) {
    if (!test(base[i], base[i][key])) break
    plain = base[i].size
  }
  for (let i = base.length - 1; i >= 0; i--) {
    const r = base[i]
    const ex = extra.filter((e) => e.size === r.size)
    if (!test(r, r[key]) || ex.some((e) => !test(e, e[key]))) break
    robust = r.size
  }
  return { plain, robust }
}
console.log('\nMINIMUM VIABLE (realistic)')
console.log(['model', 'grid', 'stuck def', 'GOOD plain', 'GOOD robust', 'JL plain', 'JL robust'].join('\t'))
for (const [prefix, grids] of [['POHAKU realistic', ['5x4s', 'auto', '9x8', '6x5s']], ['POHAKU-ret realistic', ['auto', '9x8']], ['D-POHAKU realistic', ['5x4s', 'auto', '9x8']]]) {
  for (const g of grids) {
    for (const key of ['sFree', 'sLegal', 'sStrict']) {
      const a = minViable(prefix, g, GOOD, key)
      const b = minViable(prefix, g, JL, key)
      console.log([prefix, g, key, a.plain, a.robust, b.plain, b.robust].join('\t'))
    }
  }
}
