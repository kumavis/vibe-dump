// engine-pages.mjs — render the printed page textures flat, as PNGs.
//
//   node tools/engine-pages.mjs [baseUrl] [outDir] [id ...]
//
// Uses the dev server's modules, so it shows exactly what the book prints.

import { chromium } from 'playwright'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const [base = 'http://127.0.0.1:5181/', out = '.', ...ids] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const CHROMIUM =
  process.env.CHROMIUM_PATH ||
  ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'].find((p) => existsSync(p))
const browser = await chromium.launch({ executablePath: CHROMIUM })
const page = await browser.newPage()
await page.goto(base, { waitUntil: 'load' })
const urls = await page.evaluate(async (ids) => {
  const { drawPage, drawCover } = await import('/src/textures.js')
  const scenes = (await import('/src/scenes/index.js')).default
  const pick = ids.length ? scenes.filter((m) => ids.includes(m.id)) : scenes
  const res = {}
  for (const m of pick) {
    for (const side of ['left', 'right']) res[`${m.id}-${side}`] = drawPage(m, side, 1024).toDataURL('image/png')
  }
  res.cover = drawCover(1024).toDataURL('image/png')
  return res
}, ids)
for (const [name, url] of Object.entries(urls)) {
  writeFileSync(`${out}/page-${name}.png`, Buffer.from(url.split(',')[1], 'base64'))
  console.log(`page-${name}.png`)
}
await browser.close()
