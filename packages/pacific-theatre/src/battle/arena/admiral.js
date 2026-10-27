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
//
// content-3's scenarios say more, and it is read (research/content-3.md §2):
// the formation (`circle` or `columns`: every ship's place, kept on the threat
// axis as the start has it), the first wave's size (`waveSize`), the profiles
// (`cap` fighters on patrol, `escort` fighters with the waves, `strafe`
// aircraft in the waves with their guns; `dive`, `torpedo`, `level` strikers)
// and the most a side has in the air at once (`maxAirborne`). With nothing
// in the air on the other side, the patrol and the escorts strafe.

import { A } from './params.js'

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
    waveSize: p.waveSize || null,
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
  if (side.def.formation) scenarioFormation(ar, side)
}

/**
 * The scenario's own formation (content-3): each ship's place by the rule of
 * tools/check/wargames.mjs layout() (a circle's ring evenly round the guide at
 * half acrossM from the bow and its screen evenly at screenM from the bearing
 * of the other side; a column's first ship at atM [starboard, ahead] of the
 * guide and the rest astern at intervalM), turned into the frame stationPoint
 * reads, the threat axis as it is at the start, so the start is exactly the
 * layout and the formation then keeps its face to the threat. Relative to the
 * guide now: when the scenario's guide is lost the shape stays about the next.
 */
function scenarioFormation(ar, side) {
  const S = side.def
  const F = S.formation
  const v = (deg, m) => [Math.sin(deg * DEG) * m, Math.cos(deg * DEG) * m]
  const h = S.headingDeg ?? ((S.bearingDeg ?? 0) + 180) % 360
  const at = new Map()
  if (F.kind === 'circle') {
    at.set(S.guide, [0, 0])
    const ring = F.ring || []
    ring.forEach((id, i) => at.set(id, v(h + (360 * i) / ring.length, (F.acrossM || 0) / 2)))
    const screen = F.screen || []
    screen.forEach((id, i) => at.set(id, v(((S.bearingDeg ?? 0) + 180) % 360 + (360 * i) / screen.length, S.screenM ?? 1200)))
  } else if (F.kind === 'columns') {
    for (const c of F.columns || []) {
      ;(c.ships || []).forEach((id, i) => {
        const a = v(h + 90, c.atM?.[0] ?? 0)
        const b = v(h, (c.atM?.[1] ?? 0) - i * (F.intervalM || 0))
        at.set(id, [a[0] + b[0], a[1] + b[1]])
      })
    }
  } else return
  const th = ((S.bearingDeg ?? 0) + 180) * DEG
  const X = ar._X
  for (const i of side.ships) {
    const p = at.get(ar.slots[i].id)
    if (!p) continue
    // (east, north) → (x, z) = (east, −north) → [toward the threat, to its right]
    const ox = p[0]
    const oz = -p[1]
    X[i].offset0 = [ox * Math.sin(th) - oz * Math.cos(th), ox * Math.cos(th) + oz * Math.sin(th)]
  }
  const base = X[side.guide].offset0 || [0, 0]
  for (const i of side.ships) if (X[i].offset0) X[i].offset = [X[i].offset0[0] - base[0], X[i].offset0[1] - base[1]]
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
  const wantTypes = want ? (Array.isArray(goal.types) && goal.types.length ? goal.types : [want]) : null
  const g = side.guide
  const rank = { cve: 1, cv: 1, cvl: 1, bb: 2, ca: 3, cl: 3, dd: 5, de: 5 }
  // a side that must keep its ships afloat goes for the threats: the ships nearest its main body, the cruisers and
  // destroyers before the battleships (Taffy 3's aircraft went for the cruisers closing on the carriers)
  const survive = goal.kind === 'survive'
  const ob = survive ? bodyOf(ar, side) : null
  const list = []
  for (const i of enemy.ships) {
    if (s.alive[i] !== 1) continue
    const x = ar._X[i]
    const t = x.model.type
    let score = (rank[t] ?? 6) * 1000
    if (wantTypes && (wantTypes.includes(t) || wantTypes.includes('ship'))) score -= 2500
    if (!want) score = (t === 'bb' ? 1 : t === 'ca' || t === 'cl' ? 2 : isCarrier(t) ? 2.5 : 4) * 1000
    if (survive && ob) score = Math.hypot(s.pos[3 * i] - ob.x, s.pos[3 * i + 2] - ob.z) + (t === 'bb' ? 1500 : 0)
    score -= (1 - x.hp / x.hpMax) * 800
    if (g >= 0 && !survive) score += Math.hypot(s.pos[3 * i] - s.pos[3 * g], s.pos[3 * i + 2] - s.pos[3 * g + 2]) * 0.15
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
  // the weaker side makes smoke for the first minute and a half (Taffy 3's escorts did); either side, when its main
  // body is hit and it is no stronger, for a minute, and not again for a minute after (smoke comes and goes: a screen
  // that never lifts would leave the heavy guns nothing to fire at, research/engine-3.md §6)
  const weaker = side.strength.hp < enemy.strength.hp * 0.85
  if (weaker && ar.t < A.smokeFirstS) adm.smokeUntil = Math.max(adm.smokeUntil, A.smokeFirstS)
  const pressed = side.lastCoreHitT > ar.t - 30 && side.strength.hp <= enemy.strength.hp * 1.1
  if (pressed) {
    adm.pressedUntil = ar.t + 30 // (the carriers make their own smoke only while their main body is being hit)
    if (ar.t >= (adm.smokeAgainT ?? 0)) {
      adm.smokeUntil = Math.max(adm.smokeUntil, ar.t + A.smokeWindowS)
      adm.smokeAgainT = adm.smokeUntil + A.smokeWindowS
    }
  }
  // (a side that must keep its ships afloat goes on making smoke when it turns away: it runs under it)
  const on = (adm.state !== 'turn-away' || side.def.goal?.kind === 'survive') && ar.t < adm.smokeUntil
  if (on !== adm.smoke) note(ar, side, on ? 'smoke' : 'smoke off')
  adm.smoke = on
  if (!on) {
    for (const i of side.ships) if (ar._X[i].order?.kind === 'smoke') ar._X[i].order = null
    return
  }
  const laying = side.ships.filter((i) => ar._X[i].order?.kind === 'smoke' && s.alive[i] === 1).length
  const free = side.ships.filter((i) => s.alive[i] === 1 && isEscort(ar._X[i].model.type) && !ar._X[i].order && ar.player?.unitIndex !== i)
  free.slice(0, Math.max(0, A.smokeLayers - laying)).forEach((i, k) => (ar._X[i].order = { kind: 'smoke', side: (laying + k) % 2 ? 1 : -1, since: ar.t }))
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

const STRIKE_PROFILES = new Set(['dive', 'torpedo', 'level', 'strafe'])
const payloadOf = (x) => (x.ammoFull?.bombs ?? 0) > 0 || (x.ammoFull?.torpedoes ?? 0) > 0

function airOps(ar, side, enemy) {
  const adm = side.adm
  if (!side.aircraft.length) return
  const s = ar.state
  const X = ar._X
  const fighters = side.aircraft.filter((j) => X[j].model.type === 'fighter')
  // nothing of the other side's in the air or on a deck that can fly: no patrol to keep, no escort to give
  const noAir = !enemy.aircraft.some((j) => s.alive[j] === 1 || (X[j].onDeck && X[j].hp > 0 && s.alive[X[j].home] === 1))
  const max = side.maxAirborne ?? A.maxAirborne
  let up = ar.airborneOf(side.key, true)
  // the combat air patrol: the `cap` fighters when the scenario names them, else any; as many as it had up at the start
  const capPool = fighters.some((j) => X[j].profile === 'cap') ? fighters.filter((j) => X[j].profile === 'cap') : fighters
  const capNeed = noAir ? 0 : side.capNeed ?? Math.min(4, Math.ceil(fighters.length * A.capShare))
  const capUp = capPool.filter((j) => (s.alive[j] === 1 && X[j].mission?.kind === 'cap') || (X[j].queued && X[j].next?.kind === 'cap')).length
  let need = capNeed - capUp
  for (const j of capPool) {
    if (need <= 0 || up >= max) break
    if (!ready(ar, j)) continue
    queue(ar, j, { kind: 'cap', a: ar.rngs.ai.next() * Math.PI * 2 })
    need--
    up++
  }
  if (!adm.launchEveryS || adm.state === 'turn-away' || ar.t < adm.nextLaunch) return
  adm.nextLaunch = ar.t + adm.launchEveryS
  const targets = targetsFor(ar, side, enemy)
  if (!targets.length) return
  // the strikers: the strike profiles (the scenario's), or, when it names none, whatever carries a bomb or a torpedo
  const named = side.aircraft.some((j) => STRIKE_PROFILES.has(X[j].profile) && X[j].model.type !== 'fighter') || side.aircraft.some((j) => X[j].profile === 'strafe')
  const isStriker = (j) => (named ? STRIKE_PROFILES.has(X[j].profile) && (payloadOf(X[j]) || X[j].profile === 'strafe') : X[j].model.type !== 'fighter' && payloadOf(X[j]))
  // (with nothing to fight in the air, the patrol and the escorts strafe; those already up are taken into the wave in the air)
  // (the escorts: the `escort` fighters when the scenario names any, else the fighters on deck not needed on patrol)
  const escortNamed = fighters.some((j) => X[j].profile === 'escort')
  const spareFighter = (j) => X[j].model.type === 'fighter' && !isStriker(j) && (noAir || !escortNamed || X[j].profile === 'escort')
  const strikers = side.aircraft.filter((j) => ready(ar, j) && isStriker(j))
  strikers.sort((a, b) => (payloadOf(X[b]) ? 1 : 0) - (payloadOf(X[a]) ? 1 : 0))
  const all = side.aircraft.filter(isStriker).length
  const base = adm.waveSize ?? Math.max(A.waveBase, all * A.waveShare)
  const n = Math.max(1, Math.min(Math.round(base * (1 + adm.waveGrowth * adm.wave)), max - up))
  const strike = { id: `${side.key}-wave-${adm.wave + 1}`, target: targets[adm.wave % Math.min(2, targets.length)], members: [], escorts: [], t: ar.t }
  for (const j of strikers.slice(0, n)) {
    strike.members.push(j)
    queue(ar, j, { kind: 'strike', strike, phase: 'approach' })
    up++
  }
  if (noAir) {
    for (const j of fighters) {
      if (s.alive[j] !== 1 || X[j].mission?.kind !== 'cap' || !X[j].ammo?.guns.some((g) => g.fixed && g.left > 0)) continue
      strike.members.push(j)
      X[j].mission = { kind: 'strike', strike, phase: 'approach' }
      X[j].engage = -1
    }
  }
  const room = Math.max(0, max - up)
  const spare = fighters.filter((j) => ready(ar, j) && spareFighter(j)).slice(0, Math.min(room, noAir ? Math.ceil(strike.members.length * 0.8) + 1 : Math.ceil(strike.members.length / 2)))
  for (const j of spare) {
    if (noAir) {
      strike.members.push(j)
      queue(ar, j, { kind: 'strike', strike, phase: 'approach' })
    } else {
      strike.escorts.push(j)
      queue(ar, j, { kind: 'escort', strike })
    }
  }
  if (!strike.members.length) {
    for (const j of strike.escorts) {
      X[j].queued = false
      X[j].next = null
      const q = X[X[j].home].launchQ
      const k = q.indexOf(j)
      if (k >= 0) q.splice(k, 1)
    }
    return
  }
  adm.wave++
  note(ar, side, `${strike.id}: ${strike.members.length} + ${strike.escorts.length} at ${ar.slots[strike.target].id}`)
  ar._onWave(side, strike)
}
