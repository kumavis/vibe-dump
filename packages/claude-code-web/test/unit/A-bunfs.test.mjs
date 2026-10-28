// Track A: Bun payload locator and module-table parser.
//
// The real-binary test is the contract from ARCHITECTURE.md: parsing the
// 2.1.311 linux-x64 ELF must give a tree byte-identical to unhare's
// extraction (names, sizes and sha256 of every file).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { findBunPayload, parseBunfs, detectVersion, normalizeModuleName, BUN_MAGIC, BunPayloadError } from '../../src/extract/bunfs.js'
import { treeSha256 } from '../../src/extract/hash.js'
import { KNOWN_BUILDS } from '../../src/extract/builds.js'
import { RESEARCH_DIR } from '../research.mjs'

const RESEARCH = RESEARCH_DIR
const LINUX_BIN = path.join(RESEARCH, 'pkg-linux-x64/package/claude')
const UNHARE = path.join(RESEARCH, 'spike-E/extract-unhare')
const missing = (...ps) => ps.find((p) => !fs.existsSync(p)) ? `scratchpad artifact missing: ${ps.find((p) => !fs.existsSync(p))}` : false

// --- synthetic payloads ---------------------------------------------------
const te = new TextEncoder()
function u32 (dv, o, v) { dv.setUint32(o, v, true) }
/**
 * [prefix][blob = contents + names + table][Offsets][MAGIC][suffix]
 * modules: [{name, bytes, encoding: 0|1|2, loader}]
 */
function buildBinary (modules, { entryId = 0, prefix = new Uint8Array(64), suffix = new Uint8Array(100) } = {}) {
  const parts = []
  let off = 0
  const add = (u8) => { const p = { off, len: u8.length }; parts.push(u8); off += u8.length; return p }
  const recs = modules.map((m) => ({ name: add(te.encode(m.name)), contents: add(m.bytes), enc: m.encoding ?? 1, loader: m.loader ?? 1 }))
  const table = new Uint8Array(52 * recs.length)
  const tdv = new DataView(table.buffer)
  recs.forEach((r, i) => {
    u32(tdv, i * 52, r.name.off); u32(tdv, i * 52 + 4, r.name.len)
    u32(tdv, i * 52 + 8, r.contents.off); u32(tdv, i * 52 + 12, r.contents.len)
    table[i * 52 + 48] = r.enc
    table[i * 52 + 49] = r.loader
  })
  const tablePtr = add(table)
  const blobLen = off
  const offsets = new Uint8Array(32)
  const odv = new DataView(offsets.buffer)
  odv.setBigUint64(0, BigInt(blobLen), true)
  u32(odv, 8, tablePtr.off); u32(odv, 12, tablePtr.len)
  u32(odv, 16, entryId)
  u32(odv, 20, 0); u32(odv, 24, 0)
  u32(odv, 28, 0x3bff)
  const all = [prefix, ...parts, offsets, BUN_MAGIC, suffix]
  const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of all) { out.set(p, o); o += p.length }
  return out
}

function utf16le (s) {
  const b = new Uint8Array(s.length * 2)
  for (let i = 0; i < s.length; i++) { b[2 * i] = s.charCodeAt(i) & 0xff; b[2 * i + 1] = s.charCodeAt(i) >> 8 }
  return b
}

test('bunfs: synthetic payload with decoy markers before and after', () => {
  // A decoy marker inside the "runtime" before the payload (as in the real
  // ELF), and one after it whose Offsets cannot validate.
  const decoy = new Uint8Array(200)
  decoy.set(BUN_MAGIC, 50)
  const after = new Uint8Array(300)
  after.set(BUN_MAGIC, 120) // preceded by zeros -> byte_count 0 -> rejected
  const bin = buildBinary([
    { name: '/$bunfs/root/chunk-a.js', bytes: te.encode('export const a = 1\n') },
    { name: '/$bunfs/root/cli', bytes: te.encode('// Version: 9.9.9\nimport "/$bunfs/root/chunk-a.js"\n') },
    { name: '/$bunfs/root/doc.md', bytes: utf16le('caf\u00e9 \u2192 ok'), encoding: 2, loader: 13 },
    { name: '/$bunfs/root/../escape.js', bytes: te.encode('nope') },
    { name: 'B:\\~BUN\\root\\win\\x.js', bytes: te.encode('win') },
    { name: '/$bunfs/root/img.bin', bytes: new Uint8Array([0, 255, 128, 7]), encoding: 0, loader: 5 }
  ], { entryId: 1, prefix: decoy, suffix: after })

  const p = findBunPayload(bin)
  assert.equal(p.container, 'unknown')
  assert.equal(p.moduleCount, 6)
  assert.equal(p.entryId, 1)
  assert.equal(p.bytesAfterMarker, 300)
  assert.equal(p.blobStart, 200)

  const r = parseBunfs(bin)
  assert.equal(r.entry, '/$bunfs/root/cli')
  // Windows-style "B:\~BUN\root\..." names are normalised to /$bunfs/root/...
  assert.deepEqual([...r.files.keys()],
    ['/$bunfs/root/chunk-a.js', '/$bunfs/root/cli', '/$bunfs/root/doc.md', '/$bunfs/root/win/x.js', '/$bunfs/root/img.bin'])
  assert.deepEqual(r.skipped, ['/$bunfs/root/../escape.js'])
  assert.equal(new TextDecoder().decode(r.files.get('/$bunfs/root/doc.md').bytes), 'caf\u00e9 \u2192 ok') // UTF-16LE -> UTF-8
  assert.equal(r.files.get('/$bunfs/root/doc.md').encoding, 'utf16le')
  assert.equal(r.files.get('/$bunfs/root/doc.md').loader, 'text')
  assert.deepEqual([...r.files.get('/$bunfs/root/img.bin').bytes], [0, 255, 128, 7])
  // views, not copies
  assert.equal(r.files.get('/$bunfs/root/img.bin').bytes.buffer, bin.buffer)
  assert.equal(detectVersion(r.files, r.entry), '9.9.9')
})

test('bunfs: no payload, broken tables and bad names', () => {
  assert.throws(() => findBunPayload(new Uint8Array(4096)), BunPayloadError)
  const onlyMagic = new Uint8Array(4096)
  onlyMagic.set(BUN_MAGIC, 4000)
  assert.throws(() => findBunPayload(onlyMagic), BunPayloadError)
  // A module slice pointing past the blob is an error, not a short file.
  const bin = buildBinary([{ name: '/$bunfs/root/cli', bytes: te.encode('x') }])
  const dv = new DataView(bin.buffer)
  const p = findBunPayload(bin)
  u32(dv, p.blobStart + p.modules.off + 12, 1e6)
  assert.throws(() => parseBunfs(bin), /outside/)

  assert.equal(normalizeModuleName('/$bunfs/root/a/b.js'), '/$bunfs/root/a/b.js')
  assert.equal(normalizeModuleName('B:/~BUN/root/a.js'), '/$bunfs/root/a.js')
  for (const bad of ['/etc/passwd', '/$bunfs//x', '/$bunfs/root/./x', '/$bunfs/root/a/../../x', 'root/cli', '/$bunfs/']) {
    assert.equal(normalizeModuleName(bad), null, bad)
  }
})

function walk (dir, base = dir, out = new Map()) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, base, out)
    else out.set(path.relative(base, p), p)
  }
  return out
}

test('bunfs: 2.1.311 linux-x64 ELF parses to a tree byte-identical to unhare', { skip: missing(LINUX_BIN, UNHARE) }, async () => {
  const buf = fs.readFileSync(LINUX_BIN)
  const bin = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  const p = findBunPayload(bin)
  // Report E §1: trailerAt 293717290, blobStart 115363848, byteCount 178353410, 2848 modules, entry 7, flags 0x3bff, 59446 bytes after.
  assert.deepEqual(
    { container: p.container, magicOffset: p.magicOffset, blobStart: p.blobStart, byteCount: p.byteCount, moduleCount: p.moduleCount, entryId: p.entryId, flags: p.flags, bytesAfterMarker: p.bytesAfterMarker },
    { container: 'elf', magicOffset: 293717290, blobStart: 115363848, byteCount: 178353410, moduleCount: 2848, entryId: 7, flags: 0x3bff, bytesAfterMarker: 59446 })

  const r = parseBunfs(bin, p)
  assert.equal(r.entry, '/$bunfs/root/cli')
  assert.equal(r.argv, '')
  assert.deepEqual(r.skipped, [])
  assert.equal(detectVersion(r.files, r.entry), '2.1.311')
  const enc = { binary: 0, latin1: 0, utf16le: 0 }
  for (const f of r.files.values()) enc[f.encoding]++
  assert.deepEqual(enc, { binary: 144, latin1: 2689, utf16le: 15 })

  // Every file: same name set, same size, same sha256 as unhare's output.
  const disk = walk(UNHARE)
  const ours = new Map([...r.files].map(([n, f]) => [n.slice('/$bunfs/'.length), f.bytes]))
  assert.equal(ours.size, 2848)
  assert.deepEqual([...ours.keys()].sort(), [...disk.keys()].sort())
  let bytes = 0
  for (const [rel, b] of ours) {
    const d = fs.readFileSync(disk.get(rel))
    assert.equal(b.length, d.length, `size of ${rel}`)
    assert.equal(crypto.createHash('sha256').update(b).digest('hex'), crypto.createHash('sha256').update(d).digest('hex'), `sha256 of ${rel}`)
    bytes += b.length
  }
  assert.equal(bytes, 54725814) // report E: 54,725,814 bytes extracted

  // ...and the tree hash builds.js pins (== `sha256sum` over the unhare tree).
  const { sha256 } = await treeSha256(ours)
  assert.equal(sha256, KNOWN_BUILDS.find((b) => b.platform === 'linux-x64').treeSha256)
})
