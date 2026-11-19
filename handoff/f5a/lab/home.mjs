// Home and away objectives (rich data, seat edges known): per race, the share of round ends it holds its own two
// home flank objectives (on its own half), the enemy's two, and the centre; and which of its unit types hold home.
//   node home.mjs > home.md
import { load, SHORT, mean, f1, f2, pc, seatOf, focusOf, RACE_OF } from './load.mjs'
const recs = load('rich')
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const out = ['# Home and away objectives (home.mjs, rich data, seed 3333)\n', 'Share of objective-round-ends held, Skirmish (two home flanks, two away flanks, the centre), per race, and the OC per battle its unit types count at its home flanks.\n',
  '| pair | set | race | home held % | away held % | centre held % | OC at home flanks per battle by unit type |', '|---|---|---|---|---|---|---|']
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) for (const s of m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']) {
  const rs = recs.filter((r) => r.mission === m && r.set === s && pairName(r.pair) === p); if (!rs.length) continue
  for (const race of rs[0].pair) {
    let h = 0, hn = 0, a = 0, an = 0, c = 0, cn = 0; const oc = {}
    for (const r of rs) {
      const sd = seatOf(r, race), e = r.edges[sd]
      for (const rd of r.rounds) rd.objs.forEach((o, i) => {
        const ox = r.mission === 'classic' ? [0, -9, 9, -9, 9][i] : [0, -11, 11, -11, 11, 0, 0][i]
        const held = o.owner === sd ? 1 : 0
        if (ox === 0) { c += held; cn++ } else if (Math.sign(ox) === e) { h += held; hn++; for (const [t, v] of Object.entries(o.oc[sd])) oc[t] = (oc[t] ?? 0) + v } else { a += held; an++ }
      })
    }
    out.push(`| ${m} ${p} | ${s} | ${SHORT[race]} | ${pc(h / hn)} | ${pc(a / an)} | ${pc(c / cn)} | ${Object.entries(oc).sort((x, y) => y[1] - x[1]).map(([t, v]) => `${t} ${f1(v / rs.length)}`).join(', ')} |`)
  }
}
console.log(out.join('\n'))
