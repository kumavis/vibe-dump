// The arena (ROUND-3.md §3): the wargame's sim, beside the record's and
// sharing its kits, its models where they fit (by import), its effects ring,
// its typed state arrays in the same layout (scene/units.js draws the arena
// unchanged) and round two's station surface, so the unit list, the card,
// the station bar and the touch controls work unchanged.
//
//   createArena(scenario, kits, box, { side, seed, warn }) → arena
//     scenario: public/data/wargames/<id>.json (§6); kits: { ships, aircraft,
//     weapons }; box: what data/load.js loadBox returns ({ battle, pack, box })
//     or { battle, ground, proj, exaggeration }; side: the player's, 'jp' | 'us'.
//
// One step (1/60 s, at most eight a call, the rest in lag): the admirals'
// ticks (every 2 s), the units' AI (four times a second, staggered), the
// player's input at the stations held, the launches, the physics, the
// projectiles and their hits, the AA, the fates (sinking, falling, landing),
// the state arrays written, the objectives, the player's loss and respawn.
// research/engine-3.md has every method, row and event as built.

import { TangentProjection, wrapLon } from '../../geo.js'
import { BattleClock } from '../../time.js'
import { createRng } from '../sim/rng.js'
import { createWorld } from '../sim/world.js'
import { shipModel, aircraftModel, KN } from '../sim/units.js'
import { ammoFor } from '../sim/ai.js'
import { KIT_SHORT } from '../sim/ai.js'
import { EffectsRing, FX } from '../sim/effects.js'
import { courseVec } from '../sim/path.js'
import { A } from './params.js'
import { DEG, airSpec, createAir, stepAir, stepFall, airQuatOf, shipSpec, createShip, stepShipArcade } from './physics.js'
import { createProjectiles, stepProjectiles, aaStep, weaponIdx } from './weapons.js'
import { shipHp } from './damage.js'
import { createAdmiral, admiralTick, ensureGuide, formation, stationPoint, isCarrier, isCore, bearingOf, canLaunch, targetsFor } from './admiral.js'
import { shipThink, shipHelm, airThink, airControl } from './ai.js'
import { createObjectives, evaluate, finish, strengthOf, countSunk, countHit, countDown, clockText } from './objectives.js'
import { takeControl, setStation, releaseControl, hop, possess, playerStep, playerAfter, takeableOf, hopTarget, HOP_KINDS } from './player.js'
import { unitRows } from './rows.js'
import { eulerQuat } from '../sim/aircraft.js'

export { HOP_KINDS, clockText }
export const SIDE_KEYS = { jp: 'jp', japan: 'jp', us: 'us', usa: 'us', 'united-states': 'us' }
const asList = (x) => (Array.isArray(x) ? x : x && typeof x === 'object' ? Object.values(x) : [])
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const short = (kit) => KIT_SHORT[kit] ?? String(kit)
const articled = (w) => `${/^[AEIOU]/.test(w) ? 'an' : 'a'} ${w}`
const plural = (w) => (/craft$/.test(w) ? w : `${w}s`)

/** The wargame's clock: 0:00 to the scenario's duration, the box's date and light at the battle's own hour. */
export class ArenaClock {
  constructor(box, t0, duration, name) {
    this.box = box
    this.t0 = t0
    this.duration = duration
    this.zone = box?.zone ?? ''
    this.name = name
    this.t = 0
  }
  utc(t = 0) {
    return this.box ? this.box.utc(this.t0 + t) : Date.UTC(1944, 9, 25) + t * 1000
  }
  label(t = 0) {
    return clockText(t)
  }
  dateLabel(t = 0) {
    return this.box ? this.box.dateLabel(this.t0 + t) : ''
  }
  parse(s) {
    if (typeof s === 'number') return s
    const m = /^(\d+):(\d{2})$/.exec(String(s).trim())
    if (m) return +m[1] * 60 + +m[2]
    const n = Number(s)
    if (Number.isFinite(n)) return n
    throw new Error(`wargame time “${s}”: m:ss`)
  }
  clamp(t) {
    return clamp(t, 0, this.duration)
  }
}

export function createArena(scenario, kits, box = {}, opts = {}) {
  const warn = opts.warn || ((m) => console.warn(m))
  const side = SIDE_KEYS[opts.side] ?? 'us'
  const battle = box.battle
  if (!battle) throw new Error('createArena: the box has no battle file')
  const desc = box.box || box
  const projDesc = box.proj?.toWorld ? box.proj : desc.proj || desc.projection || box.projection
  const proj = projDesc?.toWorld ? projDesc : new TangentProjection(projDesc || { lon0: scenario.arena.centre[0], lat0: scenario.arena.centre[1] })
  const exaggeration = desc.exaggeration ?? box.exaggeration ?? 1
  const g0 = box.ground || box.pack
  const world = createWorld(g0 && (g0.metres ? { exaggeration, ...g0 } : g0.data ? { metres: g0.data.metres, W: g0.W, H: g0.H, rect: g0.rect, exaggeration } : null))
  const seed = `${scenario.id}:${side}:${opts.seed ?? ''}`
  const rng = createRng(seed)
  const boxClock = battle.clock ? new BattleClock(battle.clock) : null
  let t0 = 0
  try {
    const at = scenario.arena?.skyAt ?? scenario.startT ?? battle.firstDoor?.t ?? battle.stops?.[0]?.t
    if (boxClock && at != null) t0 = boxClock.clamp(boxClock.parse(at))
  } catch {
    t0 = 0
  }
  const D = scenario.durationS ?? 600
  const clock = new ArenaClock(boxClock, t0, D, scenario.title)
  const date = clock.utc(0)
  const year = new Date(date).getUTCFullYear()
  const [cx, cz] = proj.toWorld([wrapLon(scenario.arena.centre[0], proj.lon0), scenario.arena.centre[1]])
  const R = scenario.arena.radiusM ?? 3000

  // --- kits as the models read them ---------------------------------------------------------------------
  const shipKits = new Map(asList(kits?.ships).map((k) => [k.id, k]))
  const airKits = new Map(asList(kits?.aircraft).map((k) => [k.id, k]))
  const weapons = new Map(asList(kits?.weapons).map((w) => [w.id, w]))
  const models = new Map()
  const modelOf = (id, kind) => {
    const key = `${kind}:${id}`
    if (!models.has(key)) {
      let k = kind === 'ship' ? shipKits.get(id) : airKits.get(id)
      if (!k) {
        warn(`arena: no ${kind} kit “${id}”; a stand-in is used`)
        k = (kind === 'ship' ? shipKits : airKits).values().next().value
      }
      models.set(key, { kit: k, model: kind === 'ship' ? shipModel(k, weapons, date, warn) : aircraftModel(k, weapons, date, warn) })
    }
    return models.get(key)
  }

  // --- the arena object ------------------------------------------------------------------------------------
  const units = []
  const X = []
  const kitList = []
  const kitIdx = new Map()
  const capacityByKit = {}
  const kitIndexOf = (id, kind) => {
    const key = `${kind}:${id}`
    if (!kitIdx.has(key)) {
      kitIdx.set(key, kitList.length)
      const m = modelOf(id, kind)
      kitList.push({ id, kind, kit: m.kit, model: m.model })
    }
    capacityByKit[id] = (capacityByKit[id] || 0) + 1
    return kitIdx.get(key)
  }
  const unitById = new Map((battle.units || []).map((u) => [u.id, u]))
  const ar = {
    arena: true,
    scenario,
    battle,
    side,
    enemySide: side === 'jp' ? 'us' : 'jp',
    clock,
    proj,
    world,
    year,
    date,
    durationS: D,
    centre: { x: cx, z: cz },
    R,
    slots: units,
    _X: X,
    kits: kitList,
    capacityByKit,
    capacity: 0,
    effects: new EffectsRing(2048),
    projectiles: createProjectiles(),
    beats: [],
    markers: [],
    highlights: [],
    events: [],
    weaponList: [],
    weaponIndex: new Map(),
    t: 0,
    lag: 0,
    player: null,
    result: null,
    respawn: null,
    shake: { amount: 0, seq: 0, t: -1 },
    slowmo: { seconds: 0, seq: 0, t: -1, why: null },
    night: false,
    visM: scenario.arena?.visibilityM ?? Infinity,
    record: { squalls: [], stops: [], moments: new Map(), ships: [], groups: [], shipById: new Map(), groupById: new Map() },
    rngs: { ai: rng.fork('ai'), gun: rng.fork('gun'), dmg: rng.fork('damage'), aa: rng.fork('aa'), fx: rng.fork('fx') },
    sides: {},
    smoke: [],
    _ships: [],
    _air: [],
    _torps: new Set(),
    _near: [],
    _sortie: null,
    _lastSortie: null,
    tallyData: { jp: { sunk: 0, downed: 0, hits: 0, shipsLost: 0, aircraftLost: 0 }, us: { sunk: 0, downed: 0, hits: 0, shipsLost: 0, aircraftLost: 0 }, player: { hits: 0, sunk: 0, downed: 0, lost: 0 } },
    warn,
  }
  const windFrom = battle.weather?.wind?.fromDeg ?? 90
  const windKn = battle.weather?.wind?.kn ?? 8
  const [wdx, wdz] = courseVec((windFrom + 180) % 360)
  ar.wind = { x: wdx * windKn * KN, z: wdz * windKn * KN }

  // --- the sides and their units -----------------------------------------------------------------------------------
  const defs = {}
  for (const [k, v] of Object.entries(scenario.sides || {})) if (SIDE_KEYS[k]) defs[SIDE_KEYS[k]] = v
  for (const key of ['jp', 'us']) {
    const def = defs[key]
    if (!def) throw new Error(`createArena: the scenario has no side “${key}”`)
    ar.sides[key] = { key, enemy: key === 'jp' ? 'us' : 'jp', def, name: def.name ?? key, ships: [], aircraft: [], carriers: [], guide: -1, strength: { fraction: 1 }, lastCoreHitT: -1e9 }
  }
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    for (const id of sd.def.ships || []) {
      const bu = unitById.get(id)
      if (!bu) {
        warn(`arena: ${id} is not a unit of the box's battle file`)
        continue
      }
      const kitId = bu.kit
      const m = modelOf(kitId, 'ship').model
      const i = units.length
      units.push({ index: i, id, name: bu.name ?? id, ja: bu.ja ?? null, label: bu.name ?? id, kind: 'ship', side: key, kit: kitId, kitName: m.kit?.class ?? kitId, kitIndex: kitIndexOf(kitId, 'ship'), group: null, groupName: null, groupIndex: -1, k: -1, authority: 'ai', parked: false })
      const spec = shipSpec(m)
      const hp = shipHp(m)
      const tk = m.kit?.torpedoes
      X.push({
        model: m,
        spec,
        hp,
        hpMax: hp,
        fire: 0,
        list: 0,
        trim: 0,
        body: null,
        guns: m.batteries.map((b) => ({ battery: b, wi: weaponIdx(ar, b.weapon), mounts: b.mounts.map((mt) => ({ ...mt, bearing: mt.rest, elev: 0, readyAt: ar.rngs.gun.next() * b.reloadS * 0.6 })) })),
        torp: m.torp?.weapon ? { weapon: m.torp.weapon, left: (tk?.tubes ?? 2) * (tk?.barrels ?? 4) * (1 + (tk?.reloads ?? 0)), perSalvo: (tk?.barrels ?? 4) * Math.max(1, Math.ceil((tk?.tubes ?? 2) / 2)), readyAt: 0 } : null,
        target: -1,
        order: null,
        want: null,
        launchQ: [],
        nextLaunchT: 0,
        thinkAt: (i % 15) * A.step,
        offset: [0, 0],
      })
      sd.ships.push(i)
      ar._ships.push(i)
      if (isCarrier(m.type)) sd.carriers.push(i)
      if (id === sd.def.guide) sd.guide = i
    }
  }
  const groups = new Set()
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    sd.maxAirborne = sd.def.maxAirborne ?? A.maxAirborne
    for (const entry of sd.def.aircraft || []) {
      const c = units.findIndex((u) => u.id === entry.carrier && u.side === key)
      if (c < 0) {
        warn(`arena: ${entry.carrier} carries ${entry.kit} but is not a ship of ${key}`)
        continue
      }
      const m = modelOf(entry.kit, 'aircraft').model
      const spec = airSpec(m)
      const profile = entry.profile ?? (m.type === 'fighter' ? 'cap' : m.torpedo ? 'torpedo' : 'dive')
      let group = `${entry.carrier}-${entry.kit}-${profile}`
      for (let n = 2; groups.has(group); n++) group = `${entry.carrier}-${entry.kit}-${profile}-${n}`
      groups.add(group)
      const cname = units[c].name
      if (entry.airborne != null) sd.airborneGiven = true
      for (let k = 0; k < (entry.count ?? 1); k++) {
        const i = units.length
        units.push({ index: i, id: `${group}#${k + 1}`, name: `${cname}’s ${plural(short(entry.kit))}`, ja: null, label: `${articled(short(entry.kit))} of ${cname}`, kind: 'aircraft', side: key, kit: entry.kit, kitName: short(entry.kit), kitIndex: kitIndexOf(entry.kit, 'aircraft'), group, groupName: `${cname}’s ${plural(short(entry.kit))}`, groupIndex: k, k, authority: 'ai', parked: false, carrierName: cname })
        const ammo = ammoFor(m, profile)
        X.push({ model: m, spec, hp: spec.hp, hpMax: spec.hp, body: null, profile, home: c, carrier: c, onDeck: true, queued: false, next: null, rearmAt: 0, ammo, ammoFull: JSON.parse(JSON.stringify({ bombs: ammo.bombs, torpedoes: ammo.torpedoes })), mission: null, engage: -1, k, thinkAt: (i % 15) * A.step, skill: key === 'jp' && year <= 1942 ? 1.15 : key === 'jp' ? 0.85 : 1, startAirborne: k < (entry.airborne ?? 0) })
        sd.aircraft.push(i)
        ar._air.push(i)
      }
    }
  }
  const N = units.length
  ar.capacity = N
  ar.state = {
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
  const s = ar.state
  for (let i = 0; i < N; i++) {
    s.kitIndex[i] = units[i].kitIndex
    s.quat[4 * i + 3] = 1
  }
  ar.record.ships = units.filter((u) => u.kind === 'ship').map((u) => ({ id: u.id, slot: u.index, name: u.name }))
  for (const r of ar.record.ships) ar.record.shipById.set(r.id, r)

  // --- the hooks the modules call ------------------------------------------------------------------------------------
  ar.fx = (kind, x, y, z, o) => ar.effects.push(kind, ar.t, x, y, z, o)
  ar.beat = (unit, kind, text) => ar.beats.push({ t: ar.t, unit, kind, text, sources: null })
  ar._event = (e) => ar.events.push({ t: ar.t, ...e })
  ar._setAlive = (i, a) => {
    const was = s.alive[i]
    if (was === a) return
    s.alive[i] = a
    const o = 3 * i
    if (was === 0 && a > 0) {
      s.version[i]++
      ar.fx(FX.spawn, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i })
    } else if (a === 0) ar.fx(was === 2 ? FX.gone : FX.despawn, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i })
  }
  ar.requestShake = (amount) => {
    ar.shake = { amount: clamp(amount, 0, 1), seq: ar.shake.seq + 1, t: ar.t }
  }
  ar.requestSlowmo = (seconds, why) => {
    ar.slowmo = { seconds, seq: ar.slowmo.seq + 1, t: ar.t, why }
  }
  ar.marker = (unit, text, o = {}) => {
    const m = { t: ar.t, unit, text, side: units[unit]?.side ?? null, player: false, onPlayer: ar.player?.unitIndex === unit, kind: 'hit', ...o }
    ar.markers.push(m)
    // (and in the events, as the HUD layer reads them: 'hit' | 'sinking' | 'downed' at the target, `marker` so Battle does not send them to the page twice)
    ar._event({ kind: m.kind === 'down' ? 'downed' : m.kind === 'sinking' ? 'sinking' : 'hit', marker: true, target: unit, text, mine: !!m.player, onPlayer: m.onPlayer, weapon: m.weapon ?? null })
  }
  ar.highlight = (h) => {
    const e = { t: ar.t, snapshot: null, ...h, mine: !!h.player, text: h.caption ?? '' }
    ar.highlights.push(e)
    ar._event({ kind: 'highlight', highlight: e })
    return e
  }
  const heldBy = (by) => !!ar.player && by >= 0 && by === ar.player.unitIndex && !ar.player.lost
  /** The hand a goal's `by` reads: 'aircraft', or the ship's type. */
  const byTypeOf = (by) => (by >= 0 ? (units[by].kind === 'aircraft' ? 'aircraft' : X[by].model.type) : null)
  /** A side's aircraft in the air (and, with `queued`, those on deck waiting their turn to launch). */
  ar.airborneOf = (key, queued = false) => {
    let n = 0
    for (const j of ar.sides[key].aircraft) if (s.alive[j] === 1 || (queued && X[j].queued)) n++
    return n
  }
  ar._onShipHit = (i, res, info) => {
    const victim = units[i]
    const bySide = info.by >= 0 ? units[info.by].side : victim.side === 'jp' ? 'us' : 'jp'
    const type = X[i].model.type
    countHit(ar, bySide, type, { weapon: info.weapon, byType: byTypeOf(info.by) })
    ar.tallyData[bySide].hits++
    const mine = info.byPlayer || heldBy(info.by)
    const onMe = ar.player?.unitIndex === i
    if (isCore(type)) ar.sides[victim.side].lastCoreHitT = ar.t
    ar.marker(i, res.text, { kind: res.sank ? 'sinking' : 'hit', player: mine, weapon: info.weapon })
    if (mine) {
      ar.tallyData.player.hits++
      const so = ar._sortie
      if (so && info.by === so.unit.index) {
        const h = so.hits.find((q) => q.unit === victim.id && q.kind === info.weapon)
        if (h) h.count++
        else so.hits.push({ unit: victim.id, name: victim.name, kind: info.weapon, count: 1, where: res.where })
      }
      ar.beat(i, 'hit', res.text)
      if (info.weapon === 'torpedo' || (info.weapon === 'bomb' && isCarrier(type)) || res.magazine) ar.requestSlowmo(1, info.weapon === 'torpedo' ? 'torpedo' : res.magazine ? 'magazine' : 'bomb')
      ar.highlight({ kind: 'hit', unit: i, name: victim.name, side: victim.side, by: info.by, player: true, weapon: info.weapon, caption: res.text, snap: info.weapon !== 'shell' || !!res.said || res.magazine })
    }
    if (onMe) {
      ar.requestShake(0.3 + 0.08 * (info.weapon === 'torpedo' ? 5 : info.weapon === 'bomb' ? 2 : 1))
      ar.beat(i, 'hit', res.text)
      if (res.magazine) ar.requestSlowmo(1, 'magazine')
    }
  }
  ar._onSinking = (i, by, magazine) => {
    const victim = units[i]
    const bySide = by >= 0 ? units[by].side : victim.side === 'jp' ? 'us' : 'jp'
    countSunk(ar, bySide, X[i].model.type, { weapon: magazine ? 'shell' : X[i].lastHitWeapon ?? null, byType: byTypeOf(by) })
    ar.tallyData[bySide].sunk++
    ar.tallyData[victim.side].shipsLost++
    if (heldBy(by)) ar.tallyData.player.sunk++
    ar.beat(i, 'sinks', `${victim.name} is going down.`)
    ar.highlight({ kind: 'sinking', unit: i, name: victim.name, side: victim.side, by, player: heldBy(by), weapon: magazine ? 'magazine' : null, caption: `${victim.name} is going down`, snap: true })
    ar._event({ kind: 'sinking', index: i, by })
    // the aircraft on her deck go with her
    for (const j of ar._air) if (X[j].home === i && X[j].onDeck) X[j].hp = 0
    X[i].launchQ.length = 0
  }
  ar._onAircraftHit = (j, by, how, down) => {
    const victim = units[j]
    ar.marker(j, `${victim.kitName}: ${down ? 'shot down' : 'hit'}`, { kind: down ? 'down' : 'hit', player: heldBy(by), weapon: how })
    if (ar.player?.unitIndex === j && !down) ar.requestShake(0.35)
    if (!down) return
    const bySide = by >= 0 ? units[by].side : victim.side === 'jp' ? 'us' : 'jp'
    countDown(ar, bySide, { weapon: how, byType: byTypeOf(by) })
    ar.tallyData[bySide].downed++
    ar.tallyData[victim.side].aircraftLost++
    if (heldBy(by)) {
      ar.tallyData.player.downed++
      if (ar._sortie) {
        ar._sortie.downed++
        ar._sortie.hits.push({ unit: victim.id, name: victim.label, kind: 'aircraft', count: 1 })
      }
      ar.highlight({ kind: 'hit', unit: j, name: victim.label, side: victim.side, by, player: true, weapon: how, caption: `${victim.kitName}: shot down`, snap: ar.tallyData.player.downed <= 2 })
    }
    // a strike member gone: its strike goes on without it
    if (X[j].queued) X[j].queued = false
  }
  ar._onNearMiss = (x, z, cal, owner) => {
    // the ship the fall was meant for knows she is under fire
    const os = owner >= 0 ? units[owner].side : null
    for (const i of ar._ships) {
      if (s.alive[i] !== 1 || units[i].side === os) continue
      if (Math.abs(s.pos[3 * i] - x) < 300 && Math.abs(s.pos[3 * i + 2] - z) < 300) X[i].underFireT = ar.t
    }
    const pl = ar.player
    if (!pl || pl.lost || pl.kind !== 'ship' || owner === pl.unitIndex) return
    const i = pl.unitIndex
    const d = Math.hypot(s.pos[3 * i] - x, s.pos[3 * i + 2] - z)
    if (d < X[i].model.L * 0.5 + 80) ar.requestShake(clamp(cal / 900, 0.12, 0.55) * (1 - d / (X[i].model.L * 0.5 + 80)))
  }
  ar._onPlayerLost = (i) => {
    const u = units[i]
    ar.tallyData.player.lost++
    ar.highlight({ kind: 'lost', unit: i, name: u.kind === 'aircraft' ? u.label : u.name, side: u.side, by: X[i].lastHitBy ?? -1, player: true, weapon: null, caption: u.kind === 'aircraft' ? `Your ${u.kitName} did not return` : `${u.name} is going down`, snap: true })
    ar.requestShake(u.kind === 'ship' ? 0.8 : 0.5)
    ar._event({ kind: 'lost', index: i })
  }
  ar._onRespawn = (from, to, line) => {
    ar.respawn = { t: ar.t, line, from, to }
    if (line) ar.beat(to, 'respawn', line)
    ar._event({ kind: 'respawn', from, to, line, text: line, mine: true })
  }
  ar._onPhase = (sd, ps) => {
    ar._event({ kind: 'phase', side: sd.key, index: ps.index, title: ps.title })
    if (sd.key === ar.side && (ps.text || ps.title)) ar.beat(-1, 'phase', ps.text || ps.title)
  }
  ar._onEnd = (result) => {
    ar._event({ kind: 'end', result })
    if (result.line) ar.beat(-1, 'end', result.line)
  }
  ar._onTurnAway = (sd) => {
    ar.beat(-1, 'admiral', `${sd.name} turns away.`)
    ar._event({ kind: 'turn-away', side: sd.key })
  }
  ar._onDestroyersGoIn = (sd) => {
    ar.beat(-1, 'admiral', `${sd.name}: the destroyers go in.`)
    ar._event({ kind: 'destroyers', side: sd.key })
  }
  ar._onWave = (sd, strike) => ar._event({ kind: 'wave', side: sd.key, id: strike.id, target: strike.target, size: strike.members.length })
  ar._onRelease = () => {}
  ar._onTorpedoesFired = (i, j) => ar._event({ kind: 'torpedoes', index: i, target: j })
  ar._onTorpedoBroke = (i, player) => {
    if (player) ar.beat(i, 'player', 'Too high: the torpedo broke on the water.')
  }
  ar.addSmoke = (x0, z0, x1, z1, by, hides = true) => {
    ar.smoke.push({ x0, z0, x1, z1, born: ar.t, until: ar.t + A.smokeS, by, hides })
    // (drawn a line at a time, every 150 m of trail or 20 s: the effect lays two dozen puffs on each line it is given,
    // and one per 5 s segment stood a white wall along every layer's track)
    const run = (ar._smokeRun ||= new Map())
    const r = run.get(by)
    if (!r || ar.t - r.t > 30) {
      run.set(by, { x: x0, z: z0, t: ar.t })
      return
    }
    if (Math.hypot(x1 - r.x, z1 - r.z) < A.smokeDrawM && ar.t - r.t < 20) return
    ar.fx(FX.smoke, r.x, 0, r.z, { unit: by, dx: x1 - r.x, dz: z1 - r.z, size: A.smokeS, data: 1 })
    run.set(by, { x: x1, z: z1, t: ar.t })
  }
  /**
   * Whether ship j is hidden from ship i by smoke: a screen (drifting with the
   * wind) across the line between them, more than 300 m from either end (a
   * ship is not hidden by the smoke at her own funnel; inside a kilometre she
   * is seen through it).
   */
  ar.hidden = (i, j) => {
    const ax = s.pos[3 * i]
    const az = s.pos[3 * i + 2]
    let dx = s.pos[3 * j] - ax
    let dz = s.pos[3 * j + 2] - az
    const L = Math.hypot(dx, dz)
    if (L > ar.visM) return true
    if (L < A.squall.hideM) return false
    if (ar.record.squalls.length && (ar.inSquall(s.pos[3 * j], s.pos[3 * j + 2]) || (L > A.squallSeeOutM && ar.inSquall(ax, az)))) return true
    if (!ar.smoke.length) return false
    dx /= L
    dz /= L
    for (const sm of ar.smoke) {
      const age = ar.t - sm.born
      if (age > A.smokeThickS || sm.hides === false) continue // (thinned, or a carrier's funnel smoke: drawn, and hides nothing)
      const mx = (sm.x0 + sm.x1) / 2 + ar.wind.x * age - ax
      const mz = (sm.z0 + sm.z1) / 2 + ar.wind.z * age - az
      const u = mx * dx + mz * dz
      if (u < 200 || u > L - 200) continue
      const r = A.smokeR + Math.hypot(sm.x1 - sm.x0, sm.z1 - sm.z0) / 2
      if (Math.abs(mx * dz - mz * dx) < r) return true
    }
    return false
  }
  ar._land = (j, c) => {
    const x = X[j]
    ar._setAlive(j, 0)
    x.onDeck = true
    x.home = c
    x.rearmAt = ar.t + A.strike.rearmS
    x.mission = null
    x.engage = -1
    x.finals = false
    x.hp = x.hpMax
    x.ammo = ammoFor(x.model, x.profile)
  }
  ar._launch = (j, mission) => {
    const x = X[j]
    const c = x.home
    const h = s.heading[c] * DEG
    const m = X[c].model
    x.body = createAir(x.spec, { x: s.pos[3 * c] + Math.sin(h) * m.L * 0.42, y: (m.deck ?? 15) + 6, z: s.pos[3 * c + 2] - Math.cos(h) * m.L * 0.42, heading: s.heading[c], V: x.spec.vMin * 1.15, gamma: 0.14, throttle: 1 })
    x.onDeck = false
    x.queued = false
    x.mission = mission || defaultMission(j)
    x.next = null
    x.engage = -1
    x.thinkAt = ar.t
    writeAir(j)
    ar._setAlive(j, 1)
    ar.fx(FX.launch, x.body.x, x.body.y, x.body.z, { unit: j })
  }
  ar._launchNow = (j) => {
    const x = X[j]
    const q = X[x.home].launchQ
    const k = q.indexOf(j)
    if (k >= 0) q.splice(k, 1)
    ar._launch(j, x.next || defaultMission(j))
  }
  function defaultMission(j) {
    const x = X[j]
    const sd = ar.sides[units[j].side]
    if (x.model.type === 'fighter' && x.profile !== 'strafe') return { kind: 'cap', a: 0 }
    if ((x.ammo?.bombs ?? 0) > 0 || (x.ammo?.torpedoes ?? 0) > 0 || x.profile === 'strafe') {
      const t = targetsFor(ar, sd, ar.sides[sd.enemy])
      if (t.length) {
        const strike = { id: `${sd.key}-solo-${j}`, target: t[0], members: [j], escorts: [], t: ar.t }
        return { kind: 'strike', strike, phase: 'approach' }
      }
    }
    return { kind: 'return' }
  }
  ar._defaultMission = (j) => (X[j].mission = defaultMission(j))
  ar.tallySnapshot = () => JSON.parse(JSON.stringify(ar.tallyData))

  // --- the starting positions: each side's guide 2.5 km out on its bearing, the formation about it -----------------------------
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    sd.adm = createAdmiral(ar, sd)
    ensureGuide(ar, sd, { initial: true })
    if (sd.guide < 0) continue
    // (content-3's separationM: guide to guide; half of it from the centre, as tools/check/wargames.mjs layout() has it)
    const b = (sd.def.bearingDeg ?? (key === 'jp' ? 345 : 165)) * DEG
    const half = scenario.arena?.separationM != null ? scenario.arena.separationM / 2 : Math.min(A.placeM, R * 0.85)
    const gx = cx + Math.sin(b) * half
    const gz = cz - Math.cos(b) * half
    sd.adm.threat = bearingOf(cx - gx, cz - gz)
    s.pos[3 * sd.guide] = gx
    s.pos[3 * sd.guide + 2] = gz
    formation(ar, sd)
    sd._formed = true
    sd._formedGuide = sd.guide
  }
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    if (sd.guide < 0) continue
    const adm = sd.adm
    let v = Infinity
    for (const i of sd.ships) if (isCore(X[i].model.type)) v = Math.min(v, X[i].model.vmax)
    if (!Number.isFinite(v)) v = Math.min(...sd.ships.map((i) => X[i].model.vmax))
    adm.speed = v * 0.9
    // the opening course: the scenario's (content-3's headingDeg); else the aggressive close, the rest open the range across the threat
    adm.course = sd.def.headingDeg != null ? (sd.def.headingDeg % 360 + 360) % 360 : adm.aggression >= 0.5 ? adm.threat : (adm.threat + (sd.def.bearingDeg % 2 ? 120 : -120) + 360) % 360
    adm._courseT = 0
    const pt = { x: 0, z: 0 }
    for (const i of sd.ships) {
      if (i !== sd.guide) stationPoint(ar, sd, i, pt)
      else {
        pt.x = s.pos[3 * i]
        pt.z = s.pos[3 * i + 2]
      }
      X[i].body = createShip(X[i].model, { x: pt.x, z: pt.z, heading: adm.course, V: Math.min(adm.speed, X[i].model.vmax) })
      writeShip(i)
      s.alive[i] = 1
      s.version[i] = 1
    }
  }
  // the weaker side has been making smoke for the last half minute (its escorts' trails behind them, already drifting)
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    const en = ar.sides[sd.enemy]
    const hp = (side) => side.ships.reduce((n, i) => n + X[i].hpMax, 0)
    if (!(hp(sd) < hp(en) * 0.85)) continue
    // (the escorts nearest the other side, as many as lay smoke at once)
    const toward = (i) => Math.hypot(X[i].body.x - cx, X[i].body.z - cz)
    const layers = sd.ships.filter((i) => X[i].model.type === 'dd' || X[i].model.type === 'de').sort((p, q) => toward(p) - toward(q)).slice(0, A.smokeLayers)
    for (const i of layers) {
      const b = X[i].body
      const h = b.heading * DEG
      for (let k = 6; k > 0; k--) {
        const d0 = k * 5 * b.V
        const d1 = (k - 1) * 5 * b.V
        const born = -k * 5
        ar.smoke.push({ x0: b.x - Math.sin(h) * d0, z0: b.z + Math.cos(h) * d0, x1: b.x - Math.sin(h) * d1, z1: b.z + Math.cos(h) * d1, born, until: born + A.smokeS, by: i })
      }
      // (and drawn: one line along the trail, its life what is left of the screens')
      const d6 = 6 * 5 * b.V
      ar.fx(FX.smoke, b.x - Math.sin(h) * d6, 0, b.z + Math.cos(h) * d6, { unit: i, dx: Math.sin(h) * d6, dz: -Math.cos(h) * d6, size: A.smokeS - 30, data: 1 })
    }
  }
  // the aircraft already up: instant action. The scenario's `airborne` counts when it gives them (content-3): the
  // combat air patrol on its orbit, the rest in an opening strike already on its way in, its escorts with it; else
  // the combat air patrol alone.
  for (const key of ['jp', 'us']) {
    const sd = ar.sides[key]
    const en = ar.sides[sd.enemy]
    const up = (j, mission, x0, y0, z0, heading, throttle) => {
      const x = X[j]
      x.body = createAir(x.spec, { x: x0, y: y0, z: z0, heading, throttle })
      x.onDeck = false
      x.mission = mission
      writeAir(j)
      s.alive[j] = 1
      s.version[j] = 1
    }
    const g = sd.guide
    const gx0 = g >= 0 ? s.pos[3 * g] : cx
    const gz0 = g >= 0 ? s.pos[3 * g + 2] : cz
    const orbit = (list) =>
      list.forEach((j, k) => {
        const a = (k / Math.max(1, list.length)) * Math.PI * 2
        up(j, { kind: 'cap', a }, gx0 + Math.sin(a) * A.cap.radiusM, A.cap.altM, gz0 - Math.cos(a) * A.cap.radiusM, (a / DEG + 90) % 360, 0.7)
      })
    if (!sd.airborneGiven) {
      const fighters = sd.aircraft.filter((j) => X[j].model.type === 'fighter')
      orbit(fighters.slice(0, Math.min(4, Math.ceil(fighters.length * A.capShare))))
      continue
    }
    const starting = sd.aircraft.filter((j) => X[j].startAirborne).slice(0, sd.maxAirborne)
    const noAir = !en.aircraft.length
    const cap = starting.filter((j) => X[j].profile === 'cap' && !noAir)
    orbit(cap)
    sd.capNeed = cap.length
    const rest = starting.filter((j) => !cap.includes(j))
    if (!rest.length) continue
    const targets = targetsFor(ar, sd, en)
    if (!targets.length) {
      orbit(rest)
      continue
    }
    const strike = { id: `${key}-wave-0`, target: targets[0], members: [], escorts: [], t: 0 }
    const th = sd.adm.threat * DEG
    rest.forEach((j, k) => {
      const x = X[j]
      const escort = x.model.type === 'fighter' && (x.profile === 'escort' || x.profile === 'cap') && !noAir
      const payload = (x.ammo?.bombs ?? 0) > 0 || (x.ammo?.torpedoes ?? 0) > 0
      const alt = escort ? A.strike.approachAltM + 250 : (x.ammo?.torpedoes ?? 0) > 0 ? 300 : payload ? A.strike.approachAltM : A.strafe.approachAltM
      const lat = ((k % 7) - 3) * 160
      const ahead = 700 + Math.floor(k / 7) * 220
      const px = gx0 + Math.sin(th) * ahead + Math.cos(th) * lat
      const pz = gz0 - Math.cos(th) * ahead + Math.sin(th) * lat
      if (escort) {
        strike.escorts.push(j)
        up(j, { kind: 'escort', strike }, px, alt, pz, sd.adm.threat, 0.85)
      } else {
        strike.members.push(j)
        up(j, { kind: 'strike', strike, phase: 'approach' }, px, alt, pz, sd.adm.threat, 0.9)
      }
    })
  }
  // the box's squalls, brought into the arena: as many as the box's weather has, each a disc of rain drifting on its own
  // velocity through part of the ten minutes (a ship inside is hidden from a ship beyond a kilometre, and sees none out)
  {
    const sq = battle.weather?.squalls || []
    const r = ar.rngs.fx
    sq.forEach((w, k) => {
      const rad = r.uniform(A.squall.radiusM[0], A.squall.radiusM[1])
      const last = r.uniform(A.squall.lastS[0], A.squall.lastS[1])
      const t0 = (k + 0.3 + r.next() * 0.4) * (D / Math.max(1, sq.length)) - last / 2
      const kn = w.velocity?.kn ?? 8
      const toward = (w.velocity?.towardDeg ?? windFrom + 180) * DEG
      const vx = Math.sin(toward) * kn * KN
      const vz = -Math.cos(toward) * kn * KN
      // placed so that its middle passes near the arena's middle third
      const a = r.next() * Math.PI * 2
      const off = r.uniform(0, R * 0.5)
      const mx = cx + Math.cos(a) * off - vx * last * 0.5
      const mz = cz + Math.sin(a) * off - vz * last * 0.5
      const poly = []
      for (let n = 0; n <= 16; n++) poly.push([mx + Math.cos((n / 16) * Math.PI * 2) * rad, mz + Math.sin((n / 16) * Math.PI * 2) * rad])
      ar.record.squalls.push({ t0: Math.max(0, t0), t1: Math.max(0, t0) + last, poly, vx, vz, x: mx, z: mz, r: rad, from: Math.max(0, t0) })
    })
  }
  /** Whether a point is inside a squall now. */
  ar.inSquall = (x, z) => {
    for (const q of ar.record.squalls) {
      if (ar.t < q.t0 || ar.t > q.t1) continue
      const d = ar.t - q.t0
      if (Math.hypot(x - q.x - q.vx * d, z - q.z - q.vz * d) < q.r) return true
    }
    return false
  }
  createObjectives(ar)
  for (const key of ['jp', 'us']) ar.sides[key].strength = strengthOf(ar, key)
  // the light: a night box draws white splashes
  try {
    const h = new Date(clock.utc(0)).getUTCHours()
    const local = (h + Math.round((proj.lon0 ?? 0) / 15) + 24) % 24
    ar.night = local < 5 || local >= 19
  } catch {
    ar.night = false
  }
  if (typeof scenario.arena?.night === 'boolean') ar.night = scenario.arena.night

  // --- writing the state ------------------------------------------------------------------------------------------------
  function writeShip(i) {
    const x = X[i]
    const b = x.body
    const o = 3 * i
    s.pos[o] = b.x
    s.pos[o + 1] = 0
    s.pos[o + 2] = b.z
    const h = b.heading * DEG
    s.vel[o] = Math.sin(h) * b.V
    s.vel[o + 1] = 0
    s.vel[o + 2] = -Math.cos(h) * b.V
    s.speed[i] = Math.abs(b.V)
    s.heading[i] = b.heading
    s.damage[i] = 1 - x.hp / x.hpMax
    s.fire[i] = s.alive[i] === 0 ? 0 : x.fire
    s.list[i] = x.list || 0
    eulerQuat(-h, 0, -(x.list || 0) * DEG, s.quat, 4 * i)
  }
  function writeAir(j) {
    const x = X[j]
    const b = x.body
    const o = 3 * j
    s.pos[o] = b.x
    s.pos[o + 1] = b.y
    s.pos[o + 2] = b.z
    s.vel[o] = b.vx
    s.vel[o + 1] = b.vy
    s.vel[o + 2] = b.vz
    s.speed[j] = b.V
    s.heading[j] = ((b.psi / DEG) % 360 + 360) % 360
    s.damage[j] = 1 - Math.max(0, x.hp) / x.hpMax
    s.fire[j] = s.alive[j] === 2 ? 1 : 0
    airQuatOf(b, s.quat, 4 * j)
  }
  const groundAt = (x, z) => world.metresAt(x, z)

  // --- one step ------------------------------------------------------------------------------------------------------------
  let objT = 0
  function step(dt) {
    ar.t += dt
    const t = ar.t
    // the admirals
    for (const key of ['jp', 'us']) {
      const sd = ar.sides[key]
      if (t >= (sd._tickAt ?? 0)) {
        sd.strength = strengthOf(ar, key)
        admiralTick(ar, sd)
        sd._tickAt = t + A.admiralS
      }
    }
    // the units' AI
    for (const i of ar._ships) {
      if (s.alive[i] !== 1 || t < X[i].thinkAt) continue
      X[i].thinkAt = t + A.thinkS
      shipThink(ar, i)
    }
    for (const j of ar._air) {
      if (s.alive[j] !== 1 || t < X[j].thinkAt) continue
      X[j].thinkAt = t + A.thinkS
      airThink(ar, j)
    }
    // the player's input at the stations held
    playerStep(ar, dt)
    // the launches: a carrier sends one off every few seconds while it can
    for (const sd of Object.values(ar.sides)) {
      for (const c of sd.carriers) {
        const x = X[c]
        if (!x.launchQ.length || t < x.nextLaunchT) continue
        if (!canLaunch(ar, c)) {
          for (const j of x.launchQ) X[j].queued = false
          x.launchQ.length = 0
          continue
        }
        if (ar.airborneOf(sd.key) >= sd.maxAirborne) continue
        const j = x.launchQ.shift()
        if (s.alive[j] === 0 && X[j].hp > 0 && X[j].onDeck) ar._launch(j, X[j].next)
        x.nextLaunchT = t + A.strike.launchEveryS
      }
    }
    // the physics
    const pl = ar.player
    for (const i of ar._ships) {
      const a = s.alive[i]
      if (!a) continue
      const x = X[i]
      const b = x.body
      if (a === 2) {
        b.V *= Math.max(0, 1 - dt * 0.15)
        stepShipArcade(b, x.spec, b.helm, 0, dt, 0)
        if (t - x.sinkT >= x.sinkDur) ar._setAlive(i, 0)
      } else {
        const held = pl && pl.unitIndex === i && !pl.lost && x.playerHelm
        const c = held ? x.playerHelm : shipHelm(ar, i, x)
        stepShipArcade(b, x.spec, c.helm, c.telegraph, dt, x.cap ?? 1)
        // the land: a bow on the ground stops her
        const h = b.heading * DEG
        if (world.metresAt(b.x + Math.sin(h) * x.model.L * 0.5, b.z - Math.cos(h) * x.model.L * 0.5) > -2) {
          b.V *= Math.max(0, 1 - dt * 2)
          if (b.V > 0) {
            b.x -= Math.sin(h) * b.V * dt
            b.z += Math.cos(h) * b.V * dt
          }
        }
      }
      writeShip(i)
    }
    for (const j of ar._air) {
      const a = s.alive[j]
      if (!a) continue
      const x = X[j]
      const b = x.body
      if (a === 2) {
        stepFall(b, dt)
        if (b.y <= Math.max(0, world.heightAt(b.x, b.z))) {
          ar.fx(world.metresAt(b.x, b.z) > 0 ? FX.explode : FX.splash, b.x, Math.max(0, world.heightAt(b.x, b.z)), b.z, { unit: j, size: 12 })
          ar._setAlive(j, 0)
        }
        writeAir(j)
        continue
      }
      const held = pl && pl.unitIndex === j && !pl.lost && x.playerCmd
      let cmd = held ? x.playerCmd : airControl(ar, j, dt)
      if (pl && pl.unitIndex === j && pl.station === 'bombardier' && cmd.aim) {
        // the bombardier steers the pilot's run-in
        const a2 = b.psi + (x.bombardierSteer ?? 0) * 0.5
        cmd = { ...cmd, aim: [Math.sin(a2), 0, -Math.cos(a2)] }
      }
      stepAir(b, x.spec, cmd, dt, groundAt)
      writeAir(j)
    }
    // the projectiles, the AA
    stepProjectiles(ar, dt)
    ar._aaT = (ar._aaT ?? 0) - dt
    if (ar._aaT <= 0) {
      aaStep(ar, A.aaS)
      ar._aaT += A.aaS
    }
    if (ar.smoke.length && ar.smoke[0].until < t) ar.smoke = ar.smoke.filter((sm) => sm.until >= t)
    // the objectives
    objT -= dt
    if (objT <= 0) {
      objT = 0.25
      evaluate(ar)
    }
    // the player's loss and respawn; the HUD's mirror
    playerAfter(ar)
  }

  ar.advance = function advance(dtBattle) {
    if (!(dtBattle > 0) || ar.result) return 0
    ar.lag += dtBattle
    let steps = Math.floor(ar.lag / A.step + 1e-9)
    if (steps > A.maxSteps) steps = A.maxSteps
    for (let k = 0; k < steps && !ar.result; k++) step(A.step)
    ar.lag -= steps * A.step
    if (ar.lag > A.step * A.maxSteps) ar.lag = A.step * A.maxSteps
    return steps
  }
  /** One step exactly (the tests). */
  ar.step = (dt = A.step) => step(dt)

  // --- the public surface (ROUND-3 §3) ----------------------------------------------------------------------------------------
  ar.units = () => unitRows(ar)
  ar.takeable = (i) => takeableOf(ar, i)
  ar.takeControl = (role) => takeControl(ar, role)
  ar.setStation = (name) => setStation(ar, name)
  ar.releaseControl = () => releaseControl(ar)
  ar.hop = (kind) => hop(ar, kind)
  ar.hopTarget = (kind) => hopTarget(ar, kind)
  ar.possess = (i, station) => possess(ar, i, station)
  ar.forceEnd = (reason = 'forced') => {
    evaluate(ar)
    return finish(ar, reason)
  }
  /** The player's first unit (the scenario names it per side): a role for takeControl. */
  Object.defineProperty(ar, 'first', {
    get() {
      const def = ar.sides[ar.side].def
      const id = def.first
      const ok = (u) => u.side === ar.side && takeableOf(ar, u.index) === true
      let j = units.findIndex((u) => (u.id === id || u.group === id) && ok(u))
      // (content-3: an aircraft kit as `first` is an airborne aircraft of that kit; one on deck if none is up)
      if (j < 0) j = units.findIndex((u) => u.kind === 'aircraft' && u.kit === id && s.alive[u.index] === 1 && ok(u))
      if (j < 0) j = units.findIndex((u) => u.kind === 'aircraft' && u.kit === id && ok(u))
      if (j < 0) j = ar.sides[ar.side].ships.find((i) => s.alive[i] === 1) ?? -1
      return j >= 0 ? { unit: units[j].id, index: j, station: def.firstStation ?? null } : null
    },
  })
  Object.defineProperty(ar, 'sortie', { get: () => ar._sortie ? { ...ar._sortie, t1: ar.t, span: [ar._sortie.t0, ar.t] } : ar._lastSortie })
  Object.defineProperty(ar, 'objective', { get: () => goalView(ar.side) })
  Object.defineProperty(ar, 'objectives', { get: () => ({ jp: goalView('jp'), us: goalView('us') }) })
  Object.defineProperty(ar, 'phase', { get: () => phaseView(ar.side) })
  Object.defineProperty(ar, 'phases', { get: () => ({ jp: phaseView('jp'), us: phaseView('us') }) })
  Object.defineProperty(ar, 'strength', { get: () => ({ jp: strengthOf(ar, 'jp'), us: strengthOf(ar, 'us') }) })
  Object.defineProperty(ar, 'tally', { get: () => ar.tallySnapshot() })
  Object.defineProperty(ar, 'remainingS', { get: () => Math.max(0, D - ar.t) })
  function goalView(key) {
    const sd = ar.sides[key]
    const g = sd.goalState
    if (!g) return null
    return { side: key, name: sd.name, kind: g.kind, type: g.type, types: g.types, noun: g.noun, weapon: g.weapon, by: g.by, outOfAction: g.outOfAction, done: g.count, count: g.need, need: g.need, total: g.total ?? null, of: g.total ?? g.need, status: g.status, text: sd.def.goal?.text ?? null, line: g.line, endsAt: D, terms: (g.terms || []).map((t) => ({ kind: t.kind, type: t.type, types: t.types, noun: t.noun, done: t.count, count: t.need, need: t.need, total: t.total ?? null, status: t.status, line: t.line })) }
  }
  function phaseView(key) {
    const ps = ar.sides[key].phaseState
    if (!ps) return null
    const g = ps.state
    const left = Math.max(0, ps.endsAt - ar.t)
    return { side: key, index: ps.index, of: ar.sides[key].phases.length, title: ps.title, text: ps.text, goal: ps.goal, t: ps.t0, t0: ps.t0, endsAt: ps.endsAt, remainingS: left, leftS: left, done: g?.count ?? 0, count: g?.need ?? ps.goal?.count ?? 0, need: g?.need ?? ps.goal?.count ?? 0, status: g?.status ?? 'open', line: g?.line ?? '' }
  }
  /** The unit a ray hits (the record sim's pick: a ship's box, an aircraft's sphere), or −1. */
  ar.pick = function pick(o, d) {
    let best = -1
    let bestD = Infinity
    const ox = o.x ?? o[0]
    const oy = o.y ?? o[1]
    const oz = o.z ?? o[2]
    const dx = d.x ?? d[0]
    const dy = d.y ?? d[1]
    const dz = d.z ?? d[2]
    for (let i = 0; i < N; i++) {
      if (s.alive[i] !== 1) continue
      const px = s.pos[3 * i] - ox
      const py = s.pos[3 * i + 1] - oy
      const pz = s.pos[3 * i + 2] - oz
      const along = px * dx + py * dy + pz * dz
      if (along <= 0) continue
      const m = X[i].model
      const r = units[i].kind === 'ship' ? m.L * 0.5 : Math.max(m.span, m.length) * 0.75 + along * 0.004
      const d2 = px * px + py * py + pz * pz - along * along
      if (d2 < r * r && along < bestD) {
        bestD = along
        best = i
      }
    }
    return best
  }
  evaluate(ar)
  return ar
}

/** The least distance between two segments in the plane. */
function segSegDist(ax, az, bx, bz, cx, cz, dx, dz) {
  const cross = (ux, uz, vx, vz) => ux * vz - uz * vx
  const d1 = cross(bx - ax, bz - az, cx - ax, cz - az)
  const d2 = cross(bx - ax, bz - az, dx - ax, dz - az)
  const d3 = cross(dx - cx, dz - cz, ax - cx, az - cz)
  const d4 = cross(dx - cx, dz - cz, bx - cx, bz - cz)
  if (d1 * d2 < 0 && d3 * d4 < 0) return 0
  const pd = (px, pz, qx, qz, rx, rz) => {
    const L = (rx - qx) ** 2 + (rz - qz) ** 2
    const t = L > 0 ? clamp(((px - qx) * (rx - qx) + (pz - qz) * (rz - qz)) / L, 0, 1) : 0
    return Math.hypot(qx + (rx - qx) * t - px, qz + (rz - qz) * t - pz)
  }
  return Math.min(pd(ax, az, cx, cz, dx, dz), pd(bx, bz, cx, cz, dx, dz), pd(cx, cz, ax, az, bx, bz), pd(dx, dz, ax, az, bx, bz))
}
