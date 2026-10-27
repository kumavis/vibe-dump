#!/usr/bin/env node
// The wargame's fixture (ROUND-3.md §8, engine-3): a scenario on the test box
// in §6's schema, with the fields content-3's scenarios add (research/
// content-3.md §2: separationM, headingDeg, formation, firstStation, airborne,
// maxAirborne, the profiles, waveSize, goal weapon/by/types, a reach `by`),
// written to test-data/wargames/test-box.json, so the arena (src/battle/
// arena/) is built and tested before content-3's real scenarios land, and
// tools/check/wargames.mjs holds it as it holds theirs. Two small forces made
// of the test box's own units: a carrier, two battleships and a destroyer a
// side, and fourteen aircraft (Japan) or twelve. Plainly test data, nothing here is
// history. Idempotent: run it after fake-data.mjs and fake-battle.mjs, as
// often as you like (tools/smoke-arena.mjs runs it each time).
//
//   node tools/fake-wargame.mjs [--dir test-data]
//
// Beside the scenario it copies the real FM-2, TBM-1C, SBD-3, A6M5, D3A1 and
// B5N2 kits into the fixture's kits (test data, gitignored: the fixture's own
// aircraft kits have no Japanese strike aircraft and no Wildcat), so the
// fixture's air fight is flown by real aircraft. The box's battle file is
// left as fake-battle.mjs wrote it (an earlier version of this script added
// two destroyers to it; they are taken out again).
// The arena's centre is the open water of the test box nearest its middle
// with no land within 5 km.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { TangentProjection } from '../src/geo.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.resolve(here, '..')
const args = process.argv.slice(2)
const dir = path.resolve(pkg, args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'test-data')
const file = path.join(dir, 'boxes/test-box/battle.json')
if (!fs.existsSync(file)) {
  console.error(`${path.relative(pkg, file)} is missing: run node tools/fake-data.mjs && node tools/fake-battle.mjs first`)
  process.exit(1)
}
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const src = [{ id: 'test-source-a', where: 'p. 1' }]

// --- the battle file as fake-battle.mjs wrote it (the earlier version's two extra destroyers out) ------------------------
const battle = J(file)
const extra = ['test-dd-a2', 'test-dd-b2']
if (battle.units.some((u) => extra.includes(u.id))) {
  battle.units = battle.units.filter((u) => !extra.includes(u.id))
  fs.writeFileSync(file, JSON.stringify(battle, null, 1))
}
const ships = { jp: ['test-cv-a', 'test-bb-a', 'test-night-bb-jp', 'test-dd-a'], us: ['test-cv-b', 'test-bb-b', 'test-night-bb-us', 'test-dd-b'] }
for (const id of [...ships.jp, ...ships.us]) if (!battle.units.some((u) => u.id === id)) throw new Error(`the fixture's battle file has no ${id}: run node tools/fake-battle.mjs`)

// --- the real aircraft kits the fixture's air fight flies --------------------------------------------------------
const kitsFile = path.join(dir, 'kits/aircraft.json')
const fixtureKits = J(kitsFile)
const realKits = J(path.join(pkg, 'public/data/kits/aircraft.json'))
const list = Array.isArray(fixtureKits) ? fixtureKits : fixtureKits.aircraft
const KITS = ['fm-2', 'tbm-1c', 'sbd-3', 'a6m5', 'd3a1', 'b5n2']
for (const id of KITS) {
  const k = (Array.isArray(realKits) ? realKits : realKits.aircraft).find((x) => x.id === id)
  if (!k) throw new Error(`public/data/kits/aircraft.json has no ${id}`)
  const at = list.findIndex((x) => x.id === id)
  if (at >= 0) list[at] = k
  else list.push(k)
}
fs.writeFileSync(kitsFile, JSON.stringify(fixtureKits, null, 1))

// --- the arena's centre: open water nearest the box's middle ---------------------------------------------------------
const man = J(path.join(dir, 'boxes/manifest.json')).boxes.find((b) => b.id === 'test-box')
const img = readPNG(path.join(dir, man.height.file))
const [W, H] = man.size
const proj = new TangentProjection(man.projection)
const rect = proj.rect(man.bounds)
const metresAt = (x, z) => {
  const i = Math.floor(((x - rect.x0) / (rect.x1 - rect.x0)) * W)
  const j = Math.floor(((z - rect.z0) / (rect.z1 - rect.z0)) * H)
  if (i < 0 || j < 0 || i >= W || j >= H) return -4000
  const p = (j * W + i) * img.channels
  return (img.data[p] * 256 + img.data[p + 1]) * man.height.scale + man.height.offset
}
const clear = (x, z) => {
  for (let a = 0; a < 24; a++) for (const d of [0, 1500, 3000, 4000, 5000]) if (metresAt(x + Math.cos((a * Math.PI) / 12) * d, z + Math.sin((a * Math.PI) / 12) * d) > -20) return false
  return true
}
let centre = null
for (let r = 0; r <= 60000 && !centre; r += 2500) {
  for (let a = 0; a < 16 && !centre; a++) {
    const x = Math.cos((a * Math.PI) / 8) * r
    const z = Math.sin((a * Math.PI) / 8) * r
    if (clear(x, z)) centre = proj.toLonLat(x, z)
    if (r === 0) break
  }
}
if (!centre) throw new Error('no open water in the test box for the arena')

// --- the scenario (§6's schema with content-3's fields) ---------------------------------------------------------------------
// The two sides are built nearly alike (each its carrier's sinking for a goal) so the balance band is a test of the arena
// and its admirals, not of the forces: the American side flies an Avenger and a Dauntless fewer and one Avenger up at
// the start against two Kates (the TBM-1C's torpedo sank the Japanese carrier in four games of five otherwise), and
// its admiral turns away at 0.7 of its strength (at 0.5 it met its goal in 16 games of 20); the admirals' numbers are
// what tools/smoke-arena.mjs's band was tuned with (research/engine-3.md §8).
const ADMIRAL = { aggression: 0.6, turnAwayAt: 0.5, launchEveryS: 70, waveGrowth: 0.3, waveSize: 3 }
const scenario = {
  id: 'test-box',
  box: 'test-box',
  title: 'Test: the fixture as a wargame',
  label: 'A wargame played with the real forces. The record is on the other side of the table.',
  arena: { centre: [+centre[0].toFixed(4), +centre[1].toFixed(4)], radiusM: 3000, separationM: 5000, note: 'Test: open water nearest the test box’s middle.' },
  durationS: 600,
  sides: {
    japan: {
      side: 'jp',
      name: 'Test Force A',
      first: 'test-bb-a',
      firstStation: 'main',
      bearingDeg: 345,
      headingDeg: 150,
      guide: 'test-cv-a',
      screenM: 1100,
      ships: ships.jp,
      formation: {
        kind: 'columns',
        intervalM: 450,
        columns: [
          { ships: ['test-bb-a', 'test-cv-a'], atM: [0, 450] },
          { ships: ['test-night-bb-jp'], atM: [700, -200] },
          { ships: ['test-dd-a'], atM: [-700, 400] },
        ],
      },
      aircraft: [
        { carrier: 'test-cv-a', kit: 'a6m5', count: 4, profile: 'cap', airborne: 2 },
        { carrier: 'test-cv-a', kit: 'a6m5', count: 2, profile: 'escort', airborne: 0 },
        { carrier: 'test-cv-a', kit: 'd3a1', count: 4, profile: 'dive', airborne: 0 },
        { carrier: 'test-cv-a', kit: 'b5n2', count: 4, profile: 'torpedo', airborne: 2 },
      ],
      maxAirborne: 12,
      goal: { kind: 'sink', type: 'cv', count: 1, text: 'Test: sink the other carrier before 10:00.' },
      phases: [
        { t: 0, title: 'Test: open fire', goal: { kind: 'hit', type: 'ship', count: 2, withinS: 90, weapon: 'shell' }, text: 'Test: the battleships have the range: two shells into any ship.' },
        { t: 100, title: 'Test: the first strike', goal: { kind: 'hit', type: 'cv', count: 1, withinS: 100, by: 'aircraft' }, text: 'Test: the dive bombers go in: a hit on the carrier.' },
        { t: 210, title: 'Test: the destroyer goes in', goal: { kind: 'reach', type: 'bb', count: 1, withinS: 120, rangeM: 2500, by: 'dd' }, text: 'Test: bring the destroyer within 2,500 m of a battleship.' },
        { t: 340, title: 'Test: break up their strike', goal: { kind: 'shoot-down', type: 'aircraft', count: 3, withinS: 110 }, text: 'Test: shoot down three of their aircraft.' },
        { t: 460, title: 'Test: finish it', goal: { kind: 'hit', type: 'bb', types: ['bb', 'cv'], count: 2, withinS: 130 }, text: 'Test: two more hits on a battleship or the carrier.' },
      ],
      admiral: { ...ADMIRAL, aggression: 0.65 },
    },
    usa: {
      side: 'us',
      name: 'Test Force B',
      first: 'tbm-1c',
      firstStation: 'pilot',
      bearingDeg: 165,
      headingDeg: 330,
      guide: 'test-cv-b',
      screenM: 1100,
      ships: ships.us,
      formation: { kind: 'circle', acrossM: 900, ring: ['test-bb-b', 'test-night-bb-us'], screen: ['test-dd-b'] },
      aircraft: [
        { carrier: 'test-cv-b', kit: 'fm-2', count: 4, profile: 'cap', airborne: 2 },
        { carrier: 'test-cv-b', kit: 'fm-2', count: 2, profile: 'strafe', airborne: 0 },
        { carrier: 'test-cv-b', kit: 'tbm-1c', count: 3, profile: 'torpedo', airborne: 1 },
        { carrier: 'test-cv-b', kit: 'sbd-3', count: 3, profile: 'dive', airborne: 0 },
      ],
      maxAirborne: 12,
      goal: { kind: 'sink', type: 'cv', count: 1, text: 'Test: sink the other carrier before 10:00.' },
      phases: [
        { t: 0, title: 'Test: the torpedo planes go in', goal: { kind: 'hit', type: 'ship', count: 1, withinS: 100, weapon: 'torpedo', by: 'aircraft' }, text: 'Test: put a torpedo into any ship.' },
        { t: 110, title: 'Test: hold on', goal: { kind: 'survive', type: 'cv', count: 1, withinS: 90 }, text: 'Test: keep the carrier afloat.' },
        { t: 210, title: 'Test: the battleships’ duel', goal: { kind: 'hit', type: 'bb', count: 2, withinS: 120, weapon: 'shell', by: 'bb' }, text: 'Test: two battleship shells into a battleship.' },
        { t: 340, title: 'Test: break up their strike', goal: { kind: 'shoot-down', type: 'aircraft', count: 3, withinS: 110 }, text: 'Test: shoot down three of their aircraft.' },
        { t: 460, title: 'Test: the last strike', goal: { kind: 'hit', type: 'cv', count: 2, withinS: 130 }, text: 'Test: two more hits on the carrier.' },
      ],
      admiral: { ...ADMIRAL, turnAwayAt: 0.7 },
    },
  },
  footnote: 'Test: the fixture has no record; its battle is made up.',
  sources: src,
}
fs.mkdirSync(path.join(dir, 'wargames'), { recursive: true })
fs.writeFileSync(path.join(dir, 'wargames/test-box.json'), JSON.stringify(scenario, null, 1))
// (the box's manifest entry names it, as public/data's do: the app loads a box's wargame from there and shows its door)
const manFile = path.join(dir, 'boxes/manifest.json')
const manifest = J(manFile)
const entry = manifest.boxes.find((b) => b.id === 'test-box')
if (entry.wargame !== 'wargames/test-box.json') {
  entry.wargame = 'wargames/test-box.json'
  fs.writeFileSync(manFile, JSON.stringify(manifest, null, 1))
}
console.log(`fake-wargame: test-data/wargames/test-box.json written (the arena at ${scenario.arena.centre.join(', ')}); ${KITS.join(', ')} copied into the fixture's kits`)
