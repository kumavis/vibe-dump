// Replay battles in Chromium against a build of the app: the browser half of
// every parity and admission check (library only; the CLI is browser.mjs).
// Runs with ?debug&fast, so nothing is drawn and game time runs effectively
// instantly. The page gets the same recorder (shadow and battle log) and,
// for a human log, the same driver the Node oracle uses, injected before
// main.js loads.
//
// Every battle starts from its real title-screen button
// (`[data-mode=<mode>]`), clicked by Playwright as a player would, and (F6)
// the battle-setup panel it opens, its Start pressed with the races its
// defaults take from the URL (?races=), so the gate also proves the title
// screen still starts each kind of game. That calls the same start(mode)
// the Node oracle calls through __ts.
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
import { humanDriver, jobSetup, pageStart, playedAs, missingHooks, MODES } from './oracle/human-bot.mjs'

export const DIST = fileURLToPath(new URL('../dist', import.meta.url))
// how long a page may go without progress (a whole battle takes 25-45 s
// here; a page load under SwiftShader with another Chromium busy can take
// over 30 s): every browser harness in sim/ waits this long
export const IDLE_MS = 120000
const CAP_MS = 900000

// The renderer a behaviour check draws with. By default every browser check
// draws in software (SwiftShader), the three flags below, as each launch
// site wrote them out. Under software a loaded machine draws the game at
// under a frame a second, and the long checks take up to an hour. Opt in to
// the machine's GPU with TS_GL, the ANGLE backend's name (`TS_GL=metal` on
// a Mac): the flags are then `--use-gl=angle --use-angle=<TS_GL>`. TS_GL
// unset or empty is software; anything but one lowercase word (letters,
// digits, hyphens) is refused, so a typo can't pass a flag of its own.
//
// Five checks read it: ui-check, hud-check, play-check, input-check (both
// of its launches) and lobby-rig. Each was run under both renderers on the
// same tree and passes alike, with the same cases. Measured on one machine,
// loaded, software against the GPU: ui-check 79 s and 18 s, hud-check 155 s
// and 34 s, play-check's watch lane 509 s and 39 s, its six play lanes
// 2,354 s and 417 s, input-check 3,582 s and 468 s; lobby-rig 115 s on the
// GPU (software not measured). Each says at its start which renderer it
// draws with, and with TS_GL set, glConfirm stops it unless the browser's
// WebGL renderer names that backend and is no software one (a machine
// without it would otherwise fall back to software, or to no WebGL at all,
// without a word).
//
// The rest stay on software, launched as they were: title-shot and
// terrain-shots read pixels back and compare them exactly; render-bench
// judges frame time and draw calls, and it, powder-shots and dmath-check
// launch with no renderer flags at all; snap-check fails one of its 15 rows
// on the GPU (hotseat-collapse-8: a figure reads 0.000025 tails off its
// resting spot at the higher frame rate), an open finding, so it stays on
// software until that is understood; dressing-check gains nothing (361 s
// on the GPU against 294 s); and board-check, playback-check,
// rematch-memory, undo-check and runBrowser below were not tried.
const SOFTWARE = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
function glBackend() {
  const v = process.env.TS_GL
  if (v === undefined || v === '') return null
  if (!/^[a-z0-9-]+$/.test(v)) throw new Error(`TS_GL=${JSON.stringify(v)} is not an ANGLE backend's name: one lowercase word of letters, digits and hyphens, such as metal (unset it to draw in software)`)
  return v
}
// the launch flags
export function glArgs() {
  const b = glBackend()
  return b ? ['--use-gl=angle', `--use-angle=${b}`] : SOFTWARE.slice()
}
// the renderer in use, in a line's words
export function glSays() {
  const b = glBackend()
  return b ? `the GPU (ANGLE ${b}, TS_GL)` : 'software (SwiftShader)'
}
// With TS_GL set, read UNMASKED_RENDERER_WEBGL once from a blank page of
// `browser` and stop (closing it) unless it names the backend; then print,
// once a run, `<name>: drawing with <renderer>`.
let glSaid = false
export async function glConfirm(browser, name) {
  const b = glBackend()
  let got = ''
  if (b) {
    const ctx = await browser.newContext()
    try {
      got = await (await ctx.newPage()).evaluate(() => {
        const gl = document.createElement('canvas').getContext('webgl')
        const ext = gl?.getExtension('WEBGL_debug_renderer_info')
        return gl ? String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER)) : ''
      })
    } finally {
      await ctx.close()
    }
    // (a software renderer may name the backend too: SwiftShader's own
    // string says Vulkan, so asking for one a machine lacks must not pass)
    if (!got.toLowerCase().includes(b.toLowerCase()) || /swiftshader|llvmpipe|software/i.test(got)) {
      await browser.close()
      throw new Error(`${name}: TS_GL=${b}, but the browser's WebGL renderer is ${got ? `"${got}"` : 'missing (no WebGL)'}, not ANGLE ${b}: this machine lacks that backend (unset TS_GL to draw in software)`)
    }
  }
  if (!glSaid) console.log(`${name}: drawing with ${glSays()}${got ? `: ${got}` : ''}`)
  glSaid = true
}

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
        sim.error = `window.__ts lacks ${missing.join(', ')}: the harness runs only code from the hooks commit (R0) on, whose ?debug block lists what sim/ reads`
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
  const setup = jobSetup(job)
  const { mode, query } = pageStart(setup)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const fns = [shadowString, shadowParts, shadowOf, instrument, missingHooks, humanDriver].join('\n')
    await page.addInitScript({ content: `${fns}\n(${pageHarness})(${JSON.stringify(job)}, ${JSON.stringify(mode)})` })
    const t0 = Date.now()
    const href = `${url}/?debug&fast&${query}`
    const res = await page.goto(href, { timeout: IDLE_MS })
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
    // (F6) and the battle-setup panel's Start, as it opened
    await page.click('#setupStart', { timeout: 30000 }).catch((e) => {
      throw new Error(`the title screen's ${button} button did not start a ${mode} game (no battle-setup panel's Start to press: ${e.message.split('\n')[0]})`)
    })
    const started = await ask(page, (want) => document.querySelector('#title').classList.contains('hidden') && window.__ts.S.control?.join() === want, IDLE_MS, MODES[mode].join())
    if (!started) throw new Error(`the title screen's ${button} button did not start a ${mode} game (title still up, or S.control isn't ${MODES[mode].join('/')})`)
    // and the battle it started is the job's, field for field
    const other = playedAs(await ask(page, () => window.__ts.G?.setup, IDLE_MS), setup)
    if (other) throw new Error(other)
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

// Run `jobs` (as for run-legacy.mjs, minus bot play, `races` included) on `parallel` browsers;
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
