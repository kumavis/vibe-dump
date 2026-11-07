// The rules behind the era layers (DATA.md, "Era layers"): what each
// keyframe's cultivation, settlement and forest are made of, and the
// figures they are scaled by. Every number here is either read from a
// source named beside it or is a modelling choice, and says which.
//
// Layer values are fractions 0..1 of the texel (cultivation, forest) or
// people per km² (settlement) until bake-layers.mjs encodes them.
import { ISLANDS } from './geo.mjs'
import { blur, clamp01, coverage, distanceTo, featureIndex, featureMean, polygonArea, routeWater, sampleCah, samplesFor, slopeOf, smoothstep } from './layers-raster.mjs'
import { WET_GROUND } from './layers-sources.mjs'
import { fillThroughMask } from './raster.mjs'

// ---------------------------------------------------------------------------
// Keyframes

export const KEYFRAMES = [
  {
    id: 'contact',
    year: 1778,
    yearPrecision: 30,
    label: 'on the eve of contact, c. 1778',
    layers: ['cultivation', 'settlement', 'forest'],
    note:
      'The florescence of the chiefdoms: the windward valleys in loʻi, the leeward field systems at their widest, the lowland forest ' +
      'mostly gone to fields and fire. It also stands for the chiefly eras before it, which had less of everything: the windward ' +
      'irrigated valleys came first, the leeward dryland field systems were laid out and spread after about 1400 and were ' +
      'subdivided and intensified into the 1700s, and fishponds and the great luakini came later still (after Kirch and after ' +
      'Ladefoged and Graves on the Kohala field system; not read for this bake, verify before it reaches a card). The app may ' +
      'fade the dryland part of the cultivation for eras before about 1450 and thin the settlement with it.',
  },
  {
    id: 'mahele',
    year: 1853,
    yearPrecision: 5,
    label: 'at the Māhele, c. 1848–1855',
    layers: ['cultivation', 'settlement'],
    note:
      'The Land Commission Awards of 1846–1855 are a map of where people still lived and farmed, and the 1853 census counts them by ' +
      'island. Seventy-five years of epidemics have emptied much of the land. No forest is baked for this keyframe: nothing maps ' +
      'it, so the app interpolates forest between contact and the end of the kingdom.',
  },
  {
    id: 'kingdom',
    year: 1896,
    yearPrecision: 4,
    label: 'at the end of the kingdom, c. 1896–1900',
    layers: ['cultivation', 'settlement', 'forest'],
    note:
      'Sugar across the plains and lower slopes, loʻi in rice or taro or abandoned, the leeward field systems long empty, cattle ' +
      'and fire pushing the forest line up; Honolulu a city. The 1896 census counts by district; the cane lands are those mapped ' +
      'for 1900.',
  },
  {
    id: 'now',
    year: 2020,
    yearPrecision: 10,
    label: 'now, c. 2010–2020',
    layers: ['cultivation', 'settlement', 'forest'],
    note: 'For the coda. Mapped from land cover of about 2010, the 2020 agricultural baseline and the 2020 census.',
  },
]

// ---------------------------------------------------------------------------
// Population figures

export const POP_SOURCES = {
  'king-1784-v3': {
    id: 'king-1784-v3',
    title: 'James King, A Voyage to the Pacific Ocean, vol. III (1784), Book V, pp. 126–128',
    url: 'https://archive.org/details/bim_eighteenth-century_a-voyage-to-the-pacific-_cook-james_1784_3',
    licence: 'public domain',
    note:
      'King’s 1779 estimate island by island, from houses counted around Kealakekua and applied to each coast: 400,000 in all. ' +
      'Estimates for 1778 run from about 200,000 to 1,000,000 (Swanson 2019, Exhibit 1, tabulates them; his own is 683,200), so ' +
      'King’s figures sit inside the range, and every density here scales with whichever total is preferred. King lists no figure ' +
      'for Kahoʻolawe; his 4,000 for "Oreehoua" (Lehua, a bare islet off Niʻihau) is left out.',
  },
  'thrum-1890-annual': {
    id: 'thrum-1890-annual',
    title: 'Thomas G. Thrum, Hawaiian Almanac and Annual for 1890, p. 11, Comparative Table of Population of the Hawaiian Islands',
    url: 'https://archive.org/details/acp0143.1890.001.umich.edu',
    licence: 'public domain',
    note: 'census of 1853 by island, read on the page image; the column sums to the printed total of 73,138. Kahoʻolawe has no entry for 1853.',
  },
  'census-1896': {
    id: 'census-1896',
    title: 'Report of the General Superintendent of the Census, 1896 (A. T. Atkinson), Table II, Comparative Summary of Population by Island and District',
    url: 'https://archive.org/details/reportgeneralsu00atkigoog',
    licence: 'public domain',
    note: 'the 1896 count by island and district (109,020 in all), read on the page image; totals include every nationality',
  },
  'kumu-hawaii-1835-kona': {
    id: 'kumu-hawaii-1835-kona',
    title: 'Ke Kumu Hawaii, 23 December 1835 (Buke 1, Pepa 26), p. 204: the count of Kona, Kauaʻi, from Nuʻuolo to Hanapēpē, and of Niʻihau, 1831 and 1835 (signed Wini, Samuel Whitney)',
    url: 'https://nupepa-hawaii.com/2015/07/25/population-change-of-kona-kauai-and-niihau-1835/',
    licence: 'public domain (1835); the table as transcribed at nupepa-hawaii.com, also https://nupepa-hawaii.com/2019/10/25/population-of-kona-kauai-and-niihau-1835/',
    opened: true,
    read: 'part',
    note:
      'by ahupuaʻa, 1835: Waimea 664, Hanapēpē 598, Makaweli 480, Kekaha 185, Kekupua 179, the fifteen small lands from Nuʻuolo ' +
      'to Pokiʻi 510 between them; 2,616 in all (4,508 in 1831, when the chiefs lived at Waimea). Niʻihau 993 (1,079 in 1831). ' +
      'Read in the transcription (the table; the letter’s text only in summary), not on the page image.',
  },
  'kumu-hawaii-1835-waioli': {
    id: 'kumu-hawaii-1835-waioli',
    title: 'Ke Kumu Hawaii, 14 October 1835 (Buke 1, Pepa 21), p. 164: letter from Waiʻoli, Kauaʻi, signed W. P. A., counting Keālia to Kalalau by ahupuaʻa',
    url: 'https://nupepa-hawaii.com/2018/09/20/population-decline-1835/',
    licence: 'public domain (1835); the table as transcribed at nupepa-hawaii.com',
    opened: true,
    read: 'part',
    note:
      'by ahupuaʻa, 1835: Hanalei 522, Anahola 323, Keālia 283, Wainiha 216, Kalihiwai 190, Kalalau 131, Pīlaʻa 126, ' +
      'Lumahaʻi 119, Kīlauea 117, Hāʻena 116, Moloaʻa 115, Waiakalua 101 and the rest under 100; 3,118 in all. Read in the ' +
      'transcription, not on the page image.',
  },
  'kirch-2004-kahikinui': {
    id: 'kirch-2004-kahikinui',
    title: 'P. V. Kirch, A. S. Hartshorn, O. A. Chadwick and others, Environment, agriculture, and settlement patterns in a marginal Polynesian landscape, PNAS 101 (2004)',
    url: 'https://www.usgs.gov/publications/environment-agriculture-and-settlement-patterns-a-marginal-polynesian-landscape',
    licence: 'cited, not reproduced',
    opened: true,
    read: 'part',
    note:
      'the abstract: permanent dryland settlement in Kahikinui, Maui, from about 1400, sweet potato its staple, peak density ' +
      '43–57 people per km² reached by 1700–1800. Wanted from the full text: the house counts behind the density, and the area ' +
      'it is taken over.',
  },
  'ladefoged-2009-intensive': {
    id: 'ladefoged-2009-intensive',
    title: 'T. N. Ladefoged, P. V. Kirch, S. M. Gon and others, Opportunities and constraints for intensive agriculture in the Hawaiian archipelago prior to European contact, Journal of Archaeological Science 36 (2009): 2374–2383',
    url: 'https://www.conservationgateway.org/collections/hawaii-palmyra/indigenous-approach/hawaiian-intensive-agriculture-opportunities-constraints-pre-european-contact/',
    licence: 'cited, not reproduced',
    opened: true,
    read: 'part',
    note:
      'the abstract: Kauaʻi could have supported 58 km² of intensive agriculture, all of it irrigated pondfield, none rain-fed. ' +
      'Wanted from the full text: the model’s Kauaʻi map, valley by valley.',
  },
  'earle-1978-halelea': {
    id: 'earle-1978-halelea',
    title: 'Timothy Earle, Economic and Social Organization of a Complex Chiefdom: The Halelea District, Kauaʻi, Hawaii (University of Michigan Museum of Anthropology, Anthropological Papers 63, 1978)',
    url: 'https://press.umich.edu/Books/E/Economic-and-Social-Organization-of-a-Complex-Chiefdom',
    licence: 'cited, not reproduced',
    opened: false,
    read: 'title',
    wanted:
      'the irrigation complexes and house sites of Hanalei, Waiʻoli, Waipā, Lumahaʻi and Wainiha: where on the valley floors ' +
      'and the beach ridges people lived, and any estimate of the district’s people before contact, to set the valley ' +
      'weights against the 1835 counts.',
  },
  'nps-kalaupapa': {
    id: 'nps-kalaupapa',
    title: 'National Park Service, A Brief History of Kalaupapa',
    url: 'https://www.nps.gov/kala/learn/historyculture/a-brief-history-of-kalaupapa.htm',
    licence: 'public domain (U.S. National Park Service)',
    note: '"During the years 1888 to 1902 … the population at Kalawao swelled to over 1,100 people"',
  },
}

/**
 * Island populations by keyframe. Kahoʻolawe and Niʻihau in 1778 are
 * back-cast from 1832 (BACKCAST_1832), not King's; null here.
 */
export const ISLAND_POP = {
  contact: { hawaii: 150000, maui: 65400, oahu: 60200, kauai: 54000, molokai: 36000, lanai: 20400, niihau: null, kahoolawe: null },
  mahele: { hawaii: 24450, maui: 17574, oahu: 19126, kauai: 6991, molokai: 3607, lanai: 600, niihau: 790, kahoolawe: 0 },
}

/**
 * The islands whose 1778 figure is their 1832 count (Thrum) times King's
 * total over the 1832 total (Thrum), rounded to tens. Kahoʻolawe, which King
 * leaves out. Niʻihau, for which King gives 10,000: his figures come from the
 * houses he counted at Kealakekua "applied to the whole extent of coast"
 * (King 1784, vol. III, p. 127), and a long, dry coast takes a large share
 * by that rule; 10,000 is 9.6 times the 1,047 of 1832 (the 1823 estimate in
 * the same table is 1,000), where the chain as a whole is 3.1 times, and it
 * would put on all of Niʻihau the peak density Kirch and others (2004) found
 * in Kahikinui's farmed zone alone.
 */
export const BACKCAST_1832 = { counts: { kahoolawe: 80, niihau: 1047 }, total1832: 130313, king: 400000, kingSays: { niihau: 10000 } }

/**
 * The earliest counts by ahupuaʻa, which set each land's share of its
 * island's 1778 people; the rule (contactWeight) places them within the
 * land. Kauaʻi: Ke Kumu Hawaii's 1835 counts of Kona from Nuʻuolo to
 * Hanapēpē (23 Dec. 1835, p. 204) and of Keālia to Kalalau (14 Oct. 1835,
 * p. 164), with the island's 1836 total from Thrum; `rest` is every land the
 * two lists leave out (Puna south of Keālia, Kōloa, east Kona, Hanakāpīʻai,
 * Honopū and Pōhakuao), holding the 1836 total less the lists. The 324
 * people of the listed names no polygon has (Kekupua 179, Homaikawaʻa 70,
 * Betelehema 75) are `unplaced`: the shares are of the rest, so they go to
 * every land in proportion. `lands` are the names of
 * boundaries/ahupuaa.geojson that make up a counted land: Waimea's polygon
 * runs from Kekaha round to Nuʻuolo, so it holds the fifteen small lands of
 * Mānā and the western cliffs (510), Kekaha (185) and Waimea (664).
 * Niʻihau is one ahupuaʻa in the boundaries and its counts are of the whole
 * island, so it takes no split.
 */
export const AHUPUAA_COUNTS = {
  kauai: {
    year: 1835,
    total: 8934,
    unplaced: 179 + 70 + 75,
    sources: ['kumu-hawaii-1835-kona', 'kumu-hawaii-1835-waioli', 'thrum-1890-annual'],
    lands: [
      { name: 'Waimea', people: 510 + 185 + 664 },
      { name: 'Makaweli', people: 480 },
      { name: 'Hanapēpē', people: 598 },
      { name: 'Keālia', people: 283 },
      { name: 'Anahola', people: 323 },
      { name: 'Papaʻa', people: 45 },
      { name: 'Moloaʻa', people: 115 },
      { name: 'Lepeuli', people: 85 },
      { name: 'Waipake', people: 78 },
      { name: 'Pīlaʻa', people: 126 },
      { name: 'Waiakalua', lands: ['Waiakalua', 'East Waiakalua', 'West Waiakalua'], people: 101 },
      { name: 'Kāhili', people: 91 },
      { name: 'Kīlauea', people: 117 },
      { name: 'Kalihiwai', people: 190 },
      { name: 'Kalihikai', people: 99 },
      { name: 'Hanalei', people: 522 },
      { name: 'Waiʻoli', people: 83 },
      { name: 'Waipā', people: 85 },
      { name: 'Lumahaʻi', people: 119 },
      { name: 'Wainiha', people: 216 },
      { name: 'Hāʻena', people: 116 },
      { name: 'Hanakoa', people: 48 },
      { name: 'Kalalau', people: 131 },
    ],
  },
}

/** For an island with counts: each texel's group (a land's index, or the rest) by its ahupuaʻa's name, and each group's share. */
export function countGroups(island) {
  const C = AHUPUAA_COUNTS[island]
  if (!C) return null
  const byName = new Map()
  C.lands.forEach((l, i) => {
    for (const n of l.lands || [l.name]) byName.set(n, i)
  })
  const listed = C.lands.reduce((a, l) => a + l.people, 0)
  const placed = C.total - (C.unplaced || 0)
  const rest = C.lands.length
  const share = [...C.lands.map((l) => l.people / placed), (placed - listed) / placed]
  return { groupOf: (name) => (byName.has(name) ? byName.get(name) : rest), share, n: rest + 1, rest: placed - listed }
}

/**
 * The 1896 census districts, joined to the moku of boundaries/moku.geojson.
 * The join is exact for Oʻahu and Hawaiʻi Island (the judicial districts
 * follow the moku; the census splits Kona and Kohala in two, which are
 * summed here) and approximate for Maui and Kauaʻi, whose districts group
 * moku. Kahoʻolawe lies in maui:Honuaʻula, so in Makawao.
 */
export const DISTRICTS_1896 = [
  { name: 'Honolulu', pop: 29920, moku: ['oahu:Kona'] },
  { name: 'Ewa', pop: 3067, moku: ['oahu:ʻEwa'] },
  { name: 'Waianae', pop: 1281, moku: ['oahu:Waiʻanae'] },
  { name: 'Waialua', pop: 1349, moku: ['oahu:Waialua'] },
  { name: 'Koolauloa', pop: 1835, moku: ['oahu:Koʻolauloa'] },
  { name: 'Koolaupoko', pop: 2753, moku: ['oahu:Koʻolaupoko'] },
  { name: 'Hilo', pop: 12878, moku: ['hawaii:Hilo'] },
  { name: 'Puna', pop: 1748, moku: ['hawaii:Puna'] },
  { name: 'Kau', pop: 2908, moku: ['hawaii:Kaʻū'] },
  { name: 'North and South Kona', pop: 3061 + 2327, moku: ['hawaii:Kona'] },
  { name: 'North and South Kohala', pop: 4125 + 558, moku: ['hawaii:Kohala'] },
  { name: 'Hamakua', pop: 5680, moku: ['hawaii:Hāmākua'] },
  { name: 'Molokai', pop: 2307, moku: ['molokai:Kona', 'molokai:Koʻolau'] },
  { name: 'Lanai', pop: 105, moku: ['lanai:Lāhainā'] },
  { name: 'Lahaina', pop: 2398, moku: ['maui:Lāhainā', 'maui:Kāʻanapali'] },
  { name: 'Wailuku', pop: 6072, moku: ['maui:Pūʻali Komohana'] },
  { name: 'Makawao', pop: 5464, moku: ['maui:Hāmākuapoko', 'maui:Hāmākualoa', 'maui:Kula', 'maui:Honuaʻula'] },
  { name: 'Hana', pop: 3792, moku: ['maui:Koʻolau', 'maui:Hāna', 'maui:Kīpahulu', 'maui:Kaupō', 'maui:Kahikinui'] },
  { name: 'Niihau', pop: 164, moku: ['niihau:Kona'] },
  { name: 'Waimea and Koloa', pop: 4431 + 1835, moku: ['kauai:Kona'] },
  { name: 'Lihue and Kawaihau', pop: 3425 + 2762, moku: ['kauai:Puna', 'kauai:Koʻolau'] },
  { name: 'Hanalei', pop: 2775, moku: ['kauai:Haleleʻa', 'kauai:Nāpali'] },
]

/**
 * Towns in 1896, as a share of their census district drawn into a soft
 * disc around the centre (Gaussian, sigma in metres). The shares are the
 * bake's assumption except Kalaupapa's, which is a head count (NPS).
 * Centres from USGS GNIS (Līhuʻe, Kalaupapa, Kahului queried directly; the
 * rest as places.json has them, which took them from GNIS).
 */
export const TOWNS_1896 = [
  { name: 'Honolulu', lon: -157.85835, lat: 21.30695, sigma: 1800, district: 'Honolulu', share: 0.6 },
  { name: 'Hilo', lon: -155.08684, lat: 19.72248, sigma: 1000, district: 'Hilo', share: 0.3 },
  { name: 'Wailuku', lon: -156.50107, lat: 20.88961, sigma: 900, district: 'Wailuku', share: 0.2 },
  { name: 'Kahului', lon: -156.47361, lat: 20.88203, sigma: 700, district: 'Wailuku', share: 0.1 },
  { name: 'Lahaina', lon: -156.67664, lat: 20.87429, sigma: 700, district: 'Lahaina', share: 0.4 },
  { name: 'Līhuʻe', lon: -159.36492, lat: 21.97409, sigma: 800, district: 'Lihue and Kawaihau', share: 0.15 },
  { name: 'Waimea', lon: -159.66894, lat: 21.95707, sigma: 700, district: 'Waimea and Koloa', share: 0.15 },
  { name: 'Kailua', lon: -155.99025, lat: 19.63928, sigma: 600, district: 'North and South Kona', share: 0.1 },
  { name: 'Kalaupapa', lon: -156.98178, lat: 21.18947, sigma: 900, district: 'Molokai', people: 1100, source: 'nps-kalaupapa' },
]

// ---------------------------------------------------------------------------
// The CAH classes (values 1–48 of CAH_LandCover.tif, per its value table)

/**
 * Native forest, as the share of the texel under native tree canopy: closed
 * classes count whole, open forest 0.6, low-stature wet forest 0.8, mixed
 * native–alien forest 0.5, woodland and forest–shrubland mosaics 0.4.
 * Alien forest, plantations, shrubland and the rest count 0.
 */
export const CAH_FOREST = {
  1: 1, 2: 1, 3: 0.8, 4: 0.6, 5: 0.6, // wet: closed ʻōhiʻa, closed koa–ʻōhiʻa, low-stature ʻōhiʻa, open ʻōhiʻa, open koa–ʻōhiʻa
  6: 1, 7: 1, 8: 1, 9: 0.6, 10: 0.6, // mesic: closed ʻōhiʻa, closed hala, closed koa–ʻōhiʻa, open ʻōhiʻa, open koa–ʻōhiʻa
  11: 1, 12: 0.4, 13: 0.6, 14: 0.6, // dry: closed ʻōhiʻa, māmane–naio woodland, open ʻōhiʻa, open koa–māmane
  15: 0.4, // native mesic to dry forest and shrubland
  16: 0.5, 17: 0.5, 18: 0.5, // mixed native–alien wet, mesic, dry forest
}
/** Developed classes, weighted for spreading census counts (dasymetric). */
export const CAH_DEVELOPED = { 44: 1, 46: 0.6, 45: 0.3, 43: 0.05 } // high, medium, low intensity, open space

/** 2020 crop categories that are not cultivation. */
export const NOT_CROPS = ['Pasture', 'Commercial Forestry', 'Dairy']

// ---------------------------------------------------------------------------
// The modelling constants, gathered so the manifest can print them

export const RULES = {
  // valley-floor and coastal-plain loʻi read from the pack itself: flat,
  // low, on alluvium, lagoon deposits or fill, beside a stream whose wet
  // catchment keeps it running
  valley: {
    streamFlow: 3e6, // m³ a year of rain over the catchment where a texel counts as stream
    flow: [3e6, 2e7], // ramp of that volume, log scale
    catchmentRain: [1200, 2000], // mm, mean over the catchment
    aboveStream: [8, 25], // m above the stream the texel drains to
    elevation: [200, 350],
    slope: [0.06, 0.15],
    substrateBlur: 60, // m
    substrateGain: 1.5,
  },
  // pre-contact cultivation weights on the traditional-agriculture zones
  loi: 1,
  dryland: 0.75,
  agroforestry: 0.5,
  fishpondShore: 0.5,
  // Land Commission Award parcels: smoothing and how strongly they count
  kuleanaMaxHa: 5,
  kuleanaSigma: 120,
  kuleanaGain: 1.5,
  kuleanaNearSigma: 600,
  // fishpond shore: low coast behind a reef flat
  pondShoreMetres: 250,
  pondMaxElevation: 6,
  pondShallowDepth: -3,
  pondShallowShare: [0.5, 0.85],
  // pre-contact settlement (contactWeight): the fields people lived among
  // (agroforestry, tree crops on the slopes above the loʻi and the shore,
  // counts for less: houses stood by the loʻi and the shore, not in the
  // groves), the shore, and a thin floor that thins inland
  settleFields: 0.5,
  settleAgroforestry: 0.5,
  settleCoast: 0.7,
  settleKuleana: 0.15,
  settleFloor: 0.03,
  settleFloorMetres: 3000,
  // pre-contact forest
  forestRainMm: [700, 1500],
  treeLineMetres: [1900, 2700],
  clearedBelow: 460,
  untouchedAbove: 760,
  lowlandKeep: 0.12,
  lowlandRemoteKeep: 0.5,
  remoteMetres: [1500, 6000],
  // the 1896 forest between its bounds
  reserveKeep: 0.85,
  outsideKeep: 0.4,
  // the 1853 and 1896 cultivation
  loiKept1853: [0.35, 0.9],
  loiKept1896: [0.3, 0.7],
  dryland1853: 0.25,
  dryland1896: 0.1,
  agroforestry1853: 0.3,
  agroforestry1896: 0.15,
  ponds1853: 0.87,
  ponds1896: 360 / 488,
}

// ---------------------------------------------------------------------------
// Inputs on one pack

/** Eruption year of a lava unit, from its age_range; null for sediments and anything older than the map's young groups. */
export function eruptionYear(range, name) {
  if (WET_GROUND.includes(name) || /sediment/i.test(String(range))) return null
  const s = String(range || '').replace(/,/g, '')
  let m = /A\.?D\.?\s*(\d{3,4})(?:\s*-\s*(\d{3,4}))?/.exec(s)
  if (m) return m[2] ? (Number(m[1]) + Number(m[2])) / 2 : Number(m[1])
  if (/Younger than A\.D\. 1840/i.test(s)) return 1900
  m = /(\d+)\s*-\s*(\d+)\s*yr/.exec(s)
  if (m) return 2000 - (Number(m[1]) + Number(m[2])) / 2
  return null
}

/** Membership (island pack id, moku key) of every land texel, from the boundary polygons. */
function membership(P, ahupuaa, moku) {
  const { W, H, N, grid, land } = P
  const ahuIdx = featureIndex(ahupuaa.features, grid)
  const islandCode = new Float32Array(N).fill(NaN)
  const codes = ISLANDS.map((i) => i.id)
  for (let o = 0; o < N; o++) {
    if (!land[o] || ahuIdx[o] < 0) continue
    islandCode[o] = codes.indexOf(ahupuaa.features[ahuIdx[o]].properties.islandId)
  }
  fillThroughMask(islandCode, land, W, H, 4000)
  const island = new Array(N)
  for (let o = 0; o < N; o++) island[o] = land[o] ? (islandCode[o] === islandCode[o] ? codes[islandCode[o]] : P.id) : null
  const mokuIdx = featureIndex(moku.features, grid)
  const mokuCode = new Float32Array(N).fill(NaN)
  for (let o = 0; o < N; o++) if (land[o] && mokuIdx[o] >= 0) mokuCode[o] = mokuIdx[o]
  fillThroughMask(mokuCode, land, W, H, 4000)
  const mokuKey = new Array(N)
  for (let o = 0; o < N; o++) mokuKey[o] = land[o] && mokuCode[o] === mokuCode[o] ? moku.features[mokuCode[o]].properties.mokuKey : null
  // the ahupuaʻa's name, filled through the land as the moku is (for the counts by land, AHUPUAA_COUNTS)
  const ahuCode = new Float32Array(N).fill(NaN)
  for (let o = 0; o < N; o++) if (land[o] && ahuIdx[o] >= 0) ahuCode[o] = ahuIdx[o]
  fillThroughMask(ahuCode, land, W, H, 4000)
  const ahupuaaName = new Array(N)
  for (let o = 0; o < N; o++) ahupuaaName[o] = land[o] && ahuCode[o] === ahuCode[o] ? ahupuaa.features[ahuCode[o]].properties.name : null
  return { island, mokuKey, ahupuaaName }
}

/**
 * The inputs of the field rules on one pack (the land, its rain and water,
 * membership, the agriculture zones, the valley-floor loʻi, the kuleana, the
 * pond shore and the 1900 cane and pineapple), which the crop classes read
 * too (tools/bake-crops.mjs); packInputs adds the rest.
 */
export function fieldInputs(P, src) {
  const { W, H, N, grid, land, metres, texelMetres } = P
  const s = samplesFor(texelMetres, 20, 8)
  const sea = new Uint8Array(N)
  for (let o = 0; o < N; o++) sea[o] = land[o] ? 0 : 1
  const dSea = distanceTo(sea, W, H, texelMetres)
  const slope = slopeOf(metres, land, W, H, texelMetres)
  const rain = Float32Array.from(P.rain)
  let rainNote = null
  if (!P.hasRain) {
    for (let o = 0; o < N; o++) if (land[o]) rain[o] = src.rainFallbackMm
    rainNote = `no rain image; every land texel is taken as ${src.rainFallbackMm} mm a year (dry), so no closed forest is modelled`
  }
  const { island, mokuKey, ahupuaaName } = membership(P, src.ahupuaa, src.moku)

  // traditional agriculture zones
  const tradAg = (type) => coverage(src.tradAg.features, grid, s, (f) => f.properties.AG_TYPE_HAWN === type)
  const loiZone = tradAg("Lo'i")
  const dryland = tradAg('Dryland')
  const agroforestry = tradAg('Agroforestry')

  // valley-floor loʻi from the pack: water, flat ground and wet-ground substrate
  const V = RULES.valley
  const R = routeWater(metres, land, W, H, texelMetres, rain, V.streamFlow)
  const wetGround = blur(coverage(src.geology.features, grid, s, (f) => WET_GROUND.includes(f.properties.name)), W, H, V.substrateBlur, texelMetres)
  const valleyLoi = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o] || !(R.height[o] < Infinity)) continue
    valleyLoi[o] =
      clamp01(wetGround[o] * V.substrateGain) *
      (1 - smoothstep(V.aboveStream[0], V.aboveStream[1], R.height[o])) *
      (1 - smoothstep(V.elevation[0], V.elevation[1], metres[o])) *
      (1 - smoothstep(V.slope[0], V.slope[1], slope[o])) *
      smoothstep(Math.log(V.flow[0]), Math.log(V.flow[1]), Math.log(R.streamQ[o] + 1)) *
      smoothstep(V.catchmentRain[0], V.catchmentRain[1], R.streamRain[o])
  }
  const loi = new Float32Array(N)
  for (let o = 0; o < N; o++) loi[o] = Math.max(loiZone[o], valleyLoi[o])

  // Land Commission Award parcels of kuleana size
  const kuleanaFeatures = src.lca.features.filter((f) => (f.properties._areaM2 ??= polygonArea(f.geometry)) < RULES.kuleanaMaxHa * 1e4)
  const kuleanaRaw = coverage(kuleanaFeatures, grid, s)
  const kuleana = blur(kuleanaRaw, W, H, RULES.kuleanaSigma, texelMetres)
  const kuleanaNear = blur(kuleanaRaw, W, H, RULES.kuleanaNearSigma, texelMetres)

  // fishpond shore: low land near the sea, beside a reef flat
  const shallow = new Float32Array(N)
  const seaF = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o]) {
      seaF[o] = 1
      shallow[o] = metres[o] >= RULES.pondShallowDepth ? 1 : 0
    }
  }
  const bs = blur(shallow, W, H, 350, texelMetres)
  const bsea = blur(seaF, W, H, 350, texelMetres)
  const pondShore = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o] || dSea[o] > RULES.pondShoreMetres || metres[o] > RULES.pondMaxElevation) continue
    const share = bsea[o] > 0.02 ? bs[o] / bsea[o] : 0
    pondShore[o] = smoothstep(RULES.pondShallowShare[0], RULES.pondShallowShare[1], share)
  }

  // mapped land use
  const sugar1900 = coverage(src.sugar1900.features, grid, s)
  const pine1900 = coverage(src.pine1900.features, grid, s)
  return {
    ...P,
    s,
    rain,
    rainNote,
    dSea,
    slope,
    island,
    mokuKey,
    ahupuaaName,
    wetGround,
    loi,
    loiZone,
    valleyLoi,
    dryland,
    agroforestry,
    kuleanaRaw,
    kuleana,
    kuleanaNear,
    pondShore,
    sugar1900,
    pine1900,
  }
}

/**
 * Everything the rules read on one pack: the land itself, the mapped
 * inputs rasterised onto its grid, and the CAH land cover.
 */
export async function packInputs(P, src, log) {
  const { W, H, N, grid, land, texelMetres } = P
  const t0 = Date.now()
  const F = fieldInputs(P, src)
  const { s } = F
  const crops2020 = coverage(src.ag2020.features, grid, s, (f) => !NOT_CROPS.includes(f.properties.crops_2020))
  const reserve = coverage(src.reserves.features, grid, s)

  // young lava
  const gs = Math.min(4, s)
  const geo = src.geology.features
  const yearOf = (f) => f.properties._year
  const post1778 = featureMean(geo.filter((f) => yearOf(f) > 1778), grid, gs, () => 1).cover
  const lava1778to1896 = featureMean(geo.filter((f) => yearOf(f) > 1778 && yearOf(f) <= 1896), grid, gs, () => 1).cover
  const ageAt1778 = featureMean(geo.filter((f) => yearOf(f) != null && yearOf(f) <= 1778), grid, gs, (f) => 1778 - yearOf(f))

  // CAH land cover
  const cs = samplesFor(texelMetres, 15, 10)
  const cah = await sampleCah(src.cahTif, grid, cs, { forest: CAH_FOREST, dev: CAH_DEVELOPED })

  // census block groups
  const bgIdx = featureIndex(src.blockGroups.features, grid)
  const bgCode = new Float32Array(N).fill(NaN)
  for (let o = 0; o < N; o++) if (land[o] && bgIdx[o] >= 0) bgCode[o] = bgIdx[o]
  fillThroughMask(bgCode, land, W, H, 400)
  const bg = new Int32Array(N).fill(-1)
  for (let o = 0; o < N; o++) if (land[o] && bgCode[o] === bgCode[o]) bg[o] = bgCode[o]

  log(`    inputs ${((Date.now() - t0) / 1000).toFixed(1)} s (polygons ${s}x${s}, land cover ${cs}x${cs} samples per texel)`)
  return {
    ...F,
    crops2020,
    reserve,
    post1778,
    lava1778to1896,
    ageAt1778,
    cah,
    bg,
  }
}

// ---------------------------------------------------------------------------
// Cultivation

const kuleanaPresence = (I, o) => clamp01(I.kuleanaNear[o] * 4)

/**
 * The terms whose largest is a land texel's cultivation at a keyframe, by
 * name, in a fixed order. The crop classes (tools/bake-crops.mjs) read which
 * term is the largest.
 */
export const CULTIVATION_TERMS = {
  contact: ['loi', 'dryland', 'agroforestry', 'pond', 'kuleana'],
  mahele: ['loi', 'dryland', 'agroforestry', 'pond', 'kuleana'],
  kingdom: ['cane', 'pineapple', 'loi', 'dryland', 'agroforestry', 'pond'],
  now: ['crops'],
}

/** The values of CULTIVATION_TERMS[key] at land texel o, written into `out` (as long as that list) and returned. */
export function cultivationTerms(I, key, o, out) {
  const k = clamp01(I.kuleana[o] * RULES.kuleanaGain)
  const kp = kuleanaPresence(I, o)
  if (key === 'contact') {
    out[0] = I.loi[o] * RULES.loi
    out[1] = I.dryland[o] * RULES.dryland
    out[2] = I.agroforestry[o] * RULES.agroforestry
    out[3] = I.pondShore[o] * RULES.fishpondShore
    out[4] = k
  } else if (key === 'mahele') {
    const kept = RULES.loiKept1853[0] + (RULES.loiKept1853[1] - RULES.loiKept1853[0]) * kp
    out[0] = I.loi[o] * kept
    out[1] = I.dryland[o] * RULES.dryland1853
    out[2] = I.agroforestry[o] * RULES.agroforestry1853
    out[3] = I.pondShore[o] * RULES.fishpondShore * RULES.ponds1853
    out[4] = k
  } else if (key === 'kingdom') {
    const kept = RULES.loiKept1896[0] + (RULES.loiKept1896[1] - RULES.loiKept1896[0]) * kp
    out[0] = I.sugar1900[o]
    out[1] = I.pine1900[o]
    out[2] = I.loi[o] * kept
    out[3] = I.dryland[o] * RULES.dryland1896
    out[4] = I.agroforestry[o] * RULES.agroforestry1896
    out[5] = I.pondShore[o] * RULES.fishpondShore * RULES.ponds1896
  } else if (key === 'now') {
    out[0] = I.crops2020[o]
  }
  return out
}

export function cultivation(I, key) {
  const { N, land } = I
  const out = new Float32Array(N)
  const t = new Float64Array(CULTIVATION_TERMS[key].length)
  for (let o = 0; o < N; o++) {
    if (!land[o]) continue
    out[o] = clamp01(Math.max(...cultivationTerms(I, key, o, t)))
  }
  return out
}

// ---------------------------------------------------------------------------
// Forest

/** How far a lava flow `age` years old has grown back to closed forest, by rain. */
function lavaRegrowth(age, mm) {
  const wet = smoothstep(1250, 3000, mm)
  const a0 = 400 + (60 - 400) * wet
  const a1 = 2000 + (300 - 2000) * wet
  return smoothstep(a0, a1, age)
}

export function forest(I, key, cult) {
  const { N, land, metres, rain, dSea } = I
  const out = new Float32Array(N)
  if (key === 'now') {
    for (let o = 0; o < N; o++) if (land[o]) out[o] = clamp01(I.cah.forest[o])
    return out
  }
  // contact: the potential, cleared below the forest line, never below what still stands
  const contact = new Float32Array(N)
  const cultContact = cult.contact
  const farmed = new Uint8Array(N)
  for (let o = 0; o < N; o++) farmed[o] = land[o] && cultContact[o] >= 0.3 ? 1 : 0
  const dFarm = distanceTo(farmed, I.W, I.H, I.texelMetres)
  for (let o = 0; o < N; o++) {
    if (!land[o]) continue
    const h = metres[o]
    const mm = rain[o]
    let pot = smoothstep(RULES.forestRainMm[0], RULES.forestRainMm[1], mm) * (1 - smoothstep(RULES.treeLineMetres[0], RULES.treeLineMetres[1], h))
    pot *= smoothstep(30, 250, dSea[o])
    // young lava: the share under a flow older than 1778 grows back with age and rain
    const young = I.ageAt1778.cover[o]
    if (young > 0) pot *= 1 - young + young * lavaRegrowth(I.ageAt1778.mean[o], mm)
    const remote = smoothstep(RULES.remoteMetres[0], RULES.remoteMetres[1], dFarm[o])
    const lowKeep = RULES.lowlandKeep + (RULES.lowlandRemoteKeep - RULES.lowlandKeep) * remote
    const keep = lowKeep + (1 - lowKeep) * smoothstep(RULES.clearedBelow, RULES.untouchedAbove, h)
    let f = pot * keep * (1 - cultContact[o])
    // native forest standing now, off flows younger than 1778, stood then too
    const standing = I.cah.forest[o] * (1 - I.post1778[o])
    f = Math.max(f, standing * (1 - 0.8 * cultContact[o]))
    contact[o] = clamp01(f)
  }
  if (key === 'contact') return contact
  // kingdom: between what still stands and the contact forest less the cane and new lava
  for (let o = 0; o < N; o++) {
    if (!land[o]) continue
    const upper = contact[o] * (1 - Math.max(I.sugar1900[o], I.pine1900[o])) * (1 - I.lava1778to1896[o])
    const lower = Math.min(upper, I.cah.forest[o])
    const k = RULES.outsideKeep + (RULES.reserveKeep - RULES.outsideKeep) * I.reserve[o]
    out[o] = clamp01(lower + (upper - lower) * k)
  }
  return out
}

// ---------------------------------------------------------------------------
// Settlement: weights here; bake-layers.mjs scales them to people

/**
 * Where people lived before contact: near their fields, along the shore, on
 * the kuleana, and thinly on the rest of the land, thinning inland. The
 * fields are the contact cultivation's terms with agroforestry counted at
 * RULES.settleAgroforestry of its own weight.
 */
export function contactWeight(I) {
  const { N, W, H, land, metres, dSea, slope, rain, texelMetres } = I
  const terms = CULTIVATION_TERMS.contact
  const t = new Float64Array(terms.length)
  const ia = terms.indexOf('agroforestry')
  const fields = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o]) continue
    cultivationTerms(I, 'contact', o, t)
    t[ia] *= RULES.settleAgroforestry
    fields[o] = clamp01(Math.max(...t))
  }
  const nearFields = blur(fields, W, H, 400, texelMetres)
  const out = new Float32Array(N)
  for (let o = 0; o < N; o++) {
    if (!land[o]) continue
    const h = metres[o]
    const coast = Math.exp(-dSea[o] / 600) * (1 - smoothstep(60, 150, h))
    const fresh = 0.4 + 0.6 * smoothstep(500, 1500, rain[o])
    const habitable = (1 - smoothstep(0.35, 0.7, slope[o])) * (1 - smoothstep(800, 1600, h))
    const young = 1 - 0.7 * (I.ageAt1778.cover[o] * (1 - smoothstep(50, 200, I.ageAt1778.mean[o] || 0)))
    const floor = RULES.settleFloor * Math.exp(-dSea[o] / RULES.settleFloorMetres)
    out[o] =
      (RULES.settleFields * nearFields[o] + RULES.settleCoast * coast * fresh + RULES.settleKuleana * clamp01(I.kuleana[o] * 3) + floor) *
      habitable *
      young
  }
  return out
}

/** Plantation camps and mills: near the 1900 cane, within about a kilometre. */
export function caneWeight(I) {
  const c = blur(I.sugar1900, I.W, I.H, 800, I.texelMetres)
  for (let o = 0; o < I.N; o++) if (!I.land[o]) c[o] = 0
  return c
}

/** A town's disc on this pack (Gaussian), 0 at sea. */
export function townWeight(I, town) {
  const { W, H, grid, land } = I
  const out = new Float32Array(W * H)
  const kx = I.grid.metresPerTexel[0] / I.grid.dLon
  const kz = I.grid.metresPerTexel[1] / I.grid.dLat
  for (let j = 0; j < H; j++) {
    const dz = (grid.latAt(j) - town.lat) * kz
    for (let i = 0; i < W; i++) {
      const o = j * W + i
      if (!land[o]) continue
      const dx = (grid.lonAt(i) - town.lon) * kx
      out[o] = Math.exp(-(dx * dx + dz * dz) / (2 * town.sigma * town.sigma))
    }
  }
  return out
}
