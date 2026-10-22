// The zoning vocabulary of DATA.md ("Zoning, for the settlements") and how
// each county's own classes are generalized to it.
//
// The settlements read zoning for one thing: what kind of building stands on
// a texel of present-day town. So the twelve classes follow building form,
// not legal category: a resort-hotel district is resort wherever the county
// files it, a national park is preserved land though it is federal, and an
// airport is industrial ground (hangars, terminals, sheds), as Honolulu itself
// zones its airport.
//
// Every county class must match a rule here, or the bake stops: a new code
// can never fall quietly into "none". A rule gives a class number, or one of
// three deferred choices settled per sample:
//   - `lud`: by the State Land Use District under it (Maui County's Interim
//     district, which holds land never comprehensively zoned);
//   - `height`: by the Honolulu zoning map's height limit (medium-density
//     apartments, walk-ups under 100 ft and towers above);
//   - by the feature itself (Maui's project districts, resort or houses by
//     where they lie), settled when the feature is read.

/** The twelve classes, by number; 0 is none or water. */
export const CLASSES = [
  { n: 0, key: 'none', label: 'none or water' },
  { n: 1, key: 'houses', label: 'residential, houses' },
  { n: 2, key: 'lowrise', label: 'residential, low-rise apartments' },
  { n: 3, key: 'highrise', label: 'residential, high-rise apartments' },
  { n: 4, key: 'business', label: 'commercial or business' },
  { n: 5, key: 'downtown', label: 'mixed-use downtown' },
  { n: 6, key: 'industrial', label: 'industrial' },
  { n: 7, key: 'resort', label: 'resort' },
  { n: 8, key: 'agricultural', label: 'agricultural' },
  { n: 9, key: 'conservation', label: 'conservation or preservation' },
  { n: 10, key: 'military', label: 'military or federal' },
  { n: 11, key: 'public', label: 'public or institutional' },
  { n: 12, key: 'parks', label: 'parks and open space' },
]
export const N_CLASSES = 12

/** State Land Use Districts, HRS Chapter 205: the layer's ludcode to the raster's value. */
export const LUD = [
  { n: 0, code: null, key: 'none', label: 'sea or none' },
  { n: 1, code: 'U', key: 'urban', label: 'urban' },
  { n: 2, code: 'R', key: 'rural', label: 'rural' },
  { n: 3, code: 'A', key: 'agricultural', label: 'agricultural' },
  { n: 4, code: 'C', key: 'conservation', label: 'conservation' },
]
export const N_LUD = 4
export const ludOf = (code) => LUD.find((l) => l.code === String(code || '').trim().toUpperCase())?.n ?? 0

/** The State Land Use District has applied since 1961; the app applies it to years from this one on. */
export const LUD_FROM_YEAR = 1964

// ---------------------------------------------------------------------------
// Deferred rules

/** Maui County's Interim district takes its class from the State district beneath it. */
export const INTERIM = {
  by: 'lud',
  classes: { 1: 1, 2: 1, 3: 8, 4: 9 },
  text:
    'by the State Land Use District beneath it: urban or rural ground as houses (the district allows single-family ' +
    'dwellings), agricultural as agricultural, conservation as conservation; none where no State district is mapped',
}

/** Honolulu's medium-density apartments: towers where the zoning map lets them rise 100 ft or more. */
export const TOWERS = {
  by: 'height',
  atLeast: 100,
  high: 3,
  low: 2,
  text: 'high-rise where the zoning map’s height limit (its base figure, not a bonus height) is 100 ft or more, otherwise low-rise',
}

/** Maui's project districts that are resorts: West Maui (Kapalua, Kāʻanapali North Beach), Lānaʻi (Mānele, Kōʻele), and Mākena south of Wailea. */
const MAUI_RESORT_PD = (p, centre) => p.COMMUNITY_PLAN === 'WM' || p.COMMUNITY_PLAN === 'LN' || (p.COMMUNITY_PLAN === 'KM' && centre[1] < 20.7)
const MAUI_PD_TEXT =
  'resort in the West Maui and Lānaʻi community plans (Kapalua, Kāʻanapali North Beach, Mānele, Kōʻele) and in Kīhei–Mākena ' +
  'south of 20.70° N (Mākena); houses elsewhere (Maui Lani, Kehalani and the other master-planned neighbourhoods of ' +
  'Wailuku–Kahului and Kīhei)'

// ---------------------------------------------------------------------------
// County rules. Each is [test on the class code, class or deferred rule,
// the family's name where the layer gives none, why].

const re = (s) => new RegExp(`^(?:${s})$`)

const HONOLULU = [
  [re('R-(?:3\\.5|5|7\\.5|10|20)'), 1],
  [re('C'), 1, null, 'Country: large lots, houses among small farms'],
  [re('A-1|AMX-1'), 2],
  [re('A-2|AMX-2'), TOWERS],
  [re('A-3|AMX-3'), 3],
  [re('Apart|ApartMix'), 3, null, 'Waikīkī’s apartment precincts, the towers behind the hotels'],
  [re('B-1|B-2|BMX-3'), 4],
  [re('BMX-4'), 5, null, 'the central business district'],
  [re('Kak|Aloha|MU'), 5, null, 'the State-administered Kakaʻako and Aloha Tower districts and Kakaʻako’s mixed-use precinct: towers over shops'],
  [re('I-1|I-2|I-3|IMX-1|WI'), 6, null, 'the airport is zoned I-2 and counts with it'],
  [re('Resort|ResMix'), 7],
  [re('AG-1|AG-2'), 8],
  [re('P-1'), 9, null, 'Restricted Preservation: the State Conservation district'],
  [re('F-1'), 10],
  [re('PU'), 11],
  [re('P-2|Pub'), 12, null, 'General Preservation (parks, beaches, golf courses, cemeteries) and Waikīkī’s Public Precinct (Kapiʻolani Park, the zoo, Fort DeRussy’s lawns)'],
]

const MAUI = [
  [re('000|010|020|030|040|101|102'), 1],
  [re('600|605|610'), 1, null, 'Rural: houses on half-acre and larger lots'],
  [re('365'), 1, null, 'Waikapū Country Town, a planned village of houses'],
  [re('100|110|120'), 2, null, 'Maui County’s apartment districts are walk-ups and low blocks; its towers are hotels'],
  [re('310|320|330|360|390|700|705'), 4, null, 'neighbourhood, community, central and country-town business, and the research and technology parks'],
  [re('370|380'), 5, null, 'Wailuku Redevelopment Area’s mixed-use core'],
  [re('771|772|773'), 5, null, 'the historic districts of Lahaina town: shops, restaurants and the old hotel along Front Street'],
  [re('410|420|425'), 6],
  [re('430'), 6, null, 'airports: hangars, terminals and sheds'],
  [re('200|210|215|220|340|730'), 7, null, 'hotel districts, Business–Resort, and the Nāpili Bay Civic Improvement District'],
  [re('720'), { by: 'feature', test: MAUI_RESORT_PD, yes: 7, no: 1, text: MAUI_PD_TEXT }],
  [re('500'), 8],
  [re('799'), 8, null, 'Urban Reserve, farmed until it is built on'],
  [re('099'), INTERIM],
  [re('900|902|905|909'), 11],
  [re('819|820|821|822|829|919|925|929'), 12],
  [re('825|996|997|998|999'), 0, null, 'drainage, roads and land the county has not zoned (Kalaupapa, which is Kalawao County)'],
]

// Hawaiʻi County: the code's letters before the lot size name the district
// (Chapter 25 and the layer's own zone definitions).
const HAWAII = [
  [re('RS-.+'), 1, 'Single-Family Residential District'],
  [re('RD-.+'), 1, 'Double-Family Residential District'],
  [re('RA-.+'), 1, 'Residential and Agricultural District'],
  [re('PD'), 1, 'Project District', 'master-planned communities in Kona, Hilo and Kohala, mostly houses'],
  [re('RM-.+'), 2, 'Multiple-Family Residential District'],
  [re('CN-.+'), 4, 'Neighborhood Commercial District'],
  [re('CG-.+'), 4, 'General Commercial District'],
  [re('CV-.+'), 4, 'Village Commercial District'],
  [re('CDH'), 5, 'Downtown Hilo Commercial District'],
  [re('RCX-.+'), 5, 'Residential-Commercial Mixed Use District'],
  [re('ML-.+'), 6, 'Limited Industrial District'],
  [re('MG-.+'), 6, 'General Industrial District'],
  [re('MCX-.+'), 6, 'Industrial-Commercial Mixed District'],
  [re('V-.+'), 7, 'Resort-Hotel District'],
  [re('A-.+'), 8, 'Agricultural District'],
  [re('FA-.+'), 8, 'Family Agricultural District'],
  [re('APD'), 8, 'Agricultural Project District'],
  [re('FR'), 9, 'Forest Reserve', 'the layer’s non-zoned forest reserve and conservation land'],
  [re('NP'), 9, 'National Park', 'preserved land: federal, but no buildings to speak of'],
  [re('UNV'), 11, 'University'],
  [re('OPEN|O'), 12, 'Open District'],
  [re(['road', 'river', 'pond', 'flood', 'pier', 'breakwater'].map((w) => `\\(${w}\\)`).join('|')), 0, 'Non-zoned area', 'roads and trails, streams, ponds, floodways, piers and breakwaters'],
]

// Kauaʻi: a code may carry an overlay after a slash (R-6/ST-P); the
// district before the slash decides the class.
const KAUAI = [
  [re('R-(?:1|2|4|6)'), 1, null, 'up to six units an acre'],
  [re('PC|P-D|PD-C'), 1, null, 'Plantation Camp, Project District and Plan Development Community'],
  [re('R-(?:8|10|15|20)'), 2, null, 'eight to twenty units an acre, under the island’s four-storey limit'],
  [re('C-G|C-N'), 4],
  [re('SPA-A'), 5, null, 'the Kapaʻa town core'],
  [re('I-G|I-L'), 6, null, 'the airport at Līhuʻe is I-G and counts with it'],
  [re('RR|RR-(?:1|4|10|20)'), 7],
  [re('A'), 8],
  [re('CON|ST-R'), 9, null, 'Conservation, and Special Treatment – Ecological standing alone'],
  [re('UNV'), 11],
  [re('O|ST-C'), 12, null, 'Open Space, and Special Treatment – Cultural standing alone'],
  [re('SEE PLANNING DEPT'), 0, null, 'the layer names no district here (two areas around Kukuiʻula and Poʻipū)'],
]

/** Per county: the layer key in zoning-sources.mjs, the rules, and how a feature's code and name are read. */
export const COUNTIES = {
  honolulu: {
    rules: HONOLULU,
    code: (p) => String(p.zone_class ?? '').trim(),
    name: (p) => String(p.zoning_description ?? '').replace(/\s+/g, ' ').trim(),
  },
  maui: {
    rules: MAUI,
    code: (p) => String(p.ZONE_CLASS ?? '').trim(),
    name: (p, domain) => domain[String(p.ZONE_CLASS ?? '').trim()] || '',
  },
  hawaii: {
    rules: HAWAII,
    code: (p) => String(p.ZONE ?? '').trim(),
    name: () => '',
  },
  kauai: {
    rules: KAUAI,
    code: (p) => String(p.ZONING ?? '').trim(),
    name: (p) => String(p.DESCRIPTION ?? '').replace(/\s+/g, ' ').trim(),
    base: (code) => code.split('/')[0].trim(),
  },
}

/**
 * Classify one feature of a county layer. Returns { code, name, rule, why }
 * where rule is a class number or a deferred rule ({ by: 'lud' | 'height' });
 * a feature rule is settled here. Throws on a code no rule matches.
 */
export function classify(county, props, centre, domain = {}) {
  const C = COUNTIES[county]
  const code = C.code(props)
  const key = C.base ? C.base(code) : code
  for (const [test, rule, family, why] of C.rules) {
    if (!test.test(key)) continue
    const name = C.name(props, domain) || family || ''
    if (rule && typeof rule === 'object' && rule.by === 'feature') {
      const yes = rule.test(props, centre)
      return { code, name, rule: yes ? rule.yes : rule.no, why: rule.text, when: yes ? 'resort' : 'houses' }
    }
    return { code, name, rule, why: why || (typeof rule === 'object' ? rule.text : undefined) }
  }
  return { code, name: C.name(props, domain), rule: undefined }
}

/** The rules written out for the manifest: per class number, the codes that may feed it. */
export function rulesText(county) {
  const out = []
  for (const [test, rule, family, why] of COUNTIES[county].rules) {
    // the test's pattern as a reader would write it: R-(3.5|5), RS-*, (road|river)
    const pattern = test.source
      .replace(/^\^\(\?:|\)\$$/g, '')
      .replace(/\(\?:/g, '(')
      .replace(/\.\+/g, '*')
      .replace(/\\/g, '')
    const to = typeof rule === 'number' ? rule : rule.by === 'feature' ? `${rule.yes} or ${rule.no}` : rule.by === 'lud' ? Object.values(rule.classes).filter((v, i, a) => a.indexOf(v) === i).join(', ') : `${rule.low} or ${rule.high}`
    out.push({ codes: pattern, class: to, ...(family ? { district: family } : {}), ...(why || typeof rule === 'object' ? { why: why || rule.text } : {}) })
  }
  return out
}
