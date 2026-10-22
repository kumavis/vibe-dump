# R5: the surface battles, as material for choreography

Researcher R5, for the designer of the Pacific War diorama. Written 2026-10-22.
Topic: the record of the surface battles a player can enter. The Second Naval
Battle of Guadalcanal (night of 14–15 November 1942) and Samar (25 October
1944) in full; Surigao Strait (25 October 1944), Savo Island (9 August 1942),
the First Naval Battle of Guadalcanal (13 November 1942), Tassafaronga
(30 November 1942) and Empress Augusta Bay (2 November 1943) in outline.

This file follows the brief's §6, the Hawaiian standard (`hawaiian-docs/RESEARCH.md`
§12) and R4's form. Every number sits in a telling with its source; where
tellings disagree, each is given; anything not opened in this pass is marked
*verify*. "Opened" means R5 fetched and read the text (or, for a scanned page,
looked at the page image) in this pass. R2's ledger (`R2-sources.md`) is the
catalogue; this file mines it for choreography and repeats R2 only where a
number is needed. It corrects or extends R2 in four places: the Samar TROM
clock (§2.2, R2 §12.3's "Yamato opens fire 0558" is 06:58); Inazuma, not
Ikazuchi (§3.1); South Dakota's own action report, which is reachable as a
scan on navweaps (§3.9, §8.1); and DANFS, which the HyperWar mirror serves
while NHHC is walled (§8.1, §11).

Every time is given on the **battle's clock** first, with the source's own
reading beside it. The battle clocks used here are the ones DESIGN.md §5.5 and
DATA.md §4 name: **Guadalcanal: UTC+11** (the US "zone −11"); **Samar: UTC+9**
("Item", which is also Tokyo time). In DATA's ISO form these are `"+11:00"`
and `"+09:00"`.

Downloads (under `research/downloads/R5/b/`, about 12 MB, mostly text): the
ONI and USSBS pages, the South Dakota war damage report, the Johnston and Hoel
action reports, *Battle Experience* no. 22 with its Taffy 3 charts, Kurita's
disposition sketch, navweaps gun, torpedo and radar pages, Lundgren's essays
and gunnery tables, 15 combinedfleet TROMs, DANFS entries from the HyperWar
mirror, Morison V, VI and XII full texts (read for facts only), an excerpt of
NWC Leyte vol. III and the Royal Navy's *Battle Summary* no. 40. A second R5
process was downloading into `downloads/R5/` at the same time as this pass;
files read from that shared folder are named as such (the ONI Guadalcanal
narrative, its chart, several TROMs, the Wikipedia texts and Lundgren's track
figures). Scripts (fetch, HTML to text, a low-precision sun and moon
calculator) are in `research/r5-scripts/b/`.

---

## 0. Headline findings

1. **The Guadalcanal primaries are on the wrong clock for the box, and so is
   half of one official narrative.** Every US primary for the night of 14–15
   November that this pass could read keeps **UTC+12 ("zone −12")**: South
   Dakota's action report ("All times reported herein are zone minus twelve",
   page image opened), the BuShips war damage report built on it, the ONI
   Combat Narrative's Part III ("All times in this section are Zone minus 12",
   n. 70) and Lundgren's essays, which use Washington's report. Morison V, the
   TROMs and ONI's own Part I (the first night: "All times in Part I are Zone
   minus 11", n. 8) keep **UTC+11**. So Washington's radar contact is 0001 in
   one telling and 2301 in another, and her opening on Kirishima is 0100 or
   midnight. A computed moonset (23:52–23:58 UTC+11 at Savo) matches ONI's
   "moon had set at 0058" only on the −12 reading, which proves the offsets.
   Rule: subtract one hour from every Washington, South Dakota, ONI Part III
   and Lundgren time; add two hours to JST (§2.1).
2. **Washington's main-battery fight is recorded salvo by salvo.** From her
   report, through navweaps and Lundgren: 42 rounds of 16-inch in about three
   minutes at Sendai's group from 18,500 yards (23:16–23:19); then from 00:00
   to 00:07, 75 rounds of 16-inch and 107 of 5-inch at Kirishima, opening at
   **8,400 yards, bearing 008°**, on full radar control, with a 90-second
   cease-fire at 00:02:30 on a false "sunk" report; 117 of a possible 131
   rounds fired (89 per cent), about 1.55 rounds per gun per minute; 62 star
   shells. A 16-inch AP shell takes **about 12 seconds** to fly 8,400 yards
   (BuOrd range table on navweaps, interpolated). §3.7.
3. **Kirishima's hits: four tellings, and the wreck reads with the highest.**
   Lee's report 8 sixteen-inch; Tokuno (USSBS Nav 33, opened) "about 9x16"
   and about 40x5"" hits, repeated by Morison ("9 out of 75"); ONI "about
   eight"; Ikeda's copy of the damage-control officer's sketch, 20 major and
   17 secondary (Lundgren 2009); and Lundgren after the 2019 R/V Petrel survey:
   "between 17 and 21 times by 16-inch projectiles and between 17 and 20 times
   by 5-inch" (2022, opened). The wreck lies inverted at about 1,200 m with the
   bow gone; Ballard's 1992 film and the 2019 survey show the starboard rudder
   jammed about 10–12° starboard and the port rudder near 85°. §3.8, §3.10.
4. **South Dakota's "power failure" was her own guns, before any hit.** The
   damage report (opened) traces it: the shock of Turret III firing astern
   closed an automatic bus transfer switch, paralleling two out-of-phase
   switchboards; breakers that had been "locked in" by standing instructions
   cascaded; power was lost aft for about three minutes (23:33–23:36). Then
   she took "at least 26" hits (one 5-inch, six 6-inch, eighteen 8-inch, one
   14-inch by the report's reckoning), lost every radar but one, and her
   armour was never penetrated. §3.9.
5. **Kurita drew his own disposition at contact, and it is public domain.**
   USSBS Nav 9, Annex C (Plate 9-3, opened): "Disposition of Second Fleet on
   contact with U.S. forces – 0650", course and axis 200°, columns 4 km apart:
   CruDiv 5 with Chōkai to the west, BatDiv 1 leading BatDiv 3 in the centre,
   CruDiv 7's four cruisers to the east, DesRon 2 on the starboard bow and
   DesRon 10 on the port bow; deployment on course 110°. The order to form the
   ring had been given at 05:30 and was not complete (Ōtani, Nav 41). Morison's
   0630 diagram differs (course 170°, BatDivs 5 km astern of the cruisers).
   The fleet was not in a ring at 06:45. §4.2.
6. **The combinedfleet TROMs for Samar run on two clocks, an hour apart.**
   Yamato, Kongō, Haruna, Chōkai, Haguro, Yahagi and Noshiro have Force A
   "open fire at 0558" and Heermann's torpedoes at 0654; Chikuma and Tone have
   the same events at 0658 and the same sighting at 0644. Every early entry in
   the first group is an hour behind Item (Hoel's 0725 attack is Kongō's
   "0625"), while later entries in the same pages are on Item. R2's §12.3 row
   "Yamato opens fire 0558" is this trap: it is **06:58 Item**. Morison has the
   first salvo at 0658 and the first splashes at 0659. §2.2.
7. **Taffy 3's track is on a public-domain chart, and it checks.** *Battle
   Experience* no. 22 (COMINCH, 1945, HyperWar, opened) prints CTU 77.4.3's
   track with times and the Japanese cruiser and destroyer tracks. Read off
   its grid, Taffy 3 at 06:45 is at 11°47.1′N 126°09.9′E; Morison puts Fanshaw
   Bay at 11°46.5′N 126°11′E at 0658; the chart's Gambier Bay at 0907 falls at
   11°32.5′N 126°11.6′E against her report's 11°31′N 126°12′E; the Japanese
   main body at 06:50 lies 31,000 yards on 287° from Taffy 3, against the
   reports' 30,000–34,000. §4.3–4.4.
8. **Johnston's torpedo hit Kumano at 07:24 or 07:27; the run time favours
   the later.** Johnston fired ten Mark 15s at "about" 0720 from about 10,000
   yards, low speed (26.5 knots), target angle 040, target speed 25 (her
   report, opened, written from memory: "all times stated are approximate").
   A collision-course solution on those numbers gives a run of about 7.4
   minutes, so 07:27 (Morison) fits better than 07:24 (Kumano TROM). Kurita
   (Nav 9) says "a slow-speed one got it near the stern"; the TROM says the
   bow was torn off; speed fell to about 15–16 knots and the CruDiv 7 flag
   moved to Suzuya. §4.6.
9. **Johnston's 07:30 hits and how long she fought on, from her report.**
   "Three fourteen inch projectiles, followed thirty seconds later by three 6
   inch": after fire room and engine room out, no power to steering or the
   after three 5-inch guns, gyro gone, speed 17 knots; a rain squall gave ten
   minutes' respite. She fought on for over two hours, abandoned at about 0945
   and sank at about 1010, having fired ten torpedoes and over 800 rounds of
   5-inch. Which ship fired the 0730 hits is a telling (her report says
   14-inch; a later telling gives Yamato's 18.1-inch, *verify*). §4.8.
10. **Japanese night fighting at Guadalcanal was optics, searchlights and
    torpedoes, not radar.** Kirishima had no radar ("departed without it",
    TROM note 3; Tokuno: "We did not have radar fire control"). She saw South
    Dakota at about 10,000 m against Guadalcanal's dark mass; Atago lit her at
    about 5,000 yards with searchlights "in pairs, each pair arranged
    vertically" (South Dakota's log). Washington, unlit and unseen, tracked
    Kirishima by SG and Mark 3 radar from 23:35 and fired with radar ranges.
    The Japanese flashless powder made their gun flashes "small and dim"; the
    US 5-inch blinded the US main-battery directors (ONI). §6.
11. **The destroyers' runs at Samar can be tabled from the reports.** Hoel at
    0727 (half salvo, 9,000 yards, at a battleship on 140° at 20 knots) and
    0750–0753 (half salvo, about 6,000 yards, at the leading cruiser);
    Heermann at 0754 (seven at Haguro, 9,000 yards) and 0800 (three at Haruna,
    4,400 yards); Roberts (three at the cruiser column from 4,000 yards
    undetected); Raymond at 0756 (three at Haguro, 6,000 yards); Dennis at 0759
    (three, 8,000 yards). Only Johnston's is known to have hit. The torpedo
    attack that mattered most was a miss: the tracks that sent Yamato north for
    about ten minutes from 07:54 took her out of the battle. §4.7.
12. **The Kirishima end time is disputed by an hour.** Morison: scuttled and
    sank "at 0320" (UTC+11); TROM: capsized at 0325 at 09°05′S 159°42′E;
    Lundgren: "0323" in an essay otherwise on UTC+12, which would be 02:23.
    Tokuno's "about two and one-half hours" from the first hit points to the
    earlier. The record is that she capsized to port while being abandoned,
    after her magazines were flooded; Tokuno's "Kingston valves" are a telling.
    §3.10.

---

## 1. Method

- **Read first:** BRIEF.md; DESIGN.md §3.4, §5.3, §5.7, §8; DATA.md §9 (re-read
  after it changed on disk during this pass); R2 §3, §9.3–9.4, §12, §18; R4's
  form; the Hawaiian DESIGN §8 and RESEARCH §12.
- **Primaries opened:** ONI Combat Narrative *The Battle of Guadalcanal* Parts I
  and III; USSBS Nav 33 (Tokuno), 9 (Kurita), 35 (Koyanagi), 41 (Ōtani), 66
  (header only); BuShips War Damage Report, South Dakota; South Dakota's action
  report (scanned, via navweaps; the summary and chronological log pages
  1–8 looked at as images; the rest seen only as a contact sheet); Johnston and
  Hoel action reports; COMINCH *Battle Experience* no. 22 (Samar narrative and
  its three charts); DANFS (HyperWar mirror) for Samuel B. Roberts, Gambier
  Bay, St. Lo, Johnston, Hoel, Washington, South Dakota, Walke.
- **Analyses and official histories opened:** NWC Leyte vol. III (excerpt, 22
  October dispositions); Morison V, VI and XII (archive.org full texts,
  copyright: facts only, no text or charts reproduced); Royal Navy *Battle
  Summary* no. 40 (downloaded, skimmed only).
- **Secondary, opened:** Lundgren's *The Battleship Action 14–15 November 1942*,
  *Kirishima Damage Analysis*, *USS Washington Gunfire on 15 November 1942* and
  *Analysis of the wreck of Kirishima* (navweaps, copyright Lundgren); navweaps
  gun, torpedo and radar pages; combinedfleet TROMs and battle page.
- **Tertiary, opened:** Wikipedia (en) *Naval Battle of Guadalcanal*, *Battle
  off Samar*, *Leyte Gulf order of battle*; ja.wikipedia 第三次ソロモン海戦
  (the last two from the shared folder).
- **Computed:** sun and moon positions (Schlyter's low-precision method, about
  0.3° for the moon; script `moon.py`); torpedo run times; chart readings
  converted to latitude and longitude from the charts' own grids
  (§3.5, §4.4).
- **Precision marks** on every fix, as DATA.md §5 and §9 name them: `report`
  (a position written in a report), `chart` (read off a named chart),
  `narrative` (derived from words such as "13.5 miles SE of Savo"),
  `schematic` (placed to fit the record where nothing fixes it).

---

## 2. Clocks, light and weather

### 2.1 Guadalcanal: three clocks, and one document on two of them

| clock | offset | who keeps it | how to convert to the box (UTC+11) | evidence (opened) |
| --- | --- | --- | --- | --- |
| US "zone −12" | UTC+12 | Washington's action report (as quoted by ONI and Lundgren), **South Dakota's action report**, the **war damage report**, **ONI Part III**, Lundgren's essays (his Japanese times are converted to it too) | **subtract 1 h** | SD AR p. 1: "All times reported herein are zone minus twelve"; ONI III n. 70: "All times in this section are Zone minus 12"; WDR ¶7 "At 0000 15 November, Task Force 64 was about thirteen and a half miles southeast of Savo" = ONI's 0000; Lundgren: "the times given are those documented from Washington's action report" |
| US "zone −11" | UTC+11 | Morison V; **ONI Part I** (the night of 12–13 November); the Kirishima TROM's battle entries; ja.wikipedia after conversion | none | ONI I n. 8: "All times in Part I are Zone minus 11"; Morison V (R2 §3: "Tokyo Zone, two hours earlier than the time used in this volume") |
| Tokyo | UTC+9 | Japanese reports and Senshi Sōsho | **add 2 h** | ja.wikipedia: Ayanami, Nagara, Samidare and Inazuma round Savo "午後9時30分ごろ" (21:30 JST = 23:30 UTC+11, which is Morison's 2330 for their torpedoes) |

Three checks prove the offsets:

- **Moonset.** Computed for Savo Sound (9.15°S 159.80°E) on 14 November
  1942: the moon (about 41 per cent lit, first quarter) stands 11.6° high in
  the WSW (azimuth 256°) at 23:00 UTC+11 and crosses the horizon between
  23:50 and 23:58, setting at azimuth about 254°. ONI III n. 80: "The moon had
  set at 0058" (−12); Morison's own chart labels "Moonset 2358" (−11). His text
  also says the moon was "due to set at 0100" and has it set "behind the
  mountains of Cape Esperance" at 2252: the visible set behind the hills came
  earlier than the astronomical one.
- **Benham.** ONI n. 73 (−12): all hands off by 1824; Morison (−11): "abandoned
  she was by 1724".
- **South Dakota at the rendezvous.** ONI (−12): sighted at 0951; Morison
  (−11): fell in with Washington "at 0900".

Two more cautions:

- **South Dakota's own chronology runs about ten minutes off Washington's.**
  Morison V n. 58: "South Dakota's chronology differs by 10 minutes from
  Washington's. In view of the power loss and subsequent damage, I believe
  Washington times to be the more reliable." South Dakota logs her
  illumination at 0048 (−12); Washington's report and ONI have the searchlights
  and her own opening fire at 0100. Lundgren reads two separate illuminations
  (the cruiser screen's at 0048 and Atago's at 0100), and puts the Japanese
  battleship's first salvo at 0052 (−12). This file keeps both readings
  (§3.6).
- **The destroyers' times are memories.** Walke's and Preston's logs went down
  with them; Lundgren says Walke's report runs "about 5-6 minutes late" and
  Preston's drifts "late 2-3 minutes", and adjusts them to Washington's.

**Rule for the data:** the box clock is UTC+11 (`"zone": "+11:00"`, named
"Guadalcanal time (zone −11)"); every beat from a −12 source carries
`"sourceClock": "0100", "sourceZone": "+12:00"`; every Japanese time carries
`"sourceZone": "+09:00"`. The battle crosses midnight: the clock's `from` is
14 November and post-midnight times are 15 November (DATA.md §9 allows either
form).

### 2.2 Samar: one clock in the reports, two in the TROMs

| clock | offset | who keeps it | conversion to the box (UTC+9) | evidence (opened) |
| --- | --- | --- | --- | --- |
| "Item" (zone −9) | UTC+9 | Johnston AR, Hoel AR, CTF 77, CTU 77.4.2 and 77.4.3 (via *Battle Experience*), Morison XII, DANFS | none | Johnston: "Item (minus 9) time zone is used"; Hoel: "All times mentioned herein are Item (Zone -9), and from memory" |
| Tokyo | UTC+9 | Japanese reports; USSBS witnesses | none | Koyanagi (Nav 35): "0640 TOKYO time on the 25th we sighted an American Task Force"; Ōtani: "about 0645"; Kurita: "about 0700, not at 0650" |
| **one hour behind Item** | apparently UTC+8 | early entries in the TROMs of Yamato, Kongō, Haruna, Chōkai, Haguro, Yahagi, Noshiro | **add 1 h** to those entries only | Yamato TROM "0544: Enemy carriers sighted ... bearing 60 to port, range 23 miles" against Tone TROM "0644 ... range of 23 miles bearing 60 degrees to port"; Kongō TROM "At 0625, KONGO is taken under fire by the destroyer HOEL at 14,000 yards ... launches five torpedoes at 9,000 yards" against Hoel AR 0725–0727; Yamato and Kongō TROMs "0654, destroyer HEERMANN fires three torpedoes at HARUNA" against Heermann's 0800 and Yamato's 0754 turn (Morison) |

The same TROMs switch to Item later on the same page (Kongō: "By 0800 ...
ROBERTS ... at 0912 ... sinks"; Haruna: "0756 receives a warning from YAMATO
about two incoming torpedoes"). No page says which clock it uses. **Rule:**
anchor every TROM time for 25 October to a US event before using it; where it
is an hour early, store `"sourceClock"` as printed with a `sourceNote` saying
so. The probable cause is a source keeping Philippine local time (*verify*).

The reports' own times are uncertain in the other direction:

- Johnston's and Hoel's reports were written from memory after their logs
  sank. Morison moves Hoel's second torpedo attack from her "about 0735" to
  about 0750 because Heermann logged it at 0753 (n. 25), and says Johnston's
  report puts the encounter with Yahagi's squadron "about 20 minutes behind
  what the time really was" (n. 49; Kimura's report has it at 0850, and
  Johnston's at 0840).
- Johnston's report says the carriers turned "to a southwesterly course" by
  0700; CTU 77.4.3 and Morison have them steaming east and southeast until
  about 0729. The carriers' reports win.

### 2.3 The outline battles

| battle | clock in the source read | offset | note |
| --- | --- | --- | --- |
| Savo Island | Morison V (−11) | UTC+11 | NWC's Savo analysis has a zone-time page (R2 §3), not opened here |
| First Naval Battle of Guadalcanal | ONI Part I, Morison V | UTC+11 | ONI I n. 8 |
| Tassafaronga | Morison V | UTC+11 | *verify* against the ONI narrative, not opened |
| Empress Augusta Bay | Morison VI | as printed (probably UTC+11, *verify*) | Morison names Merrill's report as the source of the best track chart |
| Surigao Strait | Morison XII, *Battle Experience* | UTC+9 (Item) | same zone as Samar |

### 2.4 Sun, moon and weather at the moments (computed and reported)

| moment | battle clock, place | sun | moon | weather in the record |
| --- | --- | --- | --- | --- |
| Guadalcanal, Washington's first contact | 23:00 UTC+11, 9.15°S 159.80°E | −58° | 11.6° high, az 256°, 41% lit | calm sea; breeze 7 kn from 170° (ONI) or 2–6 kn E to SE (SD AR); 9/10 thin cloud at 10,000 ft, some low cloud at 2,000 ft (SD AR) or cirro-cumulus at 10,000 ft (ONI); visibility about 12 miles (SD AR), landmarks to 25 miles (ONI); 83°F (ONI) |
| Guadalcanal, Washington opens on Kirishima | 00:00 UTC+11 | −63° | set (−2°) | after moonset "only very prominent landmarks were visible at more than 5 miles" (ONI n. 80); visibility 9 → 3 miles at moonset (Lundgren, from Washington's report); overcast by about 0200 −12 (SD AR) |
| Samar, sighting | 06:45 UTC+9, 11.78°N 126.17°E | 3.7° high, az 103° | below horizon | sunrise about 06:27–06:30 (computed; Morison: carriers secured from GQ "three minutes before sunrise" between 0614 and 0627); "cumulus clouds shading about one third of the sky, the sea was calm, and a light 6- to 8-knot wind, rising to 15 knots in rain squalls ... ENE to NNE" (Morison); "Sea was calm with a wind velocity of 6-8 knots from the northeast. The sky was about 3/10 covered with cumulus clouds, with widely scattered showers" (Johnston AR); wind 049°, 7 kn (CTU 77.4.2); smoke "lay low in the hot and humid air" (Morison) |
| Samar, Johnston's run | 07:20 | 12° high, az 105° | — | the carriers in a rain squall 07:06–07:15 (Morison); Johnston's squall just after 07:30, "a valuable ten minutes respite" (her AR) |
| Samar, Kurita's turn-away | 09:11 | 37° high, az 115° | — | — |
| Surigao, battle line opens | 03:53 UTC+9, 10.3°N 125.4°E | −43° | below horizon | no moon (computed) |

At Samar the low sun was in the Japanese gunners' eyes for the first half
hour: Taffy 3 lay on bearings 100°–160° from Kurita, the sun at 103°.

---

## 3. The Second Naval Battle of Guadalcanal (第三次ソロモン海戦, second night), 14–15 November 1942

### 3.1 Orders of battle

**Task Force 64, Rear Admiral Willis A. Lee** (in Washington). ONI III,
WDR ¶5, Morison V, Lundgren (all opened).

| ship | hull | type | CO (Lundgren, Morison) | in the column | notes |
| --- | --- | --- | --- | --- | --- |
| Walke | DD-416 | destroyer (Sims class) | Cdr Thomas E. Fraser (screen commander, by seniority) | 1 | sunk |
| Benham | DD-397 | destroyer (Benham class) | Lt Cdr John B. Taylor | 2 | the only destroyer with fire-control radar (ONI n. 72); bow blown off, sunk next day by Gwin |
| Preston | DD-379 | destroyer (Mahan class) | Cdr Max C. Stormes | 3 | no fire-control radar; search radar off (Lundgren); sunk |
| Gwin | DD-433 | destroyer (Gleaves class) | Lt Cdr John Fellows (L) | 4 | detailed to fire star shell (Lundgren); damaged |
| Washington | BB-56 | battleship (North Carolina class) | Capt. Glenn Davis | 5, guide of the battle line | flagship; undamaged |
| South Dakota | BB-57 | battleship (South Dakota class) | Capt. Thomas Gatch | 6 | two guns of Turret II out since a bomb hit at Santa Cruz (navweaps 16"/45 page); damaged |

The four destroyers came from four different divisions with no division
commander aboard; the two battleships had operated together only on the run
up from Nouméa (Morison V; ONI III: "The sole experience of the 2 battleships
in division formation had been the 30 hours of high speed run").

**Emergency Bombardment Force, Vice Admiral Kondō Nobutake 近藤信竹** (in
Atago). By unit, from Lundgren (opened), Morison V (opened) and Wikipedia
(tertiary), with the disagreements marked.

| unit | commander | ships (Japanese) | role on the night |
| --- | --- | --- | --- |
| Bombardment Unit (射撃隊) | Kondō | **Atago 愛宕** (F), **Takao 高雄**, **Kirishima 霧島** (Capt. Iwabuchi Sanji 岩淵三次) | in column Atago, Takao, Kirishima; led by Asagumo and Teruzuki "west and north of Savo" (Morison) |
| Direct Escort Unit (直衛隊) | Rear Adm. Takama Tamotsu (in Asagumo) | **Asagumo 朝雲**, **Teruzuki 照月**; **Shirayuki 白雪** and **Hatsuyuki 初雪** sent on with Nagara (Lundgren) | Asagumo and Teruzuki stayed with the bombardment unit and took off Kirishima's crew |
| Screening Unit under Nagara | Rear Adm. Kimura Susumu 木村進 (DesRon 10) | **Nagara 長良**, **Samidare 五月雨**, **Inazuma 電**, Shirayuki, Hatsuyuki | entered south of Savo; torpedo attack 23:30–23:36 |
| Sweeping Unit (掃討隊) | Rear Adm. Hashimoto Shintarō 橋本信太郎 (DesRon 3, *verify*) | **Sendai 川内** (F), **Shikinami 敷波**, **Uranami 浦波**, **Ayanami 綾波** | ahead as pickets; Ayanami detached alone round the west of Savo (Lundgren) or with Uranami (Morison) |

- **Inazuma or Ikazuchi.** Lundgren lists Ikazuchi 雷 with Nagara; Morison
  (n. 56: "Kirishima, Nagara, Samidare, Teruzuki, Inazumo and Asagumo
  participated also in the action of 13 Nov.") and Wikipedia list Inazuma, and
  JACAR holds Inazuma's own detailed action report for this night
  (C08030752400, R2 §8.2). Ikazuchi had been damaged on the 13th. **Inazuma.**
- **Who went west of Savo.** Lundgren (citing Japanese reports and the US
  reports' three ships in sight at 0016 −12) sends Ayanami alone; Morison sends
  Ayanami and Uranami. Lundgren's note 1 argues the point.
- Tanaka's four surviving transports and their destroyers (Oyashio 親潮 and
  Kagerō 陽炎 among them, who fired torpedoes at Washington at 00:39 per
  Morison) were north-west of the fight; they are a later beat, not a unit in
  the moments.

### 3.2 Formation and spacing

- **TF 64 at 20:20 (2120 −12):** "single column (Walke, Benham, Preston,
  Gwin, Washington, South Dakota, in that order), the destroyers keeping
  station 300 yards apart, with the heavy ships about 5,000 yards astern"
  (ONI III, opened). Lundgren: destroyers "separated by 500 yards", battleships
  "5,000 yards" behind them and "separated from each other by 2,000 yards".
  Benham "had worked 300 yards to the right of Walke" during the action
  (Lundgren, from her report). **Recommendation:** destroyers at 300–500 yards
  (`precision: narrative`), the battleships 5,000 yards astern of Gwin and
  2,000 yards apart (Lundgren's figure; ONI gives no battleship interval).
- **Kondō's column at 23:48:** "destroyers Asagumo and Teruzuki, heavy
  cruisers Atago and Takao, battleship Kirishima ... eight miles due north of
  Cape Esperance" (Morison). Kirishima's earlier station astern of Hiei on the
  13th was "about 1500 meters" (Tokuno); no spacing is given for this night.
  **Recommendation:** 1,000–1,500 m between ships, `schematic`.
- **Kondō's plan:** Sendai's and Nagara's units "some 10 kilometers ahead of
  the Bombardment Unit" (Lundgren, Kondō's 1835 order); Sendai's pickets "two
  or three miles ahead" (Morison). The force was split four ways in "a
  ten-mile-square area" (Morison).
- **Lee's doctrine:** the battleships were to keep beyond 7,000 yards of the
  enemy (ONI III: South Dakota "had unwittingly approached within the 7,000-yard
  range prescribed by the Task Force Commander").

### 3.3 Tracks and fixes

All times UTC+11. Positions from the ONI chart are read off its grid as
described in §3.5 (`chart`, about ±1′, and the chart itself is a 1944
reconstruction from Washington's and South Dakota's track charts).

| t (UTC+11) | unit | position | course, speed | precision | source (source clock) |
| --- | --- | --- | --- | --- | --- |
| 14 Nov, before noon | TF 64 | "about 50 miles southwest of Guadalcanal" | — | narrative | ONI III (1200 −12) |
| ~20:00 | TF 64 | 9°20′S 159°27′E | 020°, 23 kn, zigzagging | report | Washington AR via Morison V n. 54 ("At 2100 the flag navigator fixed the position"; the report keeps −12, so 20:00 here, *verify*) |
| 20:10 | TF 64 | Savo 18 miles on the starboard beam | 020°, 23 kn; zigzag stopped | narrative | ONI III (2110 −12) |
| 20:20 | TF 64 | west of Savo; column formed | slowed to 20 kn | narrative | ONI III (2120 −12) |
| 20:30–21:10 | TF 64 | Savo 11 miles to the south | turn in succession to 090° | narrative | ONI III (2130 −12); SD log 2210 −12; Morison "shortly after 2100" |
| ~21:48 | TF 64 | top-right turn of the chart track, 8°55.8′S 159°48.8′E, 12 miles N of Savo | to 150°, 17 kn | chart | ONI chart; ONI III 2249 −12; SD log 2247 −12; Morison "2148" |
| 22:52–22:55 | TF 64 | south-east corner of the chart track, 9°16.8′S 159°55.3′E | to 270° | chart | ONI chart; ONI III 2352; SD log 2355 (−12); Morison 2252 |
| 23:00 | TF 64 | "13.5 miles southeast of the southernmost point of Savo" = about 9°19.0′S 159°58.6′E | 270°, 17 kn | narrative | ONI III and WDR ¶7 (0000 −12). The chart corner is 3.7 nm WNW of this point; the two disagree by that much |
| 23:00 | Sendai's group | loops east of Savo, about 9°08.4′S 159°55.6′E | reversing to 000° and making smoke at 23:16 | chart | ONI chart; Hashimoto's report via Lundgren (0016 −12) |
| 23:19–23:20 | Washington | — | 300°; 17 → 23 kn | narrative | ONI III (0019, 0020 −12) |
| 23:34–23:35 | Washington | about 9°14.0′S 159°49.6′E, passing Preston | 282°, 26 kn | chart | ONI III (0034 −12); Morison 2335 |
| 23:40 | Washington | 9°13.3′S 159°47.5′E | ~290°, 26 kn | chart (interpolated) | ONI chart; ONI III (0041 −12, passes Walke) |
| 23:50 | Washington | 9°11.9′S 159°43.2′E | 290° | chart (interpolated) | ONI chart; Lundgren (0050 −12, course 290) |
| 23:58 | Washington | 9°10.7′S 159°39.8′E | ~295°, 26 kn | chart (interpolated) | ONI chart (0058 −12) |
| 00:00 | Kirishima | 8,400 yd on 008° from Washington = about 9°06.3′S 159°39.5′E | ~130°, 28–30 kn | narrative (range and bearing from Washington's report) | ONI III, Lundgren (0100 −12); Tokuno "28-30 knots" |
| 00:00–00:10 | Kirishima | circling in the loops 9°05.4′–9°07.5′S, 159°37.8′–159°43.0′E | "500° turn" to port | chart | ONI chart; ONI III ("performed a 500° turn") |
| 00:17 | Kirishima | — | steadying westward, 18 kn | narrative | ONI III (0117 −12) |
| 00:20 | Washington | turn north at about 9°07.6′S 159°30.5′E | 340°; slowed to 18 kn at 00:17 | chart | ONI chart; ONI III, Lundgren (0117, 0120 −12); Morison 0020 |
| 00:33 | Washington | reversal at about 9°02.2′S 159°29.2′E | to 180°, 20 kn; later 210°, 26 kn (00:40) | chart | ONI III (0133 −12); Morison 0033, 0040 |
| 00:10 | South Dakota | — | 235°, full speed | report | SD log (0110 −12) |
| 00:24 | South Dakota | — | 215° | report | SD log (0124 −12) |
| 02:00 | Benham | 9°30′S 159°30′E | 160°, 10 kn | report | Gwin AR in ONI n. 77 (0300 −12) |
| 03:20–03:25 | Kirishima capsizes | 09°05′S 159°42′E, "7.5 miles NW of Savo Island" | — | report (TROM) | Kirishima TROM (0325); Morison 0320 "northwest of Savo" |
| 15 Nov, 17:24 | Benham sunk | 10°11′S 160°07′E | — | report | Morison V n. 61 |

The wreck lies at about 1,200 m, stern pointing about 285°, the hull broken
at frame 76, the debris trailing south about 600–700 m (Lundgren 2022, from
the Petrel sonar). Ballard (1992) is quoted by the TROM as "4,000 feet".

### 3.4 Lundgren's tracks (described, not reproduced)

Lundgren's essay carries four plotted track figures (2317–0020, 0020–0040,
0040–0114, 0050–0114, on his −12 clock), © Robert Lundgren. The 0050–0114
figure (looked at in the shared folder) shows Washington on a straight WNW
course (about 300°) at even minute intervals from 00:52 to 01:15 (−12);
South Dakota 2,000–4,000 yards to her north-east on a parallel course until
she turns west at 01:10; Kirishima coming down on about 120°–130° from 00:57,
then from 01:05 turning hard to port into a tight circle where "Kirishima
sinks" is written; Atago and Takao on a parallel course to her north, turning
north at 01:05–01:10 and away to the north-west. It agrees with the ONI
chart's shapes. Cite as a telling; draw nothing from it.

### 3.5 The ONI chart (public domain; may be drawn from)

*Battle of Guadalcanal, Battleship Night Action, November 14–15, 1942. U.S.S.
Washington and U.S.S. South Dakota Track Chart*, in the ONI Combat Narrative
(1944), p. 63; HyperWar `USN-CN-Guadalcanal/maps/USN-CN-Guadalcanal-7.jpg`
(1200 × 778 px; downloaded to the shared folder as `cn-guad-map7.jpg`). It
shows Washington's track solid, South Dakota's dashed, enemy tracks as chains
of circles, Savo Island and a stylised Guadalcanal coast west of Lunga, and
dozens of small time and event labels that are illegible at this resolution.
The bottom border carries 5′ ticks of longitude ending at 160°00′E on the
right (x ≈ 1155 px; 163.3 px per 5′); the left edge is 159°25′E. Savo's
centre on the chart reads 159°49.1′E against its true 159°48.6′E, and the
Kirishima loops' NE edge falls 1′ from the TROM's sinking position, so the
grid reading is good to about a minute. Latitude was taken from Savo's centre
(9°07.8′S) at the same scale. Shapes, in order: the 020° approach from the
south-west; the 090° leg north of Savo; the 150° leg down the east side; the
turn west south-east of Savo; the WNW run past the burning destroyers; the
turn north at the west edge; the loop of the 0133 reversal; the retirement
SSW. Enemy: two looping tracks east of Savo (Sendai's group), the circling
Kirishima north-west of Savo, and a track running NNW from it (Atago and
Takao withdrawing).

**Morison V's chart** (*Battle of Guadalcanal, Battleship Night Action, 14–15
Nov. 1942*, p. 274; ©, not to be traced) covers 159°45′–160°00′E with a
nautical-mile scale; the legible labels in the OCR are "2317 Adm. LEE
contact", "2333 South Dakota power fails", "Moonset 2358", "Washington
ceases firing 0007", the opening "on Kirishima" at 2400, and "Motor torpedo
boats scouting in this area". It is on UTC+11 and agrees with the ONI chart.

### 3.6 Minute by minute, 20:00–03:25 (battle clock UTC+11)

`[−12 hhmm]` is the source's own reading on UTC+12; `[JST hhmm]` on Tokyo
time. "L" is Lundgren, "M" Morison V, "ONI" Part III, "SD" South Dakota's
log (page images), "WDR" the damage report, "T" the Kirishima TROM, "Tok"
Tokuno (Nav 33).

| t | event | sources (source clock) |
| --- | --- | --- |
| 14 Nov 14:55 | A Japanese search plane sights TF 64 100 miles south of Guadalcanal and reports two "cruisers" and four destroyers | T (1455; clock unstated) |
| 15:18 | Trout fires five torpedoes at Kirishima east of Santa Isabel; one dud hits | T (1518); M: three passed under a destroyer and "almost nicked the flagship" |
| 20:10 | TF 64 stops zigzagging; flashes over the horizon to the west (Tanaka's burning transports) | ONI [−12 2110]; SD [−12 2110] |
| 20:20 | Report of a cruiser and destroyer in a cove on Savo; column formed; 20 kn | ONI [−12 2120] |
| 20:30 | Japanese voice transmissions heard on 2070–2080 kc | ONI [−12 2130]; SD [−12 2245] |
| 21:30 | Kondō's floatplane reports two cruisers and four destroyers 50 miles ahead; Kondō to 28 kn | L [−12 2230, from JST] |
| 21:48 | Savo abeam to starboard; course 150°, speed 17 | M 2148; ONI [−12 2249]; SD [−12 2247] |
| 22:10 | Sendai's lookouts report "two enemy cruisers and four destroyers" north of Savo; Kondō splits his force | M 2210; T 2210; L [−12 2313] |
| 22:17 | PT boats report TF 64 as enemy; Lee clears it up in plain language ("Ching Lee") | SD [−12 2317]; ONI; M 2230–2240 |
| 22:52 | TF 64 turns west (270°); moon setting behind Cape Esperance's hills | M 2252; ONI [−12 2352]; SD [−12 2355] |
| 23:00 | **Washington's SG and fire-control radar contact, bearing 340°, 18,000 yd**, then 19,600 yd; main battery director tracks 2 min and loses the target in land echo | ONI [−12 0001]; L [−12 0000]; M: "target distant nine miles, a point and a half west of north"; T 2301 |
| 23:05 | Uranami regains contact and reports "new type enemy cruisers" | L [−12 0005] |
| 23:08 | South Dakota sights three ships bearing 330°, 18,300 yd by radar | SD [−12 0008]; ONI |
| 23:12 | Washington's main battery director sees Sendai through his telescopes | M 2312 |
| 23:13 | Lee: "You may open fire when you are ready" | SD [−12 0013]; L [−12 0014]; M 2316 |
| 23:15 | South Dakota radar plot: target 345°, 17,000 yd, speed 21 | SD [−12 0015] |
| **23:16** | **Washington opens fire at 18,500 yd** on the leading ship (Sendai), radar ranges and optical train; secondary at about 15,000 yd | ONI, L [−12 0016]; M 2317; T 2316 |
| 23:16 | Hashimoto: "Enemy fired upon us, illuminated by enemy star shells, reversed course by right rudder to 000, laid down smoke" | L [−12 0016, from Sendai's report] |
| 23:18 | South Dakota opens at 15,700 yd on "the second ship in formation"; first salvo straddles | SD [−12 0018]; WDR; ONI [−12 0017] |
| 23:19 | Washington ceases fire, target lost (42 rounds); course 300° | ONI, L [−12 0019] |
| 23:20 | TF 64 to 23 kn | ONI, SD [−12 0020] |
| 23:22 | Walke opens on a ship 20° on her starboard bow emerging from Savo's shadow | ONI [−12 0022]; M 2322; L [−12 0026, adjusted] |
| 23:24 | Ayanami begins her lone attack along Savo's south shore | L [−12 0024] |
| 23:25 | Washington's secondary fires on "shore batteries" on Savo (Ayanami and the Nagara group) | ONI, L [−12 0025] |
| 23:26 | Gwin fires two star-shell spreads, then AA common at the leading ship hugging Savo, 10,000 yd | ONI [−12 0026]; L |
| 23:30 | **Ayanami fires six torpedoes** at the third ship in the US column; Nagara sights the US formation at 4,000 m and Kimura's group fires 35–40 torpedoes | L [−12 0030]; M: Ayanami and Uranami at 2330, Kimura's "five minutes later" |
| 23:31 | Preston hit to starboard by two shells (Nagara's 5.5-inch, L) between the firerooms; second stack falls | ONI; L [−12 0031] |
| 23:32 | Preston hit to port by about three heavy shells "from a heavy cruiser ... virtually undetected"; rolls over within 30 seconds; bow stands vertical about 10 min | ONI; L [−12 0032] (L argues friendly fire, §3.11) |
| 23:32 | Gwin hit in No. 2 engine room by a 4.7-inch (ONI) or 5-inch (L) shell "as the Preston was sinking"; three torpedoes slide out of her tubes; a second, unexploded hit aft | ONI [−12 ~0032]; L [−12 0032] |
| 23:33 | **Walke torpedoed at frame 45 starboard**, then a "cruiser salvo"; forecastle blown off to the bridge | L [−12 0033]; ONI; M 2338 for the torpedo hits |
| **23:33** | **South Dakota's power failure**: "All power, gyros and all electric fire control equipment out"; power off in all turrets 23:33–23:36 | SD, ONI, WDR [−12 0033–0036]; M 2333 |
| 23:34 | Benham torpedoed near frame 6, 27 kn to 5; Washington's secondary ceases fire (mount 3 firing wild); Washington to 26 kn, 282° | L, ONI [−12 0034]; M 2335 |
| 23:35 | **Washington's SG: four ships bearing 330°**, obscured by Savo until now; main battery tracks the largest | ONI, L [−12 0035] |
| 23:36 | Walke sinks (L, adjusted) or 23:42 (M; ONI [−12 0042]); her depth charges explode under the survivors a minute later | L [−12 0036]; M 2342; ONI |
| 23:36 | South Dakota's power back except mounts 6 and 8; turns to clear the destroyers and silhouettes herself against them | WDR [−12 0036]; M |
| 23:40 | South Dakota's forward turrets fire at ships near Savo (14,100 yd) | SD [−12 0040] |
| 23:41 | Washington passes Walke's wreck and drops two rafts; South Dakota's SG fails (to 23:46) | ONI, WDR [−12 0041] |
| 23:42 | South Dakota's Turret III, firing astern, sets her floatplanes on fire; next salvo blows two overboard | SD, WDR [−12 0042–0043]; M 2342 |
| 23:45 | South Dakota's target astern "exploded and lost" (Ayanami, WDR) | SD, WDR [−12 0045] |
| 23:47 | South Dakota's radar plot: ships 070° relative, **5,800 yd** (two earlier reports at 7,000 yd overlooked) | SD, WDR [−12 0047] |
| 23:48 | Lee orders the destroyers to retire | L [−12 0048]; M 2348 |
| 23:48 | **South Dakota illuminated** by "four searchlights, closely grouped in pairs, each pair arranged vertically" at about 5,000 yd (her log; Lundgren: the light cruisers' screen; Morison and ONI: this is the 00:00 illumination, logged 10 minutes early) | SD, WDR [−12 0048] |
| 23:49 | South Dakota's first hit (1.1-inch clipping room); 27 kn | SD [−12 0049] |
| 23:51 | Kimura recognises two battleships and signals Kondō; Kirishima's bridge sights South Dakota "stationary ... partially camouflaged by Guadalcanal" | L [−12 0051] |
| **23:52** | **Kirishima opens fire on South Dakota** at about 10,000 m, secondary first, then main; claims a hit on the foremast with the first salvo | L [−12 0052, Ikeda and Atago's report] |
| 23:54 | Kirishima checks fire to turn; Kondō's column settles on 130° (Washington's report has the reversal 0054–0057 −12) | L [−12 0054] |
| 23:55 | Kimura's group launches torpedoes at South Dakota (M: 34; all miss) | M 2355 |
| 23:58 | Moonset (computed; M chart 2358; ONI [−12 0058]) | — |
| **00:00** | **Atago illuminates South Dakota; Washington opens fire on Kirishima, bearing 008°, 8,400 yd**, main battery and mounts 1 and 3; mounts 5 and 7 on the illuminating ship at 7,500 yd; mount 9 begins star shell after the second salvo | ONI, L [−12 0100]; M "at midnight"; T "around 0000" |
| 00:00:30 | The Japanese and South Dakota open fire almost together; South Dakota "under triple or quadruple concentration" | ONI |
| 00:01 | Kirishima returns fire (on South Dakota, not Washington: "We couldn't see it because of the glare from the destroyers searchlights", Tok) | L [−12 0101]; Tok |
| 00:02 | Takao opens fire; 00:03 Atago fires eight Type 93 torpedoes and her main battery | L [−12 0102–0103] |
| 00:02:30 | Washington "cease firing" on a false report that her target has sunk (39 rounds fired) | ONI, L [−12 0102½] |
| 00:04 | Lee: "If you can see anything to shoot at, go ahead"; Washington resumes | L [−12 0104] |
| 00:05 | Hits on South Dakota end (WDR [−12 0105]); Atago's last salvo 00:06 | WDR; L |
| 00:06 | Washington's forward turrets at their training limit (148°); stern hits on Kirishima jam her steering (L's reconstruction) | L [−12 0106] |
| **00:07** | **Washington ceases fire**: 75 × 16-inch and 107 × 5-inch at the battleship; target burning, turning away | ONI [−12 0107]; M chart "0007" |
| 00:07–00:17 | Kirishima makes a turn of about 500° to port, tracked by Washington | ONI; L |
| 00:08 | South Dakota ceases fire, no targets; 00:10 breaks off on 235° at full speed | SD, WDR [−12 0108, 0110] |
| 00:14–00:23 | Atago fires torpedo salvos at both battleships and reopens with her main battery at 14,000 m at 00:22; makes smoke 00:31; contact lost 00:35 | L [−12 0114–0135, Atago's report] |
| 00:17 | Washington shifts to five ships making 26–29 kn NW; slows to 18 kn | ONI, L [−12 0117] |
| 00:20 | Washington turns to 340° | ONI [−12 0120]; M 0020 |
| 00:25 | Kondō orders all ships not engaged to withdraw | M 0025 |
| 00:33 | **Lee reverses to 180°** to avoid a torpedo trap | ONI [−12 0133]; M 0033 |
| 00:39–01:19 | Torpedoes at Washington from Kagerō, Oyashio and Kimura's destroyers; "Seventeen separate torpedoes were noted ... four or five real 'fish'" | M 0039; ONI [−12 0148–0219] |
| 00:49 | Kirishima's fires being brought under control (L [−12 0149]); T has "by 0249 ... most fires are put out" | L; T (an hour apart) |
| 00:55 | South Dakota's fires all out | SD, ONI [−12 0155] |
| ~01:00 | Overcast forms | WDR [−12 ~0200] |
| 01:00–03:00 | Kirishima: steering compartment floods, divers cannot reach it; Nagara refuses a tow; destroyers try and fail; list shifts side to side as voids are counterflooded; magazines flooded; abandon ship ordered; Asagumo to starboard, Teruzuki to port | L; T; Tok |
| **03:20–03:25** | **Kirishima capsizes to port** while being abandoned | M 0320; T 0325; L "0323" (his −12 clock would make it 02:23, §3.10) |
| 04:00 | Tanaka's four transports aground at Tassafaronga | M |
| 08:51 | South Dakota sighted at the rendezvous: "We are not effective. Turret III out. Fire control badly damaged. Only one radar operative. Fuel tank holed." | ONI [−12 0951]; M 0900 |
| 17:24 | Benham abandoned without loss of life; Gwin's four torpedoes fail and she sinks Benham by gunfire | M; ONI [−12 1824] |

### 3.7 Radar, ranges and the gunnery record

**What the radar did (sources opened):**

| set | ship | what the record shows | source |
| --- | --- | --- | --- |
| SG (10 cm surface search; navweaps: 70 kW, range 15.7 nm) | Washington | first contact 18,000 yd on 340°, again at 19,600 yd; echoes from Savo and from Santa Isabel 50 miles away; four ships at 23:35 once clear of Savo's shadow; used to navigate "with some confidence at high speed in restricted and unfamiliar waters" (Lee, quoted by ONI); a blind arc of about 60° astern caused by the foremast (ONI; L: Sendai's group hid in it until the turn west) | ONI III; L; navweaps US radar page |
| Mark 3 (40 cm fire control on the main-battery directors; navweaps: tracking range 40,000 yd, range accuracy 40 yd, bearing 2 mils, resolution 400 yd and 10°; "16-inch shell splashes could be ranged at 20,000 yards") | Washington | phase 1: fall of shot seen by the FC and SG radars; the director lost the first target after 2 min in land echo; phase 3: "radar was used for both purposes until the target was in view, after which optical train was employed", and "no splashes were picked up by the FC operators" (Kirishima's echo too strong, or Savo's) | ONI III; navweaps |
| Mark 3 | South Dakota | "Splash identification was most successful ... on the opening salvo the radar operator identified three targets, our splashes, and the splashes made by the Washington" (Gatch) | ONI III |
| SG / SC | South Dakota | SG (WDR) or SC (ONI) out 23:41–23:46, so she missed the ships at 7,000 yd; after the hits, every radar out except Main Battery Director II's; Radar Plot demolished by a 6-inch shell, a second shell in the same place | WDR ¶10, ¶1; ONI III |
| none | Kirishima | "KIRISHIMA was scheduled to receive a Type 21 radar, but departed without it" (TROM note 3); "We did not have radar fire control. It was always visual unless we received help from airplanes" (Tokuno, of the 13th) | TROM; Nav 33 |

**Washington's main battery, salvo by salvo.** Times are UTC+11.
Lundgren's table (2020, opened) reconstructs the salvo times from Washington's
report, which records only some of them; the round counts and the remarks in
quotation marks are the report's.

| t | salvo (guns) | target | record |
| --- | --- | --- | --- |
| 23:16:00 | 1 (9) | Sendai's group, 18,500 yd | "first salvo observed 'over' by radar 3 (FC)"; main-battery spotters blinded by the 5-inch |
| ~23:16:30 | 2 (9) | same | straddle by radar 4; target echo "appeared to drop down and finally disappeared" |
| ~23:17:00 | 3 (9) | same | "second M.B. salvo was fired with radar train, remainder in generated" |
| ~23:17:45 | 4 (9) | same | — |
| ~23:18:45 | 5 (6) | same | ceased at 23:19, target lost: **42 rounds** (Sendai was not damaged: L, from her report) |
| 00:00:00 | 6 (9) | Kirishima, 8,400 yd, bearing 008° | "straddle", no hits (confirmed by Kobayashi: the splashes soaked the bridge log) |
| ~00:01:00 | 7 (9) | same | one hit in the pagoda (compass bridge, forward telegraph room: Lundgren, from Kirishima witnesses) |
| ~00:01:30 | 8 (9) | same | amidships; fires near casemate guns |
| ~00:02:00 | 9 (6) | same | bow hits; Turret A probably lost here or next |
| ~00:02:30 | 10 (6) | same | **39 rounds**; "cease firing" on a false "sunk" report |
| 00:04:00 | 11 (9) | same | resumed; "short straddle" |
| ~00:05:00 | 12 (9) | same | stern hits (the wreck shows three in the stern and one in the after hydraulic pump room) |
| ~00:06:00 | 13 (9) | same | Kirishima's stern toward Washington; starboard rudder jammed; she begins to circle to port |
| 00:07:00 | 14 (9) | same | "straddle"; two underwater hits (L); **cease fire: 75 rounds on Kirishima, 117 in all** |

- "Washington fired a total of 117 out of a possible 131 shells, or 89%";
  first phase "42 rounds in approximately 3 minutes ... or 1.56 rpmpg", second
  phase "75 rounds in 5 minutes 24 seconds, or 1.54 rpmpg"; Turret III's
  centre gun missed five salvos (a jarred ball check valve), another gun two
  (a misfire) (navweaps 16"/45 page, from Fisher).
- Secondary battery: 133 rounds 23:25–23:34 at about 10,000 yd at the light
  craft (L's summary); 107 rounds of 5-inch AA common at the battleship (ONI
  n. 82) out of 227 in that phase (L); 62 star shells from mount 9 after the
  second salvo; star shells "fell short after the second salvo and blinded the
  main battery spotters" (ONI n. 82).
- South Dakota's main battery: 115 rounds in 23 salvos at 5,000–18,000 yd,
  nine salvos from Turret III alone, almost all at destroyers (navweaps); her
  logged salvos 1–19 run from 23:18 (15,700 yd) to 23:43:40 (16,100 yd), with
  ranges and spots in the log (SD pp. 5–6). She fired only one main-battery
  salvo during the battleship phase (00:07, "no data available").

### 3.8 How many 16-inch shells hit Kirishima: the tellings

| telling | 16-inch | 5-inch | basis | source (opened?) |
| --- | --- | --- | --- | --- |
| Lee, CTF 64 report | 8 | — | observed from Washington | via Kirishima TROM note 5 and Lundgren (not opened) |
| ONI Combat Narrative | "about eight" | "many" | Washington's report | ONI III (opened) |
| Tokuno, USSBS Nav 33 (25 Oct 1945) | "about 9" | "about 40" | the ship's assistant gunnery officer, from memory | Nav 33 (opened) |
| Morison V | "9 out of 75" | "about 40" | Tokuno | Morison V (opened) |
| navweaps 16"/45 page | "at least nine direct AP hits" | — | Tokuno | navweaps (opened) |
| Ikeda's copy of Lt Cdr Hayashi's damage sketch | 20 "major caliber" (14 above the waterline and 6 underwater as told to Ikeda) | 17 | the damage-control officer's sketch, copied before abandoning ship | via Lundgren 2009 (opened); Ikeda's book *Shikikan-tachi no Taiheiyō Sensō* not opened (*verify*) |
| Kobayashi (bridge) | about 20 | at least 10 | estimate | via Lundgren (opened) |
| Kirishima's brief action report | "more than 6 hits" | — | report | via Lundgren (not opened) |
| Lundgren 2020 and 2022, with the 2019 R/V Petrel survey | **17–21** | **17–20** | Ikeda's sketch, Ballard's 1992 film and the 2019 photographs; "Due to the condition of the wreck not all reported hits can be confirmed" | Lundgren (opened) |

Lundgren's argument for the higher count: hits below the waterline would have
looked like misses from Washington, and hits close together like one; the
Mark 3 operators saw no splashes in phase 3, so Washington's count was what
could be seen. Tokuno's 40 five-inch hits would be 37 per cent of 107 rounds,
"simply too high" (Lundgren). **Recommendation (§9 D2):** calibrate the
untouched replay to the survey's range and show all the tellings on the card.

### 3.9 South Dakota: the hits and the electrical failure

| telling | hits | source |
| --- | --- | --- |
| BuShips war damage report | "at least 26 projectiles": one 5-inch, six 6-inch, eighteen 8-inch, one 14-inch; armour never penetrated; one hit below and two near the waterline; list about ¾°, removed by shifting fuel | WDR (opened) |
| ONI Combat Narrative | 14-, 8-, 6- and 5.5-inch; "only about 3 of the explosions were of a high order"; "her armor had withstood two 14-inch hits" | ONI III (opened) |
| Morison V | "42 large-caliber hits" | Morison V (opened) |
| Kirishima TROM | seventeen 8-inch from Atago and Takao, five 6-inch, one 5-inch, plus Kirishima's | TROM (opened) |
| Lundgren | hits 2 and 11 were 14-inch HC, hit 21 a 14-inch AP near miss, hit 23 a 14-inch Type 3 that broke up without exploding, hit 26 a 14-inch AP on Turret III's barbette; "Only three shells detonated at high order, hits 2, 11, and 26" | Lundgren (opened) |
| Kirishima's lookouts | ten 14-inch hits claimed | Ikeda via Lundgren |

- **Fuzes.** Japanese AP shells of 8 inches and up carried a 0.4-second
  delay (0.08 s in 6-inch) against 0.02–0.035 s in US AP, "to allow time for
  penetration of the lower side belt after the fuze action had been initiated
  on water impact for a near-short", so most passed through the superstructure
  without bursting; the windshield and cap broke off to leave a flat nose for
  the underwater run (WDR ¶11–12, citing NavTechJap O-19).
- **The failure, in the report's words and order** (WDR ¶44–49): the shock of
  Turret III firing astern closed the alternate contactor of an automatic bus
  transfer switch, paralleling switchboards No. 4 and No. 2 out of phase; the
  surge welded the contacts and ruptured the after 5-inch director's feeder;
  the distribution-panel breakers had been "locked in" under outstanding
  instructions, so the fault tripped generator No. 7's breaker; the operator's
  attempts to restore it tripped generators 6, then 5 and 6; about a minute
  passed before generators 5, 6 and 7 were back; power to 5-inch mounts 6 and 8
  came later. ONI: "from 0033 to 0036 power was reported off in all turrets".
  The WDR: "At no time was 440 volt power lost on Turrets I and II or any
  5-inch mount except Nos. 6 and 8." Afterwards all such switches were replaced
  by manual ones.
- **The second loss of power** came from hits: short circuits in the
  superstructure tripped the I.C. switchboard's normal feeder, the emergency
  diesel supply's fuses blew, and fire-control and interior-communication
  power was off "for approximately three minutes" (WDR ¶43).
- **Gatch on the radar:** "After this ship lost both SG and SC equipment, the
  psychological effect on the officers and crew was most depressing. The
  absence of this gear gave all hands a feeling of being blindfolded" (WDR ¶42).

### 3.10 Kirishima's steering and her end: the tellings

| telling | steering | how she went | when | source |
| --- | --- | --- | --- | --- |
| Tokuno | "Shortly after the American ships opened fire the steering ... was so badly damaged that we were unable to steer or repair it. We kept turning in a circle"; tried steering with the engines | Captain ordered the Kingston valves opened; "We did not receive any torpedo hits" | "about two and one-half hours" after the first hit; "About two hours after the battle commenced" (summary) | Nav 33 (opened) |
| Kirishima TROM | "rudders jammed at 10 degrees starboard"; steering compartment partly then fully flooded ("By 0249") | capsized suddenly to port; Nagara's tow abandoned; forward magazines flooded | 0325 at 09°05′S 159°42′E | TROM (opened) |
| Lundgren 2009/2020 | rudder failure reported by voice pipe; the wreck: starboard rudder jammed about 12° starboard, port rudder about 85° starboard, which pulls her to port and explains the 500° turn to port; hydraulic pump rooms hit | not scuttled: she capsized to port while being abandoned "in an orderly fashion", about 300 men still aboard; Teruzuki backed full to escape the falling superstructure | "0323" | Lundgren (opened) |
| Morison V | "steering gear hopelessly wrecked" within seven minutes | "sea valves were opened, and the ship settled slowly" | 0320, NW of Savo | Morison V (opened) |
| ONI | "performed a 500° turn"; "steadying on a westerly course at a speed of 18 knots" at 00:17 | "it is known that she later sank" | — | ONI III (opened) |

The hour's disagreement (Lundgren's 0323 on his −12 clock is 02:23 UTC+11;
Morison's and the TROM's 0320–0325 are UTC+11; the TROM's fire and flooding
entries run an hour behind Lundgren's) cannot be settled from what was read.
Senshi Sōsho 83 ch. 7 or Kirishima's brief report in JST would settle it
(§12). **For the box:** script `sinks` with `t` 03:20, tellings for 02:23 and
03:25; the moments end long before.

### 3.11 The destroyers, and Lundgren's friendly-fire argument

- ONI and Preston's report: Preston was hit to starboard (two shells,
  probably 6-inch, ONI; 5.5-inch from Nagara, L) and then "an enemy heavy
  cruiser came in on the port side of the column 'virtually undetected,' and
  the Preston was hit on the port side by part of an 8-inch salvo (probably
  three shells)" (ONI). She capsized "in half a minute".
- Lundgren argues there were "never any Japanese ships to Preston's port
  side", quotes a South Dakota officer who saw Washington fire to starboard as
  Preston was hit and was told to "forget what we just saw", and says
  Washington's deck log is blacked out for those minutes; he also suggests
  South Dakota's twelfth salvo at 23:31:58 (−11) or a torpedo from Ayanami.
  He calls it "probably unsolvable". This is a telling by one researcher,
  published on navweaps; no US or Japanese primary read here supports or
  refutes it.
- **Recommendation (§9 D3):** the record beat is "Preston is hit by heavy
  shells from her port side and rolls over"; the card gives ONI's "heavy
  cruiser" and Lundgren's argument as tellings, and the box draws no shell's
  origin.

### 3.12 Outcome and people (ranges, by source)

| ship | outcome | people | source |
| --- | --- | --- | --- |
| Washington | undamaged | none lost | ONI III; Morison V |
| South Dakota | superstructure wrecked; Turret III hard to train; all but one radar out; retired | 38 killed or missing, 60 wounded (Morison); "Thirty men were killed and 60 wounded" (ONI); 39 killed, 59 wounded (Frank via Wikipedia, *verify*) | as named |
| Walke | sunk by torpedo and gunfire | "six officers and 76 enlisted men" killed or missing (Lundgren, from Walke's report); 135 picked up by Meade (Morison); "151 ... were landed at Tulagi, where 6 died of wounds" (Walke report quoted by ONI n. 76) | as named |
| Preston | sunk by gunfire (and perhaps a torpedo) | 131 picked up by Meade (Morison); losses *verify* | Morison V |
| Benham | bow blown off by a torpedo; abandoned and sunk by Gwin next afternoon | none killed (Lundgren; Morison "without loss of life") | as named |
| Gwin | engine room hit, damaged | "killing all the personnel on the upper level" of No. 2 engine room (ONI); number *verify* | ONI III |
| Kirishima | steering lost; abandoned; capsized | 212 lost; Iwabuchi, Ono and 1,098 rescued (TROM); about 209 killed, 61 officers and petty officers and 1,031 sailors rescued (Lundgren); about 250 of about 1,400 (Tokuno) | as named |
| Ayanami | crippled by gunfire; scuttled | *verify* | Morison V |
| Atago | two 5-inch hits, a fire in the bow | — | Lundgren (from Atago's report) |
| The whole Naval Battle of Guadalcanal, 12–15 Nov | — | US 1,732 killed; Japanese 1,900, transports excluded (Frank and Lundstrom via Wikipedia, *verify*) | R2 §12.2 |

### 3.13 Candidate moments (DATA.md §9 fields)

Times UTC+11; `t + durationS × timeScale` is the checkpoint, after which the
sortie runs on. Positions are Washington's track interpolated off the ONI
chart unless marked. No after-text below carries a count; the counts go in
`record` and `tellings`.

**G1. Washington's bridge: Kirishima at 8,400 yards (US).** *Recommended, v1.*

```jsonc
{ "id": "washington-kirishima", "title": "Washington opens on Kirishima",
  "role": { "kind": "ship", "unit": "washington", "side": "usa", "kit": "north-carolina" },
  "t": "23:58", "sourceClock": "0058", "sourceZone": "+12:00",
  "durationS": 360, "timeScale": 2,                      // checkpoint 00:10
  "start": { "lonlat": [159.663, -9.179], "precision": "chart", "headingDeg": 295, "speedKn": 26 },
  "objective": { "kind": "gunnery", "target": "kirishima",
                 "text": "Hold fire until you are sure which ship is South Dakota. Then hit the battleship in the searchlights." },
  "record": { "hits": [ { "unit": "kirishima", "count": [8, 21], "calibre": "16in", "window": ["00:00", "00:07"] },
                        { "unit": "kirishima", "count": [17, 40], "calibre": "5in",  "window": ["00:00", "00:07"] } ],
              "rounds": { "16in": 75, "5in": 107, "starshell": 62 }, "damageTaken": "none" } }
```

- Start state: the main battery has tracked a large target to the north since
  23:35 but holds fire, "for fear it might be her sister ship" (Morison);
  South Dakota is out of sight in the blind arc on the starboard quarter (ONI
  n. 79: the flagship "did not know of the failure of the South Dakota's
  radar, nor was she aware of that ship's exact location"); the van destroyers
  are burning astern; the moon has just set; visibility three miles.
- Enemy (AI, bounded by §5.7): Kondō's column (Asagumo, Teruzuki, Atago,
  Takao, Kirishima) on about 130° at 25–30 kn after its reversal; it does not
  see Washington unless she shows a light or closes inside about 5,000 yards
  (the range at which Atago lit South Dakota); its fire stays on South Dakota;
  Atago's torpedoes (eight at 00:03, more at 00:14–00:23) run at both
  battleships; if Washington is fired on, Kirishima's turrets answer at their
  real rate (2 rounds a minute, navweaps).
- Beats regardless: 23:58 moonset; 00:00 searchlights on South Dakota; 00:00–
  00:05 South Dakota hit repeatedly by the cruisers (Kirishima's share only if
  Kirishima is still fighting); 00:05–00:08 Atago and Takao turn north; 00:10
  South Dakota breaks off south-west; 00:17 five ships NW at 26–29 kn; 00:25
  Kondō withdraws; 00:39 torpedoes in Washington's wake.
- After-text: "Washington held her fire until the Japanese searchlights showed
  which ship was South Dakota. Then she fired by radar into Kirishima, unlit
  and unseen herself. Within minutes Kirishima's forward turrets were out,
  fires were burning fore and aft and her rudders were jammed; she circled to
  port and could not be steered again. Her crew flooded her magazines and
  began to leave her; she capsized north-west of Savo in the small hours.
  Washington was not hit. How many of her shells struck is still argued."
  Plus §3.8's tellings and §3.12's people.
- Score: 16-inch and 5-inch hits; minutes to the first hit; whether Kirishima
  lost steering; South Dakota not hit by you; torpedoes evaded.

**G2. Kirishima's bridge (Japanese).** *Recommended, v1.*

- Role: `{ kind: ship, unit: kirishima, side: japan, kit: kongo }`.
- `t` 23:51 (0051 −12, L), `durationS` 480, `timeScale` 2 (checkpoint
  00:07). Starting at 23:51 gives the player the sighting and the first salvo;
  23:58 (DESIGN.md §3.4) would start at the searchlights.
- Start: third in Kondō's column astern of Atago and Takao, swinging from
  about 290° through north to 130° (23:52–23:54); 28–30 kn (Tokuno); about
  9°06′S 159°38′E (`schematic`, between Lundgren's figure and the ONI loops).
  Guns loaded with Type 3 incendiary shells on reduced charges (three bags of
  four) for the airfield; changing to AP means firing them out, "3-5 minutes"
  of continuous fire (Lundgren, from Kirishima's officers). No radar.
- Enemy: South Dakota to port at 10,000–11,000 m, partly hidden against
  Guadalcanal, firing her 5-inch at the searchlights; Washington unseen at
  8,400 yd to the south, opening at 00:00 with the real 16-inch model at the
  player (the player may turn away, as Kondō did at 00:08, or try to find her).
- Beats: 23:54 the column turns to 130°; 23:55 Kimura's torpedoes at South
  Dakota; 23:58 moonset; 00:00 Atago's searchlights; 00:03 Atago's torpedoes;
  00:08 "Hard to port" (Atago); 00:10 South Dakota breaks off.
- Record (Kirishima's own): 117 rounds of 14-inch fired (68 Type 3, 22
  Type 0, 27 Type 1; Ikeda via Lundgren; TROM); hits on South Dakota: one
  14-inch (WDR) to five (Lundgren's reading); lookouts claimed ten.
- After-text: "Kirishima found South Dakota against the dark of the land and
  hit her, as the cruisers did. The second battleship was never seen from
  Kirishima's bridge: the glare of the searchlights hid her. Her first salvo
  straddled; within minutes the forward turrets were wrecked and hits aft had
  jammed the rudders. Kirishima circled and could not be steered. She was
  abandoned, and capsized to port with men still aboard."
- Score: 14-inch hits on South Dakota; whether you found Washington; steering
  kept; whether you came out of the sound.

**G3. A destroyer of the US van: Gwin (US).** *Recommended; Walke as the
alternative.*

- Role: `{ kind: ship, unit: gwin, side: usa, kit: gleaves }`.
- `t` 23:24, `durationS` 360, `timeScale` 2 (checkpoint 23:36).
- Start: fourth in the destroyer column, 300–500 yd astern of Preston, about
  5,000 yd ahead of Washington; 300°, 23 kn; Savo four to six miles to the
  north (`narrative`); star shell loaded (she fired two spreads at 23:26).
- Enemy: Ayanami along Savo's south shore at 9,000–11,000 yd; Nagara and four
  destroyers in Savo's shadow to the NW at 8,000–10,000 yd launching
  torpedoes 23:30–23:36; Sendai's group astern to the NE. Japanese fire on the
  column is by searchlight and gun flash; their flashless powder makes them hard
  to see.
- Beats: Walke opened at 23:22; Preston set on fire 23:31 and rolls over
  23:32; Walke torpedoed 23:33; Benham torpedoed 23:34; South Dakota's power
  fails 23:33; Preston's depth charges explode as you pass.
- Record (Gwin): star shell then AA common; "consecutive salvos struck the
  Japanese ship, which was now 8,500 yards away. Only one gun replied" (ONI);
  one torpedo fired prematurely by a short circuit; three torpedoes lost over
  the side when an engine-room hit broke the safety links; a dud aft; ceased
  fire at 23:36, no targets; withdrew on Lee's order; next day sank Benham.
- After-text: "Gwin lit the targets with star shell, then fired on the
  destroyer shooting along Savo's shore and hit her. She was hit in an engine
  room as Preston rolled over ahead of her, and the shock dropped torpedoes
  over the side. She was the only one of the van destroyers fit to steam away;
  the next day she sank the crippled Benham."
- Walke (alternative): lead ship; opened at 23:22 at a ship 20° on her
  starboard bow; turned to 270° on her own at 17 kn "not ordered by Admiral
  Lee" (Lundgren); torpedoed at 23:33 while shifting her torpedoes from
  "curved fire ahead to broadside to starboard" — her torpedoes never fired.
  A sortie whose record ends in the player's ship sinking eleven minutes in;
  offer it only if the sim lets a player who sees the torpedo tracks turn
  inside them.

**G4. The Japanese van: Ayanami's lone run (Japanese).** *Recommended.*

- Role: `{ kind: ship, unit: ayanami, side: japan, kit: fubuki }`.
- `t` 23:24 (0024 −12, L), `durationS` 360, `timeScale` 2 (checkpoint 23:36).
- Start: alone, hugging Savo's south shore on a westerly heading in her
  counter-clockwise sweep (L); speed not in any source read (*verify*);
  torpedoes ready (Lundgren writes "six Type 90", fired at 23:30; Fubuki-class
  tube fit and reloads: R6, *verify*).
- Doctrine (L): "destroyers ... should close to as short a range as possible
  and ... not open fire with guns until after torpedoes have been launched".
- Enemy: the US destroyer column crossing to the WNW at 7,000–11,000 yd, the
  battleships 5,000 yd behind; Walke, Benham, Preston and Gwin fire by radar
  range and gun flash; Washington's and South Dakota's secondaries join.
- Beats: 23:30 Nagara's torpedoes; 23:32–23:34 Preston, Walke and Benham hit;
  23:36 Sendai passes and reports her on fire; 23:45 her message reaches Kondō.
- Record: Sakuma claimed one cruiser and one destroyer sunk and a third
  destroyer on fire (L); whose torpedoes hit Walke and Benham is not settled
  (L: Benham's from Nagara's destroyers; Preston's capsize perhaps Ayanami's);
  Ayanami lost her No. 1 stack and mounts 1 and 3 (the wreck shows 5-inch
  damage to both, L n. 4), then steering and engines; she stopped south-east of
  Savo and was scuttled after her crew went to Uranami (Morison).
- After-text: "Ayanami came round Savo alone and fired her torpedoes before
  her guns, as doctrine taught. Minutes later the American destroyers were
  torpedoed, by her spread or Nagara's. Then the American column found her
  against the island; she stopped, burning, and was scuttled after her crew had
  gone across to Uranami."

**Later moment, not for v1:** South Dakota's helm 23:47–00:10 (a battleship
under the searchlights, power failing, steering kept: the record's lesson in
staying beyond 7,000 yards).

---

## 4. Samar (サマール沖海戦), 25 October 1944

### 4.1 Orders of battle

**Task Unit 77.4.3 ("Taffy 3"), Rear Admiral Clifton A. F. Sprague** (in
Fanshaw Bay). Ships from the Johnston and Hoel reports and *Battle
Experience* (opened); captains from Morison XII and Wikipedia (tertiary).

| ship | hull | type | captain | notes |
| --- | --- | --- | --- | --- |
| Fanshaw Bay | CVE-70 | escort carrier (Casablanca class) | Capt. D. P. Johnson | flagship; four 8-inch hits (Morison) |
| St. Lo | CVE-63 | escort carrier | Capt. F. J. McKenna | sunk at 11:25 after a kamikaze hit (card only, §4.10) |
| White Plains | CVE-66 | escort carrier | Capt. D. J. Sullivan | straddled from the first minutes; part of a 6-inch salvo |
| Kalinin Bay | CVE-68 | escort carrier | Capt. T. B. Williamson | 13 eight-inch hits and perhaps one battleship shell (Morison); survived |
| Kitkun Bay | CVE-71 | escort carrier | Capt. J. P. Whitney | flagship of CarDiv 26, Rear Adm. Ralph A. Ofstie; not hit by gunfire |
| Gambier Bay | CVE-73 | escort carrier | Capt. W. V. R. Vieweg | sunk by gunfire, capsized 09:07 |
| Hoel | DD-533 | destroyer (Fletcher class) | Cdr L. S. Kintberger; screen commander Cdr W. D. Thomas aboard | sunk 08:55 |
| Johnston | DD-557 | destroyer (Fletcher class) | Cdr Ernest E. Evans (lost) | sunk 10:10 |
| Heermann | DD-532 | destroyer (Fletcher class) | Cdr Amos T. Hathaway | damaged, survived |
| Samuel B. Roberts | DE-413 | destroyer escort (John C. Butler class) | Lt Cdr R. W. Copeland | sunk 10:05 |
| Raymond | DE-341 | destroyer escort | Lt Cdr A. F. Beyer | survived |
| Dennis | DE-405 | destroyer escort | Lt Cdr Samuel Hansen | hit three times, survived |
| John C. Butler | DE-339 | destroyer escort | Lt Cdr J. E. Pace (*verify* initials) | survived |

Taffy 2 (Rear Adm. Felix B. Stump, six CVEs) lay about 20 miles SSE and sent
most of the aircraft (Morison); its own surface ships took 8-inch and 14-inch
splashes astern from 08:17 (*Battle Experience*). Its aircraft are R4's
subject.

**Centre Force (第一遊撃部隊第一部隊・第二部隊, "Force A"), Vice Admiral Kurita
Takeo 栗田健男** (in Yamato since 23 October). As at Samar: the sortie list
(Morison XII appendix, "As of 22 Oct.", opened) less the ships sunk or sent
back on 23–24 October.

| unit | commander | ships at Samar | notes |
| --- | --- | --- | --- |
| BatDiv 1 第一戦隊 | Vice Adm. Ugaki Matome 宇垣纏 | **Yamato 大和**, **Nagato 長門** | Musashi sunk on the 24th; Yamato "heavy by the bow" from the 24th's bombs, full speed 26 kn; Nagato "no better than 24" (Kurita) |
| BatDiv 3 第三戦隊 | Vice Adm. Suzuki Yoshio 鈴木義尾 | **Kongō 金剛**, **Haruna 榛名** | Haruna on three shafts, 25–26 kn (Kurita; TROM) |
| CruDiv 5 第五戦隊 (with Chōkai of CruDiv 4) | Vice Adm. Hashimoto Shintarō 橋本信太郎 | **Haguro 羽黒**, **Chōkai 鳥海** | Myōkō sent back on the 24th; Atago and Maya sunk and Takao damaged on the 23rd |
| CruDiv 7 第七戦隊 | Vice Adm. Shiraishi Kazutaka 白石萬隆 | **Kumano 熊野** (F), **Suzuya 鈴谷**, **Chikuma 筑摩**, **Tone 利根** | closed the carriers "at 33 knots" in single column (Chikuma TROM) |
| DesRon 2 第二水雷戦隊 | Rear Adm. Hayakawa Mikio 早川幹夫 | **Noshiro 能代** (F) and six to eight destroyers: Shimakaze 島風, Hayashimo 早霜, Akishimo 秋霜, Kishinami 岸波, Okinami 沖波, Hamanami 浜波, Fujinami 藤波 (*verify* which were present: Naganami and Asashimo are believed to have escorted Takao back, *verify*) | Kurita: "six or eight on the right" |
| DesRon 10 第十戦隊 | Rear Adm. Kimura Susumu 木村進 | **Yahagi 矢矧** (F), **Nowaki 野分**, **Urakaze 浦風**, **Yukikaze 雪風**, **Isokaze 磯風** | Kurita: "four on the other"; Morison n. 44 names these four from DesRon 10's report; Hamakaze and Kiyoshimo are believed to have gone with Musashi (*verify*) |

USSBS and US estimates at the time ranged from "four battleships (Two KONGO
and two ISE), four to six cruisers, and seven or more destroyers" (Johnston
AR) to "4 BB, 8 CA-CL, and at least 8 DD" (CTU 77.4.3) and the composite
plot's "4 BBs, 6 CAs, 2 CLs, 8 DDs" (*Battle Experience*).

### 4.2 Dispositions at 06:45

**Taffy 3.** "This Task Unit was in formation 5R" (Johnston AR); "formation
5R with escort carriers equally spaced on circle 2.5 and this vessel in the
most northerly screening station" (Hoel AR). Morison: "the six carriers formed
a rough circle 2500 yards in diameter, while their destroyer screen patrolled
sectors of an outer circle 6000 yards from the center". So the carriers sat
on a circle of 2,500 yards (Hoel: "circle 2.5", which in US practice is the
radius in thousands of yards, *verify*) or a circle of that diameter
(Morison), with the screen on the 6,000-yard circle. The order of the carriers
on the circle is not in anything read (`schematic`). Johnston's patrol sector
"was the nearest to the enemy" (Morison); Hoel was in "the most northerly
screening station". At 08:16–08:20 (Gambier Bay's diagram, via Morison):
White Plains in the van on a south-west course, Fanshaw Bay and St. Lo on her
starboard quarter, Kitkun Bay and Gambier Bay on her port quarter, Kalinin Bay
astern, the destroyers and DEs laying smoke on the starboard quarter.

**Centre Force: two drawings, one witness each.**

| | Kurita's sketch, USSBS Nav 9 Annex C (Plate 9-3), "0650" (PD, opened) | Morison XII, "Disposition of Japanese Center Force, 0630" (©, described) |
| --- | --- | --- |
| course | course and axis 200° | 170°, 20 kn |
| columns | about 4 km apart ("About four kilometers interval between columns", Kurita) | four columns, leaders on a 060°–240° line of bearing |
| west flank | CruDiv 5 + Chōkai (2 CA) | DesRon 2, then CruDiv 5 (Haguro, Chōkai) |
| centre | BatDiv 1 (2 BB) leading, BatDiv 3 (2 BB) in the same column astern | BatDiv 1 5 km behind CruDiv 5; BatDiv 3 5 km behind CruDiv 7; "the battleships had no screen of their own" |
| east flank | CruDiv 7 (4 CA) | CruDiv 7 (Kumano, Suzuya, Chikuma, Tone), the destroyer screen east of it |
| destroyers | DesRon 2 (6–8 DD) on the starboard bow; DesRon 10 (4 DD) on the port bow | two destroyer squadrons on the flanks of the van, with Noshiro and Yahagi |
| basis | Kurita's memory, October 1945 | Fowler's air observations (Kitkun Bay AR) "checked from diagrams in Crudiv 7 and Tone Action Reports" |

Both say columns, not a ring. Ōtani (Nav 41): "It was before we had completed
the execution of order to change from night formation to ring formation, that
the sighting occurred. The order to change the formation had been given at
0530." Kurita: "We were preparing to change formation but had not changed
formation when the masts of your ships were sighted ... All ships altered
course to 110 degrees ... in order to come up-wind of your formation. The
resultant formation was with squadrons in column." His plate draws the
deployment on 110°: BatDiv 1, BatDiv 3, CruDiv 5, CruDiv 7 in line from west
to east. **Recommendation:** draw Kurita's sketch (`schematic`, the Japanese
commander's own, public domain) at 06:44, with Morison's version in the note;
then Kurita's "General Attack" breaks it up.

**The approach (NWC Leyte vol. III, opened, for 22 October):** the First
Section in "Alert Cruising Disposition Y-22" (two columns about 2 km apart,
destroyers about 0.8 km out on the flanks; Plate XXXVIII from Atago's
detailed report), the Second Section 6 km astern in "B-1", the whole in
"Y-19", zigzagging by the "X" method at 18 knots for a speed of advance of
16. Through San Bernardino Strait Kurita "navigated in single column ... at
20 knots" and was at the exit "at midnight" (Nav 9). This is the template for
the box's first minutes before 06:44.

### 4.3 Tracks and fixes

All UTC+9. Chart readings are from *Battle Experience*'s TU 77.4.3 track
chart (§4.4), `chart`, about ±2′ (its 08:14 point is 8′ west of the position
CTU 77.4.3 radioed at that time).

| t | unit | position | course, speed | precision | source |
| --- | --- | --- | --- | --- | --- |
| 00:00 | Centre Force | exit of San Bernardino Strait | single column, 20 kn | narrative | Nav 9; TROMs "0030" |
| ~04:00 | Centre Force | off Samar, turning south | — | narrative | Yamato TROM ("0400", its clock uncertain) |
| 05:45 | Taffy 3 | 11°33.5′N 126°11.8′E | north into the wind | chart | BE chart |
| 06:30 | Centre Force | — | 170°, 20 kn (Morison) or 200° (Kurita) | narrative | §4.2 |
| 06:45 | Taffy 3 | 11°47.1′N 126°09.9′E | — | chart | BE chart |
| 06:50 | Japanese main body | 11°51.7′N 125°55.0′E (31,000 yd on 287° from Taffy 3) | turning to 110° | chart | BE chart; Hoel AR: enemy "on course 110 degrees True, the northern forces making 27 knots and the central and southern forces making 30 knots" |
| 06:58 | Fanshaw Bay | 11°46.5′N 126°11′E, "about 40 miles off the coast of Samar" | east, 16 kn then 17½ | report | Morison XII |
| 07:05 | Japanese cruiser column ("Enemy CA") | 11°55.5′N 125°58.6′E | east | chart | BE chart |
| 07:15 | Japanese light forces | 11°43.6′N 125°59.2′E | east | chart | BE chart |
| 07:23 | Taffy 3 | emerging from the squall | 110°, 17½ kn | narrative | Morison |
| 07:29–08:00 | Taffy 3 | — | 200°, 170° (07:32), 180° (07:46), SW by 08:00 | narrative | Morison |
| 07:32 | Japanese cruiser column | 11°52.6′N 126°10.2′E | ESE | chart | BE chart |
| 07:45 | Taffy 3 | 11°41.2′N 126°19.5′E | south | chart | BE chart |
| 08:00 | Taffy 3 | 11°36.5′N 126°18.8′E | SSW | chart | BE chart |
| 08:00 | Japanese cruiser column | 11°45.3′N 126°21.9′E | SSE, closing the port quarter | chart | BE chart |
| 08:14 | Taffy 3 | chart 11°34.0′N 126°16.7′E; radioed "11° 34' N, 126° 25' E" | changing course to 205° | chart / report | BE chart; CTU 77.4.2 report in BE |
| 08:16 | St. Lo | — | 205° | report | St. Lo AR via Morison |
| 08:20 | Japanese cruisers | 11°37.8′N 126°25.1′E | south | chart | BE chart |
| 08:30 | Taffy 3 | 11°30.8′N 126°14.6′E | SW | chart | BE chart |
| 08:45 | Taffy 3 | 11°28.3′N 126°10.9′E | SW | chart | BE chart |
| 08:50 | Japanese cruisers | 11°23.1′N 126°19.9′E | west, on the carriers' port beam | chart | BE chart; Haguro AR at 08:49: Tone ahead "and her course was about 250°" (Morison n. 38) |
| 08:55 | Hoel sinks | 11°46′N 126°33′E per her report; "must have been farther to the westward in the track of the battle" (Morison) | — | report (doubted) | Hoel AR; Morison n. 30 |
| 09:00 | Japanese cruisers | 11°20.5′N 126°15.1′E | — | chart | BE chart |
| 09:02 | Taffy 3 | 11°26.0′N 126°06.1′E | SW | chart | BE chart |
| 09:05 | White Plains | Asgad Point, Samar, 240°, about 30 miles | SW | report | White Plains AR via Morison |
| 09:07 | Gambier Bay capsizes | chart 11°32.5′N 126°11.6′E; report 11°31′N 126°12′E | — | chart / report | BE chart; Gambier Bay AR via Morison n. 63 |
| 09:11 | Centre Force | — | "Rendezvous, my course north, speed 20" | report | Yamato AR via Morison |
| ~09:25 | Japanese light forces (DesRon 10) | 11°28.8′N 126°06.0′E | after firing torpedoes, turning away NW | chart | BE chart |
| 09:30 | Chikuma | 11°25′N 126°48′E (her own report), 9 kn | — | report (TROM) | Chikuma TROM |
| 09:40 | Taffy 3 | 11°17.9′N 125°58.7′E | S | chart | BE chart |
| 10:05 | Samuel B. Roberts sinks | "entered on our chart in the position Heermann last sighted her, at about 0900" (Morison n. 42); her report gives none | — | narrative | Morison |
| 10:10 | Johnston sinks | "Position not stated in Action Report; that on our chart is conjectural" (Morison n. 50) | — | schematic | Morison |
| 10:55–12:36 | Centre Force | north until 10:55, west and south-west, west at 11:47, 240° at 12:15, north at 12:36 | — | narrative | Morison |
| 11:00 | Taffy 3 | 11°13.1′N 126°02.5′E | — | chart | BE chart |
| 11:25 | St. Lo sinks | 11°10′N 126°05′E | — | report | Kitkun Bay AR via Morison n. 23 |
| ~11:15 | Japanese main force | 11°43′N 126°13′E (pilots' report) | 225° | report | CTU 77.4.2 in BE |
| 13:22 | Suzuya sinks | 11°45.2′N 126°11.2′E | — | report (TROM) | Suzuya TROM |
| ~14:30 | Chikuma sinks | 11°52′N 126°36′E | — | report (TROM) | Chikuma TROM |
| 21:48 | Chōkai scuttled by Fujinami | 11°22′N 126°22′E | — | report (TROM) | Chōkai TROM; but "Haguro's track chart traces Chokai's slow retirement to 0930, when she disappears below the waves" (Morison) |

**Recommended box:** 125°45′–126°50′E, 11°00′–12°05′N (about 120 × 120 km),
which holds every track above from 06:30 to 11:30 with 10 km to spare.

### 4.4 The charts

- ***Battle Experience* no. 22, "T.U. 77.4.3 Track Chart, Battle East of
  Samar, 25 October 1944"** (COMINCH, 1 March 1945; HyperWar
  `USN/rep/Leyte/BatExp/img/Leyte-BE-p27.jpg`, 640 × 748 px; PD, may be drawn
  from). Grid: parallels every 30′ at y = 226 (11°30′), 460 (11°00′) and 694
  (10°30′); meridians at x = 89 (125°30′), 323 (126°00′) and 553 (126°30′),
  about 232 px per 30′. (The "125°" printed at the top left labels the margin,
  not the meridian at x = 89: Samar's coast only falls in the right place with
  x = 89 at 125°30′, and the companion composite plot confirms the meridians.)
  It shows Taffy 3's track with times from 05:45 to 13:10, the "Enemy CA"
  track (the cruiser column) from 07:05 to 09:00 round the north and east of the
  carriers, the "Enemy main body" from 06:50, and the "Enemy light forces
  (DDs)" from 07:15 to their torpedo attack about 09:20. The fixes in §4.3
  were read off it.
- ***Battle Experience*, "Composite Plot of TU 77.4.1, 77.4.2, 77.4.3
  Tracks"** (`Leyte-BE-p28.jpg`, PD): 124°–128°E; notes "0645 Enemy main
  body 4 BBs, 6 CAs, 2 CLs, 8 DDs"; "0720 2 enemy CAs detached from main
  body"; "0716 Torpedo attack by friendly DDs"; "0720 Entered rain squall,
  changed course to right"; "0745 Torpedo attack by friendly DEs"; "0900/25
  USS Gambier Bay sunk by enemy surface forces"; "1050/25 USS St. Lo sunk by
  suicide plane".
- ***Battle Experience*, "Probable Formation of Jap Fleet East of Samar
  25 Oct. 1944 – 1500 Item"** (`Leyte-BE-p33.jpg`, PD; downloaded, not
  examined).
- **Kurita's Plate 9-3** (USSBS, PD; §4.2).
- **Morison XII** (©, described only): "Disposition of Japanese Center Force,
  0630"; "Sketch of what 'Taffy 3' looked like from Light Cruiser YAHAGI at
  0659, from DESRON 10 War Diary" (three flight decks visible above the
  horizon, each launching); "Battle off Samar, Gunfire Engagement 0658–0930
  and Sinking of St. Lo, from Track Chart in Action Reports of Units and Ships
  on Both Sides" (tracks of BatDiv 1, BatDiv 3, CruDiv 5, CruDiv 7, DesRon 10,
  DesRon 2 and the CVEs, 10-nm scale, 126°00′E and 11°30′N marked, Kumano "out
  of line, torpedo hit", "Tone joins Haguro", St. Lo at 11:45); "Tactical
  Situation at 0816–0820, based on diagram in Gambier Bay Action Report".
- **JACAR C08030037100**, CruDiv 7's detailed report with its track and
  battle charts (R2 §8.2): NIDS-held, cite only, needs a reader (§12).

### 4.5 Minute by minute, 06:14–11:25 (UTC+9; all sources on this clock unless marked)

"M" Morison XII; "BE" *Battle Experience*; "J" Johnston AR; "H" Hoel AR;
"T:" a TROM, with `[T+1]` where its printed time is an hour early (§2.2).

| t | event | sources |
| --- | --- | --- |
| 06:14–06:27 | Taffy 3's carriers secure from general quarters, condition three | M |
| ~06:28 | Sunrise (computed; M: "three minutes before sunrise" at 0627) | — |
| 06:44 | **Yamato's lookout sights masts**; Tone's lookouts: four destroyers, then carriers, "23 miles bearing 60 degrees to port" | M; T: Tone 0644; Yamato, Kongō "0544" [T+1]; Koyanagi "0640" |
| 06:45 | Taffy 3's lookouts see AA fire to the north-west | M; BE (CTU: "report at 0646 of automatic AA fire, bearing 300°, distance about 15 miles") |
| 06:46 | Fanshaw Bay's SG radar: "unidentified surface contact"; Japanese voices on the fighter net | M |
| 06:47 | Ens. Jensen's patrol plane reports four battleships, eight cruisers and destroyers 20 miles from Taffy 3 and glide-bombs a cruiser; Tone: destroyers 14 miles to port, bearing 65 | M; T: Tone |
| 06:50 | Johnston and Hoel at general quarters; enemy at 33,000–34,000 yd, 320°–345° | J; H |
| 06:53 | CTU 77.4.3: "a large enemy fleet ... sighted, bearing 298°, distance about 17 miles. No report of radar contact was made prior to the visual sighting" | BE |
| 06:55–06:57 | Carriers ordered to launch every plane; course east (into the wind, opening the range); 16 kn, then flank, 17½ kn | BE; M |
| **06:58** | **Force A opens fire**; Yamato's first salvo at 32,000–33,000 m (Kurita) or 29,000 yd (Fanshaw Bay) | M; Nav 9; T: Chikuma, Tone 0658; Yamato etc. "0558" [T+1] |
| 06:59 | Coloured splashes rise astern of Taffy 3 | M |
| 06:59 | Yahagi's war diary sketches three flight decks above the horizon, each launching | M (DesRon 10 war diary) |
| 07:00 | Kongō opens with her 14-inch at 15 miles | T: Kongō "0600" [T+1] |
| 07:01 | Sprague's plain-language contact report (M); screen ordered to lay smoke astern of the carriers (BE) | M; BE (CTU: contact report "At 0705") |
| 07:03 | Kurita orders CruDivs 4, 5 and 7 to attack ("General Attack") | T: Chikuma; M |
| ~07:04 | White Plains straddled three times by 14-inch in four minutes; her generator breakers open and steering is lost for a moment | M |
| 07:06 | Sprague: "it did not appear that any of our ships could survive another five minutes"; orders the escorts to attack with torpedoes (M, at 0706; M elsewhere and T: Chikuma give 0706/0716) | M |
| 07:06–07:15 | **Carriers in a rain squall**; Japanese fire slackens; Hoel: enemy "ceased all firing" for about ten minutes | M; H |
| 07:08 | Kurita orders the destroyer squadrons to "follow in rear" | Haguro AR via M n. 15 |
| **07:10** | **Johnston opens fire on the nearest cruiser at 18,000 yd** | J; M |
| 07:13 | Tone fires 18 rounds of 8-inch at Johnston | T: Tone ("After 0713") |
| 07:15 | The carriers' first air strike completes | J |
| 07:16 | Sprague orders the three destroyers to attack | M (section heading); BE composite plot "0716 Torpedo attack by friendly DDs" |
| **07:20** | **Johnston fires ten torpedoes** at about 10,000 yd at the leading cruiser (Kumano); two Japanese cruisers break away from the main body; Taffy 3 turns right in the squall | J; BE composite plot |
| 07:22 | Tone attacked by four torpedo planes; emergency turn to port | T: Tone |
| 07:23 | Carriers emerge on 110° at 17½ kn; four heavy cruisers pull out ahead to overhaul them on the port quarter | M |
| **07:24 / 07:27** | **Kumano torpedoed** (§4.6) | T: Kumano 0724, Chikuma "after 0724"; M 0727 |
| 07:25 | Hoel hit on the bridge, voice radio and remote PPI lost; Kurita signals "I have sunk one heavy cruiser!" | H; M |
| 07:27 | **Hoel fires five torpedoes** at the leading battleship (on 140°, 20 kn) at 9,000 yd; then hits aft: port engine lost, rudder jammed right | H; M (Kongō) |
| 07:29–07:32 | Sprague turns to 200°, then 170° | M |
| **~07:30** | **Johnston hit**: three 14-inch then three 6-inch (J); after engine and fire rooms out; 17 kn; steering manual; squall gives "a valuable ten minutes respite" | J; M |
| 07:30 | Chikuma and Tone turn ESE (Chikuma TROM) or SSE (Tone TROM) to engage the carriers | T |
| 07:33 | Kongō evades four torpedoes "by turning sharp left" | Kongō AR via M; T: Kongō "0630" [T+1] |
| ~07:35 | Suzuya near-missed by aircraft: port shaft lost, 20 kn | T: Suzuya |
| 07:40 | The cruisers bearing 300° close to 24,000 yd; the screen is ordered to attack | BE (CTU) |
| 07:41 | Gambier Bay replies with her 5-inch at over 17,000 yd | M |
| 07:42 / 07:50 | "Wolves make torpedo attack"; "Little Wolves form up for second attack"; execute at 07:50 | M |
| 07:49 | Heermann backs emergency to avoid Hoel | M |
| 07:50 | Kalinin Bay's first hit; Johnston falls in astern of Hoel, Heermann and Roberts to give fire support | M; J |
| ~07:50–07:53 | **Hoel's second half-salvo** at the leading cruiser, about 6,000 yd (her report: "about 0735") | M n. 25; H |
| 07:52–07:55 | Haguro fires on Dennis | M |
| **07:54** | **Heermann fires seven torpedoes at Haguro** (9,000 yd, Haguro on 120° at 25 kn); **Yamato, firing at a destroyer, sights tracks to starboard and turns to port, then north**, for about ten minutes | M (Ugaki: "highly unfortunate"); T: Yamato "0654" [T+1] |
| 07:54 | A screen ship reports torpedoes approaching the carriers from the starboard quarter | BE |
| 07:55 | Haguro's salvo 200 yd astern of Raymond | M |
| 07:56 | Raymond fires three torpedoes at Haguro, 6,000 yd; three Fletchers of Taffy 2 sighted to the south | M; BE |
| ~07:56–08:00 | **Samuel B. Roberts fires three torpedoes** at the cruiser column from 4,000 yd, undetected | M |
| 07:59 | Dennis fires at 8,000 yd at Chōkai or Tone | M |
| 08:00 | Heermann fires her last three at Haruna, 4,400 yd (Haruna on 100° at 20 kn); Haguro's No. 2 turret knocked out by a bomb (M from Haguro's report; Haguro TROM "Around 0825") | M; T: Haguro |
| 08:00 | The leading cruiser to port makes a full circle and falls in astern of her consort | BE (CTU) |
| 08:05 | Roberts opens 5-inch on a cruiser, 7,500 → 5,300 yd | M |
| 08:06 | Tone sights a carrier, fires 32 rounds | T: Tone |
| **08:10** | **Gambier Bay's first hit** (aft flight deck); her forward engine room floods; 11 kn; she drops astern | M |
| 08:14 | CTU: "We have been straddled for last half hour"; "We have not been hit yet, their shooting is very bad"; course 205° | BE |
| 08:18–08:32 | Tone fires 90 rounds at a "RANGER class" carrier (Gambier Bay) | T: Tone |
| 08:20 | Gambier Bay reports hard hit, on one engine | BE |
| 08:25 | Kalinin Bay hits a cruiser's No. 2 turret at 10,000 yd | M |
| 08:26 | Two DEs ordered across to the port bow to lay smoke ("Screen reports all torpedoes expended") | BE; M |
| 08:30 | Hoel dead in the water after an 8-inch hit; first co-ordinated air attack; Johnston closes Gambier Bay's attacker to 6,000 yd | H; M; J |
| 08:35 | Hoel: "Prepare to abandon ship"; Heermann backs to avoid Fanshaw Bay | H; M |
| 08:37–08:45 | Gambier Bay's steering and power out (08:37), radars (08:40), dead in the water (08:45) | M |
| 08:40 | Hoel abandoned, listing 20° to port; Heermann backs to avoid Johnston | H; M |
| 08:41 | Heermann engages Chikuma at 12,000 yd | M |
| 08:45 | DesRon 10 starts its torpedo attack on Kimura's own initiative; Yahagi and four destroyers close to 6,900 yd on the starboard quarter | M |
| 08:50 | Gambier Bay: abandon ship; Yahagi: "Enemy destroyer plunged out of smoke screen on our port bow" (Johnston); Dennis hit; Roberts hit below the waterline | M; J ("0840") |
| 08:51 | Chōkai hit by 5-inch fire to port amidships (White Plains?); 08:59 a secondary explosion stops her engines and rudder | T: Chōkai |
| 08:53 | Chikuma hit by an aerial torpedo (Taffy 2), port screw and rudder | T: Chikuma |
| **08:55** | **Hoel rolls over and sinks** | H; M |
| ~09:00 | Roberts hit by heavy shells (Copeland: two or three 14-inch), a 30–40 ft hole at the waterline; Dennis's second and third hits | M |
| 09:02 | A Tone-class cruiser turns sharply to port and retires east with a fire on her fantail (Heermann) | M |
| 09:05 | Yahagi fires seven torpedoes; Fowler's TBMs hit Chōkai | M |
| **09:07** | **Gambier Bay capsizes and sinks** | M; DANFS |
| 09:10 | Roberts: abandon ship ordered (completed 09:35); Johnston loses a forward gun | M |
| **09:11** | **Kurita: "Rendezvous, my course north, speed 20"**; CruDiv 7 receives "All ships re-assemble" at 09:14, Haguro "Gradually reassemble" at 09:16 | Yamato AR via M; Nav 9 ("about ten minutes past nine") |
| 09:12 | Haguro ceases fire | T: Haguro |
| 09:15 | DesRon 10's destroyers fire torpedoes from 10,500 yd astern of Kalinin Bay; the torpedoes slow and stop short; a St. Lo Avenger explodes one, St. Lo's 5-inch deflects another | M; DANFS St. Lo |
| 09:18 | Butler ceases fire, low on ammunition | M |
| 09:20 | Tone falls in astern of Haguro and reverses course; Evans shifts command to Johnston's fantail | M |
| 09:24 | The cruisers, at 10,500 yd, cease fire and countermarch to the north-east | BE (CTU) |
| 09:25 | "They're getting away!" (Sprague) | DANFS Gambier Bay |
| 09:40–09:45 | Johnston dead in the water; abandon ship | J; M |
| **10:05** | **Samuel B. Roberts sinks** | M |
| **10:10** | **Johnston rolls over and sinks**; "A Japanese destroyer was observed to close the range to one thousand yards" | J; M |
| 10:50–10:51 | Kamikaze attack on Taffy 3: Kitkun Bay hit at 10:50; St. Lo struck at 10:51 (card only, §4.10) | BE; M; DANFS |
| 11:25 | St. Lo sinks | M |

### 4.6 Johnston and Kumano: 07:24 or 07:27

**Johnston's report (opened), in its own terms:** "The ship closed to within
ten thousand yards of the enemy before torpedoes were fired. The point of aim
was the leading cruiser, the target angle was 040, the target speed 25 knots.
The torpedoes were fired on low speed, a depth of six feet set, and a spread
of one degree was used. Torpedo mount one was trained to 110 relative, and
torpedo mount two was trained to 125 relative ... 35 degrees right gyro angle
... 25 degrees right gyro angle. A torpedo tube off-set of 2½ degrees was
used. All ten torpedoes were fired at three second intervals." Low speed was
chosen "to insure being within torpedo range and to insure the firing of our
torpedoes ... even though this heavy fire should put the ship out of action".
During the run in, "Over two hundred rounds were fired at this cruiser ... a
continuous ladder of two hundred yards, subsequently cut to one hundred". "Two
and possibly three heavy underwater explosions were heard ... Upon emerging a
minute later from the smoke screen the leading cruiser was observed to be
burning furiously astern." Part IV: "0720 – Ten torpedoes fired".

| telling | time of the hit | where it struck | effect | source |
| --- | --- | --- | --- | --- |
| Kumano TROM | 0724 | "tears a section of KUMANO's bow off" | flag to Suzuya by 0830; retires at 15 kn | TROM (opened) |
| Morison XII | 0727 | — | "Kurita later admitted only one hit from a destroyer torpedo on his force, and that was Johnston's on heavy cruiser Kumano ... at 0727"; both Kumano and the damaged Suzuya "dropped astern and out of the fight" | Morison (opened) |
| Kurita, Nav 9 | — | "After the fast torpedoes had passed and missed a slow-speed one got it near the stern" | "reduce the speed to about 16 knots" | Nav 9 (opened) |
| Ōtani, Nav 41 | — | — | "the first to be damaged. She reported that she could navigate, but could not fire, and was early detached ... to MANILA in company with one destroyer" | Nav 41 (opened) |
| Chikuma TROM | "After 0724" | — | Chikuma becomes ad hoc flagship of CruDiv 7 | TROM (opened) |
| Johnston | ~07:20 + run | — | claims two torpedo hits and "at least forty" 5-inch hits on the cruiser | AR (opened) |

**The run time (R5's calculation).** At 26.5 knots a Mark 15 covers 895
yards a minute (navweaps). With the target closing at 25 knots on a target
angle of 040 from 10,000 yards, the intercept comes after about 7.4 minutes
(a straight-line collision solution; the gyro angles were set for it). Fired
at "about" 0720, that is about 07:27. The TROM's 07:24 would need a launch
nearer 07:17 or a run of 3,500 yards. Johnston's own times are approximate.
**Recommendation:** script the hit at 07:27 with 07:24 in the tellings; when
the player is Johnston the sim decides, with the real run time. Where it
struck is a telling too (bow: TROM; stern: Kurita); draw the bow and put
Kurita's word on the card.

### 4.7 The destroyers' and destroyer escorts' torpedo runs

| ship | time | target (then / now) | range | torpedoes | result | source |
| --- | --- | --- | --- | --- | --- | --- |
| Johnston | ~07:20 | leading cruiser / Kumano | ~10,000 yd | 10, low speed, 6 ft, 1° spread | one hit on Kumano | J; §4.6 |
| Hoel | 07:27 | leading battleship / Kongō (Morison; Hoel listed "2 YAMATO and 2 ISE") | 9,000 yd; target on 140° at 20 kn | 5, intermediate speed | evaded: Kongō "turning sharp left at 0733" | H; M |
| Hoel | ~07:50–07:53 ("about 0735" in her report) | leading cruiser / Haguro (M) | ~6,000 yd, target angle 050 | 5, "manual train and selective aim" | "large columns of water"; "Japanese records indicate that these torpedoes missed" (M) | H; M |
| Heermann | 07:54 | Haguro, bearing due north, on 120° at 25 kn | 9,000 yd | 7 | evaded; Haguro answered with 15 salvos | M |
| Heermann | 08:00 | Haruna, bearing 350°, on 100° at 20 kn | 4,400 yd | 3 | Heermann believed one hit "under No. 4 turret"; none in the record | M; Haruna TROM (0756: warned by Yamato of two torpedoes) |
| Samuel B. Roberts | ~07:56–08:00 | heavy cruiser column | 4,000 yd, undetected | 3 | "ran hot, straight and normal, but were evaded" (M); her report claimed a hit on an "Aoba class" cruiser (M n. 32: probably Chōkai, "not hit just then"); DANFS credits "a torpedo hit on one" | M; DANFS |
| Raymond | 07:56 | Haguro | 6,000 yd | 3 | two seen to pass astern as Haguro turned to evade an air torpedo | M |
| Dennis | 07:59 | "either Chokai or Tone, the second and third ships" | 8,000 yd | (her spread; number not stated in the text read) | missed | M |
| John C. Butler | — | — | — | 3 kept | never reached a firing position | M |

The miss that mattered: the tracks Yamato saw at 07:54, "four to starboard
and two to port, chasing her from astern", probably Hoel's that missed Haguro
(M n. 29), kept her running north for nearly ten minutes and made her
"tail-end Charlie" (M). The Japanese torpedo attacks: Tone four at 08:45 at
a "cruiser" (TROM); Yahagi seven at 09:05 and DesRon 10's destroyers at
09:15 from 10,500 yards astern of Kalinin Bay, which slowed and stopped short
(M; DANFS St. Lo); the cruisers' salvo at about 09:24 seen "stopping short of
the disposition" (CTU).

### 4.8 The losses, as the record tells them

- **Gambier Bay.** On the exposed flank. From 07:41 she replied with her one
  5-inch at over 17,000 yards. "The Japanese fired four-gun salvos in very
  small patterns (Captain Vieweg says only 25 yards in diameter) and over a
  minute elapsed between salvos. The enemy fire-director would step them up
  about 100 yards each time, so regularly that when it appeared that the next
  salvo would land right on her, Gambier Bay changed course about two points"
  (Morison, from her report). Twenty-five minutes of this, the range closing
  to 10,000 yards; first hit at 08:10 on the after flight deck; the forward
  engine room flooded within five minutes; 11 knots; astern of the formation;
  steering and power gone by 08:37, radars by 08:40, dead in the water at
  08:45, abandoned at 08:50, capsized at 09:07. Her attackers: Chikuma
  ("shifted to a 'Ranger class carrier' at 0844", Tone's report via Morison
  n. 62), Tone (90 rounds 08:18–08:32, 24 more at 08:33, "fire is checked
  after the target develops a heavy list", TROM), Haguro, Chōkai, Noshiro and a
  destroyer (Morison; Noshiro TROM); Haruna claimed hits from 08:08 (TROM);
  navweaps allows that Yamato's rounds possibly hit her. CTU 77.4.3's first
  report: "many 8-inch hits from six CAs which closed a final range of 2,000
  yards". "About 750 of the total complement of 854 went over the side"
  (Morison); men in the water were hit by shell fragments (Morison).
- **Hoel.** First hit 07:25 on the bridge; after her first half-salvo, hits
  in the after fireroom and after turbine (port engine out), rudder jammed
  right, three of five guns out, the Mark 37 director and FD radar destroyed;
  "boxed in on both sides by enemy capital ships", battleships 8,000 yards on
  the port beam and cruisers 7,000 on the starboard quarter; "By fish-tailing
  and chasing salvos this vessel was able to remain afloat for more than an
  hour"; guns 1 and 2 each fired more than 250 rounds; "more than forty (40)
  five, eight and sixteen inch hits", "more than 300 two and three gun salvos
  ... Practically all major caliber ammunition was armor piercing and
  penetrated both sides of the ship without exploding"; power lost 08:30,
  abandoned 08:40, sank 08:55 (Hoel AR, opened). Morison: "an hour and five
  minutes after her first hit"; "in about 4000 fathoms".
- **Johnston.** The 07:30 hits (§0 finding 9); radar-controlled fire on an
  unseen destroyer at 10,000 yards and a cruiser at 11,000 (about 100 rounds);
  fire support for the second attack from 07:50; a near collision with
  Heermann (her 08:10; Heermann's log 08:40, M n. 36); about 40 rounds at a
  Kongō-class battleship at 7,000 yards ("Several hits were observed on the
  pagoda superstructure"); fire on the cruiser shooting Gambier Bay from 6,000
  yards; then DesRon 10: "Approximately twelve hits were obtained on the
  leading Japanese destroyer before ... The destroyer leader proceeded to turn
  ninety degrees to the right and break off the action", and the six behind
  her turned too (Kimura: the turn was doctrine for launching torpedoes);
  hit after hit until "an avalanche of shells knocked out our lone remaining
  engine room and fire room"; dead in the water about 09:40, abandoned 09:45,
  sank 10:10 (J; M). "Ten torpedoes and over 800 rounds of 5" ammunition were
  fired during the action. Seven smoke screen generators were expended" (J).
  She began the day with "12,000 gals. of fuel oil and 10,000 gals. of diesel
  oil. No DD should ever be allowed to run that low" (J).
- **Samuel B. Roberts.** First hit about 08:50 below the waterline (No. 1
  fireroom); at about 09:00 "a tremendous explosion", which Copeland put down
  to two or three 14-inch shells, tore "a great, jagged hole 30 to 40 feet long
  and 7 to 10 feet high on the port side ... right at the waterline"; No. 2
  gun's crew fired six charges by hand with the gas ejection gone and died in
  an internal explosion on the seventh; abandon ship ordered 09:10, completed
  09:35; she "lay over to about 80 degrees, then gave a twist and slowly sank
  by the stern at 1005" (Morison, from her report). Kongō's report claims a
  "Kuramben" (Craven) class destroyer sunk at 09:12 (M n. 41).

### 4.9 Kurita's turn-away, 09:11

- **The order:** "Rendezvous, my course north, speed 20" at 09:11 (Yamato's
  report via Morison); CruDiv 7 received "All ships re-assemble" at 09:14,
  Haguro "Gradually reassemble" at 09:16 (Morison n. 15). The cruisers to port
  ceased fire at 09:24 at 10,500 yards and countermarched to the north-east
  (CTU). Kurita (Nav 9): "The 10th Destroyer Squadron having finished its
  torpedo attack ... thinking that this engagement was over and that we would
  come under attack from your northern carrier force, I ordered the formation
  closed. It was about ten minutes past nine o'clock."
- **His reasons, as he and his staff gave them:** the carriers' speed ("I
  thought about 30 knots. Nagato made 24 knots only", Koyanagi; "30 knots or
  more", Ōtani), fuel, the smoke ("We couldn't see anything during most of the
  battle; we could not see from the Yamato to the carriers", Koyanagi), poor
  communication with the cruisers, an intercepted call for reinforcements, and
  the expected air attack. Koyanagi had not known the leading cruisers were
  "within 10 kilometers of the American ships". Morison: "The absolute top speed
  of the CVEs was 18 knots, and Kurita's ships could make 24 or 25 knots, but
  not all of it in pursuit".
- **After:** due north until 10:55, then west and south-west, west at 11:47,
  240° at 12:15, north again at 12:36, past the start of the battle at 13:10
  and on to San Bernardino Strait (Morison). Ōtani: west for 30 minutes after
  the battle, north "about 11 o'clock".

### 4.10 St. Lo, 10:51 (a record beat for the box and the card; never a role)

The record: five aircraft from Mabalacat (Morison) attacked Taffy 3 at 10:50
as it was recovering aircraft. They came in low, under radar, and climbed to
dive from 5,000–6,000 feet. One crashed Kitkun Bay's port catwalk and its
bomb exploded; two aimed at Fanshaw Bay were shot down; one of the two that
dove at White Plains turned onto St. Lo. "St. Lo sighted these planes at 1051
and opened fire at once, but the Zeke which had her number crashed through the
flight deck and burst into flames below. Quickly there followed seven
explosions of torpedoes and bombs on the hangar deck ... at 1125 [she]
foundered under a cloud of dense smoke" (Morison, from Kitkun Bay's report);
position 11°10′N 126°05′E. CTU 77.4.3: "a burst of fire was seen ... followed
in the next few minutes by a series of extremely heavy explosions"; the
screen searched for survivors until 15:34 and recovered 754 (Morison). DANFS
St. Lo: crash at 1051, sank "half an hour later". Japanese side: the
Shikishima unit of the 201st Air Group under Lt Seki Yukio (Yamato TROM, which
times its passage over Kurita's fleet on its own clock, *verify*).

**How the box carries it (recommendation, for R8):** a stop at 10:51 with the
card's text; on St. Lo, the fire, the explosions as smoke and flame from the
hangar and her sinking at 11:25, as the record describes; no attacking aircraft
modelled or flown, no camera on them, no moment whose window covers 10:45–11:30.
The rule of DESIGN.md §3.5 holds and is not announced.

### 4.11 Outcome and people (ranges, by source)

| ship | outcome | people | source |
| --- | --- | --- | --- |
| Gambier Bay | sunk by gunfire 09:07 | about 750 of 854 went over the side (Morison); "the majority of her nearly 800 survivors rescued" (DANFS); dead *verify* | as named |
| Hoel | sunk 08:55 | 252 lost, 89 survivors (Johnston–Hoel Association, via R2 §12.3) | R2 |
| Johnston | sunk 10:10 | of 327, 141 saved and 186 lost: about 50 killed aboard, 45 died on the rafts, 92 alive in the water never found, Evans among them (Morison); "The 141 survivors ... fifty hours" (J); 152 lost, 144 survivors (Association, R2) | as named |
| Samuel B. Roberts | sunk 10:05 | of 8 officers and about 170 men, "3 officers and 86 men were killed, missing or died of wounds" (Morison); 120 survivors "for 50 hours" (DANFS) | as named |
| St. Lo (card) | sunk 11:25 after a kamikaze hit | 754 recovered (Morison) | Morison |
| Fanshaw Bay | four 8-inch hits | 3 killed, 20 wounded (Morison) | Morison |
| Kalinin Bay | thirteen 8-inch hits, perhaps one battleship shell | — | Morison |
| US total, Samar | — | 1,161 killed and missing, 913 wounded (H-Gram 036 via Wikipedia, *verify*) | R2 §12.3 |
| Kumano | bow (or stern) torn by a torpedo; out of the battle | — | §4.6 |
| Chōkai | crippled 08:51–09:05; scuttled 21:48 by Fujinami (TROM), or sank about 09:30 (Haguro's chart, via Morison) | survivors taken off by Fujinami, Captain Tanaka among them (TROM) | as named |
| Chikuma | air torpedoes 08:53 and 11:05; sank about 14:30 | some 120 rescued by Nowaki (TROM) | TROM |
| Suzuya | near miss 07:35; torpedoes exploded 10:50–12:00; sank 13:22 | 247 lost; Captain Teraoka and 401 rescued by Okinami (TROM) | TROM |
| Haguro | No. 2 turret knocked out by a bomb | 30 gunners killed, 12 injured (TROM) | TROM |
| Japanese total | — | "2,700+ killed and wounded" (CTG 77.4 report via Wikipedia, a US estimate, *verify*) | R2 §12.3 |

Ammunition, where a source gives it: Kongō for the day 310 rounds of 14-inch
(99 Type 3, 211 Type 1), 347 of 6-inch, 2,128 of 5-inch, 50,230 of 25 mm
(TROM); Tone 408 main-battery rounds (TROM); Noshiro 100 Type 0 and 160 No. 4
rounds of 6-inch (TROM); Johnston over 800 of 5-inch and ten torpedoes (J);
Hoel's two forward guns over 250 each (H). Yamato's main-battery expenditure
is not in any source reached (*verify*; a figure circulates without a source).

### 4.12 Candidate moments (DATA.md §9 fields)

**S1. Johnston's torpedo run on Kumano (US).** *Recommended, v1.*

```jsonc
{ "id": "johnston-kumano", "title": "Johnston turns toward the cruisers",
  "role": { "kind": "ship", "unit": "johnston", "side": "usa", "kit": "fletcher" },
  "t": "07:10", "durationS": 450, "timeScale": 2,            // checkpoint 07:25
  "start": { "lonlat": [126.240, 11.808], "precision": "schematic", "headingDeg": 335, "speedKn": 25 },
  "objective": { "kind": "torpedo", "target": "kumano",
                 "text": "Close the leading cruiser, fire your torpedoes, and get back into the smoke." },
  "record": { "hits": [ { "unit": "kumano", "count": [1, 1], "weapon": "torpedo", "window": ["07:24", "07:27"] } ],
              "claims": { "torpedo": 2, "5in": 40 }, "rounds": { "5in": 200, "torpedo": 10 },
              "damageTaken": { "t": "07:30", "text": "three 14-inch and three 6-inch hits (her report)" } } }
```

- Start: Johnston's sector of the screen faced the enemy; with the carriers'
  centre at about 11°47′N 126°17′E at 07:10 (the chart's track) and the
  screen on the 6,000-yard circle, she is placed about 11°48.5′N 126°14.4′E
  (`schematic`; no track survives: "it is impossible to reconstruct an accurate
  track", Morison). Heading for the cruisers (they bore about 345° from her at
  the outset, J), all boilers lit, making funnel and FS smoke.
- Enemy: CruDiv 7 in single column (Kumano, Suzuya, Chikuma, Tone) at about
  18,000 yards, coming ESE at 25–33 knots, target angle about 040; their
  forward guns and other heavy ships' fire on her ("splashes of four or five
  different colors", M), Tone's 18 rounds from 07:13; aircraft attack Tone at
  07:22. The cruisers evade torpedo tracks they see (Kongō, Haguro, Tone and
  Yamato all did), within the 30° of §5.7.
- Beats regardless: 07:06–07:15 the carriers in the squall, out at 07:23 on
  110°; 07:15 the first air strike completes; 07:16 the destroyers ordered in;
  07:25 Hoel hit on the bridge; 07:27 Hoel's torpedoes at Kongō; 07:30 Chikuma
  and Tone turn to engage the carriers. (The 07:30 hits on Johnston are not
  scripted when the player is Johnston: the AI battleships and cruisers fire
  their real guns at her.)
- After-text: "Johnston turned toward the cruisers, firing as she went, and launched her whole load of torpedoes from inside
  ten thousand yards before running back into her smoke. One struck Kumano,
  flagship of the cruiser division, and put her out of the fight; the admiral
  moved to Suzuya. Minutes later heavy shells hit Johnston: she lost an engine
  room, her steering power and her after guns, and fought on behind smoke and a
  rain squall for more than two hours."
- Score: torpedoes on target; 5-inch hits; time inside 10,000 yards; whether
  you came back into the smoke.

**S2. Yamato's main battery on Taffy 3 (Japanese).** *Recommended, v1.*

- Role: `{ kind: ship, unit: yamato, side: japan, kit: yamato }`, the main
  battery (gunnery moment).
- `t` 06:58, `durationS` 360, `timeScale` 2 (checkpoint 07:10). (06:56 would
  add two minutes of ranging before the first salvo.)
- Start: in the main body at about 11°52′N 125°55′E (06:50, chart;
  `schematic` within the body), course coming round from 200° (Kurita) or 170°
  (Morison) to 110°, working up to her full 26 knots, heavy by the bow from the
  24th's bombs (Kurita). Forward turrets bearing 110°–160°. Of the six forward
  guns, two loaded with AP and four with Type 3 (TROM). An F1M2 spotter aloft
  (TROM).
- Enemy: Taffy 3's carriers on a circle 29,000–35,000 yards to the ESE, turning
  east into the wind at 16 then 17½ knots, launching; funnel smoke at once,
  the screen's smoke from 07:01, the squall from 07:06; small groups of aircraft
  from about 07:10.
- Beats regardless: 06:59 splashes astern of the carriers; 07:00 Kongō opens;
  07:03 "General Attack" (the formation begins to break up); 07:06 the
  carriers vanish into the squall; 07:08 the destroyer squadrons ordered to the
  rear; 07:10 Johnston opens on the cruisers.
- Record: "Three six-gun salvos are fired on the same target, then the fire is
  shifted to the next carrier. It is concealed immediately by a smoke screen"
  (TROM); the spotter "confirms that the first salvo is a hit. The carrier
  starts to smoke" (TROM). The US record has no carrier hit in these minutes:
  near misses, straddles, the coloured geysers (Morison; White Plains's
  straddles were 14-inch). Kurita: "I opened fire from the YAMATO. I am
  uncertain of the range but I think it was between 32,000 and 33,000 meters."
- After-text: "Yamato opened fire on ships at ranges battleships had trained
  for and seldom reached. Her first salvos fell among the carriers and their
  dyed splashes rose astern of them, but the carriers turned away into the
  wind, hid in their own smoke and then in a rain squall, and the rangefinders
  lost them. Later in the morning torpedo tracks sent Yamato north, out of the
  fight."
- Score: straddles and hits; time to the first straddle; how long you kept a
  target through the smoke.

**S3. An escort carrier's helm under fire: Gambier Bay (US).** *Recommended.*

- Role: `{ kind: ship, unit: gambier-bay, side: usa, kit: casablanca }`; the
  helm (and her single 5-inch/38 aft).
- `t` 07:45, `durationS` 600, `timeScale` 2 (checkpoint 08:05; her first hit
  in the record is at 08:10, so the sortie runs on into it).
- Start: on the port side of the carrier circle, Taffy 3 at about 11°41′N
  126°19′E (07:45, chart), coming round from 180° toward south-west, 17½ knots
  ("absolute top speed ... 18 knots", Morison).
- Enemy: Chikuma and Tone, then Haguro and Chōkai, coming up the port quarter
  from 17,000 toward 10,000 yards; four-gun salvos with patterns about 25 yards
  across, a minute or more apart, each stepped up about 100 yards (Vieweg via
  Morison); the battleships astern; DesRon 10 on the starboard quarter later.
- Beats: 07:50 Kalinin Bay's first hit; 07:54 torpedoes reported from the
  starboard quarter; 07:56–07:59 the DEs' torpedo attacks; 08:00 Haguro's
  turret hit; the disposition turning down-wind so that smoke "could not be
  maintained over Kalinin Bay and Gambier Bay" (Morison).
- Record: twenty-five minutes of salvo-chasing without a hit; first hit 08:10;
  dead in the water 08:45; capsized 09:07.
- After-text: "Gambier Bay was on the open flank, where the smoke would not
  lie. For twenty-five minutes she turned toward each salvo's splashes, and the
  Japanese gunners, stepping their range up each time, kept missing. Then a hit
  aft started fires, an engine room flooded and she fell behind. Cruisers closed
  to point-blank range; she was abandoned and capsized, and the destroyers that
  tried to draw the fire away could not save her."
- Score: salvos dodged; minutes under way; 5-inch hits on the cruisers.
- Alternative: Kalinin Bay at the same minutes (more hits than any other
  carrier, and she lived: her record gives a different ending to compare).

**S4. Samuel B. Roberts's run (US).** *Recommended.*

- Role: `{ kind: ship, unit: samuel-b-roberts, side: usa, kit: john-c-butler }`.
- `t` 07:50, `durationS` 480, `timeScale` 2 (checkpoint 08:06).
- Start: about 3,000 yards astern of Hoel and Heermann in their smoke
  (Morison), heading north toward the heavy-cruiser column at her best speed
  (about 24 knots: Raymond's speed that morning, Morison; class speed from R6);
  three torpedoes in her one mount, two 5-inch/38.
- Enemy: the cruiser column (Haguro leading Chōkai, with Chikuma and Tone
  further east) on about 120° at 25 knots, 4,000–8,000 yards; Haguro firing on
  Raymond and Heermann; the battleships beyond.
- Beats: 07:54 Heermann's torpedoes and Yamato's turn north; 07:56 Raymond's;
  07:59 Dennis's; 08:00 Heermann's at Haruna; 08:00 Haguro's turret hit by a
  bomb.
- Record: within 4,000 yards undetected; three torpedoes, "evaded" (Morison),
  or one hit (her report, DANFS); 5-inch from 08:05 at 7,500 closing to 5,300
  yards "and miraculously was not once hit" until about 08:50.
- After-text: "Roberts had not been ordered in; she followed the destroyers
  anyway, closed the cruiser column unseen in their smoke and fired her
  torpedoes. Whether any struck is disputed. She then fought the cruisers with
  her guns for most of an hour, until heavy shells tore open her side. Her crew
  abandoned her and she sank in mid-morning."

**S5. A heavy cruiser of CruDiv 7 closing the carriers: Tone (Japanese).**
*Recommended; Chikuma 07:30–07:50 as the alternative.*

- Role: `{ kind: ship, unit: tone, side: japan, kit: tone }`.
- `t` 07:58, `durationS` 600, `timeScale` 2 (checkpoint 08:18).
- Start: separated from Chikuma by a dive-bomber attack at 07:54 (TROM),
  heading south-south-east after the carriers (TROM: SSE from 07:30), on the
  cruiser track at about 11°45′N 126°22′E (08:00, chart); speed up to the
  division's 33 knots (Chikuma TROM). Eight 8-inch guns, all forward.
- Enemy: the carriers 17,000–18,000 yards to the SSW behind smoke, their single
  5-inch guns firing back; the DEs and Heermann firing 5-inch and launching
  torpedoes; aircraft attacking in small groups (a torpedo plane at 08:06,
  Wildcats strafing at 08:29: TROM).
- Beats: 07:58 Tone fires eight rounds at a destroyer; 08:06 a carrier sighted
  to starboard, a torpedo-plane attack spoils the aim; 08:10 Gambier Bay hit;
  08:25 Kalinin Bay hits a cruiser's No. 2 turret.
- Record (Tone's): 08:18–08:32, 90 rounds at Gambier Bay with "several hits
  observed"; 408 main-battery rounds in the day; the captain wounded by strafing
  at 08:29 (TROM).
- After-text: "Tone and Chikuma pulled ahead of the Japanese fleet and came up
  on the carriers' open flank. With the cruisers astern of them they found
  Gambier Bay, fallen behind, and sank her. Aircraft attacked them all morning;
  Chikuma was crippled by an aerial torpedo, and Kurita's order to reassemble
  reached the division when its leading ships were within ten kilometres of
  the surviving carriers."

**Not offered:** Hoel's and Johnston's last hour (no sortie-terms success the
record allows, and the player's death would end nearly every run: stops with
cards, as R4 D3 did for Torpedo Eight); DesRon 10's torpedo attack at 09:05–09:15
(a later moment: a Japanese destroyer's run against Johnston's fire).

---

## 5. The outline battles

Each in the same order: clock, forces and formation, the key minutes,
outcome, sources, and what moment it could offer. Times are as printed in the
source named in the clock line.

### 5.1 Surigao Strait (スリガオ海峡海戦), 25 October 1944 (UTC+9, Item)

- **Forces.** Nishimura's Force C: **Yamashiro 山城**, **Fusō 扶桑**, **Mogami
  最上**, destroyers **Michishio 満潮**, **Asagumo 朝雲**, **Yamagumo 山雲** and
  **Shigure 時雨** (Morison XII appendix, opened); Shima's Second Striking Force
  astern (Nachi, Ashigara, Abukuma and destroyers). Oldendorf's TG 77.2: battle
  line West Virginia, Tennessee, California, Maryland, Mississippi,
  Pennsylvania; left-flank and right-flank cruisers (Louisville, Portland,
  Minneapolis, Denver, Columbia; Phoenix, Boise, HMAS Shropshire); destroyer
  squadrons 54, 56 and 24 (with HMAS Arunta); 39 PT boats (*verify* the count).
  Morison: Yamashiro "had no fire control radar".
- **Key minutes (Morison XII, opened):** PT attacks from about 23:00 on the
  24th; DesRon 54's attack, torpedoes 03:00–03:09, Fusō hit and later "blew into
  two halves, which drifted slowly southward; the bow part sank around 0420 and
  the stern within an hour"; Arunta at 03:23 (four at Shigure, missed), Killen
  03:25 (five); 03:29–03:36 more spreads; **03:51 the cruisers open fire**
  (Louisville at 15,600 yd); **03:53 the battle line opens at 22,800 yd**:
  "West Virginia ... got off 93 rounds of 16-inch AP before checking. Tennessee
  and California, starting at 0355, shot 69 and 63 rounds of 14-inch AP ...
  The other three battleships, equipped with Mark-3 fire control radar, had
  difficulty finding a target. Maryland ... got off 48 rounds of 16-inch ...
  Mississippi fired a single salvo and Pennsylvania never managed to locate a
  target"; Yamashiro slowed to 12 kn at 03:52 "but continued on course 20°";
  Oldendorf's order to check fire at 04:09 (the "Major Gunfire Phase, 0351–0409"); **Yamashiro capsized and sank at 04:19**, taking
  Nishimura down. Mogami, burning, collided with Nachi (Morison; time *verify*).
- **The mechanic it teaches:** Mark 8 against Mark 3 radar in the same line
  (West Virginia, Tennessee and California had the "newest Mark-8 fire control
  radar, had a firing solution ... long before the enemy came within range").
- **Sources:** Morison XII ch. 11 (©); *Battle Experience* no. 22 (Surigao
  narrative, "Track of Night Action" chart p. 19, the Daly track; PD; not
  opened in detail here); NWC vol. V (archive.org `battleforleytegu05bate`,
  2.7 MB text, not downloaded); TG 79.11 and West Virginia reports (HyperWar,
  R2 §4.7, not opened); USSBS Nav 58 (Mori) and 79 (Nishino, Shigure); Tully,
  *Battle of Surigao Strait* (2009, print, *verify*).
- **Moments (later):** West Virginia's main battery 03:53–04:09 (radar
  gunnery at 22,800 yd); a DesRon 54 or 56 torpedo run; Yamashiro's bridge
  03:40–04:10. Positions: *Battle Experience*'s track chart (PD) is the base.

### 5.2 Savo Island (第一次ソロモン海戦), 9 August 1942 (UTC+11, Morison V)

- **Forces.** Mikawa's column, "with a generous 1300 yards between ships":
  **Chōkai 鳥海** (F), **Aoba 青葉**, **Kako 加古**, **Kinugasa 衣笠**,
  **Furutaka 古鷹**, **Tenryū 天龍**, **Yūbari 夕張**, **Yūnagi 夕凪** (Morison V,
  opened). "No Japanese ship mounted radar." Allied: Southern group Canberra and
  Chicago "in column 600 yards apart" with Patterson and Bagley on the bows
  (Australia away with Crutchley); Northern group Vincennes, Quincy, Astoria
  "spaced 600 yards" in a box patrol at 10 kn with Helm and Wilson; pickets
  Blue and Ralph Talbot; visibility "12,000 yards, wind NE, force 1 or 2; no
  moon".
- **Key minutes:** 00:54 Chōkai sights Blue, which does not see the column;
  01:05 course 150°, 26 kn; 01:36 "Fire torpedoes"; 01:38 torpedoes away;
  **01:43** flares and Patterson's alarm, Canberra hit; 01:47 Chicago's bow hit
  by a torpedo; by 01:49 the Southern Force finished; 01:48–01:54 Chōkai opens
  on the Northern group; the northern cruisers shot to pieces in a crossfire
  by about 02:15; Mikawa retires shortly after 02:00 (Morison V, opened;
  combinedfleet battle page).
- **Outcome:** Canberra, Vincennes, Quincy, Astoria sunk; Chicago damaged;
  Chōkai and Aoba damaged; Kako sunk by S-44 on the 10th (combinedfleet;
  Morison). Losses: *verify* (Wikipedia: Allied 1,077 killed; not opened here).
- **Sources:** ONI CN *Savo Island* (HyperWar, R2); NWC *Battle of Savo
  Island* (1950, HyperWar HTML, with its zone-time page; not opened here);
  Quantock, *Disaster at Savo Island*; USSBS Nav 61; Morison V and its
  Japanese track chart (©).
- **Moment (later):** Chōkai's bridge 01:36–01:50 (Japanese night optics and
  torpedoes against an unalerted force); a US cruiser's bridge would be a
  sortie with no sortie-terms success, so a stop.

### 5.3 The First Naval Battle of Guadalcanal (第三次ソロモン海戦, first night), 13 November 1942 (UTC+11, ONI Part I)

- **Forces.** Callaghan's column in "Battle Disposition 'Baker ONE'": Cushing,
  Laffey, Sterett, O'Bannon, Atlanta, San Francisco, Portland, Helena, Juneau,
  Aaron Ward, Barton, Monssen, Fletcher, "the distance maintained between the
  destroyers was about 500 yards. Between cruisers and between divisions it
  was 700-800 yards" (ONI I, opened). SG radar only in Portland, Helena,
  Juneau, O'Bannon and Fletcher; the flagship had none. Abe: Hiei 比叡,
  Kirishima, Nagara and destroyers (Akatsuki 暁, Ikazuchi 雷, Inazuma 電, Yūdachi
  夕立, Harusame 春雨, Murasame 村雨, Samidare, Amatsukaze 天津風, Yukikaze, Teruzuki,
  Asagumo: Wikipedia and ja.wikipedia, tertiary). Kirishima was "about 1500
  meters astern" of Hiei (Tokuno).
- **Key minutes (ONI I):** 01:24 Helena's SG: three groups at 27,100, 28,000 and
  32,000 yd; 01:30 targets on 134°, 20 kn; 01:37 back to 000°; 01:40 O'Bannon's
  contacts at 6,000–11,000 yd; 01:45 "stand by to open fire"; **01:48** "Odd ships fire to starboard, even
  to port" (ONI); Hiei and Akatsuki switch on searchlights and illuminate
  Atlanta (Kirishima TROM, 13 November entry, 0150); 01:54 "cease firing"; about 02:00 San Francisco's
  bridge smashed, Callaghan killed; 02:26 Helena orders all ships to form on her.
  Tokuno: Hiei and Kirishima turned left to reverse course; "the Kirishima was
  hit only once by a 15 cm shell".
- **Outcome (combinedfleet battle page, opened):** Hiei (sunk next day by
  aircraft), Akatsuki and Yūdachi lost; Atlanta, Barton, Cushing, Laffey,
  Monssen lost; Juneau torpedoed by I-26 the same morning (*verify*); Portland,
  San Francisco, Helena damaged. Callaghan and Scott killed.
- **Moment (later):** Hiei's searchlight at 01:48; a US destroyer at
  point-blank range (Cushing's six torpedoes at Hiei at about 1,200 yd, ONI).

### 5.4 Tassafaronga (ルンガ沖夜戦), 30 November 1942 (UTC+11, Morison V)

- **Forces.** Wright's TF 67 in column: destroyers Fletcher, Perkins, Maury,
  Drayton; cruisers Minneapolis (F), New Orleans, Pensacola, Honolulu,
  Northampton; destroyers Lamson, Lardner; "the cruisers 1000 yards apart with
  two miles separating the last of the van destroyers from flagship
  Minneapolis" (Morison V, opened). Tanaka: Naganami 長波 (F), Makinami 巻波,
  Oyashio, Kuroshio 黒潮, Kagerō, Kawakaze 江風, Suzukaze 涼風 in column, Takanami
  高波 out on the port bow as a picket; six carried supply drums and had landed
  their torpedo reloads (combinedfleet; Morison).
- **Key minutes:** 22:25 out of Lengo Channel on 320° at 20 kn; 23:06 radar
  contact dead ahead (284°) at 23,000 yd; 23:16 Fletcher, enemy 7,000 yd broad on
  the port bow, asks to fire torpedoes; 23:20 Wright permits; Fletcher fires ten
  at 7,300 yd (Takanami) to 9,600 yd; the cruisers open fire; the Japanese
  destroyers reverse, launch and run; the Type 93s hit Minneapolis, New Orleans,
  Pensacola and Northampton (Morison; times of the hits *verify*).
- **Outcome:** Northampton sunk; Minneapolis, New Orleans, Pensacola heavily
  damaged; Takanami sunk (combinedfleet, opened).
- **Moment (later):** Takanami, the picket that drew all the fire; or a Type 93
  spread from Naganami. The lesson for the sim: a radar-directed gun line
  against torpedoes launched from 4–6 miles.

### 5.5 Empress Augusta Bay (ブーゲンビル島沖海戦), 2 November 1943 (Morison VI)

- **Forces.** Merrill's TF 39: CruDiv 12 Montpelier (F), Cleveland, Columbia,
  Denver, "spaced 1000 yards"; van DesDiv 45 under Capt. Arleigh Burke (Charles
  Ausburne, Dyson, Stanly, Claxton), rear DesDiv 46 (Spence, Thatcher,
  Converse, Foote) (Morison VI, opened; names of the DDs *verify* against the
  task-organisation table, of which only the CO lines were read). Ōmori's
  Torokina Interception Force: CruDiv 5 **Myōkō 妙高**, **Haguro**; light cruiser
  **Sendai** with Shigure, Samidare, Shiratsuyu; light cruiser **Agano 阿賀野** with
  Naganami, **Hatsukaze 初風**, Wakatsuki 若月; Sendai and Hatsukaze sunk.
- **Key minutes:** 02:27 on 345° in line of bearing at 28 kn, flag radar
  contact at 35,900 yd; 02:31 Burke's van destroyers peel off to attack the
  enemy's flank; 02:39 Merrill reverses; 02:46 Burke's torpedoes; about 02:50
  the cruisers open fire; 02:50–02:52 the Sendai column's turn; 03:07 Hatsukaze, dodging,
  cuts between Myōkō and Haguro and collides with Myōkō, losing part of her
  bow; 03:13 Ōmori
  first sights his enemy; 03:20–03:25 Denver hit; 03:37 general retirement;
  05:39 Hatsukaze sinks (Morison VI).
- **Merrill's plan:** keep the cruisers "close to the maximum effective range of
  Japanese torpedoes, say 16,000 to 20,000 yards" and fire from there; Ōmori's
  ships had radar "but the operators were poor" (Morison VI).
- **Moment (later):** a Burke destroyer's torpedo run 02:31–02:46; Sendai's
  bridge under radar-directed 6-inch fire.

---

## 6. The mechanics the sim needs, with numbers

### 6.1 Guns

| gun | ship(s) | shell | MV | rate of fire | time of flight at the ranges fought | other | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 16"/45 Mark 6 | Washington, South Dakota | AP Mark 8, 2,700 lb | 2,300 fps | 2 rpm (Washington achieved 1.54–1.56 rpm per gun) | **8,400 yd: about 12.0 s** (5,000 yd 6.83 s; 10,000 yd 14.45 s), elevation about 5.0°, angle of fall about 5.6°; 15,700 yd about 24 s; 18,500 yd about 29.7 s | max range 36,900 yd at 45°; turret train 4°/s, elevation 12°/s; train limits ±150°; 60 ms firing delay between guns of a turret; side penetration at 8,400 yd about 24.5 in; dye: Washington orange, South Dakota blue (1945) | navweaps WNUS_16-45_mk6 (BuOrd OP 757; interpolation R5) |
| 18.1"/45 Type 94 (46 cm) | Yamato | APC Type 91, 3,215 lb; Common Type 3 2,998 lb | 2,559 fps (AP) | 1.5–2 rpm; cycle about 30 s at the +3° loading angle, about 35 s "for most battle-range engagements", 41 s at high elevation | 30,530 yd 49.2 s; **about 46 s at 29,000 yd, 55 s at 32,800 yd, 60 s at 35,000 yd** (interpolated) | max range 45,960 yd at 45°; "spreads of 440 to 550 yards ... at maximum range"; "American reports from the Battle of Samar also comment on the small patterns" | navweaps WNJAP_18-45_t94 |
| 14"/45 41st Year Type | Kirishima, Kongō, Haruna | APC Type 91; Common Type 0; Type 3 incendiary | 2,526–2,543 fps (AP), 2,641 (HE) | 2 rpm | not in the source; about 15 s at 10,940 yd and 23 s at 16,400 yd (R5 estimate from the mean of muzzle and striking velocity, ±15%) | angle of fall 7.5° at 10,940 yd; max range 38,770 yd at 43°; dye: Kirishima blue | navweaps WNJAP_14-45_t41 |
| 8"/50 3rd Year Type No. 2 | Atago, Takao; CruDiv 5, CruDiv 7 | 277 lb AP | 2,756 fps (illum 2,330) | 3–4 rpm | about 15 s at 10,940 yd, 24 s at 16,400 yd (R5 estimate) | illumination round "effective range of 17,500 yards ... 1.6 million candelas"; max range 32,150 yd | navweaps WNJAP_8-50_3ns |
| 15.5 cm/60 (6.1") 3rd Year Type | Yamato's and Mogami-type secondaries | 123 lb AP | 3,018–3,035 fps | 5–6 rpm | about 14 s at 10,940 yd (R5 estimate) | max 29,965 yd | navweaps WNJAP_61-60_3ns |
| 14 cm/50 (5.5") 3rd Year Type | Nagara, Sendai; battleship casemates | HE | 2,789–2,805 fps | 6–10 rpm | — | max about 22,500 yd at 35° | navweaps WNJAP_55-50_3ns |
| 12.7 cm/50 (5") 3rd Year Type | Japanese destroyers | 50.7 lb HE | 3,002 fps | 5 rpm (Type A twin) to 10 | — | 18,235 yd at 30° | navweaps WNJAP_5-50_3ns |
| 5"/38 Mark 12 | US destroyers, DEs, CVEs, battleship secondaries | 55 lb AA common | 2,600 fps (new) | 12–15 rpm (pedestal), 15–22 rpm (base ring with hoists) | **6,000 yd 9.7 s; 8,000 yd 14.7 s; 10,000 yd 20.8 s; 14,000 yd 35.8 s; 18,000 yd about 63 s** | illumination rounds burn about 50 s; destroyers carried 100–150 rounds a gun plus 100–120 illumination rounds (later about 200 extra) | navweaps WNUS_5-38_mk12 |

### 6.2 Fire control and radar

- **US:** SG surface search (10 cm, 70 kW, 15.7 nm; navweaps), the source of
  the first contact at 18,000–19,600 yd and of the "plot"; **Mark 3** on the
  main-battery directors (40 cm; tracking to 40,000 yd; range accuracy 40 yd;
  bearing 2 mils; resolution 400 yd and 10°; splashes of 16-inch ranged to
  20,000 yd); **Mark 8** (10 cm; range accuracy 15 yd; Mark 8 mod 0 spotted
  16-inch splashes to about 20,000 yd, mod 3 to 35,000 yd), in West Virginia,
  Tennessee and California at Surigao; **Mark 4** on the 5-inch directors
  (navweaps). At Samar Johnston had SC, SG and FD (Mark 4) radar: the SC
  antenna was shot away, the FD's elevation was lost and its antenna "grabbed
  and pointed in general at the horizon", and "Radar ranges were used
  throughout" (J).
- **Japanese:** none in Kirishima (1942); radar fire control "yet not well
  developed; there was no particular confidence in it" (Koyanagi, 1944); Yamato
  had Type 13 air search and Type 22 Mod 4 surface search/gunnery radars and a
  Type 21 (TROM); at Samar Kurita "ordered his force to commence radar
  rangefinding; but his search radar, the only kind he had, was ineffective"
  (Morison); Johnston saw "No fire control radar ... and no effective search
  radar". Japanese doctrine at night: lookouts with large binoculars,
  searchlights, illumination shells and flares (*verify* the optics' apertures
  and sighting ranges with R6). Sightings in the record: South Dakota seen at
  about 10,000 m against land (Kirishima's bridge, 23:51); "an enemy vessel
  bearing 125 degrees distance 10,000 meters" (Atago, 23:52); Mikawa's
  lookouts saw Blue first at Savo.
- **Doctrine on light:** Lee kept his battleships unlit and beyond 7,000
  yards, the range of "effective searchlight illumination" (ONI); Washington
  "was not illuminated and was fired on only sporadically" (ONI n. 82).

### 6.3 Star shell, searchlights and flash

- Star shell: Gwin's two spreads at 23:26; Washington's 62 from mount 9; star
  shells falling short "blinded the main battery spotters" (ONI); US 5-inch
  illumination burns about 50 s (navweaps); Japanese 8-inch illumination
  "effective range 17,500 yards" (navweaps).
- Searchlights: Atago's (and Nagara's group's) on South Dakota at about 5,000
  yd, "four searchlights, closely grouped in pairs, each pair arranged
  vertically" (SD log); each illuminating ship's lights shot out in turn by
  South Dakota's and Washington's 5-inch, the next ship taking over (ONI);
  Yamato's two 150 cm searchlights had been landed by 1944 (TROM). Japanese
  searchlight sizes otherwise *verify* (R6).
- Flash: the US 5-inch flashes "provided almost continuous illumination of
  the firing vessel" and blinded the main-battery directors; the Japanese
  flashes were "comparatively small and dim ... flashless powder or some form
  of flash retardant" (ONI); Lundgren: their flashless powder gave a red flame
  that through smoke looked like a ship on fire.

### 6.4 Torpedoes

| torpedo | user | speed / range | warhead | notes | source |
| --- | --- | --- | --- | --- | --- |
| Type 93 Model 1 (61 cm, oxygen) | Japanese cruisers and destroyers | 48–50 kn to 21,900 yd; 40–42 kn to 35,000 yd; 36–38 kn to 43,700 yd | 1,080 lb | wander up to 550 yd at 21,100 yd; prematures and wake detonations in 1942 from crews resetting fuze sensitivity | navweaps WTJAP_WWII |
| Type 90 (61 cm) | older destroyers (Ayanami: Lundgren) | *verify* (R6) | — | — | — |
| Mark 15 Mod 0 (21 in) | US destroyers and DEs | 45 kn to 6,000 yd; 33.5 kn to 10,000 yd; 26.5 kn to 15,000 yd | 494 lb (Mod 0) to 801–823 lb (Mod 3) | Mod 3: 4,500 / 9,000 / 14,000 yd; Fletcher class two quintuple mounts; John C. Butler one triple mount (Morison); Gwin's four failed to sink Benham (prematures, erratic runs) | navweaps WTUS_WWII; ONI n. 73 |

Run times worth having: 26.5 kn = 895 yd/min; 33.5 kn = 1,131; 45 kn =
1,519; Type 93 at 48–50 kn = 1,620–1,690 yd/min. At Guadalcanal Gwin and
Benham held their torpedoes because the targets "were beyond effective range
for high-speed setting" or would be behind Savo before the fish arrived (ONI).
At Samar the Japanese destroyers' torpedoes, fired from 10,500 yd astern of
carriers making 17½ knots, ran out short (Morison).

### 6.5 Smoke and squalls

- Johnston: "funnel smoke" and "FS smoke" from the smoke-screen generators
  (seven expended); "when the ship was behind a screen the enemy firing was
  very ineffective" (J). The CVEs made "heavy black smoke"; the escorts "both
  funnel and chemical smoke on the starboard quarter" (CTU). "On this course the
  relative wind was such that the smoke lay in an east-west line" (CTU); once
  the formation ran down-wind, smoke "could not be maintained over Kalinin Bay
  and Gambier Bay" (Morison). "Smoke, fortunately for us, lay low in the hot and
  humid air" (Morison).
- Squalls: the carriers' 07:06–07:15; Johnston's ten minutes after 07:30;
  visibility for Heermann "varying from 100 to 25,000 yards owing to rain and
  smoke" (Morison). The Japanese ceased fire in the carriers' squall (Hoel AR).
- Japanese smoke: Sendai "laid down smoke" on being fired on (Hashimoto); "Standard
  Japanese doctrine ... was to use smoke screens liberally" (Lundgren).
- **For the sim:** smoke as a volume that blocks optical sight lines and
  slowly drifts with the wind (6–8 kn NE at Samar); radar sees through it (US
  only); a squall as a moving cylinder of low visibility.

### 6.6 Speeds

| ship | speed in the record | source |
| --- | --- | --- |
| Casablanca-class CVE | flank 17½ kn; "absolute top speed ... 18 knots" | Morison |
| Fletcher-class DD | 25 kn on Johnston's run; Johnston 17 kn after her 07:30 hits | Morison; J |
| John C. Butler-class DE | about 24 kn (Raymond) | Morison |
| Yamato | 26 kn (heavy by the bow) | Kurita |
| Nagato | "no better than 24" | Kurita |
| Haruna | 25–26 kn on three shafts | Kurita; TROM |
| CruDiv 7 | "close the escort carriers on the port quarter at 33 knots" | Chikuma TROM |
| Japanese main body at 06:50 | 27 kn (north column), 30 kn (centre and south) | Hoel AR |
| Haguro | 25 kn on 120° at 07:54 | Morison (Heermann) |
| Washington | 17 → 23 → 26 kn; 18 kn at 00:17 | ONI |
| South Dakota | 23, 26, 27 kn; full speed on 235° | SD log |
| Kirishima | 28–30 kn; 18 kn westward at 00:17 after the hits | Tokuno; ONI |
| Atago | 30 kn at 00:30 (−12) | Lundgren |

### 6.7 Damage as the record tells it (what the damage model must reproduce)

- **South Dakota's electrical failure** (§3.9): a casualty of her own gunfire,
  three minutes long, aft only; then superstructure hits that cut circuits; the
  armoured box never penetrated. Model: a per-ship "power" state that turret
  blast can upset (rare) and superstructure hits degrade (radar, fire control,
  communications), separate from hull damage.
- **Kirishima's steering** (§3.10): hits aft flooding the steering compartment
  and jamming the rudders at different angles, so she circles to port and
  cannot be steered by her engines; fires fore and aft; magazines flooded by
  order; speed kept for a while (18 kn westward at 00:17); loss hours later by
  progressive flooding and capsizing. Model: a `steering-jammed` critical
  result from stern hits; sinking by flooding over time, not at the moment of
  the hits.
- **Kumano's bow** (§4.6): one torpedo; speed to 15–16 kn; out of line. Model:
  a speed cap and the formation leaving her.
- **Johnston's 07:30 hits:** one engine and fire room, steering power, the
  after guns' power, gyro, SC radar; speed 17 kn; fought on in local and
  manual control for over two hours; dead in the water when the last engine
  room went (J). Model: subsystem damage, not a hit-point bar; a destroyer
  survives many hits by AP shells that pass through without bursting (Hoel:
  "penetrated both sides of the ship without exploding").
- **Japanese AP through thin plating:** the 0.4-s fuze delay makes most heavy
  AP hits on superstructure or on CVEs pass through (WDR; Morison: "they used
  armor-piercing projectiles which failed to detonate on the thin plates of the
  carriers").

---

## 7. What the two scenario files need from this (notes against DATA.md §9)

- **Clocks.** Guadalcanal `"zone": "+11:00"`, `from` 14 November 20:00, `to`
  15 November 03:30 (to hold Kirishima's capsizing as the last beat), `others`:
  "US zone −12 (Washington, South Dakota, ONI Part III): subtract 1 h"; "Tokyo:
  add 2 h". Samar `"zone": "+09:00"`, `from` 06:15, `to` 11:30 (St. Lo at
  11:25), `others`: none, with a `note` on the TROMs' one-hour-early entries.
- **Event kinds the record uses that §9's vocabulary lacks or strains:**
  `illuminated` (searchlights on a target: a cause with a `by`, distinct from
  the illuminating ship's `searchlight`), `power-failure` (South Dakota),
  `steering-jammed` (Kirishima, Hoel's rudder, Johnston's steering power),
  `radar-lost` (South Dakota's SG at 23:41–23:46; Johnston's SC),
  `rain-squall` entered/left (better as a moving weather object, §6.5),
  `ceases-fire` with a reason ("false report target sunk"), `torpedoes-fired`
  (a spread with count, speed setting and target, so the sim can run them),
  `collision` and `near-collision` (Heermann's three near misses; Hatsukaze and
  Myōkō), `abandoned` (distinct from `sinks`: Hoel at 08:40, Gambier Bay 08:50,
  Johnston 09:45, Roberts 09:10–09:35, Kirishima before she capsized). Where
  the existing kinds will do (`hit`, `torpedo-hit`, `fire`, `flood`, `list`,
  `dead-in-water`, `scuttled`, `searchlight`, `starshell`, `smoke`), use them.
- **Tellings on events, not only on cards:** Kirishima's 16-inch hits (8–21);
  Kumano's hit time (07:24/07:27) and place (bow/stern); Kirishima's end
  (02:23/03:20/03:25); Walke's sinking (23:36/23:42); Hoel's second spread
  (07:35/07:50–07:53); Chōkai's end (09:30/21:48); Haguro's turret (08:00/08:25).
- **Damage shares.** The record's hits must sink what the record sank and no
  more: South Dakota survives at least 26 hits (armour box intact); Kirishima is
  lost to steering and flooding hours after the hits, not by a damage bar
  crossing a line at 00:07; Johnston survives the 07:30 hits for over two hours;
  Gambier Bay is lost to many 8-inch hits at short range over 50 minutes;
  Kumano survives one Mark 15 with a speed cap. AP that passes through thin
  plating does little (§6.7).
- **Units with no track (`station`).** TF 64's destroyers on Walke at 300–500
  yd; South Dakota 2,000 yd astern of Washington until 23:35; Kondō's column at
  1,000–1,500 m (`schematic`); Taffy 3's carriers on the 2,500-yd circle and
  the screen on the 6,000-yd circle until 07:00; Kurita's columns 4 km apart.
- **Formation order in `units`:** TF 64: Walke, Benham, Preston, Gwin,
  Washington, South Dakota (ONI). Kondō: Asagumo, Teruzuki, Atago, Takao,
  Kirishima (Morison, 23:48). CruDiv 7: Kumano, Suzuya, Chikuma, Tone; after
  07:24 Chikuma leads (TROM).

---

## 8. Sources

### 8.1 Opened in this pass

| id (proposed) | work | URL | what was used |
| --- | --- | --- | --- |
| `oni-cn-guadalcanal` | [Jameson], *The Battle of Guadalcanal, 11–15 November 1942*, ONI Combat Narrative (1944; NHC 1994) | https://www.ibiblio.org/hyperwar/USN/USN-CN-Guadalcanal/index.html, `USN-CN-Guadalcanal-1.html`, `-3.html` (shared folder) | Part I zones and Callaghan's column; Part III in full; the chart `maps/USN-CN-Guadalcanal-7.jpg` |
| `ussbs-nav33` | USSBS Interrogation Nav 33, Lt Cdr Tokuno Horishi, 25 Oct 1945 | https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/IJO-33.html | whole |
| `ussbs-nav9` | Nav 9, Vice Adm. Kurita Takeo, with Annex C (Plate 9-3) | https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/IJO-9.html; `img/plate_9-3.jpg` | Samar passages; disposition sketch |
| `ussbs-nav35` | Nav 35, Rear Adm. Koyanagi Tomiji, 24 Oct 1945 | https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/IJO-35.html | whole |
| `ussbs-nav41` | Nav 41, Cdr Ōtani Tonosuke, 26 Oct 1945 | https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/IJO-41.html | whole |
| `ussbs-nav66` | Nav 66 (Tsuda and others) | https://www.ibiblio.org/hyperwar/AAF/USSBS/IJO/IJO-66.html | downloaded; header only |
| `wdr-south-dakota` | BuShips War Damage Report, USS South Dakota, gunfire damage, 14–15 Nov 1942 | https://www.ibiblio.org/hyperwar/USN/rep/WDR/U.S.S.%20SOUTH%20DAKOTA%20(BB-57),%20GUNFIRE%20DAMAGE%20-%20Battle%20of%20Guadalcanal,%20November%2014-15,%201942.pdf | whole (OCR) |
| `ar-south-dakota` | USS South Dakota, action report BB57/A16-3/(0165), 25 Nov 1942 (scan, watermarked by navweaps) | https://www.navweaps.com/index_lundgren/BB57_Action_Report_water.pdf | pp. 1–2 and 4–8 read as images (summary, chronological log); the rest seen only as thumbnails |
| `ar-johnston` | USS Johnston, action report DD557/A16-3 Serial 04, 14 Nov 1944 (Lt R. C. Hagen) | http://ussjohnston-hoel.com/322/376.html | whole |
| `ar-hoel` | USS Hoel, combined action report and report of loss, 15 Nov 1944 | http://ussjohnston-hoel.com/322/367.html | whole |
| `cominch-sib22` | COMINCH, *Battle Experience: Battle for Leyte Gulf*, Secret Information Bulletin no. 22, 1 Mar 1945 | https://www.ibiblio.org/hyperwar/USN/rep/Leyte/BatExp/index.html; `Leyte-BE-78.1.html`; `img/Leyte-BE-p27.jpg`, `-p28.jpg`, `-p33.jpg` | Samar composition, time table, CTF 77, CTU 77.4.3 and CTU 77.4.2 extracts; the track chart and composite plot (78.3 downloaded, not read) |
| `danfs-*` | *Dictionary of American Naval Fighting Ships*, HyperWar mirror | https://www.ibiblio.org/hyperwar/USN/ships/dafs/DE/de413.html; `CVE/cve73.html`; `CVE/cve63.html` (read); `DD/dd557`, `DD/dd533`, `BB/bb56`, `BB/bb57`, `DD/dd416` (downloaded, not read) | Samuel B. Roberts, Gambier Bay, St. Lo |
| `nwc-leyte-3` | NWC, *The Battle for Leyte Gulf, October 1944: Strategical and Tactical Analysis*, vol. III (1957) | https://archive.org/details/battleforleytegu03bate (`_djvu.txt`) | 22 October dispositions, Plate XXXVIII (excerpt kept) |
| `morison-v`, `morison-vi`, `morison-xii` | S. E. Morison, *History of U.S. Naval Operations in WWII*, vols V, VI, XII (©; read for facts) | archive.org `husno-volume-v-…`, `husno-volume-vi-…`, `husno-volume-xii-…` (do not link from the app) | V: the battleship action, Savo, Tassafaronga; VI: Empress Augusta Bay; XII: Samar and Surigao, appendix order of battle |
| `navweaps-guns` | navweaps.com gun pages (© DiGiulian) | https://www.navweaps.com/Weapons/WNUS_16-45_mk6.php, `WNJAP_18-45_t94.php`, `WNJAP_14-45_t41.php`, `WNJAP_8-50_3ns.php`, `WNJAP_61-60_3ns.php`, `WNJAP_55-50_3ns.php`, `WNJAP_5-50_3ns.php`, `WNUS_5-38_mk12.php` | §6.1 |
| `navweaps-torpedoes` | navweaps torpedo pages | https://www.navweaps.com/Weapons/WTJAP_WWII.php, `WTUS_WWII.php` | §6.4 |
| `navweaps-us-radar` | navweaps, US radar of WWII (from Friedman, *Naval Radar*) | https://www.navweaps.com/Weapons/WNUS_Radar_WWII.php | §6.2 |
| `lundgren-bbaction` | R. Lundgren, *The Battleship Action 14–15 November 1942* (©) | https://www.navweaps.com/index_lundgren/bbActionGuadalcanal.php | whole; track figures looked at (shared folder) |
| `lundgren-kdamage` | R. Lundgren, *Kirishima Damage Analysis* (2009, ©) | https://www.navweaps.com/index_lundgren/kirishimaDamageAnalysis.php | sections 1–4 |
| `lundgren-wash-gunfire` | R. Lundgren, *USS Washington Gunfire on 15 November 1942* (2020, ©) | https://www.navweaps.com/index_lundgren/Washington%20gunfire%20at%20Guadalcanal.pdf | whole |
| `lundgren-wreck` | R. Lundgren with A. Tully, *Analysis of the wreck of Kirishima* (2022, ©) | https://www.navweaps.com/index_lundgren/Kirishima_Wreck_Analysis.pdf | opening, conclusion, appendices |
| `trom-*` | combinedfleet.com TROMs (© Hackett, Kingsepp and others) | https://www.combinedfleet.com/Kirishima.htm (shared); `yamato.htm`, `kongo.htm`, `haruna.htm`, `chokai_t.htm`, `haguro_t.htm`, `kumano_t.htm`, `suzuya_t.htm`, `chikuma_t.htm`, `tone_t.htm`, `yahagi_t.htm`, `noshiro_t.htm` | 14–15 Nov 1942 and 25 Oct 1944 entries |
| `cf-guadalcanal-battles` | combinedfleet.com, "Guadalcanal Naval Battles" page | shared folder `cf-btl_gn2.html` (URL *verify*) | outlines of Savo, Cape Esperance, the two Guadalcanal nights, Tassafaronga |
| `wp-*` (tertiary) | Wikipedia: *Battle off Samar*; *Leyte Gulf order of battle*; *Naval Battle of Guadalcanal* (shared); ja: 第三次ソロモン海戦 (shared) | https://en.wikipedia.org/w/index.php?title=Battle_off_Samar&action=raw; `title=Leyte_Gulf_order_of_battle&action=raw` | orders of battle, cross-checks |
| — | CIA FDD memo, "Translations from the Japanese for a Strategical and Tactical Study of the Battle of Leyte Gulf", 20 Jan 1950 | https://archive.org/details/cia-readingroom-document-cia-rdp81-00706r000200020010-4 | opened: a memo about translations, not the translations |
| — | Royal Navy, *Battle Summary* no. 40, *Battle for Leyte Gulf* (1947) | https://archive.org/details/battlesummaryno40royalnavy | downloaded, not read (a later pass can mine it) |

### 8.2 Cited through others, not opened (*verify*)

- Washington, action report, night of 14–15 November 1942; CTF 64 (Lee),
  report of night action (quoted by ONI, Morison and Lundgren).
- Walke, Preston, Benham and Gwin action reports (quoted by ONI and Lundgren).
- Atago's detailed action report; Kirishima's and Takao's brief reports;
  Sendai's report (via Lundgren); Inazuma's (JACAR C08030752400, R2).
- Yamato, Kongō, Haguro, Tone and CruDiv 7 action reports; DesRon 10's
  report and war diary (via Morison); CruDiv 7 detailed report with charts
  (JACAR C08030037100).
- Heermann, Samuel B. Roberts, Raymond, Dennis, John C. Butler, Gambier Bay,
  White Plains, Kitkun Bay, Kalinin Bay, St. Lo and Fanshaw Bay action reports;
  CTU 77.4.3's special report of 29 October 1944 (via *Battle Experience* and
  Morison).
- Ikeda Tsurukichi, *Shikikan-tachi no Taiheiyō Sensō* (Hayashi's hit sketch).
- Lundgren, *The World Wonder'd: What Really Happened off Samar* (2014, print).
- Hornfischer, *The Last Stand of the Tin Can Sailors* (2004) and *Neptune's
  Inferno* (2011); Frank, *Guadalcanal* (1990); Tully, *Battle of Surigao
  Strait* (2009).
- NWC Leyte vol. V (Surigao) and *The Battle of Savo Island* (1950); ONI
  narratives for Savo and Tassafaronga; Senshi Sōsho 83 ch. 7 and 56.

---

## 9. Decisions for the designer

- **D1. The Guadalcanal box clock.** Keep **UTC+11 ("zone −11")** and convert
  the −12 primaries. *Why:* it is the zone of 160°E, the clock Morison, ONI
  Part I, the TROMs and the brief already use (23:00 contact, midnight on
  Kirishima), and the one most readers will meet. The alternative (UTC+12, to
  match Washington's and South Dakota's reports) would put every familiar time
  an hour late. Store `sourceClock`/`sourceZone` on every −12 beat so the
  conversion is auditable.
- **D2. Kirishima's hits in the untouched replay.** Calibrate to the survey's
  **17–21 sixteen-inch hits** (Lundgren 2022, with Ikeda's sketch) and make the
  loss come from steering and flooding over hours; put 8 (Lee), 9 (Tokuno,
  Morison) and about 20 (Ikeda) on the card as tellings. *Why:* the physical
  evidence and the damage-control officer's sketch agree; the low counts are
  what could be seen at night; and the damage model needs a mechanism, not a
  number.
- **D3. Preston and friendly fire.** Script "hit by heavy shells from her port
  side" with no shooter; tellings on the card. *Why:* Lundgren's argument is
  serious but unproven and rests on one researcher's reading; drawing a shot
  from Washington or South Dakota would assert it.
- **D4. The Samar TROM clock.** Adopt the rule of §2.2 (anchor every TROM time
  to a US event; the early "0558"-type entries are an hour behind Item), and
  correct R2 §12.3's "Yamato opens fire 0558" to 06:58. *Why:* otherwise the
  box will have Yamato firing an hour before the carriers saw her.
- **D5. Kurita's disposition at contact.** Draw **Kurita's own sketch**
  (Plate 9-3), `schematic`, with Morison's 0630 diagram in the note. *Why:* it
  is the commander's own, public domain, and both drawings agree on what
  matters: columns not a ring, CruDiv 7 on the east flank nearest the
  carriers, the battleships in the centre.
- **D6. Kumano's hit.** Script it at **07:27** (run time and Morison), 07:24
  as a telling; damage at the bow (TROM), Kurita's "near the stern" on the
  card. *Why:* the computed run from Johnston's own firing data fits 07:27.
- **D7. Johnston's 07:30 hits.** Script "three heavy shells and then three
  6-inch" from "a battleship" (her report says 14-inch) with no named shooter,
  and let the AI's real guns decide when the player is Johnston. *Why:* the
  shooter is disputed (14-inch Kongō or Haruna in her report; Yamato's 18.1-inch
  in later tellings, unread here).
- **D8. Moment durations and time scale.** Battleship moments at **×2**
  (16-inch flight 12–30 s and a 30-s reload are already slow at ×1); Samar's
  destroyer and DE runs at **×2**, with ×3 allowed for Johnston's closing from
  18,000 to 10,000 yards if R7 finds the checkpoint too long. *Why:* the
  closing rate (25 + 25–33 kn) takes about 9–10 minutes of battle time; at ×2
  that is a 5-minute checkpoint.
- **D9. Which escort carrier.** **Gambier Bay 07:45–08:05** for the helm
  moment, Kalinin Bay as the alternative. *Why:* her report gives the mechanic
  (salvo patterns, stepping, the two-point turn) in numbers, and the record of
  her loss is the strongest beat; Kalinin Bay gives the survivor's comparison.
- **D10. The CruDiv 7 cruiser.** **Tone 07:58–08:18.** *Why:* she survived,
  and her TROM (from her action report) gives the firing record to the minute
  for the after-card; Chikuma's record is thinner because she sank.
- **D11. The destroyer of either van at Guadalcanal.** **Gwin** (US) and
  **Ayanami** (Japanese); Walke as the US alternative. *Why:* Gwin carries the
  star-shell mechanic, has a record the after-card can compare, and survived;
  Ayanami's lone torpedo run is the Japanese night-torpedo doctrine in one ship.
  Walke's record ends in the player's ship sinking eleven minutes in.
- **D12. Where the moments start at Guadalcanal.** Washington at 23:58 as
  DESIGN.md has it; **Kirishima at 23:51**, not 23:58, so the player sees South
  Dakota, fires the first salvo and makes the turn before Washington opens.
- **D13. The box extents.** Guadalcanal about 159°20′–160°05′E,
  8°50′–9°35′S (≈80 × 85 km; add the Russells westward only if the retirement
  is shown); Samar 125°45′–126°50′E, 11°00′–12°05′N (≈120 × 120 km). *Why:* both
  hold every track in §3.3 and §4.3 with 10 km to spare.
- **D14. St. Lo.** A stop with the card; fire, explosions and sinking shown on
  the ship; no attacking aircraft modelled; no moment covering 10:45–11:30.
  *Why:* DESIGN.md §3.5 and the brief's tone rule; it keeps the record's beat
  without making the attack a spectacle (R8 decides).

---

## 10. Risks

1. **Clock errors.** Two zones inside one ONI narrative; two in the TROMs for
   one morning; South Dakota ten minutes off Washington; memory-based times in
   every destroyer report. Every beat needs its source clock; `check-data`
   should flag a Guadalcanal beat from a −12 source without `sourceZone`.
2. **The US bridge record for Guadalcanal is second-hand.** Washington's and
   Lee's reports were not reached; their contents come through ONI (1944),
   Morison and Lundgren. The salvo times in §3.7 are partly Lundgren's
   reconstruction.
3. **Lundgren is both the best and a partisan source.** His access to
   Washington's report and the wreck film is unique, his work is copyrighted,
   and some conclusions (friendly fire, scuttling denied, hit counts) are
   arguments. Use as tellings with his name on them.
4. **The Japanese reports are unread.** Atago's, Inazuma's, CruDiv 7's,
   Yamato's and Tone's detailed reports exist (JACAR); everything Japanese here
   comes through TROMs, Morison, Lundgren and four interrogations taken a year
   later through interpreters.
5. **Chart readings are by eye.** The ONI chart is good to about 1′ against
   Savo and the TROM; the *Battle Experience* chart disagrees by 8′ with one
   radioed position. Mark `chart`, never `report`.
6. **Orders of battle.** Inazuma or Ikazuchi; Ayanami alone or with Uranami;
   which DesRon 2 and DesRon 10 destroyers were at Samar. Small, but a wrong
   silhouette in the box is visible.
7. **Tone.** These are night battles in which destroyers were torpedoed with
   most of their crews and men in the water were hit by shell fragments and
   depth charges; the record says so and the box must not draw it. The sortie
   score must never count people, and the cards must keep to ranges with
   sources. A friendly-fire claim, if shown, would be a claim about men who
   died.
8. **Damage calibration.** South Dakota's survival of 26+ hits and Kirishima's
   loss to 17–21 must both come out of the same model; a hit-point model will
   get one of them wrong.
9. **navweaps blocks bots intermittently** ("One moment, please"); a bake tool
   that fetches from it will fail at random. Nothing in the app should depend
   on fetching it; numbers go into the kits by hand with the citation.

---

## 11. What could not be reached

| host or work | result (this pass) | what it would unlock |
| --- | --- | --- |
| history.navy.mil (NHHC) | refused by the proxy (curl: no connection) | DANFS originals (the HyperWar mirror served instead), H-Gram 036, the online action-report collection |
| usswashington.com | CONNECT tunnel failed, 502 | **Washington's action report** |
| navsource.org | CONNECT tunnel failed, 502 | ship photo pages; Samuel B. Roberts material |
| bosamar.com | 200, but "Zend Guard Loader is not installed" error page | Taffy 3 reports, CTU 77.4.3 |
| desausa.org | redirects to an unrelated site (domain lapsed) | destroyer-escort reports (Samuel B. Roberts) |
| navweaps `South Dakota gunfire at Guadalcanal.pdf` | served the bot-check page instead of the PDF | South Dakota's salvo table (her log gives most of it) |
| navweaps `WNJAP_Radar_WWII.php` | 404 (no such page) | Japanese radar data (R6) |
| HyperWar `USN/ref/RADTAC/index.html` | 404 | FTP 217, *Operational Characteristics of Radar* (NHHC has it; unreachable) |
| combinedfleet `nagato.htm`, `Nagato.htm` | 404 | Nagato's TROM |
| Wikipedia `Battle_off_Samar_order_of_battle` | 404 (no such article) | — |
| Washington and CTF 64 reports; CTU 77.4.3 special report; Samuel B. Roberts's report | not on any reachable host | the US bridge record at Guadalcanal; Sprague's report; Roberts in her own words |
| JACAR scans (Atago C08030745200, Inazuma C08030752400, CruDiv 7 C08030037100, Tone C08030568700) | reachable (R2) but NIDS-held and in wartime Japanese; not read | the Japanese side minute by minute |
| Lundgren, *The World Wonder'd*; Hornfischer; Frank; Tully | print | the modern syntheses of Samar and Guadalcanal |

---

## 12. Still needs a person

- **A reader of wartime Japanese** for Atago's detailed report (C08030745200)
  and Inazuma's (C08030752400): Kondō's courses, the searchlight times, the
  torpedo salvos, and Kirishima's capsizing time in JST, which settles the
  02:23/03:20 dispute. Then CruDiv 7's report and charts (C08030037100) and
  Tone's (C08030568700) for the cruisers' track at Samar, and Senshi Sōsho 83
  ch. 7 and 56 part 1 ch. 5.
- **A request to NARA (RG 38)** for Washington's report and track chart and
  CTF 64's report (14–15 November 1942), and CTU 77.4.3's special report
  (29 October 1944); or a reader with Lundgren's book.
- **Someone to look at Morison XII's Samar chart beside the *Battle
  Experience* chart** and say whether the Japanese battleship tracks can be
  taken from public-domain sources alone (Kongō's and Haruna's tracks after
  07:30 are only in Morison's chart and the Japanese reports).
- **R6** for the kits: Fubuki-class torpedo fit (Ayanami), Japanese searchlight
  sizes and night binoculars, Casablanca-class turning circle, Fletcher and
  John C. Butler torpedo reloads (none carried), and the Mark 37/Mark 4
  director limits.
- **R8** on how St. Lo is shown, on whether a friendly-fire claim may appear on
  a card, and on the words for men in the water.
- **A check of the survivor and loss figures** that came through the
  Johnston–Hoel Association and Wikipedia (Hoel, Gambier Bay, the battle
  totals) against DANFS originals or the Bureau of Personnel casualty lists.

---

## 13. URLs requested (with status)

HyperWar (`https://www.ibiblio.org/hyperwar/…`): `AAF/USSBS/IJO/IJO-33.html`,
`IJO-9.html`, `IJO-35.html`, `IJO-41.html`, `IJO-66.html` (200);
`AAF/USSBS/IJO/img/plate_9-3.jpg` (200); `USN/rep/Leyte/BatExp/index.html`,
`Leyte-BE-78.1.html`, `Leyte-BE-78.3.html` (200); `…/BatExp/img/Leyte-BE-p27.jpg`,
`-p27t.jpg`, `-p28.jpg`, `-p33.jpg` (200); `USN/rep/WDR/index.html` and the South
Dakota WDR PDF (200); `USN/ships/dafs/DE/de413.html`, `DD/dd557.html`,
`DD/dd533.html`, `CVE/cve73.html`, `BB/bb56.html`, `BB/bb57.html`,
`DD/dd416.html`, `CVE/cve63.html` (200); `USN/index.html`, `PTO/index.html`,
`PTO/Hell/index.html` (200); `USN/ref/RADTAC/index.html` (404). The ONI
Guadalcanal pages and chart were fetched into the shared folder by the other
R5 process (200).

ussjohnston-hoel.com: `/322/376.html`, `/322/367.html` (200).

navweaps (`https://www.navweaps.com/…`): `Weapons/WNUS_16-45_mk6.php`,
`WNJAP_18-45_t94.php`, `WNJAP_8-50_3ns.php`, `WNUS_5-38_mk12.php`,
`WTJAP_WWII.php`, `WTUS_WWII.php`, `WNUS_Radar_WWII.php` (200);
`WNJAP_14-45_t41.php`, `WNJAP_61-60_3ns.php`, `WNJAP_5-50_3ns.php`,
`WNJAP_55-50_3ns.php` (200 on retry; the first try got the bot check);
`WNJAP_61-60_3ys.php`, `WNJAP_Radar_WWII.php` (404); `index_lundgren/index_lundgren.php`
(200 after a bot check), `bbActionGuadalcanal.php`, `kirishimaDamageAnalysis.php`,
`South_Dakota_Damage_Analysis.php` (200, the last not read),
`Washington%20gunfire%20at%20Guadalcanal.pdf`, `Kirishima_Wreck_Analysis.pdf`,
`BB57_Action_Report_water.pdf` (200), `South%20Dakota%20gunfire%20at%20Guadalcanal.pdf`
(bot-check page).

combinedfleet (`https://www.combinedfleet.com/…`): `yamato.htm`, `kongo.htm`,
`haruna.htm`, `chokai_t.htm`, `haguro_t.htm`, `kumano_t.htm`, `suzuya_t.htm`,
`chikuma_t.htm`, `tone_t.htm`, `yahagi_t.htm`, `noshiro_t.htm` (200);
`nagato.htm`, `Nagato.htm` (404).

archive.org: `advancedsearch.php` (200); `metadata/battleforleytegu03bate`,
`…05bate`, `cia-readingroom-document-cia-rdp81-00706r000200020010-4`,
`battlesummaryno40royalnavy`, `DTIC_ADA003029`, `husno-volume-vi-…` (200);
downloads of `battleforleytegu03bate_djvu.txt`, the CIA memo text,
`Battlesummaryno40royalnavy_djvu.txt` and the Morison V, VI, XII `_djvu.txt`
files (200).

Wikipedia: `Battle_off_Samar&action=raw`, `Leyte_Gulf_order_of_battle&action=raw`
(200); `Battle_off_Samar_order_of_battle&action=raw` (404).

Others: `https://www.usswashington.com/` (502); `http://www.bosamar.com/` (301 →
200 error page); `https://www.history.navy.mil/` (refused);
`https://www.navsource.org/archives/06/413.htm` (502); `https://www.desausa.org/`
(301 to an unrelated site).
