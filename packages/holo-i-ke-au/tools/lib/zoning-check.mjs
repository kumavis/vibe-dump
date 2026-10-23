// Reading the zoning rasters back (bake-zoning.mjs --check) and drawing them
// for the eye (--preview). Both read only public/data/.
//
// The check holds each raster to the contract: greyscale, its pack's exact
// grid or the size it states, every value in the vocabulary, nothing over
// sea, its stats equal to what the image holds, and a mapping and sources
// behind it. Then it looks in the places whose zoning anyone who knows the
// islands could name, and prints what it finds there.
import { existsSync, readdirSync, readFileSync, statSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { readPNG, writePNG } from './png.mjs'
import { gridFromBounds } from './geo.mjs'
import { CLASSES, LUD, N_CLASSES, N_LUD } from './zoning-classes.mjs'
import { classShares } from './zoning-raster.mjs'

const MAX_LAYERS_BYTES = 8 * 1024 * 1024 // the era layers' budget, which these rasters share
const MAX_ZONING_BYTES = 1024 * 1024

/**
 * Places to look: [pack, name, lon, lat, radius in metres, zoning classes
 * expected to be commonest there, and optionally the State district expected].
 */
export const SANITY = [
  ['oahu', 'Waikīkī', -157.8265, 21.278, 450, [7, 3]],
  ['oahu', 'downtown Honolulu', -157.862, 21.3095, 300, [5, 4], [1]],
  ['oahu', 'Kalihi Kai', -157.879, 21.322, 400, [6]],
  ['oahu', 'Sand Island', -157.882, 21.308, 300, [6]],
  ['oahu', 'Mililani', -158.015, 21.45, 800, [1], [1]],
  ['oahu', 'Kāneʻohe', -157.8, 21.405, 600, [1]],
  ['oahu', 'Koʻolau crest (Kōnāhuanui–Pali)', -157.79, 21.363, 600, [9], [4]],
  // Lahaina's core is the county's historic districts, read as a town core
  // of shops along Front Street (mixed-use downtown); its hotels are resort
  ['maui', 'Lahaina', -156.677, 20.873, 400, [5, 7]],
  ['maui', 'Kāʻanapali', -156.694, 20.922, 400, [7]],
  ['maui', 'Kahului', -156.47, 20.888, 700, [4, 6], [1]],
  ['maui', 'Haleakalā summit', -156.254, 20.71, 1500, [9], [4]],
  ['lanai', 'Lānaʻi City', -156.922, 20.827, 400, [1]],
  ['molokai', 'Kaunakakai', -157.021, 21.089, 300, [4, 5]],
  ['hawaii', 'Kailua-Kona', -155.994, 19.641, 400, [4, 5]],
  ['hawaii', 'Hilo', -155.088, 19.7225, 400, [5, 4], [1]],
  ['kauai', 'Līhuʻe', -159.37, 21.976, 400, [4, 5]],
  ['kauai', 'Waiʻaleʻale', -159.498, 22.07, 1500, [9], [4]],
]

export function packLand(data, pack) {
  const [W, H] = pack.size
  const h = readPNG(join(data, pack.height.file))
  const land = new Uint8Array(W * H)
  const metres = new Float32Array(W * H)
  for (let o = 0; o < W * H; o++) {
    metres[o] = (h.data[o * 3] * 256 + h.data[o * 3 + 1]) * pack.height.scale + pack.height.offset
    land[o] = metres[o] > 0 ? 1 : 0
  }
  return { W, H, land, metres }
}

/** Classes within `radius` metres of (lon, lat) on a pack grid, over land: [[class, share]] commonest first, 0 last. */
export function disc(raster, pack, land, lon, lat, radius) {
  const [W, H] = pack.size
  const g = gridFromBounds(pack.bounds, W, H)
  const [mx, mz] = g.metresPerTexel
  const ci = (lon - pack.bounds[0]) / g.dLon
  const cj = (pack.bounds[3] - lat) / g.dLat
  const count = new Map()
  let n = 0
  for (let j = Math.floor(cj - radius / mz) - 1; j <= Math.ceil(cj + radius / mz) + 1; j++) {
    for (let i = Math.floor(ci - radius / mx) - 1; i <= Math.ceil(ci + radius / mx) + 1; i++) {
      if (i < 0 || j < 0 || i >= W || j >= H) continue
      if (Math.hypot((i + 0.5 - ci) * mx, (j + 0.5 - cj) * mz) > radius) continue
      const o = j * W + i
      if (!land[o]) continue
      n++
      count.set(raster[o], (count.get(raster[o]) || 0) + 1)
    }
  }
  const list = [...count.entries()].map(([c, k]) => [c, k / n]).sort((a, b) => (a[0] === 0) - (b[0] === 0) || b[1] - a[1])
  return { n, list }
}

export function check({ data, log }) {
  let failures = 0
  const fail = (m) => {
    failures++
    log(`  FAIL ${m}`)
  }
  const manifest = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const lm = JSON.parse(readFileSync(join(data, 'layers', 'manifest.json'), 'utf8'))
  const Z = lm.zoning
  if (!Z) {
    fail('layers/manifest.json has no zoning entry (run --bake)')
    return false
  }
  // provenance
  for (const [k, s] of Object.entries(Z.sources || {})) {
    for (const f of ['id', 'title', 'url', 'layer', 'licence', 'fetched', 'classField']) if (!s[f]) fail(`source ${k}: no ${f}`)
    if (!s.fields?.length) fail(`source ${k}: no fields listed`)
    if (s.fetched && !/^\d{4}-\d{2}-\d{2}$/.test(s.fetched)) fail(`source ${k}: fetched "${s.fetched}"`)
  }
  const sourceIds = new Set(Object.values(Z.sources || {}).map((s) => s.id))
  for (const [county, m] of Object.entries(Z.mapping || {})) {
    if (!sourceIds.has(m.layer)) fail(`mapping ${county}: layer ${m.layer} is not among the sources`)
    for (const [c, list] of Object.entries(m.classes || {})) {
      const max = county === 'slud' ? N_LUD : N_CLASSES
      if (!(Number(c) >= 0 && Number(c) <= max)) fail(`mapping ${county}: class ${c} outside 0..${max}`)
      for (const e of list) if (typeof e !== 'string' || !/: \d+(?:\.\d+)? km²$/.test(e)) fail(`mapping ${county} class ${c}: entry ${JSON.stringify(e)} is not "code (name): N km²"`)
    }
  }
  if (JSON.stringify(Object.keys(Z.encoding?.zoning?.classes || {})) !== JSON.stringify(CLASSES.map((c) => String(c.n)))) fail('encoding.zoning.classes is not the twelve classes and 0')
  if (JSON.stringify(Object.keys(Z.encoding?.lud?.classes || {})) !== JSON.stringify(LUD.map((c) => String(c.n)))) fail('encoding.lud.classes is not the four districts and 0')

  const rasters = {}
  log('island      zoning: classed  commonest classes                                   LUD: urban  rural  agric  conserv')
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = Z.islands?.[pack.id]
    if (!e) {
      fail(`no zoning entry for ${pack.id}`)
      continue
    }
    if (JSON.stringify(e.bounds) !== JSON.stringify(pack.bounds) || JSON.stringify(e.size) !== JSON.stringify(pack.size)) fail(`${pack.id}: bounds or size differ from the pack`)
    const { W, H, land } = packLand(data, pack)
    rasters[pack.id] = { land }
    const read = (layer, max, n) => {
      const L = e[layer]
      const size = L.size || pack.size
      if (size[0] !== W && size[0] !== Math.ceil(W / 2)) fail(`${L.file}: stated size ${size} is neither the pack's nor half of it`)
      let img
      try {
        img = readPNG(join(data, 'layers', L.file))
      } catch (err) {
        fail(`${L.file}: ${err.message}`)
        return null
      }
      if (img.channels !== 1) fail(`${L.file}: not greyscale`)
      if (img.width !== size[0] || img.height !== size[1]) fail(`${L.file}: ${img.width}x${img.height}, stated ${size.join('x')}`)
      if (img.width !== W || img.height !== H) {
        fail(`${L.file}: not on the pack grid (this bake writes full-size rasters)`)
        return null
      }
      let onSea = 0
      let outside = 0
      for (let o = 0; o < W * H; o++) {
        if (img.data[o] > max) outside++
        if (!land[o] && img.data[o]) onSea++
      }
      if (outside) fail(`${L.file}: ${outside} texels outside 0..${max}`)
      if (onSea) fail(`${L.file}: ${onSea} texels with a class over sea`)
      const st = classShares(img.data, land, n)
      if (JSON.stringify(st) !== JSON.stringify(L.stats)) fail(`${L.file}: stats differ from what the image holds`)
      if (!L.source || !sourceIds.has(L.source)) fail(`${L.file}: source ${L.source} is not among the sources`)
      if (!L.fetched) fail(`${L.file}: no fetched date`)
      return { data: img.data, stats: st }
    }
    let zCells = 'no county zoning'.padEnd(66)
    if (e.zoning) {
      const z = read('zoning', N_CLASSES, N_CLASSES)
      if (z) {
        rasters[pack.id].zoning = z.data
        const m = Z.mapping?.[e.zoning.mapping]
        if (!m) fail(`${pack.id}: mapping ${e.zoning.mapping} missing`)
        else for (const c of Object.keys(z.stats.share)) if (!m.classes[c]?.length) fail(`${pack.id}: class ${c} on the raster but nothing in mapping ${e.zoning.mapping} fed it`)
        const top = Object.entries(z.stats.share).sort((a, b) => b[1] - a[1]).slice(0, 4)
        zCells = `${(z.stats.classed * 100).toFixed(1).padStart(6)}%  ${top.map(([c, v]) => `${CLASSES[c].key} ${(v * 100).toFixed(1)}%`).join(', ').padEnd(58)}`
      }
    } else {
      if (!e.zoningNote) fail(`${pack.id}: zoning absent but no zoningNote saying why`)
      if (existsSync(join(data, 'layers', pack.id, 'now-zoning.png'))) fail(`${pack.id}: zoning is null but now-zoning.png exists`)
    }
    let lCells = ''
    if (!e.lud) fail(`${pack.id}: no lud`)
    else {
      const l = read('lud', N_LUD, N_LUD)
      if (l) {
        rasters[pack.id].lud = l.data
        lCells = [1, 2, 3, 4].map((c) => `${((l.stats.share[c] || 0) * 100).toFixed(1)}%`.padStart(7)).join('')
        if (l.stats.classed < 0.98) fail(`${e.lud.file}: only ${(l.stats.classed * 100).toFixed(1)}% of the land has a district`)
      }
    }
    log(`${pack.id.padEnd(11)} ${zCells}      ${lCells}`)
  }
  log('(shares of each pack’s land; a pack includes the slivers of neighbours in its box)')

  // sanity
  log('\nsanity: the commonest class within the radius (shares over land), against what the place is known for')
  for (const [packId, name, lon, lat, radius, want, wantLud] of SANITY) {
    const pack = manifest.packs.find((p) => p.id === packId)
    const R = rasters[packId]
    if (!R?.zoning) {
      fail(`sanity ${name}: no zoning raster for ${packId}`)
      continue
    }
    const d = disc(R.zoning, pack, R.land, lon, lat, radius)
    const top = d.list.filter(([c]) => c !== 0)[0]
    const ok = top && want.includes(top[0])
    let line = `  ${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(32)} ${d.list.slice(0, 3).map(([c, v]) => `${CLASSES[c].key} ${(v * 100).toFixed(0)}%`).join(', ').padEnd(44)} want ${want.map((c) => CLASSES[c].key).join(' or ')}`
    if (wantLud && R.lud) {
      const l = disc(R.lud, pack, R.land, lon, lat, radius).list.filter(([c]) => c !== 0)[0]
      const lok = l && wantLud.includes(l[0])
      line += `; LUD ${l ? LUD[l[0]].key : 'none'} ${lok ? 'ok' : 'FAIL'}`
      if (!lok) failures++
    }
    if (!ok) failures++
    log(line)
  }

  // budget
  let bytes = 0
  let zbytes = 0
  const walk = (d) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, f.name)
      if (f.isDirectory()) walk(p)
      else {
        const b = statSync(p).size
        bytes += b
        if (f.name === 'now-zoning.png' || f.name === 'lud.png') zbytes += b
      }
    }
  }
  walk(join(data, 'layers'))
  log(`\nzoning rasters: ${(zbytes / 1024).toFixed(0)} KB (budget ${MAX_ZONING_BYTES / 1024} KB); public/data/layers/: ${(bytes / 1048576).toFixed(2)} MB (budget ${MAX_LAYERS_BYTES / 1048576} MB)`)
  if (zbytes > MAX_ZONING_BYTES) fail(`zoning rasters are ${(zbytes / 1024).toFixed(0)} KB`)
  if (bytes > MAX_LAYERS_BYTES) fail(`public/data/layers/ is ${(bytes / 1048576).toFixed(2)} MB`)
  if (Z.stats?.bytes !== zbytes) fail(`zoning.stats.bytes ${Z.stats?.bytes}, the files hold ${zbytes}`)
  if (failures) log(`${failures} failure(s)`)
  else log('zoning check passed')
  return failures === 0
}

// ---------------------------------------------------------------------------
// --preview

/** Class colours for the preview, by number (0 unused). */
const TINT = [
  null,
  [246, 222, 120], // houses
  [244, 160, 64], // low-rise apartments
  [196, 86, 30], // high-rise apartments
  [222, 44, 52], // business
  [168, 30, 128], // mixed-use downtown
  [128, 104, 176], // industrial
  [24, 182, 206], // resort
  [188, 210, 120], // agricultural
  [36, 108, 58], // conservation
  [70, 72, 86], // military or federal
  [52, 88, 214], // public or institutional
  [92, 206, 96], // parks and open space
]
const LUD_TINT = [null, [214, 60, 60], [236, 172, 80], [188, 210, 120], [36, 108, 58]]

// A 5 × 7 bitmap font for the legend: capitals, digits and a little
// punctuation, with the ʻokina and a kahakō drawn over a vowel.
const GLYPHS = {
  A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110', C: '01110100011000010000100001000101110',
  D: '11110100011000110001100011000111110', E: '11111100001000011110100001000011111', F: '11111100001000011110100001000010000',
  G: '01110100011000010111100011000101111', H: '10001100011000111111100011000110001', I: '01110001000010000100001000010001110',
  J: '00111000100001000010000101001001100', K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111',
  M: '10001110111010110101100011000110001', N: '10001100011100110101100111000110001', O: '01110100011000110001100011000101110',
  P: '11110100011000111110100001000010000', Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001',
  S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100', U: '10001100011000110001100011000101110',
  V: '10001100011000110001100010101000100', W: '10001100011000110101101011010101010', X: '10001100010101000100010101000110001',
  Y: '10001100010101000100001000010000100', Z: '11111000010001000100010001000011111',
  0: '01110100011001110101110011000101110', 1: '00100011000010000100001000010001110', 2: '01110100010000100010001000100011111',
  3: '11111000100010000010000011000101110', 4: '00010001100101010010111110001000010', 5: '11111100001111000001000011000101110',
  6: '00110010001000011110100011000101110', 7: '11111000010001000100010000100001000', 8: '01110100011000101110100011000101110',
  9: '01110100011000101111000010001001100',
  ' ': '00000000000000000000000000000000000', '-': '00000000000000011111000000000000000', ',': '00000000000000000000001100010001000',
  '.': '00000000000000000000000000110001100', '/': '00001000100001000100010000100010000', '(': '00010001000100001000010000010000010',
  ')': '01000001000001000010000100010001000', ':': '00000011000110000000011000110000000', '%': '11000110010001000100010001001100011',
  '·': '00000000000000001100011000000000000', '&': '01100100101010001000101011001001101', 'ʻ': '00010001000011000000000000000000000',
  '–': '00000000000000011111000000000000000', '’': '00100001000100000000000000000000000', "'": '00100001000100000000000000000000000',
}

/** Draw text at (x, y) (top of the kahakō row), scale k; returns the width drawn. */
export function text(rgb, W, H, x, y, str, colour, k = 2) {
  const s = String(str).normalize('NFD').toUpperCase()
  let cx = x
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '̄') continue
    const g = GLYPHS[ch] ?? GLYPHS[' ']
    const macron = s[i + 1] === '̄'
    const put = (px, py) => {
      for (let dy = 0; dy < k; dy++) {
        for (let dx = 0; dx < k; dx++) {
          const X = cx + px * k + dx
          const Y = y + py * k + dy
          if (X >= 0 && Y >= 0 && X < W && Y < H) rgb.set(colour, (Y * W + X) * 3)
        }
      }
    }
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r * 5 + c] === '1') put(c, r + 2)
    if (macron) for (let c = 0; c < 5; c++) put(c, 0)
    cx += 6 * k
  }
  return cx - x
}

export function relief(metres, W, H, mx, mz) {
  const out = new Float32Array(W * H)
  const at = (i, j) => Math.max(0, metres[Math.max(0, Math.min(H - 1, j)) * W + Math.max(0, Math.min(W - 1, i))])
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = (-(at(x + 1, y) - at(x - 1, y)) / (2 * mx)) * 2
      const ny = (-(at(x, y + 1) - at(x, y - 1)) / (2 * mz)) * 2
      out[y * W + x] = Math.max(0, (nx * -0.5 + ny * -0.6 + 0.62) / Math.hypot(nx, ny, 1) / Math.hypot(0.5, 0.6, 0.62))
    }
  }
  return out
}

const PANEL = 470

function render(pack, P, shade, raster, tints, labels, shares, title, lines) {
  const { W, H, metres } = P
  const rowH = 26
  const LH = 16 + 2 * 22 + labels.length * rowH + 16 + lines.length * 22 + 16
  const IW = W + PANEL
  const IH = Math.max(H, LH)
  const rgb = new Uint8Array(IW * IH * 3).fill(250)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = y * W + x
      const q = (y * IW + x) * 3
      if (metres[o] <= 0) {
        rgb.set([24, 40, 64], q)
        continue
      }
      const s = 0.45 + 0.6 * shade[o]
      let c = [200 * s, 196 * s, 186 * s]
      const t = tints[raster[o]]
      if (t) c = c.map((v, i) => v * 0.22 + t[i] * (0.55 + 0.35 * s) * 0.78)
      rgb.set(c.map((v) => Math.max(0, Math.min(255, Math.round(v)))), q)
    }
  }
  let y = 16
  const x0 = W + 18
  const ink = [30, 30, 36]
  text(rgb, IW, IH, x0, y, title[0], ink)
  y += 22
  text(rgb, IW, IH, x0, y, title[1], [90, 90, 100])
  y += 30
  for (const { n, label } of labels) {
    const t = tints[n] || [200, 196, 186]
    for (let dy = 2; dy < 20; dy++) for (let dx = 0; dx < 26; dx++) rgb.set(t, ((y + dy) * IW + x0 + dx) * 3)
    const share = shares[n] ? `${(shares[n] * 100).toFixed(1)}%` : '-'
    text(rgb, IW, IH, x0 + 34, y + 1, `${String(n).padStart(2)} ${label}`, ink)
    text(rgb, IW, IH, IW - 18 - share.length * 12, y + 1, share, [90, 90, 100])
    y += rowH
  }
  y += 12
  for (const l of lines) {
    text(rgb, IW, IH, x0, y, l, [90, 90, 100])
    y += 22
  }
  return { W: IW, H: IH, rgb }
}

const SHORT = ['NONE OR WATER', 'HOUSES', 'LOW-RISE APARTMENTS', 'HIGH-RISE APARTMENTS', 'BUSINESS', 'MIXED-USE DOWNTOWN', 'INDUSTRIAL', 'RESORT', 'AGRICULTURAL', 'CONSERVATION', 'MILITARY, FEDERAL', 'PUBLIC, INSTITUTION', 'PARKS, OPEN SPACE']

export function preview({ data, out, log }) {
  mkdirSync(out, { recursive: true })
  const manifest = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const Z = JSON.parse(readFileSync(join(data, 'layers', 'manifest.json'), 'utf8')).zoning
  if (!Z) throw new Error('no zoning entry in layers/manifest.json (run --bake)')
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = Z.islands[pack.id]
    const P = packLand(data, pack)
    const shade = relief(P.metres, P.W, P.H, pack.metresPerTexel[0], pack.metresPerTexel[1])
    const nameOf = pack.name.toUpperCase()
    if (e.zoning) {
      const src = Object.values(Z.sources).find((s) => s.id === e.zoning.source)
      const r = readPNG(join(data, 'layers', e.zoning.file)).data
      const labels = CLASSES.slice(1).map((c) => ({ n: c.n, label: SHORT[c.n] }))
      labels.push({ n: 0, label: 'NO CLASS (LAND)' })
      const img = render(pack, P, shade, r, TINT, labels, { ...e.zoning.stats.share, 0: e.zoning.stats.none }, [`${nameOf} · ZONING`, `${src.publisher.toUpperCase()}`], [`FETCHED ${e.zoning.fetched}`, `SHARES OF THE PACK'S LAND`, `${pack.size.join(' X ')} TEXELS, ${pack.metresPerTexel[0].toFixed(0)} M`])
      writePNG(join(out, `${pack.id}-zoning.png`), img.W, img.H, img.rgb)
      log(join(out, `${pack.id}-zoning.png`))
    }
    const r = readPNG(join(data, 'layers', e.lud.file)).data
    const labels = LUD.slice(1).map((c) => ({ n: c.n, label: c.label.toUpperCase() }))
    labels.push({ n: 0, label: 'NONE (LAND)' })
    const img = render(pack, P, shade, r, LUD_TINT, labels, { ...e.lud.stats.share, 0: e.lud.stats.none }, [`${nameOf} · LAND USE DISTRICTS`, 'STATE LAND USE COMMISSION'], [`FETCHED ${e.lud.fetched}`, `SHARES OF THE PACK'S LAND`])
    writePNG(join(out, `${pack.id}-lud.png`), img.W, img.H, img.rgb)
    log(join(out, `${pack.id}-lud.png`))
  }
}
