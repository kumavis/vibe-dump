// Track A: streaming .tgz reader (gunzip via DecompressionStream + ustar).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { readTarballEntries } from '../../src/extract/tar.js'
import { KNOWN_BUILDS } from '../../src/extract/builds.js'

const RESEARCH = process.env.CC_RESEARCH_DIR ||
  '/tmp/claude-0/-home-user-vibe-dump/5b506f29-8275-5bfc-ac58-3487cb33f8da/scratchpad/research'
const LINUX_TGZ = path.join(RESEARCH, 'pkg-linux-x64/anthropic-ai-claude-code-linux-x64-2.1.311.tgz')
const missing = (p) => (fs.existsSync(p) ? false : `scratchpad artifact missing: ${p}`)

// --- a tiny tar writer, enough to exercise the reader's branches ---------
function header (name, size, { type = '0', prefix = '', mode = 0o644 } = {}) {
  const h = Buffer.alloc(512)
  h.write(name, 0, 100, 'utf8')
  h.write(mode.toString(8).padStart(7, '0') + '\0', 100)
  h.write('0000000\0', 108)
  h.write('0000000\0', 116)
  h.write(size.toString(8).padStart(11, '0') + '\0', 124)
  h.write('14000000000\0', 136)
  h.write('        ', 148)
  h.write(type, 156)
  h.write('ustar\0', 257)
  h.write('00', 263)
  h.write(prefix, 345, 155, 'utf8')
  let sum = 0
  for (const b of h) sum += b
  h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148)
  return h
}
const pad = (b) => Buffer.concat([b, Buffer.alloc((512 - (b.length % 512)) % 512)])
function entry (name, data, opts) { const b = Buffer.from(data); return Buffer.concat([header(name, b.length, opts), pad(b)]) }
function paxRecord (key, value) {
  const body = ` ${key}=${value}\n`
  let len = body.length + 1
  while (String(len).length + body.length !== len) len = String(len).length + body.length
  return `${len}${body}`
}
const END = Buffer.alloc(1024)

function sampleTar () {
  const longName = 'package/' + 'very-long-directory-name/'.repeat(6) + 'file.txt'
  const paxName = 'package/pax/' + 'p'.repeat(150) + '.js'
  const big = crypto.randomBytes(70000) // spans many 512-byte blocks and stream chunks
  return {
    longName,
    paxName,
    big,
    tar: Buffer.concat([
      entry('package/', '', { type: '5' }),
      entry('package/README.md', 'hello\n'),
      entry('file.bin', big, { prefix: 'package/deep/dir' }),
      entry('././@LongLink', longName + '\0', { type: 'L' }),
      entry('ignored-short-name', 'from GNU long name'),
      entry('PaxHeader', paxRecord('path', paxName), { type: 'x' }),
      entry('short', 'from pax'),
      entry('package/empty', ''),
      END
    ])
  }
}

async function collect (input, opts) {
  const out = []
  for await (const e of readTarballEntries(input, opts)) out.push(e)
  return out
}

test('tar: ustar prefix, GNU long names, pax paths, directories skipped', async () => {
  const { tar, big, longName, paxName } = sampleTar()
  const entries = await collect(new Blob([zlib.gzipSync(tar)]))
  assert.deepEqual(entries.map((e) => e.path), ['package/README.md', 'package/deep/dir/file.bin', longName, paxName, 'package/empty'])
  assert.equal(new TextDecoder().decode(entries[0].bytes), 'hello\n')
  assert.ok(Buffer.from(entries[1].bytes).equals(big))
  assert.equal(new TextDecoder().decode(entries[2].bytes), 'from GNU long name')
  assert.equal(new TextDecoder().decode(entries[3].bytes), 'from pax')
  assert.equal(entries[4].bytes.length, 0)
  assert.equal(entries[0].mode, 0o644)
})

test('tar: filter skips entries without buffering; plain tar via gzip:false; Uint8Array input', async () => {
  const { tar, big } = sampleTar()
  const seen = []
  const entries = await collect(new Uint8Array(tar), { gzip: false, filter: (h) => { seen.push(h.path); return h.path.endsWith('.bin') } })
  assert.equal(entries.length, 1)
  assert.ok(Buffer.from(entries[0].bytes).equals(big))
  assert.equal(seen.length, 5) // the directory never reaches the filter
})

test('tar: corrupt header checksum and truncated archives throw', async () => {
  const { tar } = sampleTar()
  const bad = Buffer.from(tar)
  bad[0] ^= 0xff // corrupt the first name byte; checksum no longer matches
  await assert.rejects(collect(new Blob([zlib.gzipSync(bad)])), /checksum/)
  const gz = zlib.gzipSync(tar)
  await assert.rejects(collect(new Blob([gz.subarray(0, gz.length >> 1)])), /corrupt or truncated/)
  // A bad CRC32 in the gzip trailer is only seen if the reader drains to the
  // end after the end-of-archive blocks, which it does.
  const crcBad = Buffer.from(gz)
  crcBad[crcBad.length - 8] ^= 0xff
  await assert.rejects(collect(new Blob([crcBad])), /corrupt or truncated/)
})

test('tar: breaking out early cancels the decompressor', async () => {
  const { tar } = sampleTar()
  for await (const e of readTarballEntries(new Blob([zlib.gzipSync(tar)]))) {
    assert.equal(e.path, 'package/README.md')
    break
  }
})

test('tar: real npm tarball (linux-x64 2.1.311) streams out the 294 MB executable intact', { skip: missing(LINUX_TGZ) }, async () => {
  const known = KNOWN_BUILDS.find((b) => b.platform === 'linux-x64')
  // Integrity of the input itself (npm's dist.integrity for this tarball).
  const sri = 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(LINUX_TGZ)).digest('base64')
  assert.equal(sri, known.integrity)

  const stream = fs.createReadStream(LINUX_TGZ)
  const web = new ReadableStream({
    start (c) {
      stream.on('data', (d) => c.enqueue(new Uint8Array(d.buffer, d.byteOffset, d.length)))
      stream.on('end', () => c.close())
      stream.on('error', (e) => c.error(e))
    }
  })
  const names = []
  let claude = null
  for await (const e of readTarballEntries(web, { filter: (h) => { names.push(h.path); return h.path === 'package/claude' } })) claude = e
  assert.deepEqual(names.sort(), ['package/LICENSE.md', 'package/README.md', 'package/claude', 'package/package.json'])
  assert.equal(claude.size, 293776752)
  assert.equal(claude.bytes.length, claude.size)
  assert.equal(claude.mode, 0o755)
  assert.equal(crypto.createHash('sha256').update(claude.bytes).digest('hex'), known.binarySha256)
})
