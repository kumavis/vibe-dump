#!/usr/bin/env node
// Fast iteration on one design: render a single preset (or the current URL hash)
// across several characters into one strip, so a tuning change can be judged in
// a couple of seconds instead of a full preset sweep.
//
//   node tools/preview.mjs "Modular Grid" [out.png] [--chars 海警国日一鑑]
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIST = join(HERE, '..', 'dist')
const argv = process.argv.slice(2)
const preset = argv[0]
const out = argv[1] && !argv[1].startsWith('--') ? argv[1] : join(tmpdir(), 'kanji-lathe-preview.png')
const ci = argv.indexOf('--chars')
const chars = [...(ci === -1 ? '海警国日一議' : argv[ci + 1])]

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('no dist/ — build the package first')
  process.exit(1)
}
const { url, close } = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1500, height: 940 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector('#app:not([hidden])', { timeout: 20000 })
if (preset) await page.selectOption('#presetSelect', preset)

const tiles = []
for (const ch of chars) {
  await page.fill('#charInput', ch)
  await page.dispatchEvent('#charInput', 'input')
  await page.waitForTimeout(420)
  tiles.push(
    await page.evaluate(() => {
      const src = document.getElementById('glyphCanvas')
      const side = Math.min(src.width, src.height)
      const c = document.createElement('canvas')
      c.width = c.height = 320
      c.getContext('2d').drawImage(src, (src.width - side) / 2, (src.height - side) / 2, side, side, 0, 0, 320, 320)
      return c.toDataURL('image/png')
    }),
  )
  const leg = await page.textContent('#metricStats')
  process.stdout.write(`  ${ch} ${leg.slice(0, 24).replace(/\s+/g, ' ')}\n`)
}

const strip = await page.evaluate(async (tiles) => {
  const c = document.createElement('canvas')
  c.width = tiles.length * 320
  c.height = 320
  const g = c.getContext('2d')
  g.fillStyle = '#0a0a0c'
  g.fillRect(0, 0, c.width, c.height)
  for (let i = 0; i < tiles.length; i++) {
    const img = new Image()
    await new Promise((r) => { img.onload = r; img.src = tiles[i] })
    g.drawImage(img, i * 320, 0)
  }
  return c.toDataURL('image/png')
}, tiles)
writeFileSync(out, Buffer.from(strip.split(',')[1], 'base64'))
await browser.close()
await close()
console.log(`${out}${errors.length ? '\npage errors: ' + errors.join('\n') : ''}`)
