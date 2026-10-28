// shot.mjs — screenshot a URL with the container's pre-installed Chromium.
//
//   node tools/shot.mjs <url> <out.png> [--wait 1500] [--w 1280] [--h 800] [--dpr 1]
//
// Prints page console errors/warnings to stdout so a broken scene is visible
// from the shell. Use it against your own dev server:
//
//   npx vite --port 5181 --strictPort &
//   node tools/shot.mjs "http://127.0.0.1:5181/?page=jhana-1&theta=0.5" /tmp/j1-half.png
//
// or against a static build (`vite build --outDir <dir>` + `npx vite preview`).

import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const argv = process.argv.slice(2)
const positional = []
const opts = { wait: 1500, w: 1280, h: 800, dpr: 1 }
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) opts[a.slice(2)] = Number(argv[++i])
  else positional.push(a)
}
const [url, out] = positional
if (!url || !out) {
  console.error('usage: node tools/shot.mjs <url> <out.png> [--wait ms] [--w px] [--h px] [--dpr n]')
  process.exit(2)
}

const CHROMIUM =
  process.env.CHROMIUM_PATH ||
  ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'].find((p) => existsSync(p))

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: opts.w, height: opts.h }, deviceScaleFactor: opts.dpr })
const logs = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') logs.push(`[${m.type()}] ${m.text()}`)
})
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
try {
  await page.goto(url, { timeout: 60000, waitUntil: 'load' })
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(opts.wait)
  await page.screenshot({ path: out, timeout: 120000 })
  console.log(`wrote ${out}`)
} finally {
  for (const l of logs) console.log(l)
  await browser.close()
}
