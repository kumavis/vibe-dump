#!/usr/bin/env node
// The replay test (ENGINEERING.md §13 Integrate, step 4; §5 "Authority"):
// every box, untouched, replays its record. For each box in
// public/data/boxes/manifest.json the sim is built from its battle.json, the
// real kits and its decoded pack, exactly as Battle.enter builds it (no
// player, the empty seed of a box entered without a moment), placed at the
// clock's `from`, and run to its `to` at the sim's own step (1/60 s, eight
// steps a call). Asserted, per box:
//
//   1. sim.outcome.diverged is empty at the clock's end (what sank, what
//      burned, what was lost, side by side with the record);
//   2. every scripted strike launches (or enters the box) when the record
//      says, within two seconds, and none is cancelled;
//   3. every ship the record sinks inside the clock is going down (alive 2)
//      or gone (0) by its fate's time, and none other is;
//   4. every ship the record sinks is past its kit's `fatal` (the record
//      damage, the sum of its hits' `damage` shares, at 1 or more) within ten
//      minutes of the last hit it takes before it sinks (Kaga's four or five
//      bombs from 10:22 take her past it by 10:30, ENGINEERING §5), and one
//      that sinks the day after the clock with no hit outside it is past it
//      at the clock's end; a ship the record leaves afloat (damaged,
//      undamaged, withdrew) is not;
//   5. no unit passed from the record to the sim (touched) on its own.
//
// Exit 1 on any failure, printing each box's divergences with the unit, the
// time and the cause. Node only, no browser (the sim imports no three.js).
//
//   node tools/replay.mjs                    all four boxes
//   node tools/replay.mjs midway samar       some
//   node tools/replay.mjs --seed vb6-kaga    another seed (a box entered on a moment's link)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readPNG } from './lib/png.mjs'
import { decodeHeights } from './lib/raster.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = path.join(root, 'public/data')
const args = process.argv.slice(2)
const seedAt = args.indexOf('--seed')
const seed = seedAt >= 0 ? args[seedAt + 1] : ''
const only = args.filter((a, i) => !a.startsWith("--") && (seedAt < 0 || i !== seedAt + 1))

const { createSim } = await import('../src/battle/sim/index.js')
const { TangentProjection } = await import('../src/geo.js')
const { wrapDeep } = await import('../src/data/load.js')
const { FX } = await import('../src/battle/sim/effects.js')

const J = (p) => JSON.parse(fs.readFileSync(path.join(data, p), 'utf8'))
const list = (v, k) => (Array.isArray(v) ? v : v?.[k] || [])
const kits = { ships: list(J('kits/ships.json'), 'ships'), aircraft: list(J('kits/aircraft.json'), 'aircraft'), weapons: list(J('kits/weapons.json'), 'weapons') }
const manifest = J('boxes/manifest.json')
const boxes = list(manifest, 'boxes').filter((b) => !only.length || only.includes(b.id))
if (!boxes.length) throw new Error(`no such box: ${only.join(', ')}`)

const AFLOAT = new Set(['damaged', 'undamaged', 'withdrew', 'none'])
const SUNK = new Set(['sunk', 'scuttled', 'capsized', 'exploded', 'lost'])
const PAST_FATAL_WITHIN = 600 // s after the last hit
const LAUNCH_SLACK = 2 // s

let failed = 0
for (const box of boxes) {
  const t0 = Date.now()
  const proj = new TangentProjection(box.projection)
  const battle = J(box.battle)
  wrapDeep(battle, proj.lon0)
  // the pack, decoded as the app's worker decodes it (metres, row 0 north), over the rect the renderer draws
  const img = readPNG(path.join(data, box.height.file))
  const metres = decodeHeights(img, box.height.scale, box.height.offset)
  const ground = { metres, W: img.width, H: img.height, rect: proj.rect(box.bounds), exaggeration: box.exaggeration ?? 1 }
  const warnings = []
  const sim = createSim(battle, kits, { seed, warn: (m) => warnings.push(m), ground, proj, exaggeration: box.exaggeration ?? 1 })
  const clock = sim.clock
  const L = (t) => clock.label(t)
  const end = clock.duration
  sim.setTime(0)

  const problems = []
  const bad = (unit, t, what, cause) => problems.push({ unit, t, what, cause })

  // the record's expectations
  const ships = sim.record.ships.filter((r) => sim.units[r.slot].kind === 'ship')
  const launches = new Map() // group index → first launch effect t
  const expectLaunch = new Map()
  for (const g of sim.record.groups) {
    const t = g.offBox && g.enter ? g.enter.t : g.launch ?? g.enter?.t ?? null
    if (t != null && t > 0 && t <= end && g.aircraft.length) expectLaunch.set(g.index, t)
  }
  const doneAt = new Map() // ship slot → t when alive left 1
  const pastFatalAt = new Map() // ship slot → t when the record damage reached 1
  const step = 8 / 60
  let effects = 0
  while (sim.t < end - 1e-9) {
    sim.advance(Math.min(step, end - sim.t + 1e-9))
    sim.effects.drain((e) => {
      effects++
      if (e.k === FX.launch && e.unit >= 0) {
        const u = sim.units[e.unit]
        if (u.groupIndex >= 0 && !launches.has(u.groupIndex)) launches.set(u.groupIndex, e.t)
      }
    })
    for (const r of ships) {
      const i = r.slot
      if (!doneAt.has(i) && sim.state.alive[i] !== 1) doneAt.set(i, sim.t)
      if (!pastFatalAt.has(i) && sim._X[i].rd.damage >= 1 - 1e-9) pastFatalAt.set(i, sim.t)
    }
  }
  for (const k of ['pos', 'quat', 'vel', 'speed', 'heading']) for (const v of sim.state[k]) if (!Number.isFinite(v)) bad('(state)', end, `state.${k} is not finite`, 'the sim')

  // 1. the outcome
  const o = sim.outcome
  for (const d of o.diverged) {
    const id = d.unit ?? d.group
    let cause = ''
    if (d.unit) {
      const r = sim.record.shipById.get(d.unit)
      const x = sim._X[r.slot]
      cause = x.touchedWhy ? `left the record at ${L(x.touchedAt)}: ${x.touchedWhy}` : 'still on the record'
    } else {
      const g = sim.record.groupById.get(d.group)
      if (g.cancelledAt != null) cause = `not launched at ${L(g.cancelledAt)}: its carrier burning or sunk`
      else {
        const spared = g.aircraft.filter((a) => a.slot != null && sim._X[a.slot].spared).length
        const lostSim = g.aircraft.filter((a) => a.slot != null && sim._X[a.slot].lostAt != null).length
        cause = spared ? `${spared} spared by a thinned CAP` : lostSim ? `${lostSim} lost to the sim's own models` : 'losses timed outside the clock'
      }
    }
    bad(id, end, `the sim: ${d.sim}; the record: ${d.record}`, cause)
  }
  // 2. the strikes
  for (const [gi, t] of expectLaunch) {
    const g = sim.record.groups[gi]
    if (sim._cancelled.has(gi)) continue // (named under 1)
    const at = launches.get(gi)
    if (at == null) bad(g.id, t, `the record launches it at ${L(t)}; it never launched`, g.offBox ? 'off the box: its entry' : `from ${g.fromId ?? '?'}`)
    else if (Math.abs(at - t) > LAUNCH_SLACK) bad(g.id, at, `launched at ${L(at)}, the record says ${L(t)}`, 'the spawn queue')
  }
  // 3 and 4. the fates
  let sunkIn = 0
  for (const r of ships) {
    const i = r.slot
    const x = sim._X[i]
    const fate = r.fate?.kind ?? 'none'
    const hits = r.events.filter((e) => e.kind === 'hit' || e.kind === 'torpedo-hit')
    const dmgEnd = x.rd.damage
    if (r.sinkT != null && r.sinkT <= end) {
      sunkIn++
      const at = doneAt.get(i)
      if (at == null || at > r.sinkT + 1) bad(r.id, r.sinkT, `the record has her ${fate} at ${L(r.sinkT)}; ${at == null ? 'still afloat at the end' : `going down only at ${L(at)}`}`, x.touchedWhy ? `left the record: ${x.touchedWhy}` : 'the sink queue')
      const before = hits.filter((e) => e.t <= r.sinkT)
      if (before.length && !r.fixed) {
        const due = Math.min(r.sinkT, before[before.length - 1].t + PAST_FATAL_WITHIN)
        const pf = pastFatalAt.get(i)
        if (pf == null || pf > due + 1) bad(r.id, due, `not past fatal by ${L(due)} (record damage ${dmgEnd.toFixed(2)} at the end${pf != null ? `, past it at ${L(pf)}` : ''})`, `her hits' damage shares: ${before.map((e) => `${L(e.t)} ${e.kind}×${e.rc} ${e.damage ?? 'default'}`).join(', ')}`)
      }
    } else if (r.sinkT != null) {
      const after = hits.filter((e) => e.t > end)
      if (!after.length && r.sinkT - end < 86400 && hits.length && dmgEnd < 1 - 1e-9) bad(r.id, end, `the record has her ${fate} at ${L(r.sinkT)} (after the clock) with no hit outside it, but she is not past fatal at the end (${dmgEnd.toFixed(2)})`, `her hits: ${hits.map((e) => `${L(e.t)} ×${e.rc} ${e.damage ?? 'default'}`).join(', ')}`)
    } else {
      const at = doneAt.get(i)
      // (a ship the record sank with no time to it, West Virginia settling on the bottom: past fatal by the clock's end)
      if (SUNK.has(fate) && hits.length && !r.fixed && dmgEnd < 1 - 1e-9) bad(r.id, end, `the record has her ${fate}, but she is not past fatal at the end (${dmgEnd.toFixed(2)})`, `her hits: ${hits.map((e) => `${L(e.t)} ×${e.rc} ${e.damage ?? 'default'}`).join(', ')}`)
      if (at != null && AFLOAT.has(fate)) bad(r.id, at, `the record leaves her ${fate}; she went down at ${L(at)}`, x.touchedWhy ?? 'a collision or grounding')
      if (AFLOAT.has(fate) && dmgEnd >= 1 - 1e-9) bad(r.id, end, `the record leaves her ${fate}, but her record damage reaches ${dmgEnd.toFixed(2)} (past fatal: never a target)`, `her hits: ${hits.map((e) => `${L(e.t)} ×${e.rc} ${e.damage ?? 'default'}`).join(', ')}`)
    }
    // 5. nothing leaves the record by itself
    if (x.touched && !o.diverged.some((d) => d.unit === r.id)) bad(r.id, x.touchedAt, 'left the record with no player in the box', x.touchedWhy || '?')
  }

  const secs = ((Date.now() - t0) / 1000).toFixed(1)
  const head = `${box.id}: ${L(0)}–${L(end)}, ${sim.capacity} slots, ${ships.length} ships (${sunkIn} sunk inside the clock), ${expectLaunch.size} strikes, ${sim.beats.length} beats, ${effects} effects, ${secs} s`
  if (problems.length) {
    failed++
    console.log(`✗ ${head}`)
    for (const p of problems.sort((a, b) => a.t - b.t)) console.log(`    ${L(p.t)}  ${p.unit}: ${p.what}${p.cause ? ` — ${p.cause}` : ''}`)
  } else console.log(`✓ ${head}`)
  const bySide = Object.entries(o.bySide).map(([s, v]) => `${s} sunk ${v.sunk.length} doomed ${v.doomed.length} damaged ${v.damaged.length} aircraft lost ${v.aircraftLost}`).join('; ')
  console.log(`    outcome at ${o.label}: ${bySide}`)
  const uniq = [...new Set(warnings)]
  if (uniq.length) console.log(`    ${uniq.length} sim warning(s): ${uniq.slice(0, 6).join(' | ')}${uniq.length > 6 ? ' | …' : ''}`)
}
process.exitCode = failed ? 1 : 0
if (failed) console.log(`${failed} of ${boxes.length} box(es) diverge from the record`)
else console.log(`all ${boxes.length} box(es) replay the record`)
