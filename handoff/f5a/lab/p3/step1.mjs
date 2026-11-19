// Phase 3 step 1: the Aerie's swing by outcome, from run1 (seed 2222, N 1000) and the rich run (seed 3333, N 400).
import { load, SHORT, mean, se, f1, f2, pc, seatOf } from '../load.mjs'
const out = []
for (const [dir, label] of [['data', 'run1, seed 2222, N 1000'], ['rich', 'rich, seed 3333, N 400']]) {
  const recs = load(dir, (r) => r.mission === 'classic' && r.pair.includes('bird') && r.pair.length === 2)
  out.push(`\n## ${label}\n`)
  out.push('| pair | set | N | Aerie score | Aerie wiped % | Aerie wins by wipe % | score among no-wipe battles | Aerie lost per battle: fight / volley / blast / spell / morale | lost by round r1..r5 (all causes) | enemy charges into Aerie per battle (made contact %) | round of first enemy charge home (never = 6) | Aerie charges per battle (contact %) | Aerie round of first charge home | enemy charges at Aerie on a deck per battle |')
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
  for (const p of ['squirrel,bird', 'serpent,bird', 'insect,bird']) for (const s of ['classic', 'fortified']) {
    const rs = recs.filter((r) => r.set === s && r.pair.join(',') === p); if (!rs.length) continue
    const F = (r) => seatOf(r, 'bird')
    const y = rs.map((r) => (r.win === -1 ? 0.5 : r.win === F(r) ? 1 : 0))
    const wiped = (r) => r.why === 'wipe' && r.win !== F(r), wins = (r) => r.why === 'wipe' && r.win === F(r)
    const nw = rs.filter((r) => !wiped(r) && !wins(r)).map((r) => (r.win === -1 ? 0.5 : r.win === F(r) ? 1 : 0))
    const lost = (c) => mean(rs.map((r) => r.kills.filter((k) => k.vs === F(r) && k.cause === c).length))
    const byR = [1, 2, 3, 4, 5].map((n) => mean(rs.map((r) => r.kills.filter((k) => k.vs === F(r) && k.r === n).length)))
    const ec = (r) => r.charges.filter((c) => c.cs !== F(r)), ac = (r) => r.charges.filter((c) => c.cs === F(r))
    const nc = (f) => { const a = rs.flatMap(f); return `${f2(a.length / rs.length)} (${pc(a.filter((c) => c.ok).length / Math.max(1, a.length))})` }
    const first = (f) => mean(rs.map((r) => { const h = f(r).filter((c) => c.ok); return h.length ? Math.min(...h.map((c) => c.r)) : 6 }))
    out.push(`| ${p.split(',').map((x) => SHORT[x]).join('-')} | ${s} | ${rs.length} | ${f1(100 * mean(y))} | ${pc(mean(rs.map((r) => (wiped(r) ? 1 : 0))))} | ${pc(mean(rs.map((r) => (wins(r) ? 1 : 0))))} | ${f1(100 * mean(nw))} (${nw.length}) | ${['fight', 'volley', 'blast', 'spell', 'morale'].map((c) => f1(lost(c))).join(' / ')} | ${byR.map(f1).join(' ')} | ${nc(ec)} | ${f2(first(ec))} | ${nc(ac)} | ${f2(first(ac))} | ${f2(mean(rs.map((r) => ec(r).filter((c) => c.tHigh).length)))} |`)
  }
}
console.log('# Phase 3 step 1: the Aerie\'s swing by outcome (p3/step1.mjs)\n' + out.join('\n'))
