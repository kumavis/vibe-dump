// engine-turns.mjs — drive the book with real input and shoot the turns.
//
//   node tools/engine-turns.mjs [baseUrl] [outDir]
//   FROM=outro node tools/engine-turns.mjs …   # only the back-cover half
//
// Clicks the cover open, shoots mid-turn and after, steps with the keyboard,
// jumps with a dot from the closed book, closes onto the back cover and begins
// again. Prints the engine state after each step and every console error.

import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'

const base = process.argv[2] || 'http://127.0.0.1:5181/'
const out = process.argv[3] || '.'
mkdirSync(out, { recursive: true })
const CHROMIUM =
  process.env.CHROMIUM_PATH ||
  ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'].find((p) => existsSync(p))

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const logs = []
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && logs.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))

const state = () =>
  page.evaluate(() => {
    const { book } = window.__jhana
    const on = [...document.querySelectorAll('#dots .dot')].findIndex((d) => d.classList.contains('on'))
    return { n: book.n, turning: book.turning, dot: on, hint: document.getElementById('hint').className }
  })
// wall-clock waits are unreliable under SwiftShader (a few fps), so wait for
// the engine itself
const settle = () => page.waitForFunction(() => !window.__jhana.book.turning, null, { timeout: 120000 })
const waitTurnTime = (s) =>
  page.waitForFunction((s) => window.__jhana.book.turn && window.__jhana.book.turn.t >= s, s, { timeout: 120000 })
const shot = async (name) => {
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log(name, JSON.stringify(await state()))
}

const fromOutro = process.env.FROM === 'outro'
await page.goto(fromOutro ? `${base}?page=outro` : base, { waitUntil: 'load' })
await page.waitForTimeout(1500)
await shot('t0-start')
if (!fromOutro) {

// 1. click the right half: the cover opens
await page.mouse.click(900, 400)
await waitTurnTime(1.2)
await shot('t1-cover-mid')
await settle()
await shot('t2-intro')

// 2. keyboard → next spread
await page.keyboard.press('ArrowRight')
await waitTurnTime(1.0)
await shot('t3-turn-mid')
await settle()
await shot('t4-jhana1')

// 3. left half click → back to the intro
await page.mouse.click(300, 400)
await settle()
console.log('after left click', JSON.stringify(await state()))

// 4. dot jump: spread 6 (jhana-6) — a multi-leaf block
await page.click('#dots .dot:nth-child(7)')
await waitTurnTime(0.8)
await shot('t5-jump-mid')
await settle()
await shot('t6-jhana6')

// 5. to the outro, then close onto the back cover
await page.click('#dots .dot:nth-child(10)')
await settle()
}
await page.keyboard.press(' ')
await waitTurnTime(1.3)
await shot('t7-closing-back')
await settle()
await shot('t8-closed-back')

// 6. begin again → flips back to the front cover
await page.click('#again')
await waitTurnTime(1.3)
await shot('t9-flip-mid')
await settle()
await shot('t10-front-again')

// 7. a dot from the closed state (what the gallery thumbnail can use)
await page.click('#dots .dot:nth-child(4)')
await settle()
await shot('t11-dot-from-closed')

for (const l of logs) console.log(l)
await browser.close()
