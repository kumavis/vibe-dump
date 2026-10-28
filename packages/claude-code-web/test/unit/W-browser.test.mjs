// Track W in a real browser: src/runtime/boot/{egress,openai-adapter}.js
// loaded as plain ESM in a Chromium module Worker, with the egress guard in
// ChatGPT mode, the token handoff over real postMessage (the page answers
// like src/host/worker-bridge.js), and a cross-origin "provider" server with
// CORS (so the authorization header costs a real preflight). Skips without
// playwright or Chromium.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sse, textScript, reasoningToolScript, claudeCodeRequest } from './W-fixtures.mjs'

let chromium = null
try { ({ chromium } = await import('playwright')) } catch { /* skipped below */ }
const CHROMIUM = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', '/opt/pw-browsers/chromium-1243/chrome-linux/chrome'].find((p) => p && existsSync(p))
const BOOT = fileURLToPath(new URL('../../src/runtime/boot/', import.meta.url))

const WORKER = (apiOrigin) => `
import { installEgressGuard } from '/boot/egress.js'
import { installOpenAIAdapter, createTokenBroker } from '/boot/openai-adapter.js'
import { OPENAI_ADAPTER_ORIGIN, OPENAI_ADAPTER_KEY, providerConfig, applyProviderEnv, workerEnv } from '/boot/policy.js'
const out = { errors: [] }
try {
  const provider = providerConfig({ kind: 'openai-responses', baseUrl: '${apiOrigin}/v1', model: 'gpt-5.5', contextWindow: 272000 })
  const env = applyProviderEnv(workerEnv({ CLAUDE_CODE_OAUTH_TOKEN: 'sk-ant-should-vanish' }), provider)
  out.env = [env.ANTHROPIC_BASE_URL, env.ANTHROPIC_API_KEY, env.CLAUDE_CODE_OAUTH_TOKEN ?? null, env.CLAUDE_CODE_AUTO_COMPACT_WINDOW]
  const warnings = []
  installEgressGuard(self, { baseUrl: env.ANTHROPIC_BASE_URL, selfOrigin: location.origin, provider, warn: (m) => warnings.push(m) })
  const broker = createTokenBroker({ post: (m) => postMessage(m) })
  self.addEventListener('message', (e) => broker.onMessage(e.data))
  installOpenAIAdapter(self, { provider, getToken: ({ failedToken, ambiguous } = {}) => (failedToken ? broker.renew(failedToken, { ambiguous }) : broker.get()), pingMs: 0 })
  const call = (body, signal) => fetch(OPENAI_ADAPTER_ORIGIN + '/v1/messages?beta=true', { method: 'POST', headers: { 'x-api-key': OPENAI_ADAPTER_KEY, 'content-type': 'application/json' }, body: JSON.stringify(body), signal })
  const body = ${JSON.stringify(claudeCodeRequest())}
  const r1 = await call(body)
  out.stream = { status: r1.status, type: r1.headers.get('content-type'), text: await r1.text() }
  const r2 = await call({ ...body, stream: false, messages: [{ role: 'user', content: 'use the weather tool' }] })
  out.message = await r2.json()
  // interrupt mid-stream: the upstream connection must be dropped
  const ac = new AbortController()
  const r3 = await call({ ...body, messages: [{ role: 'user', content: 'stream slowly' }] }, ac.signal)
  const rd = r3.body.getReader()
  await rd.read()
  ac.abort()
  try { for (;;) { const { done } = await rd.read(); if (done) break } out.abort = 'ended' } catch (e) { out.abort = e.name }
  // the guard still refuses Anthropic and stray credentials from this Worker
  try { await fetch('https://api.anthropic.com/v1/messages', { method: 'POST' }); out.anthropic = 'sent' } catch (e) { out.anthropic = e.code }
  out.warnings = warnings
} catch (e) { out.errors.push(String(e && e.stack || e)) }
postMessage({ type: 'done', out })
`

function listen (handler) {
  const server = http.createServer(handler)
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

const skip = !chromium ? 'playwright is not installed' : false

test('W: the adapter runs as plain ESM in a Chromium module Worker against a CORS provider', { skip, timeout: 120_000 }, async (t) => {
  const seen = []
  let slowClosed = false
  const api = await listen((req, res) => {
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': req.headers['access-control-request-headers'] ?? '*', 'access-control-allow-methods': 'POST, GET, OPTIONS' }
    if (req.method === 'OPTIONS') { seen.push({ preflight: true, headers: req.headers['access-control-request-headers'] }); return res.writeHead(200, cors).end() }
    let raw = ''
    req.on('data', (d) => { raw += d })
    req.on('end', () => {
      const body = JSON.parse(raw)
      seen.push({ url: req.url, auth: req.headers.authorization, names: Object.keys(req.headers).filter((h) => !h.startsWith('sec-')), body })
      res.writeHead(200, { ...cors, 'content-type': 'text/event-stream' })
      const prompt = JSON.stringify(body.input.at(-1))
      if (prompt.includes('stream slowly')) {
        const ev = textScript({ text: Array.from({ length: 200 }, (_, i) => `w${i} `) })
        let i = 0
        const timer = setInterval(() => { if (i < ev.length) res.write(sse([ev[i++]])); else { clearInterval(timer); res.end() } }, 30)
        res.on('close', () => { clearInterval(timer); slowClosed = i < ev.length })
        return
      }
      res.end(sse(prompt.includes('weather') ? reasoningToolScript() : textScript()))
    })
  })
  const apiOrigin = `http://127.0.0.1:${api.address().port}`
  const site = await listen((req, res) => {
    const url = new URL(req.url, 'http://x')
    if (url.pathname === '/index.html') return res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><title>W</title>')
    if (url.pathname === '/worker.js') return res.writeHead(200, { 'content-type': 'text/javascript' }).end(WORKER(apiOrigin))
    if (url.pathname.startsWith('/boot/')) {
      const file = normalize(join(BOOT, url.pathname.slice('/boot/'.length)))
      if (file.startsWith(BOOT) && existsSync(file) && statSync(file).isFile()) return res.writeHead(200, { 'content-type': 'text/javascript' }).end(readFileSync(file))
    }
    res.writeHead(404).end()
  })
  let browser
  try {
    try { browser = await chromium.launch() } catch {
      if (!CHROMIUM) { t.skip('no launchable Chromium'); return }
      browser = await chromium.launch({ executablePath: CHROMIUM })
    }
    const page = await browser.newPage()
    const pageErrors = []
    page.on('pageerror', (e) => pageErrors.push(String(e)))
    await page.goto(`http://127.0.0.1:${site.address().port}/index.html`)
    const { out, requests } = await page.evaluate(() => new Promise((resolve) => {
      const requests = []
      const w = new Worker('/worker.js', { type: 'module' })
      w.onmessage = (e) => {
        const m = e.data
        if (m.type === 'provider-token-request') { requests.push(m); w.postMessage({ type: 'provider-token', id: m.id, accessToken: 'AT-browser', expiresAt: Date.now() + 3600_000 }) }
        if (m.type === 'done') resolve({ out: m.out, requests })
      }
      w.onerror = (e) => resolve({ out: { errors: [`worker error: ${e.message}`] }, requests })
    }))
    assert.deepEqual(out.errors, [])
    assert.deepEqual(out.env, ['https://openai-adapter.invalid', 'openai-adapter', null, '272000'])
    assert.deepEqual(requests.map((r) => r.reason), ['start'], 'one token request, then cached')
    assert.equal(out.stream.status, 200)
    assert.match(out.stream.type, /^text\/event-stream/)
    const types = out.stream.text.split('\n').filter((l) => l.startsWith('event: ')).map((l) => l.slice(7))
    assert.deepEqual(types, ['message_start', 'content_block_start', 'content_block_delta', 'content_block_delta', 'content_block_stop', 'message_delta', 'message_stop'])
    assert.equal(out.message.stop_reason, 'tool_use')
    assert.deepEqual(out.message.content.find((b) => b.type === 'tool_use').input, { city: 'Paris' })
    assert.equal(out.abort, 'AbortError')
    await new Promise((resolve) => setTimeout(resolve, 300))
    assert.equal(slowClosed, true, 'the interrupt closed the upstream connection before the stream ended')
    assert.equal(out.anthropic, 'EGRESS_REFUSED')
    const posts = seen.filter((s) => !s.preflight)
    assert.equal(posts.length, 3)
    assert.ok(seen.some((s) => s.preflight && /authorization/.test(s.headers)), 'a real CORS preflight for authorization')
    for (const p of posts) {
      assert.equal(p.url, '/v1/responses')
      assert.equal(p.auth, 'Bearer AT-browser')
      assert.equal(p.body.store, false)
      assert.equal(p.body.stream, true)
      for (const h of ['originator', 'chatgpt-account-id', 'openai-beta', 'x-api-key', 'anthropic-version']) assert.ok(!p.names.includes(h), `no ${h}`)
    }
    assert.deepEqual(pageErrors, [])
  } finally {
    await browser?.close()
    api.close()
    site.close()
  }
})
