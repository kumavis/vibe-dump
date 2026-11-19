// Phase-2 tables: each variant cell beside its paired baseline (run1, seed 2222, the same first N battles).
//   node p2/p2.mjs > p2/p2tables.md
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { load, SHORT, mean, se, f1, f2, pc, seatOf, focusOf } from '../load.mjs'
const LAB = new URL('..', import.meta.url).pathname
const rd = (f) => readFileSync(f, 'utf8').split('\n').filter(Boolean).map(JSON.parse)
const boards = new Map(load('boards').map((b) => [`${b.mission}|${b.set}|${b.pair.join(',')}|${b.i}`, b]))
const base = new Map() // mission|set|pair -> recs by i
for (const r of load('data', (r) => r.mission === 'classic' || r.mission === 'field' || r.mission === 'grand')) { const k = `${r.mission}|${r.set}|${r.pair.join(',')}`; if (!base.has(k)) base.set(k, new Map()); base.get(k).set(r.i, r) }
const cells = new Map() // variant|mission|set|pair -> recs
const ONLY = process.argv[2] ? process.argv[2].split(',') : null // (phase 3) a few variants only, for memory
for (const f of readdirSync(LAB + 'p2/data').filter((f) => f.endsWith('-2222.jsonl') && (!ONLY || ONLY.includes(f.split('-')[0]) || f.startsWith('base-')))) {
  const v = f.split('-')[0], rs = rd(LAB + 'p2/data/' + f); if (!rs.length) continue
  const r0 = rs[0], k = `${v}|${r0.mission}|${r0.set}|${r0.pair.join(',')}`
  cells.set(k, (cells.get(k) ?? []).concat(rs))
}
// the field B-S baseline lives in p2 (run1 had none)
for (const [k, rs] of cells) if (k.startsWith('base|')) { const kk = k.slice(5); if (!base.has(kk)) base.set(kk, new Map(rs.map((r) => [r.i, r]))) }
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0)
const pn = (p) => p.map((x) => SHORT[x]).join('-')
const SETS = { classic: ['classic', 'fortified'], field: ['open', 'fortified'], grand: ['open', 'fortified'] }
const PERCH = new Set(['Spinethrowers', 'Nutkin', 'Grenadiers', 'Spitters', 'Hivemother', 'Elder', 'Hierophant'])
function stats(rs, race) {
  const F = (r) => seatOf(r, race)
  const y = rs.map((r) => fy(r, race))
  const first = rs.map((r) => r.y) // first race
  const keep = rs.filter((r) => boards.get(`${r.mission}|${r.set}|${r.pair.join(',')}|${r.i}`)?.centre === 'keep')
  const nonkeep = rs.filter((r) => !keep.includes(r))
  const r1lead = mean(rs.map((r) => r.rounds[0] ? r.rounds[0].objs.filter((o) => o.owner === F(r)).length - r.rounds[0].objs.filter((o) => o.owner === 1 - F(r)).length : 0))
  const wiped = mean(rs.map((r) => (r.why === 'wipe' && r.win !== F(r) ? 1 : 0)))
  // perch: walking shooter/hero unit-rounds on a deck, per side
  const perch = (own) => { let n = 0, d = 0; for (const r of rs) for (const x of r.rounds) for (const u of x.units) if (u[2] && PERCH.has(u[0]) && (u[1] === F(r)) === own) { n++; d += u[3] } return n ? d / n : NaN }
  // OC counted per battle by the race at raised objectives
  const ocR = mean(rs.map((r) => { let s = 0; for (const x of r.rounds) for (const o of x.objs) if (o.raised) for (const v of Object.values(o.oc[F(r)])) s += v; return s }))
  // r1 progress of the Delvers (rich only)
  let prog = []
  for (const r of rs) if (r.rounds[0]) for (const u of r.rounds[0].units) if (u[0] === 'Delvers' && u[2] && u.length >= 15) prog.push({ classic: 20, field: 30, grand: 40 }[r.mission] - r.edges[u[1]] * u[11])
  return { n: rs.length, y: mean(y), se: se(y), first: mean(first), keepY: mean(keep.map((r) => fy(r, race))), nonkeepY: mean(nonkeep.map((r) => fy(r, race))), wk: keep.length / rs.length, r1lead, wiped, perchOwn: perch(true), perchOpp: perch(false), ocR, prog: prog.length ? mean(prog) : NaN }
}
const variants = [...new Set([...cells.keys()].map((k) => k.split('|')[0]))].filter((v) => v !== 'base').sort()
const out = ['# Phase-2 tables (p2/p2.mjs)\n', 'Each variant cell is the first N battles of run1\'s stream (seed 2222), so variant and baseline are paired: the same boards, lists and dice. Scores are the first race\'s (the gate\'s) unless marked focus. Targets: EVEN = both sets in 46-54; HOME = the mean of the sets in 46-54 and neither set outside 40-60.\n']
const verdict = (a, b) => `${a >= 46 && a <= 54 && b >= 46 && b <= 54 ? 'EVEN' : '-'} / ${(a + b) / 2 >= 46 && (a + b) / 2 <= 54 && Math.min(a, b) >= 40 && Math.max(a, b) <= 60 ? 'HOME' : '-'}`
for (const v of variants) {
  out.push(`\n## ${v}\n`)
  out.push('| size | pair | N | first-race score set1 / set2 (base) | variant set1 / set2 | Δ paired set1 / set2 | focus swing base → variant | keep term base → var | non-keep gap base → var | focus r1 objective lead set2 base → var | focus wiped set1 / set2 (var) | perch own / opp set2 (var; base) | focus OC at raised set2 base → var | Delvers r1 progress set1 / set2 (var) | target base → var |')
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
  for (const m of ['classic', 'field', 'grand']) for (const p of ['squirrel,serpent', 'squirrel,insect', 'serpent,insect', 'squirrel,bird', 'serpent,bird', 'insect,bird']) {
    const [s1, s2] = SETS[m]
    const V = [s1, s2].map((s) => cells.get(`${v}|${m}|${s}|${p}`))
    if (!V[0] && !V[1]) continue
    const pair = p.split(','), fo = focusOf(pair)
    const Bs = [s1, s2].map((s, k) => V[k] ? V[k].map((r) => base.get(`${m}|${s}|${p}`)?.get(r.i)).filter(Boolean) : null)
    const sv = V.map((q) => q && stats(q, fo)), sb = Bs.map((q) => q && q.length && stats(q, fo))
    const g = (x, k) => (x ? f1(100 * x[k]) : '-')
    const pd = (k) => { if (!V[k] || !Bs[k]?.length) return '-'; const d = V[k].map((r) => r.y - (base.get(`${m}|${[s1, s2][k]}|${p}`).get(r.i)?.y ?? NaN)).filter((x) => !isNaN(x)); return `${f1(100 * mean(d))} ± ${f1(100 * se(d))}` }
    const sw = (s) => (s[0] && s[1] ? f1(100 * (s[1].y - s[0].y)) : '-')
    const kt = (s) => (s[1] ? f1(100 * s[1].wk * (s[1].keepY - s[1].nonkeepY)) : '-')
    const nk = (s) => (s[0] && s[1] ? f1(100 * (s[1].nonkeepY - s[0].y)) : '-')
    const tg = (s) => (s[0] && s[1] ? verdict(100 * s[0].first, 100 * s[1].first) : '-')
    out.push(`| ${m} | ${pn(pair)} (${SHORT[fo]}) | ${sv.map((x) => x?.n ?? 0).join('/')} | ${g(sb[0], 'first')} / ${g(sb[1], 'first')} | ${g(sv[0], 'first')} / ${g(sv[1], 'first')} | ${pd(0)} / ${pd(1)} | ${sw(sb)} → ${sw(sv)} | ${kt(sb)} → ${kt(sv)} | ${nk(sb)} → ${nk(sv)} | ${sb[1] ? f2(sb[1].r1lead) : '-'} → ${sv[1] ? f2(sv[1].r1lead) : '-'} | ${g(sv[0], 'wiped')} / ${g(sv[1], 'wiped')} | ${sv[1] ? `${pc(sv[1].perchOwn)} / ${pc(sv[1].perchOpp)}` : '-'}; ${sb[1] ? `${pc(sb[1].perchOwn)} / ${pc(sb[1].perchOpp)}` : '-'} | ${sb[1] ? f2(sb[1].ocR) : '-'} → ${sv[1] ? f2(sv[1].ocR) : '-'} | ${sv[0] ? f1(sv[0].prog) : '-'} / ${sv[1] ? f1(sv[1].prog) : '-'} | ${tg(sb)} → ${tg(sv)} |`)
  }
}
console.log(out.join('\n'))
