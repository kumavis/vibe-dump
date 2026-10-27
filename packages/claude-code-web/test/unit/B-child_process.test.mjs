// Track B: child_process over the command table, the default handlers, the
// rg subset (as Claude Code's skills scan, Glob and Grep tools invoke it) and
// the exec() line runner.
import test from 'node:test'
import assert from 'node:assert/strict'
import { load } from './B-support.mjs'

const fs = (await load('node/fs.js')).default
const cp = await load('node/child_process.js')
const util = await load('node/util.js')

fs.mkdirSync('/home/user/.claude/commands/sub', { recursive: true })
fs.writeFileSync('/home/user/.claude/commands/a.md', '# A\nhello world\nsecond line\n')
fs.writeFileSync('/home/user/.claude/commands/sub/b.md', 'Hello again\n')
fs.writeFileSync('/home/user/.claude/commands/c.txt', 'nothing here')
fs.writeFileSync('/home/user/.claude/commands/.hidden.md', 'hidden hello\n')
fs.writeFileSync('/home/user/.claude/commands/bin.dat', new Uint8Array([104, 101, 108, 108, 111, 0, 1]))

const rg = (args, opts = {}) => cp.spawnSync('rg', args, { encoding: 'utf8', cwd: '/home/user/.claude', ...opts })

test('unknown commands: ENOENT async (error then close -2), status 127 + error sync', async () => {
  const child = cp.spawn('definitely-missing', ['x'])
  const events = []
  child.on('error', (e) => events.push(['error', e.code, e.syscall, e.message]))
  child.on('exit', () => events.push(['exit']))
  await new Promise((r) => child.on('close', (code, sig) => { events.push(['close', code, sig]); r() }))
  assert.deepEqual(events, [['error', 'ENOENT', 'spawn', 'spawn definitely-missing ENOENT'], ['close', -2, null]])
  assert.equal(child.pid, undefined)

  const r = cp.spawnSync('definitely-missing', ['x'])
  assert.equal(r.status, 127)
  assert.equal(r.error.code, 'ENOENT')
  assert.throws(() => cp.execFileSync('definitely-missing'), { code: 'ENOENT' })
  await assert.rejects(util.promisify(cp.execFile)('definitely-missing', []), { code: 'ENOENT' })
})

test('default handlers: which, git, ps, npm', async () => {
  assert.equal(cp.spawnSync('which', ['node']).status, 1)
  assert.equal(cp.spawnSync('/usr/bin/which', ['rg']).status, 1) // looked up by basename
  const git = cp.spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' })
  assert.equal(git.status, 128)
  assert.match(git.stderr, /not a git repository/)
  assert.equal(cp.execFileSync('ps', ['aux'], { encoding: 'utf8' }), '')
  assert.equal(cp.execSync('npm root -g', { encoding: 'utf8' }), '')
  const err = await util.promisify(cp.execFile)('git', ['ls-files']).catch((e) => e)
  assert.equal(err.code, 128)
  assert.match(err.stderr, /not a git repository/)
})

test('registerCommand: sync and async handlers, stdin, env, cwd', async () => {
  const off = cp.registerCommand('greet', (ctx) => ({ status: 0, stdout: `hi ${ctx.args.join(',')} from ${ctx.cwd} ${ctx.env.WHO ?? ''} [${new TextDecoder().decode(ctx.input)}]\n` }))
  assert.equal(cp.execFileSync('greet', ['a', 'b'], { cwd: '/tmp', env: { WHO: 'me' }, input: 'in', encoding: 'utf8' }), 'hi a,b from /tmp me [in]\n')
  const { stdout } = await util.promisify(cp.execFile)('greet', ['c'], { cwd: '/home/user' })
  assert.equal(stdout, 'hi c from /home/user  []\n')
  off()
  assert.equal(cp.getCommand('greet'), undefined)

  cp.registerCommand('slowcat', async (ctx) => ({ status: 3, stdout: (await ctx.readInput()).toString().toUpperCase() }))
  const child = cp.spawn('slowcat', [])
  let out = ''
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (d) => { out += d })
  child.stdin.write('abc')
  child.stdin.end()
  const code = await new Promise((r) => child.on('close', r))
  assert.equal(code, 3)
  assert.equal(out, 'ABC')
  const sync = cp.spawnSync('slowcat', [])
  assert.equal(sync.error.code, 'ENOSYS') // async-only command from a sync API
  cp.unregisterCommand('slowcat')
})

test('spawn: exit/close order, stdio ignore, kill, AbortSignal', async () => {
  cp.registerCommand('forever', (ctx) => new Promise((resolve) => ctx.signal.addEventListener('abort', () => resolve({ status: 0 }))))
  const order = []
  const c1 = cp.spawn('rg', ['--files', '/home/user/.claude/commands'], { stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''
  c1.stdout.on('data', (d) => { out += d })
  c1.on('exit', (code) => order.push(['exit', code]))
  await new Promise((r) => c1.on('close', (code) => { order.push(['close', code]); r() }))
  assert.deepEqual(order, [['exit', 0], ['close', 0]])
  assert.equal(c1.stdin, null)
  assert.match(out, /a\.md/)

  const c2 = cp.spawn('rg', ['--version']) // nobody reads stdout: close must still fire
  await new Promise((r) => c2.on('close', r))

  const c3 = cp.spawn('forever', [])
  setTimeout(() => assert.equal(c3.kill(), true), 5)
  const [code, sig] = await new Promise((r) => c3.on('exit', (...a) => r(a)))
  assert.deepEqual([code, sig], [null, 'SIGTERM'])
  assert.equal(c3.killed, true)

  const ac = new AbortController()
  const c4 = cp.spawn('forever', [], { signal: ac.signal })
  const errP = new Promise((r) => c4.on('error', r))
  ac.abort()
  assert.equal((await errP).name, 'AbortError')
  cp.unregisterCommand('forever')
})

test('rg --files: skills scan, globs, hidden, max-depth, --null, --sort', () => {
  let r = rg(['--files', '--hidden', '--follow', '--no-ignore', '--glob', '*.md', '/home/user/.claude/commands'])
  assert.equal(r.status, 0)
  assert.deepEqual(r.stdout.trim().split('\n'), ['/home/user/.claude/commands/.hidden.md', '/home/user/.claude/commands/a.md', '/home/user/.claude/commands/sub/b.md'])
  r = rg(['--files', '--glob', '*.md'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['commands/a.md', 'commands/sub/b.md'])
  r = rg(['--files', '--max-depth', '1', '-g', '!*.txt', '-g', '!bin.dat', 'commands'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['commands/a.md'])
  r = rg(['--files', '--max-depth', '2', '-g', '!*.txt', '-g', '!bin.dat', 'commands'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['commands/a.md', 'commands/sub/b.md'])
  r = rg(['--files', '-g', '!sub/', 'commands'])
  assert.ok(!r.stdout.includes('sub/b.md'), 'negated directory glob prunes the directory')
  r = rg(['--files', '--null', '--glob', '**/*.md', '--sort=modified', '.'])
  assert.deepEqual(r.stdout.split('\0').filter(Boolean).sort(), ['./commands/a.md', './commands/sub/b.md'])
  r = rg(['--files', '--iglob', '*.MD', 'commands'])
  assert.equal(r.stdout.trim().split('\n').length, 2)
  r = rg(['--files', '--glob', '*.none', 'commands'])
  assert.equal(r.status, 1)
  assert.equal(r.stdout, '')
  r = rg(['--files', 'missing-dir'])
  assert.equal(r.status, 1)
  assert.match(r.stderr, /No such file or directory/)
  assert.match(rg(['--version']).stdout, /^ripgrep \d/)
})

test('rg content search: Grep tool modes (-l, -c, --json, context, -i, -o, -U)', () => {
  let r = rg(['-l', '--null', '--hidden', 'hello', 'commands'])
  assert.deepEqual(r.stdout.split('\0').filter(Boolean), ['commands/.hidden.md', 'commands/a.md'])
  r = rg(['-c', '-H', '--null', '-i', 'hello', 'commands'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['commands/a.md\x001', 'commands/sub/b.md\x001'])
  r = rg(['-n', '-i', 'hello', 'commands'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['commands/a.md:2:hello world', 'commands/sub/b.md:1:Hello again'])
  r = rg(['-n', '-o', 'l+', 'commands/a.md'])
  assert.deepEqual(r.stdout.trim().split('\n'), ['2:ll', '2:l', '3:l'])
  r = rg(['--json', '-n', '-C', '1', 'second', 'commands'])
  const evs = r.stdout.trim().split('\n').map((l) => JSON.parse(l))
  assert.deepEqual(evs.map((e) => e.type), ['begin', 'context', 'match', 'end', 'summary'])
  const match = evs[2].data
  assert.equal(match.path.text, 'commands/a.md')
  assert.equal(match.line_number, 3)
  assert.equal(match.lines.text, 'second line\n')
  assert.deepEqual(match.submatches, [{ match: { text: 'second' }, start: 0, end: 6 }])
  r = rg(['-U', '--multiline-dotall', '--json', 'world.second', 'commands'])
  const m = r.stdout.trim().split('\n').map((l) => JSON.parse(l)).find((e) => e.type === 'match').data
  assert.equal(m.lines.text, 'hello world\nsecond line\n')
  r = rg(['-e', '-dash', 'commands'])
  assert.equal(r.status, 1)
  r = rg(['(unclosed', 'commands'])
  assert.equal(r.status, 2)
  r = rg(['hello', 'commands/bin.dat'])
  assert.equal(r.status, 1) // binary files are skipped
  r = rg(['--type', 'md', '-l', 'again', 'commands'])
  assert.equal(r.stdout.trim(), 'commands/sub/b.md')
})

test('exec/execSync line runner: pipelines, ||, &&, redirects, env, builtins', async () => {
  assert.equal(cp.execSync('ps aux | grep -E "code|cursor" || true', { encoding: 'utf8' }), '')
  assert.equal(cp.execSync('echo $HOME && echo "${MISSING:-dflt}" \'$X\'', { encoding: 'utf8', env: { HOME: '/h' } }), '/h\ndflt $X\n')
  assert.throws(() => cp.execSync('git status 2>/dev/null'), (e) => e.status === 128 && e.stderr.length === 0)
  cp.execSync('echo saved > /tmp/redir.txt; echo more >> /tmp/redir.txt')
  assert.equal(fs.readFileSync('/tmp/redir.txt', 'utf8'), 'saved\nmore\n')
  assert.equal(cp.execSync('rg --files /home/user/.claude/commands/sub | rg -c b.md', { encoding: 'utf8' }), '1\n')
  assert.equal(cp.execSync('command -v rg', { encoding: 'utf8' }), 'rg\n')
  assert.throws(() => cp.execSync('command -v bash'), { status: 1 })
  assert.throws(() => cp.execSync('echo $(whoami)'), (e) => e.status === 2 && /not supported/.test(e.stderr.toString()))
  assert.throws(() => cp.execSync('nosuchcmd --flag'), (e) => e.status === 127)
  const { stdout } = await util.promisify(cp.exec)('false || echo recovered')
  assert.equal(stdout, 'recovered\n')
  const viaShell = cp.spawnSync('echo', ['a', 'b'], { shell: true, encoding: 'utf8' })
  assert.equal(viaShell.stdout, 'a b\n')
  const err = await new Promise((r) => cp.exec('exit 7', (e) => r(e)))
  assert.equal(err.code, 7)
})
