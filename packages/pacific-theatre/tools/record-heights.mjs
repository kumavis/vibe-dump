#!/usr/bin/env node
// The record aircraft's heights: every box, untouched, every group's every aircraft sampled along its
// record plan (record.js planPos, which the sim draws) once a second from its spawn to its loss, its
// landing or its exit, and the lowest height over the sea reported per box, with who and when. Nothing
// flies under 15 m over the sea except a torpedo plane in the last seconds of its drop (the Mark 13 is
// dropped from 15 m, the Type 91 from 20, R4 §3.6 and kits/weapons.json), an aircraft on its carrier's
// deck, or over the water off its field's runway, in the seconds of its take-off or its landing, and one
// falling after its loss. Over land the
// lowest height above the ground is reported too. Exit 1 on a breach.
//
//   node tools/record-heights.mjs              all four boxes
//   node tools/record-heights.mjs midway       some

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { decodeHeights } from './lib/raster.mjs'

const FLOOR = 15 // m over the sea
const DROP = [-8, 10] // s about a torpedo's drop
const DECK = 8 // s after the spawn from a deck, before the landing on one
const FIELD = 30 // s after the take-off from a field, before the landing on one (a runway at the water's edge)

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = path.join(root, 'public/data')
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const { createSim } = await import('../src/battle/sim/index.js')
const { planPos } = await import('../src/battle/sim/record.js')
const { TangentProjection } = await import('../src/geo.js')
const { wrapDeep } = await import('../src/data/load.js')

const J = (p) => JSON.parse(fs.readFileSync(path.join(data, p), 'utf8'))
const list = (v, k) => (Array.isArray(v) ? v : v?.[k] || [])
const kits = { ships: list(J('kits/ships.json'), 'ships'), aircraft: list(J('kits/aircraft.json'), 'aircraft'), weapons: list(J('kits/weapons.json'), 'weapons') }
const boxes = list(J('boxes/manifest.json'), 'boxes').filter((b) => !only.length || only.includes(b.id))
if (!boxes.length) throw new Error(`no such box: ${only.join(', ')}`)

let failed = 0
for (const box of boxes) {
  const proj = new TangentProjection(box.projection)
  const battle = J(box.battle)
  wrapDeep(battle, proj.lon0)
  const img = readPNG(path.join(data, box.height.file))
  const ground = { metres: decodeHeights(img, box.height.scale, box.height.offset), W: img.width, H: img.height, rect: proj.rect(box.bounds), exaggeration: box.exaggeration ?? 1 }
  const sim = createSim(battle, kits, { seed: '', warn: () => {}, ground, proj, exaggeration: box.exaggeration ?? 1 })
  const { record, world, clock } = sim
  const ctx = { motion: record.motion, groups: record.groups }
  const p = { x: 0, y: 0, z: 0 }
  let sea = { h: Infinity }
  let seaAll = { h: Infinity }
  let land = { h: Infinity }
  const breaches = new Map()
  let samples = 0
  for (const g of record.groups) {
    for (const ac of g.aircraft) {
      const legs = ac.plan.legs
      if (!legs.length) continue
      const t0 = ac.spawnT
      const t1 = Math.min(ac.lossT ?? Infinity, Number.isFinite(ac.endT) ? ac.endT : Infinity, legs[legs.length - 1].t1)
      const drops = ac.actions.filter((a) => a.kind === 'drop').map((a) => a.t)
      const fromDeck = g.from >= 0
      const fromField = !fromDeck && !g.enter && !!g.fromSite
      const toDeck = ac.endHow === 'land' && ac.landOn >= 0
      const toField = ac.endHow === 'land' && !(ac.landOn >= 0)
      for (let t = Math.ceil(t0); t <= t1; t++) {
        planPos(ac, t, p, ctx)
        samples++
        const overSea = world.metresAt(p.x, p.z) <= 0
        const h = overSea ? p.y : p.y - world.heightAt(p.x, p.z)
        const who = { h, t, g: g.id, k: ac.k }
        if (!overSea) {
          if (h < land.h) land = who
          continue
        }
        if (h < seaAll.h) seaAll = who
        const exempt = drops.some((td) => t >= td + DROP[0] && t <= td + DROP[1]) || (fromDeck && t < t0 + DECK) || (toDeck && t > t1 - DECK) || (fromField && t < t0 + FIELD) || (toField && t > t1 - FIELD)
        if (exempt) continue
        if (h < sea.h) sea = who
        if (h < FLOOR) {
          const key = `${g.id} #${ac.k}`
          const b = breaches.get(key) || { from: t, to: t, h }
          b.to = t
          b.h = Math.min(b.h, h)
          breaches.set(key, b)
        }
      }
    }
  }
  const L = (w) => (Number.isFinite(w.h) ? `${w.h.toFixed(1)} m at ${clock.label(w.t)}, ${w.g} #${w.k}` : '—')
  if (!samples) {
    console.log(`${box.id}: no aircraft in the record`)
    continue
  }
  console.log(`${box.id}: ${record.groups.length} groups, ${samples} samples; lowest over the sea ${L(sea)}${seaAll.h < sea.h ? ` (${L(seaAll)} in a drop, a take-off or a landing)` : ''}; lowest over land ${L(land)}`)
  for (const [key, b] of breaches) {
    failed++
    console.log(`  BELOW ${FLOOR} m over the sea: ${key} from ${clock.label(b.from)} to ${clock.label(b.to)}, lowest ${b.h.toFixed(1)} m`)
  }
}
if (failed) {
  console.log(`${failed} aircraft under ${FLOOR} m over the sea`)
  process.exit(1)
}
console.log(`no record aircraft under ${FLOOR} m over the sea outside a torpedo drop, a take-off, a landing or a fall`)
