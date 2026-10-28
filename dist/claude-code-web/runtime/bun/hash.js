// Bun.hash (+ .wyhash .xxHash32 .xxHash64 .crc32 .adler32), Bun.CryptoHasher,
// Bun.SHA256 and its siblings.
//
// Bun.hash() is wyhash in Bun. The 2.1.311 bundle only uses its value as an
// in-process cache key / content fingerprint (`.toString(36)`, `& 0xffffffffn`,
// and as the seed of a second call), and a browser session never sees hashes
// made by a native Bun, so a real seeded 64-bit hash is enough: we use
// xxHash64, which is also exact for Bun.hash.xxHash64. (The FreeBSD port used a
// SHA-256 prefix and ignored the seed.) crc32 and adler32 are the exact zlib
// algorithms; crc32 is used for gzip trailers and PNG chunks.
//
// The cryptographic hashes run on deps.crypto.createHash (track B's sync shim,
// itself noble) when given, otherwise directly on the vendored @noble/hashes.
import { xxHash32, xxHash64 } from './xxhash.js'
import { toBytes, decodeString, encodeBytes, asBuffer } from './bytes.js'

let CRC_TABLE = null

function crcTable() {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
}

/** CRC-32 (IEEE, as zlib); `seed` continues a previous crc like zlib.crc32(data, value). */
export function crc32(data, seed = 0) {
  const u8 = toBytes(data)
  const t = (CRC_TABLE ??= crcTable())
  let c = ~(seed >>> 0)
  for (let i = 0; i < u8.length; i++) c = t[(c ^ u8[i]) & 0xff] ^ (c >>> 8)
  return ~c >>> 0
}

/** Adler-32 (as zlib); `seed` continues a previous checksum. */
export function adler32(data, seed = 1) {
  const u8 = toBytes(data)
  let a = seed & 0xffff
  let b = (seed >>> 16) & 0xffff
  // 5552 is the most bytes that can be summed before b may exceed 2^32
  for (let i = 0; i < u8.length;) {
    const end = Math.min(u8.length, i + 5552)
    for (; i < end; i++) { a += u8[i]; b += a }
    a %= 65521
    b %= 65521
  }
  return ((b << 16) | a) >>> 0
}

const u32Seed = (seed) => (typeof seed === 'bigint' ? Number(BigInt.asUintN(32, seed)) : Number(seed ?? 0) >>> 0)

export function makeBunHash() {
  const hash = (data, seed) => xxHash64(toBytes(data), seed)
  hash.wyhash = hash
  hash.xxHash64 = (data, seed) => xxHash64(toBytes(data), seed)
  hash.xxHash32 = (data, seed) => xxHash32(toBytes(data), u32Seed(seed))
  hash.crc32 = (data, seed) => crc32(data, u32Seed(seed))
  hash.adler32 = (data, seed) => adler32(data, seed === undefined ? 1 : u32Seed(seed))
  return hash
}

// --- cryptographic hashes ------------------------------------------------------

// canonical name -> [vendor export, digest bytes]
const ALGS = {
  md5: ['md5', 16],
  sha1: ['sha1', 20],
  sha224: ['sha224', 28],
  sha256: ['sha256', 32],
  sha384: ['sha384', 48],
  sha512: ['sha512', 64],
  'sha512-256': ['sha512_256', 32],
  ripemd160: ['ripemd160', 20],
  'sha3-256': ['sha3_256', 32],
  'sha3-512': ['sha3_512', 64],
}

function canonical(algorithm) {
  const a = String(algorithm).toLowerCase().replace(/^sha-(\d)/, 'sha$1').replace('_', '-')
  if (!ALGS[a]) throw new TypeError(`Unsupported algorithm "${algorithm}"`)
  return a
}

const viewOf = (d) => new Uint8Array(d.buffer, d.byteOffset, d.byteLength)

function nodeBackend(h) {
  return {
    update: (u8) => { h.update(u8) },
    digest: () => viewOf(h.digest()),
    clone: () => {
      if (typeof h.copy !== 'function') throw new Error('this hasher cannot be copied')
      return nodeBackend(h.copy())
    },
  }
}

function nobleBackend(h) {
  return {
    update: (u8) => { h.update(u8) },
    digest: () => h.digest(),
    clone: () => nobleBackend(h.clone()),
  }
}

function makeBackend(deps, alg, key) {
  const crypto = deps.crypto
  const noble = deps.vendor?.[ALGS[alg][0]]
  if (crypto && typeof crypto.createHash === 'function') {
    try {
      return nodeBackend(key === undefined ? crypto.createHash(alg) : crypto.createHmac(alg, key))
    } catch (e) {
      if (!noble) throw e // fall through to noble for algorithms the shim lacks
    }
  }
  if (!noble) throw new Error(`Bun.CryptoHasher: no ${alg} implementation (needs deps.crypto or the vendored @noble/hashes)`)
  if (key === undefined) return nobleBackend(noble.create())
  if (!deps.vendor.hmac) throw new Error('Bun.CryptoHasher: HMAC needs the vendored @noble/hashes/hmac')
  return nobleBackend(deps.vendor.hmac.create(noble, key))
}

function inputBytes(data, encoding) {
  return typeof data === 'string' && encoding ? decodeString(data, encoding) : toBytes(data)
}

// digest(out): a DigestEncoding string, a TypedArray to fill, or nothing (raw bytes)
function finish(bytes, out, rawAs) {
  if (typeof out === 'string') return encodeBytes(bytes, out)
  if (out && ArrayBuffer.isView(out)) {
    const view = viewOf(out)
    if (view.length < bytes.length) throw new TypeError(`output buffer is too small (${view.length} < ${bytes.length} bytes)`)
    view.set(bytes)
    return out
  }
  return rawAs(bytes)
}

/**
 * Builds { CryptoHasher, SHA1, MD5, SHA224, SHA256, SHA384, SHA512, SHA512_256 }
 * over deps = { crypto?, vendor?, Buffer? }.
 */
export function makeHashers(deps) {
  const toBuf = (u8) => asBuffer(u8, deps.Buffer ?? globalThis.Buffer)

  class CryptoHasher {
    #alg
    #key
    #backend

    // new CryptoHasher(algorithm, hmacKey?)
    constructor(algorithm, hmacKey) {
      this.#alg = canonical(algorithm)
      this.#key = hmacKey === undefined || hmacKey === null ? undefined : toBytes(hmacKey)
      this.#backend = makeBackend(deps, this.#alg, this.#key)
    }

    get algorithm() { return this.#alg }
    get byteLength() { return ALGS[this.#alg][1] }

    update(data, inputEncoding) {
      this.#backend.update(inputBytes(data, inputEncoding))
      return this
    }

    // Raw output is a Buffer, as in Bun. The hasher starts over afterwards.
    digest(out) {
      const bytes = this.#backend.digest()
      this.#backend = makeBackend(deps, this.#alg, this.#key)
      return finish(bytes, out, toBuf)
    }

    copy() {
      const c = new CryptoHasher(this.#alg, this.#key)
      c.#backend = this.#backend.clone()
      return c
    }

    static get algorithms() { return Object.keys(ALGS) }

    static hash(algorithm, input, out) {
      return new CryptoHasher(algorithm).update(input).digest(out)
    }
  }

  // Bun.SHA256 and friends: `X.hash(input, encoding?)` static plus an instance
  // form. Raw output is a Uint8Array (the bundle only uses SHA256.hash(bytes, "base64")).
  const fixed = (alg) => class {
    #h = new CryptoHasher(alg)
    static byteLength = ALGS[alg][1]
    static hash(input, out) {
      return finish(new CryptoHasher(alg).update(input).digest(), out, (u8) => new Uint8Array(u8))
    }

    get byteLength() { return ALGS[alg][1] }
    update(data, inputEncoding) { this.#h.update(data, inputEncoding); return this }
    digest(out) { return finish(this.#h.digest(), out, (u8) => new Uint8Array(u8)) }
  }

  return {
    CryptoHasher,
    MD5: fixed('md5'),
    SHA1: fixed('sha1'),
    SHA224: fixed('sha224'),
    SHA256: fixed('sha256'),
    SHA384: fixed('sha384'),
    SHA512: fixed('sha512'),
    SHA512_256: fixed('sha512-256'),
  }
}
