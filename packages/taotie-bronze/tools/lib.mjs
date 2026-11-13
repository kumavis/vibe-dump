// Shared Playwright plumbing for the taotie-bronze tools: serve the built
// dist/, launch the container's Chromium, open the app with URL params and
// wait for the verification hooks. SwiftShader is slow — timeouts are generous.
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startStaticServer } from '../../../scripts/static-server.mjs'

export const HERE = dirname(fileURLToPath(import.meta.url))
export const PKG = join(HERE, '..')
export const DIST = join(PKG, 'dist')

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const k = a.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) out[k] = true
      else {
        out[k] = next
        i++
      }
    } else out._.push(a)
  }
  return out
}

export function chromiumPath() {
  for (const p of [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium']) if (p && existsSync(p)) return p
  return undefined // let Playwright use its own download
}

/** Serve dist/ and launch a browser. Returns { open(params, viewport), close() }. */
export async function session({ timeout = 240000 } = {}) {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('no dist/ — run `npm run build --workspace @vibe-dump/taotie-bronze` first')
    process.exit(1)
  }
  const server = await startStaticServer(DIST)
  const browser = await chromium.launch({
    executablePath: chromiumPath(),
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  })
  const pages = []
  return {
    url: server.url,
    async open(params = {}, { width = 1400, height = 1050, dpr = 1 } = {}) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dpr })
      page.setDefaultTimeout(timeout)
      const errors = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text())
      })
      page.on('pageerror', (e) => errors.push(String(e)))
      const qs = new URLSearchParams(params).toString()
      await page.goto(`${server.url}/?${qs}`, { waitUntil: 'load' })
      pages.push(page)
      return { page, errors }
    },
    async waitReady(page) {
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1' || document.documentElement.dataset.ready === 'error', null, { timeout })
      const state = await page.evaluate(() => document.documentElement.dataset.ready)
      if (state !== '1') throw new Error('app reported a boot error')
    },
    async close() {
      await browser.close()
      await server.close()
    },
  }
}
