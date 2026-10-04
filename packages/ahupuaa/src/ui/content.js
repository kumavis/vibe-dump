// What the tour says, stop by stop. Short on purpose: the island does the
// showing, these only name what you are looking at and why it mattered.
//
// Spelling follows modern Hawaiian orthography, with the ʻokina (ʻ) and kahakō
// (ā ē ī ō ū). Practices varied from island to island and over time; where a
// tradition is told several ways, the text keeps to the widely shared version.

export const STOPS = [
  {
    id: 'island',
    icon: 'island',
    title: 'Ka Mokupuni',
    gloss: 'the island',
    text: [
      'A high island raised by two volcanoes and carved by rain. Land was divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili worked by extended families.',
      'This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones did.',
    ],
  },
  {
    id: 'rain',
    icon: 'rain',
    title: 'Ka Ua',
    gloss: 'the rain',
    text: [
      'Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.',
      'So one side of an island is lush and the other dry. Hawaiians named hundreds of winds and rains, each belonging to a place. Wai, fresh water, was life — and waiwai, wealth, is water doubled.',
    ],
  },
  {
    id: 'ahupuaa',
    icon: 'ahupuaa',
    title: 'Ahupuaʻa',
    gloss: 'from the mountain to the sea',
    zone: null,
    text: [
      'An ahupuaʻa ran from the uplands to the sea, usually bounded by ridges, so its people had forest, fresh water, farmland, shore and reef within one boundary.',
      'A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.',
      'The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki.',
    ],
  },
  {
    id: 'akua',
    icon: 'akua',
    title: 'Wao Akua',
    gloss: 'realm of the gods',
    zone: 0,
    text: [
      'The cloud-wrapped heights were left largely to the gods. People came only for special purposes — feathers, choice woods, stone for adzes — and with care.',
      'Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream.',
    ],
  },
  {
    id: 'nahele',
    icon: 'nahele',
    title: 'Wao Nahele',
    gloss: 'the forest',
    zone: 1,
    text: [
      'Below the clouds grew koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.',
      'Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go.',
    ],
  },
  {
    id: 'loi',
    icon: 'loi',
    title: 'Loʻi Kalo',
    gloss: 'irrigated taro terraces',
    zone: 2,
    text: [
      'Kalo (taro) was the staff of life, cooked and pounded into poi. Terraces stepped down the valley floor, fed by an ʻauwai — a ditch that took part of the stream at a dam and returned it below. The water had to keep moving: cool, flowing water kept the kalo healthy.',
      'In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo was caring for family.',
    ],
  },
  {
    id: 'kauhale',
    icon: 'kauhale',
    title: 'Kauhale',
    gloss: 'the family compound',
    zone: 4,
    text: [
      'A home was a cluster of hale, each with its purpose: the hale noa where the family slept, the mua where men ate and kept the family shrine, a separate eating house for women, a house for beating kapa, a canoe house.',
      'Under the ʻai kapu, men and women ate apart. Houses were framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae.',
    ],
  },
  {
    id: 'heiau',
    icon: 'heiau',
    title: 'Heiau',
    gloss: 'temple',
    zone: 4,
    text: [
      'Heiau ranged from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief; others honored Lono for rain and harvests, or served healing and fishing.',
      'On the platform stood the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings.',
    ],
  },
  {
    id: 'kahakai',
    icon: 'kahakai',
    title: 'Kahakai',
    gloss: 'the shore',
    zone: 4,
    text: [
      'Most people lived near the shore, where the stream met the sea. Canoes, each hull carved from a single log and steadied by an ama float, were kept out of the sun in a hālau waʻa.',
      'On flat rocks and clay pans, seawater evaporated into paʻakai — salt — for preserving fish.',
    ],
  },
  {
    id: 'loko',
    icon: 'loko',
    title: 'Loko Iʻa',
    gloss: 'fishpond',
    zone: 5,
    text: [
      'Hawaiians built the most advanced fishponds in the Pacific. A curved wall of stacked stone, the kuapā, enclosed part of the reef flat near a stream mouth, where fresh water mixed with salt.',
      'In the wall were mākāhā — sluice gates of wooden grates. Young fish slipped in with the tide, fattened on algae, and grew too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) were raised here.',
    ],
  },
  {
    id: 'koa',
    icon: 'koa',
    title: 'Koʻa',
    gloss: 'fishing shrine',
    zone: 5,
    text: [
      'Fishermen built koʻa, stone shrines on the shore, and offered the first fish of a catch to the fishing gods. Offshore fishing grounds were also called koʻa, found by lining up landmarks on land.',
      'Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out.',
    ],
  },
  {
    id: 'surf',
    icon: 'surf',
    title: 'Heʻe Nalu',
    gloss: 'wave sliding',
    zone: 5,
    text: [
      'Surfing belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.',
      'Each break had its name, and the best were sometimes kapu to all but the aliʻi.',
    ],
  },
  {
    id: 'kula',
    icon: 'kula',
    title: 'Kula',
    gloss: 'the dry plains',
    zone: 3,
    text: [
      'Where rain was too scarce for loʻi, families farmed the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).',
      'Long low walls ran across the slopes to break the wind and hold soil and moisture. The great leeward field systems covered tens of square kilometres.',
    ],
  },
  {
    id: 'ahu',
    icon: 'ahu',
    title: 'Ahu · Makahiki',
    gloss: 'the boundary altar · the season of Lono',
    zone: 4,
    text: [
      'Where the trail around the island crossed into each ahupuaʻa stood an ahu, a stone altar. When Makaliʻi — the Pleiades — rose at dusk in late autumn, the Makahiki began: four months honoring Lono, god of rain and growth.',
      'Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden.',
    ],
  },
  {
    id: 'puuhonua',
    icon: 'puuhonua',
    title: 'Puʻuhonua',
    gloss: 'place of refuge',
    zone: 4,
    text: [
      'Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.',
      'In wartime, defeated warriors and those who could not fight also found safety there.',
    ],
  },
  {
    id: 'holua',
    icon: 'holua',
    title: 'Hōlua',
    gloss: 'sledding course',
    zone: 3,
    text: [
      'During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.',
      'The track was paved with stones and laid with slick grass or leaves; the longest ran for more than a kilometre.',
    ],
  },
  {
    id: 'malama',
    icon: 'malama',
    title: 'Mālama ʻĀina',
    gloss: 'care for the land',
    text: [
      'The ahupuaʻa worked because each part cared for the next: protected forests made water, water fed loʻi and fishponds, and people tended it all.',
      'Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles.',
    ],
  },
]

export const WEATHER_TEXT = {
  moae: { name: 'Moaʻe', gloss: 'trade winds' },
  kona: { name: 'Kona', gloss: 'southerly storm' },
  malie: { name: 'Mālie', gloss: 'calm' },
  auto: { name: 'Auto', gloss: 'let the weather change' },
}

export const SEASON_TEXT = {
  kau: { name: 'Kau', gloss: 'the dry season' },
  hooilo: { name: 'Hoʻoilo', gloss: 'the wet season' },
}
