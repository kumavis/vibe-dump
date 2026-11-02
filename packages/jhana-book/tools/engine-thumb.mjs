// engine-thumb.mjs — shoot a URL exactly like scripts/thumbnails.mjs does:
// 1280×800 at DPR 2, no GPU flags, networkidle + 1200 ms, JPEG at CSS size.
//
//   npx vite build --outDir /tmp/me/dist && npx vite preview --outDir /tmp/me/dist --port <port>
//   node tools/engine-thumb.mjs "http://127.0.0.1:<port>/" /tmp/me/thumb.jpg [--click "#dots .dot:nth-child(4)"] [--settle 1200]

import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const argv = process.argv.slice(2)
const pos = []
const opts = { settle: 1200, click: null }
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--click') opts.click = argv[++i]
  else if (argv[i] === '--settle') opts.settle = Number(argv[++i])
  else pos.push(argv[i])
}
const [url, out] = pos
const CHROMIUM = process.env.CHROMIUM_PATH || ['/opt/pw-browsers/chromium'].find((p) => existsSync(p))
const browser = await chromium.launch({ executablePath: CHROMIUM })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const logs = []
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && logs.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
const t0 = Date.now()
await page.goto(url, { timeout: 30000 })
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
if (opts.click) await page.click(opts.click, { timeout: 60000 })
await page.waitForTimeout(opts.settle)
await page.screenshot({ path: out, type: 'jpeg', quality: 82, scale: 'css' })
console.log(`wrote ${out} after ${Date.now() - t0} ms`)
for (const l of logs) console.log(l)
await browser.close()
