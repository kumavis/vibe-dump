// The fronts check (DATA.md §6, §10; ENGINEERING.md §13, content workflow): fronts/manifest.json, one
// FeatureCollection per keyframe and fronts/lines.geojson against their schema and the rules: every frozen
// keyframe present, its date its id, its file there; land polygons with a state and a precision of the
// vocabulary, valid (closed rings, no ring crossing itself or another of its polygon's rings) and inside
// the table's envelope; General Order No. 1's zones only on the last keyframe (and there); perimeters as
// lines; the declared lines with a name, a Japanese name and their dates; every keyframe's, polygon's and
// line's sources public domain (§4); the copy and voice rules on the notes and names the table shows;
// R3's named cut-off garrisons Japanese on every keyframe from their isolation to their surrender.
import { resolver, checkVocab, instant, checkCopy, checkVoice, checkNoNumbers, TableProjection, V1_PROJECTION, VOCAB } from './common.mjs'
import { ALLOW } from './gazetteer.mjs'

const LAST = '1945-09-02'
const cites = (list) => (Array.isArray(list) ? list : []).map((s) => (typeof s === 'string' ? s : s?.id))

/** The table's envelope [w, s, e, n]: the manifest's, else the lon/lat the projected rectangle's edges reach. */
function envelopeOf(manifest) {
  if (Array.isArray(manifest?.table?.envelope) && manifest.table.envelope.length === 4) return manifest.table.envelope
  const proj = new TableProjection(manifest?.projection?.lon0 !== undefined ? manifest.projection : V1_PROJECTION)
  const b = manifest?.table?.bounds || [78, -42, 205, 56]
  let ex = [Infinity, Infinity, -Infinity, -Infinity]
  const grow = (lon, lat) => {
    const [x, z] = proj.toWorld([lon, lat])
    ex = [Math.min(ex[0], x), Math.min(ex[1], z), Math.max(ex[2], x), Math.max(ex[3], z)]
  }
  for (let l = b[0]; l <= b[2]; l += 0.5) grow(l, b[1]), grow(l, b[3])
  for (let a = b[1]; a <= b[3]; a += 0.5) grow(b[0], a), grow(b[2], a)
  let env = [Infinity, Infinity, -Infinity, -Infinity]
  for (let k = 0; k <= 200; k++) {
    const t = k / 200
    for (const [x, z] of [[ex[0] + (ex[2] - ex[0]) * t, ex[1]], [ex[0] + (ex[2] - ex[0]) * t, ex[3]], [ex[0], ex[1] + (ex[3] - ex[1]) * t], [ex[2], ex[1] + (ex[3] - ex[1]) * t]]) {
      const [lon, lat] = proj.toLonLat(x, z)
      env = [Math.min(env[0], lon), Math.min(env[1], lat), Math.max(env[2], lon), Math.max(env[3], lat)]
    }
  }
  return env
}

/** Longitudes made continuous along a ring (either side of 180 as the file writes them), about the table's lon0. */
function unwrap(ring) {
  const out = []
  for (const [lon, lat] of ring) {
    let x = lon
    if (out.length) {
      const p = out[out.length - 1][0]
      while (x - p > 180) x -= 360
      while (x - p < -180) x += 360
    } else {
      while (x < 141.5 - 180) x += 360
      while (x >= 141.5 + 180) x -= 360
    }
    out.push([x, lat])
  }
  return out
}

/** Whether segments ab and cd cross properly (touching at an end is not a crossing). */
function cross(a, b, c, d) {
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  const d1 = o(c, d, a)
  const d2 = o(c, d, b)
  const d3 = o(a, b, c)
  const d4 = o(a, b, d)
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
}

/** The first crossing among a polygon's rings (a ring with itself, or one ring with another), or null. */
function firstCrossing(rings) {
  const segs = []
  rings.forEach((r, ri) => {
    for (let i = 0; i + 1 < r.length; i++) segs.push({ a: r[i], b: r[i + 1], ri, i, n: r.length - 1 })
  })
  const cell = 0.5
  const grid = new Map()
  segs.forEach((s, k) => {
    const x0 = Math.floor(Math.min(s.a[0], s.b[0]) / cell)
    const x1 = Math.floor(Math.max(s.a[0], s.b[0]) / cell)
    const y0 = Math.floor(Math.min(s.a[1], s.b[1]) / cell)
    const y1 = Math.floor(Math.max(s.a[1], s.b[1]) / cell)
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
      const key = `${x},${y}`
      if (!grid.has(key)) grid.set(key, [])
      grid.get(key).push(k)
    }
  })
  for (const ks of grid.values()) {
    for (let u = 0; u < ks.length; u++) {
      for (let v = u + 1; v < ks.length; v++) {
        const s = segs[ks[u]]
        const t = segs[ks[v]]
        if (s.ri === t.ri) {
          const d = Math.abs(s.i - t.i)
          if (d <= 1 || d === s.n - 1) continue // neighbours along the ring share an end
        }
        if (cross(s.a, s.b, t.a, t.b)) return s.a
      }
    }
  }
  return null
}

/** Whether [lon, lat] is inside a polygon's rings (even-odd, the outer ring less its holes). */
function inPolygon(rings, [lon, lat]) {
  let inside = false
  for (const raw of rings) {
    const r = unwrap(raw)
    let x = lon
    while (x - r[0][0] > 180) x -= 360
    while (x - r[0][0] < -180) x += 360
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i]
      const [xj, yj] = r[j]
      if (yi > lat !== yj > lat && x < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/**
 * R3's named cut-off garrisons (research/R3-timeline.md §5: K4's "held and cut off", K5's "Cut off:" list;
 * research/content.md §3), each from the first keyframe on which R3 names it cut off. On the land the
 * front draws (`at`, a point inside the garrison), the keyframe's state there is `held`, or on the last
 * keyframe a zone of General Order No. 1, through `to` or the place's Japanese interval's end. An island
 * the front leaves to the marks (`place` alone) has a Japanese held interval in places.json that covers
 * the date, with its `cutOff` on or before it.
 */
export const CUT_OFF = [
  { name: 'Rabaul and the Gazelle Peninsula', at: [152.17, -4.2], place: 'rabaul', from: '1944-08-15' },
  { name: 'New Ireland, isolated with Rabaul', at: [150.8, -2.58], from: '1944-08-15', to: LAST },
  { name: 'the Wewak pocket', at: [143.63, -3.55], place: 'wewak', from: '1944-08-15' },
  { name: 'Bougainville, less Torokina', at: [155.63, -6.22], place: 'bougainville', from: '1945-01-15' },
  // the Vogelkop at Manokwari; Sorong, under the page's pink sea lane past Sansapor, is a known gap (content.md §3)
  { name: 'the Vogelkop', at: [134.08, -0.87], from: '1945-01-15', to: LAST },
  ...['wotje', 'maloelap', 'mili', 'jaluit', 'rota', 'pagan'].map((place) => ({ place, from: '1944-08-15' })),
  ...['truk', 'ponape', 'kusaie', 'nauru', 'banaba', 'wake', 'marcus', 'yap', 'babelthuap'].map((place) => ({ place, from: '1945-01-15' })),
]

const ringArea = (r) => {
  let s = 0
  for (let i = 0; i + 1 < r.length; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
  return s / 2
}

export default function check(ctx) {
  const man = ctx.load('fronts/manifest.json')
  if (man === undefined) return ctx.warn('fronts', 'no fronts/manifest.json here')
  if (!man || !Array.isArray(man.keyframes)) return ctx.bad('fronts/manifest.json', 'has no keyframes list')
  const list = (v) => (Array.isArray(v) ? v : [])
  const sources = new Map(list(ctx.load('sources.json')).filter((s) => s?.id).map((s) => [s.id, s]))
  const refSource = resolver(ctx, sources, 'source', 'sources.json')
  const env = envelopeOf(ctx.load('manifest.json'))
  const inEnv = ([lon, lat]) => {
    let x = lon
    while (x < env[0] - 1e-6) x += 360
    while (x > env[2] + 1e-6) x -= 360
    return x >= env[0] - 1e-6 && x <= env[2] + 1e-6 && lat >= env[1] - 1e-6 && lat <= env[3] + 1e-6
  }
  /** sources cited by a keyframe, a feature or a line: they resolve, and an image of the front is public domain */
  const checkPD = (at, srcs, { need = true } = {}) => {
    const ids = cites(srcs)
    if (need && !ids.length) ctx.bad(at, 'cites no source')
    for (const id of ids) {
      if (!refSource(at, id)) continue
      const lic = sources.get(id)?.licence
      if (!VOCAB.imageLicences.includes(lic)) ctx.bad(at, `source ${id} is ${lic}: a front is traced only from public-domain maps (${VOCAB.imageLicences.join(' | ')})`)
    }
    for (const s of list(srcs)) if (typeof s === 'object' && s && typeof s.where !== 'string') ctx.bad(at, `source ${s.id} has no where`)
  }
  const userText = (at, t) => {
    if (typeof t !== 'string') return
    checkCopy(ctx, at, t)
    checkVoice(ctx, at, t)
    checkNoNumbers(ctx, at, t, { allow: ALLOW })
    if (/\*verify\*/.test(t)) ctx.bad(at, 'carries a *verify* mark in text the table shows')
  }

  // --- the manifest --------------------------------------------------------------------------------
  const ids = new Set()
  for (const [i, k] of man.keyframes.entries()) {
    const at = `fronts/manifest.json keyframes[${i}] ${k?.id ?? ''}`
    if (!k || typeof k.id !== 'string') {
      ctx.bad(at, 'has no id')
      continue
    }
    if (ids.has(k.id)) ctx.bad(at, 'a second keyframe with this id')
    ids.add(k.id)
    if (k.date !== k.id) ctx.bad(at, `date ${k.date} is not its id`)
    instant(ctx, `${at} date`, k.date)
    if (k.file !== `fronts/${k.id}.geojson`) ctx.warn(at, `file ${k.file} is not fronts/${k.id}.geojson`)
    checkPD(at, k.sources)
    userText(`${at} note`, k.note)
    if (i > 0 && man.keyframes[i - 1]?.id >= k.id) ctx.bad(at, 'keyframes are not in date order')
  }
  for (const id of ctx.frozen.keyframes || []) if (!ids.has(id)) ctx.bad('fronts/manifest.json', `has no keyframe ${id} (tools/check/ids.json)`)
  for (const id of ids) if (!(ctx.frozen.keyframes || []).includes(id)) ctx.warn('fronts/manifest.json', `keyframe ${id} is not a frozen keyframe`)

  // --- each keyframe ---------------------------------------------------------------------------------
  const lastId = ctx.test ? null : LAST
  for (const k of man.keyframes) {
    if (!k?.file) continue
    const fc = ctx.load(k.file)
    const at0 = k.file
    if (fc === undefined) {
      ctx.bad(at0, 'is missing')
      continue
    }
    if (!fc || fc.type !== 'FeatureCollection' || !Array.isArray(fc.features)) {
      ctx.bad(at0, 'is not a FeatureCollection')
      continue
    }
    let zones = 0
    let polys = 0
    for (const [i, f] of fc.features.entries()) {
      const p = f?.properties || {}
      const g = f?.geometry
      const at = `${at0} feature ${i} ${p.name ?? ''}`
      if (p.kind === 'perimeter') {
        if (!g || !/^(Multi)?LineString$/.test(g.type)) ctx.bad(at, 'a perimeter is a LineString')
        else {
          const lines = g.type === 'LineString' ? [g.coordinates] : g.coordinates
          for (const l of lines) {
            if (!Array.isArray(l) || l.length < 2) ctx.bad(at, 'a perimeter needs two points')
            for (const c of l || []) if (!inEnv(c)) {
              ctx.bad(at, `point ${JSON.stringify(c)} is outside the table's envelope`)
              break
            }
          }
        }
        if (p.name !== undefined) userText(`${at} name`, p.name)
        checkPD(at, p.sources)
        ctx.count('front perimeters')
        continue
      }
      if (p.kind !== undefined) ctx.bad(at, `kind “${p.kind}”: a front feature is land (a state) or a perimeter`)
      if (!p.state) {
        ctx.bad(at, 'has neither a state nor kind: perimeter')
        continue
      }
      checkVocab(ctx, at, 'state', p.state, 'frontStates')
      if (p.precision) checkVocab(ctx, at, 'precision', p.precision, 'frontPrecision')
      else ctx.bad(at, 'has no precision (mapped | schematic)')
      if (typeof p.name !== 'string' || !p.name) ctx.bad(at, 'has no name')
      else userText(`${at} name`, p.name)
      if (p.pointsAndLines !== undefined && typeof p.pointsAndLines !== 'boolean') ctx.bad(at, 'pointsAndLines is true or absent')
      if (String(p.state).startsWith('zone-')) {
        zones++
        if (lastId && k.id !== lastId) ctx.bad(at, `General Order No. 1's zone ${p.state} on ${k.id}: the zones are the last keyframe's (${LAST})`)
      }
      checkPD(at, p.sources)
      if (!g || !['Polygon', 'MultiPolygon'].includes(g.type)) {
        ctx.bad(at, `geometry ${g?.type}: land is a Polygon or MultiPolygon`)
        continue
      }
      const ps = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
      for (const [j, poly] of ps.entries()) {
        const pat = ps.length > 1 ? `${at} polygon ${j}` : at
        if (!Array.isArray(poly) || !poly.length) {
          ctx.bad(pat, 'has no rings')
          continue
        }
        const rings = []
        let ok = true
        for (const r of poly) {
          if (!Array.isArray(r) || r.length < 4 || r.some((c) => !Array.isArray(c) || !Number.isFinite(c[0]) || !Number.isFinite(c[1]) || Math.abs(c[1]) > 90)) {
            ctx.bad(pat, 'a ring has fewer than four [lon, lat] points')
            ok = false
            break
          }
          const a = r[0]
          const b = r[r.length - 1]
          if (a[0] !== b[0] || a[1] !== b[1]) {
            ctx.bad(pat, 'a ring is not closed')
            ok = false
          }
          const out = r.find((c) => !inEnv(c))
          if (out) {
            ctx.bad(pat, `point ${JSON.stringify(out)} is outside the table's envelope`)
            ok = false
          }
          rings.push(unwrap(r))
        }
        if (!ok) continue
        if (Math.abs(ringArea(rings[0])) < 1e-6) ctx.bad(pat, 'its outer ring has no area')
        const x = firstCrossing(rings)
        if (x) ctx.bad(pat, `a ring crosses itself or another of its polygon's rings near ${x.map((v) => v.toFixed(2)).join(', ')}`)
        polys++
      }
      ctx.count('front land features')
    }
    if (lastId && k.id === lastId && !zones) ctx.bad(at0, `the last keyframe holds General Order No. 1's zones as states (zone-cks, zone-soviet, zone-seac, zone-cincpac, zone-swpa)`)
    ctx.count(`front polygons on ${k.id}`, polys)
  }

  // --- R3's named cut-off garrisons ------------------------------------------------------------------------
  if (!ctx.test) {
    const places = new Map(list(ctx.load('places.json')).filter((p) => p?.id).map((p) => [p.id, p]))
    for (const g of CUT_OFF) {
      const at = `fronts cut-off garrison ${g.name || g.place}`
      const place = g.place ? places.get(g.place) : null
      if (g.place && !place) {
        ctx.bad(at, `no place ${g.place} in places.json`)
        continue
      }
      const jp = list(place?.held).find((h) => h?.by === 'jp' && String(h.from) <= g.from && String(h.to) >= g.from)
      if (!g.at) {
        if (!jp) ctx.bad(at, `places.json ${g.place} has no Japanese held interval over ${g.from}, when R3 names it cut off`)
        else if (!jp.cutOff || String(jp.cutOff) > g.from) ctx.bad(at, `places.json ${g.place}: its Japanese interval's cutOff is ${jp.cutOff}, not on or before ${g.from}`)
        else ctx.count('cut-off garrisons held to their surrender')
        continue
      }
      const to = g.to || jp?.to
      if (!to) {
        ctx.bad(at, `no end: places.json ${g.place} has no Japanese held interval over ${g.from}`)
        continue
      }
      for (const k of man.keyframes) {
        if (!k?.id || k.id < g.from || k.id > String(to)) continue
        const fc = ctx.load(k.file)
        // every feature over the point: two smoothed polygons can overlap at their edge, and the table draws both
        const states = []
        for (const f of fc?.features || []) {
          const p = f?.properties || {}
          if (!p.state || !f.geometry) continue
          const ps = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : []
          if (ps.some((rings) => inPolygon(rings, g.at))) states.push(p.state)
        }
        const ok = states.length && states.every((st) => st === 'held' || (k.id === LAST && String(st).startsWith('zone-')))
        if (!ok) ctx.bad(`${k.file} at ${g.at.join(', ')}`, `${g.name} is ${states.join(' and ') || 'not on the front’s land'}; R3 has it cut off and Japanese from ${g.from} to ${to} (held, or a General Order No. 1 zone on ${LAST})`)
        else ctx.count('cut-off garrison keyframes held')
      }
    }
  }

  // --- the declared lines --------------------------------------------------------------------------------
  if (man.lines !== undefined) {
    const lf = ctx.load(man.lines)
    if (lf === undefined) ctx.bad('fronts/manifest.json', `lines ${man.lines} is missing`)
    else if (!lf || !Array.isArray(lf.features)) ctx.bad(man.lines, 'is not a FeatureCollection')
    else {
      for (const [i, f] of lf.features.entries()) {
        const p = f?.properties || {}
        const at = `${man.lines} feature ${i} ${p.name ?? ''}`
        if (f?.geometry?.type !== 'LineString' || !Array.isArray(f.geometry.coordinates) || f.geometry.coordinates.length < 2) ctx.bad(at, 'a declared line is a LineString of two points or more')
        else {
          const out = f.geometry.coordinates.find((c) => !inEnv(c))
          if (out) ctx.bad(at, `point ${JSON.stringify(out)} is outside the table's envelope`)
        }
        if (typeof p.name !== 'string' || !p.name) ctx.bad(at, 'has no name')
        else userText(`${at} name`, p.name)
        const ja = typeof p.ja === 'string' ? p.ja : p.ja?.kanji
        if (typeof ja !== 'string' || !ja) ctx.bad(at, 'has no ja (a string, or { kanji, romaji })')
        if (p.ja?.verify) ctx.count('declared lines with a Japanese name to verify')
        const a = p.from ? instant(ctx, `${at} from`, p.from) : (ctx.bad(at, 'has no from'), null)
        const b = p.to ? instant(ctx, `${at} to`, p.to) : null
        if (a !== null && b !== null && b < a) ctx.bad(at, `to ${p.to} is before from ${p.from}`)
        checkPD(at, p.sources)
        ctx.count('declared lines')
      }
    }
  } else ctx.warn('fronts/manifest.json', 'names no lines file')
}
