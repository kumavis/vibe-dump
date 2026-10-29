// Conversions between plain JSON and what the doc stores. Kept apart from read.js
// so presets.js, ops.js and read.js can all use them without a module cycle.
import { ImmutableString, Counter } from '@automerge/automerge/slim'

export const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) &&
  !(v instanceof ImmutableString) && !(v instanceof Counter)

// Deep copy out of the doc: Counter -> number, ImmutableString -> string (Text is
// already a JS string in Automerge 3). instanceof, never constructor.name: names
// do not survive minification.
export function plain (v) {
  if (v == null || typeof v !== 'object') return v
  if (v instanceof ImmutableString) return String(v.val)
  if (v instanceof Counter) return v.value
  if (Array.isArray(v)) return v.map(plain)
  if (v instanceof Uint8Array) return new Uint8Array(v)
  if (v instanceof Date) return new Date(v.getTime())
  const o = {}
  for (const k of Object.keys(v)) o[k] = plain(v[k])
  return o
}

// Plain JSON -> doc value. Every string becomes an ImmutableString: component data
// is enums, ids, colours and URLs, and a plain string is collaborative Text whose
// concurrent edits interleave ("T-Rexy") and which arrives as put "" + splice.
// The one deliberate Text in the schema (systems[*].source) never comes through here.
export function toDoc (v) {
  if (typeof v === 'string') return new ImmutableString(v)
  if (v == null || typeof v !== 'object') return v
  if (v instanceof ImmutableString || v instanceof Counter) return v
  if (Array.isArray(v)) return v.map(toDoc)
  const o = {}
  for (const [k, x] of Object.entries(v)) if (x !== undefined) o[k] = toDoc(x)
  return o
}

// Scalar equality across doc and plain representations.
export const sameScalar = (a, b) => plain(a) === plain(b)

// Deep equality that treats ImmutableString and string as equal (plain view).
export function deepEqualPlain (a, b) {
  if (a === b) return true
  const pa = (a instanceof ImmutableString || a instanceof Counter) ? plain(a) : a
  const pb = (b instanceof ImmutableString || b instanceof Counter) ? plain(b) : b
  if (pa === pb) return true
  if (pa == null || pb == null || typeof pa !== 'object' || typeof pb !== 'object') return false
  if (Array.isArray(pa) !== Array.isArray(pb)) return false
  if (Array.isArray(pa)) return pa.length === pb.length && pa.every((x, i) => deepEqualPlain(x, pb[i]))
  const ka = Object.keys(pa); const kb = Object.keys(pb)
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(pb, k) && deepEqualPlain(pa[k], pb[k]))
}

export { ImmutableString, Counter }
