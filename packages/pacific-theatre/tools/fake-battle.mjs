#!/usr/bin/env node
// Extends Stage 0's box fixture (test-data/boxes/test-box/battle.json, written
// by tools/fake-data.mjs) with the cases the engine needs and the fixture
// does not have (ENGINEERING.md §12: "fake-battle.mjs (engine-owned) may
// extend the box fixture"). Plainly test data, nothing here is history.
// Idempotent: run it after fake-data.mjs, as often as you like.
//
//   node tools/fake-battle.mjs [--dir test-data]
//
// It adds:
//   - kits/weapons.json: a copy of public/data/kits/weapons.json, so the
//     fixture box's guns, torpedoes and bombs fly the real weapons;
//   - the dive group's `attack.reached` and the test carrier's
//     `hangarHazard` (the group rule and the hangar hazard of DATA.md §9);
//   - a night surface action before dawn (the fixture's clock opens at 04:00
//     in zone +12, an hour before the sun): two battleships closing to about
//     8 km, a searchlight, star shells, opening fire, two or three hits, a
//     torpedoes-fired spread, and a moment for the American ship
//     ("test-night-gunnery") taken at 04:26 at ×2.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { TangentProjection } from '../src/geo.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.resolve(here, '..')
const args = process.argv.slice(2)
const dir = path.resolve(pkg, args[args.indexOf('--dir') + 1] && args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'test-data')
const file = path.join(dir, 'boxes/test-box/battle.json')
if (!fs.existsSync(file)) {
  console.error(`${path.relative(pkg, file)} is missing: run node tools/fake-data.mjs first`)
  process.exit(1)
}
const battle = JSON.parse(fs.readFileSync(file, 'utf8'))
const src = [{ id: 'test-source-a', where: 'p. 1' }]
const ADDED = 'test-night-'

// the weapons the kits name
const weapons = path.join(pkg, 'public/data/kits/weapons.json')
fs.copyFileSync(weapons, path.join(dir, 'kits/weapons.json'))

// the group rule's survivors and the carrier's hangar hazard
const vb = battle.groups.find((g) => g.id === 'test-vb')
if (vb) vb.attack.reached = [5, 6]
const cv = battle.units.find((u) => u.id === 'test-cv-a')
if (cv) cv.hangarHazard = [{ t: '04:00', h: 0.3 }, { t: '10:00', h: 0.8 }, { t: '11:00', h: 0.4 }]

// the American task force off the fixture's 900 m island: Stage 0's made-up
// track ran the carrier and her screen over it, which the record's path
// never minds but a ship under the player's helm runs aground on. Each fix
// that puts the force within 6 km of land is moved south until it does not.
{
  const man = JSON.parse(fs.readFileSync(path.join(dir, 'boxes/manifest.json'), 'utf8')).boxes.find((b) => b.id === 'test-box')
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
  const landNear = (lon, lat, r = 6000) => {
    const [x, z] = proj.toWorld([lon, lat])
    for (let a = 0; a < 16; a++) for (const d of [0, r / 2, r]) if (metresAt(x + Math.cos((a * Math.PI) / 8) * d, z + Math.sin((a * Math.PI) / 8) * d) > -12) return true
    return false
  }
  const tf = battle.units.find((u) => u.id === 'test-cv-b')
  let moved = 0
  for (const f of tf?.track || []) {
    let n = 0
    while (landNear(f.lonlat[0], f.lonlat[1]) && n++ < 30) {
      f.lonlat[1] = +(f.lonlat[1] - 0.03).toFixed(4)
      moved++
    }
  }
  if (moved) console.log(`fake-battle: test-cv-b's track moved ${moved} steps south, off the fixture island`)
}

// the night action (replaced whole on every run)
battle.units = battle.units.filter((u) => !u.id.startsWith(ADDED))
battle.moments = battle.moments.filter((m) => !m.id.startsWith(ADDED))
// two columns converging near the box's centre (179.5°E 28°N): about 8 km apart at 04:30
battle.units.push(
  {
    id: 'test-night-bb-us',
    kit: 'test-bb-us',
    side: 'us',
    name: 'Test Battleship N',
    track: [
      { t: '04:00', lonlat: [179.62, 27.9], courseDeg: 300, speedKn: 23, precision: 'schematic', source: 'test-source-a' },
      { t: '05:00', lonlat: [179.3, 28.05], courseDeg: 290, speedKn: 23, precision: 'schematic', source: 'test-source-a' },
      { t: '06:30', lonlat: [178.95, 28.15], courseDeg: 280, speedKn: 18, precision: 'schematic', source: 'test-source-a' },
    ],
    events: [
      { t: '04:27', kind: 'opens-fire', by: 'test-night-bb-us', sources: src },
      { t: '04:27:30', kind: 'starshell', by: 'test-night-bb-us', target: 'test-night-bb-jp', sources: src },
      { t: '04:31', kind: 'starshell', by: 'test-night-bb-us', target: 'test-night-bb-jp', sources: src },
      { t: '04:45', kind: 'ceases-fire', by: 'test-night-bb-us', sources: src },
    ],
  },
  {
    id: 'test-night-bb-jp',
    kit: 'test-bb-jp',
    side: 'jp',
    name: 'Test Battleship M',
    ja: '試験戦艦乙',
    track: [
      { t: '04:00', lonlat: [179.38, 28.21], courseDeg: 160, speedKn: 20, precision: 'schematic', source: 'test-source-a' },
      { t: '05:00', lonlat: [179.52, 27.95], courseDeg: 170, speedKn: 16, precision: 'schematic', source: 'test-source-a' },
      { t: '06:30', lonlat: [179.56, 27.75], courseDeg: 180, speedKn: 10, precision: 'schematic', source: 'test-source-a' },
    ],
    events: [
      { t: '04:26', kind: 'searchlight', by: 'test-night-bb-jp', target: 'test-night-bb-us', sources: src },
      { t: '04:33', kind: 'hit', by: 'test-night-bb-us', count: [2, 3], where: 'amidships', damage: 0.3, sources: src },
      { t: '04:34', kind: 'fire', sources: src },
      { t: '04:36', kind: 'torpedoes-fired', by: 'test-night-bb-jp', count: 4, speedKn: 36, target: 'test-night-bb-us', sources: src },
    ],
  },
)
battle.moments.push({
  id: 'test-night-gunnery',
  title: 'Test: gunnery at night',
  ja: null,
  role: { kind: 'ship', unit: 'test-night-bb-us', side: 'us' },
  t: '04:26',
  durationS: 300,
  timeScale: 2,
  maxTimeScale: 4,
  objective: { kind: 'gunnery', target: 'test-night-bb-jp', text: 'Test: find the test battleship by radar and star shell, and engage.' },
  beats: [{ t: '04:27:00', text: 'Test beat: a searchlight from the test battleship.' }],
  record: { hits: [{ unit: 'test-night-bb-jp', count: [2, 3], window: ['04:30', '04:40'] }] },
  after: { text: 'Test after-card: the record gives two or three hits.', sources: src, tellings: [] },
})
battle.stops = (battle.stops || []).filter((s) => !String(s.text).startsWith('Test stop: the night action'))
battle.stops.unshift({ t: '04:28', text: 'Test stop: the night action before dawn.', camera: { target: 'test-night-bb-jp', bearingDeg: 120, pitch: 0.25, distanceM: 6000 } })
battle.engineFixture = 'tools/fake-battle.mjs'
fs.writeFileSync(file, JSON.stringify(battle, null, 1))
console.log(`fake-battle: ${path.relative(pkg, file)}: ${battle.units.length} units, ${battle.groups.length} groups, ${battle.moments.length} moments (${battle.moments.map((m) => m.id).join(', ')}); kits/weapons.json copied`)
