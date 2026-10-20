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
