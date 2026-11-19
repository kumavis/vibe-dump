// The wipe channel: how much of each Aerie swing is the change in how often the Aerie is wiped out.
// Counterfactual: classic's wiped share set to fortified's, the moved battles scored at classic's non-wiped rate.
import { load, SHORT, mean, f1, seatOf, focusOf } from './load.mjs'
const recs = load()
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
console.log('| size | pair | focus wiped classic / fortified % | non-wiped score classic / fortified | swing | wipe channel | non-wiped (VP) channel |\n|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const [s0, s1] = m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']
  const c = recs.filter((r) => r.mission === m && r.set === s0 && pairName(r.pair) === p), f = recs.filter((r) => r.mission === m && r.set === s1 && pairName(r.pair) === p)
  const fo = focusOf(c[0].pair)
  const wiped = (r) => r.why === 'wipe' && r.win !== seatOf(r, fo)
  const wc = mean(c.map((r) => (wiped(r) ? 1 : 0))), wf = mean(f.map((r) => (wiped(r) ? 1 : 0)))
  const nc = mean(c.filter((r) => !wiped(r)).map((r) => fy(r, fo))), nf = mean(f.filter((r) => !wiped(r)).map((r) => fy(r, fo)))
  const sw = mean(f.map((r) => fy(r, fo))) - mean(c.map((r) => fy(r, fo)))
  const wch = (wc - wf) * nc
  console.log(`| ${m} | ${p} (${SHORT[fo]}) | ${f1(100 * wc)} / ${f1(100 * wf)} | ${f1(100 * nc)} / ${f1(100 * nf)} | ${f1(100 * sw)} | ${f1(100 * wch)} | ${f1(100 * (sw - wch))} |`)
}
