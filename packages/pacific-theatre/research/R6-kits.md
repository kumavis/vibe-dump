# R6: the kits — reference data for the procedural ships, aircraft and the sim

Written 2026-10-22 by researcher R6 for the Pacific diorama's design pass.
Scope: the numbers and silhouettes behind `kits/ships.json` and
`kits/aircraft.json` (DATA.md §8), and the damage calibration the sim needs
(ENGINEERING.md §5, `damage.js`). Every number carries a source id (§2).
Disagreements are marked **≠**. Anything I did not open is *verify*.
Estimates of my own are marked **E** and are not facts.

## 0. Headline findings

1. **The recognition manuals give the silhouettes, not the numbers.** ONI
   41-42 (Nov 1942, pages dated to Aug 1943) has a profile, a plan, a height
   scale and a data block for most Japanese classes. Its data are wartime US
   estimates and often wrong: Nagato 32,720 t standard (actual 39,130 t
   after refit), Kongō "29,300 t", Shōkaku "15,000 t, based on incomplete
   information". Use the manuals for block positions and shapes; use
   post-war figures for the sim (§3.1, decision D1).
2. **I measured block positions off the manual drawings.** For 22 classes I
   laid a 0.05-step ruler (fraction of length from the bow) over the
   archive.org page images and read turret, mast, funnel, island and
   catapult positions to about ±0.02 (±0.03 on the small silhouette charts).
   The crops with rulers are kept in `research/downloads/R6/img/` so anyone
   can check a reading (§3.7).
3. **No public-domain plate of Yamato, Agano or the late-war US classes was
   reached.** ONI 41-42 predates them, ONI 222-J (Aug 1945) leaves out sunk
   ships, FM 30-50 (Oct 1941) predates US war construction and draws North
   Carolina from pre-completion plans. Yamato, Iowa, Essex, South Dakota,
   Casablanca and John C. Butler rows are **E** until a person reads a print
   plan (§11).
4. **The 16-inch time of flight checks out.** NavWeaps' range table for the
   16"/45 Mark 6 gives 6.83 s at 5,000 yd and 14.45 s at 10,000 yd, so about
   12.0 s at 8,400 yd, as ENGINEERING.md assumes. Washington opened on
   Kirishima at about 5,800 yd (Kirishima TROM), about 8 s.
5. **The record's hits on Kirishima range from 9 to about 20 16-inch.** The
   TROM's note: USSBS and Lee's report give nine (Lee eight) 16-inch and
   about 40 5-inch; Lundgren's analysis of Ikeda's sketch gives about 20
   major-calibre and 17 smaller. She capsized at 03:25, about 3 h 20 min
   after the first hit. South Dakota took "at least 26" hits (1 × 14-inch,
   18 × 8-inch, 6 × 6-inch, 1 × 5-inch) and was never in danger of sinking
   (BuShips WDR). Both numbers bound the battleship damage model (§4).
6. **A carrier's fatal threshold depends on what is in its hangar, not on
   its armour.** One 1,000-lb bomb sank Akagi. Three sank Sōryū, four sank
   Kaga and Hiryū. Yorktown took three bombs and two Type 91 torpedoes and
   was still afloat two days later. A single small bomb set off St. Lo's
   hangar ordnance, and she sank in about 30 minutes (BuShips CVE report).
   One scalar `fatal` per kit cannot produce that. The sim needs a
   hangar-state factor (decision D3).
7. **AP shells over-penetrated thin hulls at Samar.** Hoel took about 40
   hits before sinking. Gambier Bay's fatal hit flooded her forward engine
   room: US reports call it an 8-inch shell, Japanese records an 18.1-inch
   AP that did not burst (≠, Wikipedia citing Lundgren). The damage model
   needs a shell-type × armour rule, or the record's destroyer and escort
   carrier losses cannot be reproduced (decision D4).
8. **Primary handling data exist for the US types.** NACA flight tests (PD,
   on archive.org) give the F4F-3's best roll rate, 58°/s at 190 mph IAS
   with a 30-lb stick force, too heavy above about 200 mph. They also cover
   the F6F-3's ailerons, the SBD-1's perforated dive flaps (kept because
   they "eliminat[e] tail buffeting") and SBD dives at 45°, 60° and 75°. For
   the Zero only secondary sources were reached: "ailerons froze up at
   speeds above 200 knots" (US test pilot, quoted on Wikipedia). The brief
   says 250 kn (≠).
9. **The Pearl Harbor damage is on record in a primary table.** BuShips'
   *Summary of War Damage* gives Arizona 8 bombs and 1 torpedo, Oklahoma
   about 5 torpedoes, West Virginia 7 torpedoes (one in the rudder) and 2
   dud bombs, California 2 torpedoes and 2 bombs (she sank from open
   manholes), Nevada 1 torpedo and 5 bombs, and Utah 2 torpedoes
   (Wikipedia). All are in §4.
10. **Torpedo envelopes, with sources.** The Type 91 was designed to drop at
    180 kn from 20 m (Wikipedia). In 1941 the Mod 2 got the roll-control
    and wooden-fin shallow-water fit for Pearl Harbor. The Mod 3 (Midway)
    carried a 240-kg warhead, 2,000 m at 41–43 kn. The early Mark 13 was
    dropped "low and slow – typically 50 feet and 110 knots". In a mid-1943
    analysis only 31 % of drops above 150 kn gave a satisfactory run. The
    TBD could not release above 115 mph (NavWeaps, Wikipedia).
11. **US national-insignia dates, as needed for `colours[].from/to`.** The
    red centre was removed on 15 May 1942. The bars with a red outline came
    on 28 June 1943, the blue outline on 14 August 1943 (AN-I-9, field
    order of 24 Sept 1943). Navy rudder stripes ended in May 1942
    (Wikipedia, citing Bell and Doll; tertiary).
12. **ONI 41-42 contains wartime slurs and a racist caricature** (leaf 27,
    the carrier chart). Use its geometry only. Never reproduce its pages,
    captions or images in the app (for R8).

## 1. Method, and how to read the tables

- **Opened and read**: ONI 41-42, ONI 222-J, FM 30-50 and TAIC Manual No. 1,
  as archive.org full texts split by scan leaf, with the page images I
  measured. Five BuShips War Damage Reports came as HyperWar PDF text
  layers. Four NACA wartime reports came as archive.org full texts. There were about 30 NavWeaps gun and torpedo pages (secondary) and about 100 Wikipedia
  articles as `action=raw` wikitext (tertiary). The combinedfleet.com TROM
  for Kirishima was downloaded by R5. R4's file covers the Midway hit
  counts.
- **Leaf numbers**: "leaf n34" is the archive.org page index, so a page
  image is `https://archive.org/download/<item>/page/n34_w1200.jpg`. ONI
  41-42 has no printed page numbers; its plates are cited by leaf, title
  and the plate's own date.
- **Units** follow DATA.md §8: metres, knots, tonnes and kilograms. Long
  tons are converted at 1.016. Feet and inches are converted at 0.3048 m.
  Originals are kept in the notes.
- **Block grammar** (Table S7), so a script can parse a cell. Blocks are
  separated by `;`. Each block is `kind(shape)@from[-to][>s|<p][^height]`:
  `>s` is starboard, `<p` port, and `^` the top in metres above the
  waterline. `sf` after a turret means superfiring. Example:
  `turret(twin)@0.29 sf; pagoda(short)@0.35-0.41^41; funnel(round)@0.47`.
  `at` is the fraction of length overall from the bow, as in DATA.md.
- **Confidence**: **M** = measured on a manual plate (±0.02). **Mc** =
  measured on a small silhouette chart (±0.03). **E** = my estimate from
  general knowledge, not to be shipped without a person's check.
- **One row per class**, the ships named. Where a ship differed from her
  class at the battle's date, the notes say so.

## 2. Source ids

| id | work | where | kind | opened |
| --- | --- | --- | --- | --- |
| oni-4142 | ONI 41-42, *Japanese Naval Vessels* (Nov 1942; loose-leaf plates dated Oct 1942–Aug 1943) | archive.org `oni-4142` (`ONI4142_djvu.txt`, page images) | primary (US intelligence; PD) | yes |
| oni-222j | ONI 222-J, *The Japanese Navy* (9 Aug 1945) | archive.org `ONI222JTheJapaneseNavy` | primary (PD) | yes (text; plates downloaded, not all measured) |
| fm-30-50 | FM 30-50, *Identification of United States Naval Vessels* (11 Oct 1941) | archive.org `Fm30-50` | primary (PD) | yes |
| taic-1 | TAIC Manual No. 1, *Japanese Aircraft Performance and Characteristics* (June 1945; pages dated Dec 1944–May 1945) | archive.org `japanese-aircraft-performance-characteristics-taic-manual` | primary (US intelligence; PD) | yes |
| bs-wds42 | BuShips, *Summary of War Damage to U.S. Battleships, Carriers, Cruisers and Destroyers, 17 Oct 1941 to 7 Dec 1942* (NAVSHIPS A(374)) | HyperWar `USN/rep/WDR/` | primary (PD) | yes |
| bs-wdr-cv5 | BuShips War Damage Report, *Yorktown (CV-5), bomb and torpedo damage, Midway, 4–7 June 1942* | HyperWar `USN/rep/WDR/` | primary | yes |
| bs-wdr-bb57 | BuShips War Damage Report, *South Dakota (BB-57), gunfire damage, 14–15 Nov 1942* | HyperWar | primary | yes |
| bs-wdr-cve | BuShips, *Escort Carriers: gunfire, bomb and kamikaze damage and loss* (HyperWar copy holds Section IV on) | HyperWar | primary (partial) | yes |
| bs-wdr-51 | BuShips War Damage Report No. 51, *Destroyer Report* (25 Jan 1947) | HyperWar (plates and photographs only) | primary (partial) | yes (Johnston plate V not legible as text) |
| naca-f4f3 | Kleckner, *Flight Measurements of the Aileron Characteristics of a Grumman F4F-3 Airplane*, NACA ACR (Sept 1942) | archive.org `NASA_NTRS_Archive_20090019131` | primary | yes |
| naca-f6f3 | *Flight Measurements of the Flying Qualities of an F6F-3 Airplane (BuAer 04776) II: Lateral and Directional*, NACA MR L5B13a (1945) | archive.org `NASA_NTRS_Archive_19930092601` | primary | yes |
| naca-sbd1 | Root, *The Development of Satisfactory Flying Qualities on the Douglas Dive Bomber, Model SBD-1*, NACA ACR W-81 (May 1942) | archive.org `NASA_NTRS_Archive_19930092599` | primary | yes |
| naca-sbd-dive | Johnson, *Determination of Flight Paths of an SBD-1 Airplane in Simulated Diving Attacks*, NACA ACR (Mar 1943) | archive.org `NASA_NTRS_Archive_20090016689` | primary | yes (tables garbled in OCR) |
| nw-&lt;page&gt; | NavWeaps (Tony DiGiulian), gun and torpedo pages, e.g. `nw-WNJAP_18-45_t94` | `http://www.navweaps.com/Weapons/<page>.php` | **secondary**; cites USNTMJ O-series, OP 1188, Campbell, Lacroix and Wells | yes |
| nw-tjp, nw-tus | NavWeaps, *Japanese Torpedoes of WWII*, *USA Torpedoes of WWII* | `WTJAP_WWII.php`, `WTUS_WWII.php` | secondary | yes |
| cf-kirishima | combinedfleet.com, Kirishima TROM (Hackett, Kingsepp, Tully) | `combinedfleet.com/Kirishima.htm` (R5's download) | secondary | yes |
| r4 | R4-air-battles.md (sister file): Midway hits from Nagumo's report, NWC 1948, TROMs | `research/R4-air-battles.md` §3.9, §5.3 | (compiled) | yes |
| wp-&lt;article&gt; | English Wikipedia, `action=raw` (e.g. `wp-Japanese_aircraft_carrier_Kaga`) | `en.wikipedia.org` | **tertiary**; infoboxes cite Lacroix and Wells, Jentschura, Friedman, Garzke and Dulin, Francillon | yes |
| print-ll | Lacroix and Wells, *Japanese Cruisers of the Pacific War* (1997) | print | — | no, *verify* |
| print-gd | Garzke and Dulin, *Battleships: Allied Battleships* (1980) and *Axis and Neutral Battleships* (1985) | print | — | no, *verify* |
| print-fr | Friedman, *U.S. Battleships*, *U.S. Aircraft Carriers*, *U.S. Destroyers* (1983–2004) | print | — | no, *verify* |
| print-pt | Parshall and Tully, *Shattered Sword* (2005) (carrier plans, deck markings, hangar state at Midway) | print | — | no, *verify* |
| print-fr79 | Francillon, *Japanese Aircraft of the Pacific War* (1979) | print | — | no, *verify* |
| print-dj | Doll, Jackson and Riley, *Navy Air Colors* vol. 1 (1983); Bell, *Air Force Colors* (1995–97) | print | — | no, *verify* |
| ships-2 | BuShips, *SHIPS-2 Camouflage Instructions* (1941; rev. 1942, 1943) | not reached (shipcamouflage.com's copy sits behind a JS challenge) | primary | no, *verify* |

## 3. Ship kits

### 3.1 Table S1: dimensions, displacement, speed, turning, aircraft

`td_m` is the tactical diameter at the speed given. Only two are sourced.
For the rest the column is blank and decision D10 proposes a rule. No
source reached gives `rudderS` (hard-over to hard-over) for any class: see
D10. Where two values appear, the first is the one I recommend for the kit
and the second is the disagreeing source.

| id | class | type | nation | ships (battles) | loa_m | beam_m | draught_m | disp_std_t | disp_full_t | speed_kn | td_m | aircraft | sources | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| yamato | Yamato | bb | japan | Yamato 大和 (Samar 1944; Ten-Gō 1945) | 263.0 | 38.9 | 10.4 ≠ 11.0 | 65,020 (64,000 LT design) ≠ 65,027 "normal" | 71,660 ≠ 72,810 (71,659 LT) | 27 | — | 7 ≠ "4 E13A + 3 F1M" | wp-Yamato-class_battleship; wp-Japanese_battleship_Yamato | the ship and class articles mix LT and t in the infobox. US intelligence credited her with 9 × 16-in guns as late as July 1945 (wp citing Friedman p. 308). No PD plate reached (§3.7) |
| nagato | Nagato | bb | japan | Nagato 長門 (Samar) | 224.94 | 34.6 | 9.49 | 39,130 | 46,690 (deep) | 25 | — | 3 | wp-Japanese_battleship_Nagato; wp-Nagato-class_battleship | oni-4142 leaf n58 (Oct 1942): 700 ft OA (213.4 m), beam 95 ft, 32,720 t std, 26 kn (≠: pre-1936 figures) |
| kongo | Kongō | bb | japan | Kirishima 霧島 (Midway screen; Guadalcanal), Kongō 金剛 and Haruna 榛名 (Samar), Hiei 比叡 (Guadalcanal, 13 Nov) | 222.65 (Kirishima) ≠ 219.61 (class) | 31.02 | 9.7 ≠ 10.29 (Kirishima) | 32,490 (Kirishima) ≠ 32,156 (class) | 37,190 (36,600 LT; Kongō, Haruna) | 30.5 ≠ 29.8 (Kirishima) | — | 3 | wp-Kongō-class_battlecruiser; wp-Japanese_battleship_Kirishima; wp-Japanese_battleship_Haruna | oni-4142 leaf n34 (Nov 1942): 704 ft (214.6 m), 95 ft, 29,300 t std, 26 kn (≠). oni-222j leaf n25 (Haruna, 1945): 704 ft, 98 ft over bulges, 30,000 t std, 26 kn designed (≠) |
| fuso | Fusō | bb | japan | Fusō 扶桑, Yamashiro 山城 (Surigao, later) | 212.75 | 33.1 | 9.69 | 35,260 (34,700 LT) | — | 24.5 | — | 3 | wp-Fusō-class_battleship; wp-Japanese_battleship_Yamashiro | oni-4142 n40, n46 (Dec 1942): 673 ft OA (205.1 m), 94 ft, 28 ft 6 in, 29,330 t std, 30,600 t normal (≠) |
| akagi | Akagi | cv | japan | Akagi 赤城 (Pearl Harbor; Midway) | 260.67 | 31.32 | 8.71 | 37,080 (36,500 LT) | 41,960 (41,300 LT deep) | 31.5 | — | 66 + 25 reserve (7 Dec 1941: 21 A6M, 18 D3A, 27 B5N) | wp-Japanese_aircraft_carrier_Akagi | flight deck 249.17 m after the 1935–38 rebuild; three elevators |
| kaga | Kaga | cv | japan | Kaga 加賀 (Pearl Harbor; Midway) | 247.65 | 32.5 | 9.48 | 38,810 (38,200 LT) | — (DATA.md's example 42,500 is unsourced, *verify*) | 28 | — | 72 + 18 stored (7 Dec 1941: 21 A6M, 27 D3A, 27 B5N) | wp-Japanese_aircraft_carrier_Kaga | slowest of the four at Midway |
| soryu | Sōryū | cv | japan | Sōryū 蒼龍 (Pearl Harbor; Midway) | 227.5 | 21.3 | 7.6 | 16,200 | 19,100 (normal) | 34 | — | 63 + 9 (21 A6M, 18 D3A, 18 B5N) | wp-Japanese_aircraft_carrier_Sōryū | flight deck 216.9 × 26 m, only 12.8 m above the waterline; upper hangar 4.6 m high, lower 4.3 m |
| hiryu | Hiryū | cv | japan | Hiryū 飛龍 (Pearl Harbor; Midway) | 227.4 | 22.3 | 7.8 | 17,580 (17,300 LT) | — | 34 | — | 64 + 9 (21 A6M, 18 D3A, 18 B5N) | wp-Japanese_aircraft_carrier_Hiryū | island on the port side (wp-…Akagi: "the only other carrier to share this feature") |
| shokaku | Shōkaku | cv | japan | Shōkaku 翔鶴, Zuikaku 瑞鶴 (Pearl Harbor; later Coral Sea, Santa Cruz, Philippine Sea) | 257.5 | 29.0 | 9.32 (deep) | — | 32,105 (deep) | 34.5 | — | 72 + 12 (7 Dec 1941: 18 A6M, 27 D3A, 27 B5N) | wp-Shōkaku-class_aircraft_carrier | oni-4142 n77 (Oct 1942): 826 ft OA, 93 ft, 21 ft, 15,000 t std, 30(?) kn, "based on incomplete information"; n79 (Aug 1943): "recent reports indicate 20,000 tons … 72 aircraft" |
| zuiho | Zuihō | cvl | japan | Zuihō 瑞鳳 (Santa Cruz; Leyte decoy force) | 205.4 (674 ft) | 18.0 (59 ft) | 6.6 (21 ft) | 11,440 (11,262 LT) | — | 28 | — | 30 | wp-Japanese_aircraft_carrier_Zuihō | oni-4142 n79: 660 ft OA, 15,000(?) t, 25(?) kn (≠) |
| takao | Takao | ca | japan | Atago 愛宕 and Takao 高雄 (Guadalcanal, 14–15 Nov), Chōkai 鳥海 (Samar) | 203.76 | 19.0 (20.4 after bulges) | 6.11–6.32 | 11,530 (11,350 LT as built) | 15,490 (final; Takao, Atago) ≠ 15,781 (Chōkai) | 34.2 ≠ 35.5 (Chōkai) | — | 2–3; 2 catapults | wp-Takao-class_cruiser; wp-Japanese_cruiser_Atago; wp-Japanese_cruiser_Chōkai | oni-4142 n118 (Oct 1942): 657 ft OA, 650 ft WL |
| myoko | Myōkō | ca | japan | Haguro 羽黒 (Samar) | 201.7 (Haguro) ≠ 204 (class) | 20.73 (Haguro) ≠ 19.5 (class) | 6.32 | 11,633 (class) ≠ 13,510 (Haguro, 13,300 LT) | 14,980 | 36 (Haguro) ≠ 35.5 | — | 2; 1 catapult | wp-Myōkō-class_cruiser; wp-Japanese_cruiser_Haguro | oni-4142 n112: 656 ft OA ("Nachi class") |
| mogami | Mogami | ca | japan | Kumano 熊野, Suzuya 鈴谷 (Samar) | 201.6 | 20.2 (Suzuya subgroup) ≠ 20.6 | 5.5 (*verify*: other sources give about 5.9) | about 11,000 actual (8,500 "as reported" in 1930s) | 13,660 (13,440 LT; Kumano) | 35 ≠ 37 (class, trials) | — | 3 E13A; 2 catapults | wp-Mogami-class_cruiser; wp-Japanese_cruiser_Kumano | oni-4142 n126: 639 ft 8 in OA (≠ 661 ft actual); five twin 20 cm turrets from 1939 |
| tone | Tone | ca | japan | Tone 利根, Chikuma 筑摩 (Midway; Samar) | 201.6 | 19.4 | 6.2 | 11,390 (11,213 tons) | 15,440 | 35 | — | 6 floatplanes (5 usual, *verify*); 2 catapults | wp-Tone-class_cruiser; wp-Japanese_cruiser_Chikuma_(1938) | oni-4142 n132: 658 ft OA "(E)" (estimated) |
| nagara | Nagara | cl | japan | Nagara 長良 (Midway screen; Guadalcanal 14–15 Nov) | 162.1 | 14.2 | 4.8 | 5,660 (5,570 LT normal) | 7,203 (deep) | 36 | — | 1 floatplane (*verify*) | wp-Nagara-class_cruiser | oni-4142 n150 ("Natori class"): 535 ft OA (163 m) |
| sendai | Sendai | cl | japan | Sendai 川内 (Guadalcanal 14–15 Nov) | 162.15 | 14.17 | 4.8 | 5,280 (5,195 LT) | 5,680 (5,595 LT) | 35.25 | — | 1 | wp-Sendai-class_cruiser | oni-4142 n162: 535 ft OA |
| agano | Agano | cl | japan | Noshiro 能代, Yahagi 矢矧 (Samar; Yahagi at Ten-Gō) | 174.5 (Yahagi) ≠ 174 (class) | 15.2 | 5.63 | 6,652 | 7,590 (loaded) | 35 | — | 2; 1 catapult | wp-Agano-class_cruiser; wp-Japanese_cruiser_Yahagi_(1942) | oni-222j n68 (Agano class plate; not measured) |
| kagero | Kagerō | dd | japan | e.g. Isokaze, Hamakaze, Urakaze, Tanikaze, Arashi, Hagikaze, Maikaze, Nowaki (Midway); Yukikaze, Isokaze, Urakaze, Nowaki, Hamakaze (Samar) | 118.5 | 10.8 | 3.76 | 2,030 (2,000 LT) | 2,540 (2,500 LT, battle) | 35.5 | — | — | wp-Kagerō-class_destroyer | oni-4142 n193 (Asashio plate, which ONI applied to both classes) |
| yugumo | Yūgumo | dd | japan | e.g. Kishinami, Okinami, Hayashimo, Akishimo, Fujinami (Samar), Asashimo (Ten-Gō), Makigumo (Midway: scuttled Hiryū) | 119.03 | 10.8 | 3.76 | 2,077 | 2,520 (battle) | 35.5 | — | — | wp-Yūgumo-class_destroyer | ONI called them the Takanami class (oni-222j) |
| fubuki | Fubuki (Special Type) | dd | japan | Ayanami 綾波, Uranami 浦波, Shikinami 敷波 (Guadalcanal 14–15 Nov) | 118.41 | 10.4 | 3.2 | 1,780 (1,750 LT) | 2,080 (2,050 LT, rebuilt) | 38 | — | — | wp-Fubuki-class_destroyer | oni-4142 n175: 379 ft 6 in OA |
| akizuki | Akizuki | dd | japan | Teruzuki 照月 (Guadalcanal 14–15 Nov); others later | 134.2 | 11.6 | 4.15 | 2,740 (2,700 LT) | — | 33 | — | — | wp-Akizuki-class_destroyer_(1942) | oni-4142 n199 ("Terutsuki class", Mar 1943): 405 ft OA (123.4 m) (≠) |
| north-carolina | North Carolina | bb | usa | Washington BB-56 (Guadalcanal 14–15 Nov) | 221.9 (728 ft) ≠ 228.6 (750 ft, FM pre-completion) | 32.9 (108 ft) | 9.8 (32 ft) ≠ 10.7 (35 ft max) | 35,560 (35,000 LT, Washington) ≠ 37,190 (36,600 LT, class) | 45,520 (44,800 LT) | 28 | — | 3 OS2U; 2 catapults | wp-USS_Washington_(BB-56); wp-North_Carolina-class_battleship; fm-30-50 leaf n32 | FM 30-50 (Oct 1941) lists South Dakota in this class |
| south-dakota | South Dakota | bb | usa | South Dakota BB-57 (Santa Cruz; Guadalcanal 14–15 Nov) | 207.3 (680 ft) | 32.9 | 10.7 (35 ft) ≠ 11.0 (36 ft) | 38,580 (37,970 LT, BB-57) ≠ 35,980 (35,412 LT, class) | 45,230 (44,519 LT) | 27.5 | — | 3 ≠ 2 OS2U; 2 ≠ 1 catapult | wp-USS_South_Dakota_(BB-57); wp-South_Dakota-class_battleship_(1939) | a short, compact hull; no PD plate reached |
| iowa | Iowa | bb | usa | Iowa class (later battles only) | 270.4 (887 ft) | 32.9 | 11.3 (37 ft) | 48,880 (48,110 LT) | 58,460 (57,540 LT) | 33 | — | 3 | wp-Iowa-class_battleship | — |
| pennsylvania | Pennsylvania | bb | usa | Arizona BB-39, Pennsylvania BB-38 (Pearl Harbor; Pennsylvania in dry dock) | 185.3 (608 ft) | 29.6 (97 ft WL) ≠ 32.4 (106¼ ft over bulges, FM) | 8.8 (29 ft deep) ≠ 10.3 (33¾ ft max, FM) | 29,620 (29,158 LT) ≠ 32,600 (FM) | 32,430 (31,917 LT deep) | 21 | — | 3; catapults on No. 3 turret and quarterdeck (FM) | wp-Pennsylvania-class_battleship; wp-USS_Arizona; fm-30-50 n24 | FM 30-50 calls it the "Arizona class"; FM gives length 600 ft WL |
| nevada | Nevada | bb | usa | Oklahoma BB-37, Nevada BB-36 (Pearl Harbor) | 177.7 (583 ft) | 29.0 (95 ft) ≠ 32.9 (107 11/12 ft over bulges, FM) | 8.5 (28 ft) ≠ 9.9 (32½ ft max, FM) | 30,990 (30,500 LT, after the 1927–29 refit) ≠ 29,000 (FM) | 34,440 (33,901 LT) | 20.5 | Nevada 530 at 19 kn (580 yd); 754 at 15 kn (825 yd). Oklahoma 571 at 20 kn (625 yd) | 2–3; 1 catapult on No. 3 turret, 1 quarterdeck (FM) | wp-Nevada-class_battleship; wp-USS_Nevada_(BB-36); wp-USS_Oklahoma_(BB-37) (tactical diameters cite Friedman 1985, *verify*); fm-30-50 n16 | the only sourced turning figures in this file |
| tennessee | Tennessee | bb | usa | Tennessee BB-43, California BB-44 (Pearl Harbor) | 190.2 (624 ft) | 29.7 (97½ ft, FM) | 9.1 (30 ft) ≠ 10.8 (35½ ft max, FM) | 32,820 (32,300 LT normal) | 33,720 (33,190 LT) ≠ 35,750 (35,190 tons full, FM) | 21 | — | 3 | wp-Tennessee-class_battleship; fm-30-50 n36 | FM calls it the "California class" |
| colorado | Colorado | bb | usa | Maryland BB-46, West Virginia BB-48 (Pearl Harbor) | 190.2 (624 ft) | 29.7 (97½ ft, FM) | 9.1 (30 ft) ≠ 10.7 (35 ft max, FM) | 33,120 (32,600 LT) | 34,130 (33,590 LT; FM agrees) | 21 | — | 3 | wp-Colorado-class_battleship; wp-USS_West_Virginia_(BB-48); fm-30-50 n8 | the only US battleships with 16-inch guns at Pearl Harbor |
| utah | Florida (Utah) | bb (target) | usa | Utah AG-16, ex-BB-31 (Pearl Harbor, target and AA training ship) | 158.8 (521 ft) | 26.8 (88 ft) | 8.5 (28 ft mean) | 22,170 (21,825 LT normal) | 23,400 (23,033 LT) | 21 (as built) | — | 0 | wp-USS_Utah_(BB-31) | main battery removed in the 1930s target-ship conversion (*verify*) |
| yorktown | Yorktown | cv | usa | Yorktown CV-5, Enterprise CV-6, Hornet CV-8 (Midway; Hornet at Santa Cruz) | 251.2 (824 ft OA); hull 246.7 (809.5 ft) | 25.3 (83 ft WL); 33.2 over the flight deck (109 ft) | 7.9 (26 ft) ≠ 7.3 (24 ft design) ≠ 6.6 (21¾ ft mean, FM) | 20,120 (19,800 LT) | 25,910 (25,500 LT) | 32.5 ≠ 34 (FM) | — | 90 ≠ 83 ("space for over 100", FM) | wp-Yorktown-class_aircraft_carrier; wp-USS_Yorktown_(CV-5); fm-30-50 n42 | flight deck 244.4 m (802 ft). FM: "recognition letters … painted on after end of flight deck" (EN, YT) |
| essex | Essex | cv | usa | Essex class (later battles only) | 265.8 (872 ft, short bow) | 28.3 WL (93 ft); 45.0 maximum | 8.4 (27.5 ft) | 27,530 (27,100 LT; range 27,066–30,800) | 36,960 (36,380 LT) | 33 | — | 90–100 | wp-Essex-class_aircraft_carrier | — |
| casablanca | Casablanca | cve | usa | Gambier Bay CVE-73, St. Lo CVE-63, Kalinin Bay CVE-68, Kitkun Bay CVE-71, White Plains CVE-66, Fanshaw Bay CVE-70 (Samar) | 156.1 (512 ft 3 in) | 32.9 over the flight deck (108 ft 1 in); WL about 19.9 (65 ft 2 in, *verify*) | 6.1 (20 ft 0 in, estimated mean) | 8,320 (8,188 LT) | 11,080 (10,902 LT) ≠ 10,570 (10,400 tons, BuShips) | 19 | — | 27; 1 catapult, 2 elevators | bs-wdr-cve (Section IV class data, Ommaney Bay); wp-Template:Casablanca_class_*; wp-USS_Gambier_Bay | flight deck 144.5 m (474 ft) |
| fletcher | Fletcher | dd | usa | Johnston DD-557, Hoel DD-533, Heermann DD-532 (Samar) | 114.8 (376.5 ft) | 12.0 (39.5 ft) | 5.3 (17.5 ft, probably full load) | 2,080 (2,050 t) | 2,540 (2,500 t) ≠ about 2,900 in some references (*verify*) | 36.5 (design) | — | — | wp-Fletcher-class_destroyer; wp-USS_Johnston_(DD-557) | Johnston was a "square bridge" ship; splinter plating 19 mm (0.75 in) on the machinery sides, 13 mm (0.5 in) deck (wp citing Friedman) |
| sims | Sims | dd | usa | Walke DD-416 (Guadalcanal 14–15 Nov); Hammann, Hughes, Anderson, Russell, Morris (Midway) | 106.1 (348 ft) | 11.0 (36 ft) | 4.0 (13 ft) | 1,600 (1,570 t) | 2,330 (2,293 t) | 37 (trials) ≠ 36.5 (FM) | — | — | wp-Sims-class_destroyer; fm-30-50 n116 | — |
| benham | Benham | dd | usa | Benham DD-397 (Midway screen; Guadalcanal 14–15 Nov) | 103.6 (340 ft) | 10.7 (35 ft) | 4.0 (13 ft) ≠ 3.0 (9¾ ft mean, FM) | 1,680 (1,656 t) | 2,290 (2,250 t) | 37.9 (trials) ≠ 36.5 (FM) | — | — | wp-Benham-class_destroyer; fm-30-50 n120 | FM groups Benham with the Gridley class |
| mahan | Mahan | dd | usa | Preston DD-379 (Guadalcanal 14–15 Nov); Cassin, Downes (Pearl, in dry dock), Shaw (Pearl, floating dock) | 103.9 (341 ft) | 10.7 (35 ft) ≠ 10.6 (34¾ ft, FM) | 3.0 (10 ft) ≠ 5.2 (17 ft max, FM) | 1,520 (1,500 LT) | 2,140 (2,103 LT) | 37 ≠ 36.5 (FM) | — | — | wp-Mahan-class_destroyer; fm-30-50 n132 | — |
| gleaves | Gleaves | dd | usa | Gwin DD-433 (Guadalcanal 14–15 Nov) | 106.1 (348 ft 3 in) | 11.0 (36 ft) | 4.0 (13 ft) | 1,660 (1,630 t) | 2,430 (2,395 t) | 36.5 (FM, Benson class) | — | — | wp-Gleaves-class_destroyer; fm-30-50 n112 | FM lists Gwin in the Benson class |
| john-c-butler | John C. Butler | de | usa | Samuel B. Roberts DE-413, Dennis DE-405, Raymond DE-341, John C. Butler DE-339 (Samar) | 93.3 (306 ft) | 11.3 (37 ft) | 2.7 light ≠ 4.0 deep (9 ft / 13 ft) | 1,370 (1,350 LT) | 1,770 (1,745 LT) | 24 | — | — | wp-John_C._Butler-class_destroyer_escort | — |
| st-louis | St. Louis (Brooklyn subgroup) | cl | usa | Helena CL-50 (Pearl Harbor) | 185.3 (608 ft OA) | 18.7 (61½ ft, FM) | 6.0 (19¾ ft mean, FM) ≠ 7.0 (23 ft max) | 9,920 (9,767 LT, Brooklyn class) | 12,400 (12,207 LT) | 32.5 | — | 4; 2 catapults | wp-Brooklyn-class_cruiser; fm-30-50 n106 | FM: 10,000 tons, 600 ft WL |
| brooklyn | Brooklyn | cl | usa | Honolulu CL-48 (Pearl Harbor) | 185.3 | 18.7 | 6.0 | 9,920 | 12,400 | 32.5 | — | 4; 2 catapults | wp-Brooklyn-class_cruiser; fm-30-50 n102 | FM calls Honolulu's group the "Phoenix class" |
| omaha | Omaha | cl | usa | Raleigh CL-7 (Pearl Harbor) | 169.2 (555 ft OA) | 16.8 (55 ft) | 6.1 (20 ft) | 7,160 (7,050 LT) | 9,660 (9,508 LT) | 35 | — | 2; 2 catapults | wp-Omaha-class_cruiser; fm-30-50 n94 | — |
| farragut | Farragut | dd | usa | Monaghan DD-354, Aylwin DD-355, Dale DD-353, Worden DD-352 and others (Pearl Harbor) | 104.0 (341 ft 3 in) | 10.4 (34 ft) | 4.9 (16 ft) ≠ 4.7 (15½ ft max, FM) | 1,390 (1,365 t) | 2,100 (2,064 t) | 37 ≠ 36 (FM) | — | — | wp-Farragut-class_destroyer_(1934); fm-30-50 n136 | — |
| bagley | Bagley | dd | usa | Helm DD-388, Blue, Henley, Patterson, Ralph Talbot, Mugford, Jarvis, Bagley (Pearl Harbor) | 104.0 (341 ft 4 in) | 10.7 (35 ft) | 3.0–3.7 (10–12 ft) | 1,650 (1,624 t) | 2,280 (2,245 t) | 36.8 (trials) ≠ 36.5 (FM) | — | — | wp-Bagley-class_destroyer; fm-30-50 n120 | FM: "Gridley class" |
| gato | Gato | ss | usa | the fleet submarine type. Nautilus SS-168 at Midway is the older Narwhal class (FM n167: 2,730 tons) | 95.0 (311 ft 9 in) | 8.3 (27 ft 3 in) | 5.2 (17 ft max) | 1,550 surfaced (1,525 t) | 2,460 submerged (2,424 t) | 21 surfaced / 9 submerged | — | — | wp-Gato-class_submarine | a Midway Nautilus kit needs its own row (*verify*) |

### 3.2 Table S2: main and secondary batteries per class

`at` holds the turret or mount positions as fractions of loa from the bow,
read off the plates of Table S7 (M or Mc) or estimated (E). `sf` marks a
superfiring mount. Gun ids point to Table S3. AA is in Table S4.

| id | main battery | main at | secondary | conf | sources | notes |
| --- | --- | --- | --- | --- | --- | --- |
| yamato | jp-46-t94 × 9; 3 triple turrets (2 fore, 1 aft) | 0.26; 0.32 sf; 0.70 | jp-15.5-3ns × 12 in 4 triples (1941): fore 0.37 sf, aft 0.63 sf, two wing turrets about 0.45 P/S. The wing turrets were removed in 1944 (6 in 2 triples at Samar and Ten-Gō) | E | wp-Japanese_battleship_Yamato; nw-WNJAP_18-45_t94 | positions **E**: no PD plate reached |
| nagato | jp-41-3ns × 8; 4 twin | 0.21; 0.28 sf; 0.71 sf; 0.80 | jp-14-3ns × 18 casemates (1944; 20 as built) | M (oni-4142 n58) | wp-Japanese_battleship_Nagato | casemates along 0.25–0.65 |
| kongo | jp-36-t41 × 8; 4 twin | 0.22; 0.29 sf; 0.65; 0.81 | jp-15-t41 × 14 casemates (Kirishima 1942) ≠ 8 (Kongō 1944, Haruna 1945) | M (oni-4142 n34) | wp-Japanese_battleship_Kirishima; wp-Japanese_battleship_Kongō | ONI: "two superimposed twins for'd, two twins aft, separated by catapult" |
| fuso | jp-36-t41 × 12; 6 twin | Fusō: 0.20; 0.28 sf; 0.48; 0.66; 0.79 sf; 0.86. Yamashiro: 0.19; 0.27 sf; 0.46 (trained aft); 0.64; 0.78 sf; 0.85 | jp-15-t41 × 14 casemates (modernized) | M (oni-4142 n40, n46) | wp-Fusō-class_battleship | Fusō's No. 3 turret faces forward, Yamashiro's aft: the recognition difference |
| akagi | 20 cm/50 × 6 in casemates aft, 3 per side | about 0.72, 0.78, 0.84 P/S | — | E | wp-Japanese_aircraft_carrier_Akagi | 20 cm data as jp-20-3ns2 but the older No. 1 gun (*verify*) |
| kaga | 20 cm/50 × 10 in casemates aft, 5 per side | about 0.66–0.88 P/S | — | E | wp-Japanese_aircraft_carrier_Kaga | — |
| takao | jp-20-3ns2 × 10; 5 twin | 0.17; 0.22 sf; 0.27; 0.74 sf; 0.80 | — (12.7 cm DP in S4) | M (oni-4142 n118) | wp-Takao-class_cruiser | No. 3 stands at forecastle level behind the superfiring No. 2 |
| myoko | jp-20-3ns2 × 10; 5 twin | 0.17; 0.22 sf; 0.27; 0.74 sf; 0.80 | — | M (oni-4142 n112) | wp-Japanese_cruiser_Haguro | same pattern as Takao, smaller bridge |
| mogami | jp-20-3ns2 × 10; 5 twin (from 1939; 15 × 15.5 cm in 5 triples before) | 0.18; 0.24 sf; 0.30 sf; 0.74 sf; 0.80 | — | M (oni-4142 n126) | wp-Japanese_cruiser_Kumano | Kumano and Suzuya keep this layout at Samar |
| tone | jp-20-3ns2 × 8; 4 twin, all forward | 0.17; 0.22 sf; 0.28; 0.34 | — | M (oni-4142 n132) | wp-Tone-class_cruiser | the whole after third is an aircraft deck |
| nagara | jp-14-3ns × 7 single | 0.13; 0.17; 0.33; 0.48; 0.65; 0.74; 0.86 (some are wing mounts P/S; read the plan on n150) | 8 cm/40 × 2 AA | M (oni-4142 n150) | wp-Nagara-class_cruiser | — |
| sendai | jp-14-3ns × 7 single | 0.12; 0.16; 0.73; 0.86 on the centreline; the others abreast the bridge and funnels (*verify* on the n162 plan) | 8 cm/40 × 2 (1924) | M (oni-4142 n162) | wp-Sendai-class_cruiser | — |
| agano | jp-15-t41 × 6; 3 twin | 0.17; 0.23 sf; 0.78 | jp-8-t98 × 4 (2 twin) | E | wp-Agano-class_cruiser | measure from oni-222j n68 |
| kagero | jp-127-3ns × 6; 3 twin (Yukikaze 1945: 4) | 0.14; 0.75 sf; 0.81 | — | M (oni-4142 n193) | wp-Kagerō-class_destroyer | — |
| yugumo | jp-127-3ns × 6; 3 twin | 0.14; 0.75 sf; 0.81 | — | E (as Kagerō) | wp-Yūgumo-class_destroyer | — |
| fubuki | jp-127-3ns × 6; 3 twin | 0.14; 0.76 sf; 0.83 | — | E | wp-Fubuki-class_destroyer | measure from oni-4142 n175 to n184 |
| akizuki | jp-10-t98 × 8; 4 twin | 0.17; 0.22 sf; 0.71 sf; 0.78 | — | M (oni-4142 n199) | wp-Akizuki-class_destroyer_(1942) | — |
| north-carolina | us-16-45-mk6 × 9; 3 triple | 0.27; 0.36 sf; 0.77 | us-5-38-mk12 × 20 (10 twin) | M (fm-30-50 n33, a **pre-completion** drawing) | wp-North_Carolina-class_battleship | check against photographs before shipping |
| south-dakota | us-16-45-mk6 × 9; 3 triple | 0.24; 0.31 sf; 0.74 | us-5-38-mk12 × 16 (8 twin) | E | wp-USS_South_Dakota_(BB-57) | — |
| iowa | us-16-50-mk7 × 9; 3 triple | 0.24; 0.30 sf; 0.76 | us-5-38-mk12 × 20 (10 twin) | E | wp-Iowa-class_battleship | — |
| pennsylvania | us-14-45-mk8-12 × 12; 4 triple | 0.23; 0.30 sf; 0.69 sf; 0.77 | us-5-51 × 12 casemates (1941; 22 as built); 8 × us-5-25 AA | M (fm-30-50 n25 plan) | wp-USS_Arizona; fm-30-50 n24 | — |
| nevada | us-14-45-mk8-12 × 10; 2 triple (A, Y) + 2 twin (B, X) | 0.21 (triple); 0.28 sf (twin); 0.70 sf (twin); 0.78 (triple) | us-5-51 × 12; 8 × us-5-25 AA | E (fm-30-50 n17 downloaded, not read) | wp-Nevada-class_battleship; fm-30-50 n16 ("Turrets: 2 3-gun, 2 2-gun") | — |
| tennessee | us-14-50-mk11 × 12; 4 triple | 0.21; 0.28 sf; 0.69 sf; 0.77 | us-5-51 × 12 (FM: "12 5-inch"); 8 × us-5-25 AA | E | fm-30-50 n36; wp-Tennessee-class_battleship | — |
| colorado | us-16-45-mk1 × 8; 4 twin | 0.20; 0.27 sf; 0.67 sf; 0.74 | us-5-51 × 12 (FM; 10 by some accounts); 8 × us-5-25 AA | M (fm-30-50 n9 plan; the silhouette above it is not to the same scale) | fm-30-50 n8 | — |
| utah | none in 1941 (target ship) | — | AA training battery (*verify*) | — | wp-USS_Utah_(BB-31) | — |
| yorktown | us-5-38-mk12 × 8 single, in four groups of two on sponsons | 0.15–0.20 P/S; 0.84–0.90 P/S | — | M (fm-30-50 n43) | wp-USS_Yorktown_(CV-5) | — |
| essex | us-5-38-mk12 × 12: 4 twin turrets fore and aft of the island, 4 single on the port deck edge | twins about 0.33, 0.38, 0.55, 0.60 | — | E | wp-Essex-class_aircraft_carrier | — |
| casablanca | us-5-38-mk12 × 1, on the stern | 0.99 | — | E | wp-Template:Casablanca_class_armament | — |
| fletcher | us-5-38-mk12 × 5 single, enclosed | 0.16; 0.24 sf; 0.70 sf; 0.78; 0.85 | — | Mc (oni-4142 n194, "mistaken identity" silhouette) | wp-USS_Johnston_(DD-557) | — |
| sims | us-5-38-mk12 × 4 (1941; 5 as designed) | 0.14; 0.21 sf; 0.73 sf; 0.80 | — | E (fm-30-50 n117 downloaded, not read) | wp-Sims-class_destroyer | — |
| benham | us-5-38-mk12 × 4 | 0.15; 0.22 sf; 0.75 sf; 0.82 | — | E | wp-Benham-class_destroyer | — |
| mahan | us-5-38-mk12 × 5 (Mounts 51 and 52 partly enclosed, 53–55 open) | 0.15; 0.22 sf; 0.71; 0.79 sf; 0.85 | — | Mc (oni-4142 n194) | wp-Mahan-class_destroyer | — |
| gleaves | us-5-38-mk12 × 5 as built (4 from DD-453 on; Gwin in 1942 *verify*) | 0.17; 0.24 sf; 0.71; 0.77 sf; 0.84 | — | Mc (oni-4142 n194, Benson silhouette) | wp-Gleaves-class_destroyer | — |
| john-c-butler | us-5-38-mk12 × 2 single, enclosed | 0.15; 0.86 | — | E | wp-John_C._Butler-class_destroyer_escort | — |
| st-louis | us-6-47-mk16 × 15; 5 triple | 0.18; 0.25 sf; 0.31; 0.72 sf; 0.79 | us-5-38-mk12 × 8 (4 twin) | E (fm-30-50 n107 downloaded, not read) | wp-Brooklyn-class_cruiser | — |
| brooklyn | us-6-47-mk16 × 15; 5 triple | as st-louis | us-5-25 × 8 single | E | wp-Brooklyn-class_cruiser | Honolulu |
| omaha | us-6-53-mk12 × 10 (Raleigh): 2 twin turrets + 6 casemates | twins about 0.15 and 0.88; casemates stacked P/S near bow and stern | 3-in/50 × 2 AA | E | wp-Omaha-class_cruiser; fm-30-50 n94 ("all others, 10 6-inch") | — |
| farragut | us-5-38-mk12 × 5 (1941) | 0.15; 0.22 sf; 0.70; 0.78 sf; 0.85 | — | E | wp-Farragut-class_destroyer_(1934) | — |
| bagley | us-5-38-mk12 × 4 | 0.15; 0.22 sf; 0.75 sf; 0.82 | — | E | wp-Bagley-class_destroyer | — |
| gato | 3-in/50 deck gun × 1 | about 0.55 (*verify*) | — | E | wp-Gato-class_submarine | — |

### 3.3 Table S3: gun data (NavWeaps, secondary)

All from the NavWeaps page named in the source column, which in turn cites
USNTMJ reports, BuOrd OP 1188, Campbell and Lacroix and Wells. Shell weights
are AP / HE where the two differ. Range is the maximum at the elevation
given.

| gun id | gun | calibre_mm | shell_kg | mv_ms | rof_rpm | range_m @ elev | elevation_deg | traverse_deg_s | elev_rate_deg_s | time of flight | used on | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| jp-46-t94 | 46 cm/45 Type 94 (officially "40 cm") | 460 | 1,460 / 1,360 | 780 / 805 | 1.5–2 | 42,030 @ 45° | −5 / +45 | 2 | 8 | — | yamato | nw-WNJAP_18-45_t94 (dispersion 400–500 m at maximum range) |
| jp-41-3ns | 41 cm/45 3rd Year Type | 410 | 1,020 / 938.5 | 780 / 805 | 1.5–2.5 | 38,725 @ 43° | −5 / +43 (+30 as built) | — | — | — | nagato | nw-WNJAP_161-45_3ns |
| jp-36-t41 | 36 cm/45 41st Year Type | 356 | 673.5 / 625 | 770–775 / 805 | 2 | 35,450 @ 43° | −5 / +43 (modernized; +25 as built) | 3 | 5 | 20,000 m @ 14.4°, 25,000 m @ 20.0° | kongo, fuso | nw-WNJAP_14-45_t41 (dye: Kongō red, Haruna black, Kirishima blue, Hiei none) |
| jp-20-3ns2 | 20 cm/50 3rd Year Type No. 2 | 203 | 125.85 | 840 | 3–4 | 29,400 @ 45° (28,900 @ 40°) | −5 / +40 (Models C, D); +55 (E2); +70 (E, Takao) | 4 | 6 (C, D); 12 (E) | 20,000 m @ 18.0°, angle of fall 29° | takao, myoko, mogami, tone | nw-WNJAP_8-50_3ns |
| jp-15.5-3ns | 15.5 cm/60 3rd Year Type | 155 | 55.87 | 920–925 | 5–6 | 27,400 @ 45° | −7 / +55 | 5–6 | 10 | 20,000 m @ 20° | yamato (secondary) | nw-WNJAP_61-60_3ns |
| jp-15-t41 | 15 cm/50 41st Year Type | 152 | 45.36 (HE) | 850–855 | 5–6 effective | 21,000 @ 45° | casemates −5 / +30 (modernized) | twin mount (Agano) ±150° | twin 10 | — | kongo, fuso (casemates); agano (twin) | nw-WNJAP_6-50_t41 |
| jp-14-3ns | 14 cm/50 3rd Year Type | 140 | 38.0 | 850–855 | 6–10 | 20,574 @ 35° (19,100 @ 30°) | single CL mounts +35 | manual (singles) | 8 (singles) | — | nagato (casemates), nagara, sendai | nw-WNJAP_55-50_3ns |
| jp-127-t89 | 12.7 cm/40 Type 89 (DP) | 127 | 23.45 | 700–725 | 8 sustained, 14 initial | 14,800 @ 45°; AA ceiling 9,400 m @ 75° | (*verify*) | — | — | — | carriers, battleships, cruisers (AA) | nw-WNJAP_5-40_t89 |
| jp-127-3ns | 12.7 cm/50 3rd Year Type | 127 | 23.0 | 915 | 5–10 (Type A twin 5) | 18,380 @ 45° | −7 / +75 (Types A, B); lower in Type C (*verify*) | 4–6 | 6–12 officially | — | kagero, yugumo, fubuki | nw-WNJAP_5-50_3ns |
| jp-12-10ns | 12 cm/45 10th Year Type | 120 | 20.3 | 825–830 | 6–8 effective | 16,000 @ 45° | −10 / +75 | manual (Model B) | manual (B); 6.5 (B2, A2) | — | akagi (AA), chokai | nw-WNJAP_47-45_10ns |
| jp-10-t98 | 10 cm/65 Type 98 | 100 | 13.0 | 1,000 | 15–19 | 19,500 @ 45° | −10 / +90 | 11–16 | 16 | — | akizuki | nw-WNJAP_39-65_t98 |
| jp-8-t98 | 8 cm/60 Type 98 | 76 | 5.99 | 900–920 | 25 | 13,600 @ 45° | −10 / +90 | 16–18 | 16 | — | agano | nw-WNJAP_3-60_t98 |
| jp-25-t96 | 25 mm/60 Type 96 | 25 | 0.24–0.26 | 900 | 110–120 effective (200–260 cyclic) per barrel | 6,800 @ 45°; AA ceiling 5,500 m | −10 / +85 | manual (mostly) | manual; 12 on some triples | — | all IJN ships | nw-WNJAP_25mm-60_mg (NavWeaps notes that its sources disagree on range) |
| jp-13-t93 | 13.2 mm Type 93 MG | 13.2 | 0.05 | 805 | 250 practical | AA effective 1,000 m, maximum 2,000 m | −15 / +85 | manual | manual | — | older AA fits | nw-WNJAP_13mm-76_mg |
| us-16-45-mk6 | 16"/45 Mark 6 | 406 | 1,225 / 862 | 701 / 803 | 2 | 33,741 @ 45.4° (36,900 yd) | −2 / +45 | — | — | 6.83 s @ 4,572 m; 14.45 s @ 9,140 m; 22.94 s @ 13,716 m | north-carolina, south-dakota | nw-WNUS_16-45_mk6 |
| us-16-50-mk7 | 16"/50 Mark 7 | 406 | 1,225 / 862 | 762 / 820 (new gun) | 2 | 38,720 @ 45° | −2 / +45 | — | — | 13.24 s @ 9,140 m | iowa | nw-WNUS_16-50_mk7 |
| us-16-45-mk1 | 16"/45 Mark 1 | 406 | 952.5 | 792 | 1.5 | 31,360 @ 30° (34,300 yd) | −4 / +30 | — | — | — | colorado | nw-WNUS_16-45_mk1 |
| us-14-45-mk8-12 | 14"/45 Marks 8–12 | 356 | 680.4 / 578 | 792 / 834 | 1.5–1.75 | about 31,090 @ 29.5° (34,000 yd) | −5 / +30 (modernized Nevada and Pennsylvania) | — | — | 13.40 s @ 9,144 m | nevada, pennsylvania | nw-WNUS_14-45_mk10 |
| us-14-50-mk11 | 14"/50 Mark 11 | 356 | 680.4 / 578 | 823 / 861 | 1.75 | about 32,900 @ 29.5° (36,000 yd) | −5 / +30 | about 2 | about 9 | 12.86 s @ 9,140 m | tennessee | nw-WNUS_14-50_mk11 |
| us-6-47-mk16 | 6"/47 Mark 16 | 152 | 59.0 / 47.6 | 762 / 812 | 8–10 | 23,881 @ 47.5° | −5 / +40 (+60 from 1943) | 10 | 10 | 16.15 s @ 9,140 m | st-louis, brooklyn | nw-WNUS_6-47_mk16 |
| us-6-53-mk12 | 6"/53 Marks 12–18 | 152 | 47.6 | 914 | 6–7 | about 23,200 @ 30° (twin); casemates +20° | −10 / +30 (twin) | — | 7.6 (twin) | 13.97 s @ 9,140 m | omaha | nw-WNUS_6-53_mk12 |
| us-5-38-mk12 | 5"/38 Mark 12 | 127 | 25.0 | 762–792 | 15–22 (base ring with hoists); 12–15 (pedestal) | 16,642 @ 43.3° (18,200 yd) | −15 / +85 (most mounts) | — | about 15 (Mark 21 under power) | 20.81 s @ 9,144 m | most US ships | nw-WNUS_5-38_mk12 |
| us-5-25 | 5"/25 Marks 10–17 | 127 | 24.4–24.5 | 657 | 15–20 | 13,259 @ 45° | −15 / +85 | — | — | 26.07 s @ 9,140 m | Pearl Harbor battleships' AA, brooklyn | nw-WNUS_5-25_mk10 |
| us-5-51 | 5"/51 Marks 7–15 | 127 | 22.7 | 960 | 8–9 | 17,282 @ 25.2° | −10 / +15 to +25 | manual | manual | 17.00 s @ 9,140 m | battleship casemates | nw-WNUS_5-51_mk7 |
| us-40-bofors | 40 mm/56 Bofors | 40 | 0.90 | 850–881 | 120 per barrel (cyclic) | AA ceiling 6,950 m maximum, 6,200 m effective | −15 / +90 (*verify*) | — | 24 | — | 1943 on | nw-WNUS_4cm-56_mk12 |
| us-20-oerlikon | 20 mm/70 Oerlikon | 20 | 0.123 | 835–844 | 250–320 practical | — | — | manual | manual | — | from early 1942 | nw-WNUS_2cm-70_mk234 (32 % of Japanese aircraft downed by the USN Dec 1941–Sept 1944 credited to it) |
| us-28-1.1in | 1.1"/75 | 28 | 0.416 | 792–823 | 100 practical (150 cyclic) | — | −15 / +110 | 30 | 24 | — | 1941–42 fits | nw-WNUS_1-1-75_mk1 |
| us-12.7-m2 | .50 M2 MG | 12.7 | 0.0485 | 860–893 | 450–600 (water-cooled) | about 2,400 effective (*verify*) | −10 / +80 | manual | manual | — | 1941–42 fits | nw-WNUS_50cal-M2_MG |

### 3.4 Table S4: AA fit as of each battle's date

Counts are barrels, with the mount pattern in brackets. Wikipedia infoboxes
give a fit "as built" and a "final" fit, and few give the fit on a battle's
date. Rows not marked *verify* are the infobox's own date. A unit can
override `aa` (DATA.md §8), so these are the kit defaults.

| kit | ship | battle (date) | heavy AA | light AA | MG | conf | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| akagi | Akagi | Midway (1942-06-04) | 12 × jp-12-10ns (6 twin) | 28 × jp-25-t96 (14 twin) | — | infobox post-1938, *verify* for June 1942 | wp-Japanese_aircraft_carrier_Akagi |
| kaga | Kaga | Midway | 16 × jp-127-t89 (8 twin) | 22 × jp-25-t96 (11 twin) | — | as above | wp-Japanese_aircraft_carrier_Kaga (DATA.md's example agrees) |
| soryu | Sōryū | Midway | 12 × jp-127-t89 (6 twin) | 28 × jp-25-t96 (14 twin) | — | as above | wp-Japanese_aircraft_carrier_Sōryū |
| hiryu | Hiryū | Midway | 12 × jp-127-t89 (6 twin) | 31 × jp-25-t96 (7 triple, 5 twin) | — | as above | wp-Japanese_aircraft_carrier_Hiryū |
| shokaku | Shōkaku, Zuikaku | 1941-12 | 16 × jp-127-t89 (8 twin) | 36 × jp-25-t96 (12 triple) | — | as built | wp-Shōkaku-class_aircraft_carrier |
| zuiho | Zuihō | as built | 8 × jp-127-t89 (4 twin) | 8 × jp-25-t96 (4 twin) | — | the Leyte fit was larger, *verify* | wp-Japanese_aircraft_carrier_Zuihō |
| kongo | Kirishima | Guadalcanal (1942-11-14) | 8 × jp-127-t89 (4 twin) | 20 × jp-25-t96 (10 twin) | — | infobox "(1942)" | wp-Japanese_battleship_Kirishima |
| kongo | Kongō | Samar (1944-10-25) | 12 × jp-127-t89 (6 twin) | 100 × jp-25-t96 (15 triple, 8 twin, 40 single) | — | infobox "1944" | wp-Japanese_battleship_Kongō |
| kongo | Haruna | Samar | 12 × jp-127-t89 | 108 × jp-25-t96 (1945 figure; Oct 1944 *verify*) | — | *verify* | wp-Japanese_battleship_Haruna |
| nagato | Nagato | Samar | 8 × jp-127-t89 (4 twin) | 98 × jp-25-t96 | — | infobox final | wp-Japanese_battleship_Nagato |
| yamato | Yamato | Samar | 24 × jp-127-t89 (12 twin, after the 1944 refit) | about 113 × jp-25-t96 (*verify*) | 4 × jp-13-t93 | *verify* | wp-Japanese_battleship_Yamato (gives only the 1941 and 1945 fits) |
| yamato | Yamato | Ten-Gō (1945-04-07) | 24 × jp-127-t89 | 162 × jp-25-t96 | 4 × jp-13-t93 | infobox 1945 | wp-Japanese_battleship_Yamato |
| takao | Atago, Takao | Guadalcanal | 8 × jp-127-t89 (4 twin) | 25 mm count *verify* (2 × 40 mm as built) | — | *verify* | wp-Takao-class_cruiser |
| takao | Atago (final, 24 June 1944) | Leyte | 8 × jp-127-t89 | 60 × jp-25-t96 (4 triple, 8 twin, 32 single) | 4 × jp-13-t93 | infobox | wp-Japanese_cruiser_Atago |
| takao | Chōkai | Samar | 4 × jp-12-10ns (4 single) | 38 × jp-25-t96 (infobox "4x2, 22x1", which does not add up: *verify*) | — | *verify* | wp-Japanese_cruiser_Chōkai |
| myoko | Haguro | Samar | 8 × jp-127-t89 (4 twin) | about 52 × jp-25-t96 (**E**, *verify*) | — | E | — |
| mogami | Kumano, Suzuya | Samar | 8 × jp-127-t89 (4 twin) | 50 × jp-25-t96 | — | infobox final | wp-Japanese_cruiser_Kumano |
| tone | Tone, Chikuma | Midway | 8 × jp-127-t89 (4 twin) | 12 × jp-25-t96 (6 twin) | — | as built | wp-Tone-class_cruiser |
| tone | Tone, Chikuma | Samar | 8 × jp-127-t89 | about 57 × jp-25-t96 (**E**, *verify*) | — | E | — |
| nagara | Nagara | Guadalcanal | 2 × 8 cm/40 | 25 mm added by 1942 (*verify*) | — | *verify* | wp-Nagara-class_cruiser |
| sendai | Sendai | Guadalcanal | 2 × 8 cm/40 (1924) | 4 × jp-25-t96 (2 twin, as on Naka in spring 1941) | 2 × jp-13-t93 | Naka's fit applied to Sendai, *verify* | wp-Sendai-class_cruiser |
| agano | Noshiro, Yahagi | Samar | 4 × jp-8-t98 (2 twin) | 6 as built (2 triple); Oct 1944 total *verify* | 4 × 13 mm | *verify* | wp-Agano-class_cruiser |
| kagero | Kagerō class | 1942 | — | 4 × jp-25-t96 (2 twin) | — | as built | wp-Kagerō-class_destroyer |
| kagero | Yukikaze | Ten-Gō (1945-04) | — | 28 × jp-25-t96 (4 triple, 1 twin, 14 single) | 4 × 13 mm | infobox | wp-Kagerō-class_destroyer |
| yugumo | Yūgumo class | 1941-12 | — | 4 × jp-25-t96 | — | as built | wp-Yūgumo-class_destroyer |
| fubuki | Fubuki class | Guadalcanal | — | *verify* (2 × 13 mm as built) | 2 × jp-13-t93 | *verify* | wp-Fubuki-class_destroyer |
| akizuki | Teruzuki | Guadalcanal | 8 × jp-10-t98 (the main battery is DP) | 4 × jp-25-t96 (2 twin) | — | Akizuki in 1942 | wp-Akizuki-class_destroyer_(1942) |
| pennsylvania / nevada / tennessee / colorado | Pearl Harbor battleships | Pearl Harbor (1941-12-07) | 8 × us-5-25 | 1.1-in quads on some, *verify* | Colorado class (FM): "2 1-pounders, 2 machine guns, 11 machine guns AA"; Nevada: 8 × .50 | FM is Oct 1941 | fm-30-50 n8, n16, n24, n36; wp-Nevada-class_battleship |
| yorktown | Yorktown | Midway | 8 × us-5-38-mk12 (also the main battery) | 16 × us-28-1.1in (4 quad); 24 × us-20-oerlikon (from Feb 1942) | 24 × .50 | infobox; ≠ the Yorktown report's "starboard battery: 10-20mm, 4-1.1 mounts, 12-50 caliber, 2-30 caliber" (r4) | wp-USS_Yorktown_(CV-5); r4 §3.6 |
| yorktown | Enterprise, Hornet | Midway | 8 × us-5-38-mk12 | 1.1-in quads and 20 mm, counts *verify* | .50s | *verify* | wp-Yorktown-class_aircraft_carrier |
| north-carolina | Washington | Guadalcanal | 20 × us-5-38-mk12 (10 twin) | 16 × us-28-1.1in (4 quad); 20 mm *verify* | 18 × .50 | infobox | wp-USS_Washington_(BB-56) |
| south-dakota | South Dakota | Guadalcanal | 16 × us-5-38-mk12 (8 twin) | 28 × us-40-bofors (7 quad); 28 × us-28-1.1in (7 quad); 34 × us-20-oerlikon | 8 × .50 | infobox, date not stated (*verify*) | wp-USS_South_Dakota_(BB-57) |
| fletcher | Johnston, Hoel | Samar | — (main battery DP) | 10 × us-40-bofors (5 twin); 7 × us-20-oerlikon | — | infobox | wp-USS_Johnston_(DD-557); wp-USS_Hoel_(DD-533) |
| casablanca | Taffy 3 carriers | Samar | 1 × us-5-38-mk12 | 8 × us-40-bofors as 4 twin (class template) ≠ "in single mounts" (Gambier Bay article); 12 × us-20-oerlikon | — | ≠ | wp-Template:Casablanca_class_armament; wp-USS_Gambier_Bay |
| john-c-butler | Samuel B. Roberts | Samar | — | 4 × us-40-bofors (2 twin); 10 × us-20-oerlikon | — | class as built | wp-John_C._Butler-class_destroyer_escort |
| sims | Walke | Guadalcanal | — | 20 mm by late 1942 (*verify*) | 8 × .50 ("typical 1941") | *verify* | wp-Sims-class_destroyer |
| benham / mahan / gleaves | Benham, Preston, Gwin | Guadalcanal | — | 20 mm (*verify*); Gleaves DD-453 on: 4 × 40 mm + 7 × 20 mm | 4–6 × .50 as built | *verify* | wp class articles |
| st-louis | Helena | Pearl Harbor | 8 × us-5-38-mk12 (4 twin) | 4 × 3-pounders (FM) | 3 MG (FM); 8 × .50 (wp) | FM Oct 1941 | fm-30-50 n106; wp-Brooklyn-class_cruiser |
| brooklyn | Honolulu | Pearl Harbor | 8 × us-5-25 | 4 × 3-pounders (FM) | 3 MG (FM) | FM | fm-30-50 n102 |
| omaha | Raleigh | Pearl Harbor | 2 × 3-in/50 | — | 8 MG AA (FM) | FM | fm-30-50 n94 |
| farragut / bagley | Monaghan, Helm and the others | Pearl Harbor | — | — | 4 × .50 | as built | wp class articles |

### 3.5 Table S5: torpedo fits and torpedo types

Per class:

| kit | tubes | barrels | torpedo | reloads | positions (fraction of loa) | conf | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| yamato, nagato, kongo, fuso | none in the war fit | — | — | — | — | — | wp infoboxes (Kirishima's 1942 list has none) |
| akagi, kaga, soryu, hiryu, shokaku, zuiho | none (aircraft carry type-91) | — | — | — | — | — | — |
| takao | 4 quad (Atago, Takao after the 1939 refit) ≠ 4 twin (Chōkai) | 16 ≠ 8 | type-93-m1 | 8 (Atago); 24 torpedoes carried (Chōkai) | about 0.55–0.62 P/S under the aircraft deck (E) | wp ≠ | wp-Japanese_cruiser_Atago; wp-Japanese_cruiser_Chōkai |
| myoko | 4 quad (after reconstruction) | 16 | type-93-m1 | 8 (*verify*) | about 0.55–0.62 P/S (E) | — | wp-Japanese_cruiser_Haguro |
| mogami | 4 triple, rotating | 12 | type-93-m1 | 12 | about 0.60 P/S (E) | — | wp-Japanese_cruiser_Kumano |
| tone | 4 triple | 12 | type-93-m1 | *verify* | about 0.55 P/S (E) | — | wp-Tone-class_cruiser |
| nagara, sendai | 4 twin | 8 | type-93-m1 (refit; *verify*) | 8 (16 carried) | P/S amidships (E) | — | wp-Nagara-class_cruiser; wp-Sendai-class_cruiser |
| agano | 2 quad | 8 | type-93-m1 | *verify* | centreline amidships (E) | — | wp-Agano-class_cruiser |
| kagero, yugumo | 2 quad (Type 92 mounts) | 8 | type-93-m1 | 8 (16 carried) | 0.45; 0.61 (M, oni-4142 n193) | — | wp-Kagerō-class_destroyer; wp-Yūgumo-class_destroyer |
| fubuki | 3 triple | 9 | Type 90 (8th Year Type as built) | 9 (18 carried) | about 0.44; 0.58; 0.68 (E) | — | wp-Fubuki-class_destroyer |
| akizuki | 1 quad | 4 | type-93-m1 | *verify* | 0.50 (M, oni-4142 n199) | — | wp-Akizuki-class_destroyer_(1942) |
| fletcher | 2 quintuple | 10 | mk15 | 0 | 0.47; 0.60 (Mc) | — | wp-USS_Johnston_(DD-557) |
| sims | 2 quad, centreline ("typical 1941"; 3 quad as designed) | 8 | mk15 | 0 | E | — | wp-Sims-class_destroyer |
| benham | 4 quad (2 each side) | 16 | mk15 | 0 | E | — | wp-Benham-class_destroyer |
| mahan | 3 quad: 1 centreline between the stacks, 2 P/S abaft the aft stack | 12 | mk15 | 0 | about 0.50; 0.60 P/S (E) | — | wp-Mahan-class_destroyer |
| gleaves | 2 quintuple (1 from DD-453 on) | 10 | mk15 | 0 | 0.50; 0.63 (Mc, Benson silhouette) | — | wp-Gleaves-class_destroyer |
| john-c-butler | 1 triple | 3 | mk15 | 0 | about 0.55 (E) | — | wp-John_C._Butler-class_destroyer_escort |
| farragut | 2 quad | 8 | mk15 (*verify*) | 0 | E | — | wp-Farragut-class_destroyer_(1934) |
| bagley | 4 quad | 16 | mk15 | 0 | E | — | wp-Bagley-class_destroyer |
| omaha | 2 triple + 2 twin, above water | 10 | *verify* | — | E | — | wp-Omaha-class_cruiser |
| gato | 6 bow + 4 stern | 10 | mk14 | 14 (24 carried) | bow; stern | — | wp-Gato-class_submarine |
| casablanca | none (carries aircraft torpedoes) | — | mk13 | — | — | — | bs-wdr-cve: Ommaney Bay stowed "nine torpedoes, complete with warheads" in hangar racks, frames 155–168 |

Torpedo types (ship and submarine):

| type id | name | dia_mm | weight_kg | warhead_kg | range_m @ kn | wander | failure in the record | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| type-93-m1 | 61 cm Type 93 Model 1 Mod 1–2 ("Long Lance"), kerosene-oxygen | 610 | 2,700 | 490 | 40,000 @ 36–38; 32,000 @ 40–42; 20,000 @ 48–50 | 500 m @ 20 km; 1,000 m @ 32 km; 1,500 m @ 40 km | about a third prematured or burst on wakes at the Java Sea, traced to crews resetting the fuze sensitivity | nw-tjp |
| type-93-m3 | 61 cm Type 93 Model 3 (1944) | 610 | 2,800 | 780 | 30,000 @ 36–38; 25,000 @ 40–42; 15,000 @ 48–50 | 350 m @ 15 km | — | nw-tjp |
| mk15 | 21-in Mark 15 Mod 0 (Mod 3) | 533 | 1,559 (1,742) | 224 TNT (363) | 5,500 @ 45; 9,150 @ 33.5; 13,700 @ 26.5 (Mod 3: 4,100 / 8,200 / 12,800) | — | Gwin fired four at the wrecked Benham and all four failed; Gwin then sank her by gunfire (cf-kirishima) | nw-tus |
| mk14 | 21-in Mark 14 Mod 0 (Mod 3) | 533 | 1,361 (1,388) | 230 TNT (303 TPX) | 4,100 @ 46; 8,200 @ 31 | — | Trout's hit on Kirishima on 13 Nov 1942 was a dud (cf-kirishima). The 1942–43 exploder and depth faults: *verify* in print | nw-tus |

### 3.6 Table S6: armour

| kit | belt_mm | deck_mm | turret_face_mm | other | source | notes |
| --- | --- | --- | --- | --- | --- | --- |
| yamato | 410 (inclined 20°) | 200–230 | 650 | — | wp-Yamato-class_battleship | — |
| nagato | 100–305 (the infobox range is truncated) ≠ 330 (13 in, ONI) | 69 + 100 + 38 (refit) | *verify* | barbettes 376 (refit) | wp-Japanese_battleship_Nagato; oni-4142 n58 | — |
| kongo | 203 ≠ 152–203 (6–8 in) with 76 ends (ONI) | up to 120 (refit) ≠ 70–102, 178 over vitals (ONI) | 229 ≠ 229–254 (ONI) | barbettes 343 (refit) | wp-Kongō-class_battlecruiser; oni-4142 n34 | ONI 222-J n25 (Haruna, 1945): belt 8 in, deck 5–4 in, turret 9 in |
| fuso | 305 ≠ 203–305 (ONI) | up to 51 (refit) ≠ 51, 178 over vitals (ONI) | 229–305 ≠ 203–305 (ONI) | CT 351 | wp-Japanese_battleship_Yamashiro; oni-4142 n40 | — |
| akagi | 152 | 79 | — | — | wp-Japanese_aircraft_carrier_Akagi | the hangar was unarmoured |
| kaga | 152 | 38 | — | — | wp-Japanese_aircraft_carrier_Kaga | — |
| soryu, hiryu, shokaku | *verify* (infobox ranges truncated: Hiryū "9–", Shōkaku "46–", deck "65–") | *verify* | — | — | wp | — |
| takao | 102 (machinery); 127 tapering to 38 (magazines) | 35–37 main; 12.7–25 upper | 25 | bulkheads 76–100 | wp-Takao-class_cruiser | — |
| myoko | 102 | 35 | 25 | barbettes 76 | wp-Myōkō-class_cruiser | — |
| mogami | 100 | 35 | 25 | magazines 127 | wp-Japanese_cruiser_Kumano | — |
| tone | 100 ≠ 145 | 31–65 | 25 (*verify*) | — | wp-Japanese_cruiser_Chikuma_(1938) ≠ wp-Tone-class_cruiser | — |
| nagara / sendai | 60 / 64 | 30 / 29 | — | — | wp class articles | — |
| agano | 60 (machinery), 55 (magazines) | 20 | — | bulkheads 20–25 | wp-Agano-class_cruiser | — |
| Japanese destroyers | none (splinter only) | — | — | — | — | — |
| north-carolina | 305 | 37 + 127 + 16 | 406 | barbettes 406; CT 406 | wp-North_Carolina-class_battleship | — |
| south-dakota | 310 | 152 (BB-57) ≠ 38 + 146 + 16 (class) | 457 | barbettes 439; CT 406 | wp-USS_South_Dakota_(BB-57); wp-South_Dakota-class_battleship_(1939) | — |
| iowa | 307 | 38 + 152 + 16 | *verify* | CT 439 | wp-Iowa-class_battleship | — |
| pennsylvania | 343 tapering to 203 | 76 (armour deck); 159 over the steering gear | 457 | CT 406; torpedo bulkhead 76 | wp-USS_Arizona | — |
| nevada | 343 | 76 + 38 (+51 in the 1927–29 refit) | 457 ≠ 406 | CT 406 | wp-USS_Oklahoma_(BB-37) | — |
| tennessee / colorado | 203–343 | 89 | 457 | barbettes 330; CT 406 | wp class articles | — |
| utah | 229–279 | 38 | 305 | — | wp-USS_Utah_(BB-31) | — |
| yorktown | 64–102 | protective decks "60 lb" (about 38) | — | CT 102 | wp-USS_Yorktown_(CV-5) | — |
| essex | 64–102 | hangar deck 64; 4th deck 38 | — | — | wp-Essex-class_aircraft_carrier | — |
| casablanca | none | — | — | — | — | a merchant-type hull |
| fletcher | 19 (machinery sides, splinter) | 13 | — | bridge 6 (square-bridge ships) | wp-USS_Johnston_(DD-557) | — |
| other US destroyers, DE | none (splinter) | — | — | — | — | — |
| st-louis / brooklyn | 127 on 16 (machinery); 51 (magazines) | 51 | 165 | barbettes 152; CT 127 | wp-Brooklyn-class_cruiser | — |
| omaha | 76 | 38 | — | — | wp-Omaha-class_cruiser | — |

### 3.7 Table S7: silhouettes, as blocks

How to read a cell: §1 gives the block grammar. Heights (`^`) are read off
the ONI plate's height scale (15-ft lines) to about ±2 m, or are **E**.
Freeboard pairs are fore/aft in metres. The plate column is the page to open
when modelling: `https://archive.org/download/<item>/page/n<leaf>_w1200.jpg`.
Ruler crops: `research/downloads/R6/img/r-<class>.jpg`. On the ONI plates
the bow is on the right, except Shōkaku (n77), which is drawn bow-left; the
fractions below are already converted. The `sheer` column is a suggestion
for DATA.md's 0–1 scalar.

| id | plate (item, leaf, plate date) | conf | bow | sheer | freeboard_m | blocks | words for the modeller |
| --- | --- | --- | --- | --- | --- | --- | --- |
| yamato | none reached (see §10) | E | bulbous | 0.6 (a strong rise forward of turret 1) | 10 / 6.4 (E) | turret(triple)@0.26; turret(triple)@0.32 sf; turret(triple)@0.37 sf (155 mm); tower@0.40-0.47^~40; funnel(raked)@0.50; tripod-mast@0.55; turret(triple)@0.63 sf (155 mm); turret(triple)@0.70; catapult@0.92<p; catapult@0.92>s; crane@0.96 | a long, low, flush hull with a wavy deck line. A compact tower bridge; one large funnel raked sharply aft; a flat quarterdeck with cranes and catapults. Every number **E** |
| nagato | oni-4142 n58 (Oct 1942); n59 recognition text | M | straight (raked) | 0.4 | about 10 / 5 (ONI scale) | turret(twin)@0.21; turret(twin)@0.28 sf; pagoda(tall)@0.34-0.41^~43; funnel(round)@0.51-0.55; tripod-mast@0.58-0.63; catapult@0.66; turret(twin)@0.71 sf; turret(twin)@0.80; casemate@0.25-0.65<p; casemate@0.25-0.65>s | ONI: "pagoda foremast; large single-pipe stack; tripod mainmast enclosing low tower; turrets superimposed fore and aft; catapult aft of mainmast; freeboard broken by blister, casemates" |
| kongo | oni-4142 n34 (Nov 1942); n35 text; oni-222j n25 (Haruna 1945) | M | straight (raked) | 0.3 | about 7.3 / 4 (ONI scale) | turret(twin)@0.22; turret(twin)@0.29 sf; pagoda(short)@0.35-0.41^41; funnel(round)@0.45-0.50^~23; tripod-mast@0.53; funnel(round)@0.54-0.58; director@0.62; turret(twin)@0.65; crane@0.71-0.75; catapult@0.74-0.78; turret(twin)@0.81; pole-mast@0.82 | ONI: "low pagoda foremast; two flared single pipe stacks; high tripod mainmast for'd of aft stack; two superimposed twins for'd, two twins aft separated by catapult; end-on: high pyramidal superstructure, extremely wide beam" |
| fuso | oni-4142 n40 (Fusō, Dec 1942), n46 (Yamashiro, Dec 1942); n41, n47 text | M | straight (raked) | 0.3 | about 8.5 / 3.7 (ONI scale) | Fusō: turret(twin)@0.20; turret(twin)@0.28 sf; pagoda(tall)@0.35-0.41^47; turret(twin)@0.48; crane@0.52-0.57; funnel(round)@0.59-0.63^~27; turret(twin)@0.66; tower@0.73-0.78; pole-mast@0.70; turret(twin)@0.79 sf; turret(twin)@0.86. Yamashiro: turret(twin)@0.19; turret(twin)@0.27 sf; pagoda(tall)@0.35-0.41^46; turret(twin)@0.46 (trained aft); funnel(round)@0.55-0.59; turret(twin)@0.64; tower@0.72-0.75; turret(twin)@0.78 sf; turret(twin)@0.85; catapult@0.88-0.94; crane@0.88 | the tallest pagodas in the fleet. ONI: Fusō "high, thin pagoda; large single pipe stack; tower mainmast topped by stick; catapult for'd of stack"; Yamashiro "high, square pagoda; heavy stack searchlight platform; single twins amidships (trained aft); catapult aft" |
| akagi | oni-4142 n27 (carrier silhouette chart, undated; pre-war appearance) | Mc | clipper | 0.2 | flight deck about 16 m (E) | flight-deck@0.04-0.97; island@0.36-0.40<p; pole-mast@0.40<p; funnel(downturned)@0.45-0.52>s (E); casemate@0.70-0.85<p; casemate@0.70-0.85>s; hangar@0.10-0.90 (2 decks) | a long flat deck on open pillars at both ends, a small island on the **port** side, and one big funnel curving down over the starboard side. Wp: forward funnel "angled 30° below horizontal"; after the rebuild "the rear vertical funnel was changed to match the forward funnel and incorporated into the same casing". Chart scale is small: **verify** the island position against print-pt |
| kaga | oni-4142 n27 | Mc | clipper | 0.1 | flight deck about 15 m (E) | flight-deck@0.00-0.98; island@0.30-0.37>s; pole-mast@0.35>s; funnel(downturned)@0.45-0.52>s (E); casemate@0.66-0.88<p; casemate@0.66-0.88>s; hangar@0.08-0.90 (2 decks) | the longest, flattest, lowest-looking deck of the four. A small starboard island well forward; the open pillars under the forward deck end; a row of 20 cm casemates low on each quarter |
| soryu | oni-4142 n27 ("Soryu class") | Mc | clipper | 0.2 | flight deck 12.8 m (wp) | flight-deck@0.04-0.99; island@0.40-0.45>s; funnel(downturned)@0.48-0.54>s (2, E); hangar@0.10-0.90 (2 decks) | small, slim and low. The chart puts the island at 0.40–0.45; wp says the forward elevator was "abreast the island", which suggests nearer a third (≠, **verify**). An open bow under the deck end and a pillared stern overhang |
| hiryu | none (ONI drew Hiryū as Sōryū) | E | clipper | 0.2 | flight deck about 13 m (E) | flight-deck@0.04-0.99; island@0.50-0.56<p (E); funnel(downturned)@0.48-0.54>s (2, E); hangar@0.10-0.90 | as Sōryū, but the island is on the **port** side near amidships (wp, Akagi article); position **E** |
| shokaku | oni-4142 n77 (Oct 1942, bow-left drawing, "based on incomplete information"); n78 photograph (Coral Sea) | M | clipper | 0.3 | 11 (bow) / flight deck about 14 (ONI scale) | flight-deck@0.055-0.995; island@0.33-0.40>s^~26; pole-mast@0.40; funnel(downturned)@0.45-0.52>s (2, E); hangar@0.12-0.90 (2 decks); director@0.20<p; director@0.80<p | a big, fast-looking carrier with a raised flared bow under an open deck end, and a small island about a third aft |
| zuiho | oni-4142 n79 (text and a photograph only); oni-222j n44 (Zuihō class plate, not measured) | E | clipper | 0.2 | — | flight-deck@0.05-0.95; funnel(downturned)@0.55>s; hangar@0.15-0.85 (1 deck) | flush deck, no island |
| takao | oni-4142 n118 (Atago class, Oct 1942); n121, n123, n124 (Takao, Maya, Chōkai views); oni-222j n58 (1945) | M | clipper | 0.6 (wavy deck) | about 9 / 5 (E) | turret(twin)@0.17; turret(twin)@0.22 sf; turret(twin)@0.27; bridge@0.34-0.41^~29; tripod-mast@0.42^~37; funnel(trunked)@0.45-0.50 (raked); funnel(round)@0.53-0.56; catapult@0.62-0.66<p; catapult@0.62-0.66>s; crane@0.64-0.70; pole-mast@0.68-0.70; turret(twin)@0.74 sf; turret(twin)@0.80 | the massive, castle-like bridge is the recognition feature. A big raked trunked fore funnel, an upright after funnel, then a tall mainmast and crane. Chōkai kept a smaller bridge and the old 12 cm guns (*verify*) |
| myoko | oni-4142 n112 ("Nachi class", Oct 1942); n113, n115, n117 (Haguro and others) | M | clipper | 0.6 | about 9 / 5 (E) | turret(twin)@0.17; turret(twin)@0.22 sf; turret(twin)@0.27; bridge@0.35-0.40^~26; tripod-mast@0.41^~34; funnel(trunked)@0.44-0.48 (raked); funnel(round)@0.53-0.57; tripod-mast@0.62; crane@0.62-0.68; catapult@0.60-0.66; turret(twin)@0.74 sf; turret(twin)@0.80 | Takao's layout, with a much smaller bridge and a lighter tripod foremast |
| mogami | oni-4142 n126 (Oct 1942); n129, n131 | M | clipper | 0.5 | about 8 / 5 (E) | turret(twin)@0.18; turret(twin)@0.24 sf; turret(twin)@0.30 sf; bridge@0.33-0.39^~23; tripod-mast@0.40^~32; funnel(trunked)@0.47-0.52 (raked); tripod-mast@0.57; crane@0.55-0.60; catapult@0.62-0.66<p; catapult@0.62-0.66>s; turret(twin)@0.74 sf; turret(twin)@0.80 | three turrets stepped up forward, one big raked funnel, two aft. Kumano and Suzuya at Samar |
| tone | oni-4142 n132 (Apr 1943); n133, n137 | M | clipper | 0.5 | about 8 / 4 (E) | turret(twin)@0.17; turret(twin)@0.22 sf; turret(twin)@0.28; turret(twin)@0.34; bridge@0.37-0.43^~25; tripod-mast@0.43^~33; funnel(trunked)@0.45-0.51 (raked); tripod-mast@0.62-0.66; catapult@0.70-0.75<p; catapult@0.70-0.75>s; boat-deck@0.66-1.00 (aircraft deck) | all four turrets forward and a long, low, empty after deck for floatplanes: unmistakable |
| nagara | oni-4142 n150 ("Natori class", Nov 1942); n151 | M | clipper | 0.4 | about 7.5 / 4.5 (ONI scale) | bridge@0.23-0.30^~23; tripod-mast@0.30^~32; funnel(round)@0.36-0.39^~17; funnel(round)@0.46-0.49; funnel(round)@0.56-0.59; catapult@0.62-0.72; tripod-mast@0.78; turret(single)@0.13; turret(single)@0.17; turret(single)@0.33; turret(single)@0.48; turret(single)@0.65; turret(single)@0.74; turret(single)@0.86 | ONI: "hull broken forward". The forecastle steps down at 0.32. Three evenly spaced round, capped funnels; a tripod at each end |
| sendai | oni-4142 n162 (Nov 1942) | M | clipper | 0.4 | about 7.5 / 4.5 (ONI scale) | bridge@0.22-0.30; tripod-mast@0.28; funnel(round)@0.34-0.36; funnel(round)@0.43-0.45; funnel(round)@0.50-0.54 (largest); funnel(round)@0.58-0.60; tripod-mast@0.70; catapult@0.80-0.90; turret(single)@0.12; turret(single)@0.16; turret(single)@0.73; turret(single)@0.86 | as Nagara but **four** funnels, the third the fattest. The forecastle break is at 0.37 |
| agano | oni-222j n68 (Agano class plate; downloaded, not measured) | E | clipper | 0.4 | — | turret(twin)@0.17; turret(twin)@0.23 sf; bridge@0.28-0.34; funnel(trunked)@0.42-0.47 (raked); catapult@0.60; tripod-mast@0.58; turret(twin)@0.78 | a sleek light cruiser with one raked funnel. Measure before use |
| kagero | oni-4142 n193 (Asashio class, Apr 1943; ONI used it for Kagerō); n194 aerial views of a model | M | clipper | 0.5 | about 6 / 3 (ONI scale) | turret(twin)@0.14; bridge@0.24-0.30^~12; pole-mast@0.31; funnel(raked)@0.36-0.41; deckhouse@0.42-0.48 (torpedo mount on it); funnel(round)@0.50-0.54; deckhouse@0.58-0.64 (torpedo mount); pole-mast@0.68; turret(twin)@0.75 sf; turret(twin)@0.81 | forecastle break at 0.33. One twin mount forward, two aft (superfiring); two funnels, the fore one raked and capped |
| yugumo | oni-222j ("Takanami class"; not measured) | E | clipper | 0.5 | as Kagerō | as Kagerō | as Kagerō |
| fubuki | oni-4142 n175–n184 (plates not measured) | E | clipper | 0.5 | — | turret(twin)@0.14; bridge@0.24-0.29; funnel(raked)@0.37-0.40; funnel(raked)@0.50-0.53; turret(twin)@0.76 sf; turret(twin)@0.83 | three triple torpedo mounts amidships; the forecastle break at about 0.30 |
| akizuki | oni-4142 n199 ("Terutsuki class", Mar 1943; 405 ft OA estimated) | M | clipper | 0.5 | about 6.5 / 3.5 (ONI scale) | turret(twin)@0.17; turret(twin)@0.22 sf; bridge@0.30-0.36^~13; pole-mast@0.38; funnel(trunked)@0.43-0.48 (raked); deckhouse@0.48-0.53 (quad torpedo mount); tower@0.55; deckhouse@0.59-0.63; pole-mast@0.65; turret(twin)@0.71 sf; turret(twin)@0.78 | a big destroyer with twin turrets in superfiring pairs at both ends and one large trunked funnel |
| north-carolina | fm-30-50 n33 (Oct 1941, "scheduled to be completed in 1942"; bow-left drawing) | M (pre-completion) | straight (raked) | 0.3 | — | turret(triple)@0.27; turret(triple)@0.36 sf; tower@0.41-0.52; funnel(round)@0.53 (faired to the tower, E); funnel(round)@0.60; deckhouse@0.66-0.72; turret(triple)@0.77; catapult@0.88-0.95<p; catapult@0.88-0.95>s; crane@0.98 | a tower foremast (no cage, no tripod), two funnels and a flush deck. Check every value against photographs: the drawing predates completion |
| south-dakota | none reached | E | straight (raked) | 0.3 | — | turret(triple)@0.24; turret(triple)@0.31 sf; tower@0.38-0.47; funnel(round)@0.50 (single, faired into the tower); turret(triple)@0.74; catapult@0.90 | shorter and more compact than Washington, with a single funnel close behind the tower. **E** |
| iowa | none reached | E | clipper | 0.4 | — | turret(triple)@0.24; turret(triple)@0.30 sf; tower@0.36-0.44; funnel(round)@0.46; funnel(round)@0.55; turret(triple)@0.76 | long and very fine forward. **E** |
| pennsylvania | fm-30-50 n25 (Arizona class drawing, Oct 1941) | M (plan) | straight | 0.1 | — | turret(triple)@0.23; turret(triple)@0.30 sf; tripod-mast@0.42; funnel(round)@0.48; tripod-mast@0.64; turret(triple)@0.69 sf; turret(triple)@0.77; casemate@0.25-0.70<p; casemate@0.25-0.70>s; catapult@0.69 (on No. 3 turret); catapult@0.96 | two heavy tripods with big fire-control tops, a single funnel, four triple turrets |
| nevada | fm-30-50 n17 (downloaded, not read) | E | straight | 0.1 | — | turret(triple)@0.21; turret(twin)@0.28 sf; tripod-mast@0.38; funnel(round)@0.47; tripod-mast@0.60; turret(twin)@0.70 sf; turret(triple)@0.78; catapult@0.70; catapult@0.96 | like Pennsylvania but with the twin turrets superfiring over the triples |
| tennessee | fm-30-50 n37 (downloaded, not read) | E | straight | 0.1 | — | turret(triple)@0.21; turret(triple)@0.28 sf; cage-mast@0.36; funnel(round)@0.47; cage-mast@0.60; turret(triple)@0.69 sf; turret(triple)@0.77 | **cage** masts with big tops; the funnel arrangement needs checking on the plate (*verify*) |
| colorado | fm-30-50 n9 (Oct 1941) | M (plan); the silhouette is not to the same scale | straight | 0.1 | — | turret(twin)@0.20; turret(twin)@0.27 sf; cage-mast@0.37; funnel(round)@0.45-0.52 (*verify*); cage-mast@0.58; turret(twin)@0.67 sf; turret(twin)@0.74; catapult@0.67 (on No. 3 turret, FM); catapult@0.96 | as Tennessee, with four **twin** 16-inch turrets; cage masts |
| utah | none reached | E | straight | 0.1 | — | turret(twin)@0.17; turret(twin)@0.24 sf; pole-mast@0.30; funnel(round)@0.38; funnel(round)@0.48; turret(twin)@0.55; turret(twin)@0.67; turret(twin)@0.75 sf; turret(twin)@0.82 | in 1941 a target ship, guns removed (*verify* the turrets' appearance) |
| yorktown | fm-30-50 n43 (Oct 1941); n42, n44 | M | straight (flared) | 0.2 | flight deck about 17 (E, from the drawing) | flight-deck@0.02-0.98; island@0.38-0.56>s; tripod-mast@0.43>s; funnel(trunked)@0.48-0.53>s (aft part of the island); pole-mast@0.59>s; turret(single)@0.15-0.20<p; turret(single)@0.15-0.20>s; turret(single)@0.84-0.90<p; turret(single)@0.84-0.90>s; hangar@0.10-0.90 (open sides with roller curtains, E) | a big starboard island with the funnel at its aft end, 5-in guns on sponsons at the four corners, round-downs at both deck ends. FM: recognition letters on the after flight deck |
| essex | none reached | E | clipper | 0.3 | — | flight-deck@0.02-0.98; island@0.40-0.52>s (single funnel); turret(twin)@0.33; turret(twin)@0.38 sf; turret(twin)@0.55 sf; turret(twin)@0.60; hangar@0.08-0.92 | **E** |
| casablanca | none reached | E | straight | 0.1 | — | flight-deck@0.04-0.96; island@0.15-0.20>s (small); funnel(round)@0.55<p (E); funnel(round)@0.55>s (E); hangar@0.20-0.85 (1 deck); turret(single)@0.99 | a small merchant-type hull under a short flight deck, a tiny island forward. The funnel arrangement is **E** |
| fletcher | oni-4142 n194 ("mistaken identity" silhouettes, Apr 1943) | Mc | straight (raked) | 0.4 | about 5 / 3 (E) | turret(single)@0.16; turret(single)@0.24 sf; bridge@0.31-0.37; pole-mast@0.38; funnel(round)@0.40-0.44; deckhouse@0.46-0.48 (torpedo mount); funnel(round)@0.51-0.55; deckhouse@0.58-0.62 (torpedo mount); deckhouse@0.63-0.75; turret(single)@0.70 sf; turret(single)@0.78; turret(single)@0.85 | flush deck with a long sheer; two round, capped funnels; five enclosed mounts (two forward, three aft) |
| sims | fm-30-50 n117 (downloaded, not read) | E | straight (raked) | 0.3 | — | turret(single)@0.14; turret(single)@0.21 sf; bridge@0.26-0.33; pole-mast@0.35; funnel(round)@0.43 (single); turret(single)@0.73 sf; turret(single)@0.80 | one funnel |
| benham | fm-30-50 n121 ("Gridley class"; downloaded, not read) | E | straight (raked) | 0.3 | — | turret(single)@0.15; turret(single)@0.22 sf; bridge@0.27-0.34; funnel(trunked)@0.44 (single); turret(single)@0.75 sf; turret(single)@0.82 | one trunked funnel; four quad torpedo mounts on the beams amidships |
| mahan | oni-4142 n194; fm-30-50 n133 (downloaded, not read) | Mc | straight (raked) | 0.3 | — | turret(single)@0.15; turret(single)@0.22 sf; bridge@0.28-0.35; pole-mast@0.38; funnel(round)@0.41-0.46; funnel(round)@0.54-0.58; deckhouse@0.70-0.75; turret(single)@0.71; turret(single)@0.79 sf; turret(single)@0.85 | two funnels; mounts 51–52 partly enclosed, 53–55 open |
| gleaves | oni-4142 n194 (Benson silhouette); fm-30-50 n113 (downloaded, not read) | Mc | straight (raked) | 0.3 | — | turret(single)@0.17; turret(single)@0.24 sf; bridge@0.28-0.36; pole-mast@0.39; funnel(round)@0.40-0.44; funnel(round)@0.55-0.59; turret(single)@0.71; turret(single)@0.77 sf; turret(single)@0.84 | Benson boats had flat-sided funnels, Gleaves boats round ones (*verify* which Gwin had) |
| john-c-butler | none reached | E | straight (raked) | 0.2 | — | turret(single)@0.15; bridge@0.28-0.36; funnel(round)@0.45; deckhouse@0.55 (triple torpedo mount); turret(single)@0.86 | a low, small, single-funnel escort. **E** |
| st-louis | fm-30-50 n107 (downloaded, not read) | E | straight | 0.1 | — | turret(triple)@0.18; turret(triple)@0.25 sf; turret(triple)@0.31; tower@0.35-0.42; funnel(round)@0.45; funnel(round)@0.55; turret(triple)@0.72 sf; turret(triple)@0.79; catapult@0.95<p; catapult@0.95>s; hangar@0.97 (in the transom) | a square stern with the aircraft hangar in it (FM: "square stern"); twin 5-in mounts |
| brooklyn | fm-30-50 n103 (downloaded, not read) | E | straight | 0.1 | — | as st-louis | single open 5-in/25 guns instead of twins |
| omaha | fm-30-50 n95 (downloaded, not read) | E | straight | 0.2 | — | turret(twin)@0.15; bridge@0.20-0.25; funnel(round)@0.35; funnel(round)@0.43; funnel(round)@0.51; funnel(round)@0.59; turret(twin)@0.88; casemate@0.18<p; casemate@0.18>s; casemate@0.84<p; casemate@0.84>s | four tall thin funnels |
| farragut | fm-30-50 n137 (downloaded, not read) | E | straight (raked) | 0.3 | — | turret(single)@0.15; turret(single)@0.22 sf; bridge@0.27-0.34; funnel(round)@0.42; funnel(round)@0.53; turret(single)@0.70; turret(single)@0.78 sf; turret(single)@0.85 | two funnels |
| bagley | fm-30-50 n121 | E | straight (raked) | 0.3 | — | as benham | one funnel |
| gato | fm-30-50 n160 (the pre-war Thresher class; not measured) | E | straight | 0 | 1.5 / 1 (E) | tower@0.40-0.48 (conning tower and periscope shears); turret(single)@0.55 (3-in/50) | — |

### 3.8 Table S8: hull colour, camouflage and deck markings by date

No primary text for the US measures was reached: SHIPS-2 sits behind a JS
challenge, and NHHC did not answer. No source at all was reached for the IJN
arsenal greys. This table is the scheme the kit needs, filled where I could,
and is mostly *verify*. The measure definitions are from memory and need
SHIPS-2.

| palette or measure | definition | battles and ships | conf | source |
| --- | --- | --- | --- | --- |
| ijn-kure-grey, ijn-sasebo-grey, ijn-maizuru-grey, ijn-yokosuka-grey | the four arsenals mixed the same "gunkan-iro" warship grey to slightly different shades (Kure the darkest, by the usual telling). A ship wore her home arsenal's grey | Kure: Yamato, Nagato, Kongō class, Fusō class, Akagi, Sōryū, Hiryū (*verify* each); Yokosuka: Kaga, Shōkaku (*verify*) | E | — (*verify* in a modelling reference: Lengerer; Model Art) |
| ijn-deck | natural wood on battleships and carriers; brown linoleum held by brass strips on cruiser and destroyer decks | all IJN | E | — |
| ijn-carrier-deck | flight deck of wood with white centreline and edge lines; a white katakana identifier on the aft deck (Akagi ア, Kaga カ, Sōryū サ, Hiryū ヒ, *verify*). A red hinomaru with a white border forward, as in DATA.md's example: **disputed for June 1942**, *verify* in print-pt | Midway carriers | E | — |
| usn-ms1 | Measure 1, Dark Gray System: Dark Gray 5-D on the hull and superstructure up to the funnel tops, Light Gray 5-L above | Pearl Harbor battleships (*verify* per ship) | E | ships-2 (not reached) |
| usn-ms11 | Measure 11, Sea Blue System: Sea Blue 5-S on all vertical surfaces; Deck Blue 20-B decks | Yorktown, Enterprise at Midway (*verify*) | E | ships-2 |
| usn-ms12 | Measure 12, Graded System: Navy Blue 5-N to the main deck, Ocean Gray 5-O to the level of the funnel tops (or the like), Haze Gray 5-H above. "Ms 12 modified" has irregular splotches | Hornet at Midway in Ms 12 mod. (*verify*); many early-1942 ships | E | shipcamouflage.com caption, opened: "BB-60 USS Alabama early 1942 wearing MS 12 modified" |
| usn-ms21 | Measure 21, Navy Blue System: Navy Blue 5-N on all vertical surfaces | Washington, South Dakota and the destroyers at Guadalcanal, Nov 1942 (*verify*) | E | ships-2 |
| usn-ms22 | Measure 22, Graded: Navy Blue 5-N below the lowest point of the main deck, Haze Gray 5-H above | common 1943–44 | E | ships-2 |
| usn-ms31, ms32, ms33 | dazzle "designs" in dark, medium and light colours, each ship to a numbered design (e.g. 6d, 3d, 15a) | Taffy 3 at Samar: Johnston, Hoel, Heermann, Samuel B. Roberts and the CVEs wore dazzle designs (numbers *verify*) | E | shipcamouflage.com caption, opened: "BB-63 USS Missouri in 1944 wearing MS32/22d" |
| usn-flight-deck | wooden flight decks stained Deck Blue (Stain 21) from about 1942, with white markings and the recognition letters aft (FM: "prominently painted on after end of flight deck") | US carriers | E (except the FM line) | fm-30-50 n42 |

## 4. The fatal calibration: what sank each ship in the record

This is the data for ENGINEERING.md §5's `damage.js`: the record's hits and
the result, which the sim's scripted hits must reproduce on schedule.
"Lost" means past `fatal` (burning out of control, dead in the water or
foundering), which is not always the same minute as sinking.

### 4.1 Table F1: the record's hits and results

| ship | kit | battle, date (local) | hits in the record | time from first fatal hit to loss | outcome | what it says to the model | sources |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kaga | kaga | Midway, 1942-06-04 10:22 | 4 of 9 bombs (#4, #7, #8, #9) ≠ "a minimum of one 1,000-lb and three 500-lb" ≠ "three to five" | burning from 10:24; sank 19:25 after two torpedoes from Hagikaze (TROM) | lost at about 10:30, sank about 9 h later | four bombs into a hangar of armed, fuelled aircraft are fatal | r4 §3.9 (Nagumo, NWC 1948, TROM, wp) |
| Akagi | akagi | Midway, 10:26 | **one** direct hit (1,000 lb, the amidships elevator) and one near miss aft that jammed the rudder ≠ 3 bombs (Nagumo log, Table 3) | torpedoes in the hangar exploding by 10:29; scuttled about 05:00 on 5 June | one bomb was fatal | the hangar-state factor (D3) must make a single 454-kg bomb fatal when armed aircraft and loose ordnance are below | r4 §3.9; wp-Japanese_aircraft_carrier_Akagi |
| Sōryū | soryu | Midway, 10:25–10:28 | 3 × 1,000-lb ≠ "five direct hits" (VB-3's claim) | fires spreading, explosions by 10:30; sank 19:12–19:13 | lost within about 5 min | as Kaga | r4 §3.9 |
| Hiryū | hiryu | Midway, 17:03–17:05 | 4 bombs ≠ "four (possibly five)" | burned through the night; torpedoed by Makigumo 05:10 on 5 June; sank about 09:12 | lost | as Kaga | r4 §3.9 |
| Yorktown | yorktown | Midway, 12:05–12:15 and 14:41–14:46 | 3 bombs (one 250-kg SAP went "down the stack", stopping most boilers; dead in the water 14:40 for a while) and 2 Type 91 torpedoes on the port side; on 6 June 2 submarine torpedoes on the starboard side | bomb fires out within an hour; after the torpedoes, a 23° list and abandoned; capsized and sank on the morning of 7 June | three bombs were **not** fatal; three bombs and two aircraft torpedoes left her afloat for two days | US carriers at that moment had no armed aircraft in the hangar and good damage control: the hangar factor about 1. Torpedoes are about half of fatal for a CV | bs-wdr-cv5; wp-USS_Yorktown_(CV-5) |
| Kirishima | kongo | Guadalcanal, 1942-11-15 about 00:00–00:07 | **9** × 16-in and about 40 × 5-in (USSBS; Lee's report: 8) ≠ **about 20** major-calibre and 17 smaller (Lundgren, from Ikeda's sketch). Washington opened at about 5,800 yd. Forward turrets disabled at once; the aft turrets lost hydraulics; steering flooded, rudders jammed 10° starboard; "multiple underwater hits"; forward magazines flooded | capsized to port at 03:25, about 3 h 20 min after | lost | the 16-in AP hits on a battleship-cruiser must pass fatal within 7 minutes (between 9 and 20 hits), with sinking delayed by flooding | cf-kirishima (note 5) |
| South Dakota | south-dakota | Guadalcanal, 14–15 Nov, about 23:53 | "at least 26 projectile hits ... one 5-inch, six 6-inch, eighteen 8-inch and one 14-inch", mostly AP; minor flooding from one hit below and two near the waterline; a ¾° list | — | **survived**: "Neither the strength, buoyancy nor stability were measurably impaired". She lost radars, fire control and communications | the upper bound: 26 medium hits on a modern BB stay well below fatal, but they can disable systems. Model systems damage separately from `fatal` | bs-wdr-bb57; cf-kirishima (17 × 8-in, 5 × 6-in, 1 × 5-in and Kirishima's 14-in hits) |
| Walke, Preston, Benham | sims, mahan, benham | Guadalcanal, 14–15 Nov | Walke and Preston sunk by gunfire and torpedoes from Nagara, Ayanami and destroyers; Benham's bow blown off by a torpedo | Walke and Preston within minutes (*verify* the times); Benham scuttled by Gwin's gunfire the next evening after four Mark 15s failed | lost | a single Type 93 hit is fatal to a US destroyer; gunfire alone can be | cf-kirishima |
| Ayanami | fubuki | Guadalcanal, 14–15 Nov | 5-in hits from Washington and South Dakota | crippled; scuttled by Uranami | lost | — | cf-kirishima |
| Johnston | fletcher | Samar, 1944-10-25 about 07:30 | three heavy shells aft below the waterline plus three 6-in on the bridge and director: classically **Kongō's 14-in**, but **Yamato's 18.1-in and 6.1-in** in Lundgren's reading (≠). Speed cut to 17 kn, power lost to the after guns; restored in a rain squall in about 10 min. Then about 2½ hours of fighting under fire from cruisers and destroyers | sank about 10:10 (*verify*), surrounded | lost, but only after hours | AP shells over-penetrated without bursting. The model needs an over-penetration factor (D4) or the 07:30 hits are fatal at once, which the record says they were not | wp-USS_Johnston_(DD-557) (citing Lundgren, Morison, Hornfischer: *verify*) |
| Hoel | fletcher | Samar, about 07:30–08:40 | Haguro's 8-in AP: 2, then 1, then 3, then 3 hits (9 in all) and one 5-in; "over 40 shell hits" in all; most AP rounds passed through without exploding | listed 20° and was abandoned at 08:40; rolled over 08:55 | lost | about 40 hits including nine 8-in AP to sink an unarmoured destroyer: the over-penetration factor again | wp-USS_Hoel_(DD-533) |
| Samuel B. Roberts | john-c-butler | Samar, 08:51 | cruiser shells, one in a boiler; then heavy shells (battleship fragments were found on the wreck, which the 2022 survey dates to *verify*) | dead in the water and sinking from about 09:00; sank later that morning (*verify*) | lost | — | wp-USS_Samuel_B._Roberts_(DE-413) |
| Gambier Bay | casablanca | Samar, about 08:10–09:07 | first hit about 08:10 by an 18.1-in shell through the flight deck aft (fire out in 3 min); at about 08:20 a hit flooded the forward engine room (US: an 8-in HE; Japanese records: an 18.1-in AP from about 20,000 yd, ≠); 10 kn, dead in the water about 15 min later; more 18.1-in and 6.1-in hits; Noshiro's 6-in at the end | capsized 09:07, sank 09:11 | lost | one flooding hit in a machinery space is the fatal blow to a CVE; the rest is time | wp-USS_Gambier_Bay (citing Lundgren 2014) |
| St. Lo | casablanca | Samar, 1944-10-25 about 10:51 | one kamikaze; "a small bomb ... penetrated to the hangar, detonated above fueled and armed planes"; a gasoline-vapour explosion "in less than a minute", then five torpedo or bomb explosions over 10–15 min and a heavy detonation in the bomb magazine | "capsized and sank in five minutes" after the last explosion; about 30 min in all | lost | the hangar factor again, for CVEs: armed aircraft in the hangar make one small bomb fatal | bs-wdr-cve (Section on hangar hazards, citing Section IV); wp-USS_St._Lo |
| Arizona | pennsylvania | Pearl Harbor, 1941-12-07, last bomb 08:06 | **8 bombs, 1 aircraft torpedo** (BuShips) ≠ about 4 bombs (wp; its note: the preliminary report listed 7 bombs and 1 torpedo). The last bomb hit near Turret II and set off the forward magazines | minutes | "forward portion of ship destroyed in vicinity of No. I and No. II turrets due to bomb hits and magazine explosion"; settled bodily | a magazine detonation is a scripted critical event, not an accumulated-damage result | bs-wds42; wp-USS_Arizona |
| Oklahoma | nevada | Pearl Harbor, from about 07:55 | "struck by about 5 aircraft torpedoes on port side between frames 25 and 120. Three … probably struck below armor belt and two on or above" (BuShips); wp: 3, then 2 more as she capsized; other tellings up to 9 (≠) | capsized within about 12 min (*verify*) | capsized | for a moored old battleship (watertight doors open), five torpedoes are fatal | bs-wds42; wp-USS_Oklahoma_(BB-37) |
| West Virginia | colorado | Pearl Harbor | 7 torpedoes on the port side (four on the belt, the fifth in the rudder, two above the belt when listed) and 2 dud bombs | settled upright after counterflooding | sunk in shallow water, salvaged | seven torpedoes; counterflooding saved her from capsizing | bs-wds42 |
| California | tennessee | Pearl Harbor | 2 torpedoes (port, frames 52 and 101) and 1 bomb (a near miss opened the bow); "sank because of uncontrolled flooding through open manhole covers" | settled over about three days (*verify*) | settled, salvaged | the material condition, not the hits, sank her | bs-wds42 |
| Nevada | nevada | Pearl Harbor | 1 torpedo (port, frame 41) and 5 bombs (3 forward, 2 amidships); "ship sank because of failure of watertight integrity" | beached under way | beached, salvaged | — | bs-wds42 |
| Maryland, Tennessee, Pennsylvania | colorado, tennessee, pennsylvania | Pearl Harbor | 2, 2 and 1 bombs ("converted from 16-in AP projectiles" on Tennessee) | — | repaired | — | bs-wds42 |
| Utah | utah | Pearl Harbor | 2 torpedoes of six launched (one more hit Raleigh) | rolled over at 08:12 | capsized | two torpedoes are fatal to an old, light, open target ship | wp-USS_Utah_(BB-31) |
| Helena, Raleigh, Honolulu | st-louis, omaha, brooklyn | Pearl Harbor | Helena 1 torpedo (starboard, frame 74; forward engine and fire rooms flooded); Raleigh 1 torpedo and 1 bomb (through the ship, detonated under water; "extensive flooding"); Honolulu a near miss (two turrets out from magazine flooding) | — | all repaired | — | bs-wds42 |
| Cassin, Downes, Shaw | mahan | Pearl Harbor, in dock | 3, 1 and 3 bombs; fires; Shaw's forward magazine exploded | — | Cassin and Downes "machinery salvaged, new hull"; Shaw repaired | — | bs-wds42 |
| Yamato | yamato | Ten-Gō, 1945-04-07 | at least 10 torpedoes and 7 or more bombs (TROM sum); "many bombs and 6 torpedoes, 5 on the high side" (TG 58.4) | about 2 h from the first attack to the capsize and explosion | lost | the top end of the scale | r4 §5.3 |

### 4.2 What the table asks of `damage.js`

A proposal for ENGINEERING to tune, not a finding.

- **Split three tracks**: `flooding` (underwater hits: torpedoes, near
  misses, hits below the belt), `fire` (fuel and ordnance; carriers) and
  `systems` (guns, steering, fire control, radar). `fatal` is crossed by
  flooding plus fire. `systems` disables without sinking (South Dakota).
- **Weight a hit by what it carries.** For a torpedo, its warhead (Table
  S5). For a bomb, its weight times a burst factor. For a shell, its weight
  times a penetration factor. Normalise by the kit's size: `disp_std^(2/3)`
  is a reasonable first scale (Kaga 1,146; Kirishima 1,018; Gambier Bay
  410; Johnston 163).
- **Over-penetration** (D4): an AP shell of 8 in or more against a kit with
  `beltMm` under 25 does about a quarter of its nominal damage. Johnston
  survives 07:30 crippled; Hoel goes at about 40 hits; Gambier Bay goes from
  one flooding hit plus time.
- **Hangar state** (D3): a carrier kit carries `hangar: "empty" | "spotted"
  | "armed"`. The record sets it (Midway's Japanese carriers at 10:20:
  armed). A bomb that penetrates an armed hangar multiplies `fire` by 3–4,
  so one 454-kg bomb takes Akagi past fatal and three 250-kg bombs do not
  take Yorktown there.
- **Critical events stay scripted**: magazine detonation (Arizona, Shaw),
  own-torpedo explosion (Suzuya, by near miss; Chōkai, disputed), a rudder
  jam (Kirishima, Akagi, Chikuma). These belong in the record's `events`.
  They fire for the player only through an explicit low-probability rule,
  if at all (designer's choice).
- **Time to sink** (`sinkDelayS`) runs from 1 minute (Arizona) to 20 hours
  (Akagi, scuttled), and is part of the record. For a player-caused loss,
  use the class median from this table.

## 5. Aircraft kits

TAIC No. 1 (1945) is primary for the late Japanese types, as US
intelligence measured them on captured aircraft. It does not cover the
A6M2, D3A1 or B5N1 (out of production by then) and its OCR is rough: where I
could not read a cell, I say so. For US types, no Standard Aircraft
Characteristics sheet was reached (§10). The US rows are Wikipedia
(tertiary) plus NACA (primary) for handling. Rows marked **E** are from
memory and must be checked.

### 5.1 Table A1: dimensions, weights, engine

| id | name | ja | type | nation | crew | span_m | length_m | height_m | empty_kg | loaded_kg | engine | wing_loading_kg_m2 | sources | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a6m2 | Mitsubishi A6M2 Type 0 Model 21 ("Zeke") | 零式艦上戦闘機二一型 | fighter | japan | 1 | 12.0 | 9.06 | 3.05 | 1,680 | 2,410 (*verify*, normal) ≠ 2,796 (the wp infobox gives the same figure for gross and maximum) | radial, Nakajima Sakae 12, 940 hp | 107.4 | wp-Mitsubishi_A6M_Zero | Pearl Harbor, Midway, Guadalcanal |
| a6m5 | Mitsubishi A6M5 Type 0 Model 52 | 零式艦上戦闘機五二型 | fighter | japan | 1 | 11.00 (36.1 ft) | 9.08 (29.8 ft) | 2.80 (9.2 ft) | 1,921 (4,236 lb) | 2,733 (6,026 lb); overload 2,994 | radial, Sakae 31A as printed (*verify*: other sources give Sakae 21), 1,120 hp T.O., 1,210 hp war emergency | 128 | taic-1 leaf n26 (Zeke 52, Mar 1945) | Philippine Sea, Samar CAP |
| a6m3-32 | Mitsubishi A6M3 Model 32 ("Hamp") | 零戦三二型 | fighter | japan | 1 | 11.03 (36.2 ft) | 9.08 | 2.80 | 1,842 (4,060 lb) | 2,563 (5,650 lb) | radial, Sakae 21, 1,115 hp T.O. | — | taic-1 n22 (Dec 1944) | clipped wings; Guadalcanal 1942–43 |
| d3a1 | Aichi D3A1 Type 99 Model 11 ("Val") | 九九式艦上爆撃機一一型 | dive | japan | 2 | 14.37 (*verify*: the wp infobox mixes D3A1 and D3A2 data) | 10.2 | 3.85 | — | — | radial, Kinsei 43 (1,000 hp) or Kinsei 44 (1,070 hp) | — | wp-Aichi_D3A ("746 kW Kinsei 43 or 798 kW Kinsei 44") | Pearl Harbor, Midway (Hiryū's strike on Yorktown). Performance **verify** |
| d3a2 | Aichi D3A2 Model 22 | 九九式艦上爆撃機二二型 | dive | japan | 2 | 14.39 (47.2 ft; OCR unclear) ≠ 14.365 (wp) | 10.79 (35.4 ft) | 3.96 (13 ft) | 2,572 (5,670 lb) | 3,801 (bomber, 8,380 lb) | radial, Kinsei 54, 1,280 hp T.O. (taic) ≠ 1,300 (wp) | 109 | taic-1 n160 (Dec 1944) | — |
| b5n2 | Nakajima B5N2 Type 97 Model 12 ("Kate") | 九七式艦上攻撃機一二型 | torpedo | japan | 3 | 15.51 (50.9 ft) | 10.3 | 4.11 (13.5 ft, taic) ≠ 3.7 (wp) | 2,467 (5,439 lb, taic) ≠ 2,279 (wp) | 3,960 bomber, 4,512 torpedo overload (taic) ≠ 3,800 / 4,100 max (wp) | radial, Sakae 11, 985 hp T.O. (taic) ≠ 1,000 (wp) | 117 (torpedo, taic) ≠ 100.8 (wp) | taic-1 n144 (Dec 1944); wp-Nakajima_B5N | Pearl Harbor (144 B5N2), Midway |
| d4y | Yokosuka D4Y Suisei ("Judy") | 彗星 | dive | japan | 2 | 11.5 | 10.22 | 3.74 | 2,440 | 4,250 | inline V-12, Aichi Atsuta 32, 1,400 hp (that is the D4Y2) | — | wp-Yokosuka_D4Y_Suisei; taic-1 n106–n116 (Judy 11, 12, 33; OCR not read) | Philippine Sea; Leyte |
| b6n2 | Nakajima B6N2 Tenzan Model 12 ("Jill") | 天山一二型 | torpedo | japan | 3 | 14.94 (49 ft) | 11.0 (36.1 ft) | 4.45 (14 ft 7 in) | 3,084 (6,800 lb) | 5,203 (normal, torpedo); 5,650 overload | radial, Mitsubishi Kasei 25, about 1,850 hp T.O. (OCR "1820") | 142 | taic-1 n148 (May 1945) | Philippine Sea on |
| g4m1 | Mitsubishi G4M1 Type 1 Model 11 ("Betty") | 一式陸上攻撃機一一型 | level | japan | 7 | 24.89 | 19.97 | 4.9 | 6,741 | 9,500; maximum 12,860 | 2 × radial, Kasei 11, 1,530 hp | — | wp-Mitsubishi_G4M | land-based; Guadalcanal 1942 |
| g4m2 | Mitsubishi G4M2 Model 22 | 一式陸攻二二型 | level | japan | 5–7 | 24.99 (82 ft) | 19.63 (64 ft 5 in) | 4.75 (15 ft 7 in) | 7,902 (17,420 lb) | 12,506 (27,570 lb); overload 15,010 | 2 × radial, Kasei 21, 1,820 hp T.O. | — | taic-1 n168 | radar; "window" |
| f4f-3 | Grumman F4F-3 Wildcat | — | fighter | usa | 1 | 11.58 (38 ft) | 8.76 (28 ft 9 in) | 3.61 (11 ft 10 in) | 2,226 (4,907 lb) | 3,367 (7,423 lb; high for a -3, *verify*) | radial, P&W R-1830-76, 1,200 hp | 139 (28.5 lb/ft²) | wp-Grumman_F4F_Wildcat ("Specifications (F4F-3)") | Pacific carriers until about May 1942; Marine units at Wake and Midway (*verify*) |
| f4f-4 | Grumman F4F-4 Wildcat | — | fighter | usa | 1 | 11.58 (folding) | 8.76 | 3.6 | about 2,610 **E** | about 3,610 **E** | radial, R-1830-86, 1,200 hp **E** | — | wp (text: heavier, folding wings, six guns, fewer rounds) | Midway CAP; Guadalcanal |
| fm-2 | General Motors FM-2 Wildcat | — | fighter | usa | 1 | 11.58 | 8.8 **E** | 3.5 **E** | about 2,470 **E** | about 3,400 **E** | radial, Wright R-1820-56, 1,350 hp **E** | — | — (**E**; SAC not reached) | Samar (Taffy 3's VC squadrons) |
| f6f-5 | Grumman F6F-5 Hellcat (F6F-3 similar) | — | fighter | usa | 1 | 13.06 (42 ft 10 in) | 10.24 (33 ft 7 in) | 3.99 (13 ft 1 in) | 4,190 (9,238 lb) | 5,714 (12,598 lb); maximum 6,990 | radial, P&W R-2800-10W, 2,200 hp with water injection (F6F-3: R-2800-10, 2,000 hp) | 184 (37.7 lb/ft²) | wp-Grumman_F6F_Hellcat | Philippine Sea |
| f4u-1 | Vought F4U-1 Corsair | — | fighter | usa | 1 | 12.50 (41 ft) | 10.16 **E** | 4.90 **E** | about 4,070 **E** | about 5,460 **E** | radial, R-2800-8, 2,000 hp **E** | — | wp (infobox is the F4U-4: 2,380 hp, 717 km/h) | Solomons 1943 on |
| sbd-3 | Douglas SBD-3 Dauntless | — | dive | usa | 2 | 12.66 (41 ft 6⅜ in) | 10.09 (33 ft 1¼ in) | 3.96 (13 ft, wp) ≠ 4.14 (DATA.md's example) | 2,905 (6,404 lb, SBD-5) | 4,245 (9,359 lb, SBD-5); maximum 4,853 | radial, Wright R-1820-52, 1,000 hp (SBD-3, *verify*) ≠ R-1820-60, 1,200 hp (SBD-5, wp) | 141 (28.8 lb/ft², SBD-5) | wp-Douglas_SBD_Dauntless | Midway |
| tbd-1 | Douglas TBD-1 Devastator | — | torpedo | usa | 3 | 15.24 (50 ft) | 10.67 (35 ft) | 4.57 (15 ft) | 2,540 (5,600 lb) | 4,213 (9,289 lb); maximum 4,624 | radial, P&W R-1830-64, 900 hp | 107 (wing 39.2 m²) | wp-Douglas_TBD_Devastator | Midway |
| tbf-1 | Grumman TBF-1 / TBM-1C Avenger | — | torpedo | usa | 3 | 16.51 (54 ft 2 in) | 12.19 (40 ft) | 5.00 (16 ft 5 in) | — | 7,047 (15,536 lb; which variant, *verify*) | radial, Wright R-2600-8, 1,700 hp (TBF-1) | 155 (wing 45.5 m²) | wp-Grumman_TBF_Avenger | Midway (6 TBF-1 from the island); Samar (TBM-1C of the VC squadrons) |
| sb2c | Curtiss SB2C-4 Helldiver | — | dive | usa | 2 | 15.16 (49 ft 9 in) | 11.18 (36 ft 8 in) | 4.01 (13 ft 2 in) | 4,784 (10,547 lb) | 7,537 (16,616 lb) | radial, Wright R-2600-20, 1,900 hp | — | wp-Curtiss_SB2C_Helldiver | Philippine Sea on (SB2C-1C there; *verify*) |
| p-40b | Curtiss P-40B Warhawk (Tomahawk) | — | fighter | usa | 1 | 11.38 (37 ft 4 in) | 9.68 **E** | 3.23 **E** | about 2,460 **E** | about 3,290 **E** | inline V-12, Allison V-1710-33, 1,040 hp **E** | — | wp (infobox is the P-40E: V-1710-39, 1,240 hp) | Pearl Harbor (Haleʻiwa, Wheeler) |
| p-36a | Curtiss P-36A Hawk | — | fighter | usa | 1 | 11.38 (37 ft 4 in) | 8.69 (28 ft 6 in) | 2.57 (8 ft 5 in) | 2,072 (4,567 lb) | 2,563 (5,650 lb) | radial, P&W R-1830-17, 1,050 hp | 117 (23.9 lb/ft²) | wp-Curtiss_P-36_Hawk | Pearl Harbor |
| pby-5 | Consolidated PBY-5 Catalina | — | patrol | usa | 8 | 31.7 (104 ft) | 19.46 (63 ft 10 in) | 6.43 (21 ft 1 in) | 9,485 (20,910 lb) | maximum 16,067 (35,420 lb) | 2 × radial, R-1830-92, 1,200 hp | 124 (25.3 lb/ft²) | wp-Consolidated_PBY_Catalina | Pearl Harbor (Kāneʻohe), Midway (the sighting) |
| b-17e | Boeing B-17E Flying Fortress | — | bomber | usa | 9–10 | 31.62 (103 ft 9 in) | 22.5 **E** (G: 22.66) | 5.82 | about 14,800 **E** (G: 16,391) | about 24,000 **E** (G: 24,494; maximum 29,700) | 4 × radial, Wright R-1820-65, 1,200 hp **E** (G: R-1820-97) | — | wp-Boeing_B-17_Flying_Fortress (G model) | Midway (from the island) |
| b-29 | Boeing B-29 Superfortress | — | bomber | usa | 11 | 43.05 (141 ft 3 in) | 30.18 (99 ft) | 8.46 (27 ft 9 in) | 33,793 (74,500 lb) | 54,432 (120,000 lb); maximum 60,555 | 4 × radial, Wright R-3350-23, 2,200 hp | 337 (69.1 lb/ft²) | wp-Boeing_B-29_Superfortress | cards only (DESIGN §3.5) |

### 5.2 Table A2: performance

`enduranceS` is sortie time, a design number (DATA.md) not taken from any
source. The column carries a proposal, marked as such.

| id | max_kmh @ alt_m | sea_level_kmh | cruise_kmh | stall_kmh | dive_limit_kmh | climb_ms | ceiling_m | range_km | enduranceS (proposal) | sources |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a6m2 | 533 @ 4,550 | — | 333 | under 111 ("well below 60 kn") | about 630 **E** (the A6M3's "increased" figure is 670) | 15.7; 6,000 m in 7 min 27 s | 10,000 | 1,870 (3,100 with drop tank) | 1,800 | wp-Mitsubishi_A6M_Zero |
| a6m5 | 576 @ 6,706 war emergency; 565 @ 7,041 military ≠ "a maximum speed of only 340 mph [547 km/h] has been obtained in flight tests" (the same page) | 475 (war emergency) | about 319 (75 % Vmax) | — | — | 16.0 at sea level; 17.0 at 2,440 m | 10,700 | 1,931 normal fuel; 2,968 maximum fuel | 1,800 | taic-1 n26 |
| a6m3-32 | 557 @ 6,401 | 457 | 322 (75 %) | — | 670 (wp) | 15.0 | 12,131 | 1,820 normal fuel; 2,310 maximum fuel | 1,800 | taic-1 n22 |
| d3a1 | *verify* (D3A2: 430 @ 6,200 in the wp infobox) | — | 296 @ 3,000 (wp) | — | — | 3,000 m in 5 min 48 s (wp) | 10,500 (wp) | 1,352 (wp) | 1,500 | wp-Aichi_D3A |
| d3a2 | 452 @ 6,187 | 370 | 270 (75 %) | — | — | 11.0 at sea level | 10,241 | 1,553 normal fuel with a 250-kg bomb; 2,543 maximum fuel | 1,500 | taic-1 n160 |
| b5n2 | 375 @ 2,591 war emergency; 367 @ 3,307 normal (taic) ≠ 378 @ 3,600 (wp) | 348 war emergency; 320 normal | 232 (75 %) ≠ 259 @ 3,000 (wp) | — | — | 5.6 at torpedo overload (taic) ≠ 6.5 (wp) | 7,315 (taic) ≠ 8,260 (wp) | 978 (wp) ≠ taic's torpedo-load figure (OCR unclear, *verify*) | 1,500 | taic-1 n144; wp-Nakajima_B5N |
| d4y | 550 (wp) | — | — | — | — | — | 10,700 | 1,465 | 1,500 | wp-Yokosuka_D4Y_Suisei |
| b6n2 | 526 @ 4,602 | 478 | 423 combat; 237 economical | — | — | 18.0 (reconnaissance load) | 10,790 | *verify* (OCR) | 1,500 | taic-1 n148 |
| g4m1 | 428 @ 4,200 | — | 315 @ 3,000 | 120 | — | 9.17 | — | 2,852 (ferry 5,040) | 1,500 | wp-Mitsubishi_G4M |
| g4m2 | 455 @ 4,206 | 414 | 367 combat; 211 economical | — | — | 9.0 | 9,266 | 4,948 maximum fuel | 1,500 | taic-1 n168 |
| f4f-3 | 533 (331 mph; altitude not given) | — | — | — | — | 11.7 | 12,040 | 1,360 | 1,800 | wp-Grumman_F4F_Wildcat |
| f4f-4 | about 512 @ 5,900 **E** | — | — | — | — | about 10 **E** | about 10,400 **E** | about 1,240 **E** | 1,800 | — |
| fm-2 | about 534 @ 8,800 **E** | — | — | — | — | about 15 **E** | about 10,600 **E** | — | 1,800 | — |
| f6f-5 | 629 (391 mph; altitude not given in the infobox) | — | — | 135 (84 mph) | — | 13.2; 6,100 m in 7 min 42 s | 11,369 | — | 1,800 | wp-Grumman_F6F_Hellcat |
| f4u-1 | about 671 @ 6,070 **E** | — | — | — | — | — | — | — | 1,800 | — |
| sbd-3 | 410 @ 4,267 (SBD-5, wp) ≠ 402 @ 4,900 (DATA.md's example) | 365 (DATA.md, unsourced) | 298 | 125 (DATA.md, unsourced) | 560 (DATA.md, unsourced) | 8.6 (SBD-5) ≠ 6.5 (DATA.md) | 7,782 | 1,794 (ferry 2,518) | 1,800 | wp-Douglas_SBD_Dauntless |
| tbd-1 | 331 @ 2,438 | — | 206 (the approach was flown at 100 kn = 185, r4) | — | — | 3.7 | 5,944 | 700 with a torpedo; 1,152 with a 1,000-lb bomb | 1,500 | wp-Douglas_TBD_Devastator; r4 §3.6 |
| tbf-1 | 447 | — | 346 | — | — | 5.5 | 6,888 | 1,456 | 1,500 | wp-Grumman_TBF_Avenger |
| sb2c | 475 @ 5,090 | — | 254 | — | — | 9.1 | 8,870 | — | 1,500 | wp-Curtiss_SB2C_Helldiver |
| p-40b | about 566 @ 4,572 **E** (P-40E: 581 @ 4,572) | — | 496 (P-40E) | — | — | P-40E: 4,572 m in 6 min 15 s | 8,870 (P-40E) | 1,152 (P-40E) | 1,800 | wp-Curtiss_P-40_Warhawk |
| p-36a | 504 (313 mph) | — | 434 | — | — | 17.3 | 9,967 | 1,006 at 434 km/h | 1,800 | wp-Curtiss_P-36_Hawk |
| pby-5 | 315 | — | 201 | — | — | 5.1 | 4,816 | 4,055 | 3,600 | wp-Consolidated_PBY_Catalina |
| b-17e | about 512 @ 7,600 **E** (G: 475 @ 7,620) | — | 293 (G) | — | — | 4.6 (G) | 10,851 (G) | 3,219 with 2,700 kg of bombs (G) | 3,600 | wp-Boeing_B-17_Flying_Fortress |
| b-29 | 574 (357 mph) | — | 354 | 169 (105 mph) | — | 4.6 | 9,708 | 5,229 | — | wp-Boeing_B-29_Superfortress |

### 5.3 Table A3: guns, payload, torpedo

| id | guns (count × calibre, position, rounds per gun) | payload | torpedo | sources |
| --- | --- | --- | --- | --- |
| a6m2 | 2 × 7.7 mm Type 97, cowling, 500 rpg; 2 × 20 mm Type 99-1, wings, 60 rpg | 2 × 60 kg | — | wp-Mitsubishi_A6M_Zero |
| a6m5 | 2 × 7.7 mm cowling; 2 × 20 mm Type 99-2 wings, 100 rpg (wp, *verify* on taic n27) | 2 × 60 kg or 10 × 32 kg (taic) | — | taic-1 n26; wp |
| d3a1, d3a2 | 2 × 7.7 mm Type 97 forward; 1 × 7.7 mm Type 92 flexible, rear | 1 × 250 kg under the fuselage; 2 × 60 kg under the wings | — | wp-Aichi_D3A; taic-1 n160 (D3A2: 1 × 250 kg normal) |
| b5n2 | 1 × 7.7 mm Type 92, rear dorsal, 97-round drums | 1 × 800 kg bomb, or 2 × 250 kg, or 6 × 60 kg | 1 × type-91 (racks offset to the right of the centreline; changing between torpedo and bombs took over 2 hours) | wp-Nakajima_B5N; taic-1 n144 (torpedo 1,760 lb = 800 kg) |
| d4y | 2 × 7.7 mm forward; 1 × 7.92 mm rear (*verify*) | 1 × 500 kg (D4Y2) or 250 kg + 2 × 30 kg (*verify*) | — | wp-Yokosuka_D4Y_Suisei |
| b6n2 | forward and top guns: 1 × 7.7 mm or 1 × 20 mm top gun (taic n149); ventral 7.7 mm (*verify*) | 1 × 800 kg, or 1 × 500 kg, or 2 × 250 kg (taic) | 1 × Type 91 (taic prints "1 × 1475 kg Tor 3250 lb", which cannot be right for a Type 91: *verify*) | taic-1 n148, n149 |
| g4m1 | 1 × 20 mm Type 99 tail; 4 × 7.7 mm (nose, 2 waist, top) | 1 × 800 kg or 4 × 250 kg | 1 × Type 91 Kai-3 (858 kg) | wp-Mitsubishi_G4M |
| g4m2 | (*verify* on taic n169) | 1 × 1,000 kg (taic) | room for two 1,760-lb torpedoes, specification one (taic) | taic-1 n168 |
| f4f-3 | 4 × .50 M2, wings, 450 rpg | 2 × 100 lb | — | wp-Grumman_F4F_Wildcat |
| f4f-4 | 6 × .50 M2, 240 rpg (**E**: wp says only "a reduction in the number of rounds per gun") | 2 × 100 lb | — | wp (text) |
| fm-2 | 4 × .50 M2, 430 rpg **E** | 2 × 250 lb or rockets **E** | — | — |
| f6f-3 / -5 | 6 × .50 M2, 400 rpg (F6F-3, most F6F-5) | up to 4,000 lb (F6F-5); 6 × 5-in HVAR | (centreline: 1 × Mark 13, F6F-5) | wp-Grumman_F6F_Hellcat |
| f4u-1 | 6 × .50, about 400 rpg **E** | — | — | — |
| sbd-3 | 2 × .50 M2 forward (synchronized, cowling); 2 × .30 M1919 flexible, rear (SBD-3: 1 × .30 early, *verify*) | 1 × 1,000-lb (454 kg) on the centreline, or 500-lb plus 2 × 100-lb; total up to 2,250 lb (SBD-5). Midway (Enterprise): 15 with one 1,000-lb; 12 with one 500-lb and two 100-lb; 6 with one 500-lb (r4) | — | wp-Douglas_SBD_Dauntless; r4 §3.1 |
| tbd-1 | 1 × .30 or .50 forward; 1 × .30 rear | 1 × 1,000-lb, or 3 × 500-lb, or 12 × 100-lb | 1 × mk13 (1,935 lb) | wp-Douglas_TBD_Devastator |
| tbf-1 / tbm-1c | 1 × .30 nose (early) or 2 × .50 in the wings (TBF-1C, TBM-1C); 1 × .50 dorsal turret; 1 × .30 ventral | up to 2,000 lb internal (4 × 500-lb) | 1 × mk13, internal bay | wp-Grumman_TBF_Avenger |
| sb2c | 2 × 20 mm wings; 2 × .30 rear | 2,000 lb internal; 500 lb under each wing; 8 × 5-in HVAR | (1 × Mark 13-2 internal, rarely) | wp-Curtiss_SB2C_Helldiver |
| p-40b | 2 × .50 cowling, 4 × .30 wings **E** (P-40E: 6 × .50 wings) | — | — | wp (text) |
| p-36a | 1 × .30 and 1 × .50, cowling | small bombs on some later aircraft | — | wp-Curtiss_P-36_Hawk |
| pby-5 | 3 × .30 (2 bow turret, 1 ventral tunnel); 2 × .50 waist blisters | 4,000 lb of bombs or depth charges; torpedo racks available | (Mark 13, rarely) | wp-Consolidated_PBY_Catalina |
| b-17e | .50 in 8–9 positions (E: tail, ball, top turret, waist; the G's chin turret absent) | about 4,000–8,000 lb internal | — | wp (G model) |
| b-29 | 10–12 × .50 in remote turrets, plus a 20 mm in the tail on early aircraft | 20,000 lb standard | — | wp-Boeing_B-29_Superfortress |

### 5.4 Table A4: handling the sim should honour

`rollDegS` and `turnS` are DATA.md's handling numbers. Only the F4F-3's roll
rate is measured; the rest are proposals (**E**) shaped by the sourced
statements in the note column. IAS is indicated airspeed.

| id | rollDegS | turnS (360°, proposal) | note (sourced) | sources |
| --- | --- | --- | --- | --- |
| a6m2 | 80 below about 300 km/h, falling to about 30 above 370 km/h **E** | 14 **E** (the best of any type here) | controls "very light" at 320 km/h and stiffening above 348 km/h. US test pilot on the Akutan Zero: "the ailerons froze up at speeds above 200 knots so that rolling maneuvers at those speeds were slow and required much force on the control stick. It rolled to the left much easier than to the right. Also, its engine cut out under negative acceleration due to its float-type carburetor". Stall "well below 60 kn"; it "could out-turn any Allied fighter of the time". **≠ the brief's "heavy ailerons above 250 kn"**: the source says 200 kn. A P-40 pilot: "if your speed was up over 275 [mph], you could outroll [a Zero]" | wp-Akutan_Zero; wp-Mitsubishi_A6M_Zero; wp-Curtiss_P-40_Warhawk |
| a6m5 | as a6m2 at low speed, better at high speed **E** | 16 **E** | shorter wings and new ailerons; the A6M3-32's shorter span "led to better roll" and raised the diving speed to 670 km/h, at a cost in turning and range. TAIC managed only 340 mph in tests | wp-Mitsubishi_A6M_Zero; taic-1 n26 |
| f4f-3 | **58** (best, at 306 km/h IAS at 3,050 m, 30-lb stick force) | 20 **E** | pb/2V of 0.07 only between 193 and 257 km/h IAS with 30 lb; 0.054–0.056 at 148 km/h flaps up (below the requirement); 0.066 at 370 km/h with "excessively high stick forces". "The ailerons on the F4F-3 do not approach the performance obtained from those on the P-40"; "too heavy for satisfactory maneuverability at high speeds" | naca-f4f3 |
| f4f-4 | about 50 **E** (heavier than the -3) | 22 **E** | heavier, with folding wings and six guns and no more power: "more sluggish" than the F4F-3 (wp). The **Thach Weave**: when an enemy picks one fighter of a pair, the two turn toward each other and cross, so the pursuer is brought onto the other's guns. First used in combat by Thach's four Wildcats at Midway; at Santa Cruz too. The spacing between the pair is given nowhere I reached as a number (*verify* in Lundstrom) | wp-Grumman_F4F_Wildcat; wp-Thach_Weave |
| fm-2 | about 60 **E** | 18 **E** | lighter and more powerful than the F4F-4 (*verify*) | — |
| f6f-3 / -5 | about 60 at 320 km/h; about 30 at 644 km/h IAS **E** | 18 **E** | NACA: pb/2V stayed below the Navy's 0.08 requirement across the level-flight range. A Navy requirement for a rolling velocity at 400 mph IAS (644 km/h) with a 30-lb stick force was met "when the average of left and right rolls is considered" (the OCR reads the figure both as 30° and as 50°/s). At 161 km/h aileron effectiveness was about 80 % of that at 322 km/h (adverse yaw) | naca-f6f3 |
| f4u-1 | about 70 **E** | 18 **E** | — | — |
| p-40b | about 90 **E** | 22 **E** | NACA used the P-40 as the benchmark of "satisfactorily light and effective" ailerons. "Faster in a dive and possessed an excellent rate of roll"; the P-40 "had a higher dive speed than any Japanese fighter aircraft of the early war years" | naca-f4f3; wp-Curtiss_P-40_Warhawk |
| p-36a | about 70 **E** | 18 **E** | a NACA comparison of P-36 aileron control exists (archive.org `NASA_NTRS_Archive_20150015694`; its text file answered 404) | — |
| sbd-3 | about 45 **E** | 24 **E** | **perforated split dive flaps**, kept "in view of their desirable effectiveness in eliminating tail buffeting with dive flaps open". A 7.5-g pull-out took about 40 lb of stick force with the flaps open and a 1,000-lb bomb. NACA test dives (Oct 1942) at estimated 45°, 60° and 75°, full flaps, rolling held to a minimum. At Midway: VB-3 from 14,500 ft, release "averaged 2,500 feet"; VB-6 and VS-6 from 19,000 ft. Akagi's log saw the dive at "about 50 degrees", bombs "loosed" at about 500 m (≠ the doctrinal 70°, which is *verify*) | naca-sbd1; naca-sbd-dive; r4 §3.6 |
| tbd-1 | about 30 **E** | 30 **E** | "the aerial torpedo could not even be released at speeds above 115 mph" (185 km/h, 100 kn); Mark 13 drops "low and slow – typically 50 feet and 110 knots". At Midway: 100 kn at about 1,500 ft below cloud, down to 150 ft under attack; glide-bombing approach "a mere 200 mph" | wp-Douglas_TBD_Devastator; nw-tus; r4 §3.6 |
| tbf-1 / tbm-1c | about 40 **E** | 26 **E** | by late 1944, with the drag ring and shroud ring, Mark 13 drops at up to 800 ft and 260 kn "by diving to the release point" | wp-Mark_13_torpedo |
| b5n2 | about 40 **E** | 24 **E** | Type 91 release designed at 180 kn from 20 m, up to 204 kn (the B5N's maximum) in a power glide. At Yorktown: "a loose V formation with planes in the formation varying in altitude from 50 to 2000 feet … changed altitude and swerved from side to side", release at about 800 yd | wp-Type_91_torpedo; r4 §3.6 |
| d3a1 | about 50 **E** | 22 **E** | at Yorktown: approach about 12,000 ft, a shallow glide to a position angle of about 60° at 6,000–8,000 ft, then a steep dive, release about 500 ft. At Santa Cruz: 70–80°, release about 800 ft; fixed spatted gear | r4 §3.6 |
| g4m1 | about 25 **E** | 45 **E** | no self-sealing tanks or armour until the late G4M2; "prone to ignition after a few hits". A low `fatal` for this kit | wp-Mitsubishi_G4M |
| pby-5, b-17e, b-29 | 15–20 **E** | 60+ **E** | — | — |

### 5.5 Table A5: shape

Vocabulary as DATA.md (`wing`, `tail`, `canopy`, `gear`, `cowl`, `dihedral`
in degrees). Dihedral values are **E**.

| id | wing | tail | canopy | gear | cowl | dihedral | recognition words |
| --- | --- | --- | --- | --- | --- | --- | --- |
| a6m2 | low, round tips (folding tips on the -21) | single | long-frame (multi-pane greenhouse) | retract | radial (slim) | 6 | the long glazed canopy against the Wildcat's stubby one (DESIGN §5.8) |
| a6m5 | low, shorter span, rounded tips | single | long-frame | retract | radial; individual exhaust stacks | 6 | — |
| d3a1 / d3a2 | low, elliptical | single, with a long dorsal fin-strake | long-frame (2 crew) | **fixed, spatted** | radial | 6 | the fixed spatted gear |
| b5n2 | low, folding | single | long-frame (3 crew) | retract | radial | 6 | the torpedo slung offset to the right |
| d4y | low, small | single | long-frame | retract | **inline** (pointed nose) | 6 | the only Japanese naval combat type with an inline engine besides the Army's Tony (taic-1 n88) |
| b6n2 | low | single, fin raked forward **E** | long-frame | retract | radial (big) | 6 | — |
| g4m1 / g4m2 | mid | single | glazed nose; tail turret | retract | 2 × radial | 5 | a fat "cigar" fuselage ("hamaki") |
| f4f-3 / f4f-4 / fm-2 | mid (shoulder) | single (taller on the FM-2) | short (stubby) | retract into the fuselage sides | radial | 5 | a barrel fuselage; narrow-track gear |
| f6f | low | single | short, raised | retract (rotating aft) | radial (deep cowl) | 7 | — |
| f4u-1 | **inverted gull** | single | long nose, cockpit far aft (framed "birdcage" on the early -1) | retract (rotating aft) | radial | — | the bent wing |
| sbd-3 | low | single | long-frame (2 crew) | retract (into the wing) | radial | 6 | perforated flaps visible on a dive |
| tbd-1 | low | single | long greenhouse (3 crew) | semi-retract (wheels protrude) | radial | 6 | — |
| tbf / tbm | mid | single, large | long; **dorsal ball turret** | retract | radial (big) | 6 | the deep fuselage with an internal bay |
| sb2c | low | single, large | long | retract | radial | 6 | — |
| p-40b | low | single | short | retract (rotating aft) | **inline**, chin radiator | 6 | the chin scoop |
| p-36a | low | single | short | retract (rotating aft) | radial | 6 | — |
| pby-5 | parasol (high), on a pylon | single | bow turret, waist blisters | retractable wingtip floats (boat hull) | 2 × radial | 0 | — |
| b-17e | low | single, big dorsal fin | glazed nose; top, ball and tail turrets | retract | 4 × radial | 4 | — |
| b-29 | mid, long span | single, tall | glazed round nose; remote turrets | retract (tricycle) | 4 × radial | 4 | — |

### 5.6 Table A6: colours and markings by date

The insignia vocabulary is DATA.md's. No primary for the paint orders was
reached (BuAer orders, Navy Air Colors and Japanese paint references are
print only). These rows are the shape of the data plus my best knowledge,
mostly *verify*. The US national-insignia dates are in Table A7 and are
better sourced (tertiary).

| kit(s) | from | to | upper | lower | insignia | other markings | conf | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IJN carrier aircraft (a6m2, d3a1, b5n2) | 1941-12 | 1942-08 (*verify*) | light grey-green ("ameiro"/J3 hai-iro) overall; cowling black-blue | same | hinomaru (no white surround on the grey; some fuselage roundels outlined, *verify*) | carrier tail codes (AI-, AII-, BI-, BII-…) and coloured fuselage bands per carrier (*verify* the colours) | E | wp-Nakajima_B5N ("initially most of the B5N bombers were painted in silver" in China; later schemes not given) |
| IJN aircraft (a6m3-32, a6m5, d3a2, b5n2, d4y, b6n2, g4m) | 1942-09 (*verify*) | 1943 | dark green | light grey (or natural) | hinomaru-white-surround | yellow inboard wing leading edges (identification) from about late 1942 (*verify*) | E | wp-Mitsubishi_G4M (a photograph: "a non-standard roundel – a white square instead of the white circle surrounding the hinomaru") |
| IJN aircraft | 1943–44 (*verify*) | 1945 | dark green | grey or natural | hinomaru (white surrounds painted out) | — | E | — |
| USN carrier aircraft (f4f-3, sbd-3, tbd-1, pby-5) | 1941-10 (*verify*) | 1943-01 | non-specular blue-grey | light grey | star-red-centre until 1942-05-15, then star-no-red | red and white rudder stripes 1941-12-23 to 1942-05-06 (6 white, 7 red from 5 Jan 1942); fuselage and wing insignia | E (colours); wp (insignia dates) | wp-United_States_military_aircraft_national_insignia |
| USN (tbf-1, f4f-4, sbd-3) | 1942-05-15 | 1943-01 | blue-grey | light grey | star-no-red | — | E | as above |
| USN tri-colour (f6f-3, tbf, sbd-5, f4u-1) | 1943-01 (*verify*) | 1944 | semi-gloss sea blue on top; intermediate blue on the sides | insignia white | star-bar-red-outline 1943-06-28 to 1943-08-14, then star-bar-blue | — | E | wp (insignia); wp-Grumman_F6F_Hellcat (caption: "an early F6F-3 in blue-gray over light gull-gray (1943)") |
| USN overall glossy sea blue (f6f-5, f4u, later tbm) | 1944-03 fighters (*verify*); all carrier aircraft from about 1944-10 | 1945 | glossy sea blue overall | same | star-bar-blue; on dark blue the blue outline was dropped (from 1943-07-31 unofficially, official Jan 1945) | — | E (dates); wp (insignia) | wp-United_States_military_aircraft_national_insignia |
| Taffy 3 (fm-2, tbm-1c) | 1944-10-25 | — | tri-colour or glossy sea blue (per squadron, *verify*) | — | star-bar-blue | — | E | — |
| USAAF (p-40b, p-36a, b-17e) | 1941-12-07 | 1942-05-15 | olive drab | neutral grey | star-red-centre (upper left and lower right wing only, from 1941-02-26) | rudder stripes removed from camouflaged aircraft from July 1940 | E (colours); wp (insignia rule) | wp-United_States_military_aircraft_national_insignia |

### 5.7 Table A7: US national insignia, the dates the check enforces

| insignia (DATA.md vocabulary) | from | to | note | source |
| --- | --- | --- | --- | --- |
| star-red-centre | 1919-08-19 | 1942-05-15 | the red disc inside a white star on a blue disc. USAAC (USAAF from 20 June 1941): upper-left and lower-right wing only from 26 Feb 1941. The USN restored all four wing positions on 5 Jan 1942 and took up the single-wing rule on 1 Feb 1943 | wp-United_States_military_aircraft_national_insignia (tertiary; cites Bell, Doll, Archer) |
| star-no-red | 1942-05-15 | 1943-06-28 | red disc removed "to avoid confusion with Japanese Hinomaru"; USN rudder stripes ended 6 May 1942. **Midway (4 June 1942) falls three weeks after the order**: photographs of over-painted centres, *verify* per squadron | same |
| (yellow ring, Torch only) | 1942-10 | 1943 | Atlantic and Mediterranean only, not Pacific | same |
| star-bar-red-outline | 1943-06-28 | 1943-08-14 | white bars added, the whole outlined in insignia red. "Several units in the Pacific refused to paint the red outline but added white bars" | same |
| star-bar-blue | 1943-08-14 (AN-I-9 amendment; field order T.O. 07-1-1 of 24 Sept 1943) | 1947-01-14 | the blue outline; dropped on sea-blue aircraft, unofficially from 31 July 1943 and officially in Jan 1945 | same |
| hinomaru / hinomaru-white-surround | see Table A6 | — | — | E |

## 6. Aerial torpedo envelopes (`torpedo` in the aircraft kit)

| type id | name | weight_kg | warhead_kg | range_m @ kn | dropSpeedKn (maximum) | dropAltM | armRunM | depth and water | failures in the record | sources |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| type-91-m2 | 45 cm Type 91 Mod 2 (1941; Pearl Harbor) | 935 | 205 | 2,000 @ 41–43 | 180 by design; up to 204 (the B5N's maximum) in a power glide | 20 by design | — (*verify*) | anti-roll controller (Aug 1941) and wooden fins: runs no deeper than 20 m, with trained crews keeping the dive to 10 m. "Wooden fins and a softwood breakaway nose cone were added to allow for launching into shallow water at low altitudes". Pearl Harbor's depth: *verify* (R1) | — | wp-Type_91_torpedo (several statements marked "citation needed" there); nw-tjp |
| type-91-m3 | Type 91 Mod 3 (1942; Midway) | 849 | 240 | 2,000 @ 41–43 | as Mod 2 (*verify*) | as Mod 2 | — | — | at Yorktown, two hits of the torpedoes dropped (r4) | nw-tjp; r4 |
| type-91-m3-imp | Type 91 Mod 3 Improved (1943) / Strong (1944) | 849 | 240 | 2,000 (Strong: 1,500) @ 41–43 | 300 (Improved); 350 (Strong) | — | — | — | — | nw-tjp |
| type-91-kai3 | as carried by the G4M (1942) | 858 | — | — | — | — | — | — | — | wp-Mitsubishi_G4M |
| mk13-1942 | 22.4-in Mark 13 Mod 0/1 (Midway; Guadalcanal) | 884 (Mod 0) | 183 TNT (Mod 0) | 5,210 @ 30 (Mod 0) ≠ 5,700 yd at 30 kn ✓ (r4) ≠ 6,300 yd @ 33.5 (wp; later mods) | 110 "typically" (with 50 ft); the TBD could not release above 115 mph (100 kn) | 15 (50 ft) | 180 (200 yd) | needs at least 45 m (150 ft) of water; takes its set depth after 275 m (300 yd); depth settable to 15 m; enters the water at 26–30° when dropped at 150 kn or more | Mod 1, VT-6 exercise July 1941: 1 of 10 ran "hot, straight and normal" (4 sank, 5 erratic). Mid-1943 analysis of 105 drops above 150 kn: 36 % cold, 20 % sank, 20 % poor deflection, 18 % unsatisfactory depth, 2 % surface, **31 % satisfactory**. At Midway VT-8 dropped one known torpedo (Gay's), no hits (r4) | nw-tus; wp-Douglas_TBD_Devastator; r4 |
| mk13-1944 | Mark 13 with nose drag ring ("pickle barrel") and tail shroud ring (fall 1944 on; Ten-Gō) | 1,005 (Mod 10) | 274 TNT / 275 TPX / 272 HBX (Mod 10) | 3,660 @ 33.5 (Mod 10) | authorized 300; recommended maximum 410 | authorized 240 (800 ft); recommended maximum 730 (2,400 ft) | 180 | Caltech's optimum entry angle was 22–32°; the drag ring cut air speed by about 40 % | hot, straight and normal runs "approached 100 percent"; in early 1945 five of six dropped from 1,500–2,100 m ran normally. Friedman's war tally of 40 % hits in 1,287 carrier attacks is "much too high" (NavWeaps) | nw-tus; wp-Mark_13_torpedo |

## 7. Where the sources disagree (collected)

1. **Wartime intelligence against post-war figures.** ONI 41-42 against the
   post-war data for Nagato (32,720 t vs 39,130 t), Kongō (29,300 t vs about
   32,200 t) and Shōkaku (15,000 t "incomplete information"). Its lengths
   are close; its displacements and speeds are low. TAIC No. 1 records its
   own doubt: Zeke 52's charted 358 mph against the "only 340 mph … in
   flight tests". Policy: D1.
2. **FM 30-50 against later data for US ships**: North Carolina 750 ft vs
   728 ft, Yorktown 34 kn vs 32.5 kn, Pennsylvania 32,600 t vs 29,158 LT.
   FM is a 1941 Army recognition manual; prefer the later figures.
3. **The hits that crippled Johnston at 07:30**: Kongō's 14-inch (the
   classic telling; Morison, Hornfischer, *verify*) against Yamato's
   18.1-inch and 6.1-inch (Lundgren, through Wikipedia). Likewise **Gambier
   Bay's** flooding hit: a US 8-inch HE against a Japanese 18.1-inch AP.
4. **Hits on Kirishima**: 9 (USSBS), 8 (Lee) or about 20 (Lundgren).
5. **Arizona's bombs**: 8 (BuShips *Summary*) vs 7 (the preliminary report)
   vs about 4 (Wikipedia's narrative). **Oklahoma's torpedoes**: about 5
   (BuShips; Wikipedia 3 + 2) vs up to 9 in other tellings.
6. **Midway carriers** (from R4): Kaga 4 hits (Nagumo) vs "1 × 1,000 + 3 ×
   500 lb" (TROM) vs "three to five" (Wikipedia). Akagi 1 hit (TROM,
   Wikipedia) vs 3 (Nagumo's Table 3).
7. **Zero's aileron limit**: "above 200 knots" (US test pilot) vs controls
   stiffening above 348 km/h (188 kn) (Wikipedia) vs the brief's 250 kn.
8. **The SBD's dive angle**: about 70° by doctrine (*verify*), 45–75° in the
   NACA trials, "about 50 degrees" as seen from Akagi.
9. **Early Mark 13**: 5,700 yd at 30 kn (NavWeaps, Mod 0) vs 6,300 yd at
   33.5 kn (Wikipedia, later mods). Release: 110 kn at 50 ft (NavWeaps) vs
   115 mph (Wikipedia, TBD).
10. **B5N2**: height 4.11 m (TAIC) vs 3.7 m (Wikipedia); empty 2,467 vs
    2,279 kg; ceiling 7,315 vs 8,260 m. TAIC weighed a captured aircraft;
    Wikipedia follows Francillon.
11. **Casablanca full load**: 10,902 LT (Wikipedia) vs 10,400 tons
    (BuShips). **Light AA**: 4 twin 40 mm (class template) vs 8 single
    (Gambier Bay article).
12. **Sōryū's island**: 0.40–0.45 of length (ONI chart) vs "abreast" the
    forward elevator (Wikipedia), which suggests nearer 0.33.
13. **Yorktown's light AA at Midway**: 4 quad 1.1-in and 24 × 20 mm
    (Wikipedia) vs the ship's own report of the starboard battery alone
    (R4).
14. **DATA.md's own examples** carry numbers without sources (Kaga's full
    load 42,500 t; the SBD-3's 402 km/h at 4,900 m, 365 km/h at sea level,
    125 km/h stall, 560 km/h dive limit, 6.5 m/s climb). Replace them with
    the sourced figures above or mark them *verify*.

## 8. Decisions for the designer

- **D1. Which numbers drive the sim.**
  *Recommendation:* post-war figures (Wikipedia now, print references
  later) for every physical number in the kits. Keep the ONI and TAIC
  figures as `notes` and as a possible card line ("what the US Navy
  believed in 1942").
  *Why:* the manuals are the period's own view and the best silhouettes, but
  their displacements and speeds are wartime guesses, sometimes 20 % low.
- **D2. Accept eyeball block positions for v1.**
  *Recommendation:* yes. Ship the M and Mc rows. Hold every E row (Yamato,
  Agano, Fubuki, Sims, Benham, Nevada, Tennessee, South Dakota, Iowa, Essex,
  Casablanca, John C. Butler, Omaha) until a person measures the downloaded
  plates (FM 30-50 and ONI 222-J pages are listed in §3.7) or a print plan.
  *Why:* ±0.02 of length is a few metres on a destroyer and under a turret
  diameter on a battleship. The recognisable silhouette (a pagoda against a
  tower, the turret count, the funnel count, the island side) is right in
  every M row.
- **D3. A hangar-state factor for carriers.**
  *Recommendation:* add `hangar: "empty" | "spotted" | "armed"` to the
  carrier unit (set by the record) and a fire multiplier of 3–4 for a
  penetrating bomb into an armed hangar.
  *Why:* one bomb sank Akagi and one bomb sank St. Lo; three did not sink
  Yorktown. No single `fatal` scalar reproduces all three.
- **D4. Over-penetration of AP shells.**
  *Recommendation:* an AP shell of 8 in or more against a kit with `beltMm`
  under 25 does about 25 % of its nominal damage, and any shell that floods
  a machinery space slows the ship (a `systems` effect).
  *Why:* Johnston, Hoel and Gambier Bay survived hits that would otherwise
  be instantly fatal, and the record names the cause (AP rounds passing
  through without bursting).
- **D5. Separate `systems` damage from `fatal`.**
  *Recommendation:* three tracks, flooding, fire and systems (§4.2).
  *Why:* South Dakota was blinded and silenced at Guadalcanal without being
  close to sinking. That is the battleship moment's dramatic beat.
- **D6. Torpedo failure rates.**
  *Recommendation:* model the record's rates, dated: Mark 13 in 1942 about
  0.6–0.7 failure (31 % satisfactory in mid-1943 at high-speed drops); Mark
  13 in late 1944 about 0.05; Mark 14 and 15 duds in 1942 (*verify* a rate);
  Type 93 prematures early in 1942 (about a third at the Java Sea). Say so
  on the after-card.
  *Why:* the Devastators' failure at Midway is part of the history, and the
  sortie should not quietly make the weapon better than it was.
- **D7. Camouflage at the dates.**
  *Recommendation:* ship v1 with Table S8's assignments as *verify*, and ask
  a person to check photographs (NHHC, NARA 80-G) for the v1 ships before
  release.
  *Why:* no primary text for SHIPS-2 or the IJN arsenal greys was reachable.
- **D8. Yamato's silhouette.**
  *Recommendation:* get a print plan (Garzke and Dulin; Janusz Skulski's
  *The Battleship Yamato*) through a person and replace the E row. Until
  then, model from the E row.
  *Why:* Samar is a v1 battle and Yamato is its most recognisable ship, but
  no public-domain plate of her was reached.
- **D9. Midway insignia.**
  *Recommendation:* `star-no-red` for every US aircraft at Midway, with a
  card note that the order came on 15 May.
  *Why:* the check enforces dates; the record is three weeks after the
  order.
- **D10. Turning and rudder numbers.**
  *Recommendation:* until sourced, make the tactical diameter a config rule:
  3.0–3.3 × loa for battleships (Nevada 3.0× at 19 kn, Oklahoma 3.2× at 20
  kn), 3.5× for cruisers and carriers, 4× for destroyers. Use a 30-s
  hard-over-to-hard-over rudder for all.
  *Why:* only two turning figures were found; the rule keeps per-kit numbers
  honest (blank) and still gives the sim something plausible.
- **D11. Units.**
  *Recommendation:* metric tonnes everywhere in the kits, converted from
  long tons at 1.016, with the original in `notes`.
  *Why:* the sources mix LT, t and "tons" without saying which. The tables
  above already convert.
- **D12. ONI 41-42's slurs.**
  *Recommendation:* the kits cite ONI 41-42 by leaf for geometry only. No
  page image, caption or quotation from it goes into the app. R8 to
  confirm.
  *Why:* leaf n27 has a racist caricature and slurs. The geometry is
  usable; the text is not.

## 9. Risks

- **Wikipedia is the backbone of the numbers.** The infoboxes cite good
  print sources but mix variants, units and dates (the F4F "-3" gross
  weight, the D3A infobox, Yamato's LT/t). Every kit number should go
  through a print reference before release (§11).
- **OCR errors in TAIC and ONI.** Some TAIC cells were unreadable (B5N2
  length, Jill torpedo weight, several ranges). I left them blank or marked
  them; a person should read the page images.
- **Eyeball measurements** (±0.02) can be mis-read where turrets overlap in
  profile. The ruler crops are kept so anyone can re-check.
- **Camouflage and colours are mostly memory.** Shipping them unchecked
  risks a visible error on the best-known ships (Yorktown, Enterprise, the
  Japanese carriers' deck markings).
- **Over-tuning the damage model to the record**: with scripted hits and
  real hits sharing one model (ENGINEERING §5), constants tuned for Kaga can
  break Kirishima. §4.1 gives both ends for a test suite: South Dakota must
  survive her 26 hits; Kirishima must be lost to 9–20.
- **Tone**: the fatal table is a list of ships where people died. Its
  numbers belong in `damage.js` and on cards as ranges with sources, never
  as a score (BRIEF §2).

## 10. What could not be reached

| host or work | result | what it would unlock |
| --- | --- | --- |
| history.navy.mil (NHHC) | curl TLS error 60 (status 000), as for R2 | DANFS (camouflage measures, AA fits by date), the NHHC photo archive, the Standard Aircraft Characteristics sheets NHHC hosts |
| wwiiaircraftperformance.org | 403 to curl, with both a default and a browser User-Agent | Navy SAC sheets, flight tests (F4F, F6F, F4U, SBD, TBF), the 1942 Zero evaluation reports |
| navweaps.com index pages (`index_us`, `index_japan`) | "One moment, please…" JS challenge, intermittently; the gun pages answered after retries with delays | — (worked around through `WNUS_Main.php`, `WNJAP_Main.php`) |
| shipcamouflage.com | JS challenge, then image-only pages | SHIPS-2 measure definitions and per-ship designs |
| NASA NTRS P-36 aileron report (`NASA_NTRS_Archive_20150015694_djvu.txt`) | 404 | P-36 roll data |
| fischer-tropsch.org USNTMJ index | 404 for the guessed URL | US Naval Technical Mission to Japan ship reports (S-series): post-war Japanese ship data and damage |
| Wikipedia `action=raw` | 429 on the first pass for 11 pages; all fetched on retry with delays | — |
| HyperWar WDR copies | partial: the *Destroyer Report* (WDR 51) is plates and photographs only (Johnston's plate is not legible as text); the *Escort Carriers* report starts at Section IV (Gambier Bay's Section III is missing) | Johnston's and Gambier Bay's hit-by-hit damage |
| SAC sheets on archive.org | not found (only postwar USAF ones) | US aircraft performance from the primary |
| ONI 222-US, *Jane's Fighting Ships* 1942–45, "Japanese Naval Vessels at the End of the War" | not found (as R2) | US late-war silhouettes; post-war Japanese data |
| FM 30-30 (aircraft recognition, 1943) | found on archive.org (`Fm30-30`), not opened for lack of time | US and Japanese aircraft silhouettes in a PD manual |
| ONI 222-J plates n44, n58, n62, n66, n68, n82, n86, n90, n92 and FM 30-50 plates n17, n37, n95, n103, n107, n113, n117, n121, n133, n137, n160 | downloaded, not measured (then deleted to keep downloads small; the URLs are in §3.7) | the E rows of Table S7 |
| combinedfleet.com TROMs for Kaga, Akagi, Sōryū, Hiryū, Chōkai, Chikuma, Suzuya | not opened by R6 (R4 opened the Midway ones) | the Samar cruiser losses hit by hit |

## 11. Still needs a person

- **A library reader with the print references** to replace the tertiary
  numbers: Lacroix and Wells (cruisers), Garzke and Dulin (battleships,
  including Yamato's plans and tactical diameter), Friedman (US
  battleships, carriers, destroyers: dimensions, AA fits by date, turning
  circles), Francillon (Japanese aircraft), Parshall and Tully (carrier
  deck markings and the hangar state at Midway).
- **Someone to measure the downloaded plates** listed in §10 and fill in
  the E rows of Table S7, using `r6-scripts/ruler.py`.
- **A photograph check of camouflage** for the v1 ships on the battle
  dates: Yorktown, Enterprise and Hornet (June 1942); Washington, South
  Dakota, Walke, Benham, Preston and Gwin (Nov 1942); Johnston, Hoel,
  Heermann, Samuel B. Roberts and the six CVEs (Oct 1944); the Japanese
  carriers' deck markings at Midway.
- **A reader of TAIC No. 1's page images** for the cells the OCR lost (B5N2
  length and ranges, Jill's torpedo, Judy 11/12/33, Betty 22's guns).
- **A reader of BuShips WDR 51 plate V** (Johnston) and of the complete
  *Escort Carriers* report (Gambier Bay, Section III), which may need a NARA
  or NHHC copy.
- **A Japanese-language check** of the arsenal greys and carrier
  identification kana (Lengerer, *Model Art* specials).
- **ENGINEERING** to choose the damage-model shape (§4.2, D3–D5) and to turn
  §4.1 into a calibration test.
- **R8** to rule on D12 (ONI 41-42's slurs) and on how the fatal table
  appears on cards.

## 12. Files and URLs

Downloads (small) are under
`research/downloads/R6/`:

- `oni4142.txt`, `oni4142.leaf.txt` (per-leaf text), `oni4142.index.txt`;
  `oni222j.*`; `taic1.*`; `fm3050.*`. Sources:
  `https://archive.org/download/oni-4142/ONI4142_djvu.txt` and `_djvu.xml`;
  `…/ONI222JTheJapaneseNavy/p4013coll8_4661_djvu.*`;
  `…/japanese-aircraft-performance-characteristics-taic-manual/p4013coll8_4531_djvu.*`;
  `…/Fm30-50/Fm30-50_djvu.*`.
- `img/r-*.jpg`, `img/rf-*.jpg`: the ruler crops behind Table S7 (page
  images `https://archive.org/download/<item>/page/n<leaf>_w1200.jpg`, or
  `_w1000` for FM 30-50).
- `wdr/*.txt`: text layers of the BuShips reports from
  `https://www.ibiblio.org/hyperwar/USN/rep/WDR/` (PDFs deleted).
- `naca/*.txt`: NACA reports from `https://archive.org/download/NASA_NTRS_Archive_<id>/…_djvu.txt`.
- `nw/*.txt`: NavWeaps pages from `http://www.navweaps.com/Weapons/<page>.php`
  (the gun list in Table S3).
- `wp/*.wiki` and `wp-infoboxes.txt`: Wikipedia raw wikitext from
  `https://en.wikipedia.org/w/index.php?title=<article>&action=raw`.
- Scripts in `research/r6-scripts/`: `leafsplit.py` (djvu XML to per-leaf
  text), `leaf.py`, `infobox.py`, `nwx.py`, `html2txt.py`, `hullx.py` (hull
  extent from the plan view), `ruler.py` and `fmruler.py` (ruler overlays).
