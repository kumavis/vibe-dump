# Holo i ke Au: sources behind a wall

A standing list of what the research could not reach from the build container, why, and what each
would unlock if the project's owner can open it: a host to allow, a lending scan to borrow, a book to
buy or borrow, a dataset to obtain. Consolidated from RESEARCH.md §§2–12. Each entry names the events,
places, layers or questions it would settle. When one is opened, read it, turn its `sources.json` entry
from `opened: false` to `true` with its `read`, and strike it here.

## Hosts to unblock

| host | why it failed | what it would unlock |
| --- | --- | --- |
| [Ulukau](https://puke.ulukau.org/), with [Wehewehe](https://wehewehe.org/) and [nupepa.org](https://nupepa.org/) | Cloudflare challenge, 403 (all three) | Kamakau's own Ulukau copy (confirm the URL for `kamakau-ruling-chiefs`); Pukui, Elbert and Mookini's *Place Names of Hawaii* and the dictionary, for every spelling RESEARCH §§7, 10 lists (Puʻiwa, Lāʻimi, Kanoneakapueo, the battle's name Kalelekaʻanae); Malo's Hawaiian; the scans of *Ka Nūpepa Kūʻokoʻa* and *Ke Au ʻOkoʻa*, where Kamakau's Nuʻuanu chapter (1 and 8 June 1867) would settle the posts, the guns and the weapons' names |
| [Papakilo Database](https://www.papakilodatabase.com/) | 403 | the Hawaiian-language newspapers; the Buke Māhele and Māhele award records; Boundary Commission testimony; the Hawaiian Ethnological Notes. Would turn `mahele.json`'s 192 unknown and 27 disputed units into read classes |
| [AVA Konohiki](https://www.avakonohiki.org/) | timed out | its Buke Māhele pages, which OHA's Kīpuka cites for every konohiki land: the same use as Papakilo for `mahele.json`, and the Nuʻuanu, Pauoa and Kapālama awards that would replace the stream-band loʻi with parcels (§§10–11) |
| [eVols](https://evols.library.manoa.hawaii.edu/) (UH ScholarSpace) | Turnstile challenge, then timeouts | the *Hawaiian Journal of History*: Schmitt 1969 on battle deaths (pp. 67–68, the Nuʻuanu dead), Greer on the 1853 smallpox; Thrum's *Annual* in volumes the Internet Archive lacks |
| [HathiTrust](https://babel.hathitrust.org/) full text | 403 | public-domain kingdom and territorial reports the Internet Archive lacks (the Surveyor General's and the Interior's), and a second scan where an Internet Archive copy is poor |
| [Chronicling America](https://chroniclingamerica.loc.gov/) / loc.gov | 403, then Cloudflare | the Hawaiian Gazette, Pacific Commercial Advertiser, Evening Bulletin and Hawaiian Star for 1897–98: whether the Pali road cut found remains, which the Nuʻuanu tellings now trace only to a travel guide (§3) |
| [Biodiversity Heritage Library](https://www.biodiversitylibrary.org/) | Cloudflare challenge, 403 | the Bishop Museum Bulletins: McAllister on Oʻahu (1933; also below), Bennett on Kauaʻi (1931), Emory on Lānaʻi (1924), Stokes; the heiau and fishponds of each island at the precision §7.4 allows |
| [usgs.gov](https://www.usgs.gov/) | 403, timeouts | the Volcano Watch column of 2008 on the Kaʻū footprints and the dead of 1790 (`keanakakoi-1790`); the observatory's pages on the 1868 earthquake and Mauna Loa flow, a second source for `kau-earthquake-1868` |
| [Wayback Machine](https://web.archive.org/) | reset every connection in the second pass | a re-read of the Pacific Worlds Nuʻuanu page (the oral account), for its exact words on the guns of both sides |
| [oha.org](https://www.oha.org/) | 403 (Kīpuka's own site and services answer) | Kīpuka's documentation and terms of use, for the licence question below |
| Wikimedia Commons API, Google Books API | rate limit, quota | the 1825 chart of Honolulu harbour from the Blonde's survey: the shore ponds thirty years after the battle (§10) |

## Scans behind lending

| scan | where | what it would unlock |
| --- | --- | --- |
| McAllister, *Archaeology of Oahu* (Bishop Museum Bulletin 104, 1933; Kraus reprint 1971) | [Internet Archive](https://archive.org/details/archaeologyofoah0000mcal), lending only; its search-inside refused; tDAR restricted; not in the Bishop Museum's list of bulletin PDFs | the site descriptions behind the Honolulu ponds and heiau (Kālia, Kuwili, Kahoʻikekanaka, Kaheiki) and whether the Kīpuka site numbers repeat McAllister's (§10) |
| Van Dyke, *Who Owns the Crown Lands of Hawaiʻi?* (2008) | [Internet Archive](https://archive.org/details/whoownscrownland0000vand), lending only | the Crown lands from 1848 to 1893: sales before 1865, the 1890 additions, a check on `mahele.json`'s crown and `later` classes |

## Print (a library card, or a purchase)

| book | what it would unlock |
| --- | --- |
| ʻĪʻī, *Fragments of Hawaiian History* (1959) | the Honolulu–Nuʻuanu trail of about 1810 and the ʻili of the valley; who served the guns at Nuʻuanu; Kamehameha's court (every card of that era) |
| Sterling and Summers, *Sites of Oahu* (1978) | the Honolulu and Nuʻuanu sites, ponds and heiau, and the place-name lore of the valley |
| Kuykendall, *The Hawaiian Kingdom*, vols. I–III (from 1938) | the Māhele and the land laws; the guns of 1795; the 1864 constitution and the reigns of the merged chapter |
| Kameʻeleihiwa, *Native Land and Foreign Desires* (1992) | the Māhele chief by chief: the check on every konohiki class and awardee in `mahele.json`, and the acreage totals |
| Handy, *Native Planters in Old Hawaii* (a paid ebook) | the loʻi valley by valley; Nuʻuanu's taro; the 1778 cultivation weights (§9) |
| Kirch, *How Chiefs Became Kings*; Kirch and Ruggles, *Heiau, ʻĀina, Lani* (2019) | the coral-dated heiau of Kahikinui and Kaupō, and the chiefly chronology the reign eras guess at |
| Cordy, *Exalted Sits the Chief* | the Hawaiʻi Island chiefdoms; the pre-contact eras and polity maps |
| James, *The Battle of Nuʻuanu* (2004) | the battle's name, and the map behind Wikipedia's account and the oral account: the positions of the lines |
| Pukui, Elbert and Mookini, *Place Names of Hawaii* (1974) | as for Ulukau above, in print |
| Schmitt, *Demographic Statistics of Hawaii* | the 1850 census by island and the district figures before 1896 (§9) |
| Silva, *Aloha Betrayed* (2004) | the Kūʻē petitions and the two associations behind them (`kue-1897`) |
| Stannard, *Before the Horror* (1989) | his contact-population estimate at first hand (`depopulation`) |
| Obeyesekere (1992); Sahlins (1995) | the two readings of Cook and Lono, now unread tellings (`cook-kealakekua-1779`) |
| Wilcox, *Sugar Water* (1996) | the ditches (`hamakua-ditch-1876`) |
| Osorio; Beamer | the kingdom's politics and land (DESIGN §7.2) |

## Data

| dataset | status | what it would unlock |
| --- | --- | --- |
| The Buke Māhele (1848), read by a person | the scan is open on the [Internet Archive](https://archive.org/details/esrp777824242) but handwritten in Hawaiian; no machine reads it | the primary record behind `mahele.json`: every class and awardee, and the 27 disputes |
| The 1850 census by island | not found open; Thrum's table starts at 1853 | an 1850 base for the Māhele keyframe's settlement layer (§9) |
| UH coastal-geology pages (SOEST) | known only at second hand: the patches cite "the University of Hawaiʻi's coastal surveys" for the Ala Wai boat harbour | the dates and extents of fill and dredging on the Waikīkī and Kālia shore, from the surveys themselves (DATA.md "Patches") |
| U.S. Army Corps of Engineers report of 1961 | named in the owner's list; no pass has located it | the post-war harbour works from the works' own record; the harbour patches now rest on secondary posts and on the Chief of Engineers' report of 1935 as one site quotes it |
| Charts of Kāneʻohe Bay before 1939 | none found by the patch work; Kīpuka's registered maps (below) include Kāneʻohe Bay sheets, undated | the Kāneʻohe seaplane runways (1939–42), which cannot be told from the natural lagoon without them (DATA.md "Patches"); the Koʻolaupoko district |
| The leeward Kohala and Kona field systems as GIS | not found open (the Hawaiʻi Biocomplexity Project publishes papers, not footprints) | the 1778 dryland cultivation, now stood in for by the Kurashima–Kirch zones (§9) |
| Hawaiʻi Conservation Alliance fishpond layer | needs a login | real fishponds statewide, now a shore rule (§9) |

## Permission, not access

| item | what is needed |
| --- | --- |
| OHA's Kīpuka layers (award, site, ahupuaʻa and Crown lands layers) | no licence is stated on the items; `mahele.json` and the 1853 layers use them. Ask OHA before release |
| Kamehameha Schools' Traditional Agriculture model (Kurashima et al.) | no licence on the item; the cultivation layers use it at hundreds of metres. Ask before release |
| The oral account's speakers (Pacific Worlds, Nuʻuanu) | living people: ask how they want to be credited (§10) |

## Found open in the second pass, not yet read

Not walls, but leads: each is open from here and simply unread.

| source | where | what it would give |
| --- | --- | --- |
| The Government Survey's registered maps | OHA Kīpuka's [RegisteredMaps](https://services5.arcgis.com/7nEbFq9LrZLy9uXi/arcgis/rest/services/RegisteredMaps/FeatureServer/0) index, 3,526 entries, with PDFs at kipukadatabase.com (many marked missing) | Nuʻuanu Valley (RM 2028, a large tracing) and Nuʻuanu Pali (RM 4117), for the bounds of Puʻiwa and Lāʻimi, now points (§§6, 10); Kāneʻohe (RM 585, C. J. Lyons, 1874) and Kāneʻohe Bay (RM 4148, 4149), for the Kāneʻohe patches and district |
| Vancouver, *A Voyage of Discovery to the North Pacific Ocean* (1798) | [Internet Archive](https://archive.org/details/cihm_41864) | his visits of 1792–94: a route and events not yet made (§8) |
| Alexander, *A Brief History of Land Titles in the Hawaiian Kingdom* (1882) | [Internet Archive](https://archive.org/details/appendixtorepor00hawagoog) | the land laws from 1846 to 1882, beside Chinen |
| Linnekin, *The Hui Lands of Keanae* | [Internet Archive](https://archive.org/details/hui-lands-keanae-hawaiian-land-tenure-great-mahele) | the Māhele at Keʻanae, one of the lands `mahele.json` leaves mixed |
