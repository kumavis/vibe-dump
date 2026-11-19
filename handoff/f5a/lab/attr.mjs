// Attribution tables: the natural experiments over boards, the objective decomposition, the per-unit-type
// behaviour.  node attr.mjs > attribution.md   (needs data/ and boards/)
import { load, keyOf, SHORT, RACE_OF, modeOf, mean, se, f1, f2, pc, seatOf, focusOf, logit } from './load.mjs'
const recs = load()
const boards = new Map(load('boards').map((b) => [`${b.mission}|${b.set}|${b.pair.join(',')}|${b.i}`, b]))
for (const r of recs) r.b = boards.get(`${r.mission}|${r.set}|${r.pair.join(',')}|${r.i}`)
const out = [], P = (s) => out.push(s)
const SZ = { classic: 'Skirm', field: 'Field', grand: 'Grand' }
const pairName = (p) => p.map((x) => SHORT[x]).join('-')
const groups = (f) => { const m = new Map(); for (const r of recs) { const k = f(r); if (k == null) continue; if (!m.has(k)) m.set(k, []); m.get(k).push(r) } return m }
const fy = (r, race) => (r.win === -1 ? 0.5 : r.win === seatOf(r, race) ? 1 : 0) // race's score
const cellOrder = ['B-S', 'B-I', 'S-I', 'B-W', 'S-W', 'I-W']
const cellsOf = (mission) => cellOrder.filter((p) => recs.some((r) => r.mission === mission && pairName(r.pair) === p))
const setsOf = (m) => (m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified'])
const pick = (m, s, p) => recs.filter((r) => r.mission === m && r.set === s && pairName(r.pair) === p)
const ms = (a) => `${f1(100 * mean(a))} ± ${f1(100 * se(a))}`

P('# Attribution tables (attr.mjs)\n')
P('"focus" is the new race in the pair (the Aerie in I-W; the Serpents in the control pair B-S). Scores are the focus race\'s, in %.\n')

// ── A. the centre piece ────────────────────────────────────────────────────
P('## A. The focus race\'s score by the centre piece (board.mjs centre kind)\n')
for (const m of ['classic', 'field', 'grand']) {
  const kinds = m === 'classic' ? ['tower', 'rockbox', 'open', 'keep'] : ['rockbox', 'open', 'keep']
  P(`### ${SZ[m]}\n`)
  P(`| pair (focus) | set | all | ${kinds.join(' | ')} |`)
  P(`|---|---|---|${kinds.map(() => '---').join('|')}|`)
  for (const p of cellsOf(m)) for (const s of setsOf(m)) {
    const rs = pick(m, s, p); if (!rs.length) continue
    const fo = focusOf(rs[0].pair)
    P(`| ${p} (${SHORT[fo]}) | ${s} | ${ms(rs.map((r) => fy(r, fo)))} (${rs.length}) | ${kinds.map((k) => { const q = rs.filter((r) => r.b?.centre === k); return q.length >= 15 ? `${ms(q.map((r) => fy(r, fo)))} (${q.length})` : q.length ? `(${q.length})` : '' }).join(' | ')} |`)
  }
  P('')
}

// ── B. who holds the centre and the flanks ─────────────────────────────────
P('## B. Objective-rounds held, focus minus opponent, per battle: the centre objective by its piece, and the flank objectives\n')
P('(Each round end, +1 if the focus race holds that objective, -1 if the opponent does. A battle cut short by a wipe counts its rounds played.)\n')
for (const m of ['classic', 'field', 'grand']) {
  const kinds = m === 'classic' ? ['tower', 'rockbox', 'open', 'keep'] : ['rockbox', 'open', 'keep']
  P(`### ${SZ[m]}\n`)
  P(`| pair | set | centre: ${kinds.join(' / ')} | centre held focus / opp / none (%) | flanks (all others), per battle |`)
  P('|---|---|---|---|---|')
  for (const p of cellsOf(m)) for (const s of setsOf(m)) {
    const rs = pick(m, s, p); if (!rs.length) continue
    const fo = focusOf(rs[0].pair)
    const cm = (r) => { const F = seatOf(r, fo); let c = 0; for (const rd of r.rounds) c += rd.objs[0].owner === F ? 1 : rd.objs[0].owner === 1 - F ? -1 : 0; return c }
    const fl = (r) => { const F = seatOf(r, fo); let c = 0; for (const rd of r.rounds) for (const o of rd.objs.slice(1)) c += o.owner === F ? 1 : o.owner === 1 - F ? -1 : 0; return c }
    let hf = 0, ho = 0, hn = 0
    for (const r of rs) { const F = seatOf(r, fo); for (const rd of r.rounds) { const o = rd.objs[0].owner; if (o === F) hf++; else if (o === 1 - F) ho++; else hn++ } }
    const tot = hf + ho + hn
    P(`| ${p} | ${s} | ${kinds.map((k) => { const q = rs.filter((r) => r.b?.centre === k); return q.length >= 15 ? f2(mean(q.map(cm))) : '' }).join(' / ')} | ${pc(hf / tot)} / ${pc(ho / tot)} / ${pc(hn / tot)} | ${f2(mean(rs.map(fl)))} |`)
  }
  P('')
}

// ── C. the swing decomposed by centre piece ────────────────────────────────
P('## C. Each swing (focus score fortified minus classic/open) decomposed by the centre piece\n')
P('swing = keep term + non-keep gap, exactly. Keep term: the fortified keep boards\' share x (their score minus the fortified non-keep boards\'): what the keep adds to the fortified set. Non-keep gap: fortified non-keep boards\' score minus classic\'s (all boards). Same-piece: the fortified-minus-classic difference on boards with the same centre piece (tower, open; rockbox where both have it), weighted by the fortified non-keep mix. Mix: non-keep gap minus same-piece (classic\'s rockbox and the different mix).\n')
P('| size | pair | swing | keep term | non-keep gap | of which same-piece | of which mix |')
P('|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field', 'grand']) for (const p of cellsOf(m)) {
  const [s0, s1] = setsOf(m)
  const c = pick(m, s0, p), f = pick(m, s1, p); if (!c.length || !f.length) continue
  const fo = focusOf(c[0].pair)
  const Y = (q) => mean(q.map((r) => fy(r, fo)))
  const swing = Y(f) - Y(c)
  const fk = f.filter((r) => r.b?.centre === 'keep'), fn = f.filter((r) => r.b?.centre !== 'keep')
  const wk = fk.length / f.length
  const keepTerm = wk * (Y(fk) - Y(fn))
  // same piece: kinds both sets have
  const kinds = ['tower', 'rockbox', 'open'].filter((k) => c.some((r) => r.b?.centre === k) && fn.some((r) => r.b?.centre === k))
  let same = 0, wsum = 0
  for (const k of kinds) { const qc = c.filter((r) => r.b?.centre === k), qf = fn.filter((r) => r.b?.centre === k); if (qc.length < 10 || qf.length < 10) continue; const w = qf.length; same += w * (Y(qf) - Y(qc)); wsum += w }
  same /= wsum
  const gapNK = Y(fn) - Y(c)
  P(`| ${SZ[m]} | ${p} (${SHORT[fo]}) | ${f1(100 * swing)} | ${f1(100 * keepTerm)} | ${f1(100 * gapNK)} | ${f1(100 * same)} | ${f1(100 * (gapNK - same))} |`)
}
P('')

// ── D. regression: the set effect with and without board covariates ───────
P('## D. Logistic fits of the focus race\'s score (pooled over both sets): the set\'s coefficient before and after the board covariates\n')
P('Covariates: seat (+1 focus in seat 0), fort (1 on fortified), keep (centre keep), tower (centre ring), clear18 (inside-zone 18" clear-sight share, centred on its mean), walk detour (mean walk cost / straight line from both zones to the flank objectives, centred). Logits; SEs quasi-binomial.\n')
P('| size | pair | fort alone | fort + centre | keep | tower | fort + centre + clear18 + detour | clear18 (per 0.1) | detour (per 0.1) |')
P('|---|---|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field', 'grand']) for (const p of cellsOf(m)) {
  const rs = recs.filter((r) => r.mission === m && pairName(r.pair) === p && r.b)
  if (rs.length < 50) continue
  const fo = focusOf(rs[0].pair)
  const y = rs.map((r) => fy(r, fo))
  const c18 = mean(rs.map((r) => r.b.open[18].clear))
  const det = (r) => mean(r.b.travel.flatMap((row) => row.slice(1).map((o) => o.walk).filter((x) => x != null)))
  const dm = mean(rs.map(det))
  const seat = (r) => (seatOf(r, fo) === 0 ? 1 : -1)
  const fort = (r) => (r.set === 'fortified' ? 1 : 0)
  const fit = (cols) => logit(rs.map((r) => [1, seat(r), ...cols.map((c) => c(r))]), y)
  const f0 = fit([fort])
  const hasTower = rs.some((r) => r.b.centre === 'tower')
  const ccols = [fort, (r) => (r.b.centre === 'keep' ? 1 : 0), ...(hasTower ? [(r) => (r.b.centre === 'tower' ? 1 : 0)] : [])]
  const f1_ = fit(ccols)
  const f2_ = fit([...ccols, (r) => (r.b.open[18].clear - c18) * 10, (r) => (det(r) - dm) * 10])
  const k = ccols.length + 2
  const b = (F, j) => `${f2(F.b[j])} ± ${f2(F.se[j])}`
  P(`| ${SZ[m]} | ${p} (${SHORT[fo]}) | ${b(f0, 2)} | ${b(f1_, 2)} | ${b(f1_, 3)} | ${hasTower ? b(f1_, 4) : '-'} | ${b(f2_, 2)} | ${b(f2_, k)} | ${b(f2_, k + 1)} |`)
}
P('')

// ── E. sight: ranged losses and openness ───────────────────────────────────
P('## E. H-sight: the focus race\'s models lost to ranged attacks (volley + blast + spell) per battle, before the round of first contact and in all; its score by openness tertile within each set\n')
P('| size | pair | set | ranged losses before contact | all ranged losses | fight losses | focus wiped (%) | opp wiped (%) | score by clear18 tertile low / mid / high | clear18 tertile cut points |')
P('|---|---|---|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field', 'grand']) for (const p of cellsOf(m)) for (const s of setsOf(m)) {
  const rs = pick(m, s, p).filter((r) => r.b); if (!rs.length) continue
  const fo = focusOf(rs[0].pair)
  const F = (r) => seatOf(r, fo)
  const rng = (r, pre) => r.kills.filter((k) => k.vs === F(r) && ['volley', 'blast', 'spell'].includes(k.cause) && (!pre || k.r < (r.contact ?? 99))).length
  const fl = (r) => r.kills.filter((k) => k.vs === F(r) && k.cause === 'fight').length
  const sorted = rs.map((r) => r.b.open[18].clear).sort((a, b) => a - b)
  const t1 = sorted[Math.floor(sorted.length / 3)], t2 = sorted[Math.floor((2 * sorted.length) / 3)]
  const tert = [rs.filter((r) => r.b.open[18].clear < t1), rs.filter((r) => r.b.open[18].clear >= t1 && r.b.open[18].clear < t2), rs.filter((r) => r.b.open[18].clear >= t2)]
  P(`| ${SZ[m]} | ${p} (${SHORT[fo]}) | ${s} | ${f1(mean(rs.map((r) => rng(r, true))))} | ${f1(mean(rs.map((r) => rng(r, false))))} | ${f1(mean(rs.map(fl)))} | ${pc(mean(rs.map((r) => (r.why === 'wipe' && r.win !== F(r) ? 1 : 0))))} | ${pc(mean(rs.map((r) => (r.why === 'wipe' && r.win === F(r) ? 1 : 0))))} | ${tert.map((q) => f1(100 * mean(q.map((r) => fy(r, fo))))).join(' / ')} | ${f2(t1)}, ${f2(t2)} |`)
}
P('')

// ── F. speed ───────────────────────────────────────────────────────────────
P('## F. H-speed: objectives held at the end of round 1 and 2 (focus / opponent), the first round the focus race holds a majority, and VP margin by round\n')
P('| size | pair | set | held r1 focus / opp | held r2 focus / opp | focus holds more than opp at r1 (%) | VP margin (focus - opp) after r1 / r2 / r3 / final |')
P('|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field', 'grand']) for (const p of cellsOf(m)) for (const s of setsOf(m)) {
  const rs = pick(m, s, p); if (!rs.length) continue
  const fo = focusOf(rs[0].pair), F = (r) => seatOf(r, fo)
  const held = (r, i, side) => r.rounds[i] ? r.rounds[i].objs.filter((o) => o.owner === side).length : 0
  const vm = (r, i) => { const rd = r.rounds[Math.min(i, r.rounds.length - 1)]; return rd ? rd.vp[F(r)] - rd.vp[1 - F(r)] : 0 }
  P(`| ${SZ[m]} | ${p} (${SHORT[fo]}) | ${s} | ${f2(mean(rs.map((r) => held(r, 0, F(r)))))} / ${f2(mean(rs.map((r) => held(r, 0, 1 - F(r)))))} | ${f2(mean(rs.map((r) => held(r, 1, F(r)))))} / ${f2(mean(rs.map((r) => held(r, 1, 1 - F(r)))))} | ${pc(mean(rs.map((r) => (held(r, 0, F(r)) > held(r, 0, 1 - F(r)) ? 1 : 0))))} | ${[0, 1, 2, 99].map((i) => f2(mean(rs.map((r) => vm(r, i))))).join(' / ')} |`)
}
P('')

// ── G. reach: charges at units on decks ────────────────────────────────────
P('## G. H-reach: charges by the charger\'s mode, at targets on a deck (floor > STEP) and on the ground (attempts per battle, % that made contact); models lost while on a deck, by cause\n')
P('| size | set | pair | charger side | walk: deck / ground | burrow: deck / ground | fly: deck / ground | focus models lost on a deck: fight / ranged | opp models lost on a deck: fight / ranged |')
P('|---|---|---|---|---|---|---|---|---|')
for (const m of ['classic', 'field', 'grand']) for (const p of cellsOf(m)) {
  const s = 'fortified'
  const rs = pick(m, s, p); if (!rs.length) continue
  const fo = focusOf(rs[0].pair)
  for (const side of ['focus', 'opp']) {
    const isSide = (r, cs) => (side === 'focus' ? cs === seatOf(r, fo) : cs !== seatOf(r, fo))
    const cell = (mode, hi) => { let n = 0, ok = 0; for (const r of rs) for (const c of r.charges) if (isSide(r, c.cs) && (c.mode === mode || (mode === 'walk' && c.mode === 'wreck')) && c.tHigh === hi) { n++; ok += c.ok } return n ? `${f2(n / rs.length)} (${pc(ok / n)})` : '0' }
    const lostDeck = (who, causes) => mean(rs.map((r) => r.kills.filter((k) => (who === 'focus' ? k.vs === seatOf(r, fo) : k.vs !== seatOf(r, fo)) && k.vHigh && causes.includes(k.cause)).length))
    P(`| ${SZ[m]} | ${s} | ${p} (${SHORT[fo]}) | ${side} | ${cell('walk', 1)} / ${cell('walk', 0)} | ${cell('burrow', 1)} / ${cell('burrow', 0)} | ${cell('fly', 1)} / ${cell('fly', 0)} | ${side === 'focus' ? `${f2(lostDeck('focus', ['fight']))} / ${f2(lostDeck('focus', ['volley', 'blast', 'spell']))}` : ''} | ${side === 'focus' ? `${f2(lostDeck('opp', ['fight']))} / ${f2(lostDeck('opp', ['volley', 'blast', 'spell']))}` : ''} |`)
  }
}
P('')

// ── H. what the units do ───────────────────────────────────────────────────
P('## H. H-ai: what each unit type does, per living unit-round (round ends): on a deck, at an objective (centre within 3.5" of one), engaged, idle (moved < 0.5", faced no target, not engaged, not at an objective), mean path moved; OC counted per living model-round, ground / raised; at Skirmish\n')
P('| set | pair | unit (mode) | unit-rounds | on deck % | at objective % | engaged % | idle % | moved" | OC per model-round ground / raised | centre within 5.5" of a raised objective, on the ground % |')
P('|---|---|---|---|---|---|---|---|---|---|---|')
const unitTable = (m, s, p, onlyRace) => {
  const rs = pick(m, s, p); if (!rs.length) return
  const st = {}
  for (const r of rs) for (const rd of r.rounds) {
    const ocT = {}
    for (const o of rd.objs) for (const sd of [0, 1]) for (const [t, v] of Object.entries(o.oc[sd])) { ocT[t] ??= { g: 0, r: 0 }; ocT[t][o.raised ? 'r' : 'g'] += v }
    const models = {}
    for (const u of rd.units) {
      if (!u[2]) continue
      const t = u[0]; if (onlyRace && !onlyRace.includes(RACE_OF[t])) continue
      st[t] ??= { n: 0, deck: 0, atObj: 0, eng: 0, idle: 0, L: 0, models: 0, ocG: 0, ocR: 0, footR: 0 }
      const x = st[t]
      x.n++; x.deck += u[3]; x.eng += u[4]; x.L += u[7]; x.models += u[2]
      const at = u[5] <= 3.5 ? 1 : 0; x.atObj += at
      if (u[7] < 0.5 && !u[8] && !u[4] && !at) x.idle++
      if (u[6] != null && u[6] <= 5.5 && !u[3]) x.footR++
    }
    for (const [t, v] of Object.entries(ocT)) if (st[t] && (!onlyRace || onlyRace.includes(RACE_OF[t]))) { st[t].ocG += v.g; st[t].ocR += v.r }
  }
  for (const [t, x] of Object.entries(st).sort((a, b) => (RACE_OF[a[0]] < RACE_OF[b[0]] ? -1 : RACE_OF[a[0]] > RACE_OF[b[0]] ? 1 : a[0] < b[0] ? -1 : 1))) {
    P(`| ${s} | ${p} | ${t} (${modeOf(t)}) | ${x.n} | ${pc(x.deck / x.n)} | ${pc(x.atObj / x.n)} | ${pc(x.eng / x.n)} | ${pc(x.idle / x.n)} | ${f1(x.L / x.n)} | ${f2(x.ocG / x.models)} / ${f2(x.ocR / x.models)} | ${pc(x.footR / x.n)} |`)
  }
}
for (const p of ['B-I', 'S-I', 'B-W', 'S-W', 'I-W']) for (const s of ['classic', 'fortified']) unitTable('classic', s, p, p === 'I-W' ? ['insect', 'bird'] : ['insect', 'bird', 'squirrel'])
P('')
P('### The same at Field and Grand, the new races\' units and the Gliders\n')
P('| set | pair | unit (mode) | unit-rounds | on deck % | at objective % | engaged % | idle % | moved" | OC per model-round ground / raised | centre within 5.5" of a raised objective, on the ground % |')
P('|---|---|---|---|---|---|---|---|---|---|---|')
for (const m of ['field', 'grand']) for (const p of ['B-W', 'S-I']) for (const s of ['open', 'fortified']) { const before = out.length; unitTable(m, s, p, ['insect', 'bird', 'squirrel']); for (let k = before; k < out.length; k++) out[k] = out[k].replace(`| ${s} |`, `| ${SZ[m]} ${s} |`) }
console.log(out.join('\n'))
