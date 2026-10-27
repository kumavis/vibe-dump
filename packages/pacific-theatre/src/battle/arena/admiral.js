// The admiral (ROUND-3.md §1 "An opponent", §3): one per side, ticking every
// two seconds, a small state machine on the scenario's parameters
// (aggression, turn-away strength, launch interval, wave growth).
//
//   approach ──(within the range it keeps + 900 m)──▶ engage
//   approach | engage ──(strength under turnAwayAt)──▶ turn-away   (for good)
//
// Beside the movement, four standing orders it sets and clears on each tick:
// the destroyers go in (the enemy's main body within 4 km of its own, or
// losing after the fifth minute; again two minutes after they come back,
// while they have torpedoes); zigzag (the other side's strike aircraft within
// 3.5 km of the main body); smoke (its main body hit in the last 30 s while
// it is no stronger than the enemy); and the air: a combat air patrol kept
// up, a strike launched every launchEveryS while it has aircraft, each wave
// larger by waveGrowth than the first. It keeps formation (a guide, the core
// in rows behind it, the cruisers and destroyers on rings toward the
// threat), holds the range its aggression asks (closing, opening or
// broadside), and keeps the fleet inside the arena.

import { A } from './params.js'
import { ammoFor } from '../sim/ai.js'

export const isCarrier = (t) => t === 'cv' || t === 'cvl' || t === 'cve'
export const isCapital = (t) => t === 'bb' || t === 'ca' || t === 'cl'
export const isEscort = (t) => t === 'dd' || t === 'de'
export const isCore = (t) => isCarrier(t) || t === 'bb'
const DEG = Math.PI / 180
const wrap180 = (d) => ((((d + 180) % 360) + 360) % 360) - 180
export const bearingOf = (dx, dz) => (Math.atan2(dx, -dz) / DEG + 360) % 360

export function createAdmiral(ar, side) {
  const p = side.def.admiral || {}
  return {
    aggression: p.aggression ?? 0.5,
    turnAwayAt: p.turnAwayAt ?? 0.4,
    launchEveryS: p.launchEveryS ?? null,
    waveGrowth: p.waveGrowth ?? 0,
    state: 'approach',
    course: 0,
    speed: 0,
    threat: 0,
    range: Infinity,
    wave: 0,
    nextLaunch: A.firstStrikeS,
    ddAttack: false,
    ddAttackT: -1e9,
    ddDoneT: -1e9,
    zigzag: false,
    zigUntil: 0,
    smoke: false,
    smokeUntil: 0,
    turnedAt: null,
    log: [],
  }
}

/** The centroid of a side's core ships afloat (or of any ship afloat). */
export function bodyOf(ar, side) {
  const s = ar.state
  let n = 0
  let x = 0
  let z = 0
  for (const pass of [true, false]) {
    for (const i of side.ships) {
      if (s.alive[i] !== 1) continue
      if (pass && !isCore(ar._X[i].model.type)) continue
      x += s.pos[3 * i]
      z += s.pos[3 * i + 2]
      n++
    }
    if (n) break
  }
  return n ? { x: x / n, z: z / n } : null
}

/** The guide: the scenario's, or the first core ship afloat after it. */
export function ensureGuide(ar, side, { initial = false } = {}) {
  const s = ar.state
  const ok = (i) => initial || s.alive[i] === 1
  if (side.guide >= 0 && ok(side.guide)) return side.guide
  let g = -1
  for (const i of side.ships) if (ok(i) && isCore(ar._X[i].model.type)) {
    g = i
    break
  }
  if (g < 0) for (const i of side.ships) if (ok(i)) {
    g = i
    break
  }
  side.guide = g
  return g
}

/**
 * The formation (the scenario's guide and screen radius): each ship's offset
 * from the guide as [toward the threat, to its right], metres. The core in
 * rows behind the guide; the cruisers on an arc at 0.7 of the screen radius
 * across ±70° of the threat; the destroyers on the screen ring across ±115°.
 */
export function formation(ar, side) {
  const screen = side.def.screenM ?? 1200
  const core = []
  const cruisers = []
  const escorts = []
  for (const i of side.ships) {
    if (i === side.guide) continue
    const t = ar._X[i].model.type
    if (isCore(t)) core.push(i)
    else if (isCapital(t)) cruisers.push(i)
    else escorts.push(i)
  }
  const gType = side.guide >= 0 ? ar._X[side.guide].model.type : 'bb'
  const sp = isCarrier(gType) ? A.coreSpacingM.carrier : A.coreSpacingM.capital
  ar._X[side.guide].offset = [0, 0]
  // the core: the guide's row first (beside it), then rows behind
  const all = [side.guide, ...core]
  const per = all.length <= 4 ? 2 : 3
  all.forEach((i, k) => {
    const row = Math.floor(k / per)
    const col = k % per
    const n = Math.min(per, all.length - row * per)
    ar._X[i].offset = [-row * sp, (col - (n - 1) / 2) * sp]
  })
  // (the guide's own column puts it off centre: shift the whole core so the guide sits at 0, 0)
  const g0 = ar._X[side.guide].offset.slice()
  for (const i of all) ar._X[i].offset = [ar._X[i].offset[0] - g0[0], ar._X[i].offset[1] - g0[1]]
  const ring = (list, r, span) => list.forEach((i, k) => {
    const a = list.length === 1 ? 0 : (-span + (2 * span * k) / (list.length - 1)) * DEG
    ar._X[i].offset = [Math.cos(a) * r - (all.length > per ? sp * 0.5 : 0), Math.sin(a) * r]
  })
  ring(cruisers, screen * 0.7, 70)
  ring(escorts, screen, 115)
}

/** A station's world point: the guide's position plus an offset on the threat axis. */
export function stationPoint(ar, side, i, out = { x: 0, z: 0 }) {
  const s = ar.state
  const g = side.guide
  const o = ar._X[i].offset || [0, 0]
  const th = side.adm.threat * DEG
  const fx = Math.sin(th)
  const fz = -Math.cos(th)
  out.x = s.pos[3 * g] + fx * o[0] + Math.cos(th) * o[1]
  out.z = s.pos[3 * g + 2] + fz * o[0] + Math.sin(th) * o[1]
  return out
}

/** A course bent to keep a point inside the arena (tangent near the edge, inward beyond it). */
export function edgeBend(ar, x, z, course, margin = 2 * A.edgeM) {
  const r = Math.hypot(x - ar.centre.x, z - ar.centre.z)
  if (r < ar.R - margin) return course
  const out = bearingOf(x - ar.centre.x, z - ar.centre.z)
  const d = wrap180(course - out)
  if (Math.abs(d) >= 95) return course
  const lim = r > ar.R - margin / 2 ? 125 : 95
  return (out + (d >= 0 ? lim : -lim) + 360) % 360
}

/** The fleet's speed: nine tenths of its slowest core ship's top speed. */
function fleetSpeed(ar, side) {
  let v = Infinity
  for (const i of side.ships) if (ar.state.alive[i] === 1 && isCore(ar._X[i].model.type)) v = Math.min(v, ar._X[i].model.vmax)
  if (!Number.isFinite(v)) for (const i of side.ships) if (ar.state.alive[i] === 1) v = Math.min(v, ar._X[i].model.vmax)
  return Number.isFinite(v) ? v * 0.9 : 8
}

function note(ar, side, what) {
  side.adm.log.push({ t: +ar.t.toFixed(1), what })
}

export function admiralTick(ar, side) {
  const adm = side.adm
  const s = ar.state
  const g = ensureGuide(ar, side)
  if (g < 0) return
  if (!side._formed || side._formedGuide !== g) {
    formation(ar, side)
    side._formed = true
    side._formedGuide = g
  }
  const enemy = ar.sides[side.enemy]
  const eb = bodyOf(ar, enemy)
  const ob = bodyOf(ar, side) || { x: s.pos[3 * g], z: s.pos[3 * g + 2] }
  adm.speed = fleetSpeed(ar, side)
  if (!eb) {
    adm.course = edgeBend(ar, s.pos[3 * g], s.pos[3 * g + 2], adm.course)
    return
  }
  const gx = s.pos[3 * g]
  const gz = s.pos[3 * g + 2]
  adm.threat = bearingOf(eb.x - gx, eb.z - gz)
  adm.range = Math.hypot(eb.x - gx, eb.z - gz)
  // the turn-away, at the scenario's strength (contract: "turns away at half strength")
  if (adm.state !== 'turn-away' && side.strength.fraction < adm.turnAwayAt) {
    adm.state = 'turn-away'
    adm.turnedAt = ar.t
    adm.ddAttack = false
    for (const i of side.ships) if (ar._X[i].order?.kind === 'attack') ar._X[i].order = null
    note(ar, side, 'turn-away')
    ar._onTurnAway(side)
  }
  // a side whose goal is to keep its ships afloat keeps its distance (Taffy 3 ran under its smoke); the rest hold the range their aggression asks
  const want = side.def.goal?.kind === 'survive' ? Math.max(A.rangeFor(adm.aggression), A.surviveRangeM) : A.rangeFor(adm.aggression)
  // which way round: the side of the threat axis that points more toward the arena's centre
  const toCentre = bearingOf(ar.centre.x - gx, ar.centre.z - gz)
  const pick = (a, b) => (Math.abs(wrap180(a - toCentre)) <= Math.abs(wrap180(b - toCentre)) ? a : b)
  let course
  if (adm.state === 'turn-away') course = pick(adm.threat + 160, adm.threat - 160)
  else {
    if (adm.state === 'approach' && adm.range < want + 900) {
      adm.state = 'engage'
      note(ar, side, 'engage')
    }
    if (adm.range > want + 350) course = pick(adm.threat + 20, adm.threat - 20)
    else if (adm.range < want - 350) course = pick(adm.threat + 150, adm.threat - 150)
    else course = pick(adm.threat + 90, adm.threat - 90)
  }
  // (a course kept for a while unless the edge or the state asks otherwise: no dithering about the axis)
  if (adm._courseT == null || ar.t - adm._courseT > 14 || Math.abs(wrap180(course - adm.course)) > 100) {
    adm.course = (course + 360) % 360
    adm._courseT = ar.t
  }
  adm.course = edgeBend(ar, gx, gz, adm.course)
  destroyers(ar, side, enemy, ob, eb)
  zigzag(ar, side, enemy, ob)
  smoke(ar, side, enemy)
  airOps(ar, side, enemy)
}

// --- the destroyers' attack ------------------------------------------------------------------------------------

function destroyers(ar, side, enemy, ob, eb) {
  const adm = side.adm
  const s = ar.state
  const attackers = side.ships.filter((i) => s.alive[i] === 1 && isEscort(ar._X[i].model.type) && (ar._X[i].torp?.left ?? 0) > 0 && ar.player?.unitIndex !== i)
  if (adm.ddAttack) {
    // the attack ends when every destroyer has fired, or after two and a half minutes
    const going = attackers.filter((i) => ar._X[i].order?.kind === 'attack')
    if (!going.length || ar.t - adm.ddAttackT > 150) {
      adm.ddAttack = false
      adm.ddDoneT = ar.t
      for (const i of going) ar._X[i].order = null
      note(ar, side, 'destroyers back')
    }
    return
  }
  if (adm.state === 'turn-away' || !attackers.length || ar.t - adm.ddDoneT < 120) return
  const near = Math.hypot(ob.x - eb.x, ob.z - eb.z) < A.ddAttackM && adm.aggression >= 0.3
  const losing = ar.t > A.ddAttackAfterS && side.strength.fraction < enemy.strength.fraction
  if (!near && !losing) return
  const targets = targetsFor(ar, side, enemy)
  if (!targets.length) return
  adm.ddAttack = true
  adm.ddAttackT = ar.t
  attackers.forEach((i, k) => {
    ar._X[i].order = { kind: 'attack', target: targets[k % Math.min(targets.length, 3)], since: ar.t }
  })
  note(ar, side, near ? 'destroyers go in (range)' : 'destroyers go in (losing)')
  ar._onDestroyersGoIn(side)
}

/**
 * The enemy ships worth a strike or a torpedo attack, best first: the goal's
 * type for a side that must sink or hit (carriers first otherwise), the
 * damaged before the whole, the near before the far.
 */
export function targetsFor(ar, side, enemy) {
  const s = ar.state
  const goal = side.def.goal || {}
  const want = goal.kind === 'sink' || goal.kind === 'hit' ? goal.type : null
  const g = side.guide
  const rank = { cve: 1, cv: 1, cvl: 1, bb: 2, ca: 3, cl: 3, dd: 5, de: 5 }
  const list = []
  for (const i of enemy.ships) {
    if (s.alive[i] !== 1) continue
    const x = ar._X[i]
    const t = x.model.type
    let score = (rank[t] ?? 6) * 1000
    if (want && (t === want || want === 'ship')) score -= 2500
    if (!want) score = (t === 'bb' ? 1 : t === 'ca' || t === 'cl' ? 2 : isCarrier(t) ? 2.5 : 4) * 1000
    score -= (1 - x.hp / x.hpMax) * 800
    if (g >= 0) score += Math.hypot(s.pos[3 * i] - s.pos[3 * g], s.pos[3 * i + 2] - s.pos[3 * g + 2]) * 0.15
    list.push([score, i])
  }
  list.sort((a, b) => a[0] - b[0])
  return list.map((e) => e[1])
}

// --- zigzag and smoke ---------------------------------------------------------------------------------------------------

function zigzag(ar, side, enemy, ob) {
  const adm = side.adm
  const s = ar.state
  let threat = false
  for (const j of enemy.aircraft) {
    if (s.alive[j] !== 1) continue
    const x = ar._X[j]
    if (!x.ammo || (x.ammo.bombs <= 0 && x.ammo.torpedoes <= 0)) continue
    if (Math.hypot(s.pos[3 * j] - ob.x, s.pos[3 * j + 2] - ob.z) < 3500) {
      threat = true
      break
    }
  }
  if (threat) adm.zigUntil = ar.t + 20
  const on = ar.t < adm.zigUntil
  if (on !== adm.zigzag) note(ar, side, on ? 'zigzag' : 'zigzag off')
  adm.zigzag = on
}

function smoke(ar, side, enemy) {
  const adm = side.adm
  const s = ar.state
  // the weaker side makes smoke from the first (Taffy 3's escorts and carriers did); either side when its main body is hit and it is no stronger
  const weaker = side.strength.hp < enemy.strength.hp * 0.85
  const pressed = side.lastCoreHitT > ar.t - 30 && side.strength.hp <= enemy.strength.hp * 1.1
  if (pressed) adm.smokeUntil = Math.max(adm.smokeUntil, ar.t + 60)
  // (a side that must keep its ships afloat goes on making smoke when it turns away: it runs under it)
  const on = (adm.state !== 'turn-away' || side.def.goal?.kind === 'survive') && (weaker || pressed || ar.t < adm.smokeUntil)
  if (on !== adm.smoke) note(ar, side, on ? 'smoke' : 'smoke off')
  adm.smoke = on
  if (!on) {
    for (const i of side.ships) if (ar._X[i].order?.kind === 'smoke') ar._X[i].order = null
    return
  }
  const laying = side.ships.filter((i) => ar._X[i].order?.kind === 'smoke' && s.alive[i] === 1).length
  const free = side.ships.filter((i) => s.alive[i] === 1 && isEscort(ar._X[i].model.type) && !ar._X[i].order && ar.player?.unitIndex !== i)
  free.slice(0, Math.max(0, 3 - laying)).forEach((i, k) => (ar._X[i].order = { kind: 'smoke', side: (laying + k) % 2 ? 1 : -1, since: ar.t }))
}

// --- the air: the combat air patrol, the waves --------------------------------------------------------------------

/** A carrier can launch and recover while afloat and not burning (contract: carriers stop launching when burning). */
export const canLaunch = (ar, c) => ar.state.alive[c] === 1 && ar._X[c].hp / ar._X[c].hpMax >= A.fireAt

function ready(ar, j) {
  const x = ar._X[j]
  return x.onDeck && !x.queued && ar.t >= x.rearmAt && ar.state.alive[j] === 0 && x.hp > 0 && canLaunch(ar, x.home)
}

function queue(ar, j, mission) {
  const x = ar._X[j]
  x.queued = true
  x.next = mission
  ar._X[x.home].launchQ.push(j)
}

function airOps(ar, side, enemy) {
  const adm = side.adm
  if (!side.aircraft.length) return
  const s = ar.state
  const fighters = side.aircraft.filter((j) => ar._X[j].model.type === 'fighter')
  const capNeed = Math.min(4, Math.ceil(fighters.length * A.capShare))
  const capUp = fighters.filter((j) => (s.alive[j] === 1 && ar._X[j].mission?.kind === 'cap') || (ar._X[j].queued && ar._X[j].next?.kind === 'cap')).length
  let need = capNeed - capUp
  for (const j of fighters) {
    if (need <= 0) break
    if (!ready(ar, j)) continue
    queue(ar, j, { kind: 'cap', a: ar.rngs.ai.next() * Math.PI * 2 })
    need--
  }
  if (!adm.launchEveryS || adm.state === 'turn-away' || ar.t < adm.nextLaunch) return
  adm.nextLaunch = ar.t + adm.launchEveryS
  const strikers = side.aircraft.filter((j) => ar._X[j].model.type !== 'fighter' && ready(ar, j) && (ar._X[j].ammoFull.bombs > 0 || ar._X[j].ammoFull.torpedoes > 0))
  if (!strikers.length) return
  const all = side.aircraft.filter((j) => ar._X[j].model.type !== 'fighter').length
  const n = Math.max(1, Math.round(Math.max(A.waveBase, all * A.waveShare) * (1 + adm.waveGrowth * adm.wave)))
  const targets = targetsFor(ar, side, enemy)
  if (!targets.length) return
  const strike = { id: `${side.key}-wave-${adm.wave + 1}`, target: targets[adm.wave % Math.min(2, targets.length)], members: [], escorts: [], t: ar.t }
  for (const j of strikers.slice(0, n)) {
    strike.members.push(j)
    queue(ar, j, { kind: 'strike', strike, phase: 'approach' })
  }
  // with nothing in the air on the other side to escort against, the spare fighters go in with their bombs (the FM-2s at Samar)
  const noAir = !enemy.aircraft.some((j) => s.alive[j] === 1 || ar._X[j].onDeck)
  const spare = fighters.filter((j) => ready(ar, j)).slice(0, noAir ? Math.ceil(strike.members.length * 0.8) : Math.ceil(strike.members.length / 2))
  for (const j of spare) {
    const x = ar._X[j]
    if (noAir && (x.model.payload?.length ?? 0) > 0) {
      x.ammo = ammoFor(x.model, 'dive')
      strike.members.push(j)
      queue(ar, j, { kind: 'strike', strike, phase: 'approach' })
    } else {
      strike.escorts.push(j)
      queue(ar, j, { kind: 'escort', strike })
    }
  }
  adm.wave++
  note(ar, side, `${strike.id}: ${strike.members.length} + ${strike.escorts.length} at ${ar.slots[strike.target].id}`)
  ar._onWave(side, strike)
}
