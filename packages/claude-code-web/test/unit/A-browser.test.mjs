// Track A in a real browser: the same src/extract modules, unbundled, in
// headless Chromium, with the real DecompressionStream, WebCrypto and Cache
// API (none of which the Node tests can exercise for Cache API). Covers the
// npm download path, a reload that reuses the cache, and a file drop through
// <input type=file>.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { RESEARCH_DIR } from '../research.mjs'

const RESEARCH = RESEARCH_DIR
const LINUX_BIN = path.join(RESEARCH, 'pkg-linux-x64/package/claude')
const LINUX_TGZ = path.join(RESEARCH, 'pkg-linux-x64/anthropic-ai-claude-code-linux-x64-2.1.311.tgz')
// ARCHITECTURE.md names chrome-linux/; the installed build lives in chrome-linux64/.
const CHROMIUM = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/opt/pw-browsers/chromium-1243/chrome-linux/chrome']
  .find((p) => p && fs.existsSync(p))
const EXTRACT_DIR = path.resolve(import.meta.dirname, '../../src/extract')

let chromium = null
try { ({ chromium } = await import('playwright')) } catch {}
const skip = !chromium ? 'playwright is not installed'
  : !fs.existsSync(LINUX_TGZ) ? `scratchpad artifact missing: ${LINUX_TGZ}`
    : !fs.existsSync(LINUX_BIN) ? `scratchpad artifact missing: ${LINUX_BIN}`
      : false

const PAGE = `<!doctype html><meta charset="utf-8"><title>extract test</title>
<input type="file" id="f">
<script type="module">
  import * as X from '/src/extract/index.js'
  window.X = X
  window.ready = true
</script>`

function serve () {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://localhost')
    if (u.pathname === '/app/index.html') {
      res.writeHead(200, { 'content-type': 'text/html' }).end(PAGE)
    } else if (/^\/src\/extract\/[a-z0-9-]+\.js$/.test(u.pathname)) {
      res.writeHead(200, { 'content-type': 'text/javascript' }).end(fs.readFileSync(path.join(EXTRACT_DIR, path.basename(u.pathname))))
    } else if (u.pathname === '/src/runtime/boot/module-graph.js') {
      // the extractor stores the Worker's pre-import order (index.js imports this)
      res.writeHead(200, { 'content-type': 'text/javascript' }).end(fs.readFileSync(path.join(EXTRACT_DIR, '../runtime/boot/module-graph.js')))
    } else if (u.pathname === '/pkg.tgz') {
      res.writeHead(200, { 'content-type': 'application/octet-stream', 'content-length': fs.statSync(LINUX_TGZ).size })
      fs.createReadStream(LINUX_TGZ).pipe(res)
    } else {
      res.writeHead(404).end()
    }
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

test('browser: extract in headless Chromium, reload reuses the Cache API copy, file drop agrees', { skip, timeout: 240000 }, async (t) => {
  const server = await serve()
  const origin = `http://127.0.0.1:${server.address().port}`
  let browser
  try {
    try { browser = await chromium.launch() } catch (e) { if (!CHROMIUM) throw e; browser = await chromium.launch({ executablePath: CHROMIUM }) }
    const page = await browser.newPage()
    page.on('pageerror', (e) => { throw e })
    await page.goto(origin + '/app/index.html')
    await page.waitForFunction(() => window.ready === true)

    // 1. npm download path: a streamed fetch Response of the .tgz.
    const first = await page.evaluate(async () => {
      const X = window.X
      const phases = []
      const t0 = performance.now()
      const m = await X.extractFromBinary(await fetch('/pkg.tgz'), { source: 'npm', onProgress: (p) => { if (phases.at(-1) !== p.phase) phases.push(p.phase) } })
      const cache = await caches.open(m.cacheName)
      const cli = await cache.match(m.entryUrl)
      return {
        phases,
        ms: Math.round(performance.now() - t0),
        timings: m.timings,
        appUrl: m.appUrl,
        files: m.files,
        moduleCount: m.moduleCount,
        sha256: m.sha256,
        sourceSha256: m.sourceSha256,
        platform: m.source.platform,
        ok: m.rewrites.ok,
        counts: m.rewrites.rewrites.map((r) => [r.id, r.matches, r.files]),
        cliType: cli.headers.get('content-type'),
        cliHead: (await cli.text()).slice(0, 4000)
      }
    })
    t.diagnostic(`npm path in Chromium: ${first.ms} ms total, ${JSON.stringify(first.timings)}`)
    assert.deepEqual(first.phases, ['read', 'parse', 'hash', 'rewrite', 'graph', 'cache', 'done'])
    assert.equal(first.appUrl, origin + '/app/vfs/app/')
    assert.equal(first.files, 2846)
    assert.equal(first.moduleCount, 2848)
    assert.equal(first.platform, 'linux-x64')
    assert.equal(first.ok, true)
    assert.deepEqual(first.counts, [
      ['bunfs-root', 241429, 2391], ['import-meta-require', 529, 115], ['import-meta-dir', 9, 9],
      ['builtin-hooks-helper', 1, 1], ['shell-search-gate', 1, 1], ['path-completer-readdir', 2, 1]
    ])
    assert.equal(first.cliType, 'text/javascript; charset=utf-8')
    assert.match(first.cliHead, /import"\/app\/vfs\/app\/chunk-[a-z0-9]{8}\.js"/)

    // 2. Reload: the manifest and the tree come back from the Cache API.
    await page.reload()
    await page.waitForFunction(() => window.ready === true)
    const second = await page.evaluate(async () => {
      const m = await window.X.loadCurrentManifest()
      const tree = await window.X.loadCachedFiles(m)
      return { sha256: m.sha256, size: tree.size, hasCli: tree.has(m.appPath + 'cli') }
    })
    assert.deepEqual(second, { sha256: first.sha256, size: 2846, hasCli: true })

    // 3. File drop: the 294 MB binary through <input type=file>.
    await page.setInputFiles('#f', LINUX_BIN)
    const dropped = await page.evaluate(async () => {
      const m = await window.X.extractFromBinary(document.getElementById('f').files[0], { source: 'drop' })
      return { sha256: m.sha256, sourceSha256: m.sourceSha256, kind: m.source.kind, tarEntry: m.source.tarEntry }
    })
    assert.deepEqual(dropped, { sha256: first.sha256, sourceSha256: first.sourceSha256, kind: 'drop', tarEntry: null })
  } finally {
    await browser?.close()
    server.close()
  }
})
