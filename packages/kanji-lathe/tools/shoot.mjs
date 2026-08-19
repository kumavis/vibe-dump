#!/usr/bin/env node
// Visual check: build the app, drive it with a real browser, and write one PNG
// per preset so a human (or an agent) can actually look at the output.
//
//   npm run build --workspace @vibe-dump/kanji-lathe
//   node tools/shoot.mjs [outDir] [--char 海] [--view single]
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIST = join(HERE, '..', 'dist')
const argv = process.argv.slice(2)
const outDir = argv.find((a) => !a.startsWith('--')) || join(HERE, '..', '..', '..', 'shots')
const arg = (n, d) => {
  const i = argv.indexOf('--' + n)
  return i === -1 ? d : argv[i + 1]
}

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('no dist/ — run the package build first')
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

const { url, close } = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1500, height: 940 }, deviceScaleFactor: 1 })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector('#app:not([hidden])', { timeout: 20000 })

const presets = await page.$$eval('#presetSelect option', (o) => o.map((x) => x.value))
const char = arg('char', '海')
const view = arg('view', 'single')

await page.click(`.tab[data-view="${view}"]`)
await page.fill('#charInput', char)
await page.dispatchEvent('#charInput', 'input')
await page.waitForTimeout(400)

for (const p of presets) {
  await page.selectOption('#presetSelect', p)
  await page.waitForTimeout(650)
  const slug = p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'preset'
  await page.screenshot({ path: join(outDir, `${slug}.png`) })
  process.stdout.write(`  ✓ ${p}\n`)
}

// a full-window shot of every view, for layout review
for (const v of ['single', 'sheet', 'proof', 'evolve']) {
  await page.click(`.tab[data-view="${v}"]`)
  await page.waitForTimeout(v === 'single' ? 500 : 2600)
  await page.screenshot({ path: join(outDir, `view-${v}.png`) })
  process.stdout.write(`  ✓ view:${v}\n`)
}

await browser.close()
await close()
console.log(errors.length ? `\nCONSOLE ERRORS (${errors.length}):\n` + errors.slice(0, 20).join('\n') : '\nno console errors')
process.exit(errors.length ? 1 : 0)
