// The damage model (ENGINEERING.md §5 "Damage is one model for everyone";
// R7 §4.8): two tracks and a doomed state instead of one threshold. `fight`
// (out of action at 1), `float` (founders at 1, or capsizes past 35° of
// list), `list`, fires in four zones with a carrier's hangar hazard H, holes
// that flood until damage control patches them, per-kit systems, and
// `doomed`. The per-hit table is R7's starting values, tuned by the
// calibration tests (tools/smoke-battle.mjs; research/engine.md).

import { P } from './params.js'

const D = P.damage
const COLUMN = { bb: 'bb', cv: 'cv', cvl: 'cv', cve: 'cve', ca: 'ca', cl: 'ca', dd: 'dd', de: 'dd', ss: 'dd', 'ss-midget': 'dd', ar: 'cve', ao: 'cve', cm: 'cve', av: 'cve', ah: 'cve', ap: 'cve', ak: 'cve' }
export const columnOf = (type) => COLUMN[type] || 'ca'
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t))

// R7 §4.8's per-hit table: [fight, float, extra]
// heavy shells (14"–18.1" AP): hull above the waterline / at or below it / in the superstructure
const HEAVY = {
  hull: { bb: [0.07, 0.02], cv: [0.1, 0.03], ca: [0.15, 0.05], dd: [0.06, 0.03, { sys: 0.4 }], cve: [0.05, 0.03] },
  waterline: { bb: [0.07, 0.06, { hole: 1 }], cv: [0.1, 0.08, { hole: 1 }], ca: [0.15, 0.1, { hole: 1 }], dd: [0.08, 0.08, { hole: 1 }], cve: [0.06, 0.08, { hole: 1 }] },
  super: { bb: [0.03, 0, { sys: 0.6 }], cv: [0.03, 0, { sys: 0.6 }], ca: [0.03, 0, { sys: 0.6 }], dd: [0.03, 0, { sys: 0.6 }], cve: [0.03, 0, { sys: 0.6 }] },
}
const MEDIUM = { bb: [0.015, 0], cv: [0.05, 0.02], ca: [0.06, 0.03], dd: [0.1, 0.05], cve: [0.06, 0.02] }
const MEDIUM_AP_OVER = { dd: [0.05, 0.03], cve: [0.04, 0.02] }
// 5"–6": [at 5 inch, at 6 inch]
const LIGHT = { bb: [[0.003, 0], [0.008, 0]], cv: [[0.01, 0], [0.02, 0]], ca: [[0.012, 0.005], [0.03, 0.005]], dd: [[0.035, 0.02], [0.07, 0.02]], cve: [[0.02, 0.01], [0.04, 0.01]] }
const BOMB = {
  'bomb-1000': { bb: [0.02, 0, 0.3], cv: [0.06, 0, 0.9], ca: [0.15, 0.03, 0.6], dd: [0.4, 0.3, 0.5], cve: [0.15, 0.05, 0.7] },
  'bomb-500': { bb: [0.01, 0, 0.25], cv: [0.03, 0, 0.8], ca: [0.08, 0.02, 0.5], dd: [0.25, 0.15, 0.4], cve: [0.08, 0.03, 0.6] },
  'bomb-100': { bb: [0.004, 0, 0.1], cv: [0.012, 0, 0.4], ca: [0.03, 0.008, 0.25], dd: [0.1, 0.05, 0.2], cve: [0.03, 0.01, 0.3] },
}
const TORPEDO = {
  air: { bb: [0.03, 0.08, 3], cv: [0.06, 0.18, 10], ca: [0.08, 0.22, 8], dd: [0.4, 0.6, 10], cve: [0.15, 0.3, 8] },
  t93: { bb: [0.05, 0.12, 4], cv: [0.1, 0.35, 12], ca: [0.12, 0.35, 10], dd: [0.5, 0.9, 12], cve: [0.2, 0.5, 10] },
  mk15: { bb: [0.04, 0.1, 3], cv: [0.08, 0.25, 10], ca: [0.1, 0.25, 8], dd: [0.45, 0.8, 10], cve: [0.18, 0.4, 9] },
}

/** The class of a weapon for the table: heavy, medium, light, small, bomb-1000, bomb-500, bomb-100, torpedo-air, torpedo-t93, torpedo-mk15. */
export function weaponClass(w) {
  if (!w) return 'light'
  if (w.kind === 'torpedo') {
    if (w.air) return 'torpedo-air'
    if (/mk|mark/i.test(w.id)) return 'torpedo-mk15'
    return 'torpedo-t93'
  }
  if (w.kind === 'bomb') {
    if (w.class === 'bomb-1000' || (w.massKg ?? 0) >= 400) return 'bomb-1000'
    if (w.class === 'bomb-500' || (w.massKg ?? 0) >= 180) return 'bomb-500'
    return 'bomb-100'
  }
  const c = w.calibreMm ?? 127
  if (c >= 300) return 'heavy'
  if (c >= 180) return 'medium'
  if (c >= 100) return 'light'
  return 'small'
}

/** The record's `where` words to a zone (0 bow … 3 stern) and a part. */
export function readWhere(where = '', rng) {
  const w = String(where).toLowerCase()
  let zone = /bow|stem|forecastle/.test(w) ? 0 : /forward|fore|turret 1|no\. 1|bridge|island/.test(w) ? 1 : /stern|quarterdeck|rudder/.test(w) ? 3 : /aft|after|turret 3|turret 4/.test(w) ? 2 : /amidships|midships|centre|center|funnel|uptake/.test(w) ? (rng.next() < 0.5 ? 1 : 2) : Math.floor(rng.next() * 4)
  zone = Math.max(0, Math.min(3, zone))
  const part = /waterline|below|underwater|hull bottom/.test(w) ? 'waterline' : /superstructure|bridge|director|mast|funnel|radar|tower|island|pagoda/.test(w) ? 'super' : /turret/.test(w) ? 'turret' : /flight deck|hangar|deck/.test(w) ? 'deck' : null
  const side = /port/.test(w) ? -1 : /starboard/.test(w) ? 1 : 0
  return { zone, part, side, uptake: /uptake|boiler|engine|machinery/.test(w), magazine: /magazine/.test(w) }
}

/** A new damage state for a ship model. navy: 'us' | 'jp'; year: the battle's. */
export function createDamage(model, navy, year) {
  const era = `${navy}-${Math.max(1941, Math.min(1944, year))}`
  return {
    regime: 'record',
    fight: 0,
    float: 0,
    list: 0,
    fires: [0, 0, 0, 0],
    fireDmg: [0, 0, 0, 0],
    H: 0,
    holes: [],
    doomed: false,
    doomedAt: null,
    doomedWhy: null,
    out: false,
    crippled: false,
    sinking: false,
    sinkAt: null,
    sinkHow: null,
    goneAt: null,
    rudderJam: null,
    engineStopUntil: 0,
    engineCap: 1,
    bowLost: false,
    systemsOut: new Set(),
    repairs: [],
    navy,
    year,
    fireOut: D.fireOut[era] ?? D.fireOut.default,
    patch: D.holePatch[navy] ?? D.holePatch.us,
    counter: D.counterflood[navy] ?? D.counterflood.us,
    hits: 0,
    lastHitT: -1e9,
    log: [],
  }
}

/** Damage control's efficiency falls with `fight`, to a floor. */
const dcEff = (st) => Math.max(D.dcFloor, 1 - 0.6 * Math.min(1, st.fight))
/** Against flooding it falls faster: pumps, power and the men to shore a bulkhead go with the fighting power. */
const floodEff = (st) => Math.max(D.dcFloor, 1 - 0.85 * Math.min(1, st.fight))

/**
 * One hit. h: { cls, part ('hull' | 'waterline' | 'super' | 'deck' | 'turret'),
 * zone, side (−1 port, +1 starboard), calibreMm, ap, rangeM, t }.
 * Returns a short description of what it did, for the beats.
 */
export function applyHit(st, model, h, rng) {
  const col = columnOf(model.type)
  const say = []
  let fight = 0
  let float = 0
  let fireP = 0
  let sysP = 0.2
  let hole = 0
  let list = 0
  const zone = h.zone ?? Math.floor(rng.next() * 4)
  const side = h.side || (rng.next() < 0.5 ? -1 : 1)
  const cls = h.cls
  if (cls === 'heavy') {
    const part = h.part === 'waterline' ? 'waterline' : h.part === 'super' ? 'super' : 'hull'
    const v = HEAVY[part][col]
    fight = v[0]
    float = v[1]
    hole = v[2]?.hole ?? 0
    sysP = v[2]?.sys ?? 0.15
    fireP = 0.12
    if (h.ap !== false && h.rangeM != null && h.rangeM < 10000 && (zone === 0 || zone === 1 || zone === 3) && part !== 'super' && col !== 'dd' && rng.next() < D.magazineChance) {
      st.float = 1
      st.fight = Math.max(st.fight, 1)
      say.push('magazine explosion')
      killNow(st, model, h.t, 'explodes', 45)
      return say.join(', ')
    }
  } else if (cls === 'medium') {
    const v = h.ap && MEDIUM_AP_OVER[col] ? MEDIUM_AP_OVER[col] : MEDIUM[col]
    fight = v[0]
    float = h.part === 'waterline' ? v[1] * 1.5 : v[1]
    hole = h.part === 'waterline' && col !== 'bb' ? 0.5 : 0
    fireP = 0.1
    sysP = h.part === 'super' ? 0.4 : 0.15
  } else if (cls === 'light' || cls === 'small') {
    const t = ((h.calibreMm ?? 127) - 127) / (155 - 127)
    const [a, b] = LIGHT[col]
    fight = lerp(a[0], b[0], t)
    float = h.part === 'waterline' ? lerp(a[1], b[1], t) : lerp(a[1], b[1], t) * 0.3
    if (cls === 'small') {
      fight *= 0.3
      float *= 0.2
    }
    fireP = cls === 'small' ? 0.01 : 0.04
    sysP = h.part === 'super' ? 0.25 : 0.08
  } else if (cls.startsWith('bomb')) {
    const v = BOMB[cls][col]
    fight = v[0]
    float = v[1]
    fireP = v[2]
    sysP = cls === 'bomb-100' ? 0.12 : 0.3
  } else if (cls.startsWith('torpedo')) {
    const v = TORPEDO[cls === 'torpedo-air' ? 'air' : cls === 'torpedo-mk15' ? 'mk15' : 't93'][col]
    fight = v[0]
    float = v[1]
    list = v[2]
    hole = cls === 'torpedo-air' ? 1.5 : 2
    sysP = 0.35
    fireP = 0.1
    if (cls === 'torpedo-mk15' && zone === 0 && (col === 'ca' || col === 'cve')) {
      st.bowLost = true
      say.push('bow blown off')
    }
  }
  st.fight += fight
  st.float += float
  st.hits++
  st.lastHitT = h.t ?? st.lastHitT
  if (hole > 0) {
    st.holes.push({ zone, side, size: hole, patched: false, work: 0, need: 0.6 + 0.8 * rng.next() })
    if (cls.startsWith('torpedo')) say.push('flooding')
  }
  if (list) st.list += side * list * (0.6 + 0.8 * rng.next())
  // a fire in the zone hit (carriers: their own fuel and ordnance)
  if (fireP > 0 && rng.next() < fireP) {
    if (!st.fires[zone]) say.push(model.carrier ? 'fire on the hangar deck' : 'on fire')
    st.fires[zone] = 1
  }
  // a system
  if (rng.next() < sysP) {
    const s = pickSystem(st, model, h, rng)
    if (s) say.push(s)
  }
  if (h.uptake && model.carrier && cls.startsWith('bomb')) {
    stopEngines(st, h.t, rng)
    say.push('boilers out')
  }
  update(st, model, h.t ?? 0)
  return say.join(', ')
}

function pickSystem(st, model, h, rng) {
  const t = h.t ?? 0
  const list = model.systems.filter((s) => !['searchlights'].includes(s))
  if (!list.length) return null
  // weights: a bomb or torpedo reaches the machinery more often than a shell
  const deep = h.cls?.startsWith('bomb') || h.cls?.startsWith('torpedo')
  const w = list.map((s) => (s === 'engines' ? (deep ? 2.5 : 1) : s === 'rudder' ? (h.zone === 3 ? 3 : 0.6) : s === 'bow' ? (h.zone === 0 && h.cls?.startsWith('torpedo') ? 3 : 0.1) : s === 'flight-deck' ? (h.cls?.startsWith('bomb') ? 3 : 0.5) : h.part === 'super' && /director|radar|bridge/.test(s) ? 3 : 1))
  let tot = w.reduce((a, b) => a + b, 0)
  let r = rng.next() * tot
  let s = list[0]
  for (let i = 0; i < list.length; i++) {
    r -= w[i]
    if (r <= 0) {
      s = list[i]
      break
    }
  }
  if (s === 'engines') {
    // a stop (boilers, uptakes; a repair) or a cap (one engine room)
    const pStop = deep ? 0.7 : 0.1
    if (rng.next() < pStop) {
      stopEngines(st, t, rng)
      return 'engines stopped'
    }
    st.engineCap = Math.min(st.engineCap, 0.47)
    return 'speed reduced'
  }
  if (s === 'rudder') {
    st.rudderJam = (rng.next() < 0.5 ? -1 : 1) * (10 + rng.next() * 25)
    st.repairs.push({ sys: 'rudder', at: t + rngIn(rng, D.systemRepairS) * 3 })
    return 'steering jammed'
  }
  if (s === 'bow') {
    st.bowLost = true
    return 'bow damaged'
  }
  st.systemsOut.add(s)
  st.repairs.push({ sys: s, at: t + rngIn(rng, D.systemRepairS) })
  return `${s.replace(/-/g, ' ')} out`
}

function stopEngines(st, t, rng) {
  st.engineStopUntil = Math.max(st.engineStopUntil, t + rngIn(rng, D.engineRepairS))
}

const rngIn = (rng, [a, b]) => a + (b - a) * rng.next()

function killNow(st, model, t, how, overS) {
  st.doomed = true
  st.doomedAt ??= t
  st.doomedWhy ??= how
  st.sinking = true
  st.sinkHow = how
  st.sinkAt = t
  st.goneAt = t + overS
}

/** Recompute the derived flags. */
function update(st, model, t) {
  st.crippled = st.fight >= model.crippledAt
  st.out = st.fight >= 1
}

/**
 * Advance a ship's damage by dt (the sim's regime only). ctx: { t, rng, H,
 * recordSinkT }. Returns events that happened: [{ kind, text }].
 */
export function stepDamage(st, model, dt, ctx) {
  const out = []
  if (st.sinking) {
    if (ctx.t >= st.goneAt && !st.gone) {
      st.gone = true
      out.push({ kind: 'gone' })
    }
    return out
  }
  const rng = ctx.rng
  const H = model.carrier ? (ctx.H ?? st.H ?? 0) : 0
  st.H = H
  const eff = dcEff(st)
  // fires
  let burning = 0
  for (let z = 0; z < 4; z++) {
    if (!st.fires[z]) continue
    burning++
    // a zone's fire does at most (0.06 + H) of `fight`: a carrier's own fuel and
    // ordnance are what make a fire run away (research/engine.md)
    const cap = D.fireZoneCap + (model.carrier ? H : 0)
    if (st.fireDmg[z] < cap) {
      const inc = Math.min(D.fireFight * (1 + 6 * H) * dt, cap - st.fireDmg[z])
      st.fireDmg[z] += inc
      st.fight += inc
    }
    const spread = model.carrier ? D.fireSpread.carrier * H : D.fireSpread.other
    for (const n of [z - 1, z + 1]) if (n >= 0 && n < 4 && !st.fires[n] && rng.next() < spread * dt) st.fires[n] = 1
    if (rng.next() < st.fireOut * eff * dt) st.fires[z] = 0
  }
  // holes: flooding and list until patched; counter-flooding against the list
  let listRate = 0
  const feff = floodEff(st)
  const progressive = 1 + D.progressiveFlood * st.float
  for (const h of st.holes) {
    if (h.patched) continue
    st.float += D.holeFlood * h.size * progressive * dt
    listRate += h.side * D.holeList * h.size
    // shoring a hole is work done at damage control's rate, not a coin tossed each second
    h.work += st.patch * feff * dt
    if (h.work >= h.need) h.patched = true
  }
  st.list += listRate * dt
  if (Math.abs(st.list) > 0.5 && !st.out) {
    const c = Math.min(Math.abs(st.list), st.counter * feff * dt)
    st.list -= Math.sign(st.list) * c
    st.float += c * 2e-4
  }
  // repairs
  for (const r of st.repairs) {
    if (r.done || ctx.t < r.at) continue
    r.done = true
    if (r.sys === 'rudder') st.rudderJam = null
    else st.systemsOut.delete(r.sys)
  }
  update(st, model, ctx.t)
  // doomed: three fire zones on a carrier with H ≥ 0.4, or flooding beyond saving
  if (!st.doomed) {
    if (model.carrier && burning >= D.doomedFires && H >= D.doomedH) {
      st.doomed = true
      st.doomedWhy = 'fires'
    } else if (st.float >= 0.92 || (Math.abs(st.list) >= D.abandonListDeg && listRate * Math.sign(st.list) > 0)) {
      st.doomed = true
      st.doomedWhy = 'flooding'
    }
    if (st.doomed) {
      st.doomedAt = ctx.t
      out.push({ kind: 'doomed', text: st.doomedWhy === 'fires' ? 'fires out of control' : 'flooding out of control' })
      const sinkS = model.carrier ? D.sinkAfterDoomedS.carrier : D.sinkAfterDoomedS.other
      st.sinkDue = ctx.recordSinkT != null && ctx.recordSinkT > ctx.t ? ctx.recordSinkT : ctx.t + rngIn(rng, sinkS)
    }
  }
  // the end: capsize past 35°, founder at float 1, or the doomed ship's hour
  if (Math.abs(st.list) >= D.capsizeListDeg) {
    killNow(st, model, ctx.t, 'capsizes', 150)
    out.push({ kind: 'sink', text: 'capsizes' })
  } else if (st.float >= 1) {
    killNow(st, model, ctx.t, 'founders', rngIn(rng, D.founderS))
    out.push({ kind: 'sink', text: 'sinks' })
  } else if (st.doomed && st.sinkDue != null && ctx.t >= st.sinkDue) {
    killNow(st, model, ctx.t, 'sinks', rngIn(rng, D.founderS))
    out.push({ kind: 'sink', text: 'sinks' })
  }
  return out
}

/** The ship's speed cap (fraction of top speed) from its damage. */
export function speedCap(st, model, t) {
  if (st.sinking || st.out) return 0
  if (t < st.engineStopUntil) return 0
  let c = st.engineCap
  if (st.crippled) c = Math.min(c, D.crippledSpeed)
  if (st.bowLost) c = Math.min(c, (D.bowLostKn * 0.514444) / model.vmax)
  if (st.float > 0.6) c = Math.min(c, 1 - st.float)
  return Math.max(0, c)
}

/** The share of a ship's fire it can still bring to bear (half the turrets out when crippled). */
export function gunShare(st) {
  if (st.out || st.sinking) return 0
  return st.crippled ? 0.5 : 1
}

/** A scalar 0..1 for the state arrays and the HUD. */
export function damageScalar(st) {
  return Math.max(0, Math.min(1, Math.max(st.fight * 0.75, st.float)))
}

export function fireScalar(st) {
  return (st.fires[0] + st.fires[1] + st.fires[2] + st.fires[3]) / 4
}
