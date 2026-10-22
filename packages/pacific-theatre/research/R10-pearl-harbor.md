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
   carries some 70 ship and unit action reports, and the Pearl Harbor Attack
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
   loads per carrier. The Kidō Butai's own 戦闘詳報 was not found by keyword.
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
| Exhibit 8, answer 27 (PHA Pt 13 p. 409) | "1631 hours 8 December (2101 hours, 7 December, HAWAII time)" | yes |

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
| F-10, F-11 (carrier berths; carrier often at F-9) | Utah (AG-16) and Raleigh (CL-7) (CINCPAC), which at which *verify* | Utah's wreck 21.3689, −157.9627 (OSM); the 1941 wharves F9 21.3659, −157.9663 and F10 21.3672, −157.9642 (OSM) | chart (Utah) |
| F-12, F-13 | Detroit (CL-8) (she later "maneuvered to place herself port side to berth F-13"); Tangier (AV-8) "moored at Northwest end of Ford Island" (Monaghan) | *verify* | narrative |

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
