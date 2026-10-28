// The courtesy fog's unit test (F16, DESIGN's F16 notes): present/fog.js is
// pure, and what it decides is what the table shows a seat under the fog.
// Here, in plain Node:
//   1. the units: fogStep over made-up mirrors and sight answers, entry by
//      entry: an enemy seen, then out of sight (its ghost where it last
//      stood, as it then stood), its place seen empty (the ghost gone), seen
//      again (live), fallen in sight (no ghost, counted 0), one fallen out
//      of sight (its ghost kept till its place is seen), the battle over
//      (the fog lifted); fogOpen's live set as an entry plays (an enemy
//      leaving sight a ghost at once, one coming into sight hidden till the
//      entry closes, one seen to fall live to the end), fogView's; no step
//      touching the fog it was handed;
//   2. the scenery: the first step takes the board as it stands; a chunk
//      broken, dropped or added out of sight kept as last seen (fogAsks
//      asks after it, fogStale, fogChunks draws it so: standing, at its old
//      height, not at all) until it is seen (fogReveal names it once);
//   3. the events marked (fogEvents): a hidden enemy's move line and its
//      advance gone, its shot at one of the seat's units shown unnamed
//      ("Unseen", the tray and the line, the rows kept), a fight the seat
//      is in shown in full, a morale test held by the name, a held-back
//      destroyed line by the unit that fell, a template landing out of
//      sight (its explosion, its victims' rows and lines but the seat's
//      own, its scenery line and the scenery's events) and its throw by a
//      hidden shooter, a stale chunk's events (a walk's smashes too, a
//      collapse's unseen drops named apart), lines of nobody's (-1) and of
//      the seat's own kept; and no mark ever touching what the mirror
//      folds (applyEvent over the marked events is the mirror of the
//      raw ones);
//   4. the sight pass on real matches (fogSight, inside the core's
//      preview): over every entry of corpus logs of every board size, the
//      units seen are the brute force over every pair of the core's own
//      sight (with the cache and without), a stand-in for a unit where it
//      stands is seen exactly when the unit is (the ghosts' places), the
//      dice never moved; and the whole pass over each entry folds the
//      marked events to the match (project(G)) at every entry's end.
//      (F9a) One of them a Field battle with War-Carts: a rider is no eye
//      and is seen exactly when its hull is.
//
//   node sim/fog-check.mjs
//
// Exit 0 when every check holds, 1 otherwise.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { PKG } from './oracle/pin.mjs'

const imp = (f) => import(pathToFileURL(join(PKG, f)).href)
const fog = await imp('present/fog.js')
const { project, applyEvent } = await imp('present/mirror.js')
const core = await imp('core/index.js')
const { fogStart, fogStep, fogView, fogOpen, fogAsks, fogStale, fogChunks, fogReveal, fogEvents, fogSight, fogLands } = fog

let bad = 0, checks = 0
const check = (ok, what, why = '') => {
  checks++
  if (!ok) {
    bad++
    console.log(`  FAIL ${what}${why ? `: ${why}` : ''}`)
  }
}
const ids = (s) => [...s].sort((a, b) => a - b).join()
const section = (t) => console.log(t)

// ── Made-up mirrors ─────────────────────────────────────────────────────────
// seat 0's units 1 and 2, seat 1's 10, 11 and 12 (12 a second "Spitters",
// as 11), chunks 5 to 7; `units` overrides per id
const unit = (x, z, alive = 3) => ({ pos: { x, z }, y: 0, r: 1, models: [0, 1, 2].map((k) => ({ w: 1, alive: k < alive, ox: k * 0.5, oz: 0 })), alive, mesmerized: false, engaged: false })
const SIDES = { 1: 0, 2: 0, 10: 1, 11: 1, 12: 1 }
const sideOf = (id) => SIDES[id]
const mirror = ({ units = {}, chunks = {}, stage = 'battle' } = {}) => ({
  units: { 1: unit(-10, 0), 2: unit(-10, 5), 10: unit(10, 0), 11: unit(10, 5), 12: unit(12, 8), ...units },
  chunks: { 5: { alive: true, y: 1 }, 6: { alive: true, y: 1 }, 7: { alive: true, y: 2 }, ...chunks },
  owners: [], vp: [0, 0], round: 1, active: 0, phase: 'move', stage, board: { W: 44, H: 30 },
})
const sees = ({ units = [], places = [], chunks = [], lands = [] } = {}) => ({ units: new Set(units), places: new Set(places), chunks: new Set(chunks), lands })

// ── 1. The units ────────────────────────────────────────────────────────────
section('1. the units: seen, out of sight (a ghost), seen gone, seen again, fallen')
{
  const F0 = fogStart(0)
  check(F0.seat === 0 && !F0.seen.size && !F0.last.size && F0.table === null && !F0.over, 'fogStart: nothing seen, nothing recorded, the scenery not yet taken')
  const M1 = mirror()
  const F1 = fogStep(F0, M1, sideOf, sees({ units: [10] }))
  check(ids(F1.foes) === '10,11,12', 'the foes are the other seat\'s units', ids(F1.foes))
  check(ids(F1.seen) === '10' && F1.last.has(10) && !F1.last.has(11), 'an enemy seen is recorded, one never seen is not', `${ids(F1.seen)} / ${ids(F1.last.keys())}`)
  check(JSON.stringify(F1.last.get(10).pos) === JSON.stringify(M1.units[10].pos) && F1.last.get(10).models.length === 3 && F1.known.get(10) === 3, 'its record is the mirror\'s unit as it stands (place, models, count)')
  check(F1.last.get(10).models !== M1.units[10].models, 'its record copies the models (the mirror folds in place)')
  const v1 = fogView(F1)
  check(ids(v1.hide) === '11,12' && !v1.ghosts.size, 'fogView: the unseen enemies hidden, no ghost for one never seen', `${ids(v1.hide)} / ${ids(v1.ghosts.keys())}`)
  // 10 walks away out of sight; its old place not seen
  const M2 = mirror({ units: { 10: unit(20, 0) } })
  const F2 = fogStep(F1, M2, sideOf, sees())
  const v2 = fogView(F2)
  check(!F2.seen.size && v2.hide.has(10) && v2.ghosts.has(10), 'out of sight: hidden, and its ghost stands', `${ids(v2.hide)} / ${ids(v2.ghosts.keys())}`)
  check(v2.ghosts.get(10).pos.x === 10, 'the ghost stands where it was last seen (x 10), not where it went (x 20)', `${v2.ghosts.get(10).pos.x}`)
  const o2 = fogOpen(F1, F2)
  check(!o2.live.has(10) && o2.hide.has(10) && o2.ghosts.has(10), 'as the entry that took it out of sight plays: hidden at once, its ghost where it stood (its walk away never shown)')
  check(F1.last.size === 1 && ids(F1.seen) === '10', 'the step left the fog it was handed as it was')
  // its place seen empty
  const F3 = fogStep(F2, M2, sideOf, sees({ places: [10] }))
  check(!F3.last.has(10) && !fogView(F3).ghosts.has(10) && F3.known.get(10) === 3, 'its last place seen and empty: the ghost goes (its count as last known kept)')
  // a place seen of a unit seen: no matter
  // seen again
  const F4 = fogStep(F3, M2, sideOf, sees({ units: [10] }))
  check(F4.seen.has(10) && !fogView(F4).hide.has(10) && F4.last.get(10).pos.x === 20, 'seen again: live, recorded where it now stands')
  const o4 = fogOpen(F3, F4)
  check(!o4.live.has(10) && o4.hide.has(10), 'as the entry that brings it into sight plays: hidden till the entry closes')
  // it falls while seen as the entry opened
  const M5 = mirror({ units: { 10: unit(20, 0, 0) } })
  const F5 = fogStep(F4, M5, sideOf, sees())
  check(F5.fell.has(10) && !F5.last.has(10) && F5.known.get(10) === 0, 'fallen in sight (seen as the entry opened): no ghost, counted 0')
  check(fogOpen(F4, F5).live.has(10) && !fogView(F5).hide.has(10), 'as it falls: live to the end (its fall plays), and not veiled as the entry closes')
  // 11: seen, out of sight with its place unseen, then fallen out of sight
  const G1 = fogStep(F0, M1, sideOf, sees({ units: [11] }))
  const G2 = fogStep(G1, mirror({ units: { 11: unit(25, 5, 2) } }), sideOf, sees())
  const G3 = fogStep(G2, mirror({ units: { 11: unit(25, 5, 0) } }), sideOf, sees())
  check(G3.last.has(11) && fogView(G3).ghosts.get(11).alive === 3 && G3.known.get(11) === 3 && !G3.fell.has(11), 'fallen out of sight: its ghost stands as last seen (3 models), its count as last seen')
  const G4 = fogStep(G3, mirror({ units: { 11: unit(25, 5, 0) } }), sideOf, sees({ places: [11] }))
  check(!G4.last.has(11), '…until its place is seen empty')
  // the battle over: lifted
  const L = fogStep(F2, mirror({ stage: 'over', units: { 12: unit(12, 8, 0) } }), sideOf, sees())
  check(L.over && ids(L.seen) === '10,11' && !L.last.size && !fogView(L).hide.size && !fogView(L).ghosts.size, 'the battle over: the fog lifts (every living enemy seen, no ghost, none hidden)', `${ids(L.seen)}`)
  check(fogAsks(L, M1).chunks.length === 0 && !fogAsks(L, M1).places.size, 'a lifted fog asks nothing')
}

// ── 2. The scenery ──────────────────────────────────────────────────────────
section('2. the scenery: as last seen, until seen again')
{
  const F0 = fogStart(0)
  const F1 = fogStep(F0, mirror(), sideOf, sees())
  check(F1.table && F1.table.size === 3 && F1.table.get(7).y === 2, 'the first step takes the board as it stands (both seats see it)')
  check(fogAsks(F1, mirror()).chunks.length === 0, 'nothing changed: no chunk to ask after')
  // chunk 5 broken, 7 dropped, 8 added, all out of sight
  const M2 = mirror({ chunks: { 5: { alive: false, y: 1 }, 7: { alive: true, y: 0.5 }, 8: { alive: true, y: 0.2 } } })
  check(ids(fogAsks(F1, M2).chunks) === '5,7,8', 'fogAsks asks after the chunks broken, dropped and added', ids(fogAsks(F1, M2).chunks))
  const F2 = fogStep(F1, M2, sideOf, sees())
  check(F2.table === F1.table && fogStale(F2, M2, 5) && fogStale(F2, M2, 7) && fogStale(F2, M2, 8) && !fogStale(F2, M2, 6), 'unseen: kept as last seen (stale), the record untouched')
  check(fogReveal(F1, F2).length === 0, 'unseen: nothing revealed')
  const live = [5, 6, 7, 8].map((id) => ({ id, alive: M2.chunks[id].alive, shape: { x: id, y: M2.chunks[id].y, z: 0 }, look: {} }))
  const drawn = fogChunks(live, F2)
  check(drawn[0].alive === true && drawn[1] === live[1] && drawn[2].shape.y === 2 && drawn[2].alive && drawn[3].alive === false, 'fogChunks draws them as last seen: the broken one standing, the dropped one at its old height, the new one not at all, the rest the match\'s own', JSON.stringify(drawn.map((c) => [c.id, c.alive, c.shape.y])))
  check(live[0].alive === false && live[2].shape.y === 0.5, 'fogChunks copies, never touching the match\'s chunks')
  const F3 = fogStep(F2, M2, sideOf, sees({ chunks: [5, 8] }))
  check(ids(fogReveal(F2, F3)) === '5,8' && !fogStale(F3, M2, 5) && !fogStale(F3, M2, 8) && fogStale(F3, M2, 7), 'seen: the gap and the new chunk revealed once, the drop still as last seen', ids(fogReveal(F2, F3)))
  check(F2.table.get(5).alive === true, 'the step copied the record before changing it')
  const F4 = fogStep(F3, M2, sideOf, sees({ chunks: [7] }))
  check(ids(fogReveal(F3, F4)) === '7' && fogReveal(F4, fogStep(F4, M2, sideOf, sees())).length === 0, 'the drop seen: revealed, and nothing more after')
  check(fogChunks(live, null) === live && fogChunks(live, fogStep(F2, { ...M2, stage: 'over' }, sideOf, null)) === live, 'no fog, or the fog lifted: the match\'s own chunks')
}

// ── 3. The events marked ────────────────────────────────────────────────────
section('3. the events marked: lines, trays, rows, templates and the scenery')
{
  const units = [
    { id: 1, side: 0, short: 'Oak Guard', name: 'Oak Guard' }, { id: 2, side: 0, short: 'Nutkin', name: 'Nutkin Slingers' },
    { id: 10, side: 1, short: 'Brute', name: 'Brute' }, { id: 11, side: 1, short: 'Spitters', name: 'Spitters' }, { id: 12, side: 1, short: 'Spitters', name: 'Spitters' },
  ]
  const F0 = fogStep(fogStart(0), mirror(), sideOf, sees({ units: [12] }))
  // an AI turn: the Brute (10, never seen) moves, shoots Oak Guard, a
  // fight with Nutkin, a charge at Nutkin, an advance alone, the morale of
  // both Spitters, a template on Oak Guard and on its own Spitters
  const E = [
    { t: 'phase.start', side: 1, phase: 'move', round: 1 },
    { t: 'focus', x: 0, z: 0 }, { t: 'log', side: 1, html: '<b>Brute</b> move 5.7".', traced: true }, { t: 'unit.move', u: 10, path: [], L: 5.7, speed: 7, fly: false, smashes: [{ s: 1, ev: [{ t: 'terrain.destroy', id: 6, kind: 'block', from: { x: 0, z: 0 }, at: { x: 0, y: 0, z: 0 } }] }], to: { x: 15, z: 0 } }, { t: 'act', tag: 'move' },
    { t: 'focus', x: 0, z: 0 }, { t: 'unit.face', u: 10, tg: 1 }, { t: 'tray.open', title: 'Brute → Oak Guard · Rocks' }, { t: 'volley', u: 10, tg: 1, fx: 'rock', n: 3 }, { t: 'dice', label: 'Hit 4+', dice: [4, 5, 1], need: 4 }, { t: 'unit.slain', u: 1, m: 0, by: 10, dmg: 1 }, { t: 'log', side: 1, html: '<b>Brute</b> shoot Oak Guard: 2 hit, 1 wound, 1 unsaved — <b>1 slain</b>.', traced: true }, { t: 'act', tag: 'shoot' },
    { t: 'unit.face', u: 10, tg: 2 }, { t: 'focus', x: 0, z: 0 }, { t: 'tray.open', title: 'Brute fight Nutkin · Coils' }, { t: 'melee', u: 10, tg: 2, n: 2, hits: 1 }, { t: 'dice', label: 'Hit 3+', dice: [3, 1], need: 3 }, { t: 'log', side: 1, html: '<b>Brute</b> fight Nutkin: 1 hit, 0 wound, 0 unsaved.', traced: true }, { t: 'pause', s: 0.3 },
    { t: 'focus', x: 0, z: 0 }, { t: 'tray.open', title: 'Brute charge Nutkin' }, { t: 'dice', label: 'Charge 6" (2D6)', dice: [3, 4], need: 0, sum: true, pass: true }, { t: 'unit.face', u: 10, tg: 2 }, { t: 'charge.result', u: 10, tg: 2, ok: true }, { t: 'log', side: 1, html: '<b>Brute</b> charge Nutkin — roll 7 vs 6. <b>Contact!</b>', traced: true }, { t: 'act', tag: 'charge' },
    { t: 'tray.open', title: 'Brute — Advance' }, { t: 'dice', label: 'Advance D6', dice: [3], need: 0, sum: true }, { t: 'log', side: 1, html: '<b>Brute</b> advance: +3".', traced: true }, { t: 'pending', k: 'phase', seats: [1] },
  ]
  const E2 = [
    { t: 'phase.start', side: 1, phase: 'morale', round: 1 },
    { t: 'tray.open', title: 'Morale' }, { t: 'dice', label: 'Spitters: D6 + 1 lost vs Ld 7', dice: [2], need: 0 }, { t: 'log', side: 1, html: '<b>Spitters</b> hold firm (3 vs Ld 7).', traced: true },
    { t: 'dice', label: 'Oak Guard: D6 + 1 lost vs Ld 9', dice: [2], need: 0 }, { t: 'log', side: 0, html: '<b>Oak Guard</b> hold firm (3 vs Ld 9).', traced: true },
    { t: 'unit.destroyed', u: 11, by: null }, { t: 'unit.destroyed', u: 2, by: 10 },
    { t: 'log', side: -1, html: 'End of round 1: … Score 1–0.', traced: true, cls: 'big' },
    { t: 'log', side: 1, html: '<b>Spitters</b> are destroyed!', traced: false, cls: 'big' }, { t: 'log', side: 0, html: '<b>Nutkin Slingers</b> are destroyed!', traced: false, cls: 'big' },
    { t: 'round.scored', round: 1, held: [1, 0], vp: [1, 0], owners: [] },
  ]
  // a template from the hidden Brute: aimed at Oak Guard, landing out of
  // sight on Oak Guard and its own Spitters; the scenery it wrecks
  const E3 = [
    { t: 'focus', x: 0, z: 0 }, { t: 'unit.face', u: 10, tg: 1 }, { t: 'tray.open', title: 'Brute → Oak Guard · Boulder' }, { t: 'log', side: 1, html: '<b>Brute</b> fire Boulder at Oak Guard (4+).', traced: true },
    { t: 'blast.aim', x: 0, z: 0, r: 2 }, { t: 'dice', label: 'Hit 4+', dice: [2], need: 4 }, { t: 'dice', label: 'Scatter D6+1', dice: [3], need: 0 }, { t: 'blast.scatter', from: { x: 0, z: 0 }, to: { x: 1, z: 1 }, d: 4 }, { t: 'blast.fire', u: 10, to: { x: 1, z: 1 }, fx: 'rock' },
    { t: 'blast.land', x: 1, z: 1, r: 2, fx: 'rock' },
    { t: 'dice', label: 'Oak Guard: 2 hits · wound 4+', dice: [4, 5], need: 4 }, { t: 'unit.wound', u: 1, m: 1, dmg: 1 }, { t: 'log', side: 1, html: 'Boulder hits Oak Guard: 2 wound, 1 unsaved.', traced: true },
    { t: 'dice', label: '⚠ Spitters: 1 hit · wound 4+', dice: [2], need: 4 }, { t: 'log', side: 1, html: '<b>Friendly fire!</b> Boulder hits Spitters: 0 wound, 0 unsaved.', traced: true },
    { t: 'terrain.destroy', id: 5, kind: 'block', from: { x: 1, z: 1 }, at: { x: 0, y: 0, z: 0 } }, { t: 'terrain.collapse', drops: [{ id: 6, dy: 1 }, { id: 7, dy: 1 }], by: 1 },
    { t: 'log', side: 1, html: '…and 1 piece of scenery is wrecked.', traced: true }, { t: 'act', tag: 'shoot' },
  ]
  const M = mirror({ units: { 2: unit(-10, 5, 0), 11: unit(10, 5, 0) }, chunks: { 5: { alive: false, y: 1 }, 6: { alive: true, y: 0 }, 7: { alive: true, y: 1 } } })
  const hidden = fogStep(F0, M, sideOf, sees({ units: [12], chunks: [7] }))
  const mark = (events, after, lands = []) => fogEvents(events, { seat: 0, before: F0, after, sees: { ...sees({ units: [...after.seen] }), lands }, M, sideOf, units })
  const veil = (out, k) => out[k].veil ?? 'show'
  const A = mark(E, hidden)
  check(veil(A, 2) === 'hide', 'a hidden enemy\'s move line: hidden')
  check(veil(A, 7) === 'anon' && A[7].title === 'Unseen → Oak Guard · Rocks' && veil(A, 9) === 'show' && veil(A, 11) === 'anon' && A[11].html.startsWith('<b>Unseen</b> shoot Oak Guard'), 'its shot at the seat\'s unit: the tray and the line unnamed ("Unseen"), the rows kept', `${A[7].title} | ${A[11].html}`)
  check(veil(A, 15) === 'show' && veil(A, 17) === 'show' && veil(A, 18) === 'show', 'a fight the seat is in: in full (its tray, row and line)')
  check(veil(A, 21) === 'anon' && A[21].title === 'Unseen charge Nutkin' && veil(A, 22) === 'show' && veil(A, 25) === 'anon', 'its charge at the seat\'s unit: unnamed, the roll kept')
  check(veil(A, 27) === 'hide' && veil(A, 28) === 'hide' && veil(A, 29) === 'hide', 'its advance alone (no unit in its events): hidden by the name, every Brute unseen')
  check(veil(A, 0) === 'show' && veil(A, 30) === 'show', 'the phase banner and the stop: never marked')
  check(A[3].smashes[0].ev[0].veil === 'hide' && A[3].smashes[0].ev[0].id === 6 && A[3].u === 10 && A[3].to.x === 15, 'a hidden walker\'s smash: hidden, the walk itself and what the mirror reads untouched')
  const seen = fogStep(F0, M, sideOf, sees({ units: [10, 12], chunks: [5, 6, 7] }))
  const B = mark(E, seen)
  check(B.every((e, k) => e === E[k] || (e.veil === undefined && k === 3)), 'the same entry with the Brute seen as it closes: nothing marked', B.map((e, k) => (e.veil ? `${k}:${e.veil}` : '')).filter(Boolean).join(' '))
  const C = mark(E2, hidden)
  check(veil(C, 2) === 'show' && veil(C, 3) === 'show', 'a morale test held by "Spitters", one of two Spitters seen: shown (by the name)')
  const hidden2 = fogStep(fogStart(0), M, sideOf, sees({ chunks: [7] }))
  const C2 = fogEvents(E2, { seat: 0, before: fogStart(0), after: hidden2, sees: sees(), M, sideOf, units })
  check(veil(C2, 2) === 'hide' && veil(C2, 3) === 'hide' && veil(C2, 4) === 'show' && veil(C2, 5) === 'show', 'held by "Spitters", every Spitters unseen: hidden; the seat\'s own test kept')
  check(veil(C2, 8) === 'show', 'a line of nobody\'s (the round\'s end): kept')
  check(veil(C2, 9) === 'hide' && veil(C2, 10) === 'show', 'held-back destroyed lines by the units that fell, in order: an unseen enemy\'s hidden, the seat\'s own kept')
  const D = mark(E3, hidden, [false])
  check(veil(D, 2) === 'anon' && veil(D, 3) === 'anon' && D[3].html.startsWith('<b>Unseen</b> fire'), 'a hidden shooter\'s template at the seat\'s unit: its tray and fire line unnamed')
  check(veil(D, 4) === 'hide' && veil(D, 7) === 'hide' && veil(D, 8) === 'hide', 'its aim, scatter and throw: hidden (its shooter unseen)')
  check(veil(D, 5) === 'show' && veil(D, 6) === 'show', 'its hit and scatter rows: kept (the seat is shot at)')
  check(veil(D, 9) === 'hide', 'its landing out of sight: no explosion')
  check(veil(D, 10) === 'show' && veil(D, 12) === 'show', 'the seat\'s own unit under it: its wound row and line kept (damage to the seat\'s units always shows)')
  check(veil(D, 13) === 'hide' && veil(D, 14) === 'hide', 'an enemy victim under it, out of sight: its row and line hidden')
  check(veil(D, 15) === 'hide' && veil(D, 16) === 'hide' && D[16].drops.length === 2 && veil(D, 17) === 'hide', 'the scenery it wrecks out of sight: its break and drops play nothing (a chunk seen as the entry closes is brought up to date then: fogReveal), its line hidden')
  const D2 = mark(E3, hidden, [true])
  check(veil(D2, 9) === 'show' && veil(D2, 13) === 'show' && veil(D2, 17) === 'show', 'the same template landing in sight: its explosion, its victims and its scenery line shown')
  check(veil(D2, 15) === 'hide' && D2[16].veil === 'part' && JSON.stringify(D2[16].unseen) === '[6]' && D2[16].drops.length === 2, '…but a chunk stale as the entry closes still plays nothing (the unseen drop of a collapse named apart, its drops untouched)', `${D2[16].veil} ${JSON.stringify(D2[16].unseen)}`)
  // the mirror: marks never touch what it folds
  const fold = (events) => {
    const m = mirror({ units: { 2: unit(-10, 5, 1) } })
    for (const e of events) applyEvent(m, e)
    return JSON.stringify(m)
  }
  for (const [name, raw, marked] of [['the AI turn', E, A], ['the morale', E2, C2], ['the template', E3, D]]) check(fold(raw) === fold(marked), `${name}: the marked events fold to the mirror the raw ones do`)
  check(fogEvents(E, { seat: 0, before: { ...hidden, over: true }, after: { ...hidden, over: true }, sees: sees(), M, sideOf, units }) === E, 'a lifted fog marks nothing')
}

// ── 4. The sight pass, on real matches ─────────────────────────────────────
section('4. the sight pass on corpus battles: the core\'s own sight, entry by entry')
{
  // ((F9a) and a Field battle with War-Carts, a hull wrecked with riders
  // aboard: a rider is no eye, and is seen exactly when its hull is)
  const logs = ['sim/baselines/human/bushtail-random-6.json', 'sim/baselines/fort/hotseat-aggressive-climb-8.json', 'sim/baselines/scale/hotseat-aggressive-field-1.json', 'sim/baselines/scale/hotseat-pilot-grand-1.json', 'sim/baselines/vehicle/bushtail-random-bail-41.json']
  for (const file of logs) {
    const log = JSON.parse(readFileSync(join(PKG, file), 'utf8'))
    const G = core.createMatch(log.setup, { out: [] })
    const cache = new Map()
    const Fs = [fogStart(0), fogStart(1)]
    let entries = 0, pairs = 0, hiddenSeen = 0, wrong = null, standIn = null, cacheWrong = null, rngMoved = null, mirrorWrong = null, ghosts = 0, riders = 0
    const pass = (events) => {
      entries++
      const M = project(G)
      const side = new Map(G.units.map((u) => [u.id, u.side])), so = (id) => side.get(id)
      for (const seat of [0, 1]) {
        const F = Fs[seat]
        const rng = core.q.rngState(G.rng)
        const ask = { seat, ...fogAsks(F, M), lands: fogLands(events) }
        const got = core.preview(G, (g, q) => fogSight(g, q, ask, seat === 0 ? cache : null))
        if (core.q.rngState(G.rng) !== rng) rngMoved ??= `entry ${entries}`
        // the brute force: every pair, the core's sight ((F9a) over the
        // units on the table; a rider seen with its hull)
        const mine = G.units.filter((u) => u.side === seat && u.alive > 0 && !u.aboard), foes = G.units.filter((u) => u.side !== seat && u.alive > 0 && !u.aboard)
        const want = new Set(foes.filter((e) => mine.some((f) => (pairs++, core.q.sight(G, f, e).visible))).map((e) => e.id))
        for (const u of G.units) if (u.side !== seat && u.alive > 0 && u.aboard && want.has(u.aboard)) (want.add(u.id), riders++)
        if (ids(got.units) !== ids(want)) wrong ??= `entry ${entries}, seat ${seat}: ${ids(got.units)} | ${ids(want)}`
        if (seat === 0) {
          const cold = core.preview(G, (g, q) => fogSight(g, q, ask, null))
          if (ids(cold.units) !== ids(got.units) || ids(cold.places) !== ids(got.places) || ids(cold.chunks) !== ids(got.chunks)) cacheWrong ??= `entry ${entries}`
        }
        hiddenSeen += foes.length - want.size
        // a stand-in for each enemy where it stands, as a ghost's place is
        // asked: seen exactly when the unit is
        const places = new Map(foes.map((e) => [e.id, { pos: { ...e.pos }, r: e.r, models: e.models.map((m) => ({ ...m })) }]))
        const probe = core.preview(G, (g, q) => fogSight(g, q, { seat, places }, null))
        for (const e of foes) if (!want.has(e.id) && probe.places.has(e.id)) standIn ??= `entry ${entries}: unit ${e.id} unseen, its stand-in seen`
        const unseen = core.preview(G, (g, q) => fogSight(g, q, { seat, places: new Map(foes.filter((e) => !want.has(e.id)).map((e) => [e.id, places.get(e.id)])) }, null))
        if (unseen.places.size) standIn ??= `entry ${entries}: ${ids(unseen.places)} unseen, their stand-ins seen`
        // the whole pass: the marked events fold to the match
        const after = fogStep(F, M, so, got)
        ghosts = Math.max(ghosts, fogView(after).ghosts.size)
        const marked = fogEvents(events, { seat, before: F, after, sees: got, M, sideOf: so, units: G.units.map((u) => ({ id: u.id, side: u.side, short: u.t.short, name: u.t.name })) })
        if (seat === 0) {
          const m = Fs.mirror ?? null
          if (m) {
            for (const e of marked) applyEvent(m, e)
            const d = JSON.stringify(m) === JSON.stringify(M)
            if (!d) mirrorWrong ??= `entry ${entries}`
          }
          Fs.mirror = structuredClone(M)
        }
        Fs[seat] = after
      }
    }
    // (the mirror folded from the first entry's table: the match as it
    // stands before the first entry's events would be the backdrop's; from
    // the second entry on, the last entry's projection)
    pass(G.out.splice(0))
    for (const { s, ...body } of log.entries) {
      core.apply(G, s, body)
      pass(G.out.splice(0))
    }
    check(!wrong, `${file}: over ${entries} entries and both seats, the units seen are the brute force over every pair (${pairs} sight calls; ${hiddenSeen} enemy-entries unseen${riders ? `; ${riders} riders seen with their hulls` : ''})`, wrong)
    check(!cacheWrong, `${file}: the cache answers as a pass without it`, cacheWrong)
    // ((F9a) the War-Cart battle holds riders seen with their hulls, or the
    // rider rule went unchecked)
    if (file.includes('/vehicle/')) check(riders > 0, `${file}: riders were seen with their hulls (${riders} rider-entries)`, 'no rider was ever seen aboard a hull')
    check(!standIn, `${file}: a stand-in for each unseen enemy where it stands is never seen (a ghost's place reads as the unit does)`, standIn)
    check(!rngMoved, `${file}: the dice never moved`, rngMoved)
    check(!mirrorWrong, `${file}: every entry's marked events fold the last entry's mirror to the match (project(G)); ghosts at most ${ghosts}`, mirrorWrong)
  }
}

console.log(bad ? `\nfog-check FAILED: ${bad} of ${checks} checks` : `\nfog-check passed: ${checks} checks (the courtesy fog's units, scenery, marks and sight)`)
process.exit(bad ? 1 : 0)
