// Shoots the Coil of Ssithra's six figures, smooth and glossy (view/models/gloss/serpents.js, the game's own
// since V2), beside the classic mesh figures (the "game today" columns: the game's figures before V2), close
// up and at game scale (about 60 and 28 px tall), through viewer.html under a Vite dev server,
// and lays the shots out in one labelled sheet (<out>/units.png, and .jpg). Then shoots each glossy figure
// close up from the game's camera (44° up) and once from behind (<out>/close-<unit>.png, back-<unit>.png),
// and the two armies on one table (pair.html: <out>/pair.png close, pair-small.png at game scale).
//   node proto/scales/sheet.mjs <out dir> [unit... | pair]       (from packages/tails-and-scales)
// Set CHROMIUM_PATH to the pre-installed Chromium if Playwright's own isn't installed.
//
// It also measures the 28 px cells (<out>/metrics.json, and under each cell of the sheet):
//   white   near-white pixels (every channel ≥ 170 of 255): the glints a small glossy figure can scatter
//   dpr2    the same, drawn at device pixel ratio 2 and averaged back down to 28 px (the gloss's level of
//           detail is normalised by the pixel ratio, so this should match `white`)
//   noise   the coil's pixel noise: the mean |Laplacian| of the luminance inside the coil (a mask drawn by
//           viewer.html?mask=coil, the coil alone below the torso, shrunk by a pixel off its silhouette),
//           against today's mesh in the same pixels
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = fileURLToPath(new URL('../..', import.meta.url))
const [outArg, ...only] = process.argv.slice(2)
if (!outArg) throw new Error('usage: node proto/scales/sheet.mjs <out dir> [unit... | pair]')
const OUT = resolve(outArg)
mkdirSync(OUT, { recursive: true })
const pairOnly = only.length === 1 && only[0] === 'pair'
// dist/ty frame each figure whole: the brute is scaled 2.15, the engine is a 1.35-long machine with its crew,
// the hierophant is 1.32 with a staff and a tall hood
const UNITS = [
  { key: 'scaleguard', label: 'Scaleguard', dist: 2.3, ty: 0.52 },
  { key: 'spitter', label: 'Venom<br>Spitters', dist: 2.4, ty: 0.55 },
  { key: 'sidewinder', label: 'Sidewinder<br>Stalkers', dist: 2.7, ty: 0.36 },
  { key: 'brute', label: 'Constrictor<br>Brute', dist: 4.7, ty: 1.0 },
  { key: 'engine', label: 'Basilisk<br>Venom Engine', dist: 4.5, ty: 0.55 },
  { key: 'hierophant', label: 'Hierophant<br>Ssithra', dist: 3.1, ty: 0.78 },
].filter((u) => !pairOnly && (!only.length || only.includes(u.key)))
// the game-scale columns draw the figure's level of detail for that size (serpents.js `detail`)
const COLS = [
  { label: 'smooth + gloss<br>close-up', size: 300, zoom: 1, q: 'detail=1' },
  { label: 'game today<br>close-up', size: 300, zoom: 1, q: 'mesh=1' },
  { label: 'smooth + gloss<br>figure ~60 px', size: 86, zoom: 2.5, q: 'detail=0.5' },
  { label: 'game today<br>~60 px', size: 86, zoom: 2.5, q: 'mesh=1' },
  { label: 'smooth + gloss<br>~28 px (classic table)', size: 40, zoom: 3, q: 'detail=0.3' },
  { label: 'game today<br>~28 px', size: 40, zoom: 3, q: 'mesh=1' },
]

const server = await createServer({ root: PKG, configFile: join(PKG, 'vite.config.js'), logLevel: 'warn', server: { host: '127.0.0.1', port: 0 }, optimizeDeps: { include: ['three'] } })
await server.listen()
const origin = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
// one shot; `read` also returns the canvas's pixels (RGBA, device pixels)
async function shoot(path, size, file, { read = false, h = size } = {}) {
  const page = await browser.newPage({ viewport: { width: size + 20, height: h + 20 }, deviceScaleFactor: 1 })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(`${origin}${path}${path.includes('?') ? '&' : '?'}w=${size}&h=${h}`)
  const info = await page.waitForFunction(() => window.done, null, { timeout: 300000 }).then((x) => x.jsonValue()).catch(() => (errs.push('timeout'), null))
  if (file) await page.locator('canvas').screenshot({ path: join(OUT, file), timeout: 120000 })
  const px = read ? await page.evaluate(() => {
    const c = document.querySelector('canvas'), k = document.createElement('canvas')
    k.width = c.width, k.height = c.height
    const g = k.getContext('2d')
    g.drawImage(c, 0, 0)
    return { w: k.width, h: k.height, data: Array.from(g.getImageData(0, 0, k.width, k.height).data) }
  }) : null
  await page.close()
  return { info, errs, px }
}
const viewer = (u, q) => `/proto/scales/viewer.html?unit=${u.key}&dist=${u.dist}&ty=${u.ty}&${q}`

// ── the measures ───────────────────────────────────────────────────────────
const nearWhite = ({ w, h, data }) => {
  let n = 0
  for (let i = 0; i < w * h; i++) if (Math.min(data[4 * i], data[4 * i + 1], data[4 * i + 2]) >= 170) n++
  return n
}
// a 2× drawing averaged back down (linear in the sRGB values, as a browser would downsample)
function half({ w, h, data }) {
  const W = w / 2, H = h / 2, out = new Array(W * H * 4)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 4; c++) {
    const at = (dx, dy) => data[((2 * y + dy) * w + 2 * x + dx) * 4 + c]
    out[(y * W + x) * 4 + c] = (at(0, 0) + at(1, 0) + at(0, 1) + at(1, 1)) / 4
  }
  return { w: W, h: H, data: out }
}
const lum = ({ data }, i) => 0.2126 * data[4 * i] + 0.7152 * data[4 * i + 1] + 0.0722 * data[4 * i + 2]
function coilNoise(img, mask) {
  const { w, h } = img
  const inside = (x, y) => x > 0 && y > 0 && x < w - 1 && y < h - 1 && mask.data[4 * (y * w + x)] > 128
  let sum = 0, n = 0
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    // (shrunk by a pixel: the silhouette's own edge isn't the coil's noise)
    if (!(inside(x, y) && inside(x - 1, y) && inside(x + 1, y) && inside(x, y - 1) && inside(x, y + 1))) continue
    const i = y * w + x
    sum += Math.abs(4 * lum(img, i) - lum(img, i - 1) - lum(img, i + 1) - lum(img, i - w) - lum(img, i + w))
    n++
  }
  return { noise: n ? sum / n : 0, px: n }
}

const rows = [], metrics = {}
try {
  for (const u of UNITS) {
    const cells = []
    for (const [ci, col] of COLS.entries()) {
      const file = `units-${u.key}-${ci}.png`
      const { info, errs, px } = await shoot(viewer(u, col.q), col.size, file, { read: ci >= 4 })
      cells.push({ file, info, col, px })
      console.log(u.key, '|', col.label.replace(/<br>/g, ' '), JSON.stringify(info), errs.join(' | '))
    }
    // the 28 px measures
    const g28 = cells[4].px, t28 = cells[5].px
    const m = { white: nearWhite(g28), whiteToday: nearWhite(t28) }
    m.dpr2 = nearWhite(half((await shoot(viewer(u, 'detail=0.3&dpr=2'), 40, null, { read: true })).px))
    if (u.key !== 'engine') {
      const mask = (await shoot(viewer(u, 'detail=0.3&mask=coil&base=1'), 40, `mask-${u.key}.png`, { read: true })).px
      const a = coilNoise(g28, mask), b = coilNoise(t28, mask)
      Object.assign(m, { noise: +a.noise.toFixed(2), noiseToday: +b.noise.toFixed(2), noiseRatio: +(a.noise / b.noise).toFixed(2), coilPx: a.px })
    }
    m.triangles = Object.fromEntries([[1, cells[0]], [0.5, cells[2]], [0.3, cells[4]]].map(([d, c]) => [d, c.info?.triangles]))
    m.trianglesToday = cells[1].info?.triangles
    m.ms = Object.fromEntries([[1, cells[0]], [0.5, cells[2]], [0.3, cells[4]]].map(([d, c]) => [d, c.info?.ms]))
    metrics[u.key] = m
    console.log(u.key, 'measures', JSON.stringify(m))
    for (const c of cells) delete c.px
    rows.push({ u, cells, m })
  }
  if (rows.length) {
    const note = (m, ci) => ci === 4 ? `<div class="m">white ${m.white} (dpr2 ${m.dpr2})${m.noise !== undefined ? `<br>coil noise ${m.noise} = ×${m.noiseRatio}` : ''}</div>`
      : ci === 5 ? `<div class="m">white ${m.whiteToday}${m.noise !== undefined ? `<br>coil noise ${m.noiseToday}` : ''}</div>` : ''
    const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:#1c1f17;color:#e8e2d0;font:13px system-ui,sans-serif}
table{border-collapse:collapse}td,th{padding:6px 8px;vertical-align:middle;text-align:center}th{font-weight:600}
img{image-rendering:pixelated;display:block;margin:auto}.n{color:#a9b08f;font-size:11px}.m{color:#c9c09a;font-size:10px;line-height:1.3}
</style><table><tr><th></th>${COLS.map((c) => `<th>${c.label}${c.zoom > 1 ? `<br><span class="n">shown ×${c.zoom}</span>` : ''}</th>`).join('')}</tr>
${rows.map(({ u, cells, m }) => `<tr><th>${u.label}</th>${cells.map((x, ci) => `<td><img src="${x.file}" width="${Math.round(x.col.size * x.col.zoom)}"><div class="n">${x.info ? `${x.info.triangles.toLocaleString()} tris` : '?'}</div>${note(m, ci)}</td>`).join('')}</tr>`).join('\n')}
</table>`
    const name = only.length ? `units-${only.join('-')}` : 'units'
    writeFileSync(join(OUT, `${name}.html`), html)
    writeFileSync(join(OUT, only.length ? `metrics-${only.join('-')}.json` : 'metrics.json'), JSON.stringify(metrics, null, 1))
    const sheet = await browser.newPage({ viewport: { width: 1500, height: 900 } })
    await sheet.goto(`file://${join(OUT, `${name}.html`)}`)
    await sheet.screenshot({ path: join(OUT, `${name}.png`), fullPage: true })
    await sheet.screenshot({ path: join(OUT, `${name}.jpg`), fullPage: true, type: 'jpeg', quality: 82 })
    await sheet.close()
    console.log(`sheet: ${join(OUT, `${name}.png`)}`)
  }
  // the close-ups: from the table's camera, and from behind
  for (const u of UNITS) {
    for (const [tag, az] of [['close', 25], ['back', 200]]) {
      const { info, errs } = await shoot(`/proto/scales/viewer.html?unit=${u.key}&dist=${(u.dist * 0.92).toFixed(2)}&ty=${u.ty}&el=44&az=${az}`, 600, `${tag}-${u.key}.png`)
      console.log(`${tag}-${u.key}`, JSON.stringify(info), errs.join(' | '))
    }
  }
  // the two armies on one table: close, and at game scale
  if (pairOnly || !only.length) {
    for (const [file, q, w, h] of [['pair.png', '', 1280, 760], ['pair-small.png', 'game=1', 560, 340]]) {
      const { info, errs } = await shoot(`/proto/scales/pair.html?${q}`, w, file, { h })
      console.log(file, JSON.stringify(info), errs.join(' | '))
    }
  }
} finally {
  await browser.close()
  await server.close()
}
