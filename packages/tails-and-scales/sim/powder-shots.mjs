// (V3d, DESIGN §4.2.11) The Powder Field shot: a watched battle of the
// `powder` mission started from the title as a player starts one (the
// battle-setup panel's Start), its board held still once deployed, and
// photographed at 1280×800 from the camera the battle opens on (behind a
// seat's army) and from the overview (Home), with the fires given a few
// seconds to build their smoke first. A look, not a gate: it writes PNGs
// for a person to judge (does it read as a battlefield after a fight,
// dramatic and legible?), and prints what burns and how much smoke flies
// (?debug's view.drawing().fires).
//
//   node sim/powder-shots.mjs [--seed 7] [--out <dir>] [--battle 0] [--mission powder]
//
// --battle N plays N seconds of the battle (game time, fast) before the
// shots, so kegs have gone up and wrecks are broken; --mission shoots
// another mission's board the same way (grand: the open Grand table, to
// compare). Build first (it
// shoots dist/). Exit 0 when the shots are written, 1 on a page error.
import { parseArgs } from 'node:util'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { DIST, IDLE_MS } from './chromium.mjs'

const { values: a } = parseArgs({ options: { seed: { type: 'string' }, out: { type: 'string' }, battle: { type: 'string' }, mission: { type: 'string' } } })
const SEED = Number(a.seed ?? 7), OUT = a.out ?? join(process.cwd(), 'powder-shots'), BATTLE = Number(a.battle ?? 0), MISSION = a.mission ?? 'powder'
if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`powder-shots: no build at ${DIST} (build first)`)
  process.exit(2)
}
mkdirSync(OUT, { recursive: true })
const server = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const errors = []
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  page.on('pageerror', (e) => (errors.push(e.message), console.log('pageerror:', e.stack ?? e.message)))
  page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()))
  await page.goto(`${server.url}/?debug&seed=${SEED}&mission=${MISSION}`, { timeout: IDLE_MS })
  await page.waitForFunction(() => window.__ts, null, { timeout: IDLE_MS })
  await page.evaluate(() => document.querySelector('[data-mode="watch"]').click())
  await page.waitForFunction(() => !document.querySelector('#setup').classList.contains('hidden'), null, { timeout: IDLE_MS })
  await page.evaluate(() => document.querySelector('#setupStart').click())
  await page.waitForFunction(() => ['deploy', 'battle'].includes(window.__ts.S.stage), null, { timeout: IDLE_MS })
  await page.evaluate(() => (window.__ts.S.follow = false))
  if (BATTLE > 0) {
    await page.evaluate(() => (window.__ts.clock.speed = 8))
    const t0 = await page.evaluate(() => window.__ts.clock.time)
    await page.waitForFunction(([t, s]) => window.__ts.clock.time > t + s, [t0, BATTLE], { timeout: 600000, polling: 500 })
    await page.evaluate(() => (window.__ts.clock.speed = 1))
  }
  // the camera the battle opened on, the fires given time to smoke
  // a frame's time, and a shot (SwiftShader: a Grand frame can take seconds)
  const frameMs = () => page.evaluate(() => new Promise((res) => {
    const t0 = performance.now()
    requestAnimationFrame(() => requestAnimationFrame(() => res(performance.now() - t0)))
  }))
  const shot = async (name) => {
    console.log(`  ${name}: two frames in ${(await frameMs()).toFixed(0)} ms`)
    await page.screenshot({ path: join(OUT, `powder-${SEED}-${name}.png`), timeout: 300000 })
  }
  // (the smoke run on s seconds at once, then a few frames drawn)
  const settle = async (s) => {
    await page.evaluate((d) => window.__ts.view.smoke(d), s)
    await page.evaluate(() => new Promise((res) => {
      let n = 0
      const f = () => (++n >= 4 ? res() : requestAnimationFrame(f))
      requestAnimationFrame(f)
    }))
  }
  await settle(6)
  const fires = await page.evaluate(() => window.__ts.view.drawing?.().fires ?? null)
  await shot('game')
  await page.evaluate(() => window.__ts.view.look('overview'))
  await settle(3)
  await shot('overview')
  // and closer: the centre from a seat's side, low
  await page.evaluate(() => window.__ts.view.look({ pos: [-24, 15, 14], target: [0, 0, 2] }))
  await settle(2)
  await shot('centre')
  // and a wreck site: the first site pair's objective, from above it
  await page.evaluate(() => window.__ts.view.look({ pos: [-22, 13, 22], target: [-12, 0, 12] }))
  await settle(2)
  await shot('site')
  console.log(`powder-shots: board ${SEED}${BATTLE ? `, ${BATTLE} s into the battle` : ''}: ${OUT}/powder-${SEED}-{game,overview,centre,site}.png; fires ${JSON.stringify(fires)}`)
} finally {
  await browser.close()
  await server.close()
}
if (errors.length) {
  console.log(`powder-shots: the page threw: ${errors.slice(0, 3).join(' | ')}`)
  process.exit(1)
}
