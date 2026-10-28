// playback-check (DESIGN §4.2.9's row; V1): batched playback. The batch
// rule is present/pace.js's (batchAt, batchesOf, playTime), a pure
// function of an event stream, so its checks run here in Node over the
// event streams the corpus battles make (each AI battle as createMatch plays
// it, each human log folded entry by entry) and over AI battles on the
// `grand` mission (F8b: 80×56, the `open` set, each seat its ×3 preset;
// before F8b, the Grand fixture, a patched copy of the code, retired with
// it), and (F8b) over the `scale/` corpus's Field and Grand streams, each
// mission's apart, the Grand ones held to the same budgets:
//   - every batch holds two or more walks of one seat and nothing but walks
//     and instant events (a focus, a pause of 0.2 s or less, objectives,
//     status, act, log, a tray opened, an advance's dice, the match waiting
//     on a seat, a checkpoint: this check's own list, not pace.js's); its
//     walks start at least 0.15 s apart (the spec's, pinned here), and none before the last smash of a wreck before
//     it has played (the walk's timing worked out here again, as
//     view/units.js walks); and the steps cut the stream end to end, in
//     order (the player folds every event in order: nothing is reordered);
//   - each phase plays no longer batched than one at a time;
//   - a Grand AI movement phase plays in 8 s or less, batched (the budget,
//     DESIGN §4.2.1). The report gives an AI movement phase's average and
//     longest, and a battle's, one at a time and batched (the phases the
//     table plays in one go: a phase played here waits on its player
//     between commands), and how many batches run across a human's
//     entries;
//   - (F8b) every attack batch (pace.js's attacksAt: one seat's shots or
//     blows in one tray) holds two or more attacks, each a tray with at
//     least one volley, throw, spell or strike in it, every one by a unit of
//     the batch's seat, and nothing but an attack's own events (this check's
//     list); its attacks start 0.3 s apart at the soonest (the spec's), and
//     none before what the last one waits on has played (a volley 0.35 s, a
//     scatter, a throw, a thornburst or a gaze half a second: worked out
//     here again); it ends before the next unit's opening;
//   - (F8b) a phase whose banner plays brief (briefAt) holds nothing but
//     instant events and pauses, to a next phase, score, stage or end that
//     is in the stream;
//   - (F8b, V1's open budget) a Grand AI battle plays in 200 s or less,
//     batched, as a watched battle plays its banners (a seat not played
//     here: 0.6 s, a phase with nothing in it 0.25 s; PACE.cost's 0.9 s a
//     banner, the online backlog's estimate, is reported beside it).
// --browser also watches a battle in Chromium (?debug&fast, a fresh build):
// it must play batches (the player's count), (F8b) attack batches among
// them and banners brief, and end with no page error, the player's own
// seat lookup must name each unit's seat, and with the HUD's ⇉ off (one at
// a time) a second battle plays none of any.
//
//   node sim/playback-check.mjs [--browser] [--boards N] [--self-test]
//
// --self-test breaks a copy of present/pace.js one way at a time (a batch
// across seats, walks after a wreck let go before its smashes, a charge's
// dice let through, a single walk called a batch, the walks started
// together, a batch swallowing the next unit's opening, its dice taken
// from past its end; (F8b) attacks across seats, a tray with no attack let
// in, attacks started together, a throw not waited on, an attack batch
// swallowing the next unit's opening, a busy phase's banner brief, a phase
// brief before its end is queued, the attacks left unbatched) and expects
// each to be caught. Exit 0 when everything holds.
import { parseArgs } from 'node:util'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadCorpus, buildApp } from './lib.mjs'
import { jobSetup } from './run.mjs'

// A Grand AI battle on `board` with `dice`: the grand mission on its set,
// each seat its race's ×3 preset (by its counts, as a list names it)
const grandSetup = (board, dice) => ({
  board, dice, mission: 'grand', terrain: 'open',
  seats: [{ race: 'squirrel', ctrl: 'ai', army: '336333' }, { race: 'serpent', ctrl: 'ai', army: '336333' }],
})

const PKG = fileURLToPath(new URL('..', import.meta.url))
const { values: a } = parseArgs({ options: { browser: { type: 'boolean' }, boards: { type: 'string' }, 'self-test': { type: 'boolean' } } })
const BUDGET = 8
const STAGGER = 0.15 // the spec's, not the module's
// (F8b) a Grand AI battle's budget, the attacks' spacing and what each kind
// of event holds the next attack back by (the spec's, not the module's)
const BATTLE = 200
const BRISK = 0.3
// ((F19a) a powder keg's fuse, set off inside an attack, as a throw)
// ((V3c) a snare's roots and a spell settling on a friend sit in an attack
// and hold nothing back, as a template's landing)
const HELD = { volley: 0.35, 'blast.scatter': 0.5, 'blast.fire': 0.5, 'keg.fuse': 0.5, 'spell.thorns': 0.5, 'spell.gaze': 0.5 }
const ANCHORS = ['volley', 'blast.fire', 'spell.cast', 'spell.fizzle', 'melee']
// what may sit in an attack (this check's own list)
const inAttack = (e) => [...ANCHORS, 'focus', 'unit.face', 'tray.open', 'blast.aim', 'blast.scatter', 'blast.land', 'keg.fuse', 'spell.thorns', 'spell.fade', 'spell.gaze', 'spell.mesmerized', 'spell.snare', 'spell.ward', 'unit.wound', 'unit.slain', 'unit.formation', 'unit.destroyed', 'terrain.add', 'terrain.hurt', 'terrain.destroy', 'terrain.collapse', 'terrain.rubble', 'objectives', 'status', 'act', 'log', 'check', 'pending'].includes(e.t) || (e.t === 'pause' && (e.s ?? 0) <= 0.3) || (e.t === 'dice' && !/^(Advance|Charge)/.test(e.label ?? ''))

// when a walk's last smash plays (view/units.js's walk: a tween of
// L / speed + 0.15 s, easeInOut, over L + 0.15·speed inches), found here by
// bisection rather than pace.js's inverse
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
function lastSmash(e) {
  if (!e.smashes?.length) return 0
  const speed = e.speed || 6, L = e.L ?? 0, T = L / speed + 0.15, s = Math.max(...e.smashes.map((x) => x.s ?? L))
  let lo = 0, hi = 1
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2
    if (Math.min(L, ease(mid) * (L + speed * 0.15)) >= s) hi = mid
    else lo = mid
  }
  return T * hi
}

// this check's own idea of what may sit inside a batch
const quiet = (e) => ['focus', 'objectives', 'status', 'act', 'log', 'tray.open', 'check', 'pending'].includes(e.t) || (e.t === 'pause' && (e.s ?? 0) <= 0.2) || (e.t === 'dice' && /^Advance/.test(e.label ?? ''))

// the event stream of a battle: an AI battle as createMatch plays it, a
// human log's entries applied one by one
function streamOf(core, setup, entries = []) {
  const G = core.createMatch(setup, { out: [] })
  const events = G.out.splice(0)
  for (const { s, ...body } of entries) {
    core.apply(G, s, body)
    events.push(...G.out.splice(0))
  }
  const side = new Map(G.units.map((u) => [u.id, u.side]))
  return { events, sideOf: (u) => side.get(u) }
}

// the rule's steps over one stream, held to the properties above; adds to
// `acc` each phase's times
function judge(P, { events, sideOf }, acc, name) {
  const steps = P.batchesOf(events, sideOf)
  let at = 0
  for (const b of steps) {
    if (b.from !== at || !(b.to > b.from)) return `${name}: the steps don't cut the stream end to end (a step at ${b.from}–${b.to} after ${at})`
    at = b.to
    if (b.attacks) {
      const why = judgeAttacks(events, sideOf, b, name, acc)
      if (why) return why
      continue
    }
    if (!b.walks) continue
    acc.batches++
    acc.walks += b.walks.length
    if (b.walks.length < 2) return `${name}: a batch of ${b.walks.length} walk at event ${b.from}`
    const sides = new Set(b.walks.map((j) => sideOf(events[j].u)))
    if (sides.size !== 1) return `${name}: a batch at event ${b.from} walks both seats`
    for (let j = b.from; j < b.to; j++) {
      const e = events[j]
      if (e.t === 'unit.move') {
        if (!b.walks.includes(j)) return `${name}: a walk at event ${j} inside a batch but not in it`
      } else if (!quiet(e)) return `${name}: a ${e.t}${e.label ? ` (${e.label})` : ''} at event ${j} inside a batch`
    }
    // the walks' starts: PACE.stagger apart, none before an earlier wreck's
    // last smash
    let gate = 0
    for (const [n, j] of b.walks.entries()) {
      const t = b.starts[n]
      if (n && t < b.starts[n - 1] + STAGGER - 1e-9) return `${name}: walks ${n - 1} and ${n} of a batch at event ${b.from} start ${(t - b.starts[n - 1]).toFixed(2)} s apart`
      if (t < gate - 1e-6) return `${name}: walk ${n} of a batch at event ${b.from} starts at ${t.toFixed(2)} s, before an earlier wreck's last smash at ${gate.toFixed(2)} s`
      gate = Math.max(gate, t + lastSmash(events[j]))
      if (lastSmash(events[j]) > 0) acc.wrecks++
    }
    if (events.slice(b.from, b.to).some((e) => e.t === 'pending')) acc.across++
  }
  if (at !== events.length) return `${name}: the steps end at ${at} of ${events.length}`
  // (F8b) every brief banner's phase empty, its end in the stream
  for (let k = 0; k < events.length; k++) {
    if (!P.briefAt(events, k)) continue
    acc.briefs++
    let j = k + 1
    while (j < events.length && !['phase.start', 'round.scored', 'stage', 'game.over'].includes(events[j].t)) {
      const e = events[j++]
      if (!['focus', 'objectives', 'status', 'act', 'log', 'tray.open', 'check', 'pause'].includes(e.t) && !(e.t === 'dice' && /^Advance/.test(e.label ?? ''))) return `${name}: the phase begun at event ${k} plays its banner brief with a ${e.t} in it (event ${j - 1})`
    }
    if (j >= events.length) return `${name}: the phase begun at event ${k} plays its banner brief, its end not in the stream`
  }
  // each phase, one at a time and batched
  let from = 0, kind = 'setup'
  // (a phase played here, by a human, waits on the player between its
  // commands, `pending`: it is timed, never reported, as the table never
  // plays it in one go)
  const close = (to) => {
    const seg = events.slice(from, to)
    const one = P.playTime(seg, sideOf, false), two = P.playTime(seg, sideOf, true)
    if (!seg.some((e) => e.t === 'pending')) (acc.phases[kind] ??= []).push([one, two])
    return two > one + 1e-9 ? `${name}: a ${kind} phase plays longer batched (${two.toFixed(2)} s) than one at a time (${one.toFixed(2)} s)` : null
  }
  for (let i = 0; i < events.length; i++) {
    if (events[i].t !== 'phase.start') continue
    const why = close(i)
    if (why) return why
    from = i
    kind = events[i].phase
  }
  const why = close(events.length)
  if (why) return why
  acc.battles.push([P.playTime(events, sideOf, false), P.playTime(events, sideOf, true), P.playTime(events, sideOf, true, { watched: true })])
  return null
}

// (F8b) an attack batch held to the spec
function judgeAttacks(events, sideOf, b, name, acc) {
  acc.attackBatches++
  acc.attacks += b.attacks.length
  if (b.attacks.length < 2) return `${name}: an attack batch of ${b.attacks.length} at event ${b.from}`
  let side = null
  for (const [n, a] of b.attacks.entries()) {
    if (a.from !== (n ? b.attacks[n - 1].to : b.from) || a.to <= a.from) return `${name}: the attacks of a batch at event ${b.from} don't cut it end to end (attack ${n} at ${a.from}–${a.to})`
    const evs = events.slice(a.from, a.to)
    if (evs.filter((e) => e.t === 'tray.open').length !== 1) return `${name}: attack ${n} of a batch at event ${b.from} holds ${evs.filter((e) => e.t === 'tray.open').length} trays`
    const anchors = evs.filter((e) => ANCHORS.includes(e.t))
    if (!anchors.length) return `${name}: attack ${n} of a batch at event ${b.from} has no volley, throw, spell or strike in it (its tray "${events[a.tray]?.title ?? ''}")`
    for (const e of anchors) {
      side ??= sideOf(e.u)
      if (sideOf(e.u) !== side) return `${name}: a batch at event ${b.from} attacks for both seats (a ${e.t} of unit ${e.u})`
    }
    const odd = evs.find((e) => !inAttack(e))
    if (odd) return `${name}: a ${odd.t}${odd.label ? ` (${odd.label})` : ''} inside attack ${n} of a batch at event ${b.from}`
    if (n) {
      const held = events.slice(b.attacks[n - 1].from, b.attacks[n - 1].to).reduce((s, e) => s + (HELD[e.t] ?? 0), 0)
      const gap = b.starts[n] - b.starts[n - 1]
      if (gap < BRISK - 1e-9) return `${name}: attacks ${n - 1} and ${n} of a batch at event ${b.from} start ${gap.toFixed(2)} s apart, under ${BRISK} s`
      if (gap < held - 1e-9) return `${name}: attack ${n} of a batch at event ${b.from} starts ${gap.toFixed(2)} s after the last, before what that one waits on has played (${held.toFixed(2)} s)`
    }
  }
  const lastEv = events[b.to - 1]
  if (['focus', 'unit.face', 'tray.open'].includes(lastEv.t)) return `${name}: an attack batch at event ${b.from} ends on the next unit's opening (a ${lastEv.t} at ${b.to - 1})`
  if (b.melee) acc.melee++
  return null
}

// The rule on streams made up to hold what the corpus never puts side by
// side: each must cut exactly as `want` says (a batch's walks' indices, or
// none), its every batch also judged as above.
const walk = (u, extra = {}) => ({ t: 'unit.move', u, L: 6, speed: 6, smashes: [], ...extra })
const CASES = [
  ['two seats', [walk(1), { t: 'focus' }, walk(2), { t: 'focus' }, walk(9), walk(10)], [[0, 2], [4, 5]]],
  ["a charge's dice", [walk(1), { t: 'dice', label: 'Charge 2D6', dice: [3, 4] }, walk(2)], []],
  ['a long pause', [walk(1), { t: 'pause', s: 0.5 }, walk(2)], []],
  ['a wound', [walk(1), { t: 'unit.wound', u: 9 }, walk(2), walk(3)], [[2, 3]]],
  ['advance dice', [{ t: 'tray.open' }, { t: 'dice', label: 'Advance D6', dice: [4] }, walk(1), { t: 'tray.open' }, { t: 'dice', label: 'Advance D6', dice: [2] }, walk(2)], [[2, 5]]],
  ['a wreck', [walk(1, { smashes: [{ s: 3 }] }), walk(2), walk(3)], [[0, 1, 2]]],
  ['across entries', [walk(1), { t: 'act' }, { t: 'pending' }, { t: 'log' }, walk(2)], [[0, 4]]],
  ['its end', [walk(1), walk(2), { t: 'objectives', owners: [] }, { t: 'focus' }, { t: 'tray.open' }, { t: 'dice', label: 'Advance D6', dice: [5] }, { t: 'log' }, { t: 'phase.start' }], [[0, 1]]],
]
const SIDE = (u) => (u < 9 ? 0 : 1)

// (F8b) attacks on made-up streams: each must cut as `want` says (each
// batch's attackers, by their anchors' units)
const shot = (u, tg = 9) => [{ t: 'focus' }, { t: 'unit.face', u, tg }, { t: 'tray.open', title: `Shooter ${u} → Target · Slings` }, { t: 'volley', u, tg, fx: 'acorn', n: 6 }, { t: 'dice', label: 'Hit 4+', dice: [2, 5, 6, 1], need: 4 }, { t: 'dice', label: 'Wound 4+', dice: [4, 3], need: 4 }, { t: 'unit.wound', u: tg }, { t: 'pause', s: 0.06 }, { t: 'log' }, { t: 'act' }, { t: 'pause', s: 0.1 }]
const blast = (u) => [{ t: 'focus' }, { t: 'unit.face', u, tg: 9 }, { t: 'tray.open', title: `Thrower ${u} → Target · Pinecone` }, { t: 'blast.aim', x: 1, z: 1, r: 2 }, { t: 'dice', label: 'Hit 5+', dice: [3], need: 5 }, { t: 'dice', label: 'Scatter D6+1', dice: [4] }, { t: 'blast.scatter', from: { x: 1, z: 1 }, to: { x: 3, z: 1 }, d: 5 }, { t: 'blast.fire', u, to: { x: 3, z: 1 } }, { t: 'blast.land', x: 3, z: 1, r: 2 }, { t: 'terrain.destroy', id: 4 }, { t: 'pause', s: 0.25 }, { t: 'act' }, { t: 'pause', s: 0.1 }]
const strike = (u, tg) => [{ t: 'unit.face', u, tg }, { t: 'focus' }, { t: 'tray.open', title: `Brawler ${u} fight Target · Claws` }, { t: 'melee', u, tg }, { t: 'dice', label: 'Hit 3+', dice: [3, 4], need: 3 }, { t: 'unit.slain', u: tg }, { t: 'pause', s: 0.25 }, { t: 'log' }, { t: 'pause', s: 0.3 }]
const ATTACK_CASES = [
  ['two shots', [...shot(1), ...shot(2)], [[1, 2]]],
  ['two seats', [...shot(1), ...shot(9, 1), ...shot(10, 2)], [[9, 10]]],
  ['a morale tray', [...shot(1), { t: 'tray.open', title: 'Morale' }, { t: 'dice', label: 'Nutkin: D6 + 1', dice: [3] }, ...shot(2), ...shot(3)], [[2, 3]]],
  ['a charge', [...shot(1), { t: 'focus' }, { t: 'tray.open', title: 'Raider charge Target' }, { t: 'dice', label: 'Charge 2D6', dice: [3, 4] }, { t: 'charge.result', u: 4, ok: true }, ...shot(2)], []],
  ['a blast', [...shot(1), ...blast(2), ...shot(3)], [[1, 2, 3]]],
  ['a fight', [...strike(10, 1), ...strike(11, 2), ...strike(1, 10)], [[10, 11]]],
  ['its end', [...shot(1), ...shot(2), { t: 'focus' }, { t: 'unit.face', u: 3, tg: 9 }, { t: 'phase.start', phase: 'charge', side: 0 }], [[1, 2]]],
]
const BRIEF_CASES = [
  ['an empty phase', [{ t: 'phase.start' }, { t: 'pause', s: 0.2 }, { t: 'status' }, { t: 'phase.start' }], true],
  ['a phase with a shot', [{ t: 'phase.start' }, ...shot(1), { t: 'phase.start' }], false],
  ['a phase not yet ended', [{ t: 'phase.start' }, { t: 'pause', s: 0.2 }], false],
  ['a phase waiting on its seat', [{ t: 'phase.start' }, { t: 'pending' }, { t: 'phase.start' }], false],
]
function attackRules(P) {
  for (const [what, events, want] of ATTACK_CASES) {
    const got = P.batchesOf(events, SIDE).filter((b) => b.attacks).map((b) => b.attacks.map((a) => events.slice(a.from, a.to).find((e) => ANCHORS.includes(e.t))?.u ?? null))
    if (JSON.stringify(got) !== JSON.stringify(want)) return `the attacks on "${what}": batches ${JSON.stringify(got)}, should be ${JSON.stringify(want)}`
    const why = judge(P, { events, sideOf: SIDE }, fresh(), what)
    if (why) return why
  }
  for (const [what, events, want] of BRIEF_CASES) if (P.briefAt(events, 0) !== want) return `the banner of "${what}" ${want ? 'should play' : 'plays'} brief`
  return null
}
const fresh = () => ({ batches: 0, walks: 0, wrecks: 0, across: 0, attackBatches: 0, attacks: 0, melee: 0, briefs: 0, phases: {}, battles: [] })
function rules(P) {
  for (const [what, events, want] of CASES) {
    const got = P.batchesOf(events, SIDE).filter((b) => b.walks).map((b) => b.walks)
    if (JSON.stringify(got) !== JSON.stringify(want)) return `the rule on "${what}": batches ${JSON.stringify(got)}, should be ${JSON.stringify(want)}`
    const why = judge(P, { events, sideOf: SIDE }, fresh(), what)
    if (why) return why
  }
  const adv = P.batchesOf(CASES[4][1], SIDE).find((b) => b.walks)
  if (JSON.stringify(adv?.dice) !== '[4,2]') return `the rule on "advance dice": the batch's row holds ${JSON.stringify(adv?.dice)}, should be [4,2]`
  const end = P.batchesOf(CASES[7][1], SIDE).find((b) => b.walks)
  if (end?.to !== 3 || end.dice.length) return `the rule on "its end": the batch ends at ${end?.to} with dice ${JSON.stringify(end?.dice)}, should end at 3 (before the next unit's focus) with none`
  return null
}

const avg = (xs) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length)
const fmt = (pairs = []) => !pairs.length ? 'none timed' : `avg ${avg(pairs.map((p) => p[0])).toFixed(1)} → ${avg(pairs.map((p) => p[1])).toFixed(1)} s, longest ${Math.max(...pairs.map((p) => p[0])).toFixed(1)} → ${Math.max(...pairs.map((p) => p[1])).toFixed(1)} s`
// (F8b) a battle's: one at a time, batched, and batched as a watched
// battle plays its banners
const fmt3 = (xs = []) => !xs.length ? 'none timed' : ['avg', 'longest'].map((w) => `${w} ${[0, 1, 2].map((i) => (w === 'avg' ? avg(xs.map((p) => p[i])) : Math.max(...xs.map((p) => p[i]))).toFixed(0)).join(' → ')} s`).join(', ')

async function run(paceDir, { boards = 4, say = console.log } = {}) {
  const P = await import(pathToFileURL(join(paceDir, 'present', 'pace.js')).href)
  const core = await import(pathToFileURL(join(PKG, 'core', 'index.js')).href)
  const bad = []
  const why = rules(P)
  if (why) bad.push(why)
  say(`  ${why ? 'FAIL' : 'ok  '} the rule on ${CASES.length} made-up streams (two seats, a charge's dice, a long pause, a wound, advance dice in one row, a wreck, across entries, where a batch ends)`)
  // (F8b) the attacks and the brief banners on theirs
  const awhy = attackRules(P)
  if (awhy) bad.push(awhy)
  say(`  ${awhy ? 'FAIL' : 'ok  '} (F8b) the attacks on ${ATTACK_CASES.length} made-up streams (two shots, two seats, a morale tray, a charge, a blast, a fight, where a batch ends) and the banners on ${BRIEF_CASES.length}`)
  // classic: the corpus (its classic battles; (F8b) the scale/ corpus's
  // Field and Grand ones below)
  const classic = fresh()
  const corpus = loadCorpus().items.map((it) => ({ it, setup: jobSetup(it.job) }))
  for (const { it, setup } of corpus.filter((c) => (c.setup.mission ?? 'classic') === 'classic')) {
    const why = judge(P, streamOf(core, setup, it.job.entries ?? []), classic, it.id)
    if (why) bad.push(why)
  }
  say(`  ${bad.length ? 'FAIL' : 'ok  '} classic, ${classic.battles.length} corpus battles: ${classic.batches} batches (${(classic.walks / Math.max(1, classic.batches)).toFixed(1)} walks each, ${classic.wrecks} wrecks among them, ${classic.across} across a human's entries), every one a seat's walks and instant events, in order, the walks after a wreck held back to its last smash`)
  say(`       an AI's movement phase ${fmt(classic.phases.move)}; a battle ${fmt(classic.battles)}`)
  say(`       (F8b) ${classic.attackBatches} attack batches (${(classic.attacks / Math.max(1, classic.attackBatches)).toFixed(1)} attacks each, ${classic.melee} of strikes), ${classic.briefs} banners brief; a battle one at a time → batched → as watched: ${fmt3(classic.battles)}`)
  // Grand: the grand mission's AI battles, with the presets
  const grand = fresh()
  for (let b = 1; b <= boards; b++) {
    const why = judge(P, streamOf(core, grandSetup(b, 7 + 2 * b)), grand, `Grand board ${b}`)
    if (why) bad.push(why)
  }
  const worst = Math.max(0, ...(grand.phases.move ?? []).map((p) => p[1]))
  if (worst > BUDGET) bad.push(`Grand: a movement phase plays ${worst.toFixed(1)} s batched, over its ${BUDGET} s`)
  // (F8b) the whole battle, watched
  const longest = Math.max(0, ...grand.battles.map((p) => p[2]))
  if (longest > BATTLE) bad.push(`Grand: an AI battle plays ${longest.toFixed(1)} s batched as watched, over its ${BATTLE} s`)
  if (!grand.attackBatches) bad.push('Grand: no attack batch in any battle (the attacks play one at a time)')
  say(`  ${bad.length ? 'FAIL' : 'ok  '} Grand, ${boards} AI battles (the grand mission on open, the ×3 presets): ${grand.batches} batches (${(grand.walks / Math.max(1, grand.batches)).toFixed(1)} walks each, ${grand.wrecks} wrecks among them)`)
  say(`       an AI's movement phase ${fmt(grand.phases.move)} (budget ${BUDGET} s); a battle ${fmt(grand.battles)}`)
  say(`  ${longest > BATTLE || !grand.attackBatches ? 'FAIL' : 'ok  '} (F8b) Grand: ${grand.attackBatches} attack batches (${(grand.attacks / Math.max(1, grand.attackBatches)).toFixed(1)} attacks each, ${grand.melee} of strikes), ${grand.briefs} banners brief; a battle one at a time → batched → as watched: ${fmt3(grand.battles)} (budget ${BATTLE} s, as watched)`)
  // (F8b) the scale/ corpus's streams, each mission's apart: the rule over
  // every one, and a Grand battle's budgets (a movement phase 8 s, an AI
  // battle 200 s as watched) over its AI pairs' and its human logs' AI
  // phases (a human seat's phases wait on their player: never timed)
  for (const name of [...new Set(corpus.map((c) => c.setup.mission ?? 'classic'))].filter((m) => m !== 'classic')) {
    const acc = fresh(), ai = fresh()
    const these = corpus.filter((c) => c.setup.mission === name)
    for (const { it, setup } of these) {
      const stream = streamOf(core, setup, it.job.entries ?? [])
      const why = judge(P, stream, acc, it.id)
      if (why) bad.push(why)
      else if (it.kind === 'ai') judge(P, stream, ai, it.id)
    }
    const fails = []
    if (name === 'grand') {
      const worstMove = Math.max(0, ...(acc.phases.move ?? []).map((p) => p[1]))
      if (worstMove > BUDGET) fails.push(`scale/ ${name}: a movement phase plays ${worstMove.toFixed(1)} s batched, over its ${BUDGET} s`)
      const longestAi = Math.max(0, ...ai.battles.map((p) => p[2]))
      if (longestAi > BATTLE) fails.push(`scale/ ${name}: an AI battle plays ${longestAi.toFixed(1)} s batched as watched, over its ${BATTLE} s`)
    }
    bad.push(...fails)
    say(`  ${fails.length ? 'FAIL' : 'ok  '} (F8b) the scale/ corpus, ${name}: ${these.length} battles (${these.filter((c) => c.it.kind === 'ai').length} AI pairs): ${acc.batches} batches (${(acc.walks / Math.max(1, acc.batches)).toFixed(1)} walks each), ${acc.attackBatches} attack batches, ${acc.briefs} banners brief`)
    say(`       an AI's movement phase ${fmt(acc.phases.move)}${name === 'grand' ? ` (budget ${BUDGET} s)` : ''}; an AI pair one at a time → batched → as watched: ${fmt3(ai.battles)}${name === 'grand' ? ` (budget ${BATTLE} s, as watched)` : ''}`)
  }
  for (const b of bad.slice(0, 6)) say(`       ${b}`)
  return bad.length ? 1 : 0
}

// the browser: a watched battle batched, then one at a time
async function browser() {
  const { chromium } = await import('playwright')
  const { IDLE_MS } = await import('./chromium.mjs')
  const { startStaticServer } = await import('../../../scripts/static-server.mjs')
  const work = mkdtempSync(join(tmpdir(), 'playback-check-'))
  try {
    const dist = await buildApp(PKG, join(work, 'dist'))
    const { url, close } = await startStaticServer(dist)
    const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
    try {
      const page = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.goto(`${url}/?debug&fast&seed=4242&dice=99`, { timeout: IDLE_MS })
      await page.waitForSelector('#title:not(.hidden)', { timeout: 120000 })
      const watch = async () => {
        await page.click('[data-mode="watch"]')
        await page.click('#setupStart')
        await page.waitForFunction(() => window.__ts.session?.status === 'over' && window.__ts.player.idle, null, { timeout: 600000, polling: 500 })
        return page.evaluate(() => ({ n: window.__ts.player.batches, attacks: window.__ts.player.attackBatches, briefs: window.__ts.player.briefs }))
      }
      const one = await watch()
      // the player's own seat lookup (the rule's in the page)
      const seats = await page.evaluate(() => window.__ts.G.units.every((u) => window.__ts.player.sideOf(u.id) === u.side))
      await page.click('#again')
      await page.waitForSelector('#title:not(.hidden)')
      // (the HUD's ⇉, pressed from the title, under which it sits: the
      // setting is kept for the next battle, which under ?fast plays at once)
      await page.evaluate(() => document.querySelector('#batch').click())
      const before = await page.evaluate(() => ({ n: window.__ts.player.batches, attacks: window.__ts.player.attackBatches, briefs: window.__ts.player.briefs }))
      const after = await watch(), two = { n: after.n - before.n, attacks: after.attacks - before.attacks, briefs: after.briefs - before.briefs }
      const ok = one.n > 0 && one.attacks > 0 && one.briefs > 0 && two.n === 0 && two.attacks === 0 && two.briefs === 0 && seats && !errors.length
      console.log(`  ${ok ? 'ok  ' : 'FAIL'} Chromium: a watched battle played ${one.n} batches (${one.attacks} of attacks) and ${one.briefs} banners brief, the player naming every unit's seat${seats ? '' : ' (IT DID NOT)'}; with ⇉ off (one at a time) the next played ${two.n} (${two.attacks} of attacks) and ${two.briefs} brief${errors.length ? `; page errors: ${errors.slice(0, 3).join('; ')}` : ''}`)
      return ok ? 0 : 1
    } finally {
      await b.close()
      close()
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

const MUTANTS = [
  ['cross-seat', '      if (side !== null && sideOf(e.u) !== side) break', ''],
  ['smash-ungated', '    gate = Math.max(gate, t + smashDone(events[j]))', '    gate = 0'],
  ['charge-dice', "const isAdvanceDice = (e) => e.t === 'dice' && /^Advance/.test(e.label ?? '')", "const isAdvanceDice = (e) => e.t === 'dice'"],
  ['one-walk', '  if (walks.length < 2) return null', '  if (walks.length < 1) return null'],
  ['stagger-0', '  stagger: 0.15,', '  stagger: 0,'],
  ['end-swallows', "    if (walks.length && end === j && !(e.t === 'focus' || e.t === 'tray.open' || isAdvanceDice(e))) end = j + 1", '    if (walks.length && end === j) end = j + 1'],
  ['dice-past-end', '  for (let j = k; j < end; j++) if (isAdvanceDice(events[j]))', '  for (let j = k; j < events.length; j++) if (isAdvanceDice(events[j]))'],
  // (F8b) the attacks and the brief banners
  ['attack-cross-seat', '        if (side !== null && s !== side) ok = false\n', ''],
  ['attack-no-anchor', '    if (!ok || !anchors) break', '    if (!ok) break'],
  ['attack-together', '  brisk: 0.3,', '  brisk: 0,'],
  ['attack-unheld', 'starts[n - 1] + Math.max(PACE.brisk, attacks[n - 1].hold)', 'starts[n - 1] + PACE.brisk'],
  ['attack-swallows', '  while (end > trays.at(-1) + 1 && OPENING.has(events[end - 1].t)) end--\n', ''],
  ['brief-busy', "    if (e.t === 'pending' || !(INSTANT.has(e.t) || e.t === 'pause')) return false", "    if (e.t === 'pending') return false"],
  ['brief-unended', "    if (e.t === 'pending' || !(INSTANT.has(e.t) || e.t === 'pause')) return false\n  }\n  return false", "    if (e.t === 'pending' || !(INSTANT.has(e.t) || e.t === 'pause')) return false\n  }\n  return true"],
  ['attacks-off', '    const b = batchAt(events, k, sideOf) ?? attacksAt(events, k, sideOf) ?? { from: k, to: k + 1 }', '    const b = batchAt(events, k, sideOf) ?? { from: k, to: k + 1 }'],
]

if (a['self-test']) {
  console.log('playback-check self-test: each broken batch rule caught\n')
  let bad = 0
  for (const [name, from, to] of MUTANTS) {
    const dir = mkdtempSync(join(tmpdir(), `playback-${name}-`))
    try {
      cpSync(join(PKG, 'present'), join(dir, 'present'), { recursive: true })
      writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
      const p = join(dir, 'present', 'pace.js'), text = readFileSync(p, 'utf8')
      if (text.split(from).length !== 2) {
        console.log(`  FAIL ${name}: its anchor is not in present/pace.js exactly once (stale mutant)`)
        bad++
        continue
      }
      writeFileSync(p, text.replace(from, () => to))
      const lines = []
      const failed = await run(dir, { boards: 2, say: (l) => lines.push(l) })
      const why = lines.find((l) => /^ {7}\S/.test(l) && !/movement phase|attack batches \(/.test(l))?.trim() ?? ''
      console.log(`  ${failed ? 'ok  ' : 'FAIL'} ${name.padEnd(16)} ${failed ? `caught: ${why.slice(0, 110)}` : 'not caught'}`)
      if (!failed) bad++
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(bad ? `\nplayback-check self-test FAILED: ${bad} problem(s)` : `\nplayback-check self-test passed: ${MUTANTS.length} broken rules, each caught`)
  process.exit(bad ? 1 : 0)
}

console.log('playback-check (V1): batched playback, the batch rule over the corpus and Grand event streams\n')
let failed = await run(PKG, { boards: Number(a.boards) || 4 })
if (a.browser) failed |= await browser()
console.log(failed ? '\nplayback-check FAILED' : '\nplayback-check passed: walks and attacks batch only as the rule says, nothing reordered, every phase plays no longer batched and only an empty one brief; a Grand movement phase and a Grand battle within their budgets')
process.exit(failed)
