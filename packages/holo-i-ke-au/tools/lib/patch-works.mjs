// The harbour works the patches undo (DATA.md, "Patches, on any pack"), as
// traced and dated by hand: what was cut or filled, where, when, and on what
// authority. Everything here is data; tools/lib/patch-bake.mjs turns it into
// masks, tools/lib/patch-check.mjs reads the masks back.
//
// Three kinds of shape, all in lon/lat (WGS 84; the State's scans are on
// NAD83, within a metre of it here):
//
// - PASSAGES: the natural channels through the reef as the 1881 Government
//   Survey sheet draws them. No raise patch may touch them; they are written
//   out to public/data/patches/passages.geojson so the check (and anyone
//   else) can hold the masks to them.
// - BARS: the shoal at the seaward end of a passage, which the first cuts
//   went through. A raise there is held to the depth the surveys give for the
//   bar, never shallower: the bar comes back, not a reef.
// - Work zones: where one work lies, drawn generously round it on today's sea
//   floor (the NOAA CUDEM) or today's land. The zone only says which work a
//   texel belongs to and when; the shape inside it comes from the data (the
//   dredged floor, today's coast, the fill unit, the 1881 shore).
//
// How each was traced. The State's georeferenced scans (Historic_Maps
// ImageServer, Oahu_1881 and Oahu_1938) were exported in EPSG:4326 at
// 0.00003–0.00005° a pixel with today's coast and a CUDEM depth contour drawn
// over them and a 0.001° grid (`bake-patches.mjs --sheets DIR` draws the same
// sheets again, with these shapes on them), and the vertices read off by eye.
// The 1881 sheet's registration, checked against the lidar coast where the
// shore has not moved (the lochs of Pearl Harbor, Puʻuloa beach, Waikīkī),
// is within about 25–50 m; the 1938 sheet's within about 50 m at Sand Island.
// Work zones were drawn on the CUDEM alone, at 0.00004°.

import { utm4Inverse } from './district-raster.mjs'
import { SHORE_1881 } from './district-maps.mjs'
import { KX, KZ } from './geo.mjs'

// ---------------------------------------------------------------------------
// Sources of the dates: the harbours' own histories, read on the day given.
// (The data sources, which the bake downloads, are in patch-sources.mjs.)

const READ = '2026-10-21'
export const HISTORIES = {
  'usn-pearl-harbor-history': {
    title: 'U.S. Navy, Pearl Harbor: Its Origin and Administrative History Through World War II, chs. 2–3 (HyperWar transcription)',
    url: 'https://www.ibiblio.org/hyperwar/USN/fac/PH/USN-Hawaii-3.html',
    licence: 'public domain (U.S. Navy)',
    note:
      'ch. 2 quotes Peter Corney (1818): “not more than 15 feet of water on the bar or reef at high water and inside from 6 to 18 fathoms”. ' +
      'ch. 3: the 1901 appropriation for “the improvement of the channel to the Lochs”; dredging of “the coral reef that blocked Pearl Harbor” let the ' +
      'gunboat Petrel reach the Main Loch in January 1905; the Act of 13 May 1908 for “the enlargement and dredging of the Pearl Harbor channel and lochs”; ' +
      'and at Honolulu, 1901 to 1908, “The harbor was dredged and the channel enlarged to accommodate larger ships”',
  },
  'iooh-pearl-harbor-1911': {
    title: 'Images of Old Hawaiʻi, “1st Big Ships into Pearl Harbor” (quoting Thrum’s Hawaiian Annual for 1912)',
    url: 'https://imagesofoldhawaii.com/1st-big-ships-into-pearl-harbor/',
    licence: 'quoted for its dates; text © its author',
    note: 'dredging of the entry channel began in 1902; “Upon the completion of the dredging operations of Pearl Harbor bar, December 14, 1911” the cruiser California entered',
  },
  'usn-building-bases-1947': {
    title: 'Building the Navy’s Bases in World War II, vol. II, ch. XXII, Hawaiian Area (Bureau of Yards and Docks, 1947; HyperWar transcription)',
    url: 'https://www.ibiblio.org/hyperwar/USN/Building_Bases/bases-22.html',
    licence: 'public domain (U.S. Navy)',
    note:
      'Pearl Harbor: dredging for a turning channel round Ford Island from May 1940, the lochs deepened for moorings, Kuahua extended with the spoil from ' +
      '47 acres to a 116-acre peninsula, Ford Island enlarged by seven acres for its T-wharves. Keʻehi: a dredge brought into the lagoon in February 1943 ' +
      'for three seaplane runways “1,000 feet wide by three miles long”, the spoil raising the land to ten feet. Kāneʻohe Bay: from September 1939, three ' +
      'years of dredging for the seaplane runways (11,000,000 cubic yards)',
  },
  'hawaii-dot-hnl-history': {
    title: 'Hawaiʻi Department of Transportation, Airports Division, Honolulu International Airport: the first 80 years, part 2 (1944–1959)',
    url: 'https://aviation.hawaii.gov/wp-content/uploads/2015/03/HNL-first80yrs-2.pdf',
    licence: 'State of Hawaiʻi publication, quoted for its dates',
    note:
      'Naval Air Station Honolulu “was operational in late 1943 but was commissioned on January 1, 1944”; full operation for land and sea planes from ' +
      '1 April 1944; in 1946 “three seaplane runways, each 1,000 feet wide with an average length of approximately 2.7 miles”',
  },
  'hawaii-dot-reef-runway': {
    title: 'Hawaiʻi Department of Transportation, Airports Division, Honolulu International Airport history page',
    url: 'https://hidot.hawaii.gov/airports/?p=91',
    licence: 'State of Hawaiʻi publication, quoted for its dates',
    note: '“In 1977, Runway 8R/26L or the Reef Runway was constructed as the fourth runway for Honolulu International Airport”',
  },
  'iooh-honolulu-harbor': {
    title: 'Images of Old Hawaiʻi, “Evolution of Honolulu Harbor”',
    url: 'https://imagesofoldhawaii.com/evolution-of-honolulu-harbor/',
    licence: 'quoted for its dates; text © its author',
    note:
      '“In 1890-92, a channel 200-feet wide by 30-feet deep was dredged for about 1,000-feet through the sand bar”, which had limited the depth to as ' +
      'little as 18 feet; after annexation the harbour was dredged with federal funds and the spoil built Sand Island; after 1914 the Reserved Channel ' +
      'to Kapālama Basin was dredged; Pier 35 in Kapālama Basin was built in 1931',
  },
  'living-new-deal-honolulu-harbor': {
    title: 'The Living New Deal, “Honolulu Harbor Improvements – Honolulu HI” (citing the Annual Report of the Chief of Engineers, 1935)',
    url: 'https://livingnewdeal.org/sites/honolulu-harbor-improvements-honolulu-ak/',
    licence: 'quoted for its dates; text © its author',
    note: 'in 1934–35 the Corps of Engineers with PWA funds deepened the harbour basin to 35 feet and dredged the channel connecting Honolulu Harbor and Kapālama Basin',
  },
  'iooh-ala-wai-kewalo': {
    title: 'Images of Old Hawaiʻi, posts tagged “Ala Wai Boat Harbor” (Ala Wai, Kewalo, Ala Moana, Magic Island)',
    url: 'https://imagesofoldhawaii.com/tag/ala-wai-boat-harbor/',
    licence: 'quoted for its dates; text © its author',
    note:
      'the Ala Wai Drainage Canal “begun in 1921 and completed in 1928” led to “the draining and filling in of the ponds and irrigated fields of Waikīkī”; ' +
      '“Dredging of the Kewalo Channel began in 1924”, Kewalo Basin built in the 1920s; “In 1928, a channel was dredged through the coral reef to connect ' +
      'the Ala Wai Boat Harbor and the Kewalo Basin”; Ala Moana Park on dredged coral “completed in 1934”; “in 1951, a channel was dredged directly out to ' +
      'sea” from the boat harbour; Magic Island, “a 30-acre peninsula”, built in 1964',
  },
  'wikipedia-ford-island': {
    title: 'Wikipedia, “Ford Island”',
    url: 'https://en.wikipedia.org/wiki/Ford_Island',
    licence: 'CC BY-SA 4.0, quoted for its dates',
    note: 'about 334 acres when surveyed in 1825; the Navy enlarged it during the 1930s to about 441 acres with fill dredged from Pearl Harbor',
  },
}
for (const s of Object.values(HISTORIES)) s.fetched = READ

// ---------------------------------------------------------------------------
// Geometry helpers

const r6 = (v) => Math.round(v * 1e6) / 1e6
const close = (ring) => (ring.length && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) ? [...ring, ring[0]] : ring)
export const polygon = (...rings) => ({ type: 'Polygon', coordinates: rings.map(close) })
export const feature = (geometry, properties = {}) => ({ type: 'Feature', properties, geometry })

/** A strip `half` metres either side of a polyline, as a polygon (mitred, for gentle bends); `ends` carries it past the last points by `half`. */
export function corridor(points, half, ends = true) {
  const L = []
  const R = []
  for (let k = 0; k < points.length; k++) {
    const a = points[Math.max(0, k - 1)]
    const b = points[Math.min(points.length - 1, k + 1)]
    const dx = (b[0] - a[0]) * KX
    const dz = (b[1] - a[1]) * KZ
    const len = Math.hypot(dx, dz) || 1
    const nx = -dz / len
    const nz = dx / len
    const [lon, lat] = points[k]
    // the ends are carried on by `half` too, so a corridor reaches past its last point
    const ex = !ends ? 0 : k === 0 ? -dx / len : k === points.length - 1 ? dx / len : 0
    const ez = !ends ? 0 : k === 0 ? -dz / len : k === points.length - 1 ? dz / len : 0
    L.push([r6(lon + ((nx + ex) * half) / KX), r6(lat + ((nz + ez) * half) / KZ)])
    R.push([r6(lon + ((-nx + ex) * half) / KX), r6(lat + ((-nz + ez) * half) / KZ)])
  }
  return polygon([...L, ...R.reverse()])
}

// ---------------------------------------------------------------------------
// The passages, from the 1881 sheet

export const PASSAGES = [
  {
    id: 'pearl-harbor-entrance-1881',
    name: 'the Pearl Harbor entrance (Puʻuloa), inside the bar',
    // The channel the 1881 sheet bounds with dotted lines, from the narrows
    // between Puʻuloa and Waiʻaho (soundings of 21 and 20, fathoms by the
    // 1899 sheet's legend) south to where its two lines meet over 5 and 4,
    // short of the bar. It hugs the east side near the mouth, where today's
    // channel was straightened along the west.
    geometry: polygon([[-157.97155, 21.3299], [-157.96765, 21.3299], [-157.96714, 21.32885], [-157.96645, 21.32816], [-157.96606, 21.3266], [-157.96585, 21.3248], [-157.96585, 21.3224], [-157.96564, 21.3206], [-157.96534, 21.3185], [-157.96486, 21.3167], [-157.96396, 21.31445], [-157.963, 21.31265], [-157.96195, 21.3113], [-157.9609, 21.31004], [-157.96, 21.30896], [-157.95991, 21.3068], [-157.95991, 21.305], [-157.9603, 21.30365], [-157.96075, 21.30305], [-157.96135, 21.3035], [-157.9618, 21.305], [-157.9624, 21.30635], [-157.96321, 21.308], [-157.96414, 21.30956], [-157.9651, 21.31124], [-157.96624, 21.31325], [-157.96744, 21.31514], [-157.96846, 21.31685], [-157.969, 21.3182], [-157.96885, 21.31955], [-157.96834, 21.32114], [-157.96786, 21.3227], [-157.9678, 21.3248], [-157.96798, 21.3266], [-157.96822, 21.32765], [-157.9705, 21.32765]]),
    source: 'hawaii-gis-oahu-1881',
    note: 'the dotted channel of the 1881 sheet from the narrows to its south end above the bar; traced at 0.00003° a pixel',
  },
  {
    id: 'mamala-honolulu-1881',
    name: 'Māmala, the passage into Honolulu Harbour (Kou)',
    // The harbour the 1881 sheet tints and sounds (3½ to 5½ fathoms) off the
    // town, and the channel south from it between the stippled reef of
    // Kahololoa on the west and the Kakaʻako reef on the east (soundings of
    // 6 and 6½), to the edge of the bar by the spar buoy.
    geometry: polygon([[-157.869, 21.313], [-157.8666, 21.31345], [-157.8651, 21.313], [-157.8648, 21.3106], [-157.8654, 21.3082], [-157.8657, 21.3052], [-157.8651, 21.3028], [-157.8657, 21.301], [-157.86645, 21.2986], [-157.86735, 21.2965], [-157.8681, 21.2947], [-157.8687, 21.2935], [-157.8693, 21.2932], [-157.8714, 21.29335], [-157.8708, 21.2956], [-157.8699, 21.298], [-157.86945, 21.301], [-157.8699, 21.3034], [-157.8702, 21.3058], [-157.87005, 21.3079], [-157.8696, 21.31], [-157.8693, 21.3118]]),
    source: 'hawaii-gis-oahu-1881',
    note: 'the harbour off the 1881 town and the channel through the reef to the bar, between the reef stipple each side; traced at 0.00003° a pixel',
  },
]

export const BARS = [
  {
    id: 'pearl-harbor-bar',
    name: 'the Pearl Harbor bar',
    depth: -3.5,
    sheets: [1881, 1899],
    geometry: polygon([[-157.9624, 21.3035], [-157.9594, 21.3038], [-157.957, 21.3032], [-157.954, 21.3005], [-157.9534, 21.29945], [-157.9633, 21.29945], [-157.96315, 21.302]]),
    note:
      'from the south end of the dotted channel to the 4-fathom line of the 1881 sheet, which writes “3 Bar”; the 1899 sheet sounds 1½ to 3½ there, ' +
      'Corney in 1818 “not more than 15 feet ... at high water”: never shallower than 3.5 m, about two fathoms at low water',
  },
  {
    id: 'honolulu-bar',
    name: 'the Honolulu bar',
    depth: -5.5,
    sheets: [1881],
    geometry: polygon([[-157.8768, 21.2941], [-157.866, 21.2941], [-157.866, 21.29], [-157.8768, 21.29]]),
    note: 'the reef edge off the passage, where the 1881 sheet sounds 1½ to 3½ fathoms by the spar buoy and the 1890–92 cut went through a bar of as little as 18 feet: never shallower than 5.5 m',
  },
]

// ---------------------------------------------------------------------------
// Old shores

/** The 1881 coast from the Honolulu district bake (SHORE_1881.nuuanu), in lon/lat. */
const nuuanuShore = SHORE_1881.nuuanu
const toLL = (pts) => pts.map(([E, N]) => utm4Inverse(E, N).map(r6))

// West of the district's trace, Keʻehi lagoon's west shore on the 1881 sheet,
// from the Ahua shore north-east to the district trace's first vertex (which
// it meets), traced at 0.00005° a pixel. West of this the airport stands on
// the 1881 sheet's land (Ahua, the Kaihikapu and Lelepaua ponds) and is left
// alone.
const KEEHI_WEST_1881 = [[-157.921, 21.312], [-157.9185, 21.3165], [-157.91625, 21.32075], [-157.9145, 21.325]]

/**
 * The sea of 1881 from Keʻehi to Waikīkī, as one polygon with the 1881 islets
 * as holes: the district's coast, carried west along Keʻehi's west shore and
 * closed far out to sea.
 */
export function sea1881() {
  const coast = toLL(nuuanuShore.coast)
  const outer = [[-157.921, 21.2], ...KEEHI_WEST_1881, ...coast, ...toLL(nuuanuShore.close.slice(0, 1)), [-157.921, 21.2]]
  const holes = Object.values(nuuanuShore.islands).map(toLL)
  return polygon(outer, ...holes)
}

// Sand Island as the 1938 map draws it (the old Quarantine Island grown east
// by the harbour's spoil), traced at 0.00003° a pixel; the fill west and south
// of it came after.
const SAND_ISLAND_1938 = [[-157.8828, 21.3087], [-157.8822, 21.30945], [-157.881, 21.30975], [-157.8801, 21.30915], [-157.87965, 21.3078], [-157.878, 21.3075], [-157.8759, 21.3075], [-157.8738, 21.3078], [-157.8732, 21.30915], [-157.872, 21.30915], [-157.8708, 21.3081], [-157.87035, 21.306], [-157.8693, 21.3042], [-157.86825, 21.3024], [-157.8693, 21.3006], [-157.8708, 21.2988], [-157.872, 21.29925], [-157.87245, 21.3012], [-157.8726, 21.3024], [-157.8744, 21.303], [-157.8768, 21.3036], [-157.8786, 21.3045], [-157.8801, 21.30525], [-157.8819, 21.306], [-157.88265, 21.30705]]

// Ford Island (Mokuʻumeʻume) and Kuahua as the 1881 sheet draws them,
// traced at 0.00004° a pixel.
const FORD_ISLAND_1881 = [[-157.9662, 21.35532], [-157.964, 21.35512], [-157.962, 21.35572], [-157.96048, 21.35652], [-157.96072, 21.3578], [-157.9602, 21.3592], [-157.95912, 21.36072], [-157.958, 21.36172], [-157.9568, 21.36228], [-157.95568, 21.36212], [-157.9546, 21.36236], [-157.9532, 21.3626], [-157.9522, 21.36308], [-157.9514, 21.364], [-157.9514, 21.3668], [-157.9524, 21.36708], [-157.9534, 21.3668], [-157.9544, 21.36648], [-157.9556, 21.36708], [-157.9568, 21.36768], [-157.958, 21.368], [-157.9594, 21.36768], [-157.9606, 21.36732], [-157.9624, 21.36628], [-157.9646, 21.3648], [-157.9666, 21.363], [-157.96752, 21.3606], [-157.9674, 21.3582], [-157.96688, 21.3564]]
const KUAHUA_1881 = [[-157.9474, 21.3572], [-157.9468, 21.359], [-157.9452, 21.3602], [-157.9436, 21.3612], [-157.942, 21.3616], [-157.9404, 21.3612], [-157.9384, 21.3606], [-157.936, 21.3598], [-157.9352, 21.3582], [-157.9364, 21.357], [-157.9388, 21.357], [-157.9412, 21.3562], [-157.9424, 21.355], [-157.9436, 21.3538], [-157.9444, 21.3526], [-157.946, 21.3532], [-157.947, 21.355]]

export const OLD_SHORES = {
  sea1881: { geometry: sea1881(), source: 'hawaii-gis-oahu-1881', note: 'the 1881 sea from Keʻehi to Waikīkī: the district bake’s traced coast (shoreline-1881.geojson) carried west along Keʻehi lagoon’s west shore' },
  sandIsland1938: { geometry: polygon(SAND_ISLAND_1938), source: 'hawaii-gis-oahu-1938', note: 'Sand Island on the 1938 map' },
  fordIsland1881: { geometry: polygon(FORD_ISLAND_1881), source: 'hawaii-gis-oahu-1881', note: 'Mokuʻumeʻume (Ford Island) on the 1881 sheet' },
  kuahua1881: { geometry: polygon(KUAHUA_1881), source: 'hawaii-gis-oahu-1881', note: 'Kuahua Island on the 1881 sheet' },
}

// ---------------------------------------------------------------------------
// Raise works: today's sea that was reef, bar, lagoon or shore before a cut.
//
// A group is dredged ground that is one piece on the sea floor (one harbour);
// its texels are found together and given one reef surface, then shared out
// among its zones by date. `cut` is the depth below which a CUDEM cell inside
// the group counts as cut (well below the natural reef flat there); `open`
// and `minArea` clean out natural holes and grooves. `level: 'reef'` lays the
// group back at the depth of the reef that rims it; a number lays it at that
// height instead (the Ala Wai, dug through the land).

export const RAISE_GROUPS = [
  {
    id: 'pearl-entrance',
    name: 'the Pearl Harbor entrance channel',
    cut: -8,
    open: 10,
    minArea: 3000,
    level: 'reef',
    bars: ['pearl-harbor-bar'],
    zones: [
      {
        id: 'pearl-channel',
        name: 'the Pearl Harbor entrance channel and bar',
        until: 1911,
        // the narrows to the 4-fathom line off the bar (the fore-reef beyond is
        // natural deep water), round today's channel with 100 m to spare
        geometry: polygon([[-157.972, 21.3305], [-157.9651, 21.3305], [-157.96465, 21.3206], [-157.9609, 21.3143], [-157.9582, 21.3128], [-157.9555, 21.3035], [-157.9542, 21.2994], [-157.9612, 21.2994], [-157.9618, 21.3017], [-157.9651, 21.3092], [-157.969, 21.3155], [-157.97185, 21.31985]]),
        sources: ['usn-pearl-harbor-history', 'iooh-pearl-harbor-1911'],
        note:
          'the entrance channel cut through the reef flat and the bar outside the natural channel: begun in 1902 under the 1901 appropriation, deep enough for ' +
          'the gunboat Petrel in January 1905, enlarged under the Act of 13 May 1908, and “completed ... December 14, 1911”, when the cruiser California ' +
          'entered. The 1881 channel inside the bar stays open; elsewhere the cut goes back to the reef flat or sea floor that rims it, and across ' +
          'the bar never shallower than 3.5 m, the bar’s depth by the surveys (the sea floor beside the bar is 6 to 8 m deep today, and the cut there ' +
          'goes back to that). Its later widenings are not separated',
      },
    ],
  },
  {
    id: 'honolulu-harbour',
    name: 'Honolulu Harbour and Kapālama',
    cut: -6,
    open: 8,
    minArea: 2000,
    level: 'reef',
    bars: ['honolulu-bar'],
    zones: [
      {
        id: 'honolulu-bar-cut',
        name: 'the cut through the Honolulu bar',
        until: 1892,
        geometry: polygon([[-157.8768, 21.2941], [-157.866, 21.2941], [-157.866, 21.2895], [-157.8768, 21.2895]]),
        sources: ['iooh-honolulu-harbor'],
        note: 'the entrance channel where it crosses the bar and the reef edge: “In 1890-92, a channel 200-feet wide by 30-feet deep was dredged for about 1,000-feet through the sand bar”, which had held ships to as little as 18 feet. Laid back at 5.5 m, the bar’s depth, where the reef beside it is shallower, and at the sea floor beside it past the reef edge; today’s cut is wider than the first',
      },
      {
        id: 'honolulu-harbour',
        name: 'Honolulu Harbour outside the old harbour',
        until: 1908,
        geometry: polygon([[-157.876, 21.318], [-157.858, 21.318], [-157.858, 21.300], [-157.863, 21.2941], [-157.8768, 21.2941], [-157.8785, 21.297], [-157.876, 21.302]]),
        sources: ['usn-pearl-harbor-history', 'iooh-honolulu-harbor'],
        note:
          'the harbour basin dredged out of the reef west of the 1881 harbour (towards Sand Island, as far as about 157.876° W), and the entrance channel ' +
          'where it runs outside the 1881 passage: 1901 to 1908 “The harbor was dredged and the channel enlarged to accommodate larger ships”, the spoil ' +
          'going to Sand Island. The 1881 harbour and passage stay open',
      },
      {
        id: 'kapalama',
        name: 'Kapālama Basin and channel',
        until: 1935,
        geometry: polygon([[-157.8885, 21.3215], [-157.876, 21.3215], [-157.876, 21.3055], [-157.886, 21.3075], [-157.886, 21.3182], [-157.8885, 21.319]]),
        sources: ['iooh-honolulu-harbor', 'living-new-deal-honolulu-harbor'],
        note:
          'Kapālama Basin and the channel joining it to the harbour, on the reef flat of Kalihi kai: the Reserved Channel dredged after 1914, Pier 35 in the ' +
          'basin by 1931, and the connecting channel dredged in the 1934–35 federal project, its completion',
      },
    ],
  },
  {
    id: 'keehi',
    name: 'Keʻehi lagoon and the reef by the Reef Runway',
    cut: -1.8,
    open: 12,
    minArea: 4000,
    level: 'reef',
    zones: [
      {
        id: 'keehi-seaplane',
        name: 'the Keʻehi seaplane runways and Kalihi Channel',
        until: 1944,
        geometry: polygon([[-157.9204, 21.31052], [-157.9204, 21.3134], [-157.906, 21.3238], [-157.898, 21.3306], [-157.8928, 21.335], [-157.8876, 21.335], [-157.89, 21.329], [-157.892, 21.323], [-157.8904, 21.3182], [-157.886, 21.3182], [-157.886, 21.307], [-157.8995, 21.307], [-157.902, 21.31], [-157.906, 21.31028]]),
        sources: ['usn-building-bases-1947', 'hawaii-dot-hnl-history'],
        note:
          'the three seaplane runways dredged in the lagoon’s reef flat and mud for Naval Air Station Honolulu, with the barge channel and turning basin: ' +
          'a dredge brought in in February 1943, the station “commissioned on January 1, 1944”. The lagoon’s natural flats and its islets stay as they are',
      },
      {
        id: 'reef-runway-cuts',
        name: 'the cuts on the reef beside the Reef Runway',
        until: 1977,
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            polygon([[-157.9214, 21.3044], [-157.9076, 21.3044], [-157.9084, 21.3094], [-157.906, 21.31], [-157.9028, 21.3094], [-157.9024, 21.295], [-157.9076, 21.2946], [-157.9092, 21.299], [-157.9214, 21.299]]).coordinates,
            polygon([[-157.9576, 21.3176], [-157.9398, 21.3164], [-157.9398, 21.3096], [-157.9502, 21.3092], [-157.9514, 21.3032], [-157.955, 21.3032], [-157.9558, 21.3096], [-157.9576, 21.312]]).coordinates,
          ],
        },
        sources: ['hawaii-dot-reef-runway'],
        note:
          'straight-edged basins and channels cut into the reef flat at either end of the Reef Runway and along its seaward side, which the 1881 sheet ' +
          'shows as reef. Dated with the runway, “constructed” in 1977, whose works they border; their own date is not in the sources read',
      },
    ],
  },
  {
    id: 'kalihi-channel',
    name: 'Kalihi Channel',
    // cut through the outer reef flat, which is itself 2–3 m deep here: found
    // below 4 m, so the flat beside it is not taken for dredged ground
    cut: -4,
    open: 8,
    minArea: 3000,
    level: 'reef',
    zones: [
      {
        id: 'kalihi-channel',
        name: 'Kalihi Channel',
        until: 1944,
        // (with the straight cut along Sand Island's west side, which ends on the reef flat)
        geometry: polygon([[-157.8995, 21.307], [-157.886, 21.307], [-157.8845, 21.3045], [-157.8845, 21.301], [-157.889, 21.2985], [-157.8904, 21.295], [-157.8914, 21.289], [-157.8995, 21.289], [-157.9, 21.295]]),
        sources: ['usn-building-bases-1947', 'hawaii-dot-hnl-history'],
        note:
          'the channel from the Keʻehi seaplane harbour out through the reef, and the cut along Sand Island’s west side, where the 1881 sheet shows reef ' +
          'flat. Their own dates are not in the sources ' +
          'read (a Kalihi Channel was planned after 1914, with Kapālama Basin); they are given the seaplane runways’, which the channel served: dredged from February ' +
          '1943, the station commissioned on 1 January 1944',
      },
    ],
  },
  {
    id: 'kewalo-ala-wai',
    name: 'Kewalo Basin, the Ala Moana channel and the Ala Wai boat harbour',
    cut: -2.2,
    open: 8,
    minArea: 1500,
    level: 'reef',
    zones: [
      {
        id: 'kewalo',
        name: 'Kewalo Basin',
        until: 1926,
        geometry: polygon([[-157.8622, 21.2952], [-157.85452, 21.2952], [-157.85452, 21.29048], [-157.857, 21.29008], [-157.8598, 21.28832], [-157.8626, 21.28832]]),
        sources: ['iooh-ala-wai-kewalo'],
        note: 'the basin and its channel through the reef: “Dredging of the Kewalo Channel began in 1924”, the basin built in the 1920s and in use by the fishing sampans from 1926; given 1926',
      },
      {
        id: 'ala-moana-channel',
        name: 'the channel along the Ala Moana reef',
        until: 1928,
        geometry: polygon([[-157.857, 21.29048], [-157.853, 21.29096], [-157.8482, 21.28952], [-157.84588, 21.2882], [-157.8462, 21.2862], [-157.849, 21.287], [-157.853, 21.2878], [-157.857, 21.289]]),
        sources: ['iooh-ala-wai-kewalo'],
        note: '“In 1928, a channel was dredged through the coral reef to connect the Ala Wai Boat Harbor and the Kewalo Basin”; what is left of it lies off Ala Moana Park (the rest was filled in the mid-1950s)',
      },
      {
        id: 'ala-wai-harbour',
        name: 'the Ala Wai boat harbour',
        until: 1935,
        geometry: polygon([[-157.8434, 21.28952], [-157.8384, 21.28952], [-157.8384, 21.2802], [-157.8424, 21.2802], [-157.8438, 21.283], [-157.844, 21.2868]]),
        sources: ['iooh-ala-wai-kewalo', 'hawaii-gis-oahu-1938'],
        note: 'the boat harbour basin at the mouth of the Ala Wai, dredged out of the reef at Kālia; the posts read say it “grew incrementally” and give no year for the first basin, which the 1938 map draws; given 1935, the year the University of Hawaiʻi’s coastal surveys give for it',
      },
      {
        id: 'ala-wai-entrance',
        name: 'the Ala Wai boat harbour entrance',
        until: 1951,
        geometry: polygon([[-157.8452, 21.2884], [-157.8434, 21.288], [-157.844, 21.2868], [-157.8438, 21.283], [-157.8424, 21.2802], [-157.847, 21.2798], [-157.8474, 21.2812]]),
        sources: ['iooh-ala-wai-kewalo'],
        note: 'the boat harbour’s channel to the sea beside Magic Island: “in 1951, a channel was dredged directly out to sea”',
      },
    ],
  },
  {
    id: 'ala-wai-canal',
    name: 'the Ala Wai Canal',
    // the canal is today's water only in the packs (the CUDEM holds much of it
    // as land), so it is taken from the pack itself: every sea texel in its
    // corridor
    packSea: true,
    level: 0.5,
    zones: [
      {
        id: 'ala-wai-canal',
        name: 'the Ala Wai Canal',
        until: 1928,
        geometry: {
          type: 'MultiPolygon',
          // (from the boat harbour's east wall, which the harbour zone ends at)
          coordinates: [corridor([[-157.8378, 21.28825], [-157.8344, 21.289]], 60, false).coordinates, corridor([[-157.8328, 21.2884], [-157.8172, 21.27472]], 60).coordinates],
        },
        sources: ['iooh-ala-wai-kewalo'],
        note:
          'the canal dug through the Waikīkī wetland, “begun in 1921 and completed in 1928”; before it the ground there was ponds and loʻi at about the level ' +
          'of the tide, so the canal is laid at 0.5 m, the low shore the district’s features stand on, rather than at a reef depth',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Lower works: today's land that was water or reef before it was filled.
//
// Each lists the shapes that must all hold (`within`: today's land is always
// one of them) and those that must not (`outside`). `fill` asks for the State
// geologic map's fill unit too, where it maps the made ground. `level` is the
// height the texels go back to. `islandOnly` keeps a work off the district,
// whose own manifest already carries it (the contact and kingdom patches).

const sea = 'sea1881'
export const LOWER_WORKS = [
  {
    id: 'honolulu-waterfront',
    name: 'the Honolulu waterfront fill',
    until: 1900,
    level: -1,
    fill: true,
    within: [sea],
    // everything the dated works below do not take
    rest: true,
    islandOnly: true,
    sheets: [1899],
    sources: [],
    note:
      'the made ground the geologic map calls fill and the 1881 sheet shows as sea or reef flat, from the piers of the inner harbour and Kapālama to ' +
      'Kakaʻako makai, Kewalo and Kālia, where no later work below takes it: the district’s kingdom patch, on the island. The 1899 sheet shows the same ' +
      'waterfront, so the filling came after it',
  },
  {
    id: 'sand-island-early',
    name: 'Sand Island, as far as the 1938 map draws it',
    until: 1908,
    level: -1,
    // all of Sand Island but Quarantine Island is made ground; the fill unit
    // stops short of its seawalls and berms, so it is not asked for here
    within: [sea, 'sandIsland1938'],
    region: polygon([[-157.8865, 21.3133], [-157.8675, 21.3133], [-157.8675, 21.296], [-157.8865, 21.296]]),
    sources: ['usn-pearl-harbor-history', 'iooh-honolulu-harbor'],
    note: 'Quarantine Island grown east by the spoil of the harbour’s dredging after annexation, 1901 to 1908; the 1938 map draws it so. Quarantine Island itself, on the 1881 sheet, stays',
  },
  {
    id: 'sand-island-later',
    name: 'Sand Island’s later fill',
    until: 1944,
    level: -1,
    within: [sea],
    outside: ['sandIsland1938'],
    region: polygon([[-157.8905, 21.3133], [-157.8675, 21.3133], [-157.8675, 21.296], [-157.8905, 21.296]]),
    sources: ['usn-building-bases-1947', 'hawaii-dot-hnl-history', 'hawaii-gis-oahu-1938'],
    note: 'the western and southern two thirds of Sand Island, reef on the 1938 map, built up with the spoil of the Keʻehi seaplane runways (dredged from February 1943; the air station commissioned on 1 January 1944)',
  },
  {
    id: 'ala-moana-park',
    name: 'Ala Moana Park',
    until: 1934,
    level: -1,
    fill: true,
    within: [sea],
    region: polygon([[-157.855, 21.294], [-157.844, 21.2916], [-157.8442, 21.28832], [-157.8478, 21.28848], [-157.84932, 21.2868], [-157.855, 21.28952]]),
    sources: ['iooh-ala-wai-kewalo'],
    note: 'the park made of dredged coral on the reef flat off the old shore, “completed in 1934”',
  },
  {
    id: 'magic-island',
    name: 'Magic Island (ʻĀina Moana)',
    until: 1964,
    level: -1,
    fill: true,
    within: [sea],
    region: polygon([[-157.84932, 21.2868], [-157.8478, 21.28848], [-157.84452, 21.28808], [-157.844, 21.2806], [-157.84828, 21.2806]]),
    sources: ['iooh-ala-wai-kewalo'],
    note: 'the peninsula built on the reef flat from coral dredge spoil in 1964 (“a 30-acre peninsula”)',
  },
  {
    id: 'waikiki-wetland-fill',
    name: 'the Ala Wai’s fill on the Waikīkī wetland',
    until: 1928,
    level: 0.6,
    fill: true,
    within: [],
    outside: [sea],
    region: polygon([[-157.8425, 21.2955], [-157.81, 21.2955], [-157.81, 21.266], [-157.8425, 21.266]]),
    sources: ['iooh-ala-wai-kewalo'],
    note:
      'the made ground of Waikīkī inside its 1881 shore, where the canal “begun in 1921 and completed in 1928” led to “the draining and filling in of ' +
      'the ponds and irrigated fields”: brought down to 0.6 m, the wetland’s own level a little above the tide, and kept land, as the district’s features ' +
      '(the ponds and loʻi) expect. Not a reef: the only lower patch that stays above the sea',
  },
  {
    id: 'keehi-airport-fill',
    name: 'the airport’s fill on Keʻehi lagoon',
    until: 1944,
    level: -1,
    fill: true,
    within: [sea],
    region: polygon([[-157.925, 21.335], [-157.9, 21.335], [-157.9, 21.3105], [-157.925, 21.3105]]),
    sources: ['usn-building-bases-1947', 'hawaii-dot-hnl-history'],
    note: 'the airport’s ground east of Keʻehi lagoon’s 1881 shore, made with the spoil of the seaplane runways (1943–44), which “raised the land to a 10-foot elevation”',
  },
  {
    id: 'reef-runway',
    name: 'the Reef Runway',
    until: 1977,
    level: -1,
    within: [],
    region: polygon([[-157.952, 21.3098], [-157.904, 21.3106], [-157.903, 21.302], [-157.952, 21.302]]),
    sources: ['hawaii-dot-reef-runway'],
    note: 'the runway built on the reef flat off the airport, “constructed” in 1977; the 1881 sheet shows reef there',
  },
  {
    id: 'ford-island',
    name: 'Ford Island’s edges',
    until: 1940,
    level: -1,
    within: [],
    outside: ['fordIsland1881'],
    region: polygon([[-157.97, 21.3622], [-157.9656, 21.3678], [-157.9592, 21.3722], [-157.9532, 21.3702], [-157.9484, 21.3694], [-157.95, 21.3638], [-157.9528, 21.361], [-157.958, 21.3594], [-157.9596, 21.3562], [-157.966, 21.3542], [-157.97, 21.3582]]),
    sources: ['wikipedia-ford-island', 'usn-building-bases-1947'],
    note: 'the land round Mokuʻumeʻume outside its 1881 shore, made with fill dredged from the harbour during the 1930s (about 334 acres grown to about 441); seven more acres for the T-wharves in 1940–43 are not separated',
  },
  {
    id: 'kuahua',
    name: 'Kuahua peninsula',
    until: 1943,
    level: -1,
    within: [],
    outside: ['kuahua1881'],
    region: polygon([[-157.9494, 21.359], [-157.9476, 21.3614], [-157.9444, 21.3638], [-157.9408, 21.3662], [-157.9388, 21.3656], [-157.9412, 21.3618], [-157.9444, 21.3598], [-157.9464, 21.3574], [-157.9476, 21.355], [-157.9492, 21.3562]]),
    sources: ['usn-building-bases-1947'],
    note: 'Kuahua Island extended into the loch with the spoil of the wartime dredging, from 47 acres to a 116-acre peninsula; the contract ran to December 1943',
  },
]

/** Every shape the sheets draw: passages, bars, zones, regions and old shores. */
export function allShapes() {
  const out = []
  for (const p of PASSAGES) out.push(feature(p.geometry, { kind: 'passage', id: p.id }))
  for (const b of BARS) out.push(feature(b.geometry, { kind: 'bar', id: b.id }))
  for (const g of RAISE_GROUPS) for (const z of g.zones) out.push(feature(z.geometry, { kind: 'raise-zone', id: z.id }))
  for (const w of LOWER_WORKS) if (w.region) out.push(feature(w.region, { kind: 'lower-region', id: w.id }))
  for (const [id, s] of Object.entries(OLD_SHORES)) out.push(feature(s.geometry, { kind: 'old-shore', id }))
  return out
}
