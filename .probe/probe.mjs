import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { startStaticServer } from '/home/user/vibe-dump/scripts/static-server.mjs'

const dist = '/home/user/vibe-dump/packages/lotus-os/dist'
async function findChromium() {
  const base = '/opt/pw-browsers'
  for (const entry of await readdir(base)) {
    const c = join(base, entry, 'chrome-linux', 'chrome')
    if (entry.startsWith('chromium-') && existsSync(c)) return c
  }
}
const { url, close } = await startStaticServer(dist)
const browser = await chromium.launch({ executablePath: await findChromium(), args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('[throw]', e.message))
page.on('console', (m) => { if (m.type()==='error') console.log('[err]', m.text()) })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

const report = async (tag) => {
  const r = await page.evaluate(() => {
    const os = document.getElementById('os')
    const rect = os.getBoundingClientRect()
    return {
      parent: os.parentElement?.className || os.parentElement?.id || os.parentElement?.tagName,
      transform: os.style.transform ? os.style.transform.slice(0, 60) : '(none)',
      position: os.style.position,
      rect: [Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height)],
      mode: document.querySelector('.room')?.dataset.mode ?? 'no-room',
    }
  })
  console.log(tag, JSON.stringify(r))
}

await report('before   ')
await page.evaluate(() => window.lotus.shell.reveal())
await page.waitForTimeout(2000)
await report('reveal1a ')
await page.waitForTimeout(6000)
await report('reveal1b ')

await page.evaluate(() => window.lotus.shell.workspace?.exit())
await page.waitForTimeout(4500)
await report('afterExit')

await page.evaluate(() => window.lotus.shell.reveal())
await page.waitForTimeout(2500)
await report('reveal2a ')
await page.screenshot({ path: '/tmp/claude-0/-home-user-vibe-dump/14ffc8fe-9687-5a92-938e-fc85f62ae238/scratchpad/reveal2.png' })
await page.waitForTimeout(5000)
await report('reveal2b ')
await page.screenshot({ path: '/tmp/claude-0/-home-user-vibe-dump/14ffc8fe-9687-5a92-938e-fc85f62ae238/scratchpad/reveal2b.png' })

await browser.close()
await close()
