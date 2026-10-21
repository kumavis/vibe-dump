# Holo i ke Au: research notes for the first gazetteer

This is the record behind the five hand-written data files in `public/data/`:
`eras.json`, `places.json`, `events.json`, `sources.json` and `polities.json`. It says
what was read, what could not be reached, which of `DESIGN.md`'s *verify* marks are now
settled, where the sources disagree, where the schema in `DATA.md` §4 ran short, and what
still needs a human reader or a cultural reviewer before any of it reaches a card.

Written October 2026. Run the check with:

```bash
node packages/holo-i-ke-au/tools/check-data.mjs            # public/data
node packages/holo-i-ke-au/tools/check-data.mjs some/dir   # a copy elsewhere
```

## 1. What is in the files

| file | contents |
| --- | --- |
| `eras.json` | 13 keyframes: 12 from settlement to 1898, reign-indexed before contact, plus the coda (1970 on) |
| `places.json` | 57 places: 33 exact, 15 at ahupuaʻa precision, 2 at moku, 4 island-wide, 3 at sea |
| `events.json` | 54 events; 44 carry tellings; Nuʻuanu 1795 carries 8 text-only stops |
| `sources.json` | 64 sources: 51 opened and read, 13 not opened, 5 of the opened ones tertiary |
| `polities.json` | 13 polities and a polity for every one of the 33 moku keys in every era, with notes where a holding is split or contested |

Events by era:

- **voyaging** (c. 1000–1400): first-canoes, paao, moikeha
- **mailikukahi** (c. 1410–1550): mailikukahi
- **umi** (c. 1490–1630): umi, piilani, kahikinui-heiau
- **alapai** (c. 1730–1760): alapai-wars
- **kalaniopuu** (1762–1782): kauiki-1759, kakanilua-1776, cook-waimea-1778, cook-kealakekua-1779
- **kahekili** (1782–1794): mokuohai-1782, kaheiki-1783, kepaniwai-1790, keanakakoi-1790, puukohola-1791, kepuwahaulaula-1791, cattle-1793, kalauao-1794
- **kamehameha** (1795–1819): nuuanu-1795, kaieiewaho-1796, okuu-1804, kauai-1810, kamehameha-death-1819
- **kaahumanu** (1819–1833): sandalwood, ai-noa-1819, kuamoo-1819, missionaries-1820
- **kauikeaouli** (1834–1854): whaling, koloa-1835, restoration-1843, mahele-1848, epidemics-1848, kuleana-1850, smallpox-1853
- **kamehameha-iv-v** (1855–1873): kalaupapa-1866
- **kalakaua** (1873–1891): election-riot-1874, hamakua-ditch-1876, bayonet-1887, wilcox-1889, depopulation (1778–1896)
- **liliuokalani** (1891–1899): overthrow-1893, counter-revolution-1895, kue-1897, annexation-1898
- **coda** (1970 on): kalama-valley-1971, kahoolawe-1976, hokulea-1976, waiahole-1977, concon-1978, onipaa-1993, heeia-restoration, pahonu-limu

### How it was made

- **Read, then wrote.** The long public-domain texts (Kamakau, Fornander, Cook and
  King, Dibble, Ellis, Bingham, Jarves, Liliʻuokalani, the 1896 census) were downloaded as
  full text and searched passage by passage, with the printed page taken from each page's
  running head. Every page number in `events.json` is a page actually read. Where a scan
  shows no page numbers (Jarves's later chapters, the census), the citation names the
  passage or table instead.
- **Coordinates.** Natural features and towns come from USGS GNIS (The National Map
  Gazetteer service), which now carries ʻokina and kahakō. Each exact point's moku and
  ahupuaʻa were read off the State GIS ahupuaʻa layer by point-in-polygon, not from
  memory. Places held at ahupuaʻa or moku precision sit at an area-weighted centroid
  computed from that layer, except where noted below. Three built landmarks (ʻIolani
  Palace, Thomas Square, Kūkaniloko) have coordinates from Wikipedia and are flagged as
  tertiary. The two channel points are computed mid-channel positions, said so in their notes.
- **Numbers live only in tellings.** Summaries and stops carry years and days of the
  month, never a count of people, ships or dead. `check-data.mjs` enforces this.
- **Voice.** Summaries follow the ahupuaʻa app's tour copy: present tense, short, a
  Hawaiian term with its gloss the first time, modern orthography. English possessives
  use ’ so that a stray ' never passes for an ʻokina; the check looks for that too.

## 2. Sources: opened, and not

### Opened and read

| id | what was read |
| --- | --- |
| `kamakau-ruling-chiefs` | Chs. I–II (ʻUmi, Kiha), VI, VII–IX (Kakanilua, Cook), X–XVIII (the wars, 1782–1819), XXX–XXXI (Māhele, measles, smallpox). Read in the publisher's free PDF as re-hosted on the Internet Archive (item `chiefs_202607`; 91.55 MB, the same file Kamehameha Schools distributes). |
| `fornander-v2` | Vol. II (1880): pp. 2–3, 20, 33–62 (voyaging), 87–108 (Māʻilikūkahi, Piʻilani, chronology), 135–153, 204–247, 289–349 (the 1700s wars to Nuʻuanu). |
| `cook-1784-v2`, `king-1784-v3` | Kauaʻi and Niʻihau, Jan–Feb 1778; the approach to Kealakekua; King's Book V chs. I–IV; King's population estimate pp. 126–128. |
| `dibble-1843`, `ellis-1827`, `bingham-1847`, `jarves-1847` | The eruption and Keōua; Kuamoʻo; the 1820 arrival; whaling arrivals 1843–46; the 1843 cession and restoration. |
| `liliuokalani-1898` | Chs. VII, XXIX, XXXI–XXXII, XLII–XLIV and the contents. |
| `census-1896` | "First summary by nationalities" (1890 and 1896 counts). |
| `pl-103-150`, `hi-constitution`, `hi-leg-*`, `hhfdc-waiahole-plan`, `nara-kue-1897` | Full texts of the relevant clauses and pages. |
| `swanson-2019-hulili`, `merlin-1990-sandalwood` | Full papers (open PDFs). |
| `athens-2014`, `wilmshurst-2011`, `dye-2011`, `kirch-sharp-2005`, `mcphie-1990` | Abstracts only (via Crossref, Europe PMC and the USGS Publications Warehouse). The numbers quoted are in the abstracts. |
| NPS (`nps-kalaupapa`, `nps-koloa-mill`, `nps-puukohola`), `nrhp-koloa-mill`, `kirc-history`, NOAA, HCDA, `paepae-o-heeia`, `ks-kealaikahiki-2020` | The pages or reports themselves. |
| News: Star-Advertiser (2019, 2021, 2026), UH News 2026, HPR 2022, KHON, Civil Beat 2026 | The articles themselves. |
| State GIS moku and ahupuaʻa layers; USGS GNIS | Queried directly on 2026-10-20. |
| Wikipedia (5 pages, all marked `tertiary`) | As finding aids, and for three sets of coordinates. |

### Not opened (`opened: false`, so the card shows *verify*)

`thrum-annual-1911`, `schmitt-1969-mortality`, `james-2004-nuuanu`, `ii-fragments`,
`kirch-ruggles-2019`, `swanson-2012-keanakakoi`, `usgs-volcano-watch-2008`,
`obeyesekere-1992`, `sahlins-1995`, `kuykendall-1938-v1`, `stannard-1989`,
`silva-2004`, `wilcox-1996-sugar-water`. Each says in its `note` what it is believed to
hold and where that belief comes from.

### What could not be reached from here, and why

| site | result | consequence |
| --- | --- | --- |
| Ulukau (`puke.ulukau.org`) | Cloudflare challenge, 403 | Kamakau read from the publisher's PDF instead; Pukui–Elbert–Mookini *Place Names* and Malo not read |
| eVols (UH ScholarSpace) | Turnstile challenge | No Hawaiian Journal of History articles, no Thrum's *Annual* |
| HathiTrust full text | 403 | Same |
| Chronicling America / loc.gov | 403, then Cloudflare | No 1890s Honolulu newspapers, so the Pali road find is unverified |
| usgs.gov | 403 / timeouts | Volcano Watch columns not read |
| Wikidata | 429 rate limit | GNIS used instead |
| Papakilo | not tried after the above | Hawaiian-language newspapers unread |

A person with a browser can reach all of these. Most of the `opened: false` entries
could be turned into read sources in an afternoon.

## 3. DESIGN.md *verify* marks

- **Settlement date. Settled as a range across two schools.** Athens, Rieth and Dye (2014)
  put first settlement at AD 940–1130 (95 %), most probably 1000–1100. Wilmshurst et al.
  (2011) put Hawaiʻi in a single East Polynesian pulse about 1190–1290. Dye (2011): late
  in the first millennium. DESIGN's "roughly 1000 to 1200" sits between the two; a card
  should say "between about 950 and 1300, by two radiocarbon models" and show both.
  Fornander's genealogical sixth century is superseded and is kept only as a telling.
- **Depopulation figures. Settled, with the range widened.** Contact-era estimates run
  from 200,000 (Dixon 1787, via Schmitt) and 200,000–250,000 (Schmitt 1971) through
  King's 400,000 (1779, read in King) to 800,000–1,000,000 (Stannard 1989), as tabulated
  by Swanson (2019, p. 205). Swanson's own backcast is 683,200. The 1890 census counted
  34,436 Hawaiians and 6,186 part-Hawaiians, 40,622 together, so DESIGN's "about 40,000
  Native Hawaiians" is right if part-Hawaiians are included. DESIGN's "300,000 to over
  800,000" should read "200,000 to 1,000,000".
- **The 1898 Pali road remains. Not settled.** The only trail found runs through
  Wikipedia, which cites a 2008 travel guide for "800 skulls" found in 1898. Other
  popular pages say 1897 and name the contractors Wilson & Whitehouse. No contemporary
  report was read; Chronicling America and Papakilo refused automated access. Next step:
  the Hawaiian Gazette, Pacific Commercial Advertiser, Evening Bulletin and Hawaiian Star
  for 1897–98, and the Pali road contract. Until then the Nuʻuanu telling says plainly
  that the claim rests on a travel guide.
- **Kamakau on Ulukau. Half settled.** The publisher's product page says the book is
  free on Ulukau, but Ulukau would not answer an automated request, so the Ulukau copy
  was not seen. The same edition was read in the publisher's PDF. A person should open
  Ulukau, confirm, and put that URL in `sources.json`.
- **The newspapers behind the name. Settled.** *Ke Au ʻOkoʻa* was a government-sponsored
  Honolulu weekly, 1865–1873, merged into *Ka Nupepa Kuokoa* in 1873 (American
  Antiquarian Society catalogue). *Ke Au Hou* was John H. Wise's weekly, 4 May 1910 to
  28 February 1912; another *Ke Au Hou*, edited by T. P. Spencer, appeared in 1896
  (nupepa-hawaii.com, <https://nupepa-hawaii.com/tag/ke-au-hou/>). A link worth keeping:
  part of Kamakau's history, the app's main Hawaiian source, first ran in *Ke Au ʻOkoʻa*.
  The smallpox chapter is footnoted "Ke Au ʻOkoʻa, Sept. 9, 1869" (p. 418).
- **The moku layer's names. Settled; see §5.**
- **Also checked: the Nuʻuanu cannon.** DESIGN §8 has "the cannon under Young and Davis"
  at Nuʻuanu. In the sources read, Kamakau names John Young and Isaac Davis at the guns
  at Kepaniwai (1790, p. 148), and Fornander credits Kamehameha's "artillery" at Nuʻuanu
  without names (p. 348). The Nuʻuanu stops therefore say "Kamehameha's guns". ʻĪʻī or
  Kuykendall may name them.
- **Also checked: the battle's Hawaiian name.** DESIGN and DATA spell it
  *Kaleleakaʻanae*. The only source found, Rob James's *The Battle of Nuʻuanu* (2004)
  as cited by Wikipedia, gives *Kalelekaʻanae*, "the leaping ʻanae". The event uses
  *Kalelekaʻanae* and marks the source *verify*. A speaker should decide.

## 4. Where the tellings diverge most

1. **Pre-contact chronology.** Fornander counts thirty years a generation and puts ʻUmi's
   death about 1521–26. Kirch's coral dates put the consolidation of Maui under Piʻilani
   and Kiha, ʻUmi's in-laws, at 1550–1700 (most heiau) or 1580–1640 (Kahikinui). The
   reign eras are wide on purpose (`umi` is 1560 ± 70) and their notes say why. Dates
   for Pāʻao and Moʻikeha (1100–1400) are placeholders, not readings of any source.
2. **Nuʻuanu.** Army size: "never definitely stated by native historians" (Fornander)
   against about 12,000 (Thrum 1911, unread) and 10,000–16,000 (Wikipedia, unsourced).
   Kaʻiana dies at Lāʻimi in Kamakau and "early in the battle" in Fornander. Fornander
   has "a large number" driven over the pali, while Kamakau does not mention the pali in
   his account. Kalanikūpule hides "a little over a year" in Kamakau and "several months"
   in Fornander. The month is mid-April or later (Fornander) or May (Wikipedia).
3. **Kīlauea, 1790.** Kamakau says the rear division died and Dibble says the centre
   company. Ellis heard "about eighty men"; a USGS column (unread) reportedly ranges far
   higher. Whether the Kaʻū Desert footprints are the army's is questioned.
4. **Cook.** King has the ships anchoring on 17 January 1779; Kamakau has Cook landing at
   ʻAwili on 24 January, names the man who took the boat (Palea) and the chief who struck
   Cook (Kalanimanookahoʻowaha). Whether Cook was taken for Lono (Obeyesekere against
   Sahlins) is carried as two unread tellings.
5. **Kahekili's death**: 1793 (Kamakau) or 1794 (Fornander).
6. **The ʻai noa**: Kamakau credits Keōpūolani, Jarves credits Kaʻahumanu.
7. **Kōloa**: the lessor was Kamehameha III (NRHP nomination) or the governor Kaikioʻewa
   (NPS page).
8. **Kaʻieʻiewaho**: usually 1796, but Jarves narrates it before Broughton's visit of
   January 1796.
9. **Population**: a factor of five between the lowest and highest contact estimates.
10. **Whaling**: Jarves's contemporary table (595 whaler arrivals at the two ports in
    1846) against a "736" that recurs on popular sites without a source. Only Jarves is used.

## 5. The moku layer, and the polity keys

The State GIS moku layer (HistoricCultural/MapServer/3, fetched 2026-10-20) has 33
features with fields `moku`, `mokupuni`, `other`. What it holds:

- `mokupuni` is written with an ASCII apostrophe (`Hawai'i`, `O'ahu`). Three moku names
  differ from the SHPD-corrected spelling in the ahupuaʻa layer: `Halele'a`,
  `Ko'olaupoko` and `Kipahulu`.
- Object 22, `Honuaʻula`, has `mokupuni` "Molokini" and three rings: Maui's Honuaʻula,
  the whole of Kahoʻolawe, and Molokini. Kahoʻolawe has no moku of its own.
- Lānaʻi's one moku is `Lāhainā`. Molokaʻi has two moku (Kona, Koʻolau), Kauaʻi five,
  Niʻihau one.
- The July 2026 update moved Maunalua and Kuliʻouʻou into Kona (Oʻahu) from Koʻolaupoko.

`polities.json` is keyed by `mokuKey` exactly as the bake writes it into
`boundaries/moku.geojson`: the island pack id plus the moku's SHPD spelling
(`maui:Kīpahulu`, `kauai:Haleleʻa`, `oahu:Koʻolaupoko`). The brief's "exact names from
the layer" would have given `Molokini:Honuaʻula` and `Kaua'i:Halele'a`. Those don't join,
and DATA.md now fixes `mokuKey` as the key. `check-data.mjs` validates against the
`mokuKey` values in `moku.geojson`. When that file is absent it falls back to a
hard-coded list, which keeps each key beside the layer's verbatim objectid, `moku` and
`mokupuni`, so every key traces to a row.

Polity assignments follow Kamakau and Fornander. The contested ones carry a `notes`
entry: Hāna and Kīpahulu under Hawaiʻi c. 1759–1782; Molokaʻi between Oʻahu and its own
chiefs in the 1730s; Hāmākua and Puna split three ways in 1782–90; Kauaʻi independent,
then ruling under Kamehameha from 1810. The `voyaging` era is all `unrecorded`, because
the genealogies name chiefs, not districts.

## 6. Where the schema ran short

- **No precision between `exact` and `ahupuaa`.** Puʻiwa and Lāʻimi are named lands in
  lower and upper Nuʻuanu whose bounds I could not establish (the surviving street names
  do not keep the old order up the valley). Pauoa and Kuamoʻo are lands the State layer
  folds into a larger unit. They are marked `ahupuaa`, but their points are not always
  the State-layer centroid. Pauoa and Kuamoʻo use GNIS land-division points; Puʻiwa and
  Lāʻimi share the Honolulu centroid. So Nuʻuanu stops 6 and 7 fly to the same point
  until someone places them. Suggest a `locality` precision, or reading `ahupuaa` as a
  soft radius around the given point.
- **Tellings have no `where`.** Pages for a telling are in the event's `sources` entries
  and in the telling's text. A `where` on each telling would be cleaner.
- **One precision for both ends of a date.** "Signatures gathered in the autumn, read
  into the record on 9 December" can't be said, so `kue-1897` is year-precision.
- **No vocabulary for confidence.** `firm | soft | contested` is used and enforced.
- **Event kinds.** There is nothing for trade or economy (sandalwood, whaling are
  `other`) or for a change of government (the overthrow is `other`).
- **Archipelago-wide events** need a place. `pae-aina` (Ka Pae ʻĀina, island precision,
  a point near the middle of the chain) carries the settlement and depopulation events.
- **Kahiki** is off the map. It is a `sea` place at the south-east corner of the
  archipelago pack, with a note that it is a direction marker.
- **Split holdings.** A moku split between two polities in one era can only be noted,
  not drawn.
- **Extra fields.** Places carry `note`; sources carry an optional `tertiary`;
  `polities.json` carries `about`, `notes` (with `_` for an era-wide note) and `sources`
  (per era). None replace a DATA.md field.
- **`burial` and `shrine`** appear in the rules but not in the place-kind list. The check
  accepts them as kinds only so that the burial rule can bite. No such place exists.

## 7. Still needs people

**A reader of Hawaiian and a speaker**, before anything reaches a card:

- Every Hawaiian title and gloss: Kalelekaʻanae, Kukiʻiahu, Kepaniwai and Kaʻuwaʻupali,
  Kepuwahaʻulaʻula, Maʻi ʻōkuʻu, ʻAi noa, Pipi and puaʻa-bipi, Ka Māhele, ʻIliahi, ʻOnipaʻa.
- Kaʻiwi or Kaiwi for the Molokaʻi channel; Kūheʻeia (UH News) or Kūheia (Ka Wai Ola) on
  Kahoʻolawe; Lēʻahi or Laeʻahi; the battle name "Ahulau ka piipii i Kakanilua", left
  untranslated.
- This pass read only English translations. Kamakau's own Hawaiian in *Ka Nupepa
  Kuokoa* and *Ke Au ʻOkoʻa*, and the Papakilo newspapers generally, have not been read.

**A cultural reviewer**, for every card that touches the sacred, the dead or the living:

- **Burials and the dead.** The Wailuku dunes (Kakanilua), the Nuʻuanu pali, Kuamoʻo,
  Keōua's people at Kīlauea, Kalaupapa, Kamehameha's bones, and Cook's remains (the card
  says only that some bones were given back). All are unplaced or held at ahupuaʻa
  precision. The wording around them needs review, as does the decision not to say that
  Keōua's body was offered at Puʻukoholā.
- **Exact pins on sacred sites.** Puʻukoholā (NPS site, `landmark: true`), Kūkaniloko
  (state monument; its landmark evidence is tertiary), and Kamakahonu with Ahuʻena (NHL
  per a tertiary source). Confirm that the communities are comfortable with exact
  points. All other heiau, Wahaʻula, the Kahikinui heiau, Hikiau and Kaheiki are
  unplaced.
- **The living.** Kalama Valley, Kahoʻolawe (George Helm and Emmett Aluli are named),
  Waiāhole–Waikāne, Paepae o Heʻeia, Kākoʻo ʻŌiwi and the Waimānalo Limu Hui should be
  asked how they want to be shown.
- **Political framing.** The overthrow, the Republic, annexation and the coda polity
  (`usa`, with a note that annexation's legitimacy is contested) are politically live.

**A historian with a library card**, to turn `verify` into read:

- ʻĪʻī, *Fragments*; Kuykendall vols. I and III; Cordy, *Exalted Sits the Chief*; Kirch,
  *How Chiefs Became Kings* and *Heiau, ʻĀina, Lani*; Silva, *Aloha Betrayed*; James,
  *The Battle of Nuʻuanu*; Thrum's *Annual* for 1911; Schmitt 1969 and Greer on the 1853
  smallpox (*HJH*); Stannard; Sahlins and Obeyesekere; Chinen on the Māhele; Wilcox,
  *Sugar Water*; Pukui, Elbert and Mookini, *Place Names of Hawaii*.
- The 1890s Honolulu papers for the Pali road find (§3).
- Exact positions: Pāhonu (now ahupuaʻa precision), Puʻiwa and Lāʻimi, the Molokaʻi
  sandalwood pit (left out for want of a sourced position), and GNIS or NRHP coordinates
  to replace the three tertiary ones.
- Fornander's racial and origin theories are long discredited. He is cited only for the
  traditions he recorded and for the 1770s–1795 wars, where he wrote from survivors and
  contemporaries.

## 8. Routes

A second pass, October 2026, added `routes.json`: 20 routes over the sea, the far view's
"voyaging and fleet routes, ship tracks" (DATA.md "Routes" has the schema and the rules).
It also added eight places that the routes name as ends, and a `routes` list on the sixteen
events the routes belong to; no event was otherwise changed. No source was added: every
route rests on sources already in `sources.json`, re-read for this purpose at the pages
below. Run `tools/check-data.mjs` as before; it now checks the routes too.

### What was read

| source | read for the routes |
| --- | --- |
| `cook-1784-v2` | Bk. III ch. XI, pp. 191–221 (18 January – 2 February 1778), and the last chapter, pp. 529–549 (25 November 1778 – 17 January 1779), in the Internet Archive full text. Every printed position used was checked against the page scans. |
| `king-1784-v3` | P. 3; bk. V ch. II, pp. 30–34 (4–11 February 1779); ch. V, pp. 82–95 (22 February – 8 March); bk. VI ch. I (15–16 March); the table of the islands' positions in ch. VI. Scans checked for 24 and 27 February. |
| `fornander-v2` | Pp. 33–36 (Pāʻao), 49–58 (Moʻikeha, Kila, Laʻa), 150–157 (Kalaniʻōpuʻu on Maui), 222 (1783), 235–238 (1790), 243–247 (1791), 343–348 (1795). |
| `kamakau-ruling-chiefs` | Pp. 84–91, 135–136, 147–149, 160–162, 171–174, 186–189, 195–196: the djvu text of the same Internet Archive item, with pages taken from its running heads. |
| `dibble-1843` | Pp. 64, 71, 72. |
| `jarves-1847` | Pp. 96–97; ch. VII, the passage before Broughton's visit; the whaling table. |
| `bingham-1847` | Pp. 79–92 (the Thaddeus), 134 and 358 (the whale ships). |
| `merlin-1990-sandalwood` | Pp. 50–52. |
| `ks-kealaikahiki-2020` | Pp. 1–2. |
| `usgs-gnis` | About sixty headlands, landings and bays, to fix Cook's bearings and to draw the coasts the routes pass (queried 2026-10-20). |
| `state-gis-moku`, `-ahupuaa` | The coastline the routes keep off, and the centroids of the new moku and ahupuaʻa places. |

### What each route rests on

| route | points | rests on | what the points are |
| --- | --- | --- | --- |
| `first-canoes-from-kahiki` | schematic | `athens-2014`, `wilmshurst-2011` (dates, as in the event), `ks-kealaikahiki-2020` | a bearing in from the `kahiki` marker, past Ka Lae and up the Kealaikahiki channel to the middle of the chain; no source gives a landfall |
| `paao-voyage` | schematic | Fornander pp. 33–36 | Kahiki, off Puna, along Hilo and Hāmākua, to ʻUpolu by Puʻuepa; only the districts are sourced |
| `moikeha-voyages` | schematic | Fornander pp. 49–54 | Waipiʻo to Kahiki, then back past Kaʻū, Honuaʻula and Makapuʻu to Wailua; the companions' places are named, not ordered |
| `kila-laa-voyages` | schematic | Fornander pp. 54–58 | Wailua down the chain to the south point, Kahiki, then to Kualoa; Laʻa's windward approach is drawn only so the line reaches Kualoa by sea |
| `kalaehohoa-1775` | narrative | Fornander pp. 150–151, Kamakau p. 84 | Hāna to Kalaeokaʻīlio and back |
| `kakanilua-1776-fleet` | narrative | Fornander pp. 152–153, Kamakau pp. 85–86 | Hawaiʻi (place not named; dashed from the Kohala coast), Keoneʻōʻio, Mākena, Kiheipukoʻa |
| `kalaniopuu-maui-1778` | narrative | Fornander pp. 156–157, Kamakau pp. 89–91, Cook p. 532, King p. 3 | Mokulau, Kahoʻolawe, Lahaina, Lānaʻi, the Pailolo channel, Honokōhau, Kahakuloa, Hāmākualoa, Koʻolau |
| `cook-1778-kauai` | journal | Cook pp. 191–221 | 18 January to 2 February 1778, day by day; in from the south and away north dashed |
| `cook-1778-79-hawaii` | journal | Cook pp. 529–549, King pp. 30–34 | 26 November 1778 to 11 February 1779, including the run to Kohala and back; in from the east dashed |
| `clerke-1779-leeward` | journal | King pp. 82–95, bk. VI ch. I | 22 February to 15 March 1779 |
| `kahekili-oahu-1783` | narrative | Kamakau p. 135, Fornander p. 222 | Lahaina, north of Lānaʻi, the Molokaʻi shore, the open sea, Waikīkī |
| `kamehameha-maui-1790` | narrative | Fornander pp. 235–238, Kamakau pp. 147–149 | Kohala, Hāna, the north coast to Halehaku, Kahului, Kaunakakai |
| `kepuwahaulaula-1791` | narrative | Kamakau pp. 160–162, Fornander pp. 243–244, Dibble p. 64 | Mokulau, Hālawa in Kohala, Waipiʻo, off Waimanu, back to Hāna |
| `nuuanu-1795-fleet` | narrative | Fornander pp. 343–347, Kamakau pp. 171–172 | Hawaiʻi (dashed from Kohala), Lahaina, the Molokaʻi shore, the Kaʻiwi channel, Waiʻalae and Waikīkī |
| `kaieiewaho-1796` | narrative | Kamakau p. 173, Jarves ch. VII | Waiʻanae to mid-channel, there and back |
| `peleleu-1802` | narrative | Kamakau pp. 187–189, Dibble p. 71, Jarves pp. 96–97 | Hilo (dashed to Kīpahulu), Kīpahulu, Kaupō, Lahaina, Oʻahu |
| `kaumualii-1810` | narrative | Kamakau pp. 195–196 | Waimea (dashed), the Kaʻieʻiewaho channel, the sea of Māmala, there and back |
| `thaddeus-1820` | narrative | Bingham pp. 79–92 | the dated places of the brig's approach, Kailua, and the passage outside the islands to Honolulu |
| `iliahi-lane` | schematic | Merlin pp. 50–52 | Kawaihae to Honolulu and on west towards Canton |
| `whaling-lane` | schematic | Bingham pp. 134, 358; Jarves's table | from the west (the Japan grounds) to Honolulu and Lahaina, and back |

### Cook's and King's positions

- **The rule.** A noon position printed in the journal is used as printed when it falls
  at sea in the waters the day's text describes (18 January 1778; 26 November and
  24 December 1778; 24 February 1779). Otherwise the point is fixed from that day's
  bearings and distances to land, taken from GNIS points (the Waimea and Niʻihau
  anchorages, 19 and 24 January, 1, 18, 20 and 22 December, 10 January, 7 February with its
  observed latitude, Waimea on Oʻahu). Days with only words ("five leagues farther up the
  coast", "a mile from the shore") are placed by the words. Each waypoint says which.
- **The fixes close.** The two bearings Cook gives at the Niʻihau anchorage (the south-east
  point and the other extreme) put the ships about a kilometre off Kahāʻino; from there his
  third bearing, Kaʻula at S61°W, comes out at S61°W. The fix of 1 December from Maui and
  ʻUpolu puts Waipiʻo exactly on the S22°E he gives for Hawaiʻi's east extreme.
- **Where print and bearings part, the bearings win.** The time-keeper longitudes printed
  for 7, 8 and 13 January 1779 (203° 26′, 203° 13′, 203° 40′ E) lie 50–70 km west of the
  coast that the same days' bearings place the ships "two leagues" and "two miles" off.
  The scans show the figures are printed so; they are not OCR slips. King's longitude of
  27 February lies about 25 km east of the north point of Oʻahu he says the ship was
  abreast of. Both are given in the tellings. On 26 November the bearing of the isthmus
  would move the ship about 15 km west of the printed longitude; there the printed
  position, which lies at sea off the coast described, is kept.
- **The ships' own frame.** King's table puts Hawaiʻi's points 0.05–0.1° west of GNIS
  (Kealakekua at 204° 0′ E, against 155° 55.7′ W), and the tracks are not corrected for it,
  so a journal point may sit up to about 10 km west of where the ship was. At the far zoom
  where routes show, that is a few pixels.
- **The lines between points are joins.** The ships tacked between them. Cook's seven weeks
  beating to windward round Hawaiʻi make that track a tangle, which is what the journal
  records.
- **Dates** are as the journals print them, which are the dates the gazetteer already uses
  for Cook (18 January 1778, 14 February 1779).

### Which routes are schematic, and why

- **The four voyaging routes.** The traditions name districts and capes, never a course, and
  Kahiki lies off the map; the `kahiki` marker stands for it. Each summary says so.
- **The two trade lanes.** They join the ports the sources name, Kawaihae and Honolulu for
  sandalwood (Merlin, quoting Ellis and Kotzebue), Honolulu and Lahaina for the whalers
  (Bingham, Jarves), and point west, towards Canton and the Japan grounds. No ship's course
  was read for either.
- **Dashed stretches inside other routes.** Cook's approaches (from the south in January
  1778, on the bearing between two noon positions; from the east in November 1778, on the
  latitude of the 25th) and his departure north on 2 February 1778; the Thaddeus's approach
  from the east; and the departures no source places: Kalaniʻōpuʻu's fleet in 1776 and
  Kamehameha's in 1795 (drawn from the Kohala coast nearest Maui), the peleleu fleet (from
  Hilo, after Dibble's "forests of Hilo"), and Kaumualiʻi in 1810 (from Waimea, where ships
  calling at Kauaʻi met him).

### What could not be sourced, or was left out

- **Places of departure and landing** not named in any source read: those above, and where
  the peleleu fleet landed on Oʻahu (the line ends at Waikīkī). Fornander has Kamehameha
  gather in Kohala in 1790, so that start is narrative, not dashed, though the landing
  within Kohala is not named either.
- **Kepuwahaʻulaʻula** is told three ways: off the Waimanu cliffs (Kamakau), off the Pali
  Hulaʻana of Waimanu (Fornander), off Kohala (Dibble). The line follows the invaders;
  Kaʻeokūlani's crossing from Hāna and Kamehameha's fleet from Kona are in the summary,
  not drawn.
- **Kaʻiana's turn** for the Koʻolau side of Oʻahu in 1795 is in the summary only:
  Fornander says neither the landing nor the time of day was ever stated.
- **Readings to check.** Kamakau p. 135 has the 1783 canoes off Molokaʻi reaching "from
  Ho‘olehta to Kaluakoʻi" in the scan read; "Hoʻolehua" is a guess, not used on any card.
  "Puna harbor on Kauai" (p. 173), the target of 1796, names a district, not a harbour, so
  the line stops where the canoes turned. Spellings for a speaker: Kalaeokaʻīlio (the
  kahakō is supplied; GNIS writes "Kailio Point"), Kiheipukoʻa (as Kamakau's edition prints
  it), Ka-ʻopua-kiʻikiʻi (as printed), Kawaʻanui (Kamakau's "Ka-waʻa-nui"), Kaneʻolaelae
  (left out of the card for that reason).
- **Not drawn.** Hōkūleʻa's voyage of 1976 (the article read gives the departure and the
  arrival, not the track); Vancouver's visits of 1792–94 (his volumes were not opened); the
  Jackal and Prince Lee Boo, seized and retaken off Oʻahu in January 1795; the wars of
  Alapaʻinui; the brig Kaʻahumanu's voyage to Canton in 1817, which leaves the map.
- **Two routes have no event**: the Kaupō raid of about 1775 and Kalaniʻōpuʻu's 1778–79
  circuit of Maui. Both are well told (Fornander and Kamakau) and could become events.

### Where the schema grew

The brief's schema gained `from` and `to` (the places the ends stand for, so the check can
hold an end to its place), `schematicSegments` (a dashed stretch inside a solid route),
`waypoints` (a date and a note per point; the journal routes' days), a `course` key in
`confidence`, and `routes` on events. The check allows a named end within 10 km of an
ahupuaʻa centroid, because Wailua's shore lies 8 km from its own, and lets a route meet its
event at a landing within 20 km of the battle (Kiheipukoʻa and Kakanilua).

## 9. Era layers

The record behind `public/data/layers/` (DATA.md, "Era layers"): cultivation,
settlement and forest masks for every island at four keyframes, 1778, 1853, 1896
and 2020. Baked in October 2026 with
`node packages/holo-i-ke-au/tools/bake-layers.mjs --all`. The manifest carries
every rule and source in full; this section says what the sources turned out to
be, what was read where, how the models were checked, and where they are weak.

### Sources used, and what each turned out to be

| source | what it is | used for |
| --- | --- | --- |
| USGS Carbon Assessment of Hawaiʻi land cover (Jacobi et al. 2017, ScienceBase) | one 30 m GeoTIFF of the main islands, NAD83 UTM 4, 48 classes from imagery of about 2007–2012, built on HI-GAP with NOAA C-CAP 2005 land use; it separates native from alien forest, which C-CAP alone does not. Registers on the packs to within a texel. Public domain. | forest now; developed land for spreading the 2020 census; the 1778 forest floor |
| State GIS 2020 Agricultural Land Use (Perroy and Collier 2021) | 4,836 polygons, 15 crop categories from 2018–2020 imagery. Pasture is 765,578 acres of it and is left out; taro is 805 acres, aquaculture 670. | cultivation now |
| State GIS Historical Sugarcane Lands 1900, Pineapple Lands 1900 | 55 cane polygons (about 1,200 km²) and one pineapple polygon, digitised in 2006 for the Department of Health from the 1939 Territorial Planning Board land utilization maps. Layers for 1920 and 1937 also exist. Final QA was never done, says the metadata. | cultivation 1896; plantation camps in the 1896 settlement; forest 1896 |
| State GIS Reserves, forest reserve units | 144 polygons, boundaries as of March 2026 fitted to tax maps; no proclamation dates. | forest 1896 (reserves keep more of their forest) |
| State GIS Geologic Units (Sherrod et al., USGS 2007) | 2,632 units downloaded: flows younger than about 1,500 years, historic ones with their year, and the alluvium, lagoon, lacustrine and fill units. | lava age for the 1778 and 1896 forest; the ground under the valley-floor loʻi rule |
| Traditional Agriculture (Kurashima, with Kirch and Kamehameha Schools, 2012; ArcGIS Online) | 11 multipolygons of high potential for loʻi, dryland and agroforestry, a published GIS model on soils, rain, substrate, slope and water, checked by its authors against archaeology. Covers Hawaiʻi, Maui County, Oʻahu and Kauaʻi, not Niʻihau or Kahoʻolawe. Its dryland zones are the leeward Kohala, Kona and Kaʻū field systems and upcountry and Kahikinui on Maui. No licence stated on the item. | cultivation 1778, and reduced in 1853 and 1896 |
| Land Commission Awards (OHA's Kīpuka, ArcGIS Online `LCA_State`) | 17,146 award polygons statewide, Māhele and kuleana awards with later grants. The `land_use` field is filled for 39 of them, so parcels are used by size: 13,977 under 5 ha count as kuleana. Digitising is uneven: Hawaiʻi Island has far fewer than Oʻahu, Maui or Kauaʻi. No licence stated; used only as a density at hundreds of metres. Hawaiʻi County publishes its own layer of 1,033 awards; it was not needed. | calibration; cultivation and settlement 1853; part of 1778 and 1896 |
| Census 2020 block groups (TIGERweb) | 1,083 block groups with POP100. The Census API itself did not answer from here. | settlement now |
| King 1784, vol. III, pp. 126–128 | King's estimate island by island, read in the archive.org text and checked by its sum: Hawaiʻi 150,000, Maui 65,400, Oʻahu 60,200, Kauaʻi 54,000, Molokaʻi 36,000, Lānaʻi 20,400, Niʻihau 10,000, "Oreehoua" (Lehua) 4,000; 400,000 in all; no Kahoʻolawe. | settlement 1778 |
| Thrum, *Hawaiian Annual* for 1890, p. 11 | "Comparative Table of Population of the Hawaiian Islands", estimate 1823 and censuses 1832–1884 by island, read on the page image; the 1832, 1836 and 1853 columns sum to their printed totals. | settlement 1853; Kahoʻolawe's 1778 back-cast (80 people in 1832) |
| Census of 1896, Table II | population by island and district, 1896 and 1890, read on the page image (the OCR garbles it). Molokaʻi 2,307 and Lānaʻi 105 are separate in 1896 only; Niʻihau 164. | settlement 1896 |
| NPS, A Brief History of Kalaupapa | "over 1,100 people" at Kalawao in 1888–1902 | the Kalaupapa share of Molokaʻi's 1896 count |

### Checked, and not used

- **The Government Survey maps on the State GIS** (`Historic_Maps`: Oʻahu 1881 and
  1899, Maui 1885, a 1900s islands sheet; `SoH_Maps`: USGS topographic sheets of
  1910–1943) are already georeferenced image services. The 1881, 1885 and 1899 sheets
  colour land tenure (crown, government, private), not land use, so they give
  neither loʻi nor forest without reading by hand. They are the obvious next source
  for a hand-digitised 1880s layer.
- **Land Use / Land Cover 1976** (USGS GIRAS, State GIS) is there and would give a
  1970s keyframe for the start of the coda.
- **NOAA C-CAP** was not fetched on its own: the CAH map already folds in C-CAP 2005
  and separates native forest.
- **Fishponds** have no statewide inventory (DESIGN §7.2). A University of Hawaiʻi
  class layer has 55 present-day ponds as points, and the Hawaiʻi Conservation
  Alliance's layer needs a login. Ponds are modelled instead (below).
- **The leeward Kohala and Kona field systems** were not found as open GIS
  footprints; the Kurashima–Kirch dryland zones stand in for them and match their
  published locations by eye.
- **The 1850 census by island** was not found in an open source; Thrum's table
  starts after the Māhele with 1853, which is why the keyframe is 1853.

### What is modelled, and by what rule

The full rules are in `methods` in the manifest; in short:

- **1778 cultivation**: the largest of the Kurashima–Kirch zones (loʻi 1, dryland
  0.75, agroforestry 0.5), a valley-floor loʻi rule read from each pack (flat,
  under about 300 m, on alluvium, lagoon deposits or fill, within 8–25 m of a stream
  whose catchment averages 1,200–2,000 mm or more; flow routed on the pack heights),
  the kuleana parcels, and a fishpond shore (low coast behind a reef flat, at 0.5).
  The valley rule exists because the published zones run on modern soils and stop at
  a straight line where Honolulu and Waikīkī are mapped as urban land or fill; with
  it, Waikīkī, Kalihi, Mānoa, Kawainui and the Pearl Harbor stream mouths come back.
- **1778 settlement**: weights from fields, coast, rain and kuleana, scaled per island
  to King. **1778 forest**: rain (700–1,500 mm ramp), tree line (1,900–2,700 m),
  lava age, then Kirch's clearing as FOREST.md gives it (below 460 m mostly farmed or
  burned, untouched above 760 m), never less than the native forest standing now.
- **1853**: kuleana mapped; the contact zones kept at 0.25–0.9 (loʻi more where
  kuleana were claimed); people per island from the census, spread 0.6 by kuleana and
  0.4 by the contact weights. No forest.
- **1896**: cane and pineapple of 1900 mapped; loʻi kept at 0.3–0.7, dryland at 0.1,
  ponds at 360/488; people per census district, with town shares (an assumption,
  except Kalaupapa's head count), cane camps, kuleana and the contact pattern. Forest
  between the contact forest less cane and new lava and the forest standing now:
  0.85 of the way up inside forest reserves, 0.4 outside.
- **2020**: mapped throughout.

### How the models meet the kuleana

The share of kuleana-sized award area (parcels under 5 ha, on each island's own
texels) inside the published zones, inside the valley rule, and inside either, at
0.5 or more:

| island | kuleana km² | in the zones | in the valley rule | in either | zones km² | of which loʻi | valley rule loʻi km² |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hawaiʻi | 28.4 | 34% | 2% | 34% | 438.5 | 5.5 | 3.9 |
| Maui | 33.0 | 22% | 4% | 22% | 136.7 | 11.0 | 5.6 |
| Lānaʻi | 1.1 | 2% | 0% | 2% | 3.1 | 0 | 0 |
| Molokaʻi | 7.3 | 48% | 18% | 50% | 32.4 | 8.5 | 4.2 |
| Oʻahu | 19.7 | 73% | 25% | 74% | 316.4 | 65.6 | 35.9 |
| Kauaʻi | 15.5 | 36% | 21% | 37% | 110.3 | 38.5 | 23.4 |

Oʻahu fits best. On Maui and Hawaiʻi Island most kuleana lie outside both models:
upcountry Kula and the Hāna and Kaupō coasts on Maui, Hilo, Hāmākua and Puna on
Hawaiʻi Island, where people farmed kula and wet uplands that no model maps as
intensive, and Keʻanae, whose loʻi stand on lava, not alluvium. That is why the
parcels themselves enter every pre-1900 cultivation layer.

### The figures, and what the layers hold

| island | 1778 King | 1853 census | 1896 census | 2020 census (from the layer) |
| --- | --- | --- | --- | --- |
| Hawaiʻi | 150,000 | 24,450 | 33,285 | 200,639 |
| Maui | 65,400 | 17,574 | 17,726 | 154,136 |
| Oʻahu | 60,200 | 19,126 | 40,205 | 1,015,858 |
| Kauaʻi | 54,000 | 6,991 | 15,228 | 73,165 |
| Molokaʻi | 36,000 | 3,607 | 2,307 | 7,372 |
| Lānaʻi | 20,400 | 600 | 105 | 3,398 |
| Niʻihau | 10,000 | 790 | 164 | 84 |
| Kahoʻolawe | 250 (back-cast) | none listed | not counted apart; the bake joins it to Makawao | 0 |

Each layer reproduces its island's figure within the log rounding (Lānaʻi's 105
people of 1896, spread over 364 km², come back as 111). Cultivation, as area, from
1778 to now: Hawaiʻi 355, 142, 588, 163 km²; Oʻahu 218, 126, 269, 94; Maui 141, 81,
277, 31; Kauaʻi 93, 56, 205, 85. Native forest from 1778 through 1896 to now:
Hawaiʻi 3,857, 2,690, 1,991 km²; Kauaʻi 446, 333, 210; Maui 567, 414, 263; Oʻahu 235,
182, 130.

### Where the layers are weak

- **The 1778 figures are King's.** The estimates run from 200,000 to 1,000,000 (§3);
  every density scales with the choice. King's Lānaʻi (20,400) and Niʻihau (10,000)
  are high against everything after.
- **East Hawaiʻi and windward East Maui are thin in 1778** for the reason above. The
  published zones show nothing there and the awards are thinly digitised on Hawaiʻi
  Island.
- **The modern land runs under the old**: the packs' DEM is a 2010s snapshot, so the
  Honolulu reef runway, Kakaʻako and other fill on the reef are land and carry 1778
  and 1853 values. (Waikīkī's ponds and marsh, filled in the 20th century, rightly
  show as cultivated in 1778.)
- **Ponds are a shore rule**, not ponds: it marks the reef-flat coasts (Molokaʻi's
  south shore, Kāneʻohe, Pearl Harbor, much of Oʻahu) where a wall could be built.
- **The 1896 town shares and forest fractions are the bake's assumptions**, written in
  the manifest; the reserve boundaries are today's.
- **Lava**: flows after 1778 are drawn as whatever the rules give the ground beneath
  them in 1778, which nobody knows; flows of 1778–1896 are bare in 1896.
- **Before about 1450 the 1778 layers overstate the land in use**; the keyframe note
  says so and the app should thin them.
- Kona coffee (which the 1896 census credits for Kona's growth), rice as its own crop,
  and ranching are in no layer.

### Still needs people

- **Kalaupapa.** The 1896 settlement layer shows the people exiled there for Hansen's
  disease as a density on the peninsula, from the NPS count. How the app labels that
  should be reviewed with the community, as the gazetteer's Kalaupapa event is.
- **Licences.** OHA's award layer and the Kamehameha Schools agriculture model carry no
  licence on their ArcGIS Online items. Both are used only through smoothed rasters at
  hundreds of metres, with credit; ask both before release.
- **An archaeologist** to set the 1778 zone weights (0.75 for dryland, 0.5 for
  agroforestry) and the 1853 and 1896 retention against survey, island by island.
- **A historian** with Schmitt's *Demographic Statistics* for the 1850 census and for
  district figures before 1896, and with the Government Survey sheets for an 1880s
  layer drawn by hand.

## 10. Nuʻuanu 1795

The record behind the first close-up (DATA.md "District packs"): the gazetteer
entries the near view needs to draw Nuʻuanu and Honolulu in 1795,
`public/data/districts/nuuanu/features.json`, the cameras on the stops of
`nuuanu-1795`, and the same treatment at smaller scale for Kaheiki, 1783. Made in
October 2026. The district's heights, rain, fill patch and `districts/manifest.json`
are a separate bake and are not described here. `tools/check-data.mjs` now reads the
features file named in the manifest (or, with no manifest, `districts/*/features.json`
against a fallback box) and the stop cameras; it is clean.

| file | change |
| --- | --- |
| `places.json` | 82 places (was 65): Puʻiwa and Lāʻimi placed apart, Kou moved to the harbour, Pauoa's note corrected, 17 added |
| `events.json` | `nuuanu-1795`: seven more places, cameras on stops 4–8, eight more sources, eight more tellings, the Thrum and Wikipedia tellings corrected. `kaheiki-1783`: placed at Kaheiki, near zoom, three stops with cameras, three tellings |
| `sources.json` | 73 (was 64): nine added, `thrum-annual-1911` now opened |
| `districts/nuuanu/features.json` | 61 features: loʻi 7, fishpond 13, village 1, heiau 5, stream 6, trail 2, label 9, force 13, line 5 |

### What was read

| source | what, and where |
| --- | --- |
| `kamakau-ruling-chiefs` | Pp. 135–137 (Kaheiki, 1783), 171–174 (Nuʻuanu), 192 (Kamehameha's cultivation of Honolulu, Kapālama and upper Nuʻuanu), 197 (houses burned from Honolulu to Kalihi), 271–273 (Honolulu in Liholiho's time: Kikihale, Pākākā, Honuakaha, the ponds of Kahoʻikekanaka), 291–292 (Boki's roads: Pauoa stream, Kaheiki, ʻAlekoki, Kawānanakoa; the old road from Kahapaʻakai; the guardian stone Hoʻeu; Boki's taro to Makuku), 419 (Pākākā to Kakaʻako). The djvu text of the same Internet Archive item, pages from the running heads. |
| `fornander-v2` | Pp. 222–225 (Kaheiki), 342–349 (Nuʻuanu). |
| `ellis-1827` | Pp. 11–17: the plain of Honolulu, the valley "a complete garden", "about three miles through one unbroken series of plantations", the path over the pali and the stone figures at its head, his telling of the battle, the town of the 1820s. |
| `jarves-1847` | Ch. VII, the Nuʻuanu passage (the running heads are not legible enough to give pages). |
| `bingham-1847` | P. 47. |
| `dibble-1843` | P. 71. |
| `thrum-annual-1907` | "Heiaus and Heiau Sites throughout the Hawaiian Islands", pp. 44–45 (Honolulu and Nuʻuanu). On the Internet Archive as `acp0143.1907.001.umich.edu`. |
| `johnstone-1908` | "Storied Nuuanu", in the Annual for 1908, pp. 160–167; and the same volume's tables of road distances and heights (Nuʻuanu Road to the Pali). |
| `thrum-annual-1911` | "John Young: Companion of Kamehameha", pp. 93–105, p. 100 in full. The earlier pass found no copy; it is `acp0143.1911.001.umich.edu`. |
| `pacific-worlds-nuuanu` | The battle page, in the Wayback Machine copy of 8 June 2007. |
| `wikipedia-battle-of-nuuanu` | The wikitext, to see what its citations sit beside. |
| `hgs-1881-oahu`, `hgs-1899-oahu` | The State GIS georeferenced image services, exported at about 5 m over the district and read window by window with a lon/lat grid drawn on; the 1881 sheet's title block and notes. |
| `usgs-topo-1927-oahu` | The State GIS mosaic, over Kalihi Kai and Kālia. |
| `oha-kipuka-sites` | Historic site polygons and points in the district box (74 polygons, 676 points, 2 lines). |
| `state-gis-streams-dar` | 179 stream segments in the box. |
| `census-tiger-roads` | Streets with old land names; the line of the Nuʻuanu road. |
| OHA `LCA_State`, `Ili_State`, `LocationIndex` | Queried over the box for kuleana and ʻili (below). Not cited by any entry, because they turned out to hold nothing for Nuʻuanu. |
| USGS GNIS | 300 names in the box, for Kapena, Pūowaina, ʻĀlewa, Pauoa Flats, Mānoa and checks on the maps' registration. |
| `boundaries/ahupuaa.geojson` | Area-weighted centroids: Honolulu (−157.83197, 21.33149), Kapālama, Kalihi; point-in-polygon for every new place. |

### What could not be reached

- **McAllister, *Archaeology of Oahu* (1933).** The Internet Archive copy (`archaeologyofoah0000mcal`, the 1971 Kraus reprint) is lending-only and its search-inside endpoint refused; the Biodiversity Heritage Library answered with a Cloudflare challenge; the Bishop Museum's list of bulletin PDFs has none for no. 104; the tDAR record is restricted. No site description of McAllister's was read. The State site numbers in the Kīpuka layer are cited as the layer gives them; whether the low numbers repeat McAllister's was not checked, and nothing here relies on it.
- **ʻĪʻī's *Fragments*** (print). Its description of the Honolulu–Nuʻuanu trail of about 1810 is the obvious next source for the trail and for the ʻili of the valley.
- **James, *The Battle of Nuʻuanu* (2004)**, the map behind Wikipedia's account and probably behind the oral account (print).
- A report titled "Archaeology, Legends and Oral History of Nuʻuanu" on historichawaii.org answered 404.
- Wikimedia Commons' API rate-limited the search for early harbour charts (the 1825 chart of the Blonde's survey would show the ponds of the shore thirty years after the battle); Google Books' API was over quota.

### How each place was fixed

| place | precision | how |
| --- | --- | --- |
| `puiwa` Puʻiwa | exact (a neighbourhood) | The 1899 map writes PUIWA on the valley floor just above Queen Emma's summer house (Hānaiakamalama); Puiwa Road and Puiwa Lane (TIGER) run beside it. The point is between the two. |
| `laimi` Lāʻimi | exact (a neighbourhood) | The 1881 Government Survey sheet writes Laimi across the valley floor just above "Queen Emma's Gardens"; the point is that label. Johnstone puts the decisive point "a little above the Queen Emma place". Laimi Road lies about a kilometre lower, west of the stream. |
| `kou` Kou | exact | Moved from GNIS's Honolulu point (the palace grounds) to the middle of the village outline below. |
| `pakaka` Pākākā | exact | "Pakaka [the end of Fort Street]" (Kamakau p. 272); the foot of Fort Street drawn back toward the old shore. It lies seaward of the State layer's coast, so its moku is set by hand. |
| `luakaha` Luakaha | exact | The 1881 label across the flats ("Luakaha Crown"). |
| `kawananakoa` Kawānanakoa | ahupuaʻa | Above Puʻiwa and below Luakaha in both lists of posts; "in the upper part of Nuuanu valley" (Fornander). A marker on the valley road between Lāʻimi and Luakaha. |
| `kahapaakai` Kahapaʻakai | ahupuaʻa | Above Luakaha in both lists; a marker just above the Luakaha label. |
| `kaheiki` Kaheiki (battlefield) | ahupuaʻa | Between Pauoa and Nuʻuanu: Boki's road runs from the Pauoa stream down Kaheiki and up to ʻAlekoki (Kamakau p. 291); the defence stood on the ridge facing Pauoa down to Kapena (p. 136). A point on that ridge above Kapena. |
| `kaheiki-heiau` | ahupuaʻa, at the Honolulu centroid | Thrum: site undiscovered. Never a point. |
| `kapena`, `puowaina`, `alewa`, `pauoa-flats`, `manoa` | exact | GNIS (Kapena Pool, Punchbowl, ʻĀlewa Heights, Pauoa Flats, Mānoa Valley). |
| `kapalama`, `kalihi` | ahupuaʻa | Centroids of the State layer. |
| `nuuanu-pali-trail` | exact (within a few hundred metres) | The 1881 road to the gap, then schematic down the windward face. |
| `kuwili` | exact | The 1881 label on the shore west of Iwilei. Not the Loko Kuwili of Kālia. |
| `kalia-fishponds`, `kalihi-fishponds` | exact | Middle of each group of pond outlines below. |

**Why the street names seemed to break the order, and why they don't.** §6 set Puʻiwa
and Lāʻimi aside because "the surviving street names do not keep the old order up the
valley". The trouble was Kawānanakoa: Kawananakoa Place lies near Mauna ʻAla, below Puiwa
Road, while both lists put Kawānanakoa above Puʻiwa. Kawananakoa Place is not used; the
two survey maps put Puʻiwa and Lāʻimi side by side above Queen Emma's place, mid-valley
rather than at its mouth, and Lāʻimi lies above Puʻiwa as the battle needs. The brief's
"Lāʻimi by Mauna ʻAla" is not borne out: the mausoleum stands about two kilometres
lower, close to where the oral account puts Kaʻiana's death.

Neither map can be read as a bound: the 1899 sheet's registration is a few hundred
metres looser than the 1881 one's, and both write a land's name across its middle. The
schema still has nothing between `exact` and `ahupuaa` (§6); these two are `exact` to a
neighbourhood, and their notes say so.

### What the kuleana parcels showed

Nothing for Nuʻuanu. OHA's `LCA_State` has 69 parcels that reach into the district
box: 17 in upper Kalihi (all "Missing Helu" of unknown award type), 10 in Waikīkī (Kālia
and Pāwaʻa), 25 with no ahupuaʻa (Makiki, Pāwaʻa and later grants), 15 windward below the
pali and two in ʻEwa. There is no award in Nuʻuanu, Pauoa or Kapālama, and `land_use` is
filled for two parcels (both "Loi", at Kālia). OHA's ʻili
layer has three ʻili in Honolulu ahupuaʻa (Kaʻākaukukui, Kukuluāeʻo, Anuenue) and none in
Nuʻuanu; its location index has five Honolulu rows, and its one Puiwa is a government
land in Kāneʻohe. So the awards that would map the loʻi of 1848 were not available, and
the loʻi below are outlines of the valley floors, not parcels. The Honolulu awards are
in the Land Commission records (Waihona ʻĀina, the Māhele Award Book), which a person
can read.

The 1881 sheet has no taro labels in these valleys. It rules the valley floors and the
shore flats with the same fine horizontal hatching, and its notes do not define it; it is
read here as wet land. The 1899 sheet writes "Rice" and "Ponds" at Kālia and Mōʻiliʻili,
not in the valleys.

### How the features were made

All coordinates lie inside the manifest's box (−157.897 to −157.779 W, 21.269 to
21.381 N). A feature's `to` is the last year a source read shows it, not a sourced end:
the near view needs some end, and none of these has a recorded one.

- **Loʻi** (`inferred`): ground within a set distance of the stream, gentler than a set
  slope and below a set height, inside the ahupuaʻa, on a 12 m grid with the Oʻahu
  pack's heights (68 m, bilinear) and the DAR streams, traced, rings under 1.5 ha
  dropped, simplified at 18 m. Per valley (distance, slope, height, latitudes): lower
  Nuʻuanu 230 m, 12 %, 230 m, 21.317–21.351 (the valley mouth to about Kahapaʻakai);
  upper Nuʻuanu 200 m, 15 %, 330 m, 21.351–21.3605; Pauoa 200 m, 12 %, 140 m;
  Kapālama 200 m, 12 %, 120 m; Kalihi 230 m, 12 %, 200 m; Mānoa 450 m, 10 %, 150 m.
  Each later valley excludes ground already claimed. The reservoirs' gap in the
  Nuʻuanu stream line is joined straight. Areas: lower Nuʻuanu 186 ha, upper 70,
  Pauoa 77, Kapālama 62 and 10, Kalihi 102, Mānoa 213. Checked by eye against the 1881
  hatching; 69 % of their area lies where the baked 1778 cultivation layer is 0.5 or
  more (Pauoa 97 %, Kapālama 95 %, Mānoa 89 %, Kalihi 59 %, lower Nuʻuanu 48 %, upper
  Nuʻuanu 28 %: the layer's 68 m texels miss much of the narrow upper valley). The upper
  Nuʻuanu patches begin in 1796, because Kamakau credits them to Kamehameha's years on
  Oʻahu (p. 192) and to Boki in 1829 (p. 292) and says nothing of them before.
- **Fishponds**: the six Kālia ponds and two Kalihi ponds are the State site record's
  outlines as the Kīpuka layer publishes them (`mapped`, with the site number in `site`);
  Apili, Pahou and ʻAuiki are traced from the 1927 sheet, which names all five Kalihi
  ponds (`mapped`); the two site outlines match the 1927 Pahouiki and Ananoho. Kuwili
  (Iwilei) is `schematic`: the 1881 sheet gives the name and ruled wet ground but no
  walls. Kahoʻikekanaka is `schematic`, from Kamakau's "makai of Honuakaha" alone. No
  pond named Kaʻākaukukui, Kawa or Mokauea was found in any source read: Kaʻākaukukui is an
  ʻili at Kakaʻako (OHA) where the 1881 sheet has salt works, Mokauea is a land award and
  an island, and the only Kawa in the box is a windward stream. The burials, caves and
  heiau in the same layer were not copied.
- **Village**: Kou, an outline between the Nuʻuanu stream mouth, Pākākā and about King
  Street (`inferred`, to 1820). The households are a telling: no source read counts them
  for 1795; Kamakau says Honolulu "was seldom used in Ka-lani-ku-pule's day", and Ellis
  gives the 1820s town 6,000 or 7,000 people after the shipping trade had grown it. No
  estimate is made.
- **Heiau**: Kaheiki, Pākākā, Kawaluna (Waolani), Makuku and Kaahaimauli from Thrum's
  list, all at the Honolulu centroid with `placePrecision: ahupuaa`. The check holds each
  to within 300 m of the centroid.
- **Streams**: the DAR courses of Nuʻuanu, Pauoa, Waolani, Kapālama, Kalihi and Mānoa
  (`mapped`, modern); Mānoa stops at the valley mouth because the Ala Wai is modern.
- **Trail**: Kou to the gap along the road of the 1881 sheet as today's streets keep it
  (`inferred`; to 1828, when Keanini widened it); the windward descent `schematic`.
- **Forces and lines**, each with `event`, `when` (1795-04; 1783-01) and `step`:
  0 Kaʻiana's people cross from Koʻolau; 1 the Oʻahu posts from Puʻiwa up the valley,
  and the landing from Waiʻalae to Waikīkī (drawn behind Lēʻahi, whose coast is outside
  the box); 2 the march past Kou and up the valley road; 3 the lines at Puʻiwa (Oʻahu
  `stand`, Hawaiʻi `advance`); 4 the fall-back to Lāʻimi and the lines there; 5 the
  retreat to the head of the valley, the pursuit, and the escapes west over ʻĀlewa into
  Kalihi and east toward Pauoa; 6 down the old path to Koʻolau (the oral account only).
  Nothing is drawn at the edge of the pali: the retreat ends at the gap, and the one line
  beyond it is people going down the path. For 1783, Kahekili's three columns by
  Pūowaina, Pauoa and Kapena (role `maui`) and Kahahana's defence from the ridge facing
  Pauoa down to Kapena. Only the landing and the fall-back are `inferred`; everything
  else is `schematic`, and the notes say which places the sources name. The month is
  April for both sides of 1795; Bingham's "after three months" from February points to
  May, so the month is soft.

### The stop cameras

`bearing` is the compass direction the camera looks; the camera stands the other way
from the place. Distances are world units (100 m).

| event | stop | place | bearing | pitch | distance | frames |
| --- | --- | --- | --- | --- | --- | --- |
| nuuanu-1795 | 4 | `waikiki` | 15 | 0.5 | 60 | from offshore, the beaches from Waiʻalae to Waikīkī with the plain and the valleys behind |
| nuuanu-1795 | 5 | `kou` | 45 | 0.6 | 40 | from above the harbour, up Nuʻuanu |
| nuuanu-1795 | 6 | `puiwa` | 42 | 0.38 | 16 | up the valley from below Puʻiwa |
| nuuanu-1795 | 7 | `laimi` | 42 | 0.38 | 13 | likewise, closer, from below Lāʻimi |
| nuuanu-1795 | 8 | `nuuanu-pali` | 50 | 0.15 | 18 | the gap from low on the valley floor below it |
| kaheiki-1783 | 1 | `waikiki` | 20 | 0.5 | 50 | the landing |
| kaheiki-1783 | 2 | `puowaina` | 30 | 0.55 | 25 | past Pūowaina toward Pauoa and Nuʻuanu |
| kaheiki-1783 | 3 | `kaheiki` | 40 | 0.45 | 14 | the ridge between Pauoa and Nuʻuanu |

DATA.md gives pitch as 0..1 without a unit; the camera rig's pitch is radians (0.06 to
1.52, easing to 0.6 over a valley). These values read sensibly either way, but DATA.md
should say which. The check holds bearings to 0–360, pitch to 0..1 and distance to the
rig's 8–9000, warns when a near stop stands more than 15 km back, and warns when a near
stop whose place lies in a district has no camera.

### Where the tellings diverge

1. **The guns.** Fornander credits "the superiority of Kamehameha's artillery, the number
   of his guns, and the better practice of his soldiers" and names no one (p. 348).
   Kamakau mentions no cannon in the fight; he says the ships gave Kamehameha
   Kalanikūpule's "munitions of war", and has the orators say the island was won only
   because of it (pp. 171, 173). Jarves (1847) has "a field-piece, which Young had brought
   to bear" kill Kaʻiana; the 1911 Annual (p. 100) says Young "is said to have had charge
   of the cannon" and is credited with that shot; Johnstone (1908) says the same. No
   source read puts Isaac Davis at Nuʻuanu. Settled as far as the open sources go: **John
   Young served at least one gun at Nuʻuanu, by Jarves's account and those after it; the
   Hawaiian historians name no gunner**. DESIGN §8's "who served the guns at Nuʻuanu is
   not established" can now say so, and §3's note on the cannon is answered.
2. **Kaʻiana's death.** At Lāʻimi, where the Oʻahu side was routed (Kamakau); early in the
   battle (Fornander); at a stone wall on a hillside about three miles above the town, by
   Young's field-piece (Jarves); slain in battle (Bingham); a little above Queen Emma's
   place, by Young's cannon (Johnstone, the 1911 Annual); making a stand at the edge of the
   pali (Ellis); near today's Oʻahu Cemetery (the oral account). Kamakau's and Johnstone's
   agree on the place, since the 1881 sheet puts Lāʻimi just above Queen Emma's.
3. **The pali.** Kamakau does not mention it. Fornander: "a large number"; Dibble: "many";
   Bingham: numbers "are said to have been"; Jarves: "some"; Ellis: "it is said four
   hundred"; Johnstone: "the rest". The oral account has a rear guard hold near Luakaha so
   that the main body could get away over the ridges and down the pali paths, and reads
   the name as saying something other than men forced off the cliff. The remains said to
   have been found when the road was cut are now told as 1898 (Wikipedia, from a travel
   guide) or 1897 (the oral account), still without a contemporary report.
4. **Kalanikūpule.** Hides "a little over a year" (Kamakau) or "several months" (Fornander)
   and is caught above Waipiʻo; Jarves and Ellis have him die in the battle.
5. **The date.** No earlier than mid-April 1795 (Fornander); three months after the
   February landing on Maui (Bingham); "probably in the year 1794" (Dibble); "in or about
   the year 1790" (Ellis); May (Wikipedia).
6. **The army.** Bingham gives "16,000 strong" for the Maui campaign. The 1911 Annual gives
   no figure: the "about 12,000 men and 1,200 war canoes" Wikipedia prints next to its
   citation of p. 100 is not on that page, and the earlier telling that cited Thrum for it
   is corrected.
7. **The first engagement.** At Puʻiwa (Kamakau, Fornander); at the foot of Pūowaina, with
   Kamehameha's guns in lower Nuʻuanu and flanking parties over Pauoa Flats (the oral
   account, and Wikipedia's account, which follows James's map).
8. **The name.** *Kalelekaʻanae* (James, through Wikipedia), "Ka-lele-a-ke-anae" (the oral
   account), *Kaleleakaʻanae* (DESIGN). A speaker should decide.
9. **Kaheiki, 1783.** Three columns by Pūowaina, Pauoa and Kapena (Fornander) or two
   companies, one behind Pūowaina and one from Hekili to Kahehuna and ʻAuwaiolimu
   (Kamakau). Kamakau's account of the stream running with the dead is left out of the
   cards.

### Where the schema grew

- A force's `role` may be `maui`, for Kahekili's army of 1783; DATA.md names only the two
  sides of 1795.
- Features carry an `id`; forces and lines carry `event`, `when` and `step`; lines carry
  `side`; any feature may name its gazetteer `place`; heiau carry `placePrecision` and
  `ahupuaa`; the village carries `tellings`; ponds from the site record carry `site`.
- `to` is the last year a source read shows the feature (above).
- Notes and names in features.json are held to the numbers rule, as summaries are.

### Still needs a reader, a library card, or a cultural reviewer

- **A reader of Hawaiian**: Kamakau's own Nuʻuanu chapter (*Ka Nupepa Kuokoa*, 1 and 8 June
  1867) for the posts and for whatever it says of guns; every spelling here (Puʻiwa,
  Lāʻimi, Kaumuʻohena, Kaukahōkū, Kapaʻeli, Kanoneakapueo, which Fornander's scan reads
  Kamoniakapueo, Kahapaʻakai, Keawawapuʻahanui, Kahoʻikekanaka, Kaahaimauli, Auiki,
  Ananoho, Pahou, Paweo, Kaipuni, Kapuuiki, Kaihikapu, Pūowaina or Puʻowaina) and the
  battle's name.
- **A library**: McAllister for the Honolulu ponds and heiau; ʻĪʻī for the trail and the
  ʻili; James's map; Sterling and Summers; the Land Commission records for the Nuʻuanu,
  Pauoa and Kapālama kuleana, which would replace the stream-band loʻi with parcels; the
  Government Survey's registered maps of Nuʻuanu at large scale, for Puʻiwa's and Lāʻimi's
  bounds; the 1890s papers for the Pali road find.
- **A cultural reviewer**: the decision to draw nothing at the edge of the pali and to end
  the retreat at the gap; the five heiau held together at the Honolulu centroid; the Kaheiki
  battlefield point on the ridge, below where tradition puts the heiau; the use of the Kālia
  site area, whose record also holds burials (only the pond outlines were taken); Pūowaina
  as a place, now a national cemetery; and how to credit the oral account's speakers, who
  are living people.

## 11. Fixes after the first render

The first close-up (Nuʻuanu, 1795, and Kaheiki, 1783) was rendered and looked at, and these
are the data fixes that followed, from the render pass and from the project's owner. Made in
October 2026. The district's heights, rain and patches are untouched; the slopes, shores and
cameras below are measured on them. `tools/check-data.mjs` enforces the new rules and is clean.

| file | change |
| --- | --- |
| `districts/nuuanu/features.json` | 62 features (was 61): `stop` on every force and line; a landing force for 1783; the 1795 landing redrawn on the beach; the seven loʻi trimmed to the valley floors; Kuwili and Kahoʻikekanaka rounded; `role: "reference"` on the six streams; fifteen notes rewritten |
| `events.json` | the pali stop's camera; seven sentences rewritten (below) |
| `places.json` | twenty notes rewritten (below) |
| `sources.json` | 74 (was 73): the district's lidar, which the trims and the landings were measured on |
| `routes.json` | three sentences rewritten (below); outside this pass's own files, changed only so the copy rule can hold everywhere |
| `tools/check-data.mjs` | `stop` required and checked, the loʻi slope rule, the copy rule, `role` on streams |

### Which stop shows each force and line

Forces and lines now carry `stop`, the index from 0 into their event's `stops`, at which they
show; the render no longer has to infer it from where each front stands. The render's
inference had settled on a map given with stops counted from 1 (Nuʻuanu stops 3–7 for steps
0–4 and stop 8 for steps 5 and 6; Kaheiki stops 2 and 3 for steps 1 and 2): Nuʻuanu has eight
stops, so there is no index 8. Counted from 0 that is stops 2–7 and 1–2, and read against the
stop texts and the lines it needed two changes:

- **Kalanikūpule's posts** (step 1) show at the Kou stop, not with the landing: the Kou text is
  the one that says the Oʻahu forces hold the valley "from Puʻiwa upward through a line of named
  places", and the Waikīkī text speaks only of the landing.
- **The escapes over the ridges** (step 5) show at the Lāʻimi stop, not at the pali: its text
  ends "some escaping over the ridges on either side", Fornander puts the escapes "up the sides of
  the mountains" straight after the rout (p. 348), and both lines start at Lāʻimi. The retreat,
  the pursuit and the path down to Koʻolau stay at the pali.

| event | stop (from 0) | text | features |
| --- | --- | --- | --- |
| nuuanu-1795 | 2 | the Kaʻiwi channel | `force-kaiana-crossing` |
| nuuanu-1795 | 3 | Waikīkī | `force-hawaii-landing` |
| nuuanu-1795 | 4 | Kou | `force-oahu-posts`, `force-hawaii-march` |
| nuuanu-1795 | 5 | Puʻiwa | `line-puiwa-oahu`, `line-puiwa-hawaii` |
| nuuanu-1795 | 6 | Lāʻimi | `force-oahu-fallback`, `line-laimi-oahu`, `line-laimi-hawaii`, `force-oahu-escape-west`, `force-oahu-escape-east` |
| nuuanu-1795 | 7 | the pali | `force-oahu-retreat`, `force-hawaii-pursuit`, `force-oahu-down-the-trail` |
| kaheiki-1783 | 0 | Waikīkī | `force-1783-landing` (new) |
| kaheiki-1783 | 1 | Pūowaina | `force-1783-puowaina`, `force-1783-pauoa`, `force-1783-kapena` |
| kaheiki-1783 | 2 | Kaheiki | `line-1783-kaheiki` |

Steps keep their meaning (the order within the event); no later step shows at an earlier stop.

### The landings, on the beach

The 1795 landing ran 4.8 km behind Lēʻahi, rising to 80 m on the Kaimukī side of the crater
(the render measured a climb of 59 m) and 14 % of it over today's water. The beaches the sources
name run from Waiʻalae round the seaward side of Lēʻahi to Waikīkī, and the district's south
edge (21.269 N) cuts them: Kaʻalāwai Beach (GNIS) is at 21.257 N, and from Kapiʻolani Park
eastward the shore lies outside the box. Inside it there is only the Waikīkī beach, so both
landings are drawn there and nowhere else.

The line follows `shoreline-1881.geojson`, densified to 15 m and offset inland, at each sample,
at least 40 m and on until the ground is land in 1795 (today's land, less the contact patch) for 30 m on; the offsets
are held to the running maximum over the 75 m either side, averaged over the same window, and
given 30 m more; Douglas–Peucker at 8 m. At Waikīkī today's sea reaches 100–150 m inside the
1881 trace (cross-sections of the lidar across it), so the line keeps inland of both shores; at
Kālia it stays off the fill the contact patch lowers.

| line | vertices | length | heights | over today's water | from the 1881 trace |
| --- | --- | --- | --- | --- | --- |
| 1795, before | 6 | 4.8 km | −1.5 to 80 m | 14 % | 58 m to 3.5 km |
| 1795, after (`force-hawaii-landing`) | 11 | 2.0 km | 0.8–5.3 m | 0 | 70–295 m |
| 1783 (`force-1783-landing`, new) | 9 | 1.6 km | 1.0–3.7 m | 0 | 94–295 m |

The 1795 line runs from the box edge below Lēʻahi to Kālia and ends 90 m from the start of the
march. The 1783 line is the same track to Kawehewehe, the beach GNIS calls Grays Beach
(−157.8317, 21.2773): Kamakau has Kahekili's canoes reach "from Kaʻalawai to Kawehewehe" (p. 135)
and Fornander has the army "encamped and organising" at ʻĀpuakēhau in Waikīkī before the march
inland (p. 224); the three columns already start there. It is `schematic`, role `maui`, step 0,
cited like the other 1783 forces (Fornander, Kamakau) and the 1881 sheet for the shore.

### Loʻi trimmed to the valley floors

The first outlines came from the island pack's 68 m heights, and on the 6 m district heights they
climb the walls. Slope here is rise over run from central differences of the neighbouring texels
(the district grid, 6.05 m; edges clamped), counted over the texels whose centres fall inside a
polygon; the render measured 15–19 % of texels over 20 % slope in Kalihi and Nuʻuanu with its own
sampling, and this measure gives 17.5–22 % there.

Each outline was trimmed, never grown: inside the old outline (less a texel at its edge and two
texels clear of every other loʻi), keep the texels where the share of steep (over 15 %) texels in
a small window is under a threshold; close and open with discs; drop pieces under 1.5 ha (the
first rule); join the pieces that lie within 120 m of each other, inside the old outline, by the
shortest path, five texels wide, across the stream gulch that otherwise splits them; fill holes
under 1 ha; trace the texel edges and simplify at 7.5 m. Window (3–7 texels), threshold
(0.12–0.6), closing (0–2 texels) and opening (1–3) were searched per polygon for the largest floor
whose steep share is at most 4.9 %, with each extra piece counted against it. Every loʻi came out as one
piece, Mānoa with one hole.

| loʻi | before: area, over 15 %, over 20 % | after: area (kept), over 15 %, over 20 % | vertices |
| --- | --- | --- | --- |
| `loi-nuuanu-lower` | 187.2 ha, 24.3 %, 17.5 % | 118.5 ha (63 %), 4.0 %, 1.4 % | 111 → 617 |
| `loi-nuuanu-upper` | 71.0 ha, 27.8 %, 20.7 % | 41.6 ha (59 %), 4.2 %, 1.4 % | 35 → 307 |
| `loi-pauoa` | 77.7 ha, 11.4 %, 7.8 % | 63.0 ha (81 %), 4.3 %, 2.2 % | 42 → 154 |
| `loi-kapalama` | 62.0 ha, 8.9 %, 4.6 % | 55.3 ha (89 %), 4.6 %, 1.6 % | 45 → 105 |
| `loi-kapalama-2` | 9.8 ha, 14.4 %, 4.5 % | 5.4 ha (55 %), 4.6 %, 0.5 % | 22 → 45 |
| `loi-kalihi` | 102.6 ha, 31.0 %, 22.0 % | 45.3 ha (44 %), 4.9 %, 1.5 % | 130 → 199 |
| `loi-manoa` | 214.0 ha, 9.7 %, 6.3 % | 194.7 ha (91 %), 4.9 %, 2.3 % | 97 → 229, one hole |

What went is the walls the stream bands ran up (in lower Nuʻuanu the stream runs along the foot
of the east wall, so much of the band lay on it), the stream gulch itself where it is incised (it
is now notches in the outline, bridged where the floor meets across it), and in two places much of
the floor itself:

- **Upper Kalihi.** Above about 21.354 N the floor is a strip between steep walls, and at 6 m it
  is all terrace and bank: in each 400 m reach, even its ground gentler than 10 % at a 30 m scale
  has 10–30 % of its texels over 15 %. No outline of it can be held under the line without lacing
  round single terraces, so the Kalihi outline now ends in the lower valley and its note says so.
  Whether those terraces are house lots or old loʻi the heights cannot say; the Land Commission
  records could.
- **The upland flats of Luakaha and Makuku**, which lost two fifths of their band along its whole
  length, among them the reservoir's basin and dam, which stand in the bare earth there (the district
  bake cuts a breach through the dam for its streams).

The lidar is today's ground, so the floors are judged on the modern valley: house pads, roads and
channelled streams add their own steep texels. The trims therefore keep the outlines off the walls,
which was the fault seen in the render, and do not claim to find the old patches. The district's
lidar is cited on each loʻi and added to `sources.json`.

### The pali camera

`nuuanu-1795` stop index 7 was `{ bearing 50, pitch 0.15, distance 18 }`: 1.75 km down the valley
and about 320 m above the gap on the terrain's scale, low over the forest of the upper valley, so
the canopy filled the frame.
It is now `{ bearing 57, pitch 0.2, distance 32 }`, from the geometry:

- **Bearing 57.** The trail climbs from Luakaha to the crest on 57° (from the trail's bend at the
  reservoirs, 59°); looking along it puts the camera over the valley axis, so the walls frame the
  valley evenly, the trail and the stream run up the middle of the frame, and the notch sits
  between Lanihuli and Konahuanui.
- **Distance 32, pitch 0.2 (18°).** The camera stands 3 km back, over the valley floor just below
  Luakaha, at about 1,100 m on the terrain's scale: a little above the peaks either side of the gap
  (Lanihuli about 845 m, Konahuanui about 955 m in the district heights), so the gap reads as a V
  in the skyline with the windward plain seen through it and over the lower Lanihuli side. The
  middle of the frame falls on the gap and its bottom edge on the floor 1.25 km in front of the
  camera, by the reservoir, so the frame holds the upper valley from there to the gap.
- Ray-cast over the district and island heights at the rig's 42° field and the near view's ×1.3:
  sky 15 %, the windward side 14 %, the leeward floor 12 %, the walls 51 %. At pitch 0.25 the camera
  rises 330 m over Konahuanui and the windward side fills a quarter of the frame, which flattens the
  notch; at the old camera the floor just in front filled the lower part of the frame, at close
  range, under trees.

### Kuwili and Kahoʻikekanaka

Both sheets were read again over the two places, exported by the State's image services in
WGS 84 at about 2 m a pixel (the scans are about 10 m). The 1881 sheet writes Kuwili on the shore
and rules the ground behind it, east of a curving line and north of the shore road, as wet land; it
draws no pond walls, and the 1899 sheet draws none either. At Kakaʻako the 1881 sheet draws the
salt works and the town but no pond, and Kamakau's "makai of Honuakaha" is all that places
Kahoʻikekanaka. Neither outline can be read, so both are rounded pond shapes of the area the
first shapes recorded, kept `schematic` and saying so in their notes:

- Kuwili: 28.2 ha, its long axis along the shore (110°), centred about 200 m east of the old
  hexagon, whose western quarter lay on the unruled plain; it now sits in the ruled ground north-east
  of the label.
- Kahoʻikekanaka: 4.7 ha, at the old centre, between the town's south corner and the salt works.

### The mapped streams

The six `stream` features keep their courses and names and gain `role: "reference"`: the app routes
its water from the heights, and these are kept for labels and for checks against the routed water.
The Mānoa note now says where the line ends without saying what is left out.

### Copy: the rule is practised, not announced

The project's owner: copy should not keep saying that the app will not show where graves are,
and so on; the practice stands, the announcing goes (DESIGN.md §7.4). Every summary, stop text,
note, gloss and era note in `events.json`, `places.json`, `eras.json`, `polities.json` and
`features.json` was read; tellings quote their sources and were left alone. The era notes and the
polity notes had none. Where a sentence carried history it was kept and the rest dropped; the pali
stop now says that many of the Oʻahu fighters die there, and stops.

| where | before | after |
| --- | --- | --- |
| event `nuuanu-1795` stop index 7 | … Many of the Oʻahu fighters die there. Their remains are a burial matter for their descendants, and this app does not place them. | … Many of the Oʻahu fighters die there. |
| event `kahikinui-heiau` | The heiau themselves are not placed on the map. | (dropped) |
| event `kakanilua-1776` | The Wailuku dunes hold many burials, and this app does not place the battle more closely than the ahupuaʻa. | The Wailuku dunes hold many burials. |
| event `keanakakoi-1790` | Where the people died is not placed. | (dropped) |
| event `kamehameha-death-1819` | His bones are prepared in the old way for a sacred chief; this app does not place them. | His bones are prepared in the old way for a sacred chief. |
| event `kuamoo-1819` | The dead were buried where they fell; this app does not place the graves. | The dead were buried where they fell. |
| event `kalaupapa-1866` | The peninsula holds the graves of those who died there; this app does not place them. | The peninsula holds the graves of those who died there. |
| place `puna-hawaii` | Pāʻao's landfall and his heiau Wahaʻula are placed only at moku precision. | Pāʻao's landfall and his heiau Wahaʻula lie in Puna. |
| place `wailua-kauai` | The heiau of Wailua are not placed. | (dropped) |
| place `waipio-valley` | Its heiau are not placed. | (dropped) |
| place `kamakahonu` | The heiau Ahuʻena there is not placed separately. | The heiau Ahuʻena stands there. |
| place `kahikinui` | The coral-dated heiau are not placed; the pin covers the district. | The moku of the coral-dated heiau, on the dry southern slopes of Haleakalā. |
| place `kamaomao` | The dunes hold many burials, so this place stays at ahupuaʻa precision and nothing in it is placed exactly. | The dunes hold many burials. |
| place `kealakekua-bay` | The heiau Hikiau at the head of the bay is not placed separately. | The heiau Hikiau stands at the head of the bay. |
| place `kaawaloa` | Kept at ahupuaʻa precision. | (dropped) |
| place `kapapala` | Where his people died is not placed. | (dropped) |
| place `kalauao` | Where the dead were laid is not placed. | (dropped) |
| place `nuuanu-pali` | The dead of 1795 are a burial matter: no remains or find-spots are placed. | Many of the Oʻahu fighters died here in 1795. |
| place `kaheiki-heiau` | Rendered at the Honolulu ahupuaʻa centroid with a soft radius, never as a point. | (dropped) |
| place `pakaka` | The heiau of the same name is not placed. | A heiau of the same name stood at the harbour. |
| place `nuuanu-pali-trail` | … so read it as within a few hundred metres; the stone figures Ellis saw at the head of the pass are not placed. | … so read it as within a few hundred metres. Ellis saw stone figures on either side of the path at the head of the pass. |
| place `kuamoo` | The battlefield holds the graves of those who fell, which are not placed. | The battlefield holds the graves of those who fell. |
| place `kalawao` | The peninsula holds the graves of those sent there; none are placed. | The peninsula holds the graves of those sent there. |
| place `maui-isthmus` | The ditches' routes are not mapped here. | (dropped) |
| place `kahoolawe` | Cultural sites on the island are not placed. | (dropped) |
| place `upolu-point` | … Puʻuepa near it; the heiau of Moʻokini there is not placed. | … Puʻuepa near it; the heiau of Moʻokini stands nearby. |
| place `kiheipukoa` | … whether Kīhei keeps its kahakō in this name is not shown by any source read. | … no source read shows whether Kīhei keeps its kahakō in this name. |
| feature `heiau-kaheiki`, `heiau-kawaluna`, `heiau-makuku`, `heiau-kaahaimauli` | Shown only as within Honolulu ahupuaʻa. | (dropped) |
| feature `heiau-pakaka` | Shown only as within Honolulu ahupuaʻa; the place Pākākā is in the gazetteer as the landing, not the heiau. | (dropped) |
| feature `trail-pali-descent` | … stone figures stood on either side of the path at the head of the pass, and are not placed. | … stone figures stood on either side of the path at the head of the pass. |
| feature `force-oahu-retreat` | What happened at the edge is told differently in every source, and is a burial matter; nothing is drawn there. | What happened at the edge is told differently in every source. |
| feature `force-oahu-down-the-trail` | The line shows people going down the path, not over the edge. | (dropped) |
| feature `line-1783-kaheiki` | The heiau itself is not placed. | (dropped) |
| feature `stream-manoa` | … up the Waihī branch; below the valley it now runs into the Ala Wai canal, dug in the twentieth century, so the reach below the valley mouth is left out. | … up the Waihī branch, to the mouth of the valley; below it the stream now runs into the Ala Wai canal, dug in the twentieth century. |
| feature `loi-kalihi` | The district box cuts the head of the valley. | (dropped; the note now says the outline ends in the lower valley) |
| route `paao-voyage` waypoint 1 | off Puna, the district of the first landfall; the heiau Wahaʻula is not placed | off Puna, the district of the first landfall and of the heiau Wahaʻula |
| route `paao-voyage` waypoint 8 | ʻUpolu, near Puʻuepa, where Pāʻao settled; the heiau of Moʻokini is not placed | ʻUpolu, near Puʻuepa, where Pāʻao settled, by the heiau of Moʻokini |
| route `kepuwahaulaula-1791` | The line follows the invaders; Kaʻeokūlani's crossing from Hāna and Kamehameha's from Kona are not drawn. | The line follows the invaders. |

Notes that say how a place that is not sensitive was fixed (Puʻiwa, Lāʻimi, Kawānanakoa,
Kahapaʻakai, Kaheiki, Pahonu, the posts' line) say what the sources allow, not what the app
withholds, and stay. The practice itself is unchanged: no burial is placed, heiau stay at ahupuaʻa
precision, nothing is drawn at the edge of the pali, and no individual death is shown. The reasoning stays in
DESIGN.md §7.4 and here; `sources.json` notes (provenance, not shown in the app) keep theirs.

### What the check now enforces

- every `force` and `line` has `stop`, a whole number indexing a stop of its event; the stop's year
  lies within the feature's `from`–`to`; no later step shows at an earlier stop;
- every `stream` has its name and `role: "reference"`;
- every loʻi: the share of its texels steeper than 15 % (as above, on the district heights named in
  `districts/manifest.json`) fails above 10 % and warns above 5 %;
- no user-facing text (event title, gloss, summary and stop text; place name, note and gloss; era
  label and note; polity names and notes; route title, gloss, summary and waypoint notes; feature
  name and note) contains "this app", "does not place", "not drawn", "nothing is drawn" or "is not
  shown". Tellings, `about` and source notes are not copy and are not checked.

### Left for others

- DATA.md should name `stop` (from 0; the render also takes a list, or a place id), `role:
  "reference"` on streams, the loʻi slope rule and the copy rule, beside the accepted extensions.
- The Lāʻimi stop now also shows the two escapes; its camera (bearing 42, 1.3 km back) looks up the
  valley, and the western escape runs off to the left over ʻĀlewa. The Kou stop now shows the posts,
  up to 8 km from Kou. Both framings want a look in the next render.
- Ananoho and Auiki overlap by 11 texels (the site record's outline against the 1927 trace), as
  before; not touched here.
- The loʻi are still stream bands judged on today's ground. The Land Commission records for Nuʻuanu,
  Pauoa, Kapālama and Kalihi would replace them with parcels, and would say what the terraces of
  upper Kalihi were.
