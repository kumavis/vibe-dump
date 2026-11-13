#!/usr/bin/env node
// Shoot frozen frames of a segment for review.
//
//   node tools/shoot.mjs <id> <t1> [t2 …] [--out dir] [--size 1280x720] [--url http://localhost:5173/]
//                        [--crop x,y,w,h]   (a stage-unit region, saved at 2× — for close inspection)
//
// <id> is a segment id, or `title` / `end`. Each t loads `?seg=<id>&t=<t>&freeze=1` in Playwright's
// Chromium, waits for window.__ready, and saves the stage canvas as <out>/<id>@<t>.png (default out:
// ./shots/<id>/). Batch your timestamps: one invocation = one server + one browser.
//
// Safe to run many at once in the same checkout: without --url each run starts its own Vite dev
// server on a free port (port 0 → the OS picks) with its own dependency cache in the temp dir, and
// shuts it down on exit, error or Ctrl-C. It never builds and never reads dist/. Browser:
// CHROMIUM_PATH if set, else Playwright's own, else the newest Chromium in the Playwright cache.
// Console errors and warnings from the page are printed under each frame; exit code 1 if any frame
// failed.
import { mkdir, writeFile, readdir, mkdtemp, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { homedir, tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const pkg = dirname(dirname(fileURLToPath(import.meta.url)))
const argv = process.argv.slice(2)
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  if (i < 0) return def
  const v = argv[i + 1]
  argv.splice(i, 2)
  return v
}
const outOpt = opt('out', null)
const [W, H] = opt('size', '1280x720').split('x').map(Number)
let url = opt('url', null)
const crop = opt('crop', null)?.split(',').map(Number) // x,y,w,h in stage units: saved at 2× for detail
const quiet = argv.includes('--quiet') && argv.splice(argv.indexOf('--quiet'), 1)
const [id, ...times] = argv
const out = resolve(outOpt ?? join('shots', id ?? 'x'))
const bad = times.filter((t) => !Number.isFinite(Number(t)))
if (bad.length) {
  console.error(`not a time (seconds): ${bad.join(', ')}`)
  process.exit(2)
}
if (!id || !times.length) {
  console.error('usage: node tools/shoot.mjs <id> <t1> [t2 …] [--out dir] [--size 1280x720] [--url URL]')
  process.exit(2)
}

async function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH
  return undefined
}

async function cachedChromiums() {
  const roots = [join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright'), '/opt/pw-browsers']
  const found = []
  for (const r of roots) {
    if (!existsSync(r)) continue
    for (const d of (await readdir(r)).sort().reverse()) {
      if (!/^chromium(_headless_shell)?-\d+/.test(d)) continue
      for (const rel of [
        'chrome-headless-shell-mac-arm64/chrome-headless-shell',
        'chrome-headless-shell-mac-x64/chrome-headless-shell',
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        'chrome-linux/chrome',
        'chrome-linux64/chrome',
        'chrome-headless-shell-linux64/chrome-headless-shell',
      ]) {
        const p = join(r, d, rel)
        if (existsSync(p)) found.push(p)
      }
    }
  }
  return found
}

const { chromium } = await import('playwright')
const args = ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
let browser
const first = await findChromium()
try {
  browser = await chromium.launch({ executablePath: first, args })
} catch (e) {
  for (const p of await cachedChromiums()) {
    try {
      browser = await chromium.launch({ executablePath: p, args })
      if (!quiet) console.log(`(using ${p})`)
      break
    } catch {}
  }
  if (!browser) {
    console.error(`could not launch Chromium: ${e.message}\nset CHROMIUM_PATH to a Chromium/Chrome binary`)
    process.exit(1)
  }
}

let server = null
let cacheDir = null
let cleaned = false
async function cleanup() {
  if (cleaned) return
  cleaned = true
  await browser?.close().catch(() => {})
  await server?.close().catch(() => {})
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true }).catch(() => {})
}
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => cleanup().then(() => process.exit(130)))
try {
  if (!url) {
    const { createServer } = await import('vite')
    cacheDir = await mkdtemp(join(tmpdir(), 'late-cluster-shoot-'))
    server = await createServer({
      root: pkg,
      configFile: join(pkg, 'vite.config.js'),
      logLevel: 'error',
      cacheDir,
      clearScreen: false,
      server: { port: 0, strictPort: false, hmr: false, watch: null },
    })
    await server.listen()
    url = server.resolvedUrls.local[0]
  }
} catch (e) {
  console.error(`could not start the dev server: ${e.message}`)
  await cleanup()
  process.exit(1)
}
if (!url.endsWith('/')) url += '/'

process.on('uncaughtException', (e) => {
  console.error(e)
  cleanup().then(() => process.exit(1))
})
await mkdir(out, { recursive: true })
const ctx = await browser.newContext({ viewport: { width: W, height: H + 46 }, deviceScaleFactor: 1 })
let failed = 0
for (const t of times) {
  const page = await ctx.newPage()
  const logs = []
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && logs.push(`${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`))
  const file = join(out, `${id}@${t}${crop ? '-crop' : ''}.png`)
  try {
    const t0 = Date.now()
    await page.goto(`${url}?seg=${encodeURIComponent(id)}&t=${t}&freeze=1`, { waitUntil: 'load', timeout: 60000 })
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 90000 })
    const data = await page.evaluate((crop) => {
      const c = document.getElementById('stage')
      if (!crop) return c.toDataURL('image/png')
      const k = c.width / 1280
      const o = document.createElement('canvas')
      o.width = crop[2] * 2
      o.height = crop[3] * 2
      o.getContext('2d').drawImage(c, crop[0] * k, crop[1] * k, crop[2] * k, crop[3] * k, 0, 0, o.width, o.height)
      return o.toDataURL('image/png')
    }, crop)
    await writeFile(file, Buffer.from(data.split(',')[1], 'base64'))
    console.log(`${file}  (${((Date.now() - t0) / 1000).toFixed(1)} s)`)
  } catch (e) {
    failed++
    console.error(`${id} @ ${t}: ${e.message}`)
  }
  for (const l of logs) console.log(`   ${l}`)
  await page.close()
}
await cleanup()
process.exit(failed ? 1 : 0)
