// Track A: file drops from other platforms. The payload locator does not
// parse ELF/Mach-O/PE headers, so a Mac's `claude` (Mach-O) must extract the
// same way the linux ELF does.
//
// Finding (2.1.311): each platform package is a separate Bun build. The
// darwin-arm64 binary carries 2,866 modules (vs 2,848), with different
// content-hashed chunk names, so its tree is NOT the linux tree; the
// non-JS assets common to both are byte-identical, and the rewrites match
// on it with their own pinned "darwin" counts. That is what is asserted.
//
// Tarballs: $CC_PLATFORM_TGZ_DIR/dl-<platform>/*.tgz (default: the session
// scratchpad's trackA/ folder), or set CC_NPM_PACK=1 to `npm pack` the
// package into a fresh temp directory first (needs registry access).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import {
  readTarballEntries, findBunPayload, parseBunfs, detectVersion, applyRewrites, extractFromBinary,
  createMemoryCaches, treeSha256, KNOWN_BUILDS, RewriteDriftError
} from '../../src/extract/index.js'

const RESEARCH = process.env.CC_RESEARCH_DIR ||
  '/tmp/claude-0/-home-user-vibe-dump/5b506f29-8275-5bfc-ac58-3487cb33f8da/scratchpad/research'
const TGZ_DIR = process.env.CC_PLATFORM_TGZ_DIR || path.join(RESEARCH, '..', 'trackA')
const LINUX_BIN = path.join(RESEARCH, 'pkg-linux-x64/package/claude')
const APP = 'https://kumavis.github.io/vibe-dump/claude-code-web/vfs/app/'

function findTgz (platform) {
  const dir = path.join(TGZ_DIR, `dl-${platform}`)
  const local = fs.existsSync(dir) && fs.readdirSync(dir).find((f) => f.endsWith(`-${platform}-2.1.311.tgz`))
  if (local) return path.join(dir, local)
  if (process.env.CC_NPM_PACK === '1') {
    const fresh = fs.mkdtempSync(path.join(os.tmpdir(), `cc-${platform}-`))
    execFileSync('npm', ['pack', `@anthropic-ai/claude-code-${platform}@2.1.311`, '--ignore-scripts', '--pack-destination', fresh], { stdio: 'ignore' })
    return path.join(fresh, fs.readdirSync(fresh)[0])
  }
  return null
}
const DARWIN_TGZ = findTgz('darwin-arm64')
const WIN_TGZ = findTgz('win32-x64')
const skipNoTgz = (p, t) => (t ? false : `no ${p} tarball (set CC_PLATFORM_TGZ_DIR, or CC_NPM_PACK=1 to download one)`)

async function executableFrom (tgz) {
  let bin = null
  for await (const e of readTarballEntries(await fs.openAsBlob(tgz), { filter: (h) => /^package\/claude(\.exe)?$/.test(h.path) })) bin = e.bytes
  return bin
}
const sha = (u8) => crypto.createHash('sha256').update(u8).digest('hex')
const darwinKnown = KNOWN_BUILDS.find((b) => b.platform === 'darwin-arm64')

test('platforms: darwin-arm64 Mach-O extracts with the same container-agnostic parser', { skip: skipNoTgz('darwin-arm64', DARWIN_TGZ) }, async () => {
  const sri = 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(DARWIN_TGZ)).digest('base64')
  assert.equal(sri, darwinKnown.integrity, 'tarball is the one npm publishes')
  const bin = await executableFrom(DARWIN_TGZ)
  assert.equal(sha(bin), darwinKnown.binarySha256)

  const p = findBunPayload(bin)
  assert.equal(p.container, 'macho')
  assert.equal(p.moduleCount, 2866)
  assert.equal(p.entryId, 7)
  const r = parseBunfs(bin, p)
  assert.equal(r.entry, '/$bunfs/root/cli')
  assert.deepEqual(r.skipped, [])
  assert.equal(detectVersion(r.files, r.entry), '2.1.311')
  const { sha256 } = await treeSha256([...r.files].map(([n, f]) => [n.slice(8), f.bytes]))
  assert.equal(sha256, darwinKnown.treeSha256)

  // Strict, pinned darwin counts.
  const { report } = applyRewrites(r.files, { appPath: '/app/', flavor: 'darwin', version: '2.1.311' })
  assert.deepEqual(Object.fromEntries(report.rewrites.map((x) => [x.id, [x.matches, x.files]])), {
    'bunfs-root': [243276, 2404],
    'import-meta-require': [531, 115],
    'import-meta-dir': [9, 9],
    'builtin-hooks-helper': [1, 1],
    'shell-search-gate': [1, 1],
    'path-completer-readdir': [2, 1]
  })
  // The linux counts do not apply to it: refused, not half-applied.
  assert.throws(() => applyRewrites(r.files, { appPath: '/app/', flavor: 'linux' }), RewriteDriftError)
})

test('platforms: darwin vs linux module sets (documented difference, shared assets identical)', { skip: skipNoTgz('darwin-arm64', DARWIN_TGZ) || (!fs.existsSync(LINUX_BIN) && 'no linux binary') }, async () => {
  const darwin = parseBunfs(await executableFrom(DARWIN_TGZ)).files
  const lb = fs.readFileSync(LINUX_BIN)
  const linux = parseBunfs(new Uint8Array(lb.buffer, lb.byteOffset, lb.byteLength)).files
  const common = [...linux.keys()].filter((n) => darwin.has(n))
  const differing = common.filter((n) => sha(linux.get(n).bytes) !== sha(darwin.get(n).bytes))
  // Same version, different builds: only the entry, the platform-specific
  // native-addon loaders and the hooks worker differ among shared names.
  assert.deepEqual(differing.sort(), [
    '/$bunfs/root/audio-capture.js', '/$bunfs/root/audio-capture.node', '/$bunfs/root/cli',
    '/$bunfs/root/src/plugins/functionHooks/hooks-worker/hooks-worker.js'
  ])
  const chunkNames = (m) => [...m.keys()].filter((n) => /\/chunk-[a-z0-9]{8}\.js$/.test(n))
  assert.equal(chunkNames(linux).length, 2594)
  assert.equal(chunkNames(darwin).length, 2610)
  const stable = (m) => [...m.keys()].filter((n) => !/-[a-z0-9]{8}\.[a-z0-9.]+$/.test(n))
  assert.deepEqual(stable(darwin).filter((n) => !linux.has(n)).sort(), [
    '/$bunfs/root/computer-use-input.js', '/$bunfs/root/computer-use-input.node',
    '/$bunfs/root/computer-use-swift.js', '/$bunfs/root/computer-use-swift.node'
  ])
  assert.deepEqual(stable(linux).filter((n) => !darwin.has(n)).sort(), ['/$bunfs/root/clipboard-napi.js', '/$bunfs/root/clipboard-napi.node'])
})

test('platforms: a Mac file drop goes through extractFromBinary end to end', { skip: skipNoTgz('darwin-arm64', DARWIN_TGZ) }, async () => {
  const caches = createMemoryCaches()
  const m = await extractFromBinary(await fs.openAsBlob(DARWIN_TGZ), { appUrl: APP, caches })
  assert.equal(m.source.platform, 'darwin-arm64')
  assert.equal(m.source.container, 'macho')
  assert.equal(m.moduleCount, 2866)
  assert.equal(m.files, 2863)
  assert.deepEqual([...m.excluded].sort(), ['audio-capture.node', 'computer-use-input.node', 'computer-use-swift.node'])
  assert.equal(m.rewrites.ok, true)
})

test('platforms: win32-x64 PE is located and parsed, then refused (B:/~BUN/root/ paths)', { skip: skipNoTgz('win32-x64', WIN_TGZ) }, async () => {
  const bin = await executableFrom(WIN_TGZ)
  const p = findBunPayload(bin)
  assert.equal(p.container, 'pe')
  const r = parseBunfs(bin, p)
  assert.equal(r.files.size, 2845)
  assert.ok([...r.files.keys()].every((n) => n.startsWith('/$bunfs/root/')))
  assert.match(new TextDecoder().decode(r.files.get('/$bunfs/root/cli').bytes), /import"B:\/~BUN\/root\/chunk-/)
  await assert.rejects(extractFromBinary(bin, { appUrl: APP, caches: createMemoryCaches() }), (e) => e instanceof RewriteDriftError && e.code === 'unknown-build')
})
