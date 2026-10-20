// The shoreline patches of a district (DATA.md, "District packs"): where a
// texel that is land today was sea or reef flat in a keyframe's year.
//
// Two sources, as the State serves them. The geologic map's fill unit says
// where the ground is made, not when, nor what lay under it: on the
// Honolulu waterfront it covers both the reef flat (Sand Island, Kakaʻako
// makai, Ala Moana, the harbour's piers) and the fishponds, salt pans and
// marsh behind the old shore (Kewalo, the Waikīkī wetland under the Ala Wai,
// the Kalihi ponds), which were land in 1795 and are drawn by features.json.
// The Government Survey map of 1881 shows the shore before most of the
// filling; its line separates the two. So a patch is
//
//   land today, and fill (at least half the texel), and seaward of the 1881 shore
//
// The 1881 shore was traced by hand from the State's georeferenced scan
// (exported at 5 m in its own NAD83 / UTM zone 4N), following the inked
// coastline with the stippled reef flat on its seaward side, between the
// Moanalua shore and the south edge of the box at Waikīkī, at about 10 to
// 25 m a vertex, with the islets of Mokauea and Quarantine Island (the core
// of today's Sand Island) as rings. Colour does not separate sea from land on
// this sheet (the paper under the reef and under the land differ by a few
// per cent in saturation, and the stipple is ink like the hachures), so the
// trace is by eye, not classified. The State's georeferencing was kept: the
// lidar's contours of Puowaina (Punchbowl) fall on the 1881 crater within
// about 25 m, and today's Waikīkī shore, which barely moved, within 25–75 m
// of the 1881 one; Mokauea is about 100 m east of where the lidar has it.
//
// The 1899 sheet was read against it: allowing for its own misregistration
// (about 100 m north of the lidar at Puowaina, 200 m west at Quarantine
// Island), it shows the same waterfront at this scale. So the sources do not
// separate an 1850 shore from an 1896 one; the contact and kingdom patches
// are the same mask, the 1881 shore, kept as two files so that the app's
// rule (a patch holds for years before its `until`) covers 1850–1900 too,
// where the big fills had not begun. What the 1881 shore cannot show is the
// made ground it already includes at the harbour front (the waterfront east
// of the inner harbour stands where today's piers begin); nothing open here
// dates it, so the contact patch does not guess at it.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { coverage } from './layers-raster.mjs'
import { writeGreyPNG } from './png.mjs'
import { utm4Inverse } from './district-raster.mjs'
import { FILL, SURVEY_MAPS, districtPaths, mapExport } from './district-sources.mjs'

// UTM zone 4N metres on the State's 1881 scan, west to south-east; the first
// vertex lies west of the box, in Keʻehi lagoon, and the last just past its
// south edge. North of the first stretch the sheet draws Moanalua's walled
// ponds and marsh, not open water, so the fill there stays land.
export const SHORE_1881 = {
  nuuanu: {
    coast: [[612702.5, 2359047.5], [614002.5, 2359047.5], [614452.5, 2358997.5], [614677.5, 2358847.5], [614692.5, 2358597.5], [614717.5, 2358347.5], [614787.5, 2358182.5], [614867.5, 2358012.5], [614937.5, 2357847.5], [614987.5, 2357647.5], [615027.5, 2357482.5], [615052.5, 2357382.5], [615202.5, 2357482.5], [615367.5, 2357507.5], [615537.5, 2357532.5], [615702.5, 2357562.5], [615802.5, 2357587.5], [615952.5, 2357672.5], [616202.5, 2357747.5], [616452.5, 2357737.5], [616652.5, 2357622.5], [616752.5, 2357447.5], [616762.5, 2357247.5], [616802.5, 2357097.5], [616867.5, 2357072.5], [617037.5, 2357097.5], [617202.5, 2357112.5], [617367.5, 2357162.5], [617487.5, 2357212.5], [617587.5, 2357247.5], [617687.5, 2357232.5], [617702.5, 2357082.5], [617702.5, 2356832.5], [617692.5, 2356582.5], [617687.5, 2356497.5], [617702.5, 2356247.5], [617662.5, 2355997.5], [617587.5, 2355797.5], [617602.5, 2355597.5], [617727.5, 2355397.5], [617902.5, 2355247.5], [618127.5, 2355147.5], [618327.5, 2355047.5], [618552.5, 2354947.5], [618752.5, 2354847.5], [619002.5, 2354772.5], [619252.5, 2354722.5], [619452.5, 2354647.5], [619702.5, 2354537.5], [619952.5, 2354447.5], [620152.5, 2354412.5], [620277.5, 2354322.5], [620402.5, 2354172.5], [620527.5, 2353997.5], [620652.5, 2353797.5], [620777.5, 2353572.5], [620902.5, 2353372.5], [621152.5, 2353172.5], [621452.5, 2353072.5], [621702.5, 2352997.5], [621852.5, 2352872.5], [621977.5, 2352672.5], [622062.5, 2352447.5], [622102.5, 2352197.5], [622112.5, 2351697.5]],
    islands: {
      'Quarantine Island': [[615827.5, 2356497.5], [615902.5, 2356622.5], [616052.5, 2356687.5], [616202.5, 2356697.5], [616302.5, 2356622.5], [616377.5, 2356497.5], [616427.5, 2356347.5], [616352.5, 2356257.5], [616202.5, 2356272.5], [616052.5, 2356322.5], [615902.5, 2356372.5], [615827.5, 2356447.5]],
      'Mokauea (north)': [[614952.5, 2356857.5], [615012.5, 2356907.5], [615102.5, 2356912.5], [615162.5, 2356872.5], [615142.5, 2356807.5], [615042.5, 2356792.5], [614962.5, 2356817.5]],
      'Mokauea (south)': [[614977.5, 2356637.5], [615042.5, 2356687.5], [615127.5, 2356682.5], [615177.5, 2356637.5], [615152.5, 2356577.5], [615052.5, 2356567.5], [614987.5, 2356592.5]],
    },
    // the sea side is closed far outside the box, to the south-west
    close: [[622112.5, 2347000], [609000, 2347000], [609000, 2359047.5]],
  },
}

const r7 = (v) => Math.round(v * 1e7) / 1e7
const toLonLat = (pts) => pts.map(([E, N]) => utm4Inverse(E, N).map(r7))
const closeRing = (r) => [...r, r[0]]

/** Drop the vertices at either end of a line that lie more than `pad` degrees outside the box. */
function trimToBox(line, [w, s, e, n], pad = 0.005) {
  const inside = ([lon, lat]) => lon >= w - pad && lon <= e + pad && lat >= s - pad && lat <= n + pad
  let a = 0
  let b = line.length
  while (a < b && !inside(line[a])) a++
  while (b > a && !inside(line[b - 1])) b--
  return line.slice(a, b)
}

/** The 1881 sea as a GeoJSON polygon (lon/lat): seaward of the coast, less the islets. */
function sea1881(shore) {
  const outer = closeRing(toLonLat([...shore.coast, ...shore.close]))
  const holes = Object.values(shore.islands).map((r) => closeRing(toLonLat(r)))
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [outer, ...holes] } }
}

export async function buildPatches({ dir, d, grid, land, outDir, ledger, log }) {
  const shore = SHORE_1881[d.id]
  const p = districtPaths(dir, d.id)
  const { W, H } = grid
  const N = W * H
  const fillFc = JSON.parse(readFileSync(p.fill, 'utf8'))
  const fill = coverage(fillFc.features, grid, 3)
  let fillLand = 0
  for (let o = 0; o < N; o++) if (land[o] && fill[o] >= 0.5) fillLand++
  const sea = shore ? coverage([sea1881(shore)], grid, 2) : null
  const mask = new Uint8Array(N)
  let on = 0
  for (let o = 0; o < N; o++) {
    if (land[o] && fill[o] >= 0.5 && (!sea || sea[o] >= 0.5)) {
      mask[o] = 255
      on++
    }
  }
  const km2 = (n) => (n * grid.metresPerTexel[0] * grid.metresPerTexel[1]) / 1e6
  log(`  patch: ${on} texels (${km2(on).toFixed(2)} km²) of ${fillLand} texels of fill on land (${km2(fillLand).toFixed(2)} km²)${sea ? '; the rest was land, pond or marsh in 1881' : ''}`)
  writeGreyPNG(join(outDir, 'patch-contact.png'), W, H, mask)
  writeGreyPNG(join(outDir, 'patch-kingdom.png'), W, H, mask)

  const files = []
  if (shore) {
    const features = [
      {
        type: 'Feature',
        properties: { kind: 'shoreline', name: null, year: 1881, precision: 'mapped', sources: [SURVEY_MAPS[1881].id], note: 'the coast on the 1881 Government Survey map, traced by hand from the State GIS scan; the sea is on its south-west side' },
        geometry: { type: 'LineString', coordinates: trimToBox(toLonLat(shore.coast), grid.bounds) },
      },
      ...Object.entries(shore.islands).map(([name, ring]) => ({
        type: 'Feature',
        properties: { kind: 'islet', name, year: 1881, precision: 'mapped', sources: [SURVEY_MAPS[1881].id] },
        geometry: { type: 'Polygon', coordinates: [closeRing(toLonLat(ring))] },
      })),
    ]
    writeFileSync(join(outDir, 'shoreline-1881.geojson'), JSON.stringify({ type: 'FeatureCollection', features }) + '\n')
    files.push({
      file: `${d.id}/shoreline-1881.geojson`,
      kind: 'shoreline',
      year: 1881,
      note: 'the 1881 coast (LineString, sea to its south-west) and its islets (Polygons), in lon/lat; the line both patches are cut with',
    })
  }

  const ex = mapExport(grid)
  const mapSource = (m, use) => ({
    id: m.id,
    title: m.title,
    url: m.service,
    fetched: ledger.get(p.map(m.year))?.fetched,
    licence: m.licence,
    note: `exported over the box at ${ex.pixel} m in EPSG:${ex.epsg} (${ex.size.join('x')} px); ${use}`,
  })
  const fillLayer = JSON.parse(readFileSync(p.fillLayer, 'utf8'))
  const sources = [
    {
      id: FILL.id,
      title: FILL.title,
      url: FILL.service,
      query: FILL.where,
      fetched: ledger.get(p.fill)?.fetched,
      licence: FILL.licence,
      ...(fillLayer.copyrightText ? { credit: String(fillLayer.copyrightText).replace(/\s+/g, ' ').trim().slice(0, 300) } : {}),
      metadata: FILL.metadata,
      note: `${fillFc.features.length} polygons in and around the box; a texel counts as fill when at least half of it is. ${FILL.note}`,
    },
    mapSource(SURVEY_MAPS[1881], 'the shore the patches are cut with, traced by hand (shoreline-1881.geojson); its georeferencing as the State serves it, within about 25 m at Puowaina'),
    mapSource(SURVEY_MAPS[1899], 'read against the 1881 shore: allowing for its misregistration (about 100 m at Puowaina), the same waterfront, so it adds no separate kingdom shore'),
  ]
  const why =
    'land today that the geologic map calls fill and the 1881 Government Survey map shows as sea or reef flat: Sand Island (but for Quarantine Island), ' +
    'the reef under the piers of the inner harbour and Kapālama, Kakaʻako makai and the Kewalo waterfront, Ala Moana and Magic Island, and the made ground ' +
    'at Kālia by the Ala Wai boat harbour. Fill the 1881 map shows as land (the Kewalo ponds and Kakaʻako salt pans, the Waikīkī wetland under the Ala Wai, ' +
    'the Kalihi and Moanalua ponds) stays land'
  const entries = [
    { keyframe: 'contact', until: 1850, file: `${d.id}/patch-contact.png`, source: 'the fill unit, cut with the 1881 shore', note: `${why}. The 1881 shore is the earliest surveyed; at the harbour front it already includes made ground of unknown date` },
    { keyframe: 'kingdom', until: 1900, file: `${d.id}/patch-kingdom.png`, source: 'the fill unit, cut with the 1881 shore', note: `${why}. The same mask as the contact patch: the 1899 sheet shows the same waterfront within its registration, so the filling the patch covers came after it` },
  ]
  return { entries, files, sources, stats: { texels: on, km2: km2(on), fillOnLandKm2: km2(fillLand) } }
}
