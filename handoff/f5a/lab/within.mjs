// Within-set slopes: the focus score on each board's walk detour (to the flank objectives) and clear-sight share,
// fitted on one set at a time (so no set-level difference identifies them), with the centre piece as dummies.
// Then the swing those slopes predict from the sets' mean difference in the covariate.  node within.mjs > within.md
import { load, SHORT, mean, f1, f2, seatOf, focusOf, logit } from './load.mjs'
const recs = load()
const boards = new Map(load('boards').map((b) => [`${b.mission}|${b.set}|${b.pair.join(',')}|${b.i}`, b]))
for (const r of recs) r.b = boards.get(`${r.mission}|${r.set}|${r.pair.join(',')}|${r.i}`)
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
const det = (r) => mean(r.b.travel.flatMap((row) => row.slice(1).map((o) => o.walk).filter((x) => x != null)))
const out = ['# Within-set slopes (within.mjs, run1 + boards, seed 2222)\n', 'Logistic fits on one set at a time: score ~ seat + centre dummies + detour (per 0.1 of walk cost / straight line) + clear18 (per 0.1). "Predicted" = the within-fortified detour slope x the sets\' mean detour difference, as score points at the classic mean (a rough linearisation).\n',
  '| size | pair | set | N | detour slope | clear18 slope | detour sd | mean detour classic / fortified | swing predicted by detour (points) | actual swing |', '|---|---|---|---|---|---|---|---|---|---|']
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const sets = m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']
  const by = sets.map((s) => recs.filter((r) => r.mission === m && r.set === s && pairName(r.pair) === p && r.b))
  if (!by[0].length) continue
  const fo = focusOf(by[0][0].pair)
  const md = by.map((q) => mean(q.map(det)))
  const ys = by.map((q) => mean(q.map((r) => fy(r, fo))))
  for (const [k, q] of by.entries()) {
    const kinds = [...new Set(q.map((r) => r.b.centre))].filter((c) => q.filter((r) => r.b.centre === c).length > 30).slice(1)
    const c18 = mean(q.map((r) => r.b.open[18].clear))
    const F = logit(q.map((r) => [1, seatOf(r, fo) === 0 ? 1 : -1, ...kinds.map((c) => (r.b.centre === c ? 1 : 0)), (det(r) - md[k]) * 10, (r.b.open[18].clear - c18) * 10]), q.map((r) => fy(r, fo)))
    const j = 2 + kinds.length
    const sd = Math.sqrt(mean(q.map((r) => (det(r) - md[k]) ** 2)))
    const p0 = ys[0], slope = F.b[j]
    const pred = k === 1 ? 100 * (1 / (1 + Math.exp(-(Math.log(p0 / (1 - p0)) + slope * (md[1] - md[0]) * 10))) - p0) : NaN
    out.push(`| ${m} | ${p} (${SHORT[fo]}) | ${sets[k]} | ${q.length} | ${f2(slope)} ± ${f2(F.se[j])} | ${f2(F.b[j + 1])} ± ${f2(F.se[j + 1])} | ${f2(sd)} | ${f2(md[0])} / ${f2(md[1])} | ${k === 1 ? f1(pred) : ''} | ${k === 1 ? f1(100 * (ys[1] - ys[0])) : ''} |`)
  }
}
console.log(out.join('\n'))
