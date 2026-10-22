// The player's unit and the AI (ENGINEERING.md §5 "The AI reacts to the
// player and only to the player", R7 §4.7): the player's ship and aircraft
// physics from player.input; AI ships that evade within ±30° and ±5 knots and
// return fire with an improving solution; CAP that engages the player with
// the same flight model and a skill; strikes on the player's ship flown with
// the real attack model and the AI's aiming errors; scripted kills
// choreographed; the AA hazard on every aircraft the AI shoots at; the
// player's state mirror and the threats that drop a compressed time scale.

import { P } from './params.js'
import { KN, DEG, G, tableFor, arcCovers, rho } from './units.js'
import { headingOf, courseVec, wrap180 } from './path.js'
import { planPos } from './record.js'
import { applyHit, speedCap, weaponClass } from './damage.js'
import { stepAir, airQuat, airFrame, instructor, stallSpeed, eulerQuat } from './aircraft.js'
import { stepShip, helmsman, telegraphFor, orderedOf } from './ship.js'
import { KIND, FLAG, muzzle, layOn, createSolution, trackTarget, noteTargetManoeuvre, correct, errorFactor } from './guns.js'
import { atRange } from './ballistics.js'
import { shipLambda, aaReach, eraFactor, aspectOf, alertAt, aaStep as hazardStep, hitDamage } from './aa.js'
import { FX } from './effects.js'
import { boxDistance } from './collide.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const toMs = (d) => Date.parse(String(d).length <= 7 ? `${d}-01T00:00Z` : String(d).length <= 10 ? `${d}T00:00Z` : d)

// --- inputs, guns, ammunition ------------------------------------------------------------

export function defaultInput(kind, x, state, i) {
  const base = { pitch: 0, roll: 0, yaw: 0, throttle: 0.8, helm: 0, telegraph: 0, aimAz: state.heading[i], aimEl: 0, aimRange: null, aa: false, aaDir: null, aaTarget: -1, fireHeld: false, fireCount: 0, bombCount: 0, torpedoCount: 0, salvoCount: 0, starshellCount: 0, look: [0, 0], view: null, aimDir: null, mode: 'aim', brakes: null, spread: 'narrow', battery: 0 }
  if (kind === 'ship') {
    base.telegraph = telegraphFor(x.model, state.speed[i])
    base.aimAz = state.heading[i] + 90
  } else base.throttle = x.body?.throttle ?? 0.8
  return base
}

/** Every mount of a ship's batteries: its bearing (relative, deg), elevation and loading. */
export function createGuns(sim, i) {
  const m = sim._X[i].model
  return m.batteries.map((b) => ({
    battery: b,
    wi: sim.weaponIdx(b.weapon),
    mounts: b.mounts.map((mt) => ({ ...mt, bearing: mt.rest, elev: 0, readyAt: sim.t + Math.random() * 0 + b.reloadS * 0.3 })),
  }))
}

export function ammoOf(model) {
  return {
    guns: model.guns.map((g) => ({ ...g, left: g.rounds * g.count })),
    bombs: model.payload.reduce((s, p) => s + p.count, 0),
    bomb: model.payload[0]?.weapon ?? null,
    torpedoes: model.torpedo ? 1 : 0,
    nextShot: 0,
  }
}

/** The moment's start: an aircraft placed relative to a unit; a ship on its own track (already). */
export function applyStart(sim, m) {
  const pl = sim.player
  if (!pl || pl.kind !== 'aircraft' || !m.start) return
  const st = m.start
  const x = sim._X[pl.unitIndex]
  const b = x.body
  let cx = 0
  let cz = 0
  const ref = st.from ? sim.record.shipById.get(st.from) : null
  if (ref) {
    cx = sim.state.pos[3 * ref.slot]
    cz = sim.state.pos[3 * ref.slot + 2]
  } else if (st.from && sim.record.siteById.get(st.from)) {
    const s = sim.record.siteById.get(st.from)
    cx = s.x
    cz = s.z
  } else if (st.lonlat) [cx, cz] = sim.proj.toWorld(st.lonlat)
  const [ux, uz] = courseVec(st.bearingDeg ?? 0)
  b.x = cx + ux * (st.rangeM ?? 0)
  b.z = cz + uz * (st.rangeM ?? 0)
  b.y = st.altM ?? b.y
  b.V = st.speedMs ?? b.V
  b.psi = (st.headingDeg ?? sim.state.heading[pl.unitIndex]) * DEG
  b.gamma = 0
  b.phi = 0
  b.p = 0
  writeAir(sim, pl.unitIndex)
  sim._setAlive(pl.unitIndex, 1)
}

// --- writing bodies into the state -----------------------------------------------------------------

function writeAir(sim, i) {
  const x = sim._X[i]
  const b = x.body
  const s = sim.state
  const o = 3 * i
  s.pos[o] = b.x
  s.pos[o + 1] = b.y
  s.pos[o + 2] = b.z
  const ch = Math.cos(b.gamma) * b.V
  s.vel[o] = ch * Math.sin(b.psi)
  s.vel[o + 1] = Math.sin(b.gamma) * b.V
  s.vel[o + 2] = -ch * Math.cos(b.psi)
  s.speed[i] = b.V
  s.heading[i] = (b.psi / DEG + 360) % 360
  airQuat(b, s.quat, 4 * i)
  s.damage[i] = Math.min(1, b.damage)
  s.fire[i] = b.burning > 0 ? 1 : 0
}

function writeShip(sim, i) {
  const x = sim._X[i]
  const b = x.body
  const s = sim.state
  const o = 3 * i
  s.pos[o] = b.x
  s.pos[o + 2] = b.z
  const sinking = x.dmg?.sinking
  let y = 0
  let pitch = 0
  let roll = x.dmg ? x.dmg.list : 0
  if (sinking) {
    const k = clamp((sim.t - x.dmg.sinkAt) / Math.max(1, x.dmg.goneAt - x.dmg.sinkAt), 0, 1)
    y = -(x.model.top + x.model.T + 4) * k * k
    pitch = x.dmg.sinkHow === 'capsizes' ? 0.05 * k : 0.15 * k
    roll += x.dmg.sinkHow === 'capsizes' ? 120 * k * Math.sign(roll || 1) : 6 * k
  }
  s.pos[o + 1] = y
  const h = b.heading * DEG
  s.vel[o] = b.V * Math.sin(h)
  s.vel[o + 1] = 0
  s.vel[o + 2] = -b.V * Math.cos(h)
  s.speed[i] = Math.abs(b.V)
  s.heading[i] = b.heading
  s.list[i] = x.dmg ? x.dmg.list : 0
  eulerQuat(-h, pitch, -roll * DEG, s.quat, 4 * i)
}

/** A mount's world position on its ship. */
function mountPos(sim, i, mt) {
  const s = sim.state
  const h = s.heading[i] * DEG
  const fx = Math.sin(h)
  const fz = -Math.cos(h)
  // model frame: x starboard, z toward the stern (bow −z)
  return [s.pos[3 * i] + Math.cos(h) * mt.x - fx * mt.z, mt.y, s.pos[3 * i + 2] + Math.sin(h) * mt.x - fz * mt.z]
}

// --- the per-step list of airborne aircraft --------------------------------------------------------

function airList(sim) {
  const s = sim.state
  const out = sim._air || (sim._air = [])
  out.length = 0
  for (let i = 0; i < sim.capacity; i++) if (s.alive[i] === 1 && sim.units[i].kind === 'aircraft' && !sim.units[i].parked) out.push(i)
  return out
}

export function aircraftNear(sim, x, y, z, r) {
  const s = sim.state
  const out = []
  const r2 = r * r
  for (const i of sim._air || []) {
    const dx = s.pos[3 * i] - x
    const dy = s.pos[3 * i + 1] - y
    const dz = s.pos[3 * i + 2] - z
    if (dx * dx + dy * dy + dz * dz < r2) out.push(i)
  }
  return out
}

// --- 2. AI decisions -----------------------------------------------------------------------------------

export function think(sim, dt) {
  airList(sim)
  const s = sim.state
  const pl = sim.player
  const X = sim._X
  // who engages the player (once a second)
  sim._thinkT = (sim._thinkT ?? 0) - dt
  if (sim._thinkT <= 0) {
    sim._thinkT = 1
    if (pl && s.alive[pl.unitIndex] === 1) recruit(sim)
    signalRaids(sim)
  }
  for (let i = 0; i < sim.capacity; i++) {
    const u = sim.units[i]
    if (u.authority !== 'ai' || !s.alive[i]) continue
    const x = X[i]
    if (u.kind === 'ship') shipThink(sim, i, x, dt)
    else if (s.alive[i] === 1) airThink(sim, i, x, dt)
  }
}

/** The CAP within reach turns on the player's aircraft; a strike sent at the player's ship becomes real. */
function recruit(sim) {
  const pl = sim.player
  const s = sim.state
  const X = sim._X
  const pi = pl.unitIndex
  const pu = sim.units[pi]
  const px = s.pos[3 * pi]
  const py = s.pos[3 * pi + 1]
  const pz = s.pos[3 * pi + 2]
  if (pl.kind === 'aircraft') {
    let fighting = 0
    for (const i of sim._air) if (sim.units[i].authority === 'ai' && X[i].ai?.mode === 'fight' && X[i].ai.target === pi) fighting++
    if (fighting < 4) {
      const cand = []
      for (const i of sim._air) {
        const u = sim.units[i]
        if (u.authority !== 'record' || u.side === pu.side) continue
        const g = X[i].g
        const prof = g?.attack?.profile
        if (prof !== 'cap' && prof !== 'escort' && X[i].model.type !== 'fighter') continue
        const d = Math.hypot(s.pos[3 * i] - px, s.pos[3 * i + 1] - py, s.pos[3 * i + 2] - pz)
        if (d > P.cap.engageRadiusM) continue
        if (!sim.sight.sees({ x: s.pos[3 * i], y: s.pos[3 * i + 1], z: s.pos[3 * i + 2], sensors: [] }, { x: px, y: py, z: pz, big: false, aircraft: true })) continue
        cand.push([d, i])
      }
      cand.sort((a, b) => a[0] - b[0])
      for (const [, i] of cand.slice(0, 4 - fighting)) {
        sim._toAI(i)
        X[i].ai.mode = 'fight'
        X[i].ai.target = pi
      }
    }
    // the wingman: a fighter of the player's own group turns into an enemy on the player's tail
    if (pu.groupIndex >= 0 && X[pi].model.type === 'fighter') {
      const tail = sim._air.find((i) => sim.units[i].authority === 'ai' && X[i].ai?.mode === 'fight' && X[i].ai.target === pi && Math.hypot(s.pos[3 * i] - px, s.pos[3 * i + 2] - pz) < 1200)
      if (tail != null) {
        const mate = sim._air.find((i) => i !== pi && sim.units[i].groupIndex === pu.groupIndex && (sim.units[i].authority === 'record' || X[i].ai?.mode === 'rejoin'))
        if (mate != null && !sim._air.some((i) => X[i].ai?.mode === 'fight' && X[i].ai.target === tail && sim.units[i].side === pu.side)) {
          sim._toAI(mate)
          X[mate].ai.mode = 'fight'
          X[mate].ai.target = tail
        }
      }
    }
  } else {
    // strikes sent at the player's ship: real from 150 s before their attack
    for (const g of sim.record.groups) {
      if (g.attack?.targetUnit < 0 || sim.record.ships[g.attack.targetUnit]?.slot !== pi) continue
      for (const ac of g.aircraft) {
        const i = ac.slot
        if (i == null || sim.units[i].authority !== 'record' || s.alive[i] !== 1) continue
        if (ac.releaseT == null || sim.t < ac.releaseT - 150 || sim.t > ac.releaseT + 30) continue
        sim._toAI(i)
        X[i].ai.mode = g.attack.profile === 'torpedo' ? 'torpedo' : g.attack.profile === 'level' ? 'level' : 'dive'
        X[i].ai.target = pi
        X[i].ai.from = g.attack.fromDeg ?? headingOf(s.pos[3 * i] - s.pos[3 * pi], s.pos[3 * i + 2] - s.pos[3 * pi + 2])
        X[i].ai.pushOver = g.attack.pushOverM ?? Math.max(1500, s.pos[3 * i + 1])
        X[i].ai.releaseM = g.attack.releaseM ?? 600
      }
    }
  }
}

/** A Japanese ship that sights a raid fires two bursts toward it, and the CAP turns to them (R7 §4.6). */
function signalRaids(sim) {
  const s = sim.state
  const X = sim._X
  sim._signalled ||= new Set()
  for (const r of sim.record.ships) {
    const i = r.slot
    if (r.side !== 'jp' || s.alive[i] !== 1 || sim.units[i].kind !== 'ship') continue
    for (const g of sim.record.groups) {
      if (g.side === 'jp' || sim._signalled.has(`${i}:${g.index}`)) continue
      const lead = g.aircraft.find((ac) => ac.slot != null && s.alive[ac.slot] === 1)
      if (!lead) continue
      const j = lead.slot
      const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
      if (d > 15000 || !sim.sight.sees({ x: s.pos[3 * i], y: 30, z: s.pos[3 * i + 2], sensors: [] }, { x: s.pos[3 * j], y: s.pos[3 * j + 1], z: s.pos[3 * j + 2], big: true, aircraft: true })) continue
      sim._signalled.add(`${i}:${g.index}`)
      const k = 2500 / d
      for (let n = 0; n < 2; n++) sim.fx(FX.flash, s.pos[3 * i] + (s.pos[3 * j] - s.pos[3 * i]) * k + n * 60, Math.min(3000, s.pos[3 * j + 1] * 0.6), s.pos[3 * i + 2] + (s.pos[3 * j + 2] - s.pos[3 * i + 2]) * k, { unit: i, size: 2, data: 1 })
      X[i].sighted ??= {}
      X[i].sighted[g.index] = sim.t
    }
  }
}

export function createShipAI(sim, i) {
  return { engaged: false, evadeUntil: -1, evadeTurn: 0, evadeDv: 0, sol: createSolution(P.aiGun), guns: createGuns(sim, i), target: -1, salvos: new Map(), lastSeenT: -1e9 }
}

/** An AI ship: its track (with the evasion the player's fire provokes), and its guns at the player. */
function shipThink(sim, i, x, dt) {
  const s = sim.state
  const ai = x.ai
  const r = x.rec
  // the record's way ahead: a point a minute on along its track
  const pose = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }
  let wantH = s.heading[i]
  let wantV = s.speed[i]
  if (r && (r.track || r.station)) {
    sim.record.motion.pose(r.index, sim.t + 60, pose)
    const dx = pose.x - x.body.x
    const dz = pose.z - x.body.z
    wantH = Math.hypot(dx, dz) > 50 ? headingOf(dx, dz) : pose.heading
    sim.record.motion.pose(r.index, sim.t, pose)
    wantV = Math.max(pose.speed, 0)
    // catch up or ease off to the record's place
    const lag = Math.hypot(pose.x - x.body.x, pose.z - x.body.z)
    if (lag > 300) wantV = Math.min(x.model.vmax, wantV + Math.min(5 * KN, lag / 300))
  }
  if (sim.t < ai.evadeUntil) {
    wantH = (pose.heading + ai.evadeTurn + 360) % 360
    wantV = clamp(wantV + ai.evadeDv, 0, x.model.vmax)
  }
  const cmd = helmsman(x.body, x.model, wantH, wantV)
  ai.helm = cmd.helm
  ai.telegraph = cmd.telegraph
  // gunnery at the player's ship
  const pl = sim.player
  if (!pl || pl.kind !== 'ship' || !ai.engaged || x.dmg?.out || x.dmg?.sinking) return
  const ti = pl.unitIndex
  if (s.alive[ti] !== 1 || sim.units[ti].side === sim.units[i].side) return
  const tx = s.pos[3 * ti]
  const tz = s.pos[3 * ti + 2]
  const obs = { x: s.pos[3 * i], y: x.model.top * 0.8, z: s.pos[3 * i + 2], sensors: x.model.sensors }
  const seen = sim.sight.sees(obs, { x: tx, y: 10, z: tz, big: true, lit: sim._X[ti].litUntil > sim.t })
  if (!seen) return
  ai.lastSeenT = sim.t
  trackTarget(ai.sol, s.vel[3 * ti], s.vel[3 * ti + 2], dt, P.aiGun.leadLagS)
  noteTargetManoeuvre(ai.sol, P.aiGun, s.heading[ti], s.speed[ti] / KN, sim.t)
  for (const bg of ai.guns) {
    const b = bg.battery
    const R0 = Math.hypot(tx - s.pos[3 * i], tz - s.pos[3 * i + 2])
    if (R0 > b.table.maxRange * 0.98) continue
    if (b.role !== 'main' && ai.guns[0].battery.table.maxRange > R0 && ai.guns[0].mounts.some((m) => m.readyAt > sim.t)) continue
    const ready = bg.mounts.filter((mt) => mt.readyAt <= sim.t && bearsOn(sim, i, mt, tx, tz))
    if (!ready.length || ready.length < Math.ceil(bg.mounts.length * 0.3)) continue
    aiSalvo(sim, i, x, bg, ready, ti, seen)
    break
  }
}

/** Whether a mount's arc covers a point. */
function bearsOn(sim, i, mt, tx, tz) {
  const s = sim.state
  const brg = headingOf(tx - s.pos[3 * i], tz - s.pos[3 * i + 2])
  return arcCovers(mt.arc, (brg - s.heading[i] + 360) % 360)
}

/** One AI salvo with its solution error (ENGINEERING §5). */
function aiSalvo(sim, i, x, bg, mounts, ti, seen) {
  const s = sim.state
  const ai = x.ai
  const b = bg.battery
  const w = b.weapon
  const tbl = b.table
  const sol = ai.sol
  // the predicted point: the target's position at the time of flight, on the director's lagged estimate of its motion
  let ax = s.pos[3 * ti]
  let az = s.pos[3 * ti + 2]
  for (let it = 0; it < 2; it++) {
    const lay = layOn(tbl, s.pos[3 * i], s.pos[3 * i + 2], ax, az)
    if (!lay) return
    ax = s.pos[3 * ti] + sol.vx * lay.tof
    az = s.pos[3 * ti + 2] + sol.vz * lay.tof
  }
  const g = sim.rngs.gun
  const R0 = Math.hypot(ax - s.pos[3 * i], az - s.pos[3 * i + 2])
  const guided = sim.aid === 'guided' ? 2 : 1
  // can the fall be seen: daylight, the target lit, or a radar that sees splashes
  const canSpot = sim.sight.light === 'day' || sim._X[ti].litUntil > sim.t || sim.sight.lit(ax, 0, az) || (seen.how === 'radar' && P.aiGun.spotNightRadar)
  const k = errorFactor(sol, P.aiGun, sim.t, canSpot) * guided
  const sR = (sol.rangePct * k * R0) / 100
  const sD = (sol.mils * k * R0) / 1000
  const share = P.aiGun.turretShare
  const common = Math.sqrt(Math.max(0, 1 - share * share))
  const eR = g.gauss() * sR * common
  const eD = g.gauss() * sD * common
  const brg = headingOf(ax - s.pos[3 * i], az - s.pos[3 * i + 2])
  const [ux, uz] = courseVec(brg)
  const px = ax + ux * eR + uz * -eD
  const pz = az + uz * eR - ux * -eD
  const salvo = sim._salvo++
  ai.salvos.set(salvo, { seenAtFire: seen.how, t: sim.t, x: px, z: pz })
  // each turret lays on the salvo's point with its own share of the error
  fireMounts(sim, i, bg, mounts, px, pz, { salvo, target: ti, player: false, mountError: () => [g.gauss() * sR * share, g.gauss() * sD * share], ux, uz })
  sol.salvos++
}

/** Fire mounts at a point, each shell about the salvo's mean point with the historical dispersion. */
function fireMounts(sim, i, bg, mounts, px0, pz0, { salvo, target, player, star = false, fuze = 0, mountError = null, ux = 0, uz = 0 }) {
  const s = sim.state
  const b = bg.battery
  const w = b.weapon
  const tbl = b.table
  const disp = w.dispersion || { rangePct: 1.2, mils: 2.5 }
  const g = sim.rngs.gun
  const vx = s.vel[3 * i]
  const vz = s.vel[3 * i + 2]
  let fired = 0
  for (const mt of mounts) {
    const [mx, my, mz] = mountPos(sim, i, mt)
    let px = px0
    let pz = pz0
    if (mountError) {
      const [er, ed] = mountError()
      px += ux * er + uz * -ed
      pz += uz * er - ux * -ed
    }
    // the director allows for own ship's motion: the shell keeps the ship's velocity through its flight
    let lay = layOn(tbl, mx, mz, px, pz)
    if (!lay) continue
    // (drag takes the ship's velocity off the shell as it takes its own: the drift is v·tof times the share of its horizontal speed it keeps)
    const keep = lay.range / Math.max(1, w.mvMs * Math.cos(lay.el * DEG) * lay.tof)
    lay = layOn(tbl, mx, mz, px - vx * lay.tof * keep, pz - vz * lay.tof * keep) || lay
    mt.bearing = (lay.az - s.heading[i] + 360) % 360
    mt.elev = lay.el
    mt.readyAt = sim.t + b.reloadS
    for (let k = 0; k < b.barrels; k++) {
      const sR = ((disp.rangePct / 100) * lay.range) / 3.5
      const dEl = (g.gauss() * sR) / Math.max(1, lay.dRdE)
      const dAz = (g.gauss() * disp.mils) / 3.5 / 1000 / DEG
      const [ux, uy, uz] = muzzle(w.mvMs, lay.az + dAz, lay.el + dEl, vx, vz)
      const p = sim.projectiles.spawn(KIND.shell, mx, my, mz, ux, uy, uz, { calibreMm: w.calibreMm, owner: i, weapon: bg.wi, t: sim.t, salvo, target, flags: (player ? FLAG.player : 0) | (star ? FLAG.star : 0), life: fuze })
      if (p >= 0) fired++
    }
    sim.fx(FX.flash, mx, my + 2, mz, { unit: i, dx: Math.sin(lay.az * DEG), dz: -Math.cos(lay.az * DEG), size: w.calibreMm / 100 })
  }
  // a gun flash reveals the firer for a few seconds (R7 §4.9)
  sim._X[i].litUntil = sim.t + P.sight.flashRevealS
  if (sim.sight.light !== 'day') sim.sight.addLight(s.pos[3 * i], 30, s.pos[3 * i + 2], 400, sim.t + P.sight.flashRevealS, 'flash')
  return fired
}

export function createAirAI(sim, i, { rejoin = false } = {}) {
  const veteran = sim.units[i].side === 'jp' && sim.year <= 1942
  const r = sim.rngs.ai
  return {
    mode: rejoin ? 'rejoin' : 'fight',
    target: -1,
    reaction: veteran ? P.cap.reactionS[0] : P.cap.reactionS[0] + r.next() * (P.cap.reactionS[1] - P.cap.reactionS[0]),
    leadMils: veteran ? P.cap.leadMils[0] : P.cap.leadMils[0] + r.next() * (P.cap.leadMils[1] - P.cap.leadMils[0]),
    maxG: veteran ? P.cap.maxG[1] : P.cap.maxG[0],
    aimAt: 0,
    aim: [0, 0, -1],
    leadErr: [0, 0],
    burstUntil: -1,
    nextBurst: 0,
    breakUntil: -1,
    phase: 'approach',
    released: false,
  }
}

/** An AI aircraft's aim for this step: pursuit, an attack on the player's ship, or the way back to its plan. */
function airThink(sim, i, x, dt) {
  const s = sim.state
  const ai = x.ai
  const b = x.body
  const t = sim.t
  const me = [b.x, b.y, b.z]
  if (ai.mode === 'fight') {
    const ti = ai.target
    if (ti < 0 || s.alive[ti] !== 1 || !x.ammo || x.ammo.guns.every((g) => g.left <= 0) || b.damage > 0.5) {
      ai.mode = 'rejoin'
      return
    }
    // a reaction time: the aim is refreshed every `reaction` seconds with a lead error
    if (t >= ai.aimAt) {
      ai.aimAt = t + ai.reaction
      const tx = s.pos[3 * ti]
      const ty = s.pos[3 * ti + 1]
      const tz = s.pos[3 * ti + 2]
      const d = Math.hypot(tx - b.x, ty - b.y, tz - b.z)
      const mv = x.model.guns[0]?.weapon?.mvMs ?? 800
      const tof = d / (mv + b.V)
      const g = sim.rngs.ai
      ai.leadErr = [g.gauss() * ai.leadMils * 1e-3 * d, g.gauss() * ai.leadMils * 1e-3 * d]
      ai.tgt = [tx + s.vel[3 * ti] * tof + ai.leadErr[0], ty + s.vel[3 * ti + 1] * tof + ai.leadErr[1], tz + s.vel[3 * ti + 2] * tof]
      ai.dist = d
    }
    if (t < ai.breakUntil) {
      // pulling clear after a run: up and away, then round again
      ai.aim = [Math.sin(b.psi) * 0.6, 0.8, -Math.cos(b.psi) * 0.6]
      return
    }
    ai.aim = [ai.tgt[0] - b.x, ai.tgt[1] - b.y, ai.tgt[2] - b.z]
    const f = airFrame(b).f
    const L = Math.hypot(...ai.aim) || 1
    const err = Math.acos(clamp((ai.aim[0] * f[0] + ai.aim[1] * f[1] + ai.aim[2] * f[2]) / L, -1, 1)) / DEG
    if (ai.dist < P.cap.fireRangeM && err < P.cap.leadTolDeg * 3 && t >= ai.nextBurst) {
      ai.burstUntil = t + P.cap.burstS[0] + sim.rngs.ai.next() * (P.cap.burstS[1] - P.cap.burstS[0])
      ai.nextBurst = ai.burstUntil + 1.5
    }
    if (ai.dist < 120) ai.breakUntil = t + 4
    return
  }
  if (ai.mode === 'dive' || ai.mode === 'torpedo' || ai.mode === 'level') return attackThink(sim, i, x, dt)
  // rejoin: back to the plan's place; the record takes over within 300 m
  if (x.ac && x.ac.plan) {
    const p = { x: 0, y: 0, z: 0 }
    planPos(x.ac, t + 20, p, { motion: sim.record.motion, groups: sim.record.groups })
    ai.aim = [p.x - b.x, p.y - b.y, p.z - b.z]
    const d = Math.hypot(...ai.aim)
    if (d < 300 && !x.lostAt && sim.units[i].authority === 'ai' && t < x.ac.endT) {
      sim.units[i].authority = 'record'
      x.prev = null
      x.body = null
      x.ai = null
    }
  } else {
    ai.aim = [Math.sin(b.psi), 0, -Math.cos(b.psi)]
  }
}

/** A strike on the player's ship, flown with the real attack model and the AI's aiming errors (R7 §4.7). */
function attackThink(sim, i, x, dt) {
  const s = sim.state
  const ai = x.ai
  const b = x.body
  const ti = ai.target
  if (ti < 0 || s.alive[ti] !== 1) {
    ai.mode = 'rejoin'
    return
  }
  const tx = s.pos[3 * ti]
  const tz = s.pos[3 * ti + 2]
  const tvx = s.vel[3 * ti]
  const tvz = s.vel[3 * ti + 2]
  const [ux, uz] = courseVec(ai.from)
  const g = sim.rngs.ai
  if (ai.mode === 'dive') {
    const hp = ai.pushOver
    const hr = ai.releaseM
    const dive = 70 * DEG
    const dRel = hr / Math.tan(dive) + 150
    const push = [tx + ux * (dRel + (hp - hr) / Math.tan(dive)), hp, tz + uz * (dRel + (hp - hr) / Math.tan(dive))]
    if (ai.phase === 'approach') {
      ai.aim = [push[0] - b.x, (push[1] - b.y) * 0.5, push[2] - b.z]
      if (Math.hypot(push[0] - b.x, push[2] - b.z) < 400) ai.phase = 'dive'
    } else if (ai.phase === 'dive') {
      // the aim: the ship's predicted place at the bomb's fall, with the CCIP error the skill gives
      ai.cep ??= [g.gauss() * P.aiDive.cepVeteranM, g.gauss() * P.aiDive.cepVeteranM]
      const tf = Math.sqrt((2 * Math.max(50, b.y)) / G) * 0.8
      const aim = [tx + tvx * tf + ai.cep[0], 0, tz + tvz * tf + ai.cep[1]]
      ai.aim = [aim[0] - b.x, aim[1] - b.y, aim[2] - b.z]
      if (b.y <= hr + 20 && !ai.released) {
        dropBomb(sim, i, x, false)
        ai.released = true
        ai.phase = 'pullout'
        ai.until = sim.t + 6
      }
    } else if (ai.phase === 'pullout') {
      ai.aim = [-ux, 0.5, -uz]
      if (sim.t > ai.until) {
        ai.phase = 'egress'
        ai.mode = 'rejoin'
      }
    }
  } else if (ai.mode === 'torpedo') {
    const tor = x.model.torpedo
    const vt = ((tor?.speedKn ?? 33) || 33) * KN
    const dr = 900
    const lead = (dr / vt) * (1 + (g.gauss() * P.aiTorpedo.leadErrDeg) / 30)
    const aimP = [tx + tvx * lead, tz + tvz * lead]
    const drop = [aimP[0] + ux * dr, aimP[1] + uz * dr]
    const dd = Math.hypot(drop[0] - b.x, drop[1] - b.z)
    if (ai.phase === 'approach') {
      const far = dd > 6000
      const tgtAlt = far ? Math.max(300, b.y - 200) : 40
      ai.aim = [drop[0] + ux * 3000 - b.x, (tgtAlt - b.y) * 0.3, drop[1] + uz * 3000 - b.z]
      if (Math.hypot(drop[0] + ux * 3000 - b.x, drop[1] + uz * 3000 - b.z) < 700) ai.phase = 'run'
    } else if (ai.phase === 'run') {
      ai.aim = [aimP[0] - b.x, (Math.min(30, tor?.dropAltM ?? 30) - b.y) * 0.2, aimP[1] - b.z]
      b.throttle = 0.6
      if (dd < 150 || Math.hypot(aimP[0] - b.x, aimP[1] - b.z) < dr) {
        dropTorpedo(sim, i, x, false)
        ai.phase = 'egress'
        ai.until = sim.t + 20
      }
    } else {
      ai.aim = [-uz, 0.15, ux]
      if (sim.t > ai.until) ai.mode = 'rejoin'
    }
  } else {
    // level: over the target at height on the attack's bearing
    const h = Math.max(1500, b.y)
    const tf = Math.sqrt((2 * h) / G)
    const rel = [tx - ux * b.V * tf * -1, tz - uz * b.V * tf * -1]
    ai.aim = [rel[0] - b.x, 0, rel[1] - b.z]
    if (Math.hypot(rel[0] - b.x, rel[1] - b.z) < 120 && !ai.released) {
      dropBomb(sim, i, x, false)
      ai.released = true
      ai.mode = 'rejoin'
    }
  }
}

// --- 3. the player's physics -------------------------------------------------------------------------

export function playerStep(sim, dt) {
  const pl = sim.player
  if (!pl) return
  const i = pl.unitIndex
  const s = sim.state
  if (!s.alive[i]) return
  const x = sim._X[i]
  if (pl.kind === 'ship') return playerShip(sim, pl, i, x, dt)
  return playerAir(sim, pl, i, x, dt)
}

function playerShip(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const st = x.dmg
  if (s.alive[i] === 1) {
    stepShip(x.body, x.model, inp.helm, inp.telegraph, dt, speedCap(st, x.model, sim.t), st.rudderJam)
    grounding(sim, i, x)
  }
  writeShip(sim, i)
  if (s.alive[i] !== 1 || st.out) return
  // the batteries: traverse toward the aim within the arcs, elevate from the firing table
  const aimAz = inp.aimAz ?? s.heading[i]
  for (const bg of x.guns) {
    const b = bg.battery
    for (const mt of bg.mounts) {
      const want = (aimAz - s.heading[i] + 360) % 360
      if (arcCovers(mt.arc, want)) {
        const d = wrap180(want - mt.bearing)
        mt.bearing = (mt.bearing + clamp(d, -b.traverseDegS * dt, b.traverseDegS * dt) + 360) % 360
      }
      let el = inp.aimEl ?? 0
      if (inp.aimRange != null) {
        const row = atRange(b.table, inp.aimRange)
        el = row ? row.elev : b.maxElevDeg
      }
      mt.elev += clamp(el - mt.elev, -8 * dt, 8 * dt)
    }
  }
  // a salvo: every ready mount on the bearing of the selected battery (the main by default)
  const seen = pl._seen
  const bi = clamp(inp.battery | 0, 0, x.guns.length - 1)
  const fireNow = inp.salvoCount > seen.salvoCount || inp.fireHeld
  seen.salvoCount = inp.salvoCount
  if (fireNow && x.guns.length) {
    const bg = x.guns[bi]
    const ready = bg.mounts.filter((mt) => mt.readyAt <= sim.t && arcCovers(mt.arc, (aimAz - s.heading[i] + 360) % 360) && Math.abs(wrap180((aimAz - s.heading[i]) - mt.bearing)) < 1.5)
    if (ready.length && (!inp.fireHeld || inp.salvoCount > 0 || true)) {
      const share = st.crippled ? Math.ceil(ready.length / 2) : ready.length
      const R0 = inp.aimRange ?? (atRange(bg.battery.table, 10000) ? 10000 : bg.battery.table.maxRange * 0.5)
      const [ux, uz] = courseVec(aimAz)
      const px = s.pos[3 * i] + ux * R0
      const pz = s.pos[3 * i + 2] + uz * R0
      const salvo = sim._salvo++
      const n = fireMounts(sim, i, bg, ready.slice(0, share), px, pz, { salvo, target: -1, player: true })
      if (n) {
        const sc = sim._score
        sc.salvos++
        sc.shells += n
        const tof = atRange(bg.battery.table, R0)?.tof ?? 0
        pl.lastSalvo = { id: salvo, t: sim.t, tof, landsAt: sim.t + tof, tags: [], range: R0 }
      }
    }
  }
  // star shell from the secondary (or the main) battery
  if (inp.starshellCount > seen.starshellCount) {
    seen.starshellCount = inp.starshellCount
    const bg = x.guns.find((g) => g.battery.role !== 'main' && g.battery.weapon.calibreMm >= 100) || x.guns[0]
    if (bg) {
      const mt = bg.mounts.find((m) => m.readyAt <= sim.t && arcCovers(m.arc, (aimAz - s.heading[i] + 360) % 360))
      if (mt) {
        // a time fuze set to burst just beyond the aim, a few hundred metres up
        const R0 = Math.min((inp.aimRange ?? 8000) + 500, bg.battery.table.maxRange * 0.95)
        const [ux, uz] = courseVec(aimAz)
        const row = atRange(bg.battery.table, R0)
        fireMounts(sim, i, bg, [mt], s.pos[3 * i] + ux * R0, s.pos[3 * i + 2] + uz * R0, { salvo: sim._salvo++, target: -1, player: true, star: true, fuze: (row?.tof ?? 20) * 0.93 })
      }
    }
  }
  // torpedoes: one mount's spread per press, on the aim's bearing if the tubes bear
  if (inp.torpedoCount > seen.torpedoCount) {
    seen.torpedoCount = inp.torpedoCount
    fireShipTorpedoes(sim, i, x, aimAz, inp.aimRange, inp.spread)
  }
  // the AA: Space points every bearing mount at the pointer's aircraft for 5 s
  if (inp.aa) {
    let t = inp.aaTarget ?? -1
    if (t < 0 && inp.aaDir) t = nearestAircraftOnRay(sim, i, inp.aaDir)
    if (t >= 0) {
      pl.aaTarget = t
      pl.aaUntil = sim.t + P.aa.directS
    }
  }
}

function nearestAircraftOnRay(sim, i, d) {
  const s = sim.state
  const ox = s.pos[3 * i]
  const oy = 20
  const oz = s.pos[3 * i + 2]
  const L = Math.hypot(d[0], d[1], d[2]) || 1
  let best = -1
  let bestA = 15 * DEG
  for (const j of sim._air || []) {
    if (sim.units[j].side === sim.units[i].side) continue
    const px = s.pos[3 * j] - ox
    const py = s.pos[3 * j + 1] - oy
    const pz = s.pos[3 * j + 2] - oz
    const pl = Math.hypot(px, py, pz)
    if (pl > 8000) continue
    const a = Math.acos(clamp((px * d[0] + py * d[1] + pz * d[2]) / (pl * L), -1, 1))
    if (a < bestA) {
      bestA = a
      best = j
    }
  }
  return best
}

function fireShipTorpedoes(sim, i, x, aimAz, range, spread) {
  const s = sim.state
  const t = x.model.torp
  if (!t || !x.torpedoes || x.torpedoes.ready <= 0 || !t.weapon) return
  const rel = (aimAz - s.heading[i] + 360) % 360
  const centre = (t.side ?? 'centre') === 'centre'
  const bears = centre ? (rel >= 30 && rel <= 150) || (rel >= 210 && rel <= 330) : t.side === 'starboard' ? rel >= 30 && rel <= 150 : t.side === 'port' ? rel >= 210 && rel <= 330 : true
  if (!bears) {
    sim.player && (sim.player.notice = 'the tubes do not bear')
    return
  }
  const w = t.weapon
  const settings = w.settings?.length ? w.settings : [{ speedKn: w.speedKn ?? 40, rangeM: w.rangeM ?? 8000 }]
  const want = range ?? 6000
  const set = [...settings].sort((a, b) => b.speedKn - a.speedKn).find((st) => st.rangeM >= want * 1.05) || settings.reduce((a, b) => (b.rangeM > a.rangeM ? b : a))
  const n = t.barrels ?? 4
  const step = (spread === 'wide' ? P.torpedo.spreadWideDeg : P.torpedo.spreadNarrowDeg)
  const wi = sim.weaponIdx(w)
  const dud = failRate(w, sim.date)
  const h = s.heading[i] * DEG
  for (let k = 0; k < n; k++) {
    const a = (aimAz + (k - (n - 1) / 2) * step) * DEG
    const v = set.speedKn * KN
    const p = sim.projectiles.spawn(KIND.torpedo, s.pos[3 * i] + Math.cos(h) * 4, -P.torpedo.hitDepthM, s.pos[3 * i + 2] + Math.sin(h) * 4, Math.sin(a) * v, 0, -Math.cos(a) * v, { calibreMm: w.calibreMm ?? 533, owner: i, weapon: wi, t: sim.t, flags: FLAG.player | (sim.rngs.dmg.chance(dud) ? FLAG.dud : 0), life: set.rangeM })
    if (p >= 0) sim._score.torpedoes++
  }
  x.torpedoes.ready--
  sim.fx(FX.launch, s.pos[3 * i], 3, s.pos[3 * i + 2], { unit: i, data: 3 })
}

/** A torpedo's failure rate at the battle's date (weapons.json), or the verify default. */
export function failRate(w, date) {
  for (const f of w.failRate || []) if (date >= toMs(f.from) && date < toMs(f.to)) return f.rate ?? P.torpedo.failDefault
  return w.failRate?.length ? 0 : P.torpedo.failDefault
}

function grounding(sim, i, x) {
  const b = x.body
  const m = x.model
  const [ux, uz] = courseVec(b.heading)
  const bow = sim.world.metresAt(b.x + ux * m.L * 0.45, b.z + uz * m.L * 0.45)
  if (bow > -m.T * 0.8 && !b.aground) {
    b.aground = true
    sim.beat(i, 'aground', `${sim.units[i].name}: aground`)
  }
}

function playerAir(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const b = x.body
  if (s.alive[i] === 2) return
  let cmd = null
  if (inp.aimDir && inp.mode !== 'direct' && !b.broken) {
    cmd = instructor(b, x.model, inp.aimDir)
    if (inp.pitch) cmd.n += inp.pitch * 2
  }
  // Guided: no stall (the instructor never lets the speed die), no black-out
  if (sim.aid === 'guided' && b.V < stallSpeed(b, x.model) * 1.2) {
    if (cmd) cmd.n = Math.min(cmd.n, 1)
    b.throttle = 1
  }
  stepAir(b, x.model, inp, dt, cmd)
  if (sim.aid === 'guided') b.blackout = 0
  writeAir(sim, i)
  // the ground, the sea, a deck
  const ground = sim.world.heightAt(b.x, b.z)
  const deck = deckUnder(sim, i, b)
  if (deck && b.y <= deck.y + 1.5) {
    const slow = b.V < stallSpeed(b, x.model) * 1.6 && b.gamma > -8 * DEG
    if (slow) return landed(sim, i, deck.unit)
    return crashed(sim, i, 'struck the deck')
  }
  if (b.y <= ground + 0.5) {
    const sea = sim.world.metresAt(b.x, b.z) <= 0
    if (sea && b.V < 60 && b.gamma > -10 * DEG) return ditched(sim, i)
    return crashed(sim, i, sea ? 'went into the sea' : 'struck the ground')
  }
  if (b.broken && !x.brokenSaid) {
    x.brokenSaid = true
    sim.beat(i, 'damage', `${sim.units[i].name}: a control surface failed`)
  }
  // the guns
  const seen = pl._seen
  const firing = inp.fireHeld || inp.fireCount > seen.fireCount
  seen.fireCount = inp.fireCount
  if (firing) fireAirGuns(sim, i, x, true)
  if (inp.bombCount > seen.bombCount) {
    seen.bombCount = inp.bombCount
    dropBomb(sim, i, x, true)
  }
  if (inp.torpedoCount > seen.torpedoCount) {
    seen.torpedoCount = inp.torpedoCount
    dropTorpedo(sim, i, x, true)
  }
}

/** A carrier's deck under an aircraft: { y, unit } or null. */
function deckUnder(sim, i, b) {
  const s = sim.state
  for (const j of sim._shipsNear(b.x, b.z, 50)) {
    const m = sim._X[j].model
    if (m.fdTop == null) continue
    const d = boxDistance(b.x, b.z, s.pos[3 * j], s.pos[3 * j + 2], s.heading[j], m.B / 2, m.L / 2)
    if (d.d <= 0) return { y: m.fdTop + s.pos[3 * j + 1], unit: j }
  }
  return null
}

function landed(sim, i, unit) {
  const x = sim._X[i]
  sim.beat(i, 'landed', `${sim.units[i].name}: aboard ${sim.units[unit].name}`)
  sim._setAlive(i, 0)
  x.how = 'landed'
  sim._score.how = 'landed'
  sim._endMoment('landed')
}

function ditched(sim, i) {
  const x = sim._X[i]
  sim.fx(FX.splash, x.body.x, 0, x.body.z, { unit: i, size: 15 })
  sim.beat(i, 'ditched', `${sim.units[i].name}: ditched`)
  x.how = 'ditched'
  x.lostAt = sim.t
  sim._setAlive(i, 0)
  sim._score.how = 'ditched'
  if (sim.player?.unitIndex === i) sim._endMoment('ditched')
}

function crashed(sim, i, why) {
  const x = sim._X[i]
  const b = x.body
  b.crashed = true
  sim.fx(sim.world.metresAt(b.x, b.z) > 0 ? FX.explode : FX.splash, b.x, Math.max(0, sim.world.heightAt(b.x, b.z)), b.z, { unit: i, size: 12 })
  x.how = 'lost'
  x.lostAt ??= sim.t
  sim._setAlive(i, 0)
  if (sim.player?.unitIndex === i) {
    sim.beat(i, 'lost', `${sim.units[i].name}: ${why}`)
    sim._score.how = 'lost'
    sim._endMoment('lost')
  }
}

/** Fixed guns: tracer packets every 1/12 s from each gun group, converged at 250 m. */
function fireAirGuns(sim, i, x, player) {
  const b = x.body
  const am = x.ammo
  if (!am || sim.t < am.nextShot) return
  am.nextShot = sim.t + 1 / 12
  const fr = airFrame(b)
  const conv = P.air.gunConvergenceM
  const aimP = [b.x + fr.f[0] * conv, b.y + fr.f[1] * conv, b.z + fr.f[2] * conv]
  const vx = Math.sin(b.psi) * Math.cos(b.gamma) * b.V
  const vy = Math.sin(b.gamma) * b.V
  const vz = -Math.cos(b.psi) * Math.cos(b.gamma) * b.V
  let any = false
  for (const g of am.guns) {
    if (!g.fixed || g.left <= 0) continue
    const rounds = Math.min(g.left, (g.count * (g.weapon.rofRpm ?? 700)) / 60 / 12)
    g.left -= rounds
    const off = g.position === 'wing' ? x.model.span * 0.28 : 0.6
    for (const sd of g.position === 'wing' ? [-1, 1] : [0]) {
      const ox = b.x + fr.r[0] * off * sd
      const oy = b.y + fr.r[1] * off * sd
      const oz = b.z + fr.r[2] * off * sd
      const dx = aimP[0] - ox
      const dy = aimP[1] - oy
      const dz = aimP[2] - oz
      const L = Math.hypot(dx, dy, dz)
      const mv = g.weapon.mvMs ?? 800
      const wi = sim.weaponIdx(g.weapon)
      sim.projectiles.spawn(KIND.bullet, ox, oy, oz, vx + (dx / L) * mv, vy + (dy / L) * mv, vz + (dz / L) * mv, { calibreMm: g.weapon.calibreMm ?? 12.7, owner: i, weapon: wi, t: sim.t, flags: player ? FLAG.player : 0, life: 2.5, aux: rounds / (sd ? 2 : 1) })
    }
    any = true
  }
  if (any) sim.fx(FX.tracer, b.x, b.y, b.z, { unit: i, dx: fr.f[0], dy: fr.f[1], dz: fr.f[2], size: 0.5 })
}

function dropBomb(sim, i, x, player) {
  const b = x.body
  const am = x.ammo
  if (!am || am.bombs <= 0) return
  am.bombs--
  const w = am.bomb || { id: 'bomb', kind: 'bomb', massKg: 250, class: 'bomb-500' }
  const wi = sim.weaponIdx(w)
  const vx = Math.sin(b.psi) * Math.cos(b.gamma) * b.V
  const vy = Math.sin(b.gamma) * b.V
  const vz = -Math.cos(b.psi) * Math.cos(b.gamma) * b.V
  sim.projectiles.spawn(KIND.bomb, b.x, b.y - 2, b.z, vx, vy, vz, { calibreMm: 0, owner: i, weapon: wi, t: sim.t, flags: player ? FLAG.player : 0 })
  b.mass = Math.max(x.model.massEmpty, b.mass - (w.massKg ?? 250))
  if (player) {
    const sc = sim._score
    sc.bombs++
    sc.releaseM = b.y
  }
  sim.fx(FX.launch, b.x, b.y, b.z, { unit: i, data: 2 })
}

/** A drop inside the kit's envelope runs; outside it the torpedo breaks (R7 §4.3). */
function dropTorpedo(sim, i, x, player) {
  const b = x.body
  const am = x.ammo
  const w = x.model.torpedo
  if (!am || am.torpedoes <= 0 || !w) return
  am.torpedoes--
  const env = torpedoEnvelope(x.model, b)
  if (player) sim._score.envelope.push(env)
  const wi = sim.weaponIdx(w)
  const v = ((w.speedKn ?? w.settings?.[0]?.speedKn ?? 33) || 33) * KN
  const ux = Math.sin(b.psi)
  const uz = -Math.cos(b.psi)
  const dropFwd = b.V * Math.sqrt((2 * Math.max(1, b.y)) / G)
  const x0 = b.x + ux * dropFwd
  const z0 = b.z + uz * dropFwd
  sim.fx(FX.splash, x0, 0, z0, { unit: i, size: 10 })
  b.mass = Math.max(x.model.massEmpty, b.mass - (w.massKg ?? 900))
  if (!env.ok) {
    if (player) sim.beat(i, 'torpedo', `torpedo broke on the water: ${env.why}`)
    return
  }
  const dud = failRate(w, sim.date)
  sim.projectiles.spawn(KIND.torpedo, x0, -P.torpedo.hitDepthM, z0, ux * v, 0, uz * v, { calibreMm: w.calibreMm ?? 450, owner: i, weapon: wi, t: sim.t, flags: (player ? FLAG.player : 0) | (sim.rngs.dmg.chance(dud) ? FLAG.dud : 0), life: w.rangeM ?? 2000 })
  if (player) sim._score.torpedoes++
}

export function torpedoEnvelope(model, b) {
  const w = model.torpedo
  if (!w) return { ok: false, why: 'no torpedo' }
  const vMax = ((w.dropSpeedKn ?? 110) * KN) * 1.15
  const hMax = (w.dropAltM ?? 30) * 1.5
  if (b.V > vMax) return { ok: false, why: 'too fast' }
  if (b.y > hMax) return { ok: false, why: 'too high' }
  if (Math.abs(b.phi) > 10 * DEG) return { ok: false, why: 'wings not level' }
  if (b.gamma < -5 * DEG || b.gamma > 3 * DEG) return { ok: false, why: b.gamma < 0 ? 'nose too low' : 'nose too high' }
  return { ok: true, why: '' }
}

// --- 4. AI physics ------------------------------------------------------------------------------------

export function aiPhysics(sim, dt) {
  const s = sim.state
  for (let i = 0; i < sim.capacity; i++) {
    const u = sim.units[i]
    if (u.authority !== 'ai' || !s.alive[i]) continue
    const x = sim._X[i]
    if (!x.body) continue
    if (u.kind === 'ship') {
      if (s.alive[i] === 1) {
        stepShip(x.body, x.model, x.ai?.helm ?? 0, x.ai?.telegraph ?? telegraphFor(x.model, s.speed[i]), dt, speedCap(x.dmg, x.model, sim.t), x.dmg.rudderJam)
        grounding(sim, i, x)
      }
      writeShip(sim, i)
    } else if (s.alive[i] === 1) {
      const b = x.body
      const ai = x.ai
      const cmd = instructor(b, x.model, ai?.aim || [Math.sin(b.psi), 0, -Math.cos(b.psi)], { maxG: ai?.maxG ?? 4 })
      stepAir(b, x.model, { throttle: ai?.mode === 'fight' ? 1 : b.throttle }, dt, cmd)
      writeAir(sim, i)
      if (ai?.mode === 'fight' && sim.t < ai.burstUntil) fireAirGuns(sim, i, x, false)
      const ground = sim.world.heightAt(b.x, b.z)
      if (b.y <= ground + 0.5) crashed(sim, i, 'went in')
      if (ai?.mode === 'rejoin' && x.ac && sim.t > x.ac.endT) sim._setAlive(i, 0)
      // a record loss still falls when its hour comes, unless the player's battle spared it
      if (x.ac?.lossT != null && !x.spared && sim.t >= x.ac.lossT && s.alive[i] === 1 && sim.player?.unitIndex !== i) loseAircraft(sim, i, 'shot')
    }
  }
}

// --- 5. what projectiles do --------------------------------------------------------------------------------

export function bulletStrike(sim, p, i) {
  const pr = sim.projectiles
  const owner = pr.owner[p]
  const w = sim.weaponList[pr.weapon[p]]?.w
  const x = sim._X[i]
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (sim.units[i].authority === 'record') sim._toAI(i)
  const b = x.body
  if (!b) return
  const prot = x.model.protection === 'self-sealing' ? 'protected' : 'unprotected'
  const per = w?.vsAircraft?.[prot] ?? (w?.calibreMm >= 20 ? 0.3 : 0.06)
  const rounds = pr.aux[p] || 1
  const dmg = per * rounds * 0.35
  b.damage += dmg / (x.model.fatal || 1)
  if (b.burning <= 0 && sim.rngs.dmg.chance((P.damage.aircraftFireChance[x.model.protection] ?? 0.1) * Math.min(1, rounds * 0.35))) {
    b.burning = P.damage.aircraftFireBurnS[0] + sim.rngs.dmg.next() * (P.damage.aircraftFireBurnS[1] - P.damage.aircraftFireBurnS[0])
    sim.fx(FX.fire, b.x, b.y, b.z, { unit: i, size: 0.5 })
  }
  sim.fx(FX.hit, b.x, b.y, b.z, { unit: i, size: 0.2 })
  if (b.damage >= 1) loseAircraft(sim, i, 'shot', byPlayer ? 'player' : owner)
  if (byPlayer && x.ai && x.ai.mode !== 'fight') x.ai.mode = 'rejoin'
}

export function loseAircraft(sim, i, how, by = null) {
  const x = sim._X[i]
  const s = sim.state
  if (s.alive[i] !== 1) return
  x.lostAt = sim.t
  x.lostHow = how
  if (by === 'player') {
    x.lostByPlayer = true
    sim._score.downed++
    sim.beat(i, 'downed', `${sim.units[i].name}: shot down`)
  }
  sim._setAlive(i, 2)
  sim.fx(FX.fall, s.pos[3 * i], s.pos[3 * i + 1], s.pos[3 * i + 2], { unit: i })
  x.fallT0 = sim.t
  if (sim.player?.unitIndex === i) {
    sim.beat(i, 'lost', `${sim.units[i].name}: lost`)
    sim._score.how = 'lost'
    sim._endMoment('lost')
  }
}

export function bombStrike(sim, p, i, local, w) {
  const x = sim._X[i]
  const u = sim.units[i]
  const pr = sim.projectiles
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (!u.target || sim.state.alive[i] !== 1) return
  if (byPlayer && x.rec?.fixed) return
  sim._touch(i, byPlayer ? 'player' : 'ai')
  const m = x.model
  const zone = clamp(Math.floor((local.lz / m.L + 0.5) * 4), 0, 3)
  const said = applyHit(x.dmg, m, { cls: w?.cls ?? 'bomb-500', part: 'deck', zone, side: local.lx >= 0 ? 1 : -1, t: sim.t }, sim.rngs.dmg)
  const where = zone === 0 ? 'forward' : zone === 3 ? 'aft' : 'amidships'
  sim.beat(i, 'hit', `${u.name}: bomb hit ${where}${said ? `, ${said}` : ''}`)
  if (byPlayer) {
    scoreHit(sim, i, 'bomb', where)
    sim._engage(i)
  }
}

export function bombFell(sim, p, x0, z0, w) {
  const s = sim.state
  const pr = sim.projectiles
  for (const i of sim._shipsNear(x0, z0, 40)) {
    const m = sim._X[i].model
    const d = boxDistance(x0, z0, s.pos[3 * i], s.pos[3 * i + 2], s.heading[i], m.B / 2, m.L / 2)
    if (d.d < 15 && sim.units[i].target) {
      const x = sim._X[i]
      sim._touch(i, 'near miss')
      if (m.type === 'dd' || m.type === 'de') applyHit(x.dmg, m, { cls: 'small', part: 'waterline', zone: 1, t: sim.t }, sim.rngs.dmg)
      if (pr.flags[p] & FLAG.player) {
        sim.beat(i, 'near-miss', `${sim.units[i].name}: near miss`)
        scoreHit(sim, i, 'near-miss')
      }
      return
    }
  }
}

export function torpedoStrike(sim, p, i, local) {
  const x = sim._X[i]
  const u = sim.units[i]
  const pr = sim.projectiles
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (!u.target || sim.state.alive[i] !== 1) return
  if (byPlayer && x.rec?.fixed) return
  sim._touch(i, byPlayer ? 'player' : 'ai')
  const w = sim.weaponList[pr.weapon[p]]
  const m = x.model
  const zone = clamp(Math.floor((local.lz / m.L + 0.5) * 4), 0, 3)
  const said = applyHit(x.dmg, m, { cls: w?.cls ?? 'torpedo-t93', part: 'waterline', zone, side: local.lx >= 0 ? 1 : -1, t: sim.t }, sim.rngs.dmg)
  sim.beat(i, 'torpedo-hit', `${u.name}: torpedo hit${said ? `, ${said}` : ''}`)
  if (byPlayer) {
    scoreHit(sim, i, 'torpedo')
    sim._score.torpedoesHit++
    sim._engage(i)
  }
}

/** A shell has fallen: the player's salvo is tagged (over, short, straddle); an AI's corrected if its fall was seen. */
export function shellFell(sim, p, x0, z0) {
  const pr = sim.projectiles
  const s = sim.state
  const owner = pr.owner[p]
  const salvo = pr.salvo[p]
  if (pr.flags[p] & FLAG.player) {
    // the AI ship nearest the fall: fired upon
    let near = -1
    let nd = 1000
    for (const i of sim._shipsNear(x0, z0, 1000)) {
      if (sim.units[i].side === sim.units[owner]?.side) continue
      const d = Math.hypot(s.pos[3 * i] - x0, s.pos[3 * i + 2] - z0)
      if (d < nd) {
        nd = d
        near = i
      }
    }
    if (near >= 0) {
      firedOn(sim, near, x0, z0)
      const pl = sim.player
      if (pl?.lastSalvo?.id === salvo) {
        const m = sim._X[near].model
        const d = boxDistance(x0, z0, s.pos[3 * near], s.pos[3 * near + 2], s.heading[near], m.B / 2, m.L / 2)
        const ox = owner >= 0 ? s.pos[3 * owner] : x0
        const oz = owner >= 0 ? s.pos[3 * owner + 2] : z0
        const over = Math.hypot(x0 - ox, z0 - oz) > Math.hypot(s.pos[3 * near] - ox, s.pos[3 * near + 2] - oz)
        pl.lastSalvo.tags.push(d.d < 1 ? 'hit' : over ? 'over' : 'short')
        pl.lastSalvo.target = near
        const tg = pl.lastSalvo.tags
        if (!pl.lastSalvo.straddle && tg.includes('over') && tg.includes('short')) {
          pl.lastSalvo.straddle = true
          sim._score.straddles++
        }
      }
    }
    return
  }
  // an AI salvo: corrected when its fall was seen (a lit target, daylight, or a radar that sees splashes)
  const x = owner >= 0 ? sim._X[owner] : null
  const ai = x?.ai
  if (!ai?.salvos) return
  const rec = ai.salvos.get(salvo)
  if (!rec || rec.done) return
  rec.done = true
  const ti = pr.target[p]
  const seenFall = sim.sight.light === 'day' || (ti >= 0 && sim._X[ti].litUntil > sim.t) || sim.sight.lit(x0, 0, z0) || (rec.seenAtFire === 'radar' && P.aiGun.spotNightRadar)
  if (seenFall) correct(ai.sol, P.aiGun)
  ai.salvos.delete(salvo)
  // a salvo landing near the player is a threat
  if (sim.player && ti === sim.player.unitIndex) sim._lastNearSalvo = sim.t
}

/** An AI ship fired upon by the player: it evades within its bounds and returns fire. */
export function firedOn(sim, i, x0, z0) {
  const x = sim._X[i]
  const u = sim.units[i]
  if (u.kind !== 'ship' || u.authority === 'player' || x.rec?.fixed) return
  sim._engage(i)
  const ai = x.ai
  if (!ai) return
  const s = sim.state
  const g = sim.rngs.ai
  const brg = headingOf(x0 - s.pos[3 * i], z0 - s.pos[3 * i + 2])
  const rel = wrap180(brg - s.heading[i])
  const toward = g.next() < P.aiEvade.towardShare
  ai.evadeTurn = clamp((toward ? Math.sign(rel) : -Math.sign(rel)) * (15 + g.next() * 15), -P.aiEvade.maxTurnDeg, P.aiEvade.maxTurnDeg)
  ai.evadeDv = (g.next() * 2 - 1) * P.aiEvade.maxSpeedKn * KN
  ai.evadeUntil = sim.t + P.aiEvade.returnS
}

export function scoreHit(sim, i, kind, where = null) {
  const sc = sim._score
  if (!sc) return
  let h = sc.hits.find((x) => x.unit === sim.units[i].id && x.kind === kind)
  if (!h) sc.hits.push((h = { unit: sim.units[i].id, name: sim.units[i].name, kind, count: 0, where: [] }))
  h.count++
  if (where) h.where.push(where)
  const obj = sim._moment?.objective
  if (obj?.target && obj.target === sim.units[i].id && kind !== 'near-miss') sc.objective = true
}

// --- 6. the AA hazard ------------------------------------------------------------------------------------

export function aaStep(sim, dt) {
  const s = sim.state
  const X = sim._X
  const pl = sim.player
  sim._aaOnPlayer = 0
  for (const i of sim._air || []) {
    const u = sim.units[i]
    if (u.authority === 'record' || s.alive[i] !== 1) continue
    const x = X[i]
    const b = x.body
    if (!b) continue
    // burning aircraft go down when the fire has had its time
    if (b.burning > 0) {
      b.burning -= dt
      if (b.burning <= 0) loseAircraft(sim, i, 'fire', x.lastHitBy ?? null)
      continue
    }
    let lam = 0
    let nearest = null
    const mode = b.gamma < -30 * DEG ? 'dive' : b.y < 120 && Math.abs(b.gamma) < 0.1 ? 'torpedo' : 'crossing'
    for (const r of sim.record.ships) {
      const j = r.slot
      if (s.alive[j] !== 1 || sim.units[j].side === u.side || sim.units[j].kind !== 'ship') continue
      const m = X[j].model
      const reach = aaReach(m)
      const d = Math.hypot(s.pos[3 * j] - b.x, s.pos[3 * j + 2] - b.z, b.y - 20)
      if (d > reach) continue
      const jd = X[j].dmg
      if (jd && jd.regime === 'sim' && (jd.out || jd.sinking)) continue
      if (!sim.sight.sees({ x: s.pos[3 * j], y: 25, z: s.pos[3 * j + 2], sensors: [] }, { x: b.x, y: b.y, z: b.z, big: false, aircraft: true, lit: sim.sight.light === 'day' })) continue
      // alertness from the first sighting of this aircraft's group (or of it)
      X[j].sighted ??= {}
      const key = u.groupIndex >= 0 ? u.groupIndex : `u${i}`
      X[j].sighted[key] ??= sim.t
      const alert = alertAt(sim.t, X[j].sighted[key])
      // the fire shared among the attackers in its reach (the player's director gives one aircraft all of it)
      let share = 0
      for (const k of sim._air) if (sim.units[k].side === u.side && Math.hypot(s.pos[3 * k] - s.pos[3 * j], s.pos[3 * k + 2] - s.pos[3 * j + 2]) < reach) share++
      share = Math.max(1, Math.min(share, 4))
      if (pl && pl.kind === 'ship' && pl.unitIndex === j && pl.aaTarget === i && sim.t < (pl.aaUntil ?? 0)) share = 1
      const era = eraFactor(sim.units[j].side, sim.year, { peacetime: sim.year === 1941 && sim.units[j].side === 'us' })
      const dmgScale = jd && jd.regime === 'sim' && jd.crippled ? 0.5 : 1
      lam += (shipLambda(m, d) * era * alert * aspectOf(mode) * dmgScale) / share
      if (!nearest || d < nearest.d) nearest = { j, d, m }
    }
    if (pl && pl.unitIndex === i && sim.aid === 'guided') lam *= 0.5
    if (pl && pl.unitIndex === i) sim._aaOnPlayer = lam
    if (lam <= 0) continue
    // the flak the eye sees, at a rate with the hazard
    if (sim.rngs.fx.chance(Math.min(0.5, lam * 600 * dt))) sim.fx(FX.flash, b.x + sim.rngs.fx.gauss() * 60, b.y + sim.rngs.fx.gauss() * 40, b.z + sim.rngs.fx.gauss() * 60, { unit: nearest.j, size: 1, data: 1 })
    const r = hazardStep(lam, dt, sim.rngs.aa)
    if (r === 'kill') {
      loseAircraft(sim, i, 'aa')
      if (pl && pl.unitIndex !== i && sim.units[nearest.j].authority === 'player') sim._score.downed++
    } else if (r === 'hit') {
      b.damage = Math.min(0.95, b.damage + hitDamage(nearest.m, nearest.d, sim.rngs.aa))
      sim.fx(FX.smoke, b.x, b.y, b.z, { unit: i, size: 0.4 })
      if (pl?.unitIndex === i) sim.beat(i, 'damage', `${u.name}: hit by AA`)
    }
  }
}

// --- 7. scripted ordnance, torpedoes and choreographed losses ---------------------------------------------------

/** The record's bombs and torpedoes, for the eye (their hits are the record's events). */
export function scriptedOrdnance(sim, a) {
  const i = a.slot
  const s = sim.state
  const x = sim._X[i]
  const o = 3 * i
  if (a.kind === 'release') {
    const w = x.model.payload[0]?.weapon || { id: 'bomb', kind: 'bomb', massKg: 450, class: 'bomb-1000' }
    const wi = sim.weaponIdx(w)
    // aimed at the plan's aim point: the bomb leaves with the aircraft's velocity, nudged onto it
    const vx = s.vel[o]
    const vy = s.vel[o + 1]
    const vz = s.vel[o + 2]
    const h = s.pos[o + 1]
    const tf = (vy + Math.sqrt(Math.max(0, vy * vy + 2 * G * h))) / G
    let ax = a.aim.x
    let az = a.aim.z
    if (a.hit && a.target >= 0) {
      const ti = sim.record.ships[a.target].slot
      ax = s.pos[3 * ti] + s.vel[3 * ti] * tf
      az = s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * tf
    }
    const nx = (ax - s.pos[o]) / Math.max(0.5, tf)
    const nz = (az - s.pos[o + 2]) / Math.max(0.5, tf)
    sim.projectiles.spawn(KIND.bomb, s.pos[o], h - 2, s.pos[o + 2], nx, vy, nz, { owner: i, weapon: wi, t: sim.t, flags: FLAG.visual | (a.hit ? FLAG.hit : 0) })
    sim.fx(FX.launch, s.pos[o], h, s.pos[o + 2], { unit: i, data: 2 })
  } else if (a.kind === 'drop') {
    const w = x.model.torpedo || { id: 'torpedo', kind: 'torpedo', air: true, speedKn: 33, rangeM: 2000 }
    const wi = sim.weaponIdx(w)
    const v = ((w.speedKn ?? 33) || 33) * KN
    let hdg = a.heading
    if (a.target >= 0) {
      const ti = sim.record.ships[a.target].slot
      hdg = headingOf(a.aim.x - s.pos[o], a.aim.z - s.pos[o + 2])
      if (a.hit) {
        const d = Math.hypot(s.pos[3 * ti] - s.pos[o], s.pos[3 * ti + 2] - s.pos[o + 2])
        const tt = d / v
        hdg = headingOf(s.pos[3 * ti] + s.vel[3 * ti] * tt - s.pos[o], s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * tt - s.pos[o + 2])
      }
    }
    const [ux, uz] = courseVec(hdg)
    sim.fx(FX.splash, s.pos[o], 0, s.pos[o + 2], { unit: i, size: 8 })
    sim.projectiles.spawn(KIND.torpedo, s.pos[o], -P.torpedo.hitDepthM, s.pos[o + 2], ux * v, 0, uz * v, { owner: i, weapon: wi, t: sim.t, flags: FLAG.visual | FLAG.armed | (a.hit ? FLAG.hit : 0), life: w.rangeM ?? 2500 })
  } else if (a.kind === 'strafe') {
    let tx = s.pos[o]
    let tz = s.pos[o + 2]
    if (a.target >= 0) {
      const ti = sim.record.ships[a.target].slot
      tx = s.pos[3 * ti]
      tz = s.pos[3 * ti + 2]
    } else if (a.site) {
      const st = sim.record.siteById.get(a.site)
      if (st) {
        tx = st.x
        tz = st.z
      }
    }
    sim.fx(FX.tracer, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i, dx: tx - s.pos[o], dy: -s.pos[o + 1], dz: tz - s.pos[o + 2], size: a.dur ?? 3, data: 1 })
  }
}

/** A record torpedoes-fired event: its spread runs in the water (real when the player is its target). */
export function scriptedTorpedoes(sim, i, ev) {
  const s = sim.state
  const tgt = ev.target ? sim.record.shipById.get(ev.target) : null
  if (!tgt) return
  const ti = tgt.slot
  const x = sim._X[i]
  const w = x.model.torp?.weapon || { id: 'torpedo', kind: 'torpedo', speedKn: ev.speedKn ?? 36, rangeM: 15000 }
  const wi = sim.weaponIdx(w)
  const v = (ev.speedKn ?? w.settings?.[0]?.speedKn ?? 36) * KN
  const real = sim.player && sim.player.unitIndex === ti
  const d = Math.hypot(s.pos[3 * ti] - s.pos[3 * i], s.pos[3 * ti + 2] - s.pos[3 * i + 2])
  const tt = d / v
  const aim = headingOf(s.pos[3 * ti] + s.vel[3 * ti] * tt - s.pos[3 * i], s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * tt - s.pos[3 * i + 2])
  const n = Math.min(24, ev.rc || (Array.isArray(ev.count) ? ev.count[0] : ev.count) || 4)
  const life = (w.settings?.find((st) => Math.abs(st.speedKn - v / KN) < 3)?.rangeM ?? w.rangeM ?? d * 1.3) + 200
  const dud = failRate(w, sim.date)
  for (let k = 0; k < n; k++) {
    const a = (aim + (k - (n - 1) / 2) * P.torpedo.spreadNarrowDeg * 1.5) * DEG
    sim.projectiles.spawn(KIND.torpedo, s.pos[3 * i], -P.torpedo.hitDepthM, s.pos[3 * i + 2], Math.sin(a) * v, 0, -Math.cos(a) * v, { owner: i, weapon: wi, t: sim.t, flags: real ? (sim.rngs.dmg.chance(dud) ? FLAG.dud : 0) : FLAG.visual, life, target: ti })
  }
}

/** Scripted kills look real: a nearby enemy fighter fires tracer at the victim, or the AA bursts round it (R7 §4.7). */
export function choreograph(sim, i, a) {
  const s = sim.state
  const side = sim.units[i].side
  const vx = s.pos[3 * i]
  const vy = s.pos[3 * i + 1]
  const vz = s.pos[3 * i + 2]
  let best = -1
  let bd = 3000
  for (const j of sim._air || []) {
    if (sim.units[j].side === side || sim._X[j].model?.type !== 'fighter') continue
    const d = Math.hypot(s.pos[3 * j] - vx, s.pos[3 * j + 1] - vy, s.pos[3 * j + 2] - vz)
    if (d < bd) {
      bd = d
      best = j
    }
  }
  if (best >= 0) {
    for (let k = 0; k < 3; k++) sim.fx(FX.tracer, s.pos[3 * best], s.pos[3 * best + 1], s.pos[3 * best + 2], { unit: best, dx: vx - s.pos[3 * best], dy: vy - s.pos[3 * best + 1], dz: vz - s.pos[3 * best + 2], size: 1.5 + k, data: 0 })
    return
  }
  for (let k = 0; k < 4; k++) sim.fx(FX.flash, vx + sim.rngs.fx.gauss() * 50, vy + sim.rngs.fx.gauss() * 30, vz + sim.rngs.fx.gauss() * 50, { unit: i, size: 1, data: 1 })
}

/** Record ships' guns firing for the eye at their record target (visual shells; the record's hits are its events). */
export function visualGunfire(sim) {
  const s = sim.state
  if (sim.projectiles.count > sim.projectiles.capacity * 0.6) return
  for (const [i, vf] of sim._visualFire) {
    if (sim.t > vf.until) {
      sim._visualFire.delete(i)
      continue
    }
    if (sim.t < vf.next) continue
    const x = sim._X[i]
    const u = sim.units[i]
    if (s.alive[i] !== 1 || (u.authority === 'ai' && x.ai?.engaged) || u.authority === 'player') {
      sim._visualFire.delete(i)
      continue
    }
    const ti = vf.target
    const b = x.model.batteries[0]
    if (ti == null || s.alive[ti] !== 1 || !b) {
      vf.next = sim.t + 30
      continue
    }
    vf.next = sim.t + b.reloadS * (1 + sim.rngs.fx.next() * 0.3)
    const tx = s.pos[3 * ti]
    const tz = s.pos[3 * ti + 2]
    const R0 = Math.hypot(tx - s.pos[3 * i], tz - s.pos[3 * i + 2])
    if (R0 > b.table.maxRange * 0.97) continue
    x.vguns ||= createGuns(sim, i)
    const bg = x.vguns[0]
    const mounts = bg.mounts.filter((mt) => bearsOn(sim, i, mt, tx, tz))
    if (!mounts.length) continue
    const g = sim.rngs.fx
    const tof = atRange(b.table, R0)?.tof ?? 10
    const px = tx + s.vel[3 * ti] * tof + g.gauss() * R0 * 0.015
    const pz = tz + s.vel[3 * ti + 2] * tof + g.gauss() * R0 * 0.015
    // visual shells: flown like any other, marked to do nothing but splash
    const salvo = sim._salvo++
    for (const mt of mounts) mt.readyAt = 0
    const before = sim.projectiles.count
    fireMounts(sim, i, bg, mounts, px, pz, { salvo, target: ti, player: false })
    for (let p = 0; p < sim.projectiles.capacity && sim.projectiles.count > before; p++) if (sim.projectiles.alive[p] && sim.projectiles.salvo[p] === salvo) sim.projectiles.flags[p] |= FLAG.visual
  }
}

// --- 8. fates -------------------------------------------------------------------------------------------------

export function fates(sim, dt) {
  const s = sim.state
  for (let i = 0; i < sim.capacity; i++) {
    const u = sim.units[i]
    if (u.authority === 'record' || u.authority === 'free' || s.alive[i] !== 2 || u.kind !== 'aircraft') continue
    // an aircraft under the sim falling: down to the sea or the ground
    const x = sim._X[i]
    const b = x.body
    if (!b) {
      sim._setAlive(i, 0)
      continue
    }
    b.gamma = Math.max(-1.3, b.gamma - 0.6 * dt)
    b.phi += 1.5 * dt
    b.V = Math.min(b.V + 6 * dt, 160)
    const ch = Math.cos(b.gamma) * b.V
    b.x += ch * Math.sin(b.psi) * dt
    b.z -= ch * Math.cos(b.psi) * dt
    b.y += Math.sin(b.gamma) * b.V * dt
    writeAir(sim, i)
    s.fire[i] = 1
    if (b.y <= sim.world.heightAt(b.x, b.z)) {
      sim.fx(sim.world.metresAt(b.x, b.z) > 0 ? FX.explode : FX.splash, b.x, Math.max(0, sim.world.heightAt(b.x, b.z)), b.z, { unit: i, size: 10 })
      sim._setAlive(i, 0)
    }
  }
  // the player's aircraft out of fuel and ammunition: the sortie's end
  const pl = sim.player
  if (pl && pl.kind === 'aircraft' && sim.momentState && !sim.momentState.done) {
    const x = sim._X[pl.unitIndex]
    if (x.body?.engineOut && x.body.fuelS <= 0 && !x.fuelSaid) {
      x.fuelSaid = true
      sim.beat(pl.unitIndex, 'fuel', `${sim.units[pl.unitIndex].name}: out of fuel`)
    }
  }
}

// --- the player's state mirror -------------------------------------------------------------------------------

export function updatePlayerState(sim) {
  const pl = sim.player
  if (!pl) return
  const i = pl.unitIndex
  const s = sim.state
  const x = sim._X[i]
  const st = pl.state
  st.t = sim.t
  st.alive = s.alive[i]
  st.side = sim.units[i].side
  st.units = st.side === 'jp' ? 'metric' : 'imperial'
  st.x = s.pos[3 * i]
  st.y = s.pos[3 * i + 1]
  st.z = s.pos[3 * i + 2]
  st.heading = s.heading[i]
  st.speed = s.speed[i]
  st.damage = s.damage[i]
  if (pl.kind === 'aircraft') {
    const b = x.body
    st.alt = b.y
    st.ias = b.ias
    st.pitch = b.gamma / DEG
    st.roll = b.phi / DEG
    st.g = b.n
    st.stall = b.stalled
    st.stallSpeed = stallSpeed(b, x.model)
    st.shake = b.shake
    st.blackout = b.blackout
    st.endurance = b.fuelS
    st.throttle = b.throttle
    st.brakes = b.brakes
    st.broken = b.broken
    st.ammo = x.ammo.guns.map((g) => ({ weapon: g.weapon.id, calibreMm: g.weapon.calibreMm, left: Math.round(g.left), position: g.position }))
    st.bombs = x.ammo.bombs
    st.torpedoes = x.ammo.torpedoes
    st.aa = sim._aaOnPlayer || 0
    // the target: the nearest enemy aircraft ahead within 1.5 km, with a lead pip (two iterations)
    st.target = airTarget(sim, i, x)
    // the CCIP in a dive (where the bomb falls now) and the release cue
    st.ccip = x.ammo.bombs > 0 ? ccip(sim, i, x) : null
    // the release light: in a dive, the impact point inside a hull, above the safe pull-out height (R7 §4.3)
    st.release = !!(st.ccip && st.ccip.onTarget && b.gamma < -30 * DEG && b.y > safePullout(b))
    st.safeAlt = safePullout(b)
    st.envelope = x.ammo.torpedoes > 0 ? torpedoEnvelope(x.model, b) : null
    const home = sim.record.groupById.get(sim.units[i].group || '')
    const hi = home?.recover?.to >= 0 ? home.recover.to : home?.from ?? -1
    if (hi >= 0) {
      const hs = sim.record.ships[hi].slot
      st.home = { index: hs, range: Math.hypot(s.pos[3 * hs] - b.x, s.pos[3 * hs + 2] - b.z), bearing: headingOf(s.pos[3 * hs] - b.x, s.pos[3 * hs + 2] - b.z) }
    } else st.home = null
  } else {
    const b = x.body
    const d = x.dmg
    st.alt = 0
    st.helm = b.helm
    st.rudder = b.rudder
    st.telegraph = b.telegraph
    st.ordered = orderedOf(b.telegraph) * x.model.vmax
    st.fight = d.fight
    st.float = d.float
    st.list = d.list
    st.fires = [...d.fires]
    st.systemsOut = [...d.systemsOut, ...(d.rudderJam != null ? ['rudder'] : []), ...(sim.t < d.engineStopUntil ? ['engines'] : []), ...(d.bowLost ? ['bow'] : [])]
    st.doomed = d.doomed
    st.turrets = x.guns.flatMap((bg, bi) => bg.mounts.map((mt) => ({ battery: bi, role: bg.battery.role, bearing: (mt.bearing + s.heading[i]) % 360, elevation: mt.elev, ready: mt.readyAt <= sim.t, readyIn: Math.max(0, mt.readyAt - sim.t), reloadS: bg.battery.reloadS })))
    const inp = pl.input
    const bg = x.guns[clamp(inp.battery | 0, 0, Math.max(0, x.guns.length - 1))]
    if (bg && inp.aimRange != null) {
      const row = atRange(bg.battery.table, inp.aimRange)
      st.aimTof = row?.tof ?? null
      st.maxRange = bg.battery.table.maxRange
    } else st.aimTof = null
    st.target = shipTarget(sim, i, x, inp.aimAz)
    st.lastSalvo = pl.lastSalvo || null
    st.torpedoesReady = x.torpedoes?.ready ?? 0
    st.aaTarget = sim.t < (pl.aaUntil ?? 0) ? pl.aaTarget : -1
  }
  st.contacts = contacts(sim, i)
}

function safePullout(b) {
  const th = Math.max(0, -b.gamma)
  const n = 5
  return (b.V * b.V) / (G * Math.max(0.5, n - Math.cos(th))) * (1 - Math.cos(th)) + 100
}

function airTarget(sim, i, x) {
  const s = sim.state
  const b = x.body
  const f = airFrame(b).f
  let best = null
  for (const j of sim._air || []) {
    if (sim.units[j].side === sim.units[i].side) continue
    const dx = s.pos[3 * j] - b.x
    const dy = s.pos[3 * j + 1] - b.y
    const dz = s.pos[3 * j + 2] - b.z
    const d = Math.hypot(dx, dy, dz)
    if (d > 1500) continue
    const c = (dx * f[0] + dy * f[1] + dz * f[2]) / d
    if (c < 0.7) continue
    if (!best || d < best.range) best = { index: j, range: d, bearing: headingOf(dx, dz) }
  }
  if (best) {
    const j = best.index
    const mv = x.model.guns[0]?.weapon?.mvMs ?? 800
    let tof = best.range / (mv + b.V)
    let lx
    let ly
    let lz
    for (let k = 0; k < 2; k++) {
      lx = s.pos[3 * j] + s.vel[3 * j] * tof
      ly = s.pos[3 * j + 1] + s.vel[3 * j + 1] * tof
      lz = s.pos[3 * j + 2] + s.vel[3 * j + 2] * tof
      tof = Math.hypot(lx - b.x, ly - b.y, lz - b.z) / (mv + b.V)
    }
    best.tof = tof
    best.lead = [lx, ly, lz]
  }
  return best
}

/** Where a bomb released now would fall (integrated a few dozen steps), and whether that is inside a target's hull. */
function ccip(sim, i, x) {
  const s = sim.state
  const b = x.body
  let px = b.x
  let py = b.y
  let pz = b.z
  let vx = Math.sin(b.psi) * Math.cos(b.gamma) * b.V
  let vy = Math.sin(b.gamma) * b.V
  let vz = -Math.cos(b.psi) * Math.cos(b.gamma) * b.V
  const k = 4e-5
  let t = 0
  const dt = 0.1
  while (py > 0 && t < 60) {
    const v = Math.hypot(vx, vy, vz)
    vx -= k * v * vx * dt
    vy -= (k * v * vy + G) * dt
    vz -= k * v * vz * dt
    px += vx * dt
    py += vy * dt
    pz += vz * dt
    t += dt
  }
  let onTarget = false
  let target = -1
  for (const j of sim._shipsNear(px, pz, 300)) {
    if (sim.units[j].side === sim.units[i].side) continue
    const m = sim._X[j].model
    // the target moves on through the fall
    const d = boxDistance(px, pz, s.pos[3 * j] + s.vel[3 * j] * t, s.pos[3 * j + 2] + s.vel[3 * j + 2] * t, s.heading[j], m.B / 2, m.L / 2)
    if (d.d <= 0) {
      onTarget = true
      target = j
      break
    }
  }
  return { x: px, y: 0, z: pz, tof: t, onTarget, target }
}

function shipTarget(sim, i, x, aimAz) {
  const s = sim.state
  let best = null
  for (const r of sim.record.ships) {
    const j = r.slot
    if (s.alive[j] !== 1 || sim.units[j].side === sim.units[i].side || sim.units[j].kind !== 'ship') continue
    const dx = s.pos[3 * j] - s.pos[3 * i]
    const dz = s.pos[3 * j + 2] - s.pos[3 * i + 2]
    const brg = headingOf(dx, dz)
    const off = Math.abs(wrap180(brg - aimAz))
    if (off > 3) continue
    const d = Math.hypot(dx, dz)
    const seen = sim.sight.sees({ x: s.pos[3 * i], y: x.model.top * 0.8, z: s.pos[3 * i + 2], sensors: x.model.sensors }, { x: s.pos[3 * j], y: 10, z: s.pos[3 * j + 2], big: true, lit: sim._X[j].litUntil > sim.t })
    if (!seen) continue
    if (!best || off < best.off) {
      // the rangefinder's error: radar 0.3 %, optical 0.5 % inside 10 km, 1 % beyond 15 km (R7 §4.5)
      const errPct = seen.how === 'radar' ? 0.3 : d < 10000 ? 0.5 : d > 15000 ? 1 : 0.75
      const g = sim.rngs.fx
      const range = d * (1 + (g.gauss() * errPct) / 100)
      const tbl = x.guns[0]?.battery.table
      const row = tbl ? atRange(tbl, range) : null
      best = { index: j, range, bearing: brg, tof: row?.tof ?? null, how: seen.how, off, course: s.heading[j], speed: s.speed[j] }
    }
  }
  return best
}

/** The plot: radar contacts on a ship with radar, what the lookouts can see otherwise. */
function contacts(sim, i) {
  const s = sim.state
  const x = sim._X[i]
  const out = []
  const obs = { x: s.pos[3 * i], y: Math.max(20, s.pos[3 * i + 1]), z: s.pos[3 * i + 2], sensors: x.model.sensors || [] }
  for (let j = 0; j < sim.capacity; j++) {
    if (j === i || s.alive[j] !== 1 || sim.units[j].parked) continue
    const u = sim.units[j]
    const dx = s.pos[3 * j] - obs.x
    const dz = s.pos[3 * j + 2] - obs.z
    const d = Math.hypot(dx, dz)
    if (d > 40000) continue
    const seen = sim.sight.sees(obs, { x: s.pos[3 * j], y: s.pos[3 * j + 1], z: s.pos[3 * j + 2], big: u.kind === 'ship' && (sim._X[j].model?.L ?? 0) > 150, aircraft: u.kind === 'aircraft', lit: sim._X[j].litUntil > sim.t })
    if (!seen) continue
    out.push({ index: j, kind: u.kind, friendly: u.side === sim.units[i].side, range: d, bearing: headingOf(dx, dz), how: seen.how })
    if (out.length > 120) break
  }
  return out
}

// --- the threats that drop a compressed time scale (R7 §4.1) ----------------------------------------------------

export function threat(sim) {
  const pl = sim.player
  sim.threat = false
  sim.threatWhy = null
  if (!pl || sim.state.alive[pl.unitIndex] !== 1) return
  const s = sim.state
  const i = pl.unitIndex
  const px = s.pos[3 * i]
  const py = s.pos[3 * i + 1]
  const pz = s.pos[3 * i + 2]
  const T = P.threat
  const why = (w) => {
    sim.threat = true
    sim.threatWhy = w
  }
  if (pl.kind === 'aircraft') {
    const b = sim._X[i].body
    if (b.gamma < -40 * DEG) return why('dive')
    if (b.y < 100 && sim._X[i].ammo?.torpedoes > 0) return why('torpedo run')
    if ((sim._aaOnPlayer || 0) > 0) return why('AA')
  }
  for (const j of sim._air || []) {
    if (sim.units[j].side === sim.units[i].side) continue
    if (Math.hypot(s.pos[3 * j] - px, s.pos[3 * j + 1] - py, s.pos[3 * j + 2] - pz) < T.aircraftM) return why('enemy aircraft')
  }
  if (pl.kind === 'ship') {
    if (sim._lastNearSalvo != null && sim.t - sim._lastNearSalvo < 3) return why('salvo')
    const pr = sim.projectiles
    for (let p = 0; p < pr.capacity; p++) {
      if (!pr.alive[p]) continue
      const k = pr.kind[p]
      const o = 3 * p
      if (k === KIND.torpedo && !(pr.flags[p] & FLAG.player) && Math.hypot(pr.pos[o] - px, pr.pos[o + 2] - pz) < T.torpedoNearM) return why('torpedo')
      if (k === KIND.shell && pr.flags[p] & FLAG.player && pl.lastSalvo && pr.salvo[p] === pl.lastSalvo.id && pl.lastSalvo.landsAt - sim.t < T.ownSalvoLastS) return why('own salvo')
      if (k === KIND.shell && !(pr.flags[p] & (FLAG.player | FLAG.visual)) && pr.target[p] === i && pr.vel[o + 1] < 0 && Math.hypot(pr.pos[o] - px, pr.pos[o + 2] - pz) < T.salvoNearM * 3) return why('salvo')
    }
    for (const r of sim.record.ships) {
      const j = r.slot
      if (s.alive[j] !== 1 || sim.units[j].side === sim.units[i].side) continue
      if (Math.hypot(s.pos[3 * j] - px, s.pos[3 * j + 2] - pz) < T.shipNearM) return why('enemy ship')
    }
  }
}

export { rho }
