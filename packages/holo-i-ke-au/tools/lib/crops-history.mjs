// The record behind the crop classes (DATA.md, "Crops, on the era layers"):
// the classes, and which plantations, ranches, rice lands and coffee lands
// each keyframe draws, where, and on whose word. Every `sources` id is an
// entry of public/data/sources.json (tools/check-data.mjs holds them to it);
// the data layers the bake reads are in crops-sources.mjs.
//
// Places are given as the boundary file's own units, so the bake can check
// them: an ahupuaʻa by its gisId and name in boundaries/ahupuaa.geojson, a
// moku by its mokuKey. Points are lon/lat, from GNIS unless a note says.

/** The classes, as the contract numbers them. */
export const CLASSES = [
  { n: 0, key: 'none', label: 'nothing, or cultivation of no known kind' },
  { n: 1, key: 'loi', label: 'loʻi: wet taro' },
  { n: 2, key: 'dryland', label: 'dryland fields: sweet potato, dry taro, the leeward field systems' },
  { n: 3, key: 'rice', label: 'rice, in old loʻi and marsh' },
  { n: 4, key: 'cane', label: 'sugar cane' },
  { n: 5, key: 'pineapple', label: 'pineapple' },
  { n: 6, key: 'pasture', label: 'pasture, ranch land' },
  { n: 7, key: 'orchard', label: 'orchard, coffee, macadamia, truck crops' },
  { n: 8, key: 'lawn', label: 'lawn: parks, golf, open grounds' },
]
export const N_CLASSES = CLASSES.length - 1
export const C = Object.fromEntries(CLASSES.map((c) => [c.key, c.n]))

/** Classes that may stand where the keyframe's cultivation mask is 0, with why. */
export const UNCULTIVATED_OK = {
  6: 'grazing is not cultivation',
  8: 'lawn is not cultivation',
  // the 1896 cultivation mask leaves coffee out (its rule says Kona coffee has no map)
  7: 'at kingdom only: the cultivation mask leaves coffee out, so the class alone marks it',
  // the 1853 cultivation mask has no cane in it (nothing mapped it)
  4: 'at mahele only: the cultivation mask has no cane, so the class alone marks the plantations',
}

// ---------------------------------------------------------------------------
// mahele, 1853

/**
 * Plantations grinding cane by the Māhele, each drawn as cane land around
 * its mill (the bake's rule: the nearest flat, low land, preferring what was
 * still cane in 1900) at a nominal area, since no acreage for 1853 was found
 * for any of them.
 */
export const PLANTATION_ACRES_1853 = 300
export const PLANTATIONS_1853 = [
  {
    id: 'koloa',
    name: 'Kōloa',
    island: 'kauai',
    lon: -159.4683,
    lat: 21.906,
    since: 1835,
    sources: ['nrhp-koloa-mill', 'thrum-annual-1902'],
    note:
      'Ladd & Co. leased 980 acres at Kōloa in 1835, the plantation was under R. W. Wood from 1848, and a steam engine came in ' +
      '1853 (the National Register nomination, whose UTM reference for the mill is the point here); the Matanzas brought "an ' +
      'outfit for the Koloa and Lihue plantations" in 1853 (the Annual for 1902, history of H. Hackfeld & Co.)',
  },
  {
    id: 'lihue',
    name: 'Līhuʻe',
    island: 'kauai',
    lon: -159.36492,
    lat: 21.97409,
    since: 1853,
    sinceNote: 'in operation by 1853; founded earlier, year not read',
    sources: ['thrum-annual-1902'],
    note: 'outfitted with Kōloa in 1853 (the Annual for 1902); drawn around Līhuʻe town',
  },
  {
    id: 'hana',
    name: 'Hāna',
    island: 'maui',
    lon: -156.00849,
    lat: 20.77161,
    since: 1849,
    sources: ['to-hawaii-hana', 'nrhp-haiku-mill'],
    note:
      'George Wilfong’s plantation of 1849 (a travel site, tertiary); a Hāna company is among the five sugar companies on Maui ' +
      'in 1858 (the National Register nomination of the Haʻikū Mill); drawn around Hāna town',
  },
  {
    id: 'lahaina',
    name: 'Lāhainā',
    island: 'maui',
    lon: -156.67664,
    lat: 20.87429,
    since: 1840,
    sinceNote: 'the 1840s',
    sources: ['imagesofoldhawaii-pioneer-mill'],
    note:
      'sugar made in modest amounts through the 1840s and 1850s, before James Campbell’s plantation of 1860 (a history blog, ' +
      'tertiary); drawn around the town',
  },
]

/** Plantations named for the keyframe in the brief or the record but not drawn, and why. */
export const PLANTATIONS_1853_LEFT_OUT = [
  {
    name: 'East Maui Plantation (Kaluanui, Makawao)',
    why:
      'the Annual for 1902 has R. W. Wood’s “Koloa and East Maui plantations” in H. Hackfeld’s agency from the house’s early ' +
      'years, but the Makawao museum and Archipedia date the Kaluanui mill to 1857; left out until a reader settles it ' +
      '(MacLennan 1995 would)',
    sources: ['thrum-annual-1902', 'maclennan-1995-maui-plantations'],
  },
  { name: 'Hilo’s early mills', why: 'no source read places a mill grinding at Hilo in 1853', sources: ['maclennan-1995-maui-plantations'] },
  {
    name: 'ʻUlupalakua (Torbert)',
    why: 'Torbert’s lease of 1841 came with a sugar mill, but it ran again only from 1861 under Makee; 1853 draws the place as grazing',
    sources: ['mauiwine-ulupalakua-history'],
  },
]

/**
 * Ranches by 1853. Only the bounds are known (the ahupuaʻa named), not the
 * grazed land, so the bake takes the lower, drier part of the bounds
 * (crops-model.mjs, GRASS).
 */
export const RANCHES_1853 = [
  {
    id: 'parker',
    name: 'Parker, at Waimea',
    island: 'hawaii',
    ahupuaa: [[369, 'Waimea, Waikoloa']],
    since: 1847,
    sources: ['wikipedia-parker-ranch'],
    note: 'founded 1847 by John Palmer Parker on land granted for ridding the island of feral cattle; bounds: the ahupuaʻa of Waimea and Waikōloa',
  },
  {
    id: 'kualoa',
    name: 'Kualoa (Judd)',
    island: 'oahu',
    ahupuaa: [
      [181, 'Kualoa 1'],
      [179, 'Kualoa 2'],
    ],
    since: 1850,
    sources: ['wikipedia-kualoa-ranch'],
    note: 'G. P. Judd bought 622 acres of ranch land at Kualoa from Kamehameha III in 1850 (the two Kualoa units of the boundary file hold about 637 acres)',
  },
  {
    id: 'torbertsville',
    name: 'Torbertsville (ʻUlupalakua)',
    island: 'maui',
    ahupuaa: [[715, 'Papaʻanui']],
    since: 1841,
    sources: ['mauiwine-ulupalakua-history'],
    note:
      'L. L. Torbert’s lease of 1841, 2,087 acres with a sugar mill; Torbertsville sold beef, hogs and sheep, and went to Makee in ' +
      '1856 with 475 sheep, 350 goats and oxen; its mill ran again only from 1861. Bounds: the Papaʻanui unit of Honuaʻula that ' +
      'holds ʻUlupalakua',
  },
]

export const RANCHES_1853_LEFT_OUT = [
  {
    name: 'Kahoʻolawe',
    why: 'the first ranch lease is of 1858; the goats Vancouver left in 1793 ran wild, which is not a ranch',
    sources: ['kirc-history'],
  },
  { name: 'Kahuku (Oʻahu or Kaʻū)', why: 'no source read dates a ranch at either Kahuku to 1853; both stand in the 1902 list', sources: ['thrum-annual-1902'] },
  {
    name: 'Waimea, Kauaʻi',
    why: 'Knudsen’s ranch on the Waimea crown lands dates from after his arrival in 1856; nothing read puts a ranch there in 1853',
    sources: ['wikipedia-valdemar-knudsen'],
  },
]

// ---------------------------------------------------------------------------
// kingdom, 1896

/**
 * The ranches of the 1890s: the Hawaiian Annual for 1902’s “List of
 * Principal Stock and Sheep Ranches throughout the Islands” (p. 42, read on
 * the page image), as printed, with the district each lies in; plus Knudsen’s
 * on Kauaʻi, which the list omits. `bounds` is the moku (or, where the ranch
 * is named for one ahupuaʻa outside its listed district, that ahupuaʻa, or
 * the whole island); `grazed` is 'alum' (the 1978–80 grazing land read back
 * inside the bounds) or 'island' (a whole-island sheep ranch, which the
 * 1978–80 map cannot give back: Niʻihau and Kahoʻolawe are not in it, and
 * Lānaʻi was pineapple by then).
 */
export const RANCHES_1896 = [
  // Hawaiʻi
  { name: 'Greenwell’s', character: 'Cattle and Sheep', location: 'S. Kona, Hawaii', island: 'hawaii', moku: ['hawaii:Kona'] },
  { name: 'Huehue', character: 'Stock', location: 'N. Kona, Hawaii', island: 'hawaii', moku: ['hawaii:Kona'] },
  { name: 'Paris’', character: 'Stock', location: 'S Kona, Hawaii', island: 'hawaii', moku: ['hawaii:Kona'] },
  { name: 'Puuwaawaa', character: 'Stock', location: 'Kona, Hawaii', island: 'hawaii', moku: ['hawaii:Kona'] },
  { name: 'Kahuku', character: 'Stock', location: 'Kau, Hawaii', island: 'hawaii', moku: ['hawaii:Kaʻū'] },
  { name: 'Kapapala', character: 'Stock', location: 'Kau, Hawaii', island: 'hawaii', moku: ['hawaii:Kaʻū'] },
  { name: 'Waiohinu Agricultural Co.', character: 'Stock', location: 'Kau, Hawaii', island: 'hawaii', moku: ['hawaii:Kaʻū'] },
  { name: 'Parkers’', character: 'Stock', location: 'Waimea, Hawaii', island: 'hawaii', moku: ['hawaii:Kohala'] },
  { name: 'Puuhue', character: 'Stock', location: 'Kohala, Hawaii', island: 'hawaii', moku: ['hawaii:Kohala'] },
  { name: 'Puuloa', character: 'Sheep', location: 'Waimea, Hawaii', island: 'hawaii', moku: ['hawaii:Kohala'] },
  {
    name: 'Humuula',
    character: 'Sheep',
    location: 'Kohala, Hawaii',
    island: 'hawaii',
    ahupuaa: [[304, 'Humuʻula']],
    note: 'the list prints Kohala; the sheep station is on Humuʻula, which the boundary file puts in Hilo, so the bounds are that ahupuaʻa',
  },
  { name: 'Umikoa', character: 'Stock', location: 'Hamakua, Hawaii', island: 'hawaii', moku: ['hawaii:Hāmākua'] },
  // Maui
  { name: 'Erehwon Station', character: 'Cattle', location: 'Makawao, Maui', island: 'maui', moku: ['maui:Kula', 'maui:Hāmākuapoko', 'maui:Hāmākualoa'] },
  { name: 'Haleakala', character: 'Stock', location: 'Makawao, Maui', island: 'maui', moku: ['maui:Kula', 'maui:Hāmākuapoko', 'maui:Hāmākualoa'] },
  { name: 'Honolua', character: 'Stock', location: 'Honolua, Maui', island: 'maui', moku: ['maui:Kāʻanapali'] },
  {
    name: 'Kahikinui',
    character: 'Stock',
    location: 'Nuu, Maui',
    island: 'maui',
    moku: ['maui:Kahikinui', 'maui:Kaupō'],
    note: 'named for Kahikinui and listed at Nuʻu, which lies in Kaupō: both moku',
  },
  { name: 'Rose Ranch', character: 'Stock', location: 'Ulupalakua, Maui', island: 'maui', moku: ['maui:Honuaʻula'] },
  // Molokaʻi
  { name: 'Molokai Ranch', character: 'Stock and Sheep', location: 'Molokai', island: 'molokai', moku: ['molokai:Kona', 'molokai:Koʻolau'] },
  { name: 'Puuohoku', character: 'Cattle and Sheep', location: 'East Molokai', island: 'molokai', moku: ['molokai:Kona', 'molokai:Koʻolau'] },
  // Lānaʻi, Niʻihau and Kahoʻolawe, whole islands
  { name: 'Lanai Ranch', character: 'Sheep', location: 'Lanai', island: 'lanai', wholeIsland: true, grazed: 'island' },
  { name: 'Gay & Robinson', character: 'Sheep', location: 'Niihau', island: 'niihau', wholeIsland: true, grazed: 'island' },
  {
    name: 'the Kahoʻolawe ranch leases',
    character: 'Cattle and Sheep',
    location: 'Kahoolawe',
    island: 'kahoolawe',
    wholeIsland: true,
    grazed: 'island',
    notInList: true,
    sources: ['kirc-history'],
    note: 'not in the 1902 list; the government leased the island for ranching from 1858 to 1941, and by the late 1890s it carried 900 cattle and 15,000 sheep (the Kahoʻolawe Island Reserve Commission’s history)',
  },
  // Oʻahu
  { name: 'Honouliuli', character: 'Stock', location: 'Ewa, Oahu', island: 'oahu', moku: ['oahu:ʻEwa'] },
  { name: 'Kalawao', character: 'Stock', location: 'Ewa, Oahu', island: 'oahu', moku: ['oahu:ʻEwa'], note: 'as printed; in ʻEwa, so probably Kalauao' },
  { name: 'Waimalu', character: 'Stock', location: 'Ewa, Oahu', island: 'oahu', moku: ['oahu:ʻEwa'] },
  { name: 'Kahuku', character: 'Stock', location: 'Kahuku, Oahu', island: 'oahu', moku: ['oahu:Koʻolauloa'] },
  { name: 'Kaneohe', character: 'Stock', location: 'Koolau, Oahu', island: 'oahu', moku: ['oahu:Koʻolaupoko'] },
  { name: 'Leilehua', character: 'Stock', location: 'Waianae, Oahu', island: 'oahu', moku: ['oahu:Waiʻanae'] },
  { name: 'Makua', character: 'Stock', location: 'Waianae, Oahu', island: 'oahu', moku: ['oahu:Waiʻanae'] },
  { name: 'Mokuleia', character: 'Stock', location: 'Waialua, Oahu', island: 'oahu', moku: ['oahu:Waialua'] },
  // Kauaʻi
  { name: 'Rice’s', character: 'Stock', location: 'Lihue, Kauai', island: 'kauai', moku: ['kauai:Puna'] },
  {
    name: 'Knudsen’s, on the Waimea crown lands',
    character: 'Stock',
    location: 'Waimea, Kauai',
    island: 'kauai',
    moku: ['kauai:Kona'],
    notInList: true,
    sources: ['wikipedia-valdemar-knudsen'],
    note: 'not in the 1902 list; Knudsen took a thirty-year lease of crown lands in Waimea district and established a ranch there (Wikipedia, tertiary)',
  },
]
export const RANCHES_1896_SOURCE = 'thrum-annual-1902'

/**
 * Rice at its height. The figures: about 1,000 acres in 1875, 7,420 in 1890,
 * 9,130 in 1900, 9,425 in 1909 (Glick, after Coulter and Chun); in 1892
 * Hanalei and Waiʻoli 750 acres, Mokulēʻia 738, Kailua and Waimānalo 400,
 * the largest three (the Hanalei Pier nomination, after Coulter and Chun).
 * Where the rice lay: “the lowest flats found at the outlets of valleys and
 * close on the sea … often too low and swampy for cane culture” (the Annual
 * for 1900), “at or near sea level along the coast” (Kelley 1914). The
 * districts are those an opened source puts rice in; `acres1892` caps a
 * district at its figure.
 */
export const RICE_TOTALS = { 1875: 1000, 1890: 7420, 1900: 9130, 1909: 9425 }
export const RICE_TOTALS_SOURCE = 'glick-1980-sojourners'
export const RICE_1896 = [
  {
    id: 'hanalei',
    name: 'Hanalei and Waiʻoli',
    island: 'kauai',
    ahupuaa: [
      [4, 'Hanalei'],
      [20, 'Waiʻoli'],
    ],
    acres1892: 750,
    sources: ['nrhp-hanalei-pier', 'kelley-1914-rice-soils'],
  },
  {
    id: 'mokuleia',
    name: 'Mokulēʻia',
    island: 'oahu',
    ahupuaa: [
      [163, 'Mokulēʻia 1'],
      [171, 'Mokulēʻia 2'],
    ],
    acres1892: 738,
    sources: ['nrhp-hanalei-pier'],
    note: 'cane by 1900 (the Waialua plantation) and on the 1927 sheet; rice here may take 1900 cane land, since the keyframe is 1896',
  },
  {
    id: 'kailua-waimanalo',
    name: 'Kailua and Waimānalo',
    island: 'oahu',
    ahupuaa: [
      [205, 'Kailua'],
      [725, 'Waimānalo'],
    ],
    acres1892: 400,
    sources: ['nrhp-hanalei-pier', 'kelley-1914-rice-soils'],
  },
  {
    id: 'ewa',
    name: 'the ʻEwa shore',
    island: 'oahu',
    moku: ['oahu:ʻEwa'],
    sources: ['glick-1980-sojourners', 'usgs-topo-1927-oahu'],
    note: 'Damon in 1882: rice “a fringe bordering the shore for a long distance” west of town, the fields stretching every way at ʻEwa, a large plantation at Honouliuli; the 1927 sheet still shows diked fields with the marsh symbol at Waiawa’s mouth',
  },
  { id: 'moanalua', name: 'Moanalua', island: 'oahu', ahupuaa: [[210, 'Moanalua']], sources: ['glick-1980-sojourners', 'kelley-1914-rice-soils'], note: 'a rice plantation at Moanalua in 1891 (Glick); Kelley sampled rice soil at Fort Shafter, beside it' },
  {
    id: 'waikiki',
    name: 'Waikīkī',
    island: 'oahu',
    ahupuaa: [[221, 'Waikīkī']],
    sources: ['kelley-1914-rice-soils', 'usgs-topo-1927-oahu'],
    note: 'Kelley sampled Waikīkī’s rice soils; the 1927 sheet shows the flats already drained by the Ala Wai',
  },
  {
    id: 'kaneohe',
    name: 'Kāneʻohe and Heʻeia',
    island: 'oahu',
    ahupuaa: [
      [197, 'Kāneʻohe'],
      [206, 'Kāneʻohe'],
      [194, 'Heʻeia'],
      [201, 'Heʻeia'],
    ],
    sources: ['glick-1980-sojourners', 'kelley-1914-rice-soils'],
    note: 'a rice plantation at Heʻeia in 1888 (Glick); Kelley sampled Kāneʻohe',
  },
  {
    id: 'waiahole',
    name: 'Waiāhole and Waikāne',
    island: 'oahu',
    ahupuaa: [
      [189, 'Waiāhole'],
      [186, 'Waikane'],
    ],
    sources: ['kelley-1914-rice-soils', 'usgs-topo-1927-oahu'],
    note: 'Kelley sampled Waiāhole; the 1927 sheet marks the Waikāne flats behind the shore road with the marsh symbol in rows',
  },
  {
    id: 'kauai-east',
    name: 'Wailua, Kapaʻa and Hulēʻia',
    island: 'kauai',
    ahupuaa: [
      [35, 'Wailua'],
      [34, 'Kapaʻa'],
      [50, 'Niumalu'],
      [56, 'Niumalu'],
    ],
    sources: ['nrhp-hanalei-pier'],
    note: 'rice farmers at Hulēʻia, Wailua and Kapaʻa lost their crops to the borer in 1928–29 (the nomination); taken as rice lands in 1896 too. Hulēʻia’s flats are drawn as Niumalu’s',
  },
]
/** Places the record puts rice in but no district here draws, and why. */
export const RICE_LEFT_OUT = [
  {
    name: 'Maui and Hawaiʻi Island (Waipiʻo, Wailuku and others)',
    why: 'Damon saw rice on both in 1882 (Glick), but no source read names the valleys or the acres; Coulter and Chun would',
    sources: ['glick-1980-sojourners', 'coulter-chun-1937-rice'],
  },
  {
    name: 'Koʻolauloa (Kahana, Punaluʻu, Hauʻula, Lāʻie) and Waialua beyond Mokulēʻia',
    why: 'no source read names them; Kelley’s “Kalaunui” sample may be Kaluanui in Koʻolauloa, but the name is not certain',
    sources: ['kelley-1914-rice-soils', 'coulter-chun-1937-rice'],
  },
  {
    name: 'Mānoa and Pālolo above the coastal flats',
    why: 'a rice plantation in Mānoa in 1895 (Glick), but the valley floors lie above the coastal flats the rule draws, and no acreage was found',
    sources: ['glick-1980-sojourners'],
  },
  {
    name: 'Rice at 1853',
    why:
      'rice growing was started in 1858 by H. Holstein of the Royal Hawaiian Agricultural Society, and Chinese planters took it ' +
      'up in the 1860s (Glick): nothing to draw at the Māhele',
    sources: ['glick-1980-sojourners'],
  },
]

/**
 * Coffee in 1896. Kona: the 1978–80 coffee read back inside the moku, the
 * belt that stayed in coffee (the 1892 estimate was about 1,000 acres of old
 * coffee in North and South Kona and 150 acres new: the Annual for 1895).
 * Olaʻa: the new coffee district along the Volcano Road, 1,500 to 2,500 feet
 * up (the Annual for 1895); in 1897 it had 1,344 acres over three years old,
 * 2,749½ of one to three, 1,821½ under one (the Annual for 1900), so about
 * 4,094 acres by the end of 1896; drawn as the land nearest the road in
 * that band.
 */
export const COFFEE_1896 = {
  kona: { moku: 'hawaii:Kona', acres1892: 1150, sources: ['thrum-annual-1895'] },
  olaa: {
    ahupuaa: [[419, 'ʻŌlaʻa']],
    elevation: [457, 762],
    acres: 1344 + 2749.5,
    road: [
      [-155.04843, 19.60212], // Kurtistown
      [-155.10436, 19.55267], // Mountain View
      [-155.15138, 19.48782], // Glenwood
    ],
    sources: ['thrum-annual-1895', 'thrum-annual-1900'],
  },
  leftOut: [
    {
      name: 'Hāmākua, Hilo and Puna outside Olaʻa',
      why: 'about 170 acres in Hāmākua and Hilo and 100 in Puna in 1892 (the Annual for 1895); too small and too scattered to place',
      sources: ['thrum-annual-1895'],
    },
  ],
}

/** The sources the crops entry cites that are only wanted (not opened), for the manifest and check-data. */
export const WANTED = ['coulter-chun-1937-rice', 'coulter-1931-land-1853', 'maclennan-1995-maui-plantations', 'char-1988-chinese-sites']
