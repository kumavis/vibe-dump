// Shoots the Bushtail Clans' six figures with splat fur beside the game's mesh figures today, close up and
// at game scale (about 60 and 28 px tall: the level-of-detail rule's splat counts), through viewer.html
// under a Vite dev server, and lays the shots out in one labelled sheet (<out>/units.png, and .jpg).
//   node proto/splat/sheet.mjs <out dir> [unit...]       (from packages/tails-and-scales)
// Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's own isn't installed.
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = fileURLToPath(new URL('../..', import.meta.url))
const [outArg, ...only] = process.argv.slice(2)
if (!outArg) throw new Error('usage: node proto/splat/sheet.mjs <out dir> [unit...]')
const OUT = resolve(outArg)
mkdirSync(OUT, { recursive: true })
const UNITS = [
  { key: 'nutkin', label: 'Nutkin<br>Skirmisher', dist: 2.8, ty: 0.6 },
  { key: 'grenadier', label: 'Acorn<br>Grenadier', dist: 2.8, ty: 0.6 },
  { key: 'oakguard', label: 'Oak Guard', dist: 2.9, ty: 0.62 },
  { key: 'glider', label: 'Glider', dist: 3.4, ty: 0.7 },
  { key: 'trebuchet', label: 'Pinecone<br>Trebuchet', dist: 6, ty: 0.8 },
  { key: 'elder', label: 'Elder<br>Chitterwick', dist: 3.4, ty: 0.75 },
].filter((u) => !only.length || only.includes(u.key))
const COLS = [
  { label: 'splat fur + mesh kit<br>close-up', size: 300, zoom: 1, q: 'density=0.2' },
  { label: 'game today<br>close-up', size: 300, zoom: 1, q: 'mesh=1' },
  { label: 'splat fur + mesh kit<br>figure ~60 px', size: 86, zoom: 2.5, q: 'density=0.1&n=6000' },
  { label: 'game today<br>~60 px', size: 86, zoom: 2.5, q: 'mesh=1' },
  { label: 'splat fur + mesh kit<br>~28 px (classic table)', size: 40, zoom: 3, q: 'density=0.1&n=1300' },
  { label: 'game today<br>~28 px', size: 40, zoom: 3, q: 'mesh=1' },
]

const server = await createServer({ root: PKG, configFile: join(PKG, 'vite.config.js'), logLevel: 'warn', server: { host: '127.0.0.1', port: 0 }, optimizeDeps: { include: ['three'] } })
await server.listen()
const origin = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const rows = []
try {
  for (const u of UNITS) {
    const cells = []
    for (const [ci, col] of COLS.entries()) {
      const page = await browser.newPage({ viewport: { width: col.size + 20, height: col.size + 20 }, deviceScaleFactor: 1 })
      const errs = []
      page.on('pageerror', (e) => errs.push(e.message))
      await page.goto(`${origin}/proto/splat/viewer.html?unit=${u.key}&w=${col.size}&h=${col.size}&dist=${u.dist}&ty=${u.ty}&${col.q}`)
      const info = await page.waitForFunction(() => window.done, null, { timeout: 300000 }).then((h) => h.jsonValue()).catch(() => (errs.push('timeout'), null))
      const file = `units-${u.key}-${ci}.png`
      await page.locator('canvas').screenshot({ path: join(OUT, file), timeout: 120000 })
      cells.push({ file, info, col })
      console.log(u.key, '|', col.label.replace(/<br>/g, ' '), JSON.stringify(info), errs.join(' | '))
      await page.close()
    }
    rows.push({ u, cells })
  }
  const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:#1c1f17;color:#e8e2d0;font:13px system-ui,sans-serif}
table{border-collapse:collapse}td,th{padding:6px 8px;vertical-align:middle;text-align:center}th{font-weight:600}
img{image-rendering:pixelated;display:block;margin:auto}.n{color:#a9b08f;font-size:11px}
</style><table><tr><th></th>${COLS.map((c) => `<th>${c.label}${c.zoom > 1 ? `<br><span class="n">shown ×${c.zoom}</span>` : ''}</th>`).join('')}</tr>
${rows.map(({ u, cells }) => `<tr><th>${u.label}</th>${cells.map((x) => `<td><img src="${x.file}" width="${Math.round(x.col.size * x.col.zoom)}"><div class="n">${x.info?.splats ? `${x.info.splats.toLocaleString()} splats` : 'mesh'}</div></td>`).join('')}</tr>`).join('\n')}
</table>`
  const name = only.length ? `units-${only.join('-')}` : 'units'
  writeFileSync(join(OUT, `${name}.html`), html)
  const sheet = await browser.newPage({ viewport: { width: 1500, height: 900 } })
  await sheet.goto(`file://${join(OUT, `${name}.html`)}`)
  await sheet.screenshot({ path: join(OUT, `${name}.png`), fullPage: true })
  await sheet.screenshot({ path: join(OUT, `${name}.jpg`), fullPage: true, type: 'jpeg', quality: 82 })
  console.log(`sheet: ${join(OUT, `${name}.png`)}`)
} finally {
  await browser.close()
  await server.close()
}
