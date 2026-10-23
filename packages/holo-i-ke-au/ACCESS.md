# Holo i ke Au: sources behind a wall

A standing list of what the research could not reach from the build container, why, and what each
would unlock if the project's owner can open it: a host to allow, a lending scan to borrow, a book to
buy or borrow, a dataset to obtain. Consolidated from RESEARCH.md §§2–13. Each entry names the events,
places, layers or questions it would settle: what to look for in it, not only that it is wanted. For the
nineteen sources the app already cites unread (`opened: false` in `sources.json`), the same want is on
the entry itself, in `wanted`, and `check-data` requires it; this file carries the rest: the sources no
entry cites yet, and the hosts and datasets that are not sources. When one is opened, read it, turn its
`sources.json` entry from `opened: false` to `true` with its `read`, drop or narrow its `wanted`, and
strike it here.

## Hosts to unblock

| host | why it failed | what it would unlock |
| --- | --- | --- |
| [Ulukau](https://puke.ulukau.org/), with [Wehewehe](https://wehewehe.org/) and [nupepa.org](https://nupepa.org/) | Cloudflare challenge, 403 (all three) | Kamakau's own Ulukau copy (confirm the URL for `kamakau-ruling-chiefs`); Pukui, Elbert and Mookini's *Place Names of Hawaii* and the dictionary, for every spelling RESEARCH §§7, 10 lists (Puʻiwa, Lāʻimi, Kanoneakapueo, the battle's name Kalelekaʻanae); Malo's Hawaiian; the scans of *Ka Nūpepa Kūʻokoʻa* and *Ke Au ʻOkoʻa*, where Kamakau's Nuʻuanu chapter (1 and 8 June 1867) would settle the posts, the guns and the weapons' names |
| [Papakilo Database](https://www.papakilodatabase.com/) | 403 | the Hawaiian-language newspapers; the Buke Māhele and Māhele award records; Boundary Commission testimony; the Hawaiian Ethnological Notes. Would turn `mahele.json`'s 192 unknown and 27 disputed units into read classes |
| [AVA Konohiki](https://www.avakonohiki.org/) | timed out | its Buke Māhele pages, which OHA's Kīpuka cites for every konohiki land: the same use as Papakilo for `mahele.json`, and the Nuʻuanu, Pauoa and Kapālama awards that would replace the stream-band loʻi with parcels (§§10–11) |
| [eVols](https://evols.library.manoa.hawaii.edu/) (UH ScholarSpace) | Turnstile challenge, then timeouts | the *Hawaiian Journal of History*: Schmitt 1969 on battle deaths (pp. 67–68, the Nuʻuanu dead), Greer on the 1853 smallpox; Thrum's *Annual* in volumes the Internet Archive lacks; MacLennan 1995 on the Maui plantations of 1840–60 (`maclennan-1995-maui-plantations`: which ground cane in 1853, on how many acres, and whether the East Maui plantation at Kaluanui began in 1849 or 1857), for the 1853 cane the crop classes draw at a nominal size; Coulter and Chun 1937, if the university's research publications are there (`coulter-chun-1937-rice`) |
| [HathiTrust](https://babel.hathitrust.org/) full text | 403 | public-domain kingdom and territorial reports the Internet Archive lacks (the Surveyor General's and the Interior's), and a second scan where an Internet Archive copy is poor; the 1900 U.S. census of agriculture for Hawaii (acres in rice, coffee and pasture by island, 1899), which was not found on the Internet Archive, to calibrate the 1896 crop classes |
| [Chronicling America](https://chroniclingamerica.loc.gov/) / loc.gov | 403, then Cloudflare | the Hawaiian Gazette, Pacific Commercial Advertiser, Evening Bulletin and Hawaiian Star for 1897–98: whether the Pali road cut found remains, which the Nuʻuanu tellings now trace only to a travel guide (§3) |
| [Biodiversity Heritage Library](https://www.biodiversitylibrary.org/) | Cloudflare challenge, 403 | the Bishop Museum Bulletins: McAllister on Oʻahu (1933; also below), Bennett on Kauaʻi (1931), Emory on Lānaʻi (1924), Stokes; the heiau and fishponds of each island at the precision §7.4 allows |
| [usgs.gov](https://www.usgs.gov/) | 403, timeouts | the Volcano Watch column of 2008 on the Kaʻū footprints and the dead of 1790 (`keanakakoi-1790`); the observatory's pages on the 1868 earthquake and Mauna Loa flow, a second source for `kau-earthquake-1868` |
| [Wayback Machine](https://web.archive.org/) | reset every connection in the second pass | a re-read of the Pacific Worlds Nuʻuanu page (the oral account), for its exact words on the guns of both sides |
| [oha.org](https://www.oha.org/) | 403 (Kīpuka's own site and services answer) | Kīpuka's documentation and terms of use, for the licence question below |
| [Waikalua Loko Iʻa](https://www.waikalualoko.org/) | 502 through the proxy | the pond's own history and its restoration: when the wall was rebuilt and who keeps it, for `fishpond-waikalua` and a stop in the coda (RESEARCH §13) |
| [HIMB](https://himb.hawaii.edu/) (the Hawaiʻi Institute of Marine Biology) | 502 through the proxy | the history of Moku o Loʻe: how much of today's island Holmes made in 1934–36 and how much the Navy and the laboratory added after, which the `moku-o-loe-fill` patch cannot separate (DATA.md "What `koolaupoko` rests on") |
| [Justia](https://law.justia.com/) | Cloudflare challenge, 403 | the Hawaiʻi Supreme Court's Waiāhole Ditch decision of 2000 (*In re Water Use Permit Applications*): the ditch, the windward streams and the return of water, for `waiahole-1977` |
| Wikimedia Commons API, Google Books API | rate limit, quota | the 1825 chart of Honolulu harbour from the Blonde's survey: the shore ponds thirty years after the battle (§10) |
| Wikipedia's API | rate limit (429) after a few pages | the pages on Aubrey Robinson (Gay & Robinson's Makaweli ranch) and ʻUlupalakua Ranch, tertiary checks on Kauaʻi's and Maui's ranches of the 1890s (§9, Crops) |
| [Images of Old Hawaiʻi](https://imagesofoldhawaii.com/) | some pages redirect in a loop (307) | “Before the Ala Wai”, which a search summary credits with Waikīkī's 542 acres of rice in 1892 out of Oʻahu's 4,659: read with its source, the cap the crop classes lack for Waikīkī and Oʻahu (§9, Crops) |

## Scans behind lending

| scan | where | what it would unlock |
| --- | --- | --- |
| McAllister, *Archaeology of Oahu* (Bishop Museum Bulletin 104, 1933; Kraus reprint 1971) | [Internet Archive](https://archive.org/details/archaeologyofoah0000mcal), lending only; its search-inside refused; tDAR restricted; not in the Bishop Museum's list of bulletin PDFs | the site descriptions behind the Honolulu ponds and heiau (Kālia, Kuwili, Kahoʻikekanaka, Kaheiki) and whether the Kīpuka site numbers repeat McAllister's (§10); for Koʻolaupoko, the heiau of Kailua, Kāneʻohe and Waimānalo and the bay's ponds as he found them (`mcallister-1933`, §13). The archive's full-text search shows his Kawainui as site 370, the State number the Kīpuka layer gives it, so the numbers probably do repeat his |
| Handy, *The Hawaiian Planter*, vol. I (Bishop Museum Bulletin 161, 1940; the 1971 reprint) | [Internet Archive](https://archive.org/details/hawaiianplanter0000hand), lending only | the loʻi of Koʻolaupoko valley by valley, to check the loʻi drawn from the kuleana (`handy-1940-hawaiian-planter`; RESEARCH §13) |
| Char and Char, *Chinese Historic Sites and Pioneer Families of Rural Oahu* (1988) | [Internet Archive](https://archive.org/details/chinesehistorics0000char), lending only | rice in Koʻolaupoko valley by valley, the mills and the Chinese tenants of the ponds (`char-1988-chinese-sites`) |
| Kamakau, *Ka Poʻe Kahiko* (1964) | [Internet Archive](https://archive.org/details/bwb_Y0-BOQ-669), lending only | pp. 82–84, the Kawainui fishpond (`kamakau-poe-kahiko`) |
| *Atlas of Kaneohe Bay* (1973); *Kaneohe Bay Water Resources Data Evaluation* (1976) | [Internet Archive](https://archive.org/details/atlasofkaneoheba0000vari), lending only | the reefs, sediments and shore of the bay before and after the dredging and fill of 1939–43, for the Kāneʻohe Bay patches |
| Van Dyke, *Who Owns the Crown Lands of Hawaiʻi?* (2008) | [Internet Archive](https://archive.org/details/whoownscrownland0000vand), lending only | the Crown lands from 1848 to 1893: sales before 1865, the 1890 additions, a check on `mahele.json`'s crown and `later` classes |

| Coulter, *Population and Utilization of Land and Sea in Hawaii, 1853* (Bishop Museum Bulletin 88, 1931; reprint 1971) | [Internet Archive](https://archive.org/details/populationutiliz0000coul), lending only; its search-inside refused; not among the Bishop Museum's bulletin PDFs | his maps of land use at the Māhele, island by island: where taro, sweet potato, cane and grazing were in 1853, to map the 1853 crop classes instead of modelling them (`coulter-1931-land-1853`, §9, Crops) |

## Print (a library card, or a purchase)

| book | what it would unlock |
| --- | --- |
| ʻĪʻī, *Fragments of Hawaiian History* (1959) | the Honolulu–Nuʻuanu trail of about 1810 and the ʻili of the valley; who served the guns at Nuʻuanu; Kamehameha's court (every card of that era) |
| Sterling and Summers, *Sites of Oahu* (1978) | the Honolulu and Nuʻuanu sites, ponds and heiau, and the place-name lore of the valley; the Koʻolaupoko chapters, and where Alele, Pamoa, Naonealaʻa and Kukui were (`sterling-summers-1978`) |
| Devaney, Kelly, Lee and Motteler, *Kaneohe: A History of Change* (1976) | Kāneʻohe from contact to 1950: population by decade, the mission, the kuleana, rice, sugar, ranching, and when each pond of the shore was filled (`devaney-1976-kaneohe`) |
| Kuykendall, *The Hawaiian Kingdom*, vols. I–III (from 1938) | vol. I: the guns and the foreigners of 1795 (Young, Davis, how many cannon), pp. 88–89 on the sandalwood famine at first hand, and the land laws of 1846–50 and the Māhele, for `mahele.json`'s classes and the Māhele chapter; vol. II: the 1864 constitution and the reigns of the merged chapter, event by event; vol. III: the 1887 constitution and the overthrow |
| Kameʻeleihiwa, *Native Land and Foreign Desires* (1992) | the Māhele chief by chief: the check on every konohiki class and awardee in `mahele.json`, and the acreage totals |
| Handy, *Native Planters in Old Hawaii* (a paid ebook) | the loʻi valley by valley; Nuʻuanu's taro; the 1778 cultivation weights (§9) |
| Kirch, *How Chiefs Became Kings*; Kirch and Ruggles, *Heiau, ʻĀina, Lani* (2019) | the coral dates of the Kahikinui and Kaupō heiau, temple by temple (name, date range, type), for the Maui heiau in `places.json`; the chiefly chronology (the Maui and Hawaiʻi chapters), to check the bounds of the reign eras in `eras.json`, Kamalālāwalu's reign among them (`kamalalawalu`, RESEARCH §14) |
| Cordy, *Exalted Sits the Chief* | which moku each Hawaiʻi Island paramount held and when, for the pre-contact eras of `polities.json` (from Lonoikamakahiki to Keawe, and how far the chiefs of Hilo held out, for `kakuhihewa`); his dated royal centres (Waipiʻo, Kailua, Hilo) for `places.json`; his population estimates by district, for the contact settlement layer |
| James, *The Battle of Nuʻuanu* (2004) | the battle's name, and the map behind Wikipedia's account and the oral account: the positions of the lines |
| Pukui, Elbert and Mookini, *Place Names of Hawaii* (1974) | as for Ulukau above, in print |
| Schmitt, *Demographic Statistics of Hawaii* | the 1850 census by island and the district figures before 1896 (§9) |
| Coulter and Chun, *Chinese Rice Farmers in Hawaii* (University of Hawaii Research Publications 16, 1937) | not found open anywhere reachable; the rice acreage of the 1890s district by district and its maps, to draw the 1896 rice from them instead of placing it by rule, and the rice of Maui, Hawaiʻi Island and Koʻolauloa, which no source read places (`coulter-chun-1937-rice`, §9, Crops) |
| Silva, *Aloha Betrayed* (2004) | the Kūʻē petitions and the two associations behind them (`kue-1897`) |
| Stannard, *Before the Horror* (1989) | his contact-population estimate at first hand (`depopulation`) |
| Obeyesekere (1992); Sahlins (1995) | the two readings of Cook and Lono, now unread tellings (`cook-kealakekua-1779`) |
| Wilcox, *Sugar Water* (1996) | the ditches (`hamakua-ditch-1876`) |
| Osorio, *Dismembering Lāhui* (2002); Beamer, *No Mākou ka Mana* (2014) | Osorio: the constitutions of 1840, 1852 and 1887 and who sat in each legislature, for the kingdom-era cards; Beamer: the kingdom's land and governance as a native system, and his maps of moku and ahupuaʻa as the kingdom's own units, to check the boundary file's reading of the 1850s (DESIGN §7.2) |

## Data

| dataset | status | what it would unlock |
| --- | --- | --- |
| The Buke Māhele (1848), read by a person | the scan is open on the [Internet Archive](https://archive.org/details/esrp777824242) but handwritten in Hawaiian; no machine reads it | the primary record behind `mahele.json`: every class and awardee, and the 27 disputes |
| The 1850 census by island | not found open; Thrum's table starts at 1853 | an 1850 base for the Māhele keyframe's settlement layer (§9) |
| UH coastal-geology pages (SOEST) | known only at second hand: the patches cite "the University of Hawaiʻi's coastal surveys" for the Ala Wai boat harbour | the dates and extents of fill and dredging on the Waikīkī and Kālia shore, from the surveys themselves (DATA.md "Patches") |
| U.S. Army Corps of Engineers report of 1961 | named in the owner's list; no pass has located it | the post-war harbour works from the works' own record; the harbour patches now rest on secondary posts and on the Chief of Engineers' report of 1935 as one site quotes it |
| Charts of Kāneʻohe Bay before 1939 | **found, and registered over the south bay**: Jackson's *Koolau Bay and Anchorages* (August 1882, 1:12,000, "Soundings in fms at L.W." by its own legend, fathoms not feet) is Kīpuka's Registered Map 1140 (`kipuka-rm-1140`); Thrum's reduction of it (RM 1848, 1892) was registered by the district bake on eight fixed points to 42 m rms, and its reefs, Mōkapu's shore and Moku o Loʻe read off it (DATA.md "What `koolaupoko` rests on"). Points north of Kapapa (Mokoliʻi, Mokumanu, Kīʻi Point) fit only to 50–170 m. RM 4148 and 4149, the "Kāneʻohe Bay" sheets, are lot surveys of small shore fills in 1969 | more fixed points on the sheet north of Kapapa (Jackson's own triangulation stations, which the chart marks, matched to the State's), to register the north bay: then the reefs along the fairway from the north passage, which the bay's dredging patch leaves as today's, could be read too |
| The works at Heʻeia Kea and Moku o Loʻe | DLNR's history gives Heʻeia Kea's harbour as completed in 1950 and enlarged in 1963–68; Wikipedia gives Holmes's fill at Moku o Loʻe as 1934–36. No works record was found | the year the harbour's basin was dug and its moles built, and what each enlargement added; the stages of Moku o Loʻe's fill. Both patches carry one date for works the sources cannot separate |
| The first homestead leases at Waimānalo | DHHL's pages read give the Act and its §203 list, not the leases | when homesteading began at Waimānalo, for the coda's tellings (`hhca-1921`) |
| The leeward Kohala and Kona field systems as GIS | not found open (the Hawaiʻi Biocomplexity Project publishes papers, not footprints) | the 1778 dryland cultivation, now stood in for by the Kurashima–Kirch zones (§9) |
| The Territorial Planning Board's land utilization maps (*Historic Inventory*, First Progress Report, 1939) | only their cane and pineapple were digitised (the State GIS 1900, 1920 and 1937 layers); the maps themselves were not found online | rice, ranch land and coffee as the Board mapped them, for the 1896 crop classes now modelled; the “Territorial land-use surveys of the 1930s” the crop contract names are probably these |
| Hawaiʻi Conservation Alliance fishpond layer | needs a login | real fishponds statewide, now a shore rule (§9) |

## Permission, not access

| item | what is needed |
| --- | --- |
| OHA's Kīpuka layers (award, site, ahupuaʻa and Crown lands layers) | no licence is stated on the items; `mahele.json` and the 1853 layers use them. Ask OHA before release |
| Kamehameha Schools' Traditional Agriculture model (Kurashima et al.) | no licence on the item; the cultivation layers use it at hundreds of metres. Ask before release |
| The oral account's speakers (Pacific Worlds, Nuʻuanu) | living people: ask how they want to be credited (§10) |
| Paepae o Heʻeia; Kākoʻo ʻŌiwi | the organisations caring for Heʻeia's pond and wetland: ask how they want their work shown and credited in the coda, and whether the restored loʻi may be drawn where `loi-heeia-restored` puts them (§13). Kākoʻo ʻŌiwi's history page is quoted in tellings |
| The Waimānalo Limu Hui | ask how the hui wants Pāhonu and its work shown, and whether the pond may be drawn at the State site record's point (§13) |
| The Waiāhole-Waikāne Community Association | ask how the association wants the struggle of 1974–77 and the valley today told and credited (§13) |

## Found open in the second pass, not yet read

Not walls, but leads: each is open from here and simply unread.

| source | where | what it would give |
| --- | --- | --- |
| The Government Survey's registered maps | OHA Kīpuka's [RegisteredMaps](https://services5.arcgis.com/7nEbFq9LrZLy9uXi/arcgis/rest/services/RegisteredMaps/FeatureServer/0) index, 3,526 entries, with PDFs at kipukadatabase.com (many marked missing) | Nuʻuanu Valley (RM 2028, a large tracing) and Nuʻuanu Pali (RM 4117), for the bounds of Puʻiwa and Lāʻimi, now points (§§6, 10). For Koʻolaupoko (§13), RM 585, 1140, 1936 and 4148 are now read in part, RM 2038 (the Kāneʻohe rice lands under government lease, Dove, 1901) too (§14), RM 1848 in full and registered (the district bake), and RM 1345 (Kailua Bay, Jackson, October 1884) and RM 1019 (the east coast from Kailua to Maunalua, Jackson, 1884, in a tracing of 1929) at overview; still unread and open: Heʻeia (RM 633, Webster, 1851; RM 1142, 1859), Waimānalo (RM 72, Metcalf, 1850; RM 865, Waimānalo kuleana, Monsarrat, 1880; RM 2681, the plantation, 1921), Kailua (RM 747, Lyons, 1875; RM 1434, 1888), Kawainui (RM 2030, 2895), Mōkapu and Kāneʻohe Bay (RM 1073, "surveyed by C. J. Lyons and J. F. Brown", no date on its face, with annotations of the 1940s), the U.S. Exploring Expedition's chart with Kāneʻohe (RM 423, 1840: if it charts the bay, its reefs and passages forty years before Jackson) and the Kāneʻohe homesteads of 1913 (RM 2562–2564): georeferenced, they would replace the loʻi drawn from the kuleana with surveyed fields and date the ponds and the shore. RM 2834, "Old Palace Lot, Kailua", is Kailua in Kona |
| *Archaeological Investigations in Upland Kaneohe* (1976) | Internet Archive, `DTIC_ADA128210` | the upper Kamoʻoaliʻi valley's terraces and their history, for the Kāneʻohe loʻi above the floors |
| Vancouver, *A Voyage of Discovery to the North Pacific Ocean* (1798) | [Internet Archive](https://archive.org/details/cihm_41864) | his visits of 1792–94: a route and events not yet made (§8) |
| Alexander, *A Brief History of Land Titles in the Hawaiian Kingdom* (1882) | [Internet Archive](https://archive.org/details/appendixtorepor00hawagoog) | the land laws from 1846 to 1882, beside Chinen |
| Linnekin, *The Hui Lands of Keanae* | [Internet Archive](https://archive.org/details/hui-lands-keanae-hawaiian-land-tenure-great-mahele) | the Māhele at Keʻanae, one of the lands `mahele.json` leaves mixed |
| The Hawaiian Annual for 1895, pp. 146–148, “Table of Coffee Growers throughout the Islands” | [Internet Archive](https://archive.org/details/acp0143.1895.001.umich.edu), page images (the text layer scrambles the table) | acres and trees per grower and ahupuaʻa in Kona, Hāmākua and Olaʻa: Kona's 1896 coffee placed by grower instead of read back from 1978–80 (`thrum-annual-1895`) |
| The Board of Commissioners of Agriculture and Forestry's reports (from 1900) and Smith's *Agriculture in Hawaii* (1903) | Internet Archive (`reportboardcomm02foregoog` and others; `anu7189.0001.001.umich.edu`) | ranches, rice and coffee at the turn of the century by district; Smith gives “fully 10,000 acres planted in coffee” in 1903 |
