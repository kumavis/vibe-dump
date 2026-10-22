# R3: the timeline, the events, the extent of the table, the front and the routes

Researcher R3, 22 October 2026, for the designer of the Pacific War diorama
(`BRIEF.md`). This file covers the eras (keyframes), the event list, the box
the table covers, the front at each keyframe, the routes, and the clocks and
calendars the record uses. Each table is meant to become JSON with little
rework (Hawaiian `DATA.md` §4 and "Routes" are the model).

**How to read the marks.**

- **[O]**: I opened and read it in this pass. The URL is in §9.
- **[R2]**: R2 opened it (`R2-sources.md`). I did not reopen it.
- **[W]**: Wikidata or Wikipedia. I opened it, but it is tertiary: a finding aid, never the cited source.
- ***verify***: from memory, or seen only in a search-engine summary. Not read.

Coordinates in the tables are written **lat, lon** (south and west negative)
because people read them that way. The JSON wants `[lon, lat]`.

Downloads (small: text, a few map JPEGs, one chronology) are under
`research/downloads/R3/`. The scripts are in `research/r3-scripts/`: Wikidata
SPARQL, the chronology grep and the extent and distortion calculation.

---

## 0. Headline findings

1. **The front has a public-domain source for every keyframe, and the
   best one is semimonthly.** The US Army's *Atlas of the World Battle Fronts
   in Semimonthly Phases to August 15, 1945* is a supplement to the Chief of
   Staff's Biennial Report, made by the Army Map Service. It draws the Pacific
   front every half month from 1 July 1943 to 15 August 1945, on a Mercator
   base with a 500-mile grid. The legend: "enemy-controlled territory appears
   white … enemy gains … black … neutral countries … gray". Ocean areas "in the
   wake of our advance" count as Allied-controlled (Wikisource text [O]).
   Commons holds all 52 Pacific maps tagged PD-USGov (the one I checked is
   960 × 925 px) [O file pages]. Commons also holds a 111-page PDF from the
   CGSC Combined Arms Research Library [O]. Before July 1943, the Green Books on HyperWar carry dated
   "situation" maps that shade Japanese control: Morton's "limit of advance, May
   1942" and "limit of Japanese advance, 1942" (with the National Defense Zone),
   Smith's 12 March 1944, Smith's 15 December 1944 and Appleman's March 1945 [O,
   viewed].
2. **Those same maps answer "how do you draw a front that isn't a line".**
   - Land held is a filled area.
   - Groups of islands held are enclosed by a dashed perimeter.
   - Bypassed garrisons are separate filled specks. Rabaul, Bougainville,
     Wewak and Truk appear this way on Appleman's March 1945 map.
   - The sea is left unfilled, except in the Atlas, which fills the sea behind
     the US advance as Allied. That is an American framing, and I recommend not
     copying it (§5.1).
3. **Recommended table extent: 78° E to 155° W, 42° S to 56° N,
   azimuthal equidistant centred on 7° N 141.5° E.** The brief's box stops at
   90° E, which leaves out Colombo and Trincomalee. The Indian Ocean raid
   (Operation C, April 1942) cannot be drawn without them. The wider box keeps
   angular distortion under 12° at every place named in the task: Colombo
   11.3°, Pearl Harbor 10.9°, Dutch Harbor 11.9°, Attu 8.3°, Sydney 5.2°. The
   cost is about 10 % more width (14,170 km across, 6.9 km per texel at 2,048)
   (§4, computed).
4. **The record's clocks disagree inside single battles, and two v1 battles
   carry more than one US zone.**
   - **Midway:** CINCPAC writes "All times in this rept are Zone plus 12 … Task
     Force 16 and 17 reports … Zone plus 10". ComCruPac writes "All times are
     local, plus ten zone". Nagumo's report: "all dates … and all times are in
     Tokyo time, Plus 9" [all O].
   - **Second Naval Battle of Guadalcanal:** the ONI Combat Narrative switches
     zone between its parts. Part One is "Zone minus 11"; Parts Two and Three
     (the battleship action) are "Zone minus 12". Morison uses minus 11 (R2). So
     Washington's first salvo is 0016 on 15 November in ONI, 2316 on 14
     November in Morison's zone, and 2116 on 14 November in Tokyo time [O].
   - Store every time with its source's offset (§7).
5. **Calendar dates flip across the date line, and the Aleutians lie on the
   "wrong" side of it.**
   - Attu (173° E) and Kiska (177° E) lie west of 180°, but their dates follow
     America.
   - USSBS gives the Kiska landing at "1500, 6 June (150th meridian west
     longitude, zone plus 10, time and date)" and Attu "about 0300, 7 June".
   - The USN Chronology puts Attu on 5 June and Kiska on 7 June [both O]. One
     of them is wrong. The data must carry both tellings until a primary
     settles it.
6. **The Midway approach can be digitised from a primary chart.** The Nagumo
   report's "Track Chart, Battle of Midway" has dated noon positions on a
   graticule: Bungo 27 May, refuelling 31 May to 2 June, fog on the 2nd and
   3rd, launch at 0130 on the 5th (Tokyo dates), and the retirement. Read by
   eye to about ±0.5°, it gives the Kidō Butai route in §6.6. The Pearl Harbor
   route rests on the orders in Japanese Monograph 97:
   - standby point 42° N 170° W (Combined Fleet Op. Order No. 5; Nagumo's own
     order says 42° N 165° W);
   - approaching point 32° N 157° W;
   - take-off "200 nautical miles north of the enemy fleet anchorage";
   - return "skirt 800 nautical miles north of Midway" via the assembly point
     30° N 165° E [O].

   Morton's inset dates the actual track (26 Nov, 4, 6 and 7 Dec, detach for
   Wake 16 Dec, home 23 Dec, Tokyo time) [O].
7. **USSBS *Campaigns of the Pacific War* (1946) is the route atlas.** Its
   appendices hold track charts for:
   - Pearl Harbor (2) and the southern advance (10);
   - the Kidō Butai's movements (11) and Coral Sea (Shōhō, 17);
   - Midway (20–22) and the Aleutians (26, plus 27, the Kiska evacuation);
   - Savo, Eastern Solomons, Cape Esperance and Santa Cruz (39–45);
   - **nine charts of the Naval Battle of Guadalcanal (47)**;
   - Philippine Sea (83, 84) and Leyte approaches (93);
   - **Samar (94)** and **Yamato's track on 6–7 April 1945 (100, 101)**.

   The full scan is open on archive.org [O, list of plates; I did not view the
   plates].
8. **Event list: 13 prologue cards (8 core) and 109 events in the span,
   tiered.** Tier 1 is 80 events, which fits the brief's 70–90. Tier 2 (29)
   is optional depth. 23 events are battle-box candidates. The `kind`
   vocabulary gains what the Hawaiian one lacks: `campaign`, `landing`,
   `raid`, `siege`, `sinking`, `occupation`, `surrender`, `political`,
   `bombing`, `atrocity`, `captivity` and `people`. A flag says `box`, `view`
   or `cards`, and the tone rule maps kinds to flags (§2.1).
9. **General Order No. 1 gives the last keyframe its shape.** At the surrender
   Japan still holds most of what it held in July 1945. The honest map of 2
   September is the surrender zones of General Order No. 1, not a front:
   - (a) China excluding Manchuria, Formosa and Indochina north of 16° N:
     Chiang Kai-shek;
   - (b) Manchuria, Korea north of 38° N and Karafuto: the Soviet commander;
   - (c) the Andamans to the Solomons: SEAC or Australia;
   - (d) the Mandates, Ryukyus and Bonins: CINCPAC;
   - (e) Japan, Korea south of 38° N and the Philippines: MacArthur.

   (Wikisource text [O].) The Wikisource version does not name the Kurils
   in (b) (*verify* the issued text).
10. **Several important islanders' events have firm dates in open sources.**
    - **Guam:** surrender 10 December 1941; renamed 大宮島 Ōmiya-jima; Tinta
      massacre 15 July 1944, Faha 16 July 1944; landing 21 July 1944.
    - **Nauru:** occupied late August 1942. The tellings disagree (25, 26 or 29
      August). Islanders deported to Truk in 1943; the survivors came home in
      January 1946.
    - **Banaba:** massacre on 20 August 1945, one survivor, Kabunare Koura.
    - **Solomons:** Jacob Vouza captured on 20 August 1942.
    - **Unangax̂:** removal to Southeast Alaska in June 1942; the Attuans
      shipped to Otaru in September 1942.
    - **Okinawa:** the Naha raid on 10 October 1944; Tsushima Maru sunk on 22
      August 1944; Kerama landing on 26 March 1945.

    (Sources [O], [W], NPS *verify*.)
11. **Wikidata's SPARQL endpoint works where Wikipedia's API does not.** One
    pair of queries returned the Japanese article title, coordinates and
    dates for 176 of 219 English article titles asked for. That gives a
    Japanese name for every event that has a ja.wikipedia article. The dates in Wikidata are often
    wrong or year-only, so I checked them against the chronology. The API
    (`wbgetentities`) answered 429. `query.wikidata.org/sparql` answered 200.

---

## 1. Method, and what was read

- **The spine of dates** is Cressman, *The Official Chronology of the U.S.
  Navy in World War II* (Naval Historical Center, 1999), on HyperWar. I
  downloaded all five year pages (1941–45, about 1.9 MB of HTML) and searched
  them by keyword. Each match was tied to its day heading
  (`r3-scripts/chron.py`). The chronology dates events by the local date where
  they happen: Pearl Harbor on 7 December, Malaya, Hong Kong, Guam and Wake on
  8 December. It prints many sinking positions to the minute, which I used for
  the battle coordinates [O].
- **Campaign spans** come from the US Army's official campaign dates, as
  titled on the CMH brochures on HyperWar. Examples: "Philippine Islands: 7
  December 1941–10 May 1942"; "Aleutian Islands: 3 June 1942–24 August 1943";
  "Ryukyus: 26 March–2 July 1945" [O, titles].
- **Japanese names** come from the Japanese Wikipedia article titles via
  Wikidata [W]. I added romaji by hand, and period operation names where I
  know them. Both are *verify* for a Japanese reader (§11).
- **Front sources** I viewed:
  - Morton, *Strategy and Command*: Map I with the Pearl Harbor track inset,
    Map 9 (National Defense Zone) and Map 14 (Progress and Prospects, 31
    December 1943);
  - Smith, *Approach to the Philippines* Map 1 (12 March 1944);
  - Smith, *Triumph in the Philippines* Map 1 (15 December 1944);
  - Appleman et al., *Okinawa* Map 1 (March 1945);
  - Milner, *Victory in Papua* Map 3 (1 August 1942, command areas only).

  I downloaded Cannon, *Leyte* Map 2 and Romanus and Sunderland Map 17
  (China, 15 March 1944) but did not examine them.
- **Routes** rest on:
  - JM-97 (orders);
  - the Nagumo report's track chart, the CINCPAC and ComCruPac reports, and
    the ONI Combat Narratives for Midway and Guadalcanal;
  - USSBS *Campaigns* (text and list of plates);
  - Doolittle's report: take-off "at Latitude 35° 43′N Longitude 153° 25′E
    approximately 824 statute miles East of the center of Tokyo" [all O].
- **Extent and distortion** I computed in `r3-scripts/extent.py`, with the
  spherical AEQD formulas R1 used.
- **Clocks**: the IANA tz database (2026e, installed locally) for historical
  offsets. It is tertiary, and its pre-1970 Pacific entries are approximate.

---

## 2. The eras

Eight keyframes: a prologue and seven chapters. Each keyframe is the date
the table's front shows. For every keyframe from July 1943 on, the Atlas has
a map on that exact date. The earlier ones match a dated Green Book map.

**Prologue: start the cards in 1931, start the map at the eve of
war.** My recommendation:

- The prologue's first card is the Mukden Incident (18 September 1931).
- Its front keyframe is 6 December 1941.
- An optional sub-keyframe is October 1938, after Wuhan and Canton fell, when
  the China front settled into roughly the line it kept until 1944.

The reasons:

- **The start date is contested.** East Asian readers date the war from 1931:
  Japan's historians speak of a 十五年戦争 *jūgonen sensō*, "Fifteen Years'
  War", and China's school textbooks now teach a "fourteen-year" war from
  1931 (*verify* both). The US telling starts at Pearl Harbor.
- **Cards from 1931 respect the Asian telling, and the map from 1941 respects
  the brief.** Manchukuo and Nanjing explain why the oil was cut off.
- **The China map is costly.** Its front from 1937 to 1941 would mean
  digitising a land war the app does not otherwise draw. Two prologue
  keyframes would double that work for little gain at Pacific scale.

| id | label | keyframe date | span (from → to) | what the table shows | what happens |
| --- | --- | --- | --- | --- | --- |
| `prologue` | the long war in China | 1941-12-06 | 1931-09-18 → 1941-12-06 | Japan's empire on the eve: Home Islands, Karafuto south of 50° N, the Kurils, Korea, Taiwan, Kwantung, Manchukuo and Mengjiang, occupied China (north China plain, the Yangtze to Yichang, Canton and the coast enclaves, Hainan), French Indochina garrisoned by treaty, the South Seas Mandate. At sea: the Kidō Butai north of the Pacific; the Malaya convoys from Hainan and Cam Ranh; the Philippine force at Formosa and Palau. | Mukden, Manchukuo, the Marco Polo Bridge, Shanghai, Nanjing, Nomonhan, Indochina, the embargo, the Hull note, the Imperial conference, the Kidō Butai sails |
| `first-six-months` | the first six months | 1942-05-08 | 1941-12-07 → 1942-05-31 | The high tide in the south: the Philippines (Corregidor fell 6 May), Malaya, Singapore, Burma to the Chindwin, the Indies, Timor, the Andamans, Rabaul, Lae and Salamaua, Tulagi, the Gilberts, Wake, Guam. The Coral Sea carriers. | Pearl Harbor and the first day's attacks on Malaya, Hong Kong, the Philippines, Guam and Wake; Force Z; Singapore; the Java Sea; Darwin; the Indian Ocean raid; Bataan; Doolittle; Coral Sea; Sydney Harbour |
| `turn` | the turn | 1942-09-15 | 1942-06-01 → 1943-02-09 | Japan's greatest extent ashore: Attu and Kiska, Nauru and Banaba, Tarawa garrisoned, the Kokoda Track to Ioribaiwa, Guadalcanal contested around the Lunga perimeter. The carrier fleets in the Solomons. | Midway, the Aleutians, Guadalcanal and its sea battles, Kokoda, Milne Bay, Buna–Gona, the Tokyo Express, the evacuation |
| `ladder` | up the Solomons and New Guinea | 1943-11-01 | 1943-02-10 → 1943-11-19 | Guadalcanal, the Russells and New Georgia taken; Lae, Salamaua and Finschhafen taken; Attu retaken and Kiska empty; the Bougainville landing that day. The Absolute National Defence Zone drawn as a dashed historical line. | Bismarck Sea, Komandorski, Yamamoto, Attu, Nauruans deported, New Georgia, Kiska, Lae, the Burma railway finished, Bougainville, Rabaul raids |
| `central-pacific` | across the Central Pacific | 1944-08-15 | 1943-11-20 → 1944-09-14 | The Gilberts, Marshalls and Marianas taken, with bypassed atolls and Truk cut off; New Guinea taken from Hollandia to Sansapor, Wewak and Rabaul cut off; Imphal repulsed; the Ichi-Go corridor driving south in China. | Tarawa, Kwajalein, Truk, Imphal and Kohima, Hollandia, Ichi-Go, Yawata, Saipan, the Philippine Sea, Guam, Tinian, Tsushima Maru, hell ships |
| `return` | the return to the Philippines | 1945-01-15 | 1944-09-15 → 1945-02-18 | Peleliu, Ulithi, Morotai, Leyte, Mindoro and the Lingayen beachhead; the Ichi-Go corridor joined to Indochina; the British across the Chindwin. | Peleliu, the Naha raid, Leyte, Leyte Gulf (Surigao, Samar, Engaño), the first tokkō, Shinano, the first Tokyo B-29 raid, Lingayen, Manila |
| `approaches` | the approaches to Japan | 1945-07-01 | 1945-02-19 → 1945-07-25 | Iwo Jima and Okinawa taken; Luzon cleared but for the northern pocket; the southern Philippines; Borneo beachheads; Rangoon retaken; Japanese withdrawal in Guangxi; Indochina seized outright by Japan (9 March). The B-29 lanes from the Marianas. | Iwo Jima, the Tokyo fire raid, mining, Kerama, Okinawa, Ten-Gō, Himeyuri, Burma, Borneo, Sandakan |
| `end` | the end of the war | 1945-09-02 | 1945-07-26 → 1945-09-02 | No front: General Order No. 1's surrender zones, the Soviet advance in Manchuria, Korea to the 38th parallel, Karafuto and the Kurils; the Allied fleet in Tokyo Bay. | Potsdam, Indianapolis, Hiroshima, the Soviet entry, Nagasaki, the broadcast, Shumshu, Ocean Island, the surrender |

`eras.json` drafts in the Hawaiian form: `id`, `label`, `year`,
`yearPrecision` becomes `date` with `precision: "day"`, `note`, `sources`.
The keyframe sources are named in §5.

### 2.1 Vocabularies proposed for `events.json`

**kind** (one value per event; a card can list sub-stops of other kinds):

| kind | meaning | playable? |
| --- | --- | --- |
| `battle` | a fight between armed forces at sea, in the air or ashore, with a beginning and an end | if at sea or in the air between combatants: `box` candidate; ashore: `view` at most |
| `campaign` | a long span made of many fights (Guadalcanal, Burma, Ichi-Go); drawn as a span and a region | `cards` (stops may be boxes) |
| `landing` | an amphibious assault, its first day or days | `view` at most |
| `raid` | a strike by ships or aircraft on a base, airfield or fleet in harbour | `box` candidate if the targets are combatants |
| `siege` | a garrison besieged (Wake, Bataan, Corregidor, Imphal) | `cards` (Wake's coastal battle a `box` candidate) |
| `sinking` | one ship's loss told on its own card | `cards`; a submarine attack on a warship may be a later `box` |
| `occupation` | a place taken without battle, or the start of an occupation | `cards` |
| `surrender` | a formal capitulation | `cards` |
| `political` | declarations, treaties, orders, conferences, broadcasts | `cards` |
| `bombing` | bombing of cities and their people | **never playable** |
| `atrocity` | massacres, death marches, executions, the comfort system, Unit 731 | **never playable** |
| `captivity` | POW camps, hell ships, the railway, internment of civilians | **never playable** |
| `people` | events as the islands' peoples lived them: removals, deportations, forced labour, scouts, carriers | **never playable** |
| `other` | anything else (supply runs, airlifts, mining, the tokkō system, breakouts) | `cards` |

**flag**: `box` (a battle box with a sortie candidate), `view` (a battle box
the record plays, with no sortie) or `cards` (pins and cards only). The tone
rule in the brief (BRIEF §2) fixes these: the kinds marked never playable are
always `cards`, and tokkō is never a role.

**sides** codes: `jp`, `us`, `uk` (the British Empire forces of the UK), `in`
(the Indian Army), `au`, `nz`, `ca`, `nl` (the Netherlands and KNIL), `cn`
(the Republic of China), `ph` (the Philippine Commonwealth and guerrillas),
`th`, `fr` (Vichy Indochina), `su`, `mn`, `ina` (the Indian National Army),
`mk` (Manchukuo). For peoples and civilians the codes name the people:
`chamorro`, `refaluwasch` (Carolinian), `nauruan`, `banaban`, `i-kiribati`,
`marshallese`, `chuukese`, `palauan`, `solomon-islanders`, `papuan`,
`bougainvillean`, `okinawan`, `unangax`, `korean`, `chinese-civ`,
`filipino-civ`, `japanese-civ`, `japanese-am`, `japanese-ca`, `romusha`.
The code is a key into a names table, so each card can say "Chamorro" rather
than a code.

**place precision** (the Hawaiian vocabulary does not fit): `ex` exact (3 km
or less), `loc` locality (25 km or less), `isl` island or atoll, `reg` region
(a province or archipelago), `sea` (a sea area) and `off` (off the table). An
`off` place is drawn as an edge marker pointing toward the place, as the
Hawaiian `kahiki` marker is. Off-table places in this list:
Washington, Berlin, Potsdam, the US West Coast, British Columbia, Funter Bay.

**tier**: `1` core, `2` optional.

---

## 3. The events

Dates are the **local civil date of the place**. Where the Japanese (Tokyo)
date differs, it is given too. Source keys (`chron42`, `ussbs-camp`, …) are
defined with their URLs in §9. Each summary is a present-tense draft in the
Hawaiian app's voice. Summaries carry dates but no counts: casualty and ship
counts go to `tellings`, each with its source, as the Hawaiian check
enforces. Each draft still has to pass that check. Unit names (25th Army), aircraft and hull designations (B-29, PT-109, I-58), times of day and spelled-out structural words ("two waves", "three forces") remain; the check should allow them or they should be reworded.

Coordinates marked [O] are positions the chronology prints (for example
"Kaga (30°20′N, 179°17′W)"). [W] are Wikidata coordinates. Unmarked ones are
my own placement of a named place (*verify* against GNIS or GeoNames before
use).

### 3.1 Prologue (1931 – 6 December 1941)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `mukden-1931` | 1 | The Mukden Incident | 柳条湖事件 Ryūjōko jiken; the war after it 満洲事変 Manshū jihen | 1931-09-18 (day) | Liutiao Lake, Mukden (Shenyang) 41.835, 123.466; ex [W] | political | jp, cn | cards | morton-sc ch. II *verify*; wd Q242099 |
| `manchukuo-1932` | 2 | Manchukuo proclaimed | 満洲国 Manshūkoku | 1932-03-01 (day) *verify* | Hsinking (Changchun) 43.883, 125.317; loc [W] | political | jp, mk, cn | cards | morton-sc *verify* |
| `marco-polo-1937` | 1 | The Marco Polo Bridge Incident | 盧溝橋事件 Rokōkyō jiken; the war after it 支那事変 Shina jihen (Japanese official name then) | 1937-07-07 → 07-09 (day) | Lugou Bridge 39.849, 116.213; ex [W] | political | jp, cn | cards | morton-sc *verify*; wd |
| `shanghai-1937` | 1 | The Battle of Shanghai | 第二次上海事変 Dai-niji Shanhai jihen | 1937-08-13 → 11-26 (day) [W] | Shanghai 31.232, 121.469; loc [W] | battle | jp, cn | cards | wd; *verify* in a Chinese or Japanese history |
| `nanjing-1937` | 1 | Nanjing | 南京事件 Nankin jiken | 1937-12-13 → 1938-02 (month) | Nanjing 32.038, 118.738; loc [W] | atrocity | jp, chinese-civ, cn | cards | wd; tellings needed (IMTFE judgment, Nanjing tribunal, Japanese and Chinese historians) |
| `panay-1937` | 2 | The Panay incident | パナイ号事件 Panai-gō jiken | 1937-12-12 (day) | Yangtze above Nanjing 31.687, 118.437; loc [W] | sinking | jp, us | cards | wd; *verify* |
| `chongqing-1938` | 2 | The bombing of Chongqing | 重慶爆撃 Jūkei bakugeki | 1938-02-18 → 1943-08-23 (day) [W] | Chongqing 29.481, 106.938; loc [W] | bombing | jp, chinese-civ | cards | wd; *verify* |
| `nomonhan-1939` | 1 | Nomonhan (Khalkhin Gol) | ノモンハン事件 Nomonhan jiken | 1939-05-11 → 09-16 (day) [W] | Khalkhin Gol 47.730, 118.590; loc [W] | battle | jp, mk, su, mn | cards | wd; *verify* |
| `indochina-1940` | 1 | Japanese troops enter French Indochina | 北部仏印進駐 Hokubu Futsuin shinchū (1940); 南部仏印進駐 Nanbu Futsuin shinchū (1941) | 1940-09-22 → 1941-07-29 (day) | Haiphong 20.86, 106.68 (north); Saigon 10.78, 106.70 (south); reg | occupation | jp, fr | cards | wd Q140025; morton-sc *verify* |
| `tripartite-1940` | 2 | The Tripartite Pact | 日独伊三国同盟 Nichi-Doku-I sangoku dōmei | 1940-09-27 (day) [W] | Berlin; off (pin at Tokyo 35.685, 139.753) | political | jp | cards | wd |
| `embargo-1941` | 1 | Assets frozen, oil cut off | 対日石油禁輸 tai-Nichi sekiyu kinyu *verify* | 1941-07-26 → 08-01 (day) *verify* | Washington; off | political | us, uk, nl, jp | cards | morton-sc *verify* |
| `hull-note-1941` | 1 | The Hull note and the decision for war | ハル・ノート Haru nōto; 御前会議 gozen kaigi (1 Dec) | 1941-11-26 → 12-01 (day) | Washington (off); Imperial Palace, Tokyo 35.685, 139.753; ex | political | us, jp | cards | jm97 (Navy Order No. 9, 1 Dec) [O]; wd |
| `kido-butai-sails-1941` | 1 | The Kidō Butai sails from Hitokappu Bay | 機動部隊 単冠湾出撃 Kidō Butai Hitokappu-wan shutsugeki | 1941-11-26 06:00 JST (day) | Hitokappu Bay, Etorofu (Iturup) 44.9, 147.6; loc *verify* | other | jp | cards (route) | ussbs-camp ch. II [O]; jm97 [O] |

Core 8: `mukden-1931`, `marco-polo-1937`, `shanghai-1937`, `nanjing-1937`,
`nomonhan-1939`, `indochina-1940`, `embargo-1941` (merge `hull-note-1941`
into it if eight is a hard limit) and `kido-butai-sails-1941`.

- `mukden-1931`: Officers of Japan's Kwantung Army set off a charge on the South Manchuria Railway outside Mukden and blame Chinese troops. The army uses it to occupy all of Manchuria within months, ahead of orders from Tokyo. Many Chinese and Japanese historians date the war from this night.
- `manchukuo-1932`: Japan proclaims the state of Manchukuo, with Puyi, the last Qing emperor, at its head and the Kwantung Army behind him. The League of Nations' Lytton Commission will not recognise it, and Japan leaves the League.
- `marco-polo-1937`: A night exercise beside the Marco Polo Bridge outside Peking ends in shooting between Japanese and Chinese troops. Neither government backs down, and within weeks the two countries are at war in all but name. Japan calls it the China Incident.
- `shanghai-1937`: Chiang Kai-shek commits his best divisions to Shanghai and fights for the city street by street through the autumn. A Japanese landing at Hangzhou Bay outflanks the Chinese line in November, and the road to Nanjing lies open.
- `nanjing-1937`: Japanese troops take the Chinese capital and, over the following weeks, kill prisoners of war and civilians and commit mass rape. Foreign residents run a Safety Zone and record what they see. The number of dead is disputed between tribunals and historians, and every figure on this card says whose it is.
- `panay-1937`: Japanese naval aircraft bomb and sink the US gunboat Panay and the Standard Oil tankers she escorts on the Yangtze above Nanjing. Japan apologises and pays an indemnity, and the crisis passes.
- `chongqing-1938`: China's government retreats up the Yangtze to Chongqing, and Japanese bombers attack the city season after season, whenever the fog lifts. Its people dig shelters into the hills.
- `nomonhan-1939`: A border quarrel between Manchukuo and Mongolia becomes a summer of fighting with Soviet and Mongolian forces under Georgy Zhukov, who encircles the Japanese in August. The defeat turns Japan's planners away from war in the north and toward the south.
- `indochina-1940`: With France defeated in Europe, Japan presses Vichy's colonial government to admit its troops, first into Tonkin and then, in July 1941, into the south. Airfields near Saigon put Malaya and Singapore within reach of Japanese bombers.
- `tripartite-1940`: Japan joins Germany and Italy in a pact of mutual support aimed at keeping the United States out of their wars.
- `embargo-1941`: The United States answers the move into southern Indochina by freezing Japanese assets and stopping oil; Britain and the Netherlands Indies follow. Japan's navy counts its oil in months, and its choice narrows to a settlement or the oilfields of the Indies.
- `hull-note-1941`: Secretary of State Cordell Hull hands Japan's envoys a proposal that includes withdrawal from China. Tokyo reads it as an ultimatum, and an Imperial conference on 1 December decides for war.
- `kido-butai-sails-1941`: The Kidō Butai's carriers and their escorts leave Hitokappu Bay in the Kurils and steam east across the empty northern Pacific under radio silence. If the talks in Washington succeed, they are to turn back.

### 3.2 The first six months (7 December 1941 – 31 May 1942)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pearl-harbor-1941` | 1 | The attack on Pearl Harbor | 真珠湾攻撃 Shinjuwan kōgeki (ハワイ作戦 Hawai sakusen) | 1941-12-07 HST; 12-08 JST (day) | Pearl Harbor 21.365, −157.950; ex [W] | raid | jp, us | box (defence only: open decision) | chron41 7 Dec [O]; ussbs-camp ch. II [O] |
| `malaya-1941` | 1 | The landings in Malaya and southern Thailand | マレー作戦 Marē sakusen (マレー上陸作戦) | 1941-12-08 local (day); campaign to 1942-01-31 [W] | Kota Bharu 6.13, 102.24 [O]; Singora 7.20, 100.60; Patani 6.87, 101.25; loc | landing | jp, uk, in, au, th | view | chron41 8 Dec [O]; ussbs-camp ch. III [O] |
| `hong-kong-1941` | 1 | The battle of Hong Kong | 香港の戦い Honkon no tatakai (香港攻略戦 *verify*) | 1941-12-08 → 12-25 (day) [W] | Hong Kong 22.28, 114.16; loc [W] | siege | jp, uk, ca, in | cards | wd; *verify* in Kirby (UK official history) |
| `clark-field-1941` | 2 | Clark Field | クラーク・フィールド空襲 *verify* | 1941-12-08 local (day) | Clark Field 15.19, 120.56; ex | raid | jp, us | cards (box later: the P-40 defence) | chron41 8 Dec [O]; morton-pi ch. V [O, index] |
| `guam-1941` | 1 | Guam taken | グアムの戦い Guamu no tatakai; renamed 大宮島 Ōmiya-jima | 1941-12-08 → 12-10 (day) [O] | Hagåtña (Agana) 13.476, 144.750; ex | occupation | jp, us, chamorro | cards | chron41 8, 10 Dec [O]; wp Japanese occupation of Guam [W] |
| `wake-1941` | 1 | The siege of Wake | ウェーク島の戦い Wēku-tō no tatakai | 1941-12-08 → 12-23 (day) [O] | Wake 19.29, 166.60; isl [W] | siege | jp, us | box (11 Dec: the coastal guns and Wildcats against the first landing) | chron41 8, 23 Dec [O] |
| `force-z-1941` | 1 | Prince of Wales and Repulse sunk | マレー沖海戦 Marē-oki kaisen | 1941-12-10 (day) | off Kuantan 3.56, 104.48; sea [W] | battle | jp, uk | box (later: G3M/G4M against capital ships, or the ships' AA) | ussbs-camp ch. III [O]; wd |
| `lingayen-1941` | 2 | The main landings on Luzon | リンガエン湾上陸 Ringaen-wan jōriku | 1941-12-22 (day) [O] | Lingayen Gulf 16.10, 120.30; loc | landing | jp, us, ph | view | chron41 22 Dec [O]; morton-pi maps 3–4 |
| `rabaul-1942` | 1 | Rabaul taken | ラバウルの戦い Rabauru no tatakai | 1942-01-23 (day) [O] | Rabaul 4.198, 152.168; ex [W] | landing | jp, au | cards | chron42 23 Jan [O] |
| `bataan-1942` | 1 | The siege of Bataan | バターンの戦い Batān no tatakai | 1942-01-07 → 04-09 (day) [W][O] | Bataan 14.67, 120.42; reg [W] | siege | jp, us, ph | cards | chron42 9 Apr [O]; morton-pi [O, index] |
| `singapore-1942` | 1 | The fall of Singapore | シンガポールの戦い Shingapōru no tatakai | 1942-02-08 → 02-15 (day) [W][O] | Bukit Timah 1.35, 103.77; loc [W] | battle | jp, uk, au, in | cards | chron42 15 Feb [O]; wd |
| `sook-ching-1942` | 1 | Sook Ching | シンガポール華僑粛清事件 Shingapōru kakyō shukusei jiken | 1942-02-18 → 03-04 (day) [W] | Singapore 1.29, 103.85; loc | atrocity | jp, chinese-civ | cards | wd; tellings needed |
| `darwin-1942` | 1 | The bombing of Darwin | ダーウィン空襲 Dāwin kūshū | 1942-02-19 (day) [O] | Darwin 12.47, 130.85; ex [W]; Peary sunk 12.50, 130.83 [O] | raid | jp, au, us | cards (R8: a defence box?) | chron42 19 Feb [O]; awm *verify* |
| `java-sea-1942` | 1 | The battle of the Java Sea | スラバヤ沖海戦 Surabaya-oki kaisen | 1942-02-27 → 03-01 (day) [O] | Java Sea north of Surabaya 6.0, 112.5; sea | battle | jp, nl, uk, us, au | box (candidate: day gunnery, night torpedoes) | chron42 27–28 Feb, 1 Mar [O]; oni Java narrative (HyperWar, listed) |
| `sunda-strait-1942` | 2 | Houston and Perth in the Sunda Strait | バタビア沖海戦 Batabia-oki kaisen | 1942-02-28 → 03-01 night (day) [W] | Sunda Strait off St Nicholas Point 5.85, 106.0; sea *verify* | battle | jp, us, au | box (candidate) | wd; *verify* |
| `java-surrender-1942` | 1 | The Indies capitulate | 蘭印作戦 Ran'in sakusen; カリジャティ会談 Karijati kaidan *verify* | 1942-03-08 → 03-09 (day) [W] | Kalijati 6.53, 107.66; loc *verify* | surrender | jp, nl | cards | wd (campaign 1941-12-08 → 1942-03-09); cmh-camp East Indies |
| `andamans-1942` | 2 | The Andamans occupied | 日本軍によるアンダマン・ニコバル諸島の占領 | 1942-03-23 (day) [W] | Port Blair 11.62, 92.73; ex | occupation | jp, uk | cards | wp Indian Ocean raid [W] |
| `burma-1942` | 1 | The conquest of Burma | ビルマ攻略作戦 Biruma kōryaku sakusen *verify* (日本軍のビルマ侵攻) | 1941-12-14 → 1942-05-26 (day); US Army campaign 7 Dec 1941 – 26 May 1942 [O] | Rangoon 16.80, 96.16; reg | campaign | jp, uk, in, cn | cards | cmh-camp Burma 1942 [O, title]; romanus-1 maps 3–4 |
| `indian-ocean-raid-1942` | 1 | The Indian Ocean raid | セイロン沖海戦 Seiron-oki kaisen (C作戦 C sakusen) | raids 1942-04-05 and 04-09; the cruise 03-26 → 04-22 (day) [O][W] | Colombo 6.93, 79.85; Trincomalee 8.57, 81.23; ex | raid | jp, uk | box (candidate: the dive on Cornwall, Dorsetshire or Hermes) | chron42 5, 9 Apr [O]; ussbs-camp app. 11; wp [W] |
| `bataan-march-1942` | 1 | The Bataan Death March | バターン死の行進 Batān shi no kōshin | 1942-04-10 → 04 (month) | Mariveles 14.43, 120.49 → San Fernando 15.03, 120.69 → Camp O'Donnell 15.36, 120.53; loc | atrocity | jp, us, ph, filipino-civ | cards | morton-pi ch. XXIV *verify*; wd |
| `doolittle-1942` | 1 | The Doolittle raid | ドーリットル空襲 Dōrittoru kūshū | 1942-04-18 (day; same date both sides) | take-off 35.717, 153.417 [O]; Tokyo 35.68, 139.77; ex | raid | us, jp | view (the take-off from Hornet; never the bombing) | doolittle [O]; chron42 18 Apr [O] |
| `corregidor-1942` | 1 | Corregidor falls | コレヒドールの戦い Korehidōru no tatakai | 1942-05-05 → 05-06 (day) [O] | Corregidor 14.385, 120.574; ex | siege | jp, us, ph | cards | chron42 6 May [O]; morton-pi map 25 |
| `coral-sea-1942` | 1 | The battle of the Coral Sea | 珊瑚海海戦 Sangokai kaisen (MO作戦 MO sakusen) | 1942-05-04 → 05-08 (day) [O] | Shōhō sunk 10.48, 152.92 (7 May) [O]; carriers hit 14.58, 155.25 (8 May) [O]; sea | battle | jp, us, au | box (candidate) | chron42 2–8 May [O]; ussbs-camp ch. IV [O]; nwc-coral [R2] |
| `zhejiang-jiangxi-1942` | 1 | The Zhejiang–Jiangxi campaign | 浙贛作戦 Sekkan sakusen | 1942-05-15 → 09-06 (day) [W] | Quzhou (Chuchow) 28.97, 118.87; reg | campaign | jp, cn, chinese-civ | cards | wd; doolittle (Chuchow) [O]; tellings needed |
| `sydney-harbour-1942` | 1 | Midget submarines in Sydney Harbour | 特殊潜航艇によるシドニー港攻撃 | 1942-05-31 → 06-01; shelling 06-08 (day) [O][W] | Sydney Harbour 33.858, 151.233; ex [W] | raid | jp, au, us | cards | chron42 31 May [O]; awm *verify* |

- `pearl-harbor-1941`: Two waves of carrier aircraft strike the Pacific Fleet at its moorings and the airfields of Oʻahu on a Sunday morning. The battleships along Ford Island are sunk or wrecked; the carriers are at sea and escape. Japan's note breaking off the talks is handed over in Washington after the bombs have fallen.
- `malaya-1941`: Japanese troops land at Kota Bharu in British Malaya and at Singora and Patani in southern Thailand in the first hours of 8 December; the shooting at Kota Bharu begins before the bombs fall on Pearl Harbor. From the Thai beaches the 25th Army drives down the peninsula toward Singapore, much of it by bicycle.
- `hong-kong-1941`: The 23rd Army crosses from the mainland, takes the Kowloon peninsula and lands on Hong Kong Island. British, Canadian, Indian and local volunteer units fight on until the governor surrenders on Christmas Day.
- `clark-field-1941`: Hours after the news from Hawaiʻi, naval bombers from Formosa catch the Far East Air Force's B-17s and P-40s on the ground at Clark Field and Iba. Much of the American air strength in the Philippines is lost in one raid.
- `guam-1941`: Aircraft from Saipan bomb Guam on 8 December, and the South Seas Detachment lands on the 10th. The naval governor surrenders the island, which Japan renames Ōmiya-jima, Great Shrine Island. For the Chamorro people, the occupation begins.
- `wake-1941`: Bombers from the Marshalls strike Wake's airfield on 8 December. On the 11th the Marines' coastal guns and their last Wildcats turn back the first landing and sink destroyers. The Japanese return with carriers detached from the Pearl Harbor force, and Wake falls on 23 December.
- `force-z-1941`: Naval bombers from airfields near Saigon find the battleship Prince of Wales and the battlecruiser Repulse off Kuantan without fighter cover and sink both with torpedoes and bombs. Capital ships under way at sea have not been sunk by aircraft alone before.
- `lingayen-1941`: The 14th Army's main force lands on Lingayen Gulf and drives south down the central plain. MacArthur declares Manila an open city and falls back to the Bataan peninsula and Corregidor.
- `rabaul-1942`: The South Seas Detachment overwhelms Rabaul's small Australian garrison. The harbour and its airfields become Japan's great base in the South Pacific and stay Japanese until the surrender.
- `bataan-1942`: American and Filipino troops, short of food and quinine, hold the Bataan peninsula through the dry season. The Japanese break the last line in April, and on 9 April the Luzon Force surrenders.
- `singapore-1942`: The 25th Army crosses the Johor Strait by night and fights its way to the reservoirs that water the city. On 15 February Lieutenant-General Percival surrenders Singapore, Britain's fortress in the East.
- `sook-ching-1942`: The Japanese military police screen Singapore's Chinese men at registration points and take those they suspect to beaches and other places to be shot. The name, Sook Ching, means purge through cleansing. The number of dead is disputed and is given only in tellings.
- `darwin-1942`: Aircraft from carriers of the force that struck Pearl Harbor, with land-based bombers, attack Darwin's harbour and airfields. Ships at the wharf and in the harbour are sunk, the town is wrecked, and many residents leave for the south. It is the first of many raids on northern Australia.
- `java-sea-1942`: Rear Admiral Karel Doorman leads the Allied striking force of cruisers and destroyers against the convoy carrying the invasion of eastern Java. Japanese cruisers outrange them by day and their long-range torpedoes strike at night; Doorman goes down with his flagship De Ruyter.
- `sunda-strait-1942`: Escaping from the Java Sea, the cruisers Houston and HMAS Perth run into the Japanese landing in Bantam Bay at night and fight among the transports until both are sunk.
- `java-surrender-1942`: At Kalijati airfield the Dutch governor-general and army commander accept the 16th Army's terms, and the Netherlands Indies capitulate. Sukarno and Hatta, released from Dutch exile, later work with the occupation while pressing for independence.
- `andamans-1942`: Japanese naval forces occupy Port Blair in the Andaman Islands, giving Japan the Andaman Sea and the sea road to Rangoon.
- `burma-1942`: The 15th Army crosses from Thailand, takes Moulmein and Rangoon, and drives the British, Indian, Burmese and Chinese forces north. The Burma Road to China is cut. The retreat ends at the Indian border in May with the monsoon, and refugees walk out beside the army.
- `indian-ocean-raid-1942`: The Kidō Butai sails from Staring Bay in Celebes into the Indian Ocean and strikes Colombo on Easter Sunday and Trincomalee four days later. Its dive bombers sink the cruisers Cornwall and Dorsetshire and the carrier Hermes. The British Eastern Fleet withdraws to East Africa, and the carriers pass Singapore homeward.
- `bataan-march-1942`: The surrendered troops are marched north from Mariveles to San Fernando, carried by rail to Capas, and walked on to Camp O'Donnell. Many die on the road and in the camp of exhaustion, disease and beatings, and Filipino civilians who give them food are punished. The tellings differ on the numbers, and each is given with its source.
- `doolittle-1942`: Army B-25 bombers take off from the carrier Hornet far out in the Pacific, earlier than planned after a picket boat sights the task force. They bomb Tokyo, Yokohama, Yokosuka, Nagoya and Kobe and fly on to China, where most crews bail out in the dark; one crew lands near Vladivostok and is interned. The raid does little damage but settles Japan's argument over striking at Midway.
- `corregidor-1942`: After weeks of shelling from Bataan, Japanese troops land on Corregidor at night. General Wainwright surrenders the fortress islands of Manila Bay on 6 May, and the forces in the rest of the Philippines over the following days.
- `coral-sea-1942`: Japan sends an invasion convoy for Port Moresby round the tip of New Guinea, covered by carriers. American aircraft sink the light carrier Shōhō on 7 May, and on the 8th the two carrier forces strike each other without their ships ever coming in sight. Lexington is lost and Shōkaku is damaged, and the convoy turns back.
- `zhejiang-jiangxi-1942`: Japan sends armies into Zhejiang and Jiangxi to destroy the airfields the raiders were meant to land on and to punish the places that sheltered them. Villages that helped the airmen are burned, and Chinese sources record killings and the spread of disease, including from biological weapons (*verify*). The toll is disputed and is given only in tellings.
- `sydney-harbour-1942`: Midget submarines launched from larger submarines off the coast slip into Sydney Harbour at night. A torpedo meant for the cruiser Chicago sinks the depot ship Kuttabul with sailors asleep aboard. A week later submarines shell the eastern suburbs of Sydney and Newcastle.

### 3.3 The turn (1 June 1942 – 9 February 1943)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `dutch-harbor-1942` | 2 | Dutch Harbor raided | ダッチハーバー空襲 *verify* (AL作戦 AL sakusen) | 1942-06-03 → 06-04 (day; W. long. dates [O]) | Dutch Harbor 53.89, −166.54; ex [W] | raid | jp, us | box (later) | chron42 3–5 Jun [O]; ussbs-camp ch. VI [O] |
| `midway-1942` | 1 | The battle of Midway | ミッドウェー海戦 Middowē kaisen (MI作戦 MI sakusen) | 1942-06-04 → 06-07 US dates; 06-05 → 06-08 JST (day) | Kaga sunk 30.33, −179.28; Sōryū 30.63, −179.22; Akagi 30.50, −179.13; Hiryū 31.63, −178.85; Yorktown 30.60, −176.57 [all O]; Midway Atoll 28.21, −177.37; sea | battle | jp, us | **box (v1)** | chron42 4–7 Jun [O]; nagumo [O]; cincpac-mid [O]; crupac-mid [O]; oni-mid [O]; ussbs-camp ch. V [O] |
| `attu-kiska-1942` | 1 | Attu and Kiska occupied | アッツ島・キスカ島占領 *verify*; 日本軍によるキスカ島の占領 [W] | Kiska 1942-06-06, Attu 06-07 (USSBS, zone +10 dates) **or** Attu 06-05, Kiska 06-07 (chron) (day) | Kiska harbour 51.97, 177.50; Chichagof Harbor, Attu 52.93, 173.24; loc | occupation | jp, us, unangax | cards | ussbs-camp ch. VI [O]; chron42 [O] (tellings diverge) |
| `unangax-1942` | 1 | The removal of the Unangax̂ | — | 1942-06 → 1945 (month) | Attu village 52.93, 173.24 (pin); Funter Bay, SE Alaska 58.25, −134.90 (off); Otaru 43.19, 141.00; reg | people | us, jp, unangax | cards | nps-aleu (*verify*: search summary only) |
| `kokoda-1942` | 1 | The Kokoda Track | ポートモレスビー作戦 Pōto Moresubī sakusen | 1942-07-21 → 11-16 (day) [W]; US Army "Papua" 23 Jul 1942 – 23 Jan 1943 [O] | Kokoda 8.88, 147.74 [W]; Ioribaiwa 9.28, 147.43 *verify*; reg | campaign | jp, au, papuan | cards | milner (map list) [O]; awm-mccarthy *verify*; wd |
| `papuan-carriers-1942` | 1 | The carriers of the Owen Stanleys | — (Australian name: "Fuzzy Wuzzy Angels") | 1942-07 → 1943-01 (month) | Kokoda Track 9.0, 147.6; reg | people | papuan, au, jp | cards | wd Q5511096; *verify* in AWM and PNG sources |
| `guadalcanal-1942` | 1 | Guadalcanal | ガダルカナル島の戦い Gadarukanaru-tō no tatakai | 1942-08-07 → 1943-02-09 (day) [W]; US Army 7 Aug 1942 – 21 Feb 1943 [O] | Lunga Point 9.42, 160.05; ex | campaign | us, jp, au, nz, solomon-islanders | view (the landing); campaign `cards` | chron42 7–8 Aug [O]; miller-gc [R2]; cmh-camp [O] |
| `savo-1942` | 1 | The battle of Savo Island | 第一次ソロモン海戦 Dai-ichiji Soromon kaisen | 1942-08-08/09 night (day) [W] | 9.13, 159.82; sea [W] | battle | jp, us, au | box (candidate) | ussbs-camp app. 39 [O, list]; nwc-savo [R2] |
| `vouza-1942` | 1 | Scouts and coastwatchers of the Solomons | — | Vouza captured 1942-08-20 (day) [W]; coastwatchers 1942–43 | Ilu (Tenaru) river 9.42, 160.07; ex | people | solomon-islanders, us, au, uk, jp | cards | wp Jacob C. Vouza [W]; macarthur-1 (plates "Coast Watching Teleradio Stations") *verify* |
| `eastern-solomons-1942` | 2 | The battle of the Eastern Solomons | 第二次ソロモン海戦 Dai-niji Soromon kaisen | 1942-08-24 → 08-25 (day) [W] | 8.39, 162.73; sea [W] | battle | jp, us | box (candidate) | ussbs-camp app. 41 [O, list] |
| `nauru-banaba-1942` | 1 | Nauru and Banaba occupied | ナウル島・オーシャン島占領 *verify* | Nauru 1942-08-25 (chron) / 08-26 (wp lede) / 08-29 (wp narrative); Banaba 08-26 (chron) (day) | Nauru 0.53, 166.93; Banaba −0.86, 169.54; isl | occupation | jp, nauruan, banaban, i-kiribati | cards | chron42 25–26 Aug [O]; wp Japanese occupation of Nauru [W] |
| `milne-bay-1942` | 1 | Milne Bay | ラビの戦い Rabi no tatakai | 1942-08-25/26 → 09-05/07 (day) [O][W] | Milne Bay (Gili Gili) 10.37, 150.34 *verify*; loc | battle | jp, au, us | cards | chron42 26 Aug, 5 Sep [O]; milner map 5 |
| `cape-esperance-1942` | 2 | The battle of Cape Esperance | サボ島沖海戦 Sabo-tō-oki kaisen | 1942-10-11/12 night (day) [O] | Furutaka sunk 9.03, 159.57 [O]; sea | battle | jp, us | box (candidate) | chron42 11–12 Oct [O]; ussbs-camp app. 43 |
| `santa-cruz-1942` | 1 | The battle of the Santa Cruz Islands | 南太平洋海戦 Minami Taiheiyō kaisen | 1942-10-26 (day) | Hornet sunk 8.63, 166.72 [O]; sea | battle | jp, us | box (candidate; brief lists it later) | chron42 27 Oct [O]; ussbs-camp app. 45 |
| `guadalcanal-naval-1942` | 1 | The Naval Battle of Guadalcanal | 第三次ソロモン海戦 Dai-sanji Soromon kaisen | 1942-11-12 → 11-15 (day) | Kirishima sunk 9.17, 159.87 [O]; the first night's action off Lunga ~9.25, 159.95; sea | battle | jp, us | **box (v1: the night of 14–15 Nov)** | chron42 13, 15 Nov [O]; oni-gc [O]; ussbs-camp app. 46–47 [O, list] |
| `buna-gona-1942` | 1 | Buna, Gona and Sanananda | ブナ・ゴナの戦い Buna Gona no tatakai | 1942-11-16 → 1943-01-22 (day) [W] | Buna 8.65, 148.35; loc [W] | battle | jp, au, us, papuan | cards | milner [O, map list]; cmh `USA-A-Papua` |
| `tassafaronga-1942` | 2 | The battle of Tassafaronga | ルンガ沖夜戦 Runga-oki yasen | 1942-11-30 (day) [W] | 9.20, 159.83; sea [W] | battle | jp, us | box (candidate) | ussbs-camp app. 49 [O, list] |
| `tokyo-express-1942` | 1 | The Tokyo Express | 鼠輸送 Nezumi yusō (barges: 蟻輸送 Ari yusō) | 1942-08 → 1943-02 (month) | New Georgia Sound ("the Slot") 8.0, 158.5; sea | other | jp, us | cards (route) | oni-gc [O]; miller-gc [R2]; wd |
| `ke-1943` | 1 | Guadalcanal evacuated | ケ号作戦 Ke-gō sakusen (ガダルカナル島撤収作戦) | 1943-02-01 → 02-07 (day) *verify* (wd gives 01-14 → 02-07) | Cape Esperance 9.25, 159.70; loc | other | jp | cards | wd; jm-98 [R2] |

- `dutch-harbor-1942`: Aircraft from the carriers Ryūjō and Jun'yō bomb the base at Dutch Harbor in the eastern Aleutians on two days of fog and wind, a day ahead of the blow at Midway. A damaged Zero crash-lands on Akutan Island; American sailors find it weeks later nearly intact and fly it to learn its secrets.
- `midway-1942`: Admiral Yamamoto sends the carrier force against Midway to draw out the US Pacific Fleet. Forewarned by codebreakers, the American carriers wait to the north-east. On the morning of 4 June dive bombers from Enterprise and Yorktown catch Kaga, Akagi and Sōryū with aircraft fuelled and armed on deck and set all three ablaze within minutes; Hiryū's strikes cripple Yorktown before Hiryū too is lost.
- `attu-kiska-1942`: A naval landing force occupies Kiska and an army battalion lands on Attu, far out at the western end of the Aleutian chain. On Attu they take the Unangax̂ villagers of Chichagof Harbor and the American couple living among them.
- `unangax-1942`: After the raids the US government removes the Unangax̂ of the Pribilof Islands and the Aleutian villages to abandoned canneries and camps in Southeast Alaska, where many die of disease in the cold and crowding. The Attuans taken by Japan are shipped to Otaru in Hokkaido in September 1942 and held there until the war ends; they are not allowed home to Attu.
- `kokoda-1942`: Japanese troops land at Buna and Gona and climb the Kokoda Track over the Owen Stanley Range toward Port Moresby. Australian militia and then AIF battalions fall back through the rainforest until, at Ioribaiwa close to Port Moresby, the Japanese are ordered to withdraw. The Australians follow them back over the range to the beaches.
- `papuan-carriers-1942`: Papuan men, many conscripted by the Australian administration, carry food and ammunition up the track and carry the wounded down on stretchers. Australian soldiers call them the Fuzzy Wuzzy Angels; the carriers' own accounts were written down much later. The Japanese also press local men into carrying for them.
- `guadalcanal-1942`: US Marines land on Guadalcanal and Tulagi and seize the airfield the Japanese are building at Lunga. For six months both sides feed men, ships and aircraft into the island; the Marines hold the airfield, named Henderson Field, through night bombardments and repeated attacks. Japanese soldiers come to call Guadalcanal 餓島 Gatō, starvation island (*verify*).
- `savo-1942`: Vice Admiral Mikawa's cruisers come down from Rabaul and pass Savo Island in the dark, unseen by the picket destroyers. In a short night action they sink the heavy cruisers Quincy, Vincennes, Astoria and HMAS Canberra, and leave before dawn without touching the transports.
- `vouza-1942`: Solomon Islanders scout and guide for the Marines, and island networks shelter the coastwatchers who radio warning of each Japanese air raid coming down the Slot. Sergeant Major Jacob Vouza, captured and bayoneted by the Ichiki detachment, frees himself and crawls back to warn the Marines on the Ilu river before the attack that night.
- `eastern-solomons-1942`: Japanese carriers cover a reinforcement convoy for Guadalcanal. Aircraft from Saratoga sink the light carrier Ryūjō, and Japanese dive bombers hit Enterprise; the convoy turns back after aircraft from Henderson Field attack it.
- `nauru-banaba-1942`: Japanese naval forces occupy the phosphate islands of Nauru and Banaba (Ocean Island), cut off since the evacuations of early 1942. Nauruans build airfields under forced labour; Banabans are later deported to Nauru, Tarawa and Kosrae (*verify*).
- `milne-bay-1942`: Japanese naval troops land at Milne Bay, at the eastern tip of New Guinea, to take the airfields being built there. Australian infantry, with RAAF Kittyhawks flying from those same strips, throw them back in two weeks of rain and mud, and the survivors are taken off by sea.
- `cape-esperance-1942`: A US cruiser force under Rear Admiral Scott surprises Japanese cruisers coming to shell Henderson Field off Cape Esperance at night. The cruiser Furutaka and a destroyer are sunk, and Admiral Gotō is mortally wounded on his bridge.
- `santa-cruz-1942`: The carriers meet again north of the Santa Cruz Islands. Japanese aircraft sink Hornet and damage Enterprise; American aircraft wreck the flight decks of Shōkaku and Zuihō. Japan wins the exchange of ships but loses many of its veteran aircrews.
- `guadalcanal-naval-1942`: Japan sends battleships to shell Henderson Field ahead of a great troop convoy. On the night of 12–13 November US cruisers and destroyers meet Hiei and Kirishima at point-blank range; Hiei is crippled and sunk next day, and Admirals Callaghan and Scott are killed. Two nights later the battleships Washington and South Dakota meet Kirishima north of Savo, and Washington's radar-directed guns wreck her.
- `buna-gona-1942`: Australian and American troops attack the Japanese beachheads at Buna, Gona and Sanananda, dug in among swamps and coconut groves. Disease strikes both sides. The last beachhead falls in January 1943.
- `tassafaronga-1942`: Rear Admiral Tanaka's destroyers, carrying drums of supplies for Guadalcanal, are caught by a stronger US cruiser force. They answer with spreads of torpedoes that sink Northampton and wreck other cruisers.
- `tokyo-express-1942`: Japanese destroyers run troops and supplies down the Slot from the Shortlands by night and are gone before dawn, out of reach of the aircraft at Henderson Field. Americans call it the Tokyo Express; the Japanese, rat transportation, and the barges that creep along the coasts, ant transportation.
- `ke-1943`: In night runs at the start of February, Japanese destroyers lift the starving survivors of the 17th Army from Cape Esperance. The Americans find the island empty only afterward. Tokyo announces the withdrawal as a 転進 tenshin, a change of direction.

### 3.4 Up the Solomons and New Guinea (10 February – 19 November 1943)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `bismarck-sea-1943` | 1 | The battle of the Bismarck Sea | ビスマルク海海戦 Bisumaruku-kai kaisen (ダンピールの悲劇 Danpīru no higeki) | 1943-03-02 → 03-04 (day) [O] | 7.25, 148.25; sea [W] | battle | jp, us, au | cards (R8: survivors in the water were strafed) | chron43 2–4 Mar [O]; ussbs-camp ch. VIII [O] |
| `komandorski-1943` | 2 | The battle of the Komandorski Islands | アッツ島沖海戦 Attsu-tō-oki kaisen | 1943-03-26 US date; 03-27 JST (day) *verify* | 53.10, 168.21; sea [W] | battle | jp, us | box (candidate: daylight cruiser gunnery, no aircraft) | ussbs-camp app. 36 [O, list]; wd |
| `yamamoto-1943` | 1 | Admiral Yamamoto shot down | 海軍甲事件 Kaigun kō jiken | 1943-04-18 (day) [O] | crash site near Buin, Bougainville 6.77, 155.46; loc *verify* | raid | us, jp | cards | chron43 18 Apr [O] |
| `attu-1943` | 1 | The battle of Attu | アッツ島の戦い Attsu-tō no tatakai | 1943-05-11 → 05-30 (day) [O][W] | Attu (Massacre Bay, Holtz Bay) 52.88, 173.16; isl [W] | battle | us, jp | cards | chron43 11–12 May [O]; cmh-camp Aleutians [O] |
| `nauru-deportation-1943` | 1 | Nauruans deported to Truk | — | 1943-06 → 1946-01 (month) [W] | Nauru 0.53, 166.93 → Tol, Chuuk 7.35, 151.62 *verify*; isl | people | nauruan, jp, chuukese | cards | wp Japanese occupation of Nauru [W] |
| `burma-railway-1943` | 1 | The Burma–Thailand railway | 泰緬鉄道 Taimen tetsudō | 1942-06 → 1943-10-17 (completion; day *verify*) | Kanchanaburi bridge 14.04, 99.50 [W]; Thanbyuzayat 15.97, 97.73; reg | captivity | jp, uk, au, nl, us, romusha | cards | wd; *verify* |
| `new-georgia-1943` | 1 | New Georgia | ニュージョージア島の戦い Nyū Jōjia-tō no tatakai | 1943-06-30 → 10-07 (day) [W] | Munda 8.33, 157.26; ex | campaign | us, nz, jp, solomon-islanders | cards (stops: Kula Gulf 6 Jul, Kolombangara 12–13 Jul, Vella Gulf 6–7 Aug: later `box` candidates) | atlas Jul–Oct 1943 [O]; ussbs-camp app. 50–55 [O, list] |
| `kiska-1943` | 2 | Kiska evacuated; the landing on an empty island | キスカ島撤退作戦 Kisuka-tō tettai sakusen | 1943-07-29 (evacuation) / 08-15 (landing) (day) [O] | Kiska 51.97, 177.50; isl | other | jp, us, ca | cards | ussbs-camp app. 27 [O, list]; atlas Aug 1943 [O]; wd |
| `pt109-1943` | 2 | Biuku Gasa and Eroni Kumana find the PT-109 crew | — | 1943-08 (month) *verify* | Olasana and Naru islands, Blackett Strait 8.08, 156.97; loc *verify* | people | solomon-islanders, us, au | cards | *verify* (not opened) |
| `lae-1943` | 1 | Lae, Salamaua and Nadzab | ラエ・サラモアの戦い Rae Saramoa no tatakai | 1943-09-04 → 09-16 (day) [O] | Lae 6.73, 147.00; Nadzab 6.57, 146.73; loc | campaign | au, us, jp, papuan | cards | atlas Sep–Oct 1943 [O]; macarthur-1 *verify* |
| `bougainville-1943` | 1 | The landing at Empress Augusta Bay | ブーゲンビル島の戦い Būgenbiru-tō no tatakai | landing 1943-11-01; campaign → 1945-08-21 (day) [W] | Cape Torokina 6.23, 155.04 *verify*; loc | landing | us, nz, au, jp, bougainvillean | view (stop: Empress Augusta Bay night action 2 Nov, `box` candidate) | atlas Nov 1943 [O]; ussbs-camp app. 57–58 [O, list] |
| `rabaul-raids-1943` | 2 | Carrier strikes on Rabaul | ラバウル空襲 Rabauru kūshū *verify* | 1943-11-05, 11-11 (day) [O] | Simpson Harbour 4.20, 152.18; ex | raid | us, jp | box (later: a strike on cruisers in harbour) | ussbs-camp app. 59–60 [O, list] |

- `bismarck-sea-1943`: A convoy carrying an army division from Rabaul to Lae is found in the Bismarck Sea. US and Australian bombers come in at mast height with skip-bombing, and all the transports and several destroyers are sunk. Japan stops sending convoys to Lae.
- `komandorski-1943`: Far out in the North Pacific a small US cruiser force tries to stop a Japanese convoy bound for Attu. A long daylight gunnery duel follows, with no aircraft on either side; Salt Lake City lies dead in the water when the Japanese, short of fuel and ammunition, turn away.
- `yamamoto-1943`: US codebreakers read the schedule of Admiral Yamamoto's inspection flight. Army P-38s from Guadalcanal intercept his bomber over Bougainville and shoot it down into the jungle. Japan announces his death in May and gives him a state funeral.
- `attu-1943`: The US 7th Division lands on Attu in fog and fights up the snow-filled valleys. The last of the garrison makes a final charge on 29 May. Tokyo announces the end as 玉砕 gyokusai, "shattering like a jewel", and uses the word for every garrison lost after it (*verify*).
- `nauru-deportation-1943`: The Japanese command deports most of Nauru's people to the Truk lagoon, where they are put to work and go hungry as Truk is cut off. Those left on Nauru starve too. The survivors are brought home in January 1946.
- `burma-railway-1943`: Prisoners of war and conscripted Asian labourers, the rōmusha, are made to build a railway through the jungle between Thailand and Burma to supply the Burma front. Cholera, starvation and beatings kill a great many; most of the dead are Asian labourers whose names were never recorded. The line is finished in October 1943.
- `new-georgia-1943`: American troops land on Rendova and New Georgia to take the Japanese airfield at Munda, and fight slowly through the jungle to capture it in August. In the channels around the island, destroyers and cruisers meet by night again and again.
- `kiska-1943`: Under cover of fog, Japanese cruisers and destroyers slip into Kiska harbour and take off the whole garrison in under an hour. Weeks later American and Canadian troops land on an empty island and still lose men to mines, booby traps and their own fire.
- `pt109-1943`: After a Japanese destroyer cuts PT-109 in two in Blackett Strait, its crew swims to small islands. Two Solomon Islander scouts, Biuku Gasa and Eroni Kumana, find them and carry Lieutenant John F. Kennedy's message, cut into a coconut husk, to the coastwatcher Reg Evans.
- `lae-1943`: Australians land east of Lae from the sea while US paratroopers seize Nadzab in the Markham valley, and Australian troops are flown in behind them. Lae falls on 16 September; its garrison escapes north over the Saruwaged Range.
- `bougainville-1943`: US Marines land at Empress Augusta Bay, halfway along Bougainville's west coast, and build airfields inside a perimeter rather than take the whole island. That night a US cruiser force turns back a Japanese counterstroke in the bay. Australian troops take over the campaign in late 1944.
- `rabaul-raids-1943`: Aircraft from Saratoga and Princeton strike the heavy cruisers newly arrived at Rabaul to attack the Bougainville landing, and damage several. Japan withdraws its heavy ships from Rabaul and does not bring them back.

### 3.5 Across the Central Pacific (20 November 1943 – 14 September 1944)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `tarawa-1943` | 1 | Tarawa | タラワの戦い Tarawa no tatakai | 1943-11-20 → 11-23 (day) [W] | Betio 1.355, 172.93; ex | landing | us, jp, korean, i-kiribati | view | atlas Dec 1943 [O]; crowl-love [O, map list]; morton-sc map 13 |
| `kwajalein-1944` | 1 | Kwajalein and Roi-Namur | クェゼリンの戦い Kwezerin no tatakai *verify* | 1944-01-31 → 02-04 (day) [W] | Kwajalein islet 8.72, 167.73 [W]; Roi-Namur 9.40, 167.47; isl | landing | us, jp, marshallese | cards | atlas Feb 1944 [O]; cmh-camp Eastern Mandates [O] |
| `truk-1944` | 1 | Truk struck | トラック島空襲 Torakku-tō kūshū | 1944-02-17 → 02-18 (day) [W] | Truk Lagoon 7.34, 151.88; isl [W] | raid | us, jp, chuukese | box (candidate: the fighter sweep, or a strike on shipping) | atlas Mar 1944 [O]; ussbs-camp ch. IX [O] |
| `imphal-kohima-1944` | 1 | Imphal and Kohima | インパール作戦 Inpāru sakusen (ウ号作戦 U-gō sakusen); コヒマの戦い | 1944-03-08 → 07-03 (day) [W] | Imphal 24.82, 93.94; Kohima 25.67, 94.11; loc [W] | battle | jp, ina, uk, in | cards | atlas Apr–Sep 1944 [O]; romanus-2 map 10 [O, list] |
| `hollandia-1944` | 2 | Hollandia and Aitape | ホーランジアの戦い Hōranjia no tatakai | 1944-04-22 (day) [W] | Hollandia 2.53, 140.72 [W]; Aitape 3.14, 142.35; loc | landing | us, au, jp | cards | smith-app maps 2–8 [O, list] |
| `ichigo-1944` | 1 | Operation Ichi-Go | 大陸打通作戦 Tairiku datsū sakusen (一号作戦 Ichi-gō sakusen) | 1944-04-19 → 12 (month) [W] | Hengyang 26.89, 112.57; reg | campaign | jp, cn | cards | atlas May–Dec 1944 [O]; romanus-2 map 18 (ICHIGO Plan) [O, list] |
| `yawata-1944` | 2 | The first B-29 raid on Japan | 八幡空襲 Yahata kūshū *verify* | 1944-06-15/16 (day) | Yawata steelworks 33.87, 130.80; Chengdu fields 30.6, 104.0; loc | bombing | us, jp | cards | craven-cate V [O, index]; atlas Sep 1944 [O] |
| `saipan-1944` | 1 | Saipan | サイパンの戦い Saipan no tatakai | 1944-06-15 → 07-09 (day) [W][O] | Charan Kanoa beaches 15.17, 145.70; Marpi Point 15.28, 145.81; isl | landing | us, jp, chamorro, refaluwasch, japanese-civ, okinawan, korean | cards | chron44 15 Jun [O]; crowl-mar [O, map list] |
| `philippine-sea-1944` | 1 | The battle of the Philippine Sea | マリアナ沖海戦 Mariana-oki kaisen (あ号作戦 A-gō sakusen) | 1944-06-19 → 06-20 (day) [W] | between the Marianas and the Philippines, ~13–15 N, 135–143 E; sea (*verify* positions from ussbs-camp app. 83–84) | battle | jp, us | box (candidate: F6F against the raids) | ussbs-camp ch. X, app. 79–84 [O, list]; ijo Nav 3 [R2] |
| `guam-1944` | 1 | Guam retaken | グアムの戦い Guamu no tatakai (1944年) | 1944-07-21 → 08-10 (day) [W][O] | Asan beach 13.47, 144.71; Agat 13.39, 144.66; isl | landing | us, jp, chamorro | view | chron44 [O]; wp [W]; crowl-mar [O, map list] |
| `guam-massacres-1944` | 1 | Manenggon, Tinta and Faha | — | 1944-07 (Manenggon); Tinta 07-15; Faha 07-16 (day) | Manenggon 13.40, 144.75 [W]; Malesso' (Merizo) 13.27, 144.67; loc | atrocity | jp, chamorro | cards | nps-wapa Tinta, Faha pages (*verify*: search summary) |
| `tinian-1944` | 2 | Tinian | テニアンの戦い Tenian no tatakai | 1944-07-24 → 08-01 (day) [W] | Tinian 15.00, 145.63; isl [W] | landing | us, jp, chamorro, japanese-civ | cards | crowl-mar [O, map list] |
| `tsushima-maru-1944` | 1 | The Tsushima Maru | 対馬丸事件 Tsushima Maru jiken | 1944-08-22 (day) [O] | 29.50, 129.50; sea [O] | sinking | us, okinawan, japanese-civ | cards | chron44 22 Aug [O]; wd |
| `hell-ships-1944` | 1 | Hell ships: Rakuyō Maru, Jun'yō Maru, Arisan Maru | 楽洋丸, 順陽丸 *verify*, 阿里山丸 [W] | 1944-09-12, 09-18, 10-24 (day) [O] | Rakuyō Maru 18.70, 114.50; Jun'yō Maru −2.88, 101.18; Arisan Maru 20.90, 118.32 [all O]; sea | captivity | jp, us, uk, au, nl, romusha | cards | chron44 12 Sep, 18 Sep, 24 Oct [O] |

- `tarawa-1943`: Marines assault Betio, the fortified islet at the corner of Tarawa atoll. Their landing craft ground on the reef at low tide and men wade a long way to the beach under fire. Betio is taken in three days; almost the whole garrison dies, Korean labourers among them. The people of Tarawa had been moved off Betio by the Japanese (*verify*).
- `kwajalein-1944`: After days of bombardment the Army takes Kwajalein islet and the Marines Roi-Namur, at the two ends of one of the world's largest lagoons; Majuro is taken unopposed for an anchorage. The fortified atolls of Wotje, Maloelap, Mili and Jaluit are bypassed and left to starve, with the Marshallese who live on them.
- `truk-1944`: The fast carriers strike Truk, the Combined Fleet's anchorage in the Carolines. The fleet has already gone, but aircraft and ships sink cruisers, destroyers and a great tonnage of merchant shipping in the lagoon and wreck the aircraft on its airfields. Truk is never invaded.
- `imphal-kohima-1944`: The 15th Army crosses the Chindwin to take Imphal and Kohima and break into India, with the Indian National Army beside it. British and Indian divisions, supplied by air, hold both; at Kohima the front runs across the deputy commissioner's tennis court. With the monsoon and hunger, the Japanese retreat becomes a disaster.
- `hollandia-1944`: MacArthur leaps along the New Guinea coast past the Japanese at Wewak and lands at Hollandia and Aitape far behind them. The 18th Army is cut off; it attacks the Aitape perimeter across the Driniumor river in July and fails.
- `ichigo-1944`: Japan's largest offensive of the war (*verify*) drives south through Henan, Hunan and Guangxi to open a land route from Korea to Indochina and overrun the airfields of the US Fourteenth Air Force. Hengyang holds out for weeks in the summer; Guilin and Liuzhou fall in November. Nationalist China suffers its worst defeats since 1938.
- `yawata-1944`: B-29s flying from airfields around Chengdu, supplied over the Hump, bomb the steelworks at Yawata in Kyushu, the first raid on the home islands since Doolittle's. The China bases prove too costly to supply, and the bombers move to the Marianas.
- `saipan-1944`: Marines and soldiers land on Saipan, the heart of Japanese settlement in the South Seas Mandate, home to Chamorro and Carolinian people and to many settlers from Okinawa and Japan. The garrison makes its last charge on 7 July. At Marpi Point in the north, civilians die leaping from the cliffs or at their own hands and their soldiers'; what drove them is given in tellings.
- `philippine-sea-1944`: Admiral Ozawa's Mobile Fleet sends great raids against the US Fifth Fleet off the Marianas. Radar-directed Hellcats and the fleet's guns destroy most of the attackers; American airmen call it the Great Marianas Turkey Shoot. Submarines sink Taihō and Shōkaku, and a dusk strike next day sinks Hiyō.
- `guam-1944`: Marines and soldiers land on either side of the Orote peninsula on 21 July, the day Guam keeps as Liberation Day. Organised resistance ends on 10 August; some soldiers hide in the jungle for years.
- `guam-massacres-1944`: As the American landing nears, the Japanese command marches most of Guam's people inland to camps such as Manenggon in the Ylig river valley. At Tinta and Faha, near the village of Malesso', soldiers kill villagers in caves on 15 and 16 July; at Tinta some survive by lying among the dead. Days later the men of Malesso' rise against their guards.
- `tinian-1944`: Marines cross from Saipan and land on Tinian's narrow northern beaches, where the defenders do not expect them. Its flat cane fields become the airfields from which the B-29s fly to Japan, and in August 1945 the atomic missions.
- `tsushima-maru-1944`: The transport Tsushima Maru, carrying schoolchildren and families evacuated from Okinawa to Kyushu, is torpedoed at night by the submarine Bowfin near Akusekijima. The submarine's crew does not know who is aboard. Most of the children are lost, and survivors are told not to speak of it (*verify*).
- `hell-ships-1944`: Japan ships prisoners of war and conscripted labourers in the holds of unmarked cargo ships, which Allied submarines attack without knowing who is aboard. In a few weeks of 1944 the Rakuyō Maru in the South China Sea, the Jun'yō Maru off Sumatra and the Arisan Maru in the Bashi Channel are sunk with prisoners and labourers in their holds.

### 3.6 The return to the Philippines (15 September 1944 – 18 February 1945)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `peleliu-1944` | 1 | Peleliu | ペリリューの戦い Peririū no tatakai | 1944-09-15 → 11-27 (day) [W] | Peleliu 7.00, 134.24; isl [W] | landing | us, jp, palauan | cards | smith-app maps 19–24 [O, list]; ussbs-camp ch. XI [O] |
| `naha-raid-1944` | 1 | The ten-ten air raid | 十・十空襲 Jū-jū kūshū | 1944-10-10 (day) [O] | Naha 26.21, 127.68; ex | bombing | us, jp, okinawan | cards | chron44 10 Oct [O] |
| `leyte-1944` | 1 | The landings on Leyte | レイテ島の戦い Reite-tō no tatakai | 1944-10-20 landing; → 12-26 (day) [W]; US Army 17 Oct 1944 – 1 Jul 1945 [O] | Red Beach, Palo 11.17, 125.01; ex [W] | landing | us, ph, jp | view | atlas Nov 1944 [O]; cannon [R2]; cmh-camp Leyte [O] |
| `leyte-gulf-1944` | 1 | The battle of Leyte Gulf | レイテ沖海戦 Reite-oki kaisen (捷一号作戦 Shō-ichi-gō sakusen) | 1944-10-23 → 10-26 (day) | stops: Palawan Passage (Atago) 9.40, 117.18; Sibuyan Sea (Musashi) 12.83, 122.58; Surigao 10.42, 125.33; Samar 11.77, 126.15; Cape Engaño (Zuikaku) 19.33, 125.85 [all O]; sea | battle | jp, us, au | cards (the umbrella; Samar and Surigao are their own events) | chron44 23–25 Oct [O]; ussbs-camp ch. XII, app. 93 [O]; nwc-leyte [R2] |
| `surigao-1944` | 2 | The battle of Surigao Strait | スリガオ海峡海戦 Surigao kaikyō kaisen *verify* | 1944-10-25 (night 24/25; day) | Fusō and Yamashiro sunk 10.42, 125.33 [O]; sea | battle | jp, us, au | box (candidate) | chron44 25 Oct [O]; ijo Nav 58, 79 [R2] |
| `samar-1944` | 1 | The battle off Samar | サマール沖海戦 Samāru-oki kaisen | 1944-10-25 (day) | Johnston sunk 11.77, 126.15; Hoel 11.77, 126.55; Samuel B. Roberts 11.67, 126.33; Gambier Bay 11.52, 126.20 [all O]; sea | battle | jp, us | **box (v1)** | chron44 25 Oct [O]; ussbs-camp app. 94 [O, list]; Hoel and Johnston ARs [R2]; ijo Nav 9, 35, 41 [R2] |
| `tokko-1944` | 1 | The first tokkō attacks | 神風特別攻撃隊 Shinpū (Kamikaze) tokubetsu kōgekitai | 1944-10-25 (day) | off Samar ~11.2, 126.0 (St. Lô); sea *verify* | other | jp, us | cards (never a playable role) | chron44 13, 25 Oct [O]; jm-86 [R2] |
| `shinano-1944` | 2 | Shinano sunk by Archerfish | 信濃 Shinano | 1944-11-29 (day) [O] | 32.00, 137.00 [O] (wd 33.12, 137.07; tellings); sea | sinking | us, jp | box (later: a submarine sortie; R7) | chron44 29 Nov [O] |
| `tokyo-b29-1944` | 2 | The first B-29 raid on Tokyo from the Marianas | 東京空襲 Tōkyō kūshū | 1944-11-24 (day) [O] | Musashino (Nakajima engine works) 35.71, 139.56 *verify*; loc | bombing | us, jp | cards | chron44 24 Nov [O]; craven-cate V [O, index] |
| `lingayen-1945` | 2 | Lingayen Gulf again | リンガエン湾上陸 Ringaen-wan jōriku | 1945-01-09 (day) [W] | Lingayen Gulf 16.05, 120.35; loc | landing | us, ph, jp | cards | atlas Jan 1945 [O]; smith-tri [O, map list] |
| `manila-1945` | 1 | Manila | マニラの戦い Manira no tatakai; マニラ大虐殺 Manira daigyakusatsu | 1945-02-03 → 03-03 (day) [W] | Intramuros 14.59, 120.975; ex [W] | battle | us, ph, jp, filipino-civ | cards (never playable) | smith-tri [O, map list]; wd; tellings needed |

- `peleliu-1944`: The 1st Marine Division lands on Peleliu expecting a short fight. The garrison, dug into the coral ridges of the Umurbrogol under new orders not to waste itself in charges, holds out for over two months. The island's Palauan villagers had been moved away before the battle (*verify*).
- `naha-raid-1944`: Carrier aircraft attack Okinawa and the Ryukyus for the first time, striking shipping and airfields and burning most of Naha. Okinawans name the raid for its date, ten-ten.
- `leyte-1944`: The Sixth Army lands on Leyte's east coast, and MacArthur wades ashore to announce his return. Japan answers by sending its whole fleet against the landing and its reinforcements through Ormoc Bay. The fighting in the rain-soaked mountains lasts to the end of the year.
- `leyte-gulf-1944`: Japan's plan, Shō-1, sends three forces at the Leyte landing while a fourth, Ozawa's carriers nearly empty of aircraft, draws Halsey's fast carriers north. US submarines strike first in the Palawan Passage; aircraft sink Musashi in the Sibuyan Sea; old battleships destroy Nishimura's force in Surigao Strait; and Kurita comes through San Bernardino Strait to find only escort carriers off Samar. It is the last great fleet action and the end of the Imperial Navy as a fighting fleet.
- `surigao-1944`: Nishimura's old battleships steam up Surigao Strait at night through PT boats and destroyer torpedo attacks and into the crossed T of Oldendorf's battleships and cruisers. Fusō and Yamashiro are sunk; Shima's force behind them turns back.
- `samar-1944`: At dawn the escort carriers of Taffy 3 sight the pagoda masts of Kurita's battleships and cruisers on the horizon off Samar. Their destroyers and destroyer escorts turn and charge with torpedoes and five-inch guns, while the carriers' aircraft attack with whatever they carry. Gambier Bay, Johnston, Hoel and Samuel B. Roberts are sunk, Japanese heavy cruisers are lost, and Kurita, unsure what he faces, turns away north.
- `tokko-1944`: Pilots of the Shikishima unit, formed days earlier at Mabalacat on Luzon, dive their bomb-laden Zeros into the escort carriers off Samar and sink St. Lô. Japan's navy and army make such attacks a system; the record of the young men sent, and what they wrote, is told on cards.
- `shinano-1944`: Shinano, a Yamato-class hull completed as a carrier, leaves Yokosuka on her first voyage. The submarine Archerfish stalks her through the night and puts torpedoes into her; with her watertight work unfinished and her crew new, she sinks within hours.
- `tokyo-b29-1944`: B-29s from Saipan bomb the Nakajima aircraft-engine works at Musashino on the edge of Tokyo, the first raid on the capital from the Marianas. Bombing from high altitude through the jet stream and cloud hits little at first.
- `lingayen-1945`: The Sixth Army lands on Lingayen Gulf, where the Japanese landed three years before; the convoys coming in suffer heavy tokkō attacks. Yamashita withdraws into the mountains of northern Luzon rather than fight on the plain.
- `manila-1945`: Naval troops left to hold Manila fight block by block and, in the weeks of the battle, kill and assault the city's civilians. American artillery levels the old walled city of Intramuros. Manila is left among the most destroyed cities of the war.

### 3.7 The approaches to Japan (19 February – 25 July 1945)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `iwo-jima-1945` | 1 | Iwo Jima | 硫黄島の戦い Iōtō no tatakai | 1945-02-19 → 03-26 (day) [O][W] | Iwo Jima 24.78, 141.32 [W]; Mount Suribachi 24.75, 141.29; isl | landing | us, jp | view | chron45 19 Feb [O]; ussbs-camp ch. XIII [O] |
| `tokyo-fire-raid-1945` | 1 | The fire raid on Tokyo | 東京大空襲 Tōkyō daikūshū | night of 1945-03-09/10; 03-10 JST (day) [W] | Shitamachi, east of the Sumida 35.70, 139.80; loc [W] | bombing | us, japanese-civ | cards (never playable) | wd; craven-cate V [O, index]; ussbs-pto-summary *verify* |
| `burma-1945` | 1 | Meiktila, Mandalay and Rangoon | イラワジ会戦 Irawaji kaisen; ドラキュラ作戦 Dorakyura sakusen (Rangoon) | 1945-01 → 05-03 (day) [W][O] | Meiktila 20.88, 95.86 [W]; Mandalay 21.96, 96.09 [W]; Rangoon 16.85, 96.17 [W]; reg | campaign | uk, in, jp | cards | atlas Jan–Jun 1945 [O]; cmh-camp Central Burma [O] |
| `kerama-1945` | 1 | The Kerama Islands | 慶良間諸島の戦い *verify*; 集団自決 shūdan jiketsu | 1945-03-26 → 03-28 (day) [O] | Zamami 26.23, 127.30; Tokashiki 26.20, 127.36; isl | atrocity | us, jp, okinawan | cards | chron45 26 Mar [O]; appleman [R2]; tellings needed (Okinawa prefectural sources) |
| `starvation-1945` | 2 | Mining Japan's waters | 飢餓作戦 Kiga sakusen | 1945-03-27 → 08-15 (day) *verify start* | Shimonoseki Strait 33.96, 130.95; reg | other | us, jp | cards | chron45 (many entries "mines laid by USAAF B-29s") [O]; wd |
| `okinawa-1945` | 1 | Okinawa | 沖縄戦 Okinawa-sen | 1945-04-01 → 06-22/23 (Japanese end); 07-02 (US declared) (day) [W][O] | Hagushi beaches 26.37, 127.73; Shuri 26.22, 127.72 [W]; isl | campaign | us, uk, jp, okinawan, korean | cards (the fleet under tokkō attack: never a role) | ussbs-camp ch. XIV [O]; appleman [R2]; cmh-camp Ryukyus [O] |
| `ten-go-1945` | 1 | Yamato's last sortie | 坊ノ岬沖海戦 Bōnomisaki-oki kaisen (天一号作戦 Ten-ichi-gō sakusen) | 1945-04-06 → 04-07 (day) [O] | sunk 30.37, 128.07 [W] **or** 30.67, 128.05 (chron) [O]; sea | battle | jp, us | box (candidate in the brief; R8 to rule: the sortie was a 水上特攻 surface tokkō) | ussbs-camp ch. XIV, app. 100–103 [O]; chron45 7 Apr [O]; ijo Nav 32 [R2] |
| `himeyuri-1945` | 1 | The Himeyuri students | ひめゆり学徒隊 Himeyuri gakutotai | 1945-03-23 → 06 (month) *verify* | Ihara, Itoman 26.10, 127.68 *verify*; loc | people | okinawan | cards | wd Q717158; *verify* in Okinawa prefectural sources |
| `borneo-1945` | 2 | Borneo | ボルネオの戦い Boruneo no tatakai | 1945-05-01 → 07 (month) [W] | Tarakan 3.35, 117.57 [W]; Labuan 5.30, 115.22 *verify*; Balikpapan −1.27, 116.85 [W]; reg | landing | au, us, nl, jp | cards | atlas May–Jul 1945 [O]; awm-long *verify* |
| `sandakan-1945` | 1 | The Sandakan death marches | サンダカン死の行進 Sandakan shi no kōshin | 1945-01 → 08 (month) *verify* | Sandakan 5.84, 118.12 → Ranau 5.95, 116.68 *verify*; reg | atrocity | jp, au, uk | cards | *verify* (AWM) |

- `iwo-jima-1945`: Marines land on the black volcanic sand of Iwo Jima, halfway between the Marianas and Tokyo, to take its airfields. Kuribayashi's garrison fights from tunnels and does not come out to die in charges. A flag goes up on Mount Suribachi on the fifth day; the fighting lasts five weeks, and crippled B-29s are landing on the island before it ends.
- `tokyo-fire-raid-1945`: General LeMay sends the B-29s in low, at night, with incendiaries against the wooden districts east of the Sumida river. The fire storm burns a great part of Tokyo in one night. It opens months of fire raids on Japan's cities; the dead are counted only in tellings.
- `burma-1945`: Slim's Fourteenth Army crosses the Irrawaddy, seizes Meiktila behind the Japanese armies and takes Mandalay in March. Aung San's Burma National Army turns against the Japanese. A race south to beat the monsoon ends when Rangoon is entered from the sea in early May.
- `kerama-1945`: American troops land on the Kerama islands west of Okinawa to make an anchorage. On Zamami, Tokashiki and other islands, many islanders die in group suicides, often whole families, told that capture would be worse and handed grenades by soldiers. Whether the army ordered the deaths has been argued in Japanese courts and textbooks.
- `starvation-1945`: B-29s sow mines in the Shimonoseki Strait, the Inland Sea and the harbours of Japan and Korea. Ships the submarines have not sunk are trapped or sunk at the harbour mouths, and the food Japan brings in by sea dwindles.
- `okinawa-1945`: The Tenth Army lands unopposed on the Hagushi beaches and meets the Japanese army in the Shuri line across the south. For nearly three months the battle grinds through the part of the island where most Okinawans live, while tokkō aircraft strike the fleet offshore. The Japanese commander takes his life on 22 or 23 June; Okinawa keeps 23 June as 慰霊の日 Irei no hi, its day of mourning.
- `ten-go-1945`: Yamato sails from Tokuyama with a light cruiser and a destroyer screen, ordered to reach Okinawa and beach herself there as a fortress (the story that she carried fuel for one way only is disputed: *verify*). US submarines report her leaving the Bungo Strait; next day wave after wave of carrier aircraft attack her in the East China Sea, and she capsizes and blows up in the early afternoon.
- `himeyuri-1945`: Schoolgirls and teachers from two Okinawan girls' schools are mobilised as nurses for the army's cave hospitals. When the army retreats south in late May they follow it, and when the unit is disbanded in June they are left among the fighting. A museum stands at one of the caves.
- `borneo-1945`: Australian divisions land at Tarakan, at Brunei Bay and Labuan, and at Balikpapan to retake Borneo's oil, the last large Allied landings of the war.
- `sandakan-1945`: The Australian and British prisoners held at Sandakan in North Borneo are marched inland through jungle to Ranau. Those who fall behind are killed; those who arrive die there of starvation and killing. Only a few men who escaped survive, sheltered by local people.

### 3.8 The end of the war (26 July – 2 September 1945)

| id | tier | title | Japanese | when | place (lat, lon; prec) | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `potsdam-1945` | 1 | The Potsdam Declaration | ポツダム宣言 Potsudamu sengen | 1945-07-26 (day) [W]; atlas Aug 1945 [O] | Potsdam (off); pin at Tokyo 35.685, 139.753 | political | us, uk, cn, jp | cards | atlas [O]; wd |
| `indianapolis-1945` | 2 | Indianapolis sunk | 重巡洋艦インディアナポリス撃沈 *verify*; 伊号第五十八潜水艦 I-58 | 1945-07-30 shortly after midnight *verify*; chron lists under 29 July (day) | 12.03, 134.80 [O]; sea | sinking | jp, us | cards (no figures in the water) | chron45 29 Jul [O] |
| `hiroshima-1945` | 1 | Hiroshima | 広島市への原子爆弾投下 Hiroshima-shi e no genshi bakudan tōka | 1945-08-06 08:15 JST (day) | hypocentre 34.3955, 132.4546; ex [W] | bombing | us, japanese-civ, korean | cards (never playable; no cloud drawn) | atlas Aug 1945 [O]; wd; ussbs *Effects of Atomic Bombs* *verify* |
| `soviet-entry-1945` | 1 | The Soviet Union enters the war | ソ連対日参戦 So-ren tai-Nichi sansen | declaration 1945-08-08 (Moscow); offensive 08-09 → 08-20 (Manchuria); Kurils to about 09-01 *verify* (day) | Manchuria 49.0, 125.0; reg [W] | campaign | su, mn, jp, mk, japanese-civ | cards | atlas Aug 1945 [O]; wd |
| `nagasaki-1945` | 1 | Nagasaki | 長崎市への原子爆弾投下 Nagasaki-shi e no genshi bakudan tōka | 1945-08-09 11:02 JST (day) | hypocentre, Urakami 32.774, 129.863 *verify* (wd 32.750, 129.876); ex | bombing | us, japanese-civ, korean | cards (never playable) | atlas Aug 1945 [O]; wd |
| `gyokuon-1945` | 1 | The Emperor's broadcast | 玉音放送 Gyokuon hōsō | 1945-08-15 12:00 JST; 08-14 23:00 Washington (EWT) (day) | Tokyo 35.685, 139.753; ex | political | jp | cards | atlas ("the Japanese surrendered on 14 August") [O]; wd |
| `shumshu-1945` | 2 | Shumshu | 占守島の戦い Shumushu-tō no tatakai | 1945-08-18 → 08-23 (day) [W] | Shumshu 50.73, 156.32; isl [W] | battle | su, jp | cards | wd; *verify* |
| `ocean-island-1945` | 1 | The Ocean Island massacre | — | 1945-08-20 (day) [W] | Banaba −0.86, 169.54; isl | atrocity | jp, i-kiribati | cards | wp Ocean Island massacre [W] |
| `surrender-1945` | 1 | The surrender in Tokyo Bay | 降伏文書調印 Kōfuku bunsho chōin | 1945-09-02, morning JST; 09-01 evening Washington (day) | USS Missouri 35.355, 139.760; ex [W] | surrender | jp, us, cn, uk, su, au, ca, fr, nl, nz | view (the fleet at anchor) | chron45 2 Sep [O]; go1 [O]; wd |

- `potsdam-1945`: The United States, Britain and China call on Japan to surrender unconditionally or face "prompt and utter destruction". Prime Minister Suzuki tells the press his government will 黙殺 mokusatsu, kill it with silence, a word read abroad as rejection.
- `indianapolis-1945`: Returning from delivering parts of the first atomic bomb to Tinian, the cruiser Indianapolis is torpedoed by the submarine I-58 between Guam and Leyte and sinks in minutes. No one ashore notices she is overdue; the survivors are found by chance days later.
- `hiroshima-1945`: A single B-29 from Tinian drops an atomic bomb on Hiroshima at a quarter past eight in the morning. Blast and fire destroy the centre of the city, and many more die in the months that follow of burns and radiation sickness. Among the dead are conscripted Korean workers and Allied prisoners.
- `soviet-entry-1945`: The Soviet Union declares war and its armies cross into Manchuria from three directions at once. The Kwantung Army collapses within days. Soviet forces take southern Sakhalin, northern Korea to the 38th parallel and the Kurils; Japanese settlers in Manchuria flee south, and many soldiers are carried off to labour camps in Siberia.
- `nagasaki-1945`: With Kokura hidden by haze and smoke, the second atomic bomb is dropped on the secondary target, Nagasaki. It bursts over the Urakami valley, home of the city's old Catholic community, near the cathedral.
- `gyokuon-1945`: At noon the Emperor's recorded voice tells his subjects, in a court Japanese many cannot follow, that Japan will "endure the unendurable" and accept the Allies' terms. Japan remembers the day as 終戦の日 Shūsen no hi, the end of the war; in Korea it is the day of liberation.
- `shumshu-1945`: Three days after the broadcast, Soviet troops land on Shumshu at the northern end of the Kurils. The garrison fights them until ordered to lay down its arms, and the Soviet advance down the island chain follows.
- `ocean-island-1945`: Days after the surrender is announced, the Japanese garrison on Banaba kills the Gilbertese labourers left on the island. One man, Kabunare Koura of Nikunau, survives by hiding; his account, given in December 1945, brings the killings to trial.
- `surrender-1945`: On the deck of the battleship Missouri, anchored in Tokyo Bay among the Allied fleet, Foreign Minister Shigemitsu and General Umezu sign the instrument of surrender, and MacArthur signs for the Allied Powers, followed by the representatives of each nation. Japanese garrisons across Asia and the Pacific surrender to local commanders in the weeks after.

### 3.9 Across the whole span

These belong to no single era. Each needs a `when` range and a place rule.

| id | tier | title | Japanese | when | place | kind | sides | flag | src |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `submarine-war` | 1 | The war on shipping | 通商破壊戦 tsūshō hakaisen *verify* | 1941-12 → 1945-08 (month) | Luzon Strait ("Convoy College") 20.5, 121.0; sea | campaign | us, uk, nl, jp | cards (the route layer) | ussbs-camp ch. XVI, app. 109–112 [O, list]; janac (archive.org) [metadata O]; ussbs-trans [metadata O] |
| `hump-1942` | 2 | The Hump | ハンプ越え Hanpu-goe | 1942-04 → 1945-11 (month) [W] | Chabua 27.48, 95.12 → Kunming 25.04, 102.71; reg | other | us, cn, in | cards (route) | romanus-1 map 6, romanus-2 map 1 [O, list]; atlas [O] |
| `internment-us-1942` | 1 | Executive Order 9066 | 大統領令9066号 Daitōryō-rei 9066-gō; 日系アメリカ人の強制収容 | 1942-02-19 → 1946-03 (day/month) [W] | US West Coast (off); on-table pin: Honouliuli, Oʻahu 21.37, −158.05 *verify* | captivity | us, japanese-am | cards | wd; *verify* (NPS Honouliuli) |
| `internment-canada-1942` | 2 | PC 1486: Japanese Canadians removed | 日系カナダ人の強制収容 | 1942-02-24 (day) [W] | British Columbia (off) | captivity | ca, japanese-ca | cards | wp Internment of Japanese Canadians [W] |
| `hell-ships-1942` | 2 | Montevideo Maru and Lisbon Maru | もんてびでお丸, りすぼん丸 [W] | 1942-07-01 [O]; 1942-10-01/02 *verify* (day) | Montevideo Maru 18.62, 119.48 [O]; Lisbon Maru 30.23, 122.77 [W]; sea | captivity | jp, us, au, uk, chinese-civ | cards | chron42 1 Jul [O]; wd |
| `comfort-system` | 1 | The comfort stations | 慰安所 iansho; 慰安婦 ianfu | 1932 → 1945 (year) | theatre-wide: **no pin** | atrocity | jp, korean, chinese-civ, filipino-civ, and others | cards | tellings needed (Kōno statement 1993; survivors' testimony; Yoshimi) *verify* |
| `unit-731` | 2 | Unit 731 | 731部隊 Nana-san-ichi butai | 1936 → 1945 (year) | Pingfang, Harbin 45.61, 126.63 *verify*; loc | atrocity | jp, chinese-civ | cards | wp Unit 731 [W] |
| `bengal-famine-1943` | 2 | The Bengal famine | ベンガル飢饉 Bengaru kikin | 1943 → 1944 (year) | Calcutta 22.57, 88.36; reg | other | uk, in | cards (R8: include or not) | wp Bengal famine of 1943 [W] |
| `cowra-1944` | 2 | The Cowra breakout | カウラ事件 Kaura jiken | 1944-08-05 (day) [W] | Cowra 33.81, 148.70; ex [W] | other | jp, au | cards | wd |

- `submarine-war`: American submarines, with British and Dutch boats working from Fremantle and Ceylon, sink most of Japan's merchant fleet. Their torpedoes run deep and fail to explode until 1943; once fixed, the boats hunt in packs across the convoy routes from the oilfields of the Indies to Japan. Japan's own submarines are spent hunting warships and supplying cut-off garrisons.
- `hump-1942`: With the Burma Road cut, transport aircraft fly supplies from Assam over the eastern Himalaya to Kunming. Weather, mountains and overloaded aircraft take a steady toll of crews.
- `internment-us-1942`: President Roosevelt signs Executive Order 9066, and Japanese Americans on the West Coast, most of them citizens, are removed to camps inland. In Hawaiʻi, where people of Japanese descent are a large part of the population, mass removal is not attempted, but community leaders are detained, some at Honouliuli on Oʻahu.
- `internment-canada-1942`: Canada's order in council PC 1486 empowers the removal of all people of Japanese origin from the British Columbia coast. Families are sent to camps in the interior, and their homes, boats and farms are sold.
- `hell-ships-1942`: The Montevideo Maru, carrying Australian prisoners and civilians taken at Rabaul, is sunk by the submarine Sturgeon off Luzon; no prisoner survives. In October the Lisbon Maru, carrying British prisoners from Hong Kong, is torpedoed off Zhejiang, and fishermen of the Zhoushan islands rescue survivors (*verify*).
- `comfort-system`: The Japanese army and navy set up and supervise a system of "comfort stations" across occupied Asia, to which women and girls, many from Korea, are taken by deception or force. Survivors begin to testify publicly in 1991. The card names no single place.
- `unit-731`: At Pingfang outside Harbin, a Kwantung Army unit experiments on prisoners and develops biological weapons, later used in China. The unit destroys its site in August 1945, and its leaders are spared prosecution by the United States in exchange for their data.
- `bengal-famine-1943`: Famine kills a great many people in Bengal after the loss of Burma's rice, a cyclone, wartime inflation and hoarding, and decisions in Delhi and London about food. Historians argue about the causes, and the card gives each telling.
- `cowra-1944`: Japanese prisoners of war at Cowra in New South Wales break out of their camp at night with improvised weapons. Many die in the breakout or at their own hands.

### 3.10 Counts, and what the list leaves out

- **Prologue:** 13 cards; 9 marked tier 1, of which 8 are core.
- **In the span:** 109 events, counted across §3.2–3.9. Tier 1 is 80; tier 2 is 29.
- **Battle-box candidates (`box`):** 23.
  - v1 (three): Midway, Guadalcanal (14–15 November), Samar.
  - Brief's later list: Pearl Harbor (defence), Ten-Gō, Philippine Sea, Santa Cruz, Surigao, Savo, Coral Sea.
  - Added here: Wake (11 December), Force Z, Java Sea, Sunda Strait, the Indian Ocean raid, Eastern Solomons, Cape Esperance, Tassafaronga, Komandorski, Truk, Rabaul (November 1943), Dutch Harbor, Shinano (a submarine sortie, if R7 wants one).
- **`view` only:** 10 (Malaya, Lingayen, Doolittle's take-off, Guadalcanal, Bougainville, Tarawa, Guam, Leyte, Iwo Jima, the surrender).
- **Cards only:** the rest, including every `bombing`, `atrocity`, `captivity` and `people` event.

Left out on purpose, as candidates for a later pass:
- the Japanese invasion of Thailand and the Thai alliance;
- the Battle of Hong Kong's St Stephen's College killings (*verify*), and Laha (Ambon);
- Christmas Island; Biak, Morotai, Noemfoor and Sansapor (New Guinea stops);
- Mindoro and Ormoc Bay (the Ta-gō convoys); the Admin Box; the Chindits;
- Changde (1943) and Zhijiang (1945) in China;
- Japan's 9 March 1945 coup in Indochina (明号作戦 Meigō sakusen);
- the Vietnamese famine of 1944–45; the fire balloons (風船爆弾 fūsen bakudan);
- the West Coast shellings; Diego Suarez (Madagascar, off the table);
- Operation Downfall (planned, never fought: not an event).

---

## 4. The table's extent

### 4.1 What the events need

| place | lat, lon | needed for |
| --- | --- | --- |
| Colombo, Trincomalee | 6.9 N 79.9 E; 8.6 N 81.2 E | the Indian Ocean raid (April 1942) |
| Calcutta; Chabua (Assam) | 22.6 N 88.4 E; 27.5 N 95.1 E | the Hump, the Bengal famine, the B-29s' Indian bases (Kharagpur 22.3 N 87.3 E) |
| Imphal, Kohima | 24.8 N 93.9 E; 25.7 N 94.1 E | the 1944 offensive |
| Andamans | 11.6 N 92.7 E | occupation, the sea road to Rangoon |
| Chongqing, Chengdu | 29.6 N 106.6 E; 30.6 N 104.1 E | the prologue's bombing; Matterhorn |
| Harbin, Mukden | 45.8 N 126.6 E; 41.8 N 123.5 E | the prologue; Unit 731; the Soviet entry |
| Shumshu, Paramushiro | 50.7 N 156.3 E | the last battle |
| Attu, Kiska | 52.9 N 173.2 E; 52.0 N 177.5 E | the Aleutians |
| Dutch Harbor | 53.9 N 166.5 W | the June 1942 raid |
| Hitokappu Bay | 44.9 N 147.6 E | the Kidō Butai's sortie |
| Midway | 28.2 N 177.4 W | v1 |
| Pearl Harbor | 21.4 N 158.0 W | the attack; the routes begin here |
| Sydney, Cowra | 33.9 S 151.2 E; 33.8 S 148.7 E | the midget submarines; the breakout |
| Darwin | 12.5 S 130.8 E | the raids |
| Christmas Island (Indian Ocean) | 10.5 S 105.6 E | occupation; Pecos sunk south of it (14.5 S 106.2 E) |

### 4.2 Three boxes compared (azimuthal equidistant, centred on each box's middle)

Computed with `r3-scripts/extent.py`: sphere, the AEQD formulas from R1 §5.1,
ω is the maximum angular distortion, γ is the angle between north and the
table's up.

| box | centre | extent (km), aspect | texel at 2,048 wide | worst places: ω |
| --- | --- | --- | --- | --- |
| A. brief's: 90 E – 155 W, 40 S – 55 N | 7.5 N 147.5 E | 12,838 × 11,958, 1.07 | 6.27 km | Colombo 13.7° (outside the box), Dutch Harbor 10.6°, Calcutta 10.4°, Pearl 8.9° |
| **B. recommended: 78 E – 155 W, 42 S – 56 N** | **7.0 N 141.5 E** | **14,168 × 12,661, 1.12** | **6.92 km** | Dutch Harbor 11.9°, Colombo 11.3°, Pearl 10.9°, Trincomalee 10.7°, Calcutta 8.5°, Attu 8.3° |
| C. as B but 38 S – 56 N | 9.0 N 141.0 E | 14,090 × 12,075, 1.17 | 6.88 km | Dutch Harbor 11.3°, Colombo 11.1°, Pearl 10.8° |

At the v1 battles, box B gives:

| battle | area scale | ω | γ |
| --- | --- | --- | --- |
| Midway | 1.11 | 5.8° | −15.0° |
| Guadalcanal | 1.03 | 1.8° | +1.3° |
| Samar | 1.01 | 0.7° | +2.7° |

So a box placed on the table needs to be rotated by γ, as R1 §5.3 says.

**Recommendation: box B, centred at 7° N 141.5° E** (between Yap and
Woleai). It answers the task's four questions as follows.

- **Imphal and Kohima (94° E): yes.** They sit 49° from the centre with ω of
  7.1°. Cutting at 90° E would put Kohima 4° outside the edge.
- **Attu (173° E) and Dutch Harbor (166° W): yes.** The northern edge at
  56° N holds the whole Aleutian chain and the tip of Kamchatka. Dutch
  Harbor is the worst-distorted place on the table, at 11.9°, γ −35°: north
  points up and to the left there. That is acceptable for a diorama and true
  to an azimuthal map.
- **Sydney (34° S): yes.** The 42° S edge adds Tasmania's north and the North
  Island of New Zealand, whose forces fought in the Solomons. Box C (38° S)
  saves 5 % of height and cuts New Zealand.
- **Pearl Harbor (158° W): yes.** The eastern edge at 155° W leaves Hawaiʻi
  Island just inside. The war starts here, and the Kidō Butai and Midway
  routes need it. It costs nothing the azimuthal rectangle does not already
  show: R1 notes that the corners fill with real terrain.
- **Colombo (80° E): yes.** This is the one change to the brief. It costs
  12° of width (10 % more texels, or 6.9 km instead of 6.3 km per texel) and
  enlarges R1's fetch envelope by about the same. It also brings in the Bay of
  Bengal and Assam, which the Hump and Burma need anyway.

Left off the table, as edge markers: Diego Suarez (Madagascar), the US West
Coast, British Columbia, Southeast Alaska (Funter Bay), Washington, Potsdam,
Moscow.

**Centre for the projection: 7.0° N, 141.5° E.** If the designer prefers a
round number, 7° N 142° E changes nothing visible. R1's equirectangular
fallback would stretch the Aleutians 1.6–1.7× east–west. That is worse in box
B, because the box is taller.

---

## 5. The front, keyframe by keyframe

No open dataset holds these polygons. The work is to georeference
public-domain maps and trace them. Each perimeter below is a draft: an ordered
list of named places, with approximate vertices where a place is not
enough. Each comes with the maps to digitise from and a precision mark:
`firm` (a dated map or a chronology entry), `soft` (the line moved within
the keyframe, or the map is coarse) or `contested`.

### 5.1 How to represent control when it is not a line

The Green Books already solved this, and their solution suits a table.

1. **Land held is a filled area.** Store it as polygons per keyframe, with a
   `state`:
   - `held`: Japanese-controlled;
   - `garrisoned`: Japanese troops present by treaty, as in Indochina from
     September 1940 to 9 March 1945;
   - `allied-with-japan`: Thailand from 21 December 1941 (*verify* date);
   - `contested`;
   - `allied`;
   - `neutral`: Portuguese Timor before February 1942; Macau;
   - `soviet`: from 9 August 1945.

   Occupied China gets `held` with a `pointsAndLines: true` flag and `soft`
   precision. Japan held cities and railways (点と線 *ten to sen*, "points and
   lines"), and guerrilla areas lay behind them. Draw it as a hatch, not a
   solid fill.
2. **Small islands are features with dated intervals, not polygon slices.**
   An island or atoll carries `held: [{from, to, by}]` from the chronology,
   for example Kiska: `jp 1942-06-06 → 1943-07-29`. The table at any date is
   computed from those intervals, so it needs no interpolation. A held island
   cut off behind the front carries `cutOff: true` from the date it was
   bypassed:
   - Rabaul from early 1944; Truk from February 1944;
   - Wotje, Maloelap, Mili and Jaluit from February 1944;
   - Nauru, Ocean Island, Wake and Marcus;
   - Wewak from April 1944; Yap and Babeldaob from September 1944;
   - Rota and Pagan from August 1944.

   Smith's Map 1 of December 1944 says "Bypassed Japanese-held islands not
   indicated". The app should indicate them. Appleman's March 1945 map shows
   them as black specks inside a dashed ring around the Carolines [O].
3. **Groups of islands get a dashed perimeter.** The Green Books draw a dashed
   line enclosing the Japanese-controlled island area. Smith's 12 March 1944
   map runs it from Attu's longitude down past Wake to the Solomons. Store it
   as a LineString per keyframe, the "perimeter".
4. **Do not fill the sea.** The Atlas paints "ocean areas in the wake of our
   advance" as Allied. That is a US government framing of a contested ocean.
   The table should let the routes and battles show who used the sea. If a
   sea layer is wanted, use a soft gradient called "air cover", drawn from
   airfield ranges, and label it as an inference.
5. **Declared lines are their own layer:**
   - Japan's planned defensive perimeter of 1941 (Morton Map 1, *verify*);
   - the 絶対国防圏 *Zettai kokubōken*, Absolute National Defence Zone,
     decided in September 1943 (*verify* the date of the Imperial
     conference): the Kurils, the Bonins, the Marianas and Carolines (Truk),
     western New Guinea, the Sunda Islands and Burma (Morton Maps 9 and 14
     [O]);
   - General Order No. 1's lines at 16° N in Indochina and 38° N in Korea
     [O].

   They are dashed, labelled, and dated.

### 5.2 Maps to digitise from, and their licences

| map | date shown | where | licence | used for |
| --- | --- | --- | --- | --- |
| *Atlas of the World Battle Fronts in Semimonthly Phases to August 15, 1945* (Army Map Service), Pacific maps, Mercator with a 500-mile grid from Tokyo | every 1st and 15th, Jul 1943 – Aug 1945 | Commons `File:YYYY-MM-DDJapWW2BattlefrontAtlas.jpg` (960 × 925 px); Commons PDF from the CGSC Combined Arms Research Library (111 pp., 1,275 × 1,764 px pages); archive.org `atlasofworldbatt00unse` is lending-only (401) | PD (US government, Army Map Service) [O, file pages] | K3–K7. The images answered 429 here, so I could not judge how sharp the lines are at 960 px |
| Morton, *Strategy and Command*, Map I "The Japanese Offensive, December 1941–May 1942" (with "limit of advance, May 1942"); Map 1 "The Japanese Plan for War"; Map 9 "Japan's National Defense Zone, Southeast Area"; Map 14 "Progress and Prospects, 31 December 1943" (with "limit of Japanese advance, 1942") | Dec 1941 – Dec 1943 | HyperWar `USA/USA-P-Strategy/maps/` (I: 816 × 905) | PD (US Army CMH) | K0–K3, the defence zone [O, viewed I, 9, 14] |
| Smith, *Approach to the Philippines*, Map 1 "Situation in the Pacific, 12 March 1944" | 12 Mar 1944 | HyperWar `USA-P-Approach/maps/USA-P-Approach-1.jpg` (1,000 × 1,278) | PD | K4 check; includes occupied China [O, viewed] |
| Crowl, *Campaign in the Marianas*, Map 1 "Pacific Ocean Areas, 15 June 1944" | 15 Jun 1944 | HyperWar | PD | K4 [listed] |
| Cannon, *Leyte*, Map 2 "Situation in the Pacific, Mid-October 1944" | Oct 1944 | HyperWar | PD | K5 [downloaded, not examined] |
| Smith, *Triumph in the Philippines*, Map 1 "Situation in the Pacific, 15 December 1944" (Japanese-controlled areas solid; dashed perimeter) | 15 Dec 1944 | HyperWar (1,200 × 1,536) | PD | K5 [O, viewed] |
| Appleman et al., *Okinawa*, Map 1 "Strategic Situation in the Pacific" ("Japanese-controlled areas, March 1945") | Mar 1945 | HyperWar | PD | K6 [O, viewed] |
| Romanus and Sunderland, Map 17 "Situation in China, 15 March 1944"; Map 18 "ICHIGO Plan"; *Stilwell's Mission*, Map 1 "Japanese Plan, December 1941", Maps 3–4 (Burma 1942) | 1941–44 | HyperWar `USA-CBI-Command`, `USA-CBI-Mission` | PD | the China and Burma fronts [listed; Map 17 downloaded] |
| USSBS, *Campaigns of the Pacific War*, App. 10 "Japanese Southern Advance, 8 December 1941 – 10 March 1942"; inside back cover "Chart of Pacific Ocean Areas" | 1941–42 | archive.org `campaignsofpacif46unit` (PDF 22 MB, page images) | PD | K1 [O, list of plates] |
| *Reports of General MacArthur*, vol. I plates ("The Boundaries of the SWPA and the Extent of the Japanese Advance", "Japanese Dispositions and Capabilities, September 1942", …); vol. II (Japanese operations, compiled from Japanese demobilisation records) | 1942–45 | archive.org `ReportsOfGeneralMacarthurTheCampaigns`, `…JapaneseOperations`, `…JapaneseOperationsPt2` (CMH Pub 13-1 to 13-3, public-domain mark). The HyperWar transcription leaves the plates as placeholders | PD (US Army) | K1–K2 in New Guinea; the Japanese view [metadata O] |
| West Point (USMA Department of History) WWII Asia-Pacific atlas maps | 1937–45 | westpoint.edu (not opened); many on Commons tagged PD-USGov | *verify*: the maps descend from Esposito's *West Point Atlas of American Wars* (Praeger, 1959). Treat as probably PD and check each map | cross-checks only |
| Wikimedia Commons SVGs and PNGs of the empire's extent (e.g. `File:Japanese_Empire2.png`) | various | Commons | mostly **CC BY-SA** (R2 [R2]); tracing makes the front a ShareAlike derivative | finding aid only |
| Senshi Sōsho fold-out charts; JACAR track charts | 1941–45 | NIDS viewer, JACAR | not free to republish (R2) | facts only, cited |

### 5.3 The perimeters

Vertices are approximate (±0.5° or a named place). The order runs west to
east around the outside of Japanese control unless noted. "Sea arc" means
the perimeter crosses open ocean between island groups; draw it as the
dashed perimeter of §5.1.3.

**K0, the eve (6 December 1941).** Precision: `firm` for colonies and the
Mandate; `soft` for China; `firm` for Indochina's status.

- *Polygons, held*:
  - Japan with the Ryukyus, Bonins, Volcanoes and Kurils;
  - Karafuto south of 50° N; Korea; Taiwan and the Pescadores; Kwantung;
  - Manchukuo, including Jehol; Mengjiang (Inner Mongolia);
  - occupied China. Its western and southern edge runs: Baotou (40.6 N 110.0 E) on the Yellow River bend → down the Yellow River to its 1938 flood line → Kaifeng (34.8 N 114.3 E) → Xinyang (32.1 N 114.1 E) → Wuhan (30.6 N 114.3 E) → Yichang (30.7 N 111.3 E) → Yueyang (29.4 N 113.1 E) → Nanchang (28.7 N 115.9 E) → Hangzhou (30.25 N 120.2 E) → the coast. Shanxi is held along its railways around Taiyuan (37.9 N 112.6 E). *verify the whole China edge against Romanus and Sunderland Map 17 and the July 1943 Atlas map; the line moved little between 1939 and April 1944.*
  - coast enclaves: Canton and the Pearl River delta (23.1 N 113.3 E); Shantou (23.35 N 116.7 E); Xiamen (24.45 N 118.1 E); all of Hainan.
- *Polygons, garrisoned*: French Indochina.
- *Islands, held*: the South Seas Mandate:
  - the Marianas north of Guam (Saipan, Tinian, Rota, Pagan);
  - Palau; the Carolines (Yap, Truk, Ponape, Kusaie);
  - the Marshalls (Jaluit, Kwajalein, Wotje, Maloelap, Mili, Eniwetok).
- *Sources*: Morton Map 1 and Map I [O]; Romanus and Sunderland *Stilwell's Mission* Map 1 [listed]; Morton *Fall of the Philippines* Map 1 [listed]; USSBS App. 10.

**K1, the high tide in the south (8 May 1942).** Precision: `firm`. The
dashed "limit of advance, May 1942" on Morton Map I is the outer line [O].

- *Perimeter, ordered*:
  1. the Indo-Burmese frontier: Myitkyina (25.4 N 97.4 E; fell about 8 May *verify*) → the Chindwin at Homalin (24.9 N 94.9 E) and Kalewa (23.2 N 94.3 E) → Akyab (20.15 N 92.9 E; *verify* the date of occupation);
  2. sea arc → the Andamans (Port Blair 11.6 N 92.7 E) → Car Nicobar (9.2 N 92.8 E; *verify* date) → west of Sabang (5.9 N 95.3 E) → down the west coast of Sumatra → south of Java → Christmas Island (10.5 S 105.6 E) → south of Bali and Lombok → Timor (Koepang 10.2 S 123.6 E; Dili) → the Tanimbar, Aru and Kai Islands (*verify*);
  3. Dutch New Guinea coast: Fakfak (2.9 S 132.3 E) → Hollandia (2.5 S 140.7 E; occupied April 1942 *verify*) → Wewak (3.55 S 143.6 E) → Lae (6.7 S 147.0 E) and Salamaua (7.05 S 147.05 E; both 8 March) → the Huon Gulf;
  4. New Britain (Rabaul) and New Ireland (Kavieng) → the Admiralties (Lorengau, April *verify*) → Buka and Bougainville (Kieta, 23 January [O]) → the Shortlands → Tulagi (9.1 S 160.15 E; the chronology enters the occupation under 29 April with "see 3–4 May"; most accounts give 3 May, *verify*) → sea arc → the Gilberts (Butaritari, Makin 3.07 N 172.79 E) → Wake → Marcus → the Kurils.
- *Inside*:
  - the Philippines. Corregidor fell 6 May; the Visayas and Mindanao surrendered on the following days. Guerrilla areas are a `soft` overlay.
  - Malaya, Singapore, Borneo, Celebes, the Moluccas, Java, Sumatra, Bali, Hong Kong and Guam.
- *Thailand*: `allied-with-japan`.
- *Sources*: Morton Map I [O]; USSBS App. 10; *Reports of General MacArthur* vol. I plate "Disintegration of the Malay Barrier"; Romanus and Sunderland Map 4 (Burma, April 1942).

**K2, the greatest extent ashore (15 September 1942).** Precision: `firm`
for islands; `soft` for Kokoda (the line moved daily); `contested` on
Guadalcanal.

- *Changes from K1*:
  - **+** Attu (52.9 N 173.2 E) and Kiska (52.0 N 177.5 E), 6–7 June (two tellings: headline 5);
  - **+** Nauru (0.53 S 166.93 E) and Ocean Island (0.86 S 169.54 E), late August;
  - **+** Tarawa garrisoned (September, after the Makin raid of 17–18 August, *verify*) and Abemama (*verify*);
  - **+** Goodenough Island (25 August [O], a short-lived garrison);
  - **+** the Buna–Gona beachhead (from 21–22 July) and the Kokoda Track to Ioribaiwa ridge (~9.28 S 147.43 E, mid-September);
  - **contested**: Guadalcanal (the US perimeter at Lunga from 7 August) and Tulagi (US-held from 8 August [O]);
  - **not held**: Milne Bay (the Japanese withdrew 5 September [O]).
- *Perimeter, ordered from the north*: Attu → Kiska → sea arc west of Midway → Wake → the Marshalls (Mili) → the Gilberts (Tarawa) → Nauru → Ocean Island → sea arc → Santa Isabel → Guadalcanal (the Lunga perimeter as a hole) → the Papuan north coast (Buna 8.65 S 148.35 E) → Kokoda → Ioribaiwa → the Huon Gulf (Wau held by Australians, a hole) → K1's line west.
- *China*: the Zhejiang–Jiangxi campaign zone (May–September) is transient. Show it with the event, not in the front.
- *Sources*: Morton Map 14's "limit of Japanese advance, 1942" (dashed: Aleutians → east of Wake → east of the Marshalls and Gilberts → Ellice → Solomons) [O]; Morton Map 5 "The Battle Area, August 1942" [listed]; Milner Maps 3–4 [listed]; *Reports of General MacArthur* vol. I plate "Japanese Dispositions and Capabilities, September 1942".

**K3, 1 November 1943.** Precision: `firm` (Atlas, 1 November 1943).

- *Allied since K2*:
  - Solomons: Guadalcanal (9 February); the Russells (21 February *verify*); the New Georgia group (Munda 5 August *verify*; Kolombangara evacuated in October); Vella Lavella; the Treasury Islands (27 October *verify*); the Torokina beachhead on Bougainville (1 November);
  - Papua and New Guinea: Buna–Gona (January); Wau; Nassau Bay; Salamaua (11 September *verify*); Lae (16 September [O]); Nadzab and the Markham–Ramu valley; Finschhafen (2 October *verify*); Woodlark and Kiriwina;
  - the north: Attu (May); Kiska (re-entered 15 August);
  - the Ellice Islands and Baker Island (Allied bases from August–September [O]).
- *Perimeter*: the Kurils → sea arc (Wake, Marcus) → the Marshalls → the Gilberts (Tarawa, Makin, Abemama) → Nauru → Ocean Island → Bougainville and Buka (less Torokina) → the Shortlands → Choiseul → New Britain → New Ireland → the Admiralties → the New Guinea coast west of the Huon Peninsula (Sio, Madang, Wewak, Aitape, Hollandia) → K1's line west.
- *Burma*: the Arakan front at Maungdaw–Buthidaung (20.8 N 92.4 E); the Chindwin; the Hukawng valley (the Ledo Road's head near Shingbwiyang, 26.7 N 96.2 E [O, Atlas narrative]); the Salween front.
- *Defence Zone line*: drawn from Morton Map 9 [O].
- *Sources*: Atlas 1943-11-01 [file page O]; Morton Maps 10, 11 and 14.

**K4, 15 August 1944.** Precision: `firm` (Atlas, 15 August 1944).

- *Allied since K3*:
  - the Gilberts (20–23 November 1943);
  - the Marshalls: Majuro and Kwajalein (31 January – 4 February); Eniwetok (17–23 February). Wotje, Maloelap, Mili and Jaluit are held and cut off.
  - New Britain: Arawe (15 December); Cape Gloucester (26 December). Rabaul and the Gazelle Peninsula are held and cut off.
  - Green Island (15 February); Emirau (20 March); the Admiralties (29 February – May);
  - New Guinea: Saidor (2 January); Madang (April); Hollandia and Aitape (22 April); Wakde (17 May); Biak (27 May onward); Noemfoor (2 July); Sansapor (30 July). The Wewak pocket is held and cut off.
  - the Marianas: Saipan (9 July); Tinian (1 August); Guam (10 August). Rota and Pagan are held and cut off.
  - Burma: Imphal and Kohima repulsed; Myitkyina (3 August [O, Atlas narrative]).
- *China*: Ichi-Go adds Henan (April–May) and Hunan (Changsha in June, Hengyang on 8 August [O, Atlas narrative]). Draw a corridor south from Wuhan.
- *Perimeter*: the Kurils → the Bonins and Volcanoes (Iwo Jima) → Rota and Pagan (specks) → Yap → Palau (Peleliu) → Halmahera and Morotai → the Vogelkop (Manokwari; Sorong less Sansapor) → Timor → K1's line west to Burma (the Chindwin, retreating).
- *Sources*: Atlas 1944-08-15 [file page O]; Crowl Map 1 (15 June 1944) [listed]; Smith Map 1 (12 March 1944) [O].

**K5, 15 January 1945.** Precision: `firm` (Atlas, 15 January 1945; Smith,
15 December 1944).

- *Allied since K4*: Peleliu and Angaur (September – November); Ulithi (23 September *verify*); Morotai (15 September); Leyte and Samar (from 20 October); Mindoro (15 December); the Lingayen beachhead (9 January). Burma: across the Chindwin (December); Akyab (January 1945, *verify* date).
- *China*: Guilin and Liuzhou (November); Nanning (24 November *verify*); the corridor joined to Indochina (December [O, Atlas narrative]).
- *Perimeter, as drawn on Smith Map 1 [O]*: from southern Karafuto east to the tip of Kamchatka → arc south-west outside the Kurils, the Bonins and Marcus → west of Guam and Ulithi → between Yap (Japanese) and Ulithi (Allied) → west to north of Samar and Leyte → around Mindanao to the south → between the Talaud Islands and Morotai → south round the Moluccas and Timor → south of Java → west of Sumatra → north to Burma.
- *Cut off*: Truk and the Carolines; the Marshalls' atolls; Rabaul; Bougainville; Wewak; Nauru; Ocean Island; Wake; Marcus; Rota; Pagan; Yap; Babeldaob; the Vogelkop.
- *Sources*: Smith, *Triumph* Map 1 [O]; Atlas 1945-01-15; Cannon Map 2.

**K6, 1 July 1945.** Precision: `firm` (Atlas, 1 July 1945; Appleman, March
1945).

- *Allied since K5*:
  - Luzon (Manila 3 March [W]), except the northern pocket in the Cordillera around Kiangan (16.8 N 121.1 E), held until August;
  - the southern Philippines (Palawan, Panay, Cebu, Negros and Mindanao, less the Davao hills);
  - Iwo Jima (26 March); the Kerama islands, Okinawa and Ie Shima (22 June / 2 July);
  - Borneo: Tarakan (1 May); Brunei Bay and Labuan (10 June *verify*); the Balikpapan landing (1 July);
  - Burma: Meiktila (3 March *verify*); Mandalay (20 March *verify*); Rangoon (3 May [O, Atlas narrative]). Japanese remnants remain in the Pegu Yomas and Tenasserim.
- *China*: withdrawals from Guangxi (Nanning, Liuzhou, Guilin, May–July [O, Atlas narrative: "large-scale withdrawals from central and south China"]).
- *Indochina*: `held` from 9 March (the Japanese coup).
- *Perimeter*: the Kurils → Japan → the Ryukyus north of Okinawa (Amami) and the Sakishima Islands (Miyako, Ishigaki) → Formosa → (the Luzon pocket, a speck) → Celebes, Java, Sumatra, Borneo (less the beachheads) → Malaya → Thailand (`allied-with-japan`) → south-east Burma (Moulmein, Tenasserim) → Indochina → China.
- *Sources*: Atlas 1945-07-01; Appleman Map 1 (March 1945) [O].

**K7, 2 September 1945.** No front. Precision: `firm` for the zones (text of
the order); `soft` for the Soviet advance.

- *The Soviet advance*:
  - Manchuria (9–20 August);
  - Korea to the 38th parallel;
  - southern Karafuto (from 11 August *verify*);
  - the Kurils (Shumshu 18–23 August [W]; the southern islands into early September *verify*).
- *The surrender zones of General Order No. 1*, as polygons, with the five paragraphs (a)–(e) of headline 9 [O]:
  - (a) Chiang Kai-shek;
  - (b) Soviet;
  - (c) SEAC or Australia. Its split was "to be arranged between them" in the Wikisource text; the issued arrangement gave Borneo, New Guinea, the Bismarcks and the Solomons to Australia (*verify*).
  - (d) CINCPAC;
  - (e) CINCAFPAC.
- *The individual surrenders*: cards that fall after the span, for an epilogue strip. Examples: Truk, Palau and Pagan on 2 September [O, chron]; Rabaul, Singapore, Nanjing, Hong Kong, Taipei and Seoul in September and October (*verify* each date).
- *Sources*: go1 [O]; Atlas 1945-08-15; chron45 2 September [O].

---

## 6. The routes

Each route follows the Hawaiian contract (`DATA.md` "Routes"). This war needs
three changes to it:

1. **`kind`** gains `fleet` (a force of warships), `air` (an air route or
   strike), `campaign` (an advance drawn as a line of named places), `lane`
   (a route used again and again, the Hawaiian `trade`) and `schematic`.
2. **`pointPrecision`** gains `orders` for positions taken from operation
   orders: planned points, not positions logged at sea. JM-97's standby and
   approaching points are `orders`. The Nagumo chart's noon positions are
   `journal`.
3. **Each waypoint's date and time carries its clock** (§7). The Nagumo
   chart's dates are Tokyo dates; ComCruPac's are zone +10.

Positions read off a chart by eye are marked "chart ±0.5°". Every route is a
draft. A route marked [O] has its source opened; the rest are *verify*.

### 6.1 The Kidō Butai to Pearl Harbor and back (`kido-butai-hawaii-1941`)

- **kind** `fleet`.
- **when** 1941-11-26 → 1941-12-23. Tokyo dates throughout, as the Morton inset labels them ("26 NOV (TOKYO TIME)", "23 DEC (TOKYO TIME)").
- **event** `pearl-harbor-1941`. **direction** `oneway`, as a loop.
- **Sources**: jm97 [O]; ussbs-camp ch. II and App. 2 (track chart; plate not viewed) [O text]; morton-sc Map I inset [O]; Senshi Sōsho 10 fold-out (R2, title only).

| # | point | lat, lon | date (Tokyo) | precision | source and note |
| --- | --- | --- | --- | --- | --- |
| 0 | Hitokappu Bay, Etorofu | 44.9, 147.6 | 26 Nov, 0600 | narrative | ussbs-camp: "sortied from Hitokappu Bay at 0600, 26 November" [O] |
| 1 | east along about 43° N (a schematic segment) | 43, 165 E | 26 Nov – 2 Dec | schematic | inset shows a straight eastward leg to the 4 Dec turn |
| 2 | standby point and refuelling | 42, −170 (Combined Fleet Op. Order No. 5, "by the evening of 3 December") **or** 42, −165 (Nagumo's own order) | 3–4 Dec | orders | jm97 [O]; the refuelling "completed on 3 December" (ussbs-camp) [O]; the inset's 4 Dec turn |
| 3 | approaching point | 32, −157 | 6 Dec (X-1) | orders | jm97: "Around 0700 hours, X-1 Day the Task Force will turn southward at high speed (approximately 24 knots)" [O] |
| 4 | launching point, about 200 nautical miles north of Oʻahu | ~24.8, −158.0 | 8 Dec 0130 JST = 7 Dec 0600 HST (*verify*: jm97 plans 0100 JST = 0530 Honolulu; ussbs-camp has arrival 0730 Hawaiian time) | narrative | jm97; ussbs-camp ("200 miles north of Oahu") [O]. The two disagree on the hour, which goes in the tellings |
| 5 | retirement north-west; skirt 800 nautical miles north of Midway | ~41.5, −177 (computed: Midway + 800 nmi north) | 8–15 Dec | orders | jm97 ("skirt 800 nautical miles north of Midway") [O] |
| 6 | detach Carrier Division 2 (Sōryū, Hiryū), two cruisers and two destroyers for Wake | ~33, 170 E *verify* (read off the inset, which has no graticule) | 16 Dec | schematic | morton-sc inset: "2 CV 2 CA 2 DD (16 DEC)" [O] |
| 7 | assembly point | 30, 165 E | about 17 Dec | orders | jm97 ("via the assembly point (30 N, 165 E)") [O] |
| 8 | Hashirajima, western Inland Sea | 34.0, 132.4 | 23 Dec | narrative | morton-sc inset "23 DEC (TOKYO TIME)" [O]; jm97 "about X + 15 Day to the western part of the Inland Sea" |

Add a short spur `cardiv2-wake-1941`: point 6 → Wake (19.29, 166.60), 21–23
December (the inset's "22 DEC Wake"), then home; `schematic`.

### 6.2 The landings in Malaya and the Philippines (`malaya-convoy-1941`, `philippines-landings-1941`)

**Malaya** (`fleet`; 1941-12-04 → 12-08; `narrative`):

- Samah (Sanya), Hainan (18.25, 109.5); sailed 4 December *verify*;
- Cam Ranh Bay (11.9, 109.2), JM-97's preparatory point for the "Malay Invasion Force" [O];
- off Cape Cà Mau (8.5, 104.6);
- across the Gulf of Thailand to Singora (7.20, 100.60), Patani (6.87, 101.25) and Kota Bharu (6.13, 102.24).

Sources: ussbs-camp App. 10; morton-sc Map I (the arrows from Saigon and Hainan) [O].

**Philippines** (`fleet`; 1941-12-08 → 12-24; three lines, `narrative`):

1. Mako (Bako), Pescadores (23.57, 119.57) and Takao (22.6, 120.3) → Aparri (18.36, 121.63) and Vigan (17.57, 120.39) on 10 December → Lingayen Gulf (16.1, 120.3) on 22 December [O, chron];
2. Palau (7.35, 134.47) → Legaspi (13.14, 123.74) on 12 December, and Davao (7.07, 125.61) on 20 December;
3. Amami Ōshima (28.3, 129.5) → Lamon Bay (14.0, 121.8) on 24 December.

Sources: morton-pi Maps 3–5 [listed]; JM-97 ("Philippine Invasion Force: Bako (Formosa)") [O].

### 6.3 The Indian Ocean raid (`indian-ocean-raid-1942`)

- **kind** `fleet`; **when** 1942-03-26 → 1942-04-22; precision `narrative` with schematic stretches.
- **Sources**: chron42 5 and 9 April [O]; wp Indian Ocean raid (Boyd 2017; Shores, Cull and Izawa) [W]; ussbs-camp App. 11 [O, list].

Route:

1. Staring Bay, south-east Celebes (~4.0, 122.6 *verify*), sailed 26 March [W];
2. south through the Banda Sea and Ombai Strait (*verify*; a schematic segment);
3. the Indian Ocean south of Java;
4. west to south of Ceylon, for the Colombo strike on 5 April (~1–2 N, 80 E *verify*);
5. the Cornwall and Dorsetshire sinkings south-west of Ceylon (5 April);
6. a circuit east of Ceylon, for the Trincomalee strike and the Hermes sinking off Batticaloa on 9 April (~7.5, 82 *verify*);
7. east, passing south of the Andamans on the night of 11–12 April [W];
8. the Malacca Strait, passing Singapore on 13 April [W], where the 5th Carrier Division detaches for the South Pacific;
9. the South China Sea;
10. Japanese home waters from 22 April [W].

A second line, `malaya-force-1942`, shows Ozawa's force: Mergui (12.43,
98.60) on 1 April [W] → the northern Bay of Bengal off Orissa (~19.5, 86.5
*verify*) on 6 April → back to Singapore. `schematic`.

### 6.4 The Doolittle raid (`doolittle-1942`)

- **kind** `air` (with a `fleet` approach); **when** 1942-04-02 → 04-18 (the fleet), 04-18 → 04-19 (the bombers).
- **Sources**: doolittle [O] ("the take-off was made at Latitude 35° 43′N Longitude 153° 25′E approximately 824 statute miles East of the center of Tokyo"; plane 8 "landed in Siberia, 40 miles north of Vladivostok"; plane 1 "landed near Tian Mushem, abt 70 miles north of Chuchow"); chron42 18 April [O].

The approach: Alameda (off the table) → the meeting of TF 16 and TF 18 in the
North Pacific (*verify*; schematic) → take-off at 35.717, 153.417.

The bombers, drawn as a fan of schematic lines:
- Tokyo (35.68, 139.77) and Yokosuka (35.28, 139.67);
- Yokohama (35.44, 139.64);
- Nagoya (35.18, 136.91);
- Kobe (34.69, 135.20) and Osaka;
- then across the East China Sea to the Zhejiang and Jiangxi coast and inland toward Quzhou/Chuchow (28.97, 118.87), the intended field;
- and one aircraft north to near Vladivostok (~43.6, 132.0 *verify*; "40 miles north").

`pointPrecision` is `narrative` for the take-off and the targets. Every
other point is `schematic`.

### 6.5 The Coral Sea approaches (`coral-sea-1942`)

All `schematic` unless marked. **Sources**: chron42 2–8 May [O]; ussbs-camp ch. IV and App. 17 (Shōhō's track) [O, list]; nwc-coral (archive.org) [R2]; macarthur-1 plate "Battle of the Coral Sea".

| line | from → waypoints → to | dates |
| --- | --- | --- |
| Tulagi Invasion Force | Rabaul (4.20, 152.17) → Tulagi (9.10, 160.15) | to 3 May (the chronology enters the occupation under 29 April; 3 May in most accounts, *verify*) |
| Port Moresby Invasion Force | Rabaul → south of the Trobriands → toward the Jomard Passage (11.25, 152.1) → turned back 8 May; Port Moresby (9.48, 147.15) the objective | 4 → 8 May |
| Shōhō and the support group | Shortlands (6.97, 155.87) → off Misima, sunk at 10.48, 152.92 (`journal`: the chron position) | 3 → 7 May |
| MO Carrier Striking Force (Shōkaku, Zuikaku) | Truk (7.4, 151.8) → east of the Solomons, round San Cristobal (~11, 163 *verify*) → into the Coral Sea → the 8 May strike area (~13, 156.5 *verify*) | 1 → 8 May |
| TF 17 (Yorktown), with TF 11 (Lexington) from 1 May | the Coral Sea, ~16, 162 (*verify*) → the 4 May Tulagi strike from south of Guadalcanal (~11, 158) → west → hit at 14.58, 155.25 on 8 May (`journal`: the chron position) | 1 → 8 May |
| TF 44 (Crace) | detached toward the Jomard Passage (~11.5, 152) | 7 May |

### 6.6 The Midway approaches (`midway-1942`)

**The Kidō Butai** (`fleet`; `journal`, chart ±0.5°; Tokyo dates; noon
positions marked "N"). Read off the Nagumo report's "Track Chart, Battle of
Midway" [O] with `r3-scripts/nagumo_points.py`. The chart is Mercator, and
the calibration allows for a slight tilt in the scan.

| # | chart label | lat | lon | note |
| --- | --- | --- | --- | --- |
| 0 | N/27 | 32.7 N | 132.6 E | Bungo Strait: "0400 sortie of screening unit, 0600 sortie of main unit"; the report: "At 0600 27 May the force departed" [O] |
| 1 | N/28 | 28.3 N | 140.0 E | "rendezvous with supply unit", 1430 |
| 2 | N/29 | 29.1 N | 144.1 E | |
| 3 | N/30 | 30.9 N | 150.0 E | "air action drill" |
| 4 | N/31 | 32.8 N | 155.7 E | refuelling |
| 5 | N/1 | 34.2 N | 161.2 E | refuelling ("On 1 and 2 June all ships were refueled") [O] |
| 6 | N/2 | 36.0 N | 166.8 E | "thick fog" |
| 7 | N/3 | 37.1 N | 171.4 E | "intermittent fogs continue"; turn south-east |
| 8 | N/4 | 34.8 N | 175.0 E | |
| 9 | 0130/5 | 31.5 N | 179.6 E | launch of the Midway strike: 0130 JST 5 June = 0430 Midway local 4 June |
| 10 | 0400/5 | 30.7 N | 179.3 W | 0700 Midway local; the carriers are hit about 0722 JST (1022 local) near 30.3–30.6 N, 179.1–179.3 W (chron positions for Kaga, Sōryū and Akagi [O]) |

The retirement on the same chart is harder to read. Points read: 06/6 at
32.1 N 176.2 E; N/7 at 33.4 N 169.3 E; 1245/7 at 28.8 N 169.0 E; refuelling
06/9 at 28.0 N 163.2 E; 20/9 at 26.6 N 160.3 E; 13/10 at 26.7 N 155.1 E;
N/11 at 28.7 N 148.1 E; then back to the Inland Sea at "18 kt". These
probably mix the Main Body's track with the Kidō Butai's. **Re-read from the
JACAR original (C08030023600–24100) before use.** The report's own text
gives Yamamoto's post-battle refuelling point as "33N, 170 E" on 7 June [O].

**The Main Body** (Yamamoto, Yamato): from Hashirajima 29 May (*verify*),
trailing the Kidō Butai. On the Nagumo chart, "MB 09/5" sits at about
34.5 N 171.4 E [O, chart ±0.5°]. `narrative`.

**The Invasion (Occupation) Force**: transports from Saipan (15.2, 145.7)
and Guam, sailing 27–28 May JST (*verify*), approach from the west-south-west.
CINCPAC: first sighted at "about 0900 … bearing 261° distant 700 miles from
Midway" on 3 June (zone +12) [O]. That computes to about 26.4 N 169.6 E. The
Nagumo chart puts the "Occupation Force 08/?" at about 28.1 N 175.0 E [O,
chart]. `narrative`.

**TF 16 and TF 17** (`journal`, zone +10, US dates):

| # | point | lat, lon | when | source |
| --- | --- | --- | --- | --- |
| 0 | Pearl Harbor | 21.36, −157.95 | TF 16 sailed 28 May, TF 17 30 May (*verify*) | oni-mid ("After leaving Pearl Harbor, these two task forces refueled at sea and effected their rendezvous northeast of Midway on June 2d") [O] |
| 1 | the rendezvous ("Point Luck" in the secondary works, *verify*) | 32.07, −172.75 | 2 June 1730 (zone +10) | crupac-mid: "Task Force SIXTEEN was sighted in Latitude 32 - 04 N., Longitude 172 - 45 W. at 1730, June 2, 1942" [O] |
| 2 | west, then north, on 3 June | — | 3 June | crupac-mid [O] (a schematic segment) |
| 3 | toward "a point two hundred miles North of Midway" | ~31.5, −177.4 (computed) | night of 3–4 June | crupac-mid [O] |
| 4 | Yorktown's 1600 position | 33.87, −176.00 | 4 June 1600 (zone +10) | crupac-mid [O] |
| 5 | Yorktown sinks | 30.60, −176.57 | 7 June | chron42 [O] |

### 6.7 The Tokyo Express (`tokyo-express-1942`)

- **kind** `lane`, `schematic`; **when** 1942-08 → 1943-02.
- **Route**: Shortland Harbour / Faisi (6.97, 155.87) → down New Georgia Sound between Choiseul and Santa Isabel to the north-east and New Georgia to the south-west (8.0, 158.0) → past the Russells' latitude → off Cape Esperance (9.25, 159.70) and Tassafaronga (9.37, 159.88) → back before dawn.
- **Sources**: oni-gc [O]; miller-gc [R2]; jm-98 [R2]; wd.

### 6.8 The Guadalcanal approaches, 12–15 November 1942 (`guadalcanal-naval-1942`)

**Sources**: oni-gc Parts One to Three [O]; ussbs-camp App. 47 (nine track
charts) [O, list]; Atago's and Inazuma's reports (JACAR, R2); Morison V [R2].
Times in ONI Part One are zone −11; in Parts Two and Three, zone −12 (§7).

| line | route | dates | precision |
| --- | --- | --- | --- |
| Callaghan's TG 67.4 and Scott's group | Espiritu Santo (−15.5, 167.2); Scott "passed north of San Cristobal Island" [O] → Indispensable Strait (−9.2, 160.6) → Lengo Channel → Savo Sound off Lunga | 9–13 Nov | narrative [O] |
| Abe's Raiding Group (Hiei, Kirishima) | Truk → the Shortlands area → south toward Savo, approaching from the north (*verify* whether east or west of Santa Isabel) → action off Lunga on the night of 12–13 Nov; Hiei sinks north of Savo on 13 Nov | 9–13 Nov | schematic (*verify* from App. 47 and JACAR) |
| Mikawa's bombardment force | Shortlands → down the Slot → shells Henderson Field on the night of 13–14 Nov → retires; attacked next morning near 8.75 S, 157 E ("08°45′ S., longitude 157…") [O] | 13–14 Nov | narrative |
| Tanaka's transports | Shortlands (sailed 12 Nov *verify*) → down the Slot → attacked all day on 14 Nov (aircraft change course at "09°10′ S., longitude 157°50′ E") [O] → the survivors beach at Tassafaronga (9.37, 159.88) on 15 Nov | 12–15 Nov | narrative |
| Kondō's Emergency Bombardment Force (Kirishima, Atago, Takao) | from the north → Sendai's screen east of Savo, the main body west → action south-east of Savo; Kirishima sinks at 9.17 S, 159.87 E [O] | 14–15 Nov | schematic; re-read from Atago's report |
| Lee's TF 64 (Washington, South Dakota, four destroyers) | from south of Guadalcanal → "having rounded the western end of Guadalcanal, passed between Savo and the Russell Islands. Course was 020° T." [O] → north of Savo → turns east, then south-west; "by 0000 Task Force LOVE was 13.5 miles southeast of the southernmost point of Savo" [O] → action at 0016 (zone −12) → retires south-west | 14–15 Nov | narrative [O] |

### 6.9 The Central Pacific drive (`central-pacific-1943-44`)

- **kind** `campaign`, `schematic`; **when** 1943-11-20 → 1944-11-27.
- **Route**: Pearl Harbor → Tarawa and Makin (20 Nov 1943) → Majuro and Kwajalein (31 Jan – 1 Feb 1944) → Eniwetok (17 Feb) → Saipan (15 Jun) → Guam (21 Jul) and Tinian (24 Jul) → Peleliu (15 Sep) and Ulithi (Sep).
- The Truk strike (17–18 Feb) is a spur from the Marshalls.
- **Sources**: atlas Dec 1943 – Oct 1944 [O]; ussbs-camp chs. IX–XI [O]; crowl-love, crowl-mar [listed].

An optional companion, `new-guinea-1943-44` (`campaign`, schematic): Buna
(Jan 1943) → Lae (Sep 1943) → Finschhafen → Saidor (Jan 1944) → Hollandia
(Apr) → Wakde (May) → Biak (May) → Noemfoor (Jul) → Sansapor (Jul) →
Morotai (Sep 1944). Source: ussbs-camp App. 65, "Chart of Allied Advance
Along New Guinea Coast" [O, list].

### 6.10 The Leyte approaches (`leyte-gulf-1944`)

**Sources**: ussbs-camp ch. XII, App. 93 ("Chart of Battle for Leyte Gulf,
the Approach of the Japanese Forces 15–25 October 1944") [O, text]; chron44
23–25 October [O]; nwc-leyte vols I–III and V [R2]. From the ussbs-camp text
[O]:

- the First Diversion Attack Force "reached Brunei on the 20th, fueled, split into two parts, and departed on the 22d. The main strength headed northeast along the western coast of Palawan …, while a smaller group … sailed eastward through the Sulu Sea";
- the Second Diversion Attack Force, "leaving the Pescadores on the 21st, came southward past western Luzon, and after replenishing in the Calamian Islands, came south again";
- the Main Body "sortied from Bungo Passage on the afternoon of the 20th, sailed south until evening of the 22d when it turned southwest".

| line | waypoints | dates | precision |
| --- | --- | --- | --- |
| **Kurita** (Center Force, First Diversion Attack Force main body) | Lingga Roads (−0.2, 104.6) → Brunei Bay (5.0, 115.0; arrived 20 Oct, sortied 0800 on 22 Oct [O]) → Palawan Passage (Atago sunk 9.40, 117.18; Maya 9.47, 117.33, on 23 Oct [O]) → Mindoro Strait (~12.3, 120.8) → Sibuyan Sea (Musashi sunk 12.83, 122.58, on 24 Oct [O]) → San Bernardino Strait (12.55, 124.25; night of 24–25 Oct) → down the east coast of Samar → off Samar (Johnston sunk 11.77, 126.15, on 25 Oct [O]) → north, then back through San Bernardino on the night of 25–26 Oct → Brunei (28 Oct *verify*) | 18–28 Oct | narrative; the sinkings `journal` |
| **Nishimura** (Force C) | Brunei (sortied 22 Oct [O]) → Balabac Strait (7.8, 117.0) → Sulu Sea → Mindanao Sea, attacked "off Negros" on 24 Oct [O] → Surigao Strait (Fusō and Yamashiro sunk 10.42, 125.33, on 25 Oct [O]) | 22–25 Oct | narrative |
| **Shima** (Second Diversion Attack Force) | Bungo Channel (sortied "0700, 15 October") → Amami Ōshima (28.3, 129.5) → Bako, Pescadores (23.57, 119.57; 20–21 Oct) → down western Luzon → Coron Bay, Calamian Islands (12.0, 120.2) → Sulu Sea → Surigao Strait behind Nishimura → turns back (25 Oct) | 15–25 Oct | narrative [O] |
| **Ozawa** (Main Body, the decoy) | Bungo Channel (afternoon of 20 Oct) → south to the evening of 22 Oct → south-west toward northern Luzon → off Cape Engaño (Zuikaku sunk 19.33, 125.85, on 25 Oct [O]) | 20–25 Oct | narrative [O] |
| **Halsey** (TF 38 north; TF 34 back south) | east of Samar and San Bernardino (~13, 125.7; 24 Oct) → north through the night → off Cape Engaño (25 Oct) → TF 34 turned back south late in the morning (*verify* time) → off San Bernardino too late on the night of 25–26 Oct (*verify*) | 24–26 Oct | schematic |

### 6.11 Ten-Gō (`ten-go-1945`)

- **kind** `fleet`; **when** 1945-04-06 → 04-07 (JST; the US carriers' zone *verify*).
- **Sources**: ussbs-camp ch. XIV and App. 100–103 [O]; chron45 7 April [O]; Senshi Sōsho 17, 付図第三 軍艦大和行動図 (R2); JACAR C08030103100 (R2).

| # | point | lat, lon | when | precision |
| --- | --- | --- | --- | --- |
| 0 | Tokuyama, Inland Sea | 34.03, 131.80 | 6 Apr 1520: "sortied from Tokuyama" [O] | narrative |
| 1 | Bungo Channel | 32.9, 132.1 | evening of 6 Apr: "located … through the Bungo channel during the evening of 6 April by United States submarines" [O] | narrative |
| 2 | south of Kyushu, the Ōsumi Strait (~31.0, 130.8) | — | night of 6–7 Apr | schematic |
| 3 | west into the East China Sea; contacted at 0822 by carrier search aircraft [O] | ~31.0, 129.0 *verify* | 7 Apr 0822 | schematic |
| 4 | attacks from about 1240 [O]; Yamato "capsized and blew up" at 1423 [O] | 30.37, 128.07 [W] **or** 30.67, 128.05 [O, chron] | 7 Apr 1423 | journal (two tellings) |
| 5 | the surviving destroyers "retired to Sasebo" [O] | 33.16, 129.72 | 7–8 Apr | narrative |

### 6.12 The B-29 routes (`b29-marianas-1944-45`, `matterhorn-1944`)

- **kind** `air` / `lane`, `schematic`.
- **Marianas, 1944-11-24 → 1945-08-15**:
  - from Isley Field, Saipan (15.12, 145.73), North Field, Tinian (15.07, 145.63), and North Field, Guam (13.58, 144.93);
  - north past Iwo Jima (24.78, 141.32), used for emergency landings from March 1945 [O, Atlas narrative];
  - landfall on Honshu near Mount Fuji or the Izu peninsula (~35.0, 138.8 *verify*);
  - to Tokyo, Nagoya, Osaka and Kobe.
- **Matterhorn, 1944-06-15**: the Kharagpur bases, India (22.33, 87.32) → Chengdu (30.6, 104.0; the forward fields) → Yawata (33.87, 130.80).
- **Sources**: craven-cate V [O, index]; ussbs-air (archive.org text) [O, downloaded, not read through].
- **Do not draw the two atomic missions as lines.** Hiroshima and Nagasaki are pins and cards (the brief's tone rule: never spectacle; R8 to confirm).

### 6.13 The submarine lanes (`submarine-lanes`)

- **kind** `lane`, `schematic`; **when** 1942-01 → 1945-08.
- **Sources**: ussbs-trans (archive.org; plates not opened); janac (archive.org; position lists) [metadata O]; ussbs-camp ch. XVI and App. 112 ("Shipping Escort Organization, Including Charts 1, 2 and 3") [O, list]; chron (many sinking positions) [O].
- **A data-driven option**: plot JANAC's sinking positions by month as a fading dot layer, which shows the lanes without drawing them. JANAC is US government work (PD).

| lane | points |
| --- | --- |
| US patrols from Pearl Harbor | Pearl Harbor → Midway (refuelling) → the "Empire" patrol areas off Honshu, Kyushu and the Bungo Strait; the Luzon Strait ("Convoy College", 18–22 N, 118–122 E); the East China Sea; the Yellow Sea; the Sea of Japan via the Tsushima Strait (June 1945 *verify*) |
| US, British and Dutch patrols from Fremantle and Ceylon | Fremantle (−32.05, 115.75) → Lombok Strait (−8.8, 115.7) → the Java and South China Seas; Trincomalee → the Malacca Strait |
| Japan's oil and convoy route | Palembang, Miri and Balikpapan → Singapore (1.27, 103.83) → Saigon and Cam Ranh → the Hong Kong and Formosa coast (Takao) → the Formosa Strait → Moji and Shimonoseki (33.95, 130.95) |
| Japan's Pacific supply lines | Yokosuka → Saipan → Truk; Palau → New Guinea; Truk → Rabaul |

### 6.14 The surrender at Tokyo Bay (`tokyo-bay-1945`)

- **kind** `fleet`, `schematic`; **when** 1945-08-27 → 1945-09-02.
- **Route**: Sagami Bay (35.2, 139.4) → the Uraga Channel → the anchorage off Yokosuka and Yokohama; Missouri anchored at 35.355, 139.760 [W].
- **Sources**: chron45 27 August – 2 September [O, partly read]; wd.

### 6.15 Others worth a line (tier 2)

- **The Aleutian attack**: Kakuta's Second Mobile Force from Ōminato (*verify*) → south of the Aleutians → Dutch Harbor (3–4 June), then "about 400 miles south of Kiska" [O, ussbs-camp]. Plus the Attu and Kiska occupation forces (6–7 June). App. 26.
- **The Kiska evacuation** (28–29 July 1943): Paramushiro → round to Kiska in fog → back. App. 27 is a track chart [O, list].
- **The Kidō Butai to Darwin** (Palau → the Banda Sea, February 1942) and to the Java Sea and the Indian Ocean south of Java (March 1942: Pecos sunk at −14.45, 106.18 [O]).
- **The Hump** (`lane`): Chabua → Kunming.
- **The Burma Road and the Ledo Road**: as lines on land, not routes. They need the land layer.

---

## 7. Calendars and clocks

### 7.1 Dates either side of the date line

In 1941–45 the date line ran much as it does today in the North Pacific. It
bent west round the Aleutians, so Attu and Kiska kept Alaska's date. Midway
(177° W) and Hawaiʻi lie east of it and keep the American date. Wake, Guam,
the Marshalls, the Gilberts, the Solomons and everything to the west share
Japan's date. The arithmetic below uses the offsets in the IANA tz database
(2026e, local; tertiary) together with the clocks the records state.

| event | the place's date and clock | the Japanese record's date and clock | in UTC |
| --- | --- | --- | --- |
| Pearl Harbor, first bombs | Sun 7 Dec 1941, about 0755 HST (UTC−10:30) | Mon 8 Dec, about 0325 JST | 7 Dec 1825 UTC |
| Kota Bharu, first landing | 8 Dec, shortly after midnight Malayan time (UTC+7:30; *verify* the minute) | 8 Dec, about 0200 JST | 7 Dec about 1700 UTC: **about an hour and a half before Pearl Harbor** |
| Hong Kong | 8 Dec, morning (UTC+8:30, Hong Kong's 1941 summer offset in tzdb *verify*) | 8 Dec | — |
| Midway, the dive on Kaga | 4 Jun 1942, 1022 zone +12 (Midway); 1222 zone +10 (US carriers) | 5 Jun, 0722 JST | 4 Jun 2222 UTC |
| Kiska landing | 6 Jun 1942, 1500 zone +10, west-longitude date (USSBS) [O] | 7 Jun, about 1000 JST (computed) | 7 Jun 0100 UTC |
| Komandorski Islands | 26 Mar 1943 (US) *verify* | 27 Mar (wd) *verify* | — |
| Washington opens fire | 15 Nov 1942, 0016 zone −12 (ONI Part Three) = 14 Nov, 2316 zone −11 (Morison) | 14 Nov, 2116 JST | 14 Nov 1216 UTC |
| Samar, first contact | 25 Oct 1944, about 0645 "Item" (UTC+9) | 25 Oct, about 0645 JST (the same clock) | 24 Oct about 2145 UTC |
| Hiroshima | 6 Aug 1945, 0815 JST | the same | 5 Aug 2315 UTC; 5 Aug 1915 Washington (EWT) |
| The broadcast | 15 Aug 1945, 1200 JST | the same | 15 Aug 0300 UTC; 14 Aug 2300 EWT. Truman's announcement at 1900 EWT on 14 Aug is 0800 JST on 15 Aug, four hours **before** the broadcast |
| The surrender | 2 Sep 1945, morning JST | the same | 1 Sep evening in Washington. Truman proclaimed 2 Sep as V-J Day (*verify*); Britain and Australia keep 15 Aug; Japan's 終戦の日 is 15 Aug; China's Victory Day is 3 Sep (*verify*) |

Two consequences for the app:

- **The timeline orders events by UTC instant.** Labels show each place's own
  civil date, so the Pearl Harbor card says 7 December and the Malaya card 8
  December. Malaya still sorts first.
- **Cards for Midway, the Aleutians and Pearl Harbor show both dates**: "4
  June (5 June in Japanese records)".

### 7.2 The clocks the record uses, battle by battle

US Navy zone descriptions give the correction to *add* to local time to
reach GMT. So "zone plus 10" is UTC−10, and "zone minus 9" is UTC+9. The
letters follow the standard military scheme: I (Item) = UTC+9, K (King) = +10,
L (Love) = +11, M (Mike) = +12; W (William) = UTC−10, Y (Yoke) = UTC−12. The
wartime phonetic names are *verify*; the letters are standard.

| battle | Japanese record | US record | sources |
| --- | --- | --- | --- |
| **Midway** (v1) | Tokyo time and Tokyo date: "all dates in this report and all times are in Tokyo time, Plus 9"; editor's note: "These Japanese dates … would be reckoned as 31 May and 1 June in U.S. reports" | **three clocks**. Midway and CINCPAC: zone +12 (UTC−12): "All times in this rept are Zone plus 12"; ONI: "All times given in this narrative are zone plus 12". TF 16 and TF 17: zone +10 (UTC−10): "times given by them are Zone plus 10"; ComCruPac: "All times are local, plus ten zone". Hawaiʻi itself: Hawaii War Time, UTC−9:30, from 9 Feb 1942 (tzdb) | nagumo, cincpac-mid, oni-mid, crupac-mid [all O]; R2 §3 |
| **Naval Battle of Guadalcanal** (v1) | Tokyo time. Inazuma runs 十一月十四日二〇〇〇 to 十五日〇一〇〇, that is 14 Nov 2000 → 15 Nov 0100 JST (R2) | **two zones**. ONI Part One: "All times in Part I are Zone minus 11". Parts Two and Three: "All times in Part Two are Zone minus 12. Occasionally the original reports are not clear as to the zone used", and "All times in this section are Zone minus 12". Morison V uses −11 (R2) | oni-gc [O]; R2 |
| **Samar** (v1) | Tokyo time | "Item (Zone −9)", the same clock as Tokyo; Hoel's times are "from memory" (R2) | R2 |
| Pearl Harbor | Tokyo time (JM-97: take-off at "0100 hours X Day (0530 Honolulu time)") [O] | Hawaii Standard Time, UTC−10:30 (tzdb) | jm97 [O] |
| Aleutians | Tokyo time (*verify*) | zone +10, west-longitude dates (USSBS: "150th meridian west longitude, zone plus 10, time and date"; "13 June (east longitude date)" for a Japanese action) [O] | ussbs-camp ch. VI [O] |
| Leyte (submarines) | — | "How" (zone −8), corrected to Item by Morison (R2) | R2 |
| Coral Sea, Philippine Sea, Ten-Gō | Tokyo time | *verify* each report's zone line before choreography | — |

**Occupied places changed clocks.** Japan put occupied territories on Tokyo
time. tzdb shows Singapore, Malaya, Manila, Hong Kong, the Indies (from
March 1942), Rangoon, Guam, Kwajalein and Nauru at UTC+9 during occupation
[O, computed]. A "local time" for an event in Manila in 1943 is therefore
Tokyo time. tzdb's pre-1970 Pacific entries are approximations. **Midway's
zone +12 is not in tzdb at all**: `Pacific/Midway` links to Pago Pago
(UTC−11).

### 7.3 Calendars in the record

- **Japan**: years by 昭和 Shōwa (Shōwa 16 = 1941 … Shōwa 20 = 1945; the
  Gregorian year minus 1925), and sometimes by 皇紀 kōki, the imperial era
  (2601 = 1941). The Zero is the "Type 0" fighter after kōki 2600 = 1940.
  Months and days are Gregorian. Times are 24-hour, often in kanji numerals
  with 〇 (〇七二〇 = 0720).
- **Republic of China**: 民國 Minguo years (Minguo 30 = 1941; the Gregorian
  year minus 1911).
- **Manchukuo**: 大同 Datong (1932–34), then 康徳 Kangde (Kangde 8 = 1941)
  *verify*.
- **Thailand**: the Buddhist Era. Thailand moved its new year from 1 April to
  1 January in 1941, so BE 2483 was a short year (*verify*). Thai documents of
  early 1941 can be off by a year in naive conversion.
- **Korea and Taiwan** under Japanese rule used Shōwa years.

### 7.4 Recommendation: how the data stores dates and times

1. **`when` keeps the Hawaiian form** (`from`, `to`, `precision`). Dates are
   written in the **civil date of the place**, as the record kept there
   writes it. An optional `alt` gives the other side's date where it
   differs: `"alt": [{ "clock": "jst", "from": "1942-06-05" }]`.
2. **Every clock time is RFC 3339 with the source's numeric offset, exactly
   as the source states it**:
   `{ "t": "1942-11-15T00:16+12:00", "clock": "usn-z-12", "source": "oni-gc", "where": "Part III" }`.
   The bake computes `utc` for ordering and for the battle engine. When two
   sources time the same moment, the check converts both and flags any gap
   beyond a tolerance (say 15 minutes). That is how a mislabelled zone gets
   caught.
3. **A small `clocks.json`** names each clock: `jst` (+09:00, "Tokyo time"),
   `usn-z+12` (−12:00, "zone plus 12, Midway"), `usn-z+10` (−10:00, "zone plus
   10, the US carriers"), `usn-z-11`, `usn-z-12`, `usn-item` (+09:00),
   `hst-1941` (−10:30), `hwt` (−09:30), `malaya-1941` (+07:30) and so on. Each
   entry says which side and which documents used it.
4. **Do not use IANA zone names for these.** Their 1940s Pacific history is
   approximate and has no zone +12 for Midway. Store numeric offsets and
   format by arithmetic. JavaScript `Date` parses the offset but forgets it,
   so keep the string.
5. **In a battle box, show one clock and give the other side's beside it**:
   "1022 Midway time · 0722 Tokyo time, 5 June". The box's main clock is the
   US zone of the box's position (Midway +12, Guadalcanal −11, Samar −9),
   because the scored sortie is timed against the US records. Morison's −11
   for Guadalcanal agrees with the zone of the sea itself, so convert ONI's
   −12 times into it and keep the original in `tellings`.

---

## 8. Decisions for the designer

| # | decision | recommendation | why |
| --- | --- | --- | --- |
| D1 | Prologue: 1931 or 1937 | **Cards from 1931 (Mukden); the map from 6 December 1941**, with an optional October 1938 sub-keyframe for China | Respects the East Asian telling (the "Fifteen Years' War" and the "fourteen-year war", *verify*) without digitising a land war the app otherwise does not draw. The China front moved little between 1939 and April 1944 |
| D2 | Keyframes | **Eight**: 1941-12-06, 1942-05-08, 1942-09-15, 1943-11-01, 1944-08-15, 1945-01-15, 1945-07-01, 1945-09-02 | Each matches a dated public-domain map. From July 1943 the Atlas has a map for that exact date |
| D3 | Table extent | **78° E – 155° W, 42° S – 56° N; AEQD centred on 7° N 141.5° E** | Brings in Colombo and Trincomalee for the Indian Ocean raid, and Assam and Calcutta for the Hump; keeps ω under 12° everywhere named. Costs about 10 % more width |
| D4 | How to draw the front | **Land polygons per keyframe (held / garrisoned / contested / allied / allied-with-japan / neutral / soviet); islands as dated intervals with `cutOff`; a dashed perimeter round island groups; no sea fill; declared lines as their own layer** | That is how the Green Books draw it. It handles bypassed garrisons, and it needs no interpolation for islands, the bulk of the Pacific changes |
| D5 | The last keyframe | **General Order No. 1's surrender zones plus the Soviet advance, not a front** | At the surrender Japan still held most of Southeast Asia and China. Zones show what happened next |
| D6 | Event kinds and the flag | **The 14-kind vocabulary of §2.1, plus `box` / `view` / `cards`**, with `bombing`, `atrocity`, `captivity` and `people` always `cards` | Puts the brief's tone rule into data, so the check can enforce it |
| D7 | Times and dates | **The place's civil date, plus an optional `alt` date; times as RFC 3339 with the source's own offset; a `clocks.json`; UTC computed at bake time** | Three v1 battles carry four distinct US clocks between them and two Japanese date conventions; only offsets stored per source survive that |
| D8 | Routes | **Add `orders` to `pointPrecision`; add `fleet`, `air`, `campaign` and `lane` to `kind`; digitise the Kidō Butai at Midway from the Nagumo chart, and Pearl Harbor from JM-97 with USSBS App. 2 and Morton's inset; draw no lines for the atomic missions** | Planned positions are not logged positions. The best tracks are primary charts. Lines for the atomic missions would be spectacle |
| D9 | How many events in v1 | **Tier 1 (80 events, 8 core prologue cards)**; tier 2 (29) later | Fits the brief's 70–90 and keeps the islanders' events in tier 1 |
| D10 | Tellings to carry from the start | Attu and Kiska dates; the Nauru occupation date; Yamato's sinking position; Shinano's position; the Indianapolis date; the hour of the Pearl Harbor launch; Kirishima's hits and the Midway dead (R2) | Each has two documented values, and the Hawaiian standard keeps both with sources |
| D11 | Ten-Gō playable? | **R8 decides; my view is that it should be the TBM, not Yamato's AA** | Yamato's sortie was a 水上特攻 surface tokkō. Playing her defence is close to playing the tokkō side, which the brief rules out |
| D12 | Off-table events | **Edge markers** pointing toward the place (Washington, Potsdam, the West Coast, British Columbia, Funter Bay, Diego Suarez), as Hawaiian `kahiki` does | Internment and Potsdam belong in the story, but not on the table |
| D13 | Pins with no single place | **`comfort-system` gets no pin; it opens from the era list** | Any pin would be arbitrary and could mark a real site carelessly. The Hawaiian sensitive-site rule applies (DESIGN §7.4) |

---

## 9. Sources: the keys used above, with URLs and what was read

| key | work | URL | status |
| --- | --- | --- | --- |
| `chron41` … `chron45` | Robert J. Cressman, *The Official Chronology of the U.S. Navy in World War II* (Naval Historical Center, 1999) | <https://www.ibiblio.org/hyperwar/USN/USN-Chron.html>; year pages `…/USN/USN-Chron/USN-Chron-1941.html` … `-1945.html` | **opened**: all five years downloaded and searched |
| `ussbs-camp` | USSBS (Naval Analysis Division), *The Campaigns of the Pacific War* (1946) | HTML <https://www.ibiblio.org/hyperwar/AAF/USSBS/PTO-Campaigns/index.html>; scan <https://archive.org/details/campaignsofpacif46unit> (djvu text and PDF) | **opened**: full OCR text; list of appendices; chs. II, VI, XII and XIV read in part. Plates not viewed |
| `ussbs-air` | USSBS, *Air Campaigns of the Pacific War* (1947) | <https://archive.org/details/aircampaignsofpa00unit> | text downloaded, skimmed only |
| `ussbs-trans` | USSBS, *The War against Japanese Transportation, 1941–1945* (1947) | <https://archive.org/details/waragainstjapane54unit> | metadata only (`NOT_IN_COPYRIGHT`) |
| `janac` | JANAC, *Japanese Naval and Merchant Shipping Losses During World War II by All Causes* (1947) | <https://archive.org/details/JapaneseNavalAndMerchantShippingLossesDuringWorldWarIiByAllCauses> | found by search; not opened |
| `jm97` | Japanese Monograph No. 97, *Pearl Harbor Operations: General Outline of Orders and Plans* (1953) | <https://www.ibiblio.org/pha/monos/097/index.html> | **opened**: route points, X-day timing |
| `nagumo` | *The Japanese Story of the Battle of Midway* (First Air Fleet Detailed Battle Report No. 6, tr. ONI Review, May 1947) | <https://www.ibiblio.org/hyperwar/Japan/IJN/rep/Midway/Nagumo/index.html>; track chart `…/Chart-1.jpg` | **opened**: text searched; track chart viewed and read |
| `cincpac-mid` | CINCPAC, Battle of Midway report (A16 01849, 28 June 1942) | <https://www.ibiblio.org/hyperwar/USN/rep/Midway/Midway-CinCPac.html> | **opened** (zone note, the rendezvous, the 0900 sighting) |
| `crupac-mid` | Commander Cruisers, Pacific Fleet, Battle of Midway report | <https://www.ibiblio.org/hyperwar/USN/rep/Midway/Midway-Cruisers.html> | **opened** (whole page, short) |
| `oni-mid` | ONI Combat Narrative, *The Battle of Midway, June 3–6, 1942* (1943) | <https://www.ibiblio.org/hyperwar/USN/USN-CN-Midway/index.html> | **opened**: chapters 1–6 searched |
| `oni-gc` | ONI Combat Narrative, *The Battle of Guadalcanal, 11–15 November 1942* (1944) | <https://www.ibiblio.org/hyperwar/USN/USN-CN-Guadalcanal/index.html> | **opened**: Parts One to Three searched |
| `doolittle` | J. H. Doolittle, report on the Tokyo raid | <https://www.ibiblio.org/hyperwar/AAF/rep/Doolittle/Report.html> | **opened** |
| `atlas` | War Department, *Atlas of the World Battle Fronts in Semimonthly Phases to August 15, 1945* | text <https://en.wikisource.org/wiki/Atlas_of_the_World_Battle_Fronts_in_Semimonthly_Phases_to_August_15_1945>; maps e.g. <https://commons.wikimedia.org/wiki/File:1944-08-15JapWW2BattlefrontAtlas.jpg>; PDF <https://commons.wikimedia.org/wiki/File:Atlas_of_the_World_Battle_Fronts_in_Semimonthly_Phases_to_August_15,_1945.pdf> | **opened**: the whole Pacific narrative; Commons file pages. Images 429 |
| `morton-sc` | Louis Morton, *Strategy and Command: The First Two Years* (CMH, 1962) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Strategy/index.html>; maps `…/maps/USA-P-Strategy-I.jpg`, `-9.jpg`, `-14.jpg` | index **opened**; Maps I, 9 and 14 viewed |
| `morton-pi` | Louis Morton, *The Fall of the Philippines* (CMH, 1953) | <https://www.ibiblio.org/hyperwar/USA/USA-P-PI/index.html> | index **opened** (map list) |
| `smith-app` | Robert Ross Smith, *The Approach to the Philippines* (CMH, 1953) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Approach/index.html>; Map 1 `…/maps/USA-P-Approach-1.jpg` | index **opened**; Map 1 viewed |
| `smith-tri` | Robert Ross Smith, *Triumph in the Philippines* (CMH, 1963) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Triumph/index.html>; Map 1 | index **opened**; Map 1 viewed |
| `cannon` | M. Hamlin Cannon, *Leyte: The Return to the Philippines* (CMH, 1954) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Return/index.html>; Map 2 | index **opened**; Map 2 downloaded, not examined |
| `appleman` | Roy E. Appleman et al., *Okinawa: The Last Battle* (CMH, 1948) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Okinawa/index.html>; Map 1 | index **opened**; Map 1 viewed |
| `milner` | Samuel Milner, *Victory in Papua* (CMH, 1957) | <https://www.ibiblio.org/hyperwar/USA/USA-P-Papua/index.html>; Map 3 | index **opened**; Map 3 viewed (command areas only) |
| `crowl-love`, `crowl-mar`, `miller-cw` | Crowl and Love, *Seizure of the Gilberts and Marshalls*; Crowl, *Campaign in the Marianas*; Miller, *CARTWHEEL* | `…/USA/USA-P-Gilberts/`, `…/USA-P-Marianas/`, `…/USA-P-Rabaul/` | indexes **opened** (map lists) |
| `romanus-1`, `romanus-2` | Romanus and Sunderland, *Stilwell's Mission to China* (1953), *Stilwell's Command Problems* (1956) | `…/USA/USA-CBI-Mission/index.html`, `…/USA-CBI-Command/index.html` | indexes **opened** (map lists); Command Map 17 downloaded |
| `cmh-camp` | CMH campaign brochures, *The U.S. Army Campaigns of World War II* | <https://www.ibiblio.org/hyperwar/USA/index.html> (the `USA-C-…` entries) | titles and dates **opened** |
| `macarthur-1`, `macarthur-2` | *Reports of General MacArthur*, vol. I and vol. II parts 1–2 (CMH Pub 13-1 to 13-3) | <https://archive.org/details/ReportsOfGeneralMacarthurTheCampaigns>; <https://archive.org/details/ReportsOfGeneralMacarthurJapaneseOperations>; <https://archive.org/details/ReportsOfGeneralMacarthurJapaneseOperationsPt2>; HyperWar <https://www.ibiblio.org/hyperwar/USA/RptsMacA/I/index.html> (plates are placeholders) | metadata and plate list **opened**; plates not viewed |
| `craven-cate` | Craven and Cate, *The Army Air Forces in World War II*, vols. IV–V | <https://www.ibiblio.org/hyperwar/AAF/index.html> | index **opened** |
| `go1` | General Order No. 1 (JCS / SCAP, 1945) | <https://en.wikisource.org/wiki/General_Order_No._1> | **opened** (§1 a–f) |
| `wd` | Wikidata via SPARQL (tertiary) | <https://query.wikidata.org/sparql>; results in `downloads/R3/wd-events.json`, `wd-events2.json` | **opened** |
| `wp …` | Wikipedia (tertiary): *Japanese occupation of Nauru*, *Ocean Island massacre*, *Indian Ocean raid*, *Jacob C. Vouza*, *Internment of Japanese Canadians*, *Unit 731*, *Bengal famine of 1943* (wikitext via `action=raw`); *Japanese occupation of Guam* (WebFetch); *General Order No. 1* (WebFetch) | `https://en.wikipedia.org/w/index.php?title=…&action=raw` | **opened**, read in part |
| `nps-aleu` | NPS, Aleutian WWII National Historic Area, "Understanding Forcible Removal Through Maps" | <https://www.nps.gov/aleu/learn/historyculture/removal-maps.htm> | **search summary only**: *verify* |
| `nps-wapa` | NPS, War in the Pacific NHP, "Tinta" and "Faha" | <https://www.nps.gov/parkhistory/online_books/npswapa/Guam/Cave%20massacres/tinta.htm>; `…/Faha.htm` | **search summary only**: *verify* |
| `tzdb` | IANA Time Zone Database 2026e (installed) | `/usr/share/zoneinfo/tzdata.zi` | **opened** (tertiary; offsets computed) |
| R2's keys used here | `nwc-coral`, `nwc-savo`, `nwc-leyte`, `ijo Nav …`, `jm-86`, `jm-98`, Morison IV, V, XII, the Hoel and Johnston ARs, JACAR report IDs | see `R2-sources.md` | [R2] |

Other URLs requested in this pass, all 200 unless stated:

- **HyperWar indexes**: `…/USA/index.html`, `…/AAF/index.html`, `…/PTO/index.html`, `…/USA/COS-Biennial/index.html` (the Biennial Reports: this edition's maps cover the Solomons, New Guinea and Southeast Asia only).
- **archive.org**: advancedsearch; `metadata/` for five items.

---

## 10. What could not be reached

| host or work | status | consequence |
| --- | --- | --- |
| `upload.wikimedia.org` (the Atlas map images) | **429** on three tries over several minutes | I could not view any Atlas map, so the 960 px resolution's usefulness for tracing is unjudged. Try again throttled, or use the CARL PDF |
| archive.org `atlasofworldbatt00unse` (the Atlas scan) | **401** (lending library; encrypted PDF) | Use the Commons PDF (from CARL) or CARL's own digital library (`cgsc.contentdm.oclc.org`, not tried) |
| Wikidata API (`wbgetentities`) | **429** | Worked round via SPARQL (200) |
| en.wikipedia `action=raw` | **429** after a burst: *Japanese occupation of Guam*, *Internment of Aleut people*, *Mass suicides in Okinawa* | Guam read via WebFetch; Aleut and Okinawa facts from the NPS search summary and the chronology, marked *verify* |
| en.wikisource `General_Order_No._1_(1945)` | 404 (wrong title) | Found at `General_Order_No._1` |
| `military-history.fandom.com` | **402** | Not needed |
| en.wikipedia `Unangax̂_internment` | 404 (guessed title) | The NPS search summary used instead |
| HyperWar *Reports of General MacArthur* plates | the HTML has placeholder images | The plates are in the archive.org CMH scans (not opened) |
| USSBS *Campaigns* plates (track charts) | not viewed: the scan is reachable, but plates need page images | The next step for every route in §6 |
| Senshi Sōsho fold-outs, JACAR charts | not tried (R2 opened the catalogues) | Facts only, per NIDS terms |
| history.navy.mil, usmcu.edu, hathitrust | not retried (the brief and R2 list them as walled) | — |
| West Point atlas pages | not opened | Licence *verify* |

---

## 11. Still needs a person

- **A georeferencing pass in QGIS** for the fronts:
  - the Atlas maps on K3–K7's dates; Morton Map I and Map 14; Smith's maps of March and December 1944; Appleman's of March 1945; Romanus and Sunderland Map 17;
  - the output: `front-K*.geojson` plus an island-interval table drawn from the chronology.
  - The Atlas is Mercator with a graticule, so it georeferences easily.
- **Digitising the routes** from the USSBS plates: App. 2 (Pearl Harbor), 11 (the Kidō Butai's movements), 17, 20–22, 26–27, 47 (Guadalcanal, nine charts), 83–84, 93, 94 and 100–101. Then re-read the Nagumo chart from the JACAR original. My reading is ±0.5° and its retirement leg is uncertain.
- **A reader of Japanese** to check every romaji and every period operation name marked *verify*. Examples: 香港攻略戦, ビルマ攻略作戦, スリガオ海峡海戦, the hell-ship kanji 楽洋丸 and 順陽丸, クェゼリン's romanisation, and Iōtō versus Iwo Jima. Also the Japanese dates for the Aleutian landings and Komandorski.
- **Community and specialist readers for the islanders' cards**:
  - Guam: Chamorro (Guampedia, the NPS War in the Pacific park);
  - Nauru and Banaba;
  - Okinawa: the prefectural peace museum and the Himeyuri museum, for the Kerama and Himeyuri wording, which is contested in Japan;
  - Solomon Islands; Papua New Guinea; the Unangax̂ (the Aleutian Pribilof Islands Association).

  The Hawaiian standard asks for a cultural reviewer before anything reaches
  a card.
- **R8 (tone)**: Bismarck Sea (strafing of men in the water); Ten-Gō's playable side; a Darwin defence box; Doolittle as a viewed take-off only; whether to include the Bengal famine, and with which tellings; the comfort-system card's wording and its no-pin rule.
- **A library card**: Prange, *At Dawn We Slept* (the Kidō Butai's daily positions); Parshall and Tully, *Shattered Sword* (the Midway tracks and times); Lundstrom; Frank, *Guadalcanal*; Hornfischer; Tohmatsu and Willmott, for the China front. All *verify* (R2 §10).
- **Settling the divergent tellings**: Attu and Kiska (USSBS versus the chronology); Nauru (25, 26 or 29 August); Yamato (30°22′ N versus 30°40′ N); Shinano (32°00′ N versus 33°07′ N); Indianapolis (29 or 30 July); the Pearl Harbor launch hour (0100 JST planned, 0130 JST actual *verify*, against USSBS's "0730 Hawaiian time" arrival).
