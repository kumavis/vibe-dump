// The packs check (DATA.md §§2, 3, 7, 10; ENGINEERING.md §13, the bake
// workflow's module): the table pack, the coast and every box pack, as the
// bakes wrote them.
//
// - Every pack decodes, in the pack format (8-bit RGB, B = 0), at its
//   manifest's size and encoding; no texel lies between the sea's −1 m and
//   the land's floor (0.5 m on the table, 0.25 m in a box).
// - The table: its grid recomputed from the frozen projection and theatre box
//   (2048 across, square texels); its land fraction in DATA.md §10's band,
//   tightened to the first bake's figure ±3 points; the places a person checks
//   by eye land and sea as they should be (Salmon Bank is sea; R1 §3.3).
// - The coast: polygons with kind, ne and area only (no Natural Earth name),
//   outer rings counter-clockwise and nothing crossing itself, no edge left
//   on the 180° meridian (the splits merged), strokes as lines.
// - Each box: its bounds hold the frozen ones (widened by under a texel);
//   R1's measured summits stand within two texels of their coordinates at
//   plausible heights (R1 §2.2: Savo 483.6 m, Kōnāhuanui 956.7 m, Samar 450.2
//   m in its window, Midway's Sand Island a few metres); the GLO-30 notice and
//   liability sentence verbatim and GMRT's citation and "resampled" wherever
//   they are used; its land agrees with coast.json within two texels (DATA.md
//   §10), measured over the whole box and on its edge.
// - Sizes: the table 5.5–7 MB, a box 0.5–3 MB, all of public/data under 40 MB.
//
// On the fixtures (test-data, `test: true`) only the format checks run.
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { readPNG } from '../lib/png.mjs'
import { ringIntersections, ringSignedArea } from '../lib/simplify.mjs'
import { IDS, landIndex, TableProjection, V1_PROJECTION } from './common.mjs'

const MB = 1e6
const TABLE_BOUNDS = [78, -42, 205, 56]
/** The first bake's land fraction (tools/bake-table.mjs, 2026-10-22): the band is this ±3 points, inside DATA.md §10's 18–35 %. */
const FIRST_LAND = 0.2476
const NOTICE =
  'produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved'
const LIABILITY = 'The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30'

/** Places on the table a person checks by eye: [lon, lat, 'land' | 'sea' | depth bound]. */
const TABLE_PLACES = {
  'Salmon Bank (a shoal ETOPO paints as land)': [-176.47, 27.0, 'sea'],
  'Honshu (central)': [138.5, 36.2, 'land'],
  'Kyushu': [131.0, 32.5, 'land'],
  'Luzon': [121.0, 16.0, 'land'],
  'Mindanao': [125.0, 7.8, 'land'],
  'Borneo': [114.0, 1.0, 'land'],
  'New Guinea': [143.0, -6.0, 'land'],
  'Australia (the north)': [133.0, -20.0, 'land'],
  'Hawaiʻi Island': [-155.5, 19.6, 'land'],
  'Attu': [173.2, 52.9, 'land'],
  'Guadalcanal': [160.0, -9.6, 'land'],
  'Kamchatka': [158.5, 54.5, 'land'],
  'The Mariana Trench': [142.5, 11.3, -8000],
  'The Philippine Sea': [132.0, 18.0, -3000],
  'The Coral Sea': [155.0, -15.0, -1000],
  'The Yellow Sea (shallow)': [123.0, 36.0, 'sea'],
}

/** R1 §2.2's measured GLO-30 maxima, by box: the summit (or a land point), its height, the band the texel mean may take. */
const SUMMITS = {
  'ironbottom-sound': [{ name: 'Savo', at: [159.8162, -9.1307], metres: 483.6, band: [0.8, 1.05], peak: true }],
  'pearl-harbor': [{ name: 'Kōnāhuanui', at: [-157.7887, 21.3576], metres: 956.7, band: [0.85, 1.05], peak: true }],
  samar: [{ name: 'the east coast of Samar (R1’s window 11–11.8° N, 125.4–126° E)', window: [125.4, 11.0, 126.0, 11.8], metres: 450.2, band: [0.6, 1.1] }],
  midway: [
    { name: 'Sand Island', at: [-177.38, 28.21], metres: 30.1, land: [0.25, 31] },
    { name: 'Eastern Island', at: [-177.33, 28.215], metres: 30.1, land: [0.25, 31] },
  ],
}

const sizeOf = (ctx, rel) => {
  try {
    return statSync(ctx.path(rel)).size
  } catch {
    return 0
  }
}

/** Decode a pack: { W, H, m (metres), land (count), min, max } or null with a problem. */
function decode(ctx, at, entry) {
  const file = entry.height?.file
  if (!file || !ctx.exists(file)) {
    ctx.bad(at, `height ${file} is missing`)
    return null
  }
  let img
  try {
    img = readPNG(ctx.path(file))
  } catch (e) {
    ctx.bad(at, `${file}: ${e.message}`)
    return null
  }
  const { width: W, height: H, data, channels } = img
  if (channels !== 3) {
    ctx.bad(at, `${file} has ${channels} channels; a pack is 8-bit RGB`)
    return null
  }
  const { scale, offset } = entry.height
  const m = new Float32Array(W * H)
  let blue = 0
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < W * H; i++) {
    if (data[i * 3 + 2] !== 0) blue++
    const v = (data[i * 3] * 256 + data[i * 3 + 1]) * scale + offset
    m[i] = v
    if (v < min) min = v
    if (v > max) max = v
  }
  if (blue) ctx.bad(at, `${blue} texels have B ≠ 0 (the pack format keeps B at 0)`)
  ctx.count('packs decoded')
  return { W, H, m, min, max }
}

/** Texels between the sea's −1 m and the land's floor: neither sea nor land. */
function checkGap(ctx, at, p, landFloor) {
  let n = 0
  for (let i = 0; i < p.m.length; i++) if (p.m[i] > -1 && p.m[i] < landFloor) n++
  if (n) ctx.bad(at, `${n} texels lie between −1 m and ${landFloor} m: a sea texel is never shallower than −1 m and land stands at least ${landFloor} m (DATA.md §§2, 7)`)
  let land = 0
  for (let i = 0; i < p.m.length; i++) if (p.m[i] > 0) land++
  return land / p.m.length
}

/** The table's grid from the frozen projection and theatre box, as tools/bake-table.mjs computes it. */
function tableGrid() {
  const proj = new TableProjection(V1_PROJECTION)
  let ex = [Infinity, Infinity, -Infinity, -Infinity]
  const grow = (lon, lat) => {
    const [x, z] = proj.toWorld([lon, lat])
    ex = [Math.min(ex[0], x), Math.min(ex[1], z), Math.max(ex[2], x), Math.max(ex[3], z)]
  }
  for (let l = TABLE_BOUNDS[0]; l <= TABLE_BOUNDS[2] + 1e-9; l += 0.01) grow(l, TABLE_BOUNDS[1]), grow(l, TABLE_BOUNDS[3])
  for (let a = TABLE_BOUNDS[1]; a <= TABLE_BOUNDS[3] + 1e-9; a += 0.01) grow(TABLE_BOUNDS[0], a), grow(TABLE_BOUNDS[2], a)
  const W = 2048
  const texel = (ex[2] - ex[0]) / W
  const H = Math.ceil((ex[3] - ex[1]) / texel - 1e-9)
  const cx = (ex[0] + ex[2]) / 2
  const cz = (ex[1] + ex[3]) / 2
  return { proj, W, H, extent: [cx - (W * texel) / 2, cz - (H * texel) / 2, cx + (W * texel) / 2, cz + (H * texel) / 2] }
}

function checkTable(ctx, m) {
  const t = m.table
  const at = 'manifest.json table'
  if (!t) return
  const p = decode(ctx, at, t)
  if (!p) return
  if (ctx.test) return
  // the grid
  const g = tableGrid()
  if (t.size?.[0] !== g.W || t.size?.[1] !== g.H) ctx.bad(at, `size ${JSON.stringify(t.size)}; the frozen projection and theatre box give ${g.W} × ${g.H}`)
  if (t.extent && t.extent.some((v, i) => Math.abs(v - g.extent[i]) > 1e-3)) ctx.bad(at, `extent ${JSON.stringify(t.extent)} is not the projected rectangle ${JSON.stringify(g.extent.map((v) => +v.toFixed(4)))}`)
  if (t.height.scale !== 0.5 || t.height.offset !== -11000) ctx.bad(at, `encoding ${t.height.scale}/${t.height.offset}; the table's is 0.5/−11000 (DATA.md §2)`)
  if (JSON.stringify(t.bounds) !== JSON.stringify(TABLE_BOUNDS)) ctx.bad(at, `bounds ${JSON.stringify(t.bounds)}; the theatre box is ${JSON.stringify(TABLE_BOUNDS)}`)
  // the envelope holds the rectangle's edges
  if (Array.isArray(t.envelope)) {
    const [w, s, e, n] = t.envelope
    let out = 0
    for (let k = 0; k <= 400; k++) {
      const u = k / 400
      for (const [x, z] of [
        [g.extent[0] + (g.extent[2] - g.extent[0]) * u, g.extent[1]],
        [g.extent[0] + (g.extent[2] - g.extent[0]) * u, g.extent[3]],
        [g.extent[0], g.extent[1] + (g.extent[3] - g.extent[1]) * u],
        [g.extent[2], g.extent[1] + (g.extent[3] - g.extent[1]) * u],
      ]) {
        const [lon, lat] = g.proj.toLonLat(x, z)
        if (lon < w - 1e-6 || lon > e + 1e-6 || lat < s - 1e-6 || lat > n + 1e-6) out++
      }
    }
    if (out) ctx.bad(at, `${out} points of the rectangle's edge fall outside the envelope ${JSON.stringify(t.envelope)}: the fetch would leave clamped corners (R1 §5.2)`)
  } else ctx.bad(at, 'has no envelope')
  // land and sea
  const land = checkGap(ctx, at, p, 0.5)
  if (land < 0.18 || land > 0.35) ctx.bad(at, `land fraction ${(land * 100).toFixed(2)} % is outside DATA.md §10's 18–35 %`)
  else if (Math.abs(land - FIRST_LAND) > 0.03) ctx.bad(at, `land fraction ${(land * 100).toFixed(2)} % is more than 3 points from the first bake's ${(FIRST_LAND * 100).toFixed(2)} %`)
  ctx.count(`table land ${(land * 100).toFixed(2)} %`)
  if (t.stats) {
    if (Math.abs(t.stats.landFraction - land) > 0.0005) ctx.bad(at, `stats.landFraction ${t.stats.landFraction} is not the pack's ${land.toFixed(4)}`)
    if (t.stats.minMetres !== p.min || t.stats.maxMetres !== p.max) ctx.bad(at, `stats min/max ${t.stats.minMetres}/${t.stats.maxMetres} are not the pack's ${p.min}/${p.max}`)
  } else ctx.warn(at, 'has no stats (land fraction, min, max)')
  const tx = (g.extent[2] - g.extent[0]) / g.W
  for (const [name, [lon, lat, want]] of Object.entries(TABLE_PLACES)) {
    const [x, z] = g.proj.toWorld([lon, lat])
    const i = Math.floor((x - g.extent[0]) / tx)
    const j = Math.floor((z - g.extent[1]) / tx)
    const v = p.m[j * g.W + i]
    const ok = want === 'land' ? v > 0 : want === 'sea' ? v <= -1 : v <= want
    if (!ok) ctx.bad(at, `${name} (${lon}, ${lat}) reads ${v} m; it should be ${typeof want === 'number' ? `deeper than ${want} m` : want}`)
    ctx.count('table places checked')
  }
  // sizes
  const bytes = sizeOf(ctx, t.height.file)
  if (bytes < 5.5 * MB || bytes > 7 * MB) ctx.bad(at, `${t.height.file} is ${(bytes / MB).toFixed(2)} MB; the table's budget is 5.5–7 MB (DATA.md §2)`)
  ctx.count(`table ${(bytes / MB).toFixed(2)} MB`)
  // sources
  const ids = (t.sources || []).map((s) => s.id)
  const et = (t.sources || []).find((s) => /etopo/i.test(s.id))
  if (!et || et.doi !== '10.25921/fd45-gt74') ctx.bad(at, 'sources lack ETOPO 2022 with its DOI 10.25921/fd45-gt74')
  if (!ids.some((id) => /natural-earth/.test(id))) ctx.bad(at, 'sources lack Natural Earth')
  for (const s of t.sources || []) if (!s.fetched) ctx.warn(at, `source ${s.id} has no fetched date`)
}

function checkCoast(ctx, m) {
  const rel = m.table?.coast
  if (!rel) return ctx.bad('manifest.json table', 'names no coast file')
  const c = ctx.load(rel)
  if (!c) return ctx.bad(rel, 'is missing or does not parse')
  if (c.type !== 'FeatureCollection' || !Array.isArray(c.features)) return ctx.bad(rel, 'is not a FeatureCollection')
  const KINDS = new Set(['land', 'island', 'reef'])
  let badProps = 0
  let badRings = 0
  let crossing = 0
  let onMeridian = 0
  let past180 = 0
  for (const [k, f] of c.features.entries()) {
    const at = `${rel} features[${k}]`
    const pr = f.properties || {}
    if (!KINDS.has(pr.kind) || typeof pr.ne !== 'string' || !(pr.area > 0)) {
      if (badProps++ < 5) ctx.bad(at, `properties ${JSON.stringify(pr)}: each polygon carries kind (land | island | reef), ne and area (DATA.md §3)`)
    }
    const extra = Object.keys(pr).filter((key) => !['kind', 'ne', 'area'].includes(key))
    if (extra.length && !ctx.test) ctx.bad(at, `carries ${extra.join(', ')}: no Natural Earth string beyond its id reaches the data (DATA.md §3)`)
    const g = f.geometry
    const polys = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : null
    if (!polys) {
      ctx.bad(at, `geometry ${g?.type} is not a polygon`)
      continue
    }
    for (const rings of polys) {
      rings.forEach((r, ri) => {
        const closed = r.length >= 4 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]
        const a = ringSignedArea(r)
        if (!closed || (ri === 0 ? a <= 0 : a >= 0)) badRings++
        for (let i = 0; i + 1 < r.length; i++) {
          if (r[i][0] > 180 || r[i][0] < -180) past180++
          if (r[i][0] === 180 && r[i + 1][0] === 180) onMeridian++
        }
      })
      if (!ctx.test && ringIntersections(rings).length) {
        if (crossing++ < 5) ctx.bad(at, `${pr.ne}: its rings cross themselves or each other (DATA.md §12)`)
      }
    }
    ctx.count('coast polygons')
  }
  if (badRings) ctx.bad(rel, `${badRings} rings are open or wound the wrong way (outer counter-clockwise, holes clockwise; DATA.md §12)`)
  if (onMeridian) ctx.bad(rel, `${onMeridian} polygon edges lie on the 180° meridian: Natural Earth's splits are not merged (DATA.md §3)`)
  if (!ctx.test && !past180) ctx.warn(rel, 'no polygon reaches past 180°: are the longitudes continuous across the date line?')
  const st = c.strokes
  if (!st || st.type !== 'FeatureCollection' || !Array.isArray(st.features) || !st.features.length) ctx.bad(rel, 'has no strokes collection (DATA.md §3)')
  else {
    const nonLines = st.features.filter((f) => f.geometry?.type !== 'LineString' && f.geometry?.type !== 'MultiLineString').length
    if (nonLines) ctx.bad(rel, `${nonLines} strokes are not lines`)
    ctx.count('coast strokes', st.features.length)
  }
  if (!ctx.test) {
    const bytes = sizeOf(ctx, rel)
    if (bytes > 4 * MB) ctx.warn(rel, `is ${(bytes / MB).toFixed(2)} MB`)
  }
}

/** The texel of [lon, lat] in a box (continuous longitudes past 180 where the box is). */
function texelOf(b, W, H, [lon, lat]) {
  const [w, s, e, n] = b.bounds
  const L = lon < w - 180 ? lon + 360 : lon
  return [Math.floor(((L - w) / (e - w)) * W), Math.floor(((n - lat) / (n - s)) * H)]
}

function checkBox(ctx, b, coastTest) {
  const at = `boxes/manifest.json ${b.id}`
  const p = decode(ctx, at, b)
  if (!p) return
  const f = ctx.frozen.boxes[b.id]
  if (b.height.scale !== 0.25 || b.height.offset !== -11000) ctx.bad(at, `encoding ${b.height.scale}/${b.height.offset}; every box's is 0.25/−11000 (DATA.md §2)`)
  if (ctx.test || !f) return
  const { W, H, m } = p
  // the frozen bounds held
  const [w, s, e, n] = b.bounds
  const dLon = (e - w) / W
  const dLat = (n - s) / H
  const fb = f.bounds
  if (w > fb[0] + 1e-9 || s > fb[1] + 1e-9 || e < fb[2] - 1e-9 || n < fb[3] - 1e-9) ctx.bad(at, `bounds ${JSON.stringify(b.bounds)} do not hold the frozen ${JSON.stringify(fb)}`)
  const widened = [(fb[0] - w) / dLon, (fb[1] - s) / dLat, (e - fb[2]) / dLon, (n - fb[3]) / dLat]
  if (widened.some((v) => v >= 1)) ctx.bad(at, `bounds widened by ${widened.map((v) => v.toFixed(2)).join(', ')} texels; under one is allowed`)
  // land and sea
  const land = checkGap(ctx, at, p, 0.25)
  if (b.stats && Math.abs(b.stats.landFraction - land) > 0.0005) ctx.bad(at, `stats.landFraction ${b.stats.landFraction} is not the pack's ${land.toFixed(4)}`)
  if (b.exaggeration !== 1) ctx.bad(at, `exaggeration ${b.exaggeration}; v1 boxes are 1.0`)
  if (b.sea !== 'gmrt' && b.sea !== 'etopo15') ctx.bad(at, `sea “${b.sea}” is not gmrt or etopo15`)
  // the summits
  for (const sm of SUMMITS[b.id] || []) {
    if (sm.window) {
      const [a0, b0] = texelOf(b, W, H, [sm.window[0], sm.window[3]])
      const [a1, b1] = texelOf(b, W, H, [sm.window[2], sm.window[1]])
      let best = -Infinity
      for (let j = Math.max(0, b0); j <= Math.min(H - 1, b1); j++) for (let i = Math.max(0, a0); i <= Math.min(W - 1, a1); i++) best = Math.max(best, m[j * W + i])
      if (best < sm.metres * sm.band[0] || best > sm.metres * sm.band[1]) ctx.bad(at, `${sm.name}: the highest texel is ${best} m; R1 measured ${sm.metres} m on GLO-30 (band ×${sm.band.join('–')})`)
      ctx.count('summits checked')
      continue
    }
    const [ci, cj] = texelOf(b, W, H, sm.at)
    if (sm.land) {
      let ok = false
      let hi = -Infinity
      for (let j = cj - 2; j <= cj + 2; j++) for (let i = ci - 2; i <= ci + 2; i++) if (i >= 0 && j >= 0 && i < W && j < H && m[j * W + i] > 0) {
        ok = true
        hi = Math.max(hi, m[j * W + i])
      }
      if (!ok) ctx.bad(at, `${sm.name} (${sm.at.join(', ')}) has no land within two texels`)
      else if (hi < sm.land[0] || hi > sm.land[1]) ctx.bad(at, `${sm.name} stands ${hi} m; a few metres expected (GLO-30's highest cell ${sm.metres} m is trees and buildings)`)
      ctx.count('summits checked')
      continue
    }
    // the highest texel within two texels, and the island's highest within 2 km, which must be the same peak
    let hi = -Infinity
    for (let j = cj - 2; j <= cj + 2; j++) for (let i = ci - 2; i <= ci + 2; i++) if (i >= 0 && j >= 0 && i < W && j < H) hi = Math.max(hi, m[j * W + i])
    const r = Math.ceil(2000 / b.metresPerTexel[0])
    let far = -Infinity
    let fi = 0
    let fj = 0
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) if (i >= 0 && j >= 0 && i < W && j < H && m[j * W + i] > far) {
      far = m[j * W + i]
      fi = i
      fj = j
    }
    const off = Math.hypot(fi - ci, fj - cj)
    if (hi < sm.metres * sm.band[0] || hi > sm.metres * sm.band[1]) ctx.bad(at, `${sm.name}: ${hi} m within two texels of ${sm.at.join(', ')}; R1 measured ${sm.metres} m (band ×${sm.band.join('–')})`)
    if (off > 2.01) ctx.bad(at, `${sm.name}: the highest texel within 2 km is ${off.toFixed(1)} texels from R1's coordinates; the pack may be misplaced`)
    ctx.count('summits checked')
  }
  // the credits
  const src = b.sources || []
  const glo = src.find((x) => x.id === 'glo-30')
  if (!glo) ctx.bad(at, 'sources lack GLO-30, the land of every box (DATA.md §7)')
  else {
    if (glo.notice !== NOTICE) ctx.bad(at, 'the GLO-30 source lacks the licence’s “produced using” notice verbatim (DATA.md §7, NOTICE.md)')
    if (glo.liability !== LIABILITY) ctx.bad(at, 'the GLO-30 source lacks the liability sentence verbatim')
    if (!String(b.credit || '').includes(NOTICE.replace(/^produced/, 'produced'))) ctx.bad(at, 'credit does not carry the GLO-30 notice')
  }
  const gm = src.find((x) => x.id === 'gmrt')
  if (b.sea === 'gmrt') {
    if (!gm) ctx.bad(at, 'sea is gmrt but sources lack GMRT')
    else {
      if (!/Ryan/.test(gm.title || '') || !/10\.1029\/2008GC002332/.test(gm.citation || '')) ctx.bad(at, 'the GMRT source lacks its citation (Ryan et al. 2009, doi:10.1029/2008GC002332)')
      if (gm.credit !== 'GMRT, CC BY 4.0, resampled and clamped') ctx.bad(at, 'the GMRT source’s credit is not DATA.md §7’s “GMRT, CC BY 4.0, resampled and clamped”')
      if (!/resampled/.test(b.credit || '')) ctx.bad(at, 'credit does not say the GMRT floor was resampled')
    }
  }
  if (b.id === 'pearl-harbor') {
    if (!src.some((x) => /cudem/.test(x.id))) ctx.bad(at, 'sources lack NOAA CUDEM (DATA.md §7)')
    if (!src.some((x) => x.licence === 'odbl' && /OpenStreetMap/.test(x.credit || ''))) ctx.bad(at, 'sources lack OpenStreetMap with its ODbL credit (DATA.md §7)')
    if (!/CUDEM/.test(b.credit || '')) ctx.bad(at, 'credit does not name CUDEM')
    if (b.shore?.year !== 1941) ctx.bad(at, 'is not set back to the shore of 1941 (DATA.md §7)')
    for (const wk of b.shore?.works || []) for (const id of wk.sources || []) if (!b.shore.references?.[id]) ctx.bad(at, `shore work ${wk.id} cites “${id}”, which the entry does not carry`)
  }
  // sizes
  const bytes = sizeOf(ctx, b.height.file)
  if (bytes < 0.5 * MB || bytes > 3 * MB) ctx.bad(at, `${b.height.file} is ${(bytes / MB).toFixed(2)} MB; a box's budget is 0.5–3 MB (DATA.md §2)`)
  ctx.count(`${b.id} ${(bytes / MB).toFixed(2)} MB`)
  // the coast: the pack's land against coast.json's, within two texels, over the box and on its edge band
  if (coastTest) {
    const isLand = new Uint8Array(W * H)
    for (let t = 0; t < W * H; t++) isLand[t] = m[t] > 0 ? 1 : 0
    const near = (i, j, want) => {
      for (let b2 = -2; b2 <= 2; b2++) for (let a = -2; a <= 2; a++) {
        const x = i + a
        const y = j + b2
        if (x >= 0 && y >= 0 && x < W && y < H && isLand[y * W + x] === want) return true
      }
      return false
    }
    const step = Math.max(1, Math.round(W / 512))
    let cnt = 0
    let off = 0
    let edgeN = 0
    let edgeOff = 0
    const band = 8
    for (let j = 0; j < H; j += step)
      for (let i = 0; i < W; i += step) {
        const lon = w + (i + 0.5) * dLon
        const lat = n - (j + 0.5) * dLat
        const ne = coastTest([lon, lat]) ? 1 : 0
        const edge = i < band || j < band || i >= W - band || j >= H - band
        cnt++
        if (edge) edgeN++
        if (!near(i, j, ne)) {
          off++
          if (edge) edgeOff++
        }
      }
    const share = off / cnt
    const edgeShare = edgeN ? edgeOff / edgeN : 0
    ctx.count(`${b.id} land against the coast ${(share * 100).toFixed(2)} % off (edge ${(edgeShare * 100).toFixed(2)} %)`)
    if (share > 0.05 || edgeShare > 0.05) ctx.bad(at, `${(share * 100).toFixed(1)} % of the box (${(edgeShare * 100).toFixed(1)} % of its edge) disagrees with coast.json by more than two texels: the pack may be misplaced (DATA.md §10)`)
    else if (share > 0.005 || edgeShare > 0.005) ctx.warn(at, `${(share * 100).toFixed(2)} % of the box (${(edgeShare * 100).toFixed(2)} % of its edge) disagrees with coast.json by more than two texels (Natural Earth's 10 m coast is coarse beside GLO-30 and CUDEM${b.id === 'pearl-harbor' ? ': Oʻahu is one polygon with its lochs filled' : ''})`)
  }
}

function totalBytes(dir) {
  let s = 0
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const st = statSync(p)
    s += st.isDirectory() ? totalBytes(p) : st.size
  }
  return s
}

export default function check(ctx) {
  const m = ctx.load('manifest.json')
  if (!m) return ctx.warn('manifest.json', 'not here: the packs are not checked')
  checkTable(ctx, m)
  checkCoast(ctx, m)
  const boxes = ctx.list('boxes/manifest.json', 'boxes')
  const coast = !ctx.test ? ctx.load(m.table?.coast || 'table/coast.json') : null
  const test = coast ? landIndex({ features: coast.features.filter((f) => f.properties?.kind !== 'reef') }) : null
  for (const b of boxes) checkBox(ctx, b, test)
  if (!ctx.test) {
    for (const id of Object.keys(IDS.boxes)) if (!boxes.some((b) => b.id === id)) ctx.bad('boxes/manifest.json', `has no ${id} (the four v1 boxes are baked: DATA.md §7)`)
    const total = totalBytes(ctx.dir)
    if (total > 40 * MB) ctx.bad('public/data', `is ${(total / MB).toFixed(1)} MB; the budget is 40 MB (DATA.md §2)`)
    ctx.count(`public/data ${(total / MB).toFixed(1)} MB`)
  }
}
