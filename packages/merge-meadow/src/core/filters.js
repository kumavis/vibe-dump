// Structured filters (design §3.3), compiled once per filter object. Doc data is
// frozen and keeps identity while unchanged, so the WeakMap cache hits every tick.
//   { tags, anyTags, notTags, has, not, relation, notRelation, where: [{path, of, lt|lte|gt|gte|eq|ne}], any: [Filter] }
// `other` is the candidate, `self` the entity asking. where-paths are key lists
// rooted at a component name or at $hp / $live / $id.
import { plain } from '../doc/convert.js'
import { hp } from '../doc/read.js'

const rid = (v) => (v == null ? '' : String(plain(v)))

export const RELATIONS = Object.freeze({
  // derived on the fly; only rider.mount is ever stored (design §3.3)
  targetsMe: (self, other) => !!other.live?.intent && other.live.intent.target === self.id,
  myRider: (self, other) => rid(other.c?.rider?.mount) === self.id,
  myMount: (self, other) => rid(self.c?.rider?.mount) === other.id && other.id !== '',
  isMounted: (self, other) => rid(other.c?.rider?.mount) !== '',
})

const list = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v]).map((x) => String(plain(x))))

export function readPath (entity, path) {
  if (!entity) return undefined
  const p = plain(path)
  const root = p[0]
  let v
  let i = 1
  if (root === '$hp') return entity.c?.health ? hp(entity.c.health) : undefined
  if (root === '$id') return entity.id
  if (root === '$live') v = entity.live
  else { v = entity.c?.[root]; i = 1 }
  for (; i < p.length && v != null; i++) v = v[p[i]]
  return plain(v)
}

function compileWhere (w) {
  const op = ['lt', 'lte', 'gt', 'gte', 'eq', 'ne'].find((k) => k in w)
  const subj = w.of === 'self' ? 'self' : 'other'
  const path = plain(w.path)
  const rhs = w[op]
  const val = rhs !== null && typeof rhs === 'object' && !Array.isArray(rhs)
    ? ((ctx) => { const x = readPath(rhs.of === 'other' ? ctx.other : ctx.self, rhs.path); return typeof x === 'number' && rhs.mul != null ? x * rhs.mul : x })
    : (() => plain(rhs))
  return (ctx) => {
    const a = readPath(ctx[subj], path)
    const b = val(ctx)
    if (a === undefined || b === undefined) return false
    switch (op) {
      case 'lt': return a < b
      case 'lte': return a <= b
      case 'gt': return a > b
      case 'gte': return a >= b
      case 'eq': return a === b
      case 'ne': return a !== b
    }
    return false
  }
}

const cache = new WeakMap()
const TRUE = () => true

export function compileFilter (filter) {
  if (filter == null) return TRUE
  if (typeof filter !== 'object') throw new TypeError('filter must be an object')
  const hit = cache.get(filter)
  if (hit) return hit
  const tests = []
  const tags = list(filter.tags); const anyTags = list(filter.anyTags); const notTags = list(filter.notTags)
  const has = list(filter.has); const not = list(filter.not)
  if (tags.length) tests.push(({ other }) => { const t = other.c.tags; return !!t && tags.every((k) => t[k]) })
  if (anyTags.length) tests.push(({ other }) => { const t = other.c.tags; return !!t && anyTags.some((k) => t[k]) })
  if (notTags.length) tests.push(({ other }) => { const t = other.c.tags; return !t || !notTags.some((k) => t[k]) })
  if (has.length) tests.push(({ other }) => has.every((k) => other.c[k] != null))
  if (not.length) tests.push(({ other }) => !not.some((k) => other.c[k] != null))
  for (const r of list(filter.relation)) {
    const f = RELATIONS[r]; if (!f) throw new TypeError(`unknown relation ${r}`)
    tests.push(({ self, other }) => f(self, other))
  }
  for (const r of list(filter.notRelation)) {
    const f = RELATIONS[r]; if (!f) throw new TypeError(`unknown relation ${r}`)
    tests.push(({ self, other }) => !f(self, other))
  }
  for (const w of filter.where ?? []) tests.push(compileWhere(w))
  if (Array.isArray(filter.any) && filter.any.length) {
    const alts = filter.any.map(compileFilter)
    tests.push((ctx) => alts.some((f) => f(ctx)))
  }
  const fn = tests.length === 0 ? TRUE : tests.length === 1 ? tests[0] : (ctx) => { for (const t of tests) if (!t(ctx)) return false; return true }
  cache.set(filter, fn)
  return fn
}

export const matches = (filter, self, other, world) => compileFilter(filter)({ self, other, world })
