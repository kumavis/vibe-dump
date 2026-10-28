// Track A: Cache API materializer + manifest loader, against the in-memory
// CacheStorage fake (the real Cache API does not exist under Node).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  materialize, loadCachedManifest, loadCachedFiles, clearCache, cacheName, manifestUrl,
  contentTypeFor, CacheIncompleteError
} from '../../src/extract/cache.js'
import { createMemoryCaches } from '../../src/extract/memory-caches.js'
import { treeSha256 } from '../../src/extract/hash.js'

const te = new TextEncoder()
const td = new TextDecoder()
const APP = 'https://example.test/vibe-dump/claude-code-web/vfs/app/'
const tree = () => new Map([
  ['/$bunfs/root/cli', { bytes: te.encode('import "/vibe-dump/claude-code-web/vfs/app/chunk-a.js"\n') }],
  ['/$bunfs/root/chunk-a.js', { bytes: te.encode('export const a = 1\n') }],
  ['/$bunfs/root/src/plugins/w/hooks-worker.js', { bytes: te.encode('self.onmessage = () => {}\n') }],
  ['/$bunfs/root/SKILL-x.md.zst', { bytes: new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, 1, 2]) }],
  ['/$bunfs/root/audio-capture.node', { bytes: new Uint8Array([0x7f, 0x45, 0x4c, 0x46]) }],
  ['/$bunfs/elsewhere/x.js', { bytes: te.encode('outside the root') }]
])

test('cache: materialize writes the tree, then the manifest, under cc-app-<version>', async () => {
  const caches = createMemoryCaches()
  const progress = []
  const m = await materialize(tree(), { version: '2.1.311', appUrl: APP, caches, extra: { moduleCount: 6 }, onProgress: (p) => progress.push(p) })
  assert.equal(m.format, 1)
  assert.equal(m.complete, true)
  assert.equal(m.cacheName, 'cc-app-2.1.311')
  assert.equal(m.entry, 'cli')
  assert.equal(m.entryUrl, APP + 'cli')
  assert.equal(m.appPath, '/vibe-dump/claude-code-web/vfs/app/')
  assert.deepEqual(m.paths, ['SKILL-x.md.zst', 'chunk-a.js', 'cli', 'src/plugins/w/hooks-worker.js'])
  assert.equal(m.files, 4)
  assert.deepEqual(m.excluded, ['audio-capture.node'])
  assert.deepEqual(m.skipped, ['/$bunfs/elsewhere/x.js'])
  assert.equal(m.moduleCount, 6)
  assert.deepEqual(progress.at(-1), { phase: 'cache', done: 4, total: 4 })

  const expected = await treeSha256([...tree()].filter(([n]) => n.startsWith('/$bunfs/root/') && !n.endsWith('.node')).map(([n, f]) => [n.slice(13), f.bytes]))
  assert.equal(m.sha256, expected.sha256)

  const cache = await caches.open(cacheName('2.1.311'))
  const cli = await cache.match(APP + 'cli')
  assert.equal(cli.headers.get('content-type'), 'text/javascript; charset=utf-8')
  assert.equal(await cli.text(), 'import "/vibe-dump/claude-code-web/vfs/app/chunk-a.js"\n')
  assert.equal((await cache.match(APP + 'src/plugins/w/hooks-worker.js')).headers.get('content-type'), 'text/javascript; charset=utf-8')
  assert.equal((await cache.match(APP + 'SKILL-x.md.zst')).headers.get('content-type'), 'application/zstd')
  assert.equal(await cache.match(APP + 'audio-capture.node'), undefined)
  assert.equal(manifestUrl(APP), 'https://example.test/vibe-dump/claude-code-web/vfs/manifest.json')
  assert.ok(await cache.match(manifestUrl(APP)))
})

test('cache: loadCachedManifest finds complete caches only, for the right app URL', async () => {
  const caches = createMemoryCaches()
  assert.equal(await loadCachedManifest('2.1.311', { appUrl: APP, caches }), null)
  assert.equal(await caches.has('cc-app-2.1.311'), false, 'probing must not create an empty cache')

  const m = await materialize(tree(), { version: '2.1.311', appUrl: APP, caches, extra: { rewritesId: 'abc' } })
  assert.deepEqual(await loadCachedManifest('2.1.311', { appUrl: APP, caches }), m)
  assert.deepEqual(await loadCachedManifest('2.1.311', { caches }), m) // located by scanning keys
  assert.equal(await loadCachedManifest('2.1.311', { appUrl: 'https://example.test/elsewhere/vfs/app/', caches }), null)
  assert.equal(await loadCachedManifest('2.1.312', { appUrl: APP, caches }), null)
  assert.equal(await loadCachedManifest('2.1.311', { appUrl: APP, caches, accept: (x) => x.rewritesId === 'def' }), null)
  assert.ok(await loadCachedManifest('2.1.311', { appUrl: APP, caches, accept: (x) => x.rewritesId === 'abc' }))

  // An interrupted extraction leaves no manifest: treated as absent.
  await (await caches.open('cc-app-2.1.311')).delete(manifestUrl(APP))
  assert.equal(await loadCachedManifest('2.1.311', { appUrl: APP, caches }), null)

  // No Cache API at all (insecure context): null, not a throw.
  const saved = globalThis.caches
  try {
    delete globalThis.caches
    assert.equal(await loadCachedManifest('2.1.311', { appUrl: APP }), null)
    await assert.rejects(materialize(tree(), { version: '2.1.311', appUrl: APP }), /Cache API is not available/)
  } finally {
    if (saved) globalThis.caches = saved
  }
})

test('cache: re-materializing replaces the old tree; loadCachedFiles reads it back for the VFS', async () => {
  const caches = createMemoryCaches()
  await materialize(tree(), { version: '2.1.311', appUrl: APP, caches })
  const smaller = tree()
  smaller.delete('/$bunfs/root/chunk-a.js')
  const m = await materialize(smaller, { version: '2.1.311', appUrl: APP, caches })
  const cache = await caches.open('cc-app-2.1.311')
  assert.equal(await cache.match(APP + 'chunk-a.js'), undefined, 'stale entry from the earlier extraction')

  const files = await loadCachedFiles(m, { caches })
  assert.deepEqual([...files.keys()].sort(), [
    '/vibe-dump/claude-code-web/vfs/app/SKILL-x.md.zst',
    '/vibe-dump/claude-code-web/vfs/app/cli',
    '/vibe-dump/claude-code-web/vfs/app/src/plugins/w/hooks-worker.js'
  ])
  assert.equal(td.decode(files.get('/vibe-dump/claude-code-web/vfs/app/src/plugins/w/hooks-worker.js')), 'self.onmessage = () => {}\n')

  await cache.delete(APP + 'cli')
  await assert.rejects(loadCachedFiles(m, { caches }), (e) => e instanceof CacheIncompleteError && e.missing[0] === 'cli')

  assert.equal(await clearCache(undefined, { caches }), true)
  assert.equal(await caches.has('cc-app-2.1.311'), false)
})

test('cache: materialize argument checks and content types', async () => {
  const caches = createMemoryCaches()
  await assert.rejects(materialize(tree(), { appUrl: APP, caches }), /version is required/)
  await assert.rejects(materialize(new Map([['/$bunfs/root/a.js', { bytes: te.encode('') }]]), { version: 'v', appUrl: APP, caches }), /entry/)
  // appUrl without a trailing slash is normalised
  const m = await materialize(tree(), { version: 'v', appUrl: APP.slice(0, -1), caches })
  assert.equal(m.appUrl, APP)
  assert.equal(contentTypeFor('cli'), 'text/javascript; charset=utf-8')
  assert.equal(contentTypeFor('chunk-x.js'), 'text/javascript; charset=utf-8')
  assert.equal(contentTypeFor('build-report-lite-jwtbvm49.mjs'), 'text/javascript; charset=utf-8')
  assert.equal(contentTypeFor('SKILL-a.md'), 'text/markdown; charset=utf-8')
  assert.equal(contentTypeFor('x.txt'), 'text/plain; charset=utf-8')
  assert.equal(contentTypeFor('anthropicSans400.woff2.asset'), 'application/octet-stream')
})
