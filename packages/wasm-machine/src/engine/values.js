// Value representation and bit-exact float helpers.
//
// Runtime values:
//   i32        JS number, always a signed int32 (x | 0)
//   i64        BigInt, always signed (BigInt.asIntN(64, x))
//   f32 / f64  JS number — except NaNs whose bit pattern must survive, which
//              are represented by a NaNBox. A NaNBox coerces to NaN (valueOf),
//              so arithmetic on it naturally produces NaN, but it remembers the
//              exact payload so reinterpret / store / neg / abs / copysign stay
//              bit-exact. A plain JS NaN number is treated as the canonical
//              positive quiet NaN (0x7fc00000 / 0x7ff8000000000000).
//   funcref    null or a FuncInst object
//   externref  null or any host JS value

const f32buf = new Float32Array(1)
const u32of32 = new Uint32Array(f32buf.buffer)
const f64buf = new Float64Array(1)
const u32of64 = new Uint32Array(f64buf.buffer) // [lo, hi] (little-endian hosts)
const LITTLE = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1
const LO = LITTLE ? 0 : 1
const HI = LITTLE ? 1 : 0

export class NaNBox {
  /**
   * @param {'f32'|'f64'} type
   * @param {number} hi  for f32: the full 32-bit pattern; for f64: high word
   * @param {number} lo  for f64: low word (unused for f32)
   */
  constructor(type, hi, lo = 0) {
    this.type = type
    this.hi = hi >>> 0
    this.lo = lo >>> 0
  }
  valueOf() {
    return NaN
  }
  toString() {
    return formatFloat(this.type, this)
  }
}

export const CANON_F32 = 0x7fc00000

/** f32 value -> uint32 bit pattern */
export function f32Bits(x) {
  if (typeof x === 'object' && x !== null) return x.hi
  if (x !== x) return CANON_F32
  f32buf[0] = x
  return u32of32[0]
}

/** uint32 bit pattern -> f32 value (boxing NaNs) */
export function f32FromBits(bits) {
  bits >>>= 0
  if ((bits & 0x7f800000) === 0x7f800000 && (bits & 0x7fffff) !== 0) return new NaNBox('f32', bits)
  u32of32[0] = bits
  return f32buf[0]
}

/** f64 value -> [hi, lo] uint32 words */
export function f64Words(x) {
  if (typeof x === 'object' && x !== null) return [x.hi, x.lo]
  if (x !== x) return [0x7ff80000, 0]
  f64buf[0] = x
  return [u32of64[HI], u32of64[LO]]
}

export function f64FromWords(hi, lo) {
  hi >>>= 0
  lo >>>= 0
  if ((hi & 0x7ff00000) === 0x7ff00000 && ((hi & 0xfffff) !== 0 || lo !== 0)) return new NaNBox('f64', hi, lo)
  u32of64[HI] = hi
  u32of64[LO] = lo
  return f64buf[0]
}

/** f64 value -> BigInt (signed i64 bit pattern) */
export function f64BitsBig(x) {
  const [hi, lo] = f64Words(x)
  return BigInt.asIntN(64, (BigInt(hi) << 32n) | BigInt(lo))
}

export function f64FromBitsBig(b) {
  const u = BigInt.asUintN(64, b)
  return f64FromWords(Number(u >> 32n), Number(u & 0xffffffffn))
}

export function isNaNValue(x) {
  return typeof x === 'object' ? x !== null && x instanceof NaNBox : x !== x
}

// --- sign-bit ops (bitwise, exact for NaNs) -------------------------------

export function f32Neg(x) {
  if (typeof x === 'number' && x === x) return -x
  return f32FromBits(f32Bits(x) ^ 0x80000000)
}
export function f32Abs(x) {
  if (typeof x === 'number' && x === x) return Math.abs(x)
  return f32FromBits(f32Bits(x) & 0x7fffffff)
}
export function f32Copysign(a, b) {
  return f32FromBits((f32Bits(a) & 0x7fffffff) | (f32Bits(b) & 0x80000000))
}
export function f64Neg(x) {
  if (typeof x === 'number' && x === x) return -x
  const [hi, lo] = f64Words(x)
  return f64FromWords(hi ^ 0x80000000, lo)
}
export function f64Abs(x) {
  if (typeof x === 'number' && x === x) return Math.abs(x)
  const [hi, lo] = f64Words(x)
  return f64FromWords(hi & 0x7fffffff, lo)
}
export function f64Copysign(a, b) {
  const [ha, la] = f64Words(a)
  const [hb] = f64Words(b)
  return f64FromWords((ha & 0x7fffffff) | (hb & 0x80000000), la)
}

// --- rounding helpers -----------------------------------------------------

/** IEEE roundTiesToEven to integral, preserving -0. */
export function nearest(x) {
  x = +x
  if (x !== x || x === 0 || !isFinite(x)) return x
  const t = Math.trunc(x)
  const frac = Math.abs(x - t)
  let r
  if (frac === 0.5) r = 2 * Math.round(x / 2)
  else r = Math.round(x)
  if (r === 0 && x < 0) return -0
  return r
}

/** Correctly rounded BigInt -> f32 (avoids double rounding through f64). */
export function bigToF32(b) {
  const neg = b < 0n
  let u = neg ? -b : b
  if (u < 2n ** 53n) return Math.fround(neg ? -Number(u) : Number(u))
  const L = BigInt(u.toString(2).length)
  const shift = L - 53n
  const sticky = (u & ((1n << shift) - 1n)) !== 0n ? 1n : 0n
  const m = (u >> shift) | sticky
  const v = Number(m) * 2 ** Number(shift)
  return Math.fround(neg ? -v : v)
}

// --- defaults / coercion --------------------------------------------------

export function defaultValue(type) {
  switch (type) {
    case 'i32': return 0
    case 'i64': return 0n
    case 'f32': return 0
    case 'f64': return 0
    default: return null // funcref / externref
  }
}

/** Coerce an arbitrary host JS value to a wasm value of `type`. */
export function toWasm(type, v) {
  switch (type) {
    case 'i32':
      if (typeof v === 'bigint') return Number(BigInt.asIntN(32, v))
      return Number(v) | 0
    case 'i64':
      if (typeof v === 'bigint') return BigInt.asIntN(64, v)
      if (typeof v === 'number') return BigInt.asIntN(64, BigInt(Math.trunc(v) || 0))
      if (typeof v === 'boolean') return v ? 1n : 0n
      return BigInt.asIntN(64, BigInt(v))
    case 'f32':
      if (v instanceof NaNBox) return v.type === 'f32' ? v : NaN
      return Math.fround(Number(v))
    case 'f64':
      if (v instanceof NaNBox) return v.type === 'f64' ? v : NaN
      return Number(v)
    default:
      return v === undefined ? null : v
  }
}

// --- formatting -----------------------------------------------------------

function hex(n, width) {
  return n.toString(16).padStart(width, '0')
}

export function formatFloat(type, x) {
  if (typeof x === 'object' && x !== null) {
    let sign, payload, canon
    if (type === 'f32') {
      sign = x.hi >>> 31
      payload = x.hi & 0x7fffff
      canon = 0x400000
      return (sign ? '-' : '') + (payload === canon ? 'nan' : 'nan:0x' + payload.toString(16))
    }
    sign = x.hi >>> 31
    const p = (BigInt(x.hi & 0xfffff) << 32n) | BigInt(x.lo)
    return (sign ? '-' : '') + (p === 0x8000000000000n ? 'nan' : 'nan:0x' + p.toString(16))
  }
  if (x !== x) return 'nan'
  if (x === Infinity) return 'inf'
  if (x === -Infinity) return '-inf'
  if (x === 0 && 1 / x < 0) return '-0'
  if (type === 'f32') {
    // shortest decimal that reads back as the same f32
    for (let p = 1; p < 9; p++) {
      const s = x.toPrecision(p)
      if (Math.fround(Number(s)) === x) return String(Number(s))
    }
    return String(Number(x.toPrecision(9)))
  }
  return String(x)
}

/** Human-readable rendering of a typed value. */
export function formatValue(type, v) {
  switch (type) {
    case 'i32':
    case 'i64':
      return String(v)
    case 'f32':
    case 'f64':
      return formatFloat(type, v)
    case 'funcref':
      if (v === null) return 'ref.null func'
      return 'ref.func ' + (v.name ?? v.index ?? '?')
    case 'externref':
      if (v === null) return 'ref.null extern'
      return 'ref.extern ' + (typeof v === 'object' && v && 'extern' in v ? v.extern : String(v))
    default:
      return String(v)
  }
}

/** Raw bit pattern of a value as a hex string (for numeric types). */
export function valueHex(type, v) {
  switch (type) {
    case 'i32': return '0x' + hex(v >>> 0, 8)
    case 'i64': return '0x' + hex(BigInt.asUintN(64, v), 16)
    case 'f32': return '0x' + hex(f32Bits(v), 8)
    case 'f64': {
      const [h, l] = f64Words(v)
      return '0x' + hex(h, 8) + hex(l, 8)
    }
    default: return ''
  }
}

/** Equality of two values that is bit-exact for floats. */
export function sameValue(type, a, b) {
  switch (type) {
    case 'f32': return f32Bits(a) === f32Bits(b)
    case 'f64': {
      const x = f64Words(a), y = f64Words(b)
      return x[0] === y[0] && x[1] === y[1]
    }
    default: return a === b
  }
}
