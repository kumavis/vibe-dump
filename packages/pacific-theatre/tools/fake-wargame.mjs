#!/usr/bin/env node
// The wargame's fixture (ROUND-3.md §8, engine-3): a scenario on the test box
// in §6's schema, written to test-data/wargames/test-box.json, so the arena
// (src/battle/arena/) is built and tested before content-3's real scenarios
// land. Two small forces: a carrier, a battleship, two destroyers and twelve
// aircraft a side. Plainly test data, nothing here is history. Idempotent:
// run it after fake-data.mjs and fake-battle.mjs, as often as you like.
//
//   node tools/fake-wargame.mjs [--dir test-data]
//
// Beside the scenario it adds, to the fixture (test data, gitignored):
//   - a second destroyer a side to the test box's battle.json (test-dd-a2,
//     test-dd-b2: the box had one a side), on a short track of their own
//     beside their force, with no events, so the record's box replays as
//     before;
//   - the real FM-2, TBM-1C, A6M5 and D3A1 kits copied into the fixture's
//     kits (the fixture's own aircraft kits have no Japanese strike aircraft
//     and no Wildcat), so the fixture's air fight is flown by real aircraft.
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
const battle = J(file)
const src = [{ id: 'test-source-a', where: 'p. 1' }]

// --- a second destroyer a side ---------------------------------------------------------------------------
const twin = (id, of, dLon) => {
  const base = battle.units.find((u) => u.id === of)
  if (!base) throw new Error(`the fixture has no ${of}`)
  battle.units = battle.units.filter((u) => u.id !== id)
  const f0 = base.track?.[0] || battle.units.find((u) => u.side === base.side && u.track?.length)?.track[0]
  battle.units.push({
    id,
    kit: base.kit,
    side: base.side,
    name: `${base.name} (second)`,
    ...(base.ja ? { ja: `${base.ja}二` } : {}),
    track: [{ t: f0?.t ?? '04:00', lonlat: [+(f0.lonlat[0] + dLon).toFixed(4), f0.lonlat[1]], courseDeg: f0.courseDeg ?? 90, speedKn: f0.speedKn ?? 20, precision: 'schematic', source: 'test-source-a' }],
    events: [],
  })
}
twin('test-dd-a2', 'test-dd-a', 0.02)
twin('test-dd-b2', 'test-dd-b', -0.02)
fs.writeFileSync(file, JSON.stringify(battle, null, 1))

// --- the real aircraft kits the fixture's air fight flies --------------------------------------------------------
const kitsFile = path.join(dir, 'kits/aircraft.json')
const fixtureKits = J(kitsFile)
const realKits = J(path.join(pkg, 'public/data/kits/aircraft.json'))
const list = Array.isArray(fixtureKits) ? fixtureKits : fixtureKits.aircraft
for (const id of ['fm-2', 'tbm-1c', 'a6m5', 'd3a1']) {
  const k = realKits.find((x) => x.id === id)
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

// --- the scenario (§6's schema) ---------------------------------------------------------------------------------------------
const scenario = {
  id: 'test-box',
  box: 'test-box',
  title: 'Test: the fixture as a wargame',
  label: 'Test: a wargame played with the fixture’s forces. The record is on the other side of the table.',
  arena: { centre: [+centre[0].toFixed(4), +centre[1].toFixed(4)], radiusM: 3000 },
  durationS: 600,
  sides: {
    japan: {
      name: 'Test Force A',
      first: 'test-bb-a',
      bearingDeg: 345,
      guide: 'test-cv-a',
      screenM: 1100,
      ships: ['test-cv-a', 'test-bb-a', 'test-dd-a', 'test-dd-a2'],
      aircraft: [
        { carrier: 'test-cv-a', kit: 'a6m5', count: 6, profile: 'cap' },
        { carrier: 'test-cv-a', kit: 'd3a1', count: 6, profile: 'dive' },
      ],
      goal: { kind: 'sink', type: 'cv', count: 1, text: 'Test: sink the American carrier before 10:00.' },
      phases: [
        { t: 0, title: 'Test: open fire', goal: { kind: 'hit', type: 'ship', count: 3, withinS: 90 }, text: 'Test: the battleship has the range: three hits on any ship.' },
        { t: 120, title: 'Test: the strike', goal: { kind: 'hit', type: 'cv', count: 1, withinS: 120 }, text: 'Test: the dive bombers go in: a hit on the carrier.' },
        { t: 300, title: 'Test: the destroyers go in', goal: { kind: 'hit', type: 'bb', count: 1, withinS: 120 }, text: 'Test: put a torpedo into the battleship.' },
        { t: 450, title: 'Test: finish it', goal: { kind: 'sink', type: 'ship', count: 1, withinS: 150 }, text: 'Test: sink a ship before the clock runs out.' },
      ],
      admiral: { aggression: 0.65, turnAwayAt: 0.45, launchEveryS: 80, waveGrowth: 0.3 },
    },
    usa: {
      name: 'Test Force B',
      first: 'test-dd-b',
      bearingDeg: 165,
      guide: 'test-cv-b',
      screenM: 1200,
      ships: ['test-cv-b', 'test-bb-b', 'test-dd-b', 'test-dd-b2'],
      aircraft: [
        { carrier: 'test-cv-b', kit: 'fm-2', count: 6, profile: 'cap' },
        { carrier: 'test-cv-b', kit: 'tbm-1c', count: 6, profile: 'torpedo' },
      ],
      goal: { kind: 'survive', type: 'cv', count: 1, text: 'Test: keep the carrier afloat until 10:00.' },
      phases: [
        { t: 0, title: 'Test: break up the strike', goal: { kind: 'shoot-down', type: 'aircraft', count: 2, withinS: 120 }, text: 'Test: shoot down two of the dive bombers.' },
        { t: 150, title: 'Test: the torpedo planes go in', goal: { kind: 'hit', type: 'ship', count: 2, withinS: 120 }, text: 'Test: two hits on their ships.' },
        { t: 330, title: 'Test: the destroyers go in', goal: { kind: 'reach', type: 'dd', count: 1, rangeM: 2500, withinS: 120 }, text: 'Test: a destroyer within 2,500 m of their ships.' },
        { t: 480, title: 'Test: hold on', goal: { kind: 'survive', type: 'cv', count: 1, withinS: 120 }, text: 'Test: the carrier afloat to the end.' },
      ],
      admiral: { aggression: 0.5, turnAwayAt: 0.4, launchEveryS: 75, waveGrowth: 0.3 },
    },
  },
  footnote: 'Test: the fixture has no record; its battle is made up.',
  sources: src,
}
fs.mkdirSync(path.join(dir, 'wargames'), { recursive: true })
fs.writeFileSync(path.join(dir, 'wargames/test-box.json'), JSON.stringify(scenario, null, 1))
console.log(`fake-wargame: test-data/wargames/test-box.json written (the arena at ${scenario.arena.centre.join(', ')}); test-dd-a2 and test-dd-b2 added to the test box; fm-2, tbm-1c, a6m5, d3a1 copied into the fixture's kits`)
