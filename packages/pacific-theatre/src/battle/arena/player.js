// The player in the arena (ROUND-3.md §1 "Possess anything, instantly", §3
// "The player"): possession of any friendly unit at a station (round two's
// stations), the hops (Tab: the next friendly unit of the same kind; 1–4:
// the nearest friendly carrier, battleship or cruiser, destroyer, aircraft;
// a slot), the respawn two seconds after a loss with its one line, the
// player's own tally and sortie, and player.state, the mirror the box's HUD
// reads (the record's fields, so the HUD draws the arena unchanged, plus the
// arena's reticles: the main battery's lead, the torpedoes' spread, the
// bomb's impact).
//
// At the helm a ship's captain also fires: a click lays a salvo of the main
// battery on the pointer and T sends the torpedoes along its bearing (the
// record's helm does neither); the main battery, the AA and the torpedoes
// stations are round two's. The stations the player is not at are the AI's.

import { A } from './params.js'
import { shipStations, aircraftStations } from '../sim/takeover.js'
import { telegraphFor } from '../sim/ship.js'
import { atRange } from '../sim/ballistics.js'
import { KIT_SHORT } from '../sim/ai.js'
import { KN } from '../sim/units.js'
import { DEG } from './physics.js'
import { fireMounts, bears, fireShipTorpedoes, torpedoSpeed, torpedoIntercept, dropBomb, dropTorpedo, firePlayerGuns, bombPoint, directorStep, rearGun, leadPoint } from './weapons.js'
import { isCarrier, isCapital, isEscort } from './admiral.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180
export const REASON = { enemy: 'the other side', sunk: 'no longer afloat', sinking: 'going down', lost: 'did not return', carrierLost: 'lost with its carrier', carrierBurning: 'its carrier is burning', none: 'no such unit' }
export const HOP_KINDS = ['carrier', 'capital', 'destroyer', 'aircraft', 'next']

const short = (kit) => KIT_SHORT[kit] ?? kit

/** Whether slot j can be taken now: true, or the reason in the unit list's words. */
export function takeableOf(ar, j) {
  const u = ar.slots[j]
  if (!u) return REASON.none
  if (u.side !== ar.side) return REASON.enemy
  const a = ar.state.alive[j]
  const x = ar._X[j]
  if (u.kind === 'ship') return a === 1 ? true : a === 2 ? REASON.sinking : REASON.sunk
  if (a === 1) return true
  if (a === 2 || x.hp <= 0) return REASON.lost
  if (x.onDeck) {
    if (ar.state.alive[x.home] !== 1) return REASON.carrierLost
    if (ar._X[x.home].hp / ar._X[x.home].hpMax < A.fireAt) return REASON.carrierBurning
    return true
  }
  return REASON.lost
}

/** The stations of slot j (round two's rule from the kit). */
export function stationsOf(ar, j) {
  const u = ar.slots[j]
  const x = ar._X[j]
  if (!u) return []
  if (u.kind === 'ship') return shipStations(x.model)
  return aircraftStations(x.model, { attack: { profile: x.profile } })
}

/** A role ({ unit: id | slot, station } | { index, station } | { group, station }) to its slot; throws the reason. */
export function resolveRole(ar, role) {
  let j = -1
  if (Number.isInteger(role?.index)) j = role.index
  else if (Number.isInteger(role?.unit)) j = role.unit
  else if (typeof role?.unit === 'string') j = ar.slots.findIndex((u) => u.id === role.unit)
  else if (typeof role?.group === 'string') {
    const members = ar.slots.filter((u) => u.group === role.group).map((u) => u.index)
    j = members.find((k) => ar.state.alive[k] === 1) ?? members.find((k) => takeableOf(ar, k) === true) ?? members[0] ?? -1
  }
  if (j < 0 || j >= ar.capacity) {
    const e = new Error(`takeControl: no unit “${role?.unit ?? role?.group ?? role?.index}”`)
    e.reason = REASON.none
    throw e
  }
  const t = takeableOf(ar, j)
  if (t !== true) {
    const e = new Error(t)
    e.reason = t
    throw e
  }
  return j
}

function defaultInput(ar, j) {
  const s = ar.state
  const x = ar._X[j]
  const base = { pitch: 0, roll: 0, yaw: 0, throttle: 0.85, helm: 0, telegraph: 0, aimAz: s.heading[j], aimEl: 10, aimRange: null, aa: false, aaDir: null, aaTarget: -1, fireHeld: false, fireCount: 0, bombCount: 0, torpedoCount: 0, salvoCount: 0, starshellCount: 0, look: [0, 0], view: null, aimDir: null, mode: 'aim', brakes: null, spread: 'narrow', battery: 0 }
  if (ar.slots[j].kind === 'ship') {
    base.telegraph = telegraphFor(x.spec, Math.max(s.speed[j], x.want?.speed ?? 0))
    // the guns laid on the AI's target to begin with
    const t = x.target >= 0 && s.alive[x.target] === 1 ? x.target : -1
    if (t >= 0) {
      base.aimAz = (Math.atan2(s.pos[3 * t] - s.pos[3 * j], -(s.pos[3 * t + 2] - s.pos[3 * j + 2])) / DEG + 360) % 360
      base.aimRange = Math.hypot(s.pos[3 * t] - s.pos[3 * j], s.pos[3 * t + 2] - s.pos[3 * j + 2])
    } else base.aimAz = (s.heading[j] + 90) % 360
  } else base.throttle = x.body?.throttle ?? 0.85
  return base
}

/** Possess slot j at a station: a cut, no fly-in. An aircraft on deck is launched at once. */
export function possess(ar, j, station = null, how = 'take') {
  const u = ar.slots[j]
  const x = ar._X[j]
  if (u.kind === 'aircraft' && ar.state.alive[j] !== 1) ar._launchNow(j)
  const stations = stationsOf(ar, j)
  const st = station && stations.includes(station) ? station : stations[0]
  if (station && !stations.includes(station)) {
    const e = new Error(`takeControl: no station “${station}” on this unit (it offers ${stations.join(', ')})`)
    e.reason = e.message
    throw e
  }
  const prev = ar.player
  if (prev) closeSortie(ar, prev, how === 'respawn' ? 'lost' : null)
  const pl = {
    kind: u.kind,
    unitIndex: j,
    station: st,
    stations,
    input: defaultInput(ar, j),
    state: {},
    scripted: prev?.scripted ?? false,
    engaged: true,
    allStations: false,
    role: { unit: u.id, index: j, station: st, kind: u.kind, name: u.kind === 'aircraft' ? u.label : u.name },
    tTake: ar.t,
    lost: false,
    lostAt: null,
    _seen: { fireCount: 0, bombCount: 0, torpedoCount: 0, salvoCount: 0 },
  }
  ar.player = pl
  ar._sortie = { held: true, t0: ar.t, t1: ar.t, unit: rowUnit(ar, j), station: st, stations: [st], hits: [], downed: 0, releases: { bombs: 0, torpedoes: 0, salvos: 0 }, survived: null, how: null }
  x.mission ||= null
  ar.slots[j].authority = 'player'
  ar._event({ kind: 'hop', how, index: j, from: prev?.unitIndex ?? -1, station: st })
  playerState(ar)
  return pl
}

const rowUnit = (ar, j) => {
  const u = ar.slots[j]
  return { index: j, id: u.id, name: u.name, ja: u.ja, label: u.label, kind: u.kind, side: u.side, kit: u.kit, group: u.group, groupName: u.groupName }
}

export function takeControl(ar, role = {}) {
  const j = resolveRole(ar, role)
  return possess(ar, j, role.station ?? null, 'take')
}

export function setStation(ar, name) {
  const pl = ar.player
  if (!pl) throw new Error('setStation: nobody holds a unit')
  if (!pl.stations.includes(name)) throw new Error(`setStation: no station “${name}” on this unit (it offers ${pl.stations.join(', ')})`)
  pl.station = name
  pl.role.station = name
  if (ar._sortie && !ar._sortie.stations.includes(name)) ar._sortie.stations.push(name)
  if (ar._sortie) ar._sortie.station = name
  const x = ar._X[pl.unitIndex]
  // a gun's first aim: the nearest aircraft of the other side
  if (name === 'aa' || name === 'gunner') {
    const s = ar.state
    const i = pl.unitIndex
    let best = -1
    let bd = 4000
    for (const j of ar._air) {
      if (s.alive[j] !== 1 || ar.slots[j].side === ar.slots[i].side) continue
      const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 1] - s.pos[3 * i + 1], s.pos[3 * j + 2] - s.pos[3 * i + 2])
      if (d < bd) {
        bd = d
        best = j
      }
    }
    if (best >= 0) {
      pl.input.aimAz = (Math.atan2(s.pos[3 * best] - s.pos[3 * i], -(s.pos[3 * best + 2] - s.pos[3 * i + 2])) / DEG + 360) % 360
      pl.input.aimEl = Math.atan2(s.pos[3 * best + 1] - s.pos[3 * i + 1], bd) / DEG
    } else {
      pl.input.aimAz = (s.heading[i] + (name === 'gunner' ? 180 : 90)) % 360
      pl.input.aimEl = 15
    }
  }
  void x
  return pl
}

function closeSortie(ar, pl, how) {
  const so = ar._sortie
  if (!so) return
  so.held = false
  so.t1 = ar.t
  so.span = [so.t0, so.t1]
  so.durationS = so.t1 - so.t0
  so.survived = how === 'lost' ? false : ar.state.alive[pl.unitIndex] === 1
  so.how = how ?? (so.survived ? null : 'lost')
  ar._lastSortie = so
  ar._sortie = null
  const u = ar.slots[pl.unitIndex]
  if (u.authority === 'player') u.authority = 'ai'
}

/** Give the unit back to the AI (an aircraft goes on with a mission of its side's); returns the sortie. */
export function releaseControl(ar) {
  const pl = ar.player
  if (!pl) return null
  const j = pl.unitIndex
  const x = ar._X[j]
  if (pl.kind === 'aircraft' && ar.state.alive[j] === 1 && (!x.mission || x.mission.kind === 'player')) ar._defaultMission(j)
  closeSortie(ar, pl, null)
  ar.player = null
  return ar._lastSortie
}

// --- hops ---------------------------------------------------------------------------------------------------

const KIND_OK = {
  carrier: (ar, j) => ar.slots[j].kind === 'ship' && isCarrier(ar._X[j].model.type),
  capital: (ar, j) => ar.slots[j].kind === 'ship' && isCapital(ar._X[j].model.type),
  destroyer: (ar, j) => ar.slots[j].kind === 'ship' && isEscort(ar._X[j].model.type),
  aircraft: (ar, j) => ar.slots[j].kind === 'aircraft',
}

/** The slot a hop lands on, or −1: the nearest friendly unit of the kind, alive (an aircraft on deck when none flies). */
export function hopTarget(ar, kind) {
  const s = ar.state
  const pl = ar.player
  const from = pl ? pl.unitIndex : ar.sides[ar.side].guide
  const fx = from >= 0 ? s.pos[3 * from] : ar.centre.x
  const fz = from >= 0 ? s.pos[3 * from + 2] : ar.centre.z
  if (Number.isInteger(kind)) return takeableOf(ar, kind) === true ? kind : -1
  if (kind === 'next' || kind === 'prev') {
    if (!pl) return hopTarget(ar, 'capital') >= 0 ? hopTarget(ar, 'capital') : hopTarget(ar, 'aircraft')
    const same = ar.slots.filter((u) => u.side === ar.side && u.kind === pl.kind && s.alive[u.index] === 1).map((u) => u.index)
    if (same.length < 2) return -1
    const k = same.indexOf(pl.unitIndex)
    return same[(k + (kind === 'prev' ? -1 : 1) + same.length) % same.length]
  }
  const ok = KIND_OK[kind]
  if (!ok) return -1
  let best = -1
  let bd = Infinity
  for (const u of ar.slots) {
    const j = u.index
    if (u.side !== ar.side || j === pl?.unitIndex || !ok(ar, j) || s.alive[j] !== 1) continue
    const d = Math.hypot(s.pos[3 * j] - fx, s.pos[3 * j + 2] - fz)
    if (d < bd) {
      bd = d
      best = j
    }
  }
  if (best < 0 && kind === 'aircraft') {
    // none in the air: one ready on the nearest deck that can launch
    for (const u of ar.slots) if (u.side === ar.side && u.kind === 'aircraft' && takeableOf(ar, u.index) === true) {
      const c = ar._X[u.index].home
      const d = Math.hypot(s.pos[3 * c] - fx, s.pos[3 * c + 2] - fz)
      if (d < bd) {
        bd = d
        best = u.index
      }
    }
  }
  return best
}

/** Hop to a kind ('carrier' | 'capital' | 'destroyer' | 'aircraft' | 'next' | 'prev') or a slot: the player, or null when nothing matches. */
export function hop(ar, kind) {
  const j = hopTarget(ar, kind)
  if (j < 0) return null
  return possess(ar, j, null, 'hop')
}

// --- each step ----------------------------------------------------------------------------------------------

/** The held unit's command from the player's input at the stations held, and the player's weapons. */
export function playerStep(ar, dt) {
  const pl = ar.player
  if (!pl || pl.lost) return
  const i = pl.unitIndex
  const s = ar.state
  if (s.alive[i] !== 1) return
  const x = ar._X[i]
  const inp = pl.input
  const seen = pl._seen
  if (pl.kind === 'ship') {
    if (pl.station === 'helm') x.playerHelm = { helm: clamp(inp.helm ?? 0, -1, 1), telegraph: clamp(inp.telegraph ?? 0, -1, 1) }
    else x.playerHelm = null
    if (pl.station === 'aa') directorStep(ar, pl, i, dt)
    else pl.director = null
    // the main battery at the pointer: a click a salvo, a held button as the turrets come ready (at the helm and the main battery)
    if (pl.station === 'helm' || pl.station === 'main') {
      const salvo = inp.salvoCount > seen.salvoCount
      seen.salvoCount = inp.salvoCount
      if ((salvo || inp.fireHeld) && inp.aimAz != null) {
        const R = inp.aimRange ?? 4000
        const a = inp.aimAz * DEG
        const px = s.pos[3 * i] + Math.sin(a) * R
        const pz = s.pos[3 * i + 2] - Math.cos(a) * R
        let fired = 0
        for (const bg of x.guns) {
          if (bg.battery.role !== 'main' && pl.station === 'main') continue
          if (pl.station === 'helm' && bg !== x.guns[0]) continue
          const ready = bg.mounts.filter((mt) => mt.readyAt <= ar.t && bears(ar, i, mt, px, pz))
          if (!ready.length) continue
          fired += fireMounts(ar, i, bg, ready, px, pz, { player: true }).fired
        }
        if (fired && ar._sortie) ar._sortie.releases.salvos++
      }
    } else seen.salvoCount = inp.salvoCount
    if (pl.station === 'torpedoes' || pl.station === 'helm') {
      if (inp.torpedoCount > seen.torpedoCount && x.torp) {
        const n = fireShipTorpedoes(ar, i, inp.aimAz ?? s.heading[i], x.torp.perSalvo, inp.spread === 'wide' ? 5 : A.torpedoSpreadDeg, { player: true })
        if (n && ar._sortie) ar._sortie.releases.torpedoes += n
      }
    }
    seen.torpedoCount = inp.torpedoCount
    return
  }
  // an aircraft
  if (pl.station === 'pilot') {
    const aim = inp.mode === 'aim' && Array.isArray(inp.aimDir) ? inp.aimDir : null
    x.playerCmd = { aim, roll: inp.roll ?? 0, pitch: inp.pitch ?? 0, throttle: clamp(inp.throttle ?? 0.85, 0, 1), maxDive: x.model.type === 'dive' ? 80 * DEG : null }
    // the arena's wall: beyond its edge the aim is turned back toward the centre
    const b = x.body
    const rc = Math.hypot(b.x - ar.centre.x, b.z - ar.centre.z)
    if (rc > ar.R + 600) {
      const k = clamp((rc - ar.R - 600) / 600, 0, 1)
      const cx = (ar.centre.x - b.x) / rc
      const cz = (ar.centre.z - b.z) / rc
      const base = x.playerCmd.aim || [Math.sin(b.psi), 0, -Math.cos(b.psi)]
      x.playerCmd.aim = [base[0] * (1 - k) + cx * k, base[1] * (1 - k), base[2] * (1 - k) + cz * k]
    }
    if (inp.fireHeld) firePlayerGuns(ar, i, dt)
    if (inp.bombCount > seen.bombCount) {
      if (dropBomb(ar, i, { player: true }) >= 0 && ar._sortie) ar._sortie.releases.bombs++
    }
    if (inp.torpedoCount > seen.torpedoCount) {
      if (dropTorpedo(ar, i, { player: true }) >= 0 && ar._sortie) ar._sortie.releases.torpedoes++
    }
  } else {
    x.playerCmd = null
    if (pl.station === 'gunner') rearGun(ar, i, dt, { player: pl })
    if (pl.station === 'bombardier') {
      // the pilot holds the run-in; A/D steer it; the stick goes on one press
      x.bombardierSteer = clamp(inp.roll ?? 0, -1, 1)
      if (inp.bombCount > seen.bombCount) {
        let n = 0
        while (x.ammo?.bombs > 0) if (dropBomb(ar, i, { player: true }) >= 0) n++
        if (ar._sortie) ar._sortie.releases.bombs += n
      }
    }
  }
  seen.bombCount = inp.bombCount
  seen.torpedoCount = inp.torpedoCount
}

/** After the step: the loss, the respawn two seconds later with its one line, and the HUD's mirror. */
export function playerAfter(ar) {
  const pl = ar.player
  if (!pl) return
  const i = pl.unitIndex
  const s = ar.state
  if (!pl.lost && s.alive[i] !== 1) {
    pl.lost = true
    pl.lostAt = ar.t
    ar._onPlayerLost(i)
  }
  if (pl.lost && ar.t - pl.lostAt >= A.respawnS && !ar.result) {
    const u = ar.slots[i]
    let j = -1
    if (u.kind === 'aircraft') {
      // the next one of the flight: its group in the air, then on deck; then any aircraft; then a ship
      const group = ar.slots.filter((v) => v.group === u.group && v.index !== i)
      const air = group.filter((v) => s.alive[v.index] === 1)
      j = nearestOf(ar, air.map((v) => v.index), i)
      if (j < 0) j = group.map((v) => v.index).find((k) => takeableOf(ar, k) === true) ?? -1
      if (j < 0) j = hopTarget(ar, 'aircraft')
      if (j < 0) j = nearestShip(ar, i)
    } else j = nearestShip(ar, i)
    if (j < 0) {
      closeSortie(ar, pl, 'lost')
      ar.player = null
      ar._onRespawn(i, -1, null)
      return
    }
    const line = u.kind === 'aircraft' ? `Your ${short(u.kit)} did not return. The next one is yours.` : `${u.name} is going down. ${ar.slots[j].kind === 'ship' ? ar.slots[j].name : `${articled(short(ar.slots[j].kit))} of ${ar.slots[j].carrierName}`} is yours.`
    possess(ar, j, null, 'respawn')
    ar._onRespawn(i, j, line)
    return
  }
  playerState(ar)
}

const articled = (w) => `${/^[AEIOU]/.test(w) ? 'an' : 'a'} ${w}`

function nearestOf(ar, list, from) {
  const s = ar.state
  let best = -1
  let bd = Infinity
  for (const j of list) {
    const d = Math.hypot(s.pos[3 * j] - s.pos[3 * from], s.pos[3 * j + 2] - s.pos[3 * from + 2])
    if (d < bd) {
      bd = d
      best = j
    }
  }
  return best
}

function nearestShip(ar, from) {
  return nearestOf(ar, ar.sides[ar.side].ships.filter((j) => ar.state.alive[j] === 1), from)
}

// --- the HUD's mirror ------------------------------------------------------------------------------------------

/** player.state: the record HUD's fields for the held unit, and the arena's reticles. */
export function playerState(ar) {
  const pl = ar.player
  if (!pl) return null
  const i = pl.unitIndex
  const s = ar.state
  const x = ar._X[i]
  const u = ar.slots[i]
  const st = pl.state
  st.station = pl.station
  st.stations = pl.stations
  st.engaged = true
  st.allStations = false
  st.assist = 'assisted'
  st.assisting = []
  st.units = u.side === 'us' ? 'imperial' : 'metric'
  st.heading = s.heading[i]
  st.lost = pl.lost
  st.plotSpan = 8000
  st.contacts = contacts(ar, i)
  st.arena = true
  if (pl.kind === 'aircraft') {
    const b = x.body
    st.ias = b.V
    st.alt = b.y
    st.speed = b.V
    st.pitch = b.gamma / DEG
    st.roll = b.phi / DEG
    st.throttle = b.throttle
    st.g = b.g
    st.stall = false
    st.shake = 0
    st.broken = false
    st.blackout = 0
    st.aa = (x.underAA ?? 0) > ar.t ? 1 : 0
    st.ammo = (x.ammo?.guns || []).map((g) => ({ calibreMm: g.weapon?.calibreMm ?? 12.7, left: g.left, position: g.fixed ? 'nose' : 'rear' }))
    st.bombs = x.ammo?.bombs ?? 0
    st.torpedoes = x.ammo?.torpedoes ?? 0
    st.endurance = x.model.enduranceS ?? 3600 // (the arena flies no fuel: the kit's endurance, so the HUD warns of nothing)
    st.damage = 1 - x.hp / x.hpMax
    const c = x.home
    st.home = c >= 0 && s.alive[c] === 1 ? { bearing: (Math.atan2(s.pos[3 * c] - b.x, -(s.pos[3 * c + 2] - b.z)) / DEG + 360) % 360, range: Math.hypot(s.pos[3 * c] - b.x, s.pos[3 * c + 2] - b.z) } : null
    st.target = airTarget(ar, i, b)
    st.ccip = null
    st.cue = null
    st.release = false
    st.envelope = null
    st.sight = null
    st.gun = pl.station === 'gunner' ? pl.gun ?? null : null
    if (st.bombs > 0) {
      const bp = bombPoint(ar, i)
      const t = shipAt(ar, i, bp.x, bp.z, bp.tof)
      st.ccip = { x: bp.x, z: bp.z, tof: bp.tof, onTarget: t >= 0, target: t }
      if (pl.station === 'bombardier') st.sight = { x: bp.x, z: bp.z, tof: bp.tof, drift: [Math.sin(b.psi), -Math.cos(b.psi)], onTarget: t >= 0, target: t, heading: st.heading }
      st.release = t >= 0
    }
    if (st.torpedoes > 0) st.cue = torpedoCue(ar, i, b)
    st.track = st.torpedoes > 0 ? { x: b.x, z: b.z, bearing: b.psi / DEG, length: A.torpedoRunM, speed: torpedoSpeed(x.model.torpedo) } : null
  } else {
    const b = x.body
    st.speed = s.speed[i]
    st.telegraph = pl.input.telegraph
    st.rudder = b.rudder
    st.fight = 1 - x.hp / x.hpMax
    st.float = 1 - x.hp / x.hpMax
    st.list = x.list || 0
    st.fires = [x.fire > 0 ? 1 : 0]
    st.systemsOut = []
    st.damage = 1 - x.hp / x.hpMax
    st.hp = x.hp
    st.hpMax = x.hpMax
    st.turrets = []
    for (const [k, bg] of x.guns.entries()) for (const mt of bg.mounts) st.turrets.push({ role: bg.battery.role ?? (k === 0 ? 'main' : 'secondary'), battery: k, bearing: mt.bearing, elevation: mt.elev ?? 0, ready: mt.readyAt <= ar.t })
    const main = x.guns[0]
    const R = pl.input.aimRange
    st.aimTof = main && R ? atRange(main.battery.table, R)?.tof ?? null : null
    st.torpedoesReady = x.torp && ar.t >= x.torp.readyAt ? x.torp.left : 0
    st.helmHeld = null
    st.mainTarget = -1
    st.director = pl.station === 'aa' ? pl.director ?? null : null
    st.lastSalvo = null
    st.target = shipTarget(ar, i, pl.input)
    st.spread = x.torp && (pl.station === 'torpedoes' || pl.station === 'helm') && x.torp.left > 0 ? { from: [s.pos[3 * i], s.pos[3 * i + 2]], bearing: pl.input.aimAz ?? s.heading[i], n: Math.min(x.torp.perSalvo, x.torp.left), deg: pl.input.spread === 'wide' ? 5 : A.torpedoSpreadDeg, length: A.torpedoRunM, ready: ar.t >= x.torp.readyAt, speed: torpedoSpeed(x.torp.weapon) } : null
  }
  return st
}

function contacts(ar, i) {
  const s = ar.state
  const out = []
  const side = ar.slots[i].side
  for (let j = 0; j < ar.capacity; j++) {
    if (j === i || s.alive[j] !== 1) continue
    const dx = s.pos[3 * j] - s.pos[3 * i]
    const dz = s.pos[3 * j + 2] - s.pos[3 * i + 2]
    out.push({ index: j, bearing: (Math.atan2(dx, -dz) / DEG + 360) % 360, range: Math.hypot(dx, dz), kind: ar.slots[j].kind, friendly: ar.slots[j].side === side, quality: 1 })
  }
  return out
}

/** The enemy ship whose (enlarged) hull a point falls in at tof seconds from now, or −1. */
function shipAt(ar, i, x, z, tof) {
  const s = ar.state
  const side = ar.slots[i].side
  for (const j of ar._ships) {
    if (s.alive[j] !== 1 || ar.slots[j].side === side) continue
    const m = ar._X[j].model
    const cx = s.pos[3 * j] + s.vel[3 * j] * tof
    const cz = s.pos[3 * j + 2] + s.vel[3 * j + 2] * tof
    const h = s.heading[j] * DEG
    const lx = (x - cx) * Math.cos(h) + (z - cz) * Math.sin(h)
    const lz = (x - cx) * Math.sin(h) - (z - cz) * Math.cos(h)
    if (Math.abs(lx) < m.half.x * A.hitBoxK && Math.abs(lz) < m.half.z * A.hitBoxK) return j
  }
  return -1
}

/** The aircraft ahead the guns would meet: { index, range, lead }. */
function airTarget(ar, i, b) {
  const s = ar.state
  const side = ar.slots[i].side
  const f = [Math.cos(b.gamma) * Math.sin(b.psi), Math.sin(b.gamma), -Math.cos(b.gamma) * Math.cos(b.psi)]
  let best = -1
  let bs = Infinity
  for (const j of ar._air) {
    if (s.alive[j] !== 1 || ar.slots[j].side === side) continue
    const dx = s.pos[3 * j] - b.x
    const dy = s.pos[3 * j + 1] - b.y
    const dz = s.pos[3 * j + 2] - b.z
    const d = Math.hypot(dx, dy, dz)
    if (d > 1800 || d < 1) continue
    const c = (dx * f[0] + dy * f[1] + dz * f[2]) / d
    if (c < 0.8) continue
    const sc = d * (2 - c)
    if (sc < bs) {
      bs = sc
      best = j
    }
  }
  if (best < 0) return null
  const R = Math.hypot(s.pos[3 * best] - b.x, s.pos[3 * best + 1] - b.y, s.pos[3 * best + 2] - b.z)
  const tof = R / (850 + b.V * 0.3)
  const lead = [s.pos[3 * best] + (s.vel[3 * best] - b.vx) * tof + b.vx * tof, s.pos[3 * best + 1] + (s.vel[3 * best + 1] - b.vy) * tof + b.vy * tof + 4.9 * tof * tof, s.pos[3 * best + 2] + (s.vel[3 * best + 2] - b.vz) * tof + b.vz * tof]
  return { index: best, range: R, lead, tof }
}

/** The torpedo plane's cue (round two's shape): the nearest enemy ship ahead within 3 km, its range against the wide window. */
function torpedoCue(ar, i, b) {
  const s = ar.state
  const side = ar.slots[i].side
  const v = torpedoSpeed(ar._X[i].model.torpedo)
  let best = null
  for (const j of ar._ships) {
    if (s.alive[j] !== 1 || ar.slots[j].side === side) continue
    const ic = torpedoIntercept(ar, b.x, b.z, j, v)
    if (!ic) continue
    const R = Math.hypot(s.pos[3 * j] - b.x, s.pos[3 * j + 2] - b.z)
    if (R > 3000) continue
    const off = Math.abs(wrap180(ic.bearing - b.psi / DEG))
    if (off > 35) continue
    if (!best || R < best.value) best = { kind: 'torpedo', target: j, value: R, lo: 200, hi: 1800, off, bearing: ic.bearing }
  }
  if (!best) return null
  const low = b.y < 150
  best.envelope = { ok: low, why: low ? '' : 'too high for the drop' }
  best.on = low && best.value >= best.lo && best.value <= best.hi && best.off < 8
  return best
}

/** The main battery's target: the enemy ship nearest the aim point (or the AI's), its range, time of flight and lead. */
function shipTarget(ar, i, inp) {
  const s = ar.state
  const x = ar._X[i]
  const main = x.guns[0]
  if (!main) return null
  let best = -1
  if (inp.aimAz != null && inp.aimRange != null) {
    const a = inp.aimAz * DEG
    const px = s.pos[3 * i] + Math.sin(a) * inp.aimRange
    const pz = s.pos[3 * i + 2] - Math.cos(a) * inp.aimRange
    let bd = 900
    for (const j of ar._ships) {
      if (s.alive[j] !== 1 || ar.slots[j].side === ar.slots[i].side) continue
      const d = Math.hypot(s.pos[3 * j] - px, s.pos[3 * j + 2] - pz)
      if (d < bd) {
        bd = d
        best = j
      }
    }
  }
  if (best < 0 && x.target >= 0 && s.alive[x.target] === 1) best = x.target
  // (at the main battery the AI chooses no target: the nearest ship of the other side in sight, so the lead is drawn from the first second)
  if (best < 0) {
    let bd = Infinity
    for (const j of ar._ships) {
      if (s.alive[j] !== 1 || ar.slots[j].side === ar.slots[i].side || ar.hidden(i, j)) continue
      const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
      if (d < bd) {
        bd = d
        best = j
      }
    }
  }
  if (best < 0) return null
  const lp = leadPoint(ar, i, best, main)
  const R = Math.hypot(s.pos[3 * best] - s.pos[3 * i], s.pos[3 * best + 2] - s.pos[3 * i + 2])
  return { index: best, range: R, tof: lp?.tof ?? null, how: 'optics', lead: lp ? [lp.x, 0, lp.z] : null, speedKn: s.speed[best] / KN }
}
