# R10: the attack on Pearl Harbor, 7 December 1941, as a battle box and its moments

Researcher R10, for the designer of the Pacific War diorama. Written 2026-10-22.
Topic: the attack on Pearl Harbor in full, on both sides, as the material for the
scenario file (`boxes/pearl-harbor/battle.json`, DATA.md §9) and its moments.
It builds on R4 §4 (the Pearl Harbor outline) and does not repeat it except
where a number needs a second source or a correction.

Standard (the brief's §6 and the Hawaiian `RESEARCH.md`): every number sits in a
telling with its source; where tellings disagree each is given; anything not
opened in this pass is marked *verify*. "Opened" means R10 fetched and read the
text (or, for a file another researcher downloaded into this scratchpad, read
that copy; the URL is given either way). Tertiary sources (Wikipedia, both
languages) are used as finding aids and marked *tertiary*.

Every time below is **Hawaiian time of 1941 (UTC−10:30)** unless marked, with
the source's own clock beside it where it differs (§2).

Downloads (small) are in
`/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/research/downloads/R10/`;
scratch scripts (HTML to text, a parser for the Roberts Commission narrative,
the geometry and sun script, the pack transects) are in
`/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/research/r10-scripts/`.
Nothing in the repository was written.

---

## 0. Headline findings

1. **The US record is good enough to choreograph minute by minute from primaries.**
   Besides CINCPAC's report (15 Feb 1942) and its damage enclosures, HyperWar
   indexes about 110 ship and unit action reports (31 of them read for this file), and the Pearl Harbor Attack
   hearings (ibiblio.org/pha) carry Kimmel's own *time-ordered* "Narrative of
   events" compiled from every ship's report (Roberts Commission, PHA Pt 24
   pp. 1570–1611), the Bishop's Point radio log in GCT (Ward's messages at
   06:51 and 06:53), and the Army's table of fighter take-off times by field
   (PHA Pt 12, Exhibit 5, §VI). §8 is built from these.
2. **The Japanese record reachable in English is post-war and from memory, but
   it is consistent on the essentials.** Joint Committee Exhibit 8 (Japanese
   answers to a 1945 questionnaire, Fuchida, Genda, Tomioka, Mito), Japanese
   Monograph 97 (the orders, reconstructed), USSBS *Campaigns* ch. 2 and its
   appendices, and the combinedfleet.com TROMs. JACAR holds the carriers'
   original **飛行機隊戦闘行動調書** (air group action records) for 8 December
   1941: Akagi C08051579600, Kaga C08051585400, Sōryū C08051578600, Hiryū
   C08051579100, Shōkaku C08051577100, Zuikaku C08051577600 (§14.3; the
   search page lists titles one row off their RefCodes, so each was checked on
   its own record page). Their first sheets confirm the first-wave numbers and
   loads for Akagi, Kaga, Hiryū, Shōkaku and Zuikaku, and Sōryū's fighters. The Kidō Butai's own 戦闘詳報 was not found by keyword.
3. **"230 miles north of Oʻahu" is a conflation.** The Japanese plan and the
   1945 answers measure the launch points from **the western tip of Lānaʻi**
   ("Point Z"): first wave at 01:30 JST (06:00 HST) from 230 nautical miles
   bearing 000° from it, second wave at 02:45 JST (07:15 HST) from 200 nm
   (Exhibit 8, PHA Pt 13 p. 408; JM-97 Op. Order 3). Computed, the first point
   is about **24.6°N 157.1°W, 202 nm (374 km) from Ford Island**, which is why
   USSBS says "200 miles north of Oahu" and the AAF history 220 miles. No
   source opened gives a logged lat/lon for the launch; the TROMs say 06:18
   (Akagi, Kaga, Sōryū) or 06:00 (Shōkaku, Zuikaku) for the first launch.
4. **The 1941 offset is UTC−10:30, proven inside the record.** Monaghan's report
   receipts a despatch "at 1821 GCT (0751 LCT)"; the Bishop's Point log notes
   "subtract 10½ hours"; the tz database (citing Schmitt and Cox, *Hawaiian
   Journal of History* 26, 1992) has −10:30 until war time on 9 Feb 1942. The
   Japanese reports keep Tokyo time and the Tokyo date: **HST = JST − 19 h 30 min**
   (JST 03:25 on 8 Dec = HST 07:55 on 7 Dec). One pair in Exhibit 8 does not
   convert by that rule (§2.3).
5. **The anchorage can be placed to tens of metres.** ComBatShips' report gives
   the berths and pairs from its berthing plan: California F-3; Maryland F-5
   inboard, **Oklahoma F-5 outboard**; Tennessee F-6 inboard, **West Virginia
   F-6 outboard**; Arizona F-7 inboard with **Vestal outboard**; Nevada F-8;
   Pennsylvania with Cassin and Downes in Drydock No. 1; Helena with Oglala
   outboard at 1010 Dock. The F-6, F-7 and F-8 quays survive and are mapped in
   OpenStreetMap under the ships' names; the Arizona and Utah wrecks are mapped
   too (§7). F-3 to F-5 were rebuilt after the war and are inferred.
6. **The tellings on the dead have moved.** The NPS's Pearl Harbor National
   Memorial now gives **2,390** Americans killed (2,341 service members and
   49 civilians; Hickam 191 including 5 civilians; Arizona 1,177; Oklahoma 429;
   West Virginia 106; California 105) on its People page. The figure of
   **2,403 with 68 civilians** survives in older tellings (en.wikipedia citing
   Conn et al. 2000, *tertiary*). Both go on the card with their scope.
7. **Hits per ship differ by source and the box needs one authority.** West
   Virginia: 4 torpedoes (ComBatShips, Dec 1941), 4–5 (CINCPAC, Feb 1942),
   **7** (BuShips *Summary of War Damage*, 1942, after salvage), 6 (NPS), 9
   (en.wikipedia). Oklahoma: 3–5, 5, 8, 9 in the same sources. Arizona: 3
   bombs (ComBatShips), "about eight" (CINCPAC), **8 bombs and 1 torpedo**
   (BuShips). Recommend the BuShips summary (opened) as the damage authority.
8. **Japanese losses are firm and attributable.** 29 aircraft: 9 in the first
   wave (3 A6M, 1 D3A, 5 B5N) and 20 in the second (6 A6M, 14 D3A) (Exhibit 8
   answer 40; USSBS). By carrier (TROMs): Kaga 15 (4 A6M, 5 B5N, 6 D3A),
   Akagi 5, Sōryū 5 (all second wave), Shōkaku 1 D3A (first wave), Zuikaku 0;
   Hiryū's 3 by subtraction. The five B5Ns lost were all torpedo bombers
   (ja.wikipedia, *tertiary*), so **Kaga's torpedo unit lost 5 of 12**. 55
   airmen and 9 submariners killed, 1 captured (en.wikipedia, *tertiary*); the
   crew arithmetic (9×1 + 15×2 + 5×3 = 54) nearly matches.
9. **The torpedo run has a recorded envelope from both sides.** US observers:
   approach at about 200 ft, drop at 15–75 ft (ComBatShips), 30–40 ft and 200–300
   yards from Oklahoma (Bagley), about 50 ft past the submarine base pier
   (Tautog), 200–400 yards (Oklahoma's CO), 500 yards at Helena. Japanese:
   the "first method" adopted in August 1941 with the Type 91 Mod 2 and its
   roll stabiliser and wooden tail (框板, *kyōban*), **160 knots at 20 m**
   (ja.wikipedia, *tertiary*; the US Naval Technical Mission report behind it
   was not opened). §5.2.
10. **Nevada's run is about 2.9 km in about 30 minutes**, F-8 at 08:40 to the
    channel's turn off Hospital Point at about 09:10 (CINCPAC), an average of
    about 3 knots with stops (computed). She grounded there "temporarily", got
    clear at 10:35 and grounded again on Waipiʻo Peninsula opposite Hospital
    Point at 10:45 (CINCPAC); Kimmel's narrative logs 09:13 "stopped south side
    of south channel" and 09:40 "grounded off Hospital Point". A ship moment at
    timeScale 2 or 3 fits.
11. **The Hawaiian Oʻahu pack (68.3 m) resolves the lochs and Ford Island but not
    a ship-scale harbour.** Measured on the pack: the water off Battleship Row is
    about 770 m wide (11 texels), the channel at Hospital Point about 440 m (6–7
    texels), Southeast Loch about 240 m (3–4 texels). A battleship is 3 by 0.5
    texels. A 10 m harbour inset from NOAA's CUDEM 1/9″ topobathy (tiles
    `ncei19_n21x50_w158x00` and `…w158x25`, 159 and 144 MB) is recommended for
    the ship moments and the torpedo run, with the Hawaiian app's dated patches
    for 1941 (Kuahua before its 1943 fill; Ford Island after its 1930s fill).
12. **Both sides have clean, mirrored sorties that score hardware, not people.**
    Recommended for v1: a Kaga B5N torpedo run on the outboard battleships
    (07:56); Nevada's helm and AA down the channel (08:40–09:10) mirrored by a
    second-wave D3A over the channel; Welch and Taylor's P-40s over ʻEwa
    (≈08:30), mirrored by a second-wave A6M over Kāneʻohe against Sanders's
    P-36s (≈08:55); and Helm, the one destroyer under way at 07:55. The
    level-bomber role should be Akagi's group, so **the Arizona explosion at
    about 08:06 is always the record's beat and never the player's**.

---

## 1. Method, scope and conventions

- Read the brief, DESIGN.md §3.4, §3.5, §5.3, §5.7, §7.4 and §8, DATA.md §7 and
  §9, R2 §3 and §18–19, R4 §2 and §4, and the Hawaiian `DATA.md` (packs,
  districts, patches). Both design files changed on disk during the pass;
  the sections used were re-read.
- Read the Hawaiian app's committed data through `git show` on
  `origin/claude/funny-cannon-vy1pyf` (read-only): the Oʻahu pack's manifest
  entry, the patches manifest, the Oʻahu height pack and two patch masks, to
  measure the harbour at the pack's resolution (§11).
- Mined HyperWar's Pearl Harbor reports (CINCPAC, Battle Force, Battleships,
  PatWing 1, and 31 ship reports), the AAF history *7 December 1941: The Air
  Force Story* (1991; chapters 4 and 6 and appendices B, D, E), USSBS ch. 2 and
  its appendix plates on archive.org, the USMC monograph *"Infamous Day":
  Marines at Pearl Harbor* (1992), the BuShips *Summary of War Damage* (1942),
  the PHA hearings' exhibits on ibiblio.org/pha, JM-97, the TROMs, JACAR,
  the NPS, OpenStreetMap (Overpass), the IANA tz database, NOAA's CUDEM
  listing, and Wikipedia in both languages (*tertiary*).
- Computed: the launch points from "Point Z", distances and bearings, Nevada's
  track length, box sizes, and the sun at the moments (NOAA's fractional-year
  formulas, as R4 used).
- Names: Japanese names family name first, with macrons; ships in italics are
  not used (plain names, hull numbers where useful).

---

## 2. Clocks

### 2.1 Hawaiian time in 1941: UTC−10:30

| evidence | what it says | opened |
| --- | --- | --- |
| IANA tz database, `northamerica`, Zone Pacific/Honolulu | −10:31:26 LMT until noon 13 Jan 1896; **−10:30 HST** from then; −10:30 with US rules (war time −9:30 from 9 Feb 1942) until 8 Jun 1947; −10:00 after. Comments cite Schmitt and Cox, "Hawaiian Time", *Hawaiian Journal of History* 26 (1992) pp. 207–225 (war time 1942-02-09 to 1945-09-30, p. 221; the 30-minute change in June 1947, p. 219) | yes (tz file; the article itself *verify*) |
| Monaghan's action report, 30 Dec 1941 | despatch "received on the bridge at **1821 GCT (0751 LCT)**" | yes |
| Bishop's Point radio log (PHA Pt 17 pp. 2716–20, Exhibit 119), editor's note | "Log times are in 'Zulu Time' (Greenwich Mean Time), subtract 10 1/2 hours" | yes |
| Exhibit 8, answer 27 (PHA Pt 13 pp. 409–10) | "1631 hours 8 December (2101 hours, 7 December, HAWAII time)" | yes |

So on 7 December 1941 the battle clock is **UTC−10:30**, written `"-10:30"` in
the scenario file. The US reports call it "LCT" or "LZT" or give no zone.

### 2.2 Tokyo time and the Tokyo date

The Japanese orders, reports and records keep **Tokyo time (UTC+9) and the
Tokyo date, 8 December** (X-day was "8 December (east longitude date)", USSBS
ch. 2). Rule: **HST = JST − 19 h 30 min**, i.e. add 4 h 30 min to the JST clock
reading and take one day off.

| event | JST, 8 Dec (source) | HST, 7 Dec |
| --- | --- | --- |
| first wave takes off | 01:30 (Exhibit 8; JM-97 Op. Order 3) | 06:00 |
| second wave takes off | 02:45 (same) | 07:15 |
| planned first attack | 03:30 (JM-97 Op. Order 1; USSBS "0330 Japanese time (0800 Hawaiian time)") | 08:00 |
| dive bombers on Wheeler | 03:25 (Exhibit 8) | 07:55 |
| torpedo attack | 03:27 (Exhibit 8) | 07:57 |
| fighters strafing | 03:30 (Exhibit 8) | 08:00 |
| level bombers | "0235" in the transcription, read 03:35 (Exhibit 8) | 08:05 |
| second wave attacks | about 04:30 (Exhibit 8) | about 09:00 |
| explosion seen inside the harbour by the I-boats | 16:31 (Exhibit 8) | 21:01 |

### 2.3 Cautions

- **One pair in Exhibit 8 does not convert.** It gives a midget submarine's
  radio report at "1811 hours the same day (0041 hours, 8 December, HAWAII
  time)". 18:11 JST is 22:41 HST on the 7th; 00:41 HST on the 8th would be
  20:11 JST. USSBS repeats "0041 hours 8 December". One of the two numbers is
  wrong; store both with the note.
- **USSBS's sunrise is off.** It says "Sunrise was 0230 Japanese time (0700
  Hawaiian time)". Computed sunrise at Pearl Harbor is 06:26–06:27 HST (R4;
  this pass). The clock conversion is right; the sunrise figure is not.
- **USSBS's track chart labels the launch point "0300 (Tokyo time) 8 Dec. 0°–200′
  OAHU"** (Appendix 2, opened as a page image), and its text says the force
  "arrived at the launching point 200 miles north of Oahu at 0730, 7 December
  (Hawaiian time)" while also saying the first wave "took off at 0600
  (Hawaiian time)". The 0300 JST label and the "0730" are inconsistent with
  every other source; treat the chart as schematic.
- **The ships' clocks were set by hand and remembered.** CINCPAC: "There are
  great conflicts in these reports. Certain events are listed with such wide
  variations of the time and number of units participating as to cause doubt
  that the reports are referring to the same event." Kimmel's narrative
  carries one entry stamped "0760".

### 2.4 The scenario file's clock

```jsonc
"clock": { "zone": "-10:30", "name": "Hawaiian time (zone +10½)",
  "from": "1941-12-07T06:30-10:30", "to": "1941-12-07T10:00-10:30",
  "others": [
    { "name": "Tokyo time", "zone": "+09:00",
      "rule": "subtract 19 h 30 min from the Japanese records (add 4 h 30 min and take a day off): 03:25 JST 8 Dec = 07:55 HST 7 Dec" },
    { "name": "GCT", "zone": "+00:00",
      "rule": "subtract 10 h 30 min (Bishop's Point radio log; Monaghan: 1821 GCT = 0751 LCT)" } ],
  "note": "Hawaii kept UTC−10:30 until war time began on 9 Feb 1942 (tz database, citing Schmitt and Cox 1992). The Japanese records keep Tokyo time and the Tokyo date, 8 December." }
```

`from` at 06:30 holds Ward's attack (06:37–06:53); 07:00 would start at the
radar. `to` at 10:00 holds the last attackers (CINCPAC: "All enemy planes had
retired by 0945"; PatWing 1: a last strafing at Kāneʻohe "at 10 o'clock").
Nevada's final move (10:35–10:45) is a card unless `to` is 10:45 (§15, D3).

---

## 3. The Kidō Butai: the force, the launch, the recovery, the withdrawal

### 3.1 Composition

| unit | ships | source (opened) |
| --- | --- | --- |
| Air Attack Force (VAdm Nagumo Chūichi, 1st Air Fleet) | CarDiv 1 Akagi 赤城, Kaga 加賀; CarDiv 2 Sōryū 蒼龍, Hiryū 飛龍; CarDiv 5 Shōkaku 翔鶴, Zuikaku 瑞鶴 | USSBS App. 1; JM-97 Chart 1 |
| Support Force (RAdm Mikawa Gun'ichi) | BatDiv 3 (1st section) Hiei, Kirishima; CruDiv 8 Tone, Chikuma | same |
| Screening Unit (RAdm Ōmori Sentarō, DesRon 1) | light cruiser Abukuma; destroyers Urakaze, Isokaze, Tanikaze, Hamakaze (DesDiv 17), Kasumi, Arare, Kagerō, Shiranuhi (DesDiv 18), Akigumo | USSBS App. 1 |
| Patrol Unit | I-19, I-21, I-23, 100 miles ahead in the final dash (Genda, Exhibit 8 p. 427) | same |
| Supply | 1st Supply Unit Kyokutō, Kenyō, Kokuyō, Shinkoku, Akebono Maru; 2nd Toho, Toei, Nippon Maru | same; the TROMs date their detachment 5 and 6 Dec |
| Midway Neutralisation Unit (separate) | Akebono, Ushio (and oiler Shiriya) | USSBS; JM-97 |

Exhibit 8's first, hasty answer (8 Oct 1945) gives "Kongo and Hiei" and other
destroyer divisions; its later answers and USSBS correct this. The carriers'
air groups: Akagi's operational group of 18 A6M2, 27 B5N2 and 18 D3A1 at
Hitokappu (Akagi TROM, a telling).

### 3.2 Approach and launch

| item | telling | source |
| --- | --- | --- |
| stand-by point | 42°N 170°E by the afternoon of 3 Dec (CinC Combined Fleet order of 25 Nov) or 42°N 165°W (JM-97 Op. Order 1); 40°N 170°W in another reconstruction in Exhibit 8 | Exhibit 8 pp. 395, 427; JM-97 |
| approaching point | 32°N 157°W (JM-97 Op. Order 1; Exhibit 8 p. 431 source documents) | JM-97 |
| the dash | "700 nautical miles bearing 0° from Point Z (western tip of LANAI Island)" at 06:00 X−1 day (JST), course 180° at 24 kn from 07:00 X−1 day | JM-97 Op. Order 3; Exhibit 8 p. 431 |
| first launch | **01:30 JST (06:00 HST), "230 nautical miles bearing 0° from the western tip of LANAI Island"** | Exhibit 8 answer 26b (PHA Pt 13 p. 408); JM-97 Op. Order 3 |
| second launch | **02:45 JST (07:15 HST), 200 nm bearing 0° from the same point** | same |
| as US works tell it | "0600 (Hawaiian Time) from a position 200 miles north of Oahu"; second "one hour and fifteen minutes later" (USSBS); "a point 220 miles north of Oahu" (AAF ch. 4); "about 200 miles north of western tip of Lanai" (Genda to the Naval Technical Mission, Exhibit 8 p. 427) | opened |
| TROMs | first wave launched **06:18** (Akagi, Kaga, Sōryū TROMs); "0600 on Dec 7th local date", second "0715 local" (Shōkaku) or "ninety minutes later" (Zuikaku) | opened |
| the plan's history | Op. Order 1 (23 Nov) had the take-off point "200 nautical miles north of the enemy fleet anchorage at 0100 hours X Day (0530 Honolulu time)"; Op. Order 3 moved it to 230 nm north of Point Z at 01:30. ja.wikipedia (*tertiary*) says Genda had the plan changed from "200 nm north, launching while retiring" to "230 nm north of Ford Island, closing to 200 nm for the second wave", to shorten the return | JM-97; ja.wp |

**Computed positions** (script `geo10.py`; Point Z taken as Lānaʻi's western tip
near 20.795°N 157.060°W, from the Hawaiian app's Lānaʻi pack bounds, ±2 km):

| point | lat, lon | from Ford Island |
| --- | --- | --- |
| first launch, 230 nm 000° from Point Z | **24.63°N, 157.06°W** | 374 km (202 nm), bearing 014° |
| second launch, 200 nm 000° from Point Z | 24.13°N, 157.06°W | 321 km (173 nm) |
| first launch to Kahuku Point | — | 337 km (182 nm); bearing 196°; 06:15–07:35 implies about 137 kn |
| 230 nm due north of Ford Island (the conflated reading) | 25.20°N, 157.96°W | — |

No logged lat/lon for either launch was found in what was opened. The force
came south to "190 nm north of Pearl Harbor" to recover (ja.wikipedia citing
Kusaka 1979 p. 71, *tertiary*).

**The weather at the carriers.** "The second wave, although delayed due to rough
seas, made it off with the loss of only four aircraft" (AAF ch. 4); first-wave
aborts: one level bomber, three dive bombers and two Zeros, all mechanical,
"within fifteen minutes" (AAF ch. 4, citing Senshi Sōsho 10 via D. Aiken).
At 06:00 HST the sun was 7° below the horizon at the first launch point
(computed): the first wave formed up in twilight.

### 3.3 Recovery and withdrawal

| item | telling | source |
| --- | --- | --- |
| planned recovery | first wave 05:30–06:00 JST (10:00–10:30 HST); second wave 06:45–07:15 JST (11:15–11:45 HST); force to withdraw north at 24 kn after the second launch | JM-97 Op. Order 3 |
| rendezvous of the attack units with their fighters | "a point bearing 340° distance 20 miles from Kaena Point" (USSBS); "20 nautical miles bearing 340° from KAENA Point", at 1,000 m (Exhibit 8 pp. 409, 434) — computed **21.89°N 158.40°W**; "some 10 miles west of Kaena Point" (USMC monograph) | opened |
| actual recovery | first wave from about 04:45 to after 06:00 JST (09:15–10:30 HST); second about 07:00 JST (11:30 HST); last aircraft about 08:14 JST (12:44 HST), Hiryū's PO1c Kasashima with a damaged engine | ja.wikipedia citing Kusaka 1979 (*tertiary*; *verify*) |
| decision not to strike again | Mikawa proposed a further attack; Nagumo, on Kusaka's advice, withdrew as planned; Yamaguchi signalled "second strike ready" | ja.wp citing Kusaka 1979 p. 74 (*tertiary*); USSBS: "no further attack was considered necessary" |
| withdrawal | about 09:00 JST (13:30 HST) the force turned NNW for home (ja.wp, *tertiary*); north-west then west, "skirt 800 nautical miles north of Midway", assembly point 30°N 165°E (JM-97 plan); USSBS App. 2 draws the return track and the detachment of CarDiv 2, CruDiv 8 and DesDiv 17's Tanikaze and Urakaze "to Wake operation" (16 Dec, TROMs) | opened |
| home | Akagi, Kaga, Shōkaku, Zuikaku at Hashirajima 23 Dec (TROMs) | opened |

### 3.4 Should the box include the launch point?

No. The first launch point is 374 km from Ford Island (computed). DATA.md §7
requires the box to hold every unit's track from `from` to `to` with 10 km to
spare, so a box with the carriers in it is about **184 × 423 km** (computed for
21.15–24.95°N, 158.6–156.8°W), almost all of it open sea, and the carriers do
nothing in the box after 07:15 but steam. Recommendation (§15, D1): an island box
of about **103 × 100 km** (21.15–22.05°N, 158.55–157.55°W) that holds the
deployment off Kahuku at 07:40, the rendezvous off Kaʻena Point, the B-17s'
arrival from the east and Enterprise's SBDs from the west; the carriers stay
**off-box**, and the waves enter at the box's north edge (the first at about
07:28, the second at about 08:30, from the computed ground speed). The table
draws the carriers' track and the launch (routes, DATA.md §5); the briefing card
says where they were.

---

## 4. The air groups: wave, carrier, type, number, leader, load, losses

### 4.1 First wave (launched 06:00–06:18 HST; 01:30 JST)

Planned 189 (USSBS App. 3; the plate opened on archive.org prints "Type 99
carrier bomber" for the level and torpedo units, an error for Type 97). Flown
**183: 43 A6M2, 89 B5N2 (49 level, 40 torpedo), 51 D3A1** (Akagi, Kaga, Sōryū
TROMs; ja.wikipedia; the AAF's 189 planned less one level bomber, three dive
bombers and two fighters that aborted).

| carrier | unit (USSBS App. 3) | leader | type | planned | flown | load | flown per JACAR first sheet (C-codes §14.3) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Akagi | 1st Attack Unit (level) | Cdr Fuchida Mitsuo 淵田美津雄 (also air commander) | B5N2 | 15 | 15 | one 800 kg AP bomb (Type 99 No. 80 Mk 5) | 27 fk (B5N): 800 kg ×15, torpedo ×12; fc (A6M) ×9 |
| Akagi | 1st Special Attack Unit (torpedo) | LtCdr Murata Shigeharu 村田重治 | B5N2 | 12 | 12 | one Type 91 aerial torpedo | (above) |
| Akagi | 1st Fighter Unit | LtCdr Itaya Shigeru 板谷茂 | A6M2 | 9 | 9 | 2 × 20 mm, 2 × 7.7 mm | (above) |
| Kaga | 2nd Attack Unit (level) | LtCdr Hashiguchi Takashi 橋口喬 | B5N2 | 15 | 14 | 800 kg | 26 fk: 800 kg ×14, torpedo ×12; fc ×9; leaders named Shiga, Kitajima, Hashiguchi |
| Kaga | 2nd Special Attack Unit (torpedo) | Lt Kitajima Ichirō 北島一良 | B5N2 | 12 | 12 | torpedo | (above) |
| Kaga | 2nd Fighter Unit | Lt Shiga Yoshio 志賀淑雄 | A6M2 | 9 | 9 | | (above) |
| Sōryū | 3rd Attack Unit (level) | Lt Abe Heijirō 阿部平次郎 | B5N2 | 10 | 10 | 800 kg | fighter sheet: fc ×8, claimed 4 shot down and 1 unconfirmed |
| Sōryū | 3rd Special Attack Unit (torpedo) | Lt Nagai Tsuyoshi 長井彊 | B5N2 | 8 | 8 | torpedo | |
| Sōryū | 3rd Fighter Unit | Lt Suganami Masaharu 菅波政治 | A6M2 | 9 | 8 | | |
| Hiryū | 4th Attack Unit (level) | LtCdr Kusumi Tadashi 楠美正 | B5N2 | 10 | 10 | 800 kg | fk ×18: 800 kg ×10, Type 91 torpedo ×8; fc ×6 |
| Hiryū | 4th Special Attack Unit (torpedo) | Lt Matsumura Heita 松村平太 | B5N2 | 8 | 8 | torpedo | (above) |
| Hiryū | 4th Fighter Unit | Lt Okajima Kiyokuma 岡嶋清熊 | A6M2 | 6 | 6 | | (above) |
| Shōkaku | 15th Attack Unit (dive) | LtCdr Takahashi Kakuichi 高橋赫一 (dive-bomber commander) | D3A1 | 27 | 26 | one 250 kg land bomb (陸用爆弾) | fb (D3A) ×26, 250 kg ×26 |
| Shōkaku | 5th Fighter Unit | Lt Kaneko Tadashi 兼子正 | A6M2 | 6 | 5 (TROM) | | |
| Zuikaku | 16th Attack Unit (dive) | Lt Sakamoto Akira 坂本明 | D3A1 | 27 | 25 | 250 kg land bomb | fb ×25, 250 kg ×25; fc ×6 |
| Zuikaku | 6th Fighter Unit | Lt Satō Masao 佐藤正夫 | A6M2 | 6 | 6 | | (above) |

Targets (USSBS; JM-97 Op. Order 3): level and torpedo units, "about four
battleships and four aircraft carriers", battleships first; 15th unit Ford
Island hangars and aircraft; 16th Wheeler; fighters air control, then strafing
at Ford Island and Hickam (2nd unit), Wheeler and ʻEwa (4th), Kāneʻohe (6th)
— in the event Akagi's and Kaga's fighters took ʻEwa first (USMC monograph).
Readings of the names are from standard forms; the JACAR OCR garbles several
(渕田, 千早猛広, 進広三郎, 佐藤正大, 能野澄天, 島崎重和, 志賀叔雄). *Verify* all
readings with a Japanese reader.

### 4.2 Second wave (launched 07:15 HST; 02:45 JST)

Planned 171 (USSBS App. 3). Flown **167: 35 A6M2, 54 B5N2, 78 D3A1** (TROMs;
AAF text). Other tellings: 170 (36, 80, 54; ja.wikipedia citing Kusaka); the AAF's
own map 7 prints "79 dive bombers & 36 fighters".

| carrier | unit | leader | type | planned | flown (TROMs) | load |
| --- | --- | --- | --- | --- | --- | --- |
| Zuikaku | 6th Attack Unit (level) | LtCdr Shimazaki Shigekazu 嶋崎重和 (second-wave commander) | B5N2 | 27 | 27 | one 250 kg land bomb and six 60 kg bombs (USSBS); the AAF, from Senshi Sōsho, splits the 54 as 18 with two 250 kg and 36 with one 250 kg plus six 60 kg |
| Shōkaku | 5th Attack Unit (level) | Lt Ichihara Tatsuo 市原辰雄 | B5N2 | 27 | 27 | as above |
| Sōryū | 13th Attack Unit (dive) | LtCdr Egusa Takashige 江草隆繁 (dive-bomber commander) | D3A1 | 18 | 18, one aborted | one 250 kg ordinary bomb (通常爆弾) |
| Hiryū | 14th Attack Unit (dive) | Lt Kobayashi Michio 小林道雄 | D3A1 | 18 | not stated | as above |
| Akagi | 11th Attack Unit (dive) | Lt Chihaya Takehiko 千早猛彦 | D3A1 | 18 | 18 | as above |
| Kaga | 12th Attack Unit (dive) | Lt Makino Saburō 牧野三郎 | D3A1 | 27 | 23 (Kaga TROM; does not sum with the others to 78) | as above |
| Akagi | 1st Fighter Unit | Lt Shindō Saburō 進藤三郎 | A6M2 | 9 | 9 | |
| Kaga | 2nd Fighter Unit | Lt Nikaidō Yasushi 二階堂易 | A6M2 | 9 | 9 | |
| Sōryū | 3rd Fighter Unit | Lt Iida Fusata 飯田房太 | A6M2 | 9 | 9 | |
| Hiryū | 4th Fighter Unit | Lt Nōno Sumio 能野澄夫 | A6M2 | 9 | not stated | |

Targets (USSBS): level units the airfields (6th: Hickam; 5th: Kāneʻohe, Ford
Island, ʻEwa — "Barbers Point" in JM-97); dive units "aircraft carriers and
cruisers", in the event mostly battleships and the Navy Yard; fighters air
control and strafing at Hickam, Ford Island, Wheeler and Kāneʻohe.

### 4.3 CAP over the carriers

USSBS App. 4: three patrols of 18 A6M (Akagi and Kaga airborne; Sōryū and Hiryū
on deck; Shōkaku and Zuikaku on the hangar deck, armed), alternating every two
hours from an hour before sunrise to 45 minutes after sunset. The AAF counts 39
fighters kept back. Zuikaku launched three spare Zeros as CAP (Zuikaku TROM).
Off-box.

### 4.4 Losses: 29 aircraft

| wave | A6M | D3A | B5N | total | source |
| --- | --- | --- | --- | --- | --- |
| first | 3 | 1 | 5 | **9** | Exhibit 8 answer 40 (Fuchida's recollection and inquiries); USSBS (its HyperWar transcription drops the B5N line; the total 9 stands) |
| second | 6 | 14 | 0 | **20** | same |
| total | 9 | 15 | 5 | **29** | same; the AAF: "The Japanese would concede the loss of twenty-nine aircraft from all causes" |

| carrier | lost (TROMs) | note |
| --- | --- | --- |
| Kaga | 15: 4 A6M, 5 B5N, 6 D3A | the five B5Ns were torpedo bombers (level bombers lost none, torpedo bombers 5 of 40 = 12.5%: ja.wikipedia, *tertiary*), so **Kaga's 2nd Special Attack Unit lost 5 of 12** |
| Akagi | 5: 1 A6M, 4 D3A | |
| Sōryū | 5: 3 A6M, 2 D3A, all second wave | Iida's A6M among them (ja.wp: holed by Kāneʻohe's AA, he dived on the station; *tertiary*) |
| Hiryū | 3 by subtraction: 1 A6M, 2 D3A | *inference*; the A6M is PO1c Nishikaichi's, which came down on Niʻihau (ja.wp, *tertiary*) |
| Shōkaku | 1 D3A, first wave | Shōkaku TROM |
| Zuikaku | 0 | Zuikaku TROM ("no aircraft damaged or lost in combat"; two reconnaissance aircraft ditched) |

Damaged on return: 74 in the second wave (23 A6M, 41 D3A, 10 B5N) (ja.wikipedia,
*tertiary*; en.wikipedia "74 aircraft damaged", *tertiary*).

---

## 5. Weapons and attack profiles (what the record gives the sim)

### 5.1 B5N2 level bomber and the No. 80 bomb

- Load: one 800 kg armour-piercing bomb (USSBS; JACAR sheets "800 ×15" etc.),
  the **Type 99 No. 80 Mark 5** (九九式八十番五号爆弾; Akagi TROM "800-kg Type 99
  model 5"), converted from a battleship shell. US observers: "converted
  fifteen or sixteen inch shells; they penetrated with about 20-inch holes, low
  order detonation, and very little flame" (ComBatShips; CINCPAC); BuShips:
  Tennessee's two were "converted from 16" AP projectiles". Weight and filler:
  *verify* (not opened).
- Method (USSBS, Exhibit 8): from **3,000 m or more**, in formations of five,
  the formation releasing together; the planners expected four salvos in five
  on a stationary battleship, and so "about four battleships" from ten
  formations; bombs for the inboard ships, which torpedoes could not reach.
  Hiryū's TROM credits Kusumi's group with Arizona's fatal bomb "dropped from
  3,200 meters". US estimates of height: 10,000–12,000 ft (Oklahoma's XO;
  CINCPAC's photograph of a group "flying at 12,000 feet"), 14,000 ft (Helena).
- AA against them: "the fuze settings and range were much too short and the sky
  was filled with smoke from shell burst 2000 to 4000 feet below the planes"
  (Monaghan's Ensign Gilpin). Level bombers lost: none (ja.wp, *tertiary*).

### 5.2 B5N2 torpedo bomber and the Type 91 Mod 2

| item | telling | source |
| --- | --- | --- |
| weapon | Type 91 aerial torpedo Mod 2 (九一式魚雷改二), 800 kg class ("One 800-kg aerial torpedo", USSBS); 100 modified by Mitsubishi Nagasaki for shallow water and loaded at Saeki (Kaga TROM); 100 delivered by 5 Nov after 36-hour shifts (ja.wp) | opened; ja.wp *tertiary* |
| shallow-water fix | wooden aerodynamic tail (框板, *kyōban*) that breaks away at entry, plus a roll-stabilising control (安定機) introduced 1941; "specially contrived wooden fins, remnants of which were discovered on salvaged enemy torpedoes" (CINCPAC); "special stabilizers ... launch them from an extremely low altitude" (USSBS) | opened; ja.wp |
| dive after entry | under 20 m with the Mod 2, under 10 m for a handful of CarDiv 1's best pilots (ja.wp, *tertiary*); training in Kagoshima Bay, 10 m deep (ja.wp) | *tertiary* |
| depth at the berths | F-5: 48–54 ft (14.6–16.5 m) (Oklahoma's damage report) | opened |
| Japanese launch envelope | "first method" from August 1941: **160 kn (about 300 km/h) at 20 m**, gear and flaps up; the abandoned "second method" was 100 kn at 10 m with gear and flaps down (ja.wp, *tertiary*). Example: released 620 m short at 300 km/h and 10 m, the torpedo enters 120 m on at 9.5° after 1.4 s and hits 21 s after release, having run 500 m (ja.wp, *tertiary*) | *tertiary*; the US Naval Technical Mission to Japan report on Japanese torpedoes (O-01-1) behind it, *verify* |
| US-observed approach | "coming in from the southeast at about 200 feet altitude and launching the torpedoes at an altitude estimated from 15 to 75 feet" (ComBatShips) | opened |
| US-observed drop | 30–40 ft, 200–300 yards from Oklahoma (Bagley); about 50 ft, "after submarine base pier was passed" (Tautog); 75 ft, 200 yards at California (Cassin); 75 ft altitude, levelled for launching (Sumner); straight shots from the port bow at 200–400 yards (Oklahoma's CO); about 500 yards, from a plane low over Ford Island's south tip (Helena) | opened (Kimmel narrative; ship reports) |
| warhead | "A recovered unexploded torpedo carried a charge of 1,000 pounds of explosive" (CINCPAC); the charge of the Mod 2 head, *verify* | opened / *verify* |
| results by source | §10.3 | |

For the sim: a drop at 15–25 m and 75–85 m/s, 200–600 m from the target, on a
straight, level run of at least a few seconds; a torpedo that enters steeper or
faster dives into the mud. These are design numbers derived from the tellings
above, not a record.

### 5.3 D3A1 dive bomber

- First wave: one 250 kg land bomb (陸用爆弾); second wave one 250 kg ordinary
  bomb (通常爆弾) (USSBS); "each aircraft could carry two 60-kilogram bombs under
  the wings ... no Japanese records have been found supporting this claim"
  (AAF ch. 4). Two fixed and one flexible 7.7 mm.
- Releases: 500–1,000 ft over Wheeler's hangars (AAF ch. 4); pull-out "at about
  300 feet" over the battleships (CINCPAC); second wave over the Navy Yard,
  "shallow dives (about 45°–50°). The average release heighth being about 1000',
  although in some cases releases were made as low as 300-40[0] feet", all from
  one direction, down-sun (Enterprise's group commander); "attacks were made in a
  glide rather than a dive ... pull-outs were as low as 400 feet" (VS-6);
  "dive release; 1,000 feet; steep" (Shaw's war damage report).

### 5.4 A6M2 fighter

Two 20 mm and two 7.7 mm (USSBS App. 3); the 7.7 mm belts loaded two
armour-piercing, one tracer, two armour-piercing, one incendiary (AAF ch. 4).
Strafing "down to within 25 feet of the ground" at ʻEwa (USMC monograph). Planned
role: one formation over Oʻahu for air control, splitting to strafe only if no
fighters rose (USSBS), which is what happened: "They abandoned their whole
fighter defense system when they encountered no initial reaction" (AAF ch. 4).

### 5.5 The defence's guns

CINCPAC: ready ammunition at the guns was 15 rounds per gun for two 5-inch AA
guns and 300 rounds per gun for half the .50-calibre battery in battleships and
cruisers; "the first batteries opened fire less than two minutes after the
attack was initiated", all within about seven; average to man and fire all AA:
battleships under 5 minutes, cruisers 4, destroyers 7. Expended in all (CINCPAC):
150 rds 5"/51, 1,665 5"/38, 1,523 5"/25, 4 4"/50, 1,741 3"/50, 1,060 3"/23,
5,770 1.1", 221,368 .50, 48,669 .30, 2,519 .45, 8 depth charges. Per ship where
reported: Maryland 450 5"/25, 4,500 1.1", 2,500 .50; Helm 90 5" and 350 .50.
Opening times by ship are in §8.

---

## 6. Approach and attack geometry, with times

### 6.1 The first wave's approach (Japanese side)

| HST (JST) | event | source |
| --- | --- | --- |
| 07:35 (03:05) | Kahuku Point sighted through a break in the cloud | ja.wikipedia (*tertiary*) |
| — | approach "at an altitude of 3,000 meters above a dense cloud layer which was hanging about 2,000 meters" | USSBS; Exhibit 8 |
| 07:40 (03:10) | ordered to deploy (USSBS App. 5 plate: "ordered to deploy at 0740 hours", north of Kahuku); the signal トツレ and one flare (surprise: torpedoes first) | USSBS App. 5; ja.wp |
| 07:40 | the 43 Zeros split off near Kahuku (USMC monograph) | opened |
| ~07:40 | the flare mix-up: Fuchida fired a second flare thinking Murata had missed the first; Takahashi read two flares (attack against alert defences: dive bombers first) and led the dive bombers in ahead of the torpedoes | ja.wp (*tertiary*); Fuchida's own account *verify* |
| 07:49 (03:19) | ト・ト・ト ("to, to, to"), all units attack | ja.wp (*tertiary*) |
| 07:50 | "ordered to attack at 0750" (USSBS text); App. 5 places the order on the west side of the island | USSBS |
| 07:52 (03:22) | トラ・トラ・トラ ("tora, tora, tora", surprise achieved) sent to Akagi; acknowledged 07:53; received direct by Nagato in Hiroshima Bay and in Tokyo | ja.wp (*tertiary*); English tellings put it at 07:53, *verify* |
| 07:55 (03:25) | dive bombers on Wheeler | Exhibit 8; USSBS |
| 07:57 (03:27) | torpedo attack begins; Murata, seeing Hickam's smoke, cut short his planned run over Hickam | Exhibit 8; ja.wp |
| 08:00 (03:30) | fighters begin strafing | Exhibit 8 |
| 08:05 (03:35) | level bombers on the battleships | Exhibit 8 ("0235" in the transcription); USSBS |

Routes (AAF ch. 4; maps 6 and 7 opened): formed up north of Kahuku, turned west
along the north shore and split near Haleʻiwa. Fuchida's level bombers and
Murata's torpedo planes went toward Kaʻena Point, then south, west of the
Waiʻanae range, splitting again to come in from the west and the south.
Takahashi's dive bombers flew down the centre of the island with fighters above;
over Wheeler, Sakamoto's 25 broke off for Wheeler (from west and east, all east of
the Waiʻanaes: not through Kolekole Pass, as witnesses thought) and Takahashi's
26 went on to Hickam and Ford Island. Two float planes from Chikuma and Tone flew
about 20 minutes ahead to scout Pearl Harbor and Lahaina; five radar stations
tracked one of them (AAF). Chikuma's: "in harbour: battleships 10, heavy cruiser
1, light cruisers 10"; Tone's: no fleet at Lahaina (ja.wp, *tertiary*).

Fighters (USMC monograph, Cressman and Wenger 1992, opened): about 07:45 Sōryū's
and Hiryū's divisions (Suganami, Okajima) dived toward Wheeler; eleven from
Shōkaku and Zuikaku (Kaneko, Satō) crossed the island to Kāneʻohe; eighteen from
Akagi and Kaga (Itaya, Shiga) went over the Waiʻanaes to "Babasu Pointo Hikōjō",
ʻEwa, where they were first seen strafing at 07:55. Itaya's made one pass and went
on to Hickam; Shiga's reversed over the treetops and repeated; then Sōryū's and
Hiryū's divisions arrived from Wheeler; Okajima took his six to the rendezvous
when ground fire holed his wingman's tank. Kaneko made a single pass at Bellows
during the Kāneʻohe attack (AAF ch. 4).

### 6.2 The torpedo runs

CINCPAC's Phase I (opened), four attacks distinguished by direction, "about 21"
aircraft seen (40 launched):

| attack | from | aircraft (seen) | targets | result as reported |
| --- | --- | --- | --- | --- |
| 1 (main) | south-east, "over the tank farm, Merry Point, and environs", very low, very short range, rear gunners strafing | 12 | the battleships on the south side of Ford Island | "All of the outboard battleships were effectively hit by one or more torpedoes" |
| 2 | south-west, across Drydock No. 1 | 3 | California (F-3), Oklahoma (F-5), West Virginia (F-6) | |
| 3 | west | 1 | Helena at 1010 Dock (Oglala outboard) | the torpedo passed under Oglala and hit Helena; Oglala capsized about an hour later |
| 4 | north-west, splitting | 5 | Tangier, Utah, Raleigh, Detroit (the carrier berths F-9 to F-11) | Utah two hits, capsized; Raleigh one; one passed astern of Detroit into the bank; one between Tangier and Utah |

Other views (opened): Helm, in the West Loch channel at 08:00, saw torpedo planes
"approaching from direction of Barber's Point" cross the channel and drop "in North
Channel or across the island", targets the ships at F-9 to F-13. Conyngham
(07:57): torpedo planes attacking Raleigh, Utah and Detroit "from the West". Utah
was hit by Sōryū's torpedo unit, five aircraft including PO2 Yoshioka Masamitsu,
who took her for a carrier (ja.wp, *tertiary*).

**The south-east run, as the ships saw it** (Kimmel's narrative, opened): Tautog at
the submarine base, "about 20 planes approaching on line of OAHU rail road tracks,
and over Merry's point. Torpedoes were dropped from about 50 feet after submarine
base pier was passed"; Bagley at Navy Yard berth B-22, a plane "from direction of
Merry Point between Navy Yard and Kuahua Island, 30 or 40 feet altitude, headed for
OKLAHOMA. About 2 or 3 hundred yards from OKLAHOMA, plane dropped its torpedo";
Arizona's Fuqua, "approximately 15 torpedo planes, which had come in to the attack
from the direction of the Navy Yard". So the main group came in low from the
south-east over the Southeast Loch and the Navy Yard and released across the
channel at the outboard ships, heading roughly north-west (about 305° from Merry
Point to Oklahoma, computed). The sun at 07:57 stood 17° high at azimuth 123–124°
(computed), low behind them.

### 6.3 The level bombers

CINCPAC places 15 level bombers in Phase I: six from the south over the Yard docks
and battleships, circling right to return from the north; five from the south-west
"at an estimated altitude of about 12,000 feet, over the industrial area, Yard
docks, and battleship berths, bombing the latter enroute"; four from the north-west
over Utah, Ford Island and the Yard, "bombing the California enroute". Oklahoma's
XO: "two flights of six each high altitude bombers approaching from the direction
of the harbor entrance". Cassin: five at 12,000 ft at 08:10, six more at 08:15.
ComBatShips puts the high-level attack "from about 0825 until shortly after 0900".
CINCPAC's Phase III (08:40–09:15), "horizontal bomber attacks", is in large part the
first wave's level bombers misdated or the second wave's airfield bombers misread
(§9).

### 6.4 The dive bombers and fighters of the first wave

- Ford Island: "some 9 dive bombers from the Northeast, which, at 0755, bombed and
  strafed the hangars and planes on the southern end of Ford Island", Hangar No. 6
  in particular (CINCPAC); Pruitt saw "10 planes flying low, 200 feet".
- Hickam: "An estimated 18 planes" (CINCPAC); Takahashi's group with fighters, the
  hangar line first, then supply buildings, the consolidated barracks and other
  buildings "all in just the first few minutes" (AAF ch. 4).
- Wheeler: Sakamoto's 25, releases at 500–1,000 ft on hangars 1 and 3, then
  strafing (AAF ch. 4).
- ʻEwa: Itaya's and Shiga's Zeros from 07:55; Shōkaku's Vals returning from Ford
  Island and Hickam strafed ʻEwa again at about 08:35 (USMC monograph).
- Kāneʻohe: about nine fighters circled low and strafed the control tower, the
  four PBYs moored in the bay, then the ramp, for about 15 minutes; after a lull,
  six to nine more (PatWing 1).

### 6.5 The second wave

Sighted Oʻahu 08:40, ordered to deploy 08:50 off the north-east coast, attack run
ordered 08:55 (USSBS App. 5 plate), attacked about 09:00 (USSBS text); 全軍突撃 at
08:54 (04:24 JST) (ja.wp, *tertiary*). Approach several miles east of the first
wave; split about ten miles east of Kahuku (AAF ch. 4):

- Egusa's dive bombers banked right, came in just west of Kāneʻohe Bay and made for
  Ford Island and the Navy Yard, later strafing Hickam and ʻEwa (AAF). Kaga's
  ("23") went for Nevada, West Virginia and Maryland (Kaga TROM); a group of about
  23 concentrated on Nevada to sink her in the channel and block the harbour
  (ja.wp, *tertiary*). CINCPAC: three dive bombers from the south-west "probably ...
  did considerable damage to the U.S.S. Nevada, then proceeding down the South
  Channel about off YFD-2".
- Shimazaki's level bombers split: 18 straight in at Kāneʻohe; the rest south past
  Diamond Head and round over the sea, 27 on Hickam (low, about 150 ft, and high,
  about 1,000 ft) and 9 on Ford Island (AAF ch. 4). PatWing 1: "About 0930 a
  formation of nine, 2 seater bombers ... at an altitude of about 1000 to 1500 feet"
  bombed the VP-11/12 hangar.
- Fighters (Shindō) over Kāneʻohe, Hickam and Pearl Harbor; nine to Bellows from
  the sea side at about 09:00, for about 15 minutes, catching the 44th Pursuit
  Squadron's P-40s taking off (AAF ch. 4 and 6; the AAF names Lt Nōno's unit,
  ja.wp names Iida's).
- Rendezvous with the fighters 20 nm, 340° from Kaʻena Point (USSBS; Exhibit 8),
  computed 21.89°N 158.40°W.

---

## 7. The anchorage and the airfields

### 7.1 Battleship Row and the other berths

Berths and pairs: ComBatShips (W. S. Anderson, 19 Dec 1941; its Enclosure A
"Berthing Plan of Battleships" not on HyperWar) and CINCPAC Phase I. Positions:
OpenStreetMap through the Overpass API (maps.mail.ru mirror, fetched 2026-10-22,
ODbL), where the surviving quays are mapped under the ships' names; the rest
inferred. **Precision** uses the DATA.md vocabulary.

| berth | ship(s), inboard first | position (lat, lon) | basis | precision |
| --- | --- | --- | --- | --- |
| F-3 | California (BB-44), single | ≈21.3605, −157.9565 | inferred: south of the post-war F-5 and north of the 1943 "F3.5" wharf (21.3613, −157.9584) | schematic (±100 m) |
| F-4 | Neosho (AO-23), single | ≈21.3615, −157.9550 | inferred | schematic |
| F-5 | Maryland (BB-46) inboard, **Oklahoma (BB-37) outboard** | ≈21.3627, −157.9535 | OSM: remnants of the 1944 F-5 pier at 21.3623, −157.9540 and 21.3628, −157.9533; the Oklahoma memorial ashore at 21.3635, −157.9542 (Missouri lies at the 1992 F-5) | schematic (±60 m) |
| F-6 | Tennessee (BB-43) inboard, **West Virginia (BB-48) outboard** | quays 21.3640, −157.9517 (Tennessee) and 21.3636, −157.9523 (West Virginia) | OSM ways 345954549, 345954555 | chart |
| F-7 | Arizona (BB-39) inboard, **Vestal (AR-4) outboard** | quays 21.3652, −157.9501 (Arizona) and 21.3648, −157.9507 (Vestal); wreck centre 21.3649, −157.9502 | OSM ways 345950989, 345950991, 165627403 | chart |
| F-8 | Nevada (BB-36), single | quay 21.3664, −157.9485 | OSM way 345950988 | chart |
| Drydock No. 1 | Pennsylvania (BB-38), Cassin (DD-372) and Downes (DD-375) ahead of her | dock 21.3512, −157.9587 | OSM way 1158872974 (built 1919) | chart |
| floating drydock YFD-2 | Shaw (DD-373) | "Floating Dock West of new dry dock adjoining PENNSYLVANIA" (Pennsylvania's entry) | position *verify* | narrative |
| 1010 Dock, berth 2 | Helena (CL-50), **Oglala (CM-4) outboard** | the Navy Yard waterfront facing Ford Island's south end | position *verify* | narrative |
| F-10, F-11 (carrier berths; carrier often at F-9) | Utah (AG-16) and Raleigh (CL-7) (CINCPAC), which at which *verify* | Utah's wreck 21.3689, −157.9627; the 1941 wharves F9 21.3659, −157.9663 and F10 21.3672, −157.9642 | OSM ways 165627414, 165628661, 165628662 | chart (Utah) |
| F-12, F-13 | Detroit (CL-8) (she later "maneuvered to place herself port side to berth F-13"); Tangier (AV-8) "moored at Northwest end of Ford Island" (Monaghan) | *verify* | — | narrative |

The quay line runs about 052°/232° (computed F-3 to F-8). Outboard ships lay on the
channel side, about one beam (30–33 m) further south-east. Which way the bows
pointed is not in what was read: *verify* on the berthing plan.

Other ships (narrative positions; all *verify* on a chart): Dobbin with destroyers
at X-2; Whitney at X-8 with Conyngham, Reid, Tucker, Case, Selfridge; DesDiv 2
(Aylwin, Farragut, Dale, Monaghan) at X-14, "ship's head 025° True" (Monaghan);
Henley at X-11; Helm at X-7 until 07:26; Phoenix at C-6; Curtiss at X-22 in the
north channel off Pearl City; MinDiv 4 (Trever, Wasmuth, Zane, Perry) at D-7 "bows
toward Pearl City"; Ramsay at D-3; New Orleans and San Francisco at Navy Yard
berths 14–16 under repair; Honolulu and St. Louis astern of Bagley near berth B-22;
Mugford and Jarvis alongside Sacramento at berth 6; Sumner at the new dock at the
south end of the Submarine Base; Thornton at S-1; Avocet at F-1A; Pyro at the West
Loch dock; Solace near the north channel (shifted to X-13 at 09:25). CINCPAC: "some
86 ships of the Pacific Fleet moored in Pearl Harbor", discounting small craft; the
PHA's list of ships present (Pt 12 pp. 348–49, opened) names 8 battleships, 2 heavy
and 6 light cruisers and 29 destroyers among them.

### 7.2 Landmarks on the channel

| place | lat, lon | basis |
| --- | --- | --- |
| Hospital Point | 21.3487, −157.9682 | OSM node 7727247662 |
| Nevada Point (Waipiʻo Peninsula, where she lay after 10:45) | 21.3528, −157.9706 | OSM node 7727248094; 515 m from Hospital Point (computed) |
| USS Nevada memorial (Hospital Point) | 21.3505, −157.9664 | OSM |
| Ford Island centre | 21.3639, −157.9603 | en.wikipedia coordinate (*tertiary*) |
| Drydocks No. 2 and 3 (built 1942), No. 4 (1943) | 21.3512, −157.9600; 21.3515, −157.9608; 21.3468, −157.9652 | OSM, with start dates; **not there in this form in 1941** (No. 2 under construction: "the new drydock", Train) |

### 7.3 Airfields and radar (approximate)

| place | lat, lon (±1 km, to fix on AAF map 2 and a 1941 chart) | from Ford Island (computed) | 7 Dec role |
| --- | --- | --- | --- |
| Hickam Field | 21.335, −157.948 | 3.5 km, 158° | bombers (12 B-17D, 32 B-18, 12 A-20A, AAF App. B); first and second waves |
| Wheeler Field | 21.481, −158.038 | 15.3 km, 328° | the fighters (87 P-40B, 12 P-40C, 39 P-36A and others); first wave 07:55, strafed again about 09:00 |
| Haleʻiwa (auxiliary strip) | 21.594, −158.095 | 29.1 km, 331° | 47th Pursuit Squadron deployed for gunnery; not attacked; Welch and Taylor |
| ʻEwa Mooring Mast Field (MAG-21) | 21.330, −158.050 | 10.0 km, 248° | 47 aircraft present (USMC); strafed 07:55, 08:35, about 09:30 |
| NAS Kāneʻohe Bay | 21.450, −157.768 | 22.1 km, 064° | PBYs; strafed first (about 07:48, *verify*), bombed about 09:30 (PatWing 1), strafed 10:00 |
| Bellows Field | 21.364, −157.715 | 25.4 km, 090° | 44th Pursuit Squadron's P-40s; single pass about 08:30; nine fighters about 09:00 |
| Opana radar | 21.696, −157.993 | 37.0 km, 355° | SCR-270-B; the contact after 07:00 |
| Kahuku Point | 21.711, −157.982 | 38.7 km, 357° | the first wave's landfall |

---

## 8. Minute by minute (HST, UTC−10:30)

"Kimmel narr." is Enclosure (A) of Kimmel's report of 21 Dec 1941, "Narrative of
events occurring during Japanese air raid on December 7, 1941", compiled from the
ships' reports (PHA Pt 24 pp. 1570–1611; ibiblio.org/pha/pha/misc/deck_log.html,
opened; parsed by `r10-scripts/narr.py`). It carries the ship's name with each
entry; the time is the ship's. Source clocks other than HST are given in
brackets. Where tellings differ, each is given; §9 collects them.

### 8.1 Before the attack

| HST | event | source |
| --- | --- | --- |
| from 00:42 | five midget submarines (甲標的) launched from I-16, I-18, I-20, I-22, I-24 at about 30-minute intervals, 5.3–12.6 nm off the entrance [20:12 JST] | ja.wp citing Delgado et al. 2016 (*tertiary*) |
| 03:42–03:50 | minesweeper Condor sights a periscope "approximately one and three-fourths miles southwest of the Pearl Harbor entrance buoys" (CINCPAC 0350); Condor to Ward: "APPROXIMATE TIME 0350 AND HE WAS APPARENTLY HEADING FOR THE ENTRANCE" | CINCPAC; Bishop's Point log [14:56 GCT exchange] |
| 03:57 | Condor informs Ward by visual signal | CINCPAC |
| 04:00 (Opana 04:15) | the five SCR-270-B radars on the air | AAF ch. 4 |
| 06:13 | Koko Head and Fort Shafter pick up sightings south of the island | AAF ch. 4 |
| 06:15–06:18 | Enterprise, about 215 miles west, launches the morning search (18 SBDs) to fly on to Ford Island | Enterprise Air Group report (0615); Kimmel narr. (0618) |
| 06:30 | Antares, towing a barge, sights a small submarine 1,500 yds on her starboard quarter and calls Ward | Kimmel narr. |
| 06:33 | a patrol plane circles and drops two smoke pots near it | Kimmel narr. |
| 06:37 | Ward sights "a conning tower with periscope of submarine ... apparently headed for Pearl Harbor trailing the U.S.S. Antares" | Ward's report |
| 06:40 | Ward begins her attack, 5 to 25 kn | Ward |
| 06:45 | Ward opens fire: No. 1 gun misses at about 100 yds; No. 3 gun hits at the waterline of the conning tower at 50 yds or less; four depth charges set for 100 ft; patrol plane 14-P-1 adds a depth bomb | Ward; PatWing 1; Kimmel narr. (Antares, 0645) |
| 06:45 | sightings 135 miles north of Oʻahu heading south at Kaʻaʻawa, Opana and Kawailoa ("probably the scout planes") | AAF ch. 4; Army plot of contacts before 07:00 (PHA Pt 12 Exhibit 5 §IV, page image opened) |
| 06:51, 06:53 | Ward's radio messages: "WE HAVE DROPPED DEPTH CHARGES UPON SUBS OPERATING IN DEFENSIVE AREA"; "WE HAVE ATTACKED FIRED UPON AND DROPPED DEPTH CHARGES UPON SUBMARINE OPERATING IN DEFENSIVE SEA AREA" [17:21, 17:23 GCT] | Bishop's Point log (opened); Ward's report says 0645 |
| 07:00 | radars shut down by schedule; Opana stays on for training | AAF ch. 4 |
| ~07:02 | Opana's large contact: "A few minutes after seven" (AAF); 132 miles, 3° east of north *verify* | AAF ch. 4 |
| 07:12 | Commandant 14th Naval District receives Ward's report "at about 0712" | CINCPAC |
| 07:15 | the second wave launches [02:45 JST] | Exhibit 8 |
| ~07:20 | CINCPAC's staff duty officer told of Ward's attack | CINCPAC; Kimmel's report |
| 07:26 | Helm under way from X-7 for the deperming buoys in West Loch | Helm |
| 07:35 [03:05 JST] | the first wave sights Kahuku Point | ja.wp (*tertiary*) |
| 07:40 [03:10] | deploy order; the fighters split | USSBS App. 5; USMC |
| ~07:40 | CINCPAC phoned: a patrol plane sank a submarine off the entrance (report received 07:32) | CINCPAC |
| ~07:45 | Opana loses the track about 20 miles out; B-17 pilot Carmichael calls Hickam tower, garbled | AAF ch. 4 |
| ~07:45 | Sōryū's and Hiryū's fighters dive for Wheeler; Shōkaku's and Zuikaku's head for Kāneʻohe | USMC |
| 07:48 *verify* | Kāneʻohe strafed: the first attack anywhere. Kimmel narr. logs VP-11 and VP-12 under 0745; PatWing 1 gives no time | *verify* |
| 07:49 [03:19] | "to, to, to" | ja.wp (*tertiary*) |
| 07:50 | Oklahoma "(0750 or 0753) struck by 3 torpedoes" by her own reckoning; Tautog sees three dive bombers over Aiea | Kimmel narr. |
| 07:51 | Monaghan receives "PROCEED IMMEDIATELY AND CONTACT WARD IN DEFENSIVE SEA AREA" [1821 GCT] | Monaghan |
| 07:52 [03:22] | "tora, tora, tora" (07:53 in English tellings, *verify*) | ja.wp (*tertiary*) |
| 07:52–07:55 | Navy Yard signal tower to CINCPAC: "ENEMY AIR RAID - NOT DRILL" | Kimmel's report "about 0752"; CINCPAC "about 0755" |

### 8.2 First wave, 07:55–08:25

| HST | event | source |
| --- | --- | --- |
| 07:55 | dive bombers on Wheeler [03:25 JST]; "with the hoisting of the morning preparatory signal for eight o'clock colors" about 9 dive bombers from the north-east bomb the hangars at the south end of Ford Island and about 18 hit Hickam | Exhibit 8; CINCPAC |
| 07:55 | ʻEwa: Itaya's Zeros seen at 07:55, strafing | USMC |
| 07:55–07:56 | West Virginia: "two heavy shocks ... forward and on port side"; Bagley sees a torpedo plane drop on Oklahoma from 200–300 yds (logged 0758) | West Virginia's report; Kimmel narr. |
| ~07:56 | Raleigh hit by a torpedo amidships ("about 0755 ... a dull explosion") | Raleigh |
| 07:57 [03:27] | the torpedo attack begins (Japanese time) | Exhibit 8; ja.wp |
| 07:57 | Helena's signalman identifies the planes over Ford Island; general quarters; Oglala: a torpedo passes under her and explodes against Helena | Helena; Oglala |
| 07:57 | Breese opens fire with .50 cal; Conyngham sees torpedo planes on Raleigh, Utah and Detroit from the west | Kimmel narr. |
| ~07:58 | Helena hit at frame 74–75, starboard, "about one minute after general quarters" | Helena; BuShips summary |
| 07:58 | Commander PatWing 2: "AIR RAID, PEARL HARBOR. THIS IS NOT DRILL" | CINCPAC (0758); Kimmel narr. (Patron 21, 0757) |
| 08:00 [03:30] | fighters begin strafing; Raleigh opens fire with 3", 1.1" and .50; Helm sees torpedo planes from the Barbers Point direction cross West Loch channel | Exhibit 8; Kimmel narr.; Helm |
| 08:00 | CINCPAC's own air-raid message "a few minutes later" | CINCPAC |
| 08:01 | Utah hit at frame 84, port, then again; lists 15° | Utah |
| ~08:01 | Helena's guns in action | Helena |
| 08:02 | Nevada's machine guns open on torpedo planes on the port beam; one falls 100 yds off her port quarter; a torpedo hits her port bow (frame 40–42) | Nevada |
| 08:03 | Nevada's 5" AA opens in local control | Nevada |
| ~08:04 | KGMB breaks into its programme to recall service personnel | ja.wp (*tertiary*) |
| 08:04–08:06 | Vestal struck by two bombs (her report "about 0804"; Kimmel narr. 0806) | Vestal |
| 08:05 [03:35] | level bombing begins | Exhibit 8 |
| 08:05 | California torpedoed (her report: "at 0805 with three torpedoes, two at about frame 110 port, the other at about frame 47"; BuShips: two, at frames 52 and 101); her .50s and two 5" open "by 0805" | California; BuShips |
| 08:05–08:07 | Helm opens fire, machine guns 08:05, 5" 08:07; Vestal's 3" opens about 08:05 | Helm; Vestal |
| **~08:06** | **Arizona's forward magazine explodes** (Hiryū TROM "about 0806-07"; ja.wp 08:06; Pruitt 08:06 "listed sharply, smoke and flames"; Mugford 08:08 "ARIZONA blew up"; Jarvis 08:10; Vestal 08:20) | §9 |
| 08:08 | Mugford: "USS OKLAHOMA had capsized. W. VA. listed heavily to port" | Kimmel narr. |
| ~08:06–08:12 | Oklahoma rolls through about 135° "in about eight to ten minutes" after the first hit; masts on the bottom | Oklahoma; CINCPAC (8–11 min); NPS (under 12 min) |
| 08:10 | Helm's port after machine gun hits a plane approaching from the south; it crashes near Hickam (claim) | Helm |
| 08:10 | Utah at 80°, lines parting; 08:12 capsized | Utah; Kimmel narr. |
| 08:10–08:15 | Cassin sees five, then six, high-level bombers at 12,000 ft | Kimmel narr. |
| 08:12 | CINCPAC to the fleet: "HOSTILITIES WITH JAPAN COMMENCED WITH AIR RAID ON PEARL HARBOR" | CINCPAC |
| 08:13 | Helm passes the gate vessel | Helm |
| 08:14–08:15 | DesDiv 2's nest at X-14 opens fire on horizontal bombers (about 15 minutes after the alarm) | Monaghan |
| 08:17 | Helm sights a submarine's conning tower right of the channel, north of buoy No. 1; CINCPAC orders PatWing 2 "LOCATE ENEMY FORCE" | Helm; CINCPAC |
| 08:20 | Helm fires on the submarine "off Tripod Reef, bearing 290 distance 1200 yards from buoy #1", then loses bridge steering | Helm |
| 08:20 | Commander Battle Force signals Task Forces 1 and 2 to sortie | CINCPAC; Train |
| 08:20 | Enterprise's group commander passes Barbers Point, sees "a squadron of planes circling Ewa Field in column", and is attacked between ʻEwa and Ford Island | Enterprise Air Group |
| 08:20 | Nevada: "attack slackened" | Nevada |

### 8.3 Lull and the second wave, 08:25–10:00

| HST | event | source |
| --- | --- | --- |
| 08:25–08:40 | CINCPAC's Phase II, "Lull in attacks" (sporadic dive and level attacks) | CINCPAC |
| 08:26–08:27 | Monaghan gets under way for the north channel | Monaghan |
| 08:30 | Wheeler: four P-40s and two P-36s take off; Haleʻiwa: from 08:15 to 10:00, "two flights, each consisting of 4 P-40's and 1 P-36" | PHA Pt 12 Exhibit 5 §VI (page image opened) |
| ~08:30 | Welch and Taylor take off from Haleʻiwa (AAF "around 0830") | AAF ch. 4 |
| 08:30 | California hit by a bomb abreast casemate 1, frame 59 (her report 0830; Kimmel narr. 0900; Train "about 0845") | California |
| 08:30 | Nevada: "a heavy bombing attack"; both AA batteries in continuous fire until 09:08 | Nevada |
| ~08:30 | Bellows strafed by a lone fighter from the east | AAF ch. 6 |
| 08:34 | 97th CA (AA), Battery A at Fort Kamehameha, engages with small arms | PHA Ex. 5 §VII |
| ~08:35 | Shōkaku's Vals (Takahashi) strafe ʻEwa, "heavy and prolonged" | USMC |
| 08:35–08:44 | Monaghan sees a midget under fire from Curtiss and Tangier; 08:37 flank speed to ram; a torpedo passes close down her starboard side; 08:43 she rides over it; 08:44 two depth charges set for 30 ft explode astern; she strikes a derrick barge off Beckoning Point | Monaghan; CINCPAC (0843) |
| 08:40 | the second wave sights Oʻahu | USSBS |
| **08:40** | **Nevada clears F-8 unaided** ("within forty minutes", Nevada) | CINCPAC |
| 08:40–08:45 | Vestal cuts her lines and is towed clear of Arizona | CINCPAC (0840); Vestal (0845) |
| 08:42 | Neosho clears F-4 for Merry Point | CINCPAC |
| 08:45 | Hopping (VS-6) lands at Ford Island | VS-6 |
| 08:47 | Monaghan clear of the barge; Blue slips | CINCPAC |
| 08:50 | the second wave ordered to deploy, off the north-east coast | USSBS App. 5 |
| ~08:50 | Sanders's four P-36s airborne from Wheeler, east toward Bellows; they meet the second wave over Kāneʻohe (AAF "around 0850"; Exhibit 5 has P-36 departures from Wheeler at 08:30 and 09:15) | AAF ch. 4 |
| 08:54 [04:24] | 全軍突撃, the second wave's attack order (USSBS: "ordered to attack at 0855") | ja.wp (*tertiary*); USSBS |
| 08:55 | Wheeler: two more P-40s; Ramsay clears D-3 | Exhibit 5; CINCPAC |
| ~08:55–09:05 | Welch and Taylor take off again from Wheeler into another attack; Welch shoots down the aircraft on Taylor's tail (no time in the AAF) | AAF ch. 4 |
| ~09:00 | the second wave attacks: Hickam, Kāneʻohe, Ford Island by level bombers; the Navy Yard, Nevada and the drydocks by dive bombers; nine fighters at Bellows for about 15 minutes, Whiteman and Bishop shot down taking off | USSBS; AAF ch. 4, 6 |
| ~09:00 | Oglala, warped astern of Helena at 1010 Dock, capsizes | Kimmel narr. (0900); Oglala (secured about 0900, abandoned about 0930) |
| 09:05 | a Val hit by Curtiss crashes into her No. 1 crane | Kimmel narr. |
| 09:06–09:07 | Pennsylvania hit on the boat deck; Downes hit; a bomb on the dock cuts the Yard's power | Pennsylvania |
| 09:08 | Nevada: "attack slackened" | Nevada |
| **~09:10** | **Nevada, "while attempting to negotiate the turn in the channel, ... temporarily grounded"** near YFD-2; Mugford logs 09:13 "NEVADA stopped south side of south channel" | CINCPAC; Kimmel narr. |
| 09:10 | Vestal anchors near buoy C-5 | Vestal; CINCPAC |
| 09:12 | Curtiss hit by a bomb that bursts in her hangar | Kimmel narr. |
| 09:15 | "Large explosion on DOWNES" (Kimmel narr.); Cassin: "About 0915 there was a terrific explosion on the Downes"; Helm near-missed off both bows; Wheeler: six P-36s take off | Kimmel narr.; Cassin; Helm; Exhibit 5 |
| 09:20 | Pennsylvania's drydock flooding begins; Downes abandoned | Pennsylvania; Downes |
| ~09:30 | Shaw's forward magazine explodes, "twenty minutes later" than the bombs' fire (Shaw's war damage report; BuShips summary); Mugford logs "SHAW in floating dry-dock exploded" at 10:05 | §9 |
| ~09:30 | about 15 Vals from Kaga and Hiryū strafe ʻEwa; Enterprise's Ens. Vogt's SBD collides with a Val; Kāneʻohe bombed by nine level bombers | USMC; PatWing 1 |
| 09:30 | Wheeler: five P-40s and six P-36s take off | Exhibit 5 |
| 09:40 | Kimmel narr.: "NEVADA grounded off Hospital Point" | Kimmel narr. |
| 09:41 | Downes's warheads explode, "covering area with debris" | Pennsylvania |
| 09:45 | "All enemy planes had retired by 0945" | CINCPAC |
| 09:50 | Vestal grounds herself off Aiea, east of buoy C-4 | Vestal; CINCPAC |
| 10:00 | a last strafing at Kāneʻohe; "All enemy planes withdrew about 1000" | PatWing 1; Kimmel's report |
| 10:35–10:45 | Nevada gets clear of the channel and grounds on Waipiʻo Peninsula opposite Hospital Point | CINCPAC |

### 8.4 After the attack

| HST | event | source |
| --- | --- | --- |
| 09:15–10:30 [04:45–06:00+ JST] | first wave recovered | ja.wp citing Kusaka (*tertiary*) |
| ~11:30 [07:00 JST] | second wave recovered; last aircraft 12:44 [08:14 JST] | same |
| ~13:30 [09:00 JST] | the Kidō Butai turns north-north-west for home | same |
| afternoon | the Army's later fighter and bomber sorties (Hickam: four A-20s at 11:27, two B-17s at 11:40, …) find nothing | Exhibit 5 §VI |
| evening (time *verify*) | six F4Fs of VF-6 from Enterprise try to land at Ford Island; four are shot down by friendly fire, two land | Enterprise Air Group |
| 21:01 [16:31 JST] | the I-boats outside see "a great explosion within the harbor" | Exhibit 8 |
| 22:41 or 00:41 | a midget submarine's radio report of success (§2.3) | Exhibit 8; USSBS |
| 8 Dec | Sakamaki Kazuo's midget (I-24) grounded on the windward coast near Bellows; he is taken prisoner (CINCPAC says "a reef off the north shore", *verify* the place) | CINCPAC; ja.wp |

---

## 9. Where the tellings diverge

| question | tellings | recommendation |
| --- | --- | --- |
| launch distance | 230 nm N of Lānaʻi's western tip (Exhibit 8, JM-97); 200 miles N of Oʻahu (USSBS); 220 miles (AAF); 200 nm N of the anchorage (JM-97 Op. Order 1, superseded); "230 miles north of Oʻahu" (popular) | store Exhibit 8's wording and the computed 24.63°N 157.06°W, precision `schematic` |
| first launch time | 06:00 HST (Exhibit 8, USSBS, Shōkaku/Zuikaku TROMs); 06:18 (Akagi/Kaga/Sōryū TROMs) | 06:00 begins, 06:18 for the last off; off-box anyway |
| tora tora tora | 07:52 sent, 07:53 acknowledged (ja.wp); 07:53 (English tellings) | 07:52 with the note |
| first bombs | Kāneʻohe about 07:48 (*verify*); Wheeler and Ford Island 07:55 (CINCPAC, Exhibit 8) | Kāneʻohe 07:48 as *verify* |
| first torpedo hit | Oklahoma "0750 or 0753" (her report); West Virginia 07:55–07:56 (her report); Japanese start 07:57 (Exhibit 8) | 07:57 for the Japanese release, ship hits 07:57–08:00 |
| Arizona's explosion | ~08:06 (Hiryū TROM; ja.wp); 08:08 (Mugford); 08:10 (Jarvis); 08:20 (Vestal) | **08:06**, with the others on the card |
| what destroyed Arizona | an 800 kg level bomb (Hiryū TROM: Kusumi's group from 3,200 m; ja.wp: Kaga's level bombers, a first hit on No. 4 turret and the fatal one by No. 2); "three bombs from dive bombers" (ComBatShips); a dive bomber (CINCPAC: "Five planes from the East-Southeast ... The most damaging effect of the dive bombing attack was felt by the Arizona"); torpedo(es) "1 to 3" (ComBatShips), one (BuShips), and Vestal's CO saw two pass under him | the level bomber; which carrier's group is *verify* (Prange, Zimm); the player is never in it (§12) |
| hits on West Virginia | 4 torpedoes, 1 + 1 bombs (ComBatShips); 4–5 torpedoes, ≥2 bombs (CINCPAC); **7 torpedoes, 2 dud bombs** (BuShips summary); 6 torpedoes, 2 bombs (NPS); 9 torpedoes (en.wp) | BuShips |
| hits on Oklahoma | 3–5 torpedoes (ComBatShips); "five airplane torpedoes" (her CO); 5 + 3 near misses (BuShips); 8 (NPS); 9 (en.wp) | BuShips |
| hits on Arizona | 3 bombs (ComBatShips); "about eight heavy bomb hits" (CINCPAC); **8 bombs, 1 torpedo** (BuShips); "two armor-piercing bombs" (en.wp) | BuShips |
| hits on Nevada | 1 torpedo, 5 bombs (2 heavy) (ComBatShips); ≥6 bombs, possibly 10 (her report); 1 torpedo, 5 bombs (BuShips); 6 × 250 kg and 2 near misses (ja.wp) | BuShips |
| Nevada's grounding | ~09:10 temporarily grounded at the turn near YFD-2; 10:45 grounded on Waipiʻo (CINCPAC); 09:13 stopped (Mugford); 09:40 grounded off Hospital Point (Kimmel narr.); grounded "near the new drydock", got clear with Yard tugs, grounded again across and south of Ford Island (Train); grounded off Waipiʻo Point with Hoga and Avocet (en.wp citing Wallin 1968, *tertiary*) | 09:10 beached at the turn off Hospital Point; 10:35–10:45 moved to Waipiʻo |
| California's bomb | 08:30 (her report); 08:45 (Train); 09:00 (Kimmel narr.) | 08:30 |
| Shaw's magazine | "20 minutes later" than the bomb fire (her WDR; BuShips); 10:05 (Mugford) | about 09:30, *verify* on a photograph's time |
| Monaghan's ram | 08:43 (CINCPAC; her report 08:37–08:44); "about 0930" (the signal tower, Kimmel narr. 12:05 entry) | 08:43 |
| level-bomber phase | 08:05 (Exhibit 8, USSBS); 08:25–09:00 (ComBatShips); Phase III 08:40–09:15 (CINCPAC) | 08:05–08:25 for the first wave's level bombers; the second wave's level bombers hit airfields |
| Battleship Row berths | ComBatShips and CINCPAC: Oklahoma F-5 outboard of Maryland; Pennsylvania's entry in Kimmel narr.: "MARYLAND in F-4 inboard. OKLAHOMA outboard" | ComBatShips (from its berthing plan) |
| Welch and Taylor's first fight | "around 0830 ... where the Japanese from the first wave were still strafing the Marine base at Ewa", two each (AAF) | keep 08:30. The only first-wave Val lost was Shōkaku's (her TROM), and Shōkaku's Vals were strafing ʻEwa at about 08:35 (USMC): consistent with a fight there, not with four losses. The card gives the claims and the Japanese losses side by side |
| Army fighters' victories | 10 confirmed, 4 probables, 2 damaged; 11 with Dains (AAF); "seven ... with two more probables at the cost of one P-36" for the first six fighters up (AAF) | claims, never losses; the Japanese lost 29 to all causes |
| Navy AA claims | 28 (CINCPAC); 15–17 by the battleships (ComBatShips); Nevada "at least five"; Maryland 4 confirmed of 7 | claims |
| second wave numbers | 167 (TROMs; AAF text); 170 (ja.wp); 171 planned (USSBS); AAF map 7: 79 dive bombers, 36 fighters | 167 |
| second-wave level loads | one 250 kg and six 60 kg each (USSBS); 18 with two 250 kg and 36 with one 250 kg and six 60 kg (AAF, citing Senshi Sōsho) | the AAF split, *verify* in Senshi Sōsho 10 |
| US dead | 2,390 incl. 49 civilians (NPS People page, 2026); 2,403 incl. 68 civilians (en.wp citing Conn et al., *tertiary*); battleships alone 214 killed and 1,755 missing on 19 Dec (ComBatShips table) | NPS current figure, the other as a telling |
| California's dead | 105 (NPS); 104 (en.wp) | NPS |
| Japanese dead | 55 airmen + 9 submariners = 64 (en.wp, ja.wp); 129 (en.wp infobox, citing a fact sheet; *tertiary*); "a minimum of 68 killed, due solely to Navy action" (CINCPAC estimate, Feb 1942) | 64 with the note |

---

## 10. Outcomes and people, by source

### 10.1 The American dead and wounded

| scope | figure | source |
| --- | --- | --- |
| all Americans killed, 7 Dec 1941 | **2,390**: 2,341 service members, 49 civilians ("some due to enemy actions and others from friendly fire") | NPS, Pearl Harbor National Memorial, "People" page (opened 2026-10-22) |
| the same, older telling | **2,403**: 2,008 Navy, 109 Marines, 218 Army, 68 civilians | en.wikipedia, citing Conn, Engelman and Fairchild, *Guarding the United States and Its Outposts* (2000), p. 194 for the civilians (*tertiary*; the CMH book *verify*) |
| wounded | 1,178 (Navy 710, Army 364, Marines 69, civilians 35) | en.wikipedia (*tertiary*) |
| Hickam Field | 191 killed, including 5 civilians | NPS |
| Arizona | **1,177** sailors and Marines (38 sets of brothers aboard; 63 of the 79 brothers died) | NPS |
| Oklahoma | **429**; 32 rescued through the hull; 35 identified at the time, over 300 identified since 2015 | NPS; ComBatShips (32 rescued) |
| West Virginia | 106 | NPS |
| California | 105 (NPS); 104 (en.wp) | NPS |
| Utah | 58 | NPS |
| Pennsylvania | 31 (NPS); "15 dead, 14 missing" (en.wp) | NPS |
| Nevada | 60 killed, 109 wounded (en.wp citing DANFS, *tertiary*); 37 killed, 109 injured, 16 missing on 19 Dec (ComBatShips) | DANFS *verify* (NHHC unreachable) |
| Maryland | 4 (NPS: "tragically lost four crewmembers"; her own report: 1 officer, 2 men, and the floatplane pilot killed later on patrol) | NPS |
| Tennessee | 5 (en.wp, *tertiary*); 4 killed on 19 Dec (ComBatShips) | *verify* |
| Vestal | 6 identified dead, 3 unidentified, 7 missing, 19 hospitalised (her report) | Vestal |
| preliminary battleship table, 19 Dec 1941 | killed 14 officers and 200 men; injured 16 and 347; missing 70 and 1,685 (Arizona: 2 + 54 killed, 47 + 1,059 missing; Oklahoma: 20 killed, 21 + 415 missing) | ComBatShips |

The card wording should follow the NPS ("lost their lives", "service members and
civilians"), give the scope of each figure (the day, the ship, the field), and
put the older figure beside it. R8 owns the wording.

### 10.2 Ships

| ship | hits (BuShips summary, 1942) | fate on the day | later (source) |
| --- | --- | --- | --- |
| Arizona (BB-39) | 8 bombs, 1 torpedo; forward magazines exploded | settled bodily; total loss | stricken; memorial (NPS) |
| Oklahoma (BB-37) | ~5 torpedoes, 3 near misses | capsized | righted and raised; sank under tow in May 1947 (en.wp, *tertiary*) |
| West Virginia (BB-48) | 7 torpedoes, 2 dud bombs | settled bodily | salvaged; returned to service July 1944 (en.wp, *tertiary*); at Tokyo Bay (NPS) |
| California (BB-44) | 2 torpedoes, 1 bomb, a near miss (WDR No. 21) | sank over three days on the mud (CINCPAC) | salvaged; returned January 1944 (en.wp, *tertiary*) |
| Nevada (BB-36) | 1 torpedo, 5 bombs (WDR No. 17) | beached | salvaged; returned to service in late 1942 (en.wp, *tertiary*); Normandy 1944 (NPS) |
| Pennsylvania (BB-38) | 1 bomb (WDR No. 14) | in drydock | "Repairs have been completed and ship is ready for service" by 24 Dec (Battle Force) |
| Maryland (BB-46) | 2 bombs | damaged | first repaired, June 1942 (NPS) or February 1942 (en.wp) |
| Tennessee (BB-43) | 2 bombs, converted 16" AP (WDR No. 22); fire from Arizona's oil | damaged | returned February 1942 (en.wp, *tertiary*) |
| Utah (AG-16) | 2 torpedoes (CINCPAC; "about 5" by her own estimate) | capsized | left in place; memorial |
| Helena (CL-50) | 1 torpedo (WDR No. 4) | damaged | Mare Island for permanent repairs (CINCPAC) |
| Honolulu (CL-48) | near miss (WDR No. 1) | damaged | repaired at Pearl Harbor (CINCPAC) |
| Raleigh (CL-7) | 1 torpedo, 1 bomb through the ship (WDR No. 9) | kept afloat with pontoons | repaired (CINCPAC) |
| Shaw (DD-373) | 3 bombs; forward magazine exploded (WDR No. 7) | bow severed; the floating dock sank | repaired with a false bow (CINCPAC) |
| Cassin (DD-372), Downes (DD-375) | 3 and 1 bombs, fire, Downes's warheads (WDR No. 13) | wrecked in Drydock No. 1 | machinery salvaged, new hulls (BuShips) |
| Oglala (CM-4) | torpedo passed under her; near miss | capsized at 1010 Dock | raised, converted and recommissioned February 1944 (ja.wp, *tertiary*) |
| Curtiss (AV-4) | crashing aircraft, 1 bomb | damaged | repaired (CINCPAC) |
| Vestal (AR-4) | 2 bombs | beached off Aiea | repaired (CINCPAC) |
| Helm (DD-388) | near miss (WDR No. 6) | at sea | |

### 10.3 Aircraft

| side | figure | source |
| --- | --- | --- |
| US Army (Hawaiian Air Force) | 234 on hand, 146 in commission; **76 destroyed**; 83 in commission after (Hickam 12 B-17D, 32 B-18, 12 A-20A; Wheeler 12 P-40C, 87 P-40B, 39 P-36A and others) | AAF App. B (from the 7th AF history and Eckhert's Hickam records; notes B-17 losses 4 or 5) |
| US Army, the 1945 exhibit | destroyed at Hickam 18 (4 B-17, 12 B-18, 2 A-20), Wheeler 42 (30 P-40, 4 P-36, 6 P-26, 2 OA-9), Bellows 3 (2 P-40, 1 O-49): **63** (summed) | PHA Pt 12 Exhibit 5 §V (page image opened) |
| US Navy and Marines on Oʻahu | 301 present, 202 ready; 221 "on hand after raid" (including those repaired since), 52 usable that day, 38 flew: so **80 not on hand** (computed) | CINCPAC memorandum of 27 Dec 1941 |
| ʻEwa | 47 aircraft on the field, 33 operational; the Japanese claimed 60 (Akagi 11, Kaga 15, Sōryū 12, Hiryū 22) | USMC monograph |
| Kāneʻohe | 33 patrol planes, an OS2U and a J2F out of commission; 3 PBYs on dawn patrol survived | PatWing 1 |
| Enterprise's morning SBDs | 18 arrived, 4 shot down (CINCPAC memorandum); VS-6: 3 shot down (2 by fighters, 1 by own AA), 3 missing | CINCPAC; VS-6 |
| Enterprise's VF-6, evening | 4 of 6 F4Fs shot down by friendly fire | Enterprise Air Group |
| B-17s arriving from California | 12 (4 B-17C, 8 B-17E), unarmed; Swenson's burned in two at Hickam, Richards's written off at Bellows, Bostrom's down on Kahuku golf course | AAF ch. 4, App. D |
| all US, the usual telling | **188 destroyed, 159 damaged** | en.wikipedia (*tertiary*); Prange *verify* |
| Japanese claims | about 10 shot down, about 200 burned on the ground, total about 260 (Exhibit 8 answer 41); "over 350" (the hasty first answer) | Exhibit 8 |
| Japanese | **29 lost** (§4.4); 74 damaged in the second wave (ja.wp, *tertiary*) | Exhibit 8; USSBS; TROMs |

### 10.4 The Japanese dead and the submarines

| item | telling | source |
| --- | --- | --- |
| airmen killed | 55 (en.wp, *tertiary*); crew arithmetic for the 29 lost aircraft: 9 × 1 + 15 × 2 + 5 × 3 = 54 (computed) | |
| submariners killed | 9 of the 10 midget crewmen; Sakamaki captured (often called the first prisoner of war held by the United States, *verify*) | en.wp, ja.wp (*tertiary*); CINCPAC (one ensign taken prisoner) |
| total | 64 killed, 1 captured (en.wp text, ja.wp infobox); 129 (en.wp infobox, *tertiary*, unexplained); CINCPAC's estimate "a minimum of 68 killed" by Navy action | |
| midget submarines | 5 sent, none recovered (Exhibit 8); "two were destroyed by Navy action and one grounded off Bellows Field and was recovered" (CINCPAC); one found by HURL in 2002 off the entrance with a shell hole in the conning tower, identified with Ward's (ja.wp, *tertiary*) | |
| fleet submarines | one I-boat lost off Oʻahu, "time and place ... unknown" (Exhibit 8; USSBS); I-70 on 10 Dec *verify* | |
| propaganda | the nine dead submariners proclaimed the "nine war gods" (九軍神); Arizona's sinking credited to them by Imperial GHQ (ja.wp, *tertiary*) | card only |

---

## 11. Terrain and data for the box

### 11.1 Bounds

| option | bounds [W, S, E, N] | size (computed) | holds |
| --- | --- | --- | --- |
| the Hawaiian Oʻahu pack | −158.3001, 21.2364, −157.6294, 21.7311 | 69 × 55 km | the island with about 2 km of sea; **not** the deployment north of Kahuku, the rendezvous off Kaʻena (21.89°N 158.40°W) or the approaches |
| **island box (recommended)** | −158.55, 21.15, −157.55, 22.05 | **103 × 100 km** | Kahuku deployment (07:40), the rendezvous with 10 km to spare, the B-17s from the east, Enterprise's SBDs from the west, the second wave's deployment off the north-east coast, Ward off the entrance |
| harbour inset | −158.06, 21.31, −157.92, 21.41 | 14 × 11 km | the lochs, Ford Island, the Navy Yard, Hickam, the entrance channel to the bar |
| launch-to-target | −158.6, 21.15, −156.8, 24.95 | 184 × 423 km | the carriers too; mostly empty sea (§3.4) |

### 11.2 Does the 68 m Oʻahu pack resolve the harbour?

The Hawaiian app's Oʻahu pack (read from its committed manifest): 1024 × 801
texels at 68.2854 m, land from USGS 3DEP 1 arc-second tiles n22w158 and n22w159
by the half-land rule, sea from GMRT 4.5 at a 61 m grid, never shallower than
−1 m. Measured on the pack (`r10-scripts/transects.py`):

| transect | water width on the pack | deepest texel |
| --- | --- | --- |
| across the South Channel at F-6 (Battleship Row) | 773 m (about 11 texels) | −15.0 m |
| across the channel at Hospital Point | 443 m (6–7 texels) | −15.5 m |
| across Southeast Loch | 240 m (3–4 texels) | −9.5 m |
| across the entrance at Fort Kamehameha | 544 m | −18.5 m |
| Ford Island to Pearl City (Utah, Raleigh side) | 472 m | −13.0 m |
| Middle Loch at 21.380°N | about 1 km | — |
| Ford Island west to east | island about 2.1 km across between channels of 829 m (west) and 1,161 m (East Loch) | |

A render of the crop is `downloads/R10/pearl-crop-70m.png` (Ford Island's 1930s
fill in yellow, present in 1941; Kuahua's 1943 extension in red, absent in 1941).

**Verdict.** At 68 m the lochs, Ford Island, the peninsulas and the channel read
correctly at table and box distance, and aircraft moments are fine on it. Ship
moments are not: a battleship (about 180 m by 30 m) is about 3 × 0.5 texels; the
pairs at the quays lie 30 m apart; the 1010 Dock, the drydocks and the bank where
Nevada grounded are sub-texel; Southeast Loch, the torpedo planes' lane, is 3–4
texels; and GMRT's depths inside the harbour are smoothed (Oklahoma's report gives
48–54 ft, 14.6–16.5 m, at F-5; the pack shows −15 m off F-6, plausible but not
surveyed).

### 11.3 A harbour inset

- **Source: NOAA NCEI CUDEM 1/9 arc-second topobathy, Hawaii (2021v1)**, on the
  `noaa-nos-coastal-lidar-pds` S3 bucket (listing and STAC opened): tile
  `ncei19_n21x50_w158x00_2021v1.tif` (bbox −158.0002 to −157.7498, 21.2498 to
  21.5002; 158.9 MB) holds Ford Island, East Loch, the Navy Yard, Hickam and the
  entrance; `ncei19_n21x50_w158x25_2021v1.tif` (143.5 MB) holds West Loch and
  Waipiʻo west of 158.00°W. The Hawaiian patch bake already reads the first tile.
  The district bake's 2022–23 lidar (bare earth at 0.5 m) is the alternative for
  land.
- **Grid**: 10 m over the inset bounds gives about 1,450 × 1,110 texels, inside
  the 2048 limit (the Nuʻuanu district is 6.05 m over a smaller area).
- **GLO-30 is not a good fit here**: 30 m only doubles the pack's resolution, and as
  a surface model it keeps piers, cranes and structures as terrain in exactly the
  place where the ships lie (*verify* on a sample). DATA.md §7 makes GLO-30 the
  only land source for a box and the Hawaiian pack for Oʻahu; an inset from CUDEM
  is an exception to decide (§15, D2).

### 11.4 What 1941 differed in from today

| feature | 1941 | today | Hawaiian patch (applies when year < `until`) |
| --- | --- | --- | --- |
| Ford Island | already grown from about 334 to about 441 acres with 1930s fill; 7 acres of T-wharves added 1940–43 not separated | the same outline | `oahu-ford-island`, lower, until 1940: **not applied for 1941** (correct) |
| Kuahua | a 47-acre island-peninsula | a 116-acre peninsula, contract to Dec 1943 | `oahu-kuahua`, lower, until 1943: **applied** (correct) |
| Drydocks No. 2, 3 (1942) and 4 (1943) | No. 2 under construction ("the new drydock", Train); the floating dock YFD-2 in use | three graving docks | none; the patches leave the Navy Yard's piers as today's. **A 1941 patch is needed in the inset** |
| Ford Island's south-east piers | the interrupted quays F-3 to F-8 | F-5 rebuilt 1944 and 1992 (Missouri), "F3.5" 1943, S382 1943 (OSM dates) | none; minor at 68 m, visible at 10 m |
| the Ford Island bridge | none (ferry) | the Admiral Clarey pontoon bridge (ferry service ended 1999, OSM note) | none; check whether the DEM shows it |
| the lochs | wartime mooring dredging partly later | today's depths | not patched ("Not done", Hawaiian DATA.md) |
| the entrance channel | cut 1902–1911, later widened | today's channel | `oahu-pearl-channel` until 1911: not applied for 1941; the later widenings are not separated (*verify*) |
| Pearl City and Waipiʻo peninsulas | natural; Pan American's clipper base at Pearl City's tip ("Pan-Air dock", Kimmel narr.) | natural, built over | — |
| Honolulu airport and Keʻehi | John Rodgers airport; Keʻehi lagoon's reef flat | seaplane runways and fill (1943–44), the Reef Runway (1977) | `oahu-keehi-seaplane`, `oahu-keehi-airport-fill`, `oahu-reef-runway(-cuts)`: **applied** |
| Sand Island | the 1938 island | western two-thirds filled 1943–44 | `oahu-sand-island-later`: **applied** |
| Kāneʻohe Bay | seaplane runways being dredged (1939–42) | dredged | not patched (Hawaiian DATA.md) |
| Barbers Point | no naval air station (commissioned 1942, *verify*); no deep-draft harbour | both | harbour not patched |

### 11.5 Weather and light

CINCPAC, as officially logged: "0400-0800: Average partly cloudy with cumulus
clouds mostly over the mountains. Cloud base 3500 feet. Visibility good. Wind N.
10 knots. Cloud amounts: 4/10 to 5/10, increasing slightly after 0800 with lower
clouds moving out over the harbor at times." Oklahoma at 08:00: "Smooth water.
Weather clear. Intermittent moving fleecy clouds, ceiling ranging from unlimited
to 2,000 ft." Over the sea north of the island the Japanese flew "above a dense
cloud layer ... about 2,000 meters" and found Kahuku through a break (USSBS;
ja.wp). At the carriers the sea was rough enough to delay the second launch
(AAF). Smoke from Arizona, Hickam and Wheeler covered Battleship Row from about
08:10 ("Battleship Row was not visible from Hickam Field because of the thick
black smoke", en.wp, *tertiary*; "This thick smoke came down over the battleships
berthed at the quays and interfered seriously with anti-aircraft fire", Train).

```jsonc
"weather": { "wind": { "fromDeg": 0, "kn": 10 }, "sea": 1, "swellM": 1,
  "cloud": { "baseM": 1070, "cover": 0.45, "note": "cumulus mostly over the mountains; more after 08:00, lower cloud over the harbour at times (CINCPAC)" },
  "layers": [ { "region": "north of 21.8°N", "topM": 2000, "cover": 0.8, "note": "dense layer the first wave flew over (USSBS)" } ],
  "visibilityM": 30000 }
```

Sun (computed, HST): 06:00 at the first launch point −7° (twilight); sunrise at
the harbour 06:26–06:27; 07:40 off Kahuku 14° at 122°; 07:55–07:57 over Battleship
Row 17° at 123–124°; 08:06 19° at 125°; 08:30 over ʻEwa 24° at 128°; 08:50 over
Kāneʻohe 27° at 132°; 09:10 at Hospital Point 31° at 135°; 09:45 36° at 143°. The
first wave's torpedo planes came in with the low sun behind them.

---

## 12. Candidate moments (DATA.md §9 fields)

General rules applied (the owner's decisions; DESIGN.md §3.5, §5.7, §7.4):
both sides playable; the player can turn the tide inside the box; watching is
always an alternative (every moment below is also a tour stop); the score is in
sortie terms. **Objectives name only ships, aircraft, hangars, docks and guns**;
barracks, tents and people are never targets, and the sim does not score them.
Start positions are relative to units; the airfield and hangar targets need a
static "site" unit the contract does not have yet (§15, D11). Unit ids below are
proposals. Speeds and heights marked *design* are not in the record.

### M1. A Kaga B5N2 of the torpedo unit, on the outboard battleships (Japan) — recommended

```jsonc
{ "id": "kaga-b5n-torpedo", "title": "Kaga's torpedo unit comes in low over the Southeast Loch",
  "ja": { "kanji": "加賀雷撃隊", "romaji": "Kaga raigekitai" },
  "role": { "kind": "aircraft", "kit": "b5n2", "side": "japan", "group": "kaga-torpedo", "name": "a Type 97 carrier attack plane of Kaga's 2nd Special Attack Unit (Lt Kitajima Ichirō)" },
  "t": "07:56:30", "durationS": 180, "timeScale": 1,
  "start": { "from": "oklahoma", "bearingDeg": 130, "rangeM": 3000, "altM": 60, "speedMs": 80, "headingDeg": 310 },
  "objective": { "kind": "torpedo", "target": ["oklahoma", "west-virginia"], "text": "Put your torpedo into an outboard battleship." },
  "beats": [ { "t": "07:55:00", "text": "Smoke rises from Ford Island's hangars and from Hickam." },
             { "t": "07:57:00", "text": "The first torpedoes are in the water." },
             { "t": "07:58:00", "text": "Machine guns open from the battleships and the Navy Yard." },
             { "t": "08:01:00", "text": "Utah is hit across Ford Island." } ],
  "record": { "hits": [ { "unit": "oklahoma", "count": [3, 5], "window": ["07:56", "08:05"] },
                        { "unit": "west-virginia", "count": [4, 7], "window": ["07:56", "08:10"] } ],
              "losses": { "group": "kaga-torpedo", "count": [5, 5], "of": 12 } },
  "after": { "sources": ["bushships-summary-1942", "combatships-1941", "oklahoma-ar-1941", "nps-people", "kaga-trom"] } }
```

- **The enemy's action**: no fighters; ships' machine guns "at once" (ComBatShips),
  Nevada's at 08:02, the Navy Yard's 3-inch guns within minutes (Sumner's claim);
  claims of torpedo planes downed by Bagley, Sumner, Tautog, Avocet, Vestal (Kimmel
  narr.). The record gives the sim an AA that thickens from 07:58.
- **The run**: down to 15–25 m over the Southeast Loch, release 200–400 yards from
  the outboard ship (§5.2); the torpedo needs a straight, level release at the
  first method's 160 kn and 20 m.
- **Success in sortie terms**: a torpedo hit on Oklahoma or West Virginia (the
  sim's), and coming back. A miss into the mud or a torpedo that dives is the
  sim's honest failure; being shot down is possible (five of twelve were).
- **After-card (tone: grave, factual)**: the record's hits on both ships from the
  three tellings (§9) with BuShips first; Oklahoma rolled over in about eight to
  ten minutes and 429 of her crew died, 32 were cut out of the hull (NPS;
  ComBatShips); West Virginia settled upright with 106 dead (NPS); Kaga's torpedo
  unit lost five aircraft and their crews. No figures in the water; Oklahoma
  turns over as a silhouette and stops on her masts.

### M2. A B5N2 of Akagi's level-bombing unit over Battleship Row (Japan)

```jsonc
{ "id": "akagi-b5n-level", "title": "Fuchida's bombers on their run at 3,000 metres",
  "role": { "kind": "aircraft", "kit": "b5n2", "side": "japan", "group": "akagi-level", "name": "a Type 97 carrier attack plane of Akagi's 1st Attack Unit, in a five-plane section" },
  "t": "08:04:00", "durationS": 240, "timeScale": 1,
  "start": { "from": "maryland", "bearingDeg": 210, "rangeM": 9000, "altM": 3000, "speedMs": 65, "headingDeg": 30 },
  "objective": { "kind": "level", "target": ["maryland", "tennessee", "california"], "text": "Drop with your section leader on an inboard battleship." },
  "beats": [ { "t": "08:05:00", "text": "Level bombing begins." },
             { "t": "08:06:00", "text": "Arizona's forward magazine explodes." },
             { "t": "08:10:00", "text": "Oklahoma has capsized; smoke covers the row." } ],
  "record": { "hits": [ { "unit": "maryland", "count": [2, 2], "window": ["08:05", "09:10"] },
                        { "unit": "tennessee", "count": [2, 2], "window": ["08:05", "09:10"] } ] },
  "after": { "sources": ["bushships-summary-1942", "ussbs-campaigns-ch2", "hiryu-trom", "nps-battleship-row"] } }
```

- **Enemy**: AA bursts low at first (2,000–4,000 ft short, Gilpin), heavier by
  08:10; no fighters; cloud 4/10–5/10 below; smoke over the row from about 08:06.
- **Success**: a hit by the player's own bomb (the section drops on its leader;
  the player can hold or drop). Akagi's level unit claimed four or more hits on
  battleships (ja.wp listing the Japanese report, *tertiary*); BuShips credits two
  bombs each on Maryland and Tennessee (dates not separated).
- **After-card**: **Arizona's explosion is the record's beat, never the
  player's**: the player is in Akagi's group, and the card attributes the fatal
  bomb as the tellings do (Hiryū's group from 3,200 m per Hiryū's TROM; Kaga's per
  ja.wp), with Arizona's 1,177 dead (NPS). Tennessee and Maryland's dead (5 and 4,
  §10.1). Tone: plain; the Arizona line is set apart from the score.

### M3. A D3A1 of Shōkaku's dive-bombing unit on Ford Island's hangars (Japan)

```jsonc
{ "id": "shokaku-d3a-ford", "title": "Takahashi's dive bombers open the attack on Ford Island",
  "role": { "kind": "aircraft", "kit": "d3a1", "side": "japan", "group": "shokaku-dive", "name": "a Type 99 carrier bomber of Shōkaku's 15th Attack Unit" },
  "t": "07:54:00", "durationS": 150, "timeScale": 1,
  "start": { "from": "ford-island-hangars", "bearingDeg": 45, "rangeM": 5000, "altM": 1500, "speedMs": 75, "headingDeg": 225 },
  "objective": { "kind": "dive", "target": "ford-island-hangars", "text": "Put your 250-kilogram bomb on the seaplane hangars and the aircraft on the ramp." },
  "beats": [ { "t": "07:55:00", "text": "The first bombs fall on the south end of Ford Island." },
             { "t": "07:57:00", "text": "Torpedo planes cross the harbour below you." },
             { "t": "07:58:00", "text": "Ford Island broadcasts: air raid, this is not drill." } ],
  "record": { "losses": { "group": "shokaku-dive", "count": [1, 1], "of": 26 } } }
```

- **Enemy**: none for the first two minutes (surprise), then machine guns.
- **Success**: hangar hit; aircraft destroyed on the ramp; came back.
- **After-card**: aircraft losses at the Naval Air Station from the CINCPAC
  memorandum; the dive bombers went on to strafe ʻEwa at about 08:35 (USMC); Shōkaku
  lost one aircraft. Not Hickam: Hickam's bombs fell on the barracks as well as the
  hangar line (AAF), so it stays a card and a watched stop.

### M4. Nevada's helm and AA down the South Channel (USA) — recommended

```jsonc
{ "id": "nevada-sortie", "title": "Nevada gets under way",
  "role": { "kind": "ship", "unit": "nevada", "side": "usa" },
  "t": "08:40:00", "durationS": 900, "timeScale": 2,
  "objective": { "kind": "helm", "text": "Take Nevada clear of Arizona's fire and down the channel; keep her guns firing; do not let her sink in the channel." },
  "beats": [ { "t": "08:40:00", "text": "Nevada clears berth F-8 without tugs." },
             { "t": "08:45:00", "text": "Vestal is towed clear of Arizona." },
             { "t": "08:50:00", "text": "The second wave is over the island." },
             { "t": "08:55:00", "text": "Dive bombers come at you from the south-west." },
             { "t": "09:06:00", "text": "Bombs fall on the drydock: Pennsylvania, Cassin and Downes are hit." },
             { "t": "09:08:00", "text": "The attack slackens." } ],
  "record": { "hits": [ { "unit": "nevada", "count": [5, 6], "window": ["08:50", "09:08"], "by": "kaga-dive-2" } ],
              "track": [ "F-8 08:40", "off 1010 Dock and Drydock No. 1 about 08:55", "the turn off Hospital Point about 09:10 (temporarily grounded)" ] },
  "after": { "sources": ["cincpac-1942", "nevada-ar-1941", "bushships-summary-1942", "combatships-1941", "nps-battleship-row"] } }
```

- **Her track**: F-8 (21.3664, −157.9485) down the South Channel past F-7 to
  F-3, the 1010 Dock, Drydock No. 1 and YFD-2 to the turn off Hospital Point
  (21.3487, −157.9682): about 2.9 km in about 30 minutes (computed). Fixes: 08:40
  (CINCPAC), "about on PENNA stbd qtr. Distance about 600 yards" (Pennsylvania,
  stamped 08:15 in Kimmel narr.), 09:06 "NEVADA standing down south channel"
  (Mugford), 09:10 at the turn (CINCPAC), 09:13 "stopped south side of south
  channel" (Mugford). Precision `narrative` until the inset and a 1941 chart.
- **Her state at 08:40**: torpedoed at frame 40–42 port at 08:02, down by the bow;
  one or two bomb hits already (her report); AA manned, the 5-inch in local control;
  the CO ashore, Lt Cdr Francis J. Thomas commanding, Chief Quartermaster Sedberry at
  the wheel (her report).
- **The enemy's action**: second-wave D3As, Kaga's (her TROM) and others, from the
  south-west and in succession; aim to sink her in the channel (ja.wp, *tertiary*).
  The sim runs the real attack model against her (DESIGN.md §5.7).
- **Success in sortie terms**: AA hits (aircraft downed), damage survived, and
  the channel kept clear (she does not sink in it). The record's answer was to
  ground her at the turn. The sim lets the player try for the entrance: CINCPAC and
  Battle Force had signalled battleships not to sortie (Train), and sinking in the
  channel would have blocked it. Both outcomes are the player's battle; nothing
  outside the box changes.
- **After-card (tone: plain, with names)**: hits by source; beached at the turn
  about 09:10, moved to Waipiʻo at 10:45 (CINCPAC); 60 killed and 109 wounded
  (DANFS via en.wp, *verify*) or the 19 December table; Chief Boatswain E. J. Hill
  "cast off the lines under fire, and then swam back to the ship ... was blown
  overboard and killed" (her report) — the card may name him, the app does not draw
  him; Ensign Taussig wounded at his director. Her later war (refloated, Normandy,
  NPS).

### M5. A Kaga D3A1 of the second wave on Nevada in the channel (Japan) — the mirror of M4

```jsonc
{ "id": "kaga-d3a-nevada", "title": "Dive bombers find a battleship under way",
  "role": { "kind": "aircraft", "kit": "d3a1", "side": "japan", "group": "kaga-dive-2", "name": "a Type 99 carrier bomber of Kaga's 12th Attack Unit (Lt Makino Saburō)" },
  "t": "08:52:00", "durationS": 180, "timeScale": 1,
  "start": { "from": "nevada", "bearingDeg": 220, "rangeM": 4500, "altM": 2500, "speedMs": 75, "headingDeg": 40 },
  "objective": { "kind": "dive", "target": "nevada", "text": "Hit the battleship moving down the channel." },
  "record": { "hits": [ { "unit": "nevada", "count": [5, 6], "window": ["08:50", "09:08"] } ] } }
```

- **Enemy**: by now heavy AA from every ship and the Navy Yard (§8.3); Nevada's
  own 5-inch and .50 calibre.
- **Success**: a bomb hit on Nevada; came back (Kaga lost six Vals that day).
- **After-card**: the record's hits; Nevada beached, not sunk in the channel; the
  second wave lost 14 dive bombers (Exhibit 8); Nevada's dead from M4.

### M6. Welch and Taylor's P-40Bs from Haleʻiwa over ʻEwa (USA) — recommended

```jsonc
{ "id": "welch-taylor-ewa", "title": "Two P-40s from Haleʻiwa",
  "role": { "kind": "aircraft", "kit": "p-40b", "side": "usa", "group": "47ps-haleiwa", "name": "a P-40B of the 47th Pursuit Squadron (2d Lts George Welch and Kenneth Taylor)" },
  "t": "08:33:00", "durationS": 240, "timeScale": 1,
  "start": { "from": "ewa-field", "bearingDeg": 340, "rangeM": 8000, "altM": 1500, "speedMs": 115, "headingDeg": 160 },
  "objective": { "kind": "intercept", "target": "shokaku-dive", "text": "Break up the line of dive bombers strafing ʻEwa." },
  "record": { "kills": { "group": "47ps-haleiwa", "claimed": [4, 4] }, "losses": { "group": "shokaku-dive", "count": [1, 1] } } }
```

- **Start**: AAF "around 0830" from Haleʻiwa, sent by ground control to ʻEwa; the
  Army's own table has Haleʻiwa's take-offs "8:15 to 10:00" (Exhibit 5). Height and
  speed are *design*: the record does not give them (R4 §4.3).
- **The enemy's action**: Shōkaku's Vals strafing ʻEwa from just above the trees at
  about 08:35, rear gunners firing in wing-overs (USMC); no top cover (AAF); the
  sim's AI defends with rear guns and turns.
- **Success in sortie terms**: aircraft downed, came back, ammunition used. The
  record: "each getting two confirmed kills during this first engagement. Taylor
  fired on a third plane but did not see the crash" (AAF).
- **After-card**: the claims beside the Japanese loss tables (one first-wave Val
  lost, Shōkaku's; §9); their second sortie (Welch's third and fourth, Taylor
  wounded); the Army's total claims (10 + 4 probables) and the 29 Japanese
  losses to all causes. Tone: no triumphalism; claims labelled as claims.

### M7. A P-36A of Sanders's flight over Kāneʻohe (USA)

```jsonc
{ "id": "sanders-p36-kaneohe", "title": "Four P-36s from Wheeler",
  "role": { "kind": "aircraft", "kit": "p-36a", "side": "usa", "group": "46ps-sanders", "name": "a P-36A of 1st Lt Lewis Sanders's flight" },
  "t": "08:55:00", "durationS": 240, "timeScale": 1,
  "start": { "from": "kaneohe-nas", "bearingDeg": 250, "rangeM": 10000, "altM": 2000, "speedMs": 110, "headingDeg": 70 },
  "objective": { "kind": "intercept", "text": "Engage the second wave over Kāneʻohe Bay." },
  "record": { "kills": { "group": "46ps-sanders", "claimed": [3, 4] }, "losses": { "group": "46ps-sanders", "count": [1, 1], "of": 4 } } }
```

- **Record**: airborne "around 0850", east toward Bellows, met the second wave over
  Kāneʻohe; Sanders shot one down and fired on the one behind Sterling; Sterling
  shot down; Rasmussen's guns fired by themselves and a Japanese aircraft "passed
  directly in front of him and exploded"; Thacker's guns jammed; Sanders broke off
  alone with a Zero (AAF ch. 4). Which Japanese unit they met is not in what was read
  (*verify*: Lundstrom; Cressman). The P-36 "was no match for the Zero" (AAF).
- **Success**: aircraft downed, came back. **After-card**: Sterling killed; the
  claims; the second wave's fighter losses (6).

### M8. A Sōryū A6M2 of the second wave over Kāneʻohe (Japan) — the mirror of M7

```jsonc
{ "id": "soryu-a6m-kaneohe", "title": "Iida's fighters over Kāneʻohe",
  "role": { "kind": "aircraft", "kit": "a6m2", "side": "japan", "group": "soryu-fighter-2", "name": "a Type 0 carrier fighter of Sōryū's 3rd Fighter Unit (Lt Iida Fusata)" },
  "t": "08:55:00", "durationS": 240, "timeScale": 1,
  "start": { "from": "kaneohe-nas", "bearingDeg": 20, "rangeM": 3000, "altM": 1000, "speedMs": 100, "headingDeg": 200 },
  "objective": { "kind": "air-control", "text": "Hold the air over Kāneʻohe: American fighters are coming from the west." },
  "record": { "losses": { "group": "soryu-fighter-2", "count": [3, 3], "of": 9 } } }
```

- **Caution**: that Iida's unit, rather than Nōno's (Hiryū), met Sanders's flight
  is an assumption from the targets (USSBS: the second wave's fighters on Wheeler
  and Kāneʻohe) and from ja.wp's account of Iida at Bellows and Kāneʻohe; *verify*
  before shipping. The AAF names Nōno's nine at Bellows.
- **Success**: aircraft downed (the sim's), came back. **After-card**: Sōryū lost
  three fighters, Iida among them, hit by ground fire at Kāneʻohe (ja.wp,
  *tertiary*); Sterling killed; claims on both sides.

### M9. Helm under way, 07:58–08:22 (USA) — recommended as the destroyer and AA moment

```jsonc
{ "id": "helm-sortie", "title": "Helm, the one ship under way",
  "role": { "kind": "ship", "unit": "helm", "side": "usa" },
  "t": "07:58:00", "durationS": 720, "timeScale": 2,
  "objective": { "kind": "sortie", "text": "Get to sea, fight the aircraft over the channel, and find the submarine off the entrance." },
  "beats": [ { "t": "08:00:00", "text": "Torpedo planes cross the West Loch channel ahead of you, strafing." },
             { "t": "08:05:00", "text": "The after machine guns open; the forward ones are still in preservative grease." },
             { "t": "08:13:00", "text": "Past the gate vessel." },
             { "t": "08:17:00", "text": "A conning tower to the right of the channel, north of buoy No. 1." },
             { "t": "08:20:00", "text": "The steering motor shorts: steer by engines." } ],
  "record": { "kills": { "unit": "helm", "claimed": [1, 1] }, "hits": [ { "unit": "midget-i24", "count": [0, 0], "window": ["08:20", "08:21"] } ] },
  "after": { "sources": ["helm-ar-1941", "cincpac-1942"] } }
```

- **Her track**: X-7 at 07:26; in the West Loch channel at 07:55; backing out at
  08:00; main channel 08:10; gate 08:13; 25 kn past the entrance buoys 08:18;
  off Tripod Reef 08:20 (Helm's report). Precision `narrative`.
- **Enemy**: torpedo planes overhead, strafing (07:58–08:01); later level and dive
  bombers; a near miss off both bows at 09:15 (outside the checkpoint).
- **Success**: aircraft hit (she claimed one at 08:10), reaching sea, guns on the
  submarine. The midget is a target for her guns (a military vessel); its side is
  never playable (§15, D9).
- **After-card**: her report's numbers (90 rounds 5-inch, 350 .50 for the day); the
  midget she fired on is usually identified with Sakamaki's (I-24), which grounded
  later on the windward coast (*verify*); Sakamaki taken prisoner.

### M10. Helena's AA at 1010 Dock, 08:01–08:20 (USA) — alternative ship AA moment

Helena's guns were in action about 08:01, three minutes after a torpedo struck her
at frame 74–75 under the belt, with Oglala alongside and listing (Helena; Oglala).
She cannot move. Objective: AA (aircraft hit). Record: her claims are in her
Enclosure B (not opened, *verify*). Tone: the torpedo's flash burns killed many
men running to their stations before the moment opens; the card says so plainly.

### Ward, 06:37–06:53 (USA) — a stop in v1, a moment later if wanted

Ward's attack is the war's first American shot at Pearl Harbor: sighting at 06:37,
attack at 06:40, two rounds and four depth charges at 06:45, the report at 06:51
and 06:53 (Ward; Bishop's Point log). A destroyer gunnery moment at 50–100 yards
on a conning tower is possible and both are combatants; recommend a watched stop
in v1, because the box's subject is the air attack and the target cannot fight back.

### Moments not offered

- **The midget submarines' side**: never playable (§15, D9).
- **Hickam's barracks, Wheeler's tents, ʻEwa's people**: never objectives; Hickam is
  a watched stop.
- **The B-17s arriving unarmed (08:00–08:20)**: a stop, not a sortie on either side
  (the bombers had no ammunition, AAF).
- **Battleship Row's AA at F-5 to F-7 in the first minutes**: the minutes of
  Oklahoma's capsizing and Arizona's explosion (R4 §4.5 P4); stops only.
- **Enterprise's SBDs arriving into the attack and friendly fire**: a stop and a
  card.

---

## 13. Watched stops, and what stays on cards (for R8 and the tour)

**Tour stops** (camera targets are unit ids; all watchable with no sortie):
Ward's attack (06:40); Opana's contact (07:02, on the table's radar plot); the
deployment off Kahuku (07:40); Kāneʻohe (07:48, *verify*); "tora, tora, tora"
(07:52); the first bombs on Ford Island and Hickam (07:55); the torpedo run
(07:57); **Arizona (08:06)**; Oklahoma rolling over (08:08); Utah (08:12);
Helm at the entrance (08:17); Monaghan and the midget (08:43); Nevada under way
(08:40); the second wave (08:55); Pennsylvania, Cassin and Downes (09:06–09:41);
Shaw's magazine (about 09:30); Nevada at Hospital Point (09:10); the last
aircraft leave (09:45); the night (VF-6, card).

**Arizona's explosion** follows DESIGN.md §7.4: a flash, smoke and a ship that
breaks, in the model style; the card carries the 1,177. It happens on the record's
clock whatever the player does (no moment puts the player in the group credited
with it).

**Cards only, never objectives, never drawn as pictures**:

- the strafing of people at ʻEwa, Wheeler's tent area and Hickam's barracks ("Twenty-
  seven bombs hit the main barracks", Maj. Eckhert, quoted in the AAF history);
- civilians killed in Honolulu and elsewhere, "some due to enemy actions and others
  from friendly fire" (NPS: 49); the report of a fisherman fired on at Pearl City
  (Kimmel narr.);
- men trapped in Oklahoma and Utah, the 32 cut out of Oklahoma's hull, the
  identification of Oklahoma's unknowns since 2015 (NPS);
- Arizona's 38 sets of brothers (NPS);
- the midget submarines' crews, "prepared for death ... precursors of the KAMIKAZE
  Attack Units" in the 1945 Japanese answer (Exhibit 8), the "nine war gods" and
  Imperial GHQ's claim that they sank Arizona (ja.wp, *tertiary*); Sakamaki's capture;
- the Japanese airmen killed (55; §10.4), named where the record names them (Iida);
- Nishikaichi's landing on Niʻihau and what followed there (7–13 Dec), which involved
  civilians: a card, outside the box;
- Enterprise's aircraft shot down by friendly fire that morning and night.

The wording of every card that touches the dead or the living is R8's and a
historian's (§18).

---

## 14. Sources

### 14.1 Opened in this pass (with what was used)

| id (proposed) | work | URL | status | used for |
| --- | --- | --- | --- | --- |
| `cincpac-1942` | CINCPAC to SecNav, "Report of Japanese Raid on Pearl Harbor, 7 December, 1941", 15 Feb 1942 | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/CinCPac.html | read (R4's copy) | phases, torpedo attacks, movements, weather, ammunition, losses |
| `cincpac-damage` | its Enclosure (C), damage to ships | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/CinCPac-Damage.html | 200, read | hits, fates |
| `cincpac-airplanes` | CINCPAC memorandum on aircraft, 27 Dec 1941 | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/CinCPac-Airplanes.html | 200, read | Navy aircraft numbers |
| `batfor-1942` | Commander Battle Force (Pye), 9 Jan 1942, with Train's narrative and Wallin's damage summary | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/BatFor.html | 200, read | Nevada's grounding (Train), damage |
| `combatships-1941` | Commander Battleships, Battle Force (Anderson), 19 Dec 1941 | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/BatFor-BB.html | 200, read | **berths and pairs**, torpedo approach heights, personnel table |
| `patwing1-1942` | Commander Patrol Wing ONE, Kāneʻohe, 1 Jan 1942 | https://www.ibiblio.org/hyperwar/USN/rep/Pearl/PatWing1.html | 200, read | Kāneʻohe attacks |
| ship reports | Nevada, Oklahoma, Arizona, West Virginia, California, Tennessee, Maryland, Pennsylvania, Helena, Raleigh, St. Louis, Ward, Monaghan, Shaw, Cassin, Downes, Henley, Helm, Oglala, Utah, Vestal, Curtiss; Enterprise Air Group, VS-6 | https://www.ibiblio.org/hyperwar/USN/ships/logs/{BB/bb36,…}-Pearl.html (pattern; e.g. …/BB/bb36-Pearl.html, …/DD/dd388-Pearl.html, …/CV/cv6-cag-Pearl.html) | 200, read or searched | times, envelopes, positions |
| `kimmel-narrative` | Kimmel's report of 21 Dec 1941, Enclosure (A) "Narrative of events", PHA Pt 24 pp. 1570–1611 | https://www.ibiblio.org/pha/pha/misc/deck_log.html | 200, read and parsed | the minute-by-minute record |
| `pha-exhibit-8` | Joint Committee Exhibit 8, Japanese answers on the attack, PHA Pt 13 pp. 391–431 | https://www.ibiblio.org/pha/pha/pt_12/x12-008.html | 200, read | launch points and times, attack times, losses, midget submarines, Genda interrogation |
| `pha-exhibit-5` | Joint Committee Exhibit 5, Army compilation, PHA Pt 12 pp. 318–25 | http://ibiblio.org/pha/congress/Joint%20Committee%20Exhibits/Exhibit%20005.pdf | 200 (7.8 MB, pages rendered then deleted) | **take-off times by field**, aircraft status by field, radar plot before 07:00, AA readiness |
| `pha-exhibit-119` | Bishop's Point radio log, PHA Pt 17 pp. 2716–20 | https://www.ibiblio.org/pha/pha/misc/radiolog.html | 200, read | Ward's messages in GCT; Condor's 0350 |
| `pha-ships-present` | list of ships present, PHA Pt 12 pp. 348–49 | https://www.ibiblio.org/pha/pha/misc/ph-ships.html | 200, read | the order of battle in harbour |
| `jm-97` | Japanese Monograph 97, *Pearl Harbor Operations: General Outline of Orders and Plans* (1953) | https://www.ibiblio.org/pha/monos/097/index.html | read (R3's copy) | the orders: Point Z, launch points, recovery plan, targets, leaders |
| `ussbs-campaigns-ch2` | USSBS, *The Campaigns of the Pacific War* (1946), ch. 2 | https://www.ibiblio.org/hyperwar/AAF/USSBS/PTO-Campaigns/USSBS-PTO-2.html (R4's copy) and archive.org `campaignsofpacif46unit` leaves n43, n44, n46 | read; plates viewed | organisation, attack times, losses, App. 2 track chart, App. 3, App. 5 approach plate |
| `aaf-7dec41` | L. R. Arakaki and J. R. Kuborn, *7 December 1941: The Air Force Story* (PACAF, 1991), ch. 4 and 6, App. B, D | https://www.ibiblio.org/hyperwar/AAF/7Dec41/7Dec41-4.html, …-6.html, …-B.html, …/maps/7Dec41-6.jpg, -7.jpg | 200, read | routes, fighters, B-17s, radar, aircraft status |
| `usmc-infamous-day` | R. J. Cressman and J. M. Wenger, *"Infamous Day": Marines at Pearl Harbor* (1992) | https://www.ibiblio.org/hyperwar/USMC/USMC-C-Pearl/index.html | 200, read in part | fighter deployment, ʻEwa attacks |
| `bushships-summary-1942` | BuShips, *Summary of War Damage to U.S. Battleships, Carriers, Cruisers and Destroyers, 17 Oct 1941 to 7 Dec 1942*, Table II | https://www.ibiblio.org/hyperwar/USN/rep/WDR/SUMMARY%20OF%20WAR%20DAMAGE%20-%20U.S.%20Battleships,%20Carriers,%20Cruisers%20and%20Destroyers,%20October%2017,%201941%20to%20.pdf | 200 (0.8 MB), read | **hits per ship**, WDR numbers |
| `trom-*` | combinedfleet.com TROMs: Akagi, Kaga, Sōryū (R4's copies), Hiryū, Shōkaku, Zuikaku | http://www.combinedfleet.com/akagi.htm, kaga.htm, soryu.htm, hiryu.htm, shokaku.htm, Zuikak.htm | 200 | launch times, numbers, losses by carrier, the Arizona attribution |
| `jacar-*` | JACAR record pages (§14.3) | https://www.jacar.archives.go.jp/das/meta/{RefCode} | 200, metadata and first-sheet transcriptions | first-wave numbers and loads per carrier |
| `nps-people`, `nps-battleship-row` | NPS, Pearl Harbor National Memorial: People; Battleship Row; Oklahoma identification | https://www.nps.gov/valr/learn/historyculture/people.htm, …/battleship-row.htm, https://www.nps.gov/valr/uss-oklahoma-casualties-identified.htm | 200 | the dead, by ship and in total |
| `tz-northamerica` | IANA tz database | https://data.iana.org/time-zones/tzdb/northamerica | 200 | UTC−10:30 |
| `osm-overpass` | OpenStreetMap via Overpass (ODbL) | https://maps.mail.ru/osm/tools/overpass/api/interpreter | 200 | quay, wreck, dock and point positions |
| `noaa-cudem-ninth` | NOAA NCEI CUDEM 1/9″ Hawaii, S3 listing and STAC | https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/?list-type=2&prefix=dem/NCEI_ninth_Topobathy_Hawaii_9428/ | 200 | the inset's source |
| Hawaiian app data | manifest, patches manifest, Oʻahu height pack, two masks | `git show origin/claude/funny-cannon-vy1pyf:packages/holo-i-ke-au/public/data/…` (local, read-only) | read | the pack's resolution and the dated patches |
| *tertiary* | en.wikipedia: Attack on Pearl Harbor, Battleship Row, USS Nevada (BB-36), USS Utah (BB-31), USS Oklahoma (BB-37), Ford Island, USS Arizona Memorial, Pearl Harbor Naval Shipyard; ja.wikipedia: 真珠湾攻撃, 九一式魚雷 | https://en.wikipedia.org/w/index.php?title=…&action=raw; https://ja.wikipedia.org/w/index.php?title=…&action=raw | 200 | finding aid: Japanese signal times, the torpedo method, numbers to verify |

### 14.2 Not opened (cite as *verify*)

| work | why it matters |
| --- | --- |
| Senshi Sōsho 10, 『ハワイ作戦』 (1967), pp. 596–616 (the AAF's source for the aircraft numbers, via D. Aiken) | the official Japanese history; per-carrier second-wave numbers, times, losses |
| the 第一航空艦隊 (Kidō Butai) 戦闘詳報 for the Hawaii operation | the Japanese action report; not found on JACAR by keyword |
| G. W. Prange, *At Dawn We Slept* (1981) and *December 7, 1941* (1988), with Goldstein and Dillon | the standard narrative; times (tora 07:53), the Arizona bomb, Opana 07:02 |
| D. M. Goldstein and K. V. Dillon (eds), *The Pearl Harbor Papers: Inside the Japanese Plans* (1993) | translated Japanese documents and action reports |
| A. D. Zimm, *Attack on Pearl Harbor: Strategy, Combat, Myths, Deceptions* (2011) | an analytical reconstruction of the torpedo and bomb hits and the timeline |
| W. Lord, *Day of Infamy* (1957) | witness-based narrative |
| H. N. Wallin, *Pearl Harbor: Why, How, Fleet Salvage and Final Appraisal* (1968) | salvage; Nevada's grounding (en.wp cites pp. 212–213) |
| J. B. Lundstrom, *The First Team* (1984) | the air combat, Army and Navy fighters, units met |
| M. Fuchida, "I Led the Air Attack on Pearl Harbor", USNI *Proceedings* (Sept 1952), and his memoir | the flare episode, the level run |
| R. Kusaka (草鹿龍之介), 『連合艦隊参謀長の回想』 (1979) | ja.wp's source for recovery times and the decision to withdraw |
| J. P. Delgado et al., *The Lost Submarines of Pearl Harbor* (2016) | the midget submarines, launch times, wrecks |
| C. Conn, R. C. Engelman, B. Fairchild, *Guarding the United States and Its Outposts* (CMH, 1964/2000) | the civilian figures behind 68 killed, 35 wounded |
| R. C. Schmitt and D. C. Cox, "Hawaiian Time", *Hawaiian Journal of History* 26 (1992) | the time-zone history |
| BuShips War Damage Reports Nos. 1, 4, 6, 7, 9, 13, 14, 17, 21, 22 (Pearl Harbor ships) | hit locations; not on HyperWar's WDR index |
| CINCPAC's Enclosures A-1 to A-8 (phase charts, AA plots, sortie chart, composite chart) and ComBatShips' Enclosure A (berthing plan) | the charts to georeference the berths and tracks |
| US Naval Technical Mission to Japan, report O-01-1, Japanese torpedoes | the Type 91's envelope behind ja.wp |
| DANFS entries (NHHC) for Nevada, Oklahoma, Arizona | casualty and service dates |

### 14.3 JACAR RefCodes for the attack

Search: `https://www.jacar.archives.go.jp/aj/search?kw=<words>&rows=50`
(布哇 飛行機隊戦闘行動調書; 布哇作戦; 布哇空襲; ハワイ海戦; 第五航空戦隊戦闘詳報).
**The search page prints each record's title one row off its RefCode**; the
titles below are from each record's own page.

| RefCode | title (from the record page) | creator(s) as transcribed | what the first sheet says (8 Dec 1941) |
| --- | --- | --- | --- |
| **C08051579600** | 昭和16年12月～昭和17年6月 赤城飛行機隊戦闘行動調書（1） | 中佐渕田美津雄 / 大尉千早猛広 大尉進広三郎 / 大尉岩井健太郎 (OCR; read 淵田美津雄, 千早猛彦, 進藤三郎) | 布哇作戦（第一次攻撃隊）敵主力艦雷爆撃; commander Fuchida; fc ×9, fk97 ×27 (36); 800 kg ×15; torpedoes ×12 |
| **C08051585400** | 昭和16年12月～昭和17年6月 加賀飛行機隊戦闘行動調書 | 大尉小川正一 / 大尉飯塚雅夫 | 布哇敵主力艦並ニ飛行機攻撃（一次）; leaders Shiga, Kitajima, Hashiguchi; fc ×9, fk ×26; 800 kg ×14; torpedoes ×12 |
| **C08051578600** | 昭和16年12月～昭和17年4月 蒼龍飛行機隊戦闘行動調書（1） | 大尉菅波政治 / 大尉阿部平太郎 / 大尉長井彊 | 第一次 布哇作戦第三制空隊; fc ×8; shot down 4, unconfirmed 1 |
| **C08051579100** | 昭和16年12月～昭和17年4月 飛龍飛行機隊戦闘行動調書（1） | 少佐楠美正 / 大尉中川俊 / 大尉能野澄天 (OCR; read 能野澄夫) | 布哇攻撃一次; commander Kusumi; fc ×6, fk ×18 (24); 800 kg ×10, 250 kg ×18 (first and second combined), Type 91 torpedoes ×8 |
| **C08051577100** | 昭和16年12月～昭和18年11月 翔鶴飛行機隊戦闘行動調書（1） | 少佐高橋赫一 / 大尉兼子正 / 大尉市原辰雄 | 布哇敵飛行場格納庫; commander Takahashi; fb ×26; 250 kg ×26 |
| **C08051577600** | 昭和16年12月～昭和18年4月 瑞鶴飛行機隊戦闘行動調書（1） | 大尉佐藤正大 大尉坂本明 / 少佐島崎重和 / 中尉塚本祐造外 (OCR; read 佐藤正夫, 嶋崎重和) | 布哇作戦第一次発進隊敵飛行場急襲; fc ×6, fb ×25 (31); 250 kg ×25 |
| C08030040900 | 目次 昭和17年1月1日～9月30日 大東亜戦争戦闘詳報戦時日誌 第3戦隊 | 海軍功績調査部 | lists 戦斗詳報 機動部隊支援部隊［第三戦隊（第二小隊）］詳報第一号 布哇作戦ニ於ケル作戦 (Hiei, Kirishima) |
| C13120032700, C13120033100 | 第5航空戦隊戦時日誌（作戦及一般之部）昭和16年12月 (cover; 3. 令達報告等 (1)) | 第五航空戦隊司令部 | CarDiv 5's war diary; signals from 1 Dec ("八日布哇空襲ニ関スルモノ戦斗詳報参照") |
| C19010332700 | 2. 作戦別功績一覧 (made about 1942) | 第二復員部残務処理部資料課 | the Hawaii operation's forces and awards, by unit |
| C19010344700 | 故中岡信喜少将記録中主要事項抜萃 20-12-28 | 資料整理幹事 | an I-boat officer's notes: "八日 四時前ヨリ爆撃音 一六三一大爆発" (bombing heard from before 04:00, a great explosion at 16:31, JST) |
| C13071073300 | 作戦関係重要書類綴 第1巻 (7) | 大本営陸軍部 | the Navy General Staff's draft report to the Emperor, 2 Dec 1941: 8 December chosen for a moon of about 19 days and a Sunday at Hawaii |
| C16120672900 | 主要海空戦日米呼称対照表 (1946) | 史実調査部 | the Japanese name: 布哇海戦 (16-12-8) |

Terms (R2 §8.2): images may be downloaded and printed for personal use; NIDS's
records need NIDS's permission for publication. Cite by RefCode and use the facts.

---

## 15. Decisions for the designer

| # | decision | recommendation | why |
| --- | --- | --- | --- |
| D1 | box extent | **island box, about 103 × 100 km (21.15–22.05°N, 158.55–157.55°W); carriers off-box**, waves entering at the north edge; the table draws the carriers' track and launch | the launch point is 374 km out (§3.4); a box that holds it is 184 × 423 km of sea; DATA.md §7's 10 km margin is met by the island box for every unit that acts |
| D2 | harbour terrain | **a 10 m harbour inset from NOAA CUDEM 1/9″** (two tiles, about 300 MB downloaded and deleted by the bake), with 1941 patches (Kuahua before 1943, drydocks 2–4 absent, post-war piers and the bridge removed); the 68 m pack outside it | the pack is fine for aircraft and wrong for ships (§11.2); GLO-30 is too coarse and a surface model; this is an exception to DATA.md §7's GLO-30 rule and needs writing into the contract |
| D3 | battle clock | **06:30–10:00 HST**; Nevada's 10:35–10:45 move to Waipiʻo on a card (or `to` 10:45) | holds Ward's attack and the whole air attack; nothing after 10:00 needs the sim |
| D4 | which level-bomber group is playable | **Akagi's (Fuchida's) only** | the tellings credit Arizona's bomb to Hiryū's or Kaga's group; the explosion stays the record's beat |
| D5 | damage authority | **BuShips *Summary of War Damage* (1942) for hits**, other tellings on cards | it was written after salvage and inspection; the December reports were made with the ships under water |
| D6 | the casualty headline | **NPS's current 2,390 (2,341 + 49 civilians)**, with 2,403 (68 civilians) as a telling, scope stated | the NPS is the museum of record; R8 to confirm wording |
| D7 | Welch and Taylor's start | **08:33 near ʻEwa**, claims beside the Japanese losses | AAF "around 0830"; Shōkaku's Vals there at 08:35 (USMC); the Army's table allows 08:15 onward |
| D8 | Nevada's checkpoint and freedom | checkpoint **09:10 at the turn off Hospital Point**; the player may try for the entrance; sinking in the channel blocks it inside the box | the record's own choice, the Japanese intent (ja.wp) and the owner's rule (the tide can turn inside the battle) |
| D9 | midget submarines | **the Japanese side never playable; Ward a stop in v1** | the 1945 Japanese answer calls the crews "prepared for death ... precursors of the KAMIKAZE Attack Units" (Exhibit 8): the tokkō rule applies; the US side is a gunnery moment against a target that cannot fight back |
| D10 | v1 moment set | **M1 (Kaga torpedo), M4 (Nevada) with its mirror M5, M6 (Welch and Taylor), M9 (Helm)**; later M2, M3, M7/M8, M10 | covers torpedo bomber, dive bomber, fighter, battleship and destroyer on both sides; M8's unit identity needs checking first |
| D11 | static targets | add a **`sites` array** to `battle.json` (airfields, hangars, drydocks, tank farms) with damage states, as start anchors and targets | DATA.md §9's `start.from` needs a unit, and Ford Island's hangars, ʻEwa and Kāneʻohe are not units |
| D12 | what the score counts | ships, aircraft (air and ground), hangars, docks and guns; **never barracks, tents or people** | DESIGN.md §5.7, §7.4; Hickam's barracks and the strafing of people are on the record (§13) |
| D13 | Japanese numbers | **flown: 183 and 167** (TROMs, JACAR); planned 189 and 171 on the card | the kits fly what flew |
| D14 | berth precision | F-6 to F-8 `chart` from OSM; F-3 to F-5 `schematic` until a 1941 chart is georeferenced | the post-war rebuild of F-5 |

---

## 16. Risks

- **Clock conflicts.** The ships' times differ by minutes and sometimes by an hour
  (Monaghan's ram 08:43 or "about 0930"; Arizona 08:06 or 08:20; California's bomb
  08:30, 08:45 or 09:00). The scenario must store `sourceClock` per beat and choose.
- **CINCPAC's phases mislead.** Its Phase III "horizontal bombers" at 08:40–09:15
  does not match the Japanese record (level bombers at 08:05; the second wave's
  level bombers on airfields). Choreographing from the phases alone would put the
  wrong aircraft over the ships.
- **"230 miles north of Oʻahu".** A box or table route drawn from the popular
  phrase puts the carriers 50 km too far north and 80 km too far west.
- **The success that is a death toll.** A torpedo hit on Oklahoma is, in the record,
  most of 429 deaths. The sortie scores the hit; the card must speak only of the
  record and keep the two apart (DATA.md §9: the outcome is computed, never
  written). R8 and a historian should read M1's and M2's after-cards before ship.
- **Claims presented as kills.** Every US and Japanese number of aircraft "shot
  down" in the reports is a claim; the sum far exceeds the 29 lost.
- **The Japanese record is thin and mostly post-war memory.** Exhibit 8 and JM-97
  say so themselves ("reconstructed from personal notes and memory"). The JACAR
  action records were read only to their first sheets.
- **Second-wave per-carrier numbers do not sum** in the TROMs (Kaga's 23).
- **Unit identities in the fighter fights** (Sanders's flight against Iida's or
  Nōno's unit) are assumptions until Lundstrom or Senshi Sōsho is read.
- **The terrain is today's.** CUDEM and the lidar show today's dredging, docks,
  piers and the bridge; the 1941 patches above must be made, and the 1941 channel
  depths are not known from what was read.
- **Transcription errors in HyperWar** ("7055-0825", a phase misnumbered, USSBS's
  dropped B5N loss line, the USSBS plate's "Type 99" for the B5N) and OCR errors in
  JACAR's names.
- **Licensing.** OSM positions are ODbL: fine as reference facts; if a derived
  dataset of positions ships, it needs attribution (R2's licence table to add OSM).
  NIDS images need permission; the facts do not.
- **Tertiary numbers.** Several figures (Japanese dead, torpedo envelope, recovery
  times, return-to-service dates) rest on Wikipedia until the print sources are read.

---

## 17. What could not be reached

| host or work | result | what it would unlock |
| --- | --- | --- |
| history.navy.mil (NHHC) | 000 (as R2) | DANFS, the berthing chart, Nevada's narrative, photo times (Shaw) |
| overpass-api.de | connection reset | (the maps.mail.ru mirror served instead) |
| overpass.kumi.systems | timeout | — |
| en.wikipedia raw for "Kidō_Butai" and "Type_91_torpedo" | 429 | tertiary cross-checks only |
| en.wikipedia "Japanese_midget_submarines_at_Pearl_Harbor" | 404 (title guess) | tertiary |
| HyperWar `USN/rep/WDR/WDRSumm1/index.html` | 404 | the HTML of the WDR summary (the PDF served) |
| BuShips WDRs for the Pearl Harbor ships | not on HyperWar's WDR index | hit locations per ship |
| PHA Joint Committee Exhibit 6 (Navy compilation, 19.7 MB) and 8-D (124 MB) | not downloaded (size) | the Navy's charts and tables; more Japanese material |
| PHA "Exhibits-Illustrations" Items 1 and 18 (the Opana plot after 07:00) | not located | the radar track of the first wave |
| JACAR keyword searches for 真珠湾, 甲標的 布哇, 第一航空艦隊 布哇, 機動部隊 布哇 | pages returned no parseable hits | the Kidō Butai 戦闘詳報 and the submarine records |
| historicalcharts.noaa.gov search | 404 on a guessed search URL (root 200) | a 1940s chart of Pearl Harbor to georeference |
| NPS military and civilian casualty lists | not fetched (names) | not needed for the box; for R8 |
| researcheratlarge.com (Helena's damage report) | not tried (R2: self-signed TLS) | Helena's hit details |

---

## 18. Still needs a person

- **A reader of wartime Japanese** for the six 行動調書 (§14.3): every sheet for 8
  December, for launch, attack and return times, per-aircraft results and losses,
  the second wave's numbers per carrier, and the units' targets; and for Senshi
  Sōsho 10 pp. 596–616. Also to check every name's reading in §4.
- **Library access** to Prange (and Goldstein and Dillon), Zimm, Wallin, Lundstrom,
  Lord, Fuchida's 1952 article, Kusaka 1979 and Delgado et al. 2016, for: which
  group dropped Arizona's bomb; the torpedo units' approach lanes per carrier; the
  Japanese units the Army fighters met; tora at 07:52 or 07:53; Opana's 07:02 and 132
  miles; the night of VF-6.
- **A chart**: CINCPAC's Enclosure A or ComBatShips' berthing plan (NARA RG 38, or
  NHHC), or a 1940s USC&GS chart of Pearl Harbor, georeferenced, to fix F-3 to F-5,
  the 1010 Dock, YFD-2, the nests in East and Middle Loch, the 1941 shoreline at
  Kuahua and the drydocks, the ships' headings, and the channel depths.
- **NHHC in a browser** for DANFS (Nevada's 60 dead and her service dates) and the
  times of the famous photographs (Shaw's explosion).
- **R8 and a historian** for every after-card that carries the dead (M1, M2, M4,
  M5) and for the cards in §13; a Japanese historian's eye on the Japanese side's
  cards.
- **The designer** for D1–D14, especially D2 (a contract exception) and D11 (sites).

---

## 19. URLs requested, with status

- 200: https://www.ibiblio.org/hyperwar/USN/rep/Pearl/CinCPac-Damage.html,
  …/CinCPac-Airplanes.html, …/BatFor.html, …/BatFor-BB.html, …/DesFlotOne.html,
  …/PatWing1.html, …/PatWing2.html, …/Medical.html, …/CinCPac-Staff.html
- 200: https://www.ibiblio.org/hyperwar/USN/ships/logs/ BB/bb36, bb37, bb38, bb39,
  bb43, bb44, bb46, bb48; CL/cl7, cl8, cl46, cl48, cl49, cl50; DD/dd139, dd354, dd372,
  dd373, dd375, dd388, dd391; CM/cm4; AG/ag16; AR/ar4; AV/av4, av8; AO/ao23; AH/ah5;
  AD/ad3; CV/cv6-cag, cv6-vs6 (each `-Pearl.html`)
- 200: https://www.ibiblio.org/hyperwar/AAF/7Dec41/7Dec41-B.html, -D.html, -E.html,
  -5.html; …/maps/7Dec41-2.jpg, -6.jpg, -7.jpg
- 200: https://www.ibiblio.org/hyperwar/USMC/USMC-C-Pearl/index.html
- 200: https://www.ibiblio.org/hyperwar/USN/rep/WDR/SUMMARY%20OF%20WAR%20DAMAGE%20-%20U.S.%20Battleships,%20Carriers,%20Cruisers%20and%20Destroyers,%20October%2017,%201941%20to%20.pdf
- 404: https://www.ibiblio.org/hyperwar/USN/rep/WDR/WDRSumm1/index.html;
  https://www.ibiblio.org/hyperwar/USN/WarDamage/
- 200: https://www.ibiblio.org/pha/, …/pha/pha/index.html, …/pha/pha/invest.html,
  …/pha/pha/extra.html, …/pha/pha/pt_12/x12-008.html, …/pha/pha/pt_12/x12-p431.html,
  …/pha/pha/misc/ph-ships.html, …/pha/pha/misc/deck_log.html,
  …/pha/pha/misc/radiolog.html, http://ibiblio.org/pha/timeline/
- 200: http://ibiblio.org/pha/congress/Joint%20Committee%20Exhibits/Exhibits.html,
  …/Exhibit%20004.pdf, …/Exhibit%20005.pdf, …/Exhibit%20007.pdf (HEAD: Exhibit 006
  19.7 MB, 008-D 124 MB, 119 1.3 MB, not downloaded)
- 200: http://www.combinedfleet.com/shokaku.htm, …/hiryu.htm, …/Zuikak.htm,
  …/I-16.htm, …/kaigun.htm, https://www.combinedfleet.com/KIDO%20BUTAI.htm;
  404: http://www.combinedfleet.com/zuikaku.htm
- 200: https://www.jacar.archives.go.jp/aj/search?kw=… (11 searches);
  https://www.jacar.archives.go.jp/das/meta/C08051579600, C08051585400,
  C08051578600, C08051579100, C08051577100, C08051577600, C08030040900,
  C13120032700, C13120033100, C13120113900, C19010332700, C19010344700,
  C13071073300, C16120672900, C08030039900
- 200: https://www.nps.gov/perl/index.htm, …/perl/learn/historyculture/index.htm,
  https://www.nps.gov/valr/faq-s.htm, …/valr/learn/historyculture/battleship-row.htm,
  …/people.htm, …/places.htm, …/stories.htm, …/valr/uss-oklahoma-casualties-identified.htm;
  404: https://www.nps.gov/perl/faqs.htm; 302: https://www.nps.gov/valr/faqs.htm
- 200: https://archive.org/download/campaignsofpacif46unit/campaignsofpacif46unit_scandata.xml,
  …/page/n43_w1400.jpg, n44, n46 (n47 fetched by mistake for page 26, deleted)
- 200: https://data.iana.org/time-zones/tzdb/northamerica
- 200: https://maps.mail.ru/osm/tools/overpass/api/interpreter (two queries);
  reset: https://overpass-api.de/api/interpreter; timeout: https://overpass.kumi.systems/api/interpreter
- 200: https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/?list-type=2&prefix=dem/NCEI_ninth_Topobathy_Hawaii_9428/&max-keys=1000;
  …/dem/NCEI_ninth_Topobathy_Hawaii_9428/stac/tiles/ncei19_n21x50_w158x00_2021v1.json
- 200: https://historicalcharts.noaa.gov/ (404 on /search?q=pearl+harbor);
  200: https://pearlharbor.org/ (not used); 000: https://www.history.navy.mil/
- 200 (action=raw): en.wikipedia Battleship_Row, USS_Arizona_Memorial, USS_Utah_(BB-31),
  USS_Oklahoma_(BB-37), Ford_Island, Attack_on_Pearl_Harbor, USS_Nevada_(BB-36),
  Pearl_Harbor_Naval_Shipyard, Hospital_Point (an Antarctic point, not used),
  USS_Ward_(DD-139) (a redirect stub); 404 Japanese_midget_submarines_at_Pearl_Harbor;
  429 Kidō_Butai, Type_91_torpedo; ja.wikipedia 九一式魚雷, 真珠湾攻撃, 九九式艦上爆撃機,
  九七式艦上攻撃機 (200), 九九式八十番五号爆弾 (404)
