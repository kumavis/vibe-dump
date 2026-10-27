// Track C integration: load runtime/bun/index.js from an assembled runtime
// directory (the real Vite-built vendor.js, via track B's test support) and
// install it with track B's node shims as deps, as boot.js will. Skips with a
// message when the runtime cannot be assembled (e.g. track B mid-change);
// once it loads, every assertion is ours and must hold.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { SCRATCH_RESEARCH } from './C-support.mjs'

let loaded
let reason = false
try {
  const { load } = await import('./B-support.mjs')
  const [bun, nfs, npath, ncrypto, nzlib, ncp, nproc] = await Promise.all(
    ['bun/index.js', 'node/fs.js', 'node/path.js', 'node/crypto.js', 'node/zlib.js', 'node/child_process.js', 'node/process.js'].map((m) => load(m)),
  )
  loaded = { bun, nfs, npath, ncrypto, nzlib, ncp, nproc }
} catch (e) {
  reason = `assembled runtime unavailable: ${e.message.split('\n')[0]}`
}

function install() {
  const { bun, nfs, npath, ncrypto, nzlib, ncp, nproc } = loaded
  const proc = nproc.createProcess({ argv: ['/usr/local/bin/node', '/vibe-dump/claude-code-web/vfs/app/cli', '-p'], env: { HOME: '/home/user', PATH: '/usr/bin' }, cwd: '/home/user/workspace' })
  const target = {}
  const Bun = bun.installBun(target, {
    fs: nfs.default,
    path: npath.default.posix ?? npath.default,
    crypto: ncrypto.default ?? ncrypto,
    zlib: nzlib.default ?? nzlib,
    childProcess: ncp.default ?? ncp,
    process: proc,
  })
  return { target, Bun, proc, fs: nfs.default }
}

test('index.js installs over the real vendor.js and track-B shims', { skip: reason }, async () => {
  const { target, Bun, fs: vfs } = install()
  assert.equal(target.Bun, Bun)
  assert.equal(loaded.bun.installBun(target, {}), Bun, 'idempotent')
  assert.equal(Bun.main, '/vibe-dump/claude-code-web/vfs/app/cli')

  // text via the bundled string-width & co.
  assert.equal(Bun.stringWidth('日本語🎉'), 8)
  assert.equal(Bun.stripANSI('\x1b[31mx\x1b[0m'), 'x')
  assert.equal(Bun.wrapAnsi('aaa bbb', 3), 'aaa\nbbb')
  assert.equal(Bun.sliceAnsi('abcdef', 1, 3), 'bc')
  assert.deepEqual(Bun.YAML.parse(Bun.YAML.stringify({ a: [1, 'x'] }, null, 2)), { a: [1, 'x'] })
  assert.equal(Bun.semver.order('2.1.311', '2.1.310'), 1)

  // hashing via the crypto shim
  assert.equal(Bun.SHA256.hash('abc', 'hex'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  assert.equal(new Bun.CryptoHasher('sha1').update('abc').digest('hex'), 'a9993e364706816aba3e25717850c26c9cd0d89d')

  // files on the memfs VFS
  await Bun.write('/home/user/workspace/notes/a.md', '# A\n')
  assert.equal(vfs.readFileSync('/home/user/workspace/notes/a.md', 'utf8'), '# A\n')
  assert.equal(await Bun.file('notes/a.md').text(), '# A\n')

  // CellSegmenter with the bundled string-width
  const seg = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: true, substitute: [], screen: { tabWidth: 8 } })
  const cells = new Int32Array(8)
  assert.equal(seg.segment('a👩‍💻', cells, new Int32Array(8), false), 2)
  assert.equal(cells[3] & 255, 2)
})

test('spawn / which go through the track-B command table', { skip: reason }, async () => {
  const { Bun } = install()
  assert.equal(Bun.which('git'), null, 'the default `which` handler finds nothing')
  const git = Bun.spawn(['git', 'status'], { stderr: 'pipe' })
  const [err, code] = await Promise.all([git.stderr.text(), git.exited])
  assert.equal(code, 128)
  assert.match(err, /not a git repository/)
  assert.throws(() => Bun.spawn([loaded.nproc.createProcess().execPath, '--version']), (e) => e.code === 'ENOENT')
  const sync = Bun.spawnSync(['git', 'rev-parse'])
  assert.equal(sync.exitCode, 128)
  assert.equal(sync.success, false)
})

test('Bun.stdin.stream() reads the shim process.stdin', { skip: reason }, async () => {
  const { Bun, proc } = install()
  const text = new Response(Bun.stdin.stream()).text()
  proc.stdin.push('{"type":"user"}\n')
  proc.stdin.push(null)
  assert.equal(await text, '{"type":"user"}\n')
})

test('zstdDecompressSync through the zlib shim reads a real .zst asset', { skip: reason }, (t) => {
  const { Bun } = install()
  const tree = path.join(SCRATCH_RESEARCH, 'spike-E', 'extract-unhare', 'root')
  const asset = fs.existsSync(tree) ? fs.readdirSync(tree).find((f) => f.endsWith('.md.zst')) : undefined
  if (asset) {
    const out = Bun.zstdDecompressSync(fs.readFileSync(path.join(tree, asset)))
    assert.ok(out.length > 0)
    assert.doesNotThrow(() => new TextDecoder('utf-8', { fatal: true }).decode(out), 'decodes to UTF-8 text')
  } else if (typeof zlib.zstdCompressSync === 'function') {
    const frame = zlib.zstdCompressSync(Buffer.from('hello zstd'))
    assert.equal(Bun.zstdDecompressSync(frame).toString('utf8'), 'hello zstd')
  } else {
    t.skip('no .zst asset and no zstd in node:zlib')
  }
})
