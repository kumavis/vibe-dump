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
- Kūaliʻi or Kualiʻi (the app writes Kūaliʻi, Nuʻuanu's heiau note Kualiʻi; Kamakau Ku-ali‘i,
  Fornander Kualii); Kākuhihewa, or Kamakau's Kuʻihewa for the father of Kanekapu and
  Kaʻihikapu; Kamalālāwalu (Kamakau Kama-lala-walu), Kauhiakama, Kanaloakuaʻana, Keakealaniwahine;
  ʻI or ʻĪ for the Hilo chief whose line held Hilo; Laʻa, read as ʻŌlaʻa in Puna; the title
  Oʻahu-a-Kākuhihewa (§14).
- Places of the 1600s wars: Hōkūʻula for Fornander's Hokuula, and Kamakau's Puʻuʻoaʻoaka; Kaunooa
  and Kamakahiwa at Puakō; Kawaluna, Waolani and Keanakamano; Kalena, Heleauau, Malamanui,
  Paupauwela and Keahumoa; Kalapo and Eleu at Waiʻanae; Haalilo or Haalio, the chief at Laupāhoehoe.
- In Koʻolaupoko: Moliʻi or Mōliʻi; Alala, the heiau of Kūaliʻi's birth rites; Naonealaʻa (Kamakau)
  or Naonealaa (Fornander); Alele, which Fornander puts at Kailua and Kamakau at Waikele in ʻEwa;
  Pamoa or Kamooa; Kanohuluiwi; Kulailua (the award layer) or Kuailua; Waihaukalua and Waikalua.
- This pass read only English translations. Kamakau's own Hawaiian in *Ka Nupepa
  Kuokoa* and *Ke Au ʻOkoʻa*, and the Papakilo newspapers generally, have not been read.

**A cultural reviewer**, for every card that touches the sacred, the dead or the living:

- **Burials and the dead.** The Wailuku dunes (Kakanilua), the Nuʻuanu pali, Kuamoʻo,
  Keōua's people at Kīlauea, Kalaupapa, Kamehameha's bones, and Cook's remains (the card
  says only that some bones were given back). All are unplaced or held at ahupuaʻa
  precision. The wording around them needs review, as does the decision not to say that
  Keōua's body was offered at Puʻukoholā.
- **The dead of the 1600s wars** (§14). Kanaloakuaʻana's treatment at Puakō, Kamalālāwalu's death at
  Waimea and Kauhiakama's at Waikīkī are told in a few plain words; what Kamakau and Fornander say was
  done to their bodies and bones stays out of the cards, as does the disposal of Kūaliʻi's bones. The
  battle at Kalaupapa is placed at the land's centroid, inside the national park.
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
  and ranching are in no cultivation mask; the crop classes (below) place them.

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

### Crops

What grows on the cultivated land, and on the grazed land beside it, at each keyframe:
`layers/<island>/<keyframe>-crop.png` (DATA.md, "Crops, on the era layers"), baked in
October 2026 with `node packages/holo-i-ke-au/tools/bake-crops.mjs --all`. Thirty-two
class rasters, 319 KB; `public/data/layers/` is now 5.48 MB. The manifest's `crops` entry
writes every rule out, lists what each keyframe draws in `record`, and keeps in
`record.leftOut` what the brief or the record names that the bake does not draw.

**The approach.** A class follows the keyframe's own cultivation mask, read back from its
PNG: wherever the mask is above 0, the term of its rule that is largest there names the
field (the loʻi rule gives loʻi, the dryland and agroforestry zones dryland, the kuleana
loʻi or dryland by the loʻi rule beneath them, the 1900 lands cane and pineapple, the
fishpond shore nothing). The terms are the layers bake's own (`cultivationTerms` in
`lib/layers-model.mjs`, split out of `cultivation` for the purpose; the masks re-bake
byte-identical). On that the history is laid: plantations and ranches in 1853; rice,
coffee and ranches in 1896; the 2020 baseline and the lawns now.

#### What was read

| source | what it gave | used for |
| --- | --- | --- |
| Hawaiian Annual for 1902, p. 42 (`thrum-annual-1902`) | “List of Principal Stock and Sheep Ranches throughout the Islands”, read on the page image (the text layer misses it): thirty ranches with character, manager, location and agent. Pp. 43–46, the history of H. Hackfeld & Co.: Wood’s Kōloa and East Maui plantations, and the 1853 machinery “for the Koloa and Lihue plantations” | the 1896 ranches; Kōloa and Līhuʻe at 1853 |
| Hawaiian Annual for 1895 (`thrum-annual-1895`) | Kona’s coffee in 1892 (about 1,000 acres old, 150 new; 170 in Hāmākua and Hilo; about 100 in Puna); the Olaʻa crown-land leases (85, 11,479 acres, 1894); the new Olaʻa plantations at 1,500–2,500 feet on the Volcano Road; rice “with but little change as to area” | coffee at kingdom |
| Hawaiian Annual for 1900 (`thrum-annual-1900`) | rice on “the lowest flats found at the outlets of valleys and close on the sea … often too low and swampy for cane culture”; Olaʻa’s coffee in 1897 by age (1,344 acres over three years, 2,749½ of one to three, 1,821½ under one) | the rice rule; Olaʻa’s area |
| Glick, *Sojourners and Settlers* (1980), ch. 3, on UH Press’s open Manifold edition (`glick-1980-sojourners`) | rice started in 1858 (H. Holstein, Royal Hawaiian Agricultural Society), taken up by Chinese in the 1860s; about 1,000 acres in 1875, 7,420 in 1890, 9,130 in 1900, 9,425 in 1909; Damon in 1882 on the ʻEwa shore and Honouliuli; rice plantations at Mānoa (1895), Moanalua (1891), Heʻeia (1888) | the totals; the rice districts; no rice at 1853 |
| Hanalei Pier, National Register nomination (`nrhp-hanalei-pier`) | after Coulter and Chun: in 1892 Hanalei and Waiʻoli 750 acres, the largest, then Mokulēʻia 738 and Kailua–Waimānalo 400; 1919 5,801 acres, 1934 1,090; the borer at Hanalei, Hulēʻia, Wailua and Kapaʻa in 1928–29 | the three capped districts; the east Kauaʻi district |
| Kelley, *Rice Soils of Hawaii* (1914) (`kelley-1914-rice-soils`) | about 10,000 acres of rice soils “at or near sea level along the coast”; samples from Waikīkī, Fort Shafter, Kailua, Kāneʻohe, Waiāhole, “Kalaunui” and Hanalei | the rice districts and the 15 m ceiling |
| Old Sugar Mill of Kōloa, nomination (`nrhp-koloa-mill`, already in the gazetteer) | the 980-acre lease of 1835, Wood from 1848, steam in 1853; the mill’s UTM reference | Kōloa at 1853 |
| Haʻikū Mill, nomination (`nrhp-haiku-mill`) | five Maui sugar companies at 1858, two in operation (East Maui at Kaluanui, Brewer at Hāliʻimaile, Torbert and Makee at ʻUlupalakua, Haʻikū, Hāna) | Hāna at 1853, and leaving East Maui out |
| MauiWine’s history of ʻUlupalakua (`mauiwine-ulupalakua-history`) | Torbert’s lease of 1841 (2,087 acres, a mill), Torbertsville’s beef, hogs and sheep, Makee’s purchase of 1856 with 475 sheep and 350 goats, the mill again from 1861 | ʻUlupalakua as grazing, not cane, at 1853 |
| KIRC’s Kahoʻolawe history (`kirc-history`, already in the gazetteer) | ranch leases from 1858 to 1941; 900 cattle and 15,000 sheep by the late 1890s. (The gazetteer’s entry says its timeline runs from 1941; the page now starts at 1793.) | Kahoʻolawe at kingdom |
| Wikipedia: Parker Ranch, Kualoa Ranch, Valdemar Knudsen (tertiary) | Parker 1847 at Waimea; Judd’s 622 acres at Kualoa in 1850; Knudsen’s lease of crown lands in Waimea district (Kauaʻi) after 1856 | the 1853 ranches; Kauaʻi’s Kona moku in 1896 |
| to-hawaii.com on Hāna; Images of Old Hawaiʻi on Pioneer Mill (tertiary) | Wilfong’s Hāna plantation of 1849; Lāhainā’s small sugar of the 1840s and 1850s | Hāna and Lāhainā at 1853 |
| USGS sheets on the State GIS (`usgs-topo-1927-oahu`, `usgs-topo-1910-kauai`) | the 1927 Oʻahu sheet read at four windows: diked fields with the marsh symbol at Waiawa’s mouth and in rows on the Waikāne flats; Waikīkī already drained by the Ala Wai; Mokulēʻia in cane with the Dillingham Ranch. The 1910 Kauaʻi sheet at Hanalei marks no crops at all | a check on the rice districts, not a map of them |

Data layers (in the manifest, not the gazetteer): the field layers the cultivation masks
read; the State GIS **Agricultural Land Use Maps, 1978–80** (ALUM, LandUseLandCover layer
5, 2,127 polygons, commodity codes A-1 grazing, O-5 coffee and the rest per its metadata);
the **2020 baseline** (layer 19); the **golf courses** (Infrastructure layer 14, 80 points
of 2023); the **CAH land cover**’s developed open space (class 43). The **2015 baseline**
(layer 4) was queried and not used: the 2020 update replaces it, and its 157 km² of sugar is
the Maui plantation that closed in 2016.

#### What each keyframe rests on

- **contact, modelled.** Loʻi and dryland as the cultivation model has them. Nothing
  else.
- **mahele, modelled.** The same on the 1853 mask; cane at Kōloa, Līhuʻe, Hāna and
  Lāhainā, each 300 acres of the land nearest its mill (no 1853 acreage was found for
  any of them; Kōloa’s lease was 980 acres); pasture at Parker’s Waimea, Judd’s Kualoa
  and Torbertsville, whose grazed land is unknown, so the lower, drier part of their
  ahupuaʻa: below 2,000 m, 400–2,000 mm of rain, outside the 1853 forest (interpolated as
  the app does) and fields. No rice.
- **kingdom, mixed.** Mapped: the 1900 cane and pineapple. Modelled: loʻi and dryland
  on the 1896 mask; rice in nine districts a source names, on the flats below 15 m on
  loʻi or wet ground, capped at the 1892 figure where one exists and there taken old
  loʻi first; Kona’s coffee as the 1978–80 coffee read back, Olaʻa’s as 4,093 acres
  nearest the Volcano Road between 1,500 and 2,500 feet; pasture as the 1978–80 grazing
  read back into the moku of each ranch in the 1902 list (and Knudsen’s, which it omits),
  and on Lānaʻi, Niʻihau and Kahoʻolawe all land neither forest nor field.
- **now, mapped.** The 2020 baseline by category group (taro loʻi; pineapple; orchard,
  coffee, macadamia, fruit, flowers, seed and diversified crops; pasture and dairy); lawn
  where the CAH’s developed open space covers half a texel and the county zones it parks
  and open space or a golf course lies within 600 m. No cane: the 14 acres the 2020
  layer still calls Sugar, small fields after the last plantation closed, count as orchard.

#### The figures

km² of each pack’s land by class (a pack holds the slivers of its neighbours, so Maui’s
1896 pasture includes Kahoʻolawe’s north shore):

| island | keyframe | loʻi | dryland | rice | cane | pineapple | pasture | orchard | lawn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Oʻahu | contact | 97.86 | 328.09 | · | · | · | · | · | · |
| Oʻahu | mahele | 91.76 | 330.24 | · | · | · | 1.3 | · | · |
| Oʻahu | kingdom | 58.27 | 232.57 | 25.55 | 212.26 | 4.92 | 64.24 | · | · |
| Oʻahu | now | 0.71 | · | · | · | 15.27 | 77.73 | 95.86 | 14.21 |
| Hawaiʻi | contact | 11.08 | 812.36 | · | · | · | · | · | · |
| Hawaiʻi | mahele | 9.56 | 812.38 | · | · | · | 279.5 | · | · |
| Hawaiʻi | kingdom | 11.35 | 143.56 | · | 574.82 | · | 2656.65 | 25.85 | · |
| Hawaiʻi | now | 1.61 | · | · | · | · | 2294.07 | 265.59 | 6.25 |
| Maui | contact | 20.31 | 326.39 | · | · | · | · | · | · |
| Maui | mahele | 19.6 | 323.92 | · | 2.43 | · | 17.54 | · | · |
| Maui | kingdom | 13.86 | 67.04 | · | 268.05 | · | 522.02 | · | · |
| Maui | now | 1 | · | · | · | 4.17 | 481.15 | 34.18 | 7 |
| Kauaʻi | contact | 55.52 | 182.46 | · | · | · | · | · | · |
| Kauaʻi | mahele | 51.56 | 184.29 | · | 2.43 | · | · | · | · |
| Kauaʻi | kingdom | 40.22 | 67.72 | 6.96 | 187.67 | · | 72.4 | · | · |
| Kauaʻi | now | 2.93 | · | · | · | · | 178.56 | 88.99 | 7.9 |
| Molokaʻi | contact | 13.65 | 60.61 | · | · | · | · | · | · |
| Molokaʻi | mahele | 12.87 | 61.29 | · | · | · | · | · | · |
| Molokaʻi | kingdom | 12.61 | 15.73 | · | · | · | 367.69 | · | · |
| Molokaʻi | now | 0.05 | · | · | · | · | 157.58 | 17.69 | 0.06 |
| Lānaʻi | contact, mahele | · | 22 | · | · | · | · | · | · |
| Lānaʻi | kingdom | · | 0.08 | · | · | · | 353.03 | · | · |
| Lānaʻi | now | · | · | · | · | · | · | 0.47 | 0.45 |
| Niʻihau | kingdom (nothing else) | · | · | · | · | · | 189.91 | · | · |
| Kahoʻolawe | kingdom (nothing else) | · | · | · | · | · | 116.52 | · | · |

A class marks every texel the keyframe’s mask cultivates at all, so a class’s km² is the
land the fields lay in, not the area cultivated (Oʻahu’s contact mask cultivates 218 km² of
the 426 km² classed loʻi or dryland). Rice: 8,034 acres drawn against about 8,450 for 1896
(interpolated between 1890 and 1900): Hanalei and Waiʻoli 750, Mokulēʻia 737, Kailua and
Waimānalo 400 (all three at their 1892 figure; the rule offered 1,390, 819 and 2,626),
Waikīkī 2,301, the ʻEwa shore 1,421, Kāneʻohe and Heʻeia 938, Wailua–Kapaʻa–Hulēʻia 971,
Waiāhole and Waikāne 280, Moanalua 236. Coffee: Kona 2,295 acres (1892’s estimate
1,150), Olaʻa 4,093. Pasture in 1853: Parker 279.5 km², Torbertsville 17.5, Kualoa 1.3.

#### Where the classes are weak

- **The field kinds are the cultivation model’s.** Where its agroforestry zone outweighs
  the loʻi rule, as on much of Waiāhole’s lower valley, the class is dryland though the
  valley is known for loʻi; East Hawaiʻi has almost no class at contact, as it has almost no
  cultivation.
- **Rice is placed, not mapped.** No map of the 1890s rice fields was found. Uncapped
  districts take all land on the rule, which likely overstates Waikīkī and ʻEwa (a search
  summary gave Waikīkī 542 acres of Oʻahu’s 4,659 in 1892, from a page that would not open;
  not used). Maui’s, Hawaiʻi Island’s and Koʻolauloa’s rice is not drawn.
- **Pasture in 1896 is 1980’s grazing read back** into whole moku: right where the ranches
  kept their land, wrong where grazing came later (forest cleared after 1896) or went
  (towns, pineapple). Whole-island ranges are drawn as all open land.
- **The 1853 plantations are discs** of a nominal 300 acres, the 1853 ranches the lower,
  drier part of an ahupuaʻa: Parker’s comes to 280 km², his whole ahupuaʻa below the
  forest, far more than the land he held.
- **Lawn needs two sources to agree** (zoning or a golf point, and the land cover of about
  2010), so parks that either misses are not lawn.

#### Still needs a reader or a library

Coulter and Chun, *Chinese Rice Farmers in Hawaii* (1937), for the rice districts and
their acres; Coulter, *Population and Utilization of Land and Sea in Hawaii, 1853* (1931),
for an 1853 keyframe mapped rather than modelled; MacLennan (1995) on the Maui
plantations of 1840–60; the Annual for 1895’s coffee growers (pp. 146–148) on the page
images, to place Kona’s coffee by grower; the Territorial Planning Board’s 1939 land
utilization maps (the source of the 1900 cane layer), which may show rice and ranch land
that was never digitised. ACCESS.md lists where each stands.

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

### The pali stop, looked at again

The owner, on the published build: at stop 8 of 8 the event's pin and its label stood over the
last stand and the leaps, and the east end of Kamehameha's arc climbed the side of the gap. Neither
was in the data, and no data changed; the fixes are in the renderer.

- **The surround's line is on the floor.** On the district heights the five vertices of
  `force-hawaii-surround` stand at 330, 330, 337, 346 and 351 m, rising gently to the stand
  (`force-oahu-last-stand`, 345–361 m along its 121 m), and 60 m either side of each vertex the
  ground is within 10 m of the line (327–361 m). What climbed was the arc `soldiers.js` stands round
  the stand. It is sized on the screen so that it reads at every zoom, and at the stop's camera
  (3.2 km out, 6.1 m of ground to the sprite pixel at a device pixel ratio of 1) its east end lay
  180–270 m from the stand's middle, on the Konahuanui side at 386–425 m. The arc is now held to
  ground within 20 m above the stand's highest and 30 m below its lowest (315–381 m here), measured
  once on the district's heights: each figure goes no further from the stand's middle than that
  ground does in its direction, and never inside the stand. The west half is as it was (332–369 m);
  the east end closes 74–90 m from the stand's middle, at the foot of the wall (373–378 m).
- **The pin.** At a near stop whose own people are drawn, the event's pin and its label stand aside
  until the people fade; the card names the place (DESIGN.md §5.6). At Puʻiwa and Lāʻimi the pin had
  stood over the fronts too. Far and island stops keep their pin; at Kou, an island stop, it still
  stands at the head of the march.
- `tools/smoke.mjs`: the pali check also fails an arc figure on ground above the band (beyond the
  stand's edge) and the event's pin showing there.

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

## 12. The second pass

A second round of feedback from the project's owner, October 2026: the arms each side carried, the
battle choreographed as DESIGN.md §8 now tells it, the Kou camera, the chapters, the Māhele as a land
division, and sources marked by how much of each was read. `tools/check-data.mjs` enforces what follows
and is clean. Every source below was read in this pass unless it says otherwise; the scratch scripts that
did the joins and parsing are described where they matter, and nothing they made is needed to use the data.

| file | change |
| --- | --- |
| `mahele.json` | new: the class of each of the 727 State ahupuaʻa units after the Māhele |
| `districts/nuuanu/features.json` | 65 features (was 62): `behaviour` and `arms` on every force of 1795 and 1783, and on the six fronts; the retreat and pursuit moved to the Lāʻimi stop, the retreat ending below the gap; three forces added at the pali |
| `events.json` | 57 events (was 54): three added; the Kou camera; two stop sentences; arms tellings on `nuuanu-1795` and `kaheiki-1783`; acreage tellings on `mahele-1848`; Kalaupapa moved to the merged chapter |
| `eras.json`, `polities.json` | 12 eras (was 13): `kamehameha-iv-v` dissolved into `kauikeaouli` |
| `layers/manifest.json` | its `eras` map edited in place for the merge (below) |
| `places.json` | 84 places (was 82): Mauna Loa and Kahuku in Kaʻū |
| `sources.json` | 82 sources (was 74): eight added; `read` on every source |
| `tools/check-data.mjs` | behaviour, arms, the edge rules, the camera `target`, `read`, `mahele.json`, the layers era map |

### The Māhele file: `mahele.json`

The schema, for DATA.md to carry:

```jsonc
{ "about": "…", "method": "…", "precision": { "whole": "…", "combined": "…", "part": "…", "none": "…" },
  "fields": "…", "fetched": "2026-10-22", "sources": ["oha-kipuka-ahupuaa", "…"],
  "counts": { "class": { "crown": 70, "…": 0 }, "precision": { … }, "disputed": 27, "withAwardee": 206, "byIsland": { … } },
  "ahupuaa": [ {
    "gisId": 38, "name": "Makaweli", "islandId": "kauai",        // as boundaries/ahupuaa.geojson has them (name may be null)
    "class": "konohiki",                // crown | government | konohiki | mixed | unknown
    "precision": "whole",               // whole | combined (a State unit joining several ahupuaʻa) | part | none (unknown)
    "awardee": "Victoria Kamamalu",     // konohiki or mixed only: a name or a list, spelt as the record spells it
    "parts": [ { "class": "konohiki", "share": 0.99, "awardee": "…", "ili": 2, "how": "…" } ],   // share 0..1 of the unit, or null: recorded, extent not
    "how": "surrendered in lieu of commutation",                  // how the land came to its class
    "later": [ { "class": "crown", "year": 1890, "how": "…" } ], // a status given after the Māhele
    "disputed": [ { "class": "government", "source": "oha-kipuka-ahupuaa" } ],   // a class another source gives it
    "note": "…", "sources": ["oha-kipuka-crown-lands", "…"], "refs": ["Buke Māhele pp. 1, 2, 5, 223, 225", "LCA 7713:1"] } ] }
```

Rules, enforced: every gisId is in the boundary file once, with its name and islandId; every unit of the
boundary file has an entry (an unrecorded one is `unknown`); classes and precisions from the vocabularies;
`unknown` has precision `none` (or `part` where the Act lists ʻili inside it); `mixed` lists two or more
classes in `parts`; an awardee only on a konohiki or mixed land; part classes are crown, government or
konohiki, shares null or 0..1; a later class is crown or government, after 1848; every source exists and a
recorded class cites at least one opened source. Personal names stay as the records spell them (the
records carry no diacritics); ʻokina and kahakō are added only to place names, from the State layer.

### Chapters

- **Dissolved: `kamehameha-iv-v`.** The last three Kamehameha kings read as one span, and Kalaupapa belongs
  with them. `kauikeaouli` now runs 1834–1872 (year 1853, precision 19): "in the time of the last
  Kamehameha kings", its note naming Kamehameha III, IV and V with the reigns Alexander's chapter heads give
  (1855–1863, 1863–1872). 1853 is the middle of the span and the year of the Māhele keyframe. Kalākaua's
  chapter still opens at 1873, now with Lunalilo's election. `kalaupapa-1866` moved; the dissolved era's
  polity map (the kingdom everywhere, as `kauikeaouli`'s) and its source went with it.
- **`layers/manifest.json`.** Its `eras` map is keyed by era id, so the dissolved key was removed and
  `kauikeaouli` given what `eraMap()` in `tools/bake-layers.mjs` computes for 1853: cultivation and
  settlement from `mahele` to `kingdom` at t 0 (the Māhele keyframe itself), forest from `contact` to
  `kingdom` at t 0.636. The file is bake output; **`tools/bake-layers.mjs` must learn the new eras on its next
  run**, which it does by reading `eras.json`, and that run will rewrite the map to the same values.
- **Kept: `mailikukahi` and `alapai`.** A one-event chapter is not a problem in itself, and neither merge
  reads better as history. Māʻilikūkahi's chapter is the Oʻahu land-division tradition (Fornander
  pp. 88–90): the chiefs choose him and he has the island's divisions marked out for good, which is where an
  atlas of the land from mountain to sea begins. ʻUmi's and Piʻilani's chapter is war and unification on
  Hawaiʻi and Maui, another story. Alapaʻinui's is the Hawaiʻi Island ruler carrying war across the channels
  in the 1730s, a generation before Kalaniʻōpuʻu, whose chapter is Hāna, Kakanilua and Cook. Both stay short.
- **Events added**, each from a source read and none to fill a chapter:
  `ke-au-okoa-1865` (the newspaper the app's name answers, and where part of Kamakau's history ran: the AAS
  record, read again, and Kamakau p. 418); `kau-earthquake-1868` (Mauna Loa's eruption, the earthquake of
  2 April, the Kapāpala mud flow, the sea wave and the Kahuku flow: Alexander pp. 292–293); `lunalilo-1873`
  (the death of Kamehameha V without an heir and the election of Lunalilo: Alexander pp. 297–299), which
  opens Kalākaua's chapter. Alexander's chapters also name the Queen's Hospital, the Anglican mission, the
  constitution of 1864 and the first Japanese immigrants of 1868 (a footnote, p. 290); they were not made
  events. The new royal mausoleum of 1865, which Alexander describes (p. 291), is a burial place and stays out.

### Arms, from the record

What was read for it:

| source | what |
| --- | --- |
| `fornander-v2` | p. 224 (1783: the Oʻahu champions' "long spears and javelins"); pp. 243–244 (1791: "small cannon obtained from traders", Young and Davis "in command of his artillery", gunnery "on both sides"); p. 247 ("the inferiority of firearms on the losing side"); p. 268 and p. 343 (the captured ships' "stores of arms and ammunition", delivered to Kamehameha); p. 348 (Nuʻuanu) |
| `kamakau-ruling-chiefs` | pp. 135–136 (1783: the companies "with the sling and the bow and arrow", spears and pololū, a dagger); pp. 145, 147–148 (muskets desired, the sloop's cannon Lopaka and muskets, Lopaka hauled into ʻĪao in 1790); p. 153 (Kaʻiana gives Kamehameha "a quantity of muskets and cannon"); p. 154 (the arms of the time, listed); pp. 163–164 (muskets taken at Waimea, Oʻahu, in 1792, to Kalanikūpule); pp. 169–171 (Kalauao; the ships' arms lost) |
| `malo-1903` | ch. XXXV §60 (p. 257), §85 (p. 260) and Emerson's notes (pp. 266–267) |
| `ellis-1827` | p. 138 (spears, javelins and slings kept in every house), p. 141 (the weapons described), pp. 16–17 (Nuʻuanu: the chase to the edge, the king's "last spear") |
| `jarves-1847`, `thrum-annual-1911`, `johnstone-1908`, `pacific-worlds-nuuanu` | as in §10: Young's field-piece; Young "in charge of the cannon"; Kamehameha's guns in lower Nuʻuanu and "Oʻahu guns in the notches above the pali" (the oral account, through the earlier telling: the Wayback Machine reset every connection in this pass) |

**The vocabulary** (`arms` keys): `spear` is the ihe and the pololū; `club` the laʻau pālau, with the
shark-toothed weapons (Kamakau's "sharks'-teeth", p. 154; the leiomano); `dagger` the pāhoa and the kuʻia;
`sling` the maʻa with its stones; `musket` the smoothbore musket (the sources say muskets and guns; none says
rifle); `cannon` a count of small field pieces (Fornander's "small cannon", Jarves's "field-piece"). Bows
appear in Kamakau's two lists and nowhere in the fighting described, so they have no share.

**The shares are a depiction, not a count.** No source counts weapons. They turn the sources' "most",
"some" and "few" into numbers for drawing: spears the most (the pololū ranks of Malo §85 and Ellis), clubs
next, slings a company's worth (Kamakau p. 135), daggers few in hand. Muskets are sparse: one in ten on
Kamehameha's side (more guns, "the better practice of his soldiers", and the ships' arms delivered to him),
one in twenty on Oʻahu's (the Waimea muskets of 1792 and whatever Kalanikūpule kept after losing the ships'
stores); Kaʻiana's people carry Kamehameha's share, since Kaʻiana had brought muskets home (Kamakau p. 153;
his brother Namakeha shoots "with my gun" in the war with Keōua, p. 154). In 1783 neither side has a firearm: no source read names
one in that fighting, and the first muskets Kamakau puts in Hawaiian hands come with the ships of 1789–90;
the check warns on any firearm before 1786.

**The cannon: two, on Kamehameha's side, as far as Lāʻimi.** No source gives a number for Nuʻuanu.
Fornander's plural ("the number of his guns", and "small cannon" in 1791) needs more than one; Jarves names
one field-piece in action; Kamakau names one cannon, Lopaka, in 1790, and Kaʻiana's gift of "cannon" after.
Two is the least the plural allows, and nothing read supports more. They go with the landing, the march and
the fronts at Puʻiwa and Lāʻimi; none goes with the pursuit or to the pali, since no source puts a gun above
Lāʻimi (Jarves's field-piece fires on the stone wall, then "the forces of Kamehameha charged"). The Oʻahu side
has none: Kalanikūpule lost "the large guns on the ships" with the ships (Kamakau pp. 170–171; Fornander
p. 268). The oral account's Oʻahu "guns in the notches" names no cannon and is a modern reconstruction.

| features | side | spear | club | sling | dagger | musket | cannon |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `force-hawaii-landing`, `force-hawaii-march`, `line-puiwa-hawaii`, `line-laimi-hawaii` | Kamehameha | 0.5 | 0.2 | 0.12 | 0.08 | 0.1 | 2 |
| `force-hawaii-pursuit`, `force-hawaii-surround` | Kamehameha | 0.5 | 0.2 | 0.12 | 0.08 | 0.1 | 0 |
| `force-kaiana-crossing` | Kaʻiana | 0.5 | 0.2 | 0.12 | 0.08 | 0.1 | 0 |
| the other eleven 1795 forces and lines | Oʻahu | 0.52 | 0.22 | 0.13 | 0.08 | 0.05 | 0 |
| the four 1783 forces | Maui | 0.55 | 0.2 | 0.17 | 0.08 | 0 | 0 |
| `line-1783-kaheiki` | Oʻahu | 0.55 | 0.22 | 0.15 | 0.08 | 0 | 0 |

### The battle, choreographed (DESIGN.md §8)

| stop (from 0) | features | behaviour |
| --- | --- | --- |
| 2 the Kaʻiwi channel | `force-kaiana-crossing` | march |
| 3 Waikīkī | `force-hawaii-landing` | stand |
| 4 Kou | `force-oahu-posts` (stand), `force-hawaii-march` (march) | |
| 5 Puʻiwa | `line-puiwa-oahu`, `line-puiwa-hawaii` | engage |
| 6 Lāʻimi | `force-oahu-fallback` (run), `line-laimi-oahu` and `line-laimi-hawaii` (engage), `force-oahu-retreat` (run), `force-hawaii-pursuit` (run), `force-oahu-escape-west` and `-east` (run) | |
| 7 the pali | `force-hawaii-surround` (surround), `force-oahu-last-stand` (stand), `force-oahu-over-the-edge` (leap), `force-oahu-down-the-trail` (run) | |
| 1783: 0, 1, 2 | the landing (stand), the three columns (march), Kahahana's defence (stand) | |

- **At Lāʻimi** the Oʻahu forces run up the floor of the valley past Luakaha (`force-oahu-retreat`, now at
  stop 6, its line cut to end below the gap at −157.7955, 21.3650, 450 m short), with Kamehameha's behind
  them (`force-hawaii-pursuit`, ending in the upper valley at −157.80423, 21.36076). Fornander has the
  defeat become "an accelerated rout" and Kalanikūpule "hotly pursued"; Jarves the rest "pursued with great
  slaughter" to the end of the valley; Ellis the army fleeing toward the precipice, "chased by the warriors
  of Tamehameha". The escapes over the ridges stay as they were.
- **At the pali.** The floor rises gently to the gap (322 m in the upper valley, 349 m at the gap on the
  district heights) and the brink lies at about −157.7934, 21.3671, where the ground falls 100 m in the next
  100 m to the north. `force-oahu-last-stand` follows the brink at the gap for about 115 m (Ellis's stand at
  the edge, which he gives to Kaʻiana; Jarves and Dibble have the rest driven to the end of the valley);
  `force-hawaii-surround` comes up the floor from 1.3 km below the gap and ends at the middle of the stand,
  from the valley side (Fornander, Jarves, Dibble, Ellis); `force-oahu-over-the-edge` runs 70 m from the
  stand to the brink and ends 30 m from GNIS's Nuʻuanu Pali (Fornander's "large number driven over",
  Dibble's and Bingham's "precipitated", Jarves's "some", Ellis's "driven headlong"; Kamakau does not
  mention the pali, and the oral account reads the name otherwise, which the note says). The file down the
  old path stays. All four are step 6; the check holds a leap's end within 300 m of a place of kind `pali`
  and a surround's end within 300 m of something of the other side shown at its stop.
- **Copy.** Two stop sentences changed and nothing else: stop 6 "fall back up the valley" became "run up
  the valley with Kamehameha's in pursuit"; stop 7 gained "where Kamehameha's forces close in". The pali
  stop still says that many of the Oʻahu fighters die there, and stops; no note says what is or is not shown.

### The Kou camera

The old camera (`nuuanu-1795` stop 4: bearing 45, pitch 0.6, 4 km back) looked almost straight down on the
harbour: ray-cast over the district heights at the rig's 42° field and the near view's ×1.3, Puʻiwa sat
19 % of the frame height above its top edge. The new camera:

- **Bearing 43**, from the geometry: Kou (−157.8625, 21.3098) to Lāʻimi (−157.8335, 21.3393) is 42.7°; Kou to
  the gap is 48.7°, and the valley bends toward it above Lāʻimi.
- **Pitch 0.3** (27°), as asked.
- **`target`, and distance 48.** The rig centres the stop's place (`tour.js` `cameraView`), so with Kou at
  the centre no distance puts Kou in the lower third: at pitch 0.3 and distance 48 Kou sits at 50 % and the
  valley is pressed into the top half (Puʻiwa 18 %, the gap 2 %), the lower half harbour and reef. The camera
  therefore gains an optional `target`, `[lon, lat]`, the point it centres while the stop's pin stays at its
  place: −157.8534, 21.3189, 1.38 km from Kou along 43°, at the valley mouth below Pūowaina. With it the
  ray-cast puts Kou 73 % of the way down the frame, Puʻiwa 26 %, Lāʻimi 24 %, Luakaha 11 %, Lanihuli 8 % and the
  gap 5 %, the top rows reaching the windward side through the notch. **The app must read `target`** (one
  line in `cameraView`: the target's world point for the rect when present); until it does it centres Kou
  as above. The check holds `target` to [lon, lat] within 15 km of the stop's place.

### Sources, by what was read

Every source now carries `read`: `full` (31: a web page, an article, a data layer read whole), `part` (38:
chapters, pages, an abstract; the four papers read only in abstract say so in their notes) or `title` (13:
cited, not read; exactly the sources with `opened: false`). The check fails a source without it, a source not
opened with anything but `title`, and an opened one with `title`. The app can then cite only what was read.
No `access` value needed changing; `buke-mahele-1848` is `open` and `opened: false`, its manuscript being
unreadable by machine.

Added: `alexander-1891`, `malo-1903`, `chinen-1958` (on the Internet Archive with its author's waiver for the
LLMC collection), `indices-of-awards-1929`, `buke-mahele-1848`, `crown-lands-report-1894`,
`oha-kipuka-ahupuaa`, `oha-kipuka-crown-lands`. Checked and not cited: Alexander's *Brief History of Land
Titles* (1882; no acreage), Linnekin's *Hui Lands of Keʻanae* (open, not needed), OHA's `LCA_State` konohiki
awards (92, mostly Kauaʻi and Molokaʻi, already in the tenure layer) and `LCAIndex` (2,891 rows, a mix of
whole-land and kuleana awards), and OHA's `Regulated_Lands` (today's public lands). Van Dyke's *Who Owns the
Crown Lands of Hawaiʻi?* (2008) is on the Internet Archive for lending only. Found open and not yet read: OHA's
index of the Government Survey's registered maps (3,526 entries, with PDFs on kipukadatabase.com), which
holds a large tracing of Nuʻuanu Valley (RM 2028), the Nuʻuanu Pali (RM 4117) and Kāneʻohe Bay sheets
(RM 4148, 4149); ACCESS.md lists these leads with the walls.

### The Māhele, as a land division

**What the sources are.** OHA's Kīpuka services (15, all open from here) hold two that carry the Māhele:
`Ahupuaa_State`, a historic land type on 334 of its 695 units, and `Crown_Lands_State`, 219 tenure polygons
with Buke Māhele pages and awardees, complete for Kauaʻi, Molokaʻi, Lānaʻi and Niʻihau and Crown-only
elsewhere. The 1929 *Indices of Awards* reprint the Act of 7 June 1848, which names the Crown and Government
lands one by one, and index every award by awardee and by land, marking an award of a whole ahupuaʻa "Ahp".
The Buke Māhele itself is open on the Internet Archive as a manuscript scan that no machine can read. The
State GIS has no historic Crown or Government layer: its "Government Lands" are today's public lands, and the
Government Survey sheets of 1881, 1885 and 1899 colour crown, government and private land only as images.

**How the file was made** (`about` and `method` in the file say it again):

1. The 727 State units were joined to OHA's 695 by area (a grid of about 400 points in each): 716 names
   agree and 713 units lie 90 % or more in one OHA unit. A unit takes OHA's land type only where the names
   agree, so Maunalua and Kuliʻouʻou, which OHA still folds into Waimānalo, take nothing from it.
2. On Kauaʻi, Molokaʻi, Lānaʻi and Niʻihau the tenure polygons decide, with shares by area. A land the Buke
   Māhele divided between the king and a chief (ʻAhaʻino 1, Kahananui, Kōloa) is drawn twice there, the line
   between the halves unmapped; it is `mixed` with both shares null.
3. On Hawaiʻi, Maui and Oʻahu the land type gives crown and government, the polygons add the Crown lands
   and the 1890 additions, and the "Ahp" awards give the konohiki and their awardees: 364 such rows in the
   scan, 230 matched by name to 156 State units of the page's island (and district, where a name repeats), the
   rest lands the State layer folds into larger units, ʻili, or names the scan garbles. On the four islands
   Kīpuka maps whole the same rows agree with it in 54 of 55 cases (the one miss is a matching slip: “Waiakalua Kom. 2” read as Waiakalua), which
   is the test of both the parse and the matching.
4. An award of the whole land stands over a bare listing of it as government land, which is kept under
   `disputed` (27 units, all against OHA's land type). Kīpuka's own note on Wahiawa shows how this happens: the
   Buke Māhele records that land as relinquished by the king to the government (p. 223) by mistake. An award inside a
   land the records list as Crown, or an award later surrendered in lieu of commutation, makes the land
   `mixed` with the shares null and a note: both are recorded, the division is not.
5. The Act's lists check the land types: 57 of 70 crown and 182 of 264 government listings were found in it;
   the rest are lost in the two-column scan or absent from the Act; 22 of the 82 government ones are lands OHA
   marks as surrendered in lieu of commutation. The
   Act's "Ili in …" entries are counted into the lands they lie in as `parts` with an `ili` count; on their
   own they make Honolulu and Waiau `mixed` (part), and leave eight more `unknown` with the ʻili listed
   (Hakipuʻu, Waimano, Mānana, Waimalu, Kalihi, Kapālama, Keʻei 1 and 2).
6. The two Acts of 1890 (unassigned lands declared Crown Land; the Bishop Estate compromise) give `later`
   on 19 units.

**Coverage.** 535 of 727 units carry a class: government 245, konohiki 178, crown 70, mixed 42; 192 are
unknown. A konohiki or mixed land names its awardee on 206. By island: Kauaʻi 54 of 54, Niʻihau 2 of 2,
Molokaʻi 72 of 73, Lānaʻi 11 of 13, Maui 100 of 142, Hawaiʻi 232 of 344, Oʻahu 64 of 98, Kahoʻolawe none.
The unknown are lands whose award the index scan does not mark or name clearly, lands the State layer joins
or splits differently from the records, and Oʻahu lands that no record read classes as a whole (Moanalua,
Kalihi, Kapālama, Waimalu, much of Koʻolauloa). Precision: whole 456, combined 67, part 20, none 184.

**The totals**, now tellings on `mahele-1848`: Chinen (p. 31) gives over 1,500,000 acres to the chiefs,
about 1,000,000 Crown, 1,500,000 Government and under 30,000 awarded to the people as kuleana; Iaukea's
report (p. 8) gives 971,463 acres of Crown Lands in 1894, island by island; the Indices' Foreword gives the
three parts and the nearly 12,000 claims; OHA's layer is counted as it marks its units. Kameʻeleihiwa's
study of the Māhele (print, not read) is the obvious check on all of it.

**Where it is weak.** The Buke Māhele, the primary record, was not read: a reader of its hand (or AVA
Konohiki's Buke Māhele pages, which Kīpuka cites and which timed out, or Papakilo, which refused) would settle the 27 disputes and most
of the 193 unknowns. The konohiki of Hawaiʻi, Maui and Oʻahu rest on a machine reading of a two-column scan
and on name matching; every match is listed in the scratch report of this pass but not in the file. The
shares are fractions of today's GIS units, not of the lands as surveyed in the 1850s.

### What the check now enforces

- every force has a `behaviour` from march | run | stand | engage | surround | leap, and `arms`: shares of
  spear, club, dagger, sling and musket summing to one within 0.02 and a whole number of cannon; a line may
  carry either and is held to the same rules; a firearm before 1786 warns;
- a `leap` ends within 300 m of a place of kind `pali`, a `surround` within 300 m of a force or line of
  another side shown at the same stop; `stop`, steps and every earlier rule as before;
- a stop camera may carry `target` ([lon, lat], within 15 km of its place);
- every source has `read`, consistent with `opened`;
- `mahele.json` as above, when present;
- `layers/manifest.json`'s era map names only eras in `eras.json` and has one for each (an era that goes
  leaves a dangling key, and the check fails it); a year that differs from `eras.json` warns.

The synthetic set in `test-data/` has no `read` on its sources; it already failed the check on its own
terms (108 problems before this pass) and nothing runs the check on it.

### Left for others

- **The app**: read the camera's `target`; draw `behaviour` and `arms` (the renderer's kinds are spear,
  club, musket and the gun; slings and daggers have shares now); cite only sources whose `read` is not
  `title`; and, when the Māhele layer is drawn, hatch `mixed` and leave `unknown` blank.
- **DATA.md**: name `target` on a stop camera, `read` on a source, the `mahele.json` schema above, and
  behaviour and arms on a line; and its keyframe table's `mahele` row, which still names `kamehameha-iv-v`:
  `kauikeaouli` now sits on that keyframe exactly, and `kahekili` to `kaahumanu` and `kalakaua` to
  `liliuokalani` interpolate through it.
- **`tools/bake-layers.mjs`**: its next run rewrites the era map from `eras.json` (to the values above).
- **A reader**: the Buke Māhele; Kameʻeleihiwa's appendix; Kamakau's own Hawaiian for the weapons' names;
  and a cultural reviewer for the pali forces, which now draw a stand, a surround and the leap that DESIGN
  §8 asks for.

## 13. Koʻolaupoko

The record behind the second close-up (DESIGN.md §3.4): Koʻolaupoko, from Waimānalo to Kualoa, at c. 1700, 1850 and
now, with the coda in the same place. Made in October 2026, in parallel with the district's bake (heights, rain, the
patches for the dredged bay and the fill) and the app's side; neither is described here. What follows is the gazetteer,
the events and their cameras, and `public/data/districts/koolaupoko/features.json`.

| file | change |
| --- | --- |
| `places.json` | 101 places (was 84): 17 added; `pahonu` now exact, at the State site record's point; `kualoa`'s note and sources |
| `events.json` | 59 events (was 57): `kailua-chiefs` (c. 1700) and `koolaupoko-1850` added, with five and six stops; stops and cameras on `heeia-restoration` (three), `pahonu-limu` (two) and `waiahole-1977` (one), with tellings for the years between 1898 and 1970; Oneawa added to `alapai-wars` |
| `sources.json` | 105 sources (was 82): 23 added, 17 opened and 6 not; `usgs-topo-1927-oahu` retitled (it is the whole mosaic, not the Honolulu sheet); five notes extended |
| `districts/koolaupoko/features.json` | new, 90 features: fishpond 15, loʻi 40 (one of them restored, from 2010), village 3, heiau 7, trail 2, stream 14, label 9 |

`districts/manifest.json` is the bake's and was not touched, so until it lists `koolaupoko` the check reads only Nuʻuanu's
features (`loadDistricts()` falls back to `districts/*/features.json` only when there is no manifest at all). Checked
against a scratch copy of `public/data` whose manifest adds the district over −157.90 to −157.64 W, 21.30 to 21.54 N,
with a test height image made from the CUDEM tiles below on a 12.9 m grid: clean, every heiau at its centroid, every
text held to the copy and numbers rules, and at most 2.1 % of any loʻi's texels steeper than 15 % (`loi-waimanalo-1`).

### What was read

| source | what, and where |
| --- | --- |
| `fornander-v2` | Pp. 138–139 (Alapaʻinui lands at Oneawa in Kailua; headquarters at Waihaukalua; the meeting at Naonealaa in Kāneʻohe; “a mere series of skirmishes”), 262–263 (Kaʻeokūlani at Kukui in Kalapueo, Waimānalo, and the meeting at Kalapawai, 1794), 271–274 (Kākuhihewa: his residences at ʻEwa, Waikīkī and Kailua, the house Pamoa at Alele), 277–278, 280n, 282–284 (Kūaliʻi: born at Kalapawai, the rite at Alala, raised at Kailua and Kualoa, the kapu of Kualoa, died at Kailua before 1730). |
| `kamakau-ruling-chiefs` | Pp. 54 (Lono lands at Lapawai, Kailua), 71–72 (Alapaʻi at Oneawa, Kaulekola, Waihaukalua; Naonealaʻa, Kaʻelo 13, 1737), 85 (Kalaniʻōpuʻu's heiau at Kahaluʻu and Kailua: the other Kailua, in Kona), 129 (Kualoa: its water courses, drums, spring and sacred hill), 138 (Kahekili at Kailua, his chiefs at Kāneʻohe and Heʻeia), 140, 168 (Kukui, Kalapueo, Waimānalo; the meeting at Kalapawai), 192 (Kamehameha at the ponds of Kawainui, Kaʻelepulu, Ukoʻa and Maunalua), 275 (the stream of Makawai between Kāneʻohe and Kualoa), 325 (travellers from Kahiki at Mōkapu), 344n (Pukui on the mud of Kawainui). |
| `bingham-1847` | Pp. 130–131 (the view from the pali over “Palikoolau”, with the note of a station since founded at Kāneʻohe), 467 (Parker at Kāneʻohe, 1834; the thatched church), 499. |
| `thrum-annual-1907` | P. 49: the heiau of Koʻolaupoko (Kawaewae, Leleahina, Alala, Upo, Makini, Olohana, Pueo, the heiau on Mōkapu). |
| `thrum-annual-1887` | The list of sugar plantations and mills; the distances round Oʻahu from the Honolulu post office. |
| `nps-1992-ka-iwi` | Pp. 26–28 (Waimānalo: the terraces at the foot of the mountains, Kaupō and Kukui, Pāhonu, ranching, sugar 1876–1947, the military reservation and Bellows), 34–36 (Kawainui and Maunawili: the pond and the loʻi, the census figures for Kailua, rice from 1860, ranching, the flood works, Kailua's growth, Ulupō and Pahukini). |
| `mokapu-1965` | Pp. 5, 16–21, 24–30, 68: the ʻili of Mōkapu, the ponds, the Māhele, the reservation of 1918, the Navy's purchase, dredging and fill, the commissionings. |
| `dlnr-ulupo` | The whole page: Kailua and Kawainui about 1750, Ulupō, its registers. |
| `kakoo-oiwi-history` | The whole page; with `hcda-heeia` and `paepae-o-heeia`, read again. |
| `hhfdc-waiahole-plan` | Its history section, again: the McCandless tunnel and kuleana, the leases from 1959. |
| `hhca-1921` | Section 203, in DHHL's copy of the Act as amended. |
| `kipuka-rm-585` | Lyons's Kāneʻohe of 1874, in Kīpuka's 1938 tracing, at low and medium resolution: the shore from Heʻeia to Keaʻalau. |
| `kipuka-rm-1140` | Jackson's chart of the bay, August 1882, at low and medium resolution: the south shore and Mōkapu. |
| `kipuka-rm-1936` | Monsarrat's Waikalua swamp, March 1896, at low resolution: its legend and labels. |
| `kipuka-rm-4148` | A 1969 survey of a small fill at ʻŌpaʻapaʻa, Kāneʻohe. |
| `hgs-1881-oahu`, `hgs-1899-oahu` | The State's image services over Kāneʻohe, Kailua, the pali foot and Waimānalo, read window by window with a lon/lat grid drawn on, as §10. |
| `usgs-topo-1927-oahu`, `state-gis-oahu-1943`, `usgs-topo-2000-oahu` | The State's mosaics over the bay, Kailua and Waimānalo: the ponds and their names in each edition. |
| `oha-kipuka-sites` | 119 polygons and 865 points in the district box: the pond outlines and the points of Ulupō and Pāhonu. |
| `oha-kipuka-lca` | 1,416 award parcels in the box, 1,334 inside the moku. |
| `noaa-cudem-hawaii` | Three 1/9″ tiles: the pond walls at native resolution; a 12.6 m grid for the loʻi. |
| `state-gis-streams-dar`, `state-gis-parcels-oahu`, `usgs-gnis` | The streams of the moku; the Heʻeia wetland parcels; 388 names in the box. |
| `wikipedia-kualoa-ranch`, `wikipedia-kawainui-marsh` | Tertiary: Judd's purchase and the mill; the Ramsar designation. |

Also opened and not cited: Kīpuka's index of registered maps over the district (about 70 sheets for Kāneʻohe, Kailua,
Heʻeia and Waimānalo; the leads are in ACCESS.md), and RM 2834, “Old Palace Lot, Kailua”, which is Huliheʻe's lot in
Kailua, Kona (a resurvey of 1930), a false match. The census of 1896 (`census-1896`) was opened for district figures, but
its tables do not survive the OCR by district. The full-text search of the Internet Archive was used to find books, and its
snippets of lending-only books (McAllister, *Ka Poʻe Kahiko*, Char, Handy, Dorrance) were not read as sources.

### What could not be reached

- **The lending-only books**: Handy's *Hawaiian Planter* (1940), the Chars' *Chinese Historic Sites and Pioneer Families
  of Rural Oahu* (1988), Kamakau's *Ka Poʻe Kahiko* (1964), McAllister (1933), the *Atlas of Kaneohe Bay* (1973), the Kāneʻohe
  Bay water-resources study (1976) and Dorrance's *Oʻahu's Hidden History* (1998) are on the Internet Archive for lending
  only. The first four are in `sources.json` as unread, with what to look for in each.
- **Print**: Devaney, Kelly, Lee and Motteler, *Kaneohe: A History of Change* (1976), and Sterling and Summers, *Sites of
  Oahu* (1978), the two syntheses for this district; neither is on the Internet Archive.
- **Hosts**: the Waikalua Loko Iʻa site (`waikalualoko.org`) refused through the proxy (502); Justia's copy of the Waiāhole
  water decision of 2000 answered with a Cloudflare challenge; Wikipedia's API rate-limited (its pages answered). The blocked
  hosts of ACCESS.md were not tried.
- **Who first held homesteads at Waimānalo, and when**: DHHL's pages read give the Act and its §203 list, not the first leases.

### How each place was fixed

| place | precision | how |
| --- | --- | --- |
| `kailua-oahu` Kailua | exact | GNIS's populated place. Its own id, beside `kailua-kona`. |
| `kalapawai`, `oneawa` | exact | GNIS (Kalapawai, an area; Oneawa Beach). Fornander's “a place called Oneawa, in Kailua” and Kamakau's “coast of Oneawa … between Kaneʻohe and Kailua” both fit the beach at the north end of Kailua Bay. |
| `naonealaa` Naonealaʻa | ahupuaʻa | No map read writes it; Kāneʻohe's centroid. Kamakau writes Naoneala‘a, Fornander Naonealaa. |
| `kawainui`, `kaelepulu`, `waikalua`, `nuupia`, `molii`, `kahaluu-fishpond` | exact | GNIS's points for the ponds (Kawainui Marsh; Kaʻelepulu Pond; Waikalua-Loko Fish Pond; Nuʻupia Pond; Mōliʻi Pond; Kahaluʻu Pond). Kahaluʻu's pond is named Kahouna after the State site record, with GNIS's name as alt. |
| `ulupo` Ulupō | exact, landmark | The State site record's point; a State historic site on the National and Hawaiʻi Registers (State Parks), so it may be exact. |
| `kaneohe`, `waimanalo`, `mokapu`, `maunawili` | exact | GNIS (populated places; Mōkapu Peninsula; Maunawili Valley). |
| `bellows` | exact | GNIS's Waimanalo Military Reservation (historical). |
| `kukui` | ahupuaʻa | “Near Pahonu Pond” (National Park Service); a marker inland of Pāhonu. |
| `pahonu` | exact (was ahupuaʻa) | The State site record's public point, Pahonu Turtle Pond, on the shore by Kaiona; GNIS's Pahonu (an area) lies 500 m west, inland. Kaiona is an alt name rather than a place of its own. |

### What the award parcels showed

Unlike Nuʻuanu (§10), Koʻolaupoko's kuleana are in Kīpuka's award layer: 1,334 parcels inside the moku, mostly awarded
1849–1860 (84 %; the rest later or undated). By State unit, parcels and claims (the award number before the colon):

| ahupuaʻa | parcels | claims | | ahupuaʻa | parcels | claims |
| --- | --- | --- | --- | --- | --- | --- |
| Kāneʻohe | 250 | 136 | | Waiāhole | 115 | 60 |
| Kailua | 223 | 117 | | Kahaluʻu | 94 | 51 |
| Heʻeia | 182 | 93 | | Hakipuʻu | 97 | 51 |
| Waimānalo | 128 | 87 | | Kaʻalaea | 72 | 26 |
| Waiheʻe | 53 | 29 | | Waikāne | 46 | 20 |
| Kualoa 1 and 2 | 74 | 38 | | | | |

The layer's land-use field is empty for every one, so which parcel was loʻi, kula or house lot is not recorded here;
Lyons's survey (1874) adds that his sheet draws kuleana over five acres and leaves most smaller ones off, and Monsarrat's
Waikalua map (1896) draws the small ones of that swamp with the edge of the rice over them. The parcels include whole-land
awards and later grants, some of hundreds of hectares; only those under 2.5 ha were used for the loʻi.

### How the features were made

All coordinates lie within −157.896 to −157.681 W, 21.326 to 21.521 N. A feature's `to` is the last year a source read
shows it, as in §10.

- **Fishponds** (15). Three ways, chosen per pond by what the sources hold:
  - *Traced on today's heights* where the wall stands (`mapped`, `noaa-cudem-hawaii`): the water at or below +0.3 m reached
    from a seed inside the pond, with every texel within a few texels of land a barrier (closing the openings for the
    sluice gates), grown back to the outside of the wall, simplified at 2.5 m. Heʻeia (gap 8 texels, 32.0 ha; stable from
    6 to 12), Moliʻi (6, 45.4 ha), Kahouna (6, 12.6 ha). Each checked against the 1927 sheet's walls, which it follows within
    the sheet's registration. The State site record's outlines for these three are boxes around the sites and were not used.
  - *The State site record's outline* where it is a pond's shape and matches the 1927 and 1943 maps (`mapped`, with `site`):
    Oʻohope, Kalokohanahou, Punaluʻu, Keana, Mikiola–Kapuʻu–Mahinui, Keaʻalau, the Nuʻupia–Halekou–Kaluapuhi complex,
    Kawainui (the marsh's outline) and Kaʻelepulu (the pond with its marsh).
  - *Traced from the 1943 map's blue fill* (`state-gis-oahu-1943`, exported at 1.7 m, opened and closed to drop the blue
    shore lines and lettering): Kanohuluiwi and Waikapoki, two ponds side by side drawn as one (3.3 ha), and Waikalua Loko
    (4.3 ha, its tail along the stream cut off at −157.7857), whose walled basin on today's heights is only 3 ha.
  - *Pāhonu* (`schematic`): its wall shows neither on the CUDEM's near-shore heights nor on the 1881, 1927 or 1943 sheets;
    a half-ring of 40 m on the reef flat at the State site point. Its size is a guess, and its note says so.

  | pond | area | outline | to | why |
  | --- | --- | --- | --- | --- |
  | Moliʻi, Kahouna, Heʻeia | 45.4, 12.6, 32.0 ha | heights | — | walls stand today |
  | Oʻohope, Kalokohanahou, Kanohuluiwi and Waikapoki, Punaluʻu | 1.5, 5.8, 3.3, 5.2 ha | site, site, 1943, site | 1943 | the 1943 map fills them; GNIS calls them historical |
  | Keana, Mikiola–Kapuʻu–Mahinui, Keaʻalau | 2.1, 6.5, 3.0 ha | site | 1943 | the 1943 map fills them; no later map read shows them |
  | Waikalua Loko | 4.3 ha | 1943 | — | the 2000 sheet still draws a fishpond; GNIS lists it as standing |
  | Nuʻupia, Halekou, Kaluapuhi | 136.6 ha | site | — | the 2000 sheet draws Halekou and Nuʻupia inside the air station |
  | Kawainui | 277.4 ha | site | 1827 | Kamakau's Kamehameha at work there; bulrushes over most of it by the late 1820s (NPS) |
  | Kaʻelepulu | 123.3 ha | site | 1943 | the 1943 map fills it; Enchanted Lake from the mid-1960s |
  | Pāhonu | 0.3 ha | schematic | — | rebuilt today |

  No pond's building date is in any source read, so every `from` is null. Lyons (1874) gives three acreages and Jackson
  (1882) the Mōkapu names; they are tellings on the ponds. The burial and heiau outlines in the same layer were not copied.

- **Loʻi** (40). For each State ahupuaʻa, the award parcels under 2.5 ha rasterized on the 12.6 m CUDEM grid; closed with
  a 5 × 5 square so neighbours join; kept where the ground is land, at most 12 % slope and below 150 m; opened (2 × 2);
  trimmed of texels whose 5 × 5 neighbourhood is more than half steep (over 15 %); pieces under 1.5 ha, and any piece still
  more than 4.9 % steep, dropped; holes filled, traced along texel edges, simplified at 7.5 m;
  then pieces under 2.5 ha left out of the file. `inferred`, because the parcels are mapped but their use is not. Each later
  ahupuaʻa takes only ground no earlier one claimed.

  | loʻi | pieces | area | to | the end year |
  | --- | --- | --- | --- | --- |
  | Waimānalo | 4 | 71.0 ha | 1856 | the last awards; cattle from the 1850s, cane from 1878 |
  | Kailua | 6 | 41.0 ha | 1945 | rice in the marsh's wet fields from about 1860, given up by the mid-1940s (NPS) |
  | Kāneʻohe | 9 | 78.1 ha | 1896 | Monsarrat's rice over the Waikalua kuleana |
  | Heʻeia | 5 | 41.9 ha | 1935 | kalo through the mid-1930s (Kākoʻo ʻŌiwi) |
  | Kahaluʻu, Waiheʻe, Kaʻalaea | 4, 2, 2 | 31.0, 19.4, 12.5 ha | 1856 | the last awards |
  | Waiāhole, Waikāne | 2, 3 | 36.6, 16.5 ha | 1856 | the last awards |
  | Hakipuʻu, Kualoa | 1, 1 | 21.3, 2.7 ha | 1856 | the last awards |
  | Heʻeia, restored | 1 | 2.4 ha | — | from 2010; Kākoʻo ʻŌiwi |

  §14 changes the Kailua and Kāneʻohe end years where rice follows the taro, and adds the rice as loʻi of its own.

  The restored loʻi are `schematic`: a disc of 88 m inside the State's wetland parcel (TMK 4-6-16:001) by the highway, where
  the farm's driveway lies just south of the Heʻeia Stream bridge, clipped to the parcel, about the six acres its history gives.
  On the CUDEM test heights the check's measure (texel centres inside the outline) is at most 2.1 %; counting every texel an
  outline touches, the worst Kāneʻohe and Kailua pieces reach 12–13 %, so the outlines run close to steeper edges in places.
  The bake's lidar will see house pads and road cuts the CUDEM smooths; the rule is checked at merge.

- **Villages** (3), points with tellings (§14 makes them polygons): Kailua at GNIS's point, to 1850 (the NPS's count of that year); Kāneʻohe where the
  1881 sheet writes “Old Mission Res. & Church”, to 1874 (Lyons's survey, with its church, court house and kuleana); Kukui near
  Pāhonu, to 1850, `schematic`. No source read counts households; the tellings give the people counted for Kailua and say so.
- **Heiau** (7): Ulupō exact, as a landmark; Pahukini, Holomakani and Alala at Kailua's centroid, Kawaewae at Kāneʻohe's,
  Olohana and Pueo at Waimānalo's, all `schematic` with `placePrecision: ahupuaa`. Leleahina (Heʻeia), which Thrum says was
  then used as a cemetery, and the heiau on Mōkapu were left out of the file. The site record's points and outlines for heiau
  were not used to place anything.
- **Trails** (2), `inferred`, to 1881: from the windward end of the Nuʻuanu district's pali trail (−157.787, 21.3745) along the
  1881 sheet's roads, north across Kāneʻohe to the shore at Mahinui, and east to Maunawili.
- **Streams** (14), `mapped`, `role: "reference"`: the State layer names streams by system with the tributary in its own
  field, and its segments meet at interior vertices, so each main stem is the path, over a graph of every vertex, from the
  lowest end of the system's largest component to the farthest node from it; simplified at 12 m. Maunawili ends in the marsh.
- **Labels** (9) at the new places, as Nuʻuanu's.

### What each keyframe rests on

- **c. 1700 (`kailua-chiefs`, era `alapai`; §14 moves it to `kakuhihewa`, 1690–1730)**. Kailua as the rulers' windward home: Fornander for Kākuhihewa's house and for
  Kūaliʻi's birth, youth and death there; State Parks for the place about 1750. The landscape: the ponds as the site record,
  the old maps and the heights give them (none dated), the loʻi of the kuleana as a stand-in for the older fields, and
  Kawainui as a pond (NPS: in use perhaps from the late 1600s). The one dated moment is Alapaʻinui's landing at Oneawa and the
  peace at Naonealaʻa, 1737 (Kamakau, Fornander). **The era**: c. 1700 falls between `umi` (to 1630) and `alapai` (from 1730),
  and no era covers it. The event runs 1690–1737 at generation precision and sits in `alapai`, the chapter its last stop and
  the death of Kūaliʻi (before 1730) fall in or beside; with `umi` the check would warn. A chapter for the Oʻahu rulers of the
  1600s (Kākuhihewa to Kūaliʻi) would fit better and is the design's to decide.
- **1850 (`koolaupoko-1850`, era `kauikeaouli`)**. The Māhele as `mahele.json` reads it (Kāneʻohe and Kailua to Kalama,
  Heʻeia to Paki, Waimānalo and Kualoa crown; the Mōkapu history agrees for the first three); the kuleana from Kīpuka's layer;
  the mission from Bingham, the 1881 sheet and Lyons; depopulation from the NPS's Kailua figures; Kualoa's sale from Wikipedia
  (tertiary, with a `wanted`); rice and cane from Lyons (1874), Jackson (1882), Monsarrat (1896), Thrum (1887) and the NPS.
  The rice stop's year is 1882, Jackson's chart. (§14 moves it to 1896: Jackson writes Taro land over Waikalua.)
- **Now (the coda)**. Heʻeia (Paepae o Heʻeia, Kākoʻo ʻŌiwi, the reserve), Pāhonu (the Limu Hui) and Waiāhole, each now with
  stops. The years between 1898 and 1970 are tellings, not events, as the brief asks: on `heeia-restoration`, Heʻeia's
  wetland kalo into the 1930s, the Navy's dredging and fill at Mōkapu (1939–43) and the air stations, a shore fill of 1969,
  and Kailua's growth and Enchanted Lake; on `pahonu-limu`, the military reservation of 1917 and Bellows, the homestead lands
  of §203 and the turtle pond; on `waiahole-1977`, the tunnel and the kuleana bought up. The ponds' end years (1943, the
  houses after) and the restored loʻi (from 2010) carry the rest in the features.

### The stop cameras

`bearing` is the compass direction the camera looks; distance in world units (100 m). Each was set from the geometry
(a camera over the bay or the plain looking inland at the place), not ray-cast; all want a look in the first render.

| event | stop | place | bearing | pitch | distance | target | frames |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kailua-chiefs | 0 | `kailua-oahu` | 225 | 0.35 | 45 | −157.748, 21.395 | from over Kailua Bay: the beach, the plain, Kawainui, Olomana and the pali behind |
| kailua-chiefs | 1 | `kawainui` | 200 | 0.4 | 30 | | the pond from the north, Ulupō on its far edge, Maunawili beyond |
| kailua-chiefs | 2 | `heeia-fishpond` | 235 | 0.45 | 18 | | the pond's wall from the bay, Heʻeia behind |
| kailua-chiefs | 3 | `kualoa` | 315 | 0.3 | 30 | −157.843, 21.512 | Kualoa's cliffs and Moliʻi from the bay |
| kailua-chiefs (§14: now `alapai-wars` 0) | 4 | `oneawa` | 250 | 0.35 | 50 | −157.772, 21.418 | the south shore of the bay from over Mōkapu's neck |
| koolaupoko-1850 | 0 | `kaneohe` | 215 | 0.4 | 28 | | the Kāneʻohe shore and the mission |
| koolaupoko-1850 | 1 | `heeia-wetlands` | 240 | 0.4 | 22 | −157.815, 21.428 | up the Heʻeia floor |
| koolaupoko-1850 | 2 | `kawainui` | 210 | 0.4 | 35 | | the marsh |
| koolaupoko-1850 | 3 | `kualoa` | 315 | 0.3 | 28 | −157.843, 21.514 | Kualoa |
| koolaupoko-1850 | 4 | `waimanalo` | 230 | 0.35 | 40 | | the plain and the foot of the cliffs from the bay |
| koolaupoko-1850 | 5 | `waikalua` | 205 | 0.45 | 18 | | the Waikalua swamp |
| heeia-restoration | 0, 1, 2 | `heeia-fishpond`, `heeia-wetlands`, `heeia-fishpond` | 250, 235, 225 | 0.5, 0.45, 0.35 | 14, 14, 45 | —, −157.8135, 21.4345, −157.80, 21.43 | the pond; the restored loʻi; the reserve |
| pahonu-limu | 0, 1 | `pahonu`, `waimanalo` | 200, 235 | 0.5, 0.3 | 10, 50 | | the pond on the reef flat; the plain |
| waiahole-1977 | 0 | `waiahole` | 255 | 0.35 | 35 | −157.862, 21.482 | up the valley from the bay |

### Where the tellings diverge

1. **When Kākuhihewa and Kūaliʻi lived.** Fornander has Kūaliʻi dead “some time previous to 1730”, at past ninety; Thrum dates
   the rites for his birth “about 1640”; State Parks puts Kākuhihewa “in the 1400s” and Kūaliʻi “in the late 1600s”. The event
   runs 1690–1737 and its date confidence is soft.
2. **Alapaʻi's war.** Kamakau gives a day, Kaʻelo 13, 1737; Fornander, a war of “nearly a month” of skirmishes and no year
   here (his “say 1738” is in `alapai-wars`). Kamakau's Waihaukalua is Fornander's Waihaukalua too; Lyons's Waikalua is
   probably the same land, which a speaker should confirm.
3. **Kawainui's end as a pond.** Kamakau has Kamehameha at work on its ponds; the NPS has it in use from the late 1600s and
   overgrown by the late 1820s; State Parks describes it as a 400-acre pond about 1750 and has Kamehameha eat its mud in a
   famine. Pukui's note in Kamakau (p. 344) tells the mud as a trick played on Kamehameha's men. The feature ends in 1827.
4. **Ulupō.** State Parks: probably an agricultural heiau, perhaps later a luakini, abandoned by 1795; Thrum's “Upo” at Kailua
   is probably it. Names and spellings differ (Ulupō, Ulu Po, Upo).
5. **Who held Kualoa.** `mahele.json` classes Kualoa as crown in 1848, and the king sold it to Judd in 1850; the source for the
   sale read here is tertiary.
6. **Names to check**: Moliʻi or Mōliʻi; Kahouna or Kahaluʻu Pond; Alala (Fornander, Thrum); Pamoa or Kamooa; Naonealaʻa;
   Kūaliʻi, which Nuʻuanu's heiau note writes Kualiʻi; Oʻohope; Keaʻalau.

### Where the schema grew

- A fishpond, like a pond from the State site record in Nuʻuanu, carries `site`; here also the ponds traced otherwise, which
  share a site record with a box outline.
- A loʻi restored in the coda is a second feature with `from` 2010, as the brief allows.
- The c. 1700 keyframe has no era of its own (above). §14 gives it one, `kakuhihewa`.
- The district needs an entry in `districts/manifest.json` before the check reads its features; the check finds a second
  district only through the manifest once one exists.

### Still needs a reader, a library card, or a cultural reviewer

- **A library**: Devaney et al. for Kāneʻohe's population, ponds and fields decade by decade; Sterling and Summers for the
  sites and the lore (where Alele, Pamoa, Naonealaʻa and Kukui were); Handy for the loʻi valley by valley; the Chars for rice;
  McAllister for the heiau and ponds as he found them; *Ka Poʻe Kahiko* for Kawainui.
- **The registered maps at full resolution, georeferenced**: Jackson's chart (1882) for the bay before dredging, Lyons's
  Kāneʻohe (1874), Monsarrat's Waikalua (1896), and the Heʻeia (1851, 1859), Kailua (1875, 1888) and Waimānalo (1850, 1880)
  sheets in ACCESS.md, which would replace the kuleana-floor loʻi with surveyed fields.
- **A reader of Hawaiian**: Kamakau's own chapters on Kūaliʻi and Alapaʻi; the names above.
- **A cultural reviewer**: Ulupō placed exactly (a public State site); the heiau at the Kailua, Kāneʻohe and Waimānalo
  centroids; Leleahina left out; Kūaliʻi's bones, which Fornander's story disposes of and the cards leave alone; the
  Mōkapu sand dunes and the Bellows dunes, which hold burials, under the base and the beach park, which no feature touches;
  and how the living organisations of the coda (Paepae o Heʻeia, Kākoʻo ʻŌiwi, the Waimānalo Limu Hui, the Waiāhole-Waikāne
  Community Association) want to be named. No individual is named in the coda's new text.

### Left for others

- **The bake**: an entry for `koolaupoko` in `districts/manifest.json` with bounds covering the features (−157.896 to
  −157.681 W, 21.326 to 21.521 N) and preferably the whole moku (−157.898 to −157.649 W, 21.309 to 21.535 N), say
  −157.905, 21.300, −157.640, 21.545. For the patches: Jackson's chart of 1882 (RM 1140) is the chart of the bay before 1939
  that DATA.md “Patches” lacked; the Navy dredged and filled at Mōkapu from September 1939 to 1943, adding about 280 acres
  (`mokapu-1965` pp. 24–25); Kaʻelepulu was dredged and built over from the mid-1960s; a fill of 1969 at ʻŌpaʻapaʻa
  (RM 4148). The pond walls of Heʻeia, Moliʻi and Kahouna stand low over the water on the CUDEM, with gaps at the sluices
  (the traces close gaps of up to six to eight texels, 20–25 m), so a bake that flattens water inside the coast should keep them.
- **The app**: the new event ids and cameras (`target` on eight stops); `kailua-oahu` is distinct from `kailua-kona`; ponds
  ending in 1943 and Kawainui in 1827; the restored loʻi from 2010; villages as points with tellings.
- **DATA.md**: nothing new beyond §11–12's list, unless the design gives the 1600s a chapter (§14 does).

## 14. The chapter of Kākuhihewa and Kūaliʻi; Koʻolaupoko's villages and rice

Three gazetteer things, October 2026: a chapter for Oʻahu's rulers of the 1600s, between ʻUmi's and Alapaʻinui's, so that
Kailua of the chiefs no longer sits in Alapaʻinui's; Koʻolaupoko's three villages as outlines the ground can draw; and rice on
the Koʻolaupoko loʻi where the record has it, under the `crop` that DATA.md "Crops, on the era layers" allows. `check-data.mjs`
is clean; its event count now warns above seventy, since the chapter takes the file to sixty-two.

| file | change |
| --- | --- |
| `eras.json` | 13 eras (was 12): `kakuhihewa`, “in the time of Kākuhihewa and Kūaliʻi”, year 1680, precision 50 |
| `events.json` | 62 events (was 59): `kakuhihewa`, `kamalalawalu` and `kualii` added; `kailua-chiefs` moved into the new era, 1690–1730, its 1737 stop, Oneawa, Naonealaʻa and Mōkapu and two tellings moved to `alapai-wars`; `koolaupoko-1850`'s rice stop moved to 1896 |
| `places.json` | 106 places (was 101): `ewa` (moku), `puako`, `hokuula`, `laupahoehoe` (exact, GNIS), `kalaupapa` (ahupuaʻa) |
| `polities.json` | 14 polities (was 13): `hilo-chiefs`; the `kakuhihewa` map, notes and sources |
| `layers/manifest.json` | its `eras` map: `kakuhihewa` as `umi`, every layer at `contact`, year 1680, which is what `eraMap()` computes |
| `sources.json` | 107 sources (was 105): `fornander-collection-v4`, `kipuka-rm-2038`; notes on RM 1140, RM 1936 and the 1881 sheet |
| `districts/koolaupoko/features.json` | 96 features (was 90): the villages as polygons; six loʻi in rice; the years of six Kailua loʻi and one Kāneʻohe loʻi |
| `tools/check-data.mjs` | the event count; `crop` on a loʻi; two loʻi on one outline may not overlap in years |

### What was read

| source | what, and where |
| --- | --- |
| `fornander-v2` | Pp. 108, 117–118 (Lono sails to Kailua, where Kākuhihewa held his court, the house Kamooa), 122–130 (Lono's visit to Kamalālāwalu at Hāna; the landing near Puakō, Kaunooa and Kamakahiwa, the defeat at Hokuula in Waimea, Kauhiakama's escape; Keakealanikane, Keakamahana, Keakealaniwahine and Keawe; the houses of ʻI in Hilo and Mahi in Kohala), 206–210 (Kamalālāwalu to Kaulahea on Maui; Lānaʻi tributary; Molokaʻi's chiefs turning to Maui and Oʻahu), 272–287 (Kākuhihewa to Kūaliʻi; Kauhiakama at Waikīkī; Kūaliʻi's wars, his Kauaʻi, his death; the chant), 292–296 (Kauaʻi from Kawelomahamahaiʻa to Lonoikahaupu). |
| `kamakau-ruling-chiefs` | Pp. 52–61 (the chiefs of each island in Lono's time; Lono and Kaʻihikapu at Kalapawai and Pamoa; Kamalālāwalu's spies, the war, Puʻuʻoaʻoaka, the rule after Lono over Kohala, Kona and Kaʻū only), 61–64 (Keakamahana and Keakealani; the wars of Kona and Hilo; Keawe's rule over Kohala, Kona and Kaʻū), 96n (the editors on Kūaliʻi), 232 (Kahekili's revenge for Kauhiakama), 300 (the saying), 369 (Kūaliʻi dies in 1730), Appendix II (Stokes on Kamakau's dates). |
| `fornander-collection-v4` | New. The contents of the History of Kualii (pp. 364–434) and the opening of its chapter on his battles (pp. 406–410): Keahumoa his last battle, Kauaʻi given over to him by its king, Kawaluna his first. A Google scan on the Internet Archive. |
| `kipuka-rm-1140` | Read again at 150 dpi over Heʻeia and Kāneʻohe: “Rice land” on the inland floor of Heʻeia, “Sugar Cane” between it, the road and the pond, and “Taro land” over the Waikalua swamp. |
| `kipuka-rm-1936` | Read again at 75 dpi: the legend (rice north of the main stream 4.25 acres, south of it to Kawa Stream 60, and 21 more) and the award numbers south of the stream. |
| `kipuka-rm-2038` | New. Dove's plat of June 1901 for a government lease of Kanohuluiwi to L. Ahlo: the rice and the parcels it names. |
| `kipuka-rm-585` | Read again over the mission and church: L.C.A. 387 to the mission, 5.1 acres; Grant 167 to the Kāneʻohe church, 10 acres; Punaluʻu's fifty acres, twenty-two of them kuleana. |
| `oha-kipuka-lca` | The parcels Monsarrat's and Dove's maps name, and the mission's and church's lands, looked up by award number. |
| `hgs-1881-oahu`, `hgs-1899-oahu`, `usgs-topo-1927-oahu` | Exported again over Kāneʻohe, Heʻeia, Kailua and Kukui. The 1899 and 1927 sheets write no rice in Koʻolaupoko; the 1881 sheet's offset is below. |
| `nps-1992-ka-iwi`, `kakoo-oiwi-history` | Again: p. 35 on the rice of Kawainui; kalo on the Heʻeia wetland through the mid-1930s, and no rice. |
| `usgs-gnis` | Puakō, Hōkūʻula (the hill west of Waimea), Laupāhoehoe Point. |

Also opened and not cited: Thrum's reduction of Jackson's chart (RM 1848, 1892), which repeats Jackson's Taro Land at Waikalua;
the State site record's habitation sites in the district (Waimānalo Beach Park, Waikalua, Kukanono, Miomio), none of which
bounds a village.

### The era

`umi` runs to 1630 and `alapai` from 1730, so `kakuhihewa` takes 1680 ± 50 and fills the gap exactly. Its label names the two
rulers the chapter runs between; the tour's chapter name reads “Kākuhihewa and Kūaliʻi”. The dates are genealogical: Fornander
puts Kākuhihewa four generations before Kūaliʻi, who flourished “from the middle to the close of the seventeenth century” and
died before 1730 (Kamakau gives 1730); Lonoikamakahiki stayed at Kākuhihewa's court, Kamakau makes Kākuhihewa's sons the chiefs of
Oʻahu in Lono's time, and Kamalālāwalu, Lono's enemy, was Keawenui-a-ʻUmi's contemporary. At Fornander's thirty years a
generation that opens the chapter in the later 1500s; Kirch's coral dates for Piʻilani and Kiha (1550–1700) bring it into the
1600s. So the first two events begin before the era's 1630 (`kakuhihewa` 1570–1640, `kamalalawalu` 1580–1640, both
`generation`); they overlap the era, the check does not warn, and the tour shows each at the point of its span nearest the era's
year, about 1640. The era's note says why. Three of the four events start on Oʻahu, so the chapter opens on Oʻahu.

### The events

In the tour's order:

1. **`kakuhihewa`, Oʻahu-a-Kākuhihewa** (1570–1640, founding): Kākuhihewa born at Kūkaniloko, the split island made one by peace
   and marriage, the court at ʻEwa, Waikīkī and Kailua, Lono at Kailua, the island named for him; his sons sharing it in peace.
   Places: Waikīkī, ʻEwa, Kailua, Kūkaniloko. Fornander pp. 117–118, 272–277; Kamakau pp. 52, 55, 300.
2. **`kamalalawalu`, Kamalālāwalu** (1580–1640, battle): Maui-a-Kama, the prophet Lanikaula's warning, the landing near Puakō,
   Kanaloakuaʻana taken, the defeat on the plain of Waimea, Kauhiakama's escape by Kawaihae and his later death at Waikīkī. Places:
   Waimea, Puakō, Hōkūʻula, Kawaihae, Hāna, Waikīkī. Fornander pp. 108, 122–124, 206–208, 276; Kamakau pp. 55–61, 232; Kirch's
   dates; Kirch and Ruggles unread.
3. **`kualii`, Kūaliʻi** (1650–1730, battle): the rites at Kawaluna and the rout of the Kona chiefs, the spear wood from Kauaʻi,
   the ʻEwa chiefs beaten near Līhuʻe and at Malamanui, the Hilo raid by Laupāhoehoe, the rising at Waiʻanae, the battle at
   Kalaupapa for the Kona chiefs of Molokaʻi, the windward side of Kauaʻi by inheritance and Peleioholani over it, his death at
   Kailua. Places: ʻEwa, Nuʻuanu, Waiʻanae, Laupāhoehoe, Kaunakakai, Kalaupapa, Wailua on Kauaʻi. Fornander pp. 278–284, 287,
   292–296; the legend, pp. 406–408; Kamakau pp. 96n, 369.
4. **`kailua-chiefs`**, moved: era `kakuhihewa`, 1690–1730 (was `alapai`, 1690–1737). Its summary ends with Kūaliʻi's death; the
   1737 stop at Oneawa, word for word with its camera, is now `alapai-wars`' only stop, with Oneawa (already there), Naonealaʻa and
   Mōkapu, Kamakau's day of the meeting and Fornander's “mere series of skirmishes”. It gained Kamakau's Pamoa (p. 55) and his
   year for Kūaliʻi's death (p. 369). `alapai-wars` keeps its `far` and `island` zooms; the stop carries its own `near`.

`koolaupoko-1850`'s last stop said that by the 1880s old loʻi and swamp land were in rice, “as around the pond of Waikalua”, at
1882. Jackson's chart of 1882 writes Taro land over the Waikalua swamp; the rice there is Monsarrat's, of 1896. The stop now
says so and stands at 1896, and the event runs to 1896.

### The polities

| island | holder in `kakuhihewa` | from |
| --- | --- | --- |
| Hawaiʻi: Kohala, Kona, Kaʻū | `hawaii`: Lonoikamakahiki, then Keakealanikane, Keakamahana, Keakealaniwahine and Keawe, the Mahi chiefs of Kohala their war leaders | Kamakau pp. 61–64; Fornander pp. 127–130 |
| Hawaiʻi: Hilo, Hāmākua | `hilo-chiefs`, new: the chiefs of Hilo of the line of ʻI (Kuaʻana, Kuahuʻia, Moku), at war with Kona and more often the victors; hatched | Kamakau pp. 61–63; Fornander p. 128 |
| Hawaiʻi: Puna | `hilo-chiefs`, hatched: only Laʻa, read as ʻŌlaʻa, is named among the Hilo chiefs' lands; the rest of Puna is unrecorded | Kamakau p. 62 |
| Maui, with Hāna, and Lānaʻi | `maui`: Kamalālāwalu, Kauhiakama, Kalanikaumakaowākea, Lonohonuakini, Kaulahea; Lānaʻi tributary by inference | Fornander pp. 122, 206–210 |
| Molokaʻi | `molokai`, its own chiefs; Kūaliʻi's battle at Kalaupapa for the Kona chiefs | Fornander pp. 210, 282 |
| Oʻahu | `oahu`: Kākuhihewa, his sons, Kahoʻowahaokalani, Kauakahi, Kūaliʻi; ʻEwa and Waialua apart before Kākuhihewa and again before Kūaliʻi | Fornander pp. 272–283 |
| Kauaʻi and Niʻihau | `kauai`: the Kawelo chiefs; late in the span the windward side Kūaliʻi's by inheritance and Peleioholani over Kauaʻi, Waimea with Lonoikahaupu's family; hatched | Fornander pp. 282, 292–296; the legend p. 406 |

Kamakau and Fornander differ on Keawe: Kamakau has him ruling Kohala, Kona and Kaʻū only (p. 64), Fornander has him win the Hilo
chiefs by marriage and rule the island in peace (p. 129). The map follows Kamakau for most of the span and the notes give both.
Fornander contradicts himself on Kauaʻi (Kona section, p. 282; windward side, p. 295); the notes give both.

### The villages

Each village is now a Polygon, traced on the district's heights (12.98 m texels) by a rule written out here rather than drawn by
hand: the land in a window that meets the village's rules, clear of every loʻi and pond by a texel (the ground rasters one feature
a texel), the piece holding a seed, holes filled, traced along texel edges and simplified at 18–25 m.

| village | precision | to | area | rules |
| --- | --- | --- | --- | --- |
| Kāneʻohe | inferred | 1874 | 10.7 ha, 16 vertices | within 380 m of the centroid of the church's grant (Grant 167) in the award layer, up to 22 m, under 15 % slope; one hook in the trace evened by hand |
| Kailua | inferred | 1850 | 26.2 ha, 13 vertices | 35 to 200 m from the sea, up to 9 m, from near the mouth of Kaʻelepulu Stream (Kalapawai) north-west to 21.405° N |
| Kukui | schematic | 1850 | 6.1 ha, 7 vertices | 30 to 150 m from the sea, up to 12 m, west of Pāhonu from −157.689 to −157.683 |

No source read counts households, and the tellings say so. The outlines were sized against the people the tellings do count:
the ground lays a kauhale about every 85 m (`buildVillage` in `src/features/index.js`), about one to a hectare, so Kailua's
outline holds about the twenty-five to thirty households that a third of the 430 people outside Maunawili in 1850 would make at
five or six to a house; Kāneʻohe's about ten; Kukui's about six. That arithmetic is the design's, not a source's.

**The 1881 sheet over Koʻolaupoko.** The State's image service of the 1881 Government Survey sheet, checked in Nuʻuanu (§10),
falls west and south of the award layer and of today's shore here by a few hundred metres: Kailua's shore on it lies about 300 m
inland of today's, and its “Old Mission Res. & Church” about 500 m west of the church's grant, which Monsarrat's map of 1896 puts
where the award layer does. The Kāneʻohe village moved off the sheet's label to the church's grant and the ground round it to
the wall of Punaluʻu; `hgs-1881-oahu`'s note says so.

### The rice

| feature | outline | years | the record |
| --- | --- | --- | --- |
| `loi-kailua-2-rice`, `loi-kailua-5-rice` | the two Kailua loʻi at the edge of Kawainui, 6–8 m | 1860–1945 | rice in the marsh's old taro fields by 1860, given up in the mid-1940s (NPS p. 35) |
| `loi-kaneohe-1-rice` | the Kāneʻohe loʻi of the Waikalua swamp, south of the main stream | 1896 | Monsarrat, March 1896: 81 acres of rice south of the main stream (about 33 ha; the outline is 30.9) |
| `loi-kaneohe-2-rice`, `loi-kaneohe-3-rice` | the two Kāneʻohe loʻi that hold the parcels Dove names (L.C.A. 1963, Grants 195 and 536) | 1901 | Dove, June 1901: about twenty acres of rice in Kanohuluiwi (the outlines are 22.5 ha, wider than the rice) |
| `loi-heeia-rice` | its own: the floor of Heʻeia west of −157.8128 and south of 21.4358, up to 6 m, under 12 % slope, clear of the loʻi | 1882 | Jackson, August 1882: “Rice land” inland of the cane |

- **The taro years.** A loʻi in rice on a taro loʻi's outline is a second feature with years of its own, and the taro's end where
  the rice begins: `loi-kailua-2` and `-5` now end in 1859 (were 1945) and `loi-kaneohe-1` in 1895 (was 1896). The other four
  Kailua loʻi lie on the rise at 41–48 m (4, 6), up Maunawili (3) or by Kaʻelepulu (1), where no rice is recorded; their 1945
  came from the marsh's rice, and they now end with the last awards, 1856. `loi-kaneohe-5`, north of the main stream, where
  Monsarrat has only 4.25 acres of rice, keeps 1896. `loi-kaneohe-2` and `-3` keep 1896; their rice is of 1901.
- **Heʻeia.** Jackson's chart, registered on the Heʻeia pond, Moku o Loʻe and Puʻu Pahu, fits the shore within about 150 m, its
  graticule about 200 m off today's; but his rice land, so registered, falls a few hundred metres west of the floor, on the
  hillside, where nothing could be planted. The floor itself is taken: the low wet ground inland of the line where Jackson's cane
  begins and south of the stream's turn to the pond. Kākoʻo ʻŌiwi has kalo on the same wetland by 1928 and through the
  mid-1930s, so the rice is Jackson's year alone.
- **One year each.** Kāneʻohe's and Heʻeia's rice rest each on one dated map, so each holds for one year; Char and Devaney
  (`char-1988-chinese-sites`, `devaney-1976-kaneohe`) would give the spans.
- **The ground.** Koʻolaupoko's loʻi now have ten spans of years (were five), within the twenty-two the ground has room for.
  `src/data/district.js` rasters one loʻi index a texel, the later in the file winning, so each rice feature stands just before
  its taro outline: until the ground reads `crop`, the taro keeps its years there and the rice of those outlines is not seen;
  Heʻeia's, on an outline of its own, is drawn as a loʻi in 1882.

### What the check now enforces

- the event count warns outside forty to seventy (was sixty);
- `crop` only on a `loi`, `taro` or `rice`; a rice loʻi has a `from` year, and one before 1850 warns;
- two loʻi on one outline (the same rings) may not overlap in years;
- the district's summary line counts the loʻi with a crop.

In the app (a build of this pass, a scratch Playwright script after `tools/smoke.mjs`): the chapter is the fourth of thirteen,
“Kākuhihewa and Kūaliʻi”, opening on Oʻahu, its four events in the order above; `alapai-wars` walks its one stop. Down in
Koʻolaupoko at 1690, 1850, 1859, 1860, 1882, 1896, 1901 and 1950, every village and loʻi checked holds exactly in its years
(the villages to 1850 and 1874, the taro of `loi-kailua-2` to 1859 and its rice from 1860, `loi-kaneohe-1`'s rice in 1896,
`loi-kaneohe-2`'s in 1901, Heʻeia's in 1882), with no page error or warning. The full smoke test, run once, lost its browser
during the camera checks before it reached the tour, on a machine other runs were loading; it was not rerun.

### Where the tellings diverge

1. **Where Kamalālāwalu fell.** Fornander: defeated and slain at Hokuula in Waimea, after the fight at Kaunooa near Puakō.
   Kamakau: the battle on the waterless plain of Puʻuʻoaʻoaka outside the grassy plain of Waimea, and Kamalālāwalu “killed on the
   grassy plain of Puako”. `hokuula` stands at GNIS's Hōkūʻula; the event's first place is Waimea.
2. **Kanaloakuaʻana.** Fornander: his eyes put out and slain at Kamakahiwa. Kamakau: tattooed and renamed Kamakahiwa. The card
   says he was taken and cruelly used.
3. **Keawe's Hawaiʻi** and **Kūaliʻi's Kauaʻi**: above.
4. **Pamoa.** Fornander has Kākuhihewa build it at Alele in Kailua (some legends say Kamooa, the name he gives the house where
   Lono found Kākuhihewa); Kamakau has it the house of Kākuhihewa's son Kaʻihikapu, by the surf at Kalapawai, and an Alele in
   Waikele, ʻEwa.
5. **When.** Fornander's reckoning, the shorter generations and Kirch's coral dates disagree by up to a century; Kamakau's 1730
   for Kūaliʻi's death is the only year, and his own editors warn against his dates.

### What could not be reached

- **Print**: Cordy's *Exalted Sits the Chief*, for the reigns from Lonoikamakahiki to Keawe and which moku each held; Kirch's
  *How Chiefs Became Kings* and Kirch and Ruggles, for Kamalālāwalu's reign by the coral dates (ACCESS.md has both).
- **Unread and open**: the rest of the History of Kualii (Fornander Collection IV, pp. 364–434) and its legend of
  Lonoikamakahiki (from p. 256), which tells the battle at Waimea; `fornander-collection-v4` carries what to look for.
- **Lending only**: Char and Char; *Ka Poʻe Kahiko*; Handy, as §13.
- **The registered maps at full resolution**, georeferenced: Jackson (RM 1140) inland, Monsarrat (RM 1936) for the edge of the
  rice, Dove (RM 2038) for the bounds of the lease; and RM 1345 and 747 for Kailua.

### Left for others

- **The app**: read `crop` on a district loʻi (rice over a taro outline, never in the same year); the three villages as polygons;
  the new era and its chapter; `hilo-chiefs` in the chiefdoms legend.
- **A reader and a cultural reviewer**: §7's new lines.
