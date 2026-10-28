// Bun.deepEquals(a, b, strict = false): the comparison behind bun:test's
// toEqual (strict = toStrictEqual).
//
// Loose: primitives by Object.is (NaN equals NaN, 0 and -0 differ), object
// properties whose value is undefined are ignored, array holes equal
// undefined, prototypes are not compared. Strict: undefined-valued properties
// and holes count, and both sides must share a prototype. Understands Date,
// RegExp, boxed primitives, Error, Map, Set (deep membership), ArrayBuffer,
// typed arrays, DataView and cycles.

const tagOf = (v) => Object.prototype.toString.call(v)
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

function ownKeys(o, strict) {
  const keys = Object.keys(o)
  for (const s of Object.getOwnPropertySymbols(o)) {
    if (Object.prototype.propertyIsEnumerable.call(o, s)) keys.push(s)
  }
  return strict ? keys : keys.filter((k) => o[k] !== undefined)
}

function bytesEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false
  for (let i = 0; i < a.byteLength; i++) if (a[i] !== b[i]) return false
  return true
}

export function deepEquals(a, b, strict = false) {
  return eq(a, b, !!strict, new Map())
}

function eq(a, b, strict, seen) {
  if (Object.is(a, b)) return true
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false

  // A pair already under comparison further up the stack is assumed equal
  // (that is how cycles terminate). Pairs leave the set once decided, so a
  // failed trial match inside Map/Set membership cannot later read as equal.
  let partners = seen.get(a)
  if (partners?.has(b)) return true
  if (!partners) seen.set(a, (partners = new Set()))
  partners.add(b)
  try {
    return compare(a, b, strict, seen)
  } finally {
    partners.delete(b)
  }
}

function compare(a, b, strict, seen) {
  const tag = tagOf(a)
  if (tag !== tagOf(b)) return false
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false

  switch (tag) {
    case '[object Date]':
      return Object.is(a.getTime(), b.getTime())
    case '[object RegExp]':
      return a.source === b.source && a.flags === b.flags
    case '[object Number]':
    case '[object String]':
    case '[object Boolean]':
    case '[object BigInt]':
    case '[object Symbol]':
      if (!Object.is(a.valueOf(), b.valueOf())) return false
      break
    case '[object Error]':
      if (a.name !== b.name || a.message !== b.message) return false
      break
    case '[object ArrayBuffer]':
    case '[object SharedArrayBuffer]':
      return bytesEqual(new Uint8Array(a), new Uint8Array(b))
    case '[object DataView]':
      return bytesEqual(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength))
    // Keys / members are matched one-to-one: by identity first, else against
    // a structurally equal entry of b not already matched.
    case '[object Map]': {
      if (a.size !== b.size) return false
      const used = new Set()
      outer: for (const [k, v] of a) {
        if (b.has(k) && !used.has(k)) {
          if (!eq(v, b.get(k), strict, seen)) return false
          used.add(k)
          continue
        }
        for (const [k2, v2] of b) {
          if (!used.has(k2) && eq(k, k2, strict, seen) && eq(v, v2, strict, seen)) { used.add(k2); continue outer }
        }
        return false
      }
      return true
    }
    case '[object Set]': {
      if (a.size !== b.size) return false
      const used = new Set()
      outer: for (const v of a) {
        if (b.has(v) && !used.has(v)) { used.add(v); continue }
        for (const v2 of b) {
          if (!used.has(v2) && eq(v, v2, strict, seen)) { used.add(v2); continue outer }
        }
        return false
      }
      return true
    }
  }

  if (ArrayBuffer.isView(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false
    return true
  }

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (strict && hasOwn(a, i) !== hasOwn(b, i)) return false
      if (!eq(a[i], b[i], strict, seen)) return false
    }
    return true
  }

  const ka = ownKeys(a, strict)
  const kb = ownKeys(b, strict)
  if (ka.length !== kb.length) return false
  for (const k of ka) {
    if (!hasOwn(b, k) || !eq(a[k], b[k], strict, seen)) return false
  }
  return true
}
