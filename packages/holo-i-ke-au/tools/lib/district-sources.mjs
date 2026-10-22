// Where a district pack's inputs come from (DATA.md, "District packs"), and
// how to fetch them into the downloads directory. Downloads are untrusted
// data: nothing here executes them, the bake only parses them.
//
// A district is a box on one island, baked finer than its island pack from
// the best open elevation there is. For Nuʻuanu and Koʻolaupoko that is the
// 2022–23 Oʻahu lidar, published by the USGS at its original 0.5 m as 500 m
// GeoTIFF tiles in UTM zone 4; the Nuʻuanu box needs about 560 of them
// (about 1.4 GB), the Koʻolaupoko box about 1,420 (about 3.2 GB). The sea
// floor comes from NOAA's 1/9 arc-second topobathymetric DEM, which holds the
// reef flats and the dredged harbour; GMRT, as the island packs use, stands
// by for any gap in it. The rest is what the island bake and the layers bake
// already read: the Rainfall Atlas, the State geologic map (here only its
// fill unit), and the Government Survey maps of Oʻahu (1881, 1899, 1902) and
// the U.S. Geological Survey's of 1927 and 1938 as the State serves them,
// georeferenced, from its Historic_Maps and SoH_Maps image services; plus the
// State's stream lines, to check the routed streams against. A district may also read the Government Survey's
// registered maps as OHA's Kīpuka database serves them (scans, not
// georeferenced): Koʻolaupoko's bay and shores are read off G. E. G.
// Jackson's surveys of 1882 and 1884 (district-koolaupoko.mjs).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchTo } from './fetch.mjs'
import { fetchManyTo } from './fetch-many.mjs'
import { packGrid } from './geo.mjs'
import { utm4 } from './layers-raster.mjs'
import { VECTORS } from './layers-sources.mjs'
import { BATHY, downloadRain, gmrtUrl } from './sources.mjs'

// ---------------------------------------------------------------------------
// The districts

export const DISTRICT_LONG_SIDE = 2048

export const DISTRICTS = {
  nuuanu: {
    id: 'nuuanu',
    name: 'Nuʻuanu',
    island: 'oahu',
    // the moku the district lies in (the app's choice between overlapping boxes)
    moku: 'Kona',
    // West: Kalihi Kai and the east side of Keʻehi lagoon (Kalihi's ahupuaʻa
    // reaches 157.891 W), so Sand Island and Mokauea are whole. East: past
    // Mānoa's east ridge and 1.4 km past the Pali lookout (157.793 W). South:
    // the reef flat off Kakaʻako and Waikīkī and a little deep water beyond
    // it. North: 1.6 km past the lookout (21.367 N), over the windward drop;
    // Kalihi's head (21.385 N) is cut by a few hundred metres. About 12.3 by
    // 12.4 km.
    bbox: [-157.897, 21.269, -157.779, 21.381],
    longSide: DISTRICT_LONG_SIDE,
    // Cut through what the bare earth keeps across the trunks: the reservoir
    // in upper Nuʻuanu and its dam, and the crossings of the lower channels.
    // Found by --find-breaches on a bake without them (each runs from the
    // lowest texel of the pond on the trunk, over the spill, to the first
    // texel below it) and carved in this order.
    breaches: [
      { name: 'Nuʻuanu Stream at 21.3576 N 157.8036 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 4.8 m deep here', points: [[-157.80361, 21.357566], [-157.803842, 21.357457], [-157.804016, 21.357238], [-157.804074, 21.35702], [-157.804074, 21.356801], [-157.804132, 21.356582], [-157.80419, 21.356363], [-157.80419, 21.356145], [-157.80419, 21.355926], [-157.80419, 21.355707], [-157.80419, 21.355488], [-157.80419, 21.35527], [-157.80419, 21.355051], [-157.80419, 21.354832], [-157.80419, 21.354613], [-157.80419, 21.354395], [-157.804248, 21.354176], [-157.804422, 21.353957], [-157.804654, 21.353738], [-157.804886, 21.35352], [-157.805118, 21.353301], [-157.80535, 21.353082], [-157.805524, 21.352863], [-157.80564, 21.352645], [-157.805872, 21.352426], [-157.806104, 21.352207], [-157.806335, 21.351988], [-157.806567, 21.35177], [-157.806683, 21.351551], [-157.806625, 21.351332], [-157.806741, 21.351113], [-157.806973, 21.350895], [-157.807147, 21.350676], [-157.807321, 21.350457], [-157.807437, 21.350348]] },
      { name: 'Nuʻuanu Stream at 21.3546 N 157.8042 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 4.3 m deep here', points: [[-157.80419, 21.354559], [-157.80419, 21.35434], [-157.804306, 21.354121], [-157.80448, 21.353902], [-157.804712, 21.353684], [-157.804944, 21.353465], [-157.805176, 21.353246], [-157.805408, 21.353027], [-157.805524, 21.352809], [-157.805698, 21.35259], [-157.80593, 21.352371], [-157.806162, 21.352152], [-157.806393, 21.351934], [-157.806567, 21.351715], [-157.806683, 21.351496], [-157.806625, 21.351277], [-157.806799, 21.351059], [-157.807031, 21.35084], [-157.807147, 21.350621], [-157.807379, 21.350402], [-157.807437, 21.350348]] },
      { name: 'Nuʻuanu Stream at 21.3535 N 157.8049 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 2.5 m deep here', points: [[-157.804886, 21.35352], [-157.805118, 21.353301], [-157.80535, 21.353082], [-157.805524, 21.352863], [-157.80564, 21.352645], [-157.805814, 21.35248]] },
      { name: 'Nuʻuanu Stream at 21.3524 N 157.8059 W', why: 'the reservoir in upper Nuʻuanu: its basin and dam stand in the bare earth, and the trunk ponded 3.8 m deep here', points: [[-157.805872, 21.352426], [-157.806104, 21.352207], [-157.806335, 21.351988], [-157.806567, 21.35177], [-157.806683, 21.351551], [-157.806625, 21.351332], [-157.806741, 21.351113], [-157.806973, 21.350895], [-157.807147, 21.350676], [-157.807321, 21.350457], [-157.807379, 21.350402]] },
      { name: 'Nuʻuanu Stream at 21.3346 N 157.8332 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.8 m deep behind it', points: [[-157.833245, 21.334598], [-157.833476, 21.334434], [-157.833708, 21.334215], [-157.83394, 21.333996], [-157.833998, 21.333887]] },
      { name: 'Nuʻuanu Stream at 21.3339 N 157.8343 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.834288, 21.333887], [-157.83452, 21.333941], [-157.834752, 21.333996]] },
      { name: 'Nuʻuanu Stream at 21.3331 N 157.8385 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.838464, 21.333121], [-157.838696, 21.333066], [-157.838928, 21.333066], [-157.839044, 21.333012]] },
      { name: 'Nuʻuanu Stream at 21.3316 N 157.8410 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.841016, 21.331645], [-157.841248, 21.33148], [-157.84148, 21.331426], [-157.841712, 21.331371], [-157.841944, 21.331262], [-157.842118, 21.331043]] },
      { name: 'Nuʻuanu Stream at 21.3291 N 157.8432 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.0 m deep behind it', points: [[-157.843219, 21.329074], [-157.843451, 21.328855], [-157.843509, 21.328746]] },
      { name: 'Nuʻuanu Stream at 21.3209 N 157.8516 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.851571, 21.320871], [-157.851802, 21.320871], [-157.852034, 21.320816], [-157.85215, 21.320707]] },
      { name: 'Kapālama Stream at 21.3510 N 157.8360 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.83597, 21.351004], [-157.836202, 21.350895], [-157.83626, 21.35084]] },
      { name: 'Kapālama Stream at 21.3464 N 157.8488 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.848787, 21.346355], [-157.848961, 21.346301]] },
      { name: 'Kapālama Stream at 21.3394 N 157.8656 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.865605, 21.33941], [-157.865837, 21.339191], [-157.865895, 21.339082]] },
      { name: 'Kalihi Stream at 21.3649 N 157.8415 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.84148, 21.364895], [-157.841712, 21.364676], [-157.841828, 21.364566]] },
      { name: 'Kalihi Stream at 21.3372 N 157.8755 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.8 m deep behind it', points: [[-157.875522, 21.337168], [-157.875754, 21.337059], [-157.875986, 21.336949], [-157.876218, 21.336785], [-157.876276, 21.33673]] },
      { name: 'Kalihi Stream at 21.3369 N 157.8760 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.876044, 21.336895], [-157.876218, 21.336785]] },
      { name: 'Kalihi Stream at 21.3366 N 157.8765 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 4.5 m deep behind it', points: [[-157.87645, 21.336566], [-157.876682, 21.336348], [-157.876914, 21.336129], [-157.877146, 21.33591], [-157.877204, 21.335691], [-157.87732, 21.335582], [-157.877552, 21.335527], [-157.877784, 21.335527]] },
      { name: 'Kalihi Stream at 21.3355 N 157.8779 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.8779, 21.335527], [-157.878132, 21.335363], [-157.878364, 21.335145], [-157.878596, 21.33498], [-157.878828, 21.334926], [-157.879059, 21.334762], [-157.879291, 21.334543], [-157.879523, 21.334324], [-157.879755, 21.334215], [-157.879987, 21.334215], [-157.880219, 21.33427], [-157.880451, 21.334434], [-157.880683, 21.334652], [-157.880915, 21.334707], [-157.881147, 21.334598], [-157.881263, 21.334488]] },
      { name: 'Mānoa Stream at 21.3242 N 157.8020 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.0 m deep behind it', points: [[-157.801986, 21.324152], [-157.802102, 21.323934], [-157.802276, 21.323715], [-157.802392, 21.323496], [-157.802508, 21.323277], [-157.802334, 21.323059], [-157.802334, 21.32284], [-157.80245, 21.322621], [-157.802508, 21.322402], [-157.802682, 21.322184], [-157.80274, 21.321965], [-157.802798, 21.32191]] },
      { name: 'Mānoa Stream at 21.3236 N 157.8024 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.3 m deep behind it', points: [[-157.802392, 21.323551], [-157.802508, 21.323332], [-157.802334, 21.323113], [-157.802334, 21.322895], [-157.802392, 21.322676], [-157.802508, 21.322457], [-157.802566, 21.322293]] },
    ],
    // Trunks the check follows, by their names in the State's stream layer
    // (Mānoa is a tributary of the Ala Wai system there). Each starts on its
    // mapped main stem and must keep to the mapped lines down to tidewater.
    streams: [
      { name: 'Nuʻuanu Stream', stream: 'Nuuanu', trib: 'Nuuanu' },
      { name: 'Kapālama Stream', stream: 'Kapalama', trib: 'Kapalama' },
      { name: 'Kalihi Stream', stream: 'Kalihi', trib: 'Kalihi' },
      { name: 'Mānoa Stream', stream: 'Ala Wai', trib: 'Manoa' },
    ],
    // the Government Survey sheets exported over the box, and at what pixel
    maps: [1881, 1899],
    mapPixel: 5,
    // what the sources' notes name as water inside the coast and as charted sea
    inlandWater: 'the Ala Wai, the tidal reaches of the streams, lagoons',
    chartedSea: 'the harbour and channels',
  },
  koolaupoko: {
    id: 'koolaupoko',
    name: 'Koʻolaupoko',
    island: 'oahu',
    moku: 'Koʻolaupoko',
    // The whole moku, from Kualoa to Makapuʻu: its ahupuaʻa reach from
    // 157.8978 W (the crest behind Waikāne) to 157.6494 W (Makapuʻu Point)
    // and from 21.3085 N (Makapuʻu) to 21.5354 N (Kualoa), and the
    // district's features from 157.896 W to 157.681 W and 21.326 N to
    // 21.521 N. West: the crest behind Waikāne and Waiāhole. East: 650 m of
    // sea past Makapuʻu Point. South: 700 m past the point. North: 300 m
    // past Kualoa's boundary with Kaʻaʻawa. About 26.6 by 26.1 km, so 12.98
    // m a texel on 2048: inside the 13 m that lets the north (Kahaluʻu,
    // Waiāhole, Kualoa) in with the rest (a box padded to 700 m all round
    // would be 13.5 m). The moku runs north-west to south-east, so the box
    // also takes in the leeward side behind the crest, Honolulu's harbour at
    // its south-west corner, and most of the nuuanu box.
    bbox: [-157.898, 21.302, -157.643, 21.538],
    longSide: DISTRICT_LONG_SIDE,
    // Found by --find-breaches on a bake without them and carved in this
    // order, as for nuuanu: the crossings the bare earth keeps over the
    // windward trunks.
    breaches: [
      { name: 'Kāneʻohe Stream at 21.3923 N 157.8046 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.5 m deep behind it', points: [[-157.80461, 21.392286], [-157.804113, 21.392755], [-157.80374, 21.393224], [-157.803616, 21.393692], [-157.803492, 21.394161], [-157.803864, 21.39463]] },
      { name: 'Kāneʻohe Stream at 21.4005 N 157.8030 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 8.5 m deep behind it', points: [[-157.802995, 21.400489], [-157.802995, 21.400958], [-157.802995, 21.401426], [-157.802995, 21.401895], [-157.802995, 21.402364], [-157.802746, 21.402833], [-157.802249, 21.403301], [-157.801876, 21.40377]] },
      { name: 'Kāneʻohe Stream at 21.4119 N 157.7953 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.79529, 21.411856], [-157.794793, 21.411856], [-157.794669, 21.411387], [-157.794544, 21.41127]] },
      { name: 'Heʻeia Stream at 21.4172 N 157.8167 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 6.0 m deep behind it', points: [[-157.816664, 21.417246], [-157.816167, 21.417715], [-157.81567, 21.418184], [-157.815297, 21.418652], [-157.8148, 21.419121], [-157.814551, 21.419121]] },
      { name: 'Heʻeia Stream at 21.4189 N 157.8150 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.8 m deep behind it', points: [[-157.815048, 21.418887], [-157.814676, 21.419121]] },
      { name: 'Waikāne Stream at 21.5004 N 157.8730 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.5 m deep behind it', points: [[-157.872957, 21.500446], [-157.87246, 21.500329], [-157.872212, 21.500446]] },
      { name: 'Maunawili Stream at 21.3589 N 157.7661 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.766087, 21.358889], [-157.765839, 21.35924]] },
      { name: 'Kaʻelepulu Stream at 21.3572 N 157.7378 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.5 m deep behind it', points: [[-157.737754, 21.357248], [-157.737381, 21.357483]] },
      { name: 'Kaʻelepulu Stream at 21.3578 N 157.7373 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.737257, 21.357834], [-157.737133, 21.358186]] },
      { name: 'Kaʻelepulu Stream at 21.3591 N 157.7369 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.736884, 21.359123], [-157.736511, 21.35924]] },
      { name: 'Kaʻelepulu Stream at 21.3609 N 157.7358 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 5.0 m deep behind it', points: [[-157.735766, 21.360881], [-157.73589, 21.36135], [-157.736014, 21.361818], [-157.735641, 21.362053]] },
      { name: 'Kaʻelepulu Stream at 21.3615 N 157.7360 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.0 m deep behind it', points: [[-157.736014, 21.361467], [-157.73589, 21.361936], [-157.735766, 21.361936]] },
      { name: 'Kaʻelepulu Stream at 21.3630 N 157.7354 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 6.3 m deep behind it', points: [[-157.735393, 21.36299], [-157.735269, 21.363459], [-157.735393, 21.363928]] },
      { name: 'Kaʻelepulu Stream at 21.3670 N 157.7363 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.736263, 21.366975], [-157.736139, 21.367443], [-157.736014, 21.367678]] },
      { name: 'Kaʻelepulu Stream at 21.3698 N 157.7361 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.8 m deep behind it', points: [[-157.736139, 21.369787], [-157.736139, 21.370256], [-157.736139, 21.370373]] },
      { name: 'Heʻeia Stream at 21.4191 N 157.8147 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.814676, 21.419121], [-157.814179, 21.419238]] },
      { name: 'Kaʻelepulu Stream at 21.3582 N 157.7371 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.5 m deep behind it', points: [[-157.737133, 21.358186], [-157.737257, 21.358537]] },
      { name: 'Kaʻelepulu Stream at 21.3639 N 157.7354 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 3.5 m deep behind it', points: [[-157.735393, 21.363928], [-157.735641, 21.364162]] },
      { name: 'Waiāhole Stream at 21.4815 N 157.8484 W', why: 'the lower channel to the mouth, narrower than a texel behind the coastal road, carved along the State’s line: without it the routed trunk turns north into the cove 350 m short of the mouth', points: [[-157.848434, 21.481492], [-157.84784, 21.481525], [-157.846952, 21.481476], [-157.84634, 21.48168], [-157.845622, 21.481592], [-157.844998, 21.481492], [-157.844345, 21.481564], [-157.843645, 21.481938], [-157.843386, 21.482583], [-157.84328, 21.483403], [-157.842916, 21.483827], [-157.842786, 21.48418], [-157.842862, 21.484571]] },
      { name: 'Kāneʻohe Stream at 21.3905 N 157.8080 W', why: 'a road fill over the channel (a crossing the bare earth keeps); the trunk ponded 2.0 m deep behind it. Cut along the channel to the reach below, as the short breaches found here stopped on the fill', points: [[-157.80804, 21.3905], [-157.80766, 21.3909], [-157.80741, 21.3913], [-157.80729, 21.3916], [-157.80679, 21.392], [-157.80604, 21.3922], [-157.8050, 21.3925]] },
      { name: 'Kāneʻohe Stream at 21.3893 N 157.8084 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.808414, 21.389296], [-157.808289, 21.389766], [-157.80804, 21.390236], [-157.807916, 21.390705], [-157.807418, 21.391175], [-157.807418, 21.39141]] },
      { name: 'Kāneʻohe Stream at 21.3988 N 157.8024 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.802437, 21.398807], [-157.802562, 21.399277]] },
      { name: 'Kāneʻohe Stream at 21.3993 N 157.8026 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.5 m deep behind it', points: [[-157.802562, 21.399277], [-157.802686, 21.399629]] },
      { name: 'Kāneʻohe Stream at 21.4113 N 157.7946 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 1.8 m deep behind it', points: [[-157.794593, 21.411253], [-157.794095, 21.411018], [-157.793597, 21.411018], [-157.793348, 21.411135]] },
      { name: 'Heʻeia Stream at 21.4195 N 157.8135 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 2.0 m deep behind it', points: [[-157.813519, 21.419472], [-157.813394, 21.419706]] },
      { name: 'Kaʻelepulu Stream at 21.3621 N 157.7357 W', why: 'a crossing the bare earth keeps over the channel (culvert or bridge fill), or a channel narrower than a texel; the trunk ponded 4.5 m deep behind it', points: [[-157.735699, 21.362056], [-157.73545, 21.362291]] },
    ],
    streams: [
      { name: 'Kāneʻohe Stream', stream: 'Kaneohe', trib: 'Kaneohe' },
      { name: 'Heʻeia Stream', stream: 'Heeia', trib: 'Heeia' },
      { name: 'Kahaluʻu Stream', stream: 'Kahaluu', trib: 'Kahaluu' },
      { name: 'Waiāhole Stream', stream: 'Waiahole', trib: 'Waiahole' },
      { name: 'Waikāne Stream', stream: 'Waikane', trib: 'Waikane' },
      // Maunawili ends in the open water of Kawainui marsh, at the Hāmākua canal, which the State draws as straight strokes
      { name: 'Maunawili Stream', stream: 'Kawainui', trib: 'Maunawili', near: 100 },
      { name: 'Kaʻelepulu Stream', stream: 'Kaelepulu', trib: 'Kaelepulu' },
      { name: 'Waimānalo Stream', stream: 'Waimanalo', trib: 'Waimanalo' },
    ],
    // (the sheets are served at 1.2 m (1927), 5.3 m (1938) and 7.6 to 10.2 m;
    // a 5 m export of this box would pass the services' 4,100 px limit)
    maps: [1881, 1902, 1927, 1938],
    mapPixel: 7,
    registered: [1140, 1848, 1345, 1019],
    patchModule: 'district-koolaupoko.mjs',
    // the fishpond walls of the bay (Heʻeia, Moliʻi, Kahouna) stand a few metres wide in the
    // water: keep them as land (district-bake.mjs, walls)
    walls: true,
    // the survey has no tile over these, and they lie too near the sea for the gap rule
    islets: 'Mokumanu, Kekepa, Mokolea and Kapapa, the Mokulua islands, Mānana and Kāohikaipu, and the breakwater of the pier at Makapuʻu, which the bare earth leaves out as a structure',
    inlandWater: 'the stream mouths, the canals and the open water of the ponds and marshes',
    chartedSea: 'the bay’s channels and dredged areas',
  },
}

export function districtGrid(d) {
  return packGrid(d.bbox, { padMetres: 0, longSide: d.longSide })
}

// ---------------------------------------------------------------------------
// Sources

export const LIDAR = {
  id: 'usgs-3dep-opr-hi-noaamauioahu-2020-b20',
  title: 'USGS 3D Elevation Program lidar HI_NOAAMauiOahu_2020_B20, bare-earth DEM at its original 0.5 m, 500 m GeoTIFF tiles (NAD83(PA11) / UTM zone 4N)',
  project: 'HI_NOAAMauiOahu_2020_B20',
  base: 'https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/OPR/Projects/HI_NOAAMauiOahu_2020_B20',
  parts: ['HI_NOAAMauiOahu_1_B20', 'HI_NOAAMauiOahu_2_B20', 'HI_NOAAMauiOahu_3_B20'],
  licence: 'public domain (U.S. Geological Survey, 3D Elevation Program); collected for NOAA',
  cell: 0.5,
  tile: 500,
}

export const CUDEM = {
  id: 'noaa-ncei-cudem-ninth-hawaii',
  title: 'NOAA NCEI Continuously Updated DEM (CUDEM), 1/9 arc-second topobathymetric tiles, Hawaiʻi (Digital Coast 9428), WGS 84, mean sea level',
  base: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428',
  list: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/urllist9428.txt',
  page: 'https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/index.html',
  licence:
    'public domain (NOAA National Centers for Environmental Information); cite Amante, C.J., Love, M., Carignan, K., Sutherland, M.G., ' +
    'MacFerrin, M. and Lim, E. (2023), Continuously Updated Digital Elevation Models (CUDEMs) to Support Coastal Inundation Modeling, ' +
    'Remote Sensing 15(6), 1702, doi:10.3390/rs15061702',
}

export const FILL = {
  id: 'hawaii-gis-geologic-units-fill',
  title: 'State of Hawaiʻi GIS, Geologic Units (Terrestrial MapServer layer 28), after Sherrod and others (USGS 2007): the fill unit (Qf) in the district box',
  service: VECTORS.geology.service,
  where: "name = 'Fill'",
  metadata: VECTORS.geology.metadata,
  licence: VECTORS.geology.licence,
  note:
    'artificial fill, mapped by Sherrod and others (2007) from the earlier Oʻahu geologic maps: the made ground of the waterfront, ' +
    'Sand Island, Kakaʻako, Waikīkī and the Ala Wai, and the fill over ponds and marsh behind them. It does not say when, or what lay beneath',
}

export const STREAMS = {
  id: 'hawaii-gis-streams-dar',
  title: 'State of Hawaiʻi GIS, Streams (DAR), FreshWater MapServer layer 1, in the district box',
  service: 'https://geodata.hawaii.gov/arcgis/rest/services/FreshWater/MapServer/1',
  licence: 'State of Hawaiʻi Statewide GIS Program open data; no warranty of positional or thematic accuracy',
  note: 'the Division of Aquatic Resources stream lines (stream_nam, trib_nam); used only to check the routed trunks, never baked',
}

const HISTORIC_MAPS = 'https://geodata.hawaii.gov/arcgis/rest/services/Historic_Maps'
export const SURVEY_MAPS = {
  1881: {
    id: 'hawaii-gis-oahu-1881',
    year: 1881,
    title: 'Hawaiian Government Survey, map of Oʻahu, 1881, as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/Oahu_1881 ImageServer)',
    service: `${HISTORIC_MAPS}/Oahu_1881/ImageServer`,
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain government survey of 1881',
  },
  1899: {
    id: 'hawaii-gis-oahu-1899',
    year: 1899,
    title: 'Hawaiian Government Survey, map of Oʻahu, 1899, as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/Oahu_1899 ImageServer)',
    service: `${HISTORIC_MAPS}/Oahu_1899/ImageServer`,
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain government survey of 1899',
  },
  1902: {
    id: 'hawaii-gis-oahu-1902',
    year: 1902,
    title: 'Hawaiian Government Survey, map of Oʻahu by J. M. Donn, 1902, as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/islands_1900s ImageServer, item oa_1902_drg_Donn)',
    service: `${HISTORIC_MAPS}/islands_1900s/ImageServer`,
    // the service is a mosaic of one sheet per island; this is Oʻahu's
    mosaicRule: { mosaicMethod: 'esriMosaicLockRaster', lockRasterIds: [8] },
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain government survey of 1902',
  },
  1927: {
    id: 'hawaii-gis-oahu-topo-1927',
    year: 1927,
    title: 'Topographic quadrangles of Oʻahu, 1927 edition (U.S. Geological Survey), as the State of Hawaiʻi GIS mosaic (SoH_Maps/oahu_topo_1927 ImageServer)',
    service: 'https://geodata.hawaii.gov/arcgis/rest/services/SoH_Maps/oahu_topo_1927/ImageServer',
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the maps themselves are public-domain federal surveys',
  },
  1938: {
    id: 'hawaii-gis-oahu-1938',
    year: 1938,
    title: 'Map of Oʻahu, 1938 (a U.S. Geological Survey topographic sheet), as georeferenced by the State of Hawaiʻi GIS (Historic_Maps/Oahu_1938 ImageServer)',
    service: `${HISTORIC_MAPS}/Oahu_1938/ImageServer`,
    licence: 'State of Hawaiʻi Statewide GIS Program open data; the map itself is a public-domain federal survey',
  },
}
// The scans are served in NAD83 / UTM zone 4N (EPSG:26904) at about 5 to
// 10 m a pixel; they are exported at the district's mapPixel (5 m unless it
// says otherwise) over the box and a margin, unresampled beyond what the
// server's nearest-neighbour lookup does.
export const MAP_PIXEL = 5
const MAP_MARGIN = 600

// The Government Survey's registered maps as OHA's Kīpuka database serves
// them: 1-bit scans in PDF, at 300 or 400 dpi, with no georeferencing. The
// registry's own index is Kīpuka's RegisteredMaps layer.
const KIPUKA_PDF = 'https://kipukadatabase.com/Docs/RegMaps'
export const REGISTERED_INDEX = 'https://services5.arcgis.com/7nEbFq9LrZLy9uXi/arcgis/rest/services/RegisteredMaps/FeatureServer/0'
const REGISTERED_LICENCE =
  'the map is a public-domain survey of the Hawaiian Government; the scan is served by the Office of Hawaiian Affairs’ Kīpuka database, which states no licence for it'
export const REGISTERED_MAPS = {
  1140: {
    id: 'kipuka-rm-1140',
    rm: 1140,
    year: 1882,
    file: '1140WIDEblueprint.pdf',
    title: 'Hawaiian Government Survey, Registered Map 1140: “Koolau Bay and Anchorages, Oahu”, surveyed and drawn by Geo. E. Gresley Jackson, Nav. Lieut. R.N., August 1882, 1:12,000, soundings in fathoms at low water (a blueprint), as scanned for OHA’s Kīpuka database',
  },
  1848: {
    id: 'kipuka-rm-1848',
    rm: 1848,
    year: 1882,
    file: '1848.pdf',
    title: 'Hawaiian Government Survey, Registered Map 1848: “Reduction of Jackson’s Koolau Bay”, 1:24,000, F. W. Thrum, March 1892 (Jackson’s survey of August 1882), as scanned for OHA’s Kīpuka database',
  },
  1345: {
    id: 'kipuka-rm-1345',
    rm: 1345,
    year: 1884,
    file: '1345.pdf',
    title: 'Hawaiian Government Survey, Registered Map 1345: “Kailua Bay, Oahu”, surveyed and drawn by George Ed. Gresley Jackson, Nav. Lieut. R.N., October 1884, 1:12,000, soundings in fathoms at low water, as scanned for OHA’s Kīpuka database',
  },
  1019: {
    id: 'kipuka-rm-1019',
    rm: 1019,
    year: 1884,
    file: '1019WIDEtracing.pdf',
    title: 'Hawaiian Government Survey, Registered Map 1019: “East Coast of Oahu including Waimanalo, Hanauma and Maunalua Bays”, surveyed and drawn by Geo. E. Gresley Jackson, Nav. Lieut. R.N., 1884, 1:12,000 (traced from the original by A. Taga, July 1929), as scanned for OHA’s Kīpuka database',
  },
}
for (const m of Object.values(REGISTERED_MAPS)) {
  m.url = `${KIPUKA_PDF}/${m.file}`
  m.licence = REGISTERED_LICENCE
}

// ---------------------------------------------------------------------------
// Layout of the downloads directory

export const districtPaths = (dir, id) => ({
  root: join(dir, id),
  lidarIndex: (part) => join(dir, id, 'lidar', 'index', `${part}.txt`),
  lidarTile: (name) => join(dir, id, 'lidar', 'tiles', `${name}.tif`),
  lidarMeta: join(dir, id, 'lidar', 'metadata.xml'),
  lidarTiles: join(dir, id, 'lidar', 'tiles.json'),
  cudemList: join(dir, id, 'cudem', 'urllist.txt'),
  cudemTile: (name) => join(dir, id, 'cudem', `${name}.tif`),
  gmrt: join(dir, id, 'bathy', 'gmrt.asc'),
  gmrtMeta: join(dir, id, 'bathy', 'gmrt.json'),
  fill: join(dir, id, 'vectors', 'fill.geojson'),
  streams: join(dir, id, 'vectors', 'streams.geojson'),
  fillLayer: join(dir, id, 'vectors', 'fill-layer.json'),
  map: (year) => join(dir, id, 'maps', `oahu-${year}.png`),
  mapInfo: (year) => join(dir, id, 'maps', `oahu-${year}.json`),
  registered: (rm) => join(dir, id, 'registered', `rm-${rm}.pdf`),
  enc: join(dir, id, 'vectors', 'enc-dredged.geojson'),
  encLayer: (layer) => join(dir, id, 'vectors', `enc-${layer}.geojson`),
})

// ---------------------------------------------------------------------------
// The box in UTM zone 4, for picking lidar tiles and map exports

/** [eMin, nMin, eMax, nMax] of a lon/lat box in UTM zone 4, from its edges sampled every few hundred metres. */
export function utmExtent(bounds) {
  const [w, s, e, n] = bounds
  const out = [Infinity, Infinity, -Infinity, -Infinity]
  for (let k = 0; k <= 40; k++) {
    const t = k / 40
    for (const [lon, lat] of [
      [w + (e - w) * t, s],
      [w + (e - w) * t, n],
      [w, s + (n - s) * t],
      [e, s + (n - s) * t],
    ]) {
      const [E, N] = utm4(lon, lat)
      out[0] = Math.min(out[0], E)
      out[1] = Math.min(out[1], N)
      out[2] = Math.max(out[2], E)
      out[3] = Math.max(out[3], N)
    }
  }
  return out
}

// MGRS 100 km squares in UTM zone 4, latitude band Q (16–24° N): column
// letters A–H for eastings 100–800 km (zone 4 uses the first letter set), row
// letters from A, offset by 5 for an even zone, repeating every 2,000 km.
const COLS = 'ABCDEFGH'
const ROWS = 'ABCDEFGHJKLMNPQRSTUV'
/** South-west corner [E, N] of a lidar tile from its name (…_4QFJ195565.tif: square FJ, 19.5 km E, 56.5 km N within it). */
export function lidarTileCorner(name) {
  const m = /4Q([A-H])([A-V])(\d{3})(\d{3})$/.exec(name)
  if (!m) return null
  const E = (COLS.indexOf(m[1]) + 1) * 100000 + Number(m[3]) * 100
  let N = ((ROWS.indexOf(m[2]) - 5 + 20) % 20) * 100000 + Number(m[4]) * 100
  while (N < 1700000) N += 2000000
  return [E, N]
}

// ---------------------------------------------------------------------------
// Downloads

/** The lidar tiles whose 500 m squares meet the box (one cell of margin). */
export function lidarTilesFor(dir, d, grid) {
  const p = districtPaths(dir, d.id)
  const [e0, n0, e1, n1] = utmExtent(grid.bounds)
  const tiles = []
  for (const part of LIDAR.parts) {
    const text = readFileSync(p.lidarIndex(part), 'utf8')
    for (const url of text.split(/\s+/).filter(Boolean)) {
      const name = /\/([^/]+)\.tif$/.exec(url)?.[1]
      if (!name || !url.startsWith(`${LIDAR.base}/${part}/TIFF/`)) continue
      const c = lidarTileCorner(name)
      if (!c) continue
      if (c[0] + LIDAR.tile < e0 - 1 || c[0] > e1 + 1 || c[1] + LIDAR.tile < n0 - 1 || c[1] > n1 + 1) continue
      tiles.push({ name, part, url, E: c[0], N: c[1] })
    }
  }
  tiles.sort((a, b) => (a.name < b.name ? -1 : 1))
  return tiles
}

export async function downloadLidar(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  for (const part of LIDAR.parts) {
    const r = fetchTo(ledger, `${LIDAR.base}/${part}/0_file_download_links.txt`, p.lidarIndex(part))
    if (!r.ok) throw new Error(`lidar tile list for ${part}: HTTP ${r.status}`)
  }
  const tiles = lidarTilesFor(dir, d, grid)
  if (!tiles.length) throw new Error('no lidar tiles under the box')
  writeFileSync(p.lidarTiles, JSON.stringify(tiles, null, 1) + '\n')
  // one tile's metadata, for the dates of the survey
  const meta = fetchTo(ledger, tiles[0].url.replace('/TIFF/', '/metadata/').replace(/\.tif$/, '.xml'), p.lidarMeta)
  if (!meta.ok) log(`  lidar metadata: HTTP ${meta.status}; the dates are left out`)
  let done = 0
  let fresh = 0
  const t0 = Date.now()
  const res = await fetchManyTo(
    ledger,
    tiles.map((t) => ({ url: t.url, file: p.lidarTile(t.name) })),
    {
      parallel: 6,
      onDone: (r) => {
        done++
        if (!r.cached) fresh++
        if (done % 50 === 0 || done === tiles.length) log(`  lidar: ${done}/${tiles.length} tiles (${fresh} fetched, ${((Date.now() - t0) / 1000).toFixed(0)} s)`)
      },
    },
  )
  const bad = res.filter((r) => !r.ok)
  if (bad.length) throw new Error(`lidar: ${bad.length} tiles failed (${bad.slice(0, 3).map((r) => `${r.status} ${r.url}`).join('; ')})`)
}

/** CUDEM tiles are 0.25° squares named for their north-west corner (ncei19_n21x50_w158x00). */
export function cudemTilesFor(dir, d, bounds) {
  const p = districtPaths(dir, d.id)
  const [w, s, e, n] = bounds
  const out = []
  for (const url of readFileSync(p.cudemList, 'utf8').split(/\s+/)) {
    const m = /\/tiles\/(ncei19_n(\d+)x(\d+)_w(\d+)x(\d+)_\w+)\.tif$/.exec(url)
    if (!m) continue
    const north = Number(m[2]) + Number(m[3]) / 100
    const west = -(Number(m[4]) + Number(m[5]) / 100)
    if (west >= e || west + 0.25 <= w || north <= s || north - 0.25 >= n) continue
    out.push({ name: m[1], url })
  }
  return out
}

export function downloadCudem(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const r = fetchTo(ledger, CUDEM.list, p.cudemList, { force: true })
  if (!r.ok) throw new Error(`CUDEM tile list: HTTP ${r.status}`)
  const tiles = cudemTilesFor(dir, d, grid.bounds)
  for (const t of tiles) {
    const f = fetchTo(ledger, t.url, p.cudemTile(t.name), { maxTime: 1800 })
    if (!f.ok) throw new Error(`CUDEM ${t.name}: HTTP ${f.status}`)
    log(`  cudem: ${t.name} ${f.cached ? 'cached' : 'fetched'}`)
  }
  return tiles
}

/** GMRT over the box, at its finest here (about 61 m), for any sea texel the CUDEM leaves empty. */
export function gmrtRequest(grid) {
  const { bounds, dLon, dLat } = grid
  const pad = 8
  const b = [bounds[0] - pad * dLon, bounds[1] - pad * dLat, bounds[2] + pad * dLon, bounds[3] + pad * dLat]
  return { bounds: b, mres: 30, url: gmrtUrl(b, 30) }
}

export function downloadGmrt(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const req = gmrtRequest(grid)
  try {
    const r = fetchTo(ledger, req.url, p.gmrt, { maxTime: 300, emptyRetries: 10 })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const [w, s, e, n] = req.bounds
    const metaUrl =
      `${BATHY.url}/metadata?minlongitude=${w.toFixed(5)}&maxlongitude=${e.toFixed(5)}` +
      `&minlatitude=${s.toFixed(5)}&maxlatitude=${n.toFixed(5)}&format=esriascii&mresolution=${req.mres}&mformat=json`
    fetchTo(ledger, metaUrl, p.gmrtMeta, { maxTime: 120 })
    log(`  gmrt: ${r.cached ? 'cached' : 'fetched'}`)
  } catch (e) {
    // only a fallback behind the CUDEM; the bake says so if it is needed and missing
    log(`  gmrt: failed (${String(e.message).slice(0, 160)}); sea texels the CUDEM leaves empty will be a flat -1 m`)
  }
}

/** The fill unit of the geologic map, in and around the box, as GeoJSON in WGS 84. */
export function downloadFill(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const meta = fetchTo(ledger, `${FILL.service}?f=json`, p.fillLayer, { force: true })
  if (!meta.ok) throw new Error(`geologic units: HTTP ${meta.status}`)
  const [w, s, e, n] = grid.bounds
  const m = 0.01
  const url =
    `${FILL.service}/query?where=${encodeURIComponent(FILL.where)}` +
    `&geometry=${[w - m, s - m, e + m, n + m].map((v) => v.toFixed(5)).join(',')}&geometryType=esriGeometryEnvelope&inSR=4326` +
    '&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&geometryPrecision=7&f=geojson'
  const r = fetchTo(ledger, url, p.fill, { force: true })
  if (!r.ok) throw new Error(`fill polygons: HTTP ${r.status}`)
  const fc = JSON.parse(readFileSync(p.fill, 'utf8'))
  if (fc.type !== 'FeatureCollection' || !fc.features?.length) throw new Error('fill polygons: no features')
  log(`  fill: ${fc.features.length} polygons`)
}

/** The State's stream lines in and around the box, as GeoJSON in WGS 84 (for the check only). */
export function downloadStreams(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const [w, s, e, n] = grid.bounds
  const m = 0.01
  const url =
    `${STREAMS.service}/query?where=1%3D1&geometry=${[w - m, s - m, e + m, n + m].map((v) => v.toFixed(5)).join(',')}` +
    '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=objectid,stream_nam,trib_nam,type' +
    '&outSR=4326&geometryPrecision=7&f=geojson'
  const r = fetchTo(ledger, url, p.streams, { force: true })
  if (!r.ok) throw new Error(`streams: HTTP ${r.status}`)
  const fc = JSON.parse(readFileSync(p.streams, 'utf8'))
  if (fc.type !== 'FeatureCollection' || !fc.features?.length) throw new Error('streams: no features')
  log(`  streams: ${fc.features.length} lines`)
}

/** Export a Government Survey map over the box (in its own UTM, at the district's map pixel, MAP_PIXEL m unless given) as a lossless PNG. */
export function mapExport(grid, pixel = MAP_PIXEL) {
  const [e0, n0, e1, n1] = utmExtent(grid.bounds)
  const x0 = Math.floor((e0 - MAP_MARGIN) / 100) * 100
  const y0 = Math.floor((n0 - MAP_MARGIN) / 100) * 100
  // (the far edges on whole pixels from the near ones)
  const W = Math.ceil((Math.ceil((e1 + MAP_MARGIN) / 100) * 100 - x0) / pixel)
  const H = Math.ceil((Math.ceil((n1 + MAP_MARGIN) / 100) * 100 - y0) / pixel)
  return { extent: [x0, y0, x0 + W * pixel, y0 + H * pixel], size: [W, H], pixel, epsg: 26904 }
}

export function downloadMaps(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const ex = mapExport(grid, d.mapPixel)
  for (const year of d.maps || [1881, 1899]) {
    const m = SURVEY_MAPS[year]
    const info = fetchTo(ledger, `${m.service}?f=json`, p.mapInfo(m.year), { force: true })
    if (!info.ok) throw new Error(`${m.year} map: HTTP ${info.status}`)
    const url =
      `${m.service}/exportImage?bbox=${ex.extent.join(',')}&bboxSR=${ex.epsg}&imageSR=${ex.epsg}` +
      `&size=${ex.size.join(',')}&format=png&interpolation=RSP_NearestNeighbor` +
      `${m.mosaicRule ? `&mosaicRule=${encodeURIComponent(JSON.stringify(m.mosaicRule))}` : ''}&f=image`
    const r = fetchTo(ledger, url, p.map(m.year), { force: true, maxTime: 600 })
    if (!r.ok) throw new Error(`${m.year} map export: HTTP ${r.status}`)
    log(`  map ${m.year}: ${ex.size.join('x')} px at ${ex.pixel} m`)
  }
  return ex
}

/** The district's registered maps from Kīpuka, as the PDFs it serves (read by hand; the bake only dates them). */
export function downloadRegistered(ledger, dir, d, log) {
  const p = districtPaths(dir, d.id)
  for (const rm of d.registered || []) {
    const m = REGISTERED_MAPS[rm]
    const r = fetchTo(ledger, m.url, p.registered(rm), { maxTime: 600 })
    if (!r.ok) throw new Error(`registered map ${rm}: HTTP ${r.status}`)
    log(`  RM ${rm}: ${r.cached ? 'cached' : 'fetched'}`)
  }
}

// NOAA's harbour-scale charts (ENC Direct) over the box: the dredged areas, as the patch bake reads them
// (patch-sources.mjs ENC), and the seaplane landing areas and fairways, which say where a bay was cleared
export const ENC = {
  id: 'noaa-enc-direct-koolaupoko',
  title: 'NOAA Office of Coast Survey, ENC Direct to GIS, harbour-scale Dredged_Area (DRGARE), Sea_Plane_Landing_Area (SPLARE) and Fairway (FAIRWY) polygons over the district',
  service: 'https://encdirect.noaa.gov/arcgis/rest/services/encdirect/enc_harbour/MapServer',
  layers: { dredged: 228, seaplane: 198, fairway: 208 },
  licence: 'public domain (NOAA); not for navigation',
}
export function downloadEnc(ledger, dir, d, grid, log) {
  const p = districtPaths(dir, d.id)
  const [w, s, e, n] = grid.bounds
  for (const [kind, layer] of Object.entries(ENC.layers)) {
    const url =
      `${ENC.service}/${layer}/query?where=1%3D1&geometry=${[w, s, e, n].map((v) => v.toFixed(5)).join(',')}` +
      '&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&geometryPrecision=7&f=geojson'
    const file = kind === 'dredged' ? p.enc : p.encLayer(layer)
    const r = fetchTo(ledger, url, file, { force: true })
    if (!r.ok) throw new Error(`ENC ${kind}: HTTP ${r.status}`)
    log(`  enc ${kind}: ${JSON.parse(readFileSync(file, 'utf8')).features?.length ?? 0} polygons`)
  }
}

export async function downloadDistrict(ledger, dir, d, log) {
  const grid = districtGrid(d)
  mkdirSync(districtPaths(dir, d.id).root, { recursive: true })
  log(`${d.id}: ${grid.W}x${grid.H} over ${grid.bounds.join(', ')}`)
  log('fill (State geologic map), streams (State DAR):')
  downloadFill(ledger, dir, d, grid, log)
  downloadStreams(ledger, dir, d, grid, log)
  log('Government Survey maps (State GIS):')
  downloadMaps(ledger, dir, d, grid, log)
  if (d.registered?.length) {
    log('registered maps (OHA Kīpuka), dredged areas (NOAA ENC):')
    downloadRegistered(ledger, dir, d, log)
    downloadEnc(ledger, dir, d, grid, log)
  }
  log('rain (Rainfall Atlas of Hawaiʻi):')
  downloadRain(ledger, dir, log)
  log('sea floor (NOAA CUDEM, GMRT):')
  downloadCudem(ledger, dir, d, grid, log)
  downloadGmrt(ledger, dir, d, grid, log)
  log('lidar (USGS 3DEP, 0.5 m):')
  await downloadLidar(ledger, dir, d, grid, log)
}

/** The fetched date the ledger holds for a file, or the latest of several. */
export function fetchedOf(ledger, files) {
  const ds = files.map((f) => ledger.get(f)?.fetched).filter(Boolean).sort()
  return ds[ds.length - 1]
}

export function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
}

