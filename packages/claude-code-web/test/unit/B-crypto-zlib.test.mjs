// Track B: crypto (noble) and zlib (fflate + fzstd) shims checked against
// Node's own implementations.
import test from 'node:test'
import assert from 'node:assert/strict'
import nodeCrypto from 'node:crypto'
import nodeZlib from 'node:zlib'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { load, EXTRACTED_TREE } from './B-support.mjs'

const crypto = await load('node/crypto.js')
const zlib = await load('node/zlib.js')
const { Buffer } = await load('node/buffer.js')

test('hashes and HMACs match node:crypto', () => {
  const data = 'The quick brown fox jumps over the lazy dog \u{1F98A}'
  for (const alg of ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'sha512-256', 'sha3-256', 'ripemd160']) {
    for (const enc of ['hex', 'base64', 'base64url']) {
      assert.equal(crypto.createHash(alg).update(data).digest(enc), nodeCrypto.createHash(alg).update(data).digest(enc), `${alg}/${enc}`)
    }
    assert.equal(crypto.createHmac(alg, 'key').update(data).digest('hex'), nodeCrypto.createHmac(alg, 'key').update(data).digest('hex'), `hmac ${alg}`)
  }
  const h = crypto.createHash('sha256').update('a')
  const copy = h.copy()
  assert.equal(h.update('b').digest('hex'), nodeCrypto.createHash('sha256').update('ab').digest('hex'))
  assert.equal(copy.digest('hex'), nodeCrypto.createHash('sha256').update('a').digest('hex'))
  assert.throws(() => h.digest(), { code: 'ERR_CRYPTO_HASH_FINALIZED' })
  assert.ok(Buffer.isBuffer(crypto.createHash('sha1').update(Buffer.from([1, 2])).digest()))
  assert.equal(crypto.hash('sha1', 'x'), nodeCrypto.createHash('sha1').update('x').digest('hex'))
  assert.throws(() => crypto.createHash('whirlpool'), /Digest method not supported/)
})

test('key derivation matches node:crypto', () => {
  assert.equal(crypto.pbkdf2Sync('pw', 'salt', 1000, 32, 'sha256').toString('hex'), nodeCrypto.pbkdf2Sync('pw', 'salt', 1000, 32, 'sha256').toString('hex'))
  assert.equal(crypto.scryptSync('pw', 'salt', 16, { N: 1024 }).toString('hex'), nodeCrypto.scryptSync('pw', 'salt', 16, { N: 1024 }).toString('hex'))
  assert.deepEqual(Buffer.from(crypto.hkdfSync('sha256', 'ikm', 'salt', 'info', 24)), Buffer.from(nodeCrypto.hkdfSync('sha256', 'ikm', 'salt', 'info', 24)))
})

test('randomness and comparisons', async () => {
  const b = crypto.randomBytes(100000)
  assert.equal(b.length, 100000)
  assert.ok(new Set(b).size > 200)
  assert.match(crypto.randomUUID(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  for (let i = 0; i < 200; i++) { const n = crypto.randomInt(5, 10); assert.ok(n >= 5 && n < 10) }
  const viaCb = await new Promise((r) => crypto.randomBytes(8, (e, buf) => r(buf)))
  assert.equal(viaCb.length, 8)
  assert.equal(crypto.timingSafeEqual(Buffer.from('ab'), Buffer.from('ab')), true)
  assert.equal(crypto.timingSafeEqual(Buffer.from('ab'), Buffer.from('ac')), false)
  assert.throws(() => crypto.timingSafeEqual(Buffer.from('a'), Buffer.from('ab')), { code: 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH' })
  const key = crypto.createSecretKey(Buffer.from('k'))
  assert.equal(key.type, 'secret')
  assert.equal(crypto.createHmac('sha256', key).update('m').digest('hex'), nodeCrypto.createHmac('sha256', 'k').update('m').digest('hex'))
  for (const fn of ['createCipheriv', 'generateKeyPairSync', 'createSign', 'createPublicKey']) {
    assert.throws(() => crypto[fn](), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
  }
  assert.throws(() => new crypto.X509Certificate('x'), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
  assert.equal(crypto.webcrypto, globalThis.crypto)
})

test('zlib sync codecs interoperate with node:zlib', () => {
  const input = Buffer.from('hello hello hello '.repeat(200))
  const pairs = [
    ['gzipSync', 'gunzipSync'], ['deflateSync', 'inflateSync'], ['deflateRawSync', 'inflateRawSync'],
  ]
  for (const [enc, dec] of pairs) {
    assert.deepEqual(Buffer.from(nodeZlib[dec](zlib[enc](input))), Buffer.from(input), `node ${dec}(shim ${enc})`)
    assert.deepEqual(Buffer.from(zlib[dec](nodeZlib[enc](input))), Buffer.from(input), `shim ${dec}(node ${enc})`)
  }
  assert.equal(zlib.unzipSync(nodeZlib.gzipSync(input)).toString(), input.toString())
  assert.equal(zlib.unzipSync(nodeZlib.deflateSync(input)).toString(), input.toString())
  assert.throws(() => zlib.gunzipSync(Buffer.from('not gzip at all')), (e) => e.code === 'Z_DATA_ERROR')
  assert.equal(zlib.crc32('hello'), nodeZlib.crc32('hello'))
  assert.equal(zlib.crc32(Buffer.from('world'), zlib.crc32('hello ')), nodeZlib.crc32('hello world'))
})

test('zstdDecompressSync decodes zstd frames (and the bundle\'s .zst assets)', () => {
  const text = Buffer.from('zstd payload '.repeat(500))
  assert.equal(zlib.zstdDecompressSync(nodeZlib.zstdCompressSync(text)).toString(), text.toString())
  assert.throws(() => zlib.zstdCompressSync(text), { code: 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' })
})

test('real .zst assets from the extracted 2.1.311 tree', { skip: !existsSync(EXTRACTED_TREE) && `extracted tree not found at ${EXTRACTED_TREE}` }, () => {
  const zst = readdirSync(EXTRACTED_TREE).filter((n) => n.endsWith('.zst')).slice(0, 12)
  assert.ok(zst.length > 0)
  for (const name of zst) {
    const raw = readFileSync(join(EXTRACTED_TREE, name))
    assert.deepEqual(Buffer.from(zlib.zstdDecompressSync(raw)), Buffer.from(nodeZlib.zstdDecompressSync(raw)), name)
  }
})

test('zlib streams and async callbacks', async () => {
  const input = Buffer.from('stream me '.repeat(1000))
  const gz = nodeZlib.gzipSync(input)
  const out = await new Promise((resolve, reject) => {
    const g = zlib.createGunzip()
    const parts = []
    g.on('data', (d) => parts.push(d))
    g.on('end', () => resolve(Buffer.concat(parts)))
    g.on('error', reject)
    for (let i = 0; i < gz.length; i += 100) g.write(gz.subarray(i, i + 100))
    g.end()
  })
  assert.equal(out.toString(), input.toString())

  const deflated = await new Promise((resolve) => {
    const d = zlib.createDeflate()
    const parts = []
    d.on('data', (c) => parts.push(c))
    d.on('end', () => resolve(Buffer.concat(parts)))
    d.end(input)
  })
  assert.equal(nodeZlib.inflateSync(deflated).toString(), input.toString())

  const zs = await new Promise((resolve, reject) => {
    const z = zlib.createZstdDecompress()
    const parts = []
    z.on('data', (c) => parts.push(c))
    z.on('end', () => resolve(Buffer.concat(parts)))
    z.on('error', reject)
    z.end(nodeZlib.zstdCompressSync(input))
  })
  assert.equal(zs.toString(), input.toString())

  const viaCb = await new Promise((r) => zlib.gunzip(gz, (err, res) => r([err, res])))
  assert.equal(viaCb[0], null)
  assert.equal(viaCb[1].toString(), input.toString())
  const brErr = await new Promise((r) => { const b = zlib.createBrotliDecompress(); b.on('error', r); b.end(Buffer.from('x')) })
  assert.equal(brErr.code, 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM')
})
