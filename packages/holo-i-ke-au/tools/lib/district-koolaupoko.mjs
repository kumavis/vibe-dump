// The patches of the koolaupoko district (DATA.md, "District packs" and
// "Patches, on any pack"): the Navy's dredging and fill in Kāneʻohe Bay
// (1939–43), Holmes's fill at Moku o Loʻe (1934–36) and the small-boat
// harbour at Heʻeia Kea (1950), each a dated work with its own `until`,
// `kind` and `depth`, listed in the district's own manifest entry.
//
// The bay before the dredging is read off G. E. G. Jackson's survey of
// August 1882 (Registered Map 1140, 1:12,000, soundings in fathoms at low
// water), in F. W. Thrum's reduction of 1892 at 1:24,000 (Registered Map
// 1848), which draws the same reefs, shore and soundings on a sheet whose
// paper is white rather than blueprint. Both as Kīpuka serves them: 1-bit
// scans with no georeferencing. The reduction was registered to today's
// ground by an affine fit on eight points that have not moved (Kapapa,
// Mokolea, the tip of Pyramid Rock, the summits of Puʻu Hawaiʻiloa, Moku o
// Loʻe, Pointed Hill and the station Jackson writes Kaaualu, and the centroid
// of Heʻeia's pond): residuals 20 to 72 m, 42 m rms. Points farther out
// (Mokoliʻi, Mokumanu, Kīʻi Point) fit to 50–170 m and were left out, so the
// registration holds for the south bay and Mōkapu only.
//
// On the registered sheet the reefs were found, not traced: the ink was
// read at 1 bit, the graticule erased, specks dropped, the outlines closed
// by 5 pixels (8 m), and everything not reached from the open water (seeded
// by hand on soundings) taken as enclosed: reefs, flats, islands and land.
// The enclosed shapes that meet the dredged zone (below) were kept,
// simplified at 6 m and those under 20 m across dropped (sounding digits).
// The shores of Mōkapu and of Heʻeia Kea and the outline of Moku o Loʻe were
// traced by hand on the same sheet. All are in
// district-koolaupoko-1882.json, and written out as shoreline-1882.geojson.
// The U.S. Geological Survey's sheets of 1927 (the State's oahu_topo_1927
// mosaic, georeferenced within about 20 m here) and 1938 were read against
// them: both draw Mōkapu's shore and Moku o Loʻe where Jackson does, within
// about 30 m, and neither draws the reefs. Donn's 1902 sheet copies
// Jackson's reefs; the 1881 sheet draws none.
//
// The dredged zone is NOAA's chart of today (ENC Direct, harbour scale):
// its seaplane landing area over the south bay, the fairways to the air
// station, and the Crashboat Channel. Inside it, sea that Jackson draws as
// reef and that today lies deeper than CUT is the dredged ground; the
// fairway from the north passage, charted as improved, was not read against
// the chart and is left as today's.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { coverage } from './layers-raster.mjs'
import { dilate, erode } from './patch-raster.mjs'
import { writeGreyPNG } from './png.mjs'
import { ENC, FILL, REGISTERED_MAPS, SURVEY_MAPS, districtPaths, mapExport } from './district-sources.mjs'
import { HISTORIES } from './patch-works.mjs'

const HERE = new URL('.', import.meta.url).pathname
const CHART = JSON.parse(readFileSync(join(HERE, 'district-koolaupoko-1882.json'), 'utf8'))

// Sea deeper than this inside a reef of 1882 has been dredged (the reef tops
// and flats Jackson draws stand at about 1 m today where they were left)
const CUT = -3
// ... at Heʻeia Kea, where the harbour was dug into the shore flat to about 2 m
const CUT_FLAT = -1.6
// Pieces of the cut narrower than this (texels, either side) are the
// registration's slivers round reefs that were not dredged
const OPEN = 2

// Sources of the dates, read on the day given
const READ = '2026-10-22'
const DATES = {
  'mokapu-1965': {
    title: 'A. Steele and C. A. P. McNease, Myths, Martyrs and Marines of Mokapu: a history of the Marine Corps Air Station, Kaneohe Bay, Hawaii (1965)',
    url: 'https://archive.org/details/mythsmartyrsmari00stee',
    licence: 'quoted for its dates; a publication of the air station',
    note:
      'pp. 24–25 (in the Internet Archive’s full text): “On Sept. 5, 1939, workers began building a dike preparatory to filling with material dredged ' +
      'from the Kaneohe Bay”; the dredge B. F. Dillingham began on 27 September; “Dredging and filling continued on the new Naval Base until 1943. By ' +
      'then workers had added 280 acres”, about 118 of them along the south shore from the hangars east, and “West of the runway a dike was built and ' +
      '162 acres were added to the ancient Heeia section”',
  },
  'usn-building-bases-1947': HISTORIES['usn-building-bases-1947'],
  'wikipedia-coconut-island': {
    title: 'Wikipedia, “Coconut Island (Hawaii)”',
    url: 'https://en.wikipedia.org/wiki/Coconut_Island_(Hawaii)',
    licence: 'CC BY-SA 4.0, quoted for its dates',
    note: '“In 1934–1936, Chris Holmes II ... doubled the original 12-acre (49,000 m2) island with coral rubble, sand, and earthen landfill”; today 28 acres',
  },
  'dlnr-boating-history-2016': {
    title: 'Hawaiʻi Department of Land and Natural Resources, “History of Recreational Boating In Hawaiʻi is Topic of 2017 State Historic Preservation Calendar” (14 December 2016)',
    url: 'https://dlnr.hawaii.gov/dobor/nr16-255b/',
    licence: 'State of Hawaiʻi publication, quoted for its dates',
    note: '“James W. Glover completed the windward Oʻahu project at Heʻeia Kea in 1950”; “between 1963-68 Heʻeia Kea also increased in size to accommodate more than just fishing vessels”',
  },
}
for (const [id, s] of Object.entries(DATES)) DATES[id] = { ...s, fetched: s.fetched || READ }

const ring = (pts) => (pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1] ? pts : [...pts, pts[0]])
const poly = (...rings) => ({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: rings.map(ring) } })
// the box a work is held to: [w, s, e, n]
const box = ([w, s, e, n]) => poly([[w, s], [e, s], [e, n], [w, n]])

// Where each work lies; its shape inside comes from the data
const REGIONS = {
  mokuOLoe: [-157.7935, 21.4295, -157.7835, 21.4380],
  heeiaKea: [-157.8125, 21.4405, -157.8045, 21.4462],
}

function stats(mask, grid) {
  let n = 0
  for (const v of mask) if (v) n++
  return { texels: n, km2: Math.round(((n * grid.metresPerTexel[0] * grid.metresPerTexel[1]) / 1e6) * 1000) / 1000 }
}

function median(a) {
  if (!a.length) return NaN
  const s = Float64Array.from(a).sort()
  return s[Math.floor(s.length / 2)]
}

export async function buildPatches({ dir, d, grid, land, metres, outDir, ledger, log }) {
  const p = districtPaths(dir, d.id)
  const { W, H } = grid
  const N = W * H
  const read = (f) => JSON.parse(readFileSync(f, 'utf8'))
  const fillFc = read(p.fill)
  const fill = coverage(fillFc.features, grid, 3)
  const enc = {
    dredged: read(p.enc).features.filter((f) => /Crashboat/.test(f.properties.OBJNAM || '')),
    seaplane: read(p.encLayer(ENC.layers.seaplane)).features,
    // the fairways within the south bay and along Mōkapu (the long fairway from the north is not read: see above)
    fairway: read(p.encLayer(ENC.layers.fairway)).features.filter((f) => {
      const cs = f.geometry.coordinates.flat(Infinity)
      return cs.every((v, k) => (k % 2 ? v < 21.457 : v > -157.802))
    }),
  }
  const zone = coverage([...enc.seaplane, ...enc.fairway, ...enc.dredged], grid, 3)
  const reefs = coverage(CHART.reefs.map((r) => poly(r)), grid, 3)
  const mokapuSea = coverage([poly([...CHART.mokapuCoast, ...CHART.mokapuClose])], grid, 3)
  const heeiaSea = coverage([poly([...CHART.heeiaKeaCoast, ...CHART.heeiaKeaClose])], grid, 3)
  const mokuOLoe = coverage([poly(CHART.mokuOLoe)], grid, 3)
  const inBox = (b) => coverage([box(b)], grid, 1)
  const water = new Uint8Array(N)
  for (let o = 0; o < N; o++) water[o] = land[o] ? 0 : 1

  // --- raise: the Navy's dredging in the bay
  let cut = new Uint8Array(N)
  for (let o = 0; o < N; o++) cut[o] = !land[o] && zone[o] >= 0.5 && reefs[o] >= 0.5 && metres[o] < CUT ? 1 : 0
  const opened = dilate(erode(cut, W, H, OPEN, 1), W, H, OPEN, 1)
  for (let o = 0; o < N; o++) cut[o] = cut[o] && opened[o] ? 1 : 0
  // the reef it is laid back at: the tops of the reefs of 1882 that still stand round the south bay
  const tops = []
  const near = dilate(cut, W, H, Math.round(800 / grid.metresPerTexel[0]), 1)
  for (let o = 0; o < N; o++) if (near[o] && !land[o] && reefs[o] >= 0.5 && zone[o] < 0.5 && metres[o] >= CUT) tops.push(metres[o])
  const reefTop = Math.min(-1, Math.round(median(tops) * 4) / 4)

  // --- raise: the harbour at Heʻeia Kea, dug into the shore flat
  const hkBox = inBox(REGIONS.heeiaKea)
  const harbour = new Uint8Array(N)
  const flat = []
  for (let o = 0; o < N; o++) {
    if (land[o] || hkBox[o] < 0.5 || reefs[o] < 0.5 || heeiaSea[o] < 0.5) continue
    if (metres[o] < CUT_FLAT) harbour[o] = 1
    else flat.push(metres[o])
  }
  const flatTop = Math.min(-1, Math.round(median(flat) * 4) / 4)

  // --- lower: the air station's fill on the 1882 sea, where the fill unit maps
  // made ground, with the low rim between it and today's water the polygons stop short of
  const fillOn = new Uint8Array(N)
  for (let o = 0; o < N; o++) fillOn[o] = fill[o] >= 0.5 ? 1 : 0
  const nearFill = dilate(fillOn, W, H, 1, 1)
  const nearWater = dilate(water, W, H, 1, 1)
  const station = new Uint8Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o] || mokapuSea[o] < 0.5 || metres[o] <= -1) continue
    if (fillOn[o] || (nearFill[o] && nearWater[o] && metres[o] < 5)) station[o] = 1
  }

  // --- lower: Holmes's fill round Moku o Loʻe
  const mlBox = inBox(REGIONS.mokuOLoe)
  const island = new Uint8Array(N)
  for (let o = 0; o < N; o++) if (land[o] && mlBox[o] >= 0.5 && mokuOLoe[o] < 0.5 && metres[o] > -1) island[o] = 1

  // --- lower: the harbour's moles and yard at Heʻeia Kea
  const moles = new Uint8Array(N)
  for (let o = 0; o < N; o++) if (land[o] && hkBox[o] >= 0.5 && heeiaSea[o] >= 0.5 && metres[o] > -1) moles[o] = 1

  const works = [
    {
      id: 'kaneohe-bay-dredging',
      name: 'the seaplane runways, turning basin and channels of the Kāneʻohe naval air station',
      kind: 'raise',
      depth: reefTop,
      until: 1943,
      mask: cut,
      source: 'Jackson’s chart of 1882, registered; NOAA’s seaplane landing area and fairways; the CUDEM',
      dates: ['mokapu-1965', 'usn-building-bases-1947'],
      note:
        `the reefs and reef flats Jackson’s survey of August 1882 draws inside today’s seaplane landing area, the fairways to the air station and the ` +
        `Crashboat Channel, where today’s sea floor lies deeper than ${-CUT} m: cleared for the seaplane runways, the turning basin and the channels, ` +
        `laid back at ${-reefTop} m deep, where the reefs of 1882 that still stand round the south bay are (the median of their tops; the pack holds no sea shallower). Dredging began with the dredge B. F. ` +
        'Dillingham on 27 September 1939 and went on for three years (11,000,000 cubic yards) “until 1943”; given 1943. The natural lagoon between the ' +
        'reefs, which Jackson sounds at 6 to 8 fathoms, stays as it is; the chart’s registration (about 40 m) leaves the cut a texel or two short of ' +
        'or past the old reef edges',
    },
    {
      id: 'mokapu-air-station-fill',
      name: 'the air station’s fill on Mōkapu',
      kind: 'lower',
      depth: -1,
      until: 1943,
      mask: station,
      source: 'the fill unit, cut with the 1882 shore of Mōkapu',
      dates: ['mokapu-1965', 'usn-building-bases-1947'],
      note:
        'land today that the geologic map calls fill and Jackson’s survey of 1882 shows as sea or reef flat: the airfield’s ground west of Pali Kilo ' +
        'and the strip along Mōkapu’s south shore from the seaplane ramps east to the bay side of Nuʻupia, made with the spoil of the dredging (162 ' +
        'acres west of the runway and about 118 along the south shore, 280 in all, “until 1943”). The 1927 and 1938 maps draw the same shore within ' +
        'about 30 m, so the fill is the Navy’s. Fill over the ponds of 1882 (the causeways of Nuʻupia, Halekou and Kaluapuhi) stays land, as the ' +
        'features draw the ponds',
    },
    {
      id: 'moku-o-loe-fill',
      name: 'Holmes’s fill round Moku o Loʻe',
      kind: 'lower',
      depth: -1,
      until: 1936,
      mask: island,
      source: 'Moku o Loʻe’s outline on Jackson’s chart of 1882',
      dates: ['wikipedia-coconut-island'],
      note:
        'today’s land of Moku o Loʻe outside the island Jackson draws in 1882, which the 1927 map draws the same: the coral, sand and earth Chris Holmes ' +
        'laid on its reef in 1934–36, doubling its 12 acres, and the later walls and fill of the Navy’s rest station and the marine laboratory, which ' +
        'the sources read do not separate from his; given 1936. The fill unit does not map it',
    },
    {
      id: 'heeia-kea-harbour',
      name: 'the small-boat harbour at Heʻeia Kea',
      kind: 'raise',
      depth: flatTop,
      until: 1950,
      mask: harbour,
      source: 'the shore flat on Jackson’s chart of 1882; the CUDEM',
      dates: ['dlnr-boating-history-2016'],
      note:
        `the basin and channel of the harbour at Lae o Kealohi, dug into the shore flat Jackson draws dry at low water in 1882, where today’s floor ` +
        `lies deeper than ${-CUT_FLAT} m: laid back at ${-flatTop} m deep, the median of the flat round it. “Completed ... in 1950”; its enlargement of ` +
        '1963–68 is not separated',
    },
    {
      id: 'heeia-kea-fill',
      name: 'the moles and yard of the harbour at Heʻeia Kea',
      kind: 'lower',
      depth: -1,
      until: 1950,
      mask: moles,
      source: 'the 1882 shore at Lae o Kealohi',
      dates: ['dlnr-boating-history-2016'],
      note:
        'today’s land at Lae o Kealohi seaward of the shore Jackson draws in 1882 (the 1927 map draws the same point): the harbour’s moles and yard, ' +
        '“completed ... in 1950”, with the enlargement of 1963–68 not separated. The fill unit does not map it',
    },
  ]

  const entries = []
  const sources = []
  for (const w of works) {
    const s = stats(w.mask, grid)
    log(`  patch ${w.id} (${w.kind}, until ${w.until}, to ${w.depth} m): ${s.texels} texels, ${s.km2} km²`)
    if (!s.texels) throw new Error(`${w.id}: empty`)
    const grey = new Uint8Array(N)
    for (let o = 0; o < N; o++) grey[o] = w.mask[o] ? 255 : 0
    writeGreyPNG(join(outDir, `patch-${w.id}.png`), W, H, grey)
    entries.push({
      id: w.id,
      name: w.name,
      until: w.until,
      kind: w.kind,
      depth: w.depth,
      file: `${d.id}/patch-${w.id}.png`,
      source: w.source,
      dates: w.dates,
      note: w.note,
      stats: s,
    })
  }

  // --- the 1882 shore and reefs, as a supporting file
  const features = [
    { kind: 'shoreline', name: 'Mōkapu', coords: CHART.mokapuCoast, note: 'the shore of Mōkapu from Pali Kilo round the low point to the bay side of Nuʻupia; the sea is on its west and south' },
    { kind: 'shoreline', name: 'Lae o Kealohi', coords: CHART.heeiaKeaCoast, note: 'the shore at Heʻeia Kea; the sea is on its east' },
  ].map((f) => ({
    type: 'Feature',
    properties: { kind: f.kind, name: f.name, year: 1882, precision: 'mapped', sources: ['kipuka-rm-1140', 'kipuka-rm-1848'], note: f.note },
    geometry: { type: 'LineString', coordinates: f.coords },
  }))
  features.push({
    type: 'Feature',
    properties: { kind: 'islet', name: 'Moku o Loʻe', year: 1882, precision: 'mapped', sources: ['kipuka-rm-1140', 'kipuka-rm-1848'] },
    geometry: { type: 'Polygon', coordinates: [ring(CHART.mokuOLoe)] },
  })
  for (const r of CHART.reefs) {
    features.push({
      type: 'Feature',
      properties: { kind: 'enclosed', name: null, year: 1882, precision: 'mapped', sources: ['kipuka-rm-1140', 'kipuka-rm-1848'] },
      geometry: { type: 'Polygon', coordinates: [ring(r)] },
    })
  }
  writeFileSync(join(outDir, 'shoreline-1882.geojson'), JSON.stringify({ type: 'FeatureCollection', features }) + '\n')
  const files = [
    {
      file: `${d.id}/shoreline-1882.geojson`,
      kind: 'shoreline',
      year: 1882,
      note:
        `Jackson’s survey of August 1882 as registered here (affine on eight points, ${CHART.registration.rmsMetres} m rms): the shores of Mōkapu and ` +
        `Lae o Kealohi (LineStrings), Moku o Loʻe (a Polygon), and the ${CHART.reefs.length} shapes the chart encloses (Polygons, kind “enclosed”: ` +
        'its reefs and flats, and the shore where they join it, cut to the box round the dredged zone) that meet that zone, in lon/lat; what the patches are cut with',
    },
  ]

  // --- provenance
  const ex = mapExport(grid, d.mapPixel)
  const mapSource = (m, use) => ({
    id: m.id,
    title: m.title,
    url: m.service,
    fetched: ledger.get(p.map(m.year))?.fetched,
    licence: m.licence,
    note: `exported over the box at ${ex.pixel} m in EPSG:${ex.epsg} (${ex.size.join('x')} px); ${use}`,
  })
  const registered = (rm, use) => {
    const m = REGISTERED_MAPS[rm]
    return { id: m.id, title: m.title, url: m.url, fetched: ledger.get(p.registered(rm))?.fetched, licence: m.licence, note: use }
  }
  const fillLayer = read(p.fillLayer)
  const encFiles = [p.enc, p.encLayer(ENC.layers.seaplane), p.encLayer(ENC.layers.fairway)]
  sources.push(
    {
      id: FILL.id,
      title: FILL.title,
      url: FILL.service,
      query: FILL.where,
      fetched: ledger.get(p.fill)?.fetched,
      licence: FILL.licence,
      ...(fillLayer.copyrightText ? { credit: String(fillLayer.copyrightText).replace(/\s+/g, ' ').trim().slice(0, 300) } : {}),
      metadata: FILL.metadata,
      note:
        `${fillFc.features.length} polygons in and around the box; a texel counts as fill when at least half of it is. Mapped by Sherrod and others ` +
        '(2007) from the earlier Oʻahu geologic maps; in the district it holds the air station’s ground on Mōkapu, the causeways across the Nuʻupia ponds, ' +
        'fill over the ponds of Kāneʻohe’s shore, two small pieces at Kualoa and one inland at Kāneʻohe; only the first lies on the sea of 1882. In the ' +
        'south-west corner of the box it holds Honolulu’s waterfront, whose works are the patch bake’s (bake-patches.mjs), not this district’s',
    },
    registered(1140, 'read at full resolution (17007x12600 px, 300 dpi, a blueprint): its title, scale and soundings note, and its reefs against the reduction’s'),
    registered(
      1848,
      `the sheet the reefs and shores were read from: 14384x11782 px at 400 dpi, ${CHART.registration.metresPerPixel} m a pixel on the ground; ` +
        `registered by an affine fit on ${CHART.registration.points.length} points (${CHART.registration.points.map((q) => `${q.name} ${q.residualMetres} m`).join(', ')})`,
    ),
    registered(1345, 'read at overview: Kailua Bay in 1884, the beach, Kaʻelepulu drawn as a fishpond, Popoia and the Mokulua islands; not registered here. The shore of Kailua was compared on the State’s 1902 and 1938 sheets instead'),
    registered(1019, 'read at overview: the coast from Kailua to Maunalua in 1884; not registered here. The shore of Waimānalo was compared on the State’s 1902 and 1938 sheets instead'),
    mapSource(SURVEY_MAPS[1881], 'read over the bay: it draws the shore of Mōkapu and Kāneʻohe at 1:60,000 and no reefs, so Jackson’s survey of the next year stands for it'),
    mapSource(SURVEY_MAPS[1902], 'read over the bay, Kailua and Waimānalo: it copies Jackson’s reefs and draws the same Mōkapu shore within its registration (100–200 m); the shores of Kailua, Lanikai and Waimānalo lie on today’s within about 30 m, so they take no patch'),
    mapSource(SURVEY_MAPS[1927], 'the shore before the war, best registered of the sheets (within about 20 m at Pyramid Rock, Pōhākea and Heʻeia’s pond): Mōkapu, Moku o Loʻe and Lae o Kealohi lie where Jackson draws them, within about 30 m'),
    mapSource(SURVEY_MAPS[1938], 'read over the bay, Kailua and Waimānalo: the same shores as 1927 at Mōkapu, Moku o Loʻe already grown; Kailua, Lanikai and Waimānalo on today’s shore within about 30 m (the pier at Makapuʻu is later, and too small to patch)'),
    {
      id: ENC.id,
      title: ENC.title,
      url: ENC.service,
      fetched: encFiles.map((f) => ledger.get(f)?.fetched).filter(Boolean).sort().pop(),
      licence: ENC.licence,
      note:
        'the zone the bay’s dredging is looked for in: the Sea_Plane_Landing_Area over the south bay, the fairways within the south bay and along ' +
        'Mōkapu (one “Dredged to 15 feet”), and the Crashboat Channel (dredged to 2.4 m); the Heʻeia Kea harbour’s dredged areas (1.9 and 2.1 m) ' +
        'confirm its basin',
    },
  )
  for (const [id, s] of Object.entries(DATES)) sources.push({ id, title: s.title, url: s.url, fetched: s.fetched, licence: s.licence, note: s.note })

  log(`  the reefs of 1882 stand at ${reefTop} m (median of ${tops.length} texels), Heʻeia Kea’s flat at ${flatTop} m (${flat.length})`)
  return { entries, files, sources, stats: {} }
}
