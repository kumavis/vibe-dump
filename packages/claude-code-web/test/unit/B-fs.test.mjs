// Track B: the memfs-backed fs shim — sync API, mount, snapshot/restore,
// change notification, streams and the promise API.
import test from 'node:test'
import assert from 'node:assert/strict'
import { load } from './B-support.mjs'

const fsmod = await load('node/fs.js')
const fs = fsmod.default
const fsp = await load('node/fs/promises.js')

test('sync API: write/read/stat/readdir/rename/rm, Node-shaped errors', () => {
  fs.mkdirSync('/home/user/workspace/src', { recursive: true })
  fs.writeFileSync('/home/user/workspace/src/a.txt', 'alpha')
  fs.appendFileSync('/home/user/workspace/src/a.txt', '+beta')
  assert.equal(fs.readFileSync('/home/user/workspace/src/a.txt', 'utf8'), 'alpha+beta')
  assert.equal(fs.readFileSync('/home/user/workspace/src/a.txt').length, 10)
  assert.equal(fs.existsSync('/home/user/workspace/src/a.txt'), true)
  assert.equal(fs.existsSync('/nope'), false)
  assert.equal(fs.statSync('/nope', { throwIfNoEntry: false }), undefined)
  assert.ok(fs.statSync('/home/user/workspace/src').isDirectory())
  const ents = fs.readdirSync('/home/user/workspace/src', { withFileTypes: true })
  assert.deepEqual(ents.map((d) => [d.name, d.isFile(), d.parentPath]), [['a.txt', true, '/home/user/workspace/src']])
  fs.renameSync('/home/user/workspace/src/a.txt', '/home/user/workspace/src/b.txt')
  assert.throws(() => fs.readFileSync('/home/user/workspace/src/a.txt'), (e) => e.code === 'ENOENT' && e.syscall === 'open' && e.errno === -2 && /ENOENT: no such file or directory, open/.test(e.message))
  assert.throws(() => fs.mkdirSync('/home/user/workspace/src'), { code: 'EEXIST' })
  assert.throws(() => fs.rmdirSync('/home/user/workspace/src'), { code: 'ENOTEMPTY' })
  fs.rmSync('/home/user/workspace/src', { recursive: true, force: true })
  assert.equal(fs.existsSync('/home/user/workspace/src'), false)
})

test('chmod, realpath (+.native), symlinks, mkdtemp, fds, utimes, copyFile', () => {
  fs.mkdirSync('/home/user/w2', { recursive: true })
  fs.writeFileSync('/home/user/w2/x.sh', 'echo', { mode: 0o644 })
  fs.chmodSync('/home/user/w2/x.sh', 0o755)
  assert.equal(fs.statSync('/home/user/w2/x.sh').mode & 0o777, 0o755)
  fs.symlinkSync('/home/user/w2/x.sh', '/home/user/w2/link')
  assert.equal(fs.realpathSync('/home/user/w2/link'), '/home/user/w2/x.sh')
  assert.equal(fs.realpathSync.native('/home/user/w2/../w2/link'), '/home/user/w2/x.sh')
  assert.ok(fs.lstatSync('/home/user/w2/link').isSymbolicLink())
  const tmp = fs.mkdtempSync('/tmp/cc-')
  assert.match(tmp, /^\/tmp\/cc-.{6}$/)
  const fd = fs.openSync('/home/user/w2/f', 'w')
  fs.writeSync(fd, 'abc')
  fs.fsyncSync(fd)
  fs.closeSync(fd)
  assert.equal(fs.readFileSync('/home/user/w2/f', 'utf8'), 'abc')
  fs.utimesSync('/home/user/w2/f', 1000, 2000)
  assert.equal(fs.statSync('/home/user/w2/f').mtimeMs, 2000 * 1000)
  fs.copyFileSync('/home/user/w2/f', '/home/user/w2/g')
  assert.equal(fs.readFileSync('/home/user/w2/g', 'utf8'), 'abc')
  assert.equal(typeof fs.statfsSync('/').bsize, 'number')
})

test('relative paths resolve against process.cwd()', () => {
  const prev = process.cwd()
  fs.mkdirSync('/home/user/rel', { recursive: true })
  const realCwd = process.cwd
  process.cwd = () => '/home/user/rel'
  try {
    fs.writeFileSync('note.txt', 'n')
    assert.equal(fs.readFileSync('/home/user/rel/note.txt', 'utf8'), 'n')
  } finally {
    process.cwd = realCwd
  }
  assert.equal(process.cwd(), prev)
})

test('mount() bulk-loads a tree (Map, object, extractor entries)', () => {
  const n = fsmod.mount(new Map([['/$bunfs/root/cli', 'entry'], ['/$bunfs/root/chunk-a.js', new TextEncoder().encode('export {}')]]), { at: '/vibe-dump/claude-code-web/vfs/app', stripPrefix: '/$bunfs/root/' })
  assert.equal(n, 2)
  assert.equal(fs.readFileSync('/vibe-dump/claude-code-web/vfs/app/cli', 'utf8'), 'entry')
  assert.equal(fs.readFileSync('/vibe-dump/claude-code-web/vfs/app/chunk-a.js', 'utf8'), 'export {}')
  fsmod.mount([{ path: 'skills/x.md.zst', bytes: new Uint8Array([1, 2]) }], { at: '/app2' })
  assert.deepEqual([...fs.readFileSync('/app2/skills/x.md.zst')], [1, 2])
  fsmod.mount({ '/etc/claude-code/managed.json': '{}' })
  assert.equal(fs.readFileSync('/etc/claude-code/managed.json', 'utf8'), '{}')
})

test('snapshot -> serialize -> deserialize -> restore round-trips a subtree', () => {
  fs.mkdirSync('/home/user/.claude', { recursive: true })
  fs.writeFileSync('/home/user/.claude.json', JSON.stringify({ hasCompletedOnboarding: true }))
  fs.writeFileSync('/home/user/.claude/bin.dat', new Uint8Array([0, 255, 7]))
  fs.mkdirSync('/home/user/empty', { recursive: true })
  fs.symlinkSync('/home/user/.claude.json', '/home/user/cfg-link')
  const snap = fsmod.snapshot(['/home/user'])
  assert.equal(snap.version, 1)
  const bytes = fsmod.serializeSnapshot(snap)
  assert.ok(bytes instanceof Uint8Array)
  fs.rmSync('/home/user', { recursive: true, force: true })
  fs.writeFileSync('/tmp/keep', 'outside the snapshot roots')
  assert.equal(fs.existsSync('/home/user/.claude.json'), false)
  const count = fsmod.restore(fsmod.deserializeSnapshot(bytes))
  assert.equal(count, snap.entries.length)
  assert.deepEqual(JSON.parse(fs.readFileSync('/home/user/.claude.json', 'utf8')), { hasCompletedOnboarding: true })
  assert.deepEqual([...fs.readFileSync('/home/user/.claude/bin.dat')], [0, 255, 7])
  assert.ok(fs.statSync('/home/user/empty').isDirectory())
  assert.equal(fs.readlinkSync('/home/user/cfg-link'), '/home/user/.claude.json')
  assert.equal(fs.readFileSync('/tmp/keep', 'utf8'), 'outside the snapshot roots')
  // structured-clone friendly (it crosses postMessage / OPFS)
  assert.doesNotThrow(() => structuredClone(snap))
})

test('onChange() debounces changes under the watched roots only', async () => {
  const batches = []
  const stop = fsmod.onChange((e) => batches.push(e.paths), { roots: ['/home/user'], debounceMs: 20 })
  fs.writeFileSync('/home/user/a1', '1')
  fs.writeFileSync('/home/user/a2', '2')
  fs.writeFileSync('/tmp/not-watched', 'x')
  await new Promise((r) => setTimeout(r, 60))
  assert.equal(batches.length, 1)
  assert.ok(batches[0].includes('/home/user/a1') && batches[0].includes('/home/user/a2'))
  assert.ok(!batches[0].some((p) => p.startsWith('/tmp')))
  // restore() does not report its own writes
  fsmod.restore(fsmod.snapshot(['/home/user']))
  await new Promise((r) => setTimeout(r, 60))
  assert.equal(batches.length, 1)
  stop()
  fs.writeFileSync('/home/user/a3', '3')
  await new Promise((r) => setTimeout(r, 60))
  assert.equal(batches.length, 1)
})

test('streams, watch and the promise API', async () => {
  fs.mkdirSync('/home/user/s', { recursive: true })
  const ws = fs.createWriteStream('/home/user/s/out.txt')
  ws.write('one ')
  ws.end('two')
  await new Promise((r) => ws.on('finish', r))
  let acc = ''
  for await (const c of fs.createReadStream('/home/user/s/out.txt', { encoding: 'utf8' })) acc += c
  assert.equal(acc, 'one two')

  const events = []
  const w = fs.watch('/home/user/s', (type, name) => events.push(name))
  fs.writeFileSync('/home/user/s/new.txt', 'x')
  await new Promise((r) => setTimeout(r, 10))
  w.close()
  assert.ok(events.includes('new.txt'))

  await fsp.writeFile('/home/user/s/p.txt', 'promised')
  assert.equal(await fsp.readFile('/home/user/s/p.txt', 'utf8'), 'promised')
  assert.deepEqual((await fsp.readdir('/home/user/s')).sort(), ['new.txt', 'out.txt', 'p.txt'])
  await fsp.access('/home/user/s/p.txt', fsp.constants.R_OK)
  await assert.rejects(fsp.stat('/home/user/s/none'), { code: 'ENOENT' })
  const fh = await fsp.open('/home/user/s/p.txt', 'r')
  assert.equal(await fh.readFile('utf8'), 'promised')
  await fh.close()
  const { readFile } = fsp // destructured: receiver must not matter
  assert.equal(await readFile('/home/user/s/p.txt', 'utf8'), 'promised')
  assert.equal(fs.promises, fsp.default)
})
