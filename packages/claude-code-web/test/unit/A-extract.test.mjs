// Track A: the whole pipeline, extractFromBinary, as the page drives it:
// a dropped file (Blob) and an npm download (Response over the .tgz), into
// the in-memory CacheStorage fake, then a "reload" that reuses the cache.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import {
  extractFromBinary, loadCurrentManifest, loadCachedFiles, createMemoryCaches, PINNED_VERSION,
  BunPayloadError, KNOWN_BUILDS, npmTarballUrl, cacheName
} from '../../src/extract/index.js'

const RESEARCH = process.env.CC_RESEARCH_DIR ||
  '/tmp/claude-0/-home-user-vibe-dump/5b506f29-8275-5bfc-ac58-3487cb33f8da/scratchpad/research'
const LINUX_BIN = path.join(RESEARCH, 'pkg-linux-x64/package/claude')
const LINUX_TGZ = path.join(RESEARCH, 'pkg-linux-x64/anthropic-ai-claude-code-linux-x64-2.1.311.tgz')
const missing = (p) => (fs.existsSync(p) ? false : `scratchpad artifact missing: ${p}`)
const APP = 'https://kumavis.github.io/vibe-dump/claude-code-web/vfs/app/'
const td = new TextDecoder()
const zstd = (u8) => zlib.zstdDecompressSync(u8)

test('extract: npm tarball URL for the pinned platform package', () => {
  assert.equal(npmTarballUrl(), 'https://registry.npmjs.org/@anthropic-ai/claude-code-linux-x64/-/claude-code-linux-x64-2.1.311.tgz')
  assert.equal(npmTarballUrl('darwin-arm64'), 'https://registry.npmjs.org/@anthropic-ai/claude-code-darwin-arm64/-/claude-code-darwin-arm64-2.1.311.tgz')
  assert.equal(KNOWN_BUILDS.length, 8)
})

test('extract: input that is not a Bun executable is rejected clearly', async () => {
  await assert.rejects(extractFromBinary(new Uint8Array(1 << 16), { appUrl: APP, caches: createMemoryCaches() }), BunPayloadError)
})

let fromDrop
test('extract: dropped linux-x64 binary -> rewritten tree in the cache, manifest as the acceptance test reads it', { skip: missing(LINUX_BIN) }, async () => {
  const caches = createMemoryCaches()
  const phases = []
  const file = await fs.openAsBlob(LINUX_BIN) // file-backed, like a dropped File
  const m = await extractFromBinary(file, {
    source: 'drop', version: PINNED_VERSION, appUrl: APP, caches, zstdDecompressSync: zstd, hashBinary: true,
    onProgress: (p) => { if (phases.at(-1) !== p.phase) phases.push(p.phase) }
  })
  fromDrop = m
  assert.deepEqual(phases, ['read', 'parse', 'hash', 'rewrite', 'graph', 'cache', 'done'])
  // the Worker's pre-import order, worked out at extraction (src/runtime/boot/module-graph.js)
  assert.equal(m.boot?.version, 1)
  assert.equal(m.boot.targets.length, 299, '299 distinct import.meta.require targets in 2.1.311')
  assert.ok(m.boot.order.length >= m.boot.targets.length)
  assert.deepEqual(m.boot.cyclic.length, 1, 'one top-level require inside an import cycle')
  assert.equal(m.version, '2.1.311')
  assert.equal(m.moduleCount, 2848) // every module in the binary
  assert.equal(m.files, 2846) // minus the two native .node addons
  assert.deepEqual([...m.excluded].sort(), ['audio-capture.node', 'clipboard-napi.node'])
  assert.equal(m.entry, 'cli')
  assert.equal(m.entryUrl, APP + 'cli')
  assert.equal(m.appPath, '/vibe-dump/claude-code-web/vfs/app/')
  assert.equal(m.cacheName, cacheName('2.1.311'))
  assert.equal(m.rewrites.ok, true)
  assert.ok(m.rewrites.rewrites.every((r) => r.ok && r.matches === r.expected.matches && r.files === r.expected.files))
  assert.deepEqual(m.rewrites.zst, { checked: 137, unchecked: 0, needRewrite: [] })
  const known = KNOWN_BUILDS.find((b) => b.platform === 'linux-x64')
  assert.equal(m.sourceSha256, known.treeSha256)
  assert.equal(m.source.platform, 'linux-x64')
  assert.equal(m.source.binarySha256, known.binarySha256)
  assert.equal(m.source.container, 'elf')
  assert.equal(m.source.flavor, 'linux')
  assert.equal(m.source.tarEntry, null)

  // A "reload": the manifest is found again without re-extracting...
  const again = await loadCurrentManifest(PINNED_VERSION, { appUrl: APP, caches })
  assert.deepEqual(again, m)
  // ...and the tree comes back out for the VFS, rewritten.
  const tree = await loadCachedFiles(again, { caches })
  assert.equal(tree.size, 2846)
  const cli = td.decode(tree.get('/vibe-dump/claude-code-web/vfs/app/cli'))
  assert.match(cli, /^\/\/ @bun @bytecode/)
  assert.match(cli, /import"\/vibe-dump\/claude-code-web\/vfs\/app\/chunk-[a-z0-9]{8}\.js"/)
  assert.ok(!cli.includes('$bunfs'))
})

test('extract: npm tarball (Response) gives the identical cached tree', { skip: missing(LINUX_TGZ) }, async () => {
  const caches = createMemoryCaches()
  const res = new Response(fs.createReadStream(LINUX_TGZ), { headers: { 'content-length': String(fs.statSync(LINUX_TGZ).size) } })
  let lastRead
  const m = await extractFromBinary(res, {
    source: 'npm', appUrl: APP, caches,
    onProgress: (p) => { if (p.phase === 'read') lastRead = p }
  })
  assert.equal(m.source.kind, 'npm')
  assert.equal(m.source.tarEntry, 'package/claude')
  assert.equal(lastRead.loaded, lastRead.total)
  assert.equal(m.rewrites.zst.unchecked, 137) // no decompressor passed: reported, not silently skipped
  if (fromDrop) {
    assert.equal(m.sha256, fromDrop.sha256)
    assert.deepEqual(m.paths, fromDrop.paths)
  }
})

test('extract: an already-gunzipped .tar (Content-Encoding: gzip served it) is sniffed too', { skip: missing(LINUX_BIN) }, async () => {
  const size = fs.statSync(LINUX_BIN).size
  const h = Buffer.alloc(512)
  h.write('package/claude', 0)
  h.write('0000755\0', 100)
  h.write(size.toString(8).padStart(11, '0') + '\0', 124)
  h.write('        ', 148)
  h.write('0', 156)
  h.write('ustar\0', 257)
  h.write('00', 263)
  let sum = 0
  for (const b of h) sum += b
  h.write(sum.toString(8).padStart(6, '0') + '\0 ', 148)
  const tar = new Blob([h, await fs.openAsBlob(LINUX_BIN), new Uint8Array((512 - (size % 512)) % 512), new Uint8Array(1024)])
  const m = await extractFromBinary(tar, { appUrl: APP, caches: createMemoryCaches() })
  assert.equal(m.source.tarEntry, 'package/claude')
  if (fromDrop) assert.equal(m.sha256, fromDrop.sha256)
})

test('extract: a different app URL produces a different (correctly rewritten) tree', { skip: missing(LINUX_BIN) }, async () => {
  const caches = createMemoryCaches()
  const m = await extractFromBinary(await fs.openAsBlob(LINUX_BIN), { appUrl: 'http://localhost:5173/vfs/app/', caches })
  assert.equal(m.appPath, '/vfs/app/')
  const tree = await loadCachedFiles(m, { caches })
  assert.match(td.decode(tree.get('/vfs/app/cli')), /import"\/vfs\/app\/chunk-/)
  assert.equal(await loadCurrentManifest(PINNED_VERSION, { appUrl: APP, caches }), null)
})
