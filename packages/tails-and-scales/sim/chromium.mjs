// Replay battles in Chromium against a build of the app: the browser half of
// every parity and admission check (library only; the CLI is browser.mjs).
// Runs with ?debug&fast, so nothing is drawn and game time runs effectively
// instantly. The page gets the same recorder (shadow and battle log) and,
// for a human log, the same driver the Node oracle uses, injected before
// main.js loads.
//
// Every battle starts from its real title-screen button
// (`[data-mode=<mode>]`), clicked by Playwright as a player would, so the
// gate also proves the title screen still starts each kind of game. That
// button calls the same start(mode) the Node oracle calls through __ts.
//
// Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's own isn't
// installed. A battle that stops making progress (no trace line, no driver
// input) for two minutes is reported as stalled, with the partial trace,
// rather than waited out.
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { shadowString, shadowParts, shadowOf, instrument } from './oracle/shadow.mjs'
import { humanDriver, legacyMode, setupFor, missingHooks, MODES } from './oracle/human-bot.mjs'

export const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const IDLE_MS = 120000 // a whole battle takes 25-45 s here
const CAP_MS = 900000

// Runs in the page, before main.js: catch window.__ts as it is published,
// record, and for a human log drive the seats once per frame (the driver
// waits while the title is up: no decision is pending there).
function pageHarness(job, mode) {
  const sim = (window.__sim = { error: null, rec: null, driver: null })
  let ts = null
  addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
  addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
  Object.defineProperty(window, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      const missing = missingHooks(v)
      if (missing.length) {
        sim.error = `window.__ts lacks ${missing.join(', ')}: the harness runs only the PIN commit or later, whose ?debug block lists what sim/ reads`
        return
      }
      sim.rec = instrument(v)
      if (mode !== 'watch') drive()
    },
  })
  function drive() {
    const driver = (sim.driver = humanDriver(ts, { entries: job.entries }))
    const loop = () => {
      try {
        driver.tick()
      } catch (e) {
        sim.error = String(e.stack ?? e)
        return
      }
      if (ts.S.stage !== 'over') requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }
}

// page.evaluate, but giving up after `ms` (a page stuck in a loop never answers)
async function ask(page, fn, ms, arg) {
  let timer
  try {
    return await Promise.race([page.evaluate(fn, arg), new Promise((_, no) => (timer = setTimeout(() => no(new Error(`the page stopped answering for ${ms / 1000} s`)), ms)))])
  } finally {
    clearTimeout(timer)
  }
}

async function runOne(browser, url, job) {
  const setup = job.setup ?? setupFor('watch', job.seed, job.dice)
  const mode = legacyMode(setup)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const fns = [shadowString, shadowParts, shadowOf, instrument, missingHooks, humanDriver].join('\n')
    await page.addInitScript({ content: `${fns}\n(${pageHarness})(${JSON.stringify(job)}, ${JSON.stringify(mode)})` })
    const t0 = Date.now()
    const href = `${url}/?debug&fast&seed=${setup.board}&dice=${setup.dice}`
    const res = await page.goto(href)
    if (!res?.ok()) throw new Error(`${href}: HTTP ${res?.status()}`)
    // main.js publishes __ts as it loads, so by now it is there (with every
    // member the harness reads) or never will be
    const boot = await page.evaluate(() => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts: a stale build, or one without the ?debug hooks'))
    if (boot) throw new Error(boot)
    // the title screen's button for this mode, as a player presses it
    const button = `[data-mode="${mode}"]`
    await page.click(button, { timeout: 30000 }).catch((e) => {
      throw new Error(`the title screen's ${button} button could not be pressed: ${e.message.split('\n')[0]}`)
    })
    const started = await ask(page, (want) => document.querySelector('#title').classList.contains('hidden') && window.__ts.S.control?.join() === want, IDLE_MS, MODES[mode].join())
    if (!started) throw new Error(`the title screen's ${button} button did not start a ${mode} game (title still up, or S.control isn't ${MODES[mode].join('/')})`)
    // wait for the end, an error, or a stall
    let mark = '', since = Date.now(), stalled = null
    for (;;) {
      const p = await ask(page, () => {
        const ts = window.__ts, sim = window.__sim, S = ts.S
        return { done: !!sim.error || S.stage === 'over', mark: `${ts.trace.length}/${sim.driver?.played.length ?? 0}`, where: `stage ${S.stage}, phase ${S.phase}, seat ${S.active}, ${ts.trace.length} trace lines` }
      }, IDLE_MS)
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) stalled = `stalled for ${IDLE_MS / 1000} s at ${p.where}`
      if (Date.now() - t0 > CAP_MS) stalled = `still running after ${CAP_MS / 60000} min at ${p.where}`
      if (stalled) break
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => {
      const ts = window.__ts, sim = window.__sim, S = ts.S
      return {
        trace: ts.trace.slice(),
        shadow: sim.rec.shadow,
        written: sim.rec.written,
        entries: sim.driver ? sim.driver.played : null,
        over: { wiped: S.wiped ?? -1, vp: S.vp.slice(), first: S.first, round: S.round },
        error: sim.error ?? (S.stage === 'over' && sim.driver?.unused ? `the battle ended with ${sim.driver.unused} log entries unplayed` : null),
      }
    }, IDLE_MS)
    r.error ??= stalled
    if (!r.error && errors.length) r.error = errors.join('\n')
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}

// Run `jobs` (as for run-legacy.mjs, minus bot play) on `parallel` browsers;
// results keep job order, and the array's `chromium` is the browser version.
// `each(result, job, i)` reports as they finish.
export async function runBrowser(jobs, { dist = DIST, parallel = Number(process.env.PARALLEL || 3), each = () => {} } = {}) {
  if (!existsSync(join(dist, 'index.html'))) throw new Error(`no build at ${dist}`)
  const { url, close } = await startStaticServer(dist)
  const out = new Array(jobs.length)
  let next = 0
  const worker = async () => {
    const browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    })
    out.chromium = browser.version()
    try {
      for (let i; (i = next++) < jobs.length; ) {
        out[i] = await runOne(browser, url, jobs[i]).catch((e) => ({ trace: [], shadow: [], written: [], error: String(e.message ?? e) }))
        each(out[i], jobs[i], i)
      }
    } finally {
      await browser.close()
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(parallel, jobs.length) }, worker))
  } finally {
    close()
  }
  return out
}

// The version of the Chromium runBrowser launches, without running anything.
export async function chromiumVersion() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
  try {
    return browser.version()
  } finally {
    await browser.close()
  }
}
