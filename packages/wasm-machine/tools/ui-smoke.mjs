// End-to-end smoke test of the built app in headless Chromium.
//
//   node tools/ui-smoke.mjs [--shots <dir>] [--chromium <path>]    (screenshots default to $TMPDIR/wasm-machine-shots)
//
// Serves dist/ (build first), drives every tutorial lesson start to finish
// and back, the validation failure, the trap, a WAT syntax error, loading
// hello.wasm and late-cluster's 1 MB chimera.wasm through the file input,
// running at max speed and pausing, a deep scroll in a 16 MiB memory, binary
// view hover linking, animations off, light theme and a 390 px phone.
// Fails (exit 1) on any failed check or any console error.
import { createRequire } from 'node:module'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require('playwright'))
} catch {
  ;({ chromium } = require('/opt/node-tools/node_modules/playwright'))
}

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.resolve(here, '..')
const dist = path.join(pkg, 'dist')
const arg = (k, d) => {
  const i = process.argv.indexOf(k)
  return i > 0 ? process.argv[i + 1] : d
}
const shots = path.resolve(arg('--shots', path.join(os.tmpdir(), 'wasm-machine-shots')))
const chimera = path.resolve(pkg, '../late-cluster/chimera/wasm/chimera.wasm')
const hello = path.join(pkg, 'test/fixtures/hello.wasm')
fs.mkdirSync(shots, { recursive: true })
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ not built: run `npx vite build` in packages/wasm-machine first')
  process.exit(2)
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.svg': 'image/svg+xml' }
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  const f = path.join(dist, p)
  if (!f.startsWith(dist) || !fs.existsSync(f)) {
    res.writeHead(404)
    return res.end()
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' })
  fs.createReadStream(f).pipe(res)
})
await new Promise((r) => server.listen(0, r))
const base = `http://localhost:${server.address().port}/`

let pass = 0
let fail = 0
const errors = []
function check(ok, what) {
  if (ok) pass++
  else {
    fail++
    console.log('  FAIL', what)
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const chromiumPath = arg('--chromium') || process.env.CHROMIUM_PATH
const browser = await chromium.launch(chromiumPath ? { executablePath: chromiumPath } : {})

async function open(hash = '', { width = 1280, height = 800, theme = 'dark', reducedMotion = 'no-preference', dpr = 1, query = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, colorScheme: theme, reducedMotion })
  const page = await ctx.newPage()
  page.setDefaultTimeout(8000)
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()} ${m.location().url || ''}`)
  })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`[http ${r.status()}] ${r.url()}`)
  })
  await page.goto(base + query + (hash ? '#' + hash : ''))
  await page.waitForFunction(() => window.__wasmMachine && window.__wasmMachine.session.prog)
  return page
}
async function section(name, fn) {
  if (process.env.SMOKE_ONLY && !name.includes(process.env.SMOKE_ONLY)) return
  console.log(name)
  try {
    await fn()
  } catch (e) {
    fail++
    console.log('  FAIL (exception)', e.message.split('\n')[0])
  }
}
const shot = (page, name) => page.screenshot({ path: path.join(shots, name + '.png') })
const st = (page) => page.evaluate(() => {
  const a = window.__wasmMachine
  const m = a.session.machine
  return { status: m ? m.status : 'none', steps: m ? m.steps : 0, phase: a.tutorial.phase, running: a.session.running, error: a.session.prog && a.session.prog.error && a.session.prog.error.message }
})
async function stepUntilDone(page, max = 400) {
  let n = 0
  for (; n < max; n++) {
    const s = await st(page)
    if (s.phase !== 'walk' && s.status !== 'ready') break
    await page.keyboard.press('ArrowRight')
  }
  return n
}
async function backToStart(page, max = 400) {
  for (let n = 0; n < max; n++) {
    const s = await st(page)
    if (s.steps === 0) return true
    await page.keyboard.press('ArrowLeft')
  }
  return false
}

// ---------------------------------------------------------------- first paint
await section('first paint', async () => {
  const page = await open()
  await sleep(1200)
  await shot(page, '01-first-paint-1280')
  const s = await st(page)
  check(s.steps === 4, `intro sits four steps in (steps=${s.steps})`)
  check(await page.locator('.store-pane').isVisible(), 'store pane visible even without a memory')
  check(await page.locator('.stack-pane .cell').count() === 2, 'two values on the stack at first paint')
  check(await page.locator('.cl.next').count() === 1, 'next instruction marked')
  check((await page.locator('.instr-bar').innerText()).includes('[i32 i32]'), 'instruction bar shows the i32.add signature')
  await page.context().close()
})

// ---------------------------------------------------------------- every lesson
await section('lessons', async () => {
  const page = await open('lesson-1')
  const midShots = { 4: 7, 5: 14, 7: 27, 9: 4, 6: 3 }
  for (let id = 1; id <= 10; id++) {
    await page.evaluate((id) => window.__wasmMachine.tutorial.go(id), id)
    await sleep(80)
    const before = errors.length
    if (id === 10) {
      // binary tour: a few stops in, then shoot it
      for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight')
      await sleep(150)
      await shot(page, '10-lesson10-binary-tour')
      check(await page.locator('.bin-detail .leb').count() === 1, 'lesson 10: LEB128 breakdown shown for the section size')
    }
    if (midShots[id]) {
      for (let i = 0; i < midShots[id]; i++) await page.keyboard.press('ArrowRight')
      await sleep(450)
      await shot(page, `lesson${id}-step${midShots[id]}`)
    }
    const n = await stepUntilDone(page)
    const s = await st(page)
    check(id === 8 ? s.status === 'trapped' : s.status === 'done', `lesson ${id} runs to ${id === 8 ? 'a trap' : 'completion'} (${s.status} after ${n} key presses)`)
    const beat = await page.locator('.beat.cur').innerText()
    check(beat.length > 20, `lesson ${id} shows narration at the end`)
    if (id === 8) {
      await sleep(300)
      await shot(page, 'lesson8-oob-trap')
      check((await page.locator('.code-banner.trap').innerText()).includes('out of bounds'), 'lesson 8: trap banner explains out-of-bounds')
      await page.keyboard.press('ArrowLeft')
      check((await st(page)).status === 'ready', 'lesson 8: step back after the trap clears it')
    }
    check(await backToStart(page), `lesson ${id}: step back to the start`)
    check(errors.length === before, `lesson ${id}: no console errors`)
  }
  // lesson 3: validation walk, then the ill-typed variant
  await page.evaluate(() => window.__wasmMachine.tutorial.go(3))
  for (let i = 0; i < 2; i++) await page.keyboard.press('ArrowRight')
  await sleep(200)
  await shot(page, 'lesson3-validation-walk')
  check(await page.locator('.stack-pane .cell.tonly').count() === 2, 'lesson 3: static type stack shows [f64 f64] before f64.add')
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight')
  await page.getByRole('button', { name: /ill-typed/ }).click()
  await sleep(200)
  const ban = await page.locator('.code-banner.err').innerText()
  check(/type mismatch/.test(ban) && /f64\.div/.test(ban), 'lesson 3: ill-typed module rejected by validation, naming f64.div')
  await shot(page, 'lesson3-invalid-module')
  await page.context().close()
})

// ---------------------------------------------------------------- WAT syntax error
await section('editor', async () => {
  const page = await open('lesson-1')
  await page.getByRole('button', { name: 'Edit the WAT' }).click()
  const ta = page.locator('.ed-ta')
  await ta.fill('(module\n  (func (export "main") (result i32)\n    i32.const 2\n    i32.ad\n    i32.const 3))')
  await ta.press('Control+Enter')
  await sleep(150)
  const err = await page.locator('.ed-err').innerText()
  check(/line 4/.test(err), `syntax error reported at line 4 (${err.replace(/\s+/g, ' ').slice(0, 90)})`)
  check(await page.locator('.ed-bad').count() === 1, 'syntax error underlined inline')
  await shot(page, 'editor-syntax-error')
  await ta.fill('(module\n  (func (export "main") (result i32)\n    i32.const 40\n    i32.const 2\n    i32.add))')
  await ta.press('Control+Enter')
  await sleep(150)
  check(await page.locator('.editor').isHidden(), 'fixed WAT assembles and closes the editor')
  await stepUntilDone(page)
  check((await page.locator('.code-banner.done').innerText()).includes('42'), 'edited lesson returns 42')
  await page.context().close()
})

// ---------------------------------------------------------------- hello.wasm via the file input
await section('hello.wasm', async () => {
  const page = await open('debugger')
  await page.locator('input[type=file]').setInputFiles(hello)
  await page.waitForFunction(() => window.__wasmMachine.session.prog.name === 'hello.wasm')
  check((await st(page)).status === 'ready', 'hello.wasm: _start invoked and ready')
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight')
  await sleep(300)
  await shot(page, 'hello-stepping')
  await page.evaluate(() => window.__wasmMachine.transport.setSpeedIndex(10))
  await page.keyboard.press(' ')
  await page.waitForFunction(() => window.__wasmMachine.session.machine.status !== 'ready', null, { timeout: 20000 })
  const out = await page.locator('.console').innerText()
  check(/Hello, WASI!/.test(out), 'hello.wasm prints "Hello, WASI!" to the console')
  check(/fib\(20\) = 6765/.test(out), 'hello.wasm computes fib(20)')
  check((await st(page)).status === 'exited', 'hello.wasm exits through proc_exit')
  await sleep(200)
  await shot(page, 'hello-output')
  // a binary using SIMD: the engine's named feature error, surfaced in place
  await page.evaluate(() => {
    const b = [0, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 1, 4, 1, 0x60, 0, 0, 3, 2, 1, 0, 0x0a, 0x17, 1, 0x15, 0, 0xfd, 0x0c, ...new Array(16).fill(0), 0x1a, 0x0b]
    window.__wasmMachine.session.loadBinary(new Uint8Array(b), { name: 'simd.wasm', user: true })
  })
  await sleep(150)
  check(/Unsupported feature: SIMD/.test(await page.locator('.code-banner.err').innerText()), 'a SIMD binary shows the named unsupported-feature error')
  await shot(page, 'unsupported-simd')
  await page.context().close()
})

// ---------------------------------------------------------------- chimera.wasm (1 MB Rust)
await section('chimera.wasm', async () => {
  if (!fs.existsSync(chimera)) return console.log('  (chimera.wasm not found, skipped)')
  const page = await open('debugger')
  const t0 = Date.now()
  await page.locator('input[type=file]').setInputFiles(chimera)
  await page.waitForFunction(() => window.__wasmMachine.session.prog.name === 'chimera.wasm', null, { timeout: 30000 })
  const loadMs = Date.now() - t0
  check(loadMs < 8000, `chimera loads (${loadMs} ms)`)
  const rows = await page.locator('.fn-rows .fn').count()
  const total = await page.evaluate(() => window.__wasmMachine.session.module.funcs.length)
  check(rows > 5 && rows < 80, `function list renders only visible rows (${rows} of ${total})`)
  await page.locator('.fn-search').fill('engine_')
  await sleep(100)
  check(await page.locator('.fn-rows .fn').count() > 3, 'function search filters')
  await page.locator('.fn-rows .fn').first().click()
  await sleep(100)
  const codeRows = await page.locator('.code-rows .cl').count()
  check(codeRows > 3 && codeRows < 120, `browsing a function renders only visible code lines (${codeRows})`)
  await page.locator('.inv-sel').selectOption('engine_new')
  await page.locator('.inv-args input').first().fill('48000')
  await page.getByRole('button', { name: /^Invoke$/ }).click()
  check((await st(page)).status === 'ready', 'chimera: engine_new(48000) invoked')
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight')
  await page.evaluate(() => window.__wasmMachine.transport.setSpeedIndex(10))
  await page.keyboard.press(' ')
  await sleep(600)
  const frameT0 = Date.now()
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())))
  check(Date.now() - frameT0 < 400, 'UI stays responsive while running at max speed')
  await page.keyboard.press(' ')
  await sleep(100)
  const s = await st(page)
  check(!s.running && s.steps > 1000, `paused mid-run at step ${s.steps}`)
  await shot(page, 'chimera-paused')
  await page.keyboard.press('ArrowLeft')
  check((await st(page)).steps === s.steps - 1, 'step back after a max-speed run')
  await page.evaluate(() => window.__wasmMachine.setView('binary'))
  await sleep(300)
  check(await page.locator('.bin-rows .hr').count() < 120, 'binary view of 1 MB renders only visible rows')
  await shot(page, 'chimera-binary')
  await page.context().close()
})

// ---------------------------------------------------------------- 16 MiB memory, deep scroll
await section('big memory', async () => {
  const page = await open('example-bigmem')
  await page.evaluate(() => window.__wasmMachine.transport.setSpeedIndex(10))
  await page.keyboard.press(' ')
  await page.waitForFunction(() => window.__wasmMachine.session.machine.status === 'done')
  await page.locator('.tab', { hasText: 'Memory' }).click()
  const jump = page.locator('.mem-jump')
  await jump.fill('0xfffff0')
  await jump.press('Enter')
  await sleep(150)
  const txt = await page.locator('.mem-rows .ma').allInnerTexts()
  const b = await page.locator('.mem-rows .b[data-a="16777208"]').innerText()
  check(txt.some((t) => /fffff0/.test(t)) && b === 'ef', `memory view jumps to 0xFFFFF0 and shows the i64 store (${b})`)
  const t0 = Date.now()
  for (let i = 0; i < 20; i++) await page.mouse.wheel(0, -400)
  await page.locator('.mem-grid').hover()
  for (let i = 0; i < 20; i++) await page.mouse.wheel(0, -2000)
  check(Date.now() - t0 < 3000, 'wheel-scrolling a 16 MiB memory is fast')
  check(await page.locator('.mem-rows .mr').count() < 60, 'memory renders only visible rows')
  await jump.fill('0x800000')
  await jump.press('Enter')
  await page.locator('.mem-rows .b[data-a="8388608"]').hover()
  await sleep(100)
  check(/3405691582|-889275714/.test(await page.locator('.mem-insp').innerText()), 'inspector decodes 0xCAFEBABE at 0x800000')
  await shot(page, 'memory-16mib-deep')
  await page.context().close()
})

// ---------------------------------------------------------------- binary view hover linking
await section('binary view', async () => {
  const page = await open('lesson-1')
  await page.keyboard.press('m')
  await sleep(200)
  await page.locator('.hb span[data-o="35"]').hover()
  await sleep(100)
  check((await page.locator('.tn.hov').innerText()).includes('literal 2'), 'hovering hex byte 0x23 highlights its tree node')
  await page.locator('.tn', { hasText: 'i32.const 7' }).first().hover()
  await sleep(100)
  const hovN = await page.locator('.hb span.hov').count()
  check(hovN === 2, `hovering a tree node (i32.const 7) highlights its 2 bytes (${hovN}: ${await page.evaluate(() => document.querySelector('.tn.hov') && document.querySelector('.tn.hov').innerText.replace(/\s+/g, ' '))})`)
  await page.locator('.tn', { hasText: 'body size' }).first().click()
  await page.mouse.move(5, 5)
  await sleep(100)
  check(await page.locator('.bin-detail .leb-r').count() === 1, 'LEB128 detail breaks a value into 7-bit groups')
  await shot(page, 'binary-view-hover')
  await page.context().close()
})

// ---------------------------------------------------------------- animations off, static legibility
await section('animations off', async () => {
  const page = await open('lesson-4', { reducedMotion: 'reduce' })
  const on = await page.evaluate(() => document.documentElement.dataset.anim)
  check(on === 'off', 'prefers-reduced-motion defaults animations off')
  for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowRight')
  const anims = await page.evaluate(() => document.getAnimations().length)
  check(anims === 0, `no animations run with motion off (${anims})`)
  check(await page.locator('.cell.ghost').count() === 1, 'the discarded value stays visible as a ghost cell')
  check(await page.locator('.lab.hit').count() >= 1, 'the targeted label is marked')
  await shot(page, 'anim-off-branch-cut')
  await page.context().close()
})

// ---------------------------------------------------------------- light theme
await section('light theme', async () => {
  const page = await open('lesson-7', { theme: 'light' })
  check(await page.evaluate(() => document.documentElement.dataset.theme) === 'light', 'prefers-color-scheme: light respected')
  for (let i = 0; i < 27; i++) await page.keyboard.press('ArrowRight')
  await sleep(500)
  await shot(page, 'light-lesson7-recursion')
  await page.keyboard.press('t')
  check(await page.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'T toggles the theme')
  await page.context().close()
})

// ---------------------------------------------------------------- phone
await section('390 px phone', async () => {
  const page = await open('lesson-4', { width: 390, height: 844 })
  await shot(page, 'phone-lesson')
  const tr = await page.locator('.transport').boundingBox()
  check(tr && tr.y + tr.height <= 844 && tr.width <= 390, 'transport visible on a phone')
  const sw = await page.evaluate(() => document.documentElement.scrollWidth)
  check(sw <= 390, `no horizontal page scroll (${sw})`)
  for (let i = 0; i < 7; i++) await page.locator('.tbtn.primary').click()
  await page.locator('.mtab', { hasText: 'Stack' }).click()
  await sleep(400)
  await shot(page, 'phone-stack')
  await page.locator('.mtab', { hasText: 'Code' }).click()
  await sleep(200)
  await shot(page, 'phone-code')
  await page.context().close()
})

// ---------------------------------------------------------------- returns, host calls, present mode, portrait
await section('return animation', async () => {
  const page = await open('lesson-7')
  for (let i = 0; i < 34; i++) await page.keyboard.press('ArrowRight')
  await sleep(500)
  await page.keyboard.press('ArrowRight') // step 35: the innermost fact returns
  await sleep(90)
  check(await page.locator('.fx-layer .fx-leave').count() === 1, 'returning frame card animates away')
  check(await page.locator('.fx-layer .fx-ghost').count() >= 1, 'the result flies onto the caller\'s stack')
  await shot(page, 'return-mid-flight')
  await sleep(600)
  check(await page.locator('.fx-layer > *:not(svg)').count() === 0, 'return animation cleans up')
  await page.context().close()
})

await section('host calls at max speed', async () => {
  const page = await open('lesson-9')
  await page.evaluate(() => window.__wasmMachine.transport.setSpeedIndex(10))
  await page.keyboard.press(' ')
  await page.waitForFunction(() => window.__wasmMachine.session.machine.status === 'done')
  await sleep(100)
  const con = await page.locator('.console').innerText()
  check(/env\.log\(42\)/.test(con), 'host call env.log(42) logged when running at max speed')
  await page.context().close()
})

await section('present mode + automation api', async () => {
  const page = await open('', { query: '?present&lesson=4&theme=light&motion=on' })
  const st0 = await page.evaluate(() => window.__wasmMachine.api.state())
  check(st0.lesson === 4 && st0.steps === 0, `?present&lesson=4 opens lesson 4 without an intro (${st0.lesson}, ${st0.steps})`)
  check(await page.evaluate(() => document.documentElement.dataset.theme) === 'light', '?present&theme=light applies')
  const st1 = await page.evaluate(() => window.__wasmMachine.api.step(7))
  check(st1.steps === 7 && st1.stack.length === 1 && st1.stack[0].value === '-1', 'api.step(7) resolves after the branch with [-1]')
  const st2 = await page.evaluate(() => window.__wasmMachine.api.lesson(3))
  check(st2.lesson === 3 && st2.phase === 'walk', 'api.lesson(3) jumps to the validation walk')
  const st3 = await page.evaluate(() => window.__wasmMachine.api.play({ gap: 0 }))
  check(st3.status === 'done' && st3.results[0] === '3.5', 'api.play walks validation then runs to the result')
  await page.context().close()
})

for (const [w, hgt, dpr] of [[540, 960, 2], [1080, 1920, 1]]) {
  await section(`portrait ${w}x${hgt}`, async () => {
    const page = await open('lesson-7', { width: w, height: hgt, dpr })
    for (let i = 0; i < 27; i++) await page.keyboard.press('ArrowRight')
    await sleep(500)
    const vis = async (sel) => {
      const b = await page.locator(sel).boundingBox()
      return !!b && b.width > 100 && b.height > 80 && b.y + b.height <= hgt + 1
    }
    check(await vis('.code-pane') && await vis('.stack-pane') && await vis('.frames-pane'), `portrait ${w}x${hgt}: code, stack and frames all on screen`)
    check(await vis('.tutorial') && await vis('.transport'), `portrait ${w}x${hgt}: narration and transport on screen`)
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    check(sw <= w, `portrait ${w}x${hgt}: no horizontal scroll (${sw})`)
    await shot(page, `portrait-${w}x${hgt}`)
    await page.context().close()
  })
}

await browser.close()
server.close()
for (const e of errors) console.log('  console error:', e)
check(errors.length === 0, `no console errors overall (${errors.length})`)
console.log(`\n${pass} passed, ${fail} failed · screenshots in ${shots}`)
process.exit(fail ? 1 : 0)
