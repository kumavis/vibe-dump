// ten boards of one set from the battle's default view, as one contact sheet
import { createRequire } from 'node:module'
const { chromium } = createRequire('/home/user/vibe-dump-wt/world/packages/tails-and-scales/package.json')('playwright')
import { startStaticServer } from '/home/user/vibe-dump-wt/world/scripts/static-server.mjs'
import { writeFileSync } from 'node:fs'
const OUT = '/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world/shots'
const DIST = process.env.DIST || '/home/user/vibe-dump-wt/world/packages/tails-and-scales/dist'
const [mission, set, prefix, ...seeds] = process.argv.slice(2)
const srv = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const T = 120000
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage(); page.setDefaultTimeout(T)
  page.on('pageerror', (e) => console.log('pageerror', e.message))
  await page.goto(`${srv.url}/?debug&dice=1&mission=${mission}&terrain=${set}`, { timeout: T })
  await page.waitForFunction(() => window.__ts, null, { timeout: T })
  const shots = []
  for (const s of seeds) {
    await page.evaluate((s) => { const i = document.querySelector('#seed'); i.value = s; i.dispatchEvent(new Event('change')) }, s)
    await page.waitForTimeout(300)
    await page.evaluate(() => window.__ts.start('watch'))
    await page.waitForFunction(() => window.__ts.S.stage === 'battle', null, { timeout: T })
    await page.waitForTimeout(3500)
    await page.evaluate(() => { window.__ts.clock.speed = 0 })
    await page.waitForTimeout(300)
    shots.push((await page.screenshot({ type: 'jpeg', quality: 70 })).toString('base64'))
    await page.evaluate(() => { window.__ts.clock.speed = 1 })
    console.log('seed', s)
  }
  const sheet = await ctx.newPage()
  await sheet.setViewportSize({ width: 1600, height: 400 * Math.ceil(shots.length / 5) / 2 })
  await sheet.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(5,320px);gap:0">${shots.map((b, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${b}" style="width:320px;height:200px;display:block"><span style="position:absolute;left:4px;top:2px;color:#fff;font:bold 14px sans-serif;text-shadow:0 0 3px #000">${seeds[i]}</span></div>`).join('')}</body>`)
  await sheet.screenshot({ path: `${OUT}/${prefix}-sheet-${set}-${mission}.png`, fullPage: true })
  console.log('sheet', `${prefix}-sheet-${set}-${mission}.png`)
} finally { await browser.close(); srv.close() }
