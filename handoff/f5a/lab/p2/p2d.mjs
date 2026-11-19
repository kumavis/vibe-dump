// D: the priced set (h3b, a4c, pd) beside today's table, seed 6666, every pair; against both targets.
import { readFileSync, readdirSync } from 'node:fs'
import { SHORT, mean, se, f1 } from '../load.mjs'
const LAB = new URL('..', import.meta.url).pathname
const cells = new Map()
for (const f of readdirSync(LAB + 'p2/data').filter((f) => f.endsWith('-6666.jsonl'))) {
  const v = f.split('-')[0], rs = readFileSync(LAB + 'p2/data/' + f, 'utf8').split('\n').filter(Boolean).map(JSON.parse); if (!rs.length) continue
  cells.set(`${v}|${rs[0].mission}|${rs[0].set}|${rs[0].pair.join(',')}`, rs)
}
const ev = (a, b) => a >= 46 && a <= 54 && b >= 46 && b <= 54
const home = (a, b) => (a + b) / 2 >= 46 && (a + b) / 2 <= 54 && Math.min(a, b) >= 40 && Math.max(a, b) <= 60
const out = ['| size | pair | today set1 / set2 (swing) | EVEN / HOME today | D set1 / set2 (swing) | mean | EVEN / HOME D |', '|---|---|---|---|---|---|---|']
let tally = { base: [0, 0, 0], d: [0, 0, 0] }
for (const m of ['classic', 'field']) {
  const S = m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']
  for (const p of ['squirrel,serpent', 'squirrel,insect', 'squirrel,bird', 'serpent,insect', 'serpent,bird', 'insect,bird']) {
    const row = (v) => { const q = S.map((s) => cells.get(`${v}|${m}|${s}|${p}`)); if (!q[0] || !q[1]) return null; return q.map((rs) => ({ y: 100 * mean(rs.map((r) => r.y)), se: 100 * se(rs.map((r) => r.y)), n: rs.length })) }
    const b = row('base'), d = row('h3b+a4c+pd')
    const fmt = (x) => (x ? `${f1(x[0].y)} ± ${f1(x[0].se)} / ${f1(x[1].y)} ± ${f1(x[1].se)} (${f1(x[1].y - x[0].y)})` : '-')
    const vd = (x, k) => { if (!x) return '-'; const e = ev(x[0].y, x[1].y), h = home(x[0].y, x[1].y); tally[k][0]++; if (e) tally[k][1]++; if (h) tally[k][2]++; return `${e ? 'EVEN' : '-'} / ${h ? 'HOME' : '-'}` }
    out.push(`| ${m} (N ${d?.[0].n ?? b?.[0].n}) | ${p.split(',').map((x) => SHORT[x]).join('-')} | ${fmt(b)} | ${vd(b, 'base')} | ${fmt(d)} | ${d ? f1((d[0].y + d[1].y) / 2) : '-'} | ${vd(d, 'd')} |`)
  }
}
out.push(`\nCells passing (of ${tally.d[0]}): today EVEN ${tally.base[1]}, HOME ${tally.base[2]}; D EVEN ${tally.d[1]}, HOME ${tally.d[2]}.`)
console.log(out.join('\n'))
