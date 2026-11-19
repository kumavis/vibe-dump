// The rich run's tables (rich/, probe.mjs --rich, seed 3333): where units stand, which decks, what it costs in OC,
// how far they get by round 1-2, burrowers at the keep's foot, the Aerie's last survivors.  node rich.mjs > rich.md
import { load, SHORT, RACE_OF, modeOf, mean, se, f1, f2, pc, seatOf, focusOf } from './load.mjs'
const recs = load('rich')
const out = [], P = (s) => out.push(s)
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const W = { classic: 40, field: 60, grand: 80 }
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
// unit entries: [t, side, alive, deck, eng, dmin, dR, L, face, ch, chOk, x, z, recipe, oc]
P('# Rich-run tables (rich.mjs; probe.mjs --rich, seed 3333)\n')
P('## R1. Replication: scores on seed 3333 (focus race\'s %)\n')
P('| size | pair | classic/open | fortified | swing |')
P('|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const [s0, s1] = m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']
  const a = recs.filter((r) => r.mission === m && r.set === s0 && pairName(r.pair) === p), b = recs.filter((r) => r.mission === m && r.set === s1 && pairName(r.pair) === p)
  if (!a.length) continue
  const fo = focusOf(a[0].pair)
  const ya = a.map((r) => fy(r, fo)), yb = b.map((r) => fy(r, fo))
  P(`| ${m} | ${p} (${SHORT[fo]}) | ${f1(100 * mean(ya))} ± ${f1(100 * se(ya))} (${a.length}) | ${f1(100 * mean(yb))} ± ${f1(100 * se(yb))} (${b.length}) | ${f1(100 * (mean(yb) - mean(ya)))} |`)
}

P('\n## R2. Where each unit type stands at round ends on the fortified set: share of living unit-rounds on each kind of deck (own rampart, the enemy\'s rampart, the keep, other works), and its OC counted per unit-round on the ground vs on a deck\n')
P('| size | pair | unit (mode, OC) | unit-rounds | ground % | own rampart % | enemy rampart % | keep % | other deck % | OC/unit-round on ground | on a deck | OC forgone per battle (deck-rounds off an objective x ground OC rate) |')
P('|---|---|---|---|---|---|---|---|---|---|---|---|')
const OCT = {}
for (const r of recs) for (const [t, s, n, mv, oc] of r.roster) OCT[t] = oc
const forgone = {} // `${m}|${p}|${race}` -> per battle
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const rs = recs.filter((r) => r.mission === m && r.set === 'fortified' && pairName(r.pair) === p)
  if (!rs.length) continue
  const st = {}
  for (const r of rs) for (const rd of r.rounds) for (const u of rd.units) {
    if (!u[2] || u.length < 15) continue
    const [t, side, , deck, , dmin, , , , , , x, z, rec, oc] = u
    const k = `${RACE_OF[t]}|${t}`
    st[k] ??= { n: 0, g: 0, own: 0, en: 0, keep: 0, oth: 0, ocG: 0, ocD: 0, nD: 0, offObjDeck: 0 }
    const q = st[k]; q.n++
    if (!deck) { q.g++; q.ocG += oc; continue }
    q.nD++; q.ocD += oc
    if (oc === 0) q.offObjDeck++
    if (rec === 'rampart') { if (Math.sign(x) === r.edges[side]) q.own++; else q.en++ } else if (rec === 'keep') q.keep++; else q.oth++
  }
  for (const [k, q] of Object.entries(st).sort()) {
    const [race, t] = k.split('|')
    const rate = q.g ? q.ocG / q.g : 0
    const fg = (q.offObjDeck * rate) / rs.length
    forgone[`${m}|${p}|${race}`] = (forgone[`${m}|${p}|${race}`] ?? 0) + fg
    P(`| ${m} | ${p} | ${t} (${modeOf(t)}, ${OCT[t]}) | ${q.n} | ${pc(q.g / q.n)} | ${pc(q.own / q.n)} | ${pc(q.en / q.n)} | ${pc(q.keep / q.n)} | ${pc(q.oth / q.n)} | ${f2(rate)} | ${q.nD ? f2(q.ocD / q.nD) : '-'} | ${f2(fg)} |`)
  }
}
P('\nOC forgone per battle by race (summed over its unit types), and the race\'s total counted OC-rounds per battle on each set:\n')
P('| size | pair | race | OC forgone on decks (fortified) | counted OC per battle classic/open | fortified |')
P('|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']) {
  const [s0] = m === 'classic' ? ['classic'] : ['open']
  for (const race of ['squirrel', 'serpent', 'insect', 'bird']) {
    const k = `${m}|${p}|${race}`; if (forgone[k] === undefined) continue
    const tot = (s) => { const rs = recs.filter((r) => r.mission === m && r.set === s && pairName(r.pair) === p); return mean(rs.map((r) => { const sd = seatOf(r, race); let x = 0; for (const rd of r.rounds) for (const u of rd.units) if (u[1] === sd && u.length >= 15) x += u[14]; return x })) }
    P(`| ${m} | ${p} | ${SHORT[race]} | ${f2(forgone[k])} | ${f1(tot(s0))} | ${f1(tot('fortified'))} |`)
  }
}

P('\n## R3. How far each unit type gets: distance from its own table edge at the end of round 1 and round 2 (mean over living units), classic/open vs fortified\n')
P('| size | unit (mode) | r1 classic/open | r1 fortified | r2 classic/open | r2 fortified |')
P('|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) {
  const [s0] = m === 'classic' ? ['classic'] : ['open']
  const st = {}
  for (const r of recs.filter((r) => r.mission === m)) for (const rd of r.rounds.slice(0, 2)) for (const u of rd.units) {
    if (!u[2] || u.length < 15) continue
    const d = W[m] / 2 - r.edges[u[1]] * u[11]
    const k = `${RACE_OF[u[0]]}|${u[0]}`
    st[k] ??= {}; const key = `${r.set === 'fortified' ? 'f' : 'c'}${rd.r}`
    ;(st[k][key] ??= []).push(d)
  }
  for (const [k, q] of Object.entries(st).sort()) P(`| ${m} | ${k.split('|')[1]} (${modeOf(k.split('|')[1])}) | ${f1(mean(q.c1 ?? []))} | ${f1(mean(q.f1 ?? []))} | ${f1(mean(q.c2 ?? []))} | ${f1(mean(q.f2 ?? []))} |`)
}

P('\n## R4. Burrowers and the keep: on fortified keep boards, the share of the burrowers\' living round ends within 5.5" of the keep\'s centre (its foot: they can never hold it), against the Hive\'s walkers\n')
P('| size | pair | unit | unit-rounds on keep boards | at the keep\'s foot (ground, centre <= 5.5") % | on the keep % | OC counted per unit-round |')
P('|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-I', 'S-I', 'I-W']) {
  const rs = recs.filter((r) => r.mission === m && r.set === 'fortified' && pairName(r.pair) === p && r.objs[0].raised)
  const st = {}
  for (const r of rs) for (const rd of r.rounds) for (const u of rd.units) {
    if (!u[2] || u.length < 15 || RACE_OF[u[0]] !== 'insect') continue
    const q = (st[u[0]] ??= { n: 0, foot: 0, top: 0, oc: 0 })
    q.n++; q.oc += u[14]
    const d = Math.hypot(u[11], u[12])
    if (!u[3] && d <= 5.5) q.foot++
    if (u[13] === 'keep') q.top++
  }
  for (const [t, q] of Object.entries(st).sort()) P(`| ${m} | ${p} | ${t} (${modeOf(t)}) | ${q.n} | ${pc(q.foot / q.n)} | ${pc(q.top / q.n)} | ${f2(q.oc / q.n)} |`)
}

P('\n## R5. The Aerie\'s last survivors: in battles where the Aerie ends a round with 8 or fewer models, the share of those models on a deck, and how such battles end\n')
P('| size | pair | set | battles reaching <= 8 Aerie models | of their models then, on a deck % | Aerie wiped in them % | Aerie score in them |')
P('|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field']) for (const p of ['B-W', 'S-W', 'I-W']) for (const s of m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']) {
  const rs = recs.filter((r) => r.mission === m && r.set === s && pairName(r.pair) === p); if (!rs.length) continue
  let nb = 0, dm = 0, tm = 0, wiped = 0; const ys = []
  for (const r of rs) {
    const sd = seatOf(r, 'bird')
    const rd = r.rounds.find((rd) => { const n = rd.units.filter((u) => u[1] === sd).reduce((a, u) => a + u[2], 0); return n > 0 && n <= 8 })
    if (!rd) continue
    nb++
    for (const u of rd.units) if (u[1] === sd && u[2]) { tm += u[2]; if (u[3]) dm += u[2] }
    if (r.why === 'wipe' && r.win !== sd) wiped++
    ys.push(fy(r, 'bird'))
  }
  P(`| ${m} | ${p} | ${s} | ${nb} of ${rs.length} | ${pc(dm / tm)} | ${pc(wiped / nb)} | ${f1(100 * mean(ys))} |`)
}
console.log(out.join('\n'))
