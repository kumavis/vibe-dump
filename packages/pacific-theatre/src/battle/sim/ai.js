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
import { stepAir, airQuat, airFrame, instructor, stallSpeed, eulerQuat, nMaxAt, tableAt, createAirBody as createAirBody0 } from './aircraft.js'
import { stepShip, helmsman, telegraphFor, orderedOf } from './ship.js'
import { KIND, FLAG, muzzle, layOn, createSolution, trackTarget, noteTargetManoeuvre, correct, errorFactor } from './guns.js'
import { atRange, bombImpact } from './ballistics.js'
import { shipLambda, aaReach, eraFactor, aspectOf, alertAt, aaStep as hazardStep, hitDamage, fRange } from './aa.js'
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

/**
 * The ammunition an aircraft of a group carries: what its profile flew with
 * (a torpedo group's aircraft carry the torpedo and no bomb, a level or dive
 * group's the bombs and no torpedo, fighters on CAP, escort or strafing no
 * bombs); without a profile, the kit's.
 */
export function ammoFor(model, profile = null) {
  const a = ammoOf(model)
  if (profile === 'torpedo' && a.torpedoes > 0) a.bombs = 0
  else if (profile === 'level' || profile === 'dive') a.torpedoes = 0
  else if (profile === 'cap' || profile === 'escort' || profile === 'strafe') {
    a.bombs = 0
    a.torpedoes = 0
  }
  return a
}

// --- the take-over (ROUND-2 §3): the soft take, the stations the player is not at -------------------------------

const LEVELS = ['pitch', 'roll', 'yaw', 'throttle', 'helm', 'telegraph']
const COUNTERS = ['fireCount', 'bombCount', 'torpedoCount', 'salvoCount', 'starshellCount']

/** The levels of an input at the take, so a later change can be told from none. */
export function snapshotInput(inp) {
  const o = {}
  for (const k of LEVELS) o[k] = inp[k] ?? 0
  return o
}

/**
 * Whether the player has acted since the take (ROUND-2 §3: "no non-zero
 * level or counter since the take"): a counter advanced, a gun held, the
 * AA directed, or, at the station they belong to, a level moved (the helm or
 * telegraph; the stick, the rudder, the throttle or the mouse-aim). Aiming a
 * gun without firing it changes nothing in the battle and is not an act.
 */
export function inputTouched(pl) {
  const inp = pl.input
  const b = pl.base
  const seen = pl._seen
  for (const c of COUNTERS) if ((inp[c] | 0) > (seen[c] | 0)) return true
  if (inp.fireHeld || inp.aa) return true
  const all = pl.allStations
  if (pl.kind === 'ship') {
    if (all || pl.station === 'helm') for (const k of ['helm', 'telegraph']) if (Math.abs((inp[k] ?? 0) - (b[k] ?? 0)) > 1e-3) return true
    return false
  }
  if (all || pl.station === 'pilot') {
    for (const k of ['pitch', 'roll', 'yaw', 'throttle']) if (Math.abs((inp[k] ?? 0) - (b[k] ?? 0)) > 1e-3) return true
    if (inp.aimDir && inp.mode !== 'direct') return true
  }
  if (pl.station === 'bombardier' && Math.abs(inp.roll ?? 0) > 1e-3) return true
  return false
}

/** A soft take's shadow body, kept on the record's place so the HUD reads the unit as it flies or steams. */
export function syncPlayerBody(sim, pl) {
  const i = pl.unitIndex
  const x = sim._X[i]
  const s = sim.state
  const b = x.body
  if (!b) return
  const o = 3 * i
  if (pl.kind === 'ship') {
    b.x = s.pos[o]
    b.z = s.pos[o + 2]
    b.heading = s.heading[i]
    b.V = s.speed[i]
    return
  }
  const vx = s.vel[o]
  const vy = s.vel[o + 1]
  const vz = s.vel[o + 2]
  const hs = Math.hypot(vx, vz)
  b.x = s.pos[o]
  b.y = s.pos[o + 1]
  b.z = s.pos[o + 2]
  b.V = Math.max(20, Math.hypot(hs, vy))
  b.psi = s.heading[i] * DEG
  b.gamma = Math.atan2(vy, Math.max(1, hs))
  b.phi = x.bank || 0
  b.p = 0
  b.ias = b.V * Math.sqrt(rho(b.y) / rho(0))
  b.n = Math.cos(b.gamma) / Math.max(0.25, Math.cos(b.phi))
}

/** The station left: what it was doing is held for the AI (the helm's course and speed, the battery's target, the pilot's heading, height and speed). */
export function leaveStation(sim, pl, name) {
  const s = sim.state
  const i = pl.unitIndex
  const x = sim._X[i]
  const inp = pl.input
  pl.aims[name] = { aimAz: inp.aimAz, aimEl: inp.aimEl, aimRange: inp.aimRange, aimDir: inp.aimDir, mode: inp.mode }
  if (name === 'helm' || pl.allStations) {
    pl.hold.heading = s.heading[i]
    pl.hold.speed = x.body && pl.kind === 'ship' ? Math.max(0, orderedOf(x.body.telegraph) * x.model.vmax) : s.speed[i]
  }
  if (name === 'main' || (pl.allStations && pl.kind === 'ship')) {
    const t = pl.state?.target?.index
    if (t != null && t >= 0) pl.hold.mainTarget = t
  }
  if (pl.kind === 'aircraft' && (name === 'pilot' || name === 'bombardier' || pl.allStations)) {
    pl.hold.heading = s.heading[i]
    pl.hold.alt = s.pos[3 * i + 1]
    pl.hold.speed = s.speed[i]
  }
  inp.fireHeld = false
  inp.aa = false
}

/** The station entered: its own aim back (or a first one: the guns on the nearest aircraft of the other side). */
export function enterStation(sim, pl, name) {
  const inp = pl.input
  const s = sim.state
  const i = pl.unitIndex
  const a = pl.aims[name]
  if (a) Object.assign(inp, a)
  else if (name === 'aa' || name === 'gunner') {
    const j = nearestEnemyAircraft(sim, i, name === 'aa' ? 7000 : 1500)
    if (j >= 0) {
      const dx = s.pos[3 * j] - s.pos[3 * i]
      const dy = s.pos[3 * j + 1] - s.pos[3 * i + 1]
      const dz = s.pos[3 * j + 2] - s.pos[3 * i + 2]
      inp.aimAz = headingOf(dx, dz)
      inp.aimEl = Math.atan2(dy, Math.hypot(dx, dz)) / DEG
    } else {
      inp.aimAz = (s.heading[i] + (name === 'gunner' ? 180 : 90)) % 360
      inp.aimEl = name === 'gunner' ? 10 : 25
    }
  } else if (name === 'pilot') {
    inp.aimDir = null
    inp.mode = 'aim'
  }
  if (name === 'bombardier') {
    pl.hold.heading = s.heading[i]
    pl.hold.alt = s.pos[3 * i + 1]
    pl.hold.speed = s.speed[i]
  }
  inp.fireHeld = false
}

function nearestEnemyAircraft(sim, i, within) {
  const s = sim.state
  let best = -1
  let bd = within
  for (const j of sim._air || airList(sim)) {
    if (sim.slots[j].side === sim.slots[i].side || j === i) continue
    const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 1] - s.pos[3 * i + 1], s.pos[3 * j + 2] - s.pos[3 * i + 2])
    if (d < bd) {
      bd = d
      best = j
    }
  }
  return best
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
  for (let i = 0; i < sim.capacity; i++) if (s.alive[i] === 1 && sim.slots[i].kind === 'aircraft' && !sim.slots[i].parked) out.push(i)
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
    if (pl && pl.engaged && s.alive[pl.unitIndex] === 1) recruit(sim)
    if (sim._released.size) recruitOnReleased(sim)
    signalRaids(sim)
    savedCarriers(sim)
  }
  for (let i = 0; i < sim.capacity; i++) {
    const u = sim.slots[i]
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
  const pu = sim.slots[pi]
  const px = s.pos[3 * pi]
  const py = s.pos[3 * pi + 1]
  const pz = s.pos[3 * pi + 2]
  if (pl.kind === 'aircraft') {
    let fighting = 0
    for (const i of sim._air) if (sim.slots[i].authority === 'ai' && X[i].ai?.mode === 'fight' && X[i].ai.target === pi) fighting++
    if (fighting < 4) {
      const cand = []
      for (const i of sim._air) {
        const u = sim.slots[i]
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
        sim._toAI(i, 'engaged the player')
        X[i].ai.mode = 'fight'
        X[i].ai.target = pi
      }
    }
    // the wingman: a fighter of the player's own group turns into an enemy on the player's tail
    if (pu.groupIndex >= 0 && X[pi].model.type === 'fighter') {
      const tail = sim._air.find((i) => sim.slots[i].authority === 'ai' && X[i].ai?.mode === 'fight' && X[i].ai.target === pi && Math.hypot(s.pos[3 * i] - px, s.pos[3 * i + 2] - pz) < 1200)
      if (tail != null) {
        const mate = sim._air.find((i) => i !== pi && sim.slots[i].groupIndex === pu.groupIndex && (sim.slots[i].authority === 'record' || X[i].ai?.mode === 'rejoin'))
        if (mate != null && !sim._air.some((i) => X[i].ai?.mode === 'fight' && X[i].ai.target === tail && sim.slots[i].side === pu.side)) {
          sim._toAI(mate, 'turned into the attacker')
          X[mate].ai.mode = 'fight'
          X[mate].ai.target = tail
        }
      }
    }
  } else if (targetable(sim, pi)) {
    // strikes sent at the player's ship: real from 150 s before their attack (none at a ship past her fatal)
    for (const g of sim.record.groups) {
      if (!g.attack?.targets?.some((x) => x.unit >= 0 && sim.record.ships[x.unit]?.slot === pi)) continue
      for (const ac of g.aircraft) {
        if (sim.record.ships[ac.target ?? g.attack.targetUnit]?.slot !== pi) continue
        const i = ac.slot
        if (i == null || sim.slots[i].authority !== 'record' || s.alive[i] !== 1) continue
        if (ac.releaseT == null || sim.t < ac.releaseT - 150 || sim.t > ac.releaseT + 30) continue
        sim._toAI(i, 'its attack flown for real')
        X[i].ai.mode = g.attack.profile === 'torpedo' ? 'torpedo' : g.attack.profile === 'level' ? 'level' : 'dive'
        X[i].ai.target = pi
        X[i].ai.from = g.attack.fromDeg ?? headingOf(s.pos[3 * i] - s.pos[3 * pi], s.pos[3 * i + 2] - s.pos[3 * pi + 2])
        X[i].ai.pushOver = g.attack.pushOverM ?? Math.max(1500, s.pos[3 * i + 1])
        X[i].ai.releaseM = g.attack.releaseM ?? 600
      }
    }
  }
}

/** Strikes the record sends at a ship the player touched and gave back are flown for real (her record events stay unscripted, ROUND-2 §3). */
function recruitOnReleased(sim) {
  const s = sim.state
  const X = sim._X
  for (const pi of sim._released) {
    if (sim.slots[pi].kind !== 'ship' || !targetable(sim, pi)) continue
    if (sim.player && sim.player.unitIndex === pi) continue
    for (const g of sim.record.groups) {
      if (!g.attack?.targets?.some((x) => x.unit >= 0 && sim.record.ships[x.unit]?.slot === pi)) continue
      for (const ac of g.aircraft) {
        if (sim.record.ships[ac.target ?? g.attack.targetUnit]?.slot !== pi) continue
        const i = ac.slot
        if (i == null || sim.slots[i].authority !== 'record' || s.alive[i] !== 1) continue
        if (ac.releaseT == null || sim.t < ac.releaseT - 150 || sim.t > ac.releaseT + 30) continue
        sim._toAI(i, 'its attack flown for real')
        X[i].ai.mode = g.attack.profile === 'torpedo' ? 'torpedo' : g.attack.profile === 'level' ? 'level' : 'dive'
        X[i].ai.target = pi
        X[i].ai.from = g.attack.fromDeg ?? headingOf(s.pos[3 * i] - s.pos[3 * pi], s.pos[3 * i + 2] - s.pos[3 * pi + 2])
        X[i].ai.pushOver = g.attack.pushOverM ?? Math.max(1500, s.pos[3 * i + 1])
        X[i].ai.releaseM = g.attack.releaseM ?? 600
      }
    }
  }
}

/**
 * A saved carrier (R7 §4.7, D12): a carrier the record lost, not doomed in
 * the player's battle, launches what the record says was ready (a unit's
 * optional `ready: [{ t, kit, count }]`, 30 minutes to spot it) at the
 * nearest enemy carrier, its last contact. Labelled the sim's guess.
 */
function savedCarriers(sim) {
  const s = sim.state
  for (const r of sim.record.ships) {
    if (!r.ready?.length || r.sinkT == null) continue
    const i = r.slot
    const x = sim._X[i]
    const d = x.dmg
    if (!x.touched || d.regime !== 'sim' || d.doomed || d.sinking || d.out || s.alive[i] !== 1) continue
    x.launched ||= new Set()
    for (const [k, rd] of r.ready.entries()) {
      const tReady = (typeof rd.t === 'number' ? rd.t : sim.clock.parse(rd.t)) + 1800
      if (x.launched.has(k) || sim.t < tReady) continue
      x.launched.add(k)
      // the last contact: the nearest enemy carrier afloat
      let tgt = -1
      let best = Infinity
      for (const q of sim.record.ships) {
        const j = q.slot
        if (q.side === r.side || !targetable(sim, j) || !sim._X[j].model?.carrier) continue
        const dd = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
        if (dd < best) {
          best = dd
          tgt = j
        }
      }
      if (tgt < 0) continue
      const m = x.model
      let n = 0
      for (let c = 0; c < (rd.count ?? 6); c++) {
        const j = sim._allocSpare(rd.kit, 'aircraft')
        if (j < 0) break
        const xj = sim._X[j]
        const h = s.heading[i] * DEG
        xj.body = createAirBodyAt(xj.model, s.pos[3 * i] + Math.sin(h) * (c * 30 - m.L * 0.3), (m.fdTop ?? 20) + 30 + c * 15, s.pos[3 * i + 2] - Math.cos(h) * (c * 30 - m.L * 0.3), s.heading[i])
        xj.ai = createAirAI(sim, j)
        const air = xj.model.torpedo ? 'torpedo' : 'dive'
        Object.assign(xj.ai, { mode: air, target: tgt, from: headingOf(s.pos[3 * i] - s.pos[3 * tgt], s.pos[3 * i + 2] - s.pos[3 * tgt + 2]), pushOver: 4000, releaseM: 600, phase: 'approach' })
        xj.ammo = ammoOf(xj.model)
        sim.slots[j].side = r.side
        sim._setAlive(j, 1)
        n++
      }
      if (n) {
        sim._guess ||= []
        sim._guess.push({ unit: r.id, t: sim.t, text: `${r.name}: ${n} aircraft launched against ${sim.slots[tgt].name}: the sim's guess; the record has no such strike` })
        sim.beat(i, 'launches', `${r.name}: launching (the sim's guess; the record has no such strike)`)
      }
    }
  }
}

function createAirBodyAt(model, x, y, z, heading) {
  const b = { ...createAirBody0(model), x, y, z, psi: heading * DEG }
  return b
}

/** A Japanese ship that sights a raid fires two bursts toward it, and the CAP turns to them (R7 §4.6). */
function signalRaids(sim) {
  const s = sim.state
  const X = sim._X
  sim._signalled ||= new Set()
  for (const r of sim.record.ships) {
    const i = r.slot
    if (r.side !== 'jp' || s.alive[i] !== 1 || sim.slots[i].kind !== 'ship') continue
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

/** The record's way ahead for ship i: the heading and speed that keep it on its track (a point a minute on), catching up when behind. */
function recordWay(sim, i, x, pose = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }) {
  const s = sim.state
  const r = x.rec
  let wantH = s.heading[i]
  let wantV = s.speed[i]
  pose.heading = wantH
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
  return { wantH, wantV, pose }
}

/** An AI ship: its track (with the evasion the player's fire provokes), and its guns at the player (or at the target the record's event gave it). */
function shipThink(sim, i, x, dt) {
  const s = sim.state
  const ai = x.ai
  let { wantH, wantV, pose } = recordWay(sim, i, x)
  if (sim.t < ai.evadeUntil) {
    wantH = (pose.heading + ai.evadeTurn + 360) % 360
    wantV = clamp(wantV + ai.evadeDv, 0, x.model.vmax)
  }
  const cmd = helmsman(x.body, x.model, wantH, wantV)
  ai.helm = cmd.helm
  ai.telegraph = cmd.telegraph
  // gunnery: at the engaged player's ship, or at the ship a record event named when the player's touch left it unscripted
  const pl = sim.player
  if (!ai.engaged || x.dmg?.out || x.dmg?.sinking) return
  let ti = -1
  if (ai.target >= 0 && targetable(sim, ai.target) && sim.slots[ai.target].side !== sim.slots[i].side) ti = ai.target
  else if (pl && pl.engaged && pl.kind === 'ship') ti = pl.unitIndex
  if (ti < 0 || !targetable(sim, ti) || sim.slots[ti].side === sim.slots[i].side) return
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
    aiSalvo(sim, i, ai, bg, ready, ti, seen)
    break
  }
}

/** Whether a mount's arc covers a point. */
function bearsOn(sim, i, mt, tx, tz) {
  const s = sim.state
  const brg = headingOf(tx - s.pos[3 * i], tz - s.pos[3 * i + 2])
  return arcCovers(mt.arc, (brg - s.heading[i] + 360) % 360)
}

/** One AI salvo with its solution error (ENGINEERING §5); ai: the director's state ({ sol, salvos }); player: the player's ship's own director. */
function aiSalvo(sim, i, ai, bg, mounts, ti, seen, player = false) {
  const s = sim.state
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
  const n = fireMounts(sim, i, bg, mounts, px, pz, { salvo, target: ti, player, mountError: () => [g.gauss() * sR * share, g.gauss() * sD * share], ux, uz })
  sol.salvos++
  if (player && n && sim._score) {
    sim._score.salvos++
    sim._score.shells += n
  }
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
  const veteran = sim.slots[i].side === 'jp' && sim.year <= 1942
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
    // (a unit the player touched and gave back stays the AI's: ROUND-2 §3)
    if (d < 300 && !x.lostAt && !x.keepAI && sim.slots[i].authority === 'ai' && t < x.ac.endT) {
      sim.slots[i].authority = 'record'
      x.prev = null
      x.body = null
      x.ai = null
    }
  } else {
    // (an aircraft with no plan of the record's, a saved carrier's strike: on, and gone after a quarter of an hour)
    ai.aim = [Math.sin(b.psi), 0.05, -Math.cos(b.psi)]
    ai.homeT ??= t + 900
    if (t > ai.homeT && sim.player?.unitIndex !== i) sim._setAlive(i, 0)
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
  if (!pl.engaged) {
    // a soft take: the record moves the unit; the first act takes it off the record (ROUND-2 §3)
    syncPlayerBody(sim, pl)
    if (s.alive[i] !== 1 || !inputTouched(pl)) return
    sim._engagePlayer(pl, 'input')
  }
  if (pl.kind === 'ship') return playerShip(sim, pl, i, x, dt)
  return playerAir(sim, pl, i, x, dt)
}

/** The helm the record would have: steering for the place a minute on along the unit's track. */
function recordHelm(sim, i, x) {
  const w = recordWay(sim, i, x)
  return helmsman(x.body, x.model, w.wantH, w.wantV)
}

/** The ship the record has unit i firing at now (an opens-fire without a cease-fire, its target or the next it hits), or −1. */
export function recordFireTarget(sim, i) {
  const r = sim._X[i].rec
  if (!r) return -1
  let open = null
  for (const ev of r.events) {
    if (ev.t > sim.t) break
    if (ev.kind === 'opens-fire') open = ev
    else if (ev.kind === 'ceases-fire') open = null
  }
  if (!open) return -1
  let target = open.target ? sim.record.shipById.get(open.target)?.slot ?? -1 : -1
  let until = open.t + 1200
  let next = null
  for (const s2 of sim.record.ships) {
    for (const e of s2.events) {
      if (e.by !== r.id || e.t < open.t || !HIT.has(e.kind)) continue
      until = Math.max(until, e.t + 600)
      if (e.t >= sim.t && (!next || e.t < next.t)) next = { t: e.t, slot: s2.slot }
    }
  }
  if (sim.t > until) return -1
  if (target < 0 && next) target = next.slot
  return target
}
const HIT = new Set(['hit', 'torpedo-hit'])

function playerShip(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const st = x.dmg
  const at = (n) => pl.allStations || pl.station === n
  if (s.alive[i] === 1) {
    let helm = inp.helm
    let tel = inp.telegraph
    if (at('helm')) {
      if (Math.abs(helm - (pl.base.helm ?? 0)) > 1e-3 || Math.abs(tel - (pl.base.telegraph ?? 0)) > 1e-3) pl.steered = true
      // Assisted: the course held while the helm is centred (ROUND-2 §1.2)
      if (sim.assist === 'assisted' && Math.abs(helm) < 1e-3 && pl.steered) {
        pl.courseHold ??= x.body.heading
        helm = helmsman(x.body, x.model, pl.courseHold, 0).helm
      } else pl.courseHold = null
      if (!pl.steered && !pl.allStations) {
        // (at the helm but not yet steered: on the record's way)
        const c = recordHelm(sim, i, x)
        helm = c.helm
        tel = c.telegraph
      }
    } else {
      // the helm held by the AI: the record's way until the player has steered, then the course and speed left
      const c = pl.steered ? helmsman(x.body, x.model, pl.hold.heading, pl.hold.speed) : recordHelm(sim, i, x)
      helm = c.helm
      tel = c.telegraph
    }
    stepShip(x.body, x.model, helm, tel, dt, speedCap(st, x.model, sim.t), st.rudderJam)
    grounding(sim, i, x)
  }
  writeShip(sim, i)
  if (s.alive[i] !== 1 || st.out) return
  const seen = pl._seen
  if (at('main')) playerMainBattery(sim, pl, i, x, dt)
  else {
    // the main battery held by the AI: on the target the player left it on, or the record's
    seen.salvoCount = inp.salvoCount
    seen.starshellCount = inp.starshellCount
    mainDirector(sim, pl, i, x, dt)
  }
  // torpedoes: one mount's spread per press, on the aim's bearing if the tubes bear
  if (inp.torpedoCount > seen.torpedoCount) {
    seen.torpedoCount = inp.torpedoCount
    if (at('torpedoes')) fireShipTorpedoes(sim, i, x, inp.aimAz ?? s.heading[i], inp.aimRange, inp.spread)
  }
  if (pl.allStations) {
    // the AA (a bookmark, as the first build): Space points every bearing mount at the pointer's aircraft for 5 s
    if (inp.aa) {
      let t = inp.aaTarget ?? -1
      if (t < 0 && inp.aaDir) t = nearestAircraftOnRay(sim, i, inp.aaDir)
      if (t >= 0) {
        pl.aaTarget = t
        pl.aaUntil = sim.t + P.aa.directS
      }
    }
  } else if (pl.station === 'aa') aaDirector(sim, pl, i, x, dt)
}

/** The player at the main battery: the turrets traverse to the aim, a salvo on a click, star shell. */
function playerMainBattery(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const st = x.dmg
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
    const ready = bg.mounts.filter((mt) => mt.readyAt <= sim.t && arcCovers(mt.arc, (aimAz - s.heading[i] + 360) % 360) && Math.abs(wrap180(aimAz - s.heading[i] - mt.bearing)) < 1.5)
    if (ready.length) {
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
}

/**
 * The main battery held by the AI while the player is at another station
 * (ROUND-2 §3: "main battery keeps its target"): the target the player left
 * it on, or the ship the record has her firing at, with the AI's gunnery (a
 * solution error that improves with seen falls, ENGINEERING §5). Her shells
 * are the player's (the player holds the ship): their hits are the sortie's.
 */
function mainDirector(sim, pl, i, x, dt) {
  const s = sim.state
  let ti = pl.hold.mainTarget ?? -1
  if (!(ti >= 0) || !targetable(sim, ti) || sim.slots[ti].side === sim.slots[i].side) ti = recordFireTarget(sim, i)
  pl.directorTarget = ti
  if (!(ti >= 0) || !targetable(sim, ti) || sim.slots[ti].side === sim.slots[i].side || sim.slots[ti].kind !== 'ship') return
  pl.director ||= { sol: createSolution(P.aiGun), salvos: new Map(), lastSeenT: -1e9 }
  const ai = pl.director
  const tx = s.pos[3 * ti]
  const tz = s.pos[3 * ti + 2]
  const obs = { x: s.pos[3 * i], y: x.model.top * 0.8, z: s.pos[3 * i + 2], sensors: x.model.sensors }
  const seen = sim.sight.sees(obs, { x: tx, y: 10, z: tz, big: true, lit: sim._X[ti].litUntil > sim.t })
  if (!seen) return
  ai.lastSeenT = sim.t
  trackTarget(ai.sol, s.vel[3 * ti], s.vel[3 * ti + 2], dt, P.aiGun.leadLagS)
  noteTargetManoeuvre(ai.sol, P.aiGun, s.heading[ti], s.speed[ti] / KN, sim.t)
  const R0 = Math.hypot(tx - s.pos[3 * i], tz - s.pos[3 * i + 2])
  for (const bg of x.guns) {
    if (bg.battery.role !== 'main') continue
    if (R0 > bg.battery.table.maxRange * 0.98) continue
    const ready = bg.mounts.filter((mt) => mt.readyAt <= sim.t && bearsOn(sim, i, mt, tx, tz))
    if (!ready.length || ready.length < Math.ceil(bg.mounts.length * 0.3)) continue
    aiSalvo(sim, i, ai, bg, x.dmg.crippled ? ready.slice(0, Math.ceil(ready.length / 2)) : ready, ti, seen, true)
    break
  }
}

/** A world direction from an aim: input.aa as a point, or input.aimAz/aimEl (compass degrees, degrees above the horizon). */
function aimDirOf(inp, eye) {
  if (Array.isArray(inp.aa) && inp.aa.length === 3) {
    const d = [inp.aa[0] - eye[0], inp.aa[1] - eye[1], inp.aa[2] - eye[2]]
    const L = Math.hypot(d[0], d[1], d[2]) || 1
    return [d[0] / L, d[1] / L, d[2] / L]
  }
  const az = (inp.aimAz ?? 0) * DEG
  const el = clamp(inp.aimEl ?? 0, -10, 89) * DEG
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)]
}

/** The aircraft of the other side nearest an aim's line from eye, within maxDeg of it and maxRange: its slot or −1. */
function aimedAircraft(sim, i, eye, dir, maxDeg, maxRange) {
  const s = sim.state
  let best = -1
  let bestA = maxDeg * DEG
  for (const j of sim._air || []) {
    if (j === i || sim.slots[j].side === sim.slots[i].side) continue
    const px = s.pos[3 * j] - eye[0]
    const py = s.pos[3 * j + 1] - eye[1]
    const pz = s.pos[3 * j + 2] - eye[2]
    const L = Math.hypot(px, py, pz)
    if (L > maxRange || L < 1) continue
    const a = Math.acos(clamp((px * dir[0] + py * dir[1] + pz * dir[2]) / L, -1, 1))
    if (a < bestA) {
      bestA = a
      best = j
    }
  }
  return best
}

/**
 * The lead: the direction from eye (moving at own velocity ov) in which a
 * round at muzzle velocity mv meets aircraft j (its mean speed over the
 * flight about 0.75 mv; two iterations). Returns { dir, point, tof, range }.
 */
export function leadOn(sim, eye, ov, j, mv) {
  const s = sim.state
  const vm = 0.75 * mv
  const rx = s.vel[3 * j] - ov[0]
  const ry = s.vel[3 * j + 1] - ov[1]
  const rz = s.vel[3 * j + 2] - ov[2]
  const px = s.pos[3 * j] - eye[0]
  const py = s.pos[3 * j + 1] - eye[1]
  const pz = s.pos[3 * j + 2] - eye[2]
  let tof = Math.hypot(px, py, pz) / vm
  let lx = px
  let ly = py
  let lz = pz
  for (let k = 0; k < 3; k++) {
    lx = px + rx * tof
    ly = py + ry * tof
    lz = pz + rz * tof
    tof = Math.hypot(lx, ly, lz) / vm
  }
  const L = Math.hypot(lx, ly, lz) || 1
  return { dir: [lx / L, ly / L, lz / L], point: [eye[0] + lx, eye[1] + ly, eye[2] + lz], tof, range: Math.hypot(px, py, pz) }
}

const angleMil = (a, b) => Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)) * 1000
const cone = (mil, width) => Math.max(0, 1 - mil / width)
const aspectFrom = (sim, j) => {
  const s = sim.state
  const vy = s.vel[3 * j + 1]
  const v = Math.max(1, s.speed[j])
  const y = s.pos[3 * j + 1]
  return vy / v < -0.5 ? 'dive' : y < 120 && Math.abs(vy / v) < 0.1 ? 'torpedo' : 'crossing'
}

/** An aircraft the player's fire reaches leaves the record: its fate is the sim's (ROUND-2 §3). */
function firedOnAircraft(sim, j) {
  if (sim.slots[j].authority === 'record') {
    sim._toAI(j, 'fired on by the player')
    const xj = sim._X[j]
    if (xj.ai && xj.ai.mode !== 'fight') xj.ai.mode = 'rejoin'
  }
  sim._X[j].firedOnByPlayer = true
}

/**
 * The AA director station (ROUND-2 §3): the player aims the ship's AA (the
 * mounts that bear) along input.aimAz/aimEl or at input.aa as a point, and
 * fires with fireHeld or fireCount (half a second a press). The eye sees
 * tracer from the ship and bursts at the aim point; the hits come from the AA
 * hazard (aa.js) with the ship's whole λ on the aimed aircraft (share 1),
 * scaled by the lead error: a cone full at 0 mil and zero beyond 40 mil for
 * the heavy mounts and 80 for the machine guns.
 */
function aaDirector(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const seen = pl._seen
  const m = x.model
  const eye = [s.pos[3 * i], (m.deck ?? 10) + 6, s.pos[3 * i + 2]]
  const dir = aimDirOf(inp, eye)
  const reach = aaReach(m)
  const j = aimedAircraft(sim, i, eye, dir, P.aaStation.aimedWithinDeg, reach)
  pl.aaDir = dir
  pl.aaAimed = j
  if (inp.fireCount > seen.fireCount) {
    seen.fireCount = inp.fireCount
    pl.aaPulse = sim.t + 0.5
  }
  const firing = !!m.aa.length && (inp.fireHeld || sim.t < (pl.aaPulse ?? -1))
  pl.aaFiring = firing
  pl.aaCone = 0
  if (!firing) return
  const R = j >= 0 ? Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2]) : 2500
  // the eye's tracer and bursts, at the aim point
  pl.aaFxT = (pl.aaFxT ?? 0) - dt
  if (pl.aaFxT <= 0) {
    pl.aaFxT = P.aaStation.tracerS
    if (sim._score) sim._score.aaBursts++
    const r = sim.rngs.fx
    const h = s.heading[i] * DEG
    const along = (r.next() - 0.5) * m.L * 0.6
    const side = dir[0] * Math.cos(h) + dir[2] * Math.sin(h) >= 0 ? 1 : -1
    const ox = s.pos[3 * i] + Math.sin(h) * along + Math.cos(h) * side * m.B * 0.4
    const oz = s.pos[3 * i + 2] - Math.cos(h) * along + Math.sin(h) * side * m.B * 0.4
    const oy = (m.deck ?? 8) + 3
    const light = Math.min(R, 2000)
    sim.fx(FX.tracer, ox, oy, oz, { unit: i, dx: eye[0] + dir[0] * light - ox + r.gauss() * light * 0.01, dy: eye[1] + dir[1] * light - oy + r.gauss() * light * 0.01, dz: eye[2] + dir[2] * light - oz + r.gauss() * light * 0.01, size: 1, data: 1 })
    if (m.aa.some((a) => a.heavy) && R > 600) sim.fx(FX.flash, eye[0] + dir[0] * R + r.gauss() * R * 0.02, eye[1] + dir[1] * R + r.gauss() * R * 0.02, eye[2] + dir[2] * R + r.gauss() * R * 0.02, { unit: i, size: 1, data: 1 })
  }
  if (j < 0 || s.alive[j] !== 1) return
  // the hits: the ship's λ concentrated on the aimed aircraft, scaled by the lead error
  const ov = [s.vel[3 * i], 0, s.vel[3 * i + 2]]
  let lam = 0
  let best = 0
  for (const a of m.aa) {
    if (R > a.rangeM) continue
    const lead = leadOn(sim, eye, ov, j, a.weapon?.mvMs ?? (a.heavy ? 790 : 850))
    const c = cone(angleMil(dir, lead.dir), a.heavy ? P.aaStation.coneHeavyMil : P.aaStation.coneLightMil)
    best = Math.max(best, c)
    lam += a.lambda * a.barrels * P.aa.bearingShare * fRange(R, a.rangeM) * c
  }
  pl.aaCone = best
  if (best <= 0) return
  firedOnAircraft(sim, j)
  const xs = sim._X[i]
  xs.sighted ??= {}
  const key = sim.slots[j].groupIndex >= 0 ? sim.slots[j].groupIndex : `u${j}`
  xs.sighted[key] ??= sim.t
  const era = eraFactor(sim.slots[i].side, sim.year, { peacetime: sim.year === 1941 && sim.slots[i].side === 'us' })
  lam *= era * alertAt(sim.t, xs.sighted[key]) * aspectOf(aspectFrom(sim, j)) * (x.dmg?.crippled ? 0.5 : 1)
  const xj = sim._X[j]
  const r = hazardStep(lam, dt, sim.rngs.aa)
  if (r === 'kill') loseAircraft(sim, j, 'aa', 'player')
  else if (r === 'hit' && xj.body) {
    xj.body.damage = Math.min(0.95, xj.body.damage + hitDamage(m, R, sim.rngs.aa))
    sim.fx(FX.smoke, xj.body.x, xj.body.y, xj.body.z, { unit: j, size: 0.4 })
    sim._diverge?.(j, 'hit by the player’s AA')
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
    if (sim.slots[j].side === sim.slots[i].side) continue
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

// --- an aircraft's name on the HUD (R8 §5.1, 9 and 13) ----------------------------------------------------------
// A record aircraft carries its whole group's name ("Two P-40Bs of the 47th Pursuit Squadron from Haleʻiwa"), so
// a line about one aircraft names the one: the player's by its role ("a Dauntless of Bombing Six"), any other as
// one of its kind of its group ("a Zero of the combat air patrol against Torpedo Eight").
export const KIT_SHORT = {
  a6m2: 'Zero', a6m5: 'Zero', d3a1: 'Type 99 carrier bomber', b5n2: 'Type 97 carrier attack plane', d4y1: 'Suisei', b6n2: 'Tenzan', e13a1: 'Type 0 reconnaissance seaplane', f1m2: 'Type 0 observation seaplane',
  'f4f-3': 'Wildcat', 'f4f-4': 'Wildcat', 'fm-2': 'Wildcat', 'f6f-3': 'Hellcat', 'f2a-3': 'Buffalo', 'sbd-3': 'Dauntless', 'sb2u-3': 'Vindicator', 'tbd-1': 'Devastator', 'tbf-1': 'Avenger', 'tbm-1c': 'Avenger',
  'p-40b': 'P-40B', 'p-36a': 'P-36A', 'pby-5': 'Catalina', 'b-17e': 'B-17', 'b-26': 'B-26', 'b-18': 'B-18', 'a-20': 'A-20',
}
const COUNT_OF = /^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+\S+\s+of\s+/i
const upper = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function oneAircraft(sim, i) {
  const u = sim.slots[i]
  const name = KIT_SHORT[u.kit] ?? String(sim._X[i].model?.name ?? u.kit ?? 'aircraft').split(/\s+/).pop()
  const one = `${/^[AEIOU]/.test(name) ? 'an' : 'a'} ${name}`
  let g = u.groupIndex >= 0 ? sim.record.groups[u.groupIndex]?.name : null
  if (!g) return one
  g = g.replace(COUNT_OF, '').replace(/^The\b/, 'the')
  if (/^[a-z0-9]/.test(g) && !/^the\b/.test(g)) g = `the ${g}`
  return `${one} of ${g}`
}

/** One aircraft of its group, in the HUD's words ("a Dauntless of Bombing Six"): the unit list's and the card's label. */
export const oneAircraftName = (sim, i) => oneAircraft(sim, i)

/** The HUD's name for aircraft i: the player's role, or one of its kind of its group; capitalised to open a line. */
export function airName(sim, i) {
  const pl = sim.player
  return upper(pl && pl.unitIndex === i && pl.role?.name ? pl.role.name : oneAircraft(sim, i))
}

function grounding(sim, i, x) {
  const b = x.body
  const m = x.model
  const [ux, uz] = courseVec(b.heading)
  const bow = sim.world.metresAt(b.x + ux * m.L * 0.45, b.z + uz * m.L * 0.45)
  if (bow > -m.T * 0.8 && !b.aground) {
    b.aground = true
    sim.beat(i, 'aground', `${sim.slots[i].name}: aground`)
  }
}

function playerAir(sim, pl, i, x, dt) {
  const s = sim.state
  const inp = pl.input
  const b = x.body
  if (s.alive[i] === 2) return
  const at = (n) => pl.allStations || pl.station === n
  if (at('pilot')) {
    if (pilotActed(pl)) pl.flown = true
    if (sim.assist === 'assisted' && !b.broken) {
      const cmd = assistedCommand(sim, pl, i, x, dt)
      stepAir(b, x.model, { throttle: cmd.throttle, yaw: (inp.yaw ?? 0) * 0.5, brakes: cmd.brakes ?? undefined }, dt, cmd)
      assistAfter(sim, pl, i, x)
    } else {
      // Pilot: the first build's step
      pl.assisting = null
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
    }
  } else {
    if (pl.station === 'bombardier') bombardierSteer(sim, pl, dt)
    pilotAI(sim, pl, i, x, dt)
  }
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
    sim.beat(i, 'damage', `${airName(sim, i)}: a control surface failed`)
  }
  // the weapons, by station: the fixed guns, the bombs and the torpedo are the pilot's; the rear gun the gunner's; the stick the bombardier's
  const seen = pl._seen
  if (at('pilot')) {
    const firing = inp.fireHeld || inp.fireCount > seen.fireCount
    seen.fireCount = inp.fireCount
    if (firing) fireAirGuns(sim, i, x, true)
  } else if (pl.station === 'gunner') rearGunner(sim, pl, i, x, dt)
  else {
    seen.fireCount = inp.fireCount
  }
  if (inp.bombCount > seen.bombCount) {
    seen.bombCount = inp.bombCount
    if (pl.station === 'bombardier' && !pl.allStations) releaseStick(sim, pl, i, x)
    else if (at('pilot')) dropBomb(sim, i, x, true)
  }
  if (pl.stick) stickStep(sim, pl, i, x)
  if (inp.torpedoCount > seen.torpedoCount) {
    seen.torpedoCount = inp.torpedoCount
    if (at('pilot')) dropTorpedo(sim, i, x, true)
  }
}

/** Whether the player has flown at the pilot's station since the take (the pilot AI then holds what they left). */
function pilotActed(pl) {
  const inp = pl.input
  const b = pl.base
  if (Math.abs(inp.pitch ?? 0) > 1e-3 || Math.abs(inp.roll ?? 0) > 1e-3 || Math.abs(inp.yaw ?? 0) > 1e-3) return true
  if (Math.abs((inp.throttle ?? 0) - (b.throttle ?? 0)) > 1e-3) return true
  return !!(inp.aimDir && inp.mode !== 'direct')
}

// --- the pilot the player is not at (ROUND-2 §3) ----------------------------------------------------------------

/**
 * The pilot station held by the AI: the record's path while the player has
 * not flown the aircraft (a spare has none: it holds), else the heading,
 * height and speed the player left; at the bombardier's station, the run-in
 * on the bombardier's heading. The floor of Assisted flight keeps it off the
 * ground and the sea whatever the setting (it is the player's aircraft).
 */
function pilotAI(sim, pl, i, x, dt) {
  const b = x.body
  const t = sim.t
  const ctx = { motion: sim.record.motion, groups: sim.record.groups }
  let aim
  let vWant = pl.hold.speed || b.V
  const runIn = pl.station === 'bombardier' && pl.bombSteered
  if (!pl.flown && !runIn && x.ac?.plan?.legs?.length && t < x.ac.endT) {
    const p = { x: 0, y: 0, z: 0 }
    const q = { x: 0, y: 0, z: 0 }
    planPos(x.ac, t + 4, p, ctx)
    planPos(x.ac, t + 5, q, ctx)
    aim = [p.x - b.x, p.y - b.y, p.z - b.z]
    if (Math.hypot(aim[0], aim[2]) < 30) aim = [q.x - p.x, q.y - p.y, q.z - p.z]
    vWant = Math.max(stallSpeed(b, x.model) * 1.3, Math.hypot(q.x - p.x, q.y - p.y, q.z - p.z))
    // the pilot releases what the record has this aircraft release
    for (const a of x.ac.actions || []) {
      if (a.t > t || a.t <= t - dt - 1e-9) continue
      if (a.kind === 'release') dropBomb(sim, i, x, true)
      else if (a.kind === 'drop') dropTorpedo(sim, i, x, true)
    }
  } else {
    const h = pl.hold.heading * DEG
    const dy = clamp(((pl.hold.alt ?? b.y) - b.y) / 600, -0.25, 0.25)
    aim = [Math.sin(h), dy, -Math.cos(h)]
  }
  const cmd = instructor(b, x.model, aim, { maxG: 3 })
  const fl = floorAhead(sim, pl, i, x, envelopeOf(sim, pl, i, x))
  if (fl > 0) cmd.n = Math.max(cmd.n, Math.cos(b.gamma) / Math.max(0.3, Math.cos(b.phi)) + clamp(fl / 40, 0, 3))
  const throttle = clamp(b.throttle + (vWant - b.V) * 0.05 * dt, 0.3, 1)
  stepAir(b, x.model, { throttle }, dt, cmd)
  assistAfter(sim, pl, i, x, { hardOnly: true })
}

// --- assisted flight (ROUND-2 §1.2, §3) ------------------------------------------------------------------------

/**
 * The player's aircraft at the pilot's station in Assisted: the stick or the
 * mouse-aim turned into a load factor and a roll rate, then limited and
 * held: a bank limit of 60°, path angles of +25° and −30° (−80° in a dive
 * bomber's dive), an angle-of-attack limiter in place of the stall, an
 * overspeed limiter in place of the break-up, the wings levelled and the
 * height held when the stick is centred, the instructor's gain scaled down
 * with speed, the floor (60 m over land, 15 m over the sea, suspended to 15
 * and 10 on a weapon run below it), and the weapon envelope: the height and
 * speed of the drop on a torpedo run's last 1,500 m (a 5° glide down to it
 * before), the dive's speed in its last 800 m, the height and speed held on a
 * level run's last 20 s. Returns { n, p, throttle, brakes } for stepAir.
 */
function assistedCommand(sim, pl, i, x, dt) {
  const A = P.assist
  const b = x.body
  const m = x.model
  const inp = pl.input
  const V = Math.max(1, b.V)
  const vs = stallSpeed(b, m)
  const q = 0.5 * rho(Math.max(0, b.y)) * V * V
  const nLift = (q * m.S * m.clMax) / (b.mass * G)
  const cphi = Math.max(0.3, Math.cos(b.phi))
  const n0 = Math.cos(b.gamma) / cphi
  const nFor = (gWant, tau = 1.5) => (Math.cos(b.gamma) + (V * (gWant - b.gamma)) / (G * tau)) / cphi
  const pMax = tableAt(m.rollTable, V) * DEG
  const env = envelopeOf(sim, pl, i, x)
  const why = []
  let throttle = clamp(inp.throttle ?? b.throttle, 0, 1)
  let brakes = null
  let n
  let p
  const direct = inp.mode === 'direct' || !inp.aimDir
  if (!direct) {
    const gain = P.air.instructorGain * clamp((m.vCruise * A.gainSpeedRef) / V, A.gainFloor, 1)
    const c = instructor(b, m, inp.aimDir, { gain })
    n = c.n + (inp.pitch ? inp.pitch * 2 : 0)
    p = c.p
    pl.altHold = null
  } else {
    // roll: the stick rolls; centred, the wings come level
    const roll = clamp(inp.roll ?? 0, -1, 1)
    p = Math.abs(roll) > 0.02 ? roll * pMax : clamp(-b.phi * A.levelGain, -pMax, pMax)
    // pitch: the stick pulls or pushes about the load that holds the path; centred, the height is held
    const pitch = clamp(inp.pitch ?? 0, -1, 1)
    if (Math.abs(pitch) > 0.02) {
      pl.altHold = null
      n = pitch >= 0 ? n0 + pitch * Math.max(0, nMaxAt(b, m) * 0.8 - n0) : n0 + pitch * 1.6
    } else {
      if (pl.altHold == null) pl.altHold = b.y
      let hold = pl.altHold
      if (env.hold != null) {
        hold = env.hold
        why.push('envelope')
      } else if (env.glide != null && env.glide < hold) {
        hold = env.glide
        why.push('envelope')
      }
      pl.altHold = env.hold != null || (env.glide != null && env.glide < pl.altHold) ? hold : pl.altHold
      const gWant = clamp((hold - b.y) * A.holdGain, -A.holdMaxDeg * DEG, A.holdMaxDeg * DEG)
      n = nFor(gWant)
    }
  }
  // the bank limit
  const bl = A.bankDeg * DEG
  if (b.phi > bl - 0.03 && p > 0) {
    p = Math.min(p, -(b.phi - bl) * 4)
    why.push('bank')
  } else if (b.phi < -bl + 0.03 && p < 0) {
    p = Math.max(p, -(b.phi + bl) * 4)
    why.push('bank')
  }
  // the path angle limits (a dive bomber's dive may go steep)
  const gUp = A.pitchUpDeg * DEG
  const gDn = -(env.divePermitted ? A.diveDeg : A.pitchDownDeg) * DEG
  if (b.gamma > gUp - 0.05 && n > nFor(gUp)) {
    n = Math.min(n, nFor(gUp, 1))
    why.push('pitch')
  }
  if (b.gamma < gDn + 0.05 && n < nFor(gDn)) {
    n = Math.max(n, nFor(gDn, 1))
    why.push('pitch')
  }
  // the angle-of-attack limiter in place of the stall
  if (n > nLift * A.clFrac) {
    n = nLift * A.clFrac
    why.push('lift')
  }
  if (V < A.lowSpeed * vs) {
    n = Math.min(n, n0 - 0.15)
    throttle = 1
    why.push('speed')
  }
  // the overspeed limiter in place of the break-up
  if (b.ias > A.overspeed * m.vShake) {
    throttle = 0
    brakes = m.diveDrag > 0 ? true : null
    n = Math.max(n, n0 + (b.ias / m.vShake - A.overspeed) * 10)
    why.push('overspeed')
  }
  // the weapon envelope's speed
  if (env.maxV != null && V > env.maxV) {
    throttle = Math.min(throttle, clamp(0.55 - (V - env.maxV) / 15, 0, 1))
    if (env.kind === 'dive' && m.diveDrag > 0) brakes = true
    why.push('envelope')
  }
  if (env.holdV != null) throttle = clamp(throttle + (env.holdV - V) * 0.05, 0.2, 1)
  // the floor
  const short = floorAhead(sim, pl, i, x, env)
  if (short > 0) {
    n = Math.max(n, n0 + clamp(short / 30, 0.3, 3.5))
    if (Math.abs(b.phi) > 0.6) p = clamp(-b.phi * 3, -pMax, pMax)
    why.push('floor')
  }
  pl.assisting = why.length ? [...new Set(why)] : null
  return { n, p, throttle, brakes }
}

/** After the assisted step: never into the ground, the sea or a hull; never past the break-up; out of the stall. */
function assistAfter(sim, pl, i, x, { hardOnly = false } = {}) {
  const b = x.body
  const m = x.model
  const w = sim.world
  const land = w.metresAt(b.x, b.z) > 0
  const hard = w.heightAt(b.x, b.z) + (land ? 6 : 4)
  if (b.y < hard) {
    b.y = hard
    if (b.gamma < 0.02) b.gamma = 0.02
  }
  // a carrier's deck: a landing (slow, shallow) is let through; anything else lifts over it
  const s = sim.state
  for (const j of sim._shipsNear(b.x, b.z, 60)) {
    const mj = sim._X[j].model
    const d = boxDistance(b.x, b.z, s.pos[3 * j], s.pos[3 * j + 2], s.heading[j], mj.B / 2 + 4, mj.L / 2 + 4)
    if (d.d > 0) continue
    const top = (mj.fdTop ?? mj.deck ?? 8) + s.pos[3 * j + 1]
    const landing = mj.fdTop != null && b.V < stallSpeed(b, m) * 1.6 && b.gamma > -8 * DEG
    if (!landing && b.y < top + 3) {
      b.y = top + 3
      if (b.gamma < 0.02) b.gamma = 0.02
    }
  }
  if (hardOnly) return
  b.overS = 0
  const vLim = m.vBreak * 0.97
  if (b.ias > vLim) b.V *= vLim / b.ias
  if (b.stalled && b.V > stallSpeed(b, m) * 1.02) b.stalled = false
}

/**
 * The floor's shortfall ahead (m, positive when short): the path looked
 * along for six seconds against the ground (60 m over land, 15 m over the
 * sea, or 15 and 10 on a weapon run below them) and the ships' tops.
 */
function floorAhead(sim, pl, i, x, env) {
  const A = P.assist
  const b = x.body
  const w = sim.world
  const ch = Math.cos(b.gamma) * b.V
  const vx = ch * Math.sin(b.psi)
  const vz = -ch * Math.cos(b.psi)
  const vy = Math.sin(b.gamma) * b.V
  let short = -Infinity
  for (const ts of A.floorLookS) {
    const px = b.x + vx * ts
    const pz = b.z + vz * ts
    const py = b.y + vy * ts
    const land = w.metresAt(px, pz) > 0
    const floor = (land ? w.heightAt(px, pz) : 0) + (env.run ? (land ? A.floorRunLandM : A.floorRunSeaM) : land ? A.floorLandM : A.floorSeaM)
    short = Math.max(short, (floor - py) * (ts > 0 ? 1 / (1 + ts * 0.15) : 1))
  }
  // the ships ahead: over a hull, its top and some (a landing on a deck excepted)
  const s = sim.state
  const slow = b.V < stallSpeed(b, x.model) * 1.6
  for (const j of sim._shipsNear(b.x + vx * 3, b.z + vz * 3, 400)) {
    const mj = sim._X[j].model
    if (slow && mj.fdTop != null) continue
    const top = mj.top + s.pos[3 * j + 1] + A.shipClearM
    for (const ts of [0, 1.5, 3]) {
      const d = boxDistance(b.x + vx * ts, b.z + vz * ts, s.pos[3 * j], s.pos[3 * j + 2], s.heading[j], mj.B / 2 + 20, mj.L / 2 + 20)
      if (d.d <= 0) short = Math.max(short, top - (b.y + vy * ts))
    }
  }
  return short
}

/**
 * The weapon the aircraft is approaching a release with, and what the assist
 * does about it: { kind: 'torpedo' | 'dive' | 'level' | null, target, range,
 * hold (a height to hold), glide (a height not to be above), maxV, holdV,
 * run (a weapon run below the floor), divePermitted }. The profile is the
 * bookmark's objective, else the group's attack, else the kit's weapon.
 */
export function envelopeOf(sim, pl, i, x) {
  const A = P.assist
  const out = { kind: null, target: -1, range: Infinity, hold: null, glide: null, maxV: null, holdV: null, run: false, divePermitted: false }
  const am = x.ammo
  const b = x.body
  if (!am || !b) return out
  const prof = weaponProfile(sim, pl, x)
  const ti = weaponTarget(sim, pl, i, x, prof)
  out.target = ti
  if (ti < 0) {
    if (prof === 'level' && am.bombs > 0 && pl.station === 'bombardier') out.kind = 'level'
    return out
  }
  const s = sim.state
  const d = Math.hypot(s.pos[3 * ti] - b.x, s.pos[3 * ti + 2] - b.z)
  out.range = d
  if (prof === 'torpedo' && am.torpedoes > 0 && x.model.torpedo) {
    const w = x.model.torpedo
    out.kind = 'torpedo'
    const dropH = clamp((w.dropAltM ?? 30) * 0.8, A.floorRunSeaM + 6, 45)
    const runStart = A.torpedoWindowM[0] + 600 + A.torpedoRunM
    if (d < runStart) {
      out.hold = dropH
      out.maxV = (w.dropSpeedKn ?? 110) * KN * 0.95
    } else out.glide = dropH + (d - runStart) * Math.tan(A.torpedoGlideDeg * DEG)
    out.run = d < runStart + 1500
  } else if (prof === 'dive' && am.bombs > 0) {
    out.kind = 'dive'
    const h = b.y
    out.divePermitted = d < h * 1.6 + 1200
    const rel = sim._moment?.objective?.releaseM ?? x.g?.attack?.releaseM ?? 600
    if (b.gamma < -30 * DEG && h - rel < A.diveLastM) out.maxV = clamp(x.model.kit?.aero?.diveMs ?? x.model.vShake * 0.8, 85, 160)
  } else if ((prof === 'level' || pl.station === 'bombardier') && am.bombs > 0) {
    out.kind = 'level'
    const tf = Math.sqrt((2 * Math.max(50, b.y)) / G)
    const tTo = (d - b.V * tf) / Math.max(30, b.V)
    if (tTo < A.levelLastS && tTo > -10) {
      pl.levelHold ??= { y: b.y, V: b.V }
      out.hold = pl.levelHold.y
      out.holdV = pl.levelHold.V
    } else pl.levelHold = null
  }
  return out
}

/** The profile the player's weapon is flown with: the bookmark's objective, the group's attack, or the kit's own weapon. */
function weaponProfile(sim, pl, x) {
  const obj = pl.allStations || sim._moment ? sim._moment?.objective?.kind : null
  if (obj === 'dive' || obj === 'torpedo' || obj === 'level') return obj
  const prof = x.g?.attack?.profile ?? (x.wasSpare && sim.slots[pl.unitIndex].groupIndex >= 0 ? sim.record.groups[sim.slots[pl.unitIndex].groupIndex]?.attack?.profile : null)
  if (prof === 'dive' || prof === 'torpedo' || prof === 'level') return prof
  const t = x.model.kit?.type
  if (t === 'dive') return 'dive'
  if (t === 'torpedo') return x.ammo?.torpedoes > 0 ? 'torpedo' : 'level'
  if (t === 'level' || t === 'bomber' || t === 'patrol') return 'level'
  return null
}

/** The ship the weapon is for: the bookmark's target, this aircraft's attack target, or the nearest of the other side's ships ahead. */
function weaponTarget(sim, pl, i, x, prof) {
  const s = sim.state
  const ob = sim._moment?.objective
  const tid = Array.isArray(ob?.target) ? ob.target[0] : ob?.target
  const r = tid ? sim.record.shipById.get(tid) : null
  if (r && s.alive[r.slot] === 1 && targetable(sim, r.slot) && sim.slots[r.slot].side !== sim.slots[i].side) return r.slot
  const at = x.ac?.target
  if (at != null && at >= 0) {
    const j = sim.record.ships[at]?.slot
    if (j != null && targetable(sim, j) && sim.slots[j].side !== sim.slots[i].side) return j
  }
  if (!prof) return -1
  // the nearest the nose points at, within 20 km and 60° of it
  const b = x.body
  let best = -1
  let bs = Infinity
  for (const rr of sim.record.ships) {
    const j = rr.slot
    if (sim.slots[j].kind !== 'ship' || sim.slots[j].side === sim.slots[i].side || !targetable(sim, j)) continue
    const dx = s.pos[3 * j] - b.x
    const dz = s.pos[3 * j + 2] - b.z
    const d = Math.hypot(dx, dz)
    if (d > 20000) continue
    const off = Math.abs(wrap180(headingOf(dx, dz) - b.psi / DEG))
    if (off > 60) continue
    const score = d * (1 + off / 60)
    if (score < bs) {
      bs = score
      best = j
    }
  }
  return best
}

// --- the gunner and the bombardier (ROUND-2 §3) --------------------------------------------------------------

/**
 * The gunner station: the rear gun aimed along input.aimAz/aimEl, firing
 * with fireHeld or fireCount within its arc (80° about the tail), at an
 * aircraft of the other side: tracer for the eye, rounds off its drums, and
 * hits from a hazard on the aimed aircraft (P.gunner, the engine's estimate)
 * scaled by the lead error (a cone zero beyond 80 mil). The pilot flies on.
 */
function rearGunner(sim, pl, i, x, dt) {
  const s = sim.state
  const b = x.body
  const inp = pl.input
  const seen = pl._seen
  const guns = (x.ammo?.guns || []).filter((g) => !g.fixed)
  const eye = [b.x, b.y + 1, b.z]
  const dir = aimDirOf(inp, eye)
  const fr = airFrame(b)
  const offTail = Math.acos(clamp(-(dir[0] * fr.f[0] + dir[1] * fr.f[1] + dir[2] * fr.f[2]), -1, 1)) / DEG
  const up = dir[0] * fr.u[0] + dir[1] * fr.u[1] + dir[2] * fr.u[2]
  const bears = offTail <= P.gunner.arcFromTailDeg && up >= P.gunner.minUpDot
  const j = aimedAircraft(sim, i, eye, dir, 10, P.gunner.rangeM)
  pl.gunDir = dir
  pl.gunBears = bears
  pl.gunAimed = j
  if (inp.fireCount > seen.fireCount) {
    seen.fireCount = inp.fireCount
    pl.gunPulse = sim.t + 0.4
  }
  const left = guns.reduce((a, g) => a + g.left, 0)
  const firing = bears && left > 0 && (inp.fireHeld || sim.t < (pl.gunPulse ?? -1))
  pl.gunFiring = firing
  pl.gunCone = 0
  if (!firing) return
  let barrels = 0
  for (const g of guns) {
    if (g.left <= 0) continue
    const r = Math.min(g.left, ((g.count * (g.weapon.rofRpm ?? 900)) / 60) * dt)
    g.left -= r
    if (sim._score) sim._score.rounds += r
    barrels += g.count
  }
  const ov = [s.vel[3 * i], s.vel[3 * i + 1], s.vel[3 * i + 2]]
  pl.gunFxT = (pl.gunFxT ?? 0) - dt
  if (pl.gunFxT <= 0) {
    pl.gunFxT = 0.1
    const L = 500
    sim.fx(FX.tracer, eye[0], eye[1], eye[2], { unit: i, dx: dir[0] * L + ov[0] * 0.6, dy: dir[1] * L + ov[1] * 0.6, dz: dir[2] * L + ov[2] * 0.6, size: 0.5, data: 1 })
  }
  if (j < 0 || s.alive[j] !== 1) return
  const R = Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2])
  let lam = 0
  let best = 0
  for (const g of guns) {
    if (g.left <= 0) continue
    const lead = leadOn(sim, eye, ov, j, g.weapon.mvMs ?? 800)
    const c = cone(angleMil(dir, lead.dir), P.gunner.coneMil)
    best = Math.max(best, c)
    lam += (g.weapon.calibreMm >= 12 ? P.gunner.lambda.heavy : P.gunner.lambda.light) * g.count * fRangeAt(R, P.gunner.rangeM) * c
  }
  pl.gunCone = best
  void barrels
  if (best <= 0) return
  firedOnAircraft(sim, j)
  const xj = sim._X[j]
  const r = hazardStep(lam, dt, sim.rngs.aa)
  if (r === 'kill') loseAircraft(sim, j, 'shot', 'player')
  else if (r === 'hit' && xj.body) {
    xj.body.damage = Math.min(0.95, xj.body.damage + 0.3 * (0.4 + 0.4 * sim.rngs.aa.next()))
    sim.fx(FX.hit, xj.body.x, xj.body.y, xj.body.z, { unit: j, size: 0.2 })
    sim._diverge?.(j, 'hit by the player’s gunner')
    if (xj.ai && xj.ai.mode === 'fight') xj.ai.breakUntil = sim.t + 3
  }
}
const fRangeAt = (r, eff) => (r >= eff ? 0 : r <= 0.35 * eff ? 1 : (eff - r) / (eff - 0.35 * eff))

/** The bombardier's release: the whole stick, a bomb every 0.15 s. */
function releaseStick(sim, pl, i, x) {
  if (!x.ammo || x.ammo.bombs <= 0 || pl.stick) return
  pl.stick = { next: sim.t, every: 0.15 }
}
function stickStep(sim, pl, i, x) {
  const st = pl.stick
  while (st && sim.t >= st.next && x.ammo.bombs > 0) {
    dropBomb(sim, i, x, true)
    st.next += st.every
  }
  if (!x.ammo || x.ammo.bombs <= 0) pl.stick = null
}

/** The bombardier steers the run-in (the pilot's director indicator): a level of roll turns the held heading. */
export function bombardierSteer(sim, pl, dt) {
  const r = pl.input.roll ?? 0
  if (Math.abs(r) > 1e-3) {
    pl.bombSteered = true
    pl.hold.heading = (pl.hold.heading + r * 4 * dt + 360) % 360
  }
}

/**
 * The release cue (ROUND-2 §1.2): when a release now meets the target, with
 * the window twice the record's in Assisted. A bomb's: the predicted impact
 * inside the target's hull (twice its length and beam), in a dive above the
 * safe pull-out, or level (Assisted, or the bombardier). A torpedo's: inside
 * the drop envelope, at a range in the window (300–1,500 m; 150 m to twice
 * that in Assisted, within the torpedo's run) with its track meeting the hull
 * (twice its length). Returns { kind, on, value, lo, hi, miss, half } or null.
 */
function releaseCue(sim, pl, i, x, ccipNow) {
  const b = x.body
  const s = sim.state
  const k = sim.assist === 'assisted' ? P.assist.windowK : 1
  const am = x.ammo
  if (am?.torpedoes > 0 && x.model.torpedo) {
    const env = torpedoEnvelope(x.model, b)
    const ti = weaponTarget(sim, pl, i, x, 'torpedo')
    if (ti < 0) return { kind: 'torpedo', on: false, envelope: env, value: null, lo: null, hi: null }
    const w = x.model.torpedo
    const vt = ((w.speedKn ?? w.settings?.[0]?.speedKn ?? 33) || 33) * KN
    const dropFwd = b.V * Math.sqrt((2 * Math.max(1, b.y)) / G)
    const ux = Math.sin(b.psi)
    const uz = -Math.cos(b.psi)
    const x0 = b.x + ux * dropFwd
    const z0 = b.z + uz * dropFwd
    // the closest the run comes to the target holding its course and speed
    let miss = Infinity
    const mj = sim._X[ti].model
    for (let tt = 0; tt <= 240; tt += 1) {
      const px = x0 + ux * vt * tt
      const pz = z0 + uz * vt * tt
      if (vt * tt > (w.rangeM ?? 2000)) break
      const d = boxDistance(px, pz, s.pos[3 * ti] + s.vel[3 * ti] * tt, s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * tt, s.heading[ti], (mj.B / 2) * k, (mj.L / 2) * k)
      if (d.d < miss) miss = d.d
      if (miss <= 0) break
    }
    const range = Math.hypot(s.pos[3 * ti] - b.x, s.pos[3 * ti + 2] - b.z)
    const [lo0, hi0] = P.assist.torpedoWindowM
    const lo = lo0 / k
    const hi = Math.min(hi0 * k, (w.rangeM ?? 2000) * 0.9)
    const on = env.ok && range >= lo && range <= hi && miss <= 0
    return { kind: 'torpedo', on, envelope: env, value: Math.round(range), lo: Math.round(lo), hi: Math.round(hi), miss: Number.isFinite(miss) ? Math.round(Math.max(0, miss)) : null, target: ti }
  }
  if (am?.bombs > 0 && ccipNow) {
    const c = ccipNow
    const level = Math.abs(b.gamma) < 15 * DEG
    const dive = b.gamma < -30 * DEG
    const ok = (dive && b.y > safePullout(b)) || (level && (sim.assist === 'assisted' || pl.station === 'bombardier'))
    let on = false
    let miss = null
    let half = null
    const ti = c.near ?? c.target
    if (ti >= 0) {
      const mj = sim._X[ti].model
      const d = boxDistance(c.x, c.z, s.pos[3 * ti] + s.vel[3 * ti] * c.tof, s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * c.tof, s.heading[ti], (mj.B / 2) * k, (mj.L / 2) * k)
      miss = Math.round(Math.max(0, d.d))
      half = Math.round((mj.L / 2) * k)
      on = ok && d.d <= 0
    }
    return { kind: dive ? 'dive' : 'level', on, value: miss, lo: 0, hi: half, miss, half, target: ti }
  }
  return null
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
  sim.beat(i, 'landed', `${airName(sim, i)}: aboard ${sim.slots[unit].name}`)
  sim._setAlive(i, 0)
  x.how = 'landed'
  sim._score.how = 'landed'
  sim._endMoment('landed')
}

function ditched(sim, i) {
  const x = sim._X[i]
  sim.fx(FX.splash, x.body.x, 0, x.body.z, { unit: i, size: 15 })
  sim.beat(i, 'ditched', `${airName(sim, i)}: ditched`)
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
    sim.beat(i, 'lost', `${airName(sim, i)}: ${why}; did not return`)
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
    const u = sim.slots[i]
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
  if (sim.slots[i].authority === 'record') sim._toAI(i)
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

/**
 * Whether a unit may be a target now (ENGINEERING §5 "Fixed fates and
 * targets"; R8 §5.1, 3–5): a target at all (never a hospital ship), afloat,
 * and, a ship, not past its kit's fatal. In the record's regime that is its
 * record damage; in the sim's, not foundering, out of action, sinking or
 * doomed. A ship the record dooms when it is first touched keeps its record
 * fate, so it leaves the target list when the record's hits take it past.
 */
export function targetable(sim, j) {
  if (j == null || j < 0) return false
  const u = sim.slots[j]
  if (!u?.target || sim.state.alive[j] !== 1) return false
  if (u.kind !== 'ship') return true
  const x = sim._X[j]
  const fatal = x.model?.fatal ?? 1
  const d = x.dmg
  if (d?.regime === 'sim') {
    if (d.sinking || d.float >= 1 || d.fight >= 1) return false
    return !d.doomed || (d.doomedWhy === 'record' && recordDamageAt(x.rec, sim.t) < fatal)
  }
  return (x.rd?.damage ?? 0) < fatal
}

/** The record's damage on a ship by t: the shares of its fatal its hits do (as the record's own path sums them). */
function recordDamageAt(r, t) {
  let sum = 0
  for (const ev of r?.events || []) {
    if (ev.t > t) break
    if (ev.kind === 'hit' || ev.kind === 'torpedo-hit') sum += ev.damage ?? 0.08 * Math.max(1, ev.rc)
  }
  return sum
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
    sim.beat(i, 'downed', `${airName(sim, i)}: shot down`)
  }
  sim._setAlive(i, 2)
  sim.fx(FX.fall, s.pos[3 * i], s.pos[3 * i + 1], s.pos[3 * i + 2], { unit: i })
  x.fallT0 = sim.t
  if (sim.player?.unitIndex === i) {
    sim.beat(i, 'lost', `${airName(sim, i)}: did not return`)
    sim._score.how = 'lost'
    sim._endMoment('lost')
  }
}

export function bombStrike(sim, p, i, local, w) {
  const x = sim._X[i]
  const u = sim.slots[i]
  const pr = sim.projectiles
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (!targetable(sim, i)) return
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
    if (d.d < 15 && targetable(sim, i)) {
      const x = sim._X[i]
      sim._touch(i, 'near miss')
      if (m.type === 'dd' || m.type === 'de') applyHit(x.dmg, m, { cls: 'small', part: 'waterline', zone: 1, t: sim.t }, sim.rngs.dmg)
      if (pr.flags[p] & FLAG.player) {
        sim.beat(i, 'near-miss', `${sim.slots[i].name}: near miss`)
        scoreHit(sim, i, 'near-miss')
      }
      return
    }
  }
}

export function torpedoStrike(sim, p, i, local) {
  const x = sim._X[i]
  const u = sim.slots[i]
  const pr = sim.projectiles
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (!targetable(sim, i)) return
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
      if (sim.slots[i].side === sim.slots[owner]?.side) continue
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
    // (the main battery's director, held by the AI while the player is at another station, corrects as an AI does)
    const dir = sim.player && sim.player.unitIndex === owner ? sim.player.director : null
    if (!dir?.salvos?.has(salvo)) return
  }
  // an AI salvo: corrected when its fall was seen (a lit target, daylight, or a radar that sees splashes)
  const x = owner >= 0 ? sim._X[owner] : null
  const ai = x?.ai || (sim.player && sim.player.unitIndex === owner ? sim.player.director : null)
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
  const u = sim.slots[i]
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
  let h = sc.hits.find((x) => x.unit === sim.slots[i].id && x.kind === kind)
  if (!h) sc.hits.push((h = { unit: sim.slots[i].id, name: sim.slots[i].name, kind, count: 0, where: [] }))
  h.count++
  if (where) h.where.push(where)
  const obj = sim._moment?.objective
  if (obj?.target && obj.target === sim.slots[i].id && kind !== 'near-miss') sc.objective = true
}

// --- 6. the AA hazard ------------------------------------------------------------------------------------

export function aaStep(sim, dt) {
  const s = sim.state
  const X = sim._X
  const pl = sim.player
  sim._aaOnPlayer = 0
  for (const i of sim._air || []) {
    const u = sim.slots[i]
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
      if (s.alive[j] !== 1 || sim.slots[j].side === u.side || sim.slots[j].kind !== 'ship') continue
      // (the player at the ship's AA director fires by the station's own resolution, ai.js aaDirector)
      if (pl && pl.engaged && !pl.allStations && pl.station === 'aa' && pl.unitIndex === j) continue
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
      for (const k of sim._air) if (sim.slots[k].side === u.side && Math.hypot(s.pos[3 * k] - s.pos[3 * j], s.pos[3 * k + 2] - s.pos[3 * j + 2]) < reach) share++
      share = Math.max(1, Math.min(share, 4))
      if (pl && pl.kind === 'ship' && pl.unitIndex === j && pl.aaTarget === i && sim.t < (pl.aaUntil ?? 0)) share = 1
      const era = eraFactor(sim.slots[j].side, sim.year, { peacetime: sim.year === 1941 && sim.slots[j].side === 'us' })
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
      if (pl && pl.unitIndex !== i && sim.slots[nearest.j].authority === 'player') sim._score.downed++
    } else if (r === 'hit') {
      b.damage = Math.min(0.95, b.damage + hitDamage(nearest.m, nearest.d, sim.rngs.aa))
      sim.fx(FX.smoke, b.x, b.y, b.z, { unit: i, size: 0.4 })
      if (pl?.unitIndex === i) sim.beat(i, 'damage', `${airName(sim, i)}: hit by AA`)
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
  const real = sim._engagedIndex() === ti
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
  const side = sim.slots[i].side
  const vx = s.pos[3 * i]
  const vy = s.pos[3 * i + 1]
  const vz = s.pos[3 * i + 2]
  let best = -1
  let bd = 3000
  for (const j of sim._air || []) {
    if (sim.slots[j].side === side || sim._X[j].model?.type !== 'fighter') continue
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
    const u = sim.slots[i]
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
    const u = sim.slots[i]
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
      sim.beat(pl.unitIndex, 'fuel', `${airName(sim, pl.unitIndex)}: out of fuel`)
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
  st.side = sim.slots[i].side
  st.station = pl.station
  st.stations = pl.stations
  st.engaged = pl.engaged
  st.allStations = pl.allStations
  st.assist = sim.assist
  st.assisting = pl.engaged ? pl.assisting ?? null : null
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
    // the release light: in a dive, the impact point inside a hull, above the safe pull-out height (R7 §4.3); in
    // Assisted (or at the bombardier's station) the cue's window: twice the record's, level releases too (ROUND-2 §1.2)
    st.safeAlt = safePullout(b)
    st.envelope = x.ammo.torpedoes > 0 ? torpedoEnvelope(x.model, b) : null
    st.cue = releaseCue(sim, pl, i, x, st.ccip)
    const pilotRelease = !!(st.ccip && st.ccip.onTarget && b.gamma < -30 * DEG && b.y > safePullout(b))
    st.release = sim.assist === 'assisted' || pl.station === 'bombardier' ? !!(st.cue && st.cue.kind !== 'torpedo' && st.cue.on) || pilotRelease : pilotRelease
    // the gunner's and the bombardier's sights
    st.gun = pl.station === 'gunner' ? gunnerSight(sim, pl, i, x) : null
    st.sight = pl.station === 'bombardier' && st.ccip ? { x: st.ccip.x, z: st.ccip.z, tof: st.ccip.tof, drift: [Math.sin(b.psi), -Math.cos(b.psi)], onTarget: !!st.cue?.on, target: st.cue?.target ?? -1, heading: pl.hold.heading } : null
    const home = sim.record.groupById.get(sim.slots[i].group || '')
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
    st.helmHeld = pl.station !== 'helm' && !pl.allStations ? (pl.steered ? { heading: pl.hold.heading, speed: pl.hold.speed } : 'record') : null
    st.mainTarget = pl.station !== 'main' && !pl.allStations ? pl.directorTarget ?? -1 : -1
    st.director = pl.station === 'aa' && !pl.allStations ? directorSight(sim, pl, i, x) : null
  }
  st.contacts = contacts(sim, i)
}

/** The AA director's sight: the aim, the aimed aircraft, its lead points (heavy and light), how well the aim lies on them. */
function directorSight(sim, pl, i, x) {
  const s = sim.state
  const m = x.model
  const eye = [s.pos[3 * i], (m.deck ?? 10) + 6, s.pos[3 * i + 2]]
  const dir = aimDirOf(pl.input, eye)
  const j = pl.aaAimed ?? aimedAircraft(sim, i, eye, dir, P.aaStation.aimedWithinDeg, aaReach(m))
  const out = { dir, eye, aimed: j >= 0 && s.alive[j] === 1 ? j : -1, firing: !!pl.aaFiring, cone: pl.aaCone ?? 0, reach: aaReach(m), lead: null, leadLight: null, range: null }
  if (out.aimed >= 0) {
    const ov = [s.vel[3 * i], 0, s.vel[3 * i + 2]]
    const heavy = m.aa.find((a) => a.heavy)
    const light = m.aa.find((a) => !a.heavy)
    if (heavy) out.lead = leadOn(sim, eye, ov, j, heavy.weapon?.mvMs ?? 790).point
    if (light) out.leadLight = leadOn(sim, eye, ov, j, light.weapon?.mvMs ?? 850).point
    out.range = Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2])
  }
  return out
}

/** The gunner's sight: the aim, whether the gun bears, the aimed aircraft and its lead point, the rounds left. */
function gunnerSight(sim, pl, i, x) {
  const s = sim.state
  const b = x.body
  const eye = [b.x, b.y + 1, b.z]
  const dir = aimDirOf(pl.input, eye)
  const guns = (x.ammo?.guns || []).filter((g) => !g.fixed)
  const j = pl.gunAimed ?? -1
  const out = { dir, eye, bears: pl.gunBears ?? true, aimed: j >= 0 && s.alive[j] === 1 ? j : -1, firing: !!pl.gunFiring, cone: pl.gunCone ?? 0, rounds: Math.round(guns.reduce((a, g) => a + g.left, 0)), lead: null, range: null }
  if (out.aimed >= 0 && guns.length) {
    out.lead = leadOn(sim, eye, [s.vel[3 * i], s.vel[3 * i + 1], s.vel[3 * i + 2]], j, guns[0].weapon.mvMs ?? 800).point
    out.range = Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2])
  }
  return out
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
    if (sim.slots[j].side === sim.slots[i].side) continue
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
  // (the ballistics module's bomb: a light quadratic drag to the sea's level)
  const fall = bombImpact(b.x, b.y, b.z, Math.sin(b.psi) * Math.cos(b.gamma) * b.V, Math.sin(b.gamma) * b.V, -Math.cos(b.psi) * Math.cos(b.gamma) * b.V)
  const px = fall.x
  const pz = fall.z
  const t = fall.tof
  const vx = fall.vx
  const vz = fall.vz
  let onTarget = false
  let target = -1
  let near = -1
  let nearD = Infinity
  for (const j of sim._shipsNear(px, pz, 1500)) {
    if (sim.slots[j].side === sim.slots[i].side || !targetable(sim, j)) continue
    const m = sim._X[j].model
    // the target moves on through the fall
    const d = boxDistance(px, pz, s.pos[3 * j] + s.vel[3 * j] * t, s.pos[3 * j + 2] + s.vel[3 * j + 2] * t, s.heading[j], m.B / 2, m.L / 2)
    if (d.d < nearD) {
      nearD = d.d
      near = j
    }
    if (d.d <= 0 && !onTarget) {
      onTarget = true
      target = j
    }
  }
  return { x: px, y: 0, z: pz, tof: t, onTarget, target, near, vx, vz }
}

function shipTarget(sim, i, x, aimAz) {
  const s = sim.state
  let best = null
  for (const r of sim.record.ships) {
    const j = r.slot
    if (!targetable(sim, j) || sim.slots[j].side === sim.slots[i].side || sim.slots[j].kind !== 'ship') continue
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
    if (j === i || s.alive[j] !== 1 || sim.slots[j].parked) continue
    const u = sim.slots[j]
    const dx = s.pos[3 * j] - obs.x
    const dz = s.pos[3 * j + 2] - obs.z
    const d = Math.hypot(dx, dz)
    if (d > 40000) continue
    const seen = sim.sight.sees(obs, { x: s.pos[3 * j], y: s.pos[3 * j + 1], z: s.pos[3 * j + 2], big: u.kind === 'ship' && (sim._X[j].model?.L ?? 0) > 150, aircraft: u.kind === 'aircraft', lit: sim._X[j].litUntil > sim.t })
    if (!seen) continue
    out.push({ index: j, kind: u.kind, friendly: u.side === sim.slots[i].side, range: d, bearing: headingOf(dx, dz), how: seen.how })
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
    if (sim.slots[j].side === sim.slots[i].side) continue
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
      if (s.alive[j] !== 1 || sim.slots[j].side === sim.slots[i].side) continue
      if (Math.hypot(s.pos[3 * j] - px, s.pos[3 * j + 2] - pz) < T.shipNearM) return why('enemy ship')
    }
  }
}

export { rho }
