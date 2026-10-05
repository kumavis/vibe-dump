// Derive min_viable from results/final.tsv + results/supp.tsv + results/lamin.tsv.
//   node analyze.mjs  → results/min_viable.tsv, results/curves.tsv, and a printout
// The 128 point of every curve is curve-realistic-128 (sense-tagged; identical word list for all
// three orders). attested-WA.json is the same 128 words with spelling-only roots, reported apart.
// min_viable "first": smallest size meeting the verdict; "stable": smallest size from which every
// larger size on that curve also meets it (they differ only when a curve is non-monotone).
import { readFileSync, writeFileSync } from 'node:fs'

const read = (f) => {
  const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
  const cols = head.split('\t')
  return lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])))
}
const rows = [...read('results/final.tsv'), ...read('results/supp.tsv'), ...read('results/lamin.tsv')]
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
const ORDERS = ['realistic', 'random', 'best']
const GRIDS = ['9x8', '7x6', '6x5', '5x4', '4x4']
const ENGINES = ['stock', 'stock+deal', 'LA-turn', 'LA', 'LA-cool5', 'LA-min', 'LA-min-cool5', 'stock+retry6', 'LA+retry6']

const find = (engine, order, n, grid) => {
  const lex = n === 128 ? 'curve-realistic-128' : `curve-${order}-${n}`
  return rows.find((r) => r.engine === engine && r.lex === lex && r.grid === grid)
}
const out = [['engine', 'order', 'grid', 'pairs', 'GOOD_first', 'GOOD_stable', 'JUKUGO_LIKE_first', 'JUKUGO_LIKE_stable'].join('\t')]
const curves = [['engine', 'order', 'grid', 'size', 'pairs', 'dealt', 'stallRate', 'stuck', 'stuckStrict', 'frozen', 'linked', 'repeatRate', 'bounce', 'noFresh', 'GOOD', 'JUKUGO_LIKE'].join('\t')]
const summary = []
for (const engine of ENGINES) for (const order of ORDERS) for (const grid of GRIDS) {
  const pts = SIZES.map((n) => [n, find(engine, order, n, grid)])
  if (pts.some(([, r]) => !r)) continue
  const first = (k) => pts.find(([, r]) => r[k] === 'yes')?.[0] ?? null
  const stable = (k) => {
    let best = null
    for (let i = pts.length - 1; i >= 0 && pts[i][1][k] === 'yes'; i--) best = pts[i][0]
    return best
  }
  const pairs = pts.find(([, r]) => r.pairs)?.[1].pairs ?? ''
  const rec = { engine, order, grid, pairs, gf: first('GOOD'), gs: stable('GOOD'), jf: first('JUKUGO_LIKE'), js: stable('JUKUGO_LIKE') }
  summary.push(rec)
  out.push([engine, order, grid, pairs, rec.gf, rec.gs, rec.jf, rec.js].join('\t'))
  for (const [n, r] of pts) curves.push([engine, order, grid, n, r.pairs, r.dealt, r.stallRate, r.stuck, r.stuckStrict, r.frozen, r.linked, r.repeatRate, r.bounce, r.noFresh, r.GOOD, r.JUKUGO_LIKE].join('\t'))
}
writeFileSync('results/min_viable.tsv', out.join('\n') + '\n')
writeFileSync('results/curves.tsv', curves.join('\n') + '\n')
const fmt = (v) => (v == null ? '—' : String(v))
console.log('min_viable (stable = smallest size from which every larger size also passes)')
console.log('engine'.padEnd(14), 'order'.padEnd(10), 'grid', 'pairs', ' GOOD(first/stable)', ' JUKUGO-LIKE(first/stable)')
for (const s of summary) console.log(s.engine.padEnd(14), s.order.padEnd(10), s.grid, String(s.pairs).padStart(5), `  ${fmt(s.gf)}/${fmt(s.gs)}`.padEnd(19), `  ${fmt(s.jf)}/${fmt(s.js)}`)
