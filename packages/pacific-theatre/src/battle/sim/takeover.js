// Any unit, any time, either side (ROUND-2.md §1.1, §2, §3): the stations a
// unit offers by rule from its kit (or the kit's `stations` override), whether
// it can be taken now and, when not, why in the unit list's three words, and
// what the record has it doing now and next in the voice of the stops. Pure
// reads of the sim's state and record: nothing here changes the battle.
//
// The words of a reason are the list's (§1.1): "fate is fixed", "hospital
// ship", "tokkō unit", "on the ground", "not yet airborne", and the same
// register for the rest of §2's cases ("flies the lead", "a named crew",
// "has landed", "did not return", "no longer afloat", "fate is sealed",
// "going down", "left the area", "not launched").

import { KN } from './units.js'
import { headingOf } from './path.js'

export const STATIONS = ['helm', 'main', 'aa', 'torpedoes', 'pilot', 'gunner', 'bombardier']
const SHIP_STATIONS = new Set(['helm', 'main', 'aa', 'torpedoes'])
const AIR_STATIONS = new Set(['pilot', 'gunner', 'bombardier'])
const GUNNER_TYPES = new Set(['torpedo', 'dive', 'level'])
const FIXED_POSITIONS = new Set(['nose', 'wing', 'cowl'])

export const REASONS = {
  fixed: 'fate is fixed',
  hospital: 'hospital ship',
  tokko: 'tokkō unit',
  parked: 'on the ground',
  notYet: 'not yet airborne',
  leader: 'flies the lead',
  named: 'a named crew',
  landed: 'has landed',
  lost: 'did not return',
  sunk: 'no longer afloat',
  sinking: 'going down',
  sealed: 'fate is sealed',
  left: 'left the area',
  cancelled: 'not launched',
  site: 'a site, not a unit',
  spare: 'not in the battle',
}

/** An aircraft model's rear guns: those the kit marks `arc: 'rear'`, else its flexible (not fixed-forward) guns. */
export function rearGunsOf(model) {
  const g = model?.guns || []
  const marked = g.filter((x) => x.arc === 'rear')
  return marked.length ? marked : g.filter((x) => !FIXED_POSITIONS.has(x.position ?? 'nose'))
}

/** Whether a group (or the kit, without one) flies level-bombing runs: the bombardier's station. */
export function levelBomber(model, group) {
  const prof = group?.attack?.profile
  if (prof) return prof === 'level'
  const t = model?.kit?.type
  return t === 'level' || (t === 'bomber' && (model.payload?.length ?? 0) > 0)
}

/** The stations a ship offers: helm, main if it has a main battery, aa if it has AA, torpedoes if it has tubes. */
export function shipStations(model) {
  const over = model?.kit?.stations
  if (Array.isArray(over) && over.length) {
    const s = over.filter((x) => SHIP_STATIONS.has(x))
    if (s.length) return s.includes('helm') ? s : ['helm', ...s]
  }
  const out = ['helm']
  if ((model?.batteries || []).some((b) => b.role === 'main')) out.push('main')
  if ((model?.aa || []).length) out.push('aa')
  if (model?.torp?.weapon) out.push('torpedoes')
  return out
}

/** The stations an aircraft offers: pilot; gunner with a crew of two or more and a rear gun; bombardier on a level bomber. */
export function aircraftStations(model, group) {
  const kit = model?.kit || {}
  const over = kit.stations
  if (Array.isArray(over) && over.length) {
    const s = over.filter((x) => AIR_STATIONS.has(x))
    if (s.length) return s.includes('pilot') ? s : ['pilot', ...s]
  }
  const out = ['pilot']
  const crew = kit.crew ?? 1
  const rear = model?.guns?.some((g) => g.arc === 'rear') || (GUNNER_TYPES.has(kit.type) && crew >= 2)
  if (crew >= 2 && rear && rearGunsOf(model).length) out.push('gunner')
  if (levelBomber(model, group)) out.push('bombardier')
  return out
}

/** The stations of slot i (a parked aircraft or a free slot offers none). */
export function stationsOf(sim, i) {
  const u = sim.slots[i]
  const x = sim._X[i]
  if (!u || !x?.model || u.authority === 'free') return []
  if (u.kind === 'ship') return shipStations(x.model)
  if (u.parked) return []
  return aircraftStations(x.model, x.g || (u.groupIndex >= 0 ? sim.record.groups[u.groupIndex] : null))
}

/**
 * Whether slot i can be taken at sim.t: true, or the reason it cannot (§2).
 * The player's own unit is takeable (it is held).
 */
export function takeability(sim, i) {
  const u = sim.slots[i]
  const x = sim._X[i]
  const s = sim.state
  if (!u || u.authority === 'free' || (x.spare && !x.wasSpare)) return REASONS.spare
  if (sim.player && sim.player.unitIndex === i) return true
  if (u.kind === 'ship') {
    const r = x.rec
    if (r?.raw?.takeable === false) return r.raw.why || REASONS.sealed
    if (r?.fixed) return REASONS.fixed
    if (r?.hospital || x.model?.hospital) return REASONS.hospital
    if (r?.tokko || u.tokko || x.model?.tokko) return REASONS.tokko
    if (s.alive[i] === 0) return REASONS.sunk
    if (s.alive[i] === 2) return REASONS.sinking
    if (pastFate(sim, i)) return REASONS.sealed
    return true
  }
  // an aircraft
  if (u.parked) return REASONS.parked
  if (u.tokko || x.model?.tokko || x.g?.raw?.tokko) return REASONS.tokko
  const g = x.g
  if (g?.raw?.namedCrews) return REASONS.named
  if (g && x.ac?.k === 0) return REASONS.leader
  if (g && sim._cancelled.has(g.index)) return REASONS.cancelled
  if (s.alive[i] === 2) return REASONS.lost
  if (s.alive[i] === 0) return goneReason(sim, i)
  return true
}

/** Why an aircraft not in the air is not: before its take-off, lost, landed or out of the box. */
function goneReason(sim, i) {
  const x = sim._X[i]
  const t = sim.t
  if (x.lostAt != null || x.how === 'lost' || x.how === 'ditched') return REASONS.lost
  if (x.how === 'landed') return REASONS.landed
  const ac = x.ac
  if (!ac) return REASONS.left
  if (t < ac.spawnT) return REASONS.notYet
  if (ac.lossT != null && t >= ac.lossT && !x.spared) return REASONS.lost
  if (ac.endHow === 'land' && t >= ac.endT) return REASONS.landed
  return REASONS.left
}

/** A ship past her fate: the record's damage at or past her kit's fatal, or the sim's foundering, sinking or doom. */
export function pastFate(sim, i) {
  const x = sim._X[i]
  const d = x.dmg
  const fatal = x.model?.fatal ?? 1
  if (d?.regime === 'sim') return !!(d.sinking || d.float >= 1 || (d.doomed && d.doomedWhy !== 'record'))
  return (x.rd?.damage ?? 0) >= fatal
}

// --- now and next, in the voice of the stops ----------------------------------------------------

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const words = (n) => NUM[n] ?? String(n)
const hdg = (d) => `${String(Math.round(((d % 360) + 360) % 360)).padStart(3, '0')}°`
const grouped = (n) => Math.round(n).toLocaleString('en')

/** A height in the side's own units: feet for the US, metres for Japan (the HUD's convention). */
function height(side, m) {
  if (side === 'jp') return `${grouped(Math.round(m / 50) * 50)} m`
  return `${grouped(Math.round((m * 3.28084) / 100) * 100)} ft`
}

/** A record event's line for the card, in the stops' voice: its own text where it has one. */
function eventPhrase(sim, r, ev) {
  if (ev.text) return ev.text
  const name = r.name
  const target = ev.target ? sim.record.shipById.get(ev.target)?.name : null
  const one = Array.isArray(ev.count) && ev.count[0] === ev.count[1] ? ev.count[0] : null
  switch (ev.kind) {
    case 'hit':
      return `${name} is hit${ev.where ? ` (${ev.where})` : ''}.`
    case 'torpedo-hit':
      return `${name} is hit by ${one === 1 ? 'a torpedo' : one ? `${words(one)} torpedoes` : 'torpedoes'}${ev.where ? ` (${ev.where})` : ''}.`
    case 'near-miss':
      return `${name} is near-missed.`
    case 'fire':
      return `${name} is on fire.`
    case 'flood':
      return `${name} is flooding.`
    case 'list':
      return `${name} lists.`
    case 'explodes':
      return `An explosion shakes ${name}.`
    case 'sinks':
      return `${name} sinks.`
    case 'scuttled':
      return `${name} is scuttled.`
    case 'abandoned':
      return `${name} is abandoned.`
    case 'launches':
      return `${name} launches aircraft.`
    case 'recovers':
      return `${name} recovers aircraft.`
    case 'turns':
      return `${name} turns.`
    case 'opens-fire':
      return `${name} opens fire${target ? ` on ${target}` : ''}.`
    case 'ceases-fire':
      return `${name} ceases fire.`
    case 'torpedoes-fired':
      return `${name} fires torpedoes${target ? ` at ${target}` : ''}.`
    case 'smoke-screen':
      return `${name} makes smoke.`
    case 'searchlight':
      return `${name} turns a searchlight on${target ? ` ${target}` : ''}.`
    case 'illuminated':
      return `${name} is illuminated.`
    case 'starshell':
      return `${name} fires star shell.`
    case 'steering-jammed':
      return `${name}’s steering jams.`
    case 'power-failure':
      return `${name} loses power.`
    case 'radar-lost':
      return `${name}’s radar is out.`
    case 'dead-in-water':
      return `${name} is dead in the water.`
    case 'withdraws':
      return `${name} withdraws.`
    case 'aground':
      return `${name} runs aground.`
    case 'sighted':
      return `${name} sights ships.`
    case 'collision':
      return `${name} is in a collision.`
    default:
      return null
  }
}

const moored = (r) => !!r.track && r.track.length > 0 && r.track.every((f) => (f.speed ?? 0) < 0.3)

/** A ship's now, next and state. */
function shipNow(sim, i) {
  const x = sim._X[i]
  const r = x.rec
  const s = sim.state
  const L = (t) => sim.clock.label(t)
  const a = s.alive[i]
  const kn = s.speed[i] / KN
  const fires = x.dmg?.regime === 'sim' ? x.dmg.fires.reduce((p, v) => p + (v > 0 ? 1 : 0), 0) : x.rd?.fires ?? 0
  const list = Math.abs(s.list[i])
  const state = { afloat: a === 1, sinking: a === 2, sunk: a === 0, onFire: fires > 0, listing: list >= 3, listDeg: +list.toFixed(1), speedKn: +kn.toFixed(1), headingDeg: Math.round(s.heading[i]), damage: +s.damage[i].toFixed(2), aground: !!x.body?.aground }
  let now
  if (a === 0) {
    const at = x.sunkAt ?? x.dmg?.goneAt ?? r?.sinkT
    now = at != null ? `sank at ${L(at)}` : 'sank'
  } else if (a === 2) now = 'going down'
  else {
    const parts = []
    if (x.body?.aground) parts.push('aground')
    else if (kn < 0.5) parts.push(moored(r) ? 'moored' : `stopped, heading ${hdg(s.heading[i])}`)
    else parts.push(`steaming ${hdg(s.heading[i])} at ${Math.round(kn)} kn`)
    if (fires) parts.push('on fire')
    if (list >= 3) parts.push(`listing ${Math.round(list)}°`)
    now = parts.join(', ')
  }
  // next: the record's next event with words, or else its next turn
  let next = ''
  const end = sim.clock.duration
  for (const ev of r?.events || []) {
    if (ev.t > end) break
    if (ev.t <= sim.t || ev.hud === false) continue
    const p = eventPhrase(sim, r, ev)
    if (!p) continue
    next = `At ${L(ev.t)}: ${p}`
    break
  }
  if (!next && r?.track && a === 1) {
    for (let k = 0; k < r.track.length; k++) {
      const f = r.track[k]
      if (f.t <= sim.t) continue
      if (f.t > end) break
      const prev = r.track[k - 1]
      const dc = prev ? Math.abs((((f.course - prev.course) % 360) + 540) % 360 - 180) : 0
      if (dc >= 10) {
        next = `At ${L(f.t)}: ${r.name} comes to ${hdg(f.course)}.`
        break
      }
    }
  }
  return { now, next, state }
}

// how long before its release an aircraft is "on its run" (the plans' approaches, record.js buildGroup)
const RUN_S = { dive: 60, torpedo: 90, level: 60, strafe: 30 }
const PROFILE_NOW = {
  dive: (tgt) => `in its dive on ${tgt}`,
  torpedo: (tgt) => `on its torpedo run at ${tgt}`,
  level: (tgt) => `on its bombing run over ${tgt}`,
  strafe: (tgt) => `strafing ${tgt}`,
}

/** An aircraft's now, next and state, from its group's plan and actions. */
function aircraftNow(sim, i) {
  const x = sim._X[i]
  const u = sim.slots[i]
  const s = sim.state
  const L = (t) => sim.clock.label(t)
  const g = x.g || (u.groupIndex >= 0 ? sim.record.groups[u.groupIndex] : null)
  const ac = x.ac
  const t = sim.t
  const a = s.alive[i]
  const alt = s.pos[3 * i + 1]
  const body = x.body
  const state = { airborne: a === 1 && !u.parked, falling: a === 2, altM: Math.round(alt), speedKn: +(s.speed[i] / KN).toFixed(0), headingDeg: Math.round(s.heading[i]), fuelS: body ? Math.round(body.fuelS) : x.model?.enduranceS ?? null, damage: +s.damage[i].toFixed(2), parked: !!u.parked }
  const from = g && g.from >= 0 ? sim.record.ships[g.from]?.name : g?.fromSite?.name ?? null
  const home = g?.recover?.to >= 0 ? sim.record.ships[g.recover.to]?.name : from
  const tgtName = (unit) => (unit >= 0 ? sim.record.ships[unit]?.name : null) || g?.attack?.targetSite?.name || g?.attack?.targets?.[0]?.site?.name || 'the target'
  const prof = g?.attack?.profile
  if (u.parked) return { now: `on the ground${from ? ` at ${from}` : ''}`, next: '', state }
  let now
  if (a === 0) {
    const why = goneReason(sim, i)
    if (why === REASONS.notYet) now = `not yet airborne${from ? `; on ${from}` : ''}`
    else if (why === REASONS.landed) now = `landed${home ? ` aboard ${home}` : ''}`
    else now = why
  } else if (a === 2) now = 'did not return'
  else if (ac) {
    const rel = ac.releaseT
    const landing = (ac.actions || []).find((q) => q.kind === 'land' && q.t > t && q.t - t < 120)
    if (landing) now = `coming in to land${landing.unit >= 0 ? ` aboard ${sim.record.ships[landing.unit]?.name}` : home ? ` at ${home}` : ''}`
    else if (rel != null && t < rel && t > rel - (RUN_S[prof] ?? 60) && PROFILE_NOW[prof]) now = PROFILE_NOW[prof](tgtName(ac.target))
    else if (prof === 'cap' && (rel == null || t < ac.endT)) now = `on combat air patrol at ${height(u.side, alt)}`
    else if (prof === 'escort') now = `escorting ${sim.record.groups[g.attack.targetGroup]?.name ?? 'its strike'} at ${height(u.side, alt)}`
    else if (rel != null && t >= rel) now = home ? `returning to ${home} at ${height(u.side, alt)}` : `withdrawing at ${height(u.side, alt)}`
    else now = `flying ${hdg(s.heading[i])} at ${height(u.side, alt)}`
  } else now = `flying ${hdg(s.heading[i])} at ${height(u.side, alt)}`
  // next: the plan's next action
  let next = ''
  if (ac && a !== 2) {
    if (a === 0 && t < ac.spawnT) next = g?.enter ? `At ${L(ac.spawnT)} it enters the area.` : `At ${L(ac.spawnT)} it takes off${from ? ` from ${from}` : ''}.`
    else {
      const acts = [...(ac.actions || [])].filter((q) => q.t > t && q.t <= sim.clock.duration).sort((p, q) => p.t - q.t)
      const q = acts[0]
      if (q) {
        const tg = tgtName(q.target)
        if (q.kind === 'release') next = `At ${L(q.t)} it releases its bomb${q.level ? ' over' : ' on'} ${tg}.`
        else if (q.kind === 'drop') next = `At ${L(q.t)} it drops its torpedo at ${tg}.`
        else if (q.kind === 'strafe') next = `At ${L(q.t)} it strafes ${q.site ? sim.record.siteById.get(q.site)?.name ?? tg : tg}.`
        else if (q.kind === 'land') next = `At ${L(q.t)} it lands${q.unit >= 0 ? ` aboard ${sim.record.ships[q.unit]?.name}` : home ? ` at ${home}` : ''}.`
      } else if (Number.isFinite(ac.endT) && ac.endT > t && ac.endHow !== 'land') next = `At ${L(ac.endT)} it leaves the area.`
    }
  }
  return { now, next, state }
}

/** The kit's short name for the card ("Zero", "Dauntless", "Fletcher class"). */
export function kitShort(model, short = {}) {
  const k = model?.kit
  if (!k) return ''
  if (model.kind === 'aircraft') return short[k.id] ?? k.name ?? k.id
  return k.class ? `${k.class} class` : k.name ?? k.id
}

/**
 * sim.units(): one row per unit the list can show, ships first (in the
 * record's order), then the air groups' aircraft (group by group), then the
 * parked aircraft, then a spare the player holds. Cheap: the static part of
 * each row is built once per slot.
 */
export function unitRows(sim, cache, short) {
  const out = []
  const X = sim._X
  const order = cache.order || (cache.order = buildOrder(sim))
  for (const i of order) out.push(row(sim, i, cache, short))
  // a spare in use (the player's, or a saved carrier's strike)
  for (let i = 0; i < sim.capacity; i++) if (X[i].wasSpare && sim.slots[i].authority !== 'free' && !order.includes(i)) out.push(row(sim, i, cache, short))
  return out
}

function buildOrder(sim) {
  const ships = []
  const parked = []
  for (const r of sim.record.ships) (sim.slots[r.slot].kind === 'ship' ? ships : parked).push(r.slot)
  const air = []
  for (const g of sim.record.groups) for (const ac of g.aircraft) if (ac.slot != null) air.push(ac.slot)
  return [...ships, ...air, ...parked]
}

function row(sim, i, cache, short) {
  const u = sim.slots[i]
  const x = sim._X[i]
  let st = cache.rows[i]
  if (!st || st.version !== sim.state.version[i] || st.id !== u.id) {
    const g = x.g || (u.groupIndex >= 0 ? sim.record.groups[u.groupIndex] : null)
    st = cache.rows[i] = {
      version: sim.state.version[i],
      id: u.id,
      kind: u.kind,
      side: u.side,
      name: u.name,
      label: u.kind === 'aircraft' && !u.parked ? cache.airName(i) : u.name,
      ja: u.ja ?? (u.kind === 'ship' ? x.rec?.ja ?? null : g?.raw?.ja ?? null),
      kit: u.kit,
      kitName: kitShort(x.model, short),
      group: u.kind === 'aircraft' && g ? g.id : u.group ?? null,
      groupName: g?.name ?? null,
      groupIndex: x.ac ? x.ac.k : -1,
      stations: stationsOf(sim, i),
    }
  }
  const d = u.kind === 'ship' ? shipNow(sim, i) : aircraftNow(sim, i)
  return {
    index: i,
    id: st.id,
    kind: st.kind,
    side: st.side,
    name: st.name,
    label: st.label,
    ja: st.ja,
    kit: st.kit,
    kitName: st.kitName,
    group: st.group,
    groupName: st.groupName,
    groupIndex: st.groupIndex,
    k: st.groupIndex, // (ui-2's name for it: link.js memberOf)
    spare: !!x.wasSpare, // a namedCrews group's spare (ui-2's card words it so)
    alive: sim.state.alive[i],
    takeable: takeability(sim, i),
    stations: st.stations,
    now: d.now,
    next: d.next,
    state: d.state,
    held: !!(sim.player && sim.player.unitIndex === i),
    authority: u.authority,
  }
}

/** The bearing and range from slot i to slot j (for the HUD's lines). */
export function bearingTo(sim, i, j) {
  const s = sim.state
  const dx = s.pos[3 * j] - s.pos[3 * i]
  const dz = s.pos[3 * j + 2] - s.pos[3 * i + 2]
  return { bearing: headingOf(dx, dz), range: Math.hypot(dx, dz) }
}
