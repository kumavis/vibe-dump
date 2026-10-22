// The sim (ENGINEERING.md §5): pure data in, typed arrays out; no three.js.
//
// createSim(battle, kits, { seed, warn, ground, proj }) reads the record
// (record.js), gives every unit a slot fixed for the box's life, and plays
// the battle in steps of 1/60 s in the contract's order: 1 scripted motion
// (closed-form tracks, stations and flight plans), 2 AI decisions, 3 the
// player's physics from player.input, 4 AI physics, 5 projectiles and hits,
// 6 damage (and the AA hazard), 7 the record's actions whose t was crossed
// (subject to the authority rules), 8 fates, 9 effects and beats (pushed as
// they happen, stamped with the step's t).
//
// Authority: the record is the default and the sim is the truth. A unit the
// player has not touched follows the record exactly (its damage shown from
// the record's events, its sinking at the record's time), so an untouched box
// replays the battle and outcome.diverged stays empty. Where the player is
// an event's cause or target, or the group rule changes a count, the unit
// passes to the stochastic damage model (damage.js) and, where it must move
// or fight, to the AI (ai.js).

import { BattleClock } from '../../time.js'
import { TangentProjection } from '../../geo.js'
import { P } from './params.js'
import { createRng } from './rng.js'
import { createWorld } from './world.js'
import { shipModel, aircraftModel, KN, DEG, tableFor } from './units.js'
import { readRecord, planPos, hangarHazardAt } from './record.js'
import { headingOf, courseVec, wrap180 } from './path.js'
import { createDamage, applyHit, stepDamage, speedCap, damageScalar, fireScalar, weaponClass, readWhere } from './damage.js'
import { createAirBody, stepAir, airQuat, eulerQuat, instructor, stallSpeed } from './aircraft.js'
import { createShipBody, stepShip } from './ship.js'
import { Projectiles, KIND, FLAG, flyShell, flyLight, runTorpedo, bulletK, bombK, muzzle } from './guns.js'
import { segmentBox, rayBox, segmentPoint, boxDistance } from './collide.js'
import { Sight } from './sight.js'
import { EffectsRing, FX, dyeCode, eventLine } from './effects.js'
import { shellOf } from './ballistics.js'
import * as AI from './ai.js'
import { computeScore, computeOutcome } from './outcome.js'

const asList = (x) => (Array.isArray(x) ? x : x instanceof Map ? [...x.values()] : x && typeof x === 'object' ? Object.values(x) : [])
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const HIT_KINDS = new Set(['hit', 'torpedo-hit', 'near-miss'])
const SINK_DUR = { capsized: 150, exploded: 40, explodes: 40, default: 300 }

export { P }

export function createSim(battle, kits, opts = {}) {
  const warn = opts.warn || ((m) => console.warn(m))
  const clock = new BattleClock(battle.clock)
  const proj = opts.proj?.toWorld ? opts.proj : opts.proj ? new TangentProjection(opts.proj) : guessProjection(battle, warn)
  const date = clock.utc(0)
  const year = new Date(date).getUTCFullYear()
  const seed = `${battle.id}:${opts.seed ?? ''}`
  const rng = createRng(seed)
  const R = { dmg: rng.fork('damage'), ai: rng.fork('ai'), aa: rng.fork('aa'), fx: rng.fork('fx'), gun: rng.fork('gunnery'), rule: rng.fork('rule') }

  // --- the kits as the models read them ------------------------------------------
  const shipKits = new Map(asList(kits?.ships).map((k) => [k.id, k]))
  const airKits = new Map(asList(kits?.aircraft).map((k) => [k.id, k]))
  const weapons = new Map(asList(kits?.weapons).map((w) => [w.id, w]))
  const SM = new Map()
  const AM = new Map()
  const shipModelOf = (id) => {
    if (!SM.has(id)) {
      let k = shipKits.get(id)
      if (!k) {
        warn(`sim: no ship kit “${id}”; a stand-in is used`)
        k = shipKits.values().next().value
      }
      SM.set(id, k ? shipModel(k, weapons, date, warn) : null)
    }
    return SM.get(id)
  }
  const airModelOf = (id) => {
    if (!AM.has(id)) {
      let k = airKits.get(id)
      if (!k) {
        warn(`sim: no aircraft kit “${id}”; a stand-in is used`)
        k = airKits.values().next().value
      }
      AM.set(id, k ? aircraftModel(k, weapons, date, warn) : null)
    }
    return AM.get(id)
  }

  // --- the world and the record ----------------------------------------------------
  const g0 = opts.ground
  const world = createWorld(g0 && (g0.metres ? g0 : g0.data ? { metres: g0.data.metres, W: g0.W, H: g0.H, rect: g0.rect, exaggeration: opts.exaggeration ?? 1 } : null))
  const record = readRecord(battle, { proj, clock, rng, warn, shipModel: shipModelOf, aircraftModel: airModelOf, heightAt: world.heightAt })
  const lat0 = proj.lat0 ?? 0
  const lon0 = proj.lon0 ?? 0
  const sight = new Sight({ lat: lat0, lon: lon0, clock, weather: battle.weather, squalls: record.squalls, world: g0 ? world : null })
  const windFrom = battle.weather?.wind?.fromDeg ?? 90
  const windKn = battle.weather?.wind?.kn ?? 8
  const [wdx, wdz] = courseVec((windFrom + 180) % 360)
  const wind = { x: wdx * windKn * KN, z: wdz * windKn * KN }

  // --- slots -----------------------------------------------------------------------
  const units = []
  const X = []
  const kitList = []
  const kitIdx = new Map()
  const kitIndexOf = (id, kind) => {
    const key = `${kind}:${id}`
    if (!kitIdx.has(key)) {
      kitIdx.set(key, kitList.length)
      kitList.push({ id, kind, kit: kind === 'ship' ? shipKits.get(id) : airKits.get(id), model: kind === 'ship' ? shipModelOf(id) : airModelOf(id) })
    }
    return kitIdx.get(key)
  }
  const capacityByKit = {}
  const addCap = (id, n = 1) => (capacityByKit[id] = (capacityByKit[id] || 0) + n)
  for (const r of record.ships) {
    const kind = airKits.has(r.kitId) && !shipKits.has(r.kitId) ? 'aircraft' : 'ship'
    const model = kind === 'ship' ? shipModelOf(r.kitId) : airModelOf(r.kitId)
    const i = units.length
    units.push({ index: i, id: r.id, name: r.name, ja: r.ja, kind, side: r.side, kit: r.kitId, kitIndex: kitIndexOf(r.kitId, kind), group: r.formation, groupIndex: -1, k: -1, fixed: r.fixed, hospital: r.hospital, tokko: r.tokko, target: r.target, authority: 'record', parked: kind === 'aircraft' })
    X.push({ rec: r, g: null, ac: null, model, dmg: kind === 'ship' ? createDamage(model, r.side, year) : null, rd: { damage: 0, fires: 0, list: 0, hits: 0 }, body: null, ai: null, touched: false, prev: null, bank: 0, adamage: 0 })
    r.slot = i
    r.sinkDur = SINK_DUR[r.fate?.kind] ?? SINK_DUR.default
    addCap(r.kitId)
  }
  for (const g of record.groups) {
    if (!g.model) continue
    for (const ac of g.aircraft) {
      const i = units.length
      units.push({ index: i, id: `${g.id}#${ac.k + 1}`, name: g.name, ja: null, kind: 'aircraft', side: g.side, kit: g.kitId, kitIndex: kitIndexOf(g.kitId, 'aircraft'), group: g.id, groupIndex: g.index, k: ac.k, fixed: false, hospital: false, tokko: !!g.raw.tokko, target: true, authority: 'record', parked: false })
      X.push({ rec: null, g, ac, model: g.model, dmg: null, rd: null, body: null, ai: null, touched: false, prev: null, bank: 0, adamage: 0 })
      ac.slot = i
      addCap(g.kitId)
    }
  }
  const firstSpare = units.length
  for (let s = 0; s < P.spares; s++) {
    const i = units.length
    units.push({ index: i, id: null, name: null, ja: null, kind: null, side: null, kit: null, kitIndex: 0, group: null, groupIndex: -1, k: -1, fixed: false, hospital: false, tokko: false, target: true, authority: 'free', parked: false })
    X.push({ rec: null, g: null, ac: null, model: null, dmg: null, rd: null, body: null, ai: null, touched: false, prev: null, bank: 0, adamage: 0, spare: true })
  }
  // the kits a spare may hold: the moments' aircraft roles and a saved carrier's ready strikes
  for (const m of record.moments.values()) if (m.role?.kind === 'aircraft' && m.role.kit) {
    kitIndexOf(m.role.kit, 'aircraft')
    addCap(m.role.kit)
  }
  for (const r of record.ships) for (const rd of r.ready || []) if (rd.kit) {
    kitIndexOf(rd.kit, 'aircraft')
    addCap(rd.kit, Math.min(P.spares, rd.count || 6))
  }
  const N = units.length

  // --- the state (ENGINEERING §5's layout; nothing is reallocated) --------------------
  const state = {
    pos: new Float64Array(3 * N),
    quat: new Float32Array(4 * N),
    vel: new Float32Array(3 * N),
    speed: new Float32Array(N),
    heading: new Float32Array(N),
    damage: new Float32Array(N),
    fire: new Float32Array(N),
    list: new Float32Array(N),
    alive: new Uint8Array(N),
    kitIndex: new Uint16Array(N),
    version: new Uint32Array(N),
  }
  for (let i = 0; i < N; i++) {
    state.kitIndex[i] = units[i].kitIndex
    state.quat[4 * i + 3] = 1
  }
  const projectiles = new Projectiles(P.projectileCap)
  const effects = new EffectsRing(P.effectsCap)
  const beats = []

  // --- the record's timed actions ------------------------------------------------------
  const queue = []
  for (const r of record.ships) {
    for (const ev of r.events) queue.push({ t: ev.t, kind: 'event', slot: r.slot, ev })
    if (r.sinkT != null) {
      queue.push({ t: r.sinkT - r.sinkDur, kind: 'sinkstart', slot: r.slot })
      queue.push({ t: r.sinkT, kind: 'sunk', slot: r.slot })
    }
  }
  for (const g of record.groups) {
    for (const ac of g.aircraft) {
      if (ac.slot == null) continue
      queue.push({ t: ac.spawnT, kind: 'spawn', slot: ac.slot })
      for (const a of ac.actions) queue.push({ ...a, slot: ac.slot })
      if (ac.lossT != null) {
        queue.push({ t: ac.lossT - 5, kind: 'choreo', slot: ac.slot })
        queue.push({ t: ac.lossT, kind: 'lose', slot: ac.slot })
        queue.push({ t: ac.goneT, kind: 'gone', slot: ac.slot })
      } else if (Number.isFinite(ac.endT) && ac.endHow !== 'land') queue.push({ t: ac.endT, kind: 'exit', slot: ac.slot })
    }
  }
  const ORDER = { spawn: 0, sinkstart: 1, event: 2, release: 3, drop: 3, strafe: 3, choreo: 4, lose: 5, land: 6, exit: 6, gone: 7, sunk: 8, beat: 9 }
  queue.forEach((a, i) => (a.n = i))
  queue.sort((a, b) => a.t - b.t || (ORDER[a.kind] ?? 5) - (ORDER[b.kind] ?? 5) || a.n - b.n)

  // --- the sim object -----------------------------------------------------------------------
  const sim = {
    battle,
    clock,
    proj,
    record,
    world,
    sight,
    units,
    groups: record.groups.map((g) => ({ id: g.id, name: g.name, kit: g.kitId, side: g.side, count: g.count, profile: g.attack?.profile ?? null, units: g.aircraft.map((a) => a.slot), reached: g.Srec })),
    state,
    projectiles,
    effects,
    beats,
    kits: kitList,
    capacity: N,
    capacityByKit,
    weaponList: [],
    weaponIndex: new Map(),
    t: 0,
    lag: 0,
    player: null,
    diverged: false,
    momentState: null,
    threat: false,
    threatWhy: null,
    visualFire: true,
    aid: opts.aid || 'standard',
    year,
    date,
    wind,
    rngs: R,
    _X: X,
    _queue: queue,
    _cursor: 0,
    _cancelled: new Set(),
    _salvo: 1,
    _score: null,
    _visualFire: new Map(), // slot → { target, next } (a record ship's guns firing for the eye)
    _engaged: new Set(),
    _momentQueue: [],
    _momentCursor: 0,
    warn,
  }

  const weaponIdx = (w) => {
    if (!w) return -1
    let i = sim.weaponIndex.get(w.id)
    if (i == null) {
      i = sim.weaponList.length
      sim.weaponList.push({ w, shell: w.kind === 'gun' || w.kind === 'aa' ? shellOf(w) : null, cls: weaponClass(w) })
      sim.weaponIndex.set(w.id, i)
    }
    return i
  }
  sim.weaponIdx = weaponIdx

  const fx = (kind, x, y, z, o) => effects.push(kind, sim.t, x, y, z, o)
  sim.fx = fx
  const beat = (unit, kind, text, sources = null) => beats.push({ t: sim.t, unit, kind, text, sources })
  sim.beat = beat

  // --- record motion ---------------------------------------------------------------------
  const pose = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }
  const ppos = { x: 0, y: 0, z: 0 }
  const qpos = { x: 0, y: 0, z: 0 }
  const resolveCtx = { motion: record.motion, groups: record.groups }

  /** A record ship (or parked aircraft) at t, written into the state. */
  function placeRecordShip(i, t) {
    const x = X[i]
    const r = x.rec
    record.motion.pose(r.index, t, pose)
    const o3 = 3 * i
    const sinkS = r.sinkT != null ? r.sinkT - r.sinkDur : Infinity
    let y = 0
    let pitch = 0
    let roll = x.rd.list
    if (units[i].kind === 'aircraft') y = world.heightAt(pose.x, pose.z) + 1.2
    if (t >= sinkS && r.sinkT != null) {
      const s = clamp((t - sinkS) / r.sinkDur, 0, 1)
      const m = x.model
      y = -(m.top + m.T + 4) * s * s
      pitch = (r.fate?.kind === 'capsized' ? 0.05 : 0.18) * s
      roll += (r.fate?.kind === 'capsized' ? 120 : 8) * s
    }
    state.pos[o3] = pose.x
    state.pos[o3 + 1] = y
    state.pos[o3 + 2] = pose.z
    state.vel[o3] = pose.vx
    state.vel[o3 + 1] = 0
    state.vel[o3 + 2] = pose.vz
    state.speed[i] = pose.speed
    state.heading[i] = pose.heading
    state.list[i] = x.rd.list
    state.damage[i] = Math.min(1, x.rd.damage)
    state.fire[i] = t >= (r.sinkT ?? Infinity) ? 0 : Math.min(1, x.rd.fires * 0.4)
    eulerQuat(-pose.heading * DEG, pitch, -roll * DEG, state.quat, 4 * i)
  }

  /** A record aircraft at t (its plan, or its fall). */
  function placeRecordAircraft(i, t, dtPrev) {
    const x = X[i]
    const ac = x.ac
    planPos(ac, t, ppos, resolveCtx)
    const o3 = 3 * i
    let vx
    let vy
    let vz
    if (dtPrev > 0 && x.prev) {
      vx = (ppos.x - x.prev[0]) / dtPrev
      vy = (ppos.y - x.prev[1]) / dtPrev
      vz = (ppos.z - x.prev[2]) / dtPrev
    } else {
      planPos(ac, t - 0.25, qpos, resolveCtx)
      vx = (ppos.x - qpos.x) * 4
      vy = (ppos.y - qpos.y) * 4
      vz = (ppos.z - qpos.z) * 4
    }
    x.prev ||= [0, 0, 0]
    x.prev[0] = ppos.x
    x.prev[1] = ppos.y
    x.prev[2] = ppos.z
    state.pos[o3] = ppos.x
    state.pos[o3 + 1] = ppos.y
    state.pos[o3 + 2] = ppos.z
    state.vel[o3] = vx
    state.vel[o3 + 1] = vy
    state.vel[o3 + 2] = vz
    const hs = Math.hypot(vx, vz)
    const sp = Math.hypot(hs, vy)
    const hd = hs > 0.5 ? headingOf(vx, vz) : state.heading[i]
    // the bank of a coordinated turn from the heading's rate
    if (dtPrev > 0) {
      const rate = (wrap180(hd - state.heading[i]) * DEG) / dtPrev
      const want = clamp(Math.atan((rate * sp) / 9.81), -1.2, 1.2)
      x.bank += (want - x.bank) * Math.min(1, dtPrev * 3)
    }
    state.speed[i] = sp
    state.heading[i] = hd
    const gamma = Math.atan2(vy, Math.max(1e-3, hs))
    const falling = ac.lossT != null && t >= ac.lossT
    eulerQuat(-hd * DEG, falling ? gamma : gamma * 0.9, -(falling ? x.bank + (t - ac.lossT) * 0.9 : x.bank), state.quat, 4 * i)
    state.damage[i] = falling ? 1 : 0
    state.fire[i] = falling && ac.lossHow === 'shot' ? 1 : 0
  }

  /** Whether a record aircraft is alive (1), falling (2) or not (0) at t. */
  function recordAlive(x, t) {
    const ac = x.ac
    if (sim._cancelled.has(x.g.index)) return 0
    if (t < ac.spawnT) return 0
    if (ac.lossT != null) {
      if (t >= ac.goneT) return 0
      if (t >= ac.lossT) return 2
    }
    if (t >= ac.endT) return 0
    return 1
  }

  function setAlive(i, a) {
    const was = state.alive[i]
    if (was === a) return
    state.alive[i] = a
    const o3 = 3 * i
    if (was === 0 && a > 0) {
      state.version[i]++
      fx(FX.spawn, state.pos[o3], state.pos[o3 + 1], state.pos[o3 + 2], { unit: i })
    } else if (a === 0) fx(was === 2 ? FX.gone : FX.despawn, state.pos[o3], state.pos[o3 + 1], state.pos[o3 + 2], { unit: i })
  }
  sim._setAlive = setAlive

  // --- the record's damage shown on an untouched ship ------------------------------------------
  function recordShipAt(i, t) {
    const x = X[i]
    const r = x.rec
    const rd = x.rd
    rd.damage = 0
    rd.fires = 0
    rd.list = 0
    rd.hits = 0
    rd.applied = 0
    for (const ev of r.events) {
      if (ev.t > t) break
      rd.applied = ev.k + 1
      if (HIT_KINDS.has(ev.kind) && ev.kind !== 'near-miss') {
        rd.damage += ev.damage ?? 0.08 * Math.max(1, ev.rc)
        rd.hits += ev.rc
      } else if (ev.kind === 'fire') rd.fires++
      else if (ev.kind === 'list') rd.list += ev.deg ?? ev.listDeg ?? 8
      else if (ev.kind === 'explodes') rd.fires += 2
    }
    if (r.sinkT != null && t >= r.sinkT) return 0
    if (r.sinkT != null && t >= r.sinkT - r.sinkDur) return 2
    return 1
  }

  // --- place everything at t, closed-form (setTime while !diverged) ---------------------------
  function placeAll(t, { effectsOn = true } = {}) {
    for (let i = 0; i < N; i++) {
      const x = X[i]
      if (x.spare) continue
      const u = units[i]
      if (x.rec) {
        if (u.authority === 'record') {
          const a = recordShipAt(i, t)
          placeRecordShip(i, t)
          if (effectsOn) setAlive(i, a)
          else state.alive[i] = a
        }
      } else if (x.ac && u.authority === 'record') {
        const a = recordAlive(x, t)
        x.prev = null
        if (a) placeRecordAircraft(i, t, 0)
        if (effectsOn) setAlive(i, a)
        else state.alive[i] = a
      }
    }
  }

  sim.setTime = function setTime(t) {
    t = clock.clamp(clock.parse(t))
    if (sim.diverged) {
      if (t <= sim.t) {
        warn('sim.setTime: the sim has diverged from the record; it plays forward only (Battle rebuilds it from the record to go back)')
        return
      }
      while (sim.t < t - 1e-9) sim.advance(Math.min(t - sim.t, P.step * P.maxSteps))
      return
    }
    sim.t = t
    sim.lag = 0
    projectiles.clear()
    sim._visualFire.clear()
    sight.update(t)
    placeAll(t)
    // the cursor: the first action after t
    let lo = 0
    let hi = queue.length
    while (lo < hi) {
      const m = (lo + hi) >> 1
      if (queue[m].t <= t) lo = m + 1
      else hi = m
    }
    sim._cursor = lo
    // visual gunfire already under way at t
    for (const r of record.ships) {
      let open = null
      for (const ev of r.events) {
        if (ev.t > t) break
        if (ev.kind === 'opens-fire') open = ev
        if (ev.kind === 'ceases-fire') open = null
      }
      if (open) startVisualFire(r.slot, open)
    }
    if (sim.momentState) sim._momentCursor = sim._momentQueue.findIndex((b) => b.t > t) >>> 0
  }

  // --- touching: a unit passes from the record to the sim ---------------------------------------
  /** Hand a record ship to the stochastic damage model, initialised from the record up to now. */
  function touch(i, why = '') {
    const x = X[i]
    if (x.touched || !x.rec) return
    x.touched = true
    if (units[i].kind !== 'ship') return
    const st = x.dmg
    st.regime = 'sim'
    const r = x.rec
    const rr = R.dmg.fork(`init:${r.id}`)
    let anyHit = false
    // (the record's events already crossed: the one being decided now is not among them)
    for (const ev of r.events) {
      if (ev.k >= (x.rd.applied ?? 0)) break
      if (ev.kind === 'hit' || ev.kind === 'torpedo-hit') {
        anyHit = true
        const cls = causeClass(ev)
        for (let n = 0; n < Math.max(1, ev.rc); n++) applyHit(st, x.model, { cls, ...whereOf(ev, rr), t: ev.t }, rr)
      } else if (ev.kind === 'fire') {
        const z = st.fires.indexOf(0)
        if (z >= 0) st.fires[z] = 1
      }
    }
    // a ship the record sinks, already hit before the player came: her fate stands
    if (anyHit && r.sinkT != null) {
      st.doomed = true
      st.doomedAt ??= sim.t
      st.doomedWhy ??= 'record'
      st.sinkDue = r.sinkT
    }
    if (why) x.touchedWhy = why
  }
  sim._touch = touch

  /** Put a ship under the AI (it moves by the ship model; evades, returns fire, rejoins its track). */
  function toAI(i) {
    const x = X[i]
    const u = units[i]
    if (u.authority !== 'record') return
    touch(i)
    u.authority = 'ai'
    if (u.kind === 'ship') {
      const o3 = 3 * i
      x.body = createShipBody(x.model, { x: state.pos[o3], z: state.pos[o3 + 2], heading: state.heading[i], V: state.speed[i] })
      x.ai = AI.createShipAI(sim, i)
    } else {
      const o3 = 3 * i
      const vx = state.vel[o3]
      const vy = state.vel[o3 + 1]
      const vz = state.vel[o3 + 2]
      const hs = Math.hypot(vx, vz)
      x.body = createAirBody(x.model, { x: state.pos[o3], y: state.pos[o3 + 1], z: state.pos[o3 + 2], V: Math.max(40, Math.hypot(hs, vy)), heading: state.heading[i], gamma: Math.atan2(vy, hs), throttle: 0.8 })
      x.body.phi = x.bank
      x.ai = AI.createAirAI(sim, i)
      x.ammo = AI.ammoOf(x.model)
    }
  }
  sim._toAI = toAI

  const causeClass = (ev) => {
    const g = record.groupById.get(ev.by)
    if (g?.model) {
      if (ev.kind === 'torpedo-hit') return 'torpedo-air'
      const w = g.model.payload[0]?.weapon
      return w ? weaponClass(w) : 'bomb-500'
    }
    const s = record.shipById.get(ev.by)
    if (s) {
      const m = shipModelOf(s.kitId)
      if (ev.kind === 'torpedo-hit') return m?.torp?.weapon ? weaponClass(m.torp.weapon) : 'torpedo-t93'
      const w = m?.batteries[0]?.weapon
      return w ? weaponClass(w) : 'medium'
    }
    return ev.kind === 'torpedo-hit' ? 'torpedo-air' : 'bomb-500'
  }
  const whereOf = (ev, r) => {
    const w = readWhere(ev.where || '', r)
    return { zone: w.zone, part: w.part === 'turret' ? 'hull' : w.part ?? (ev.kind === 'torpedo-hit' ? 'waterline' : 'hull'), side: w.side, uptake: w.uptake }
  }

  // --- the group rule (ENGINEERING §5; R7 §4.7) ------------------------------------------------
  /** Survivors of a group that reached (or may still reach) its attack; without the player's slot. */
  function survivors(g) {
    if (sim._cancelled.has(g.index)) return 0
    let n = 0
    for (const ac of g.aircraft) {
      const i = ac.slot
      if (i == null) continue
      if (sim.player && sim.player.unitIndex === i) continue
      const x = X[i]
      const rel = ac.releaseT ?? Infinity
      if (x.lostAt != null) {
        if (x.lostAt < rel) continue
      } else if (units[i].authority === 'record' && ac.lossT != null && ac.lossT < rel && !x.spared) continue
      n++
    }
    return n
  }
  sim._survivors = survivors

  function groupRuleCount(g, ev, playerInGroup) {
    const S = survivors(g)
    const Srec = Math.max(0, g.Srec - (playerInGroup ? 1 : 0))
    const rc = Math.max(0, ev.rc - (playerInGroup ? 1 : 0))
    if (Srec <= 0) return { count: rc, changed: false }
    if (S < P.group.minShare * Srec) return { count: 0, changed: true, S, Srec }
    const tgt = X[ev.unit].model
    const prof = g.attack?.profile || 'default'
    const br = prof === 'dive' ? P.group.baseRate.dive[tgt?.type] ?? P.group.baseRate.dive.default : P.group.baseRate[prof] ?? P.group.baseRate.default
    const exp = rc * Math.min(1, S / Srec) + br * Math.max(0, S - Srec)
    const n = Math.floor(exp) + (R.rule.chance(exp - Math.floor(exp)) ? 1 : 0)
    return { count: n, changed: S !== Srec || playerInGroup, S, Srec }
  }

  // --- the record's actions ---------------------------------------------------------------------------
  function runAction(a) {
    const i = a.slot
    const u = units[i]
    const x = X[i]
    switch (a.kind) {
      case 'spawn': {
        if (u.authority !== 'record') return
        const g = x.g
        if (!sim._cancelled.has(g.index) && g.from >= 0 && a === firstSpawn(g)) {
          // a strike from a carrier burning or sunk at its launch does not launch
          const fi = record.ships[g.from].slot
          const fd = X[fi].dmg
          if (state.alive[fi] !== 1 || (fd.regime === 'sim' && (fd.out || fd.sinking || fd.doomed || fd.fires.reduce((s, v) => s + v, 0) >= 2))) {
            sim._cancelled.add(g.index)
            beat(fi, 'launches', `${units[fi].name}: ${g.name} not launched`)
            return
          }
        }
        if (sim._cancelled.has(g.index)) return
        x.prev = null
        placeRecordAircraft(i, sim.t, 0)
        setAlive(i, 1)
        if (a === firstSpawn(g)) fx(FX.launch, state.pos[3 * i], state.pos[3 * i + 1], state.pos[3 * i + 2], { unit: i })
        return
      }
      case 'event':
        return recordEvent(a)
      case 'sinkstart':
        if (u.authority !== 'record' && !(x.rec?.fixed)) return
        if (x.dmg.regime === 'sim' && !x.rec.fixed) return
        setAlive(i, 2)
        fx(FX.sink, state.pos[3 * i], 0, state.pos[3 * i + 2], { unit: i, size: x.model.L })
        beat(i, 'sinks', `${u.name}: sinking`)
        return
      case 'sunk':
        if (x.dmg.regime === 'sim' && !x.rec.fixed) return
        setAlive(i, 0)
        return
      case 'release':
      case 'drop':
      case 'strafe':
        if (u.authority !== 'record' || state.alive[i] !== 1) return
        return AI.scriptedOrdnance(sim, a)
      case 'choreo':
        if (u.authority !== 'record' || state.alive[i] !== 1) return
        return AI.choreograph(sim, i, a)
      case 'lose': {
        if (u.authority !== 'record' || state.alive[i] !== 1) return
        // a loss caused by a CAP the player has thinned happens in proportion to that CAP's survivors
        const cause = x.ac.lossCause
        if (typeof cause === 'number') {
          const cg = record.groups[cause]
          const S = survivors(cg)
          const p = cg.Srec > 0 ? Math.min(1, S / cg.Srec) : 1
          if (p < 1 && !R.rule.chance(p)) {
            // spared: it flies its plan on, home or out of the box
            x.spared = true
            x.ac = { ...x.ac, lossT: null, goneT: null }
            if (Number.isFinite(x.ac.endT)) insertAction({ t: x.ac.endT, kind: 'exit', slot: i, n: queue.length })
            return
          }
        }
        setAlive(i, 2)
        fx(FX.fall, state.pos[3 * i], state.pos[3 * i + 1], state.pos[3 * i + 2], { unit: i, data: x.ac.lossHow === 'ditch' ? 1 : 0 })
        return
      }
      case 'gone':
        if (u.authority !== 'record' || !state.alive[i] || x.spared) return
        fx(FX.splash, state.pos[3 * i], 0, state.pos[3 * i + 2], { unit: i, size: 12 })
        setAlive(i, 0)
        return
      case 'land':
      case 'exit':
        if (u.authority !== 'record' || state.alive[i] !== 1) return
        setAlive(i, 0)
        return
      default:
    }
  }
  /** A late action (a spared aircraft's way home) into the sorted queue, after the cursor. */
  function insertAction(a) {
    let lo = sim._cursor
    let hi = queue.length
    while (lo < hi) {
      const m = (lo + hi) >> 1
      if (queue[m].t <= a.t) lo = m + 1
      else hi = m
    }
    queue.splice(lo, 0, a)
  }
  sim._insertAction = insertAction

  const firstSpawnCache = new Map()
  const firstSpawn = (g) => {
    if (!firstSpawnCache.has(g.index)) {
      const s = g.aircraft.length ? Math.min(...g.aircraft.map((a) => a.spawnT)) : Infinity
      firstSpawnCache.set(g.index, queue.find((q) => q.kind === 'spawn' && X[q.slot].g === g && q.t === s))
    }
    return firstSpawnCache.get(g.index)
  }

  /** A record event crossed by the clock, under the authority rules. */
  function recordEvent(a) {
    const x = X[a.slot]
    try {
      return recordEvent1(a)
    } finally {
      x.rd.applied = Math.max(x.rd.applied ?? 0, a.ev.k + 1)
    }
  }
  function recordEvent1(a) {
    const i = a.slot
    const ev = a.ev
    const u = units[i]
    const x = X[i]
    const pl = sim.player
    const playerUnit = pl ? pl.unitIndex : -1
    const isPlayerTarget = i === playerUnit
    const byGroup = ev.by ? record.groupById.get(ev.by) : null
    const byShip = ev.by ? record.shipById.get(ev.by) : null
    const byPlayerShip = byShip && byShip.slot === playerUnit
    const playerInGroup = byGroup && pl && units[playerUnit]?.groupIndex === byGroup.index
    const fixed = !!x.rec.fixed

    if (HIT_KINDS.has(ev.kind)) {
      if (!fixed && (isPlayerTarget || byPlayerShip)) {
        // not scripted: the sim resolves it (the player's own fire, or the AI's at the player)
        if (byShip && isPlayerTarget) engage(byShip.slot)
        return
      }
      if (!u.target || x.model?.fatal == null) return
      let count = ev.rc
      let changed = false
      if (!fixed && byGroup) {
        const r = groupRuleCount(byGroup, ev, playerInGroup)
        count = r.count
        changed = r.changed && count !== ev.rc
        if (r.changed && playerInGroup) changed = true
      } else if (!fixed && byShip) {
        const bi = byShip.slot
        const bd = X[bi].dmg
        if (state.alive[bi] !== 1 || (bd.regime === 'sim' && (bd.out || bd.sinking))) {
          count = 0
          changed = true
        } else if (bd.regime === 'sim' && bd.crippled) {
          count = Math.round(count * 0.5)
          changed = count !== ev.rc
        }
      }
      if (!changed && !x.touched) {
        // the record's own path: the damage shown, the effects drawn
        if (ev.kind !== 'near-miss') {
          x.rd.damage += ev.damage ?? 0.08 * Math.max(1, ev.rc)
          x.rd.hits += ev.rc
        }
        hitEffects(i, ev, count)
        if (ev.kind !== 'near-miss' || ev.text) beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      }
      // the sim's path: the per-hit table applied to the count the group rule gives
      touch(i, 'group rule')
      if (count <= 0) return
      const cls = causeClass(ev)
      const rr = R.dmg
      const says = []
      if (ev.kind !== 'near-miss') for (let n = 0; n < count; n++) says.push(applyHit(x.dmg, x.model, { cls, ...whereOf(ev, rr), t: sim.t }, rr))
      hitEffects(i, ev, count)
      beat(i, ev.kind, eventLine(u.name, ev, count !== ev.rc ? ` (${count})` : ''), ev.sources)
      const s = says.filter(Boolean)
      if (s.length) beat(i, 'damage', `${u.name}: ${[...new Set(s.join(', ').split(', '))].join(', ')}`)
      return
    }
    // status and signal events
    const simRegime = x.dmg && x.dmg.regime === 'sim' && !fixed
    switch (ev.kind) {
      case 'fire':
      case 'flood':
      case 'list':
      case 'explodes':
      case 'dead-in-water':
      case 'steering-jammed':
      case 'power-failure':
      case 'radar-lost':
        if (simRegime) return // whether it happens is the damage model's call
        if (ev.kind === 'fire') {
          x.rd.fires++
          fx(FX.fire, state.pos[3 * i], 8, state.pos[3 * i + 2], { unit: i, size: 1 })
        } else if (ev.kind === 'list') x.rd.list += ev.deg ?? ev.listDeg ?? 8
        else if (ev.kind === 'explodes') {
          x.rd.fires += 2
          fx(FX.explode, state.pos[3 * i], 10, state.pos[3 * i + 2], { unit: i, size: 3 })
        }
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'sinks':
      case 'abandoned':
        if (simRegime) return
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'scuttled':
        if (simRegime && !x.dmg.doomed) return
        if (simRegime) {
          x.dmg.sinkDue = sim.t
        }
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'opens-fire':
        if (u.authority === 'record' || u.authority === 'ai') startVisualFire(i, ev)
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'ceases-fire':
        sim._visualFire.delete(i)
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'torpedoes-fired':
        AI.scriptedTorpedoes(sim, i, ev)
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      case 'smoke-screen': {
        const o = 3 * i
        const len = ev.lengthM ?? 3000
        const dur = ev.durationS ?? 1200
        const [ux, uz] = courseVec(state.heading[i])
        let ax = state.pos[o]
        let az = state.pos[o + 2]
        if (ev.lonlat) [ax, az] = proj.toWorld(ev.lonlat)
        sight.addSmoke(ax, az, ax - ux * len, az - uz * len, sim.t, sim.t + dur, wind.x, wind.z)
        fx(FX.smoke, ax, 20, az, { unit: i, dx: -ux * len, dz: -uz * len, size: dur, data: 1 })
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      }
      case 'searchlight':
      case 'illuminated':
      case 'starshell': {
        const o = 3 * i
        const tgt = ev.target ? record.shipById.get(ev.target) : null
        const ti = tgt ? tgt.slot : i
        const tx = state.pos[3 * ti]
        const tz = state.pos[3 * ti + 2]
        const dur = ev.kind === 'starshell' ? 45 : 180
        sight.addLight(tx, 0, tz, 1500, sim.t + dur, ev.kind)
        if (ev.kind === 'starshell') fx(FX.starshell, tx, 500, tz, { unit: i, size: dur })
        else fx(FX.searchlight, state.pos[o], 25, state.pos[o + 2], { unit: i, dx: tx - state.pos[o], dz: tz - state.pos[o + 2], size: dur })
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
        return
      }
      default:
        beat(i, ev.kind, eventLine(u.name, ev), ev.sources)
    }
  }

  /** The record's hits drawn on the hull (no damage: the record's path). */
  function hitEffects(i, ev, count) {
    const o = 3 * i
    const m = X[i].model
    const [ux, uz] = courseVec(state.heading[i])
    const r = R.fx
    const n = Math.min(8, Math.max(1, count))
    for (let k = 0; k < n; k++) {
      const along = (r.next() - 0.5) * m.L * 0.7
      const x = state.pos[o] + ux * along
      const z = state.pos[o + 2] + uz * along
      if (ev.kind === 'near-miss') fx(FX.splash, x + (r.next() - 0.5) * m.B * 3, 0, z + (r.next() - 0.5) * m.B * 3, { unit: i, size: 30 })
      else if (ev.kind === 'torpedo-hit') fx(FX.splash, x, 0, z, { unit: i, size: 60, data: 0 })
      else fx(FX.explode, x, m.deck + 2, z, { unit: i, size: 1 })
      if (ev.kind !== 'near-miss') fx(FX.hit, x, m.deck, z, { unit: i, size: 1 })
    }
  }

  /** A record ship's guns firing for the eye (visual shells) at its record target. */
  function startVisualFire(i, ev) {
    const r = X[i].rec
    let target = ev.target ? record.shipById.get(ev.target)?.slot : null
    if (target == null) {
      // the unit the record has it hitting next
      let best = null
      for (const s of record.ships) for (const e of s.events) if (e.by === r?.id && e.t >= ev.t && (!best || e.t < best.t)) best = { t: e.t, slot: s.slot }
      target = best?.slot ?? null
    }
    // for twenty minutes past the record's last hit by it (or the opening), unless a cease-fire comes first
    let until = ev.t + 1200
    for (const s2 of record.ships) for (const e of s2.events) if (e.by === r?.id && e.t >= ev.t && HIT_KINDS.has(e.kind)) until = Math.max(until, e.t + 600)
    sim._visualFire.set(i, { target, next: sim.t + 2 + R.fx.next() * 4, until })
  }

  /** An enemy ship the player has drawn into the fight: it passes to the AI and engages. */
  function engage(i) {
    if (i == null || i < 0) return
    if (units[i].authority === 'record') toAI(i)
    sim._engaged.add(i)
    if (X[i].ai) X[i].ai.engaged = true
  }
  sim._engage = engage

  // --- the player ----------------------------------------------------------------------------------
  sim.takeControl = function takeControl(role) {
    if (!role) throw new Error('takeControl: no role')
    if (sim.player) sim.releaseControl()
    const kind = role.kind
    let i = -1
    if (kind === 'ship') {
      const r = record.shipById.get(role.unit)
      if (!r) throw new Error(`takeControl: no unit “${role.unit}”`)
      if (r.tokko) throw new Error('takeControl: a tokkō unit is never a player role')
      i = r.slot
      if (state.alive[i] !== 1) throw new Error(`takeControl: ${r.name} is not afloat at this time`)
      touch(i, 'player')
      const x = X[i]
      const o3 = 3 * i
      x.body = createShipBody(x.model, { x: state.pos[o3], z: state.pos[o3 + 2], heading: state.heading[i], V: state.speed[i] })
      x.guns = AI.createGuns(sim, i)
      x.torpedoes = x.model.torp ? { ready: x.model.torp.tubes ?? 2, reloadAt: 0 } : null
      units[i].authority = 'player'
    } else {
      const g = role.group ? record.groupById.get(role.group) : null
      const kitId = role.kit || g?.kitId
      if (g) {
        // a member alive now that has not yet reached its attack, the soonest to it first
        const cand = g.aircraft.filter((ac) => ac.slot != null && units[ac.slot].authority === 'record' && state.alive[ac.slot] === 1)
        cand.sort((a, b) => (a.releaseT ?? 1e9) - (b.releaseT ?? 1e9))
        const pick = cand.find((ac) => (ac.releaseT ?? Infinity) > sim.t + 15) || cand[0]
        if (pick) i = pick.slot
      }
      if (i < 0) i = allocSpare(kitId, 'aircraft', g)
      if (i < 0) throw new Error('takeControl: no slot free')
      const x = X[i]
      const o3 = 3 * i
      const vx = state.vel[o3]
      const vy = state.vel[o3 + 1]
      const vz = state.vel[o3 + 2]
      const hs = Math.hypot(vx, vz)
      x.body = createAirBody(x.model, { x: state.pos[o3], y: state.pos[o3 + 1], z: state.pos[o3 + 2], V: Math.max(x.model.vCruise * 0.8, Math.hypot(hs, vy)), heading: state.heading[i], gamma: Math.atan2(vy, Math.max(1, hs)), throttle: 0.8 })
      x.ammo = AI.ammoOf(x.model)
      units[i].authority = 'player'
      x.touched = true
    }
    const u = units[i]
    const player = {
      kind,
      unitIndex: i,
      scripted: false,
      input: AI.defaultInput(kind, X[i], state, i),
      state: {},
      _seen: { fireCount: 0, bombCount: 0, torpedoCount: 0, salvoCount: 0, starshellCount: 0 },
      role,
    }
    sim.player = player
    sim.diverged = true
    sim._score = { hits: [], downed: 0, torpedoesHit: 0, salvos: 0, straddles: 0, shells: 0, bombs: 0, torpedoes: 0, releaseM: null, envelope: [], objective: false, start: sim.t, lost: null, how: null }
    AI.updatePlayerState(sim)
    return player
  }

  function allocSpare(kitId, kind, g = null) {
    for (let i = firstSpare; i < N; i++) {
      if (units[i].authority !== 'free') continue
      const u = units[i]
      u.kind = kind
      u.kit = kitId
      u.kitIndex = kitIndexOf(kitId, kind)
      state.kitIndex[i] = u.kitIndex
      u.side = g?.side ?? airKits.get(kitId)?.side ?? 'us'
      u.id = `spare-${i - firstSpare}`
      u.name = g?.name ?? airKits.get(kitId)?.name ?? kitId
      u.group = g?.id ?? null
      u.groupIndex = g?.index ?? -1
      u.authority = 'ai'
      X[i].model = airModelOf(kitId)
      X[i].spare = false
      X[i].wasSpare = true
      state.alive[i] = 0
      return i
    }
    return -1
  }
  sim._allocSpare = allocSpare

  sim.releaseControl = function releaseControl() {
    const pl = sim.player
    if (!pl) return
    const i = pl.unitIndex
    const u = units[i]
    if (u.authority === 'player') {
      u.authority = 'ai'
      X[i].ai = u.kind === 'ship' ? AI.createShipAI(sim, i) : AI.createAirAI(sim, i, { rejoin: true })
    }
    if (sim.momentState && !sim.momentState.done) endMoment('released')
    sim.player = null
  }

  // --- moments (moments: checkpoints, restart points, the end) -------------------------------------------
  sim.startMoment = function startMoment(id) {
    const m = record.moments.get(id)
    if (!m) throw new Error(`no moment “${id}”`)
    if (!sim.diverged && Math.abs(sim.t - m.t) > 1e-6) sim.setTime(m.t)
    const pl = sim.player || sim.takeControl(m.role)
    AI.applyStart(sim, m)
    const ts = m.timeScale ?? (m.role.kind === 'aircraft' ? 1 : 2)
    sim.momentState = { id, t0: m.t, t1: m.t + (m.durationS ?? 180) * ts, elapsed: 0, checkpoint: false, done: false, reason: null, timeScale: ts, maxTimeScale: m.maxTimeScale ?? (m.role.kind === 'aircraft' ? 4 : 4), restart: [m.t, m.t + (m.durationS ?? 180) * ts] }
    sim._momentQueue = (m.beats || []).map((b) => ({ ...b })).sort((a, b) => a.t - b.t)
    sim._momentCursor = 0
    sim._score.start = sim.t
    sim._moment = m
    return pl
  }

  function endMoment(reason) {
    const ms = sim.momentState
    if (!ms || ms.done) return
    ms.done = true
    ms.reason = reason
    ms.endT = sim.t
  }
  sim._endMoment = endMoment

  // --- one step ----------------------------------------------------------------------------------------
  const prev = [0, 0, 0]
  const hitOut = { s: 0, lx: 0, ly: 0, lz: 0 }

  function step(dt, { recordAircraft = true } = {}) {
    const t0 = sim.t
    const t = t0 + dt
    sim.t = t
    sight.update(t)
    // 1. scripted motion
    for (let i = 0; i < N; i++) {
      const x = X[i]
      if (x.spare) continue
      const u = units[i]
      if (u.authority !== 'record') continue
      if (x.rec) {
        if (state.alive[i]) placeRecordShip(i, t)
      } else if (x.ac && recordAircraft && state.alive[i]) placeRecordAircraft(i, t, dt)
    }
    // 2. AI decisions, 3. the player's physics, 4. AI physics
    AI.think(sim, dt)
    AI.playerStep(sim, dt)
    AI.aiPhysics(sim, dt)
    // 5. projectiles and hits
    stepProjectiles(dt)
    // 6. damage and the AA hazard
    for (let i = 0; i < N; i++) {
      const x = X[i]
      if (!x.dmg || x.dmg.regime !== 'sim' || !state.alive[i]) continue
      const H = x.model.carrier ? hangarHazardAt(x.rec, t) ?? 0 : 0
      const evs = stepDamage(x.dmg, x.model, dt, { t, rng: R.dmg, H, recordSinkT: x.rec?.sinkT ?? null })
      for (const e of evs) shipFate(i, e)
      state.damage[i] = damageScalar(x.dmg)
      state.fire[i] = fireScalar(x.dmg)
      state.list[i] = x.dmg.list
    }
    AI.aaStep(sim, dt)
    // 7. the record's actions whose t was crossed
    while (sim._cursor < queue.length && queue[sim._cursor].t <= t) runAction(queue[sim._cursor++])
    if (sim.momentState && !sim.momentState.done) {
      const mq = sim._momentQueue
      while (sim._momentCursor < mq.length && mq[sim._momentCursor].t <= t) {
        const b = mq[sim._momentCursor++]
        beat(sim.player?.unitIndex ?? -1, 'moment', b.text, b.sources || null)
      }
    }
    // visual gunfire of record ships
    if (sim.visualFire) AI.visualGunfire(sim)
    // 8. fates
    AI.fates(sim, dt)
    if (sim.momentState && !sim.momentState.done) {
      const ms = sim.momentState
      ms.elapsed = t - ms.t0
      if (!ms.checkpoint && t >= ms.t1) {
        ms.checkpoint = true
        beat(sim.player?.unitIndex ?? -1, 'checkpoint', 'Checkpoint')
      }
      if (t >= clock.duration) endMoment('clock')
    }
    AI.updatePlayerState(sim)
    AI.threat(sim)
  }

  function shipFate(i, e) {
    const u = units[i]
    const o = 3 * i
    if (e.kind === 'doomed') beat(i, 'damage', `${u.name}: ${e.text}`)
    else if (e.kind === 'sink') {
      setAlive(i, 2)
      fx(FX.sink, state.pos[o], 0, state.pos[o + 2], { unit: i, size: X[i].model.L })
      beat(i, 'sinks', `${u.name}: ${e.text}`)
      X[i].sunkAt = sim.t
    } else if (e.kind === 'gone') setAlive(i, 0)
  }
  sim._shipFate = shipFate

  // --- projectiles ----------------------------------------------------------------------------------------
  function stepProjectiles(dt) {
    const pr = projectiles
    if (!pr.count) return
    for (let p = 0; p < pr.capacity; p++) {
      if (!pr.alive[p]) continue
      const k = pr.kind[p]
      const o = 3 * p
      if (k === KIND.shell) {
        const wi = pr.weapon[p]
        flyShell(pr, p, sim.weaponList[wi].shell, dt, prev)
        if (pr.flags[p] & FLAG.star) {
          // a star shell bursts when its time fuze runs out (or at the top of its flight without one) and hangs
          if (pr.life[p] > 0 ? sim.t - pr.born[p] >= pr.life[p] || (pr.vel[o + 1] < 0 && pr.pos[o + 1] < 250) : pr.vel[o + 1] < 0) {
            fx(FX.starshell, pr.pos[o], pr.pos[o + 1], pr.pos[o + 2], { unit: pr.owner[p], size: 45 })
            sight.addLight(pr.pos[o], 0, pr.pos[o + 2], 1800, sim.t + 45, 'starshell')
            pr.kill(p)
          }
          continue
        }
        shellHits(p, dt)
      } else if (k === KIND.bullet) {
        flyLight(pr, p, bulletK(pr.calibreMm[p]), dt, prev)
        pr.life[p] -= dt
        bulletHits(p)
        if (pr.alive[p] && (pr.life[p] <= 0 || pr.pos[o + 1] < world.heightAt(pr.pos[o], pr.pos[o + 2]))) {
          if (pr.pos[o + 1] < 1 && pr.flags[p] & FLAG.player) fx(FX.splash, pr.pos[o], 0, pr.pos[o + 2], { size: 2 })
          pr.kill(p)
        }
      } else if (k === KIND.bomb) {
        const w = sim.weaponList[pr.weapon[p]]?.w
        flyLight(pr, p, bombK(w?.massKg ?? 250), dt, prev)
        bombHits(p)
      } else if (k === KIND.torpedo) {
        runTorpedo(pr, p, dt, prev)
        if (pr.aux[p] > (pr.flags[p] & FLAG.armed ? 0 : 1e9)) {
          // (armed below)
        }
        const w = sim.weaponList[pr.weapon[p]]?.w
        if (!(pr.flags[p] & FLAG.armed) && pr.aux[p] >= (w?.armRunM ?? 300)) pr.flags[p] |= FLAG.armed
        torpedoHits(p)
        if (pr.alive[p] && (pr.life[p] <= 0 || world.metresAt(pr.pos[o], pr.pos[o + 2]) > -2)) {
          if (world.metresAt(pr.pos[o], pr.pos[o + 2]) > -2) fx(FX.splash, pr.pos[o], 0, pr.pos[o + 2], { size: 8 })
          pr.kill(p)
        }
      }
    }
  }

  /** The ships near a point, as candidates for a hit test. */
  function shipsNear(x, z, r) {
    const out = []
    for (let i = 0; i < N; i++) {
      if (units[i].kind !== 'ship' || state.alive[i] !== 1) continue
      const dx = state.pos[3 * i] - x
      const dz = state.pos[3 * i + 2] - z
      const L = X[i].model.L
      if (dx * dx + dz * dz < (r + L) * (r + L)) out.push(i)
    }
    return out
  }
  sim._shipsNear = shipsNear

  function boxOf(i) {
    const h = X[i].model.half
    return h
  }

  /**
   * A segment against a ship: the hull's box, then the superstructure's.
   * out: { s, lx, ly, lz, part } with lz from amidships (toward the stern).
   * yLo: the hull box's floor for this test.
   */
  const supOut = { s: 0, lx: 0, ly: 0, lz: 0 }
  function shipHit(i, ax, ay, az, bx, by, bz, out, yLo = null) {
    const m = X[i].model
    const h = m.half
    const cx = state.pos[3 * i]
    const cz = state.pos[3 * i + 2]
    const hd = state.heading[i]
    const sink = state.pos[3 * i + 1]
    const s1 = segmentBox(ax, ay - sink, az, bx, by - sink, bz, cx, cz, hd, h.x, h.z, yLo ?? h.yLo, h.yHi, out)
    const sp = m.sup
    let s2 = -1
    if (sp) {
      const zc = (sp.z0 + sp.z1) / 2
      const r = hd * DEG
      // the box's centre: zc toward the stern and xc to starboard of the ship's centre
      const ox = -Math.sin(r) * zc + Math.cos(r) * sp.xc
      const oz = Math.cos(r) * zc + Math.sin(r) * sp.xc
      s2 = segmentBox(ax, ay - sink, az, bx, by - sink, bz, cx + ox, cz + oz, hd, sp.x, (sp.z1 - sp.z0) / 2, sp.yLo, sp.yHi, supOut)
      if (s2 >= 0) {
        supOut.lz += zc
        supOut.lx += sp.xc
      }
    }
    if (s1 < 0 && s2 < 0) return -1
    if (s1 >= 0 && (s2 < 0 || s1 <= s2)) {
      out.part = out.ly < 1 ? 'waterline' : 'hull'
      return s1
    }
    out.s = supOut.s
    out.lx = supOut.lx
    out.ly = supOut.ly
    out.lz = supOut.lz
    out.part = 'super'
    return s2
  }
  sim._shipHit = shipHit

  function shellHits(p, dt) {
    const pr = projectiles
    const o = 3 * p
    const x1 = pr.pos[o]
    const y1 = pr.pos[o + 1]
    const z1 = pr.pos[o + 2]
    const visual = pr.flags[p] & FLAG.visual
    // ships first (the segment may run on below the surface: a shell falling short can strike the side)
    if (y1 < 80) {
      for (const i of shipsNear(x1, z1, 400)) {
        if (i === pr.owner[p]) continue
        const s = shipHit(i, prev[0], prev[1], prev[2], x1, y1, z1, hitOut, X[i].model.half.yLo * 0.5)
        if (s >= 0) {
          const hx = prev[0] + (x1 - prev[0]) * s
          const hy = prev[1] + (y1 - prev[1]) * s
          const hz = prev[2] + (z1 - prev[2]) * s
          if (visual) {
            if (pr.flags[p] & FLAG.hit || R.fx.next() < 0.3) fx(FX.hit, hx, Math.max(hy, 2), hz, { unit: i, size: pr.calibreMm[p] / 100 })
            else fx(FX.splash, hx, 0, hz, { size: pr.calibreMm[p] / 6, data: shellDye(p) })
          } else shellStrike(p, i, hx, hy, hz, hitOut)
          pr.kill(p)
          return
        }
      }
    }
    if (y1 < 0) {
      const f = prev[1] / (prev[1] - y1)
      const sx = prev[0] + (x1 - prev[0]) * f
      const sz = prev[2] + (z1 - prev[2]) * f
      if (world.metresAt(sx, sz) > 0) fx(FX.explode, sx, world.heightAt(sx, sz), sz, { size: pr.calibreMm[p] / 200 })
      else fx(FX.splash, sx, 0, sz, { size: pr.calibreMm[p] / 6, data: shellDye(p) })
      if (!visual) AI.shellFell(sim, p, sx, sz)
      pr.kill(p)
    }
  }
  const shellDye = (p) => {
    if (sight.light !== 'day') return 0
    const o = projectiles.owner[p]
    if (o < 0) return 0
    const x = X[o]
    const dyes = x.model?.dyes || {}
    const name = x.rec?.dye ?? dyes[units[o].name] ?? null
    return dyeCode(name)
  }

  function shellStrike(p, i, hx, hy, hz, local) {
    const pr = projectiles
    const x = X[i]
    const u = units[i]
    const m = x.model
    const wi = pr.weapon[p]
    const w = sim.weaponList[wi]
    fx(FX.hit, hx, Math.max(2, hy), hz, { unit: i, size: pr.calibreMm[p] / 100 })
    if (!u.target || state.alive[i] !== 1) return
    const owner = pr.owner[p]
    const byPlayer = !!(pr.flags[p] & FLAG.player)
    if (byPlayer && x.rec?.fixed) return
    touch(i, byPlayer ? 'player' : 'ai')
    const zone = clamp(Math.floor((local.lz / m.L + 0.5) * 4), 0, 3)
    const part = local.part ?? (local.ly < 1 ? 'waterline' : 'hull')
    const range = owner >= 0 ? Math.hypot(state.pos[3 * owner] - hx, state.pos[3 * owner + 2] - hz) : 10000
    const said = applyHit(x.dmg, m, { cls: w.cls, part, zone, side: local.lx >= 0 ? 1 : -1, calibreMm: pr.calibreMm[p], ap: w.w.shell === 'ap' || pr.calibreMm[p] >= 200, rangeM: range, t: sim.t }, R.dmg)
    const where = zone === 0 ? 'forward' : zone === 3 ? 'aft' : 'amidships'
    if (byPlayer || said) beat(i, 'hit', `${u.name}: hit ${part === 'super' ? 'in the superstructure' : part === 'waterline' ? 'at the waterline' : where}${said ? `, ${said}` : ''}`)
    if (byPlayer) {
      AI.scoreHit(sim, i, 'shell')
      engage(i)
      AI.firedOn(sim, i, hx, hz)
    }
  }
  sim._shellStrike = shellStrike

  function bulletHits(p) {
    const pr = projectiles
    const o = 3 * p
    const x1 = pr.pos[o]
    const y1 = pr.pos[o + 1]
    const z1 = pr.pos[o + 2]
    const owner = pr.owner[p]
    const side = owner >= 0 ? units[owner].side : null
    const tgt = pr.target[p]
    const cands = tgt >= 0 ? [tgt] : AI.aircraftNear(sim, x1, y1, z1, 400)
    for (const i of cands) {
      if (i === owner || state.alive[i] !== 1 || units[i].kind !== 'aircraft' || units[i].side === side) continue
      const m = X[i].model
      const r = Math.max(m.span, m.length) * 0.42
      const d2 = segmentPoint(prev[0], prev[1], prev[2], x1, y1, z1, state.pos[3 * i], state.pos[3 * i + 1], state.pos[3 * i + 2], hitOut)
      if (d2 < r * r) {
        AI.bulletStrike(sim, p, i)
        pr.kill(p)
        return
      }
    }
    // strafing: rounds into a ship register nothing beyond a flash
    if (y1 < 40 && pr.flags[p] & FLAG.player) {
      for (const i of shipsNear(x1, z1, 50)) {
        if (shipHit(i, prev[0], prev[1], prev[2], x1, y1, z1, hitOut, 0) >= 0) {
          fx(FX.hit, x1, Math.max(2, y1), z1, { unit: i, size: 0.1 })
          pr.kill(p)
          return
        }
      }
    }
  }

  function bombHits(p) {
    const pr = projectiles
    const o = 3 * p
    const x1 = pr.pos[o]
    const y1 = pr.pos[o + 1]
    const z1 = pr.pos[o + 2]
    const w = sim.weaponList[pr.weapon[p]]
    if (y1 < 60) {
      for (const i of shipsNear(x1, z1, 200)) {
        const s = shipHit(i, prev[0], prev[1], prev[2], x1, y1, z1, hitOut, 0)
        if (s >= 0) {
          const hx = prev[0] + (x1 - prev[0]) * s
          const hy = prev[1] + (y1 - prev[1]) * s
          const hz = prev[2] + (z1 - prev[2]) * s
          fx(FX.explode, hx, Math.max(hy, 2), hz, { unit: i, size: 1.5 })
          fx(FX.hit, hx, Math.max(hy, 2), hz, { unit: i, size: 1 })
          if (!(pr.flags[p] & FLAG.visual)) AI.bombStrike(sim, p, i, hitOut, w)
          pr.kill(p)
          return
        }
      }
    }
    const ground = world.heightAt(x1, z1)
    if (y1 <= ground) {
      if (world.metresAt(x1, z1) > 0) fx(FX.explode, x1, ground, z1, { size: 1.2 })
      else fx(FX.splash, x1, 0, z1, { size: 25, data: 0 })
      if (!(pr.flags[p] & FLAG.visual)) AI.bombFell(sim, p, x1, z1, w)
      pr.kill(p)
    }
  }

  function torpedoHits(p) {
    const pr = projectiles
    const o = 3 * p
    const x1 = pr.pos[o]
    const z1 = pr.pos[o + 2]
    for (const i of shipsNear(x1, z1, 150)) {
      if (i === pr.owner[p]) continue
      const h = boxOf(i)
      const s = segmentBox(prev[0], -2, prev[2], x1, -2, z1, state.pos[3 * i], state.pos[3 * i + 2], state.heading[i], h.x, h.z, -X[i].model.T, 2, hitOut)
      if (s < 0) continue
      const hx = prev[0] + (x1 - prev[0]) * s
      const hz = prev[2] + (z1 - prev[2]) * s
      const armed = pr.flags[p] & FLAG.armed
      const dud = pr.flags[p] & FLAG.dud
      if (pr.flags[p] & FLAG.visual) {
        if (pr.flags[p] & FLAG.hit && armed) fx(FX.splash, hx, 0, hz, { unit: i, size: 70 })
        pr.kill(p)
        return
      }
      if (!armed || dud) {
        fx(FX.hit, hx, 0, hz, { unit: i, size: 0.2 })
        beat(i, 'torpedo', `${units[i].name}: a torpedo struck and did not explode`)
        pr.kill(p)
        return
      }
      fx(FX.splash, hx, 0, hz, { unit: i, size: 70 })
      AI.torpedoStrike(sim, p, i, hitOut)
      pr.kill(p)
      return
    }
  }

  // --- advance -------------------------------------------------------------------------------------------------
  /** Whether nothing is under the sim's authority: the record alone, closed-form. */
  function pureRecord() {
    if (sim.player || sim.diverged) return false
    for (let p = 0; p < projectiles.capacity; p++) if (projectiles.alive[p] && !(projectiles.flags[p] & FLAG.visual)) return false
    return true
  }

  sim.advance = function advance(dtBattle) {
    if (!(dtBattle > 0)) return 0
    const end = clock.duration
    if (sim.t >= end) return 0
    // watching the record at any scale (1× to 60×): one closed-form stride with
    // the record's actions in order, visual shells flown in sub-steps
    if (pureRecord() && dtBattle > P.step * P.maxSteps) {
      const dt = Math.min(dtBattle, end - sim.t)
      const n = Math.max(1, Math.ceil(dt / (P.step * 4)))
      const big = dt > 2
      for (let k = 0; k < n; k++) step(dt / n, { recordAircraft: k === n - 1 || !big })
      sim.lag = 0
      return n
    }
    sim.lag += dtBattle
    let steps = Math.floor(sim.lag / P.step + 1e-9)
    if (steps > P.maxSteps) {
      // the rest stays in lag, but never more than a step budget's worth (the clock slows instead of spiralling)
      steps = P.maxSteps
    }
    const recordAircraft = !!sim.player || projectiles.count > 0
    for (let s = 0; s < steps && sim.t < end; s++) step(P.step, { recordAircraft: recordAircraft || s === steps - 1 })
    sim.lag -= steps * P.step
    if (sim.lag > P.step * P.maxSteps) sim.lag = P.step * P.maxSteps
    return steps
  }

  // --- picking ------------------------------------------------------------------------------------------------------
  sim.pick = function pick(o, d, { slack = 1 } = {}) {
    const ox = o.x ?? o[0]
    const oy = o.y ?? o[1]
    const oz = o.z ?? o[2]
    let dx = d.x ?? d[0]
    let dy = d.y ?? d[1]
    let dz = d.z ?? d[2]
    const L = Math.hypot(dx, dy, dz) || 1
    dx /= L
    dy /= L
    dz /= L
    let best = -1
    let bestD = Infinity
    for (let i = 0; i < N; i++) {
      if (!state.alive[i]) continue
      const u = units[i]
      const o3 = 3 * i
      if (u.kind === 'ship') {
        const h = X[i].model.half
        const s = rayBox(ox, oy, oz, dx, dy, dz, state.pos[o3], state.pos[o3 + 2], state.heading[i], h.x * slack, h.z * slack, h.yLo, h.yHi * slack + 5)
        if (s >= 0 && s < bestD) {
          bestD = s
          best = i
        }
      } else if (u.kind === 'aircraft') {
        const px = state.pos[o3] - ox
        const py = state.pos[o3 + 1] - oy
        const pz = state.pos[o3 + 2] - oz
        const along = px * dx + py * dy + pz * dz
        if (along <= 0) continue
        const m = X[i].model
        const r = Math.max(m.span, m.length) * 0.75 * slack + along * 0.004 * slack
        const d2 = px * px + py * py + pz * pz - along * along
        if (d2 < r * r && along < bestD) {
          bestD = along
          best = i
        }
      }
    }
    return best
  }

  Object.defineProperty(sim, 'score', { get: () => computeScore(sim) })
  Object.defineProperty(sim, 'outcome', { get: () => computeOutcome(sim) })

  // start at the clock's first instant
  sim.setTime(0)
  return sim
}

/** No projection given: the tangent plane at the centre of the units' first fixes. */
function guessProjection(battle, warn) {
  let n = 0
  let lon = 0
  let lat = 0
  for (const u of battle.units || []) {
    const f = u.track?.[0]?.lonlat
    if (f) {
      lon += f[0]
      lat += f[1]
      n++
    }
  }
  warn('sim: no box projection given; the tangent plane at the units’ centre is used')
  return new TangentProjection({ lon0: n ? lon / n : 0, lat0: n ? lat / n : 0 })
}
