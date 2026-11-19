// The per-cell tables (sections 1-5 of the brief) from data/*.jsonl.  node agg.mjs > tables.md
import { load, keyOf, SHORT, RACE_OF, modeOf, mean, se, f1, f2, pc } from './load.mjs'
const recs = load()
const cells = new Map()
for (const r of recs) { const k = keyOf(r); if (!cells.has(k)) cells.set(k, []); cells.get(k).push(r) }
const ORDER = ['classic|classic', 'classic|fortified', 'field|open', 'field|fortified', 'grand|open', 'grand|fortified']
const PAIRS = ['B-S', 'B-I', 'B-W', 'S-I', 'S-W', 'I-W']
const keys = [...cells.keys()].sort((a, b) => { const [m1, s1, p1] = a.split('|'), [m2, s2, p2] = b.split('|'); return ORDER.indexOf(m1 + '|' + s1) - ORDER.indexOf(m2 + '|' + s2) || PAIRS.indexOf(p1) - PAIRS.indexOf(p2) })
const label = (k) => { const [m, s, p] = k.split('|'); return `${{ classic: 'Skirm', field: 'Field', grand: 'Grand' }[m]} ${s} ${p}` }

function derive(r) {
  const A = r.mine, B = 1 - r.mine, R = r.rounds.length
  const d = { y: r.y, why: r.why, R, nRaised: r.objs.filter((o) => o.raised).length, open: r.open }
  d.wipeA = r.why === 'wipe' && r.win === B ? 1 : 0 // the first race wiped out
  d.wipeB = r.why === 'wipe' && r.win === A ? 1 : 0
  d.draw = r.win === -1 ? 1 : 0
  const S = [A, B]
  d.vpG = [0, 0]; d.vpR = [0, 0]; d.held = [[], []]; d.first2 = [R + 1, R + 1]; d.first3 = [R + 1, R + 1]
  d.raisedRounds = 0; d.raisedHeld = [0, 0]
  for (const rd of r.rounds) {
    const h = [0, 0]
    for (const o of rd.objs) {
      if (o.raised) d.raisedRounds++
      for (const k of [0, 1]) if (o.owner === S[k]) { h[k]++; if (o.raised) { d.vpR[k]++; d.raisedHeld[k]++ } else d.vpG[k]++ }
    }
    for (const k of [0, 1]) { d.held[k].push(h[k]); if (h[k] >= 2 && d.first2[k] > R) d.first2[k] = rd.r; if (h[k] >= 3 && d.first3[k] > R) d.first3[k] = rd.r }
  }
  d.vpFinal = r.rounds.length ? [r.rounds.at(-1).vp[A], r.rounds.at(-1).vp[B]] : [0, 0]
  // OC by type (counted), split ground/raised; models near a raised objective but out of HIGH
  d.oc = {}; d.near = {}
  for (const rd of r.rounds) for (const o of rd.objs) for (const s of [0, 1]) {
    for (const [t, v] of Object.entries(o.oc[s])) { d.oc[t] ??= { g: 0, r: 0 }; d.oc[t][o.raised ? 'r' : 'g'] += v }
    for (const [t, v] of Object.entries(o.near[s])) d.near[t] = (d.near[t] ?? 0) + v
  }
  // living models per side per round (share of the start)
  const start = [0, 0]
  for (const [t, s, n] of r.roster) start[s === A ? 0 : 1] += n
  d.start = start
  d.alive = r.rounds.map((rd) => { const a = [0, 0]; for (const u of rd.units) a[u[1] === A ? 0 : 1] += u[2]; return [a[0] / start[0], a[1] / start[1]] })
  // losses by cause, per side (k 0 the first race)
  d.lost = [{}, {}]; d.killsBy = {}
  for (const k of r.kills) { const s = k.vs === A ? 0 : 1; d.lost[s][k.cause] = (d.lost[s][k.cause] ?? 0) + 1; if (k.by && k.bs !== k.vs) d.killsBy[k.by] = (d.killsBy[k.by] ?? 0) + 1 }
  d.contact = r.contact ?? R + 1
  d.units = r.rounds.flatMap((rd) => rd.units.map((u) => ({ r: rd.r, t: u[0], s: u[1] === A ? 0 : 1, alive: u[2], deck: u[3], eng: u[4], dmin: u[5], dR: u[6], L: u[7], face: u[8], ch: u[9] })))
  return d
}
const D = new Map(keys.map((k) => [k, cells.get(k).map(derive)]))

const out = []
const P = (s) => out.push(s)
P(`# Tables (probe.mjs, seed 2222, army-sim's score-gate battles)\n`)
P(`Columns are the first race's (A) then the second's (B) where split. N per cell in the first table.\n`)
P(`## 1. Outcome\n`)
P(`| cell | N | A score ± SE | ended by score | A wiped | B wiped | draws | final VP A / B | rounds |`)
P(`|---|---|---|---|---|---|---|---|---|`)
for (const k of keys) { const d = D.get(k), y = d.map((x) => 100 * x.y); P(`| ${label(k)} | ${d.length} | ${f1(mean(y))} ± ${f1(se(y))} | ${pc(mean(d.map((x) => (x.why === 'score' ? 1 : 0))))} | ${pc(mean(d.map((x) => x.wipeA)))} | ${pc(mean(d.map((x) => x.wipeB)))} | ${pc(mean(d.map((x) => x.draw)))} | ${f1(mean(d.map((x) => x.vpFinal[0])))} / ${f1(mean(d.map((x) => x.vpFinal[1])))} | ${f2(mean(d.map((x) => x.R)))} |`) }

P(`\n## 2. The objective story\n`)
P(`Objectives held at each round's end (mean over battles; a battle over early counts 0 after it), VP split ground / raised, raised objectives' holders, first round holding 2 and 3 (mean; never = rounds + 1).\n`)
P(`| cell | raised objs / board | held A r1..r5 | held B r1..r5 | VP A ground / raised | VP B ground / raised | raised obj-rounds held A / B / none | A first 2 / 3 | B first 2 / 3 |`)
P(`|---|---|---|---|---|---|---|---|---|`)
for (const k of keys) {
  const d = D.get(k), Rm = Math.max(...d.map((x) => x.R))
  const hr = (s) => Array.from({ length: Math.min(Rm, 7) }, (_, i) => f2(mean(d.map((x) => x.held[s][i] ?? 0)))).join(' ')
  const rr = d.reduce((s, x) => s + x.raisedRounds, 0), ha = d.reduce((s, x) => s + x.raisedHeld[0], 0), hb = d.reduce((s, x) => s + x.raisedHeld[1], 0)
  P(`| ${label(k)} | ${f2(mean(d.map((x) => x.nRaised)))} | ${hr(0)} | ${hr(1)} | ${f2(mean(d.map((x) => x.vpG[0])))} / ${f2(mean(d.map((x) => x.vpR[0])))} | ${f2(mean(d.map((x) => x.vpG[1])))} / ${f2(mean(d.map((x) => x.vpR[1])))} | ${rr ? `${pc(ha / rr)} / ${pc(hb / rr)} / ${pc(1 - (ha + hb) / rr)}` : '-'} | ${f2(mean(d.map((x) => x.first2[0])))} / ${f2(mean(d.map((x) => x.first3[0])))} | ${f2(mean(d.map((x) => x.first2[1])))} / ${f2(mean(d.map((x) => x.first3[1])))} |`)
}

P(`\n## 3. Who holds: OC-rounds by unit type, per battle (counted OC at round ends; ground / raised), and models standing within 3" of a raised objective but out of HIGH (counts nothing)\n`)
const types = (k) => { const s = new Set(); for (const x of D.get(k)) for (const t of Object.keys(x.oc)) s.add(t); for (const x of D.get(k)) for (const t of Object.keys(x.near)) s.add(t); return [...s].sort((a, b) => (RACE_OF[a] > RACE_OF[b] ? 1 : RACE_OF[a] < RACE_OF[b] ? -1 : a < b ? -1 : 1)) }
P(`| cell | type (mode): OC ground / raised [near-excluded models] … |`)
P(`|---|---|`)
for (const k of keys) {
  const d = D.get(k)
  P(`| ${label(k)} | ${types(k).map((t) => `${t} (${modeOf(t)[0]}): ${f2(mean(d.map((x) => x.oc[t]?.g ?? 0)))} / ${f2(mean(d.map((x) => x.oc[t]?.r ?? 0)))}${mean(d.map((x) => x.near[t] ?? 0)) > 0.005 ? ` [${f2(mean(d.map((x) => x.near[t] ?? 0)))}]` : ''}`).join('; ')} |`)
}

P(`\n## 4. Attrition\n`)
P(`Living models (share of the start) at each round's end; models lost per battle by cause; the round of first contact (a charge home or a fight; never = rounds + 1).\n`)
P(`| cell | alive A r1..r5 | alive B r1..r5 | A lost: volley / blast / spell / fight / morale / other | B lost: same | contact |`)
P(`|---|---|---|---|---|---|`)
const C = ['volley', 'blast', 'spell', 'fight', 'morale', 'other']
for (const k of keys) {
  const d = D.get(k), Rm = Math.min(5, Math.max(...d.map((x) => x.R)))
  const al = (s) => Array.from({ length: Rm }, (_, i) => f2(mean(d.filter((x) => x.alive[i]).map((x) => x.alive[i][s])))).join(' ')
  const lo = (s) => C.map((c) => f1(mean(d.map((x) => (x.lost[s][c] ?? 0) + (c === 'other' ? x.lost[s]['blast?'] ?? 0 : 0))))).join(' / ')
  P(`| ${label(k)} | ${al(0)} | ${al(1)} | ${lo(0)} | ${lo(1)} | ${f2(mean(d.map((x) => x.contact)))} |`)
}
P(`\nKills per battle by the killer's unit type:\n`)
P(`| cell | killer: models slain per battle |`)
P(`|---|---|`)
for (const k of keys) {
  const d = D.get(k), s = {}
  for (const x of d) for (const [t, v] of Object.entries(x.killsBy)) s[t] = (s[t] ?? 0) + v
  P(`| ${label(k)} | ${Object.entries(s).sort((a, b) => b[1] - a[1]).map(([t, v]) => `${t} ${f1(v / d.length)}`).join(', ')} |`)
}

P(`\n## 5. Board facts\n`)
P(`| cell | raised objectives: 0 / 1 / 2 / 3+ boards (%) | centre raised (%) | raised by stair / ladder only / none (% of raised) | raised a ground model can hold (<= HIGH) | clear sight 12" / 18" / 24" (visible 18") |`)
P(`|---|---|---|---|---|---|`)
for (const k of keys) {
  const rs = cells.get(k), d = D.get(k)
  const dist = [0, 1, 2, 3].map((n) => pc(mean(d.map((x) => (n < 3 ? x.nRaised === n : x.nRaised >= 3) ? 1 : 0)))).join(' / ')
  const ro = rs.flatMap((r) => r.objs.filter((o) => o.raised))
  const w = (v) => pc(ro.length ? ro.filter((o) => o.way === v).length / ro.length : NaN)
  P(`| ${label(k)} | ${dist} | ${pc(mean(rs.map((r) => (r.objs[0].raised ? 1 : 0))))} | ${w('stair')} / ${w('ladder')} / ${w('none')} | ${pc(ro.length ? ro.filter((o) => o.groundHolds).length / ro.length : NaN)} | ${[12, 18, 24].map((L) => pc(mean(rs.map((r) => r.open[L].clear)))).join(' / ')} (${pc(mean(rs.map((r) => r.open[18].vis)))}) |`)
}
console.log(out.join('\n'))
