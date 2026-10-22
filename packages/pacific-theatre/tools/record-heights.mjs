#!/usr/bin/env node
// The record aircraft's heights: every box, untouched, every group's every aircraft sampled along its
// record plan (record.js planPos, which the sim draws) every half second from its spawn to its loss, its
// landing or its exit.
//
// Over the sea: the lowest height per box, with who and when. Nothing flies under 15 m over the sea
// except a torpedo plane in the last seconds of its drop (the Mark 13 is dropped from 15 m, the Type 91
// from 20, R4 §3.6 and kits/weapons.json), an aircraft on its carrier's deck, or over the water off its
// field's runway, in the seconds of its take-off or its landing, and one falling after its loss.
//
// Over land: the lowest height above the ground per box, and per aircraft with --each. Nothing flies
// under 60 m above the ground over land (record.js clearGround) except in the 30 s of a take-off from a
// field or a landing at one, and on the shore within 5 s of a release or a drop over the water, where the
// clearance ramps down to the runway's or the drop's height; the lowest there is reported beside.
//
// Exit 1 on a breach of either.
//
//   node tools/record-heights.mjs              all four boxes
//   node tools/record-heights.mjs midway       some
//   node tools/record-heights.mjs --each       and every record aircraft's lowest over land
//   node tools/record-heights.mjs --step 0.25  sample more finely

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { decodeHeights } from './lib/raster.mjs'

const FLOOR = 15 // m over the sea
const DROP = [-8, 10] // s about a torpedo's drop
const DECK = 8 // s after the spawn from a deck, before the landing on one
const FIELD = 30 // s after the take-off from a field, before the landing on one (a runway at the water's edge)
const CLEAR = 60 // m above the ground over land
const SHORE = 5 // s about a release or a drop over the water, where the shore beside it is cleared by less

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = path.join(root, 'public/data')
const args = process.argv.slice(2)
const stepAt = args.indexOf('--step')
const STEP = stepAt >= 0 ? Number(args[stepAt + 1]) : 0.5
const each = args.includes('--each')
const only = args.filter((a, i) => !a.startsWith('--') && (stepAt < 0 || i !== stepAt + 1))
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
let failedLand = 0
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
  let landAll = { h: Infinity }
  const breaches = new Map()
  const landBreaches = new Map()
  const lows = []
  let samples = 0
  let overLand = 0
  for (const g of record.groups) {
    for (const ac of g.aircraft) {
      const legs = ac.plan.legs
      if (!legs.length) continue
      const t0 = ac.spawnT
      const t1 = Math.min(ac.lossT ?? Infinity, Number.isFinite(ac.endT) ? ac.endT : Infinity, legs[legs.length - 1].t1)
      const drops = ac.actions.filter((a) => a.kind === 'drop').map((a) => a.t)
      // the releases and drops over the water, beside which the shore is cleared by less
      const wet = ac.actions
        .filter((a) => a.kind === 'drop' || a.kind === 'release')
        .map((a) => a.t)
        .filter((t) => world.metresAt(planPos(ac, t, p, ctx).x, p.z) <= 0)
      const fromDeck = g.from >= 0
      const fromField = !fromDeck && !g.enter && !!g.fromSite
      const toDeck = ac.endHow === 'land' && ac.landOn >= 0
      const toField = ac.endHow === 'land' && !(ac.landOn >= 0)
      let mine = { h: Infinity }
      for (let t = Math.ceil(t0 / STEP) * STEP; t <= t1; t += STEP) {
        planPos(ac, t, p, ctx)
        samples++
        const overSea = world.metresAt(p.x, p.z) <= 0
        const h = overSea ? p.y : p.y - world.heightAt(p.x, p.z)
        const who = { h, t, g: g.id, k: ac.k }
        if (!overSea) {
          if (h < landAll.h) landAll = who
          const exempt = (fromField && t < t0 + FIELD) || (toField && t > t1 - FIELD) || wet.some((td) => Math.abs(t - td) <= SHORE)
          if (exempt) continue
          if (h < mine.h) mine = who
          if (h < land.h) land = who
          if (h < CLEAR) {
            const key = `${g.id} #${ac.k}`
            const b = landBreaches.get(key) || { from: t, to: t, h }
            b.to = t
            b.h = Math.min(b.h, h)
            landBreaches.set(key, b)
          }
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
      if (Number.isFinite(mine.h)) {
        overLand++
        lows.push(mine)
      }
    }
  }
  const L = (w) => (Number.isFinite(w.h) ? `${w.h.toFixed(1)} m at ${clock.label(w.t)}, ${w.g} #${w.k}` : '—')
  if (!samples) {
    console.log(`${box.id}: no aircraft in the record`)
    continue
  }
  console.log(`${box.id}: ${record.groups.length} groups, ${samples} samples`)
  console.log(`  over the sea: lowest ${L(sea)}${seaAll.h < sea.h ? ` (${L(seaAll)} in a drop, a take-off or a landing)` : ''}`)
  console.log(`  over land: ${overLand} aircraft, lowest above the ground ${L(land)}${landAll.h < land.h ? ` (${L(landAll)} by a runway or a drop at the water's edge)` : ''}`)
  if (each) for (const w of lows.sort((a, b) => a.h - b.h)) console.log(`    ${w.g} #${w.k}: ${w.h.toFixed(1)} m at ${clock.label(w.t)}`)
  for (const [key, b] of breaches) {
    failed++
    console.log(`  BELOW ${FLOOR} m over the sea: ${key} from ${clock.label(b.from)} to ${clock.label(b.to)}, lowest ${b.h.toFixed(1)} m`)
  }
  for (const [key, b] of landBreaches) {
    failedLand++
    console.log(`  BELOW ${CLEAR} m above the ground: ${key} from ${clock.label(b.from)} to ${clock.label(b.to)}, lowest ${b.h.toFixed(1)} m`)
  }
}
if (failed || failedLand) {
  if (failed) console.log(`${failed} aircraft under ${FLOOR} m over the sea`)
  if (failedLand) console.log(`${failedLand} aircraft under ${CLEAR} m above the ground over land`)
  process.exit(1)
}
console.log(`no record aircraft under ${FLOOR} m over the sea outside a torpedo drop, a take-off, a landing or a fall, and none under ${CLEAR} m above the ground over land outside a take-off, a landing or a drop at the water's edge`)
