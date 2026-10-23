// Deterministic maths for rules code. The engine's own hypot, sin, cos, atan
// and atan2 are implementation-defined (Chromium's build of V8 and Node's
// already disagree in the last bit of sin and cos for a few inputs in a
// hundred): these are V8's own algorithms in plain JS over exact IEEE
// operations, so every engine computes the same bits. hypot and hypot3 are
// V8's formulas (src/builtins/math.tq, FastMathHypot); sin, cos, atan and
// atan2 are fdlibm's, as V8's src/base/ieee754.cc ports them and Node's V8
// runs them. Each matches Node's Math bit for bit, so the switch changes no
// battle (§4.1 rule 12's companion: N0).

export function hypot(x, y) {
  const a = Math.abs(x), b = Math.abs(y)
  if (a === Infinity || b === Infinity) return Infinity
  const max = Math.max(a, b)
  if (max !== max) return NaN
  if (max === 0) return 0
  return Math.sqrt((a / max) * (a / max) + (b / max) * (b / max)) * max
}

export function hypot3(x, y, z) {
  const a = Math.abs(x), b = Math.abs(y), c = Math.abs(z)
  if (a === Infinity || b === Infinity || c === Infinity) return Infinity
  const max = Math.max(Math.max(a, b), c)
  if (max !== max) return NaN
  if (max === 0) return 0
  const pa = (a / max) * (a / max)
  const pb = (b / max) * (b / max)
  const comp = (pa + pb) - pa - pb
  const pc = (c / max) * (c / max) - comp
  return Math.sqrt(pa + pb + pc) * max
}

// The words of a double, through one 8-byte scratch view. It is a register,
// not state: every use writes it and reads it back within one call, so it
// carries nothing from one call to the next (§4.1 rule 13). Big-endian on
// purpose: getInt32(0) is the high word on every platform.
const dv = new DataView(new ArrayBuffer(8))
const hiWord = (x) => (dv.setFloat64(0, x), dv.getInt32(0))
const loWord = (x) => (dv.setFloat64(0, x), dv.getUint32(4))
const fromWords = (hi, lo) => (dv.setUint32(0, hi >>> 0), dv.setUint32(4, lo >>> 0), dv.getFloat64(0))

// x·2^n, exactly while the result is normal (one rounding below that)
function scalbn(x, n) {
  while (n > 1023) (x *= fromWords(0x7fe00000, 0)), (n -= 1023)
  while (n < -1022) (x *= fromWords(0x00100000, 0)), (n += 1022)
  return x * fromWords((n + 1023) << 20, 0)
}

// 2/π in 24-bit chunks, and the high words of n·π/2 for n = 1…32
const TWO_OVER_PI = Object.freeze([
  0xa2f983, 0x6e4e44, 0x1529fc, 0x2757d1, 0xf534dd, 0xc0db62, 0x95993c, 0x439041, 0xfe5163, 0xabdebb, 0xc561b7, 0x246e3a,
  0x424dd2, 0xe00649, 0x2eea09, 0xd1921c, 0xfe1deb, 0x1cb129, 0xa73ee8, 0x8235f5, 0x2ebb44, 0x84e99c, 0x7026b4, 0x5f7e41,
  0x3991d6, 0x398353, 0x39f49c, 0x845f8b, 0xbdf928, 0x3b1ff8, 0x97ffde, 0x05980f, 0xef2f11, 0x8b5a0a, 0x6d1f6d, 0x367ecf,
  0x27cb09, 0xb74f46, 0x3f669e, 0x5fea2d, 0x7527ba, 0xc7ebe5, 0xf17b3d, 0x0739f7, 0x8a5292, 0xea6bfb, 0x5fb11f, 0x8d5d08,
  0x560330, 0x46fc7b, 0x6babf0, 0xcfbc20, 0x9af436, 0x1da9e3, 0x91615e, 0xe61b08, 0x659985, 0x5f14a0, 0x68408d, 0xffd880,
  0x4d7327, 0x310606, 0x1556ca, 0x73a8c9, 0x60e27b, 0xc08c6b,
])
const NPIO2_HW = Object.freeze([
  0x3ff921fb, 0x400921fb, 0x4012d97c, 0x401921fb, 0x401f6a7a, 0x4022d97c, 0x4025fdbb, 0x402921fb, 0x402c463a, 0x402f6a7a,
  0x4031475c, 0x4032d97c, 0x40346b9c, 0x4035fdbb, 0x40378fdb, 0x403921fb, 0x403ab41b, 0x403c463a, 0x403dd85a, 0x403f6a7a,
  0x40407e4c, 0x4041475c, 0x4042106c, 0x4042d97c, 0x4043a28c, 0x40446b9c, 0x404534ac, 0x4045fdbb, 0x4046c6cb, 0x40478fdb,
  0x404858eb, 0x404921fb,
])
// π/2 in 24-bit pieces, for the large-argument reduction
const PIO2 = Object.freeze([
  fromWords(0x3ff921fb, 0x40000000), fromWords(0x3e74442d, 0x00000000), fromWords(0x3cf84698, 0x80000000), fromWords(0x3b78cc51, 0x60000000),
  fromWords(0x39f01b83, 0x80000000), fromWords(0x387a2520, 0x40000000), fromWords(0x36e38222, 0x80000000), fromWords(0x3569f31d, 0x00000000),
])
const TWO24 = fromWords(0x41700000, 0), TWON24 = fromWords(0x3e700000, 0)
const INVPIO2 = fromWords(0x3fe45f30, 0x6dc9c883)
// π/2 as three 33-bit pieces, each with the rest (…t) after it
const PIO2_1 = fromWords(0x3ff921fb, 0x54400000), PIO2_1T = fromWords(0x3dd0b461, 0x1a626331)
const PIO2_2 = fromWords(0x3dd0b461, 0x1a600000), PIO2_2T = fromWords(0x3ba3198a, 0x2e037073)
const PIO2_3 = fromWords(0x3ba3198a, 0x2e000000), PIO2_3T = fromWords(0x397b839a, 0x252049c1)

// fdlibm's __kernel_rem_pio2 at prec 2: x[0…nx-1], |x| in 24-bit chunks
// scaled by 2^e0, reduced mod π/2 into y[0] + y[1]; the quadrant n & 7
function kernelRemPio2(x, y, e0, nx) {
  const jk = 4, jp = jk
  const f = new Array(20).fill(0), q = new Array(20).fill(0), fq = new Array(20).fill(0), iq = new Array(20).fill(0)
  const jx = nx - 1
  const jv = Math.max(0, Math.trunc((e0 - 3) / 24))
  let q0 = e0 - 24 * (jv + 1)
  for (let i = 0, j = jv - jx; i <= jx + jk; i++, j++) f[i] = j < 0 ? 0 : TWO_OVER_PI[j]
  for (let i = 0; i <= jk; i++) {
    let fw = 0
    for (let j = 0; j <= jx; j++) fw += x[j] * f[jx + i - j]
    q[i] = fw
  }
  let jz = jk, z, n, ih, fw
  for (;;) {
    // distill q[] into iq[] reversingly
    z = q[jz]
    for (let i = 0, j = jz; j > 0; i++, j--) {
      fw = Math.trunc(TWON24 * z)
      iq[i] = Math.trunc(z - TWO24 * fw)
      z = q[j - 1] + fw
    }
    z = scalbn(z, q0)
    z -= 8 * Math.floor(z * 0.125)
    n = Math.trunc(z)
    z -= n
    ih = 0
    if (q0 > 0) {
      const i = iq[jz - 1] >> (24 - q0)
      n += i
      iq[jz - 1] -= i << (24 - q0)
      ih = iq[jz - 1] >> (23 - q0)
    } else if (q0 === 0) ih = iq[jz - 1] >> 23
    else if (z >= 0.5) ih = 2
    if (ih > 0) {
      // q > 0.5: take 1 - q
      n += 1
      let carry = 0
      for (let i = 0; i < jz; i++) {
        const j = iq[i]
        if (carry === 0) {
          if (j !== 0) {
            carry = 1
            iq[i] = 0x1000000 - j
          }
        } else iq[i] = 0xffffff - j
      }
      if (q0 === 1) iq[jz - 1] &= 0x7fffff
      else if (q0 === 2) iq[jz - 1] &= 0x3fffff
      if (ih === 2) {
        z = 1 - z
        if (carry !== 0) z -= scalbn(1, q0)
      }
    }
    // all the bits cancelled: recompute with more terms of 2/π
    if (z !== 0) break
    let j = 0
    for (let i = jz - 1; i >= jk; i--) j |= iq[i]
    if (j !== 0) break
    let k = 1
    while (jk >= k && iq[jk - k] === 0) k++
    for (let i = jz + 1; i <= jz + k; i++) {
      f[jx + i] = TWO_OVER_PI[jv + i]
      let fw = 0
      for (let j = 0; j <= jx; j++) fw += x[j] * f[jx + i - j]
      q[i] = fw
    }
    jz += k
  }
  // chop off zero terms, or break z into 24-bit chunks
  if (z === 0) {
    jz -= 1
    q0 -= 24
    while (iq[jz] === 0) {
      jz--
      q0 -= 24
    }
  } else {
    z = scalbn(z, -q0)
    if (z >= TWO24) {
      fw = Math.trunc(TWON24 * z)
      iq[jz] = Math.trunc(z - TWO24 * fw)
      jz += 1
      q0 += 24
      iq[jz] = fw
    } else iq[jz] = Math.trunc(z)
  }
  fw = scalbn(1, q0)
  for (let i = jz; i >= 0; i--) {
    q[i] = fw * iq[i]
    fw *= TWON24
  }
  for (let i = jz; i >= 0; i--) {
    let fw = 0
    for (let k = 0; k <= jp && k <= jz - i; k++) fw += PIO2[k] * q[i + k]
    fq[jz - i] = fw
  }
  fw = 0
  for (let i = jz; i >= 0; i--) fw += fq[i]
  y[0] = ih === 0 ? fw : -fw
  fw = fq[0] - fw
  for (let i = 1; i <= jz; i++) fw += fq[i]
  y[1] = ih === 0 ? fw : -fw
  return n & 7
}

// fdlibm's __ieee754_rem_pio2: x reduced mod π/2 into y[0] + y[1]; the quadrant
function remPio2(x, y) {
  const hx = hiWord(x), ix = hx & 0x7fffffff
  if (ix <= 0x3fe921fb) {
    y[0] = x
    y[1] = 0
    return 0
  }
  if (ix < 0x4002d97c) {
    // |x| < 3π/4: n = ±1
    const s = hx > 0 ? 1 : -1
    let z = x - s * PIO2_1
    if (ix !== 0x3ff921fb) {
      y[0] = z - s * PIO2_1T
      y[1] = z - y[0] - s * PIO2_1T
    } else {
      z -= s * PIO2_2
      y[0] = z - s * PIO2_2T
      y[1] = z - y[0] - s * PIO2_2T
    }
    return s
  }
  if (ix <= 0x413921fb) {
    // |x| up to 2^19·π/2: π/2 in up to three pieces
    let t = Math.abs(x)
    const n = Math.trunc(t * INVPIO2 + 0.5)
    let r = t - n * PIO2_1
    let w = n * PIO2_1T
    y[0] = r - w
    if (n >= 32 || ix === NPIO2_HW[n - 1]) {
      const j = ix >> 20
      if (j - ((hiWord(y[0]) >> 20) & 0x7ff) > 16) {
        t = r
        w = n * PIO2_2
        r = t - w
        w = n * PIO2_2T - (t - r - w)
        y[0] = r - w
        if (j - ((hiWord(y[0]) >> 20) & 0x7ff) > 49) {
          t = r
          w = n * PIO2_3
          r = t - w
          w = n * PIO2_3T - (t - r - w)
          y[0] = r - w
        }
      }
    }
    y[1] = r - y[0] - w
    if (hx < 0) {
      y[0] = -y[0]
      y[1] = -y[1]
      return -n
    }
    return n
  }
  if (ix >= 0x7ff00000) {
    y[0] = y[1] = x - x
    return 0
  }
  // large: |x| scaled to about 2^23, split into three 24-bit chunks
  const e0 = (ix >> 20) - 1046
  let z = fromWords(ix - (e0 << 20), loWord(x))
  const tx = [0, 0, 0]
  for (let i = 0; i < 2; i++) {
    tx[i] = Math.trunc(z)
    z = (z - tx[i]) * TWO24
  }
  tx[2] = z
  let nx = 3
  while (tx[nx - 1] === 0) nx--
  const n = kernelRemPio2(tx, y, e0, nx)
  if (hx < 0) {
    y[0] = -y[0]
    y[1] = -y[1]
    return -n
  }
  return n
}

// sin and cos on [-π/4, π/4], of x + y (y the tail; iy 0 when there is none)
const S1 = fromWords(0xbfc55555, 0x55555549), S2 = fromWords(0x3f811111, 0x1110f8a6), S3 = fromWords(0xbf2a01a0, 0x19c161d5)
const S4 = fromWords(0x3ec71de3, 0x57b1fe7d), S5 = fromWords(0xbe5ae5e6, 0x8a2b9ceb), S6 = fromWords(0x3de5d93a, 0x5acfd57c)
function kernelSin(x, y, iy) {
  if ((hiWord(x) & 0x7fffffff) < 0x3e400000 && Math.trunc(x) === 0) return x
  const z = x * x, v = z * x
  const r = S2 + z * (S3 + z * (S4 + z * (S5 + z * S6)))
  if (iy === 0) return x + v * (S1 + z * r)
  return x - (z * (0.5 * y - v * r) - y - v * S1)
}
const C1 = fromWords(0x3fa55555, 0x5555554c), C2 = fromWords(0xbf56c16c, 0x16c15177), C3 = fromWords(0x3efa01a0, 0x19cb1590)
const C4 = fromWords(0xbe927e4f, 0x809c52ad), C5 = fromWords(0x3e21ee9e, 0xbdb4b1c4), C6 = fromWords(0xbda8fae9, 0xbe8838d4)
function kernelCos(x, y) {
  const ix = hiWord(x) & 0x7fffffff
  if (ix < 0x3e400000 && Math.trunc(x) === 0) return 1
  const z = x * x
  const r = z * (C1 + z * (C2 + z * (C3 + z * (C4 + z * (C5 + z * C6)))))
  if (ix < 0x3fd33333) return 1 - (0.5 * z - (z * r - x * y))
  const qx = ix > 0x3fe90000 ? 0.28125 : fromWords(ix - 0x00200000, 0)
  return 1 - qx - (0.5 * z - qx - (z * r - x * y))
}

export function sin(x) {
  const ix = hiWord(x) & 0x7fffffff
  if (ix <= 0x3fe921fb) return kernelSin(x, 0, 0)
  if (ix >= 0x7ff00000) return x - x
  const y = [0, 0]
  switch (remPio2(x, y) & 3) {
    case 0: return kernelSin(y[0], y[1], 1)
    case 1: return kernelCos(y[0], y[1])
    case 2: return -kernelSin(y[0], y[1], 1)
    default: return -kernelCos(y[0], y[1])
  }
}

export function cos(x) {
  const ix = hiWord(x) & 0x7fffffff
  if (ix <= 0x3fe921fb) return kernelCos(x, 0)
  if (ix >= 0x7ff00000) return x - x
  const y = [0, 0]
  switch (remPio2(x, y) & 3) {
    case 0: return kernelCos(y[0], y[1])
    case 1: return -kernelSin(y[0], y[1], 1)
    case 2: return -kernelCos(y[0], y[1])
    default: return kernelSin(y[0], y[1], 1)
  }
}

// atan of 0.5, 1, 1.5 and ∞, each as hi + lo, and the series' coefficients
const ATANHI = Object.freeze([fromWords(0x3fddac67, 0x0561bb4f), fromWords(0x3fe921fb, 0x54442d18), fromWords(0x3fef730b, 0xd281f69b), fromWords(0x3ff921fb, 0x54442d18)])
const ATANLO = Object.freeze([fromWords(0x3c7a2b7f, 0x222f65e2), fromWords(0x3c81a626, 0x33145c07), fromWords(0x3c700788, 0x7af0cbbd), fromWords(0x3c91a626, 0x33145c07)])
const AT = Object.freeze([
  fromWords(0x3fd55555, 0x5555550d), fromWords(0xbfc99999, 0x9998ebc4), fromWords(0x3fc24924, 0x920083ff), fromWords(0xbfbc71c6, 0xfe231671),
  fromWords(0x3fb745cd, 0xc54c206e), fromWords(0xbfb3b0f2, 0xaf749a6d), fromWords(0x3fb10d66, 0xa0d03d51), fromWords(0xbfadde2d, 0x52defd9a),
  fromWords(0x3fa97b4b, 0x24760deb), fromWords(0xbfa2b444, 0x2c6a6c2f), fromWords(0x3f90ad3a, 0xe322da11),
])

export function atan(x) {
  const hx = hiWord(x), ix = hx & 0x7fffffff
  let id
  if (ix >= 0x44100000) {
    // |x| ≥ 2^66, or NaN
    if (x !== x) return x + x
    return hx > 0 ? ATANHI[3] + ATANLO[3] : -ATANHI[3] - ATANLO[3]
  }
  if (ix < 0x3fdc0000) {
    if (ix < 0x3e400000) return x
    id = -1
  } else {
    x = Math.abs(x)
    if (ix < 0x3ff30000) {
      if (ix < 0x3fe60000) {
        id = 0
        x = (2 * x - 1) / (2 + x)
      } else {
        id = 1
        x = (x - 1) / (x + 1)
      }
    } else if (ix < 0x40038000) {
      id = 2
      x = (x - 1.5) / (1 + 1.5 * x)
    } else {
      id = 3
      x = -1 / x
    }
  }
  const z = x * x, w = z * z
  const s1 = z * (AT[0] + w * (AT[2] + w * (AT[4] + w * (AT[6] + w * (AT[8] + w * AT[10])))))
  const s2 = w * (AT[1] + w * (AT[3] + w * (AT[5] + w * (AT[7] + w * AT[9]))))
  if (id < 0) return x - x * (s1 + s2)
  const r = ATANHI[id] - (x * (s1 + s2) - ATANLO[id] - x)
  return hx < 0 ? -r : r
}

const PI_O_4 = fromWords(0x3fe921fb, 0x54442d18), PI_O_2 = fromWords(0x3ff921fb, 0x54442d18), PI = fromWords(0x400921fb, 0x54442d18)
const PI_LO = fromWords(0x3ca1a626, 0x33145c07)

export function atan2(y, x) {
  if (x !== x || y !== y) return x + y
  const hx = hiWord(x), lx = loWord(x), ix = hx & 0x7fffffff
  const hy = hiWord(y), ly = loWord(y), iy = hy & 0x7fffffff
  if (x === 1) return atan(y)
  // 2·sign(x) + sign(y)
  let m = ((hy >> 31) & 1) | ((hx >> 30) & 2)
  if ((iy | ly) === 0) return m < 2 ? y : m === 2 ? PI : -PI
  if ((ix | lx) === 0) return hy < 0 ? -PI_O_2 : PI_O_2
  if (ix === 0x7ff00000) {
    if (iy === 0x7ff00000) return [PI_O_4, -PI_O_4, 3 * PI_O_4, -3 * PI_O_4][m]
    return [0, -0, PI, -PI][m]
  }
  if (iy === 0x7ff00000) return hy < 0 ? -PI_O_2 : PI_O_2
  const k = (iy - ix) >> 20
  let z
  if (k > 60) {
    // |y/x| > 2^60
    z = PI_O_2 + 0.5 * PI_LO
    m &= 1
  } else if (hx < 0 && k < -60) z = 0
  else z = atan(Math.abs(y / x))
  switch (m) {
    case 0: return z
    case 1: return -z
    case 2: return PI - (z - PI_LO)
    default: return z - PI_LO - PI
  }
}
