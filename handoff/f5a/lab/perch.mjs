// Within the fortified set (rich data): the focus race's score by how much of each side's OC sits on its own
// rampart at the end of round 1 (OC-weighted model share; before most contact, so close to a deployment fact).
//   node perch.mjs > perch.md
import { load, SHORT, mean, se, f1, f2, seatOf, focusOf, logit } from './load.mjs'
const recs = load('rich', (r) => r.set === 'fortified')
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
const OCT = {}
for (const r of recs) for (const [t, , , , oc] of r.roster) OCT[t] = oc
const share = (r, sd) => { const rd = r.rounds[0]; let a = 0, b = 0; for (const u of rd.units) if (u[1] === sd && u[2] && u.length >= 15) { const w = u[2] * OCT[u[0]]; b += w; if (u[13] === 'rampart' && Math.sign(u[11]) === r.edges[sd]) a += w } return b ? a / b : 0 }
const out = ['# Perch natural experiment (perch.mjs, rich fortified battles, seed 3333)\n', 'OC-weighted share of each side\'s models on its own rampart at round 1\'s end; the focus score by the opponent\'s share (tertiles) and a logistic fit score ~ seat + oppShare + ownShare (per 0.1).\n',
  '| size | pair | mean share focus / opp | focus score by opp share: low / mid / high tertile | opp share (per 0.1) | own share (per 0.1) |', '|---|---|---|---|---|---|']
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const rs = recs.filter((r) => r.mission === m && pairName(r.pair) === p); if (rs.length < 50) continue
  const fo = focusOf(rs[0].pair)
  const own = (r) => share(r, seatOf(r, fo)), opp = (r) => share(r, 1 - seatOf(r, fo))
  const s = rs.map(opp).sort((a, b) => a - b), t1 = s[Math.floor(s.length / 3)], t2 = s[Math.floor((2 * s.length) / 3)]
  const T = [rs.filter((r) => opp(r) < t1), rs.filter((r) => opp(r) >= t1 && opp(r) < t2), rs.filter((r) => opp(r) >= t2)]
  const F = logit(rs.map((r) => [1, seatOf(r, fo) === 0 ? 1 : -1, opp(r) * 10, own(r) * 10]), rs.map((r) => fy(r, fo)))
  out.push(`| ${m} | ${p} (${SHORT[fo]}) | ${f2(mean(rs.map(own)))} / ${f2(mean(rs.map(opp)))} | ${T.map((q) => `${f1(100 * mean(q.map((r) => fy(r, fo))))} (${q.length})`).join(' / ')} | ${f2(F.b[2])} ± ${f2(F.se[2])} | ${f2(F.b[3])} ± ${f2(F.se[3])} |`)
}
console.log(out.join('\n'))
