// Small pure helpers for consensus code. Everything here is exact integer or
// string work, so every engine computes the same result. (mulberry32, lerp,
// pick and rr join from the root util.js when the terrain and view split;
// the tween clock stays with the view.)

// cyrb53: a fast 53-bit string hash (public domain, bryc). Only Math.imul,
// xor and shifts, so it is the same on every engine.
export function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

// JSON with object keys sorted at every depth, so equal data always prints
// the same text whatever order it was built in. Numbers print with
// JSON.stringify (ES Number::toString, exact on every engine); a property
// holding undefined is left out, as JSON does. Anything JSON can't carry
// faithfully (NaN, Infinity, functions, undefined in an array, a class
// instance) throws instead of hashing as something else.
export function canonicalJSON(v) {
  if (v === null || typeof v === 'boolean' || typeof v === 'string') return JSON.stringify(v)
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) throw new Error(`canonicalJSON: ${v} is not a finite number`)
    return JSON.stringify(v)
  }
  if (Array.isArray(v)) {
    return `[${v.map((x) => {
      if (x === undefined) throw new Error('canonicalJSON: undefined in an array')
      return canonicalJSON(x)
    }).join(',')}]`
  }
  if (typeof v === 'object' && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null)) {
    const keys = Object.keys(v).filter((k) => v[k] !== undefined).sort()
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJSON(v[k])}`).join(',')}}`
  }
  throw new Error(`canonicalJSON: can't encode ${typeof v === 'object' ? v.constructor?.name ?? 'object' : typeof v}`)
}
