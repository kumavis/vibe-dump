// Natural experiment on the lists: does the fortified set's effect on the focus race grow with the number of
// walking shooter units (the units the AI's +0.25"/inch-of-floor term draws onto decks) in each army?
//   node lists.mjs > lists.md
import { load, SHORT, mean, se, f1, f2, seatOf, focusOf, logit } from './load.mjs'
const { RACES } = await import('/home/user/vibe-dump-wt/f5a/packages/tails-and-scales/data/schema.js')
const recs = load()
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
// walking units whose AI role is shooter or hero or artillery (score.js's high-ground term covers shooter and
// artillery; heroes like company and sit with them), OC > 0
const perchers = (race, counts) => RACES[race].roster.reduce((s, k, i) => { const t = RACES[race].units[k]; return s + ((t.ai === 'shooter') && t.move === 'walk' && t.OC > 0 ? counts[i] : 0) }, 0)
const out = []
out.push('# Lists natural experiment (lists.mjs, run1 data, seed 2222)\n')
out.push('Perchers: a list\'s walking units of AI role `shooter` with OC > 0 (Nutkin, Grenadiers; Spitters; Spinethrowers). Fit: focus score ~ seat + fort + oppP + ownP + fort:oppP + fort:ownP (logits; oppP/ownP centred). A positive fort:oppP says the fortified set helps the focus race more the more perchers its opponent fields.\n')
out.push('| size | pair | mean perchers focus / opp | fort | fort x opp perchers | fort x own perchers | focus score fortified - classic by opp perchers (<= median / > median) |')
out.push('|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const rs = recs.filter((r) => r.mission === m && pairName(r.pair) === p); if (!rs.length) continue
  const fo = focusOf(rs[0].pair), op = rs[0].pair.find((x) => x !== fo)
  const own = (r) => perchers(fo, r.counts[r.pair.indexOf(fo)]), opp = (r) => perchers(op, r.counts[r.pair.indexOf(op)])
  const mo = mean(rs.map(own)), mp = mean(rs.map(opp))
  const X = rs.map((r) => { const f = r.set === 'fortified' ? 1 : 0, a = opp(r) - mp, b = own(r) - mo; return [1, seatOf(r, fo) === 0 ? 1 : -1, f, a, b, f * a, f * b] })
  const F = logit(X, rs.map((r) => fy(r, fo)))
  const med = [...rs.map(opp)].sort((a, b) => a - b)[Math.floor(rs.length / 2)]
  const d = (lo) => { const q = rs.filter((r) => (lo ? opp(r) <= med : opp(r) > med)); const f = q.filter((r) => r.set === 'fortified'), c = q.filter((r) => r.set !== 'fortified'); return `${f1(100 * (mean(f.map((r) => fy(r, fo))) - mean(c.map((r) => fy(r, fo)))))} (${f.length}+${c.length})` }
  const b = (j) => `${f2(F.b[j])} ± ${f2(F.se[j])}`
  out.push(`| ${m} | ${p} (${SHORT[fo]}) | ${f2(mo)} / ${f2(mp)} | ${b(2)} | ${b(5)} | ${b(6)} | ${d(true)} / ${d(false)} |`)
}
console.log(out.join('\n'))
