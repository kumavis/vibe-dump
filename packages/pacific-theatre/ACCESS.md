# Pacific Theatre: sources behind a wall

A standing list of what the research could not reach from the build container,
why, and what each would unlock if the project's owner can open it: a host to
allow, a browser session on a site that refuses scripts, an archive request, a
book to borrow, a dataset behind a login, a permission to ask for. Consolidated
from the research reports under `research/` (each report's own "What could not
be reached" and "Still needs a person" sections say more). Each entry names the
battles, data or questions it would settle. When one is opened, read it, turn
its `sources.json` entry from `opened: false` to `true` with its `read`, and
strike it here.

Tested from the container on 22 October 2026. Everything below that is a web
host answers to a person with a browser.

## Hosts to unblock

| host | why it failed | what it would unlock |
| --- | --- | --- |
| [history.navy.mil](https://www.history.navy.mil/) (Naval History and Heritage Command) | TLS error 60 to curl ("unable to get local issuer certificate"); 503 to WebFetch | the online reading room: the Midway action reports in NHHC's own copies, *The Japanese Story of the Battle of Midway*, H-Gram 036 (Samar's casualties), DANFS entries for Johnston, Hoel, Gambier Bay, Washington, South Dakota; the Battle of Midway page every Wikipedia figure cites. HyperWar mirrors most of the texts, so this is a confirmation wall, not a data wall |
| [apps.dtic.mil](https://apps.dtic.mil/) | 403 | DTIC's copies of the Naval War College analyses of Midway (ADA003054) and Coral Sea (AD-A003053); archive.org serves them instead |
| [usnwcarchives.org](https://usnwcarchives.org/) | 404 to curl for the digital object | the War College's own scans of the Battle Evaluation Group studies, including whether a Samar volume ever existed |
| [history.army.mil](https://history.army.mil/) (Center of Military History) | 403 | the Green Books' native host and their maps at full resolution (HyperWar mirrors the text and most maps): the front lines by keyframe are to be traced from these |
| [usmcu.edu](https://www.usmcu.edu/) (Marine Corps History Division) | 403 | the USMC monographs' native host (HyperWar mirrors them) |
| [nzetc.victoria.ac.nz](https://nzetc.victoria.ac.nz/) → ndhadeliver.natlib.govt.nz | 301, then an Incapsula challenge | the New Zealand official history: Waters, *The Royal New Zealand Navy*; Gillespie, *The Pacific* |
| [www.cv6.org](https://www.cv6.org/) | DNS failure | Enterprise's squadron reports and accounts (VB-6, VS-6, VT-6, VF-6) for the Midway dive and the torpedo squadrons |
| [usswashington.com](https://usswashington.com/) | CONNECT 502; DNS failure | **Washington's action report for the night of 14–15 November 1942**: the radar ranges and times her bridge moment needs |
| [www.bosamar.com](https://www.bosamar.com/) | answers, but with a server error page (Zend Guard Loader missing) | the Taffy 3 action reports it hosted, including **CTU 77.4.3 (Sprague's) report** of Samar |
| [navsource.org](http://www.navsource.org/) | CONNECT 502 | ship photographs and some transcribed reports, for the kits' silhouettes |
| [researcheratlarge.com](https://www.researcheratlarge.com/) | TLS: self-signed certificate | transcribed ship reports |
| [web.archive.org](https://web.archive.org/) (Wayback Machine) | connection reset | recovery of bosamar.com and other dead pages |
| [catalog.archives.gov](https://catalog.archives.gov/) | a single-page app; no keyless API found | NARA RG 38 war diaries and action reports (see Archive requests) |
| [fold3.com](https://www.fold3.com/) | 403, and paid | the same RG 38 scans |
| [babel.hathitrust.org](https://babel.hathitrust.org/) | 403 | public-domain reports the Internet Archive lacks; a second scan where an Internet Archive copy is poor |
| [exhibits.stanford.edu/copyrightrenewals](https://exhibits.stanford.edu/copyrightrenewals) | JavaScript challenge | renewals for books published 1950–63: Morison VI–XV, Fuchida and Okumiya (1955), Field (1947) |
| en.wikipedia.org `api.php` and `rest_v1`; commons.wikimedia.org API | 429 even with a User-Agent | structured queries (article HTML and `action=raw` work; ja.wikipedia rate-limits after about ten pages) |
| ndlsearch.ndl.go.jp OpenSearch | 429 (concurrent-access limit) | NDL catalogue search (the NDL Lab API works) |
| api.github.com | 403 (proxy policy) | repository metadata for the Natural Earth GeoJSON mirrors (the naciscdn zips serve instead) |
| HyperWar IJO Nav 83 and Nav 106 | 404 | two USSBS interrogations covering Savo, Midway, Leyte and Santa Cruz |
| navweaps.com, Japanese torpedo page | bot check to curl (read via WebFetch) | the Type 91's drop speed and height are not given there anyway |

## Archive requests

| archive | what to ask for | what it would unlock |
| --- | --- | --- |
| NARA, RG 38 (or a Fold3 account) | Washington's and Commander Task Force 64's (Lee's) action reports, 14–15 November 1942; CTU 77.4.3's special report of 29 October 1944; the Enterprise squadron reports for 4 June 1942; the Hornet report's Enclosure F track charts; VF-3's and VB-3's reports | the US bridge record for Guadalcanal; Sprague's record of Samar; squadron-level Midway |
| NIDS, 防衛研究所戦史研究センター史料閲覧室 | permission to reproduce any chart or page image from JACAR's NIDS-held 戦闘詳報 or the Senshi Sōsho (合戦図, 行動図, 付図第三 軍艦大和行動図) | JACAR's terms reserve publication of NIDS-held images to NIDS; without a letter the app cites them by RefCode and shows nothing |
| the Copyright Office's online public catalogue | renewals for Morison VI–XV, Fuchida and Okumiya (1955), Field (1947) | whether any later Morison volume is in fact public domain |

## Scans behind lending

| scan | where | what it would unlock |
| --- | --- | --- |
| Frank, *Guadalcanal* (1990) | an unlicensed upload exists; a lending copy on the Internet Archive | the night of 14–15 November by the hour; South Dakota's and Kirishima's hits; the casualty figures Wikipedia quotes |

## Print (a library card, or a purchase)

| book | what it would unlock |
| --- | --- |
| Parshall and Tully, *Shattered Sword* (2005) | **the Kidō Butai's box formation and spacing at 10:20**, which no open source gives and which the Midway dive moments depend on; the CAP chronology (how many Zeros were aloft at 10:00, 10:20 and 10:30, and where); Best's approach on Akagi; each carrier's AA fit; the arming-change narrative as they re-read it; their 3,057 Japanese dead |
| Lundstrom, *The First Team* (1984) and *The First Team and the Guadalcanal Campaign* (1994) | VT-8's and VT-3's targets; Zero losses against VT-3 and VF-3; Thach's fight; Santa Cruz's air battle |
| Hornfischer, *The Last Stand of the Tin Can Sailors* (2004) | Samar minute by minute from the survivors; Johnston's run as her people told it |
| Tully, *Battle of Surigao Strait* (2009) | the strait, for the later box |
| Y'Blood, *Red Sun Setting* (1981) | the Philippine Sea raids' altitudes, routes and compositions |
| Prange, *At Dawn We Slept* (1981); Goldstein and Dillon, *The Pearl Harbor Papers* (1993); Zimm, *Attack on Pearl Harbor* (2011) | the torpedo drop height and speed at Pearl Harbor; the attack geometry from the Japanese planning documents; Zimm's analysis of the bomb that sank Arizona |
| Cressman et al., *A Glorious Page in Our History* (1990) | the Japanese CAP and Hiryū's position as the Japanese sources tell it |
| Spurr, *A Glorious Way to Die* (1981); Yoshida, *Requiem for Battleship Yamato* | Ten-Gō from the Japanese side; the VT-9 and VT-17 aircraft action reports it cites |
| Evans and Peattie, *Kaigun* (1997); Lacroix and Wells, *Japanese Cruisers of the Pacific War* (1997); Skulski's *Anatomy of the Ship* volumes (Yamato, Fusō, Takao); Garzke and Dulin; Friedman's *US Battleships*, *US Cruisers*, *US Destroyers*, *US Aircraft Carriers* | the kits' dimensions, turret positions and AA fits by date, now taken from the recognition manuals and Wikipedia as *verify* |
| Toll, Prange, Willmott, Ienaga, Dower, Hastings | the table's cards for the war as a whole |
| USF-74, *Current Tactical Orders and Doctrine, U.S. Fleet Aircraft* (1941, 1944) | not digitised (NARA RG 38): the dive and torpedo doctrine the attack profiles now take from the targets' reports |

## Needs a reader

| what | where | what it would unlock |
| --- | --- | --- |
| the Japanese action reports 戦闘詳報 of the v1 battles | JACAR: Kaga C08030040500 (with the bombers' track and the hit charts); the First Air Fleet's report C08030023600–24100; Atago C08030745200 and Inazuma C08030752400 (the night of 14–15 November); Cruiser Division 7 C08030037100 and Tone C08030568700 (Samar); Yamato and Destroyer Squadron 2 C08030103100 (Ten-Gō); the Pearl Harbor reports R10 lists | a reader of wartime Japanese: times (JST), courses, positions, hits and losses as the Japanese side recorded them, to check against the US records and the 1947 translation of Nagumo's report at the points the app uses (the 0415 order, the 0428 delivery, the 0730 readiness) |
| the Senshi Sōsho 戦史叢書 | the NIDS viewer, open: 10 ハワイ作戦, 43 ミッドウェー海戦 (chs. 5–6, the CAP), 83 南東方面海軍作戦 (ch. 7, the night of 14–15 November), 56 海軍捷号作戦 (part 1 ch. 5, Samar), 17 沖縄方面海軍作戦 (ch. 10, Yamato's hits; the fold-out track 付図第三), 12 マリアナ沖海戦 | the Japanese official counts and chronology for every v1 battle |
| the readings and romaji of every Japanese name the data carries | `places.json`, `events.json`, `kits/*.json`, the battle files | a Japanese speaker, before any of it reaches a card (RESEARCH.md §2 D10) |

## Data

| dataset | status | what it would unlock |
| --- | --- | --- |
| the Allen Coral Atlas | the host answers 200; download needs a login (*verify*) | reef edges and lagoons for the atoll boxes (Tarawa above all, a later battle); no open grid resolves them |
| FABDEM (bare-earth Copernicus DEM) | reachable, but CC BY-NC-SA 4.0 | a canopy-free Guadalcanal and Samar; share-alike would bind the committed packs, so it is not used |
| the U.S. Army Map Service 1940s sheets | reachable at UT Austin's PCL (`maps.lib.utexas.edu/maps/ams/`), public domain, not yet read | period shorelines and the 1940s names of the Solomons, the Philippines and the Marianas; Pearl Harbor's 1941 shore |
| the AAF history's maps 6 and 7 (*7 December 1941: The Air Force Story*) | reachable on HyperWar, not opened | the plotted routes of the two waves over Oʻahu |
| the Naval War College's Diagrams D-1 and D-2 for Midway and its Japanese-disposition plates | reachable on archive.org, not opened | positions from 04:30 to 09:00, now from the text only |
| Snyder, *Map Projections: A Working Manual* (USGS PP 1395) | reachable (22.5 MB), not downloaded | page numbers for the projection formulas, which were checked numerically instead |

## Permission, not access

| item | what is needed |
| --- | --- |
| NIDS-held images in JACAR and the Senshi Sōsho charts | a letter to NIDS before any scan, crop or tracing ships (see Archive requests) |
| the Australian War Memorial's scanned official histories | a check of their licence (text CC BY-NC, or public domain as expired Crown copyright) before any passage is quoted at length |
| combinedfleet.com's Tabular Records of Movement; Lundgren's analyses on navweaps.com | copyrighted compilations: facts cited, text never copied; nothing to ask, only a rule to keep |
| Morison's *History of United States Naval Operations in World War II* | in copyright (renewals R600933, R670368, R637305, R657783, R657781 found): read for facts, cited as print, never copied, never linked to the uploads |
| Wikimedia Commons maps (CC BY-SA) | nothing traced from them; the fronts come from public-domain US charts |

## Found open, not yet read

Not walls, but leads: each is open from here and simply unread.

| source | where | what it would give |
| --- | --- | --- |
| the Naval War College analyses of Savo (1950) and Leyte (vols. I, II, III, V) | HyperWar | the approach to Samar up to 23 October; Savo for a later box |
| the Japanese Monographs for the Solomons, Midway, Leyte and Okinawa | HyperWar (several large PDFs; read by page range) | the Japanese side's post-war reconstructions |
| the Pearl Harbor Attack hearings and their exhibits | ibiblio.org/pha | the Japanese attack plan and Fuchida's report as translated; the harbour charts |
| the GEBCO 2026 grid's undocumented subset API | download.gebco.net | spot checks of box bathymetry against GMRT and ETOPO |
