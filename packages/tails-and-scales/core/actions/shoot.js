// Shooting's rules: who may shoot, at whom, and at what odds. (Its read-only
// half; the volley itself is still main.js's doShoot, awaited by its dice and
// animations, until R5 makes it synchronous here.)
import { hitNeed } from '../rules.js'
import { alive, enemiesOf, gap, isEngaged, sight } from '../queries.js'

export function canShoot(G, u) {
  const w = u.t.ranged
  if (!w || !alive(u) || u.flags.shot) return false
  if (u.mesmerized || u.flags.fellBack || isEngaged(G, u)) return false
  if (u.flags.advanced && !w.assault) return false
  return true
}

export function shotInfo(G, u, target) {
  const w = u.t.ranged
  const range = gap(u, target)
  if (range > w.range) return { ok: false, why: `out of range (${range.toFixed(1)}" / ${w.range}")` }
  if (isEngaged(G, target) && !w.spell) return { ok: false, why: 'locked in combat' }
  const s = sight(G, u, target)
  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }
  let mod = 0
  if (w.heavy && u.flags.moved) mod++
  if (w.indirect && !s.visible) mod++
  return { ok: true, range, ...s, mod, need: hitNeed(u.t.BS, mod) }
}

export function shootTargets(G, u) {
  if (!canShoot(G, u)) return []
  return enemiesOf(G, u).filter((e) => shotInfo(G, u, e).ok)
}
