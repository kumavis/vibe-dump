// Screenshots of the tail's wording for review, from a built app (argv[2]: the dist dir).
import { chromium } from '/home/user/vibe-dump-wt/units/node_modules/playwright/index.mjs'
import { startStaticServer } from '/home/user/vibe-dump-wt/units/scripts/static-server.mjs'
const OUT = '/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/shots'
const dist = process.argv[2]
const served = await startStaticServer(dist)
const url = served.url ?? `http://127.0.0.1:${served.port ?? served.address?.().port}`
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (...a) => console.log(...a)

async function hotseat(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => log('pageerror', e.message))
  const ev = (fn, arg) => page.evaluate(fn, arg)
  await page.goto(`${url}/?debug&lowfi&seed=4242&dice=1`)
  await page.waitForSelector('#title:not(.hidden)', { timeout: 120000 })
  await page.click('[data-mode="hotseat"]')
  await page.click('#setupStart')
  for (let k = 0; k < 2; k++) {
    await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: 180000 })
    await ev(() => window.__ts.endPhase())
  }
  await page.waitForFunction(() => window.__ts.phaseResolve, null, { timeout: 180000 })
  return { ctx, page, ev }
}
const seatUnit = (ev, key) => ev((key) => {
  const ts = window.__ts, seat = ts.session.decisionFor()
  const u = ts.G.units.find((u) => u.side === seat && u.t.key === key && u.alive > 0) ?? ts.G.units.find((u) => u.side === seat && u.alive > 0)
  return { id: u.id, x: u.pos.x, z: u.pos.z, side: u.side, key: u.t.key }
}, key)
const select = (ev, id) => ev((id) => window.__ts.select(window.__ts.G.units.find((u) => u.id === id)), id)
const screen = (ev, x, y, z) => ev(([x, y, z]) => window.__ts.screen(x, y, z), [x, y, z])
async function hover(page, ev, x, y, z) {
  const [px, py] = await screen(ev, x, y, z)
  await page.mouse.move(px + 4, py + 3)
  await page.mouse.move(px, py, { steps: 2 })
  await sleep(600)
}

// 1. the card (a blast weapon, then a ranged one), the move tooltip, the shot tooltip, the help
{
  const { ctx, page, ev } = await hotseat(1280, 800)
  log('phase', await ev(() => ({ seat: window.__ts.session.decisionFor(), phase: window.__ts.S.phase })))
  const g = await seatUnit(ev, 'grenadier')
  await select(ev, g.id)
  await sleep(800)
  await page.screenshot({ path: `${OUT}/units-card-blast.png` })
  log('card blast', await ev(() => document.querySelector('#card')?.innerText))
  const toward = g.x < 0 ? 1 : -1
  await hover(page, ev, g.x + toward * 5, 0, g.z)
  await page.screenshot({ path: `${OUT}/units-move-tooltip.png` })
  log('move tip', await ev(() => document.querySelector('#tooltip')?.innerText))
  const n = await seatUnit(ev, 'nutkin')
  await page.mouse.move(4, 4)
  await select(ev, n.id)
  await sleep(800)
  await page.screenshot({ path: `${OUT}/units-card-ranged.png` })
  log('card ranged', await ev(() => document.querySelector('#card')?.innerText))
  // the shooting phase: the trebuchet (36 tails) at the nearest enemy
  await ev(() => window.__ts.select(null))
  await ev(() => window.__ts.endPhase())
  await page.waitForFunction(() => window.__ts.phaseResolve && window.__ts.S.phase === 'shoot', null, { timeout: 120000 }).catch(() => log('no shoot phase'))
  const shooter = await seatUnit(ev, 'trebuchet')
  const enemy = await ev((sid) => {
    const ts = window.__ts, s = ts.G.units.find((u) => u.id === sid)
    const es = ts.G.units.filter((u) => u.side !== s.side && u.alive > 0).sort((a, b) => Math.hypot(a.pos.x - s.pos.x, a.pos.z - s.pos.z) - Math.hypot(b.pos.x - s.pos.x, b.pos.z - s.pos.z))
    return { x: es[0].pos.x, z: es[0].pos.z }
  }, shooter.id)
  await select(ev, shooter.id)
  await sleep(500)
  await hover(page, ev, enemy.x, 0.5, enemy.z)
  await page.screenshot({ path: `${OUT}/units-shot-tooltip.png` })
  log('shot tip', await ev(() => document.querySelector('#tooltip')?.innerText))
  await page.mouse.move(4, 4)
  await ev(() => window.__ts.select(null))
  await page.click('#helpBtn')
  await sleep(500)
  await ev(() => document.querySelector('#help .spells')?.scrollIntoView({ block: 'center' }))
  await sleep(300)
  await page.screenshot({ path: `${OUT}/units-help-spells.png` })
  await ctx.close()
}
// 2. the card at 360 px wide
{
  const { ctx, page, ev } = await hotseat(360, 740)
  const g = await seatUnit(ev, 'grenadier')
  await select(ev, g.id)
  await sleep(800)
  await page.screenshot({ path: `${OUT}/units-card-360.png` })
  log('360 card', await ev(() => ({ w: document.documentElement.scrollWidth, card: document.querySelector('#card')?.getBoundingClientRect().toJSON() })))
  await ctx.close()
}
// 3. a watched battle: the dice tray after a charge roll, the battle log with a move and an advance
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(`${url}/?debug&lowfi&seed=4242&dice=99`)
  await page.waitForSelector('#title:not(.hidden)', { timeout: 120000 })
  await page.click('[data-mode="watch"]')
  await page.waitForFunction(() => /Charge \d+t/.test(document.querySelector('#tray')?.innerText ?? ''), null, { timeout: 900000, polling: 100 })
  await sleep(700)
  await page.screenshot({ path: `${OUT}/units-dice-charge.png` })
  log('tray', await page.evaluate(() => document.querySelector('#tray').innerText))
  const lines = await page.evaluate(() => [...document.querySelectorAll('#logList > *')].map((e) => e.innerText))
  log('log', lines.filter((l) => /tail/.test(l)).slice(0, 8))
  await page.evaluate(() => {
    const list = document.querySelector('#logList')
    const adv = [...list.children].find((e) => /advance: \+/.test(e.innerText))
    adv?.scrollIntoView({ block: 'center' })
  })
  await sleep(300)
  await page.screenshot({ path: `${OUT}/units-battle-log.png` })
  await ctx.close()
}
await browser.close()
served.close?.()
process.exit(0)
