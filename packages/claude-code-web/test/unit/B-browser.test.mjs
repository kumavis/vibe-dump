// Track B: the assembled runtime in a real browser. Headless Chromium loads
// every shim inside a module Worker (no Node globals, no bundler, relative
// imports only), then exercises fs, crypto, zlib/zstd, rg, readline and a
// streaming http.request against this test's own server.
import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import nodeZlib from 'node:zlib'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { getRuntime, CHROMIUM } from './B-support.mjs'

let chromium = null
try { ({ chromium } = await import('playwright')) } catch { /* skipped below */ }

const WORKER = `
const results = { loaded: {}, errors: [], checks: {} };
const check = async (name, fn) => { try { results.checks[name] = await fn(); } catch (e) { results.checks[name] = 'THREW ' + (e && e.stack || e); } };
try {
  results.processBeforeInstall = typeof globalThis.process;
  const B = await import('./runtime/node/BUILTINS.js');
  for (const name of [...B.BUILTINS, ...B.NPM_SHIMS]) {
    try { const ns = await import('./runtime/node/' + B.shimFile(name)); results.loaded[name] = 'default' in ns; }
    catch (e) { results.errors.push(name + ': ' + (e && e.stack || e)); }
  }
  // A 0o600 file written before any process global exists must stay usable after.
  (await import('./runtime/node/fs.js')).default.writeFileSync('/home/user/early.json', '{"a":1}', { mode: 0o600 });
  const { installNodeGlobals } = await import('./runtime/node/globals.js');
  const stdout = [];
  const proc = installNodeGlobals(globalThis, { processOptions: { env: { HOME: '/home/user' }, cwd: '/home/user', onStdout: (c) => stdout.push(String(c)) } });
  results.globals = [typeof globalThis.Buffer, globalThis.global === globalThis, typeof setImmediate, typeof setTimeout(() => {}, 0).unref, typeof globalThis.process.getBuiltinModule('fs').readFileSync];
  // process.exit() throws ProcessExit, which installNodeGlobals swallows at the top level.
  setTimeout(() => proc.exit(0), 0);
  const fs = (await import('./runtime/node/fs.js')).default;
  const { Buffer } = await import('./runtime/node/buffer.js');
  await check('fs', () => {
    fs.mkdirSync('/home/user/workspace', { recursive: true });
    fs.writeFileSync('/home/user/workspace/a.txt', 'one', { mode: 0o644 });
    fs.appendFileSync('/home/user/workspace/a.txt', '+two');
    fs.writeFileSync('rel.txt', 'relative');
    fs.appendFileSync('/home/user/early.json', ' ');
    fs.writeFileSync('/home/user/late.json', 'x', { mode: 0o600 });
    return [fs.readFileSync('/home/user/workspace/a.txt', 'utf8'), fs.readFileSync('/home/user/rel.txt', 'utf8'), fs.readFileSync('/home/user/early.json', 'utf8').trim(), fs.statSync('/home/user/late.json').uid].join('|');
  });
  await check('crypto', async () => (await import('./runtime/node/crypto.js')).createHash('sha256').update('abc').digest('hex'));
  await check('zlib', async () => {
    const z = await import('./runtime/node/zlib.js');
    const gz = z.gzipSync('gzip in the browser');
    const zst = new Uint8Array(await (await fetch('/zstd.bin')).arrayBuffer());
    return z.gunzipSync(gz).toString() + '|' + z.zstdDecompressSync(zst).toString() + '|' + z.constants.Z_SYNC_FLUSH;
  });
  await check('rg', async () => {
    const cp = await import('./runtime/node/child_process.js');
    fs.mkdirSync('/home/user/.claude/skills/x', { recursive: true });
    fs.writeFileSync('/home/user/.claude/skills/x/SKILL.md', '# skill');
    const r = cp.spawnSync('rg', ['--files', '--glob', '*.md', '/home/user/.claude'], { encoding: 'utf8' });
    const missing = await new Promise((res) => cp.spawn('bash', ['-c', 'x']).on('error', (e) => res(e.code)));
    return r.status + ':' + r.stdout.trim() + '|' + missing + '|' + cp.spawnSync('git', ['status']).status;
  });
  await check('sse', async () => {
    const httpMod = await import('./runtime/node/http.js');
    return await new Promise((resolve, reject) => {
      const t0 = performance.now();
      const req = httpMod.request(new URL('/sse', location.href), { method: 'POST', headers: { 'content-type': 'application/json', connection: 'keep-alive' } }, (res) => {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (d) => chunks.push([d, Math.round(performance.now() - t0)]));
        res.on('end', () => resolve({ status: res.statusCode, ctype: res.headers['content-type'], text: chunks.map((c) => c[0]).join(''), n: chunks.length, spread: chunks.at(-1)[1] - chunks[0][1] }));
        res.on('error', reject);
      });
      req.on('error', reject);
      req.end('{"stream":true}');
    });
  });
  await check('readline', async () => {
    const readline = await import('./runtime/node/readline.js');
    const rl = readline.createInterface({ input: globalThis.process.stdin });
    const lines = [];
    const done = (async () => { for await (const l of rl) lines.push(l); })();
    globalThis.process.stdin.push('{"type":"user"}\\n{"type":');
    globalThis.process.stdin.push('"control_response"}\\n');
    globalThis.process.stdin.push(null);
    await done;
    return lines;
  });
  await check('misc', async () => {
    const util = await import('./runtime/node/util.js');
    const path = await import('./runtime/node/path.js');
    const timers = await import('./runtime/node/timers.js');
    const url = await import('./runtime/node/url.js');
    const t = timers.setTimeout(() => {}, 1).unref();
    globalThis.process.stdout.write('to the page\\n');
    return [util.inspect(new Map([['k', 1]])), path.resolve('x'), Buffer.from('hi?>').toString('base64url'), typeof t.ref, url.fileURLToPath('file:///a%20b'), stdout.join('')];
  });
} catch (e) {
  results.fatal = String(e && e.stack || e);
}
postMessage(results);
`

const MIME = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json' }

async function serve(root) {
  const zst = nodeZlib.zstdCompressSync(Buffer.from('zstd in the browser'))
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    if (url.pathname === '/' || url.pathname === '/index.html') return res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><title>B</title>')
    if (url.pathname === '/worker.js') return res.writeHead(200, { 'content-type': 'text/javascript' }).end(WORKER)
    if (url.pathname === '/zstd.bin') return res.writeHead(200, { 'content-type': 'application/octet-stream' }).end(zst)
    if (url.pathname === '/sse') {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' })
      let i = 0
      const t = setInterval(() => { res.write(`data: ${i++}\n\n`); if (i === 4) { clearInterval(t); res.end() } }, 80)
      return
    }
    if (url.pathname.startsWith('/runtime/')) {
      const file = normalize(join(root, decodeURIComponent(url.pathname.slice('/runtime/'.length))))
      if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) {
        return res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' }).end(readFileSync(file))
      }
    }
    res.writeHead(404).end('not found')
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  return server
}

async function launch() {
  try { return await chromium.launch() } catch (err) {
    if (!CHROMIUM) throw err
  }
  return chromium.launch({ executablePath: CHROMIUM })
}

const skip = chromium ? false : 'playwright is not installed'

test('the runtime loads and works in a Chromium module Worker', { skip, timeout: 90_000 }, async (t) => {
  const root = await getRuntime()
  const server = await serve(root)
  let browser
  try {
    try { browser = await launch() } catch (e) { t.skip(`no launchable Chromium: ${e.message.split('\n')[0]}`); return }
    const page = await browser.newPage()
    const pageErrors = []
    page.on('pageerror', (e) => pageErrors.push(String(e)))
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`)
    const r = await page.evaluate(() => new Promise((resolve) => {
      const w = new Worker('/worker.js', { type: 'module' })
      w.onmessage = (e) => resolve(e.data)
      w.onerror = (e) => resolve({ fatal: `worker error: ${e.message}` })
    }))
    assert.equal(r.fatal, undefined, r.fatal)
    assert.deepEqual(r.errors, [])
    assert.equal(r.processBeforeInstall, 'undefined')
    assert.deepEqual(r.globals, ['function', true, 'function', 'function', 'function'])
    assert.ok(Object.keys(r.loaded).length >= 45)
    assert.ok(Object.values(r.loaded).every(Boolean))
    const c = r.checks
    assert.equal(c.fs, 'one+two|relative|{"a":1}|1000')
    assert.equal(c.crypto, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    assert.equal(c.zlib, 'gzip in the browser|zstd in the browser|2')
    assert.equal(c.rg, '0:/home/user/.claude/skills/x/SKILL.md|ENOENT|128')
    assert.equal(typeof c.sse, 'object', String(c.sse))
    assert.equal(c.sse.status, 200)
    assert.equal(c.sse.ctype, 'text/event-stream')
    assert.equal(c.sse.text, 'data: 0\n\ndata: 1\n\ndata: 2\n\ndata: 3\n\n')
    assert.ok(c.sse.n >= 3 && c.sse.spread >= 150, `SSE must stream: ${JSON.stringify(c.sse)}`)
    assert.deepEqual(c.readline, ['{"type":"user"}', '{"type":"control_response"}'])
    assert.deepEqual(c.misc, ["Map(1) { 'k' => 1 }", '/home/user/x', 'aGk_Pg', 'function', '/a b', 'to the page\n'])
    assert.deepEqual(pageErrors, [])
  } finally {
    await browser?.close()
    server.close()
  }
})
