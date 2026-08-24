// shoot.mjs — drive the built app with a real browser and take the pictures
// that are hard to check by reading code: both themes, and the reveal at four
// points along the camera flight.
//
//   npm run build -w @vibe-dump/lotus-os && node tools/shoot.mjs
//
// Writes into tools/shots/. Point CHROMIUM_PATH at a pre-installed browser if
// Playwright's own download is not the one this machine has.

import { chromium } from 'playwright'
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startStaticServer } from '../../../scripts/static-server.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, '..', 'dist')
const outDir = join(here, 'shots')

const VIEW = { width: 1280, height: 800 }

async function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  const base = '/opt/pw-browsers'
  if (!existsSync(base)) return undefined
  for (const entry of await readdir(base)) {
    const candidate = join(base, entry, 'chrome-linux', 'chrome')
    if (entry.startsWith('chromium-') && existsSync(candidate)) return candidate
  }
  return undefined
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No dist/. Run: npm run build -w @vibe-dump/lotus-os')
  process.exit(1)
}

await mkdir(outDir, { recursive: true })
const { url, close } = await startStaticServer(dist)
const browser = await chromium.launch({
  executablePath: await findChromium(),
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage({ viewport: VIEW, deviceScaleFactor: 2 })

const shot = async (name) => {
  await page.screenshot({ path: join(outDir, `${name}.png`) })
  console.log(`  ${name}.png`)
}

page.on('console', (msg) => {
  if (msg.type() === 'error') console.log(`  [page error] ${msg.text()}`)
})
page.on('pageerror', (err) => console.log(`  [page throw] ${err.message}`))

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

console.log('desktop:')
await shot('01-desktop-dark')

await page.evaluate(() => window.lotus.shell.prefs.set('theme', 'light'))
await page.waitForTimeout(500)
await shot('02-desktop-light')
await page.evaluate(() => window.lotus.shell.prefs.set('theme', 'dark'))
await page.waitForTimeout(400)

// every program open at once, tiled — a quick look at all the chrome
await page.evaluate(() => {
  const s = window.lotus.shell
  s.wm.closeAll()
  s.launch('terminal')
  s.launch('settings')
  s.launch('motifs', { motif: 'kranok' })
  s.launch('explorer', { path: '/Notes' })
  setTimeout(() => s.wm.tileAll(), 60)
})
await page.waitForTimeout(900)
await shot('03-programs')

await page.evaluate(() => {
  const s = window.lotus.shell
  s.wm.closeAll()
  s.launch('reader', { path: '/Notes/bench-log.txt' }, { width: 566, height: 436, x: 224, y: 66 })
  s.launch('explorer', { path: '/Wat' }, { width: 524, height: 396, x: 800, y: 340 })
})
await page.waitForTimeout(700)

console.log('reveal:')
await page.evaluate(() => window.lotus.shell.reveal())
await page.waitForTimeout(1500)
await shot('04-loading')
await page.waitForTimeout(900)
await shot('05-handoff')
await page.waitForTimeout(1400)
await shot('06-flight')
await page.waitForTimeout(2600)
await shot('07-room')

// click the things
const clickAt = async (fx, fy) => {
  await page.mouse.move(VIEW.width * fx, VIEW.height * fy)
  await page.waitForTimeout(160)
  await page.mouse.down()
  await page.mouse.up()
}

const hits = await page.evaluate(() => {
  const ws = window.lotus.shell.workspace
  if (!ws) return []
  const out = []
  const seen = new Set()
  for (const key of ['printer', 'board', 'solder', 'room', 'desk', 'monitor']) {
    for (const it of ws.parts[key]?.interactives ?? []) {
      const o = (it.objects ?? (it.object ? [it.object] : []))[0]
      if (!o || seen.has(it.label)) continue
      seen.add(it.label)
      o.updateWorldMatrix(true, false)
      const p = { x: 0, y: 0, z: 0 }
      o.getWorldPosition(p)
      out.push({ key, label: it.label, world: [p.x, p.y, p.z] })
    }
  }
  return out
})
console.log('  interactives:', JSON.stringify(hits))

// Project the world points with the page's own camera and click them.
for (const h of hits) {
  const pt = await page.evaluate((world) => {
    const ws = window.lotus.shell.workspace
    const cam = ws.camera
    const v = { x: world[0], y: world[1], z: world[2] }
    // manual projection: worldToNDC via the camera's matrices
    const m = cam.matrixWorldInverse.elements
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12]
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13]
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14]
    const p = cam.projectionMatrix.elements
    const cx = p[0] * x + p[8] * z
    const cy = p[5] * y + p[9] * z
    const cw = -z
    return { x: (cx / cw) * 0.5 + 0.5, y: -(cy / cw) * 0.5 + 0.5 }
  }, h.world)
  if (pt.x < 0.02 || pt.x > 0.98 || pt.y < 0.02 || pt.y > 0.98) {
    console.log(`  ! ${h.label} projects off screen at ${pt.x.toFixed(2)},${pt.y.toFixed(2)}`)
    continue
  }
  if (h.key === 'monitor') continue // that one ends the room
  await clickAt(pt.x, pt.y)
  console.log(`  clicked ${h.label} at ${pt.x.toFixed(2)},${pt.y.toFixed(2)}`)
}

await page.waitForTimeout(1400)
await shot('08-activated')
await page.waitForTimeout(6000)
await shot('09-printing')

console.log('return:')
await page.evaluate(() => window.lotus.shell.workspace?.exit())
await page.waitForTimeout(1200)
await shot('10-flying-back')
await page.waitForTimeout(2000)
await shot('11-back-at-the-desktop')

await browser.close()
await close()
console.log(`\nDone -> ${outDir}`)
