// Track C in a real browser: load runtime/bun/index.js (with the Vite-built
// vendor.js and track B's shims as deps) inside a Chromium module Worker, the
// way boot.js will, and on the page's main thread for sleepSync (where
// Atomics.wait would throw). No Node globals exist there: no process, no
// Buffer. Skips when playwright, Chromium or the assembled runtime is missing.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import nodeZlib from 'node:zlib'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

let chromium = null
try { ({ chromium } = await import('playwright')) } catch { /* skipped below */ }
let support = null
try { support = await import('./B-support.mjs') } catch { /* skipped below */ }

const WORKER = `
const results = { errors: [], checks: {} }
const check = async (name, fn) => {
  try { results.checks[name] = await fn() } catch (e) { results.errors.push(name + ': ' + (e && e.stack || e)) }
}
try {
  const bunMod = await import('/runtime/bun/index.js')
  const [fs, path, crypto, zlib, cp, pm] = await Promise.all(
    ['fs', 'path', 'crypto', 'zlib', 'child_process', 'process'].map((m) => import('/runtime/node/' + m + '.js')))
  const proc = pm.createProcess({ argv: ['/usr/local/bin/node', '/app/cli', '-p'], env: { HOME: '/home/user' }, cwd: '/home/user/workspace' })
  results.globalsBefore = [typeof globalThis.process, typeof globalThis.Buffer, typeof globalThis.Bun]
  const installed = bunMod.installBun(globalThis, { fs: fs.default, path: path.default, crypto: crypto.default, zlib: zlib.default, childProcess: cp.default, process: proc })
  results.binding = typeof Bun === 'object' && Bun === installed && bunMod.installBun(globalThis, {}) === installed
  const td = new TextDecoder()
  await check('text', () => [Bun.stringWidth('日本語🎉'), Bun.stripANSI('\\x1b[1mx\\x1b[0m'), Bun.wrapAnsi('aa bb', 2), Bun.sliceAnsi('abc', 1)].join('|'))
  await check('hash', () => [Bun.hash('abc').toString(16), Bun.hash.crc32('123456789').toString(16), Bun.SHA256.hash('abc', 'base64'), new Bun.CryptoHasher('md5').update('abc').digest('hex')].join('|'))
  await check('sleepSync', () => { const t0 = performance.now(); Bun.sleepSync(25); return performance.now() - t0 >= 25 })
  await check('files', async () => { await Bun.write('/home/user/workspace/d/x.txt', 'vfs'); return [await Bun.file('d/x.txt').text(), Bun.file('/home/user/workspace/d/x.txt').size, await Bun.file('d/x.txt').stream().text()].join('|') })
  await check('spawn', async () => { const p = Bun.spawn(['git', 'status'], { stderr: 'pipe' }); const [code, err] = await Promise.all([p.exited, new Response(p.stderr).text()]); return [code, err.includes('not a git repository'), Bun.which('git')].join('|') })
  await check('formats', () => JSON.stringify([Bun.YAML.parse('a: [1, 2]'), Bun.TOML.parse('x = "y"'), Bun.JSONL.parse('1\\n2\\n'), Bun.semver.satisfies('1.2.3', '^1.0.0'), Bun.deepEquals({ a: [1] }, { a: [1] })]))
  await check('zstd', async () => td.decode(Bun.zstdDecompressSync(new Uint8Array(await (await fetch('/zstd.bin')).arrayBuffer()))))
  await check('cells', () => { const s = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: true, substitute: [], screen: {} }); const c = new Int32Array(8); const n = s.segment('a日👩‍💻', c, new Int32Array(8), false); return [n, c[1] & 255, c[3] & 255, c[5] & 255].join('|') })
  await check('stdin', async () => { const t = new Response(Bun.stdin.stream()).text(); proc.stdin.push('line\\n'); proc.stdin.push(null); return t })
  await check('terminal', () => { try { new Bun.Terminal({}) } catch (e) { return e.message } return 'no throw' })
  await check('misc', async () => { const p = Promise.resolve(7); Bun.peek(p); await p; await null; return [Bun.peek(p), Bun.inspect({ a: 1 }), Bun.nanoseconds() > 0, Bun.main, Bun.version].join('|') })
} catch (e) {
  results.fatal = String(e && e.stack || e)
}
postMessage(results)
`

const MIME = { '.js': 'text/javascript', '.html': 'text/html' }

async function serve(root) {
  const zst = nodeZlib.zstdCompressSync ? nodeZlib.zstdCompressSync(Buffer.from('zstd in a worker')) : Buffer.alloc(0)
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    if (url.pathname === '/' || url.pathname === '/index.html') return res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><title>C</title>')
    if (url.pathname === '/worker.js') return res.writeHead(200, { 'content-type': 'text/javascript' }).end(WORKER)
    if (url.pathname === '/zstd.bin') return res.writeHead(200, { 'content-type': 'application/octet-stream' }).end(zst)
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

const skip = !chromium ? 'playwright is not installed' : !support ? 'track B test support is unavailable' : false

test('the Bun polyfill works in a Chromium module Worker and on the main thread', { skip, timeout: 120_000 }, async (t) => {
  let root
  try { root = await support.getRuntime() } catch (e) { t.skip(`assembled runtime unavailable: ${e.message.split('\n')[0]}`); return }
  const server = await serve(root)
  let browser
  try {
    try { browser = await chromium.launch() } catch {
      if (!support.CHROMIUM) { t.skip('no launchable Chromium'); return }
      browser = await chromium.launch({ executablePath: support.CHROMIUM })
    }
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
    assert.deepEqual(r.globalsBefore, ['undefined', 'undefined', 'undefined'], 'a bare Worker: nothing Node-like pre-installed')
    assert.equal(r.binding, true, 'bare `Bun` resolves to the installed object; reinstall is a no-op')
    const c = r.checks
    assert.equal(c.text, '8|x|aa\nbb|bc')
    assert.equal(c.hash, '44bc2cf5ad770999|cbf43926|ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=|900150983cd24fb0d6963f7d28e17f72')
    assert.equal(c.sleepSync, true)
    assert.equal(c.files, 'vfs|3|vfs')
    assert.equal(c.spawn, '128|true|')
    assert.equal(c.formats, '[{"a":[1,2]},{"x":"y"},[1,2],true,true]')
    if (nodeZlib.zstdCompressSync) assert.equal(c.zstd, 'zstd in a worker')
    assert.equal(c.cells, '3|1|2|2')
    assert.equal(c.stdin, 'line\n')
    assert.equal(c.terminal, 'Bun.Terminal unavailable (running under Node?)')
    assert.equal(c.misc, '7|{ a: 1 }|true|/app/cli|1.2.0')

    // main thread: Atomics.wait throws there, the busy-wait must not
    const main = await page.evaluate(async () => {
      const { createBun } = await import('/runtime/bun/index.js')
      const b = createBun({})
      const t0 = performance.now()
      b.sleepSync(20)
      return performance.now() - t0
    })
    assert.ok(main >= 20, `main-thread sleepSync slept ${main} ms`)
    assert.deepEqual(pageErrors, [])
  } finally {
    await browser?.close()
    server.close()
  }
})
