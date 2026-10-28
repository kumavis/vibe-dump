// xxHash32 / xxHash64 (Yann Collet's algorithm, specification at
// github.com/Cyan4973/xxHash/blob/dev/doc/xxhash_spec.md), written from the
// spec for Bun.hash.xxHash32 / xxHash64 and as the stand-in for Bun.hash().
//
// 64-bit lanes are carried as two uint32 halves (hi, lo) so the hot loop stays
// in Smi/double arithmetic; BigInt is only built for the return value. The
// helpers below write their result into the module-level registers RH/RL
// instead of allocating a pair per operation.

const P32_1 = 0x9e3779b1
const P32_2 = 0x85ebca77
const P32_3 = 0xc2b2ae3d
const P32_4 = 0x27d4eb2f
const P32_5 = 0x165667b1

const rotl32 = (x, r) => ((x << r) | (x >>> (32 - r))) >>> 0
const read32 = (u8, i) => (u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24)) >>> 0

function round32(acc, input) {
  acc = (acc + Math.imul(input, P32_2)) >>> 0
  return Math.imul(rotl32(acc, 13), P32_1) >>> 0
}

/** xxHash32 of bytes; returns an unsigned 32-bit number. */
export function xxHash32(u8, seed = 0) {
  seed >>>= 0
  const len = u8.length
  let i = 0
  let h
  if (len >= 16) {
    let v1 = (seed + P32_1 + P32_2) >>> 0
    let v2 = (seed + P32_2) >>> 0
    let v3 = seed
    let v4 = (seed - P32_1) >>> 0
    const limit = len - 16
    do {
      v1 = round32(v1, read32(u8, i)); i += 4
      v2 = round32(v2, read32(u8, i)); i += 4
      v3 = round32(v3, read32(u8, i)); i += 4
      v4 = round32(v4, read32(u8, i)); i += 4
    } while (i <= limit)
    h = (rotl32(v1, 1) + rotl32(v2, 7) + rotl32(v3, 12) + rotl32(v4, 18)) >>> 0
  } else {
    h = (seed + P32_5) >>> 0
  }
  h = (h + len) >>> 0
  for (; i + 4 <= len; i += 4) {
    h = (h + Math.imul(read32(u8, i), P32_3)) >>> 0
    h = Math.imul(rotl32(h, 17), P32_4) >>> 0
  }
  for (; i < len; i++) {
    h = (h + Math.imul(u8[i], P32_5)) >>> 0
    h = Math.imul(rotl32(h, 11), P32_1) >>> 0
  }
  h ^= h >>> 15
  h = Math.imul(h, P32_2)
  h ^= h >>> 13
  h = Math.imul(h, P32_3)
  h ^= h >>> 16
  return h >>> 0
}

// --- 64-bit helpers on (hi, lo) uint32 pairs --------------------------------

let RH = 0
let RL = 0

// (ah:al) * (bh:bl) mod 2^64. al*bl needs all 64 bits, so it is done in 16-bit
// limbs (each partial product < 2^32 is exact in a double); the cross terms
// only reach the high word, where Math.imul's low 32 bits are all we need.
function mul64(ah, al, bh, bl) {
  const a0 = al & 0xffff
  const a1 = al >>> 16
  const b0 = bl & 0xffff
  const b1 = bl >>> 16
  const p00 = a0 * b0
  const p01 = a0 * b1
  const p10 = a1 * b0
  const p11 = a1 * b1
  const mid = (p00 >>> 16) + (p01 & 0xffff) + (p10 & 0xffff)
  RL = (((mid & 0xffff) << 16) | (p00 & 0xffff)) >>> 0
  RH = (p11 + (p01 >>> 16) + (p10 >>> 16) + (mid >>> 16) + Math.imul(ah, bl) + Math.imul(al, bh)) >>> 0
}

function add64(ah, al, bh, bl) {
  const lo = al + bl
  RL = lo >>> 0
  RH = (ah + bh + (lo > 0xffffffff ? 1 : 0)) >>> 0
}

// rotate left by 0 < r < 32
function rotl64(h, l, r) {
  RH = ((h << r) | (l >>> (32 - r))) >>> 0
  RL = ((l << r) | (h >>> (32 - r))) >>> 0
}

const P64_1H = 0x9e3779b1, P64_1L = 0x85ebca87
const P64_2H = 0xc2b2ae3d, P64_2L = 0x27d4eb4f
const P64_3H = 0x165667b1, P64_3L = 0x9e3779f9
const P64_4H = 0x85ebca77, P64_4L = 0xc2b2ae63
const P64_5H = 0x27d4eb2f, P64_5L = 0x165667c5
const NEG_P64_1H = 0x61c8864e, NEG_P64_1L = 0x7a143579 // 2^64 - P1

// round(acc, input) = rotl(acc + input * P2, 31) * P1, result in RH:RL
function round64(accH, accL, inH, inL) {
  mul64(inH, inL, P64_2H, P64_2L)
  add64(accH, accL, RH, RL)
  rotl64(RH, RL, 31)
  mul64(RH, RL, P64_1H, P64_1L)
}

// acc = (acc ^ round(0, val)) * P1 + P4
function merge64(accH, accL, valH, valL) {
  round64(0, 0, valH, valL)
  mul64((accH ^ RH) >>> 0, (accL ^ RL) >>> 0, P64_1H, P64_1L)
  add64(RH, RL, P64_4H, P64_4L)
}

/** Split a number|bigint seed into uint64 halves. */
function seedHalves(seed) {
  if (seed === undefined || seed === null) return [0, 0]
  const s = BigInt.asUintN(64, typeof seed === 'bigint' ? seed : BigInt(Math.trunc(Number(seed)) || 0))
  return [Number(s >> 32n), Number(s & 0xffffffffn)]
}

/** xxHash64 of bytes; returns an unsigned 64-bit bigint. */
export function xxHash64(u8, seed = 0) {
  const [sH, sL] = seedHalves(seed)
  const len = u8.length
  let i = 0
  let hH
  let hL
  if (len >= 32) {
    add64(sH, sL, P64_1H, P64_1L); add64(RH, RL, P64_2H, P64_2L)
    let v1H = RH, v1L = RL
    add64(sH, sL, P64_2H, P64_2L)
    let v2H = RH, v2L = RL
    let v3H = sH, v3L = sL
    add64(sH, sL, NEG_P64_1H, NEG_P64_1L) // seed - P1
    let v4H = RH, v4L = RL
    const limit = len - 32
    do {
      round64(v1H, v1L, read32(u8, i + 4), read32(u8, i)); v1H = RH; v1L = RL; i += 8
      round64(v2H, v2L, read32(u8, i + 4), read32(u8, i)); v2H = RH; v2L = RL; i += 8
      round64(v3H, v3L, read32(u8, i + 4), read32(u8, i)); v3H = RH; v3L = RL; i += 8
      round64(v4H, v4L, read32(u8, i + 4), read32(u8, i)); v4H = RH; v4L = RL; i += 8
    } while (i <= limit)
    rotl64(v1H, v1L, 1); let aH = RH, aL = RL
    rotl64(v2H, v2L, 7); add64(aH, aL, RH, RL); aH = RH; aL = RL
    rotl64(v3H, v3L, 12); add64(aH, aL, RH, RL); aH = RH; aL = RL
    rotl64(v4H, v4L, 18); add64(aH, aL, RH, RL); aH = RH; aL = RL
    merge64(aH, aL, v1H, v1L); merge64(RH, RL, v2H, v2L)
    merge64(RH, RL, v3H, v3L); merge64(RH, RL, v4H, v4L)
    hH = RH; hL = RL
  } else {
    add64(sH, sL, P64_5H, P64_5L)
    hH = RH; hL = RL
  }
  // h += len (len < 2^53, so its high half is floor(len / 2^32))
  add64(hH, hL, Math.floor(len / 0x100000000) >>> 0, len >>> 0); hH = RH; hL = RL

  for (; i + 8 <= len; i += 8) {
    round64(0, 0, read32(u8, i + 4), read32(u8, i))
    hH = (hH ^ RH) >>> 0; hL = (hL ^ RL) >>> 0
    rotl64(hH, hL, 27)
    mul64(RH, RL, P64_1H, P64_1L)
    add64(RH, RL, P64_4H, P64_4L); hH = RH; hL = RL
  }
  if (i + 4 <= len) {
    mul64(0, read32(u8, i), P64_1H, P64_1L)
    hH = (hH ^ RH) >>> 0; hL = (hL ^ RL) >>> 0
    rotl64(hH, hL, 23)
    mul64(RH, RL, P64_2H, P64_2L)
    add64(RH, RL, P64_3H, P64_3L); hH = RH; hL = RL
    i += 4
  }
  for (; i < len; i++) {
    mul64(0, u8[i], P64_5H, P64_5L)
    hH = (hH ^ RH) >>> 0; hL = (hL ^ RL) >>> 0
    rotl64(hH, hL, 11)
    mul64(RH, RL, P64_1H, P64_1L); hH = RH; hL = RL
  }
  // avalanche
  hL = (hL ^ (hH >>> 1)) >>> 0 // h ^= h >> 33
  mul64(hH, hL, P64_2H, P64_2L); hH = RH; hL = RL
  hL = (hL ^ ((hL >>> 29) | (hH << 3))) >>> 0 // h ^= h >> 29 (low word first: it reads the old high word)
  hH = (hH ^ (hH >>> 29)) >>> 0
  mul64(hH, hL, P64_3H, P64_3L); hH = RH; hL = RL
  hL = (hL ^ hH) >>> 0 // h ^= h >> 32
  return (BigInt(hH) << 32n) | BigInt(hL)
}
