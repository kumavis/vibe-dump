// The unit AI (ROUND-3.md §3 "the admiral … unit AI"): station keeping on the
// admiral's formation, gunnery (nearest in arc, damaged first), evasion
// under attack (zigzag, combing torpedo tracks), smoke, the destroyers'
// torpedo attack; for aircraft the combat air patrol (intercept within 3 km),
// a pursuit-and-lead dogfight with bursts and breaks, escorts, strikes on
// compressed profiles (approach at 1,500 m, push over at 1,200 m, the
// torpedo run from 800 m at 40 m), the way home and the deck.
//
// think(ar, i) decides (four times a second, staggered); control(ar, i, dt)
// turns the decision into the physics' command every step, so a dive and a
// burst are timed to the step.

import { A } from './params.js'
import { DEG } from './physics.js'
import { aiSalvo, bears, fireShipTorpedoes, torpedoSpeed, torpedoIntercept, dropBomb, dropTorpedo, bombPoint, aiBurst, rearGun, strafeBurst } from './weapons.js'
import { isCarrier, isEscort, isCapital, stationPoint, edgeBend, bearingOf, canLaunch, targetsFor } from './admiral.js'
import { steer } from './physics.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180
const pt = { x: 0, z: 0 }

// --- ships -------------------------------------------------------------------------------------------------------

export function shipThink(ar, i) {
  const x = ar._X[i]
  const side = ar.sides[ar.slots[i].side]
  const s = ar.state
  const pl = ar.player
  const held = pl && pl.unitIndex === i && !pl.lost
  if (!(held && pl.station === 'helm')) shipCourse(ar, i, x, side)
  if (!(held && pl.station === 'main')) gunnery(ar, i, x, side, held ? pl.station : null)
  if (!(held && (pl.station === 'torpedoes' || pl.station === 'helm'))) torpedoes(ar, i, x, side)
  if ((x.order?.kind === 'smoke' || (side.adm.smoke && isCarrier(x.model.type))) && ar.t >= (x.smokeT ?? 0)) layingSmoke(ar, i, x)
  else if (!side.adm.smoke && x.order?.kind !== 'smoke') x.smokeLast = null
  // (a burning ship's fire is cosmetic; a listing one is slower)
  x.cap = x.hp / x.hpMax < A.listAt ? A.listedSpeedCap : 1
  void s
}

/** The heading and speed the AI wants: the order, the station, the zigzag, the torpedo tracks, the edge and the land. */
function shipCourse(ar, i, x, side) {
  const s = ar.state
  const adm = side.adm
  const px = s.pos[3 * i]
  const pz = s.pos[3 * i + 2]
  const enemy = ar.sides[side.enemy]
  let heading = adm.course
  let speed = adm.speed
  const o = x.order
  if (o?.kind === 'attack' && s.alive[o.target] === 1) {
    // full speed at the target's lead, then the spread from the beam
    const tx = s.pos[3 * o.target]
    const tz = s.pos[3 * o.target + 2]
    const R = Math.hypot(tx - px, tz - pz)
    const v = torpedoSpeed(x.torp?.weapon)
    const ic = torpedoIntercept(ar, px, pz, o.target, v)
    speed = x.model.vmax
    if (R > A.ddFireM[1]) heading = bearingOf(tx + s.vel[3 * o.target] * 60 - px, tz + s.vel[3 * o.target + 2] * 60 - pz)
    else {
      // inside the band: turn to put the intercept on the beam and fire
      const ib = ic ? ic.bearing : bearingOf(tx - px, tz - pz)
      const rel = wrap180(ib - s.heading[i])
      heading = (ib - Math.sign(rel || 1) * 70 + 360) % 360
      if (ic && x.torp && x.torp.left > 0 && ar.t >= x.torp.readyAt && Math.abs(Math.abs(rel) - 90) < 50 && R <= A.ddFireM[1]) {
        fireShipTorpedoes(ar, i, ic.bearing, x.torp.perSalvo, A.torpedoSpreadDeg)
        ar._onTorpedoesFired(i, o.target)
        x.order = { kind: 'retire', since: ar.t }
      }
    }
    if (R < A.ddFireM[0] * 0.5 && x.order?.kind === 'attack') x.order = { kind: 'retire', since: ar.t }
  } else if (o?.kind === 'attack') x.order = { kind: 'retire', since: ar.t }
  if (x.order?.kind === 'retire' && ar.t - x.order.since > 40) x.order = null
  if (!x.order || x.order.kind === 'retire') {
    if (i !== side.guide && side.guide >= 0) {
      stationPoint(ar, side, i, pt)
      const dx = pt.x - px
      const dz = pt.z - pz
      const d = Math.hypot(dx, dz)
      if (d > 260 || x.order?.kind === 'retire') {
        heading = bearingOf(dx, dz)
        speed = clamp(adm.speed + d / 45, 0, x.model.vmax)
      } else {
        const gc = adm.course * DEG
        const along = dx * Math.sin(gc) - dz * Math.cos(gc)
        speed = clamp(adm.speed + along / 40, adm.speed * 0.4, x.model.vmax)
        heading = (adm.course + clamp(wrap180(bearingOf(dx, dz) - adm.course), -30, 30) * (d / 260) + 360) % 360
      }
    }
  } else if (x.order.kind === 'smoke') {
    // steam across the threat between the core and the enemy, a smoke screen behind
    const g = side.guide
    const th = adm.threat * DEG
    const cx = s.pos[3 * g] + Math.sin(th) * 700
    const cz = s.pos[3 * g + 2] - Math.cos(th) * 700
    const lateral = (adm.threat + 90 * x.order.side + 360) % 360
    const ex = cx + Math.sin(lateral * DEG) * 900
    const ez = cz - Math.cos(lateral * DEG) * 900
    const dEnd = Math.hypot(ex - px, ez - pz)
    if (dEnd < 250) x.order.side = -x.order.side
    heading = bearingOf(ex - px, ez - pz)
    speed = x.model.vmax
    if (ar.t - x.order.since > A.smokeS) x.order = null
  }
  // zigzag under air attack (the core weaves; the escorts keep station on it)
  if (adm.zigzag && !isEscort(x.model.type)) {
    if (ar.t >= (x.zigT ?? 0)) {
      x.zigT = ar.t + ar.rngs.ai.uniform(A.zigzagS[0], A.zigzagS[1])
      x.zig = (x.zig ?? 1) > 0 ? -A.zigzagDeg : A.zigzagDeg
    }
    heading += x.zig
  }
  // under fire: chase the salvos (weave, so the enemy's solution never settles)
  if (ar.t - (x.underFireT ?? -1e9) < 20 && x.order?.kind !== 'attack') {
    if (ar.t >= (x.chaseT ?? 0)) {
      x.chaseT = ar.t + ar.rngs.ai.uniform(A.chaseS[0], A.chaseS[1])
      x.chase = (x.chase ?? 1) > 0 ? -A.chaseDeg : A.chaseDeg
    }
    heading += x.chase
  }
  // a dive bomber on its dive at this ship: turn hard
  if (x.divedOnT > ar.t - 6) heading += x.divedSide * 60
  // torpedo tracks: comb the nearest one coming at the ship
  const comb = torpedoThreat(ar, i)
  if (comb != null) {
    heading = comb
    speed = x.model.vmax
  }
  // the edge, and the land
  heading = edgeBend(ar, px, pz, heading, A.edgeM)
  heading = avoidLand(ar, px, pz, heading, x.model.L)
  // under fire from a turned-away enemy: nothing more; a turned-away side runs at full speed
  if (adm.state === 'turn-away') speed = Math.max(speed, adm.speed)
  x.want = { heading: (heading + 720) % 360, speed }
  void enemy
}

/** The bearing that combs the nearest torpedo track coming at ship i, or null. */
function torpedoThreat(ar, i) {
  const s = ar.state
  const pr = ar.projectiles
  const px = s.pos[3 * i]
  const pz = s.pos[3 * i + 2]
  let best = null
  let bestT = Infinity
  const side = ar.slots[i].side
  for (const p of ar._torps) {
    if (!pr.alive[p]) continue
    const ow = pr.owner[p]
    if (ow >= 0 && ar.slots[ow].side === side) continue
    const tx = pr.pos[3 * p]
    const tz = pr.pos[3 * p + 2]
    const dx = px - tx
    const dz = pz - tz
    const d = Math.hypot(dx, dz)
    if (d > A.evadeTorpedoM) continue
    const vx = pr.vel[3 * p]
    const vz = pr.vel[3 * p + 2]
    const v = Math.hypot(vx, vz) || 1
    // closest approach of the track to the ship's present position
    const along = (dx * vx + dz * vz) / v
    if (along < 0) continue
    const miss = Math.abs(dx * vz - dz * vx) / v
    if (miss > ar._X[i].model.L * 0.9) continue
    const t = along / v
    if (t < bestT) {
      bestT = t
      // the parallel nearer the present heading
      const c = bearingOf(vx, vz)
      best = Math.abs(wrap180(c - s.heading[i])) < 90 ? c : (c + 180) % 360
    }
  }
  return best
}

/** Turn from land ahead (a ship's bow probes 600 m and 1,200 m out). */
function avoidLand(ar, x, z, heading, L) {
  const w = ar.world
  for (const d of [L + 400, L + 1100]) {
    const a = heading * DEG
    if (w.metresAt(x + Math.sin(a) * d, z - Math.cos(a) * d) > -4) {
      for (const k of [40, -40, 80, -80, 130, -130, 180]) {
        const b = (heading + k) * DEG
        if (w.metresAt(x + Math.sin(b) * d, z - Math.cos(b) * d) <= -4) return (heading + k + 360) % 360
      }
    }
  }
  return heading
}

/** The ship's target (contract: nearest in arc, damaged first; the goal's type before the rest) and its batteries' fire. */
function gunnery(ar, i, x, side, heldStation) {
  const s = ar.state
  const enemy = ar.sides[side.enemy]
  const turned = side.adm.state === 'turn-away'
  const maxR = turned ? A.turnedFireM : Infinity
  const keep = x.target >= 0 && s.alive[x.target] === 1 && ar.t - (x.targetT ?? 0) < 8 && !ar.hidden(i, x.target)
  if (!keep) {
    let best = -1
    let bestS = Infinity
    const main = x.guns[0]
    for (const j of enemy.ships) {
      if (s.alive[j] !== 1) continue
      const R = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
      if (R > maxR || (main && R > main.battery.table.maxRange * 0.97)) continue
      if (ar.hidden(i, j)) continue
      const xj = ar._X[j]
      const inArc = main ? main.mounts.some((mt) => bears(ar, i, mt, s.pos[3 * j], s.pos[3 * j + 2])) : true
      const sc = R * (1 - 0.45 * (1 - xj.hp / xj.hpMax)) * (inArc ? 1 : 1.6)
      if (sc < bestS) {
        bestS = sc
        best = j
      }
    }
    if (best !== x.target) x.targetT = ar.t
    x.target = best
  }
  if (x.target < 0) return
  // a secondary battery takes the nearest escort inside 4.5 km (the destroyers the record's secondaries fought), else the main target inside it
  let sec = -2
  for (const bg of x.guns) {
    if (heldStation === 'main' && bg.battery.role === 'main') continue
    let ti = x.target
    if (bg.battery.role === 'secondary') {
      if (sec === -2) sec = secondaryTarget(ar, i, enemy)
      ti = sec >= 0 ? sec : x.target
      if (Math.hypot(s.pos[3 * ti] - s.pos[3 * i], s.pos[3 * ti + 2] - s.pos[3 * i + 2]) > A.aiGun.secondaryM) continue
    }
    const R0 = Math.hypot(s.pos[3 * ti] - s.pos[3 * i], s.pos[3 * ti + 2] - s.pos[3 * i + 2])
    if (R0 > bg.battery.table.maxRange * 0.97) continue
    // (a light gun's fire at a ship beyond 3.5 km is not worth the rounds)
    if (bg.battery.weapon.calibreMm < 150 && R0 > A.aiGun.lightM) continue
    const readyM = bg.mounts.filter((mt) => mt.readyAt <= ar.t && bears(ar, i, mt, s.pos[3 * ti], s.pos[3 * ti + 2]))
    if (!readyM.length) continue
    // a main battery fires full salvos (every mount that bears ready); the rest as they come
    const bearing = bg.mounts.filter((mt) => bears(ar, i, mt, s.pos[3 * ti], s.pos[3 * ti + 2])).length
    if (bg.battery.role === 'main' && readyM.length < bearing) continue
    aiSalvo(ar, i, bg, readyM, ti)
  }
}

function secondaryTarget(ar, i, enemy) {
  const s = ar.state
  let best = -1
  let bd = A.aiGun.secondaryM
  for (const j of enemy.ships) {
    if (s.alive[j] !== 1 || !isEscort(ar._X[j].model.type) || ar.hidden(i, j)) continue
    const d = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
    if (d < bd) {
      bd = d
      best = j
    }
  }
  return best
}

/** A cruiser's or a destroyer's torpedoes, outside an attack: an enemy capital ship or carrier on the beam inside the band. */
function torpedoes(ar, i, x, side) {
  const tp = x.torp
  if (!tp || tp.left <= 0 || ar.t < tp.readyAt || x.order?.kind === 'attack') return
  if (side.adm.state === 'turn-away' && !isEscort(x.model.type)) return
  const s = ar.state
  const enemy = ar.sides[side.enemy]
  const v = torpedoSpeed(tp.weapon)
  for (const j of enemy.ships) {
    if (s.alive[j] !== 1) continue
    const t = ar._X[j].model.type
    if (!(isCarrier(t) || isCapital(t))) continue
    const R = Math.hypot(s.pos[3 * j] - s.pos[3 * i], s.pos[3 * j + 2] - s.pos[3 * i + 2])
    if (R < A.ddFireM[0] * 0.6 || R > A.ddFireM[1] * 0.85) continue
    const ic = torpedoIntercept(ar, s.pos[3 * i], s.pos[3 * i + 2], j, v)
    if (!ic) continue
    const rel = Math.abs(wrap180(ic.bearing - s.heading[i]))
    if (Math.abs(rel - 90) > 40) continue
    fireShipTorpedoes(ar, i, ic.bearing, Math.max(2, Math.ceil(tp.perSalvo / 2)), A.torpedoSpreadDeg)
    ar._onTorpedoesFired(i, j)
    return
  }
}

function layingSmoke(ar, i, x) {
  const s = ar.state
  const px = s.pos[3 * i]
  const pz = s.pos[3 * i + 2]
  if (x.smokeLast) ar.addSmoke(x.smokeLast[0], x.smokeLast[1], px, pz, i)
  x.smokeLast = [px, pz]
  x.smokeT = ar.t + 5
}

/** One step of a ship's helm toward what its AI wants. */
export function shipHelm(ar, i, x) {
  const w = x.want
  if (!w) return { helm: 0, telegraph: x.body.telegraph }
  return steer(x.body, x.spec, w.heading, w.speed)
}

// --- aircraft ----------------------------------------------------------------------------------------------------------

const fwdOf = (b) => [Math.cos(b.gamma) * Math.sin(b.psi), Math.sin(b.gamma), -Math.cos(b.gamma) * Math.cos(b.psi)]

/** The nearest enemy aircraft within r of a point (strikers first when `strikers`), or −1. */
function enemyAirNear(ar, side, x, y, z, r, strikers = false) {
  const s = ar.state
  let best = -1
  let bestD = r
  for (const j of ar.sides[side.enemy].aircraft) {
    if (s.alive[j] !== 1) continue
    let d = Math.hypot(s.pos[3 * j] - x, s.pos[3 * j + 1] - y, s.pos[3 * j + 2] - z)
    if (strikers && ar._X[j].model.type === 'fighter') d *= 1.6
    if (d < bestD) {
      bestD = d
      best = j
    }
  }
  return best
}

export function airThink(ar, i) {
  const x = ar._X[i]
  const s = ar.state
  const side = ar.sides[ar.slots[i].side]
  const b = x.body
  const m = x.mission || (x.mission = { kind: 'return' })
  const fighter = x.model.type === 'fighter'
  // a fighter's fight: keep the one it has, or take one the mission allows
  if (fighter) {
    if (x.engage >= 0 && (s.alive[x.engage] !== 1 || Math.hypot(s.pos[3 * x.engage] - b.x, s.pos[3 * x.engage + 2] - b.z) > 4000 || Math.hypot(s.pos[3 * x.engage] - ar.centre.x, s.pos[3 * x.engage + 2] - ar.centre.z) > ar.R + 2 * A.airEdgeM)) x.engage = -1
    if (x.engage < 0 && hasGuns(x)) {
      if (m.kind === 'cap') {
        const g = side.guide >= 0 ? side.guide : i
        const j = enemyAirNear(ar, side, s.pos[3 * g], 1500, s.pos[3 * g + 2], A.cap.interceptM, true)
        x.engage = j >= 0 ? j : enemyAirNear(ar, side, b.x, b.y, b.z, 2000, true)
      } else if (m.kind === 'escort') {
        const lead = strikeLead(ar, m.strike)
        const c = lead >= 0 ? lead : i
        x.engage = enemyAirNear(ar, side, s.pos[3 * c], s.pos[3 * c + 1], s.pos[3 * c + 2], A.escortEngageM)
      } else if (m.kind === 'return') x.engage = enemyAirNear(ar, side, b.x, b.y, b.z, 900)
    }
  }
  // defensive break: an enemy fighter close on the tail
  if (ar.t >= (x.defUntil ?? 0) && ar.rngs.ai.next() < 0.35) {
    const f = fwdOf(b)
    for (const j of ar.sides[side.enemy].aircraft) {
      if (s.alive[j] !== 1 || ar._X[j].model.type !== 'fighter') continue
      const dx = s.pos[3 * j] - b.x
      const dy = s.pos[3 * j + 1] - b.y
      const dz = s.pos[3 * j + 2] - b.z
      const d = Math.hypot(dx, dy, dz)
      if (d < 450 && (dx * f[0] + dy * f[1] + dz * f[2]) / d < -0.6) {
        x.defUntil = ar.t + 1.6
        x.defSide = ar.rngs.ai.next() < 0.5 ? -1 : 1
        break
      }
    }
  }
  // the mission's way on
  if (m.kind === 'strike') strikeThink(ar, i, x, m)
  else if (m.kind === 'escort') {
    const lead = strikeLead(ar, m.strike)
    if (lead < 0) x.mission = { kind: 'return' }
  } else if (m.kind === 'return') {
    const home = homeFor(ar, i, x)
    if (home < 0 && fighter) x.mission = { kind: 'cap', a: 0 }
  }
}

const hasGuns = (x) => !!x.ammo?.guns.some((g) => g.fixed && g.left > 0)

/** A strike's first member still on its way in, or −1. */
function strikeLead(ar, strike) {
  for (const j of strike.members) if (ar.state.alive[j] === 1 && ar._X[j].mission?.kind === 'strike' && ar._X[j].mission.phase !== 'egress') return j
  return -1
}

/** The carrier an aircraft goes back to: its own if it can take it, else the nearest that can, else −1. */
function homeFor(ar, i, x) {
  if (x.home >= 0 && canLaunch(ar, x.home)) return x.home
  const side = ar.sides[ar.slots[i].side]
  const s = ar.state
  let best = -1
  let bestD = Infinity
  for (const c of side.carriers) {
    if (!canLaunch(ar, c)) continue
    const d = Math.hypot(s.pos[3 * c] - x.body.x, s.pos[3 * c + 2] - x.body.z)
    if (d < bestD) {
      bestD = d
      best = c
    }
  }
  if (best >= 0) x.home = best
  return best
}

function strikeThink(ar, i, x, m) {
  const s = ar.state
  // a target gone: the strike takes the next its side would choose
  if (s.alive[m.strike.target] !== 1 && m.phase !== 'egress') {
    const side = ar.sides[ar.slots[i].side]
    const t = targetsFor(ar, side, ar.sides[side.enemy])
    if (t.length) m.strike.target = t[0]
    else x.mission = { kind: 'return' }
  }
  // (a strafer goes in with its guns until its run is made: content-3's `strafe`)
  if ((!x.ammo || (x.ammo.bombs <= 0 && x.ammo.torpedoes <= 0)) && !(hasGuns(x) && !m.strafed)) {
    if (m.phase !== 'egress') {
      m.phase = 'egress'
      m.until = ar.t + 6
    }
  }
}

/**
 * The step's command for an AI-flown aircraft: { aim, throttle, maxDive }, and
 * its weapons (a burst, a bomb, a torpedo) released here, on the step.
 */
export function airControl(ar, i, dt) {
  const x = ar._X[i]
  const s = ar.state
  const b = x.body
  const side = ar.sides[ar.slots[i].side]
  const m = x.mission || { kind: 'return' }
  let gx
  let gy
  let gz
  let throttle = 0.85
  let maxDive = null
  const fighter = x.model.type === 'fighter'
  // rear guns answer a fighter astern (the AI's gunner; the player's at the gunner's station)
  if (!fighter && !(ar.player?.unitIndex === i && ar.player.station === 'gunner')) rearGun(ar, i, dt)
  if (ar.t < (x.defUntil ?? 0)) {
    // the break: a hard turn to one side, nose a little down
    const a = b.psi + x.defSide * 1.4
    gx = b.x + Math.sin(a) * 800
    gz = b.z - Math.cos(a) * 800
    gy = b.y - 60
    throttle = 1
  } else if (fighter && x.engage >= 0) {
    // pursuit with lead; a burst when the lead sits in the cone; a break after it
    const j = x.engage
    const tx = s.pos[3 * j]
    const ty = s.pos[3 * j + 1]
    const tz = s.pos[3 * j + 2]
    const R = Math.hypot(tx - b.x, ty - b.y, tz - b.z)
    const tof = R / 880
    const lx = tx + s.vel[3 * j] * tof
    const ly = ty + s.vel[3 * j + 1] * tof
    const lz = tz + s.vel[3 * j + 2] * tof
    if (ar.t < (x.breakUntil ?? 0)) {
      // extend past and come round
      gx = b.x + b.vx * 4 + (b.x - tx) * 0.3
      gy = Math.max(b.y + 120, 400)
      gz = b.z + b.vz * 4 + (b.z - tz) * 0.3
    } else {
      gx = lx
      gy = ly
      gz = lz
      if (R < A.burst.rangeM) {
        const f = fwdOf(b)
        const L = Math.hypot(lx - b.x, ly - b.y, lz - b.z) || 1
        const ang = Math.acos(clamp(((lx - b.x) * f[0] + (ly - b.y) * f[1] + (lz - b.z) * f[2]) / L, -1, 1))
        if (ang < A.burst.coneDeg * DEG && hasGuns(x)) {
          aiBurst(ar, i, j, ang, R)
          x.breakUntil = ar.t + ar.rngs.ai.uniform(A.burst.breakS[0], A.burst.breakS[1])
        }
      }
      if (R < 120) x.breakUntil = ar.t + 1.2
    }
    throttle = R > 600 ? 1 : 0.8
  } else if (m.kind === 'cap') {
    const g = side.guide >= 0 ? side.guide : -1
    const cx = g >= 0 ? s.pos[3 * g] : ar.centre.x
    const cz = g >= 0 ? s.pos[3 * g + 2] : ar.centre.z
    m.a = (m.a ?? 0) + (b.V / A.cap.radiusM) * dt
    gx = cx + Math.sin(m.a + 0.5) * A.cap.radiusM
    gz = cz - Math.cos(m.a + 0.5) * A.cap.radiusM
    gy = A.cap.altM
    throttle = 0.7
  } else if (m.kind === 'escort') {
    const lead = strikeLead(ar, m.strike)
    if (lead >= 0) {
      const lb = ar._X[lead].body
      gx = lb.x - lb.vx * 2 + Math.cos(lb.psi) * 150 * (x.k % 2 ? 1 : -1)
      gy = lb.y + 250
      gz = lb.z - lb.vz * 2 + Math.sin(lb.psi) * 150 * (x.k % 2 ? 1 : -1)
      throttle = Math.hypot(gx - b.x, gz - b.z) > 400 ? 1 : 0.75
    } else {
      gx = b.x + b.vx
      gy = b.y
      gz = b.z + b.vz
    }
  } else if (m.kind === 'strike') {
    const r = strikeControl(ar, i, x, m, dt)
    gx = r.x
    gy = r.y
    gz = r.z
    throttle = r.throttle
    maxDive = r.maxDive
  } else {
    // home: the carrier, from astern, low, then onto the deck
    const c = homeFor(ar, i, x)
    if (c >= 0) {
      const cx = s.pos[3 * c]
      const cz = s.pos[3 * c + 2]
      const h = s.heading[c] * DEG
      const d = Math.hypot(cx - b.x, cz - b.z)
      const ax = cx - Math.sin(h) * 700
      const az = cz + Math.cos(h) * 700
      const da = Math.hypot(ax - b.x, az - b.z)
      if (d > 1400 || (da > 250 && !x.finals)) {
        gx = ax
        gz = az
        gy = d > 2500 ? 400 : 120
        throttle = 0.8
      } else {
        x.finals = true
        gx = cx + Math.sin(h) * 200
        gz = cz - Math.cos(h) * 200
        gy = (x.home >= 0 ? ar._X[c].model.deck : 15) + 8
        throttle = 0.15
      }
      if (d < 170 && b.y < ar._X[c].model.deck + 45) ar._land(i, c)
    } else {
      // nowhere to land: circle the guide
      const g = side.guide >= 0 ? side.guide : -1
      m.a = (m.a ?? 0) + (b.V / 1500) * dt
      gx = (g >= 0 ? s.pos[3 * g] : ar.centre.x) + Math.sin(m.a) * 1500
      gz = (g >= 0 ? s.pos[3 * g + 2] : ar.centre.z) - Math.cos(m.a) * 1500
      gy = 600
      throttle = 0.6
    }
  }
  // the arena's edge turns any aircraft back that is not on its run
  const rc = Math.hypot(b.x - ar.centre.x, b.z - ar.centre.z)
  const onRun = m.kind === 'strike' && (m.phase === 'dive' || m.phase === 'run')
  if (rc > ar.R + A.airEdgeM && !onRun) {
    gx = ar.centre.x
    gz = ar.centre.z
    gy = Math.max(gy, 300)
  }
  return { aim: [gx - b.x, gy - b.y, gz - b.z], throttle, maxDive }
}

/** The strike's phases, step by step: approach, the dive or the torpedo run, the release, the egress. */
function strikeControl(ar, i, x, m, dt) {
  const s = ar.state
  const b = x.body
  const ti = m.strike.target
  const tx = s.pos[3 * ti]
  const tz = s.pos[3 * ti + 2]
  const tvx = s.vel[3 * ti]
  const tvz = s.vel[3 * ti + 2]
  const R = Math.hypot(tx - b.x, tz - b.z)
  const torpedo = x.ammo?.torpedoes > 0
  const out = { x: tx, y: A.strike.approachAltM, z: tz, throttle: 0.95, maxDive: null }
  // (aircraft of a wave fan out a little so they do not fly as one)
  const fan = ((x.k % 5) - 2) * 120
  if (m.phase === 'egress') {
    // away from the target, bent back toward the middle near the arena's edge
    const nearEdge = Math.hypot(b.x - ar.centre.x, b.z - ar.centre.z) > ar.R - 600
    const away = (nearEdge ? bearingOf(ar.centre.x - b.x, ar.centre.z - b.z) : bearingOf(b.x - tx, b.z - tz)) * DEG
    out.x = b.x + Math.sin(away) * 1500
    out.z = b.z - Math.cos(away) * 1500
    out.y = 350
    out.throttle = 1
    if (ar.t > (m.until ?? 0)) x.mission = { kind: 'return' }
    return out
  }
  if (torpedo) {
    if (m.phase === 'approach' && R < 3200) m.phase = 'descend'
    if (m.phase === 'descend' && R < A.strike.torpedoRunM + 350) m.phase = 'run'
    if (m.phase === 'approach') {
      out.x = tx + tvx * 40 + Math.cos(x.k) * fan
      out.z = tz + tvz * 40 + Math.sin(x.k) * fan
      out.y = 300
    } else if (m.phase === 'descend') {
      // round to the target's beam, low
      const side = (x.k % 2 ? 1 : -1) * 70
      const brg = (s.heading[ti] + side + 360) % 360
      out.x = tx + tvx * 30 + Math.sin(brg * DEG) * (A.strike.torpedoRunM + 200)
      out.z = tz + tvz * 30 - Math.cos(brg * DEG) * (A.strike.torpedoRunM + 200)
      out.y = R < 2200 ? A.strike.torpedoAltM : 150
    } else {
      const ic = torpedoIntercept(ar, b.x, b.z, ti, torpedoSpeed(x.model.torpedo))
      const ib = ic ? ic.bearing : bearingOf(tx - b.x, tz - b.z)
      out.x = b.x + Math.sin(ib * DEG) * 1000
      out.z = b.z - Math.cos(ib * DEG) * 1000
      out.y = A.strike.torpedoAltM
      const off = Math.abs(wrap180(ib - b.psi / DEG))
      if ((R <= A.strike.torpedoRunM && off < 7 && b.y < 90) || R < 380) {
        dropTorpedo(ar, i)
        ar._onRelease(i, ti, 'torpedo')
        m.phase = 'egress'
        m.until = ar.t + 7
      }
    }
    return out
  }
  if (!(x.ammo?.bombs > 0)) {
    // a strafing run: in low, the nose on the target's deck, the guns from fireM in, a pull-out at breakM
    const S = A.strafe
    if (m.phase === 'approach' && R < S.openM) m.phase = 'run'
    if (m.phase === 'approach') {
      out.x = tx + tvx * 20 + Math.cos(x.k * 1.3) * fan
      out.z = tz + tvz * 20 + Math.sin(x.k * 1.3) * fan
      out.y = S.approachAltM
      return out
    }
    const tof = R / 850
    out.x = tx + tvx * tof
    out.z = tz + tvz * tof
    out.y = (ar._X[ti].model.deck ?? 10) + 4
    out.throttle = 1
    out.maxDive = 35 * DEG
    if (R < S.fireM && ar.t >= (x.strafeT ?? 0)) {
      const f = fwdOf(b)
      const dx = out.x - b.x
      const dy = out.y - b.y
      const dz = out.z - b.z
      const L = Math.hypot(dx, dy, dz) || 1
      if ((dx * f[0] + dy * f[1] + dz * f[2]) / L > Math.cos(12 * DEG)) {
        strafeBurst(ar, i, ti)
        x.strafeT = ar.t + S.everyS
      }
    }
    if (R < S.breakM || b.y < 45) {
      m.phase = 'egress'
      m.until = ar.t + 6
      m.strafed = true
    }
    return out
  }
  // the dive
  if (m.phase === 'approach' && R < A.strike.pushOverM && b.y > 500) m.phase = 'dive'
  if (m.phase === 'approach' && R < A.strike.pushOverM * 0.5) {
    // overshot below the push-over height: go round
    out.x = tx + (b.x - tx) * 3
    out.z = tz + (b.z - tz) * 3
    out.y = A.strike.approachAltM
    return out
  }
  if (m.phase === 'approach') {
    out.x = tx + tvx * 30 + Math.cos(x.k * 1.7) * fan
    out.z = tz + tvz * 30 + Math.sin(x.k * 1.7) * fan
    out.y = A.strike.approachAltM
    return out
  }
  // diving: the nose on where the bomb must fall (the target's lead over the bomb's fall)
  const fall = Math.sqrt((2 * Math.max(50, b.y)) / 9.81) * 0.8
  const eta = Math.hypot(tx - b.x, tz - b.z) / Math.max(40, b.V * Math.cos(b.gamma)) * 0.5
  out.x = tx + tvx * (fall + eta)
  out.z = tz + tvz * (fall + eta)
  out.y = 0
  out.throttle = 0.3
  out.maxDive = 80 * DEG
  if (!m.warned) {
    m.warned = true
    ar._X[ti].divedOnT = ar.t
    ar._X[ti].divedSide = ar.rngs.ai.next() < 0.5 ? -1 : 1
  }
  let release = b.y < A.strike.releaseAltM + 30
  if (!release && b.y < 900) {
    const bp = bombPoint(ar, i)
    const hx = (tx + tvx * bp.tof - bp.x) ** 2 + (tz + tvz * bp.tof - bp.z) ** 2
    if (hx < (ar._X[ti].model.B * 0.75) ** 2) release = true
  }
  if (release) {
    while (x.ammo.bombs > 0) dropBomb(ar, i)
    ar._onRelease(i, ti, 'bomb')
    m.phase = 'egress'
    m.until = ar.t + 6
  }
  return out
}

