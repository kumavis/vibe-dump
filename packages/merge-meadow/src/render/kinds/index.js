// The open registry of representation kinds (design §8). Each kind is
//   { schema, defaults, create(data, ctx), update(obj, data, prev, ctx) -> false | void,
//     dispose(obj, ctx), anchors?(obj) -> { seat?, head? }, animate?(obj, state, mapping, dt) }
// ctx = { res, entity, assets: () => doc.assets, changed(obj) }.
// update() returning false means "cannot patch this in place": the reconciler
// disposes and recreates the child. Everything a kind acquires goes through
// ctx.res and is released by the reconciler, so dispose() only frees what is
// per-instance (mixers, skeletons).
import billboard from './billboard.js'
import primitive from './primitive.js'
import tree from './tree.js'
import model from './model.js'
import critter from './critter.js'
import PLACEHOLDER from './placeholder.js'

export const KINDS = { billboard, primitive, tree, model, critter }
export { PLACEHOLDER }

const listeners = new Set()
export function registerKind (name, handler) {
  if (!/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(String(name))) throw new TypeError('bad kind name ' + JSON.stringify(name))
  for (const f of ['create', 'update', 'dispose']) if (typeof handler?.[f] !== 'function') throw new TypeError(`kind ${name} needs ${f}()`)
  KINDS[name] = handler
  for (const fn of listeners) { try { fn(name) } catch (e) { console.error('[kinds]', e) } }
  return handler
}
// the reconciler listens so placeholders of a just-registered kind upgrade in place
export function onKindRegistered (fn) { listeners.add(fn); return () => listeners.delete(fn) }

const copy = (v) => (v == null || typeof v !== 'object' ? v : Array.isArray(v) ? v.map(copy) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])))
// a fresh, complete representation of `name` (what a kind switch starts from)
export function kindDefaults (name) {
  const k = KINDS[name]
  return k ? { ...copy(k.defaults ?? {}), kind: name } : null
}
