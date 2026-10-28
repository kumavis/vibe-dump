#!/usr/bin/env node
// The acceptance test (ARCHITECTURE.md "Acceptance test"), end to end in
// headless Chromium against the built page and the mock API. Builds nothing.
//
//   node test/e2e.mjs [--dist <dir>] [--binary <path>] [--modules <n>] [--base <path>]
//                     [--fake] [--skip-extract] [--headed] [--json <file>] [--log <file>]
//                     [--chromium <path>]
//
//   --dist     the built page (default: ../dist next to this file)
//   --binary   the `claude` executable (or platform .tgz) to drop (default:
//              $CC_BINARY, else the linux-x64 copy under $CC_RESEARCH_DIR,
//              see research.mjs);
//              read by the browser only
//   --fake     run the page with ?fake (fake-worker.js instead of the real
//              harness): checks the page, host and UI wiring, NOT acceptance
//   --skip-extract  with --fake: skip step 1
//   --modules  the module count step 1 expects (default 2848, linux-x64)
//   --base     serve the page under this path instead of / (e.g.
//              /vibe-dump/claude-code-web/, as on GitHub Pages)
//   --log      write the page's session log (Worker log, CLI stderr, notes) of
//              every page the test opened to this file, for diagnosis
//   --trace    open the page with ?trace (the Worker logs every fetch, its
//              AbortSignal and when it aborts; see --log)
//   --interrupt-loops N  run step 9 N times in a row (default 1): the
//              interrupt race only shows in a fraction of runs
//
// Steps 1-6 (and 2b, the warm boot) are the acceptance test. Steps 7-9 go
// beyond it on the warm session: the built-in file tools on the virtual
// filesystem, a permission the page denies, and an interrupt mid-stream.
// Step 10 checks where the credential is kept (not in localStorage by
// default) and that window.__cc exists only under ?test.
//
// Every step prints PASS/FAIL/SKIP with its reason; the exit code is 0 only
// when every step passed (in --fake mode: when nothing failed).
//
// Egress is blocked at the network level, not with context.route (with a
// route installed, Playwright answers every CORS preflight itself, so the
// mock's strict-CORS check would never run): Chromium gets a proxy on a
// closed loopback port with only 127.0.0.1 bypassed, and host-resolver rules
// that resolve nothing but 127.0.0.1. 'request' and 'requestfailed' listeners
// record any foreign host the pages or Workers asked for, which fails step 6,
// and a probe request checks that the block holds.

import { existsSync, mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { startMockApi } from '../mock/mock-api.mjs'
import { ALLOWED_TOOLS } from '../src/host/constants.js'
import { LINUX_X64_BINARY } from './research.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const CHROMIUM_CANDIDATES = [
  '/opt/pw-browsers/chromium-1243/chrome-linux/chrome', // the path ARCHITECTURE.md names
  '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', // what this sandbox has
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'
]
const FAKE_TOKEN = 'sk-ant-oat01-e2e-FAKE-not-a-real-token'
const EGRESS_PROBE = 'cc-e2e-egress-probe' // query parameter of the one request that must fail

// --- options -----------------------------------------------------------------
const args = process.argv.slice(2)
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback }
const flag = (name) => args.includes(name)
const DIST = resolve(opt('--dist', join(here, '..', 'dist')))
const BINARY = resolve(opt('--binary', process.env.CC_BINARY || LINUX_X64_BINARY))
const FAKE = flag('--fake')
const SKIP_EXTRACT = flag('--skip-extract')
const HEADED = flag('--headed')
const JSON_OUT = opt('--json', null)
const CHROMIUM = opt('--chromium', process.env.CHROMIUM_PATH || null)
const LOG_OUT = opt('--log', null)
const TRACE = flag('--trace')
const INTERRUPT_LOOPS = Math.max(1, Number(opt('--interrupt-loops', 1)) || 1)
// 2,848 for linux-x64; another platform's build has its own module set (darwin-arm64: 2,866)
const EXPECTED_MODULES = Number(opt('--modules', 2848))
const BASE_PATH = `/${opt('--base', '/').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// --- reporting ---------------------------------------------------------------
const results = []
const t0 = Date.now()
const secs = (ms) => `${(ms / 1000).toFixed(1)} s`
function record (id, name, status, reason = '', details = undefined) {
  results.push({ id, name, status, reason, details })
  const pad = String(id).padEnd(3)
  console.log(`${status.padEnd(4)} ${pad} ${name}${reason ? `\n           ${reason.split('\n').join('\n           ')}` : ''}`)
}
const info = (msg) => console.log(`     ${msg}`)

// --- harness of the test itself ----------------------------------------------
let staticSrv, mock, browser
let page = null // the page currently open
const foreign = []
const consoleLines = []
const pageLogs = [] // session logs of closed pages (for --log)

/** A loopback port nothing listens on (bound, then released). */
async function closedPort () {
  const srv = createServer()
  await new Promise((resolve) => srv.listen(0, '127.0.0.1', resolve))
  const { port } = srv.address()
  await new Promise((resolve) => srv.close(resolve))
  return port
}

async function launch () {
  // No egress: everything but 127.0.0.1 goes to a dead proxy, and nothing but
  // 127.0.0.1 resolves (this also covers Chromium's own background services).
  const egress = {
    proxy: { server: `http://127.0.0.1:${await closedPort()}`, bypass: '127.0.0.1' },
    args: ['--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1']
  }
  const tries = []
  if (CHROMIUM) tries.push({ executablePath: CHROMIUM })
  tries.push({})
  for (const p of CHROMIUM_CANDIDATES) if (existsSync(p)) tries.push({ executablePath: p })
  let last
  for (const t of tries) {
    try { return await chromium.launch({ headless: !HEADED, ...egress, ...t }) } catch (err) { last = err }
  }
  throw new Error(`no Chromium could be launched (tried default and ${CHROMIUM_CANDIDATES.join(', ')}): ${last?.message?.split('\n')[0]}`)
}

async function mockRequests () {
  const res = await fetch(`${mock.url}/__requests`)
  return res.json()
}
const resetMock = () => fetch(`${mock.url}/__reset`, { method: 'POST' })
const messagePosts = (reqs) => reqs.filter((r) => r.method === 'POST' && /^\/v1\/messages(\?|$)/.test(r.path))
const messagePreflights = (reqs) => reqs.filter((r) => r.method === 'OPTIONS' && /^\/v1\/messages(\?|$)/.test(r.path))

async function openPage (context, url) {
  const page = await context.newPage()
  page.on('console', (m) => {
    if (!['error', 'warning'].includes(m.type())) return
    consoleLines.push(`[${m.type()}] ${m.text()}`)
    if (consoleLines.length > 400) consoleLines.shift()
  })
  page.on('pageerror', (e) => consoleLines.push(`[pageerror] ${e.message}`))
  await page.goto(url)
  await pageReady(page)
  return page
}

/** Paste the placeholder token (a new tab does not have it: it is not remembered). */
async function fillToken (p) {
  if ((await p.inputValue('#token')) !== FAKE_TOKEN) await p.fill('#token', FAKE_TOKEN)
}

// ---- 10 (beyond the acceptance test): where the credential is kept ---------
// The origin is shared with other apps, so by default the token must not
// reach localStorage, a new tab must not get it back, and a page loaded
// without ?test must not define window.__cc.
async function credentialStorage (context, plainUrl) {
  const name = 'extra: the token stays out of localStorage; no window.__cc without ?test'
  const p10 = []
  try {
    const stored = await page.evaluate(() => ({ local: JSON.stringify({ ...localStorage }), session: JSON.stringify({ ...sessionStorage }), pub: JSON.stringify(window.__cc.settings) }))
    if (stored.local.includes(FAKE_TOKEN)) p10.push('localStorage holds the token although "Remember on this device" is off')
    if (!stored.session.includes(FAKE_TOKEN)) p10.push('sessionStorage does not hold the token for this tab')
    if (stored.pub.includes(FAKE_TOKEN)) p10.push('__cc.settings exposes the token')
    const plain = await context.newPage()
    try {
      await plain.goto(plainUrl)
      await plain.waitForSelector('#token', { state: 'attached', timeout: 30_000 })
      const seen = await plain.evaluate(() => ({ hook: typeof window.__cc, token: document.getElementById('token').value, remember: document.getElementById('remember-credential').checked, notice: document.getElementById('unofficial')?.textContent ?? '' }))
      if (seen.hook !== 'undefined') p10.push(`window.__cc is defined without ?test (${seen.hook})`)
      if (seen.token) p10.push('a new tab got the token back')
      if (seen.remember) p10.push('"Remember on this device" is ticked by default')
      if (!/not affiliated with or endorsed by Anthropic/.test(seen.notice)) p10.push(`no "unofficial" notice in the header: ${JSON.stringify(seen.notice)}`)
    } finally {
      await plain.close()
    }
  } catch (err) {
    p10.push(err.message)
  }
  record(10, name, p10.length ? 'FAIL' : 'PASS', p10.join('\n') || 'token only in sessionStorage; a new tab starts without it; no __cc and an "unofficial" notice on a plain visit')
}

async function pageReady (p) {
  await p.waitForFunction(() => window.__cc, null, { timeout: 30_000 })
  await p.evaluate(() => window.__cc.ready)
}

const sessionLog = (page, n = 25) => page.evaluate((k) => window.__cc.session.log.slice(-k).map((l) => `${l.level}: ${l.msg}`).join('\n'), n).catch(() => '(page gone)')

/** Keep the whole session log of a page before it is closed (for --log). */
async function keepLog (p, label) {
  const lines = await p.evaluate(() => window.__cc.session.log.map((l) => `${new Date(l.t).toISOString()} ${l.level}: ${l.msg}`)).catch(() => ['(page gone)'])
  pageLogs.push(`===== ${label} =====`, ...lines)
}

/** The Worker's one-line boot summary (module count and per-phase timings). */
const bootLine = (p) => p.evaluate(() => window.__cc.session.log.filter((l) => /^boot: /.test(l.msg)).map((l) => l.msg).pop() ?? '(no boot line)').catch(() => '(page gone)')

/** Type a prompt into the composer and wait for that turn's result. */
async function turnViaUi (page, text, timeoutMs) {
  const from = await page.evaluate(() => window.__cc.harness.messages.length)
  await page.fill('#prompt', text)
  await page.click('#send')
  const result = await page.evaluate(({ from, timeoutMs }) =>
    window.__cc.waitFor((m) => m.type === 'result', { fromIndex: from, timeoutMs }), { from, timeoutMs })
  const messages = await page.evaluate((from) => window.__cc.harness.messages.slice(from), from)
  return { result, messages }
}

async function startViaUi (page, timeoutMs) {
  const started = Date.now()
  await page.click('#start')
  // session.starting settles on the initialize response, a preflight refusal or a boot failure
  const outcome = await page.evaluate((ms) => Promise.race([
    window.__cc.session.starting.then(() => 'ok', (e) => `error: ${e.message}`),
    new Promise((resolve) => setTimeout(() => resolve('timeout'), ms))
  ]), timeoutMs)
  const st = await page.evaluate(() => ({ harness: window.__cc.state.harness, error: window.__cc.state.error }))
  return { ...st, outcome, ms: Date.now() - started }
}

async function main () {
  console.log(`claude-code-web e2e${FAKE ? ' (FAKE WORKER: page/host/UI wiring only, not the acceptance test)' : ''}`)
  console.log(`  dist   ${DIST}`)
  console.log(`  binary ${BINARY}${existsSync(BINARY) ? '' : ' (missing)'}`)
  if (!existsSync(join(DIST, 'index.html'))) {
    record('0', 'setup', 'FAIL', `${DIST}/index.html does not exist: run \`npm run build\` in packages/claude-code-web first`)
    return
  }

  // Under --base, serve a temp root in which BASE_PATH is a symlink to DIST.
  let root = DIST
  if (BASE_PATH !== '/') {
    root = mkdtempSync(join(tmpdir(), 'cc-e2e-root-'))
    const link = join(root, ...BASE_PATH.split('/').filter(Boolean))
    mkdirSync(dirname(link), { recursive: true })
    symlinkSync(DIST, link, 'dir')
  }
  staticSrv = await startStaticServer(root, 0)
  const logFile = process.env.MOCK_LOG || join(mkdtempSync(join(tmpdir(), 'cc-e2e-')), 'mock-requests.jsonl')
  mock = await startMockApi({ port: 0, logFile })
  info(`static ${staticSrv.url}  mock ${mock.url}  (mock log ${logFile})`)
  const allowed = new Set([new URL(staticSrv.url).host, new URL(mock.url).host])

  browser = await launch()
  const context = await browser.newContext({ serviceWorkers: 'allow', viewport: { width: 1280, height: 860 } })
  // Record (the network block above refuses them) any request to another host.
  const note = (via) => (r) => {
    let u
    try { u = new URL(r.url()) } catch { return }
    if (!/^(https?|wss?):$/.test(u.protocol) || allowed.has(u.host) || u.searchParams.has(EGRESS_PROBE)) return
    if (!foreign.some((f) => f.url === u.href)) foreign.push({ url: u.href, type: r.resourceType(), via, failure: via === 'requestfailed' ? r.failure()?.errorText : undefined })
  }
  context.on('request', note('request'))
  context.on('requestfailed', note('requestfailed'))

  // ?test defines window.__cc (the page's test hook); a normal visit has none
  const plainUrl = `${staticSrv.url}${BASE_PATH}index.html${FAKE ? '?fake' : ''}`
  const pageUrl = `${staticSrv.url}${BASE_PATH}index.html?test${FAKE ? '&fake' : ''}${TRACE ? '&trace' : ''}`
  if (BASE_PATH !== '/') info(`page   ${pageUrl}`)
  page = await openPage(context, pageUrl)

  // Settings through the UI. The base URL and auth mode persist in
  // localStorage; the token, with "Remember on this device" off (the
  // default), only in this tab's sessionStorage: it survives page.reload()
  // but a new tab has to be given it again (fillToken).
  await page.click('#auth-oauth')
  await fillToken(page)
  await page.fill('#base-url', mock.url)
  await credentialStorage(context, plainUrl)

  // ---- 1. extraction -----------------------------------------------------
  let manifest = null
  if (FAKE && SKIP_EXTRACT) {
    record(1, 'extraction from the dropped binary', 'SKIP', '--skip-extract')
  } else if (!existsSync(BINARY)) {
    record(1, 'extraction from the dropped binary', FAKE ? 'SKIP' : 'FAIL', `binary not found at ${BINARY} (set CC_BINARY)`)
  } else {
    const ts = Date.now()
    try {
      await page.setInputFiles('#binary-drop', BINARY)
      let lastPrint = 0
      for (;;) {
        const st = await page.evaluate(() => ({ cache: window.__cc.state.cache, progress: window.__cc.state.progress, error: window.__cc.state.error }))
        if (st.cache !== 'extracting' && Date.now() - ts > 500) {
          if (st.cache !== 'present') throw new Error(`extraction ended in state "${st.cache}": ${st.error}`)
          break
        }
        if (Date.now() - lastPrint > 5000) { info(`extracting… ${JSON.stringify(st.progress)}`); lastPrint = Date.now() }
        if (Date.now() - ts > 600_000) throw new Error('extraction did not finish within 10 min')
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
      manifest = await page.evaluate(() => window.__cc.state.manifest)
      const extractMs = Date.now() - ts
      const problems = []
      if (manifest.moduleCount !== EXPECTED_MODULES) problems.push(`moduleCount ${manifest.moduleCount}, expected ${EXPECTED_MODULES}`)
      const rw = manifest.rewrites
      if (!rw || !rw.ok) problems.push('rewrite report missing or not ok')
      for (const r of rw?.rewrites ?? []) if (!r.ok) problems.push(`rewrite ${r.id}: ${r.matches} matches, expected ${JSON.stringify(r.expected)}`)
      // reload: the cache must be reused without re-extracting
      await keepLog(page, 'page 1: extraction')
      await page.close()
      page = await openPage(context, pageUrl)
      await fillToken(page) // a new tab: the token was kept for the old tab only
      const after = await page.evaluate(() => ({ cache: window.__cc.state.cache, extractions: window.__cc.state.extractions, createdAt: window.__cc.state.manifest?.createdAt }))
      if (after.cache !== 'present') problems.push(`after reload the cache state is "${after.cache}"`)
      if (after.extractions !== 0) problems.push('the reload extracted again')
      if (after.createdAt !== manifest.createdAt) problems.push('the reloaded manifest is a different extraction')
      const summary = `${manifest.moduleCount} modules (${manifest.files} cached), ${(rw?.rewrites ?? []).length} rewrites ok, extracted in ${secs(extractMs)}; reload reused the cache`
      record(1, 'extraction from the dropped binary', problems.length ? 'FAIL' : 'PASS', problems.length ? problems.join('\n') : summary, { extractMs, files: manifest.files, moduleCount: manifest.moduleCount })
    } catch (err) {
      record(1, 'extraction from the dropped binary', 'FAIL', err.message)
    }
  }

  // ---- 2. boot (cold) + 3. say hi ---------------------------------------
  let running = false
  if (!manifest && !FAKE) {
    record(2, 'Worker boots, system/init within 30 s (cold)', 'FAIL', 'needs step 1 (no cached extraction)')
  } else {
    const boot = await startViaUi(page, 60_000)
    if (boot.harness !== 'ready') {
      record(2, 'Worker boots, system/init within 30 s (cold)', 'FAIL', `the harness did not start (${boot.outcome}; state ${boot.harness})\n--- page log ---\n${await sessionLog(page)}`)
    } else {
      running = true
      info(`initialize answered after ${secs(boot.ms)}`)
      if (!FAKE) info(`worker ${await bootLine(page)}`)
    }
  }

  if (!running) {
    record(3, '"say hi": assistant then result, one POST with OAuth beta + browser header', 'FAIL', 'needs step 2')
  } else {
    await resetMock()
    try {
      const { result, messages } = await turnViaUi(page, 'say hi', 90_000)
      // step 2 is judged on the first system/init (emitted at the start of a turn)
      const init = messages.find((m) => m.type === 'system' && m.subtype === 'init')
      const timings = await page.evaluate(() => window.__cc.timings)
      const p2 = []
      if (!init) p2.push('no system/init message')
      else {
        if (!init.model) p2.push('init has no model')
        if (!Array.isArray(init.tools) || !init.tools.length) p2.push('init lists no tools')
        if (!(init.mcp_servers ?? []).some((s) => s.name === 'page' && s.status === 'connected')) p2.push(`init mcp_servers: ${JSON.stringify(init.mcp_servers)}`)
        if (!(timings.firstInitMs <= 30_000)) p2.push(`system/init after ${secs(timings.firstInitMs)} (> 30 s)`)
        // the tool list is the page's allowlist (--tools) plus its own MCP tools, nothing else
        const tools = init.tools ?? []
        const outside = tools.filter((t) => !ALLOWED_TOOLS.includes(t) && !/^mcp__page__/.test(t))
        if (outside.length) p2.push(`init lists tools outside the page allowlist: ${outside.join(', ')}`)
        const missing = ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'mcp__page__get_weather'].filter((t) => !tools.includes(t))
        if (missing.length) p2.push(`init lacks ${missing.join(', ')}`)
      }
      record(2, 'Worker boots, system/init within 30 s (cold)', p2.length ? 'FAIL' : 'PASS',
        p2.length ? `${p2.join('\n')}\ntools: ${(init?.tools ?? []).join(', ')}` : `init after ${secs(timings.firstInitMs)} (initialize ${secs(timings.readyMs)}); model ${init.model}, ${init.tools.length} tools (${init.tools.join(', ')}), MCP ${init.mcp_servers.map((s) => `${s.name}:${s.status}`).join(',')}`,
        { coldInitMs: timings.firstInitMs, readyMs: timings.readyMs, tools: init?.tools })

      const p3 = []
      const ia = messages.findIndex((m) => m.type === 'assistant')
      const ir = messages.findIndex((m) => m.type === 'result')
      if (ia < 0 || ia > ir) p3.push('no assistant message before the result')
      if (result.is_error !== false || result.subtype !== 'success') p3.push(`result: is_error ${result.is_error}, subtype ${result.subtype}: ${result.result ?? ''}`)
      if (FAKE) {
        record(3, '"say hi": assistant then result', p3.length ? 'FAIL' : 'PASS', p3.join('\n') || `"${result.result}" (fake worker; mock checks skipped)`)
      } else {
        const reqs = await mockRequests()
        const posts = messagePosts(reqs)
        if (posts.length !== 1) p3.push(`the mock saw ${posts.length} POST /v1/messages (expected exactly 1)`)
        const h = posts[0]?.headers ?? {}
        if (!String(h['anthropic-beta'] ?? '').split(',').includes('oauth-2025-04-20')) p3.push(`anthropic-beta lacks oauth-2025-04-20: ${h['anthropic-beta']}`)
        if (h['anthropic-dangerous-direct-browser-access'] !== 'true') p3.push('no anthropic-dangerous-direct-browser-access: true')
        // the real CORS preflight reached the mock and passed its strict check (the browser-access header was asked for)
        const preflights = messagePreflights(reqs)
        if (preflights.length !== 1) p3.push(`the mock saw ${preflights.length} OPTIONS /v1/messages preflights (expected exactly 1)`)
        else if (preflights[0].preflight?.ok !== true) p3.push(`the preflight failed the mock's strict-CORS check: ${preflights[0].headers?.['access-control-request-headers']}`)
        else if (posts[0] && preflights[0].i > posts[0].i) p3.push('the preflight came after the POST')
        record(3, '"say hi": assistant then result, one POST with OAuth beta + browser header', p3.length ? 'FAIL' : 'PASS',
          p3.join('\n') || `"${result.result}"; 1 strict-CORS preflight ok, then 1 POST, beta ok, browser-access header ok`, { posts: posts.map((p) => p.headers), preflights: preflights.map((p) => ({ i: p.i, ok: p.preflight?.ok, asked: p.headers?.['access-control-request-headers'] })) })
      }
    } catch (err) {
      if (!results.some((r) => r.id === 2)) record(2, 'Worker boots, system/init within 30 s (cold)', 'FAIL', `${err.message}\n--- page log ---\n${await sessionLog(page)}`)
      record(3, '"say hi": assistant then result', 'FAIL', err.message)
    }
  }

  // ---- 4. weather tool ----------------------------------------------------
  if (!running) {
    record(4, '"use the weather tool": page handler called once, result echoes it', 'FAIL', 'needs step 2')
  } else {
    await resetMock()
    try {
      const before = await page.evaluate(() => window.__cc.toolCalls.length)
      const { result, messages } = await turnViaUi(page, 'use the weather tool', 90_000)
      const calls = (await page.evaluate((n) => window.__cc.toolCalls.slice(n), before)).filter((c) => c.tool === 'get_weather')
      const uses = messages.filter((m) => m.type === 'assistant').flatMap((m) => m.message?.content ?? []).filter((b) => b.type === 'tool_use' && /__get_weather$/.test(b.name))
      const p4 = []
      if (calls.length !== 1) p4.push(`get_weather handler ran ${calls.length} times (expected 1)`)
      const handlerText = (calls[0]?.result?.content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('\n')
      if (calls[0] && uses[0] && JSON.stringify(calls[0].input) !== JSON.stringify(uses[0].input)) p4.push(`handler input ${JSON.stringify(calls[0].input)} != model input ${JSON.stringify(uses[0].input)}`)
      if (!uses.length) p4.push('the model made no get_weather tool_use')
      if (result.is_error !== false) p4.push(`result is_error: ${result.result}`)
      if (!handlerText || !String(result.result ?? '').includes(handlerText)) p4.push(`result "${result.result}" does not echo the handler's "${handlerText}"`)
      if (!FAKE) {
        const posts = messagePosts(await mockRequests())
        const follow = posts.find((p) => p.phase === 'follow-up')
        if (!follow) p4.push('the mock saw no follow-up request carrying the tool_result')
        else if (!follow.toolResults.some((t) => t.text.includes(handlerText))) p4.push(`the tool_result the mock saw: ${JSON.stringify(follow.toolResults)}`)
      }
      record(4, '"use the weather tool": page handler called once, result echoes it', p4.length ? 'FAIL' : 'PASS', p4.join('\n') || `handler(${JSON.stringify(calls[0].input)}) -> "${handlerText}"; result "${result.result}"`)
    } catch (err) {
      record(4, '"use the weather tool"', 'FAIL', err.message)
    }
  }

  // ---- 5. write a file, persisted across reload, + warm boot ---------------
  if (!running) {
    record(5, '"write a file": file in the workspace, still there after reload', 'FAIL', 'needs step 2')
    record('2b', 'warm boot: system/init within 10 s', 'FAIL', 'needs step 2')
  } else {
    try {
      const { result } = await turnViaUi(page, 'write a file', 90_000)
      const p5 = []
      if (result.is_error !== false) p5.push(`result is_error: ${result.result}`)
      const listed = async (p) => p.evaluate(() => window.__cc.workspaceFiles())
      let files = []
      for (let i = 0; i < 60; i++) {
        files = await listed(page)
        if (files.includes('hello.txt')) break
        if (i === 20) await page.evaluate(() => window.__cc.session.refreshWorkspace())
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
      if (!files.includes('hello.txt')) p5.push(`hello.txt not in the workspace listing after the turn: ${JSON.stringify(files)}`)
      const domHas = async (p) => (await p.textContent('#workspace-list')).includes('hello.txt')
      if (!(await domHas(page))) p5.push('hello.txt not shown in #workspace-list')
      // a plain reload with Claude Code still running (no stop()), once the snapshot is saved to OPFS
      await page.evaluate(() => window.__cc.whenSaved())
      const savedAt = await page.evaluate(() => window.__cc.state.savedAt)
      if (!savedAt) p5.push('the session reported no completed save')
      await keepLog(page, 'page 2: cold boot and the three turns')
      await page.reload()
      await pageReady(page)
      const afterReload = await listed(page)
      if (!afterReload.includes('hello.txt')) p5.push(`after reload the workspace lists ${JSON.stringify(afterReload)}`)
      else if (!(await domHas(page))) p5.push('after reload hello.txt is not shown in #workspace-list')
      record(5, '"write a file": file in the workspace, still there after reload', p5.length ? 'FAIL' : 'PASS', p5.join('\n') || `result "${result.result}"; hello.txt listed before and after a reload without stop()`)

      // warm boot on the reloaded page
      const boot = await startViaUi(page, 30_000)
      if (boot.harness !== 'ready') {
        record('2b', 'warm boot: system/init within 10 s', 'FAIL', `the harness did not start (${boot.outcome}; state ${boot.harness})`)
      } else {
        await turnViaUi(page, 'say hi', 60_000)
        if (!FAKE) info(`worker ${await bootLine(page)}`)
        const t = await page.evaluate(() => window.__cc.timings)
        record('2b', 'warm boot: system/init within 10 s', t.firstInitMs <= 10_000 ? 'PASS' : 'FAIL', `init after ${secs(t.firstInitMs)} (initialize ${secs(t.readyMs)})`, { warmInitMs: t.firstInitMs })
        if (!FAKE) await fileTools(page)
        if (!FAKE) await deniedWrite(page)
        if (!FAKE) await interruptTurn(page)
      }
    } catch (err) {
      record(5, '"write a file"', 'FAIL', `${err.message}\n--- page log ---\n${await sessionLog(page)}`)
    }
  }

  if (!results.some((r) => r.id === 7)) {
    record(7, 'extra: Glob, Grep, Read, Edit on the virtual filesystem', FAKE ? 'SKIP' : 'FAIL', FAKE ? 'the fake worker has no file tools' : 'did not run (needs steps 5 and 2b)')
  }
  if (!results.some((r) => r.id === 9)) {
    record(9, 'extra: interrupt mid-stream, then the next turn works', FAKE ? 'SKIP' : 'FAIL', FAKE ? 'covered by the unit tests in fake mode' : 'did not run (needs steps 5 and 2b)')
  }
  if (!results.some((r) => r.id === 8)) {
    record(8, 'extra: a denied permission prompt blocks the Write', FAKE ? 'SKIP' : 'FAIL', FAKE ? 'covered by the unit tests in fake mode' : 'did not run (needs steps 5 and 2b)')
  }

  // ---- 6. no foreign requests ----------------------------------------------
  // The block itself must hold: a request to a foreign host from the page fails.
  const probe = page
    ? await page.evaluate((q) => fetch(`https://example.com/?${q}`, { mode: 'no-cors', cache: 'no-store' }).then(() => 'reached', (e) => `blocked (${e.message})`), EGRESS_PROBE).catch((e) => `probe error: ${e.message}`)
    : 'no page'
  const hosts = [...new Set(foreign.map((f) => new URL(f.url).host))]
  const p6 = []
  if (foreign.length) p6.push(`${foreign.length} foreign request(s): ${hosts.join(', ')}\n${foreign.slice(0, 10).map((f) => `${f.type} ${f.url}${f.failure ? ` (${f.failure})` : ''}`).join('\n')}`)
  if (!probe.startsWith('blocked')) p6.push(`the network-level egress block did not hold: the probe request ${probe}`)
  record(6, 'no request to any host but the static server and the mock', p6.length ? 'FAIL' : 'PASS',
    p6.join('\n') || `${allowed.size} hosts used; egress blocked at the network level (probe ${probe.split(' ')[0]})`)
}

// ---- 7 (beyond the acceptance test): the built-in file tools on the VFS ----
// The mock's "run the file tools" scenario sends Glob, Grep, Read and Edit on
// the hello.txt step 5 wrote (restored from OPFS after the reload), one per
// round trip, then quotes every tool_result. Glob and Grep run through the
// child_process shim's ripgrep subset.
async function fileTools (p) {
  const name = 'extra: Glob, Grep, Read, Edit on the virtual filesystem'
  try {
    const { result } = await turnViaUi(p, 'run the file tools', 90_000)
    const text = String(result.result ?? '')
    const line = (tool) => text.split('\n').find((l) => l.startsWith(`${tool}`)) ?? ''
    const p7 = []
    if (result.is_error !== false) p7.push(`result is_error: ${text}`)
    if (!/^Glob: .*hello\.txt/.test(line('Glob'))) p7.push(`Glob: ${line('Glob') || '(missing)'}`)
    if (!/^Grep: .*hello\.txt:1:hello from the mock API/.test(line('Grep'))) p7.push(`Grep: ${line('Grep') || '(missing)'}`)
    if (!/^Read: .*hello from the mock API/.test(line('Read'))) p7.push(`Read: ${line('Read') || '(missing)'}`)
    if (!/^Edit: (?!.*error)/i.test(line('Edit'))) p7.push(`Edit: ${line('Edit') || '(missing)'}`)
    let content = null
    for (let i = 0; i < 40; i++) {
      content = await p.evaluate(() => window.__cc.workspaceText('hello.txt'))
      if (content?.startsWith('goodbye')) break
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
    if (content !== 'goodbye from the mock API\n') p7.push(`hello.txt after the Edit: ${JSON.stringify(content)}`)
    record(7, name, p7.length ? 'FAIL' : 'PASS', p7.join('\n') || `4 tool round trips; hello.txt now ${JSON.stringify(content)}`)
  } catch (err) {
    record(7, name, 'FAIL', err.message)
  }
}

// ---- 8 (beyond the acceptance test): deny over the control channel --------
// The page answers the CLI's can_use_tool for the Write with a deny; the CLI
// must not write, and must hand the denial to the model as the tool_result.
async function deniedWrite (p) {
  const name = 'extra: a denied permission prompt blocks the Write'
  const reason = 'denied by the e2e test'
  try {
    const before = await p.evaluate(() => window.__cc.workspaceText('hello.txt'))
    await p.evaluate((msg) => {
      window.__cc.harness.addEventListener('permission', (e) => { e.preventDefault(); e.detail.deny(msg) }, { once: true })
    }, reason)
    const { result, messages } = await turnViaUi(p, 'write a file', 90_000)
    const asked = messages.filter((m) => m.type === 'control_request' && m.request?.subtype === 'can_use_tool').map((m) => m.request.tool_name)
    await p.evaluate(() => window.__cc.session.harness?.flushFs())
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const after = await p.evaluate(() => window.__cc.workspaceText('hello.txt'))
    const p8 = []
    if (asked.join() !== 'Write') p8.push(`can_use_tool asked for ${JSON.stringify(asked)}`)
    if (!String(result.result ?? '').includes(reason)) p8.push(`the result does not carry the denial: ${result.result}`)
    if (after !== before) p8.push(`hello.txt changed: ${JSON.stringify(before)} -> ${JSON.stringify(after)}`)
    record(8, name, p8.length ? 'FAIL' : 'PASS', p8.join('\n') || `result "${result.result}"; hello.txt unchanged`)
  } catch (err) {
    record(8, name, 'FAIL', err.message)
  }
}

// ---- 9 (beyond the acceptance test): interrupt ------------------------------
// The mock streams "stream slowly" over ~21 s. Once it is streaming, the page
// sends the interrupt control request: the turn must end promptly, the
// streaming request must be abandoned (fetch abort through the http shim),
// and the same process must answer the next prompt.
async function interruptTurn (p) {
  const name = 'extra: interrupt mid-stream, then the next turn works'
  const runs = []
  for (let i = 0; i < INTERRUPT_LOOPS; i++) {
    const r = await interruptOnce(p)
    runs.push(r)
    if (INTERRUPT_LOOPS > 1) info(`step 9 run ${i + 1}/${INTERRUPT_LOOPS}: ${r.problems.length ? `FAIL ${r.problems.join('; ')}` : 'ok'} (${r.summary})`)
  }
  const failed = runs.filter((r) => r.problems.length)
  const rate = INTERRUPT_LOOPS > 1 ? ` (${runs.length - failed.length}/${runs.length} runs passed)` : ''
  record(9, name, failed.length ? 'FAIL' : 'PASS', failed.length ? `${failed[0].problems.join('\n')}${rate}` : `${runs[0].summary}${rate}`, { runs: runs.map((r) => ({ ok: !r.problems.length, ...r.details })) })
}

async function interruptOnce (p) {
  try {
    await resetMock()
    const from = await p.evaluate(() => window.__cc.harness.messages.length)
    await p.fill('#prompt', 'stream slowly')
    await p.click('#send')
    const t0 = Date.now()
    let streaming = null
    while (!streaming && Date.now() - t0 < 30_000) {
      streaming = messagePosts(await mockRequests()).find((r) => r.scenario === 'slow')
      if (!streaming) await new Promise((resolve) => setTimeout(resolve, 100))
    }
    if (!streaming) throw new Error('the mock never saw the "stream slowly" request')
    await new Promise((resolve) => setTimeout(resolve, 500))
    const tInt = Date.now()
    await p.evaluate(() => window.__cc.interrupt())
    const result = await p.evaluate(({ from }) => window.__cc.waitFor((m) => m.type === 'result', { fromIndex: from, timeoutMs: 20_000 }), { from })
    const afterMs = Date.now() - tInt
    // the mock sees the abort when the socket closes, a moment after the result
    let slow = null
    for (let i = 0; i < 30 && !slow?.aborted; i++) {
      slow = messagePosts(await mockRequests()).find((r) => r.scenario === 'slow')
      if (!slow?.aborted) await new Promise((resolve) => setTimeout(resolve, 100))
    }
    const problems = []
    if (afterMs > 2500) problems.push(`the result came ${secs(afterMs)} after the interrupt`)
    if (result.subtype === 'success') problems.push('the interrupted turn ended in success (the interrupt was not applied)')
    if (!slow?.aborted) problems.push(`the streaming request was not abandoned (${slow?.completed ? 'it ran to completion' : `still streaming: ${slow?.sent ?? '?'} of ${slow?.events ?? '?'} events sent ${secs(Date.now() - tInt)} after the interrupt`})`)
    const next = await turnViaUi(p, 'say hi', 60_000)
    if (next.result.is_error !== false || next.result.result !== 'hi from the mock API') problems.push(`the next turn: ${next.result.result}`)
    const nextPost = messagePosts(await mockRequests()).filter((r) => r.scenario !== 'slow').pop()
    return {
      problems,
      summary: `result ${result.subtype}${result.is_error ? ' (is_error)' : ''} ${secs(afterMs)} after the interrupt; stream abandoned after ${slow?.sent ?? '?'} of ${slow?.events ?? '?'} events; next turn "${next.result.result}"`,
      details: { afterMs, subtype: result.subtype, aborted: Boolean(slow?.aborted), completed: Boolean(slow?.completed), sent: slow?.sent, nextMessages: nextPost?.body?.nMessages, nextPrompt: nextPost?.body?.prompt }
    }
  } catch (err) {
    return { problems: [err.message], summary: err.message, details: {} }
  }
}

const guard = setTimeout(() => { console.log('FAIL     the whole run exceeded 20 min'); finish(1) }, 20 * 60_000)

async function finish (forced) {
  clearTimeout(guard)
  if (LOG_OUT) {
    if (page) await keepLog(page, 'last page')
    writeFileSync(LOG_OUT, pageLogs.join('\n') + '\n')
  }
  await browser?.close().catch(() => {})
  await staticSrv?.close().catch(() => {})
  await mock?.close().catch(() => {})
  const failed = results.filter((r) => r.status === 'FAIL')
  const skipped = results.filter((r) => r.status === 'SKIP')
  if (failed.length && consoleLines.length) {
    console.log('\n--- last browser console lines ---')
    console.log(consoleLines.slice(-30).join('\n'))
  }
  console.log(`\n${results.length - failed.length - skipped.length} passed, ${failed.length} failed, ${skipped.length} skipped in ${secs(Date.now() - t0)}${FAKE ? ' (FAKE WORKER: not the acceptance test)' : ''}`)
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ fake: FAKE, results, foreign, ms: Date.now() - t0 }, null, 2))
  const ok = !forced && failed.length === 0 && (FAKE || skipped.length === 0)
  process.exit(ok ? 0 : 1)
}

main().then(() => finish(false), async (err) => {
  record('!', 'test harness error', 'FAIL', err?.stack ?? String(err))
  await finish(true)
})
