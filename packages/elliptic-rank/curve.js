// Exact arithmetic for elliptic curves over Q, plus reduction mod p.
//
// Everything that has to be *right* lives here: rational numbers are pairs of
// BigInts so nothing is ever rounded, and the group law is the general
// Weierstrass one (Silverman, AEC III.2.3) so it works for the LMFDB-style
// curves y^2 + a1 xy + a3 y = x^3 + a2 x^2 + a4 x + a6 as well as the short
// form y^2 = x^3 + Ax + B.

// ---------------------------------------------------------------- rationals

const bigAbs = (a) => (a < 0n ? -a : a)

function gcd(a, b) {
  a = bigAbs(a)
  b = bigAbs(b)
  while (b) {
    const t = a % b
    a = b
    b = t
  }
  return a
}

/** A rational number n/d in lowest terms with d > 0. */
export function q(n, d = 1n) {
  n = BigInt(n)
  d = BigInt(d)
  if (d === 0n) throw new Error('rational with zero denominator')
  if (d < 0n) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  if (g > 1n) {
    n /= g
    d /= g
  }
  return { n, d }
}

export const Q = {
  zero: q(0n),
  one: q(1n),
  add: (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d),
  sub: (a, b) => q(a.n * b.d - b.n * a.d, a.d * b.d),
  mul: (a, b) => q(a.n * b.n, a.d * b.d),
  div: (a, b) => {
    if (b.n === 0n) throw new Error('division by zero')
    return q(a.n * b.d, a.d * b.n)
  },
  neg: (a) => ({ n: -a.n, d: a.d }),
  eq: (a, b) => a.n === b.n && a.d === b.d,
  isZero: (a) => a.n === 0n,
  cmp: (a, b) => {
    const l = a.n * b.d
    const r = b.n * a.d
    return l < r ? -1 : l > r ? 1 : 0
  },
  toNumber: (a) => {
    const direct = Number(a.n) / Number(a.d)
    if (Number.isFinite(direct) && direct !== 0) return direct
    // Fall back to a scaled division when n or d overflows a double.
    const shift = BigInt(Math.max(0, digits(a.d) - 300) * 4)
    return Number(a.n >> shift) / Number(a.d >> shift)
  },
  // log10 of |a|, computed without overflowing a double.
  log10Abs: (a) => log10Big(bigAbs(a.n)) - log10Big(a.d),
}

/** Number of decimal digits in a non-negative BigInt. */
export function digits(v) {
  v = bigAbs(v)
  if (v === 0n) return 1
  return v.toString().length
}

/** log10 of a positive BigInt, accurate for numbers of any size. */
export function log10Big(v) {
  v = bigAbs(v)
  if (v === 0n) return -Infinity
  const s = v.toString()
  // Use the leading 17 digits for the mantissa, the length for the exponent.
  const head = Number(s.slice(0, 17))
  return Math.log10(head) + (s.length - Math.min(17, s.length))
}

export const fmtQ = (a) => (a.d === 1n ? a.n.toString() : `${a.n}/${a.d}`)

// ------------------------------------------------------------------- curves

/**
 * Build a curve from a-invariants [a1, a2, a3, a4, a6] (integers, any width).
 * Short-form curves are written [0, 0, 0, A, B].
 */
export function curve(ainvs, meta = {}) {
  const [a1, a2, a3, a4, a6] = ainvs.map((v) => BigInt(v))
  const b2 = a1 * a1 + 4n * a2
  const b4 = 2n * a4 + a1 * a3
  const b6 = a3 * a3 + 4n * a6
  const b8 = a1 * a1 * a6 + 4n * a2 * a6 - a1 * a3 * a4 + a2 * a3 * a3 - a4 * a4
  const c4 = b2 * b2 - 24n * b4
  const c6 = -(b2 * b2 * b2) + 36n * b2 * b4 - 216n * b6
  const disc = -b2 * b2 * b8 - 8n * b4 * b4 * b4 - 27n * b6 * b6 + 9n * b2 * b4 * b6
  return { a1, a2, a3, a4, a6, b2, b4, b6, b8, c4, c6, disc, ...meta }
}

/** Is (x, y) an affine point of E? Exact, no rounding. */
export function onCurve(E, P) {
  if (P === null) return true
  const { x, y } = P
  const lhs = Q.add(Q.add(Q.mul(y, y), Q.mul(Q.mul(q(E.a1), x), y)), Q.mul(q(E.a3), y))
  const x2 = Q.mul(x, x)
  const rhs = Q.add(
    Q.add(Q.mul(x2, x), Q.mul(q(E.a2), x2)),
    Q.add(Q.mul(q(E.a4), x), q(E.a6)),
  )
  return Q.eq(lhs, rhs)
}

/** -(x, y) = (x, -y - a1 x - a3) */
export function neg(E, P) {
  if (P === null) return null
  return {
    x: P.x,
    y: Q.sub(Q.sub(Q.neg(P.y), Q.mul(q(E.a1), P.x)), q(E.a3)),
  }
}

export const isZero = (P) => P === null

export function eq(P, R) {
  if (P === null || R === null) return P === R
  return Q.eq(P.x, R.x) && Q.eq(P.y, R.y)
}

/**
 * The chord-and-tangent group law in general Weierstrass form.
 * Three points on a line sum to the point at infinity.
 */
export function add(E, P, R) {
  if (P === null) return R
  if (R === null) return P
  const { x: x1, y: y1 } = P
  const { x: x2, y: y2 } = R
  const a1 = q(E.a1)
  const a2 = q(E.a2)
  const a3 = q(E.a3)
  const a4 = q(E.a4)
  const a6 = q(E.a6)

  let lam
  let nu
  if (!Q.eq(x1, x2)) {
    const dx = Q.sub(x2, x1)
    lam = Q.div(Q.sub(y2, y1), dx)
    nu = Q.div(Q.sub(Q.mul(y1, x2), Q.mul(y2, x1)), dx)
  } else {
    // Same x: either P = -R (vertical line) or P = R (tangent).
    const den = Q.add(Q.add(Q.mul(q(2n), y1), Q.mul(a1, x1)), a3)
    if (Q.isZero(den) || !Q.eq(y1, y2)) return null
    const x1sq = Q.mul(x1, x1)
    lam = Q.div(
      Q.sub(Q.add(Q.add(Q.mul(q(3n), x1sq), Q.mul(Q.mul(q(2n), a2), x1)), a4), Q.mul(a1, y1)),
      den,
    )
    nu = Q.div(
      Q.sub(Q.add(Q.add(Q.neg(Q.mul(x1sq, x1)), Q.mul(a4, x1)), Q.mul(q(2n), a6)), Q.mul(a3, y1)),
      den,
    )
  }

  const x3 = Q.sub(Q.sub(Q.sub(Q.add(Q.mul(lam, lam), Q.mul(a1, lam)), a2), x1), x2)
  const y3 = Q.sub(Q.sub(Q.neg(Q.mul(Q.add(lam, a1), x3)), nu), a3)
  return { x: x3, y: y3 }
}

export const dbl = (E, P) => add(E, P, P)

/** n * P by double-and-add. n may be negative. */
export function mul(E, n, P) {
  let k = BigInt(n)
  if (k === 0n || P === null) return null
  let base = k < 0n ? neg(E, P) : P
  if (k < 0n) k = -k
  let acc = null
  while (k > 0n) {
    if (k & 1n) acc = add(E, acc, base)
    base = dbl(E, base)
    k >>= 1n
  }
  return acc
}

/** Linear combination sum(coeffs[i] * gens[i]). */
export function combine(E, gens, coeffs) {
  let acc = null
  for (let i = 0; i < gens.length; i++) {
    if (!coeffs[i]) continue
    acc = add(E, acc, mul(E, coeffs[i], gens[i]))
  }
  return acc
}

/**
 * Naive logarithmic height of a rational point: log max(|p|, |q|) where
 * x = p/q in lowest terms. Returned in nats, like the literature.
 */
export function naiveHeight(P) {
  if (P === null) return 0
  // h(P) = log max(|p|, |q|) for x = p/q in lowest terms. x = 0 has height 0,
  // and log10Big(0) is -Infinity, so take the max before scaling.
  const hn = P.x.n === 0n ? 0 : log10Big(P.x.n)
  const hd = log10Big(P.x.d)
  return Math.max(hn, hd, 0) * Math.LN10
}

/** Digits needed to write x(P) as a fraction: max over numerator and denominator. */
export function xDigits(P) {
  if (P === null) return 1
  return Math.max(digits(P.x.n), digits(P.x.d))
}

/** Order of a torsion point, or 0 if the point has infinite order. */
export function torsionOrder(E, P, limit = 24) {
  if (P === null) return 1
  let acc = P
  for (let n = 1; n <= limit; n++) {
    if (acc === null) return n
    acc = add(E, acc, P)
  }
  return 0
}

// ------------------------------------------------------------ reduction mod p

/** Sieve of Eratosthenes up to n. */
export function primesUpTo(n) {
  const sieve = new Uint8Array(n + 1)
  const out = []
  for (let i = 2; i <= n; i++) {
    if (sieve[i]) continue
    out.push(i)
    for (let j = i * i; j <= n; j += i) sieve[j] = 1
  }
  return out
}

/** A (possibly enormous) BigInt reduced into 0..p-1 as a plain Number. */
const modSmall = (v, p) => {
  const b = BigInt(p)
  return Number(((v % b) + b) % b)
}

/**
 * #E(F_p), counting the point at infinity. Returns null at bad primes
 * (p | disc), where the reduced curve is singular.
 */
export function countPointsModP(E, p) {
  if (E.disc % BigInt(p) === 0n) return null
  if (p === 2) return countBrute(E, 2)
  const b2 = modSmall(E.b2, p)
  const b4 = modSmall(E.b4, p)
  const b6 = modSmall(E.b6, p)
  // chi[v] is the Legendre symbol (v|p), built from a table of squares.
  const chi = new Int8Array(p).fill(-1)
  chi[0] = 0
  for (let i = 1; i < p; i++) chi[(i * i) % p] = 1
  let s = 0
  for (let x = 0; x < p; x++) {
    const x2 = (x * x) % p
    const f = (((4 * ((x2 * x) % p) + b2 * x2) % p) + ((2 * b4 * x) % p) + b6) % p
    s += chi[f]
  }
  return p + 1 + s
}

function countBrute(E, p) {
  const a1 = modSmall(E.a1, p)
  const a2 = modSmall(E.a2, p)
  const a3 = modSmall(E.a3, p)
  const a4 = modSmall(E.a4, p)
  const a6 = modSmall(E.a6, p)
  let n = 1
  for (let x = 0; x < p; x++) {
    for (let y = 0; y < p; y++) {
      const lhs = (y * y + a1 * x * y + a3 * y) % p
      const rhs = (x * x * x + a2 * x * x + a4 * x + a6) % p
      if (((lhs - rhs) % p + p) % p === 0) n++
    }
  }
  return n
}
