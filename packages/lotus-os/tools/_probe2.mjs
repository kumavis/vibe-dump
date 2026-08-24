import { chromium } from 'playwright'
import { join } from 'node:path'
import { startStaticServer } from '../../../scripts/static-server.mjs'

const dist = '/home/user/vibe-dump/packages/lotus-os/dist'
const out = '/tmp/claude-0/-home-user-vibe-dump/14ffc8fe-9687-5a92-938e-fc85f62ae238/scratchpad'
const { url, close } = await startStaticServer(dist)
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('  [pageerror]', e.message))
await page.goto(url, { waitUntil: 'load' })
await page.waitForTimeout(1500)
await page.screenshot({ path: join(out, 'e-page.png'), timeout: 90000 })

await page.evaluate(() => window.lotus.shell.reveal())
await page.waitForFunction(() => document.querySelector('.room')?.dataset.mode === 'room', { timeout: 30000 })

// force the camera back to the exact screen pose, canvas at full opacity
const info = await page.evaluate(() => {
  const w = window.lotus.shell.workspace
  const p = w.parts.monitor.screenPose()
  const fit = Math.min(innerWidth / 1440, innerHeight / 900)
  const d = (0.36 * innerHeight) / (2 * Math.tan((40 / 2) * Math.PI / 180) * (900 * fit))
  w.rig.drift = 0
  w.rig.setPose({ position: p.position.clone().addScaledVector(p.normal, d), target: p.position.clone(), fov: 40 })
  return { d, fit, canvasOpacity: getComputedStyle(document.querySelector('.room__gl')).opacity }
})
console.log('screen pose', JSON.stringify(info))
await page.waitForTimeout(400)
await page.screenshot({ path: join(out, 'f-screenpose-with-room.png'), timeout: 90000 })

// same shot with the bloom sprites hidden, for comparison
await page.evaluate(() => {
  const w = window.lotus.shell.workspace
  w.scene.traverse((o) => { if (o.isSprite) o.visible = false })
})
await page.waitForTimeout(400)
await page.screenshot({ path: join(out, 'g-screenpose-no-sprites.png'), timeout: 90000 })

await browser.close()
await close()
