// Track C: Bun.file / Bun.write / Bun.stdin (over a VFS), Bun.spawn /
// spawnSync / which (over a command-table child_process), readableStreamTo*.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import nodeFs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import childProcess from 'node:child_process'
import { Volume, createFsFromVolume } from 'memfs'
import { vendor, fakeProcess, fakeChildProcess } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'

function memfsBun(extra = {}) {
  const fs = createFsFromVolume(new Volume())
  fs.mkdirSync('/home/user/workspace', { recursive: true })
  const proc = fakeProcess()
  return { fs, proc, Bun: createBun({ vendor, fs, path: path.posix, process: proc, ...extra }) }
}

test('Bun.write + Bun.file over a memfs VFS (what track B mounts)', async () => {
  const { fs, Bun } = memfsBun()
  assert.equal(await Bun.write('/home/user/workspace/a/b/c.txt', 'héllo'), 6, 'bytes written; parents created')
  assert.equal(fs.readFileSync('/home/user/workspace/a/b/c.txt', 'utf8'), 'héllo')
  const f = Bun.file('/home/user/workspace/a/b/c.txt')
  assert.equal(await f.exists(), true)
  assert.equal(f.size, 6)
  assert.equal(f.type, 'text/plain;charset=utf-8')
  assert.equal(f.name, '/home/user/workspace/a/b/c.txt')
  assert.equal(await f.text(), 'héllo')
  assert.deepEqual([...await f.bytes()], [...Buffer.from('héllo')])
  assert.equal(new TextDecoder().decode(await f.arrayBuffer()), 'héllo')
  assert.equal(await new Response(f.stream()).text(), 'héllo')
  assert.equal(await f.stream().text(), 'héllo')
  assert.equal(await f.slice(1, 3).text(), 'é')
  assert.equal(f.slice(1, 3).size, 2)
  assert.ok(f.lastModified > 0)

  // relative paths resolve against process.cwd()
  await Bun.write('rel.json', JSON.stringify({ ok: true }))
  assert.deepEqual(await Bun.file('/home/user/workspace/rel.json').json(), { ok: true })
  assert.equal(Bun.file('rel.json').name, '/home/user/workspace/rel.json')
  assert.equal(Bun.file('rel.json').type, 'application/json;charset=utf-8')

  // other data kinds, and a BunFile as destination and as source
  await Bun.write(Bun.file('/x.bin'), new Uint8Array([1, 2, 3]))
  await Bun.write('/y.bin', Bun.file('/x.bin'))
  await Bun.write('/z.txt', new Blob(['bl', 'ob']))
  await Bun.write('/r.txt', new Response('resp'))
  assert.deepEqual([...fs.readFileSync('/y.bin')], [1, 2, 3])
  assert.equal(fs.readFileSync('/z.txt', 'utf8'), 'blob')
  assert.equal(fs.readFileSync('/r.txt', 'utf8'), 'resp')

  // missing files
  const missing = Bun.file('/nope')
  assert.equal(await missing.exists(), false)
  assert.equal(missing.size, 0)
  await assert.rejects(missing.text(), /ENOENT/)

  // writer(): truncates on first flush, appends after
  fs.writeFileSync('/w.txt', 'old content')
  const w = Bun.file('/w.txt').writer()
  w.write('a')
  w.write(new Uint8Array([98]))
  w.flush()
  w.write('c')
  w.end()
  assert.equal(fs.readFileSync('/w.txt', 'utf8'), 'abc')

  await Bun.file('/w.txt').delete()
  assert.equal(fs.existsSync('/w.txt'), false)
})

test('Bun.file / Bun.write over node:fs in a temp dir', async () => {
  const dir = nodeFs.mkdtempSync(path.join(os.tmpdir(), 'ccw-bun-'))
  try {
    const proc = fakeProcess({ cwd: dir })
    const Bun = createBun({ vendor, fs: nodeFs, path, process: proc })
    await Bun.write(path.join(dir, 'sub/f.md'), '# hi\n')
    assert.equal(await Bun.file(path.join(dir, 'sub/f.md')).text(), '# hi\n')
    assert.equal(Bun.file(path.join(dir, 'sub/f.md')).type, 'text/markdown;charset=utf-8')
    await Bun.write('g.txt', 'rel')
    assert.equal(nodeFs.readFileSync(path.join(dir, 'g.txt'), 'utf8'), 'rel')
  } finally {
    nodeFs.rmSync(dir, { recursive: true, force: true })
  }
})

test('Bun.stdin.stream() is a web stream over process.stdin; Bun.stdout writes to process.stdout', async () => {
  const { proc, Bun } = memfsBun()
  const s = Bun.stdin.stream()
  assert.equal(typeof s.getReader, 'function')
  proc.stdin.write('{"a":')
  proc.stdin.end('1}\n')
  assert.equal(await new Response(s).text(), '{"a":1}\n')

  const proc2 = fakeProcess()
  const Bun2 = createBun({ vendor, process: proc2 })
  setImmediate(() => proc2.stdin.end('data'))
  assert.equal(await Bun2.stdin.text(), 'data')

  const out = []
  proc2.stdout.on('data', (c) => out.push(c))
  assert.equal(await Bun2.write(Bun2.stdout, 'to stdout'), 9)
  assert.equal(await Bun2.write(2, 'x'), 1)
  assert.equal(Buffer.concat(out).toString(), 'to stdout')
})

test('readableStreamTo* helpers', async () => {
  const Bun = createBun({ vendor })
  const mk = () => new Response('{"k":[1,2]}').body
  assert.equal(await Bun.readableStreamToText(mk()), '{"k":[1,2]}')
  assert.deepEqual(await Bun.readableStreamToJSON(mk()), { k: [1, 2] })
  assert.equal((await Bun.readableStreamToArrayBuffer(mk())).byteLength, 11)
  assert.equal((await Bun.readableStreamToBytes(mk())).length, 11)
  const parts = await Bun.readableStreamToArray(new ReadableStream({ start(c) { c.enqueue('a'); c.enqueue('b'); c.close() } }))
  assert.deepEqual(parts, ['a', 'b'])
})

// --- processes -----------------------------------------------------------------

function spawnBun(commands) {
  const cp = fakeChildProcess(commands)
  const proc = fakeProcess()
  return { cp, proc, Bun: createBun({ vendor, childProcess: cp, process: proc, fs: createFsFromVolume(new Volume()), path: path.posix }) }
}

test('Bun.spawn: stdout as a web stream with .text(), exited, exitCode, options passed through', async () => {
  const { cp, Bun } = spawnBun({ echo: ({ args }) => ({ status: 0, stdout: args.join(' ') + '\n' }) })
  const p = Bun.spawn(['echo', 'hi', 'there'], { cwd: '/tmp', env: { X: '1' }, stderr: 'pipe' })
  assert.equal(typeof p.pid, 'number')
  assert.equal(p.exitCode, null)
  const [out, err, code] = await Promise.all([new Response(p.stdout).text(), p.stderr.text(), p.exited])
  assert.equal(out, 'hi there\n')
  assert.equal(err, '')
  assert.equal(code, 0)
  assert.equal(p.exitCode, 0)
  assert.equal(p.signalCode, null)
  const call = cp.calls.at(-1)
  assert.deepEqual([call.file, call.args, call.options.cwd, call.options.env], ['echo', ['hi', 'there'], '/tmp', { X: '1' }])
  assert.deepEqual(call.options.stdio, ['ignore', 'pipe', 'pipe'])
  // the object form, and the default stdio (stderr inherited)
  const q = Bun.spawn({ cmd: ['echo', 'x'] })
  assert.equal(await q.stdout.text(), 'x\n')
  assert.equal(q.stderr, undefined)
  assert.deepEqual(cp.calls.at(-1).options.stdio, ['ignore', 'pipe', 'inherit'])
  // cwd/env default to the process's
  assert.equal(cp.calls.at(-1).options.cwd, '/home/user/workspace')
})

test('Bun.spawn: an unknown executable throws ENOENT synchronously, as in Bun', () => {
  const { Bun } = spawnBun({})
  assert.throws(() => Bun.spawn(['/usr/local/bin/node', '--smol', 'x.js']), (e) => e.code === 'ENOENT' && /not found/.test(e.message))
  assert.throws(() => Bun.spawn([]), TypeError)
})

test('Bun.spawn: stdin pipe (FileSink) and data stdin; non-zero exit; onExit; kill', async () => {
  const { Bun } = spawnBun({
    cat: ({ input }) => ({ status: 0, stdout: input }),
    fail: () => ({ status: 3, stderr: 'boom' }),
    sleep: () => ({ hang: true }),
  })
  const p = Bun.spawn(['cat'], { stdin: 'pipe' })
  p.stdin.write('abc')
  p.stdin.write(new Uint8Array([100]))
  p.stdin.end()
  assert.equal(await p.stdout.text(), 'abcd')

  const q = Bun.spawn(['cat'], { stdin: new TextEncoder().encode('given') })
  assert.equal(await q.stdout.text(), 'given')
  const r = Bun.spawn(['cat'], { stdin: new Blob(['blob in']) })
  assert.equal(await r.stdout.text(), 'blob in')

  let seen
  const f = Bun.spawn(['fail'], { stderr: 'pipe', onExit: (proc, code) => { seen = code } })
  assert.equal(await f.exited, 3)
  assert.equal(seen, 3)
  assert.equal(await f.stderr.text(), 'boom')

  const s = Bun.spawn(['sleep'])
  s.kill('SIGKILL')
  assert.equal(await s.exited, 128 + 9)
  assert.equal(s.killed, true)
  assert.equal(s.signalCode, 'SIGKILL')
  assert.equal(s.exitCode, null)

  const t = Bun.spawn(['sleep'], { timeout: 20 })
  assert.equal(await t.exited, 128 + 15)
})

test('Bun.spawnSync: Buffers back, ENOENT throws, input passed', () => {
  const { cp, Bun } = spawnBun({ rev: ({ input }) => ({ status: 0, stdout: [...input.toString()].reverse().join('') }), no: () => ({ status: 1, stderr: 'nope' }) })
  const r = Bun.spawnSync(['rev'], { stdin: new TextEncoder().encode('abc') })
  assert.equal(r.success, true)
  assert.equal(r.exitCode, 0)
  assert.ok(Buffer.isBuffer(r.stdout))
  assert.equal(r.stdout.toString(), 'cba')
  assert.equal(cp.calls.at(-1).options.stdio[0], 'pipe')
  const n = Bun.spawnSync({ cmd: ['no'] })
  assert.equal(n.success, false)
  assert.equal(n.exitCode, 1)
  assert.equal(n.stderr.toString(), 'nope')
  assert.throws(() => Bun.spawnSync(['missing']), (e) => e.code === 'ENOENT')
})

test('Bun.which asks the command table; absolute paths are checked on the VFS', () => {
  const fs = createFsFromVolume(new Volume())
  fs.mkdirSync('/usr/bin', { recursive: true })
  fs.writeFileSync('/usr/bin/tool', '')
  const cp = fakeChildProcess({ which: ({ args }) => (args[0] === 'rg' ? { status: 0, stdout: '/usr/bin/rg\n' } : { status: 1 }) })
  const Bun = createBun({ vendor, childProcess: cp, fs, path: path.posix, process: fakeProcess() })
  assert.equal(Bun.which('rg'), '/usr/bin/rg')
  assert.equal(Bun.which('git'), null)
  assert.equal(Bun.which('rg', { PATH: '/opt' }), '/usr/bin/rg')
  assert.equal(cp.calls.at(-1).options.env.PATH, '/opt')
  assert.equal(Bun.which('/usr/bin/tool'), '/usr/bin/tool')
  assert.equal(Bun.which('/usr/bin/none'), null)
  assert.equal(Bun.which('/usr/bin'), null, 'directories are not executables')
  // no child_process at all: nothing is found, nothing throws
  assert.equal(createBun({ vendor }).which('rg'), null)
})

test('Bun.spawn drives a real node:child_process too (stream adapter vs real ChildProcess)', async () => {
  const Bun = createBun({ vendor, childProcess, process })
  const p = Bun.spawn([process.execPath, '-e', 'process.stdin.pipe(process.stdout); process.stderr.write("e")'], { stdin: 'pipe', stderr: 'pipe' })
  p.stdin.write('round trip')
  p.stdin.end()
  const [out, err, code] = await Promise.all([p.stdout.text(), p.stderr.text(), p.exited])
  assert.deepEqual([out, err, code], ['round trip', 'e', 0])
  const s = Bun.spawnSync([process.execPath, '-e', 'process.exit(4)'])
  assert.equal(s.exitCode, 4)
})

test('Bun.spawn: a BunFile in stdio is not redirected; a DOM File is stdin data', async () => {
  const { cp, Bun } = spawnBun({ cat: ({ input }) => ({ status: 0, stdout: input }) })
  const p = Bun.spawn(['cat'], { stdio: ['ignore', 'ignore', Bun.file('/tmp/log')] })
  assert.equal(await p.exited, 0)
  assert.deepEqual(cp.calls.at(-1).options.stdio, ['ignore', 'ignore', 'ignore'])
  const q = Bun.spawn(['cat'], { stdin: new File(['from a file'], 'f.txt') })
  assert.equal(await q.stdout.text(), 'from a file')
})
