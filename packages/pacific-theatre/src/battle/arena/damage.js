// The arena's damage (ROUND-3.md §3 "Damage"): hit points by type, a fixed
// damage per weapon, fire under half, a list under a quarter, sinking at zero
// over twenty seconds; an aircraft goes down at its hit points (one hit, a
// fighter two bursts). A hit on a ship already going down registers nothing.
// The words a hit leaves are machine words at the target ("Kumano: hit
// forward, fire"), never a count of people (DESIGN.md §7.4).

import { A } from './params.js'
import { FX } from '../sim/effects.js'

/** A ship's hit points by type (contract: escort carrier 10, destroyer 6, cruiser 14, battleship 30, fleet carrier 18). */
export const shipHp = (model) => A.hp[model.type] ?? A.hp.default

/** A shell's damage by calibre (contract: 16"/18" 4, 14" 3, 8" 2, 5"/6" 1); smaller rounds register nothing on a ship. */
export function shellDamage(calibreMm) {
  if (calibreMm >= 400) return 4
  if (calibreMm >= 330) return 3
  if (calibreMm >= 190) return 2
  if (calibreMm >= 100) return 1
  return 0
}

export const WEAPON_DAMAGE = { bomb: 2, torpedo: 5 }

const WHERE = ['forward', 'amidships', 'amidships', 'aft']

/** The zone a local hit point falls in (lz from amidships, toward the stern). */
export const zoneWord = (model, lz) => WHERE[Math.max(0, Math.min(3, Math.floor((lz / model.L + 0.5) * 4)))]

/**
 * A hit on ship i: dmg hit points; info { by (slot or −1), weapon ('shell' |
 * 'bomb' | 'torpedo'), lz, lx (the local point), calibreMm, magazine }. Returns
 * null when the hit registers nothing (a ship going down or gone), else { said,
 * sank, where, text }.
 */
export function hitShip(ar, i, dmg, info) {
  const s = ar.state
  const x = ar._X[i]
  if (s.alive[i] !== 1 || x.hp <= 0) return null
  const u = ar.slots[i]
  const m = x.model
  const before = x.hp
  const where = info.weapon === 'torpedo' ? 'amidships' : zoneWord(m, info.lz ?? 0)
  let magazine = false
  if (info.weapon === 'shell' && (info.calibreMm ?? 0) >= 330 && ar.rngs.dmg.next() < A.magazineP) magazine = true
  x.hp = magazine ? 0 : Math.max(0, x.hp - dmg)
  x.lastHitBy = info.by ?? -1
  x.lastHitT = ar.t
  x.hits = (x.hits || 0) + 1
  const frac = x.hp / x.hpMax
  let said = null
  if (x.hp <= 0) said = magazine ? 'magazine' : 'going down'
  else if (frac < A.listAt && before / x.hpMax >= A.listAt) {
    said = 'listing'
    x.list = (info.lx != null && info.lx < 0 ? -1 : 1) * ar.rngs.dmg.uniform(A.listDeg[0], A.listDeg[1])
  } else if (frac < A.fireAt && before / x.hpMax >= A.fireAt) {
    said = 'fire'
    x.fire = 1
  }
  if (frac < A.fireAt) x.fire = Math.max(x.fire, 0.6 + 0.4 * (1 - frac / A.fireAt))
  const kind = info.weapon === 'torpedo' ? 'torpedo hit' : info.weapon === 'bomb' ? 'bomb hit' : 'hit'
  const text = magazine ? `${u.name}: a magazine explodes` : `${u.name}: ${kind} ${where}${said && said !== 'going down' ? `, ${said}` : said === 'going down' ? ', going down' : ''}`
  const o = 3 * i
  if (info.weapon === 'torpedo') ar.fx(FX.splash, s.pos[o], 0, s.pos[o + 2], { unit: i, size: 70 })
  if (magazine) ar.fx(FX.explode, s.pos[o], 20, s.pos[o + 2], { unit: i, size: 5 })
  if (x.hp <= 0) startSinking(ar, i, info.by ?? -1, magazine)
  return { said, sank: x.hp <= 0, where, text, magazine, kind }
}

/** Ship i goes down: alive 2 for twenty seconds (the scene's sinking animation), then gone. */
export function startSinking(ar, i, by, magazine = false) {
  const s = ar.state
  const x = ar._X[i]
  if (s.alive[i] !== 1) return
  x.hp = 0
  x.sinkT = ar.t
  x.sinkDur = magazine ? A.sinkS * 0.6 : A.sinkS
  x.sinkBy = by
  x.magazine = magazine
  x.fire = 1
  if (!x.list) x.list = (ar.rngs.dmg.next() < 0.5 ? -1 : 1) * A.listDeg[0]
  x.trim = ar.rngs.dmg.next() < 0.5 ? -1 : 1
  ar._setAlive(i, 2)
  const o = 3 * i
  ar.fx(FX.sink, s.pos[o], 0, s.pos[o + 2], { unit: i, size: x.model.L })
  ar._onSinking(i, by, magazine)
}

/**
 * A hit on aircraft i (one burst, one AA hit, one gunner's hit): its hit
 * points down by `amount`; at none it goes down. by: the slot that hit it (or
 * −1), how: 'guns' | 'aa' | 'gunner'. Returns 'down' | 'hit' | null.
 */
export function hitAircraft(ar, i, amount, by, how) {
  const s = ar.state
  const x = ar._X[i]
  if (s.alive[i] !== 1) return null
  x.hp -= amount
  x.lastHitBy = by
  const o = 3 * i
  if (x.hp > 0.001) {
    ar.fx(FX.smoke, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i, size: 0.4 })
    ar._onAircraftHit(i, by, how, false)
    return 'hit'
  }
  x.hp = 0
  x.fallT = ar.t
  ar._setAlive(i, 2)
  ar.fx(FX.fall, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i, data: 1 })
  ar._onAircraftHit(i, by, how, true)
  return 'down'
}
