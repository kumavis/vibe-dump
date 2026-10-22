# R2: the source corpus and the source ledger

Researcher R2, written 2026-10-22 for the designer of the Pacific War diorama.
Topic: which sources the project can read from this container, what each holds,
its copyright or licence, its language, and a draft `sources.json` for the war
and for the battles in BRIEF §3.

**How to read this file.** "Opened" means R2 read text in the source itself.
"Reached" means the URL answered, with the HTTP status given; it does not mean
read. Everything R2 did not open is marked *verify*. Statuses come from `curl`
through the session proxy, with a User-Agent, on 2026-10-22. `206` is a range
request answered, which is how large PDFs were proved without downloading them.
Small samples are in `research/downloads/R2/` in the scratchpad.

## 0. Headline findings

1. **Primary records from both sides are open and machine-readable for all three v1 battles.**
   They are US action reports on HyperWar, the 1947 English translation of
   Nagumo's own Midway report, the Johnston and Hoel action reports on the
   survivors' association site, and the Japanese 戦闘詳報 (*sentō shōhō*, action
   reports) catalogued in JACAR. JACAR can be searched by keyword with
   `?kw=` (§8.2).
2. **Every clock time needs its zone, or the battles will be wrong by hours.**
   This is the biggest data risk R2 found. Japanese records keep Tokyo time
   (UTC+9) and Tokyo dates. At Midway the Midway-based US forces kept
   zone +12 (UTC−12), **but the US carriers kept zone +10**. Morison IV, p. 101
   says so, and so do the reports themselves: CTF 16 writes "All times given
   are zone plus ten, which is two hours ahead of Midway time", and Enterprise
   logs "1222 VSB commenced dive bombing attack" (all opened). So one dive has
   three clock readings: 10:22 Midway local, 07:22 JST the next day (Kaga TROM,
   opened), and 12:22 in the US carrier reports. At Guadalcanal US reports use
   zone −11 (UTC+11), two hours ahead of the Japanese (Morison V, opened). At
   Samar both sides' clocks agree: US "Item" (zone −9) is UTC+9, the same as
   JST (Hoel and Johnston action
   reports, opened). The schema must carry a zone on every time (§16, D1).
3. **The Japanese official history is online and free to read.** All the
   relevant 戦史叢書 (Senshi Sōsho) volumes open in the NIDS viewer:
   10 ハワイ作戦, 12 マリアナ沖海戦, 17 沖縄方面海軍作戦, 43 ミッドウェー海戦,
   49/83/96 南東方面海軍作戦, 37/56 海軍捷号作戦, 102 陸海軍年表. Their tables of
   contents were read; the chapters for each v1 battle are named in §8.1.
   Volume 17 carries a fold-out chart, 付図第三 軍艦大和行動図 (Yamato's track).
4. **JACAR holds the original Japanese action reports for all three v1 battles,
   and some later ones.** Among them: Kaga's own report with her bombers' track
   and hit charts (C08030040500), the Nagumo force report (C08030023600–24100),
   Atago's and Inazuma's reports for the night of 14–15 November
   (C08030745200, C08030752400), and Cruiser Division 7's Samar report with
   track and battle charts (C08030037100). Also Tone's gunnery lessons from
   Samar (C08030568700) and the Ten-Gō report of Yamato and Destroyer
   Squadron 2 (C08030103100). **But NIDS-held images may not be republished
   without asking NIDS** (JACAR terms, opened). The app can cite them and draw
   from the facts in them, but cannot show the scans.
5. **Morison's 15 volumes are in copyright, and renewals were filed.** R2 found
   the renewals in the Catalog of Copyright Entries (Gutenberg transcription,
   opened). Vol. I was renewed in 1975 (R600933) and vol. III in 1976
   (R637305). Vols. IV and V were renewed in 1977 (R657783, R657781) and
   vol. II in 1977 (R670368). Full scans of all fifteen sit on archive.org as
   "opensource" uploads (2025) with no licence stated. Read them for facts,
   cite them, never copy text or maps, and do not link the uploads from the app.
6. **The Naval War College analyses are reachable even though NHHC is not.**
   Midway (1948) and Coral Sea (1947) are open on archive.org, Savo (1950) and
   Leyte (vols. I, II, III and V) on HyperWar. **No NWC volume covers Samar**:
   HyperWar has no vol. IV, and R2 believes it was never published (*verify*).
   Samar rests on the action reports, Morison XII, NWC vol. III up to
   23 October, and the Japanese side.
7. **The USSBS interrogations give a Japanese witness for each v1 battle.** On
   HyperWar: Midway Nav 1 (Amagai, Kaga's air officer), 2 (Kawaguchi, Hiryū),
   4 (Aoki, captain of Akagi) and 39 (Ōhara, executive officer of Sōryū).
   Guadalcanal Nav 33 (Tokuno, **Kirishima's assistant gunnery officer**) and
   46 (Yunoki, Hiei). Samar Nav 9 (Kurita), 35 (Koyanagi) and 41 (Ōtani).
   Ten-Gō Nav 32 (Miyamoto). Nav 83 and 106 are listed in the index but answer
   404.
8. **The loss figures disagree, and the disagreements are documented.**
   - Japanese dead at Midway: 2,500 (NWC 1948, opened) or 3,057 (Parshall and
     Tully, via Wikipedia). Nagumo's own report gives about 2,155 for the four
     carriers.
   - South Dakota: 38 killed or missing and 60 wounded (Morison V, opened), or
     39 killed and 59 wounded (Frank, via Wikipedia).
   - Kirishima: 9 sixteen-inch hits (Morison V and the USSBS) or about 20
     (Lundgren, via the TROM).
   - Johnston: 186 lost of 327 (Morison XII), or "152" lost with 144 survivors
     (association page). Her own report counts 141 survivors.
   - Kaga's sinking position differs by 3′ of latitude between Nagumo's report
     and her TROM.
   §12 tables them all.
9. **combinedfleet.com TROMs are rich but copyrighted compilations.** They give
   minute-level times, sinking positions and loss counts, with notes that weigh
   the sources (Kaga, Kirishima, Yamato, Kumano opened). Each carries its
   authors' ©. Use them as finding aids and tellings, not as the record.
10. **Several hosts are walled.** history.navy.mil fails TLS (curl error 60, and
    WebFetch 503). NZETC redirects to an archive behind Incapsula. Also out of
    reach: DTIC (403), CMH history.army.mil (403), usmcu.edu (403), navsource
    (502), the Wayback Machine (connection reset), and the NHHC mirror in
    France (connection reset). Wikipedia's API, the REST API and the NDL Search
    API answer 429. **Wikipedia's `action=raw` and plain article pages answer
    200**, and the NDL Lab API (`lab.ndl.go.jp/dl/api`) answers 200.
11. **Reconstructed front lines must not be traced from Commons maps.** The
    familiar map of the Japanese Empire at its greatest extent
    (`File:Japanese_Empire2.png`) is CC BY-SA 3.0. A tracing would be a
    derivative and carry ShareAlike. Public-domain US government charts exist
    for the same lines: USSBS *Campaigns*, the Green Books and the NWC
    diagrams.

## 1. Method

- Read the brief, the Hawaiian `RESEARCH.md` §§1–2, `ACCESS.md`, and the
  `sources.json` schema in `DATA.md` §4 (`id, title, author, year, url,
  access, opened, read, note`, plus `tertiary`).
- Probed each host with `curl` (range requests for PDFs). Read HTML and
  catalogue pages. Streamed full-text OCR files from archive.org through
  `grep` without keeping them. One exception: a 32 MB Gutenberg renewals file
  was fetched, grepped and deleted.
- Searched JACAR, archive.org (`advancedsearch.php`), the NIDS viewer and the
  NDL Lab API directly. Used WebSearch as a finding aid only. Nothing in this
  file rests on a search snippet unless it says so.
- Wikipedia (en and ja) was read only as a tertiary finding aid, through
  article HTML and `action=raw`.

## 2. Reachability at a glance

| host | status (2026-10-22) | what it gives this project |
| --- | --- | --- |
| www.ibiblio.org/hyperwar | 200/206; directory listings 403; some index links dead (404) | the US official corpus, transcribed; USSBS; Japanese Monographs; NWC Savo and Leyte PDFs; War Damage Reports |
| www.ibiblio.org/pha | 206 | Pearl Harbor Attack hearings and JM-97 |
| archive.org (search, metadata, `_djvu.txt`) | 200/206 | NWC Midway and Coral Sea; USSBS *Campaigns* and *Summary*; ONI 41-42, ONI 222-J, TAIC No. 1, FM 30-50/30-58 (all PD); Morison (in copyright); print works (lending only) |
| web.archive.org (Wayback) | connection reset | nothing; dead sites cannot be recovered from here |
| www.nids.mod.go.jp/military_history_search | 200 | 戦史叢書 viewer, per-page PDF download by POST |
| www.jacar.archives.go.jp | 200 | catalogue with OCR excerpts; keyword search `?kw=`; images (terms §8.2) |
| www.combinedfleet.com | 200 (http → https 301) | TROMs |
| www.awm.gov.au and its S3 PDFs | 200/206 | Australian official histories, per-chapter PDFs |
| nzetc.victoria.ac.nz | 301 to ndhadeliver.natlib.govt.nz, which serves an Incapsula challenge | NZ official histories: **not reachable** |
| ussjohnston-hoel.com (http) | 200 (https name mismatch) | Johnston and Hoel action reports, transcribed |
| www.bosamar.com | 200 but a server error page ("Zend Guard Loader is not installed") | the Taffy 3 reports it used to host: **lost from here** |
| destroyerhistory.org | 200 (some pages 500) | DANFS-style pages; no reports found |
| www.navweaps.com | 200/206 | Lundgren's Guadalcanal and Kirishima analyses (PDF) |
| en.wikipedia.org: `action=raw`, article HTML | 200 (intermittent 429) | tertiary finding aid |
| en.wikipedia.org: `api.php`, `rest_v1` | 429 even with a User-Agent | none |
| ja.wikipedia.org article HTML | 200, then 429 after about 10 calls | names and readings |
| commons.wikimedia.org HTML | 200, intermittent 429; API 429 | licence of maps |
| dl.ndl.go.jp | 200, but a JavaScript app | none directly |
| lab.ndl.go.jp/dl/api | 200 | search of NDL's digitised, mostly public-domain wartime books |
| ndlsearch.ndl.go.jp/api/opensearch | 429 (concurrent-access limit) | none |
| www.gutenberg.org | 200 | Catalog of Copyright Entries renewals, 1950–77, transcribed |
| exhibits.stanford.edu/copyrightrenewals | JavaScript challenge | none |
| history.navy.mil (NHHC) | curl: TLS error 60 ("unable to get local issuer certificate"); WebFetch: 503 | none (H-Grams, DANFS, NHHC reading room) |
| apps.dtic.mil | 403 | none (NWC Midway copy) |
| usnwcarchives.org digital object | 404 to curl | none |
| bibliotheques-numeriques.defense.gouv.fr | connection reset | none |
| history.army.mil, usmcu.edu, fold3.com, ww2db.com | 403 | none (HyperWar mirrors the Green Books and USMC works) |
| navsource.org | CONNECT 502 | none |
| usswashington.com | CONNECT 502 / DNS failure | none (Washington's action report) |
| researcheratlarge.com | TLS: self-signed certificate | none |
| catalog.archives.gov | 200, but a single-page app; no keyless API found | none |
| www.yasukuni.or.jp | 206 | home page only; no online document collection found |

## 3. Time: the rule every record needs

| battle | US clock | Japanese clock | difference | source (opened) |
| --- | --- | --- | --- | --- |
| Midway | Midway-based forces: zone +12 (UTC−12), West Longitude date. Carriers and task forces: zone +10 (UTC−10). Enterprise: "times throughout are Zone plus 10"; CTF 16: "two hours ahead of Midway time" | Tokyo time, zone −9 (UTC+9), East Longitude date | JST = Midway local + 21 h (clock −3 h, date +1). Carrier clocks run 2 h ahead of Midway local | Morison IV p. 101; CTF 16 and Enterprise reports (HyperWar); Nagumo 1947 footnote ("all times are in Tokyo time, Plus 9"); Kaga TROM ("subtract three hours but advance one day") |
| Guadalcanal | zone −11 (UTC+11) | Tokyo, UTC+9 | Japanese clock is 2 h behind | Morison V ("Tokyo Zone, two hours earlier than the time used in this volume"); Inazuma's report runs 十一月十四日二〇〇〇 to 十一月十五日〇一〇〇, i.e. 2200–0300 local |
| Samar | "Item", zone −9 (UTC+9) | Tokyo, UTC+9 | none | Hoel AR ("All times mentioned herein are Item (Zone -9), and from memory"); Johnston AR ("zone minus 9 time") |
| Leyte submarines | "How", zone −8 | — | 1 h | Morison XII (submarine times corrected to Item) |
| Savo | (NWC gives a zone-time page) | — | — | NWC Savo 1950 table of contents, p. xxiii "Zone Time" |

Two more cautions:

- **Times "from memory".** Hoel's report says its times are from memory: "All
  records, accounts, logs, publications and papers were lost with the ship."
  Johnston's log went down with her: "it is impossible to reconstruct an
  accurate track" (Morison XII). Kaga's report was compiled from survivors'
  "fragmentary memories" (C08030040500, opened: 本報告、生存者ノ断片的記憶ヲ整理調製セルモノ).
- **Secondary works convert silently.** The TROMs use local time for Midway
  (they say so) and seem to use US local time at Guadalcanal (*verify*: no
  statement on the page). Morison converts everything to one zone per volume.

## 4. HyperWar (ibiblio): what it holds for this project

HyperWar is a volunteer transcription of US (and some Allied and Japanese)
official works. Almost all of it is US government work, so it is in the public
domain in the US. The transcriptions are faithful but carry typos. Large items
are scanned PDFs. Entry pages:
<https://www.ibiblio.org/hyperwar/PTO/index.html> (200) and the theatre pages
`PTO/TideTurns`, `PTO/Hell`, `PTO/Philippines`, `PTO/FinalBattle`,
`PTO/EastWind`, `PTO/Marianas` (all 200). Directory listings answer 403. Some
links on the index pages are dead (404), so R2 proved each item below by its
own URL.

### 4.1 ONI Combat Narratives

ONI published these 1943–44 as confidential interim histories. Each says it
was "hastily gathered" and contains "certain inaccuracies" (Midway narrative,
opened). Index pages on `USN/index.html` (200):

| battle | URL (`https://www.ibiblio.org/hyperwar/USN/…`) | status |
| --- | --- | --- |
| Java Sea, Jan–Feb 1942 | `USN-CN-Java/index.html` | listed |
| Early raids, Feb–Mar 1942 | `USN-CN-Raids/index.html` | listed |
| Coral Sea, 4–8 May 1942 | `USN-CN-Coral/index.html` | 206 |
| **Midway, 3–6 June 1942** (ONI, 13 March 1943) | `USN-CN-Midway/index.html` | 206, opened (front matter) |
| Landing in the Solomons, 7–8 Aug 1942 | `USN-CN-Solomons/index.html` | listed |
| Savo Island, 9 Aug 1942 | `USN-CN-Savo/index.html` | 206 |
| Eastern Solomons, 23–25 Aug 1942 | `USN-CN-ESols/index.html` | listed |
| Cape Esperance, 11 Oct 1942 | `USN-CN-Esperance/index.html` | listed |
| Santa Cruz, 26 Oct 1942 | `USN-CN-SantaCruz/index.html` | 206 |
| **Battle of Guadalcanal, 11–15 Nov 1942** (Colin G. Jameson, ONI 1944; NHC reprint 1994; Solomon Islands campaign no. 6) | `USN-CN-Guadalcanal/index.html` | 206, opened (front matter) |
| Tassafaronga, 30 Nov 1942 | `USN-CN-Tassafaronga/index.html` | listed |
| Aleutians, June 1942–Aug 1943 | `USN-CN-Aleutians.html` | listed |

There is **no ONI narrative for Leyte, Samar, the Philippine Sea or Ten-Gō**:
the series ends in 1943.

### 4.2 USSBS, *Interrogations of Japanese Officials* (2 vols, 1946; publication number OPNAV-P-03-100 is *verify*)

Index: <https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/index.html> (200).
Each page is `IJO-<Nav no.>.html`. The headers of the pages below were opened
and give the interviewee's post.

| Nav no. (USSBS no.) | subject | interviewee (as transcribed) | battle |
| --- | --- | --- | --- |
| 1 (6) | Battle of Midway | Capt. Amagai Takahisa (transcribed "AMAGI"), air officer of **Kaga** | Midway |
| 2 (11) | Hiryū at Midway | Capt. Kawaguchi Susumu, air officer of Hiryū | Midway |
| 4 (23) | Battle of Midway | Capt. Aoki Taijirō, captain of **Akagi** | Midway |
| 39 (165) | Damage to Sōryū | Capt. Ōhara H., executive officer of **Sōryū** | Midway |
| 60 (252) | Transports at Midway; Tassafaronga | Capt. Toyama Yasumi, chief of staff, DesRon 2 | Midway (and later) |
| 66 (295) | Midway, Eastern Solomons, Philippines | Capt. Tsuda Hiroaki (navigator of Hyūga, then of **Yamato**, Feb 1943–Feb 1945) and others | Samar, later |
| 13 (65) | Pearl Harbor, Midway, Solomons | (not opened) | Midway |
| 64 (258) | Japanese naval planning after Midway | (not opened) | context |
| **33 (138)** | Guadalcanal, Midway, Vila | Lt Cdr Tokuno Horishi, **assistant gunnery officer of Kirishima** at Guadalcanal and Midway | **Guadalcanal** |
| 46 (195) | Guadalcanal, Midway, Munda, Rabaul | Lt Cdr Yunoki S., main-battery director on **Hiei** | Guadalcanal (first night) |
| 16 (75) | Eastern Solomons, Santa Cruz, Solomons | (not opened) | Santa Cruz |
| 61 (255) | Savo Island | (not opened) | Savo |
| 3 (32) | Philippine Sea | Vice Adm. Ozawa Jisaburō | Philippine Sea |
| **9 (47)** | Philippine Sea; Leyte Gulf | Vice Adm. **Kurita Takeo**, C-in-C Second Fleet | **Samar** |
| **35 (149)** | Battle off Samar | Rear Adm. Koyanagi Tomiji, Kurita's chief of staff | **Samar** |
| **41 (170)** | Battle off Samar | Cdr Ōtani Tonosuke, operations officer, Second Fleet | **Samar** |
| 55 (227) | Leyte Gulf | Vice Adm. Ozawa | Leyte |
| 58 (233) | Surigao Strait | Cdr Mori Kōkichi, torpedo officer, Shima's staff | Surigao |
| 79 (390) | Surigao Strait | Cdr Nishino Shigeru, captain of Shigure | Surigao |
| 29 (113) | Pearl Harbor, Philippine Sea, Leyte | Capt. Fuchida Mitsuo | Pearl Harbor |
| 6 (40) | Pearl Harbor; kamikaze | (not opened) | Pearl Harbor (card only) |
| **32 (133)** | Attack on the Yamato group, 7 April 1945 | Cdr Miyamoto T., staff officer, Second Fleet | **Ten-Gō** |
| 36 (150), 69 (345) | Cape Engaño | (not opened) | Leyte |
| 83 (407), 106 (464) | Savo/Midway/Leyte; Cape Esperance/Coral Sea/Santa Cruz | listed in the index | **404** |

The interrogations were done in late 1945 (*verify* dates per page), through
interpreters and from memory. They are tellings, not logs.

### 4.3 USSBS, *The Campaigns of the Pacific War* (Naval Analysis Division, 1946)

HTML on HyperWar, <https://www.ibiblio.org/hyperwar/AAF/USSBS/PTO-Campaigns/index.html>
(200): 16 chapters, including 2 Pearl Harbor, 4 Coral Sea, 5 Midway (206),
7 Solomons, 10 Marianas, 12 Philippines, 14 Okinawa. The full scan, with its
charts and orders of battle, is open on archive.org:
<https://archive.org/details/campaignsofpacif46unit> (open, Boston Public
Library government documents). US government work, public domain. **The
charts are the best public-domain base for keyframe fronts and fleet tracks**
(*verify* chart coverage; R2 did not open the scan's plates).

### 4.4 Japanese Monographs (written for GHQ/SCAP, 1945–60)

Index: <https://www.ibiblio.org/hyperwar/Japan/Monos/index.html> (200, 213
rows). Many relative links are dead (404). The absolute
`…/Japan/Monos/pdfs/…` links work. The monographs were written by former
officers, often from memory, because "the enormous destruction by aerial
bombardment and fire has practically wiped out the Tokyo records" (JM-93
preface, opened). The English is a US translation (ATIS). Status in the US
is *verify*: the translations are US Army work, but the authors were Japanese.

| no. | title | covers | file | status |
| --- | --- | --- | --- | --- |
| **93** | Midway Operations, May–June 1942 | Midway (naval) | HTML `pdfs/JM-93_MidwayOperations,May-June42/JM-93.htm`; PDF 229 MB | 206; HTML opened (preface) |
| **98** | Southeast Area Naval Operations, Part I | Solomons and Guadalcanal reinforcement (1942–43) | PDF `pdfs/JM-98_SEAreaNavalOps/JM-98.pdf`, 138 MB | 206 |
| 99 | SE Area Naval Ops, Part II (Feb–Oct 1943) | Central Solomons | PDF | listed |
| 121, 122 | Outlines of SE Area Naval Air Ops, Parts II–III | air over Guadalcanal, Aug 1942–Jun 1943 | relative links | 404 |
| **84** | Philippines Area Naval Operations, Part II (Oct–Dec 1944) | Leyte Gulf surface actions, including Samar | PDF `pdfs/JM-84/JM-84.pdf`, 464 MB | 206 |
| 90, 91 | The "A-Go" Operations (and log) | Philippine Sea | HTML `pdfs/JM-90/JM-90.htm` (222 KB), PDF 143 MB | 206 |
| **83** | Okinawa Area Naval Operations (Jan–Jun 1945) | Ten-Gō, kikusui | PDF `pdfs/JM-83/JM-83.pdf`, 480 MB | 206 |
| 86 | 5th Air Fleet Operations (Feb–Aug 1945) | kamikaze record (card only) | PDF | listed |
| 97 | Pearl Harbor Operations: General Outline of Orders and Plans | Pearl Harbor | <https://www.ibiblio.org/pha/monos/097/index.html> | 206 |
| 113 | Task Force Operations (Nov 1941–Apr 1942) | Pearl Harbor to the Indian Ocean | relative link | 404 |
| 116 | The Imperial Japanese Navy in World War II | order of battle and reorganisations, 1941–45 | PDF `pdfs/JM-116/JM-116.pdf`, 5.9 MB | 206 |

### 4.5 US Army "Green Books" and campaign brochures

From <https://www.ibiblio.org/hyperwar/USA/index.html> (200). For this
project they give the land front and the context, not the sea fights.
- Miller, *Guadalcanal: The First Offensive* (1949): `USA/USA-P-Guadalcanal/` (206).
- Cannon, *Leyte: The Return to the Philippines* (1954): `USA-P-Return/` (206).
- Appleman et al., *Okinawa: The Last Battle* (1948): `USA-P-Okinawa/` (206).
- Morton, *Strategy and Command: The First Two Years* (1962): `USA-P-Strategy/` (206).
- Also listed: *The Fall of the Philippines*, *Victory in Papua*, *CARTWHEEL*,
  *Seizure of the Gilberts and Marshalls*, *Campaign in the Marianas*, *The
  Approach to the Philippines*, *Triumph in the Philippines*.
- The short CMH campaign brochures are there too (`USA-C-…`).

The CMH host itself (history.army.mil) answers 403. **Green Book maps are US
government work and public domain**: a base for fronts on land.

### 4.6 USMC

On <https://www.ibiblio.org/hyperwar/USMC/index.html> (200):
- The five-volume *History of U.S. Marine Corps Operations in World War II*.
  Vol. I Part V is "Decision at Midway", `USMC/I/USMC-I-V-1.html` (206).
- Monographs: Heinl, *Marines at Midway* (1948), `USMC-M-Midway.html` (206);
  Zimmerman, *The Guadalcanal Campaign* (1949), `USMC-M-Guadalcanal.html` (206).
- The 1990s commemorative series (`USMC-C-…`): *Infamous Day* (Pearl Harbor),
  *First Offensive* (Guadalcanal), *Time of the Aces* (Solomons air) and
  *The Final Campaign* (Okinawa).

usmcu.edu answers 403. All are US government work.

### 4.7 Action reports and damage reports hosted

| battle | document | URL (`https://www.ibiblio.org/hyperwar/…`) | status |
| --- | --- | --- | --- |
| Midway | CINCPAC (Nimitz) to COMINCH, *Battle of Midway*, A16 01849, 28 June 1942, with its composite track | `USN/rep/Midway/Midway-CinCPac.html` | 206, opened (head) |
| Midway | CTF 16 report; ComCruPac; ComDesRon 6; interrogation of prisoners, 9 June 1942 | `USN/rep/Midway/Midway-Carriers.html`, `-Cruisers.html`, `-DesRon6.html`, `-Interrogations.html` | 206 |
| Midway | Yorktown, Enterprise and Hornet reports; Ens. Gay's narrative | `USN/ships/logs/CV/cv5-Midway.html`, `cv6-Midway.html`, `cv8-Midway.html`, `cv8-EnsGay.html` | 206 |
| Midway | Japanese prisoners' interrogation; COMINT studies | `PTO/Magic/COMINT-Midway.html` | 206 |
| Midway | **Nagumo's report, *The Japanese Story of the Battle of Midway*, ONI Review vol. 2 no. 5, May 1947** (tr. Fred Woodrough Jr.; part IV missing) | `Japan/IJN/rep/Midway/Nagumo/index.html` | 200, **opened** (§4.8) |
| Midway | BuShips War Damage Report, Yorktown | `USN/rep/WDR/` (index 206) | listed |
| Guadalcanal | BuShips War Damage Report, **South Dakota, gunfire damage, 14–15 Nov 1942** | `USN/rep/WDR/U.S.S.%20SOUTH%20DAKOTA%20(BB-57),%20GUNFIRE%20DAMAGE%20-%20…%201942.pdf` (0.8 MB) | 206 |
| Guadalcanal | WDRs: San Francisco, Sterett (13 Nov) | same index | listed |
| Guadalcanal | **Washington's (BB-56) and Lee's (CTF 64) reports** | not found on HyperWar; usswashington.com unreachable; NHHC unreachable | **not found** |
| Samar | CTF 77 (Kinkaid), *Preliminary Action Report … Leyte Gulf and off Samar*, 18 Nov 1944 | `USN/rep/Leyte/TF-77-Leyte.html` | 206, opened (head) |
| Samar | COMINCH Secret Information Bulletin no. 22, *Battle Experience: Battle for Leyte Gulf*, with a time table | `USN/rep/Leyte/BatExp/index.html` | 206, index opened |
| Samar | **CTU 77.4.3 (C. Sprague) special report and CTG 77.4 report** | not found on HyperWar; bosamar.com broken | **not found** |
| Samar | Johnston and Hoel action reports | on ussjohnston-hoel.com, not HyperWar (§9.4) | opened |
| Leyte/Surigao | TF 34 report; TG 79.11 night action; West Virginia | `USN/rep/Leyte/TF-34-Leyte.html`, `TG-79.11-Surigao/index.html` (206), `USN/ships/logs/BB/bb48-Surigao.html` | 206 |
| Okinawa/Ten-Gō | COMINCH *Capture of Okinawa*; **TF 58 report, 14 March–28 May 1945** | `USN/rep/Okinawa/Cominch/index.html`, `USN/rep/Okinawa/TF58/index.html` | 206 |
| Pearl Harbor | USN action reports index | `USN/rep/Pearl/index.html` | 206 |
| Coral Sea | TF 11, TU 17.2.2, Lexington, Yorktown, Sims, Neosho reports | from `PTO/TideTurns` | listed |
| Savo | Quantock, *Disaster at Savo Island*; NWC analysis | `USN/rep/Savo/Quantock/`, `USN/rep/Savo/NWC/` | 206 |

### 4.8 *The Japanese Story of the Battle of Midway* (ONI Review, May 1947)

Opened and searched in full. It is the action report of the First Air Fleet
(Nagumo), dated 15 June 1942, translated under the USSBS Naval Analysis
Division. ONI's introduction says part IV is missing. The same document's
originals are in JACAR (C08030023600–24100, §8.2). What it gives:

- **Times**, minute by minute, from the force's log and signals, in Tokyo
  time. For example, Akagi was hit at "0726" (10:26 Midway local).
- **Positions**: course and positions of the force; sinking positions. "Kaga's
  sinking: 30-20.3N, 179-17.2W" (her TROM gives 30-23.3′N, 179-17.2′W). For
  Sōryū (*verify*): "sank at 1613 … Position: 30-42.5N, 178-37.5W".
- **Search plans**, launch times, bomb loads, the weather over the targets.
- **A table of personnel killed by carrier**: Akagi 221; Kaga printed as
  "1 800"; Hiryū 416; Sōryū 718.
- **Claims** that are wrong, and the translator flags some in footnotes.

US government publication, public domain. HyperWar URL as above. NHHC's copy
(history.navy.mil) is unreachable.

### 4.9 Naval War College analyses (Bates)

| study | where | status | note |
| --- | --- | --- | --- |
| *The Battle of the Coral Sea, May 1 to May 11 inclusive, 1942: Strategical and Tactical Analysis* (1947; NAVPERS 91050, per a search snippet: *verify*) | archive.org `battleofcoralsea00nava` (open, PDF and text); also `ibiblio.org/hyperwar/USN/CoralSeaAAR/CoralSeaAAR20.pdf` (10.5 MB, 206; identity *verify*) | open | DTIC copy 403 |
| ***The Battle of Midway including the Aleutian Phase, June 3 to June 14, 1942: Strategical and Tactical Analysis* (1948)** | archive.org `battleofmidwayin00bate` (open) | **opened** (App. III losses, contact reports) | DTIC ADA003054: 403. NWC archive digital object: 404 to curl. OCR is rough |
| *The Battle of Savo Island, August 9th, 1942: Strategical and Tactical Analysis, Part I* (Bates and Innis, 1950) | HyperWar `USN/rep/Savo/NWC/index.html` (HTML, 206) and `PTO/Hell/NWC-Savo.pdf` (23 MB, 206) | contents opened | has a zone-time page (p. xxiii) |
| *The Battle for Leyte Gulf, October 1944: Strategical and Tactical Analysis*, vols. I, II, III, V (1953–58, *verify* years) | HyperWar `USN/rep/Leyte/NWC-1.pdf` (28.6 MB), `NWC-2.pdf` (30.3 MB), `NWC-3.pdf` (86.4 MB), `NWC-5.pdf` (58.0 MB, Surigao); `OpAnal.pdf` (1.5 MB) | all 206 | vol. III ends at 1042, 23 October; **no Samar volume** |

All are US government work and public domain.

## 5. archive.org

Searched with `advancedsearch.php`. "Lend" means controlled digital lending
(collections `inlibrary`/`printdisabled`): not readable by a script, and not
a licence.

### 5.1 Morison, *History of United States Naval Operations in World War II* (Little, Brown, 1947–62)

- **Full scans of all 15 volumes are on archive.org as `husno-volume-…`
  uploads.** One user uploaded them in January 2025, in the "opensource"
  collection, with no licence or rights field. Each has a `_djvu.txt` full
  text, 650–950 KB. R2 streamed the texts of vols. IV, V and XII through
  `grep`.
- Lending copies of most volumes exist too (for example `struggleforguada0005unse_g9p1`).
- **Copyright.** Vol. IV's title page reads "COPYRIGHT 1949, BY SAMUEL ELIOT
  MORISON / ALL RIGHTS RESERVED". **Renewals were filed** (Catalog of
  Copyright Entries, read in the Gutenberg transcription *U.S. Copyright
  Renewals 1950–1977*, <https://www.gutenberg.org/ebooks/11800>):

| vol. | title | original reg. | renewal |
| --- | --- | --- | --- |
| I | *The Battle of the Atlantic* | © 20 Nov 1947, A19063 | Morison, 24 Feb 1975, **R600933** |
| II | *Operations in North African Waters* | © 1 Mar 1950 (new matter), A41728 | executors A. P. Loring and W. Sidney Felton, 22 Aug 1977, **R670368** |
| III | *The Rising Sun in the Pacific, 1931–April 1942* | © 9 Sep 1948, A25234 | executors, 2 Aug 1976, **R637305** |
| IV | *Coral Sea, Midway and Submarine Actions* | © 20 Sep 1949, A36184 | executors, 25 Feb 1977, **R657783** |
| V | *The Struggle for Guadalcanal* | © 23 Nov 1949, A38698 | executors, 25 Feb 1977, **R657781** |
| VI–XV | 1950–62 | — | due 1978–90; recorded in the Copyright Office's online catalogue, **not checked** (*verify*). The executors renewed every early volume, so assume the rest were renewed too |

So all of Morison should be treated as in copyright in the US (to 95 years
from publication). **Recommendation:** cite as `print`, with the lending
record as `url`. Say in the note where it was read. Never reproduce text,
maps or track charts. Do not link the uploads.

What Morison gave R2, with page numbers:
- **Vol. IV, p. 101:** the zone rule for Midway (§3). The index has "Jap.
  casualties, 140n".
- **Vol. V:** South Dakota "42 large-caliber hits, 38 men killed or missing
  and 60 wounded". Kirishima: "9 out of 75 sixteen-inch shells from
  Washington scored, as did about 40 fast-shooting 5-inchers".
- **Vol. XII:**
  - Johnston: "From her complement of 327, only 141 were saved. Of the 186
    lost …".
  - Roberts: "3 officers and 86 men were killed, missing or died of wounds".
  - Hoel sank at 0855. Morison doubts the position in her report.
  - "Johnston's on heavy cruiser Kumano, flagship of Crudiv 7, at 0727".
    Morison says Kurita claimed it was the only destroyer torpedo hit.
  - The Johnston report "was written … by Lt. R. C. Hagen … senior surviving
    officer".

### 5.2 Other works on archive.org

| work | identifier | access | licence | note |
| --- | --- | --- | --- | --- |
| Fuchida and Okumiya, *Midway: The Battle That Doomed Japan* (USNI 1955; 1958, 2001 printings) | `midwaybattlethat0000fuch`, `bwb_S0-EKQ-212`, `midwaybattlethat0000fuch_h9r8` | **lend** | in copyright (1955; renewal *verify*) | Fuchida's account is disputed on the "five minutes" and the state of the deck: a telling only |
| **ONI 41-42, *Japanese Naval Vessels*** (6 Nov 1942) | `oni-4142` | open | Public Domain Mark | recognition silhouettes: base for the low-poly kits (§16, D8) |
| **ONI 222-J, *The Japanese Navy*** (9 Aug 1945) | `ONI222JTheJapaneseNavy` | open | PDM | late-war classes and silhouettes |
| ONI 208-J (rev.), *Japanese Merchant Ships Recognition Manual* (1945) | `oni-208-j` | open | PDM | transports at Guadalcanal |
| **ONI 222-US, *United States Naval Vessels*** | — | **not found** | — | FM 30-50 (1941), US vessels, is open (`Fm30-50`, PDM) but predates war construction |
| FM 30-58, *Identification of Japanese Naval Vessels* (1941) | `Fm30-58`, `Fm30-58-nsia` | open | PDM | pre-war |
| **TAIC Manual No. 1, *Japanese Aircraft Performance and Characteristics*** (June 1945) | `japanese-aircraft-performance-characteristics-taic-manual` | open | PDM | A6M, D3A, B5N, B6N, E13A data |
| TAIC 1-665 (1944); TAIC reports in the CIA Reading Room | `taic-1-665-i-04092019`; `cia-readingroom-document-cia-rdp81-00706r000100070151-7` | open | US gov | — |
| *Jane's Fighting Ships* 1944–45 | — | **not found open** | in copyright (UK; US status *verify*) | — |
| USSBS, *The Campaigns of the Pacific War* (1946) | `campaignsofpacif46unit` (open), `campaignsofpacif00unit` (lend) | open | US gov, PD | charts and orders of battle |
| USSBS, *Summary Report (Pacific War)* (1 July 1946) | `summaryreportpac00unit` | open | US gov, PD | the war in one government voice; also covers the atomic bombings (cards only) |
| USSBS, *Interrogations of Japanese Officials* (scan) | — | not found on archive.org | — | HyperWar has the text (§4.2) |
| "Japanese Naval Vessels at the End of War" (Second Demobilization Bureau, 1947) | — | **not found** | — | — |
| *Japanese Naval Vessels of World War Two as seen by U.S. Naval Intelligence* (1987 compilation) | `japanesenavalves0000unse` | lend | © 1987 | — |
| Prados, *Combined Fleet Decoded* (1995), *Islands of Destiny* (2012), *Storm over Leyte* (2016) | `combinedfleetdec0000prad`, `islandsofdestiny0000prad`, `stormoverleyteph0000prad` | lend | © | — |
| Dull, *A Battle History of the Imperial Japanese Navy* (1978) | `bwb_Y0-CIC-606` | lend | © | — |
| Field, *The Japanese at Leyte Gulf* (1947; Field was a USSBS interrogator) | `japaneseatleyteg0000jame` | lend | © 1947, renewal *verify* | — |
| Parshall and Tully, *Shattered Sword* (2005) | `shatteredswordun0000pars` | lend | © | — |
| Hornfischer, *Last Stand of the Tin Can Sailors* (2004) | `laststandoftinca00horn` | lend | © | — |
| Frank, *Guadalcanal* (1990) | `guadalcanal00fran` (lend); also an unlicensed "open" upload `B-001-001-202` | lend | © | do not use the upload |
| Evans and Peattie, *Kaigun* (1997) | `kaigunstrategyta0000evan` | lend | © | — |
| Lundstrom, *The First Team* (1984) | `firstteampacific0000lund` | lend | © | — |

## 6. Australian and New Zealand official histories

### 6.1 AWM, *Australia in the War of 1939–1945*

Open, as per-chapter PDFs on AWM's S3. Example: Gill II ch. 17 "Leyte",
<https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG1070434/document/5519718.PDF>
(3.2 MB, 206). Terms (<https://www.awm.gov.au/about/organisation/corporate/copyright>,
opened): "the text content on this website is provided under a Creative
Commons Attribution-NonCommercial 3.0 Australia (CC BY-NC 3.0 AU) license".
Items out of copyright are marked public domain. Whether the scanned books
count as "text content" or as collection items is *verify*. Australian Crown
copyright in a published work lasts 50 years from publication, so 1957–68
books would be out of copyright in Australia. US status under the URAA is
*verify*. **Recommendation: cite only.**

| volume | record | chapters that matter here |
| --- | --- | --- |
| Gill, *Royal Australian Navy, 1939–1942* (1957) | <https://www.awm.gov.au/collection/C1417313> (200) | 13 War in the Far East; 15 ABDA and ANZAC (Java Sea; HMAS Perth); 17 Prelude to Victory (*verify* scope); chapter 16 had no link |
| **Gill, *Royal Australian Navy, 1942–1945* (1968)** | <https://www.awm.gov.au/collection/C1417314> (200) | 2 Japan's First Check: Coral Sea; **5 Guadalcanal: Pacific Hinge-pin** (Savo, HMAS Canberra); 13 Pacific Drive; 16 Preface to the Philippines; **17 Leyte** (Surigao: Shropshire, Arunta; HMAS Australia); 21 Lingayen Gulf; 22 The British Pacific Fleet Joins In; 27–28 surrender |
| Wigmore, *The Japanese Thrust* (1957) | <https://www.awm.gov.au/collection/C1417309> (200) | Malaya, Singapore, Rabaul, Ambon, Timor: the 1941–42 fronts |
| McCarthy, *South-West Pacific Area – First Year: Kokoda to Wau* (1959) | <https://www.awm.gov.au/collection/C1417310> (200) | Papua, mid-1942 to March 1943: the New Guinea front |
| Dexter, *The New Guinea Offensives* (1961) | <https://www.awm.gov.au/collection/C1417311> (200) | 1943–44 New Guinea front |
| Long, *The Final Campaigns* (1963) | <https://www.awm.gov.au/collection/C1417312> (200) | Borneo, Bougainville, Aitape–Wewak, 1944–45 |
| Gillison (1962); Odgers, *Air War Against Japan* (1968 reprint) | C1417315, C1417316 (200) | RAAF |

### 6.2 New Zealand (NZETC)

**Not reachable.** `nzetc.victoria.ac.nz/tm/scholarly/tei-WH2Navy.html` answers
301 to the National Library's web archive
(`ndhadeliver.natlib.govt.nz/webarchive/20210104000423/…`), which serves an
Incapsula challenge to curl and to WebFetch. The relevant volumes, by name only:
- Waters, *The Royal New Zealand Navy* (1956, *verify*; NZHistory says 1959):
  Achilles and Leander in the Solomons; the British Pacific Fleet.
- Gillespie, *The Pacific* (1952): the 3rd Division in the Solomons.
- Ross, *Royal New Zealand Air Force* (*verify*).

A person with a browser should check whether the NLNZ archive copy opens.

## 7. Wikipedia and Wikimedia Commons (tertiary)

- **API:** `en.wikipedia.org/w/api.php` answered **429** to every request, with
  or without a descriptive User-Agent. So did `rest_v1/page/summary` and the
  Commons API. **`index.php?title=…&action=raw` (wikitext) and article HTML
  answered 200**, with occasional 429s after bursts. ja.wikipedia article HTML
  answered 200 for about ten pages, then 429. A bake tool must throttle (one
  request every few seconds), use `action=raw`, and cache.
- **Use:** finding aid only, marked `tertiary: true`, as in the Hawaiian app.
  Its battle infoboxes are the quickest map of which secondary work gives
  which number (§12). R2 read the wikitext for *Naval Battle of Guadalcanal*,
  *Battle off Samar*, *Battle of Leyte Gulf*, *Battle of the Philippine Sea*
  and *Attack on Pearl Harbor*, and the HTML of *Battle of Midway*.
  *Operation Ten-Go* redirects to *Operation Kikusui I* on en.wikipedia.
- **Commons maps and licence.** `File:Japanese_Empire2.png`, the familiar map
  of the empire at its greatest extent, is **CC BY-SA 3.0** ("Kokiri at
  English Wikipedia, modifications by Huhsunqu and Markalexander100"; opened).
  Tracing the front from it would make the front layer a derivative under
  ShareAlike. Other candidate files answered 429 or 404. **Recommendation:**
  trace keyframe fronts only from public-domain US government charts:
  - USSBS *Campaigns of the Pacific War* plates;
  - Green Book and USMC maps;
  - NWC diagrams;
  - CINCPAC's composite Midway track.

  Cite each chart in the front's `sources`. Use Commons only to find which
  chart a line came from. (Commons does host the five-volume USMC history and
  other PD scans as PDFs, which a search confirmed.)

## 8. The Japanese side

### 8.1 戦史叢書 (*Senshi Sōsho*, War History Series), NIDS

- Viewer: `https://www.nids.mod.go.jp/military_history_search/SoshoView?kanno=NNN`
  (200 for every volume tried). Notices on the search page (opened) say the
  series went online in stages: 10 volumes on 2018-06-08, 40 on 2018-09-10,
  53 more on 2018-12-14. Each page has a table of contents. A form POSTs a
  page range for download (PDF). © line on the viewer: "© 2016 The National
  Institute for Defense Studies". No reuse terms were found on the site.
  The list PDF linked from the page
  (`contents/information/senshi_sousho_list.pdf`) answers 404.
- Published 1966–80 by 朝雲新聞社 (Asagumo Shinbunsha) for the Defence Agency.
  It is a Japanese government work and in copyright in Japan (the term for
  works under an organisation's name is 70 years from publication, for works
  still protected in 2018; *verify* per volume). **Cite only.** Reproducing
  pages or the fold-out charts needs permission from NIDS.
- Language: Japanese only. Reading it needs a person (§19).

| vol. | title | what matters | TOC opened |
| --- | --- | --- | --- |
| 10 | ハワイ作戦 (*Hawai Sakusen*, the Hawaii Operation) | Pearl Harbor | title |
| 12 | マリアナ沖海戦 (*Mariana-oki Kaisen*, Philippine Sea) | Philippine Sea | title |
| **17** | 沖縄方面海軍作戦 (*Okinawa Hōmen Kaigun Sakusen*) | ch. 6 §3 天一号作戦発動; ch. 7 菊水作戦; **ch. 10 §1 海上特攻隊（大和部隊）の沖縄突入作戦** (Ten-Gō); **付図第三 軍艦大和行動図** (Yamato's track); 付表第二, the kamikaze list (card use only) | yes |
| 29 | 北東方面海軍作戦 | Aleutians | title |
| 37 | 海軍捷号作戦〈1〉台湾沖航空戦まで | Shō-gō planning; the Formosa air battle | title |
| **43** | ミッドウェー海戦 (*Middowē Kaisen*) | ch. 5 機動部隊の航空決戦（その一）, which ends with §9 空母機来襲、第二次防空戦闘、空母三隻被爆 (**the dive at 10:20**); ch. 6 (Hiryū's strikes, loss of all carriers); ch. 7 the US air battle; ch. 8 lessons; ch. 15 §1 被害 (losses) | yes |
| 49 | 南東方面海軍作戦〈1〉ガ島奪回作戦開始まで | Coral Sea (*verify*), Savo, Eastern Solomons | title |
| 56 | 海軍捷号作戦〈2〉フィリピン沖海戦 | **part 1 ch. 5 Ｘ日（十月二十五日）の決戦―聯合艦隊レイテ突入作戦成らず** (25 October, including Samar); ch. 6 避退戦 (withdrawal) | yes |
| 62 | 中部太平洋方面海軍作戦〈2〉 | central Pacific, from June 1942 | title |
| 71, 77, 80, 91, 93 | 大本営海軍部・聯合艦隊〈1〉–〈7〉 (selection) | the naval high command, by phase | title |
| **83** | 南東方面海軍作戦〈2〉ガ島撤収まで | ch. 6 南太平洋海戦 (Santa Cruz); **ch. 7 第三十八師団のガ島輸送と第三次ソロモン海戦** (the 38th Division convoy and the Naval Battle of Guadalcanal; the TOC OCR misreads it as ソロモソ); a fold-out general map | yes |
| 85 | 本土方面海軍作戦 | home waters | title |
| 95 | 海軍航空概史 | naval aviation | title |
| 96 | 南東方面海軍作戦〈3〉ガ島撤収後 | central and northern Solomons, 1943 | title |
| **102** | 陸海軍年表 付・兵器・兵語の解説 | **a day-by-day army and navy chronology, with a glossary of weapons and terms**: a backbone for the timeline and for Japanese terms | title |

### 8.2 JACAR (アジア歴史資料センター), with NIDS's naval records

- Record page: `https://www.jacar.archives.go.jp/das/meta/<RefCode>` (200).
  It gives title, creator, dates, size in frames, the holding archive's call
  number and, for many naval records, **an OCR or transcription of the
  opening pages** (the 内容 field). That is how R2 read the openings below.
- **Keyword search works with `https://www.jacar.archives.go.jp/aj/search?kw=<words>&rows=20`.**
  `q`, `keyword` and `kw_all` are ignored (2,481,992 hits, the whole
  catalogue). The naval action reports sit under 防衛省防衛研究所 › 海軍一般史料 ›
  ④艦船・陸上部隊 › 戦闘詳報 戦時日誌.
- Hits found (13 for 霧島 戦闘詳報, 54 for ミッドウェー 戦闘詳報, 15 for
  第三次ソロモン 戦闘詳報, 21 for 比島沖海戦 戦闘詳報):

| RefCode | record | creator, dates | battle | opened |
| --- | --- | --- | --- | --- |
| C08030023600 – C08030024100 | 機動部隊 第一航空艦隊戦闘詳報 ミッドウェー作戦 (1)–(4) | 第一航空艦隊司令部 / 海軍功績調査部, May–June 1942, 215 frames | **Midway**: the original of the Nagumo report | header; part (3) excerpt read (a signal log with times: 萩風, 舞風 ordered to stand by 加賀/蒼龍) |
| C08030040400 | ミッドウエー海戦 戦時日誌戦闘詳報 | 第十戦隊 / 第十六掃海隊 / 軍艦赤城 | Midway (Akagi) | title |
| **C08030040500** | ミッドウエー海戦 戦時日誌戦闘詳報 (2) | **軍艦加賀 / 軍艦蒼龍**, 27 May–14 June 1942, 69 frames, with figures | **Midway**: Kaga's report (加賀機密第一〇三五号, sent 2 July). Contents: situation, orders, course of action, the Midway strike, CAP, the attack on the enemy carrier, damage. Figures: 加賀艦爆隊行動圖, 合戦圖, 弾着圖 (bombers' track, battle and fall-of-shot charts). Compiled from survivors' fragmentary memories | part (opening) |
| C08030040600 | ditto | 軍艦飛龍 | Midway (Hiryū) | title |
| C08030051300 – C08030051800 | 第十一戦隊戦時日誌戦闘詳報 | 第十一戦隊司令部 (Hiei and Kirishima) | **Guadalcanal, first night (12–13 Nov)**: 戦斗詳報第三号, 第三次ソロモン海戦 | part (contents and opening) |
| C08030041800 | 第三戦隊戦時日誌戦闘詳報 (2) | 第三戦隊司令部 (Kongō, Haruna), Nov 1942–Mar 1943 | Guadalcanal context | part (opening) |
| C08030115500, C08030115700 | 第四水雷戦隊戦闘詳報 | 第四水雷戦隊 (DesRon 4), 31 Oct–18 Nov 1942 | Guadalcanal | title |
| **C08030745000 – C08030745200** | **軍艦愛宕戦闘詳報（第三次ソロモン海戦）** | 軍艦愛宕, 18 Nov 1942, 36 frames | **Guadalcanal, night of 14–15 Nov**: Atago led Kirishima. 戦斗詳報第八号: situation, plan, course of action, results, strength, merits, lessons | part (opening) |
| **C08030752400** | 駆逐艦電戦闘詳報原稿 | 駆逐艦電 (Inazuma), 15 Nov 1942 | **Guadalcanal, 2000 14 Nov – 0100 15 Nov JST**; names 霧島 in the attack group | part (opening) |
| C08030772800 | 駆逐艦夕立戦闘詳報 第3次「ソロモン」海戦 | Yūdachi | first night | title |
| C08030036500, C08030036600 | 捷号作戦戦闘詳報（比島方面決戦） | 機動部隊本隊 / 第一機動艦隊司令部 (Ozawa) | Leyte (Engaño) | title |
| **C08030037100** | 捷号作戦戦闘詳報（比島方面決戦）(6) | **第七戦隊司令部** (Kumano, Suzuya, Chikuma, Tone), 23–26 Oct 1944, 76 frames | **Samar**: contents include 第七戦隊行動図 and 菲島沖海戦第七戦隊合戦図 (track and battle chart) | part (contents) |
| C08030037600 | ditto | 第十六戦隊 / 三川軍一 | Leyte | title |
| C08030567300 – C08030567500 | 比島沖海戦軍艦榛名合戦図 | 軍艦榛名 | **Samar**: Haruna's battle chart | title |
| **C08030568700** | 軍艦利根戦闘詳報 (3) | 軍艦利根, Oct 1944, 81 frames | **Samar**: 比島沖海戦砲術戦訓 (gunnery lessons). "The enemy used smoke very effectively … made large evasive turns" | part (opening) |
| **C08030103100** | 第二水雷戦隊戦時日誌戦闘詳報 (2) | 第二水雷戦隊司令部（第二艦隊司令部）, 6–10 Apr 1945, 60 frames | **Ten-Gō**: 天一号作戦海上特攻隊（大和・2sd）戦闘詳報, 6–8 Apr 1945 | part (contents and opening) |
| C08030040000 | あ号作戦戦時日誌戦闘詳報 (3) | 軍艦千代田 / 千歳 / 翔鶴, June 1944 | Philippine Sea: a timed log in the opening | part |
| C13120088500 | 南方部隊作戦史料 … ４．第３次ソロモン海戦 | naval air units | Guadalcanal (air) | title |

- **Terms** (<https://www.jacar.archives.go.jp/aj/www/doc/>, opened): images
  may be downloaded and printed for personal use. Citations should take the
  form 「件名」JACAR（アジア歴史資料センター）Ref.C…、簿冊名（防衛省防衛研究所）.
  National Archives and Diplomatic Archives images may be reused with credit.
  But **"for material provided by NIDS, those who wish to publish images in
  publications or use them on television should contact the holding
  institution"** (防衛省防衛研究所戦史研究センター（史料閲覧室）). All the naval
  records above are NIDS's. **Recommendation:** cite by RefCode in
  `sources.json`; use the facts (times, positions, courses); never ship the
  images or traced copies of the charts without NIDS's written permission.
- **Language:** wartime Japanese in kanji and katakana (候文-style naval
  prose), partly handwritten. The OCR excerpts are imperfect. A Japanese reader
  is needed.

### 8.3 NDL (National Diet Library)

- `dl.ndl.go.jp` answers 200 but is a JavaScript app. The NDL Search
  OpenSearch API answers **429** ("同時アクセス数の上限に達したため").
- **The NDL Lab API answers 200.** Use
  `https://lab.ndl.go.jp/dl/api/book/search?keyword=…`; it indexes the
  digitised, mostly public-domain books in the NDL collection, with item links
  `https://dl.ndl.go.jp/pid/<id>`. ミッドウェー gave 219 hits, ソロモン海戦 184.
  Useful hits are **wartime publications**: 大本営海軍報道部 編『大東亜戦争海軍戦記』
  (1943, pid 1907051 and 1062911) and 『大東亞戰爭海軍作戰寫眞記録』
  (1943, pid 1880795). These are the Imperial GHQ's public claims, which a card
  could set beside the record. Copyright status *verify* (a government press
  bureau, 1943; NDL marks internet-public items as cleared).
- 戦藻録 (Ugaki's diary) is not digitised. It returned only catalogue entries.

### 8.4 Yasukuni

`www.yasukuni.or.jp` answers 206 (home page). R2 found no online document
collection there. The 靖國偕行文庫 library is visit-only, as far as R2 knows
(*verify*).

### 8.5 combinedfleet.com TROMs (Tabular Records of Movement)

- URLs: `https://www.combinedfleet.com/Kirishima.htm`, `kaga.htm`,
  `yamato.htm`, `kumano_t.htm` (http → https 301, then 200; `kirishima.htm`
  in lower case is 404). The site states no site-wide terms on its entry pages
  (`kaigun.htm` opened). **Each TROM carries its authors' copyright**:
  - Kirishima: "© 2001–2016 Bob Hackett, Sander Kingsepp and Lars Ahlberg, Rev. 19";
  - Kaga: "© 2000 Anthony P. Tully";
  - Yamato: "© 2000–2016 Bob Hackett and Sander Kingsepp, Rev. 18";
  - Kumano: "© 1997–2018 Bob Hackett and Sander Kingsepp".

  The site's authors also wrote *Shattered Sword*.
- **What a TROM gives** (all four opened at the battle dates):
  - a dated, often minute-by-minute record of the ship's movements and actions;
  - positions at key moments (sinking positions in degrees and minutes);
  - commanding officers;
  - loss and survivor counts;
  - authors' notes that weigh sources.

  Examples:
  - **Kirishima, 14–15 Nov 1942**: Washington opened fire "around 0000";
    she capsized at "0325 … 7.5 miles NW of Savo Island at 09-05S, 159-42E";
    "212 crewmen are lost", with 1,098 survivors plus captain and XO. Note 5
    sets the USSBS's 9 sixteen-inch and 40 five-inch hits and Lee's 8 against
    Lundgren's analysis of "some 20 major caliber hits and seventeen smaller".
  - **Kaga, 4 June 1942**: local and JST side by side ("1022 (0722 JST) …
    approximately 30 enemy dive-bombers overhead"); sunk "1925 (1625 JST)" at
    30-23.3′N, 179-17.2′W; "a loss of 814".
  - **Yamato, 25 Oct 1944**: "0558: Force A opens fire at escort carriers of
    Taffy 3". **7 Apr 1945**: times from 0200; first wave at 1232; magazine
    explosion at 1423; sank at 30-22N, 128-04E; "3,055 of 3,332 crewmen are
    lost"; Yahagi and four destroyers lost 1,187; US losses 10 aircraft and
    12 crewmen.
  - **Kumano, 25 Oct 1944**: "At 0724 … hit by a torpedo from destroyer USS
    JOHNSTON".
- Times: Kaga's TROM says it uses Midway local time. The others do not say;
  they appear to follow the US sources at each battle (*verify*).
- **Use:** finding aid and telling. Cite as `trom-<ship>`, access `open`,
  licence © (cite only; no copying of text).

## 9. Source sets, battle by battle

Each set lists primary records first, then official histories, then
secondary works, then tertiary.

### 9.1 The war as a whole (table, timeline, prologue)

- **Chronology:**
  - Senshi Sōsho 102 陸海軍年表 (Japanese, online, title only);
  - HyperWar *A Chronological History of the U.S. Navy in WWII* (`USN/USN-Chron.html`, 206);
  - King's reports, *U.S. Navy at War 1941–1945* (`USN/USNatWar/index.html`, 206);
  - USSBS *Summary Report (Pacific War)* (archive.org, open).
- **Campaign narrative, US government:** USSBS *Campaigns of the Pacific War*;
  Morton, *Strategy and Command*; CMH brochures. All PD.
- **Japanese naval organisation:** JM-116 (HyperWar PDF, 206). JM-117 *Outline
  of Third Phase Operations* is listed (*verify*).
- **The prologue (1931/1937–41):** HyperWar `PTO/EastWind` and `Dip/` hold the
  diplomatic documents, from the Tripartite Pact to the 14-part message.
  JM-144 to JM-152 cover political strategy before the war (Japanese
  Monographs index, HTML at `ibiblio.org/pha/monos/…`). Senshi Sōsho 91 covers
  the naval high command to the outbreak.
- **Fronts on land:** Green Books (PD maps); AWM Wigmore, McCarthy, Dexter,
  Long; Japanese Monographs (Army series).
- **The war's cost and civilians (cards only):** USSBS *Summary Report*;
  print: Dower, Ienaga, Hastings (§10).
- **Morison** I, III, XV (index): print, a telling.

### 9.2 Midway, 4 June 1942 (v1)

| role | source | status |
| --- | --- | --- |
| US primary | CINCPAC report A16 01849 (with composite track); CTF 16; Yorktown, Enterprise, Hornet; ComDesRon 6; COMINT study | HyperWar, 206 |
| Japanese primary (English) | **Nagumo report, ONI Review May 1947** | HyperWar, **opened** |
| Japanese primary (Japanese) | JACAR C08030023600–24100 (1st Air Fleet), **C08030040500 (Kaga, Sōryū)**, C08030040400 (Akagi), C08030040600 (Hiryū) | JACAR, openings read |
| Interrogations | IJO Nav 1 (Amagai, Kaga), 2 (Kawaguchi), 4 (Aoki, Akagi), 39 (Ōhara, Sōryū), 60, 13, 64 | HyperWar, headers opened |
| Official analyses | **NWC 1948**; ONI CN 1943; USSBS *Campaigns* ch. 5 | archive.org / HyperWar |
| Official histories | Morison IV (©); Senshi Sōsho 43 (JP); USMC vol. I Part V; Heinl 1948; JM-93 | mixed |
| Secondary (print) | Parshall and Tully 2005; Lundstrom 1984; Prange 1982; Fuchida and Okumiya 1955; Symonds 2011; Isom 2007 | *verify* |
| Tertiary | TROMs (Kaga, Akagi, Sōryū, Hiryū); Wikipedia | Kaga opened |

### 9.3 Second Naval Battle of Guadalcanal, night of 14–15 November 1942 (v1)

| role | source | status |
| --- | --- | --- |
| US primary | **Washington (BB-56) and CTF 64 (Lee) reports: not found reachable.** South Dakota War Damage Report (BuShips) is reachable (HyperWar PDF, 206) | gap |
| Japanese primary | **Atago 戦闘詳報第八号 (C08030745200)**; **Inazuma (C08030752400)**; DesRon 4 (C08030115500); BatDiv 3 (C08030041800). Kirishima sank: no report of her own was found for this night | JACAR, openings read |
| Interrogations | **IJO Nav 33 (Tokuno, Kirishima's assistant gunnery officer)** | HyperWar, header opened |
| Official | ONI CN *Battle of Guadalcanal* (Jameson 1944); Morison V (©); Senshi Sōsho 83 ch. 7 (JP); JM-98; USSBS *Campaigns* ch. 7 | mixed |
| Analyses | Lundgren, *The Naval Battle of Guadalcanal* and Kirishima and South Dakota damage analyses (navweaps.com, 206, ©) | reached |
| Secondary (print) | Frank 1990; Hornfischer 2011 (*Neptune's Inferno*); Hammel 1988; Lundstrom 1994; Lippman (cited by Wikipedia; *verify*) | *verify* |
| Tertiary | Kirishima TROM (opened); Wikipedia | — |

### 9.4 Samar, 25 October 1944 (v1)

| role | source | status |
| --- | --- | --- |
| US primary | **Johnston (DD-557) action report**, senior surviving officer (Lt R. C. Hagen), 14 Nov 1944, DD557/A16-3 Serial 04. Zone −9. 141 survivors. "0720 – Ten torpedoes fired" at a heavy cruiser. <http://ussjohnston-hoel.com/322/376.html> (200) | **opened** |
| US primary | **Hoel (DD-533) Combined Action Report and Report of Loss**, 15 Nov 1944. Times "Item (Zone -9), and from memory"; sank about 0855 at 11°46′N, 126°33′E. <http://ussjohnston-hoel.com/322/367.html> (200) | **opened** |
| US primary | CTF 77 preliminary report (HyperWar, opened head); COMINCH SIB 22 *Battle Experience* with time table (HyperWar). **CTU 77.4.3 (Sprague) and CTG 77.4 reports not found reachable** (bosamar.com broken; NHHC unreachable) | partial |
| Japanese primary | **CruDiv 7 (C08030037100)** with track and battle charts; **Tone (C08030568700)**; **Haruna battle chart (C08030567300)**; 1st Mobile Fleet (C08030036600) | JACAR |
| Interrogations | **IJO Nav 9 (Kurita), 35 (Koyanagi), 41 (Ōtani)**; 66 (Tsuda, Yamato's navigator) | HyperWar |
| Official | Morison XII (©, opened in part); Senshi Sōsho 56 part 1 ch. 5 (JP); JM-84; NWC vol. III (to 23 Oct only); USSBS *Campaigns* ch. 12; Gill II ch. 17 (Australian ships at Leyte, not at Samar) | mixed |
| Secondary (print) | Hornfischer 2004; Field 1947; Willmott 2005; Cutler 1994 (*verify*); Tully 2009 (Surigao) | *verify* |
| Tertiary | TROMs (Yamato, Kumano opened; Chōkai, Chikuma, Suzuya *verify*); Johnston–Hoel Association pages (survivor and loss lists); Wikipedia | — |

### 9.5 Later battles (one line each)

- **Pearl Harbor (defence):**
  - HyperWar USN action reports (`USN/rep/Pearl/`), USSBS *Campaigns* ch. 2,
    IJO Nav 29 (Fuchida);
  - the Pearl Harbor Attack hearings (`ibiblio.org/pha`), JM-97;
  - Senshi Sōsho 10; Morison III (©, renewed 1976); Prange (print);
  - AAF *7 December 1941: The Air Force Story* (HyperWar), for the P-40s.
- **Ten-Gō:** JACAR C08030103100 (Yamato and DesRon 2); Senshi Sōsho 17
  ch. 10 and the Yamato track chart; IJO Nav 32; TF 58 report (HyperWar);
  Yamato TROM; Yoshida, *Requiem for Battleship Yamato* (print).
- **Philippine Sea:** JM-90/91 (HyperWar); IJO Nav 3 (Ozawa); Senshi Sōsho 12;
  JACAR C08030040000 (Chiyoda, Chitose, Shōkaku); Morison VIII (©,
  renewal *verify*).
- **Santa Cruz:** ONI CN; IJO Nav 16; Senshi Sōsho 83 ch. 6; Lundstrom 1994.
- **Surigao Strait:** NWC vol. V (HyperWar); TG 79.11 report; IJO Nav 58, 79;
  Senshi Sōsho 56; Tully 2009; Gill II ch. 17.
- **Savo Island:** ONI CN; NWC Savo 1950; Quantock (HyperWar); IJO Nav 61;
  Senshi Sōsho 49; Gill II ch. 5 (Canberra).
- **Coral Sea:** ONI CN; NWC 1947 (archive.org); TF 11 and TU 17.2.2 reports;
  IJO Nav 8, 10; Gill II ch. 2; Senshi Sōsho 49 (*verify*); Lundstrom 1984.

## 10. Print-only syntheses (cite as *verify* until a person reads them)

| work | what it would settle |
| --- | --- |
| Parshall and Tully, *Shattered Sword* (2005) | Kidō Butai flight-deck cycles and spotting on 4 June; the "five minutes" story (against Fuchida); the Japanese timeline from Japanese records; Japanese dead (3,057, pp. 114, 365, 377–380, 476 per Wikipedia) and aircraft (248, p. 524); carrier dispositions at 10:20 |
| Lundstrom, *The First Team* (1984) and *The First Team and the Guadalcanal Campaign* (1994) | US fighter and CAP actions plane by plane, which the CAP moment needs; Guadalcanal US losses (p. 523, per Wikipedia) |
| Frank, *Guadalcanal* (1990) | casualty totals (p. 490); South Dakota's dead (p. 482); Japanese transport losses; the reinforcement convoy |
| Hornfischer, *The Last Stand of the Tin Can Sailors* (2004) | Taffy 3 minute by minute; Johnston's torpedo run from survivors; Evans |
| Hornfischer, *Neptune's Inferno* (2011) | the Guadalcanal night actions from the US side |
| Tully, *Battle of Surigao Strait* (2009) | Surigao; Japanese records of Nishimura's force |
| Toll, *Pacific Crucible* (2012), *The Conquering Tide* (2015), *Twilight of the Gods* (2020) | the chapter narrative for the table, 1941–45 |
| Hastings, *Retribution / Nemesis* (2007) | civilians, prisoners, the war's cost: the card voice |
| Ienaga Saburō, 『太平洋戦争』 (1968; tr. *The Pacific War, 1931–1945*, 1978) | a Japanese critical history: the home front, atrocities, the prologue from 1931 |
| Dower, *War Without Mercy* (1986) | race and propaganda on both sides: the tone rule's best guide |
| Prange, *At Dawn We Slept* (1981), *Miracle at Midway* (1982) | Pearl Harbor and Midway, interview-based |
| Willmott, *The Barrier and the Javelin* (1983); *The Battle of Leyte Gulf: The Last Fleet Action* (2005) | strategy of 1942; Leyte as one battle |
| Evans and Peattie, *Kaigun* (1997) | IJN doctrine: night torpedo tactics, gunnery, carrier doctrine, for the sortie rules |
| Lacroix and Wells, *Japanese Cruisers of the Pacific War* (1997) | cruiser dimensions, turret layouts and refits for the kits (Atago, Kumano, Tone, Chōkai) |
| Skulski, *The Battleship Yamato* (Anatomy of the Ship, 1988); also *The Heavy Cruiser Takao* (1994) and *The Battleship Fusō* (1998) (*verify* titles) | exact drawings for the Yamato and Takao-class kits |
| Garzke and Dulin, *Battleships* (Axis and Allied volumes, 1985) | Kirishima, Washington, South Dakota, Yamato: armour, guns, damage |
| Friedman, *U.S. Destroyers*, *U.S. Aircraft Carriers*, *U.S. Battleships* | US ship data for the kits |
| Field, *The Japanese at Leyte Gulf* (1947) | the Japanese view of Shō-gō by the USSBS interrogator |
| Hammel, *Guadalcanal: Decision at Sea* (1988) | the night battles; South Dakota |
| Yoshida Mitsuru, 『戦艦大和ノ最期』 (1952; *Requiem for Battleship Yamato*) | Ten-Gō from Yamato's bridge (a memoir, literary) |
| Hara Tameichi, *Japanese Destroyer Captain* (1961) | destroyer night fighting at Guadalcanal (Amatsukaze, 13 Nov) |
| Ugaki Matome, 『戦藻録』 (*Fading Victory*, 1991) | the Combined Fleet staff's diary, 1941–45 |
| Symonds, *The Battle of Midway* (2011); Isom, *Midway Inquest* (2007) | Midway arguments |
| Spector, *Eagle Against the Sun* (1985) | a one-volume American history |

## 11. Licence and copyright, in one table

| class | examples | may the app… |
| --- | --- | --- |
| US government works (PD in the US) | action reports, CINCPAC/COMINCH, ONI narratives and manuals, NWC analyses, USSBS, TAIC, Green Books and their maps, USMC histories, BuShips WDRs | quote, reproduce, redraw: **yes**, with citation |
| US Army translations of Japanese Monographs | JM-83, 84, 93, 98, 116 | quote facts: yes. Reproduce maps: *verify* (Japanese authors) |
| The 1947 translation of Nagumo's report | ONI Review | yes (US government) |
| Japanese government records (NIDS) via JACAR | 戦闘詳報 | facts: yes. **Images: only with NIDS's permission** |
| 戦史叢書 | NIDS viewer | facts: yes. Pages and maps: permission (*verify*) |
| Australian official histories | AWM | facts: yes. Text: CC BY-NC 3.0 AU (cite; avoid copying) |
| In-copyright books | Morison (renewed), Fuchida, Parshall and Tully, Frank, Hornfischer… | facts with citation only |
| Web compilations | TROMs (© authors), Lundgren (©), Johnston–Hoel Association pages | facts with citation; the reports transcribed there are US government works |
| Wikipedia text and Commons maps | CC BY-SA | finding aid only; **no tracing** |

## 12. Casualty and loss figures, and where they disagree

Numbers here are tellings, each with its source. "Opened" means R2 read the
figure in the source. The app must show these as ranges with sources and say
what each figure covers: the whole battle, one night, or one ship.

### 12.1 Midway (4–7 June 1942)

| quantity | figure | source | opened |
| --- | --- | --- | --- |
| US killed | "307 (about)" | NWC 1948, App. III, "Total personnel lost" | yes |
| US killed | "~307 KIA including 3 killed as prisoners" | Wikipedia infobox | tertiary |
| US aircraft lost, Midway area | 132 | NWC 1948, App. III | yes |
| US aircraft lost | 148 ("Army, Midway based 4; Navy carrier and Midway based 114; Navy cruiser based 1; Marine Corps 29") | CINCPAC A16 01849, as quoted by NWC 1948, which puts the difference down to planes struck off as uneconomical to repair | yes (in NWC) |
| Japanese killed | "Total losses – Personnel – 2500 men" | NWC 1948, App. III, citing USSBS Questionnaire No. 14 | yes |
| Japanese killed | 3,057 | Parshall and Tully 2005, pp. 114, 365, 377–380, 476, via Wikipedia | *verify* |
| Japanese killed, the four carriers only | Akagi 221; Kaga "1 800" (garbled in the print); Hiryū 416; Sōryū 718; about 2,155 together | Nagumo report 1947, "Personnel (killed in action)" | yes |
| Kaga | 814 | Kaga TROM (Tully) | yes |
| Kaga's engine crew | "Only a third of them would survive; 213 of them perished" | Kaga TROM | yes |
| Japanese aircraft | 234 carrier aircraft (48 shot down, 186 lost aboard or in water landings); 258 of all types "per Japanese report" | NWC 1948 | yes |
| Japanese aircraft | 248 | Parshall and Tully, p. 524, via Wikipedia | *verify* |
| Kaga's sinking position | 30-20.3N, 179-17.2W | Nagumo report | yes |
| Kaga's sinking position | 30-23.3′N, 179-17.2′W | Kaga TROM | yes |
| Kaga's sinking time | 1925 local = 1625 JST (both sources agree) | Nagumo report; TROM | yes |

### 12.2 Naval Battle of Guadalcanal, night of 14–15 November 1942

| quantity | figure | source | opened |
| --- | --- | --- | --- |
| South Dakota casualties | "38 men killed or missing and 60 wounded"; "42 large-caliber hits" | Morison V | yes |
| South Dakota casualties | 39 killed, 59 wounded | Frank 1990, p. 482, via Wikipedia | *verify* |
| South Dakota hits | 17 eight-inch from Atago and Takao, five 6-inch, one 5-inch, plus Kirishima's "multiple hits" | Kirishima TROM | yes |
| South Dakota damage | BuShips War Damage Report | HyperWar PDF, 206 | no |
| Kirishima hits | "9 out of 75 sixteen-inch shells … as did about 40 fast-shooting 5-inchers" | Morison V | yes |
| Kirishima hits | USSBS: 9 sixteen-inch and 40 five-inch; Lee's report: 8 sixteen-inch | Kirishima TROM, note 5 | yes |
| Kirishima hits | "some 20 major caliber hits and seventeen smaller caliber hits" | Lundgren, via the TROM | *verify* |
| Kirishima losses | 212 lost; captain, XO and 1,098 survivors rescued | Kirishima TROM | yes |
| Kirishima's sinking | 0325 (local), 09-05S, 159-42E, 7.5 miles NW of Savo | Kirishima TROM | yes |
| The whole battle (12–15 Nov), US | 1,732 killed | Frank p. 490 and Lundstrom p. 523, via Wikipedia | *verify* |
| The whole battle, Japanese | 1,900 killed, transports excluded | Frank p. 490, via Wikipedia | *verify* |
| Walke, Preston, Benham, Ayanami: per-ship losses | — | not extracted | *verify* |

### 12.3 Samar, 25 October 1944

| quantity | figure | source | opened |
| --- | --- | --- | --- |
| Johnston | complement 327; 141 saved; 186 lost. Of these, about 50 were killed while she was afloat, 45 died on the rafts, and 92, Evans among them, were alive in the water but never found | Morison XII | yes |
| Johnston | "The 141 survivors of this ship clung to three rafts and two floater nets for fifty hours" | Johnston action report | yes |
| Johnston | "suffered the loss of 152 Members"; "had 144 Survivors" | Johnston–Hoel Association pages (`/6015/`, `/6042/`) | yes |
| Hoel | "loss of 252 Members"; "89 Survivors" | same pages | yes |
| Samuel B. Roberts | of 8 officers and about 170 men, "3 officers and 86 men were killed, missing or died of wounds" | Morison XII | yes |
| US total at Samar | 1,161 killed and missing; 913 wounded | NHHC H-Gram 036, via Wikipedia; NHHC unreachable | *verify* |
| Japanese total | "2,700+ killed and wounded" | CTG 77.4 action report, p. 31, via Wikipedia (a US estimate) | *verify* |
| Japanese ships lost | Chōkai, Chikuma, Suzuya (heavy cruisers) | Wikipedia; TROMs not opened | *verify* |
| Johnston's torpedoes at Kumano | fired 0720 ("Ten torpedoes … heavy cruiser as point of aim") | Johnston action report (zone −9) | yes |
| Kumano hit | 0724 | Kumano TROM | yes |
| Kumano hit | 0727 | Morison XII | yes |
| Hoel's sinking | about 0855 at 11°46′N, 126°33′E. Morison: "judging from her survivors' accounts it must have been farther to the westward" | Hoel action report; Morison XII | yes |
| Johnston's sinking | about 1010 | Johnston action report; Morison XII | yes |
| Yamato opens fire | 0558 | Yamato TROM | yes |

### 12.4 Ten-Gō, 7 April 1945 (later)

| quantity | figure | source | opened |
| --- | --- | --- | --- |
| Yamato | "3,055 of 3,332 crewmen are lost"; 276 rescued | Yamato TROM | yes |
| Yahagi and four destroyers | 1,187 lost | Yamato TROM | yes |
| US | 10 aircraft, 12 crewmen | Yamato TROM | yes |
| Yamato's sinking | 1423, 30-22N, 128-04E | Yamato TROM | yes |

## 13. Names both ways

Kanji and kana as the source prints them. Romaji are R2's, in modified Hepburn
with macrons; a speaker should check them (§19). "ja.wp" means
ja.wikipedia.org article HTML (tertiary), from which the reading was taken.

| English | Japanese | reading (kana) | romaji | source |
| --- | --- | --- | --- | --- |
| the Pacific War | 太平洋戦争 | たいへいようせんそう | Taiheiyō Sensō | ja.wp lead |
| the Greater East Asia War (the wartime official name) | 大東亜戦争 | だいとうあせんそう | Dai Tōa Sensō | ja.wp ("戦時中の日本側における呼称は「大東亜戦争」"); JACAR series ③大東亜戦争 (opened) |
| the attack on Pearl Harbor | 真珠湾攻撃 | しんじゅわんこうげき | Shinjuwan Kōgeki | ja.wp |
| the Hawaii Operation (official name) | ハワイ作戦 | ハワイさくせん | Hawai Sakusen | Senshi Sōsho 10 title (opened) |
| Midway | ミッドウェー海戦 (JACAR: ミッドウエー海戦) | ミッドウェーかいせん | Middowē Kaisen | Senshi Sōsho 43 title; JACAR record titles; ja.wp |
| the MI Operation | ＭＩ作戦 | エムアイさくせん | MI Sakusen | Senshi Sōsho 43 TOC |
| the Naval Battle of Guadalcanal | 第三次ソロモン海戦 | だいさんじソロモンかいせん | Dai-sanji Soromon Kaisen | ja.wp; Senshi Sōsho 83 ch. 7; JACAR Atago record; en.wikipedia's Nihongo template gives "Dai-san-ji Soromon Kaisen" |
| Guadalcanal (abbreviated in records) | ガ島 | ガとう | Ga-tō | Senshi Sōsho 83 TOC; JACAR openings |
| Battle off Samar | サマール沖海戦 | サマールおきかいせん | Samāru-oki Kaisen | ja.wp (a redirect to レイテ沖海戦: the Japanese record treats Samar as a phase of the Leyte battle) |
| Battle of Leyte Gulf | レイテ沖海戦 (common); 比島沖海戦 (wartime, JACAR); フィリピン沖海戦 (Senshi Sōsho 56) | レイテおきかいせん; ひとうおきかいせん | Reite-oki Kaisen; Hitō-oki Kaisen; Firipin-oki Kaisen | ja.wp; JACAR record titles; Senshi Sōsho 56 title |
| Shō-gō Operation No. 1 | 捷一号作戦 (series 捷号作戦) | しょういちごうさくせん (しょうごうさくせん) | Shō Ichigō Sakusen | ja.wp 捷号作戦 lead ("1944年10月18日に捷一号作戦が発動された"); Senshi Sōsho 37, 56 titles |
| Battle of the East China Sea / Ten-Gō battle | 坊ノ岬沖海戦 | ぼうのみさきおきかいせん | Bōnomisaki-oki Kaisen | ja.wp |
| Ten-gō Operation No. 1 | 天一号作戦 (series 天号作戦) | てんいちごうさくせん (てんごうさくせん) | Ten Ichigō Sakusen | ja.wp 天号作戦; Senshi Sōsho 17 TOC "天一号作戦発動"; JACAR C08030103100 "天一号作戦海上特攻隊" |
| Surface Special Attack Force (Yamato's sortie) | 海上特攻隊 | かいじょうとっこうたい | Kaijō Tokkōtai | JACAR C08030103100; Senshi Sōsho 17 TOC |
| Kikusui operations | 菊水作戦 | きくすいさくせん | Kikusui Sakusen | Senshi Sōsho 17 TOC |
| Battle of the Philippine Sea | マリアナ沖海戦 | マリアナおきかいせん | Mariana-oki Kaisen | Senshi Sōsho 12 title; ja.wp |
| Operation A-gō | あ号作戦 | あごうさくせん | A-gō Sakusen | JACAR C08030040000 title; JM-90 |
| Kidō Butai (Mobile Force, Striking Force) | 機動部隊 | きどうぶたい | Kidō Butai | ja.wp; JACAR C08030023600 title; Nagumo report 1947 renders it "Mobile Force" and "Striking Force" |
| First Air Fleet | 第一航空艦隊 | だいいちこうくうかんたい | Dai-ichi Kōkū Kantai | JACAR C08030023600; ja.wp 機動部隊 page |
| Combined Fleet | 聯合艦隊 (also 連合艦隊) | れんごうかんたい | Rengō Kantai | Senshi Sōsho 71/77/80 titles |
| Imperial GHQ, Navy Section | 大本営海軍部 | だいほんえいかいぐんぶ | Daihon'ei Kaigunbu | Senshi Sōsho titles |
| action report | 戦闘詳報 (written 戦斗詳報 in the records) | せんとうしょうほう | sentō shōhō | JACAR |
| war diary | 戦時日誌 | せんじにっし | senji nisshi | JACAR |
| battle chart | 合戦図 | かっせんず | kassen-zu | JACAR C08030040500, C08030037100, C08030567300 |

Ships of the v1 battles, as JACAR and the TROMs print them:
- 加賀 Kaga
- 赤城 Akagi
- 蒼龍 Sōryū (JACAR's OCR also gives 蒼竜)
- 飛龍 Hiryū
- 霧島 Kirishima
- 比叡 Hiei
- 愛宕 Atago
- 高雄 Takao
- 長良 Nagara
- 電 Inazuma
- 綾波 Ayanami
- 大和 Yamato
- 熊野 Kumano
- 鈴谷 Suzuya
- 筑摩 Chikuma
- 利根 Tone
- 鳥海 Chōkai
- 榛名 Haruna
- 金剛 Kongō
- 長門 Nagato
- 矢矧 Yahagi

Kana readings for the ships are *verify*.

## 14. Proposed additions to the `sources.json` schema

Keep the Hawaiian contract (`id, title, author, year, url, access, opened,
read, note`, plus `tertiary`) and add:

- `language`: `en`, `ja`, or `en (tr. from ja)`.
- `licence`: `pd-us-gov` | `pdm` | `cc-by-nc-au` | `nids-permission` | `©-cite-only` | `cc-by-sa` | `unknown`.
  The app's check can then refuse to ship an image or a traced layer from
  anything that is not `pd-us-gov` or `pdm`.
- `access`: add `lending` (archive.org controlled lending) beside
  `open | print | paywalled`.
- `ref`: an archive's own reference (a JACAR RefCode, a NAVPERS or OPNAV
  number, a CINCPAC serial), so a citation survives a URL change.
- `tz` is not a source field. It belongs on **every timed stop and moment**
  (D1).

## 15. Draft `sources.json` (78 entries)

Columns follow the Hawaiian schema, plus `language`. `opened` and `read`
follow `DATA.md` §4: `read: title` means not read, and the app shows *verify*.
In this pass, a front matter or table of contents counts as `title`.
"HW" = `https://www.ibiblio.org/hyperwar/`; "JC" =
`https://www.jacar.archives.go.jp/das/meta/`; "SS" =
`https://www.nids.mod.go.jp/military_history_search/SoshoView?kanno=`.
Years marked † are from memory and need checking. A `url` of "—" is
deliberate: a print work, or a scan the app must not link.

| id | title | author | year | url | access | language | opened | read | note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `hyperwar` | HyperWar: World War II on the World Wide Web | P. Clancey et al. (eds) | 1995– | HW | open | en | true | part | finding aid; `tertiary: true`; volunteer transcriptions of US official works |
| `nagumo-1947` | "The Japanese Story of the Battle of Midway", ONI Review 2:5 | First Air Fleet (Nagumo); tr. F. Woodrough Jr | 1947 | HW `Japan/IJN/rep/Midway/Nagumo/index.html` | open | en (tr. from ja) | true | part | Tokyo time; part IV missing; times, positions, killed by carrier; PD; licence `pd-us-gov` |
| `cincpac-midway-1942` | Battle of Midway, CINCPAC A16 01849 | C. W. Nimitz | 1942 | HW `USN/rep/Midway/Midway-CinCPac.html` | open | en | false | title | 206; composite track enclosure; zone +12/+10 mix (Morison IV p. 101) |
| `ctf16-midway-1942` | Commander TF 16 to CINCPAC, Battle of Midway | R. A. Spruance | 1942 | HW `USN/rep/Midway/Midway-Carriers.html` | open | en | true | part | "All times given are zone plus ten" |
| `cv5-midway-1942` | USS Yorktown (CV-5) report, Battle of Midway | CO Yorktown | 1942 | HW `USN/ships/logs/CV/cv5-Midway.html` | open | en | false | title | 206 |
| `cv6-midway-1942` | USS Enterprise (CV-6) report, Battle of Midway | CO Enterprise | 1942 | HW `USN/ships/logs/CV/cv6-Midway.html` | open | en | true | part | zone +10; "1222 VSB commenced dive bombing attack"; enemy at 30°05′N, 178°50′W |
| `oni-cn-midway-1943` | The Battle of Midway, June 3–6, 1942 (Combat Narratives) | ONI | 1943 | HW `USN/USN-CN-Midway/index.html` | open | en | false | title | 206; front matter read; self-declared interim, "certain inaccuracies" |
| `nwc-midway-1948` | The Battle of Midway including the Aleutian Phase, June 3 to June 14, 1942: Strategical and Tactical Analysis | R. W. Bates (Naval War College) | 1948 | https://archive.org/details/battleofmidwayin00bate | open | en | true | part | App. III losses read; OCR rough; DTIC copy 403 |
| `jm-93` | Midway Operations, May–June 1942 (Japanese Monograph 93) | 2nd Demobilization Bureau; tr. ATIS | 1947 | HW `Japan/Monos/pdfs/JM-93_MidwayOperations,May-June42/JM-93.htm` | open | en (tr. from ja) | false | title | 206; preface read: "much of this material was reconstructed from memory" |
| `ussbs-ijo-1946` | Interrogations of Japanese Officials (2 vols) | USSBS Naval Analysis Division | 1946 | HW `AAF/USSBS/IJO/index.html` | open | en | true | part | cite by Nav no. in `where`; headers of 17 read; Nav 83 and 106 are 404 |
| `ussbs-campaigns-1946` | The Campaigns of the Pacific War | USSBS Naval Analysis Division | 1946 | https://archive.org/details/campaignsofpacif46unit | open | en | false | title | HTML at HW `AAF/USSBS/PTO-Campaigns/`; charts PD, the base for fronts |
| `ussbs-summary-pacific-1946` | Summary Report (Pacific War) | USSBS | 1946 | https://archive.org/details/summaryreportpac00unit | open | en | false | title | the war in one government voice |
| `jacar-1af-midway-1942` | 機動部隊 第一航空艦隊戦闘詳報 ミッドウェー作戦 (1)–(4) | 第一航空艦隊司令部 | 1942 | JC `C08030023600` (to `C08030024100`) | open | ja | true | part | catalogue transcription of part (3) read; images need NIDS permission |
| `jacar-kaga-soryu-1942` | ミッドウエー海戦 戦時日誌戦闘詳報 (2): 軍艦加賀戦斗詳報 | 軍艦加賀, 軍艦蒼龍 | 1942 | JC `C08030040500` | open | ja | true | part | opening read; bombers' track, battle and hit charts; compiled from survivors' memories |
| `jacar-akagi-1942` | ミッドウエー海戦 戦時日誌戦闘詳報 | 第十戦隊, 軍艦赤城 | 1942 | JC `C08030040400` | open | ja | false | title | — |
| `jacar-hiryu-1942` | ミッドウエー海戦 戦時日誌戦闘詳報 | 軍艦飛龍 | 1942 | JC `C08030040600` | open | ja | false | title | — |
| `senshi-sosho-43` | 戦史叢書43 ミッドウェー海戦 | 防衛庁防衛研修所戦史室 | 1971† | SS `043` | open | ja | false | title | TOC read; ch. 5 §9 is the dive; reuse needs permission |
| `morison-iv` | Coral Sea, Midway and Submarine Actions (HUSNO vol. IV) | S. E. Morison | 1949 | — | print | en | true | part | read in an unlicensed archive.org full text (`husno-volume-iv-…`); © renewed 1977, R657783; p. 101 zone rule |
| `trom-kaga` | IJN Kaga: Tabular Record of Movement | A. P. Tully | 2000 | https://www.combinedfleet.com/kaga.htm | open | en | true | part | © author; local and JST; 814 lost; sinking position differs from Nagumo's |
| `parshall-tully-2005` | Shattered Sword: The Untold Story of the Battle of Midway | J. Parshall, A. Tully | 2005 | — | print | en | false | title | lending only on archive.org; 3,057 dead (via Wikipedia) |
| `lundstrom-1984` | The First Team: Pacific Naval Air Combat from Pearl Harbor to Midway | J. B. Lundstrom | 1984 | — | print | en | false | title | CAP and fighter detail |
| `prange-1982` | Miracle at Midway | G. W. Prange et al. | 1982 | — | print | en | false | title | — |
| `fuchida-okumiya-1955` | Midway: The Battle That Doomed Japan | M. Fuchida, M. Okumiya | 1955 | https://archive.org/details/midwaybattlethat0000fuch | lending | en (tr. from ja) | false | title | contested details; a telling only |
| `heinl-1948` | Marines at Midway | R. D. Heinl Jr | 1948 | HW `USMC/USMC-M-Midway.html` | open | en | false | title | 206 |
| `usmc-hist-1` | Pearl Harbor to Guadalcanal (History of USMC Operations in WWII, vol. I) | F. O. Hough, V. E. Ludwig, H. I. Shaw | 1958 | HW `USMC/I/USMC-I-V-1.html` | open | en | false | title | Part V: Midway; Part VI: Guadalcanal |
| `oni-cn-guadalcanal-1944` | The Battle of Guadalcanal, 11–15 November 1942 (Combat Narratives) | C. G. Jameson (ONI) | 1944 | HW `USN/USN-CN-Guadalcanal/index.html` | open | en | false | title | 206; NHC reprint 1994 |
| `wdr-south-dakota-1942` | USS South Dakota (BB-57): Gunfire Damage, Battle of Guadalcanal, 14–15 Nov 1942 (War Damage Report) | BuShips | 1943† | HW `USN/rep/WDR/` (PDF) | open | en | false | title | 206, 0.8 MB |
| `washington-ar-1942` | USS Washington (BB-56) and CTF 64 action reports, 14–15 Nov 1942 | G. B. Davis; W. A. Lee | 1942 | — | print | en | false | title | **not found reachable**: NARA RG 38 or NHHC (*verify*) |
| `jacar-atago-1942` | 軍艦愛宕戦闘詳報（第三次ソロモン海戦）, 戦斗詳報第八号 | 軍艦愛宕 | 1942 | JC `C08030745200` | open | ja | true | part | opening read; Kondo's flagship ahead of Kirishima |
| `jacar-inazuma-1942` | 駆逐艦電戦闘詳報原稿（第三次ソロモン海戦） | 駆逐艦電 | 1942 | JC `C08030752400` | open | ja | true | part | covers 2000 14 Nov – 0100 15 Nov JST |
| `jacar-desron4-1942` | 第四水雷戦隊戦闘詳報 | 第四水雷戦隊司令部 | 1942 | JC `C08030115500` | open | ja | false | title | — |
| `jacar-batdiv11-1942` | 第十一戦隊戦時日誌戦闘詳報 (5): 戦斗詳報第三号, 第三次ソロモン海戦 (12–13 Nov) | 第十一戦隊司令部 | 1942 | JC `C08030051800` | open | ja | true | part | the first night (Hiei, Kirishima); contents read |
| `senshi-sosho-83` | 戦史叢書83 南東方面海軍作戦〈2〉ガ島撤収まで | 防衛庁防衛研修所戦史室 | 1975† | SS `083` | open | ja | false | title | TOC read; ch. 7 is the battle |
| `morison-v` | The Struggle for Guadalcanal (HUSNO vol. V) | S. E. Morison | 1949 | — | print | en | true | part | read in an unlicensed upload; © renewed 1977, R657781; zone −11 |
| `trom-kirishima` | IJN Battleship Kirishima: Tabular Record of Movement (Rev. 19) | B. Hackett, S. Kingsepp, L. Ahlberg | 2016 | https://www.combinedfleet.com/Kirishima.htm | open | en | true | part | © authors; times, position, losses; note 5 on hit counts |
| `lundgren-guadalcanal` | The Naval Battle of Guadalcanal (and Kirishima and South Dakota damage analyses) | R. Lundgren (ed. T. DiGiulian) | n.d.† | http://www.navweaps.com/index_lundgren/Naval_Battle_of_Guadalcanal.pdf | open | en | false | title | 206; © author |
| `jm-98` | Southeast Area Naval Operations, Part I (Japanese Monograph 98) | 2nd Demobilization Bureau; tr. | 1949† | HW `Japan/Monos/pdfs/JM-98_SEAreaNavalOps/JM-98.pdf` | open | en (tr. from ja) | false | title | 206, 138 MB |
| `frank-1990` | Guadalcanal: The Definitive Account of the Landmark Battle | R. B. Frank | 1990 | — | print | en | false | title | casualty tables pp. 462–490 (via Wikipedia) |
| `hornfischer-2011` | Neptune's Inferno | J. D. Hornfischer | 2011 | — | print | en | false | title | — |
| `hammel-1988` | Guadalcanal: Decision at Sea | E. Hammel | 1988 | — | print | en | false | title | — |
| `johnston-ar-1944` | Action Report – surface engagement off Samar, P.I., 25 Oct 1944 (DD557/A16-3 Serial 04) | Senior Surviving Officer, USS Johnston (Lt R. C. Hagen) | 1944 | http://ussjohnston-hoel.com/322/376.html | open | en | true | part | zone −9; 141 survivors; transcription on the association site; US government work |
| `hoel-ar-1944` | Combined Action Report and Report of Loss of USS Hoel (DD-533), 25 Oct 1944 | CO USS Hoel (L. S. Kintberger) | 1944 | http://ussjohnston-hoel.com/322/367.html | open | en | true | part | "Item (Zone -9), and from memory"; sinking position |
| `johnston-hoel-assn` | USS Johnston–Hoel Association: casualty and survivor lists | the association | n.d. | http://ussjohnston-hoel.com/ | open | en | true | part | counts differ from Morison (§12.3) |
| `ctf77-samar-1944` | Preliminary Action Report of Engagements in Leyte Gulf and off Samar Island on 25 October 1944 | Commander TF 77 (T. C. Kinkaid) | 1944 | HW `USN/rep/Leyte/TF-77-Leyte.html` | open | en | false | title | 206; opening read |
| `sib22-leyte-1945` | Battle Experience: Battle for Leyte Gulf (Secret Information Bulletin 22) | COMINCH | 1945† | HW `USN/rep/Leyte/BatExp/index.html` | open | en | false | title | has a time table |
| `ctu7743-samar-1944` | Special action report, Battle off Samar | CTU 77.4.3 (C. A. F. Sprague) | 1944 | — | print | en | false | title | **not found reachable**; cited by the Johnston and Hoel reports as Serial 00100, 29 Oct 1944 |
| `jacar-crudiv7-1944` | 捷号作戦戦闘詳報（比島方面決戦）(6): 第七戦隊戦斗詳報 | 第七戦隊司令部 | 1944 | JC `C08030037100` | open | ja | true | part | contents read; track and battle charts |
| `jacar-tone-1944` | 軍艦利根戦闘詳報 (3): 比島沖海戦砲術戦訓 | 軍艦利根 | 1944 | JC `C08030568700` | open | ja | true | part | opening read; smoke and evasion of the US ships |
| `jacar-haruna-1944` | 比島沖海戦軍艦榛名合戦図 | 軍艦榛名 | 1944 | JC `C08030567300` | open | ja | false | title | battle chart |
| `senshi-sosho-56` | 戦史叢書56 海軍捷号作戦〈2〉フィリピン沖海戦 | 防衛庁防衛研修所戦史室 | 1972† | SS `056` | open | ja | false | title | TOC read; part 1 ch. 5 |
| `morison-xii` | Leyte, June 1944–January 1945 (HUSNO vol. XII) | S. E. Morison | 1958 | — | print | en | true | part | unlicensed upload; renewal not checked (*verify*); Johnston, Roberts, Kumano |
| `nwc-leyte-3` | The Battle for Leyte Gulf, October 1944: Strategical and Tactical Analysis, vol. III | R. W. Bates (NWC) | 1957† | HW `USN/rep/Leyte/NWC-3.pdf` | open | en | false | title | 206; ends 23 Oct; no Samar volume |
| `jm-84` | Philippines Area Naval Operations, Part II (Japanese Monograph 84) | 2nd Demobilization Bureau; tr. | 1947† | HW `Japan/Monos/pdfs/JM-84/JM-84.pdf` | open | en (tr. from ja) | false | title | 206, 464 MB |
| `trom-yamato` | IJN Yamato: Tabular Record of Movement (Rev. 18) | B. Hackett, S. Kingsepp | 2016 | https://www.combinedfleet.com/yamato.htm | open | en | true | part | Samar and Ten-Gō entries |
| `trom-kumano` | IJN Kumano: Tabular Record of Movement | B. Hackett, S. Kingsepp | 2018 | https://www.combinedfleet.com/kumano_t.htm | open | en | true | part | torpedo at 0724 |
| `hornfischer-2004` | The Last Stand of the Tin Can Sailors | J. D. Hornfischer | 2004 | — | print | en | false | title | lending only |
| `field-1947` | The Japanese at Leyte Gulf: The Sho Operation | J. A. Field Jr | 1947 | https://archive.org/details/japaneseatleyteg0000jame | lending | en | false | title | the author interrogated Kurita's staff |
| `jacar-2sd-tengo-1945` | 天一号作戦海上特攻隊（大和・2sd）戦闘詳報 | 第二水雷戦隊司令部（第二艦隊司令部） | 1945 | JC `C08030103100` | open | ja | true | part | Ten-Gō; contents read |
| `senshi-sosho-17` | 戦史叢書17 沖縄方面海軍作戦 | 防衛庁防衛研修所戦史室 | 1968† | SS `017` | open | ja | false | title | ch. 10 §1; fold-out Yamato track chart |
| `tf58-okinawa-1945` | Report of Operations of TF 58 in Support of Landings at Okinawa, 14 Mar–28 May 1945 | Commander TF 58 (M. A. Mitscher) | 1945 | HW `USN/rep/Okinawa/TF58/index.html` | open | en | false | title | 206 |
| `senshi-sosho-102` | 戦史叢書102 陸海軍年表 付・兵器・兵語の解説 | 防衛庁防衛研修所戦史室 | 1980† | SS `102` | open | ja | false | title | the timeline's Japanese backbone |
| `senshi-sosho-10` | 戦史叢書10 ハワイ作戦 | 防衛庁防衛研修所戦史室 | 1967† | SS `010` | open | ja | false | title | Pearl Harbor |
| `senshi-sosho-12` | 戦史叢書12 マリアナ沖海戦 | 防衛庁防衛研修所戦史室 | 1968† | SS `012` | open | ja | false | title | Philippine Sea |
| `jm-116` | The Imperial Japanese Navy in World War II (Japanese Monograph 116) | 2nd Demobilization Bureau; tr. | 1952† | HW `Japan/Monos/pdfs/JM-116/JM-116.pdf` | open | en (tr. from ja) | false | title | order of battle by date |
| `morton-1962` | Strategy and Command: The First Two Years | L. Morton | 1962 | HW `USA/USA-P-Strategy/index.html` | open | en | false | title | 206 |
| `miller-1949` | Guadalcanal: The First Offensive | J. Miller Jr | 1949 | HW `USA/USA-P-Guadalcanal/index.html` | open | en | false | title | 206; land front |
| `oni-41-42` | ONI 41-42: Japanese Naval Vessels | ONI | 1942 | https://archive.org/details/oni-4142 | open | en | false | title | PDM; silhouettes for the kits |
| `oni-222-j` | ONI 222-J: The Japanese Navy | ONI | 1945 | https://archive.org/details/ONI222JTheJapaneseNavy | open | en | false | title | PDM |
| `taic-1-1945` | Japanese Aircraft Performance and Characteristics (TAIC Manual No. 1) | Technical Air Intelligence Center | 1945 | https://archive.org/details/japanese-aircraft-performance-characteristics-taic-manual | open | en | false | title | PDM |
| `gill-ran-1942-45` | Royal Australian Navy, 1942–1945 | G. H. Gill | 1968 | https://www.awm.gov.au/collection/C1417314 | open | en | false | title | TOC read; ch. 5 (Savo), ch. 17 (Leyte); CC BY-NC text |
| `mccarthy-1959` | South–West Pacific Area – First Year: Kokoda to Wau | D. McCarthy | 1959 | https://www.awm.gov.au/collection/C1417310 | open | en | false | title | New Guinea front |
| `ienaga-1968` | 太平洋戦争 (tr. The Pacific War, 1931–1945, 1978) | 家永三郎 (Ienaga Saburō) | 1968 | — | print | ja / en | false | title | Japanese critical history |
| `dower-1986` | War Without Mercy: Race and Power in the Pacific War | J. W. Dower | 1986 | — | print | en | false | title | tone |
| `evans-peattie-1997` | Kaigun: Strategy, Tactics, and Technology in the Imperial Japanese Navy, 1887–1941 | D. C. Evans, M. R. Peattie | 1997 | — | print | en | false | title | doctrine for the sortie rules |
| `wp-guadalcanal` | Naval Battle of Guadalcanal (Wikipedia) | Wikipedia contributors | 2026 | https://en.wikipedia.org/wiki/Naval_Battle_of_Guadalcanal | open | en | true | part | `tertiary: true`; wikitext read |
| `wp-samar` | Battle off Samar (Wikipedia) | Wikipedia contributors | 2026 | https://en.wikipedia.org/wiki/Battle_off_Samar | open | en | true | part | `tertiary: true` |
| `jawp-names` | ja.wikipedia: 真珠湾攻撃, ミッドウェー海戦, 第三次ソロモン海戦, レイテ沖海戦, 坊ノ岬沖海戦, マリアナ沖海戦, 捷号作戦, 天号作戦, 機動部隊, 太平洋戦争 | Wikipedia contributors | 2026 | https://ja.wikipedia.org/ | open | ja | true | part | `tertiary: true`; readings |
| `cce-renewals` | U.S. Copyright Renewals 1950–1977 (transcription of the Catalog of Copyright Entries) | US Copyright Office; Project Gutenberg | 1950–77 | https://www.gutenberg.org/ebooks/11800 | open | en | true | part | a meta-source: Morison renewals |

## 16. Decisions for the designer

- **D1. A zone on every time.**
  *Recommendation:* every timed stop, moment, waypoint and telling stores the
  source's clock string, the source's zone, and an absolute instant. For
  example: `{ "clock": "0722", "tz": "+09:00", "date": "1942-06-05", "utc":
  "1942-06-04T22:22Z", "source": "trom-kaga" }`. Each battle box then shows its
  own local clock, named:
  - Midway: Midway zone +12;
  - Guadalcanal: zone −11;
  - Samar: Item.

  `check-data.mjs` refuses a time without `tz`.
  *Why:* the v1 battles mix three zone conventions, and the US carriers at
  Midway kept a fourth clock. A missing zone puts the strike two or three
  hours out, and in Nagumo's report a day out.
- **D2. Which records form the backbone of each battle.**
  *Recommendation:* for each v1 battle, a US primary record, a Japanese
  primary record and an official analysis or history:
  - Midway: CINCPAC A16 01849 with the carrier reports; Nagumo 1947 with
    JACAR Kaga C08030040500; NWC 1948.
  - Guadalcanal: the South Dakota damage report, Morison V and the ONI
    narrative; Atago C08030745200, Inazuma C08030752400 and IJO Nav 33;
    Senshi Sōsho 83 ch. 7.
  - Samar: the Johnston and Hoel reports and CTF 77; JACAR CruDiv 7
    C08030037100, Tone and IJO Nav 9/35/41; Senshi Sōsho 56 ch. 5.

  Print syntheses (Parshall and Tully, Frank, Hornfischer) enter as tellings
  marked *verify* until read.
  *Why:* it follows the Hawaiian rule (no source, no pin), and every one of
  these is reachable now.
- **D3. Guadalcanal's US primary gap.**
  *Recommendation:* ask a person to get Washington's and Lee's reports (NARA
  RG 38, or NHHC from a browser). Until then the Washington-bridge moment
  rests on Morison V (a telling), the South Dakota damage report and the
  Japanese reports.
  *Why:* the "both bridges" sortie needs Washington's radar ranges and times
  from her own report. R2 could not reach them.
- **D4. Morison and other in-copyright books.**
  *Recommendation:* cite as `print` with `url: "—"`. Say in the note that the
  text was read in an unlicensed upload. Never reproduce text, maps or charts.
  Never link the `husno-…` or other "opensource" uploads from the app.
  *Why:* the renewals were filed (R600933, R670368, R637305, R657783,
  R657781), so the uploads are not a licence.
- **D5. NIDS images (JACAR action reports, Senshi Sōsho charts).**
  *Recommendation:* use only facts, cited by RefCode. Do not ship scans,
  crops or traced copies of 合戦図 or 行動図. If the designer wants one in
  the app, write to 防衛研究所戦史研究センター史料閲覧室 first.
  *Why:* JACAR's terms reserve publication of NIDS-held images to NIDS.
- **D6. Front lines and fleet tracks: where to trace from.**
  *Recommendation:* trace only from public-domain US government charts:
  - USSBS *Campaigns* plates;
  - CINCPAC composite tracks;
  - NWC diagrams;
  - Green Book and USMC maps.

  Record each chart as a source of the front. Never trace from Commons (CC
  BY-SA) or from Morison's maps.
  *Why:* licence hygiene. A traced line is a derivative of its map.
- **D7. Casualty presentation.**
  *Recommendation:* each battle card carries tellings that state the scope of
  each figure (battle, night, ship) and its source. Midway's Japanese dead
  appear as "2,500 (NWC 1948) to 3,057 (Parshall and Tully)", with Nagumo's
  carrier figures as a third telling. Johnston's dead appear as "152–186",
  with both sources.
  *Why:* the figures diverge for real reasons: counting the transports or
  not, the aircrew or not, deaths on the rafts or not.
- **D8. Kits from recognition manuals.**
  *Recommendation:* take silhouettes and proportions from ONI 41-42 (1942)
  and ONI 222-J (1945) for the Japanese ships, and TAIC No. 1 for the aircraft.
  These are public domain and the art period's own view. Take dimensions from
  print references (Lacroix and Wells, Skulski, Garzke and Dulin, Friedman)
  as *verify*. US ships: FM 30-50 is pre-war, so a print reference is needed.
  ONI 222-US was not found.
  *Why:* open public-domain silhouettes exist for the Japanese side but not
  for the late-war US side.
- **D9. Schema additions.**
  *Recommendation:* add `language`, `licence`, `ref` (a RefCode or serial)
  and the `lending` access value to `sources.json` (§14).
  *Why:* the check can then refuse an image or a trace from a non-PD source,
  and every citation survives a URL change.
- **D10. Romanisation policy.**
  *Recommendation:* show kanji and kana with an English gloss. Romanise native
  words with macrons (Kidō Butai, Sōryū, Kaijō Tokkōtai). Romanise loanword
  place names in the battle names as the Japanese write them (Middowē Kaisen,
  Samāru-oki Kaisen) only in a reading line, not as the title.
  *Why:* "Middowē" is correct Hepburn but reads oddly as a heading. The brief
  asks for both sides named in their own language.
- **D11. Wartime claims as a layer?**
  *Recommendation:* optional, not v1. Imperial GHQ's 1943 books
  (『大東亜戦争海軍戦記』, NDL pid 1907051) and US press claims could sit beside
  the record on a card.
  *Why:* it shows how the war was told at the time, but it needs a careful
  tone review (R8).
- **D12. The NWC Samar gap.**
  *Recommendation:* accept that Samar has no NWC analysis. Use the action
  reports, Morison XII, CruDiv 7 and Tone's reports and the interrogations.
  Frame Johnston's run as *told* ("from memory"): her log was lost.
  *Why:* the honest record is fragmentary, and the card should say whose
  memory it is.

## 17. Risks

- **Time zones.** A wrong zone silently misplaces a strike by 2–3 hours or a
  day (§3). This is the highest-impact error the ledger can carry.
- **Walled hosts.** history.navy.mil (TLS failure), NZETC (Incapsula), DTIC,
  CMH, USMCU, NARA's catalogue API, Wayback. NHHC's reading room and H-Grams
  are the usual citations for US figures. Here they must come through
  HyperWar mirrors or Wikipedia's citations.
- **Rate limits.** Wikipedia API, REST and Commons API: 429. ja.wikipedia
  articles: 429 after about 10. NDL Search: 429. Bake tools must throttle,
  cache, and fall back to `action=raw`.
- **Copyright traps:**
  - Morison uploads (renewed);
  - an unlicensed Frank upload;
  - Commons BY-SA maps;
  - NIDS image permission;
  - © TROM and Lundgren texts;
  - AWM CC BY-NC.
- **OCR and transcription errors.** The NWC Midway text and Nagumo's table
  carry garbled numbers (Kaga "1 800"). The JACAR OCR misreads characters
  (ソロモソ for ソロモン). Every number must be checked against the page image
  before it ships.
- **Witnesses from memory.** Kaga's report (survivors' memories), Hoel's times
  (from memory), Johnston (log lost). The 1945 interrogations came through
  interpreters. Monographs were reconstructed from memory.
- **Single-source details.** Kumano hit at 0724 (TROM) against 0727 (Morison);
  Kirishima's dead (TROM only); Hoel's position (doubted by Morison).
- **Size.** JM-83 (480 MB) and JM-84 (464 MB) PDFs, and NWC Leyte vol. III
  (86 MB), are too big to fetch whole for a by-hand bake. Read them by page
  range or have a person extract the pages.
- **Lost web sources.** bosamar.com now serves a server error. Its Taffy 3
  reports cannot be recovered from here, because Wayback resets.
- **Interpretive bias.** US official works and the Japanese post-war
  monographs each have institutional slants. Morison wrote in a commissioned
  voice. The card voice must not inherit either.

## 18. What could not be reached

| host or work | result | what it would unlock |
| --- | --- | --- |
| history.navy.mil (NHHC) | curl: TLS error 60; WebFetch: 503 | H-Gram 036 (Samar casualties); DANFS; NHHC's copy of *The Japanese Story*; its online action-report collection; the Battle of Midway page cited for Midway figures |
| apps.dtic.mil | 403 | DTIC copies of NWC Midway (ADA003054) and Coral Sea (AD-A003053); archive.org copies serve instead |
| usnwcarchives.org | 404 to curl for the digital object | NWC's own scans of the Battle Evaluation Group studies |
| bibliotheques-numeriques.defense.gouv.fr | connection reset | a French copy of *The Japanese Story* (not needed: HyperWar) |
| nzetc.victoria.ac.nz → ndhadeliver.natlib.govt.nz | 301, then an Incapsula challenge | Waters, *Royal New Zealand Navy*; Gillespie, *The Pacific* |
| history.army.mil (CMH) | 403 | Green Books' native host (HyperWar mirrors them) |
| usmcu.edu | 403 | USMC histories (HyperWar mirrors) |
| navsource.org | CONNECT 502 | ship photo indexes and some reports |
| usswashington.com | CONNECT 502; DNS failure | **Washington's action report, 14–15 Nov 1942** |
| researcheratlarge.com | TLS: self-signed | transcribed ship reports |
| www.bosamar.com | 200, but a server error page (Zend Guard Loader missing) | Taffy 3 action reports, including **CTU 77.4.3** |
| web.archive.org | connection reset | recovery of bosamar.com and other dead pages |
| catalog.archives.gov | single-page app; no keyless API found | NARA RG 38 war diaries and action reports |
| fold3.com | 403 (and paid) | the same RG 38 scans |
| ww2db.com | 403 | tertiary |
| exhibits.stanford.edu/copyrightrenewals | JavaScript challenge | renewals for books published 1950–63 (Morison VI–XV, Fuchida) |
| en.wikipedia.org API and REST; Commons API | 429 | structured queries (article HTML and `action=raw` work) |
| ndlsearch.ndl.go.jp OpenSearch | 429 | NDL catalogue search (the Lab API works) |
| HyperWar IJO Nav 83, Nav 106 | 404 | two interrogations covering Savo, Midway, Leyte, Santa Cruz |
| HyperWar relative links: JM-97, 113, 121, 122, 90-1 and others | 404 | JM-97 found at `ibiblio.org/pha/monos/097/`; the others *verify* |
| NIDS Senshi Sōsho list PDF | 404 | the official list of volumes online |
| ONI 222-US; *Jane's Fighting Ships* 1944–45; "Japanese Naval Vessels at the End of War" (1947) | not found on archive.org | US recognition silhouettes; ship data; Japanese post-war ship list |
| Washington and CTF 64 reports; CTU 77.4.3 and CTG 77.4 reports | not found on any reachable host | the US bridge record for Guadalcanal; Sprague's record of Samar |

## 19. Still needs a person

- **A reader of wartime Japanese** for the JACAR 戦闘詳報:
  - Kaga C08030040500;
  - Atago C08030745200;
  - Inazuma C08030752400;
  - CruDiv 7 C08030037100;
  - Tone C08030568700;
  - Yamato and DesRon 2 C08030103100.

  Also the Senshi Sōsho chapters: 43 ch. 5–6, 83 ch. 7, 56 part 1 ch. 5,
  17 ch. 10. Extract times (JST), courses, positions and losses, and check
  them against the US records.
- **A letter to NIDS** (防衛研究所戦史研究センター史料閲覧室) if any chart or page
  image is wanted in the app.
- **A browser session on NHHC** for H-Gram 036, DANFS (Johnston, Hoel,
  Gambier Bay, Washington, South Dakota) and the Japanese Story page, to
  confirm the figures Wikipedia quotes from it.
- **A request to NARA (RG 38)**, or a Fold3 account, for Washington's and
  CTF 64's reports (14–15 Nov 1942) and CTU 77.4.3's special report
  (29 Oct 1944).
- **A copyright check** in the Copyright Office's online public catalogue
  (1978+ renewals): Morison VI–XV, Fuchida and Okumiya (1955), Field (1947).
- **Library access** for the print syntheses in §10. Parshall and Tully, Frank
  and Hornfischer first: they carry the v1 numbers.
- **A Japanese speaker** to check the readings and romaji in §13 and decide
  D10.
- **A check of AWM's licence** for the scanned official histories (text CC
  BY-NC, or public domain as expired Crown copyright).
- **A browser look at NZETC** through the National Library's archive.
- **Someone to read the South Dakota War Damage Report and the BuShips WDR
  index**, for hit locations, before the battleship moment is choreographed.

## 20. URLs requested (with status)

HyperWar (`https://www.ibiblio.org/hyperwar/` …):
- root, `USN/index.html`, `PTO/index.html`, `Japan/index.html` (200)
- `PTO/TideTurns/`, `PTO/Philippines/`, `PTO/FinalBattle/`, `PTO/Hell/`,
  `PTO/Marianas/`, `PTO/EastWind/` (200)
- `USN/rep/`, `USN/rep/Midway/`, `USN/rep/Leyte/`, `USN/rep/Coral/` (403);
  `USN/rep/Guadalcanal/` (404); `USN/rep/Savo/` (200)
- `Japan/IJN/rep/Midway/Nagumo/index.html` (200, opened)
- `AAF/USSBS/IJO/index.html` (200); IJO-1, 2, 3, 4, 9, 29, 32, 33, 35, 39,
  41, 46, 55, 58, 60, 66, 79 (200); IJO-83, 106 (404)
- `AAF/USSBS/PTO-Campaigns/index.html` (200), `USSBS-PTO-5.html` (206);
  `AAF/USSBS/index.html` (200)
- `Japan/Monos/index.html` (200); the JM-93 HTML (200, opened)
- 206: the JM-93 PDF, `JM-98.pdf`, `JM-84.pdf`, `JM-83.pdf`, the JM-90 HTML
  and PDF, the JM-116 PDF and index
- 404: `JM-90/index.html`, `pdfs/JM-90-1.pdf`, `JM-97/index.html`,
  `JM-113/index.html`, `pdfs/JM-116-0.pdf`, `JM-121/index.html`,
  `JM-122/index.html`, `pdfs/JM-93.pdf`
- `USA/index.html`, `USMC/index.html` (200); `USMC-M-Midway.html`,
  `USMC/I/USMC-I-V-1.html`, `USMC-M-Guadalcanal.html`,
  `USA-P-Guadalcanal/`, `USA-P-Return/`, `USA-P-Okinawa/`,
  `USA-P-Strategy/` (206)
- 206: `USN/rep/Midway/Midway-CinCPac.html` (opened head),
  `Midway-Carriers.html`, `Midway-DesRon6.html`, `Midway-Interrogations.html`;
  `USN/ships/logs/CV/cv5-Midway.html`, `cv6-Midway.html`, `cv8-Midway.html`;
  `PTO/Magic/COMINT-Midway.html`
- 206: `USN/rep/Leyte/TF-77-Leyte.html` (opened head), `BatExp/index.html`
  (index opened), `NWC-1.pdf`, `NWC-2.pdf`, `NWC-3.pdf`, `NWC-5.pdf`,
  `OpAnal.pdf`, `TG-79.11-Surigao/index.html`
- 404: `USN/ships/logs/BB/bb56-Guadalcanal.html`, `bb57-Guadalcanal.html`,
  `USN/rep/Guadalcanal/Lee.html`, `USN/ships/logs/DD/dd557-Samar.html`,
  `USN/rep/Leyte/TU-77.4.3-Samar.html`
- `USN/rep/WDR/index.html` (200); the South Dakota WDR PDF (206)
- `PTO/Hell/NWC-Savo.pdf` (206); `USN/rep/Savo/NWC/index.html` (206, contents
  opened); `USN/CoralSeaAAR/CoralSeaAAR20.pdf` (206)
- `USN/USN-CN-Midway/`, `USN-CN-Guadalcanal/` (206, front matter);
  `USN-CN-Savo/`, `USN-CN-Coral/`, `USN-CN-SantaCruz/` (206)
- 206: `USN/rep/Okinawa/TF58/`, `USN/rep/Okinawa/Cominch/`, `USN/rep/Pearl/`,
  `USN/USNatWar/`, `USN/USN-Chron.html`, `PTO/EastWind/KidoButai.html`
- `USN/ref/Kamikaze/AAA-Summary/` (404); `USN/ref/ONI/index.html` (200);
  `WhatsNew.html` (200); `nav.html` (206)
- `https://www.ibiblio.org/pha/monos/097/index.html` (206)

archive.org:
- `advancedsearch.php` (200), with queries for Morison, Fuchida, ONI, TAIC,
  Jane's, *Campaigns*, Fukui, Prados, Dull, IJO, Field, Parshall, Hornfischer,
  Frank, Evans, Lundstrom
- `metadata/…` (200) for: `husno-volume-iv-…`, `husno-volume-v-…`,
  `husno-volume-xii-…`, `battleofmidwayin00bate`, `battleofcoralsea00nava`,
  `campaignsofpacif46unit`, `oni-4142`, `ONI222JTheJapaneseNavy`,
  `japanese-aircraft-performance-characteristics-taic-manual`,
  `summaryreportpac00unit`
- full text streamed (200/206): Morison IV, V, XII `_djvu.txt`;
  `battleofmidwayin00bate_djvu.txt`
- `archive.org/details/battleofmidwayin00bate`,
  `archive.org/details/battleofcoralsea00nava` (200)
- `archive.org/wayback/available?url=bosamar.com/…` (200);
  `web.archive.org/web/2016/http://www.bosamar.com/pages/johnston_ar`
  (connection reset)

Japanese side:
- `https://www.nids.mod.go.jp/` (206); `…/military_history_search/` (200);
  `…/SoshoView?kanno=` 010, 012, 017, 029, 037, 043, 049, 056, 062, 071, 077,
  080, 083, 085, 091, 093, 095, 096, 102 (all 200)
- 404: `…/contents/information/senshi_sousho_list.pdf`,
  `…/CsdetailServlet?LibraryID=0`; `https://www.nids.mod.go.jp/publication/senshi/index.html`
  (206)
- `https://www.jacar.go.jp/` (206); `https://www.jacar.archives.go.jp/` (200);
  `/aj/search` with `kw=` (200); `/aj/www/doc/` (200, terms opened)
- `/das/meta/` records (200): C08030040000, C08030023600, C08030024000,
  C08030040500, C08030041800, C08030051300, C08030051400, C08030051800,
  C08030745200, C08030752400, C08030037100, C08030567300, C08030568700,
  C08030103100
- `https://www.combinedfleet.com/` (200), `kaigun.htm` (200),
  `Kirishima.htm`, `kaga.htm`, `yamato.htm`, `kumano_t.htm` (200 via 301);
  `kirishima.htm`, `kumano.htm`, `johnston.htm`, `about.htm`,
  `copyright.htm` (404)
- `https://lab.ndl.go.jp/dl/api/book/search?keyword=…` (200);
  `https://ndlsearch.ndl.go.jp/api/opensearch?…` (429);
  `https://dl.ndl.go.jp/` (206), and its search page (200, a JavaScript app)
- `https://www.yasukuni.or.jp/` (206)

Australia and New Zealand:
- `https://www.awm.gov.au/collection/` C1417308–C1417318, C1417540 (200)
- `https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/RCDIG1070434/document/5519718.PDF`
  (206)
- `https://www.awm.gov.au/about/organisation/corporate/copyright` (200, opened)
- `https://www.awm.gov.au/learn/understanding-military-structure/official-histories/second-world-war`
  (404)
- `https://nzetc.victoria.ac.nz/tm/scholarly/tei-WH2Navy.html`, `tei-WH2Paci.html`,
  `subject-000004.html` (301 → challenge)

Others:
- 200: `http://ussjohnston-hoel.com/` and pages 166, 1763, 187, 214, 232,
  6015, 6042, 304, 322, 322/367 (opened), 322/376 (opened), 6163, 6199,
  6208, 7230
- `https://www.bosamar.com/`, `…/pages/johnston_ar` (200, error page)
- `https://destroyerhistory.org/fletcherclass/ussjohnston/` (200);
  `…/index.asp?r=55700&pid=55703` (500)
- `http://www.navweaps.com/index_lundgren/index_lundgren.htm` (200),
  `…/Naval_Battle_of_Guadalcanal.pdf` (206)
- en.wikipedia `index.php?action=raw` for Naval_Battle_of_Guadalcanal,
  Battle_off_Samar, Battle_of_Leyte_Gulf, Battle_of_the_Philippine_Sea,
  Attack_on_Pearl_Harbor, Operation_Ten-Go (200); Battle_of_Midway and
  Pacific_War (429)
- en.wikipedia `wiki/Battle_of_Midway` (200); `api.php` (429);
  `rest_v1/page/summary/Battle_of_Midway` (429)
- ja.wikipedia: 真珠湾攻撃, ミッドウェー海戦, 第三次ソロモン海戦, サマール沖海戦 (→
  レイテ沖海戦), 坊ノ岬沖海戦, マリアナ沖海戦, 捷一号作戦 (→ 捷号作戦), 天一号作戦
  (→ 天号作戦), 機動部隊, 太平洋戦争 (200); レイテ沖海戦, 第一航空艦隊 (429)
- commons.wikimedia.org: `Category:Maps_of_the_Pacific_War` (200); a search
  page (200); `File:Japanese_Empire2.png` (200, opened);
  `File:Second_world_war_asia_1937-1942_map_de.png` and
  `File:Pacific_War_-_Japanese_advances_1941-42_-_Map.jpg` (429);
  `File:Map_of_Japanese_Empire_1942.png` (404); the API (429)
- `https://www.gutenberg.org/ebooks/author/37069`, its search page, and
  `cache/epub/11800/pg11800.txt` (200; grepped, then deleted)
- `https://exhibits.stanford.edu/copyrightrenewals/catalog?q=…` (JavaScript
  challenge)
- `https://catalog.archives.gov/api/v2/…`, `/proxy/advanced-search…`,
  `/search…` (200, app HTML only)
- `https://apps.dtic.mil/sti/pdfs/ADA003054.pdf` (403);
  `https://usnwcarchives.org/repositories/2/digital_objects/31` (404);
  `https://bibliotheques-numeriques.defense.gouv.fr/document/ac340735-…`
  (connection reset)
- history.navy.mil: `/`, `…/japanese-story-of-the-battle-of-midway.html`,
  `…/online-reading-room.html` (TLS error 60); `…/h-gram-special-edition-samar.html`
  via WebFetch (503)
- 403: `https://history.army.mil/`, `…/books/wwii/GuadC/gc-07.htm`,
  `https://www.usmcu.edu/`, `https://www.fold3.com/`, `https://ww2db.com/`
- `https://www.navsource.org/` (502); `https://www.usswashington.com/` (502),
  `http://www.usswashington.com/dl15no42.htm` (DNS)
- `https://www.researcheratlarge.com/` (TLS self-signed)
- `https://www.shatteredswordbook.com/`, `https://www.pacificwrecks.com/`,
  `https://www.j-aircraft.org/` (206, home pages only)
- `https://ndlsearch.ndl.go.jp/` (206)
