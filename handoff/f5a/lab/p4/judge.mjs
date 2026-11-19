// The judgment table on one seed: a label beside today's ('base'), every pair, sizes and sets; both targets.
//   node p4/judge.mjs <seed> <label>
import { readFileSync, readdirSync } from 'node:fs'
import { SHORT, mean, se, f1 } from '../load.mjs'
const [seed, label] = process.argv.slice(2)
const D = new URL('./data/', import.meta.url).pathname
const cells = new Map()
for (const f of readdirSync(D).filter((f) => f.endsWith(`-${seed}.jsonl`))) {
  const v = f.split('-')[0], rs = readFileSync(D + f, 'utf8').split('\n').filter(Boolean).map(JSON.parse); if (!rs.length) continue
  const k = `${v}|${rs[0].mission}|${rs[0].set}|${rs[0].pair.join(',')}`; cells.set(k, (cells.get(k) ?? []).concat(rs))
}
const ev = (a, b) => a >= 46 && a <= 54 && b >= 46 && b <= 54
const home = (a, b) => (a + b) / 2 >= 46 && (a + b) / 2 <= 54 && Math.min(a, b) >= 40 && Math.max(a, b) <= 60
const out = ['| size | pair | today set1 / set2 (diff) | EVEN / HOME | priced set1 / set2 (diff) | mean | EVEN / HOME |', '|---|---|---|---|---|---|---|']
const tally = {}
for (const m of ['classic', 'field', 'grand']) {
  const S = m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']
  tally[m] = { base: [0, 0, 0], set: [0, 0, 0], cellsBase: [0, 0, 0], cellsSet: [0, 0, 0] }
  for (const p of ['squirrel,serpent', 'squirrel,insect', 'squirrel,bird', 'serpent,insect', 'serpent,bird', 'insect,bird']) {
    const row = (v) => { const q = S.map((s) => cells.get(`${v}|${m}|${s}|${p}`)); if (!q[0] || !q[1]) return null; return q.map((rs) => ({ y: 100 * mean(rs.map((r) => r.y)), se: 100 * se(rs.map((r) => r.y)), n: rs.length })) }
    const b = row('base'), d = p === 'squirrel,serpent' ? b : row(label)
    const fmt = (x) => (x ? `${f1(x[0].y)} ± ${f1(x[0].se)} / ${f1(x[1].y)} ± ${f1(x[1].se)} (${f1(x[1].y - x[0].y)})` : '-')
    const vd = (x, key) => {
      if (!x) return '-'; const e = ev(x[0].y, x[1].y), h = home(x[0].y, x[1].y)
      if (p !== 'squirrel,serpent') { const t = tally[m][key]; t[0]++; if (e) t[1]++; if (h) t[2]++; const c = tally[m][key === 'base' ? 'cellsBase' : 'cellsSet']; for (const z of x) { c[0]++; if (z.y >= 46 && z.y <= 54) c[1]++; if (z.y >= 40 && z.y <= 60) c[2]++ } }
      return `${e ? 'EVEN' : '-'} / ${h ? 'HOME' : '-'}`
    }
    out.push(`| ${m} (N ${d?.[0].n ?? b?.[0].n}) | ${p.split(',').map((x) => SHORT[x]).join('-')} | ${fmt(b)} | ${vd(b, 'base')} | ${fmt(d)} | ${d ? f1((d[0].y + d[1].y) / 2) : '-'} | ${vd(d, 'set')} |`)
  }
}
out.push('\nNew-race pairs passing, per size (pairs of 5: EVEN = both sets 46-54, HOME = mean 46-54 and both 40-60; cells of 10: inside 46-54 / inside 40-60):\n')
out.push('| size | today: pairs EVEN / HOME | today: cells in 46-54 / 40-60 | priced: pairs EVEN / HOME | priced: cells in 46-54 / 40-60 |')
out.push('|---|---|---|---|---|')
for (const [m, t] of Object.entries(tally)) out.push(`| ${m} | ${t.base[1]} / ${t.base[2]} of ${t.base[0]} | ${t.cellsBase[1]} / ${t.cellsBase[2]} of ${t.cellsBase[0]} | ${t.set[1]} / ${t.set[2]} of ${t.set[0]} | ${t.cellsSet[1]} / ${t.cellsSet[2]} of ${t.cellsSet[0]} |`)
console.log(out.join('\n'))
