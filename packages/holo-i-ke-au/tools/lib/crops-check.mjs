// Reading the crop classes back (bake-crops.mjs --check) and drawing them
// for the eye (--preview). Both read only public/data/.
//
// The check holds each raster to the contract: greyscale, its pack's exact
// grid, every value a class, nothing over sea, its stats equal to what the
// image holds, only the classes its keyframe's method names, and a cultivated
// class only where that keyframe's cultivation mask is above 0 (pasture and
// lawn anywhere, and the two classes the cultivation masks leave out where
// encoding.uncultivated says). Then the method, its sources and the era map,
// and a sanity table: the commonest class at places whose crop at the
// keyframe anyone who knows the islands could name.
import { mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { readPNG, writePNG } from './png.mjs'
import { CLASSES, N_CLASSES } from './crops-history.mjs'
import { classStats } from './crops-model.mjs'
import { disc, packLand, relief, text } from './zoning-check.mjs'

const MAX_LAYERS_BYTES = 8 * 1024 * 1024 // the era layers' budget, which these rasters share
const METHODS = new Set(['mapped', 'modelled', 'mixed'])

/** Classes a keyframe may hold where its cultivation mask is 0. */
export const UNCULTIVATED = { contact: [6, 8], mahele: [4, 6, 8], kingdom: [6, 7, 8], now: [6, 8] }

/**
 * [keyframe, pack, place, lon, lat, radius in metres, classes expected,
 * and optionally the share of the land that suffices]: without a share, an
 * expected class must be the commonest there (0 aside); with one, it must
 * cover at least that share (for crops that lay scattered, or in a patch
 * smaller than the place).
 */
export const SANITY = [
  ['contact', 'hawaii', 'Waipiʻo valley floor', -155.595, 20.115, 500, [1]],
  ['contact', 'hawaii', 'the Kohala field system', -155.83, 20.19, 1500, [2]],
  ['contact', 'maui', 'Kula', -156.33, 20.79, 1500, [2]],
  ['contact', 'oahu', 'Mānoa valley floor', -157.81, 21.31, 400, [1]],
  ['contact', 'kauai', 'Hanalei valley floor', -159.47, 22.205, 800, [1]],
  ['mahele', 'kauai', 'Kōloa', -159.465, 21.905, 1200, [4], 0.1],
  ['mahele', 'hawaii', 'the Waimea plain', -155.66, 20.02, 2000, [6], 0.05],
  ['mahele', 'oahu', 'Kualoa', -157.84, 21.515, 500, [6], 0.2],
  ['kingdom', 'kauai', 'Hanalei valley floor', -159.47, 22.205, 800, [3], 0.05],
  ['kingdom', 'oahu', 'Waikāne and Waiāhole flats', -157.855, 21.495, 600, [3], 0.1],
  ['kingdom', 'oahu', 'the ʻEwa plain', -158.03, 21.36, 1500, [4]],
  ['kingdom', 'hawaii', 'the Kona coffee belt', -155.92, 19.55, 1500, [7], 0.03],
  ['kingdom', 'hawaii', 'Olaʻa, on the Volcano Road', -155.13, 19.52, 1500, [7]],
  ['kingdom', 'hawaii', 'the Waimea plain', -155.66, 20.02, 2000, [6]],
  ['kingdom', 'niihau', 'Niʻihau', -160.15, 21.9, 3000, [6]],
  ['kingdom', 'kahoolawe', 'Kahoʻolawe', -156.61, 20.55, 3000, [6]],
  ['now', 'oahu', 'Kapiʻolani Park', -157.818, 21.268, 300, [8]],
  ['now', 'oahu', 'the pineapple northwest of Wahiawā', -158.067, 21.54, 1000, [5]],
  ['now', 'hawaii', 'the Kona coffee belt', -155.9, 19.48, 1000, [7]],
  ['now', 'hawaii', 'the Waimea pastures', -155.62, 20.02, 2000, [6]],
]

export function check({ data, log }) {
  let failures = 0
  const fail = (m) => {
    failures++
    log(`  FAIL ${m}`)
  }
  const manifest = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const lm = JSON.parse(readFileSync(join(data, 'layers', 'manifest.json'), 'utf8'))
  const K = lm.crops
  if (!K) {
    fail('layers/manifest.json has no crops entry (run --bake)')
    return false
  }
  // vocabulary, keyframes, eras
  if (JSON.stringify(Object.keys(K.encoding?.classes || {})) !== JSON.stringify(CLASSES.map((c) => String(c.n)))) fail('encoding.classes is not classes 0–8')
  const kf = lm.keyframes.map((k) => k.id)
  if (JSON.stringify(K.keyframes) !== JSON.stringify(kf)) fail(`keyframes ${K.keyframes} are not the layers' ${kf}`)
  const eras = JSON.parse(readFileSync(join(data, 'eras.json'), 'utf8'))
  for (const e of eras) if (!kf.includes(K.eras?.[e.id]?.keyframe)) fail(`era ${e.id}: no keyframe`)
  // methods and sources
  const sj = new Map(JSON.parse(readFileSync(join(data, 'sources.json'), 'utf8')).map((s) => [s.id, s]))
  for (const [id, s] of Object.entries(K.sources || {})) {
    if (s.id !== id) fail(`source ${id}: id ${s.id}`)
    for (const f of ['title', 'url', 'licence']) if (!s[f] && !(f === 'url' && s.sourcesJson && s.opened === false)) fail(`source ${id}: no ${f}`)
    if (s.sourcesJson) {
      const g = sj.get(id)
      if (!g) fail(`source ${id}: not in sources.json`)
      else if (g.title !== s.title || g.url !== s.url) fail(`source ${id}: title or url differs from sources.json`)
      else if (g.opened !== s.opened) fail(`source ${id}: opened differs from sources.json`)
    }
    const needsDate = !id.startsWith('holo-') && !(s.sourcesJson && s.opened === false)
    if (needsDate && !/^\d{4}-\d{2}-\d{2}$/.test(s.fetched || '')) fail(`source ${id}: no fetched date`)
  }
  for (const k of kf) {
    const m = K.methods?.[k]
    if (!m) {
      fail(`${k}: no method`)
      continue
    }
    if (!METHODS.has(m.method)) fail(`${k}: method "${m.method}"`)
    if (!(m.rule && m.rule.length > 80)) fail(`${k}: no rule written out`)
    if (!m.limits) fail(`${k}: no limits written out`)
    if (!m.sources?.length) fail(`${k}: no sources`)
    for (const id of m.sources || []) if (!K.sources?.[id]) fail(`${k}: source ${id} is not among the sources`)
  }
  // the rasters
  const rasters = {}
  log('island      keyframe  classed   km² by class')
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = K.islands?.[pack.id]
    if (!e) {
      fail(`no crops entry for ${pack.id}`)
      continue
    }
    if (JSON.stringify(e.bounds) !== JSON.stringify(pack.bounds) || JSON.stringify(e.size) !== JSON.stringify(pack.size)) fail(`${pack.id}: bounds or size differ from the pack`)
    const { W, H, land } = packLand(data, pack)
    const texelKm2 = (pack.metresPerTexel[0] * pack.metresPerTexel[1]) / 1e6
    rasters[pack.id] = { land }
    for (const k of kf) {
      const L = e.layers?.[k]
      if (!L) {
        if (!e.absent?.[k]) fail(`${pack.id} ${k}: missing, and no absence recorded`)
        continue
      }
      let img
      try {
        img = readPNG(join(data, 'layers', L.file))
      } catch (err) {
        fail(`${L.file}: ${err.message}`)
        continue
      }
      if (img.channels !== 1) fail(`${L.file}: not greyscale`)
      if (img.width !== W || img.height !== H) {
        fail(`${L.file}: ${img.width}x${img.height}, the pack is ${W}x${H}`)
        continue
      }
      if (L.method !== K.methods?.[k]?.method) fail(`${L.file}: method differs from methods.${k}`)
      const cultFile = lm.islands?.[pack.id]?.layers?.[k]?.cultivation?.file
      const cult = cultFile ? readPNG(join(data, 'layers', cultFile)).data : null
      if (!cult) fail(`${pack.id} ${k}: no cultivation mask to hold the classes to`)
      const allowed = new Set([0, ...(K.methods?.[k]?.classes || [])])
      const free = new Set(UNCULTIVATED[k] || [])
      let outside = 0
      let onSea = 0
      let notAllowed = 0
      let uncultivated = 0
      for (let o = 0; o < W * H; o++) {
        const c = img.data[o]
        if (c > N_CLASSES) outside++
        if (!land[o] && c) onSea++
        if (!allowed.has(c)) notAllowed++
        if (c && !free.has(c) && cult && !cult[o]) uncultivated++
      }
      if (outside) fail(`${L.file}: ${outside} texels outside 0..${N_CLASSES}`)
      if (onSea) fail(`${L.file}: ${onSea} texels with a class over sea`)
      if (notAllowed) fail(`${L.file}: ${notAllowed} texels of a class methods.${k}.classes does not list`)
      if (uncultivated) fail(`${L.file}: ${uncultivated} texels of a cultivated class where the ${k} cultivation mask is 0`)
      const st = classStats(img.data, land, texelKm2, N_CLASSES)
      if (JSON.stringify(st) !== JSON.stringify(L.stats)) fail(`${L.file}: stats differ from what the image holds`)
      rasters[pack.id][k] = img.data
      log(`${pack.id.padEnd(11)} ${k.padEnd(9)} ${((st.classedTexels / st.landTexels) * 100).toFixed(1).padStart(5)}%   ${Object.entries(st.km2).map(([c, v]) => `${CLASSES[c].key} ${v}`).join(', ') || '-'}`)
    }
  }
  log('(km² of each pack’s land; a pack includes the slivers of neighbours in its box)')

  // sanity
  log('\nsanity: the commonest class within the radius (shares of land), against what the place grew')
  for (const [k, packId, name, lon, lat, radius, want, enough] of SANITY) {
    const pack = manifest.packs.find((p) => p.id === packId)
    const r = rasters[packId]?.[k]
    if (!r) {
      fail(`sanity ${name}: no ${k} raster for ${packId}`)
      continue
    }
    const d = disc(r, pack, rasters[packId].land, lon, lat, radius)
    const top = d.list.filter(([c]) => c !== 0)[0]
    const ok = enough ? d.list.some(([c, v]) => want.includes(c) && v >= enough) : top && want.includes(top[0])
    if (!ok) failures++
    const shown = d.list.slice(0, 3)
    for (const [c, v] of d.list) if (want.includes(c) && !shown.some(([x]) => x === c)) shown.push([c, v])
    log(`  ${ok ? 'ok  ' : 'FAIL'} ${k.padEnd(8)} ${name.padEnd(34)} ${shown.map(([c, v]) => `${CLASSES[c].key} ${(v * 100).toFixed(0)}%`).join(', ').padEnd(44)} want ${want.map((c) => CLASSES[c].key).join(' or ')}${enough ? ` on ${enough * 100}% or more` : ' commonest'}`)
  }

  // budget
  let bytes = 0
  let cbytes = 0
  const walk = (d) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, f.name)
      if (f.isDirectory()) walk(p)
      else {
        const b = statSync(p).size
        bytes += b
        if (f.name.endsWith('-crop.png')) cbytes += b
      }
    }
  }
  walk(join(data, 'layers'))
  log(`\ncrop rasters: ${(cbytes / 1024).toFixed(0)} KB; public/data/layers/: ${(bytes / 1048576).toFixed(2)} MB (budget ${MAX_LAYERS_BYTES / 1048576} MB)`)
  if (bytes > MAX_LAYERS_BYTES) fail(`public/data/layers/ is ${(bytes / 1048576).toFixed(2)} MB`)
  if (K.stats?.bytes !== cbytes) fail(`crops.stats.bytes ${K.stats?.bytes}, the files hold ${cbytes}`)
  if (failures) log(`${failures} failure(s)`)
  else log('crops check passed')
  return failures === 0
}

// ---------------------------------------------------------------------------
// --preview

/** Class colours for the preview, by number (0 unused). */
export const TINT = [
  null,
  [40, 150, 120], // loʻi
  [196, 150, 70], // dryland
  [150, 214, 92], // rice
  [226, 196, 40], // cane
  [234, 120, 40], // pineapple
  [176, 132, 196], // pasture
  [150, 60, 60], // orchard
  [70, 200, 220], // lawn
]
const SHORT = ['NONE', 'LOʻI', 'DRYLAND', 'RICE', 'CANE', 'PINEAPPLE', 'PASTURE', 'ORCHARD, COFFEE', 'LAWN']

/** Per island: the four keyframes side by side at half size, over shaded relief, with a legend of km². */
export function preview({ data, out, log }) {
  mkdirSync(out, { recursive: true })
  const manifest = JSON.parse(readFileSync(join(data, 'manifest.json'), 'utf8'))
  const lm = JSON.parse(readFileSync(join(data, 'layers', 'manifest.json'), 'utf8'))
  const K = lm.crops
  if (!K) throw new Error('no crops entry in layers/manifest.json (run --bake)')
  for (const pack of manifest.packs.filter((p) => p.kind === 'island')) {
    const e = K.islands[pack.id]
    const P = packLand(data, pack)
    const { W, H, metres } = P
    const shade = relief(metres, W, H, pack.metresPerTexel[0], pack.metresPerTexel[1])
    const hw = Math.ceil(W / 2)
    const hh = Math.ceil(H / 2)
    const gap = 8
    const head = 34
    const legendH = 30 + (N_CLASSES + 1) * 24
    const IW = K.keyframes.length * (hw + gap) - gap
    const IH = head + hh + 12 + legendH
    const rgb = new Uint8Array(IW * IH * 3).fill(250)
    const ink = [30, 30, 36]
    K.keyframes.forEach((k, n) => {
      const r = readPNG(join(data, 'layers', e.layers[k].file)).data
      const x0 = n * (hw + gap)
      text(rgb, IW, IH, x0, 8, `${pack.name.toUpperCase()} ${k.toUpperCase()}`, ink)
      for (let y = 0; y < hh; y++) {
        for (let x = 0; x < hw; x++) {
          // nearest, as the app samples classes
          const o = Math.min(H - 1, 2 * y) * W + Math.min(W - 1, 2 * x)
          let c
          if (metres[o] <= 0) c = [24, 40, 64]
          else {
            const s = 0.45 + 0.6 * shade[o]
            c = [200 * s, 196 * s, 186 * s]
            const t = TINT[r[o]]
            if (t) c = c.map((v, i) => v * 0.2 + t[i] * (0.55 + 0.35 * s) * 0.8)
          }
          rgb.set(c.map((v) => Math.max(0, Math.min(255, Math.round(v)))), ((head + y) * IW + x0 + x) * 3)
        }
      }
      // legend: km² per class at this keyframe
      let y = head + hh + 12
      text(rgb, IW, IH, x0, y, 'KM2 OF LAND', [90, 90, 100])
      y += 26
      const km = e.layers[k].stats.km2
      for (let c = 1; c <= N_CLASSES; c++) {
        const t = TINT[c]
        for (let dy = 2; dy < 18; dy++) for (let dx = 0; dx < 22; dx++) rgb.set(t, ((y + dy) * IW + x0 + dx) * 3)
        text(rgb, IW, IH, x0 + 30, y + 1, `${SHORT[c]} ${km[c] ?? '-'}`, ink)
        y += 24
      }
    })
    const file = join(out, `${pack.id}-crops.png`)
    writePNG(file, IW, IH, rgb)
    log(file)
  }
}
