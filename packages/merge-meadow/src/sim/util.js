// Small helpers shared by the built-in systems.
import { plain } from '../doc/convert.js'
import { hp as ledgerHp } from '../doc/read.js'

export const len = (x, z) => Math.hypot(x, z)
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2])
export const rid = (v) => (v == null ? '' : String(plain(v)))
export const DEG = Math.PI / 180
export const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

// The owned members of a query, sorted by id. Query sets keep insertion order,
// which differs between peers; behaviour must not, so every system iterates this.
const cache = new WeakMap()
export function owned (world, set) {
  let c = cache.get(set)
  if (c && c.tick === world.tickCount && c.n === set.size) return c.list
  const list = []
  for (const e of set) if (world.owns(e.id)) list.push(e)
  list.sort(byId)
  cache.set(set, (c = { tick: world.tickCount, n: set.size, list }))
  return list
}

// hp of any entity: the doc ledger plus, for local entities (players), hits
// recorded in live (they are not in the doc, so nobody can write a ledger for them)
export function hpOf (e) {
  const h = e?.c?.health
  if (!h) return null
  const base = ledgerHp(h)
  const extra = e.live?.hits
  if (!extra) return base
  const armor = Number(plain(h.armor) ?? 0)
  let d = 0
  for (const k of Object.keys(extra)) if (!(h.hits && k in h.hits)) d += Math.max(0, extra[k] - armor)
  return Math.max(0, base - d)
}

export const isDead = (e) => !!e?.c?.tags?.dead
export const ridingId = (e) => rid(e?.c?.rider?.mount)
export function initLive (e, t) {
  const p = Array.isArray(t?.p) ? t.p : [0, 0, 0]
  const l = e.live
  l.p = [Number(p[0]) || 0, Number(p[1]) || 0, Number(p[2]) || 0]
  l.v = l.v ?? [0, 0, 0]
  l.yaw = ((Number(t?.r?.[1]) || 0) * DEG)
  l.cooldown = l.cooldown ?? 0
  l.wanderA = l.wanderA ?? l.yaw
  l.anim = l.anim ?? 'idle'
}
