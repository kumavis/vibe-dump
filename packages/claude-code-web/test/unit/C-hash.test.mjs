// Track C: Bun.hash family, CryptoHasher and the SHA classes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import nodeCrypto from 'node:crypto'
import zlib from 'node:zlib'
import { vendor } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'
import { xxHash32, xxHash64 } from '../../src/runtime/bun/xxhash.js'
import { crc32, adler32 } from '../../src/runtime/bun/hash.js'

const te = new TextEncoder()
const bunNode = createBun({ vendor, crypto: nodeCrypto }) // hashes via node:crypto
const bunNoble = createBun({ vendor }) // hashes via @noble/hashes directly

// Straightforward BigInt transcription of the xxHash64 spec, as an oracle for
// the 32-bit-limb implementation.
function xxh64Reference(u8, seed = 0n) {
  const M = (1n << 64n) - 1n
  const P1 = 0x9E3779B185EBCA87n, P2 = 0xC2B2AE3D27D4EB4Fn, P3 = 0x165667B19E3779F9n, P4 = 0x85EBCA77C2B2AE63n, P5 = 0x27D4EB2F165667C5n
  const rotl = (x, r) => ((x << BigInt(r)) | (x >> BigInt(64 - r))) & M
  const r64 = (i) => { let v = 0n; for (let k = 7; k >= 0; k--) v = (v << 8n) | BigInt(u8[i + k]); return v }
  const r32 = (i) => BigInt((u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24)) >>> 0)
  const round = (acc, x) => (rotl((acc + x * P2) & M, 31) * P1) & M
  const merge = (acc, v) => (((acc ^ round(0n, v)) * P1) & M) + P4 & M
  let i = 0
  let h
  if (u8.length >= 32) {
    let v = [(seed + P1 + P2) & M, (seed + P2) & M, seed, (seed - P1) & M]
    for (; i + 32 <= u8.length; i += 32) v = v.map((acc, k) => round(acc, r64(i + 8 * k)))
    h = (rotl(v[0], 1) + rotl(v[1], 7) + rotl(v[2], 12) + rotl(v[3], 18)) & M
    for (const x of v) h = merge(h, x)
  } else h = (seed + P5) & M
  h = (h + BigInt(u8.length)) & M
  for (; i + 8 <= u8.length; i += 8) h = (rotl(h ^ round(0n, r64(i)), 27) * P1 + P4) & M
  if (i + 4 <= u8.length) { h = (rotl(h ^ ((r32(i) * P1) & M), 23) * P2 + P3) & M; i += 4 }
  for (; i < u8.length; i++) h = (rotl(h ^ ((BigInt(u8[i]) * P5) & M), 11) * P1) & M
  h ^= h >> 33n; h = (h * P2) & M; h ^= h >> 29n; h = (h * P3) & M; h ^= h >> 32n
  return h
}

test('xxHash64 matches published vectors', () => {
  assert.equal(xxHash64(te.encode('')), 0xEF46DB3751D8E999n)
  assert.equal(xxHash64(te.encode('a')), 0xD24EC4F1A98C6E5Bn)
  assert.equal(xxHash64(te.encode('abc')), 0x44BC2CF5AD770999n)
  assert.equal(xxHash64(te.encode('Nobody inspects the spammish repetition')), 0xFBCEA83C8A378BF1n)
})

test('xxHash32 matches published vectors', () => {
  assert.equal(xxHash32(te.encode('')), 0x02CC5D05)
  assert.equal(xxHash32(te.encode('a')), 0x550D7456)
  assert.equal(xxHash32(te.encode('abc')), 0x32D153FF)
  assert.equal(xxHash32(te.encode('Nobody inspects the spammish repetition')), 0xE2293B2F)
})

test('xxHash64 agrees with a BigInt reference for every length 0..300 and with seeds', () => {
  const buf = nodeCrypto.randomBytes(300)
  for (let n = 0; n <= 300; n++) assert.equal(xxHash64(buf.subarray(0, n)), xxh64Reference(buf.subarray(0, n)), `len ${n}`)
  for (const seed of [1n, 0xffffffffn, 0x123456789abcdefn, (1n << 64n) - 1n]) {
    assert.equal(xxHash64(buf.subarray(0, 77), seed), xxh64Reference(buf.subarray(0, 77), seed), `seed ${seed}`)
  }
})

test('xxHash64 low 32 bits equal libzstd frame checksums (independent implementation)', { skip: typeof zlib.zstdCompressSync !== 'function' && 'node:zlib has no zstd here' }, () => {
  for (let n = 0; n < 200; n++) {
    const buf = nodeCrypto.randomBytes(n < 80 ? n : 80 + n * 37)
    const frame = zlib.zstdCompressSync(buf, { params: { [zlib.constants.ZSTD_c_checksumFlag]: 1 } })
    assert.equal(Number(xxHash64(buf) & 0xffffffffn), frame.readUInt32LE(frame.length - 4), `len ${buf.length}`)
  }
})

test('Bun.hash: stable bigint, seedable, strings hash as UTF-8, call shapes the bundle uses', () => {
  const h = bunNode.hash('hello')
  assert.equal(typeof h, 'bigint')
  assert.equal(h, bunNode.hash('hello'))
  assert.equal(h, bunNode.hash(te.encode('hello')))
  assert.equal(h, bunNode.hash(te.encode('hello').buffer))
  assert.equal(h, xxHash64(te.encode('hello')))
  assert.notEqual(bunNode.hash('hello', 1), h)
  // seeded with another hash, as the bundle does
  assert.equal(bunNode.hash('b', bunNode.hash('a')), bunNode.hash('b', bunNode.hash('a')))
  assert.notEqual(bunNode.hash('b', bunNode.hash('a')), bunNode.hash('b', bunNode.hash('c')))
  assert.match(bunNode.hash('x').toString(36), /^[0-9a-z]+$/)
  assert.equal(typeof Number(bunNode.hash('x') & 0xffffffffn), 'number')
  assert.equal(bunNode.hash.wyhash, bunNode.hash)
  assert.equal(bunNode.hash.xxHash64('abc'), 0x44BC2CF5AD770999n)
  assert.equal(bunNode.hash.xxHash32('abc'), 0x32D153FF)
  assert.equal(bunNode.hash('日本語 🎉'), xxHash64(Buffer.from('日本語 🎉', 'utf8')))
})

test('Bun.hash.crc32 and adler32 equal zlib', () => {
  assert.equal(bunNode.hash.crc32('123456789'), 0xCBF43926)
  assert.equal(bunNode.hash.crc32(''), 0)
  assert.equal(adler32(te.encode('Wikipedia')), 0x11E60398)
  for (let n = 0; n < 50; n++) {
    const buf = nodeCrypto.randomBytes(n * 997)
    if (typeof zlib.crc32 === 'function') assert.equal(crc32(buf), zlib.crc32(buf))
    // continuing a crc over two halves gives the crc of the whole
    const half = buf.length >> 1
    assert.equal(bunNode.hash.crc32(buf.subarray(half), bunNode.hash.crc32(buf.subarray(0, half))), crc32(buf))
  }
  // adler32 over > 5552 bytes exercises the deferred modulo
  const big = nodeCrypto.randomBytes(100000)
  let a = 1, b = 0
  for (const byte of big) { a = (a + byte) % 65521; b = (b + a) % 65521 }
  assert.equal(adler32(big), ((b << 16) | a) >>> 0)
})

test('Bun.SHA256.hash: known digest, base64 as the bundle calls it, raw Uint8Array, output buffer', () => {
  const hex = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  for (const bun of [bunNode, bunNoble]) {
    assert.equal(bun.SHA256.hash('abc', 'hex'), hex)
    assert.equal(bun.SHA256.hash(te.encode('abc'), 'base64'), Buffer.from(hex, 'hex').toString('base64'))
    const raw = bun.SHA256.hash(te.encode('abc').subarray(0, 3))
    assert.ok(raw instanceof Uint8Array)
    assert.equal(Buffer.from(raw).toString('hex'), hex)
    const out = new Uint8Array(32)
    assert.equal(bun.SHA256.hash('abc', out), out)
    assert.equal(Buffer.from(out).toString('hex'), hex)
    assert.equal(bun.SHA256.byteLength, 32)
    assert.equal(new bun.SHA256().update('a').update('bc').digest('hex'), hex)
    // empty input
    assert.equal(bun.SHA256.hash('', 'hex'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  }
  // a subarray view hashes only its own bytes
  const big = te.encode('xxabcxx')
  assert.equal(bunNode.SHA256.hash(big.subarray(2, 5), 'hex'), hex)
})

test('CryptoHasher: algorithms, encodings, incremental, copy, HMAC; node:crypto and noble agree', () => {
  const input = nodeCrypto.randomBytes(1000)
  for (const alg of ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'sha512-256']) {
    const want = nodeCrypto.createHash(alg).update(input).digest('hex')
    for (const bun of [bunNode, bunNoble]) {
      assert.equal(new bun.CryptoHasher(alg).update(input).digest('hex'), want, alg)
      assert.equal(bun.CryptoHasher.hash(alg, input, 'base64'), Buffer.from(want, 'hex').toString('base64'))
    }
  }
  const h = new bunNode.CryptoHasher('SHA-256')
  assert.equal(h.algorithm, 'sha256')
  assert.equal(h.byteLength, 32)
  h.update('hello ')
  const c = h.copy()
  h.update('world')
  c.update('there')
  assert.equal(h.digest('hex'), nodeCrypto.createHash('sha256').update('hello world').digest('hex'))
  assert.equal(c.digest('hex'), nodeCrypto.createHash('sha256').update('hello there').digest('hex'))
  // raw digest is a Buffer (Uint8Array subclass), and the hasher starts over
  const raw = h.update('x').digest()
  assert.ok(Buffer.isBuffer(raw))
  assert.equal(raw.toString('hex'), nodeCrypto.createHash('sha256').update('x').digest('hex'))
  // input encodings
  assert.equal(new bunNoble.CryptoHasher('sha256').update('616263', 'hex').digest('hex'), bunNoble.SHA256.hash('abc', 'hex'))
  assert.equal(new bunNoble.CryptoHasher('sha256').update('YWJj', 'base64').digest('base64url'), Buffer.from(bunNoble.SHA256.hash('abc', 'hex'), 'hex').toString('base64url'))
  // HMAC
  for (const bun of [bunNode, bunNoble]) {
    assert.equal(new bun.CryptoHasher('sha256', 'key').update('msg').digest('hex'), nodeCrypto.createHmac('sha256', 'key').update('msg').digest('hex'))
  }
  assert.throws(() => new bunNode.CryptoHasher('nope'), /Unsupported algorithm/)
  assert.ok(bunNode.CryptoHasher.algorithms.includes('sha256'))
})
