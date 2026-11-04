// --check and --preview for the geology bake: read geology/ back, image by
// image, against the manifest and the contract (DATA.md "Geology"), and draw
// each stage as shaded relief beside today's so a person can judge it.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { writePNG } from './png.mjs'
import { decodeHeights, geologyDir } from './geology-bake.mjs'
import { SEAFLOOR_BBOX, SEAFLOOR_LONG_SIDE } from './geology-sources.mjs'

export const GEOLOGY_BUDGET = 12e6
const CONFIDENCE = new Set(['firm', 'soft', 'sketch'])

function* walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) yield* walk(f)
    else yield f
  }
}

// Points the seafloor pack must get right: [lon, lat, min metres, max metres, what]
const SPOTS = [
  [-155.468, 19.821, 3900, 4210, 'Mauna Kea'],
  [-155.603, 19.475, 3900, 4175, 'Mauna Loa'],
  [-156.253, 20.71, 2700, 3060, 'Haleakalā'],
  [-159.5, 22.06, 1000, 1600, 'Kauaʻi, Kawaikini'],
  [-155.27, 18.92, -1400, -900, 'Kamaʻehuakanaloa'],
]

export function checkGeology({ data, log }) {
  const gdir = geologyDir(data)
  let failures = 0
  const bad = (what, msg) => {
    failures++
    log(`  FAIL ${what}: ${msg}`)
  }
  const ok = (c, what, msg) => {
    if (!c) bad(what, msg)
    return c
  }
  const mf = join(gdir, 'manifest.json')
  if (!existsSync(mf)) {
    log('  FAIL geology/manifest.json is missing')
    return false
  }
  const m = JSON.parse(readFileSync(mf, 'utf8'))
  log('geology:')
  const sf = m.seafloor
  if (!ok(sf && typeof sf === 'object', 'seafloor', 'missing')) return false
  // shape
  ok(Array.isArray(sf.bounds) && sf.bounds.length === 4, 'seafloor.bounds', 'not [w, s, e, n]')
  const [w, s, e, n] = sf.bounds
  const [bw, bs, be, bn] = SEAFLOOR_BBOX
  ok(w <= bw + 0.01 && s <= bs + 0.01 && e >= be - 0.01 && n >= bn - 0.01, 'seafloor.bounds', `${sf.bounds} does not hold ${SEAFLOOR_BBOX}`)
  const [W, H] = sf.size
  ok(Math.max(W, H) <= SEAFLOOR_LONG_SIDE, 'seafloor.size', `${W}x${H} over ${SEAFLOOR_LONG_SIDE} on the long side`)
  ok(sf.height?.scale === 0.25 && sf.height?.offset === -6000, 'seafloor.height', 'scale 0.25, offset −6000 per the contract')
  ok(Math.abs(sf.metresPerTexel[0] - sf.metresPerTexel[1]) < 1, 'seafloor.metresPerTexel', 'texels not square')
  for (const src of sf.sources || []) for (const k of ['id', 'title', 'url', 'fetched', 'licence']) ok(src[k], `seafloor.sources ${src.id}`, `no ${k}`)
  ok((sf.sources || []).some((x) => x.id === 'gmrt' && /Ryan/.test(x.attribution || '')), 'seafloor.sources', 'GMRT without its attribution')
  // images
  const texKm2 = (sf.metresPerTexel[0] * sf.metresPerTexel[1]) / 1e6
  const read = (what, h) => {
    const f = join(gdir, h.file)
    if (!ok(existsSync(f), what, `${h.file} is missing`)) return null
    let d
    try {
      d = decodeHeights(f, h.scale, h.offset)
    } catch (err) {
      bad(what, err.message)
      return null
    }
    ok(d.width === W && d.height === H, what, `${d.width}x${d.height}, not the seafloor grid ${W}x${H}`)
    let blue = 0
    let between = 0
    let nLand = 0
    let min = Infinity
    let max = -Infinity
    let edge = 0
    for (let o = 0; o < d.metres.length; o++) {
      if (d.png.data[o * 3 + 2] !== 0) blue++
      const v = d.metres[o]
      if (v > -1 && v < 0.2) between++
      if (v > 0) {
        nLand++
        const i = o % W
        const j = (o - i) / W
        if (i === 0 || j === 0 || i === W - 1 || j === H - 1) edge++
      }
      if (v < min) min = v
      if (v > max) max = v
    }
    ok(blue === 0, what, `${blue} texels with B ≠ 0`)
    ok(between === 0, what, `${between} texels between −1 m and 0.2 m (sea must be ≤ −1 m, land ≥ 0.2 m)`)
    ok(edge === 0, what, `${edge} land texels on the edge of the box`)
    return { d, nLand, min, max }
  }
  const sr = read('seafloor', sf.height)
  if (sr) {
    ok(sr.min === sf.stats.minMetres && sr.max === sf.stats.maxMetres, 'seafloor.stats', `min/max ${sr.min}/${sr.max} vs ${sf.stats.minMetres}/${sf.stats.maxMetres}`)
    ok(Math.abs(sr.nLand * texKm2 - sf.stats.landKm2) <= 1, 'seafloor.stats', `land ${Math.round(sr.nLand * texKm2)} km² vs ${sf.stats.landKm2}`)
    ok(sr.min > -6000 && sr.min < -5000, 'seafloor', `deepest ${sr.min} m (the Hawaiian Deep is about −5,500 m)`)
    const at = (lon, lat) => {
      const i = Math.floor(((lon - w) / (e - w)) * W)
      const j = Math.floor(((n - lat) / (n - s)) * H)
      let best = -Infinity
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) best = Math.max(best, sr.d.metres[(j + dj) * W + i + di])
      return best
    }
    for (const [lon, lat, lo, hi, what] of SPOTS) {
      const v = at(lon, lat)
      ok(v >= lo && v <= hi, `seafloor at ${what}`, `${v} m, expected ${lo}..${hi}`)
    }
    log(`  seafloor   ${W}x${H} at ${sf.metresPerTexel[0]} m, land ${Math.round(sr.nLand * texKm2)} km², ${sr.min} .. ${sr.max} m`)
  }
  // the drift
  const hs = m.hotspot
  if (ok(hs, 'hotspot', 'missing')) {
    const [lon, lat] = hs.position || []
    ok(lon > w && lon < e && lat > s && lat < n, 'hotspot.position', 'outside the box')
    ok(hs.speed > 5 && hs.speed < 15, 'hotspot.speed', `${hs.speed} cm a year`)
    ok(hs.azimuth > 270 && hs.azimuth < 330, 'hotspot.azimuth', `${hs.azimuth}°`)
    ok(hs.speedSources?.length || !!hs.note, 'hotspot.speedSources', 'none')
    ok(typeof hs.displacement?.formula === 'string', 'hotspot.displacement.formula', 'missing')
  }
  // the stages
  const stages = m.stages || []
  ok(stages.length >= 2, 'stages', `${stages.length} stages`)
  let prev = Infinity
  const ids = new Set()
  for (const st of stages) {
    const what = `stage ${st.id}`
    ok(st.id && !ids.has(st.id), what, 'id missing or repeated')
    ids.add(st.id)
    ok(typeof st.age === 'number' && st.age >= 0 && st.age < prev, what, `age ${st.age} not below the stage before (${prev})`)
    prev = st.age
    ok(typeof st.agePrecision === 'number' && st.agePrecision >= 0, what, 'agePrecision')
    ok(st.age === 0 ? ['survey', 'modelled'].includes(st.method) : st.method === 'modelled', what, `method ${st.method}`)
    ok(typeof st.rule === 'string' && st.rule.length > 40, what, 'no rule written out')
    ok(CONFIDENCE.has(st.confidence), what, `confidence ${st.confidence}`)
    ok(Array.isArray(st.sources) && st.sources.length, what, 'no sources')
    ok(st.stats && Array.isArray(st.stats.islands), what, 'no stats.islands')
    const r = read(what, st.height || {})
    if (!r || !st.stats) continue
    ok(r.min === st.stats.minMetres && r.max === st.stats.maxMetres, `${what} stats`, `min/max ${r.min}/${r.max} vs ${st.stats.minMetres}/${st.stats.maxMetres}`)
    ok(Math.abs(r.nLand * texKm2 - st.stats.landKm2) <= 1, `${what} stats`, `land ${Math.round(r.nLand * texKm2)} km² vs ${st.stats.landKm2}`)
    const isl = st.stats.islands.slice(0, 4).map((i) => `${i.name} ${i.landKm2} km² ${i.highest.metres} m`).join('; ')
    log(`  ${st.id.padEnd(20)} ${String(st.age).padStart(5)} Ma  land ${String(st.stats.landKm2).padStart(6)} km²  ${isl}`)
  }
  // what the stages show against what they are named for: notes, not failures (the model is the research's inputs run through the rule)
  const note = (c, what, msg) => {
    if (!c) log(`  note ${what}: ${msg}`)
  }
  const by = Object.fromEntries(stages.map((x) => [x.id, x]))
  const names = (id) => (by[id]?.stats?.islands || []).map((i) => i.name)
  if (by['kauai-alone']) note(by['kauai-alone'].stats.islands.every((i) => /Kauaʻi|Niʻihau/.test(i.name)), 'stage kauai-alone', `islands ${names('kauai-alone')}`)
  if (by['waianae']) note(names('waianae').includes('Oʻahu') && !by['waianae'].stats.islands.some((i) => i.volcanoes.includes('koolau')), 'stage waianae', `islands ${names('waianae')}`)
  if (by['koolau-whole'] && by['koolau-after-nuuanu']) {
    const a = by['koolau-whole'].stats.islands.find((i) => i.volcanoes.includes('koolau'))
    const b = by['koolau-after-nuuanu'].stats.islands.find((i) => i.volcanoes.includes('koolau'))
    note(a && b && a.landKm2 > b.landKm2, 'stages koolau-whole, koolau-after-nuuanu', `Oʻahu ${a?.landKm2} km² whole, ${b?.landKm2} km² after`)
  }
  if (by['maui-nui']) {
    const mn = by['maui-nui'].stats.islands.find((i) => i.name.startsWith('Maui Nui'))
    note(mn && ['west-molokai', 'east-molokai', 'lanai', 'west-maui', 'penguin-bank'].every((v) => mn.volcanoes.includes(v)), 'stage maui-nui', `no one island holds Molokaʻi, Lānaʻi, West Maui and Penguin Bank (${names('maui-nui')})`)
  }
  if (by['maui-nui-parting'] && by['maui-nui']) {
    const n0 = by['maui-nui'].stats.islands.filter((i) => i.volcanoes.some((v) => /molokai|lanai|maui|kahoolawe|haleakala/.test(v))).length
    const n1 = by['maui-nui-parting'].stats.islands.filter((i) => i.volcanoes.some((v) => /molokai|lanai|maui|kahoolawe|haleakala/.test(v))).length
    note(n1 > n0, 'stage maui-nui-parting', `${n1} islands in Maui Nui's place, ${n0} at maui-nui`)
  }
  const pres = stages.find((x) => x.age === 0)
  if (pres) ok(pres.height?.file === sf.height.file || pres.stats.landKm2 === sf.stats.landKm2, 'stage present', 'is not today')
  // budget
  let bytes = 0
  log('  files:')
  for (const f of [...walk(gdir)].sort()) {
    const b = statSync(f).size
    bytes += b
    log(`    ${(b / 1e6).toFixed(2).padStart(6)} MB  ${relative(gdir, f)}`)
  }
  log(`    ${(bytes / 1e6).toFixed(2).padStart(6)} MB  total`)
  ok(bytes < GEOLOGY_BUDGET, 'geology/', `${(bytes / 1e6).toFixed(2)} MB, over the ${GEOLOGY_BUDGET / 1e6} MB budget`)
  log(failures ? `${failures} geology check(s) failed` : 'geology checks passed')
  return failures === 0
}

// ---------------------------------------------------------------------------
// Preview

function colour(z) {
  // sea: deep navy to pale blue by depth; land: green to brown to grey by height
  const lerp = (a, b, t) => a.map((x, k) => x + (b[k] - x) * t)
  if (z <= 0) {
    const t = Math.min(1, -z / 5500)
    return t < 0.05 ? lerp([150, 200, 225], [90, 150, 200], t / 0.05) : lerp([90, 150, 200], [20, 30, 70], (t - 0.05) / 0.95)
  }
  const stops = [[0, [70, 130, 70]], [600, [130, 160, 80]], [1500, [170, 140, 90]], [3000, [140, 110, 90]], [4300, [235, 235, 235]]]
  for (let k = 1; k < stops.length; k++) {
    if (z <= stops[k][0]) return lerp(stops[k - 1][1], stops[k][1], (z - stops[k - 1][0]) / (stops[k][0] - stops[k - 1][0]))
  }
  return stops[stops.length - 1][1]
}

function shade(metres, W, H, mpt, box, step) {
  const [i0, j0, i1, j1] = box
  const w = Math.floor((i1 - i0) / step)
  const h = Math.floor((j1 - j0) / step)
  const out = new Uint8Array(w * h * 3)
  const ex = 6 // vertical exaggeration for the shading
  const L = [-0.6, -0.6, 0.53] // light from the north-west
  const ln = Math.hypot(...L)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = i0 + x * step
    const j = j0 + y * step
    const o = j * W + i
    const z = metres[o]
    const zx = (metres[j * W + Math.min(W - 1, i + step)] - metres[j * W + Math.max(0, i - step)]) / (2 * step * mpt)
    const zy = (metres[Math.min(H - 1, j + step) * W + i] - metres[Math.max(0, j - step) * W + i]) / (2 * step * mpt)
    const nx = -zx * ex
    const ny = -zy * ex
    const nn = Math.hypot(nx, ny, 1)
    const lam = Math.max(0, (nx * L[0] + ny * -L[1] * -1 + L[2]) / (nn * ln))
    const c = colour(z)
    const k = 0.35 + 0.85 * lam
    const p = (y * w + x) * 3
    // the coastline drawn dark
    const coast = z > 0 && (metres[o - 1] <= 0 || metres[o + 1] <= 0 || metres[o - W] <= 0 || metres[o + W] <= 0)
    for (let q = 0; q < 3; q++) out[p + q] = coast ? 20 : Math.max(0, Math.min(255, Math.round(c[q] * k)))
  }
  return { w, h, rgb: out }
}

function sideBySide(panels, gap = 8) {
  const h = Math.max(...panels.map((p) => p.h))
  const w = panels.reduce((s, p) => s + p.w, 0) + gap * (panels.length - 1)
  const rgb = new Uint8Array(w * h * 3).fill(255)
  let x0 = 0
  for (const p of panels) {
    for (let y = 0; y < p.h; y++) rgb.set(p.rgb.subarray(y * p.w * 3, (y + 1) * p.w * 3), (y * w + x0) * 3)
    x0 += p.w + gap
  }
  return { w, h, rgb }
}

function grid2(panels, cols, gap = 8) {
  const rows = []
  for (let k = 0; k < panels.length; k += cols) rows.push(sideBySide(panels.slice(k, k + cols), gap))
  const w = Math.max(...rows.map((r) => r.w))
  const h = rows.reduce((s, r) => s + r.h, 0) + gap * (rows.length - 1)
  const rgb = new Uint8Array(w * h * 3).fill(255)
  let y0 = 0
  for (const r of rows) {
    for (let y = 0; y < r.h; y++) rgb.set(r.rgb.subarray(y * r.w * 3, (y + 1) * r.w * 3), ((y0 + y) * w) * 3)
    y0 += r.h + gap
  }
  return { w, h, rgb }
}

export function previewGeology({ data, out, log }) {
  const gdir = geologyDir(data)
  const m = JSON.parse(readFileSync(join(gdir, 'manifest.json'), 'utf8'))
  const sf = m.seafloor
  const [W, H] = sf.size
  const mpt = sf.metresPerTexel[0]
  const [w, s, e, n] = sf.bounds
  const boxOf = ([bw, bs, be, bn]) => [Math.floor(((bw - w) / (e - w)) * W), Math.floor(((n - bn) / (n - s)) * H), Math.ceil(((be - w) / (e - w)) * W), Math.ceil(((n - bs) / (n - s)) * H)]
  const CROPS = {
    whole: { box: [1, 1, W - 1, H - 1], step: 2 },
    oahu: { box: boxOf([-158.9, 20.9, -157.2, 22.0]), step: 1 },
    'maui-nui': { box: boxOf([-157.8, 20.3, -155.8, 21.4]), step: 1 },
    'nuuanu-field': { box: boxOf([-158.6, 20.9, -155.6, 23.4]), step: 1 },
  }
  mkdirSync(out, { recursive: true })
  const today = decodeHeights(join(gdir, sf.height.file), sf.height.scale, sf.height.offset).metres
  const contact = []
  for (const st of m.stages) {
    const z = decodeHeights(join(gdir, st.height.file), st.height.scale, st.height.offset).metres
    for (const [name, c] of Object.entries(CROPS)) {
      const a = shade(z, W, H, mpt, c.box, c.step)
      const b = shade(today, W, H, mpt, c.box, c.step)
      const p = sideBySide([a, b])
      writePNG(join(out, `${st.id}-${name}.png`), p.w, p.h, p.rgb)
    }
    contact.push(shade(z, W, H, mpt, CROPS.whole.box, 4))
    log(`  ${st.id}: ${Object.keys(CROPS).map((k) => `${st.id}-${k}.png`).join(', ')} (the stage left, today right)`)
  }
  const sheet = grid2(contact, 4)
  writePNG(join(out, 'stages.png'), sheet.w, sheet.h, sheet.rgb)
  log(`  stages.png: every stage, oldest first, four to a row; written to ${out}`)
}
