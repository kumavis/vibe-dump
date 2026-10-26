// The arena's unit rows (ROUND-3.md §3: units() with round two's row shape,
// takeable always true for a friendly unit alive, the enemy's rows marked
// enemy), so the unit list, the card and the station bar work unchanged.
// now/next in the stops' voice, machines not people.

import { KN } from '../sim/units.js'
import { takeableOf, stationsOf } from './player.js'

const DEG = Math.PI / 180
const hdg = (d) => String(Math.round(((d % 360) + 360) % 360)).padStart(3, '0')
const height = (m, side) => (side === 'us' ? `${Math.round((m * 3.28084) / 100) * 100} ft`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : `${Math.round(m / 50) * 50} m`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))

export function unitRows(ar) {
  const s = ar.state
  const rows = []
  const pl = ar.player
  for (const u of ar.slots) {
    const i = u.index
    const x = ar._X[i]
    const a = s.alive[i]
    const enemy = u.side !== ar.side
    const row = {
      index: i,
      id: u.id,
      kind: u.kind,
      side: u.side,
      enemy,
      name: u.name,
      label: u.label,
      ja: u.ja,
      kit: u.kit,
      kitName: u.kitName,
      group: u.group,
      groupName: u.groupName,
      groupIndex: u.groupIndex,
      k: u.k,
      spare: false,
      alive: a,
      takeable: takeableOf(ar, i),
      stations: stationsOf(ar, i),
      held: !!pl && pl.unitIndex === i,
      authority: pl && pl.unitIndex === i ? 'player' : 'ai',
      now: '',
      next: '',
      state: null,
    }
    if (u.kind === 'ship') {
      const frac = x.hp / x.hpMax
      row.state = { afloat: a === 1, sinking: a === 2, sunk: a === 0, onFire: x.fire > 0 && a > 0, listing: Math.abs(x.list || 0) > 1 && a > 0, listDeg: Math.abs(x.list || 0), speedKn: s.speed[i] / KN, headingDeg: s.heading[i], damage: 1 - frac, hp: x.hp, hpMax: x.hpMax, aground: false }
      row.now = shipNow(ar, i, x, a)
      row.next = x.order?.kind === 'attack' ? 'then she rejoins the screen' : ''
    } else {
      row.state = { airborne: a === 1, falling: a === 2, onDeck: !!x.onDeck && x.hp > 0, altM: a ? s.pos[3 * i + 1] : 0, speedKn: a ? s.speed[i] / KN : 0, headingDeg: s.heading[i], fuelS: null, damage: 1 - Math.max(0, x.hp) / x.hpMax, parked: false, mission: x.mission?.kind ?? null }
      row.now = airNow(ar, i, x, a, u)
      row.next = x.onDeck && x.hp > 0 ? (ar.t < x.rearmAt ? 'rearming, then the next wave' : 'launches with the next wave') : ''
    }
    rows.push(row)
  }
  return rows
}

function shipNow(ar, i, x, a) {
  const s = ar.state
  if (a === 0) return 'sunk'
  if (a === 2) return 'going down'
  const parts = [s.speed[i] < 0.5 ? `stopped, heading ${hdg(s.heading[i])}°` : `steaming ${hdg(s.heading[i])}° at ${Math.round(s.speed[i] / KN)} kn`]
  if (x.fire > 0) parts.push('on fire')
  if (Math.abs(x.list || 0) > 1) parts.push(`listing ${Math.round(Math.abs(x.list))}°`)
  const o = x.order
  if (o?.kind === 'attack') parts.push(`going in with torpedoes at ${ar.slots[o.target]?.name ?? 'the enemy'}`)
  else if (o?.kind === 'smoke') parts.push('making smoke')
  else if (x.target >= 0 && s.alive[x.target] === 1) parts.push(`firing on ${ar.slots[x.target].name}`)
  return parts.join(', ')
}

function airNow(ar, i, x, a, u) {
  const s = ar.state
  if (a === 2 || (a === 0 && x.hp <= 0)) return 'did not return'
  if (a === 0) {
    const c = ar.slots[x.home]
    if (x.queued) return `on deck aboard ${c.name}, launching`
    return ar.t < x.rearmAt ? `rearming aboard ${c.name}` : `on deck aboard ${c.name}`
  }
  const m = x.mission
  const alt = height(s.pos[3 * i + 1], u.side)
  const tgt = m?.strike ? ar.slots[m.strike.target]?.name : null
  if (ar.player?.unitIndex === i && ar.player.station === 'pilot') return `flying ${hdg(s.heading[i])}° at ${alt}`
  switch (m?.kind) {
    case 'cap':
      return x.engage >= 0 ? `on combat air patrol, engaging ${articled(ar.slots[x.engage].kitName)}` : `on combat air patrol at ${alt}`
    case 'escort':
      return x.engage >= 0 ? `escorting the strike, engaging ${articled(ar.slots[x.engage].kitName)}` : `escorting the strike at ${alt}`
    case 'strike':
      if (m.phase === 'dive') return `on its dive on ${tgt}`
      if (m.phase === 'run' || m.phase === 'descend') return `on its torpedo run at ${tgt}`
      if (m.phase === 'egress') return `pulling away from ${tgt}`
      return `on its way to ${tgt} at ${alt}`
    case 'return':
      return `returning to ${ar.slots[x.home]?.name ?? 'the carriers'}`
    default:
      return `flying ${hdg(s.heading[i])}° at ${alt}`
  }
}

const articled = (w) => `${/^[AEIOU]/.test(w || '') ? 'an' : 'a'} ${w}`
export { DEG }
